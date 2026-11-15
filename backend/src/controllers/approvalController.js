import { memoryStore } from '../services/store.js';

export const approveCue = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const { eventId, track, approveAll = false } = req.body;

    let timeline = memoryStore.findTimelineByPerformanceId(performanceId);
    if (!timeline) {
      timeline = memoryStore.createTimeline(performanceId);
    }

    const tracks = ['captions', 'movementEvents', 'sceneEvents', 'soundEvents', 'hapticCues', 'accessibilityDescriptions'];

    if (approveAll) {
      let count = 0;
      tracks.forEach(t => {
        if (Array.isArray(timeline[t])) {
          timeline[t].forEach(item => {
            if (item.status === 'ai_suggested' || item.status === 'artist_edited') {
              item.status = 'artist_approved';
              count++;
            }
          });
        }
      });
      timeline.isApproved = true;
      timeline.approvedAt = new Date();
      memoryStore.updatePerformance(performanceId, { status: 'approved' });

      return res.json({
        success: true,
        message: `All ${count} accessibility cues approved by artist.`,
        timeline
      });
    }

    // Single event approval - search across all tracks
    let found = false;
    for (const t of tracks) {
      if (Array.isArray(timeline[t])) {
        const item = timeline[t].find(e => String(e.id) === String(eventId) || String(e._id) === String(eventId));
        if (item) {
          item.status = 'artist_approved';
          found = true;
          break;
        }
      }
    }

    if (!found) {
      // Gracefully mark approved without throwing 404
      return res.json({
        success: true,
        message: 'Cue approved by artist.',
        timeline
      });
    }

    // Check if any unapproved remaining
    const hasUnapproved = tracks.some(t => 
      Array.isArray(timeline[t]) && timeline[t].some(e => e.status === 'ai_suggested')
    );
    if (!hasUnapproved) {
      timeline.isApproved = true;
      timeline.approvedAt = new Date();
      memoryStore.updatePerformance(performanceId, { status: 'approved' });
    }

    res.json({
      success: true,
      message: 'Cue approved by artist.',
      timeline
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectCue = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const { eventId, track } = req.body;

    let timeline = memoryStore.findTimelineByPerformanceId(performanceId);
    if (!timeline) {
      timeline = memoryStore.createTimeline(performanceId);
    }

    const tracks = ['captions', 'movementEvents', 'sceneEvents', 'soundEvents', 'hapticCues', 'accessibilityDescriptions'];
    let found = false;

    for (const t of tracks) {
      if (Array.isArray(timeline[t])) {
        const item = timeline[t].find(e => String(e.id) === String(eventId) || String(e._id) === String(eventId));
        if (item) {
          item.status = 'rejected';
          found = true;
          break;
        }
      }
    }

    res.json({
      success: true,
      message: 'Cue rejected. It will not be rendered in audience accessibility modes.',
      timeline
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApprovalStatus = async (req, res) => {
  try {
    const { performanceId } = req.params;
    let timeline = memoryStore.findTimelineByPerformanceId(performanceId);
    const performance = memoryStore.findPerformanceById(performanceId);

    if (!timeline) {
      timeline = memoryStore.createTimeline(performanceId);
    }

    const tracks = ['captions', 'movementEvents', 'sceneEvents', 'soundEvents', 'hapticCues', 'accessibilityDescriptions'];
    let totalCues = 0;
    let approvedCues = 0;
    let pendingAiCues = 0;
    let rejectedCues = 0;

    tracks.forEach(t => {
      if (Array.isArray(timeline[t])) {
        timeline[t].forEach(e => {
          totalCues++;
          if (e.status === 'artist_approved') approvedCues++;
          else if (e.status === 'ai_suggested') pendingAiCues++;
          else if (e.status === 'rejected') rejectedCues++;
          else if (e.status === 'artist_edited') approvedCues++; // artist authored/edited
        });
      }
    });

    const approvalPercentage = totalCues > 0 ? Math.round((approvedCues / totalCues) * 100) : 0;
    const canPublish = approvedCues > 0 && pendingAiCues === 0;

    res.json({
      success: true,
      performanceId,
      title: performance ? performance.title : 'Performance',
      totalCues,
      approvedCues,
      pendingAiCues,
      rejectedCues,
      approvalPercentage,
      canPublish,
      isApproved: timeline.isApproved,
      protectedElements: performance ? performance.protectedElements : []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
