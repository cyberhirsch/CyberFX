// CyberFX engine — based on ZzFX (by Frank Force, MIT License).
// Credit to Frank Force for the ZzFX DSP architecture.
// Original: https://github.com/KilledByAPixel/ZzFX

class CyberFX extends SynthBase {

    name = "CyberFX";
    version = 1;
    file_extension = "cfx";
    tooltip = "CyberFX - Based on ZzFX by Frank Force. Tiny parametric sound generator optimized for games.";

    // Positional order for serialization
    static PARAM_ORDER = [
        "masterVolume", "randomness", "frequency",
        "attack", "sustain", "release",
        "shape", "shapeCurve",
        "slide", "deltaSlide",
        "pitchJump", "pitchJumpTime", "repeatTime",
        "noise", "modulation", "bitCrush",
        "delay", "sustainVolume", "decay", "tremolo", "filter",
        "sustainPunch", "compressionAmount", "min_frequency_relative_to_starting_frequency",
        "vibratoDepth", "vibratoSpeed", "overtones", "overtoneFalloff",
        "dutySweep", "flangerOffset", "flangerSweep",
        "lpFilterCutoffSweep", "lpFilterResonance", "hpFilterCutoffSweep", "bitCrushSweep"
    ];

    header_properties = ["shape"];
    permalocked = ["masterVolume"];
    hide_params = ["masterVolume"];

    param_info = [
        ["Sound Volume", "Overall volume of the current sound.", "masterVolume", 0.5, 0, 1],
        {
            type: "BUTTONSELECT",
            name: "shape",
            display_name: "",
            tooltip: "Waveform shape.",
            default_value: 0,
            columns: 3,
            header: true,
            values: [
                ["Sin", "Smooth sinusoidal wave.", 0],
                ["Triangle", "Linear triangle wave.", 1],
                ["Saw", "Sawtooth wave.", 2],
                ["Tan", "Tangent wave — produces distortion and unusual timbres.", 3],
                ["Noise", "Sinusoidal noise via sin(t^3) — organic, perlin-like.", 4],
                ["Sq Duty", "Square wave. Shape Curve controls the duty cycle (0–1).", 5],
                ["Whistle", "Sine wave with a high-frequency sine overlay.", 8],
                ["Breaker", "Quadratic toothed waveform.", 9],
                ["White", "Classic random white noise.", 6],
                ["Bitnoise", "Periodic 1-bit white noise.", 7],
            ]
        },
        ["Randomness", "Random pitch variation applied each time the sound plays.", "randomness", 0.05, 0, 0.5],
        ["Frequency", "Base frequency in Hz.", "frequency", 220, 20, 4400],
        ["Attack", "Volume attack duration in seconds.", "attack", 0, 0, 2],
        ["Decay", "Volume decay duration in seconds (Bfxr sustain stage).", "decay", 0, 0, 2],
        ["Sustain", "Volume sustain duration in seconds (Bfxr decay/fade stage).", "sustain", 0.3, 0, 2],
        ["Punch", "Tilts the sustain envelope for more 'pop'.", "sustainPunch", 0, 0, 1],
        ["Release", "Volume release tail after decay.", "release", 0.4, 0, 2],
        ["Sustain Vol", "Volume level during the release tail.", "sustainVolume", 1, 0, 1],
        ["Shape Curve / Square Duty", "Applies a power curve to the wave. For Sq Duty: controls duty cycle.", "shapeCurve", 1, 0, 3],
        ["Duty Sweep", "Square waveform only: Sweeps the duty up or down.", "dutySweep", 0, -1, 1],
        ["Frequency Slide", "Frequency slide rate.", "slide", 0, -1, 1],
        ["Delta Slide", "Accelerates the frequency slide.", "deltaSlide", 0, -1, 1],
        ["Frequency Cutoff", "Sound will stop if frequency drops below this value.", "min_frequency_relative_to_starting_frequency", 0, 0, 1],
        ["Pitch Jump", "Sudden pitch jump amount.", "pitchJump", 0, -1, 1],
        ["Jump Time", "Delay before the pitch jump fires.", "pitchJumpTime", 0, 0, 1],
        ["Repeat Time", "Envelope repeat period. 0 = no repeat.", "repeatTime", 0, 0, 1],
        ["Vibrato Depth", "Strength of the vibrato effect.", "vibratoDepth", 0, 0, 1],
        ["Vibrato Speed", "Speed of the vibrato effect.", "vibratoSpeed", 0, 0, 1],
        ["Harmonics", "Overlays copies of the waveform.", "overtones", 0, 0, 1],
        ["Harmonics Falloff", "Rate at which higher overtones decay.", "overtoneFalloff", 0, 0, 1],
        ["Noise", "Sinusoidal noise applied to frequency.", "noise", 0, 0, 1],
        ["Modulation", "Ring modulation frequency.", "modulation", 0, 0, 1],
        ["Bit Crush", "Reduces sample rate for lo-fi effect.", "bitCrush", 0, 0, 1],
        ["Bit Crush Sweep", "Sweeps the bit crush effect.", "bitCrushSweep", 0, -1, 1],
        ["Flanger Offset", "Offsets a second copy of the wave.", "flangerOffset", 0, -1, 1],
        ["Flanger Sweep", "Sweeps the flanger offset.", "flangerSweep", 0, -1, 1],
        ["Delay", "Echo delay duration in seconds.", "delay", 0, 0, 1],
        ["Tremolo", "Amplitude tremolo depth.", "tremolo", 0, 0, 1],
        ["Filter", "Low/High-pass filter. Positive = low-pass, negative = high-pass.", "filter", 0, -1, 1],
        ["Filter Sweep", "Sweeps the filter frequency.", "lpFilterCutoffSweep", 0, -1, 1],
        ["Filter Resonance", "Changes the attenuation rate for the filter.", "lpFilterResonance", 0, 0, 1],
        ["Compression", "Pushes amplitudes together into a narrower range.", "compressionAmount", 0, 0, 1],
    ];

    constructor() {
        super();
        this.post_initialize();
    }

    generate_sound() {
        // CyberFX DSP — ported to match Bfxr's formulas exactly for all shared parameters.
        // Period-based oscillator with 8× supersampling, multiplicative slide, Bfxr one-pole
        // filter, state-based flanger, and Bfxr sample-and-hold bit crush.
        const p = this.params;
        const SR = SAMPLE_RATE;
        const PI2 = Math.PI * 2;
        const abs = Math.abs;
        const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;

        // === FREQUENCY → PERIOD (samples per cycle, like Bfxr) ===
        const startFreq = p.frequency * (1 + p.randomness * 2 * Math.random() - p.randomness);
        let period = SR / startFreq;
        const startPeriod = period;

        // === SLIDE — multiplicative, Bfxr formula ===
        // p.slide range -1..1 matches Bfxr frequency_slide
        let slideRate = 1.0 - p.slide * p.slide * p.slide * 0.01;
        const startSlideRate = slideRate;
        const deltaSlideAccel = -p.deltaSlide * p.deltaSlide * p.deltaSlide * 0.000001;

        // === MIN FREQUENCY — Bfxr power-law (period grows → freq drops below min → mute) ===
        const mfParam = p.min_frequency_relative_to_starting_frequency;
        const maxPeriod = mfParam > 0 ? SR / (Math.pow(mfParam, 0.4) * startFreq) : Infinity;

        // === VIBRATO — Bfxr formula (no PI2 on sin argument) ===
        const vibratoSpeed     = p.vibratoSpeed * p.vibratoSpeed * 0.01;
        const vibratoAmplitude = p.vibratoDepth * 0.5;
        let vibratoPhase = 0;

        // === PITCH JUMP — multiplicative to period, Bfxr formula ===
        // p.pitchJump range -1..1 matches Bfxr pitch_jump_amount
        const pja = p.pitchJump;
        const jumpMultiplier = pja >= 0
            ? 1.0 - pja * pja * 0.9
            : 1.0 + pja * pja * 10.0;

        // === ENVELOPE lengths in samples ===
        // Bfxr stages: attack → sustain-with-punch (= p.decay) → fade-to-zero (= p.sustain)
        // CyberFX param names kept as-is; decay=Bfxr sustain stage, sustain=Bfxr decay stage
        const attackSamples  = p.attack  * SR || 9;
        const decaySamples   = p.decay   * SR;      // Bfxr stage 1: flat with punch
        const sustainSamples = p.sustain * SR;       // Bfxr stage 2: fade to 0
        const releaseSamples = p.release * SR;       // CyberFX-only tail
        const delaySamples   = p.delay   * SR;
        const length = attackSamples + decaySamples + sustainSamples + releaseSamples + delaySamples | 0;
        if (length <= 0) return;

        // Pitch jump fires at this sample (Bfxr: onset_percent * length + 32; 0 = never)
        const pitchJumpSample = p.pitchJumpTime < 1.0 ? p.pitchJumpTime * length + 32 : 0;
        let pitchJumpApplied = false;

        // === SQUARE DUTY — Bfxr convention: duty = 0.5 − squareDuty_param × 0.5 ===
        // SaveLoad sets shapeCurve = bfxr.squareDuty × 2, so squareDuty_param = shapeCurve/2
        const initSquareDuty = 0.5 - (p.shapeCurve / 2) * 0.5;
        let squareDuty = initSquareDuty;
        const squareDutySweep = -p.dutySweep * 0.00005; // Bfxr formula

        // === FLANGER — state-based accumulation (like Bfxr) ===
        const initFlangerOffset = p.flangerOffset * p.flangerOffset * 1020.0 * (p.flangerOffset < 0 ? -1 : 1);
        let flangerOffset = initFlangerOffset;
        const flangerDelta  = p.flangerSweep * p.flangerSweep * p.flangerSweep * 0.2;
        const flangerActive = p.flangerOffset !== 0 || p.flangerSweep !== 0;
        const flangerBuffer = new Float32Array(1024);
        let flangerPos = 0;

        // Helper: compute LP filter damping from current cutoff + resonance (Bfxr formula)
        const calcDamping = (cutoff) => {
            let d = 5.0 / (1.0 + p.lpFilterResonance * p.lpFilterResonance * 20.0) * (0.01 + cutoff);
            return 1.0 - clamp(d, 0, 0.8);
        };

        // === LP FILTER — Bfxr one-pole state-variable ===
        const filterParam     = p.filter;
        const initLpCutoff    = filterParam > 0 ? filterParam * filterParam * filterParam * 0.1 : 0;
        let lpFilterCutoff    = initLpCutoff;
        const lpFilterDeltaCutoff = 1.0 + p.lpFilterCutoffSweep * 0.0001;
        const lpFilterOn      = filterParam > 0 && filterParam < 1.0;
        let lpFilterDamping   = calcDamping(lpFilterCutoff);
        let lpFilterPos = 0, lpFilterDeltaPos = 0, lpFilterOldPos = 0;

        // === HP FILTER — Bfxr one-pole (negative filter param activates HP) ===
        const hpParam      = filterParam < 0 ? -filterParam : 0;
        const initHpCutoff = hpParam * hpParam * 0.1;
        let hpFilterCutoff = initHpCutoff;
        const hpFilterDeltaCutoff = 1.0 + (p.hpFilterCutoffSweep || 0) * 0.0003;
        let hpFilterPos    = 0;
        const filtersActive = lpFilterOn || hpFilterCutoff > 0;

        // === BIT CRUSH — Bfxr sample-and-hold with sweep ===
        const initBcFreq   = 1.0 - Math.pow(clamp(p.bitCrush, 0, 1), 1.0 / 3.0);
        let bitcrush_freq  = initBcFreq;
        let bitcrush_phase = 0;
        let bitcrush_last  = 0;
        const bitcrush_freq_sweep = -p.bitCrushSweep / length;

        // === REPEAT ===
        const repeatTimeSamples = p.repeatTime * SR | 0;
        let repeatCounter = 0;

        // === OVERTONES ===
        const overtones       = p.overtones * 10 | 0;
        const overtoneFalloff = p.overtoneFalloff;

        // === CyberFX-SPECIFIC params ===
        const modulation        = p.modulation * PI2 / SR;
        const noise             = p.noise;
        const masterVolume      = p.masterVolume;
        const sustainVolume     = p.sustainVolume;
        const sustainPunch      = p.sustainPunch;
        const compressionAmount = p.compressionAmount;
        const compression_factor = 1.0 / (1.0 + 4.0 * compressionAmount);
        const safeVolume = masterVolume || 1e-9;

        // === OSCILLATOR state ===
        let phase = 0; // integer phase counter 0..periodTemp-1 (like Bfxr)
        const noiseBuffer = new Array(32).fill(0).map(() => Math.random() * 2 - 1);
        let bitnoiseState = 1 << 14;
        let modOffset = 0;

        const b = [];

        for (let i = 0; i < length; i++) {

            // === REPEAT — partial reset (Bfxr resets sweeps but not period or envelope) ===
            if (repeatTimeSamples > 0 && ++repeatCounter >= repeatTimeSamples) {
                repeatCounter    = 0;
                slideRate        = startSlideRate;
                pitchJumpApplied = false;
                flangerOffset    = initFlangerOffset;
                lpFilterCutoff   = initLpCutoff;
                lpFilterDamping  = calcDamping(lpFilterCutoff);
                lpFilterPos = lpFilterDeltaPos = hpFilterPos = 0;
                hpFilterCutoff   = initHpCutoff;
                squareDuty       = initSquareDuty;
                bitcrush_freq    = initBcFreq;
            }

            // === PITCH JUMP ===
            if (!pitchJumpApplied && pitchJumpSample > 0 && i >= pitchJumpSample) {
                period *= jumpMultiplier;
                pitchJumpApplied = true;
            }

            // === SLIDE (Bfxr: period *= slideRate each sample) ===
            slideRate += deltaSlideAccel;
            period    *= slideRate;

            // === MIN FREQUENCY CHECK ===
            if (period > maxPeriod) {
                period = maxPeriod;
                if (mfParam > 0) break; // mute like Bfxr
            }

            // === VIBRATO (Bfxr: sin without PI2 on argument) ===
            let periodTemp = period;
            if (vibratoAmplitude > 0) {
                vibratoPhase += vibratoSpeed;
                periodTemp = period * (1.0 + Math.sin(vibratoPhase) * vibratoAmplitude);
            }
            periodTemp = Math.max(8, periodTemp | 0); // integer period, min 8 (Bfxr)

            // === NOISE — frequency modulation (CyberFX-specific) ===
            if (noise > 0) {
                const nfm = 1 + noise * Math.sin(Math.pow(i, 5));
                if (nfm > 0) periodTemp = Math.max(8, (periodTemp / nfm) | 0);
            }

            // === SQUARE DUTY SWEEP (Bfxr: once per output sample) ===
            if (p.shape === 5) {
                squareDuty = clamp(squareDuty + squareDutySweep, 0.001, 0.5);
            }

            // === FLANGER OFFSET SWEEP (Bfxr: once per output sample) ===
            if (flangerActive) flangerOffset += flangerDelta;

            // === HP FILTER CUTOFF SWEEP (Bfxr: once per output sample) ===
            if (filtersActive && hpFilterDeltaCutoff !== 1.0) {
                hpFilterCutoff = clamp(hpFilterCutoff * hpFilterDeltaCutoff, 0.00001, 0.1);
            }

            // === BIT CRUSH (Bfxr: sample-and-hold, once per output sample) ===
            bitcrush_phase += bitcrush_freq;
            let sampleUpdated = false;
            if (bitcrush_phase > 1) {
                bitcrush_phase = 0;
                sampleUpdated  = true;
            }
            const bcMult = lerp(1, 50 * bitcrush_freq, Math.sqrt(bitcrush_freq));
            bitcrush_freq = clamp(bitcrush_freq + bcMult * bitcrush_freq_sweep, 0.00001, 1);

            // === 8× SUPERSAMPLING (like Bfxr) ===
            let superSample = 0;
            for (let j = 0; j < 8; j++) {

                // Advance integer phase; refresh noise buffers at period boundary (Bfxr)
                if (++phase >= periodTemp) {
                    phase -= periodTemp;
                    if (p.shape === 6) { // White noise: new random values each period
                        for (let n = 0; n < 32; n++) noiseBuffer[n] = Math.random() * 2 - 1;
                    } else if (p.shape === 7) { // Bitnoise: advance SN76489 LFSR each period
                        const fb = ((bitnoiseState >> 1) & 1) ^ (bitnoiseState & 1);
                        bitnoiseState = (bitnoiseState >> 1) | (fb << 14);
                    }
                }

                let s = 0;
                let overtoneStrength = 1;
                for (let k = 0; k <= overtones; k++) {
                    const tempPhase = (phase * (k + 1)) % periodTemp;
                    const pos = tempPhase / periodTemp; // 0..1 fractional position in cycle
                    let s_k;
                    switch (p.shape) {
                        case 0: // Sin
                            s_k = Math.sin(pos * PI2); break;
                        case 1: // Triangle (matches Bfxr waveType 4)
                            s_k = Math.abs(1 - pos * 2) - 1; break;
                        case 2: // Saw (matches Bfxr waveType 1)
                            s_k = 1.0 - pos * 2.0; break;
                        case 3: // Tan (matches Bfxr waveType 6)
                            s_k = clamp(Math.tan(Math.PI * pos), -1, 1); break;
                        case 4: // CyberFX Noise: sin(angle³)
                            s_k = Math.sin(Math.pow(pos * PI2, 3)); break;
                        case 5: // Square with duty (matches Bfxr waveType 0)
                            s_k = pos < squareDuty ? 0.5 : -0.5; break;
                        case 6: // White noise — sampled from buffer (matches Bfxr waveType 3)
                            s_k = noiseBuffer[(tempPhase * 32 / periodTemp | 0) % 32]; break;
                        case 7: // Bitnoise — SN76489 LFSR (matches Bfxr waveType 9)
                            s_k = (~bitnoiseState & 1) - 0.5; break;
                        case 8: { // Whistle (matches Bfxr waveType 7)
                            const a1 = Math.sin(pos * PI2);
                            const a2 = Math.sin((tempPhase * 20 % periodTemp) / periodTemp * PI2);
                            s_k = 0.75 * a1 + 0.25 * a2; break;
                        }
                        case 9: // Breaker (matches Bfxr waveType 8)
                            s_k = Math.abs(1 - pos * pos * 2) - 1; break;
                        default:
                            s_k = Math.sin(pos * PI2);
                    }
                    s += s_k * overtoneStrength;
                    overtoneStrength *= (1 - overtoneFalloff);
                }

                // === LP + HP FILTER — Bfxr one-pole state-variable (inner loop) ===
                if (filtersActive) {
                    lpFilterOldPos  = lpFilterPos;
                    lpFilterCutoff  = clamp(lpFilterCutoff * lpFilterDeltaCutoff, 0, 0.1);
                    if (lpFilterOn) {
                        lpFilterDeltaPos += (s - lpFilterPos) * lpFilterCutoff;
                        lpFilterDeltaPos *= lpFilterDamping;
                    } else {
                        lpFilterPos = s; lpFilterDeltaPos = 0;
                    }
                    lpFilterPos += lpFilterDeltaPos;
                    hpFilterPos += lpFilterPos - lpFilterOldPos;
                    hpFilterPos *= (1.0 - hpFilterCutoff);
                    s = hpFilterPos;
                }

                // === FLANGER — Bfxr state-based (write + read ring buffer each inner sample) ===
                if (flangerActive) {
                    flangerBuffer[flangerPos & 1023] = s;
                    const fi = clamp(abs(flangerOffset) | 0, 0, 1023);
                    s += flangerBuffer[(flangerPos - fi + 1024) & 1023];
                    flangerPos = (flangerPos + 1) & 1023;
                }

                superSample += s;
            }

            // Clamp before averaging (Bfxr: ±8)
            superSample = clamp(superSample, -8, 8);

            // Bit crush: sample-and-hold
            if (sampleUpdated) bitcrush_last = superSample;
            superSample = bitcrush_last;

            // === ENVELOPE — Bfxr stages mapped to CyberFX param names ===
            // attack  → ramp 0→1  (Bfxr stage 0)
            // decay   → flat with sustainPunch taper  (Bfxr stage 1)
            // sustain → linear fade 1→0  (Bfxr stage 2)
            // release → scaled tail (CyberFX only, scaled by sustainVolume)
            let envVol;
            if (i < attackSamples) {
                envVol = i / attackSamples;
            } else if (i < attackSamples + decaySamples) {
                const t = (i - attackSamples) / (decaySamples || 1);
                envVol = 1.0 + (1.0 - t) * 2.0 * sustainPunch;            // Bfxr stage 1
            } else if (i < attackSamples + decaySamples + sustainSamples) {
                envVol = 1.0 - (i - attackSamples - decaySamples) / (sustainSamples || 1); // Bfxr stage 2
            } else {
                const remaining = length - delaySamples - i;
                envVol = releaseSamples > 0 ? clamp(remaining / releaseSamples, 0, 1) * sustainVolume : 0;
            }

            // masterVolume² × 0.125 averages the 8 supersamples (Bfxr convention)
            let sample = masterVolume * masterVolume * envVol * superSample * 0.125;

            // === RING MODULATION (CyberFX-specific) ===
            if (modulation > 0) sample *= Math.cos(modulation * modOffset++);

            // === DELAY / ECHO (CyberFX-specific) ===
            if (delaySamples > 0) {
                sample = delaySamples > i
                    ? sample / 2
                    : sample / 2 + (i < length - delaySamples ? 1 : (length - i) / delaySamples)
                      * (b[i - delaySamples | 0] || 0) / 2 / safeVolume;
            }

            // === COMPRESSION (Bfxr formula) ===
            if (compressionAmount > 0) {
                sample = sample > 0
                    ? Math.pow(sample, compression_factor)
                    : -Math.pow(-sample, compression_factor);
            }

            b[i] = sample;
        }

        const buffer = new Float32Array(b);
        if (buffer.length === 0) return;
        this.sound = RealizedSound.from_buffer(buffer);
    }

    serialize_sound(file_name, params_dict) {
        const arr = CyberFX.PARAM_ORDER.map(k => params_dict[k] ?? 0);
        return JSON.stringify({
            synth_type: this.name,
            version: this.version,
            file_name: file_name,
            params: arr
        }, null, 2);
    }

    deserialize_params(data) {
        if (Array.isArray(data.params)) {
            const defaults = this.default_params();
            const result = {};
            CyberFX.PARAM_ORDER.forEach((k, i) => {
                result[k] = (data.params[i] != null) ? data.params[i] : defaults[k];
            });
            return result;
        }

        // Native CyberFX or fallback
        return data.params || data;
    }
}
