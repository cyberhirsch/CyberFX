Math.clamp = function(value, min, max){
    return Math.max(min, Math.min(value, max));
}

// shallow copy
function copy_obj(obj){
    return Object.assign({}, obj);
}

function step(n){
    return function(x){
        if (x<=0 || x>=1) return 0;
        return ((x*x*x)*n-x*n)*(1-x)*(-1.5);
    }
}

function resize_fn(fn,a1,a2,b1,b2){
    return function(y){
        return fn( (y-b1)/(b2-b1) * (a2-a1) + a1 );
    }      
}

function add_fns( ...fns ){
    return function(x){                
        return fns.reduce((acc,fn) => acc + fn(x), 0);
    }
}

function isVisible (ele, container) {
    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    // The element is fully visible in the container
    return (
        (eleTop >= containerTop && eleBottom <= containerBottom) ||
        // Some part of the element is visible in the container
        (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom)
    );
};

function setVisible (ele, container) {
    if (isVisible(ele, container)){
        return;
    }
    //if above
    if (ele.offsetTop < container.scrollTop){
        container.scrollTop = ele.offsetTop;
    }
    //if below
    else if (ele.offsetTop + ele.offsetHeight > container.scrollTop + container.offsetHeight){
        container.scrollTop = ele.offsetTop - container.offsetHeight + ele.offsetHeight;
    }
}

function lerp(a, b, t){
    return a + t * (b - a);
}
const SAMPLE_RATE = 44100;
const CONVERSION_FACTOR = (2*Math.PI)/SAMPLE_RATE;

var AUDIO_CONTEXT;
function checkAudioContextExists() {
    try {
        if (AUDIO_CONTEXT == null) {
            if (typeof AudioContext != 'undefined') {
                AUDIO_CONTEXT = new AudioContext();
            } else if (typeof webkitAudioContext != 'undefined') {
                AUDIO_CONTEXT = new webkitAudioContext();
            }
        }
    } catch (ex) {
        window.console.log(ex)
    }
}

checkAudioContextExists();
//unlock bullshit
function ULBS() {
    if (AUDIO_CONTEXT.state === 'suspended') {
        var unlock = function() {
            AUDIO_CONTEXT.resume().then(function() {
                document.body.removeEventListener('touchstart', unlock);
                document.body.removeEventListener('touchend', unlock);
                document.body.removeEventListener('mousedown', unlock);
                document.body.removeEventListener('mouseup', unlock);
                document.body.removeEventListener('keydown', unlock);
                document.body.removeEventListener('keyup', unlock);
            });
        };

        document.body.addEventListener('touchstart', unlock, false);
        document.body.addEventListener('touchend', unlock, false);
        document.body.addEventListener('mousedown', unlock, false);
        document.body.addEventListener('mouseup', unlock, false);
        document.body.addEventListener('keydown', unlock, false);
        document.body.addEventListener('keyup', unlock, false);
    }
}class AKWF {

    /* Adventure Kid Waveforms (AKWF) converted for use with Teensy Audio Library 
*  
*  Adventure Kid Waveforms(AKWF) Open waveforms library
*  https://www.adventurekid.se/akrt/waveforms/adventure-kid-waveforms/
*  
*  This code is in the public domain, CC0 1.0 Universal (CC0 1.0)
*  https://creativecommons.org/publicdomain/zero/1.0/
*
*  Converted by Brad Roy, https://github.com/prosper00
*/

    /* AKWF_hvoice_0012 256 samples
                                                                                                                            
    +-----------------------------------------------------------------------------------------------------------------+   
    |          ***  **                                                                                                |   
    |        ***     ***                                                                                              |   
    |      ***         *                       *****                                    *******                       |   
    |     **           **                     **   *****                              ***     **                      |   
    |   **               *                  ***        ****                          **        **                     |   
    | **                 **                **              ******                    *          **                    |   
    |**                   *               **                    **                  **           **                   |   
    |                     *              **                      ***               **             **                **|   
    |                      *             *                          **            **               **             *** |   
    |                      **           **                           **          *                  **          **    |   
    |                       **          *                              *        **                   ***      ***     |   
    |                        *        **                                ***   **                       ********       |   
    |                        ***     **                                    ****                                       |   
    |                          **   **                                                                                |   
    |                           * ***                                                                                 |   
    +-----------------------------------------------------------------------------------------------------------------+   
                                                                                                                            
                                                                                                                            
    */

//suited for lower notes 
    static hvoice_0012 = [
        33078, 34077, 35044, 36007, 36938, 37805, 38590, 39410, 40186, 40979, 41828, 42751, 43765, 44750, 45625, 46506,
        47377, 48459, 49580, 50412, 51254, 52132, 53054, 53969, 55064, 56224, 57157, 57762, 58474, 59326, 60025, 60421,
        60707, 60933, 61192, 61199, 60011, 57771, 55825, 55237, 55020, 53932, 51409, 48089, 45399, 44422, 44106, 42490,
        39350, 35232, 30729, 27122, 25230, 23798, 21402, 18034, 14910, 12701, 11362, 10543, 9717, 8561, 7008, 4596,
        1765, 131, 201, 1146, 2023, 2735, 3299, 3911, 5049, 7131, 9717, 11930, 13324, 14032, 14722, 16044,
        18235, 21043, 24261, 27245, 29408, 31047, 33083, 35737, 38158, 39841, 40886, 41556, 42213, 43245, 44552, 45917,
        47119, 47870, 48264, 48770, 49539, 49925, 49668, 49229, 48873, 48432, 47913, 47384, 46902, 46605, 46302, 45760,
        45142, 44704, 44318, 43802, 43332, 43042, 42636, 41996, 41337, 40780, 40348, 40072, 39783, 39377, 39035, 38729,
        38329, 37958, 37837, 37831, 37639, 37223, 36573, 35566, 34312, 33093, 32117, 31428, 30844, 30079, 29059, 27979,
        27098, 26276, 25428, 24454, 23049, 21274, 19381, 17785, 16557, 15675, 15000, 14446, 13983, 13647, 13422, 13168,
        12982, 12753, 12429, 12068, 11998, 12294, 12943, 13955, 15251, 16750, 18381, 20097, 21804, 23476, 25102, 26674,
        28171, 29696, 31260, 32930, 34804, 36952, 39192, 41282, 43127, 44699, 46099, 47372, 48514, 49476, 50175, 50618,
        50888, 51099, 51305, 51404, 51383, 51221, 50812, 50133, 49166, 47971, 46660, 45347, 44055, 42645, 40991, 39107,
        37176, 35376, 33764, 32251, 30646, 28956, 27272, 25659, 24192, 22866, 21633, 20368, 19107, 17971, 16966, 16123,
        15408, 14840, 14468, 14309, 14374, 14559, 14792, 14960, 15096, 15298, 15643, 16099, 16589, 17068, 17606, 18341,
        19312, 20471, 21661, 22740, 23624, 24392, 25151, 25945, 26715, 27439, 28051, 28700, 29403, 30342, 31272, 32180,
    ];


        /* AKWF_hvoice_0008 256 samples
                                                                                                                        
  +-----------------------------------------------------------------------------------------------------------------+   
  |     **  **                                                                                                      |   
  |    **     **                                                                                                    |   
  |   **       *                                                                                                    |   
  |  **         *                                                                        **                         |   
  |  *          **                                                                     *******                      |   
  | **           **                                                                   **     ****                   |   
  | *             *                                                                 ***          **                 |   
  |*              **                                   ****                        **             **                |   
  |*               *                             *******  ***                    ***                *               |   
  |                 *                         ***           ***                ***                  **              |   
  |                 **               **********               **              **                     **            *|   
  |                  *             ***                         ***           **                       **           *|   
  |                  **           **                             **         **                         **         * |   
  |                   **       ***                                ***     ***                           ***      ** |   
  |                    ** *****                                     *******                               ***   **  |   
  +-----------------------------------------------------------------------------------------------------------------+   
                                                                                                                        
                                                                                                                        
*/


//suited for higher notes
static hvoice_0008 = [
    33181, 35486, 37968, 40376, 42771, 45080, 47364, 49564, 51743, 53835, 55881, 57791, 59589, 61183, 62575, 63700,
    64584, 65156, 65464, 65532, 65397, 65033, 64481, 63756, 62857, 61795, 60589, 59244, 57769, 56187, 54493, 52700,
    50804, 48810, 46710, 44526, 42252, 39909, 37506, 35065, 32606, 30170, 27780, 25481, 23312, 21314, 19526, 17987,
    16727, 15759, 15085, 14680, 14507, 14529, 14701, 14981, 15335, 15729, 16131, 16520, 16883, 17220, 17530, 17823,
    18107, 18405, 18742, 19133, 19600, 20152, 20793, 21528, 22346, 23219, 24124, 25037, 25940, 26826, 27679, 28455,
    29125, 29658, 30037, 30271, 30376, 30375, 30291, 30150, 29969, 29778, 29596, 29441, 29340, 29318, 29391, 29570,
    29865, 30266, 30762, 31336, 31959, 32594, 33218, 33807, 34355, 34865, 35333, 35749, 36106, 36392, 36606, 36762,
    36877, 36973, 37079, 37206, 37368, 37560, 37770, 37977, 38155, 38274, 38317, 38275, 38137, 37905, 37573, 37132,
    36575, 35905, 35127, 34265, 33341, 32369, 31357, 30322, 29276, 28227, 27188, 26149, 25114, 24089, 23079, 22088,
    21128, 20203, 19329, 18525, 17801, 17168, 16639, 16221, 15920, 15747, 15693, 15744, 15903, 16162, 16516, 16965,
    17495, 18088, 18756, 19498, 20308, 21208, 22190, 23241, 24387, 25619, 26888, 28221, 29593, 30838, 31899, 32887,
    33833, 34687, 35481, 36256, 37010, 37776, 38593, 39464, 40400, 41413, 42484, 43599, 44747, 45894, 47011, 48063,
    48999, 49776, 50378, 50781, 50983, 50998, 50824, 50475, 49983, 49374, 48691, 47998, 47342, 46758, 46270, 45870,
    45527, 45218, 44900, 44544, 44118, 43587, 42913, 42071, 41043, 39822, 38423, 36863, 35174, 33393, 31568, 29740,
    27974, 26304, 24772, 23384, 22152, 21048, 20083, 19228, 18476, 17792, 17155, 16532, 15920, 15312, 14725, 14184,
    13722, 13384, 13196, 13215, 13436, 13915, 14619, 15604, 16811, 18301, 19969, 21884, 23902, 26136, 28375, 30869,
];




    /* AKWF_fmsynth_0012 256 samples
                                                                                                                        
  +-----------------------------------------------------------------------------------------------------------------+   
  |      *****                ******                                                 ***   **                       |   
  |    ***                         ****                                            ***      **                      |   
  |  ***                               ***                                        **         *                      |   
  |***                                   ****                                   ***          **                     |   
  |*                                        ****                              ***             *                     |   
  |                                            ****                         ***               *                   **|   
  |                                               ****                   ***                  **                 ** |   
  |                                                  ******          *****                     *               ***  |   
  |                                                       ***********                          *              **    |   
  |                                                                                            **            **     |   
  |                                                                                             *           **      |   
  |                                                                                             *         **        |   
  |                                                                                              *       **         |   
  |                                                                                              **     **          |   
  |                                                                                               *   ***           |   
  +-----------------------------------------------------------------------------------------------------------------+   
                                                                                                                        
                                                                                                                        
*/


    static fmsynth_0012 = [
        33063, 33949, 34766, 35596, 36388, 37173, 37929, 38666, 39379, 40067, 40731, 41364, 41976, 42552, 43106, 43625,
        44121, 44580, 45016, 45417, 45794, 46139, 46456, 46745, 47012, 47248, 47464, 47656, 47829, 47980, 48113, 48229,
        48329, 48416, 48490, 48551, 48601, 48643, 48676, 48703, 48723, 48736, 48745, 48748, 48747, 48741, 48728, 48714,
        48693, 48667, 48635, 48595, 48550, 48497, 48436, 48364, 48284, 48193, 48090, 47974, 47846, 47706, 47550, 47380,
        47192, 46991, 46774, 46540, 46289, 46023, 45740, 45441, 45125, 44794, 44446, 44084, 43708, 43316, 42915, 42499,
        42073, 41634, 41187, 40727, 40263, 39791, 39311, 38826, 38337, 37843, 37348, 36850, 36350, 35850, 35350, 34852,
        34356, 33862, 33369, 32882, 32401, 31923, 31451, 30983, 30524, 30072, 29626, 29187, 28759, 28338, 27928, 27527,
        27135, 26754, 26385, 26024, 25678, 25343, 25020, 24708, 24412, 24128, 23858, 23602, 23360, 23134, 22922, 22727,
        22547, 22383, 22235, 22105, 21991, 21894, 21816, 21755, 21711, 21687, 21680, 21693, 21724, 21775, 21845, 21934,
        22044, 22172, 22320, 22487, 22677, 22885, 23113, 23363, 23631, 23921, 24229, 24558, 24908, 25279, 25671, 26081,
        26514, 26965, 27437, 27932, 28443, 28979, 29533, 30108, 30703, 31318, 31954, 32607, 33281, 33975, 34687, 35416,
        36163, 36925, 37703, 38490, 39289, 40096, 40909, 41719, 42527, 43324, 44108, 44867, 45598, 46286, 46925, 47500,
        47996, 48401, 48694, 48858, 48869, 48707, 48340, 47746, 46886, 45734, 44239, 42380, 40091, 37352, 34077, 30264,
        25772, 21005, 16784, 13147, 10049, 7453, 5312, 3592, 2252, 1258, 572, 166, 4, 62, 308, 722,
        1277, 1954, 2735, 3599, 4533, 5522, 6558, 7622, 8712, 9817, 10931, 12049, 13166, 14275, 15381, 16475,
        17558, 18628, 19685, 20730, 21760, 22777, 23780, 24757, 25723, 26697, 27638, 28588, 29498, 30430, 31300, 32236,
    ];

    /* Adventure Kid Waveforms (AKWF) converted for use with Teensy Audio Library 
*  
*  Adventure Kid Waveforms(AKWF) Open waveforms library
*  https://www.adventurekid.se/akrt/waveforms/adventure-kid-waveforms/
*  
*  This code is in the public domain, CC0 1.0 Universal (CC0 1.0)
*  https://creativecommons.org/publicdomain/zero/1.0/
*
*  Converted by Brad Roy, https://github.com/prosper00
*/

    /* AKWF_granular_0044 256 samples
                                                                                                                            
      +-----------------------------------------------------------------------------------------------------------------+   
      |                     **   **                                                                                     |   
      |                    **     *             ***                                                                     |   
      |                   *       *            **  ***                                                                  |   
      |                  **       *           *      ***                                                                |   
      |                  *        *          **        *                                                                |   
      |    ***          *         *          *         *                                                                |   
      | ***  *          *         *         **         *                                                                |   
      |*     *         **         *         *          *        ********************************************************|   
      |      *         *          *         *          *      **                                                        |   
      |      **       *           *        *           *   ****                                                         |   
      |       ****   **           *        *           *****                                                            |   
      |          ****             *       **           **                                                               |   
      |                           *       *                                                                             |   
      |                           *      **                                                                             |   
      |                           **    **                                                                              |   
      +-----------------------------------------------------------------------------------------------------------------+   
                                                                                                                            
                                                                                                                            
    */


    static granular_0044 = [
        32869, 33554, 33950, 34774, 35134, 36047, 36319, 37297, 37454, 38494, 38511, 39617, 39443, 40664, 40161, 41814,
        38882, 23368, 22518, 21974, 20997, 20545, 19523, 19169, 18210, 17982, 17163, 17128, 16552, 16803, 16594, 17281,
        17607, 18928, 20002, 22162, 24166, 27270, 30129, 33900, 37194, 41086, 44210, 47679, 50274, 53080, 55123, 57263,
        58843, 60380, 61646, 62635, 63750, 64193, 65294, 65000, 65535, 64171, 65114, 62655, 64487, 59956, 65114, 36210,
        212, 3832, 99, 1558, 1, 510, 0, 197, 120, 547, 1094, 1697, 2901, 3914, 5892, 7586,
        10533, 13157, 17216, 20988, 26107, 30361, 35515, 39386, 43777, 46670, 49891, 51621, 53703, 54463, 55644, 55730,
        56241, 55895, 55900, 55320, 54914, 54268, 53486, 52949, 51761, 51561, 49784, 50399, 47306, 51139, 28999, 14730,
        19959, 17550, 20023, 18982, 20690, 20318, 21655, 21737, 22859, 23286, 24286, 24994, 25914, 26840, 27701, 28756,
        29549, 30623, 31268, 32196, 32566, 33184, 33197, 33422, 33100, 32970, 32677, 32843, 32704, 32820, 32726, 32801,
        32745, 32785, 32759, 32771, 32771, 32760, 32779, 32753, 32784, 32751, 32787, 32749, 32786, 32751, 32785, 32753,
        32782, 32756, 32779, 32759, 32775, 32762, 32773, 32765, 32771, 32768, 32768, 32769, 32767, 32769, 32766, 32770,
        32766, 32769, 32767, 32770, 32767, 32769, 32767, 32770, 32768, 32768, 32768, 32768, 32768, 32768, 32768, 32768,
        32768, 32767, 32767, 32768, 32767, 32768, 32767, 32768, 32769, 32768, 32768, 32768, 32768, 32768, 32768, 32768,
        32767, 32768, 32768, 32768, 32769, 32768, 32768, 32768, 32767, 32768, 32768, 32769, 32768, 32768, 32767, 32769,
        32767, 32769, 32768, 32769, 32767, 32768, 32767, 32768, 32768, 32768, 32768, 32767, 32770, 32767, 32770, 32766,
        32771, 32765, 32772, 32762, 32775, 32757, 32786, 32653, 32303, 32073, 32011, 32104, 32434, 32756, 32768, 32767,
    ];


}class RealizedSound {
    static MIN_SAMPLE_RATE = SAMPLE_RATE;

    constructor(length, sample_rate) {
        this._buffer = AUDIO_CONTEXT.createBuffer(1, length, sample_rate);
    }


    getBuffer() {
        return this._buffer.getChannelData(0);
    }


    source = null;
    play() {
        ULBS();

        if (this.source!=null){
            this.stop();
        }
        this.source = AUDIO_CONTEXT.createBufferSource();

        this.source.buffer = this._buffer;
        this.source.connect(AUDIO_CONTEXT.destination);

        var t = AUDIO_CONTEXT.currentTime;
        if (typeof this.source.start != 'undefined') {
            this.source.start(t);
        } else {
            this.source.noteOn(t);
        }
        this.source.onended = function() {
            if (this.source){
                this.source.disconnect()
            }
        }
    }

    stop() {
        if (this.source==null){
            return;
        }
        this.source.stop();
        this.source.disconnect();
        this.source = null;
    }

    getDataUri() {
        const BIT_DEPTH=16;
        var raw_buffer = this.getBuffer();
        var output_buffer = new Array(raw_buffer.length);
        for (var i = 0; i < raw_buffer.length; i++) {
            // bit_depth is always 16, rescale [-1.0, 1.0) to [0, 65536)
            // Use 32768 (2^15) for 16-bit audio conversion (range: -32768 to 32767)
            output_buffer[i] = Math.floor(32768 * Math.max(-1, Math.min(raw_buffer[i], 1)))|0;
        }
        var wav = MakeRiff(SAMPLE_RATE, BIT_DEPTH, output_buffer);
        return wav.dataURI;
    }

    static from_buffer(buffer) {
        var sound = new RealizedSound(buffer.length, RealizedSound.MIN_SAMPLE_RATE);
        sound._buffer.copyToChannel(buffer, 0);
        return sound;
    };
}
/**
 * 
 * this uses ported/modified code from Thomas Vian's SfxrSynth:
	 * SfxrSynth
	 * 
	 * Copyright 2010 Thomas Vian
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * 	http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * 
	 * @author Thomas Vian
	 */

class Bfxr_DSP {
    static version = "1.0.4"

    static MIN_LENGTH = 0.18;
    static LoResNoisePeriod = 8;
    static sampleRate = 44100;
    static bitDepth = 16;

    constructor(params,param_info) {

        this.params = params;
        this.param_info = param_info;

        this.reset(true);
    }

    /*
     * Resets the runing variables from the params
     * Used once at the start (total reset) and for the repeat effect (partial reset)
     * */
    reset(total_reset = true){
        var params=this.params;


        this.frequency_period_samples = 100.0 / (params.frequency_start * params.frequency_start + 0.001);
        var minimum_frequency = Math.pow(params.min_frequency_relative_to_starting_frequency,0.4)*params.frequency_start;
        this.frequency_maxPeriod_samples = 100.0 / (minimum_frequency * minimum_frequency + 0.001);

        this.pitch_jump_reached = false;
        this.pitch_jump_2_reached = false;

        if (total_reset){

            this.masterVolume = params.masterVolume * params.masterVolume;
            
            this.waveType = (params.waveType)|0;

            if (params.sustainTime < 0.01) {
                params.sustainTime = 0.01;
            }

            this.clampTotalLength(params);

            this.sustainPunch = params.sustainPunch;

            this.phase = 0;

            this.minFreqency = params.min_frequency_relative_to_starting_frequency;
            this.muted = false;
            this.overtones = params.overtones * 10;
            this.overtoneFalloff = params.overtoneFalloff;

            this.compression_factor = 1 / (1 + 4 * params.compressionAmount);

            this.filters = params.lpFilterCutoff != 1.0 || params.hpFilterCutoff != 0.0;



            this.vibratoPhase = 0.0;
            this.vibratoSpeed = params.vibratoSpeed * params.vibratoSpeed * 0.01;
            this.vibratoAmplitude = params.vibratoDepth * 0.5;

            this.envelopeVolume = 0.0;
            this.envelopeStage = 0;
            this.envelopeTime = 0;
            this.envelopeLength0 = params.attackTime * params.attackTime * 100000.0;
            this.envelopeLength1 = params.sustainTime * params.sustainTime * 100000.0;
            this.envelopeLength2 = params.decayTime * params.decayTime * 100000.0 + 10;
            this.attack_length_samples = this.envelopeLength0;
            this.envelope_full_length_samples = this.envelopeLength0 + this.envelopeLength1 + this.envelopeLength2;

            
            this.bitcrush_freq_sweep = -params.bitCrushSweep / this.envelope_full_length_samples;
            this.bitcrush_phase = 0;
            this.bitcrush_last = 0;


            this.envelopeOverLength0 = 1.0 / this.envelopeLength0;
            this.envelopeOverLength1 = 1.0 / this.envelopeLength1;
            this.envelopeOverLength2 = 1.0 / this.envelopeLength2;

            this.flanger = params.flangerOffset != 0.0 || params.flangerSweep != 0.0;

            this.flangerDeltaOffset = params.flangerSweep * params.flangerSweep * params.flangerSweep * 0.2;
            this.flangerPos = 0;

            if (!this.flangerBuffer) {
                this.flangerBuffer = new Float32Array(1024);
            }
            if (!this.noiseBuffer) {
                this.noiseBuffer = new Float32Array(32);
            }
            if (!this.pinkNoiseBuffer) {
                this.pinkNoiseBuffer = new Float32Array(32);
            }
            if (!this.loResNoiseBuffer) {
                this.loResNoiseBuffer = new Float32Array(32);
            }
            this.oneBitNoiseState = 1 << 14;
            this.oneBitNoise = 0;
            this.buzzState = 1 << 14;
            this.buzz = 0;

            for (var i = 0; i < 1024; i++) {
                this.flangerBuffer[i] = 0.0;
            }
            for (i = 0; i < 32; i++) {
                this.noiseBuffer[i] = Math.random() * 2.0 - 1.0;
            }
            for (i = 0; i < 32; i++) {
                this.loResNoiseBuffer[i] = ((i % Bfxr_DSP.LoResNoisePeriod) == 0) ? Math.random() * 2.0 - 1.0 : this.loResNoiseBuffer[i - 1];
            }

            this.repeat_timestamp_samples = 0;

            //if 
            // when params.pitch_jump_repeat_speed is zero, it should not repeat (i.e. pitch_jump_repeat_length_samples should be the same as the envelope length)
            // when params.pitch_jump_repeat_speed is 1, it should repeat 10 times a second (i.e. sampleRate/50)        
            this.pitch_jump_repeat_length_samples = lerp(this.envelope_full_length_samples, Bfxr_DSP.sampleRate/50, params.pitch_jump_repeat_speed)+32;//adding 32 for safety
            
            // PITCH JUMP START


            var pitch_jump_window_size_samples = this.envelope_full_length_samples;
            if (this.pitch_jump_repeat_length_samples > 0) {
                pitch_jump_window_size_samples = this.pitch_jump_repeat_length_samples;
            }
                        
            if (params.pitch_jump_amount > 0.0) {
                this.pitch_jump_amount = 1.0 - params.pitch_jump_amount * params.pitch_jump_amount * 0.9;
            }
            else {
                this.pitch_jump_amount = 1.0 + params.pitch_jump_amount * params.pitch_jump_amount * 10.0;
            }        
            if (params.pitch_jump_2_amount > 0.0) {
                this.pitch_jump_2_amount = 1.0 - params.pitch_jump_2_amount * params.pitch_jump_2_amount * 0.9;
            }
            else {
                this.pitch_jump_2_amount = 1.0 + params.pitch_jump_2_amount * params.pitch_jump_2_amount * 10.0;
            }

            this.pitch_jump_current_timestamp_samples = 0;

            if (params.pitch_jump_onset_percent == 1.0) {
                this.pitch_jump_timestamp_sample = 0;
            }
            else {
                this.pitch_jump_timestamp_sample = params.pitch_jump_onset_percent * pitch_jump_window_size_samples + 32;
            }
            if (params.pitch_jump_onset2_percent == 1.0) {
                this.pitch_jump_2_timestamp_sample = 0;
            }
            else {
                this.pitch_jump_2_timestamp_sample = params.pitch_jump_onset2_percent * pitch_jump_window_size_samples + 32;
            }

            //scale by repeat_length_samples vs envelope_full_length_samples
            //need to scale by repeat_length_samples/envelope_full_length_samples
            // var pitch_jump_time_scale_factor = this.pitch_jump_repeat_length_samples / this.envelope_full_length_samples;
            // this.pitch_jump_timestamp_sample *= pitch_jump_time_scale_factor;
            // this.pitch_jump_2_timestamp_sample *= pitch_jump_time_scale_factor;

            //PITCH JUMP END

            if (this.waveType === 9) { //Bitnoise
                var sf = params.frequency_start;
                var mf = params.min_frequency_relative_to_starting_frequency;
    
                var startFrequency_min = this.param_info.param_min("frequency_start");
                var startFrequency_max = this.param_info.param_max("frequency_start");
                var startFrequency_mid = (startFrequency_max + startFrequency_min) / 2;
    
                var minFrequency_min = this.param_info.param_min("min_frequency_relative_to_starting_frequency");
                var minFrequency_max = this.param_info.param_max("min_frequency_relative_to_starting_frequency");
                var minFrequency_mid = (minFrequency_max + minFrequency_min) / 2;
    
                var delta_start = (sf - startFrequency_min) / (startFrequency_max - startFrequency_min)
                var delta_min = (mf - minFrequency_min) / (minFrequency_max - minFrequency_min)
    
                sf = startFrequency_mid + delta_start;
                mf = minFrequency_mid + delta_min;
    
                this.frequency_period_samples = 100.0 / (sf * sf + 0.001);
                this.frequency_maxPeriod_samples = 100.0 / (mf * mf + 0.001);
            }
        }

        // START sweep paramets designed to be reset with repeat speed
        this.slide = 1.0 - params.frequency_slide * params.frequency_slide * params.frequency_slide * 0.01;
        this.frequency_acceleration = -params.frequency_acceleration * params.frequency_acceleration * params.frequency_acceleration * 0.000001;

        this.flangerOffset = params.flangerOffset * params.flangerOffset * 1020.0;
        if (params.flangerOffset < 0.0) {
            this.flangerOffset = -this.flangerOffset;
        }
        
        this.bitcrush_freq = 1 - Math.pow(params.bitCrush, 1.0 / 3.0);

        
        if ((params.waveType)|0 == 0) {
            this.squareDuty = 0.5 - params.squareDuty * 0.5;
            this.dutySweep = -params.dutySweep * 0.00005;
        }
        
        this.lpFilterCutoff = params.lpFilterCutoff * params.lpFilterCutoff * params.lpFilterCutoff * 0.1;
        this.lpFilterDeltaCutoff = 1.0 + params.lpFilterCutoffSweep * 0.0001;
        this.lpFilterDamping = 5.0 / (1.0 + params.lpFilterResonance * params.lpFilterResonance * 20.0) * (0.01 + this.lpFilterCutoff);
        if (this.lpFilterDamping > 0.8) this.lpFilterDamping = 0.8;
        this.lpFilterDamping = 1.0 - this.lpFilterDamping;
        this.lpFilterOn = params.lpFilterCutoff != 1.0;

        this.lpFilterPos = 0.0;
        this.lpFilterDeltaPos = 0.0;
        this.hpFilterPos = 0.0;
        this.hpFilterCutoff = params.hpFilterCutoff * params.hpFilterCutoff * 0.1;
        this.hpFilterDeltaCutoff = 1.0 + params.hpFilterCutoffSweep * 0.0003;

        // END sweep paramets designed to be reset with repeat speed
        

        // when params.pitch_jump_repeat_speed, it should not repeat (i.e. be the same as the envelope length)
        // when params.pitch_jump_repeat_speed is 1, it should repeat 10 times a second (i.e. sampleRate/10)
        this.param_reset_period_samples = lerp(this.envelope_full_length_samples, Bfxr_DSP.sampleRate/10, params.repeatSpeed);
        this.param_reset_current_timestamp_samples = 0;

        

    }

    clampTotalLength(p)
    {
        var totalTime = p.attackTime + p.sustainTime + p.decayTime;
        if (totalTime < Bfxr_DSP.MIN_LENGTH ) 
        {
            var multiplier = Bfxr_DSP.MIN_LENGTH / totalTime;
            p.attackTime = p.attackTime * multiplier;
            p.sustainTime = p.sustainTime * multiplier;
            p.decayTime = p.decayTime * multiplier;
        }
    }

    generate_sound() {
        var buffer = new Float32Array(this.envelope_full_length_samples);
			
        this.sampleCount = 0;
        var bufferSample = 0.0;
        
        var length = this.envelope_full_length_samples;
        var finished = false;
        var last_nonzero_sample_index = -1;
        for(var i = 0; i < length; i++)
        {
            if (finished) 
            {
                return true;					
            }
            
            // Repeats every this.pitch_jump_repeat_length_samples times, partially resetting the sound parameters
            if(this.param_reset_period_samples != 0)
            {
                this.param_reset_current_timestamp_samples++;
                if(this.param_reset_current_timestamp_samples >= this.param_reset_period_samples)
                {
                    this.param_reset_current_timestamp_samples = 0;
                    this.reset(false);
                }
            }
            
            this.pitch_jump_current_timestamp_samples++;
            if (this.pitch_jump_current_timestamp_samples>=this.pitch_jump_repeat_length_samples)
            {				
                this.pitch_jump_current_timestamp_samples=0;
                if (this.pitch_jump_reached)
                {
                    this.frequency_period_samples /= this.pitch_jump_amount;
                    this.pitch_jump_reached=false;
                }
                if (this.pitch_jump_2_reached)
                {
                    this.frequency_period_samples /= this.pitch_jump_2_amount;
                    this.pitch_jump_2_reached=false;
                }
            }
            
            // If this.pitch_jump_timestamp_sample is reached, shifts the pitch
            if(!this.pitch_jump_reached)
            {
                if(this.pitch_jump_current_timestamp_samples >= this.pitch_jump_timestamp_sample)
                {
                    this.pitch_jump_reached = true;
                    this.frequency_period_samples *= this.pitch_jump_amount;
                }
            }
            
            // If this.pitch_jump_timestamp_sample is reached, shifts the pitch
            if(!this.pitch_jump_2_reached)
            {
                if(this.pitch_jump_current_timestamp_samples >= this.pitch_jump_2_timestamp_sample)
                {
                    this.frequency_period_samples *= this.pitch_jump_2_amount;
                    this.pitch_jump_2_reached=true;
                }
            }
            
            // Acccelerate and apply slide
            this.slide += this.frequency_acceleration;
            this.frequency_period_samples *= this.slide;
            
            // Checks for frequency getting too low, and stops the sound if a min_frequency_relative_to_starting_frequency was set
            if(this.frequency_period_samples > this.frequency_maxPeriod_samples)
            {
                this.frequency_period_samples = this.frequency_maxPeriod_samples;
                if(this.minFreqency > 0.0) {
                        this.muted = true;
                }										
            }
            
            this.periodTemp = this.frequency_period_samples;
            
            // Applies the vibrato effect
            if(this.vibratoAmplitude > 0.0)
            {
                this.vibratoPhase += this.vibratoSpeed;
                this.periodTemp = this.frequency_period_samples * (1.0 + Math.sin(this.vibratoPhase) * this.vibratoAmplitude);
            }
            
            this.periodTemp = (this.periodTemp)|0;
            if(this.periodTemp < 8) this.periodTemp = 8;
            
            // Sweeps the square duty
            if (this.waveType === 0)
            {
                this.squareDuty += this.dutySweep;
                if(this.squareDuty < 0.0) this.squareDuty = 0.001;
                else if (this.squareDuty > 0.5) this.squareDuty = 0.5;
            }
            
            // Moves through the different stages of the volume envelope
            if(++this.envelopeTime > this.attack_length_samples)
            {
                this.envelopeTime = 0;
                
                switch(++this.envelopeStage)
                {
                    case 1: this.attack_length_samples = this.envelopeLength1; break;
                    case 2: this.attack_length_samples = this.envelopeLength2; break;
                }
            }
            
            // Sets the volume based on the position in the envelope
            switch(this.envelopeStage)
            {
                case 0: 
                    this.envelopeVolume = this.envelopeTime * this.envelopeOverLength0; 									
                    break;
                case 1: 
                    this.envelopeVolume = 1.0 + (1.0 - this.envelopeTime * this.envelopeOverLength1) * 2.0 * this.sustainPunch; 
                        break;
                case 2: 
                    this.envelopeVolume = 1.0 - this.envelopeTime * this.envelopeOverLength2; 								
                    break;
                case 3: 
                    this.envelopeVolume = 0.0; finished = true; 													
                    break;
            }
            
            // Moves the flanger offset
            if (this.flanger)
            {
                this.flangerOffset += this.flangerDeltaOffset;
                this.flangerInt = (this.flangerOffset)|0;
                        if(this.flangerInt < 0) 	this.flangerInt = -this.flangerInt;
                else if (this.flangerInt > 1023) this.flangerInt = 1023;
            }
            
            // Moves the high-pass filter cutoff
            if(this.filters && this.hpFilterDeltaCutoff != 0.0)
            {
                this.hpFilterCutoff *= this.hpFilterDeltaCutoff;
                        if(this.hpFilterCutoff < 0.00001) 	this.hpFilterCutoff = 0.00001;
                else if(this.hpFilterCutoff > 0.1) 		this.hpFilterCutoff = 0.1;
            }
            
            this.superSample = 0.0;
            for(var j = 0; j < 8; j++)
            {
                // Cycles through the period
                this.phase++;
                if(this.phase >= this.periodTemp)
                {
                    this.phase = this.phase - this.periodTemp;
                    
                    // Generates new random noise for this period
                    switch(this.waveType)
                    {
                        case 3:  // WHITE NOISE
                            for(var n = 0; n < 32; n++) this.noiseBuffer[n] = Math.random() * 2.0 - 1.0;
                            break;
                        case 6: // TAN
                            for(n = 0; n < 32; n++) this.loResNoiseBuffer[n] = ((n%Bfxr_DSP.LoResNoisePeriod)==0) ? Math.random()*2.0-1.0 : this.loResNoiseBuffer[n-1];							
                            break;
                        case 9: // Bitnoise
                        // Based on SN76489 periodic "white" noise
                        // http://www.smspower.org/Development/SN76489?sid=ae16503f2fb18070f3f40f2af56807f1#NoiseChannel
                        // This one matches the behaviour of the SN76489 in the BBC Micro.
                        var feedBit = (this.oneBitNoiseState >> 1 & 1) ^ (this.oneBitNoiseState & 1);
                        this.oneBitNoiseState = this.oneBitNoiseState >> 1 | (feedBit << 14);
                        this.oneBitNoise = (~this.oneBitNoiseState & 1) - 0.5;
                        break;
                        // case 11: // BUZZ
                        //     // Based on SN76489 periodic "white" noise
                        //     // http://www.smspower.org/Development/SN76489?sid=ae16503f2fb18070f3f40f2af56807f1#NoiseChannel
                        //     // This one doesn't match the behaviour of anything real, but it made a nice sound, so I kept it.
                        // var fb = (this.buzzState >> 3 & 1) ^ (this.buzzState & 1);
                        // this.buzzState = this.buzzState >> 1 | (fb << 14);
                        // this.buzz = (~this.buzzState & 1) - 0.5;
                        // break;
                    }
                }
                
                this.sample=0;
                var overtonestrength=1;
                for (var k=0;k<=this.overtones;k++)
                {
                    var tempphase = (this.phase*(k+1))%this.periodTemp;
                    // Gets the sample from the oscillator
                    var wtype = this.waveType;

                    switch(wtype)
                    {
                        case 0: // Square wave
                        {
                            this.sample += overtonestrength*(((tempphase / this.periodTemp) < this.squareDuty) ? 0.5 : -0.5);
                            break;
                        }
                        case 1: // Saw wave
                        {
                            this.sample += overtonestrength*(1.0 - (tempphase / this.periodTemp) * 2.0);
                            break;
                        }
                        case 2: // Sine wave (fast and accurate approx)
                        {								
                                this.pos = tempphase / this.periodTemp;
                                this.pos = this.pos > 0.5 ? (this.pos - 1.0) * 6.28318531 : this.pos * 6.28318531;
                            var tempsample = this.pos < 0 ? 1.27323954 * this.pos + .405284735 * this.pos * this.pos : 1.27323954 * this.pos - 0.405284735 * this.pos * this.pos;
                            this.sample += overtonestrength*(tempsample < 0 ? .225 * (tempsample *-tempsample - tempsample) + tempsample : .225 * (tempsample * tempsample - tempsample) + tempsample);								
                            break;
                        }
                        case 3: // White Noise
                        {
                            this.sample += overtonestrength*(this.noiseBuffer[((tempphase * 32 / (this.periodTemp|0))|0)%32]);
                            break;
                        }
                        case 4: // Triangle Wave
                        {						
                            this.sample += overtonestrength*(Math.abs(1-(tempphase / this.periodTemp)*2)-1);
                            break;
                        }
                        case 5: //Organ
                        {
                            var sample_index = ((tempphase * 256 / (this.periodTemp|0))|0)%256;
                            var wave_sample = AKWF.granular_0044[sample_index]/32768-1;
                            this.sample += overtonestrength*wave_sample;
                            break;
                        } 
                        case 6: // tan
                        {
                            //detuned
                            this.sample += Math.tan(Math.PI*tempphase/this.periodTemp)*overtonestrength;
                            break;
                        }
                        case 7: // Whistle 
                        {				
                            // Sin wave code
                            this.pos = tempphase / this.periodTemp;
                            this.pos = this.pos > 0.5 ? (this.pos - 1.0) * 6.28318531 : this.pos * 6.28318531;
                            tempsample = this.pos < 0 ? 1.27323954 * this.pos + .405284735 * this.pos * this.pos : 1.27323954 * this.pos - 0.405284735 * this.pos * this.pos;
                            var value = 0.75*(tempsample < 0 ? .225 * (tempsample *-tempsample - tempsample) + tempsample : .225 * (tempsample * tempsample - tempsample) + tempsample);
                            //then whistle (essentially an overtone with frequencyx20 and amplitude0.25
                            
                            this.pos = ((tempphase*20) % this.periodTemp) / this.periodTemp;
                            this.pos = this.pos > 0.5 ? (this.pos - 1.0) * 6.28318531 : this.pos * 6.28318531;
                            tempsample = this.pos < 0 ? 1.27323954 * this.pos + .405284735 * this.pos * this.pos : 1.27323954 * this.pos - 0.405284735 * this.pos * this.pos;
                            value += 0.25*(tempsample < 0 ? .225 * (tempsample *-tempsample - tempsample) + tempsample : .225 * (tempsample * tempsample - tempsample) + tempsample);
                            
                            this.sample += overtonestrength*value;//main wave
                            
                            break;
                        }
                        case 8: // Breaker
                        {	
                            var amp = tempphase/this.periodTemp;								
                            this.sample += overtonestrength*(Math.abs(1-amp*amp*2)-1);
                            break;
                        }
                        case 9: // Bitnoise (1-bit periodic "white" noise)
                        {
                            this.sample += overtonestrength*this.oneBitNoise;
                            break;
                        }
                        case 10: //FM Synth
                        {
                            var sample_index = ((tempphase * 256 / (this.periodTemp|0))|0)%256;
                            var wave_sample = AKWF.fmsynth_0012[sample_index]/32768-1;
                            this.sample += overtonestrength*wave_sample;
                            break;
                        }
                        case 11: //Voice - wave sampled from AKWF_hvoice_0012
                        {
                            var sample_index = ((tempphase * 256 / (this.periodTemp|0))|0)%256;
                            var wave_sample = AKWF.hvoice_0012[sample_index]/32768-1;
                            this.sample += overtonestrength*wave_sample;
                            break;
                        }
                    }
                    overtonestrength*=(1-this.overtoneFalloff);
                    
                }					
                
                // Applies the low and high pass filters
                if (this.filters)
                {
                    this.lpFilterOldPos = this.lpFilterPos;
                    this.lpFilterCutoff *= this.lpFilterDeltaCutoff;
                            if(this.lpFilterCutoff < 0.0) this.lpFilterCutoff = 0.0;
                    else if(this.lpFilterCutoff > 0.1) this.lpFilterCutoff = 0.1;
                    
                    if(this.lpFilterOn)
                    {
                        this.lpFilterDeltaPos += (this.sample - this.lpFilterPos) * this.lpFilterCutoff;
                        this.lpFilterDeltaPos *= this.lpFilterDamping;
                    }
                    else
                    {
                        this.lpFilterPos = this.sample;
                        this.lpFilterDeltaPos = 0.0;
                    }
                    
                    this.lpFilterPos += this.lpFilterDeltaPos;
                    
                    this.hpFilterPos += this.lpFilterPos - this.lpFilterOldPos;
                    this.hpFilterPos *= 1.0 - this.hpFilterCutoff;
                    this.sample = this.hpFilterPos;
                }
                
                // Applies the flanger effect
                if (this.flanger)
                {
                    this.flangerBuffer[this.flangerPos&1023] = this.sample;
                    this.sample += this.flangerBuffer[(this.flangerPos - this.flangerInt + 1024) & 1023];
                    this.flangerPos = (this.flangerPos + 1) & 1023;
                }
                
                this.superSample += this.sample;
            }
            
            // Clipping if too loud
            if(this.superSample > 8.0) 	this.superSample = 8.0;
            else if(this.superSample < -8.0) 	this.superSample = -8.0;					 				 				
            		
            
            
            //BIT CRUSH				
            this.bitcrush_phase+=this.bitcrush_freq;
            if (this.bitcrush_phase>1)
            {
                this.bitcrush_phase=0;
                this.bitcrush_last=this.superSample;	 
            }
            var multiplier = lerp(1,50*this.bitcrush_freq,Math.sqrt(this.bitcrush_freq));
            this.bitcrush_freq = Math.max(Math.min(this.bitcrush_freq+multiplier*this.bitcrush_freq_sweep,1),0.00001);
            this.superSample=this.bitcrush_last; 				
        
            // Averages out the super samples and applies volumes
            this.superSample = this.masterVolume * this.envelopeVolume * this.superSample * 0.125;		
                            
            //compressor
                
            if (this.superSample>0)
            {
                this.superSample = Math.pow(this.superSample,this.compression_factor);
            }
            else
            {
                this.superSample = -Math.pow(-this.superSample,this.compression_factor);
            }
            
            if (this.muted)
            {
                //early out - resize buffer to current length, and return
                buffer = buffer.slice(0,i);
                break;
            }            
            
            //approimxate zero (say ~ e-19)
            if (Math.abs(this.superSample)>0.2e-2){
                last_nonzero_sample_index = i;
            }
            buffer[i] = Math.clamp(this.superSample, -1, 1);
        }
        
        if (last_nonzero_sample_index<buffer.length-1){
            //min value of 10
            last_nonzero_sample_index = Math.max(last_nonzero_sample_index,10);
            buffer = buffer.slice(0,last_nonzero_sample_index+1);
        }
        this.buffer = buffer;    
    }
}   // Minimal SynthBase - param management + playback only. No templates/randomize/editor features.
class SynthBase {

    sound = null;
    params = {};
    locked_params = null;

    default_params() {
        var result = {};
        for (var i = 0; i < this.param_info.length; i++) {
            var param = this.param_info[i];
            if (param.constructor === Array) {
                var param_name = param[2];
                var param_default_value = param[3];
                result[param_name] = param_default_value;
            } else {
                switch (param.type) {
                    case "BUTTONSELECT":
                        result[param.name] = param.default_value;
                        break;
                    case "KNOB_TRANSITION":
                        result[param.name] = param.default_value_l;
                        break;
                    default:
                        console.error("Unknown param type: " + param.type);
                }
            }
        }
        return result;
    }

    apply_params(other_params, check_locked = false) {
        for (var key in other_params) {
            if (!check_locked || !this.locked_param(key)) {
                this.params[key] = other_params[key];
            }
        }
    }

    param_is_disabled(param_name) {
        return false;
    }

    reset_params(check_locked = false) {
        var default_params = this.default_params();
        this.apply_params(default_params, check_locked);
    }

    post_initialize() {
        this.params = this.default_params();
        this.create_locked_params_array();
    }

    create_locked_params_array() {
        if (this.locked_params) {
            return;
        }
        this.locked_params = {};
        for (var i = 0; i < this.param_info.length; i++) {
            var param = this.get_param_normalized(this.param_info[i]);
            this.locked_params[param.name] = false;
        }
        for (var i = 0; i < this.permalocked.length; i++) {
            this.locked_params[this.permalocked[i]] = true;
        }
    }

    get_param_normalized(param) {
        var result = {};
        if (param.constructor === Array) {
            result.name = param[2];
            result.default_value = param[3];
            result.min_value = param[4];
            result.max_value = param[5];
            result.type = "RANGE";
        } else {
            switch (param.type) {
                case "BUTTONSELECT":
                    result.name = param.name;
                    result.default_value = param.default_value;
                    result.min_value = 0;
                    result.max_value = param.values.length;
                    result.type = "BUTTONSELECT";
                    break;
                case "KNOB_TRANSITION":
                    result.name = param.name;
                    result.default_value = param.default_value_l;
                    result.min_value = param.min;
                    result.max_value = param.max;
                    result.type = "KNOB_TRANSITION";
                    break;
                default:
                    console.error("Don't know how to uniformize param type: " + param.type);
            }
        }
        return result;
    }

    param_min(param_name) {
        for (var i = 0; i < this.param_info.length; i++) {
            var param_o = this.param_info[i];
            var param_o_normalized = this.get_param_normalized(param_o);
            if (param_o_normalized.name === param_name) {
                return param_o_normalized.min_value;
            }
        }
        console.error("Could not find param: " + param_name);
        return 0;
    }

    param_max(param_name) {
        for (var i = 0; i < this.param_info.length; i++) {
            var param_o = this.param_info[i];
            var param_o_normalized = this.get_param_normalized(param_o);
            if (param_o_normalized.name === param_name) {
                return param_o_normalized.max_value;
            }
        }
        console.error("Could not find param: " + param_name);
        return 1;
    }

    param_default(param_name) {
        for (var i = 0; i < this.param_info.length; i++) {
            var param_o = this.param_info[i];
            var param_o_normalized = this.get_param_normalized(param_o);
            if (param_o_normalized.name === param_name) {
                return param_o_normalized.default_value;
            }
        }
        console.error("Could not find param: " + param_name);
        return 0;
    }

    set_param(param_name, value, checkLocked = false) {
        if (!(param_name in this.params)) {
            console.error(`Could not set parameter (not found): ${param_name}`);
            return;
        }
        if (checkLocked) {
            if (this.locked_params[param_name]) {
                return;
            }
        }
        var min_val = this.param_min(param_name);
        var max_val = this.param_max(param_name);
        this.params[param_name] = Math.clamp(value, min_val, max_val);
    }

    get_param(param_name) {
        if (!(param_name in this.params)) {
            console.error(`Could not get parameter (not found): ${param_name}`);
            return 0;
        }
        return this.params[param_name];
    }

    get_param_info(param_name) {
        for (var i = 0; i < this.param_info.length; i++) {
            var param = this.param_info[i];
            if (param.constructor === Array) {
                if (param[2] === param_name) return param;
            } else {
                if (param.name === param_name) return param;
            }
        }
        console.error(`Could not find param: ${param_name}`);
        return null;
    }

    play() {
        if (this.sound) {
            this.sound.stop();
        }
        this.generate_sound();
        this.sound.play();
    }

    generate_sound() {
        console.error("generate_sound not implemented");
        var tempbuffer = new Float32Array(1);
        if (this.sound) {
            this.sound.stop();
        }
        this.sound = RealizedSound.from_buffer(tempbuffer);
    }

    set_sound(sound) {
        this.sound = sound;
    }

    locked_param(param_name) {
        if (this.permalocked.includes(param_name)) {
            return true;
        }
        return this.locked_params[param_name];
    }

    set_locked_param(param_name, value) {
        if (this.permalocked.includes(param_name)) {
            this.locked_params[param_name] = true;
            return;
        }
        this.locked_params[param_name] = value;
    }
}
// Minimal Bfxr - param definitions + DSP synthesis only. No templates, no randomizers.
class Bfxr extends SynthBase {

    name = "Bfxr";
    version = Bfxr_DSP.version;
    tooltip = "Bfxr is a simple sound effect generator, based on DrPetter's Sfxr.";

    canvas_bg_logo = "img/logo_bfxr.png";
    header_properties = ["waveType"];
    permalocked = ["masterVolume"];
    hide_params = ["masterVolume"];

    param_info = [
        ["Sound Volume", "Overall volume of the current sound.", "masterVolume", 0.5, 0, 1],
        {
            type: "BUTTONSELECT",
            name: "waveType",
            display_name: "",
            tooltip: "",
            default_value: 0,
            columns: 4,
            header: true,
            values: [
                ["Triangle", "Triangle waves are robust at all frequencies, stand out quite well in most situations, and have a clear, resonant quality.", 4],
                ["Sin", "Sin waves are the most elementary of all wave-types.  However, they can be sensitive to context (background noise or accoustics can drown them out sometimes), so be careful.", 2],
                ["Square", "quare waves can be quite powerful.  They have two extra properties, Square Duty and Duty Sweep, that can further control the timbre of the wave.", 0],
                ["Saw", "Saw waves are pretty raspy", 1],
                ["Breaker", "These are defined by a quadratic equation (a=t*t%1, giving a toothed-shaped), making them a little more hi-fi than other wave-types on this list.  For the most part, like a smoother, slicker triangle wave.", 8],
                ["Tan", "A potentially crazy wave.  Does strange things.  Tends to produce plenty of distortion\t (because the basic shape goes outside of the standard waveform range).", 6],
                ["Whistle", "A sin wave with an additional sine wave overlayed at a lower amplitude and 20x the frequency.  It can end up sounding buzzy, hollow, resonant, or breathy.", 7],
                ["White", "White noise is your bog standard random number stream.  Quite hard-sounding, compared to pink noise.", 3],
                ["Voice", "A digital voice sample.", 11],
                ["Bitnoise", "Periodic 1-bit \"white\" noise. Useful for glitchy and punky sound effects.", 9],
                ["Rasp", "Periodic 1-bit noise with a shortened period. It makes a nice digital buzz or clang sound.", 5],
                ["FMSyn", "A pretty dense mix of lots of waveforms.  Breathier/distorteder than the classic ones.", 10],
            ]
        },
        ["Attack Time", "Length of the volume envelope attack.", "attackTime", 0, 0, 1],
        ["Sustain Time", "Length of the volume envelope sustain.", "sustainTime", 0.3, 0, 1],
        ["Punch", "Tilts the sustain envelope for more 'pop'.", "sustainPunch", 0, 0, 1],
        ["Decay Time", "Length of the volume envelope decay (yes, I know it's called release).", "decayTime", 0.4, 0.03, 1],
        ["Compression", "Pushes amplitudes together into a narrower range to make them stand out more.  Very good for sound effects, where you want them to stick out against background music. If unlocked, this is set to zero during randomization.", "compressionAmount", 0, 0, 1],
        ["Frequency", "Base note of the sound.", "frequency_start", 0.3, 0, 1],
        ["Frequency Slide", "Slides the frequency up or down.", "frequency_slide", 0.0, -0.5, 0.5],
        ["Delta Slide", "Accelerates the frequency.  Can be used to get the frequency to change direction.", "frequency_acceleration", 0.0, -1, 1],
        ["Frequency Cutoff", "If sliding, the sound will stop at this frequency, to prevent really low notes.  0 means no cuttoff, 1 refers to the starting frequency of the sound. Ignores vibrato.  If the sound trajectory only goes up, this is disabled.", "min_frequency_relative_to_starting_frequency", 0.0, 0, 0.99],
        ["Vibrato Depth", "Strength of the vibrato effect.", "vibratoDepth", 0, 0, 1],
        ["Vibrato Speed", "Speed of the vibrato effect (i.e. frequency).", "vibratoSpeed", 0, 0, 1],
        ["Pitch Jump Repeat Speed", "Larger Values means more pitch jumps, which can be useful for arpeggiation. 0 means a single jump in the whole sound, 1 means 50 jumps a second.", "pitch_jump_repeat_speed", 0, 0, 1],
        ["Pitch Jump Amount 1", "Jump in pitch, either up or down.", "pitch_jump_amount", 0, -1, 1],
        ["Pitch Jump Onset 1", "When the first pitch-jump happens.", "pitch_jump_onset_percent", 0, 0, 1],
        ["Pitch Jump Amount 2", "Second jump in pitch, either up or down.", "pitch_jump_2_amount", 0, -1, 1],
        ["Pitch Jump Onset 2", "When the second pitch-jump happens.", "pitch_jump_onset2_percent", 0, 0, 1],
        ["Harmonics", "Overlays copies of the waveform with copies and multiples of its frequency.  Good for bulking out or otherwise enriching the texture of the sounds (warning: this is the number 1 cause of bfxr slowdown!).", "overtones", 0, 0, 1],
        ["Harmonics Falloff", "The rate at which higher overtones should decay.", "overtoneFalloff", 0, 0, 1],
        ["Square Duty", "Square waveform only : Controls the ratio between the up and down states of the square wave, changing the timbre.", "squareDuty", 0, 0, 0.99],
        ["Duty Sweep", "Square waveform only : Sweeps the duty up or down.", "dutySweep", 0, -1, 1],
        ["Repeat Speed", "Speed of the note repeating - certain variables are reset each time (sweeps, pitch slide, delta slide, etc. - doesn't apply to pitch jumps which have their own repeat parameter). 0 means no repeat, 1 means 10 repeats a second.", "repeatSpeed", 0, 0, 1],
        ["Flanger Offset", "Offsets a second copy of the wave by a small phase, changing the timbre.", "flangerOffset", 0, -1, 1],
        ["Flanger Sweep", "Sweeps the phase up or down.", "flangerSweep", 0, -1, 1],
        ["Low-pass Filter Cutoff", "Frequency at which the low-pass filter starts attenuating higher frequencies.  Named most likely to result in 'Huh why can't I hear anything?' at her high-school grad. ", "lpFilterCutoff", 1, 0.01, 1],
        ["Low-pass Filter Cutoff Sweep", "Sweeps the low-pass cutoff up or down.", "lpFilterCutoffSweep", 0, -1, 1],
        ["Low-pass Filter Resonance", "Changes the attenuation rate for the low-pass filter, changing the timbre.", "lpFilterResonance", 0, 0, 1],
        ["High-pass Filter Cutoff", "Frequency at which the high-pass filter starts attenuating lower frequencies.", "hpFilterCutoff", 0, 0, 1],
        ["High-pass Filter Cutoff Sweep", "Sweeps the high-pass cutoff up or down.", "hpFilterCutoffSweep", 0, -1, 1],
        ["Bit Crush", "Resamples the audio at a lower frequency.", "bitCrush", 0, 0, 1],
        ["Bit Crush Sweep", "Sweeps the Bit Crush filter up or down.", "bitCrushSweep", 0, -1, 1],
    ];

    constructor() {
        super();
        this.post_initialize();
    }

    generate_sound() {
        var dsp = new Bfxr_DSP(this.params, this);
        dsp.generate_sound();
        this.sound = RealizedSound.from_buffer(dsp.buffer);
    }

    param_is_disabled(param_name) {
        if (this.get_param("waveType") !== 0) {
            if (param_name == "squareDuty" || param_name == "dutySweep") {
                return true;
            }
        }
        if (param_name == "min_frequency_relative_to_starting_frequency") {
            if (this.get_param("frequency_slide") >= 0 && this.get_param("frequency_acceleration") >= 0) {
                return true;
            }
        }
        return false;
    }
}
