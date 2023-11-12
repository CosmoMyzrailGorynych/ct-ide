import * as pixi from 'node_modules/pixi.js';
import * as particles from 'node_modules/@pixi/particle-emitter';
// import * as sounds from 'node_modules/@pixi/sound';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const PIXI = pixi;
(PIXI as any).particles = particles;
// (PIXI as any).sounds = sounds
(window as any).PIXI = PIXI;
