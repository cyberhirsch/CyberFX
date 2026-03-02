// Editor extensions for SynthBase — template loading, randomize, mutate, waveform drawing, WAV export.

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
