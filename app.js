/* ==========================================================================
   AR BLOOM — Real-Time Hand Gesture & Procedural Flora System
   Features:
   - Procedural Flowers: Tulip, Rose, Lotus, Sunflower, Sakura
   - Multi-Mode Anchoring: Ground Rooted vs Palm AR (Hand Attached)
   - Interactive 3D Flapping Butterflies with Flora Attraction & Wind Scatter
   - Web Audio Procedural Zen Chimes, Breeze & Shimmer Synthesizer
   - Fairy Dust Trails from Index Fingertips & Super-Bloom Celebration Burst
   - Snapshot Photo Capture with High-Res Frame Merge
   - Mouse & Slider Fallback Controls
   ========================================================================== */

// ==========================================================================
// 1. ORGANIC NOISE — Multi-Frequency Wave Generator for Natural Plant Physics
// ==========================================================================
class OrganicNoise {
    constructor() {
        this.seeds = Array.from({ length: 12 }, () => Math.random() * 1000);
    }

    get(t, channel = 0) {
        const s = this.seeds[channel % this.seeds.length];
        return (
            Math.sin(t * 0.7 + s) * 0.4 +
            Math.sin(t * 1.3 + s * 1.7) * 0.3 +
            Math.sin(t * 2.1 + s * 0.3) * 0.2 +
            Math.sin(t * 3.7 + s * 2.1) * 0.1
        );
    }
}

// ==========================================================================
// 2. PROCEDURAL SOUND SYNTHESIZER (Pure Web Audio API — Zero Dependencies)
// ==========================================================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = false;
        // Pentatonic frequencies (Zen & Celestial Wind Chimes)
        this.notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
        this.lastNoteTime = 0;
        this.prevBloomBracket = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.init();
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playChime(noteIndex = 0, volume = 0.25) {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        if (now - this.lastNoteTime < 0.12) return; // Prevent audio overload
        this.lastNoteTime = now;

        const freq = this.notes[noteIndex % this.notes.length];

        // Primary bell tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Harmonic overtone for metallic sparkle
        const overtone = this.ctx.createOscillator();
        const overGain = this.ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2.76, now);

        // Exponential decay envelope
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        overGain.gain.setValueAtTime(volume * 0.35, now);
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gain);
        overtone.connect(overGain);
        gain.connect(this.ctx.destination);
        overGain.connect(this.ctx.destination);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + 1.9);
        overtone.stop(now + 0.9);
    }

    playShimmer() {
        if (!this.enabled || !this.ctx) return;
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.playChime(4 + i, 0.2);
            }, i * 90);
        }
    }

    playCameraShutter() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    playCountdownBeep(num = 3) {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Harmonious ascending frequencies: 3 -> 523.25Hz (C5), 2 -> 659.25Hz (E5), 1 -> 783.99Hz (G5), 0 -> 1046.5Hz (C6)
        const freqs = { 3: 523.25, 2: 659.25, 1: 783.99, 0: 1046.5 };
        const freq = freqs[num] || 587.33;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.29);
    }

    updateBloomSound(bloom) {
        if (!this.enabled) return;
        const currentBracket = Math.floor(bloom * 8);
        if (currentBracket !== this.prevBloomBracket) {
            this.playChime(currentBracket, 0.22);
            this.prevBloomBracket = currentBracket;
        }
    }
}

// ==========================================================================
// 3. FLOATING POLLEN PARTICLES
// ==========================================================================
class Particle {
    constructor(cw, ch) {
        this.cw = cw;
        this.ch = ch;
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * this.cw;
        this.y = initial ? Math.random() * this.ch : this.ch + Math.random() * 40;
        this.radius = Math.random() * 2.2 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -(Math.random() * 0.55 + 0.15);
        this.life = Math.random() * 320 + 160;
        this.maxLife = this.life;
        this.hue = 330 + Math.random() * 50;
        this.brightness = 75 + Math.random() * 20;
        this.flickerPhase = Math.random() * Math.PI * 2;
    }

    update(windForce, dt) {
        this.x += this.vx + windForce * 1.8;
        this.y += this.vy;
        this.life -= dt;
        if (this.life <= 0 || this.y < -20 || this.x < -30 || this.x > this.cw + 30) {
            this.reset();
        }
    }

    draw(ctx) {
        const t = this.life / this.maxLife;
        const flicker = 0.5 + 0.5 * Math.sin(this.life * 0.08 + this.flickerPhase);
        const alpha = t * 0.75 * flicker;
        if (alpha < 0.02) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${this.hue}, 100%, ${this.brightness}%, 0.8)`;
        ctx.fillStyle = `hsla(${this.hue}, 90%, ${this.brightness}%, 1)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ==========================================================================
// 4. FAIRY DUST PARTICLES (Fingertip Trails)
// ==========================================================================
class FairyDust {
    constructor(x, y, hue = 320) {
        this.x = x + (Math.random() - 0.5) * 8;
        this.y = y + (Math.random() - 0.5) * 8;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -(Math.random() * 1.8 + 0.5);
        this.radius = Math.random() * 2.8 + 1.0;
        this.life = Math.random() * 45 + 30;
        this.maxLife = this.life;
        this.hue = hue + (Math.random() - 0.5) * 40;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= dt;
    }

    draw(ctx) {
        const progress = this.life / this.maxLife;
        if (progress <= 0) return;

        ctx.save();
        ctx.globalAlpha = progress;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 75%, 0.9)`;
        ctx.fillStyle = `hsla(${this.hue}, 95%, 85%, 1)`;

        ctx.beginPath();
        // Twinkling 4-point star
        const s = this.radius * progress * 1.5;
        ctx.moveTo(this.x, this.y - s);
        ctx.lineTo(this.x + s * 0.3, this.y);
        ctx.lineTo(this.x + s, this.y);
        ctx.lineTo(this.x + s * 0.3, this.y + s * 0.3);
        ctx.lineTo(this.x, this.y + s);
        ctx.lineTo(this.x - s * 0.3, this.y + s * 0.3);
        ctx.lineTo(this.x - s, this.y);
        ctx.lineTo(this.x - s * 0.3, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// ==========================================================================
// 5. CELEBRATION SUPER-BLOOM BURST PARTICLES
// ==========================================================================
class BurstPetal {
    constructor(cx, cy, hue = 345) {
        this.x = cx;
        this.y = cy;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5.5 + 2.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 1.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.15;
        this.scale = Math.random() * 0.8 + 0.6;
        this.life = Math.random() * 70 + 50;
        this.maxLife = this.life;
        this.hue = hue + (Math.random() - 0.5) * 30;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08 * dt; // Gentle gravity
        this.vx *= 0.97;
        this.rotation += this.rotSpeed * dt;
        this.life -= dt;
    }

    draw(ctx) {
        const progress = this.life / this.maxLife;
        if (progress <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale * progress, this.scale * progress);
        ctx.globalAlpha = Math.min(1, progress * 1.5);
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 95%, 70%, 0.8)`;
        ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, 0.9)`;

        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.quadraticCurveTo(8, -6, 6, 8);
        ctx.quadraticCurveTo(0, 14, -6, 8);
        ctx.quadraticCurveTo(-8, -6, 0, -12);
        ctx.fill();
        ctx.restore();
    }
}

// ==========================================================================
// 6. PROCEDURAL REALISTIC BUTTERFLIES & HONEY BEES
// ==========================================================================

class RealisticButterfly {
    constructor(cw, ch, type = 0) {
        this.cw = cw;
        this.ch = ch;
        this.id = type;
        this.x = Math.random() * cw;
        this.y = Math.random() * ch * 0.65;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.targetX = this.x;
        this.targetY = this.y;

        // Wing beat & flight physics
        this.wingPhase = Math.random() * Math.PI * 2;
        this.wingSpeed = 15 + Math.random() * 3;
        this.size = 24 + Math.random() * 5;
        this.angle = 0;
        this.flutterSeed = Math.random() * 1000 + type * 320;

        // Dedicated petal perching positions for each butterfly:
        // Butterfly 0: Left side petal
        // Butterfly 1: Right side petal
        // Butterfly 2: Top / Center petal
        const petalSpots = [
            { x: -30, y: -22, restingAngle: -0.28 },
            { x: 32, y: -20, restingAngle: 0.28 },
            { x: 0, y: -38, restingAngle: 0 }
        ];
        this.petalSpot = petalSpots[type % petalSpots.length];

        // True Natural Species Palettes
        const speciesList = [
            {
                name: 'Monarch',
                innerGrad: ['#ffb703', '#fb8500', '#d90429'],
                border: '#0d0705',
                veinColor: 'rgba(20, 10, 5, 0.95)',
                dots: '#ffffff',
                glow: 'rgba(251, 133, 0, 0.45)',
                bodyColor: '#160d08'
            },
            {
                name: 'Blue Morpho',
                innerGrad: ['#bbf2f6', '#00b4d8', '#0077b6'],
                border: '#020b14',
                veinColor: 'rgba(5, 20, 45, 0.95)',
                dots: '#e0faff',
                glow: 'rgba(0, 180, 216, 0.55)',
                bodyColor: '#07111c'
            },
            {
                name: 'Emerald Swallowtail',
                innerGrad: ['#c7f9cc', '#57cc99', '#22577a'],
                border: '#02160d',
                veinColor: 'rgba(2, 35, 18, 0.95)',
                dots: '#d8f3dc',
                glow: 'rgba(87, 204, 153, 0.5)',
                bodyColor: '#05180f'
            },
            {
                name: 'Sakura Silk',
                innerGrad: ['#fff0f3', '#ff758f', '#c9184a'],
                border: '#1a040d',
                veinColor: 'rgba(45, 10, 25, 0.92)',
                dots: '#fff5f7',
                glow: 'rgba(255, 117, 143, 0.5)',
                bodyColor: '#1b0510'
            }
        ];
        this.spec = speciesList[type % speciesList.length];
        this.isPerched = false;
        this.dustCooldown = 0;
    }

    update(cw, ch, flowerPos, bloom, windForce, dt, fairyDusts) {
        this.cw = cw;
        this.ch = ch;
        this.wingPhase += this.wingSpeed * 0.016 * dt;

        // 1. FLOWER BLOOMING (bloom >= 0.5): FLY TO PETALS & PERCH!
        if (bloom >= 0.5 && flowerPos) {
            const petalTargetX = flowerPos.x + this.petalSpot.x;
            const petalTargetY = flowerPos.y + this.petalSpot.y;
            const dist = Math.hypot(petalTargetX - this.x, petalTargetY - this.y);

            if (this.isPerched) {
                // Stay locked to the swaying petal
                this.x = petalTargetX;
                this.y = petalTargetY;
                this.angle = this.petalSpot.restingAngle;
                // Wing speeds slows to gentle resting breath
                this.wingSpeed = 3.5;
                return;
            } else {
                // Fly smoothly towards petal
                this.targetX = petalTargetX;
                this.targetY = petalTargetY;
                this.wingSpeed = 16;

                // Land on petal when close
                if (dist < 18) {
                    this.isPerched = true;
                    this.x = petalTargetX;
                    this.y = petalTargetY;
                    this.vx = 0;
                    this.vy = 0;
                    return;
                }
            }
        } else {
            // 2. FLOWER CLOSING / SHRINKING (bloom < 0.45): SCATTER & FLY AWAY IDHAR-UDHAR!
            if (this.isPerched) {
                this.isPerched = false;
                this.wingSpeed = 16 + Math.random() * 3;

                // Unique burst escape trajectory for each butterfly in different directions!
                const scatterAngles = [-2.4, -0.7, 1.9]; // Left-up, Right-up, Down-right
                const sAngle = scatterAngles[this.id % scatterAngles.length] + (Math.random() - 0.5) * 0.4;
                const burstSpeed = 6 + Math.random() * 3;
                this.vx = Math.cos(sAngle) * burstSpeed;
                this.vy = Math.sin(sAngle) * burstSpeed;

                // Independent wander target across screen
                this.targetX = Math.random() * cw * 0.8 + cw * 0.1;
                this.targetY = Math.random() * ch * 0.55 + ch * 0.08;
            }

            // Normal independent wandering when flower is closed
            if (Math.random() < 0.012) {
                this.targetX = Math.random() * cw * 0.8 + cw * 0.1;
                this.targetY = Math.random() * ch * 0.55 + ch * 0.08;
            }
        }

        // 3. FLIGHT MOVEMENT & NATURAL STEERING
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx += dx * 0.0035 * dt;
        this.vy += dy * 0.0035 * dt;

        // Individual flutter turbulence (different for each butterfly so they don't sync)
        this.vx += Math.sin(Date.now() * 0.0035 + this.flutterSeed) * 0.4;
        this.vy += Math.cos(Date.now() * 0.0035 + this.flutterSeed) * 0.35;

        // Soft natural breeze drift
        this.vx += windForce * 0.35;

        // Damping
        this.vx *= 0.92;
        this.vy *= 0.92;

        const liftBob = Math.sin(this.wingPhase) * 2.0;
        this.x += this.vx * dt;
        this.y += (this.vy + liftBob) * dt;

        // Orientation angle smoothly tracks velocity
        if (Math.hypot(this.vx, this.vy) > 0.15) {
            const targetA = Math.atan2(this.vy, this.vx) + Math.PI / 2;
            this.angle += (targetA - this.angle) * 0.14 * dt;
        }

        // Emit subtle fairy dust occasionally while flying
        this.dustCooldown += dt;
        if (fairyDusts && this.dustCooldown > 20 && Math.random() < 0.3) {
            this.dustCooldown = 0;
            fairyDusts.push(new FairyDust(this.x, this.y, 45));
        }

        // Boundaries
        if (this.x < -60) this.x = cw + 40;
        if (this.x > cw + 60) this.x = -40;
        if (this.y < -60) this.y = ch * 0.75;
        if (this.y > ch + 60) this.y = -30;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const s = this.size;
        const spec = this.spec;

        // Realistic 3D Wing Flapping Projection
        const flapCycle = Math.sin(this.wingPhase);
        const flapWidth = Math.max(0.12, Math.cos(this.wingPhase));
        const wingLiftAngle = flapCycle * 0.15;

        ctx.shadowBlur = 14;
        ctx.shadowColor = spec.glow;

        // Render Both Wings symmetrically
        [-1, 1].forEach((side) => {
            ctx.save();
            ctx.scale(side * flapWidth, 1);
            ctx.rotate(side * wingLiftAngle);

            // -----------------------------------------------------------
            // A. FOREWING (Upper Main Wing)
            // -----------------------------------------------------------
            const fwGrad = ctx.createRadialGradient(0, 0, 4, s * 0.6, -s * 0.9, s * 1.5);
            fwGrad.addColorStop(0, spec.innerGrad[0]);
            fwGrad.addColorStop(0.45, spec.innerGrad[1]);
            fwGrad.addColorStop(0.85, spec.innerGrad[2]);
            fwGrad.addColorStop(1, spec.border);

            ctx.fillStyle = fwGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(s * 0.25, -s * 0.5, s * 0.65, -s * 1.15, s * 1.05, -s * 1.25);
            ctx.bezierCurveTo(s * 1.2, -s * 0.85, s * 1.0, -s * 0.35, s * 0.5, -s * 0.05);
            ctx.quadraticCurveTo(s * 0.2, 0, 0, 0);
            ctx.fill();

            // Broad Velvet Dark Outer Margin Border
            ctx.save();
            ctx.strokeStyle = spec.border;
            ctx.lineWidth = s * 0.16;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(s * 1.05, -s * 1.25);
            ctx.bezierCurveTo(s * 1.2, -s * 0.85, s * 1.0, -s * 0.35, s * 0.5, -s * 0.05);
            ctx.stroke();
            ctx.restore();

            // Intricate Wing Vein Lattice (Discal Cell + 5 Radial Veins)
            ctx.save();
            ctx.strokeStyle = spec.veinColor;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(s * 0.25, -s * 0.45, s * 0.42, -s * 0.4);
            ctx.quadraticCurveTo(s * 0.3, -s * 0.2, 0, 0);

            ctx.moveTo(s * 0.42, -s * 0.4);
            ctx.quadraticCurveTo(s * 0.65, -s * 0.8, s * 0.98, -s * 1.15);

            ctx.moveTo(s * 0.42, -s * 0.4);
            ctx.quadraticCurveTo(s * 0.75, -s * 0.65, s * 1.08, -s * 0.8);

            ctx.moveTo(s * 0.38, -s * 0.35);
            ctx.quadraticCurveTo(s * 0.72, -s * 0.45, s * 0.95, -s * 0.52);

            ctx.moveTo(s * 0.32, -s * 0.28);
            ctx.quadraticCurveTo(s * 0.6, -s * 0.28, s * 0.75, -s * 0.25);

            ctx.moveTo(s * 0.22, -s * 0.15);
            ctx.quadraticCurveTo(s * 0.42, -s * 0.12, s * 0.52, -s * 0.06);
            ctx.stroke();
            ctx.restore();

            // Row of Delicate White Edge Dots on Forewing Border
            ctx.save();
            ctx.fillStyle = spec.dots;
            const foreDots = [
                { x: s * 1.05, y: -s * 1.12, r: 1.6 },
                { x: s * 1.12, y: -s * 0.92, r: 1.5 },
                { x: s * 1.08, y: -s * 0.72, r: 1.5 },
                { x: s * 0.98, y: -s * 0.52, r: 1.4 },
                { x: s * 0.82, y: -s * 0.34, r: 1.3 },
                { x: s * 0.65, y: -s * 0.18, r: 1.2 }
            ];
            for (const d of foreDots) {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // -----------------------------------------------------------
            // B. HINDWING (Lower Fan Wing with Scalloped Lobes)
            // -----------------------------------------------------------
            const hwGrad = ctx.createRadialGradient(0, 0, 2, s * 0.4, s * 0.4, s * 1.1);
            hwGrad.addColorStop(0, spec.innerGrad[0]);
            hwGrad.addColorStop(0.5, spec.innerGrad[1]);
            hwGrad.addColorStop(0.85, spec.innerGrad[2]);
            hwGrad.addColorStop(1, spec.border);

            ctx.fillStyle = hwGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(s * 0.4, -s * 0.08, s * 0.82, s * 0.15, s * 0.85, s * 0.45);
            ctx.quadraticCurveTo(s * 0.82, s * 0.72, s * 0.62, s * 0.88);
            ctx.quadraticCurveTo(s * 0.42, s * 0.92, s * 0.22, s * 0.75);
            ctx.bezierCurveTo(s * 0.1, s * 0.55, 0, s * 0.25, 0, 0);
            ctx.fill();

            // Hindwing Velvet Border
            ctx.save();
            ctx.strokeStyle = spec.border;
            ctx.lineWidth = s * 0.14;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(s * 0.85, s * 0.45);
            ctx.quadraticCurveTo(s * 0.82, s * 0.72, s * 0.62, s * 0.88);
            ctx.quadraticCurveTo(s * 0.42, s * 0.92, s * 0.22, s * 0.75);
            ctx.stroke();
            ctx.restore();

            // Hindwing Radiating Veins
            ctx.save();
            ctx.strokeStyle = spec.veinColor;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(s * 0.4, s * 0.25, s * 0.8, s * 0.48);

            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(s * 0.38, s * 0.45, s * 0.68, s * 0.75);

            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(s * 0.25, s * 0.5, s * 0.42, s * 0.82);
            ctx.stroke();
            ctx.restore();

            // Hindwing Margin Dots
            ctx.save();
            ctx.fillStyle = spec.dots;
            const hindDots = [
                { x: s * 0.8, y: s * 0.52, r: 1.4 },
                { x: s * 0.72, y: s * 0.7, r: 1.4 },
                { x: s * 0.55, y: s * 0.82, r: 1.4 },
                { x: s * 0.35, y: s * 0.82, r: 1.3 }
            ];
            for (const d of hindDots) {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            ctx.restore();
        });

        // -----------------------------------------------------------
        // C. ANATOMICALLY DETAILED BODY & HEAD
        // -----------------------------------------------------------
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';

        // 1. Slender Segmented Abdomen
        ctx.save();
        const abGrad = ctx.createLinearGradient(0, 0, 0, s * 0.85);
        abGrad.addColorStop(0, spec.bodyColor);
        abGrad.addColorStop(0.5, '#221510');
        abGrad.addColorStop(1, '#0e0805');
        ctx.fillStyle = abGrad;

        ctx.beginPath();
        ctx.moveTo(-s * 0.08, s * 0.1);
        ctx.quadraticCurveTo(-s * 0.09, s * 0.55, 0, s * 0.82);
        ctx.quadraticCurveTo(s * 0.09, s * 0.55, s * 0.08, s * 0.1);
        ctx.closePath();
        ctx.fill();

        // Abdominal Segments (Horizontal gentle ridges)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.8;
        for (let seg = 1; seg <= 5; seg++) {
            const sy = s * (0.15 + seg * 0.11);
            const sw = s * 0.07 * (1 - seg * 0.12);
            ctx.beginPath();
            ctx.moveTo(-sw, sy);
            ctx.lineTo(sw, sy);
            ctx.stroke();
        }
        ctx.restore();

        // 2. Furry Thorax (Middle Body)
        ctx.save();
        const thGrad = ctx.createRadialGradient(0, -s * 0.05, 1, 0, -s * 0.05, s * 0.16);
        thGrad.addColorStop(0, '#3a261c');
        thGrad.addColorStop(0.7, spec.bodyColor);
        thGrad.addColorStop(1, '#0a0503');
        ctx.fillStyle = thGrad;
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.06, s * 0.11, s * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Head & Compound Eyes
        ctx.save();
        ctx.fillStyle = '#140c08';
        ctx.beginPath();
        ctx.arc(0, -s * 0.28, s * 0.09, 0, Math.PI * 2);
        ctx.fill();

        // Two shiny compound eyes
        ctx.fillStyle = '#050201';
        ctx.beginPath();
        ctx.arc(-s * 0.06, -s * 0.31, s * 0.045, 0, Math.PI * 2);
        ctx.arc(s * 0.06, -s * 0.31, s * 0.045, 0, Math.PI * 2);
        ctx.fill();

        // Eye glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(-s * 0.07, -s * 0.32, 1.0, 0, Math.PI * 2);
        ctx.arc(s * 0.05, -s * 0.32, 1.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Elegant Curved Antennae with Teardrop Club Tips
        ctx.save();
        ctx.strokeStyle = '#1a100a';
        ctx.lineWidth = 1.0;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(-s * 0.03, -s * 0.34);
        ctx.bezierCurveTo(-s * 0.12, -s * 0.6, -s * 0.25, -s * 0.8, -s * 0.28, -s * 0.95);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(s * 0.03, -s * 0.34);
        ctx.bezierCurveTo(s * 0.12, -s * 0.6, s * 0.25, -s * 0.8, s * 0.28, -s * 0.95);
        ctx.stroke();

        ctx.fillStyle = '#0f0805';
        ctx.beginPath();
        ctx.ellipse(-s * 0.28, -s * 0.95, 1.8, 2.8, -0.3, 0, Math.PI * 2);
        ctx.ellipse(s * 0.28, -s * 0.95, 1.8, 2.8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }
}

// ==========================================================================
// 6B. REALISTIC PROCEDURAL HONEY BEE
// ==========================================================================

class HoneyBee {
    constructor(cw, ch, id = 0) {
        this.cw = cw;
        this.ch = ch;
        this.id = id;
        this.x = Math.random() * cw;
        this.y = Math.random() * ch * 0.6;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.targetX = this.x;
        this.targetY = this.y;

        this.wingPhase = Math.random() * Math.PI * 2;
        this.size = 15 + Math.random() * 3;
        this.angle = 0;
        this.flutterSeed = Math.random() * 500 + id * 200;
        this.isHoveringAtFlower = false;
        this.pollenTimer = 0;
    }

    update(cw, ch, flowerPos, bloom, windForce, dt, particles) {
        this.cw = cw;
        this.ch = ch;
        // High-frequency buzzing wing vibration
        this.wingPhase += 40 * 0.016 * dt;

        // 1. FLOWER BLOOMING (bloom >= 0.45): HOVER AT FLOWER FOR NECTAR!
        if (bloom >= 0.45 && flowerPos) {
            this.isHoveringAtFlower = true;
            // Each bee hovers on distinct sides of the central stamen
            const orbitOffset = this.id === 0 ? 0 : Math.PI;
            const orbitR = 18 + Math.sin(Date.now() * 0.003 + this.flutterSeed) * 10;
            const orbitA = Date.now() * 0.0025 + orbitOffset;
            this.targetX = flowerPos.x + Math.cos(orbitA) * orbitR;
            this.targetY = flowerPos.y + Math.sin(orbitA) * orbitR * 0.55 - 12;

            // Drop golden pollen grains occasionally while foraging
            this.pollenTimer += dt;
            if (particles && this.pollenTimer > 40 && Math.random() < 0.22) {
                this.pollenTimer = 0;
                const p = new Particle(cw, ch);
                p.x = this.x + (Math.random() - 0.5) * 6;
                p.y = this.y + (Math.random() - 0.5) * 6;
                p.hue = 45; // Golden pollen
                p.radius = 1.2;
                particles.push(p);
            }
        } else {
            // 2. FLOWER CLOSING / SHRINKING (bloom < 0.4): BUZZ AWAY IDHAR-UDHAR!
            if (this.isHoveringAtFlower) {
                this.isHoveringAtFlower = false;
                // Buzz away quickly in opposite directions
                const escapeAngles = [-1.8, 1.2];
                const escapeAngle = escapeAngles[this.id % escapeAngles.length] + (Math.random() - 0.5) * 0.5;
                this.vx = Math.cos(escapeAngle) * 7;
                this.vy = Math.sin(escapeAngle) * 7;
                this.targetX = Math.random() * cw * 0.8 + cw * 0.1;
                this.targetY = Math.random() * ch * 0.5 + ch * 0.1;
            }

            // Independent wandering
            if (Math.random() < 0.025) {
                this.targetX = Math.random() * cw * 0.8 + cw * 0.1;
                this.targetY = Math.random() * ch * 0.5 + ch * 0.1;
            }
        }

        // Darting micro-flight
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx += dx * 0.005 * dt;
        this.vy += dy * 0.005 * dt;

        this.vx += (Math.random() - 0.5) * 0.5;
        this.vy += (Math.random() - 0.5) * 0.5;
        this.vx += windForce * 0.35;

        this.vx *= 0.90;
        this.vy *= 0.90;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (Math.hypot(this.vx, this.vy) > 0.2) {
            const targetA = Math.atan2(this.vy, this.vx) + Math.PI / 2;
            this.angle += (targetA - this.angle) * 0.16 * dt;
        }

        if (this.x < -30) this.x = cw + 20;
        if (this.x > cw + 30) this.x = -20;
        if (this.y < -30) this.y = ch * 0.7;
        if (this.y > ch + 30) this.y = -20;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const s = this.size;
        const wingFlap = Math.sin(this.wingPhase);

        // -----------------------------------------------------------
        // 1. TRANSLUCENT GLASS-LIKE FAST BUZZING WINGS
        // -----------------------------------------------------------
        [-1, 1].forEach((side) => {
            ctx.save();
            ctx.scale(side, 1);
            ctx.rotate(wingFlap * 0.45);

            ctx.save();
            ctx.globalAlpha = 0.65;
            const wingGrad = ctx.createLinearGradient(0, 0, s * 0.9, -s * 0.9);
            wingGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
            wingGrad.addColorStop(0.5, 'rgba(210, 245, 255, 0.6)');
            wingGrad.addColorStop(1, 'rgba(190, 230, 255, 0.3)');

            ctx.fillStyle = wingGrad;
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(200, 240, 255, 0.6)';

            // Forewing
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.2);
            ctx.bezierCurveTo(s * 0.4, -s * 0.85, s * 0.95, -s * 1.15, s * 1.15, -s * 0.75);
            ctx.bezierCurveTo(s * 1.1, -s * 0.35, s * 0.5, -s * 0.15, 0, -s * 0.2);
            ctx.fill();

            // Wing vein outline
            ctx.strokeStyle = 'rgba(120, 160, 200, 0.45)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Hindwing
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.1);
            ctx.bezierCurveTo(s * 0.3, -s * 0.4, s * 0.75, -s * 0.55, s * 0.85, -s * 0.25);
            ctx.bezierCurveTo(s * 0.7, -s * 0.05, s * 0.35, 0, 0, -s * 0.1);
            ctx.fill();
            ctx.stroke();

            ctx.restore();
            ctx.restore();
        });

        // -----------------------------------------------------------
        // 2. CUTE PLUMP BEE BODY WITH AMBER/BLACK STRIPES
        // -----------------------------------------------------------
        // Dangling dainty bent legs
        ctx.strokeStyle = '#1e1107';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-s * 0.2, s * 0.2);
        ctx.lineTo(-s * 0.4, s * 0.55);
        ctx.lineTo(-s * 0.35, s * 0.8);

        ctx.moveTo(s * 0.2, s * 0.2);
        ctx.lineTo(s * 0.4, s * 0.55);
        ctx.lineTo(s * 0.35, s * 0.8);
        ctx.stroke();

        // Striped Abdomen (Golden Amber + Velvet Black Rings)
        const stripeColors = ['#f59e0b', '#1a0d05', '#f59e0b', '#1a0d05', '#d97706'];
        const abW = s * 0.38;
        const abH = s * 0.65;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, s * 0.32, abW, abH, 0, 0, Math.PI * 2);
        ctx.clip();

        stripeColors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.fillRect(-abW * 1.5, s * (0.05 + i * 0.18), abW * 3, s * 0.19);
        });
        ctx.restore();

        // Tiny cute stinger tip
        ctx.fillStyle = '#110702';
        ctx.beginPath();
        ctx.moveTo(-1.2, s * 0.95);
        ctx.lineTo(1.2, s * 0.95);
        ctx.lineTo(0, s * 1.08);
        ctx.fill();

        // Fuzzy Golden-Caramel Thorax
        ctx.save();
        const thGrad = ctx.createRadialGradient(0, -s * 0.12, 1, 0, -s * 0.12, s * 0.38);
        thGrad.addColorStop(0, '#fcd34d');
        thGrad.addColorStop(0.5, '#d97706');
        thGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = thGrad;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.14, s * 0.34, s * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Dark Head & Glossy Compound Eyes
        ctx.fillStyle = '#1c0f05';
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.46, s * 0.24, s * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Two shiny dark black eyes
        ctx.fillStyle = '#080301';
        ctx.beginPath();
        ctx.arc(-s * 0.18, -s * 0.48, s * 0.08, 0, Math.PI * 2);
        ctx.arc(s * 0.18, -s * 0.48, s * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(-s * 0.2, -s * 0.5, 1.2, 0, Math.PI * 2);
        ctx.arc(s * 0.16, -s * 0.5, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Cute bent antennae
        ctx.strokeStyle = '#180a03';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-s * 0.08, -s * 0.58);
        ctx.lineTo(-s * 0.16, -s * 0.72);
        ctx.lineTo(-s * 0.24, -s * 0.7);

        ctx.moveTo(s * 0.08, -s * 0.58);
        ctx.lineTo(s * 0.16, -s * 0.72);
        ctx.lineTo(s * 0.24, -s * 0.7);
        ctx.stroke();

        ctx.restore();
    }
}

// ==========================================================================
// 7. MAIN AR APPLICATION CONTROLLER
// ==========================================================================
class FlowerBloomApp {
    constructor() {
        // DOM Elements
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.video = document.getElementById('webcam');
        this.loadingEl = document.getElementById('loading');
        this.loadingStatus = document.getElementById('loadingStatus');
        this.instructionsEl = document.getElementById('instructions');
        this.flashOverlay = document.getElementById('flashOverlay');
        this.snapshotToast = document.getElementById('snapshotToast');
        this.manualDrawer = document.getElementById('manualDrawer');

        // Physics & Audio
        this.noise = new OrganicNoise();
console.log("Audio and noise engines ready.");