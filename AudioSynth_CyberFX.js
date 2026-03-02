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
        ["Decay", "Volume decay duration in seconds.", "decay", 0, 0, 2],
        ["Sustain", "Volume sustain duration in seconds.", "sustain", 0.3, 0, 2],
        ["Punch", "Tilts the sustain envelope for more 'pop'.", "sustainPunch", 0, 0, 1],
        ["Release", "Volume release duration in seconds.", "release", 0.4, 0, 2],
        ["Sustain Vol", "Volume level during the sustain phase.", "sustainVolume", 1, 0, 1],
        ["Shape Curve / Square Duty", "Applies a power curve to the wave. For Sq Duty: controls duty cycle.", "shapeCurve", 1, 0, 3],
        ["Duty Sweep", "Square waveform only: Sweeps the duty up or down.", "dutySweep", 0, -1, 1],
        ["Frequency Slide", "Frequency slide rate.", "slide", 0, -10, 10],
        ["Delta Slide", "Accelerates the frequency slide.", "deltaSlide", 0, -10, 10],
        ["Frequency Cutoff", "Sound will stop if frequency drops below this value.", "min_frequency_relative_to_starting_frequency", 0, 0, 1],
        ["Pitch Jump", "Sudden pitch jump amount.", "pitchJump", 0, -1000, 1000],
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
        ["Filter", "Biquad filter. Positive = low-pass, negative = high-pass.", "filter", 0, -1, 1],
        ["Filter Sweep", "Sweeps the filter frequency.", "lpFilterCutoffSweep", 0, -1, 1],
        ["Filter Resonance", "Changes the attenuation rate for the filter.", "lpFilterResonance", 0, 0, 1],
        ["Compression", "Pushes amplitudes together into a narrower range.", "compressionAmount", 0, 0, 1],
    ];

    constructor() {
        super();
        this.post_initialize();
    }

    generate_sound() {
        // CyberFX DSP — adapted from ZzFX by Frank Force (MIT License)
        const p = this.params;
        const sampleRate = SAMPLE_RATE;

        let volume = p.masterVolume,
            randomness = p.randomness,
            frequency = p.frequency,
            attack = p.attack,
            sustain = p.sustain,
            release = p.release,
            shape = p.shape | 0,
            shapeCurve = p.shapeCurve,
            slide = p.slide,
            deltaSlide = p.deltaSlide,
            pitchJump = p.pitchJump,
            pitchJumpTime = p.pitchJumpTime,
            repeatTime = p.repeatTime,
            noise = p.noise,
            modulation = p.modulation,
            bitCrush = p.bitCrush,
            delay = p.delay,
            sustainVolume = p.sustainVolume,
            decay = p.decay,
            tremolo = p.tremolo,
            filter = p.filter,
            sustainPunch = p.sustainPunch,
            compressionAmount = p.compressionAmount,
            minFrequency = p.min_frequency_relative_to_starting_frequency,
            vibratoDepth = p.vibratoDepth,
            vibratoSpeed = p.vibratoSpeed * p.vibratoSpeed * 0.01,
            overtones = p.overtones * 10,
            overtoneFalloff = p.overtoneFalloff,
            dutySweep = p.dutySweep * 0.00005,
            flangerOffset = p.flangerOffset * p.flangerOffset * 1020 * (p.flangerOffset < 0 ? -1 : 1),
            flangerSweep = p.flangerSweep * p.flangerSweep * p.flangerSweep * 0.2,
            filterSweep = 1.0 + p.lpFilterCutoffSweep * 0.0003,
            filterRes = p.lpFilterResonance,
            bitCrushSweep = p.bitCrushSweep;

        const PI2 = Math.PI * 2;
        const abs = Math.abs;
        const sign = v => v < 0 ? -1 : 1;

        // Prevent divide-by-zero in delay feedback formula
        const safeVolume = volume || 1e-9;

        let startSlide = slide *= 500 * PI2 / sampleRate / sampleRate,
            startFrequency = frequency *= (1 + randomness * 2 * Math.random() - randomness) * PI2 / sampleRate,
            modOffset = 0,
            repeat = 0,
            crush = 0,
            jump = 1,
            bitnoiseState = 1 << 14,
            length,
            b = [],
            t = 0,
            i = 0,
            s = 0,
            f,

            quality = 2,
            w = Math.PI * abs(filter),
            cos = Math.cos(w),
            alpha = Math.sin(w) / 2 / quality,
            a0 = 1 + alpha,
            a1 = -2 * cos / a0,
            a2 = (1 - alpha) / a0,
            b0 = (1 + sign(filter) * cos) / 2 / a0,
            b1 = -(sign(filter) + cos) / a0,
            b2 = b0,
            x2 = 0, x1 = 0, y2 = 0, y1 = 0;

        // Convert minFrequency from 0-1 relative fraction to actual rad/sample threshold
        if (minFrequency > 0) minFrequency *= startFrequency;

        attack = attack * sampleRate || 9;
        decay *= sampleRate;
        sustain *= sampleRate;
        release *= sampleRate;
        delay *= sampleRate;
        deltaSlide *= 500 * PI2 / sampleRate ** 3;
        modulation *= PI2 / sampleRate;
        pitchJump *= PI2 / sampleRate;
        pitchJumpTime *= sampleRate;
        let repeatTimeSamples = repeatTime * sampleRate | 0;

        let v_phase = 0;
        let flangerBuffer = new Float32Array(1024);
        let flangerPosIn = 0;

        length = attack + decay + sustain + release + delay | 0;

        for (; i < length; b[i++] = s * volume) {

            // Frequency Sweep & Min Cutoff
            slide += deltaSlide;
            frequency += slide;
            let currentFreq = frequency;

            if (minFrequency > 0 && currentFreq < minFrequency) {
                length = i; break;
            }

            // Vibrato
            if (vibratoDepth > 0) {
                v_phase += vibratoSpeed;
                currentFreq *= (1 + Math.sin(v_phase * PI2) * vibratoDepth * 0.5);
            }

            if (!(++crush % (bitCrush * 100 | 0))) {

                let s_total = 0;
                let o_strength = 1;

                // Duty Sweep (for Square Duty shape)
                let c_shapeCurve = shapeCurve;
                if (shape === 5) {
                    c_shapeCurve = Math.max(0, Math.min(3, shapeCurve + i * dutySweep));
                }

                for (let k = 0; k <= overtones; k++) {
                    let kt = t * (k + 1);
                    let s_k = shape ? shape > 1 ? shape > 2 ? shape > 3 ? shape > 4 ? shape > 5 ? shape > 6 ? shape > 7 ? shape > 8 ?
                        // 9 Breaker
                        (abs(1 - (kt / PI2 % 1) ** 2 * 2) - 1) :
                        // 8 Whistle
                        (0.75 * Math.sin(kt) + 0.25 * Math.sin(kt * 20)) :
                        // 7 Bitnoise
                        ((bitnoiseState = bitnoiseState >> 1 | ((bitnoiseState >> 1 & 1) ^ (bitnoiseState & 1)) << 14), (bitnoiseState & 1) - 0.5) :
                        // 6 White Noise
                        (Math.random() * 2 - 1) :
                        // 5 Square Duty
                        (kt / PI2 % 1 < c_shapeCurve / 2 ? 1 : -1) :
                        // 4 Noise (ZzFX)
                        Math.sin(kt ** 3) :
                        // 3 Tan
                        Math.max(Math.min(Math.tan(kt), 1), -1) :
                        // 2 Saw
                        1 - (2 * kt / PI2 % 2 + 2) % 2 :
                        // 1 Triangle
                        1 - 4 * abs(Math.round(kt / PI2) - kt / PI2) :
                        // 0 Sin
                        Math.sin(kt);

                    s_total += s_k * o_strength;
                    o_strength *= (1 - overtoneFalloff);
                }
                s = s_total;

                // Envelope logic
                let envVol = (i < attack ? i / attack :
                    i < attack + decay ?
                        1 - ((i - attack) / decay) * (1 - sustainVolume) + (i < attack + 100 ? sustainPunch : 0) : // simplified punch
                        i < attack + decay + sustain ?
                            sustainVolume + (sustainPunch * (1 - (i - attack - decay) / sustain)) : // fade punch
                            i < length - delay ?
                                (length - i - delay) / release * sustainVolume :
                                0);

                // Simplified Punch
                if (i < attack + decay + sustain) {
                    let punchMult = 1 + sustainPunch;
                    if (i > attack) envVol *= punchMult;
                }

                s *= envVol;

                // Flanger
                if (abs(flangerOffset) > 0 || abs(flangerSweep) > 0) {
                    let f_off = abs(flangerOffset + i * flangerSweep) | 0;
                    f_off = Math.min(1023, f_off);
                    flangerBuffer[flangerPosIn & 1023] = s;
                    s += flangerBuffer[(flangerPosIn - f_off + 1024) & 1023];
                    flangerPosIn++;
                }

                s = delay ? s / 2 + (delay > i ? 0 :
                    (i < length - delay ? 1 : (length - i) / delay) *
                    b[i - delay | 0] / 2 / safeVolume) : s;

                // Filter & Sweep
                if (filter) {
                    // Update coefficients for sweep
                    if (filterSweep != 1.0) {
                        w *= filterSweep;
                        w = Math.max(0.00001, Math.min(Math.PI * 0.99, w));
                        cos = Math.cos(w);
                        alpha = Math.sin(w) / 2 / (2 + filterRes * 20); // simplified resonance
                        a0 = 1 + alpha;
                        a1 = -2 * cos / a0;
                        a2 = (1 - alpha) / a0;
                        b0 = (1 + sign(filter) * cos) / 2 / a0;
                        b1 = -(sign(filter) + cos) / a0;
                        b2 = b0;
                    }
                    s = y1 = b2 * x2 + b1 * (x2 = x1) + b0 * (x1 = s) - a2 * y2 - a1 * (y2 = y1);
                }
            }

            f = (currentFreq) * Math.cos(modulation * modOffset++);
            t += f + f * noise * Math.sin(i ** 5);

            // Pitch Jump
            if (jump && ++jump > pitchJumpTime) {
                frequency += pitchJump;
                startFrequency += pitchJump;
                jump = 0;
            }

            // Repeat
            if (repeatTimeSamples && !(++repeat % repeatTimeSamples)) {
                frequency = startFrequency;
                slide = startSlide;
                jump ||= 1;
            }

            // Compression
            if (compressionAmount > 0) {
                if (s > 0) s = Math.pow(s, 1 / (1 + 4 * compressionAmount));
                else s = -Math.pow(abs(s), 1 / (1 + 4 * compressionAmount));
            }
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
