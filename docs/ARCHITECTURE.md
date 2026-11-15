# RASA CUE – ARCHITECTURAL SPECIFICATION

## 1. High-Level System Architecture

RASA CUE is designed as a **Synchronized Derived-Content Platform**. Its defining architectural rule is:

> **"The original video and original music must always remain completely untouched. Accessibility content is synthesized, edited, and approved as separate time-coded synchronized layers."**

```
                     ┌─────────────────────────────────────────┐
                     │            ARTIST MASTER                │
                     │    (MP4 / MOV High-Definition Video)    │
                     └────────────────────┬────────────────────┘
                                          │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │         EXPRESS BACKEND (Node.js)       │
                     │  - Ingestion & Storage Pipeline         │
                     │  - Mongoose / Resilient Store           │
                     │  - JWT Auth & Ownership Verification    │
                     └────────────────────┬────────────────────┘
                                          │
                   Asynchronous Dispatch  │
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │         FASTAPI AI ENGINE (Python)      │
                     │  1. Whisper (Multilingual Speech)       │
                     │  2. MediaPipe (Pose Landmark Tracking)  │
                     │  3. OpenCV (Scene Boundary Detection)   │
                     │  4. Librosa (Acoustic Beat Analysis)    │
                     │  5. Gemini API (Creative Descriptions)  │
                     └────────────────────┬────────────────────┘
                                          │
                          Proposed Cues   │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE CREATIVE TIMELINE ENGINE                          │
│                                                                             │
│  [Track 1: Captions (Bengali, Hindi, English)]                              │
│  [Track 2: Movement & Mudras (Samputa, Pataka, Chakkars, Tatkar)]           │
│  [Track 3: Scene Lighting & Spatial Focus]                                  │
│  [Track 4: Acoustic Sound Events (Ghungroo Bells, Tabla Theka)]             │
│  [Track 5: Haptic Vibration Patterns (Tactile Pulses)]                      │
│                                                                             │
│                   STATUS: ai_suggested ──> artist_approved                  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                         Artist Approved & Published
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
   │ 1. VISUAL MODE  │       │  2. AUDIO MODE  │       │ 3. HAPTIC MODE  │
   │ Captions,       │       │ Web Speech API  │       │ Web Vibration   │
   │ Mudra subtitles,│       │ Narration,      │       │ API Patterns &  │
   │ Sound pills,    │       │ Voiceover Cadence│       │ Visual Wave     │
   │ High-contrast   │       │ over Music      │       │ Pulser Fallback │
   └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 2. Service Responsibilities

### A. Main Backend (Node.js + Express)
- Port: `5001`
- Handles user identity, JWT verification, and artist profiles.
- Manages video upload via Multer to `uploads/videos/`.
- Issues QR codes dynamically using `qrcode`.
- Maintains single synchronized creative timeline records in MongoDB/MemoryStore.
- Filters unapproved AI suggestions so only artist-approved content is public.

### B. AI Engine (Python 3.9+ + FastAPI)
- Port: `8000`
- Provides asynchronous background job processing.
- Multi-stage pipeline:
  1. Speech recognition & transcription in Bengali, Hindi, and English.
  2. Landmark and pose estimation (MediaPipe).
  3. Video frame extraction and lighting shift detection (OpenCV).
  4. Audio intensity and beat onset estimation (Librosa).
  5. Contextual accessibility description synthesis (Gemini 1.5 API).

### C. Frontend Studio & Audience Console (React + Vite + Tailwind CSS)
- Port: `5173`
- Artist Control Studio: 5-track interactive video editor with live scrub playhead.
- Description style switcher: Literal, Poetic, Minimal.
- Protected Elements manager: Locks cultural meanings against automated alterations.
- Audience Portal: Mobile-first responsive view accessed via QR code with zero required authentication.

---

## 3. Data Flow & Synchronization Strategy

1. **Upload & Preserve:** Artist uploads original performance video. A unique slug is minted (`title-xxxx`).
2. **AI Proposal Generation:** FastAPI microservice processes the video and proposes timestamped cues in five tracks.
3. **Approval Mandate:** Every AI proposal receives the `ai_suggested` tag.
4. **Artist Refinement:** In Artist Control Studio, the artist customizes timing, rewrites text, alters vibration patterns, or rejects inaccurate cues. Approved cues transition to `artist_approved`.
5. **Audience Filtering:** Public endpoints (`/api/public/:slug/*`) strip all unapproved cues. Audience members exclusively experience the artist's verified artistic intentions.
