declare namespace PIXI.filters {
  class AdjustmentFilter extends PIXI.Filter {
    constructor(options?: AdjustmentOptions);
    /**
     * The amount of luminance (default: 1)
     */
    gamma?: number;

    /**
     * The amount of color saturation (default: 1)
     */
    saturation?: number;

    /**
     * The amount of contrast (default: 1)
     */
    contrast?: number;

    /**
     * The overall brightness (default: 1)
     */
    brightness?: number;

    /**
     * The multipled red channel (default: 1)
     */
    red?: number;

    /**
     * The multipled green channel (default: 1)
     */
    green?: number;

    /**
     * The multipled blue channel (default: 1)
     */
    blue?: number;

    /**
     * The overall alpha amount (default: 1)
     */
    alpha?: number;
  }
  interface AdjustmentOptions {
    gamma?: number;
    contrast?: number;
    saturation?: number;
    brightness?: number;
    red?: number;
    green?: number;
    blue?: number;
    alpha?: number;
  }

  class AdvancedBloomFilter extends PIXI.Filter {
    constructor(options?: AdvancedBloomOptions);
    constructor(threshold?: number);

    /**
     * Defines how bright a color needs to be to affect bloom (default 0.5).
     */
    threshold: number;

    /**
     * To adjust the strength of the bloom. Higher values is more intense brightness (default 1.0).
     */
    bloomScale: number;

    /**
     * The brightness, lower value is more subtle brightness, higher value is blown-out (default 1.0).
     */
    brightness: number;

    /**
     * Sets the kernels of the Blur Filter (default null).
     */
    kernels: number[];

    /**
     * Sets the strength of the Blur properties simultaneously (default 8).
     */
    blur: number;

    /**
     * Sets the quality of the Blur Filter (default 4).
     */
    quality: number;

    /**
     * Sets the pixelSize of the Kawase Blur filter (default 1).
     */
    pixelSize: number | PIXI.Point | number[];

    /**
     * The resolution of the filter. (default PIXI.settings.FILTER_RESOLUTION)
     */
    resolution: number;
  }
  interface AdvancedBloomOptions {
    threshold?: number;
    bloomScale?: number;
    brightness?: number;
    kernels?: number[];
    blur?: number;
    quality?: number;
    pixelSize?: number | PIXI.Point | number[];
    resolution?: number;
  }

  class AsciiFilter extends PIXI.Filter {
    constructor(size?: number);
    /**
     * The pixel size used by the filter (default 8).
     */
    size: number;
  }

  class BevelFilter extends PIXI.Filter {
    constructor(options?: BevelOptions);
    /**
     * The angle of the light in degrees (default 45).
     */
    rotation: number;

    /**
     * The tickness of the bevel (default 2).
     */
    thickness: number;

    /**
     * Color of the light (default 0xffffff).
     */
    lightColor: number;

    /**
     * Alpha of the light (default 0.7).
     */
    lightAlpha: number;

    /**
     * Color of the shadow (default 0x000000).
     */
    shadowColor: number;

    /**
     * Alpha of the shadow (default 0.7).
     */
    shadowAlpha: number;
  }
  interface BevelOptions {
    rotation: number;
    thickness: number;
    lightColor: number;
    lightAlpha: number;
    shadowColor: number;
    shadowAlpha: number;
  }

  class BloomFilter extends PIXI.Filter {
    constructor(options?: BloomOptions);
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously (default 2).
     */
    blur?: number | PIXI.Point | number[];

    /**
     * The quality of the blurX & blurY filter (default 4).
     */
    quality?: number;

    /**
     * The resolution of the blurX & blurY filter (default PIXI.settings.RESOLUTION).
     */
    resolution?: number;

    /**
     * The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15. (default 5).
     */
    kernelSize?: number;
  }
  interface BloomOptions {
    blur: number | PIXI.Point | number[];
    quality: number;
    resolution: number;
    kernelSize: number;
  }

  class BulgePinchFilter extends PIXI.Filter {
    constructor(options?: BulgePinchFilterOptions);
    /**
     * The x and y coordinates of the center of the circle of effect (default [0,0]).
     */
    center?: PIXI.Point | [number, number];

    /**
     * The radius of the circle of effect (default: 100).
     */
    radius?: number;

    /**
     * The strength of the effect. -1 to 1: -1 is strong pinch, 0 is no effect, 1 is strong bulge (default: 1).
     */
    strength?: number;
  }
  interface BulgePinchFilterOptions {
    center?: PIXI.Point | [number, number];
    radius?: number;
    strength?: number;
  }

  class ColorMapFilter extends PIXI.Filter {
    constructor(
      colorMap?:
        | HTMLImageElement
        | HTMLCanvasElement
        | PIXI.BaseTexture
        | PIXI.Texture,
      nearest?: boolean,
      mix?: number,
      readonly colorSize: number
    );
    /**
     * The colorMap texture of the filter.
     */
    colorMap:
      | HTMLImageElement
      | HTMLCanvasElement
      | PIXI.BaseTexture
      | PIXI.Texture;

    /**
     * Whether use NEAREST for colorMap texture (default false).
     */
    nearest: boolean;

    /**
     * The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image (default 1).
     */
    mix: number;

    /**
     * The size of one color slice (readonly).
     */
    readonly colorSize: number;
  }

  class ColorOverlayFilter extends PIXI.Filter {
    constructor(color?: number | [number, number, number]);

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0] (default 0x000000).
     */
    color: number | [number, number, number];
  }

  class ColorReplaceFilter extends PIXI.Filter {
    constructor(
      originalColor?: number | number[],
      newColor?: number | number[],
      epsilon?: number
    );
    /**
     * The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0] (default 0xFF0000).
     */
    originalColor: number | number[];

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0] (default 0x000000).
     */
    newColor: number | number[];

    /**
     * Tolerance/sensitivity of the floating-point comparison between colors: lower = more exact, higher = more inclusive (default 0.4).
     */
    epsilon: number;
  }

  class ConvolutionFilter extends PIXI.Filter {
    constructor(matrix?: number[], width?: number, height?: number);
    /**
     * An array of values used for matrix transformation. Specified as a 9 point Array (default [0,0,0,0,0,0,0,0,0]).
     */
    matrix?: number[];

    /**
     * Width of the object you are transforming (default 200).
     */
    width?: number;

    /**
     * Height of the object you are transforming (default 200).
     */
    height?: number;
  }

  class CrossHatchFilter extends PIXI.Filter {
    constructor();
  }

  class CRTFilter extends PIXI.Filter {
    constructor(options?: CRTFilterOptions);
    /**
     * Bent of interlaced lines, higher value means more bend (default 1).
     */
    curvature: number;

    /**
     * Width of interlaced lines (default 1).
     */
    lineWidth: number;

    /**
     * Contrast of interlaced lines (default 0.25).
     */
    lineContrast: number;

    /**
     * `true` for vertical lines, `false` for horizontal lines (default false).
     */
    verticalLine: boolean;

    /**
     * Opacity/intensity of the noise effect between `0` and `1` (default 0.3).
     */
    noise: number;

    /**
     * The size of the noise particles (default 1.0).
     */
    noiseSize: number;

    /**
     * A seed value to apply to the random noise generation (default 0).
     */
    seed: number;

    /**
     * The radius of the vignette effect, smaller values produces a smaller vignette (default 0.3).
     */
    vignetting: number;

    /**
     * Amount of opacity of vignette (default 1.0).
     */
    vignettingAlpha: number;

    /**
     * Blur intensity of the vignette (default 0.3).
     */
    vignettingBlur: number;

    /**
     * For animating interlaced lines (default 0).
     */
    time: number;
  }
  interface CRTFilterOptions {
    curvature?: number;
    lineWidth?: number;
    lineContrast?: number;
    verticalLine?: boolean;
    noise?: number;
    noiseSize?: number;
    seed?: number;
    vignetting?: number;
    vignettingAlpha?: number;
    vignettingBlur?: number;
    time?: number;
  }

  class DotFilter extends PIXI.Filter {
    constructor(scale?: number, angle?: number);
    /**
     * The scale of the effect (default 1).
     */
    scale: number;

    /**
     * The radius of the effect (default 5).
     */
    angle: number;
  }

  class DropShadowFilter extends PIXI.Filter {
    constructor(options?: DropShadowFilterOptions);
    /**
     * The alpha of the shadow (default 0.5).
     */
    alpha: number;

    /**
     * The blur of the shadow (default 2).
     */
    blur: number;

    /**
     * The color of the shadow (default 0x000000).
     */
    color: number;

    /**
     * Distance offset of the shadow (default 5).
     */
    distance: number;

    /**
     * Sets the kernels of the Blur Filter (default null).
     */
    kernels: number[];

    /**
     * Sets the pixelSize of the Kawase Blur filter (default 1).
     */
    pixelSize: number | number[] | PIXI.Point;

    /**
     * Sets the quality of the Blur Filter (default 3).
     */
    quality: number;

    /**
     * The resolution of the filter (default PIXI.settings.RESOLUTION).
     */
    resolution: number;

    /**
     * The angle of the shadow in degrees (default 45).
     */
    rotation: number;

    /**
     * Whether render shadow only (default false).
     */
    shadowOnly: boolean;
  }
  interface DropShadowFilterOptions {
    alpha?: number;
    blur?: number;
    color?: number;
    distance?: number;
    kernels?: number[];
    pixelSize?: number | number[] | PIXI.Point;
    quality?: number;
    resolution?: number;
    rotation?: number;
    shadowOnly?: boolean;
  }

  class EmbossFilter extends PIXI.Filter {
    constructor(strength?: number);
    /**
     * Strength of emboss (default 5).
     */
    strength: number;
  }

  class GlitchFilter extends PIXI.Filter {
    constructor(options?: GlitchFilterOptions);

    /**
     * The maximum number of slices (default 5).
     */
    slices: number;

    /**
     * The maximum offset value for each of the slices (default 100).
     */
    offset: number;

    /**
     * The angle in degree of the offset of slices (default 0).
     */
    direction: number;

    /**
     * The fill mode of the space after the offset (default 0).
     * Acceptable values:
     *  0 TRANSPARENT
     *  1 ORIGINAL
     *  2 LOOP
     *  3 CLAMP
     *  4 MIRROR
     */
    fillMode: number;

    /**
     * `true` will divide the bands roughly based on equal amounts
     * where as setting to `false` will vary the band sizes dramatically (more random looking).
     * (default false)
     */
    average: boolean;

    /**
     * A seed value for randomizing color offset. Animating
     * this value to `Math.random()` produces a twitching effect.
     * (default 0)
     */
    seed: number;

    /**
     * Red channel offset (default [0,0]).
     */
    red: PIXI.Point;

    /**
     * Green channel offset (default [0,0]).
     */
    green: PIXI.Point;

    /**
     * Blue channel offset (default [0,0]).
     */
    blue: PIXI.Point;

    /**
     * Minimum size of slices as a portion of the `sampleSize` (default 8).
     */
    minSize: number;

    /**
     * Height of the displacement map canvas (default 512).
     */
    sampleSize: number;

    /**
     * Regenerating random size, offsets for slices.
     */
    refresh(): void;

    /**
     * Shuffle the sizes of the slices, advanced usage.
     */
    shuffle(): void;

    /**
     * Redraw displacement bitmap texture, advanced usage.
     */
    redraw(): void;

    /**
     * The displacement map is used to generate the bands.
     * If using your own texture, `slices` will be ignored.
     */
    readonly texture: PIXI.Texture;
  }
  interface GlitchFilterOptions {
    slices: number;
    offset: number;
    direction: number;
    fillMode: number;
    average: boolean;
    seed: number;
    red: PIXI.Point;
    green: PIXI.Point;
    blue: PIXI.Point;
    minSize: number;
    sampleSize: number;
  }

  class GlowFilter extends PIXI.Filter {
    constructor(options?: GlowFilterOptions);
    /**
     * The color of the glow (default 0xFFFFFF).
     */
    color: number;

    /**
     * The distance of the glow. Make it 2 times more for resolution=2.
     * It can't be changed after filter creation.
     * (default 10)
     */
    distance: number;

    /**
     * The strength of the glow inward from the edge of the sprite (default 0).
     */
    innerStrength: number;

    /**
     * The strength of the glow outward from the edge of the sprite (default 4).
     */
    outerStrength: number;

    /**
     * A number between 0 and 1 that describes the quality of the glow.
     * The higher the number the less performant.
     * (default 0.1)
     */
    quality: number;

    /**
     * Only draw the glow, not the texture itself (default false).
     */
    knockout: boolean;
  }
  interface GlowFilterOptions {
    color?: number;
    distance?: number;
    innerStrength?: number;
    outerStrength?: number;
    quality?: number;
    knockout?: boolean;
  }

  class GodrayFilter extends PIXI.Filter {
    constructor(options?: GodrayFilterOptions);
    /**
     * The angle/light-source of the rays in degrees. For instance, a value of 0 is vertical rays,
     * values of 90 or -90 produce horizontal rays (default 30).
     */
    angle: number;

    /**
     * The position of the emitting point for light rays
     * only used if `parallel` is set to `false` (default [0, 0]).
     */
    center: PIXI.Point | Array<number>;

    /**
     * `true` if light rays are parallel (uses angle),
     * `false` to use the focal `center` point.
     * (default true)
     */
    parallel: boolean;

    /**
     * General intensity of the effect. A value closer to 1 will produce a more intense effect,
     * where a value closer to 0 will produce a subtler effect (default 0.5).
     */
    gain: number;

    /**
     * The density of the fractal noise. A higher amount produces more rays and a smaller amount
     * produces fewer waves (default 2.5).
     */
    lacunarity: number;

    /**
     * The current time position (default 0).
     */
    time: number;
  }
  interface GodrayFilterOptions {
    angle: number;
    center: PIXI.Point | Array<number>;
    parallel: boolean;
    gain: number;
    lacunarity: number;
    time: number;
  }

  class KawaseBlurFilter extends PIXI.Filter {
    constructor(blur?: number | number[], quality?: number, clamp?: boolean);

    /**
     * The blur of the filter. Should be greater than `0`.
     * If value is an Array, setting kernels. (default 4).
     */
    blur: number;

    /**
     * The quality of the filter. Should be an integer greater than `1`. (default 3).
     */
    quality: number;

    /**
     * Clamp edges, useful for removing dark edges from fullscreen filters
     * or bleeding to the edge of filterArea. (default false).
     */
    clamp: boolean;
  }

  class MotionBlurFilter extends PIXI.Filter {
    constructor(
      velocity?: PIXI.ObservablePoint | PIXI.Point | number[],
      kernelSize?: number,
      offset?: number
    );
    /**
     * Sets the velocity (x and y) of the motion for blur effect (default [0,0]).
     */
    velocity: PIXI.ObservablePoint | PIXI.Point | number[];

    /**
     * The kernelSize of the blur, higher values are slower but look better.
     * Use odd value greater than 5 (default 5).
     */
    kernelSize: number;

    /**
     * The offset of the blur filter (default 0).
     */
    offset: number;
  }

  class MultiColorReplaceFilter extends PIXI.Filter {
    constructor(
      replacements: Array<number[] | number[][]>,
      epsilon?: number,
      maxColors?: number
    );
    /**
     * The collection of replacement items. Each item is color-pair (an array length is 2).
     * In the pair, the first value is original color , the second value is target color.
     */
    replacements: Array<number[] | number[][]>;

    /**
     * Tolerance of the floating-point comparison between colors (lower = more exact, higher = more inclusive).
     * (default 0.05)
     */
    epsilon: number;

    /**
     * The maximum number of replacements filter is able to use.
     * Because the fragment is only compiled once, this cannot be changed after construction.
     * If omitted, the default value is the length of `replacements`.
     */
    readonly maxColors: number;

    /**
     * Should be called after changing any of the contents of the replacements.
     * This is a convenience method for resetting the `replacements`.
     */
    refresh(): void;
  }

  class OldFilmFilter extends PIXI.Filter {
    constructor(options?: OldFilmFilterOptions, seed?: number);
    constructor(seed?: number);
    /**
     * The amount of saturation of sepia effect,
     * a value of `1` is more saturation and closer to `0` is less,
     * and a value of `0` produces no sepia effect (default 0.3).
     */
    sepia: number;

    /**
     * Opacity/intensity of the noise effect between `0` and `1` (default 0.3).
     */
    noise: number;

    /**
     * The size of the noise particles (default 1).
     */
    noiseSize: number;

    /**
     * How often scratches appear (default 0.5).
     */
    scratch: number;

    /**
     * The density of the number of scratches (default 0.3).
     */
    scratchDensity: number;

    /**
     * The width of the scratches (default 1.0).
     */
    scratchWidth: number;

    /**
     * The radius of the vignette effect, smaller values produces a smaller vignette (default 0.3).
     */
    vignetting: number;

    /**
     * Amount of opacity of vignette (default 1.0).
     */
    vignettingAlpha: number;

    /**
     * Blur intensity of the vignette (default 0.3).
     */
    vignettingBlur: number;

    /**
     * A seed value to apply to the random noise generation (default 0).
     */
    seed: number;
  }
  interface OldFilmFilterOptions {
    sepia?: number;
    noise?: number;
    noiseSize?: number;
    scratch?: number;
    scratchDensity?: number;
    scratchWidth?: number;
    vignetting?: number;
    vignettingAlpha?: number;
    vignettingBlur?: number;
  }

  class OutlineFilter extends PIXI.Filter {
    constructor(thickness?: number, color?: number);
    /**
     * The color of the outline (default 0x000000).
     */
    color: number;

    /**
     * The tickness of the outline. Make it 2 times more for resolution 2 (default 1).
     */
    thickness: number;

    /**
     * The quality of the outline from `0` to `1`, using a higher quality setting will result in slower performance and more accuracy
     * (default 0.1).
     */
    quality: number;
  }

  class PixelateFilter extends PIXI.Filter {
    constructor(size?: PIXI.Point | number[] | number);
    /**
     * Either the width/height of the size of the pixels, or square size (default 10).
     */
    size: PIXI.Point | number[] | number;
  }

  class RadialBlurFilter extends PIXI.Filter {
    constructor(
      angle?: number,
      center?: number[] | PIXI.Point,
      kernelSize?: number,
      radius?: number
    );
    /**
     * Sets the angle in degrees of the motion for blur effect (default 0).
     */
    angle: number;

    /**
     * Center of the effect (default [0, 0]).
     */
    center: number[] | PIXI.Point;

    /**
     * The kernelSize of the blur filter. But be odd number >= 3 (default 5).
     */
    kernelSize: number;

    /**
     * Outer radius of the effect. The default value of `-1` is infinite (default -1).
     */
    radius: number;
  }

  class ReflectionFilter extends PIXI.Filter {
    constructor(options?: ReflectionFilterOptions);
    /**
     * `true` to reflect the image, `false` for waves-only (default true).
     */
    mirror: boolean;

    /**
     * Vertical position of the reflection point, default is middle.
     * Smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     * (default 0.5)
     */
    boundary: number;

    /**
     * Starting and ending amplitude of waves (default [0, 20]).
     */
    amplitude: number[];

    /**
     * Starting and ending length of waves (default [30, 100]).
     */
    waveLength: number[];

    /**
     * Starting and ending alpha values (default [1, 1]).
     */
    alpha: number[];

    /**
     * Time for animating position of waves (default 0).
     */
    time: number;
  }
  interface ReflectionFilterOptions {
    mirror?: boolean;
    boundary?: number;
    amplitude?: number[];
    waveLength?: number[];
    alpha?: number[];
    time?: number;
  }

  class RGBSplitFilter extends PIXI.Filter {
    constructor(red?: PIXI.Point, green?: PIXI.Point, blue?: PIXI.Point);
    /**
     * Red channel offset (default [-10,0]).
     */
    red: PIXI.Point;

    /**
     * Green channel offset (default [0, 10]).
     */
    green: PIXI.Point;

    /**
     * Blue channel offset (default [0, 0]).
     */
    blue: PIXI.Point;
  }

  class ShockwaveFilter extends PIXI.Filter {
    constructor(
      center?: PIXI.Point | number[],
      options?: ShockwaveFilterOptions,
      time?: number
    );
    /**
     * Sets the center of the shockwave in normalized screen coords.
     * That is (0,0) is the top-left and (1,1) is the bottom right.
     * (default [0.5, 0.5])
     * NB: But in practice, it seems we need "world" coords.
     */
    center: PIXI.Point | number[];

    /**
     * The amplitude of the shockwave (default 0.5).
     */
    amplitude?: number;

    /**
     * The wavelength of the shockwave (default 1.0).
     */
    wavelength?: number;

    /**
     * The brightness of the shockwave (default 8).
     */
    brightness?: number;

    /**
     * The speed about the shockwave ripples out (default 500.0).
     * The unit is `pixel/second`.
     */
    speed?: number;

    /**
     * The maximum radius of shockwave.
     * `< 0.0` means it's infinity.
     * (default 4)
     */
    radius?: number;

    /**
     * Sets the elapsed time of the shockwave.
     * It could control the current size of shockwave.
     * (default 0)
     */
    time: number;
  }
  interface ShockwaveFilterOptions {
    amplitude?: number;
    wavelength?: number;
    brightness?: number;
    speed?: number;
    radius?: number;
  }

  class SimpleLightmapFilter extends PIXI.Filter {
    constructor(texture: PIXI.Texture, color?: number[] | number);

    /**
     * Default alpha set independent of color (if it's a number, not array).
     * When setting `color` as hex, this can be used to set alpha independently.
     * (default 1)
     */
    alpha: number;

    /**
     * An RGBA array of the ambient color or a hex color without alpha (default 0x000000)
     */
    color: number[] | number;

    /**
     * A texture where your lightmap is rendered.
     */
    texture: PIXI.Texture;
  }

  class TiltShiftFilter extends PIXI.Filter {
    constructor(
      blur?: number,
      gradientBlur?: number,
      start?: PIXI.Point,
      end?: PIXI.Point
    );

    /**
     * The strength of the blur (default 100).
     */
    blur: number;

    /**
     * The strength of the gradient blur (default 600).
     */
    gradientBlur: number;

    /**
     * The Y value to start the effect at (default null).
     */
    start: PIXI.Point;

    /**
     * The Y value to end the effect at (default null).
     */
    end: PIXI.Point;
  }

  class TwistFilter extends PIXI.Filter {
    constructor(
      radius?: number,
      angle?: number,
      padding?: number,
      offset?: PIXI.Point | [number, number]
    );

    /**
     * The angle of the twist (default 4).
     */
    angle: number;

    /**
     * The radius of the twist (default 200).
     */
    radius: number;

    /**
     * Padding for filter area (default 20).
     */
    padding: number;

    /**
     * Center of twist, in local, pixel coordinates.
     */
    offset: PIXI.Point | [number, number];
  }

  class ZoomBlurFilter extends PIXI.Filter {
    constructor(options?: ZoomBlurFilterOptions);
    constructor(
      strength?: number,
      center?: PIXI.Point | [number, number],
      innerRadius?: number,
      radius?: number
    );

    /**
     * Strength of the zoom blur effect (default 0.1).
     */
    strength: number;

    /**
     * Center of the effect (default [0, 0]).
     */
    center: PIXI.Point | [number, number];

    /**
     * The inner radius of zoom. The part in inner circle won't apply zoom blur effect
     * (default 0).
     */
    innerRadius: number;

    /**
     * Outer radius of the effect.
     * The default value is `-1`.
     * `< 0.0` means it's infinity.
     */
    radius: number;
  }
  interface ZoomBlurFilterOptions {
    strength?: number;
    center?: PIXI.Point | [number, number];
    innerRadius?: number;
    radius?: number;
  }
}

declare namespace ct {
  /** A collection of shader filters for ct.js */
  namespace filters {
    /**
     * The ability to adjust gamma, contrast, saturation, brightness, alpha or color-channel shift. This is a faster and much simpler to use than ColorMatrixFilter because it does not use a matrix.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.AdjustmentFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addAdjustment(
      target: PIXI.DisplayObject
    ): PIXI.filters.AdjustmentFilter;

    /**
     * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter this had some advanced controls for adjusting the look of the bloom. Note: this filter is slower than normal BloomFilter.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.AdvancedBloomFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addAdvancedBloom(
      target: PIXI.DisplayObject
    ): PIXI.filters.AdvancedBloomFilter;

    /**
     * Turns everything in ASCII text.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.AsciiFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addAscii(target: PIXI.DisplayObject): PIXI.filters.AsciiFilter;

    /**
     * Peforms an edge-beveling effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.BevelFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addBevel(target: PIXI.DisplayObject): PIXI.filters.BevelFilter;

    /**
     * The BloomFilter applies a Gaussian blur to an object. The strength of the blur can be set for x- and y-axis separately.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.BloomFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addBloom(target: PIXI.DisplayObject): PIXI.filters.BloomFilter;

    /**
     * Bulges or pinches the image in a circle.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.BulgePinchFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addBulgePinch(
      target: PIXI.DisplayObject
    ): PIXI.filters.BulgePinchFilter;

    /**
     * The ColorMapFilter applies a color-map effect to an object.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @param {HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture} colorMap - The colorMap texture of the filter.
     * @return {PIXI.filters.ColorMapFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addColorMap(
      target: PIXI.DisplayObject,
      colorMap: HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture,
    ): PIXI.filters.ColorMapFilter;

    /**
     * Replace all colors within a source graphic with a single color.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.ColorOverlayFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addColorOverlay(
      target: PIXI.DisplayObject
    ): PIXI.filters.ColorOverlayFilter;

    /**
     * ColorReplaceFilter, originally by mishaa, updated by timetocode http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.ColorReplaceFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addColorReplace(
      target: PIXI.DisplayObject
    ): PIXI.filters.ColorReplaceFilter;

    /**
     * The ConvolutionFilter class applies a matrix convolution filter effect. A convolution combines pixels in the input image with neighboring pixels to produce a new image. A wide variety of image effects can be achieved through convolutions, including blurring, edge detection, sharpening, embossing, and beveling. The matrix should be specified as a 9 point Array. See http://docs.gimp.org/en/plug-in-convmatrix.html for more info.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.ConvolutionFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addConvolution(
      target: PIXI.DisplayObject
    ): PIXI.filters.ConvolutionFilter;

    /**
     * A black and white cross-hatch effect filter.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.CrossHatchFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addCrossHatch(
      target: PIXI.DisplayObject
    ): PIXI.filters.CrossHatchFilter;

    /**
     * Apply an effect resembling old CRT monitors.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.CRTFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addCRT(target: PIXI.DisplayObject): PIXI.filters.CRTFilter;

    /**
     * This filter applies a dotscreen effect making display objects appear to be made out of black and white halftone dots like an old printer.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.DotFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addDot(target: PIXI.DisplayObject): PIXI.filters.DotFilter;

    /**
     * Apply a drop shadow effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.DropShadowFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addDropShadow(
      target: PIXI.DisplayObject
    ): PIXI.filters.DropShadowFilter;

    /**
     * Apply an emboss effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.EmbossFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addEmboss(target: PIXI.DisplayObject): PIXI.filters.EmbossFilter;

    /**
     * Apply a glitch effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.GlitchFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addGlitch(target: PIXI.DisplayObject): PIXI.filters.GlitchFilter;

    /**
     * GlowFilter, originally by mishaa codepen.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.GlowFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addGlow(target: PIXI.DisplayObject): PIXI.filters.GlowFilter;

    /**
     * Apply and animate atmospheric light rays. Originally by Alain Galvan https://codepen.io/alaingalvan
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.GodrayFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addGodray(target: PIXI.DisplayObject): PIXI.filters.GodrayFilter;

    /**
     * A much faster blur than Gaussian blur, but more complicated to use. https://software.intel.com/content/www/us/en/develop/blogs/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms.html
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.KawaseBlurFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addKawaseBlur(
      target: PIXI.DisplayObject
    ): PIXI.filters.KawaseBlurFilter;

    /**
     * Apply a directional blur effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.MotionBlurFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addMotionBlur(
      target: PIXI.DisplayObject
    ): PIXI.filters.MotionBlurFilter;

    /**
     * Filter for replacing a color with another color. Similar to ColorReplaceFilter, but support multiple colors.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @param {Array<number[] | number[][]>} replacements - The collection of replacement items. Each item is color-pair (an array length is 2). In the pair, the first value is original color, the second value is target color.
     * @param {Array<number[] | number[][]>} epsilon - Tolerance of the floating-point comparison between colors. Lower = more exact, higher = more inclusive (default 0.05).
     * @return {PIXI.filters.MultiColorReplaceFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addMultiColorReplace(
      target: PIXI.DisplayObject,
      replacements: Array<number[] | number[][]>,
      epsilon: number
    ): PIXI.filters.MultiColorReplaceFilter;

    /**
     * Apply an old film effect with grain and scratches.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.OldFilmFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addOldFilm(target: PIXI.DisplayObject): PIXI.filters.OldFilmFilter;

    /**
     * Apply an outline/stroke effect. Originally by mishaa http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966 http://codepen.io/mishaa/pen/emGNRB
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.OutlineFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addOutline(target: PIXI.DisplayObject): PIXI.filters.OutlineFilter;

    /**
     * Apply a pixelation effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.PixelateFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addPixelate(
      target: PIXI.DisplayObject
    ): PIXI.filters.PixelateFilter;

    /**
     * Apply a radial blur effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.RadialBlurFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addRadialBlur(
      target: PIXI.DisplayObject
    ): PIXI.filters.RadialBlurFilter;

    /**
     * Apply a reflection effect to simulate the reflection on water with waves.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.ReflectionFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addReflection(
      target: PIXI.DisplayObject
    ): PIXI.filters.ReflectionFilter;

    /**
     * Filter to split and shift red, green or blue channels.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.RGBSplitFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addRGBSplit(
      target: PIXI.DisplayObject
    ): PIXI.filters.RGBSplitFilter;

    /**
     * Apply a shockwave-type effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.ShockwaveFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addShockwave(
      target: PIXI.DisplayObject
    ): PIXI.filters.ShockwaveFilter;

    /**
     * SimpleLightmap, originally by Oza94 http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/ http://codepen.io/Oza94/pen/EPoRxj
     * You have to specify filterArea, or suffer consequences. You may have to use it with filter.dontFit = true, until we rewrite this using same approach as for DisplacementFilter.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.SimpleLightmapFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addSimpleLightmap(
      target: PIXI.DisplayObject
    ): PIXI.filters.SimpleLightmapFilter;

    /**
     * Apply a tilt-shift-like camera effect. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.TiltShiftFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addTiltShift(
      target: PIXI.DisplayObject
    ): PIXI.filters.TiltShiftFilter;

    /**
     * Apply a twist effect making display objects appear twisted in the given direction.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.TwistFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addTwist(target: PIXI.DisplayObject): PIXI.filters.TwistFilter;

    /**
     * Apply a zoom blur effect.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.ZoomBlurFilter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addZoomBlur(
      target: PIXI.DisplayObject
    ): PIXI.filters.ZoomBlurFilter;

    /**
     * Simplest filter - applies alpha.
     * Use this instead of Container's alpha property to avoid visual layering of individual elements. AlphaFilter applies alpha evenly across the entire display object and any opaque elements it contains. If elements are not opaque, they will blend with each other anyway.
     * Very handy if you want to use common features of all filters:
     * Assign a blendMode to this filter, blend all elements inside display object with background.
     * To use clipping in display coordinates, assign a filterArea to the same container that has this filter.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.AlphaFilter } - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addAlpha(target: PIXI.DisplayObject): PIXI.filters.AlphaFilter;

    /**
     * The BlurFilter applies a Gaussian blur to an object.
     * The strength of the blur can be set for the x-axis and y-axis separately.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.BlurFilter } - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addBlur(target: PIXI.DisplayObject): PIXI.filters.BlurFilter;

    /**
     * The BlurFilterPass applies a horizontal or vertical Gaussian blur to an object.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.BlurFilterPass } - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addBlurPass(
      target: PIXI.DisplayObject
    ): PIXI.filters.BlurFilterPass;

    /**
     * The ColorMatrixFilter class lets you apply a 5x4 matrix transformation on the RGBA color and alpha values of every pixel on your displayObject to produce a result with a new set of RGBA color and alpha values. It's pretty powerful!
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.ColorMatrixFilter } - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addColorMatrix(
      target: PIXI.DisplayObject
    ): PIXI.filters.ColorMatrixFilter;

    /**
     * The DisplacementFilter class uses the pixel values from the specified texture (called the displacement map) to perform a displacement of an object.
     * You can use this filter to apply all manor of crazy warping effects. Currently the r property of the texture is used to offset the x and the g property of the texture is used to offset the y.
     * The way it works is it uses the values of the displacement map to look up the correct pixels to output.
     * This means it's not technically moving the original.
     * Instead, it's starting at the output and asking "which pixel from the original goes here".
     * For example, if a displacement map pixel has red = 1 and the filter scale is 20, this filter will output the pixel approximately 20 pixels to the right of the original.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.DisplacementFilter } - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addDisplacement(
      target: PIXI.DisplayObject
    ): PIXI.filters.DisplacementFilter;

    /**
     * Basic FXAA (Fast Approximate Anti-Aliasing) implementation based on the code on geeks3d.com with the modification that the texture2DLod stuff was removed since it is unsupported by WebGL.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.FXAAFilter } - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addFXAA(
      target: PIXI.DisplayObject
    ): PIXI.filters.FXAAFilter;

    /**
     * A Noise effect filter.
     * Original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filters.NoiseFilter } - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function addNoise(
      target: PIXI.DisplayObject
    ): PIXI.filters.NoiseFilter;

    /**
     * Add a custom filter.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @param {String} vertex - The vertex part of the shader: https://www.khronos.org/opengl/wiki/Vertex_Shader
     * @param {String} fragment - The fragment part of the shader: https://www.khronos.org/opengl/wiki/Fragment_Shader
     * @param {Object} uniforms - Custom uniforms to use to augment the built-in ones: https://www.khronos.org/opengl/wiki/Uniform_(GLSL)
     * @return {PIXI.filter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function custom(target: PIXI.DisplayObject): PIXI.filter;

    /**
     * Remove a filter.
     * @param {PIXI.DisplayObject} target - Element (room, copy, container, etc.) to apply the filter.
     * @return {PIXI.filter} - Filter is a special type of WebGL shader that is applied to the screen or a part of the screen.
     */
    function remove(target: PIXI.DisplayObject): PIXI.filter;
  }
}
