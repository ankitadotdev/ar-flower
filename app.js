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
        this.sound = new SoundEngine();

        // Gesture state (smooth interpolated)
        this.bloom = 0.3;
        this.growth = 0.5;
        this.windForce = 0;

        // Targets
        this.targetBloom = 0.3;
        this.targetGrowth = 0.5;
        this.targetWindForce = 0;
        this.prevHands = {};

        // Super Bloom Celebration state
        this.hasFiredSuperBloom = false;

        // Features Configuration
        this.species = 'tulip'; // 'tulip' | 'rose' | 'lotus' | 'sunflower' | 'sakura'
        this.anchorMode = 'ground'; // 'ground' | 'palm'
        this.isCameraActive = false;
        this.isManualActive = false;

        // Hands-Free Photo Capture System (Deliberate & Unique Gestures)
        this.handsFreeActive = true;
        this.cameraFrameEnabled = true; // "L" sign (1 hand) or Camera viewfinder box (2 hands)
        this.gestureTriggerEnabled = true; // ✌️ Peace sign
        this.heartGestureEnabled = true; // 🫶 Two-hand heart pose
        this.openPalmEnabled = true; // 🖐️ Open palm gesture
        this.voiceTriggerEnabled = false;
        this.poseHoldEnabled = false; // OFF by default so raising hands to grow flowers NEVER triggers photos!
        this.timerDuration = 3; // 0 (off), 3, 5, 10
        this.isCountingDown = false;
        this.countdownInterval = null;
        this.signalToastTimeout = null;

        // Dedicated deliberate hold timers (responsive ~0.8s lock)
        this.cameraFrameHoldTime = 0;
        this.cameraFrameHoldRequired = 0.80;
        this.cameraFrameBox = null;

        this.peaceHoldTime = 0;
        this.peaceHoldRequired = 0.80;
        this.peaceHandPos = null;

        this.heartHoldTime = 0;
        this.heartHoldRequired = 0.80;
        this.heartCenterPos = null;

        this.palmHoldTime = 0;
        this.palmHoldRequired = 0.80;
        this.palmHandPos = null;

        this.poseHoldTime = 0;
        this.poseHoldRequired = 1.3;
        this.lastSnapTime = 0;
        this.prevPosePositions = {};
        this.speechRecognition = null;

        // MediaPipe state
        this.handLandmarks = [];
        this.handHandedness = [];
        this.handsDetected = 0;

        // Object pools
        this.particles = [];
        this.fairyDusts = [];
        this.burstPetals = [];
        this.butterflies = [];
        this.bees = [];
        this.showButterfliesAndBees = true;

        // Time
        this.time = 0;
        this.lastTimestamp = 0;

        // Flower tip cache for butterfly landing
        this.mainFlowerPos = { x: 0, y: 0 };

        // Initialize Systems
        this.initDOM();
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.initParticles();
        this.initButterflies();
        this.initHandTracking();

        // Animation Loop
        requestAnimationFrame((ts) => this.animate(ts));
    }

    // ----------------------------------------------------------------------
    // UI & DOM Interactions
    // ----------------------------------------------------------------------
    initDOM() {
        // Species Selector Buttons
        const flowerBtns = document.querySelectorAll('.flower-btn');
        flowerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                flowerBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.species = btn.dataset.flower;
                this.sound.playChime(3, 0.25);
            });
        });

        // Mode Toggle Button (Ground vs Palm AR)
        const modeBtn = document.getElementById('modeToggleBtn');
        const modeIcon = document.getElementById('modeIcon');
        const modeLabel = document.getElementById('modeLabel');
        modeBtn.addEventListener('click', () => {
            if (this.anchorMode === 'ground') {
                this.anchorMode = 'palm';
                modeIcon.textContent = '✋';
                modeLabel.textContent = 'Palm AR';
                modeBtn.classList.add('active-mode');
            } else {
                this.anchorMode = 'ground';
                modeIcon.textContent = '🌱';
                modeLabel.textContent = 'Ground';
                modeBtn.classList.remove('active-mode');
            }
            this.sound.playChime(5, 0.2);
        });

        // Audio Toggle
        const soundBtn = document.getElementById('soundToggleBtn');
        const soundIcon = document.getElementById('soundIcon');
        soundBtn.addEventListener('click', () => {
            const isEnabled = this.sound.toggle();
            soundIcon.textContent = isEnabled ? '🔔' : '🔇';
            soundBtn.style.borderColor = isEnabled ? 'rgba(255, 130, 180, 0.6)' : '';
            if (isEnabled) this.sound.playChime(7, 0.3);
        });

        // Hands-Free Drawer Toggle
        const hfBtn = document.getElementById('handsFreeBtn');
        const hfDrawer = document.getElementById('handsFreeDrawer');
        const hfClose = document.getElementById('handsFreeClose');
        if (hfBtn && hfDrawer) {
            hfBtn.addEventListener('click', () => {
                hfDrawer.classList.toggle('open');
                this.manualDrawer?.classList.remove('open');
            });
            hfClose?.addEventListener('click', () => {
                hfDrawer.classList.remove('open');
            });
        }

        // Self-Timer Quick Button (Cycles 0 -> 3 -> 5 -> 10 -> 0)
        const timerBtn = document.getElementById('timerToggleBtn');
        if (timerBtn) {
            timerBtn.addEventListener('click', () => {
                const cycle = [0, 3, 5, 10];
                const nextIdx = (cycle.indexOf(this.timerDuration) + 1) % cycle.length;
                this.setTimerDuration(cycle[nextIdx]);
            });
        }

        // Hands-Free Feature Toggles
        const frameCheck = document.getElementById('toggleCameraFrame');
        if (frameCheck) {
            frameCheck.checked = this.cameraFrameEnabled;
            frameCheck.addEventListener('change', (e) => {
                this.cameraFrameEnabled = e.target.checked;
                this.updateHandsFreeStatus();
                if (this.cameraFrameEnabled) {
                    this.showSignalToast('Camera Frame Active! Form [ 📷 ] with hands', '📸');
                }
            });
        }

        const gestureCheck = document.getElementById('toggleGestureTrigger');
        if (gestureCheck) {
            gestureCheck.checked = this.gestureTriggerEnabled;
            gestureCheck.addEventListener('change', (e) => {
                this.gestureTriggerEnabled = e.target.checked;
                this.updateHandsFreeStatus();
                if (this.gestureTriggerEnabled) {
                    this.showSignalToast('Peace Gesture Active! Hold ✌️ for 1.2s to snap', '✌️');
                }
            });
        }

        const heartCheck = document.getElementById('toggleHeartGesture');
        if (heartCheck) {
            heartCheck.checked = this.heartGestureEnabled;
            heartCheck.addEventListener('change', (e) => {
                this.heartGestureEnabled = e.target.checked;
                this.updateHandsFreeStatus();
                if (this.heartGestureEnabled) {
                    this.showSignalToast('Two-Hand Heart Active! Join 🫶 hands', '🫶');
                }
            });
        }

        const palmCheck = document.getElementById('toggleOpenPalm');
        if (palmCheck) {
            palmCheck.checked = this.openPalmEnabled;
            palmCheck.addEventListener('change', (e) => {
                this.openPalmEnabled = e.target.checked;
                this.updateHandsFreeStatus();
                if (this.openPalmEnabled) {
                    this.showSignalToast('Open Palm Active! Show 🖐️ to snap photo', '🖐️');
                }
            });
        }

        const voiceCheck = document.getElementById('toggleVoiceTrigger');
        if (voiceCheck) {
            voiceCheck.addEventListener('change', (e) => {
                this.toggleVoice(e.target.checked);
                this.updateHandsFreeStatus();
            });
        }

        const poseCheck = document.getElementById('togglePoseHold');
        if (poseCheck) {
            poseCheck.checked = this.poseHoldEnabled;
            poseCheck.addEventListener('change', (e) => {
                this.poseHoldEnabled = e.target.checked;
                this.updateHandsFreeStatus();
                if (this.poseHoldEnabled) {
                    this.showSignalToast('Bloom Pose Hold: Active! (Hold steady 2s)', '🌸');
                }
            });
        }

        // Allow clicking anywhere on an hf-option row to toggle its switch
        const hfRows = document.querySelectorAll('.hf-option[data-target]');
        hfRows.forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.switch-wrapper')) return;
                const targetId = row.dataset.target;
                const input = document.getElementById(targetId);
                if (input) {
                    input.checked = !input.checked;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

        // Timer Chips
        const chips = document.querySelectorAll('.timer-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const duration = parseInt(chip.dataset.timer, 10);
                this.setTimerDuration(duration);
            });
        });

        // Snapshot Button: if timer is active, start countdown!
        const snapshotBtn = document.getElementById('snapshotBtn');
        if (snapshotBtn) {
            snapshotBtn.addEventListener('click', () => {
                if (this.timerDuration > 0) {
                    this.startCountdown(this.timerDuration, '📸 Timer Snapshot');
                } else {
                    this.takeSnapshot();
                }
            });
        }

        // Countdown Cancel Button
        const cancelBtn = document.getElementById('countdownCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelCountdown());
        }

        // Manual Controls Drawer Toggle
        const manualToggle = document.getElementById('manualControlsToggle');
        const drawerClose = document.getElementById('drawerClose');
        manualToggle.addEventListener('click', () => {
            this.manualDrawer.classList.toggle('open');
            this.isManualActive = this.manualDrawer.classList.contains('open');
            hfDrawer?.classList.remove('open');
        });
        drawerClose.addEventListener('click', () => {
            this.manualDrawer.classList.remove('open');
            this.isManualActive = false;
        });

        // Manual Sliders Input
        const bSlider = document.getElementById('manualBloomSlider');
        const gSlider = document.getElementById('manualGrowthSlider');
        const wSlider = document.getElementById('manualWindSlider');
        const bDisp = document.getElementById('valBloom');
        const gDisp = document.getElementById('valGrowth');
        const wDisp = document.getElementById('valWind');

        bSlider.addEventListener('input', (e) => {
            this.targetBloom = parseFloat(e.target.value);
            bDisp.textContent = `${Math.round(this.targetBloom * 100)}%`;
            this.isManualActive = true;
        });
        gSlider.addEventListener('input', (e) => {
            this.targetGrowth = parseFloat(e.target.value);
            gDisp.textContent = `${Math.round(this.targetGrowth * 100)}%`;
            this.isManualActive = true;
        });
        wSlider.addEventListener('input', (e) => {
            this.targetWindForce = parseFloat(e.target.value);
            wDisp.textContent = this.targetWindForce.toFixed(2);
            this.isManualActive = true;
        });

        // Butterflies & Bees Toggle Checkbox
        const faunaCheckbox = document.getElementById('toggleButterfliesCheckbox');
        if (faunaCheckbox) {
            faunaCheckbox.addEventListener('change', (e) => {
                this.showButterfliesAndBees = e.target.checked;
            });
        }

        // Canvas Mouse Drag Wind Gusts
        let isMouseDown = false;
        let lastMouseX = 0;
        window.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('input')) return;
            isMouseDown = true;
            lastMouseX = e.clientX;
            this.sound.init();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            const dx = (e.clientX - lastMouseX) * 0.05;
            this.targetWindForce = Math.max(-1.5, Math.min(1.5, dx));
            lastMouseX = e.clientX;
        });
        window.addEventListener('mouseup', () => {
            isMouseDown = false;
            this.targetWindForce *= 0.2;
        });

        // Keyboard Shortcut: Spacebar for snapshot, Escape to cancel
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && !e.target.isContentEditable) {
                e.preventDefault();
                const delay = this.timerDuration > 0 ? this.timerDuration : 3;
                this.startCountdown(delay, '⌨️ Spacebar Snapshot');
            } else if (e.code === 'Escape') {
                this.cancelCountdown();
                hfDrawer?.classList.remove('open');
                this.manualDrawer?.classList.remove('open');
            }
        });

        // Instructions Dismiss
        const dismissBtn = document.getElementById('dismissInstructions');
        dismissBtn.addEventListener('click', () => {
            this.instructionsEl.classList.add('hidden');
        });

        // Help Toggle to re-show instructions
        const helpBtn = document.getElementById('helpToggle');
        helpBtn.addEventListener('click', () => {
            this.instructionsEl.classList.toggle('hidden');
        });

        // Skip Camera Button
        const skipBtn = document.getElementById('skipCameraBtn');
        skipBtn.addEventListener('click', () => {
            this.loadingEl.classList.add('hidden');
            this.manualDrawer.classList.add('open');
            this.isManualActive = true;
            this.targetGrowth = 0.85;
            this.targetBloom = 0.65;
        });

        // Auto dismiss instructions after 9 seconds
        setTimeout(() => {
            this.instructionsEl?.classList.add('hidden');
        }, 9000);
    }

    setTimerDuration(duration) {
        this.timerDuration = duration;
        const timerLabel = document.getElementById('timerLabel');
        if (timerLabel) {
            timerLabel.textContent = duration === 0 ? 'Off' : `${duration}s`;
        }
        const timerChips = document.querySelectorAll('.timer-chip');
        timerChips.forEach(chip => {
            chip.classList.toggle('active', parseInt(chip.dataset.timer, 10) === duration);
        });
        this.sound.playChime(4, 0.2);
    }

    updateHandsFreeStatus() {
        const hfBtn = document.getElementById('handsFreeBtn');
        const dot = hfBtn?.querySelector('.status-pulse-dot');
        const isActive = this.cameraFrameEnabled || this.gestureTriggerEnabled || this.heartGestureEnabled || this.openPalmEnabled || this.voiceTriggerEnabled || this.poseHoldEnabled;
        if (hfBtn) {
            hfBtn.classList.toggle('active-handsfree', isActive);
        }
        if (dot) {
            dot.style.display = isActive ? 'block' : 'none';
        }
    }

    showSignalToast(msg, badge = '✨') {
        const toast = document.getElementById('signalToast');
        const badgeEl = document.getElementById('signalBadge');
        const textEl = document.getElementById('signalText');
        if (!toast || !badgeEl || !textEl) return;

        badgeEl.textContent = badge;
        textEl.textContent = msg;
        toast.classList.add('show');

        clearTimeout(this.signalToastTimeout);
        this.signalToastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    startCountdown(duration = 3, sourceText = '📸 Pose & Smile!') {
        if (duration <= 0) {
            this.takeSnapshot();
            return;
        }

        if (this.isCountingDown) return;
        this.isCountingDown = true;
        this.sound.init();

        const overlay = document.getElementById('countdownOverlay');
        const numEl = document.getElementById('countdownNumber');
        const progressEl = document.getElementById('countdownProgress');
        const sourceEl = document.getElementById('countdownSource');

        if (sourceEl) sourceEl.textContent = sourceText;
        if (overlay) overlay.classList.add('active');

        let remaining = duration;
        const total = duration;
        const circumference = 364.4; // 2 * PI * 58

        if (numEl) numEl.textContent = remaining;
        if (progressEl) progressEl.style.strokeDashoffset = '0';
        this.sound.playCountdownBeep(remaining);

        if (this.countdownInterval) clearInterval(this.countdownInterval);

        this.countdownInterval = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                if (numEl) {
                    numEl.textContent = remaining;
                    numEl.style.animation = 'none';
                    numEl.offsetHeight; // Force reflow
                    numEl.style.animation = 'countdown-pop 0.9s ease-out';
                }
                if (progressEl) {
                    const offset = circumference * (1 - remaining / total);
                    progressEl.style.strokeDashoffset = offset;
                }
                this.sound.playCountdownBeep(remaining);
            } else if (remaining === 0) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;

                if (numEl) {
                    numEl.textContent = '✨';
                    numEl.style.animation = 'none';
                    numEl.offsetHeight;
                    numEl.style.animation = 'countdown-pop 0.5s ease-out';
                }
                if (progressEl) {
                    progressEl.style.strokeDashoffset = circumference;
                }
                this.sound.playCountdownBeep(0);

                setTimeout(() => {
                    this.cancelCountdown();
                    this.takeSnapshot();
                }, 380);
            }
        }, 1000);
    }

    cancelCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        this.isCountingDown = false;
        const overlay = document.getElementById('countdownOverlay');
        if (overlay) overlay.classList.remove('active');
    }

    dist(p1, p2) {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    // ----------------------------------------------------------------------
    // 1. Camera Frame & Single-Hand "L" Sign Check
    // ----------------------------------------------------------------------
    detectSingleHandL(hand) {
        if (!hand || hand.length < 21) return false;
        const scale = this.dist(hand[0], hand[9]);
        if (scale < 0.04) return false;

        // Index finger extended straight up
        const indexExt = this.dist(hand[8], hand[0]) > this.dist(hand[6], hand[0]) * 1.10 &&
                         this.dist(hand[8], hand[5]) > scale * 0.55 &&
                         hand[8].y < hand[5].y;

        // Middle, Ring, Pinky curled tight into palm
        const middleCurled = this.dist(hand[12], hand[0]) < this.dist(hand[8], hand[0]) * 0.82 &&
                             this.dist(hand[12], hand[0]) < scale * 1.35;
        const ringCurled = this.dist(hand[16], hand[0]) < this.dist(hand[8], hand[0]) * 0.82;
        const pinkyCurled = this.dist(hand[20], hand[0]) < this.dist(hand[8], hand[0]) * 0.82;

        // Thumb extended outward forming an "L" with index
        const thumbExt = this.dist(hand[4], hand[2]) > scale * 0.35 &&
                         this.dist(hand[4], hand[9]) > scale * 0.40;

        // Thumb is NOT pinching index (very clear separation)
        const notPinching = this.dist(hand[4], hand[8]) > scale * 0.50;

        return indexExt && middleCurled && ringCurled && pinkyCurled && thumbExt && notPinching;
    }

    detectCameraFrame() {
        if (this.handsDetected === 0) return null;

        // Mode 1: Two-Hand Camera Viewfinder Box [ 📷 ]
        if (this.handsDetected >= 2) {
            const h1 = this.handLandmarks[0];
            const h2 = this.handLandmarks[1];

            if (this.detectSingleHandL(h1) && this.detectSingleHandL(h2)) {
                const cw = this.canvas.width;
                const ch = this.canvas.height;
                const x1 = Math.min(h1[8].x, h1[4].x, h2[8].x, h2[4].x) * cw;
                const x2 = Math.max(h1[8].x, h1[4].x, h2[8].x, h2[4].x) * cw;
                const y1 = Math.min(h1[8].y, h1[4].y, h2[8].y, h2[4].y) * ch;
                const y2 = Math.max(h1[8].y, h1[4].y, h2[8].y, h2[4].y) * ch;

                const w = Math.max(140, x2 - x1);
                const h = Math.max(100, y2 - y1);

                return {
                    type: 'box',
                    x: Math.max(10, Math.min(x1, cw - w - 10)),
                    y: Math.max(10, Math.min(y1, ch - h - 10)),
                    w,
                    h
                };
            }
        }

        // Mode 2: Single-Hand "L" Sign 👆 on EITHER hand
        for (const hand of this.handLandmarks) {
            if (this.detectSingleHandL(hand)) {
                const cw = this.canvas.width;
                const ch = this.canvas.height;
                return {
                    type: 'single',
                    x: (hand[8].x + hand[4].x) * 0.5 * cw,
                    y: Math.min(hand[8].y, hand[4].y) * ch,
                    hand
                };
            }
        }

        return null;
    }

    // ----------------------------------------------------------------------
    // 2. Strict & Deliberate Peace Sign ✌️
    // ----------------------------------------------------------------------
    detectPeaceSign(hand) {
        if (!hand || hand.length < 21) return null;
        const scale = this.dist(hand[0], hand[9]);
        if (scale < 0.05) return null;

        // Index and Middle extended upward
        const indexExt = this.dist(hand[8], hand[0]) > this.dist(hand[6], hand[0]) * 1.12 &&
                         this.dist(hand[8], hand[5]) > scale * 0.65;
        const middleExt = this.dist(hand[12], hand[0]) > this.dist(hand[10], hand[0]) * 1.12 &&
                          this.dist(hand[12], hand[9]) > scale * 0.65;

        // Ring and Pinky firmly curled into palm
        const ringFolded = this.dist(hand[16], hand[0]) < this.dist(hand[8], hand[0]) * 0.80;
        const pinkyFolded = this.dist(hand[20], hand[0]) < this.dist(hand[8], hand[0]) * 0.80;

        // Thumb tucked across palm (NOT pointing up, NOT pinching index)
        const notPinching = this.dist(hand[4], hand[8]) > scale * 0.40;
        const thumbTucked = this.dist(hand[4], hand[0]) < this.dist(hand[8], hand[0]) * 0.85;

        // V-Spread: Index and Middle separated
        const vSpread = this.dist(hand[8], hand[12]) > scale * 0.22;

        // Hand is upright
        const upright = hand[8].y < hand[5].y && hand[12].y < hand[9].y;

        if (indexExt && middleExt && ringFolded && pinkyFolded && notPinching && thumbTucked && vSpread && upright) {
            return {
                x: (hand[8].x + hand[12].x) * 0.5 * this.canvas.width,
                y: Math.min(hand[8].y, hand[12].y) * this.canvas.height
            };
        }
        return null;
    }

    // ----------------------------------------------------------------------
    // 3. Heart Pose (🫶 Strictly Joined Two Hands — Zero False Positives!)
    // ----------------------------------------------------------------------
    detectHeartGesture() {
        // Must have both hands detected to form a two-hand heart (🫶)
        if (this.handsDetected < 2) return null;
        const h1 = this.handLandmarks[0];
        const h2 = this.handLandmarks[1];

        const scale1 = this.dist(h1[0], h1[9]);
        const scale2 = this.dist(h2[0], h2[9]);
        const avgScale = (scale1 + scale2) * 0.5;
        if (avgScale < 0.04) return null;

        // 1. Index fingertips (8) must be touching or touching together:
        const indexDist = this.dist(h1[8], h2[8]);
        if (indexDist > avgScale * 0.75) return null;

        // 2. Thumb fingertips (4) must be touching or touching together:
        const thumbDist = this.dist(h1[4], h2[4]);
        if (thumbDist > avgScale * 0.75) return null;

        // 3. In a true heart, index tips form the UPPER arches, so index tips
        //    MUST be clearly higher (smaller Y) than thumb tips:
        const yIndex = (h1[8].y + h2[8].y) * 0.5;
        const yThumb = (h1[4].y + h2[4].y) * 0.5;
        if (yIndex >= yThumb - avgScale * 0.18) return null;

        // 4. The two hands must be joined together in the center (palms close):
        const c1 = this.palmCenter(h1);
        const c2 = this.palmCenter(h2);
        if (this.dist(c1, c2) > avgScale * 2.2) return null;

        // 5. Wrists reasonably aligned
        if (Math.abs(h1[0].y - h2[0].y) > avgScale * 1.5) return null;

        const cw = this.canvas.width;
        const ch = this.canvas.height;
        return {
            type: 'two-hand',
            x: (h1[8].x + h2[8].x + h1[4].x + h2[4].x) * 0.25 * cw,
            y: (yIndex + yThumb) * 0.5 * ch
        };
    }

    // ----------------------------------------------------------------------
    // 4. Open Palm Gesture 🖐️ (Show Open Hand to Camera — Easiest Photo Trigger)
    // ----------------------------------------------------------------------
    detectOpenPalm(hand) {
        if (!hand || hand.length < 21) return null;
        const scale = this.dist(hand[0], hand[9]);
        if (scale < 0.05) return null;

        // All 4 finger tips extended outward away from wrist:
        const indexExt = this.dist(hand[8], hand[0]) > this.dist(hand[6], hand[0]) * 1.12 &&
                         this.dist(hand[8], hand[5]) > scale * 0.58;
        const middleExt = this.dist(hand[12], hand[0]) > this.dist(hand[10], hand[0]) * 1.12 &&
                          this.dist(hand[12], hand[9]) > scale * 0.58;
        const ringExt = this.dist(hand[16], hand[0]) > this.dist(hand[14], hand[0]) * 1.12 &&
                        this.dist(hand[16], hand[13]) > scale * 0.55;
        const pinkyExt = this.dist(hand[20], hand[0]) > this.dist(hand[18], hand[0]) * 1.12 &&
                         this.dist(hand[20], hand[17]) > scale * 0.50;

        // Thumb extended outward (not tucked into palm)
        const thumbExt = this.dist(hand[4], hand[0]) > scale * 0.85 &&
                         this.dist(hand[4], hand[2]) > scale * 0.35;

        // NOT pinching (thumb separated from index)
        const notPinching = this.dist(hand[4], hand[8]) > scale * 0.55;

        // Hand is upright (fingers above wrist)
        const upright = hand[12].y < hand[0].y;

        if (indexExt && middleExt && ringExt && pinkyExt && thumbExt && notPinching && upright) {
            const center = this.palmCenter(hand);
            return {
                x: center.x * this.canvas.width,
                y: center.y * this.canvas.height
            };
        }
        return null;
    }

    // ----------------------------------------------------------------------
    // 5. Namaste Pose (Joined Palms 🙏) - Only if Bloom Pose-Hold is enabled
    // ----------------------------------------------------------------------
    detectNamastePose() {
        if (this.handsDetected < 2) return null;
        const h1 = this.handLandmarks[0];
        const h2 = this.handLandmarks[1];

        const c1 = this.palmCenter(h1);
        const c2 = this.palmCenter(h2);

        const palmsClose = this.dist(c1, c2) < 0.10;
        const tipsClose = this.dist(h1[12], h2[12]) < 0.09;
        const upright = (h1[12].y < c1.y - 0.05) && (h2[12].y < c2.y - 0.05);

        if (palmsClose && tipsClose && upright) {
            return {
                x: (c1.x + c2.x) * 0.5 * this.canvas.width,
                y: (h1[12].y + h2[12].y) * 0.5 * this.canvas.height
            };
        }
        return null;
    }

    // ----------------------------------------------------------------------
    // 6. Update Hands-Free Gestures (Every Frame inside animate)
    // ----------------------------------------------------------------------
    updateHandsFreeGestures(dt) {
        if (this.isCountingDown) {
            this.cameraFrameHoldTime = 0;
            this.peaceHoldTime = 0;
            this.heartHoldTime = 0;
            this.palmHoldTime = 0;
            this.poseHoldTime = 0;
            return;
        }

        const now = Date.now();
        if (now - this.lastSnapTime < 3200) {
            this.cameraFrameHoldTime = Math.max(0, this.cameraFrameHoldTime - dt * 0.05);
            this.peaceHoldTime = Math.max(0, this.peaceHoldTime - dt * 0.05);
            this.heartHoldTime = Math.max(0, this.heartHoldTime - dt * 0.05);
            this.palmHoldTime = Math.max(0, this.palmHoldTime - dt * 0.05);
            this.poseHoldTime = Math.max(0, this.poseHoldTime - dt * 0.05);
            return;
        }

        // Correct frame step timing: ~0.020 per frame at 60fps (dt ~ 1.0)
        const step = Math.min(0.06, Math.max(0.012, dt * 0.020));

        // 1. Check Camera Frame / "L" Gesture 👆 [ 📷 ]
        let cameraFound = false;
        if (this.cameraFrameEnabled) {
            const frame = this.detectCameraFrame();
            if (frame) {
                cameraFound = true;
                this.cameraFrameBox = frame;
                this.cameraFrameHoldTime += step;
                if (this.cameraFrameHoldTime >= this.cameraFrameHoldRequired) {
                    this.cameraFrameHoldTime = 0;
                    this.lastSnapTime = Date.now();
                    const toastText = frame.type === 'box' ? 'Camera Frame Locked! 📸' : '"L" Sign Locked! 👆';
                    this.showSignalToast(toastText, '📸');
                    this.sound.playChime(6, 0.3);
                    const delay = this.timerDuration > 0 ? this.timerDuration : 3;
                    this.startCountdown(delay, toastText);
                    return;
                }
            }
        }
        if (!cameraFound) {
            this.cameraFrameHoldTime = Math.max(0, this.cameraFrameHoldTime - step * 0.85);
            if (this.cameraFrameHoldTime === 0) this.cameraFrameBox = null;
        }

        // 2. Check Peace Sign ✌️
        let peaceFound = false;
        if (this.gestureTriggerEnabled) {
            for (const hand of this.handLandmarks) {
                const pos = this.detectPeaceSign(hand);
                if (pos) {
                    peaceFound = true;
                    this.peaceHandPos = pos;
                    this.peaceHoldTime += step;
                    if (this.peaceHoldTime >= this.peaceHoldRequired) {
                        this.peaceHoldTime = 0;
                        this.lastSnapTime = Date.now();
                        this.showSignalToast('Peace Gesture Locked!', '✌️');
                        this.sound.playChime(5, 0.3);
                        const delay = this.timerDuration > 0 ? this.timerDuration : 3;
                        this.startCountdown(delay, '✌️ Peace Gesture Locked!');
                        return;
                    }
                    break;
                }
            }
        }
        if (!peaceFound) {
            this.peaceHoldTime = Math.max(0, this.peaceHoldTime - step * 0.85);
            if (this.peaceHoldTime === 0) this.peaceHandPos = null;
        }

        // 3. Check Two-Hand Heart Pose 🫶
        let heartFound = false;
        if (this.heartGestureEnabled) {
            const hPos = this.detectHeartGesture();
            if (hPos) {
                heartFound = true;
                this.heartCenterPos = hPos;
                this.heartHoldTime += step;
                if (this.heartHoldTime >= this.heartHoldRequired) {
                    this.heartHoldTime = 0;
                    this.lastSnapTime = Date.now();
                    this.showSignalToast('Two-Hand Heart Locked! 🫶', '🫶');
                    this.sound.playChime(7, 0.35);
                    const delay = this.timerDuration > 0 ? this.timerDuration : 3;
                    this.startCountdown(delay, '🫶 Two-Hand Heart Locked!');
                    return;
                }
            }
        }
        if (!heartFound) {
            this.heartHoldTime = Math.max(0, this.heartHoldTime - step * 0.85);
            if (this.heartHoldTime === 0) this.heartCenterPos = null;
        }

        // 4. Check Open Palm Gesture 🖐️
        let palmFound = false;
        if (this.openPalmEnabled) {
            for (const hand of this.handLandmarks) {
                const pPos = this.detectOpenPalm(hand);
                if (pPos) {
                    palmFound = true;
                    this.palmHandPos = pPos;
                    this.palmHoldTime += step;
                    if (this.palmHoldTime >= this.palmHoldRequired) {
                        this.palmHoldTime = 0;
                        this.lastSnapTime = Date.now();
                        this.showSignalToast('Open Palm Photo Locked! 🖐️', '🖐️');
                        this.sound.playChime(4, 0.3);
                        const delay = this.timerDuration > 0 ? this.timerDuration : 3;
                        this.startCountdown(delay, '🖐️ Open Palm Locked!');
                        return;
                    }
                    break;
                }
            }
        }
        if (!palmFound) {
            this.palmHoldTime = Math.max(0, this.palmHoldTime - step * 0.85);
            if (this.palmHoldTime === 0) this.palmHandPos = null;
        }

        // 5. Check Namaste Pose (Only if Pose-Hold is explicitly enabled)
        let namasteFound = false;
        if (this.poseHoldEnabled) {
            const nPos = this.detectNamastePose();
            if (nPos) {
                namasteFound = true;
                this.poseHoldTime += step;
                if (this.poseHoldTime >= this.poseHoldRequired) {
                    this.poseHoldTime = 0;
                    this.lastSnapTime = Date.now();
                    this.showSignalToast('Namaste Pose Locked!', '🙏');
                    this.sound.playChime(6, 0.3);
                    const delay = this.timerDuration > 0 ? this.timerDuration : 3;
                    this.startCountdown(delay, '🙏 Namaste Pose Locked!');
                    return;
                }
            }
        }
        if (!namasteFound) {
            this.poseHoldTime = Math.max(0, this.poseHoldTime - step * 0.85);
        }
    }

    // ----------------------------------------------------------------------
    // 7. HUD Viewfinder & Lock Ring Renderers
    // ----------------------------------------------------------------------
    drawCameraFrameHUD() {
        if (this.cameraFrameHoldTime <= 0 || !this.cameraFrameBox) return;
        const ctx = this.ctx;
        const b = this.cameraFrameBox;
        const progress = Math.min(1, this.cameraFrameHoldTime / this.cameraFrameHoldRequired);

        ctx.save();

        if (b.type === 'box') {
            // Two-hand camera frame box [ 📷 ]
            ctx.strokeStyle = '#48dbfb';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = 'rgba(72, 219, 251, 0.85)';
            ctx.shadowBlur = 14;

            const cornerLen = Math.min(32, b.w * 0.22, b.h * 0.22);

            // Top-Left corner
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + cornerLen);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(b.x + cornerLen, b.y);
            ctx.stroke();

            // Top-Right corner
            ctx.beginPath();
            ctx.moveTo(b.x + b.w - cornerLen, b.y);
            ctx.lineTo(b.x + b.w);
            ctx.lineTo(b.x + b.w, b.y + cornerLen);
            ctx.stroke();

            // Bottom-Left corner
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + b.h - cornerLen);
            ctx.lineTo(b.x, b.y + b.h);
            ctx.lineTo(b.x + cornerLen, b.y + b.h);
            ctx.stroke();

            // Bottom-Right corner
            ctx.beginPath();
            ctx.moveTo(b.x + b.w - cornerLen, b.y + b.h);
            ctx.lineTo(b.x + b.w, b.y + b.h);
            ctx.lineTo(b.x + b.w, b.y + b.h - cornerLen);
            ctx.stroke();

            // Center crosshair +
            const cx = b.x + b.w * 0.5;
            const cy = b.y + b.h * 0.5;
            ctx.beginPath();
            ctx.moveTo(cx - 10, cy);
            ctx.lineTo(cx + 10, cy);
            ctx.moveTo(cx, cy - 10);
            ctx.lineTo(cx, cy + 10);
            ctx.stroke();

            // Header Badge (un-mirrored for legible text)
            ctx.save();
            ctx.translate(cx, b.y - 24);
            ctx.scale(-1, 1);
            ctx.fillStyle = 'rgba(12, 8, 24, 0.88)';
            ctx.strokeStyle = 'rgba(72, 219, 251, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(-100, -14, 200, 28, 14);
            ctx.fill();
            ctx.stroke();

            // Progress fill inside badge
            ctx.fillStyle = 'rgba(72, 219, 251, 0.35)';
            ctx.beginPath();
            ctx.roundRect(-96, -10, 192 * progress, 20, 10);
            ctx.fill();

            ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 0;
            ctx.fillText(`📸 CAMERA FRAME: ${Math.round(progress * 100)}%`, 0, 0);
            ctx.restore();

        } else {
            // Single-hand "L" Sign Lock Ring 👆
            const px = b.x;
            const py = Math.max(55, b.y - 20);

            // Outer target brackets
            ctx.strokeStyle = 'rgba(72, 219, 251, 0.55)';
            ctx.lineWidth = 2;
            const sz = 34;
            ctx.beginPath();
            ctx.moveTo(px - sz, py - sz + 12); ctx.lineTo(px - sz, py - sz); ctx.lineTo(px - sz + 12, py - sz);
            ctx.moveTo(px + sz, py - sz + 12); ctx.lineTo(px + sz, py - sz); ctx.lineTo(px + sz - 12, py - sz);
            ctx.moveTo(px - sz, py + sz - 12); ctx.lineTo(px - sz, py + sz); ctx.lineTo(px - sz + 12, py + sz);
            ctx.moveTo(px + sz, py + sz - 12); ctx.lineTo(px + sz, py + sz); ctx.lineTo(px + sz - 12, py + sz);
            ctx.stroke();

            // Background circular track
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(px, py, 26, 0, Math.PI * 2);
            ctx.stroke();

            // Progress arc (Cyan Neon)
            ctx.strokeStyle = '#48dbfb';
            ctx.shadowColor = 'rgba(72, 219, 251, 0.9)';
            ctx.shadowBlur = 14;
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.arc(px, py, 26, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * progress);
            ctx.stroke();

            // Center icon 👆
            ctx.save();
            ctx.translate(px, py);
            ctx.scale(-1, 1);
            ctx.font = '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👆', 0, 0);
            ctx.restore();

            // Header Badge (un-mirrored)
            ctx.save();
            ctx.translate(px, py - 46);
            ctx.scale(-1, 1);
            ctx.fillStyle = 'rgba(12, 8, 24, 0.92)';
            ctx.strokeStyle = 'rgba(72, 219, 251, 0.8)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(-80, -13, 160, 26, 13);
            ctx.fill();
            ctx.stroke();

            ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 0;
            ctx.fillText(`👆 "L" SIGN: ${Math.round(progress * 100)}%`, 0, 0);
            ctx.restore();
        }

        ctx.restore();
    }

    drawPeaceLockHUD() {
        if (this.peaceHoldTime <= 0 || !this.peaceHandPos) return;
        const ctx = this.ctx;
        const p = this.peaceHandPos;
        const progress = Math.min(1, this.peaceHoldTime / this.peaceHoldRequired);

        ctx.save();
        const my = Math.max(50, p.y - 45);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, my, 26, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#2ed573';
        ctx.shadowColor = 'rgba(46, 213, 115, 0.85)';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, my, 26, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * progress);
        ctx.stroke();

        // Center peace icon
        ctx.save();
        ctx.translate(p.x, my);
        ctx.scale(-1, 1);
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✌️', 0, 0);
        ctx.restore();

        // Text un-mirrored
        ctx.save();
        ctx.translate(p.x, my - 44);
        ctx.scale(-1, 1);
        ctx.fillStyle = 'rgba(12, 8, 24, 0.88)';
        ctx.strokeStyle = 'rgba(46, 213, 115, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-75, -12, 150, 24, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(`✌️ PHOTO LOCK: ${Math.round(progress * 100)}%`, 0, 0);
        ctx.restore();

        ctx.restore();
    }

    drawHeartLockHUD() {
        if (this.heartHoldTime <= 0 || !this.heartCenterPos) return;
        const ctx = this.ctx;
        const p = this.heartCenterPos;
        const progress = Math.min(1, this.heartHoldTime / this.heartHoldRequired);

        ctx.save();
        const my = p.y;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, my, 34, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ff4d88';
        ctx.shadowColor = 'rgba(255, 77, 136, 0.9)';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(p.x, my, 34, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * progress);
        ctx.stroke();

        // Pulsing heart inside lock ring
        ctx.save();
        ctx.translate(p.x, my);
        ctx.scale(-1, 1);
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', 0, 0);
        ctx.restore();

        // Text un-mirrored
        ctx.save();
        ctx.translate(p.x, my - 50);
        ctx.scale(-1, 1);
        ctx.fillStyle = 'rgba(12, 8, 24, 0.92)';
        ctx.strokeStyle = 'rgba(255, 77, 136, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-85, -13, 170, 26, 13);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(`🫶 HEART LOCK: ${Math.round(progress * 100)}%`, 0, 0);
        ctx.restore();

        ctx.restore();
    }

    drawPalmLockHUD() {
        if (this.palmHoldTime <= 0 || !this.palmHandPos) return;
        const ctx = this.ctx;
        const p = this.palmHandPos;
        const progress = Math.min(1, this.palmHoldTime / this.palmHoldRequired);

        ctx.save();
        const my = p.y;

        // Background ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, my, 32, 0, Math.PI * 2);
        ctx.stroke();

        // Progress arc (Vibrant Gold/Amber)
        ctx.strokeStyle = '#ffa502';
        ctx.shadowColor = 'rgba(255, 165, 2, 0.9)';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(p.x, my, 32, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * progress);
        ctx.stroke();

        // Center hand icon
        ctx.save();
        ctx.translate(p.x, my);
        ctx.scale(-1, 1);
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🖐️', 0, 0);
        ctx.restore();

        // Header Badge (un-mirrored)
        ctx.save();
        ctx.translate(p.x, my - 48);
        ctx.scale(-1, 1);
        ctx.fillStyle = 'rgba(12, 8, 24, 0.92)';
        ctx.strokeStyle = 'rgba(255, 165, 2, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-85, -13, 170, 26, 13);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(`🖐️ PALM PHOTO: ${Math.round(progress * 100)}%`, 0, 0);
        ctx.restore();

        ctx.restore();
    }

    drawNamasteLockHUD() {
        if (!this.poseHoldEnabled || this.poseHoldTime <= 0) return;
        const ctx = this.ctx;
        const progress = Math.min(1, this.poseHoldTime / this.poseHoldRequired);
        const mx = this.canvas.width * 0.5;
        const my = 42;

        ctx.save();
        ctx.translate(this.canvas.width, 0);
        ctx.scale(-1, 1);

        ctx.fillStyle = 'rgba(16, 10, 28, 0.88)';
        ctx.strokeStyle = 'rgba(255, 77, 136, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(255, 77, 136, 0.5)';
        ctx.beginPath();
        ctx.roundRect(mx - 100, my - 16, 200, 32, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 77, 136, 0.85)';
        ctx.beginPath();
        ctx.roundRect(mx - 94, my - 10, 188 * progress, 20, 10);
        ctx.fill();

        ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(`🙏 NAMASTE: ${Math.round(progress * 100)}%`, mx, my);
        ctx.restore();
    }

    initVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Web Speech API not supported in this browser.');
            this.showSignalToast('Voice recognition not supported in this browser', '⚠️');
            return false;
        }
        try {
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = false;
            rec.lang = 'en-US';

            const triggerWords = ['cheese', 'photo', 'click', 'smile', 'capture', 'shoot', 'pic', 'tasveer', 'khicho', 'kheecho'];

            rec.onresult = (e) => {
                if (this.isCountingDown) return;
                const last = e.results.length - 1;
                const phrase = e.results[last][0].transcript.trim().toLowerCase();
                for (const word of triggerWords) {
                    if (phrase.includes(word)) {
                        this.showSignalToast(`Heard "${word.toUpperCase()}"!`, '🎙️');
                        const delay = this.timerDuration > 0 ? this.timerDuration : 3;
                        this.startCountdown(delay, `🎙️ Heard "${word}"`);
                        break;
                    }
                }
            };

            rec.onerror = (e) => {
                console.warn('Speech recognition error:', e.error);
            };

            rec.onend = () => {
                if (this.voiceTriggerEnabled) {
                    try { rec.start(); } catch (err) {}
                }
            };

            this.speechRecognition = rec;
            return true;
        } catch (err) {
            console.warn('Voice recognition init failed:', err);
            return false;
        }
    }

    toggleVoice(enable) {
        this.voiceTriggerEnabled = enable;
        if (enable) {
            if (!this.speechRecognition) {
                this.initVoiceRecognition();
            }
            try {
                this.speechRecognition?.start();
                this.showSignalToast('Voice Active: Say "Cheese" or "Photo"!', '🎙️');
            } catch (e) {
                console.warn('Speech start warning:', e);
            }
        } else {
            try {
                this.speechRecognition?.stop();
                this.showSignalToast('Voice Trigger Disabled', '🔇');
            } catch (e) {}
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        for (const p of this.particles) {
            p.cw = this.canvas.width;
            p.ch = this.canvas.height;
        }
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < 65; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    initButterflies() {
        this.butterflies = [];
        for (let i = 0; i < 3; i++) {
            this.butterflies.push(new RealisticButterfly(this.canvas.width, this.canvas.height, i));
        }
        this.bees = [];
        for (let i = 0; i < 2; i++) {
            this.bees.push(new HoneyBee(this.canvas.width, this.canvas.height, i));
        }
    }

    // ----------------------------------------------------------------------
    // MediaPipe Hand Tracking Setup
    // ----------------------------------------------------------------------
    initHandTracking() {
        try {
            if (typeof Hands === 'undefined') {
                this.loadingStatus.textContent = 'Running in offline/manual mode';
                setTimeout(() => this.loadingEl?.classList.add('hidden'), 1200);
                return;
            }

            const hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
            });

            hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.65,
                minTrackingConfidence: 0.5,
            });

            hands.onResults((r) => this.onHandResults(r));

            const cam = new Camera(this.video, {
                onFrame: async () => {
                    await hands.send({ image: this.video });
                },
                width: 1280,
                height: 720,
            });

            cam.start()
                .then(() => {
                    this.isCameraActive = true;
                    setTimeout(() => this.loadingEl?.classList.add('hidden'), 500);
                })
                .catch((err) => {
                    console.warn('Camera permission denied or camera not found:', err);
                    this.loadingStatus.textContent = 'Camera not available. Using manual controls!';
                    setTimeout(() => {
                        this.loadingEl?.classList.add('hidden');
                        this.manualDrawer?.classList.add('open');
                        this.isManualActive = true;
                        this.targetGrowth = 0.8;
                        this.targetBloom = 0.6;
                    }, 1200);
                });
        } catch (e) {
            console.error('Hand tracking init error:', e);
            this.loadingEl?.classList.add('hidden');
        }
    }

    onHandResults(results) {
        this.handLandmarks = results.multiHandLandmarks || [];
        this.handHandedness = results.multiHandedness || [];
        this.handsDetected = this.handLandmarks.length;

        let leftPinch = 0;
        let rightPinch = 0;
        let hasLeft = false;
        let hasRight = false;

        let windSum = 0;
        let windCount = 0;

        if (this.handsDetected > 0) {
            for (let i = 0; i < this.handsDetected; i++) {
                const hand = this.handLandmarks[i];
                const handedness = results.multiHandedness[i];
                const isLeft = handedness && handedness.label === 'Left';
                const handKey = isLeft ? 'Left' : 'Right';
                const pinch = this.calcPinchDistance(hand);

                if (isLeft) {
                    leftPinch = pinch;
                    hasLeft = true;
                } else {
                    rightPinch = pinch;
                    hasRight = true;
                }

                // Per-hand velocity tracking with deadzone
                const c = this.palmCenter(hand);
                if (this.prevHands[handKey]) {
                    const dx = c.x - this.prevHands[handKey].x;
                    // Deadzone: slow movements (raising hand, pinching) do NOT trigger wind!
                    if (Math.abs(dx) > 0.03) {
                        windSum += (dx - Math.sign(dx) * 0.03) * 5;
                        windCount++;
                    }
                }
                this.prevHands[handKey] = { x: c.x, y: c.y };

                // Fairy Dust Sparkles from Index Fingertip (landmark 8)
                const indexTip = hand[8];
                if (indexTip) {
                    const fx = indexTip.x * this.canvas.width;
                    const fy = indexTip.y * this.canvas.height;
                    const hue = isLeft ? 335 : 155;
                    this.fairyDusts.push(new FairyDust(fx, fy, hue));
                    if (Math.random() < 0.4) {
                        this.fairyDusts.push(new FairyDust(fx, fy, hue));
                    }
                }
            }

            if (windCount > 0) {
                this.targetWindForce = Math.max(-1.0, Math.min(1.0, windSum / windCount));
            } else {
                this.targetWindForce *= 0.85; // Quickly decay when hands aren't waving fast
            }

            if (!this.isManualActive) {
                // Left Hand controls Bloom
                this.targetBloom = hasLeft ? leftPinch : this.targetBloom * 0.98;
                // Right Hand controls Growth
                this.targetGrowth = hasRight ? rightPinch : this.targetGrowth * 0.98;
            }
        } else if (!this.isManualActive) {
            this.prevHands = {};
            this.targetBloom *= 0.96;
            this.targetGrowth *= 0.96;
            this.targetWindForce *= 0.85;
        }

        // Sound trigger
        this.sound.updateBloomSound(this.bloom);
    }

    calcPinchDistance(lm) {
        const thumb = lm[4];
        const index = lm[8];
        const wrist = lm[0];
        const mcp = lm[9];

        const ref = Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y);
        if (ref < 0.01) return 0;

        const dist = Math.hypot(thumb.x - index.x, thumb.y - index.y);
        return Math.min(1, Math.max(0, (dist / ref - 0.15) * 1.6));
    }

    palmCenter(lm) {
        const ids = [0, 5, 9, 13, 17];
        let x = 0, y = 0;
        for (const i of ids) { x += lm[i].x; y += lm[i].y; }
        return { x: x / ids.length, y: y / ids.length };
    }

    // ----------------------------------------------------------------------
    // HIGH-RES PHOTO SNAPSHOT
    // ----------------------------------------------------------------------
    takeSnapshot() {
        this.lastSnapTime = Date.now();
        this.sound.playCameraShutter();

        // Screen Flash Effect
        this.flashOverlay.classList.add('active');
        setTimeout(() => this.flashOverlay.classList.remove('active'), 500);

        // Offscreen canvas merging video and drawing
        const snapCanvas = document.createElement('canvas');
        snapCanvas.width = this.canvas.width;
        snapCanvas.height = this.canvas.height;
        const sctx = snapCanvas.getContext('2d');

        // Draw webcam frame (mirrored)
        if (this.isCameraActive && this.video.videoWidth) {
            sctx.save();
            sctx.translate(snapCanvas.width, 0);
            sctx.scale(-1, 1);
            sctx.drawImage(this.video, 0, 0, snapCanvas.width, snapCanvas.height);
            sctx.restore();
        } else {
            // Dark gradient backdrop fallback
            const grad = sctx.createRadialGradient(
                snapCanvas.width * 0.5, snapCanvas.height * 0.5, 50,
                snapCanvas.width * 0.5, snapCanvas.height * 0.5, snapCanvas.width * 0.8
            );
            grad.addColorStop(0, '#190a28');
            grad.addColorStop(1, '#050209');
            sctx.fillStyle = grad;
            sctx.fillRect(0, 0, snapCanvas.width, snapCanvas.height);
        }

        // Draw flower overlay (mirrored to match user perspective)
        sctx.save();
        sctx.translate(snapCanvas.width, 0);
        sctx.scale(-1, 1);
        sctx.drawImage(this.canvas, 0, 0);
        sctx.restore();

        // Watermark signature branding
        sctx.save();
        sctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
        sctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        sctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        sctx.shadowBlur = 8;
        sctx.fillText('✿ AR Flowers — Created by Ankita', 30, snapCanvas.height - 30);
        sctx.restore();

        // Download trigger
        const link = document.createElement('a');
        link.download = `ar-bloom-${Date.now()}.png`;
        link.href = snapCanvas.toDataURL('image/png');
        link.click();

        // Show toast
        this.snapshotToast.classList.add('show');
        setTimeout(() => this.snapshotToast.classList.remove('show'), 3500);
    }

    // ======================================================================
    // PROCEDURAL FLOWER DRAWING ALGORITHMS
    // ======================================================================

    // 1. TULIP (Classic Red/Pink Layered Bloom)
    drawTulip(ctx, scale, bloom, windAngle) {
        const bloomScaleFactor = 1.0 + bloom * 0.2;
        const adjustedScale = scale * bloomScaleFactor;
        const hue = 345;
        const sat = 85;
        const light = 55;

        const maxPetalLen = 85 * adjustedScale;

        // Back petals
        const backPetals = [
            { angle: 0, lengthMul: 1.0, widthMul: 0.4, hueOffset: 0, lightOffset: -4 },
            { angle: -0.15 - bloom * 0.7, lengthMul: 0.95, widthMul: 0.38, hueOffset: 10, lightOffset: -2 },
            { angle: 0.15 + bloom * 0.7, lengthMul: 0.95, widthMul: 0.38, hueOffset: 10, lightOffset: -2 }
        ];

        for (const p of backPetals) {
            const flutter = this.noise.get(this.time * 1.2 + p.angle * 10, 3) * 0.04 * (1 + bloom);
            const finalAngle = p.angle + flutter + windAngle * 0.1;
            const len = maxPetalLen * p.lengthMul;
            const wid = maxPetalLen * p.widthMul * (0.6 + bloom * 0.8);
            this.drawTulipPetal(ctx, finalAngle, len, wid, hue + p.hueOffset, sat, light + p.lightOffset, bloom);
        }

        // Center Pistil and Stamens
        if (bloom > 0.15) {
            ctx.save();
            ctx.fillStyle = `rgba(180, 230, 100, ${bloom})`;
            ctx.beginPath();
            ctx.arc(0, -maxPetalLen * 0.22, 5 * adjustedScale, 0, Math.PI * 2);
            ctx.fill();

            const stamenCount = 5;
            for (let i = 0; i < stamenCount; i++) {
                const a = (i / stamenCount) * Math.PI * 2 + this.time * 0.5;
                const r = 9 * adjustedScale * bloom;
                const sx = Math.cos(a) * r;
                const sy = -maxPetalLen * 0.22 + Math.sin(a) * r;

                ctx.strokeStyle = `rgba(240, 215, 90, ${bloom * 0.8})`;
                ctx.lineWidth = 1.5 * adjustedScale;
                ctx.beginPath();
                ctx.moveTo(0, -maxPetalLen * 0.1);
                ctx.lineTo(sx, sy);
                ctx.stroke();

                ctx.fillStyle = `rgba(255, 240, 140, ${bloom})`;
                ctx.beginPath();
                ctx.arc(sx, sy, 2.5 * adjustedScale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Front petals
        const frontPetals = [
            { angle: -0.05 - bloom * 0.55, lengthMul: 0.9, widthMul: 0.35, hueOffset: 5, lightOffset: 2 },
            { angle: 0.05 + bloom * 0.55, lengthMul: 0.9, widthMul: 0.35, hueOffset: 5, lightOffset: 2 },
            { angle: 0, lengthMul: 0.85, widthMul: 0.32, hueOffset: -5, lightOffset: 5 }
        ];

        for (const p of frontPetals) {
            const flutter = this.noise.get(this.time * 1.4 + p.angle * 10, 4) * 0.03 * (1 + bloom);
            const finalAngle = p.angle + flutter + windAngle * 0.05;
            const len = maxPetalLen * p.lengthMul;
            const wid = maxPetalLen * p.widthMul * (0.65 + bloom * 0.75);
            this.drawTulipPetal(ctx, finalAngle, len, wid, hue + p.hueOffset, sat, light + p.lightOffset, bloom);
        }
    }

    drawTulipPetal(ctx, angle, length, width, hue, sat, light, bloom) {
        ctx.save();
        ctx.rotate(angle);

        const grad = ctx.createLinearGradient(0, 0, 0, -length);
        grad.addColorStop(0, `hsla(${hue + 25}, ${sat}%, ${light - 8}%, 0.92)`);
        grad.addColorStop(0.4, `hsla(${hue}, ${sat}%, ${light}%, 0.88)`);
        grad.addColorStop(0.85, `hsla(${hue - 10}, ${sat + 10}%, ${light + 10}%, 0.88)`);
        grad.addColorStop(1, `hsla(${hue - 20}, ${sat + 15}%, ${light + 18}%, 0.95)`);

        ctx.fillStyle = grad;
        ctx.shadowBlur = 12 + bloom * 18;
        ctx.shadowColor = `hsla(${hue}, 100%, 65%, ${0.25 + bloom * 0.4})`;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-width * 1.1, -length * 0.3, -width * 0.9, -length * 0.85, 0, -length);
        ctx.bezierCurveTo(width * 0.9, -length * 0.85, width * 1.1, -length * 0.3, 0, 0);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = `hsla(${hue + 15}, ${sat}%, ${light + 15}%, 0.25)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -length * 0.85);
        ctx.stroke();

        ctx.restore();
    }

    // 2. ROSE (Deep Velvet Layered Spiral Petals)
    drawRose(ctx, scale, bloom, windAngle) {
        const adjustedScale = scale * (0.95 + bloom * 0.28);
        const hue = 350;
        const sat = 90;
        const light = 48;

        const maxR = 68 * adjustedScale;
        const layers = 5;

        // Outer layers to inner tight bud
        for (let l = layers; l >= 1; l--) {
            const layerBloom = Math.min(1, bloom * (1.3 - l * 0.15));
            const petalCount = 3 + l;
            const radius = (maxR * (l / layers)) * (0.4 + layerBloom * 0.6);

            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2 + (l * 0.8) + (windAngle * 0.05);
                const flutter = this.noise.get(this.time * 0.8 + i, l) * 0.08 * layerBloom;

                ctx.save();
                ctx.rotate(angle + flutter);
                ctx.translate(0, -radius * 0.45);

                const pw = radius * 0.65 * (0.5 + layerBloom * 0.5);
                const ph = radius * 0.75 * (0.6 + layerBloom * 0.4);

                const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, ph);
                grad.addColorStop(0, `hsla(${hue + 10}, ${sat}%, ${light + 18}%, 0.95)`);
                grad.addColorStop(0.65, `hsla(${hue}, ${sat}%, ${light}%, 0.9)`);
                grad.addColorStop(1, `hsla(${hue - 15}, ${sat + 5}%, ${light - 16}%, 0.95)`);

                ctx.fillStyle = grad;
                ctx.shadowBlur = 10 + bloom * 12;
                ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.35)`;

                ctx.beginPath();
                ctx.ellipse(0, 0, pw, ph, 0, 0, Math.PI * 2);
                ctx.fill();

                // Velvety petal curl highlight
                ctx.strokeStyle = `hsla(${hue + 15}, 100%, 78%, ${0.25 + layerBloom * 0.25})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(0, -ph * 0.4, pw * 0.8, Math.PI * 0.8, Math.PI * 0.2, true);
                ctx.stroke();

                ctx.restore();
            }
        }

        // Deep Rose Core Bud
        ctx.save();
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 16 * adjustedScale);
        coreGrad.addColorStop(0, `hsla(${hue - 10}, 100%, 25%, 1)`);
        coreGrad.addColorStop(1, `hsla(${hue}, 90%, 45%, 0.8)`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 14 * adjustedScale * (1 - bloom * 0.3), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // 3. LOTUS (Sacred Radiant Petals & Golden Center Seed Pod)
    drawLotus(ctx, scale, bloom, windAngle) {
        const adjustedScale = scale * (1.0 + bloom * 0.25);
        const hue = 325; // Gentle sacred pink
        const sat = 85;
        const light = 65;

        const maxPetalLen = 78 * adjustedScale;
        const tiers = [
            { count: 12, lenMul: 1.0, spread: 1.0, lOffset: -8 }, // Outer wide tier
            { count: 8, lenMul: 0.82, spread: 0.75, lOffset: 0 },  // Mid tier
            { count: 6, lenMul: 0.65, spread: 0.45, lOffset: 8 }   // Inner cupped tier
        ];

        tiers.forEach((tier, tIdx) => {
            const spreadAngle = (0.2 + bloom * 0.8) * tier.spread;
            for (let i = 0; i < tier.count; i++) {
                const baseA = ((i / tier.count) * 2 - 1) * Math.PI * 0.48 * spreadAngle;
                const flutter = this.noise.get(this.time * 0.9 + i, tIdx + 2) * 0.05 * bloom;
                const angle = baseA + flutter + windAngle * 0.08;
                const len = maxPetalLen * tier.lenMul;
                const wid = len * 0.32 * (0.4 + bloom * 0.6);

                ctx.save();
                ctx.rotate(angle);

                const grad = ctx.createLinearGradient(0, 0, 0, -len);
                grad.addColorStop(0, '#ffffff'); // White glowing base
                grad.addColorStop(0.35, `hsla(${hue}, ${sat}%, ${light + tier.lOffset}%, 0.9)`);
                grad.addColorStop(1, `hsla(${hue - 15}, 95%, ${light - 10 + tier.lOffset}%, 0.95)`);

                ctx.fillStyle = grad;
                ctx.shadowBlur = 10 + bloom * 16;
                ctx.shadowColor = `hsla(${hue}, 100%, 75%, 0.35)`;

                // Lotus pointed petal shape
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-wid, -len * 0.4, -wid * 0.8, -len * 0.85, 0, -len);
                ctx.bezierCurveTo(wid * 0.8, -len * 0.85, wid, -len * 0.4, 0, 0);
                ctx.fill();

                ctx.restore();
            }
        });

        // Golden Seed Pod Receptacle
        if (bloom > 0.1) {
            ctx.save();
            ctx.shadowBlur = 14;
            ctx.shadowColor = 'rgba(255, 200, 50, 0.6)';
            ctx.fillStyle = `rgba(235, 190, 45, ${bloom})`;
            ctx.beginPath();
            ctx.ellipse(0, -maxPetalLen * 0.15, 14 * adjustedScale * bloom, 9 * adjustedScale * bloom, 0, 0, Math.PI * 2);
            ctx.fill();

            // Pod Seed holes
            ctx.fillStyle = 'rgba(120, 80, 10, 0.7)';
            for (let s = 0; s < 7; s++) {
                const sa = (s / 7) * Math.PI * 2;
                const sr = 6 * adjustedScale * bloom;
                ctx.beginPath();
                ctx.arc(Math.cos(sa) * sr, -maxPetalLen * 0.15 + Math.sin(sa) * sr * 0.6, 1.8 * adjustedScale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // 4. SUNFLOWER (Radiant Golden Ray Florets & Phyllotaxis Seed Disc)
    drawSunflower(ctx, scale, bloom, windAngle) {
        const adjustedScale = scale * (1.0 + bloom * 0.22);
        const rayCount = 24;
        const maxLen = 74 * adjustedScale;
        const discR = 32 * adjustedScale;

        // Two layers of yellow rays
        for (let layer = 0; layer < 2; layer++) {
            const offsetA = layer === 1 ? (Math.PI / rayCount) : 0;
            const layerScale = layer === 1 ? 0.9 : 1.0;

            for (let i = 0; i < rayCount; i++) {
                const angle = (i / rayCount) * Math.PI * 2 + offsetA;
                const flutter = this.noise.get(this.time * 0.7 + i, layer) * 0.04 * bloom;
                const len = maxLen * layerScale * (0.35 + bloom * 0.65);
                const wid = 14 * adjustedScale * (0.4 + bloom * 0.6);

                ctx.save();
                ctx.rotate(angle + flutter + windAngle * 0.03);
                ctx.translate(0, -discR * 0.7);

                const grad = ctx.createLinearGradient(0, 0, 0, -len);
                grad.addColorStop(0, '#ff9900');
                grad.addColorStop(0.5, '#ffcc00');
                grad.addColorStop(1, '#ffea6c');

                ctx.fillStyle = grad;
                ctx.shadowBlur = 8 + bloom * 12;
                ctx.shadowColor = 'rgba(255, 180, 0, 0.45)';

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-wid * 0.6, -len * 0.5, -wid * 0.2, -len * 0.9, 0, -len);
                ctx.bezierCurveTo(wid * 0.2, -len * 0.9, wid * 0.6, -len * 0.5, 0, 0);
                ctx.fill();

                ctx.restore();
            }
        }

        // Textured Seed Disc (Fibonacci Phyllotaxis Spiral)
        ctx.save();
        const discGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, discR);
        discGrad.addColorStop(0, '#2d1804');
        discGrad.addColorStop(0.7, '#4b2e0e');
        discGrad.addColorStop(1, '#664016');
        ctx.fillStyle = discGrad;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(0, 0, discR, 0, Math.PI * 2);
        ctx.fill();

        // Seed dots
        const seedCount = Math.floor(65 * (0.3 + bloom * 0.7));
        const goldenRatio = 2.39996; // ~137.5 degrees
        for (let s = 1; s <= seedCount; s++) {
            const a = s * goldenRatio;
            const r = Math.sqrt(s / 65) * (discR - 4);
            const sx = Math.cos(a) * r;
            const sy = Math.sin(a) * r;

            ctx.fillStyle = s % 2 === 0 ? 'rgba(255, 190, 70, 0.65)' : 'rgba(100, 60, 20, 0.8)';
            ctx.beginPath();
            ctx.arc(sx, sy, 1.6 * adjustedScale, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // 5. SAKURA / CHERRY BLOSSOM (Notched Delicate Pink Petals)
    drawSakura(ctx, scale, bloom, windAngle) {
        const adjustedScale = scale * (1.05 + bloom * 0.25);
        const petalCount = 5;
        const maxLen = 65 * adjustedScale;

        // 5 Cherry Blossom Petals
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2 + (windAngle * 0.04);
            const flutter = this.noise.get(this.time + i * 2, 6) * 0.05 * bloom;
            const len = maxLen * (0.35 + bloom * 0.65);
            const wid = len * 0.5;

            ctx.save();
            ctx.rotate(angle + flutter);

            const grad = ctx.createLinearGradient(0, 0, 0, -len);
            grad.addColorStop(0, '#ff4081');  // Deep magenta center
            grad.addColorStop(0.4, '#ff80ab'); // Soft blush
            grad.addColorStop(0.9, '#ffffff'); // White tips
            grad.addColorStop(1, '#ffc4d6');

            ctx.fillStyle = grad;
            ctx.shadowBlur = 12 + bloom * 16;
            ctx.shadowColor = 'rgba(255, 100, 160, 0.35)';

            // Petal with the famous Sakura cleft/notch at the tip
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-wid * 0.8, -len * 0.4, -wid, -len * 0.85, -wid * 0.4, -len);
            ctx.quadraticCurveTo(0, -len * 0.85, wid * 0.4, -len); // Center heart notch
            ctx.bezierCurveTo(wid, -len * 0.85, wid * 0.8, -len * 0.4, 0, 0);
            ctx.fill();

            ctx.restore();
        }

        // Delicate Crimson Center Eye & Slender Radiating Stamens
        if (bloom > 0.15) {
            ctx.save();
            ctx.fillStyle = `rgba(230, 20, 90, ${bloom * 0.9})`;
            ctx.beginPath();
            ctx.arc(0, 0, 8 * adjustedScale, 0, Math.PI * 2);
            ctx.fill();

            const stamenCount = 12;
            for (let s = 0; s < stamenCount; s++) {
                const a = (s / stamenCount) * Math.PI * 2 + this.time * 0.3;
                const r = 18 * adjustedScale * bloom;
                const sx = Math.cos(a) * r;
                const sy = Math.sin(a) * r;

                ctx.strokeStyle = `rgba(255, 120, 180, ${bloom * 0.8})`;
                ctx.lineWidth = 1.2 * adjustedScale;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(sx, sy);
                ctx.stroke();

                ctx.fillStyle = `rgba(255, 230, 100, ${bloom})`;
                ctx.beginPath();
                ctx.arc(sx, sy, 2.2 * adjustedScale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Master Flower Head Switcher
    drawFlowerHead(cx, cy, bloom, windAngle, scale) {
        if (scale < 0.05) return;
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(cx, cy);

        // Ambient Background Glow Aura
        const glowR = (75 + bloom * 130) * scale;
        if (bloom > 0.02) {
            const glow = ctx.createRadialGradient(0, -glowR * 0.3, 0, 0, -glowR * 0.3, glowR);
            glow.addColorStop(0, `rgba(255, 80, 130, ${0.45 * bloom})`);
            glow.addColorStop(0.5, `rgba(255, 50, 100, ${0.2 * bloom})`);
            glow.addColorStop(1, 'rgba(255, 30, 70, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, -glowR * 0.3, glowR, 0, Math.PI * 2);
            ctx.fill();
        }

        // Delegate to active species renderer
        switch (this.species) {
            case 'rose':
                this.drawRose(ctx, scale, bloom, windAngle);
                break;
            case 'lotus':
                this.drawLotus(ctx, scale, bloom, windAngle);
                break;
            case 'sunflower':
                this.drawSunflower(ctx, scale, bloom, windAngle);
                break;
            case 'sakura':
                this.drawSakura(ctx, scale, bloom, windAngle);
                break;
            case 'tulip':
            default:
                this.drawTulip(ctx, scale, bloom, windAngle);
                break;
        }

        ctx.restore();
    }

    // ----------------------------------------------------------------------
    // STEM & BRANCHES (Ground Rooted Architecture)
    // ----------------------------------------------------------------------
    drawStem(baseX, baseY, height, windAngle) {
        const ctx = this.ctx;
        const segs = 24;
        const segH = height / segs;

        const pts = [{ x: baseX, y: baseY }];
        for (let i = 1; i <= segs; i++) {
            const t = i / segs;
            const windBend = windAngle * t * t * 40;
            const sway = this.noise.get(this.time * 0.6 + i * 0.25, 0) * 10 * t;
            pts.push({
                x: baseX + windBend + sway,
                y: baseY - segH * i,
            });
        }

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer glow
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(40, 120, 35, 0.25)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(80, 180, 60, 0.3)';
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();

        // Core stem
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#3a8a30';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();

        this.drawLeaves(pts);
        ctx.restore();

        return { tip: pts[pts.length - 1], pts };
    }

    drawLeaves(stemPts) {
        const ctx = this.ctx;
        const positions = [0.25, 0.45, 0.65];

        for (let li = 0; li < positions.length; li++) {
            const idx = Math.floor(positions[li] * (stemPts.length - 1));
            const pt = stemPts[idx];
            const side = li % 2 === 0 ? 1 : -1;
            const len = 22 + this.growth * 18;
            const angle = side * (0.45 + this.noise.get(this.time * 0.6 + li * 3, 2) * 0.2);

            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(angle);

            const grad = ctx.createLinearGradient(0, 0, len, 0);
            grad.addColorStop(0, 'rgba(55, 140, 45, 0.85)');
            grad.addColorStop(1, 'rgba(75, 170, 60, 0.45)');
            ctx.fillStyle = grad;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(80, 200, 60, 0.25)';

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(len * 0.5, -10, len, -1);
            ctx.quadraticCurveTo(len * 0.5, 10, 0, 0);
            ctx.fill();

            // Leaf vein
            ctx.strokeStyle = 'rgba(90, 180, 70, 0.35)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(3, 0);
            ctx.lineTo(len * 0.8, 0);
            ctx.stroke();

            ctx.restore();
        }
    }

    drawBranch(startX, startY, baseAngle, length, windAngle, scale) {
        const ctx = this.ctx;
        const segs = 12;
        const segL = length / segs;
        const pts = [{ x: startX, y: startY }];

        for (let i = 1; i <= segs; i++) {
            const t = i / segs;
            const windBend = windAngle * t * t * 15;
            const sway = this.noise.get(this.time * 0.8 + i * 0.3, 5) * 4 * t;
            const angle = baseAngle + windBend * 0.02 + sway * 0.01;
            pts.push({
                x: pts[pts.length - 1].x + Math.cos(angle) * segL + windBend * 0.3,
                y: pts[pts.length - 1].y + Math.sin(angle) * segL
            });
        }

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.lineWidth = 4 * scale;
        ctx.strokeStyle = 'rgba(40, 120, 35, 0.2)';
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();

        ctx.lineWidth = 2.5 * scale;
        ctx.strokeStyle = '#3a8a30';
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();

        ctx.restore();
        return pts[pts.length - 1];
    }

    // ----------------------------------------------------------------------
    // PALM AR MODE (FLOWER GROWS FROM HAND PALM)
    // ----------------------------------------------------------------------
    drawPalmFlower(hand, totalWind) {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // Palm center and wrist landmarks
        const palm = this.palmCenter(hand);
        const wrist = hand[0];
        const mcp = hand[9];

        const px = palm.x * cw;
        const py = palm.y * ch;
        const wx = wrist.x * cw;
        const wy = wrist.y * ch;

        // Upward vector along palm
        const palmAngle = Math.atan2(py - wy, px - wx) - Math.PI / 2;
        const flowerScale = 1.2 * (0.4 + this.growth * 0.8);
        const stemLength = (60 + this.growth * 110);

console.log("Snapshot merger ready.");