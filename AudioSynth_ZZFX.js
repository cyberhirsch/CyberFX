// ZzFX engine — wraps ZzFX DSP (by Frank Force, MIT License) as a SynthBase subclass.
// https://github.com/KilledByAPixel/ZzFX

class ZzFX extends SynthBase {

    name = "ZzFX";
    version = 1;
    file_extension = "zzfx";
    tooltip = "ZzFX - Zuper Zmall Zound Zynth by Frank Force. Tiny parametric sound generator for games.";

    // Positional order matching ZzFX buildSamples() signature
    static PARAM_ORDER = [
        "masterVolume", "randomness", "frequency",
        "attack", "sustain", "release",
        "shape", "shapeCurve",
        "slide", "deltaSlide",
        "pitchJump", "pitchJumpTime", "repeatTime",
        "noise", "modulation", "bitCrush",
        "delay", "sustainVolume", "decay", "tremolo", "filter"
    ];

    header_properties = ["shape"];
    permalocked = ["masterVolume"];
    hide_params  = ["masterVolume"];

    param_info = [
        ["Sound Volume",  "Overall volume of the current sound.",                                    "masterVolume",  0.5,  0,     1   ],
        {
            type: "BUTTONSELECT",
            name: "shape",
            display_name: "",
            tooltip: "Waveform shape.",
            default_value: 0,
            columns: 3,
            header: true,
            values: [
                ["Sin",      "Smooth sinusoidal wave.", 0],
                ["Triangle", "Linear triangle wave.", 1],
                ["Saw",      "Sawtooth wave.", 2],
                ["Tan",      "Tangent wave — produces distortion and unusual timbres.", 3],
                ["Noise",    "Sinusoidal noise via sin(t^3) — organic, perlin-like.", 4],
                ["Sq Duty",  "Square wave. Shape Curve controls the duty cycle (0–1).", 5],
            ]
        },
        ["Randomness",    "Random pitch variation applied each time the sound plays.",                "randomness",    0.05, 0,     0.5 ],
        ["Frequency",     "Base frequency in Hz.",                                                   "frequency",     220,  20,    4400],
        ["Attack",        "Volume attack duration in seconds.",                                      "attack",        0,    0,     2   ],
        ["Decay",         "Volume decay duration in seconds.",                                       "decay",         0,    0,     2   ],
        ["Sustain",       "Volume sustain duration in seconds.",                                     "sustain",       0,    0,     2   ],
        ["Release",       "Volume release duration in seconds.",                                     "release",       0.1,  0,     2   ],
        ["Sustain Vol",   "Volume level during the sustain phase.",                                  "sustainVolume", 1,    0,     1   ],
        ["Shape Curve",   "Applies a power curve to the wave. For Sq Duty: controls duty cycle.",   "shapeCurve",    1,    0,     3   ],
        ["Slide",         "Frequency slide rate (Hz/s change).",                                    "slide",         0,    -10,   10  ],
        ["Delta Slide",   "Accelerates the frequency slide.",                                       "deltaSlide",    0,    -10,   10  ],
        ["Pitch Jump",    "Sudden pitch jump amount in Hz.",                                         "pitchJump",     0,    -1000, 1000],
        ["Jump Time",     "Delay before the pitch jump fires (seconds).",                            "pitchJumpTime", 0,    0,     1   ],
        ["Repeat Time",   "Envelope repeat period. 0 = no repeat.",                                 "repeatTime",    0,    0,     1   ],
        ["Noise",         "Sinusoidal noise applied to frequency.",                                  "noise",         0,    0,     1   ],
        ["Modulation",    "Ring modulation frequency.",                                              "modulation",    0,    0,     1   ],
        ["Bit Crush",     "Reduces sample rate for lo-fi effect.",                                   "bitCrush",      0,    0,     1   ],
        ["Delay",         "Echo delay duration in seconds.",                                         "delay",         0,    0,     1   ],
        ["Tremolo",       "Amplitude tremolo depth (uses Repeat Time as rate).",                     "tremolo",       0,    0,     1   ],
        ["Filter",        "Biquad filter. Positive = low-pass, negative = high-pass.",              "filter",        0,    -1,    1   ],
    ];

    constructor() {
        super();
        this.post_initialize();
    }

    generate_sound() {
        // ZzFX DSP — adapted from ZzFX v1.3.2 by Frank Force (MIT License)
        // https://github.com/KilledByAPixel/ZzFX
        const p = this.params;
        const sampleRate = SAMPLE_RATE;

        let volume        = p.masterVolume,
            randomness    = p.randomness,
            frequency     = p.frequency,
            attack        = p.attack,
            sustain       = p.sustain,
            release       = p.release,
            shape         = p.shape | 0,
            shapeCurve    = p.shapeCurve,
            slide         = p.slide,
            deltaSlide    = p.deltaSlide,
            pitchJump     = p.pitchJump,
            pitchJumpTime = p.pitchJumpTime,
            repeatTime    = p.repeatTime,
            noise         = p.noise,
            modulation    = p.modulation,
            bitCrush      = p.bitCrush,
            delay         = p.delay,
            sustainVolume = p.sustainVolume,
            decay         = p.decay,
            tremolo       = p.tremolo,
            filter        = p.filter;

        const PI2 = Math.PI * 2;
        const abs = Math.abs;
        const sign = v => v < 0 ? -1 : 1;

        // Prevent divide-by-zero in delay feedback formula (b[i-delay]/2/volume)
        const safeVolume = volume || 1e-9;

        let startSlide      = slide     *= 500 * PI2 / sampleRate / sampleRate,
            startFrequency  = frequency *= (1 + randomness * 2 * Math.random() - randomness) * PI2 / sampleRate,
            modOffset = 0,
            repeat    = 0,
            crush     = 0,
            jump      = 1,
            length,
            b = [],
            t = 0,
            i = 0,
            s = 0,
            f,

            // Biquad LP/HP filter coefficients
            // w maps filter (-1..1) to 0..Nyquist: filter=0.1 ≈ 2.2kHz, filter=1 = Nyquist
            quality = 2,
            w     = Math.PI * abs(filter),
            cos   = Math.cos(w),
            alpha = Math.sin(w) / 2 / quality,
            a0    = 1 + alpha,
            a1    = -2 * cos / a0,
            a2    = (1 - alpha) / a0,
            b0    = (1 + sign(filter) * cos) / 2 / a0,
            b1    = -(sign(filter) + cos) / a0,
            b2    = b0,
            x2 = 0, x1 = 0, y2 = 0, y1 = 0;

        // Scale time params to samples
        const minAttack = 9;
        attack        = attack * sampleRate || minAttack;
        decay        *= sampleRate;
        sustain      *= sampleRate;
        release      *= sampleRate;
        delay        *= sampleRate;
        deltaSlide   *= 500 * PI2 / sampleRate ** 3;
        modulation   *= PI2 / sampleRate;
        pitchJump    *= PI2 / sampleRate;
        pitchJumpTime *= sampleRate;
        repeatTime    = repeatTime * sampleRate | 0;

        for (length = attack + decay + sustain + release + delay | 0;
            i < length; b[i++] = s * volume)
        {
            if (!(++crush % (bitCrush * 100 | 0))) {  // bit crush gate
                s = shape ? shape > 1 ? shape > 2 ? shape > 3 ? shape > 4 ?
                    (t / PI2 % 1 < shapeCurve / 2 ? 1 : -1) :   // 5 square duty
                    Math.sin(t ** 3) :                            // 4 noise
                    Math.max(Math.min(Math.tan(t), 1), -1) :     // 3 tan
                    1 - (2 * t / PI2 % 2 + 2) % 2 :             // 2 saw
                    1 - 4 * abs(Math.round(t / PI2) - t / PI2) : // 1 triangle
                    Math.sin(t);                                   // 0 sin

                s = (repeatTime ?
                        1 - tremolo + tremolo * Math.sin(PI2 * i / repeatTime) : 1) *
                    (shape > 4 ? s : sign(s) * abs(s) ** shapeCurve) *
                    (i < attack ? i / attack :
                     i < attack + decay ?
                        1 - ((i - attack) / decay) * (1 - sustainVolume) :
                     i < attack + decay + sustain ?
                        sustainVolume :
                     i < length - delay ?
                        (length - i - delay) / release * sustainVolume :
                     0);

                s = delay ? s / 2 + (delay > i ? 0 :
                    (i < length - delay ? 1 : (length - i) / delay) *
                    b[i - delay | 0] / 2 / safeVolume) : s;

                if (filter)
                    s = y1 = b2 * x2 + b1 * (x2 = x1) + b0 * (x1 = s) - a2 * y2 - a1 * (y2 = y1);
            }

            f  = (frequency += slide += deltaSlide) * Math.cos(modulation * modOffset++);
            t += f + f * noise * Math.sin(i ** 5);

            if (jump && ++jump > pitchJumpTime) {
                frequency      += pitchJump;
                startFrequency += pitchJump;
                jump = 0;
            }

            if (repeatTime && !(++repeat % repeatTime)) {
                frequency = startFrequency;
                slide     = startSlide;
                jump    ||= 1;
            }
        }

        const buffer = new Float32Array(b);
        this.sound = RealizedSound.from_buffer(buffer);
    }

    // Serialize params dict → positional array JSON (.zzfx file format)
    serialize_sound(file_name, params_dict) {
        const arr = ZzFX.PARAM_ORDER.map(k => params_dict[k] ?? 0);
        return JSON.stringify({
            synth_type: this.name,
            version: this.version,
            file_name: file_name,
            params: arr
        }, null, 2);
    }

    // Deserialize .zzfx (array) or legacy dict back to a params dict
    deserialize_params(data) {
        if (Array.isArray(data.params)) {
            const defaults = this.default_params();
            const result = {};
            ZzFX.PARAM_ORDER.forEach((k, i) => {
                result[k] = (data.params[i] != null) ? data.params[i] : defaults[k];
            });
            return result;
        }
        return data.params; // dict format fallback
    }
}
