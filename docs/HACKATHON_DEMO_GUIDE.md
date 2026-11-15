# RASA CUE – HACKATHON LIVE DEMONSTRATION SCRIPT

This guide provides an exact, step-by-step walkthrough to demonstrate all capabilities of RASA CUE for hackathon judges and evaluators.

---

## Benchmark Performance
- **Title:** *"Rituranga: Season of Joy (Bengali Classical & Folk Fusion)"*
- **Performer / Choreographer:** Ananya Sengupta
- **Duration:** 60.0 Seconds
- **Artistic Highlights:** Samputa & Mayura mudras, Tatkar footwork, Ghungroo metallic chiming, Teental Tabla rhythm, and triple Chakkars (Kathak pirouettes).

---

## 15-Step Master Demonstration Walkthrough

### STEP 1: Artist Login
1. Open the landing page at `http://localhost:5173`.
2. Click **⚡ 1-Click Demo Login** in the top navigation bar.
3. Select **Login as Artist (Ananya)**.
4. The system logs in and opens `/artist/dashboard`.

### STEP 2: Ingest a 60-Second Performance
1. Click **Create Accessible Performance** or navigate to `/artist/upload`.
2. Notice the form fields: Title, Category (*Dance*), Language (*Bengali*), and Output Languages (*Hindi, English*).
3. If you have an MP4/MOV file, drop it into the upload zone; otherwise, leave blank to use the built-in classical video master.
4. Click **Upload & Begin AI Analysis**.

### STEP 3: Asynchronous AI Pipeline
1. The app navigates to `/artist/analysis/:id`.
2. Observe the multi-stage progress tracker:
   - **Whisper:** Extracting Bengali bol recitation and singing.
   - **MediaPipe:** Estimating 33 pose landmarks, tracking footwork speed and mudras.
   - **OpenCV:** Detecting amber lighting transitions and spatial stage centering.
   - **Librosa:** Mapping rhythm intensity, Ghungroo chimes, and Tabla beats.
   - **Gemini API:** Proposing contextual descriptions in Literal, Poetic, and Minimal styles.
3. Once progress reaches 100%, the green button **Open Artist Control Studio to Review & Approve** illuminates.

### STEP 4: AI Proposes Accessibility Cues
1. Click the button to enter the **Artist Control Studio** (`/artist/studio/:id`).
2. Notice the left sidebar displaying proposed cues marked with the amber badge `AI Proposed`.
3. Notice that all 5 synchronized tracks are populated across the timeline ruler at the bottom.

### STEP 5: Artist Control Studio (The Flagship USP)
1. Scrub the timeline playhead to `00:24.0s`.
2. Observe the video player synchronized to the Tatkar footwork moment.
3. Click the cue marker at `24.0s` on Track 2 (Movement).
4. The **Cue Inspector** opens on the right sidebar.

### STEP 6: Artist Edits and Approves Descriptions
1. In the Cue Inspector, switch the **Description Style** from *Literal* to *Poetic*.
2. Review the multilingual translations:
   - Bengali: *নূপুরের দ্রুত ঝংকারে তবলা ও পদাবলীর নিপুণ সমন্বয় ঘটছে।*
   - Hindi: *पैरों के तीव्र थाप पर घुंघरू और तबले का तीव्र सामंजस्य हो रहा है।*
   - English: *Crisp rhythmic footwork creates a rapid unison between ankle bells and percussion.*
3. Click **Approve Cue**. Notice the badge changes to a green checkmark `Approved`.
4. Click **Approve All Proposals** at the top to approve the remaining cues.

### STEP 7: Protect Cultural Meanings
1. In the right sidebar, scroll to **Elements AI Must Never Alter**.
2. Notice the locked cultural declaration:
   *"The triple Chakkars (pirouettes) strictly symbolize the cyclical rhythm of Bengali seasonal change (Ritu Chakra)."*
3. Type a new intention: *"Final Namaskar symbolizes reverence to Mother Earth."* and click **Lock Cultural Intention**.

### STEP 8: Configure & Test Haptic Patterns
1. In the left cues list, click the haptic cue at `38.0s` (*Triple Chakkars Whirlwind*).
2. Look at the vibration pattern: `[120, 40, 140, 40, 180, 40, 250]`.
3. Click **Test Vibration** to feel the acceleration pulse.

### STEP 9: Preview All Three Audience Modes
1. Click **Preview Visual** in the top action bar: observe the high-contrast Bengali subtitles and `[Ghungroo crescendo]` sound pill.
2. Click **Preview Audio**: click **Play Audio Description Narration** to listen to the descriptive narration via Web Speech API.
3. Click **Preview Haptic**: observe the tactile vibration simulation pulse.

### STEP 10: Publish the Performance
1. Click the prominent purple button **Publish & Generate QR**.
2. The system verifies that approved cues exist, updates the state to `Published`, and displays the **Performance Published Live** modal.

### STEP 11: Real QR Code Generation
1. The modal renders a high-contrast QR code pointing to `http://<your-ip>:5173/experience/rituranga-spring-dance`.
2. Click **Download QR** to save the PNG image.

### STEP 12: Second Smartphone Audience Scanning
1. Open camera on a physical smartphone (or open the public link in an incognito window without logging in).
2. Scan the QR code.
3. The **Audience Accessibility Portal** opens with zero required login.

### STEP 13: Audience Opens Visual Mode
1. On the smartphone, tap **Visual Mode**.
2. Press Play.
3. As the dancer begins, synchronized captions appear in the chosen language. Tap **বাংলা** to see authentic Bengali subtitles.
4. Tap **A+** to enlarge font size for low-vision readability.

### STEP 14: Audience Listens to Audio Mode
1. Return to the hub and tap **Audio Mode**.
2. Press Play.
3. The original flute and tabla play, while at `00:03s` the descriptive voiceover announces:
   *"The dancer lowers into a graceful posture, unfolding her palms like the first buds of spring."*
4. Adjust the narration volume slider independently.

### STEP 15: Audience Tests Haptic Mode
1. Tap **Haptic Mode**.
2. Press Play.
3. On supported Android devices, the phone physically pulses to the Tatkar foot stamps.
4. On iOS Safari (where Apple blocks Web Vibration), the **Tactile Pulse Visualizer** displays pulsing concentric soundwaves in exact synchronization.
5. Submit 5-star audience accessibility feedback at the bottom.

---

## Demonstration Verdict
**One Original Performance. One Creative Timeline. Four Accessible Perspectives. The Original Art Always Remains Untouched.**
