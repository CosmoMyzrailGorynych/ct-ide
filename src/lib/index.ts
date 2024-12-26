import * as PIXI from 'pixi.js';
import {sound, filters} from '@pixi/sound';
import * as particles from '@pixi/particle-emitter';
import riot from 'riot';
import hotkeys from './hotkeys';

window.PIXI = PIXI;
window.PIXI.sound = sound;
window.riot = riot;
window.signals = window.signals || riot.observable({});
window.orders = window.orders || riot.observable({});
window.PIXI.sound.filters = filters;
window.PIXI.particles = particles;
window.hotkeys = hotkeys(document);

// Exposes window.alertify
import './alertify';
// Runs buntralino client
import 'buntralino-client';
// Register Riot tags
import '../../temp/riotTags';
