import * as pixi from 'node_modules/pixi.js';
import * as particles from 'node_modules/pixi-particles';

export const PIXI = pixi;
(PIXI as any).particles = particles;

(window as any).PIXI = PIXI;
