/*
 * RIFFWAVE.js v0.02 - Audio encoder for HTML5 <audio> elements.
 * Copyright (C) 2011 Pedro Ladaria <pedro.ladaria at Gmail dot com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 * The full license is available at http://www.gnu.org/licenses/gpl.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *
 * Changelog:
 *
 * 0.01 - First release
 * 0.02 - New faster base64 encoding
 *
 */

var FastBase64_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var FastBase64_encLookup = [];

function FastBase64_Init() {
  for (var i = 0; i < 4096; i++) {
    FastBase64_encLookup[i] = FastBase64_chars[i >> 6] + FastBase64_chars[i & 0x3F];
  }
}

function FastBase64_Encode(src) {
  var len = src.length;
  var dst = '';
  var i = 0;
  while (len > 2) {
    let n = (src[i] << 16) | (src[i + 1] << 8) | src[i + 2];
    dst += FastBase64_encLookup[n >> 12] + FastBase64_encLookup[n & 0xFFF];
    len -= 3;
    i += 3;
  }
  if (len > 0) {
    var n1 = (src[i] & 0xFC) >> 2;
    var n2 = (src[i] & 0x03) << 4;
    if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
    dst += FastBase64_chars[n1];
    dst += FastBase64_chars[n2];
    if (len == 2) {
      var n3 = (src[i++] & 0x0F) << 2;
      n3 |= (src[i] & 0xC0) >> 6;
      dst += FastBase64_chars[n3];
    }
    if (len == 1) dst += '=';
    dst += '=';
  }
  return dst;
} // end Encode

FastBase64_Init();

function u32ToArray(i) { return [i & 0xFF, (i >> 8) & 0xFF, (i >> 16) & 0xFF, (i >> 24) & 0xFF]; }

function u16ToArray(i) { return [i & 0xFF, (i >> 8) & 0xFF]; }

function split16bitArray(data) {
  var r = [];
  var j = 0;
  var len = data.length;
  for (var i = 0; i < len; i++) {
    r[j++] = data[i] & 0xFF;
    r[j++] = (data[i] >> 8) & 0xFF;
  }
  return r;
}

function MakeRiff(sampleRate, bitsPerSample, data) {
  var dat = [];
  var wav = [];
  var dataURI = [];

  var header = {                         // OFFS SIZE NOTES
    chunkId: [0x52, 0x49, 0x46, 0x46], // 0    4    "RIFF" = 0x52494646
    chunkSize: 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
    format: [0x57, 0x41, 0x56, 0x45], // 8    4    "WAVE" = 0x57415645
    subChunk1Id: [0x66, 0x6d, 0x74, 0x20], // 12   4    "fmt " = 0x666d7420
    subChunk1Size: 16,                    // 16   4    16 for PCM
    audioFormat: 1,                     // 20   2    PCM = 1
    numChannels: 1,                     // 22   2    Mono = 1, Stereo = 2, etc.
    sampleRate: sampleRate,                  // 24   4    8000, 44100, etc
    byteRate: 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
    blockAlign: 0,                     // 32   2    NumChannels*BitsPerSample/8
    bitsPerSample: bitsPerSample,                     // 34   2    8 bits = 8, 16 bits = 16, etc...
    subChunk2Id: [0x64, 0x61, 0x74, 0x61], // 36   4    "data" = 0x64617461
    subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
  };

  header.byteRate = (header.sampleRate * header.numChannels * header.bitsPerSample) >> 3;
  header.blockAlign = (header.numChannels * header.bitsPerSample) >> 3;
  header.subChunk2Size = data.length * (header.bitsPerSample >> 3);
  header.chunkSize = 36 + header.subChunk2Size;

  wav = header.chunkId.concat(
    u32ToArray(header.chunkSize),
    header.format,
    header.subChunk1Id,
    u32ToArray(header.subChunk1Size),
    u16ToArray(header.audioFormat),
    u16ToArray(header.numChannels),
    u32ToArray(header.sampleRate),
    u32ToArray(header.byteRate),
    u16ToArray(header.blockAlign),
    u16ToArray(header.bitsPerSample),
    header.subChunk2Id,
    u32ToArray(header.subChunk2Size),
    (header.bitsPerSample === 16) ? split16bitArray(data) : data
  );

  dataURI = 'data:audio/wav;base64,' + FastBase64_Encode(wav);

  var result = {
    dat: dat,
    wav: wav,
    header: header,
    dataURI: dataURI
  };

  return result;
}


if (typeof exports != 'undefined')  // For node.js
  exports.RIFFWAVE = RIFFWAVE;
const TEMPLATES_JSON = {
  "Bfxr": {
    "pickup_coin": {
      "Coin": {
        "masterVolume": [
          0.85185
        ],
        "waveType": [
          0
        ],
        "attackTime": [
          0
        ],
        "sustainTime": [
          0.016874472672728978,
          0.10333
        ],
        "sustainPunch": [
          0.30333,
          0.60333
        ],
        "decayTime": [
          0.16312552732727104,
          0.50333
        ],
        "compressionAmount": [
          0
        ],
        "frequency_start": [
          0.4,
          0.9
        ],
        "min_frequency_relative_to_starting_frequency": [
          0
        ],
        "frequency_slide": [
          0
        ],
        "frequency_acceleration": [
          0
        ],
        "vibratoDepth": [
          0
        ],
        "vibratoSpeed": [
          0
        ],
        "overtones": [
          0
        ],
        "overtoneFalloff": [
          0
        ],
        "pitch_jump_repeat_speed": [
          0
        ],
        "pitch_jump_amount": [
          0
        ],
        "pitch_jump_onset_percent": [
          0
        ],
        "pitch_jump_2_amount": [
          0
        ],
        "pitch_jump_onset2_percent": [
          0
        ],
        "squareDuty": [
          0
        ],
        "dutySweep": [
          0
        ],
        "repeatSpeed": [
          0
        ],
        "flangerOffset": [
          0
        ],
        "flangerSweep": [
          0
        ],
        "lpFilterCutoff": [
          1
        ],
        "lpFilterCutoffSweep": [
          0
        ],
        "lpFilterResonance": [
          0
        ],
        "hpFilterCutoff": [
          0
        ],
        "hpFilterCutoffSweep": [
          0
        ],
        "bitCrush": [
          0
        ],
        "bitCrushSweep": [
          0
        ]
      },
      "Coin2": {
        "masterVolume": [
          0.85185
        ],
        "waveType": [
          0,
          2,
          4,
          1,
          7,
          11,
          5,
          10
        ],
        "attackTime": [
          0
        ],
        "sustainTime": [
          0.016874472672728978,
          0.10333
        ],
        "sustainPunch": [
          0.30333,
          0.60333
        ],
        "decayTime": [
          0.16312552732727104,
          0.50333
        ],
        "compressionAmount": [
          0
        ],
        "frequency_start": [
          0.4,
          0.9
        ],
        "min_frequency_relative_to_starting_frequency": [
          0
        ],
        "frequency_slide": [
          0,
          0.05333
        ],
        "frequency_acceleration": [
          0,
          0.09333
        ],
        "vibratoDepth": [
          0
        ],
        "vibratoSpeed": [
          0
        ],
        "overtones": [
          0
        ],
        "overtoneFalloff": [
          0
        ],
        "pitch_jump_repeat_speed": [
          0
        ],
        "pitch_jump_amount": [
          0.34667,
          0.38667
        ],
        "pitch_jump_onset_percent": [
          0.32667,
          0.29333
        ],
        "pitch_jump_2_amount": [
          0
        ],
        "pitch_jump_onset2_percent": [
          0
        ],
        "squareDuty": [
          0
        ],
        "dutySweep": [
          0
        ],
        "repeatSpeed": [
          0
        ],
        "flangerOffset": [
          0
        ],
        "flangerSweep": [
          0
        ],
        "lpFilterCutoff": [
          1
        ],
        "lpFilterCutoffSweep": [
          0
        ],
        "lpFilterResonance": [
          0
        ],
        "hpFilterCutoff": [
          0
        ],
        "hpFilterCutoffSweep": [
          0
        ],
        "bitCrush": [
          0
        ],
        "bitCrushSweep": [
          0
        ]
      }
    }
  }
};// Editor extensions for SynthBase — template loading, randomize, mutate, waveform drawing, WAV export.

SynthBase.prototype.load_bcol_tempaltes = function () {
  if (typeof TEMPLATES_JSON === 'undefined') return;
  if (!TEMPLATES_JSON.hasOwnProperty(this.name)) return;
  var templates_for_me = TEMPLATES_JSON[this.name];
  var template_names = Object.keys(templates_for_me);
  for (var i = 0; i < template_names.length; i++) {
    var template_name = template_names[i];
    var template_method_name = "generate_" + template_names[i];
    var template_bounds_dictionary = templates_for_me[template_name];
    this[template_method_name] = this.generate_template_function_from_bounds_dictionary(template_bounds_dictionary);
  }
};

SynthBase.prototype.create_random_template = function () {
  this.reset_params();
  var random_template_idx = Math.floor(Math.random() * this.templates.length);
  var template = this.templates[random_template_idx];
  var template_generator_name = template[2];
  var template_file_name = template[3];
  this[template_generator_name]();
  return [template_file_name, this.params];
};

SynthBase.prototype.randomize_params = function () {
  this.reset_params(true);
  for (var i = 0; i < this.param_info.length; i++) {
    var param = this.param_info[i];
    var param_normalized = this.get_param_normalized(param);
    var min_val = param_normalized.min_value;
    var max_val = param_normalized.max_value;
    var random_val = Math.random() * (max_val - min_val) + min_val;
    if (param_normalized.type === "BUTTONSELECT") {
      random_val = Math.floor(random_val);
      if (random_val >= max_val) random_val = max_val - 1;
    }
    this.set_param(param_normalized.name, random_val, true);
  }
};

SynthBase.prototype.mutate_params = function () {
  for (var i = 0; i < this.param_info.length; i++) {
    if (Math.random() < 0.5) continue;
    var param = this.param_info[i];
    var param_normalized = this.get_param_normalized(param);
    if (param_normalized.type !== "RANGE") continue;
    var min_val = param_normalized.min_value;
    var max_val = param_normalized.max_value;
    var range = max_val - min_val;
    var mutated_diff = (Math.random() - 0.5) * 0.1 * range;
    var mutated_val = this.params[param_normalized.name] + mutated_diff;
    this.set_param(param_normalized.name, mutated_val, true);
  }
};

SynthBase.prototype.lerp_params = function (other_params, amount) {
  for (var param_name in other_params) {
    var param_info = this.get_param_info(param_name);
    if (param_info.constructor !== Array) continue;
    var other_param_value = other_params[param_name];
    var this_param_value = this.get_param(param_name);
    var lerped_value = this_param_value + (other_param_value - this_param_value) * amount;
    this.set_param(param_name, lerped_value, true);
  }
};

SynthBase.prototype.pick_variety = function (varieties) {
  var weights = {};
  for (var i = 0; i < varieties.length; i++) {
    var variety = varieties[i];
    var weight = 1;
    if (variety.match(/^\d+$/)) weight = parseInt(variety);
    weights[variety] = weight;
  }
  var total_weight = 0;
  for (var variety in weights) total_weight += weights[variety];
  var random_value = Math.random() * total_weight;
  var cumulative_weight = 0;
  for (var variety in weights) {
    cumulative_weight += weights[variety];
    if (random_value <= cumulative_weight) return variety;
  }
  return varieties[0];
};

SynthBase.prototype.generate_template_function_from_bounds_dictionary = function (varieties_dictionary) {
  return function () {
    var variety_names = Object.keys(varieties_dictionary);
    var picked_variety = this.pick_variety(variety_names);
    var bounds_dictionary = varieties_dictionary[picked_variety];
    for (var param_name in bounds_dictionary) {
      var possible_values = bounds_dictionary[param_name];
      var param_info = this.get_param_info(param_name);
      var param_info_normalized = this.get_param_normalized(param_info);
      switch (param_info_normalized.type) {
        case "BUTTONSELECT":
          this.set_param(param_name, possible_values[Math.floor(Math.random() * possible_values.length)], true);
          break;
        case "RANGE":
          var smallest_value = Math.min(...possible_values);
          var largest_value = Math.max(...possible_values);
          this.set_param(param_name, Math.random() * (largest_value - smallest_value) + smallest_value, true);
          break;
        default:
          console.error(`Unknown param type: ${param_info.type}`);
      }
    }
  };
};

SynthBase.prototype.generate_sound_uri = function () {
  if (!this.sound) this.generate_sound();
  return this.sound.getDataUri();
};

SynthBase.prototype.generateSilhouette = function (height) {
  var result = [];
  var buffer = this.sound.getBuffer();
  var curbar = 0, curmax = buffer[0], curmin = buffer[0], len = buffer.length;
  for (var i = 0; i < len; i++) {
    var val = buffer[i];
    if (i / len > curbar / height) {
      if (Math.abs(curmax - curmin) < 0.01) { curmax += 0.005; curmin -= 0.005; }
      result.push(curmax); result.push(curmin);
      curbar++; curmin = val; curmax = val;
    } else {
      if (val < curmin) curmin = val;
      if (val > curmax) curmax = val;
    }
  }
  result.push(curmax); result.push(curmin);
  return result;
};

SynthBase.prototype.drawWaveform = function (context2d) {
  var w = context2d.canvas.width;
  var h = context2d.canvas.height;
  var silhouette = this.generateSilhouette(h);
  context2d.beginPath();
  context2d.lineWidth = '1';
  context2d.strokeStyle = '#7a8fa8';
  var c = w / 2, prev_l = 0, prev_r = 0;
  for (var y = 0; y < h; y++) {
    var l = c + silhouette[2 * y + 0] * 1 * c;
    var r = c + silhouette[2 * y + 1] * 1 * c;
    context2d.lineTo(l, h - y);
    context2d.lineTo(r, h - y);
    prev_l = l; prev_r = r;
  }
  context2d.lineTo(prev_l, h - h);
  context2d.lineTo(prev_r, h - h);
  context2d.stroke();
};

// Patch post_initialize to also call load_bcol_tempaltes (templates from JSON data).
const _orig_post_initialize = SynthBase.prototype.post_initialize;
SynthBase.prototype.post_initialize = function () {
  _orig_post_initialize.call(this);
  this.load_bcol_tempaltes();
};
// Editor extensions for Bfxr — template generators, randomizer, mutator.

const _BFXR_RANDOMIZATION_POWER = {
  attackTime: 4, sustainTime: 2, sustainPunch: 2, overtones: 3,
  overtoneFalloff: 2, vibratoDepth: 3, dutySweep: 3, flangerOffset: 3,
  flangerSweep: 3, lpFilterCutoff: 3, lpFilterSweep: 3, hpFilterCutoff: 5,
  hpFilterSweep: 5, bitCrush: 4, bitCrushSweep: 5, slide: 4,
  frequency_acceleration: 7, frequency_start: 4
};

const _BFXR_WAVE_TYPE_WEIGHTS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const _BFXR_WAVE_TYPE_INDICES = {
  "Triangle": 4, "Sin": 2, "Square": 0, "Saw": 1, "Breaker": 8,
  "Tan": 6, "Whistle": 7, "White": 3, "Voice": 11, "Bitnoise": 9, "Rasp": 5, "FMSyn": 10
};

Bfxr.prototype.templates = [
  ["Pickup/Coin", "Blips and baleeps.", "generate_pickup_coin", "Pickup"],
  ["Laser/Shoot", "Pew pew.", "generate_laser_shoot", "Shoot"],
  ["Explosion", "Boom.", "generate_explosion", "Boom"],
  ["Powerup", "Whoo.", "generate_powerup", "PowerUp"],
  ["Hit/Hurt", "If you want something more crackly, try out a tan wave here.", "generate_hit_hurt", "Hit"],
  ["Jump", "Try turn your jump into a soggy kiss with some bitcrush.", "generate_jump", "Jump"],
  ["Blip/Select", "You might want to make a variation of this with longer decay for blips that accompany fadeouts or animations.", "generate_blip_select", "Blip"],
  ["Alert", "Red alert!", "generate_alert", "Alert"],
  ["Randomize", "Talking your life into your hands... (only modifies unlocked parameters)", "randomize_params", "Random"],
  ["Mutate", "Modify each unlocked parameter by a small wee amount...", "mutate_params", "Mutant"],
];

Bfxr.prototype.select_random_wave_type = function (...possible_wave_types) {
  var wave_type_name = possible_wave_types[Math.floor(Math.random() * possible_wave_types.length)];
  return _BFXR_WAVE_TYPE_INDICES[wave_type_name];
};

Bfxr.prototype.generate_random_centered_around_x = function (min, max, centre) {
  var r = Math.random();
  r = Math.pow(r, 2);
  return Math.random() < 0.5
    ? centre + r * (max - centre)
    : centre - r * (centre - min);
};

Bfxr.prototype.generate_sin = function () {
  this.reset_params(true);
  this.set_param("waveType", 1, true);
};

Bfxr.prototype.generate_pickup_coin = function () {
  this.reset_params(true);
  this.set_param("frequency_start", 0.4 + Math.random() * 0.5, true);
  this.set_param("sustainTime", Math.random() * 0.1, true);
  this.set_param("decayTime", 0.1 + Math.random() * 0.4, true);
  this.set_param("sustainPunch", 0.3 + Math.random() * 0.3, true);
  if (Math.random() < 0.5) {
    this.set_param("pitch_jump_Speed", 0.5 + Math.random() * 0.2, true);
    var cnum = Math.floor(Math.random() * 7) + 1;
    var cden = Math.floor(Math.random() * 7) + cnum + 2;
    this.set_param("pitch_jump_amount", cnum / cden, true);
  }
};

Bfxr.prototype.generate_laser_shoot = function () {
  this.reset_params(true);
  this.set_param("waveType", (Math.random() * 3) | 0, true);
  if (this.get_param("waveType") == 2 && Math.random() < 0.5)
    this.set_param("waveType", (Math.random() * 2) | 0, true);
  if (Math.random() < 0.33) {
    this.set_param("frequency_start", 0.1 + Math.random() * 0.5, true);
    this.set_param("min_frequency_relative_to_starting_frequency", Math.random() * 0.1, true);
    this.set_param("frequency_slide", -0.35 - Math.random() * 0.3, true);
  } else {
    this.set_param("frequency_start", 0.5 + Math.random() * 0.5, true);
    this.set_param("min_frequency_relative_to_starting_frequency",
      this.get_param("frequency_start") - 0.2 - Math.random() * 0.6, true);
    if (this.get_param("min_frequency_relative_to_starting_frequency") < 0.2)
      this.set_param("min_frequency_relative_to_starting_frequency", 0.2, true);
    this.set_param("frequency_slide", -0.15 - Math.random() * 0.2, true);
  }
  if (this.get_param("frequency_start") < 0.15) {
    this.set_param("min_frequency_relative_to_starting_frequency", 0, true);
    this.set_param("frequency_slide", -0.1 - Math.random() * 0.1, true);
  }
  if (Math.random() < 0.5) {
    this.set_param("squareDuty", Math.random() * 0.5, true);
    this.set_param("dutySweep", Math.random() * 0.2, true);
  } else {
    this.set_param("squareDuty", 0.4 + Math.random() * 0.5, true);
    this.set_param("dutySweep", -Math.random() * 0.7, true);
  }
  this.set_param("sustainTime", 0.1 + Math.random() * 0.2, true);
  this.set_param("decayTime", Math.random() * 0.4, true);
  if (Math.random() < 0.5) this.set_param("sustainPunch", Math.random() * 0.3, true);
  if (Math.random() < 0.33) {
    this.set_param("flangerOffset", Math.random() * 0.2, true);
    this.set_param("flangerSweep", -Math.random() * 0.2, true);
  }
  if (Math.random() < 0.5) this.set_param("hpFilterCutoff", Math.random() * 0.3, true);
};

Bfxr.prototype.generate_explosion = function () {
  this.reset_params(true);
  this.set_param("waveType", Math.random() < 0.5 ? 3 : 9, true);
  if (Math.random() < 0.5) {
    this.set_param("frequency_start", 0.1 + Math.random() * 0.4, true);
    this.set_param("frequency_slide", -0.1 + Math.random() * 0.4, true);
  } else {
    this.set_param("frequency_start", 0.2 + Math.random() * 0.7, true);
    this.set_param("frequency_slide", -0.2 - Math.random() * 0.2, true);
  }
  this.set_param("frequency_start", this.get_param("frequency_start") * this.get_param("frequency_start"), true);
  if (Math.random() < 0.2) this.set_param("frequency_slide", 0.0, true);
  if (Math.random() < 0.33) this.set_param("repeatSpeed", 0.3 + Math.random() * 0.5, true);
  this.set_param("sustainTime", 0.1 + Math.random() * 0.3, true);
  this.set_param("decayTime", Math.random() * 0.5, true);
  this.set_param("sustainPunch", 0.2 + Math.random() * 0.6, true);
  if (Math.random() < 0.5) {
    this.set_param("flangerOffset", -0.3 + Math.random() * 0.9, true);
    this.set_param("flangerSweep", -Math.random() * 0.3, true);
  }
  if (Math.random() < 0.33) {
    this.set_param("pitch_jump_Speed", 0.6 + Math.random() * 0.3, true);
    this.set_param("pitch_jump_amount", 0.8 - Math.random() * 1.6, true);
  }
};

Bfxr.prototype.generate_powerup = function () {
  this.reset_params(true);
  if (Math.random() < 0.5) this.set_param("waveType", 1, true);
  else this.set_param("squareDuty", Math.random() * 0.6, true);
  if (Math.random() < 0.5) {
    this.set_param("frequency_start", 0.2 + Math.random() * 0.3, true);
    this.set_param("frequency_slide", 0.1 + Math.random() * 0.4, true);
    this.set_param("repeatSpeed", 0.4 + Math.random() * 0.4, true);
  } else {
    this.set_param("frequency_start", 0.2 + Math.random() * 0.3, true);
    this.set_param("frequency_slide", 0.05 + Math.random() * 0.2, true);
    if (Math.random() < 0.5) {
      this.set_param("vibratoDepth", Math.random() * 0.7, true);
      this.set_param("vibratoSpeed", Math.random() * 0.6, true);
    }
  }
  this.set_param("sustainTime", Math.random() * 0.4, true);
  this.set_param("decayTime", 0.1 + Math.random() * 0.4, true);
};

Bfxr.prototype.generate_hit_hurt = function () {
  this.reset_params(true);
  this.set_param("waveType", this.select_random_wave_type("White", "Bitnoise", "Saw", "Square", "Voice"), true);
  if (this.get_param("waveType") == 0) this.set_param("squareDuty", Math.random() * 0.6);
  this.set_param("frequency_start", 0.2 + Math.random() * 0.6, true);
  this.set_param("frequency_slide", -0.3 - Math.random() * 0.4, true);
  this.set_param("sustainTime", Math.random() * 0.1, true);
  this.set_param("decayTime", 0.1 + Math.random() * 0.2, true);
  if (Math.random() < 0.5) this.set_param("hpFilterCutoff", Math.random() * 0.3, true);
};

Bfxr.prototype.generate_jump = function () {
  this.reset_params(true);
  this.set_param("waveType", this.select_random_wave_type("Square", "Saw", "FMSyn"), true);
  this.set_param("squareDuty", Math.random() * 0.6, true);
  this.set_param("frequency_start", 0.3 + Math.random() * 0.3, true);
  this.set_param("frequency_slide", 0.1 + Math.random() * 0.2, true);
  this.set_param("sustainTime", 0.1 + Math.random() * 0.3, true);
  this.set_param("decayTime", 0.1 + Math.random() * 0.2, true);
  if (Math.random() < 0.5) this.set_param("hpFilterCutoff", Math.random() * 0.3, true);
  if (Math.random() < 0.5) this.set_param("lpFilterCutoff", 1.0 - Math.random() * 0.6, true);
};

Bfxr.prototype.generate_blip_select = function () {
  this.reset_params(true);
  this.set_param("waveType", this.select_random_wave_type("Square", "Saw", "FMSyn", "Whistle"), true);
  if (this.get_param("waveType") == 0) this.set_param("squareDuty", Math.random() * 0.6, true);
  this.set_param("frequency_start", 0.2 + Math.random() * 0.4, true);
  this.set_param("sustainTime", 0.1 + Math.random() * 0.1, true);
  this.set_param("decayTime", Math.random() * 0.2, true);
  this.set_param("hpFilterCutoff", 0.1, true);
};

Bfxr.prototype.generate_alert = function () {
  this.reset_params(true);
  this.set_param("waveType", 1, true);                                                    // Saw — harsh buzzy klaxon
  this.set_param("frequency_start", 0.5 + Math.random() * 0.2, true);                        // mid-high pitch
  this.set_param("frequency_slide", -(0.3 + Math.random() * 0.2), true);                     // sharp descending pitch
  this.set_param("repeatSpeed", 0.6 + Math.random() * 0.2, true);                          // fast cycling
  this.set_param("sustainTime", 0.25 + Math.random() * 0.2, true);
  this.set_param("decayTime", 0.05 + Math.random() * 0.1, true);
  this.set_param("sustainPunch", 0.2 + Math.random() * 0.3, true);
  if (Math.random() < 0.4) {
    this.set_param("flangerOffset", Math.random() * 0.15, true);                           // slight flange for harshness
    this.set_param("flangerSweep", -Math.random() * 0.1, true);
  }
};

Bfxr.prototype.rectify_params = function () {
  var frequency_default = this.param_default("frequency_start");
  if (this.get_param("waveType") == 11) frequency_default = 0.22;
  this.set_param("frequency_start", this.generate_random_centered_around_x(0, 0.6, frequency_default), true);
  if (!this.locked_params["sustainTime"] && !this.locked_params["decayTime"]) {
    if (this.get_param("attackTime") + this.get_param("sustainTime") + this.get_param("decayTime") < 0.2) {
      this.set_param("sustainTime", 0.2 + Math.random() * 0.3);
      this.set_param("decayTime", 0.2 + Math.random() * 0.3);
    }
  }
  var r = Math.random() * Math.random();
  this.set_param("sustainPunch", r * r, true);
  if ((this.get_param("frequency_start") > 0.7 && this.get_param("frequency_slide") > 0.2) ||
    (this.get_param("frequency_start") < 0.2 && this.get_param("frequency_slide") < -0.05))
    this.set_param("frequency_slide", -this.get_param("frequency_slide"), true);
  if (this.get_param("lpFilterCutoff") < 0.1 && this.get_param("lpFilterCutoffSweep") < 0)
    this.set_param("lpFilterCutoffSweep", -this.get_param("lpFilterCutoffSweep") + 0.2, true);
  if (this.get_param("waveType") !== 0) {
    this.set_param("squareDuty", this.param_default("squareDuty"), true);
    this.set_param("dutySweep", this.param_default("dutySweep"), true);
  } else {
    var duty = this.get_param("squareDuty");
    if (duty > 0.7 && Math.random() < 0.5)
      this.set_param("dutySweep", -Math.random() * 0.5, true);
  }
};

Bfxr.prototype.randomize_params = function () {
  for (var param in this.params) {
    if (!this.locked_params[param]) {
      var min = this.param_min(param);
      var max = this.param_max(param);
      var default_val = this.param_default(param);
      var r = Math.random();
      if (param in _BFXR_RANDOMIZATION_POWER)
        r = Math.pow(r, _BFXR_RANDOMIZATION_POWER[param]);
      var above = Math.random() < 0.5;
      if (min === default_val) above = true;
      if (max === default_val) above = false;
      this.params[param] = above
        ? default_val + (max - default_val) * r
        : default_val - (default_val - min) * r;
    }
  }
  if (!this.locked_params["waveType"]) {
    var count = 0;
    for (var i = 0; i < _BFXR_WAVE_TYPE_WEIGHTS.length; i++) count += _BFXR_WAVE_TYPE_WEIGHTS[i];
    var r = Math.random() * count;
    for (var i = 0; i < _BFXR_WAVE_TYPE_WEIGHTS.length; i++) {
      r -= _BFXR_WAVE_TYPE_WEIGHTS[i];
      if (r <= 0) { this.set_param("waveType", i); break; }
    }
  }
  if (Math.random() < 0.5) this.set_param("repeatSpeed", 0, true);
  this.set_param("min_frequency_relative_to_starting_frequency", 0, true);
  this.set_param("compressionAmount", 0, true);
  this.rectify_params();
};

Bfxr.prototype.mutate_params = function () {
  if (Math.random() < 0.1) {
    var wave_count = Object.keys(_BFXR_WAVE_TYPE_INDICES).length;
    var random_wave_index_offset = Math.floor(Math.random() * (wave_count - 1));
    var random_wave_index = (this.get_param("waveType") + random_wave_index_offset) % wave_count;
    this.set_param("waveType", random_wave_index, true);
    return;
  }
  SynthBase.prototype.mutate_params.call(this);
  this.rectify_params();
};

// Editor extensions for CyberFX — template generators, randomizer, mutator.
// Based on ZzFX by Frank Force.

CyberFX.prototype.templates = [
  ["Pickup/Coin", "Blips and beeps.", "cyberfx_generate_pickup", "Pickup"],
  ["Laser/Shoot", "Pew pew.", "cyberfx_generate_laser", "Shoot"],
  ["Explosion", "Boom.", "cyberfx_generate_explosion", "Boom"],
  ["Hit/Hurt", "Ouch.", "cyberfx_generate_hit", "Hit"],
  ["Jump", "Boing.", "cyberfx_generate_jump", "Jump"],
  ["Blip/Select", "Bip.", "cyberfx_generate_blip", "Blip"],
  ["Alert", "Red alert!", "cyberfx_generate_alert", "Alert"],
  ["Randomize", "Taking your life into your hands...", "randomize_params", "Random"],
  ["Mutate", "Modify each parameter by a small amount.", "mutate_params", "Mutant"],
];

// --- helpers ---

CyberFX.prototype._cyberfx_rnd = function (min, max) {
  return min + Math.random() * (max - min);
};

CyberFX.prototype._cyberfx_reset = function () {
  this.reset_params(true);
};

// --- template generators ---

CyberFX.prototype.cyberfx_generate_pickup = function () {
  this._cyberfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 0 : 1, true); // sin or triangle
  this.set_param("frequency", this._cyberfx_rnd(400, 1200), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._cyberfx_rnd(0, 0.05), true);
  this.set_param("release", this._cyberfx_rnd(0.1, 0.4), true);
  this.set_param("sustainVolume", 1, true);
  if (Math.random() < 0.5) {
    this.set_param("slide", this._cyberfx_rnd(0.5, 3), true);
  }
  if (Math.random() < 0.4) {
    this.set_param("pitchJump", this._cyberfx_rnd(50, 200), true);
    this.set_param("pitchJumpTime", this._cyberfx_rnd(0.05, 0.2), true);
  }
};

CyberFX.prototype.cyberfx_generate_laser = function () {
  this._cyberfx_reset();
  this.set_param("shape", Math.floor(Math.random() * 3), true); // sin/triangle/saw
  this.set_param("frequency", this._cyberfx_rnd(200, 900), true);
  this.set_param("slide", this._cyberfx_rnd(-8, -1), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._cyberfx_rnd(0, 0.1), true);
  this.set_param("release", this._cyberfx_rnd(0.05, 0.3), true);
  if (Math.random() < 0.4) {
    this.set_param("deltaSlide", this._cyberfx_rnd(-3, 0), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("bitCrush", this._cyberfx_rnd(0, 0.3), true);
  }
};

CyberFX.prototype.cyberfx_generate_explosion = function () {
  this._cyberfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 4 : 3, true); // noise or tan
  this.set_param("frequency", this._cyberfx_rnd(50, 200), true);
  this.set_param("attack", this._cyberfx_rnd(0, 0.05), true);
  this.set_param("sustain", this._cyberfx_rnd(0.05, 0.2), true);
  this.set_param("release", this._cyberfx_rnd(0.2, 0.6), true);
  this.set_param("sustainVolume", this._cyberfx_rnd(0.4, 0.8), true);
  this.set_param("slide", this._cyberfx_rnd(-3, 0), true);
  if (Math.random() < 0.5) {
    this.set_param("noise", this._cyberfx_rnd(0.3, 1), true);
  }
  if (Math.random() < 0.4) {
    this.set_param("modulation", this._cyberfx_rnd(0, 0.4), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("repeatTime", this._cyberfx_rnd(0.1, 0.4), true);
  }
};

CyberFX.prototype.cyberfx_generate_hit = function () {
  this._cyberfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 4 : 3, true); // noise or tan
  this.set_param("frequency", this._cyberfx_rnd(100, 500), true);
  this.set_param("slide", this._cyberfx_rnd(-5, -1), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._cyberfx_rnd(0, 0.05), true);
  this.set_param("release", this._cyberfx_rnd(0.05, 0.25), true);
  if (Math.random() < 0.4) {
    this.set_param("bitCrush", this._cyberfx_rnd(0, 0.4), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("filter", this._cyberfx_rnd(-0.5, 0), true); // high-pass
  }
};

CyberFX.prototype.cyberfx_generate_jump = function () {
  this._cyberfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 0 : 1, true); // sin or triangle
  this.set_param("frequency", this._cyberfx_rnd(200, 500), true);
  this.set_param("slide", this._cyberfx_rnd(1, 5), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._cyberfx_rnd(0.05, 0.2), true);
  this.set_param("release", this._cyberfx_rnd(0.1, 0.3), true);
  if (Math.random() < 0.3) {
    this.set_param("shapeCurve", this._cyberfx_rnd(0.5, 2), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("modulation", this._cyberfx_rnd(0, 0.3), true);
  }
};

CyberFX.prototype.cyberfx_generate_alert = function () {
  this._cyberfx_reset();
  this.set_param("shape", 2, true); // Saw — harsh klaxon timbre
  this.set_param("frequency", this._cyberfx_rnd(600, 900), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._cyberfx_rnd(0.3, 0.55), true);
  this.set_param("release", this._cyberfx_rnd(0.03, 0.08), true);
  this.set_param("sustainVolume", this._cyberfx_rnd(0.7, 1.0), true);
  this.set_param("slide", this._cyberfx_rnd(-6, -3), true); // pitch drops fast
  this.set_param("repeatTime", this._cyberfx_rnd(0.15, 0.25), true); // cycling klaxon repeat
  this.set_param("tremolo", this._cyberfx_rnd(0.1, 0.35), true); // pulsing amplitude
  if (Math.random() < 0.4) {
    this.set_param("deltaSlide", this._cyberfx_rnd(-1.5, 0), true); // accelerating drop
  }
};

CyberFX.prototype.cyberfx_generate_blip = function () {
  this._cyberfx_reset();
  this.set_param("shape", Math.floor(Math.random() * 3), true); // sin/triangle/saw
  this.set_param("frequency", this._cyberfx_rnd(300, 1000), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._cyberfx_rnd(0.02, 0.08), true);
  this.set_param("release", this._cyberfx_rnd(0.02, 0.12), true);
  this.set_param("filter", this._cyberfx_rnd(-0.3, 0), true); // slight high-pass
};
// Editor extensions for ZzFX — template generators, randomizer, mutator.

ZzFX.prototype.templates = [
  ["Pickup/Coin", "Blips and beeps.", "zzfx_generate_pickup", "Pickup"],
  ["Laser/Shoot", "Pew pew.", "zzfx_generate_laser", "Shoot"],
  ["Explosion", "Boom.", "zzfx_generate_explosion", "Boom"],
  ["Hit/Hurt", "Ouch.", "zzfx_generate_hit", "Hit"],
  ["Jump", "Boing.", "zzfx_generate_jump", "Jump"],
  ["Blip/Select", "Bip.", "zzfx_generate_blip", "Blip"],
  ["Alert", "Red alert!", "zzfx_generate_alert", "Alert"],
  ["Randomize", "Taking your life into your hands...", "randomize_params", "Random"],
  ["Mutate", "Modify each parameter by a small amount.", "mutate_params", "Mutant"],
];

// --- helpers ---

ZzFX.prototype._zzfx_rnd = function (min, max) {
  return min + Math.random() * (max - min);
};

ZzFX.prototype._zzfx_reset = function () {
  this.reset_params(true);
};

// --- template generators ---

ZzFX.prototype.zzfx_generate_pickup = function () {
  this._zzfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 0 : 1, true);        // sin or triangle
  this.set_param("frequency", this._zzfx_rnd(400, 1200), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._zzfx_rnd(0, 0.05), true);
  this.set_param("release", this._zzfx_rnd(0.1, 0.4), true);
  this.set_param("sustainVolume", 1, true);
  if (Math.random() < 0.5) {
    this.set_param("slide", this._zzfx_rnd(0.5, 3), true);
  }
  if (Math.random() < 0.4) {
    this.set_param("pitchJump", this._zzfx_rnd(50, 200), true);
    this.set_param("pitchJumpTime", this._zzfx_rnd(0.05, 0.2), true);
  }
};

ZzFX.prototype.zzfx_generate_laser = function () {
  this._zzfx_reset();
  this.set_param("shape", Math.floor(Math.random() * 3), true); // sin/triangle/saw
  this.set_param("frequency", this._zzfx_rnd(200, 900), true);
  this.set_param("slide", this._zzfx_rnd(-8, -1), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._zzfx_rnd(0, 0.1), true);
  this.set_param("release", this._zzfx_rnd(0.05, 0.3), true);
  if (Math.random() < 0.4) {
    this.set_param("deltaSlide", this._zzfx_rnd(-3, 0), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("bitCrush", this._zzfx_rnd(0, 0.3), true);
  }
};

ZzFX.prototype.zzfx_generate_explosion = function () {
  this._zzfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 4 : 3, true);  // noise or tan
  this.set_param("frequency", this._zzfx_rnd(50, 200), true);
  this.set_param("attack", this._zzfx_rnd(0, 0.05), true);
  this.set_param("sustain", this._zzfx_rnd(0.05, 0.2), true);
  this.set_param("release", this._zzfx_rnd(0.2, 0.6), true);
  this.set_param("sustainVolume", this._zzfx_rnd(0.4, 0.8), true);
  this.set_param("slide", this._zzfx_rnd(-3, 0), true);
  if (Math.random() < 0.5) {
    this.set_param("noise", this._zzfx_rnd(0.3, 1), true);
  }
  if (Math.random() < 0.4) {
    this.set_param("modulation", this._zzfx_rnd(0, 0.4), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("repeatTime", this._zzfx_rnd(0.1, 0.4), true);
  }
};

ZzFX.prototype.zzfx_generate_hit = function () {
  this._zzfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 4 : 3, true);  // noise or tan
  this.set_param("frequency", this._zzfx_rnd(100, 500), true);
  this.set_param("slide", this._zzfx_rnd(-5, -1), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._zzfx_rnd(0, 0.05), true);
  this.set_param("release", this._zzfx_rnd(0.05, 0.25), true);
  if (Math.random() < 0.4) {
    this.set_param("bitCrush", this._zzfx_rnd(0, 0.4), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("filter", this._zzfx_rnd(-0.5, 0), true);  // high-pass
  }
};

ZzFX.prototype.zzfx_generate_jump = function () {
  this._zzfx_reset();
  this.set_param("shape", Math.random() < 0.5 ? 0 : 1, true); // sin or triangle
  this.set_param("frequency", this._zzfx_rnd(200, 500), true);
  this.set_param("slide", this._zzfx_rnd(1, 5), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._zzfx_rnd(0.05, 0.2), true);
  this.set_param("release", this._zzfx_rnd(0.1, 0.3), true);
  if (Math.random() < 0.3) {
    this.set_param("shapeCurve", this._zzfx_rnd(0.5, 2), true);
  }
  if (Math.random() < 0.3) {
    this.set_param("modulation", this._zzfx_rnd(0, 0.3), true);
  }
};

ZzFX.prototype.zzfx_generate_alert = function () {
  this._zzfx_reset();
  this.set_param("shape", 2, true);                              // Saw — harsh klaxon timbre
  this.set_param("frequency", this._zzfx_rnd(600, 900), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._zzfx_rnd(0.3, 0.55), true);
  this.set_param("release", this._zzfx_rnd(0.03, 0.08), true);
  this.set_param("sustainVolume", this._zzfx_rnd(0.7, 1.0), true);
  this.set_param("slide", this._zzfx_rnd(-6, -3), true);        // pitch drops fast
  this.set_param("repeatTime", this._zzfx_rnd(0.15, 0.25), true);   // cycling klaxon repeat
  this.set_param("tremolo", this._zzfx_rnd(0.1, 0.35), true);    // pulsing amplitude
  if (Math.random() < 0.4) {
    this.set_param("deltaSlide", this._zzfx_rnd(-1.5, 0), true);     // accelerating drop
  }
};

ZzFX.prototype.zzfx_generate_blip = function () {
  this._zzfx_reset();
  this.set_param("shape", Math.floor(Math.random() * 3), true); // sin/triangle/saw
  this.set_param("frequency", this._zzfx_rnd(300, 1000), true);
  this.set_param("attack", 0, true);
  this.set_param("sustain", this._zzfx_rnd(0.02, 0.08), true);
  this.set_param("release", this._zzfx_rnd(0.02, 0.12), true);
  this.set_param("filter", this._zzfx_rnd(-0.3, 0), true);  // slight high-pass
};
window.addEventListener("load", () => {
  let op = window.inputKnobsOptions || {};
  op.knobWidth = op.knobWidth || op.knobDiameter || 64;
  op.knobHeight = op.knobHeight || op.knobDiameter || 64;
  op.sliderWidth = op.sliderWidth || op.sliderDiameter || 128;
  op.sliderHeight = op.sliderHeight || op.sliderDiameter || 20;
  op.switchWidth = op.switchWidth || op.switchDiameter || 24;
  op.switchHeight = op.switchHeight || op.switchDiameter || 24;
  op.fgcolor = op.fgcolor || "#f00";
  op.bgcolor = op.bgcolor || "#000";
  op.knobMode = op.knobMode || "linear";
  op.sliderMode = op.sliderMode || "relative";
  let styles = document.createElement("style");
  styles.innerHTML =
    `input[type=range].input-knob,input[type=range].input-slider{
  -webkit-appearance:none;
  -moz-appearance:none;
  border:none;
  box-sizing:border-box;
  overflow:hidden;
  background-repeat:no-repeat;
  background-size:100% 100%;
  background-position:0px 0%;
  background-color:transparent;
  touch-action:none;
}
input[type=range].input-knob{
  width:${op.knobWidth}px; height:${op.knobHeight}px;
}
input[type=range].input-slider{
  width:${op.sliderWidth}px; height:${op.sliderHeight}px;
}
input[type=range].input-knob::-webkit-slider-thumb,input[type=range].input-slider::-webkit-slider-thumb{
  -webkit-appearance:none;
  opacity:0;
}
input[type=range].input-knob::-moz-range-thumb,input[type=range].input-slider::-moz-range-thumb{
  -moz-appearance:none;
  height:0;
  border:none;
}
input[type=range].input-knob::-moz-range-track,input[type=range].input-slider::-moz-range-track{
  -moz-appearance:none;
  height:0;
  border:none;
}
input[type=checkbox].input-switch,input[type=radio].input-switch {
  width:${op.switchWidth}px;
  height:${op.switchHeight}px;
  -webkit-appearance:none;
  -moz-appearance:none;
  background-size:100% 200%;
  background-position:0% 0%;
  background-repeat:no-repeat;
  border:none;
  border-radius:0;
  background-color:transparent;
}
input[type=checkbox].input-switch:checked,input[type=radio].input-switch:checked {
  background-position:0% 100%;
}`;
  document.head.appendChild(styles);
  let makeKnobFrames = (fr, fg, bg) => {
    // Create the tick marks as a separate string since they'll be the same for each frame
    let ticks = '';
    let tick_count = 8;
    for (let i = 0; i < tick_count; i++) {
      //if it's half way, skip
      if (i == tick_count / 2) {
        continue;
      }
      const angle = i * (360 / tick_count) * Math.PI / 180;
      const innerR = 27;
      const outerR = 32;
      const x1 = 32 + innerR * Math.sin(angle);
      const y1 = 32 - innerR * Math.cos(angle);
      const x2 = 32 + outerR * Math.sin(angle);
      const y2 = 32 - outerR * Math.cos(angle);
      var tickcol = i === 0 ? fg : bg;
      ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="5" stroke="${tickcol}"/>`;
    }

    let r =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="${fr * 64}" viewBox="0 0 64 ${fr * 64}" preserveAspectRatio="none">
<defs>
  <g id="K">
    <circle cx="32" cy="32" r="25" stroke="${fg}" stroke-width="2" fill="none"/>
    <line x1="32" y1="28" x2="32" y2="7" stroke-width="6" stroke="${fg}"/>
  </g>
</defs>`;

    for (let i = 0; i < fr; i++) {
      // For each frame, add the ticks (which don't rotate) and then the rotated knob
      r += `<g transform="translate(0,${64 * i})">
      ${ticks}
      <use xlink:href="#K" transform="rotate(${-135 + 270 * i / fr},32,32)"/>
    </g>`;
    }

    return r + "</svg>";
  }
  let makeHSliderFrames = (fr, fg, bg, w, h) => {
    let r =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${fr * h}" viewBox="0 0 ${w} ${fr * h}" preserveAspectRatio="none">
<defs><g id="B"><rect x="0" y="0" width="${w}" height="${h}" rx="${h / 2}" ry="${h / 2}" fill="${bg}"/></g>
<g id="K"><circle x="${w / 2}" y="0" r="${h / 2 * 0.9}" fill="${fg}"/></g></defs>`;
    for (let i = 0; i < fr; ++i) {
      r += `<use xlink:href="#B" transform="translate(0,${h * i})"/>`;
      r += `<use xlink:href="#K" transform="translate(${h / 2 + (w - h) * i / 100},${h / 2 + h * i})"/>`;
    }
    return r + "</svg>";
  }
  let makeVSliderFrames = (fr, fg, bg, w, h) => {
    let r =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${fr * h}" viewBox="0 0 ${w} ${fr * h}" preserveAspectRatio="none">
<defs><rect id="B" x="0" y="0" width="${w}" height="${h}" rx="${w / 2}" ry="${w / 2}" fill="${bg}"/>
<circle id="K" x="0" y="0" r="${w / 2 * 0.9}" fill="${fg}"/></defs>`;
    for (let i = 0; i < fr; ++i) {
      r += `<use xlink:href="#B" transform="translate(0,${h * i})"/>`;
      r += `<use xlink:href="#K" transform="translate(${w / 2} ${h * (i + 1) - w / 2 - i * (h - w) / 100})"/>`;
    }
    return r + "</svg>";
  }
  let initSwitches = (el) => {
    let w, h, d, fg, bg;
    if (el.inputKnobs)
      return;
    el.inputKnobs = {};
    el.refresh = () => {
      let src = el.getAttribute("data-src");
      d = +el.getAttribute("data-diameter");
      let st = document.defaultView.getComputedStyle(el, null);
      w = parseFloat(el.getAttribute("data-width") || d || st.width);
      h = parseFloat(el.getAttribute("data-height") || d || st.height);
      bg = el.getAttribute("data-bgcolor") || op.bgcolor;
      fg = el.getAttribute("data-fgcolor") || op.fgcolor;
      el.style.width = w + "px";
      el.style.height = h + "px";
      if (src)
        el.style.backgroundImage = "url(" + src + ")";
      else {
        let minwh = Math.min(w, h);
        let svg =
          `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h * 2}" viewBox="0 0 ${w} ${h * 2}" preserveAspectRatio="none">
<g><rect fill="${bg}" x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${minwh * 0.25}" ry="${minwh * 0.25}"/>
<rect fill="${bg}" x="1" y="${h + 1}" width="${w - 2}" height="${h - 2}" rx="${minwh * 0.25}" ry="${minwh * 0.25}"/>
<circle fill="${fg}" cx="${w * 0.5}" cy="${h * 1.5}" r="${minwh * 0.25}"/></g></svg>`;
        el.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svg) + ")";
      }
    };
    el.refresh();
  };
  let initKnobs = (el) => {
    let w, h, d, fg, bg;
    if (el.inputKnobs) {
      el.redraw();
      return;
    }
    let ik = el.inputKnobs = {};
    el.refresh = () => {
      d = +el.getAttribute("data-diameter");
      let st = document.defaultView.getComputedStyle(el, null);
      w = parseFloat(el.getAttribute("data-width") || d || st.width);
      h = parseFloat(el.getAttribute("data-height") || d || st.height);
      bg = el.getAttribute("data-bgcolor") || op.bgcolor;
      fg = el.getAttribute("data-fgcolor") || op.fgcolor;
      ik.sensex = ik.sensey = 200;
      if (el.className.indexOf("input-knob") >= 0)
        ik.itype = "k";
      else {
        if (w >= h) {
          ik.itype = "h";
          ik.sensex = w - h;
          ik.sensey = Infinity;
          el.style.backgroundSize = "auto 100%";
        }
        else {
          ik.itype = "v";
          ik.sensex = Infinity;
          ik.sensey = h - w;
          el.style.backgroundSize = "100% auto";
        }
      }
      el.style.width = w + "px";
      el.style.height = h + "px";
      ik.frameheight = h;
      let src = el.getAttribute("data-src");
      if (src) {
        el.style.backgroundImage = `url(${src})`;
        let sp = +el.getAttribute("data-sprites");
        if (sp)
          ik.sprites = sp;
        else
          ik.sprites = 0;
        if (ik.sprites >= 1)
          el.style.backgroundSize = `100% ${(ik.sprites + 1) * 100}%`;
        else if (ik.itype != "k") {
          el.style.backgroundColor = bg;
          el.style.borderRadius = Math.min(w, h) * 0.25 + "px";
        }
      }
      else {
        let svg;
        switch (ik.itype) {
          case "k": svg = makeKnobFrames(101, fg, bg); break;
          case "h": svg = makeHSliderFrames(101, fg, bg, w, h); break;
          case "v": svg = makeVSliderFrames(101, fg, bg, w, h); break;
        }
        ik.sprites = 100;
        el.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svg) + ")";
        el.style.backgroundSize = `100% ${(ik.sprites + 1) * 100}%`;
      }
      ik.valrange = { min: +el.min, max: (el.max == "") ? 100 : +el.max, step: (el.step == "") ? 1 : +el.step };
      el.redraw(true);
    };
    el.setValue = (v) => {
      v = (Math.round((v - ik.valrange.min) / ik.valrange.step)) * ik.valrange.step + ik.valrange.min;
      if (v < ik.valrange.min) v = ik.valrange.min;
      if (v > ik.valrange.max) v = ik.valrange.max;
      el.value = v;
      if (el.value != ik.oldvalue) {
        el.setAttribute("value", el.value);
        el.redraw();
        let event = document.createEvent("HTMLEvents");
        event.initEvent("input", false, true);
        el.dispatchEvent(event);
        ik.oldvalue = el.value;
      }
    };
    ik.pointerdown = (ev) => {
      el.focus();
      const evorg = ev;
      if (ev.touches)
        ev = ev.touches[0];
      let rc = el.getBoundingClientRect();
      let cx = (rc.left + rc.right) * 0.5, cy = (rc.top + rc.bottom) * 0.5;
      let dx = ev.clientX, dy = ev.clientY;
      let da = Math.atan2(ev.clientX - cx, cy - ev.clientY);
      if (ik.itype == "k" && op.knobMode == "circularabs") {
        dv = ik.valrange.min + (da / Math.PI * 0.75 + 0.5) * (ik.valrange.max - ik.valrange.min);
        el.setValue(dv);
      }
      if (ik.itype != "k" && op.sliderMode == "abs") {
        dv = (ik.valrange.min + ik.valrange.max) * 0.5 + ((dx - cx) / ik.sensex - (dy - cy) / ik.sensey) * (ik.valrange.max - ik.valrange.min);
        el.setValue(dv);
      }
      ik.dragfrom = { x: ev.clientX, y: ev.clientY, a: Math.atan2(ev.clientX - cx, cy - ev.clientY), v: +el.value };
      document.addEventListener("mousemove", ik.pointermove, { passive: false });
      document.addEventListener("mouseup", ik.pointerup, { passive: true });
      document.addEventListener("touchmove", ik.pointermove, { passive: false });
      document.addEventListener("touchend", ik.pointerup, { passive: true });
      document.addEventListener("touchcancel", ik.pointerup, { passive: true });
      document.addEventListener("touchstart", ik.preventScroll, { passive: false });
      evorg.preventDefault();
      evorg.stopPropagation();
    };
    ik.pointermove = (ev) => {
      let dv;
      let rc = el.getBoundingClientRect();
      let cx = (rc.left + rc.right) * 0.5, cy = (rc.top + rc.bottom) * 0.5;
      if (ev.touches)
        ev = ev.touches[0];
      let dx = ev.clientX - ik.dragfrom.x, dy = ev.clientY - ik.dragfrom.y;
      let da = Math.atan2(ev.clientX - cx, cy - ev.clientY);
      switch (ik.itype) {
        case "k":
          switch (op.knobMode) {
            case "linear":
              dv = (dx / ik.sensex - dy / ik.sensey) * (ik.valrange.max - ik.valrange.min);
              if (ev.shiftKey)
                dv *= 0.2;
              el.setValue(ik.dragfrom.v + dv);
              break;
            case "circularabs":
              if (!ev.shiftKey) {
                dv = ik.valrange.min + (da / Math.PI * 0.75 + 0.5) * (ik.valrange.max - ik.valrange.min);
                el.setValue(dv);
                break;
              }
            case "circularrel":
              if (da > ik.dragfrom.a + Math.PI) da -= Math.PI * 2;
              if (da < ik.dragfrom.a - Math.PI) da += Math.PI * 2;
              da -= ik.dragfrom.a;
              dv = da / Math.PI / 1.5 * (ik.valrange.max - ik.valrange.min);
              if (ev.shiftKey)
                dv *= 0.2;
              el.setValue(ik.dragfrom.v + dv);
          }
          break;
        case "h":
        case "v":
          dv = (dx / ik.sensex - dy / ik.sensey) * (ik.valrange.max - ik.valrange.min);
          if (ev.shiftKey)
            dv *= 0.2;
          el.setValue(ik.dragfrom.v + dv);
          break;
      }
    };
    ik.pointerup = () => {
      document.removeEventListener("mousemove", ik.pointermove);
      document.removeEventListener("touchmove", ik.pointermove);
      document.removeEventListener("mouseup", ik.pointerup);
      document.removeEventListener("touchend", ik.pointerup);
      document.removeEventListener("touchcancel", ik.pointerup);
      document.removeEventListener("touchstart", ik.preventScroll);
      let event = document.createEvent("HTMLEvents");
      event.initEvent("change", false, true);
      el.dispatchEvent(event);
    };
    ik.preventScroll = (ev) => {
      ev.preventDefault();
    };
    ik.keydown = () => {
      el.redraw();
    };
    ik.wheel = (ev) => {
      let delta = ev.deltaY > 0 ? -ik.valrange.step : ik.valrange.step;
      if (!ev.shiftKey)
        delta *= 5;
      el.setValue(+el.value + delta);
      ev.preventDefault();
      ev.stopPropagation();
    };
    el.redraw = (f) => {
      if (f || ik.valueold != el.value) {
        let v = (el.value - ik.valrange.min) / (ik.valrange.max - ik.valrange.min);
        if (ik.sprites >= 1)
          el.style.backgroundPosition = "0px " + (-((v * ik.sprites) | 0) * ik.frameheight) + "px";
        else {
          switch (ik.itype) {
            case "k":
              el.style.transform = "rotate(" + (270 * v - 135) + "deg)";
              break;
            case "h":
              el.style.backgroundPosition = ((w - h) * v) + "px 0px";
              break;
            case "v":
              el.style.backgroundPosition = "0px " + (h - w) * (1 - v) + "px";
              break;
          }
        }
        ik.valueold = el.value;
      }
    };
    el.refresh();
    el.redraw(true);
    el.addEventListener("keydown", ik.keydown, { passive: true });
    el.addEventListener("mousedown", ik.pointerdown, { passive: false });
    el.addEventListener("touchstart", ik.pointerdown, { passive: false });
    el.addEventListener("wheel", ik.wheel, { passive: false });
  }
  let refreshque = () => {
    let elem = document.querySelectorAll("input.input-knob,input.input-slider");
    for (let i = 0; i < elem.length; ++i)
      procque.push([initKnobs, elem[i]]);
    elem = document.querySelectorAll("input[type=checkbox].input-switch,input[type=radio].input-switch");
    for (let i = 0; i < elem.length; ++i) {
      procque.push([initSwitches, elem[i]]);
    }
  }
  let procque = [];
  refreshque();
  setInterval(() => {
    for (let i = 0; procque.length > 0 && i < 8; ++i) {
      let q = procque.shift();
      q[0](q[1]);
    }
    if (procque.length <= 0)
      refreshque();
  }, 50);
});
"use strict";

var tabs = [];

class Tab {


  /* all the variables that determine the tab's state */
  active = false;
  create_new_sound = true;
  play_on_change = true;
  selected_file_index = -1;
  current_params = {};
  files = [
    //[name, current_state, last_saved_state]
  ];

  /* keeping track of frequently used dom elements */
  sliders = {};
  lock_buttons = {};
  reset_buttons = {};

  synth = null;

  constructor(synth_specification) {

    //add a passive onkeydown listener
    document.addEventListener("keydown", this.on_key_down.bind(this), false);

    this.synth = synth_specification;

    var tab_name = synth_specification.name;
    // Store tab name
    this.name = tab_name;

    // restore saved state
    var saved_info = SaveLoad.loaded_data[synth_specification.name];
    if (saved_info) {
      this.files = saved_info.files;
      this.selected_file_index = saved_info.selected_file_index;
      if (this.selected_file_index >= 0) {
        this.synth.apply_params(JSON.parse(this.files[this.selected_file_index][1]));
      }
      if (saved_info.create_new_sound !== undefined) {
        this.create_new_sound = saved_info.create_new_sound;
      }
      if (saved_info.play_on_change !== undefined) {
        this.play_on_change = saved_info.play_on_change;
      }
      if (saved_info.locked_params !== undefined) {
        this.synth.locked_params = saved_info.locked_params;
      }
    }

    // Create DOM elements
    var tab_bar = document.getElementById("tab_bar");
    var tab_page_container = document.getElementById("tab_page_manager");

    var first_tab = tab_bar.children.length == 0;

    var tab_button = document.createElement("div");
    tab_button.innerText = tab_name;
    tab_button.id = "tab_button_" + tab_name;
    tab_button.classList.add("tab_button");
    tab_bar.appendChild(tab_button);
    tab_button.addEventListener("click", this.set_active_tab.bind(this));

    var tab_page = document.createElement("div");
    tab_page.classList.add("tab_page");
    tab_page.id = "tab_page_" + tab_name;
    tab_page_container.appendChild(tab_page);

    if (first_tab) {
      tab_button.classList.add("active_tab");
      tab_page.classList.add("active_tab_page");
      this.active = true;
    }

    var left_panel = document.createElement("div");
    left_panel.classList.add("left_panel");
    tab_page.appendChild(left_panel);

    {
      var template_list = document.createElement("div");
      template_list.classList.add("template_list");
      left_panel.appendChild(template_list);

      var create_new_sound_div = document.createElement("div");
      create_new_sound_div.classList.add("create_new_sound_div");
      left_panel.appendChild(create_new_sound_div);

      var create_new_sound_container_div = document.createElement("div");
      create_new_sound_container_div.classList.add("padded_item");
      create_new_sound_div.appendChild(create_new_sound_container_div);

      var create_new_sound_checkbox = document.createElement("input");
      create_new_sound_checkbox.type = "checkbox";
      create_new_sound_checkbox.id = tab_name + "_checkbox_create_new_sound";
      create_new_sound_checkbox.classList.add("normie_checkbox");
      create_new_sound_container_div.appendChild(create_new_sound_checkbox);
      create_new_sound_checkbox.checked = this.create_new_sound;
      create_new_sound_checkbox.addEventListener("click", this.create_new_sound_clicked.bind(this));

      var create_new_sound_label = document.createElement("label");
      create_new_sound_label.innerText = "Create new sound";
      create_new_sound_label.setAttribute("for", tab_name + "_checkbox_create_new_sound");
      create_new_sound_container_div.appendChild(create_new_sound_label);

      var save_commands_div = document.createElement("div");
      save_commands_div.classList.add("save_commands");
      left_panel.appendChild(save_commands_div);

      var apply_sfx_button = this.add_button(this.name + "_apply_sfx", "Apply Sfx", this.apply_sfx.bind(this), "Apply the current sound to the current sound to the clipboard.");
      save_commands_div.appendChild(apply_sfx_button);

      var revert_sfx_button = this.add_button(this.name + "_revert_sfx", "Revert Sfx", this.revert_sfx.bind(this), "Revert the current sound to the original sound to the clipboard.");
      save_commands_div.appendChild(revert_sfx_button);

      var duplicate_sfx_button = this.add_button(this.name + "_duplicate_sfx", "Duplicate Sfx", this.duplicate_sfx.bind(this), "Duplicate the currently-selected sound in the file list.");
      save_commands_div.appendChild(duplicate_sfx_button);

      var file_list = document.createElement("div");
      file_list.classList.add("scroll_container");
      file_list.classList.add("filelist");
      file_list.id = this.name + "_file_list";
      left_panel.appendChild(file_list);
    }


    var centre_panel = document.createElement("div");
    centre_panel.classList.add("centre_panel");
    tab_page.appendChild(centre_panel);

    {
      var centre_header = document.createElement("div");
      centre_header.classList.add("centre_header");
      centre_header.style.display = "none";
      centre_panel.appendChild(centre_header);

      this.centre_header = centre_header;

      var header_paramtable = document.createElement("table");
      header_paramtable.classList.add("paramtable");
      centre_header.appendChild(header_paramtable);

      // Global controls in header
      var global_row = header_paramtable.insertRow();

      var global_lock_cell = global_row.insertCell();
      global_lock_cell.classList.add("lockcolumn");
      var global_lock_btn = document.createElement("div");
      global_lock_btn.classList.add("lockimage");
      global_lock_btn.title = "Toggle ALL locks [L]";
      global_lock_btn.addEventListener("click", () => this.toggle_all_locks());
      global_lock_cell.appendChild(global_lock_btn);
      this.global_lock_btn = global_lock_btn;

      var global_reset_cell = global_row.insertCell();
      global_reset_cell.classList.add("resetcolumn");
      var global_reset_btn = document.createElement("div");
      global_reset_btn.classList.add("resetimage");
      global_reset_btn.title = "Reset all UNLOCKED parameters to default.";
      global_reset_btn.innerHTML = "↺";
      global_reset_btn.addEventListener("click", () => this.reset_all_unlocked());
      global_reset_cell.appendChild(global_reset_btn);

      var global_label_cell = global_row.insertCell();
      global_label_cell.colSpan = 2;
      global_label_cell.style.color = "var(--col-tan)";
      global_label_cell.style.fontSize = "10px";
      global_label_cell.style.paddingLeft = "5px";
      global_label_cell.innerText = "GLOBAL CONTROLS";

      var centre_params = document.createElement("div");
      centre_params.classList.add("centre_params");
      centre_params.classList.add("scroll_container");
      centre_params.style.display = "none";
      centre_panel.appendChild(centre_params);

      this.centre_params = centre_params;

      var main_paramtable = document.createElement("table");
      main_paramtable.classList.add("paramtable");
      centre_params.appendChild(main_paramtable);

    }

    var right_panel = document.createElement("div");
    right_panel.classList.add("right_panel");
    tab_page.appendChild(right_panel);

    {
      var display_canvas_container = document.createElement("div");
      display_canvas_container.classList.add("display_canvas_container");
      if (this.synth.canvas_bg_logo) {
        display_canvas_container.style.backgroundImage = `url(${this.synth.canvas_bg_logo})`;
      }
      right_panel.appendChild(display_canvas_container);

      var display_canvas = document.createElement("canvas");
      display_canvas.classList.add("display_canvas");
      display_canvas.width = "113";
      display_canvas.height = "200";
      display_canvas_container.appendChild(display_canvas);
      display_canvas.id = this.name + "_waveform_canvas";

      var play_on_change_container_div = document.createElement("div");
      right_panel.appendChild(play_on_change_container_div);

      var play_on_change_checkbox = document.createElement("input");
      play_on_change_checkbox.type = "checkbox";
      play_on_change_checkbox.id = tab_name + "_checkbox_loop";
      play_on_change_checkbox.classList.add("normie_checkbox");
      play_on_change_checkbox.checked = this.play_on_change;
      play_on_change_checkbox.addEventListener("click", this.play_on_change_clicked.bind(this));
      play_on_change_checkbox.title = "Whether the sound should play whenever a parameter is changed.";
      play_on_change_container_div.appendChild(play_on_change_checkbox);

      var play_on_change_label = document.createElement("label");
      play_on_change_label.innerText = "Play on change";
      play_on_change_label.setAttribute("for", tab_name + "_checkbox_loop");
      play_on_change_label.title = play_on_change_checkbox.title;
      play_on_change_container_div.appendChild(play_on_change_label);

      var right_panel_button_list = document.createElement("div");
      right_panel_button_list.classList.add("right_panel_button_list");
      right_panel.appendChild(right_panel_button_list);

      var play_button = this.add_button("play", "Play", this.play_button_clicked.bind(this), "Play the current sound");
      right_panel_button_list.appendChild(play_button);

      var master_volume_container_div = document.createElement("div");
      right_panel_button_list.appendChild(master_volume_container_div);


      var master_vol_min = this.synth.param_min("masterVolume");
      var master_vol_max = this.synth.param_max("masterVolume");
      var master_vol_default = this.synth.param_default("masterVolume");
      var volume_tooltip = "Adjust the volume of the currently selected sound.";
      this.setup_slider(master_volume_container_div, "masterVolume", master_vol_min, master_vol_max, master_vol_default, this.volume_slider_changed.bind(this), volume_tooltip, true);

      var master_volume_label = document.createElement("span");
      master_volume_label.innerText = "Sound Volume";
      master_volume_label.title = volume_tooltip;
      master_volume_container_div.appendChild(master_volume_label);


      var export_wav_button = this.add_button("export_wav", "<u>E</u>xport WAV", this.export_wav_button_clicked.bind(this), "Export the current sound as a WAV file. [CTRL+E]");
      right_panel_button_list.appendChild(export_wav_button);

      var export_all_button = this.add_button("export_all", "Export All", this.export_all_button_clicked.bind(this), "Generate all sounds as WAV files and download them as a single zip file.");
      right_panel_button_list.appendChild(export_all_button);

      var _save_ext = synth_specification.file_extension || "bfxr";
      var save_bfxr_button = this.add_button("save_bfxr", `<u>S</u>ave .${_save_ext}`, this.save_bfxr_button_clicked.bind(this), `Save the current sound as a .${_save_ext} file. [CTRL+S]`);
      right_panel_button_list.appendChild(save_bfxr_button);

      var save_bfxrcol_button = this.add_button("save_bfxrcol", "Save .bcol", this.save_bfxrcol_button_clicked.bind(this), "Save the collection of all sounds in all tabs as a .bcol file.");
      right_panel_button_list.appendChild(save_bfxrcol_button);

      var open_data_button = this.add_button("open_data", "<u>O</u>pen Data", this.open_data_button_clicked.bind(this), "Load the current sound from a .bfxr/.bcol file on your computer. [CTRL+O]");
      right_panel_button_list.appendChild(open_data_button);

      var copy_button = this.add_button("copy", "<u>C</u>opy", this.copy_button_clicked.bind(this), "Copy the current sound [CTRL+C]");
      right_panel_button_list.appendChild(copy_button);

      var paste_button = this.add_button("paste", "Paste", this.paste_button_clicked.bind(this), "Paste the current sound [CTRL+V]");
      right_panel_button_list.appendChild(paste_button);

      var copy_link_button = this.add_button("copy_link", "Copy Link", this.copy_link_button_clicked.bind(this), "Copy the current sound link");
      right_panel_button_list.appendChild(copy_link_button);

      var clear_all_button = this.add_button("clear_all", "Clear All", this.clear_all_button_clicked.bind(this), "Reset everything! Clean slate!");
      right_panel_button_list.appendChild(clear_all_button);

      var about_button = this.add_button("about", "About", this.about_button_clicked.bind(this), "About the current sound");
      right_panel_button_list.appendChild(about_button);

    }


    this.template_list = template_list;

    tabs.push(this);

    this.load_params(synth_specification);
    this.load_templates(synth_specification);

    if (this.files.length == 0) {
      this.create_random_template();
    } else {
      this.update_ui();
    }
  }

  /*********************/
  /*      UI           */
  /*********************/

  toggle_all_locks() {
    var lock_names = Object.keys(this.lock_buttons);
    if (lock_names.length === 0) return;

    // Check if at least one is unlocked
    var any_unlocked = false;
    for (let name of lock_names) {
      if (!this.synth.locked_params[name]) {
        any_unlocked = true;
        break;
      }
    }

    var target_locked_state = any_unlocked; // If any are unlocked, lock them all. Otherwise unlock all.
    for (let param_name in this.synth.locked_params) {
      if (!this.synth.permalocked.includes(param_name)) {
        this.synth.set_locked_param(param_name, target_locked_state);
      }
    }

    this.update_locks();
    SaveLoad.save_all_collections();
  }

  reset_all_unlocked() {
    this.synth.reset_params(true);
    this.files[this.selected_file_index][1] = JSON.stringify(this.synth.params);
    this.update_ui_params();
    this.update_ablements();
    if (this.play_on_change) {
      this.play_sound();
    }
  }

  update_ui() {
    this.update_ui_file_list();
    this.update_ui_params();
    this.update_ablements();
    this.update_locks();
  }

  update_ablements() {
    if (this.selected_file_index === -1) {
      return;
    }
    var is_current_file_modified = this.files[this.selected_file_index][1] != this.files[this.selected_file_index][2];

    var apply_sfx_button = document.getElementById(this.name + "_apply_sfx");
    apply_sfx_button.disabled = !is_current_file_modified;
    var revert_sfx_button = document.getElementById(this.name + "_revert_sfx");
    revert_sfx_button.disabled = !is_current_file_modified;

    //go through file list and set modified_filename
    for (var i = 0; i < this.files.length; i++) {
      var file = this.files[i];
      var file_name = file[0];
      var file_current_state = file[1];
      var file_last_saved_state = file[2];
      var file_item = document.getElementById(this.name + "_file_list").children[i];
      var file_name_span = file_item.children[0];
      var modified = file_current_state != file_last_saved_state;
      if (modified) {
        file_name_span.classList.add("modified_filename");
      } else {
        file_name_span.classList.remove("modified_filename");
      }
    }

    //for every parameter, check if it is disabled
    for (var i = 0; i < this.synth.param_info.length; i++) {
      var param = this.synth.param_info[i];
      if (param.constructor === Array) {
        var param_name = param[2];
        var param_disabled = this.synth.param_is_disabled(param_name);
        var slider = this.sliders[param_name];
        if (param_disabled) {
          slider.disable();
        } else {
          slider.enable();
        }
      } else {
        //not supported yet - this code is just for the square duty stuff right now.
      }
    }
  }

  update_ui_file_list() {
    var file_list = document.getElementById(this.name + "_file_list");
    //get scroll
    var scroll_y = file_list.scrollTop;
    //clear
    file_list.innerHTML = "";
    //add new
    var selected_item = null;
    for (var i = 0; i < this.files.length; i++) {
      var file = this.files[i];
      var selected = i == this.selected_file_index;
      var file_item = this.create_file_entry(file, selected);
      file_list.appendChild(file_item);
      if (selected) {
        selected_item = file_item;
      }
    }
    file_list.scrollTop = scroll_y;

    if (selected_item) {
      setVisible(selected_item, file_list);
    }
  }

  update_ui_params() {
    //for each parameter
    for (var i = 0; i < this.synth.param_info.length; i++) {
      var param = this.synth.param_info[i];
      if (param.constructor === Array) {
        var value = this.synth.params[param[2]];
        var param_name = param[2];
        //it's a slider
        var slider = this.sliders[param_name];
        slider.setValue(value);
      } else {
        switch (param.type) {
          case "BUTTONSELECT":
            var value = this.synth.params[param.name];
            var index = -1;
            //need to find the index of the selected button with this value 
            for (var j = 0; j < param.values.length; j++) {
              if (param.values[j][2] === value) {
                index = j;
                break;
              }
            }
            var button_grid = document.getElementById(this.name + "_button_grid_" + param.name);
            for (var j = 0; j < button_grid.children.length; j++) {
              var child = button_grid.children[j];
              child.disabled = false;
              if (child.classList.contains("selected")) {
                child.classList.remove("selected");
              }
            }
            button_grid.children[index].classList.add("selected");
            button_grid.children[index].disabled = true;
            break;
          case "KNOB_TRANSITION":
            console.error("Knob transition not implemented");
            break;
          default:
            console.error("Unknown param type: " + param.type);
        }
      }

      // Update reset button state
      var param_name = (param.constructor === Array) ? param[2] : param.name;
      var reset_button = this.reset_buttons[param_name];
      if (reset_button) {
        var current_val = this.synth.params[param_name];
        var default_val = this.synth.param_default(param_name);
        if (Math.abs(current_val - default_val) > 0.0001) {
          reset_button.classList.add("modified");
        } else {
          reset_button.classList.remove("modified");
        }
      }
    }
  }

  update_locks() {
    //for each lock-button
    var keys = Object.keys(this.lock_buttons);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var lock_button = this.lock_buttons[key];
      var locked = this.synth.locked_params[key];
      if (locked) {
        lock_button.classList.remove("unlocked");
      } else {
        lock_button.classList.add("unlocked");
      }
    }

    // Update global lock button
    if (this.global_lock_btn) {
      var any_unlocked = false;
      for (var i = 0; i < keys.length; i++) {
        if (!this.synth.locked_params[keys[i]]) {
          any_unlocked = true;
          break;
        }
      }
      if (any_unlocked) {
        this.global_lock_btn.classList.add("unlocked");
      } else {
        this.global_lock_btn.classList.remove("unlocked");
      }
    }
  }
  set_active_tab() {
    var tab_page = document.getElementById("tab_page_" + this.name);
    tab_page.classList.add("active_tab");
    var tab_buttons = document.getElementsByClassName("tab_button");
    for (var i = 0; i < tab_buttons.length; i++) {
      var tab_button = tab_buttons[i];
      if (tab_button.id != "tab_button_" + this.name) {
        tab_button.classList.remove("active_tab");
      } else if (!tab_button.classList.contains("active_tab")) {
        tab_button.classList.add("active_tab");
      }
    }
    var tab_pages = document.getElementsByClassName("tab_page");
    for (var i = 0; i < tab_pages.length; i++) {
      var tab_page = tab_pages[i];
      if (tab_page.id != "tab_page_" + this.name) {
        tab_page.classList.remove("active_tab_page");
      } else if (!tab_page.classList.contains("active_tab_page")) {
        tab_page.classList.add("active_tab_page");
      }
    }

    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      tab.active = tab.name == this.name;
    }
  }

  load_params(synth_specification) {
    for (var i = 0; i < synth_specification.param_info.length; i++) {
      var param = synth_specification.param_info[i];

      //regularize info
      var param_normalized = synth_specification.get_param_normalized(param);

      if (!(param_normalized.name in synth_specification.locked_params)) {
        var do_lock = !synth_specification.permalocked.includes(param_normalized.name);
        this.synth.set_locked_param(param_normalized.name, do_lock);
      }

      if (synth_specification.hide_params.includes(param_normalized.name)) {
        continue;
      }

      this.load_param(param);
    }
    this.update_ui();
  }

  load_param(param) {
    var param_name;
    //if object
    if (param.constructor === Array) {
      var display_name = param[0];
      var tooltip = param[1];
      param_name = param[2];
      var default_value = param[3];
      var min_value = param[4];
      var max_value = param[5];
      var header = param.length > 6 && param[6] === true;
      this.add_slider(param_name, display_name, tooltip, min_value, max_value, default_value, header);
    } else {
      switch (param.type) {
        case "BUTTONSELECT":
          this.add_button_grid(param.name, param.display_name, param.tooltip, param.columns, param.default_value, param.values, param.header === true ? true : false);
          param_name = param.name;
          break;
        case "KNOB_TRANSITION":
          this.add_knob_transition(param.name, param.display_name, param.tooltip, param.default_value_l, param.default_value_r, param.min, param.max, param.default_tween, param.header === true ? true : false);
          param_name = param.name;
          break;
        default:
          console.error("Unknown param type: " + param.type);
      }
    }
  }


  setup_slider(parent_node, slider_id, min, max, defaultval, handler_fn, tooltip, mini = false) {
    var uid = this.name + "_slider_" + slider_id;
    var global_vol_input = document.createElement("input");
    global_vol_input.type = "text";
    global_vol_input.id = uid;
    parent_node.appendChild(global_vol_input);

    //ticks
    var ticks = [];
    var closest_to_default_i = 0;
    var closest_diff = 100000;
    for (var i = 0; i <= 10; i++) {
      var v = min + (max - min) * i / 10;
      ticks.push(v);
      var diff = Math.abs(v - defaultval);
      if (diff < closest_diff) {
        closest_diff = diff;
        closest_to_default_i = i;
      }
    }

    var slider = new Slider("#" + uid, {
      id: slider_id,
      min: min,
      max: max,
      range: false,
      step: 0.01,
      value: defaultval,
      ticks: ticks,
      formatter: (val) => {
        return val.toFixed(2);
      },
      ticks_snap_bounds: 0.005,
      natural_arrow_keys: true
    });
    slider.sliderElem.title = tooltip;
    slider.sliderElem.className += " singleselect";
    slider.sliderElem.getElementsByClassName("slider-tick-container")[0].children[closest_to_default_i].classList.add('defaulttick');

    if (mini === true) {
      slider.sliderElem.classList.add('slidernarrow');
    }

    slider.on("slideStop", handler_fn);

    this.sliders[slider_id] = slider;
  }

  add_button(button_uid, button_text, button_handler, button_tooltip) {
    var button = document.createElement("button");
    button.classList.add("normie_button");
    button.id = button_uid;
    if (button_tooltip != undefined && button_tooltip != "") {
      button.title = button_tooltip;
    }
    button.innerHTML = button_text;
    button.addEventListener("click", button_handler);
    return button;
  }

  create_param_label(label, tooltip) {
    var parameter_name_span = document.createElement("span");
    parameter_name_span.classList.add("parameter_name");
    if (tooltip != undefined && tooltip != "") {
      parameter_name_span.title = tooltip;
    }
    parameter_name_span.innerText = label;
    return parameter_name_span;
  }

  add_knob_transition(
    parameter_name,
    display_name,
    tooltip,
    default_value_l,
    default_value_r,
    min,
    max,
    default_tween,
    header = false
  ) {
    /* should look something like this:
        <td class="slider_container">
            <input type="range" class="input-knob" data-width="32" data-height="32" data-bgcolor="#b7a480" data-fgcolor="#3c3831"/>	
            <input type="range" class="input-knob" data-width="32" data-height="32" data-bgcolor="#c7b490" data-fgcolor="#3c3831" />	
        </td>
    */
    var parent_container = header ? this.centre_header : this.centre_params;
    parent_container.style.display = "block";

    var table = parent_container.children[0];

    var new_row = table.insertRow();

    var lock_cell = new_row.insertCell();
    lock_cell.classList.add("lockcolumn");
    var lock_button = this.generate_lock_button(parameter_name);
    lock_cell.appendChild(lock_button);

    var reset_cell = new_row.insertCell();
    reset_cell.classList.add("resetcolumn");
    var reset_button = this.generate_reset_button(parameter_name);
    reset_cell.appendChild(reset_button);

    var rowspan = 1;
    if (display_name !== "") {
      var label_cell = new_row.insertCell();
      label_cell.classList.add("labelcolumn");
      var label = this.create_param_label(display_name, tooltip);
      label_cell.appendChild(label);
    } else {
      rowspan = 2;
    }

    var parameter_cell = new_row.insertCell();
    parameter_cell.classList.add("transition_container");

    var knob_l = this.new_knob(parameter_name + "_l", default_value_l, min, max, 0.01);
    parameter_cell.appendChild(knob_l);

    var dropdown_uid = this.name + "_dropdown_content_" + parameter_name;


    var default_tween_img = Transfxr.tweenfunctions[0][2];
    var tween_container = document.createElement("img");
    tween_container.src = default_tween_img.src;
    tween_container.classList.add("tween_select_canvas");
    tween_container.classList.add("dropdown");
    tween_container.id = parameter_name + "_tween_select_canvas";
    parameter_cell.appendChild(tween_container);
    tween_container.addEventListener("click", () => {
      document.getElementById(dropdown_uid).classList.toggle("show");
    });

    /*add dropdown for tween selection
 looks like:
 
 <div class="dropdown">
  <button onclick="myFunction()" class="dropbtn">Dropdown</button>
      <div id="myDropdown" class="dropdown-content">
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
          <a href="#">Link 3</a>
      </div>
  </div>
  */

    var dropdown_content_div = document.createElement("div");
    dropdown_content_div.classList.add("dropdown-content");
    dropdown_content_div.id = dropdown_uid;
    parameter_cell.appendChild(dropdown_content_div);

    for (var i = 0; i < Transfxr.tweenfunctions.length; i++) {
      var tween_img = Transfxr.tweenfunctions[i][2];
      var tween_button = document.createElement("img");
      tween_button.src = tween_img.src;
      tween_button.classList.add("tween_select_canvas");
      dropdown_content_div.appendChild(tween_button);
    }

    var knob_r = this.new_knob(parameter_name + "_r", default_value_r, min, max, 0.01);
    parameter_cell.appendChild(knob_r);
  }

  new_knob(id, default_value, min, max, step) {
    var knob = document.createElement("input");
    var uid = this.name + "_knob_" + id;
    knob.id = uid;
    knob.type = "range";
    knob.classList.add("input-knob");
    knob.dataset.width = "32";
    knob.dataset.height = "32";
    knob.dataset.bgcolor = "#b7a480";
    knob.dataset.fgcolor = "#3c3831";
    knob.value = default_value;
    knob.min = min;
    knob.max = max;
    knob.step = step;
    knob.addEventListener("input", () => {
      this.knob_transition_changed(parameter_name, knob_l.value, knob_r.value);
    });
    return knob;
  }

  add_button_grid(
    parameter_name,
    display_name,
    tooltip,
    column_count,
    default_value,
    button_list,
    header = false) {
    var parent_container = header ? this.centre_header : this.centre_params;
    parent_container.style.display = "block";

    var table = parent_container.children[0];

    var new_row = table.insertRow();

    var lock_cell = new_row.insertCell();
    lock_cell.classList.add("lockcolumn");
    var lock_button = this.generate_lock_button(parameter_name);
    lock_cell.appendChild(lock_button);

    var reset_cell = new_row.insertCell();
    reset_cell.classList.add("resetcolumn");
    var reset_button = this.generate_reset_button(parameter_name);
    reset_cell.appendChild(reset_button);

    var rowspan = 1;
    if (display_name !== "") {
      var label_cell = new_row.insertCell();
      label_cell.classList.add("labelcolumn");
      var label = this.create_param_label(display_name, tooltip);
      label_cell.appendChild(label);
    } else {
      rowspan = 2;
    }

    var parameter_cell = new_row.insertCell();
    parameter_cell.rowSpan = rowspan;
    var button_grid = document.createElement("div");
    button_grid.classList.add("button_grid_" + column_count + "c");
    var uid = this.name + "_button_grid_" + parameter_name;
    button_grid.id = uid;
    parameter_cell.appendChild(button_grid);

    for (let i = 0; i < button_list.length; i++) {
      var button = document.createElement("button");
      button.classList.add("button_grid_button");
      button.id = uid + "_" + button_list[i][0];
      button.innerText = button_list[i][0];
      var thumbnail = button_list[i][1];
      button.title = thumbnail;
      var click_value = button_list[i][2];
      button.addEventListener("click", this.button_grid_button_clicked.bind(this, button, parameter_name, i, click_value));
      button_grid.appendChild(button);
    }
  }

  //add_slider("attack_time",0,1,0,"Attack Time","Length of the volume envelope attack.");
  add_slider(
    parameter_name,
    display_name,
    tooltip,
    min,
    max,
    default_value,
    header = false
  ) {
    var uid = this.name + "_slider_" + parameter_name;

    var parent_container = header ? this.centre_header : this.centre_params;
    parent_container.style.display = "block";

    var table = parent_container.children[0];

    var new_row = table.insertRow();

    var lock_cell = new_row.insertCell();
    lock_cell.classList.add("lockcolumn");
    var lock_button = this.generate_lock_button(parameter_name);
    lock_cell.appendChild(lock_button);

    var reset_cell = new_row.insertCell();
    reset_cell.classList.add("resetcolumn");
    var reset_button = this.generate_reset_button(parameter_name);
    reset_cell.appendChild(reset_button);

    var rowspan = 1;
    if (display_name !== "") {
      var label_cell = new_row.insertCell();
      label_cell.classList.add("labelcolumn");
      var label = this.create_param_label(display_name, tooltip);
      label_cell.appendChild(label);
    } else {
      rowspan = 2;
    }

    var parameter_cell = new_row.insertCell();
    parameter_cell.classList.add("slider_container");
    parameter_cell.rowSpan = rowspan;

    this.setup_slider(parameter_cell, parameter_name, min, max, default_value, this.slider_changed.bind(this, parameter_name), tooltip);

  }

  generate_lock_button(parameter_name) {
    var lock_button = document.createElement("div");
    lock_button.classList.add("lockimage");
    lock_button.title = "Lock/unlock parameter.  This prevents it from being changed when you hit Randomize/Mutate.  Press L to toggle lock on *all* parameters.";
    if (!this.synth.locked_params[parameter_name]) {
      lock_button.classList.add("unlocked");
    }
    lock_button.addEventListener("click", () => {
      //unlocked if class unlocked is present
      var val = lock_button.classList.contains("unlocked") ? true : false;
      this.lock_param_clicked(lock_button, parameter_name, val)
    });
    //add param-name as data attribute
    this.lock_buttons[parameter_name] = lock_button;
    return lock_button;
  }

  generate_reset_button(parameter_name) {
    var reset_button = document.createElement("div");
    reset_button.classList.add("resetimage");
    reset_button.title = "Reset parameter to default value.";
    reset_button.innerHTML = "↺";
    reset_button.addEventListener("click", () => {
      this.reset_param_clicked(parameter_name);
    });
    this.reset_buttons[parameter_name] = reset_button;
    return reset_button;
  }

  reset_param_clicked(parameter_name) {
    var default_val = this.synth.param_default(parameter_name);
    this.synth.set_param(parameter_name, default_val);
    this.files[this.selected_file_index][1] = JSON.stringify(this.synth.params);
    this.update_ui_params();
    this.update_ablements();
    if (this.play_on_change) {
      this.play_sound();
    }
  }


  /*********************/
  /*      WIDGETS      */
  /*********************/




  /*********************/
  /*      FILES        */
  /*********************/

  find_unique_filename(desired_name, ignore_index = -1) {
    var new_name = desired_name.replace(/[^a-zA-Z0-9_-]/g, "");

    if (new_name.length == 0) {
      new_name = "Sfx";
    }

    var file_name_already_exists = false;
    for (var i = 0; i < this.files.length; i++) {
      if (i === ignore_index) {
        continue;
      }
      if (this.files[i][0] == new_name) {
        file_name_already_exists = true;
        break;
      }
    }

    if (file_name_already_exists) {
      //strip all digits from end of name FROM THE RIGHT
      while (new_name.length > 0 && !isNaN(new_name[new_name.length - 1])) {
        new_name = new_name.slice(0, -1);
      }

      if (new_name.length == 0) {
        new_name = "Sfx";
      }

      var suffix = -1;
      var found = true
      var test_name;
      while (found) {
        found = false;
        suffix++;
        test_name = new_name;
        if (suffix !== 0) {
          test_name = new_name + suffix;
        }
        for (var i = 0; i < this.files.length; i++) {
          if (i == ignore_index) {
            continue;
          }
          if (this.files[i][0].toLowerCase() == test_name.toLowerCase()) {
            found = true;
            break;
          }
        }
      }
      new_name = test_name;
    }
    return new_name;
  }

  delete_file(file_name) {
    var deleted_file_index = -1;
    for (var i = 0; i < this.files.length; i++) {
      if (this.files[i][0] == file_name) {
        deleted_file_index = i;
        this.files.splice(i, 1);
        break;
      }
    }
    if (this.selected_file_index >= deleted_file_index) {
      this.selected_file_index--;
      if (this.selected_file_index < 0 && this.files.length > 0) {
        this.selected_file_index = 0;
        this.set_selected_file(this.files[0][0]);
      }
      if (this.selected_file_index >= 0) {
        var file_dat = this.files[this.selected_file_index];
        this.synth.apply_params(JSON.parse(file_dat[1]));
        this.synth.generate_sound();
        this.redraw_waveform();
        if (this.play_on_change) {
          this.play_sound();
        }
      }
    }
    this.update_ui();
    SaveLoad.save_all_collections();
  }

  get_current_file_name() {
    if (this.selected_file_index === -1) {
      return null;
    }
    return this.files[this.selected_file_index][0];
  }

  //returns true if the selected file was changed, false if it was already selected
  set_selected_file(file_name) {
    for (var i = 0; i < this.files.length; i++) {
      if (this.files[i][0] == file_name) {
        if (this.selected_file_index === i) {
          return false;
        }
        this.selected_file_index = i;
        break;
      }
    }

    var file_list = document.getElementById(this.name + "_file_list");
    for (var i = 0; i < file_list.children.length; i++) {
      var file_item = file_list.children[i];
      file_item.classList.remove("file_selected");
      let file_name_span = file_item.children[0];
      file_name_span.contentEditable = false;
    }
    var file_item = file_list.children[this.selected_file_index];
    file_item.classList.add("file_selected");
    let file_name_span = file_item.children[0];
    file_name_span.contentEditable = true;
    file_name_span.focus();

    //update the current params
    var params = JSON.parse(this.files[this.selected_file_index][1]);
    this.synth.apply_params(params);

    this.update_ui_params();
    this.update_ablements();
    return true;
  }


  create_file_entry(file_dat, selected) {
    var modified = file_dat[1] !== file_dat[2];
    var file_name = file_dat[0];
    var display_name = file_name;
    var file_item = document.createElement("div");
    file_item.classList.add("file_item");
    if (selected) {
      file_item.classList.add("file_selected");
    }
    var file_name_span = document.createElement("span");
    file_name_span.classList.add("file_item_name");
    file_name_span.innerText = display_name;
    if (modified) {
      file_name_span.classList.add("modified_filename");
    }
    if (selected) {
      file_name_span.contentEditable = true;
    }
    file_name_span.addEventListener("blur", (event) => {
      if (file_name_span.innerText !== file_name) {
        file_name = this.file_item_renamed(file_name, file_name_span.innerText);
        file_name_span.innerText = file_name;
      }
    });
    file_item.appendChild(file_name_span);
    file_name_span.addEventListener("click", (event) => {
      this.file_item_click(file_name, event.target);
    });

    var delete_button = document.createElement("button");
    delete_button.classList.add("delete_button");
    delete_button.innerHTML = "<img src='./img/delete.png' alt='Delete'>";
    delete_button.addEventListener("click", (event) => {
      this.delete_file(file_name);
    });
    file_item.appendChild(delete_button);
    return file_item;
  }

  /*********************/
  /*      TEMPLATES      */
  /*********************/

  load_templates(synth_specification) {
    for (var i = 0; i < synth_specification.templates.length; i++) {
      let generator = synth_specification.templates[i];
      this.add_generator(generator);
    }
  }

  create_random_template() {
    var [template_name, params] = this.synth.create_random_template();
    this.create_new_sound_from_params(template_name, params);
  }

  create_new_sound_from_params(template_name, params, forcecreate = false) {
    this.synth.apply_params(params);
    if (this.create_new_sound || this.files.length == 0 || this.selected_file_index === -1 || forcecreate) {
      this.current_params = params;
      var filename = this.find_unique_filename(template_name);
      this.files.push([filename, JSON.stringify(params), JSON.stringify(params)]);
      this.selected_file_index = this.files.length - 1;
      SaveLoad.save_all_collections();
    } else {
      this.current_params = params;
      this.files[this.selected_file_index][1] = JSON.stringify(params);
    }
    if (this.play_on_change) {
      this.play_sound();
    }
    this.update_ui();
  }

  add_generator(generator) {
    /*button_id,button_text,button_handler,button_tooltip
    */
    var button_text = generator[0];
    var button_tooltip = generator[1];
    var generator_name = generator[2];
    var button_uid = this.name + "_generator_" + generator_name;
    var button = this.add_button(button_uid, button_text, this.template_clicked.bind(this, generator_name), button_tooltip);
    this.template_list.appendChild(button);
  }

  /*********************/
  /* STATE MANAGEMENT  */
  /*********************/


  add_template(template_name, button_tooltip, param_fn) {
    var uid = this.name + "_template_" + template_name;
    var button = this.add_button(uid, template_name, param_fn, button_tooltip);
    this.template_list.appendChild(button);
  }

  serialize_params() {
    var file_dat = this.files[this.selected_file_index];
    var file_name = file_dat[0];
    var file_jstor = file_dat[1];
    var file_jstor_json_dat = JSON.parse(file_jstor);

    // Let the synth override serialization format (e.g. ZzFX uses a positional array)
    if (this.synth.serialize_sound) {
      return this.synth.serialize_sound(file_name, file_jstor_json_dat);
    }

    var file_jstor_json = {};
    file_jstor_json.synth_type = this.name;
    file_jstor_json.version = this.synth.version;
    file_jstor_json.file_name = file_name;
    file_jstor_json.params = file_jstor_json_dat;
    return JSON.stringify(file_jstor_json, null, 2);
  }
  /*********************/
  /* Event Handlers    */
  /*********************/

  template_clicked(template_name) {
    console.log("Template clicked: " + template_name);
    var template_data = null;
    for (var i = 0; i < this.synth.templates.length; i++) {
      if (this.synth.templates[i][2] == template_name) {
        template_data = this.synth.templates[i];
        break;
      }
    }
    // special behaviour - if you hit 'mutate', then have the new file-name be
    // based on the existing one.
    var file_name = template_name === "mutate_params" ? this.get_current_file_name() : template_data[3];
    this.synth[template_data[2]].bind(this.synth)();
    this.create_new_sound_from_params(file_name, this.synth.params);
  }

  create_new_sound_clicked(event) {
    this.create_new_sound = event.target.checked;
    console.log("Create new sound: " + this.create_new_sound);
  }

  play_on_change_clicked(event) {
    console.log("Play on change clicked");
    this.play_on_change = event.target.checked;
  }

  play_button_clicked() {
    console.log("Play button clicked");
    this.play_sound();
  }

  slider_changed(param_name, value) {
    console.log("Slider changed " + param_name + " to " + value);
    this.synth.set_param(param_name, value);
    this.files[this.selected_file_index][1] = JSON.stringify(this.synth.params);
    this.update_ablements();
    if (this.play_on_change) {
      this.play_sound();
    }
  }

  volume_slider_changed(value) {
    this.slider_changed("masterVolume", value);
  }

  export_wav_button_clicked() {
    var wav_uri = this.synth.generate_sound_uri();

    const a = document.createElement('a');
    a.href = wav_uri;
    a.download = this.files[this.selected_file_index][0] + ".wav";
    a.click();
    a.remove();
  }



  async export_all_button_clicked() {
    console.log("Export all button clicked");

    var zip = new JSZip();

    //show export dialog
    var export_dialog = document.getElementById("export-dialog");
    export_dialog.showModal();
    var progress_bar = document.getElementById("export-progress");
    var download_link = document.getElementById("export-download-link");
    var export_progress_text = document.getElementById("export-progress-text");
    //hide download link
    download_link.style.display = "none";
    //set progress to 0
    progress_bar.value = 0;
    var file_count = 0;
    for (var i = 0; i < tabs.length; i++) {
      file_count += tabs[i].files.length;
    }
    progress_bar.max = file_count + 1;

    var progress_bar_val = 0;

    //each entry is [filename, blob]
    var generated_files = [];

    //for all tabs
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var selected_file_index = tab.selected_file_index;
      var folder = zip.folder(tab.name);
      //for all files in the tab
      for (var j = 0; j < tab.files.length; j++) {
        let file = tab.files[j];
        //get blob
        let sound_name = file[0];
        export_progress_text.innerText = progress_bar_val + "/" + file_count + "(generating " + sound_name + ")";
        let params = JSON.parse(file[1]);

        tab.synth.apply_params(params);
        tab.synth.generate_sound();
        //pause a bit
        await new Promise(resolve => setTimeout(resolve, 10));

        let datauri = tab.synth.generate_sound_uri();
        var cropped_datauri = datauri.split(",")[1];
        folder.file(sound_name + ".wav", cropped_datauri, { base64: true });
        progress_bar_val++;
        progress_bar.value = progress_bar_val;
      }
      //reload selected_file_index in that tab when we're done
      {
        let file = tab.files[selected_file_index];
        let sound_name = file[0];
        let params = JSON.parse(file[1]);
        tab.synth.apply_params(params);
        tab.synth.generate_sound();
      }
    }

    console.log("Generated files: " + generated_files.length);
    export_progress_text.innerText = "generating zip file...";
    //create a zip file
    zip.generateAsync({ type: "blob" }).then(function (content) {
      download_link.href = URL.createObjectURL(content);
      download_link.style.display = "block";
      progress_bar.value = progress_bar.max;
      export_progress_text.innerText = "zip file generated!";
    });
  }

  save_bfxr_button_clicked() {
    console.log("Save bfxr button clicked");
    var file_jstor_json_string = this.serialize_params();
    var ext = this.synth.file_extension || "bfxr";
    var file_name = this.files[this.selected_file_index][0] + "." + ext;
    //save file to local computer
    var a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(file_jstor_json_string);
    a.download = file_name;
    a.click();
  }

  save_bfxrcol_button_clicked() {
    console.log("Save bfxrcol button clicked");
    var save_str = SaveLoad.serialize_collection();
    var a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(save_str);
    a.download = 'collection.bcol';
    a.click();
  }

  open_data_button_clicked() {
    console.log("Load data button clicked");

    //open file dialog, with .bfxr .bcol accepted   
    var file_input = document.createElement("input");
    file_input.type = "file";
    file_input.accept = ".bfxr,.bcol,.zzfx";
    file_input.multiple = false;
    file_input.addEventListener("change", (event) => {
      console.log("File selected: " + event.target.files[0].name);
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event) => {
        if (file.name.endsWith(".bfxr") || file.name.endsWith(".zzfx")) {
          SaveLoad.load_serialized_synth(event.target.result);
        } else if (file.name.endsWith(".bcol")) {
          SaveLoad.load_serialized_collection(event.target.result);
        }
      };
      reader.readAsText(file);
    });
    file_input.click();
  }

  copy_button_clicked() {
    console.log("Copy button clicked");
    var file_jstor_json_string = this.serialize_params();
    navigator.clipboard.writeText(file_jstor_json_string);
  }

  paste_button_clicked() {
    //load from clipboard
    navigator.clipboard.readText().then(text => {
      SaveLoad.load_serialized_synth(text);
    });
  }

  copy_link_button_clicked() {
    console.log("Copy link button clicked");
    var file_dat = this.files[this.selected_file_index];
    var file_name = file_dat[0];
    var file_jstor = file_dat[1];
    var params_parsed = this.synth.params;
    var file_jstor_json_string = SaveLoad.shallow_dict_serialize(this.name, file_name, params_parsed);
    //need to escape it so it can be used as a url parameter
    var file_jstor_json_string_escaped = encodeURIComponent(file_jstor_json_string);
    var current_url = window.location.href;
    //strip the query string
    var current_url_without_query = current_url.split("?")[0];
    //add the file_jstor_json_string_escaped to the url
    var new_url = current_url_without_query + "?sfx=" + file_jstor_json_string_escaped;
    //copy to clipboard
    navigator.clipboard.writeText(new_url);
  }


  clear_all_button_clicked() {
    //need to confirm with user
    if (confirm("Are you sure you want to clear all data in this synth (THIS DELETES ALL SOUNDS FROM THIS TAB)?")) {
      console.log("Clear all button clicked");
      this.files = [];
      this.selected_file_index = -1;
      this.update_ui();
      SaveLoad.save_all_collections();
    }
  }

  about_button_clicked() {
    console.log("About button clicked");
    var about_dialog = document.getElementById("about-dialog");
    about_dialog.showModal();
  }

  apply_sfx() {
    if (this.files[this.selected_file_index][2] === this.files[this.selected_file_index][1]) {
      return;
    }
    console.log("Apply sfx");
    this.files[this.selected_file_index][2] = this.files[this.selected_file_index][1];
    //remove modified_filename
    var file_item = document.getElementById(this.name + "_file_list").children[this.selected_file_index];
    var file_name_span = file_item.children[0];
    file_name_span.classList.remove("modified_filename");
    this.update_ablements();
    SaveLoad.save_all_collections();
  }

  revert_sfx() {
    if (this.files[this.selected_file_index][2] === this.files[this.selected_file_index][1]) {
      return;
    }
    console.log("Revert sfx");
    var synth_params_json = this.files[this.selected_file_index][2];
    var synth_params = JSON.parse(synth_params_json);
    this.synth.apply_params(synth_params);
    this.files[this.selected_file_index][1] = synth_params_json;
    //add modified_filename
    var file_item = document.getElementById(this.name + "_file_list").children[this.selected_file_index];
    var file_name_span = file_item.children[0];
    file_name_span.classList.add("modified_filename");
    this.update_ui_params();
    this.update_ablements();
    if (this.play_on_change) {
      this.play_sound();
    }
    SaveLoad.save_all_collections();
  }

  duplicate_sfx() {
    console.log("Duplicate sfx");
    if (this.selected_file_index === -1) {
      //load from current params
      var file_name = "Sfx";
      var file_jstor = JSON.stringify(this.synth.params);
      var new_file_name = this.find_unique_filename(file_name);
      var new_file_dat = [new_file_name, file_jstor, file_jstor];
      //insert after current file
      this.files.splice(this.selected_file_index + 1, 0, new_file_dat);
      this.selected_file_index++;
      this.update_ui();
    } else {
      var cur_file_dat = this.files[this.selected_file_index];
      var file_name = cur_file_dat[0];
      var file_jstor = cur_file_dat[1];
      var new_file_name = this.find_unique_filename(file_name);
      var new_file_dat = [new_file_name, file_jstor, file_jstor];
      //insert after current file
      this.files.splice(this.selected_file_index + 1, 0, new_file_dat);
      this.selected_file_index++;
      this.update_ui();
    }
    SaveLoad.save_all_collections();
  }

  lock_param_clicked(node, param_name, value) {
    console.log("Lock param " + param_name + " clickedwith value " + value);
    value = !value;
    if (value) {
      node.classList.add("unlocked");
    } else {
      node.classList.remove("unlocked");
    }
    this.synth.locked_params[param_name] = !value;
    SaveLoad.save_all_collections();
  }

  button_grid_button_clicked(node, param_name, button_index, value) {
    console.log("Button grid button clicked for " + param_name + " with value " + value);
    var conatiner_uid = this.name + "_button_grid_" + param_name;
    for (var i = 0; i < node.parentElement.children.length; i++) {
      var selected = button_index === i;
      var child = node.parentElement.children[i];
      if (selected) {
        child.classList.add("selected");
        child.disabled = true;
      } else {
        child.classList.remove("selected");
        child.disabled = false;
      }
    }
    this.synth.set_param(param_name, value);
    this.files[this.selected_file_index][1] = JSON.stringify(this.synth.params);
    this.update_ablements();
    if (this.play_on_change) {
      this.play_sound();
    }
  }

  file_item_click(file_name, target) {
    console.log("File item clicked: " + file_name);
    var file_changed = this.set_selected_file(file_name);
    if (file_changed && this.play_on_change) {
      this.play_sound();
    }
  }

  file_item_renamed(file_name, new_name) {
    var file_name_index = -1;
    for (var i = 0; i < this.files.length; i++) {
      if (this.files[i][0] == file_name) {
        file_name_index = i;
        break;
      }
    }
    new_name = this.find_unique_filename(new_name, file_name_index);
    this.files[file_name_index][0] = new_name;
    console.log("File item renamed: " + file_name + " to " + new_name);
    SaveLoad.save_all_collections();
    return new_name;
  }

  play_sound() {
    this.synth.play();
    this.redraw_waveform();
  }

  redraw_waveform() {
    var canvas = document.getElementById(this.name + "_waveform_canvas");
    var context2d = canvas.getContext("2d");
    //clear
    context2d.clearRect(0, 0, canvas.width, canvas.height);
    this.synth.drawWaveform(context2d);
  }

  on_key_down(event) {
    var gobbled = false;
    console.log(this.name + " sKey down: " + event.key);

    //check if the tab is focused
    if (this.active) {
      //ignore if currently typing in the filename (into a file_item_name contenteditable has focus)
      if (document.activeElement.classList.contains("file_item_name")) {
        return;
      }
      var key_upper_case = event.key.toUpperCase();
      console.log(this.name + " Key down: " + event.key);
      var mod_key = event.ctrlKey || event.metaKey;
      switch (key_upper_case) {
        //ctrl+c
        case "C":
          if (mod_key) {
            this.copy_button_clicked();
            gobbled = true;
          }
          break;
        case "V":
          if (mod_key) {
            this.paste_button_clicked();
            gobbled = true;
          }
          break;
        case "S":
          if (mod_key) {
            this.save_bfxr_button_clicked();
            gobbled = true;
          }
          break;
        case "E":
          if (mod_key) {
            this.export_wav_button_clicked();
            gobbled = true;
          }
          break;
        case "O":
          if (mod_key) {
            this.load_data_button_clicked();
            gobbled = true;
          }
          break;
        case "L":
          if (!mod_key) {
            this.toggle_all_locks();
            gobbled = true;
          }
          break;
        case "R":
          if (!mod_key) {
            this.synth.randomize_params();
            this.files[this.selected_file_index][1] = JSON.stringify(this.synth.params);
            this.update_ui_params();
            this.update_ablements();
            this.play_sound();
            gobbled = true;
          }
          break;
        case "M":
          if (!mod_key) {
            this.synth.mutate_params();
            this.files[this.selected_file_index][1] = JSON.stringify(this.synth.params);
            this.update_ui_params();
            this.update_ablements();
            this.play_sound();
            gobbled = true;
          }
          break;
        case "ENTER":
        case "NUMPADENTER":
        case " ":
          //if button/link not focussed
          if (!mod_key) {
            var node_name_lowercase = document.activeElement.nodeName.toLowerCase();
            if (node_name_lowercase !== "button" && node_name_lowercase !== "a") {
              this.play_sound();
              gobbled = true;
            }
          }
          break;
      }
    }
    if (gobbled) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return true;
  }
} class SaveLoad {
  static collection_save_enabled = true;

  static loaded_data = {};

  static save_all_collections() {
    if (!SaveLoad.collection_save_enabled) {
      return;
    }
    //collect all file info together
    var save_str = SaveLoad.serialize_collection();
    //save to local storage
    localStorage.setItem("save_data", save_str);
    console.log("saved all collections (length " + save_str.length + ")");
  }


  static load_all_collections() {
    //check if there is any save data
    if (!localStorage.getItem("save_data")) {
      return;
    }
    SaveLoad.loaded_data = JSON.parse(localStorage.getItem("save_data"));
  }

  static check_url_for_sfxr_params() {
    var url = window.location.href;
    var querystring = window.location.search;
    var params = new URLSearchParams(querystring);
    if (!params.has("sfx")) {
      return;
    }
    var synth_dat_str = params.get("sfx");
    var [synth_name, filename, params] = SaveLoad.shallow_dict_deserialize(synth_dat_str);
    var tab = tabs.find(tab => tab.synth.name == synth_name);
    if (!tab) {
      console.error("No tab found for synth_name: " + synth_name);
      return;
    }
    tab.set_active_tab();
    tab.create_new_sound_from_params(filename, params, true);
    //having loaded it, we can update the url to remove the sfx parameter
    var new_url = window.location.href.split("?")[0];
    window.history.replaceState({}, '', new_url);
  }

  static shallow_dict_serialize(synth_name, filename, dict) {
    //instead of returning a csv string, returns a csv string (with commas delimited by \)
    var result = synth_name + "~" + filename + "~";
    var keys = Object.keys(dict);
    console.log("exporting keys: " + keys);
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
      result += dict[keys[i]] + "~";
    }
    //trim final ","
    result = result.slice(0, -1);
    return result;
  }

  static shallow_dict_deserialize(str) {
    var entries = str.split("~");
    var synth_name = entries[0];
    var filename = entries[1];
    //need to find the tab that matches the synth_name
    var tab = tabs.find(tab => tab.synth.name == synth_name);
    if (!tab) {
      console.error("No tab found for synth_name: " + synth_name);
      return;
    }
    var default_params = tab.synth.default_params();
    var keys = Object.keys(default_params);
    keys.sort();
    console.log("importing keys: " + keys);
    var dict = {};
    for (var i = 0; i < keys.length; i++) {
      dict[keys[i]] = parseFloat(entries[i + 2]);
    }
    return [synth_name, filename, dict];
  }


  static load_serialized_synth(str) {
    var data = JSON.parse(str);

    var synth_name = data.synth_type;
    var synth_version = data.version;
    var file_name = data.file_name;
    var params = data.params;

    const activeTab = tabs.find(t => t.active);
    const synthNameLower = (synth_name || "").toLowerCase();

    // Find the specific tab for this synth type, if any
    var tab = tabs.find(tab => tab.synth.name.toLowerCase() === synthNameLower);

    // Override: If the active tab is CyberFX and we're importing BFXR or ZzFX data, force staying on CyberFX.
    const isActiveCyberFX = activeTab && activeTab.synth.name === "CyberFX";
    const isBfxrSource = synthNameLower === "bfxr" || (data.params && data.params.attackTime !== undefined);
    const isZzfxSource = synthNameLower === "zzfx";

    if (isActiveCyberFX && (isBfxrSource || isZzfxSource)) {
      tab = activeTab;

      // Perform translation for CyberFX
      if (isBfxrSource) {
        const bfxr = data.params || data;
        const res = tab.synth.default_params();
        const waveMap = { 0: 5, 1: 2, 2: 0, 3: 4, 4: 1, 6: 3, 7: 8, 8: 9, 9: 7 };
        res.shape = waveMap[bfxr.waveType] ?? 0;
        res.attack = (bfxr.attackTime ** 2 * 100000) / 44100;
        res.sustain = (bfxr.sustainTime ** 2 * 100000) / 44100;
        res.decay = (bfxr.decayTime ** 2 * 100000 + 10) / 44100;
        res.release = 0.1;
        res.frequency = 44100 * (bfxr.frequency_start ** 2 + 0.001) / 100;
        res.slide = bfxr.frequency_slide * 10;
        res.deltaSlide = bfxr.frequency_acceleration * 10;
        res.pitchJump = bfxr.pitch_jump_amount * 100;
        res.pitchJumpTime = bfxr.pitch_jump_onset_percent;
        res.vibratoDepth = bfxr.vibratoDepth;
        res.vibratoSpeed = bfxr.vibratoSpeed;
        res.shapeCurve = bfxr.squareDuty * 2;
        res.dutySweep = bfxr.dutySweep;
        if (bfxr.lpFilterCutoff < 1.0) res.filter = bfxr.lpFilterCutoff;
        else if (bfxr.hpFilterCutoff > 0.0) res.filter = -bfxr.hpFilterCutoff;
        res.lpFilterCutoffSweep = bfxr.lpFilterCutoffSweep;
        res.lpFilterResonance = bfxr.lpFilterResonance;
        res.bitCrush = bfxr.bitCrush;
        res.bitCrushSweep = bfxr.bitCrushSweep;
        res.sustainPunch = bfxr.sustainPunch;
        res.compressionAmount = bfxr.compressionAmount;
        res.overtones = bfxr.overtones;
        res.overtoneFalloff = bfxr.overtoneFalloff;
        res.flangerOffset = bfxr.flangerOffset;
        res.flangerSweep = bfxr.flangerSweep;
        data.params = res; // Set converted params
        data.synth_type = "CyberFX"; // Masquerade as CyberFX
      } else if (isZzfxSource) {
        const zzfxParams = Array.isArray(data.params) ? data.params : null;
        const res = tab.synth.default_params();
        if (zzfxParams) {
          ZzFX.PARAM_ORDER.forEach((k, i) => { if (res.hasOwnProperty(k)) res[k] = zzfxParams[i]; });
        } else {
          Object.assign(res, data.params);
        }
        data.params = res;
        data.synth_type = "CyberFX";
      }
    }

    if (!tab) {
      // Final fallback to active tab if no match found
      tab = activeTab;
    }

    if (!tab) {
      console.error("No tab found and no active tab for synth_name: " + synth_name);
      return;
    }

    // Let the synth convert its file format to a params dict (e.g. ZzFX array → dict)
    if (tab.synth.deserialize_params) {
      params = tab.synth.deserialize_params(data);
    }
    tab.set_active_tab();
    tab.create_new_sound_from_params(file_name, params, true);
  }

  static load_serialized_collection(str) {
    var data = JSON.parse(str);
    var active_tab_index = data.active_tab_index;
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var tab_data = data[tab.synth.name];
      if (!tab_data) continue; // collection predates this synth — skip
      var files = tab_data.files;
      var selected_file_index = tab_data.selected_file_index;
      var create_new_sound = tab_data.create_new_sound;
      var play_on_change = tab_data.play_on_change;
      var locked_params = tab_data.locked_params;
      tab.files = files;
      tab.selected_file_index = -1;
      tab.create_new_sound = create_new_sound;
      tab.play_on_change = play_on_change;
      tab.synth.locked_params = locked_params;
      tab.update_ui();
      if (files[selected_file_index] != null && files[selected_file_index].length > 0) {
        tab.set_selected_file(files[selected_file_index][0]);
        tab.synth.generate_sound();
        tab.redraw_waveform();
      }
      tab.update_ui();
    }
    tabs[active_tab_index].set_active_tab();
  }

  static serialize_collection() {
    var save_data = {};
    var active_tab_index = -1;
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var files = tab.files;
      var selected_file_index = tab.selected_file_index;
      var compiled_data = {
        files: files,
        selected_file_index: selected_file_index,
        create_new_sound: tab.create_new_sound,
        play_on_change: tab.play_on_change,
        locked_params: tab.synth.locked_params
      }
      save_data[tab.synth.name] = compiled_data;
      if (tab.active) {
        active_tab_index = i;
      }
    }
    save_data.active_tab_index = active_tab_index;
    var serialized_str = JSON.stringify(save_data);
    return serialized_str;
  }

} "use strict";

function register_tabs() {
  SaveLoad.load_all_collections();
  SaveLoad.collection_save_enabled = false;
  var cyberfx_tab = new Tab(new CyberFX());
  var bfxr_tab = new Tab(new Bfxr());
  var zzfx_tab = new Tab(new ZzFX());
  SaveLoad.collection_save_enabled = true;
  set_tab_from_loaded_data();
  SaveLoad.save_all_collections();
}

function set_tab_from_loaded_data() {
  if (!SaveLoad.loaded_data) {
    return;
  }
  var active_tab_index = SaveLoad.loaded_data.active_tab_index;
  if (active_tab_index >= 0) {
    tabs[active_tab_index].set_active_tab();
  }
}

window.onload = function () {
  register_tabs();
  SaveLoad.check_url_for_sfxr_params();
  register_drop_handlers();
}

function showDropZone() {
  const dropZone = document.getElementById('dropzone');
  dropZone.style.display = "flex";
}

function hideDropZone() {
  const dropZone = document.getElementById('dropzone');
  dropZone.style.display = "none";
}

function register_drop_handlers() {
  const dropZone = document;
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    hideDropZone();
    if (e.dataTransfer.files.length === 1 && e.dataTransfer.files[0].name.endsWith('.bcol')) {
      var file = e.dataTransfer.files[0];
      var reader = new FileReader();
      reader.onload = (event) => {
        SaveLoad.load_serialized_collection(event.target.result);
        SaveLoad.save_all_collections();
      };
      reader.readAsText(file);
    } else {
      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        var filename = e.dataTransfer.files[i].name;
        if (filename.endsWith('.bfxr') || filename.endsWith('.cfx') || filename.endsWith('.zzfx')) {
          var file = e.dataTransfer.files[i];
          var reader = new FileReader();
          reader.onload = (event) => {
            SaveLoad.load_serialized_synth(event.target.result);
            SaveLoad.save_all_collections();
          };
          reader.readAsText(file);
        }
      }
    }
  });

  document.addEventListener('dragover', (e) => {
    e.dataTransfer.dropEffect = "copy";
    e.preventDefault();
    showDropZone();
  });

  document.addEventListener('dragleave', (e) => {
    if (e.fromElement == null) {
      hideDropZone();
    }
  });

  document.addEventListener('dragend', (e) => {
    hideDropZone();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const dialogTabs = document.querySelectorAll('.dialog-tab');
  dialogTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dialog-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabContent = document.getElementById(tab.dataset.tab + '-tab');
      if (tabContent) tabContent.classList.add('active');
    });
  });
});
