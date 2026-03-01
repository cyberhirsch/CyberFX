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
/*! =======================================================
                      VERSION  11.0.2              
========================================================= */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! =========================================================
 * bootstrap-slider.js
 *
 * Maintainers:
 *		Kyle Kemp
 *			- Twitter: @seiyria
 *			- Github:  seiyria
 *		Rohit Kalkur
 *			- Twitter: @Rovolutionary
 *			- Github:  rovolution
 *
 * =========================================================
 *
 * bootstrap-slider is released under the MIT License
 * Copyright (c) 2019 Kyle Kemp, Rohit Kalkur, and contributors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * ========================================================= */

/**
 * Bridget makes jQuery widgets
 * v1.0.1
 * MIT license
 */
var windowIsDefined = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object";

(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
    var jQuery;
    try {
      jQuery = require("jquery");
    } catch (err) {
      jQuery = null;
    }
    module.exports = factory(jQuery);
  } else if (window) {
    window.Slider = factory(window.jQuery);
  }
})(function ($) {
  // Constants
  var NAMESPACE_MAIN = 'slider';
  var NAMESPACE_ALTERNATE = 'bootstrapSlider';

  // Polyfill console methods
  if (windowIsDefined && !window.console) {
    window.console = {};
  }
  if (windowIsDefined && !window.console.log) {
    window.console.log = function () { };
  }
  if (windowIsDefined && !window.console.warn) {
    window.console.warn = function () { };
  }

  // Reference to Slider constructor
  var Slider;

  (function ($) {

    'use strict';

    // -------------------------- utils -------------------------- //

    var slice = Array.prototype.slice;

    function noop() { }

    // -------------------------- definition -------------------------- //

    function defineBridget($) {

      // bail if no jQuery
      if (!$) {
        return;
      }

      // -------------------------- addOptionMethod -------------------------- //

      /**
    * adds option method -> $().plugin('option', {...})
    * @param {Function} PluginClass - constructor class
    */
      function addOptionMethod(PluginClass) {
        // don't overwrite original option method
        if (PluginClass.prototype.option) {
          return;
        }

        // option setter
        PluginClass.prototype.option = function (opts) {
          // bail out if not an object
          if (!$.isPlainObject(opts)) {
            return;
          }
          this.options = $.extend(true, this.options, opts);
        };
      }

      // -------------------------- plugin bridge -------------------------- //

      // helper function for logging errors
      // $.error breaks jQuery chaining
      var logError = typeof console === 'undefined' ? noop : function (message) {
        console.error(message);
      };

      /**
    * jQuery plugin bridge, access methods like $elem.plugin('method')
    * @param {String} namespace - plugin name
    * @param {Function} PluginClass - constructor class
    */
      function bridge(namespace, PluginClass) {
        // add to jQuery fn namespace
        $.fn[namespace] = function (options) {
          if (typeof options === 'string') {
            // call plugin method when first argument is a string
            // get arguments for method
            var args = slice.call(arguments, 1);

            for (var i = 0, len = this.length; i < len; i++) {
              var elem = this[i];
              var instance = $.data(elem, namespace);
              if (!instance) {
                logError("cannot call methods on " + namespace + " prior to initialization; " + "attempted to call '" + options + "'");
                continue;
              }
              if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                logError("no such method '" + options + "' for " + namespace + " instance");
                continue;
              }

              // trigger method with arguments
              var returnValue = instance[options].apply(instance, args);

              // break look and return first value if provided
              if (returnValue !== undefined && returnValue !== instance) {
                return returnValue;
              }
            }
            // return this if no return value
            return this;
          } else {
            var objects = this.map(function () {
              var instance = $.data(this, namespace);
              if (instance) {
                // apply options & init
                instance.option(options);
                instance._init();
              } else {
                // initialize new instance
                instance = new PluginClass(this, options);
                $.data(this, namespace, instance);
              }
              return $(this);
            });

            if (objects.length === 1) {
              return objects[0];
            }
            return objects;
          }
        };
      }

      // -------------------------- bridget -------------------------- //

      /**
    * converts a Prototypical class into a proper jQuery plugin
    *   the class must have a ._init method
    * @param {String} namespace - plugin name, used in $().pluginName
    * @param {Function} PluginClass - constructor class
    */
      $.bridget = function (namespace, PluginClass) {
        addOptionMethod(PluginClass);
        bridge(namespace, PluginClass);
      };

      return $.bridget;
    }

    // get jquery from browser global
    defineBridget($);
  })($);

  /*************************************************
        BOOTSTRAP-SLIDER SOURCE CODE
    **************************************************/

  (function ($) {
    var autoRegisterNamespace = void 0;

    var ErrorMsgs = {
      formatInvalidInputErrorMsg: function formatInvalidInputErrorMsg(input) {
        return "Invalid input value '" + input + "' passed in";
      },
      callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"
    };

    var SliderScale = {
      linear: {
        getValue: function getValue(value, options) {
          if (value < options.min) {
            return options.min;
          } else if (value > options.max) {
            return options.max;
          } else {
            return value;
          }
        },
        toValue: function toValue(percentage) {
          var rawValue = percentage / 100 * (this.options.max - this.options.min);
          var shouldAdjustWithBase = true;
          if (this.options.ticks_positions.length > 0) {
            var minv,
              maxv,
              minp,
              maxp = 0;
            for (var i = 1; i < this.options.ticks_positions.length; i++) {
              if (percentage <= this.options.ticks_positions[i]) {
                minv = this.options.ticks[i - 1];
                minp = this.options.ticks_positions[i - 1];
                maxv = this.options.ticks[i];
                maxp = this.options.ticks_positions[i];

                break;
              }
            }
            var partialPercentage = (percentage - minp) / (maxp - minp);
            rawValue = minv + partialPercentage * (maxv - minv);
            shouldAdjustWithBase = false;
          }

          var adjustment = shouldAdjustWithBase ? this.options.min : 0;
          var value = adjustment + Math.round(rawValue / this.options.step) * this.options.step;
          return SliderScale.linear.getValue(value, this.options);
        },
        toPercentage: function toPercentage(value) {
          if (this.options.max === this.options.min) {
            return 0;
          }

          if (this.options.ticks_positions.length > 0) {
            var minv,
              maxv,
              minp,
              maxp = 0;
            for (var i = 0; i < this.options.ticks.length; i++) {
              if (value <= this.options.ticks[i]) {
                minv = i > 0 ? this.options.ticks[i - 1] : 0;
                minp = i > 0 ? this.options.ticks_positions[i - 1] : 0;
                maxv = this.options.ticks[i];
                maxp = this.options.ticks_positions[i];

                break;
              }
            }
            if (i > 0) {
              var partialPercentage = (value - minv) / (maxv - minv);
              return minp + partialPercentage * (maxp - minp);
            }
          }

          return 100 * (value - this.options.min) / (this.options.max - this.options.min);
        }
      },

      logarithmic: {
        /* Based on http://stackoverflow.com/questions/846221/logarithmic-slider */
        toValue: function toValue(percentage) {
          var offset = 1 - this.options.min;
          var min = Math.log(this.options.min + offset);
          var max = Math.log(this.options.max + offset);
          var value = Math.exp(min + (max - min) * percentage / 100) - offset;
          if (Math.round(value) === max) {
            return max;
          }
          value = this.options.min + Math.round((value - this.options.min) / this.options.step) * this.options.step;
          /* Rounding to the nearest step could exceed the min or
      * max, so clip to those values. */
          return SliderScale.linear.getValue(value, this.options);
        },
        toPercentage: function toPercentage(value) {
          if (this.options.max === this.options.min) {
            return 0;
          } else {
            var offset = 1 - this.options.min;
            var max = Math.log(this.options.max + offset);
            var min = Math.log(this.options.min + offset);
            var v = Math.log(value + offset);
            return 100 * (v - min) / (max - min);
          }
        }
      }
    };

    /*************************************************
              CONSTRUCTOR
    **************************************************/
    Slider = function Slider(element, options) {
      createNewSlider.call(this, element, options);
      return this;
    };

    function createNewSlider(element, options) {

      /*
      The internal state object is used to store data about the current 'state' of slider.
      This includes values such as the `value`, `enabled`, etc...
   */
      this._state = {
        value: null,
        enabled: null,
        offset: null,
        size: null,
        percentage: null,
        inDrag: false,
        over: false,
        tickIndex: null
      };

      // The objects used to store the reference to the tick methods if ticks_tooltip is on
      this.ticksCallbackMap = {};
      this.handleCallbackMap = {};

      if (typeof element === "string") {
        this.element = document.querySelector(element);
      } else if (element instanceof HTMLElement) {
        this.element = element;
      }

      /*************************************************
              Process Options
      **************************************************/
      options = options ? options : {};
      var optionTypes = Object.keys(this.defaultOptions);

      var isMinSet = options.hasOwnProperty('min');
      var isMaxSet = options.hasOwnProperty('max');

      for (var i = 0; i < optionTypes.length; i++) {
        var optName = optionTypes[i];

        // First check if an option was passed in via the constructor
        var val = options[optName];
        // If no data attrib, then check data atrributes
        val = typeof val !== 'undefined' ? val : getDataAttrib(this.element, optName);
        // Finally, if nothing was specified, use the defaults
        val = val !== null ? val : this.defaultOptions[optName];

        // Set all options on the instance of the Slider
        if (!this.options) {
          this.options = {};
        }
        this.options[optName] = val;
      }

      this.ticksAreValid = Array.isArray(this.options.ticks) && this.options.ticks.length > 0;

      // Lock to ticks only when ticks[] is defined and set
      if (!this.ticksAreValid) {
        this.options.lock_to_ticks = false;
      }

      // Check options.rtl
      if (this.options.rtl === 'auto') {
        var computedStyle = window.getComputedStyle(this.element);
        if (computedStyle != null) {
          this.options.rtl = computedStyle.direction === 'rtl';
        } else {
          // Fix for Firefox bug in versions less than 62:
          // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1467722
          this.options.rtl = this.element.style.direction === 'rtl';
        }
      }

      /*
      Validate `tooltip_position` against 'orientation`
      - if `tooltip_position` is incompatible with orientation, switch it to a default compatible with specified `orientation`
        -- default for "vertical" -> "right", "left" if rtl
        -- default for "horizontal" -> "top"
   */
      if (this.options.orientation === "vertical" && (this.options.tooltip_position === "top" || this.options.tooltip_position === "bottom")) {
        if (this.options.rtl) {
          this.options.tooltip_position = "left";
        } else {
          this.options.tooltip_position = "right";
        }
      } else if (this.options.orientation === "horizontal" && (this.options.tooltip_position === "left" || this.options.tooltip_position === "right")) {

        this.options.tooltip_position = "top";
      }

      function getDataAttrib(element, optName) {
        var dataName = "data-slider-" + optName.replace(/_/g, '-');
        var dataValString = element.getAttribute(dataName);

        try {
          return JSON.parse(dataValString);
        } catch (err) {
          return dataValString;
        }
      }

      /*************************************************
              Create Markup
      **************************************************/

      var origWidth = this.element.style.width;
      var updateSlider = false;
      var parent = this.element.parentNode;
      var sliderTrackSelection;
      var sliderTrackLow, sliderTrackHigh;
      var sliderMinHandle;
      var sliderMaxHandle;

      if (this.sliderElem) {
        updateSlider = true;
      } else {
        /* Create elements needed for slider */
        this.sliderElem = document.createElement("div");
        this.sliderElem.className = "slider";

        /* Create slider track elements */
        var sliderborder = document.createElement("div");
        sliderborder.className = "slider-border";

        var sliderTrack = document.createElement("div");
        sliderTrack.className = "slider-track";

        sliderTrackLow = document.createElement("div");
        sliderTrackLow.className = "slider-track-low";

        sliderTrackSelection = document.createElement("div");
        sliderTrackSelection.className = "slider-selection";

        sliderTrackHigh = document.createElement("div");
        sliderTrackHigh.className = "slider-track-high";

        sliderMinHandle = document.createElement("div");
        sliderMinHandle.className = "slider-handle min-slider-handle";
        sliderMinHandle.setAttribute('role', 'slider');
        sliderMinHandle.setAttribute('aria-valuemin', this.options.min);
        sliderMinHandle.setAttribute('aria-valuemax', this.options.max);

        sliderMaxHandle = document.createElement("div");
        sliderMaxHandle.className = "slider-handle max-slider-handle";
        sliderMaxHandle.setAttribute('role', 'slider');
        sliderMaxHandle.setAttribute('aria-valuemin', this.options.min);
        sliderMaxHandle.setAttribute('aria-valuemax', this.options.max);

        sliderTrack.appendChild(sliderTrackLow);
        sliderTrack.appendChild(sliderTrackSelection);
        sliderTrack.appendChild(sliderTrackHigh);

        /* Create highlight range elements */
        this.rangeHighlightElements = [];
        var rangeHighlightsOpts = this.options.rangeHighlights;
        if (Array.isArray(rangeHighlightsOpts) && rangeHighlightsOpts.length > 0) {
          for (var j = 0; j < rangeHighlightsOpts.length; j++) {
            var rangeHighlightElement = document.createElement("div");
            var customClassString = rangeHighlightsOpts[j].class || "";
            rangeHighlightElement.className = "slider-rangeHighlight slider-selection " + customClassString;
            this.rangeHighlightElements.push(rangeHighlightElement);
            sliderTrack.appendChild(rangeHighlightElement);
          }
        }

        /* Add aria-labelledby to handle's */
        var isLabelledbyArray = Array.isArray(this.options.labelledby);
        if (isLabelledbyArray && this.options.labelledby[0]) {
          sliderMinHandle.setAttribute('aria-labelledby', this.options.labelledby[0]);
        }
        if (isLabelledbyArray && this.options.labelledby[1]) {
          sliderMaxHandle.setAttribute('aria-labelledby', this.options.labelledby[1]);
        }
        if (!isLabelledbyArray && this.options.labelledby) {
          sliderMinHandle.setAttribute('aria-labelledby', this.options.labelledby);
          sliderMaxHandle.setAttribute('aria-labelledby', this.options.labelledby);
        }

        /* Create ticks */
        this.ticks = [];
        if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
          this.ticksContainer = document.createElement('div');
          this.ticksContainer.className = 'slider-tick-container';

          for (i = 0; i < this.options.ticks.length; i++) {
            var tick = document.createElement('div');
            tick.className = 'slider-tick';
            if (this.options.ticks_tooltip) {
              var tickListenerReference = this._addTickListener();
              var enterCallback = tickListenerReference.addMouseEnter(this, tick, i);
              var leaveCallback = tickListenerReference.addMouseLeave(this, tick);

              this.ticksCallbackMap[i] = {
                mouseEnter: enterCallback,
                mouseLeave: leaveCallback
              };
            }
            //store floating point value of tick in data attribute
            var min = this.options.min;
            var max = this.options.max;
            var range = max - min;
            var tick_value = min + range * i / (this.options.ticks.length - 1);
            tick.setAttribute('data-tick-value', tick_value);
            this.ticks.push(tick);
            this.ticksContainer.appendChild(tick);
          }

          sliderTrackSelection.className += " tick-slider-selection";
        }

        this.tickLabels = [];
        if (Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0) {
          this.tickLabelContainer = document.createElement('div');
          this.tickLabelContainer.className = 'slider-tick-label-container';

          for (i = 0; i < this.options.ticks_labels.length; i++) {
            var label = document.createElement('div');
            var noTickPositionsSpecified = this.options.ticks_positions.length === 0;
            var tickLabelsIndex = this.options.reversed && noTickPositionsSpecified ? this.options.ticks_labels.length - (i + 1) : i;
            label.className = 'slider-tick-label';
            label.innerHTML = this.options.ticks_labels[tickLabelsIndex];

            this.tickLabels.push(label);
            this.tickLabelContainer.appendChild(label);
          }
        }

        var createAndAppendTooltipSubElements = function createAndAppendTooltipSubElements(tooltipElem) {
          var arrow = document.createElement("div");
          arrow.className = "arrow";

          var inner = document.createElement("div");
          inner.className = "tooltip-inner";

          tooltipElem.appendChild(arrow);
          tooltipElem.appendChild(inner);
        };

        /* Create tooltip elements */
        var sliderTooltip = document.createElement("div");
        sliderTooltip.className = "tooltip tooltip-main";
        sliderTooltip.setAttribute('role', 'presentation');
        createAndAppendTooltipSubElements(sliderTooltip);

        var sliderTooltipMin = document.createElement("div");
        sliderTooltipMin.className = "tooltip tooltip-min";
        sliderTooltipMin.setAttribute('role', 'presentation');
        createAndAppendTooltipSubElements(sliderTooltipMin);

        var sliderTooltipMax = document.createElement("div");
        sliderTooltipMax.className = "tooltip tooltip-max";
        sliderTooltipMax.setAttribute('role', 'presentation');
        createAndAppendTooltipSubElements(sliderTooltipMax);

        /* Append components to sliderElem */
        this.sliderElem.appendChild(sliderborder);
        this.sliderElem.appendChild(sliderTrack);
        this.sliderElem.appendChild(sliderTooltip);
        this.sliderElem.appendChild(sliderTooltipMin);
        this.sliderElem.appendChild(sliderTooltipMax);

        if (this.tickLabelContainer) {
          this.sliderElem.appendChild(this.tickLabelContainer);
        }
        if (this.ticksContainer) {
          this.sliderElem.appendChild(this.ticksContainer);
        }

        this.sliderElem.appendChild(sliderMinHandle);
        this.sliderElem.appendChild(sliderMaxHandle);

        /* Append slider element to parent container, right before the original <input> element */
        parent.insertBefore(this.sliderElem, this.element);

        /* Hide original <input> element */
        this.element.style.display = "none";
      }
      /* If JQuery exists, cache JQ references */
      if ($) {
        this.$element = $(this.element);
        this.$sliderElem = $(this.sliderElem);
      }

      /*************************************************
                Setup
      **************************************************/
      this.eventToCallbackMap = {};
      this.sliderElem.id = this.options.id;


      this.touchCapable = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;

      this.touchX = 0;
      this.touchY = 0;

      this.tooltip = this.sliderElem.querySelector('.tooltip-main');
      this.tooltipInner = this.tooltip.querySelector('.tooltip-inner');

      this.tooltip_min = this.sliderElem.querySelector('.tooltip-min');
      this.tooltipInner_min = this.tooltip_min.querySelector('.tooltip-inner');

      this.tooltip_max = this.sliderElem.querySelector('.tooltip-max');
      this.tooltipInner_max = this.tooltip_max.querySelector('.tooltip-inner');

      if (SliderScale[this.options.scale]) {
        this.options.scale = SliderScale[this.options.scale];
      }

      if (updateSlider === true) {
        // Reset classes
        this._removeClass(this.sliderElem, 'slider-horizontal');
        this._removeClass(this.sliderElem, 'slider-vertical');
        this._removeClass(this.sliderElem, 'slider-rtl');
        this._removeClass(this.tooltip, 'hide');
        this._removeClass(this.tooltip_min, 'hide');
        this._removeClass(this.tooltip_max, 'hide');

        // Undo existing inline styles for track
        ["left", "right", "top", "width", "height"].forEach(function (prop) {
          this._removeProperty(this.trackLow, prop);
          this._removeProperty(this.trackSelection, prop);
          this._removeProperty(this.trackHigh, prop);
        }, this);

        // Undo inline styles on handles
        [this.handle1, this.handle2].forEach(function (handle) {
          this._removeProperty(handle, 'left');
          this._removeProperty(handle, 'right');
          this._removeProperty(handle, 'top');
        }, this);

        // Undo inline styles and classes on tooltips
        [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function (tooltip) {
          this._removeProperty(tooltip, 'bs-tooltip-left');
          this._removeProperty(tooltip, 'bs-tooltip-right');
          this._removeProperty(tooltip, 'bs-tooltip-top');

          this._removeClass(tooltip, 'bs-tooltip-right');
          this._removeClass(tooltip, 'bs-tooltip-left');
          this._removeClass(tooltip, 'bs-tooltip-top');
        }, this);
      }

      if (this.options.orientation === 'vertical') {
        this._addClass(this.sliderElem, 'slider-vertical');
        this.stylePos = 'top';
        this.mousePos = 'pageY';
        this.sizePos = 'offsetHeight';
      } else {
        this._addClass(this.sliderElem, 'slider-horizontal');
        this.sliderElem.style.width = origWidth;
        this.options.orientation = 'horizontal';
        if (this.options.rtl) {
          this.stylePos = 'right';
        } else {
          this.stylePos = 'left';
        }
        this.mousePos = 'clientX';
        this.sizePos = 'offsetWidth';
      }
      // specific rtl class
      if (this.options.rtl) {
        this._addClass(this.sliderElem, 'slider-rtl');
      }
      this._setTooltipPosition();
      /* In case ticks are specified, overwrite the min and max bounds */
      if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
        if (!isMaxSet) {
          this.options.max = Math.max.apply(Math, this.options.ticks);
        }
        if (!isMinSet) {
          this.options.min = Math.min.apply(Math, this.options.ticks);
        }
      }

      if (Array.isArray(this.options.value)) {
        this.options.range = true;
        this._state.value = this.options.value;
      } else if (this.options.range) {
        // User wants a range, but value is not an array
        this._state.value = [this.options.value, this.options.max];
      } else {
        this._state.value = this.options.value;
      }

      this.trackLow = sliderTrackLow || this.trackLow;
      this.trackSelection = sliderTrackSelection || this.trackSelection;
      this.trackHigh = sliderTrackHigh || this.trackHigh;

      if (this.options.selection === 'none') {
        this._addClass(this.trackLow, 'hide');
        this._addClass(this.trackSelection, 'hide');
        this._addClass(this.trackHigh, 'hide');
      } else if (this.options.selection === 'after' || this.options.selection === 'before') {
        this._removeClass(this.trackLow, 'hide');
        this._removeClass(this.trackSelection, 'hide');
        this._removeClass(this.trackHigh, 'hide');
      }

      this.handle1 = sliderMinHandle || this.handle1;
      this.handle2 = sliderMaxHandle || this.handle2;

      if (updateSlider === true) {
        // Reset classes
        this._removeClass(this.handle1, 'round triangle');
        this._removeClass(this.handle2, 'round triangle hide');

        for (i = 0; i < this.ticks.length; i++) {
          this._removeClass(this.ticks[i], 'round triangle hide');
        }
      }

      var availableHandleModifiers = ['round', 'triangle', 'custom'];
      var isValidHandleType = availableHandleModifiers.indexOf(this.options.handle) !== -1;
      if (isValidHandleType) {
        this._addClass(this.handle1, this.options.handle);
        this._addClass(this.handle2, this.options.handle);

        for (i = 0; i < this.ticks.length; i++) {
          this._addClass(this.ticks[i], this.options.handle);
        }
      }

      this._state.offset = this._offset(this.sliderElem);
      this._state.size = this.sliderElem[this.sizePos];
      this.setValue(this._state.value);

      /******************************************
            Bind Event Listeners
      ******************************************/

      // Bind keyboard handlers
      this.handle1Keydown = this._keydown.bind(this, 0);
      this.handle1.addEventListener("keydown", this.handle1Keydown, false);

      this.handle2Keydown = this._keydown.bind(this, 1);
      this.handle2.addEventListener("keydown", this.handle2Keydown, false);

      this.mousedown = this._mousedown.bind(this);
      this.touchstart = this._touchstart.bind(this);
      this.touchmove = this._touchmove.bind(this);

      if (this.touchCapable) {
        this.sliderElem.addEventListener("touchstart", this.touchstart, false);
        this.sliderElem.addEventListener("touchmove", this.touchmove, false);
      }

      this.sliderElem.addEventListener("mousedown", this.mousedown, false);

      // Bind window handlers
      this.resize = this._resize.bind(this);
      window.addEventListener("resize", this.resize, false);

      // Bind tooltip-related handlers
      if (this.options.tooltip === 'hide') {
        this._addClass(this.tooltip, 'hide');
        this._addClass(this.tooltip_min, 'hide');
        this._addClass(this.tooltip_max, 'hide');
      } else if (this.options.tooltip === 'always') {
        this._showTooltip();
        this._alwaysShowTooltip = true;
      } else {
        this.showTooltip = this._showTooltip.bind(this);
        this.hideTooltip = this._hideTooltip.bind(this);

        if (this.options.ticks_tooltip) {
          var callbackHandle = this._addTickListener();
          //create handle1 listeners and store references in map
          var mouseEnter = callbackHandle.addMouseEnter(this, this.handle1);
          var mouseLeave = callbackHandle.addMouseLeave(this, this.handle1);
          this.handleCallbackMap.handle1 = {
            mouseEnter: mouseEnter,
            mouseLeave: mouseLeave
          };
          //create handle2 listeners and store references in map
          mouseEnter = callbackHandle.addMouseEnter(this, this.handle2);
          mouseLeave = callbackHandle.addMouseLeave(this, this.handle2);
          this.handleCallbackMap.handle2 = {
            mouseEnter: mouseEnter,
            mouseLeave: mouseLeave
          };
        } else {
          // this.sliderElem.addEventListener("mouseenter", this.showTooltip, false);
          // this.sliderElem.addEventListener("mouseleave", this.hideTooltip, false);

          if (this.touchCapable) {
            this.sliderElem.addEventListener("touchstart", this.showTooltip, false);
            this.sliderElem.addEventListener("touchmove", this.showTooltip, false);
            this.sliderElem.addEventListener("touchend", this.hideTooltip, false);
          }
        }

        this.handle1.addEventListener("focus", this.showTooltip, false);
        this.handle1.addEventListener("blur", this.hideTooltip, false);

        this.handle2.addEventListener("focus", this.showTooltip, false);
        this.handle2.addEventListener("blur", this.hideTooltip, false);

        if (this.touchCapable) {
          this.handle1.addEventListener("touchstart", this.showTooltip, false);
          this.handle1.addEventListener("touchmove", this.showTooltip, false);
          this.handle1.addEventListener("touchend", this.hideTooltip, false);

          this.handle2.addEventListener("touchstart", this.showTooltip, false);
          this.handle2.addEventListener("touchmove", this.showTooltip, false);
          this.handle2.addEventListener("touchend", this.hideTooltip, false);
        }
      }

      if (this.options.enabled) {
        this.enable();
      } else {
        this.disable();
      }
    }

    /*************************************************
          INSTANCE PROPERTIES/METHODS
    - Any methods bound to the prototype are considered
  part of the plugin's `public` interface
    **************************************************/
    Slider.prototype = {
      _init: function _init() { }, // NOTE: Must exist to support bridget

      constructor: Slider,

      defaultOptions: {
        id: "",
        min: 0,
        max: 10,
        step: 1,
        precision: 0,
        orientation: 'horizontal',
        value: 5,
        range: false,
        selection: 'before',
        tooltip: 'show',
        tooltip_split: false,
        lock_to_ticks: false,
        handle: 'round',
        reversed: false,
        rtl: 'auto',
        enabled: true,
        formatter: function formatter(val) {
          if (Array.isArray(val)) {
            return val[0] + " : " + val[1];
          } else {
            return val;
          }
        },
        natural_arrow_keys: false,
        ticks: [],
        ticks_positions: [],
        ticks_labels: [],
        ticks_snap_bounds: 0,
        ticks_tooltip: false,
        scale: 'linear',
        focus: false,
        tooltip_position: null,
        labelledby: null,
        rangeHighlights: []
      },

      getElement: function getElement() {
        return this.sliderElem;
      },

      getValue: function getValue() {
        if (this.options.range) {
          return this._state.value;
        } else {
          return this._state.value[0];
        }
      },

      setValue: function setValue(val, triggerSlideEvent, triggerChangeEvent) {
        if (!val) {
          val = 0;
        }
        var oldValue = this.getValue();
        this._state.value = this._validateInputValue(val);
        var applyPrecision = this._applyPrecision.bind(this);

        if (this.options.range) {
          this._state.value[0] = applyPrecision(this._state.value[0]);
          this._state.value[1] = applyPrecision(this._state.value[1]);

          if (this.ticksAreValid && this.options.lock_to_ticks) {
            this._state.value[0] = this.options.ticks[this._getClosestTickIndex(this._state.value[0])];
            this._state.value[1] = this.options.ticks[this._getClosestTickIndex(this._state.value[1])];
          }

          this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0]));
          this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]));
        } else {
          this._state.value = applyPrecision(this._state.value);

          if (this.ticksAreValid && this.options.lock_to_ticks) {
            this._state.value = this.options.ticks[this._getClosestTickIndex(this._state.value)];
          }

          this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))];
          this._addClass(this.handle2, 'hide');
          if (this.options.selection === 'after') {
            this._state.value[1] = this.options.max;
          } else {
            this._state.value[1] = this.options.min;
          }
        }

        // Determine which ticks the handle(s) are set at (if applicable)
        this._setTickIndex();

        if (this.options.max > this.options.min) {
          this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), this.options.step * 100 / (this.options.max - this.options.min)];
        } else {
          this._state.percentage = [0, 0, 100];
        }

        this._layout();
        var newValue = this.options.range ? this._state.value : this._state.value[0];

        this._setDataVal(newValue);
        if (triggerSlideEvent === true) {
          this._trigger('slide', newValue);
        }

        var hasChanged = false;
        if (Array.isArray(newValue)) {
          hasChanged = oldValue[0] !== newValue[0] || oldValue[1] !== newValue[1];
        } else {
          hasChanged = oldValue !== newValue;
        }

        if (hasChanged && triggerChangeEvent === true) {
          this._trigger('change', {
            oldValue: oldValue,
            newValue: newValue
          });
        }

        return this;
      },

      destroy: function destroy() {
        // Remove event handlers on slider elements
        this._removeSliderEventHandlers();

        // Remove the slider from the DOM
        this.sliderElem.parentNode.removeChild(this.sliderElem);
        /* Show original <input> element */
        this.element.style.display = "";

        // Clear out custom event bindings
        this._cleanUpEventCallbacksMap();

        // Remove data values
        this.element.removeAttribute("data");

        // Remove JQuery handlers/data
        if ($) {
          this._unbindJQueryEventHandlers();
          if (autoRegisterNamespace === NAMESPACE_MAIN) {
            this.$element.removeData(autoRegisterNamespace);
          }
          this.$element.removeData(NAMESPACE_ALTERNATE);
        }
      },

      disable: function disable() {
        this._state.enabled = false;
        this.handle1.removeAttribute("tabindex");
        this.handle2.removeAttribute("tabindex");
        this._addClass(this.sliderElem, 'slider-disabled');
        this._trigger('slideDisabled');

        return this;
      },

      enable: function enable() {
        this._state.enabled = true;
        this.handle1.setAttribute("tabindex", 0);
        this.handle2.setAttribute("tabindex", 0);
        this._removeClass(this.sliderElem, 'slider-disabled');
        this._trigger('slideEnabled');

        return this;
      },

      toggle: function toggle() {
        if (this._state.enabled) {
          this.disable();
        } else {
          this.enable();
        }
        return this;
      },

      isEnabled: function isEnabled() {
        return this._state.enabled;
      },

      on: function on(evt, callback) {
        this._bindNonQueryEventHandler(evt, callback);
        return this;
      },

      off: function off(evt, callback) {
        if ($) {
          this.$element.off(evt, callback);
          this.$sliderElem.off(evt, callback);
        } else {
          this._unbindNonQueryEventHandler(evt, callback);
        }
      },

      getAttribute: function getAttribute(attribute) {
        if (attribute) {
          return this.options[attribute];
        } else {
          return this.options;
        }
      },

      setAttribute: function setAttribute(attribute, value) {
        this.options[attribute] = value;
        return this;
      },

      refresh: function refresh(options) {
        var currentValue = this.getValue();
        this._removeSliderEventHandlers();
        createNewSlider.call(this, this.element, this.options);
        // Don't reset slider's value on refresh if `useCurrentValue` is true
        if (options && options.useCurrentValue === true) {
          this.setValue(currentValue);
        }
        if ($) {
          // Bind new instance of slider to the element
          if (autoRegisterNamespace === NAMESPACE_MAIN) {
            $.data(this.element, NAMESPACE_MAIN, this);
            $.data(this.element, NAMESPACE_ALTERNATE, this);
          } else {
            $.data(this.element, NAMESPACE_ALTERNATE, this);
          }
        }
        return this;
      },

      relayout: function relayout() {
        this._resize();
        return this;
      },

      /******************************+
            HELPERS
      - Any method that is not part of the public interface.
   - Place it underneath this comment block and write its signature like so:
        _fnName : function() {...}
      ********************************/
      _removeTooltipListener: function _removeTooltipListener(event, handler) {
        this.handle1.removeEventListener(event, handler, false);
        this.handle2.removeEventListener(event, handler, false);
      },
      _removeSliderEventHandlers: function _removeSliderEventHandlers() {
        // Remove keydown event listeners
        this.handle1.removeEventListener("keydown", this.handle1Keydown, false);
        this.handle2.removeEventListener("keydown", this.handle2Keydown, false);

        //remove the listeners from the ticks and handles if they had their own listeners
        if (this.options.ticks_tooltip) {
          var ticks = this.ticksContainer.getElementsByClassName('slider-tick');
          for (var i = 0; i < ticks.length; i++) {
            ticks[i].removeEventListener('mouseenter', this.ticksCallbackMap[i].mouseEnter, false);
            ticks[i].removeEventListener('mouseleave', this.ticksCallbackMap[i].mouseLeave, false);
          }
          if (this.handleCallbackMap.handle1 && this.handleCallbackMap.handle2) {
            this.handle1.removeEventListener('mouseenter', this.handleCallbackMap.handle1.mouseEnter, false);
            this.handle2.removeEventListener('mouseenter', this.handleCallbackMap.handle2.mouseEnter, false);
            this.handle1.removeEventListener('mouseleave', this.handleCallbackMap.handle1.mouseLeave, false);
            this.handle2.removeEventListener('mouseleave', this.handleCallbackMap.handle2.mouseLeave, false);
          }
        }

        this.handleCallbackMap = null;
        this.ticksCallbackMap = null;

        if (this.showTooltip) {
          this._removeTooltipListener("focus", this.showTooltip);
        }
        if (this.hideTooltip) {
          this._removeTooltipListener("blur", this.hideTooltip);
        }

        // Remove event listeners from sliderElem
        if (this.showTooltip) {
          this.sliderElem.removeEventListener("mouseenter", this.showTooltip, false);
        }
        if (this.hideTooltip) {
          this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, false);
        }

        this.sliderElem.removeEventListener("mousedown", this.mousedown, false);

        if (this.touchCapable) {
          // Remove touch event listeners from handles
          if (this.showTooltip) {
            this.handle1.removeEventListener("touchstart", this.showTooltip, false);
            this.handle1.removeEventListener("touchmove", this.showTooltip, false);
            this.handle2.removeEventListener("touchstart", this.showTooltip, false);
            this.handle2.removeEventListener("touchmove", this.showTooltip, false);
          }
          if (this.hideTooltip) {
            this.handle1.removeEventListener("touchend", this.hideTooltip, false);
            this.handle2.removeEventListener("touchend", this.hideTooltip, false);
          }

          // Remove event listeners from sliderElem
          if (this.showTooltip) {
            this.sliderElem.removeEventListener("touchstart", this.showTooltip, false);
            this.sliderElem.removeEventListener("touchmove", this.showTooltip, false);
          }
          if (this.hideTooltip) {
            this.sliderElem.removeEventListener("touchend", this.hideTooltip, false);
          }

          this.sliderElem.removeEventListener("touchstart", this.touchstart, false);
          this.sliderElem.removeEventListener("touchmove", this.touchmove, false);
        }

        // Remove window event listener
        window.removeEventListener("resize", this.resize, false);
      },
      _bindNonQueryEventHandler: function _bindNonQueryEventHandler(evt, callback) {
        if (this.eventToCallbackMap[evt] === undefined) {
          this.eventToCallbackMap[evt] = [];
        }
        this.eventToCallbackMap[evt].push(callback);
      },
      _unbindNonQueryEventHandler: function _unbindNonQueryEventHandler(evt, callback) {
        var callbacks = this.eventToCallbackMap[evt];
        if (callbacks !== undefined) {
          for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i] === callback) {
              callbacks.splice(i, 1);
              break;
            }
          }
        }
      },
      _cleanUpEventCallbacksMap: function _cleanUpEventCallbacksMap() {
        var eventNames = Object.keys(this.eventToCallbackMap);
        for (var i = 0; i < eventNames.length; i++) {
          var eventName = eventNames[i];
          delete this.eventToCallbackMap[eventName];
        }
      },
      _showTooltip: function _showTooltip() {
        if (this.options.tooltip_split === false) {
          this._addClass(this.tooltip, 'show');
          this.tooltip_min.style.display = 'none';
          this.tooltip_max.style.display = 'none';
        } else {
          this._addClass(this.tooltip_min, 'show');
          this._addClass(this.tooltip_max, 'show');
          this.tooltip.style.display = 'none';
        }
        this._state.over = true;
      },
      _hideTooltip: function _hideTooltip() {
        if (this._state.inDrag === false && this._alwaysShowTooltip !== true) {
          this._removeClass(this.tooltip, 'show');
          this._removeClass(this.tooltip_min, 'show');
          this._removeClass(this.tooltip_max, 'show');
        }
        this._state.over = false;
      },
      _setToolTipOnMouseOver: function _setToolTipOnMouseOver(tempState) {
        var self = this;
        var formattedTooltipVal = this.options.formatter(!tempState ? this._state.value[0] : tempState.value[0]);
        var positionPercentages = !tempState ? getPositionPercentages(this._state, this.options.reversed) : getPositionPercentages(tempState, this.options.reversed);
        this._setText(this.tooltipInner, formattedTooltipVal);

        this.tooltip.style[this.stylePos] = positionPercentages[0] + "%";

        function getPositionPercentages(state, reversed) {
          if (reversed) {
            return [100 - state.percentage[0], self.options.range ? 100 - state.percentage[1] : state.percentage[1]];
          }
          return [state.percentage[0], state.percentage[1]];
        }
      },
      _copyState: function _copyState() {
        return {
          value: [this._state.value[0], this._state.value[1]],
          enabled: this._state.enabled,
          offset: this._state.offset,
          size: this._state.size,
          percentage: [this._state.percentage[0], this._state.percentage[1], this._state.percentage[2]],
          inDrag: this._state.inDrag,
          over: this._state.over,
          // deleted or null'd keys
          dragged: this._state.dragged,
          keyCtrl: this._state.keyCtrl
        };
      },
      _addTickListener: function _addTickListener() {
        return {
          addMouseEnter: function addMouseEnter(reference, element, index) {
            var enter = function enter() {
              var tempState = reference._copyState();
              // Which handle is being hovered over?
              var val = element === reference.handle1 ? tempState.value[0] : tempState.value[1];
              var per = void 0;

              // Setup value and percentage for tick's 'mouseenter'
              if (index !== undefined) {
                val = reference.options.ticks[index];
                per = reference.options.ticks_positions.length > 0 && reference.options.ticks_positions[index] || reference._toPercentage(reference.options.ticks[index]);
              } else {
                per = reference._toPercentage(val);
              }

              tempState.value[0] = val;
              tempState.percentage[0] = per;
              reference._setToolTipOnMouseOver(tempState);
              reference._showTooltip();
            };
            element.addEventListener("mouseenter", enter, false);
            return enter;
          },
          addMouseLeave: function addMouseLeave(reference, element) {
            var leave = function leave() {
              reference._hideTooltip();
            };
            element.addEventListener("mouseleave", leave, false);
            return leave;
          }
        };
      },
      _layout: function _layout() {
        var positionPercentages;
        var formattedValue;

        if (this.options.reversed) {
          positionPercentages = [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]];
        } else {
          positionPercentages = [this._state.percentage[0], this._state.percentage[1]];
        }

        this.handle1.style[this.stylePos] = positionPercentages[0] + "%";
        this.handle1.setAttribute('aria-valuenow', this._state.value[0]);
        formattedValue = this.options.formatter(this._state.value[0]);
        if (isNaN(formattedValue)) {
          this.handle1.setAttribute('aria-valuetext', formattedValue);
        } else {
          this.handle1.removeAttribute('aria-valuetext');
        }

        this.handle2.style[this.stylePos] = positionPercentages[1] + "%";
        this.handle2.setAttribute('aria-valuenow', this._state.value[1]);
        formattedValue = this.options.formatter(this._state.value[1]);
        if (isNaN(formattedValue)) {
          this.handle2.setAttribute('aria-valuetext', formattedValue);
        } else {
          this.handle2.removeAttribute('aria-valuetext');
        }

        /* Position highlight range elements */
        if (this.rangeHighlightElements.length > 0 && Array.isArray(this.options.rangeHighlights) && this.options.rangeHighlights.length > 0) {
          for (var _i = 0; _i < this.options.rangeHighlights.length; _i++) {
            var startPercent = this._toPercentage(this.options.rangeHighlights[_i].start);
            var endPercent = this._toPercentage(this.options.rangeHighlights[_i].end);

            if (this.options.reversed) {
              var sp = 100 - endPercent;
              endPercent = 100 - startPercent;
              startPercent = sp;
            }

            var currentRange = this._createHighlightRange(startPercent, endPercent);

            if (currentRange) {
              if (this.options.orientation === 'vertical') {
                this.rangeHighlightElements[_i].style.top = currentRange.start + "%";
                this.rangeHighlightElements[_i].style.height = currentRange.size + "%";
              } else {
                if (this.options.rtl) {
                  this.rangeHighlightElements[_i].style.right = currentRange.start + "%";
                } else {
                  this.rangeHighlightElements[_i].style.left = currentRange.start + "%";
                }
                this.rangeHighlightElements[_i].style.width = currentRange.size + "%";
              }
            } else {
              this.rangeHighlightElements[_i].style.display = "none";
            }
          }
        }

        /* Position ticks and labels */
        if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {

          var styleSize = this.options.orientation === 'vertical' ? 'height' : 'width';
          var styleMargin;
          if (this.options.orientation === 'vertical') {
            styleMargin = 'marginTop';
          } else {
            if (this.options.rtl) {
              styleMargin = 'marginRight';
            } else {
              styleMargin = 'marginLeft';
            }
          }
          var labelSize = this._state.size / (this.options.ticks.length - 1);

          if (this.tickLabelContainer) {
            var extraMargin = 0;
            if (this.options.ticks_positions.length === 0) {
              if (this.options.orientation !== 'vertical') {
                this.tickLabelContainer.style[styleMargin] = -labelSize / 2 + "px";
              }

              extraMargin = this.tickLabelContainer.offsetHeight;
            } else {
              /* Chidren are position absolute, calculate height by finding the max offsetHeight of a child */
              for (i = 0; i < this.tickLabelContainer.childNodes.length; i++) {
                if (this.tickLabelContainer.childNodes[i].offsetHeight > extraMargin) {
                  extraMargin = this.tickLabelContainer.childNodes[i].offsetHeight;
                }
              }
            }
            if (this.options.orientation === 'horizontal') {
              this.sliderElem.style.marginBottom = extraMargin + "px";
            }
          }
          for (var i = 0; i < this.options.ticks.length; i++) {

            var percentage = this.options.ticks_positions[i] || this._toPercentage(this.options.ticks[i]);

            if (this.options.reversed) {
              percentage = 100 - percentage;
            }

            this.ticks[i].style[this.stylePos] = percentage + "%";

            /* Set class labels to denote whether ticks are in the selection */
            this._removeClass(this.ticks[i], 'in-selection');
            if (!this.options.range) {
              if (this.options.selection === 'after' && percentage >= positionPercentages[0]) {
                this._addClass(this.ticks[i], 'in-selection');
              } else if (this.options.selection === 'before' && percentage <= positionPercentages[0]) {
                this._addClass(this.ticks[i], 'in-selection');
              }
            } else if (percentage >= positionPercentages[0] && percentage <= positionPercentages[1]) {
              this._addClass(this.ticks[i], 'in-selection');
            }

            if (this.tickLabels[i]) {
              this.tickLabels[i].style[styleSize] = labelSize + "px";

              if (this.options.orientation !== 'vertical' && this.options.ticks_positions[i] !== undefined) {
                this.tickLabels[i].style.position = 'absolute';
                this.tickLabels[i].style[this.stylePos] = percentage + "%";
                this.tickLabels[i].style[styleMargin] = -labelSize / 2 + 'px';
              } else if (this.options.orientation === 'vertical') {
                if (this.options.rtl) {
                  this.tickLabels[i].style['marginRight'] = this.sliderElem.offsetWidth + "px";
                } else {
                  this.tickLabels[i].style['marginLeft'] = this.sliderElem.offsetWidth + "px";
                }
                this.tickLabelContainer.style[styleMargin] = this.sliderElem.offsetWidth / 2 * -1 + 'px';
              }

              /* Set class labels to indicate tick labels are in the selection or selected */
              this._removeClass(this.tickLabels[i], 'label-in-selection label-is-selection');
              if (!this.options.range) {
                if (this.options.selection === 'after' && percentage >= positionPercentages[0]) {
                  this._addClass(this.tickLabels[i], 'label-in-selection');
                } else if (this.options.selection === 'before' && percentage <= positionPercentages[0]) {
                  this._addClass(this.tickLabels[i], 'label-in-selection');
                }
                if (percentage === positionPercentages[0]) {
                  this._addClass(this.tickLabels[i], 'label-is-selection');
                }
              } else if (percentage >= positionPercentages[0] && percentage <= positionPercentages[1]) {
                this._addClass(this.tickLabels[i], 'label-in-selection');
                if (percentage === positionPercentages[0] || positionPercentages[1]) {
                  this._addClass(this.tickLabels[i], 'label-is-selection');
                }
              }
            }
          }
        }

        var formattedTooltipVal;

        if (this.options.range) {
          formattedTooltipVal = this.options.formatter(this._state.value);
          this._setText(this.tooltipInner, formattedTooltipVal);
          this.tooltip.style[this.stylePos] = (positionPercentages[1] + positionPercentages[0]) / 2 + "%";

          var innerTooltipMinText = this.options.formatter(this._state.value[0]);
          this._setText(this.tooltipInner_min, innerTooltipMinText);

          var innerTooltipMaxText = this.options.formatter(this._state.value[1]);
          this._setText(this.tooltipInner_max, innerTooltipMaxText);

          this.tooltip_min.style[this.stylePos] = positionPercentages[0] + "%";

          this.tooltip_max.style[this.stylePos] = positionPercentages[1] + "%";
        } else {
          formattedTooltipVal = this.options.formatter(this._state.value[0]);
          this._setText(this.tooltipInner, formattedTooltipVal);

          this.tooltip.style[this.stylePos] = positionPercentages[0] + "%";
        }

        if (this.options.orientation === 'vertical') {
          this.trackLow.style.top = '0';
          this.trackLow.style.height = Math.min(positionPercentages[0], positionPercentages[1]) + '%';

          this.trackSelection.style.top = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
          this.trackSelection.style.height = Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

          this.trackHigh.style.bottom = '0';
          this.trackHigh.style.height = 100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';
        } else {
          if (this.stylePos === 'right') {
            this.trackLow.style.right = '0';
          } else {
            this.trackLow.style.left = '0';
          }
          this.trackLow.style.width = Math.min(positionPercentages[0], positionPercentages[1]) + '%';

          if (this.stylePos === 'right') {
            this.trackSelection.style.right = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
          } else {
            this.trackSelection.style.left = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
          }
          this.trackSelection.style.width = Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

          if (this.stylePos === 'right') {
            this.trackHigh.style.left = '0';
          } else {
            this.trackHigh.style.right = '0';
          }
          this.trackHigh.style.width = 100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

          var offset_min = this.tooltip_min.getBoundingClientRect();
          var offset_max = this.tooltip_max.getBoundingClientRect();

          if (this.options.tooltip_position === 'bottom') {
            if (offset_min.right > offset_max.left) {
              this._removeClass(this.tooltip_max, 'bs-tooltip-bottom');
              this._addClass(this.tooltip_max, 'bs-tooltip-top');
              this.tooltip_max.style.top = '';
              this.tooltip_max.style.bottom = 22 + 'px';
            } else {
              this._removeClass(this.tooltip_max, 'bs-tooltip-top');
              this._addClass(this.tooltip_max, 'bs-tooltip-bottom');
              this.tooltip_max.style.top = this.tooltip_min.style.top;
              this.tooltip_max.style.bottom = '';
            }
          } else {
            if (offset_min.right > offset_max.left) {
              this._removeClass(this.tooltip_max, 'bs-tooltip-top');
              this._addClass(this.tooltip_max, 'bs-tooltip-bottom');
              this.tooltip_max.style.top = 18 + 'px';
            } else {
              this._removeClass(this.tooltip_max, 'bs-tooltip-bottom');
              this._addClass(this.tooltip_max, 'bs-tooltip-top');
              this.tooltip_max.style.top = this.tooltip_min.style.top;
            }
          }
        }
      },
      _createHighlightRange: function _createHighlightRange(start, end) {
        if (this._isHighlightRange(start, end)) {
          if (start > end) {
            return { 'start': end, 'size': start - end };
          }
          return { 'start': start, 'size': end - start };
        }
        return null;
      },
      _isHighlightRange: function _isHighlightRange(start, end) {
        if (0 <= start && start <= 100 && 0 <= end && end <= 100) {
          return true;
        } else {
          return false;
        }
      },
      _resize: function _resize(ev) {
        /*jshint unused:false*/
        this._state.offset = this._offset(this.sliderElem);
        this._state.size = this.sliderElem[this.sizePos];
        this._layout();
      },
      _removeProperty: function _removeProperty(element, prop) {
        if (element.style.removeProperty) {
          element.style.removeProperty(prop);
        } else {
          element.style.removeAttribute(prop);
        }
      },
      _mousedown: function _mousedown(ev) {
        if (!this._state.enabled) {
          return false;
        }

        if (ev.preventDefault) {
          ev.preventDefault();
        }

        this._state.offset = this._offset(this.sliderElem);
        this._state.size = this.sliderElem[this.sizePos];

        var percentage = this._getPercentage(ev);

        if (this.options.range) {
          var diff1 = Math.abs(this._state.percentage[0] - percentage);
          var diff2 = Math.abs(this._state.percentage[1] - percentage);
          this._state.dragged = diff1 < diff2 ? 0 : 1;
          this._adjustPercentageForRangeSliders(percentage);
        } else {
          this._state.dragged = 0;
        }

        this._state.percentage[this._state.dragged] = percentage;

        if (this.touchCapable) {
          document.removeEventListener("touchmove", this.mousemove, false);
          document.removeEventListener("touchend", this.mouseup, false);
        }

        if (this.mousemove) {
          document.removeEventListener("mousemove", this.mousemove, false);
        }
        if (this.mouseup) {
          document.removeEventListener("mouseup", this.mouseup, false);
        }

        this.mousemove = this._mousemove.bind(this);
        this.mouseup = this._mouseup.bind(this);

        if (this.touchCapable) {
          // Touch: Bind touch events:
          document.addEventListener("touchmove", this.mousemove, false);
          document.addEventListener("touchend", this.mouseup, false);
        }
        // Bind mouse events:
        document.addEventListener("mousemove", this.mousemove, false);
        document.addEventListener("mouseup", this.mouseup, false);

        this._state.inDrag = true;
        //show tooltip
        this.showTooltip();
        var newValue = this._calculateValue(true);

        this._trigger('slideStart', newValue);

        //if target has class slider-tick, set newValue to data-tick-value
        if (ev.target.classList.contains('slider-tick')) {
          newValue = parseFloat(ev.target.getAttribute('data-tick-value'));
        }
        this.setValue(newValue, false, true);

        ev.returnValue = false;

        if (this.options.focus) {
          this._triggerFocusOnHandle(this._state.dragged);
        }

        return true;
      },
      _touchstart: function _touchstart(ev) {
        this._mousedown(ev);
      },
      _triggerFocusOnHandle: function _triggerFocusOnHandle(handleIdx) {
        if (handleIdx === 0) {
          this.handle1.focus();
        }
        if (handleIdx === 1) {
          this.handle2.focus();
        }
      },
      _keydown: function _keydown(handleIdx, ev) {
        if (!this._state.enabled) {
          return false;
        }

        var dir;
        switch (ev.keyCode) {
          case 37: // left
          case 40:
            // down
            dir = -1;
            break;
          case 39: // right
          case 38:
            // up
            dir = 1;
            break;
        }
        if (!dir) {
          return;
        }

        // use natural arrow keys instead of from min to max
        if (this.options.natural_arrow_keys) {
          var isHorizontal = this.options.orientation === 'horizontal';
          var isVertical = this.options.orientation === 'vertical';
          var isRTL = this.options.rtl;
          var isReversed = this.options.reversed;

          if (isHorizontal) {
            if (isRTL) {
              if (!isReversed) {
                dir = -dir;
              }
            } else {
              if (isReversed) {
                dir = -dir;
              }
            }
          } else if (isVertical) {
            if (!isReversed) {
              dir = -dir;
            }
          }
        }

        var val;
        if (this.ticksAreValid && this.options.lock_to_ticks) {
          var index = void 0;
          // Find tick index that handle 1/2 is currently on
          index = this.options.ticks.indexOf(this._state.value[handleIdx]);
          if (index === -1) {
            // Set default to first tick
            index = 0;
            window.console.warn('(lock_to_ticks) _keydown: index should not be -1');
          }
          index += dir;
          index = Math.max(0, Math.min(this.options.ticks.length - 1, index));
          val = this.options.ticks[index];
        } else {
          val = this._state.value[handleIdx] + dir * this.options.step;
        }
        var percentage = this._toPercentage(val);
        this._state.keyCtrl = handleIdx;
        if (this.options.range) {
          this._adjustPercentageForRangeSliders(percentage);
          var val1 = !this._state.keyCtrl ? val : this._state.value[0];
          var val2 = this._state.keyCtrl ? val : this._state.value[1];
          // Restrict values within limits
          val = [Math.max(this.options.min, Math.min(this.options.max, val1)), Math.max(this.options.min, Math.min(this.options.max, val2))];
        } else {
          val = Math.max(this.options.min, Math.min(this.options.max, val));
        }

        this._trigger('slideStart', val);

        this.setValue(val, true, true);

        this._trigger('slideStop', val);

        this._pauseEvent(ev);
        delete this._state.keyCtrl;

        return false;
      },
      _pauseEvent: function _pauseEvent(ev) {
        if (ev.stopPropagation) {
          ev.stopPropagation();
        }
        if (ev.preventDefault) {
          ev.preventDefault();
        }
        ev.cancelBubble = true;
        ev.returnValue = false;
      },
      _mousemove: function _mousemove(ev) {
        if (!this._state.enabled) {
          return false;
        }

        var percentage = this._getPercentage(ev);
        this._adjustPercentageForRangeSliders(percentage);
        this._state.percentage[this._state.dragged] = percentage;

        var val = this._calculateValue(true);

        if (ev.target.classList.contains('slider-tick')) {
          val = parseFloat(ev.target.getAttribute('data-tick-value'));
        }

        this.setValue(val, true, true);

        return false;
      },
      _touchmove: function _touchmove(ev) {
        if (ev.changedTouches === undefined) {
          return;
        }

        // Prevent page from scrolling and only drag the slider
        if (ev.preventDefault) {
          ev.preventDefault();
        }
      },
      _adjustPercentageForRangeSliders: function _adjustPercentageForRangeSliders(percentage) {
        if (this.options.range) {
          var precision = this._getNumDigitsAfterDecimalPlace(percentage);
          precision = precision ? precision - 1 : 0;
          var percentageWithAdjustedPrecision = this._applyToFixedAndParseFloat(percentage, precision);
          if (this._state.dragged === 0 && this._applyToFixedAndParseFloat(this._state.percentage[1], precision) < percentageWithAdjustedPrecision) {
            this._state.percentage[0] = this._state.percentage[1];
            this._state.dragged = 1;
          } else if (this._state.dragged === 1 && this._applyToFixedAndParseFloat(this._state.percentage[0], precision) > percentageWithAdjustedPrecision) {
            this._state.percentage[1] = this._state.percentage[0];
            this._state.dragged = 0;
          } else if (this._state.keyCtrl === 0 && this._toPercentage(this._state.value[1]) < percentage) {
            this._state.percentage[0] = this._state.percentage[1];
            this._state.keyCtrl = 1;
            this.handle2.focus();
          } else if (this._state.keyCtrl === 1 && this._toPercentage(this._state.value[0]) > percentage) {
            this._state.percentage[1] = this._state.percentage[0];
            this._state.keyCtrl = 0;
            this.handle1.focus();
          }
        }
      },
      _mouseup: function _mouseup(ev) {
        if (!this._state.enabled) {
          return false;
        }

        var percentage = this._getPercentage(ev);
        this._adjustPercentageForRangeSliders(percentage);
        this._state.percentage[this._state.dragged] = percentage;

        if (this.touchCapable) {
          // Touch: Unbind touch event handlers:
          document.removeEventListener("touchmove", this.mousemove, false);
          document.removeEventListener("touchend", this.mouseup, false);
        }
        // Unbind mouse event handlers:
        document.removeEventListener("mousemove", this.mousemove, false);
        document.removeEventListener("mouseup", this.mouseup, false);

        this._state.inDrag = false;
        this.hideTooltip();
        if (this._state.over === false) {
          this._hideTooltip();
        }
        var val = this._calculateValue(true);


        if (ev.target.classList.contains('slider-tick')) {
          val = parseFloat(ev.target.getAttribute('data-tick-value'));
        }

        this.setValue(val, false, true);
        this._trigger('slideStop', val);

        // No longer need 'dragged' after mouse up
        this._state.dragged = null;

        return false;
      },
      _setValues: function _setValues(index, val) {
        var comp = 0 === index ? 0 : 100;
        if (this._state.percentage[index] !== comp) {
          val.data[index] = this._toValue(this._state.percentage[index]);
          val.data[index] = this._applyPrecision(val.data[index]);
        }
      },
      _calculateValue: function _calculateValue(snapToClosestTick) {
        var val = {};
        if (this.options.range) {
          val.data = [this.options.min, this.options.max];
          this._setValues(0, val);
          this._setValues(1, val);
          if (snapToClosestTick) {
            val.data[0] = this._snapToClosestTick(val.data[0]);
            val.data[1] = this._snapToClosestTick(val.data[1]);
          }
        } else {
          val.data = this._toValue(this._state.percentage[0]);
          val.data = parseFloat(val.data);
          val.data = this._applyPrecision(val.data);
          if (snapToClosestTick) {
            val.data = this._snapToClosestTick(val.data);
          }
        }

        return val.data;
      },
      _snapToClosestTick: function _snapToClosestTick(val) {
        var min = [val, Infinity];
        for (var i = 0; i < this.options.ticks.length; i++) {
          var diff = Math.abs(this.options.ticks[i] - val);
          if (diff <= min[1]) {
            min = [this.options.ticks[i], diff];
          }
        }
        if (min[1] <= this.options.ticks_snap_bounds) {
          return min[0];
        }
        return val;
      },

      _applyPrecision: function _applyPrecision(val) {
        var precision = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
        return this._applyToFixedAndParseFloat(val, precision);
      },
      _getNumDigitsAfterDecimalPlace: function _getNumDigitsAfterDecimalPlace(num) {
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
          return 0;
        }
        return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
      },
      _applyToFixedAndParseFloat: function _applyToFixedAndParseFloat(num, toFixedInput) {
        var truncatedNum = num.toFixed(toFixedInput);
        return parseFloat(truncatedNum);
      },
      /*
      Credits to Mike Samuel for the following method!
      Source: http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
   */
      _getPercentage: function _getPercentage(ev) {
        if (this.touchCapable && (ev.type === 'touchstart' || ev.type === 'touchmove' || ev.type === 'touchend')) {
          ev = ev.changedTouches[0];
        }

        var eventPosition = ev[this.mousePos];
        var sliderOffset = this._state.offset[this.stylePos];
        var distanceToSlide = eventPosition - sliderOffset;
        if (this.stylePos === 'right') {
          distanceToSlide = -distanceToSlide;
        }
        // Calculate what percent of the length the slider handle has slid
        var percentage = distanceToSlide / this._state.size * 100;
        percentage = Math.round(percentage / this._state.percentage[2]) * this._state.percentage[2];
        if (this.options.reversed) {
          percentage = 100 - percentage;
        }

        // Make sure the percent is within the bounds of the slider.
        // 0% corresponds to the 'min' value of the slide
        // 100% corresponds to the 'max' value of the slide
        return Math.max(0, Math.min(100, percentage));
      },
      _validateInputValue: function _validateInputValue(val) {
        if (!isNaN(+val)) {
          return +val;
        } else if (Array.isArray(val)) {
          this._validateArray(val);
          return val;
        } else {
          throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(val));
        }
      },
      _validateArray: function _validateArray(val) {
        for (var i = 0; i < val.length; i++) {
          var input = val[i];
          if (typeof input !== 'number') {
            throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(input));
          }
        }
      },
      _setDataVal: function _setDataVal(val) {
        this.element.setAttribute('data-value', val);
        this.element.setAttribute('value', val);
        this.element.value = val;
      },
      _trigger: function _trigger(evt, val) {
        val = val || val === 0 ? val : undefined;

        var callbackFnArray = this.eventToCallbackMap[evt];
        if (callbackFnArray && callbackFnArray.length) {
          for (var i = 0; i < callbackFnArray.length; i++) {
            var callbackFn = callbackFnArray[i];
            callbackFn(val);
          }
        }

        /* If JQuery exists, trigger JQuery events */
        if ($) {
          this._triggerJQueryEvent(evt, val);
        }
      },
      _triggerJQueryEvent: function _triggerJQueryEvent(evt, val) {
        var eventData = {
          type: evt,
          value: val
        };
        this.$element.trigger(eventData);
        this.$sliderElem.trigger(eventData);
      },
      _unbindJQueryEventHandlers: function _unbindJQueryEventHandlers() {
        this.$element.off();
        this.$sliderElem.off();
      },
      _setText: function _setText(element, text) {
        if (typeof element.textContent !== "undefined") {
          element.textContent = text;
        } else if (typeof element.innerText !== "undefined") {
          element.innerText = text;
        }
      },
      _removeClass: function _removeClass(element, classString) {
        var classes = classString.split(" ");
        var newClasses = element.className;

        for (var i = 0; i < classes.length; i++) {
          var classTag = classes[i];
          var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
          newClasses = newClasses.replace(regex, " ");
        }

        element.className = newClasses.trim();
      },
      _addClass: function _addClass(element, classString) {
        var classes = classString.split(" ");
        var newClasses = element.className;

        for (var i = 0; i < classes.length; i++) {
          var classTag = classes[i];
          var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
          var ifClassExists = regex.test(newClasses);

          if (!ifClassExists) {
            newClasses += " " + classTag;
          }
        }

        element.className = newClasses.trim();
      },
      _offsetLeft: function _offsetLeft(obj) {
        return obj.getBoundingClientRect().left;
      },
      _offsetRight: function _offsetRight(obj) {
        return obj.getBoundingClientRect().right;
      },
      _offsetTop: function _offsetTop(obj) {
        var offsetTop = obj.offsetTop;
        while ((obj = obj.offsetParent) && !isNaN(obj.offsetTop)) {
          offsetTop += obj.offsetTop;
          if (obj.tagName !== 'BODY') {
            offsetTop -= obj.scrollTop;
          }
        }
        return offsetTop;
      },
      _offset: function _offset(obj) {
        return {
          left: this._offsetLeft(obj),
          right: this._offsetRight(obj),
          top: this._offsetTop(obj)
        };
      },
      _css: function _css(elementRef, styleName, value) {
        if ($) {
          $.style(elementRef, styleName, value);
        } else {
          var style = styleName.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (all, letter) {
            return letter.toUpperCase();
          });
          elementRef.style[style] = value;
        }
      },
      _toValue: function _toValue(percentage) {
        return this.options.scale.toValue.apply(this, [percentage]);
      },
      _toPercentage: function _toPercentage(value) {
        return this.options.scale.toPercentage.apply(this, [value]);
      },
      _setTooltipPosition: function _setTooltipPosition() {
        var tooltips = [this.tooltip, this.tooltip_min, this.tooltip_max];
        if (this.options.orientation === 'vertical') {
          var tooltipPos;
          if (this.options.tooltip_position) {
            tooltipPos = this.options.tooltip_position;
          } else {
            if (this.options.rtl) {
              tooltipPos = 'left';
            } else {
              tooltipPos = 'right';
            }
          }
          var oppositeSide = tooltipPos === 'left' ? 'right' : 'left';
          tooltips.forEach(function (tooltip) {
            this._addClass(tooltip, 'bs-tooltip-' + tooltipPos);
            tooltip.style[oppositeSide] = '100%';
          }.bind(this));
        } else if (this.options.tooltip_position === 'bottom') {
          tooltips.forEach(function (tooltip) {
            this._addClass(tooltip, 'bs-tooltip-bottom');
            tooltip.style.top = 22 + 'px';
          }.bind(this));
        } else {
          tooltips.forEach(function (tooltip) {
            this._addClass(tooltip, 'bs-tooltip-top');
            tooltip.style.top = -this.tooltip.outerHeight - 14 + 'px';
          }.bind(this));
        }
      },
      _getClosestTickIndex: function _getClosestTickIndex(val) {
        var difference = Math.abs(val - this.options.ticks[0]);
        var index = 0;
        for (var i = 0; i < this.options.ticks.length; ++i) {
          var d = Math.abs(val - this.options.ticks[i]);
          if (d < difference) {
            difference = d;
            index = i;
          }
        }
        return index;
      },
      /**
    * Attempts to find the index in `ticks[]` the slider values are set at.
    * The indexes can be -1 to indicate the slider value is not set at a value in `ticks[]`.
    */
      _setTickIndex: function _setTickIndex() {
        if (this.ticksAreValid) {
          this._state.tickIndex = [this.options.ticks.indexOf(this._state.value[0]), this.options.ticks.indexOf(this._state.value[1])];
        }
      }
    };

    /*********************************
      Attach to global namespace
    *********************************/
    if ($ && $.fn) {
      if (!$.fn.slider) {
        $.bridget(NAMESPACE_MAIN, Slider);
        autoRegisterNamespace = NAMESPACE_MAIN;
      } else {
        if (windowIsDefined) {
          window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead.");
        }
        autoRegisterNamespace = NAMESPACE_ALTERNATE;
      }
      $.bridget(NAMESPACE_ALTERNATE, Slider);

      // Auto-Register data-provide="slider" Elements
      $(function () {
        $("input[data-provide=slider]")[autoRegisterNamespace]();
      });
    }
  })($);

  return Slider;
});
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
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/

(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.JSZip = f() } })(function () {
  var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
    1: [function (require, module, exports) {
      "use strict";
      var utils = require("./utils");
      var support = require("./support");
      // private property
      var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


      // public method for encoding
      exports.encode = function (input) {
        var output = [];
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0, len = input.length, remainingBytes = len;

        var isArray = utils.getTypeOf(input) !== "string";
        while (i < input.length) {
          remainingBytes = len - i;

          if (!isArray) {
            chr1 = input.charCodeAt(i++);
            chr2 = i < len ? input.charCodeAt(i++) : 0;
            chr3 = i < len ? input.charCodeAt(i++) : 0;
          } else {
            chr1 = input[i++];
            chr2 = i < len ? input[i++] : 0;
            chr3 = i < len ? input[i++] : 0;
          }

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = remainingBytes > 1 ? (((chr2 & 15) << 2) | (chr3 >> 6)) : 64;
          enc4 = remainingBytes > 2 ? (chr3 & 63) : 64;

          output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));

        }

        return output.join("");
      };

      // public method for decoding
      exports.decode = function (input) {
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0, resultIndex = 0;

        var dataUrlPrefix = "data:";

        if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) {
          // This is a common error: people give a data url
          // (data:image/png;base64,iVBOR...) with a {base64: true} and
          // wonders why things don't work.
          // We can detect that the string input looks like a data url but we
          // *can't* be sure it is one: removing everything up to the comma would
          // be too dangerous.
          throw new Error("Invalid base64 input, it looks like a data url.");
        }

        input = input.replace(/[^A-Za-z0-9+/=]/g, "");

        var totalLength = input.length * 3 / 4;
        if (input.charAt(input.length - 1) === _keyStr.charAt(64)) {
          totalLength--;
        }
        if (input.charAt(input.length - 2) === _keyStr.charAt(64)) {
          totalLength--;
        }
        if (totalLength % 1 !== 0) {
          // totalLength is not an integer, the length does not match a valid
          // base64 content. That can happen if:
          // - the input is not a base64 content
          // - the input is *almost* a base64 content, with a extra chars at the
          //   beginning or at the end
          // - the input uses a base64 variant (base64url for example)
          throw new Error("Invalid base64 input, bad content length.");
        }
        var output;
        if (support.uint8array) {
          output = new Uint8Array(totalLength | 0);
        } else {
          output = new Array(totalLength | 0);
        }

        while (i < input.length) {

          enc1 = _keyStr.indexOf(input.charAt(i++));
          enc2 = _keyStr.indexOf(input.charAt(i++));
          enc3 = _keyStr.indexOf(input.charAt(i++));
          enc4 = _keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output[resultIndex++] = chr1;

          if (enc3 !== 64) {
            output[resultIndex++] = chr2;
          }
          if (enc4 !== 64) {
            output[resultIndex++] = chr3;
          }

        }

        return output;
      };

    }, { "./support": 30, "./utils": 32 }], 2: [function (require, module, exports) {
      "use strict";

      var external = require("./external");
      var DataWorker = require("./stream/DataWorker");
      var Crc32Probe = require("./stream/Crc32Probe");
      var DataLengthProbe = require("./stream/DataLengthProbe");

      /**
       * Represent a compressed object, with everything needed to decompress it.
       * @constructor
       * @param {number} compressedSize the size of the data compressed.
       * @param {number} uncompressedSize the size of the data after decompression.
       * @param {number} crc32 the crc32 of the decompressed file.
       * @param {object} compression the type of compression, see lib/compressions.js.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
       */
      function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
        this.compressedSize = compressedSize;
        this.uncompressedSize = uncompressedSize;
        this.crc32 = crc32;
        this.compression = compression;
        this.compressedContent = data;
      }

      CompressedObject.prototype = {
        /**
         * Create a worker to get the uncompressed content.
         * @return {GenericWorker} the worker.
         */
        getContentWorker: function () {
          var worker = new DataWorker(external.Promise.resolve(this.compressedContent))
            .pipe(this.compression.uncompressWorker())
            .pipe(new DataLengthProbe("data_length"));

          var that = this;
          worker.on("end", function () {
            if (this.streamInfo["data_length"] !== that.uncompressedSize) {
              throw new Error("Bug : uncompressed data size mismatch");
            }
          });
          return worker;
        },
        /**
         * Create a worker to get the compressed content.
         * @return {GenericWorker} the worker.
         */
        getCompressedWorker: function () {
          return new DataWorker(external.Promise.resolve(this.compressedContent))
            .withStreamInfo("compressedSize", this.compressedSize)
            .withStreamInfo("uncompressedSize", this.uncompressedSize)
            .withStreamInfo("crc32", this.crc32)
            .withStreamInfo("compression", this.compression)
            ;
        }
      };

      /**
       * Chain the given worker with other workers to compress the content with the
       * given compression.
       * @param {GenericWorker} uncompressedWorker the worker to pipe.
       * @param {Object} compression the compression object.
       * @param {Object} compressionOptions the options to use when compressing.
       * @return {GenericWorker} the new worker compressing the content.
       */
      CompressedObject.createWorkerFrom = function (uncompressedWorker, compression, compressionOptions) {
        return uncompressedWorker
          .pipe(new Crc32Probe())
          .pipe(new DataLengthProbe("uncompressedSize"))
          .pipe(compression.compressWorker(compressionOptions))
          .pipe(new DataLengthProbe("compressedSize"))
          .withStreamInfo("compression", compression);
      };

      module.exports = CompressedObject;

    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function (require, module, exports) {
      "use strict";

      var GenericWorker = require("./stream/GenericWorker");

      exports.STORE = {
        magic: "\x00\x00",
        compressWorker: function () {
          return new GenericWorker("STORE compression");
        },
        uncompressWorker: function () {
          return new GenericWorker("STORE decompression");
        }
      };
      exports.DEFLATE = require("./flate");

    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function (require, module, exports) {
      "use strict";

      var utils = require("./utils");

      /**
       * The following functions come from pako, from pako/lib/zlib/crc32.js
       * released under the MIT license, see pako https://github.com/nodeca/pako/
       */

      // Use ordinary array, since untyped makes no boost here
      function makeTable() {
        var c, table = [];

        for (var n = 0; n < 256; n++) {
          c = n;
          for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
          }
          table[n] = c;
        }

        return table;
      }

      // Create table on load. Just 255 signed longs. Not a problem.
      var crcTable = makeTable();


      function crc32(crc, buf, len, pos) {
        var t = crcTable, end = pos + len;

        crc = crc ^ (-1);

        for (var i = pos; i < end; i++) {
          crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
        }

        return (crc ^ (-1)); // >>> 0;
      }

      // That's all for the pako functions.

      /**
       * Compute the crc32 of a string.
       * This is almost the same as the function crc32, but for strings. Using the
       * same function for the two use cases leads to horrible performances.
       * @param {Number} crc the starting value of the crc.
       * @param {String} str the string to use.
       * @param {Number} len the length of the string.
       * @param {Number} pos the starting position for the crc32 computation.
       * @return {Number} the computed crc32.
       */
      function crc32str(crc, str, len, pos) {
        var t = crcTable, end = pos + len;

        crc = crc ^ (-1);

        for (var i = pos; i < end; i++) {
          crc = (crc >>> 8) ^ t[(crc ^ str.charCodeAt(i)) & 0xFF];
        }

        return (crc ^ (-1)); // >>> 0;
      }

      module.exports = function crc32wrapper(input, crc) {
        if (typeof input === "undefined" || !input.length) {
          return 0;
        }

        var isArray = utils.getTypeOf(input) !== "string";

        if (isArray) {
          return crc32(crc | 0, input, input.length, 0);
        } else {
          return crc32str(crc | 0, input, input.length, 0);
        }
      };

    }, { "./utils": 32 }], 5: [function (require, module, exports) {
      "use strict";
      exports.base64 = false;
      exports.binary = false;
      exports.dir = false;
      exports.createFolders = true;
      exports.date = null;
      exports.compression = null;
      exports.compressionOptions = null;
      exports.comment = null;
      exports.unixPermissions = null;
      exports.dosPermissions = null;

    }, {}], 6: [function (require, module, exports) {
      "use strict";

      // load the global object first:
      // - it should be better integrated in the system (unhandledRejection in node)
      // - the environment may have a custom Promise implementation (see zone.js)
      var ES6Promise = null;
      if (typeof Promise !== "undefined") {
        ES6Promise = Promise;
      } else {
        ES6Promise = require("lie");
      }

      /**
       * Let the user use/change some implementations.
       */
      module.exports = {
        Promise: ES6Promise
      };

    }, { "lie": 37 }], 7: [function (require, module, exports) {
      "use strict";
      var USE_TYPEDARRAY = (typeof Uint8Array !== "undefined") && (typeof Uint16Array !== "undefined") && (typeof Uint32Array !== "undefined");

      var pako = require("pako");
      var utils = require("./utils");
      var GenericWorker = require("./stream/GenericWorker");

      var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";

      exports.magic = "\x08\x00";

      /**
       * Create a worker that uses pako to inflate/deflate.
       * @constructor
       * @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
       * @param {Object} options the options to use when (de)compressing.
       */
      function FlateWorker(action, options) {
        GenericWorker.call(this, "FlateWorker/" + action);

        this._pako = null;
        this._pakoAction = action;
        this._pakoOptions = options;
        // the `meta` object from the last chunk received
        // this allow this worker to pass around metadata
        this.meta = {};
      }

      utils.inherits(FlateWorker, GenericWorker);

      /**
       * @see GenericWorker.processChunk
       */
      FlateWorker.prototype.processChunk = function (chunk) {
        this.meta = chunk.meta;
        if (this._pako === null) {
          this._createPako();
        }
        this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
      };

      /**
       * @see GenericWorker.flush
       */
      FlateWorker.prototype.flush = function () {
        GenericWorker.prototype.flush.call(this);
        if (this._pako === null) {
          this._createPako();
        }
        this._pako.push([], true);
      };
      /**
       * @see GenericWorker.cleanUp
       */
      FlateWorker.prototype.cleanUp = function () {
        GenericWorker.prototype.cleanUp.call(this);
        this._pako = null;
      };

      /**
       * Create the _pako object.
       * TODO: lazy-loading this object isn't the best solution but it's the
       * quickest. The best solution is to lazy-load the worker list. See also the
       * issue #446.
       */
      FlateWorker.prototype._createPako = function () {
        this._pako = new pako[this._pakoAction]({
          raw: true,
          level: this._pakoOptions.level || -1 // default compression
        });
        var self = this;
        this._pako.onData = function (data) {
          self.push({
            data: data,
            meta: self.meta
          });
        };
      };

      exports.compressWorker = function (compressionOptions) {
        return new FlateWorker("Deflate", compressionOptions);
      };
      exports.uncompressWorker = function () {
        return new FlateWorker("Inflate", {});
      };

    }, { "./stream/GenericWorker": 28, "./utils": 32, "pako": 38 }], 8: [function (require, module, exports) {
      "use strict";

      var utils = require("../utils");
      var GenericWorker = require("../stream/GenericWorker");
      var utf8 = require("../utf8");
      var crc32 = require("../crc32");
      var signature = require("../signature");

      /**
       * Transform an integer into a string in hexadecimal.
       * @private
       * @param {number} dec the number to convert.
       * @param {number} bytes the number of bytes to generate.
       * @returns {string} the result.
       */
      var decToHex = function (dec, bytes) {
        var hex = "", i;
        for (i = 0; i < bytes; i++) {
          hex += String.fromCharCode(dec & 0xff);
          dec = dec >>> 8;
        }
        return hex;
      };

      /**
       * Generate the UNIX part of the external file attributes.
       * @param {Object} unixPermissions the unix permissions or null.
       * @param {Boolean} isDir true if the entry is a directory, false otherwise.
       * @return {Number} a 32 bit integer.
       *
       * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
       *
       * TTTTsstrwxrwxrwx0000000000ADVSHR
       * ^^^^____________________________ file type, see zipinfo.c (UNX_*)
       *     ^^^_________________________ setuid, setgid, sticky
       *        ^^^^^^^^^________________ permissions
       *                 ^^^^^^^^^^______ not used ?
       *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
       */
      var generateUnixExternalFileAttr = function (unixPermissions, isDir) {

        var result = unixPermissions;
        if (!unixPermissions) {
          // I can't use octal values in strict mode, hence the hexa.
          //  040775 => 0x41fd
          // 0100664 => 0x81b4
          result = isDir ? 0x41fd : 0x81b4;
        }
        return (result & 0xFFFF) << 16;
      };

      /**
       * Generate the DOS part of the external file attributes.
       * @param {Object} dosPermissions the dos permissions or null.
       * @param {Boolean} isDir true if the entry is a directory, false otherwise.
       * @return {Number} a 32 bit integer.
       *
       * Bit 0     Read-Only
       * Bit 1     Hidden
       * Bit 2     System
       * Bit 3     Volume Label
       * Bit 4     Directory
       * Bit 5     Archive
       */
      var generateDosExternalFileAttr = function (dosPermissions) {
        // the dir flag is already set for compatibility
        return (dosPermissions || 0) & 0x3F;
      };

      /**
       * Generate the various parts used in the construction of the final zip file.
       * @param {Object} streamInfo the hash with information about the compressed file.
       * @param {Boolean} streamedContent is the content streamed ?
       * @param {Boolean} streamingEnded is the stream finished ?
       * @param {number} offset the current offset from the start of the zip file.
       * @param {String} platform let's pretend we are this platform (change platform dependents fields)
       * @param {Function} encodeFileName the function to encode the file name / comment.
       * @return {Object} the zip parts.
       */
      var generateZipParts = function (streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
        var file = streamInfo["file"],
          compression = streamInfo["compression"],
          useCustomEncoding = encodeFileName !== utf8.utf8encode,
          encodedFileName = utils.transformTo("string", encodeFileName(file.name)),
          utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)),
          comment = file.comment,
          encodedComment = utils.transformTo("string", encodeFileName(comment)),
          utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)),
          useUTF8ForFileName = utfEncodedFileName.length !== file.name.length,
          useUTF8ForComment = utfEncodedComment.length !== comment.length,
          dosTime,
          dosDate,
          extraFields = "",
          unicodePathExtraField = "",
          unicodeCommentExtraField = "",
          dir = file.dir,
          date = file.date;


        var dataInfo = {
          crc32: 0,
          compressedSize: 0,
          uncompressedSize: 0
        };

        // if the content is streamed, the sizes/crc32 are only available AFTER
        // the end of the stream.
        if (!streamedContent || streamingEnded) {
          dataInfo.crc32 = streamInfo["crc32"];
          dataInfo.compressedSize = streamInfo["compressedSize"];
          dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
        }

        var bitflag = 0;
        if (streamedContent) {
          // Bit 3: the sizes/crc32 are set to zero in the local header.
          // The correct values are put in the data descriptor immediately
          // following the compressed data.
          bitflag |= 0x0008;
        }
        if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
          // Bit 11: Language encoding flag (EFS).
          bitflag |= 0x0800;
        }


        var extFileAttr = 0;
        var versionMadeBy = 0;
        if (dir) {
          // dos or unix, we set the dos dir flag
          extFileAttr |= 0x00010;
        }
        if (platform === "UNIX") {
          versionMadeBy = 0x031E; // UNIX, version 3.0
          extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
        } else { // DOS or other, fallback to DOS
          versionMadeBy = 0x0014; // DOS, version 2.0
          extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
        }

        // date
        // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
        // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
        // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html

        dosTime = date.getUTCHours();
        dosTime = dosTime << 6;
        dosTime = dosTime | date.getUTCMinutes();
        dosTime = dosTime << 5;
        dosTime = dosTime | date.getUTCSeconds() / 2;

        dosDate = date.getUTCFullYear() - 1980;
        dosDate = dosDate << 4;
        dosDate = dosDate | (date.getUTCMonth() + 1);
        dosDate = dosDate << 5;
        dosDate = dosDate | date.getUTCDate();

        if (useUTF8ForFileName) {
          // set the unicode path extra field. unzip needs at least one extra
          // field to correctly handle unicode path, so using the path is as good
          // as any other information. This could improve the situation with
          // other archive managers too.
          // This field is usually used without the utf8 flag, with a non
          // unicode path in the header (winrar, winzip). This helps (a bit)
          // with the messy Windows' default compressed folders feature but
          // breaks on p7zip which doesn't seek the unicode path extra field.
          // So for now, UTF-8 everywhere !
          unicodePathExtraField =
            // Version
            decToHex(1, 1) +
            // NameCRC32
            decToHex(crc32(encodedFileName), 4) +
            // UnicodeName
            utfEncodedFileName;

          extraFields +=
            // Info-ZIP Unicode Path Extra Field
            "\x75\x70" +
            // size
            decToHex(unicodePathExtraField.length, 2) +
            // content
            unicodePathExtraField;
        }

        if (useUTF8ForComment) {

          unicodeCommentExtraField =
            // Version
            decToHex(1, 1) +
            // CommentCRC32
            decToHex(crc32(encodedComment), 4) +
            // UnicodeName
            utfEncodedComment;

          extraFields +=
            // Info-ZIP Unicode Path Extra Field
            "\x75\x63" +
            // size
            decToHex(unicodeCommentExtraField.length, 2) +
            // content
            unicodeCommentExtraField;
        }

        var header = "";

        // version needed to extract
        header += "\x0A\x00";
        // general purpose bit flag
        header += decToHex(bitflag, 2);
        // compression method
        header += compression.magic;
        // last mod file time
        header += decToHex(dosTime, 2);
        // last mod file date
        header += decToHex(dosDate, 2);
        // crc-32
        header += decToHex(dataInfo.crc32, 4);
        // compressed size
        header += decToHex(dataInfo.compressedSize, 4);
        // uncompressed size
        header += decToHex(dataInfo.uncompressedSize, 4);
        // file name length
        header += decToHex(encodedFileName.length, 2);
        // extra field length
        header += decToHex(extraFields.length, 2);


        var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;

        var dirRecord = signature.CENTRAL_FILE_HEADER +
          // version made by (00: DOS)
          decToHex(versionMadeBy, 2) +
          // file header (common to file and central directory)
          header +
          // file comment length
          decToHex(encodedComment.length, 2) +
          // disk number start
          "\x00\x00" +
          // internal file attributes TODO
          "\x00\x00" +
          // external file attributes
          decToHex(extFileAttr, 4) +
          // relative offset of local header
          decToHex(offset, 4) +
          // file name
          encodedFileName +
          // extra field
          extraFields +
          // file comment
          encodedComment;

        return {
          fileRecord: fileRecord,
          dirRecord: dirRecord
        };
      };

      /**
       * Generate the EOCD record.
       * @param {Number} entriesCount the number of entries in the zip file.
       * @param {Number} centralDirLength the length (in bytes) of the central dir.
       * @param {Number} localDirLength the length (in bytes) of the local dir.
       * @param {String} comment the zip file comment as a binary string.
       * @param {Function} encodeFileName the function to encode the comment.
       * @return {String} the EOCD record.
       */
      var generateCentralDirectoryEnd = function (entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
        var dirEnd = "";
        var encodedComment = utils.transformTo("string", encodeFileName(comment));

        // end of central dir signature
        dirEnd = signature.CENTRAL_DIRECTORY_END +
          // number of this disk
          "\x00\x00" +
          // number of the disk with the start of the central directory
          "\x00\x00" +
          // total number of entries in the central directory on this disk
          decToHex(entriesCount, 2) +
          // total number of entries in the central directory
          decToHex(entriesCount, 2) +
          // size of the central directory   4 bytes
          decToHex(centralDirLength, 4) +
          // offset of start of central directory with respect to the starting disk number
          decToHex(localDirLength, 4) +
          // .ZIP file comment length
          decToHex(encodedComment.length, 2) +
          // .ZIP file comment
          encodedComment;

        return dirEnd;
      };

      /**
       * Generate data descriptors for a file entry.
       * @param {Object} streamInfo the hash generated by a worker, containing information
       * on the file entry.
       * @return {String} the data descriptors.
       */
      var generateDataDescriptors = function (streamInfo) {
        var descriptor = "";
        descriptor = signature.DATA_DESCRIPTOR +
          // crc-32                          4 bytes
          decToHex(streamInfo["crc32"], 4) +
          // compressed size                 4 bytes
          decToHex(streamInfo["compressedSize"], 4) +
          // uncompressed size               4 bytes
          decToHex(streamInfo["uncompressedSize"], 4);

        return descriptor;
      };


      /**
       * A worker to concatenate other workers to create a zip file.
       * @param {Boolean} streamFiles `true` to stream the content of the files,
       * `false` to accumulate it.
       * @param {String} comment the comment to use.
       * @param {String} platform the platform to use, "UNIX" or "DOS".
       * @param {Function} encodeFileName the function to encode file names and comments.
       */
      function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
        GenericWorker.call(this, "ZipFileWorker");
        // The number of bytes written so far. This doesn't count accumulated chunks.
        this.bytesWritten = 0;
        // The comment of the zip file
        this.zipComment = comment;
        // The platform "generating" the zip file.
        this.zipPlatform = platform;
        // the function to encode file names and comments.
        this.encodeFileName = encodeFileName;
        // Should we stream the content of the files ?
        this.streamFiles = streamFiles;
        // If `streamFiles` is false, we will need to accumulate the content of the
        // files to calculate sizes / crc32 (and write them *before* the content).
        // This boolean indicates if we are accumulating chunks (it will change a lot
        // during the lifetime of this worker).
        this.accumulate = false;
        // The buffer receiving chunks when accumulating content.
        this.contentBuffer = [];
        // The list of generated directory records.
        this.dirRecords = [];
        // The offset (in bytes) from the beginning of the zip file for the current source.
        this.currentSourceOffset = 0;
        // The total number of entries in this zip file.
        this.entriesCount = 0;
        // the name of the file currently being added, null when handling the end of the zip file.
        // Used for the emitted metadata.
        this.currentFile = null;



        this._sources = [];
      }
      utils.inherits(ZipFileWorker, GenericWorker);

      /**
       * @see GenericWorker.push
       */
      ZipFileWorker.prototype.push = function (chunk) {

        var currentFilePercent = chunk.meta.percent || 0;
        var entriesCount = this.entriesCount;
        var remainingFiles = this._sources.length;

        if (this.accumulate) {
          this.contentBuffer.push(chunk);
        } else {
          this.bytesWritten += chunk.data.length;

          GenericWorker.prototype.push.call(this, {
            data: chunk.data,
            meta: {
              currentFile: this.currentFile,
              percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
            }
          });
        }
      };

      /**
       * The worker started a new source (an other worker).
       * @param {Object} streamInfo the streamInfo object from the new source.
       */
      ZipFileWorker.prototype.openedSource = function (streamInfo) {
        this.currentSourceOffset = this.bytesWritten;
        this.currentFile = streamInfo["file"].name;

        var streamedContent = this.streamFiles && !streamInfo["file"].dir;

        // don't stream folders (because they don't have any content)
        if (streamedContent) {
          var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({
            data: record.fileRecord,
            meta: { percent: 0 }
          });
        } else {
          // we need to wait for the whole file before pushing anything
          this.accumulate = true;
        }
      };

      /**
       * The worker finished a source (an other worker).
       * @param {Object} streamInfo the streamInfo object from the finished source.
       */
      ZipFileWorker.prototype.closedSource = function (streamInfo) {
        this.accumulate = false;
        var streamedContent = this.streamFiles && !streamInfo["file"].dir;
        var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);

        this.dirRecords.push(record.dirRecord);
        if (streamedContent) {
          // after the streamed file, we put data descriptors
          this.push({
            data: generateDataDescriptors(streamInfo),
            meta: { percent: 100 }
          });
        } else {
          // the content wasn't streamed, we need to push everything now
          // first the file record, then the content
          this.push({
            data: record.fileRecord,
            meta: { percent: 0 }
          });
          while (this.contentBuffer.length) {
            this.push(this.contentBuffer.shift());
          }
        }
        this.currentFile = null;
      };

      /**
       * @see GenericWorker.flush
       */
      ZipFileWorker.prototype.flush = function () {

        var localDirLength = this.bytesWritten;
        for (var i = 0; i < this.dirRecords.length; i++) {
          this.push({
            data: this.dirRecords[i],
            meta: { percent: 100 }
          });
        }
        var centralDirLength = this.bytesWritten - localDirLength;

        var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);

        this.push({
          data: dirEnd,
          meta: { percent: 100 }
        });
      };

      /**
       * Prepare the next source to be read.
       */
      ZipFileWorker.prototype.prepareNextSource = function () {
        this.previous = this._sources.shift();
        this.openedSource(this.previous.streamInfo);
        if (this.isPaused) {
          this.previous.pause();
        } else {
          this.previous.resume();
        }
      };

      /**
       * @see GenericWorker.registerPrevious
       */
      ZipFileWorker.prototype.registerPrevious = function (previous) {
        this._sources.push(previous);
        var self = this;

        previous.on("data", function (chunk) {
          self.processChunk(chunk);
        });
        previous.on("end", function () {
          self.closedSource(self.previous.streamInfo);
          if (self._sources.length) {
            self.prepareNextSource();
          } else {
            self.end();
          }
        });
        previous.on("error", function (e) {
          self.error(e);
        });
        return this;
      };

      /**
       * @see GenericWorker.resume
       */
      ZipFileWorker.prototype.resume = function () {
        if (!GenericWorker.prototype.resume.call(this)) {
          return false;
        }

        if (!this.previous && this._sources.length) {
          this.prepareNextSource();
          return true;
        }
        if (!this.previous && !this._sources.length && !this.generatedError) {
          this.end();
          return true;
        }
      };

      /**
       * @see GenericWorker.error
       */
      ZipFileWorker.prototype.error = function (e) {
        var sources = this._sources;
        if (!GenericWorker.prototype.error.call(this, e)) {
          return false;
        }
        for (var i = 0; i < sources.length; i++) {
          try {
            sources[i].error(e);
          } catch (e) {
            // the `error` exploded, nothing to do
          }
        }
        return true;
      };

      /**
       * @see GenericWorker.lock
       */
      ZipFileWorker.prototype.lock = function () {
        GenericWorker.prototype.lock.call(this);
        var sources = this._sources;
        for (var i = 0; i < sources.length; i++) {
          sources[i].lock();
        }
      };

      module.exports = ZipFileWorker;

    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function (require, module, exports) {
      "use strict";

      var compressions = require("../compressions");
      var ZipFileWorker = require("./ZipFileWorker");

      /**
       * Find the compression to use.
       * @param {String} fileCompression the compression defined at the file level, if any.
       * @param {String} zipCompression the compression defined at the load() level.
       * @return {Object} the compression object to use.
       */
      var getCompression = function (fileCompression, zipCompression) {

        var compressionName = fileCompression || zipCompression;
        var compression = compressions[compressionName];
        if (!compression) {
          throw new Error(compressionName + " is not a valid compression method !");
        }
        return compression;
      };

      /**
       * Create a worker to generate a zip file.
       * @param {JSZip} zip the JSZip instance at the right root level.
       * @param {Object} options to generate the zip file.
       * @param {String} comment the comment to use.
       */
      exports.generateWorker = function (zip, options, comment) {

        var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
        var entriesCount = 0;
        try {

          zip.forEach(function (relativePath, file) {
            entriesCount++;
            var compression = getCompression(file.options.compression, options.compression);
            var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
            var dir = file.dir, date = file.date;

            file._compressWorker(compression, compressionOptions)
              .withStreamInfo("file", {
                name: relativePath,
                dir: dir,
                date: date,
                comment: file.comment || "",
                unixPermissions: file.unixPermissions,
                dosPermissions: file.dosPermissions
              })
              .pipe(zipFileWorker);
          });
          zipFileWorker.entriesCount = entriesCount;
        } catch (e) {
          zipFileWorker.error(e);
        }

        return zipFileWorker;
      };

    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function (require, module, exports) {
      "use strict";

      /**
       * Representation a of zip file in js
       * @constructor
       */
      function JSZip() {
        // if this constructor is used without `new`, it adds `new` before itself:
        if (!(this instanceof JSZip)) {
          return new JSZip();
        }

        if (arguments.length) {
          throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        }

        // object containing the files :
        // {
        //   "folder/" : {...},
        //   "folder/data.txt" : {...}
        // }
        // NOTE: we use a null prototype because we do not
        // want filenames like "toString" coming from a zip file
        // to overwrite methods and attributes in a normal Object.
        this.files = Object.create(null);

        this.comment = null;

        // Where we are in the hierarchy
        this.root = "";
        this.clone = function () {
          var newObj = new JSZip();
          for (var i in this) {
            if (typeof this[i] !== "function") {
              newObj[i] = this[i];
            }
          }
          return newObj;
        };
      }
      JSZip.prototype = require("./object");
      JSZip.prototype.loadAsync = require("./load");
      JSZip.support = require("./support");
      JSZip.defaults = require("./defaults");

      // TODO find a better way to handle this version,
      // a require('package.json').version doesn't work with webpack, see #327
      JSZip.version = "3.10.1";

      JSZip.loadAsync = function (content, options) {
        return new JSZip().loadAsync(content, options);
      };

      JSZip.external = require("./external");
      module.exports = JSZip;

    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function (require, module, exports) {
      "use strict";
      var utils = require("./utils");
      var external = require("./external");
      var utf8 = require("./utf8");
      var ZipEntries = require("./zipEntries");
      var Crc32Probe = require("./stream/Crc32Probe");
      var nodejsUtils = require("./nodejsUtils");

      /**
       * Check the CRC32 of an entry.
       * @param {ZipEntry} zipEntry the zip entry to check.
       * @return {Promise} the result.
       */
      function checkEntryCRC32(zipEntry) {
        return new external.Promise(function (resolve, reject) {
          var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
          worker.on("error", function (e) {
            reject(e);
          })
            .on("end", function () {
              if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
                reject(new Error("Corrupted zip : CRC32 mismatch"));
              } else {
                resolve();
              }
            })
            .resume();
        });
      }

      module.exports = function (data, options) {
        var zip = this;
        options = utils.extend(options || {}, {
          base64: false,
          checkCRC32: false,
          optimizedBinaryString: false,
          createFolders: false,
          decodeFileName: utf8.utf8decode
        });

        if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
          return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
        }

        return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64)
          .then(function (data) {
            var zipEntries = new ZipEntries(options);
            zipEntries.load(data);
            return zipEntries;
          }).then(function checkCRC32(zipEntries) {
            var promises = [external.Promise.resolve(zipEntries)];
            var files = zipEntries.files;
            if (options.checkCRC32) {
              for (var i = 0; i < files.length; i++) {
                promises.push(checkEntryCRC32(files[i]));
              }
            }
            return external.Promise.all(promises);
          }).then(function addFiles(results) {
            var zipEntries = results.shift();
            var files = zipEntries.files;
            for (var i = 0; i < files.length; i++) {
              var input = files[i];

              var unsafeName = input.fileNameStr;
              var safeName = utils.resolve(input.fileNameStr);

              zip.file(safeName, input.decompressed, {
                binary: true,
                optimizedBinaryString: true,
                date: input.date,
                dir: input.dir,
                comment: input.fileCommentStr.length ? input.fileCommentStr : null,
                unixPermissions: input.unixPermissions,
                dosPermissions: input.dosPermissions,
                createFolders: options.createFolders
              });
              if (!input.dir) {
                zip.file(safeName).unsafeOriginalName = unsafeName;
              }
            }
            if (zipEntries.zipComment.length) {
              zip.comment = zipEntries.zipComment;
            }

            return zip;
          });
      };

    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function (require, module, exports) {
      "use strict";

      var utils = require("../utils");
      var GenericWorker = require("../stream/GenericWorker");

      /**
       * A worker that use a nodejs stream as source.
       * @constructor
       * @param {String} filename the name of the file entry for this stream.
       * @param {Readable} stream the nodejs stream.
       */
      function NodejsStreamInputAdapter(filename, stream) {
        GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
        this._upstreamEnded = false;
        this._bindStream(stream);
      }

      utils.inherits(NodejsStreamInputAdapter, GenericWorker);

      /**
       * Prepare the stream and bind the callbacks on it.
       * Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
       * @param {Stream} stream the nodejs stream to use.
       */
      NodejsStreamInputAdapter.prototype._bindStream = function (stream) {
        var self = this;
        this._stream = stream;
        stream.pause();
        stream
          .on("data", function (chunk) {
            self.push({
              data: chunk,
              meta: {
                percent: 0
              }
            });
          })
          .on("error", function (e) {
            if (self.isPaused) {
              this.generatedError = e;
            } else {
              self.error(e);
            }
          })
          .on("end", function () {
            if (self.isPaused) {
              self._upstreamEnded = true;
            } else {
              self.end();
            }
          });
      };
      NodejsStreamInputAdapter.prototype.pause = function () {
        if (!GenericWorker.prototype.pause.call(this)) {
          return false;
        }
        this._stream.pause();
        return true;
      };
      NodejsStreamInputAdapter.prototype.resume = function () {
        if (!GenericWorker.prototype.resume.call(this)) {
          return false;
        }

        if (this._upstreamEnded) {
          this.end();
        } else {
          this._stream.resume();
        }

        return true;
      };

      module.exports = NodejsStreamInputAdapter;

    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function (require, module, exports) {
      "use strict";

      var Readable = require("readable-stream").Readable;

      var utils = require("../utils");
      utils.inherits(NodejsStreamOutputAdapter, Readable);

      /**
      * A nodejs stream using a worker as source.
      * @see the SourceWrapper in http://nodejs.org/api/stream.html
      * @constructor
      * @param {StreamHelper} helper the helper wrapping the worker
      * @param {Object} options the nodejs stream options
      * @param {Function} updateCb the update callback.
      */
      function NodejsStreamOutputAdapter(helper, options, updateCb) {
        Readable.call(this, options);
        this._helper = helper;

        var self = this;
        helper.on("data", function (data, meta) {
          if (!self.push(data)) {
            self._helper.pause();
          }
          if (updateCb) {
            updateCb(meta);
          }
        })
          .on("error", function (e) {
            self.emit("error", e);
          })
          .on("end", function () {
            self.push(null);
          });
      }


      NodejsStreamOutputAdapter.prototype._read = function () {
        this._helper.resume();
      };

      module.exports = NodejsStreamOutputAdapter;

    }, { "../utils": 32, "readable-stream": 16 }], 14: [function (require, module, exports) {
      "use strict";

      module.exports = {
        /**
         * True if this is running in Nodejs, will be undefined in a browser.
         * In a browser, browserify won't include this file and the whole module
         * will be resolved an empty object.
         */
        isNode: typeof Buffer !== "undefined",
        /**
         * Create a new nodejs Buffer from an existing content.
         * @param {Object} data the data to pass to the constructor.
         * @param {String} encoding the encoding to use.
         * @return {Buffer} a new Buffer.
         */
        newBufferFrom: function (data, encoding) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) {
            return Buffer.from(data, encoding);
          } else {
            if (typeof data === "number") {
              // Safeguard for old Node.js versions. On newer versions,
              // Buffer.from(number) / Buffer(number, encoding) already throw.
              throw new Error("The \"data\" argument must not be a number");
            }
            return new Buffer(data, encoding);
          }
        },
        /**
         * Create a new nodejs Buffer with the specified size.
         * @param {Integer} size the size of the buffer.
         * @return {Buffer} a new Buffer.
         */
        allocBuffer: function (size) {
          if (Buffer.alloc) {
            return Buffer.alloc(size);
          } else {
            var buf = new Buffer(size);
            buf.fill(0);
            return buf;
          }
        },
        /**
         * Find out if an object is a Buffer.
         * @param {Object} b the object to test.
         * @return {Boolean} true if the object is a Buffer, false otherwise.
         */
        isBuffer: function (b) {
          return Buffer.isBuffer(b);
        },

        isStream: function (obj) {
          return obj &&
            typeof obj.on === "function" &&
            typeof obj.pause === "function" &&
            typeof obj.resume === "function";
        }
      };

    }, {}], 15: [function (require, module, exports) {
      "use strict";
      var utf8 = require("./utf8");
      var utils = require("./utils");
      var GenericWorker = require("./stream/GenericWorker");
      var StreamHelper = require("./stream/StreamHelper");
      var defaults = require("./defaults");
      var CompressedObject = require("./compressedObject");
      var ZipObject = require("./zipObject");
      var generate = require("./generate");
      var nodejsUtils = require("./nodejsUtils");
      var NodejsStreamInputAdapter = require("./nodejs/NodejsStreamInputAdapter");


      /**
       * Add a file in the current folder.
       * @private
       * @param {string} name the name of the file
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
       * @param {Object} originalOptions the options of the file
       * @return {Object} the new file.
       */
      var fileAdd = function (name, data, originalOptions) {
        // be sure sub folders exist
        var dataType = utils.getTypeOf(data),
          parent;


        /*
         * Correct options.
         */

        var o = utils.extend(originalOptions || {}, defaults);
        o.date = o.date || new Date();
        if (o.compression !== null) {
          o.compression = o.compression.toUpperCase();
        }

        if (typeof o.unixPermissions === "string") {
          o.unixPermissions = parseInt(o.unixPermissions, 8);
        }

        // UNX_IFDIR  0040000 see zipinfo.c
        if (o.unixPermissions && (o.unixPermissions & 0x4000)) {
          o.dir = true;
        }
        // Bit 4    Directory
        if (o.dosPermissions && (o.dosPermissions & 0x0010)) {
          o.dir = true;
        }

        if (o.dir) {
          name = forceTrailingSlash(name);
        }
        if (o.createFolders && (parent = parentFolder(name))) {
          folderAdd.call(this, parent, true);
        }

        var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
        if (!originalOptions || typeof originalOptions.binary === "undefined") {
          o.binary = !isUnicodeString;
        }


        var isCompressedEmpty = (data instanceof CompressedObject) && data.uncompressedSize === 0;

        if (isCompressedEmpty || o.dir || !data || data.length === 0) {
          o.base64 = false;
          o.binary = true;
          data = "";
          o.compression = "STORE";
          dataType = "string";
        }

        /*
         * Convert content to fit.
         */

        var zipObjectContent = null;
        if (data instanceof CompressedObject || data instanceof GenericWorker) {
          zipObjectContent = data;
        } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
          zipObjectContent = new NodejsStreamInputAdapter(name, data);
        } else {
          zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
        }

        var object = new ZipObject(name, zipObjectContent, o);
        this.files[name] = object;
        /*
        TODO: we can't throw an exception because we have async promises
        (we can have a promise of a Date() for example) but returning a
        promise is useless because file(name, data) returns the JSZip
        object for chaining. Should we break that to allow the user
        to catch the error ?
    
        return external.Promise.resolve(zipObjectContent)
        .then(function () {
            return object;
        });
        */
      };

      /**
       * Find the parent folder of the path.
       * @private
       * @param {string} path the path to use
       * @return {string} the parent folder, or ""
       */
      var parentFolder = function (path) {
        if (path.slice(-1) === "/") {
          path = path.substring(0, path.length - 1);
        }
        var lastSlash = path.lastIndexOf("/");
        return (lastSlash > 0) ? path.substring(0, lastSlash) : "";
      };

      /**
       * Returns the path with a slash at the end.
       * @private
       * @param {String} path the path to check.
       * @return {String} the path with a trailing slash.
       */
      var forceTrailingSlash = function (path) {
        // Check the name ends with a /
        if (path.slice(-1) !== "/") {
          path += "/"; // IE doesn't like substr(-1)
        }
        return path;
      };

      /**
       * Add a (sub) folder in the current folder.
       * @private
       * @param {string} name the folder's name
       * @param {boolean=} [createFolders] If true, automatically create sub
       *  folders. Defaults to false.
       * @return {Object} the new folder.
       */
      var folderAdd = function (name, createFolders) {
        createFolders = (typeof createFolders !== "undefined") ? createFolders : defaults.createFolders;

        name = forceTrailingSlash(name);

        // Does this folder already exist?
        if (!this.files[name]) {
          fileAdd.call(this, name, null, {
            dir: true,
            createFolders: createFolders
          });
        }
        return this.files[name];
      };

      /**
      * Cross-window, cross-Node-context regular expression detection
      * @param  {Object}  object Anything
      * @return {Boolean}        true if the object is a regular expression,
      * false otherwise
      */
      function isRegExp(object) {
        return Object.prototype.toString.call(object) === "[object RegExp]";
      }

      // return the actual prototype of JSZip
      var out = {
        /**
         * @see loadAsync
         */
        load: function () {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        },


        /**
         * Call a callback function for each entry at this folder level.
         * @param {Function} cb the callback function:
         * function (relativePath, file) {...}
         * It takes 2 arguments : the relative path and the file.
         */
        forEach: function (cb) {
          var filename, relativePath, file;
          // ignore warning about unwanted properties because this.files is a null prototype object
          /* eslint-disable-next-line guard-for-in */
          for (filename in this.files) {
            file = this.files[filename];
            relativePath = filename.slice(this.root.length, filename.length);
            if (relativePath && filename.slice(0, this.root.length) === this.root) { // the file is in the current root
              cb(relativePath, file); // TODO reverse the parameters ? need to be clean AND consistent with the filter search fn...
            }
          }
        },

        /**
         * Filter nested files/folders with the specified function.
         * @param {Function} search the predicate to use :
         * function (relativePath, file) {...}
         * It takes 2 arguments : the relative path and the file.
         * @return {Array} An array of matching elements.
         */
        filter: function (search) {
          var result = [];
          this.forEach(function (relativePath, entry) {
            if (search(relativePath, entry)) { // the file matches the function
              result.push(entry);
            }

          });
          return result;
        },

        /**
         * Add a file to the zip file, or search a file.
         * @param   {string|RegExp} name The name of the file to add (if data is defined),
         * the name of the file to find (if no data) or a regex to match files.
         * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
         * @param   {Object} o     File options
         * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
         * a file (when searching by string) or an array of files (when searching by regex).
         */
        file: function (name, data, o) {
          if (arguments.length === 1) {
            if (isRegExp(name)) {
              var regexp = name;
              return this.filter(function (relativePath, file) {
                return !file.dir && regexp.test(relativePath);
              });
            }
            else { // text
              var obj = this.files[this.root + name];
              if (obj && !obj.dir) {
                return obj;
              } else {
                return null;
              }
            }
          }
          else { // more than one argument : we have data !
            name = this.root + name;
            fileAdd.call(this, name, data, o);
          }
          return this;
        },

        /**
         * Add a directory to the zip file, or search.
         * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
         * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
         */
        folder: function (arg) {
          if (!arg) {
            return this;
          }

          if (isRegExp(arg)) {
            return this.filter(function (relativePath, file) {
              return file.dir && arg.test(relativePath);
            });
          }

          // else, name is a new folder
          var name = this.root + arg;
          var newFolder = folderAdd.call(this, name);

          // Allow chaining by returning a new object with this folder as the root
          var ret = this.clone();
          ret.root = newFolder.name;
          return ret;
        },

        /**
         * Delete a file, or a directory and all sub-files, from the zip
         * @param {string} name the name of the file to delete
         * @return {JSZip} this JSZip object
         */
        remove: function (name) {
          name = this.root + name;
          var file = this.files[name];
          if (!file) {
            // Look for any folders
            if (name.slice(-1) !== "/") {
              name += "/";
            }
            file = this.files[name];
          }

          if (file && !file.dir) {
            // file
            delete this.files[name];
          } else {
            // maybe a folder, delete recursively
            var kids = this.filter(function (relativePath, file) {
              return file.name.slice(0, name.length) === name;
            });
            for (var i = 0; i < kids.length; i++) {
              delete this.files[kids[i].name];
            }
          }

          return this;
        },

        /**
         * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
         */
        generate: function () {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        },

        /**
         * Generate the complete zip file as an internal stream.
         * @param {Object} options the options to generate the zip file :
         * - compression, "STORE" by default.
         * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
         * @return {StreamHelper} the streamed zip file.
         */
        generateInternalStream: function (options) {
          var worker, opts = {};
          try {
            opts = utils.extend(options || {}, {
              streamFiles: false,
              compression: "STORE",
              compressionOptions: null,
              type: "",
              platform: "DOS",
              comment: null,
              mimeType: "application/zip",
              encodeFileName: utf8.utf8encode
            });

            opts.type = opts.type.toLowerCase();
            opts.compression = opts.compression.toUpperCase();

            // "binarystring" is preferred but the internals use "string".
            if (opts.type === "binarystring") {
              opts.type = "string";
            }

            if (!opts.type) {
              throw new Error("No output type specified.");
            }

            utils.checkSupport(opts.type);

            // accept nodejs `process.platform`
            if (
              opts.platform === "darwin" ||
              opts.platform === "freebsd" ||
              opts.platform === "linux" ||
              opts.platform === "sunos"
            ) {
              opts.platform = "UNIX";
            }
            if (opts.platform === "win32") {
              opts.platform = "DOS";
            }

            var comment = opts.comment || this.comment || "";
            worker = generate.generateWorker(this, opts, comment);
          } catch (e) {
            worker = new GenericWorker("error");
            worker.error(e);
          }
          return new StreamHelper(worker, opts.type || "string", opts.mimeType);
        },
        /**
         * Generate the complete zip file asynchronously.
         * @see generateInternalStream
         */
        generateAsync: function (options, onUpdate) {
          return this.generateInternalStream(options).accumulate(onUpdate);
        },
        /**
         * Generate the complete zip file asynchronously.
         * @see generateInternalStream
         */
        generateNodeStream: function (options, onUpdate) {
          options = options || {};
          if (!options.type) {
            options.type = "nodebuffer";
          }
          return this.generateInternalStream(options).toNodejsStream(onUpdate);
        }
      };
      module.exports = out;

    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function (require, module, exports) {
      "use strict";
      /*
       * This file is used by module bundlers (browserify/webpack/etc) when
       * including a stream implementation. We use "readable-stream" to get a
       * consistent behavior between nodejs versions but bundlers often have a shim
       * for "stream". Using this shim greatly improve the compatibility and greatly
       * reduce the final size of the bundle (only one stream implementation, not
       * two).
       */
      module.exports = require("stream");

    }, { "stream": undefined }], 17: [function (require, module, exports) {
      "use strict";
      var DataReader = require("./DataReader");
      var utils = require("../utils");

      function ArrayReader(data) {
        DataReader.call(this, data);
        for (var i = 0; i < this.data.length; i++) {
          data[i] = data[i] & 0xFF;
        }
      }
      utils.inherits(ArrayReader, DataReader);
      /**
       * @see DataReader.byteAt
       */
      ArrayReader.prototype.byteAt = function (i) {
        return this.data[this.zero + i];
      };
      /**
       * @see DataReader.lastIndexOfSignature
       */
      ArrayReader.prototype.lastIndexOfSignature = function (sig) {
        var sig0 = sig.charCodeAt(0),
          sig1 = sig.charCodeAt(1),
          sig2 = sig.charCodeAt(2),
          sig3 = sig.charCodeAt(3);
        for (var i = this.length - 4; i >= 0; --i) {
          if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
            return i - this.zero;
          }
        }

        return -1;
      };
      /**
       * @see DataReader.readAndCheckSignature
       */
      ArrayReader.prototype.readAndCheckSignature = function (sig) {
        var sig0 = sig.charCodeAt(0),
          sig1 = sig.charCodeAt(1),
          sig2 = sig.charCodeAt(2),
          sig3 = sig.charCodeAt(3),
          data = this.readData(4);
        return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
      };
      /**
       * @see DataReader.readData
       */
      ArrayReader.prototype.readData = function (size) {
        this.checkOffset(size);
        if (size === 0) {
          return [];
        }
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = ArrayReader;

    }, { "../utils": 32, "./DataReader": 18 }], 18: [function (require, module, exports) {
      "use strict";
      var utils = require("../utils");

      function DataReader(data) {
        this.data = data; // type : see implementation
        this.length = data.length;
        this.index = 0;
        this.zero = 0;
      }
      DataReader.prototype = {
        /**
         * Check that the offset will not go too far.
         * @param {string} offset the additional offset to check.
         * @throws {Error} an Error if the offset is out of bounds.
         */
        checkOffset: function (offset) {
          this.checkIndex(this.index + offset);
        },
        /**
         * Check that the specified index will not be too far.
         * @param {string} newIndex the index to check.
         * @throws {Error} an Error if the index is out of bounds.
         */
        checkIndex: function (newIndex) {
          if (this.length < this.zero + newIndex || newIndex < 0) {
            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + (newIndex) + "). Corrupted zip ?");
          }
        },
        /**
         * Change the index.
         * @param {number} newIndex The new index.
         * @throws {Error} if the new index is out of the data.
         */
        setIndex: function (newIndex) {
          this.checkIndex(newIndex);
          this.index = newIndex;
        },
        /**
         * Skip the next n bytes.
         * @param {number} n the number of bytes to skip.
         * @throws {Error} if the new index is out of the data.
         */
        skip: function (n) {
          this.setIndex(this.index + n);
        },
        /**
         * Get the byte at the specified index.
         * @param {number} i the index to use.
         * @return {number} a byte.
         */
        byteAt: function () {
          // see implementations
        },
        /**
         * Get the next number with a given byte size.
         * @param {number} size the number of bytes to read.
         * @return {number} the corresponding number.
         */
        readInt: function (size) {
          var result = 0,
            i;
          this.checkOffset(size);
          for (i = this.index + size - 1; i >= this.index; i--) {
            result = (result << 8) + this.byteAt(i);
          }
          this.index += size;
          return result;
        },
        /**
         * Get the next string with a given byte size.
         * @param {number} size the number of bytes to read.
         * @return {string} the corresponding string.
         */
        readString: function (size) {
          return utils.transformTo("string", this.readData(size));
        },
        /**
         * Get raw data without conversion, <size> bytes.
         * @param {number} size the number of bytes to read.
         * @return {Object} the raw data, implementation specific.
         */
        readData: function () {
          // see implementations
        },
        /**
         * Find the last occurrence of a zip signature (4 bytes).
         * @param {string} sig the signature to find.
         * @return {number} the index of the last occurrence, -1 if not found.
         */
        lastIndexOfSignature: function () {
          // see implementations
        },
        /**
         * Read the signature (4 bytes) at the current position and compare it with sig.
         * @param {string} sig the expected signature
         * @return {boolean} true if the signature matches, false otherwise.
         */
        readAndCheckSignature: function () {
          // see implementations
        },
        /**
         * Get the next date.
         * @return {Date} the date.
         */
        readDate: function () {
          var dostime = this.readInt(4);
          return new Date(Date.UTC(
            ((dostime >> 25) & 0x7f) + 1980, // year
            ((dostime >> 21) & 0x0f) - 1, // month
            (dostime >> 16) & 0x1f, // day
            (dostime >> 11) & 0x1f, // hour
            (dostime >> 5) & 0x3f, // minute
            (dostime & 0x1f) << 1)); // second
        }
      };
      module.exports = DataReader;

    }, { "../utils": 32 }], 19: [function (require, module, exports) {
      "use strict";
      var Uint8ArrayReader = require("./Uint8ArrayReader");
      var utils = require("../utils");

      function NodeBufferReader(data) {
        Uint8ArrayReader.call(this, data);
      }
      utils.inherits(NodeBufferReader, Uint8ArrayReader);

      /**
       * @see DataReader.readData
       */
      NodeBufferReader.prototype.readData = function (size) {
        this.checkOffset(size);
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = NodeBufferReader;

    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function (require, module, exports) {
      "use strict";
      var DataReader = require("./DataReader");
      var utils = require("../utils");

      function StringReader(data) {
        DataReader.call(this, data);
      }
      utils.inherits(StringReader, DataReader);
      /**
       * @see DataReader.byteAt
       */
      StringReader.prototype.byteAt = function (i) {
        return this.data.charCodeAt(this.zero + i);
      };
      /**
       * @see DataReader.lastIndexOfSignature
       */
      StringReader.prototype.lastIndexOfSignature = function (sig) {
        return this.data.lastIndexOf(sig) - this.zero;
      };
      /**
       * @see DataReader.readAndCheckSignature
       */
      StringReader.prototype.readAndCheckSignature = function (sig) {
        var data = this.readData(4);
        return sig === data;
      };
      /**
       * @see DataReader.readData
       */
      StringReader.prototype.readData = function (size) {
        this.checkOffset(size);
        // this will work because the constructor applied the "& 0xff" mask.
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = StringReader;

    }, { "../utils": 32, "./DataReader": 18 }], 21: [function (require, module, exports) {
      "use strict";
      var ArrayReader = require("./ArrayReader");
      var utils = require("../utils");

      function Uint8ArrayReader(data) {
        ArrayReader.call(this, data);
      }
      utils.inherits(Uint8ArrayReader, ArrayReader);
      /**
       * @see DataReader.readData
       */
      Uint8ArrayReader.prototype.readData = function (size) {
        this.checkOffset(size);
        if (size === 0) {
          // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
          return new Uint8Array(0);
        }
        var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = Uint8ArrayReader;

    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function (require, module, exports) {
      "use strict";

      var utils = require("../utils");
      var support = require("../support");
      var ArrayReader = require("./ArrayReader");
      var StringReader = require("./StringReader");
      var NodeBufferReader = require("./NodeBufferReader");
      var Uint8ArrayReader = require("./Uint8ArrayReader");

      /**
       * Create a reader adapted to the data.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
       * @return {DataReader} the data reader.
       */
      module.exports = function (data) {
        var type = utils.getTypeOf(data);
        utils.checkSupport(type);
        if (type === "string" && !support.uint8array) {
          return new StringReader(data);
        }
        if (type === "nodebuffer") {
          return new NodeBufferReader(data);
        }
        if (support.uint8array) {
          return new Uint8ArrayReader(utils.transformTo("uint8array", data));
        }
        return new ArrayReader(utils.transformTo("array", data));
      };

    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function (require, module, exports) {
      "use strict";
      exports.LOCAL_FILE_HEADER = "PK\x03\x04";
      exports.CENTRAL_FILE_HEADER = "PK\x01\x02";
      exports.CENTRAL_DIRECTORY_END = "PK\x05\x06";
      exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x06\x07";
      exports.ZIP64_CENTRAL_DIRECTORY_END = "PK\x06\x06";
      exports.DATA_DESCRIPTOR = "PK\x07\x08";

    }, {}], 24: [function (require, module, exports) {
      "use strict";

      var GenericWorker = require("./GenericWorker");
      var utils = require("../utils");

      /**
       * A worker which convert chunks to a specified type.
       * @constructor
       * @param {String} destType the destination type.
       */
      function ConvertWorker(destType) {
        GenericWorker.call(this, "ConvertWorker to " + destType);
        this.destType = destType;
      }
      utils.inherits(ConvertWorker, GenericWorker);

      /**
       * @see GenericWorker.processChunk
       */
      ConvertWorker.prototype.processChunk = function (chunk) {
        this.push({
          data: utils.transformTo(this.destType, chunk.data),
          meta: chunk.meta
        });
      };
      module.exports = ConvertWorker;

    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function (require, module, exports) {
      "use strict";

      var GenericWorker = require("./GenericWorker");
      var crc32 = require("../crc32");
      var utils = require("../utils");

      /**
       * A worker which calculate the crc32 of the data flowing through.
       * @constructor
       */
      function Crc32Probe() {
        GenericWorker.call(this, "Crc32Probe");
        this.withStreamInfo("crc32", 0);
      }
      utils.inherits(Crc32Probe, GenericWorker);

      /**
       * @see GenericWorker.processChunk
       */
      Crc32Probe.prototype.processChunk = function (chunk) {
        this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
        this.push(chunk);
      };
      module.exports = Crc32Probe;

    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function (require, module, exports) {
      "use strict";

      var utils = require("../utils");
      var GenericWorker = require("./GenericWorker");

      /**
       * A worker which calculate the total length of the data flowing through.
       * @constructor
       * @param {String} propName the name used to expose the length
       */
      function DataLengthProbe(propName) {
        GenericWorker.call(this, "DataLengthProbe for " + propName);
        this.propName = propName;
        this.withStreamInfo(propName, 0);
      }
      utils.inherits(DataLengthProbe, GenericWorker);

      /**
       * @see GenericWorker.processChunk
       */
      DataLengthProbe.prototype.processChunk = function (chunk) {
        if (chunk) {
          var length = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = length + chunk.data.length;
        }
        GenericWorker.prototype.processChunk.call(this, chunk);
      };
      module.exports = DataLengthProbe;


    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function (require, module, exports) {
      "use strict";

      var utils = require("../utils");
      var GenericWorker = require("./GenericWorker");

      // the size of the generated chunks
      // TODO expose this as a public variable
      var DEFAULT_BLOCK_SIZE = 16 * 1024;

      /**
       * A worker that reads a content and emits chunks.
       * @constructor
       * @param {Promise} dataP the promise of the data to split
       */
      function DataWorker(dataP) {
        GenericWorker.call(this, "DataWorker");
        var self = this;
        this.dataIsReady = false;
        this.index = 0;
        this.max = 0;
        this.data = null;
        this.type = "";

        this._tickScheduled = false;

        dataP.then(function (data) {
          self.dataIsReady = true;
          self.data = data;
          self.max = data && data.length || 0;
          self.type = utils.getTypeOf(data);
          if (!self.isPaused) {
            self._tickAndRepeat();
          }
        }, function (e) {
          self.error(e);
        });
      }

      utils.inherits(DataWorker, GenericWorker);

      /**
       * @see GenericWorker.cleanUp
       */
      DataWorker.prototype.cleanUp = function () {
        GenericWorker.prototype.cleanUp.call(this);
        this.data = null;
      };

      /**
       * @see GenericWorker.resume
       */
      DataWorker.prototype.resume = function () {
        if (!GenericWorker.prototype.resume.call(this)) {
          return false;
        }

        if (!this._tickScheduled && this.dataIsReady) {
          this._tickScheduled = true;
          utils.delay(this._tickAndRepeat, [], this);
        }
        return true;
      };

      /**
       * Trigger a tick a schedule an other call to this function.
       */
      DataWorker.prototype._tickAndRepeat = function () {
        this._tickScheduled = false;
        if (this.isPaused || this.isFinished) {
          return;
        }
        this._tick();
        if (!this.isFinished) {
          utils.delay(this._tickAndRepeat, [], this);
          this._tickScheduled = true;
        }
      };

      /**
       * Read and push a chunk.
       */
      DataWorker.prototype._tick = function () {

        if (this.isPaused || this.isFinished) {
          return false;
        }

        var size = DEFAULT_BLOCK_SIZE;
        var data = null, nextIndex = Math.min(this.max, this.index + size);
        if (this.index >= this.max) {
          // EOF
          return this.end();
        } else {
          switch (this.type) {
            case "string":
              data = this.data.substring(this.index, nextIndex);
              break;
            case "uint8array":
              data = this.data.subarray(this.index, nextIndex);
              break;
            case "array":
            case "nodebuffer":
              data = this.data.slice(this.index, nextIndex);
              break;
          }
          this.index = nextIndex;
          return this.push({
            data: data,
            meta: {
              percent: this.max ? this.index / this.max * 100 : 0
            }
          });
        }
      };

      module.exports = DataWorker;

    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function (require, module, exports) {
      "use strict";

      /**
       * A worker that does nothing but passing chunks to the next one. This is like
       * a nodejs stream but with some differences. On the good side :
       * - it works on IE 6-9 without any issue / polyfill
       * - it weights less than the full dependencies bundled with browserify
       * - it forwards errors (no need to declare an error handler EVERYWHERE)
       *
       * A chunk is an object with 2 attributes : `meta` and `data`. The former is an
       * object containing anything (`percent` for example), see each worker for more
       * details. The latter is the real data (String, Uint8Array, etc).
       *
       * @constructor
       * @param {String} name the name of the stream (mainly used for debugging purposes)
       */
      function GenericWorker(name) {
        // the name of the worker
        this.name = name || "default";
        // an object containing metadata about the workers chain
        this.streamInfo = {};
        // an error which happened when the worker was paused
        this.generatedError = null;
        // an object containing metadata to be merged by this worker into the general metadata
        this.extraStreamInfo = {};
        // true if the stream is paused (and should not do anything), false otherwise
        this.isPaused = true;
        // true if the stream is finished (and should not do anything), false otherwise
        this.isFinished = false;
        // true if the stream is locked to prevent further structure updates (pipe), false otherwise
        this.isLocked = false;
        // the event listeners
        this._listeners = {
          "data": [],
          "end": [],
          "error": []
        };
        // the previous worker, if any
        this.previous = null;
      }

      GenericWorker.prototype = {
        /**
         * Push a chunk to the next workers.
         * @param {Object} chunk the chunk to push
         */
        push: function (chunk) {
          this.emit("data", chunk);
        },
        /**
         * End the stream.
         * @return {Boolean} true if this call ended the worker, false otherwise.
         */
        end: function () {
          if (this.isFinished) {
            return false;
          }

          this.flush();
          try {
            this.emit("end");
            this.cleanUp();
            this.isFinished = true;
          } catch (e) {
            this.emit("error", e);
          }
          return true;
        },
        /**
         * End the stream with an error.
         * @param {Error} e the error which caused the premature end.
         * @return {Boolean} true if this call ended the worker with an error, false otherwise.
         */
        error: function (e) {
          if (this.isFinished) {
            return false;
          }

          if (this.isPaused) {
            this.generatedError = e;
          } else {
            this.isFinished = true;

            this.emit("error", e);

            // in the workers chain exploded in the middle of the chain,
            // the error event will go downward but we also need to notify
            // workers upward that there has been an error.
            if (this.previous) {
              this.previous.error(e);
            }

            this.cleanUp();
          }
          return true;
        },
        /**
         * Add a callback on an event.
         * @param {String} name the name of the event (data, end, error)
         * @param {Function} listener the function to call when the event is triggered
         * @return {GenericWorker} the current object for chainability
         */
        on: function (name, listener) {
          this._listeners[name].push(listener);
          return this;
        },
        /**
         * Clean any references when a worker is ending.
         */
        cleanUp: function () {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null;
          this._listeners = [];
        },
        /**
         * Trigger an event. This will call registered callback with the provided arg.
         * @param {String} name the name of the event (data, end, error)
         * @param {Object} arg the argument to call the callback with.
         */
        emit: function (name, arg) {
          if (this._listeners[name]) {
            for (var i = 0; i < this._listeners[name].length; i++) {
              this._listeners[name][i].call(this, arg);
            }
          }
        },
        /**
         * Chain a worker with an other.
         * @param {Worker} next the worker receiving events from the current one.
         * @return {worker} the next worker for chainability
         */
        pipe: function (next) {
          return next.registerPrevious(this);
        },
        /**
         * Same as `pipe` in the other direction.
         * Using an API with `pipe(next)` is very easy.
         * Implementing the API with the point of view of the next one registering
         * a source is easier, see the ZipFileWorker.
         * @param {Worker} previous the previous worker, sending events to this one
         * @return {Worker} the current worker for chainability
         */
        registerPrevious: function (previous) {
          if (this.isLocked) {
            throw new Error("The stream '" + this + "' has already been used.");
          }

          // sharing the streamInfo...
          this.streamInfo = previous.streamInfo;
          // ... and adding our own bits
          this.mergeStreamInfo();
          this.previous = previous;
          var self = this;
          previous.on("data", function (chunk) {
            self.processChunk(chunk);
          });
          previous.on("end", function () {
            self.end();
          });
          previous.on("error", function (e) {
            self.error(e);
          });
          return this;
        },
        /**
         * Pause the stream so it doesn't send events anymore.
         * @return {Boolean} true if this call paused the worker, false otherwise.
         */
        pause: function () {
          if (this.isPaused || this.isFinished) {
            return false;
          }
          this.isPaused = true;

          if (this.previous) {
            this.previous.pause();
          }
          return true;
        },
        /**
         * Resume a paused stream.
         * @return {Boolean} true if this call resumed the worker, false otherwise.
         */
        resume: function () {
          if (!this.isPaused || this.isFinished) {
            return false;
          }
          this.isPaused = false;

          // if true, the worker tried to resume but failed
          var withError = false;
          if (this.generatedError) {
            this.error(this.generatedError);
            withError = true;
          }
          if (this.previous) {
            this.previous.resume();
          }

          return !withError;
        },
        /**
         * Flush any remaining bytes as the stream is ending.
         */
        flush: function () { },
        /**
         * Process a chunk. This is usually the method overridden.
         * @param {Object} chunk the chunk to process.
         */
        processChunk: function (chunk) {
          this.push(chunk);
        },
        /**
         * Add a key/value to be added in the workers chain streamInfo once activated.
         * @param {String} key the key to use
         * @param {Object} value the associated value
         * @return {Worker} the current worker for chainability
         */
        withStreamInfo: function (key, value) {
          this.extraStreamInfo[key] = value;
          this.mergeStreamInfo();
          return this;
        },
        /**
         * Merge this worker's streamInfo into the chain's streamInfo.
         */
        mergeStreamInfo: function () {
          for (var key in this.extraStreamInfo) {
            if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key)) {
              continue;
            }
            this.streamInfo[key] = this.extraStreamInfo[key];
          }
        },

        /**
         * Lock the stream to prevent further updates on the workers chain.
         * After calling this method, all calls to pipe will fail.
         */
        lock: function () {
          if (this.isLocked) {
            throw new Error("The stream '" + this + "' has already been used.");
          }
          this.isLocked = true;
          if (this.previous) {
            this.previous.lock();
          }
        },

        /**
         *
         * Pretty print the workers chain.
         */
        toString: function () {
          var me = "Worker " + this.name;
          if (this.previous) {
            return this.previous + " -> " + me;
          } else {
            return me;
          }
        }
      };

      module.exports = GenericWorker;

    }, {}], 29: [function (require, module, exports) {
      "use strict";

      var utils = require("../utils");
      var ConvertWorker = require("./ConvertWorker");
      var GenericWorker = require("./GenericWorker");
      var base64 = require("../base64");
      var support = require("../support");
      var external = require("../external");

      var NodejsStreamOutputAdapter = null;
      if (support.nodestream) {
        try {
          NodejsStreamOutputAdapter = require("../nodejs/NodejsStreamOutputAdapter");
        } catch (e) {
          // ignore
        }
      }

      /**
       * Apply the final transformation of the data. If the user wants a Blob for
       * example, it's easier to work with an U8intArray and finally do the
       * ArrayBuffer/Blob conversion.
       * @param {String} type the name of the final type
       * @param {String|Uint8Array|Buffer} content the content to transform
       * @param {String} mimeType the mime type of the content, if applicable.
       * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.
       */
      function transformZipOutput(type, content, mimeType) {
        switch (type) {
          case "blob":
            return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
          case "base64":
            return base64.encode(content);
          default:
            return utils.transformTo(type, content);
        }
      }

      /**
       * Concatenate an array of data of the given type.
       * @param {String} type the type of the data in the given array.
       * @param {Array} dataArray the array containing the data chunks to concatenate
       * @return {String|Uint8Array|Buffer} the concatenated data
       * @throws Error if the asked type is unsupported
       */
      function concat(type, dataArray) {
        var i, index = 0, res = null, totalLength = 0;
        for (i = 0; i < dataArray.length; i++) {
          totalLength += dataArray[i].length;
        }
        switch (type) {
          case "string":
            return dataArray.join("");
          case "array":
            return Array.prototype.concat.apply([], dataArray);
          case "uint8array":
            res = new Uint8Array(totalLength);
            for (i = 0; i < dataArray.length; i++) {
              res.set(dataArray[i], index);
              index += dataArray[i].length;
            }
            return res;
          case "nodebuffer":
            return Buffer.concat(dataArray);
          default:
            throw new Error("concat : unsupported type '" + type + "'");
        }
      }

      /**
       * Listen a StreamHelper, accumulate its content and concatenate it into a
       * complete block.
       * @param {StreamHelper} helper the helper to use.
       * @param {Function} updateCallback a callback called on each update. Called
       * with one arg :
       * - the metadata linked to the update received.
       * @return Promise the promise for the accumulation.
       */
      function accumulate(helper, updateCallback) {
        return new external.Promise(function (resolve, reject) {
          var dataArray = [];
          var chunkType = helper._internalType,
            resultType = helper._outputType,
            mimeType = helper._mimeType;
          helper
            .on("data", function (data, meta) {
              dataArray.push(data);
              if (updateCallback) {
                updateCallback(meta);
              }
            })
            .on("error", function (err) {
              dataArray = [];
              reject(err);
            })
            .on("end", function () {
              try {
                var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
                resolve(result);
              } catch (e) {
                reject(e);
              }
              dataArray = [];
            })
            .resume();
        });
      }

      /**
       * An helper to easily use workers outside of JSZip.
       * @constructor
       * @param {Worker} worker the worker to wrap
       * @param {String} outputType the type of data expected by the use
       * @param {String} mimeType the mime type of the content, if applicable.
       */
      function StreamHelper(worker, outputType, mimeType) {
        var internalType = outputType;
        switch (outputType) {
          case "blob":
          case "arraybuffer":
            internalType = "uint8array";
            break;
          case "base64":
            internalType = "string";
            break;
        }

        try {
          // the type used internally
          this._internalType = internalType;
          // the type used to output results
          this._outputType = outputType;
          // the mime type
          this._mimeType = mimeType;
          utils.checkSupport(internalType);
          this._worker = worker.pipe(new ConvertWorker(internalType));
          // the last workers can be rewired without issues but we need to
          // prevent any updates on previous workers.
          worker.lock();
        } catch (e) {
          this._worker = new GenericWorker("error");
          this._worker.error(e);
        }
      }

      StreamHelper.prototype = {
        /**
         * Listen a StreamHelper, accumulate its content and concatenate it into a
         * complete block.
         * @param {Function} updateCb the update callback.
         * @return Promise the promise for the accumulation.
         */
        accumulate: function (updateCb) {
          return accumulate(this, updateCb);
        },
        /**
         * Add a listener on an event triggered on a stream.
         * @param {String} evt the name of the event
         * @param {Function} fn the listener
         * @return {StreamHelper} the current helper.
         */
        on: function (evt, fn) {
          var self = this;

          if (evt === "data") {
            this._worker.on(evt, function (chunk) {
              fn.call(self, chunk.data, chunk.meta);
            });
          } else {
            this._worker.on(evt, function () {
              utils.delay(fn, arguments, self);
            });
          }
          return this;
        },
        /**
         * Resume the flow of chunks.
         * @return {StreamHelper} the current helper.
         */
        resume: function () {
          utils.delay(this._worker.resume, [], this._worker);
          return this;
        },
        /**
         * Pause the flow of chunks.
         * @return {StreamHelper} the current helper.
         */
        pause: function () {
          this._worker.pause();
          return this;
        },
        /**
         * Return a nodejs stream for this helper.
         * @param {Function} updateCb the update callback.
         * @return {NodejsStreamOutputAdapter} the nodejs stream.
         */
        toNodejsStream: function (updateCb) {
          utils.checkSupport("nodestream");
          if (this._outputType !== "nodebuffer") {
            // an object stream containing blob/arraybuffer/uint8array/string
            // is strange and I don't know if it would be useful.
            // I you find this comment and have a good usecase, please open a
            // bug report !
            throw new Error(this._outputType + " is not supported by this method");
          }

          return new NodejsStreamOutputAdapter(this, {
            objectMode: this._outputType !== "nodebuffer"
          }, updateCb);
        }
      };


      module.exports = StreamHelper;

    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function (require, module, exports) {
      "use strict";

      exports.base64 = true;
      exports.array = true;
      exports.string = true;
      exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
      exports.nodebuffer = typeof Buffer !== "undefined";
      // contains true if JSZip can read/generate Uint8Array, false otherwise.
      exports.uint8array = typeof Uint8Array !== "undefined";

      if (typeof ArrayBuffer === "undefined") {
        exports.blob = false;
      }
      else {
        var buffer = new ArrayBuffer(0);
        try {
          exports.blob = new Blob([buffer], {
            type: "application/zip"
          }).size === 0;
        }
        catch (e) {
          try {
            var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
            var builder = new Builder();
            builder.append(buffer);
            exports.blob = builder.getBlob("application/zip").size === 0;
          }
          catch (e) {
            exports.blob = false;
          }
        }
      }

      try {
        exports.nodestream = !!require("readable-stream").Readable;
      } catch (e) {
        exports.nodestream = false;
      }

    }, { "readable-stream": 16 }], 31: [function (require, module, exports) {
      "use strict";

      var utils = require("./utils");
      var support = require("./support");
      var nodejsUtils = require("./nodejsUtils");
      var GenericWorker = require("./stream/GenericWorker");

      /**
       * The following functions come from pako, from pako/lib/utils/strings
       * released under the MIT license, see pako https://github.com/nodeca/pako/
       */

      // Table with utf8 lengths (calculated by first byte of sequence)
      // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
      // because max possible codepoint is 0x10ffff
      var _utf8len = new Array(256);
      for (var i = 0; i < 256; i++) {
        _utf8len[i] = (i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1);
      }
      _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start

      // convert string to array (typed, when possible)
      var string2buf = function (str) {
        var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

        // count binary size
        for (m_pos = 0; m_pos < str_len; m_pos++) {
          c = str.charCodeAt(m_pos);
          if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
              c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
              m_pos++;
            }
          }
          buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
        }

        // allocate buffer
        if (support.uint8array) {
          buf = new Uint8Array(buf_len);
        } else {
          buf = new Array(buf_len);
        }

        // convert
        for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
          c = str.charCodeAt(m_pos);
          if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
              c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
              m_pos++;
            }
          }
          if (c < 0x80) {
            /* one byte */
            buf[i++] = c;
          } else if (c < 0x800) {
            /* two bytes */
            buf[i++] = 0xC0 | (c >>> 6);
            buf[i++] = 0x80 | (c & 0x3f);
          } else if (c < 0x10000) {
            /* three bytes */
            buf[i++] = 0xE0 | (c >>> 12);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
          } else {
            /* four bytes */
            buf[i++] = 0xf0 | (c >>> 18);
            buf[i++] = 0x80 | (c >>> 12 & 0x3f);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
          }
        }

        return buf;
      };

      // Calculate max possible position in utf8 buffer,
      // that will not break sequence. If that's not possible
      // - (very small limits) return max size as is.
      //
      // buf[] - utf8 bytes array
      // max   - length limit (mandatory);
      var utf8border = function (buf, max) {
        var pos;

        max = max || buf.length;
        if (max > buf.length) { max = buf.length; }

        // go back from last position, until start of sequence found
        pos = max - 1;
        while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

        // Fuckup - very small and broken sequence,
        // return max, because we should return something anyway.
        if (pos < 0) { return max; }

        // If we came to start of buffer - that means vuffer is too small,
        // return max too.
        if (pos === 0) { return max; }

        return (pos + _utf8len[buf[pos]] > max) ? pos : max;
      };

      // convert array to string
      var buf2string = function (buf) {
        var i, out, c, c_len;
        var len = buf.length;

        // Reserve max possible length (2 words per char)
        // NB: by unknown reasons, Array is significantly faster for
        //     String.fromCharCode.apply than Uint16Array.
        var utf16buf = new Array(len * 2);

        for (out = 0, i = 0; i < len;) {
          c = buf[i++];
          // quick process ascii
          if (c < 0x80) { utf16buf[out++] = c; continue; }

          c_len = _utf8len[c];
          // skip 5 & 6 byte codes
          if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

          // apply mask on first byte
          c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
          // join the rest
          while (c_len > 1 && i < len) {
            c = (c << 6) | (buf[i++] & 0x3f);
            c_len--;
          }

          // terminated by end of string?
          if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

          if (c < 0x10000) {
            utf16buf[out++] = c;
          } else {
            c -= 0x10000;
            utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
            utf16buf[out++] = 0xdc00 | (c & 0x3ff);
          }
        }

        // shrinkBuf(utf16buf, out)
        if (utf16buf.length !== out) {
          if (utf16buf.subarray) {
            utf16buf = utf16buf.subarray(0, out);
          } else {
            utf16buf.length = out;
          }
        }

        // return String.fromCharCode.apply(null, utf16buf);
        return utils.applyFromCharCode(utf16buf);
      };


      // That's all for the pako functions.


      /**
       * Transform a javascript string into an array (typed if possible) of bytes,
       * UTF-8 encoded.
       * @param {String} str the string to encode
       * @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
       */
      exports.utf8encode = function utf8encode(str) {
        if (support.nodebuffer) {
          return nodejsUtils.newBufferFrom(str, "utf-8");
        }

        return string2buf(str);
      };


      /**
       * Transform a bytes array (or a representation) representing an UTF-8 encoded
       * string into a javascript string.
       * @param {Array|Uint8Array|Buffer} buf the data de decode
       * @return {String} the decoded string.
       */
      exports.utf8decode = function utf8decode(buf) {
        if (support.nodebuffer) {
          return utils.transformTo("nodebuffer", buf).toString("utf-8");
        }

        buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);

        return buf2string(buf);
      };

      /**
       * A worker to decode utf8 encoded binary chunks into string chunks.
       * @constructor
       */
      function Utf8DecodeWorker() {
        GenericWorker.call(this, "utf-8 decode");
        // the last bytes if a chunk didn't end with a complete codepoint.
        this.leftOver = null;
      }
      utils.inherits(Utf8DecodeWorker, GenericWorker);

      /**
       * @see GenericWorker.processChunk
       */
      Utf8DecodeWorker.prototype.processChunk = function (chunk) {

        var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);

        // 1st step, re-use what's left of the previous chunk
        if (this.leftOver && this.leftOver.length) {
          if (support.uint8array) {
            var previousData = data;
            data = new Uint8Array(previousData.length + this.leftOver.length);
            data.set(this.leftOver, 0);
            data.set(previousData, this.leftOver.length);
          } else {
            data = this.leftOver.concat(data);
          }
          this.leftOver = null;
        }

        var nextBoundary = utf8border(data);
        var usableData = data;
        if (nextBoundary !== data.length) {
          if (support.uint8array) {
            usableData = data.subarray(0, nextBoundary);
            this.leftOver = data.subarray(nextBoundary, data.length);
          } else {
            usableData = data.slice(0, nextBoundary);
            this.leftOver = data.slice(nextBoundary, data.length);
          }
        }

        this.push({
          data: exports.utf8decode(usableData),
          meta: chunk.meta
        });
      };

      /**
       * @see GenericWorker.flush
       */
      Utf8DecodeWorker.prototype.flush = function () {
        if (this.leftOver && this.leftOver.length) {
          this.push({
            data: exports.utf8decode(this.leftOver),
            meta: {}
          });
          this.leftOver = null;
        }
      };
      exports.Utf8DecodeWorker = Utf8DecodeWorker;

      /**
       * A worker to endcode string chunks into utf8 encoded binary chunks.
       * @constructor
       */
      function Utf8EncodeWorker() {
        GenericWorker.call(this, "utf-8 encode");
      }
      utils.inherits(Utf8EncodeWorker, GenericWorker);

      /**
       * @see GenericWorker.processChunk
       */
      Utf8EncodeWorker.prototype.processChunk = function (chunk) {
        this.push({
          data: exports.utf8encode(chunk.data),
          meta: chunk.meta
        });
      };
      exports.Utf8EncodeWorker = Utf8EncodeWorker;

    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function (require, module, exports) {
      "use strict";

      var support = require("./support");
      var base64 = require("./base64");
      var nodejsUtils = require("./nodejsUtils");
      var external = require("./external");
      require("setimmediate");


      /**
       * Convert a string that pass as a "binary string": it should represent a byte
       * array but may have > 255 char codes. Be sure to take only the first byte
       * and returns the byte array.
       * @param {String} str the string to transform.
       * @return {Array|Uint8Array} the string in a binary format.
       */
      function string2binary(str) {
        var result = null;
        if (support.uint8array) {
          result = new Uint8Array(str.length);
        } else {
          result = new Array(str.length);
        }
        return stringToArrayLike(str, result);
      }

      /**
       * Create a new blob with the given content and the given type.
       * @param {String|ArrayBuffer} part the content to put in the blob. DO NOT use
       * an Uint8Array because the stock browser of android 4 won't accept it (it
       * will be silently converted to a string, "[object Uint8Array]").
       *
       * Use only ONE part to build the blob to avoid a memory leak in IE11 / Edge:
       * when a large amount of Array is used to create the Blob, the amount of
       * memory consumed is nearly 100 times the original data amount.
       *
       * @param {String} type the mime type of the blob.
       * @return {Blob} the created blob.
       */
      exports.newBlob = function (part, type) {
        exports.checkSupport("blob");

        try {
          // Blob constructor
          return new Blob([part], {
            type: type
          });
        }
        catch (e) {

          try {
            // deprecated, browser only, old way
            var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
            var builder = new Builder();
            builder.append(part);
            return builder.getBlob(type);
          }
          catch (e) {

            // well, fuck ?!
            throw new Error("Bug : can't construct the Blob.");
          }
        }


      };
      /**
       * The identity function.
       * @param {Object} input the input.
       * @return {Object} the same input.
       */
      function identity(input) {
        return input;
      }

      /**
       * Fill in an array with a string.
       * @param {String} str the string to use.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
       * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
       */
      function stringToArrayLike(str, array) {
        for (var i = 0; i < str.length; ++i) {
          array[i] = str.charCodeAt(i) & 0xFF;
        }
        return array;
      }

      /**
       * An helper for the function arrayLikeToString.
       * This contains static information and functions that
       * can be optimized by the browser JIT compiler.
       */
      var arrayToStringHelper = {
        /**
         * Transform an array of int into a string, chunk by chunk.
         * See the performances notes on arrayLikeToString.
         * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
         * @param {String} type the type of the array.
         * @param {Integer} chunk the chunk size.
         * @return {String} the resulting string.
         * @throws Error if the chunk is too big for the stack.
         */
        stringifyByChunk: function (array, type, chunk) {
          var result = [], k = 0, len = array.length;
          // shortcut
          if (len <= chunk) {
            return String.fromCharCode.apply(null, array);
          }
          while (k < len) {
            if (type === "array" || type === "nodebuffer") {
              result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
            }
            else {
              result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
            }
            k += chunk;
          }
          return result.join("");
        },
        /**
         * Call String.fromCharCode on every item in the array.
         * This is the naive implementation, which generate A LOT of intermediate string.
         * This should be used when everything else fail.
         * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
         * @return {String} the result.
         */
        stringifyByChar: function (array) {
          var resultStr = "";
          for (var i = 0; i < array.length; i++) {
            resultStr += String.fromCharCode(array[i]);
          }
          return resultStr;
        },
        applyCanBeUsed: {
          /**
           * true if the browser accepts to use String.fromCharCode on Uint8Array
           */
          uint8array: (function () {
            try {
              return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
            } catch (e) {
              return false;
            }
          })(),
          /**
           * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
           */
          nodebuffer: (function () {
            try {
              return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
            } catch (e) {
              return false;
            }
          })()
        }
      };

      /**
       * Transform an array-like object to a string.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @return {String} the result.
       */
      function arrayLikeToString(array) {
        // Performances notes :
        // --------------------
        // String.fromCharCode.apply(null, array) is the fastest, see
        // see http://jsperf.com/converting-a-uint8array-to-a-string/2
        // but the stack is limited (and we can get huge arrays !).
        //
        // result += String.fromCharCode(array[i]); generate too many strings !
        //
        // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2
        // TODO : we now have workers that split the work. Do we still need that ?
        var chunk = 65536,
          type = exports.getTypeOf(array),
          canUseApply = true;
        if (type === "uint8array") {
          canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
        } else if (type === "nodebuffer") {
          canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
        }

        if (canUseApply) {
          while (chunk > 1) {
            try {
              return arrayToStringHelper.stringifyByChunk(array, type, chunk);
            } catch (e) {
              chunk = Math.floor(chunk / 2);
            }
          }
        }

        // no apply or chunk error : slow and painful algorithm
        // default browser on android 4.*
        return arrayToStringHelper.stringifyByChar(array);
      }

      exports.applyFromCharCode = arrayLikeToString;


      /**
       * Copy the data from an array-like to an other array-like.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
       * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
       */
      function arrayLikeToArrayLike(arrayFrom, arrayTo) {
        for (var i = 0; i < arrayFrom.length; i++) {
          arrayTo[i] = arrayFrom[i];
        }
        return arrayTo;
      }

      // a matrix containing functions to transform everything into everything.
      var transform = {};

      // string to ?
      transform["string"] = {
        "string": identity,
        "array": function (input) {
          return stringToArrayLike(input, new Array(input.length));
        },
        "arraybuffer": function (input) {
          return transform["string"]["uint8array"](input).buffer;
        },
        "uint8array": function (input) {
          return stringToArrayLike(input, new Uint8Array(input.length));
        },
        "nodebuffer": function (input) {
          return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
        }
      };

      // array to ?
      transform["array"] = {
        "string": arrayLikeToString,
        "array": identity,
        "arraybuffer": function (input) {
          return (new Uint8Array(input)).buffer;
        },
        "uint8array": function (input) {
          return new Uint8Array(input);
        },
        "nodebuffer": function (input) {
          return nodejsUtils.newBufferFrom(input);
        }
      };

      // arraybuffer to ?
      transform["arraybuffer"] = {
        "string": function (input) {
          return arrayLikeToString(new Uint8Array(input));
        },
        "array": function (input) {
          return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
        },
        "arraybuffer": identity,
        "uint8array": function (input) {
          return new Uint8Array(input);
        },
        "nodebuffer": function (input) {
          return nodejsUtils.newBufferFrom(new Uint8Array(input));
        }
      };

      // uint8array to ?
      transform["uint8array"] = {
        "string": arrayLikeToString,
        "array": function (input) {
          return arrayLikeToArrayLike(input, new Array(input.length));
        },
        "arraybuffer": function (input) {
          return input.buffer;
        },
        "uint8array": identity,
        "nodebuffer": function (input) {
          return nodejsUtils.newBufferFrom(input);
        }
      };

      // nodebuffer to ?
      transform["nodebuffer"] = {
        "string": arrayLikeToString,
        "array": function (input) {
          return arrayLikeToArrayLike(input, new Array(input.length));
        },
        "arraybuffer": function (input) {
          return transform["nodebuffer"]["uint8array"](input).buffer;
        },
        "uint8array": function (input) {
          return arrayLikeToArrayLike(input, new Uint8Array(input.length));
        },
        "nodebuffer": identity
      };

      /**
       * Transform an input into any type.
       * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
       * If no output type is specified, the unmodified input will be returned.
       * @param {String} outputType the output type.
       * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
       * @throws {Error} an Error if the browser doesn't support the requested output type.
       */
      exports.transformTo = function (outputType, input) {
        if (!input) {
          // undefined, null, etc
          // an empty string won't harm.
          input = "";
        }
        if (!outputType) {
          return input;
        }
        exports.checkSupport(outputType);
        var inputType = exports.getTypeOf(input);
        var result = transform[inputType][outputType](input);
        return result;
      };

      /**
       * Resolve all relative path components, "." and "..", in a path. If these relative components
       * traverse above the root then the resulting path will only contain the final path component.
       *
       * All empty components, e.g. "//", are removed.
       * @param {string} path A path with / or \ separators
       * @returns {string} The path with all relative path components resolved.
       */
      exports.resolve = function (path) {
        var parts = path.split("/");
        var result = [];
        for (var index = 0; index < parts.length; index++) {
          var part = parts[index];
          // Allow the first and last component to be empty for trailing slashes.
          if (part === "." || (part === "" && index !== 0 && index !== parts.length - 1)) {
            continue;
          } else if (part === "..") {
            result.pop();
          } else {
            result.push(part);
          }
        }
        return result.join("/");
      };

      /**
       * Return the type of the input.
       * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
       * @param {Object} input the input to identify.
       * @return {String} the (lowercase) type of the input.
       */
      exports.getTypeOf = function (input) {
        if (typeof input === "string") {
          return "string";
        }
        if (Object.prototype.toString.call(input) === "[object Array]") {
          return "array";
        }
        if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
          return "nodebuffer";
        }
        if (support.uint8array && input instanceof Uint8Array) {
          return "uint8array";
        }
        if (support.arraybuffer && input instanceof ArrayBuffer) {
          return "arraybuffer";
        }
      };

      /**
       * Throw an exception if the type is not supported.
       * @param {String} type the type to check.
       * @throws {Error} an Error if the browser doesn't support the requested type.
       */
      exports.checkSupport = function (type) {
        var supported = support[type.toLowerCase()];
        if (!supported) {
          throw new Error(type + " is not supported by this platform");
        }
      };

      exports.MAX_VALUE_16BITS = 65535;
      exports.MAX_VALUE_32BITS = -1; // well, "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF" is parsed as -1

      /**
       * Prettify a string read as binary.
       * @param {string} str the string to prettify.
       * @return {string} a pretty string.
       */
      exports.pretty = function (str) {
        var res = "",
          code, i;
        for (i = 0; i < (str || "").length; i++) {
          code = str.charCodeAt(i);
          res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
        }
        return res;
      };

      /**
       * Defer the call of a function.
       * @param {Function} callback the function to call asynchronously.
       * @param {Array} args the arguments to give to the callback.
       */
      exports.delay = function (callback, args, self) {
        setImmediate(function () {
          callback.apply(self || null, args || []);
        });
      };

      /**
       * Extends a prototype with an other, without calling a constructor with
       * side effects. Inspired by nodejs' `utils.inherits`
       * @param {Function} ctor the constructor to augment
       * @param {Function} superCtor the parent constructor to use
       */
      exports.inherits = function (ctor, superCtor) {
        var Obj = function () { };
        Obj.prototype = superCtor.prototype;
        ctor.prototype = new Obj();
      };

      /**
       * Merge the objects passed as parameters into a new one.
       * @private
       * @param {...Object} var_args All objects to merge.
       * @return {Object} a new object with the data of the others.
       */
      exports.extend = function () {
        var result = {}, i, attr;
        for (i = 0; i < arguments.length; i++) { // arguments is not enumerable in some browsers
          for (attr in arguments[i]) {
            if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") {
              result[attr] = arguments[i][attr];
            }
          }
        }
        return result;
      };

      /**
       * Transform arbitrary content into a Promise.
       * @param {String} name a name for the content being processed.
       * @param {Object} inputData the content to process.
       * @param {Boolean} isBinary true if the content is not an unicode string
       * @param {Boolean} isOptimizedBinaryString true if the string content only has one byte per character.
       * @param {Boolean} isBase64 true if the string content is encoded with base64.
       * @return {Promise} a promise in a format usable by JSZip.
       */
      exports.prepareContent = function (name, inputData, isBinary, isOptimizedBinaryString, isBase64) {

        // if inputData is already a promise, this flatten it.
        var promise = external.Promise.resolve(inputData).then(function (data) {


          var isBlob = support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1);

          if (isBlob && typeof FileReader !== "undefined") {
            return new external.Promise(function (resolve, reject) {
              var reader = new FileReader();

              reader.onload = function (e) {
                resolve(e.target.result);
              };
              reader.onerror = function (e) {
                reject(e.target.error);
              };
              reader.readAsArrayBuffer(data);
            });
          } else {
            return data;
          }
        });

        return promise.then(function (data) {
          var dataType = exports.getTypeOf(data);

          if (!dataType) {
            return external.Promise.reject(
              new Error("Can't read the data of '" + name + "'. Is it " +
                "in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
            );
          }
          // special case : it's way easier to work with Uint8Array than with ArrayBuffer
          if (dataType === "arraybuffer") {
            data = exports.transformTo("uint8array", data);
          } else if (dataType === "string") {
            if (isBase64) {
              data = base64.decode(data);
            }
            else if (isBinary) {
              // optimizedBinaryString === true means that the file has already been filtered with a 0xFF mask
              if (isOptimizedBinaryString !== true) {
                // this is a string, not in a base64 format.
                // Be sure that this is a correct "binary string"
                data = string2binary(data);
              }
            }
          }
          return data;
        });
      };

    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, "setimmediate": 54 }], 33: [function (require, module, exports) {
      "use strict";
      var readerFor = require("./reader/readerFor");
      var utils = require("./utils");
      var sig = require("./signature");
      var ZipEntry = require("./zipEntry");
      var support = require("./support");
      //  class ZipEntries {{{
      /**
       * All the entries in the zip file.
       * @constructor
       * @param {Object} loadOptions Options for loading the stream.
       */
      function ZipEntries(loadOptions) {
        this.files = [];
        this.loadOptions = loadOptions;
      }
      ZipEntries.prototype = {
        /**
         * Check that the reader is on the specified signature.
         * @param {string} expectedSignature the expected signature.
         * @throws {Error} if it is an other signature.
         */
        checkSignature: function (expectedSignature) {
          if (!this.reader.readAndCheckSignature(expectedSignature)) {
            this.reader.index -= 4;
            var signature = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature " + "(" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
          }
        },
        /**
         * Check if the given signature is at the given index.
         * @param {number} askedIndex the index to check.
         * @param {string} expectedSignature the signature to expect.
         * @return {boolean} true if the signature is here, false otherwise.
         */
        isSignature: function (askedIndex, expectedSignature) {
          var currentIndex = this.reader.index;
          this.reader.setIndex(askedIndex);
          var signature = this.reader.readString(4);
          var result = signature === expectedSignature;
          this.reader.setIndex(currentIndex);
          return result;
        },
        /**
         * Read the end of the central directory.
         */
        readBlockEndOfCentral: function () {
          this.diskNumber = this.reader.readInt(2);
          this.diskWithCentralDirStart = this.reader.readInt(2);
          this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
          this.centralDirRecords = this.reader.readInt(2);
          this.centralDirSize = this.reader.readInt(4);
          this.centralDirOffset = this.reader.readInt(4);

          this.zipCommentLength = this.reader.readInt(2);
          // warning : the encoding depends of the system locale
          // On a linux machine with LANG=en_US.utf8, this field is utf8 encoded.
          // On a windows machine, this field is encoded with the localized windows code page.
          var zipComment = this.reader.readData(this.zipCommentLength);
          var decodeParamType = support.uint8array ? "uint8array" : "array";
          // To get consistent behavior with the generation part, we will assume that
          // this is utf8 encoded unless specified otherwise.
          var decodeContent = utils.transformTo(decodeParamType, zipComment);
          this.zipComment = this.loadOptions.decodeFileName(decodeContent);
        },
        /**
         * Read the end of the Zip 64 central directory.
         * Not merged with the method readEndOfCentral :
         * The end of central can coexist with its Zip64 brother,
         * I don't want to read the wrong number of bytes !
         */
        readBlockZip64EndOfCentral: function () {
          this.zip64EndOfCentralSize = this.reader.readInt(8);
          this.reader.skip(4);
          // this.versionMadeBy = this.reader.readString(2);
          // this.versionNeeded = this.reader.readInt(2);
          this.diskNumber = this.reader.readInt(4);
          this.diskWithCentralDirStart = this.reader.readInt(4);
          this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
          this.centralDirRecords = this.reader.readInt(8);
          this.centralDirSize = this.reader.readInt(8);
          this.centralDirOffset = this.reader.readInt(8);

          this.zip64ExtensibleData = {};
          var extraDataSize = this.zip64EndOfCentralSize - 44,
            index = 0,
            extraFieldId,
            extraFieldLength,
            extraFieldValue;
          while (index < extraDataSize) {
            extraFieldId = this.reader.readInt(2);
            extraFieldLength = this.reader.readInt(4);
            extraFieldValue = this.reader.readData(extraFieldLength);
            this.zip64ExtensibleData[extraFieldId] = {
              id: extraFieldId,
              length: extraFieldLength,
              value: extraFieldValue
            };
          }
        },
        /**
         * Read the end of the Zip 64 central directory locator.
         */
        readBlockZip64EndOfCentralLocator: function () {
          this.diskWithZip64CentralDirStart = this.reader.readInt(4);
          this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
          this.disksCount = this.reader.readInt(4);
          if (this.disksCount > 1) {
            throw new Error("Multi-volumes zip are not supported");
          }
        },
        /**
         * Read the local files, based on the offset read in the central part.
         */
        readLocalFiles: function () {
          var i, file;
          for (i = 0; i < this.files.length; i++) {
            file = this.files[i];
            this.reader.setIndex(file.localHeaderOffset);
            this.checkSignature(sig.LOCAL_FILE_HEADER);
            file.readLocalPart(this.reader);
            file.handleUTF8();
            file.processAttributes();
          }
        },
        /**
         * Read the central directory.
         */
        readCentralDir: function () {
          var file;

          this.reader.setIndex(this.centralDirOffset);
          while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
            file = new ZipEntry({
              zip64: this.zip64
            }, this.loadOptions);
            file.readCentralPart(this.reader);
            this.files.push(file);
          }

          if (this.centralDirRecords !== this.files.length) {
            if (this.centralDirRecords !== 0 && this.files.length === 0) {
              // We expected some records but couldn't find ANY.
              // This is really suspicious, as if something went wrong.
              throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
            } else {
              // We found some records but not all.
              // Something is wrong but we got something for the user: no error here.
              // console.warn("expected", this.centralDirRecords, "records in central dir, got", this.files.length);
            }
          }
        },
        /**
         * Read the end of central directory.
         */
        readEndOfCentral: function () {
          var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
          if (offset < 0) {
            // Check if the content is a truncated zip or complete garbage.
            // A "LOCAL_FILE_HEADER" is not required at the beginning (auto
            // extractible zip for example) but it can give a good hint.
            // If an ajax request was used without responseType, we will also
            // get unreadable data.
            var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);

            if (isGarbage) {
              throw new Error("Can't find end of central directory : is this a zip file ? " +
                "If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
            } else {
              throw new Error("Corrupted zip: can't find end of central directory");
            }

          }
          this.reader.setIndex(offset);
          var endOfCentralDirOffset = offset;
          this.checkSignature(sig.CENTRAL_DIRECTORY_END);
          this.readBlockEndOfCentral();


          /* extract from the zip spec :
              4)  If one of the fields in the end of central directory
                  record is too small to hold required data, the field
                  should be set to -1 (0xFFFF or 0xFFFFFFFF) and the
                  ZIP64 format record should be created.
              5)  The end of central directory record and the
                  Zip64 end of central directory locator record must
                  reside on the same disk when splitting or spanning
                  an archive.
           */
          if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
            this.zip64 = true;

            /*
            Warning : the zip64 extension is supported, but ONLY if the 64bits integer read from
            the zip file can fit into a 32bits integer. This cannot be solved : JavaScript represents
            all numbers as 64-bit double precision IEEE 754 floating point numbers.
            So, we have 53bits for integers and bitwise operations treat everything as 32bits.
            see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators
            and http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf section 8.5
            */

            // should look for a zip64 EOCD locator
            offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            if (offset < 0) {
              throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            }
            this.reader.setIndex(offset);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            this.readBlockZip64EndOfCentralLocator();

            // now the zip64 EOCD record
            if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
              // console.warn("ZIP64 end of central directory not where expected.");
              this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
              if (this.relativeOffsetEndOfZip64CentralDir < 0) {
                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
              }
            }
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
            this.readBlockZip64EndOfCentral();
          }

          var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
          if (this.zip64) {
            expectedEndOfCentralDirOffset += 20; // end of central dir 64 locator
            expectedEndOfCentralDirOffset += 12 /* should not include the leading 12 bytes */ + this.zip64EndOfCentralSize;
          }

          var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;

          if (extraBytes > 0) {
            // console.warn(extraBytes, "extra bytes at beginning or within zipfile");
            if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
              // The offsets seem wrong, but we have something at the specified offset.
              // So… we keep it.
            } else {
              // the offset is wrong, update the "zero" of the reader
              // this happens if data has been prepended (crx files for example)
              this.reader.zero = extraBytes;
            }
          } else if (extraBytes < 0) {
            throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
          }
        },
        prepareReader: function (data) {
          this.reader = readerFor(data);
        },
        /**
         * Read a zip file and create ZipEntries.
         * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
         */
        load: function (data) {
          this.prepareReader(data);
          this.readEndOfCentral();
          this.readCentralDir();
          this.readLocalFiles();
        }
      };
      // }}} end of ZipEntries
      module.exports = ZipEntries;

    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function (require, module, exports) {
      "use strict";
      var readerFor = require("./reader/readerFor");
      var utils = require("./utils");
      var CompressedObject = require("./compressedObject");
      var crc32fn = require("./crc32");
      var utf8 = require("./utf8");
      var compressions = require("./compressions");
      var support = require("./support");

      var MADE_BY_DOS = 0x00;
      var MADE_BY_UNIX = 0x03;

      /**
       * Find a compression registered in JSZip.
       * @param {string} compressionMethod the method magic to find.
       * @return {Object|null} the JSZip compression object, null if none found.
       */
      var findCompression = function (compressionMethod) {
        for (var method in compressions) {
          if (!Object.prototype.hasOwnProperty.call(compressions, method)) {
            continue;
          }
          if (compressions[method].magic === compressionMethod) {
            return compressions[method];
          }
        }
        return null;
      };

      // class ZipEntry {{{
      /**
       * An entry in the zip file.
       * @constructor
       * @param {Object} options Options of the current file.
       * @param {Object} loadOptions Options for loading the stream.
       */
      function ZipEntry(options, loadOptions) {
        this.options = options;
        this.loadOptions = loadOptions;
      }
      ZipEntry.prototype = {
        /**
         * say if the file is encrypted.
         * @return {boolean} true if the file is encrypted, false otherwise.
         */
        isEncrypted: function () {
          // bit 1 is set
          return (this.bitFlag & 0x0001) === 0x0001;
        },
        /**
         * say if the file has utf-8 filename/comment.
         * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
         */
        useUTF8: function () {
          // bit 11 is set
          return (this.bitFlag & 0x0800) === 0x0800;
        },
        /**
         * Read the local part of a zip file and add the info in this object.
         * @param {DataReader} reader the reader to use.
         */
        readLocalPart: function (reader) {
          var compression, localExtraFieldsLength;

          // we already know everything from the central dir !
          // If the central dir data are false, we are doomed.
          // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.
          // The less data we get here, the more reliable this should be.
          // Let's skip the whole header and dash to the data !
          reader.skip(22);
          // in some zip created on windows, the filename stored in the central dir contains \ instead of /.
          // Strangely, the filename here is OK.
          // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes
          // or APPNOTE#4.4.17.1, "All slashes MUST be forward slashes '/'") but there are a lot of bad zip generators...
          // Search "unzip mismatching "local" filename continuing with "central" filename version" on
          // the internet.
          //
          // I think I see the logic here : the central directory is used to display
          // content and the local directory is used to extract the files. Mixing / and \
          // may be used to display \ to windows users and use / when extracting the files.
          // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394
          this.fileNameLength = reader.readInt(2);
          localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir
          // the fileName is stored as binary data, the handleUTF8 method will take care of the encoding.
          this.fileName = reader.readData(this.fileNameLength);
          reader.skip(localExtraFieldsLength);

          if (this.compressedSize === -1 || this.uncompressedSize === -1) {
            throw new Error("Bug or corrupted zip : didn't get enough information from the central directory " + "(compressedSize === -1 || uncompressedSize === -1)");
          }

          compression = findCompression(this.compressionMethod);
          if (compression === null) { // no compression found
            throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
          }
          this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
        },

        /**
         * Read the central part of a zip file and add the info in this object.
         * @param {DataReader} reader the reader to use.
         */
        readCentralPart: function (reader) {
          this.versionMadeBy = reader.readInt(2);
          reader.skip(2);
          // this.versionNeeded = reader.readInt(2);
          this.bitFlag = reader.readInt(2);
          this.compressionMethod = reader.readString(2);
          this.date = reader.readDate();
          this.crc32 = reader.readInt(4);
          this.compressedSize = reader.readInt(4);
          this.uncompressedSize = reader.readInt(4);
          var fileNameLength = reader.readInt(2);
          this.extraFieldsLength = reader.readInt(2);
          this.fileCommentLength = reader.readInt(2);
          this.diskNumberStart = reader.readInt(2);
          this.internalFileAttributes = reader.readInt(2);
          this.externalFileAttributes = reader.readInt(4);
          this.localHeaderOffset = reader.readInt(4);

          if (this.isEncrypted()) {
            throw new Error("Encrypted zip are not supported");
          }

          // will be read in the local part, see the comments there
          reader.skip(fileNameLength);
          this.readExtraFields(reader);
          this.parseZIP64ExtraField(reader);
          this.fileComment = reader.readData(this.fileCommentLength);
        },

        /**
         * Parse the external file attributes and get the unix/dos permissions.
         */
        processAttributes: function () {
          this.unixPermissions = null;
          this.dosPermissions = null;
          var madeBy = this.versionMadeBy >> 8;

          // Check if we have the DOS directory flag set.
          // We look for it in the DOS and UNIX permissions
          // but some unknown platform could set it as a compatibility flag.
          this.dir = this.externalFileAttributes & 0x0010 ? true : false;

          if (madeBy === MADE_BY_DOS) {
            // first 6 bits (0 to 5)
            this.dosPermissions = this.externalFileAttributes & 0x3F;
          }

          if (madeBy === MADE_BY_UNIX) {
            this.unixPermissions = (this.externalFileAttributes >> 16) & 0xFFFF;
            // the octal permissions are in (this.unixPermissions & 0x01FF).toString(8);
          }

          // fail safe : if the name ends with a / it probably means a folder
          if (!this.dir && this.fileNameStr.slice(-1) === "/") {
            this.dir = true;
          }
        },

        /**
         * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
         * @param {DataReader} reader the reader to use.
         */
        parseZIP64ExtraField: function () {
          if (!this.extraFields[0x0001]) {
            return;
          }

          // should be something, preparing the extra reader
          var extraReader = readerFor(this.extraFields[0x0001].value);

          // I really hope that these 64bits integer can fit in 32 bits integer, because js
          // won't let us have more.
          if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
            this.uncompressedSize = extraReader.readInt(8);
          }
          if (this.compressedSize === utils.MAX_VALUE_32BITS) {
            this.compressedSize = extraReader.readInt(8);
          }
          if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
            this.localHeaderOffset = extraReader.readInt(8);
          }
          if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
            this.diskNumberStart = extraReader.readInt(4);
          }
        },
        /**
         * Read the central part of a zip file and add the info in this object.
         * @param {DataReader} reader the reader to use.
         */
        readExtraFields: function (reader) {
          var end = reader.index + this.extraFieldsLength,
            extraFieldId,
            extraFieldLength,
            extraFieldValue;

          if (!this.extraFields) {
            this.extraFields = {};
          }

          while (reader.index + 4 < end) {
            extraFieldId = reader.readInt(2);
            extraFieldLength = reader.readInt(2);
            extraFieldValue = reader.readData(extraFieldLength);

            this.extraFields[extraFieldId] = {
              id: extraFieldId,
              length: extraFieldLength,
              value: extraFieldValue
            };
          }

          reader.setIndex(end);
        },
        /**
         * Apply an UTF8 transformation if needed.
         */
        handleUTF8: function () {
          var decodeParamType = support.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) {
            this.fileNameStr = utf8.utf8decode(this.fileName);
            this.fileCommentStr = utf8.utf8decode(this.fileComment);
          } else {
            var upath = this.findExtraFieldUnicodePath();
            if (upath !== null) {
              this.fileNameStr = upath;
            } else {
              // ASCII text or unsupported code page
              var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
            }

            var ucomment = this.findExtraFieldUnicodeComment();
            if (ucomment !== null) {
              this.fileCommentStr = ucomment;
            } else {
              // ASCII text or unsupported code page
              var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
            }
          }
        },

        /**
         * Find the unicode path declared in the extra field, if any.
         * @return {String} the unicode path, null otherwise.
         */
        findExtraFieldUnicodePath: function () {
          var upathField = this.extraFields[0x7075];
          if (upathField) {
            var extraReader = readerFor(upathField.value);

            // wrong version
            if (extraReader.readInt(1) !== 1) {
              return null;
            }

            // the crc of the filename changed, this field is out of date.
            if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
              return null;
            }

            return utf8.utf8decode(extraReader.readData(upathField.length - 5));
          }
          return null;
        },

        /**
         * Find the unicode comment declared in the extra field, if any.
         * @return {String} the unicode comment, null otherwise.
         */
        findExtraFieldUnicodeComment: function () {
          var ucommentField = this.extraFields[0x6375];
          if (ucommentField) {
            var extraReader = readerFor(ucommentField.value);

            // wrong version
            if (extraReader.readInt(1) !== 1) {
              return null;
            }

            // the crc of the comment changed, this field is out of date.
            if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
              return null;
            }

            return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
          }
          return null;
        }
      };
      module.exports = ZipEntry;

    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function (require, module, exports) {
      "use strict";

      var StreamHelper = require("./stream/StreamHelper");
      var DataWorker = require("./stream/DataWorker");
      var utf8 = require("./utf8");
      var CompressedObject = require("./compressedObject");
      var GenericWorker = require("./stream/GenericWorker");

      /**
       * A simple object representing a file in the zip file.
       * @constructor
       * @param {string} name the name of the file
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
       * @param {Object} options the options of the file
       */
      var ZipObject = function (name, data, options) {
        this.name = name;
        this.dir = options.dir;
        this.date = options.date;
        this.comment = options.comment;
        this.unixPermissions = options.unixPermissions;
        this.dosPermissions = options.dosPermissions;

        this._data = data;
        this._dataBinary = options.binary;
        // keep only the compression
        this.options = {
          compression: options.compression,
          compressionOptions: options.compressionOptions
        };
      };

      ZipObject.prototype = {
        /**
         * Create an internal stream for the content of this object.
         * @param {String} type the type of each chunk.
         * @return StreamHelper the stream.
         */
        internalStream: function (type) {
          var result = null, outputType = "string";
          try {
            if (!type) {
              throw new Error("No output type specified.");
            }
            outputType = type.toLowerCase();
            var askUnicodeString = outputType === "string" || outputType === "text";
            if (outputType === "binarystring" || outputType === "text") {
              outputType = "string";
            }
            result = this._decompressWorker();

            var isUnicodeString = !this._dataBinary;

            if (isUnicodeString && !askUnicodeString) {
              result = result.pipe(new utf8.Utf8EncodeWorker());
            }
            if (!isUnicodeString && askUnicodeString) {
              result = result.pipe(new utf8.Utf8DecodeWorker());
            }
          } catch (e) {
            result = new GenericWorker("error");
            result.error(e);
          }

          return new StreamHelper(result, outputType, "");
        },

        /**
         * Prepare the content in the asked type.
         * @param {String} type the type of the result.
         * @param {Function} onUpdate a function to call on each internal update.
         * @return Promise the promise of the result.
         */
        async: function (type, onUpdate) {
          return this.internalStream(type).accumulate(onUpdate);
        },

        /**
         * Prepare the content as a nodejs stream.
         * @param {String} type the type of each chunk.
         * @param {Function} onUpdate a function to call on each internal update.
         * @return Stream the stream.
         */
        nodeStream: function (type, onUpdate) {
          return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
        },

        /**
         * Return a worker for the compressed content.
         * @private
         * @param {Object} compression the compression object to use.
         * @param {Object} compressionOptions the options to use when compressing.
         * @return Worker the worker.
         */
        _compressWorker: function (compression, compressionOptions) {
          if (
            this._data instanceof CompressedObject &&
            this._data.compression.magic === compression.magic
          ) {
            return this._data.getCompressedWorker();
          } else {
            var result = this._decompressWorker();
            if (!this._dataBinary) {
              result = result.pipe(new utf8.Utf8EncodeWorker());
            }
            return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
          }
        },
        /**
         * Return a worker for the decompressed content.
         * @private
         * @return Worker the worker.
         */
        _decompressWorker: function () {
          if (this._data instanceof CompressedObject) {
            return this._data.getContentWorker();
          } else if (this._data instanceof GenericWorker) {
            return this._data;
          } else {
            return new DataWorker(this._data);
          }
        }
      };

      var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
      var removedFn = function () {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      };

      for (var i = 0; i < removedMethods.length; i++) {
        ZipObject.prototype[removedMethods[i]] = removedFn;
      }
      module.exports = ZipObject;

    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function (require, module, exports) {
      (function (global) {
        'use strict';
        var Mutation = global.MutationObserver || global.WebKitMutationObserver;

        var scheduleDrain;

        {
          if (Mutation) {
            var called = 0;
            var observer = new Mutation(nextTick);
            var element = global.document.createTextNode('');
            observer.observe(element, {
              characterData: true
            });
            scheduleDrain = function () {
              element.data = (called = ++called % 2);
            };
          } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
            var channel = new global.MessageChannel();
            channel.port1.onmessage = nextTick;
            scheduleDrain = function () {
              channel.port2.postMessage(0);
            };
          } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
            scheduleDrain = function () {

              // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
              // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
              var scriptEl = global.document.createElement('script');
              scriptEl.onreadystatechange = function () {
                nextTick();

                scriptEl.onreadystatechange = null;
                scriptEl.parentNode.removeChild(scriptEl);
                scriptEl = null;
              };
              global.document.documentElement.appendChild(scriptEl);
            };
          } else {
            scheduleDrain = function () {
              setTimeout(nextTick, 0);
            };
          }
        }

        var draining;
        var queue = [];
        //named nextTick for less confusing stack traces
        function nextTick() {
          draining = true;
          var i, oldQueue;
          var len = queue.length;
          while (len) {
            oldQueue = queue;
            queue = [];
            i = -1;
            while (++i < len) {
              oldQueue[i]();
            }
            len = queue.length;
          }
          draining = false;
        }

        module.exports = immediate;
        function immediate(task) {
          if (queue.push(task) === 1 && !draining) {
            scheduleDrain();
          }
        }

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}], 37: [function (require, module, exports) {
      'use strict';
      var immediate = require('immediate');

      /* istanbul ignore next */
      function INTERNAL() { }

      var handlers = {};

      var REJECTED = ['REJECTED'];
      var FULFILLED = ['FULFILLED'];
      var PENDING = ['PENDING'];

      module.exports = Promise;

      function Promise(resolver) {
        if (typeof resolver !== 'function') {
          throw new TypeError('resolver must be a function');
        }
        this.state = PENDING;
        this.queue = [];
        this.outcome = void 0;
        if (resolver !== INTERNAL) {
          safelyResolveThenable(this, resolver);
        }
      }

      Promise.prototype["finally"] = function (callback) {
        if (typeof callback !== 'function') {
          return this;
        }
        var p = this.constructor;
        return this.then(resolve, reject);

        function resolve(value) {
          function yes() {
            return value;
          }
          return p.resolve(callback()).then(yes);
        }
        function reject(reason) {
          function no() {
            throw reason;
          }
          return p.resolve(callback()).then(no);
        }
      };
      Promise.prototype["catch"] = function (onRejected) {
        return this.then(null, onRejected);
      };
      Promise.prototype.then = function (onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
          typeof onRejected !== 'function' && this.state === REJECTED) {
          return this;
        }
        var promise = new this.constructor(INTERNAL);
        if (this.state !== PENDING) {
          var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
          unwrap(promise, resolver, this.outcome);
        } else {
          this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
        }

        return promise;
      };
      function QueueItem(promise, onFulfilled, onRejected) {
        this.promise = promise;
        if (typeof onFulfilled === 'function') {
          this.onFulfilled = onFulfilled;
          this.callFulfilled = this.otherCallFulfilled;
        }
        if (typeof onRejected === 'function') {
          this.onRejected = onRejected;
          this.callRejected = this.otherCallRejected;
        }
      }
      QueueItem.prototype.callFulfilled = function (value) {
        handlers.resolve(this.promise, value);
      };
      QueueItem.prototype.otherCallFulfilled = function (value) {
        unwrap(this.promise, this.onFulfilled, value);
      };
      QueueItem.prototype.callRejected = function (value) {
        handlers.reject(this.promise, value);
      };
      QueueItem.prototype.otherCallRejected = function (value) {
        unwrap(this.promise, this.onRejected, value);
      };

      function unwrap(promise, func, value) {
        immediate(function () {
          var returnValue;
          try {
            returnValue = func(value);
          } catch (e) {
            return handlers.reject(promise, e);
          }
          if (returnValue === promise) {
            handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
          } else {
            handlers.resolve(promise, returnValue);
          }
        });
      }

      handlers.resolve = function (self, value) {
        var result = tryCatch(getThen, value);
        if (result.status === 'error') {
          return handlers.reject(self, result.value);
        }
        var thenable = result.value;

        if (thenable) {
          safelyResolveThenable(self, thenable);
        } else {
          self.state = FULFILLED;
          self.outcome = value;
          var i = -1;
          var len = self.queue.length;
          while (++i < len) {
            self.queue[i].callFulfilled(value);
          }
        }
        return self;
      };
      handlers.reject = function (self, error) {
        self.state = REJECTED;
        self.outcome = error;
        var i = -1;
        var len = self.queue.length;
        while (++i < len) {
          self.queue[i].callRejected(error);
        }
        return self;
      };

      function getThen(obj) {
        // Make sure we only access the accessor once as required by the spec
        var then = obj && obj.then;
        if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
          return function appyThen() {
            then.apply(obj, arguments);
          };
        }
      }

      function safelyResolveThenable(self, thenable) {
        // Either fulfill, reject or reject with error
        var called = false;
        function onError(value) {
          if (called) {
            return;
          }
          called = true;
          handlers.reject(self, value);
        }

        function onSuccess(value) {
          if (called) {
            return;
          }
          called = true;
          handlers.resolve(self, value);
        }

        function tryToUnwrap() {
          thenable(onSuccess, onError);
        }

        var result = tryCatch(tryToUnwrap);
        if (result.status === 'error') {
          onError(result.value);
        }
      }

      function tryCatch(func, value) {
        var out = {};
        try {
          out.value = func(value);
          out.status = 'success';
        } catch (e) {
          out.status = 'error';
          out.value = e;
        }
        return out;
      }

      Promise.resolve = resolve;
      function resolve(value) {
        if (value instanceof this) {
          return value;
        }
        return handlers.resolve(new this(INTERNAL), value);
      }

      Promise.reject = reject;
      function reject(reason) {
        var promise = new this(INTERNAL);
        return handlers.reject(promise, reason);
      }

      Promise.all = all;
      function all(iterable) {
        var self = this;
        if (Object.prototype.toString.call(iterable) !== '[object Array]') {
          return this.reject(new TypeError('must be an array'));
        }

        var len = iterable.length;
        var called = false;
        if (!len) {
          return this.resolve([]);
        }

        var values = new Array(len);
        var resolved = 0;
        var i = -1;
        var promise = new this(INTERNAL);

        while (++i < len) {
          allResolver(iterable[i], i);
        }
        return promise;
        function allResolver(value, i) {
          self.resolve(value).then(resolveFromAll, function (error) {
            if (!called) {
              called = true;
              handlers.reject(promise, error);
            }
          });
          function resolveFromAll(outValue) {
            values[i] = outValue;
            if (++resolved === len && !called) {
              called = true;
              handlers.resolve(promise, values);
            }
          }
        }
      }

      Promise.race = race;
      function race(iterable) {
        var self = this;
        if (Object.prototype.toString.call(iterable) !== '[object Array]') {
          return this.reject(new TypeError('must be an array'));
        }

        var len = iterable.length;
        var called = false;
        if (!len) {
          return this.resolve([]);
        }

        var i = -1;
        var promise = new this(INTERNAL);

        while (++i < len) {
          resolver(iterable[i]);
        }
        return promise;
        function resolver(value) {
          self.resolve(value).then(function (response) {
            if (!called) {
              called = true;
              handlers.resolve(promise, response);
            }
          }, function (error) {
            if (!called) {
              called = true;
              handlers.reject(promise, error);
            }
          });
        }
      }

    }, { "immediate": 36 }], 38: [function (require, module, exports) {
      // Top level file is just a mixin of submodules & constants
      'use strict';

      var assign = require('./lib/utils/common').assign;

      var deflate = require('./lib/deflate');
      var inflate = require('./lib/inflate');
      var constants = require('./lib/zlib/constants');

      var pako = {};

      assign(pako, deflate, inflate, constants);

      module.exports = pako;

    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function (require, module, exports) {
      'use strict';


      var zlib_deflate = require('./zlib/deflate');
      var utils = require('./utils/common');
      var strings = require('./utils/strings');
      var msg = require('./zlib/messages');
      var ZStream = require('./zlib/zstream');

      var toString = Object.prototype.toString;

      /* Public constants ==========================================================*/
      /* ===========================================================================*/

      var Z_NO_FLUSH = 0;
      var Z_FINISH = 4;

      var Z_OK = 0;
      var Z_STREAM_END = 1;
      var Z_SYNC_FLUSH = 2;

      var Z_DEFAULT_COMPRESSION = -1;

      var Z_DEFAULT_STRATEGY = 0;

      var Z_DEFLATED = 8;

      /* ===========================================================================*/


      /**
       * class Deflate
       *
       * Generic JS-style wrapper for zlib calls. If you don't need
       * streaming behaviour - use more simple functions: [[deflate]],
       * [[deflateRaw]] and [[gzip]].
       **/

      /* internal
       * Deflate.chunks -> Array
       *
       * Chunks of output data, if [[Deflate#onData]] not overriden.
       **/

      /**
       * Deflate.result -> Uint8Array|Array
       *
       * Compressed result, generated by default [[Deflate#onData]]
       * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
       * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
       * push a chunk with explicit flush (call [[Deflate#push]] with
       * `Z_SYNC_FLUSH` param).
       **/

      /**
       * Deflate.err -> Number
       *
       * Error code after deflate finished. 0 (Z_OK) on success.
       * You will not need it in real life, because deflate errors
       * are possible only on wrong options or bad `onData` / `onEnd`
       * custom handlers.
       **/

      /**
       * Deflate.msg -> String
       *
       * Error message, if [[Deflate.err]] != 0
       **/


      /**
       * new Deflate(options)
       * - options (Object): zlib deflate options.
       *
       * Creates new deflator instance with specified params. Throws exception
       * on bad params. Supported options:
       *
       * - `level`
       * - `windowBits`
       * - `memLevel`
       * - `strategy`
       * - `dictionary`
       *
       * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
       * for more information on these.
       *
       * Additional options, for internal needs:
       *
       * - `chunkSize` - size of generated data chunks (16K by default)
       * - `raw` (Boolean) - do raw deflate
       * - `gzip` (Boolean) - create gzip wrapper
       * - `to` (String) - if equal to 'string', then result will be "binary string"
       *    (each char code [0..255])
       * - `header` (Object) - custom header for gzip
       *   - `text` (Boolean) - true if compressed data believed to be text
       *   - `time` (Number) - modification time, unix timestamp
       *   - `os` (Number) - operation system code
       *   - `extra` (Array) - array of bytes with extra data (max 65536)
       *   - `name` (String) - file name (binary string)
       *   - `comment` (String) - comment (binary string)
       *   - `hcrc` (Boolean) - true if header crc should be added
       *
       * ##### Example:
       *
       * ```javascript
       * var pako = require('pako')
       *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
       *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
       *
       * var deflate = new pako.Deflate({ level: 3});
       *
       * deflate.push(chunk1, false);
       * deflate.push(chunk2, true);  // true -> last chunk
       *
       * if (deflate.err) { throw new Error(deflate.err); }
       *
       * console.log(deflate.result);
       * ```
       **/
      function Deflate(options) {
        if (!(this instanceof Deflate)) return new Deflate(options);

        this.options = utils.assign({
          level: Z_DEFAULT_COMPRESSION,
          method: Z_DEFLATED,
          chunkSize: 16384,
          windowBits: 15,
          memLevel: 8,
          strategy: Z_DEFAULT_STRATEGY,
          to: ''
        }, options || {});

        var opt = this.options;

        if (opt.raw && (opt.windowBits > 0)) {
          opt.windowBits = -opt.windowBits;
        }

        else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
          opt.windowBits += 16;
        }

        this.err = 0;      // error code, if happens (0 = Z_OK)
        this.msg = '';     // error message
        this.ended = false;  // used to avoid multiple onEnd() calls
        this.chunks = [];     // chunks of compressed data

        this.strm = new ZStream();
        this.strm.avail_out = 0;

        var status = zlib_deflate.deflateInit2(
          this.strm,
          opt.level,
          opt.method,
          opt.windowBits,
          opt.memLevel,
          opt.strategy
        );

        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }

        if (opt.header) {
          zlib_deflate.deflateSetHeader(this.strm, opt.header);
        }

        if (opt.dictionary) {
          var dict;
          // Convert data if needed
          if (typeof opt.dictionary === 'string') {
            // If we need to compress text, change encoding to utf8.
            dict = strings.string2buf(opt.dictionary);
          } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
            dict = new Uint8Array(opt.dictionary);
          } else {
            dict = opt.dictionary;
          }

          status = zlib_deflate.deflateSetDictionary(this.strm, dict);

          if (status !== Z_OK) {
            throw new Error(msg[status]);
          }

          this._dict_set = true;
        }
      }

      /**
       * Deflate#push(data[, mode]) -> Boolean
       * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
       *   converted to utf8 byte sequence.
       * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
       *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
       *
       * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
       * new compressed chunks. Returns `true` on success. The last data block must have
       * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
       * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
       * can use mode Z_SYNC_FLUSH, keeping the compression context.
       *
       * On fail call [[Deflate#onEnd]] with error code and return false.
       *
       * We strongly recommend to use `Uint8Array` on input for best speed (output
       * array format is detected automatically). Also, don't skip last param and always
       * use the same type in your code (boolean or number). That will improve JS speed.
       *
       * For regular `Array`-s make sure all elements are [0..255].
       *
       * ##### Example
       *
       * ```javascript
       * push(chunk, false); // push one of data chunks
       * ...
       * push(chunk, true);  // push last chunk
       * ```
       **/
      Deflate.prototype.push = function (data, mode) {
        var strm = this.strm;
        var chunkSize = this.options.chunkSize;
        var status, _mode;

        if (this.ended) { return false; }

        _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

        // Convert data if needed
        if (typeof data === 'string') {
          // If we need to compress text, change encoding to utf8.
          strm.input = strings.string2buf(data);
        } else if (toString.call(data) === '[object ArrayBuffer]') {
          strm.input = new Uint8Array(data);
        } else {
          strm.input = data;
        }

        strm.next_in = 0;
        strm.avail_in = strm.input.length;

        do {
          if (strm.avail_out === 0) {
            strm.output = new utils.Buf8(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
          }
          status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */

          if (status !== Z_STREAM_END && status !== Z_OK) {
            this.onEnd(status);
            this.ended = true;
            return false;
          }
          if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
            if (this.options.to === 'string') {
              this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
            } else {
              this.onData(utils.shrinkBuf(strm.output, strm.next_out));
            }
          }
        } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

        // Finalize on the last chunk.
        if (_mode === Z_FINISH) {
          status = zlib_deflate.deflateEnd(this.strm);
          this.onEnd(status);
          this.ended = true;
          return status === Z_OK;
        }

        // callback interim results if Z_SYNC_FLUSH.
        if (_mode === Z_SYNC_FLUSH) {
          this.onEnd(Z_OK);
          strm.avail_out = 0;
          return true;
        }

        return true;
      };


      /**
       * Deflate#onData(chunk) -> Void
       * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
       *   on js engine support. When string output requested, each chunk
       *   will be string.
       *
       * By default, stores data blocks in `chunks[]` property and glue
       * those in `onEnd`. Override this handler, if you need another behaviour.
       **/
      Deflate.prototype.onData = function (chunk) {
        this.chunks.push(chunk);
      };


      /**
       * Deflate#onEnd(status) -> Void
       * - status (Number): deflate status. 0 (Z_OK) on success,
       *   other if not.
       *
       * Called once after you tell deflate that the input stream is
       * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
       * or if an error happened. By default - join collected chunks,
       * free memory and fill `results` / `err` properties.
       **/
      Deflate.prototype.onEnd = function (status) {
        // On success - join
        if (status === Z_OK) {
          if (this.options.to === 'string') {
            this.result = this.chunks.join('');
          } else {
            this.result = utils.flattenChunks(this.chunks);
          }
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
      };


      /**
       * deflate(data[, options]) -> Uint8Array|Array|String
       * - data (Uint8Array|Array|String): input data to compress.
       * - options (Object): zlib deflate options.
       *
       * Compress `data` with deflate algorithm and `options`.
       *
       * Supported options are:
       *
       * - level
       * - windowBits
       * - memLevel
       * - strategy
       * - dictionary
       *
       * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
       * for more information on these.
       *
       * Sugar (options):
       *
       * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
       *   negative windowBits implicitly.
       * - `to` (String) - if equal to 'string', then result will be "binary string"
       *    (each char code [0..255])
       *
       * ##### Example:
       *
       * ```javascript
       * var pako = require('pako')
       *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
       *
       * console.log(pako.deflate(data));
       * ```
       **/
      function deflate(input, options) {
        var deflator = new Deflate(options);

        deflator.push(input, true);

        // That will never happens, if you don't cheat with options :)
        if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

        return deflator.result;
      }


      /**
       * deflateRaw(data[, options]) -> Uint8Array|Array|String
       * - data (Uint8Array|Array|String): input data to compress.
       * - options (Object): zlib deflate options.
       *
       * The same as [[deflate]], but creates raw data, without wrapper
       * (header and adler32 crc).
       **/
      function deflateRaw(input, options) {
        options = options || {};
        options.raw = true;
        return deflate(input, options);
      }


      /**
       * gzip(data[, options]) -> Uint8Array|Array|String
       * - data (Uint8Array|Array|String): input data to compress.
       * - options (Object): zlib deflate options.
       *
       * The same as [[deflate]], but create gzip wrapper instead of
       * deflate one.
       **/
      function gzip(input, options) {
        options = options || {};
        options.gzip = true;
        return deflate(input, options);
      }


      exports.Deflate = Deflate;
      exports.deflate = deflate;
      exports.deflateRaw = deflateRaw;
      exports.gzip = gzip;

    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function (require, module, exports) {
      'use strict';


      var zlib_inflate = require('./zlib/inflate');
      var utils = require('./utils/common');
      var strings = require('./utils/strings');
      var c = require('./zlib/constants');
      var msg = require('./zlib/messages');
      var ZStream = require('./zlib/zstream');
      var GZheader = require('./zlib/gzheader');

      var toString = Object.prototype.toString;

      /**
       * class Inflate
       *
       * Generic JS-style wrapper for zlib calls. If you don't need
       * streaming behaviour - use more simple functions: [[inflate]]
       * and [[inflateRaw]].
       **/

      /* internal
       * inflate.chunks -> Array
       *
       * Chunks of output data, if [[Inflate#onData]] not overriden.
       **/

      /**
       * Inflate.result -> Uint8Array|Array|String
       *
       * Uncompressed result, generated by default [[Inflate#onData]]
       * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
       * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
       * push a chunk with explicit flush (call [[Inflate#push]] with
       * `Z_SYNC_FLUSH` param).
       **/

      /**
       * Inflate.err -> Number
       *
       * Error code after inflate finished. 0 (Z_OK) on success.
       * Should be checked if broken data possible.
       **/

      /**
       * Inflate.msg -> String
       *
       * Error message, if [[Inflate.err]] != 0
       **/


      /**
       * new Inflate(options)
       * - options (Object): zlib inflate options.
       *
       * Creates new inflator instance with specified params. Throws exception
       * on bad params. Supported options:
       *
       * - `windowBits`
       * - `dictionary`
       *
       * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
       * for more information on these.
       *
       * Additional options, for internal needs:
       *
       * - `chunkSize` - size of generated data chunks (16K by default)
       * - `raw` (Boolean) - do raw inflate
       * - `to` (String) - if equal to 'string', then result will be converted
       *   from utf8 to utf16 (javascript) string. When string output requested,
       *   chunk length can differ from `chunkSize`, depending on content.
       *
       * By default, when no options set, autodetect deflate/gzip data format via
       * wrapper header.
       *
       * ##### Example:
       *
       * ```javascript
       * var pako = require('pako')
       *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
       *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
       *
       * var inflate = new pako.Inflate({ level: 3});
       *
       * inflate.push(chunk1, false);
       * inflate.push(chunk2, true);  // true -> last chunk
       *
       * if (inflate.err) { throw new Error(inflate.err); }
       *
       * console.log(inflate.result);
       * ```
       **/
      function Inflate(options) {
        if (!(this instanceof Inflate)) return new Inflate(options);

        this.options = utils.assign({
          chunkSize: 16384,
          windowBits: 0,
          to: ''
        }, options || {});

        var opt = this.options;

        // Force window size for `raw` data, if not set directly,
        // because we have no header for autodetect.
        if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
          opt.windowBits = -opt.windowBits;
          if (opt.windowBits === 0) { opt.windowBits = -15; }
        }

        // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
        if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
          !(options && options.windowBits)) {
          opt.windowBits += 32;
        }

        // Gzip header has no info about windows size, we can do autodetect only
        // for deflate. So, if window size not set, force it to max when gzip possible
        if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
          // bit 3 (16) -> gzipped data
          // bit 4 (32) -> autodetect gzip/deflate
          if ((opt.windowBits & 15) === 0) {
            opt.windowBits |= 15;
          }
        }

        this.err = 0;      // error code, if happens (0 = Z_OK)
        this.msg = '';     // error message
        this.ended = false;  // used to avoid multiple onEnd() calls
        this.chunks = [];     // chunks of compressed data

        this.strm = new ZStream();
        this.strm.avail_out = 0;

        var status = zlib_inflate.inflateInit2(
          this.strm,
          opt.windowBits
        );

        if (status !== c.Z_OK) {
          throw new Error(msg[status]);
        }

        this.header = new GZheader();

        zlib_inflate.inflateGetHeader(this.strm, this.header);
      }

      /**
       * Inflate#push(data[, mode]) -> Boolean
       * - data (Uint8Array|Array|ArrayBuffer|String): input data
       * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
       *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
       *
       * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
       * new output chunks. Returns `true` on success. The last data block must have
       * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
       * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
       * can use mode Z_SYNC_FLUSH, keeping the decompression context.
       *
       * On fail call [[Inflate#onEnd]] with error code and return false.
       *
       * We strongly recommend to use `Uint8Array` on input for best speed (output
       * format is detected automatically). Also, don't skip last param and always
       * use the same type in your code (boolean or number). That will improve JS speed.
       *
       * For regular `Array`-s make sure all elements are [0..255].
       *
       * ##### Example
       *
       * ```javascript
       * push(chunk, false); // push one of data chunks
       * ...
       * push(chunk, true);  // push last chunk
       * ```
       **/
      Inflate.prototype.push = function (data, mode) {
        var strm = this.strm;
        var chunkSize = this.options.chunkSize;
        var dictionary = this.options.dictionary;
        var status, _mode;
        var next_out_utf8, tail, utf8str;
        var dict;

        // Flag to properly process Z_BUF_ERROR on testing inflate call
        // when we check that all output data was flushed.
        var allowBufError = false;

        if (this.ended) { return false; }
        _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);

        // Convert data if needed
        if (typeof data === 'string') {
          // Only binary strings can be decompressed on practice
          strm.input = strings.binstring2buf(data);
        } else if (toString.call(data) === '[object ArrayBuffer]') {
          strm.input = new Uint8Array(data);
        } else {
          strm.input = data;
        }

        strm.next_in = 0;
        strm.avail_in = strm.input.length;

        do {
          if (strm.avail_out === 0) {
            strm.output = new utils.Buf8(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
          }

          status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */

          if (status === c.Z_NEED_DICT && dictionary) {
            // Convert data if needed
            if (typeof dictionary === 'string') {
              dict = strings.string2buf(dictionary);
            } else if (toString.call(dictionary) === '[object ArrayBuffer]') {
              dict = new Uint8Array(dictionary);
            } else {
              dict = dictionary;
            }

            status = zlib_inflate.inflateSetDictionary(this.strm, dict);

          }

          if (status === c.Z_BUF_ERROR && allowBufError === true) {
            status = c.Z_OK;
            allowBufError = false;
          }

          if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
            this.onEnd(status);
            this.ended = true;
            return false;
          }

          if (strm.next_out) {
            if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {

              if (this.options.to === 'string') {

                next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

                tail = strm.next_out - next_out_utf8;
                utf8str = strings.buf2string(strm.output, next_out_utf8);

                // move tail
                strm.next_out = tail;
                strm.avail_out = chunkSize - tail;
                if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

                this.onData(utf8str);

              } else {
                this.onData(utils.shrinkBuf(strm.output, strm.next_out));
              }
            }
          }

          // When no more input data, we should check that internal inflate buffers
          // are flushed. The only way to do it when avail_out = 0 - run one more
          // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
          // Here we set flag to process this error properly.
          //
          // NOTE. Deflate does not return error in this case and does not needs such
          // logic.
          if (strm.avail_in === 0 && strm.avail_out === 0) {
            allowBufError = true;
          }

        } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

        if (status === c.Z_STREAM_END) {
          _mode = c.Z_FINISH;
        }

        // Finalize on the last chunk.
        if (_mode === c.Z_FINISH) {
          status = zlib_inflate.inflateEnd(this.strm);
          this.onEnd(status);
          this.ended = true;
          return status === c.Z_OK;
        }

        // callback interim results if Z_SYNC_FLUSH.
        if (_mode === c.Z_SYNC_FLUSH) {
          this.onEnd(c.Z_OK);
          strm.avail_out = 0;
          return true;
        }

        return true;
      };


      /**
       * Inflate#onData(chunk) -> Void
       * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
       *   on js engine support. When string output requested, each chunk
       *   will be string.
       *
       * By default, stores data blocks in `chunks[]` property and glue
       * those in `onEnd`. Override this handler, if you need another behaviour.
       **/
      Inflate.prototype.onData = function (chunk) {
        this.chunks.push(chunk);
      };


      /**
       * Inflate#onEnd(status) -> Void
       * - status (Number): inflate status. 0 (Z_OK) on success,
       *   other if not.
       *
       * Called either after you tell inflate that the input stream is
       * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
       * or if an error happened. By default - join collected chunks,
       * free memory and fill `results` / `err` properties.
       **/
      Inflate.prototype.onEnd = function (status) {
        // On success - join
        if (status === c.Z_OK) {
          if (this.options.to === 'string') {
            // Glue & convert here, until we teach pako to send
            // utf8 alligned strings to onData
            this.result = this.chunks.join('');
          } else {
            this.result = utils.flattenChunks(this.chunks);
          }
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
      };


      /**
       * inflate(data[, options]) -> Uint8Array|Array|String
       * - data (Uint8Array|Array|String): input data to decompress.
       * - options (Object): zlib inflate options.
       *
       * Decompress `data` with inflate/ungzip and `options`. Autodetect
       * format via wrapper header by default. That's why we don't provide
       * separate `ungzip` method.
       *
       * Supported options are:
       *
       * - windowBits
       *
       * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
       * for more information.
       *
       * Sugar (options):
       *
       * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
       *   negative windowBits implicitly.
       * - `to` (String) - if equal to 'string', then result will be converted
       *   from utf8 to utf16 (javascript) string. When string output requested,
       *   chunk length can differ from `chunkSize`, depending on content.
       *
       *
       * ##### Example:
       *
       * ```javascript
       * var pako = require('pako')
       *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
       *   , output;
       *
       * try {
       *   output = pako.inflate(input);
       * } catch (err)
       *   console.log(err);
       * }
       * ```
       **/
      function inflate(input, options) {
        var inflator = new Inflate(options);

        inflator.push(input, true);

        // That will never happens, if you don't cheat with options :)
        if (inflator.err) { throw inflator.msg || msg[inflator.err]; }

        return inflator.result;
      }


      /**
       * inflateRaw(data[, options]) -> Uint8Array|Array|String
       * - data (Uint8Array|Array|String): input data to decompress.
       * - options (Object): zlib inflate options.
       *
       * The same as [[inflate]], but creates raw data, without wrapper
       * (header and adler32 crc).
       **/
      function inflateRaw(input, options) {
        options = options || {};
        options.raw = true;
        return inflate(input, options);
      }


      /**
       * ungzip(data[, options]) -> Uint8Array|Array|String
       * - data (Uint8Array|Array|String): input data to decompress.
       * - options (Object): zlib inflate options.
       *
       * Just shortcut to [[inflate]], because it autodetects format
       * by header.content. Done for convenience.
       **/


      exports.Inflate = Inflate;
      exports.inflate = inflate;
      exports.inflateRaw = inflateRaw;
      exports.ungzip = inflate;

    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function (require, module, exports) {
      'use strict';


      var TYPED_OK = (typeof Uint8Array !== 'undefined') &&
        (typeof Uint16Array !== 'undefined') &&
        (typeof Int32Array !== 'undefined');


      exports.assign = function (obj /*from1, from2, from3, ...*/) {
        var sources = Array.prototype.slice.call(arguments, 1);
        while (sources.length) {
          var source = sources.shift();
          if (!source) { continue; }

          if (typeof source !== 'object') {
            throw new TypeError(source + 'must be non-object');
          }

          for (var p in source) {
            if (source.hasOwnProperty(p)) {
              obj[p] = source[p];
            }
          }
        }

        return obj;
      };


      // reduce buffer size, avoiding mem copy
      exports.shrinkBuf = function (buf, size) {
        if (buf.length === size) { return buf; }
        if (buf.subarray) { return buf.subarray(0, size); }
        buf.length = size;
        return buf;
      };


      var fnTyped = {
        arraySet: function (dest, src, src_offs, len, dest_offs) {
          if (src.subarray && dest.subarray) {
            dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
            return;
          }
          // Fallback to ordinary array
          for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function (chunks) {
          var i, l, len, pos, chunk, result;

          // calculate data length
          len = 0;
          for (i = 0, l = chunks.length; i < l; i++) {
            len += chunks[i].length;
          }

          // join chunks
          result = new Uint8Array(len);
          pos = 0;
          for (i = 0, l = chunks.length; i < l; i++) {
            chunk = chunks[i];
            result.set(chunk, pos);
            pos += chunk.length;
          }

          return result;
        }
      };

      var fnUntyped = {
        arraySet: function (dest, src, src_offs, len, dest_offs) {
          for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function (chunks) {
          return [].concat.apply([], chunks);
        }
      };


      // Enable/Disable typed arrays use, for testing
      //
      exports.setTyped = function (on) {
        if (on) {
          exports.Buf8 = Uint8Array;
          exports.Buf16 = Uint16Array;
          exports.Buf32 = Int32Array;
          exports.assign(exports, fnTyped);
        } else {
          exports.Buf8 = Array;
          exports.Buf16 = Array;
          exports.Buf32 = Array;
          exports.assign(exports, fnUntyped);
        }
      };

      exports.setTyped(TYPED_OK);

    }, {}], 42: [function (require, module, exports) {
      // String encode/decode helpers
      'use strict';


      var utils = require('./common');


      // Quick check if we can use fast array to bin string conversion
      //
      // - apply(Array) can fail on Android 2.2
      // - apply(Uint8Array) can fail on iOS 5.1 Safary
      //
      var STR_APPLY_OK = true;
      var STR_APPLY_UIA_OK = true;

      try { String.fromCharCode.apply(null, [0]); } catch (__) { STR_APPLY_OK = false; }
      try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


      // Table with utf8 lengths (calculated by first byte of sequence)
      // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
      // because max possible codepoint is 0x10ffff
      var _utf8len = new utils.Buf8(256);
      for (var q = 0; q < 256; q++) {
        _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
      }
      _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


      // convert string to array (typed, when possible)
      exports.string2buf = function (str) {
        var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

        // count binary size
        for (m_pos = 0; m_pos < str_len; m_pos++) {
          c = str.charCodeAt(m_pos);
          if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
              c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
              m_pos++;
            }
          }
          buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
        }

        // allocate buffer
        buf = new utils.Buf8(buf_len);

        // convert
        for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
          c = str.charCodeAt(m_pos);
          if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 0xfc00) === 0xdc00) {
              c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
              m_pos++;
            }
          }
          if (c < 0x80) {
            /* one byte */
            buf[i++] = c;
          } else if (c < 0x800) {
            /* two bytes */
            buf[i++] = 0xC0 | (c >>> 6);
            buf[i++] = 0x80 | (c & 0x3f);
          } else if (c < 0x10000) {
            /* three bytes */
            buf[i++] = 0xE0 | (c >>> 12);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
          } else {
            /* four bytes */
            buf[i++] = 0xf0 | (c >>> 18);
            buf[i++] = 0x80 | (c >>> 12 & 0x3f);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
          }
        }

        return buf;
      };

      // Helper (used in 2 places)
      function buf2binstring(buf, len) {
        // use fallback for big arrays to avoid stack overflow
        if (len < 65537) {
          if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
            return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
          }
        }

        var result = '';
        for (var i = 0; i < len; i++) {
          result += String.fromCharCode(buf[i]);
        }
        return result;
      }


      // Convert byte array to binary string
      exports.buf2binstring = function (buf) {
        return buf2binstring(buf, buf.length);
      };


      // Convert binary string (typed, when possible)
      exports.binstring2buf = function (str) {
        var buf = new utils.Buf8(str.length);
        for (var i = 0, len = buf.length; i < len; i++) {
          buf[i] = str.charCodeAt(i);
        }
        return buf;
      };


      // convert array to string
      exports.buf2string = function (buf, max) {
        var i, out, c, c_len;
        var len = max || buf.length;

        // Reserve max possible length (2 words per char)
        // NB: by unknown reasons, Array is significantly faster for
        //     String.fromCharCode.apply than Uint16Array.
        var utf16buf = new Array(len * 2);

        for (out = 0, i = 0; i < len;) {
          c = buf[i++];
          // quick process ascii
          if (c < 0x80) { utf16buf[out++] = c; continue; }

          c_len = _utf8len[c];
          // skip 5 & 6 byte codes
          if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

          // apply mask on first byte
          c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
          // join the rest
          while (c_len > 1 && i < len) {
            c = (c << 6) | (buf[i++] & 0x3f);
            c_len--;
          }

          // terminated by end of string?
          if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

          if (c < 0x10000) {
            utf16buf[out++] = c;
          } else {
            c -= 0x10000;
            utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
            utf16buf[out++] = 0xdc00 | (c & 0x3ff);
          }
        }

        return buf2binstring(utf16buf, out);
      };


      // Calculate max possible position in utf8 buffer,
      // that will not break sequence. If that's not possible
      // - (very small limits) return max size as is.
      //
      // buf[] - utf8 bytes array
      // max   - length limit (mandatory);
      exports.utf8border = function (buf, max) {
        var pos;

        max = max || buf.length;
        if (max > buf.length) { max = buf.length; }

        // go back from last position, until start of sequence found
        pos = max - 1;
        while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

        // Fuckup - very small and broken sequence,
        // return max, because we should return something anyway.
        if (pos < 0) { return max; }

        // If we came to start of buffer - that means vuffer is too small,
        // return max too.
        if (pos === 0) { return max; }

        return (pos + _utf8len[buf[pos]] > max) ? pos : max;
      };

    }, { "./common": 41 }], 43: [function (require, module, exports) {
      'use strict';

      // Note: adler32 takes 12% for level 0 and 2% for level 6.
      // It doesn't worth to make additional optimizationa as in original.
      // Small size is preferable.

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      function adler32(adler, buf, len, pos) {
        var s1 = (adler & 0xffff) | 0,
          s2 = ((adler >>> 16) & 0xffff) | 0,
          n = 0;

        while (len !== 0) {
          // Set limit ~ twice less than 5552, to keep
          // s2 in 31-bits, because we force signed ints.
          // in other case %= will fail.
          n = len > 2000 ? 2000 : len;
          len -= n;

          do {
            s1 = (s1 + buf[pos++]) | 0;
            s2 = (s2 + s1) | 0;
          } while (--n);

          s1 %= 65521;
          s2 %= 65521;
        }

        return (s1 | (s2 << 16)) | 0;
      }


      module.exports = adler32;

    }, {}], 44: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      module.exports = {

        /* Allowed flush values; see deflate() and inflate() below for details */
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,

        /* Return codes for the compression/decompression functions. Negative values
        * are errors, positive values are used for special but normal events.
        */
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        //Z_MEM_ERROR:     -4,
        Z_BUF_ERROR: -5,
        //Z_VERSION_ERROR: -6,

        /* compression levels */
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,


        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,

        /* Possible values of the data_type field (though see inflate()) */
        Z_BINARY: 0,
        Z_TEXT: 1,
        //Z_ASCII:                1, // = Z_TEXT (deprecated)
        Z_UNKNOWN: 2,

        /* The deflate compression method */
        Z_DEFLATED: 8
        //Z_NULL:                 null // Use -1 or null inline, depending on var type
      };

    }, {}], 45: [function (require, module, exports) {
      'use strict';

      // Note: we can't get significant speed boost here.
      // So write code to minimize size - no pregenerated tables
      // and array tools dependencies.

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      // Use ordinary array, since untyped makes no boost here
      function makeTable() {
        var c, table = [];

        for (var n = 0; n < 256; n++) {
          c = n;
          for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
          }
          table[n] = c;
        }

        return table;
      }

      // Create table on load. Just 255 signed longs. Not a problem.
      var crcTable = makeTable();


      function crc32(crc, buf, len, pos) {
        var t = crcTable,
          end = pos + len;

        crc ^= -1;

        for (var i = pos; i < end; i++) {
          crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
        }

        return (crc ^ (-1)); // >>> 0;
      }


      module.exports = crc32;

    }, {}], 46: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      var utils = require('../utils/common');
      var trees = require('./trees');
      var adler32 = require('./adler32');
      var crc32 = require('./crc32');
      var msg = require('./messages');

      /* Public constants ==========================================================*/
      /* ===========================================================================*/


      /* Allowed flush values; see deflate() and inflate() below for details */
      var Z_NO_FLUSH = 0;
      var Z_PARTIAL_FLUSH = 1;
      //var Z_SYNC_FLUSH    = 2;
      var Z_FULL_FLUSH = 3;
      var Z_FINISH = 4;
      var Z_BLOCK = 5;
      //var Z_TREES         = 6;


      /* Return codes for the compression/decompression functions. Negative values
       * are errors, positive values are used for special but normal events.
       */
      var Z_OK = 0;
      var Z_STREAM_END = 1;
      //var Z_NEED_DICT     = 2;
      //var Z_ERRNO         = -1;
      var Z_STREAM_ERROR = -2;
      var Z_DATA_ERROR = -3;
      //var Z_MEM_ERROR     = -4;
      var Z_BUF_ERROR = -5;
      //var Z_VERSION_ERROR = -6;


      /* compression levels */
      //var Z_NO_COMPRESSION      = 0;
      //var Z_BEST_SPEED          = 1;
      //var Z_BEST_COMPRESSION    = 9;
      var Z_DEFAULT_COMPRESSION = -1;


      var Z_FILTERED = 1;
      var Z_HUFFMAN_ONLY = 2;
      var Z_RLE = 3;
      var Z_FIXED = 4;
      var Z_DEFAULT_STRATEGY = 0;

      /* Possible values of the data_type field (though see inflate()) */
      //var Z_BINARY              = 0;
      //var Z_TEXT                = 1;
      //var Z_ASCII               = 1; // = Z_TEXT
      var Z_UNKNOWN = 2;


      /* The deflate compression method */
      var Z_DEFLATED = 8;

      /*============================================================================*/


      var MAX_MEM_LEVEL = 9;
      /* Maximum value for memLevel in deflateInit2 */
      var MAX_WBITS = 15;
      /* 32K LZ77 window */
      var DEF_MEM_LEVEL = 8;


      var LENGTH_CODES = 29;
      /* number of length codes, not counting the special END_BLOCK code */
      var LITERALS = 256;
      /* number of literal bytes 0..255 */
      var L_CODES = LITERALS + 1 + LENGTH_CODES;
      /* number of Literal or Length codes, including the END_BLOCK code */
      var D_CODES = 30;
      /* number of distance codes */
      var BL_CODES = 19;
      /* number of codes used to transfer the bit lengths */
      var HEAP_SIZE = 2 * L_CODES + 1;
      /* maximum heap size */
      var MAX_BITS = 15;
      /* All codes must not exceed MAX_BITS bits */

      var MIN_MATCH = 3;
      var MAX_MATCH = 258;
      var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

      var PRESET_DICT = 0x20;

      var INIT_STATE = 42;
      var EXTRA_STATE = 69;
      var NAME_STATE = 73;
      var COMMENT_STATE = 91;
      var HCRC_STATE = 103;
      var BUSY_STATE = 113;
      var FINISH_STATE = 666;

      var BS_NEED_MORE = 1; /* block not completed, need more input or more output */
      var BS_BLOCK_DONE = 2; /* block flush performed */
      var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
      var BS_FINISH_DONE = 4; /* finish done, accept no more input or output */

      var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

      function err(strm, errorCode) {
        strm.msg = msg[errorCode];
        return errorCode;
      }

      function rank(f) {
        return ((f) << 1) - ((f) > 4 ? 9 : 0);
      }

      function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


      /* =========================================================================
       * Flush as much pending output as possible. All deflate() output goes
       * through this function so some applications may wish to modify it
       * to avoid allocating a large strm->output buffer and copying into it.
       * (See also read_buf()).
       */
      function flush_pending(strm) {
        var s = strm.state;

        //_tr_flush_bits(s);
        var len = s.pending;
        if (len > strm.avail_out) {
          len = strm.avail_out;
        }
        if (len === 0) { return; }

        utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
        strm.next_out += len;
        s.pending_out += len;
        strm.total_out += len;
        strm.avail_out -= len;
        s.pending -= len;
        if (s.pending === 0) {
          s.pending_out = 0;
        }
      }


      function flush_block_only(s, last) {
        trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
        s.block_start = s.strstart;
        flush_pending(s.strm);
      }


      function put_byte(s, b) {
        s.pending_buf[s.pending++] = b;
      }


      /* =========================================================================
       * Put a short in the pending buffer. The 16-bit value is put in MSB order.
       * IN assertion: the stream state is correct and there is enough room in
       * pending_buf.
       */
      function putShortMSB(s, b) {
        //  put_byte(s, (Byte)(b >> 8));
        //  put_byte(s, (Byte)(b & 0xff));
        s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
        s.pending_buf[s.pending++] = b & 0xff;
      }


      /* ===========================================================================
       * Read a new buffer from the current input stream, update the adler32
       * and total number of bytes read.  All deflate() input goes through
       * this function so some applications may wish to modify it to avoid
       * allocating a large strm->input buffer and copying from it.
       * (See also flush_pending()).
       */
      function read_buf(strm, buf, start, size) {
        var len = strm.avail_in;

        if (len > size) { len = size; }
        if (len === 0) { return 0; }

        strm.avail_in -= len;

        // zmemcpy(buf, strm->next_in, len);
        utils.arraySet(buf, strm.input, strm.next_in, len, start);
        if (strm.state.wrap === 1) {
          strm.adler = adler32(strm.adler, buf, len, start);
        }

        else if (strm.state.wrap === 2) {
          strm.adler = crc32(strm.adler, buf, len, start);
        }

        strm.next_in += len;
        strm.total_in += len;

        return len;
      }


      /* ===========================================================================
       * Set match_start to the longest match starting at the given string and
       * return its length. Matches shorter or equal to prev_length are discarded,
       * in which case the result is equal to prev_length and match_start is
       * garbage.
       * IN assertions: cur_match is the head of the hash chain for the current
       *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
       * OUT assertion: the match length is not greater than s->lookahead.
       */
      function longest_match(s, cur_match) {
        var chain_length = s.max_chain_length;      /* max hash chain length */
        var scan = s.strstart; /* current string */
        var match;                       /* matched string */
        var len;                           /* length of current match */
        var best_len = s.prev_length;              /* best match length so far */
        var nice_match = s.nice_match;             /* stop if match long enough */
        var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
          s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

        var _win = s.window; // shortcut

        var wmask = s.w_mask;
        var prev = s.prev;

        /* Stop when cur_match becomes <= limit. To simplify the code,
         * we prevent matches with the string of window index 0.
         */

        var strend = s.strstart + MAX_MATCH;
        var scan_end1 = _win[scan + best_len - 1];
        var scan_end = _win[scan + best_len];

        /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
         * It is easy to get rid of this optimization if necessary.
         */
        // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

        /* Do not waste too much time if we already have a good match: */
        if (s.prev_length >= s.good_match) {
          chain_length >>= 2;
        }
        /* Do not look for matches beyond the end of the input. This is necessary
         * to make deflate deterministic.
         */
        if (nice_match > s.lookahead) { nice_match = s.lookahead; }

        // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

        do {
          // Assert(cur_match < s->strstart, "no future");
          match = cur_match;

          /* Skip to next match if the match length cannot increase
           * or if the match length is less than 2.  Note that the checks below
           * for insufficient lookahead only occur occasionally for performance
           * reasons.  Therefore uninitialized memory will be accessed, and
           * conditional jumps will be made that depend on those values.
           * However the length of the match is limited to the lookahead, so
           * the output of deflate is not affected by the uninitialized values.
           */

          if (_win[match + best_len] !== scan_end ||
            _win[match + best_len - 1] !== scan_end1 ||
            _win[match] !== _win[scan] ||
            _win[++match] !== _win[scan + 1]) {
            continue;
          }

          /* The check at best_len-1 can be removed because it will be made
           * again later. (This heuristic is not always a win.)
           * It is not necessary to compare scan[2] and match[2] since they
           * are always equal when the other bytes match, given that
           * the hash keys are equal and that HASH_BITS >= 8.
           */
          scan += 2;
          match++;
          // Assert(*scan == *match, "match[2]?");

          /* We check for insufficient lookahead only every 8th comparison;
           * the 256th check will be made at strstart+258.
           */
          do {
            /*jshint noempty:false*/
          } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
          _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
          _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
          _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
            scan < strend);

          // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

          len = MAX_MATCH - (strend - scan);
          scan = strend - MAX_MATCH;

          if (len > best_len) {
            s.match_start = cur_match;
            best_len = len;
            if (len >= nice_match) {
              break;
            }
            scan_end1 = _win[scan + best_len - 1];
            scan_end = _win[scan + best_len];
          }
        } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

        if (best_len <= s.lookahead) {
          return best_len;
        }
        return s.lookahead;
      }


      /* ===========================================================================
       * Fill the window when the lookahead becomes insufficient.
       * Updates strstart and lookahead.
       *
       * IN assertion: lookahead < MIN_LOOKAHEAD
       * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
       *    At least one byte has been read, or avail_in == 0; reads are
       *    performed for at least two bytes (required for the zip translate_eol
       *    option -- not supported here).
       */
      function fill_window(s) {
        var _w_size = s.w_size;
        var p, n, m, more, str;

        //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

        do {
          more = s.window_size - s.lookahead - s.strstart;

          // JS ints have 32 bit, block below not needed
          /* Deal with !@#$% 64K limit: */
          //if (sizeof(int) <= 2) {
          //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
          //        more = wsize;
          //
          //  } else if (more == (unsigned)(-1)) {
          //        /* Very unlikely, but possible on 16 bit machine if
          //         * strstart == 0 && lookahead == 1 (input done a byte at time)
          //         */
          //        more--;
          //    }
          //}


          /* If the window is almost full and there is insufficient lookahead,
           * move the upper half to the lower one to make room in the upper half.
           */
          if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

            utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
            s.match_start -= _w_size;
            s.strstart -= _w_size;
            /* we now have strstart >= MAX_DIST */
            s.block_start -= _w_size;

            /* Slide the hash table (could be avoided with 32 bit values
             at the expense of memory usage). We slide even when level == 0
             to keep the hash table consistent if we switch back to level > 0
             later. (Using level 0 permanently is not an optimal usage of
             zlib, so we don't care about this pathological case.)
             */

            n = s.hash_size;
            p = n;
            do {
              m = s.head[--p];
              s.head[p] = (m >= _w_size ? m - _w_size : 0);
            } while (--n);

            n = _w_size;
            p = n;
            do {
              m = s.prev[--p];
              s.prev[p] = (m >= _w_size ? m - _w_size : 0);
              /* If n is not on any hash chain, prev[n] is garbage but
               * its value will never be used.
               */
            } while (--n);

            more += _w_size;
          }
          if (s.strm.avail_in === 0) {
            break;
          }

          /* If there was no sliding:
           *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
           *    more == window_size - lookahead - strstart
           * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
           * => more >= window_size - 2*WSIZE + 2
           * In the BIG_MEM or MMAP case (not yet supported),
           *   window_size == input_size + MIN_LOOKAHEAD  &&
           *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
           * Otherwise, window_size == 2*WSIZE so more >= 2.
           * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
           */
          //Assert(more >= 2, "more < 2");
          n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
          s.lookahead += n;

          /* Initialize the hash value now that we have some input: */
          if (s.lookahead + s.insert >= MIN_MATCH) {
            str = s.strstart - s.insert;
            s.ins_h = s.window[str];

            /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
            //#if MIN_MATCH != 3
            //        Call update_hash() MIN_MATCH-3 more times
            //#endif
            while (s.insert) {
              /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
              s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

              s.prev[str & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = str;
              str++;
              s.insert--;
              if (s.lookahead + s.insert < MIN_MATCH) {
                break;
              }
            }
          }
          /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
           * but this is not important since only literal bytes will be emitted.
           */

        } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

        /* If the WIN_INIT bytes after the end of the current data have never been
         * written, then zero those bytes in order to avoid memory check reports of
         * the use of uninitialized (or uninitialised as Julian writes) bytes by
         * the longest match routines.  Update the high water mark for the next
         * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
         * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
         */
        //  if (s.high_water < s.window_size) {
        //    var curr = s.strstart + s.lookahead;
        //    var init = 0;
        //
        //    if (s.high_water < curr) {
        //      /* Previous high water mark below current data -- zero WIN_INIT
        //       * bytes or up to end of window, whichever is less.
        //       */
        //      init = s.window_size - curr;
        //      if (init > WIN_INIT)
        //        init = WIN_INIT;
        //      zmemzero(s->window + curr, (unsigned)init);
        //      s->high_water = curr + init;
        //    }
        //    else if (s->high_water < (ulg)curr + WIN_INIT) {
        //      /* High water mark at or above current data, but below current data
        //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
        //       * to end of window, whichever is less.
        //       */
        //      init = (ulg)curr + WIN_INIT - s->high_water;
        //      if (init > s->window_size - s->high_water)
        //        init = s->window_size - s->high_water;
        //      zmemzero(s->window + s->high_water, (unsigned)init);
        //      s->high_water += init;
        //    }
        //  }
        //
        //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
        //    "not enough room for search");
      }

      /* ===========================================================================
       * Copy without compression as much as possible from the input stream, return
       * the current block state.
       * This function does not insert new strings in the dictionary since
       * uncompressible data is probably not useful. This function is used
       * only for the level=0 compression option.
       * NOTE: this function should be optimized to avoid extra copying from
       * window to pending_buf.
       */
      function deflate_stored(s, flush) {
        /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
         * to pending_buf_size, and each stored block has a 5 byte header:
         */
        var max_block_size = 0xffff;

        if (max_block_size > s.pending_buf_size - 5) {
          max_block_size = s.pending_buf_size - 5;
        }

        /* Copy as much as possible from input to output: */
        for (; ;) {
          /* Fill the window as much as possible: */
          if (s.lookahead <= 1) {

            //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
            //  s->block_start >= (long)s->w_size, "slide too late");
            //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
            //        s.block_start >= s.w_size)) {
            //        throw  new Error("slide too late");
            //      }

            fill_window(s);
            if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }

            if (s.lookahead === 0) {
              break;
            }
            /* flush the current block */
          }
          //Assert(s->block_start >= 0L, "block gone");
          //    if (s.block_start < 0) throw new Error("block gone");

          s.strstart += s.lookahead;
          s.lookahead = 0;

          /* Emit a stored block if pending_buf will be full: */
          var max_start = s.block_start + max_block_size;

          if (s.strstart === 0 || s.strstart >= max_start) {
            /* strstart == 0 is possible when wraparound on 16-bit machine */
            s.lookahead = s.strstart - max_start;
            s.strstart = max_start;
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
            /***/


          }
          /* Flush if we may have to slide, otherwise block_start may become
           * negative and the data will be gone:
           */
          if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
            /***/
          }
        }

        s.insert = 0;

        if (flush === Z_FINISH) {
          /*** FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          /***/
          return BS_FINISH_DONE;
        }

        if (s.strstart > s.block_start) {
          /*** FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
          /***/
        }

        return BS_NEED_MORE;
      }

      /* ===========================================================================
       * Compress as much as possible from the input stream, return the current
       * block state.
       * This function does not perform lazy evaluation of matches and inserts
       * new strings in the dictionary only for unmatched strings or for short
       * matches. It is used only for the fast compression options.
       */
      function deflate_fast(s, flush) {
        var hash_head;        /* head of the hash chain */
        var bflush;           /* set if current block must be flushed */

        for (; ;) {
          /* Make sure that we always have enough lookahead, except
           * at the end of the input file. We need MAX_MATCH bytes
           * for the next match, plus MIN_MATCH bytes to insert the
           * string following the next match.
           */
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s);
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break; /* flush the current block */
            }
          }

          /* Insert the string window[strstart .. strstart+2] in the
           * dictionary, and set hash_head to the head of the hash chain:
           */
          hash_head = 0/*NIL*/;
          if (s.lookahead >= MIN_MATCH) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
            /***/
          }

          /* Find the longest match, discarding those <= prev_length.
           * At this point we have always match_length < MIN_MATCH
           */
          if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
            /* To simplify the code, we prevent matches with the string
             * of window index 0 (in particular we have to avoid a match
             * of the string with itself at the start of the input file).
             */
            s.match_length = longest_match(s, hash_head);
            /* longest_match() sets match_start */
          }
          if (s.match_length >= MIN_MATCH) {
            // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

            /*** _tr_tally_dist(s, s.strstart - s.match_start,
                           s.match_length - MIN_MATCH, bflush); ***/
            bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

            s.lookahead -= s.match_length;

            /* Insert new strings in the hash table only if the match length
             * is not too large. This saves time but degrades compression.
             */
            if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
              s.match_length--; /* string at strstart already in table */
              do {
                s.strstart++;
                /*** INSERT_STRING(s, s.strstart, hash_head); ***/
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
                /***/
                /* strstart never exceeds WSIZE-MAX_MATCH, so there are
                 * always MIN_MATCH bytes ahead.
                 */
              } while (--s.match_length !== 0);
              s.strstart++;
            } else {
              s.strstart += s.match_length;
              s.match_length = 0;
              s.ins_h = s.window[s.strstart];
              /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
              s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

              //#if MIN_MATCH != 3
              //                Call UPDATE_HASH() MIN_MATCH-3 more times
              //#endif
              /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
               * matter since it will be recomputed at next deflate call.
               */
            }
          } else {
            /* No match, output a literal byte */
            //Tracevv((stderr,"%c", s.window[s.strstart]));
            /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

            s.lookahead--;
            s.strstart++;
          }
          if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
            /***/
          }
        }
        s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
        if (flush === Z_FINISH) {
          /*** FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          /***/
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          /*** FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
          /***/
        }
        return BS_BLOCK_DONE;
      }

      /* ===========================================================================
       * Same as above, but achieves better compression. We use a lazy
       * evaluation for matches: a match is finally adopted only if there is
       * no better match at the next window position.
       */
      function deflate_slow(s, flush) {
        var hash_head;          /* head of hash chain */
        var bflush;              /* set if current block must be flushed */

        var max_insert;

        /* Process the input block. */
        for (; ;) {
          /* Make sure that we always have enough lookahead, except
           * at the end of the input file. We need MAX_MATCH bytes
           * for the next match, plus MIN_MATCH bytes to insert the
           * string following the next match.
           */
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s);
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) { break; } /* flush the current block */
          }

          /* Insert the string window[strstart .. strstart+2] in the
           * dictionary, and set hash_head to the head of the hash chain:
           */
          hash_head = 0/*NIL*/;
          if (s.lookahead >= MIN_MATCH) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
            /***/
          }

          /* Find the longest match, discarding those <= prev_length.
           */
          s.prev_length = s.match_length;
          s.prev_match = s.match_start;
          s.match_length = MIN_MATCH - 1;

          if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
            s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
            /* To simplify the code, we prevent matches with the string
             * of window index 0 (in particular we have to avoid a match
             * of the string with itself at the start of the input file).
             */
            s.match_length = longest_match(s, hash_head);
            /* longest_match() sets match_start */

            if (s.match_length <= 5 &&
              (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

              /* If prev_match is also MIN_MATCH, match_start is garbage
               * but we will ignore the current match anyway.
               */
              s.match_length = MIN_MATCH - 1;
            }
          }
          /* If there was a match at the previous step and the current
           * match is not better, output the previous match:
           */
          if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
            max_insert = s.strstart + s.lookahead - MIN_MATCH;
            /* Do not insert strings in hash table beyond this. */

            //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

            /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                           s.prev_length - MIN_MATCH, bflush);***/
            bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
            /* Insert in hash table all strings up to the end of the match.
             * strstart-1 and strstart are already inserted. If there is not
             * enough lookahead, the last two strings are not inserted in
             * the hash table.
             */
            s.lookahead -= s.prev_length - 1;
            s.prev_length -= 2;
            do {
              if (++s.strstart <= max_insert) {
                /*** INSERT_STRING(s, s.strstart, hash_head); ***/
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
                /***/
              }
            } while (--s.prev_length !== 0);
            s.match_available = 0;
            s.match_length = MIN_MATCH - 1;
            s.strstart++;

            if (bflush) {
              /*** FLUSH_BLOCK(s, 0); ***/
              flush_block_only(s, false);
              if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
              }
              /***/
            }

          } else if (s.match_available) {
            /* If there was no match at the previous position, output a
             * single literal. If there was a match but the current match
             * is longer, truncate the previous match to a single literal.
             */
            //Tracevv((stderr,"%c", s->window[s->strstart-1]));
            /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

            if (bflush) {
              /*** FLUSH_BLOCK_ONLY(s, 0) ***/
              flush_block_only(s, false);
              /***/
            }
            s.strstart++;
            s.lookahead--;
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          } else {
            /* There is no previous match to compare with, wait for
             * the next step to decide.
             */
            s.match_available = 1;
            s.strstart++;
            s.lookahead--;
          }
        }
        //Assert (flush != Z_NO_FLUSH, "no flush?");
        if (s.match_available) {
          //Tracevv((stderr,"%c", s->window[s->strstart-1]));
          /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

          s.match_available = 0;
        }
        s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
        if (flush === Z_FINISH) {
          /*** FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          /***/
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          /*** FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
          /***/
        }

        return BS_BLOCK_DONE;
      }


      /* ===========================================================================
       * For Z_RLE, simply look for runs of bytes, generate matches only of distance
       * one.  Do not maintain a hash table.  (It will be regenerated if this run of
       * deflate switches away from Z_RLE.)
       */
      function deflate_rle(s, flush) {
        var bflush;            /* set if current block must be flushed */
        var prev;              /* byte at distance one to match */
        var scan, strend;      /* scan goes up to strend for length of run */

        var _win = s.window;

        for (; ;) {
          /* Make sure that we always have enough lookahead, except
           * at the end of the input file. We need MAX_MATCH bytes
           * for the longest run, plus one for the unrolled loop.
           */
          if (s.lookahead <= MAX_MATCH) {
            fill_window(s);
            if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) { break; } /* flush the current block */
          }

          /* See how many times the previous byte repeats */
          s.match_length = 0;
          if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
            scan = s.strstart - 1;
            prev = _win[scan];
            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
              strend = s.strstart + MAX_MATCH;
              do {
                /*jshint noempty:false*/
              } while (prev === _win[++scan] && prev === _win[++scan] &&
              prev === _win[++scan] && prev === _win[++scan] &&
              prev === _win[++scan] && prev === _win[++scan] &&
              prev === _win[++scan] && prev === _win[++scan] &&
                scan < strend);
              s.match_length = MAX_MATCH - (strend - scan);
              if (s.match_length > s.lookahead) {
                s.match_length = s.lookahead;
              }
            }
            //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
          }

          /* Emit match if have run of MIN_MATCH or longer, else emit literal */
          if (s.match_length >= MIN_MATCH) {
            //check_match(s, s.strstart, s.strstart - 1, s.match_length);

            /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
            bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

            s.lookahead -= s.match_length;
            s.strstart += s.match_length;
            s.match_length = 0;
          } else {
            /* No match, output a literal byte */
            //Tracevv((stderr,"%c", s->window[s->strstart]));
            /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

            s.lookahead--;
            s.strstart++;
          }
          if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
            /***/
          }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
          /*** FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          /***/
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          /*** FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
          /***/
        }
        return BS_BLOCK_DONE;
      }

      /* ===========================================================================
       * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
       * (It will be regenerated if this run of deflate switches away from Huffman.)
       */
      function deflate_huff(s, flush) {
        var bflush;             /* set if current block must be flushed */

        for (; ;) {
          /* Make sure that we have a literal to write. */
          if (s.lookahead === 0) {
            fill_window(s);
            if (s.lookahead === 0) {
              if (flush === Z_NO_FLUSH) {
                return BS_NEED_MORE;
              }
              break;      /* flush the current block */
            }
          }

          /* Output a literal byte */
          s.match_length = 0;
          //Tracevv((stderr,"%c", s->window[s->strstart]));
          /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
          if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
            /***/
          }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
          /*** FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          /***/
          return BS_FINISH_DONE;
        }
        if (s.last_lit) {
          /*** FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
          /***/
        }
        return BS_BLOCK_DONE;
      }

      /* Values for max_lazy_match, good_match and max_chain_length, depending on
       * the desired pack level (0..9). The values given below have been tuned to
       * exclude worst case performance for pathological files. Better values may be
       * found for specific files.
       */
      function Config(good_length, max_lazy, nice_length, max_chain, func) {
        this.good_length = good_length;
        this.max_lazy = max_lazy;
        this.nice_length = nice_length;
        this.max_chain = max_chain;
        this.func = func;
      }

      var configuration_table;

      configuration_table = [
        /*      good lazy nice chain */
        new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
        new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
        new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
        new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

        new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
        new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
        new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
        new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
        new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
        new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
      ];


      /* ===========================================================================
       * Initialize the "longest match" routines for a new zlib stream
       */
      function lm_init(s) {
        s.window_size = 2 * s.w_size;

        /*** CLEAR_HASH(s); ***/
        zero(s.head); // Fill with NIL (= 0);

        /* Set the default configuration parameters:
         */
        s.max_lazy_match = configuration_table[s.level].max_lazy;
        s.good_match = configuration_table[s.level].good_length;
        s.nice_match = configuration_table[s.level].nice_length;
        s.max_chain_length = configuration_table[s.level].max_chain;

        s.strstart = 0;
        s.block_start = 0;
        s.lookahead = 0;
        s.insert = 0;
        s.match_length = s.prev_length = MIN_MATCH - 1;
        s.match_available = 0;
        s.ins_h = 0;
      }


      function DeflateState() {
        this.strm = null;            /* pointer back to this zlib stream */
        this.status = 0;            /* as the name implies */
        this.pending_buf = null;      /* output still pending */
        this.pending_buf_size = 0;  /* size of pending_buf */
        this.pending_out = 0;       /* next pending byte to output to the stream */
        this.pending = 0;           /* nb of bytes in the pending buffer */
        this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
        this.gzhead = null;         /* gzip header information to write */
        this.gzindex = 0;           /* where in extra, name, or comment */
        this.method = Z_DEFLATED; /* can only be DEFLATED */
        this.last_flush = -1;   /* value of flush param for previous deflate call */

        this.w_size = 0;  /* LZ77 window size (32K by default) */
        this.w_bits = 0;  /* log2(w_size)  (8..16) */
        this.w_mask = 0;  /* w_size - 1 */

        this.window = null;
        /* Sliding window. Input bytes are read into the second half of the window,
         * and move to the first half later to keep a dictionary of at least wSize
         * bytes. With this organization, matches are limited to a distance of
         * wSize-MAX_MATCH bytes, but this ensures that IO is always
         * performed with a length multiple of the block size.
         */

        this.window_size = 0;
        /* Actual size of window: 2*wSize, except when the user input buffer
         * is directly used as sliding window.
         */

        this.prev = null;
        /* Link to older string with same hash index. To limit the size of this
         * array to 64K, this link is maintained only for the last 32K strings.
         * An index in this array is thus a window index modulo 32K.
         */

        this.head = null;   /* Heads of the hash chains or NIL. */

        this.ins_h = 0;       /* hash index of string to be inserted */
        this.hash_size = 0;   /* number of elements in hash table */
        this.hash_bits = 0;   /* log2(hash_size) */
        this.hash_mask = 0;   /* hash_size-1 */

        this.hash_shift = 0;
        /* Number of bits by which ins_h must be shifted at each input
         * step. It must be such that after MIN_MATCH steps, the oldest
         * byte no longer takes part in the hash key, that is:
         *   hash_shift * MIN_MATCH >= hash_bits
         */

        this.block_start = 0;
        /* Window position at the beginning of the current output block. Gets
         * negative when the window is moved backwards.
         */

        this.match_length = 0;      /* length of best match */
        this.prev_match = 0;        /* previous match */
        this.match_available = 0;   /* set if previous match exists */
        this.strstart = 0;          /* start of string to insert */
        this.match_start = 0;       /* start of matching string */
        this.lookahead = 0;         /* number of valid bytes ahead in window */

        this.prev_length = 0;
        /* Length of the best match at previous step. Matches not greater than this
         * are discarded. This is used in the lazy match evaluation.
         */

        this.max_chain_length = 0;
        /* To speed up deflation, hash chains are never searched beyond this
         * length.  A higher limit improves compression ratio but degrades the
         * speed.
         */

        this.max_lazy_match = 0;
        /* Attempt to find a better match only when the current match is strictly
         * smaller than this value. This mechanism is used only for compression
         * levels >= 4.
         */
        // That's alias to max_lazy_match, don't use directly
        //this.max_insert_length = 0;
        /* Insert new strings in the hash table only if the match length is not
         * greater than this length. This saves time but degrades compression.
         * max_insert_length is used only for compression levels <= 3.
         */

        this.level = 0;     /* compression level (1..9) */
        this.strategy = 0;  /* favor or force Huffman coding*/

        this.good_match = 0;
        /* Use a faster search when the previous match is longer than this */

        this.nice_match = 0; /* Stop searching when current match exceeds this */

        /* used by trees.c: */

        /* Didn't use ct_data typedef below to suppress compiler warning */

        // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
        // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
        // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

        // Use flat array of DOUBLE size, with interleaved fata,
        // because JS does not support effective
        this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
        this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
        this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
        zero(this.dyn_ltree);
        zero(this.dyn_dtree);
        zero(this.bl_tree);

        this.l_desc = null;         /* desc. for literal tree */
        this.d_desc = null;         /* desc. for distance tree */
        this.bl_desc = null;         /* desc. for bit length tree */

        //ush bl_count[MAX_BITS+1];
        this.bl_count = new utils.Buf16(MAX_BITS + 1);
        /* number of codes at each bit length for an optimal tree */

        //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
        this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
        zero(this.heap);

        this.heap_len = 0;               /* number of elements in the heap */
        this.heap_max = 0;               /* element of largest frequency */
        /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
         * The same heap array is used to build all trees.
         */

        this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
        zero(this.depth);
        /* Depth of each subtree used as tie breaker for trees of equal frequency
         */

        this.l_buf = 0;          /* buffer index for literals or lengths */

        this.lit_bufsize = 0;
        /* Size of match buffer for literals/lengths.  There are 4 reasons for
         * limiting lit_bufsize to 64K:
         *   - frequencies can be kept in 16 bit counters
         *   - if compression is not successful for the first block, all input
         *     data is still in the window so we can still emit a stored block even
         *     when input comes from standard input.  (This can also be done for
         *     all blocks if lit_bufsize is not greater than 32K.)
         *   - if compression is not successful for a file smaller than 64K, we can
         *     even emit a stored file instead of a stored block (saving 5 bytes).
         *     This is applicable only for zip (not gzip or zlib).
         *   - creating new Huffman trees less frequently may not provide fast
         *     adaptation to changes in the input data statistics. (Take for
         *     example a binary file with poorly compressible code followed by
         *     a highly compressible string table.) Smaller buffer sizes give
         *     fast adaptation but have of course the overhead of transmitting
         *     trees more frequently.
         *   - I can't count above 4
         */

        this.last_lit = 0;      /* running index in l_buf */

        this.d_buf = 0;
        /* Buffer index for distances. To simplify the code, d_buf and l_buf have
         * the same number of elements. To use different lengths, an extra flag
         * array would be necessary.
         */

        this.opt_len = 0;       /* bit length of current block with optimal trees */
        this.static_len = 0;    /* bit length of current block with static trees */
        this.matches = 0;       /* number of string matches in current block */
        this.insert = 0;        /* bytes at end of window left to insert */


        this.bi_buf = 0;
        /* Output buffer. bits are inserted starting at the bottom (least
         * significant bits).
         */
        this.bi_valid = 0;
        /* Number of valid bits in bi_buf.  All bits above the last valid bit
         * are always zero.
         */

        // Used for window memory init. We safely ignore it for JS. That makes
        // sense only for pointers and memory check tools.
        //this.high_water = 0;
        /* High water mark offset in window for initialized bytes -- bytes above
         * this are set to zero in order to avoid memory check warnings when
         * longest match routines access bytes past the input.  This is then
         * updated to the new high water mark.
         */
      }


      function deflateResetKeep(strm) {
        var s;

        if (!strm || !strm.state) {
          return err(strm, Z_STREAM_ERROR);
        }

        strm.total_in = strm.total_out = 0;
        strm.data_type = Z_UNKNOWN;

        s = strm.state;
        s.pending = 0;
        s.pending_out = 0;

        if (s.wrap < 0) {
          s.wrap = -s.wrap;
          /* was made negative by deflate(..., Z_FINISH); */
        }
        s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
        strm.adler = (s.wrap === 2) ?
          0  // crc32(0, Z_NULL, 0)
          :
          1; // adler32(0, Z_NULL, 0)
        s.last_flush = Z_NO_FLUSH;
        trees._tr_init(s);
        return Z_OK;
      }


      function deflateReset(strm) {
        var ret = deflateResetKeep(strm);
        if (ret === Z_OK) {
          lm_init(strm.state);
        }
        return ret;
      }


      function deflateSetHeader(strm, head) {
        if (!strm || !strm.state) { return Z_STREAM_ERROR; }
        if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
        strm.state.gzhead = head;
        return Z_OK;
      }


      function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
        if (!strm) { // === Z_NULL
          return Z_STREAM_ERROR;
        }
        var wrap = 1;

        if (level === Z_DEFAULT_COMPRESSION) {
          level = 6;
        }

        if (windowBits < 0) { /* suppress zlib wrapper */
          wrap = 0;
          windowBits = -windowBits;
        }

        else if (windowBits > 15) {
          wrap = 2;           /* write gzip wrapper instead */
          windowBits -= 16;
        }


        if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
          windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
          strategy < 0 || strategy > Z_FIXED) {
          return err(strm, Z_STREAM_ERROR);
        }


        if (windowBits === 8) {
          windowBits = 9;
        }
        /* until 256-byte window bug fixed */

        var s = new DeflateState();

        strm.state = s;
        s.strm = strm;

        s.wrap = wrap;
        s.gzhead = null;
        s.w_bits = windowBits;
        s.w_size = 1 << s.w_bits;
        s.w_mask = s.w_size - 1;

        s.hash_bits = memLevel + 7;
        s.hash_size = 1 << s.hash_bits;
        s.hash_mask = s.hash_size - 1;
        s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

        s.window = new utils.Buf8(s.w_size * 2);
        s.head = new utils.Buf16(s.hash_size);
        s.prev = new utils.Buf16(s.w_size);

        // Don't need mem init magic for JS.
        //s.high_water = 0;  /* nothing written to s->window yet */

        s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

        s.pending_buf_size = s.lit_bufsize * 4;

        //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
        //s->pending_buf = (uchf *) overlay;
        s.pending_buf = new utils.Buf8(s.pending_buf_size);

        // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
        //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
        s.d_buf = 1 * s.lit_bufsize;

        //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
        s.l_buf = (1 + 2) * s.lit_bufsize;

        s.level = level;
        s.strategy = strategy;
        s.method = method;

        return deflateReset(strm);
      }

      function deflateInit(strm, level) {
        return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
      }


      function deflate(strm, flush) {
        var old_flush, s;
        var beg, val; // for gzip header write only

        if (!strm || !strm.state ||
          flush > Z_BLOCK || flush < 0) {
          return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
        }

        s = strm.state;

        if (!strm.output ||
          (!strm.input && strm.avail_in !== 0) ||
          (s.status === FINISH_STATE && flush !== Z_FINISH)) {
          return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
        }

        s.strm = strm; /* just in case */
        old_flush = s.last_flush;
        s.last_flush = flush;

        /* Write the header */
        if (s.status === INIT_STATE) {

          if (s.wrap === 2) { // GZIP header
            strm.adler = 0;  //crc32(0L, Z_NULL, 0);
            put_byte(s, 31);
            put_byte(s, 139);
            put_byte(s, 8);
            if (!s.gzhead) { // s->gzhead == Z_NULL
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, 0);
              put_byte(s, s.level === 9 ? 2 :
                (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                  4 : 0));
              put_byte(s, OS_CODE);
              s.status = BUSY_STATE;
            }
            else {
              put_byte(s, (s.gzhead.text ? 1 : 0) +
                (s.gzhead.hcrc ? 2 : 0) +
                (!s.gzhead.extra ? 0 : 4) +
                (!s.gzhead.name ? 0 : 8) +
                (!s.gzhead.comment ? 0 : 16)
              );
              put_byte(s, s.gzhead.time & 0xff);
              put_byte(s, (s.gzhead.time >> 8) & 0xff);
              put_byte(s, (s.gzhead.time >> 16) & 0xff);
              put_byte(s, (s.gzhead.time >> 24) & 0xff);
              put_byte(s, s.level === 9 ? 2 :
                (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                  4 : 0));
              put_byte(s, s.gzhead.os & 0xff);
              if (s.gzhead.extra && s.gzhead.extra.length) {
                put_byte(s, s.gzhead.extra.length & 0xff);
                put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
              }
              if (s.gzhead.hcrc) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
              }
              s.gzindex = 0;
              s.status = EXTRA_STATE;
            }
          }
          else // DEFLATE header
          {
            var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
            var level_flags = -1;

            if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
              level_flags = 0;
            } else if (s.level < 6) {
              level_flags = 1;
            } else if (s.level === 6) {
              level_flags = 2;
            } else {
              level_flags = 3;
            }
            header |= (level_flags << 6);
            if (s.strstart !== 0) { header |= PRESET_DICT; }
            header += 31 - (header % 31);

            s.status = BUSY_STATE;
            putShortMSB(s, header);

            /* Save the adler32 of the preset dictionary: */
            if (s.strstart !== 0) {
              putShortMSB(s, strm.adler >>> 16);
              putShortMSB(s, strm.adler & 0xffff);
            }
            strm.adler = 1; // adler32(0L, Z_NULL, 0);
          }
        }

        //#ifdef GZIP
        if (s.status === EXTRA_STATE) {
          if (s.gzhead.extra/* != Z_NULL*/) {
            beg = s.pending;  /* start of bytes to update crc */

            while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                beg = s.pending;
                if (s.pending === s.pending_buf_size) {
                  break;
                }
              }
              put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
              s.gzindex++;
            }
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            if (s.gzindex === s.gzhead.extra.length) {
              s.gzindex = 0;
              s.status = NAME_STATE;
            }
          }
          else {
            s.status = NAME_STATE;
          }
        }
        if (s.status === NAME_STATE) {
          if (s.gzhead.name/* != Z_NULL*/) {
            beg = s.pending;  /* start of bytes to update crc */
            //int val;

            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                beg = s.pending;
                if (s.pending === s.pending_buf_size) {
                  val = 1;
                  break;
                }
              }
              // JS specific: little magic to add zero terminator to end of string
              if (s.gzindex < s.gzhead.name.length) {
                val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
              } else {
                val = 0;
              }
              put_byte(s, val);
            } while (val !== 0);

            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            if (val === 0) {
              s.gzindex = 0;
              s.status = COMMENT_STATE;
            }
          }
          else {
            s.status = COMMENT_STATE;
          }
        }
        if (s.status === COMMENT_STATE) {
          if (s.gzhead.comment/* != Z_NULL*/) {
            beg = s.pending;  /* start of bytes to update crc */
            //int val;

            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                beg = s.pending;
                if (s.pending === s.pending_buf_size) {
                  val = 1;
                  break;
                }
              }
              // JS specific: little magic to add zero terminator to end of string
              if (s.gzindex < s.gzhead.comment.length) {
                val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
              } else {
                val = 0;
              }
              put_byte(s, val);
            } while (val !== 0);

            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            if (val === 0) {
              s.status = HCRC_STATE;
            }
          }
          else {
            s.status = HCRC_STATE;
          }
        }
        if (s.status === HCRC_STATE) {
          if (s.gzhead.hcrc) {
            if (s.pending + 2 > s.pending_buf_size) {
              flush_pending(strm);
            }
            if (s.pending + 2 <= s.pending_buf_size) {
              put_byte(s, strm.adler & 0xff);
              put_byte(s, (strm.adler >> 8) & 0xff);
              strm.adler = 0; //crc32(0L, Z_NULL, 0);
              s.status = BUSY_STATE;
            }
          }
          else {
            s.status = BUSY_STATE;
          }
        }
        //#endif

        /* Flush as much pending output as possible */
        if (s.pending !== 0) {
          flush_pending(strm);
          if (strm.avail_out === 0) {
            /* Since avail_out is 0, deflate will be called again with
             * more output space, but possibly with both pending and
             * avail_in equal to zero. There won't be anything to do,
             * but this is not an error situation so make sure we
             * return OK instead of BUF_ERROR at next call of deflate:
             */
            s.last_flush = -1;
            return Z_OK;
          }

          /* Make sure there is something to do and avoid duplicate consecutive
           * flushes. For repeated and useless calls with Z_FINISH, we keep
           * returning Z_STREAM_END instead of Z_BUF_ERROR.
           */
        } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
          flush !== Z_FINISH) {
          return err(strm, Z_BUF_ERROR);
        }

        /* User must not provide more input after the first FINISH: */
        if (s.status === FINISH_STATE && strm.avail_in !== 0) {
          return err(strm, Z_BUF_ERROR);
        }

        /* Start a new block or continue the current one.
         */
        if (strm.avail_in !== 0 || s.lookahead !== 0 ||
          (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
          var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
            (s.strategy === Z_RLE ? deflate_rle(s, flush) :
              configuration_table[s.level].func(s, flush));

          if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
            s.status = FINISH_STATE;
          }
          if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
            if (strm.avail_out === 0) {
              s.last_flush = -1;
              /* avoid BUF_ERROR next call, see above */
            }
            return Z_OK;
            /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
             * of deflate should use the same flush parameter to make sure
             * that the flush is complete. So we don't have to output an
             * empty block here, this will be done at next call. This also
             * ensures that for a very small output buffer, we emit at most
             * one empty block.
             */
          }
          if (bstate === BS_BLOCK_DONE) {
            if (flush === Z_PARTIAL_FLUSH) {
              trees._tr_align(s);
            }
            else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

              trees._tr_stored_block(s, 0, 0, false);
              /* For a full flush, this empty block will be recognized
               * as a special marker by inflate_sync().
               */
              if (flush === Z_FULL_FLUSH) {
                /*** CLEAR_HASH(s); ***/             /* forget history */
                zero(s.head); // Fill with NIL (= 0);

                if (s.lookahead === 0) {
                  s.strstart = 0;
                  s.block_start = 0;
                  s.insert = 0;
                }
              }
            }
            flush_pending(strm);
            if (strm.avail_out === 0) {
              s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
              return Z_OK;
            }
          }
        }
        //Assert(strm->avail_out > 0, "bug2");
        //if (strm.avail_out <= 0) { throw new Error("bug2");}

        if (flush !== Z_FINISH) { return Z_OK; }
        if (s.wrap <= 0) { return Z_STREAM_END; }

        /* Write the trailer */
        if (s.wrap === 2) {
          put_byte(s, strm.adler & 0xff);
          put_byte(s, (strm.adler >> 8) & 0xff);
          put_byte(s, (strm.adler >> 16) & 0xff);
          put_byte(s, (strm.adler >> 24) & 0xff);
          put_byte(s, strm.total_in & 0xff);
          put_byte(s, (strm.total_in >> 8) & 0xff);
          put_byte(s, (strm.total_in >> 16) & 0xff);
          put_byte(s, (strm.total_in >> 24) & 0xff);
        }
        else {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 0xffff);
        }

        flush_pending(strm);
        /* If avail_out is zero, the application will call deflate again
         * to flush the rest.
         */
        if (s.wrap > 0) { s.wrap = -s.wrap; }
        /* write the trailer only once! */
        return s.pending !== 0 ? Z_OK : Z_STREAM_END;
      }

      function deflateEnd(strm) {
        var status;

        if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
          return Z_STREAM_ERROR;
        }

        status = strm.state.status;
        if (status !== INIT_STATE &&
          status !== EXTRA_STATE &&
          status !== NAME_STATE &&
          status !== COMMENT_STATE &&
          status !== HCRC_STATE &&
          status !== BUSY_STATE &&
          status !== FINISH_STATE
        ) {
          return err(strm, Z_STREAM_ERROR);
        }

        strm.state = null;

        return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
      }


      /* =========================================================================
       * Initializes the compression dictionary from the given byte
       * sequence without producing any compressed output.
       */
      function deflateSetDictionary(strm, dictionary) {
        var dictLength = dictionary.length;

        var s;
        var str, n;
        var wrap;
        var avail;
        var next;
        var input;
        var tmpDict;

        if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
          return Z_STREAM_ERROR;
        }

        s = strm.state;
        wrap = s.wrap;

        if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
          return Z_STREAM_ERROR;
        }

        /* when using zlib wrappers, compute Adler-32 for provided dictionary */
        if (wrap === 1) {
          /* adler32(strm->adler, dictionary, dictLength); */
          strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
        }

        s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

        /* if dictionary would fill window, just replace the history */
        if (dictLength >= s.w_size) {
          if (wrap === 0) {            /* already empty otherwise */
            /*** CLEAR_HASH(s); ***/
            zero(s.head); // Fill with NIL (= 0);
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
          /* use the tail */
          // dictionary = dictionary.slice(dictLength - s.w_size);
          tmpDict = new utils.Buf8(s.w_size);
          utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
          dictionary = tmpDict;
          dictLength = s.w_size;
        }
        /* insert dictionary into window and hash */
        avail = strm.avail_in;
        next = strm.next_in;
        input = strm.input;
        strm.avail_in = dictLength;
        strm.next_in = 0;
        strm.input = dictionary;
        fill_window(s);
        while (s.lookahead >= MIN_MATCH) {
          str = s.strstart;
          n = s.lookahead - (MIN_MATCH - 1);
          do {
            /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

            s.prev[str & s.w_mask] = s.head[s.ins_h];

            s.head[s.ins_h] = str;
            str++;
          } while (--n);
          s.strstart = str;
          s.lookahead = MIN_MATCH - 1;
          fill_window(s);
        }
        s.strstart += s.lookahead;
        s.block_start = s.strstart;
        s.insert = s.lookahead;
        s.lookahead = 0;
        s.match_length = s.prev_length = MIN_MATCH - 1;
        s.match_available = 0;
        strm.next_in = next;
        strm.input = input;
        strm.avail_in = avail;
        s.wrap = wrap;
        return Z_OK;
      }


      exports.deflateInit = deflateInit;
      exports.deflateInit2 = deflateInit2;
      exports.deflateReset = deflateReset;
      exports.deflateResetKeep = deflateResetKeep;
      exports.deflateSetHeader = deflateSetHeader;
      exports.deflate = deflate;
      exports.deflateEnd = deflateEnd;
      exports.deflateSetDictionary = deflateSetDictionary;
      exports.deflateInfo = 'pako deflate (from Nodeca project)';

      /* Not implemented
      exports.deflateBound = deflateBound;
      exports.deflateCopy = deflateCopy;
      exports.deflateParams = deflateParams;
      exports.deflatePending = deflatePending;
      exports.deflatePrime = deflatePrime;
      exports.deflateTune = deflateTune;
      */

    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      function GZheader() {
        /* true if compressed data believed to be text */
        this.text = 0;
        /* modification time */
        this.time = 0;
        /* extra flags (not used when writing a gzip file) */
        this.xflags = 0;
        /* operating system */
        this.os = 0;
        /* pointer to extra field or Z_NULL if none */
        this.extra = null;
        /* extra field length (valid if extra != Z_NULL) */
        this.extra_len = 0; // Actually, we don't need it in JS,
        // but leave for few code modifications

        //
        // Setup limits is not necessary because in js we should not preallocate memory
        // for inflate use constant limit in 65536 bytes
        //

        /* space at extra (only when reading header) */
        // this.extra_max  = 0;
        /* pointer to zero-terminated file name or Z_NULL */
        this.name = '';
        /* space at name (only when reading header) */
        // this.name_max   = 0;
        /* pointer to zero-terminated comment or Z_NULL */
        this.comment = '';
        /* space at comment (only when reading header) */
        // this.comm_max   = 0;
        /* true if there was or will be a header crc */
        this.hcrc = 0;
        /* true when done reading gzip header (not used when writing a gzip file) */
        this.done = false;
      }

      module.exports = GZheader;

    }, {}], 48: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      // See state defs from inflate.js
      var BAD = 30;       /* got a data error -- remain here until reset */
      var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

      /*
         Decode literal, length, and distance codes and write out the resulting
         literal and match bytes until either not enough input or output is
         available, an end-of-block is encountered, or a data error is encountered.
         When large enough input and output buffers are supplied to inflate(), for
         example, a 16K input buffer and a 64K output buffer, more than 95% of the
         inflate execution time is spent in this routine.
      
         Entry assumptions:
      
              state.mode === LEN
              strm.avail_in >= 6
              strm.avail_out >= 258
              start >= strm.avail_out
              state.bits < 8
      
         On return, state.mode is one of:
      
              LEN -- ran out of enough output space or enough available input
              TYPE -- reached end of block code, inflate() to interpret next block
              BAD -- error in block data
      
         Notes:
      
          - The maximum input bits used by a length/distance pair is 15 bits for the
            length code, 5 bits for the length extra, 15 bits for the distance code,
            and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
            Therefore if strm.avail_in >= 6, then there is enough input to avoid
            checking for available input while decoding.
      
          - The maximum bytes that a single length/distance pair can output is 258
            bytes, which is the maximum length that can be coded.  inflate_fast()
            requires strm.avail_out >= 258 for each loop to avoid checking for
            output space.
       */
      module.exports = function inflate_fast(strm, start) {
        var state;
        var _in;                    /* local strm.input */
        var last;                   /* have enough input while in < last */
        var _out;                   /* local strm.output */
        var beg;                    /* inflate()'s initial strm.output */
        var end;                    /* while out < end, enough space available */
        //#ifdef INFLATE_STRICT
        var dmax;                   /* maximum distance from zlib header */
        //#endif
        var wsize;                  /* window size or zero if not using window */
        var whave;                  /* valid bytes in the window */
        var wnext;                  /* window write index */
        // Use `s_window` instead `window`, avoid conflict with instrumentation tools
        var s_window;               /* allocated sliding window, if wsize != 0 */
        var hold;                   /* local strm.hold */
        var bits;                   /* local strm.bits */
        var lcode;                  /* local strm.lencode */
        var dcode;                  /* local strm.distcode */
        var lmask;                  /* mask for first level of length codes */
        var dmask;                  /* mask for first level of distance codes */
        var here;                   /* retrieved table entry */
        var op;                     /* code bits, operation, extra bits, or */
        /*  window position, window bytes to copy */
        var len;                    /* match length, unused bytes */
        var dist;                   /* match distance */
        var from;                   /* where to copy match from */
        var from_source;


        var input, output; // JS specific, because we have no pointers

        /* copy state to local variables */
        state = strm.state;
        //here = state.here;
        _in = strm.next_in;
        input = strm.input;
        last = _in + (strm.avail_in - 5);
        _out = strm.next_out;
        output = strm.output;
        beg = _out - (start - strm.avail_out);
        end = _out + (strm.avail_out - 257);
        //#ifdef INFLATE_STRICT
        dmax = state.dmax;
        //#endif
        wsize = state.wsize;
        whave = state.whave;
        wnext = state.wnext;
        s_window = state.window;
        hold = state.hold;
        bits = state.bits;
        lcode = state.lencode;
        dcode = state.distcode;
        lmask = (1 << state.lenbits) - 1;
        dmask = (1 << state.distbits) - 1;


        /* decode literals and length/distances until end-of-block or not enough
           input data or output space */

        top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }

          here = lcode[hold & lmask];

          dolen:
          for (; ;) { // Goto emulation
            op = here >>> 24/*here.bits*/;
            hold >>>= op;
            bits -= op;
            op = (here >>> 16) & 0xff/*here.op*/;
            if (op === 0) {                          /* literal */
              //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
              //        "inflate:         literal '%c'\n" :
              //        "inflate:         literal 0x%02x\n", here.val));
              output[_out++] = here & 0xffff/*here.val*/;
            }
            else if (op & 16) {                     /* length base */
              len = here & 0xffff/*here.val*/;
              op &= 15;                           /* number of extra bits */
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & ((1 << op) - 1);
                hold >>>= op;
                bits -= op;
              }
              //Tracevv((stderr, "inflate:         length %u\n", len));
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];

              dodist:
              for (; ;) { // goto emulation
                op = here >>> 24/*here.bits*/;
                hold >>>= op;
                bits -= op;
                op = (here >>> 16) & 0xff/*here.op*/;

                if (op & 16) {                      /* distance base */
                  dist = here & 0xffff/*here.val*/;
                  op &= 15;                       /* number of extra bits */
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                    }
                  }
                  dist += hold & ((1 << op) - 1);
                  //#ifdef INFLATE_STRICT
                  if (dist > dmax) {
                    strm.msg = 'invalid distance too far back';
                    state.mode = BAD;
                    break top;
                  }
                  //#endif
                  hold >>>= op;
                  bits -= op;
                  //Tracevv((stderr, "inflate:         distance %u\n", dist));
                  op = _out - beg;                /* max distance in output */
                  if (dist > op) {                /* see if copy from window */
                    op = dist - op;               /* distance back in window */
                    if (op > whave) {
                      if (state.sane) {
                        strm.msg = 'invalid distance too far back';
                        state.mode = BAD;
                        break top;
                      }

                      // (!) This block is disabled in zlib defailts,
                      // don't enable it for binary compatibility
                      //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                      //                if (len <= op - whave) {
                      //                  do {
                      //                    output[_out++] = 0;
                      //                  } while (--len);
                      //                  continue top;
                      //                }
                      //                len -= op - whave;
                      //                do {
                      //                  output[_out++] = 0;
                      //                } while (--op > whave);
                      //                if (op === 0) {
                      //                  from = _out - dist;
                      //                  do {
                      //                    output[_out++] = output[from++];
                      //                  } while (--len);
                      //                  continue top;
                      //                }
                      //#endif
                    }
                    from = 0; // window index
                    from_source = s_window;
                    if (wnext === 0) {           /* very common case */
                      from += wsize - op;
                      if (op < len) {         /* some from window */
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;  /* rest from output */
                        from_source = output;
                      }
                    }
                    else if (wnext < op) {      /* wrap around window */
                      from += wsize + wnext - op;
                      op -= wnext;
                      if (op < len) {         /* some from end of window */
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = 0;
                        if (wnext < len) {  /* some from start of window */
                          op = wnext;
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;      /* rest from output */
                          from_source = output;
                        }
                      }
                    }
                    else {                      /* contiguous in window */
                      from += wnext - op;
                      if (op < len) {         /* some from window */
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;  /* rest from output */
                        from_source = output;
                      }
                    }
                    while (len > 2) {
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      len -= 3;
                    }
                    if (len) {
                      output[_out++] = from_source[from++];
                      if (len > 1) {
                        output[_out++] = from_source[from++];
                      }
                    }
                  }
                  else {
                    from = _out - dist;          /* copy direct from output */
                    do {                        /* minimum length is three */
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      len -= 3;
                    } while (len > 2);
                    if (len) {
                      output[_out++] = output[from++];
                      if (len > 1) {
                        output[_out++] = output[from++];
                      }
                    }
                  }
                }
                else if ((op & 64) === 0) {          /* 2nd level distance code */
                  here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
                  continue dodist;
                }
                else {
                  strm.msg = 'invalid distance code';
                  state.mode = BAD;
                  break top;
                }

                break; // need to emulate goto via "continue"
              }
            }
            else if ((op & 64) === 0) {              /* 2nd level length code */
              here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
              continue dolen;
            }
            else if (op & 32) {                     /* end-of-block */
              //Tracevv((stderr, "inflate:         end of block\n"));
              state.mode = TYPE;
              break top;
            }
            else {
              strm.msg = 'invalid literal/length code';
              state.mode = BAD;
              break top;
            }

            break; // need to emulate goto via "continue"
          }
        } while (_in < last && _out < end);

        /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
        len = bits >> 3;
        _in -= len;
        bits -= len << 3;
        hold &= (1 << bits) - 1;

        /* update state and return */
        strm.next_in = _in;
        strm.next_out = _out;
        strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
        strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
        state.hold = hold;
        state.bits = bits;
        return;
      };

    }, {}], 49: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      var utils = require('../utils/common');
      var adler32 = require('./adler32');
      var crc32 = require('./crc32');
      var inflate_fast = require('./inffast');
      var inflate_table = require('./inftrees');

      var CODES = 0;
      var LENS = 1;
      var DISTS = 2;

      /* Public constants ==========================================================*/
      /* ===========================================================================*/


      /* Allowed flush values; see deflate() and inflate() below for details */
      //var Z_NO_FLUSH      = 0;
      //var Z_PARTIAL_FLUSH = 1;
      //var Z_SYNC_FLUSH    = 2;
      //var Z_FULL_FLUSH    = 3;
      var Z_FINISH = 4;
      var Z_BLOCK = 5;
      var Z_TREES = 6;


      /* Return codes for the compression/decompression functions. Negative values
       * are errors, positive values are used for special but normal events.
       */
      var Z_OK = 0;
      var Z_STREAM_END = 1;
      var Z_NEED_DICT = 2;
      //var Z_ERRNO         = -1;
      var Z_STREAM_ERROR = -2;
      var Z_DATA_ERROR = -3;
      var Z_MEM_ERROR = -4;
      var Z_BUF_ERROR = -5;
      //var Z_VERSION_ERROR = -6;

      /* The deflate compression method */
      var Z_DEFLATED = 8;


      /* STATES ====================================================================*/
      /* ===========================================================================*/


      var HEAD = 1;       /* i: waiting for magic header */
      var FLAGS = 2;      /* i: waiting for method and flags (gzip) */
      var TIME = 3;       /* i: waiting for modification time (gzip) */
      var OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
      var EXLEN = 5;      /* i: waiting for extra length (gzip) */
      var EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
      var NAME = 7;       /* i: waiting for end of file name (gzip) */
      var COMMENT = 8;    /* i: waiting for end of comment (gzip) */
      var HCRC = 9;       /* i: waiting for header crc (gzip) */
      var DICTID = 10;    /* i: waiting for dictionary check value */
      var DICT = 11;      /* waiting for inflateSetDictionary() call */
      var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
      var TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
      var STORED = 14;    /* i: waiting for stored size (length and complement) */
      var COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
      var COPY = 16;      /* i/o: waiting for input or output to copy stored block */
      var TABLE = 17;     /* i: waiting for dynamic block table lengths */
      var LENLENS = 18;   /* i: waiting for code length code lengths */
      var CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
      var LEN_ = 20;      /* i: same as LEN below, but only first time in */
      var LEN = 21;       /* i: waiting for length/lit/eob code */
      var LENEXT = 22;    /* i: waiting for length extra bits */
      var DIST = 23;      /* i: waiting for distance code */
      var DISTEXT = 24;   /* i: waiting for distance extra bits */
      var MATCH = 25;     /* o: waiting for output space to copy string */
      var LIT = 26;       /* o: waiting for output space to write literal */
      var CHECK = 27;     /* i: waiting for 32-bit check value */
      var LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
      var DONE = 29;      /* finished check, done -- remain here until reset */
      var BAD = 30;       /* got a data error -- remain here until reset */
      var MEM = 31;       /* got an inflate() memory error -- remain here until reset */
      var SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

      /* ===========================================================================*/



      var ENOUGH_LENS = 852;
      var ENOUGH_DISTS = 592;
      //var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

      var MAX_WBITS = 15;
      /* 32K LZ77 window */
      var DEF_WBITS = MAX_WBITS;


      function zswap32(q) {
        return (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
      }


      function InflateState() {
        this.mode = 0;             /* current inflate mode */
        this.last = false;          /* true if processing last block */
        this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
        this.havedict = false;      /* true if dictionary provided */
        this.flags = 0;             /* gzip header method and flags (0 if zlib) */
        this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
        this.check = 0;             /* protected copy of check value */
        this.total = 0;             /* protected copy of output count */
        // TODO: may be {}
        this.head = null;           /* where to save gzip header information */

        /* sliding window */
        this.wbits = 0;             /* log base 2 of requested window size */
        this.wsize = 0;             /* window size or zero if not using window */
        this.whave = 0;             /* valid bytes in the window */
        this.wnext = 0;             /* window write index */
        this.window = null;         /* allocated sliding window, if needed */

        /* bit accumulator */
        this.hold = 0;              /* input bit accumulator */
        this.bits = 0;              /* number of bits in "in" */

        /* for string and stored block copying */
        this.length = 0;            /* literal or length of data to copy */
        this.offset = 0;            /* distance back to copy string from */

        /* for table and code decoding */
        this.extra = 0;             /* extra bits needed */

        /* fixed and dynamic code tables */
        this.lencode = null;          /* starting table for length/literal codes */
        this.distcode = null;         /* starting table for distance codes */
        this.lenbits = 0;           /* index bits for lencode */
        this.distbits = 0;          /* index bits for distcode */

        /* dynamic table building */
        this.ncode = 0;             /* number of code length code lengths */
        this.nlen = 0;              /* number of length code lengths */
        this.ndist = 0;             /* number of distance code lengths */
        this.have = 0;              /* number of code lengths in lens[] */
        this.next = null;              /* next available space in codes[] */

        this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
        this.work = new utils.Buf16(288); /* work area for code table building */

        /*
         because we don't have pointers in js, we use lencode and distcode directly
         as buffers so we don't need codes
        */
        //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
        this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
        this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
        this.sane = 0;                   /* if false, allow invalid distance too far */
        this.back = 0;                   /* bits back of last unprocessed length/lit */
        this.was = 0;                    /* initial length of match */
      }

      function inflateResetKeep(strm) {
        var state;

        if (!strm || !strm.state) { return Z_STREAM_ERROR; }
        state = strm.state;
        strm.total_in = strm.total_out = state.total = 0;
        strm.msg = ''; /*Z_NULL*/
        if (state.wrap) {       /* to support ill-conceived Java test suite */
          strm.adler = state.wrap & 1;
        }
        state.mode = HEAD;
        state.last = 0;
        state.havedict = 0;
        state.dmax = 32768;
        state.head = null/*Z_NULL*/;
        state.hold = 0;
        state.bits = 0;
        //state.lencode = state.distcode = state.next = state.codes;
        state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
        state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

        state.sane = 1;
        state.back = -1;
        //Tracev((stderr, "inflate: reset\n"));
        return Z_OK;
      }

      function inflateReset(strm) {
        var state;

        if (!strm || !strm.state) { return Z_STREAM_ERROR; }
        state = strm.state;
        state.wsize = 0;
        state.whave = 0;
        state.wnext = 0;
        return inflateResetKeep(strm);

      }

      function inflateReset2(strm, windowBits) {
        var wrap;
        var state;

        /* get the state */
        if (!strm || !strm.state) { return Z_STREAM_ERROR; }
        state = strm.state;

        /* extract wrap request from windowBits parameter */
        if (windowBits < 0) {
          wrap = 0;
          windowBits = -windowBits;
        }
        else {
          wrap = (windowBits >> 4) + 1;
          if (windowBits < 48) {
            windowBits &= 15;
          }
        }

        /* set number of window bits, free window if different */
        if (windowBits && (windowBits < 8 || windowBits > 15)) {
          return Z_STREAM_ERROR;
        }
        if (state.window !== null && state.wbits !== windowBits) {
          state.window = null;
        }

        /* update state and reset the rest of it */
        state.wrap = wrap;
        state.wbits = windowBits;
        return inflateReset(strm);
      }

      function inflateInit2(strm, windowBits) {
        var ret;
        var state;

        if (!strm) { return Z_STREAM_ERROR; }
        //strm.msg = Z_NULL;                 /* in case we return an error */

        state = new InflateState();

        //if (state === Z_NULL) return Z_MEM_ERROR;
        //Tracev((stderr, "inflate: allocated\n"));
        strm.state = state;
        state.window = null/*Z_NULL*/;
        ret = inflateReset2(strm, windowBits);
        if (ret !== Z_OK) {
          strm.state = null/*Z_NULL*/;
        }
        return ret;
      }

      function inflateInit(strm) {
        return inflateInit2(strm, DEF_WBITS);
      }


      /*
       Return state with length and distance decoding tables and index sizes set to
       fixed code decoding.  Normally this returns fixed tables from inffixed.h.
       If BUILDFIXED is defined, then instead this routine builds the tables the
       first time it's called, and returns those tables the first time and
       thereafter.  This reduces the size of the code by about 2K bytes, in
       exchange for a little execution time.  However, BUILDFIXED should not be
       used for threaded applications, since the rewriting of the tables and virgin
       may not be thread-safe.
       */
      var virgin = true;

      var lenfix, distfix; // We have no pointers in JS, so keep tables separate

      function fixedtables(state) {
        /* build fixed huffman tables if first call (may not be thread safe) */
        if (virgin) {
          var sym;

          lenfix = new utils.Buf32(512);
          distfix = new utils.Buf32(32);

          /* literal/length table */
          sym = 0;
          while (sym < 144) { state.lens[sym++] = 8; }
          while (sym < 256) { state.lens[sym++] = 9; }
          while (sym < 280) { state.lens[sym++] = 7; }
          while (sym < 288) { state.lens[sym++] = 8; }

          inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });

          /* distance table */
          sym = 0;
          while (sym < 32) { state.lens[sym++] = 5; }

          inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });

          /* do this just once */
          virgin = false;
        }

        state.lencode = lenfix;
        state.lenbits = 9;
        state.distcode = distfix;
        state.distbits = 5;
      }


      /*
       Update the window with the last wsize (normally 32K) bytes written before
       returning.  If window does not exist yet, create it.  This is only called
       when a window is already in use, or when output has been written during this
       inflate call, but the end of the deflate stream has not been reached yet.
       It is also called to create a window for dictionary data when a dictionary
       is loaded.
      
       Providing output buffers larger than 32K to inflate() should provide a speed
       advantage, since only the last 32K of output is copied to the sliding window
       upon return from inflate(), and since all distances after the first 32K of
       output will fall in the output data, making match copies simpler and faster.
       The advantage may be dependent on the size of the processor's data caches.
       */
      function updatewindow(strm, src, end, copy) {
        var dist;
        var state = strm.state;

        /* if it hasn't been done already, allocate space for the window */
        if (state.window === null) {
          state.wsize = 1 << state.wbits;
          state.wnext = 0;
          state.whave = 0;

          state.window = new utils.Buf8(state.wsize);
        }

        /* copy state->wsize or less output bytes into the circular window */
        if (copy >= state.wsize) {
          utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
          state.wnext = 0;
          state.whave = state.wsize;
        }
        else {
          dist = state.wsize - state.wnext;
          if (dist > copy) {
            dist = copy;
          }
          //zmemcpy(state->window + state->wnext, end - copy, dist);
          utils.arraySet(state.window, src, end - copy, dist, state.wnext);
          copy -= dist;
          if (copy) {
            //zmemcpy(state->window, end - copy, copy);
            utils.arraySet(state.window, src, end - copy, copy, 0);
            state.wnext = copy;
            state.whave = state.wsize;
          }
          else {
            state.wnext += dist;
            if (state.wnext === state.wsize) { state.wnext = 0; }
            if (state.whave < state.wsize) { state.whave += dist; }
          }
        }
        return 0;
      }

      function inflate(strm, flush) {
        var state;
        var input, output;          // input/output buffers
        var next;                   /* next input INDEX */
        var put;                    /* next output INDEX */
        var have, left;             /* available input and output */
        var hold;                   /* bit buffer */
        var bits;                   /* bits in bit buffer */
        var _in, _out;              /* save starting available input and output */
        var copy;                   /* number of stored or match bytes to copy */
        var from;                   /* where to copy match bytes from */
        var from_source;
        var here = 0;               /* current decoding table entry */
        var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
        //var last;                   /* parent table entry */
        var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
        var len;                    /* length to copy for repeats, bits to drop */
        var ret;                    /* return code */
        var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
        var opts;

        var n; // temporary var for NEED_BITS

        var order = /* permutation of code lengths */
          [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];


        if (!strm || !strm.state || !strm.output ||
          (!strm.input && strm.avail_in !== 0)) {
          return Z_STREAM_ERROR;
        }

        state = strm.state;
        if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


        //--- LOAD() ---
        put = strm.next_out;
        output = strm.output;
        left = strm.avail_out;
        next = strm.next_in;
        input = strm.input;
        have = strm.avail_in;
        hold = state.hold;
        bits = state.bits;
        //---

        _in = have;
        _out = left;
        ret = Z_OK;

        inf_leave: // goto emulation
        for (; ;) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              //=== NEEDBITS(16);
              while (bits < 16) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
                state.check = 0/*crc32(0L, Z_NULL, 0)*/;
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 0xff;
                hbuf[1] = (hold >>> 8) & 0xff;
                state.check = crc32(state.check, hbuf, 2, 0);
                //===//

                //=== INITBITS();
                hold = 0;
                bits = 0;
                //===//
                state.mode = FLAGS;
                break;
              }
              state.flags = 0;           /* expect zlib header */
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) ||   /* check if zlib header allowed */
                (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
                strm.msg = 'incorrect header check';
                state.mode = BAD;
                break;
              }
              if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
                strm.msg = 'unknown compression method';
                state.mode = BAD;
                break;
              }
              //--- DROPBITS(4) ---//
              hold >>>= 4;
              bits -= 4;
              //---//
              len = (hold & 0x0f)/*BITS(4)*/ + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              }
              else if (len > state.wbits) {
                strm.msg = 'invalid window size';
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << len;
              //Tracev((stderr, "inflate:   zlib header ok\n"));
              strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
              state.mode = hold & 0x200 ? DICTID : TYPE;
              //=== INITBITS();
              hold = 0;
              bits = 0;
              //===//
              break;
            case FLAGS:
              //=== NEEDBITS(16); */
              while (bits < 16) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              state.flags = hold;
              if ((state.flags & 0xff) !== Z_DEFLATED) {
                strm.msg = 'unknown compression method';
                state.mode = BAD;
                break;
              }
              if (state.flags & 0xe000) {
                strm.msg = 'unknown header flags set';
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = ((hold >> 8) & 1);
              }
              if (state.flags & 0x0200) {
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 0xff;
                hbuf[1] = (hold >>> 8) & 0xff;
                state.check = crc32(state.check, hbuf, 2, 0);
                //===//
              }
              //=== INITBITS();
              hold = 0;
              bits = 0;
              //===//
              state.mode = TIME;
            /* falls through */
            case TIME:
              //=== NEEDBITS(32); */
              while (bits < 32) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 0x0200) {
                //=== CRC4(state.check, hold)
                hbuf[0] = hold & 0xff;
                hbuf[1] = (hold >>> 8) & 0xff;
                hbuf[2] = (hold >>> 16) & 0xff;
                hbuf[3] = (hold >>> 24) & 0xff;
                state.check = crc32(state.check, hbuf, 4, 0);
                //===
              }
              //=== INITBITS();
              hold = 0;
              bits = 0;
              //===//
              state.mode = OS;
            /* falls through */
            case OS:
              //=== NEEDBITS(16); */
              while (bits < 16) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              if (state.head) {
                state.head.xflags = (hold & 0xff);
                state.head.os = (hold >> 8);
              }
              if (state.flags & 0x0200) {
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 0xff;
                hbuf[1] = (hold >>> 8) & 0xff;
                state.check = crc32(state.check, hbuf, 2, 0);
                //===//
              }
              //=== INITBITS();
              hold = 0;
              bits = 0;
              //===//
              state.mode = EXLEN;
            /* falls through */
            case EXLEN:
              if (state.flags & 0x0400) {
                //=== NEEDBITS(16); */
                while (bits < 16) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 0x0200) {
                  //=== CRC2(state.check, hold);
                  hbuf[0] = hold & 0xff;
                  hbuf[1] = (hold >>> 8) & 0xff;
                  state.check = crc32(state.check, hbuf, 2, 0);
                  //===//
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
                //===//
              }
              else if (state.head) {
                state.head.extra = null/*Z_NULL*/;
              }
              state.mode = EXTRA;
            /* falls through */
            case EXTRA:
              if (state.flags & 0x0400) {
                copy = state.length;
                if (copy > have) { copy = have; }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      // Use untyped array for more conveniend processing later
                      state.head.extra = new Array(state.head.extra_len);
                    }
                    utils.arraySet(
                      state.head.extra,
                      input,
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      copy,
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len
                    );
                    //zmemcpy(state.head.extra + len, next,
                    //        len + copy > state.head.extra_max ?
                    //        state.head.extra_max - len : copy);
                  }
                  if (state.flags & 0x0200) {
                    state.check = crc32(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  state.length -= copy;
                }
                if (state.length) { break inf_leave; }
              }
              state.length = 0;
              state.mode = NAME;
            /* falls through */
            case NAME:
              if (state.flags & 0x0800) {
                if (have === 0) { break inf_leave; }
                copy = 0;
                do {
                  // TODO: 2 or 1 bytes?
                  len = input[next + copy++];
                  /* use constant limit because in js we should not preallocate memory */
                  if (state.head && len &&
                    (state.length < 65536 /*state.head.name_max*/)) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy < have);

                if (state.flags & 0x0200) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) { break inf_leave; }
              }
              else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            /* falls through */
            case COMMENT:
              if (state.flags & 0x1000) {
                if (have === 0) { break inf_leave; }
                copy = 0;
                do {
                  len = input[next + copy++];
                  /* use constant limit because in js we should not preallocate memory */
                  if (state.head && len &&
                    (state.length < 65536 /*state.head.comm_max*/)) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 0x0200) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) { break inf_leave; }
              }
              else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            /* falls through */
            case HCRC:
              if (state.flags & 0x0200) {
                //=== NEEDBITS(16); */
                while (bits < 16) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                if (hold !== (state.check & 0xffff)) {
                  strm.msg = 'header crc mismatch';
                  state.mode = BAD;
                  break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
                //===//
              }
              if (state.head) {
                state.head.hcrc = ((state.flags >> 9) & 1);
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              //=== NEEDBITS(32); */
              while (bits < 32) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              strm.adler = state.check = zswap32(hold);
              //=== INITBITS();
              hold = 0;
              bits = 0;
              //===//
              state.mode = DICT;
            /* falls through */
            case DICT:
              if (state.havedict === 0) {
                //--- RESTORE() ---
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                //---
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
              state.mode = TYPE;
            /* falls through */
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
            /* falls through */
            case TYPEDO:
              if (state.last) {
                //--- BYTEBITS() ---//
                hold >>>= bits & 7;
                bits -= bits & 7;
                //---//
                state.mode = CHECK;
                break;
              }
              //=== NEEDBITS(3); */
              while (bits < 3) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              state.last = (hold & 0x01)/*BITS(1)*/;
              //--- DROPBITS(1) ---//
              hold >>>= 1;
              bits -= 1;
              //---//

              switch ((hold & 0x03)/*BITS(2)*/) {
                case 0:                             /* stored block */
                  //Tracev((stderr, "inflate:     stored block%s\n",
                  //        state.last ? " (last)" : ""));
                  state.mode = STORED;
                  break;
                case 1:                             /* fixed block */
                  fixedtables(state);
                  //Tracev((stderr, "inflate:     fixed codes block%s\n",
                  //        state.last ? " (last)" : ""));
                  state.mode = LEN_;             /* decode codes */
                  if (flush === Z_TREES) {
                    //--- DROPBITS(2) ---//
                    hold >>>= 2;
                    bits -= 2;
                    //---//
                    break inf_leave;
                  }
                  break;
                case 2:                             /* dynamic block */
                  //Tracev((stderr, "inflate:     dynamic codes block%s\n",
                  //        state.last ? " (last)" : ""));
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = 'invalid block type';
                  state.mode = BAD;
              }
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break;
            case STORED:
              //--- BYTEBITS() ---// /* go to byte boundary */
              hold >>>= bits & 7;
              bits -= bits & 7;
              //---//
              //=== NEEDBITS(32); */
              while (bits < 32) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
                strm.msg = 'invalid stored block lengths';
                state.mode = BAD;
                break;
              }
              state.length = hold & 0xffff;
              //Tracev((stderr, "inflate:       stored length %u\n",
              //        state.length));
              //=== INITBITS();
              hold = 0;
              bits = 0;
              //===//
              state.mode = COPY_;
              if (flush === Z_TREES) { break inf_leave; }
            /* falls through */
            case COPY_:
              state.mode = COPY;
            /* falls through */
            case COPY:
              copy = state.length;
              if (copy) {
                if (copy > have) { copy = have; }
                if (copy > left) { copy = left; }
                if (copy === 0) { break inf_leave; }
                //--- zmemcpy(put, next, copy); ---
                utils.arraySet(output, input, next, copy, put);
                //---//
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
              }
              //Tracev((stderr, "inflate:       stored end\n"));
              state.mode = TYPE;
              break;
            case TABLE:
              //=== NEEDBITS(14); */
              while (bits < 14) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
              //--- DROPBITS(5) ---//
              hold >>>= 5;
              bits -= 5;
              //---//
              state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
              //--- DROPBITS(5) ---//
              hold >>>= 5;
              bits -= 5;
              //---//
              state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
              //--- DROPBITS(4) ---//
              hold >>>= 4;
              bits -= 4;
              //---//
              //#ifndef PKZIP_BUG_WORKAROUND
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = 'too many length or distance symbols';
                state.mode = BAD;
                break;
              }
              //#endif
              //Tracev((stderr, "inflate:       table sizes ok\n"));
              state.have = 0;
              state.mode = LENLENS;
            /* falls through */
            case LENLENS:
              while (state.have < state.ncode) {
                //=== NEEDBITS(3);
                while (bits < 3) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
                //--- DROPBITS(3) ---//
                hold >>>= 3;
                bits -= 3;
                //---//
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              // We have separate tables & no pointers. 2 commented lines below not needed.
              //state.next = state.codes;
              //state.lencode = state.next;
              // Switch to use dynamic table
              state.lencode = state.lendyn;
              state.lenbits = 7;

              opts = { bits: state.lenbits };
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;

              if (ret) {
                strm.msg = 'invalid code lengths set';
                state.mode = BAD;
                break;
              }
              //Tracev((stderr, "inflate:       code lengths ok\n"));
              state.have = 0;
              state.mode = CODELENS;
            /* falls through */
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ;) {
                  here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
                  here_bits = here >>> 24;
                  here_op = (here >>> 16) & 0xff;
                  here_val = here & 0xffff;

                  if ((here_bits) <= bits) { break; }
                  //--- PULLBYTE() ---//
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                  //---//
                }
                if (here_val < 16) {
                  //--- DROPBITS(here.bits) ---//
                  hold >>>= here_bits;
                  bits -= here_bits;
                  //---//
                  state.lens[state.have++] = here_val;
                }
                else {
                  if (here_val === 16) {
                    //=== NEEDBITS(here.bits + 2);
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) { break inf_leave; }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    //===//
                    //--- DROPBITS(here.bits) ---//
                    hold >>>= here_bits;
                    bits -= here_bits;
                    //---//
                    if (state.have === 0) {
                      strm.msg = 'invalid bit length repeat';
                      state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy = 3 + (hold & 0x03);//BITS(2);
                    //--- DROPBITS(2) ---//
                    hold >>>= 2;
                    bits -= 2;
                    //---//
                  }
                  else if (here_val === 17) {
                    //=== NEEDBITS(here.bits + 3);
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) { break inf_leave; }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    //===//
                    //--- DROPBITS(here.bits) ---//
                    hold >>>= here_bits;
                    bits -= here_bits;
                    //---//
                    len = 0;
                    copy = 3 + (hold & 0x07);//BITS(3);
                    //--- DROPBITS(3) ---//
                    hold >>>= 3;
                    bits -= 3;
                    //---//
                  }
                  else {
                    //=== NEEDBITS(here.bits + 7);
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) { break inf_leave; }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    //===//
                    //--- DROPBITS(here.bits) ---//
                    hold >>>= here_bits;
                    bits -= here_bits;
                    //---//
                    len = 0;
                    copy = 11 + (hold & 0x7f);//BITS(7);
                    //--- DROPBITS(7) ---//
                    hold >>>= 7;
                    bits -= 7;
                    //---//
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = 'invalid bit length repeat';
                    state.mode = BAD;
                    break;
                  }
                  while (copy--) {
                    state.lens[state.have++] = len;
                  }
                }
              }

              /* handle error breaks in while */
              if (state.mode === BAD) { break; }

              /* check for end-of-block code (better have one) */
              if (state.lens[256] === 0) {
                strm.msg = 'invalid code -- missing end-of-block';
                state.mode = BAD;
                break;
              }

              /* build code tables -- note: do not change the lenbits or distbits
                 values here (9 and 6) without reading the comments in inftrees.h
                 concerning the ENOUGH constants, which depend on those values */
              state.lenbits = 9;

              opts = { bits: state.lenbits };
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              // We have separate tables & no pointers. 2 commented lines below not needed.
              // state.next_index = opts.table_index;
              state.lenbits = opts.bits;
              // state.lencode = state.next;

              if (ret) {
                strm.msg = 'invalid literal/lengths set';
                state.mode = BAD;
                break;
              }

              state.distbits = 6;
              //state.distcode.copy(state.codes);
              // Switch to use dynamic table
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              // We have separate tables & no pointers. 2 commented lines below not needed.
              // state.next_index = opts.table_index;
              state.distbits = opts.bits;
              // state.distcode = state.next;

              if (ret) {
                strm.msg = 'invalid distances set';
                state.mode = BAD;
                break;
              }
              //Tracev((stderr, 'inflate:       codes ok\n'));
              state.mode = LEN_;
              if (flush === Z_TREES) { break inf_leave; }
            /* falls through */
            case LEN_:
              state.mode = LEN;
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
                //--- RESTORE() ---
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                //---
                inflate_fast(strm, _out);
                //--- LOAD() ---
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                //---

                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ;) {
                here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
                here_bits = here >>> 24;
                here_op = (here >>> 16) & 0xff;
                here_val = here & 0xffff;

                if (here_bits <= bits) { break; }
                //--- PULLBYTE() ---//
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
                //---//
              }
              if (here_op && (here_op & 0xf0) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ;) {
                  here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = (here >>> 16) & 0xff;
                  here_val = here & 0xffff;

                  if ((last_bits + here_bits) <= bits) { break; }
                  //--- PULLBYTE() ---//
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                  //---//
                }
                //--- DROPBITS(last.bits) ---//
                hold >>>= last_bits;
                bits -= last_bits;
                //---//
                state.back += last_bits;
              }
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
                //        "inflate:         literal '%c'\n" :
                //        "inflate:         literal 0x%02x\n", here.val));
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                //Tracevv((stderr, "inflate:         end of block\n"));
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = 'invalid literal/length code';
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            /* falls through */
            case LENEXT:
              if (state.extra) {
                //=== NEEDBITS(state.extra);
                n = state.extra;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
                //--- DROPBITS(state.extra) ---//
                hold >>>= state.extra;
                bits -= state.extra;
                //---//
                state.back += state.extra;
              }
              //Tracevv((stderr, "inflate:         length %u\n", state.length));
              state.was = state.length;
              state.mode = DIST;
            /* falls through */
            case DIST:
              for (; ;) {
                here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
                here_bits = here >>> 24;
                here_op = (here >>> 16) & 0xff;
                here_val = here & 0xffff;

                if ((here_bits) <= bits) { break; }
                //--- PULLBYTE() ---//
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
                //---//
              }
              if ((here_op & 0xf0) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ;) {
                  here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = (here >>> 16) & 0xff;
                  here_val = here & 0xffff;

                  if ((last_bits + here_bits) <= bits) { break; }
                  //--- PULLBYTE() ---//
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                  //---//
                }
                //--- DROPBITS(last.bits) ---//
                hold >>>= last_bits;
                bits -= last_bits;
                //---//
                state.back += last_bits;
              }
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = 'invalid distance code';
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = (here_op) & 15;
              state.mode = DISTEXT;
            /* falls through */
            case DISTEXT:
              if (state.extra) {
                //=== NEEDBITS(state.extra);
                n = state.extra;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
                //--- DROPBITS(state.extra) ---//
                hold >>>= state.extra;
                bits -= state.extra;
                //---//
                state.back += state.extra;
              }
              //#ifdef INFLATE_STRICT
              if (state.offset > state.dmax) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD;
                break;
              }
              //#endif
              //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
              state.mode = MATCH;
            /* falls through */
            case MATCH:
              if (left === 0) { break inf_leave; }
              copy = _out - left;
              if (state.offset > copy) {         /* copy from window */
                copy = state.offset - copy;
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = 'invalid distance too far back';
                    state.mode = BAD;
                    break;
                  }
                  // (!) This block is disabled in zlib defailts,
                  // don't enable it for binary compatibility
                  //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                  //          Trace((stderr, "inflate.c too far\n"));
                  //          copy -= state.whave;
                  //          if (copy > state.length) { copy = state.length; }
                  //          if (copy > left) { copy = left; }
                  //          left -= copy;
                  //          state.length -= copy;
                  //          do {
                  //            output[put++] = 0;
                  //          } while (--copy);
                  //          if (state.length === 0) { state.mode = LEN; }
                  //          break;
                  //#endif
                }
                if (copy > state.wnext) {
                  copy -= state.wnext;
                  from = state.wsize - copy;
                }
                else {
                  from = state.wnext - copy;
                }
                if (copy > state.length) { copy = state.length; }
                from_source = state.window;
              }
              else {                              /* copy from output */
                from_source = output;
                from = put - state.offset;
                copy = state.length;
              }
              if (copy > left) { copy = left; }
              left -= copy;
              state.length -= copy;
              do {
                output[put++] = from_source[from++];
              } while (--copy);
              if (state.length === 0) { state.mode = LEN; }
              break;
            case LIT:
              if (left === 0) { break inf_leave; }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                //=== NEEDBITS(32);
                while (bits < 32) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  // Use '|' insdead of '+' to make sure that result is signed
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                //===//
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (_out) {
                  strm.adler = state.check =
                    /*UPDATE(state.check, put - _out, _out);*/
                    (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

                }
                _out = left;
                // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = 'incorrect data check';
                  state.mode = BAD;
                  break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
                //===//
                //Tracev((stderr, "inflate:   check matches trailer\n"));
              }
              state.mode = LENGTH;
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
                //=== NEEDBITS(32);
                while (bits < 32) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                if (hold !== (state.total & 0xffffffff)) {
                  strm.msg = 'incorrect length check';
                  state.mode = BAD;
                  break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
                //===//
                //Tracev((stderr, "inflate:   length matches trailer\n"));
              }
              state.mode = DONE;
            /* falls through */
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR;
          }
        }

        // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

        /*
           Return from inflate(), updating the total counts and the check value.
           If there was no progress during the inflate() call, return a buffer
           error.  Call updatewindow() to create and/or update the window state.
           Note: a memory error from inflate() is non-recoverable.
         */

        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---

        if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
          (state.mode < CHECK || flush !== Z_FINISH))) {
          if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
            state.mode = MEM;
            return Z_MEM_ERROR;
          }
        }
        _in -= strm.avail_in;
        _out -= strm.avail_out;
        strm.total_in += _in;
        strm.total_out += _out;
        state.total += _out;
        if (state.wrap && _out) {
          strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
            (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
        }
        strm.data_type = state.bits + (state.last ? 64 : 0) +
          (state.mode === TYPE ? 128 : 0) +
          (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
        if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
          ret = Z_BUF_ERROR;
        }
        return ret;
      }

      function inflateEnd(strm) {

        if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
          return Z_STREAM_ERROR;
        }

        var state = strm.state;
        if (state.window) {
          state.window = null;
        }
        strm.state = null;
        return Z_OK;
      }

      function inflateGetHeader(strm, head) {
        var state;

        /* check state */
        if (!strm || !strm.state) { return Z_STREAM_ERROR; }
        state = strm.state;
        if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

        /* save header structure */
        state.head = head;
        head.done = false;
        return Z_OK;
      }

      function inflateSetDictionary(strm, dictionary) {
        var dictLength = dictionary.length;

        var state;
        var dictid;
        var ret;

        /* check state */
        if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
        state = strm.state;

        if (state.wrap !== 0 && state.mode !== DICT) {
          return Z_STREAM_ERROR;
        }

        /* check for correct dictionary identifier */
        if (state.mode === DICT) {
          dictid = 1; /* adler32(0, null, 0)*/
          /* dictid = adler32(dictid, dictionary, dictLength); */
          dictid = adler32(dictid, dictionary, dictLength, 0);
          if (dictid !== state.check) {
            return Z_DATA_ERROR;
          }
        }
        /* copy dictionary to window using updatewindow(), which will amend the
         existing dictionary if appropriate */
        ret = updatewindow(strm, dictionary, dictLength, dictLength);
        if (ret) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
        state.havedict = 1;
        // Tracev((stderr, "inflate:   dictionary set\n"));
        return Z_OK;
      }

      exports.inflateReset = inflateReset;
      exports.inflateReset2 = inflateReset2;
      exports.inflateResetKeep = inflateResetKeep;
      exports.inflateInit = inflateInit;
      exports.inflateInit2 = inflateInit2;
      exports.inflate = inflate;
      exports.inflateEnd = inflateEnd;
      exports.inflateGetHeader = inflateGetHeader;
      exports.inflateSetDictionary = inflateSetDictionary;
      exports.inflateInfo = 'pako inflate (from Nodeca project)';

      /* Not implemented
      exports.inflateCopy = inflateCopy;
      exports.inflateGetDictionary = inflateGetDictionary;
      exports.inflateMark = inflateMark;
      exports.inflatePrime = inflatePrime;
      exports.inflateSync = inflateSync;
      exports.inflateSyncPoint = inflateSyncPoint;
      exports.inflateUndermine = inflateUndermine;
      */

    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      var utils = require('../utils/common');

      var MAXBITS = 15;
      var ENOUGH_LENS = 852;
      var ENOUGH_DISTS = 592;
      //var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

      var CODES = 0;
      var LENS = 1;
      var DISTS = 2;

      var lbase = [ /* Length codes 257..285 base */
        3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
        35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
      ];

      var lext = [ /* Length codes 257..285 extra */
        16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
        19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
      ];

      var dbase = [ /* Distance codes 0..29 base */
        1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
        257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
        8193, 12289, 16385, 24577, 0, 0
      ];

      var dext = [ /* Distance codes 0..29 extra */
        16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
        23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
        28, 28, 29, 29, 64, 64
      ];

      module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
        var bits = opts.bits;
        //here = opts.here; /* table entry for duplication */

        var len = 0;               /* a code's length in bits */
        var sym = 0;               /* index of code symbols */
        var min = 0, max = 0;          /* minimum and maximum code lengths */
        var root = 0;              /* number of index bits for root table */
        var curr = 0;              /* number of index bits for current table */
        var drop = 0;              /* code bits to drop for sub-table */
        var left = 0;                   /* number of prefix codes available */
        var used = 0;              /* code entries in table used */
        var huff = 0;              /* Huffman code */
        var incr;              /* for incrementing code, index */
        var fill;              /* index for replicating entries */
        var low;               /* low bits for current root entry */
        var mask;              /* mask for low root bits */
        var next;             /* next available space in table */
        var base = null;     /* base value table to use */
        var base_index = 0;
        //  var shoextra;    /* extra bits table to use */
        var end;                    /* use base and extra for symbol > end */
        var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
        var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
        var extra = null;
        var extra_index = 0;

        var here_bits, here_op, here_val;

        /*
         Process a set of code lengths to create a canonical Huffman code.  The
         code lengths are lens[0..codes-1].  Each length corresponds to the
         symbols 0..codes-1.  The Huffman code is generated by first sorting the
         symbols by length from short to long, and retaining the symbol order
         for codes with equal lengths.  Then the code starts with all zero bits
         for the first code of the shortest length, and the codes are integer
         increments for the same length, and zeros are appended as the length
         increases.  For the deflate format, these bits are stored backwards
         from their more natural integer increment ordering, and so when the
         decoding tables are built in the large loop below, the integer codes
         are incremented backwards.
      
         This routine assumes, but does not check, that all of the entries in
         lens[] are in the range 0..MAXBITS.  The caller must assure this.
         1..MAXBITS is interpreted as that code length.  zero means that that
         symbol does not occur in this code.
      
         The codes are sorted by computing a count of codes for each length,
         creating from that a table of starting indices for each length in the
         sorted table, and then entering the symbols in order in the sorted
         table.  The sorted table is work[], with that space being provided by
         the caller.
      
         The length counts are used for other purposes as well, i.e. finding
         the minimum and maximum length codes, determining if there are any
         codes at all, checking for a valid set of lengths, and looking ahead
         at length counts to determine sub-table sizes when building the
         decoding tables.
         */

        /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
        for (len = 0; len <= MAXBITS; len++) {
          count[len] = 0;
        }
        for (sym = 0; sym < codes; sym++) {
          count[lens[lens_index + sym]]++;
        }

        /* bound code lengths, force root to be within code lengths */
        root = bits;
        for (max = MAXBITS; max >= 1; max--) {
          if (count[max] !== 0) { break; }
        }
        if (root > max) {
          root = max;
        }
        if (max === 0) {                     /* no symbols to code at all */
          //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
          //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
          //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
          table[table_index++] = (1 << 24) | (64 << 16) | 0;


          //table.op[opts.table_index] = 64;
          //table.bits[opts.table_index] = 1;
          //table.val[opts.table_index++] = 0;
          table[table_index++] = (1 << 24) | (64 << 16) | 0;

          opts.bits = 1;
          return 0;     /* no symbols, but wait for decoding to report error */
        }
        for (min = 1; min < max; min++) {
          if (count[min] !== 0) { break; }
        }
        if (root < min) {
          root = min;
        }

        /* check for an over-subscribed or incomplete set of lengths */
        left = 1;
        for (len = 1; len <= MAXBITS; len++) {
          left <<= 1;
          left -= count[len];
          if (left < 0) {
            return -1;
          }        /* over-subscribed */
        }
        if (left > 0 && (type === CODES || max !== 1)) {
          return -1;                      /* incomplete set */
        }

        /* generate offsets into symbol table for each length for sorting */
        offs[1] = 0;
        for (len = 1; len < MAXBITS; len++) {
          offs[len + 1] = offs[len] + count[len];
        }

        /* sort symbols by length, by symbol order within each length */
        for (sym = 0; sym < codes; sym++) {
          if (lens[lens_index + sym] !== 0) {
            work[offs[lens[lens_index + sym]]++] = sym;
          }
        }

        /*
         Create and fill in decoding tables.  In this loop, the table being
         filled is at next and has curr index bits.  The code being used is huff
         with length len.  That code is converted to an index by dropping drop
         bits off of the bottom.  For codes where len is less than drop + curr,
         those top drop + curr - len bits are incremented through all values to
         fill the table with replicated entries.
      
         root is the number of index bits for the root table.  When len exceeds
         root, sub-tables are created pointed to by the root entry with an index
         of the low root bits of huff.  This is saved in low to check for when a
         new sub-table should be started.  drop is zero when the root table is
         being filled, and drop is root when sub-tables are being filled.
      
         When a new sub-table is needed, it is necessary to look ahead in the
         code lengths to determine what size sub-table is needed.  The length
         counts are used for this, and so count[] is decremented as codes are
         entered in the tables.
      
         used keeps track of how many table entries have been allocated from the
         provided *table space.  It is checked for LENS and DIST tables against
         the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
         the initial root table size constants.  See the comments in inftrees.h
         for more information.
      
         sym increments through all symbols, and the loop terminates when
         all codes of length max, i.e. all codes, have been processed.  This
         routine permits incomplete codes, so another loop after this one fills
         in the rest of the decoding tables with invalid code markers.
         */

        /* set up for code type */
        // poor man optimization - use if-else instead of switch,
        // to avoid deopts in old v8
        if (type === CODES) {
          base = extra = work;    /* dummy value--not used */
          end = 19;

        } else if (type === LENS) {
          base = lbase;
          base_index -= 257;
          extra = lext;
          extra_index -= 257;
          end = 256;

        } else {                    /* DISTS */
          base = dbase;
          extra = dext;
          end = -1;
        }

        /* initialize opts for loop */
        huff = 0;                   /* starting code */
        sym = 0;                    /* starting code symbol */
        len = min;                  /* starting code length */
        next = table_index;              /* current table to fill in */
        curr = root;                /* current table index bits */
        drop = 0;                   /* current bits to drop from code for index */
        low = -1;                   /* trigger new sub-table when len > root */
        used = 1 << root;          /* use root table entries */
        mask = used - 1;            /* mask for comparing low */

        /* check available table space */
        if ((type === LENS && used > ENOUGH_LENS) ||
          (type === DISTS && used > ENOUGH_DISTS)) {
          return 1;
        }

        /* process all codes and make table entries */
        for (; ;) {
          /* create table entry */
          here_bits = len - drop;
          if (work[sym] < end) {
            here_op = 0;
            here_val = work[sym];
          }
          else if (work[sym] > end) {
            here_op = extra[extra_index + work[sym]];
            here_val = base[base_index + work[sym]];
          }
          else {
            here_op = 32 + 64;         /* end of block */
            here_val = 0;
          }

          /* replicate for those indices with low len bits equal to huff */
          incr = 1 << (len - drop);
          fill = 1 << curr;
          min = fill;                 /* save offset to next table */
          do {
            fill -= incr;
            table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val | 0;
          } while (fill !== 0);

          /* backwards increment the len-bit code huff */
          incr = 1 << (len - 1);
          while (huff & incr) {
            incr >>= 1;
          }
          if (incr !== 0) {
            huff &= incr - 1;
            huff += incr;
          } else {
            huff = 0;
          }

          /* go to next symbol, update count, len */
          sym++;
          if (--count[len] === 0) {
            if (len === max) { break; }
            len = lens[lens_index + work[sym]];
          }

          /* create new sub-table if needed */
          if (len > root && (huff & mask) !== low) {
            /* if first time, transition to sub-tables */
            if (drop === 0) {
              drop = root;
            }

            /* increment past last table */
            next += min;            /* here min is 1 << curr */

            /* determine length of next table */
            curr = len - drop;
            left = 1 << curr;
            while (curr + drop < max) {
              left -= count[curr + drop];
              if (left <= 0) { break; }
              curr++;
              left <<= 1;
            }

            /* check for enough space */
            used += 1 << curr;
            if ((type === LENS && used > ENOUGH_LENS) ||
              (type === DISTS && used > ENOUGH_DISTS)) {
              return 1;
            }

            /* point entry in root table to sub-table */
            low = huff & mask;
            /*table.op[low] = curr;
            table.bits[low] = root;
            table.val[low] = next - opts.table_index;*/
            table[low] = (root << 24) | (curr << 16) | (next - table_index) | 0;
          }
        }

        /* fill in remaining table entry if code is incomplete (guaranteed to have
         at most one remaining entry, since if the code is incomplete, the
         maximum code length that was allowed to get this far is one bit) */
        if (huff !== 0) {
          //table.op[next + huff] = 64;            /* invalid code marker */
          //table.bits[next + huff] = len - drop;
          //table.val[next + huff] = 0;
          table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0;
        }

        /* set return parameters */
        //opts.table_index += used;
        opts.bits = root;
        return 0;
      };

    }, { "../utils/common": 41 }], 51: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      module.exports = {
        2: 'need dictionary',     /* Z_NEED_DICT       2  */
        1: 'stream end',          /* Z_STREAM_END      1  */
        0: '',                    /* Z_OK              0  */
        '-1': 'file error',          /* Z_ERRNO         (-1) */
        '-2': 'stream error',        /* Z_STREAM_ERROR  (-2) */
        '-3': 'data error',          /* Z_DATA_ERROR    (-3) */
        '-4': 'insufficient memory', /* Z_MEM_ERROR     (-4) */
        '-5': 'buffer error',        /* Z_BUF_ERROR     (-5) */
        '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */
      };

    }, {}], 52: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      var utils = require('../utils/common');

      /* Public constants ==========================================================*/
      /* ===========================================================================*/


      //var Z_FILTERED          = 1;
      //var Z_HUFFMAN_ONLY      = 2;
      //var Z_RLE               = 3;
      var Z_FIXED = 4;
      //var Z_DEFAULT_STRATEGY  = 0;

      /* Possible values of the data_type field (though see inflate()) */
      var Z_BINARY = 0;
      var Z_TEXT = 1;
      //var Z_ASCII             = 1; // = Z_TEXT
      var Z_UNKNOWN = 2;

      /*============================================================================*/


      function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

      // From zutil.h

      var STORED_BLOCK = 0;
      var STATIC_TREES = 1;
      var DYN_TREES = 2;
      /* The three kinds of block type */

      var MIN_MATCH = 3;
      var MAX_MATCH = 258;
      /* The minimum and maximum match lengths */

      // From deflate.h
      /* ===========================================================================
       * Internal compression state.
       */

      var LENGTH_CODES = 29;
      /* number of length codes, not counting the special END_BLOCK code */

      var LITERALS = 256;
      /* number of literal bytes 0..255 */

      var L_CODES = LITERALS + 1 + LENGTH_CODES;
      /* number of Literal or Length codes, including the END_BLOCK code */

      var D_CODES = 30;
      /* number of distance codes */

      var BL_CODES = 19;
      /* number of codes used to transfer the bit lengths */

      var HEAP_SIZE = 2 * L_CODES + 1;
      /* maximum heap size */

      var MAX_BITS = 15;
      /* All codes must not exceed MAX_BITS bits */

      var Buf_size = 16;
      /* size of bit buffer in bi_buf */


      /* ===========================================================================
       * Constants
       */

      var MAX_BL_BITS = 7;
      /* Bit length codes must not exceed MAX_BL_BITS bits */

      var END_BLOCK = 256;
      /* end of block literal code */

      var REP_3_6 = 16;
      /* repeat previous bit length 3-6 times (2 bits of repeat count) */

      var REPZ_3_10 = 17;
      /* repeat a zero length 3-10 times  (3 bits of repeat count) */

      var REPZ_11_138 = 18;
      /* repeat a zero length 11-138 times  (7 bits of repeat count) */

      /* eslint-disable comma-spacing,array-bracket-spacing */
      var extra_lbits =   /* extra bits for each length code */
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

      var extra_dbits =   /* extra bits for each distance code */
        [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

      var extra_blbits =  /* extra bits for each bit length code */
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];

      var bl_order =
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
      /* eslint-enable comma-spacing,array-bracket-spacing */

      /* The lengths of the bit length codes are sent in order of decreasing
       * probability, to avoid transmitting the lengths for unused bit length codes.
       */

      /* ===========================================================================
       * Local data. These are initialized only once.
       */

      // We pre-fill arrays with 0 to avoid uninitialized gaps

      var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

      // !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
      var static_ltree = new Array((L_CODES + 2) * 2);
      zero(static_ltree);
      /* The static literal tree. Since the bit lengths are imposed, there is no
       * need for the L_CODES extra codes used during heap construction. However
       * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
       * below).
       */

      var static_dtree = new Array(D_CODES * 2);
      zero(static_dtree);
      /* The static distance tree. (Actually a trivial tree since all codes use
       * 5 bits.)
       */

      var _dist_code = new Array(DIST_CODE_LEN);
      zero(_dist_code);
      /* Distance codes. The first 256 values correspond to the distances
       * 3 .. 258, the last 256 values correspond to the top 8 bits of
       * the 15 bit distances.
       */

      var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
      zero(_length_code);
      /* length code for each normalized match length (0 == MIN_MATCH) */

      var base_length = new Array(LENGTH_CODES);
      zero(base_length);
      /* First normalized length for each code (0 = MIN_MATCH) */

      var base_dist = new Array(D_CODES);
      zero(base_dist);
      /* First normalized distance for each code (0 = distance of 1) */


      function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

        this.static_tree = static_tree;  /* static tree or NULL */
        this.extra_bits = extra_bits;   /* extra bits for each code or NULL */
        this.extra_base = extra_base;   /* base index for extra_bits */
        this.elems = elems;        /* max number of elements in the tree */
        this.max_length = max_length;   /* max bit length for the codes */

        // show if `static_tree` has data or dummy - needed for monomorphic objects
        this.has_stree = static_tree && static_tree.length;
      }


      var static_l_desc;
      var static_d_desc;
      var static_bl_desc;


      function TreeDesc(dyn_tree, stat_desc) {
        this.dyn_tree = dyn_tree;     /* the dynamic tree */
        this.max_code = 0;            /* largest code with non zero frequency */
        this.stat_desc = stat_desc;   /* the corresponding static tree */
      }



      function d_code(dist) {
        return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
      }


      /* ===========================================================================
       * Output a short LSB first on the stream.
       * IN assertion: there is enough room in pendingBuf.
       */
      function put_short(s, w) {
        //    put_byte(s, (uch)((w) & 0xff));
        //    put_byte(s, (uch)((ush)(w) >> 8));
        s.pending_buf[s.pending++] = (w) & 0xff;
        s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
      }


      /* ===========================================================================
       * Send a value on a given number of bits.
       * IN assertion: length <= 16 and value fits in length bits.
       */
      function send_bits(s, value, length) {
        if (s.bi_valid > (Buf_size - length)) {
          s.bi_buf |= (value << s.bi_valid) & 0xffff;
          put_short(s, s.bi_buf);
          s.bi_buf = value >> (Buf_size - s.bi_valid);
          s.bi_valid += length - Buf_size;
        } else {
          s.bi_buf |= (value << s.bi_valid) & 0xffff;
          s.bi_valid += length;
        }
      }


      function send_code(s, c, tree) {
        send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
      }


      /* ===========================================================================
       * Reverse the first len bits of a code, using straightforward code (a faster
       * method would use a table)
       * IN assertion: 1 <= len <= 15
       */
      function bi_reverse(code, len) {
        var res = 0;
        do {
          res |= code & 1;
          code >>>= 1;
          res <<= 1;
        } while (--len > 0);
        return res >>> 1;
      }


      /* ===========================================================================
       * Flush the bit buffer, keeping at most 7 bits in it.
       */
      function bi_flush(s) {
        if (s.bi_valid === 16) {
          put_short(s, s.bi_buf);
          s.bi_buf = 0;
          s.bi_valid = 0;

        } else if (s.bi_valid >= 8) {
          s.pending_buf[s.pending++] = s.bi_buf & 0xff;
          s.bi_buf >>= 8;
          s.bi_valid -= 8;
        }
      }


      /* ===========================================================================
       * Compute the optimal bit lengths for a tree and update the total bit length
       * for the current block.
       * IN assertion: the fields freq and dad are set, heap[heap_max] and
       *    above are the tree nodes sorted by increasing frequency.
       * OUT assertions: the field len is set to the optimal bit length, the
       *     array bl_count contains the frequencies for each bit length.
       *     The length opt_len is updated; static_len is also updated if stree is
       *     not null.
       */
      function gen_bitlen(s, desc)
      //    deflate_state *s;
      //    tree_desc *desc;    /* the tree descriptor */
      {
        var tree = desc.dyn_tree;
        var max_code = desc.max_code;
        var stree = desc.stat_desc.static_tree;
        var has_stree = desc.stat_desc.has_stree;
        var extra = desc.stat_desc.extra_bits;
        var base = desc.stat_desc.extra_base;
        var max_length = desc.stat_desc.max_length;
        var h;              /* heap index */
        var n, m;           /* iterate over the tree elements */
        var bits;           /* bit length */
        var xbits;          /* extra bits */
        var f;              /* frequency */
        var overflow = 0;   /* number of elements with bit length too large */

        for (bits = 0; bits <= MAX_BITS; bits++) {
          s.bl_count[bits] = 0;
        }

        /* In a first pass, compute the optimal bit lengths (which may
         * overflow in the case of the bit length tree).
         */
        tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

        for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
          n = s.heap[h];
          bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
          if (bits > max_length) {
            bits = max_length;
            overflow++;
          }
          tree[n * 2 + 1]/*.Len*/ = bits;
          /* We overwrite tree[n].Dad which is no longer needed */

          if (n > max_code) { continue; } /* not a leaf node */

          s.bl_count[bits]++;
          xbits = 0;
          if (n >= base) {
            xbits = extra[n - base];
          }
          f = tree[n * 2]/*.Freq*/;
          s.opt_len += f * (bits + xbits);
          if (has_stree) {
            s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
          }
        }
        if (overflow === 0) { return; }

        // Trace((stderr,"\nbit length overflow\n"));
        /* This happens for example on obj2 and pic of the Calgary corpus */

        /* Find the first bit length which could increase: */
        do {
          bits = max_length - 1;
          while (s.bl_count[bits] === 0) { bits--; }
          s.bl_count[bits]--;      /* move one leaf down the tree */
          s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
          s.bl_count[max_length]--;
          /* The brother of the overflow item also moves one step up,
           * but this does not affect bl_count[max_length]
           */
          overflow -= 2;
        } while (overflow > 0);

        /* Now recompute all bit lengths, scanning in increasing frequency.
         * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
         * lengths instead of fixing only the wrong ones. This idea is taken
         * from 'ar' written by Haruhiko Okumura.)
         */
        for (bits = max_length; bits !== 0; bits--) {
          n = s.bl_count[bits];
          while (n !== 0) {
            m = s.heap[--h];
            if (m > max_code) { continue; }
            if (tree[m * 2 + 1]/*.Len*/ !== bits) {
              // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
              s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
              tree[m * 2 + 1]/*.Len*/ = bits;
            }
            n--;
          }
        }
      }


      /* ===========================================================================
       * Generate the codes for a given tree and bit counts (which need not be
       * optimal).
       * IN assertion: the array bl_count contains the bit length statistics for
       * the given tree and the field len is set for all tree elements.
       * OUT assertion: the field code is set for all tree elements of non
       *     zero code length.
       */
      function gen_codes(tree, max_code, bl_count)
      //    ct_data *tree;             /* the tree to decorate */
      //    int max_code;              /* largest code with non zero frequency */
      //    ushf *bl_count;            /* number of codes at each bit length */
      {
        var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
        var code = 0;              /* running code value */
        var bits;                  /* bit index */
        var n;                     /* code index */

        /* The distribution counts are first used to generate the code values
         * without bit reversal.
         */
        for (bits = 1; bits <= MAX_BITS; bits++) {
          next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
        }
        /* Check that the bit counts in bl_count are consistent. The last code
         * must be all ones.
         */
        //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
        //        "inconsistent bit counts");
        //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

        for (n = 0; n <= max_code; n++) {
          var len = tree[n * 2 + 1]/*.Len*/;
          if (len === 0) { continue; }
          /* Now reverse the bits */
          tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

          //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
          //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
        }
      }


      /* ===========================================================================
       * Initialize the various 'constant' tables.
       */
      function tr_static_init() {
        var n;        /* iterates over tree elements */
        var bits;     /* bit counter */
        var length;   /* length value */
        var code;     /* code value */
        var dist;     /* distance index */
        var bl_count = new Array(MAX_BITS + 1);
        /* number of codes at each bit length for an optimal tree */

        // do check in _tr_init()
        //if (static_init_done) return;

        /* For some embedded targets, global variables are not initialized: */
        /*#ifdef NO_INIT_GLOBAL_POINTERS
          static_l_desc.static_tree = static_ltree;
          static_l_desc.extra_bits = extra_lbits;
          static_d_desc.static_tree = static_dtree;
          static_d_desc.extra_bits = extra_dbits;
          static_bl_desc.extra_bits = extra_blbits;
        #endif*/

        /* Initialize the mapping length (0..255) -> length code (0..28) */
        length = 0;
        for (code = 0; code < LENGTH_CODES - 1; code++) {
          base_length[code] = length;
          for (n = 0; n < (1 << extra_lbits[code]); n++) {
            _length_code[length++] = code;
          }
        }
        //Assert (length == 256, "tr_static_init: length != 256");
        /* Note that the length 255 (match length 258) can be represented
         * in two different ways: code 284 + 5 bits or code 285, so we
         * overwrite length_code[255] to use the best encoding:
         */
        _length_code[length - 1] = code;

        /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
        dist = 0;
        for (code = 0; code < 16; code++) {
          base_dist[code] = dist;
          for (n = 0; n < (1 << extra_dbits[code]); n++) {
            _dist_code[dist++] = code;
          }
        }
        //Assert (dist == 256, "tr_static_init: dist != 256");
        dist >>= 7; /* from now on, all distances are divided by 128 */
        for (; code < D_CODES; code++) {
          base_dist[code] = dist << 7;
          for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
            _dist_code[256 + dist++] = code;
          }
        }
        //Assert (dist == 256, "tr_static_init: 256+dist != 512");

        /* Construct the codes of the static literal tree */
        for (bits = 0; bits <= MAX_BITS; bits++) {
          bl_count[bits] = 0;
        }

        n = 0;
        while (n <= 143) {
          static_ltree[n * 2 + 1]/*.Len*/ = 8;
          n++;
          bl_count[8]++;
        }
        while (n <= 255) {
          static_ltree[n * 2 + 1]/*.Len*/ = 9;
          n++;
          bl_count[9]++;
        }
        while (n <= 279) {
          static_ltree[n * 2 + 1]/*.Len*/ = 7;
          n++;
          bl_count[7]++;
        }
        while (n <= 287) {
          static_ltree[n * 2 + 1]/*.Len*/ = 8;
          n++;
          bl_count[8]++;
        }
        /* Codes 286 and 287 do not exist, but we must include them in the
         * tree construction to get a canonical Huffman tree (longest code
         * all ones)
         */
        gen_codes(static_ltree, L_CODES + 1, bl_count);

        /* The static distance tree is trivial: */
        for (n = 0; n < D_CODES; n++) {
          static_dtree[n * 2 + 1]/*.Len*/ = 5;
          static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
        }

        // Now data ready and we can init static trees
        static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
        static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
        static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);

        //static_init_done = true;
      }


      /* ===========================================================================
       * Initialize a new block.
       */
      function init_block(s) {
        var n; /* iterates over tree elements */

        /* Initialize the trees. */
        for (n = 0; n < L_CODES; n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
        for (n = 0; n < D_CODES; n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
        for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

        s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
        s.opt_len = s.static_len = 0;
        s.last_lit = s.matches = 0;
      }


      /* ===========================================================================
       * Flush the bit buffer and align the output on a byte boundary
       */
      function bi_windup(s) {
        if (s.bi_valid > 8) {
          put_short(s, s.bi_buf);
        } else if (s.bi_valid > 0) {
          //put_byte(s, (Byte)s->bi_buf);
          s.pending_buf[s.pending++] = s.bi_buf;
        }
        s.bi_buf = 0;
        s.bi_valid = 0;
      }

      /* ===========================================================================
       * Copy a stored block, storing first the length and its
       * one's complement if requested.
       */
      function copy_block(s, buf, len, header)
      //DeflateState *s;
      //charf    *buf;    /* the input data */
      //unsigned len;     /* its length */
      //int      header;  /* true if block header must be written */
      {
        bi_windup(s);        /* align on byte boundary */

        if (header) {
          put_short(s, len);
          put_short(s, ~len);
        }
        //  while (len--) {
        //    put_byte(s, *buf++);
        //  }
        utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
        s.pending += len;
      }

      /* ===========================================================================
       * Compares to subtrees, using the tree depth as tie breaker when
       * the subtrees have equal frequency. This minimizes the worst case length.
       */
      function smaller(tree, n, m, depth) {
        var _n2 = n * 2;
        var _m2 = m * 2;
        return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
          (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
      }

      /* ===========================================================================
       * Restore the heap property by moving down the tree starting at node k,
       * exchanging a node with the smallest of its two sons if necessary, stopping
       * when the heap property is re-established (each father smaller than its
       * two sons).
       */
      function pqdownheap(s, tree, k)
      //    deflate_state *s;
      //    ct_data *tree;  /* the tree to restore */
      //    int k;               /* node to move down */
      {
        var v = s.heap[k];
        var j = k << 1;  /* left son of k */
        while (j <= s.heap_len) {
          /* Set j to the smallest of the two sons: */
          if (j < s.heap_len &&
            smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
            j++;
          }
          /* Exit if v is smaller than both sons */
          if (smaller(tree, v, s.heap[j], s.depth)) { break; }

          /* Exchange v with the smallest son */
          s.heap[k] = s.heap[j];
          k = j;

          /* And continue down the tree, setting j to the left son of k */
          j <<= 1;
        }
        s.heap[k] = v;
      }


      // inlined manually
      // var SMALLEST = 1;

      /* ===========================================================================
       * Send the block data compressed using the given Huffman trees
       */
      function compress_block(s, ltree, dtree)
      //    deflate_state *s;
      //    const ct_data *ltree; /* literal tree */
      //    const ct_data *dtree; /* distance tree */
      {
        var dist;           /* distance of matched string */
        var lc;             /* match length or unmatched char (if dist == 0) */
        var lx = 0;         /* running index in l_buf */
        var code;           /* the code to send */
        var extra;          /* number of extra bits to send */

        if (s.last_lit !== 0) {
          do {
            dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
            lc = s.pending_buf[s.l_buf + lx];
            lx++;

            if (dist === 0) {
              send_code(s, lc, ltree); /* send a literal byte */
              //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
            } else {
              /* Here, lc is the match length - MIN_MATCH */
              code = _length_code[lc];
              send_code(s, code + LITERALS + 1, ltree); /* send the length code */
              extra = extra_lbits[code];
              if (extra !== 0) {
                lc -= base_length[code];
                send_bits(s, lc, extra);       /* send the extra length bits */
              }
              dist--; /* dist is now the match distance - 1 */
              code = d_code(dist);
              //Assert (code < D_CODES, "bad d_code");

              send_code(s, code, dtree);       /* send the distance code */
              extra = extra_dbits[code];
              if (extra !== 0) {
                dist -= base_dist[code];
                send_bits(s, dist, extra);   /* send the extra distance bits */
              }
            } /* literal or match pair ? */

            /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
            //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
            //       "pendingBuf overflow");

          } while (lx < s.last_lit);
        }

        send_code(s, END_BLOCK, ltree);
      }


      /* ===========================================================================
       * Construct one Huffman tree and assigns the code bit strings and lengths.
       * Update the total bit length for the current block.
       * IN assertion: the field freq is set for all tree elements.
       * OUT assertions: the fields len and code are set to the optimal bit length
       *     and corresponding code. The length opt_len is updated; static_len is
       *     also updated if stree is not null. The field max_code is set.
       */
      function build_tree(s, desc)
      //    deflate_state *s;
      //    tree_desc *desc; /* the tree descriptor */
      {
        var tree = desc.dyn_tree;
        var stree = desc.stat_desc.static_tree;
        var has_stree = desc.stat_desc.has_stree;
        var elems = desc.stat_desc.elems;
        var n, m;          /* iterate over heap elements */
        var max_code = -1; /* largest code with non zero frequency */
        var node;          /* new node being created */

        /* Construct the initial heap, with least frequent element in
         * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
         * heap[0] is not used.
         */
        s.heap_len = 0;
        s.heap_max = HEAP_SIZE;

        for (n = 0; n < elems; n++) {
          if (tree[n * 2]/*.Freq*/ !== 0) {
            s.heap[++s.heap_len] = max_code = n;
            s.depth[n] = 0;

          } else {
            tree[n * 2 + 1]/*.Len*/ = 0;
          }
        }

        /* The pkzip format requires that at least one distance code exists,
         * and that at least one bit should be sent even if there is only one
         * possible code. So to avoid special checks later on we force at least
         * two codes of non zero frequency.
         */
        while (s.heap_len < 2) {
          node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
          tree[node * 2]/*.Freq*/ = 1;
          s.depth[node] = 0;
          s.opt_len--;

          if (has_stree) {
            s.static_len -= stree[node * 2 + 1]/*.Len*/;
          }
          /* node is 0 or 1 so it does not have extra bits */
        }
        desc.max_code = max_code;

        /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
         * establish sub-heaps of increasing lengths:
         */
        for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

        /* Construct the Huffman tree by repeatedly combining the least two
         * frequent nodes.
         */
        node = elems;              /* next internal node of the tree */
        do {
          //pqremove(s, tree, n);  /* n = node of least frequency */
          /*** pqremove ***/
          n = s.heap[1/*SMALLEST*/];
          s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
          pqdownheap(s, tree, 1/*SMALLEST*/);
          /***/

          m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

          s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
          s.heap[--s.heap_max] = m;

          /* Create a new node father of n and m */
          tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
          s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
          tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

          /* and insert the new node in the heap */
          s.heap[1/*SMALLEST*/] = node++;
          pqdownheap(s, tree, 1/*SMALLEST*/);

        } while (s.heap_len >= 2);

        s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

        /* At this point, the fields freq and dad are set. We can now
         * generate the bit lengths.
         */
        gen_bitlen(s, desc);

        /* The field len is now set, we can generate the bit codes */
        gen_codes(tree, max_code, s.bl_count);
      }


      /* ===========================================================================
       * Scan a literal or distance tree to determine the frequencies of the codes
       * in the bit length tree.
       */
      function scan_tree(s, tree, max_code)
      //    deflate_state *s;
      //    ct_data *tree;   /* the tree to be scanned */
      //    int max_code;    /* and its largest code of non zero frequency */
      {
        var n;                     /* iterates over all tree elements */
        var prevlen = -1;          /* last emitted length */
        var curlen;                /* length of current code */

        var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

        var count = 0;             /* repeat count of the current code */
        var max_count = 7;         /* max repeat count */
        var min_count = 4;         /* min repeat count */

        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }
        tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

          if (++count < max_count && curlen === nextlen) {
            continue;

          } else if (count < min_count) {
            s.bl_tree[curlen * 2]/*.Freq*/ += count;

          } else if (curlen !== 0) {

            if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
            s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

          } else if (count <= 10) {
            s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

          } else {
            s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
          }

          count = 0;
          prevlen = curlen;

          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;

          } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;

          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      }


      /* ===========================================================================
       * Send a literal or distance tree in compressed form, using the codes in
       * bl_tree.
       */
      function send_tree(s, tree, max_code)
      //    deflate_state *s;
      //    ct_data *tree; /* the tree to be scanned */
      //    int max_code;       /* and its largest code of non zero frequency */
      {
        var n;                     /* iterates over all tree elements */
        var prevlen = -1;          /* last emitted length */
        var curlen;                /* length of current code */

        var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

        var count = 0;             /* repeat count of the current code */
        var max_count = 7;         /* max repeat count */
        var min_count = 4;         /* min repeat count */

        /* tree[max_code+1].Len = -1; */  /* guard already set */
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }

        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

          if (++count < max_count && curlen === nextlen) {
            continue;

          } else if (count < min_count) {
            do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

          } else if (curlen !== 0) {
            if (curlen !== prevlen) {
              send_code(s, curlen, s.bl_tree);
              count--;
            }
            //Assert(count >= 3 && count <= 6, " 3_6?");
            send_code(s, REP_3_6, s.bl_tree);
            send_bits(s, count - 3, 2);

          } else if (count <= 10) {
            send_code(s, REPZ_3_10, s.bl_tree);
            send_bits(s, count - 3, 3);

          } else {
            send_code(s, REPZ_11_138, s.bl_tree);
            send_bits(s, count - 11, 7);
          }

          count = 0;
          prevlen = curlen;
          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;

          } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;

          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      }


      /* ===========================================================================
       * Construct the Huffman tree for the bit lengths and return the index in
       * bl_order of the last bit length code to send.
       */
      function build_bl_tree(s) {
        var max_blindex;  /* index of last bit length code of non zero freq */

        /* Determine the bit length frequencies for literal and distance trees */
        scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
        scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

        /* Build the bit length tree: */
        build_tree(s, s.bl_desc);
        /* opt_len now includes the length of the tree representations, except
         * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
         */

        /* Determine the number of bit length codes to send. The pkzip format
         * requires that at least 4 bit length codes be sent. (appnote.txt says
         * 3 but the actual value used is 4.)
         */
        for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
          if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
            break;
          }
        }
        /* Update opt_len to include the bit length tree and counts */
        s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
        //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
        //        s->opt_len, s->static_len));

        return max_blindex;
      }


      /* ===========================================================================
       * Send the header for a block using dynamic Huffman trees: the counts, the
       * lengths of the bit length codes, the literal tree and the distance tree.
       * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
       */
      function send_all_trees(s, lcodes, dcodes, blcodes)
      //    deflate_state *s;
      //    int lcodes, dcodes, blcodes; /* number of codes for each tree */
      {
        var rank;                    /* index in bl_order */

        //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
        //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
        //        "too many codes");
        //Tracev((stderr, "\nbl counts: "));
        send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
        send_bits(s, dcodes - 1, 5);
        send_bits(s, blcodes - 4, 4); /* not -3 as stated in appnote.txt */
        for (rank = 0; rank < blcodes; rank++) {
          //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
          send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
        }
        //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

        send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
        //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

        send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
        //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
      }


      /* ===========================================================================
       * Check if the data type is TEXT or BINARY, using the following algorithm:
       * - TEXT if the two conditions below are satisfied:
       *    a) There are no non-portable control characters belonging to the
       *       "black list" (0..6, 14..25, 28..31).
       *    b) There is at least one printable character belonging to the
       *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
       * - BINARY otherwise.
       * - The following partially-portable control characters form a
       *   "gray list" that is ignored in this detection algorithm:
       *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
       * IN assertion: the fields Freq of dyn_ltree are set.
       */
      function detect_data_type(s) {
        /* black_mask is the bit mask of black-listed bytes
         * set bits 0..6, 14..25, and 28..31
         * 0xf3ffc07f = binary 11110011111111111100000001111111
         */
        var black_mask = 0xf3ffc07f;
        var n;

        /* Check for non-textual ("black-listed") bytes. */
        for (n = 0; n <= 31; n++, black_mask >>>= 1) {
          if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
            return Z_BINARY;
          }
        }

        /* Check for textual ("white-listed") bytes. */
        if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
          s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
          return Z_TEXT;
        }
        for (n = 32; n < LITERALS; n++) {
          if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
            return Z_TEXT;
          }
        }

        /* There are no "black-listed" or "white-listed" bytes:
         * this stream either is empty or has tolerated ("gray-listed") bytes only.
         */
        return Z_BINARY;
      }


      var static_init_done = false;

      /* ===========================================================================
       * Initialize the tree data structures for a new zlib stream.
       */
      function _tr_init(s) {

        if (!static_init_done) {
          tr_static_init();
          static_init_done = true;
        }

        s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
        s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
        s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

        s.bi_buf = 0;
        s.bi_valid = 0;

        /* Initialize the first block of the first file: */
        init_block(s);
      }


      /* ===========================================================================
       * Send a stored block
       */
      function _tr_stored_block(s, buf, stored_len, last)
      //DeflateState *s;
      //charf *buf;       /* input block */
      //ulg stored_len;   /* length of input block */
      //int last;         /* one if this is the last block for a file */
      {
        send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
        copy_block(s, buf, stored_len, true); /* with header */
      }


      /* ===========================================================================
       * Send one empty static block to give enough lookahead for inflate.
       * This takes 10 bits, of which 7 may remain in the bit buffer.
       */
      function _tr_align(s) {
        send_bits(s, STATIC_TREES << 1, 3);
        send_code(s, END_BLOCK, static_ltree);
        bi_flush(s);
      }


      /* ===========================================================================
       * Determine the best encoding for the current block: dynamic trees, static
       * trees or store, and output the encoded block to the zip file.
       */
      function _tr_flush_block(s, buf, stored_len, last)
      //DeflateState *s;
      //charf *buf;       /* input block, or NULL if too old */
      //ulg stored_len;   /* length of input block */
      //int last;         /* one if this is the last block for a file */
      {
        var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
        var max_blindex = 0;        /* index of last bit length code of non zero freq */

        /* Build the Huffman trees unless a stored block is forced */
        if (s.level > 0) {

          /* Check if the file is binary or text */
          if (s.strm.data_type === Z_UNKNOWN) {
            s.strm.data_type = detect_data_type(s);
          }

          /* Construct the literal and distance trees */
          build_tree(s, s.l_desc);
          // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
          //        s->static_len));

          build_tree(s, s.d_desc);
          // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
          //        s->static_len));
          /* At this point, opt_len and static_len are the total bit lengths of
           * the compressed block data, excluding the tree representations.
           */

          /* Build the bit length tree for the above two trees, and get the index
           * in bl_order of the last bit length code to send.
           */
          max_blindex = build_bl_tree(s);

          /* Determine the best encoding. Compute the block lengths in bytes. */
          opt_lenb = (s.opt_len + 3 + 7) >>> 3;
          static_lenb = (s.static_len + 3 + 7) >>> 3;

          // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
          //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
          //        s->last_lit));

          if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

        } else {
          // Assert(buf != (char*)0, "lost buf");
          opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
        }

        if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
          /* 4: two words for the lengths */

          /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
           * Otherwise we can't have processed more than WSIZE input bytes since
           * the last block flush, because compression would have been
           * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
           * transform a block into a stored block.
           */
          _tr_stored_block(s, buf, stored_len, last);

        } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

          send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
          compress_block(s, static_ltree, static_dtree);

        } else {
          send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
          send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
          compress_block(s, s.dyn_ltree, s.dyn_dtree);
        }
        // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
        /* The above check is made mod 2^32, for files larger than 512 MB
         * and uLong implemented on 32 bits.
         */
        init_block(s);

        if (last) {
          bi_windup(s);
        }
        // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
        //       s->compressed_len-7*last));
      }

      /* ===========================================================================
       * Save the match info and tally the frequency counts. Return true if
       * the current block must be flushed.
       */
      function _tr_tally(s, dist, lc)
      //    deflate_state *s;
      //    unsigned dist;  /* distance of matched string */
      //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
      {
        //var out_length, in_length, dcode;

        s.pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff;
        s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

        s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
        s.last_lit++;

        if (dist === 0) {
          /* lc is the unmatched char */
          s.dyn_ltree[lc * 2]/*.Freq*/++;
        } else {
          s.matches++;
          /* Here, lc is the match length - MIN_MATCH */
          dist--;             /* dist = match distance - 1 */
          //Assert((ush)dist < (ush)MAX_DIST(s) &&
          //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
          //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

          s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
          s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
        }

        // (!) This block is disabled in zlib defailts,
        // don't enable it for binary compatibility

        //#ifdef TRUNCATE_BLOCK
        //  /* Try to guess if it is profitable to stop the current block here */
        //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
        //    /* Compute an upper bound for the compressed length */
        //    out_length = s.last_lit*8;
        //    in_length = s.strstart - s.block_start;
        //
        //    for (dcode = 0; dcode < D_CODES; dcode++) {
        //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
        //    }
        //    out_length >>>= 3;
        //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
        //    //       s->last_lit, in_length, out_length,
        //    //       100L - out_length*100L/in_length));
        //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
        //      return true;
        //    }
        //  }
        //#endif

        return (s.last_lit === s.lit_bufsize - 1);
        /* We avoid equality with lit_bufsize because of wraparound at 64K
         * on 16 bit machines and because stored blocks are restricted to
         * 64K-1 bytes.
         */
      }

      exports._tr_init = _tr_init;
      exports._tr_stored_block = _tr_stored_block;
      exports._tr_flush_block = _tr_flush_block;
      exports._tr_tally = _tr_tally;
      exports._tr_align = _tr_align;

    }, { "../utils/common": 41 }], 53: [function (require, module, exports) {
      'use strict';

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      function ZStream() {
        /* next input byte */
        this.input = null; // JS specific, because we have no pointers
        this.next_in = 0;
        /* number of bytes available at input */
        this.avail_in = 0;
        /* total number of input bytes read so far */
        this.total_in = 0;
        /* next output byte should be put there */
        this.output = null; // JS specific, because we have no pointers
        this.next_out = 0;
        /* remaining free space at output */
        this.avail_out = 0;
        /* total number of bytes output so far */
        this.total_out = 0;
        /* last error message, NULL if no error */
        this.msg = ''/*Z_NULL*/;
        /* not visible by applications */
        this.state = null;
        /* best guess about the data type: binary or text */
        this.data_type = 2/*Z_UNKNOWN*/;
        /* adler32 value of the uncompressed data */
        this.adler = 0;
      }

      module.exports = ZStream;

    }, {}], 54: [function (require, module, exports) {
      (function (global) {
        (function (global, undefined) {
          "use strict";

          if (global.setImmediate) {
            return;
          }

          var nextHandle = 1; // Spec says greater than zero
          var tasksByHandle = {};
          var currentlyRunningATask = false;
          var doc = global.document;
          var registerImmediate;

          function setImmediate(callback) {
            // Callback can either be a function or a string
            if (typeof callback !== "function") {
              callback = new Function("" + callback);
            }
            // Copy function arguments
            var args = new Array(arguments.length - 1);
            for (var i = 0; i < args.length; i++) {
              args[i] = arguments[i + 1];
            }
            // Store and register the task
            var task = { callback: callback, args: args };
            tasksByHandle[nextHandle] = task;
            registerImmediate(nextHandle);
            return nextHandle++;
          }

          function clearImmediate(handle) {
            delete tasksByHandle[handle];
          }

          function run(task) {
            var callback = task.callback;
            var args = task.args;
            switch (args.length) {
              case 0:
                callback();
                break;
              case 1:
                callback(args[0]);
                break;
              case 2:
                callback(args[0], args[1]);
                break;
              case 3:
                callback(args[0], args[1], args[2]);
                break;
              default:
                callback.apply(undefined, args);
                break;
            }
          }

          function runIfPresent(handle) {
            // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
            // So if we're currently running a task, we'll need to delay this invocation.
            if (currentlyRunningATask) {
              // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
              // "too much recursion" error.
              setTimeout(runIfPresent, 0, handle);
            } else {
              var task = tasksByHandle[handle];
              if (task) {
                currentlyRunningATask = true;
                try {
                  run(task);
                } finally {
                  clearImmediate(handle);
                  currentlyRunningATask = false;
                }
              }
            }
          }

          function installNextTickImplementation() {
            registerImmediate = function (handle) {
              process.nextTick(function () { runIfPresent(handle); });
            };
          }

          function canUsePostMessage() {
            // The test against `importScripts` prevents this implementation from being installed inside a web worker,
            // where `global.postMessage` means something completely different and can't be used for this purpose.
            if (global.postMessage && !global.importScripts) {
              var postMessageIsAsynchronous = true;
              var oldOnMessage = global.onmessage;
              global.onmessage = function () {
                postMessageIsAsynchronous = false;
              };
              global.postMessage("", "*");
              global.onmessage = oldOnMessage;
              return postMessageIsAsynchronous;
            }
          }

          function installPostMessageImplementation() {
            // Installs an event handler on `global` for the `message` event: see
            // * https://developer.mozilla.org/en/DOM/window.postMessage
            // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

            var messagePrefix = "setImmediate$" + Math.random() + "$";
            var onGlobalMessage = function (event) {
              if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
              }
            };

            if (global.addEventListener) {
              global.addEventListener("message", onGlobalMessage, false);
            } else {
              global.attachEvent("onmessage", onGlobalMessage);
            }

            registerImmediate = function (handle) {
              global.postMessage(messagePrefix + handle, "*");
            };
          }

          function installMessageChannelImplementation() {
            var channel = new MessageChannel();
            channel.port1.onmessage = function (event) {
              var handle = event.data;
              runIfPresent(handle);
            };

            registerImmediate = function (handle) {
              channel.port2.postMessage(handle);
            };
          }

          function installReadyStateChangeImplementation() {
            var html = doc.documentElement;
            registerImmediate = function (handle) {
              // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
              // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
              var script = doc.createElement("script");
              script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
              };
              html.appendChild(script);
            };
          }

          function installSetTimeoutImplementation() {
            registerImmediate = function (handle) {
              setTimeout(runIfPresent, 0, handle);
            };
          }

          // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
          var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
          attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

          // Don't get fooled by e.g. browserify environments.
          if ({}.toString.call(global.process) === "[object process]") {
            // For Node.js before 0.9
            installNextTickImplementation();

          } else if (canUsePostMessage()) {
            // For non-IE10 modern browsers
            installPostMessageImplementation();

          } else if (global.MessageChannel) {
            // For web workers, where supported
            installMessageChannelImplementation();

          } else if (doc && "onreadystatechange" in doc.createElement("script")) {
            // For IE 6–8
            installReadyStateChangeImplementation();

          } else {
            // For older browsers
            installSetTimeoutImplementation();
          }

          attachTo.setImmediate = setImmediate;
          attachTo.clearImmediate = clearImmediate;
        }(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}]
  }, {}, [10])(10)
}); "use strict";

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
