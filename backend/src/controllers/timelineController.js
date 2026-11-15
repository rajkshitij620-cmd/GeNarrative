import { memoryStore } from '../services/store.js';

export const getTimeline = async (req, res) => {
  try {
    const { performanceId } = req.params;
    let timeline = memoryStore.findTimelineByPerformanceId(performanceId);
    
    if (!timeline) {
      // Create empty initial timeline
      timeline = memoryStore.createOrUpdateTimeline(performanceId, {
        captions: [],
        movementEvents: [],
        sceneEvents: [],
        soundEvents: [],
        hapticCues: [],
        accessibilityDescriptions: [],
        isApproved: false
      });
    }

    const performance = memoryStore.findPerformanceById(performanceId);

    res.json({
      success: true,
      timeline,
      performance: performance || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTimeline = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const timelineUpdates = req.body;

    const updated = memoryStore.createOrUpdateTimeline(performanceId, {
      ...timelineUpdates,
      lastSavedBy: req.user.id || req.user._id
    });

    res.json({
      success: true,
      message: 'Creative timeline synchronized and saved.',
      timeline: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addTimelineEvent = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const { track, event } = req.body;

    if (!track || !event) {
      return res.status(400).json({ success: false, message: 'Track and event data are required.' });
    }

    const timeline = memoryStore.findTimelineByPerformanceId(performanceId);
    if (!timeline) {
      return res.status(404).json({ success: false, message: 'Timeline not found.' });
    }

    const eventWithId = {
      id: event.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      status: 'artist_edited',
      ...event
    };

    if (!timeline[track]) {
      timeline[track] = [];
    }

    timeline[track].push(eventWithId);
    // Sort track by timestamp or startTime
    timeline[track].sort((a, b) => {
      const timeA = a.startTime !== undefined ? a.startTime : a.timestamp;
      const timeB = b.startTime !== undefined ? b.startTime : b.timestamp;
      return timeA - timeB;
    });

    res.status(201).json({
      success: true,
      message: `Event added to ${track}.`,
      event: eventWithId,
      timeline
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTimelineEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { track, updates } = req.body;

    // Search across all timelines in memoryStore
    for (const tl of memoryStore.timelines) {
      const tracksToSearch = track ? [track] : ['captions', 'movementEvents', 'sceneEvents', 'soundEvents', 'hapticCues', 'accessibilityDescriptions'];
      
      for (const t of tracksToSearch) {
        if (Array.isArray(tl[t])) {
          const idx = tl[t].findIndex(e => String(e.id) === String(eventId));
          if (idx !== -1) {
            tl[t][idx] = { ...tl[t][idx], ...updates, status: updates.status || 'artist_edited' };
            return res.json({
              success: true,
              message: 'Timeline event updated.',
              track: t,
              event: tl[t][idx]
            });
          }
        }
      }
    }

    res.status(404).json({ success: false, message: 'Event not found in any timeline track.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTimelineEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    for (const tl of memoryStore.timelines) {
      const tracks = ['captions', 'movementEvents', 'sceneEvents', 'soundEvents', 'hapticCues', 'accessibilityDescriptions'];
      for (const t of tracks) {
        if (Array.isArray(tl[t])) {
          const initialLen = tl[t].length;
          tl[t] = tl[t].filter(e => String(e.id) !== String(eventId));
          if (tl[t].length < initialLen) {
            return res.json({ success: true, message: 'Event removed from creative timeline.' });
          }
        }
      }
    }

    res.status(404).json({ success: false, message: 'Event not found.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
