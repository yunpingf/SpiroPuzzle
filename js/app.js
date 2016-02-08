var context = new webkitAudioContext(); // one context per document
var osc = context.createOscillator(); // instantiate an oscillator
osc.frequency.value = 261.63; // (defaults to sin 440Hz)
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
    	oscillator.type = "custom";

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