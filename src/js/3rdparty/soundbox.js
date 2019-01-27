(function () {
    'use strict';class SoundBox{constructor(){this.sounds={};this.instances=[];this.default_volume=1}load(a,b,d){this.sounds[a]=new Audio(b);if("function"==typeof d)this.sounds[a].addEventListener("canplaythrough",d);else return new Promise((c,b)=>{this.sounds[a].addEventListener("canplaythrough",c);this.sounds[a].addEventListener("error",b)})}remove(a){"undefined"!=typeof this.sounds&&delete this.sounds[a]}play(a,b,d=null){if("undefined"==typeof this.sounds[a])return console.error("Can't find sound called '"+
a+"'."),!1;var c=this.sounds[a].cloneNode(!0);c.volume=d||this.default_volume;c.play();this.instances.push(c);c.addEventListener("ended",()=>{let a=this.instances.indexOf(c);-1!=a&&this.instances.splice(a,1)});return"function"==typeof b?(c.addEventListener("ended",b),!0):new Promise((a,b)=>c.addEventListener("ended",a))}stop_all(){let a=this.instances.slice();for(let b of a)b.pause(),b.dispatchEvent(new Event("ended"))}}SoundBox.version="0.3.4";

    const soundbox = new SoundBox();

    soundbox.load('Success', 'data/Success.wav');
    soundbox.load('Failure', 'data/Failure.wav');

    window.soundbox = soundbox;
})();
