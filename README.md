# 🌸 AR Flower Bloom — Next-Gen Gesture & Procedural Floral System

An augmented reality web application powered by **MediaPipe Hands** and procedural **HTML5 Canvas** graphics. Control blooming flowers, summon butterflies, cast fairy dust, and immerse yourself in real-time flora magic directly through your webcam or manual controls.


---

## ✨ Implemented Features

### 1. 🌷 Multi-Species Procedural Flora
Switch between 5 anatomically inspired procedural flower species on the fly:
* 🌷 **Tulip**: Classic tiered petals with detailed inner pistil and stamens.
* 🌹 **Rose**: Rich, velvety spiral multi-layer rolling petals.
* 🪷 **Lotus**: Sacred radiant pink water lily with golden seed pod receptacle.
* 🌻 **Sunflower**: Dual-layer golden ray florets with Fibonacci phyllotaxis spiral seed disc.
* 🌸 **Sakura**: Delicate Japanese cherry blossom with notched heart petals and crimson stamens.

### 2. ✋ True AR Mode: Palm Blossom vs Ground Rooted
* **🌱 Ground Mode**: Natural botanical stem rising from the ground with organic branches and side blossoms.
* **✋ Palm AR Mode**: Flower anchors directly to the palm of your hand, tracking your hand movement across space!

### 3. 🦋 3D-Flapping Butterflies
* Procedural butterflies with realistic wing-flapping physics and multiple species palettes (Morpho Blue, Monarch Gold, Fairy Magenta, Emerald).
* **Attraction Physics**: Gravitate towards the flower when bloom > 50% and occasionally perch on the petals.
* **Wind Scatter**: Wave your hands quickly to blow breeze that scatters butterflies!

### 4. ✨ Fairy Dust Fingertip Trails & Super-Bloom Fireworks
* Real-time shimmering stardust trails emanating from your index fingertips.
* **Super-Bloom Celebration**: When flower reaches >92% bloom, celebratory petal fireworks burst into the air accompanied by harmonic shimmers!

### 5. 🔔 Procedural Zen Audio Engine (Web Audio API)
* Zero external MP3 downloads (pure synthesized Web Audio).
* Ascending pentatonic wind chimes as bloom unfolds.
* Gentle shutter click effect upon taking photos.
* Toggleable with the sound button (Muted by default to respect browser policies).

### 6. 📸 High-Resolution AR Photo Snapshot & 🪄 Deliberate Hands-Free Signals
* **Click Photo Button**: Instant camera flash and merged high-res snapshot of your webcam feed + canvas flower artwork.
* **🪄 100% Hands-Free Deliberate Photo Signals** (Engineered to prevent accidental photo clicks while growing flowers):
  * 👆 **"L" Sign / Camera Frame (1 or 2 Hands)**: Form an "L" with thumb + index on one hand (or both hands for a full `[ 📷 ]` viewfinder). A glowing cyan AR target lock ring charges `0% → 100%` over 0.8s and snaps!
  * ✌️ **Peace Sign (Hold 0.8s)**: Show a classic ✌️ peace sign. A holographic green HUD locking ring charges `0% → 100%` above your hand.
  * 🖐️ **Open Palm (Show Hand to Snap)**: Flat open hand (5 fingers extended) facing camera for 0.8s — effortless selfie capture!
  * 🫶 **Two-Hand Heart Pose**: Join both hands together touching thumbs and index tips in a heart. Deliberately engineered so normal flower pinching never triggers false snaps!
  * 🎙️ **Voice Command ("Cheese!" / "Photo!" / "Smile!" / "Khicho!")**: Native Web Speech API listens for your voice command so your hands remain completely free.
  * 🌸 **Bloom Pose-Hold (Off by Default)**: Optional auto-capture when pressing palms together in a Namaste 🙏 pose.
  * ⏱️ **Self-Timer Delay (Off / 3s / 5s / 10s)**: Built-in countdown timer with ascending harmonic synth chimes and a holographic circular HUD overlay.
  * ⌨️ **Keyboard Shortcut**: Press **Spacebar** anytime to start photo countdown, or **Escape** to cancel.

### 7. 🎛️ Manual Controls Drawer (Mouse / Touch Fallback)
* If camera permission is unavailable or for testing without webcam:
* Sliders for **Bloom**, **Growth**, and **Wind Force**.
* Drag across canvas with mouse/touch to generate wind gusts.

---

## 🚀 How to Run Locally

1. Open your terminal in this directory:
   ```bash
   npm start
   ```
   *(or simply `node server.js`)*

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Allow camera access when prompted, or click **"Continue with Mouse Controls"**!

---

## 🎮 Hand Gesture & Hands-Free Controls

| Gesture / Signal | Action |
| :--- | :--- |
| **Left Hand Pinch** (Thumb + Index Tip) | Controls **Bloom** (0% to 100%) |
| **Right Hand Pinch** (Thumb + Index Tip) | Controls **Growth** (Stem height & branches) |
| **Wave Hands Horizontally** | Generates **Breeze / Wind** (sways stem & scatters butterflies) |
| **Move Index Fingertip** | Emits magical **Fairy Dust trails** |
| 👆 **"L" Sign / Frame (1 or 2 Hands)** | **"L" Photo Snap**: Make "L" on one hand or camera frame box with both |
| ✌️ **Peace Sign (Hold 0.8s)** | **Peace Photo Snap**: Hold ✌️ steady for 0.8s progress ring to snap |
| 🖐️ **Open Palm (Show Hand)** | **Palm Selfie Snap**: Show open palm (5 fingers open) for 0.8s to snap |
| 🫶 **Two-Hand Heart Pose** | **Heart Photo Snap**: Join both hands together in 🫶 heart shape |
| 🎙️ **Voice Command** ("Cheese" / "Photo" / "Smile") | **Hands-Free Voice Snapshot**: Keep hands free! |
| ⌨️ **Spacebar** | Quick timer photo snap shortcut |
