# RASA CUE – REST API SPECIFICATION

Base URL: `http://localhost:5001/api`

---

## 1. Authentication & User Management

### `POST /auth/register`
Create a new artist account.
- **Body:** `{ name, email, password, role, bio, culturalSpecialty }`
- **Response:** `{ success, token, user }`

### `POST /auth/login`
Authenticate artist or admin.
- **Body:** `{ email, password }`
- **Response:** `{ success, token, user }`

### `GET /auth/me`
Retrieve currently authenticated session user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, user }`

### `PUT /artist/profile`
Update artist profile and cultural credentials.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, bio, culturalSpecialty, avatar }`
- **Response:** `{ success, user }`

---

## 2. Performances

### `GET /performances`
List performances owned by the artist (or all if admin).
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, count, performances }`

### `GET /performances/:id`
Get full performance record by ID.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, performance }`

### `POST /performances`
Upload video master and create new performance record.
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body:** `title`, `description`, `category`, `originalLanguage`, `supportedLanguages`, `video` (file), `thumbnail` (file), `tags`, `duration`
- **Response:** `{ success, performance }`

### `PUT /performances/:id`
Update performance metadata or protected elements.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ title, description, protectedElements, ... }`
- **Response:** `{ success, performance }`

### `DELETE /performances/:id`
Remove performance and its synchronized creative timeline.
- **Headers:** `Authorization: Bearer <token>`

---

## 3. AI Performance Understanding

### `POST /ai/analyze/:id`
Trigger asynchronous multimodal AI pipeline on uploaded performance.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, jobId, performanceId, engine, message }`

### `GET /ai/status/:id`
Poll real-time processing progress and active pipeline stage.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, performanceId, status, progress, stage }`

### `GET /ai/results/:id`
Retrieve raw AI analysis output.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, timeline }`

---

## 4. Creative Timeline Engine

### `GET /timeline/:performanceId`
Fetch complete 5-track synchronized creative timeline.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, timeline, performance }`

### `PUT /timeline/:performanceId`
Update complete creative timeline (autosave / bulk edits).
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ captions, movementEvents, sceneEvents, soundEvents, hapticCues, accessibilityDescriptions }`

### `POST /timeline/:performanceId/events`
Append a custom cue to a specific track.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ track, event }`

### `PUT /timeline/events/:eventId`
Update a specific cue's timestamp, text, description style, or vibration pattern.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ track, updates }`

### `DELETE /timeline/events/:eventId`
Delete an event cue.
- **Headers:** `Authorization: Bearer <token>`

---

## 5. Artist Approval & Publishing

### `POST /approval/:performanceId/approve`
Approve a single cue or batch-approve all AI proposals.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ eventId, track, approveAll: boolean }`

### `POST /approval/:performanceId/reject`
Reject an AI cue so it is excluded from public audience views.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ eventId, track }`

### `GET /approval/:performanceId/status`
Check approval metrics (% approved, remaining AI suggestions).
- **Headers:** `Authorization: Bearer <token>`

### `POST /publish/:performanceId`
Publish approved performance and generate live audience QR distribution.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, performance, publicUrl, qrCodeDataUrl }`

### `POST /publish/unpublish/:performanceId`
Revert performance to draft mode.
- **Headers:** `Authorization: Bearer <token>`

---

## 6. Audience Accessibility (No Login Needed)

### `GET /public/:slug`
Public metadata and approved timeline for audience portal.
- **Response:** `{ success, performance, timeline }`

### `GET /public/:slug/visual`
Filtered cues for Visual Mode (captions, movement indicators, sound pills).

### `GET /public/:slug/audio`
Filtered cues for Audio Mode (spoken descriptive voiceover tracks).

### `GET /public/:slug/haptic`
Filtered cues for Haptic Mode (tactile vibration patterns).

### `POST /public/:slug/analytics`
Log audience view or mode activation event.

### `POST /public/:slug/feedback`
Submit audience accessibility rating and comments.
- **Body:** `{ captionClarity, audioQuality, hapticUtility, overallRating, comment }`

---

## 7. QR Distribution

### `GET /qr/:performanceId`
Retrieve dynamically rendered QR code image data and public URL.
- **Response:** `{ success, performanceId, slug, publicUrl, qrDataUrl }`

---

## 8. Admin Moderation

### `GET /admin/dashboard`
Aggregated platform metrics, total artists, stage works, and sensory telemetry.
- **Headers:** `Authorization: Bearer <token>` (Admin required)

### `GET /admin/artists`
Artist directory with publication counts.

### `GET /admin/performances`
All performances across all artists.
