var context = new webkitAudioContext(); // one context per document
var osc = context.createOscillator(); // instantiate an oscillator
osc.frequency.value = 261.63; // (defaults to sin 440Hz)
var imag= new Float32Array([0,0.1,0.05,0.35,0.14]);   // sine
var real = new Float32Array([0,0,0,0,0]);  // cos
var customWave = context.createPeriodicWave(real, imag);  // cos,sine
osc.setPeriodicWave(customWave);


osc.connect(context.destination); // connect it to the destination
osc.start(0); // start the oscillator

(function(window){
    //I recommend this
    'use strict';
    function define_library(){
        var Sound = {};
        var AudioContext = window.AudioContext || window.webkitAudioContext;
    	var audioCtx = new AudioContext();
    	var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
    	//oscillator.type = "custom";

        Sound.makeSound = function() {

        }
        Sound.setVolume = function(vol) {
            gainNode.gain.value = vol;
        }
        Sound.detune = function() {

        }
    	return Sound;
    }
    //define globally if it doesn't already exist
    if(typeof(Sound) === 'undefined'){
        window.Sound = define_library();
    }
    else{
        console.log("Library already defined.");
    }
})(window);