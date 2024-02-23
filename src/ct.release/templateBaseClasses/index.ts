import PixiButton from './PixiButton';
import PixiSpritedCounter from './PixiSpritedCounter';
import PixiScrollingTexture from './PixiScrollingTexture';
import PixiTextBox from './PixiTextBox';
// import PixiScrollBox from './PixiScrollBox';
import PixiPanel from './PixiNineSlicePlane';
import PixiText from './PixiText';
import PixiContainer from './PixiContainer';
import PixiAnimatedSprite from './PixiAnimatedSprite';

import {ICopy} from '../templates';

import type * as pixiMod from 'node_modules/pixi.js';
import {BaseClass} from '../../node_requires/exporter/_exporterContracts';

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor<T> = Function & { prototype: T };
export const baseClassToPixiClass: Record<BaseClass, Constructor<pixiMod.DisplayObject>> = {
    AnimatedSprite: PixiAnimatedSprite,
    Button: PixiButton,
    Container: PixiContainer,
    NineSlicePlane: PixiPanel,
    RepeatingTexture: PixiScrollingTexture,
    // ScrollBox: PixiScrollBox,
    SpritedCounter: PixiSpritedCounter,
    Text: PixiText,
    TextBox: PixiTextBox
};

// Record<string, any> allows ct.js users to write any properties to their copies
// without typescript complaining.
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * An instance of a ct.js template with Animated Sprite as its base class.
 * It has functionality of both PIXI.AnimatedSprite and ct.js Copies.
 */
export type CopyAnimatedSprite = Record<string, any> & pixiMod.AnimatedSprite & ICopy;
/**
 * An instance of a ct.js template with Panel as its base class.
 * It has functionality of both PIXI.NineSlicePlane and ct.js Copies.
 */
export type CopyPanel = Record<string, any> & PixiPanel & ICopy;
/**
 * An instance of a ct.js template with Text as its base class.
 * It has functionality of both PIXI.Text and ct.js Copies.
 */
export type CopyText = Record<string, any> & PixiText & ICopy;
/**
 * An instance of a ct.js template with Container as its base class.
 * It has functionality of both PIXI.Container and ct.js Copies, and though by itself it doesn't
 * display anything, you can add other copies and pixi.js classes with `this.addChild(copy)`.
 */
export type CopyContainer = Record<string, any> & PixiContainer & ICopy;
/**
 * An instance of a ct.js template with button logic.
 * It has functionality of both PIXI.Container and ct.js Copies.
 */
export type CopyButton = Record<string, any> & PixiButton & ICopy;
/**
 * An instance of a ct.js template with text box logic.
 * It has functionality of both PIXI.Container and ct.js Copies.
 */
export type CopyTextBox = Record<string, any> & PixiTextBox & ICopy;
/**
 * An instance of a ct.js template with repeating texture logic.
 * The texture can expand in any direction and can be animated by scrolling.
 */
export type CopyRepeatingTexture = Record<string, any> & PixiScrollingTexture & ICopy;
/**
 * An instance of a ct.js template with a sprited counter logic.
 * This copy displays a number of identical sprites in a row, similar to sprited healthbars.
 */
export type CopySpritedCounter = Record<string, any> & PixiSpritedCounter & ICopy;
/**
 * An instance of a ct.js template with Container as its base class.
 * It has functionality of both PIXI.Container and ct.js Copies, and implements a scrollbox that
 * has a scrollbar and clips its contents.
 */
// export type CopyScrollBox = Record<string, any> & PixiScrollBox & ICopy;
/* eslint-enable @typescript-eslint/no-explicit-any */
