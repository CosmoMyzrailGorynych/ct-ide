import * as pixi from 'node_modules/pixi.js';
import * as particles from 'node_modules/@pixi/particle-emitter';
import {sound as pixiSound, filters as pixiSoundFilters} from 'node_modules/@pixi/sound';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const PIXI = pixi;
(PIXI as any).particles = particles;
// TODO: remove this band-aid when https://github.com/pixijs/pixijs/issues/9495 closes
PIXI.particles.Particle.prototype.isInteractive = () => false;
(PIXI as any).sound = pixiSound;
(PIXI as any).sound.filters = pixiSoundFilters;
// (PIXI as any).sounds = sounds
(window as any).PIXI = PIXI;
