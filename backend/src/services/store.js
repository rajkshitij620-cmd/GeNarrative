import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Performance } from '../models/Performance.js';
import { CreativeTimeline } from '../models/CreativeTimeline.js';
import { AudienceAnalytics, AudienceFeedback } from '../models/Analytics.js';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../../uploads/local_db.json');

// Built-in memory store with disk persistence for resilient hackathon judging & offline demos
class MemoryStore {
  constructor() {
    this.users = [];
    this.performances = [];
    this.timelines = [];
    this.analytics = [];
    this.feedbacks = [];
    this.seeded = false;
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.performances = data.performances || [];
        this.timelines = data.timelines || [];
        this.analytics = data.analytics || [];
        this.feedbacks = data.feedbacks || [];
      }
    } catch (e) {
      console.warn('[MemoryStore] Could not load local_db.json, starting fresh:', e.message);
    }
  }

  saveToDisk() {
    try {
      const data = {
        users: this.users,
        performances: this.performances,
        timelines: this.timelines,
        analytics: this.analytics,
        feedbacks: this.feedbacks
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[MemoryStore] Could not save to local_db.json:', e.message);
    }
  }

  async initSeed() {
    this.seeded = true;
    return Promise.resolve();
  }

  // Helper finders
  findUserByEmail(email) {
    if (!email) return null;
    const clean = String(email).toLowerCase().trim();
    return this.users.find(u => u.email && u.email.toLowerCase().trim() === clean);
  }

  findUserById(id) {
    return this.users.find(u => String(u._id) === String(id));
  }

  createUser(userData) {
    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date(),
      ...userData
    };
    this.users.push(newUser);
    this.saveToDisk();
    return newUser;
  }

  findPerformancesByArtist(artistId) {
    return this.performances.filter(p => String(p.artistId) === String(artistId));
  }

  findPerformanceById(id) {
    return this.performances.find(p => String(p._id) === String(id));
  }

  findPerformanceBySlug(slug) {
    if (!slug) return null;
    let match = this.performances.find(p => p.slug === slug);
    if (!match && (slug === 'rituranga-spring-dance' || slug === 'demo')) {
      match = this.performances.find(p => p.isPublished) || this.performances[0];
    }
    return match || null;
  }

  createPerformance(perfData) {
    const newPerf = {
      _id: 'perf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...perfData
    };
    this.performances.unshift(newPerf);
    this.saveToDisk();
    return newPerf;
  }

  updatePerformance(id, updates) {
    const index = this.performances.findIndex(p => String(p._id) === String(id));
    if (index === -1) return null;
    this.performances[index] = {
      ...this.performances[index],
      ...updates,
      updatedAt: new Date()
    };
    this.saveToDisk();
    return this.performances[index];
  }

  deletePerformance(id) {
    const initialLen = this.performances.length;
    this.performances = this.performances.filter(p => String(p._id) !== String(id));
    this.timelines = this.timelines.filter(t => String(t.performanceId) !== String(id));
    this.saveToDisk();
    return this.performances.length < initialLen;
  }

  findTimelineByPerformanceId(performanceId) {
    return this.timelines.find(t => String(t.performanceId) === String(performanceId));
  }

  createTimeline(performanceId, timelineData = {}) {
    return this.createOrUpdateTimeline(performanceId, timelineData);
  }

  createOrUpdateTimeline(performanceId, timelineData) {
    let timeline = this.timelines.find(t => String(t.performanceId) === String(performanceId));
    if (timeline) {
      Object.assign(timeline, timelineData, { updatedAt: new Date(), version: (timeline.version || 1) + 1 });
      this.saveToDisk();
      return timeline;
    }
    const newTimeline = {
      _id: 'tl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      performanceId,
      version: 1,
      captions: [],
      movementEvents: [],
      sceneEvents: [],
      soundEvents: [],
      hapticCues: [],
      accessibilityDescriptions: [],
      isApproved: false,
      updatedAt: new Date(),
      ...timelineData
    };
    this.timelines.push(newTimeline);
    this.saveToDisk();
    return newTimeline;
  }

  getAnalyticsBySlug(slug) {
    let item = this.analytics.find(a => a.slug === slug);
    if (!item) {
      const perf = this.findPerformanceBySlug(slug);
      if (!perf) return null;
      item = {
        _id: 'ana_' + Date.now(),
        performanceId: perf._id,
        slug,
        totalViews: 0,
        qrScans: 0,
        visualModeUses: 0,
        audioModeUses: 0,
        hapticModeUses: 0,
        languageSelections: { bengali: 0, hindi: 0, english: 0 },
        lastAccessed: new Date()
      };
      this.analytics.push(item);
    }
    return item;
  }

  recordAnalyticsEvent(slug, eventType, language) {
    const item = this.getAnalyticsBySlug(slug);
    if (!item) return null;
    if (eventType === 'view') item.totalViews += 1;
    if (eventType === 'qr_scan') item.qrScans += 1;
    if (eventType === 'visual') item.visualModeUses += 1;
    if (eventType === 'audio') item.audioModeUses += 1;
    if (eventType === 'haptic') item.hapticModeUses += 1;
    if (language && item.languageSelections[language] !== undefined) {
      item.languageSelections[language] += 1;
    }
    item.lastAccessed = new Date();
    return item;
  }

  addFeedback(feedbackData) {
    const feedback = {
      _id: 'fb_' + Date.now(),
      createdAt: new Date(),
      ...feedbackData
    };
    this.feedbacks.unshift(feedback);
    return feedback;
  }

  getFeedbacksByPerformanceId(performanceId) {
    return this.feedbacks.filter(f => String(f.performanceId) === String(performanceId));
  }

  getAllPerformances() {
    return [...this.performances];
  }

  getPublishedPerformances() {
    return this.performances.filter(p => p.isPublished);
  }

  toggleSavePerformance(userId, performanceId) {
    const user = this.findUserById(userId);
    if (!user) return { saved: false, savedPerformances: [] };
    if (!user.savedPerformances) user.savedPerformances = [];
    const idStr = String(performanceId);
    const index = user.savedPerformances.indexOf(idStr);
    let saved = false;
    if (index > -1) {
      user.savedPerformances.splice(index, 1);
      saved = false;
    } else {
      user.savedPerformances.push(idStr);
      saved = true;
    }
    return { saved, savedPerformances: user.savedPerformances };
  }

  getSavedPerformancesForUser(userId) {
    const user = this.findUserById(userId);
    if (!user || !user.savedPerformances) return [];
    return this.performances.filter(p => user.savedPerformances.includes(String(p._id)));
  }

  recordViewingHistory(userId, historyData) {
    const user = this.findUserById(userId);
    if (!user) return null;
    if (!user.viewingHistory) user.viewingHistory = [];
    const entry = {
      performanceId: historyData.performanceId,
      title: historyData.title,
      slug: historyData.slug,
      thumbnailUrl: historyData.thumbnailUrl,
      artistName: historyData.artistName,
      category: historyData.category,
      watchedAt: new Date(),
      modeUsed: historyData.modeUsed || 'visual'
    };
    user.viewingHistory = user.viewingHistory.filter(h => String(h.performanceId) !== String(historyData.performanceId));
    user.viewingHistory.unshift(entry);
    if (user.viewingHistory.length > 50) user.viewingHistory.pop();
    return user.viewingHistory;
  }

  getViewingHistoryForUser(userId) {
    const user = this.findUserById(userId);
    return user?.viewingHistory || [];
  }

  updateAudiencePreferences(userId, prefs) {
    const user = this.findUserById(userId);
    if (!user) return null;
    user.accessibilityPreferences = {
      ...(user.accessibilityPreferences || {}),
      ...prefs
    };
    return user.accessibilityPreferences;
  }

  getAllUsers() {
    return this.users.map(({ password, ...u }) => u);
  }
}

export const memoryStore = new MemoryStore();
// Initialize seed immediately
memoryStore.initSeed();
