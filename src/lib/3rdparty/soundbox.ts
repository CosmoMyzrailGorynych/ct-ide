'use strict';

type knownSoundNames = 'Success' | 'Failure' | 'Wood_Start' | 'Wood_End';

class SoundBox {
    static version: string;
    sounds: Record<string, HTMLAudioElement> = {};
    instances: HTMLAudioElement[] = [];
    default_volume = 1;
    get mute() {
        return localStorage.disableSounds === 'on';
    }
    load(name: knownSoundNames, url: string, callback?: (this: HTMLAudioElement, ev: Event) => any) {
        this.sounds[name] = new Audio(url);
        if ("function" == typeof callback) {
            this.sounds[name].addEventListener("canplaythrough", callback);
        } else {
            return new Promise((c, b) => {
                this.sounds[name].addEventListener("canplaythrough", c);
                this.sounds[name].addEventListener("error", b)
            })
        }
    }
    remove(name: knownSoundNames) {
        "undefined" != typeof this.sounds && delete this.sounds[name]
    }
    play(name: knownSoundNames, callback?: (this: HTMLAudioElement, ev: Event) => any, volume?: number) {
        if (this.mute) {
            return;
        }
        if ("undefined" == typeof this.sounds[name]) {
            return console.error(`Can't find sound called '${name}'.`), false;
        }
        var audioTag = this.sounds[name].cloneNode(true) as HTMLAudioElement;
        audioTag.volume = volume ?? this.default_volume;
        audioTag.play();
        this.instances.push(audioTag);
        audioTag.addEventListener("ended", () => {
            let a = this.instances.indexOf(audioTag); - 1 != a && this.instances.splice(a, 1)
        });
        return "function" == typeof callback ? (audioTag.addEventListener("ended", callback), !0) : new Promise((a, b) => audioTag.addEventListener("ended", a))
    }
    stop_all() {
        let a = this.instances.slice();
        for (let b of a) b.pause(), b.dispatchEvent(new Event("ended"))
    }
}
SoundBox.version = "0.3.4";

export const soundbox = new SoundBox();

soundbox.load('Success', 'data/Success.wav');
soundbox.load('Failure', 'data/Failure.wav');
soundbox.load('Wood_Start', 'data/Wood_Start.wav');
soundbox.load('Wood_End', 'data/Wood_End.wav');
