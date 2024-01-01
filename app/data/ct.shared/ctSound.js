var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/ct.release/sounds.ts
var sounds_exports = {};
__export(sounds_exports, {
  default: () => sounds_default,
  exportedSounds: () => exportedSounds,
  pannedSounds: () => pannedSounds,
  pixiSoundInstances: () => pixiSoundInstances,
  pixiSoundPrefix: () => pixiSoundPrefix,
  playRandomVariant: () => playRandomVariant,
  playVariant: () => playVariant,
  playWithoutEffects: () => playWithoutEffects,
  soundMap: () => soundMap,
  soundsLib: () => soundsLib
});
module.exports = __toCommonJS(sounds_exports);
var PannerFilter = class extends PIXI.sound.filters.Filter {
  constructor(refDistance, rolloffFactor) {
    const { audioContext } = PIXI.sound.context;
    const panner = audioContext.createPanner();
    panner.panningModel = "equalpower";
    panner.distanceModel = "inverse";
    panner.refDistance = refDistance;
    panner.rolloffFactor = rolloffFactor;
    const destination = panner;
    super(destination);
    this._panner = panner;
  }
  reposition(tracked) {
    if (tracked.kill) {
      return;
    }
    this._panner.positionX.value = tracked.x / camera.referenceLength;
    this._panner.positionY.value = tracked.y / camera.referenceLength;
  }
  destroy() {
    super.destroy();
    this._panner = null;
  }
};
var pannedSounds = /* @__PURE__ */ new Map();
var _a;
var exportedSounds = (_a = [
  /*!@sounds@*/
][0]) != null ? _a : [];
var soundMap = {};
for (const exportedSound of exportedSounds) {
  soundMap[exportedSound.name] = exportedSound;
}
var pixiSoundInstances = {};
var fxNames = Object.keys(PIXI.sound.filters).filter((name) => name !== "Filter" && name !== "StreamFilter");
var fxNamesToClasses = {};
for (const fxName of fxNames) {
  fxNamesToClasses[fxName] = PIXI.sound.filters[fxName];
}
var pixiSoundPrefix = "pixiSound-";
var randomRange = (min, max) => Math.random() * (max - min) + min;
var withSound = (name, fn) => {
  const pixiFind = PIXI.sound.exists(name) && PIXI.sound.find(name);
  if (pixiFind) {
    return fn(pixiFind);
  }
  if (name in pixiSoundInstances) {
    return fn(pixiSoundInstances[name]);
  } else if (name in soundMap) {
    for (const variant of soundMap[name].variants) {
      return fn(pixiSoundInstances[`${pixiSoundPrefix}${variant.uid}`]);
    }
  } else {
    throw new Error(`[sounds] Sound "${name}" was not found. Is it a typo?`);
  }
  return null;
};
var playVariant = (sound, variant, options) => {
  var _a2, _b, _c, _d, _e;
  const pixiSoundInst = PIXI.sound.find(`${pixiSoundPrefix}${variant.uid}`).play(options);
  if ((_a2 = sound.volume) == null ? void 0 : _a2.enabled) {
    pixiSoundInst.volume = randomRange(sound.volume.min, sound.volume.max) * ((options == null ? void 0 : options.volume) || 1);
  } else if ((options == null ? void 0 : options.volume) !== void 0) {
    pixiSoundInst.volume = options.volume;
  }
  if ((_b = sound.pitch) == null ? void 0 : _b.enabled) {
    pixiSoundInst.speed = randomRange(sound.pitch.min, sound.pitch.max) * ((options == null ? void 0 : options.speed) || 1);
  } else if ((options == null ? void 0 : options.speed) !== void 0) {
    pixiSoundInst.speed = options.speed;
  }
  if ((_c = sound.distortion) == null ? void 0 : _c.enabled) {
    soundsLib.addDistortion(
      pixiSoundInst,
      randomRange(sound.distortion.min, sound.distortion.max)
    );
  }
  if ((_d = sound.reverb) == null ? void 0 : _d.enabled) {
    soundsLib.addReverb(
      pixiSoundInst,
      randomRange(sound.reverb.secondsMin, sound.reverb.secondsMax),
      randomRange(sound.reverb.decayMin, sound.reverb.decayMax),
      sound.reverb.reverse
    );
  }
  if ((_e = sound.eq) == null ? void 0 : _e.enabled) {
    soundsLib.addEqualizer(
      pixiSoundInst,
      ...sound.eq.bands.map((band) => randomRange(band.min, band.max))
      // 🍝
    );
  }
  return pixiSoundInst;
};
var playWithoutEffects = (sound, variant, options) => {
  const pixiSoundInst = PIXI.sound.find(`${pixiSoundPrefix}${variant.uid}`).play(options);
  return pixiSoundInst;
};
var playRandomVariant = (sound, options) => {
  const variant = sound.variants[Math.floor(Math.random() * sound.variants.length)];
  return playVariant(sound, variant, options);
};
var soundsLib = {
  /**
   * Preloads a sound. This is usually applied to music files before playing
   * as they are not preloaded by default.
   *
   * @param {string} name The name of a sound
   * @returns {Promise<string>} A promise that resolves into the name of the loaded sound asset.
   */
  load(name) {
    return __async(this, null, function* () {
      const key = `${pixiSoundPrefix}${name}`;
      if (!PIXI.Assets.cache.has(key)) {
        throw new Error(`[sounds.load] Sound "${name}" was not found. Is it a typo? Did you mean to use res.loadSound instead?`);
      }
      yield PIXI.Assets.load(key);
      return name;
    });
  },
  /**
   * Plays a sound.
   *
   * @param {string} name Sound's name
   * @param {PlayOptions} [options] Options used for sound playback.
   * @param {Function} options.complete When completed.
   * @param {number} options.end End time in seconds.
   * @param {filters.Filter[]} options.filters Filters that apply to play.
   * @param {Function} options.loaded If not already preloaded, callback when finishes load.
   * @param {boolean} options.loop Override default loop, default to the Sound's loop setting.
   * @param {boolean} options.muted If sound instance is muted by default.
   * @param {boolean} options.singleInstance Setting true will stop any playing instances.
   * @param {number} options.speed Override default speed, default to the Sound's speed setting.
   * @param {number} options.start Start time offset in seconds.
   * @param {number} options.volume Override default volume.
   * @returns Either a sound instance, or a promise that resolves into a sound instance.
   */
  play(name, options) {
    if (name in soundMap) {
      const exported = soundMap[name];
      return playRandomVariant(exported, options);
    }
    if (name in pixiSoundInstances) {
      return pixiSoundInstances[name].play(options);
    }
    throw new Error(`[sounds.play] Sound "${name}" was not found. Is it a typo?`);
  },
  playAt(name, position, options) {
    const sound = soundsLib.play(name, options);
    const { panning } = soundMap[name];
    if (sound instanceof Promise) {
      sound.then((instance) => {
        soundsLib.addPannerFilter(
          instance,
          position,
          panning.refDistance,
          panning.rolloffFactor
        );
      });
    } else {
      soundsLib.addPannerFilter(
        sound,
        position,
        panning.refDistance,
        panning.rolloffFactor
      );
    }
    return sound;
  },
  /**
   * Stops a sound if a name is specified, otherwise stops all sound.
   *
   * @param {string|IMediaInstance} [name] Sound's name, or the sound instance.
   *
   * @returns {void}
   */
  stop(name) {
    if (name) {
      if (typeof name === "string") {
        withSound(name, (sound) => sound.stop());
      } else {
        name.stop();
      }
    } else {
      PIXI.sound.stopAll();
    }
  },
  /**
   * Pauses a sound if a name is specified, otherwise pauses all sound.
   *
   * @param {string} [name] Sound's name
   *
   * @returns {void}
   */
  pause(name) {
    if (name) {
      withSound(name, (sound) => sound.pause());
    } else {
      PIXI.sound.pauseAll();
    }
  },
  /**
   * Resumes a sound if a name is specified, otherwise resumes all sound.
   *
   * @param {string} [name] Sound's name
   *
   * @returns {void}
   */
  resume(name) {
    if (name) {
      withSound(name, (sound) => sound.resume());
    } else {
      PIXI.sound.resumeAll();
    }
  },
  /**
   * Returns whether a sound with the specified name was added to the game.
   * This doesn't tell whether it is fully loaded or not, it only checks
   * for existance of sound's metadata in your game.
   *
   * @param {string} name Sound's name
   *
   * @returns {boolean}
   */
  exists(name) {
    return name in soundMap || name in pixiSoundInstances;
  },
  /**
   * Returns whether a sound is currently playing if a name is specified,
   * otherwise if any sound is currently playing.
   *
   * @param {string} [name] Sound's name
   *
   * @returns {boolean} `true` if the sound is playing, `false` otherwise.
   */
  playing(name) {
    if (!name) {
      return PIXI.sound.isPlaying();
    }
    if (name in pixiSoundInstances) {
      return pixiSoundInstances[name].isPlaying;
    } else if (name in soundMap) {
      for (const variant of soundMap[name].variants) {
        if (pixiSoundInstances[`${pixiSoundPrefix}${variant.uid}`].isPlaying) {
          return true;
        }
      }
    } else {
      throw new Error(`[sounds] Sound "${name}" was not found. Is it a typo?`);
    }
    return false;
  },
  /**
   * Get or set the volume for a sound.
   *
   * @param {string|IMediaInstance} name Sound's name or instance
   * @param {number} [volume] The new volume where 1 is 100%.
   * If empty, will return the existing volume.
   *
   * @returns {number} The current volume of the sound.
   */
  volume(name, volume) {
    if (volume !== void 0) {
      if (typeof name === "string") {
        withSound(name, (sound) => {
          sound.volume = volume;
        });
      } else {
        name.volume = volume;
      }
    }
    if (typeof name === "string") {
      return withSound(name, (sound) => sound.volume);
    }
    return name.volume;
  },
  /**
   * Set the global volume for all sounds.
   * @param {number} value The new volume where 1 is 100%.
   *
   */
  globalVolume(value) {
    PIXI.sound.volumeAll = value;
  },
  /**
   * Fades a sound to a given volume. Can affect either a specific instance or the whole group.
   *
   * @param [name] Sound's name or instance to affect. If null, all sounds are faded.
   * @param [newVolume] The new volume where 1 is 100%. Default is 0.
   * @param [duration] The duration of transition, in milliseconds. Default is 1000.
   */
  fade(name, newVolume = 0, duration = 1e3) {
    const start = {
      time: performance.now(),
      value: null
    };
    if (name) {
      start.value = soundsLib.volume(name);
    } else {
      start.value = PIXI.sound.context.volume;
    }
    const updateVolume = (currentTime) => {
      const elapsed = currentTime - start.time;
      const progress = Math.min(elapsed / duration, 1);
      const value = start.value + (newVolume - start.value) * progress;
      if (name) {
        soundsLib.volume(name, value);
      } else {
        soundsLib.globalVolume(value);
      }
      if (progress < 1) {
        requestAnimationFrame(updateVolume);
      }
    };
    requestAnimationFrame(updateVolume);
  },
  /**
   * Adds a filter to the specified sound and remembers its constructor name.
   * This method is not intended to be called directly.
   *
   * @param sound If set to false, applies the filter globally.
   * If set to a string, applies the filter to the specified sound asset.
   * If set to a media instance or PIXI.Sound instance, applies the filter to it.
   */
  addFilter(sound, filter, filterName) {
    const fx = filter;
    fx.preserved = filterName;
    if (sound === false) {
      PIXI.sound.filtersAll = [...PIXI.sound.filtersAll || [], fx];
    } else if (typeof sound === "string") {
      withSound(sound, (soundInst) => {
        soundInst.filters = [...soundInst.filters || [], fx];
      });
    } else if (sound) {
      sound.filters = [...sound.filters || [], fx];
    } else {
      throw new Error(`[sounds.addFilter] Invalid sound: ${sound}`);
    }
  },
  /**
   * Adds a distortion filter.
   *
   * @param sound If set to false, applies the filter globally.
   * If set to a string, applies the filter to the specified sound asset.
   * If set to a media instance or PIXI.Sound instance, applies the filter to it.
   * @param {number} amount The amount of distortion to set from 0 to 1. Default is 0.
   */
  addDistortion(sound, amount) {
    const fx = new PIXI.sound.filters.DistortionFilter(amount);
    soundsLib.addFilter(sound, fx, "DistortionFilter");
    return fx;
  },
  /**
   * Adds an equalizer filter.
   *
   * @param sound If set to false, applies the filter globally.
   * If set to a string, applies the filter to the specified sound asset.
   * If set to a media instance or PIXI.Sound instance, applies the filter to it.
   * @param {number} f32 Default gain for 32 Hz. Default is 0.
   * @param {number} f64 Default gain for 64 Hz. Default is 0.
   * @param {number} f125 Default gain for 125 Hz. Default is 0.
   * @param {number} f250 Default gain for 250 Hz. Default is 0.
   * @param {number} f500 Default gain for 500 Hz. Default is 0.
   * @param {number} f1k Default gain for 1000 Hz. Default is 0.
   * @param {number} f2k Default gain for 2000 Hz. Default is 0.
   * @param {number} f4k Default gain for 4000 Hz. Default is 0.
   * @param {number} f8k Default gain for 8000 Hz. Default is 0.
   * @param {number} f16k Default gain for 16000 Hz. Default is 0.
   */
  // eslint-disable-next-line max-params
  addEqualizer(sound, f32, f64, f125, f250, f500, f1k, f2k, f4k, f8k, f16k) {
    const fx = new PIXI.sound.filters.EqualizerFilter(f32, f64, f125, f250, f500, f1k, f2k, f4k, f8k, f16k);
    soundsLib.addFilter(sound, fx, "EqualizerFilter");
    return fx;
  },
  /**
   * Combine all channels into mono channel.
   *
   * @param sound If set to false, applies the filter globally.
   * If set to a string, applies the filter to the specified sound asset.
   * If set to a media instance or PIXI.Sound instance, applies the filter to it.
   */
  addMonoFilter(sound) {
    const fx = new PIXI.sound.filters.MonoFilter();
    soundsLib.addFilter(sound, fx, "MonoFilter");
    return fx;
  },
  /**
   * Adds a reverb filter.
   *
   * @param sound If set to false, applies the filter globally.
   * If set to a string, applies the filter to the specified sound asset.
   * If set to a media instance or PIXI.Sound instance, applies the filter to it.
   * @param {number} seconds Seconds for reverb. Default is 3.
   * @param {number} decay The decay length. Default is 2.
   * @param {boolean} reverse Reverse reverb. Default is false.
   */
  addReverb(sound, seconds, decay, reverse) {
    const fx = new PIXI.sound.filters.ReverbFilter(seconds, decay, reverse);
    soundsLib.addFilter(sound, fx, "ReverbFilter");
    return fx;
  },
  /**
   * Adds a filter for stereo panning.
   *
   * @param sound If set to false, applies the filter globally.
   * If set to a string, applies the filter to the specified sound asset.
   * If set to a media instance or PIXI.Sound instance, applies the filter to it.
   * @param {number} pan The amount of panning: -1 is left, 1 is right. Default is 0 (centered).
   */
  addStereoFilter(sound, pan) {
    const fx = new PIXI.sound.filters.StereoFilter(pan);
    soundsLib.addFilter(sound, fx, "StereoFilter");
    return fx;
  },
  /**
   * Adds a 3D sound filter.
   * This filter can only be applied to sound instances.
   *
   * @param sound The sound to apply effect to.
   * @param position Any object with x and y properties — for example, copies.
   */
  addPannerFilter(sound, position, refDistance, rolloffFactor) {
    const fx = new PannerFilter(refDistance, rolloffFactor);
    soundsLib.addFilter(sound, fx, "PannerFilter");
    pannedSounds.set(position, fx);
    sound.on("end", () => {
      pannedSounds.delete(position);
    });
    return fx;
  },
  /**
   * Adds a telephone-sound filter.
   *
   * @param sound If set to false, applies the filter globally.
   * If set to a string, applies the filter to the specified sound asset.
   * If set to a media instance or PIXI.Sound instance, applies the filter to it.
   */
  addTelephone(sound) {
    const fx = new PIXI.sound.filters.TelephoneFilter();
    soundsLib.addFilter(sound, fx, "TelephoneFilter");
    return fx;
  },
  /**
   * Remove a filter to the specified sound.
   *
   * @param {string} [name] The sound to affect. Can be a name of the sound asset
   * or the specific sound instance you get from running `sounds.play`.
   * If set to false, it affects all sounds.
   * @param {string} [filter] The name of the filter. If omitted, all the filters are removed.
   *
   * @returns {void}
   */
  removeFilter(name, filter) {
    const setFilters = (newFilters) => {
      if (typeof name === "string") {
        withSound(name, (soundInst) => {
          soundInst.filters = newFilters;
        });
      } else {
        name.filters = newFilters;
      }
    };
    if (!name && !filter) {
      PIXI.sound.filtersAll = [];
      return;
    }
    if (name && !filter) {
      setFilters([]);
      return;
    }
    let filters;
    if (!name) {
      filters = PIXI.sound.filtersAll;
    } else {
      filters = typeof name === "string" ? withSound(name, (soundInst) => soundInst.filters) : name.filters;
    }
    if (filter && !filter.includes("Filter")) {
      filter += "Filter";
    }
    const copy = [...filters];
    filters.forEach((f, i) => {
      if (f.preserved === filter) {
        copy.splice(i, 1);
      }
    });
    if (!name) {
      PIXI.sound.filtersAll = copy;
    } else {
      setFilters(copy);
    }
  },
  /**
   * Set the speed (playback rate) of a sound.
   *
   * @param {string|IMediaInstance} name Sound's name or instance
   * @param {number} [value] The new speed, where 1 is 100%.
   * If empty, will return the existing speed value.
   *
   * @returns {number} The current speed of the sound.
   */
  speed(name, value) {
    if (value) {
      if (typeof name === "string") {
        withSound(name, (sound) => {
          sound.speed = value;
        });
      } else {
        name.speed = value;
      }
      return value;
    }
    if (typeof name === "string") {
      if (name in soundMap) {
        return pixiSoundInstances[soundMap[name].variants[0].uid].speed;
      }
      if (name in pixiSoundInstances) {
        return pixiSoundInstances[name].speed;
      }
      throw new Error(`[sounds.speed] Invalid sound name: ${name}. Is it a typo?`);
    }
    return name.speed;
  },
  /**
   * Set the global speed (playback rate) for all sounds.
   * @param {number} value The new speed, where 1 is 100%.
   *
   */
  speedAll(value) {
    PIXI.sound.speedAll = value;
  },
  /**
  * Toggle muted property for all sounds.
  * @returns {boolean} `true` if all sounds are muted.
  */
  toggleMuteAll() {
    return PIXI.sound.toggleMuteAll();
  },
  /**
  * Toggle paused property for all sounds.
  * @returns {boolean} `true` if all sounds are paused.
  */
  togglePauseAll() {
    return PIXI.sound.togglePauseAll();
  }
};
var sounds_default = soundsLib;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  exportedSounds,
  pannedSounds,
  pixiSoundInstances,
  pixiSoundPrefix,
  playRandomVariant,
  playVariant,
  playWithoutEffects,
  soundMap,
  soundsLib
});
