declare module "packages/constants/src/index" {
    /**
     * Different types of environments for WebGL.
     * @static
     * @memberof PIXI
     * @enum {number}
     */
    export enum ENV {
        /**
         * Used for older v1 WebGL devices. PixiJS will aim to ensure compatibility
         * with older / less advanced devices. If you experience unexplained flickering prefer this environment.
         * @default 0
         */
        WEBGL_LEGACY = 0,
        /**
         * Version 1 of WebGL
         * @default 1
         */
        WEBGL = 1,
        /**
         * Version 2 of WebGL
         * @default 2
         */
        WEBGL2 = 2
    }
    /**
     * Constant to identify the Renderer Type.
     * @static
     * @memberof PIXI
     * @enum {number}
     */
    export enum RENDERER_TYPE {
        /**
         * Unknown render type.
         * @default 0
         */
        UNKNOWN = 0,
        /**
         * WebGL render type.
         * @default 1
         */
        WEBGL = 1,
        /**
         * Canvas render type.
         * @default 2
         */
        CANVAS = 2
    }
    /**
     * Bitwise OR of masks that indicate the buffers to be cleared.
     * @static
     * @memberof PIXI
     * @enum {number}
     */
    export enum BUFFER_BITS {
        /**
         * Indicates the buffers currently enabled for color writing.
         * @default 0x00004000
         */
        COLOR = 16384,
        /**
         * Indicates the depth buffer.
         * @default 0x00000100
         */
        DEPTH = 256,
        /**
         * Indicates the stencil buffer.
         * @default 0x00000400
         */
        STENCIL = 1024
    }
    /**
     * Various blend modes supported by PIXI.
     *
     * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
     * Anything else will silently act like NORMAL.
     * @memberof PIXI
     * @enum {number}
     */
    export enum BLEND_MODES {
        /**
         * @default 0
         */
        NORMAL = 0,
        /**
         * @default 1
         */
        ADD = 1,
        /**
         * The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer.
         * A darker picture is the result.
         * @default 2
         */
        MULTIPLY = 2,
        /**
         * The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)
         * @default 3
         */
        SCREEN = 3,
        /**
         * A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.
         *
         * Canvas Renderer only.
         * @default 4
         */
        OVERLAY = 4,
        /**
         * Retains the darkest pixels of both layers.
         *
         * Canvas Renderer only.
         * @default 5
         */
        DARKEN = 5,
        /**
         * Retains the lightest pixels of both layers.
         *
         * Canvas Renderer only.
         * @default 6
         */
        LIGHTEN = 6,
        /**
         * Divides the bottom layer by the inverted top layer.
         *
         * Canvas Renderer only.
         * @default 7
         */
        COLOR_DODGE = 7,
        /**
         * Divides the inverted bottom layer by the top layer, and then inverts the result.
         *
         * Canvas Renderer only.
         * @default 8
         */
        COLOR_BURN = 8,
        /**
         * A combination of multiply and screen like overlay, but with top and bottom layer swapped.
         *
         * Canvas Renderer only.
         * @default 9
         */
        HARD_LIGHT = 9,
        /**
         * A softer version of hard-light. Pure black or white does not result in pure black or white.
         *
         * Canvas Renderer only.
         * @default 10
         */
        SOFT_LIGHT = 10,
        /**
         * Subtracts the bottom layer from the top layer or the other way round to always get a positive value.
         *
         * Canvas Renderer only.
         * @default 11
         */
        DIFFERENCE = 11,
        /**
         * Like difference, but with lower contrast.
         *
         * Canvas Renderer only.
         * @default 12
         */
        EXCLUSION = 12,
        /**
         * Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
         *
         * Canvas Renderer only.
         * @default 13
         */
        HUE = 13,
        /**
         * Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
         *
         * Canvas Renderer only.
         * @default 14
         */
        SATURATION = 14,
        /**
         * Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
         *
         * Canvas Renderer only.
         * @default 15
         */
        COLOR = 15,
        /**
         * Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.
         *
         * Canvas Renderer only.
         * @default 16
         */
        LUMINOSITY = 16,
        /**
         * @default 17
         */
        NORMAL_NPM = 17,
        /**
         * @default 18
         */
        ADD_NPM = 18,
        /**
         * @default 19
         */
        SCREEN_NPM = 19,
        /**
         * @default 20
         */
        NONE = 20,
        /**
         * Draws new shapes on top of the existing canvas content.
         * @default 0
         */
        SRC_OVER = 0,
        /**
         * The new shape is drawn only where both the new shape and the destination canvas overlap.
         * Everything else is made transparent.
         * @default 21
         */
        SRC_IN = 21,
        /**
         * The new shape is drawn where it doesn't overlap the existing canvas content.
         * @default 22
         */
        SRC_OUT = 22,
        /**
         * The new shape is only drawn where it overlaps the existing canvas content.
         * @default 23
         */
        SRC_ATOP = 23,
        /**
         * New shapes are drawn behind the existing canvas content.
         * @default 24
         */
        DST_OVER = 24,
        /**
         * The existing canvas content is kept where both the new shape and existing canvas content overlap.
         * Everything else is made transparent.
         * @default 25
         */
        DST_IN = 25,
        /**
         * The existing content is kept where it doesn't overlap the new shape.
         * @default 26
         */
        DST_OUT = 26,
        /**
         * The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.
         * @default 27
         */
        DST_ATOP = 27,
        /**
         * @default 26
         */
        ERASE = 26,
        /**
         * @default 28
         */
        SUBTRACT = 28,
        /**
         * Shapes are made transparent where both overlap and drawn normal everywhere else.
         * @default 29
         */
        XOR = 29
    }
    /**
     * Various webgl draw modes. These can be used to specify which GL drawMode to use
     * under certain situations and renderers.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum DRAW_MODES {
        /**
         * To draw a series of points.
         * @default 0
         */
        POINTS = 0,
        /**
         *  To draw a series of unconnected line segments (individual lines).
         * @default 1
         */
        LINES = 1,
        /**
         *  To draw a series of connected line segments. It also joins the first and last vertices to form a loop.
         * @default 2
         */
        LINE_LOOP = 2,
        /**
         * To draw a series of connected line segments.
         * @default 3
         */
        LINE_STRIP = 3,
        /**
         * To draw a series of separate triangles.
         * @default 4
         */
        TRIANGLES = 4,
        /**
         * To draw a series of connected triangles in strip fashion.
         * @default 5
         */
        TRIANGLE_STRIP = 5,
        /**
         * To draw a series of connected triangles sharing the first vertex in a fan-like fashion.
         * @default 6
         */
        TRIANGLE_FAN = 6
    }
    /**
     * Various GL texture/resources formats.
     * @memberof PIXI
     * @static
     * @name FORMATS
     * @enum {number}
     */
    export enum FORMATS {
        /**
         * @default 6408
         */
        RGBA = 6408,
        /**
         * @default 6407
         */
        RGB = 6407,
        /**
         * @default 33319
         */
        RG = 33319,
        /**
         * @default 6403
         */
        RED = 6403,
        /**
         * @default 36249
         */
        RGBA_INTEGER = 36249,
        /**
         * @default 36248
         */
        RGB_INTEGER = 36248,
        /**
         * @default 33320
         */
        RG_INTEGER = 33320,
        /**
         * @default 36244
         */
        RED_INTEGER = 36244,
        /**
         * @default 6406
         */
        ALPHA = 6406,
        /**
         * @default 6409
         */
        LUMINANCE = 6409,
        /**
         * @default 6410
         */
        LUMINANCE_ALPHA = 6410,
        /**
         * @default 6402
         */
        DEPTH_COMPONENT = 6402,
        /**
         * @default 34041
         */
        DEPTH_STENCIL = 34041
    }
    /**
     * Various GL target types.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum TARGETS {
        /**
         * A two-dimensional texture
         * @default 3553
         */
        TEXTURE_2D = 3553,
        /**
         * A cube-mapped texture. When using a WebGL 2 context, the following values are available additionally:
         * - gl.TEXTURE_3D: A three-dimensional texture.
         * - gl.TEXTURE_2D_ARRAY: A two-dimensional array texture.
         * @default 34067
         */
        TEXTURE_CUBE_MAP = 34067,
        /**
         * A two-dimensional array texture.
         * @default 35866
         */
        TEXTURE_2D_ARRAY = 35866,
        /**
         * Positive X face for a cube-mapped texture.
         * @default 34069
         */
        TEXTURE_CUBE_MAP_POSITIVE_X = 34069,
        /**
         * Negative X face for a cube-mapped texture.
         * @default 34070
         */
        TEXTURE_CUBE_MAP_NEGATIVE_X = 34070,
        /**
         * Positive Y face for a cube-mapped texture.
         * @default 34071
         */
        TEXTURE_CUBE_MAP_POSITIVE_Y = 34071,
        /**
         * Negative Y face for a cube-mapped texture.
         * @default 34072
         */
        TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072,
        /**
         * Positive Z face for a cube-mapped texture.
         * @default 34073
         */
        TEXTURE_CUBE_MAP_POSITIVE_Z = 34073,
        /**
         * Negative Z face for a cube-mapped texture.
         * @default 34074
         */
        TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074
    }
    /**
     * Various GL data format types.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum TYPES {
        /**
         * 8 bits per channel for gl.RGBA
         * @default 5121
         */
        UNSIGNED_BYTE = 5121,
        /**
         * @default 5123
         */
        UNSIGNED_SHORT = 5123,
        /**
         * 5 red bits, 6 green bits, 5 blue bits.
         * @default 33635
         */
        UNSIGNED_SHORT_5_6_5 = 33635,
        /**
         * 4 red bits, 4 green bits, 4 blue bits, 4 alpha bits.
         * @default 32819
         */
        UNSIGNED_SHORT_4_4_4_4 = 32819,
        /**
         * 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit.
         * @default 32820
         */
        UNSIGNED_SHORT_5_5_5_1 = 32820,
        /**
         * @default 5125
         */
        UNSIGNED_INT = 5125,
        /**
         * @default 35899
         */
        UNSIGNED_INT_10F_11F_11F_REV = 35899,
        /**
         * @default 33640
         */
        UNSIGNED_INT_2_10_10_10_REV = 33640,
        /**
         * @default 34042
         */
        UNSIGNED_INT_24_8 = 34042,
        /**
         * @default 35902
         */
        UNSIGNED_INT_5_9_9_9_REV = 35902,
        /**
         * @default 5120
         */
        BYTE = 5120,
        /**
         * @default 5122
         */
        SHORT = 5122,
        /**
         * @default 5124
         */
        INT = 5124,
        /**
         * @default 5126
         */
        FLOAT = 5126,
        /**
         * @default 36269
         */
        FLOAT_32_UNSIGNED_INT_24_8_REV = 36269,
        /**
         * @default 36193
         */
        HALF_FLOAT = 36193
    }
    /**
     * Various sampler types. Correspond to `sampler`, `isampler`, `usampler` GLSL types respectively.
     * WebGL1 works only with FLOAT.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum SAMPLER_TYPES {
        /**
         * @default 0
         */
        FLOAT = 0,
        /**
         * @default 1
         */
        INT = 1,
        /**
         * @default 2
         */
        UINT = 2
    }
    /**
     * The scale modes that are supported by pixi.
     *
     * The {@link PIXI.BaseTexture.defaultOptions.scaleMode} scale mode affects the default scaling mode of future operations.
     * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum SCALE_MODES {
        /**
         * Pixelating scaling
         * @default 0
         */
        NEAREST = 0,
        /**
         * Smooth scaling
         * @default 1
         */
        LINEAR = 1
    }
    /**
     * The wrap modes that are supported by pixi.
     *
     * The wrap mode affects the default wrapping mode of future operations.
     * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
     * If the texture is non power of two then clamp will be used regardless as WebGL can
     * only use REPEAT if the texture is po2.
     *
     * This property only affects WebGL.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum WRAP_MODES {
        /**
         * The textures uvs are clamped
         * @default 33071
         */
        CLAMP = 33071,
        /**
         * The texture uvs tile and repeat
         * @default 10497
         */
        REPEAT = 10497,
        /**
         * The texture uvs tile and repeat with mirroring
         * @default 33648
         */
        MIRRORED_REPEAT = 33648
    }
    /**
     * Mipmap filtering modes that are supported by pixi.
     *
     * The {@link PIXI.BaseTexture.defaultOptions.mipmap} affects default texture filtering.
     * Mipmaps are generated for a baseTexture if its `mipmap` field is `ON`,
     * or its `POW2` and texture dimensions are powers of 2.
     * Since WebGL 1 don't support mipmap for non-power-of-two textures,
     * `ON` option will work like `POW2` for WebGL 1.
     *
     * This property only affects WebGL.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum MIPMAP_MODES {
        /**
         * No mipmaps.
         * @default 0
         */
        OFF = 0,
        /**
         * Generate mipmaps if texture dimensions are powers of 2.
         * @default 1
         */
        POW2 = 1,
        /**
         * Always generate mipmaps.
         * @default 2
         */
        ON = 2,
        /**
         * Use mipmaps, but do not auto-generate them.
         * this is used with a resource that supports buffering each level-of-detail.
         * @default 3
         */
        ON_MANUAL = 3
    }
    /**
     * How to treat textures with premultiplied alpha
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum ALPHA_MODES {
        /**
         * Alias for NO_PREMULTIPLIED_ALPHA.
         * @type {number}
         * @default 0
         */
        NPM = 0,
        /**
         * Default option, alias for PREMULTIPLY_ON_UPLOAD.
         * @type {number}
         * @default 1
         */
        UNPACK = 1,
        /**
         * Alias for PREMULTIPLIED_ALPHA.
         * @type {number}
         * @default 2
         */
        PMA = 2,
        /**
         * Source is not premultiplied, leave it like that.
         * Option for compressed and data textures that are created from typed arrays.
         * @type {number}
         * @default 0
         */
        NO_PREMULTIPLIED_ALPHA = 0,
        /**
         * Source is not premultiplied, premultiply on upload.
         * Default option, used for all loaded images.
         * @type {number}
         * @default 1
         */
        PREMULTIPLY_ON_UPLOAD = 1,
        /**
         * Source is already premultiplied. Example: spine atlases with `_pma` suffix.
         * @type {number}
         * @default 2
         */
        PREMULTIPLIED_ALPHA = 2
    }
    /**
     * Configure whether filter textures are cleared after binding.
     *
     * Filter textures need not be cleared if the filter does not use pixel blending. {@link PIXI.CLEAR_MODES.BLIT} will detect
     * this and skip clearing as an optimization.
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum CLEAR_MODES {
        /**
         * Alias for BLEND, same as `false` in earlier versions
         * @default 0
         */
        NO = 0,
        /**
         * Alias for CLEAR, same as `true` in earlier versions
         * @default 1
         */
        YES = 1,
        /**
         * Alias for BLIT
         * @default 2
         */
        AUTO = 2,
        /**
         * Do not clear the filter texture. The filter's output will blend on top of the output texture.
         * @default 0
         */
        BLEND = 0,
        /**
         * Always clear the filter texture.
         * @default 1
         */
        CLEAR = 1,
        /**
         * Clear only if {@link PIXI.FilterSystem.forceClear} is set or if the filter uses pixel blending.
         * @default 2
         */
        BLIT = 2
    }
    /**
     * The gc modes that are supported by pixi.
     *
     * The {@link PIXI.TextureGCSystem.defaultMode} Garbage Collection mode for PixiJS textures is AUTO
     * If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
     * used for a specified period of time they will be removed from the GPU. They will of course
     * be uploaded again when they are required. This is a silent behind the scenes process that
     * should ensure that the GPU does not  get filled up.
     *
     * Handy for mobile devices!
     * This property only affects WebGL.
     * @enum {number}
     * @static
     * @memberof PIXI
     */
    export enum GC_MODES {
        /**
         * Garbage collection will happen periodically automatically
         * @default 0
         */
        AUTO = 0,
        /**
         * Garbage collection will need to be called manually
         * @default 1
         */
        MANUAL = 1
    }
    /**
     * Constants that specify float precision in shaders.
     * @memberof PIXI
     * @static
     * @enum {string}
     */
    export enum PRECISION {
        /**
         * lowp is at least an 9 bit value.
         * For floating point values they can range from: -2 to +2,
         * for integer values they are similar to Uint8Array or Int8Array
         * @default lowp
         */
        LOW = "lowp",
        /**
         * mediump is at least a 16 bit value.
         * For floating point values they can range from: -2^14 to +2^14,
         * for integer values they are similar to Uint16Array or Int16Array
         * @default mediump
         */
        MEDIUM = "mediump",
        /**
         * highp is at least a 32 bit value.
         * For floating point values they can range from: -2^62 to +2^62,
         * for integer values they are similar to Uint32Array or Int32Array
         * @default highp
         */
        HIGH = "highp"
    }
    /**
     * Constants for mask implementations.
     * We use `type` suffix because it leads to very different behaviours
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum MASK_TYPES {
        /**
         * Mask is ignored
         * @default 0
         */
        NONE = 0,
        /**
         * Scissor mask, rectangle on screen, cheap
         * @default 1
         */
        SCISSOR = 1,
        /**
         * Stencil mask, 1-bit, medium, works only if renderer supports stencil
         * @default 2
         */
        STENCIL = 2,
        /**
         * Mask that uses SpriteMaskFilter, uses temporary RenderTexture
         * @default 3
         */
        SPRITE = 3,
        /**
         * Color mask (RGBA)
         * @default 4
         */
        COLOR = 4
    }
    /**
     * Bitwise OR of masks that indicate the color channels that are rendered to.
     * @static
     * @memberof PIXI
     * @enum {number}
     */
    export enum COLOR_MASK_BITS {
        /**
         * Red channel.
         * @default 0x1
         */
        RED = 1,
        /**
         * Green channel
         * @default 0x2
         */
        GREEN = 2,
        /**
         * Blue channel.
         * @default 0x4
         */
        BLUE = 4,
        /**
         * Alpha channel.
         * @default 0x
         */
        ALPHA = 8
    }
    /**
     * Constants for multi-sampling antialiasing.
     * @see PIXI.Framebuffer#multisample
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum MSAA_QUALITY {
        /**
         * No multisampling for this renderTexture
         * @default 0
         */
        NONE = 0,
        /**
         * Try 2 samples
         * @default 2
         */
        LOW = 2,
        /**
         * Try 4 samples
         * @default 4
         */
        MEDIUM = 4,
        /**
         * Try 8 samples
         * @default 8
         */
        HIGH = 8
    }
    /**
     * Constants for various buffer types in Pixi
     * @see PIXI.BUFFER_TYPE
     * @memberof PIXI
     * @static
     * @enum {number}
     */
    export enum BUFFER_TYPE {
        /**
         * buffer type for using as an index buffer
         * @default 34963
         */
        ELEMENT_ARRAY_BUFFER = 34963,
        /**
         * buffer type for using attribute data
         * @default 34962
         */
        ARRAY_BUFFER = 34962,
        /**
         * the buffer type is for uniform buffer objects
         * @default 35345
         */
        UNIFORM_BUFFER = 35345
    }
}
declare module "packages/settings/src/ICanvasRenderingContext2D" {
    import type { ICanvas } from "packages/settings/src/ICanvas";
    /**
     * Common interface for CanvasRenderingContext2D, OffscreenCanvasRenderingContext2D, and other custom canvas 2D context.
     * @memberof PIXI
     */
    export interface ICanvasRenderingContext2D extends CanvasState, CanvasTransform, CanvasCompositing, CanvasImageSmoothing, CanvasFillStrokeStyles, CanvasShadowStyles, CanvasFilters, CanvasRect, CanvasDrawPath, CanvasText, CanvasDrawImage, CanvasImageData, CanvasPathDrawingStyles, CanvasTextDrawingStyles, CanvasPath {
        createPattern(image: CanvasImageSource | ICanvas, repetition: string | null): CanvasPattern | null;
        drawImage(image: CanvasImageSource | ICanvas, dx: number, dy: number): void;
        drawImage(image: CanvasImageSource | ICanvas, dx: number, dy: number, dw: number, dh: number): void;
        drawImage(image: CanvasImageSource | ICanvas, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
        letterSpacing?: string;
        textLetterSpacing?: string;
    }
}
declare module "packages/settings/src/ICanvas" {
    import type { ICanvasRenderingContext2D } from "packages/settings/src/ICanvasRenderingContext2D";
    export type ContextIds = '2d' | 'bitmaprenderer' | 'webgl' | 'experimental-webgl' | 'webgl2' | 'experimental-webgl2';
    export type PredefinedColorSpace = 'srgb' | 'display-p3';
    export type RenderingContext = ICanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext;
    export interface ICanvasRenderingContext2DSettings {
        alpha?: boolean;
        colorSpace?: PredefinedColorSpace;
        desynchronized?: boolean;
        willReadFrequently?: boolean;
    }
    export type ContextSettings = ICanvasRenderingContext2DSettings | ImageBitmapRenderingContextSettings | WebGLContextAttributes;
    export interface ICanvasParentNode {
        /** Adds a node to the end of the list of children of the parent node. */
        appendChild(element: HTMLElement): void;
        /** Removes a child node from the parent node. */
        removeChild(element: HTMLElement): void;
        removeChild(element: ICanvas): void;
    }
    export interface ICanvasStyle {
        width?: string;
        height?: string;
        cursor?: string;
        touchAction?: string;
        msTouchAction?: string;
        msContentZooming?: string;
    }
    export interface ICanvasRect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    export interface WebGLContextEventMap {
        'webglcontextlost': WebGLContextEvent;
        'webglcontextrestore': WebGLContextEvent;
    }
    /**
     * Common interface for HTMLCanvasElement, OffscreenCanvas, and other custom canvas classes.
     * @memberof PIXI
     * @extends GlobalMixins.ICanvas
     * @extends Partial<EventTarget>
     */
    export interface ICanvas extends GlobalMixins.ICanvas, Partial<EventTarget> {
        /** Width of the canvas. */
        width: number;
        /** Height of the canvas. */
        height: number;
        /**
         * Get rendering context of the canvas.
         * @param {ContextIds} contextId - The identifier of the type of context to create.
         * @param {ContextSettings} options - The options for creating context.
         * @returns {RenderingContext | null} The created context, or null if contextId is not supported.
         */
        getContext(contextId: '2d', options?: ICanvasRenderingContext2DSettings): ICanvasRenderingContext2D | null;
        getContext(contextId: 'bitmaprenderer', options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
        getContext(contextId: 'webgl' | 'experimental-webgl', options?: WebGLContextAttributes): WebGLRenderingContext | null;
        getContext(contextId: 'webgl2' | 'experimental-webgl2', options?: WebGLContextAttributes): WebGL2RenderingContext | null;
        getContext(contextId: ContextIds, options?: ContextSettings): RenderingContext | null;
        /**
         * Get the content of the canvas as data URL.
         * @param {string} [type] - A string indicating the image format. The default type is `image/png`;
         *      that type is also used if the given type isn't supported.
         * @param {string} [quality] - A number between 0 and 1 indicating the image quality to be used when
         *      creating images using file formats that support lossy compression (such as `image/jpeg` or `image/webp`).
         *      A user agent will use its default quality value if this option is not specified, or if the number
         *      is outside the allowed range.
         * @returns {string} A string containing the requested data URL.
         */
        toDataURL?(type?: string, quality?: number): string;
        /**
         * Creates a Blob from the content of the canvas.
         * @param {(blob: Blob | null) => void} callback - A callback function with the resulting `Blob` object
         *      as a single argument. `null` may be passed if the image cannot be created for any reason.
         * @param {string} [type] - A string indicating the image format. The default type is `image/png`;
         *      that type is also used if the given type isn't supported.
         * @param {string} [quality] - A number between 0 and 1 indicating the image quality to be used when
         *      creating images using file formats that support lossy compression (such as `image/jpeg` or `image/webp`).
         *      A user agent will use its default quality value if this option is not specified, or if the number
         *      is outside the allowed range.
         * @returns {void}
         */
        toBlob?(callback: (blob: Blob | null) => void, type?: string, quality?: number): void;
        /**
         * Get the content of the canvas as Blob.
         * @param {object} [options] - The options for creating Blob.
         * @param {string} [options.type] - A string indicating the image format. The default type is `image/png`;
         *      that type is also used if the given type isn't supported.
         * @param {string} [options.quality] - A number between 0 and 1 indicating the image quality to be used when
         *      creating images using file formats that support lossy compression (such as `image/jpeg` or `image/webp`).
         *      A user agent will use its default quality value if this option is not specified, or if the number
         *      is outside the allowed range.
         * @returns {Promise<Blob>} A `Promise` returning a Blob object representing the image contained in the canvas.
         */
        convertToBlob?(options?: {
            type?: string;
            quality?: number;
        }): Promise<Blob>;
        /**
         * Adds the listener for the specified event.
         * @method
         * @param {string} type - The type of event to listen for.
         * @param {EventListenerOrEventListenerObject} listener - The callback to invoke when the event is fired.
         * @param {boolean | AddEventListenerOptions} options - The options for adding event listener.
         * @returns {void}
         */
        addEventListener?: {
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
            <K extends keyof WebGLContextEventMap>(type: K, listener: (this: ICanvas, ev: WebGLContextEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        };
        /**
         * Removes the listener for the specified event.
         * @method
         * @param {string} type - The type of event to listen for.
         * @param {EventListenerOrEventListenerObject} listener - The callback to invoke when the event is fired.
         * @param {boolean | EventListenerOptions} options - The options for removing event listener.
         * @returns {void}
         */
        removeEventListener?: {
            (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
            <K extends keyof WebGLContextEventMap>(type: K, listener: (this: ICanvas, ev: WebGLContextEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        };
        /**
         * Dispatches a event.
         * @param {Event} event - The Event object to dispatch. Its Event.target property will be set to the current EventTarget.
         * @returns {boolean} Returns false if event is cancelable, and at least one of the event handlers which received event
         *                    called Event.preventDefault(). Otherwise true.
         */
        dispatchEvent(event: Event): boolean;
        /** Parent node of the canvas. */
        readonly parentNode?: ICanvasParentNode | null;
        /** Style of the canvas. */
        readonly style?: ICanvasStyle;
        /**
         * Get the position and the size of the canvas.
         * @returns The smallest rectangle which contains the entire canvas.
         */
        getBoundingClientRect?(): ICanvasRect;
    }
}
declare module "packages/settings/src/adapter" {
    import type { ICanvas } from "packages/settings/src/ICanvas";
    import type { ICanvasRenderingContext2D } from "packages/settings/src/ICanvasRenderingContext2D";
    /**
     * This interface describes all the DOM dependent calls that Pixi makes throughout its codebase.
     * Implementations of this interface can be used to make sure Pixi will work in any environment,
     * such as browser, Web Workers, and Node.js.
     * @memberof PIXI
     */
    export interface IAdapter {
        /** Returns a canvas object that can be used to create a webgl context. */
        createCanvas: (width?: number, height?: number) => ICanvas;
        /** Returns a 2D rendering context. */
        getCanvasRenderingContext2D: () => {
            prototype: ICanvasRenderingContext2D;
        };
        /** Returns a WebGL rendering context. */
        getWebGLRenderingContext: () => typeof WebGLRenderingContext;
        /** Returns a partial implementation of the browsers window.navigator */
        getNavigator: () => {
            userAgent: string;
        };
        /** Returns the current base URL For browser environments this is either the document.baseURI or window.location.href */
        getBaseUrl: () => string;
        getFontFaceSet: () => FontFaceSet | null;
        fetch: (url: RequestInfo, options?: RequestInit) => Promise<Response>;
        parseXML: (xml: string) => Document;
    }
    export const BrowserAdapter: IAdapter;
}
declare module "packages/settings/src/settings" {
    import type { IAdapter } from "packages/settings/src/adapter";
    interface ISettings {
        ADAPTER: IAdapter;
        RESOLUTION: number;
        CREATE_IMAGE_BITMAP: boolean;
        ROUND_PIXELS: boolean;
    }
    /**
     * User's customizable globals for overriding the default PIXI settings, such
     * as a renderer's default resolution, framerate, float precision, etc.
     * @example
     * import { settings, ENV } from 'pixi.js';
     *
     * // Use the native window resolution as the default resolution
     * // will support high-density displays when rendering
     * settings.RESOLUTION = window.devicePixelRatio;
     *
     * // Used for older v1 WebGL devices for backwards compatibility
     * settings.PREFER_ENV = ENV.WEBGL_LEGACY;
     * @namespace PIXI.settings
     */
    export const settings: ISettings & Partial<GlobalMixins.Settings>;
}
declare module "packages/settings/src/utils/isMobile" {
    export type isMobileResult = {
        apple: {
            phone: boolean;
            ipod: boolean;
            tablet: boolean;
            universal: boolean;
            device: boolean;
        };
        amazon: {
            phone: boolean;
            tablet: boolean;
            device: boolean;
        };
        android: {
            phone: boolean;
            tablet: boolean;
            device: boolean;
        };
        windows: {
            phone: boolean;
            tablet: boolean;
            device: boolean;
        };
        other: {
            blackberry: boolean;
            blackberry10: boolean;
            opera: boolean;
            firefox: boolean;
            chrome: boolean;
            device: boolean;
        };
        phone: boolean;
        tablet: boolean;
        any: boolean;
    };
    export const isMobile: isMobileResult;
}
declare module "packages/settings/src/index" {
    export * from "packages/settings/src/adapter";
    export * from "packages/settings/src/ICanvas";
    export * from "packages/settings/src/ICanvasRenderingContext2D";
    export * from "packages/settings/src/settings";
    export * from "packages/settings/src/utils/isMobile";
}
declare module "packages/utils/src/settings" {
    import { settings } from "packages/settings/src/index";
    export { settings };
}
declare module "packages/utils/src/types/index" {
    export type ArrayFixed<T, L extends number> = [T, ...Array<T>] & {
        length: L;
    };
    export type Dict<T> = {
        [key: string]: T;
    };
}
declare module "packages/utils/src/logging/deprecation" {
    /**
     * Helper for warning developers about deprecated features & settings.
     * A stack track for warnings is given; useful for tracking-down where
     * deprecated methods/properties/classes are being used within the code.
     * @memberof PIXI.utils
     * @function deprecation
     * @param {string} version - The version where the feature became deprecated
     * @param {string} message - Message should include what is deprecated, where, and the new solution
     * @param {number} [ignoreDepth=3] - The number of steps to ignore at the top of the error stack
     *        this is mostly to ignore internal deprecation calls.
     */
    export function deprecation(version: string, message: string, ignoreDepth?: number): void;
}
declare module "packages/utils/src/url" {
    interface ParsedUrlQuery {
        [key: string]: string | string[];
    }
    interface ParsedUrlQueryInput {
        [key: string]: unknown;
    }
    interface UrlObjectCommon {
        auth?: string;
        hash?: string;
        host?: string;
        hostname?: string;
        href?: string;
        path?: string;
        pathname?: string;
        protocol?: string;
        search?: string;
        slashes?: boolean;
    }
    interface UrlObject extends UrlObjectCommon {
        port?: string | number;
        query?: string | null | ParsedUrlQueryInput;
    }
    interface Url extends UrlObjectCommon {
        port?: string;
        query?: string | null | ParsedUrlQuery;
    }
    interface UrlWithParsedQuery extends Url {
        query: ParsedUrlQuery;
    }
    interface UrlWithStringQuery extends Url {
        query: string | null;
    }
    interface URLFormatOptions {
        auth?: boolean;
        fragment?: boolean;
        search?: boolean;
        unicode?: boolean;
    }
    type ParseFunction = {
        (urlStr: string): UrlWithStringQuery;
        (urlStr: string, parseQueryString: false | undefined, slashesDenoteHost?: boolean): UrlWithStringQuery;
        (urlStr: string, parseQueryString: true, slashesDenoteHost?: boolean): UrlWithParsedQuery;
        (urlStr: string, parseQueryString: boolean, slashesDenoteHost?: boolean): Url;
    };
    type FormatFunction = {
        (URL: URL, options?: URLFormatOptions): string;
        (urlObject: UrlObject | string): string;
    };
    type ResolveFunction = {
        (from: string, to: string): string;
    };
    export const url: {
        /**
         * @deprecated since 7.3.0
         */
        readonly parse: ParseFunction;
        /**
         * @deprecated since 7.3.0
         */
        readonly format: FormatFunction;
        /**
         * @deprecated since 7.3.0
         */
        readonly resolve: ResolveFunction;
    };
}
declare module "packages/utils/src/path" {
    export interface Path {
        toPosix: (path: string) => string;
        toAbsolute: (url: string, baseUrl?: string, rootUrl?: string) => string;
        isUrl: (path: string) => boolean;
        isDataUrl: (path: string) => boolean;
        hasProtocol: (path: string) => boolean;
        getProtocol: (path: string) => string;
        normalize: (path: string) => string;
        join: (...paths: string[]) => string;
        isAbsolute: (path: string) => boolean;
        dirname: (path: string) => string;
        rootname: (path: string) => string;
        basename: (path: string, ext?: string) => string;
        extname: (path: string) => string;
        parse: (path: string) => {
            root?: string;
            dir?: string;
            base?: string;
            ext?: string;
            name?: string;
        };
        sep: string;
        delimiter: string;
    }
    export const path: Path;
}
declare module "packages/utils/src/browser/detectVideoAlphaMode" {
    import { ALPHA_MODES } from "packages/constants/src/index";
    /**
     * Helper for detecting the correct alpha mode for video textures.
     * For some reason, some browsers/devices/WebGL implementations premultiply the alpha
     * of a video before and then a second time if `UNPACK_PREMULTIPLY_ALPHA_WEBGL`
     * is true. So the video is premultiplied twice if the alpha mode is `UNPACK`.
     * In this case we need the alpha mode to be `PMA`. This function detects
     * the upload behavior by uploading a white 2x2 webm with 50% alpha
     * without `UNPACK_PREMULTIPLY_ALPHA_WEBGL` and then checking whether
     * the uploaded pixels are premultiplied.
     * @memberof PIXI.utils
     * @function detectVideoAlphaMode
     * @returns {Promise<PIXI.ALPHA_MODES>} The correct alpha mode for video textures.
     */
    export function detectVideoAlphaMode(): Promise<ALPHA_MODES>;
}
declare module "packages/utils/src/browser/hello" {
    /**
     * @function skipHello
     * @memberof PIXI.utils
     * @deprecated since 7.0.0
     */
    export function skipHello(): void;
    /**
     * @static
     * @function sayHello
     * @memberof PIXI.utils
     * @deprecated since 7.0.0
     */
    export function sayHello(): void;
}
declare module "packages/utils/src/browser/isWebGLSupported" {
    /**
     * Helper for checking for WebGL support.
     * @memberof PIXI.utils
     * @function isWebGLSupported
     * @returns {boolean} Is WebGL supported.
     */
    export function isWebGLSupported(): boolean;
}
declare module "packages/color/src/Color" {
    import type { HslaColor, HslColor, HsvaColor, HsvColor, RgbaColor, RgbColor } from 'colord/types';
    /**
     * Value types for the constructor of {@link PIXI.Color}.
     * These types are extended from [colord](https://www.npmjs.com/package/colord) with some PixiJS-specific extensions.
     *
     * Possible value types are:
     * - [Color names](https://www.w3.org/TR/css-color-4/#named-colors):
     *   `'red'`, `'green'`, `'blue'`, `'white'`, etc.
     * - RGB hex integers (`0xRRGGBB`):
     *   `0xff0000`, `0x00ff00`, `0x0000ff`, etc.
     * - [RGB(A) hex strings](https://www.w3.org/TR/css-color-4/#hex-notation):
     *   - 6 digits (`RRGGBB`): `'ff0000'`, `'#00ff00'`, `'0x0000ff'`, etc.
     *   - 3 digits (`RGB`): `'f00'`, `'#0f0'`, `'0x00f'`, etc.
     *   - 8 digits (`RRGGBBAA`): `'ff000080'`, `'#00ff0080'`, `'0x0000ff80'`, etc.
     *   - 4 digits (`RGBA`): `'f008'`, `'#0f08'`, `'0x00f8'`, etc.
     * - RGB(A) objects:
     *   `{ r: 255, g: 0, b: 0 }`, `{ r: 255, g: 0, b: 0, a: 0.5 }`, etc.
     * - [RGB(A) strings](https://www.w3.org/TR/css-color-4/#rgb-functions):
     *   `'rgb(255, 0, 0)'`, `'rgb(100% 0% 0%)'`, `'rgba(255, 0, 0, 0.5)'`, `'rgba(100% 0% 0% / 50%)'`, etc.
     * - RGB(A) arrays:
     *   `[1, 0, 0]`, `[1, 0, 0, 0.5]`, etc.
     * - RGB(A) Float32Array:
     *   `new Float32Array([1, 0, 0])`, `new Float32Array([1, 0, 0, 0.5])`, etc.
     * - RGB(A) Uint8Array:
     *   `new Uint8Array([255, 0, 0])`, `new Uint8Array([255, 0, 0, 128])`, etc.
     * - RGB(A) Uint8ClampedArray:
     *   `new Uint8ClampedArray([255, 0, 0])`, `new Uint8ClampedArray([255, 0, 0, 128])`, etc.
     * - HSL(A) objects:
     *   `{ h: 0, s: 100, l: 50 }`, `{ h: 0, s: 100, l: 50, a: 0.5 }`, etc.
     * - [HSL(A) strings](https://www.w3.org/TR/css-color-4/#the-hsl-notation):
     *   `'hsl(0, 100%, 50%)'`, `'hsl(0deg 100% 50%)'`, `'hsla(0, 100%, 50%, 0.5)'`, `'hsla(0deg 100% 50% / 50%)'`, etc.
     * - HSV(A) objects:
     *   `{ h: 0, s: 100, v: 100 }`, `{ h: 0, s: 100, v: 100, a: 0.5 }`, etc.
     * - {@link PIXI.Color} objects.
     * @memberof PIXI
     * @since 7.2.0
     */
    export type ColorSource = string | number | number[] | Float32Array | Uint8Array | Uint8ClampedArray | HslColor | HslaColor | HsvColor | HsvaColor | RgbColor | RgbaColor | Color | Number;
    /**
     * Color utility class.
     * @example
     * import { Color } from 'pixi.js';
     * new Color('red').toArray(); // [1, 0, 0, 1]
     * new Color(0xff0000).toArray(); // [1, 0, 0, 1]
     * new Color('ff0000').toArray(); // [1, 0, 0, 1]
     * new Color('#f00').toArray(); // [1, 0, 0, 1]
     * new Color('0xff0000ff').toArray(); // [1, 0, 0, 1]
     * new Color('#f00f').toArray(); // [1, 0, 0, 1]
     * new Color({ r: 255, g: 0, b: 0, a: 0.5 }).toArray(); // [1, 0, 0, 0.5]
     * new Color('rgb(255, 0, 0, 0.5)').toArray(); // [1, 0, 0, 0.5]
     * new Color([1, 1, 1]).toArray(); // [1, 1, 1, 1]
     * new Color([1, 0, 0, 0.5]).toArray(); // [1, 0, 0, 0.5]
     * new Color(new Float32Array([1, 0, 0, 0.5])).toArray(); // [1, 0, 0, 0.5]
     * new Color(new Uint8Array([255, 0, 0, 255])).toArray(); // [1, 0, 0, 1]
     * new Color(new Uint8ClampedArray([255, 0, 0, 255])).toArray(); // [1, 0, 0, 1]
     * new Color({ h: 0, s: 100, l: 50, a: 0.5 }).toArray(); // [1, 0, 0, 0.5]
     * new Color('hsl(0, 100%, 50%, 50%)').toArray(); // [1, 0, 0, 0.5]
     * new Color({ h: 0, s: 100, v: 100, a: 0.5 }).toArray(); // [1, 0, 0, 0.5]
     * @memberof PIXI
     * @since 7.2.0
     */
    export class Color {
        /**
         * Default Color object for static uses
         * @example
         * import { Color } from 'pixi.js';
         * Color.shared.setValue(0xffffff).toHex(); // '#ffffff'
         */
        static readonly shared: Color;
        /**
         * Temporary Color object for static uses internally.
         * As to not conflict with Color.shared.
         * @ignore
         */
        private static readonly temp;
        /** Pattern for hex strings */
        private static readonly HEX_PATTERN;
        /** Internal color source, from constructor or set value */
        private _value;
        /** Normalized rgba component, floats from 0-1 */
        private _components;
        /** Cache color as number */
        private _int;
        /**
         * @param {PIXI.ColorSource} value - Optional value to use, if not provided, white is used.
         */
        constructor(value?: ColorSource);
        /** Get red component (0 - 1) */
        get red(): number;
        /** Get green component (0 - 1) */
        get green(): number;
        /** Get blue component (0 - 1) */
        get blue(): number;
        /** Get alpha component (0 - 1) */
        get alpha(): number;
        /**
         * Set the value, suitable for chaining
         * @param value
         * @see PIXI.Color.value
         */
        setValue(value: ColorSource): this;
        /**
         * The current color source.
         *
         * When setting:
         * - Setting to an instance of `Color` will copy its color source and components.
         * - Otherwise, `Color` will try to normalize the color source and set the components.
         *   If the color source is invalid, an `Error` will be thrown and the `Color` will left unchanged.
         *
         * Note: The `null` in the setter's parameter type is added to match the TypeScript rule: return type of getter
         * must be assignable to its setter's parameter type. Setting `value` to `null` will throw an `Error`.
         *
         * When getting:
         * - A return value of `null` means the previous value was overridden (e.g., {@link PIXI.Color.multiply multiply},
         *   {@link PIXI.Color.premultiply premultiply} or {@link PIXI.Color.round round}).
         * - Otherwise, the color source used when setting is returned.
         * @type {PIXI.ColorSource}
         */
        set value(value: ColorSource | null);
        get value(): Exclude<ColorSource, Color> | null;
        /**
         * Copy a color source internally.
         * @param value - Color source
         */
        private cloneSource;
        /**
         * Equality check for color sources.
         * @param value1 - First color source
         * @param value2 - Second color source
         * @returns `true` if the color sources are equal, `false` otherwise.
         */
        private isSourceEqual;
        /**
         * Convert to a RGBA color object.
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1, a: 1 }
         */
        toRgba(): RgbaColor;
        /**
         * Convert to a RGB color object.
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1 }
         */
        toRgb(): RgbColor;
        /** Convert to a CSS-style rgba string: `rgba(255,255,255,1.0)`. */
        toRgbaString(): string;
        /**
         * Convert to an [R, G, B] array of clamped uint8 values (0 to 255).
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toUint8RgbArray(); // returns [255, 255, 255]
         * @param {number[]|Uint8Array|Uint8ClampedArray} [out] - Output array
         */
        toUint8RgbArray(): number[];
        toUint8RgbArray<T extends (number[] | Uint8Array | Uint8ClampedArray)>(out: T): T;
        /**
         * Convert to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toRgbArray(); // returns [1, 1, 1]
         * @param {number[]|Float32Array} [out] - Output array
         */
        toRgbArray(): number[];
        toRgbArray<T extends (number[] | Float32Array)>(out: T): T;
        /**
         * Convert to a hexadecimal number.
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toNumber(); // returns 16777215
         */
        toNumber(): number;
        /**
         * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
         * @example
         * import { Color } from 'pixi.js';
         * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
         * @returns {number} - The color as a number in little endian format.
         */
        toLittleEndianNumber(): number;
        /**
         * Multiply with another color. This action is destructive, and will
         * override the previous `value` property to be `null`.
         * @param {PIXI.ColorSource} value - The color to multiply by.
         */
        multiply(value: ColorSource): this;
        /**
         * Converts color to a premultiplied alpha format. This action is destructive, and will
         * override the previous `value` property to be `null`.
         * @param alpha - The alpha to multiply by.
         * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
         * @returns {PIXI.Color} - Itself.
         */
        premultiply(alpha: number, applyToRGB?: boolean): this;
        /**
         * Premultiplies alpha with current color.
         * @param {number} alpha - The alpha to multiply by.
         * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
         * @returns {number} tint multiplied by alpha
         */
        toPremultiplied(alpha: number, applyToRGB?: boolean): number;
        /**
         * Convert to a hexidecimal string.
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toHex(); // returns "#ffffff"
         */
        toHex(): string;
        /**
         * Convert to a hexidecimal string with alpha.
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toHexa(); // returns "#ffffffff"
         */
        toHexa(): string;
        /**
         * Set alpha, suitable for chaining.
         * @param alpha
         */
        setAlpha(alpha: number): this;
        /**
         * Rounds the specified color according to the step. This action is destructive, and will
         * override the previous `value` property to be `null`. The alpha component is not rounded.
         * @param steps - Number of steps which will be used as a cap when rounding colors
         * @deprecated since 7.3.0
         */
        round(steps: number): this;
        /**
         * Convert to an [R, G, B, A] array of normalized floats (numbers from 0.0 to 1.0).
         * @example
         * import { Color } from 'pixi.js';
         * new Color('white').toArray(); // returns [1, 1, 1, 1]
         * @param {number[]|Float32Array} [out] - Output array
         */
        toArray(): number[];
        toArray<T extends (number[] | Float32Array)>(out: T): T;
        /**
         * Normalize the input value into rgba
         * @param value - Input value
         */
        private normalize;
        /** Refresh the internal color rgb number */
        private refreshInt;
        /**
         * Clamps values to a range. Will override original values
         * @param value - Value(s) to clamp
         * @param min - Minimum value
         * @param max - Maximum value
         */
        private _clamp;
    }
}
declare module "packages/color/src/index" {
    export * from "packages/color/src/Color";
}
declare module "packages/utils/src/color/hex" {
    /**
     * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
     * @memberof PIXI.utils
     * @function hex2rgb
     * @see PIXI.Color.toRgbArray
     * @deprecated since 7.2.0
     * @param {number} hex - The hexadecimal number to convert
     * @param  {number[]} [out=[]] - If supplied, this array will be used rather than returning a new one
     * @returns {number[]} An array representing the [R, G, B] of the color where all values are floats.
     */
    export function hex2rgb(hex: number, out?: Array<number> | Float32Array): Array<number> | Float32Array;
    /**
     * Converts a hexadecimal color number to a string.
     * @see PIXI.Color.toHex
     * @deprecated since 7.2.0
     * @memberof PIXI.utils
     * @function hex2string
     * @param {number} hex - Number in hex (e.g., `0xffffff`)
     * @returns {string} The string color (e.g., `"#ffffff"`).
     */
    export function hex2string(hex: number): string;
    /**
     * Converts a string to a hexadecimal color number.
     * @deprecated since 7.2.0
     * @see PIXI.Color.toNumber
     * @memberof PIXI.utils
     * @function string2hex
     * @param {string} string - The string color (e.g., `"#ffffff"`)
     * @returns {number} Number in hexadecimal.
     */
    export function string2hex(string: string): number;
    /**
     * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
     * @deprecated since 7.2.0
     * @see PIXI.Color.toNumber
     * @memberof PIXI.utils
     * @function rgb2hex
     * @param {number[]} rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
     * @returns {number} Number in hexadecimal.
     */
    export function rgb2hex(rgb: number[] | Float32Array): number;
}
declare module "packages/utils/src/color/premultiply" {
    /**
     * maps premultiply flag and blendMode to adjusted blendMode
     * @memberof PIXI.utils
     * @type {Array<number[]>}
     */
    export const premultiplyBlendMode: number[][];
    /**
     * changes blendMode according to texture format
     * @memberof PIXI.utils
     * @function correctBlendMode
     * @param {number} blendMode - supposed blend mode
     * @param {boolean} premultiplied - whether source is premultiplied
     * @returns {number} true blend mode for this texture
     */
    export function correctBlendMode(blendMode: number, premultiplied: boolean): number;
    /**
     * @memberof PIXI.utils
     * @function premultiplyRgba
     * @deprecated since 7.2.0
     * @see PIXI.Color.premultiply
     * @param {Float32Array|number[]} rgb -
     * @param {number} alpha -
     * @param {Float32Array} [out] -
     * @param {boolean} [premultiply=true] -
     */
    export function premultiplyRgba(rgb: Float32Array | number[], alpha: number, out?: Float32Array, premultiply?: boolean): Float32Array;
    /**
     * @memberof PIXI.utils
     * @function premultiplyTint
     * @deprecated since 7.2.0
     * @see PIXI.Color.toPremultiplied
     * @param {number} tint -
     * @param {number} alpha -
     */
    export function premultiplyTint(tint: number, alpha: number): number;
    /**
     * @memberof PIXI.utils
     * @function premultiplyTintToRgba
     * @deprecated since 7.2.0
     * @see PIXI.Color.premultiply
     * @param {number} tint -
     * @param {number} alpha -
     * @param {Float32Array} [out] -
     * @param {boolean} [premultiply=true] -
     */
    export function premultiplyTintToRgba(tint: number, alpha: number, out?: Float32Array, premultiply?: boolean): Float32Array;
}
declare module "packages/utils/src/const" {
    /**
     * Regexp for data URI.
     * Based on: {@link https://github.com/ragingwind/data-uri-regex}
     * @static
     * @type {RegExp}
     * @memberof PIXI
     * @example
     * import { DATA_URI } from 'pixi.js';
     *
     * DATA_URI.test('data:image/png;base64,foobar'); // => true
     */
    export const DATA_URI: RegExp;
}
declare module "packages/utils/src/data/createIndicesForQuads" {
    /**
     * Generic Mask Stack data structure
     * @memberof PIXI.utils
     * @function createIndicesForQuads
     * @param {number} size - Number of quads
     * @param {Uint16Array|Uint32Array} [outBuffer] - Buffer for output, length has to be `6 * size`
     * @returns {Uint16Array|Uint32Array} - Resulting index buffer
     */
    export function createIndicesForQuads(size: number, outBuffer?: Uint16Array | Uint32Array | null): Uint16Array | Uint32Array;
}
declare module "packages/utils/src/data/getBufferType" {
    import type { ITypedArray } from "packages/core/src/index";
    export function getBufferType(array: ITypedArray): 'Float32Array' | 'Uint32Array' | 'Int32Array' | 'Uint16Array' | 'Uint8Array' | null;
}
declare module "packages/utils/src/data/interleaveTypedArrays" {
    type PackedArray = Float32Array | Uint32Array | Int32Array | Uint8Array;
    export function interleaveTypedArrays(arrays: PackedArray[], sizes: number[]): Float32Array;
}
declare module "packages/utils/src/data/pow2" {
    /**
     * Rounds to next power of two.
     * @function nextPow2
     * @memberof PIXI.utils
     * @param {number} v - input value
     * @returns {number} - next rounded power of two
     */
    export function nextPow2(v: number): number;
    /**
     * Checks if a number is a power of two.
     * @function isPow2
     * @memberof PIXI.utils
     * @param {number} v - input value
     * @returns {boolean} `true` if value is power of two
     */
    export function isPow2(v: number): boolean;
    /**
     * Computes ceil of log base 2
     * @function log2
     * @memberof PIXI.utils
     * @param {number} v - input value
     * @returns {number} logarithm base 2
     */
    export function log2(v: number): number;
}
declare module "packages/utils/src/data/removeItems" {
    /**
     * Remove items from a javascript array without generating garbage
     * @function removeItems
     * @memberof PIXI.utils
     * @param {Array<any>} arr - Array to remove elements from
     * @param {number} startIdx - starting index
     * @param {number} removeCount - how many to remove
     */
    export function removeItems(arr: any[], startIdx: number, removeCount: number): void;
}
declare module "packages/utils/src/data/sign" {
    /**
     * Returns sign of number
     * @memberof PIXI.utils
     * @function sign
     * @param {number} n - the number to check the sign of
     * @returns {number} 0 if `n` is 0, -1 if `n` is negative, 1 if `n` is positive
     */
    export function sign(n: number): -1 | 0 | 1;
}
declare module "packages/utils/src/data/uid" {
    /**
     * Gets the next unique identifier
     * @memberof PIXI.utils
     * @function uid
     * @returns {number} The next unique identifier to use.
     */
    export function uid(): number;
}
declare module "packages/utils/src/media/BoundingBox" {
    /**
     * A rectangular bounding box describing the boundary of an area.
     * @memberof PIXI.utils
     * @since 7.1.0
     */
    export class BoundingBox {
        /** The left coordinate value of the bounding box. */
        left: number;
        /** The top coordinate value of the bounding box. */
        top: number;
        /** The right coordinate value of the bounding box. */
        right: number;
        /** The bottom coordinate value of the bounding box. */
        bottom: number;
        /**
         * @param left - The left coordinate value of the bounding box.
         * @param top - The top coordinate value of the bounding box.
         * @param right - The right coordinate value of the bounding box.
         * @param bottom - The bottom coordinate value of the bounding box.
         */
        constructor(left: number, top: number, right: number, bottom: number);
        /** The width of the bounding box. */
        get width(): number;
        /** The height of the bounding box. */
        get height(): number;
        /** Determines whether the BoundingBox is empty. */
        isEmpty(): boolean;
        /**
         * An empty BoundingBox.
         * @type {PIXI.utils.BoundingBox}
         */
        static readonly EMPTY: BoundingBox;
    }
}
declare module "packages/utils/src/media/caches" {
    import type { BaseTexture, Program, Texture } from "packages/core/src/index";
    /**
     * @todo Describe property usage
     * @static
     * @name ProgramCache
     * @memberof PIXI.utils
     * @type {Record<string, Program>}
     */
    export const ProgramCache: {
        [key: string]: Program;
    };
    /**
     * @todo Describe property usage
     * @static
     * @name TextureCache
     * @memberof PIXI.utils
     * @type {Record<string, Texture>}
     */
    export const TextureCache: {
        [key: string]: Texture;
    };
    /**
     * @todo Describe property usage
     * @static
     * @name BaseTextureCache
     * @memberof PIXI.utils
     * @type {Record<string, BaseTexture>}
     */
    export const BaseTextureCache: {
        [key: string]: BaseTexture;
    };
    /**
     * Destroys all texture in the cache
     * @memberof PIXI.utils
     * @function destroyTextureCache
     */
    export function destroyTextureCache(): void;
    /**
     * Removes all textures from cache, but does not destroy them
     * @memberof PIXI.utils
     * @function clearTextureCache
     */
    export function clearTextureCache(): void;
}
declare module "packages/utils/src/media/CanvasRenderTarget" {
    import type { ICanvas, ICanvasRenderingContext2D } from "packages/settings/src/index";
    /**
     * Creates a Canvas element of the given size to be used as a target for rendering to.
     * @class
     * @memberof PIXI.utils
     */
    export class CanvasRenderTarget {
        protected _canvas: ICanvas | null;
        protected _context: ICanvasRenderingContext2D | null;
        /**
         * The resolution / device pixel ratio of the canvas
         * @default 1
         */
        resolution: number;
        /**
         * @param width - the width for the newly created canvas
         * @param height - the height for the newly created canvas
         * @param {number} [resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the canvas
         */
        constructor(width: number, height: number, resolution?: number);
        /**
         * Clears the canvas that was created by the CanvasRenderTarget class.
         * @private
         */
        clear(): void;
        /**
         * Resizes the canvas to the specified width and height.
         * @param desiredWidth - the desired width of the canvas
         * @param desiredHeight - the desired height of the canvas
         */
        resize(desiredWidth: number, desiredHeight: number): void;
        /** Destroys this canvas. */
        destroy(): void;
        /**
         * The width of the canvas buffer in pixels.
         * @member {number}
         */
        get width(): number;
        set width(val: number);
        /**
         * The height of the canvas buffer in pixels.
         * @member {number}
         */
        get height(): number;
        set height(val: number);
        /** The Canvas object that belongs to this CanvasRenderTarget. */
        get canvas(): ICanvas;
        /** A CanvasRenderingContext2D object representing a two-dimensional rendering context. */
        get context(): ICanvasRenderingContext2D;
        private _checkDestroyed;
    }
}
declare module "packages/utils/src/media/getCanvasBoundingBox" {
    import { BoundingBox } from "packages/utils/src/media/BoundingBox";
    import type { ICanvas } from "packages/settings/src/index";
    /**
     * Measuring the bounds of a canvas' visible (non-transparent) pixels.
     * @memberof PIXI.utils
     * @param {PIXI.ICanvas} canvas - The canvas to measure.
     * @returns {PIXI.utils.BoundingBox} The bounding box of the canvas' visible pixels.
     * @since 7.1.0
     */
    export function getCanvasBoundingBox(canvas: ICanvas): BoundingBox;
}
declare module "packages/utils/src/media/trimCanvas" {
    import type { ICanvas } from "packages/settings/src/index";
    /**
     * Trim transparent borders from a canvas.
     * @memberof PIXI.utils
     * @param {PIXI.ICanvas} canvas - The canvas to trim.
     * @returns The trimmed canvas data.
     */
    export function trimCanvas(canvas: ICanvas): {
        width: number;
        height: number;
        data: ImageData | null;
    };
}
declare module "packages/utils/src/network/decomposeDataUri" {
    export interface DecomposedDataUri {
        mediaType?: string;
        subType?: string;
        charset?: string;
        encoding?: string;
        data?: string;
    }
    /**
     * @memberof PIXI.utils
     * @interface DecomposedDataUri
     */
    /**
     * type, eg. `image`
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} mediaType
     */
    /**
     * Sub type, eg. `png`
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} subType
     */
    /**
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} charset
     */
    /**
     * Data encoding, eg. `base64`
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} encoding
     */
    /**
     * The actual data
     * @memberof PIXI.utils.DecomposedDataUri#
     * @member {string} data
     */
    /**
     * Split a data URI into components. Returns undefined if
     * parameter `dataUri` is not a valid data URI.
     * @memberof PIXI.utils
     * @function decomposeDataUri
     * @param {string} dataUri - the data URI to check
     * @returns {PIXI.utils.DecomposedDataUri|undefined} The decomposed data uri or undefined
     */
    export function decomposeDataUri(dataUri: string): DecomposedDataUri | undefined;
}
declare module "packages/utils/src/network/determineCrossOrigin" {
    /**
     * Sets the `crossOrigin` property for this resource based on if the url
     * for this resource is cross-origin. If crossOrigin was manually set, this
     * function does nothing.
     * Nipped from the resource loader!
     * @ignore
     * @param {string} url - The url to test.
     * @param {object} [loc=window.location] - The location object to test against.
     * @returns {string} The crossOrigin value to use (or empty string for none).
     */
    export function determineCrossOrigin(url: string, loc?: Location): string;
}
declare module "packages/utils/src/network/getResolutionOfUrl" {
    /**
     * get the resolution / device pixel ratio of an asset by looking for the prefix
     * used by spritesheets and image urls
     * @memberof PIXI.utils
     * @function getResolutionOfUrl
     * @param {string} url - the image path
     * @param {number} [defaultValue=1] - the defaultValue if no filename prefix is set.
     * @returns {number} resolution / device pixel ratio of an asset
     */
    export function getResolutionOfUrl(url: string, defaultValue?: number): number;
}
declare module "packages/utils/src/index" {
    /**
     * Generalized convenience utilities for PIXI.
     * @example
     * import { utils } from 'pixi.js';
     * // Extend PIXI's internal Event Emitter.
     * class MyEmitter extends utils.EventEmitter {
     *     constructor() {
     *         super();
     *         console.log('Emitter created!');
     *     }
     * }
     *
     * // Get info on current device
     * console.log(utils.isMobile);
     * @namespace PIXI.utils
     */
    import "packages/utils/src/settings";
    /**
     * A simple JS library that detects mobile devices.
     * @see {@link https://github.com/kaimallea/isMobile}
     * @memberof PIXI.utils
     * @name isMobile
     * @member {object}
     * @property {boolean} any - `true` if current platform is tablet or phone device
     * @property {boolean} tablet - `true` if current platform large-screen tablet device
     * @property {boolean} phone - `true` if current platform small-screen phone device
     * @property {object} apple -
     * @property {boolean} apple.device - `true` if any Apple device
     * @property {boolean} apple.tablet - `true` if any Apple iPad
     * @property {boolean} apple.phone - `true` if any Apple iPhone
     * @property {boolean} apple.ipod - `true` if any iPod
     * @property {object} android -
     * @property {boolean} android.device - `true` if any Android device
     * @property {boolean} android.tablet - `true` if any Android tablet
     * @property {boolean} android.phone - `true` if any Android phone
     * @property {object} amazon -
     * @property {boolean} amazon.device - `true` if any Silk device
     * @property {boolean} amazon.tablet - `true` if any Silk tablet
     * @property {boolean} amazon.phone - `true` if any Silk phone
     * @property {object} windows -
     * @property {boolean} windows.device - `true` if any Windows device
     * @property {boolean} windows.tablet - `true` if any Windows tablet
     * @property {boolean} windows.phone - `true` if any Windows phone
     */
    export { isMobile } from "packages/settings/src/index";
    /**
     * A high performance event emitter
     * @see {@link https://github.com/primus/eventemitter3}
     * @memberof PIXI.utils
     * @class EventEmitter
     */
    export { default as EventEmitter } from 'eventemitter3';
    /**
     * A polygon triangulation library
     * @see {@link https://github.com/mapbox/earcut}
     * @memberof PIXI.utils
     * @method earcut
     * @param {number[]} vertices - A flat array of vertex coordinates
     * @param {number[]} [holes] - An array of hole indices
     * @param {number} [dimensions=2] - The number of coordinates per vertex in the input array
     * @returns {number[]} Triangulated polygon
     */
    export { default as earcut } from 'earcut';
    /**
     * Node.js compatible URL utilities.
     * @see https://www.npmjs.com/package/url
     * @memberof PIXI.utils
     * @name url
     * @member {object}
     * @deprecated since 7.3.0
     */
    export * from "packages/utils/src/url";
    /**
     * Browser and Node.js compatible path utilities.
     * All paths that are passed in will become normalized to have posix separators.
     * @memberof PIXI.utils
     * @name path
     * @member {object}
     */
    export * from "packages/utils/src/path";
    export * from "packages/utils/src/browser/detectVideoAlphaMode";
    export * from "packages/utils/src/browser/hello";
    export * from "packages/utils/src/browser/isWebGLSupported";
    export * from "packages/utils/src/color/hex";
    export * from "packages/utils/src/color/premultiply";
    export * from "packages/utils/src/const";
    export * from "packages/utils/src/data/createIndicesForQuads";
    export * from "packages/utils/src/data/getBufferType";
    export * from "packages/utils/src/data/interleaveTypedArrays";
    export * from "packages/utils/src/data/pow2";
    export * from "packages/utils/src/data/removeItems";
    export * from "packages/utils/src/data/sign";
    export * from "packages/utils/src/data/uid";
    export * from "packages/utils/src/logging/deprecation";
    export * from "packages/utils/src/media/BoundingBox";
    export * from "packages/utils/src/media/caches";
    export * from "packages/utils/src/media/CanvasRenderTarget";
    export * from "packages/utils/src/media/getCanvasBoundingBox";
    export * from "packages/utils/src/media/trimCanvas";
    export * from "packages/utils/src/network/decomposeDataUri";
    export * from "packages/utils/src/network/determineCrossOrigin";
    export * from "packages/utils/src/network/getResolutionOfUrl";
    export * from "packages/utils/src/types/index";
}
declare module "packages/extensions/src/index" {
    /**
     * Collection of valid extension types.
     * @memberof PIXI
     * @property {string} Application - Application plugins
     * @property {string} RendererPlugin - Plugins for Renderer
     * @property {string} CanvasRendererPlugin - Plugins for CanvasRenderer
     * @property {string} Loader - Plugins to use with Loader
     * @property {string} LoadParser - Parsers for Assets loader.
     * @property {string} ResolveParser - Parsers for Assets resolvers.
     * @property {string} CacheParser - Parsers for Assets cache.
     */
    enum ExtensionType {
        Renderer = "renderer",
        Application = "application",
        RendererSystem = "renderer-webgl-system",
        RendererPlugin = "renderer-webgl-plugin",
        CanvasRendererSystem = "renderer-canvas-system",
        CanvasRendererPlugin = "renderer-canvas-plugin",
        Asset = "asset",
        LoadParser = "load-parser",
        ResolveParser = "resolve-parser",
        CacheParser = "cache-parser",
        DetectionParser = "detection-parser"
    }
    interface ExtensionMetadataDetails {
        type: ExtensionType | ExtensionType[];
        name?: string;
        priority?: number;
    }
    type ExtensionMetadata = ExtensionType | ExtensionMetadataDetails;
    /**
     * Format when registering an extension. Generally, the extension
     * should have these values as `extension` static property,
     * but you can override name or type by providing an object.
     * @memberof PIXI
     */
    interface ExtensionFormatLoose {
        /** The extension type, can be multiple types */
        type: ExtensionType | ExtensionType[];
        /** Optional. Some plugins provide an API name/property, such as Renderer plugins */
        name?: string;
        /** Optional, used for sorting the plugins in a particular order */
        priority?: number;
        /** Reference to the plugin object/class */
        ref: any;
    }
    /**
     * Strict extension format that is used internally for registrations.
     * @memberof PIXI
     */
    interface ExtensionFormat extends ExtensionFormatLoose {
        /** The extension type, always expressed as multiple, even if a single */
        type: ExtensionType[];
    }
    type ExtensionHandler = (extension: ExtensionFormat) => void;
    /**
     * Global registration of all PixiJS extensions. One-stop-shop for extensibility.
     * @memberof PIXI
     * @namespace extensions
     */
    const extensions: {
        /** @ignore */
        _addHandlers: Record<ExtensionType, ExtensionHandler>;
        /** @ignore */
        _removeHandlers: Record<ExtensionType, ExtensionHandler>;
        /** @ignore */
        _queue: Record<ExtensionType, ExtensionFormat[]>;
        /**
         * Remove extensions from PixiJS.
         * @param extensions - Extensions to be removed.
         * @returns {PIXI.extensions} For chaining.
         */
        remove(...extensions: Array<ExtensionFormatLoose | any>): any;
        /**
         * Register new extensions with PixiJS.
         * @param extensions - The spread of extensions to add to PixiJS.
         * @returns {PIXI.extensions} For chaining.
         */
        add(...extensions: Array<ExtensionFormatLoose | any>): any;
        /**
         * Internal method to handle extensions by name.
         * @param type - The extension type.
         * @param onAdd  - Function for handling when extensions are added/registered passes {@link PIXI.ExtensionFormat}.
         * @param onRemove  - Function for handling when extensions are removed/unregistered passes {@link PIXI.ExtensionFormat}.
         * @returns {PIXI.extensions} For chaining.
         */
        handle(type: ExtensionType, onAdd: ExtensionHandler, onRemove: ExtensionHandler): any;
        /**
         * Handle a type, but using a map by `name` property.
         * @param type - Type of extension to handle.
         * @param map - The object map of named extensions.
         * @returns {PIXI.extensions} For chaining.
         */
        handleByMap(type: ExtensionType, map: Record<string, any>): any;
        /**
         * Handle a type, but using a list of extensions.
         * @param type - Type of extension to handle.
         * @param list - The list of extensions.
         * @param defaultPriority - The default priority to use if none is specified.
         * @returns {PIXI.extensions} For chaining.
         */
        handleByList(type: ExtensionType, list: any[], defaultPriority?: number): any;
    };
    export { extensions, ExtensionType, };
    export type { ExtensionFormat, ExtensionFormatLoose, ExtensionHandler, ExtensionMetadata, };
}
declare module "packages/runner/src/Runner" {
    /**
     * A Runner is a highly performant and simple alternative to signals. Best used in situations
     * where events are dispatched to many objects at high frequency (say every frame!)
     *
     * Like a signal:
     *
     * ```js
     * import { Runner } from '@pixi/runner';
     *
     * const myObject = {
     *     loaded: new Runner('loaded'),
     * };
     *
     * const listener = {
     *     loaded: function() {
     *         // Do something when loaded
     *     }
     * };
     *
     * myObject.loaded.add(listener);
     *
     * myObject.loaded.emit();
     * ```
     *
     * Or for handling calling the same function on many items:
     *
     * ```js
     * import { Runner } from '@pixi/runner';
     *
     * const myGame = {
     *     update: new Runner('update'),
     * };
     *
     * const gameObject = {
     *     update: function(time) {
     *         // Update my gamey state
     *     },
     * };
     *
     * myGame.update.add(gameObject);
     *
     * myGame.update.emit(time);
     * ```
     * @memberof PIXI
     */
    export class Runner {
        items: any[];
        private _name;
        private _aliasCount;
        /**
         * @param name - The function name that will be executed on the listeners added to this Runner.
         */
        constructor(name: string);
        /**
         * Dispatch/Broadcast Runner to all listeners added to the queue.
         * @param {...any} params - (optional) parameters to pass to each listener
         */
        emit(a0?: unknown, a1?: unknown, a2?: unknown, a3?: unknown, a4?: unknown, a5?: unknown, a6?: unknown, a7?: unknown): this;
        private ensureNonAliasedItems;
        /**
         * Add a listener to the Runner
         *
         * Runners do not need to have scope or functions passed to them.
         * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
         * as the name provided to the Runner when it was created.
         *
         * E.g. A listener passed to this Runner will require a 'complete' function.
         *
         * ```js
         * import { Runner } from '@pixi/runner';
         *
         * const complete = new Runner('complete');
         * ```
         *
         * The scope used will be the object itself.
         * @param {any} item - The object that will be listening.
         */
        add(item: unknown): this;
        /**
         * Remove a single listener from the dispatch queue.
         * @param {any} item - The listener that you would like to remove.
         */
        remove(item: unknown): this;
        /**
         * Check to see if the listener is already in the Runner
         * @param {any} item - The listener that you would like to check.
         */
        contains(item: unknown): boolean;
        /** Remove all listeners from the Runner */
        removeAll(): this;
        /** Remove all references, don't use after this. */
        destroy(): void;
        /**
         * `true` if there are no this Runner contains no listeners
         * @readonly
         */
        get empty(): boolean;
        /**
         * The name of the runner.
         * @readonly
         */
        get name(): string;
    }
}
declare module "packages/runner/src/index" {
    export * from "packages/runner/src/Runner";
}
declare module "packages/core/src/geometry/GLBuffer" {
    export class GLBuffer {
        buffer: WebGLBuffer;
        updateID: number;
        byteLength: number;
        refCount: number;
        constructor(buffer?: WebGLBuffer);
    }
}
declare module "packages/core/src/geometry/Buffer" {
    import { BUFFER_TYPE } from "packages/constants/src/index";
    import { Runner } from "packages/runner/src/index";
    import type { GLBuffer } from "packages/core/src/geometry/GLBuffer";
    /**
     * Marks places in PixiJS where you can pass Float32Array, UInt32Array, any typed arrays, and ArrayBuffer.
     *
     * Same as ArrayBuffer in typescript lib, defined here just for documentation.
     * @memberof PIXI
     */
    export interface IArrayBuffer extends ArrayBuffer {
    }
    /**
     * PixiJS classes use this type instead of ArrayBuffer and typed arrays
     * to support expressions like `geometry.buffers[0].data[0] = position.x`.
     *
     * Gives access to indexing and `length` field.
     * - @popelyshev: If data is actually ArrayBuffer and throws Exception on indexing - its user problem :)
     * @memberof PIXI
     */
    export interface ITypedArray extends IArrayBuffer {
        readonly length: number;
        [index: number]: number;
        readonly BYTES_PER_ELEMENT: number;
    }
    /**
     * A wrapper for data so that it can be used and uploaded by WebGL
     * @memberof PIXI
     */
    export class Buffer {
        /**
         * The data in the buffer, as a typed array
         * @type {PIXI.IArrayBuffer}
         */
        data: ITypedArray;
        /**
         * The type of buffer this is, one of:
         * + ELEMENT_ARRAY_BUFFER - used as an index buffer
         * + ARRAY_BUFFER - used as an attribute buffer
         * + UNIFORM_BUFFER - used as a uniform buffer (if available)
         */
        type: BUFFER_TYPE;
        static: boolean;
        id: number;
        disposeRunner: Runner;
        /**
         * A map of renderer IDs to webgl buffer
         * @private
         * @type {Object<number, GLBuffer>}
         */
        _glBuffers: {
            [key: number]: GLBuffer;
        };
        _updateID: number;
        /**
         * @param {PIXI.IArrayBuffer} data - the data to store in the buffer.
         * @param _static - `true` for static buffer
         * @param index - `true` for index buffer
         */
        constructor(data?: IArrayBuffer, _static?: boolean, index?: boolean);
        /**
         * Flags this buffer as requiring an upload to the GPU.
         * @param {PIXI.IArrayBuffer|number[]} [data] - the data to update in the buffer.
         */
        update(data?: IArrayBuffer | Array<number>): void;
        /** Disposes WebGL resources that are connected to this geometry. */
        dispose(): void;
        /** Destroys the buffer. */
        destroy(): void;
        /**
         * Flags whether this is an index buffer.
         *
         * Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
         * the buffer of type `ARRAY_BUFFER`.
         *
         * For backwards compatibility.
         */
        set index(value: boolean);
        get index(): boolean;
        /**
         * Helper function that creates a buffer based on an array or TypedArray
         * @param {ArrayBufferView | number[]} data - the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array.
         * @returns - A new Buffer based on the data provided.
         */
        static from(data: IArrayBuffer | number[]): Buffer;
    }
}
declare module "packages/core/src/geometry/ViewableBuffer" {
    import type { ITypedArray } from "packages/core/src/geometry/Buffer";
    /**
     * Flexible wrapper around `ArrayBuffer` that also provides typed array views on demand.
     * @memberof PIXI
     */
    export class ViewableBuffer {
        size: number;
        /** Underlying `ArrayBuffer` that holds all the data and is of capacity `this.size`. */
        rawBinaryData: ArrayBuffer;
        /** View on the raw binary data as a `Uint32Array`. */
        uint32View: Uint32Array;
        /** View on the raw binary data as a `Float32Array`. */
        float32View: Float32Array;
        private _int8View;
        private _uint8View;
        private _int16View;
        private _uint16View;
        private _int32View;
        /**
         * @param length - The size of the buffer in bytes.
         */
        constructor(length: number);
        /**
         * @param arrayBuffer - The source array buffer.
         */
        constructor(arrayBuffer: ArrayBuffer);
        /** View on the raw binary data as a `Int8Array`. */
        get int8View(): Int8Array;
        /** View on the raw binary data as a `Uint8Array`. */
        get uint8View(): Uint8Array;
        /**  View on the raw binary data as a `Int16Array`. */
        get int16View(): Int16Array;
        /** View on the raw binary data as a `Uint16Array`. */
        get uint16View(): Uint16Array;
        /** View on the raw binary data as a `Int32Array`. */
        get int32View(): Int32Array;
        /**
         * Returns the view of the given type.
         * @param type - One of `int8`, `uint8`, `int16`,
         *    `uint16`, `int32`, `uint32`, and `float32`.
         * @returns - typed array of given type
         */
        view(type: string): ITypedArray;
        /** Destroys all buffer references. Do not use after calling this. */
        destroy(): void;
        static sizeOf(type: string): number;
    }
}
declare module "packages/math/src/const" {
    /**
     * Two Pi.
     * @static
     * @member {number}
     * @memberof PIXI
     */
    export const PI_2: number;
    /**
     * Conversion factor for converting radians to degrees.
     * @static
     * @member {number} RAD_TO_DEG
     * @memberof PIXI
     */
    export const RAD_TO_DEG: number;
    /**
     * Conversion factor for converting degrees to radians.
     * @static
     * @member {number}
     * @memberof PIXI
     */
    export const DEG_TO_RAD: number;
    /**
     * Constants that identify shapes, mainly to prevent `instanceof` calls.
     * @static
     * @memberof PIXI
     * @enum {number}
     */
    export enum SHAPES {
        /**
         * @property {number} RECT Rectangle
         * @default 0
         */
        POLY = 0,
        /**
         * @property {number} POLY Polygon
         * @default 1
         */
        RECT = 1,
        /**
         * @property {number} CIRC Circle
         * @default 2
         */
        CIRC = 2,
        /**
         * @property {number} ELIP Ellipse
         * @default 3
         */
        ELIP = 3,
        /**
         * @property {number} RREC Rounded Rectangle
         * @default 4
         */
        RREC = 4
    }
}
declare module "packages/math/src/IPointData" {
    export interface IPointData extends GlobalMixins.IPointData {
        x: number;
        y: number;
    }
}
declare module "packages/math/src/IPoint" {
    import type { IPointData } from "packages/math/src/IPointData";
    export interface IPoint extends IPointData {
        copyFrom(p: IPointData): this;
        copyTo<T extends IPoint>(p: T): T;
        equals(p: IPointData): boolean;
        set(x?: number, y?: number): void;
    }
}
declare module "packages/math/src/Point" {
    import type { IPoint } from "packages/math/src/IPoint";
    import type { IPointData } from "packages/math/src/IPointData";
    export interface Point extends GlobalMixins.Point, IPoint {
    }
    /**
     * The Point object represents a location in a two-dimensional coordinate system, where `x` represents
     * the position on the horizontal axis and `y` represents the position on the vertical axis
     * @class
     * @memberof PIXI
     * @implements {IPoint}
     */
    export class Point implements IPoint {
        /** Position of the point on the x axis */
        x: number;
        /** Position of the point on the y axis */
        y: number;
        /**
         * Creates a new `Point`
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=0] - position of the point on the y axis
         */
        constructor(x?: number, y?: number);
        /**
         * Creates a clone of this point
         * @returns A clone of this point
         */
        clone(): Point;
        /**
         * Copies `x` and `y` from the given point into this point
         * @param p - The point to copy from
         * @returns The point instance itself
         */
        copyFrom(p: IPointData): this;
        /**
         * Copies this point's x and y into the given point (`p`).
         * @param p - The point to copy to. Can be any of type that is or extends `IPointData`
         * @returns The point (`p`) with values updated
         */
        copyTo<T extends IPoint>(p: T): T;
        /**
         * Accepts another point (`p`) and returns `true` if the given point is equal to this point
         * @param p - The point to check
         * @returns Returns `true` if both `x` and `y` are equal
         */
        equals(p: IPointData): boolean;
        /**
         * Sets the point to a new `x` and `y` position.
         * If `y` is omitted, both `x` and `y` will be set to `x`.
         * @param {number} [x=0] - position of the point on the `x` axis
         * @param {number} [y=x] - position of the point on the `y` axis
         * @returns The point instance itself
         */
        set(x?: number, y?: number): this;
        toString(): string;
    }
}
declare module "packages/math/src/ObservablePoint" {
    import type { IPoint } from "packages/math/src/IPoint";
    import type { IPointData } from "packages/math/src/IPointData";
    export interface ObservablePoint extends GlobalMixins.Point, IPoint {
    }
    /**
     * The ObservablePoint object represents a location in a two-dimensional coordinate system, where `x` represents
     * the position on the horizontal axis and `y` represents the position on the vertical axis.
     *
     * An `ObservablePoint` is a point that triggers a callback when the point's position is changed.
     * @memberof PIXI
     */
    export class ObservablePoint<T = any> implements IPoint {
        /** The callback function triggered when `x` and/or `y` are changed */
        cb: (this: T) => any;
        /** The owner of the callback */
        scope: any;
        _x: number;
        _y: number;
        /**
         * Creates a new `ObservablePoint`
         * @param cb - callback function triggered when `x` and/or `y` are changed
         * @param scope - owner of callback
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=0] - position of the point on the y axis
         */
        constructor(cb: (this: T) => any, scope: T, x?: number, y?: number);
        /**
         * Creates a clone of this point.
         * The callback and scope params can be overridden otherwise they will default
         * to the clone object's values.
         * @override
         * @param cb - The callback function triggered when `x` and/or `y` are changed
         * @param scope - The owner of the callback
         * @returns a copy of this observable point
         */
        clone(cb?: (this: T) => any, scope?: any): ObservablePoint;
        /**
         * Sets the point to a new `x` and `y` position.
         * If `y` is omitted, both `x` and `y` will be set to `x`.
         * @param {number} [x=0] - position of the point on the x axis
         * @param {number} [y=x] - position of the point on the y axis
         * @returns The observable point instance itself
         */
        set(x?: number, y?: number): this;
        /**
         * Copies x and y from the given point (`p`)
         * @param p - The point to copy from. Can be any of type that is or extends `IPointData`
         * @returns The observable point instance itself
         */
        copyFrom(p: IPointData): this;
        /**
         * Copies this point's x and y into that of the given point (`p`)
         * @param p - The point to copy to. Can be any of type that is or extends `IPointData`
         * @returns The point (`p`) with values updated
         */
        copyTo<T extends IPoint>(p: T): T;
        /**
         * Accepts another point (`p`) and returns `true` if the given point is equal to this point
         * @param p - The point to check
         * @returns Returns `true` if both `x` and `y` are equal
         */
        equals(p: IPointData): boolean;
        toString(): string;
        /** Position of the observable point on the x axis. */
        get x(): number;
        set x(value: number);
        /** Position of the observable point on the y axis. */
        get y(): number;
        set y(value: number);
    }
}
declare module "packages/math/src/Transform" {
    import { Matrix } from "packages/math/src/Matrix";
    import { ObservablePoint } from "packages/math/src/ObservablePoint";
    export interface Transform extends GlobalMixins.Transform {
    }
    /**
     * Transform that takes care about its versions.
     * @memberof PIXI
     */
    export class Transform {
        /**
         * A default (identity) transform.
         * @static
         * @type {PIXI.Transform}
         */
        static readonly IDENTITY: Transform;
        /** The world transformation matrix. */
        worldTransform: Matrix;
        /** The local transformation matrix. */
        localTransform: Matrix;
        /** The coordinate of the object relative to the local coordinates of the parent. */
        position: ObservablePoint;
        /** The scale factor of the object. */
        scale: ObservablePoint;
        /** The pivot point of the displayObject that it rotates around. */
        pivot: ObservablePoint;
        /** The skew amount, on the x and y axis. */
        skew: ObservablePoint;
        /** The locally unique ID of the parent's world transform used to calculate the current world transformation matrix. */
        _parentID: number;
        /** The locally unique ID of the world transform. */
        _worldID: number;
        /** The rotation amount. */
        protected _rotation: number;
        /**
         * The X-coordinate value of the normalized local X axis,
         * the first column of the local transformation matrix without a scale.
         */
        protected _cx: number;
        /**
         * The Y-coordinate value of the normalized local X axis,
         * the first column of the local transformation matrix without a scale.
         */
        protected _sx: number;
        /**
         * The X-coordinate value of the normalized local Y axis,
         * the second column of the local transformation matrix without a scale.
         */
        protected _cy: number;
        /**
         * The Y-coordinate value of the normalized local Y axis,
         * the second column of the local transformation matrix without a scale.
         */
        protected _sy: number;
        /** The locally unique ID of the local transform. */
        protected _localID: number;
        /** The locally unique ID of the local transform used to calculate the current local transformation matrix. */
        protected _currentLocalID: number;
        constructor();
        /** Called when a value changes. */
        protected onChange(): void;
        /** Called when the skew or the rotation changes. */
        protected updateSkew(): void;
        toString(): string;
        /** Updates the local transformation matrix. */
        updateLocalTransform(): void;
        /**
         * Updates the local and the world transformation matrices.
         * @param parentTransform - The parent transform
         */
        updateTransform(parentTransform: Transform): void;
        /**
         * Decomposes a matrix and sets the transforms properties based on it.
         * @param matrix - The matrix to decompose
         */
        setFromMatrix(matrix: Matrix): void;
        /** The rotation of the object in radians. */
        get rotation(): number;
        set rotation(value: number);
    }
}
declare module "packages/math/src/Matrix" {
    import { Point } from "packages/math/src/Point";
    import type { IPointData } from "packages/math/src/IPointData";
    import type { Transform } from "packages/math/src/Transform";
    /**
     * The PixiJS Matrix as a class makes it a lot faster.
     *
     * Here is a representation of it:
     * ```
     * | a | c | tx|
     * | b | d | ty|
     * | 0 | 0 | 1 |
     * ```
     * @memberof PIXI
     */
    export class Matrix {
        /** @default 1 */
        a: number;
        /** @default 0 */
        b: number;
        /** @default 0 */
        c: number;
        /** @default 1 */
        d: number;
        /** @default 0 */
        tx: number;
        /** @default 0 */
        ty: number;
        array: Float32Array | null;
        /**
         * @param a - x scale
         * @param b - y skew
         * @param c - x skew
         * @param d - y scale
         * @param tx - x translation
         * @param ty - y translation
         */
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
         * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
         *
         * a = array[0]
         * b = array[1]
         * c = array[3]
         * d = array[4]
         * tx = array[2]
         * ty = array[5]
         * @param array - The array that the matrix will be populated from.
         */
        fromArray(array: number[]): void;
        /**
         * Sets the matrix properties.
         * @param a - Matrix component
         * @param b - Matrix component
         * @param c - Matrix component
         * @param d - Matrix component
         * @param tx - Matrix component
         * @param ty - Matrix component
         * @returns This matrix. Good for chaining method calls.
         */
        set(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
        /**
         * Creates an array from the current Matrix object.
         * @param transpose - Whether we need to transpose the matrix or not
         * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
         * @returns The newly created array which contains the matrix
         */
        toArray(transpose: boolean, out?: Float32Array): Float32Array;
        /**
         * Get a new position with the current transformation applied.
         * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
         * @param pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @returns {PIXI.Point} The new point, transformed through this matrix
         */
        apply<P extends IPointData = Point>(pos: IPointData, newPos?: P): P;
        /**
         * Get a new position with the inverse of the current transformation applied.
         * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
         * @param pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @returns {PIXI.Point} The new point, inverse-transformed through this matrix
         */
        applyInverse<P extends IPointData = Point>(pos: IPointData, newPos?: P): P;
        /**
         * Translates the matrix on the x and y.
         * @param x - How much to translate x by
         * @param y - How much to translate y by
         * @returns This matrix. Good for chaining method calls.
         */
        translate(x: number, y: number): this;
        /**
         * Applies a scale transformation to the matrix.
         * @param x - The amount to scale horizontally
         * @param y - The amount to scale vertically
         * @returns This matrix. Good for chaining method calls.
         */
        scale(x: number, y: number): this;
        /**
         * Applies a rotation transformation to the matrix.
         * @param angle - The angle in radians.
         * @returns This matrix. Good for chaining method calls.
         */
        rotate(angle: number): this;
        /**
         * Appends the given Matrix to this Matrix.
         * @param matrix - The matrix to append.
         * @returns This matrix. Good for chaining method calls.
         */
        append(matrix: Matrix): this;
        /**
         * Sets the matrix based on all the available properties
         * @param x - Position on the x axis
         * @param y - Position on the y axis
         * @param pivotX - Pivot on the x axis
         * @param pivotY - Pivot on the y axis
         * @param scaleX - Scale on the x axis
         * @param scaleY - Scale on the y axis
         * @param rotation - Rotation in radians
         * @param skewX - Skew on the x axis
         * @param skewY - Skew on the y axis
         * @returns This matrix. Good for chaining method calls.
         */
        setTransform(x: number, y: number, pivotX: number, pivotY: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number): this;
        /**
         * Prepends the given Matrix to this Matrix.
         * @param matrix - The matrix to prepend
         * @returns This matrix. Good for chaining method calls.
         */
        prepend(matrix: Matrix): this;
        /**
         * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
         * @param transform - The transform to apply the properties to.
         * @returns The transform with the newly applied properties
         */
        decompose(transform: Transform): Transform;
        /**
         * Inverts this matrix
         * @returns This matrix. Good for chaining method calls.
         */
        invert(): this;
        /**
         * Resets this Matrix to an identity (default) matrix.
         * @returns This matrix. Good for chaining method calls.
         */
        identity(): this;
        /**
         * Creates a new Matrix object with the same values as this one.
         * @returns A copy of this matrix. Good for chaining method calls.
         */
        clone(): Matrix;
        /**
         * Changes the values of the given matrix to be the same as the ones in this matrix
         * @param matrix - The matrix to copy to.
         * @returns The matrix given in parameter with its values updated.
         */
        copyTo(matrix: Matrix): Matrix;
        /**
         * Changes the values of the matrix to be the same as the ones in given matrix
         * @param {PIXI.Matrix} matrix - The matrix to copy from.
         * @returns {PIXI.Matrix} this
         */
        copyFrom(matrix: Matrix): this;
        toString(): string;
        /**
         * A default (identity) matrix
         * @readonly
         */
        static get IDENTITY(): Matrix;
        /**
         * A temp matrix
         * @readonly
         */
        static get TEMP_MATRIX(): Matrix;
    }
}
declare module "packages/math/src/shapes/Rectangle" {
    import { SHAPES } from "packages/math/src/const";
    import type { Matrix } from "packages/math/src/Matrix";
    export interface Rectangle extends GlobalMixins.Rectangle {
    }
    /**
     * Size object, contains width and height
     * @memberof PIXI
     * @typedef {object} ISize
     * @property {number} width - Width component
     * @property {number} height - Height component
     */
    /**
     * Rectangle object is an area defined by its position, as indicated by its top-left corner
     * point (x, y) and by its width and its height.
     * @memberof PIXI
     */
    export class Rectangle {
        /** @default 0 */
        x: number;
        /** @default 0 */
        y: number;
        /** @default 0 */
        width: number;
        /** @default 0 */
        height: number;
        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         * @default PIXI.SHAPES.RECT
         * @see PIXI.SHAPES
         */
        readonly type: SHAPES.RECT;
        /**
         * @param x - The X coordinate of the upper-left corner of the rectangle
         * @param y - The Y coordinate of the upper-left corner of the rectangle
         * @param width - The overall width of the rectangle
         * @param height - The overall height of the rectangle
         */
        constructor(x?: string | number, y?: string | number, width?: string | number, height?: string | number);
        /** Returns the left edge of the rectangle. */
        get left(): number;
        /** Returns the right edge of the rectangle. */
        get right(): number;
        /** Returns the top edge of the rectangle. */
        get top(): number;
        /** Returns the bottom edge of the rectangle. */
        get bottom(): number;
        /** A constant empty rectangle. */
        static get EMPTY(): Rectangle;
        /**
         * Creates a clone of this Rectangle
         * @returns a copy of the rectangle
         */
        clone(): Rectangle;
        /**
         * Copies another rectangle to this one.
         * @param rectangle - The rectangle to copy from.
         * @returns Returns itself.
         */
        copyFrom(rectangle: Rectangle): Rectangle;
        /**
         * Copies this rectangle to another one.
         * @param rectangle - The rectangle to copy to.
         * @returns Returns given parameter.
         */
        copyTo(rectangle: Rectangle): Rectangle;
        /**
         * Checks whether the x and y coordinates given are contained within this Rectangle
         * @param x - The X coordinate of the point to test
         * @param y - The Y coordinate of the point to test
         * @returns Whether the x/y coordinates are within this Rectangle
         */
        contains(x: number, y: number): boolean;
        /**
         * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
         * Returns true only if the area of the intersection is >0, this means that Rectangles
         * sharing a side are not overlapping. Another side effect is that an arealess rectangle
         * (width or height equal to zero) can't intersect any other rectangle.
         * @param {Rectangle} other - The Rectangle to intersect with `this`.
         * @param {Matrix} transform - The transformation matrix of `other`.
         * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
         */
        intersects(other: Rectangle, transform?: Matrix): boolean;
        /**
         * Pads the rectangle making it grow in all directions.
         * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
         * @param paddingX - The horizontal padding amount.
         * @param paddingY - The vertical padding amount.
         * @returns Returns itself.
         */
        pad(paddingX?: number, paddingY?: number): this;
        /**
         * Fits this rectangle around the passed one.
         * @param rectangle - The rectangle to fit.
         * @returns Returns itself.
         */
        fit(rectangle: Rectangle): this;
        /**
         * Enlarges rectangle that way its corners lie on grid
         * @param resolution - resolution
         * @param eps - precision
         * @returns Returns itself.
         */
        ceil(resolution?: number, eps?: number): this;
        /**
         * Enlarges this rectangle to include the passed rectangle.
         * @param rectangle - The rectangle to include.
         * @returns Returns itself.
         */
        enlarge(rectangle: Rectangle): this;
        toString(): string;
    }
}
declare module "packages/math/src/shapes/Circle" {
    import { SHAPES } from "packages/math/src/const";
    import { Rectangle } from "packages/math/src/shapes/Rectangle";
    /**
     * The Circle object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
     * @memberof PIXI
     */
    export class Circle {
        /** @default 0 */
        x: number;
        /** @default 0 */
        y: number;
        /** @default 0 */
        radius: number;
        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         * @default PIXI.SHAPES.CIRC
         * @see PIXI.SHAPES
         */
        readonly type: SHAPES.CIRC;
        /**
         * @param x - The X coordinate of the center of this circle
         * @param y - The Y coordinate of the center of this circle
         * @param radius - The radius of the circle
         */
        constructor(x?: number, y?: number, radius?: number);
        /**
         * Creates a clone of this Circle instance
         * @returns A copy of the Circle
         */
        clone(): Circle;
        /**
         * Checks whether the x and y coordinates given are contained within this circle
         * @param x - The X coordinate of the point to test
         * @param y - The Y coordinate of the point to test
         * @returns Whether the x/y coordinates are within this Circle
         */
        contains(x: number, y: number): boolean;
        /**
         * Returns the framing rectangle of the circle as a Rectangle object
         * @returns The framing rectangle
         */
        getBounds(): Rectangle;
        toString(): string;
    }
}
declare module "packages/math/src/shapes/Ellipse" {
    import { SHAPES } from "packages/math/src/const";
    import { Rectangle } from "packages/math/src/shapes/Rectangle";
    /**
     * The Ellipse object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
     * @memberof PIXI
     */
    export class Ellipse {
        /** @default 0 */
        x: number;
        /** @default 0 */
        y: number;
        /** @default 0 */
        width: number;
        /** @default 0 */
        height: number;
        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         * @default PIXI.SHAPES.ELIP
         * @see PIXI.SHAPES
         */
        readonly type: SHAPES.ELIP;
        /**
         * @param x - The X coordinate of the center of this ellipse
         * @param y - The Y coordinate of the center of this ellipse
         * @param halfWidth - The half width of this ellipse
         * @param halfHeight - The half height of this ellipse
         */
        constructor(x?: number, y?: number, halfWidth?: number, halfHeight?: number);
        /**
         * Creates a clone of this Ellipse instance
         * @returns {PIXI.Ellipse} A copy of the ellipse
         */
        clone(): Ellipse;
        /**
         * Checks whether the x and y coordinates given are contained within this ellipse
         * @param x - The X coordinate of the point to test
         * @param y - The Y coordinate of the point to test
         * @returns Whether the x/y coords are within this ellipse
         */
        contains(x: number, y: number): boolean;
        /**
         * Returns the framing rectangle of the ellipse as a Rectangle object
         * @returns The framing rectangle
         */
        getBounds(): Rectangle;
        toString(): string;
    }
}
declare module "packages/math/src/shapes/Polygon" {
    import { SHAPES } from "packages/math/src/const";
    import type { IPointData } from "packages/math/src/IPointData";
    /**
     * A class to define a shape via user defined coordinates.
     * @memberof PIXI
     */
    export class Polygon {
        /** An array of the points of this polygon. */
        points: number[];
        /** `false` after moveTo, `true` after `closePath`. In all other cases it is `true`. */
        closeStroke: boolean;
        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         * @default PIXI.SHAPES.POLY
         * @see PIXI.SHAPES
         */
        readonly type: SHAPES.POLY;
        constructor(points: IPointData[] | number[]);
        constructor(...points: IPointData[] | number[]);
        /**
         * Creates a clone of this polygon.
         * @returns - A copy of the polygon.
         */
        clone(): Polygon;
        /**
         * Checks whether the x and y coordinates passed to this function are contained within this polygon.
         * @param x - The X coordinate of the point to test.
         * @param y - The Y coordinate of the point to test.
         * @returns - Whether the x/y coordinates are within this polygon.
         */
        contains(x: number, y: number): boolean;
        toString(): string;
    }
}
declare module "packages/math/src/shapes/RoundedRectangle" {
    import { SHAPES } from "packages/math/src/const";
    /**
     * The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
     * top-left corner point (x, y) and by its width and its height and its radius.
     * @memberof PIXI
     */
    export class RoundedRectangle {
        /** @default 0 */
        x: number;
        /** @default 0 */
        y: number;
        /** @default 0 */
        width: number;
        /** @default 0 */
        height: number;
        /** @default 20 */
        radius: number;
        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         * @default PIXI.SHAPES.RREC
         * @see PIXI.SHAPES
         */
        readonly type: SHAPES.RREC;
        /**
         * @param x - The X coordinate of the upper-left corner of the rounded rectangle
         * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
         * @param width - The overall width of this rounded rectangle
         * @param height - The overall height of this rounded rectangle
         * @param radius - Controls the radius of the rounded corners
         */
        constructor(x?: number, y?: number, width?: number, height?: number, radius?: number);
        /**
         * Creates a clone of this Rounded Rectangle.
         * @returns - A copy of the rounded rectangle.
         */
        clone(): RoundedRectangle;
        /**
         * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
         * @param x - The X coordinate of the point to test.
         * @param y - The Y coordinate of the point to test.
         * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
         */
        contains(x: number, y: number): boolean;
        toString(): string;
    }
}
declare module "packages/math/src/groupD8" {
    import { Matrix } from "packages/math/src/Matrix";
    type GD8Symmetry = number;
    /**
     * @memberof PIXI
     * @typedef {number} GD8Symmetry
     * @see PIXI.groupD8
     */
    /**
     * Implements the dihedral group D8, which is similar to
     * [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html};
     * D8 is the same but with diagonals, and it is used for texture
     * rotations.
     *
     * The directions the U- and V- axes after rotation
     * of an angle of `a: GD8Constant` are the vectors `(uX(a), uY(a))`
     * and `(vX(a), vY(a))`. These aren't necessarily unit vectors.
     *
     * **Origin:**
     *  This is the small part of gameofbombs.com portal system. It works.
     * @see PIXI.groupD8.E
     * @see PIXI.groupD8.SE
     * @see PIXI.groupD8.S
     * @see PIXI.groupD8.SW
     * @see PIXI.groupD8.W
     * @see PIXI.groupD8.NW
     * @see PIXI.groupD8.N
     * @see PIXI.groupD8.NE
     * @author Ivan @ivanpopelyshev
     * @namespace PIXI.groupD8
     * @memberof PIXI
     */
    export const groupD8: {
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 0°       | East      |
         * @readonly
         */
        E: number;
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 45°↻     | Southeast |
         * @readonly
         */
        SE: number;
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 90°↻     | South     |
         * @readonly
         */
        S: number;
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 135°↻    | Southwest |
         * @readonly
         */
        SW: number;
        /**
         * | Rotation | Direction |
         * |----------|-----------|
         * | 180°     | West      |
         * @readonly
         */
        W: number;
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -135°/225°↻ | Northwest    |
         * @readonly
         */
        NW: number;
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -90°/270°↻  | North        |
         * @readonly
         */
        N: number;
        /**
         * | Rotation    | Direction    |
         * |-------------|--------------|
         * | -45°/315°↻  | Northeast    |
         * @readonly
         */
        NE: number;
        /**
         * Reflection about Y-axis.
         * @readonly
         */
        MIRROR_VERTICAL: number;
        /**
         * Reflection about the main diagonal.
         * @readonly
         */
        MAIN_DIAGONAL: number;
        /**
         * Reflection about X-axis.
         * @readonly
         */
        MIRROR_HORIZONTAL: number;
        /**
         * Reflection about reverse diagonal.
         * @readonly
         */
        REVERSE_DIAGONAL: number;
        /**
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @returns {PIXI.GD8Symmetry} The X-component of the U-axis
         *    after rotating the axes.
         */
        uX: (ind: GD8Symmetry) => GD8Symmetry;
        /**
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @returns {PIXI.GD8Symmetry} The Y-component of the U-axis
         *    after rotating the axes.
         */
        uY: (ind: GD8Symmetry) => GD8Symmetry;
        /**
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @returns {PIXI.GD8Symmetry} The X-component of the V-axis
         *    after rotating the axes.
         */
        vX: (ind: GD8Symmetry) => GD8Symmetry;
        /**
         * @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
         * @returns {PIXI.GD8Symmetry} The Y-component of the V-axis
         *    after rotating the axes.
         */
        vY: (ind: GD8Symmetry) => GD8Symmetry;
        /**
         * @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
         *   is needed. Only rotations have opposite symmetries while
         *   reflections don't.
         * @returns {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
         */
        inv: (rotation: GD8Symmetry) => GD8Symmetry;
        /**
         * Composes the two D8 operations.
         *
         * Taking `^` as reflection:
         *
         * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
         * |-------|-----|-----|-----|-----|------|-------|-------|-------|
         * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
         * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
         * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
         * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
         * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
         * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
         * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
         * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
         *
         * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
         * @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
         *   is the row in the above cayley table.
         * @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
         *   is the column in the above cayley table.
         * @returns {PIXI.GD8Symmetry} Composed operation
         */
        add: (rotationSecond: GD8Symmetry, rotationFirst: GD8Symmetry) => GD8Symmetry;
        /**
         * Reverse of `add`.
         * @param {PIXI.GD8Symmetry} rotationSecond - Second operation
         * @param {PIXI.GD8Symmetry} rotationFirst - First operation
         * @returns {PIXI.GD8Symmetry} Result
         */
        sub: (rotationSecond: GD8Symmetry, rotationFirst: GD8Symmetry) => GD8Symmetry;
        /**
         * Adds 180 degrees to rotation, which is a commutative
         * operation.
         * @param {number} rotation - The number to rotate.
         * @returns {number} Rotated number
         */
        rotate180: (rotation: number) => number;
        /**
         * Checks if the rotation angle is vertical, i.e. south
         * or north. It doesn't work for reflections.
         * @param {PIXI.GD8Symmetry} rotation - The number to check.
         * @returns {boolean} Whether or not the direction is vertical
         */
        isVertical: (rotation: GD8Symmetry) => boolean;
        /**
         * Approximates the vector `V(dx,dy)` into one of the
         * eight directions provided by `groupD8`.
         * @param {number} dx - X-component of the vector
         * @param {number} dy - Y-component of the vector
         * @returns {PIXI.GD8Symmetry} Approximation of the vector into
         *  one of the eight symmetries.
         */
        byDirection: (dx: number, dy: number) => GD8Symmetry;
        /**
         * Helps sprite to compensate texture packer rotation.
         * @param {PIXI.Matrix} matrix - sprite world matrix
         * @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
         * @param {number} tx - sprite anchoring
         * @param {number} ty - sprite anchoring
         */
        matrixAppendRotationInv: (matrix: Matrix, rotation: GD8Symmetry, tx?: number, ty?: number) => void;
    };
}
declare module "packages/math/src/index" {
    import { Circle } from "packages/math/src/shapes/Circle";
    import { Ellipse } from "packages/math/src/shapes/Ellipse";
    import { Polygon } from "packages/math/src/shapes/Polygon";
    import { Rectangle } from "packages/math/src/shapes/Rectangle";
    import { RoundedRectangle } from "packages/math/src/shapes/RoundedRectangle";
    export * from "packages/math/src/groupD8";
    export * from "packages/math/src/IPoint";
    export * from "packages/math/src/IPointData";
    export * from "packages/math/src/Matrix";
    export * from "packages/math/src/ObservablePoint";
    export * from "packages/math/src/Point";
    export * from "packages/math/src/Transform";
    export { Circle };
    export { Ellipse };
    export { Polygon };
    export { Rectangle };
    export { RoundedRectangle };
    export * from "packages/math/src/const";
    /**
     * Complex shape type
     * @memberof PIXI
     */
    export type IShape = Circle | Ellipse | Polygon | Rectangle | RoundedRectangle;
    /**
     * @memberof PIXI
     */
    export interface ISize {
        width: number;
        height: number;
    }
}
declare module "packages/core/src/shader/utils/compileShader" {
    /**
     * @private
     * @param {WebGLRenderingContext} gl - The current WebGL context {WebGLProgram}
     * @param {number} type - the type, can be either VERTEX_SHADER or FRAGMENT_SHADER
     * @param {string} src - The vertex shader source as an array of strings.
     * @returns {WebGLShader} the shader
     */
    export function compileShader(gl: WebGLRenderingContextBase, type: number, src: string): WebGLShader;
}
declare module "packages/core/src/shader/utils/defaultValue" {
    /**
     * @method defaultValue
     * @memberof PIXI.glCore.shader
     * @param {string} type - Type of value
     * @param {number} size
     * @private
     */
    export function defaultValue(type: string, size: number): number | Float32Array | Int32Array | Uint32Array | boolean | boolean[];
}
declare module "packages/core/src/shader/utils/uniformParsers" {
    export interface IUniformParser {
        test(data: unknown, uniform: any): boolean;
        code(name: string, uniform: any): string;
        codeUbo?(name: string, uniform: any): string;
    }
    export const uniformParsers: IUniformParser[];
}
declare module "packages/core/src/shader/utils/generateUniformsSync" {
    import type { Dict } from "packages/utils/src/index";
    import type { UniformGroup } from "packages/core/src/shader/UniformGroup";
    export type UniformsSyncCallback = (...args: any[]) => void;
    export function generateUniformsSync(group: UniformGroup, uniformData: Dict<any>): UniformsSyncCallback;
}
declare module "packages/core/src/shader/utils/getTestContext" {
    /**
     * returns a little WebGL context to use for program inspection.
     * @static
     * @private
     * @returns {WebGLRenderingContext} a gl context to test with
     */
    export function getTestContext(): WebGLRenderingContext | WebGL2RenderingContext;
}
declare module "packages/core/src/shader/utils/getMaxFragmentPrecision" {
    import { PRECISION } from "packages/constants/src/index";
    export function getMaxFragmentPrecision(): PRECISION;
}
declare module "packages/core/src/shader/utils/logProgramError" {
    /**
     *
     * logs out any program errors
     * @param gl - The current WebGL context
     * @param program - the WebGL program to display errors for
     * @param vertexShader  - the fragment WebGL shader program
     * @param fragmentShader - the vertex WebGL shader program
     */
    export function logProgramError(gl: WebGLRenderingContext, program: WebGLProgram, vertexShader: WebGLShader, fragmentShader: WebGLShader): void;
}
declare module "packages/core/src/shader/utils/mapSize" {
    /**
     * @private
     * @method mapSize
     * @memberof PIXI.glCore.shader
     * @param {string} type
     */
    export function mapSize(type: string): number;
}
declare module "packages/core/src/shader/utils/mapType" {
    export function mapType(gl: any, type: number): string;
}
declare module "packages/core/src/shader/utils/setPrecision" {
    import { PRECISION } from "packages/constants/src/index";
    /**
     * Sets the float precision on the shader, ensuring the device supports the request precision.
     * If the precision is already present, it just ensures that the device is able to handle it.
     * @private
     * @param {string} src - The shader source
     * @param {PIXI.PRECISION} requestedPrecision - The request float precision of the shader.
     * @param {PIXI.PRECISION} maxSupportedPrecision - The maximum precision the shader supports.
     * @returns {string} modified shader source
     */
    export function setPrecision(src: string, requestedPrecision: PRECISION, maxSupportedPrecision: PRECISION): string;
}
declare module "packages/core/src/shader/utils/unsafeEvalSupported" {
    /**
     * Not all platforms allow to generate function code (e.g., `new Function`).
     * this provides the platform-level detection.
     * @private
     * @returns {boolean} `true` if `new Function` is supported.
     */
    export function unsafeEvalSupported(): boolean;
}
declare module "packages/core/src/shader/utils/index" {
    /**
     * @namespace PIXI.glCore
     * @private
     */
    /**
     * @namespace PIXI.glCore.shader
     * @private
     */
    export * from "packages/core/src/shader/utils/checkMaxIfStatementsInShader";
    export * from "packages/core/src/shader/utils/compileShader";
    export * from "packages/core/src/shader/utils/defaultValue";
    export * from "packages/core/src/shader/utils/generateUniformsSync";
    export * from "packages/core/src/shader/utils/getMaxFragmentPrecision";
    export * from "packages/core/src/shader/utils/getTestContext";
    export * from "packages/core/src/shader/utils/logProgramError";
    export * from "packages/core/src/shader/utils/mapSize";
    export * from "packages/core/src/shader/utils/mapType";
    export * from "packages/core/src/shader/utils/setPrecision";
    export * from "packages/core/src/shader/utils/uniformParsers";
    export * from "packages/core/src/shader/utils/unsafeEvalSupported";
}
declare module "packages/core/src/shader/UniformGroup" {
    import { Buffer } from "packages/core/src/geometry/Buffer";
    import type { Dict } from "packages/utils/src/index";
    import type { UniformsSyncCallback } from "packages/core/src/shader/utils/index";
    /**
     * Uniform group holds uniform map and some ID's for work
     *
     * `UniformGroup` has two modes:
     *
     * 1: Normal mode
     * Normal mode will upload the uniforms with individual function calls as required
     *
     * 2: Uniform buffer mode
     * This mode will treat the uniforms as a uniform buffer. You can pass in either a buffer that you manually handle, or
     * or a generic object that PixiJS will automatically map to a buffer for you.
     * For maximum benefits, make Ubo UniformGroups static, and only update them each frame.
     *
     * Rules of UBOs:
     * - UBOs only work with WebGL2, so make sure you have a fallback!
     * - Only floats are supported (including vec[2,3,4], mat[2,3,4])
     * - Samplers cannot be used in ubo's (a GPU limitation)
     * - You must ensure that the object you pass in exactly matches in the shader ubo structure.
     * Otherwise, weirdness will ensue!
     * - The name of the ubo object added to the group must match exactly the name of the ubo in the shader.
     *
     * ```glsl
     * // UBO in shader:
     * uniform myCoolData { // Declaring a UBO...
     *     mat4 uCoolMatrix;
     *     float uFloatyMcFloatFace;
     * };
     * ```
     *
     * ```js
     * // A new Uniform Buffer Object...
     * const myCoolData = new UniformBufferGroup({
     *     uCoolMatrix: new Matrix(),
     *     uFloatyMcFloatFace: 23,
     * }}
     *
     * // Build a shader...
     * const shader = Shader.from(srcVert, srcFrag, {
     *     myCoolData // Name matches the UBO name in the shader. Will be processed accordingly.
     * })
     *
     *  ```
     * @memberof PIXI
     */
    export class UniformGroup<LAYOUT = Dict<any>> {
        /**
         * Uniform values
         * @member {object}
         */
        readonly uniforms: LAYOUT;
        /**
         * Its a group and not a single uniforms.
         * @default true
         */
        readonly group: boolean;
        /**
         * unique id
         * @protected
         */
        id: number;
        syncUniforms: Dict<UniformsSyncCallback>;
        /**
         * Dirty version
         * @protected
         */
        dirtyId: number;
        /** Flag for if uniforms wont be changed after creation. */
        static: boolean;
        /** Flags whether this group is treated like a uniform buffer object. */
        ubo: boolean;
        buffer?: Buffer;
        autoManage: boolean;
        /**
         * @param {object | Buffer} [uniforms] - Custom uniforms to use to augment the built-in ones. Or a pixi buffer.
         * @param isStatic - Uniforms wont be changed after creation.
         * @param isUbo - If true, will treat this uniform group as a uniform buffer object.
         */
        constructor(uniforms: LAYOUT | Buffer, isStatic?: boolean, isUbo?: boolean);
        update(): void;
        add(name: string, uniforms: Dict<any>, _static?: boolean): void;
        static from(uniforms: Dict<any> | Buffer, _static?: boolean, _ubo?: boolean): UniformGroup;
        /**
         * A short hand function for creating a static UBO UniformGroup.
         * @param uniforms - the ubo item
         * @param _static - should this be updated each time it is used? defaults to true here!
         */
        static uboFrom(uniforms: Dict<any> | Buffer, _static?: boolean): UniformGroup;
    }
}
declare module "packages/core/src/system/SystemManager" {
    import { Runner } from "packages/runner/src/index";
    import { EventEmitter } from "packages/utils/src/index";
    import type { IRenderer } from "packages/core/src/IRenderer";
    import type { ISystemConstructor } from "packages/core/src/system/ISystem";
    interface ISystemConfig<R> {
        runners: string[];
        systems: Record<string, ISystemConstructor<R>>;
        priority: string[];
    }
    /**
     * The SystemManager is a class that provides functions for managing a set of systems
     * This is a base class, that is generic (no render code or knowledge at all)
     * @memberof PIXI
     */
    export class SystemManager<R = IRenderer> extends EventEmitter {
        /** a collection of runners defined by the user */
        readonly runners: {
            [key: string]: Runner;
        };
        private _systemsHash;
        /**
         * Set up a system with a collection of SystemClasses and runners.
         * Systems are attached dynamically to this class when added.
         * @param config - the config for the system manager
         */
        setup(config: ISystemConfig<R>): void;
        /**
         * Create a bunch of runners based of a collection of ids
         * @param runnerIds - the runner ids to add
         */
        addRunners(...runnerIds: string[]): void;
        /**
         * Add a new system to the renderer.
         * @param ClassRef - Class reference
         * @param name - Property name for system, if not specified
         *        will use a static `name` property on the class itself. This
         *        name will be assigned as s property on the Renderer so make
         *        sure it doesn't collide with properties on Renderer.
         * @returns Return instance of renderer
         */
        addSystem(ClassRef: ISystemConstructor<R>, name: string): this;
        /**
         * A function that will run a runner and call the runners function but pass in different options
         * to each system based on there name.
         *
         * E.g. If you have two systems added called `systemA` and `systemB` you could call do the following:
         *
         * ```js
         * system.emitWithCustomOptions(init, {
         *     systemA: {...optionsForA},
         *     systemB: {...optionsForB},
         * });
         * ```
         *
         * `init` would be called on system A passing `optionsForA` and on system B passing `optionsForB`.
         * @param runner - the runner to target
         * @param options - key value options for each system
         */
        emitWithCustomOptions(runner: Runner, options: Record<string, unknown>): void;
        /** destroy the all runners and systems. Its apps job to */
        destroy(): void;
    }
}
declare module "packages/core/src/background/BackgroundSystem" {
    import { Color } from "packages/color/src/index";
    import type { ColorSource } from "packages/color/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * Options for the background system.
     * @memberof PIXI
     * @deprecated since 7.2.3
     * @see PIXI.BackgroundSystemOptions
     */
    export type BackgroundSytemOptions = BackgroundSystemOptions;
    /**
     * Options for the background system.
     * @memberof PIXI
     */
    export interface BackgroundSystemOptions {
        /**
         * The background color used to clear the canvas. See {@link PIXI.ColorSource} for accepted color values.
         * @memberof PIXI.IRendererOptions
         */
        backgroundColor: ColorSource;
        /**
         * Alias for {@link PIXI.IRendererOptions.backgroundColor}
         * @memberof PIXI.IRendererOptions
         */
        background?: ColorSource;
        /**
         * Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
         * @memberof PIXI.IRendererOptions
         */
        backgroundAlpha: number;
        /**
         * Whether to clear the canvas before new render passes.
         * @memberof PIXI.IRendererOptions
         */
        clearBeforeRender: boolean;
    }
    /**
     * The background system manages the background color and alpha of the main view.
     * @memberof PIXI
     */
    export class BackgroundSystem implements ISystem<BackgroundSystemOptions> {
        static defaultOptions: BackgroundSystemOptions;
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
         * If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
         * frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
         * to clear the canvas every frame. Disable this by setting this to false. For example, if
         * your game has a canvas filling background image you often don't need this set.
         * @member {boolean}
         * @default
         */
        clearBeforeRender: boolean;
        /** Reference to the internal color */
        private _backgroundColor;
        constructor();
        /**
         * initiates the background system
         * @param {PIXI.IRendererOptions} options - the options for the background colors
         */
        init(options: BackgroundSystemOptions): void;
        /**
         * The background color to fill if not transparent.
         * @member {PIXI.ColorSource}
         */
        get color(): ColorSource;
        set color(value: ColorSource);
        /**
         * The background color alpha. Setting this to 0 will make the canvas transparent.
         * @member {number}
         */
        get alpha(): number;
        set alpha(value: number);
        /** The background color object. */
        get backgroundColor(): Color;
        destroy(): void;
    }
}
declare module "packages/core/src/batch/ObjectRenderer" {
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * Base for a common object renderer that can be used as a
     * system renderer plugin.
     * @memberof PIXI
     */
    export class ObjectRenderer implements ISystem {
        /** The renderer this manager works for. */
        protected renderer: Renderer;
        /**
         * @param renderer - The renderer this manager works for.
         */
        constructor(renderer: Renderer);
        /** Stub method that should be used to empty the current batch by rendering objects now. */
        flush(): void;
        /** Generic destruction method that frees all resources. This should be called by subclasses. */
        destroy(): void;
        /**
         * Stub method that initializes any state required before
         * rendering starts. It is different from the `prerender`
         * signal, which occurs every frame, in that it is called
         * whenever an object requests _this_ renderer specifically.
         */
        start(): void;
        /** Stops the renderer. It should free up any state and become dormant. */
        stop(): void;
        /**
         * Keeps the object to render. It doesn't have to be
         * rendered immediately.
         * @param {PIXI.DisplayObject} _object - The object to render.
         */
        render(_object: any): void;
    }
}
declare module "packages/core/src/textures/GLTexture" {
    /**
     * Internal texture for WebGL context.
     * @memberof PIXI
     */
    export class GLTexture {
        /** The WebGL texture. */
        texture: WebGLTexture;
        /** Width of texture that was used in texImage2D. */
        width: number;
        /** Height of texture that was used in texImage2D. */
        height: number;
        /** Whether mip levels has to be generated. */
        mipmap: boolean;
        /** WrapMode copied from baseTexture. */
        wrapMode: number;
        /** Type copied from baseTexture. */
        type: number;
        /** Type copied from baseTexture. */
        internalFormat: number;
        /** Type of sampler corresponding to this texture. See {@link PIXI.SAMPLER_TYPES} */
        samplerType: number;
        /** Texture contents dirty flag. */
        dirtyId: number;
        /** Texture style dirty flag. */
        dirtyStyleId: number;
        constructor(texture: WebGLTexture);
    }
}
declare module "packages/core/src/textures/resources/Resource" {
    import { Runner } from "packages/runner/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    /**
     * Base resource class for textures that manages validation and uploading, depending on its type.
     *
     * Uploading of a base texture to the GPU is required.
     * @memberof PIXI
     */
    export abstract class Resource {
        /** The url of the resource */
        src: string;
        /**
         * If resource has been destroyed.
         * @readonly
         * @default false
         */
        destroyed: boolean;
        /**
         * `true` if resource is created by BaseTexture
         * useful for doing cleanup with BaseTexture destroy
         * and not cleaning up resources that were created
         * externally.
         */
        internal: boolean;
        /** Internal width of the resource. */
        protected _width: number;
        /** Internal height of the resource. */
        protected _height: number;
        /**
         * Mini-runner for handling resize events
         * accepts 2 parameters: width, height
         * @member {Runner}
         * @private
         */
        protected onResize: Runner;
        /**
         * Mini-runner for handling update events
         * @member {Runner}
         * @private
         */
        protected onUpdate: Runner;
        /**
         * Handle internal errors, such as loading errors
         * accepts 1 param: error
         * @member {Runner}
         * @private
         */
        protected onError: Runner;
        /**
         * @param width - Width of the resource
         * @param height - Height of the resource
         */
        constructor(width?: number, height?: number);
        /**
         * Bind to a parent BaseTexture
         * @param baseTexture - Parent texture
         */
        bind(baseTexture: BaseTexture): void;
        /**
         * Unbind to a parent BaseTexture
         * @param baseTexture - Parent texture
         */
        unbind(baseTexture: BaseTexture): void;
        /**
         * Trigger a resize event
         * @param width - X dimension
         * @param height - Y dimension
         */
        resize(width: number, height: number): void;
        /**
         * Has been validated
         * @readonly
         */
        get valid(): boolean;
        /** Has been updated trigger event. */
        update(): void;
        /**
         * This can be overridden to start preloading a resource
         * or do any other prepare step.
         * @protected
         * @returns Handle the validate event
         */
        load(): Promise<this>;
        /**
         * The width of the resource.
         * @readonly
         */
        get width(): number;
        /**
         * The height of the resource.
         * @readonly
         */
        get height(): number;
        /**
         * Uploads the texture or returns false if it cant for some reason. Override this.
         * @param renderer - yeah, renderer!
         * @param baseTexture - the texture
         * @param glTexture - texture instance for this webgl context
         * @returns - true is success
         */
        abstract upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean;
        /**
         * Set the style, optional to override
         * @param _renderer - yeah, renderer!
         * @param _baseTexture - the texture
         * @param _glTexture - texture instance for this webgl context
         * @returns - `true` is success
         */
        style(_renderer: Renderer, _baseTexture: BaseTexture, _glTexture: GLTexture): boolean;
        /** Clean up anything, this happens when destroying is ready. */
        dispose(): void;
        /**
         * Call when destroying resource, unbind any BaseTexture object
         * before calling this method, as reference counts are maintained
         * internally.
         */
        destroy(): void;
        /**
         * Abstract, used to auto-detect resource type.
         * @param {*} _source - The source object
         * @param {string} _extension - The extension of source, if set
         */
        static test(_source: unknown, _extension?: string): boolean;
    }
}
declare module "packages/core/src/textures/resources/AbstractMultiResource" {
    import { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import { Resource } from "packages/core/src/textures/resources/Resource";
    import type { ISize } from "packages/math/src/index";
    import type { IAutoDetectOptions } from "packages/core/src/textures/resources/autoDetectResource";
    /**
     * Resource that can manage several resource (items) inside.
     * All resources need to have the same pixel size.
     * Parent class for CubeResource and ArrayResource
     * @memberof PIXI
     */
    export abstract class AbstractMultiResource extends Resource {
        /** Number of elements in array. */
        readonly length: number;
        /**
         * Collection of partial baseTextures that correspond to resources.
         * @readonly
         */
        items: Array<BaseTexture>;
        /**
         * Dirty IDs for each part.
         * @readonly
         */
        itemDirtyIds: Array<number>;
        /**
         * Promise when loading.
         * @default null
         */
        private _load;
        /** Bound baseTexture, there can only be one. */
        baseTexture: BaseTexture;
        /**
         * @param length
         * @param options - Options to for Resource constructor
         * @param {number} [options.width] - Width of the resource
         * @param {number} [options.height] - Height of the resource
         */
        constructor(length: number, options?: ISize);
        /**
         * Used from ArrayResource and CubeResource constructors.
         * @param resources - Can be resources, image elements, canvas, etc. ,
         *  length should be same as constructor length
         * @param options - Detect options for resources
         */
        protected initFromArray(resources: Array<any>, options?: IAutoDetectOptions): void;
        /** Destroy this BaseImageResource. */
        dispose(): void;
        /**
         * Set a baseTexture by ID
         * @param baseTexture
         * @param index - Zero-based index of resource to set
         * @returns - Instance for chaining
         */
        abstract addBaseTextureAt(baseTexture: BaseTexture, index: number): this;
        /**
         * Set a resource by ID
         * @param resource
         * @param index - Zero-based index of resource to set
         * @returns - Instance for chaining
         */
        addResourceAt(resource: Resource, index: number): this;
        /**
         * Set the parent base texture.
         * @param baseTexture
         */
        bind(baseTexture: BaseTexture): void;
        /**
         * Unset the parent base texture.
         * @param baseTexture
         */
        unbind(baseTexture: BaseTexture): void;
        /**
         * Load all the resources simultaneously
         * @returns - When load is resolved
         */
        load(): Promise<this>;
    }
}
declare module "packages/core/src/textures/resources/CubeResource" {
    import { AbstractMultiResource } from "packages/core/src/textures/resources/AbstractMultiResource";
    import type { ISize } from "packages/math/src/index";
    import type { ArrayFixed } from "packages/utils/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    import type { Resource } from "packages/core/src/textures/resources/Resource";
    /**
     * Constructor options for CubeResource.
     * @memberof PIXI
     */
    export interface ICubeResourceOptions extends ISize {
        /** Whether to auto-load resources */
        autoLoad?: boolean;
        /** In case BaseTextures are supplied, whether to copy them or use. */
        linkBaseTexture?: boolean;
    }
    /**
     * Resource for a CubeTexture which contains six resources.
     * @memberof PIXI
     */
    export class CubeResource extends AbstractMultiResource {
        items: ArrayFixed<BaseTexture, 6>;
        /**
         * In case BaseTextures are supplied, whether to use same resource or bind baseTexture itself.
         * @protected
         */
        linkBaseTexture: boolean;
        /**
         * @param {Array<string|PIXI.Resource>} [source] - Collection of URLs or resources
         *        to use as the sides of the cube.
         * @param options - ImageResource options
         * @param {number} [options.width] - Width of resource
         * @param {number} [options.height] - Height of resource
         * @param {number} [options.autoLoad=true] - Whether to auto-load resources
         * @param {number} [options.linkBaseTexture=true] - In case BaseTextures are supplied,
         *   whether to copy them or use
         */
        constructor(source?: ArrayFixed<string | Resource, 6>, options?: ICubeResourceOptions);
        /**
         * Add binding.
         * @param baseTexture - parent base texture
         */
        bind(baseTexture: BaseTexture): void;
        addBaseTextureAt(baseTexture: BaseTexture, index: number, linkBaseTexture?: boolean): this;
        /**
         * Upload the resource
         * @param renderer
         * @param _baseTexture
         * @param glTexture
         * @returns {boolean} true is success
         */
        upload(renderer: Renderer, _baseTexture: BaseTexture, glTexture: GLTexture): boolean;
        /** Number of texture sides to store for CubeResources. */
        static SIDES: number;
        /**
         * Used to auto-detect the type of resource.
         * @param {*} source - The source object
         * @returns {boolean} `true` if source is an array of 6 elements
         */
        static test(source: unknown): source is ArrayFixed<string | Resource, 6>;
    }
}
declare module "packages/core/src/textures/resources/BaseImageResource" {
    import { Resource } from "packages/core/src/textures/resources/Resource";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { BaseTexture, ImageSource } from "packages/core/src/textures/BaseTexture";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    /**
     * Base for all the image/canvas resources.
     * @memberof PIXI
     */
    export class BaseImageResource extends Resource {
        /**
         * The source element.
         * @member {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas}
         * @readonly
         */
        source: ImageSource;
        /**
         * If set to `true`, will force `texImage2D` over `texSubImage2D` for uploading.
         * Certain types of media (e.g. video) using `texImage2D` is more performant.
         * @default false
         * @private
         */
        noSubImage: boolean;
        /**
         * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source
         */
        constructor(source: ImageSource);
        /**
         * Set cross origin based detecting the url and the crossorigin
         * @param element - Element to apply crossOrigin
         * @param url - URL to check
         * @param crossorigin - Cross origin value to use
         */
        static crossOrigin(element: HTMLImageElement | HTMLVideoElement, url: string, crossorigin?: boolean | string): void;
        /**
         * Upload the texture to the GPU.
         * @param renderer - Upload to the renderer
         * @param baseTexture - Reference to parent texture
         * @param glTexture
         * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} [source] - (optional)
         * @returns - true is success
         */
        upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture, source?: ImageSource): boolean;
        /**
         * Checks if source width/height was changed, resize can cause extra baseTexture update.
         * Triggers one update in any case.
         */
        update(): void;
        /** Destroy this {@link PIXI.BaseImageResource} */
        dispose(): void;
    }
}
declare module "packages/core/src/textures/resources/ImageResource" {
    import { ALPHA_MODES } from "packages/constants/src/index";
    import { BaseImageResource } from "packages/core/src/textures/resources/BaseImageResource";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    export interface IImageResourceOptions {
        /** Start loading process automatically when constructed. */
        autoLoad?: boolean;
        /** Whether its required to create a bitmap before upload. */
        createBitmap?: boolean;
        /** Load image using cross origin. */
        crossorigin?: boolean | string;
        /** Premultiply image alpha in bitmap. */
        alphaMode?: ALPHA_MODES;
    }
    /**
     * Resource type for HTMLImageElement.
     * @memberof PIXI
     */
    export class ImageResource extends BaseImageResource {
        /** URL of the image source */
        url: string;
        /**
         * If the image should be disposed after upload
         * @default false
         */
        preserveBitmap: boolean;
        /**
         * If capable, convert the image using createImageBitmap API.
         * @default PIXI.settings.CREATE_IMAGE_BITMAP
         */
        createBitmap: boolean;
        /**
         * Controls texture alphaMode field
         * Copies from options
         * Default is `null`, copies option from baseTexture
         * @readonly
         */
        alphaMode: ALPHA_MODES;
        /**
         * The ImageBitmap element created for a {@link HTMLImageElement}.
         * @default null
         */
        bitmap: ImageBitmap;
        /**
         * Promise when loading.
         * @default null
         */
        private _load;
        /** When process is completed */
        private _process;
        /**
         * @param source - image source or URL
         * @param options
         * @param {boolean} [options.autoLoad=true] - start loading process
         * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - whether its required to create
         *        a bitmap before upload
         * @param {boolean} [options.crossorigin=true] - Load image using cross origin
         * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Premultiply image alpha in bitmap
         */
        constructor(source: HTMLImageElement | string, options?: IImageResourceOptions);
        /**
         * Returns a promise when image will be loaded and processed.
         * @param createBitmap - whether process image into bitmap
         */
        load(createBitmap?: boolean): Promise<this>;
        /**
         * Called when we need to convert image into BitmapImage.
         * Can be called multiple times, real promise is cached inside.
         * @returns - Cached promise to fill that bitmap
         */
        process(): Promise<this>;
        /**
         * Upload the image resource to GPU.
         * @param renderer - Renderer to upload to
         * @param baseTexture - BaseTexture for this resource
         * @param glTexture - GLTexture to use
         * @returns {boolean} true is success
         */
        upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean;
        /** Destroys this resource. */
        dispose(): void;
        /**
         * Used to auto-detect the type of resource.
         * @param {*} source - The source object
         * @returns {boolean} `true` if current environment support HTMLImageElement, and source is string or HTMLImageElement
         */
        static test(source: unknown): source is string | HTMLImageElement;
    }
}
declare module "packages/core/src/textures/resources/SVGResource" {
    import { BaseImageResource } from "packages/core/src/textures/resources/BaseImageResource";
    import type { ISize } from "packages/math/src/index";
    export interface ISVGResourceOptions {
        source?: string;
        scale?: number;
        width?: number;
        height?: number;
        autoLoad?: boolean;
        crossorigin?: boolean | string;
    }
    /**
     * Resource type for SVG elements and graphics.
     * @memberof PIXI
     */
    export class SVGResource extends BaseImageResource {
        /** Base64 encoded SVG element or URL for SVG file. */
        readonly svg: string;
        /** The source scale to apply when rasterizing on load. */
        readonly scale: number;
        /** A width override for rasterization on load. */
        readonly _overrideWidth: number;
        /** A height override for rasterization on load. */
        readonly _overrideHeight: number;
        /** Call when completely loaded. */
        private _resolve;
        /** Promise when loading */
        private _load;
        /** Cross origin value to use */
        private _crossorigin?;
        /**
         * @param sourceBase64 - Base64 encoded SVG element or URL for SVG file.
         * @param {object} [options] - Options to use
         * @param {number} [options.scale=1] - Scale to apply to SVG. Overridden by...
         * @param {number} [options.width] - Rasterize SVG this wide. Aspect ratio preserved if height not specified.
         * @param {number} [options.height] - Rasterize SVG this high. Aspect ratio preserved if width not specified.
         * @param {boolean} [options.autoLoad=true] - Start loading right away.
         */
        constructor(sourceBase64: string, options?: ISVGResourceOptions);
        load(): Promise<this>;
        /** Loads an SVG image from `imageUrl` or `data URL`. */
        private _loadSvg;
        /**
         * Get size from an svg string using a regular expression.
         * @param svgString - a serialized svg element
         * @returns - image extension
         */
        static getSize(svgString?: string): ISize;
        /** Destroys this texture. */
        dispose(): void;
        /**
         * Used to auto-detect the type of resource.
         * @param {*} source - The source object
         * @param {string} extension - The extension of source, if set
         * @returns {boolean} - If the source is a SVG source or data file
         */
        static test(source: unknown, extension?: string): boolean;
        /**
         * Regular expression for SVG XML document.
         * @example &lt;?xml version="1.0" encoding="utf-8" ?&gt;&lt;!-- image/svg --&gt;&lt;svg
         * @readonly
         */
        static SVG_XML: RegExp;
        /**
         * Regular expression for SVG size.
         * @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
         * @readonly
         */
        static SVG_SIZE: RegExp;
    }
}
declare module "packages/ticker/src/const" {
    /**
     * Represents the update priorities used by internal PIXI classes when registered with
     * the {@link PIXI.Ticker} object. Higher priority items are updated first and lower
     * priority items, such as render, should go later.
     * @static
     * @memberof PIXI
     * @enum {number}
     */
    export enum UPDATE_PRIORITY {
        /**
         * Highest priority used for interaction events in {@link PIXI.EventSystem}
         * @default 50
         */
        INTERACTION = 50,
        /**
         * High priority updating, used by {@link PIXI.AnimatedSprite}
         * @default 25
         */
        HIGH = 25,
        /**
         * Default priority for ticker events, see {@link PIXI.Ticker#add}.
         * @default 0
         */
        NORMAL = 0,
        /**
         * Low priority used for {@link PIXI.Application} rendering.
         * @default -25
         */
        LOW = -25,
        /**
         * Lowest priority used for {@link PIXI.BasePrepare} utility.
         * @default -50
         */
        UTILITY = -50
    }
}
declare module "packages/ticker/src/TickerListener" {
    import type { TickerCallback } from "packages/ticker/src/Ticker";
    /**
     * Internal class for handling the priority sorting of ticker handlers.
     * @private
     * @class
     * @memberof PIXI
     */
    export class TickerListener<T = any> {
        /** The current priority. */
        priority: number;
        /** The next item in chain. */
        next: TickerListener;
        /** The previous item in chain. */
        previous: TickerListener;
        /** The handler function to execute. */
        private fn;
        /** The calling to execute. */
        private context;
        /** If this should only execute once. */
        private once;
        /** `true` if this listener has been destroyed already. */
        private _destroyed;
        /**
         * Constructor
         * @private
         * @param fn - The listener function to be added for one update
         * @param context - The listener context
         * @param priority - The priority for emitting
         * @param once - If the handler should fire once
         */
        constructor(fn: TickerCallback<T>, context?: T, priority?: number, once?: boolean);
        /**
         * Simple compare function to figure out if a function and context match.
         * @private
         * @param fn - The listener function to be added for one update
         * @param context - The listener context
         * @returns `true` if the listener match the arguments
         */
        match(fn: TickerCallback<T>, context?: any): boolean;
        /**
         * Emit by calling the current function.
         * @private
         * @param deltaTime - time since the last emit.
         * @returns Next ticker
         */
        emit(deltaTime: number): TickerListener;
        /**
         * Connect to the list.
         * @private
         * @param previous - Input node, previous listener
         */
        connect(previous: TickerListener): void;
        /**
         * Destroy and don't use after this.
         * @private
         * @param hard - `true` to remove the `next` reference, this
         *        is considered a hard destroy. Soft destroy maintains the next reference.
         * @returns The listener to redirect while emitting or removing.
         */
        destroy(hard?: boolean): TickerListener;
    }
}
declare module "packages/ticker/src/Ticker" {
    import { UPDATE_PRIORITY } from "packages/ticker/src/const";
    export type TickerCallback<T> = (this: T, dt: number) => any;
    /**
     * A Ticker class that runs an update loop that other objects listen to.
     *
     * This class is composed around listeners meant for execution on the next requested animation frame.
     * Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.
     * @class
     * @memberof PIXI
     */
    export class Ticker {
        /**
         * Target frames per millisecond.
         * @static
         */
        static targetFPMS: number;
        /** The private shared ticker instance */
        private static _shared;
        /** The private system ticker instance  */
        private static _system;
        /**
         * Whether or not this ticker should invoke the method
         * {@link PIXI.Ticker#start} automatically
         * when a listener is added.
         */
        autoStart: boolean;
        /**
         * Scalar time value from last frame to this frame.
         * This value is capped by setting {@link PIXI.Ticker#minFPS}
         * and is scaled with {@link PIXI.Ticker#speed}.
         * **Note:** The cap may be exceeded by scaling.
         */
        deltaTime: number;
        /**
         * Scaler time elapsed in milliseconds from last frame to this frame.
         * This value is capped by setting {@link PIXI.Ticker#minFPS}
         * and is scaled with {@link PIXI.Ticker#speed}.
         * **Note:** The cap may be exceeded by scaling.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         * Defaults to target frame time
         * @default 16.66
         */
        deltaMS: number;
        /**
         * Time elapsed in milliseconds from last frame to this frame.
         * Opposed to what the scalar {@link PIXI.Ticker#deltaTime}
         * is based, this value is neither capped nor scaled.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         * Defaults to target frame time
         * @default 16.66
         */
        elapsedMS: number;
        /**
         * The last time {@link PIXI.Ticker#update} was invoked.
         * This value is also reset internally outside of invoking
         * update, but only when a new animation frame is requested.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         */
        lastTime: number;
        /**
         * Factor of current {@link PIXI.Ticker#deltaTime}.
         * @example
         * // Scales ticker.deltaTime to what would be
         * // the equivalent of approximately 120 FPS
         * ticker.speed = 2;
         */
        speed: number;
        /**
         * Whether or not this ticker has been started.
         * `true` if {@link PIXI.Ticker#start} has been called.
         * `false` if {@link PIXI.Ticker#stop} has been called.
         * While `false`, this value may change to `true` in the
         * event of {@link PIXI.Ticker#autoStart} being `true`
         * and a listener is added.
         */
        started: boolean;
        /** The first listener. All new listeners added are chained on this. */
        private _head;
        /** Internal current frame request ID */
        private _requestId;
        /**
         * Internal value managed by minFPS property setter and getter.
         * This is the maximum allowed milliseconds between updates.
         */
        private _maxElapsedMS;
        /**
         * Internal value managed by minFPS property setter and getter.
         * This is the minimum allowed milliseconds between updates.
         */
        private _minElapsedMS;
        /** If enabled, deleting is disabled.*/
        private _protected;
        /** The last time keyframe was executed. Maintains a relatively fixed interval with the previous value. */
        private _lastFrame;
        /**
         * Internal tick method bound to ticker instance.
         * This is because in early 2015, Function.bind
         * is still 60% slower in high performance scenarios.
         * Also separating frame requests from update method
         * so listeners may be called at any time and with
         * any animation API, just invoke ticker.update(time).
         * @param time - Time since last tick.
         */
        private _tick;
        constructor();
        /**
         * Conditionally requests a new animation frame.
         * If a frame has not already been requested, and if the internal
         * emitter has listeners, a new frame is requested.
         * @private
         */
        private _requestIfNeeded;
        /**
         * Conditionally cancels a pending animation frame.
         * @private
         */
        private _cancelIfNeeded;
        /**
         * Conditionally requests a new animation frame.
         * If the ticker has been started it checks if a frame has not already
         * been requested, and if the internal emitter has listeners. If these
         * conditions are met, a new frame is requested. If the ticker has not
         * been started, but autoStart is `true`, then the ticker starts now,
         * and continues with the previous conditions to request a new frame.
         * @private
         */
        private _startIfPossible;
        /**
         * Register a handler for tick events. Calls continuously unless
         * it is removed or the ticker is stopped.
         * @param fn - The listener function to be added for updates
         * @param context - The listener context
         * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
         * @returns This instance of a ticker
         */
        add<T = any>(fn: TickerCallback<T>, context?: T, priority?: UPDATE_PRIORITY): this;
        /**
         * Add a handler for the tick event which is only execute once.
         * @param fn - The listener function to be added for one update
         * @param context - The listener context
         * @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
         * @returns This instance of a ticker
         */
        addOnce<T = any>(fn: TickerCallback<T>, context?: T, priority?: UPDATE_PRIORITY): this;
        /**
         * Internally adds the event handler so that it can be sorted by priority.
         * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
         * before the rendering.
         * @private
         * @param listener - Current listener being added.
         * @returns This instance of a ticker
         */
        private _addListener;
        /**
         * Removes any handlers matching the function and context parameters.
         * If no handlers are left after removing, then it cancels the animation frame.
         * @param fn - The listener function to be removed
         * @param context - The listener context to be removed
         * @returns This instance of a ticker
         */
        remove<T = any>(fn: TickerCallback<T>, context?: T): this;
        /**
         * The number of listeners on this ticker, calculated by walking through linked list
         * @readonly
         * @member {number}
         */
        get count(): number;
        /** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
        start(): void;
        /** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
        stop(): void;
        /** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
        destroy(): void;
        /**
         * Triggers an update. An update entails setting the
         * current {@link PIXI.Ticker#elapsedMS},
         * the current {@link PIXI.Ticker#deltaTime},
         * invoking all listeners with current deltaTime,
         * and then finally setting {@link PIXI.Ticker#lastTime}
         * with the value of currentTime that was provided.
         * This method will be called automatically by animation
         * frame callbacks if the ticker instance has been started
         * and listeners are added.
         * @param {number} [currentTime=performance.now()] - the current time of execution
         */
        update(currentTime?: number): void;
        /**
         * The frames per second at which this ticker is running.
         * The default is approximately 60 in most modern browsers.
         * **Note:** This does not factor in the value of
         * {@link PIXI.Ticker#speed}, which is specific
         * to scaling {@link PIXI.Ticker#deltaTime}.
         * @member {number}
         * @readonly
         */
        get FPS(): number;
        /**
         * Manages the maximum amount of milliseconds allowed to
         * elapse between invoking {@link PIXI.Ticker#update}.
         * This value is used to cap {@link PIXI.Ticker#deltaTime},
         * but does not effect the measured value of {@link PIXI.Ticker#FPS}.
         * When setting this property it is clamped to a value between
         * `0` and `Ticker.targetFPMS * 1000`.
         * @member {number}
         * @default 10
         */
        get minFPS(): number;
        set minFPS(fps: number);
        /**
         * Manages the minimum amount of milliseconds required to
         * elapse between invoking {@link PIXI.Ticker#update}.
         * This will effect the measured value of {@link PIXI.Ticker#FPS}.
         * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
         * Otherwise it will be at least `minFPS`
         * @member {number}
         * @default 0
         */
        get maxFPS(): number;
        set maxFPS(fps: number);
        /**
         * The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
         * {@link PIXI.VideoResource} to update animation frames / video textures.
         *
         * It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
         *
         * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
         * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
         * @example
         * import { Ticker } from 'pixi.js';
         *
         * const ticker = Ticker.shared;
         * // Set this to prevent starting this ticker when listeners are added.
         * // By default this is true only for the PIXI.Ticker.shared instance.
         * ticker.autoStart = false;
         *
         * // FYI, call this to ensure the ticker is stopped. It should be stopped
         * // if you have not attempted to render anything yet.
         * ticker.stop();
         *
         * // Call this when you are ready for a running shared ticker.
         * ticker.start();
         * @example
         * import { autoDetectRenderer, Container } from 'pixi.js';
         *
         * // You may use the shared ticker to render...
         * const renderer = autoDetectRenderer();
         * const stage = new Container();
         * document.body.appendChild(renderer.view);
         * ticker.add((time) => renderer.render(stage));
         *
         * // Or you can just update it manually.
         * ticker.autoStart = false;
         * ticker.stop();
         * const animate = (time) => {
         *     ticker.update(time);
         *     renderer.render(stage);
         *     requestAnimationFrame(animate);
         * };
         * animate(performance.now());
         * @member {PIXI.Ticker}
         * @static
         */
        static get shared(): Ticker;
        /**
         * The system ticker instance used by {@link PIXI.BasePrepare} for core timing
         * functionality that shouldn't usually need to be paused, unlike the `shared`
         * ticker which drives visual animations and rendering which may want to be paused.
         *
         * The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
         * @member {PIXI.Ticker}
         * @static
         */
        static get system(): Ticker;
    }
}
declare module "packages/ticker/src/settings" {
    import { settings } from "packages/settings/src/index";
    export { settings };
}
declare module "packages/ticker/src/TickerPlugin" {
    import { Ticker } from "packages/ticker/src/Ticker";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    export interface TickerPluginOptions {
        /**
         * Automatically starts the rendering after the construction.
         *  **Note**: Setting this parameter to `false` does NOT stop the shared ticker even if you set
         *  `options.sharedTicker` to `true` in case that it is already started. Stop it by your own.
         * @memberof PIXI.IApplicationOptions
         * @default true
         */
        autoStart?: boolean;
        /**
         * Set`true` to use `Ticker.shared`, `false` to create new ticker.
         *  If set to `false`, you cannot register a handler to occur before anything that runs on the shared ticker.
         *  The system ticker will always run before both the shared ticker and the app ticker.
         * @memberof PIXI.IApplicationOptions
         * @default false
         */
        sharedTicker?: boolean;
    }
    /**
     * Middleware for for Application Ticker.
     * @class
     * @memberof PIXI
     */
    export class TickerPlugin {
        /** @ignore */
        static extension: ExtensionMetadata;
        static start: () => void;
        static stop: () => void;
        static _ticker: Ticker;
        static ticker: Ticker;
        /**
         * Initialize the plugin with scope of application instance
         * @static
         * @private
         * @param {object} [options] - See application options
         */
        static init(options?: GlobalMixins.IApplicationOptions): void;
        /**
         * Clean up the ticker, scoped to application.
         * @static
         * @private
         */
        static destroy(): void;
    }
}
declare module "packages/ticker/src/index" {
    import "packages/ticker/src/settings";
    export * from "packages/ticker/src/const";
    export * from "packages/ticker/src/Ticker";
    export * from "packages/ticker/src/TickerPlugin";
}
declare module "packages/core/src/textures/resources/VideoResource" {
    import { BaseImageResource } from "packages/core/src/textures/resources/BaseImageResource";
    import type { Dict } from "packages/utils/src/index";
    export interface IVideoResourceOptions {
        autoLoad?: boolean;
        autoPlay?: boolean;
        updateFPS?: number;
        crossorigin?: boolean | string;
    }
    export interface IVideoResourceOptionsElement {
        src: string;
        mime: string;
    }
    /**
     * Resource type for {@link HTMLVideoElement}.
     * @memberof PIXI
     */
    export class VideoResource extends BaseImageResource {
        /** Override the source to be the video element. */
        source: HTMLVideoElement;
        /**
         * `true` to use Ticker.shared to auto update the base texture.
         * @default true
         */
        protected _autoUpdate: boolean;
        /**
         * `true` if the instance is currently connected to PIXI.Ticker.shared to auto update the base texture.
         * @default false
         */
        protected _isConnectedToTicker: boolean;
        protected _updateFPS: number;
        protected _msToNextUpdate: number;
        private _videoFrameRequestCallbackHandle;
        /**
         * When set to true will automatically play videos used by this texture once
         * they are loaded. If false, it will not modify the playing state.
         * @default true
         */
        protected autoPlay: boolean;
        /**
         * Promise when loading.
         * @default null
         */
        private _load;
        /** Callback when completed with load. */
        private _resolve;
        private _reject;
        /**
         * @param {HTMLVideoElement|object|string|Array<string|object>} source - Video element to use.
         * @param {object} [options] - Options to use
         * @param {boolean} [options.autoLoad=true] - Start loading the video immediately
         * @param {boolean} [options.autoPlay=true] - Start playing video immediately
         * @param {number} [options.updateFPS=0] - How many times a second to update the texture from the video.
         * Leave at 0 to update at every render.
         * @param {boolean} [options.crossorigin=true] - Load image using cross origin
         */
        constructor(source?: HTMLVideoElement | Array<string | IVideoResourceOptionsElement> | string, options?: IVideoResourceOptions);
        /**
         * Trigger updating of the texture.
         * @param _deltaTime - time delta since last tick
         */
        update(_deltaTime?: number): void;
        private _videoFrameRequestCallback;
        /**
         * Start preloading the video resource.
         * @returns {Promise<void>} Handle the validate event
         */
        load(): Promise<this>;
        /**
         * Handle video error events.
         * @param event
         */
        private _onError;
        /**
         * Returns true if the underlying source is playing.
         * @returns - True if playing.
         */
        private _isSourcePlaying;
        /**
         * Returns true if the underlying source is ready for playing.
         * @returns - True if ready.
         */
        private _isSourceReady;
        /** Runs the update loop when the video is ready to play. */
        private _onPlayStart;
        /** Fired when a pause event is triggered, stops the update loop. */
        private _onPlayStop;
        /** Fired when the video is loaded and ready to play. */
        private _onCanPlay;
        /** Destroys this texture. */
        dispose(): void;
        /** Should the base texture automatically update itself, set to true by default. */
        get autoUpdate(): boolean;
        set autoUpdate(value: boolean);
        /**
         * How many times a second to update the texture from the video. Leave at 0 to update at every render.
         * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
         */
        get updateFPS(): number;
        set updateFPS(value: number);
        private _configureAutoUpdate;
        /**
         * Used to auto-detect the type of resource.
         * @param {*} source - The source object
         * @param {string} extension - The extension of source, if set
         * @returns {boolean} `true` if video source
         */
        static test(source: unknown, extension?: string): source is HTMLVideoElement;
        /**
         * List of common video file extensions supported by VideoResource.
         * @readonly
         */
        static TYPES: Array<string>;
        /**
         * Map of video MIME types that can't be directly derived from file extensions.
         * @readonly
         */
        static MIME_TYPES: Dict<string>;
    }
}
declare module "packages/core/src/textures/resources/autoDetectResource" {
    import type { ISize } from "packages/math/src/index";
    import type { ICubeResourceOptions } from "packages/core/src/textures/resources/CubeResource";
    import type { IImageResourceOptions } from "packages/core/src/textures/resources/ImageResource";
    import type { Resource } from "packages/core/src/textures/resources/Resource";
    import type { ISVGResourceOptions } from "packages/core/src/textures/resources/SVGResource";
    import type { IVideoResourceOptions } from "packages/core/src/textures/resources/VideoResource";
    export type IResourcePluginOptions = {
        [key: string]: any;
    };
    export type IAutoDetectOptions = ISize | ICubeResourceOptions | IImageResourceOptions | ISVGResourceOptions | IVideoResourceOptions | IResourcePluginOptions;
    /**
     * Shape of supported resource plugins
     * @memberof PIXI
     */
    export interface IResourcePlugin<R, RO> {
        test(source: unknown, extension: string): boolean;
        new (source: any, options?: RO): R;
    }
    /**
     * Collection of installed resource types, class must extend {@link PIXI.Resource}.
     * @example
     * class CustomResource extends PIXI.Resource {
     *     // MUST have source, options constructor signature
     *     // for auto-detected resources to be created.
     *     constructor(source, options) {
     *         super();
     *     }
     *     upload(renderer, baseTexture, glTexture) {
     *         // Upload with GL
     *         return true;
     *     }
     *     // Used to auto-detect resource
     *     static test(source, extension) {
     *         return extension === 'xyz' || source instanceof SomeClass;
     *     }
     * }
     * // Install the new resource type
     * PIXI.INSTALLED.push(CustomResource);
     * @memberof PIXI
     * @type {Array<PIXI.IResourcePlugin>}
     * @static
     * @readonly
     */
    export const INSTALLED: Array<IResourcePlugin<any, any>>;
    /**
     * Create a resource element from a single source element. This
     * auto-detects which type of resource to create. All resources that
     * are auto-detectable must have a static `test` method and a constructor
     * with the arguments `(source, options?)`. Currently, the supported
     * resources for auto-detection include:
     *  - {@link PIXI.ImageResource}
     *  - {@link PIXI.CanvasResource}
     *  - {@link PIXI.VideoResource}
     *  - {@link PIXI.SVGResource}
     *  - {@link PIXI.BufferResource}
     * @static
     * @memberof PIXI
     * @function autoDetectResource
     * @param {string|*} source - Resource source, this can be the URL to the resource,
     *        a typed-array (for BufferResource), HTMLVideoElement, SVG data-uri
     *        or any other resource that can be auto-detected. If not resource is
     *        detected, it's assumed to be an ImageResource.
     * @param {object} [options] - Pass-through options to use for Resource
     * @param {number} [options.width] - Width of BufferResource or SVG rasterization
     * @param {number} [options.height] - Height of BufferResource or SVG rasterization
     * @param {boolean} [options.autoLoad=true] - Image, SVG and Video flag to start loading
     * @param {number} [options.scale=1] - SVG source scale. Overridden by width, height
     * @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - Image option to create Bitmap object
     * @param {boolean} [options.crossorigin=true] - Image and Video option to set crossOrigin
     * @param {boolean} [options.autoPlay=true] - Video option to start playing video immediately
     * @param {number} [options.updateFPS=0] - Video option to update how many times a second the
     *        texture should be updated from the video. Leave at 0 to update at every render
     * @returns {PIXI.Resource} The created resource.
     */
    export function autoDetectResource<R extends Resource, RO>(source: unknown, options?: RO): R;
}
declare module "packages/core/src/textures/resources/BufferResource" {
    import { Resource } from "packages/core/src/textures/resources/Resource";
    import type { ISize } from "packages/math/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    export type BufferType = null | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array;
    /**
     * Constructor options for BufferResource.
     * @memberof PIXI
     */
    export interface IBufferResourceOptions extends ISize {
        unpackAlignment?: 1 | 2 | 4 | 8;
    }
    /**
     * Buffer resource with data of typed array.
     * @memberof PIXI
     */
    export class BufferResource extends Resource {
        /** The data of this resource. */
        data: BufferType;
        /** The alignment of the rows in the data. */
        unpackAlignment: 1 | 2 | 4 | 8;
        /**
         * @param source - Source buffer
         * @param options - Options
         * @param {number} options.width - Width of the texture
         * @param {number} options.height - Height of the texture
         * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
         */
        constructor(source: BufferType, options: IBufferResourceOptions);
        /**
         * Upload the texture to the GPU.
         * @param renderer - Upload to the renderer
         * @param baseTexture - Reference to parent texture
         * @param glTexture - glTexture
         * @returns - true is success
         */
        upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean;
        /** Destroy and don't use after this. */
        dispose(): void;
        /**
         * Used to auto-detect the type of resource.
         * @param {*} source - The source object
         * @returns {boolean} `true` if buffer source
         */
        static test(source: unknown): source is BufferType;
    }
}
declare module "packages/core/src/textures/BaseTexture" {
    import { ALPHA_MODES, FORMATS, MIPMAP_MODES, SCALE_MODES, TARGETS, TYPES, WRAP_MODES } from "packages/constants/src/index";
    import { EventEmitter } from "packages/utils/src/index";
    import { BufferResource } from "packages/core/src/textures/resources/BufferResource";
    import { Resource } from "packages/core/src/textures/resources/Resource";
    import type { MSAA_QUALITY } from "packages/constants/src/index";
    import type { ICanvas } from "packages/settings/src/index";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    import type { IAutoDetectOptions } from "packages/core/src/textures/resources/autoDetectResource";
    import type { BufferType, IBufferResourceOptions } from "packages/core/src/textures/resources/BufferResource";
    export type ImageSource = HTMLImageElement | HTMLVideoElement | ImageBitmap | ICanvas;
    export interface IBaseTextureOptions<RO = any> {
        alphaMode?: ALPHA_MODES;
        mipmap?: MIPMAP_MODES;
        anisotropicLevel?: number;
        scaleMode?: SCALE_MODES;
        width?: number;
        height?: number;
        wrapMode?: WRAP_MODES;
        format?: FORMATS;
        type?: TYPES;
        target?: TARGETS;
        resolution?: number;
        multisample?: MSAA_QUALITY;
        resourceOptions?: RO;
        pixiIdPrefix?: string;
    }
    export interface BaseTexture extends GlobalMixins.BaseTexture, EventEmitter {
    }
    /**
     * A Texture stores the information that represents an image.
     * All textures have a base texture, which contains information about the source.
     * Therefore you can have many textures all using a single BaseTexture
     * @memberof PIXI
     * @typeParam R - The BaseTexture's Resource type.
     * @typeParam RO - The options for constructing resource.
     */
    export class BaseTexture<R extends Resource = Resource, RO = IAutoDetectOptions> extends EventEmitter {
        /**
         * The width of the base texture set when the image has loaded
         * @readonly
         */
        width: number;
        /**
         * The height of the base texture set when the image has loaded
         * @readonly
         */
        height: number;
        /**
         * The resolution / device pixel ratio of the texture
         * @readonly
         * @default PIXI.settings.RESOLUTION
         */
        resolution: number;
        /**
         * How to treat premultiplied alpha, see {@link PIXI.ALPHA_MODES}.
         * @member {PIXI.ALPHA_MODES}
         * @default PIXI.ALPHA_MODES.UNPACK
         */
        alphaMode: ALPHA_MODES;
        /**
         * Anisotropic filtering level of texture
         * @member {number}
         * @default 0
         */
        anisotropicLevel: number;
        /**
         * The pixel format of the texture
         * @default PIXI.FORMATS.RGBA
         */
        format: FORMATS;
        /**
         * The type of resource data
         * @default PIXI.TYPES.UNSIGNED_BYTE
         */
        type: TYPES;
        /**
         * The target type
         * @default PIXI.TARGETS.TEXTURE_2D
         */
        target: TARGETS;
        /**
         * Global unique identifier for this BaseTexture
         * @protected
         */
        readonly uid: number;
        /**
         * Used by automatic texture Garbage Collection, stores last GC tick when it was bound
         * @protected
         */
        touched: number;
        /**
         * Whether or not the texture is a power of two, try to use power of two textures as much
         * as you can
         * @readonly
         * @default false
         */
        isPowerOfTwo: boolean;
        /**
         * The map of render context textures where this is bound
         * @private
         */
        _glTextures: {
            [key: number]: GLTexture;
        };
        /**
         * Used by TextureSystem to only update texture to the GPU when needed.
         * Please call `update()` to increment it.
         * @readonly
         */
        dirtyId: number;
        /**
         * Used by TextureSystem to only update texture style when needed.
         * @protected
         */
        dirtyStyleId: number;
        /**
         * Currently default cache ID.
         * @member {string}
         */
        cacheId: string;
        /**
         * Generally speaking means when resource is loaded.
         * @readonly
         * @member {boolean}
         */
        valid: boolean;
        /**
         * The collection of alternative cache ids, since some BaseTextures
         * can have more than one ID, short name and longer full URL
         * @member {Array<string>}
         * @readonly
         */
        textureCacheIds: Array<string>;
        /**
         * Flag if BaseTexture has been destroyed.
         * @member {boolean}
         * @readonly
         */
        destroyed: boolean;
        /**
         * The resource used by this BaseTexture, there can only
         * be one resource per BaseTexture, but textures can share
         * resources.
         * @member {PIXI.Resource}
         * @readonly
         */
        resource: R;
        /**
         * Number of the texture batch, used by multi-texture renderers
         * @member {number}
         */
        _batchEnabled: number;
        /**
         * Location inside texture batch, used by multi-texture renderers
         * @member {number}
         */
        _batchLocation: number;
        /**
         * Whether its a part of another texture, handled by ArrayResource or CubeResource
         * @member {PIXI.BaseTexture}
         */
        parentTextureArray: BaseTexture;
        private _mipmap;
        private _scaleMode;
        private _wrapMode;
        /**
         * Default options used when creating BaseTexture objects.
         * @static
         * @memberof PIXI.BaseTexture
         * @type {PIXI.IBaseTextureOptions}
         */
        static defaultOptions: IBaseTextureOptions;
        /**
         * @param {PIXI.Resource|HTMLImageElement|HTMLVideoElement|ImageBitmap|ICanvas|string} [resource=null] -
         *        The current resource to use, for things that aren't Resource objects, will be converted
         *        into a Resource.
         * @param options - Collection of options, default options inherited from {@link PIXI.BaseTexture.defaultOptions}.
         * @param {PIXI.MIPMAP_MODES} [options.mipmap] - If mipmapping is enabled for texture
         * @param {number} [options.anisotropicLevel] - Anisotropic filtering level of texture
         * @param {PIXI.WRAP_MODES} [options.wrapMode] - Wrap mode for textures
         * @param {PIXI.SCALE_MODES} [options.scaleMode] - Default scale mode, linear, nearest
         * @param {PIXI.FORMATS} [options.format] - GL format type
         * @param {PIXI.TYPES} [options.type] - GL data type
         * @param {PIXI.TARGETS} [options.target] - GL texture target
         * @param {PIXI.ALPHA_MODES} [options.alphaMode] - Pre multiply the image alpha
         * @param {number} [options.width=0] - Width of the texture
         * @param {number} [options.height=0] - Height of the texture
         * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - Resolution of the base texture
         * @param {object} [options.resourceOptions] - Optional resource options,
         *        see {@link PIXI.autoDetectResource autoDetectResource}
         */
        constructor(resource?: R | ImageSource | string | any, options?: IBaseTextureOptions<RO>);
        /**
         * Pixel width of the source of this texture
         * @readonly
         */
        get realWidth(): number;
        /**
         * Pixel height of the source of this texture
         * @readonly
         */
        get realHeight(): number;
        /**
         * Mipmap mode of the texture, affects downscaled images
         * @default PIXI.MIPMAP_MODES.POW2
         */
        get mipmap(): MIPMAP_MODES;
        set mipmap(value: MIPMAP_MODES);
        /**
         * The scale mode to apply when scaling this texture
         * @default PIXI.SCALE_MODES.LINEAR
         */
        get scaleMode(): SCALE_MODES;
        set scaleMode(value: SCALE_MODES);
        /**
         * How the texture wraps
         * @default PIXI.WRAP_MODES.CLAMP
         */
        get wrapMode(): WRAP_MODES;
        set wrapMode(value: WRAP_MODES);
        /**
         * Changes style options of BaseTexture
         * @param scaleMode - Pixi scalemode
         * @param mipmap - enable mipmaps
         * @returns - this
         */
        setStyle(scaleMode?: SCALE_MODES, mipmap?: MIPMAP_MODES): this;
        /**
         * Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.
         * @param desiredWidth - Desired visual width
         * @param desiredHeight - Desired visual height
         * @param resolution - Optionally set resolution
         * @returns - this
         */
        setSize(desiredWidth: number, desiredHeight: number, resolution?: number): this;
        /**
         * Sets real size of baseTexture, preserves current resolution.
         * @param realWidth - Full rendered width
         * @param realHeight - Full rendered height
         * @param resolution - Optionally set resolution
         * @returns - this
         */
        setRealSize(realWidth: number, realHeight: number, resolution?: number): this;
        /**
         * Refresh check for isPowerOfTwo texture based on size
         * @private
         */
        protected _refreshPOT(): void;
        /**
         * Changes resolution
         * @param resolution - res
         * @returns - this
         */
        setResolution(resolution: number): this;
        /**
         * Sets the resource if it wasn't set. Throws error if resource already present
         * @param resource - that is managing this BaseTexture
         * @returns - this
         */
        setResource(resource: R): this;
        /** Invalidates the object. Texture becomes valid if width and height are greater than zero. */
        update(): void;
        /**
         * Handle errors with resources.
         * @private
         * @param event - Error event emitted.
         */
        onError(event: ErrorEvent): void;
        /**
         * Destroys this base texture.
         * The method stops if resource doesn't want this texture to be destroyed.
         * Removes texture from all caches.
         * @fires PIXI.BaseTexture#destroyed
         */
        destroy(): void;
        /**
         * Frees the texture from WebGL memory without destroying this texture object.
         * This means you can still use the texture later which will upload it to GPU
         * memory again.
         * @fires PIXI.BaseTexture#dispose
         */
        dispose(): void;
        /** Utility function for BaseTexture|Texture cast. */
        castToBaseTexture(): BaseTexture;
        /**
         * Helper function that creates a base texture based on the source you provide.
         * The source can be - image url, image element, canvas element. If the
         * source is an image url or an image element and not in the base texture
         * cache, it will be created and loaded.
         * @static
         * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas|string|string[]} source - The
         *        source to create base texture from.
         * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
         * @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
         * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
         * @returns {PIXI.BaseTexture} The new base texture.
         */
        static from<R extends Resource = Resource, RO = IAutoDetectOptions>(source: ImageSource | string | string[], options?: IBaseTextureOptions<RO>, strict?: boolean): BaseTexture<R>;
        /**
         * Create a new Texture with a BufferResource from a typed array.
         * @param buffer - The optional array to use. If no data is provided, a new Float32Array is created.
         * @param width - Width of the resource
         * @param height - Height of the resource
         * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
         *        Default properties are different from the constructor's defaults.
         * @param {PIXI.FORMATS} [options.format] - The format is not given, the type is inferred from the
         *        type of the buffer: `RGBA` if Float32Array, Int8Array, Uint8Array, or Uint8ClampedArray,
         *        otherwise `RGBA_INTEGER`.
         * @param {PIXI.TYPES} [options.type] - The type is not given, the type is inferred from the
         *        type of the buffer. Maps Float32Array to `FLOAT`, Int32Array to `INT`, Uint32Array to
         *        `UNSIGNED_INT`, Int16Array to `SHORT`, Uint16Array to `UNSIGNED_SHORT`, Int8Array to `BYTE`,
         *        Uint8Array/Uint8ClampedArray to `UNSIGNED_BYTE`.
         * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.NPM]
         * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.SCALE_MODES.NEAREST]
         * @returns - The resulting new BaseTexture
         */
        static fromBuffer(buffer: BufferType, width: number, height: number, options?: IBaseTextureOptions<IBufferResourceOptions>): BaseTexture<BufferResource>;
        /**
         * Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
         * @param {PIXI.BaseTexture} baseTexture - The BaseTexture to add to the cache.
         * @param {string} id - The id that the BaseTexture will be stored against.
         */
        static addToCache(baseTexture: BaseTexture, id: string): void;
        /**
         * Remove a BaseTexture from the global BaseTextureCache.
         * @param {string|PIXI.BaseTexture} baseTexture - id of a BaseTexture to be removed, or a BaseTexture instance itself.
         * @returns {PIXI.BaseTexture|null} The BaseTexture that was removed.
         */
        static removeFromCache(baseTexture: string | BaseTexture): BaseTexture | null;
        /** Global number of the texture batch, used by multi-texture renderers. */
        static _globalBatch: number;
    }
}
declare module "packages/core/src/batch/BatchTextureArray" {
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    /**
     * Used by the batcher to build texture batches.
     * Holds list of textures and their respective locations.
     * @memberof PIXI
     */
    export class BatchTextureArray {
        /** Inside textures array. */
        elements: BaseTexture[];
        /** Respective locations for textures. */
        ids: number[];
        /** Number of filled elements. */
        count: number;
        constructor();
        clear(): void;
    }
}
declare module "packages/core/src/batch/BatchSystem" {
    import { ObjectRenderer } from "packages/core/src/batch/ObjectRenderer";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { BatchTextureArray } from "packages/core/src/batch/BatchTextureArray";
    /**
     * System plugin to the renderer to manage batching.
     * @memberof PIXI
     */
    export class BatchSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** An empty renderer. */
        readonly emptyRenderer: ObjectRenderer;
        /** The currently active ObjectRenderer. */
        currentRenderer: ObjectRenderer;
        private renderer;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        /**
         * Changes the current renderer to the one given in parameter
         * @param objectRenderer - The object renderer to use.
         */
        setObjectRenderer(objectRenderer: ObjectRenderer): void;
        /**
         * This should be called if you wish to do some custom rendering
         * It will basically render anything that may be batched up such as sprites
         */
        flush(): void;
        /** Reset the system to an empty renderer */
        reset(): void;
        /**
         * Handy function for batch renderers: copies bound textures in first maxTextures locations to array
         * sets actual _batchLocation for them
         * @param arr - arr copy destination
         * @param maxTextures - number of copied elements
         */
        copyBoundTextures(arr: BaseTexture[], maxTextures: number): void;
        /**
         * Assigns batch locations to textures in array based on boundTextures state.
         * All textures in texArray should have `_batchEnabled = _batchId`,
         * and their count should be less than `maxTextures`.
         * @param texArray - textures to bound
         * @param boundTextures - current state of bound textures
         * @param batchId - marker for _batchEnabled param of textures in texArray
         * @param maxTextures - number of texture locations to manipulate
         */
        boundArray(texArray: BatchTextureArray, boundTextures: Array<BaseTexture>, batchId: number, maxTextures: number): void;
        /**
         * @ignore
         */
        destroy(): void;
    }
}
declare module "packages/core/src/context/WebGLExtensions" {
    export interface WEBGL_compressed_texture_pvrtc {
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG: number;
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: number;
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG: number;
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: number;
    }
    export interface WEBGL_compressed_texture_etc {
        COMPRESSED_R11_EAC: number;
        COMPRESSED_SIGNED_R11_EAC: number;
        COMPRESSED_RG11_EAC: number;
        COMPRESSED_SIGNED_RG11_EAC: number;
        COMPRESSED_RGB8_ETC2: number;
        COMPRESSED_RGBA8_ETC2_EAC: number;
        COMPRESSED_SRGB8_ETC2: number;
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: number;
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: number;
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: number;
    }
    export interface WEBGL_compressed_texture_etc1 {
        COMPRESSED_RGB_ETC1_WEBGL: number;
    }
    export interface WEBGL_compressed_texture_atc {
        COMPRESSED_RGB_ATC_WEBGL: number;
        COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: number;
        COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: number;
    }
    export interface WebGLExtensions {
        drawBuffers?: WEBGL_draw_buffers;
        depthTexture?: OES_texture_float;
        loseContext?: WEBGL_lose_context;
        vertexArrayObject?: OES_vertex_array_object;
        anisotropicFiltering?: EXT_texture_filter_anisotropic;
        uint32ElementIndex?: OES_element_index_uint;
        floatTexture?: OES_texture_float;
        floatTextureLinear?: OES_texture_float_linear;
        textureHalfFloat?: OES_texture_half_float;
        textureHalfFloatLinear?: OES_texture_half_float_linear;
        colorBufferFloat?: WEBGL_color_buffer_float;
        s3tc?: WEBGL_compressed_texture_s3tc;
        s3tc_sRGB?: WEBGL_compressed_texture_s3tc_srgb;
        etc?: WEBGL_compressed_texture_etc;
        etc1?: WEBGL_compressed_texture_etc1;
        pvrtc?: WEBGL_compressed_texture_pvrtc;
        atc?: WEBGL_compressed_texture_atc;
        astc?: WEBGL_compressed_texture_astc;
    }
}
declare module "packages/core/src/context/ContextSystem" {
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { ICanvas } from "packages/settings/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { WebGLExtensions } from "packages/core/src/context/WebGLExtensions";
    /**
     * Options for the context system.
     * @memberof PIXI
     */
    export interface ContextSystemOptions {
        /**
         * **Deprecated since 7.0.0, use `premultipliedAlpha` and `backgroundAlpha` instead.**
         *
         * Pass-through value for canvas' context attribute `alpha`. This option is for cases where the
         * canvas needs to be opaque, possibly for performance reasons on some older devices.
         * If you want to set transparency, please use `backgroundAlpha`.
         *
         * **WebGL Only:** When set to `'notMultiplied'`, the canvas' context attribute `alpha` will be
         * set to `true` and `premultipliedAlpha` will be to `false`.
         * @deprecated since 7.0.0
         * @memberof PIXI.IRendererOptions
         */
        useContextAlpha?: boolean | 'notMultiplied';
        /**
         * **WebGL Only.** User-provided WebGL rendering context object.
         * @memberof PIXI.IRendererOptions
         */
        context: IRenderingContext | null;
        /**
         * **WebGL Only.** Whether to enable anti-aliasing. This may affect performance.
         * @memberof PIXI.IRendererOptions
         */
        antialias: boolean;
        /**
         * **WebGL Only.** A hint indicating what configuration of GPU is suitable for the WebGL context,
         * can be `'default'`, `'high-performance'` or `'low-power'`.
         * Setting to `'high-performance'` will prioritize rendering performance over power consumption,
         * while setting to `'low-power'` will prioritize power saving over rendering performance.
         * @memberof PIXI.IRendererOptions
         */
        powerPreference: WebGLPowerPreference;
        /**
         * **WebGL Only.** Whether the compositor will assume the drawing buffer contains colors with premultiplied alpha.
         * @memberof PIXI.IRendererOptions
         */
        premultipliedAlpha: boolean;
        /**
         * **WebGL Only.** Whether to enable drawing buffer preservation. If enabled, the drawing buffer will preserve
         * its value until cleared or overwritten. Enable this if you need to call `toDataUrl` on the WebGL context.
         * @memberof PIXI.IRendererOptions
         */
        preserveDrawingBuffer: boolean;
    }
    export interface ISupportDict {
        uint32Indices: boolean;
    }
    /**
     * System plugin to the renderer to manage the context.
     * @memberof PIXI
     */
    export class ContextSystem implements ISystem<ContextSystemOptions> {
        /** @ignore */
        static defaultOptions: ContextSystemOptions;
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * Either 1 or 2 to reflect the WebGL version being used.
         * @readonly
         */
        webGLVersion: number;
        /**
         * Features supported by current context.
         * @type {object}
         * @readonly
         * @property {boolean} uint32Indices - Support for 32-bit indices buffer.
         */
        readonly supports: ISupportDict;
        preserveDrawingBuffer: boolean;
        powerPreference: WebGLPowerPreference;
        /**
         * Pass-thru setting for the canvas' context `alpha` property. This is typically
         * not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.
         * @member {boolean}
         * @deprecated since 7.0.0
         */
        useContextAlpha: boolean | 'notMultiplied';
        protected CONTEXT_UID: number;
        protected gl: IRenderingContext;
        /**
         * Extensions available.
         * @type {object}
         * @readonly
         * @property {WEBGL_draw_buffers} drawBuffers - WebGL v1 extension
         * @property {WEBGL_depth_texture} depthTexture - WebGL v1 extension
         * @property {OES_texture_float} floatTexture - WebGL v1 extension
         * @property {WEBGL_lose_context} loseContext - WebGL v1 extension
         * @property {OES_vertex_array_object} vertexArrayObject - WebGL v1 extension
         * @property {EXT_texture_filter_anisotropic} anisotropicFiltering - WebGL v1 and v2 extension
         */
        extensions: WebGLExtensions;
        private renderer;
        /** @param renderer - The renderer this System works for. */
        constructor(renderer: Renderer);
        /**
         * `true` if the context is lost
         * @readonly
         */
        get isLost(): boolean;
        /**
         * Handles the context change event.
         * @param {WebGLRenderingContext} gl - New WebGL context.
         */
        protected contextChange(gl: IRenderingContext): void;
        init(options: ContextSystemOptions): void;
        /**
         * Initializes the context.
         * @protected
         * @param {WebGLRenderingContext} gl - WebGL context
         */
        initFromContext(gl: IRenderingContext): void;
        /**
         * Initialize from context options
         * @protected
         * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
         * @param {object} options - context attributes
         */
        initFromOptions(options: WebGLContextAttributes): void;
        /**
         * Helper class to create a WebGL Context
         * @param canvas - the canvas element that we will get the context from
         * @param options - An options object that gets passed in to the canvas element containing the
         *    context attributes
         * @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
         * @returns {WebGLRenderingContext} the WebGL context
         */
        createContext(canvas: ICanvas, options: WebGLContextAttributes): IRenderingContext;
        /** Auto-populate the {@link PIXI.ContextSystem.extensions extensions}. */
        protected getExtensions(): void;
        /**
         * Handles a lost webgl context
         * @param {WebGLContextEvent} event - The context lost event.
         */
        protected handleContextLost(event: WebGLContextEvent): void;
        /** Handles a restored webgl context. */
        protected handleContextRestored(): void;
        destroy(): void;
        /** Handle the post-render runner event. */
        protected postrender(): void;
        /**
         * Validate context.
         * @param {WebGLRenderingContext} gl - Render context.
         */
        protected validateContext(gl: IRenderingContext): void;
    }
}
declare module "packages/core/src/framebuffer/GLFramebuffer" {
    import { MSAA_QUALITY } from "packages/constants/src/index";
    import type { Framebuffer } from "packages/core/src/framebuffer/Framebuffer";
    /**
     * Internal framebuffer for WebGL context.
     * @memberof PIXI
     */
    export class GLFramebuffer {
        /** The WebGL framebuffer. */
        framebuffer: WebGLFramebuffer;
        /** The renderbuffer for depth and/or stencil (DEPTH24_STENCIL8, DEPTH_COMPONENT24, or STENCIL_INDEX8) */
        stencil: WebGLRenderbuffer;
        /** Detected AA samples number. */
        multisample: MSAA_QUALITY;
        /** In case MSAA, we use this Renderbuffer instead of colorTextures[0] when we write info. */
        msaaBuffer: WebGLRenderbuffer;
        /**
         * In case we use MSAA, this is actual framebuffer that has colorTextures[0]
         * The contents of that framebuffer are read when we use that renderTexture in sprites
         */
        blitFramebuffer: Framebuffer;
        /** Latest known version of framebuffer. */
        dirtyId: number;
        /** Latest known version of framebuffer format. */
        dirtyFormat: number;
        /** Latest known version of framebuffer size. */
        dirtySize: number;
        /** Store the current mipmap of the textures the framebuffer will write too. */
        mipLevel: number;
        constructor(framebuffer: WebGLTexture);
    }
}
declare module "packages/core/src/framebuffer/Framebuffer" {
    import { MSAA_QUALITY } from "packages/constants/src/index";
    import { Runner } from "packages/runner/src/index";
    import { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { GLFramebuffer } from "packages/core/src/framebuffer/GLFramebuffer";
    /**
     * A framebuffer can be used to render contents off of the screen. {@link PIXI.BaseRenderTexture} uses
     * one internally to render into itself. You can attach a depth or stencil buffer to a framebuffer.
     *
     * On WebGL 2 machines, shaders can output to multiple textures simultaneously with GLSL 300 ES.
     * @memberof PIXI
     */
    export class Framebuffer {
        /** Width of framebuffer in pixels. */
        width: number;
        /** Height of framebuffer in pixels. */
        height: number;
        /**
         * Desired number of samples for antialiasing. 0 means AA should not be used.
         *
         * Experimental WebGL2 feature, allows to use antialiasing in individual renderTextures.
         * Antialiasing is the same as for main buffer with renderer `antialias: true` options.
         * Seriously affects GPU memory consumption and GPU performance.
         * @example
         * import { MSAA_QUALITY } from 'pixi.js';
         *
         * renderTexture.framebuffer.multisample = MSAA_QUALITY.HIGH;
         * // ...
         * renderer.render(myContainer, { renderTexture });
         * renderer.framebuffer.blit(); // Copies data from MSAA framebuffer to texture
         * @default PIXI.MSAA_QUALITY.NONE
         */
        multisample: MSAA_QUALITY;
        stencil: boolean;
        depth: boolean;
        dirtyId: number;
        dirtyFormat: number;
        dirtySize: number;
        depthTexture: BaseTexture;
        colorTextures: Array<BaseTexture>;
        glFramebuffers: {
            [key: string]: GLFramebuffer;
        };
        disposeRunner: Runner;
        /**
         * @param width - Width of the frame buffer
         * @param height - Height of the frame buffer
         */
        constructor(width: number, height: number);
        /**
         * Reference to the colorTexture.
         * @readonly
         */
        get colorTexture(): BaseTexture;
        /**
         * Add texture to the colorTexture array.
         * @param index - Index of the array to add the texture to
         * @param texture - Texture to add to the array
         */
        addColorTexture(index?: number, texture?: BaseTexture): this;
        /**
         * Add a depth texture to the frame buffer.
         * @param texture - Texture to add.
         */
        addDepthTexture(texture?: BaseTexture): this;
        /** Enable depth on the frame buffer. */
        enableDepth(): this;
        /** Enable stencil on the frame buffer. */
        enableStencil(): this;
        /**
         * Resize the frame buffer
         * @param width - Width of the frame buffer to resize to
         * @param height - Height of the frame buffer to resize to
         */
        resize(width: number, height: number): void;
        /** Disposes WebGL resources that are connected to this geometry. */
        dispose(): void;
        /** Destroys and removes the depth texture added to this framebuffer. */
        destroyDepthTexture(): void;
    }
}
declare module "packages/core/src/shader/GLProgram" {
    import type { Dict } from "packages/utils/src/index";
    /**
     * @private
     */
    export class IGLUniformData {
        location: WebGLUniformLocation;
        value: number | boolean | Float32Array | Int32Array | Uint32Array | boolean[];
    }
    /**
     * Helper class to create a WebGL Program
     * @memberof PIXI
     */
    export class GLProgram {
        /** The shader program. */
        program: WebGLProgram;
        /**
         * Holds the uniform data which contains uniform locations
         * and current uniform values used for caching and preventing unneeded GPU commands.
         */
        uniformData: Dict<any>;
        /**
         * UniformGroups holds the various upload functions for the shader. Each uniform group
         * and program have a unique upload function generated.
         */
        uniformGroups: Dict<any>;
        /** A hash that stores where UBOs are bound to on the program. */
        uniformBufferBindings: Dict<any>;
        /** A hash for lazily-generated uniform uploading functions. */
        uniformSync: Dict<any>;
        /**
         * A place where dirty ticks are stored for groups
         * If a tick here does not match with the Higher level Programs tick, it means
         * we should re upload the data.
         */
        uniformDirtyGroups: Dict<any>;
        /**
         * Makes a new Pixi program.
         * @param program - webgl program
         * @param uniformData - uniforms
         */
        constructor(program: WebGLProgram, uniformData: {
            [key: string]: IGLUniformData;
        });
        /** Destroys this program. */
        destroy(): void;
    }
}
declare module "packages/core/src/shader/Program" {
    import { PRECISION } from "packages/constants/src/index";
    import type { GLProgram } from "packages/core/src/shader/GLProgram";
    export interface IAttributeData {
        type: string;
        size: number;
        location: number;
        name: string;
    }
    export interface IUniformData {
        index: number;
        type: string;
        size: number;
        isArray: boolean;
        value: any;
        name: string;
    }
    export interface IProgramExtraData {
        transformFeedbackVaryings?: {
            names: string[];
            bufferMode: 'separate' | 'interleaved';
        };
    }
    /**
     * Helper class to create a shader program.
     * @memberof PIXI
     */
    export class Program {
        /**
         * Default specify float precision in vertex shader.
         * @static
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.HIGH
         */
        static defaultVertexPrecision: PRECISION;
        /**
         * Default specify float precision in fragment shader.
         * iOS is best set at highp due to https://github.com/pixijs/pixijs/issues/3742
         * @static
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.MEDIUM
         */
        static defaultFragmentPrecision: PRECISION;
        id: number;
        /** Source code for the vertex shader. */
        vertexSrc: string;
        /** Source code for the fragment shader. */
        fragmentSrc: string;
        nameCache: any;
        glPrograms: {
            [key: number]: GLProgram;
        };
        syncUniforms: any;
        /** Assigned when a program is first bound to the shader system. */
        attributeData: {
            [key: string]: IAttributeData;
        };
        /** Assigned when a program is first bound to the shader system. */
        uniformData: {
            [key: string]: IUniformData;
        };
        extra: IProgramExtraData;
        /**
         * @param vertexSrc - The source of the vertex shader.
         * @param fragmentSrc - The source of the fragment shader.
         * @param name - Name for shader
         * @param extra - Extra data for shader
         */
        constructor(vertexSrc?: string, fragmentSrc?: string, name?: string, extra?: IProgramExtraData);
        /**
         * The default vertex shader source.
         * @readonly
         */
        static get defaultVertexSrc(): string;
        /**
         * The default fragment shader source.
         * @readonly
         */
        static get defaultFragmentSrc(): string;
        /**
         * A short hand function to create a program based of a vertex and fragment shader.
         *
         * This method will also check to see if there is a cached program.
         * @param vertexSrc - The source of the vertex shader.
         * @param fragmentSrc - The source of the fragment shader.
         * @param name - Name for shader
         * @returns A shiny new PixiJS shader program!
         */
        static from(vertexSrc?: string, fragmentSrc?: string, name?: string): Program;
    }
}
declare module "packages/core/src/shader/Shader" {
    import { Runner } from "packages/runner/src/index";
    import { Program } from "packages/core/src/shader/Program";
    import { UniformGroup } from "packages/core/src/shader/UniformGroup";
    import type { Dict } from "packages/utils/src/index";
    /**
     * A helper class for shaders.
     * @memberof PIXI
     */
    export class Shader {
        /** Program that the shader uses. */
        program: Program;
        uniformGroup: UniformGroup;
        /**
         * Used internally to bind uniform buffer objects.
         * @ignore
         */
        uniformBindCount: number;
        disposeRunner: Runner;
        /**
         * @param program - The program the shader will use.
         * @param uniforms - Custom uniforms to use to augment the built-in ones.
         */
        constructor(program: Program, uniforms?: Dict<any>);
        checkUniformExists(name: string, group: UniformGroup): boolean;
        destroy(): void;
        /**
         * Shader uniform values, shortcut for `uniformGroup.uniforms`.
         * @readonly
         */
        get uniforms(): Dict<any>;
        /**
         * A short hand function to create a shader based of a vertex and fragment shader.
         * @param vertexSrc - The source of the vertex shader.
         * @param fragmentSrc - The source of the fragment shader.
         * @param uniforms - Custom uniforms to use to augment the built-in ones.
         * @returns A shiny new PixiJS shader!
         */
        static from(vertexSrc?: string, fragmentSrc?: string, uniforms?: Dict<any>): Shader;
    }
}
declare module "packages/core/src/state/State" {
    import { BLEND_MODES } from "packages/constants/src/index";
    /**
     * This is a WebGL state, and is is passed to {@link PIXI.StateSystem}.
     *
     * Each mesh rendered may require WebGL to be in a different state.
     * For example you may want different blend mode or to enable polygon offsets
     * @memberof PIXI
     */
    export class State {
        data: number;
        _blendMode: BLEND_MODES;
        _polygonOffset: number;
        constructor();
        /**
         * Activates blending of the computed fragment color values.
         * @default true
         */
        get blend(): boolean;
        set blend(value: boolean);
        /**
         * Activates adding an offset to depth values of polygon's fragments
         * @default false
         */
        get offsets(): boolean;
        set offsets(value: boolean);
        /**
         * Activates culling of polygons.
         * @default false
         */
        get culling(): boolean;
        set culling(value: boolean);
        /**
         * Activates depth comparisons and updates to the depth buffer.
         * @default false
         */
        get depthTest(): boolean;
        set depthTest(value: boolean);
        /**
         * Enables or disables writing to the depth buffer.
         * @default true
         */
        get depthMask(): boolean;
        set depthMask(value: boolean);
        /**
         * Specifies whether or not front or back-facing polygons can be culled.
         * @default false
         */
        get clockwiseFrontFace(): boolean;
        set clockwiseFrontFace(value: boolean);
        /**
         * The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
         * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
         * @default PIXI.BLEND_MODES.NORMAL
         */
        get blendMode(): BLEND_MODES;
        set blendMode(value: BLEND_MODES);
        /**
         * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
         * @default 0
         */
        get polygonOffset(): number;
        set polygonOffset(value: number);
        toString(): string;
        static for2d(): State;
    }
}
declare module "packages/core/src/textures/TextureUvs" {
    import type { ISize, Rectangle } from "packages/math/src/index";
    /**
     * Stores a texture's frame in UV coordinates, in
     * which everything lies in the rectangle `[(0,0), (1,0),
     * (1,1), (0,1)]`.
     *
     * | Corner       | Coordinates |
     * |--------------|-------------|
     * | Top-Left     | `(x0,y0)`   |
     * | Top-Right    | `(x1,y1)`   |
     * | Bottom-Right | `(x2,y2)`   |
     * | Bottom-Left  | `(x3,y3)`   |
     * @protected
     * @memberof PIXI
     */
    export class TextureUvs {
        /** X-component of top-left corner `(x0,y0)`. */
        x0: number;
        /** Y-component of top-left corner `(x0,y0)`. */
        y0: number;
        /** X-component of top-right corner `(x1,y1)`. */
        x1: number;
        /** Y-component of top-right corner `(x1,y1)`. */
        y1: number;
        /** X-component of bottom-right corner `(x2,y2)`. */
        x2: number;
        /** Y-component of bottom-right corner `(x2,y2)`. */
        y2: number;
        /** X-component of bottom-left corner `(x3,y3)`. */
        x3: number;
        /** Y-component of bottom-right corner `(x3,y3)`. */
        y3: number;
        uvsFloat32: Float32Array;
        constructor();
        /**
         * Sets the texture Uvs based on the given frame information.
         * @protected
         * @param frame - The frame of the texture
         * @param baseFrame - The base frame of the texture
         * @param rotate - Rotation of frame, see {@link PIXI.groupD8}
         */
        set(frame: Rectangle, baseFrame: ISize, rotate: number): void;
        toString(): string;
    }
}
declare module "packages/core/src/textures/resources/CanvasResource" {
    import { BaseImageResource } from "packages/core/src/textures/resources/BaseImageResource";
    import type { ICanvas } from "packages/settings/src/index";
    /**
     * Resource type for HTMLCanvasElement and OffscreenCanvas.
     * @memberof PIXI
     */
    export class CanvasResource extends BaseImageResource {
        /**
         * @param source - Canvas element to use
         */
        constructor(source: ICanvas);
        /**
         * Used to auto-detect the type of resource.
         * @param {*} source - The source object
         * @returns {boolean} `true` if source is HTMLCanvasElement or OffscreenCanvas
         */
        static test(source: unknown): source is OffscreenCanvas | HTMLCanvasElement;
    }
}
declare module "packages/core/src/textures/TextureMatrix" {
    import { Matrix } from "packages/math/src/index";
    import type { Texture } from "packages/core/src/textures/Texture";
    /**
     * Class controls uv mapping from Texture normal space to BaseTexture normal space.
     *
     * Takes `trim` and `rotate` into account. May contain clamp settings for Meshes and TilingSprite.
     *
     * Can be used in Texture `uvMatrix` field, or separately, you can use different clamp settings on the same texture.
     * If you want to add support for texture region of certain feature or filter, that's what you're looking for.
     *
     * Takes track of Texture changes through `_lastTextureID` private field.
     * Use `update()` method call to track it from outside.
     * @see PIXI.Texture
     * @see PIXI.Mesh
     * @see PIXI.TilingSprite
     * @memberof PIXI
     */
    export class TextureMatrix {
        /**
         * Matrix operation that converts texture region coords to texture coords
         * @readonly
         */
        mapCoord: Matrix;
        /**
         * Changes frame clamping
         * Works with TilingSprite and Mesh
         * Change to 1.5 if you texture has repeated right and bottom lines, that leads to smoother borders
         * @default 0
         */
        clampOffset: number;
        /**
         * Changes frame clamping
         * Works with TilingSprite and Mesh
         * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
         * @default 0.5
         */
        clampMargin: number;
        /**
         * Clamp region for normalized coords, left-top pixel center in xy , bottom-right in zw.
         * Calculated based on clampOffset.
         */
        readonly uClampFrame: Float32Array;
        /** Normalized clamp offset. Calculated based on clampOffset. */
        readonly uClampOffset: Float32Array;
        /**
         * Tracks Texture frame changes.
         * @protected
         */
        _textureID: number;
        /**
         * Tracks Texture frame changes.
         * @protected
         */
        _updateID: number;
        _texture: Texture;
        /**
         * If texture size is the same as baseTexture.
         * @default false
         * @readonly
         */
        isSimple: boolean;
        /**
         * @param texture - observed texture
         * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
         */
        constructor(texture: Texture, clampMargin?: number);
        /** Texture property. */
        get texture(): Texture;
        set texture(value: Texture);
        /**
         * Multiplies uvs array to transform
         * @param uvs - mesh uvs
         * @param [out=uvs] - output
         * @returns - output
         */
        multiplyUvs(uvs: Float32Array, out?: Float32Array): Float32Array;
        /**
         * Updates matrices if texture was changed.
         * @param [forceUpdate=false] - if true, matrices will be updated any case
         * @returns - Whether or not it was updated
         */
        update(forceUpdate?: boolean): boolean;
    }
}
declare module "packages/core/src/textures/Texture" {
    import { Point, Rectangle } from "packages/math/src/index";
    import { EventEmitter } from "packages/utils/src/index";
    import { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import { TextureUvs } from "packages/core/src/textures/TextureUvs";
    import type { IPointData } from "packages/math/src/index";
    import type { IBaseTextureOptions, ImageSource } from "packages/core/src/textures/BaseTexture";
    import type { BufferResource, BufferType, IBufferResourceOptions } from "packages/core/src/textures/resources/BufferResource";
    import type { CanvasResource } from "packages/core/src/textures/resources/CanvasResource";
    import type { Resource } from "packages/core/src/textures/resources/Resource";
    import type { TextureMatrix } from "packages/core/src/textures/TextureMatrix";
    export type TextureSource = string | BaseTexture | ImageSource;
    /**
     * Stores the width of the non-scalable borders, for example when used with {@link PIXI.NineSlicePlane} texture.
     * @memberof PIXI
     * @since 7.2.0
     */
    export interface ITextureBorders {
        /** left border in pixels */
        left: number;
        /** top border in pixels */
        top: number;
        /** right border in pixels */
        right: number;
        /** bottom border in pixels */
        bottom: number;
    }
    export interface Texture extends GlobalMixins.Texture, EventEmitter {
    }
    /**
     * A texture stores the information that represents an image or part of an image.
     *
     * It cannot be added to the display list directly; instead use it as the texture for a Sprite.
     * If no frame is provided for a texture, then the whole image is used.
     *
     * You can directly create a texture from an image and then reuse it multiple times like this :
     *
     * ```js
     * import { Sprite, Texture } from 'pixi.js';
     *
     * const texture = Texture.from('assets/image.png');
     * const sprite1 = new Sprite(texture);
     * const sprite2 = new Sprite(texture);
     * ```
     *
     * If you didnt pass the texture frame to constructor, it enables `noFrame` mode:
     * it subscribes on baseTexture events, it automatically resizes at the same time as baseTexture.
     *
     * Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
     * You can check for this by checking the sprite's _textureID property.
     *
     * ```js
     * import { Sprite, Texture } from 'pixi.js';
     *
     * const texture = Texture.from('assets/image.svg');
     * const sprite1 = new Sprite(texture);
     * // sprite1._textureID should not be undefined if the texture has finished processing the SVG file
     * ```
     *
     * You can use a ticker or rAF to ensure your sprites load the finished textures after processing.
     * See issue [#3085]{@link https://github.com/pixijs/pixijs/issues/3085}.
     * @memberof PIXI
     * @typeParam R - The BaseTexture's Resource type.
     */
    export class Texture<R extends Resource = Resource> extends EventEmitter {
        /** The base texture that this texture uses. */
        baseTexture: BaseTexture<R>;
        /** This is the area of original texture, before it was put in atlas. */
        orig: Rectangle;
        /**
         * This is the trimmed area of original texture, before it was put in atlas
         * Please call `updateUvs()` after you change coordinates of `trim` manually.
         */
        trim: Rectangle;
        /** This will let the renderer know if the texture is valid. If it's not then it cannot be rendered. */
        valid: boolean;
        /**
         * Does this Texture have any frame data assigned to it?
         *
         * This mode is enabled automatically if no frame was passed inside constructor.
         *
         * In this mode texture is subscribed to baseTexture events, and fires `update` on any change.
         *
         * Beware, after loading or resize of baseTexture event can fired two times!
         * If you want more control, subscribe on baseTexture itself.
         *
         * Any assignment of `frame` switches off `noFrame` mode.
         * @example
         * texture.on('update', () => {});
         */
        noFrame: boolean;
        /**
         * Anchor point that is used as default if sprite is created with this texture.
         * Changing the `defaultAnchor` at a later point of time will not update Sprite's anchor point.
         * @default {0,0}
         */
        defaultAnchor: Point;
        /**
         * Default width of the non-scalable border that is used if 9-slice plane is created with this texture.
         * @since 7.2.0
         * @see PIXI.NineSlicePlane
         */
        defaultBorders?: ITextureBorders;
        /** Default TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
        uvMatrix: TextureMatrix;
        protected _rotate: number;
        /**
         * Update ID is observed by sprites and TextureMatrix instances.
         * Call updateUvs() to increment it.
         * @protected
         */
        _updateID: number;
        /**
         * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
         * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
         */
        _frame: Rectangle;
        /**
         * The WebGL UV data cache. Can be used as quad UV.
         * @protected
         */
        _uvs: TextureUvs;
        /**
         * The ids under which this Texture has been added to the texture cache. This is
         * automatically set as long as Texture.addToCache is used, but may not be set if a
         * Texture is added directly to the TextureCache array.
         */
        textureCacheIds: Array<string>;
        /**
         * @param baseTexture - The base texture source to create the texture from
         * @param frame - The rectangle frame of the texture to show
         * @param orig - The area of original texture
         * @param trim - Trimmed rectangle of original texture
         * @param rotate - indicates how the texture was rotated by texture packer. See {@link PIXI.groupD8}
         * @param anchor - Default anchor point used for sprite placement / rotation
         * @param borders - Default borders used for 9-slice scaling. See {@link PIXI.NineSlicePlane}
         */
        constructor(baseTexture: BaseTexture<R>, frame?: Rectangle, orig?: Rectangle, trim?: Rectangle, rotate?: number, anchor?: IPointData, borders?: ITextureBorders);
        /**
         * Updates this texture on the gpu.
         *
         * Calls the TextureResource update.
         *
         * If you adjusted `frame` manually, please call `updateUvs()` instead.
         */
        update(): void;
        /**
         * Called when the base texture is updated
         * @protected
         * @param baseTexture - The base texture.
         */
        onBaseTextureUpdated(baseTexture: BaseTexture): void;
        /**
         * Destroys this texture
         * @param [destroyBase=false] - Whether to destroy the base texture as well
         */
        destroy(destroyBase?: boolean): void;
        /**
         * Creates a new texture object that acts the same as this one.
         * @returns - The new texture
         */
        clone(): Texture;
        /**
         * Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
         * Call it after changing the frame
         */
        updateUvs(): void;
        /**
         * Helper function that creates a new Texture based on the source you provide.
         * The source can be - frame id, image url, video url, canvas element, video element, base texture
         * @param {string|PIXI.BaseTexture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source -
         *        Source or array of sources to create texture from
         * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
         * @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
         * @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
         * @returns {PIXI.Texture} The newly created texture
         */
        static from<R extends Resource = Resource, RO = any>(source: TextureSource | TextureSource[], options?: IBaseTextureOptions<RO>, strict?: boolean): Texture<R>;
        /**
         * Useful for loading textures via URLs. Use instead of `Texture.from` because
         * it does a better job of handling failed URLs more effectively. This also ignores
         * `PIXI.settings.STRICT_TEXTURE_CACHE`. Works for Videos, SVGs, Images.
         * @param url - The remote URL or array of URLs to load.
         * @param options - Optional options to include
         * @returns - A Promise that resolves to a Texture.
         */
        static fromURL<R extends Resource = Resource, RO = any>(url: string | string[], options?: IBaseTextureOptions<RO>): Promise<Texture<R>>;
        /**
         * Create a new Texture with a BufferResource from a typed array.
         * @param buffer - The optional array to use. If no data is provided, a new Float32Array is created.
         * @param width - Width of the resource
         * @param height - Height of the resource
         * @param options - See {@link PIXI.BaseTexture}'s constructor for options.
         *        Default properties are different from the constructor's defaults.
         * @param {PIXI.FORMATS} [options.format] - The format is not given, the type is inferred from the
         *        type of the buffer: `RGBA` if Float32Array, Int8Array, Uint8Array, or Uint8ClampedArray,
         *        otherwise `RGBA_INTEGER`.
         * @param {PIXI.TYPES} [options.type] - The type is not given, the type is inferred from the
         *        type of the buffer. Maps Float32Array to `FLOAT`, Int32Array to `INT`, Uint32Array to
         *        `UNSIGNED_INT`, Int16Array to `SHORT`, Uint16Array to `UNSIGNED_SHORT`, Int8Array to `BYTE`,
         *        Uint8Array/Uint8ClampedArray to `UNSIGNED_BYTE`.
         * @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.NPM]
         * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.SCALE_MODES.NEAREST]
         * @returns - The resulting new BaseTexture
         */
        static fromBuffer(buffer: BufferType, width: number, height: number, options?: IBaseTextureOptions<IBufferResourceOptions>): Texture<BufferResource>;
        /**
         * Create a texture from a source and add to the cache.
         * @param {HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas|string} source - The input source.
         * @param imageUrl - File name of texture, for cache and resolving resolution.
         * @param name - Human readable name for the texture cache. If no name is
         *        specified, only `imageUrl` will be used as the cache ID.
         * @param options
         * @returns - Output texture
         */
        static fromLoader<R extends Resource = Resource>(source: ImageSource | string, imageUrl: string, name?: string, options?: IBaseTextureOptions): Promise<Texture<R>>;
        /**
         * Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.
         * @param texture - The Texture to add to the cache.
         * @param id - The id that the Texture will be stored against.
         */
        static addToCache(texture: Texture, id: string): void;
        /**
         * Remove a Texture from the global TextureCache.
         * @param texture - id of a Texture to be removed, or a Texture instance itself
         * @returns - The Texture that was removed
         */
        static removeFromCache(texture: string | Texture): Texture | null;
        /**
         * Returns resolution of baseTexture
         * @readonly
         */
        get resolution(): number;
        /**
         * The frame specifies the region of the base texture that this texture uses.
         * Please call `updateUvs()` after you change coordinates of `frame` manually.
         */
        get frame(): Rectangle;
        set frame(frame: Rectangle);
        /**
         * Indicates whether the texture is rotated inside the atlas
         * set to 2 to compensate for texture packer rotation
         * set to 6 to compensate for spine packer rotation
         * can be used to rotate or mirror sprites
         * See {@link PIXI.groupD8} for explanation
         */
        get rotate(): number;
        set rotate(rotate: number);
        /** The width of the Texture in pixels. */
        get width(): number;
        /** The height of the Texture in pixels. */
        get height(): number;
        /** Utility function for BaseTexture|Texture cast. */
        castToBaseTexture(): BaseTexture;
        private static _EMPTY;
        private static _WHITE;
        /** An empty texture, used often to not have to create multiple empty textures. Can not be destroyed. */
        static get EMPTY(): Texture<Resource>;
        /** A white texture of 16x16 size, used for graphics and other things Can not be destroyed. */
        static get WHITE(): Texture<CanvasResource>;
    }
}
declare module "packages/core/src/renderTexture/RenderTexture" {
    import { Texture } from "packages/core/src/textures/Texture";
    import { BaseRenderTexture } from "packages/core/src/renderTexture/BaseRenderTexture";
    import type { MSAA_QUALITY } from "packages/constants/src/index";
    import type { Rectangle } from "packages/math/src/index";
    import type { Framebuffer } from "packages/core/src/framebuffer/Framebuffer";
    import type { IBaseTextureOptions } from "packages/core/src/textures/BaseTexture";
    /**
     * A RenderTexture is a special texture that allows any PixiJS display object to be rendered to it.
     *
     * __Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded
     * otherwise black rectangles will be drawn instead.
     *
     * __Hint-2__: The actual memory allocation will happen on first render.
     * You shouldn't create renderTextures each frame just to delete them after, try to reuse them.
     *
     * A RenderTexture takes a snapshot of any Display Object given to its render method. For example:
     * @example
     * import { autoDetectRenderer, RenderTexture, Sprite } from 'pixi.js';
     *
     * const renderer = autoDetectRenderer();
     * const renderTexture = RenderTexture.create({ width: 800, height: 600 });
     * const sprite = Sprite.from('spinObj_01.png');
     *
     * sprite.position.x = 800 / 2;
     * sprite.position.y = 600 / 2;
     * sprite.anchor.x = 0.5;
     * sprite.anchor.y = 0.5;
     *
     * renderer.render(sprite, { renderTexture });
     *
     * // Note that you should not create a new renderer, but reuse the same one as the rest of the application.
     * // The Sprite in this case will be rendered using its local transform. To render this sprite at 0,0
     * // you can clear the transform
     *
     * sprite.setTransform();
     *
     * const renderTexture = new RenderTexture.create({ width: 100, height: 100 });
     *
     * renderer.render(sprite, { renderTexture });  // Renders to center of RenderTexture
     * @memberof PIXI
     */
    export class RenderTexture extends Texture {
        baseTexture: BaseRenderTexture;
        /**
         * Stores `sourceFrame` when this texture is inside current filter stack.
         *
         * You can read it inside filters.
         * @readonly
         */
        filterFrame: Rectangle | null;
        /**
         * The key for pooled texture of FilterSystem.
         * @see PIXI.RenderTexturePool
         */
        filterPoolKey: string | number | null;
        /**
         * @param baseRenderTexture - The base texture object that this texture uses.
         * @param frame - The rectangle frame of the texture to show.
         */
        constructor(baseRenderTexture: BaseRenderTexture, frame?: Rectangle);
        /**
         * Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.
         * @readonly
         */
        get framebuffer(): Framebuffer;
        /**
         * Shortcut to `this.framebuffer.multisample`.
         * @default PIXI.MSAA_QUALITY.NONE
         */
        get multisample(): MSAA_QUALITY;
        set multisample(value: MSAA_QUALITY);
        /**
         * Resizes the RenderTexture.
         * @param desiredWidth - The desired width to resize to.
         * @param desiredHeight - The desired height to resize to.
         * @param resizeBaseTexture - Should the baseTexture.width and height values be resized as well?
         */
        resize(desiredWidth: number, desiredHeight: number, resizeBaseTexture?: boolean): void;
        /**
         * Changes the resolution of baseTexture, but does not change framebuffer size.
         * @param resolution - The new resolution to apply to RenderTexture
         */
        setResolution(resolution: number): void;
        /**
         * A short hand way of creating a render texture.
         * @param options - Options
         * @param {number} [options.width=100] - The width of the render texture
         * @param {number} [options.height=100] - The height of the render texture
         * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.BaseTexture.defaultOptions.scaleMode] - See {@link PIXI.SCALE_MODES}
         *    for possible values
         * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the texture
         *    being generated
         * @param {PIXI.MSAA_QUALITY} [options.multisample=PIXI.MSAA_QUALITY.NONE] - The number of samples of the frame buffer
         * @returns The new render texture
         */
        static create(options?: IBaseTextureOptions): RenderTexture;
    }
}
declare module "packages/core/src/filters/IFilterTarget" {
    import type { Rectangle } from "packages/math/src/index";
    export interface IFilterTarget {
        filterArea: Rectangle;
        getBounds(skipUpdate?: boolean): Rectangle;
    }
}
declare module "packages/core/src/filters/FilterState" {
    import { MSAA_QUALITY } from "packages/constants/src/index";
    import { Rectangle } from "packages/math/src/index";
    import type { Matrix } from "packages/math/src/index";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { Filter } from "packages/core/src/filters/Filter";
    import type { IFilterTarget } from "packages/core/src/filters/IFilterTarget";
    /**
     * System plugin to the renderer to manage filter states.
     * @ignore
     */
    export class FilterState {
        renderTexture: RenderTexture;
        /**
         * Target of the filters
         * We store for case when custom filter wants to know the element it was applied on
         * @member {PIXI.DisplayObject}
         */
        target: IFilterTarget;
        /**
         * Compatibility with PixiJS v4 filters
         * @default false
         */
        legacy: boolean;
        /**
         * Resolution of filters
         * @default 1
         */
        resolution: number;
        /**
         * Number of samples
         * @default MSAA_QUALITY.NONE
         */
        multisample: MSAA_QUALITY;
        /** Source frame. */
        sourceFrame: Rectangle;
        /** Destination frame. */
        destinationFrame: Rectangle;
        /** Original render-target source frame. */
        bindingSourceFrame: Rectangle;
        /** Original render-target destination frame. */
        bindingDestinationFrame: Rectangle;
        /** Collection of filters. */
        filters: Array<Filter>;
        /** Projection system transform saved by link. */
        transform: Matrix;
        constructor();
        /** Clears the state */
        clear(): void;
    }
}
declare module "packages/core/src/filters/Filter" {
    import { MSAA_QUALITY } from "packages/constants/src/index";
    import { Shader } from "packages/core/src/shader/Shader";
    import { State } from "packages/core/src/state/State";
    import type { BLEND_MODES, CLEAR_MODES } from "packages/constants/src/index";
    import type { Dict } from "packages/utils/src/index";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { FilterState } from "packages/core/src/filters/FilterState";
    import type { FilterSystem } from "packages/core/src/filters/FilterSystem";
    /**
     * A filter is a special shader that applies post-processing effects to an input texture and writes into an output
     * render-target.
     *
     * {@link https://pixijs.io/examples/#/filters-basic/blur.js Example} of the
     * {@link PIXI.BlurFilter BlurFilter}.
     *
     * ### Usage
     * Filters can be applied to any DisplayObject or Container.
     * PixiJS' `FilterSystem` renders the container into temporary Framebuffer,
     * then filter renders it to the screen.
     * Multiple filters can be added to the `filters` array property and stacked on each other.
     *
     * ```js
     * import { Container, Filter } from 'pixi.js';
     * const filter = new Filter(myShaderVert, myShaderFrag, { myUniform: 0.5 });
     * const container = new Container();
     * container.filters = [filter];
     * ```
     *
     * ### Previous Version Differences
     *
     * In PixiJS **v3**, a filter was always applied to _whole screen_.
     *
     * In PixiJS **v4**, a filter can be applied _only part of the screen_.
     * Developers had to create a set of uniforms to deal with coordinates.
     *
     * In PixiJS **v5** combines _both approaches_.
     * Developers can use normal coordinates of v3 and then allow filter to use partial Framebuffers,
     * bringing those extra uniforms into account.
     *
     * Also be aware that we have changed default vertex shader, please consult
     * {@link https://github.com/pixijs/pixijs/wiki/v5-Creating-filters Wiki}.
     *
     * ### Frames
     *
     * The following table summarizes the coordinate spaces used in the filtering pipeline:
     *
     * <table>
     * <thead>
     *   <tr>
     *     <th>Coordinate Space</th>
     *     <th>Description</th>
     *   </tr>
     * </thead>
     * <tbody>
     *   <tr>
     *     <td>Texture Coordinates</td>
     *     <td>
     *         The texture (or UV) coordinates in the input base-texture's space. These are normalized into the (0,1) range along
     *         both axes.
     *     </td>
     *   </tr>
     *   <tr>
     *     <td>World Space</td>
     *     <td>
     *         A point in the same space as the world bounds of any display-object (i.e. in the scene graph's space).
     *     </td>
     *   </tr>
     *   <tr>
     *     <td>Physical Pixels</td>
     *     <td>
     *         This is base-texture's space with the origin on the top-left. You can calculate these by multiplying the texture
     *         coordinates by the dimensions of the texture.
     *     </td>
     *   </tr>
     * </tbody>
     * </table>
     *
     * ### Built-in Uniforms
     *
     * PixiJS viewport uses screen (CSS) coordinates, `(0, 0, renderer.screen.width, renderer.screen.height)`,
     * and `projectionMatrix` uniform maps it to the gl viewport.
     *
     * **uSampler**
     *
     * The most important uniform is the input texture that container was rendered into.
     * _Important note: as with all Framebuffers in PixiJS, both input and output are
     * premultiplied by alpha._
     *
     * By default, input normalized coordinates are passed to fragment shader with `vTextureCoord`.
     * Use it to sample the input.
     *
     * ```js
     * import { Filter } from 'pixi.js';
     * const fragment = `
     * varying vec2 vTextureCoord;
     * uniform sampler2D uSampler;
     * void main(void)
     * {
     *    gl_FragColor = texture2D(uSampler, vTextureCoord);
     * }
     * `;
     *
     * const myFilter = new Filter(null, fragment);
     * ```
     *
     * This filter is just one uniform less than {@link PIXI.AlphaFilter AlphaFilter}.
     *
     * **outputFrame**
     *
     * The `outputFrame` holds the rectangle where filter is applied in screen (CSS) coordinates.
     * It's the same as `renderer.screen` for a fullscreen filter.
     * Only a part of  `outputFrame.zw` size of temporary Framebuffer is used,
     * `(0, 0, outputFrame.width, outputFrame.height)`,
     *
     * Filters uses this quad to normalized (0-1) space, its passed into `aVertexPosition` attribute.
     * To calculate vertex position in screen space using normalized (0-1) space:
     *
     * ```glsl
     * vec4 filterVertexPosition( void )
     * {
     *     vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
     *     return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
     * }
     * ```
     *
     * **inputSize**
     *
     * Temporary framebuffer is different, it can be either the size of screen, either power-of-two.
     * The `inputSize.xy` are size of temporary framebuffer that holds input.
     * The `inputSize.zw` is inverted, it's a shortcut to evade division inside the shader.
     *
     * Set `inputSize.xy = outputFrame.zw` for a fullscreen filter.
     *
     * To calculate input normalized coordinate, you have to map it to filter normalized space.
     * Multiply by `outputFrame.zw` to get input coordinate.
     * Divide by `inputSize.xy` to get input normalized coordinate.
     *
     * ```glsl
     * vec2 filterTextureCoord( void )
     * {
     *     return aVertexPosition * (outputFrame.zw * inputSize.zw); // same as /inputSize.xy
     * }
     * ```
     *
     * **resolution**
     *
     * The `resolution` is the ratio of screen (CSS) pixels to real pixels.
     *
     * **inputPixel**
     *
     * `inputPixel.xy` is the size of framebuffer in real pixels, same as `inputSize.xy * resolution`
     * `inputPixel.zw` is inverted `inputPixel.xy`.
     *
     * It's handy for filters that use neighbour pixels, like {@link PIXI.FXAAFilter FXAAFilter}.
     *
     * **inputClamp**
     *
     * If you try to get info from outside of used part of Framebuffer - you'll get undefined behaviour.
     * For displacements, coordinates has to be clamped.
     *
     * The `inputClamp.xy` is left-top pixel center, you may ignore it, because we use left-top part of Framebuffer
     * `inputClamp.zw` is bottom-right pixel center.
     *
     * ```glsl
     * vec4 color = texture2D(uSampler, clamp(modifiedTextureCoord, inputClamp.xy, inputClamp.zw));
     * ```
     *
     * Or:
     *
     * ```glsl
     * vec4 color = texture2D(uSampler, min(modifigedTextureCoord, inputClamp.zw));
     * ```
     *
     * ### Additional Information
     *
     * Complete documentation on Filter usage is located in the
     * {@link https://github.com/pixijs/pixijs/wiki/v5-Creating-filters Wiki}.
     *
     * Since PixiJS only had a handful of built-in filters, additional filters can be downloaded
     * {@link https://github.com/pixijs/pixi-filters here} from the PixiJS Filters repository.
     * @memberof PIXI
     */
    export class Filter extends Shader {
        /**
         * Default filter resolution for any filter.
         * @static
         */
        static defaultResolution: number | null;
        /**
         * Default filter samples for any filter.
         * @static
         * @type {PIXI.MSAA_QUALITY|null}
         * @default PIXI.MSAA_QUALITY.NONE
         */
        static defaultMultisample: MSAA_QUALITY | null;
        /**
         * The padding of the filter. Some filters require extra space to breath such as a blur.
         * Increasing this will add extra width and height to the bounds of the object that the
         * filter is applied to.
         */
        padding: number;
        /**
         * The samples override of the filter instance.
         * If set to `null`, the sample count of the current render target is used.
         * @default PIXI.Filter.defaultMultisample
         */
        multisample: MSAA_QUALITY | null;
        /** If enabled is true the filter is applied, if false it will not. */
        enabled: boolean;
        /**
         * If enabled, PixiJS will fit the filter area into boundaries for better performance.
         * Switch it off if it does not work for specific shader.
         * @default true
         */
        autoFit: boolean;
        /**
         * Legacy filters use position and uvs from attributes (set by filter system)
         * @readonly
         */
        legacy: boolean;
        /** The WebGL state the filter requires to render. */
        state: State;
        protected _resolution: number | null;
        /**
         * @param vertexSrc - The source of the vertex shader.
         * @param fragmentSrc - The source of the fragment shader.
         * @param uniforms - Custom uniforms to use to augment the built-in ones.
         */
        constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: Dict<any>);
        /**
         * Applies the filter
         * @param {PIXI.FilterSystem} filterManager - The renderer to retrieve the filter from
         * @param {PIXI.RenderTexture} input - The input render target.
         * @param {PIXI.RenderTexture} output - The target to output to.
         * @param {PIXI.CLEAR_MODES} [clearMode] - Should the output be cleared before rendering to it.
         * @param {object} [_currentState] - It's current state of filter.
         *        There are some useful properties in the currentState :
         *        target, filters, sourceFrame, destinationFrame, renderTarget, resolution
         */
        apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode?: CLEAR_MODES, _currentState?: FilterState): void;
        /**
         * Sets the blend mode of the filter.
         * @default PIXI.BLEND_MODES.NORMAL
         */
        get blendMode(): BLEND_MODES;
        set blendMode(value: BLEND_MODES);
        /**
         * The resolution of the filter. Setting this to be lower will lower the quality but
         * increase the performance of the filter.
         * If set to `null` or `0`, the resolution of the current render target is used.
         * @default PIXI.Filter.defaultResolution
         */
        get resolution(): number | null;
        set resolution(value: number | null);
        /**
         * The default vertex shader source
         * @readonly
         */
        static get defaultVertexSrc(): string;
        /**
         * The default fragment shader source
         * @readonly
         */
        static get defaultFragmentSrc(): string;
        /** Used for caching shader IDs. */
        static SOURCE_KEY_MAP: Dict<string>;
    }
}
declare module "packages/core/src/filters/spriteMask/SpriteMaskFilter" {
    import { Matrix } from "packages/math/src/index";
    import { Filter } from "packages/core/src/filters/Filter";
    import type { CLEAR_MODES } from "packages/constants/src/index";
    import type { Point } from "packages/math/src/index";
    import type { Dict } from "packages/utils/src/index";
    import type { IMaskTarget } from "packages/core/src/mask/MaskData";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { Texture } from "packages/core/src/textures/Texture";
    import type { FilterSystem } from "packages/core/src/filters/FilterSystem";
    export interface ISpriteMaskTarget extends IMaskTarget {
        _texture: Texture;
        worldAlpha: number;
        anchor: Point;
    }
    export interface ISpriteMaskFilter extends Filter {
        maskSprite: IMaskTarget;
    }
    /**
     * This handles a Sprite acting as a mask, as opposed to a Graphic.
     *
     * WebGL only.
     * @memberof PIXI
     */
    export class SpriteMaskFilter extends Filter {
        /** @private */
        _maskSprite: IMaskTarget;
        /** Mask matrix */
        maskMatrix: Matrix;
        /**
         * @param {PIXI.Sprite} sprite - The target sprite.
         */
        constructor(sprite: IMaskTarget);
        /**
         * @param vertexSrc - The source of the vertex shader.
         * @param fragmentSrc - The source of the fragment shader.
         * @param uniforms - Custom uniforms to use to augment the built-in ones.
         */
        constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: Dict<any>);
        /**
         * Sprite mask
         * @type {PIXI.DisplayObject}
         */
        get maskSprite(): IMaskTarget;
        set maskSprite(value: IMaskTarget);
        /**
         * Applies the filter
         * @param filterManager - The renderer to retrieve the filter from
         * @param input - The input render target.
         * @param output - The target to output to.
         * @param clearMode - Should the output be cleared before rendering to it.
         */
        apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
    }
}
declare module "packages/core/src/mask/MaskData" {
    import { MASK_TYPES } from "packages/constants/src/index";
    import type { COLOR_MASK_BITS, MSAA_QUALITY } from "packages/constants/src/index";
    import type { Matrix, Rectangle } from "packages/math/src/index";
    import type { IFilterTarget } from "packages/core/src/filters/IFilterTarget";
    import type { ISpriteMaskFilter } from "packages/core/src/filters/spriteMask/SpriteMaskFilter";
    import type { Renderer } from "packages/core/src/Renderer";
    export interface IMaskTarget extends IFilterTarget {
        renderable: boolean;
        isSprite?: boolean;
        worldTransform: Matrix;
        isFastRect?(): boolean;
        getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
        render(renderer: Renderer): void;
    }
    /**
     * Component for masked elements.
     *
     * Holds mask mode and temporary data about current mask.
     * @memberof PIXI
     */
    export class MaskData {
        /** Mask type */
        type: MASK_TYPES;
        /**
         * Whether we know the mask type beforehand
         * @default true
         */
        autoDetect: boolean;
        /**
         * Which element we use to mask
         * @member {PIXI.DisplayObject}
         */
        maskObject: IMaskTarget;
        /** Whether it belongs to MaskSystem pool */
        pooled: boolean;
        /** Indicator of the type (always true for {@link PIXI.MaskData} objects) */
        isMaskData: boolean;
        /**
         * Resolution of the sprite mask filter.
         * If set to `null` or `0`, the resolution of the current render target is used.
         * @default null
         */
        resolution: number | null;
        /**
         * Number of samples of the sprite mask filter.
         * If set to `null`, the sample count of the current render target is used.
         * @default PIXI.Filter.defaultMultisample
         */
        multisample: MSAA_QUALITY | null;
        /** If enabled is true the mask is applied, if false it will not. */
        enabled: boolean;
        /** Color mask. */
        colorMask: COLOR_MASK_BITS;
        /**
         * The sprite mask filter wrapped in an array.
         * @private
         */
        _filters: ISpriteMaskFilter[];
        /**
         * Stencil counter above the mask in stack
         * @private
         */
        _stencilCounter: number;
        /**
         * Scissor counter above the mask in stack
         * @private
         */
        _scissorCounter: number;
        /**
         * Scissor operation above the mask in stack.
         * Null if _scissorCounter is zero, rectangle instance if positive.
         * @private
         */
        _scissorRect: Rectangle;
        /**
         * pre-computed scissor rect
         * does become _scissorRect when mask is actually pushed
         * @private
         */
        _scissorRectLocal: Rectangle;
        /**
         * pre-computed color mask
         * @private
         */
        _colorMask: number;
        /**
         * Targeted element. Temporary variable set by MaskSystem
         * @member {PIXI.DisplayObject}
         * @private
         */
        _target: IMaskTarget;
        /**
         * Create MaskData
         * @param {PIXI.DisplayObject} [maskObject=null] - object that describes the mask
         */
        constructor(maskObject?: IMaskTarget);
        /**
         * The sprite mask filter.
         * If set to `null`, the default sprite mask filter is used.
         * @default null
         */
        get filter(): ISpriteMaskFilter;
        set filter(value: ISpriteMaskFilter);
        /** Resets the mask data after popMask(). */
        reset(): void;
        /**
         * Copies counters from maskData above, called from pushMask().
         * @param maskAbove
         */
        copyCountersOrReset(maskAbove?: MaskData): void;
    }
}
declare module "packages/core/src/renderTexture/BaseRenderTexture" {
    import { Color } from "packages/color/src/index";
    import { MSAA_QUALITY } from "packages/constants/src/index";
    import { Framebuffer } from "packages/core/src/framebuffer/Framebuffer";
    import { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { ColorSource } from "packages/color/src/index";
    import type { MaskData } from "packages/core/src/mask/MaskData";
    import type { IBaseTextureOptions } from "packages/core/src/textures/BaseTexture";
    export interface BaseRenderTexture extends GlobalMixins.BaseRenderTexture, BaseTexture {
    }
    /**
     * A BaseRenderTexture is a special texture that allows any PixiJS display object to be rendered to it.
     *
     * __Hint__: All DisplayObjects (i.e. Sprites) that render to a BaseRenderTexture should be preloaded
     * otherwise black rectangles will be drawn instead.
     *
     * A BaseRenderTexture takes a snapshot of any Display Object given to its render method. The position
     * and rotation of the given Display Objects is ignored. For example:
     * @example
     * import { autoDetectRenderer, BaseRenderTexture, RenderTexture, Sprite } from 'pixi.js';
     *
     * const renderer = autoDetectRenderer();
     * const baseRenderTexture = new BaseRenderTexture({ width: 800, height: 600 });
     * const renderTexture = new RenderTexture(baseRenderTexture);
     * const sprite = Sprite.from('spinObj_01.png');
     *
     * sprite.position.x = 800 / 2;
     * sprite.position.y = 600 / 2;
     * sprite.anchor.x = 0.5;
     * sprite.anchor.y = 0.5;
     *
     * renderer.render(sprite, { renderTexture });
     *
     * // The Sprite in this case will be rendered using its local transform.
     * // To render this sprite at 0,0 you can clear the transform
     * sprite.setTransform();
     *
     * const baseRenderTexture = new BaseRenderTexture({ width: 100, height: 100 });
     * const renderTexture = new RenderTexture(baseRenderTexture);
     *
     * renderer.render(sprite, { renderTexture }); // Renders to center of RenderTexture
     * @memberof PIXI
     */
    export class BaseRenderTexture extends BaseTexture {
        _clear: Color;
        /**
         * The framebuffer of this base texture.
         * @readonly
         */
        framebuffer: Framebuffer;
        /** The data structure for the stencil masks. */
        maskStack: Array<MaskData>;
        /** The data structure for the filters. */
        filterStack: Array<any>;
        /**
         * @param options
         * @param {number} [options.width=100] - The width of the base render texture.
         * @param {number} [options.height=100] - The height of the base render texture.
         * @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.BaseTexture.defaultOptions.scaleMode] - See {@link PIXI.SCALE_MODES}
         *   for possible values.
         * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio
         *   of the texture being generated.
         * @param {PIXI.MSAA_QUALITY} [options.multisample=PIXI.MSAA_QUALITY.NONE] - The number of samples of the frame buffer.
         */
        constructor(options?: IBaseTextureOptions);
        /** Color when clearning the texture. */
        set clearColor(value: ColorSource);
        get clearColor(): ColorSource;
        /**
         * Color object when clearning the texture.
         * @readonly
         * @since 7.2.0
         */
        get clear(): Color;
        /**
         * Shortcut to `this.framebuffer.multisample`.
         * @default PIXI.MSAA_QUALITY.NONE
         */
        get multisample(): MSAA_QUALITY;
        set multisample(value: MSAA_QUALITY);
        /**
         * Resizes the BaseRenderTexture.
         * @param desiredWidth - The desired width to resize to.
         * @param desiredHeight - The desired height to resize to.
         */
        resize(desiredWidth: number, desiredHeight: number): void;
        /**
         * Frees the texture and framebuffer from WebGL memory without destroying this texture object.
         * This means you can still use the texture later which will upload it to GPU
         * memory again.
         * @fires PIXI.BaseTexture#dispose
         */
        dispose(): void;
        /** Destroys this texture. */
        destroy(): void;
    }
}
declare module "packages/core/src/renderTexture/RenderTexturePool" {
    import { MSAA_QUALITY } from "packages/constants/src/index";
    import { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { ISize } from "packages/math/src/index";
    import type { IBaseTextureOptions } from "packages/core/src/textures/BaseTexture";
    /**
     * Texture pool, used by FilterSystem and plugins.
     *
     * Stores collection of temporary pow2 or screen-sized renderTextures
     *
     * If you use custom RenderTexturePool for your filters, you can use methods
     * `getFilterTexture` and `returnFilterTexture` same as in
     * @memberof PIXI
     */
    export class RenderTexturePool {
        textureOptions: IBaseTextureOptions;
        /**
         * Allow renderTextures of the same size as screen, not just pow2
         *
         * Automatically sets to true after `setScreenSize`
         * @default false
         */
        enableFullScreen: boolean;
        texturePool: {
            [x in string | number]: RenderTexture[];
        };
        private _pixelsWidth;
        private _pixelsHeight;
        /**
         * @param textureOptions - options that will be passed to BaseRenderTexture constructor
         * @param {PIXI.SCALE_MODES} [textureOptions.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
         */
        constructor(textureOptions?: IBaseTextureOptions);
        /**
         * Creates texture with params that were specified in pool constructor.
         * @param realWidth - Width of texture in pixels.
         * @param realHeight - Height of texture in pixels.
         * @param multisample - Number of samples of the framebuffer.
         */
        createTexture(realWidth: number, realHeight: number, multisample?: MSAA_QUALITY): RenderTexture;
        /**
         * Gets a Power-of-Two render texture or fullScreen texture
         * @param minWidth - The minimum width of the render texture.
         * @param minHeight - The minimum height of the render texture.
         * @param resolution - The resolution of the render texture.
         * @param multisample - Number of samples of the render texture.
         * @returns The new render texture.
         */
        getOptimalTexture(minWidth: number, minHeight: number, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
        /**
         * Gets extra texture of the same size as input renderTexture
         *
         * `getFilterTexture(input, 0.5)` or `getFilterTexture(0.5, input)`
         * @param input - renderTexture from which size and resolution will be copied
         * @param resolution - override resolution of the renderTexture
         *  It overrides, it does not multiply
         * @param multisample - number of samples of the renderTexture
         */
        getFilterTexture(input: RenderTexture, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
        /**
         * Place a render texture back into the pool.
         * @param renderTexture - The renderTexture to free
         */
        returnTexture(renderTexture: RenderTexture): void;
        /**
         * Alias for returnTexture, to be compliant with FilterSystem interface.
         * @param renderTexture - The renderTexture to free
         */
        returnFilterTexture(renderTexture: RenderTexture): void;
        /**
         * Clears the pool.
         * @param destroyTextures - Destroy all stored textures.
         */
        clear(destroyTextures?: boolean): void;
        /**
         * If screen size was changed, drops all screen-sized textures,
         * sets new screen size, sets `enableFullScreen` to true
         *
         * Size is measured in pixels, `renderer.view` can be passed here, not `renderer.screen`
         * @param size - Initial size of screen.
         */
        setScreenSize(size: ISize): void;
        /**
         * Key that is used to store fullscreen renderTextures in a pool
         * @readonly
         */
        static SCREEN_KEY: number;
    }
}
declare module "packages/core/src/geometry/Attribute" {
    import { TYPES } from "packages/constants/src/index";
    /**
     * Holds the information for a single attribute structure required to render geometry.
     *
     * This does not contain the actual data, but instead has a buffer id that maps to a {@link PIXI.Buffer}
     * This can include anything from positions, uvs, normals, colors etc.
     * @memberof PIXI
     */
    export class Attribute {
        buffer: number;
        size: number;
        normalized: boolean;
        type: TYPES;
        stride: number;
        start: number;
        instance: boolean;
        divisor: number;
        /**
         * @param buffer - the id of the buffer that this attribute will look for
         * @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2.
         * @param normalized - should the data be normalized.
         * @param {PIXI.TYPES} [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
         * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
         * @param [start=0] - How far into the array to start reading values (used for interleaving data)
         * @param [instance=false] - Whether the geometry is instanced.
         * @param [divisor=1] - Divisor to use when doing instanced rendering
         */
        constructor(buffer: number, size?: number, normalized?: boolean, type?: TYPES, stride?: number, start?: number, instance?: boolean, divisor?: number);
        /** Destroys the Attribute. */
        destroy(): void;
        /**
         * Helper function that creates an Attribute based on the information provided
         * @param buffer - the id of the buffer that this attribute will look for
         * @param [size=0] - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
         * @param [normalized=false] - should the data be normalized.
         * @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
         * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
         * @returns - A new {@link PIXI.Attribute} based on the information provided
         */
        static from(buffer: number, size?: number, normalized?: boolean, type?: TYPES, stride?: number): Attribute;
    }
}
declare module "packages/core/src/geometry/utils/interleaveTypedArrays" {
    import type { ITypedArray } from "packages/core/src/geometry/Buffer";
    export function interleaveTypedArrays(arrays: Array<ITypedArray>, sizes: Array<number>): Float32Array;
}
declare module "packages/core/src/geometry/Geometry" {
    import { Runner } from "packages/runner/src/index";
    import { Attribute } from "packages/core/src/geometry/Attribute";
    import { Buffer } from "packages/core/src/geometry/Buffer";
    import type { TYPES } from "packages/constants/src/index";
    import type { IArrayBuffer } from "packages/core/src/geometry/Buffer";
    /**
     * The Geometry represents a model. It consists of two components:
     * - GeometryStyle - The structure of the model such as the attributes layout
     * - GeometryData - the data of the model - this consists of buffers.
     * This can include anything from positions, uvs, normals, colors etc.
     *
     * Geometry can be defined without passing in a style or data if required (thats how I prefer!)
     * @example
     * import { Geometry } from 'pixi.js';
     *
     * const geometry = new Geometry();
     *
     * geometry.addAttribute('positions', [0, 0, 100, 0, 100, 100, 0, 100], 2);
     * geometry.addAttribute('uvs', [0, 0, 1, 0, 1, 1, 0, 1], 2);
     * geometry.addIndex([0, 1, 2, 1, 3, 2]);
     * @memberof PIXI
     */
    export class Geometry {
        buffers: Array<Buffer>;
        indexBuffer: Buffer;
        attributes: {
            [key: string]: Attribute;
        };
        id: number;
        /** Whether the geometry is instanced. */
        instanced: boolean;
        /**
         * Number of instances in this geometry, pass it to `GeometrySystem.draw()`.
         * @default 1
         */
        instanceCount: number;
        /**
         * A map of renderer IDs to webgl VAOs
         * @type {object}
         */
        glVertexArrayObjects: {
            [key: number]: {
                [key: string]: WebGLVertexArrayObject;
            };
        };
        disposeRunner: Runner;
        /** Count of existing (not destroyed) meshes that reference this geometry. */
        refCount: number;
        /**
         * @param buffers - An array of buffers. optional.
         * @param attributes - Of the geometry, optional structure of the attributes layout
         */
        constructor(buffers?: Array<Buffer>, attributes?: {
            [key: string]: Attribute;
        });
        /**
         *
         * Adds an attribute to the geometry
         * Note: `stride` and `start` should be `undefined` if you dont know them, not 0!
         * @param id - the name of the attribute (matching up to a shader)
         * @param {PIXI.Buffer|number[]} buffer - the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it.
         * @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
         * @param normalized - should the data be normalized.
         * @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
         * @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
         * @param [start=0] - How far into the array to start reading values (used for interleaving data)
         * @param instance - Instancing flag
         * @returns - Returns self, useful for chaining.
         */
        addAttribute(id: string, buffer: Buffer | Float32Array | Uint32Array | Array<number>, size?: number, normalized?: boolean, type?: TYPES, stride?: number, start?: number, instance?: boolean): this;
        /**
         * Returns the requested attribute.
         * @param id - The name of the attribute required
         * @returns - The attribute requested.
         */
        getAttribute(id: string): Attribute;
        /**
         * Returns the requested buffer.
         * @param id - The name of the buffer required.
         * @returns - The buffer requested.
         */
        getBuffer(id: string): Buffer;
        /**
         *
         * Adds an index buffer to the geometry
         * The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.
         * @param {PIXI.Buffer|number[]} [buffer] - The buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it.
         * @returns - Returns self, useful for chaining.
         */
        addIndex(buffer?: Buffer | IArrayBuffer | number[]): Geometry;
        /**
         * Returns the index buffer
         * @returns - The index buffer.
         */
        getIndex(): Buffer;
        /**
         * This function modifies the structure so that all current attributes become interleaved into a single buffer
         * This can be useful if your model remains static as it offers a little performance boost
         * @returns - Returns self, useful for chaining.
         */
        interleave(): Geometry;
        /** Get the size of the geometries, in vertices. */
        getSize(): number;
        /** Disposes WebGL resources that are connected to this geometry. */
        dispose(): void;
        /** Destroys the geometry. */
        destroy(): void;
        /**
         * Returns a clone of the geometry.
         * @returns - A new clone of this geometry.
         */
        clone(): Geometry;
        /**
         * Merges an array of geometries into a new single one.
         *
         * Geometry attribute styles must match for this operation to work.
         * @param geometries - array of geometries to merge
         * @returns - Shiny new geometry!
         */
        static merge(geometries: Array<Geometry>): Geometry;
    }
}
declare module "packages/core/src/utils/Quad" {
    import { Geometry } from "packages/core/src/geometry/Geometry";
    /**
     * Helper class to create a quad
     * @memberof PIXI
     */
    export class Quad extends Geometry {
        constructor();
    }
}
declare module "packages/core/src/utils/QuadUv" {
    import { Buffer } from "packages/core/src/geometry/Buffer";
    import { Geometry } from "packages/core/src/geometry/Geometry";
    import type { Rectangle } from "packages/math/src/index";
    /**
     * Helper class to create a quad with uvs like in v4
     * @memberof PIXI
     */
    export class QuadUv extends Geometry {
        vertexBuffer: Buffer;
        uvBuffer: Buffer;
        /** An array of vertices. */
        vertices: Float32Array;
        /** The Uvs of the quad. */
        uvs: Float32Array;
        constructor();
        /**
         * Maps two Rectangle to the quad.
         * @param targetTextureFrame - The first rectangle
         * @param destinationFrame - The second rectangle
         * @returns - Returns itself.
         */
        map(targetTextureFrame: Rectangle, destinationFrame: Rectangle): this;
        /**
         * Legacy upload method, just marks buffers dirty.
         * @returns - Returns itself.
         */
        invalidate(): this;
    }
}
declare module "packages/core/src/filters/FilterSystem" {
    import { CLEAR_MODES, MSAA_QUALITY } from "packages/constants/src/index";
    import { Matrix } from "packages/math/src/index";
    import { RenderTexturePool } from "packages/core/src/renderTexture/RenderTexturePool";
    import { UniformGroup } from "packages/core/src/shader/UniformGroup";
    import { Quad } from "packages/core/src/utils/Quad";
    import { QuadUv } from "packages/core/src/utils/QuadUv";
    import { FilterState } from "packages/core/src/filters/FilterState";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { Filter } from "packages/core/src/filters/Filter";
    import type { IFilterTarget } from "packages/core/src/filters/IFilterTarget";
    import type { ISpriteMaskTarget } from "packages/core/src/filters/spriteMask/SpriteMaskFilter";
    /**
     * System plugin to the renderer to manage filters.
     *
     * ## Pipeline
     *
     * The FilterSystem executes the filtering pipeline by rendering the display-object into a texture, applying its
     * [filters]{@link PIXI.Filter} in series, and the last filter outputs into the final render-target.
     *
     * The filter-frame is the rectangle in world space being filtered, and those contents are mapped into
     * `(0, 0, filterFrame.width, filterFrame.height)` into the filter render-texture. The filter-frame is also called
     * the source-frame, as it is used to bind the filter render-textures. The last filter outputs to the `filterFrame`
     * in the final render-target.
     *
     * ## Usage
     *
     * {@link PIXI.Container#renderAdvanced} is an example of how to use the filter system. It is a 3 step process:
     *
     * **push**: Use {@link PIXI.FilterSystem#push} to push the set of filters to be applied on a filter-target.
     * **render**: Render the contents to be filtered using the renderer. The filter-system will only capture the contents
     *      inside the bounds of the filter-target. NOTE: Using {@link PIXI.Renderer#render} is
     *      illegal during an existing render cycle, and it may reset the filter system.
     * **pop**: Use {@link PIXI.FilterSystem#pop} to pop & execute the filters you initially pushed. It will apply them
     *      serially and output to the bounds of the filter-target.
     * @memberof PIXI
     */
    export class FilterSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * List of filters for the FilterSystem
         * @member {object[]}
         */
        readonly defaultFilterStack: Array<FilterState>;
        /** A pool for storing filter states, save us creating new ones each tick. */
        statePool: Array<FilterState>;
        /** Stores a bunch of POT textures used for filtering. */
        texturePool: RenderTexturePool;
        /** Whether to clear output renderTexture in AUTO/BLIT mode. See {@link PIXI.CLEAR_MODES}. */
        forceClear: boolean;
        /**
         * Old padding behavior is to use the max amount instead of sum padding.
         * Use this flag if you need the old behavior.
         * @default false
         */
        useMaxPadding: boolean;
        /** A very simple geometry used when drawing a filter effect to the screen. */
        protected quad: Quad;
        /** Quad UVs */
        protected quadUv: QuadUv;
        /**
         * Active state
         * @member {object}
         */
        protected activeState: FilterState;
        /**
         * This uniform group is attached to filter uniforms when used.
         * @property {PIXI.Rectangle} outputFrame -
         * @property {Float32Array} inputSize -
         * @property {Float32Array} inputPixel -
         * @property {Float32Array} inputClamp -
         * @property {number} resolution -
         * @property {Float32Array} filterArea -
         * @property {Float32Array} filterClamp -
         */
        protected globalUniforms: UniformGroup;
        /** Temporary rect for math. */
        private tempRect;
        renderer: Renderer;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        init(): void;
        /**
         * Pushes a set of filters to be applied later to the system. This will redirect further rendering into an
         * input render-texture for the rest of the filtering pipeline.
         * @param {PIXI.DisplayObject} target - The target of the filter to render.
         * @param filters - The filters to apply.
         */
        push(target: IFilterTarget, filters: Array<Filter>): void;
        /** Pops off the filter and applies it. */
        pop(): void;
        /**
         * Binds a renderTexture with corresponding `filterFrame`, clears it if mode corresponds.
         * @param filterTexture - renderTexture to bind, should belong to filter pool or filter stack
         * @param clearMode - clearMode, by default its CLEAR/YES. See {@link PIXI.CLEAR_MODES}
         */
        bindAndClear(filterTexture: RenderTexture, clearMode?: CLEAR_MODES): void;
        /**
         * Draws a filter using the default rendering process.
         *
         * This should be called only by {@link PIXI.Filter#apply}.
         * @param filter - The filter to draw.
         * @param input - The input render target.
         * @param output - The target to output to.
         * @param clearMode - Should the output be cleared before rendering to it
         */
        applyFilter(filter: Filter, input: RenderTexture, output: RenderTexture, clearMode?: CLEAR_MODES): void;
        /**
         * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
         *
         * Use `outputMatrix * vTextureCoord` in the shader.
         * @param outputMatrix - The matrix to output to.
         * @param {PIXI.Sprite} sprite - The sprite to map to.
         * @returns The mapped matrix.
         */
        calculateSpriteMatrix(outputMatrix: Matrix, sprite: ISpriteMaskTarget): Matrix;
        /** Destroys this Filter System. */
        destroy(): void;
        /**
         * Gets a Power-of-Two render texture or fullScreen texture
         * @param minWidth - The minimum width of the render texture in real pixels.
         * @param minHeight - The minimum height of the render texture in real pixels.
         * @param resolution - The resolution of the render texture.
         * @param multisample - Number of samples of the render texture.
         * @returns - The new render texture.
         */
        protected getOptimalFilterTexture(minWidth: number, minHeight: number, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
        /**
         * Gets extra render texture to use inside current filter
         * To be compliant with older filters, you can use params in any order
         * @param input - renderTexture from which size and resolution will be copied
         * @param resolution - override resolution of the renderTexture
         * @param multisample - number of samples of the renderTexture
         */
        getFilterTexture(input?: RenderTexture, resolution?: number, multisample?: MSAA_QUALITY): RenderTexture;
        /**
         * Frees a render texture back into the pool.
         * @param renderTexture - The renderTarget to free
         */
        returnFilterTexture(renderTexture: RenderTexture): void;
        /** Empties the texture pool. */
        emptyPool(): void;
        /** Calls `texturePool.resize()`, affects fullScreen renderTextures. */
        resize(): void;
        /**
         * @param matrix - first param
         * @param rect - second param
         */
        private transformAABB;
        private roundFrame;
    }
}
declare module "packages/core/src/framebuffer/FramebufferSystem" {
    import { BUFFER_BITS, MSAA_QUALITY } from "packages/constants/src/index";
    import { Rectangle } from "packages/math/src/index";
    import { Framebuffer } from "packages/core/src/framebuffer/Framebuffer";
    import { GLFramebuffer } from "packages/core/src/framebuffer/GLFramebuffer";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * System plugin to the renderer to manage framebuffers.
     * @memberof PIXI
     */
    export class FramebufferSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A list of managed framebuffers. */
        readonly managedFramebuffers: Array<Framebuffer>;
        current: Framebuffer;
        viewport: Rectangle;
        hasMRT: boolean;
        writeDepthTexture: boolean;
        protected CONTEXT_UID: number;
        protected gl: IRenderingContext;
        /** Framebuffer value that shows that we don't know what is bound. */
        protected unknownFramebuffer: Framebuffer;
        protected msaaSamples: Array<number>;
        renderer: Renderer;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        /** Sets up the renderer context and necessary buffers. */
        protected contextChange(): void;
        /**
         * Bind a framebuffer.
         * @param framebuffer
         * @param frame - frame, default is framebuffer size
         * @param mipLevel - optional mip level to set on the framebuffer - defaults to 0
         */
        bind(framebuffer?: Framebuffer, frame?: Rectangle, mipLevel?: number): void;
        /**
         * Set the WebGLRenderingContext's viewport.
         * @param x - X position of viewport
         * @param y - Y position of viewport
         * @param width - Width of viewport
         * @param height - Height of viewport
         */
        setViewport(x: number, y: number, width: number, height: number): void;
        /**
         * Get the size of the current width and height. Returns object with `width` and `height` values.
         * @readonly
         */
        get size(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        /**
         * Clear the color of the context
         * @param r - Red value from 0 to 1
         * @param g - Green value from 0 to 1
         * @param b - Blue value from 0 to 1
         * @param a - Alpha value from 0 to 1
         * @param {PIXI.BUFFER_BITS} [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
         *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
         */
        clear(r: number, g: number, b: number, a: number, mask?: BUFFER_BITS): void;
        /**
         * Initialize framebuffer for this context
         * @protected
         * @param framebuffer
         * @returns - created GLFramebuffer
         */
        initFramebuffer(framebuffer: Framebuffer): GLFramebuffer;
        /**
         * Resize the framebuffer
         * @param framebuffer
         * @protected
         */
        resizeFramebuffer(framebuffer: Framebuffer): void;
        /**
         * Update the framebuffer
         * @param framebuffer
         * @param mipLevel
         * @protected
         */
        updateFramebuffer(framebuffer: Framebuffer, mipLevel: number): void;
        /**
         * Returns true if the frame buffer can be multisampled.
         * @param framebuffer
         */
        protected canMultisampleFramebuffer(framebuffer: Framebuffer): boolean;
        /**
         * Detects number of samples that is not more than a param but as close to it as possible
         * @param samples - number of samples
         * @returns - recommended number of samples
         */
        protected detectSamples(samples: MSAA_QUALITY): MSAA_QUALITY;
        /**
         * Only works with WebGL2
         *
         * blits framebuffer to another of the same or bigger size
         * after that target framebuffer is bound
         *
         * Fails with WebGL warning if blits multisample framebuffer to different size
         * @param framebuffer - by default it blits "into itself", from renderBuffer to texture.
         * @param sourcePixels - source rectangle in pixels
         * @param destPixels - dest rectangle in pixels, assumed to be the same as sourcePixels
         */
        blit(framebuffer?: Framebuffer, sourcePixels?: Rectangle, destPixels?: Rectangle): void;
        /**
         * Disposes framebuffer.
         * @param framebuffer - framebuffer that has to be disposed of
         * @param contextLost - If context was lost, we suppress all delete function calls
         */
        disposeFramebuffer(framebuffer: Framebuffer, contextLost?: boolean): void;
        /**
         * Disposes all framebuffers, but not textures bound to them.
         * @param [contextLost=false] - If context was lost, we suppress all delete function calls
         */
        disposeAll(contextLost?: boolean): void;
        /**
         * Forcing creation of stencil buffer for current framebuffer, if it wasn't done before.
         * Used by MaskSystem, when its time to use stencil mask for Graphics element.
         *
         * Its an alternative for public lazy `framebuffer.enableStencil`, in case we need stencil without rebind.
         * @private
         */
        forceStencil(): void;
        /** Resets framebuffer stored state, binds screen framebuffer. Should be called before renderTexture reset(). */
        reset(): void;
        destroy(): void;
    }
}
declare module "packages/core/src/framebuffer/MultisampleSystem" {
    import { MSAA_QUALITY } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * System that manages the multisample property on the WebGL renderer
     * @memberof PIXI
     */
    export class MultisampleSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * The number of msaa samples of the canvas.
         * @readonly
         */
        multisample: MSAA_QUALITY;
        private renderer;
        constructor(renderer: Renderer);
        protected contextChange(gl: IRenderingContext): void;
        destroy(): void;
    }
}
declare module "packages/core/src/geometry/BufferSystem" {
    import { GLBuffer } from "packages/core/src/geometry/GLBuffer";
    import type { BUFFER_TYPE } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { Buffer } from "packages/core/src/geometry/Buffer";
    /**
     * System plugin to the renderer to manage buffers.
     *
     * WebGL uses Buffers as a way to store objects to the GPU.
     * This system makes working with them a lot easier.
     *
     * Buffers are used in three main places in WebGL
     * - geometry information
     * - Uniform information (via uniform buffer objects - a WebGL 2 only feature)
     * - Transform feedback information. (WebGL 2 only feature)
     *
     * This system will handle the binding of buffers to the GPU as well as uploading
     * them. With this system, you never need to work directly with GPU buffers, but instead work with
     * the PIXI.Buffer class.
     * @class
     * @memberof PIXI
     */
    export class BufferSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        CONTEXT_UID: number;
        gl: IRenderingContext;
        /** Cache for all buffers by id, used in case renderer gets destroyed or for profiling */
        readonly managedBuffers: {
            [key: number]: Buffer;
        };
        /** Cache keeping track of the base bound buffer bases */
        readonly boundBufferBases: {
            [key: number]: Buffer;
        };
        private renderer;
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        /**
         * @ignore
         */
        destroy(): void;
        /** Sets up the renderer context and necessary buffers. */
        protected contextChange(): void;
        /**
         * This binds specified buffer. On first run, it will create the webGL buffers for the context too
         * @param buffer - the buffer to bind to the renderer
         */
        bind(buffer: Buffer): void;
        unbind(type: BUFFER_TYPE): void;
        /**
         * Binds an uniform buffer to at the given index.
         *
         * A cache is used so a buffer will not be bound again if already bound.
         * @param buffer - the buffer to bind
         * @param index - the base index to bind it to.
         */
        bindBufferBase(buffer: Buffer, index: number): void;
        /**
         * Binds a buffer whilst also binding its range.
         * This will make the buffer start from the offset supplied rather than 0 when it is read.
         * @param buffer - the buffer to bind
         * @param index - the base index to bind at, defaults to 0
         * @param offset - the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc
         */
        bindBufferRange(buffer: Buffer, index?: number, offset?: number): void;
        /**
         * Will ensure the data in the buffer is uploaded to the GPU.
         * @param {PIXI.Buffer} buffer - the buffer to update
         */
        update(buffer: Buffer): void;
        /**
         * Disposes buffer
         * @param {PIXI.Buffer} buffer - buffer with data
         * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
         */
        dispose(buffer: Buffer, contextLost?: boolean): void;
        /**
         * dispose all WebGL resources of all managed buffers
         * @param {boolean} [contextLost=false] - If context was lost, we suppress `gl.delete` calls
         */
        disposeAll(contextLost?: boolean): void;
        /**
         * creates and attaches a GLBuffer object tied to the current context.
         * @param buffer
         * @protected
         */
        protected createGLBuffer(buffer: Buffer): GLBuffer;
    }
}
declare module "packages/core/src/geometry/GeometrySystem" {
    import type { DRAW_MODES } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { Program } from "packages/core/src/shader/Program";
    import type { Shader } from "packages/core/src/shader/Shader";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { Geometry } from "packages/core/src/geometry/Geometry";
    import type { GLBuffer } from "packages/core/src/geometry/GLBuffer";
    /**
     * System plugin to the renderer to manage geometry.
     * @memberof PIXI
     */
    export class GeometrySystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * `true` if we has `*_vertex_array_object` extension.
         * @readonly
         */
        hasVao: boolean;
        /**
         * `true` if has `ANGLE_instanced_arrays` extension.
         * @readonly
         */
        hasInstance: boolean;
        /**
         * `true` if support `gl.UNSIGNED_INT` in `gl.drawElements` or `gl.drawElementsInstanced`.
         * @readonly
         */
        canUseUInt32ElementIndex: boolean;
        protected CONTEXT_UID: number;
        protected gl: IRenderingContext;
        protected _activeGeometry: Geometry;
        protected _activeVao: WebGLVertexArrayObject;
        protected _boundBuffer: GLBuffer;
        /** Cache for all geometries by id, used in case renderer gets destroyed or for profiling. */
        readonly managedGeometries: {
            [key: number]: Geometry;
        };
        /** Renderer that owns this {@link GeometrySystem}. */
        private renderer;
        /** @param renderer - The renderer this System works for. */
        constructor(renderer: Renderer);
        /** Sets up the renderer context and necessary buffers. */
        protected contextChange(): void;
        /**
         * Binds geometry so that is can be drawn. Creating a Vao if required
         * @param geometry - Instance of geometry to bind.
         * @param shader - Instance of shader to use vao for.
         */
        bind(geometry?: Geometry, shader?: Shader): void;
        /** Reset and unbind any active VAO and geometry. */
        reset(): void;
        /** Update buffers of the currently bound geometry. */
        updateBuffers(): void;
        /**
         * Check compatibility between a geometry and a program
         * @param geometry - Geometry instance.
         * @param program - Program instance.
         */
        protected checkCompatibility(geometry: Geometry, program: Program): void;
        /**
         * Takes a geometry and program and generates a unique signature for them.
         * @param geometry - To get signature from.
         * @param program - To test geometry against.
         * @returns - Unique signature of the geometry and program
         */
        protected getSignature(geometry: Geometry, program: Program): string;
        /**
         * Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
         * If vao is created, it is bound automatically. We use a shader to infer what and how to set up the
         * attribute locations.
         * @param geometry - Instance of geometry to to generate Vao for.
         * @param shader - Instance of the shader.
         * @param incRefCount - Increment refCount of all geometry buffers.
         */
        protected initGeometryVao(geometry: Geometry, shader: Shader, incRefCount?: boolean): WebGLVertexArrayObject;
        /**
         * Disposes geometry.
         * @param geometry - Geometry with buffers. Only VAO will be disposed
         * @param [contextLost=false] - If context was lost, we suppress deleteVertexArray
         */
        disposeGeometry(geometry: Geometry, contextLost?: boolean): void;
        /**
         * Dispose all WebGL resources of all managed geometries.
         * @param [contextLost=false] - If context was lost, we suppress `gl.delete` calls
         */
        disposeAll(contextLost?: boolean): void;
        /**
         * Activate vertex array object.
         * @param geometry - Geometry instance.
         * @param program - Shader program instance.
         */
        protected activateVao(geometry: Geometry, program: Program): void;
        /**
         * Draws the currently bound geometry.
         * @param type - The type primitive to render.
         * @param size - The number of elements to be rendered. If not specified, all vertices after the
         *  starting vertex will be drawn.
         * @param start - The starting vertex in the geometry to start drawing from. If not specified,
         *  drawing will start from the first vertex.
         * @param instanceCount - The number of instances of the set of elements to execute. If not specified,
         *  all instances will be drawn.
         */
        draw(type: DRAW_MODES, size?: number, start?: number, instanceCount?: number): this;
        /** Unbind/reset everything. */
        protected unbind(): void;
        destroy(): void;
    }
}
declare module "packages/core/src/mask/MaskSystem" {
    import { SpriteMaskFilter } from "packages/core/src/filters/spriteMask/SpriteMaskFilter";
    import { MaskData } from "packages/core/src/mask/MaskData";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { IMaskTarget } from "packages/core/src/mask/MaskData";
    /**
     * System plugin to the renderer to manage masks.
     *
     * There are three built-in types of masking:
     * **Scissor Masking**: Scissor masking discards pixels that are outside of a rectangle called the scissor box. It is
     *  the most performant as the scissor test is inexpensive. However, it can only be used when the mask is rectangular.
     * **Stencil Masking**: Stencil masking discards pixels that don't overlap with the pixels rendered into the stencil
     *  buffer. It is the next fastest option as it does not require rendering into a separate framebuffer. However, it does
     *  cause the mask to be rendered **twice** for each masking operation; hence, minimize the rendering cost of your masks.
     * **Sprite Mask Filtering**: Sprite mask filtering discards pixels based on the red channel of the sprite-mask's
     *  texture. (Generally, the masking texture is grayscale). Using advanced techniques, you might be able to embed this
     *  type of masking in a custom shader - and hence, bypassing the masking system fully for performance wins.
     *
     * The best type of masking is auto-detected when you `push` one. To use scissor masking, you must pass in a `Graphics`
     * object with just a rectangle drawn.
     *
     * ## Mask Stacks
     *
     * In the scene graph, masks can be applied recursively, i.e. a mask can be applied during a masking operation. The mask
     * stack stores the currently applied masks in order. Each {@link PIXI.BaseRenderTexture} holds its own mask stack, i.e.
     * when you switch render-textures, the old masks only applied when you switch back to rendering to the old render-target.
     * @memberof PIXI
     */
    export class MaskSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * Flag to enable scissor masking.
         * @default true
         */
        enableScissor: boolean;
        /** Pool of used sprite mask filters. */
        protected readonly alphaMaskPool: Array<SpriteMaskFilter[]>;
        /**
         * Current index of alpha mask pool.
         * @default 0
         * @readonly
         */
        protected alphaMaskIndex: number;
        /** Pool of mask data. */
        private readonly maskDataPool;
        private maskStack;
        private renderer;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        /**
         * Changes the mask stack that is used by this System.
         * @param maskStack - The mask stack
         */
        setMaskStack(maskStack: Array<MaskData>): void;
        /**
         * Enables the mask and appends it to the current mask stack.
         *
         * NOTE: The batch renderer should be flushed beforehand to prevent pending renders from being masked.
         * @param {PIXI.DisplayObject} target - Display Object to push the mask to
         * @param {PIXI.MaskData|PIXI.Sprite|PIXI.Graphics|PIXI.DisplayObject} maskDataOrTarget - The masking data.
         */
        push(target: IMaskTarget, maskDataOrTarget: MaskData | IMaskTarget): void;
        /**
         * Removes the last mask from the mask stack and doesn't return it.
         *
         * NOTE: The batch renderer should be flushed beforehand to render the masked contents before the mask is removed.
         * @param {PIXI.IMaskTarget} target - Display Object to pop the mask from
         */
        pop(target: IMaskTarget): void;
        /**
         * Sets type of MaskData based on its maskObject.
         * @param maskData
         */
        detect(maskData: MaskData): void;
        /**
         * Applies the Mask and adds it to the current filter stack.
         * @param maskData - Sprite to be used as the mask.
         */
        pushSpriteMask(maskData: MaskData): void;
        /**
         * Removes the last filter from the filter stack and doesn't return it.
         * @param maskData - Sprite to be used as the mask.
         */
        popSpriteMask(maskData: MaskData): void;
        /**
         * Pushes the color mask.
         * @param maskData - The mask data
         */
        pushColorMask(maskData: MaskData): void;
        /**
         * Pops the color mask.
         * @param maskData - The mask data
         */
        popColorMask(maskData: MaskData): void;
        destroy(): void;
    }
}
declare module "packages/core/src/mask/AbstractMaskSystem" {
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { MaskData } from "packages/core/src/mask/MaskData";
    /**
     * System plugin to the renderer to manage specific types of masking operations.
     * @memberof PIXI
     */
    export class AbstractMaskSystem implements ISystem {
        /**
         * The mask stack
         * @member {PIXI.MaskData[]}
         */
        protected maskStack: Array<MaskData>;
        /**
         * Constant for gl.enable
         * @private
         */
        protected glConst: number;
        protected renderer: Renderer;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        /** Gets count of masks of certain type. */
        getStackLength(): number;
        /**
         * Changes the mask stack that is used by this System.
         * @param {PIXI.MaskData[]} maskStack - The mask stack
         */
        setMaskStack(maskStack: Array<MaskData>): void;
        /**
         * Setup renderer to use the current mask data.
         * @private
         */
        protected _useCurrent(): void;
        /** Destroys the mask stack. */
        destroy(): void;
    }
}
declare module "packages/core/src/mask/ScissorSystem" {
    import { AbstractMaskSystem } from "packages/core/src/mask/AbstractMaskSystem";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { MaskData } from "packages/core/src/mask/MaskData";
    /**
     * System plugin to the renderer to manage scissor masking.
     *
     * Scissor masking discards pixels outside of a rectangle called the scissor box. The scissor box is in the framebuffer
     * viewport's space; however, the mask's rectangle is projected from world-space to viewport space automatically
     * by this system.
     * @memberof PIXI
     */
    export class ScissorSystem extends AbstractMaskSystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * @param {PIXI.Renderer} renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        getStackLength(): number;
        /**
         * evaluates _boundsTransformed, _scissorRect for MaskData
         * @param maskData
         */
        calcScissorRect(maskData: MaskData): void;
        private static isMatrixRotated;
        /**
         * Test, whether the object can be scissor mask with current renderer projection.
         * Calls "calcScissorRect()" if its true.
         * @param maskData - mask data
         * @returns whether Whether the object can be scissor mask
         */
        testScissor(maskData: MaskData): boolean;
        private roundFrameToPixels;
        /**
         * Applies the Mask and adds it to the current stencil stack.
         * @author alvin
         * @param maskData - The mask data.
         */
        push(maskData: MaskData): void;
        /**
         * This should be called after a mask is popped off the mask stack. It will rebind the scissor box to be latest with the
         * last mask in the stack.
         *
         * This can also be called when you directly modify the scissor box and want to restore PixiJS state.
         * @param maskData - The mask data.
         */
        pop(maskData?: MaskData): void;
        /**
         * Setup renderer to use the current scissor data.
         * @private
         */
        _useCurrent(): void;
    }
}
declare module "packages/core/src/mask/StencilSystem" {
    import { AbstractMaskSystem } from "packages/core/src/mask/AbstractMaskSystem";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { IMaskTarget, MaskData } from "packages/core/src/mask/MaskData";
    /**
     * System plugin to the renderer to manage stencils (used for masks).
     * @memberof PIXI
     */
    export class StencilSystem extends AbstractMaskSystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        getStackLength(): number;
        /**
         * Applies the Mask and adds it to the current stencil stack.
         * @param maskData - The mask data
         */
        push(maskData: MaskData): void;
        /**
         * Pops stencil mask. MaskData is already removed from stack
         * @param {PIXI.DisplayObject} maskObject - object of popped mask data
         */
        pop(maskObject: IMaskTarget): void;
        /**
         * Setup renderer to use the current stencil data.
         * @private
         */
        _useCurrent(): void;
    }
}
declare module "packages/core/src/projection/ProjectionSystem" {
    import { Matrix } from "packages/math/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Rectangle } from "packages/math/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * System plugin to the renderer to manage the projection matrix.
     *
     * The `projectionMatrix` is a global uniform provided to all shaders. It is used to transform points in world space to
     * normalized device coordinates.
     * @memberof PIXI
     */
    export class ProjectionSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * The destination frame used to calculate the current projection matrix.
         *
         * The destination frame is the rectangle in the render-target into which contents are rendered. If rendering
         * to the screen, the origin is on the top-left. If rendering to a framebuffer, the origin is on the
         * bottom-left. This "flipping" phenomenon is because of WebGL convention for (shader) texture coordinates, where
         * the bottom-left corner is (0,0). It allows display-objects to map their (0,0) position in local-space (top-left)
         * to (0,0) in texture space (bottom-left). In other words, a sprite's top-left corner actually renders the
         * texture's bottom-left corner. You will also notice this when using a tool like SpectorJS to view your textures
         * at runtime.
         *
         * The destination frame's dimensions (width,height) should be equal to the source frame. This is because,
         * otherwise, the contents will be scaled to fill the destination frame. Similarly, the destination frame's (x,y)
         * coordinates are (0,0) unless you know what you're doing.
         * @readonly
         */
        destinationFrame: Rectangle;
        /**
         * The source frame used to calculate the current projection matrix.
         *
         * The source frame is the rectangle in world space containing the contents to be rendered.
         * @readonly
         */
        sourceFrame: Rectangle;
        /**
         * Default destination frame
         *
         * This is not used internally. It is not advised to use this feature specifically unless you know what
         * you're doing. The `update` method will default to this frame if you do not pass the destination frame.
         * @readonly
         */
        defaultFrame: Rectangle;
        /**
         * Projection matrix
         *
         * This matrix can be used to transform points from world space to normalized device coordinates, and is calculated
         * from the sourceFrame → destinationFrame mapping provided.
         *
         * The renderer's `globalUniforms` keeps a reference to this, and so it is available for all shaders to use as a
         * uniform.
         * @readonly
         */
        projectionMatrix: Matrix;
        /**
         * A transform to be appended to the projection matrix.
         *
         * This can be used to transform points in world-space one last time before they are outputted by the shader. You can
         * use to rotate the whole scene, for example. Remember to clear it once you've rendered everything.
         * @member {PIXI.Matrix}
         */
        transform: Matrix;
        private renderer;
        /** @param renderer - The renderer this System works for. */
        constructor(renderer: Renderer);
        /**
         * Updates the projection-matrix based on the sourceFrame → destinationFrame mapping provided.
         *
         * NOTE: It is expected you call `renderer.framebuffer.setViewport(destinationFrame)` after this. This is because
         * the framebuffer viewport converts shader vertex output in normalized device coordinates to window coordinates.
         *
         * NOTE-2: {@link PIXI.RenderTextureSystem#bind} updates the projection-matrix when you bind a render-texture.
         * It is expected
         * that you dirty the current bindings when calling this manually.
         * @param destinationFrame - The rectangle in the render-target to render the contents into. If rendering to the canvas,
         *  the origin is on the top-left; if rendering to a render-texture, the origin is on the bottom-left.
         * @param sourceFrame - The rectangle in world space that contains the contents being rendered.
         * @param resolution - The resolution of the render-target, which is the ratio of
         *  world-space (or CSS) pixels to physical pixels.
         * @param root - Whether the render-target is the screen. This is required because rendering to textures
         *  is y-flipped (i.e. upside down relative to the screen).
         */
        update(destinationFrame: Rectangle, sourceFrame: Rectangle, resolution: number, root: boolean): void;
        /**
         * Calculates the `projectionMatrix` to map points inside `sourceFrame` to inside `destinationFrame`.
         * @param _destinationFrame - The destination frame in the render-target.
         * @param sourceFrame - The source frame in world space.
         * @param _resolution - The render-target's resolution, i.e. ratio of CSS to physical pixels.
         * @param root - Whether rendering into the screen. Otherwise, if rendering to a framebuffer, the projection
         *  is y-flipped.
         */
        calculateProjection(_destinationFrame: Rectangle, sourceFrame: Rectangle, _resolution: number, root: boolean): void;
        /**
         * Sets the transform of the active render target to the given matrix.
         * @param _matrix - The transformation matrix
         */
        setTransform(_matrix: Matrix): void;
        destroy(): void;
    }
}
declare module "packages/core/src/render/ObjectRendererSystem" {
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderableObject, IRendererRenderOptions } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * system that provides a render function that focussing on rendering Pixi Scene Graph objects
     * to either the main view or to a renderTexture.  Used for Canvas `WebGL` contexts
     * @memberof PIXI
     */
    export class ObjectRendererSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        renderer: Renderer;
        /**
         * Flag if we are rendering to the screen vs renderTexture
         * @readonly
         * @default true
         */
        renderingToScreen: boolean;
        /**
         * the last object rendered by the renderer. Useful for other plugins like interaction managers
         * @readonly
         */
        lastObjectRendered: IRenderableObject;
        constructor(renderer: Renderer);
        /**
         * Renders the object to its WebGL view.
         * @param displayObject - The object to be rendered.
         * @param options - the options to be passed to the renderer
         */
        render(displayObject: IRenderableObject, options?: IRendererRenderOptions): void;
        destroy(): void;
    }
}
declare module "packages/core/src/renderTexture/GenerateTextureSystem" {
    import { Rectangle } from "packages/math/src/index";
    import { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { MSAA_QUALITY } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderableObject, IRenderer } from "packages/core/src/IRenderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { IBaseTextureOptions } from "packages/core/src/textures/BaseTexture";
    export interface IGenerateTextureOptions extends IBaseTextureOptions {
        /**
         * The region of the displayObject, that shall be rendered,
         * if no region is specified, defaults to the local bounds of the displayObject.
         */
        region?: Rectangle;
        /** The resolution / device pixel ratio of the texture being generated. The default is the renderer's resolution. */
        resolution?: number;
        /** The number of samples of the frame buffer. The default is the renderer's multisample. */
        multisample?: MSAA_QUALITY;
    }
    /**
     * System that manages the generation of textures from the renderer.
     * @memberof PIXI
     */
    export class GenerateTextureSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        renderer: IRenderer;
        private readonly _tempMatrix;
        constructor(renderer: IRenderer);
        /**
         * A Useful function that returns a texture of the display object that can then be used to create sprites
         * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
         * @param displayObject - The displayObject the object will be generated from.
         * @param {IGenerateTextureOptions} options - Generate texture options.
         * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
         *        if no region is specified, defaults to the local bounds of the displayObject.
         * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
         * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
         * @returns a shiny new texture of the display object passed in
         */
        generateTexture(displayObject: IRenderableObject, options?: IGenerateTextureOptions): RenderTexture;
        destroy(): void;
    }
}
declare module "packages/core/src/renderTexture/RenderTextureSystem" {
    import { Rectangle } from "packages/math/src/index";
    import type { ColorSource } from "packages/color/src/index";
    import type { BUFFER_BITS } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { MaskData } from "packages/core/src/mask/MaskData";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    /**
     * System plugin to the renderer to manage render textures.
     *
     * Should be added after FramebufferSystem
     *
     * ### Frames
     *
     * The `RenderTextureSystem` holds a sourceFrame → destinationFrame projection. The following table explains the different
     * coordinate spaces used:
     *
     * | Frame                  | Description                                                      | Coordinate System                                       |
     * | ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
     * | sourceFrame            | The rectangle inside of which display-objects are being rendered | **World Space**: The origin on the top-left             |
     * | destinationFrame       | The rectangle in the render-target (canvas or texture) into which contents should be rendered | If rendering to the canvas, this is in screen space and the origin is on the top-left. If rendering to a render-texture, this is in its base-texture's space with the origin on the bottom-left.  |
     * | viewportFrame          | The framebuffer viewport corresponding to the destination-frame  | **Window Coordinates**: The origin is always on the bottom-left. |
     * @memberof PIXI
     */
    export class RenderTextureSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * List of masks for the {@link PIXI.StencilSystem}.
         * @readonly
         */
        defaultMaskStack: Array<MaskData>;
        /**
         * Render texture currently bound. {@code null} if rendering to the canvas.
         * @readonly
         */
        current: RenderTexture | null;
        /**
         * The source frame for the render-target's projection mapping.
         *
         * See {@link PIXI.ProjectionSystem#sourceFrame} for more details
         */
        readonly sourceFrame: Rectangle;
        /**
         * The destination frame for the render-target's projection mapping.
         *
         * See {@link PIXI.ProjectionSystem#destinationFrame} for more details.
         */
        readonly destinationFrame: Rectangle;
        /**
         * The viewport frame for the render-target's viewport binding. This is equal to the destination-frame
         * for render-textures, while it is y-flipped when rendering to the screen (i.e. its origin is always on
         * the bottom-left).
         */
        readonly viewportFrame: Rectangle;
        private renderer;
        /** Does the renderer have alpha and are its color channels stored premultipled by the alpha channel? */
        private _rendererPremultipliedAlpha;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        protected contextChange(): void;
        /**
         * Bind the current render texture.
         * @param renderTexture - RenderTexture to bind, by default its `null` - the screen.
         * @param sourceFrame - Part of world that is mapped to the renderTexture.
         * @param destinationFrame - Part of renderTexture, by default it has the same size as sourceFrame.
         */
        bind(renderTexture?: RenderTexture, sourceFrame?: Rectangle, destinationFrame?: Rectangle): void;
        /**
         * Erases the render texture and fills the drawing area with a colour.
         * @param clearColor - The color as rgba, default to use the renderer backgroundColor
         * @param [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
         *  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
         */
        clear(clearColor?: ColorSource, mask?: BUFFER_BITS): void;
        resize(): void;
        /** Resets render-texture state. */
        reset(): void;
        destroy(): void;
    }
}
declare module "packages/core/src/shader/utils/getAttributeData" {
    import type { IAttributeData } from "packages/core/src/shader/Program";
    /**
     * returns the attribute data from the program
     * @private
     * @param {WebGLProgram} [program] - the WebGL program
     * @param {WebGLRenderingContext} [gl] - the WebGL context
     * @returns {object} the attribute data for this program
     */
    export function getAttributeData(program: WebGLProgram, gl: WebGLRenderingContextBase): {
        [key: string]: IAttributeData;
    };
}
declare module "packages/core/src/shader/utils/getUniformData" {
    import type { IUniformData } from "packages/core/src/shader/Program";
    /**
     * returns the uniform data from the program
     * @private
     * @param program - the webgl program
     * @param gl - the WebGL context
     * @returns {object} the uniform data for this program
     */
    export function getUniformData(program: WebGLProgram, gl: WebGLRenderingContextBase): {
        [key: string]: IUniformData;
    };
}
declare module "packages/core/src/shader/utils/generateProgram" {
    import { GLProgram } from "packages/core/src/shader/GLProgram";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Program } from "packages/core/src/shader/Program";
    /**
     * generates a WebGL Program object from a high level Pixi Program.
     * @param gl - a rendering context on which to generate the program
     * @param program - the high level Pixi Program.
     */
    export function generateProgram(gl: IRenderingContext, program: Program): GLProgram;
}
declare module "packages/core/src/shader/utils/generateUniformBufferSync" {
    import type { Dict } from "packages/utils/src/index";
    import type { IUniformData } from "packages/core/src/shader/Program";
    import type { UniformGroup } from "packages/core/src/shader/UniformGroup";
    export type UniformsSyncCallback = (...args: any[]) => void;
    interface UBOElement {
        data: IUniformData;
        offset: number;
        dataLen: number;
        dirty: number;
    }
    /**
     * logic originally from here: https://github.com/sketchpunk/FunWithWebGL2/blob/master/lesson_022/Shaders.js
     * rewrote it, but this was a great starting point to get a solid understanding of whats going on :)
     * @ignore
     * @param uniformData
     */
    export function createUBOElements(uniformData: IUniformData[]): {
        uboElements: UBOElement[];
        size: number;
    };
    export function getUBOData(uniforms: Dict<any>, uniformData: Dict<any>): any[];
    export function generateUniformBufferSync(group: UniformGroup, uniformData: Dict<any>): {
        size: number;
        syncFunc: UniformsSyncCallback;
    };
}
declare module "packages/core/src/shader/ShaderSystem" {
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Dict } from "packages/utils/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { GLProgram } from "packages/core/src/shader/GLProgram";
    import type { Program } from "packages/core/src/shader/Program";
    import type { Shader } from "packages/core/src/shader/Shader";
    import type { UniformGroup } from "packages/core/src/shader/UniformGroup";
    import type { UniformsSyncCallback } from "packages/core/src/shader/utils/index";
    /**
     * System plugin to the renderer to manage shaders.
     * @memberof PIXI
     */
    export class ShaderSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * The current WebGL rendering context.
         * @member {WebGLRenderingContext}
         */
        protected gl: IRenderingContext;
        shader: Shader;
        program: Program;
        id: number;
        destroyed: boolean;
        /** Cache to holds the generated functions. Stored against UniformObjects unique signature. */
        private cache;
        private _uboCache;
        private renderer;
        /** @param renderer - The renderer this System works for. */
        constructor(renderer: Renderer);
        /**
         * Overrideable function by `@pixi/unsafe-eval` to silence
         * throwing an error if platform doesn't support unsafe-evals.
         * @private
         */
        private systemCheck;
        protected contextChange(gl: IRenderingContext): void;
        /**
         * Changes the current shader to the one given in parameter.
         * @param shader - the new shader
         * @param dontSync - false if the shader should automatically sync its uniforms.
         * @returns the glProgram that belongs to the shader.
         */
        bind(shader: Shader, dontSync?: boolean): GLProgram;
        /**
         * Uploads the uniforms values to the currently bound shader.
         * @param uniforms - the uniforms values that be applied to the current shader
         */
        setUniforms(uniforms: Dict<any>): void;
        /**
         * Syncs uniforms on the group
         * @param group - the uniform group to sync
         * @param syncData - this is data that is passed to the sync function and any nested sync functions
         */
        syncUniformGroup(group: UniformGroup, syncData?: any): void;
        /**
         * Overrideable by the @pixi/unsafe-eval package to use static syncUniforms instead.
         * @param group
         * @param glProgram
         * @param syncData
         */
        syncUniforms(group: UniformGroup, glProgram: GLProgram, syncData: any): void;
        createSyncGroups(group: UniformGroup): UniformsSyncCallback;
        /**
         * Syncs uniform buffers
         * @param group - the uniform buffer group to sync
         * @param name - the name of the uniform buffer
         */
        syncUniformBufferGroup(group: UniformGroup, name?: string): void;
        /**
         * Will create a function that uploads a uniform buffer using the STD140 standard.
         * The upload function will then be cached for future calls
         * If a group is manually managed, then a simple upload function is generated
         * @param group - the uniform buffer group to sync
         * @param glProgram - the gl program to attach the uniform bindings to
         * @param name - the name of the uniform buffer (must exist on the shader)
         */
        protected createSyncBufferGroup(group: UniformGroup, glProgram: GLProgram, name: string): UniformsSyncCallback;
        /**
         * Takes a uniform group and data and generates a unique signature for them.
         * @param group - The uniform group to get signature of
         * @param group.uniforms
         * @param uniformData - Uniform information generated by the shader
         * @param preFix
         * @returns Unique signature of the uniform group
         */
        private getSignature;
        /**
         * Returns the underlying GLShade rof the currently bound shader.
         *
         * This can be handy for when you to have a little more control over the setting of your uniforms.
         * @returns The glProgram for the currently bound Shader for this context
         */
        getGlProgram(): GLProgram;
        /**
         * Generates a glProgram version of the Shader provided.
         * @param shader - The shader that the glProgram will be based on.
         * @returns A shiny new glProgram!
         */
        generateProgram(shader: Shader): GLProgram;
        /** Resets ShaderSystem state, does not affect WebGL state. */
        reset(): void;
        /**
         * Disposes shader.
         * If disposing one equals with current shader, set current as null.
         * @param shader - Shader object
         */
        disposeShader(shader: Shader): void;
        /** Destroys this System and removes all its textures. */
        destroy(): void;
    }
}
declare module "packages/core/src/startup/StartupSystem" {
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderer } from "packages/core/src/IRenderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * Options for the startup system.
     * @memberof PIXI
     */
    export interface StartupSystemOptions {
        /**
         * Whether to log the version and type information of renderer to console.
         * @memberof PIXI.IRendererOptions
         */
        hello: boolean;
    }
    /**
     * A simple system responsible for initiating the renderer.
     * @memberof PIXI
     */
    export class StartupSystem implements ISystem<StartupSystemOptions> {
        /** @ignore */
        static defaultOptions: StartupSystemOptions;
        /** @ignore */
        static extension: ExtensionMetadata;
        readonly renderer: IRenderer;
        constructor(renderer: IRenderer);
        /**
         * It all starts here! This initiates every system, passing in the options for any system by name.
         * @param options - the config for the renderer and all its systems
         */
        run(options: StartupSystemOptions): void;
        destroy(): void;
    }
}
declare module "packages/core/src/state/utils/mapWebGLBlendModesToPixi" {
    /**
     * Maps gl blend combinations to WebGL.
     * @memberof PIXI
     * @function mapWebGLBlendModesToPixi
     * @private
     * @param {WebGLRenderingContext} gl - The rendering context.
     * @param {number[][]} [array=[]] - The array to output into.
     * @returns {number[][]} Mapped modes.
     */
    export function mapWebGLBlendModesToPixi(gl: WebGLRenderingContextBase, array?: number[][]): number[][];
}
declare module "packages/core/src/state/StateSystem" {
    import { BLEND_MODES } from "packages/constants/src/index";
    import { State } from "packages/core/src/state/State";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * System plugin to the renderer to manage WebGL state machines.
     * @memberof PIXI
     */
    export class StateSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * State ID
         * @readonly
         */
        stateId: number;
        /**
         * Polygon offset
         * @readonly
         */
        polygonOffset: number;
        /**
         * Blend mode
         * @default PIXI.BLEND_MODES.NONE
         * @readonly
         */
        blendMode: BLEND_MODES;
        /** Whether current blend equation is different */
        protected _blendEq: boolean;
        /**
         * GL context
         * @member {WebGLRenderingContext}
         * @readonly
         */
        protected gl: IRenderingContext;
        protected blendModes: number[][];
        /**
         * Collection of calls
         * @member {Function[]}
         */
        protected readonly map: Array<(value: boolean) => void>;
        /**
         * Collection of check calls
         * @member {Function[]}
         */
        protected readonly checks: Array<(system: this, state: State) => void>;
        /**
         * Default WebGL State
         * @readonly
         */
        protected defaultState: State;
        constructor();
        contextChange(gl: IRenderingContext): void;
        /**
         * Sets the current state
         * @param {*} state - The state to set.
         */
        set(state: State): void;
        /**
         * Sets the state, when previous state is unknown.
         * @param {*} state - The state to set
         */
        forceState(state: State): void;
        /**
         * Sets whether to enable or disable blending.
         * @param value - Turn on or off WebGl blending.
         */
        setBlend(value: boolean): void;
        /**
         * Sets whether to enable or disable polygon offset fill.
         * @param value - Turn on or off webgl polygon offset testing.
         */
        setOffset(value: boolean): void;
        /**
         * Sets whether to enable or disable depth test.
         * @param value - Turn on or off webgl depth testing.
         */
        setDepthTest(value: boolean): void;
        /**
         * Sets whether to enable or disable depth mask.
         * @param value - Turn on or off webgl depth mask.
         */
        setDepthMask(value: boolean): void;
        /**
         * Sets whether to enable or disable cull face.
         * @param {boolean} value - Turn on or off webgl cull face.
         */
        setCullFace(value: boolean): void;
        /**
         * Sets the gl front face.
         * @param {boolean} value - true is clockwise and false is counter-clockwise
         */
        setFrontFace(value: boolean): void;
        /**
         * Sets the blend mode.
         * @param {number} value - The blend mode to set to.
         */
        setBlendMode(value: number): void;
        /**
         * Sets the polygon offset.
         * @param {number} value - the polygon offset
         * @param {number} scale - the polygon offset scale
         */
        setPolygonOffset(value: number, scale: number): void;
        /** Resets all the logic and disables the VAOs. */
        reset(): void;
        /**
         * Checks to see which updates should be checked based on which settings have been activated.
         *
         * For example, if blend is enabled then we should check the blend modes each time the state is changed
         * or if polygon fill is activated then we need to check if the polygon offset changes.
         * The idea is that we only check what we have too.
         * @param func - the checking function to add or remove
         * @param value - should the check function be added or removed.
         */
        updateCheck(func: (system: this, state: State) => void, value: boolean): void;
        /**
         * A private little wrapper function that we call to check the blend mode.
         * @param system - the System to perform the state check on
         * @param state - the state that the blendMode will pulled from
         */
        private static checkBlendMode;
        /**
         * A private little wrapper function that we call to check the polygon offset.
         * @param system - the System to perform the state check on
         * @param state - the state that the blendMode will pulled from
         */
        private static checkPolygonOffset;
        /**
         * @ignore
         */
        destroy(): void;
    }
}
declare module "packages/core/src/textures/TextureGCSystem" {
    import { GC_MODES } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { Texture } from "packages/core/src/textures/Texture";
    export interface IUnloadableTexture {
        _texture: Texture | RenderTexture;
        children: IUnloadableTexture[];
    }
    /**
     * System plugin to the renderer to manage texture garbage collection on the GPU,
     * ensuring that it does not get clogged up with textures that are no longer being used.
     * @memberof PIXI
     */
    export class TextureGCSystem implements ISystem {
        /**
         * Default garbage collection mode.
         * @static
         * @type {PIXI.GC_MODES}
         * @default PIXI.GC_MODES.AUTO
         * @see PIXI.TextureGCSystem#mode
         */
        static defaultMode: GC_MODES;
        /**
         * Default maximum idle frames before a texture is destroyed by garbage collection.
         * @static
         * @default 3600
         * @see PIXI.TextureGCSystem#maxIdle
         */
        static defaultMaxIdle: number;
        /**
         * Default frames between two garbage collections.
         * @static
         * @default 600
         * @see PIXI.TextureGCSystem#checkCountMax
         */
        static defaultCheckCountMax: number;
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * Frame count since started.
         * @readonly
         */
        count: number;
        /**
         * Frame count since last garbage collection.
         * @readonly
         */
        checkCount: number;
        /**
         * Maximum idle frames before a texture is destroyed by garbage collection.
         * @see PIXI.TextureGCSystem.defaultMaxIdle
         */
        maxIdle: number;
        /**
         * Frames between two garbage collections.
         * @see PIXI.TextureGCSystem.defaultCheckCountMax
         */
        checkCountMax: number;
        /**
         * Current garbage collection mode.
         * @see PIXI.TextureGCSystem.defaultMode
         */
        mode: GC_MODES;
        private renderer;
        /** @param renderer - The renderer this System works for. */
        constructor(renderer: Renderer);
        /**
         * Checks to see when the last time a texture was used.
         * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
         */
        protected postrender(): void;
        /**
         * Checks to see when the last time a texture was used.
         * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
         */
        run(): void;
        /**
         * Removes all the textures within the specified displayObject and its children from the GPU.
         * @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
         */
        unload(displayObject: IUnloadableTexture): void;
        destroy(): void;
    }
}
declare module "packages/core/src/textures/utils/mapInternalFormatToSamplerType" {
    import { SAMPLER_TYPES } from "packages/constants/src/index";
    /**
     * Returns a lookup table that maps each internal format to the compatible sampler type.
     * @memberof PIXI
     * @function mapInternalFormatToSamplerType
     * @private
     * @param {WebGLRenderingContext} gl - The rendering context.
     * @returns Lookup table.
     */
    export function mapInternalFormatToSamplerType(gl: WebGLRenderingContextBase): Record<number, SAMPLER_TYPES>;
}
declare module "packages/core/src/textures/utils/mapTypeAndFormatToInternalFormat" {
    /**
     * Returns a lookup table that maps each type-format pair to a compatible internal format.
     * @memberof PIXI
     * @function mapTypeAndFormatToInternalFormat
     * @private
     * @param {WebGLRenderingContext} gl - The rendering context.
     * @returns Lookup table.
     */
    export function mapTypeAndFormatToInternalFormat(gl: WebGLRenderingContextBase): {
        [type: number]: {
            [format: number]: number;
        };
    };
}
declare module "packages/core/src/textures/TextureSystem" {
    import { SAMPLER_TYPES } from "packages/constants/src/index";
    import { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import { GLTexture } from "packages/core/src/textures/GLTexture";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { Texture } from "packages/core/src/textures/Texture";
    /**
     * System plugin to the renderer to manage textures.
     * @memberof PIXI
     */
    export class TextureSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * Bound textures.
         * @readonly
         */
        boundTextures: BaseTexture[];
        /**
         * List of managed textures.
         * @readonly
         */
        managedTextures: Array<BaseTexture>;
        /** Whether glTexture with int/uint sampler type was uploaded. */
        protected hasIntegerTextures: boolean;
        protected CONTEXT_UID: number;
        protected gl: IRenderingContext;
        protected internalFormats: {
            [type: number]: {
                [format: number]: number;
            };
        };
        protected samplerTypes: Record<number, SAMPLER_TYPES>;
        protected webGLVersion: number;
        /**
         * BaseTexture value that shows that we don't know what is bound.
         * @readonly
         */
        protected unknownTexture: BaseTexture;
        /**
         * Did someone temper with textures state? We'll overwrite them when we need to unbind something.
         * @private
         */
        protected _unknownBoundTextures: boolean;
        /**
         * Current location.
         * @readonly
         */
        currentLocation: number;
        emptyTextures: {
            [key: number]: GLTexture;
        };
        private renderer;
        /**
         * @param renderer - The renderer this system works for.
         */
        constructor(renderer: Renderer);
        /** Sets up the renderer context and necessary buffers. */
        contextChange(): void;
        /**
         * Bind a texture to a specific location
         *
         * If you want to unbind something, please use `unbind(texture)` instead of `bind(null, textureLocation)`
         * @param texture - Texture to bind
         * @param [location=0] - Location to bind at
         */
        bind(texture: Texture | BaseTexture, location?: number): void;
        /** Resets texture location and bound textures Actual `bind(null, i)` calls will be performed at next `unbind()` call */
        reset(): void;
        /**
         * Unbind a texture.
         * @param texture - Texture to bind
         */
        unbind(texture?: BaseTexture): void;
        /**
         * Ensures that current boundTextures all have FLOAT sampler type,
         * see {@link PIXI.SAMPLER_TYPES} for explanation.
         * @param maxTextures - number of locations to check
         */
        ensureSamplerType(maxTextures: number): void;
        /**
         * Initialize a texture
         * @private
         * @param texture - Texture to initialize
         */
        initTexture(texture: BaseTexture): GLTexture;
        initTextureType(texture: BaseTexture, glTexture: GLTexture): void;
        /**
         * Update a texture
         * @private
         * @param {PIXI.BaseTexture} texture - Texture to initialize
         */
        updateTexture(texture: BaseTexture): void;
        /**
         * Deletes the texture from WebGL
         * @private
         * @param texture - the texture to destroy
         * @param [skipRemove=false] - Whether to skip removing the texture from the TextureManager.
         */
        destroyTexture(texture: BaseTexture | Texture, skipRemove?: boolean): void;
        /**
         * Update texture style such as mipmap flag
         * @private
         * @param {PIXI.BaseTexture} texture - Texture to update
         */
        updateTextureStyle(texture: BaseTexture): void;
        /**
         * Set style for texture
         * @private
         * @param texture - Texture to update
         * @param glTexture
         */
        setStyle(texture: BaseTexture, glTexture: GLTexture): void;
        destroy(): void;
    }
}
declare module "packages/core/src/transformFeedback/TransformFeedback" {
    import { Runner } from "packages/runner/src/index";
    import type { Buffer } from "packages/core/src/geometry/Buffer";
    /**
     * A TransformFeedback object wrapping GLTransformFeedback object.
     *
     * For example you can use TransformFeedback object to feed-back buffer data from Shader having TransformFeedbackVaryings.
     * @memberof PIXI
     */
    export class TransformFeedback {
        _glTransformFeedbacks: {
            [key: number]: WebGLTransformFeedback;
        };
        buffers: Buffer[];
        disposeRunner: Runner;
        constructor();
        /**
         * Bind buffer to TransformFeedback
         * @param index - index to bind
         * @param buffer - buffer to bind
         */
        bindBuffer(index: number, buffer: Buffer): void;
        /** Destroy WebGL resources that are connected to this TransformFeedback. */
        destroy(): void;
    }
}
declare module "packages/core/src/transformFeedback/TransformFeedbackSystem" {
    import type { DRAW_MODES } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { Shader } from "packages/core/src/shader/Shader";
    import type { ISystem } from "packages/core/src/system/ISystem";
    import type { TransformFeedback } from "packages/core/src/transformFeedback/TransformFeedback";
    /**
     * TransformFeedbackSystem provides TransformFeedback of WebGL2
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLTransformFeedback
     *
     * For example, you can use TransformFeedbackSystem to implement GPU Particle or
     * general purpose computing on GPU (aka GPGPU).
     *
     * It also manages a lifetime of GLTransformFeedback object
     * @memberof PIXI
     */
    export class TransformFeedbackSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        CONTEXT_UID: number;
        gl: IRenderingContext;
        private renderer;
        /**
         * @param renderer - The renderer this System works for.
         */
        constructor(renderer: Renderer);
        /** Sets up the renderer context and necessary buffers. */
        protected contextChange(): void;
        /**
         * Bind TransformFeedback and buffers
         * @param transformFeedback - TransformFeedback to bind
         */
        bind(transformFeedback: TransformFeedback): void;
        /** Unbind TransformFeedback */
        unbind(): void;
        /**
         * Begin TransformFeedback
         * @param drawMode - DrawMode for TransformFeedback
         * @param shader - A Shader used by TransformFeedback. Current bound shader will be used if not provided.
         */
        beginTransformFeedback(drawMode: DRAW_MODES, shader?: Shader): void;
        /** End TransformFeedback */
        endTransformFeedback(): void;
        /**
         * Create TransformFeedback and bind buffers
         * @param tf - TransformFeedback
         * @returns WebGLTransformFeedback
         */
        protected createGLTransformFeedback(tf: TransformFeedback): WebGLTransformFeedback;
        /**
         * Disposes TransfromFeedback
         * @param {PIXI.TransformFeedback} tf - TransformFeedback
         * @param {boolean} [contextLost=false] - If context was lost, we suppress delete TransformFeedback
         */
        disposeTransformFeedback(tf: TransformFeedback, contextLost?: boolean): void;
        destroy(): void;
    }
}
declare module "packages/core/src/view/ViewSystem" {
    import { Rectangle } from "packages/math/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { ICanvas } from "packages/settings/src/index";
    import type { IRenderer } from "packages/core/src/IRenderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    /**
     * Options for the view system.
     * @memberof PIXI
     */
    export interface ViewSystemOptions {
        /**
         * The canvas to use as the view. If omitted, a new canvas will be created.
         * @memberof PIXI.IRendererOptions
         */
        view?: ICanvas;
        /**
         * The width of the renderer's view.
         * @memberof PIXI.IRendererOptions
         */
        width?: number;
        /**
         * The height of the renderer's view.
         * @memberof PIXI.IRendererOptions
         */
        height?: number;
        /**
         * The resolution / device pixel ratio of the renderer.
         * @memberof PIXI.IRendererOptions
         */
        resolution?: number;
        /**
         * Whether the CSS dimensions of the renderer's view should be resized automatically.
         * @memberof PIXI.IRendererOptions
         */
        autoDensity?: boolean;
    }
    /**
     * The view system manages the main canvas that is attached to the DOM.
     * This main role is to deal with how the holding the view reference and dealing with how it is resized.
     * @memberof PIXI
     */
    export class ViewSystem implements ISystem<ViewSystemOptions, boolean> {
        /** @ignore */
        static defaultOptions: {
            /**
             * {@link PIXI.IRendererOptions.width}
             * @default 800
             * @memberof PIXI.settings.RENDER_OPTIONS
             */
            width: number;
            /**
             * {@link PIXI.IRendererOptions.height}
             * @default 600
             * @memberof PIXI.settings.RENDER_OPTIONS
             */
            height: number;
            /**
             * {@link PIXI.IRendererOptions.resolution}
             * @type {number}
             * @default PIXI.settings.RESOLUTION
             * @memberof PIXI.settings.RENDER_OPTIONS
             */
            resolution: number;
            /**
             * {@link PIXI.IRendererOptions.autoDensity}
             * @default false
             * @memberof PIXI.settings.RENDER_OPTIONS
             */
            autoDensity: boolean;
        };
        /** @ignore */
        static extension: ExtensionMetadata;
        private renderer;
        /**
         * The resolution / device pixel ratio of the renderer.
         * @member {number}
         * @default PIXI.settings.RESOLUTION
         */
        resolution: number;
        /**
         * Measurements of the screen. (0, 0, screenWidth, screenHeight).
         *
         * Its safe to use as filterArea or hitArea for the whole stage.
         * @member {PIXI.Rectangle}
         */
        screen: Rectangle;
        /**
         * The canvas element that everything is drawn to.
         * @member {PIXI.ICanvas}
         */
        element: ICanvas;
        /**
         * Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
         * @member {boolean}
         */
        autoDensity: boolean;
        constructor(renderer: IRenderer);
        /**
         * initiates the view system
         * @param {PIXI.ViewOptions} options - the options for the view
         */
        init(options: ViewSystemOptions): void;
        /**
         * Resizes the screen and canvas to the specified dimensions.
         * @param desiredScreenWidth - The new width of the screen.
         * @param desiredScreenHeight - The new height of the screen.
         */
        resizeView(desiredScreenWidth: number, desiredScreenHeight: number): void;
        /**
         * Destroys this System and optionally removes the canvas from the dom.
         * @param {boolean} [removeView=false] - Whether to remove the canvas from the DOM.
         */
        destroy(removeView: boolean): void;
    }
}
declare module "packages/core/src/Renderer" {
    import { RENDERER_TYPE } from "packages/constants/src/index";
    import { UniformGroup } from "packages/core/src/shader/UniformGroup";
    import { SystemManager } from "packages/core/src/system/SystemManager";
    import type { ColorSource } from "packages/color/src/index";
    import type { MSAA_QUALITY } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Rectangle } from "packages/math/src/index";
    import type { ICanvas } from "packages/settings/src/index";
    import type { BackgroundSystem } from "packages/core/src/background/BackgroundSystem";
    import type { BatchSystem } from "packages/core/src/batch/BatchSystem";
    import type { ContextSystem } from "packages/core/src/context/ContextSystem";
    import type { FilterSystem } from "packages/core/src/filters/FilterSystem";
    import type { FramebufferSystem } from "packages/core/src/framebuffer/FramebufferSystem";
    import type { MultisampleSystem } from "packages/core/src/framebuffer/MultisampleSystem";
    import type { BufferSystem } from "packages/core/src/geometry/BufferSystem";
    import type { GeometrySystem } from "packages/core/src/geometry/GeometrySystem";
    import type { IRenderableObject, IRenderer, IRendererOptions, IRendererRenderOptions, IRenderingContext } from "packages/core/src/IRenderer";
    import type { MaskSystem } from "packages/core/src/mask/MaskSystem";
    import type { ScissorSystem } from "packages/core/src/mask/ScissorSystem";
    import type { StencilSystem } from "packages/core/src/mask/StencilSystem";
    import type { IRendererPlugins, PluginSystem } from "packages/core/src/plugin/PluginSystem";
    import type { ProjectionSystem } from "packages/core/src/projection/ProjectionSystem";
    import type { ObjectRendererSystem } from "packages/core/src/render/ObjectRendererSystem";
    import type { GenerateTextureSystem, IGenerateTextureOptions } from "packages/core/src/renderTexture/GenerateTextureSystem";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { RenderTextureSystem } from "packages/core/src/renderTexture/RenderTextureSystem";
    import type { ShaderSystem } from "packages/core/src/shader/ShaderSystem";
    import type { StartupSystem } from "packages/core/src/startup/StartupSystem";
    import type { StateSystem } from "packages/core/src/state/StateSystem";
    import type { TextureGCSystem } from "packages/core/src/textures/TextureGCSystem";
    import type { TextureSystem } from "packages/core/src/textures/TextureSystem";
    import type { TransformFeedbackSystem } from "packages/core/src/transformFeedback/TransformFeedbackSystem";
    import type { ViewSystem } from "packages/core/src/view/ViewSystem";
    export interface Renderer extends GlobalMixins.Renderer {
    }
    /**
     * The Renderer draws the scene and all its content onto a WebGL enabled canvas.
     *
     * This renderer should be used for browsers that support WebGL.
     *
     * This renderer works by automatically managing WebGLBatches, so no need for Sprite Batches or Sprite Clouds.
     * Don't forget to add the view to your DOM or you will not see anything!
     *
     * Renderer is composed of systems that manage specific tasks. The following systems are added by default
     * whenever you create a renderer:
     *
     * | System                               | Description                                                                   |
     * | ------------------------------------ | ----------------------------------------------------------------------------- |
     *
     * | Generic Systems                      | Systems that manage functionality that all renderer types share               |
     * | ------------------------------------ | ----------------------------------------------------------------------------- |
     * | {@link PIXI.ViewSystem}              | This manages the main view of the renderer usually a Canvas                   |
     * | {@link PIXI.PluginSystem}            | This manages plugins for the renderer                                         |
     * | {@link PIXI.BackgroundSystem}        | This manages the main views background color and alpha                        |
     * | {@link PIXI.StartupSystem}           | Boots up a renderer and initiatives all the systems                           |
     * | {@link PIXI.EventSystem}             | This manages UI events.                                                       |
     *
     * | WebGL Core Systems                   | Provide an optimised, easy to use API to work with WebGL                      |
     * | ------------------------------------ | ----------------------------------------------------------------------------- |
     * | {@link PIXI.ContextSystem}           | This manages the WebGL context and extensions.                                |
     * | {@link PIXI.FramebufferSystem}       | This manages framebuffers, which are used for offscreen rendering.            |
     * | {@link PIXI.GeometrySystem}          | This manages geometries & buffers, which are used to draw object meshes.      |
     * | {@link PIXI.ShaderSystem}            | This manages shaders, programs that run on the GPU to calculate 'em pixels.   |
     * | {@link PIXI.StateSystem}             | This manages the WebGL state variables like blend mode, depth testing, etc.   |
     * | {@link PIXI.TextureSystem}           | This manages textures and their resources on the GPU.                         |
     * | {@link PIXI.TextureGCSystem}         | This will automatically remove textures from the GPU if they are not used.    |
     * | {@link PIXI.MultisampleSystem}       | This manages the multisample const on the WEbGL Renderer                      |
     *
     * | PixiJS High-Level Systems            | Set of specific systems designed to work with PixiJS objects                  |
     * | ------------------------------------ | ----------------------------------------------------------------------------- |
     * | {@link PIXI.GenerateTextureSystem}   | This adds the ability to generate textures from any PIXI.DisplayObject        |
     * | {@link PIXI.ProjectionSystem}        | This manages the `projectionMatrix`, used by shaders to get NDC coordinates.  |
     * | {@link PIXI.RenderTextureSystem}     | This manages render-textures, which are an abstraction over framebuffers.     |
     * | {@link PIXI.MaskSystem}              | This manages masking operations.                                              |
     * | {@link PIXI.ScissorSystem}           | This handles scissor masking, and is used internally by {@link PIXI.MaskSystem} |
     * | {@link PIXI.StencilSystem}           | This handles stencil masking, and is used internally by {@link PIXI.MaskSystem} |
     * | {@link PIXI.FilterSystem}            | This manages the filtering pipeline for post-processing effects.              |
     * | {@link PIXI.BatchSystem}             | This manages object renderers that defer rendering until a flush.             |
     * | {@link PIXI.Prepare}                 | This manages uploading assets to the GPU.                                     |
     * | {@link PIXI.Extract}                 | This extracts image data from display objects.                                |
     *
     * The breadth of the API surface provided by the renderer is contained within these systems.
     * @memberof PIXI
     */
    export class Renderer extends SystemManager<Renderer> implements IRenderer {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * The type of the renderer. will be PIXI.RENDERER_TYPE.CANVAS
         * @member {number}
         * @see PIXI.RENDERER_TYPE
         */
        readonly type = RENDERER_TYPE.WEBGL;
        /**
         * Options passed to the constructor.
         * @type {PIXI.IRendererOptions}
         */
        readonly options: IRendererOptions;
        /**
         * WebGL context, set by {@link PIXI.ContextSystem this.context}.
         * @readonly
         * @member {WebGLRenderingContext}
         */
        gl: IRenderingContext;
        /**
         * Global uniforms
         * Add any uniforms you want shared across your shaders.
         * the must be added before the scene is rendered for the first time
         * as we dynamically buildcode to handle all global var per shader
         *
         */
        globalUniforms: UniformGroup;
        /** Unique UID assigned to the renderer's WebGL context. */
        CONTEXT_UID: number;
        /**
         * Mask system instance
         * @readonly
         */
        readonly mask: MaskSystem;
        /**
         * Context system instance
         * @readonly
         */
        readonly context: ContextSystem;
        /**
         * State system instance
         * @readonly
         */
        readonly state: StateSystem;
        /**
         * Shader system instance
         * @readonly
         */
        readonly shader: ShaderSystem;
        /**
         * Texture system instance
         * @readonly
         */
        readonly texture: TextureSystem;
        /**
         * Buffer system instance
         * @readonly
         */
        readonly buffer: BufferSystem;
        /**
         * TransformFeedback system instance
         * @readonly
         */
        transformFeedback: TransformFeedbackSystem;
        /**
         * Geometry system instance
         * @readonly
         */
        readonly geometry: GeometrySystem;
        /**
         * Framebuffer system instance
         * @readonly
         */
        readonly framebuffer: FramebufferSystem;
        /**
         * Scissor system instance
         * @readonly
         */
        readonly scissor: ScissorSystem;
        /**
         * Stencil system instance
         * @readonly
         */
        readonly stencil: StencilSystem;
        /**
         * Projection system instance
         * @readonly
         */
        readonly projection: ProjectionSystem;
        /**
         * Texture garbage collector system instance
         * @readonly
         */
        readonly textureGC: TextureGCSystem;
        /**
         * Filter system instance
         * @readonly
         */
        readonly filter: FilterSystem;
        /**
         * RenderTexture system instance
         * @readonly
         */
        readonly renderTexture: RenderTextureSystem;
        /**
         * Batch system instance
         * @readonly
         */
        readonly batch: BatchSystem;
        /**
         * plugin system instance
         * @readonly
         */
        readonly _plugin: PluginSystem;
        /**
         * _multisample system instance
         * @readonly
         */
        readonly _multisample: MultisampleSystem;
        /**
         * textureGenerator system instance
         * @readonly
         */
        readonly textureGenerator: GenerateTextureSystem;
        /**
         * background system instance
         * @readonly
         */
        readonly background: BackgroundSystem;
        /**
         * _view system instance
         * @readonly
         */
        readonly _view: ViewSystem;
        /**
         * _render system instance
         * @readonly
         */
        readonly objectRenderer: ObjectRendererSystem;
        /**
         * startup system instance
         * @readonly
         */
        readonly startup: StartupSystem;
        /**
         * Create renderer if WebGL is available. Overrideable
         * by the **@pixi/canvas-renderer** package to allow fallback.
         * throws error if WebGL is not available.
         * @param options
         * @private
         */
        static test(options?: Partial<IRendererOptions>): boolean;
        /**
         * @param {PIXI.IRendererOptions} [options] - See {@link PIXI.settings.RENDER_OPTIONS} for defaults.
         */
        constructor(options?: Partial<IRendererOptions>);
        /**
         * Renders the object to its WebGL view.
         * @param displayObject - The object to be rendered.
         * @param {object} [options] - Object to use for render options.
         * @param {PIXI.RenderTexture} [options.renderTexture] - The render texture to render to.
         * @param {boolean} [options.clear=true] - Should the canvas be cleared before the new render.
         * @param {PIXI.Matrix} [options.transform] - A transform to apply to the render texture before rendering.
         * @param {boolean} [options.skipUpdateTransform=false] - Should we skip the update transform pass?
         */
        render(displayObject: IRenderableObject, options?: IRendererRenderOptions): void;
        /**
         * Resizes the WebGL view to the specified width and height.
         * @param desiredScreenWidth - The desired width of the screen.
         * @param desiredScreenHeight - The desired height of the screen.
         */
        resize(desiredScreenWidth: number, desiredScreenHeight: number): void;
        /**
         * Resets the WebGL state so you can render things however you fancy!
         * @returns Returns itself.
         */
        reset(): this;
        /** Clear the frame buffer. */
        clear(): void;
        /**
         * Removes everything from the renderer (event listeners, spritebatch, etc...)
         * @param [removeView=false] - Removes the Canvas element from the DOM.
         *  See: https://github.com/pixijs/pixijs/issues/2233
         */
        destroy(removeView?: boolean): void;
        /** Collection of plugins */
        get plugins(): IRendererPlugins;
        /** The number of msaa samples of the canvas. */
        get multisample(): MSAA_QUALITY;
        /**
         * Same as view.width, actual number of pixels in the canvas by horizontal.
         * @member {number}
         * @readonly
         * @default 800
         */
        get width(): number;
        /**
         * Same as view.height, actual number of pixels in the canvas by vertical.
         * @default 600
         */
        get height(): number;
        /** The resolution / device pixel ratio of the renderer. */
        get resolution(): number;
        set resolution(value: number);
        /** Whether CSS dimensions of canvas view should be resized to screen dimensions automatically. */
        get autoDensity(): boolean;
        /** The canvas element that everything is drawn to.*/
        get view(): ICanvas;
        /**
         * Measurements of the screen. (0, 0, screenWidth, screenHeight).
         *
         * Its safe to use as filterArea or hitArea for the whole stage.
         * @member {PIXI.Rectangle}
         */
        get screen(): Rectangle;
        /** the last object rendered by the renderer. Useful for other plugins like interaction managers */
        get lastObjectRendered(): IRenderableObject;
        /** Flag if we are rendering to the screen vs renderTexture */
        get renderingToScreen(): boolean;
        /** When logging Pixi to the console, this is the name we will show */
        get rendererLogId(): string;
        /**
         * This sets weather the screen is totally cleared between each frame withthe background color and alpha
         * @deprecated since 7.0.0
         */
        get clearBeforeRender(): boolean;
        /**
         * Pass-thru setting for the canvas' context `alpha` property. This is typically
         * not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.
         * @deprecated since 7.0.0
         * @member {boolean}
         */
        get useContextAlpha(): boolean | 'notMultiplied';
        /**
         * readonly drawing buffer preservation
         * we can only know this if Pixi created the context
         * @deprecated since 7.0.0
         */
        get preserveDrawingBuffer(): boolean;
        /**
         * The background color to fill if not transparent
         * @member {number}
         * @deprecated since 7.0.0
         */
        get backgroundColor(): ColorSource;
        set backgroundColor(value: ColorSource);
        /**
         * The background color alpha. Setting this to 0 will make the canvas transparent.
         * @member {number}
         * @deprecated since 7.0.0
         */
        get backgroundAlpha(): number;
        /**
         * @deprecated since 7.0.0
         */
        set backgroundAlpha(value: number);
        /**
         * @deprecated since 7.0.0
         */
        get powerPreference(): WebGLPowerPreference;
        /**
         * Useful function that returns a texture of the display object that can then be used to create sprites
         * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
         * @param displayObject - The displayObject the object will be generated from.
         * @param {IGenerateTextureOptions} options - Generate texture options.
         * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
         *        if no region is specified, defaults to the local bounds of the displayObject.
         * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
         * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
         * @returns A texture of the graphics object.
         */
        generateTexture(displayObject: IRenderableObject, options?: IGenerateTextureOptions): RenderTexture;
        /**
         * Collection of installed plugins. These are included by default in PIXI, but can be excluded
         * by creating a custom build. Consult the README for more information about creating custom
         * builds and excluding plugins.
         * @private
         */
        static readonly __plugins: IRendererPlugins;
        /**
         * The collection of installed systems.
         * @private
         */
        static readonly __systems: Record<string, any>;
    }
}
declare module "packages/core/src/system/ISystem" {
    import type { Renderer } from "packages/core/src/Renderer";
    /**
     * Interface for systems used by the {@link PIXI.Renderer}.
     * @memberof PIXI
     */
    export interface ISystem<InitOptions = null, DestroyOptions = null> {
        init?(options?: InitOptions): void;
        /** Generic destroy methods to be overridden by the subclass */
        destroy?(options?: DestroyOptions): void;
    }
    /**
     * Types for system and pipe classes.
     * @ignore
     */
    export interface ISystemConstructor<R = Renderer> {
        new (renderer: R): ISystem;
    }
}
declare module "packages/core/src/plugin/PluginSystem" {
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { IRenderer } from "packages/core/src/IRenderer";
    import type { ISystem } from "packages/core/src/system/ISystem";
    export interface IRendererPlugins extends GlobalMixins.IRendererPlugins {
        [key: string]: any;
    }
    /**
     * Manages the functionality that allows users to extend pixi functionality via additional plugins.
     * @memberof PIXI
     */
    export class PluginSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** @ignore */
        rendererPlugins: IRendererPlugins;
        /**
         * Collection of plugins.
         * @readonly
         * @member {object}
         */
        readonly plugins: IRendererPlugins;
        private renderer;
        constructor(renderer: IRenderer);
        /**
         * Initialize the plugins.
         * @protected
         */
        init(): void;
        destroy(): void;
    }
}
declare module "packages/core/src/systems" {
    export * from "packages/core/src/background/BackgroundSystem";
    export * from "packages/core/src/batch/BatchSystem";
    export * from "packages/core/src/context/ContextSystem";
    export * from "packages/core/src/filters/FilterSystem";
    export * from "packages/core/src/framebuffer/FramebufferSystem";
    export * from "packages/core/src/geometry/GeometrySystem";
    export * from "packages/core/src/mask/MaskSystem";
    export * from "packages/core/src/mask/ScissorSystem";
    export * from "packages/core/src/mask/StencilSystem";
    export * from "packages/core/src/plugin/PluginSystem";
    export * from "packages/core/src/projection/ProjectionSystem";
    export * from "packages/core/src/renderTexture/GenerateTextureSystem";
    export * from "packages/core/src/renderTexture/RenderTextureSystem";
    export * from "packages/core/src/shader/ShaderSystem";
    export * from "packages/core/src/startup/StartupSystem";
    export * from "packages/core/src/state/StateSystem";
    export * from "packages/core/src/system/SystemManager";
    export * from "packages/core/src/textures/TextureGCSystem";
    export * from "packages/core/src/textures/TextureSystem";
    export * from "packages/core/src/transformFeedback/TransformFeedbackSystem";
    export * from "packages/core/src/view/ViewSystem";
}
declare module "packages/core/src/IRenderer" {
    import type { MSAA_QUALITY, RENDERER_TYPE } from "packages/constants/src/index";
    import type { Matrix, Rectangle, Transform } from "packages/math/src/index";
    import type { ICanvas } from "packages/settings/src/index";
    import type { IRendererPlugins } from "packages/core/src/plugin/PluginSystem";
    import type { IGenerateTextureOptions } from "packages/core/src/renderTexture/GenerateTextureSystem";
    import type { RenderTexture } from "packages/core/src/renderTexture/RenderTexture";
    import type { SystemManager } from "packages/core/src/system/SystemManager";
    import type { BackgroundSystem, BackgroundSystemOptions, ContextSystemOptions, StartupSystemOptions, ViewSystemOptions } from "packages/core/src/systems";
    import type { ImageSource } from "packages/core/src/textures/BaseTexture";
    /**
     * Interface for DisplayObject to interface with Renderer.
     * The minimum APIs needed to implement a renderable object.
     * @memberof PIXI
     */
    export interface IRenderableObject extends GlobalMixins.IRenderableObject {
        /** Object must have a parent container */
        parent: IRenderableContainer;
        /** Object must have a transform */
        transform: Transform;
        /** Before method for transform updates */
        enableTempParent(): IRenderableContainer;
        /** Update the transforms */
        updateTransform(): void;
        /** After method for transform updates */
        disableTempParent(parent: IRenderableContainer): void;
        /** Render object directly */
        render(renderer: IRenderer): void;
    }
    /**
     * Interface for Container to interface with Renderer.
     * @memberof PIXI
     */
    export interface IRenderableContainer extends IRenderableObject {
        /** Get Local bounds for container */
        getLocalBounds(rect?: Rectangle, skipChildrenUpdate?: boolean): Rectangle;
    }
    /**
     * Mixed WebGL1 / WebGL2 rendering context. Either it's WebGL2, either it's WebGL1 with PixiJS polyfills on it.
     * @memberof PIXI
     */
    export interface IRenderingContext extends WebGL2RenderingContext {
        texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
        texImage2D(target: GLenum, level: GLint, internalformat: GLint, format: GLenum, type: GLenum, source: TexImageSource | ImageSource): void;
        texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
        texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource | ImageSource): void;
        texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
        texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
        texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource | ImageSource): void;
        texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
        texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, source: TexImageSource | ImageSource): void;
        texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
        texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
        texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, source: TexImageSource | ImageSource): void;
        texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint): void;
    }
    /**
     * Renderer options supplied to constructor.
     * @memberof PIXI
     * @see PIXI.settings.RENDER_OPTIONS
     */
    export interface IRendererOptions extends GlobalMixins.IRendererOptions, BackgroundSystemOptions, ContextSystemOptions, ViewSystemOptions, StartupSystemOptions {
    }
    /**
     * @deprecated since 7.2.0
     * @see PIXI.IRendererOptions
     */
    export type IRenderOptions = IRendererOptions;
    export interface IRendererRenderOptions {
        renderTexture?: RenderTexture;
        blit?: boolean;
        clear?: boolean;
        transform?: Matrix;
        skipUpdateTransform?: boolean;
    }
    /**
     * Standard Interface for a Pixi renderer.
     * @memberof PIXI
     */
    export interface IRenderer<VIEW extends ICanvas = ICanvas> extends SystemManager, GlobalMixins.IRenderer {
        resize(width: number, height: number): void;
        render(displayObject: IRenderableObject, options?: IRendererRenderOptions): void;
        generateTexture(displayObject: IRenderableObject, options?: IGenerateTextureOptions): RenderTexture;
        destroy(removeView?: boolean): void;
        clear(): void;
        reset(): void;
        /**
         * The type of the renderer.
         * @see PIXI.RENDERER_TYPE
         */
        readonly type: RENDERER_TYPE;
        /**
         * The options passed in to create a new instance of the renderer.
         * @type {PIXI.IRendererOptions}
         */
        readonly options: IRendererOptions;
        /** When logging Pixi to the console, this is the name we will show */
        readonly rendererLogId: string;
        /** The canvas element that everything is drawn to.*/
        readonly view: VIEW;
        /** Flag if we are rendering to the screen vs renderTexture */
        readonly renderingToScreen: boolean;
        /** The resolution / device pixel ratio of the renderer. */
        resolution: number;
        /** The number of MSAA samples of the renderer. */
        multisample?: MSAA_QUALITY;
        /** the width of the screen */
        readonly width: number;
        /** the height of the screen */
        readonly height: number;
        /** Whether CSS dimensions of canvas view should be resized to screen dimensions automatically. */
        readonly autoDensity: boolean;
        /**
         * Measurements of the screen. (0, 0, screenWidth, screenHeight).
         * Its safe to use as filterArea or hitArea for the whole stage.
         */
        readonly screen: Rectangle;
        /** the last object rendered by the renderer. Useful for other plugins like interaction managers */
        readonly lastObjectRendered: IRenderableObject;
        /** Collection of plugins */
        readonly plugins: IRendererPlugins;
        /** Background color, alpha and clear behavior */
        readonly background: BackgroundSystem;
    }
}
declare module "packages/core/src/shader/utils/checkMaxIfStatementsInShader" {
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    export function checkMaxIfStatementsInShader(maxIfs: number, gl: IRenderingContext): number;
}
declare module "packages/core/src/batch/BatchDrawCall" {
    import { DRAW_MODES } from "packages/constants/src/index";
    import type { BLEND_MODES } from "packages/constants/src/index";
    import type { BatchTextureArray } from "packages/core/src/batch/BatchTextureArray";
    /**
     * Used by the batcher to draw batches.
     * Each one of these contains all information required to draw a bound geometry.
     * @memberof PIXI
     */
    export class BatchDrawCall {
        texArray: BatchTextureArray;
        type: DRAW_MODES;
        blend: BLEND_MODES;
        start: number;
        size: number;
        /** Data for uniforms or custom webgl state. */
        data: any;
        constructor();
    }
}
declare module "packages/core/src/batch/BatchGeometry" {
    import { Buffer } from "packages/core/src/geometry/Buffer";
    import { Geometry } from "packages/core/src/geometry/Geometry";
    /**
     * Geometry used to batch standard PIXI content (e.g. Mesh, Sprite, Graphics objects).
     * @memberof PIXI
     */
    export class BatchGeometry extends Geometry {
        /**
         * Buffer used for position, color, texture IDs
         * @protected
         */
        _buffer: Buffer;
        /**
         * Index buffer data
         * @protected
         */
        _indexBuffer: Buffer;
        /**
         * @param {boolean} [_static=false] - Optimization flag, where `false`
         *        is updated every frame, `true` doesn't change frame-to-frame.
         */
        constructor(_static?: boolean);
    }
}
declare module "packages/core/src/batch/BatchShaderGenerator" {
    import { Program } from "packages/core/src/shader/Program";
    import { Shader } from "packages/core/src/shader/Shader";
    import { UniformGroup } from "packages/core/src/shader/UniformGroup";
    /**
     * Helper that generates batching multi-texture shader. Use it with your new BatchRenderer
     * @memberof PIXI
     */
    export class BatchShaderGenerator {
        /** Reference to the vertex shader source. */
        vertexSrc: string;
        /** Reference to the fragment shader template. Must contain "%count%" and "%forloop%". */
        fragTemplate: string;
        programCache: {
            [key: number]: Program;
        };
        defaultGroupCache: {
            [key: number]: UniformGroup;
        };
        /**
         * @param vertexSrc - Vertex shader
         * @param fragTemplate - Fragment shader template
         */
        constructor(vertexSrc: string, fragTemplate: string);
        generateShader(maxTextures: number): Shader;
        generateSampleSrc(maxTextures: number): string;
    }
}
declare module "packages/core/src/batch/canUploadSameBuffer" {
    /**
     * Uploading the same buffer multiple times in a single frame can cause performance issues.
     * Apparent on iOS so only check for that at the moment
     * This check may become more complex if this issue pops up elsewhere.
     * @private
     * @returns {boolean} `true` if the same buffer may be uploaded more than once.
     */
    export function canUploadSameBuffer(): boolean;
}
declare module "packages/core/src/batch/maxRecommendedTextures" {
    /**
     * The maximum recommended texture units to use.
     * In theory the bigger the better, and for desktop we'll use as many as we can.
     * But some mobile devices slow down if there is to many branches in the shader.
     * So in practice there seems to be a sweet spot size that varies depending on the device.
     *
     * In v4, all mobile devices were limited to 4 texture units because for this.
     * In v5, we allow all texture units to be used on modern Apple or Android devices.
     * @private
     * @param {number} max
     * @returns {number} The maximum recommended texture units to use.
     */
    export function maxRecommendedTextures(max: number): number;
}
declare module "packages/core/src/batch/BatchRenderer" {
    import { ViewableBuffer } from "packages/core/src/geometry/ViewableBuffer";
    import { State } from "packages/core/src/state/State";
    import { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import { BatchDrawCall } from "packages/core/src/batch/BatchDrawCall";
    import { BatchGeometry } from "packages/core/src/batch/BatchGeometry";
    import { BatchShaderGenerator } from "packages/core/src/batch/BatchShaderGenerator";
    import { BatchTextureArray } from "packages/core/src/batch/BatchTextureArray";
    import { ObjectRenderer } from "packages/core/src/batch/ObjectRenderer";
    import type { BLEND_MODES } from "packages/constants/src/index";
    import type { ExtensionMetadata } from "packages/extensions/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { Shader } from "packages/core/src/shader/Shader";
    import type { Texture } from "packages/core/src/textures/Texture";
    /**
     * Interface for elements like Sprite, Mesh etc. for batching.
     * @memberof PIXI
     */
    export interface IBatchableElement {
        _texture: Texture;
        vertexData: Float32Array;
        indices: Uint16Array | Uint32Array | Array<number>;
        uvs: Float32Array;
        worldAlpha: number;
        _tintRGB: number;
        blendMode: BLEND_MODES;
    }
    /**
     * Renderer dedicated to drawing and batching sprites.
     *
     * This is the default batch renderer. It buffers objects
     * with texture-based geometries and renders them in
     * batches. It uploads multiple textures to the GPU to
     * reduce to the number of draw calls.
     * @memberof PIXI
     */
    export class BatchRenderer extends ObjectRenderer {
        /**
         * The maximum textures that this device supports.
         * @static
         * @default 32
         */
        static get defaultMaxTextures(): number;
        static set defaultMaxTextures(value: number);
        /** @ignore */
        private static _defaultMaxTextures;
        /**
         * The default sprite batch size.
         *
         * The default aims to balance desktop and mobile devices.
         * @static
         */
        static defaultBatchSize: number;
        /**
         * Can we upload the same buffer in a single frame?
         * @static
         */
        static get canUploadSameBuffer(): boolean;
        static set canUploadSameBuffer(value: boolean);
        /** @ignore */
        private static _canUploadSameBuffer;
        /** @ignore */
        static extension: ExtensionMetadata;
        /** The WebGL state in which this renderer will work. */
        readonly state: State;
        /**
         * The number of bufferable objects before a flush
         * occurs automatically.
         * @default PIXI.BatchRenderer.defaultBatchSize * 4
         */
        size: number;
        /**
         * Maximum number of textures that can be uploaded to
         * the GPU under the current context. It is initialized
         * properly in `this.contextChange`.
         * @see PIXI.BatchRenderer#contextChange
         * @readonly
         */
        maxTextures: number;
        /**
         * This is used to generate a shader that can
         * color each vertex based on a `aTextureId`
         * attribute that points to an texture in `uSampler`.
         *
         * This enables the objects with different textures
         * to be drawn in the same draw call.
         *
         * You can customize your shader by creating your
         * custom shader generator.
         */
        protected shaderGenerator: BatchShaderGenerator;
        /**
         * The class that represents the geometry of objects
         * that are going to be batched with this.
         * @member {object}
         * @default PIXI.BatchGeometry
         */
        protected geometryClass: typeof BatchGeometry;
        /**
         * Size of data being buffered per vertex in the
         * attribute buffers (in floats). By default, the
         * batch-renderer plugin uses 6:
         *
         * | aVertexPosition | 2 |
         * |-----------------|---|
         * | aTextureCoords  | 2 |
         * | aColor          | 1 |
         * | aTextureId      | 1 |
         * @default 6
         */
        protected vertexSize: number;
        /** Total count of all vertices used by the currently buffered objects. */
        protected _vertexCount: number;
        /** Total count of all indices used by the currently buffered objects. */
        protected _indexCount: number;
        /**
         * Buffer of objects that are yet to be rendered.
         * @member {PIXI.DisplayObject[]}
         */
        protected _bufferedElements: Array<IBatchableElement>;
        /**
         * Data for texture batch builder, helps to save a bit of CPU on a pass.
         * @member {PIXI.BaseTexture[]}
         */
        protected _bufferedTextures: Array<BaseTexture>;
        /** Number of elements that are buffered and are waiting to be flushed. */
        protected _bufferSize: number;
        /**
         * This shader is generated by `this.shaderGenerator`.
         *
         * It is generated specifically to handle the required
         * number of textures being batched together.
         */
        protected _shader: Shader;
        /**
         * A flush may occur multiple times in a single
         * frame. On iOS devices or when
         * `BatchRenderer.canUploadSameBuffer` is false, the
         * batch renderer does not upload data to the same
         * `WebGLBuffer` for performance reasons.
         *
         * This is the index into `packedGeometries` that points to
         * geometry holding the most recent buffers.
         */
        protected _flushId: number;
        /**
         * Pool of `ViewableBuffer` objects that are sorted in
         * order of increasing size. The flush method uses
         * the buffer with the least size above the amount
         * it requires. These are used for passing attributes.
         *
         * The first buffer has a size of 8; each subsequent
         * buffer has double capacity of its previous.
         * @member {PIXI.ViewableBuffer[]}
         * @see PIXI.BatchRenderer#getAttributeBuffer
         */
        protected _aBuffers: Array<ViewableBuffer>;
        /**
         * Pool of `Uint16Array` objects that are sorted in
         * order of increasing size. The flush method uses
         * the buffer with the least size above the amount
         * it requires. These are used for passing indices.
         *
         * The first buffer has a size of 12; each subsequent
         * buffer has double capacity of its previous.
         * @member {Uint16Array[]}
         * @see PIXI.BatchRenderer#getIndexBuffer
         */
        protected _iBuffers: Array<Uint16Array>;
        protected _dcIndex: number;
        protected _aIndex: number;
        protected _iIndex: number;
        protected _attributeBuffer: ViewableBuffer;
        protected _indexBuffer: Uint16Array;
        protected _tempBoundTextures: BaseTexture[];
        /**
         * Pool of `this.geometryClass` geometry objects
         * that store buffers. They are used to pass data
         * to the shader on each draw call.
         *
         * These are never re-allocated again, unless a
         * context change occurs; however, the pool may
         * be expanded if required.
         * @member {PIXI.Geometry[]}
         * @see PIXI.BatchRenderer.contextChange
         */
        private _packedGeometries;
        /**
         * Size of `this._packedGeometries`. It can be expanded
         * if more than `this._packedGeometryPoolSize` flushes
         * occur in a single frame.
         */
        private _packedGeometryPoolSize;
        /**
         * This will hook onto the renderer's `contextChange`
         * and `prerender` signals.
         * @param {PIXI.Renderer} renderer - The renderer this works for.
         */
        constructor(renderer: Renderer);
        /**
         * @see PIXI.BatchRenderer#maxTextures
         * @deprecated since 7.1.0
         * @readonly
         */
        get MAX_TEXTURES(): number;
        /**
         * The default vertex shader source
         * @readonly
         */
        static get defaultVertexSrc(): string;
        /**
         * The default fragment shader source
         * @readonly
         */
        static get defaultFragmentTemplate(): string;
        /**
         * Set the shader generator.
         * @param {object} [options]
         * @param {string} [options.vertex=PIXI.BatchRenderer.defaultVertexSrc] - Vertex shader source
         * @param {string} [options.fragment=PIXI.BatchRenderer.defaultFragmentTemplate] - Fragment shader template
         */
        setShaderGenerator({ vertex, fragment }?: {
            vertex?: string;
            fragment?: string;
        }): void;
        /**
         * Handles the `contextChange` signal.
         *
         * It calculates `this.maxTextures` and allocating the packed-geometry object pool.
         */
        contextChange(): void;
        /** Makes sure that static and dynamic flush pooled objects have correct dimensions. */
        initFlushBuffers(): void;
        /** Handles the `prerender` signal. It ensures that flushes start from the first geometry object again. */
        onPrerender(): void;
        /**
         * Buffers the "batchable" object. It need not be rendered immediately.
         * @param {PIXI.DisplayObject} element - the element to render when
         *    using this renderer
         */
        render(element: IBatchableElement): void;
        buildTexturesAndDrawCalls(): void;
        /**
         * Populating drawcalls for rendering
         * @param texArray
         * @param start
         * @param finish
         */
        buildDrawCalls(texArray: BatchTextureArray, start: number, finish: number): void;
        /**
         * Bind textures for current rendering
         * @param texArray
         */
        bindAndClearTexArray(texArray: BatchTextureArray): void;
        updateGeometry(): void;
        drawBatches(): void;
        /** Renders the content _now_ and empties the current batch. */
        flush(): void;
        /** Starts a new sprite batch. */
        start(): void;
        /** Stops and flushes the current batch. */
        stop(): void;
        /** Destroys this `BatchRenderer`. It cannot be used again. */
        destroy(): void;
        /**
         * Fetches an attribute buffer from `this._aBuffers` that can hold atleast `size` floats.
         * @param size - minimum capacity required
         * @returns - buffer than can hold atleast `size` floats
         */
        getAttributeBuffer(size: number): ViewableBuffer;
        /**
         * Fetches an index buffer from `this._iBuffers` that can
         * have at least `size` capacity.
         * @param size - minimum required capacity
         * @returns - buffer that can fit `size` indices.
         */
        getIndexBuffer(size: number): Uint16Array;
        /**
         * Takes the four batching parameters of `element`, interleaves
         * and pushes them into the batching attribute/index buffers given.
         *
         * It uses these properties: `vertexData` `uvs`, `textureId` and
         * `indicies`. It also uses the "tint" of the base-texture, if
         * present.
         * @param {PIXI.DisplayObject} element - element being rendered
         * @param attributeBuffer - attribute buffer.
         * @param indexBuffer - index buffer
         * @param aIndex - number of floats already in the attribute buffer
         * @param iIndex - number of indices already in `indexBuffer`
         */
        packInterleavedGeometry(element: IBatchableElement, attributeBuffer: ViewableBuffer, indexBuffer: Uint16Array, aIndex: number, iIndex: number): void;
        /**
         * Pool of `BatchDrawCall` objects that `flush` used
         * to create "batches" of the objects being rendered.
         *
         * These are never re-allocated again.
         * Shared between all batch renderers because it can be only one "flush" working at the moment.
         * @member {PIXI.BatchDrawCall[]}
         */
        static _drawCallPool: Array<BatchDrawCall>;
        /**
         * Pool of `BatchDrawCall` objects that `flush` used
         * to create "batches" of the objects being rendered.
         *
         * These are never re-allocated again.
         * Shared between all batch renderers because it can be only one "flush" working at the moment.
         * @member {PIXI.BatchTextureArray[]}
         */
        static _textureArrayPool: Array<BatchTextureArray>;
    }
}
declare module "packages/core/src/settings" { }
declare module "packages/core/src/autoDetectRenderer" {
    import type { ICanvas } from "packages/settings/src/index";
    import type { IRenderer, IRendererOptions } from "packages/core/src/IRenderer";
    /**
     * Renderer options supplied to `autoDetectRenderer`.
     * @memberof PIXI
     */
    export interface IRendererOptionsAuto extends IRendererOptions {
        /**
         * Force CanvasRenderer even if WebGL is supported. Only available with **pixi.js-legacy**.
         * @default false
         */
        forceCanvas?: boolean;
    }
    export interface IRendererConstructor<VIEW extends ICanvas = ICanvas> {
        test(options?: Partial<IRendererOptionsAuto>): boolean;
        new (options?: Partial<IRendererOptionsAuto>): IRenderer<VIEW>;
    }
    /**
     * This helper function will automatically detect which renderer you should be using.
     * WebGL is the preferred renderer as it is a lot faster. If WebGL is not supported by
     * the browser then this function will return a canvas renderer.
     * @memberof PIXI
     * @function autoDetectRenderer
     * @param options - Options to use.
     */
    export function autoDetectRenderer<VIEW extends ICanvas = ICanvas>(options?: Partial<IRendererOptionsAuto>): IRenderer<VIEW>;
}
declare module "packages/core/src/fragments/index" {
    /**
     * Default vertex shader
     * @memberof PIXI
     * @member {string} defaultVertex
     */
    /**
     * Default filter vertex shader
     * @memberof PIXI
     * @member {string} defaultFilterVertex
     */
    const defaultVertex: string;
    const defaultFilterVertex: string;
    export { defaultFilterVertex, defaultVertex };
}
declare module "packages/core/src/textures/resources/ArrayResource" {
    import { AbstractMultiResource } from "packages/core/src/textures/resources/AbstractMultiResource";
    import type { ISize } from "packages/math/src/index";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    /**
     * A resource that contains a number of sources.
     * @memberof PIXI
     */
    export class ArrayResource extends AbstractMultiResource {
        /**
         * @param source - Number of items in array or the collection
         *        of image URLs to use. Can also be resources, image elements, canvas, etc.
         * @param options - Options to apply to {@link PIXI.autoDetectResource}
         * @param {number} [options.width] - Width of the resource
         * @param {number} [options.height] - Height of the resource
         */
        constructor(source: number | Array<any>, options?: ISize);
        /**
         * Set a baseTexture by ID,
         * ArrayResource just takes resource from it, nothing more
         * @param baseTexture
         * @param index - Zero-based index of resource to set
         * @returns - Instance for chaining
         */
        addBaseTextureAt(baseTexture: BaseTexture, index: number): this;
        /**
         * Add binding
         * @param baseTexture
         */
        bind(baseTexture: BaseTexture): void;
        /**
         * Upload the resources to the GPU.
         * @param renderer
         * @param texture
         * @param glTexture
         * @returns - whether texture was uploaded
         */
        upload(renderer: Renderer, texture: BaseTexture, glTexture: GLTexture): boolean;
    }
}
declare module "packages/core/src/textures/resources/ImageBitmapResource" {
    import { ALPHA_MODES } from "packages/constants/src/index";
    import { BaseImageResource } from "packages/core/src/textures/resources/BaseImageResource";
    import type { Renderer } from "packages/core/src/Renderer";
    import type { BaseTexture } from "packages/core/src/textures/BaseTexture";
    import type { GLTexture } from "packages/core/src/textures/GLTexture";
    /**
     * Options for ImageBitmapResource.
     * @memberof PIXI
     */
    export interface IImageBitmapResourceOptions {
        /** Start loading process automatically when constructed. */
        autoLoad?: boolean;
        /** Load image using cross origin. */
        crossOrigin?: boolean;
        /** Alpha mode used when creating the ImageBitmap. */
        alphaMode?: ALPHA_MODES;
        /**
         * Whether the underlying ImageBitmap is owned by the {@link PIXI.ImageBitmapResource}. When set to `true`,
         * the underlying ImageBitmap will be disposed automatically when disposing {@link PIXI.ImageBitmapResource}.
         * If this option is not set, whether it owns the underlying ImageBitmap is determained by the type of `source`
         * used when constructing {@link PIXI.ImageBitmapResource}:
         * - When `source` is `ImageBitmap`, the underlying ImageBitmap is not owned by default.
         * - When `source` is `string` (a URL), the underlying ImageBitmap is owned by default.
         * @see PIXI.ImageBitmapResource.ownsImageBitmap
         */
        ownsImageBitmap?: boolean;
    }
    /**
     * Resource type for ImageBitmap.
     * @memberof PIXI
     */
    export class ImageBitmapResource extends BaseImageResource {
        /** URL of the image source. */
        url: string | null;
        /**
         * Load image using cross origin.
         * @default false
         */
        crossOrigin: boolean;
        /**
         * Controls texture alphaMode field
         * Copies from options
         * Default is `null`, copies option from baseTexture
         * @readonly
         */
        alphaMode: ALPHA_MODES | null;
        /**
         * Whether the underlying ImageBitmap is owned by the ImageBitmapResource.
         * @see PIXI.IImageBitmapResourceOptions.ownsImageBitmap
         */
        private ownsImageBitmap;
        /**
         * Promise when loading.
         * @default null
         */
        private _load;
        /**
         * @param source - ImageBitmap or URL to use.
         * @param options - Options to use.
         */
        constructor(source: ImageBitmap | string, options?: IImageBitmapResourceOptions);
        load(): Promise<this>;
        /**
         * Upload the image bitmap resource to GPU.
         * @param renderer - Renderer to upload to
         * @param baseTexture - BaseTexture for this resource
         * @param glTexture - GLTexture to use
         * @returns {boolean} true is success
         */
        upload(renderer: Renderer, baseTexture: BaseTexture, glTexture: GLTexture): boolean;
        /** Destroys this resource. */
        dispose(): void;
        /**
         * Used to auto-detect the type of resource.
         * @param {*} source - The source object
         * @returns {boolean} `true` if current environment support ImageBitmap, and source is string or ImageBitmap
         */
        static test(source: unknown): source is string | ImageBitmap;
        /**
         * Cached empty placeholder canvas.
         * @see EMPTY
         */
        private static _EMPTY;
        /**
         * ImageBitmap cannot be created synchronously, so a empty placeholder canvas is needed when loading from URLs.
         * Only for internal usage.
         * @returns The cached placeholder canvas.
         */
        private static get EMPTY();
    }
}
declare module "packages/core/src/textures/resources/index" {
    export * from "packages/core/src/textures/resources/BaseImageResource";
    export * from "packages/core/src/textures/resources/Resource";
    export * from "packages/core/src/textures/resources/AbstractMultiResource";
    export * from "packages/core/src/textures/resources/ArrayResource";
    export * from "packages/core/src/textures/resources/autoDetectResource";
    export * from "packages/core/src/textures/resources/BufferResource";
    export * from "packages/core/src/textures/resources/CanvasResource";
    export * from "packages/core/src/textures/resources/CubeResource";
    export * from "packages/core/src/textures/resources/ImageBitmapResource";
    export * from "packages/core/src/textures/resources/ImageResource";
    export * from "packages/core/src/textures/resources/SVGResource";
    export * from "packages/core/src/textures/resources/VideoResource";
}
declare module "packages/core/src/index" {
    import "packages/core/src/settings";
    /**
     * @namespace PIXI
     */
    /**
     * String of the current PIXI version.
     * @memberof PIXI
     */
    export const VERSION = "$_VERSION";
    export * from "packages/color/src/index";
    export * from "packages/constants/src/index";
    export * from "packages/extensions/src/index";
    export * from "packages/math/src/index";
    export * from "packages/runner/src/index";
    export * from "packages/settings/src/index";
    export * from "packages/ticker/src/index";
    export * as utils from "packages/utils/src/index";
    export * from "packages/core/src/autoDetectRenderer";
    export * from "packages/core/src/background/BackgroundSystem";
    export * from "packages/core/src/batch/BatchDrawCall";
    export * from "packages/core/src/batch/BatchGeometry";
    export * from "packages/core/src/batch/BatchRenderer";
    export * from "packages/core/src/batch/BatchShaderGenerator";
    export * from "packages/core/src/batch/BatchSystem";
    export * from "packages/core/src/batch/BatchTextureArray";
    export * from "packages/core/src/batch/ObjectRenderer";
    export * from "packages/core/src/context/ContextSystem";
    export * from "packages/core/src/filters/Filter";
    export * from "packages/core/src/filters/FilterState";
    export * from "packages/core/src/filters/FilterSystem";
    export * from "packages/core/src/filters/IFilterTarget";
    export * from "packages/core/src/filters/spriteMask/SpriteMaskFilter";
    export * from "packages/core/src/fragments/index";
    export * from "packages/core/src/framebuffer/Framebuffer";
    export * from "packages/core/src/framebuffer/FramebufferSystem";
    export * from "packages/core/src/framebuffer/GLFramebuffer";
    export * from "packages/core/src/framebuffer/MultisampleSystem";
    export * from "packages/core/src/geometry/Attribute";
    export * from "packages/core/src/geometry/Buffer";
    export * from "packages/core/src/geometry/BufferSystem";
    export * from "packages/core/src/geometry/Geometry";
    export * from "packages/core/src/geometry/GeometrySystem";
    export * from "packages/core/src/geometry/ViewableBuffer";
    export * from "packages/core/src/IRenderer";
    export * from "packages/core/src/IRenderer";
    export * from "packages/core/src/mask/MaskData";
    export * from "packages/core/src/mask/MaskSystem";
    export * from "packages/core/src/mask/ScissorSystem";
    export * from "packages/core/src/mask/StencilSystem";
    export * from "packages/core/src/plugin/PluginSystem";
    export * from "packages/core/src/plugin/PluginSystem";
    export * from "packages/core/src/projection/ProjectionSystem";
    export * from "packages/core/src/render/ObjectRendererSystem";
    export * from "packages/core/src/Renderer";
    export * from "packages/core/src/renderTexture/BaseRenderTexture";
    export * from "packages/core/src/renderTexture/GenerateTextureSystem";
    export * from "packages/core/src/renderTexture/GenerateTextureSystem";
    export * from "packages/core/src/renderTexture/RenderTexture";
    export * from "packages/core/src/renderTexture/RenderTexturePool";
    export * from "packages/core/src/renderTexture/RenderTextureSystem";
    export * from "packages/core/src/shader/GLProgram";
    export * from "packages/core/src/shader/Program";
    export * from "packages/core/src/shader/Shader";
    export * from "packages/core/src/shader/ShaderSystem";
    export * from "packages/core/src/shader/UniformGroup";
    export * from "packages/core/src/shader/utils/checkMaxIfStatementsInShader";
    export * from "packages/core/src/shader/utils/generateProgram";
    export * from "packages/core/src/shader/utils/generateUniformBufferSync";
    export * from "packages/core/src/shader/utils/getTestContext";
    export * from "packages/core/src/shader/utils/uniformParsers";
    export * from "packages/core/src/shader/utils/unsafeEvalSupported";
    export * from "packages/core/src/startup/StartupSystem";
    export * from "packages/core/src/state/State";
    export * from "packages/core/src/state/StateSystem";
    export * from "packages/core/src/system/ISystem";
    export * from "packages/core/src/systems";
    export * from "packages/core/src/textures/BaseTexture";
    export * from "packages/core/src/textures/GLTexture";
    export * from "packages/core/src/textures/resources/index";
    export * from "packages/core/src/textures/Texture";
    export * from "packages/core/src/textures/TextureGCSystem";
    export * from "packages/core/src/textures/TextureMatrix";
    export * from "packages/core/src/textures/TextureSystem";
    export * from "packages/core/src/textures/TextureUvs";
    export * from "packages/core/src/transformFeedback/TransformFeedback";
    export * from "packages/core/src/transformFeedback/TransformFeedbackSystem";
    export * from "packages/core/src/utils/Quad";
    export * from "packages/core/src/utils/QuadUv";
    export * from "packages/core/src/view/ViewSystem";
}
declare module "packages/filter-alpha/src/AlphaFilter" {
    import { Filter } from "packages/core/src/index";
    /**
     * Simplest filter - applies alpha.
     *
     * Use this instead of Container's alpha property to avoid visual layering of individual elements.
     * AlphaFilter applies alpha evenly across the entire display object and any opaque elements it contains.
     * If elements are not opaque, they will blend with each other anyway.
     *
     * Very handy if you want to use common features of all filters:
     *
     * 1. Assign a blendMode to this filter, blend all elements inside display object with background.
     *
     * 2. To use clipping in display coordinates, assign a filterArea to the same container that has this filter.
     * @memberof PIXI
     */
    export class AlphaFilter extends Filter {
        /**
         * @param alpha - Amount of alpha from 0 to 1, where 0 is transparent
         */
        constructor(alpha?: number);
        /**
         * Coefficient for alpha multiplication
         * @default 1
         */
        get alpha(): number;
        set alpha(value: number);
    }
}
declare module "packages/filter-alpha/src/index" {
    export * from "packages/filter-alpha/src/AlphaFilter";
}
declare module "packages/filter-blur/src/generateBlurFragSource" {
    export function generateBlurFragSource(kernelSize: number): string;
}
declare module "packages/filter-blur/src/generateBlurVertSource" {
    export function generateBlurVertSource(kernelSize: number, x: boolean): string;
}
declare module "packages/filter-blur/src/BlurFilterPass" {
    import { CLEAR_MODES, Filter } from "packages/core/src/index";
    import type { FilterSystem, RenderTexture } from "packages/core/src/index";
    /**
     * The BlurFilterPass applies a horizontal or vertical Gaussian blur to an object.
     * @memberof PIXI
     */
    export class BlurFilterPass extends Filter {
        horizontal: boolean;
        strength: number;
        passes: number;
        private _quality;
        /**
         * @param horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
         * @param strength - The strength of the blur filter.
         * @param quality - The quality of the blur filter.
         * @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
         * @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
         */
        constructor(horizontal: boolean, strength?: number, quality?: number, resolution?: number, kernelSize?: number);
        /**
         * Applies the filter.
         * @param filterManager - The manager.
         * @param input - The input target.
         * @param output - The output target.
         * @param clearMode - How to clear
         */
        apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
        /**
         * Sets the strength of both the blur.
         * @default 16
         */
        get blur(): number;
        set blur(value: number);
        /**
         * Sets the quality of the blur by modifying the number of passes. More passes means higher
         * quality bluring but the lower the performance.
         * @default 4
         */
        get quality(): number;
        set quality(value: number);
    }
}
declare module "packages/filter-blur/src/BlurFilter" {
    import { CLEAR_MODES, Filter } from "packages/core/src/index";
    import { BlurFilterPass } from "packages/filter-blur/src/BlurFilterPass";
    import type { BLEND_MODES, FilterSystem, RenderTexture } from "packages/core/src/index";
    /**
     * The BlurFilter applies a Gaussian blur to an object.
     *
     * The strength of the blur can be set for the x-axis and y-axis separately.
     * @memberof PIXI
     */
    export class BlurFilter extends Filter {
        blurXFilter: BlurFilterPass;
        blurYFilter: BlurFilterPass;
        private _repeatEdgePixels;
        /**
         * @param strength - The strength of the blur filter.
         * @param quality - The quality of the blur filter.
         * @param {number|null} [resolution=PIXI.Filter.defaultResolution] - The resolution of the blur filter.
         * @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
         */
        constructor(strength?: number, quality?: number, resolution?: number, kernelSize?: number);
        /**
         * Applies the filter.
         * @param filterManager - The manager.
         * @param input - The input target.
         * @param output - The output target.
         * @param clearMode - How to clear
         */
        apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
        protected updatePadding(): void;
        /**
         * Sets the strength of both the blurX and blurY properties simultaneously
         * @default 2
         */
        get blur(): number;
        set blur(value: number);
        /**
         * Sets the number of passes for blur. More passes means higher quality bluring.
         * @default 1
         */
        get quality(): number;
        set quality(value: number);
        /**
         * Sets the strength of the blurX property
         * @default 2
         */
        get blurX(): number;
        set blurX(value: number);
        /**
         * Sets the strength of the blurY property
         * @default 2
         */
        get blurY(): number;
        set blurY(value: number);
        /**
         * Sets the blendmode of the filter
         * @default PIXI.BLEND_MODES.NORMAL
         */
        get blendMode(): BLEND_MODES;
        set blendMode(value: BLEND_MODES);
        /**
         * If set to true the edge of the target will be clamped
         * @default false
         */
        get repeatEdgePixels(): boolean;
        set repeatEdgePixels(value: boolean);
    }
}
declare module "packages/filter-blur/src/index" {
    export * from "packages/filter-blur/src/BlurFilter";
    export * from "packages/filter-blur/src/BlurFilterPass";
}
declare module "packages/filter-color-matrix/src/ColorMatrixFilter" {
    import { Filter } from "packages/core/src/index";
    import type { utils } from "packages/core/src/index";
    export type ColorMatrix = utils.ArrayFixed<number, 20>;
    /**
     * The ColorMatrixFilter class lets you apply a 5x4 matrix transformation on the RGBA
     * color and alpha values of every pixel on your displayObject to produce a result
     * with a new set of RGBA color and alpha values. It's pretty powerful!
     * @example
     * import { filters } from 'pixi.js';
     *
     * const colorMatrix = new filters.ColorMatrixFilter();
     * container.filters = [colorMatrix];
     * colorMatrix.contrast(2);
     * @author Clément Chenebault <clement@goodboydigital.com>
     * @memberof PIXI
     */
    export class ColorMatrixFilter extends Filter {
        constructor();
        /**
         * Transforms current matrix and set the new one
         * @param {number[]} matrix - 5x4 matrix
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        private _loadMatrix;
        /**
         * Multiplies two mat5's
         * @private
         * @param out - 5x4 matrix the receiving matrix
         * @param a - 5x4 matrix the first operand
         * @param b - 5x4 matrix the second operand
         * @returns {number[]} 5x4 matrix
         */
        private _multiply;
        /**
         * Create a Float32 Array and normalize the offset component to 0-1
         * @param {number[]} matrix - 5x4 matrix
         * @returns {number[]} 5x4 matrix with all values between 0-1
         */
        private _colorMatrix;
        /**
         * Adjusts brightness
         * @param b - value of the brigthness (0-1, where 0 is black)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        brightness(b: number, multiply: boolean): void;
        /**
         * Sets each channel on the diagonal of the color matrix.
         * This can be used to achieve a tinting effect on Containers similar to the tint field of some
         * display objects like Sprite, Text, Graphics, and Mesh.
         * @param color - Color of the tint. This is a hex value.
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        tint(color: number, multiply?: boolean): void;
        /**
         * Set the matrices in grey scales
         * @param scale - value of the grey (0-1, where 0 is black)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        greyscale(scale: number, multiply: boolean): void;
        /**
         * Americanized alias of greyscale.
         * @method
         * @param scale - value of the grey (0-1, where 0 is black)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         * @returns {void}
         * @see PIXI.ColorMatrixFilter.greyscale
         */
        grayscale: (scale: number, multiply: boolean) => void;
        /**
         * Set the black and white matrice.
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        blackAndWhite(multiply: boolean): void;
        /**
         * Set the hue property of the color
         * @param rotation - in degrees
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        hue(rotation: number, multiply: boolean): void;
        /**
         * Set the contrast matrix, increase the separation between dark and bright
         * Increase contrast : shadows darker and highlights brighter
         * Decrease contrast : bring the shadows up and the highlights down
         * @param amount - value of the contrast (0-1)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        contrast(amount: number, multiply: boolean): void;
        /**
         * Set the saturation matrix, increase the separation between colors
         * Increase saturation : increase contrast, brightness, and sharpness
         * @param amount - The saturation amount (0-1)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        saturate(amount?: number, multiply?: boolean): void;
        /** Desaturate image (remove color) Call the saturate function */
        desaturate(): void;
        /**
         * Negative image (inverse of classic rgb matrix)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        negative(multiply: boolean): void;
        /**
         * Sepia image
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        sepia(multiply: boolean): void;
        /**
         * Color motion picture process invented in 1916 (thanks Dominic Szablewski)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        technicolor(multiply: boolean): void;
        /**
         * Polaroid filter
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        polaroid(multiply: boolean): void;
        /**
         * Filter who transforms : Red -> Blue and Blue -> Red
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        toBGR(multiply: boolean): void;
        /**
         * Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        kodachrome(multiply: boolean): void;
        /**
         * Brown delicious browni filter (thanks Dominic Szablewski)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        browni(multiply: boolean): void;
        /**
         * Vintage filter (thanks Dominic Szablewski)
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        vintage(multiply: boolean): void;
        /**
         * We don't know exactly what it does, kind of gradient map, but funny to play with!
         * @param desaturation - Tone values.
         * @param toned - Tone values.
         * @param lightColor - Tone values, example: `0xFFE580`
         * @param darkColor - Tone values, example: `0xFFE580`
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        colorTone(desaturation: number, toned: number, lightColor: number, darkColor: number, multiply: boolean): void;
        /**
         * Night effect
         * @param intensity - The intensity of the night effect.
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        night(intensity: number, multiply: boolean): void;
        /**
         * Predator effect
         *
         * Erase the current matrix by setting a new indepent one
         * @param amount - how much the predator feels his future victim
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        predator(amount: number, multiply: boolean): void;
        /**
         * LSD effect
         *
         * Multiply the current matrix
         * @param multiply - if true, current matrix and matrix are multiplied. If false,
         *  just set the current matrix with @param matrix
         */
        lsd(multiply: boolean): void;
        /** Erase the current matrix by setting the default one. */
        reset(): void;
        /**
         * The matrix of the color matrix filter
         * @member {number[]}
         * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
         */
        get matrix(): ColorMatrix;
        set matrix(value: ColorMatrix);
        /**
         * The opacity value to use when mixing the original and resultant colors.
         *
         * When the value is 0, the original color is used without modification.
         * When the value is 1, the result color is used.
         * When in the range (0, 1) the color is interpolated between the original and result by this amount.
         * @default 1
         */
        get alpha(): number;
        set alpha(value: number);
    }
}
declare module "packages/filter-color-matrix/src/index" {
    export * from "packages/filter-color-matrix/src/ColorMatrixFilter";
}
declare module "packages/filter-displacement/src/DisplacementFilter" {
    import { Filter, Matrix, Point } from "packages/core/src/index";
    import type { CLEAR_MODES, FilterSystem, ISpriteMaskTarget, RenderTexture, Texture } from "packages/core/src/index";
    /**
     * The DisplacementFilter class uses the pixel values from the specified texture
     * (called the displacement map) to perform a displacement of an object.
     *
     * You can use this filter to apply all manor of crazy warping effects.
     * Currently the `r` property of the texture is used to offset the `x`
     * and the `g` property of the texture is used to offset the `y`.
     *
     * The way it works is it uses the values of the displacement map to look up the
     * correct pixels to output. This means it's not technically moving the original.
     * Instead, it's starting at the output and asking "which pixel from the original goes here".
     * For example, if a displacement map pixel has `red = 1` and the filter scale is `20`,
     * this filter will output the pixel approximately 20 pixels to the right of the original.
     * @memberof PIXI
     */
    export class DisplacementFilter extends Filter {
        maskSprite: ISpriteMaskTarget;
        maskMatrix: Matrix;
        scale: Point;
        /**
         * @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
         * @param scale - The scale of the displacement
         */
        constructor(sprite: ISpriteMaskTarget, scale?: number);
        /**
         * Applies the filter.
         * @param filterManager - The manager.
         * @param input - The input target.
         * @param output - The output target.
         * @param clearMode - clearMode.
         */
        apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clearMode: CLEAR_MODES): void;
        /** The texture used for the displacement map. Must be power of 2 sized texture. */
        get map(): Texture;
        set map(value: Texture);
    }
}
declare module "packages/filter-displacement/src/index" {
    export * from "packages/filter-displacement/src/DisplacementFilter";
}
declare module "packages/filter-fxaa/src/FXAAFilter" {
    import { Filter } from "packages/core/src/index";
    /**
     * Basic FXAA (Fast Approximate Anti-Aliasing) implementation based on the code on geeks3d.com
     * with the modification that the texture2DLod stuff was removed since it is unsupported by WebGL.
     * @see https://github.com/mitsuhiko/webgl-meincraft
     * @memberof PIXI
     */
    export class FXAAFilter extends Filter {
        constructor();
    }
}
declare module "packages/filter-fxaa/src/index" {
    export * from "packages/filter-fxaa/src/FXAAFilter";
}
declare module "packages/filter-noise/src/NoiseFilter" {
    import { Filter } from "packages/core/src/index";
    /**
     * A Noise effect filter.
     *
     * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
     * @memberof PIXI
     * @author Vico @vicocotea
     */
    export class NoiseFilter extends Filter {
        /**
         * @param {number} [noise=0.5] - The noise intensity, should be a normalized value in the range [0, 1].
         * @param {number} [seed] - A random seed for the noise generation. Default is `Math.random()`.
         */
        constructor(noise?: number, seed?: number);
        /**
         * The amount of noise to apply, this value should be in the range (0, 1].
         * @default 0.5
         */
        get noise(): number;
        set noise(value: number);
        /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
        get seed(): number;
        set seed(value: number);
    }
}
declare module "packages/filter-noise/src/index" {
    export * from "packages/filter-noise/src/NoiseFilter";
}
declare module "bundles/pixi.js/src/filters" {
    import { AlphaFilter } from "packages/filter-alpha/src/index";
    import { BlurFilter, BlurFilterPass } from "packages/filter-blur/src/index";
    import { ColorMatrixFilter } from "packages/filter-color-matrix/src/index";
    import { DisplacementFilter } from "packages/filter-displacement/src/index";
    import { FXAAFilter } from "packages/filter-fxaa/src/index";
    import { NoiseFilter } from "packages/filter-noise/src/index";
    /**
     * Filters namespace has been removed. All filters are now available directly from the root of the package.
     * @namespace PIXI.filters
     * @deprecated
     */
    const filters: {
        /**
         * @class
         * @memberof PIXI.filters
         * @deprecated since 7.1.0
         * @see PIXI.AlphaFilter
         */
        AlphaFilter: typeof AlphaFilter;
        /**
         * @class
         * @memberof PIXI.filters
         * @deprecated since 7.1.0
         * @see PIXI.BlurFilter
         */
        BlurFilter: typeof BlurFilter;
        /**
         * @class
         * @memberof PIXI.filters
         * @deprecated since 7.1.0
         * @see PIXI.BlurFilterPass
         */
        BlurFilterPass: typeof BlurFilterPass;
        /**
         * @class
         * @memberof PIXI.filters
         * @deprecated since 7.1.0
         * @see PIXI.ColorMatrixFilter
         */
        ColorMatrixFilter: typeof ColorMatrixFilter;
        /**
         * @class
         * @memberof PIXI.filters
         * @deprecated since 7.1.0
         * @see PIXI.DisplacementFilter
         */
        DisplacementFilter: typeof DisplacementFilter;
        /**
         * @class
         * @memberof PIXI.filters
         * @deprecated since 7.1.0
         * @see PIXI.FXAAFilter
         */
        FXAAFilter: typeof FXAAFilter;
        /**
         * @class
         * @memberof PIXI.filters
         * @deprecated since 7.1.0
         * @see PIXI.NoiseFilter
         */
        NoiseFilter: typeof NoiseFilter;
    };
    export { filters };
}
declare module "packages/display/src/Bounds" {
    import { Rectangle } from "packages/core/src/index";
    import type { IPointData, Matrix, Transform } from "packages/core/src/index";
    /**
     * 'Builder' pattern for bounds rectangles.
     *
     * This could be called an Axis-Aligned Bounding Box.
     * It is not an actual shape. It is a mutable thing; no 'EMPTY' or those kind of problems.
     * @memberof PIXI
     */
    export class Bounds {
        /** @default Infinity */
        minX: number;
        /** @default Infinity */
        minY: number;
        /** @default -Infinity */
        maxX: number;
        /** @default -Infinity */
        maxY: number;
        rect: Rectangle;
        /**
         * It is updated to _boundsID of corresponding object to keep bounds in sync with content.
         * Updated from outside, thus public modifier.
         */
        updateID: number;
        constructor();
        /**
         * Checks if bounds are empty.
         * @returns - True if empty.
         */
        isEmpty(): boolean;
        /** Clears the bounds and resets. */
        clear(): void;
        /**
         * Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
         * It is not guaranteed that it will return tempRect
         * @param rect - Temporary object will be used if AABB is not empty
         * @returns - A rectangle of the bounds
         */
        getRectangle(rect?: Rectangle): Rectangle;
        /**
         * This function should be inlined when its possible.
         * @param point - The point to add.
         */
        addPoint(point: IPointData): void;
        /**
         * Adds a point, after transformed. This should be inlined when its possible.
         * @param matrix
         * @param point
         */
        addPointMatrix(matrix: Matrix, point: IPointData): void;
        /**
         * Adds a quad, not transformed
         * @param vertices - The verts to add.
         */
        addQuad(vertices: Float32Array): void;
        /**
         * Adds sprite frame, transformed.
         * @param transform - transform to apply
         * @param x0 - left X of frame
         * @param y0 - top Y of frame
         * @param x1 - right X of frame
         * @param y1 - bottom Y of frame
         */
        addFrame(transform: Transform, x0: number, y0: number, x1: number, y1: number): void;
        /**
         * Adds sprite frame, multiplied by matrix
         * @param matrix - matrix to apply
         * @param x0 - left X of frame
         * @param y0 - top Y of frame
         * @param x1 - right X of frame
         * @param y1 - bottom Y of frame
         */
        addFrameMatrix(matrix: Matrix, x0: number, y0: number, x1: number, y1: number): void;
        /**
         * Adds screen vertices from array
         * @param vertexData - calculated vertices
         * @param beginOffset - begin offset
         * @param endOffset - end offset, excluded
         */
        addVertexData(vertexData: Float32Array, beginOffset: number, endOffset: number): void;
        /**
         * Add an array of mesh vertices
         * @param transform - mesh transform
         * @param vertices - mesh coordinates in array
         * @param beginOffset - begin offset
         * @param endOffset - end offset, excluded
         */
        addVertices(transform: Transform, vertices: Float32Array, beginOffset: number, endOffset: number): void;
        /**
         * Add an array of mesh vertices.
         * @param matrix - mesh matrix
         * @param vertices - mesh coordinates in array
         * @param beginOffset - begin offset
         * @param endOffset - end offset, excluded
         * @param padX - x padding
         * @param padY - y padding
         */
        addVerticesMatrix(matrix: Matrix, vertices: Float32Array, beginOffset: number, endOffset: number, padX?: number, padY?: number): void;
        /**
         * Adds other {@link PIXI.Bounds}.
         * @param bounds - The Bounds to be added
         */
        addBounds(bounds: Bounds): void;
        /**
         * Adds other Bounds, masked with Bounds.
         * @param bounds - The Bounds to be added.
         * @param mask - TODO
         */
        addBoundsMask(bounds: Bounds, mask: Bounds): void;
        /**
         * Adds other Bounds, multiplied by matrix. Bounds shouldn't be empty.
         * @param bounds - other bounds
         * @param matrix - multiplicator
         */
        addBoundsMatrix(bounds: Bounds, matrix: Matrix): void;
        /**
         * Adds other Bounds, masked with Rectangle.
         * @param bounds - TODO
         * @param area - TODO
         */
        addBoundsArea(bounds: Bounds, area: Rectangle): void;
        /**
         * Pads bounds object, making it grow in all directions.
         * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
         * @param paddingX - The horizontal padding amount.
         * @param paddingY - The vertical padding amount.
         */
        pad(paddingX?: number, paddingY?: number): void;
        /**
         * Adds padded frame. (x0, y0) should be strictly less than (x1, y1)
         * @param x0 - left X of frame
         * @param y0 - top Y of frame
         * @param x1 - right X of frame
         * @param y1 - bottom Y of frame
         * @param padX - padding X
         * @param padY - padding Y
         */
        addFramePad(x0: number, y0: number, x1: number, y1: number, padX: number, padY: number): void;
    }
}
declare module "packages/display/src/DisplayObject" {
    import { Rectangle, Transform, utils } from "packages/core/src/index";
    import { Bounds } from "packages/display/src/Bounds";
    import type { Filter, IPointData, MaskData, Matrix, ObservablePoint, Point, Renderer } from "packages/core/src/index";
    import type { Container } from "packages/display/src/Container";
    export interface IDestroyOptions {
        children?: boolean;
        texture?: boolean;
        baseTexture?: boolean;
    }
    export interface DisplayObjectEvents extends GlobalMixins.DisplayObjectEvents {
        added: [container: Container];
        childAdded: [child: DisplayObject, container: Container, index: number];
        childRemoved: [child: DisplayObject, container: Container, index: number];
        destroyed: [];
        removed: [container: Container];
    }
    export interface DisplayObject extends Omit<GlobalMixins.DisplayObject, keyof utils.EventEmitter<DisplayObjectEvents>>, utils.EventEmitter<DisplayObjectEvents> {
    }
    /**
     * The base class for all objects that are rendered on the screen.
     *
     * This is an abstract class and can not be used on its own; rather it should be extended.
     *
     * ## Display objects implemented in PixiJS
     *
     * | Display Object                  | Description                                                           |
     * | ------------------------------- | --------------------------------------------------------------------- |
     * | {@link PIXI.Container}          | Adds support for `children` to DisplayObject                          |
     * | {@link PIXI.Graphics}           | Shape-drawing display object similar to the Canvas API                |
     * | {@link PIXI.Sprite}             | Draws textures (i.e. images)                                          |
     * | {@link PIXI.Text}               | Draws text using the Canvas API internally                            |
     * | {@link PIXI.BitmapText}         | More scaleable solution for text rendering, reusing glyph textures    |
     * | {@link PIXI.TilingSprite}       | Draws textures/images in a tiled fashion                              |
     * | {@link PIXI.AnimatedSprite}     | Draws an animation of multiple images                                 |
     * | {@link PIXI.Mesh}               | Provides a lower-level API for drawing meshes with custom data        |
     * | {@link PIXI.NineSlicePlane}     | Mesh-related                                                          |
     * | {@link PIXI.SimpleMesh}         | v4-compatible mesh                                                    |
     * | {@link PIXI.SimplePlane}        | Mesh-related                                                          |
     * | {@link PIXI.SimpleRope}         | Mesh-related                                                          |
     *
     * ## Transforms
     *
     * The [transform]{@link PIXI.DisplayObject#transform} of a display object describes the projection from its
     * local coordinate space to its parent's local coordinate space. The following properties are derived
     * from the transform:
     *
     * <table>
     *   <thead>
     *     <tr>
     *       <th>Property</th>
     *       <th>Description</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>[pivot]{@link PIXI.DisplayObject#pivot}</td>
     *       <td>
     *         Invariant under rotation, scaling, and skewing. The projection of into the parent's space of the pivot
     *         is equal to position, regardless of the other three transformations. In other words, It is the center of
     *         rotation, scaling, and skewing.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>[position]{@link PIXI.DisplayObject#position}</td>
     *       <td>
     *         Translation. This is the position of the [pivot]{@link PIXI.DisplayObject#pivot} in the parent's local
     *         space. The default value of the pivot is the origin (0,0). If the top-left corner of your display object
     *         is (0,0) in its local space, then the position will be its top-left corner in the parent's local space.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>[scale]{@link PIXI.DisplayObject#scale}</td>
     *       <td>
     *         Scaling. This will stretch (or compress) the display object's projection. The scale factors are along the
     *         local coordinate axes. In other words, the display object is scaled before rotated or skewed. The center
     *         of scaling is the [pivot]{@link PIXI.DisplayObject#pivot}.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>[rotation]{@link PIXI.DisplayObject#rotation}</td>
     *       <td>
     *          Rotation. This will rotate the display object's projection by this angle (in radians).
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>[skew]{@link PIXI.DisplayObject#skew}</td>
     *       <td>
     *         <p>Skewing. This can be used to deform a rectangular display object into a parallelogram.</p>
     *         <p>
     *         In PixiJS, skew has a slightly different behaviour than the conventional meaning. It can be
     *         thought of the net rotation applied to the coordinate axes (separately). For example, if "skew.x" is
     *         ⍺ and "skew.y" is β, then the line x = 0 will be rotated by ⍺ (y = -x*cot⍺) and the line y = 0 will be
     *         rotated by β (y = x*tanβ). A line y = x*tanϴ (i.e. a line at angle ϴ to the x-axis in local-space) will
     *         be rotated by an angle between ⍺ and β.
     *         </p>
     *         <p>
     *         It can be observed that if skew is applied equally to both axes, then it will be equivalent to applying
     *         a rotation. Indeed, if "skew.x" = -ϴ and "skew.y" = ϴ, it will produce an equivalent of "rotation" = ϴ.
     *         </p>
     *         <p>
     *         Another quite interesting observation is that "skew.x", "skew.y", rotation are commutative operations. Indeed,
     *         because rotation is essentially a careful combination of the two.
     *         </p>
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>angle</td>
     *       <td>Rotation. This is an alias for [rotation]{@link PIXI.DisplayObject#rotation}, but in degrees.</td>
     *     </tr>
     *     <tr>
     *       <td>x</td>
     *       <td>Translation. This is an alias for position.x!</td>
     *     </tr>
     *     <tr>
     *       <td>y</td>
     *       <td>Translation. This is an alias for position.y!</td>
     *     </tr>
     *     <tr>
     *       <td>width</td>
     *       <td>
     *         Implemented in [Container]{@link PIXI.Container}. Scaling. The width property calculates scale.x by dividing
     *         the "requested" width by the local bounding box width. It is indirectly an abstraction over scale.x, and there
     *         is no concept of user-defined width.
     *       </td>
     *     </tr>
     *     <tr>
     *       <td>height</td>
     *       <td>
     *         Implemented in [Container]{@link PIXI.Container}. Scaling. The height property calculates scale.y by dividing
     *         the "requested" height by the local bounding box height. It is indirectly an abstraction over scale.y, and there
     *         is no concept of user-defined height.
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * ## Bounds
     *
     * The bounds of a display object is defined by the minimum axis-aligned rectangle in world space that can fit
     * around it. The abstract `calculateBounds` method is responsible for providing it (and it should use the
     * `worldTransform` to calculate in world space).
     *
     * There are a few additional types of bounding boxes:
     *
     * | Bounds                | Description                                                                              |
     * | --------------------- | ---------------------------------------------------------------------------------------- |
     * | World Bounds          | This is synonymous is the regular bounds described above. See `getBounds()`.             |
     * | Local Bounds          | This the axis-aligned bounding box in the parent's local space. See `getLocalBounds()`.  |
     * | Render Bounds         | The bounds, but including extra rendering effects like filter padding.                   |
     * | Projected Bounds      | The bounds of the projected display object onto the screen. Usually equals world bounds. |
     * | Relative Bounds       | The bounds of a display object when projected onto a ancestor's (or parent's) space.     |
     * | Natural Bounds        | The bounds of an object in its own local space (not parent's space, like in local bounds)|
     * | Content Bounds        | The natural bounds when excluding all children of a `Container`.                         |
     *
     * ### calculateBounds
     *
     * [Container]{@link PIXI.Container} already implements `calculateBounds` in a manner that includes children.
     *
     * But for a non-Container display object, the `calculateBounds` method must be overridden in order for `getBounds` and
     * `getLocalBounds` to work. This method must write the bounds into `this._bounds`.
     *
     * Generally, the following technique works for most simple cases: take the list of points
     * forming the "hull" of the object (i.e. outline of the object's shape), and then add them
     * using {@link PIXI.Bounds#addPointMatrix}.
     *
     * ```js
     * calculateBounds()
     * {
     *     const points = [...];
     *
     *     for (let i = 0, j = points.length; i < j; i++)
     *     {
     *         this._bounds.addPointMatrix(this.worldTransform, points[i]);
     *     }
     * }
     * ```
     *
     * You can optimize this for a large number of points by using {@link PIXI.Bounds#addVerticesMatrix} to pass them
     * in one array together.
     *
     * ## Alpha
     *
     * This alpha sets a display object's **relative opacity** w.r.t its parent. For example, if the alpha of a display
     * object is 0.5 and its parent's alpha is 0.5, then it will be rendered with 25% opacity (assuming alpha is not
     * applied on any ancestor further up the chain).
     *
     * The alpha with which the display object will be rendered is called the [worldAlpha]{@link PIXI.DisplayObject#worldAlpha}.
     *
     * ## Renderable vs Visible
     *
     * The `renderable` and `visible` properties can be used to prevent a display object from being rendered to the
     * screen. However, there is a subtle difference between the two. When using `renderable`, the transforms  of the display
     * object (and its children subtree) will continue to be calculated. When using `visible`, the transforms will not
     * be calculated.
     *
     * For culling purposes, it is recommended that applications use the [cullable]{@link PIXI.DisplayObject#cullable} property.
     *
     * Otherwise, to prevent an object from rendering in the general-purpose sense - `visible` is the property to use. This
     * one is also better in terms of performance.
     * @memberof PIXI
     */
    export abstract class DisplayObject extends utils.EventEmitter<DisplayObjectEvents> {
        abstract sortDirty: boolean;
        /** The display object container that contains this display object. */
        parent: Container;
        /**
         * The multiplied alpha of the displayObject.
         * @readonly
         */
        worldAlpha: number;
        /**
         * World transform and local transform of this object.
         * This will become read-only later, please do not assign anything there unless you know what are you doing.
         */
        transform: Transform;
        /** The opacity of the object. */
        alpha: number;
        /**
         * The visibility of the object. If false the object will not be drawn, and
         * the updateTransform function will not be called.
         *
         * Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually.
         */
        visible: boolean;
        /**
         * Can this object be rendered, if false the object will not be drawn but the updateTransform
         * methods will still be called.
         *
         * Only affects recursive calls from parent. You can ask for bounds manually.
         */
        renderable: boolean;
        /**
         * Should this object be rendered if the bounds of this object are out of frame?
         *
         * Culling has no effect on whether updateTransform is called.
         */
        cullable: boolean;
        /**
         * If set, this shape is used for culling instead of the bounds of this object.
         * It can improve the culling performance of objects with many children.
         * The culling area is defined in local space.
         */
        cullArea: Rectangle;
        /**
         * The area the filter is applied to. This is used as more of an optimization
         * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
         *
         * Also works as an interaction mask.
         */
        filterArea: Rectangle;
        /**
         * Sets the filters for the displayObject.
         * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
         * To remove filters simply set this property to `'null'`.
         */
        filters: Filter[] | null;
        /** Used to fast check if a sprite is.. a sprite! */
        isSprite: boolean;
        /** Does any other displayObject use this object as a mask? */
        isMask: boolean;
        /**
         * Which index in the children array the display component was before the previous zIndex sort.
         * Used by containers to help sort objects with the same zIndex, by using previous array index as the decider.
         * @protected
         */
        _lastSortedIndex: number;
        /**
         * The original, cached mask of the object.
         * @protected
         */
        _mask: Container | MaskData;
        /** The bounds object, this is used to calculate and store the bounds of the displayObject. */
        _bounds: Bounds;
        /** Local bounds object, swapped with `_bounds` when using `getLocalBounds()`. */
        _localBounds: Bounds;
        /**
         * The zIndex of the displayObject.
         * A higher value will mean it will be rendered on top of other displayObjects within the same container.
         * @protected
         */
        protected _zIndex: number;
        /**
         * Currently enabled filters.
         * @protected
         */
        protected _enabledFilters: Filter[];
        /** Flags the cached bounds as dirty. */
        protected _boundsID: number;
        /** Cache of this display-object's bounds-rectangle. */
        protected _boundsRect: Rectangle;
        /** Cache of this display-object's local-bounds rectangle. */
        protected _localBoundsRect: Rectangle;
        /** If the object has been destroyed via destroy(). If true, it should not be used. */
        protected _destroyed: boolean;
        /** The number of times this object is used as a mask by another object. */
        private _maskRefCount;
        private tempDisplayObjectParent;
        displayObjectUpdateTransform: () => void;
        /**
         * Mixes all enumerable properties and methods from a source object to DisplayObject.
         * @param source - The source of properties and methods to mix in.
         */
        static mixin(source: utils.Dict<any>): void;
        constructor();
        /**
         * Fired when this DisplayObject is added to a Container.
         * @instance
         * @event added
         * @param {PIXI.Container} container - The container added to.
         */
        /**
         * Fired when this DisplayObject is removed from a Container.
         * @instance
         * @event removed
         * @param {PIXI.Container} container - The container removed from.
         */
        /**
         * Fired when this DisplayObject is destroyed. This event is emitted once
         * destroy is finished.
         * @instance
         * @event destroyed
         */
        /** Readonly flag for destroyed display objects. */
        get destroyed(): boolean;
        /** Recalculates the bounds of the display object. */
        abstract calculateBounds(): void;
        abstract removeChild(child: DisplayObject): void;
        /**
         * Renders the object using the WebGL renderer.
         * @param renderer - The renderer.
         */
        abstract render(renderer: Renderer): void;
        /** Recursively updates transform of all objects from the root to this one internal function for toLocal() */
        protected _recursivePostUpdateTransform(): void;
        /** Updates the object transform for rendering. TODO - Optimization pass! */
        updateTransform(): void;
        /**
         * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link PIXI.Rectangle}.
         *
         * This method is expensive on containers with a large subtree (like the stage). This is because the bounds
         * of a container depend on its children's bounds, which recursively causes all bounds in the subtree to
         * be recalculated. The upside, however, is that calling `getBounds` once on a container will indeed update
         * the bounds of all children (the whole subtree, in fact). This side effect should be exploited by using
         * `displayObject._bounds.getRectangle()` when traversing through all the bounds in a scene graph. Otherwise,
         * calling `getBounds` on each object in a subtree will cause the total cost to increase quadratically as
         * its height increases.
         *
         * The transforms of all objects in a container's **subtree** and of all **ancestors** are updated.
         * The world bounds of all display objects in a container's **subtree** will also be recalculated.
         *
         * The `_bounds` object stores the last calculation of the bounds. You can use to entirely skip bounds
         * calculation if needed.
         *
         * ```js
         * const lastCalculatedBounds = displayObject._bounds.getRectangle(optionalRect);
         * ```
         *
         * Do know that usage of `getLocalBounds` can corrupt the `_bounds` of children (the whole subtree, actually). This
         * is a known issue that has not been solved. See [getLocalBounds]{@link PIXI.DisplayObject#getLocalBounds} for more
         * details.
         *
         * `getBounds` should be called with `skipUpdate` equal to `true` in a render() call. This is because the transforms
         * are guaranteed to be update-to-date. In fact, recalculating inside a render() call may cause corruption in certain
         * cases.
         * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
         *  being updated. This means the calculation returned MAY be out of date BUT will give you a
         *  nice performance boost.
         * @param rect - Optional rectangle to store the result of the bounds calculation.
         * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
         */
        getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
        /**
         * Retrieves the local bounds of the displayObject as a rectangle object.
         * @param rect - Optional rectangle to store the result of the bounds calculation.
         * @returns - The rectangular bounding area.
         */
        getLocalBounds(rect?: Rectangle): Rectangle;
        /**
         * Calculates the global position of the display object.
         * @param position - The world origin to calculate from.
         * @param point - A Point object in which to store the value, optional
         *  (otherwise will create a new Point).
         * @param skipUpdate - Should we skip the update transform.
         * @returns - A point object representing the position of this object.
         */
        toGlobal<P extends IPointData = Point>(position: IPointData, point?: P, skipUpdate?: boolean): P;
        /**
         * Calculates the local position of the display object relative to another point.
         * @param position - The world origin to calculate from.
         * @param from - The DisplayObject to calculate the global position from.
         * @param point - A Point object in which to store the value, optional
         *  (otherwise will create a new Point).
         * @param skipUpdate - Should we skip the update transform
         * @returns - A point object representing the position of this object
         */
        toLocal<P extends IPointData = Point>(position: IPointData, from?: DisplayObject, point?: P, skipUpdate?: boolean): P;
        /**
         * Set the parent Container of this DisplayObject.
         * @param container - The Container to add this DisplayObject to.
         * @returns - The Container that this DisplayObject was added to.
         */
        setParent(container: Container): Container;
        /** Remove the DisplayObject from its parent Container. If the DisplayObject has no parent, do nothing. */
        removeFromParent(): void;
        /**
         * Convenience function to set the position, scale, skew and pivot at once.
         * @param x - The X position
         * @param y - The Y position
         * @param scaleX - The X scale value
         * @param scaleY - The Y scale value
         * @param rotation - The rotation
         * @param skewX - The X skew value
         * @param skewY - The Y skew value
         * @param pivotX - The X pivot value
         * @param pivotY - The Y pivot value
         * @returns - The DisplayObject instance
         */
        setTransform(x?: number, y?: number, scaleX?: number, scaleY?: number, rotation?: number, skewX?: number, skewY?: number, pivotX?: number, pivotY?: number): this;
        /**
         * Base destroy method for generic display objects. This will automatically
         * remove the display object from its parent Container as well as remove
         * all current event listeners and internal references. Do not use a DisplayObject
         * after calling `destroy()`.
         * @param _options
         */
        destroy(_options?: IDestroyOptions | boolean): void;
        /**
         * @protected
         * @member {PIXI.Container}
         */
        get _tempDisplayObjectParent(): TemporaryDisplayObject;
        /**
         * Used in Renderer, cacheAsBitmap and other places where you call an `updateTransform` on root.
         *
         * ```js
         * const cacheParent = elem.enableTempParent();
         * elem.updateTransform();
         * elem.disableTempParent(cacheParent);
         * ```
         * @returns - Current parent
         */
        enableTempParent(): Container;
        /**
         * Pair method for `enableTempParent`
         * @param cacheParent - Actual parent of element
         */
        disableTempParent(cacheParent: Container): void;
        /**
         * The position of the displayObject on the x axis relative to the local coordinates of the parent.
         * An alias to position.x
         */
        get x(): number;
        set x(value: number);
        /**
         * The position of the displayObject on the y axis relative to the local coordinates of the parent.
         * An alias to position.y
         */
        get y(): number;
        set y(value: number);
        /**
         * Current transform of the object based on world (parent) factors.
         * @readonly
         */
        get worldTransform(): Matrix;
        /**
         * Current transform of the object based on local factors: position, scale, other stuff.
         * @readonly
         */
        get localTransform(): Matrix;
        /**
         * The coordinate of the object relative to the local coordinates of the parent.
         * @since 4.0.0
         */
        get position(): ObservablePoint;
        set position(value: IPointData);
        /**
         * The scale factors of this object along the local coordinate axes.
         *
         * The default scale is (1, 1).
         * @since 4.0.0
         */
        get scale(): ObservablePoint;
        set scale(value: IPointData);
        /**
         * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
         * is the projection of `pivot` in the parent's local space.
         *
         * By default, the pivot is the origin (0, 0).
         * @since 4.0.0
         */
        get pivot(): ObservablePoint;
        set pivot(value: IPointData);
        /**
         * The skew factor for the object in radians.
         * @since 4.0.0
         */
        get skew(): ObservablePoint;
        set skew(value: IPointData);
        /**
         * The rotation of the object in radians.
         * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
         */
        get rotation(): number;
        set rotation(value: number);
        /**
         * The angle of the object in degrees.
         * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
         */
        get angle(): number;
        set angle(value: number);
        /**
         * The zIndex of the displayObject.
         *
         * If a container has the sortableChildren property set to true, children will be automatically
         * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
         * and thus rendered on top of other display objects within the same container.
         * @see PIXI.Container#sortableChildren
         */
        get zIndex(): number;
        set zIndex(value: number);
        /**
         * Indicates if the object is globally visible.
         * @readonly
         */
        get worldVisible(): boolean;
        /**
         * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
         * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
         * {@link PIXI.Graphics} or a {@link PIXI.Sprite} object. This allows for much faster masking in canvas as it
         * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
         * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
         * To remove a mask, set this property to `null`.
         *
         * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
         * @example
         * import { Graphics, Sprite } from 'pixi.js';
         *
         * const graphics = new Graphics();
         * graphics.beginFill(0xFF3300);
         * graphics.drawRect(50, 250, 100, 100);
         * graphics.endFill();
         *
         * const sprite = new Sprite(texture);
         * sprite.mask = graphics;
         * @todo At the moment, CanvasRenderer doesn't support Sprite as mask.
         */
        get mask(): Container | MaskData | null;
        set mask(value: Container | MaskData | null);
    }
    /**
     * @private
     */
    export class TemporaryDisplayObject extends DisplayObject {
        calculateBounds: () => null;
        removeChild: (child: DisplayObject) => null;
        render: (renderer: Renderer) => null;
        sortDirty: boolean;
    }
}
declare module "packages/display/src/Container" {
    import { DisplayObject } from "packages/display/src/DisplayObject";
    import type { Rectangle, Renderer } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/DisplayObject";
    export interface Container extends GlobalMixins.Container, DisplayObject {
    }
    /**
     * Container is a general-purpose display object that holds children. It also adds built-in support for advanced
     * rendering features like masking and filtering.
     *
     * It is the base class of all display objects that act as a container for other objects, including Graphics
     * and Sprite.
     * @example
     * import { BlurFilter, Container, Graphics, Sprite } from 'pixi.js';
     *
     * const container = new Container();
     * const sprite = Sprite.from('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png');
     *
     * sprite.width = 512;
     * sprite.height = 512;
     *
     * // Adds a sprite as a child to this container. As a result, the sprite will be rendered whenever the container
     * // is rendered.
     * container.addChild(sprite);
     *
     * // Blurs whatever is rendered by the container
     * container.filters = [new BlurFilter()];
     *
     * // Only the contents within a circle at the center should be rendered onto the screen.
     * container.mask = new Graphics()
     *     .beginFill(0xffffff)
     *     .drawCircle(sprite.width / 2, sprite.height / 2, Math.min(sprite.width, sprite.height) / 2)
     *     .endFill();
     * @memberof PIXI
     */
    export class Container<T extends DisplayObject = DisplayObject> extends DisplayObject {
        /**
         * Sets the default value for the container property `sortableChildren`.
         * If set to true, the container will sort its children by zIndex value
         * when `updateTransform()` is called, or manually if `sortChildren()` is called.
         *
         * This actually changes the order of elements in the array, so should be treated
         * as a basic solution that is not performant compared to other solutions,
         * such as {@link https://github.com/pixijs/layers PixiJS Layers}.
         *
         * Also be aware of that this may not work nicely with the `addChildAt()` function,
         * as the `zIndex` sorting may cause the child to automatically sorted to another position.
         * @static
         */
        static defaultSortableChildren: boolean;
        /**
         * The array of children of this container.
         * @readonly
         */
        readonly children: T[];
        /**
         * If set to true, the container will sort its children by `zIndex` value
         * when `updateTransform()` is called, or manually if `sortChildren()` is called.
         *
         * This actually changes the order of elements in the array, so should be treated
         * as a basic solution that is not performant compared to other solutions,
         * such as {@link https://github.com/pixijs/layers PixiJS Layers}
         *
         * Also be aware of that this may not work nicely with the `addChildAt()` function,
         * as the `zIndex` sorting may cause the child to automatically sorted to another position.
         * @see PIXI.Container.defaultSortableChildren
         */
        sortableChildren: boolean;
        /**
         * Should children be sorted by zIndex at the next updateTransform call.
         *
         * Will get automatically set to true if a new child is added, or if a child's zIndex changes.
         */
        sortDirty: boolean;
        parent: Container;
        containerUpdateTransform: () => void;
        protected _width: number;
        protected _height: number;
        constructor();
        /**
         * Overridable method that can be used by Container subclasses whenever the children array is modified.
         * @param _length
         */
        protected onChildrenChange(_length?: number): void;
        /**
         * Adds one or more children to the container.
         *
         * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
         * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to add to the container
         * @returns {PIXI.DisplayObject} - The first child that was added.
         */
        addChild<U extends T[]>(...children: U): U[0];
        /**
         * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
         * @param {PIXI.DisplayObject} child - The child to add
         * @param {number} index - The index to place the child in
         * @returns {PIXI.DisplayObject} The child that was added.
         */
        addChildAt<U extends T>(child: U, index: number): U;
        /**
         * Swaps the position of 2 Display Objects within this container.
         * @param child - First display object to swap
         * @param child2 - Second display object to swap
         */
        swapChildren(child: T, child2: T): void;
        /**
         * Returns the index position of a child DisplayObject instance
         * @param child - The DisplayObject instance to identify
         * @returns - The index position of the child display object to identify
         */
        getChildIndex(child: T): number;
        /**
         * Changes the position of an existing child in the display object container
         * @param child - The child DisplayObject instance for which you want to change the index number
         * @param index - The resulting index number for the child display object
         */
        setChildIndex(child: T, index: number): void;
        /**
         * Returns the child at the specified index
         * @param index - The index to get the child at
         * @returns - The child at the given index, if any.
         */
        getChildAt(index: number): T;
        /**
         * Removes one or more children from the container.
         * @param {...PIXI.DisplayObject} children - The DisplayObject(s) to remove
         * @returns {PIXI.DisplayObject} The first child that was removed.
         */
        removeChild<U extends T[]>(...children: U): U[0];
        /**
         * Removes a child from the specified index position.
         * @param index - The index to get the child from
         * @returns The child that was removed.
         */
        removeChildAt(index: number): T;
        /**
         * Removes all children from this container that are within the begin and end indexes.
         * @param beginIndex - The beginning position.
         * @param endIndex - The ending position. Default value is size of the container.
         * @returns - List of removed children
         */
        removeChildren(beginIndex?: number, endIndex?: number): T[];
        /** Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex. */
        sortChildren(): void;
        /** Updates the transform on all children of this container for rendering. */
        updateTransform(): void;
        /**
         * Recalculates the bounds of the container.
         *
         * This implementation will automatically fit the children's bounds into the calculation. Each child's bounds
         * is limited to its mask's bounds or filterArea, if any is applied.
         */
        calculateBounds(): void;
        /**
         * Retrieves the local bounds of the displayObject as a rectangle object.
         *
         * Calling `getLocalBounds` may invalidate the `_bounds` of the whole subtree below. If using it inside a render()
         * call, it is advised to call `getBounds()` immediately after to recalculate the world bounds of the subtree.
         * @param rect - Optional rectangle to store the result of the bounds calculation.
         * @param skipChildrenUpdate - Setting to `true` will stop re-calculation of children transforms,
         *  it was default behaviour of pixi 4.0-5.2 and caused many problems to users.
         * @returns - The rectangular bounding area.
         */
        getLocalBounds(rect?: Rectangle, skipChildrenUpdate?: boolean): Rectangle;
        /**
         * Recalculates the content bounds of this object. This should be overriden to
         * calculate the bounds of this specific object (not including children).
         * @protected
         */
        protected _calculateBounds(): void;
        /**
         * Renders this object and its children with culling.
         * @protected
         * @param {PIXI.Renderer} renderer - The renderer
         */
        protected _renderWithCulling(renderer: Renderer): void;
        /**
         * Renders the object using the WebGL renderer.
         *
         * The [_render]{@link PIXI.Container#_render} method is be overriden for rendering the contents of the
         * container itself. This `render` method will invoke it, and also invoke the `render` methods of all
         * children afterward.
         *
         * If `renderable` or `visible` is false or if `worldAlpha` is not positive or if `cullable` is true and
         * the bounds of this object are out of frame, this implementation will entirely skip rendering.
         * See {@link PIXI.DisplayObject} for choosing between `renderable` or `visible`. Generally,
         * setting alpha to zero is not recommended for purely skipping rendering.
         *
         * When your scene becomes large (especially when it is larger than can be viewed in a single screen), it is
         * advised to employ **culling** to automatically skip rendering objects outside of the current screen.
         * See [cullable]{@link PIXI.DisplayObject#cullable} and [cullArea]{@link PIXI.DisplayObject#cullArea}.
         * Other culling methods might be better suited for a large number static objects; see
         * [@pixi-essentials/cull]{@link https://www.npmjs.com/package/@pixi-essentials/cull} and
         * [pixi-cull]{@link https://www.npmjs.com/package/pixi-cull}.
         *
         * The [renderAdvanced]{@link PIXI.Container#renderAdvanced} method is internally used when when masking or
         * filtering is applied on a container. This does, however, break batching and can affect performance when
         * masking and filtering is applied extensively throughout the scene graph.
         * @param renderer - The renderer
         */
        render(renderer: Renderer): void;
        /**
         * Render the object using the WebGL renderer and advanced features.
         * @param renderer - The renderer
         */
        protected renderAdvanced(renderer: Renderer): void;
        /**
         * To be overridden by the subclasses.
         * @param _renderer - The renderer
         */
        protected _render(_renderer: Renderer): void;
        /**
         * Removes all internal references and listeners as well as removes children from the display list.
         * Do not use a Container after calling `destroy`.
         * @param options - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
         *  method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
         *  Should it destroy the texture of the child sprite
         * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
         *  Should it destroy the base texture of the child sprite
         */
        destroy(options?: IDestroyOptions | boolean): void;
        /** The width of the Container, setting this will actually modify the scale to achieve the value set. */
        get width(): number;
        set width(value: number);
        /** The height of the Container, setting this will actually modify the scale to achieve the value set. */
        get height(): number;
        set height(value: number);
    }
}
declare module "packages/display/src/settings" {
    import { settings } from "packages/core/src/index";
    export { settings };
}
declare module "packages/display/src/index" {
    import "packages/display/src/settings";
    export * from "packages/display/src/Bounds";
    export * from "packages/display/src/Container";
    export * from "packages/display/src/DisplayObject";
}
declare module "packages/sprite/src/Sprite" {
    import { BLEND_MODES, ObservablePoint, Rectangle, Texture } from "packages/core/src/index";
    import { Container } from "packages/display/src/index";
    import type { ColorSource, IBaseTextureOptions, IPointData, Renderer, TextureSource } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    export type SpriteSource = TextureSource | Texture;
    export interface Sprite extends GlobalMixins.Sprite, Container {
    }
    /**
     * The Sprite object is the base for all textured objects that are rendered to the screen
     *
     * A sprite can be created directly from an image like this:
     *
     * ```js
     * import { Sprite } from 'pixi.js';
     *
     * const sprite = Sprite.from('assets/image.png');
     * ```
     *
     * The more efficient way to create sprites is using a {@link PIXI.Spritesheet},
     * as swapping base textures when rendering to the screen is inefficient.
     *
     * ```js
     * import { Assets, Sprite } from 'pixi.js';
     *
     * const sheet = await Assets.load('assets/spritesheet.json');
     * const sprite = new Sprite(sheet.textures['image.png']);
     * ```
     * @memberof PIXI
     */
    export class Sprite extends Container {
        /**
         * The blend mode to be applied to the sprite. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
         * @default PIXI.BLEND_MODES.NORMAL
         */
        blendMode: BLEND_MODES;
        indices: Uint16Array;
        /**
         * Plugin that is responsible for rendering this element.
         * Allows to customize the rendering process without overriding '_render' & '_renderCanvas' methods.
         * @default 'batch'
         */
        pluginName: string;
        /**
         * The width of the sprite (this is initially set by the texture).
         * @protected
         */
        _width: number;
        /**
         * The height of the sprite (this is initially set by the texture)
         * @protected
         */
        _height: number;
        /**
         * The texture that the sprite is using.
         * @private
         */
        _texture: Texture;
        _textureID: number;
        /**
         * Cached tint value so we can tell when the tint is changed.
         * Value is used for 2d CanvasRenderer.
         * @protected
         * @default 0xFFFFFF
         */
        _cachedTint: number;
        protected _textureTrimmedID: number;
        /**
         * This is used to store the uvs data of the sprite, assigned at the same time
         * as the vertexData in calculateVertices().
         * @member {Float32Array}
         */
        protected uvs: Float32Array;
        /**
         * The anchor point defines the normalized coordinates
         * in the texture that map to the position of this
         * sprite.
         *
         * By default, this is `(0,0)` (or `texture.defaultAnchor`
         * if you have modified that), which means the position
         * `(x,y)` of this `Sprite` will be the top-left corner.
         *
         * Note: Updating `texture.defaultAnchor` after
         * constructing a `Sprite` does _not_ update its anchor.
         *
         * {@link https://docs.cocos2d-x.org/cocos2d-x/en/sprites/manipulation.html}
         * @default `this.texture.defaultAnchor`
         */
        protected _anchor: ObservablePoint;
        /**
         * This is used to store the vertex data of the sprite (basically a quad).
         * @member {Float32Array}
         */
        protected vertexData: Float32Array;
        /**
         * This is used to calculate the bounds of the object IF it is a trimmed sprite.
         * @member {Float32Array}
         */
        private vertexTrimmedData;
        /**
         * Internal roundPixels field
         * @private
         */
        private _roundPixels;
        private _transformID;
        private _transformTrimmedID;
        /**
         * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
         * @default 0xFFFFFF
         */
        private _tintColor;
        /**
         * The tint applied to the sprite. This is a RGB value. A value of 0xFFFFFF will remove any tint effect.
         * @private
         * @default 16777215
         */
        _tintRGB: number;
        /** @param texture - The texture for this sprite. */
        constructor(texture?: Texture);
        /** When the texture is updated, this event will fire to update the scale and frame. */
        protected _onTextureUpdate(): void;
        /** Called when the anchor position updates. */
        private _onAnchorUpdate;
        /** Calculates worldTransform * vertices, store it in vertexData. */
        calculateVertices(): void;
        /**
         * Calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData.
         *
         * This is used to ensure that the true width and height of a trimmed texture is respected.
         */
        calculateTrimmedVertices(): void;
        /**
         *
         * Renders the object using the WebGL renderer
         * @param renderer - The webgl renderer to use.
         */
        protected _render(renderer: Renderer): void;
        /** Updates the bounds of the sprite. */
        protected _calculateBounds(): void;
        /**
         * Gets the local bounds of the sprite object.
         * @param rect - Optional output rectangle.
         * @returns The bounds.
         */
        getLocalBounds(rect?: Rectangle): Rectangle;
        /**
         * Tests if a point is inside this sprite
         * @param point - the point to test
         * @returns The result of the test
         */
        containsPoint(point: IPointData): boolean;
        /**
         * Destroys this sprite and optionally its texture and children.
         * @param options - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param [options.children=false] - if set to true, all the children will have their destroy
         *      method called as well. 'options' will be passed on to those calls.
         * @param [options.texture=false] - Should it destroy the current texture of the sprite as well
         * @param [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
         */
        destroy(options?: IDestroyOptions | boolean): void;
        /**
         * Helper function that creates a new sprite based on the source you provide.
         * The source can be - frame id, image url, video url, canvas element, video element, base texture
         * @param {string|PIXI.Texture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source
         *     - Source to create texture from
         * @param {object} [options] - See {@link PIXI.BaseTexture}'s constructor for options.
         * @returns The newly created sprite
         */
        static from(source: SpriteSource, options?: IBaseTextureOptions): Sprite;
        /**
         * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
         *
         * Advantages can include sharper image quality (like text) and faster rendering on canvas.
         * The main disadvantage is movement of objects may appear less smooth.
         *
         * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
         * @default false
         */
        set roundPixels(value: boolean);
        get roundPixels(): boolean;
        /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
        get width(): number;
        set width(value: number);
        /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
        get height(): number;
        set height(value: number);
        /**
         * The anchor sets the origin point of the sprite. The default value is taken from the {@link PIXI.Texture|Texture}
         * and passed to the constructor.
         *
         * The default is `(0,0)`, this means the sprite's origin is the top left.
         *
         * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
         *
         * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
         *
         * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
         * @example
         * import { Sprite } from 'pixi.js';
         *
         * const sprite = new Sprite(Texture.WHITE);
         * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
         */
        get anchor(): ObservablePoint;
        set anchor(value: ObservablePoint);
        /**
         * The tint applied to the sprite. This is a hex value.
         *
         * A value of 0xFFFFFF will remove any tint effect.
         * @default 0xFFFFFF
         */
        get tint(): ColorSource;
        set tint(value: ColorSource);
        /**
         * Get the tint as a RGB integer.
         * @ignore
         */
        get tintValue(): number;
        /** The texture that the sprite is using. */
        get texture(): Texture;
        set texture(value: Texture);
    }
}
declare module "packages/sprite/src/index" {
    export * from "packages/sprite/src/Sprite";
}
declare module "packages/mixin-cache-as-bitmap/src/index" {
    import { Rectangle } from "packages/core/src/index";
    import { Sprite } from "packages/sprite/src/index";
    import type { IPointData, IRenderer, MaskData, Renderer } from "packages/core/src/index";
    import type { Container, IDestroyOptions } from "packages/display/src/index";
    /**
     * @class
     * @ignore
     * @private
     */
    export class CacheData {
        textureCacheId: string;
        originalRender: (renderer: Renderer) => void;
        originalRenderCanvas: (renderer: IRenderer) => void;
        originalCalculateBounds: () => void;
        originalGetLocalBounds: (rect?: Rectangle) => Rectangle;
        originalUpdateTransform: () => void;
        originalDestroy: (options?: IDestroyOptions | boolean) => void;
        originalMask: Container | MaskData;
        originalFilterArea: Rectangle;
        originalContainsPoint: (point: IPointData) => boolean;
        sprite: Sprite;
        constructor();
    }
}
declare module "packages/mixin-get-child-by-name/src/index" { }
declare module "packages/mixin-get-global-position/src/index" { }
declare module "packages/events/src/FederatedWheelEvent" {
    import { FederatedMouseEvent } from "packages/events/src/FederatedMouseEvent";
    /**
     * A {@link PIXI.FederatedEvent} for wheel events.
     * @memberof PIXI
     */
    export class FederatedWheelEvent extends FederatedMouseEvent implements WheelEvent {
        /**
         * The units of `deltaX`, `deltaY`, and `deltaZ`. This is one of `DOM_DELTA_LINE`,
         * `DOM_DELTA_PAGE`, `DOM_DELTA_PIXEL`.
         */
        deltaMode: number;
        /** Horizontal scroll amount */
        deltaX: number;
        /** Vertical scroll amount */
        deltaY: number;
        /** z-axis scroll amount. */
        deltaZ: number;
        /** Units specified in pixels. */
        static readonly DOM_DELTA_PIXEL = 0;
        /** Units specified in pixels. */
        readonly DOM_DELTA_PIXEL = 0;
        /** Units specified in lines. */
        static readonly DOM_DELTA_LINE = 1;
        /** Units specified in lines. */
        readonly DOM_DELTA_LINE = 1;
        /** Units specified in pages. */
        static readonly DOM_DELTA_PAGE = 2;
        /** Units specified in pages. */
        readonly DOM_DELTA_PAGE = 2;
    }
}
declare module "packages/events/src/FederatedEventMap" {
    import type { FederatedPointerEvent } from "packages/events/src/FederatedPointerEvent";
    import type { FederatedWheelEvent } from "packages/events/src/FederatedWheelEvent";
    export type FederatedEventMap = {
        click: FederatedPointerEvent;
        mousedown: FederatedPointerEvent;
        mouseenter: FederatedPointerEvent;
        mouseleave: FederatedPointerEvent;
        mousemove: FederatedPointerEvent;
        mouseout: FederatedPointerEvent;
        mouseover: FederatedPointerEvent;
        mouseup: FederatedPointerEvent;
        mouseupoutside: FederatedPointerEvent;
        pointercancel: FederatedPointerEvent;
        pointerdown: FederatedPointerEvent;
        pointerenter: FederatedPointerEvent;
        pointerleave: FederatedPointerEvent;
        pointermove: FederatedPointerEvent;
        pointerout: FederatedPointerEvent;
        pointerover: FederatedPointerEvent;
        pointertap: FederatedPointerEvent;
        pointerup: FederatedPointerEvent;
        pointerupoutside: FederatedPointerEvent;
        rightclick: FederatedPointerEvent;
        rightdown: FederatedPointerEvent;
        rightup: FederatedPointerEvent;
        rightupoutside: FederatedPointerEvent;
        tap: FederatedPointerEvent;
        touchcancel: FederatedPointerEvent;
        touchend: FederatedPointerEvent;
        touchendoutside: FederatedPointerEvent;
        touchmove: FederatedPointerEvent;
        touchstart: FederatedPointerEvent;
        wheel: FederatedWheelEvent;
    };
    export type GlobalFederatedEventMap = {
        globalmousemove: FederatedPointerEvent;
        globalpointermove: FederatedPointerEvent;
        globaltouchmove: FederatedPointerEvent;
    };
    export type AllFederatedEventMap = FederatedEventMap & GlobalFederatedEventMap;
    export type FederatedEventEmitterTypes = {
        [K in keyof FederatedEventMap as K | `${K}capture`]: [event: FederatedEventMap[K]];
    } & {
        [K in keyof GlobalFederatedEventMap]: [event: GlobalFederatedEventMap[K]];
    } & {
        [K: ({} & string) | ({} & symbol)]: any;
    };
}
declare module "packages/events/src/FederatedEventTarget" {
    import { utils } from "packages/core/src/index";
    import type { AllFederatedEventMap } from "packages/events/src/FederatedEventMap";
    import type { FederatedPointerEvent } from "packages/events/src/FederatedPointerEvent";
    import type { FederatedWheelEvent } from "packages/events/src/FederatedWheelEvent";
    export type Cursor = 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ns-resize' | 'ew-resize' | 'nesw-resize' | 'col-resize' | 'nwse-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';
    export interface IHitArea {
        contains(x: number, y: number): boolean;
    }
    /**
     * Function type for handlers, e.g., onclick
     * @memberof PIXI
     */
    export type FederatedEventHandler<T = FederatedPointerEvent> = (event: T) => void;
    /**
     * The type of interaction a DisplayObject can be. For more information on values and their meaning,
     * see {@link PIXI.DisplayObject.eventMode DisplayObject's eventMode property}.
     * @memberof PIXI
     * @since 7.2.0
     */
    export type EventMode = 'none' | 'passive' | 'auto' | 'static' | 'dynamic';
    /**
     * Describes the shape for a {@link PIXI.FederatedEvent}'s' `eventTarget`.
     * @memberof PIXI
     */
    export interface FederatedEventTarget extends utils.EventEmitter, EventTarget {
        /** The cursor preferred when the mouse pointer is hovering over. */
        cursor: Cursor | string;
        /** The parent of this event target. */
        readonly parent?: FederatedEventTarget;
        /** The children of this event target. */
        readonly children?: ReadonlyArray<FederatedEventTarget>;
        /** Whether this event target should fire UI events. */
        interactive: boolean;
        _internalInteractive: boolean;
        /** The mode of interaction for this object */
        eventMode: EventMode;
        _internalEventMode: EventMode;
        /** Returns true if the DisplayObject has interactive 'static' or 'dynamic' */
        isInteractive: () => boolean;
        /** Whether this event target has any children that need UI events. This can be used optimize event propagation. */
        interactiveChildren: boolean;
        /** The hit-area specifies the area for which pointer events should be captured by this event target. */
        hitArea: IHitArea | null;
        /** Remove all listeners, or those of the specified event. */
        removeAllListeners(event?: string | symbol): this;
        /** Handler for 'click' event */
        onclick: FederatedEventHandler | null;
        /** Handler for 'mousedown' event */
        onmousedown: FederatedEventHandler | null;
        /** Handler for 'mouseenter' event */
        onmouseenter: FederatedEventHandler | null;
        /** Handler for 'mouseleave' event */
        onmouseleave: FederatedEventHandler | null;
        /** Handler for 'mousemove' event */
        onmousemove: FederatedEventHandler | null;
        /** Handler for 'globalmousemove' event */
        onglobalmousemove: FederatedEventHandler | null;
        /** Handler for 'mouseout' event */
        onmouseout: FederatedEventHandler | null;
        /** Handler for 'mouseover' event */
        onmouseover: FederatedEventHandler | null;
        /** Handler for 'mouseup' event */
        onmouseup: FederatedEventHandler | null;
        /** Handler for 'mouseupoutside' event */
        onmouseupoutside: FederatedEventHandler | null;
        /** Handler for 'pointercancel' event */
        onpointercancel: FederatedEventHandler | null;
        /** Handler for 'pointerdown' event */
        onpointerdown: FederatedEventHandler | null;
        /** Handler for 'pointerenter' event */
        onpointerenter: FederatedEventHandler | null;
        /** Handler for 'pointerleave' event */
        onpointerleave: FederatedEventHandler | null;
        /** Handler for 'pointermove' event */
        onpointermove: FederatedEventHandler | null;
        /** Handler for 'globalpointermove' event */
        onglobalpointermove: FederatedEventHandler | null;
        /** Handler for 'pointerout' event */
        onpointerout: FederatedEventHandler | null;
        /** Handler for 'pointerover' event */
        onpointerover: FederatedEventHandler | null;
        /** Handler for 'pointertap' event */
        onpointertap: FederatedEventHandler | null;
        /** Handler for 'pointerup' event */
        onpointerup: FederatedEventHandler | null;
        /** Handler for 'pointerupoutside' event */
        onpointerupoutside: FederatedEventHandler | null;
        /** Handler for 'rightclick' event */
        onrightclick: FederatedEventHandler | null;
        /** Handler for 'rightdown' event */
        onrightdown: FederatedEventHandler | null;
        /** Handler for 'rightup' event */
        onrightup: FederatedEventHandler | null;
        /** Handler for 'rightupoutside' event */
        onrightupoutside: FederatedEventHandler | null;
        /** Handler for 'tap' event */
        ontap: FederatedEventHandler | null;
        /** Handler for 'touchcancel' event */
        ontouchcancel: FederatedEventHandler | null;
        /** Handler for 'touchend' event */
        ontouchend: FederatedEventHandler | null;
        /** Handler for 'touchendoutside' event */
        ontouchendoutside: FederatedEventHandler | null;
        /** Handler for 'touchmove' event */
        ontouchmove: FederatedEventHandler | null;
        /** Handler for 'globaltouchmove' event */
        onglobaltouchmove: FederatedEventHandler | null;
        /** Handler for 'touchstart' event */
        ontouchstart: FederatedEventHandler | null;
        /** Handler for 'wheel' event */
        onwheel: FederatedEventHandler<FederatedWheelEvent> | null;
    }
    type AddListenerOptions = boolean | AddEventListenerOptions;
    type RemoveListenerOptions = boolean | EventListenerOptions;
    export interface IFederatedDisplayObject extends Omit<FederatedEventTarget, 'parent' | 'children' | keyof utils.EventEmitter | 'cursor'> {
        addEventListener<K extends keyof AllFederatedEventMap>(type: K, listener: (e: AllFederatedEventMap[K]) => any, options?: AddListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddListenerOptions): void;
        removeEventListener<K extends keyof AllFederatedEventMap>(type: K, listener: (e: AllFederatedEventMap[K]) => any, options?: RemoveListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: RemoveListenerOptions): void;
    }
    export const FederatedDisplayObject: IFederatedDisplayObject;
}
declare module "packages/events/src/FederatedEvent" {
    import { Point } from "packages/core/src/index";
    import type { EventBoundary } from "packages/events/src/EventBoundary";
    import type { FederatedEventTarget } from "packages/events/src/FederatedEventTarget";
    /**
     * An DOM-compatible synthetic event implementation that is "forwarded" on behalf of an original
     * FederatedEvent or native {@link https://dom.spec.whatwg.org/#event Event}.
     * @memberof PIXI
     * @typeParam N - The type of native event held.
     */
    export class FederatedEvent<N extends UIEvent = UIEvent> implements UIEvent {
        /** Flags whether this event bubbles. This will take effect only if it is set before propagation. */
        bubbles: boolean;
        /** @deprecated since 7.0.0 */
        cancelBubble: boolean;
        /**
         * Flags whether this event can be canceled using {@link PIXI.FederatedEvent.preventDefault}. This is always
         * false (for now).
         */
        readonly cancelable = false;
        /**
         * Flag added for compatibility with DOM {@code Event}. It is not used in the Federated Events
         * API.
         * @see https://dom.spec.whatwg.org/#dom-event-composed
         */
        readonly composed = false;
        /** The listeners of the event target that are being notified. */
        currentTarget: FederatedEventTarget;
        /** Flags whether the default response of the user agent was prevent through this event. */
        defaultPrevented: boolean;
        /**
         * The propagation phase.
         * @default {@link PIXI.FederatedEvent.NONE}
         */
        eventPhase: number;
        /** Flags whether this is a user-trusted event */
        isTrusted: boolean;
        /** @deprecated since 7.0.0 */
        returnValue: boolean;
        /** @deprecated since 7.0.0 */
        srcElement: EventTarget;
        /** The event target that this will be dispatched to. */
        target: FederatedEventTarget;
        /** The timestamp of when the event was created. */
        timeStamp: number;
        /** The type of event, e.g. {@code "mouseup"}. */
        type: string;
        /** The native event that caused the foremost original event. */
        nativeEvent: N;
        /** The original event that caused this event, if any. */
        originalEvent: FederatedEvent<N>;
        /** Flags whether propagation was stopped. */
        propagationStopped: boolean;
        /** Flags whether propagation was immediately stopped. */
        propagationImmediatelyStopped: boolean;
        /** The composed path of the event's propagation. The {@code target} is at the end. */
        path: FederatedEventTarget[];
        /** The {@link PIXI.EventBoundary} that manages this event. Null for root events. */
        readonly manager: EventBoundary;
        /** Event-specific detail */
        detail: number;
        /** The global Window object. */
        view: WindowProxy;
        /**
         * Not supported.
         * @deprecated since 7.0.0
         */
        which: number;
        /** The coordinates of the evnet relative to the nearest DOM layer. This is a non-standard property. */
        layer: Point;
        /** @readonly */
        get layerX(): number;
        /** @readonly */
        get layerY(): number;
        /** The coordinates of the event relative to the DOM document. This is a non-standard property. */
        page: Point;
        /** @readonly */
        get pageX(): number;
        /** @readonly */
        get pageY(): number;
        /**
         * @param manager - The event boundary which manages this event. Propagation can only occur
         *  within the boundary's jurisdiction.
         */
        constructor(manager: EventBoundary);
        /**
         * Fallback for the deprecated @code{PIXI.InteractionEvent.data}.
         * @deprecated since 7.0.0
         */
        get data(): this;
        /** The propagation path for this event. Alias for {@link PIXI.EventBoundary.propagationPath}. */
        composedPath(): FederatedEventTarget[];
        /**
         * Unimplemented method included for implementing the DOM interface {@code Event}. It will throw an {@code Error}.
         * @deprecated
         * @param _type
         * @param _bubbles
         * @param _cancelable
         */
        initEvent(_type: string, _bubbles?: boolean, _cancelable?: boolean): void;
        /**
         * Unimplemented method included for implementing the DOM interface {@code UIEvent}. It will throw an {@code Error}.
         * @deprecated
         * @param _typeArg
         * @param _bubblesArg
         * @param _cancelableArg
         * @param _viewArg
         * @param _detailArg
         */
        initUIEvent(_typeArg: string, _bubblesArg?: boolean, _cancelableArg?: boolean, _viewArg?: Window | null, _detailArg?: number): void;
        /** Prevent default behavior of PixiJS and the user agent. */
        preventDefault(): void;
        /**
         * Stop this event from propagating to any addition listeners, including on the
         * {@link PIXI.FederatedEventTarget.currentTarget currentTarget} and also the following
         * event targets on the propagation path.
         */
        stopImmediatePropagation(): void;
        /**
         * Stop this event from propagating to the next {@link PIXI.FederatedEventTarget}. The rest of the listeners
         * on the {@link PIXI.FederatedEventTarget.currentTarget currentTarget} will still be notified.
         */
        stopPropagation(): void;
        readonly NONE = 0;
        readonly CAPTURING_PHASE = 1;
        readonly AT_TARGET = 2;
        readonly BUBBLING_PHASE = 3;
    }
}
declare module "packages/events/src/FederatedMouseEvent" {
    import { Point } from "packages/core/src/index";
    import { FederatedEvent } from "packages/events/src/FederatedEvent";
    import type { IPointData } from "packages/core/src/index";
    import type { DisplayObject } from "packages/display/src/index";
    /**
     * A {@link PIXI.FederatedEvent} for mouse events.
     * @memberof PIXI
     */
    export class FederatedMouseEvent extends FederatedEvent<MouseEvent | PointerEvent | TouchEvent> implements MouseEvent {
        /** Whether the "alt" key was pressed when this mouse event occurred. */
        altKey: boolean;
        /** The specific button that was pressed in this mouse event. */
        button: number;
        /** The button depressed when this event occurred. */
        buttons: number;
        /** Whether the "control" key was pressed when this mouse event occurred. */
        ctrlKey: boolean;
        /** Whether the "meta" key was pressed when this mouse event occurred. */
        metaKey: boolean;
        /** This is currently not implemented in the Federated Events API. */
        relatedTarget: EventTarget;
        /** Whether the "shift" key was pressed when this mouse event occurred. */
        shiftKey: boolean;
        /** The coordinates of the mouse event relative to the canvas. */
        client: Point;
        /** @readonly */
        get clientX(): number;
        /** @readonly */
        get clientY(): number;
        /**
         * Alias for {@link PIXI.FederatedMouseEvent.clientX this.clientX}.
         * @readonly
         */
        get x(): number;
        /**
         * Alias for {@link PIXI.FederatedMouseEvent.clientY this.clientY}.
         * @readonly
         */
        get y(): number;
        /** This is the number of clicks that occurs in 200ms/click of each other. */
        detail: number;
        /** The movement in this pointer relative to the last `mousemove` event. */
        movement: Point;
        /** @readonly */
        get movementX(): number;
        /** @readonly */
        get movementY(): number;
        /**
         * The offset of the pointer coordinates w.r.t. target DisplayObject in world space. This is
         * not supported at the moment.
         */
        offset: Point;
        /** @readonly */
        get offsetX(): number;
        /** @readonly */
        get offsetY(): number;
        /** The pointer coordinates in world space. */
        global: Point;
        /** @readonly */
        get globalX(): number;
        /** @readonly */
        get globalY(): number;
        /**
         * The pointer coordinates in the renderer's {@link PIXI.Renderer.screen screen}. This has slightly
         * different semantics than native PointerEvent screenX/screenY.
         */
        screen: Point;
        /**
         * The pointer coordinates in the renderer's screen. Alias for {@code screen.x}.
         * @readonly
         */
        get screenX(): number;
        /**
         * The pointer coordinates in the renderer's screen. Alias for {@code screen.y}.
         * @readonly
         */
        get screenY(): number;
        /**
         * This will return the local coordinates of the specified displayObject for this InteractionData
         * @param {PIXI.DisplayObject} displayObject - The DisplayObject that you would like the local
         *  coords off
         * @param {PIXI.IPointData} point - A Point object in which to store the value, optional (otherwise
         *  will create a new point)
         * @param {PIXI.IPointData} globalPos - A Point object containing your custom global coords, optional
         *  (otherwise will use the current global coords)
         * @returns - A point containing the coordinates of the InteractionData position relative
         *  to the DisplayObject
         */
        getLocalPosition<P extends IPointData = Point>(displayObject: DisplayObject, point?: P, globalPos?: IPointData): P;
        /**
         * Whether the modifier key was pressed when this event natively occurred.
         * @param key - The modifier key.
         */
        getModifierState(key: string): boolean;
        /**
         * Not supported.
         * @param _typeArg
         * @param _canBubbleArg
         * @param _cancelableArg
         * @param _viewArg
         * @param _detailArg
         * @param _screenXArg
         * @param _screenYArg
         * @param _clientXArg
         * @param _clientYArg
         * @param _ctrlKeyArg
         * @param _altKeyArg
         * @param _shiftKeyArg
         * @param _metaKeyArg
         * @param _buttonArg
         * @param _relatedTargetArg
         * @deprecated since 7.0.0
         */
        initMouseEvent(_typeArg: string, _canBubbleArg: boolean, _cancelableArg: boolean, _viewArg: Window, _detailArg: number, _screenXArg: number, _screenYArg: number, _clientXArg: number, _clientYArg: number, _ctrlKeyArg: boolean, _altKeyArg: boolean, _shiftKeyArg: boolean, _metaKeyArg: boolean, _buttonArg: number, _relatedTargetArg: EventTarget): void;
    }
}
declare module "packages/events/src/FederatedPointerEvent" {
    import { FederatedMouseEvent } from "packages/events/src/FederatedMouseEvent";
    /**
     * A {@link PIXI.FederatedEvent} for pointer events.
     * @memberof PIXI
     */
    export class FederatedPointerEvent extends FederatedMouseEvent implements PointerEvent {
        /**
         * The unique identifier of the pointer.
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId}
         */
        pointerId: number;
        /**
         * The width of the pointer's contact along the x-axis, measured in CSS pixels.
         * radiusX of TouchEvents will be represented by this value.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width
         */
        width: number;
        /**
         * The height of the pointer's contact along the y-axis, measured in CSS pixels.
         * radiusY of TouchEvents will be represented by this value.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height
         */
        height: number;
        /**
         * Indicates whether or not the pointer device that created the event is the primary pointer.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary
         */
        isPrimary: boolean;
        /**
         * The type of pointer that triggered the event.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
         */
        pointerType: string;
        /**
         * Pressure applied by the pointing device during the event.
         *s
         * A Touch's force property will be represented by this value.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
         */
        pressure: number;
        /**
         * Barrel pressure on a stylus pointer.
         * @see https://w3c.github.io/pointerevents/#pointerevent-interface
         */
        tangentialPressure: number;
        /**
         * The angle, in degrees, between the pointer device and the screen.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX
         */
        tiltX: number;
        /**
         * The angle, in degrees, between the pointer device and the screen.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY
         */
        tiltY: number;
        /**
         * Twist of a stylus pointer.
         * @see https://w3c.github.io/pointerevents/#pointerevent-interface
         */
        twist: number;
        /** This is the number of clicks that occurs in 200ms/click of each other. */
        detail: number;
        getCoalescedEvents(): PointerEvent[];
        getPredictedEvents(): PointerEvent[];
    }
}
declare module "packages/events/src/EventSystem" {
    import { EventBoundary } from "packages/events/src/EventBoundary";
    import { FederatedPointerEvent } from "packages/events/src/FederatedPointerEvent";
    import { FederatedWheelEvent } from "packages/events/src/FederatedWheelEvent";
    import type { ExtensionMetadata, IPointData, IRenderer, ISystem } from "packages/core/src/index";
    import type { EventMode } from "packages/events/src/FederatedEventTarget";
    /** @ignore */
    export interface EventSystemOptions {
        /**
         * The default event mode mode for all display objects.
         * This option only is available when using **@pixi/events** package
         * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
         * @memberof PIXI.IRendererOptions
         */
        eventMode?: EventMode;
        /**
         * The event features that are enabled by the EventSystem
         * This option only is available when using **@pixi/events** package
         * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
         * @memberof PIXI.IRendererOptions
         * @example
         * const app = new PIXI.Application({
         *   view: canvas,
         *   events: {
         *     move: true,
         *     globalMove: false,
         *     click: true,
         *     wheel: true,
         *   },
         * });
         */
        eventFeatures?: Partial<EventSystemFeatures>;
    }
    /**
     * The event features that are enabled by the EventSystem
     * This option only is available when using **@pixi/events** package
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @memberof PIXI
     * @since 7.2.0
     */
    interface EventSystemFeatures {
        /**
         * Enables pointer events associated with pointer movement:
         * - `pointermove` / `mousemove` / `touchmove`
         * - `pointerout` / `mouseout`
         * - `pointerover` / `mouseover`
         */
        move: boolean;
        /**
         * Enables global pointer move events:
         * - `globalpointermove`
         * - `globalmousemove`
         * - `globaltouchemove`
         */
        globalMove: boolean;
        /**
         * Enables pointer events associated with clicking:
         * - `pointerup` / `mouseup` / `touchend` / 'rightup'
         * - `pointerupoutside` / `mouseupoutside` / `touchendoutside` / 'rightupoutside'
         * - `pointerdown` / 'mousedown' / `touchstart` / 'rightdown'
         * - `click` / `tap`
         */
        click: boolean;
        /** - Enables wheel events. */
        wheel: boolean;
    }
    /**
     * The system for handling UI events.
     * @memberof PIXI
     */
    export class EventSystem implements ISystem<EventSystemOptions> {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * The event features that are enabled by the EventSystem
         * This option only is available when using **@pixi/events** package
         * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
         * @since 7.2.0
         */
        static defaultEventFeatures: EventSystemFeatures;
        private static _defaultEventMode;
        /**
         * The default interaction mode for all display objects.
         * @see PIXI.DisplayObject.eventMode
         * @type {PIXI.EventMode}
         * @readonly
         * @since 7.2.0
         */
        static get defaultEventMode(): EventMode;
        /**
         * The {@link PIXI.EventBoundary} for the stage.
         *
         * The {@link PIXI.EventBoundary#rootTarget rootTarget} of this root boundary is automatically set to
         * the last rendered object before any event processing is initiated. This means the main scene
         * needs to be rendered atleast once before UI events will start propagating.
         *
         * The root boundary should only be changed during initialization. Otherwise, any state held by the
         * event boundary may be lost (like hovered & pressed DisplayObjects).
         */
        readonly rootBoundary: EventBoundary;
        /** Does the device support touch events https://www.w3.org/TR/touch-events/ */
        readonly supportsTouchEvents: boolean;
        /** Does the device support pointer events https://www.w3.org/Submission/pointer-events/ */
        readonly supportsPointerEvents: boolean;
        /**
         * Should default browser actions automatically be prevented.
         * Does not apply to pointer events for backwards compatibility
         * preventDefault on pointer events stops mouse events from firing
         * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
         * @default true
         */
        autoPreventDefault: boolean;
        /**
         * Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
         * values, objects are handled as dictionaries of CSS values for {@code domElement},
         * and functions are called instead of changing the CSS.
         * Default CSS cursor values are provided for 'default' and 'pointer' modes.
         */
        cursorStyles: Record<string, string | ((mode: string) => void) | CSSStyleDeclaration>;
        /**
         * The DOM element to which the root event listeners are bound. This is automatically set to
         * the renderer's {@link PIXI.Renderer#view view}.
         */
        domElement: HTMLElement;
        /** The resolution used to convert between the DOM client space into world space. */
        resolution: number;
        /** The renderer managing this {@link PIXI.EventSystem}. */
        renderer: IRenderer;
        /**
         * The event features that are enabled by the EventSystem
         * This option only is available when using **@pixi/events** package
         * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
         * @since 7.2.0
         * @example
         * const app = new PIXI.Application()
         * app.renderer.events.features.globalMove = false
         *
         * // to override all features use Object.assign
         * Object.assign(app.renderer.events.features, {
         *  move: false,
         *  globalMove: false,
         *  click: false,
         *  wheel: false,
         * })
         */
        readonly features: EventSystemFeatures;
        private currentCursor;
        private rootPointerEvent;
        private rootWheelEvent;
        private eventsAdded;
        /**
         * @param {PIXI.Renderer} renderer
         */
        constructor(renderer: IRenderer);
        /**
         * Runner init called, view is available at this point.
         * @ignore
         */
        init(options: EventSystemOptions): void;
        /**
         * Handle changing resolution.
         * @ignore
         */
        resolutionChange(resolution: number): void;
        /** Destroys all event listeners and detaches the renderer. */
        destroy(): void;
        /**
         * Sets the current cursor mode, handling any callbacks or CSS style changes.
         * @param mode - cursor mode, a key from the cursorStyles dictionary
         */
        setCursor(mode: string): void;
        /**
         * The global pointer event.
         * Useful for getting the pointer position without listening to events.
         * @since 7.2.0
         */
        get pointer(): Readonly<FederatedPointerEvent>;
        /**
         * Event handler for pointer down events on {@link PIXI.EventSystem#domElement this.domElement}.
         * @param nativeEvent - The native mouse/pointer/touch event.
         */
        private onPointerDown;
        /**
         * Event handler for pointer move events on on {@link PIXI.EventSystem#domElement this.domElement}.
         * @param nativeEvent - The native mouse/pointer/touch events.
         */
        private onPointerMove;
        /**
         * Event handler for pointer up events on {@link PIXI.EventSystem#domElement this.domElement}.
         * @param nativeEvent - The native mouse/pointer/touch event.
         */
        private onPointerUp;
        /**
         * Event handler for pointer over & out events on {@link PIXI.EventSystem#domElement this.domElement}.
         * @param nativeEvent - The native mouse/pointer/touch event.
         */
        private onPointerOverOut;
        /**
         * Passive handler for `wheel` events on {@link PIXI.EventSystem.domElement this.domElement}.
         * @param nativeEvent - The native wheel event.
         */
        protected onWheel(nativeEvent: WheelEvent): void;
        /**
         * Sets the {@link PIXI.EventSystem#domElement domElement} and binds event listeners.
         *
         * To deregister the current DOM element without setting a new one, pass {@code null}.
         * @param element - The new DOM element.
         */
        setTargetElement(element: HTMLElement): void;
        /** Register event listeners on {@link PIXI.Renderer#domElement this.domElement}. */
        private addEvents;
        /** Unregister event listeners on {@link PIXI.EventSystem#domElement this.domElement}. */
        private removeEvents;
        /**
         * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
         * resulting value is stored in the point. This takes into account the fact that the DOM
         * element could be scaled and positioned anywhere on the screen.
         * @param  {PIXI.IPointData} point - the point that the result will be stored in
         * @param  {number} x - the x coord of the position to map
         * @param  {number} y - the y coord of the position to map
         */
        mapPositionToPoint(point: IPointData, x: number, y: number): void;
        /**
         * Ensures that the original event object contains all data that a regular pointer event would have
         * @param event - The original event data from a touch or mouse event
         * @returns An array containing a single normalized pointer event, in the case of a pointer
         *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
         */
        private normalizeToPointerData;
        /**
         * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
         *
         * The returned {@link PIXI.FederatedWheelEvent} is a shared instance. It will not persist across
         * multiple native wheel events.
         * @param nativeEvent - The native wheel event that occurred on the canvas.
         * @returns A federated wheel event.
         */
        protected normalizeWheelEvent(nativeEvent: WheelEvent): FederatedWheelEvent;
        /**
         * Normalizes the `nativeEvent` into a federateed {@link PIXI.FederatedPointerEvent}.
         * @param event
         * @param nativeEvent
         */
        private bootstrapEvent;
        /**
         * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
         * @param event
         * @param nativeEvent
         */
        private transferMouseData;
    }
}
declare module "packages/events/src/EventTicker" {
    import type { EventSystem } from "packages/events/src/EventSystem";
    /**
     * This class handles automatic firing of PointerEvents
     * in the case where the pointer is stationary for too long.
     * This is to ensure that hit-tests are still run on moving objects.
     * @memberof PIXI
     * @since 7.2.0
     * @see PIXI.EventsTicker
     */
    class EventsTickerClass {
        /** The event system. */
        events: EventSystem;
        /** The DOM element to listen to events on. */
        domElement: HTMLElement;
        /** The frequency that fake events will be fired. */
        interactionFrequency: number;
        private _deltaTime;
        private _didMove;
        private tickerAdded;
        private _pauseUpdate;
        /**
         * Initializes the event ticker.
         * @param events - The event system.
         */
        init(events: EventSystem): void;
        /** Whether to pause the update checks or not. */
        get pauseUpdate(): boolean;
        set pauseUpdate(paused: boolean);
        /** Adds the ticker listener. */
        addTickerListener(): void;
        /** Removes the ticker listener. */
        removeTickerListener(): void;
        /** Sets flag to not fire extra events when the user has already moved there mouse */
        pointerMoved(): void;
        /** Updates the state of interactive objects. */
        private update;
        /**
         * Updates the state of interactive objects if at least {@link interactionFrequency}
         * milliseconds have passed since the last invocation.
         *
         * Invoked by a throttled ticker update from {@link PIXI.Ticker.system}.
         * @param deltaTime - time delta since the last call
         */
        private tickerUpdate;
    }
    /**
     * This class handles automatic firing of PointerEvents
     * in the case where the pointer is stationary for too long.
     * This is to ensure that hit-tests are still run on moving objects.
     * @memberof PIXI
     * @type {PIXI.EventsTickerClass}
     * @since 7.2.0
     */
    export const EventsTicker: EventsTickerClass;
}
declare module "packages/events/src/EventBoundaryTypes" {
    import type { FederatedEventTarget } from "packages/events/src/FederatedEventTarget";
    /**
     * The tracking data for each pointer held in the state of an {@link PIXI.EventBoundary}.
     *
     * ```ts
     * pressTargetsByButton: {
     *     [id: number]: FederatedEventTarget[];
     * };
     * clicksByButton: {
     *     [id: number]: {
     *         clickCount: number;
     *         target: FederatedEventTarget;
     *         timeStamp: number;
     *     };
     * };
     * overTargets: FederatedEventTarget[];
     * ```
     * @typedef {object} TrackingData
     * @property {Record.<number, PIXI.FederatedEventTarget>} pressTargetsByButton - The pressed display objects'
     *  propagation paths by each button of the pointer.
     * @property {Record.<number, object>} clicksByButton - Holds clicking data for each button of the pointer.
     * @property {PIXI.DisplayObject[]} overTargets - The DisplayObject propagation path over which the pointer is hovering.
     * @memberof PIXI
     */
    export type TrackingData = {
        pressTargetsByButton: {
            [id: number]: FederatedEventTarget[];
        };
        clicksByButton: {
            [id: number]: {
                clickCount: number;
                target: FederatedEventTarget;
                timeStamp: number;
            };
        };
        overTargets: FederatedEventTarget[];
    };
    /**
     * Internal storage of an event listener in EventEmitter.
     * @ignore
     */
    type EmitterListener = {
        fn(...args: any[]): any;
        context: any;
        once: boolean;
    };
    /**
     * Internal storage of event listeners in EventEmitter.
     * @ignore
     */
    export type EmitterListeners = Record<string, EmitterListener | EmitterListener[]>;
}
declare module "packages/events/src/EventBoundary" {
    import { Point, utils } from "packages/core/src/index";
    import { FederatedPointerEvent } from "packages/events/src/FederatedPointerEvent";
    import { FederatedWheelEvent } from "packages/events/src/FederatedWheelEvent";
    import type { DisplayObject } from "packages/display/src/index";
    import type { TrackingData } from "packages/events/src/EventBoundaryTypes";
    import type { FederatedEvent } from "packages/events/src/FederatedEvent";
    import type { Cursor, EventMode, FederatedEventTarget } from "packages/events/src/FederatedEventTarget";
    /**
     * Event boundaries are "barriers" where events coming from an upstream scene are modified before downstream propagation.
     *
     * ## Root event boundary
     *
     * The {@link PIXI.EventSystem#rootBoundary rootBoundary} handles events coming from the &lt;canvas /&gt;.
     * {@link PIXI.EventSystem} handles the normalization from native {@link https://dom.spec.whatwg.org/#event Events}
     * into {@link PIXI.FederatedEvent FederatedEvents}. The rootBoundary then does the hit-testing and event dispatch
     * for the upstream normalized event.
     *
     * ## Additional event boundaries
     *
     * An additional event boundary may be desired within an application's scene graph. For example, if a portion of the scene is
     * is flat with many children at one level - a spatial hash maybe needed to accelerate hit testing. In this scenario, the
     * container can be detached from the scene and glued using a custom event boundary.
     *
     * ```ts
     * import { Container } from '@pixi/display';
     * import { EventBoundary } from '@pixi/events';
     * import { SpatialHash } from 'pixi-spatial-hash';
     *
     * class HashedHitTestingEventBoundary
     * {
     *     private spatialHash: SpatialHash;
     *
     *     constructor(scene: Container, spatialHash: SpatialHash)
     *     {
     *         super(scene);
     *         this.spatialHash = spatialHash;
     *     }
     *
     *     hitTestRecursive(...)
     *     {
     *         // TODO: If target === this.rootTarget, then use spatial hash to get a
     *         // list of possible children that match the given (x,y) coordinates.
     *     }
     * }
     *
     * class VastScene extends DisplayObject
     * {
     *     protected eventBoundary: EventBoundary;
     *     protected scene: Container;
     *     protected spatialHash: SpatialHash;
     *
     *     constructor()
     *     {
     *         this.scene = new Container();
     *         this.spatialHash = new SpatialHash();
     *         this.eventBoundary = new HashedHitTestingEventBoundary(this.scene, this.spatialHash);
     *
     *         // Populate this.scene with a ton of children, while updating this.spatialHash
     *     }
     * }
     * ```
     * @memberof PIXI
     */
    export class EventBoundary {
        /**
         * The root event-target residing below the event boundary.
         *
         * All events are dispatched trickling down and bubbling up to this `rootTarget`.
         */
        rootTarget: DisplayObject;
        /**
         * Emits events after they were dispatched into the scene graph.
         *
         * This can be used for global events listening, regardless of the scene graph being used. It should
         * not be used by interactive libraries for normal use.
         *
         * Special events that do not bubble all the way to the root target are not emitted from here,
         * e.g. pointerenter, pointerleave, click.
         */
        dispatch: utils.EventEmitter;
        /** The cursor preferred by the event targets underneath this boundary. */
        cursor: Cursor | string;
        /**
         * This flag would emit `pointermove`, `touchmove`, and `mousemove` events on all DisplayObjects.
         *
         * The `moveOnAll` semantics mirror those of earlier versions of PixiJS. This was disabled in favor of
         * the Pointer Event API's approach.
         */
        moveOnAll: boolean;
        /** Enables the global move events. `globalpointermove`, `globaltouchmove`, and `globalmousemove` */
        enableGlobalMoveEvents: boolean;
        /**
         * Maps event types to forwarding handles for them.
         *
         * {@link PIXI.EventBoundary EventBoundary} provides mapping for "pointerdown", "pointermove",
         * "pointerout", "pointerleave", "pointerover", "pointerup", and "pointerupoutside" by default.
         * @see PIXI.EventBoundary#addEventMapping
         */
        protected mappingTable: Record<string, Array<{
            fn: (e: FederatedEvent) => void;
            priority: number;
        }>>;
        /**
         * State object for mapping methods.
         * @see PIXI.EventBoundary#trackingData
         */
        protected mappingState: Record<string, any>;
        /**
         * The event pool maps event constructors to an free pool of instances of those specific events.
         * @see PIXI.EventBoundary#allocateEvent
         * @see PIXI.EventBoundary#freeEvent
         */
        protected eventPool: Map<typeof FederatedEvent, FederatedEvent[]>;
        /** Every interactive element gathered from the scene. Only used in `pointermove` */
        private _allInteractiveElements;
        /** Every element that passed the hit test. Only used in `pointermove` */
        private _hitElements;
        /** Whether or not to collect all the interactive elements from the scene. Enabled in `pointermove` */
        private _isPointerMoveEvent;
        /**
         * @param rootTarget - The holder of the event boundary.
         */
        constructor(rootTarget?: DisplayObject);
        /**
         * Adds an event mapping for the event `type` handled by `fn`.
         *
         * Event mappings can be used to implement additional or custom events. They take an event
         * coming from the upstream scene (or directly from the {@link PIXI.EventSystem}) and dispatch new downstream events
         * generally trickling down and bubbling up to {@link PIXI.EventBoundary.rootTarget this.rootTarget}.
         *
         * To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
         * instead.
         * @param type - The type of upstream event to map.
         * @param fn - The mapping method. The context of this function must be bound manually, if desired.
         */
        addEventMapping(type: string, fn: (e: FederatedEvent) => void): void;
        /**
         * Dispatches the given event
         * @param e
         * @param type
         */
        dispatchEvent(e: FederatedEvent, type?: string): void;
        /**
         * Maps the given upstream event through the event boundary and propagates it downstream.
         * @param e
         */
        mapEvent(e: FederatedEvent): void;
        /**
         * Finds the DisplayObject that is the target of a event at the given coordinates.
         *
         * The passed (x,y) coordinates are in the world space above this event boundary.
         * @param x
         * @param y
         */
        hitTest(x: number, y: number): DisplayObject;
        /**
         * Propagate the passed event from from {@link PIXI.EventBoundary.rootTarget this.rootTarget} to its
         * target {@code e.target}.
         * @param e - The event to propagate.
         * @param type
         */
        propagate(e: FederatedEvent, type?: string): void;
        /**
         * Emits the event {@code e} to all interactive display objects. The event is propagated in the bubbling phase always.
         *
         * This is used in the `globalpointermove` event.
         * @param e - The emitted event.
         * @param type - The listeners to notify.
         * @param targets - The targets to notify.
         */
        all(e: FederatedEvent, type?: string | string[], targets?: FederatedEventTarget[]): void;
        /**
         * Finds the propagation path from {@link PIXI.EventBoundary.rootTarget rootTarget} to the passed
         * {@code target}. The last element in the path is {@code target}.
         * @param target
         */
        propagationPath(target: FederatedEventTarget): FederatedEventTarget[];
        protected hitTestMoveRecursive(currentTarget: DisplayObject, eventMode: EventMode, location: Point, testFn: (object: DisplayObject, pt: Point) => boolean, pruneFn?: (object: DisplayObject, pt: Point) => boolean, ignore?: boolean): DisplayObject[];
        /**
         * Recursive implementation for {@link PIXI.EventBoundary.hitTest hitTest}.
         * @param currentTarget - The DisplayObject that is to be hit tested.
         * @param eventMode - The event mode for the `currentTarget` or one of its parents.
         * @param location - The location that is being tested for overlap.
         * @param testFn - Callback that determines whether the target passes hit testing. This callback
         *  can assume that `pruneFn` failed to prune the display object.
         * @param pruneFn - Callback that determiness whether the target and all of its children
         *  cannot pass the hit test. It is used as a preliminary optimization to prune entire subtrees
         *  of the scene graph.
         * @returns An array holding the hit testing target and all its ancestors in order. The first element
         *  is the target itself and the last is {@link PIXI.EventBoundary.rootTarget rootTarget}. This is the opposite
         *  order w.r.t. the propagation path. If no hit testing target is found, null is returned.
         */
        protected hitTestRecursive(currentTarget: DisplayObject, eventMode: EventMode, location: Point, testFn: (object: DisplayObject, pt: Point) => boolean, pruneFn?: (object: DisplayObject, pt: Point) => boolean): DisplayObject[];
        private _isInteractive;
        private _interactivePrune;
        /**
         * Checks whether the display object or any of its children cannot pass the hit test at all.
         *
         * {@link PIXI.EventBoundary}'s implementation uses the {@link PIXI.DisplayObject.hitArea hitArea}
         * and {@link PIXI.DisplayObject._mask} for pruning.
         * @param displayObject
         * @param location
         */
        protected hitPruneFn(displayObject: DisplayObject, location: Point): boolean;
        /**
         * Checks whether the display object passes hit testing for the given location.
         * @param displayObject
         * @param location
         * @returns - Whether `displayObject` passes hit testing for `location`.
         */
        protected hitTestFn(displayObject: DisplayObject, location: Point): boolean;
        /**
         * Notify all the listeners to the event's `currentTarget`.
         *
         * If the `currentTarget` contains the property `on<type>`, then it is called here,
         * simulating the behavior from version 6.x and prior.
         * @param e - The event passed to the target.
         * @param type
         */
        protected notifyTarget(e: FederatedEvent, type?: string): void;
        /**
         * Maps the upstream `pointerdown` events to a downstream `pointerdown` event.
         *
         * `touchstart`, `rightdown`, `mousedown` events are also dispatched for specific pointer types.
         * @param from
         */
        protected mapPointerDown(from: FederatedEvent): void;
        /**
         * Maps the upstream `pointermove` to downstream `pointerout`, `pointerover`, and `pointermove` events, in that order.
         *
         * The tracking data for the specific pointer has an updated `overTarget`. `mouseout`, `mouseover`,
         * `mousemove`, and `touchmove` events are fired as well for specific pointer types.
         * @param from - The upstream `pointermove` event.
         */
        protected mapPointerMove(from: FederatedEvent): void;
        /**
         * Maps the upstream `pointerover` to downstream `pointerover` and `pointerenter` events, in that order.
         *
         * The tracking data for the specific pointer gets a new `overTarget`.
         * @param from - The upstream `pointerover` event.
         */
        protected mapPointerOver(from: FederatedEvent): void;
        /**
         * Maps the upstream `pointerout` to downstream `pointerout`, `pointerleave` events, in that order.
         *
         * The tracking data for the specific pointer is cleared of a `overTarget`.
         * @param from - The upstream `pointerout` event.
         */
        protected mapPointerOut(from: FederatedEvent): void;
        /**
         * Maps the upstream `pointerup` event to downstream `pointerup`, `pointerupoutside`,
         * and `click`/`rightclick`/`pointertap` events, in that order.
         *
         * The `pointerupoutside` event bubbles from the original `pointerdown` target to the most specific
         * ancestor of the `pointerdown` and `pointerup` targets, which is also the `click` event's target. `touchend`,
         * `rightup`, `mouseup`, `touchendoutside`, `rightupoutside`, `mouseupoutside`, and `tap` are fired as well for
         * specific pointer types.
         * @param from - The upstream `pointerup` event.
         */
        protected mapPointerUp(from: FederatedEvent): void;
        /**
         * Maps the upstream `pointerupoutside` event to a downstream `pointerupoutside` event, bubbling from the original
         * `pointerdown` target to `rootTarget`.
         *
         * (The most specific ancestor of the `pointerdown` event and the `pointerup` event must the
         * `{@link PIXI.EventBoundary}'s root because the `pointerup` event occurred outside of the boundary.)
         *
         * `touchendoutside`, `mouseupoutside`, and `rightupoutside` events are fired as well for specific pointer
         * types. The tracking data for the specific pointer is cleared of a `pressTarget`.
         * @param from - The upstream `pointerupoutside` event.
         */
        protected mapPointerUpOutside(from: FederatedEvent): void;
        /**
         * Maps the upstream `wheel` event to a downstream `wheel` event.
         * @param from - The upstream `wheel` event.
         */
        protected mapWheel(from: FederatedEvent): void;
        /**
         * Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
         *
         * This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
         * or `pointerover` target was unmounted from the scene graph.
         * @param propagationPath - The propagation path was valid in the past.
         * @returns - The most specific event-target still mounted at the same location in the scene graph.
         */
        protected findMountedTarget(propagationPath: FederatedEventTarget[]): FederatedEventTarget;
        /**
         * Creates an event whose {@code originalEvent} is {@code from}, with an optional `type` and `target` override.
         *
         * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
         * @param from - The {@code originalEvent} for the returned event.
         * @param [type=from.type] - The type of the returned event.
         * @param target - The target of the returned event.
         */
        protected createPointerEvent(from: FederatedPointerEvent, type?: string, target?: FederatedEventTarget): FederatedPointerEvent;
        /**
         * Creates a wheel event whose {@code originalEvent} is {@code from}.
         *
         * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
         * @param from - The upstream wheel event.
         */
        protected createWheelEvent(from: FederatedWheelEvent): FederatedWheelEvent;
        /**
         * Clones the event {@code from}, with an optional {@code type} override.
         *
         * The event is allocated using {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}.
         * @param from - The event to clone.
         * @param [type=from.type] - The type of the returned event.
         */
        protected clonePointerEvent(from: FederatedPointerEvent, type?: string): FederatedPointerEvent;
        /**
         * Copies wheel {@link PIXI.FederatedWheelEvent} data from {@code from} into {@code to}.
         *
         * The following properties are copied:
         * + deltaMode
         * + deltaX
         * + deltaY
         * + deltaZ
         * @param from
         * @param to
         */
        protected copyWheelData(from: FederatedWheelEvent, to: FederatedWheelEvent): void;
        /**
         * Copies pointer {@link PIXI.FederatedPointerEvent} data from {@code from} into {@code to}.
         *
         * The following properties are copied:
         * + pointerId
         * + width
         * + height
         * + isPrimary
         * + pointerType
         * + pressure
         * + tangentialPressure
         * + tiltX
         * + tiltY
         * @param from
         * @param to
         */
        protected copyPointerData(from: FederatedEvent, to: FederatedEvent): void;
        /**
         * Copies mouse {@link PIXI.FederatedMouseEvent} data from {@code from} to {@code to}.
         *
         * The following properties are copied:
         * + altKey
         * + button
         * + buttons
         * + clientX
         * + clientY
         * + metaKey
         * + movementX
         * + movementY
         * + pageX
         * + pageY
         * + x
         * + y
         * + screen
         * + shiftKey
         * + global
         * @param from
         * @param to
         */
        protected copyMouseData(from: FederatedEvent, to: FederatedEvent): void;
        /**
         * Copies base {@link PIXI.FederatedEvent} data from {@code from} into {@code to}.
         *
         * The following properties are copied:
         * + isTrusted
         * + srcElement
         * + timeStamp
         * + type
         * @param from - The event to copy data from.
         * @param to - The event to copy data into.
         */
        protected copyData(from: FederatedEvent, to: FederatedEvent): void;
        /**
         * @param id - The pointer ID.
         * @returns The tracking data stored for the given pointer. If no data exists, a blank
         *  state will be created.
         */
        protected trackingData(id: number): TrackingData;
        /**
         * Allocate a specific type of event from {@link PIXI.EventBoundary#eventPool this.eventPool}.
         *
         * This allocation is constructor-agnostic, as long as it only takes one argument - this event
         * boundary.
         * @param constructor - The event's constructor.
         */
        protected allocateEvent<T extends FederatedEvent>(constructor: {
            new (boundary: EventBoundary): T;
        }): T;
        /**
         * Frees the event and puts it back into the event pool.
         *
         * It is illegal to reuse the event until it is allocated again, using `this.allocateEvent`.
         *
         * It is also advised that events not allocated from {@link PIXI.EventBoundary#allocateEvent this.allocateEvent}
         * not be freed. This is because of the possibility that the same event is freed twice, which can cause
         * it to be allocated twice & result in overwriting.
         * @param event - The event to be freed.
         * @throws Error if the event is managed by another event boundary.
         */
        protected freeEvent<T extends FederatedEvent>(event: T): void;
        /**
         * Similar to {@link PIXI.EventEmitter.emit}, except it stops if the `propagationImmediatelyStopped` flag
         * is set on the event.
         * @param e - The event to call each listener with.
         * @param type - The event key.
         */
        private notifyListeners;
    }
}
declare module "packages/events/src/index" {
    export * from "packages/events/src/EventBoundary";
    export * from "packages/events/src/EventSystem";
    export * from "packages/events/src/FederatedEvent";
    export * from "packages/events/src/FederatedEventMap";
    export * from "packages/events/src/FederatedEventTarget";
    export * from "packages/events/src/FederatedMouseEvent";
    export * from "packages/events/src/FederatedPointerEvent";
    export * from "packages/events/src/FederatedWheelEvent";
}
declare module "packages/accessibility/src/accessibleTarget" {
    import type { DisplayObject } from "packages/display/src/index";
    export type PointerEvents = 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | 'inherit';
    export interface IAccessibleTarget {
        accessible: boolean;
        accessibleTitle: string;
        accessibleHint: string;
        tabIndex: number;
        _accessibleActive: boolean;
        _accessibleDiv: IAccessibleHTMLElement;
        accessibleType: string;
        accessiblePointerEvents: PointerEvents;
        accessibleChildren: boolean;
        renderId: number;
    }
    export interface IAccessibleHTMLElement extends HTMLElement {
        type?: string;
        displayObject?: DisplayObject;
    }
    /**
     * Default property values of accessible objects
     * used by {@link PIXI.AccessibilityManager}.
     * @private
     * @function accessibleTarget
     * @memberof PIXI
     * @type {object}
     * @example
     * import { accessibleTarget } from 'pixi.js';
     *
     * function MyObject() {}
     * Object.assign(MyObject.prototype, accessibleTarget);
     */
    export const accessibleTarget: IAccessibleTarget;
}
declare module "packages/accessibility/src/AccessibilityManager" {
    import type { ExtensionMetadata, IRenderer, Rectangle } from "packages/core/src/index";
    import type { IAccessibleHTMLElement } from "packages/accessibility/src/accessibleTarget";
    /**
     * The Accessibility manager recreates the ability to tab and have content read by screen readers.
     * This is very important as it can possibly help people with disabilities access PixiJS content.
     *
     * A DisplayObject can be made accessible just like it can be made interactive. This manager will map the
     * events as if the mouse was being used, minimizing the effort required to implement.
     *
     * An instance of this class is automatically created by default, and can be found at `renderer.plugins.accessibility`
     * @class
     * @memberof PIXI
     */
    export class AccessibilityManager {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** Setting this to true will visually show the divs. */
        debug: boolean;
        /**
         * The renderer this accessibility manager works for.
         * @type {PIXI.CanvasRenderer|PIXI.Renderer}
         */
        renderer: IRenderer;
        /** Internal variable, see isActive getter. */
        private _isActive;
        /** Internal variable, see isMobileAccessibility getter. */
        private _isMobileAccessibility;
        /** Button element for handling touch hooks. */
        private _hookDiv;
        /** This is the dom element that will sit over the PixiJS element. This is where the div overlays will go. */
        private div;
        /** A simple pool for storing divs. */
        private pool;
        /** This is a tick used to check if an object is no longer being rendered. */
        private renderId;
        /** The array of currently active accessible items. */
        private children;
        /** Count to throttle div updates on android devices. */
        private androidUpdateCount;
        /**  The frequency to update the div elements. */
        private androidUpdateFrequency;
        /**
         * @param {PIXI.CanvasRenderer|PIXI.Renderer} renderer - A reference to the current renderer
         */
        constructor(renderer: IRenderer);
        /**
         * Value of `true` if accessibility is currently active and accessibility layers are showing.
         * @member {boolean}
         * @readonly
         */
        get isActive(): boolean;
        /**
         * Value of `true` if accessibility is enabled for touch devices.
         * @member {boolean}
         * @readonly
         */
        get isMobileAccessibility(): boolean;
        /**
         * Creates the touch hooks.
         * @private
         */
        private createTouchHook;
        /**
         * Destroys the touch hooks.
         * @private
         */
        private destroyTouchHook;
        /**
         * Activating will cause the Accessibility layer to be shown.
         * This is called when a user presses the tab key.
         * @private
         */
        private activate;
        /**
         * Deactivating will cause the Accessibility layer to be hidden.
         * This is called when a user moves the mouse.
         * @private
         */
        private deactivate;
        /**
         * This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
         * @private
         * @param {PIXI.Container} displayObject - The DisplayObject to check.
         */
        private updateAccessibleObjects;
        /**
         * Before each render this function will ensure that all divs are mapped correctly to their DisplayObjects.
         * @private
         */
        private update;
        /**
         * private function that will visually add the information to the
         * accessability div
         * @param {HTMLElement} div -
         */
        updateDebugHTML(div: IAccessibleHTMLElement): void;
        /**
         * Adjust the hit area based on the bounds of a display object
         * @param {PIXI.Rectangle} hitArea - Bounds of the child
         */
        capHitArea(hitArea: Rectangle): void;
        /**
         * Adds a DisplayObject to the accessibility manager
         * @private
         * @param {PIXI.DisplayObject} displayObject - The child to make accessible.
         */
        private addChild;
        /**
         * Dispatch events with the EventSystem.
         * @param e
         * @param type
         * @private
         */
        private _dispatchEvent;
        /**
         * Maps the div button press to pixi's EventSystem (click)
         * @private
         * @param {MouseEvent} e - The click event.
         */
        private _onClick;
        /**
         * Maps the div focus events to pixi's EventSystem (mouseover)
         * @private
         * @param {FocusEvent} e - The focus event.
         */
        private _onFocus;
        /**
         * Maps the div focus events to pixi's EventSystem (mouseout)
         * @private
         * @param {FocusEvent} e - The focusout event.
         */
        private _onFocusOut;
        /**
         * Is called when a key is pressed
         * @private
         * @param {KeyboardEvent} e - The keydown event.
         */
        private _onKeyDown;
        /**
         * Is called when the mouse moves across the renderer element
         * @private
         * @param {MouseEvent} e - The mouse event.
         */
        private _onMouseMove;
        /** Destroys the accessibility manager */
        destroy(): void;
    }
}
declare module "packages/accessibility/src/index" {
    export * from "packages/accessibility/src/AccessibilityManager";
    export * from "packages/accessibility/src/accessibleTarget";
}
declare module "packages/app/src/Application" {
    import { Container } from "packages/display/src/index";
    import type { ICanvas, IRenderer, IRendererOptionsAuto, Rectangle } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    /**
     * Any plugin that's usable for Application should contain these methods.
     * @memberof PIXI
     */
    export interface IApplicationPlugin {
        /**
         * Called when Application is constructed, scoped to Application instance.
         * Passes in `options` as the only argument, which are Application constructor options.
         * @param {object} options - Application options.
         */
        init(options: Partial<IApplicationOptions>): void;
        /** Called when destroying Application, scoped to Application instance. */
        destroy(): void;
    }
    /**
     * Application options supplied to constructor.
     * @memberof PIXI
     */
    export interface IApplicationOptions extends IRendererOptionsAuto, GlobalMixins.IApplicationOptions {
    }
    export interface Application extends GlobalMixins.Application {
    }
    /**
     * Convenience class to create a new PixiJS application.
     *
     * This class automatically creates the renderer, ticker and root container.
     * @example
     * import { Application, Sprite } from 'pixi.js';
     *
     * // Create the application
     * const app = new Application();
     *
     * // Add the view to the DOM
     * document.body.appendChild(app.view);
     *
     * // ex, add display objects
     * app.stage.addChild(Sprite.from('something.png'));
     * @class
     * @memberof PIXI
     */
    export class Application<VIEW extends ICanvas = ICanvas> {
        /** Collection of installed plugins. */
        static _plugins: IApplicationPlugin[];
        /**
         * The root display container that's rendered.
         * @member {PIXI.Container}
         */
        stage: Container;
        /**
         * WebGL renderer if available, otherwise CanvasRenderer.
         * @member {PIXI.Renderer|PIXI.CanvasRenderer}
         */
        renderer: IRenderer<VIEW>;
        /**
         * @param options - The optional application and renderer parameters.
         */
        constructor(options?: Partial<IApplicationOptions>);
        /** Render the current stage. */
        render(): void;
        /**
         * Reference to the renderer's canvas element.
         * @member {PIXI.ICanvas}
         * @readonly
         */
        get view(): VIEW;
        /**
         * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
         * @member {PIXI.Rectangle}
         * @readonly
         */
        get screen(): Rectangle;
        /**
         * Destroy and don't use after this.
         * @param {boolean} [removeView=false] - Automatically remove canvas from DOM.
         * @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
         *  method called as well. 'stageOptions' will be passed on to those calls.
         * @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
         *  to true. Should it destroy the texture of the child sprite
         * @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
         *  to true. Should it destroy the base texture of the child sprite
         */
        destroy(removeView?: boolean, stageOptions?: IDestroyOptions | boolean): void;
    }
}
declare module "packages/app/src/ResizePlugin" {
    import type { ExtensionMetadata, Renderer } from "packages/core/src/index";
    type ResizeableRenderer = Pick<Renderer, 'resize'>;
    export interface ResizePluginOptions {
        /**
         * Element to automatically resize stage to.
         * @memberof PIXI.IApplicationOptions
         */
        resizeTo?: Window | HTMLElement;
    }
    /**
     * Middleware for for Application's resize functionality
     * @private
     * @class
     */
    export class ResizePlugin {
        /** @ignore */
        static extension: ExtensionMetadata;
        static resizeTo: Window | HTMLElement;
        static resize: () => void;
        static renderer: ResizeableRenderer;
        static queueResize: () => void;
        static render: () => void;
        private static _resizeId;
        private static _resizeTo;
        private static cancelResize;
        /**
         * Initialize the plugin with scope of application instance
         * @static
         * @private
         * @param {object} [options] - See application options
         */
        static init(options: ResizePluginOptions): void;
        /**
         * Clean up the ticker, scoped to application
         * @static
         * @private
         */
        static destroy(): void;
    }
}
declare module "packages/app/src/index" {
    export * from "packages/app/src/Application";
    export * from "packages/app/src/ResizePlugin";
}
declare module "packages/assets/src/utils/checkDataUrl" {
    export function checkDataUrl(url: string, mimes: string | string[]): boolean;
}
declare module "packages/assets/src/utils/checkExtension" {
    export function checkExtension(url: string, extension: string | string[]): boolean;
}
declare module "packages/assets/src/utils/convertToList" {
    export const convertToList: <T>(input: string | T | (string | T)[], transform?: (input: string) => T) => T[];
}
declare module "packages/assets/src/utils/copySearchParams" {
    /**
     * Copies the search params from one url to another
     * @param targetUrl - the url to copy the search params to
     * @param sourceUrl - the url container the search params we want to copy
     * @returns the url with the search params copied
     */
    export const copySearchParams: (targetUrl: string, sourceUrl: string) => string;
}
declare module "packages/assets/src/utils/createStringVariations" {
    /**
     * Creates a list of all possible combinations of the given strings.
     * @example
     * const out2 = createStringVariations('name is {chicken,wolf,sheep}');
     * console.log(out2); // [ 'name is chicken', 'name is wolf', 'name is sheep' ]
     * @param string - The string to process
     */
    export function createStringVariations(string: string): string[];
}
declare module "packages/assets/src/utils/isSingleItem" {
    /**
     * Checks if the given value is an array.
     * @param item - The item to test
     */
    export const isSingleItem: (item: unknown) => boolean;
}
declare module "packages/assets/src/utils/index" {
    export * from "packages/assets/src/utils/checkDataUrl";
    export * from "packages/assets/src/utils/checkExtension";
    export * from "packages/assets/src/utils/convertToList";
    export * from "packages/assets/src/utils/copySearchParams";
    export * from "packages/assets/src/utils/createStringVariations";
    export * from "packages/assets/src/utils/isSingleItem";
}
declare module "packages/assets/src/cache/CacheParser" {
    import type { ExtensionMetadata } from "packages/core/src/index";
    /**
     * For every asset that is cached, it will call the parsers test function
     * the flow is as follows:
     *
     * 1. `cacheParser.test()`: Test the asset.
     * 2. `cacheParser.getCacheableAssets()`: If the test passes call the getCacheableAssets function with the asset
     *
     * Useful if you want to add more than just a raw asset to the cache
     * (for example a spritesheet will want to make all its sub textures easily accessible in the cache)
     * @memberof PIXI
     */
    export interface CacheParser<T = any> {
        extension?: ExtensionMetadata;
        /** A config to adjust the parser */
        config?: Record<string, any>;
        /**
         * Gets called by the cache when a dev caches an asset
         * @param asset - the asset to test
         */
        test: (asset: T) => boolean;
        /**
         * If the test passes, this function is called to get the cacheable assets
         * an example may be that a spritesheet object will return all the sub textures it has so they can
         * be cached.
         * @param keys - The keys to cache the assets under
         * @param asset - The asset to get the cacheable assets from
         * @returns A key-value pair of cacheable assets
         */
        getCacheableAssets: (keys: string[], asset: T) => Record<string, any>;
    }
}
declare module "packages/assets/src/cache/Cache" {
    import type { CacheParser } from "packages/assets/src/cache/CacheParser";
    /**
     * A single Cache for all assets.
     *
     * When assets are added to the cache via set they normally are added to the cache as key-value pairs.
     *
     * With this cache, you can add parsers that will take the object and convert it to a list of assets that can be cached.
     * for example a cacheSprite Sheet parser will add all of the textures found within its sprite sheet directly to the cache.
     *
     * This gives devs the flexibility to cache any type of object however we want.
     *
     * It is not intended that this class is created by developers - it is part of the Asset package.
     * This is the first major system of PixiJS' main Assets class.
     * @memberof PIXI
     * @class Cache
     */
    class CacheClass {
        private _parsers;
        private readonly _cache;
        private readonly _cacheMap;
        /** Clear all entries. */
        reset(): void;
        /**
         * Check if the key exists
         * @param key - The key to check
         */
        has(key: string): boolean;
        /**
         * Fetch entry by key
         * @param key - The key of the entry to get
         */
        get<T = any>(key: string): T;
        /**
         * Set a value by key or keys name
         * @param key - The key or keys to set
         * @param value - The value to store in the cache or from which cacheable assets will be derived.
         */
        set(key: string | string[], value: unknown): void;
        /**
         * Remove entry by key
         *
         * This function will also remove any associated alias from the cache also.
         * @param key - The key of the entry to remove
         */
        remove(key: string): void;
        /** All loader parsers registered */
        get parsers(): CacheParser[];
    }
    export const Cache: CacheClass;
}
declare module "packages/assets/src/cache/parsers/cacheTextureArray" {
    import { Texture } from "packages/core/src/index";
    import type { CacheParser } from "packages/assets/src/cache/CacheParser";
    export const cacheTextureArray: CacheParser<Texture[]>;
}
declare module "packages/assets/src/cache/parsers/index" {
    export * from "packages/assets/src/cache/parsers/cacheTextureArray";
}
declare module "packages/assets/src/cache/index" {
    export * from "packages/assets/src/cache/Cache";
    export * from "packages/assets/src/cache/CacheParser";
    export * from "packages/assets/src/cache/parsers/index";
}
declare module "packages/assets/src/detections/parsers/detectAvif" {
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    export const detectAvif: FormatDetectionParser;
}
declare module "packages/assets/src/detections/parsers/detectWebp" {
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    export const detectWebp: FormatDetectionParser;
}
declare module "packages/assets/src/detections/parsers/detectDefaults" {
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    export const detectDefaults: FormatDetectionParser;
}
declare module "packages/assets/src/detections/utils/testVideoFormat" {
    export function testVideoFormat(mimeType: string): boolean;
}
declare module "packages/assets/src/detections/parsers/detectWebm" {
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    export const detectWebm: FormatDetectionParser;
}
declare module "packages/assets/src/detections/parsers/detectMp4" {
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    export const detectMp4: FormatDetectionParser;
}
declare module "packages/assets/src/detections/parsers/detectOgv" {
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    export const detectOgv: FormatDetectionParser;
}
declare module "packages/assets/src/detections/parsers/index" {
    export * from "packages/assets/src/detections/parsers/detectAvif";
    export * from "packages/assets/src/detections/parsers/detectWebp";
    export * from "packages/assets/src/detections/parsers/detectDefaults";
    export * from "packages/assets/src/detections/parsers/detectWebm";
    export * from "packages/assets/src/detections/parsers/detectMp4";
    export * from "packages/assets/src/detections/parsers/detectOgv";
}
declare module "packages/assets/src/detections/index" {
    import type { ExtensionMetadata } from "packages/core/src/index";
    /**
     * Format detection is useful for detecting feature support
     * on the current platform.
     * @memberof PIXI
     */
    export interface FormatDetectionParser {
        /** Should be ExtensionType.DetectionParser */
        extension?: ExtensionMetadata;
        /** Browser/platform feature detection supported if return true  */
        test: () => Promise<boolean>;
        /**
         * Add formats (file extensions) to the existing list of formats.
         * Return an new array with added formats, do not mutate the formats argument.
         * @returns {Promise<string[]>} - Promise that resolves to the new formats array.
         */
        add: (formats: string[]) => Promise<string[]>;
        /**
         * Remove formats (file extensions) from the list of supported formats.
         * This is used when uninstalling this DetectionParser.
         * Return an new array with filtered formats, do not mutate the formats argument.
         * @returns {Promise<string[]>} - Promise that resolves to the new formats array.
         */
        remove: (formats: string[]) => Promise<string[]>;
    }
    export * from "packages/assets/src/detections/parsers/index";
}
declare module "packages/assets/src/types" {
    export type ArrayOr<T> = T | T[];
    /**
     * Names of the parsers that are built into PIXI.
     * @memberof PIXI
     */
    export type LoadParserName = 'loadJson' | 'loadSVG' | 'loadTextures' | 'loadTxt' | 'loadVideo' | 'loadWebFont' | string;
    /**
     * A fully resolved asset, with all the information needed to load it.
     * @memberof PIXI
     */
    export interface ResolvedAsset<T = any> {
        /** Aliases associated with asset */
        alias?: string[];
        /**
         * Please use `alias` instead.
         * @deprecated since 7.3.0
         */
        name?: string[];
        /** The URL or relative path to the asset */
        src?: string;
        /**
         * Please use `src` instead.
         * @deprecated since 7.3.0
         */
        srcs?: string;
        /** Optional data */
        data?: T;
        /** Format, usually the file extension */
        format?: string;
        /** An override that will ensure that the asset is loaded with a specific parser */
        loadParser?: LoadParserName;
        [key: string]: any;
    }
    /**
     * A fully resolved src,
     * Glob patterns will not work here, and the src will be resolved to a single file.
     * @memberof PIXI
     */
    export type ResolvedSrc = Pick<ResolvedAsset, 'src' | 'srcs' | 'format' | 'loadParser' | 'data'> & {
        [key: string]: any;
    };
    export type AssetSrc = ArrayOr<string> | ArrayOr<ResolvedSrc>;
    /**
     * An asset that has not been resolved yet.
     * @memberof PIXI
     */
    export interface UnresolvedAsset<T = any> extends Omit<ResolvedAsset<T>, 'src' | 'srcs' | 'name' | 'alias'> {
        /** Aliases associated with asset */
        alias?: ArrayOr<string>;
        /** The URL or relative path to the asset */
        src?: AssetSrc;
        /**
         * Please use `alias` instead.
         * @deprecated since 7.3.0
         */
        name?: ArrayOr<string>;
        /**
         * Please use `src` instead.
         * @deprecated since 7.3.0
         */
        srcs?: AssetSrc;
    }
    /**
     * The object version of an unresolved asset
     * @memberof PIXI
     */
    export type UnresolvedAssetObject = Omit<UnresolvedAsset, 'name' | 'alias'>;
    /**
     * Structure of a bundle found in a manifest file
     * @memberof PIXI
     */
    export interface AssetsBundle {
        name: string;
        assets: UnresolvedAsset[] | Record<string, ArrayOr<string> | UnresolvedAssetObject>;
    }
    /**
     * The expected format of a manifest. This would normally be auto generated or made by the developer
     * @memberof PIXI
     */
    export interface AssetsManifest {
        bundles: AssetsBundle[];
    }
}
declare module "packages/assets/src/loader/parsers/LoaderParser" {
    import type { ExtensionMetadata } from "packages/core/src/index";
    import type { ResolvedAsset } from "packages/assets/src/types";
    import type { Loader } from "packages/assets/src/loader/Loader";
    /**
     * The extension priority for loader parsers.
     * Helpful when managing multiple parsers that share the same extension test.
     * The higher priority parsers will be checked first.
     * @memberof PIXI
     * @enum {number}
     */
    export enum LoaderParserPriority {
        /** Generic parsers: txt, json, webfonts */
        Low = 0,
        /** PixiJS assets with generic extensions: spritesheets, bitmapfonts  */
        Normal = 1,
        /** Specific texture types: svg, png, ktx, dds, basis */
        High = 2
    }
    /**
     * All functions are optional here. The flow:
     *
     * for every asset,
     *
     * 1. `parser.test()`: Test the asset url.
     * 2. `parser.load()`: If test passes call the load function with the url
     * 3. `parser.testParse()`: Test to see if the asset should be parsed by the plugin
     * 4. `parse.parse()`: If test is parsed, then run the parse function on the asset.
     *
     * some plugins may only be used for parsing,
     * some only for loading
     * and some for both!
     * @memberof PIXI
     */
    export interface LoaderParser<ASSET = any, META_DATA = any, CONFIG = Record<string, any>> {
        extension?: ExtensionMetadata;
        /** A config to adjust the parser */
        config?: CONFIG;
        /** The name of the parser (this can be used when specifying loadParser in a ResolvedAsset) */
        name?: string;
        /**
         * each URL to load will be tested here,
         * if the test is passed the assets are loaded using the load function below.
         * Good place to test for things like file extensions!
         * @param url - The URL to test
         * @param resolvedAsset - Any custom additional information relevant to the asset being loaded
         * @param loader - The loader instance
         */
        test?: (url: string, resolvedAsset?: ResolvedAsset<META_DATA>, loader?: Loader) => boolean;
        /**
         * This is the promise that loads the URL provided
         * resolves with a loaded asset if returned by the parser.
         * @param url - The URL to load
         * @param resolvedAsset - Any custom additional information relevant to the asset being loaded
         * @param loader - The loader instance
         */
        load?: <T>(url: string, resolvedAsset?: ResolvedAsset<META_DATA>, loader?: Loader) => Promise<T>;
        /**
         * This function is used to test if the parse function should be run on the asset
         * If this returns true then parse is called with the asset
         * @param asset - The loaded asset data
         * @param resolvedAsset - Any custom additional information relevant to the asset being loaded
         * @param loader - The loader instance
         */
        testParse?: (asset: ASSET, resolvedAsset?: ResolvedAsset<META_DATA>, loader?: Loader) => Promise<boolean>;
        /**
         * Gets called on the asset it testParse passes. Useful to convert a raw asset into something more useful than
         * @param asset - The loaded asset data
         * @param resolvedAsset - Any custom additional information relevant to the asset being loaded
         * @param loader - The loader instance
         */
        parse?: <T>(asset: ASSET, resolvedAsset?: ResolvedAsset<META_DATA>, loader?: Loader) => Promise<T>;
        /**
         * If an asset is parsed using this parser, the unload function will be called when the user requests an asset
         * to be unloaded. This is useful for things like sounds or textures that can be unloaded from memory
         * @param asset - The asset to unload/destroy
         * @param resolvedAsset - Any custom additional information relevant to the asset being loaded
         * @param loader - The loader instance
         */
        unload?: (asset: ASSET, resolvedAsset?: ResolvedAsset<META_DATA>, loader?: Loader) => void;
    }
}
declare module "packages/assets/src/loader/parsers/loadJson" {
    import type { LoaderParser } from "packages/assets/src/loader/parsers/LoaderParser";
    /** simple loader plugin for loading json data */
    export const loadJson: LoaderParser<any, any, Record<string, any>>;
}
declare module "packages/assets/src/loader/parsers/loadTxt" {
    import type { LoaderParser } from "packages/assets/src/loader/parsers/LoaderParser";
    /** Simple loader plugin for loading text data */
    export const loadTxt: LoaderParser<any, any, Record<string, any>>;
}
declare module "packages/assets/src/loader/parsers/loadWebFont" {
    import type { LoaderParser } from "packages/assets/src/loader/parsers/LoaderParser";
    /**
     * Loader plugin for handling web fonts
     * @memberof PIXI
     */
    export type LoadFontData = {
        family: string;
        display: string;
        featureSettings: string;
        stretch: string;
        style: string;
        unicodeRange: string;
        variant: string;
        weights: string[];
    };
    /**
     * Return font face name from a file name
     * Ex.: 'fonts/tital-one.woff' turns into 'Titan One'
     * @param url - File url
     */
    export function getFontFamilyName(url: string): string;
    /** Web font loader plugin */
    export const loadWebFont: LoaderParser<FontFace | FontFace[], any, Record<string, any>>;
}
declare module "packages/assets/src/loader/parsers/WorkerManager" {
    class WorkerManagerClass {
        worker: Worker;
        private resolveHash;
        private readonly workerPool;
        private readonly queue;
        private _initialized;
        private _createdWorkers;
        private _isImageBitmapSupported?;
        constructor();
        isImageBitmapSupported(): Promise<boolean>;
        loadImageBitmap(src: string): Promise<ImageBitmap>;
        private _initWorkers;
        private getWorker;
        private returnWorker;
        private complete;
        private _run;
        private next;
    }
    const WorkerManager: WorkerManagerClass;
    export { WorkerManager, };
}
declare module "packages/assets/src/loader/parsers/textures/utils/createTexture" {
    import { Texture } from "packages/core/src/index";
    import type { BaseTexture } from "packages/core/src/index";
    import type { Loader } from "packages/assets/src/loader/Loader";
    export function createTexture(base: BaseTexture, loader: Loader, url: string): Texture<import("@pixi/core").Resource>;
}
declare module "packages/assets/src/loader/parsers/textures/loadTextures" {
    import type { IBaseTextureOptions, Texture } from "packages/core/src/index";
    import type { LoaderParser } from "packages/assets/src/loader/parsers/LoaderParser";
    /**
     * Configuration for the `loadTextures` loader plugin.
     * @memberof PIXI
     * @see PIXI.loadTextures
     */
    export interface LoadTextureConfig {
        /**
         * When set to `true`, loading and decoding images will happen with Worker thread,
         * if available on the browser. This is much more performant as network requests
         * and decoding can be expensive on the CPU. However, not all environments support
         * Workers, in some cases it can be helpful to disable by setting to `false`.
         * @default true
         */
        preferWorkers: boolean;
        /**
         * When set to `true`, loading and decoding images will happen with `createImageBitmap`,
         * otherwise it will use `new Image()`.
         * @default true
         */
        preferCreateImageBitmap: boolean;
        /**
         * The crossOrigin value to use for images when `preferCreateImageBitmap` is `false`.
         * @default 'anonymous'
         */
        crossOrigin: HTMLImageElement['crossOrigin'];
    }
    /**
     * Returns a promise that resolves an ImageBitmaps.
     * This function is designed to be used by a worker.
     * Part of WorkerManager!
     * @param url - The image to load an image bitmap for
     */
    export function loadImageBitmap(url: string): Promise<ImageBitmap>;
    /**
     * Loads our textures!
     * this makes use of imageBitmaps where available.
     * We load the ImageBitmap on a different thread using the WorkerManager
     * We can then use the ImageBitmap as a source for a Pixi Texture
     *
     * You can customize the behavior of this loader by setting the `config` property.
     * ```js
     * // Set the config
     * import { loadTextures } from '@pixi/assets';
     * loadTextures.config = {
     *    // If true we will use a worker to load the ImageBitmap
     *    preferWorkers: true,
     *    // If false we will use new Image() instead of createImageBitmap
     *    // If false then this will also disable the use of workers as it requires createImageBitmap
     *    preferCreateImageBitmap: true,
     *    crossOrigin: 'anonymous',
     * };
     * ```
     * @memberof PIXI
     */
    export const loadTextures: LoaderParser<Texture<import("@pixi/core").Resource>, IBaseTextureOptions<any>, LoadTextureConfig>;
}
declare module "packages/assets/src/loader/parsers/textures/loadSVG" {
    import type { IBaseTextureOptions, Texture } from "packages/core/src/index";
    import type { LoaderParser } from "packages/assets/src/loader/parsers/LoaderParser";
    /**
     * Loads SVG's into Textures.
     * @memberof PIXI
     */
    export const loadSVG: LoaderParser<string | Texture<import("@pixi/core").Resource>, IBaseTextureOptions<any>, Record<string, any>>;
}
declare module "packages/assets/src/loader/parsers/textures/loadVideo" {
    import type { IBaseTextureOptions, IVideoResourceOptions, Texture } from "packages/core/src/index";
    import type { LoaderParser } from "packages/assets/src/loader/parsers/LoaderParser";
    /**
     * Configuration for the `loadVideo` loader paarser.
     * @memberof PIXI
     * @see PIXI.loadVideo
     */
    export interface LoadVideoConfig {
        /**
         * When set to `true`, the video will start playing automatically after being loaded,
         * otherwise it will not start playing automatically.
         * @default true
         */
        defaultAutoPlay: boolean;
    }
    /**
     * Loads videos into Textures.
     * @memberof PIXI
     */
    export const loadVideo: LoaderParser<Texture<import("@pixi/core").Resource>, IBaseTextureOptions<IVideoResourceOptions>, LoadVideoConfig>;
}
declare module "packages/assets/src/loader/parsers/textures/utils/index" {
    export * from "packages/assets/src/loader/parsers/textures/utils/createTexture";
}
declare module "packages/assets/src/loader/parsers/textures/index" {
    export * from "packages/assets/src/loader/parsers/textures/loadSVG";
    export * from "packages/assets/src/loader/parsers/textures/loadTextures";
    export * from "packages/assets/src/loader/parsers/textures/loadVideo";
    export * from "packages/assets/src/loader/parsers/textures/utils/index";
}
declare module "packages/assets/src/loader/parsers/index" {
    export * from "packages/assets/src/loader/parsers/LoaderParser";
    export * from "packages/assets/src/loader/parsers/loadJson";
    export * from "packages/assets/src/loader/parsers/loadTxt";
    export * from "packages/assets/src/loader/parsers/loadWebFont";
    export * from "packages/assets/src/loader/parsers/textures/index";
}
declare module "packages/assets/src/loader/types" {
    import type { LoaderParser } from "packages/assets/src/loader/parsers/index";
    export interface PromiseAndParser {
        promise: Promise<any>;
        parser: LoaderParser;
    }
}
declare module "packages/assets/src/loader/Loader" {
    import type { ResolvedAsset } from "packages/assets/src/types";
    import type { LoaderParser } from "packages/assets/src/loader/parsers/LoaderParser";
    import type { PromiseAndParser } from "packages/assets/src/loader/types";
    /**
     * The Loader is responsible for loading all assets, such as images, spritesheets, audio files, etc.
     * It does not do anything clever with URLs - it just loads stuff!
     * Behind the scenes all things are cached using promises. This means it's impossible to load an asset more than once.
     * Through the use of LoaderParsers, the loader can understand how to load any kind of file!
     *
     * It is not intended that this class is created by developers - its part of the Asset class
     * This is the second major system of PixiJS' main Assets class
     * @memberof PIXI
     * @class AssetLoader
     */
    export class Loader {
        private _parsers;
        private _parserHash;
        private _parsersValidated;
        /** All loader parsers registered */
        parsers: LoaderParser<any, any, Record<string, any>>[];
        /** Cache loading promises that ae currently active */
        promiseCache: Record<string, PromiseAndParser>;
        /** function used for testing */
        reset(): void;
        /**
         * Used internally to generate a promise for the asset to be loaded.
         * @param url - The URL to be loaded
         * @param data - any custom additional information relevant to the asset being loaded
         * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
         */
        private _getLoadPromiseAndParser;
        /**
         * Loads one or more assets using the parsers added to the Loader.
         * @example
         * // Single asset:
         * const asset = await Loader.load('cool.png');
         * console.log(asset);
         *
         * // Multiple assets:
         * const assets = await Loader.load(['cool.png', 'cooler.png']);
         * console.log(assets);
         * @param assetsToLoadIn - urls that you want to load, or a single one!
         * @param onProgress - For multiple asset loading only, an optional function that is called
         * when progress on asset loading is made. The function is passed a single parameter, `progress`,
         * which represents the percentage (0.0 - 1.0) of the assets loaded. Do not use this function
         * to detect when assets are complete and available, instead use the Promise returned by this function.
         */
        load<T = any>(assetsToLoadIn: string | ResolvedAsset, onProgress?: (progress: number) => void): Promise<T>;
        load<T = any>(assetsToLoadIn: string[] | ResolvedAsset[], onProgress?: (progress: number) => void): Promise<Record<string, T>>;
        /**
         * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
         * The parser that created the asset, will be the one that unloads it.
         * @example
         * // Single asset:
         * const asset = await Loader.load('cool.png');
         *
         * await Loader.unload('cool.png');
         *
         * console.log(asset.destroyed); // true
         * @param assetsToUnloadIn - urls that you want to unload, or a single one!
         */
        unload(assetsToUnloadIn: string | string[] | ResolvedAsset | ResolvedAsset[]): Promise<void>;
        /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
        private _validateParsers;
    }
}
declare module "packages/assets/src/loader/index" {
    export type { Loader } from "packages/assets/src/loader/Loader";
    export * from "packages/assets/src/loader/parsers/index";
}
declare module "packages/assets/src/resolver/types" {
    import type { ExtensionMetadata } from "packages/core/src/index";
    import type { ResolvedAsset } from "packages/assets/src/types";
    /**
     * A prefer order lets the resolver know which assets to prefer depending on the various parameters passed to it.
     * @memberof PIXI
     */
    export interface PreferOrder {
        /** the importance order of the params */
        priority?: string[];
        params: {
            [key: string]: any;
        };
    }
    /**
     * Format for url parser, will test a string and if it pass will then parse it, turning it into an ResolvedAsset
     * @memberof PIXI
     */
    export interface ResolveURLParser {
        extension?: ExtensionMetadata;
        /** A config to adjust the parser */
        config?: Record<string, any>;
        /** the test to perform on the url to determine if it should be parsed */
        test: (url: string) => boolean;
        /** the function that will convert the url into an object */
        parse: (value: string) => ResolvedAsset;
    }
}
declare module "packages/assets/src/resolver/parsers/resolveTextureUrl" {
    import type { ResolveURLParser } from "packages/assets/src/resolver/types";
    export const resolveTextureUrl: ResolveURLParser;
}
declare module "packages/assets/src/resolver/parsers/index" {
    export * from "packages/assets/src/resolver/parsers/resolveTextureUrl";
}
declare module "packages/assets/src/resolver/Resolver" {
    import type { ArrayOr, AssetsBundle, AssetsManifest, AssetSrc, LoadParserName, ResolvedAsset, UnresolvedAsset } from "packages/assets/src/types";
    import type { PreferOrder, ResolveURLParser } from "packages/assets/src/resolver/types";
    export interface BundleIdentifierOptions {
        /** The character that is used to connect the bundleId and the assetId when generating a bundle asset id key */
        connector?: string;
        /**
         * A function that generates a bundle asset id key from a bundleId and an assetId
         * @param bundleId - the bundleId
         * @param assetId  - the assetId
         * @returns the bundle asset id key
         */
        createBundleAssetId?: (bundleId: string, assetId: string) => string;
        /**
         * A function that generates an assetId from a bundle asset id key. This is the reverse of generateBundleAssetId
         * @param bundleId - the bundleId
         * @param assetBundleId - the bundle asset id key
         * @returns the assetId
         */
        extractAssetIdFromBundle?: (bundleId: string, assetBundleId: string) => string;
    }
    /**
     * A class that is responsible for resolving mapping asset URLs to keys.
     * At its most basic it can be used for Aliases:
     *
     * ```js
     * resolver.add('foo', 'bar');
     * resolver.resolveUrl('foo') // => 'bar'
     * ```
     *
     * It can also be used to resolve the most appropriate asset for a given URL:
     *
     * ```js
     * resolver.prefer({
     *     params: {
     *         format: 'webp',
     *         resolution: 2,
     *     }
     * });
     *
     * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
     *
     * resolver.resolveUrl('foo') // => 'bar@2x.webp'
     * ```
     * Other features include:
     * - Ability to process a manifest file to get the correct understanding of how to resolve all assets
     * - Ability to add custom parsers for specific file types
     * - Ability to add custom prefer rules
     *
     * This class only cares about the URL, not the loading of the asset itself.
     *
     * It is not intended that this class is created by developers - its part of the Asset class
     * This is the third major system of PixiJS' main Assets class
     * @memberof PIXI
     */
    export class Resolver {
        private _defaultBundleIdentifierOptions;
        /** The character that is used to connect the bundleId and the assetId when generating a bundle asset id key */
        private _bundleIdConnector;
        /**
         * A function that generates a bundle asset id key from a bundleId and an assetId
         * @param bundleId - the bundleId
         * @param assetId  - the assetId
         * @returns the bundle asset id key
         */
        private _createBundleAssetId;
        /**
         * A function that generates an assetId from a bundle asset id key. This is the reverse of generateBundleAssetId
         * @param bundleId - the bundleId
         * @param assetBundleId - the bundle asset id key
         * @returns the assetId
         */
        private _extractAssetIdFromBundle;
        private _assetMap;
        private _preferredOrder;
        private _parsers;
        private _resolverHash;
        private _rootPath;
        private _basePath;
        private _manifest;
        private _bundles;
        private _defaultSearchParams;
        /**
         * Override how the resolver deals with generating bundle ids.
         * must be called before any bundles are added
         * @param bundleIdentifier - the bundle identifier options
         */
        setBundleIdentifier(bundleIdentifier: BundleIdentifierOptions): void;
        /**
         * Let the resolver know which assets you prefer to use when resolving assets.
         * Multiple prefer user defined rules can be added.
         * @example
         * resolver.prefer({
         *     // first look for something with the correct format, and then then correct resolution
         *     priority: ['format', 'resolution'],
         *     params:{
         *         format:'webp', // prefer webp images
         *         resolution: 2, // prefer a resolution of 2
         *     }
         * })
         * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
         * resolver.resolveUrl('foo') // => 'bar@2x.webp'
         * @param preferOrders - the prefer options
         */
        prefer(...preferOrders: PreferOrder[]): void;
        /**
         * Set the base path to prepend to all urls when resolving
         * @example
         * resolver.basePath = 'https://home.com/';
         * resolver.add('foo', 'bar.ong');
         * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
         * @param basePath - the base path to use
         */
        set basePath(basePath: string);
        get basePath(): string;
        /**
         * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
         * default value for browsers is `window.location.origin`
         * @example
         * // Application hosted on https://home.com/some-path/index.html
         * resolver.basePath = 'https://home.com/some-path/';
         * resolver.rootPath = 'https://home.com/';
         * resolver.add('foo', '/bar.png');
         * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
         * @param rootPath - the root path to use
         */
        set rootPath(rootPath: string);
        get rootPath(): string;
        /**
         * All the active URL parsers that help the parser to extract information and create
         * an asset object-based on parsing the URL itself.
         *
         * Can be added using the extensions API
         * @example
         * resolver.add('foo', [
         *     {
         *         resolution: 2,
         *         format: 'png',
         *         src: 'image@2x.png',
         *     },
         *     {
         *         resolution:1,
         *         format:'png',
         *         src: 'image.png',
         *     },
         * ]);
         *
         * // With a url parser the information such as resolution and file format could extracted from the url itself:
         * extensions.add({
         *     extension: ExtensionType.ResolveParser,
         *     test: loadTextures.test, // test if url ends in an image
         *     parse: (value: string) =>
         *     ({
         *         resolution: parseFloat(settings.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
         *         format: value.split('.').pop(),
         *         src: value,
         *     }),
         * });
         *
         * // Now resolution and format can be extracted from the url
         * resolver.add('foo', [
         *     'image@2x.png',
         *     'image.png',
         * ]);
         */
        get parsers(): ResolveURLParser[];
        /** Used for testing, this resets the resolver to its initial state */
        reset(): void;
        /**
         * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
         * @param searchParams - the default url parameters to append when resolving urls
         */
        setDefaultSearchParams(searchParams: string | Record<string, unknown>): void;
        /**
         * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
         * generally a manifest would be built using a tool.
         * @param manifest - the manifest to add to the resolver
         */
        addManifest(manifest: AssetsManifest): void;
        /**
         * This adds a bundle of assets in one go so that you can resolve them as a group.
         * For example you could add a bundle for each screen in you pixi app
         * @example
         * resolver.addBundle('animals', {
         *     bunny: 'bunny.png',
         *     chicken: 'chicken.png',
         *     thumper: 'thumper.png',
         * });
         *
         * const resolvedAssets = await resolver.resolveBundle('animals');
         * @param bundleId - The id of the bundle to add
         * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
         */
        addBundle(bundleId: string, assets: AssetsBundle['assets']): void;
        /**
         * Tells the resolver what keys are associated with witch asset.
         * The most important thing the resolver does
         * @example
         * // Single key, single asset:
         * resolver.add({alias: 'foo', src: 'bar.png');
         * resolver.resolveUrl('foo') // => 'bar.png'
         *
         * // Multiple keys, single asset:
         * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
         * resolver.resolveUrl('foo') // => 'bar.png'
         * resolver.resolveUrl('boo') // => 'bar.png'
         *
         * // Multiple keys, multiple assets:
         * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
         * resolver.resolveUrl('foo') // => 'bar.png'
         *
         * // Add custom data attached to the resolver
         * Resolver.add({
         *     alias: 'bunnyBooBooSmooth',
         *     src: 'bunny{png,webp}',
         *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
         * });
         *
         * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
         * @param aliases - the key or keys that you will reference when loading this asset
         * @param srcs - the asset or assets that will be chosen from when loading via the specified key
         * @param data - asset-specific data that will be passed to the loaders
         * - Useful if you want to initiate loaded objects with specific data
         * @param format - the format of the asset
         * @param loadParser - the name of the load parser to use
         */
        add(aliases: ArrayOr<string> | (ArrayOr<UnresolvedAsset>), srcs?: AssetSrc, data?: unknown, format?: string, loadParser?: LoadParserName): void;
        /**
         * If the resolver has had a manifest set via setManifest, this will return the assets urls for
         * a given bundleId or bundleIds.
         * @example
         * // Manifest Example
         * const manifest = {
         *     bundles: [
         *         {
         *             name: 'load-screen',
         *             assets: [
         *                 {
         *                     name: 'background',
         *                     srcs: 'sunset.png',
         *                 },
         *                 {
         *                     name: 'bar',
         *                     srcs: 'load-bar.{png,webp}',
         *                 },
         *             ],
         *         },
         *         {
         *             name: 'game-screen',
         *             assets: [
         *                 {
         *                     name: 'character',
         *                     srcs: 'robot.png',
         *                 },
         *                 {
         *                     name: 'enemy',
         *                     srcs: 'bad-guy.png',
         *                 },
         *             ],
         *         },
         *     ]
         * };
         *
         * resolver.setManifest(manifest);
         * const resolved = resolver.resolveBundle('load-screen');
         * @param bundleIds - The bundle ids to resolve
         * @returns All the bundles assets or a hash of assets for each bundle specified
         */
        resolveBundle(bundleIds: ArrayOr<string>): Record<string, ResolvedAsset> | Record<string, Record<string, ResolvedAsset>>;
        /**
         * Does exactly what resolve does, but returns just the URL rather than the whole asset object
         * @param key - The key or keys to resolve
         * @returns - The URLs associated with the key(s)
         */
        resolveUrl(key: ArrayOr<string>): string | Record<string, string>;
        /**
         * Resolves each key in the list to an asset object.
         * Another key function of the resolver! After adding all the various key/asset pairs. this will run the logic
         * of finding which asset to return based on any preferences set using the `prefer` function
         * by default the same key passed in will be returned if nothing is matched by the resolver.
         * @example
         * resolver.add('boo', 'bunny.png');
         *
         * resolver.resolve('boo') // => { src: 'bunny.png' }
         *
         * // Will return the same string as no key was added for this value..
         * resolver.resolve('another-thing.png') // => { src: 'another-thing.png' }
         * @param keys - key or keys to resolve
         * @returns - the resolve asset or a hash of resolve assets for each key specified
         */
        resolve(keys: string): ResolvedAsset;
        resolve(keys: string[]): Record<string, ResolvedAsset>;
        /**
         * Checks if an asset with a given key exists in the resolver
         * @param key - The key of the asset
         */
        hasKey(key: string): boolean;
        /**
         * Checks if a bundle with the given key exists in the resolver
         * @param key - The key of the bundle
         */
        hasBundle(key: string): boolean;
        /**
         * Internal function for figuring out what prefer criteria an asset should use.
         * @param assets
         */
        private _getPreferredOrder;
        /**
         * Appends the default url parameters to the url
         * @param url - The url to append the default parameters to
         * @returns - The url with the default parameters appended
         */
        private _appendDefaultSearchParams;
        private buildResolvedAsset;
    }
}
declare module "packages/assets/src/resolver/index" {
    export * from "packages/assets/src/resolver/parsers/index";
    export type { Resolver } from "packages/assets/src/resolver/Resolver";
    export * from "packages/assets/src/resolver/types";
}
declare module "packages/assets/src/AssetExtension" {
    import { ExtensionType } from "packages/core/src/index";
    import type { CacheParser } from "packages/assets/src/cache/index";
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    import type { LoaderParser } from "packages/assets/src/loader/index";
    import type { ResolveURLParser } from "packages/assets/src/resolver/index";
    /**
     * This developer convenience object allows developers to group
     * together the various asset parsers into a single object.
     * @memberof PIXI
     */
    interface AssetExtension<ASSET = any, META_DATA = any> {
        extension: ExtensionType.Asset;
        loader?: Partial<LoaderParser<ASSET, META_DATA>>;
        resolver?: Partial<ResolveURLParser>;
        cache?: Partial<CacheParser<ASSET>>;
        detection?: Partial<FormatDetectionParser>;
    }
    export type { AssetExtension };
}
declare module "packages/assets/src/BackgroundLoader" {
    import type { Loader } from "packages/assets/src/loader/Loader";
    import type { ResolvedAsset } from "packages/assets/src/types";
    /**
     * Quietly Loads assets in the background.
     * @memberof PIXI
     */
    export class BackgroundLoader {
        /** Whether or not the loader should continue loading. */
        private _isActive;
        /** Assets to load. */
        private readonly _assetList;
        /** Whether or not the loader is loading. */
        private _isLoading;
        /** Number of assets to load at a time. */
        private readonly _maxConcurrent;
        /** Should the loader log to the console. */
        verbose: boolean;
        private readonly _loader;
        /**
         * @param loader
         * @param verbose - should the loader log to the console
         */
        constructor(loader: Loader, verbose?: boolean);
        /**
         * Adds an array of assets to load.
         * @param assetUrls - assets to load
         */
        add(assetUrls: ResolvedAsset[]): void;
        /**
         * Loads the next set of assets. Will try to load as many assets as it can at the same time.
         *
         * The max assets it will try to load at one time will be 4.
         */
        private _next;
        /**
         * Activate/Deactivate the loading. If set to true then it will immediately continue to load the next asset.
         * @returns whether the class is active
         */
        get active(): boolean;
        set active(value: boolean);
    }
}
declare module "packages/assets/src/Assets" {
    import { Cache } from "packages/assets/src/cache/Cache";
    import { Loader } from "packages/assets/src/loader/Loader";
    import { Resolver } from "packages/assets/src/resolver/Resolver";
    import type { FormatDetectionParser } from "packages/assets/src/detections/index";
    import type { LoadTextureConfig } from "packages/assets/src/loader/parsers/index";
    import type { BundleIdentifierOptions } from "packages/assets/src/resolver/Resolver";
    import type { ArrayOr, AssetsBundle, AssetsManifest, LoadParserName, ResolvedAsset, UnresolvedAsset } from "packages/assets/src/types";
    export type ProgressCallback = (progress: number) => void;
    /**
     * Extensible preferences that can be used, for instance, when configuring loaders.
     * @since 7.2.0
     * @memberof PIXI
     */
    export interface AssetsPreferences extends LoadTextureConfig, GlobalMixins.AssetsPreferences {
    }
    /**
     * Initialization options object for Asset Class.
     * @memberof PIXI
     */
    export interface AssetInitOptions {
        /** a base path for any assets loaded */
        basePath?: string;
        /** a default URL parameter string to append to all assets loaded */
        defaultSearchParams?: string | Record<string, any>;
        /**
         * a manifest to tell the asset loader upfront what all your assets are
         * this can be the manifest object itself, or a URL to the manifest.
         */
        manifest?: string | AssetsManifest;
        /**
         * optional preferences for which textures preferences you have when resolving assets
         * for example you might set the resolution to 0.5 if the user is on a rubbish old phone
         * or you might set the resolution to 2 if the user is on a retina display
         */
        texturePreference?: {
            /** the resolution order you prefer, can be an array (priority order - first is prefered) or a single resolutions  */
            resolution?: number | number[];
            /**
             * the formats you prefer, by default this will be:
             * ['avif', 'webp', 'png', 'jpg', 'jpeg', 'webm', 'mp4', 'm4v', 'ogv']
             */
            format?: ArrayOr<string>;
        };
        /** advanced - override how bundlesIds are generated */
        bundleIdentifier?: BundleIdentifierOptions;
        /** Optional loader preferences */
        preferences?: Partial<AssetsPreferences>;
    }
    /**
     * A one stop shop for all Pixi resource management!
     * Super modern and easy to use, with enough flexibility to customize and do what you need!
     * @memberof PIXI
     * @namespace Assets
     *
     * Only one Asset Class exists accessed via the Global Asset object.
     *
     * It has four main responsibilities:
     * 1. Allows users to map URLs to keys and resolve them according to the user's browser capabilities
     * 2. Loads the resources and transforms them into assets that developers understand.
     * 3. Caches the assets and provides a way to access them.
     * 4. Allow developers to unload assets and clear the cache.
     *
     * It also has a few advanced features:
     * 1. Allows developers to provide a manifest upfront of all assets and help manage them via 'bundles'.
     * 2. Allows users to background load assets. Shortening (or eliminating) load times and improving UX. With this feature,
     * in-game loading bars can be a thing of the past!
     *
     * ### Assets Loading
     *
     * Do not be afraid to load things multiple times - under the hood, it will NEVER load anything more than once.
     *
     * For example:
     *
     * ```js
     * import { Assets } from 'pixi.js';
     *
     * promise1 = Assets.load('bunny.png')
     * promise2 = Assets.load('bunny.png')
     *
     * // promise1 === promise2
     * ```
     *
     * Here both promises will be the same. Once resolved... Forever resolved! It makes for really easy resource management!
     *
     * Out of the box it supports the following files:
     * - textures (avif, webp, png, jpg, gif, svg)
     * - sprite sheets (json)
     * - bitmap fonts (xml, fnt, txt)
     * - web fonts (ttf, woff, woff2)
     * - json files (json)
     * - text files (txt)
     *
     * More types can be added fairly easily by creating additional loader parsers.
     *
     * ### Textures
     * - Textures are loaded as ImageBitmap on a worker thread where possible.
     * Leading to much less janky load + parse times.
     * - By default, we will prefer to load AVIF and WebP image files if you specify them.
     * But if the browser doesn't support AVIF or WebP we will fall back to png and jpg.
     * - Textures can also be accessed via Texture.from(...) and now use this asset manager under the hood!
     * - Don't worry if you set preferences for textures that don't exist (for example you prefer 2x resolutions images
     *  but only 1x is available for that texture, the Asset manager will pick that up as a fallback automatically)
     *
     * #### Sprite sheets
     * - It's hard to know what resolution a sprite sheet is without loading it first, to address this
     * there is a naming convention we have added that will let Pixi understand the image format and resolution
     * of the spritesheet via its file name:
     *
     * `my-spritesheet{resolution}.{imageFormat}.json`
     *
     * For example:
     *
     * `my-spritesheet@2x.webp.json` // 2x resolution, WebP sprite sheet
     * `my-spritesheet@0.5x.png.json` // 0.5x resolution, png sprite sheet
     *
     * This is optional! You can just load a sprite sheet as normal.
     * This is only useful if you have a bunch of different res / formatted spritesheets.
     *
     * ### Fonts
     * Web fonts will be loaded with all weights.
     * It is possible to load only specific weights by doing the following:
     *
     * ```js
     * import { Assets } from 'pixi.js';
     *
     * // Load specific weights..
     * await Assets.load({
     *     data: {
     *         weights: ['normal'], // Only loads the weight
     *     },
     *     src: `outfit.woff2`,
     * });
     *
     * // Load everything...
     * await Assets.load(`outfit.woff2`);
     * ```
     *
     * ### Background Loading
     * Background loading will load stuff for you passively behind the scenes. To minimize jank,
     * it will only load one asset at a time. As soon as a developer calls `Assets.load(...)` the
     * background loader is paused and requested assets are loaded as a priority.
     * Don't worry if something is in there that's already loaded, it will just get skipped!
     *
     * You still need to call `Assets.load(...)` to get an asset that has been loaded in the background.
     * It's just that this promise will resolve instantly if the asset
     * has already been loaded.
     *
     * ### Manifest and Bundles
     * - Manifest is a JSON file that contains a list of all assets and their properties.
     * - Bundles are a way to group assets together.
     *
     * ```js
     * import { Assets } from 'pixi.js';
     *
     * // Manifest Example
     * const manifest = {
     *     bundles: [
     *         {
     *             name: 'load-screen',
     *             assets: [
     *                 {
     *                     name: 'background',
     *                     srcs: 'sunset.png',
     *                 },
     *                 {
     *                     name: 'bar',
     *                     srcs: 'load-bar.{png,webp}',
     *                 },
     *             ],
     *         },
     *         {
     *             name: 'game-screen',
     *             assets: [
     *                 {
     *                     name: 'character',
     *                     srcs: 'robot.png',
     *                 },
     *                 {
     *                     name: 'enemy',
     *                     srcs: 'bad-guy.png',
     *                 },
     *             ],
     *         },
     *     ]
     * };
     *
     * await Asset.init({ manifest });
     *
     * // Load a bundle...
     * loadScreenAssets = await Assets.loadBundle('load-screen');
     * // Load another bundle...
     * gameScreenAssets = await Assets.loadBundle('game-screen');
     * ```
     * @example
     * import { Assets } from 'pixi.js';
     *
     * const bunny = await Assets.load('bunny.png');
     */
    export class AssetsClass {
        /** the resolver to map various urls */
        resolver: Resolver;
        /**
         * The loader, loads stuff!
         * @type {PIXI.AssetLoader}
         */
        loader: Loader;
        /**
         * The global cache of all assets within PixiJS
         * @type {PIXI.Cache}
         */
        cache: typeof Cache;
        /** takes care of loading assets in the background */
        private readonly _backgroundLoader;
        private _detections;
        private _initialized;
        constructor();
        /**
         * Best practice is to call this function before any loading commences
         * Initiating is the best time to add any customization to the way things are loaded.
         *
         * you do not need to call this for the Asset class to work, only if you want to set any initial properties
         * @param options - options to initialize the Asset manager with
         */
        init(options?: AssetInitOptions): Promise<void>;
        /**
         * Allows you to specify how to resolve any assets load requests.
         * There are a few ways to add things here as shown below:
         * @example
         * import { Assets } from 'pixi.js';
         *
         * // Simple
         * Assets.add({alias: 'bunnyBooBoo', src: 'bunny.png'});
         * const bunny = await Assets.load('bunnyBooBoo');
         *
         * // Multiple keys:
         * Assets.add({alias: ['burger', 'chicken'], src: 'bunny.png'});
         *
         * const bunny = await Assets.load('burger');
         * const bunny2 = await Assets.load('chicken');
         *
         * // passing options to to the object
         * Assets.add({
         *     alias: 'bunnyBooBooSmooth',
         *     src: 'bunny{png,webp}',
         *     data: { scaleMode: SCALE_MODES.NEAREST }, // Base texture options
         * });
         *
         * // Multiple assets
         *
         * // The following all do the same thing:
         *
         * Assets.add({alias: 'bunnyBooBoo', src: 'bunny{png,webp}'});
         *
         * Assets.add({
         *     alias: 'bunnyBooBoo',
         *     src: [
         *         'bunny.png',
         *         'bunny.webp',
         *    ],
         * });
         *
         * const bunny = await Assets.load('bunnyBooBoo'); // Will try to load WebP if available
         * @param aliases - the key or keys that you will reference when loading this asset
         * @param srcs - the asset or assets that will be chosen from when loading via the specified key
         * @param data - asset-specific data that will be passed to the loaders
         * - Useful if you want to initiate loaded objects with specific data
         * @param format - the format of the asset
         * @param loadParser - the name of the load parser to use
         */
        add(aliases: ArrayOr<string> | (ArrayOr<UnresolvedAsset>), srcs?: string | string[], data?: unknown, format?: string, loadParser?: LoadParserName): void;
        /**
         * Loads your assets! You pass in a key or URL and it will return a promise that
         * resolves to the loaded asset. If multiple assets a requested, it will return a hash of assets.
         *
         * Don't worry about loading things multiple times, behind the scenes assets are only ever loaded
         * once and the same promise reused behind the scenes so you can safely call this function multiple
         * times with the same key and it will always return the same asset.
         * @example
         * import { Assets } from 'pixi.js';
         *
         * // Load a URL:
         * const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture
         *
         * Assets.add('thumper', 'bunny.png');
         * Assets.add('chicko', 'chicken.png');
         *
         * // Load multiple assets:
         * const textures = await Assets.load(['thumper', 'chicko']); // => {thumper: Texture, chicko: Texture}
         * @param urls - the urls to load
         * @param onProgress - optional function that is called when progress on asset loading is made.
         * The function is passed a single parameter, `progress`, which represents the percentage
         * (0.0 - 1.0) of the assets loaded.
         * @returns - the assets that were loaded, either a single asset or a hash of assets
         */
        load<T = any>(urls: string | UnresolvedAsset, onProgress?: ProgressCallback): Promise<T>;
        load<T = any>(urls: string[] | UnresolvedAsset[], onProgress?: ProgressCallback): Promise<Record<string, T>>;
        /**
         * This adds a bundle of assets in one go so that you can load them as a group.
         * For example you could add a bundle for each screen in you pixi app
         * @example
         * import { Assets } from 'pixi.js';
         *
         * Assets.addBundle('animals', {
         *     bunny: 'bunny.png',
         *     chicken: 'chicken.png',
         *     thumper: 'thumper.png',
         * });
         *
         * const assets = await Assets.loadBundle('animals');
         * @param bundleId - the id of the bundle to add
         * @param assets - a record of the asset or assets that will be chosen from when loading via the specified key
         */
        addBundle(bundleId: string, assets: AssetsBundle['assets']): void;
        /**
         * Bundles are a way to load multiple assets at once.
         * If a manifest has been provided to the init function then you can load a bundle, or bundles.
         * you can also add bundles via `addBundle`
         * @example
         * import { Assets } from 'pixi.js';
         *
         * // Manifest Example
         * const manifest = {
         *     bundles: [
         *         {
         *             name: 'load-screen',
         *             assets: [
         *                 {
         *                     name: 'background',
         *                     srcs: 'sunset.png',
         *                 },
         *                 {
         *                     name: 'bar',
         *                     srcs: 'load-bar.{png,webp}',
         *                 },
         *             ],
         *         },
         *         {
         *             name: 'game-screen',
         *             assets: [
         *                 {
         *                     name: 'character',
         *                     srcs: 'robot.png',
         *                 },
         *                 {
         *                     name: 'enemy',
         *                     srcs: 'bad-guy.png',
         *                 },
         *             ],
         *         },
         *     ]
         * };
         *
         * await Asset.init({ manifest });
         *
         * // Load a bundle...
         * loadScreenAssets = await Assets.loadBundle('load-screen');
         * // Load another bundle...
         * gameScreenAssets = await Assets.loadBundle('game-screen');
         * @param bundleIds - the bundle id or ids to load
         * @param onProgress - Optional function that is called when progress on asset loading is made.
         * The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0)
         * of the assets loaded. Do not use this function to detect when assets are complete and available,
         * instead use the Promise returned by this function.
         * @returns all the bundles assets or a hash of assets for each bundle specified
         */
        loadBundle(bundleIds: ArrayOr<string>, onProgress?: ProgressCallback): Promise<any>;
        /**
         * Initiate a background load of some assets. It will passively begin to load these assets in the background.
         * So when you actually come to loading them you will get a promise that resolves to the loaded assets immediately
         *
         * An example of this might be that you would background load game assets after your inital load.
         * then when you got to actually load your game screen assets when a player goes to the game - the loading
         * would already have stared or may even be complete, saving you having to show an interim load bar.
         * @example
         * import { Assets } from 'pixi.js';
         *
         * Assets.backgroundLoad('bunny.png');
         *
         * // later on in your app...
         * await Assets.loadBundle('bunny.png'); // Will resolve quicker as loading may have completed!
         * @param urls - the url / urls you want to background load
         */
        backgroundLoad(urls: ArrayOr<string>): Promise<void>;
        /**
         * Initiate a background of a bundle, works exactly like backgroundLoad but for bundles.
         * this can only be used if the loader has been initiated with a manifest
         * @example
         * import { Assets } from 'pixi.js';
         *
         * await Assets.init({
         *     manifest: {
         *         bundles: [
         *             {
         *                 name: 'load-screen',
         *                 assets: [...],
         *             },
         *             ...
         *         ],
         *     },
         * });
         *
         * Assets.backgroundLoadBundle('load-screen');
         *
         * // Later on in your app...
         * await Assets.loadBundle('load-screen'); // Will resolve quicker as loading may have completed!
         * @param bundleIds - the bundleId / bundleIds you want to background load
         */
        backgroundLoadBundle(bundleIds: ArrayOr<string>): Promise<void>;
        /**
         * Only intended for development purposes.
         * This will wipe the resolver and caches.
         * You will need to reinitialize the Asset
         */
        reset(): void;
        /**
         * Instantly gets an asset already loaded from the cache. If the asset has not yet been loaded,
         * it will return undefined. So it's on you! When in doubt just use `Assets.load` instead.
         * (Remember, the loader will never load things more than once!)
         * @param keys - The key or keys for the assets that you want to access
         * @returns - The assets or hash of assets requested
         */
        get<T = any>(keys: string): T;
        get<T = any>(keys: string[]): Record<string, T>;
        /**
         * helper function to map resolved assets back to loaded assets
         * @param resolveResults - the resolve results from the resolver
         * @param onProgress - the progress callback
         */
        private _mapLoadToResolve;
        /**
         * Unload an asset or assets. As the Assets class is responsible for creating the assets via the `load` function
         * this will make sure to destroy any assets and release them from memory.
         * Once unloaded, you will need to load the asset again.
         *
         * Use this to help manage assets if you find that you have a large app and you want to free up memory.
         *
         * - it's up to you as the developer to make sure that textures are not actively being used when you unload them,
         * Pixi won't break but you will end up with missing assets. Not a good look for the user!
         * @example
         * import { Assets } from 'pixi.js';
         *
         * // Load a URL:
         * const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture
         *
         * await Assets.unload('http://some.url.com/image.png')
         *
         * // myImageTexture will be destroyed now.
         *
         * // Unload multiple assets:
         * const textures = await Assets.unload(['thumper', 'chicko']);
         * @param urls - the urls to unload
         */
        unload(urls: ArrayOr<string> | ResolvedAsset | ResolvedAsset[]): Promise<void>;
        /**
         * Bundles are a way to manage multiple assets at once.
         * this will unload all files in a bundle.
         *
         * once a bundle has been unloaded, you need to load it again to have access to the assets.
         * @example
         * import { Assets } from 'pixi.js';
         *
         * Assets.addBundle({
         *     'thumper': 'http://some.url.com/thumper.png',
         * })
         *
         * const assets = await Assets.loadBundle('thumper');
         *
         * // Now to unload...
         *
         * await Assets.unloadBundle('thumper');
         *
         * // All assets in the assets object will now have been destroyed and purged from the cache
         * @param bundleIds - the bundle id or ids to unload
         */
        unloadBundle(bundleIds: ArrayOr<string>): Promise<void>;
        private _unloadFromResolved;
        /** All the detection parsers currently added to the Assets class. */
        get detections(): FormatDetectionParser[];
        /**
         * @deprecated since 7.2.0
         * @see {@link Assets.setPreferences}
         */
        get preferWorkers(): boolean;
        set preferWorkers(value: boolean);
        /**
         * General setter for preferences. This is a helper function to set preferences on all parsers.
         * @param preferences - the preferences to set
         */
        setPreferences(preferences: Partial<AssetsPreferences>): void;
    }
    export const Assets: AssetsClass;
}
declare module "packages/assets/src/index" {
    export * from "packages/assets/src/AssetExtension";
    export * from "packages/assets/src/Assets";
    export * from "packages/assets/src/cache/index";
    export * from "packages/assets/src/detections/index";
    export * from "packages/assets/src/loader/index";
    export * from "packages/assets/src/resolver/index";
    export * from "packages/assets/src/types";
    export * from "packages/assets/src/utils/index";
}
declare module "packages/compressed-textures/src/const" {
    /**
     * WebGL internal formats, including compressed texture formats provided by extensions
     * @memberof PIXI
     * @static
     * @name INTERNAL_FORMATS
     * @enum {number}
     */
    export enum INTERNAL_FORMATS {
        /**
         * @default 0x83F0
         */
        COMPRESSED_RGB_S3TC_DXT1_EXT = 33776,
        /**
         * @default 0x83F1
         */
        COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777,
        /**
         * @default 0x83F2
         */
        COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778,
        /**
         * @default 0x83F3
         */
        COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779,
        /**
         * @default 35917
         */
        COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917,
        /**
         * @default 35918
         */
        COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918,
        /**
         * @default 35919
         */
        COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919,
        /**
         * @default 35916
         */
        COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916,
        /**
         * @default 0x9270
         */
        COMPRESSED_R11_EAC = 37488,
        /**
         * @default 0x9271
         */
        COMPRESSED_SIGNED_R11_EAC = 37489,
        /**
         * @default 0x9272
         */
        COMPRESSED_RG11_EAC = 37490,
        /**
         * @default 0x9273
         */
        COMPRESSED_SIGNED_RG11_EAC = 37491,
        /**
         * @default 0x9274
         */
        COMPRESSED_RGB8_ETC2 = 37492,
        /**
         * @default 0x9278
         */
        COMPRESSED_RGBA8_ETC2_EAC = 37496,
        /**
         * @default 0x9275
         */
        COMPRESSED_SRGB8_ETC2 = 37493,
        /**
         * @default 0x9279
         */
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497,
        /**
         * @default 0x9276
         */
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494,
        /**
         * @default 0x9277
         */
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495,
        /**
         * @default 0x8C00
         */
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840,
        /**
         * @default 0x8C02
         */
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842,
        /**
         * @default 0x8C01
         */
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841,
        /**
         * @default 0x8C03
         */
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843,
        /**
         * @default 0x8D64
         */
        COMPRESSED_RGB_ETC1_WEBGL = 36196,
        /**
         * @default 0x8C92
         */
        COMPRESSED_RGB_ATC_WEBGL = 35986,
        /**
         * @default 0x8C92
         */
        COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986,
        /**
         * @default 0x87EE
         */
        COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798,
        /**
         * @default 0x93B0
         */
        COMPRESSED_RGBA_ASTC_4x4_KHR = 37808
    }
    /**
     * Maps the compressed texture formats in {@link PIXI.INTERNAL_FORMATS} to the number of bytes taken by
     * each texel.
     * @memberof PIXI
     * @static
     * @ignore
     */
    export const INTERNAL_FORMAT_TO_BYTES_PER_PIXEL: {
        [id: number]: number;
    };
}
declare module "packages/compressed-textures/src/loaders/compressedTextureExtensions" {
    /** Compressed texture extensions */
    export type CompressedTextureExtensions = {
        s3tc?: WEBGL_compressed_texture_s3tc;
        s3tc_sRGB: WEBGL_compressed_texture_s3tc_srgb;
        etc: any;
        etc1: any;
        pvrtc: any;
        atc: any;
        astc: WEBGL_compressed_texture_astc;
    };
    export type CompressedTextureExtensionRef = keyof CompressedTextureExtensions;
}
declare module "packages/compressed-textures/src/loaders/detectCompressedTextures" {
    import type { FormatDetectionParser } from "packages/assets/src/index";
    export const detectCompressedTextures: FormatDetectionParser;
}
declare module "packages/compressed-textures/src/resources/BlobResource" {
    import { BufferResource, ViewableBuffer } from "packages/core/src/index";
    import type { BufferType, IBufferResourceOptions } from "packages/core/src/index";
    /**
     * Constructor options for BlobResource.
     * @memberof PIXI
     */
    export interface IBlobResourceOptions extends IBufferResourceOptions {
        autoLoad?: boolean;
    }
    /**
     * Resource that fetches texture data over the network and stores it in a buffer.
     * @class
     * @extends PIXI.Resource
     * @memberof PIXI
     */
    export abstract class BlobResource extends BufferResource {
        /** The URL of the texture file. */
        protected origin: string | null;
        /** The viewable buffer on the data. */
        protected buffer: ViewableBuffer | null;
        protected loaded: boolean;
        /**
         * Promise when loading.
         * @default null
         */
        private _load;
        /**
         * @param source - The buffer/URL of the texture file.
         * @param {PIXI.IBlobResourceOptions} [options]
         * @param {boolean} [options.autoLoad=false] - Whether to fetch the data immediately;
         *  you can fetch it later via {@link PIXI.BlobResource#load}.
         * @param {number} [options.width=1] - The width in pixels.
         * @param {number} [options.height=1] - The height in pixels.
         * @param {1|2|4|8} [options.unpackAlignment=4] - The alignment of the pixel rows.
         */
        constructor(source: string | BufferType, options?: IBlobResourceOptions);
        protected onBlobLoaded(_data: ArrayBuffer): void;
        /** Loads the blob */
        load(): Promise<this>;
    }
}
declare module "packages/compressed-textures/src/resources/CompressedTextureResource" {
    import { BlobResource } from "packages/compressed-textures/src/resources/BlobResource";
    import type { BaseTexture, BufferType, GLTexture, Renderer } from "packages/core/src/index";
    import type { INTERNAL_FORMATS } from "packages/compressed-textures/src/const";
    /**
     * Used in parseKTX
     * @ignore
     */
    export type CompressedLevelBuffer = {
        levelID: number;
        levelWidth: number;
        levelHeight: number;
        levelBuffer: Uint8Array;
    };
    /**
     * @ignore
     */
    export interface ICompressedTextureResourceOptions {
        format: INTERNAL_FORMATS;
        width: number;
        height: number;
        levels?: number;
        levelBuffers?: CompressedLevelBuffer[];
    }
    /**
     * Resource for compressed texture formats, as follows: S3TC/DXTn (& their sRGB formats), ATC, ASTC, ETC 1/2, PVRTC.
     *
     * Compressed textures improve performance when rendering is texture-bound. The texture data stays compressed in
     * graphics memory, increasing memory locality and speeding up texture fetches. These formats can also be used to store
     * more detail in the same amount of memory.
     *
     * For most developers, container file formats are a better abstraction instead of directly handling raw texture
     * data. PixiJS provides native support for the following texture file formats
     * (via {@link PIXI.loadBasis}, {@link PIXI.loadKTX}, and {@link PIXI.loadDDS}):
     *
     * **.dds** - the DirectDraw Surface file format stores DXTn (DXT-1,3,5) data. See {@link PIXI.parseDDS}
     * **.ktx** - the Khronos Texture Container file format supports storing all the supported WebGL compression formats.
     *  See {@link PIXI.parseKTX}.
     * **.basis** - the BASIS supercompressed file format stores texture data in an internal format that is transcoded
     *  to the compression format supported on the device at _runtime_. It also supports transcoding into a uncompressed
     *  format as a fallback; you must install the `@pixi/basis-loader`, `@pixi/basis-transcoder` packages separately to
     *  use these files. See {@link PIXI.BasisParser}.
     *
     * The loaders for the aforementioned formats use `CompressedTextureResource` internally. It is strongly suggested that
     * they be used instead.
     *
     * ## Working directly with CompressedTextureResource
     *
     * Since `CompressedTextureResource` inherits `BlobResource`, you can provide it a URL pointing to a file containing
     * the raw texture data (with no file headers!):
     * @example
     * import { CompressedTextureResource, INTERNAL_FORMATS } from '@pixi/compressed-textures';
     * import { BaseTexture, Texture, ALPHA_MODES } from 'pixi.js';
     *
     * // The resource backing the texture data for your textures.
     * // NOTE: You can also provide a ArrayBufferView instead of a URL. This is used when loading data from a container file
     * //   format such as KTX, DDS, or BASIS.
     * const compressedResource = new CompressedTextureResource('bunny.dxt5', {
     *     format: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
     *     width: 256,
     *     height: 256,
     * });
     *
     * // You can create a base-texture to the cache, so that future `Texture`s can be created using the `Texture.from` API.
     * const baseTexture = new BaseTexture(compressedResource, { pmaMode: ALPHA_MODES.NPM });
     *
     * // Create a Texture to add to the TextureCache
     * const texture = new Texture(baseTexture);
     *
     * // Add baseTexture & texture to the global texture cache
     * BaseTexture.addToCache(baseTexture, 'bunny.dxt5');
     * Texture.addToCache(texture, 'bunny.dxt5');
     * @memberof PIXI
     */
    export class CompressedTextureResource extends BlobResource {
        /** The compression format */
        format: INTERNAL_FORMATS;
        /**
         * The number of mipmap levels stored in the resource buffer.
         * @default 1
         */
        levels: number;
        private _extension;
        private _levelBuffers;
        /**
         * @param source - the buffer/URL holding the compressed texture data
         * @param options
         * @param {PIXI.INTERNAL_FORMATS} options.format - the compression format
         * @param {number} options.width - the image width in pixels.
         * @param {number} options.height - the image height in pixels.
         * @param {number} [options.level=1] - the mipmap levels stored in the compressed texture, including level 0.
         * @param {number} [options.levelBuffers] - the buffers for each mipmap level. `CompressedTextureResource` can allows you
         *      to pass `null` for `source`, for cases where each level is stored in non-contiguous memory.
         */
        constructor(source: string | BufferType, options: ICompressedTextureResourceOptions);
        /**
         * @override
         * @param renderer - A reference to the current renderer
         * @param _texture - the texture
         * @param _glTexture - texture instance for this webgl context
         */
        upload(renderer: Renderer, _texture: BaseTexture, _glTexture: GLTexture): boolean;
        /** @protected */
        protected onBlobLoaded(): void;
        /**
         * Returns the key (to ContextSystem#extensions) for the WebGL extension supporting the compression format
         * @private
         * @param format - the compression format to get the extension for.
         */
        private static _formatToExtension;
        /**
         * Pre-creates buffer views for each mipmap level
         * @private
         * @param buffer -
         * @param format - compression formats
         * @param levels - mipmap levels
         * @param blockWidth -
         * @param blockHeight -
         * @param imageWidth - width of the image in pixels
         * @param imageHeight - height of the image in pixels
         */
        private static _createLevelBuffers;
    }
}
declare module "packages/compressed-textures/src/resources/index" {
    export * from "packages/compressed-textures/src/resources/BlobResource";
    export * from "packages/compressed-textures/src/resources/CompressedTextureResource";
}
declare module "packages/compressed-textures/src/parsers/parseDDS" {
    import { CompressedTextureResource } from "packages/compressed-textures/src/resources/index";
    /**
     * Parses the DDS file header, generates base-textures, and puts them into the texture cache.
     * @see https://docs.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
     * @param arrayBuffer
     * @memberof PIXI
     */
    export function parseDDS(arrayBuffer: ArrayBuffer): CompressedTextureResource[];
}
declare module "packages/compressed-textures/src/parsers/parseKTX" {
    import { BufferResource, FORMATS, TYPES } from "packages/core/src/index";
    import { CompressedTextureResource } from "packages/compressed-textures/src/resources/index";
    /**
     * Maps {@link PIXI.TYPES} to the bytes taken per component, excluding those ones that are bit-fields.
     * @ignore
     */
    export const TYPES_TO_BYTES_PER_COMPONENT: {
        [id: number]: number;
    };
    /**
     * Number of components in each {@link PIXI.FORMATS}
     * @ignore
     */
    export const FORMATS_TO_COMPONENTS: {
        [id: number]: number;
    };
    /**
     * Number of bytes per pixel in bit-field types in {@link PIXI.TYPES}
     * @ignore
     */
    export const TYPES_TO_BYTES_PER_PIXEL: {
        [id: number]: number;
    };
    export function parseKTX(url: string, arrayBuffer: ArrayBuffer, loadKeyValueData?: boolean): {
        compressed?: CompressedTextureResource[];
        uncompressed?: {
            resource: BufferResource;
            type: TYPES;
            format: FORMATS;
        }[];
        kvData: Map<string, DataView> | null;
    };
}
declare module "packages/compressed-textures/src/parsers/index" {
    export * from "packages/compressed-textures/src/parsers/parseDDS";
    export * from "packages/compressed-textures/src/parsers/parseKTX";
}
declare module "packages/compressed-textures/src/loaders/loadDDS" {
    import type { LoaderParser } from "packages/assets/src/index";
    /** Load our DDS textures! */
    export const loadDDS: LoaderParser;
}
declare module "packages/compressed-textures/src/loaders/loadKTX" {
    import type { LoaderParser } from "packages/assets/src/index";
    import type { IBaseTextureOptions, Texture } from "packages/core/src/index";
    /** Loads KTX textures! */
    export const loadKTX: LoaderParser<Texture<import("@pixi/core").Resource> | Texture<import("@pixi/core").Resource>[], IBaseTextureOptions<any>, Record<string, any>>;
}
declare module "packages/compressed-textures/src/loaders/resolveCompressedTextureUrl" {
    import type { ResolveURLParser } from "packages/assets/src/index";
    export const resolveCompressedTextureUrl: ResolveURLParser;
}
declare module "packages/compressed-textures/src/loaders/index" {
    export * from "packages/compressed-textures/src/loaders/compressedTextureExtensions";
    export * from "packages/compressed-textures/src/loaders/detectCompressedTextures";
    export * from "packages/compressed-textures/src/loaders/loadDDS";
    export * from "packages/compressed-textures/src/loaders/loadKTX";
    export * from "packages/compressed-textures/src/loaders/resolveCompressedTextureUrl";
}
declare module "packages/compressed-textures/src/index" {
    export * from "packages/compressed-textures/src/const";
    export * from "packages/compressed-textures/src/loaders/index";
    export * from "packages/compressed-textures/src/parsers/index";
    export * from "packages/compressed-textures/src/resources/index";
}
declare module "packages/extract/src/Extract" {
    import { Rectangle, RenderTexture } from "packages/core/src/index";
    import type { ExtensionMetadata, ICanvas, ISystem, Renderer } from "packages/core/src/index";
    import type { DisplayObject } from "packages/display/src/index";
    export interface IExtract {
        image(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<HTMLImageElement>;
        base64(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<string>;
        canvas(target?: DisplayObject | RenderTexture, frame?: Rectangle): ICanvas;
        pixels(target?: DisplayObject | RenderTexture, frame?: Rectangle): Uint8Array | Uint8ClampedArray;
    }
    /**
     * This class provides renderer-specific plugins for exporting content from a renderer.
     * For instance, these plugins can be used for saving an Image, Canvas element or for exporting the raw image data (pixels).
     *
     * Do not instantiate these plugins directly. It is available from the `renderer.extract` property.
     * @example
     * import { Application, Graphics } from 'pixi.js';
     *
     * // Create a new application (extract will be auto-added to renderer)
     * const app = new Application();
     *
     * // Draw a red circle
     * const graphics = new Graphics()
     *     .beginFill(0xFF0000)
     *     .drawCircle(0, 0, 50);
     *
     * // Render the graphics as an HTMLImageElement
     * const image = await app.renderer.extract.image(graphics);
     * document.body.appendChild(image);
     * @memberof PIXI
     */
    export class Extract implements ISystem, IExtract {
        /** @ignore */
        static extension: ExtensionMetadata;
        private renderer;
        /** Does the renderer have alpha and are its color channels stored premultipled by the alpha channel? */
        private _rendererPremultipliedAlpha;
        /**
         * @param renderer - A reference to the current renderer
         */
        constructor(renderer: Renderer);
        protected contextChange(): void;
        /**
         * Will return a HTML Image of the target
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param format - Image format, e.g. "image/jpeg" or "image/webp".
         * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
         * @param frame - The frame the extraction is restricted to.
         * @returns - HTML Image of the target
         */
        image(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<HTMLImageElement>;
        /**
         * Will return a base64 encoded string of this target. It works by calling
         *  `Extract.canvas` and then running toDataURL on that.
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param format - Image format, e.g. "image/jpeg" or "image/webp".
         * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
         * @param frame - The frame the extraction is restricted to.
         * @returns - A base64 encoded string of the texture.
         */
        base64(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<string>;
        /**
         * Creates a Canvas element, renders this target to it and then returns it.
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param frame - The frame the extraction is restricted to.
         * @returns - A Canvas element with the texture rendered on.
         */
        canvas(target?: DisplayObject | RenderTexture, frame?: Rectangle): ICanvas;
        /**
         * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
         * order, with integer values between 0 and 255 (included).
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param frame - The frame the extraction is restricted to.
         * @returns - One-dimensional array containing the pixel data of the entire texture
         */
        pixels(target?: DisplayObject | RenderTexture, frame?: Rectangle): Uint8Array;
        private _rawPixels;
        /** Destroys the extract. */
        destroy(): void;
        private static _flipY;
        private static _unpremultiplyAlpha;
    }
}
declare module "packages/extract/src/index" {
    export * from "packages/extract/src/Extract";
}
declare module "packages/graphics/src/styles/FillStyle" {
    import { Texture } from "packages/core/src/index";
    import type { Matrix } from "packages/core/src/index";
    /**
     * Fill style object for Graphics.
     * @memberof PIXI
     */
    export class FillStyle {
        /**
         * The hex color value used when coloring the Graphics object.
         * @default 0xFFFFFF
         */
        color: number;
        /** The alpha value used when filling the Graphics object. */
        alpha: number;
        /**
         * The texture to be used for the fill.
         * @default 0
         */
        texture: Texture;
        /**
         * The transform applied to the texture.
         * @default null
         */
        matrix: Matrix;
        /** If the current fill is visible. */
        visible: boolean;
        constructor();
        /** Clones the object */
        clone(): FillStyle;
        /** Reset */
        reset(): void;
        /** Destroy and don't use after this. */
        destroy(): void;
    }
}
declare module "packages/graphics/src/const" {
    /**
     * Supported line joints in `PIXI.LineStyle` for graphics.
     * @see PIXI.Graphics#lineStyle
     * @see https://graphicdesign.stackexchange.com/questions/59018/what-is-a-bevel-join-of-two-lines-exactly-illustrator
     * @memberof PIXI
     * @static
     * @enum {string}
     */
    export enum LINE_JOIN {
        /**
         * 'miter': make a sharp corner where outer part of lines meet
         * @default miter
         */
        MITER = "miter",
        /**
         * 'bevel': add a square butt at each end of line segment and fill the triangle at turn
         * @default bevel
         */
        BEVEL = "bevel",
        /**
         * 'round': add an arc at the joint
         * @default round
         */
        ROUND = "round"
    }
    /**
     * Support line caps in `PIXI.LineStyle` for graphics.
     * @see PIXI.Graphics#lineStyle
     * @memberof PIXI
     * @static
     * @enum {string}
     */
    export enum LINE_CAP {
        /**
         * 'butt': don't add any cap at line ends (leaves orthogonal edges)
         * @default butt
         */
        BUTT = "butt",
        /**
         * 'round': add semicircle at ends
         * @default round
         */
        ROUND = "round",
        /**
         * 'square': add square at end (like `BUTT` except more length at end)
         * @default square
         */
        SQUARE = "square"
    }
    /**
     * @memberof PIXI
     * @deprecated
     */
    export interface IGraphicsCurvesSettings {
        adaptive: boolean;
        maxLength: number;
        minSegments: number;
        maxSegments: number;
        epsilon: number;
        _segmentsCount(length: number, defaultSegments?: number): number;
    }
    /**
     * @private
     */
    export const curves: {
        adaptive: boolean;
        maxLength: number;
        minSegments: number;
        maxSegments: number;
        epsilon: number;
        _segmentsCount(length: number, defaultSegments?: number): number;
    };
    /**
     * @static
     * @readonly
     * @memberof PIXI
     * @name GRAPHICS_CURVES
     * @type {object}
     * @deprecated since 7.1.0
     * @see PIXI.Graphics.curves
     */
    export const GRAPHICS_CURVES: {
        adaptive: boolean;
        maxLength: number;
        minSegments: number;
        maxSegments: number;
        epsilon: number;
        _segmentsCount(length: number, defaultSegments?: number): number;
    };
}
declare module "packages/graphics/src/styles/LineStyle" {
    import { LINE_CAP, LINE_JOIN } from "packages/graphics/src/const";
    import { FillStyle } from "packages/graphics/src/styles/FillStyle";
    /**
     * Represents the line style for Graphics.
     * @memberof PIXI
     */
    export class LineStyle extends FillStyle {
        /** The width (thickness) of any lines drawn. */
        width: number;
        /** The alignment of any lines drawn (0.5 = middle, 1 = outer, 0 = inner). WebGL only. */
        alignment: number;
        /** If true the lines will be draw using LINES instead of TRIANGLE_STRIP. */
        native: boolean;
        /**
         * Line cap style.
         * @member {PIXI.LINE_CAP}
         * @default PIXI.LINE_CAP.BUTT
         */
        cap: LINE_CAP;
        /**
         * Line join style.
         * @member {PIXI.LINE_JOIN}
         * @default PIXI.LINE_JOIN.MITER
         */
        join: LINE_JOIN;
        /** Miter limit. */
        miterLimit: number;
        /** Clones the object. */
        clone(): LineStyle;
        /** Reset the line style to default. */
        reset(): void;
    }
}
declare module "packages/graphics/src/GraphicsData" {
    import type { IShape, Matrix, SHAPES } from "packages/core/src/index";
    import type { FillStyle } from "packages/graphics/src/styles/FillStyle";
    import type { LineStyle } from "packages/graphics/src/styles/LineStyle";
    /**
     * A class to contain data useful for Graphics objects
     * @memberof PIXI
     */
    export class GraphicsData {
        /**
         * The shape object to draw.
         * @member {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle}
         */
        shape: IShape;
        /** The style of the line. */
        lineStyle: LineStyle;
        /** The style of the fill. */
        fillStyle: FillStyle;
        /** The transform matrix. */
        matrix: Matrix;
        /** The type of the shape, see the Const.Shapes file for all the existing types, */
        type: SHAPES;
        /** The collection of points. */
        points: number[];
        /** The collection of holes. */
        holes: Array<GraphicsData>;
        /**
         * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
         * @param fillStyle - the width of the line to draw
         * @param lineStyle - the color of the line to draw
         * @param matrix - Transform matrix
         */
        constructor(shape: IShape, fillStyle?: FillStyle, lineStyle?: LineStyle, matrix?: Matrix);
        /**
         * Creates a new GraphicsData object with the same values as this one.
         * @returns - Cloned GraphicsData object
         */
        clone(): GraphicsData;
        /** Destroys the Graphics data. */
        destroy(): void;
    }
}
declare module "packages/graphics/src/GraphicsGeometry" {
    import { BatchDrawCall, BatchGeometry } from "packages/core/src/index";
    import { Bounds } from "packages/display/src/index";
    import { GraphicsData } from "packages/graphics/src/GraphicsData";
    import { BatchPart } from "packages/graphics/src/utils/index";
    import type { IPointData, IShape, Matrix, Texture } from "packages/core/src/index";
    import type { FillStyle } from "packages/graphics/src/styles/FillStyle";
    import type { LineStyle } from "packages/graphics/src/styles/LineStyle";
    /**
     * The Graphics class contains methods used to draw primitive shapes such as lines, circles and
     * rectangles to the display, and to color and fill them.
     *
     * GraphicsGeometry is designed to not be continually updating the geometry since it's expensive
     * to re-tesselate using **earcut**. Consider using {@link PIXI.Mesh} for this use-case, it's much faster.
     * @memberof PIXI
     */
    export class GraphicsGeometry extends BatchGeometry {
        /** The maximum number of points to consider an object "batchable", able to be batched by the renderer's batch system. */
        static BATCHABLE_SIZE: number;
        /** Minimal distance between points that are considered different. Affects line tesselation. */
        closePointEps: number;
        /** Padding to add to the bounds. */
        boundsPadding: number;
        uvsFloat32: Float32Array;
        indicesUint16: Uint16Array | Uint32Array;
        batchable: boolean;
        /** An array of points to draw, 2 numbers per point */
        points: number[];
        /** The collection of colors */
        colors: number[];
        /** The UVs collection */
        uvs: number[];
        /** The indices of the vertices */
        indices: number[];
        /** Reference to the texture IDs. */
        textureIds: number[];
        /**
         * The collection of drawn shapes.
         * @member {PIXI.GraphicsData[]}
         */
        graphicsData: Array<GraphicsData>;
        /**
         * List of current draw calls drived from the batches.
         * @member {PIXI.BatchDrawCall[]}
         */
        drawCalls: Array<BatchDrawCall>;
        /** Batches need to regenerated if the geometry is updated. */
        batchDirty: number;
        /**
         * Intermediate abstract format sent to batch system.
         * Can be converted to drawCalls or to batchable objects.
         * @member {PIXI.graphicsUtils.BatchPart[]}
         */
        batches: Array<BatchPart>;
        /** Used to detect if the graphics object has changed. */
        protected dirty: number;
        /** Used to check if the cache is dirty. */
        protected cacheDirty: number;
        /** Used to detect if we cleared the graphicsData. */
        protected clearDirty: number;
        /** Index of the last batched shape in the stack of calls. */
        protected shapeIndex: number;
        /** Cached bounds. */
        protected _bounds: Bounds;
        /** The bounds dirty flag. */
        protected boundsDirty: number;
        constructor();
        /**
         * Get the current bounds of the graphic geometry.
         *
         * Since 6.5.0, bounds of the graphics geometry are calculated based on the vertices of generated geometry.
         * Since shapes or strokes with full transparency (`alpha: 0`) will not generate geometry, they are not considered
         * when calculating bounds for the graphics geometry. See PR [#8343]{@link https://github.com/pixijs/pixijs/pull/8343}
         * and issue [#8623]{@link https://github.com/pixijs/pixijs/pull/8623}.
         * @readonly
         */
        get bounds(): Bounds;
        /** Call if you changed graphicsData manually. Empties all batch buffers. */
        protected invalidate(): void;
        /**
         * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
         * @returns - This GraphicsGeometry object. Good for chaining method calls
         */
        clear(): GraphicsGeometry;
        /**
         * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
         * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
         * @param fillStyle - Defines style of the fill.
         * @param lineStyle - Defines style of the lines.
         * @param matrix - Transform applied to the points of the shape.
         * @returns - Returns geometry for chaining.
         */
        drawShape(shape: IShape, fillStyle?: FillStyle, lineStyle?: LineStyle, matrix?: Matrix): GraphicsGeometry;
        /**
         * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
         * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
         * @param matrix - Transform applied to the points of the shape.
         * @returns - Returns geometry for chaining.
         */
        drawHole(shape: IShape, matrix?: Matrix): GraphicsGeometry;
        /** Destroys the GraphicsGeometry object. */
        destroy(): void;
        /**
         * Check to see if a point is contained within this geometry.
         * @param point - Point to check if it's contained.
         * @returns {boolean} `true` if the point is contained within geometry.
         */
        containsPoint(point: IPointData): boolean;
        /**
         * Generates intermediate batch data. Either gets converted to drawCalls
         * or used to convert to batch objects directly by the Graphics object.
         */
        updateBatches(): void;
        /**
         * Affinity check
         * @param styleA
         * @param styleB
         */
        protected _compareStyles(styleA: FillStyle | LineStyle, styleB: FillStyle | LineStyle): boolean;
        /** Test geometry for batching process. */
        protected validateBatching(): boolean;
        /** Offset the indices so that it works with the batcher. */
        protected packBatches(): void;
        /**
         * Checks to see if this graphics geometry can be batched.
         * Currently it needs to be small enough and not contain any native lines.
         */
        protected isBatchable(): boolean;
        /** Converts intermediate batches data to drawCalls. */
        protected buildDrawCalls(): void;
        /** Packs attributes to single buffer. */
        protected packAttributes(): void;
        /**
         * Process fill part of Graphics.
         * @param data
         */
        protected processFill(data: GraphicsData): void;
        /**
         * Process line part of Graphics.
         * @param data
         */
        protected processLine(data: GraphicsData): void;
        /**
         * Process the holes data.
         * @param holes
         */
        protected processHoles(holes: Array<GraphicsData>): void;
        /** Update the local bounds of the object. Expensive to use performance-wise. */
        protected calculateBounds(): void;
        /**
         * Transform points using matrix.
         * @param points - Points to transform
         * @param matrix - Transform matrix
         */
        protected transformPoints(points: Array<number>, matrix: Matrix): void;
        /**
         * Add colors.
         * @param colors - List of colors to add to
         * @param color - Color to add
         * @param alpha - Alpha to use
         * @param size - Number of colors to add
         * @param offset
         */
        protected addColors(colors: Array<number>, color: number, alpha: number, size: number, offset?: number): void;
        /**
         * Add texture id that the shader/fragment wants to use.
         * @param textureIds
         * @param id
         * @param size
         * @param offset
         */
        protected addTextureIds(textureIds: Array<number>, id: number, size: number, offset?: number): void;
        /**
         * Generates the UVs for a shape.
         * @param verts - Vertices
         * @param uvs - UVs
         * @param texture - Reference to Texture
         * @param start - Index buffer start index.
         * @param size - The size/length for index buffer.
         * @param matrix - Optional transform for all points.
         */
        protected addUvs(verts: Array<number>, uvs: Array<number>, texture: Texture, start: number, size: number, matrix?: Matrix): void;
        /**
         * Modify uvs array according to position of texture region
         * Does not work with rotated or trimmed textures
         * @param uvs - array
         * @param texture - region
         * @param start - starting index for uvs
         * @param size - how many points to adjust
         */
        protected adjustUvs(uvs: Array<number>, texture: Texture, start: number, size: number): void;
    }
}
declare module "packages/graphics/src/utils/IShapeBuildCommand" {
    import type { GraphicsData } from "packages/graphics/src/GraphicsData";
    import type { GraphicsGeometry } from "packages/graphics/src/GraphicsGeometry";
    export interface IShapeBuildCommand {
        build(graphicsData: GraphicsData): void;
        triangulate(graphicsData: GraphicsData, target: GraphicsGeometry): void;
    }
}
declare module "packages/graphics/src/utils/buildCircle" {
    import type { IShapeBuildCommand } from "packages/graphics/src/utils/IShapeBuildCommand";
    /**
     * Builds a circle to draw
     *
     * Ignored from docs since it is not directly exposed.
     * @ignore
     * @private
     * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object to draw
     * @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
     * @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
     */
    export const buildCircle: IShapeBuildCommand;
}
declare module "packages/graphics/src/utils/buildPoly" {
    import type { IShapeBuildCommand } from "packages/graphics/src/utils/IShapeBuildCommand";
    /**
     * Builds a polygon to draw
     *
     * Ignored from docs since it is not directly exposed.
     * @ignore
     * @private
     * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
     * @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
     * @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
     */
    export const buildPoly: IShapeBuildCommand;
}
declare module "packages/graphics/src/utils/buildRectangle" {
    import type { IShapeBuildCommand } from "packages/graphics/src/utils/IShapeBuildCommand";
    /**
     * Builds a rectangle to draw
     *
     * Ignored from docs since it is not directly exposed.
     * @ignore
     * @private
     * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
     * @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
     * @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
     */
    export const buildRectangle: IShapeBuildCommand;
}
declare module "packages/graphics/src/utils/buildRoundedRectangle" {
    import type { IShapeBuildCommand } from "packages/graphics/src/utils/IShapeBuildCommand";
    /**
     * Builds a rounded rectangle to draw
     *
     * Ignored from docs since it is not directly exposed.
     * @ignore
     * @private
     * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
     * @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
     * @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
     */
    export const buildRoundedRectangle: IShapeBuildCommand;
}
declare module "packages/graphics/src/utils/BatchPart" {
    import type { FillStyle } from "packages/graphics/src/styles/FillStyle";
    import type { LineStyle } from "packages/graphics/src/styles/LineStyle";
    /**
     * A structure to hold interim batch objects for Graphics.
     * @memberof PIXI.graphicsUtils
     */
    export class BatchPart {
        style: LineStyle | FillStyle;
        start: number;
        size: number;
        attribStart: number;
        attribSize: number;
        constructor();
        /**
         * Begin batch part.
         * @param style
         * @param startIndex
         * @param attribStart
         */
        begin(style: LineStyle | FillStyle, startIndex: number, attribStart: number): void;
        /**
         * End batch part.
         * @param endIndex
         * @param endAttrib
         */
        end(endIndex: number, endAttrib: number): void;
        reset(): void;
    }
}
declare module "packages/graphics/src/utils/ArcUtils" {
    interface IArcLikeShape {
        cx: number;
        cy: number;
        radius: number;
        startAngle: number;
        endAngle: number;
        anticlockwise: boolean;
    }
    /**
     * Utilities for arc curves.
     * @private
     */
    export class ArcUtils {
        /**
         * Calculate information of the arc for {@link PIXI.Graphics.arcTo}.
         * @private
         * @param x1 - The x-coordinate of the first control point of the arc
         * @param y1 - The y-coordinate of the first control point of the arc
         * @param x2 - The x-coordinate of the second control point of the arc
         * @param y2 - The y-coordinate of the second control point of the arc
         * @param radius - The radius of the arc
         * @param points - Collection of points to add to
         * @returns - If the arc length is valid, return center of circle, radius and other info otherwise `null`.
         */
        static curveTo(x1: number, y1: number, x2: number, y2: number, radius: number, points: Array<number>): IArcLikeShape;
        /**
         * The arc method creates an arc/curve (used to create circles, or parts of circles).
         * @private
         * @param _startX - Start x location of arc
         * @param _startY - Start y location of arc
         * @param cx - The x-coordinate of the center of the circle
         * @param cy - The y-coordinate of the center of the circle
         * @param radius - The radius of the circle
         * @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
         *  of the arc's circle)
         * @param endAngle - The ending angle, in radians
         * @param _anticlockwise - Specifies whether the drawing should be
         *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
         *  indicates counter-clockwise.
         * @param points - Collection of points to add to
         */
        static arc(_startX: number, _startY: number, cx: number, cy: number, radius: number, startAngle: number, endAngle: number, _anticlockwise: boolean, points: Array<number>): void;
    }
}
declare module "packages/graphics/src/utils/BezierUtils" {
    /**
     * Utilities for bezier curves
     * @private
     */
    export class BezierUtils {
        /**
         * Calculate length of bezier curve.
         * Analytical solution is impossible, since it involves an integral that does not integrate in general.
         * Therefore numerical solution is used.
         * @private
         * @param fromX - Starting point x
         * @param fromY - Starting point y
         * @param cpX - Control point x
         * @param cpY - Control point y
         * @param cpX2 - Second Control point x
         * @param cpY2 - Second Control point y
         * @param toX - Destination point x
         * @param toY - Destination point y
         * @returns - Length of bezier curve
         */
        static curveLength(fromX: number, fromY: number, cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): number;
        /**
         * Calculate the points for a bezier curve and then draws it.
         *
         * Ignored from docs since it is not directly exposed.
         * @ignore
         * @param cpX - Control point x
         * @param cpY - Control point y
         * @param cpX2 - Second Control point x
         * @param cpY2 - Second Control point y
         * @param toX - Destination point x
         * @param toY - Destination point y
         * @param points - Path array to push points into
         */
        static curveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number, points: Array<number>): void;
    }
}
declare module "packages/graphics/src/utils/buildLine" {
    import type { GraphicsData } from "packages/graphics/src/GraphicsData";
    import type { GraphicsGeometry } from "packages/graphics/src/GraphicsGeometry";
    /**
     * Builds a line to draw
     *
     * Ignored from docs since it is not directly exposed.
     * @ignore
     * @private
     * @param {PIXI.GraphicsData} graphicsData - The graphics object containing all the necessary properties
     * @param {PIXI.GraphicsGeometry} graphicsGeometry - Geometry where to append output
     */
    export function buildLine(graphicsData: GraphicsData, graphicsGeometry: GraphicsGeometry): void;
}
declare module "packages/graphics/src/utils/QuadraticUtils" {
    /**
     * Utilities for quadratic curves.
     * @private
     */
    export class QuadraticUtils {
        /**
         * Calculate length of quadratic curve
         * @see {@link http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/}
         * for the detailed explanation of math behind this.
         * @private
         * @param fromX - x-coordinate of curve start point
         * @param fromY - y-coordinate of curve start point
         * @param cpX - x-coordinate of curve control point
         * @param cpY - y-coordinate of curve control point
         * @param toX - x-coordinate of curve end point
         * @param toY - y-coordinate of curve end point
         * @returns - Length of quadratic curve
         */
        static curveLength(fromX: number, fromY: number, cpX: number, cpY: number, toX: number, toY: number): number;
        /**
         * Calculate the points for a quadratic bezier curve and then draws it.
         * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
         * @private
         * @param cpX - Control point x
         * @param cpY - Control point y
         * @param toX - Destination point x
         * @param toY - Destination point y
         * @param points - Points to add segments to.
         */
        static curveTo(cpX: number, cpY: number, toX: number, toY: number, points: Array<number>): void;
    }
}
declare module "packages/graphics/src/utils/index" {
    /**
     * Generalized convenience utilities for Graphics.
     * @namespace graphicsUtils
     * @memberof PIXI
     */
    import { SHAPES } from "packages/core/src/index";
    import type { BatchDrawCall } from "packages/core/src/index";
    import type { BatchPart } from "packages/graphics/src/utils/BatchPart";
    import type { IShapeBuildCommand } from "packages/graphics/src/utils/IShapeBuildCommand";
    export * from "packages/graphics/src/utils/ArcUtils";
    export * from "packages/graphics/src/utils/BatchPart";
    export * from "packages/graphics/src/utils/BezierUtils";
    export * from "packages/graphics/src/utils/buildCircle";
    export * from "packages/graphics/src/utils/buildLine";
    export * from "packages/graphics/src/utils/buildPoly";
    export * from "packages/graphics/src/utils/buildRectangle";
    export * from "packages/graphics/src/utils/buildRoundedRectangle";
    export * from "packages/graphics/src/utils/QuadraticUtils";
    /**
     * Map of fill commands for each shape type.
     * @memberof PIXI.graphicsUtils
     * @member {object} FILL_COMMANDS
     */
    export const FILL_COMMANDS: Record<SHAPES, IShapeBuildCommand>;
    /**
     * Batch pool, stores unused batches for preventing allocations.
     * @memberof PIXI.graphicsUtils
     * @member {Array<PIXI.graphicsUtils.BatchPart>} BATCH_POOL
     */
    export const BATCH_POOL: Array<BatchPart>;
    /**
     * Draw call pool, stores unused draw calls for preventing allocations.
     * @memberof PIXI.graphicsUtils
     * @member {Array<PIXI.BatchDrawCall>} DRAW_CALL_POOL
     */
    export const DRAW_CALL_POOL: Array<BatchDrawCall>;
}
declare module "packages/graphics/src/Graphics" {
    import { BLEND_MODES, Color, Matrix, Point, Polygon, Shader, Texture } from "packages/core/src/index";
    import { Container } from "packages/display/src/index";
    import { LINE_CAP, LINE_JOIN } from "packages/graphics/src/const";
    import { GraphicsGeometry } from "packages/graphics/src/GraphicsGeometry";
    import { FillStyle } from "packages/graphics/src/styles/FillStyle";
    import { LineStyle } from "packages/graphics/src/styles/LineStyle";
    import type { BatchDrawCall, ColorSource, IPointData, IShape, Renderer } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    /**
     * Batch element computed from Graphics geometry.
     * @memberof PIXI
     */
    export interface IGraphicsBatchElement {
        vertexData: Float32Array;
        blendMode: BLEND_MODES;
        indices: Uint16Array | Uint32Array;
        uvs: Float32Array;
        alpha: number;
        worldAlpha: number;
        _batchRGB: number[];
        _tintRGB: number;
        _texture: Texture;
    }
    export interface IFillStyleOptions {
        color?: ColorSource;
        alpha?: number;
        texture?: Texture;
        matrix?: Matrix;
    }
    export interface ILineStyleOptions extends IFillStyleOptions {
        width?: number;
        alignment?: number;
        native?: boolean;
        cap?: LINE_CAP;
        join?: LINE_JOIN;
        miterLimit?: number;
    }
    export interface Graphics extends GlobalMixins.Graphics, Container {
    }
    /**
     * The Graphics class is primarily used to render primitive shapes such as lines, circles and
     * rectangles to the display, and to color and fill them.  However, you can also use a Graphics
     * object to build a list of primitives to use as a mask, or as a complex hitArea.
     *
     * Please note that due to legacy naming conventions, the behavior of some functions in this class
     * can be confusing.  Each call to `drawRect()`, `drawPolygon()`, etc. actually stores that primitive
     * in the Geometry class's GraphicsGeometry object for later use in rendering or hit testing - the
     * functions do not directly draw anything to the screen.  Similarly, the `clear()` function doesn't
     * change the screen, it simply resets the list of primitives, which can be useful if you want to
     * rebuild the contents of an existing Graphics object.
     *
     * Once a GraphicsGeometry list is built, you can re-use it in other Geometry objects as
     * an optimization, by passing it into a new Geometry object's constructor.  Because of this
     * ability, it's important to call `destroy()` on Geometry objects once you are done with them, to
     * properly dereference each GraphicsGeometry and prevent memory leaks.
     * @memberof PIXI
     */
    export class Graphics extends Container {
        /**
         * Graphics curves resolution settings. If `adaptive` flag is set to `true`,
         * the resolution is calculated based on the curve's length to ensure better visual quality.
         * Adaptive draw works with `bezierCurveTo` and `quadraticCurveTo`.
         * @static
         * @property {boolean} [adaptive=true] - flag indicating if the resolution should be adaptive
         * @property {number} [maxLength=10] - maximal length of a single segment of the curve (if adaptive = false, ignored)
         * @property {number} [minSegments=8] - minimal number of segments in the curve (if adaptive = false, ignored)
         * @property {number} [maxSegments=2048] - maximal number of segments in the curve (if adaptive = false, ignored)
         * @property {number} [epsilon=0.0001] - precision of the curve fitting
         */
        static readonly curves: {
            adaptive: boolean;
            maxLength: number;
            minSegments: number;
            maxSegments: number;
            epsilon: number;
            _segmentsCount(length: number, defaultSegments?: number): number;
        };
        /**
         * Temporary point to use for containsPoint.
         * @private
         */
        static _TEMP_POINT: Point;
        /**
         * Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
         * Can be shared between multiple Graphics objects.
         */
        shader: Shader;
        /** Renderer plugin for batching */
        pluginName: string;
        /**
         * Current path
         * @readonly
         */
        currentPath: Polygon;
        /** A collections of batches! These can be drawn by the renderer batch system. */
        protected batches: Array<IGraphicsBatchElement>;
        /** Update dirty for limiting calculating tints for batches. */
        protected batchTint: number;
        /** Update dirty for limiting calculating batches.*/
        protected batchDirty: number;
        /** Copy of the object vertex data. */
        protected vertexData: Float32Array;
        /** Current fill style. */
        protected _fillStyle: FillStyle;
        /** Current line style. */
        protected _lineStyle: LineStyle;
        /** Current shape transform matrix. */
        protected _matrix: Matrix;
        /** Current hole mode is enabled. */
        protected _holeMode: boolean;
        protected _transformID: number;
        protected _tintColor: Color;
        /**
         * Represents the WebGL state the Graphics required to render, excludes shader and geometry. E.g.,
         * blend mode, culling, depth testing, direction of rendering triangles, backface, etc.
         */
        private state;
        private _geometry;
        /**
         * Includes vertex positions, face indices, normals, colors, UVs, and
         * custom attributes within buffers, reducing the cost of passing all
         * this data to the GPU. Can be shared between multiple Mesh or Graphics objects.
         * @readonly
         */
        get geometry(): GraphicsGeometry;
        /**
         * @param geometry - Geometry to use, if omitted will create a new GraphicsGeometry instance.
         */
        constructor(geometry?: GraphicsGeometry);
        /**
         * Creates a new Graphics object with the same values as this one.
         * Note that only the geometry of the object is cloned, not its transform (position,scale,etc)
         * @returns - A clone of the graphics object
         */
        clone(): Graphics;
        /**
         * The blend mode to be applied to the graphic shape. Apply a value of
         * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
         * primitive in the GraphicsGeometry list is rendered sequentially, modes
         * such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
         * be applied per-primitive.
         * @default PIXI.BLEND_MODES.NORMAL
         */
        set blendMode(value: BLEND_MODES);
        get blendMode(): BLEND_MODES;
        /**
         * The tint applied to each graphic shape. This is a hex value. A value of
         * 0xFFFFFF will remove any tint effect.
         * @default 0xFFFFFF
         */
        get tint(): ColorSource;
        set tint(value: ColorSource);
        /**
         * The current fill style.
         * @readonly
         */
        get fill(): FillStyle;
        /**
         * The current line style.
         * @readonly
         */
        get line(): LineStyle;
        /**
         * Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
         * method or the drawCircle() method.
         * @param [width=0] - width of the line to draw, will update the objects stored style
         * @param [color=0x0] - color of the line to draw, will update the objects stored style
         * @param [alpha=1] - alpha of the line to draw, will update the objects stored style
         * @param [alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
         *        WebGL only.
         * @param [native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
         * @returns - This Graphics object. Good for chaining method calls
         */
        lineStyle(width: number, color?: ColorSource, alpha?: number, alignment?: number, native?: boolean): this;
        /**
         * Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
         * method or the drawCircle() method.
         * @param options - Line style options
         * @param {number} [options.width=0] - width of the line to draw, will update the objects stored style
         * @param {PIXI.ColorSource} [options.color=0x0] - color of the line to draw, will update the objects stored style
         * @param {number} [options.alpha] - alpha of the line to draw, will update the objects stored style
         * @param {number} [options.alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
         *        WebGL only.
         * @param {boolean} [options.native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
         * @param {PIXI.LINE_CAP}[options.cap=PIXI.LINE_CAP.BUTT] - line cap style
         * @param {PIXI.LINE_JOIN}[options.join=PIXI.LINE_JOIN.MITER] - line join style
         * @param {number}[options.miterLimit=10] - miter limit ratio
         * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */
        lineStyle(options?: ILineStyleOptions): this;
        /**
         * Like line style but support texture for line fill.
         * @param [options] - Collection of options for setting line style.
         * @param {number} [options.width=0] - width of the line to draw, will update the objects stored style
         * @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to use
         * @param {PIXI.ColorSource} [options.color=0x0] - color of the line to draw, will update the objects stored style.
         *  Default 0xFFFFFF if texture present.
         * @param {number} [options.alpha=1] - alpha of the line to draw, will update the objects stored style
         * @param {PIXI.Matrix} [options.matrix=null] - Texture matrix to transform texture
         * @param {number} [options.alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
         *        WebGL only.
         * @param {boolean} [options.native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
         * @param {PIXI.LINE_CAP}[options.cap=PIXI.LINE_CAP.BUTT] - line cap style
         * @param {PIXI.LINE_JOIN}[options.join=PIXI.LINE_JOIN.MITER] - line join style
         * @param {number}[options.miterLimit=10] - miter limit ratio
         * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */
        lineTextureStyle(options?: ILineStyleOptions): this;
        /**
         * Start a polygon object internally.
         * @protected
         */
        protected startPoly(): void;
        /**
         * Finish the polygon object.
         * @protected
         */
        finishPoly(): void;
        /**
         * Moves the current drawing position to x, y.
         * @param x - the X coordinate to move to
         * @param y - the Y coordinate to move to
         * @returns - This Graphics object. Good for chaining method calls
         */
        moveTo(x: number, y: number): this;
        /**
         * Draws a line using the current line style from the current drawing position to (x, y);
         * The current drawing position is then set to (x, y).
         * @param x - the X coordinate to draw to
         * @param y - the Y coordinate to draw to
         * @returns - This Graphics object. Good for chaining method calls
         */
        lineTo(x: number, y: number): this;
        /**
         * Initialize the curve
         * @param x
         * @param y
         */
        protected _initCurve(x?: number, y?: number): void;
        /**
         * Calculate the points for a quadratic bezier curve and then draws it.
         * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
         * @param cpX - Control point x
         * @param cpY - Control point y
         * @param toX - Destination point x
         * @param toY - Destination point y
         * @returns - This Graphics object. Good for chaining method calls
         */
        quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): this;
        /**
         * Calculate the points for a bezier curve and then draws it.
         * @param cpX - Control point x
         * @param cpY - Control point y
         * @param cpX2 - Second Control point x
         * @param cpY2 - Second Control point y
         * @param toX - Destination point x
         * @param toY - Destination point y
         * @returns This Graphics object. Good for chaining method calls
         */
        bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): this;
        /**
         * The `arcTo` method creates an arc/curve between two tangents on the canvas.
         * The first tangent is from the start point to the first control point,
         * and the second tangent is from the first control point to the second control point.
         * Note that the second control point is not necessarily the end point of the arc.
         *
         * "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
         * @param x1 - The x-coordinate of the first control point of the arc
         * @param y1 - The y-coordinate of the first control point of the arc
         * @param x2 - The x-coordinate of the second control point of the arc
         * @param y2 - The y-coordinate of the second control point of the arc
         * @param radius - The radius of the arc
         * @returns - This Graphics object. Good for chaining method calls
         */
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
        /**
         * The arc method creates an arc/curve (used to create circles, or parts of circles).
         * @param cx - The x-coordinate of the center of the circle
         * @param cy - The y-coordinate of the center of the circle
         * @param radius - The radius of the circle
         * @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
         *  of the arc's circle)
         * @param endAngle - The ending angle, in radians
         * @param anticlockwise - Specifies whether the drawing should be
         *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
         *  indicates counter-clockwise.
         * @returns - This Graphics object. Good for chaining method calls
         */
        arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
        /**
         * Specifies a simple one-color fill that subsequent calls to other Graphics methods
         * (such as lineTo() or drawCircle()) use when drawing.
         * @param {PIXI.ColorSource} color - the color of the fill
         * @param alpha - the alpha of the fill, will override the color's alpha
         * @returns - This Graphics object. Suitable for chaining method calls
         */
        beginFill(color?: ColorSource, alpha?: number): this;
        /**
         * Normalize the color input from options for line style or fill
         * @param {PIXI.IFillStyleOptions} options - Fill style object.
         */
        private normalizeColor;
        /**
         * Begin the texture fill.
         * Note: The wrap mode of the texture is forced to REPEAT on render.
         * @param options - Fill style object.
         * @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to fill
         * @param {PIXI.ColorSource} [options.color=0xffffff] - Background to fill behind texture
         * @param {number} [options.alpha] - Alpha of fill, overrides the color's alpha
         * @param {PIXI.Matrix} [options.matrix=null] - Transform matrix
         * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
         */
        beginTextureFill(options?: IFillStyleOptions): this;
        /**
         * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
         * @returns - This Graphics object. Good for chaining method calls
         */
        endFill(): this;
        /**
         * Draws a rectangle shape.
         * @param x - The X coord of the top-left of the rectangle
         * @param y - The Y coord of the top-left of the rectangle
         * @param width - The width of the rectangle
         * @param height - The height of the rectangle
         * @returns - This Graphics object. Good for chaining method calls
         */
        drawRect(x: number, y: number, width: number, height: number): this;
        /**
         * Draw a rectangle shape with rounded/beveled corners.
         * @param x - The X coord of the top-left of the rectangle
         * @param y - The Y coord of the top-left of the rectangle
         * @param width - The width of the rectangle
         * @param height - The height of the rectangle
         * @param radius - Radius of the rectangle corners
         * @returns - This Graphics object. Good for chaining method calls
         */
        drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): this;
        /**
         * Draws a circle.
         * @param x - The X coordinate of the center of the circle
         * @param y - The Y coordinate of the center of the circle
         * @param radius - The radius of the circle
         * @returns - This Graphics object. Good for chaining method calls
         */
        drawCircle(x: number, y: number, radius: number): this;
        /**
         * Draws an ellipse.
         * @param x - The X coordinate of the center of the ellipse
         * @param y - The Y coordinate of the center of the ellipse
         * @param width - The half width of the ellipse
         * @param height - The half height of the ellipse
         * @returns - This Graphics object. Good for chaining method calls
         */
        drawEllipse(x: number, y: number, width: number, height: number): this;
        drawPolygon(...path: Array<number> | Array<IPointData>): this;
        drawPolygon(path: Array<number> | Array<IPointData> | Polygon): this;
        /**
         * Draw any shape.
         * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - Shape to draw
         * @returns - This Graphics object. Good for chaining method calls
         */
        drawShape(shape: IShape): this;
        /**
         * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
         * @returns - This Graphics object. Good for chaining method calls
         */
        clear(): this;
        /**
         * True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
         * masked with gl.scissor.
         * @returns - True if only 1 rect.
         */
        isFastRect(): boolean;
        /**
         * Renders the object using the WebGL renderer
         * @param renderer - The renderer
         */
        protected _render(renderer: Renderer): void;
        /** Populating batches for rendering. */
        protected _populateBatches(): void;
        /**
         * Renders the batches using the BathedRenderer plugin
         * @param renderer - The renderer
         */
        protected _renderBatched(renderer: Renderer): void;
        /**
         * Renders the graphics direct
         * @param renderer - The renderer
         */
        protected _renderDirect(renderer: Renderer): void;
        /**
         * Renders specific DrawCall
         * @param renderer
         * @param drawCall
         */
        protected _renderDrawCallDirect(renderer: Renderer, drawCall: BatchDrawCall): void;
        /**
         * Resolves shader for direct rendering
         * @param renderer - The renderer
         */
        protected _resolveDirectShader(renderer: Renderer): Shader;
        /**
         * Retrieves the bounds of the graphic shape as a rectangle object.
         * @see PIXI.GraphicsGeometry#bounds
         */
        protected _calculateBounds(): void;
        /**
         * Tests if a point is inside this graphics object
         * @param point - the point to test
         * @returns - the result of the test
         */
        containsPoint(point: IPointData): boolean;
        /** Recalculate the tint by applying tint to batches using Graphics tint. */
        protected calculateTints(): void;
        /** If there's a transform update or a change to the shape of the geometry, recalculate the vertices. */
        protected calculateVertices(): void;
        /**
         * Closes the current path.
         * @returns - Returns itself.
         */
        closePath(): this;
        /**
         * Apply a matrix to the positional data.
         * @param matrix - Matrix to use for transform current shape.
         * @returns - Returns itself.
         */
        setMatrix(matrix: Matrix): this;
        /**
         * Begin adding holes to the last draw shape
         * IMPORTANT: holes must be fully inside a shape to work
         * Also weirdness ensues if holes overlap!
         * Ellipses, Circles, Rectangles and Rounded Rectangles cannot be holes or host for holes in CanvasRenderer,
         * please use `moveTo` `lineTo`, `quadraticCurveTo` if you rely on pixi-legacy bundle.
         * @returns - Returns itself.
         */
        beginHole(): this;
        /**
         * End adding holes to the last draw shape.
         * @returns - Returns itself.
         */
        endHole(): this;
        /**
         * Destroys the Graphics object.
         * @param options - Options parameter. A boolean will act as if all
         *  options have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have
         *  their destroy method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
         *  Should it destroy the texture of the child sprite
         * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
         *  Should it destroy the base texture of the child sprite
         */
        destroy(options?: IDestroyOptions | boolean): void;
    }
}
declare module "packages/graphics/src/index" {
    import { ArcUtils, BatchPart, BezierUtils, buildLine, QuadraticUtils } from "packages/graphics/src/utils/index";
    import type { SHAPES } from "packages/core/src/index";
    import type { BatchDrawCall } from "packages/core/src/index";
    import type { IShapeBuildCommand } from "packages/graphics/src/utils/IShapeBuildCommand";
    export * from "packages/graphics/src/const";
    export * from "packages/graphics/src/Graphics";
    export * from "packages/graphics/src/GraphicsData";
    export * from "packages/graphics/src/GraphicsGeometry";
    export * from "packages/graphics/src/styles/FillStyle";
    export * from "packages/graphics/src/styles/LineStyle";
    export const graphicsUtils: {
        buildPoly: IShapeBuildCommand;
        buildCircle: IShapeBuildCommand;
        buildRectangle: IShapeBuildCommand;
        buildRoundedRectangle: IShapeBuildCommand;
        buildLine: typeof buildLine;
        ArcUtils: typeof ArcUtils;
        BezierUtils: typeof BezierUtils;
        QuadraticUtils: typeof QuadraticUtils;
        BatchPart: typeof BatchPart;
        FILL_COMMANDS: Record<SHAPES, IShapeBuildCommand>;
        BATCH_POOL: BatchPart[];
        DRAW_CALL_POOL: BatchDrawCall[];
    };
}
declare module "packages/mesh/src/MeshBatchUvs" {
    import type { Buffer, TextureMatrix } from "packages/core/src/index";
    /**
     * Class controls cache for UV mapping from Texture normal space to BaseTexture normal space.
     * @memberof PIXI
     */
    export class MeshBatchUvs {
        /** UV Buffer data. */
        readonly data: Float32Array;
        /** Buffer with normalized UV's. */
        uvBuffer: Buffer;
        /** Material UV matrix. */
        uvMatrix: TextureMatrix;
        private _bufferUpdateId;
        private _textureUpdateId;
        _updateID: number;
        /**
         * @param uvBuffer - Buffer with normalized uv's
         * @param uvMatrix - Material UV matrix
         */
        constructor(uvBuffer: Buffer, uvMatrix: TextureMatrix);
        /**
         * Updates
         * @param forceUpdate - force the update
         */
        update(forceUpdate?: boolean): void;
    }
}
declare module "packages/mesh/src/MeshMaterial" {
    import { Program, Shader, TextureMatrix } from "packages/core/src/index";
    import type { ColorSource, Texture, utils } from "packages/core/src/index";
    export interface IMeshMaterialOptions {
        alpha?: number;
        tint?: ColorSource;
        pluginName?: string;
        program?: Program;
        uniforms?: utils.Dict<unknown>;
    }
    export interface MeshMaterial extends GlobalMixins.MeshMaterial {
    }
    /**
     * Slightly opinionated default shader for PixiJS 2D objects.
     * @memberof PIXI
     */
    export class MeshMaterial extends Shader {
        /**
         * TextureMatrix instance for this Mesh, used to track Texture changes.
         * @readonly
         */
        readonly uvMatrix: TextureMatrix;
        /**
         * `true` if shader can be batch with the renderer's batch system.
         * @default true
         */
        batchable: boolean;
        /**
         * Renderer plugin for batching.
         * @default 'batch'
         */
        pluginName: string;
        _tintRGB: number;
        /**
         * Only do update if tint or alpha changes.
         * @private
         * @default false
         */
        private _colorDirty;
        private _alpha;
        private _tintColor;
        /**
         * @param uSampler - Texture that material uses to render.
         * @param options - Additional options
         * @param {number} [options.alpha=1] - Default alpha.
         * @param {PIXI.ColorSource} [options.tint=0xFFFFFF] - Default tint.
         * @param {string} [options.pluginName='batch'] - Renderer plugin for batching.
         * @param {PIXI.Program} [options.program=0xFFFFFF] - Custom program.
         * @param {object} [options.uniforms] - Custom uniforms.
         */
        constructor(uSampler: Texture, options?: IMeshMaterialOptions);
        /** Reference to the texture being rendered. */
        get texture(): Texture;
        set texture(value: Texture);
        /**
         * This gets automatically set by the object using this.
         * @default 1
         */
        set alpha(value: number);
        get alpha(): number;
        /**
         * Multiply tint for the material.
         * @default 0xFFFFFF
         */
        set tint(value: ColorSource);
        get tint(): ColorSource;
        /**
         * Get the internal number from tint color
         * @ignore
         */
        get tintValue(): number;
        /** Gets called automatically by the Mesh. Intended to be overridden for custom {@link PIXI.MeshMaterial} objects. */
        update(): void;
    }
}
declare module "packages/mesh/src/Mesh" {
    import { DRAW_MODES, State } from "packages/core/src/index";
    import { Container } from "packages/display/src/index";
    import type { BLEND_MODES, Buffer, ColorSource, Geometry, IPointData, Renderer, Shader, Texture } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    import type { MeshMaterial } from "packages/mesh/src/MeshMaterial";
    export interface Mesh extends GlobalMixins.Mesh {
    }
    /**
     * Base mesh class.
     *
     * This class empowers you to have maximum flexibility to render any kind of WebGL visuals you can think of.
     * This class assumes a certain level of WebGL knowledge.
     * If you know a bit this should abstract enough away to make your life easier!
     *
     * Pretty much ALL WebGL can be broken down into the following:
     * - Geometry - The structure and data for the mesh. This can include anything from positions, uvs, normals, colors etc..
     * - Shader - This is the shader that PixiJS will render the geometry with (attributes in the shader must match the geometry)
     * - State - This is the state of WebGL required to render the mesh.
     *
     * Through a combination of the above elements you can render anything you want, 2D or 3D!
     * @memberof PIXI
     */
    export class Mesh<T extends Shader = MeshMaterial> extends Container {
        /**
         * Used by the @pixi/canvas-mesh package to draw meshes using canvas.
         * Added here because we cannot mixin a static property to Mesh type.
         * @ignore
         */
        static defaultCanvasPadding: number;
        /**
         * Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
         * Can be shared between multiple Mesh objects.
         * @type {PIXI.Shader|PIXI.MeshMaterial}
         */
        shader: T;
        /**
         * Represents the WebGL state the Mesh required to render, excludes shader and geometry. E.g.,
         * blend mode, culling, depth testing, direction of rendering triangles, backface, etc.
         */
        state: State;
        /** The way the Mesh should be drawn, can be any of the {@link PIXI.DRAW_MODES} constants. */
        drawMode: DRAW_MODES;
        /**
         * Typically the index of the IndexBuffer where to start drawing.
         * @default 0
         */
        start: number;
        /**
         * How much of the geometry to draw, by default `0` renders everything.
         * @default 0
         */
        size: number;
        private _geometry;
        /** This is the caching layer used by the batcher. */
        private vertexData;
        /** If geometry is changed used to decide to re-transform the vertexData. */
        private vertexDirty;
        private _transformID;
        /** Internal roundPixels field. */
        private _roundPixels;
        /** Batched UV's are cached for atlas textures. */
        private batchUvs;
        /**
         * These are used as easy access for batching.
         * @private
         */
        uvs: Float32Array;
        /**
         * These are used as easy access for batching.
         * @private
         */
        indices: Uint16Array;
        _tintRGB: number;
        _texture: Texture;
        /**
         * @param geometry - The geometry the mesh will use.
         * @param {PIXI.MeshMaterial} shader - The shader the mesh will use.
         * @param state - The state that the WebGL context is required to be in to render the mesh
         *        if no state is provided, uses {@link PIXI.State.for2d} to create a 2D state for PixiJS.
         * @param drawMode - The drawMode, can be any of the {@link PIXI.DRAW_MODES} constants.
         */
        constructor(geometry: Geometry, shader: T, state?: State, drawMode?: DRAW_MODES);
        /**
         * Includes vertex positions, face indices, normals, colors, UVs, and
         * custom attributes within buffers, reducing the cost of passing all
         * this data to the GPU. Can be shared between multiple Mesh objects.
         */
        get geometry(): Geometry;
        set geometry(value: Geometry);
        /**
         * To change mesh uv's, change its uvBuffer data and increment its _updateID.
         * @readonly
         */
        get uvBuffer(): Buffer;
        /**
         * To change mesh vertices, change its uvBuffer data and increment its _updateID.
         * Incrementing _updateID is optional because most of Mesh objects do it anyway.
         * @readonly
         */
        get verticesBuffer(): Buffer;
        /** Alias for {@link PIXI.Mesh#shader}. */
        set material(value: T);
        get material(): T;
        /**
         * The blend mode to be applied to the Mesh. Apply a value of
         * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
         * @default PIXI.BLEND_MODES.NORMAL;
         */
        set blendMode(value: BLEND_MODES);
        get blendMode(): BLEND_MODES;
        /**
         * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Advantages can include sharper image quality (like text) and faster rendering on canvas.
         * The main disadvantage is movement of objects may appear less smooth.
         * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
         * @default false
         */
        set roundPixels(value: boolean);
        get roundPixels(): boolean;
        /**
         * The multiply tint applied to the Mesh. This is a hex value. A value of
         * `0xFFFFFF` will remove any tint effect.
         *
         * Null for non-MeshMaterial shaders
         * @default 0xFFFFFF
         */
        get tint(): ColorSource;
        set tint(value: ColorSource);
        /**
         * The tint color as a RGB integer
         * @ignore
         */
        get tintValue(): number;
        /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
        get texture(): Texture;
        set texture(value: Texture);
        /**
         * Standard renderer draw.
         * @param renderer - Instance to renderer.
         */
        protected _render(renderer: Renderer): void;
        /**
         * Standard non-batching way of rendering.
         * @param renderer - Instance to renderer.
         */
        protected _renderDefault(renderer: Renderer): void;
        /**
         * Rendering by using the Batch system.
         * @param renderer - Instance to renderer.
         */
        protected _renderToBatch(renderer: Renderer): void;
        /** Updates vertexData field based on transform and vertices. */
        calculateVertices(): void;
        /** Updates uv field based on from geometry uv's or batchUvs. */
        calculateUvs(): void;
        /**
         * Updates the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
         * there must be a aVertexPosition attribute present in the geometry for bounds to be calculated correctly.
         */
        protected _calculateBounds(): void;
        /**
         * Tests if a point is inside this mesh. Works only for PIXI.DRAW_MODES.TRIANGLES.
         * @param point - The point to test.
         * @returns - The result of the test.
         */
        containsPoint(point: IPointData): boolean;
        destroy(options?: IDestroyOptions | boolean): void;
        /** The maximum number of vertices to consider batchable. Generally, the complexity of the geometry. */
        static BATCHABLE_SIZE: number;
    }
}
declare module "packages/mesh/src/MeshGeometry" {
    import { Geometry } from "packages/core/src/index";
    import type { IArrayBuffer } from "packages/core/src/index";
    /**
     * Standard 2D geometry used in PixiJS.
     *
     * Geometry can be defined without passing in a style or data if required.
     * @example
     * import { Geometry } from 'pixi.js';
     *
     * const geometry = new Geometry();
     *
     * geometry.addAttribute('positions', [0, 0, 100, 0, 100, 100, 0, 100], 2);
     * geometry.addAttribute('uvs', [0, 0, 1, 0, 1, 1, 0, 1], 2);
     * geometry.addIndex([0, 1, 2, 1, 3, 2]);
     * @memberof PIXI
     */
    export class MeshGeometry extends Geometry {
        /**
         * Dirty flag to limit update calls on Mesh. For example,
         * limiting updates on a single Mesh instance with a shared Geometry
         * within the render loop.
         * @private
         * @default -1
         */
        _updateId: number;
        /**
         * @param {Float32Array|number[]} [vertices] - Positional data on geometry.
         * @param {Float32Array|number[]} [uvs] - Texture UVs.
         * @param {Uint16Array|number[]} [index] - IndexBuffer
         */
        constructor(vertices?: IArrayBuffer, uvs?: IArrayBuffer, index?: IArrayBuffer);
        /**
         * If the vertex position is updated.
         * @readonly
         * @private
         */
        get vertexDirtyId(): number;
    }
}
declare module "packages/mesh/src/index" {
    export * from "packages/mesh/src/Mesh";
    export * from "packages/mesh/src/MeshBatchUvs";
    export * from "packages/mesh/src/MeshGeometry";
    export * from "packages/mesh/src/MeshMaterial";
}
declare module "packages/mesh-extras/src/geometry/PlaneGeometry" {
    import { MeshGeometry } from "packages/mesh/src/index";
    /**
     * @memberof PIXI
     */
    export class PlaneGeometry extends MeshGeometry {
        segWidth: number;
        segHeight: number;
        width: number;
        height: number;
        /**
         * @param width - The width of the plane.
         * @param height - The height of the plane.
         * @param segWidth - Number of horizontal segments.
         * @param segHeight - Number of vertical segments.
         */
        constructor(width?: number, height?: number, segWidth?: number, segHeight?: number);
        /**
         * Refreshes plane coordinates
         * @private
         */
        build(): void;
    }
}
declare module "packages/mesh-extras/src/geometry/RopeGeometry" {
    import { MeshGeometry } from "packages/mesh/src/index";
    import type { IPoint } from "packages/core/src/index";
    /**
     * RopeGeometry allows you to draw a geometry across several points and then manipulate these points.
     * @example
     * import { Point, RopeGeometry } from 'pixi.js';
     *
     * for (let i = 0; i < 20; i++) {
     *     points.push(new Point(i * 50, 0));
     * };
     * const rope = new RopeGeometry(100, points);
     * @memberof PIXI
     */
    export class RopeGeometry extends MeshGeometry {
        /** An array of points that determine the rope. */
        points: IPoint[];
        /** Rope texture scale, if zero then the rope texture is stretched. */
        readonly textureScale: number;
        /**
         * The width (i.e., thickness) of the rope.
         * @readonly
         */
        _width: number;
        /**
         * @param width - The width (i.e., thickness) of the rope.
         * @param points - An array of {@link PIXI.Point} objects to construct this rope.
         * @param textureScale - By default the rope texture will be stretched to match
         *     rope length. If textureScale is positive this value will be treated as a scaling
         *     factor and the texture will preserve its aspect ratio instead. To create a tiling rope
         *     set baseTexture.wrapMode to {@link PIXI.WRAP_MODES.REPEAT} and use a power of two texture,
         *     then set textureScale=1 to keep the original texture pixel size.
         *     In order to reduce alpha channel artifacts provide a larger texture and downsample -
         *     i.e. set textureScale=0.5 to scale it down twice.
         */
        constructor(width: number, points: IPoint[], textureScale?: number);
        /**
         * The width (i.e., thickness) of the rope.
         * @readonly
         */
        get width(): number;
        /** Refreshes Rope indices and uvs */
        private build;
        /** refreshes vertices of Rope mesh */
        updateVertices(): void;
        update(): void;
    }
}
declare module "packages/mesh-extras/src/SimplePlane" {
    import { Texture } from "packages/core/src/index";
    import { Mesh } from "packages/mesh/src/index";
    import type { Renderer } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    /**
     * The SimplePlane allows you to draw a texture across several points and then manipulate these points
     * @example
     * import { Point, SimplePlane, Texture } from 'pixi.js';
     *
     * for (let i = 0; i < 20; i++) {
     *     points.push(new Point(i * 50, 0));
     * }
     * const SimplePlane = new SimplePlane(Texture.from('snake.png'), points);
     * @memberof PIXI
     */
    export class SimplePlane extends Mesh {
        /** The geometry is automatically updated when the texture size changes. */
        autoResize: boolean;
        protected _textureID: number;
        /**
         * @param texture - The texture to use on the SimplePlane.
         * @param verticesX - The number of vertices in the x-axis
         * @param verticesY - The number of vertices in the y-axis
         */
        constructor(texture: Texture, verticesX?: number, verticesY?: number);
        /**
         * Method used for overrides, to do something in case texture frame was changed.
         * Meshes based on plane can override it and change more details based on texture.
         */
        textureUpdated(): void;
        set texture(value: Texture);
        get texture(): Texture;
        _render(renderer: Renderer): void;
        destroy(options?: IDestroyOptions | boolean): void;
    }
}
declare module "packages/mesh-extras/src/NineSlicePlane" {
    import { Texture } from "packages/core/src/index";
    import { SimplePlane } from "packages/mesh-extras/src/SimplePlane";
    import type { ITypedArray } from "packages/core/src/index";
    export interface NineSlicePlane extends GlobalMixins.NineSlicePlane {
    }
    /**
     * The NineSlicePlane allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
     * for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically
     *
     * <pre>
     *      A                          B
     *    +---+----------------------+---+
     *  C | 1 |          2           | 3 |
     *    +---+----------------------+---+
     *    |   |                      |   |
     *    | 4 |          5           | 6 |
     *    |   |                      |   |
     *    +---+----------------------+---+
     *  D | 7 |          8           | 9 |
     *    +---+----------------------+---+
     *  When changing this objects width and/or height:
     *     areas 1 3 7 and 9 will remain unscaled.
     *     areas 2 and 8 will be stretched horizontally
     *     areas 4 and 6 will be stretched vertically
     *     area 5 will be stretched both horizontally and vertically
     * </pre>
     * @example
     * import { NineSlicePlane, Texture } from 'pixi.js';
     *
     * const plane9 = new NineSlicePlane(Texture.from('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
     * @memberof PIXI
     */
    export class NineSlicePlane extends SimplePlane {
        private _origWidth;
        private _origHeight;
        /**
         * The width of the left column (a).
         * @private
         */
        _leftWidth: number;
        /**
         * The width of the right column (b)
         * @private
         */
        _rightWidth: number;
        /**
         * The height of the top row (c)
         * @private
         */
        _topHeight: number;
        /**
         * The height of the bottom row (d)
         * @private
         */
        _bottomHeight: number;
        /**
         * @param texture - The texture to use on the NineSlicePlane.
         * @param {number} [leftWidth=10] - size of the left vertical bar (A)
         * @param {number} [topHeight=10] - size of the top horizontal bar (C)
         * @param {number} [rightWidth=10] - size of the right vertical bar (B)
         * @param {number} [bottomHeight=10] - size of the bottom horizontal bar (D)
         */
        constructor(texture: Texture, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number);
        textureUpdated(): void;
        get vertices(): ITypedArray;
        set vertices(value: ITypedArray);
        /** Updates the horizontal vertices. */
        updateHorizontalVertices(): void;
        /** Updates the vertical vertices. */
        updateVerticalVertices(): void;
        /**
         * Returns the smaller of a set of vertical and horizontal scale of nine slice corners.
         * @returns Smaller number of vertical and horizontal scale.
         */
        private _getMinScale;
        /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
        get width(): number;
        set width(value: number);
        /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
        get height(): number;
        set height(value: number);
        /** The width of the left column. */
        get leftWidth(): number;
        set leftWidth(value: number);
        /** The width of the right column. */
        get rightWidth(): number;
        set rightWidth(value: number);
        /** The height of the top row. */
        get topHeight(): number;
        set topHeight(value: number);
        /** The height of the bottom row. */
        get bottomHeight(): number;
        set bottomHeight(value: number);
        /** Refreshes NineSlicePlane coords. All of them. */
        private _refresh;
    }
}
declare module "packages/mesh-extras/src/SimpleMesh" {
    import { Texture } from "packages/core/src/index";
    import { Mesh } from "packages/mesh/src/index";
    import type { DRAW_MODES, IArrayBuffer, ITypedArray, Renderer } from "packages/core/src/index";
    /**
     * The Simple Mesh class mimics Mesh in PixiJS v4, providing easy-to-use constructor arguments.
     * For more robust customization, use {@link PIXI.Mesh}.
     * @memberof PIXI
     */
    export class SimpleMesh extends Mesh {
        /** Upload vertices buffer each frame. */
        autoUpdate: boolean;
        /**
         * @param texture - The texture to use
         * @param {Float32Array} [vertices] - if you want to specify the vertices
         * @param {Float32Array} [uvs] - if you want to specify the uvs
         * @param {Uint16Array} [indices] - if you want to specify the indices
         * @param drawMode - the drawMode, can be any of the Mesh.DRAW_MODES consts
         */
        constructor(texture?: Texture, vertices?: IArrayBuffer, uvs?: IArrayBuffer, indices?: IArrayBuffer, drawMode?: DRAW_MODES);
        /**
         * Collection of vertices data.
         * @type {Float32Array}
         */
        get vertices(): ITypedArray;
        set vertices(value: ITypedArray);
        _render(renderer: Renderer): void;
    }
}
declare module "packages/mesh-extras/src/SimpleRope" {
    import { Mesh } from "packages/mesh/src/index";
    import type { IPoint, Renderer, Texture } from "packages/core/src/index";
    /**
     * The rope allows you to draw a texture across several points and then manipulate these points
     * @example
     * import { Point, SimpleRope, Texture } from 'pixi.js';
     *
     * for (let i = 0; i < 20; i++) {
     *     points.push(new Point(i * 50, 0));
     * };
     * const rope = new SimpleRope(Texture.from('snake.png'), points);
     * @memberof PIXI
     */
    export class SimpleRope extends Mesh {
        autoUpdate: boolean;
        /**
         * Note: The wrap mode of the texture is set to REPEAT if `textureScale` is positive.
         * @param texture - The texture to use on the rope.
         * @param points - An array of {@link PIXI.Point} objects to construct this rope.
         * @param {number} textureScale - Optional. Positive values scale rope texture
         * keeping its aspect ratio. You can reduce alpha channel artifacts by providing a larger texture
         * and downsampling here. If set to zero, texture will be stretched instead.
         */
        constructor(texture: Texture, points: IPoint[], textureScale?: number);
        _render(renderer: Renderer): void;
    }
}
declare module "packages/mesh-extras/src/index" {
    export * from "packages/mesh-extras/src/geometry/PlaneGeometry";
    export * from "packages/mesh-extras/src/geometry/RopeGeometry";
    export * from "packages/mesh-extras/src/NineSlicePlane";
    export * from "packages/mesh-extras/src/SimpleMesh";
    export * from "packages/mesh-extras/src/SimplePlane";
    export * from "packages/mesh-extras/src/SimpleRope";
}
declare module "packages/particle-container/src/ParticleRenderer" {
    import { Matrix, ObjectRenderer, Shader, State, TYPES } from "packages/core/src/index";
    import type { ExtensionMetadata, Renderer } from "packages/core/src/index";
    import type { Sprite } from "packages/sprite/src/index";
    import type { ParticleContainer } from "packages/particle-container/src/ParticleContainer";
    export interface IParticleRendererProperty {
        attributeName: string;
        size: number;
        type?: TYPES;
        uploadFunction: (...params: any[]) => any;
        offset: number;
    }
    /**
     * Renderer for Particles that is designer for speed over feature set.
     * @memberof PIXI
     */
    export class ParticleRenderer extends ObjectRenderer {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** The WebGL state in which this renderer will work. */
        readonly state: State;
        /** The default shader that is used if a sprite doesn't have a more specific one. */
        shader: Shader;
        tempMatrix: Matrix;
        properties: IParticleRendererProperty[];
        /**
         * @param renderer - The renderer this sprite batch works for.
         */
        constructor(renderer: Renderer);
        /**
         * Renders the particle container object.
         * @param container - The container to render using this ParticleRenderer.
         */
        render(container: ParticleContainer): void;
        /**
         * Creates one particle buffer for each child in the container we want to render and updates internal properties.
         * @param container - The container to render using this ParticleRenderer
         * @returns - The buffers
         */
        private generateBuffers;
        /**
         * Creates one more particle buffer, because container has autoResize feature.
         * @param container - The container to render using this ParticleRenderer
         * @returns - The generated buffer
         */
        private _generateOneMoreBuffer;
        /**
         * Uploads the vertices.
         * @param children - the array of sprites to render
         * @param startIndex - the index to start from in the children array
         * @param amount - the amount of children that will have their vertices uploaded
         * @param array - The vertices to upload.
         * @param stride - Stride to use for iteration.
         * @param offset - Offset to start at.
         */
        uploadVertices(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
        /**
         * Uploads the position.
         * @param children - the array of sprites to render
         * @param startIndex - the index to start from in the children array
         * @param amount - the amount of children that will have their positions uploaded
         * @param array - The vertices to upload.
         * @param stride - Stride to use for iteration.
         * @param offset - Offset to start at.
         */
        uploadPosition(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
        /**
         * Uploads the rotation.
         * @param children - the array of sprites to render
         * @param startIndex - the index to start from in the children array
         * @param amount - the amount of children that will have their rotation uploaded
         * @param array - The vertices to upload.
         * @param stride - Stride to use for iteration.
         * @param offset - Offset to start at.
         */
        uploadRotation(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
        /**
         * Uploads the UVs.
         * @param children - the array of sprites to render
         * @param startIndex - the index to start from in the children array
         * @param amount - the amount of children that will have their rotation uploaded
         * @param array - The vertices to upload.
         * @param stride - Stride to use for iteration.
         * @param offset - Offset to start at.
         */
        uploadUvs(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
        /**
         * Uploads the tint.
         * @param children - the array of sprites to render
         * @param startIndex - the index to start from in the children array
         * @param amount - the amount of children that will have their rotation uploaded
         * @param array - The vertices to upload.
         * @param stride - Stride to use for iteration.
         * @param offset - Offset to start at.
         */
        uploadTint(children: Sprite[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
        /** Destroys the ParticleRenderer. */
        destroy(): void;
    }
}
declare module "packages/particle-container/src/ParticleBuffer" {
    import { Buffer, Geometry } from "packages/core/src/index";
    import type { Sprite } from "packages/sprite/src/index";
    import type { IParticleRendererProperty } from "packages/particle-container/src/ParticleRenderer";
    /**
     * The particle buffer manages the static and dynamic buffers for a particle container.
     * @private
     * @memberof PIXI
     */
    export class ParticleBuffer {
        geometry: Geometry;
        staticStride: number;
        staticBuffer: Buffer;
        staticData: Float32Array;
        staticDataUint32: Uint32Array;
        dynamicStride: number;
        dynamicBuffer: Buffer;
        dynamicData: Float32Array;
        dynamicDataUint32: Uint32Array;
        _updateID: number;
        /** Holds the indices of the geometry (quads) to draw. */
        indexBuffer: Buffer;
        /** The number of particles the buffer can hold. */
        private size;
        /** A list of the properties that are dynamic. */
        private dynamicProperties;
        /** A list of the properties that are static. */
        private staticProperties;
        /**
         * @param {object} properties - The properties to upload.
         * @param {boolean[]} dynamicPropertyFlags - Flags for which properties are dynamic.
         * @param {number} size - The size of the batch.
         */
        constructor(properties: IParticleRendererProperty[], dynamicPropertyFlags: boolean[], size: number);
        /** Sets up the renderer context and necessary buffers. */
        private initBuffers;
        /**
         * Uploads the dynamic properties.
         * @param children - The children to upload.
         * @param startIndex - The index to start at.
         * @param amount - The number to upload.
         */
        uploadDynamic(children: Sprite[], startIndex: number, amount: number): void;
        /**
         * Uploads the static properties.
         * @param children - The children to upload.
         * @param startIndex - The index to start at.
         * @param amount - The number to upload.
         */
        uploadStatic(children: Sprite[], startIndex: number, amount: number): void;
        /** Destroys the ParticleBuffer. */
        destroy(): void;
    }
}
declare module "packages/particle-container/src/ParticleContainer" {
    import { BLEND_MODES } from "packages/core/src/index";
    import { Container } from "packages/display/src/index";
    import type { BaseTexture, ColorSource, Renderer } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    import type { Sprite } from "packages/sprite/src/index";
    import type { ParticleBuffer } from "packages/particle-container/src/ParticleBuffer";
    export interface IParticleProperties {
        vertices?: boolean;
        position?: boolean;
        rotation?: boolean;
        uvs?: boolean;
        tint?: boolean;
        alpha?: boolean;
        scale?: boolean;
    }
    /**
     * The ParticleContainer class is a really fast version of the Container built solely for speed,
     * so use when you need a lot of sprites or particles.
     *
     * The tradeoff of the ParticleContainer is that most advanced functionality will not work.
     * ParticleContainer implements the basic object transform (position, scale, rotation)
     * and some advanced functionality like tint (as of v4.5.6).
     *
     * Other more advanced functionality like masking, children, filters, etc will not work on sprites in this batch.
     *
     * It's extremely easy to use. And here you have a hundred sprites that will be rendered at the speed of light.
     * @example
     * import { ParticleContainer, Sprite } from 'pixi.js';
     *
     * const container = new ParticleContainer();
     *
     * for (let i = 0; i < 100; ++i)
     * {
     *     let sprite = Sprite.from('myImage.png');
     *     container.addChild(sprite);
     * }
     * @memberof PIXI
     */
    export class ParticleContainer<T extends Sprite = Sprite> extends Container<T> {
        /**
         * The blend mode to be applied to the sprite. Apply a value of `PIXI.BLEND_MODES.NORMAL`
         * to reset the blend mode.
         * @default PIXI.BLEND_MODES.NORMAL
         */
        blendMode: BLEND_MODES;
        /**
         * If true, container allocates more batches in case there are more than `maxSize` particles.
         * @default false
         */
        autoResize: boolean;
        /**
         * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Advantages can include sharper image quality (like text) and faster rendering on canvas.
         * The main disadvantage is movement of objects may appear less smooth.
         * Default to true here as performance is usually the priority for particles.
         * @default true
         */
        roundPixels: boolean;
        /**
         * The texture used to render the children.
         * @readonly
         */
        baseTexture: BaseTexture;
        tintRgb: Float32Array;
        /** @private */
        _maxSize: number;
        /** @private */
        _buffers: ParticleBuffer[];
        /** @private */
        _batchSize: number;
        /**
         * Set properties to be dynamic (true) / static (false).
         * @private
         */
        _properties: boolean[];
        /**
         * For every batch, stores _updateID corresponding to the last change in that batch.
         * @private
         */
        _bufferUpdateIDs: number[];
        /**
         * When child inserted, removed or changes position this number goes up.
         * @private
         */
        _updateID: number;
        /**
         * The tint applied to the container.
         * This is a hex value. A value of 0xFFFFFF will remove any tint effect.
         * @default 0xFFFFFF
         */
        private _tintColor;
        /**
         * @param maxSize - The maximum number of particles that can be rendered by the container.
         *  Affects size of allocated buffers.
         * @param properties - The properties of children that should be uploaded to the gpu and applied.
         * @param {boolean} [properties.vertices=false] - When true, vertices be uploaded and applied.
         *                  if sprite's ` scale/anchor/trim/frame/orig` is dynamic, please set `true`.
         * @param {boolean} [properties.position=true] - When true, position be uploaded and applied.
         * @param {boolean} [properties.rotation=false] - When true, rotation be uploaded and applied.
         * @param {boolean} [properties.uvs=false] - When true, uvs be uploaded and applied.
         * @param {boolean} [properties.tint=false] - When true, alpha and tint be uploaded and applied.
         * @param {number} [batchSize=16384] - Number of particles per batch. If less than maxSize, it uses maxSize instead.
         * @param {boolean} [autoResize=false] - If true, container allocates more batches in case
         *  there are more than `maxSize` particles.
         */
        constructor(maxSize?: number, properties?: IParticleProperties, batchSize?: number, autoResize?: boolean);
        /**
         * Sets the private properties array to dynamic / static based on the passed properties object
         * @param properties - The properties to be uploaded
         */
        setProperties(properties: IParticleProperties): void;
        updateTransform(): void;
        /**
         * The tint applied to the container. This is a hex value.
         * A value of 0xFFFFFF will remove any tint effect.
         * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
         * @default 0xFFFFFF
         */
        get tint(): ColorSource;
        set tint(value: ColorSource);
        /**
         * Renders the container using the WebGL renderer.
         * @param renderer - The WebGL renderer.
         */
        render(renderer: Renderer): void;
        /**
         * Set the flag that static data should be updated to true
         * @param smallestChildIndex - The smallest child index.
         */
        protected onChildrenChange(smallestChildIndex: number): void;
        dispose(): void;
        /**
         * Destroys the container
         * @param options - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their
         *  destroy method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
         *  Should it destroy the texture of the child sprite
         * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
         *  Should it destroy the base texture of the child sprite
         */
        destroy(options?: IDestroyOptions | boolean): void;
    }
}
declare module "packages/particle-container/src/index" {
    export * from "packages/particle-container/src/ParticleContainer";
    export * from "packages/particle-container/src/ParticleRenderer";
}
declare module "packages/text/src/const" {
    /**
     * Constants that define the type of gradient on text.
     * @static
     * @memberof PIXI
     * @type {object}
     */
    export enum TEXT_GRADIENT {
        /**
         * Vertical gradient
         * @default 0
         */
        LINEAR_VERTICAL = 0,
        /**
         * Linear gradient
         * @default 1
         */
        LINEAR_HORIZONTAL = 1
    }
}
declare module "packages/text/src/TextStyle" {
    import { TEXT_GRADIENT } from "packages/text/src/const";
    export type TextStyleAlign = 'left' | 'center' | 'right' | 'justify';
    export type TextStyleFill = string | string[] | number | number[] | CanvasGradient | CanvasPattern;
    export type TextStyleFontStyle = 'normal' | 'italic' | 'oblique';
    export type TextStyleFontVariant = 'normal' | 'small-caps';
    export type TextStyleFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    export type TextStyleLineJoin = 'miter' | 'round' | 'bevel';
    export type TextStyleTextBaseline = 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom';
    export type TextStyleWhiteSpace = 'normal' | 'pre' | 'pre-line';
    /**
     * Generic interface for TextStyle options.
     * @memberof PIXI
     */
    export interface ITextStyle {
        /**
         * Alignment for multiline text, does not affect single line text
         * @type {'left'|'center'|'right'|'justify'}
         */
        align: TextStyleAlign;
        /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true */
        breakWords: boolean;
        /** Set a drop shadow for the text */
        dropShadow: boolean;
        /** Set alpha for the drop shadow */
        dropShadowAlpha: number;
        /** Set a angle of the drop shadow */
        dropShadowAngle: number;
        /** Set a shadow blur radius */
        dropShadowBlur: number;
        /** A fill style to be used on the dropshadow e.g., 'red', '#00FF00' */
        dropShadowColor: string | number;
        /** Set a distance of the drop shadow */
        dropShadowDistance: number;
        /**
         * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
         * Can be an array to create a gradient, e.g., `['#000000','#FFFFFF']`
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
         * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
         */
        fill: TextStyleFill;
        /**
         * If fill is an array of colours to create a gradient, this can change the
         * type/direction of the gradient. See {@link PIXI.TEXT_GRADIENT}
         * @type {PIXI.TEXT_GRADIENT}
         */
        fillGradientType: TEXT_GRADIENT;
        /**
         * If fill is an array of colours to create a gradient, this array can set
         * the stop points (numbers between 0 and 1) for the color, overriding the
         * default behaviour of evenly spacing them.
         */
        fillGradientStops: number[];
        /**
         * The font family, can be a single font name, or a list of names where the first
         * is the preferred font.
         */
        fontFamily: string | string[];
        /**
         * The font size (as a number it converts to px, but as a string,
         * equivalents are '26px','20pt','160%' or '1.6em')
         */
        fontSize: number | string;
        /**
         * The font style.
         * @type {'normal'|'italic'|'oblique'}
         */
        fontStyle: TextStyleFontStyle;
        /**
         * The font variant.
         * @type {'normal'|'small-caps'}
         */
        fontVariant: TextStyleFontVariant;
        /**
         * The font weight.
         * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
         */
        fontWeight: TextStyleFontWeight;
        /** The height of the line, a number that represents the vertical space that a letter uses. */
        leading: number;
        /** The amount of spacing between letters, default is 0 */
        letterSpacing: number;
        /** The line height, a number that represents the vertical space that a letter uses */
        lineHeight: number;
        /**
         * The lineJoin property sets the type of corner created, it can resolve
         * spiked text issues. Possible values "miter" (creates a sharp corner),
         * "round" (creates a round corner) or "bevel" (creates a squared corner).
         * @type {'miter'|'round'|'bevel'}
         */
        lineJoin: TextStyleLineJoin;
        /**
         * The miter limit to use when using the 'miter' lineJoin mode. This can reduce
         * or increase the spikiness of rendered text.
         */
        miterLimit: number;
        /**
         * Occasionally some fonts are cropped. Adding some padding will prevent this from
         * happening by adding padding to all sides of the text.
         */
        padding: number;
        /** A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00' */
        stroke: string | number;
        /** A number that represents the thickness of the stroke. A value of 0 will disable stroke. */
        strokeThickness: number;
        /**
         * The baseline of the text that is rendered.
         * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
         */
        textBaseline: TextStyleTextBaseline;
        /** Trim transparent borders */
        trim: boolean;
        /**
         * Determines whether newlines & spaces are collapsed or preserved "normal"
         * (collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve,
         * collapse). It needs wordWrap to be set to true.
         * @type {'normal'|'pre'|'pre-line'}
         */
        whiteSpace: TextStyleWhiteSpace;
        /** Indicates if word wrap should be used */
        wordWrap: boolean;
        /** The width at which text will wrap, it needs wordWrap to be set to true */
        wordWrapWidth: number;
    }
    /**
     * A TextStyle Object contains information to decorate a Text objects.
     *
     * An instance can be shared between multiple Text objects; then changing the style will update all text objects using it.
     *
     * A tool can be used to generate a text style [here](https://pixijs.io/pixi-text-style).
     *
     * @memberof PIXI
     * @example
     * import { TextStyle } from 'pixi.js';
     * const style = new TextStyle({
     *   fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
     *   fontSize: 36,
     * });
     */
    export class TextStyle implements ITextStyle {
        /**
         * Default style options used for all TextStyle instances.
         * @type {PIXI.ITextStyle}
         */
        static defaultStyle: ITextStyle;
        styleID: number;
        protected _align: TextStyleAlign;
        protected _breakWords: boolean;
        protected _dropShadow: boolean;
        protected _dropShadowAlpha: number;
        protected _dropShadowAngle: number;
        protected _dropShadowBlur: number;
        protected _dropShadowColor: string | number;
        protected _dropShadowDistance: number;
        protected _fill: TextStyleFill;
        protected _fillGradientType: TEXT_GRADIENT;
        protected _fillGradientStops: number[];
        protected _fontFamily: string | string[];
        protected _fontSize: number | string;
        protected _fontStyle: TextStyleFontStyle;
        protected _fontVariant: TextStyleFontVariant;
        protected _fontWeight: TextStyleFontWeight;
        protected _letterSpacing: number;
        protected _lineHeight: number;
        protected _lineJoin: TextStyleLineJoin;
        protected _miterLimit: number;
        protected _padding: number;
        protected _stroke: string | number;
        protected _strokeThickness: number;
        protected _textBaseline: TextStyleTextBaseline;
        protected _trim: boolean;
        protected _whiteSpace: TextStyleWhiteSpace;
        protected _wordWrap: boolean;
        protected _wordWrapWidth: number;
        protected _leading: number;
        /**
         * @param style - TextStyle properties to be set on the text. See {@link PIXI.TextStyle.defaultStyle}
         *       for the default values.
         */
        constructor(style?: Partial<ITextStyle>);
        /**
         * Creates a new TextStyle object with the same values as this one.
         * Note that the only the properties of the object are cloned.
         *
         * @return New cloned TextStyle object
         */
        clone(): TextStyle;
        /** Resets all properties to the defaults specified in TextStyle.prototype._default */
        reset(): void;
        /**
         * Alignment for multiline text, does not affect single line text.
         *
         * @member {'left'|'center'|'right'|'justify'}
         */
        get align(): TextStyleAlign;
        set align(align: TextStyleAlign);
        /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
        get breakWords(): boolean;
        set breakWords(breakWords: boolean);
        /** Set a drop shadow for the text. */
        get dropShadow(): boolean;
        set dropShadow(dropShadow: boolean);
        /** Set alpha for the drop shadow. */
        get dropShadowAlpha(): number;
        set dropShadowAlpha(dropShadowAlpha: number);
        /** Set a angle of the drop shadow. */
        get dropShadowAngle(): number;
        set dropShadowAngle(dropShadowAngle: number);
        /** Set a shadow blur radius. */
        get dropShadowBlur(): number;
        set dropShadowBlur(dropShadowBlur: number);
        /** A fill style to be used on the dropshadow e.g., 'red', '#00FF00'. */
        get dropShadowColor(): number | string;
        set dropShadowColor(dropShadowColor: number | string);
        /** Set a distance of the drop shadow. */
        get dropShadowDistance(): number;
        set dropShadowDistance(dropShadowDistance: number);
        /**
         * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
         *
         * Can be an array to create a gradient e.g., `['#000000','#FFFFFF']`
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
         *
         * @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
         */
        get fill(): TextStyleFill;
        set fill(fill: TextStyleFill);
        /**
         * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
         *
         * @type {PIXI.TEXT_GRADIENT}
         */
        get fillGradientType(): TEXT_GRADIENT;
        set fillGradientType(fillGradientType: TEXT_GRADIENT);
        /**
         * If fill is an array of colours to create a gradient, this array can set the stop points
         * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
         */
        get fillGradientStops(): number[];
        set fillGradientStops(fillGradientStops: number[]);
        /**
         * The font family, can be a single font name, or a list of names where the first
         * is the preferred font.
         */
        get fontFamily(): string | string[];
        set fontFamily(fontFamily: string | string[]);
        /**
         * The font size
         * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
         */
        get fontSize(): number | string;
        set fontSize(fontSize: number | string);
        /**
         * The font style.
         *
         * @member {'normal'|'italic'|'oblique'}
         */
        get fontStyle(): TextStyleFontStyle;
        set fontStyle(fontStyle: TextStyleFontStyle);
        /**
         * The font variant.
         *
         * @member {'normal'|'small-caps'}
         */
        get fontVariant(): TextStyleFontVariant;
        set fontVariant(fontVariant: TextStyleFontVariant);
        /**
         * The font weight.
         *
         * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
         */
        get fontWeight(): TextStyleFontWeight;
        set fontWeight(fontWeight: TextStyleFontWeight);
        /** The amount of spacing between letters, default is 0. */
        get letterSpacing(): number;
        set letterSpacing(letterSpacing: number);
        /** The line height, a number that represents the vertical space that a letter uses. */
        get lineHeight(): number;
        set lineHeight(lineHeight: number);
        /** The space between lines. */
        get leading(): number;
        set leading(leading: number);
        /**
         * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
         * Default is 'miter' (creates a sharp corner).
         *
         * @member {'miter'|'round'|'bevel'}
         */
        get lineJoin(): TextStyleLineJoin;
        set lineJoin(lineJoin: TextStyleLineJoin);
        /**
         * The miter limit to use when using the 'miter' lineJoin mode.
         *
         * This can reduce or increase the spikiness of rendered text.
         */
        get miterLimit(): number;
        set miterLimit(miterLimit: number);
        /**
         * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
         * by adding padding to all sides of the text.
         */
        get padding(): number;
        set padding(padding: number);
        /**
         * A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'
         */
        get stroke(): string | number;
        set stroke(stroke: string | number);
        /**
         * A number that represents the thickness of the stroke.
         *
         * @default 0
         */
        get strokeThickness(): number;
        set strokeThickness(strokeThickness: number);
        /**
         * The baseline of the text that is rendered.
         *
         * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
         */
        get textBaseline(): TextStyleTextBaseline;
        set textBaseline(textBaseline: TextStyleTextBaseline);
        /** Trim transparent borders. */
        get trim(): boolean;
        set trim(trim: boolean);
        /**
         * How newlines and spaces should be handled.
         * Default is 'pre' (preserve, preserve).
         *
         *  value       | New lines     |   Spaces
         *  ---         | ---           |   ---
         * 'normal'     | Collapse      |   Collapse
         * 'pre'        | Preserve      |   Preserve
         * 'pre-line'   | Preserve      |   Collapse
         *
         * @member {'normal'|'pre'|'pre-line'}
         */
        get whiteSpace(): TextStyleWhiteSpace;
        set whiteSpace(whiteSpace: TextStyleWhiteSpace);
        /** Indicates if word wrap should be used. */
        get wordWrap(): boolean;
        set wordWrap(wordWrap: boolean);
        /** The width at which text will wrap, it needs wordWrap to be set to true. */
        get wordWrapWidth(): number;
        set wordWrapWidth(wordWrapWidth: number);
        /**
         * Generates a font style string to use for `TextMetrics.measureFont()`.
         *
         * @return Font style string, for passing to `TextMetrics.measureFont()`
         */
        toFontString(): string;
    }
}
declare module "packages/text/src/TextMetrics" {
    import type { ICanvas, ICanvasRenderingContext2D } from "packages/core/src/index";
    import type { TextStyle } from "packages/text/src/TextStyle";
    /**
     * Internal return object for {@link PIXI.TextMetrics.measureFont `TextMetrics.measureFont`}.
     * @typedef {object} FontMetrics
     * @property {number} ascent - The ascent distance
     * @property {number} descent - The descent distance
     * @property {number} fontSize - Font size from ascent to descent
     * @memberof PIXI.TextMetrics
     * @private
     */
    /**
     * A number, or a string containing a number.
     * @memberof PIXI
     * @typedef {object} IFontMetrics
     * @property {number} ascent - Font ascent
     * @property {number} descent - Font descent
     * @property {number} fontSize - Font size
     */
    interface IFontMetrics {
        ascent: number;
        descent: number;
        fontSize: number;
    }
    /**
     * The TextMetrics object represents the measurement of a block of text with a specified style.
     * @example
     * import { TextMetrics, TextStyle } from 'pixi.js';
     *
     * const style = new TextStyle({
     *     fontFamily: 'Arial',
     *     fontSize: 24,
     *     fill: 0xff1010,
     *     align: 'center',
     * });
     * const textMetrics = TextMetrics.measureText('Your text', style);
     * @memberof PIXI
     */
    export class TextMetrics {
        /** The text that was measured. */
        text: string;
        /** The style that was measured. */
        style: TextStyle;
        /** The measured width of the text. */
        width: number;
        /** The measured height of the text. */
        height: number;
        /** An array of lines of the text broken by new lines and wrapping is specified in style. */
        lines: string[];
        /** An array of the line widths for each line matched to `lines`. */
        lineWidths: number[];
        /** The measured line height for this style. */
        lineHeight: number;
        /** The maximum line width for all measured lines. */
        maxLineWidth: number;
        /** The font properties object from TextMetrics.measureFont. */
        fontProperties: IFontMetrics;
        /**
         * String used for calculate font metrics.
         * These characters are all tall to help calculate the height required for text.
         */
        static METRICS_STRING: string;
        /** Baseline symbol for calculate font metrics. */
        static BASELINE_SYMBOL: string;
        /** Baseline multiplier for calculate font metrics. */
        static BASELINE_MULTIPLIER: number;
        /** Height multiplier for setting height of canvas to calculate font metrics. */
        static HEIGHT_MULTIPLIER: number;
        /**
         * A Unicode "character", or "grapheme cluster", can be composed of multiple Unicode code points,
         * such as letters with diacritical marks (e.g. `'\u0065\u0301'`, letter e with acute)
         * or emojis with modifiers (e.g. `'\uD83E\uDDD1\u200D\uD83D\uDCBB'`, technologist).
         * The new `Intl.Segmenter` API in ES2022 can split the string into grapheme clusters correctly. If it is not available,
         * PixiJS will fallback to use the iterator of String, which can only spilt the string into code points.
         * If you want to get full functionality in environments that don't support `Intl.Segmenter` (such as Firefox),
         * you can use other libraries such as [grapheme-splitter]{@link https://www.npmjs.com/package/grapheme-splitter}
         * or [graphemer]{@link https://www.npmjs.com/package/graphemer} to create a polyfill. Since these libraries can be
         * relatively large in size to handle various Unicode grapheme clusters properly, PixiJS won't use them directly.
         */
        static graphemeSegmenter: (s: string) => string[];
        static _experimentalLetterSpacingSupported?: boolean;
        /**
         * Checking that we can use modern canvas 2D API.
         *
         * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
         * @see PIXI.TextMetrics.experimentalLetterSpacing
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
         * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
         */
        static get experimentalLetterSpacingSupported(): boolean;
        /**
         * New rendering behavior for letter-spacing which uses Chrome's new native API. This will
         * lead to more accurate letter-spacing results because it does not try to manually draw
         * each character. However, this Chrome API is experimental and may not serve all cases yet.
         * @see PIXI.TextMetrics.experimentalLetterSpacingSupported
         */
        static experimentalLetterSpacing: boolean;
        /** Cache of {@see PIXI.TextMetrics.FontMetrics} objects. */
        private static _fonts;
        /** Cache of new line chars. */
        private static _newlines;
        /** Cache of breaking spaces. */
        private static _breakingSpaces;
        private static __canvas;
        private static __context;
        /**
         * @param text - the text that was measured
         * @param style - the style that was measured
         * @param width - the measured width of the text
         * @param height - the measured height of the text
         * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
         * @param lineWidths - an array of the line widths for each line matched to `lines`
         * @param lineHeight - the measured line height for this style
         * @param maxLineWidth - the maximum line width for all measured lines
         * @param {PIXI.IFontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
         */
        constructor(text: string, style: TextStyle, width: number, height: number, lines: string[], lineWidths: number[], lineHeight: number, maxLineWidth: number, fontProperties: IFontMetrics);
        /**
         * Measures the supplied string of text and returns a Rectangle.
         * @param text - The text to measure.
         * @param style - The text style to use for measuring
         * @param wordWrap - Override for if word-wrap should be applied to the text.
         * @param canvas - optional specification of the canvas to use for measuring.
         * @returns Measured width and height of the text.
         */
        static measureText(text: string, style: TextStyle, wordWrap?: boolean, canvas?: ICanvas): TextMetrics;
        private static _measureText;
        /**
         * Applies newlines to a string to have it optimally fit into the horizontal
         * bounds set by the Text object's wordWrapWidth property.
         * @param text - String to apply word wrapping to
         * @param style - the style to use when wrapping
         * @param canvas - optional specification of the canvas to use for measuring.
         * @returns New string with new lines applied where required
         */
        private static wordWrap;
        /**
         * Convienience function for logging each line added during the wordWrap method.
         * @param line    - The line of text to add
         * @param newLine - Add new line character to end
         * @returns A formatted line
         */
        private static addLine;
        /**
         * Gets & sets the widths of calculated characters in a cache object
         * @param key            - The key
         * @param letterSpacing  - The letter spacing
         * @param cache          - The cache
         * @param context        - The canvas context
         * @returns The from cache.
         */
        private static getFromCache;
        /**
         * Determines whether we should collapse breaking spaces.
         * @param whiteSpace - The TextStyle property whiteSpace
         * @returns Should collapse
         */
        private static collapseSpaces;
        /**
         * Determines whether we should collapse newLine chars.
         * @param whiteSpace - The white space
         * @returns should collapse
         */
        private static collapseNewlines;
        /**
         * Trims breaking whitespaces from string.
         * @param text - The text
         * @returns Trimmed string
         */
        private static trimRight;
        /**
         * Determines if char is a newline.
         * @param char - The character
         * @returns True if newline, False otherwise.
         */
        private static isNewline;
        /**
         * Determines if char is a breaking whitespace.
         *
         * It allows one to determine whether char should be a breaking whitespace
         * For example certain characters in CJK langs or numbers.
         * It must return a boolean.
         * @param char - The character
         * @param [_nextChar] - The next character
         * @returns True if whitespace, False otherwise.
         */
        static isBreakingSpace(char: string, _nextChar?: string): boolean;
        /**
         * Splits a string into words, breaking-spaces and newLine characters
         * @param text - The text
         * @returns A tokenized array
         */
        private static tokenize;
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It allows one to customise which words should break
         * Examples are if the token is CJK or numbers.
         * It must return a boolean.
         * @param _token - The token
         * @param breakWords - The style attr break words
         * @returns Whether to break word or not
         */
        static canBreakWords(_token: string, breakWords: boolean): boolean;
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It allows one to determine whether a pair of characters
         * should be broken by newlines
         * For example certain characters in CJK langs or numbers.
         * It must return a boolean.
         * @param _char - The character
         * @param _nextChar - The next character
         * @param _token - The token/word the characters are from
         * @param _index - The index in the token of the char
         * @param _breakWords - The style attr break words
         * @returns whether to break word or not
         */
        static canBreakChars(_char: string, _nextChar: string, _token: string, _index: number, _breakWords: boolean): boolean;
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It is called when a token (usually a word) has to be split into separate pieces
         * in order to determine the point to break a word.
         * It must return an array of characters.
         * @param token - The token to split
         * @returns The characters of the token
         * @see TextMetrics.graphemeSegmenter
         */
        static wordWrapSplit(token: string): string[];
        /**
         * Calculates the ascent, descent and fontSize of a given font-style
         * @param font - String representing the style of the font
         * @returns Font properties object
         */
        static measureFont(font: string): IFontMetrics;
        /**
         * Clear font metrics in metrics cache.
         * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
         */
        static clearMetrics(font?: string): void;
        /**
         * Cached canvas element for measuring text
         * TODO: this should be private, but isn't because of backward compat, will fix later.
         * @ignore
         */
        static get _canvas(): ICanvas;
        /**
         * TODO: this should be private, but isn't because of backward compat, will fix later.
         * @ignore
         */
        static get _context(): ICanvasRenderingContext2D;
    }
}
declare module "packages/text/src/Text" {
    import { Rectangle } from "packages/core/src/index";
    import { Sprite } from "packages/sprite/src/index";
    import { TextStyle } from "packages/text/src/TextStyle";
    import type { ICanvas, ICanvasRenderingContext2D, Renderer } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    import type { ITextStyle } from "packages/text/src/TextStyle";
    /**
     * A Text Object will create a line or multiple lines of text.
     *
     * The text is created using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
     *
     * The primary advantage of this class over BitmapText is that you have great control over the style of the text,
     * which you can change at runtime.
     *
     * The primary disadvantages is that each piece of text has it's own texture, which can use more memory.
     * When text changes, this texture has to be re-generated and re-uploaded to the GPU, taking up time.
     *
     * To split a line you can use '\n' in your text string, or, on the `style` object,
     * change its `wordWrap` property to true and and give the `wordWrapWidth` property a value.
     *
     * A Text can be created directly from a string and a style object,
     * which can be generated [here](https://pixijs.io/pixi-text-style).
     * @example
     * import { Text } from 'pixi.js';
     *
     * const text = new Text('This is a PixiJS text', {
     *     fontFamily: 'Arial',
     *     fontSize: 24,
     *     fill: 0xff1010,
     *     align: 'center',
     * });
     * @memberof PIXI
     */
    export class Text extends Sprite {
        /**
         * Override whether or not the resolution of the text is automatically adjusted to match the resolution of the renderer.
         * Setting this to false can allow you to get crisper text at lower render resolutions.
         * @example
         * // renderer has a resolution of 1
         * const app = new Application();
         *
         * Text.defaultResolution = 2;
         * Text.defaultAutoResolution = false;
         * // text has a resolution of 2
         * const text = new Text('This is a PixiJS text');
         */
        static defaultAutoResolution: boolean;
        /**
         * If {@link PIXI.Text.defaultAutoResolution} is false, this will be the default resolution of the text.
         * If not set it will default to {@link PIXI.settings.RESOLUTION}.
         * @example
         * Text.defaultResolution = 2;
         * Text.defaultAutoResolution = false;
         *
         * // text has a resolution of 2
         * const text = new Text('This is a PixiJS text');
         */
        static defaultResolution: number;
        /**
         * @see PIXI.TextMetrics.experimentalLetterSpacing
         * @deprecated since 7.1.0
         */
        static get experimentalLetterSpacing(): boolean;
        static set experimentalLetterSpacing(value: boolean);
        /** The canvas element that everything is drawn to. */
        canvas: ICanvas;
        /** The canvas 2d context that everything is drawn with. */
        context: ICanvasRenderingContext2D;
        localStyleID: number;
        dirty: boolean;
        /**
         * The resolution / device pixel ratio of the canvas.
         *
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         * @default PIXI.settings.RESOLUTION
         */
        _resolution: number;
        _autoResolution: boolean;
        /**
         * Private tracker for the current text.
         * @private
         */
        protected _text: string;
        /**
         * Private tracker for the current font.
         * @private
         */
        protected _font: string;
        /**
         * Private tracker for the current style.
         * @private
         */
        protected _style: TextStyle;
        /**
         * Private listener to track style changes.
         * @private
         */
        protected _styleListener: () => void;
        /**
         * Keep track if this Text object created it's own canvas
         * element (`true`) or uses the constructor argument (`false`).
         * Used to workaround a GC issues with Safari < 13 when
         * destroying Text. See `destroy` for more info.
         */
        private _ownCanvas;
        /**
         * @param text - The string that you would like the text to display
         * @param style - The style parameters
         * @param canvas - The canvas element for drawing text
         */
        constructor(text?: string | number, style?: Partial<ITextStyle> | TextStyle, canvas?: ICanvas);
        /**
         * Renders text to its canvas, and updates its texture.
         *
         * By default this is used internally to ensure the texture is correct before rendering,
         * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
         * and then shared across multiple Sprites.
         * @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
         */
        updateText(respectDirty: boolean): void;
        /**
         * Render the text with letter-spacing.
         * @param text - The text to draw
         * @param x - Horizontal position to draw the text
         * @param y - Vertical position to draw the text
         * @param isStroke - Is this drawing for the outside stroke of the
         *  text? If not, it's for the inside fill
         */
        private drawLetterSpacing;
        /** Updates texture size based on canvas size. */
        private updateTexture;
        /**
         * Renders the object using the WebGL renderer
         * @param renderer - The renderer
         */
        protected _render(renderer: Renderer): void;
        /** Updates the transform on all children of this container for rendering. */
        updateTransform(): void;
        getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
        /**
         * Gets the local bounds of the text object.
         * @param rect - The output rectangle.
         * @returns The bounds.
         */
        getLocalBounds(rect?: Rectangle): Rectangle;
        /** Calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account. */
        protected _calculateBounds(): void;
        /**
         * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
         * @param style - The style.
         * @param lines - The lines of text.
         * @param metrics
         * @returns The fill style
         */
        private _generateFillStyle;
        /**
         * Destroys this text object.
         *
         * Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
         * the majority of the time the texture will not be shared with any other Sprites.
         * @param options - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their
         *  destroy method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
         * @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
         */
        destroy(options?: IDestroyOptions | boolean): void;
        /** The width of the Text, setting this will actually modify the scale to achieve the value set. */
        get width(): number;
        set width(value: number);
        /** The height of the Text, setting this will actually modify the scale to achieve the value set. */
        get height(): number;
        set height(value: number);
        /**
         * Set the style of the text.
         *
         * Set up an event listener to listen for changes on the style object and mark the text as dirty.
         *
         * If setting the `style` can also be partial {@link PIXI.ITextStyle}.
         */
        get style(): TextStyle;
        set style(style: TextStyle | Partial<ITextStyle>);
        /** Set the copy for the text object. To split a line you can use '\n'. */
        get text(): string;
        set text(text: string | number);
        /**
         * The resolution / device pixel ratio of the canvas.
         *
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         * @default 1
         */
        get resolution(): number;
        set resolution(value: number);
    }
}
declare module "packages/text/src/index" {
    export * from "packages/text/src/const";
    export * from "packages/text/src/Text";
    export * from "packages/text/src/TextMetrics";
    export * from "packages/text/src/TextStyle";
}
declare module "packages/prepare/src/CountLimiter" {
    /**
     * CountLimiter limits the number of items handled by a {@link PIXI.BasePrepare} to a specified
     * number of items per frame.
     * @memberof PIXI
     */
    export class CountLimiter {
        /** The maximum number of items that can be prepared each frame. */
        maxItemsPerFrame: number;
        /** The number of items that can be prepared in the current frame. */
        itemsLeft: number;
        /**
         * @param maxItemsPerFrame - The maximum number of items that can be prepared each frame.
         */
        constructor(maxItemsPerFrame: number);
        /** Resets any counting properties to start fresh on a new frame. */
        beginFrame(): void;
        /**
         * Checks to see if another item can be uploaded. This should only be called once per item.
         * @returns If the item is allowed to be uploaded.
         */
        allowedToUpload(): boolean;
    }
}
declare module "packages/prepare/src/BasePrepare" {
    import { BaseTexture, Texture } from "packages/core/src/index";
    import { Container } from "packages/display/src/index";
    import { TextStyle } from "packages/text/src/index";
    import type { IRenderer } from "packages/core/src/index";
    import type { DisplayObject } from "packages/display/src/index";
    interface IUploadHook {
        (helper: IRenderer | BasePrepare, item: IDisplayObjectExtended): boolean;
    }
    interface IFindHook {
        (item: any, queue: Array<any>): boolean;
    }
    export interface IDisplayObjectExtended extends DisplayObject {
        _textures?: Array<Texture>;
        _texture?: Texture;
        style?: TextStyle | Partial<TextStyle>;
    }
    /**
     * The prepare manager provides functionality to upload content to the GPU.
     *
     * BasePrepare handles basic queuing functionality and is extended by
     * {@link PIXI.Prepare} and {@link PIXI.CanvasPrepare}
     * to provide preparation capabilities specific to their respective renderers.
     * @example
     * // Create a sprite
     * const sprite = PIXI.Sprite.from('something.png');
     *
     * // Load object into GPU
     * app.renderer.prepare.upload(sprite, () => {
     *     // Texture(s) has been uploaded to GPU
     *     app.stage.addChild(sprite);
     * });
     * @abstract
     * @memberof PIXI
     */
    export class BasePrepare {
        /**
         * The default maximum uploads per frame.
         * @static
         */
        static uploadsPerFrame: number;
        /**
         * The limiter to be used to control how quickly items are prepared.
         * @type {PIXI.CountLimiter|PIXI.TimeLimiter}
         */
        private limiter;
        /** Reference to the renderer. */
        protected renderer: IRenderer;
        /**
         * The only real difference between CanvasPrepare and Prepare is what they pass
         * to upload hooks. That different parameter is stored here.
         */
        protected uploadHookHelper: any;
        /** Collection of items to uploads at once. */
        protected queue: Array<any>;
        /**
         * Collection of additional hooks for finding assets.
         * @type {Array<Function>}
         */
        addHooks: Array<any>;
        /**
         * Collection of additional hooks for processing assets.
         * @type {Array<Function>}
         */
        uploadHooks: Array<any>;
        /**
         * Callback to call after completed.
         * @type {Array<Function>}
         */
        completes: Array<any>;
        /**
         * If prepare is ticking (running).
         * @type {boolean}
         */
        ticking: boolean;
        /**
         * 'bound' call for prepareItems().
         * @type {Function}
         */
        private delayedTick;
        /**
         * @param {PIXI.IRenderer} renderer - A reference to the current renderer
         */
        constructor(renderer: IRenderer);
        /**
         * Upload all the textures and graphics to the GPU.
         * @method PIXI.BasePrepare#upload
         * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text} [item] -
         *        Container or display object to search for items to upload or the items to upload themselves,
         *        or optionally ommitted, if items have been added using {@link PIXI.BasePrepare#add `prepare.add`}.
         */
        upload(item?: IDisplayObjectExtended | Container | BaseTexture | Texture): Promise<void>;
        /**
         * Handle tick update
         * @private
         */
        tick(): void;
        /**
         * Actually prepare items. This is handled outside of the tick because it will take a while
         * and we do NOT want to block the current animation frame from rendering.
         * @private
         */
        prepareItems(): void;
        /**
         * Adds hooks for finding items.
         * @param {Function} addHook - Function call that takes two parameters: `item:*, queue:Array`
         *          function must return `true` if it was able to add item to the queue.
         * @returns Instance of plugin for chaining.
         */
        registerFindHook(addHook: IFindHook): this;
        /**
         * Adds hooks for uploading items.
         * @param {Function} uploadHook - Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and
         *          function must return `true` if it was able to handle upload of item.
         * @returns Instance of plugin for chaining.
         */
        registerUploadHook(uploadHook: IUploadHook): this;
        /**
         * Manually add an item to the uploading queue.
         * @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text|*} item - Object to
         *        add to the queue
         * @returns Instance of plugin for chaining.
         */
        add(item: IDisplayObjectExtended | Container | BaseTexture | Texture): this;
        /** Destroys the plugin, don't use after this. */
        destroy(): void;
    }
}
declare module "packages/prepare/src/settings" {
    import { settings } from "packages/core/src/index";
    export { settings };
}
declare module "packages/prepare/src/Prepare" {
    import { BasePrepare } from "packages/prepare/src/BasePrepare";
    import type { ExtensionMetadata, ISystem, Renderer } from "packages/core/src/index";
    /**
     * The prepare plugin provides renderer-specific plugins for pre-rendering DisplayObjects. These plugins are useful for
     * asynchronously preparing and uploading to the GPU assets, textures, graphics waiting to be displayed.
     *
     * Do not instantiate this plugin directly. It is available from the `renderer.prepare` property.
     * @example
     * import { Application, Graphics } from 'pixi.js';
     *
     * // Create a new application (prepare will be auto-added to renderer)
     * const app = new Application();
     * document.body.appendChild(app.view);
     *
     * // Don't start rendering right away
     * app.stop();
     *
     * // Create a display object
     * const rect = new Graphics()
     *     .beginFill(0x00ff00)
     *     .drawRect(40, 40, 200, 200);
     *
     * // Add to the stage
     * app.stage.addChild(rect);
     *
     * // Don't start rendering until the graphic is uploaded to the GPU
     * app.renderer.prepare.upload(app.stage, () => {
     *     app.start();
     * });
     * @memberof PIXI
     */
    export class Prepare extends BasePrepare implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * @param {PIXI.Renderer} renderer - A reference to the current renderer
         */
        constructor(renderer: Renderer);
    }
}
declare module "packages/prepare/src/TimeLimiter" {
    /**
     * TimeLimiter limits the number of items handled by a {@link PIXI.BasePrepare} to a specified
     * number of milliseconds per frame.
     * @memberof PIXI
     */
    export class TimeLimiter {
        /** The maximum milliseconds that can be spent preparing items each frame. */
        maxMilliseconds: number;
        /**
         * The start time of the current frame.
         * @readonly
         */
        frameStart: number;
        /** @param maxMilliseconds - The maximum milliseconds that can be spent preparing items each frame. */
        constructor(maxMilliseconds: number);
        /** Resets any counting properties to start fresh on a new frame. */
        beginFrame(): void;
        /**
         * Checks to see if another item can be uploaded. This should only be called once per item.
         * @returns - If the item is allowed to be uploaded.
         */
        allowedToUpload(): boolean;
    }
}
declare module "packages/prepare/src/index" {
    import "packages/prepare/src/settings";
    export * from "packages/prepare/src/BasePrepare";
    export * from "packages/prepare/src/CountLimiter";
    export * from "packages/prepare/src/Prepare";
    export * from "packages/prepare/src/TimeLimiter";
}
declare module "packages/sprite-animated/src/AnimatedSprite" {
    import { Texture } from "packages/core/src/index";
    import { Sprite } from "packages/sprite/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    /**
     * An AnimatedSprite is a simple way to display an animation depicted by a list of textures.
     *
     * ```js
     * import { AnimatedSprite, Texture } from 'pixi.js';
     *
     * const alienImages = [
     *     'image_sequence_01.png',
     *     'image_sequence_02.png',
     *     'image_sequence_03.png',
     *     'image_sequence_04.png',
     * ];
     * const textureArray = [];
     *
     * for (let i = 0; i < 4; i++)
     * {
     *     const texture = Texture.from(alienImages[i]);
     *     textureArray.push(texture);
     * }
     *
     * const animatedSprite = new AnimatedSprite(textureArray);
     * ```
     *
     * The more efficient and simpler way to create an animated sprite is using a {@link PIXI.Spritesheet}
     * containing the animation definitions:
     * @example
     * import { AnimatedSprite, Assets } from 'pixi.js';
     *
     * const sheet = await Assets.load('assets/spritesheet.json');
     * animatedSprite = new AnimatedSprite(sheet.animations['image_sequence']);
     * @memberof PIXI
     */
    export class AnimatedSprite extends Sprite {
        /**
         * The speed that the AnimatedSprite will play at. Higher is faster, lower is slower.
         * @default 1
         */
        animationSpeed: number;
        /**
         * Whether or not the animate sprite repeats after playing.
         * @default true
         */
        loop: boolean;
        /**
         * Update anchor to [Texture's defaultAnchor]{@link PIXI.Texture#defaultAnchor} when frame changes.
         *
         * Useful with [sprite sheet animations]{@link PIXI.Spritesheet#animations} created with tools.
         * Changing anchor for each frame allows to pin sprite origin to certain moving feature
         * of the frame (e.g. left foot).
         *
         * Note: Enabling this will override any previously set `anchor` on each frame change.
         * @default false
         */
        updateAnchor: boolean;
        /**
         * User-assigned function to call when an AnimatedSprite finishes playing.
         * @example
         * animation.onComplete = () => {
         *     // Finished!
         * };
         */
        onComplete?: () => void;
        /**
         * User-assigned function to call when an AnimatedSprite changes which texture is being rendered.
         * @example
         * animation.onFrameChange = () => {
         *     // Updated!
         * };
         */
        onFrameChange?: (currentFrame: number) => void;
        /**
         * User-assigned function to call when `loop` is true, and an AnimatedSprite is played and
         * loops around to start again.
         * @example
         * animation.onLoop = () => {
         *     // Looped!
         * };
         */
        onLoop?: () => void;
        private _playing;
        private _textures;
        private _durations;
        /**
         * `true` uses PIXI.Ticker.shared to auto update animation time.
         * @default true
         */
        private _autoUpdate;
        /**
         * `true` if the instance is currently connected to PIXI.Ticker.shared to auto update animation time.
         * @default false
         */
        private _isConnectedToTicker;
        /** Elapsed time since animation has been started, used internally to display current texture. */
        private _currentTime;
        /** The texture index that was displayed last time. */
        private _previousFrame;
        /**
         * @param textures - An array of {@link PIXI.Texture} or frame
         *  objects that make up the animation.
         * @param {boolean} [autoUpdate=true] - Whether to use Ticker.shared to auto update animation time.
         */
        constructor(textures: Texture[] | FrameObject[], autoUpdate?: boolean);
        /** Stops the AnimatedSprite. */
        stop(): void;
        /** Plays the AnimatedSprite. */
        play(): void;
        /**
         * Stops the AnimatedSprite and goes to a specific frame.
         * @param frameNumber - Frame index to stop at.
         */
        gotoAndStop(frameNumber: number): void;
        /**
         * Goes to a specific frame and begins playing the AnimatedSprite.
         * @param frameNumber - Frame index to start at.
         */
        gotoAndPlay(frameNumber: number): void;
        /**
         * Updates the object transform for rendering.
         * @param deltaTime - Time since last tick.
         */
        update(deltaTime: number): void;
        /** Updates the displayed texture to match the current frame index. */
        private updateTexture;
        /**
         * Stops the AnimatedSprite and destroys it.
         * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
         *  have been set to that value.
         * @param {boolean} [options.children=false] - If set to true, all the children will have their destroy
         *      method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well.
         * @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well.
         */
        destroy(options?: IDestroyOptions | boolean): void;
        /**
         * A short hand way of creating an AnimatedSprite from an array of frame ids.
         * @param frames - The array of frames ids the AnimatedSprite will use as its texture frames.
         * @returns - The new animated sprite with the specified frames.
         */
        static fromFrames(frames: string[]): AnimatedSprite;
        /**
         * A short hand way of creating an AnimatedSprite from an array of image ids.
         * @param images - The array of image urls the AnimatedSprite will use as its texture frames.
         * @returns The new animate sprite with the specified images as frames.
         */
        static fromImages(images: string[]): AnimatedSprite;
        /**
         * The total number of frames in the AnimatedSprite. This is the same as number of textures
         * assigned to the AnimatedSprite.
         * @readonly
         * @default 0
         */
        get totalFrames(): number;
        /** The array of textures used for this AnimatedSprite. */
        get textures(): Texture[] | FrameObject[];
        set textures(value: Texture[] | FrameObject[]);
        /** The AnimatedSprite's current frame index. */
        get currentFrame(): number;
        set currentFrame(value: number);
        /**
         * Indicates if the AnimatedSprite is currently playing.
         * @readonly
         */
        get playing(): boolean;
        /** Whether to use Ticker.shared to auto update animation time. */
        get autoUpdate(): boolean;
        set autoUpdate(value: boolean);
    }
    /** @memberof PIXI.AnimatedSprite */
    export interface FrameObject {
        /** The {@link PIXI.Texture} of the frame. */
        texture: Texture;
        /** The duration of the frame, in milliseconds. */
        time: number;
    }
}
declare module "packages/sprite-animated/src/index" {
    export * from "packages/sprite-animated/src/AnimatedSprite";
}
declare module "packages/sprite-tiling/src/TilingSprite" {
    import { Rectangle, Texture, TextureMatrix, Transform } from "packages/core/src/index";
    import { Sprite } from "packages/sprite/src/index";
    import type { IBaseTextureOptions, IPointData, ISize, ObservablePoint, Renderer, TextureSource } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    export interface TilingSprite extends GlobalMixins.TilingSprite {
    }
    /**
     * A tiling sprite is a fast way of rendering a tiling image.
     * @memberof PIXI
     */
    export class TilingSprite extends Sprite {
        /** Tile transform */
        tileTransform: Transform;
        /** Matrix that is applied to UV to get the coords in Texture normalized space to coords in BaseTexture space. */
        uvMatrix: TextureMatrix;
        /**
         * Flags whether the tiling pattern should originate from the origin instead of the top-left corner in
         * local space.
         *
         * This will make the texture coordinates assigned to each vertex dependent on the value of the anchor. Without
         * this, the top-left corner always gets the (0, 0) texture coordinate.
         * @default false
         */
        uvRespectAnchor: boolean;
        /**
         * Note: The wrap mode of the texture is forced to REPEAT on render if the size of the texture
         * is a power of two, the texture's wrap mode is CLAMP, and the texture hasn't been bound yet.
         * @param texture - The texture of the tiling sprite.
         * @param width - The width of the tiling sprite.
         * @param height - The height of the tiling sprite.
         */
        constructor(texture: Texture, width?: number, height?: number);
        /**
         * Changes frame clamping in corresponding textureTransform, shortcut
         * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
         * @default 0.5
         * @member {number}
         */
        get clampMargin(): number;
        set clampMargin(value: number);
        /** The scaling of the image that is being tiled. */
        get tileScale(): ObservablePoint;
        set tileScale(value: IPointData);
        /** The offset of the image that is being tiled. */
        get tilePosition(): ObservablePoint;
        set tilePosition(value: ObservablePoint);
        /**
         * @protected
         */
        protected _onTextureUpdate(): void;
        /**
         * Renders the object using the WebGL renderer
         * @param renderer - The renderer
         */
        protected _render(renderer: Renderer): void;
        /** Updates the bounds of the tiling sprite. */
        protected _calculateBounds(): void;
        /**
         * Gets the local bounds of the sprite object.
         * @param rect - Optional output rectangle.
         * @returns The bounds.
         */
        getLocalBounds(rect?: Rectangle): Rectangle;
        /**
         * Checks if a point is inside this tiling sprite.
         * @param point - The point to check.
         * @returns Whether or not the sprite contains the point.
         */
        containsPoint(point: IPointData): boolean;
        /**
         * Destroys this sprite and optionally its texture and children
         * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
         *  have been set to that value
         * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
         *      method called as well. 'options' will be passed on to those calls.
         * @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well
         * @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
         */
        destroy(options?: IDestroyOptions | boolean): void;
        /**
         * Helper function that creates a new tiling sprite based on the source you provide.
         * The source can be - frame id, image url, video url, canvas element, video element, base texture
         * @static
         * @param {string|PIXI.Texture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
         * @param {object} options - See {@link PIXI.BaseTexture}'s constructor for options.
         * @param {number} options.width - required width of the tiling sprite
         * @param {number} options.height - required height of the tiling sprite
         * @returns {PIXI.TilingSprite} The newly created texture
         */
        static from(source: TextureSource | Texture, options: ISize & IBaseTextureOptions): TilingSprite;
        /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
        get width(): number;
        set width(value: number);
        /** The height of the TilingSprite, setting this will actually modify the scale to achieve the value set. */
        get height(): number;
        set height(value: number);
    }
}
declare module "packages/sprite-tiling/src/TilingSpriteRenderer" {
    import { ObjectRenderer, QuadUv, Shader, State } from "packages/core/src/index";
    import type { ExtensionMetadata, Renderer } from "packages/core/src/index";
    import type { TilingSprite } from "packages/sprite-tiling/src/TilingSprite";
    /**
     * WebGL renderer plugin for tiling sprites
     * @class
     * @memberof PIXI
     * @extends PIXI.ObjectRenderer
     */
    export class TilingSpriteRenderer extends ObjectRenderer {
        /** @ignore */
        static extension: ExtensionMetadata;
        shader: Shader;
        simpleShader: Shader;
        quad: QuadUv;
        readonly state: State;
        /**
         * constructor for renderer
         * @param {PIXI.Renderer} renderer - The renderer this tiling awesomeness works for.
         */
        constructor(renderer: Renderer);
        /** Creates shaders when context is initialized. */
        contextChange(): void;
        /**
         * @param {PIXI.TilingSprite} ts - tilingSprite to be rendered
         */
        render(ts: TilingSprite): void;
    }
}
declare module "packages/sprite-tiling/src/index" {
    export * from "packages/sprite-tiling/src/TilingSprite";
    export * from "packages/sprite-tiling/src/TilingSpriteRenderer";
}
declare module "packages/spritesheet/src/Spritesheet" {
    import { BaseTexture, Texture, utils } from "packages/core/src/index";
    import type { IPointData, ITextureBorders } from "packages/core/src/index";
    /**
     * Represents the JSON data for a spritesheet atlas.
     * @memberof PIXI
     */
    export interface ISpritesheetFrameData {
        frame: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
        trimmed?: boolean;
        rotated?: boolean;
        sourceSize?: {
            w: number;
            h: number;
        };
        spriteSourceSize?: {
            x: number;
            y: number;
        };
        anchor?: IPointData;
        borders?: ITextureBorders;
    }
    /**
     * Atlas format.
     * @memberof PIXI
     */
    export interface ISpritesheetData {
        frames: utils.Dict<ISpritesheetFrameData>;
        animations?: utils.Dict<string[]>;
        meta: {
            scale: string;
            related_multi_packs?: string[];
        };
    }
    /**
     * Utility class for maintaining reference to a collection
     * of Textures on a single Spritesheet.
     *
     * To access a sprite sheet from your code you may pass its JSON data file to Pixi's loader:
     *
     * ```js
     * import { Assets } from 'pixi.js';
     *
     * const sheet = await Assets.load('images/spritesheet.json');
     * ```
     *
     * Alternately, you may circumvent the loader by instantiating the Spritesheet directly:
     *
     * ```js
     * import { Spritesheet } from 'pixi.js';
     *
     * const sheet = new Spritesheet(texture, spritesheetData);
     * await sheet.parse();
     * console.log('Spritesheet ready to use!');
     * ```
     *
     * With the `sheet.textures` you can create Sprite objects, and `sheet.animations` can be used to create an AnimatedSprite.
     *
     * Here's an example of a sprite sheet JSON data file:
     * ```json
     * {
     *     "frames": {
     *         "enemy1.png":
     *         {
     *             "frame": {"x":103,"y":1,"w":32,"h":32},
     *             "spriteSourceSize": {"x":0,"y":0,"w":32,"h":32},
     *             "sourceSize": {"w":32,"h":32},
     *             "anchor": {"x":16,"y":16}
     *         },
     *         "enemy2.png":
     *         {
     *             "frame": {"x":103,"y":35,"w":32,"h":32},
     *             "spriteSourceSize": {"x":0,"y":0,"w":32,"h":32},
     *             "sourceSize": {"w":32,"h":32},
     *             "anchor": {"x":16,"y":16}
     *         },
     *         "button.png":
     *         {
     *             "frame": {"x":1,"y":1,"w":100,"h":100},
     *             "spriteSourceSize": {"x":0,"y":0,"w":100,"h":100},
     *             "sourceSize": {"w":100,"h":100},
     *             "anchor": {"x":0,"y":0},
     *             "borders": {"left":35,"top":35,"right":35,"bottom":35}
     *         }
     *     },
     *
     *     "animations": {
     *         "enemy": ["enemy1.png","enemy2.png"]
     *     },
     *
     *     "meta": {
     *         "image": "sheet.png",
     *         "format": "RGBA8888",
     *         "size": {"w":136,"h":102},
     *         "scale": "1"
     *     }
     * }
     * ```
     * Sprite sheets can be packed using tools like {@link https://codeandweb.com/texturepacker|TexturePacker},
     * {@link https://renderhjs.net/shoebox/|Shoebox} or {@link https://github.com/krzysztof-o/spritesheet.js|Spritesheet.js}.
     * Default anchor points (see {@link PIXI.Texture#defaultAnchor}), default 9-slice borders
     * (see {@link PIXI.Texture#defaultBorders}) and grouping of animation sprites are currently only
     * supported by TexturePacker.
     * @memberof PIXI
     */
    export class Spritesheet {
        /** The maximum number of Textures to build per process. */
        static readonly BATCH_SIZE = 1000;
        /** For multi-packed spritesheets, this contains a reference to all the other spritesheets it depends on. */
        linkedSheets: Spritesheet[];
        /** Reference to ths source texture. */
        baseTexture: BaseTexture;
        /**
         * A map containing all textures of the sprite sheet.
         * Can be used to create a {@link PIXI.Sprite|Sprite}:
         * @example
         * import { Sprite } from 'pixi.js';
         *
         * new Sprite(sheet.textures['image.png']);
         */
        textures: utils.Dict<Texture>;
        /**
         * A map containing the textures for each animation.
         * Can be used to create an {@link PIXI.AnimatedSprite|AnimatedSprite}:
         * @example
         * import { AnimatedSprite } from 'pixi.js';
         *
         * new AnimatedSprite(sheet.animations['anim_name']);
         */
        animations: utils.Dict<Texture[]>;
        /**
         * Reference to the original JSON data.
         * @type {object}
         */
        data: ISpritesheetData;
        /** The resolution of the spritesheet. */
        resolution: number;
        /**
         * Reference to original source image from the Loader. This reference is retained so we
         * can destroy the Texture later on. It is never used internally.
         */
        private _texture;
        /**
         * Map of spritesheet frames.
         * @type {object}
         */
        private _frames;
        /** Collection of frame names. */
        private _frameKeys;
        /** Current batch index being processed. */
        private _batchIndex;
        /**
         * Callback when parse is completed.
         * @type {Function}
         */
        private _callback;
        /**
         * @param texture - Reference to the source BaseTexture object.
         * @param {object} data - Spritesheet image data.
         * @param resolutionFilename - The filename to consider when determining
         *        the resolution of the spritesheet. If not provided, the imageUrl will
         *        be used on the BaseTexture.
         */
        constructor(texture: BaseTexture | Texture, data: ISpritesheetData, resolutionFilename?: string);
        /**
         * Generate the resolution from the filename or fallback
         * to the meta.scale field of the JSON data.
         * @param resolutionFilename - The filename to use for resolving
         *        the default resolution.
         * @returns Resolution to use for spritesheet.
         */
        private _updateResolution;
        /**
         * Parser spritesheet from loaded data. This is done asynchronously
         * to prevent creating too many Texture within a single process.
         * @method PIXI.Spritesheet#parse
         */
        parse(): Promise<utils.Dict<Texture>>;
        /**
         * Process a batch of frames
         * @param initialFrameIndex - The index of frame to start.
         */
        private _processFrames;
        /** Parse animations config. */
        private _processAnimations;
        /** The parse has completed. */
        private _parseComplete;
        /** Begin the next batch of textures. */
        private _nextBatch;
        /**
         * Destroy Spritesheet and don't use after this.
         * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
         */
        destroy(destroyBase?: boolean): void;
    }
}
declare module "packages/spritesheet/src/spritesheetAsset" {
    import { Spritesheet } from "packages/spritesheet/src/Spritesheet";
    import type { AssetExtension } from "packages/assets/src/index";
    import type { ISpritesheetData } from "packages/spritesheet/src/Spritesheet";
    export interface SpriteSheetJson extends ISpritesheetData {
        meta: {
            image: string;
            scale: string;
            related_multi_packs?: string[];
        };
    }
    /**
     * Asset extension for loading spritesheets.
     * @memberof PIXI
     * @type {PIXI.AssetExtension}
     */
    export const spritesheetAsset: AssetExtension<Spritesheet | SpriteSheetJson, any>;
}
declare module "packages/spritesheet/src/index" {
    export * from "packages/spritesheet/src/Spritesheet";
    export * from "packages/spritesheet/src/spritesheetAsset";
}
declare module "packages/text-bitmap/src/BitmapFontData" {
    /**
     * Normalized parsed data from .fnt files.
     * @memberof PIXI
     */
    export class BitmapFontData {
        /** @readonly */
        info: IBitmapFontDataInfo[];
        /** @readonly */
        common: IBitmapFontDataCommon[];
        /** @readonly */
        page: IBitmapFontDataPage[];
        /** @readonly */
        char: IBitmapFontDataChar[];
        /** @readonly */
        kerning: IBitmapFontDataKerning[];
        /** @readonly */
        distanceField: IBitmapFontDataDistanceField[];
        constructor();
    }
    /** @memberof PIXI */
    export interface IBitmapFontDataInfo {
        /** Font face */
        face: string;
        /** Font size */
        size: number;
    }
    /** @memberof PIXI */
    export interface IBitmapFontDataCommon {
        /** Line height, in pixels. */
        lineHeight: number;
    }
    /** @memberof PIXI */
    export interface IBitmapFontDataPage {
        /** Unique id for bitmap texture */
        id: number;
        /** File name */
        file: string;
    }
    /** @memberof PIXI */
    export interface IBitmapFontDataChar {
        /** Unique id of character */
        id: number;
        /** {@link PIXI.IBitmapFontDataPage} id */
        page: number;
        /** x-position of character in page. */
        x: number;
        /** y-position of character in page. */
        y: number;
        /** Width of character in page. */
        width: number;
        /** Height of character in page. */
        height: number;
        /** x-offset to apply when rendering character */
        xoffset: number;
        /** y-offset to apply when rendering character. */
        yoffset: number;
        /** Advancement to apply to next character. */
        xadvance: number;
    }
    /** @memberof PIXI */
    export interface IBitmapFontDataKerning {
        /** First character of pair */
        first: number;
        /** Second character of pair */
        second: number;
        /** x-offset to apply between first & second characters when they are next to each other. */
        amount: number;
    }
    /** @memberof PIXI */
    export interface IBitmapFontDataDistanceField {
        /** Type of distance field */
        fieldType: string;
        /** Range of distance */
        distanceRange: number;
    }
}
declare module "packages/text-bitmap/src/formats/TextFormat" {
    import { BitmapFontData } from "packages/text-bitmap/src/BitmapFontData";
    /**
     * Internal data format used to convert to BitmapFontData.
     * @private
     */
    export interface IBitmapFontRawData {
        info: {
            face: string;
            size: string;
        }[];
        common: {
            lineHeight: string;
        }[];
        page: {
            id: string;
            file: string;
        }[];
        chars: {
            count: number;
        }[];
        char: {
            id: string;
            page: string;
            x: string;
            y: string;
            width: string;
            height: string;
            xoffset: string;
            yoffset: string;
            xadvance: string;
        }[];
        kernings?: {
            count: number;
        }[];
        kerning?: {
            first: string;
            second: string;
            amount: string;
        }[];
        distanceField?: {
            fieldType: string;
            distanceRange: string;
        }[];
    }
    /**
     * BitmapFont format that's Text-based.
     * @private
     */
    export class TextFormat {
        /**
         * Check if resource refers to txt font data.
         * @param data
         * @returns - True if resource could be treated as font data, false otherwise.
         */
        static test(data: unknown): boolean;
        /**
         * Convert text font data to a javascript object.
         * @param txt - Raw string data to be converted
         * @returns - Parsed font data
         */
        static parse(txt: string): BitmapFontData;
    }
}
declare module "packages/text-bitmap/src/formats/XMLFormat" {
    import { BitmapFontData } from "packages/text-bitmap/src/BitmapFontData";
    /**
     * BitmapFont format that's XML-based.
     * @private
     */
    export class XMLFormat {
        /**
         * Check if resource refers to xml font data.
         * @param data
         * @returns - True if resource could be treated as font data, false otherwise.
         */
        static test(data: unknown): boolean;
        /**
         * Convert the XML into BitmapFontData that we can use.
         * @param xml
         * @returns - Data to use for BitmapFont
         */
        static parse(xml: Document): BitmapFontData;
    }
}
declare module "packages/text-bitmap/src/formats/XMLStringFormat" {
    import type { BitmapFontData } from "packages/text-bitmap/src/BitmapFontData";
    /**
     * BitmapFont format that's XML-based.
     * @private
     */
    export class XMLStringFormat {
        /**
         * Check if resource refers to text xml font data.
         * @param data
         * @returns - True if resource could be treated as font data, false otherwise.
         */
        static test(data: unknown): boolean;
        /**
         * Convert the text XML into BitmapFontData that we can use.
         * @param xmlTxt
         * @returns - Data to use for BitmapFont
         */
        static parse(xmlTxt: string): BitmapFontData;
    }
}
declare module "packages/text-bitmap/src/formats/index" {
    import { TextFormat } from "packages/text-bitmap/src/formats/TextFormat";
    import { XMLFormat } from "packages/text-bitmap/src/formats/XMLFormat";
    import { XMLStringFormat } from "packages/text-bitmap/src/formats/XMLStringFormat";
    const formats: readonly [typeof TextFormat, typeof XMLFormat, typeof XMLStringFormat];
    /**
     * Auto-detect BitmapFont parsing format based on data.
     * @private
     * @param {any} data - Data to detect format
     * @returns {any} Format or null
     */
    export function autoDetectFormat(data: unknown): typeof formats[number] | null;
    export type { IBitmapFontRawData } from "packages/text-bitmap/src/formats/TextFormat";
    export { TextFormat, XMLFormat, XMLStringFormat };
}
declare module "packages/text-bitmap/src/utils/generateFillStyle" {
    import type { ICanvas, ICanvasRenderingContext2D } from "packages/core/src/index";
    import type { TextMetrics, TextStyle } from "packages/text/src/index";
    /**
     * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
     * @private
     * @param canvas
     * @param context
     * @param {object} style - The style.
     * @param resolution
     * @param {string[]} lines - The lines of text.
     * @param metrics
     * @returns {string|number|CanvasGradient} The fill style
     */
    export function generateFillStyle(canvas: ICanvas, context: ICanvasRenderingContext2D, style: TextStyle, resolution: number, lines: string[], metrics: TextMetrics): string | CanvasGradient | CanvasPattern;
}
declare module "packages/text-bitmap/src/utils/drawGlyph" {
    import type { ICanvas, ICanvasRenderingContext2D } from "packages/core/src/index";
    import type { TextMetrics, TextStyle } from "packages/text/src/index";
    /**
     * Draws the glyph `metrics.text` on the given canvas.
     *
     * Ignored because not directly exposed.
     * @ignore
     * @param {PIXI.ICanvas} canvas
     * @param {PIXI.ICanvasRenderingContext2D} context
     * @param {TextMetrics} metrics
     * @param {number} x
     * @param {number} y
     * @param {number} resolution
     * @param {TextStyle} style
     */
    export function drawGlyph(canvas: ICanvas, context: ICanvasRenderingContext2D, metrics: TextMetrics, x: number, y: number, resolution: number, style: TextStyle): void;
}
declare module "packages/text-bitmap/src/utils/extractCharCode" {
    /**
     * Ponyfill for IE because it doesn't support `codePointAt`
     * @param str
     * @private
     */
    export function extractCharCode(str: string): number;
}
declare module "packages/text-bitmap/src/utils/splitTextToCharacters" {
    /**
     * Ponyfill for IE because it doesn't support `Array.from`
     * @param text
     * @private
     */
    export function splitTextToCharacters(text: string): string[];
}
declare module "packages/text-bitmap/src/utils/resolveCharacters" {
    /**
     * Processes the passed character set data and returns a flattened array of all the characters.
     *
     * Ignored because not directly exposed.
     * @ignore
     * @param {string | string[] | string[][] } chars
     * @returns {string[]} the flattened array of characters
     */
    export function resolveCharacters(chars: string | (string | string[])[]): string[];
}
declare module "packages/text-bitmap/src/utils/index" {
    export * from "packages/text-bitmap/src/utils/drawGlyph";
    export * from "packages/text-bitmap/src/utils/extractCharCode";
    export * from "packages/text-bitmap/src/utils/generateFillStyle";
    export * from "packages/text-bitmap/src/utils/resolveCharacters";
    export * from "packages/text-bitmap/src/utils/splitTextToCharacters";
}
declare module "packages/text-bitmap/src/BitmapFont" {
    import { ALPHA_MODES, MIPMAP_MODES, Texture, utils } from "packages/core/src/index";
    import { TextStyle } from "packages/text/src/index";
    import { BitmapFontData } from "packages/text-bitmap/src/BitmapFontData";
    import type { IBaseTextureOptions, SCALE_MODES } from "packages/core/src/index";
    import type { ITextStyle } from "packages/text/src/index";
    export interface IBitmapFontCharacter {
        xOffset: number;
        yOffset: number;
        xAdvance: number;
        texture: Texture;
        page: number;
        kerning: utils.Dict<number>;
    }
    type BaseOptions = Pick<IBaseTextureOptions, 'scaleMode' | 'mipmap' | 'anisotropicLevel' | 'alphaMode'>;
    /** @memberof PIXI */
    export interface IBitmapFontOptions extends BaseOptions {
        /**
         * Characters included in the font set. You can also use ranges.
         * For example, `[['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[] "]`.
         * Don't forget to include spaces ' ' in your character set!
         * @default PIXI.BitmapFont.ALPHANUMERIC
         */
        chars?: string | (string | string[])[];
        /**
         * Render resolution for glyphs.
         * @default 1
         */
        resolution?: number;
        /**
         * Padding between glyphs on texture atlas. Lower values could mean more visual artifacts
         * and bleeding from other glyphs, larger values increase the space required on the texture.
         * @default 4
         */
        padding?: number;
        /**
         * Optional width of atlas, smaller values to reduce memory.
         * @default 512
         */
        textureWidth?: number;
        /**
         * Optional height of atlas, smaller values to reduce memory.
         * @default 512
         */
        textureHeight?: number;
        /**
         * If mipmapping is enabled for texture. For instance, by default PixiJS only enables mipmapping
         * on Power-of-Two textures. If your textureWidth or textureHeight are not power-of-two, you
         * may consider enabling mipmapping to get better quality with lower font sizes. Note:
         * for MSDF/SDF fonts, mipmapping is not supported.
         * @default PIXI.BaseTexture.defaultOptions.mipmap
         */
        mipmap?: MIPMAP_MODES;
        /**
         * Anisotropic filtering level of texture.
         * @default PIXI.BaseTexture.defaultOptions.anisotropicLevel
         */
        anisotropicLevel?: number;
        /**
         * Default scale mode, linear, nearest. Nearest can be helpful for bitmap-style fonts.
         * @default PIXI.BaseTexture.defaultOptions.scaleMode
         */
        scaleMode?: SCALE_MODES;
        /**
         * Pre multiply the image alpha.  Note: for MSDF/SDF fonts, alphaMode is not supported.
         * @default PIXI.BaseTexture.defaultOptions.alphaMode
         */
        alphaMode?: ALPHA_MODES;
        /**
         * Skip generation of kerning information for the BitmapFont.
         * If true, this could potentially increase the performance, but may impact the rendered text appearance.
         * @default false
         */
        skipKerning?: boolean;
    }
    /**
     * BitmapFont represents a typeface available for use with the BitmapText class. Use the `install`
     * method for adding a font to be used.
     * @memberof PIXI
     */
    export class BitmapFont {
        /**
         * This character set includes all the letters in the alphabet (both lower- and upper- case).
         * @type {string[][]}
         * @example
         * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.ALPHA })
         */
        static readonly ALPHA: (string | string[])[];
        /**
         * This character set includes all decimal digits (from 0 to 9).
         * @type {string[][]}
         * @example
         * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.NUMERIC })
         */
        static readonly NUMERIC: string[][];
        /**
         * This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.
         * @type {string[][]}
         */
        static readonly ALPHANUMERIC: (string | string[])[];
        /**
         * This character set consists of all the ASCII table.
         * @member {string[][]}
         * @see http://www.asciitable.com/
         */
        static readonly ASCII: string[][];
        /**
         * Collection of default options when using `BitmapFont.from`.
         * @property {number} [resolution=1] -
         * @property {number} [textureWidth=512] -
         * @property {number} [textureHeight=512] -
         * @property {number} [padding=4] -
         * @property {string|string[]|string[][]} chars = PIXI.BitmapFont.ALPHANUMERIC
         */
        static readonly defaultOptions: IBitmapFontOptions;
        /** Collection of available/installed fonts. */
        static readonly available: utils.Dict<BitmapFont>;
        /** The name of the font face. */
        readonly font: string;
        /** The size of the font face in pixels. */
        readonly size: number;
        /** The line-height of the font face in pixels. */
        readonly lineHeight: number;
        /** The map of characters by character code. */
        readonly chars: utils.Dict<IBitmapFontCharacter>;
        /** The map of base page textures (i.e., sheets of glyphs). */
        readonly pageTextures: utils.Dict<Texture>;
        /** The range of the distance field in pixels. */
        readonly distanceFieldRange: number;
        /** The kind of distance field for this font or "none". */
        readonly distanceFieldType: string;
        private _ownsTextures;
        /**
         * @param data
         * @param textures
         * @param ownsTextures - Setting to `true` will destroy page textures
         *        when the font is uninstalled.
         */
        constructor(data: BitmapFontData, textures: Texture[] | utils.Dict<Texture>, ownsTextures?: boolean);
        /** Remove references to created glyph textures. */
        destroy(): void;
        /**
         * Register a new bitmap font.
         * @param data - The
         *        characters map that could be provided as xml or raw string.
         * @param textures - List of textures for each page.
         * @param ownsTextures - Set to `true` to destroy page textures
         *        when the font is uninstalled. By default fonts created with
         *        `BitmapFont.from` or from the `BitmapFontLoader` are `true`.
         * @returns {PIXI.BitmapFont} Result font object with font, size, lineHeight
         *         and char fields.
         */
        static install(data: string | XMLDocument | BitmapFontData, textures: Texture | Texture[] | utils.Dict<Texture>, ownsTextures?: boolean): BitmapFont;
        /**
         * Remove bitmap font by name.
         * @param name - Name of the font to uninstall.
         */
        static uninstall(name: string): void;
        /**
         * Generates a bitmap-font for the given style and character set. This does not support
         * kernings yet. With `style` properties, only the following non-layout properties are used:
         *
         * - {@link PIXI.TextStyle#dropShadow|dropShadow}
         * - {@link PIXI.TextStyle#dropShadowDistance|dropShadowDistance}
         * - {@link PIXI.TextStyle#dropShadowColor|dropShadowColor}
         * - {@link PIXI.TextStyle#dropShadowBlur|dropShadowBlur}
         * - {@link PIXI.TextStyle#dropShadowAngle|dropShadowAngle}
         * - {@link PIXI.TextStyle#fill|fill}
         * - {@link PIXI.TextStyle#fillGradientStops|fillGradientStops}
         * - {@link PIXI.TextStyle#fillGradientType|fillGradientType}
         * - {@link PIXI.TextStyle#fontFamily|fontFamily}
         * - {@link PIXI.TextStyle#fontSize|fontSize}
         * - {@link PIXI.TextStyle#fontVariant|fontVariant}
         * - {@link PIXI.TextStyle#fontWeight|fontWeight}
         * - {@link PIXI.TextStyle#lineJoin|lineJoin}
         * - {@link PIXI.TextStyle#miterLimit|miterLimit}
         * - {@link PIXI.TextStyle#stroke|stroke}
         * - {@link PIXI.TextStyle#strokeThickness|strokeThickness}
         * - {@link PIXI.TextStyle#textBaseline|textBaseline}
         * @param name - The name of the custom font to use with BitmapText.
         * @param textStyle - Style options to render with BitmapFont.
         * @param options - Setup options for font or name of the font.
         * @returns Font generated by style options.
         * @example
         * import { BitmapFont, BitmapText } from 'pixi.js';
         *
         * BitmapFont.from('TitleFont', {
         *     fontFamily: 'Arial',
         *     fontSize: 12,
         *     strokeThickness: 2,
         *     fill: 'purple',
         * });
         *
         * const title = new BitmapText('This is the title', { fontName: 'TitleFont' });
         */
        static from(name: string, textStyle?: TextStyle | Partial<ITextStyle>, options?: IBitmapFontOptions): BitmapFont;
    }
}
declare module "packages/text-bitmap/src/BitmapTextStyle" {
    import type { ColorSource } from "packages/core/src/index";
    import type { TextStyleAlign } from "packages/text/src/index";
    export interface IBitmapTextStyle {
        fontName: string;
        fontSize: number;
        tint: ColorSource;
        align: TextStyleAlign;
        letterSpacing: number;
        maxWidth: number;
    }
    export interface IBitmapTextFontDescriptor {
        name: string;
        size: number;
    }
}
declare module "packages/text-bitmap/src/BitmapText" {
    import { Color, ObservablePoint } from "packages/core/src/index";
    import { Container } from "packages/display/src/index";
    import { Mesh } from "packages/mesh/src/index";
    import { BitmapFont } from "packages/text-bitmap/src/BitmapFont";
    import type { ColorSource, Rectangle, Renderer } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    import type { TextStyleAlign } from "packages/text/src/index";
    import type { IBitmapTextStyle } from "packages/text-bitmap/src/BitmapTextStyle";
    interface PageMeshData {
        index: number;
        indexCount: number;
        vertexCount: number;
        uvsCount: number;
        total: number;
        mesh: Mesh;
        vertices?: Float32Array;
        uvs?: Float32Array;
        indices?: Uint16Array;
    }
    /**
     * A BitmapText object will create a line or multiple lines of text using bitmap font.
     *
     * The primary advantage of this class over Text is that all of your textures are pre-generated and loading,
     * meaning that rendering is fast, and changing text has no performance implications.
     *
     * Supporting character sets other than latin, such as CJK languages, may be impractical due to the number of characters.
     *
     * To split a line you can use '\n', '\r' or '\r\n' in your string.
     *
     * PixiJS can auto-generate fonts on-the-fly using BitmapFont or use fnt files provided by:
     * http://www.angelcode.com/products/bmfont/ for Windows or
     * http://www.bmglyph.com/ for Mac.
     *
     * You can also use SDF, MSDF and MTSDF BitmapFonts for vector-like scaling appearance provided by:
     * https://github.com/soimy/msdf-bmfont-xml for SDF and MSDF fnt files or
     * https://github.com/Chlumsky/msdf-atlas-gen for SDF, MSDF and MTSDF json files
     *
     * A BitmapText can only be created when the font is loaded.
     * @example
     * import { BitmapText } from 'pixi.js';
     *
     * // in this case the font is in a file called 'desyrel.fnt'
     * const bitmapText = new BitmapText('text using a fancy font!', {
     *     fontName: 'Desyrel',
     *     fontSize: 35,
     *     align: 'right',
     * });
     * @memberof PIXI
     */
    export class BitmapText extends Container {
        static styleDefaults: Partial<IBitmapTextStyle>;
        /** Set to `true` if the BitmapText needs to be redrawn. */
        dirty: boolean;
        /**
         * The resolution / device pixel ratio of the canvas.
         *
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         * @default PIXI.settings.RESOLUTION
         */
        _resolution: number;
        _autoResolution: boolean;
        /**
         * Private tracker for the width of the overall text.
         * @private
         */
        protected _textWidth: number;
        /**
         * Private tracker for the height of the overall text.
         * @private
         */
        protected _textHeight: number;
        /**
         * Private tracker for the current text.
         * @private
         */
        protected _text: string;
        /**
         * The max width of this bitmap text in pixels. If the text provided is longer than the
         * value provided, line breaks will be automatically inserted in the last whitespace.
         * Disable by setting value to 0
         * @private
         */
        protected _maxWidth: number;
        /**
         * The max line height. This is useful when trying to use the total height of the Text,
         * ie: when trying to vertically align. (Internally used)
         * @private
         */
        protected _maxLineHeight: number;
        /**
         * Letter spacing. This is useful for setting the space between characters.
         * @private
         */
        protected _letterSpacing: number;
        /**
         * Text anchor.
         * @readonly
         * @private
         */
        protected _anchor: ObservablePoint;
        /**
         * Private tracker for the current font.
         * @private
         */
        protected _font?: BitmapFont;
        /**
         * Private tracker for the current font name.
         * @private
         */
        protected _fontName: string;
        /**
         * Private tracker for the current font size.
         * @private
         */
        protected _fontSize?: number;
        /**
         * Private tracker for the current text align.
         * @type {string}
         * @private
         */
        protected _align: TextStyleAlign;
        /** Collection of page mesh data. */
        protected _activePagesMeshData: PageMeshData[];
        /**
         * Private tracker for the current tint.
         * @private
         */
        protected _tintColor: Color;
        /**
         * If true PixiJS will Math.floor() x/y values when rendering.
         * @default PIXI.settings.ROUND_PIXELS
         */
        protected _roundPixels: boolean;
        /** Cached char texture is destroyed when BitmapText is destroyed. */
        private _textureCache;
        /**
         * @param text - A string that you would like the text to display.
         * @param style - The style parameters.
         * @param {string} style.fontName - The installed BitmapFont name.
         * @param {number} [style.fontSize] - The size of the font in pixels, e.g. 24. If undefined,
         *.     this will default to the BitmapFont size.
         * @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center', 'right' or 'justify'),
         *      does not affect single line text.
         * @param {PIXI.ColorSource} [style.tint=0xFFFFFF] - The tint color.
         * @param {number} [style.letterSpacing=0] - The amount of spacing between letters.
         * @param {number} [style.maxWidth=0] - The max width of the text before line wrapping.
         */
        constructor(text: string, style?: Partial<IBitmapTextStyle>);
        /** Renders text and updates it when needed. This should only be called if the BitmapFont is regenerated. */
        updateText(): void;
        updateTransform(): void;
        _render(renderer: Renderer): void;
        /**
         * Validates text before calling parent's getLocalBounds
         * @returns - The rectangular bounding area
         */
        getLocalBounds(): Rectangle;
        /**
         * Updates text when needed
         * @private
         */
        protected validate(): void;
        /**
         * The tint of the BitmapText object.
         * @default 0xffffff
         */
        get tint(): ColorSource;
        set tint(value: ColorSource);
        /**
         * The alignment of the BitmapText object.
         * @member {string}
         * @default 'left'
         */
        get align(): TextStyleAlign;
        set align(value: TextStyleAlign);
        /** The name of the BitmapFont. */
        get fontName(): string;
        set fontName(value: string);
        /** The size of the font to display. */
        get fontSize(): number;
        set fontSize(value: number | undefined);
        /**
         * The anchor sets the origin point of the text.
         *
         * The default is `(0,0)`, this means the text's origin is the top left.
         *
         * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
         *
         * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
         */
        get anchor(): ObservablePoint;
        set anchor(value: ObservablePoint);
        /** The text of the BitmapText object. */
        get text(): string;
        set text(text: string);
        /**
         * The max width of this bitmap text in pixels. If the text provided is longer than the
         * value provided, line breaks will be automatically inserted in the last whitespace.
         * Disable by setting the value to 0.
         */
        get maxWidth(): number;
        set maxWidth(value: number);
        /**
         * The max line height. This is useful when trying to use the total height of the Text,
         * i.e. when trying to vertically align.
         * @readonly
         */
        get maxLineHeight(): number;
        /**
         * The width of the overall text, different from fontSize,
         * which is defined in the style object.
         * @readonly
         */
        get textWidth(): number;
        /** Additional space between characters. */
        get letterSpacing(): number;
        set letterSpacing(value: number);
        /**
         * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Advantages can include sharper image quality (like text) and faster rendering on canvas.
         * The main disadvantage is movement of objects may appear less smooth.
         * To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
         * @default PIXI.settings.ROUND_PIXELS
         */
        get roundPixels(): boolean;
        set roundPixels(value: boolean);
        /**
         * The height of the overall text, different from fontSize,
         * which is defined in the style object.
         * @readonly
         */
        get textHeight(): number;
        /**
         * The resolution / device pixel ratio of the canvas.
         *
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         * @default 1
         */
        get resolution(): number;
        set resolution(value: number);
        destroy(options?: boolean | IDestroyOptions): void;
    }
}
declare module "packages/text-bitmap/src/loadBitmapFont" {
    import { BitmapFont } from "packages/text-bitmap/src/BitmapFont";
    import type { LoaderParser } from "packages/assets/src/index";
    /** simple loader plugin for loading in bitmap fonts! */
    export const loadBitmapFont: LoaderParser<string | BitmapFont, any, Record<string, any>>;
}
declare module "packages/text-bitmap/src/index" {
    export * from "packages/text-bitmap/src/BitmapFont";
    export * from "packages/text-bitmap/src/BitmapFontData";
    export * from "packages/text-bitmap/src/BitmapText";
    export * from "packages/text-bitmap/src/BitmapTextStyle";
    export * from "packages/text-bitmap/src/formats/index";
    export * from "packages/text-bitmap/src/loadBitmapFont";
}
declare module "packages/text-html/src/HTMLTextStyle" {
    import { TextStyle } from "packages/text/src/index";
    import type { ITextStyle, TextStyleFontStyle, TextStyleFontWeight, TextStyleLineJoin, TextStyleTextBaseline } from "packages/text/src/index";
    /**
     * HTMLText support more white-space options.
     * @memberof PIXI
     * @since 7.2.0
     * @see PIXI.IHTMLTextStyle
     */
    export type HTMLTextStyleWhiteSpace = 'normal' | 'pre' | 'pre-line' | 'nowrap' | 'pre-wrap';
    /**
     * FontFace display options.
     * @memberof PIXI
     * @since 7.3.0
     */
    export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    type ITextStyleIgnore = 'whiteSpace' | 'fillGradientStops' | 'fillGradientType' | 'miterLimit' | 'textBaseline' | 'trim' | 'leading' | 'lineJoin';
    /**
     * Modifed versions from ITextStyle.
     * @memberof PIXI
     * @extends PIXI.ITextStyle
     * @since 7.2.0
     */
    export interface IHTMLTextStyle extends Omit<ITextStyle, ITextStyleIgnore> {
        /** White-space with expanded options. */
        whiteSpace: HTMLTextStyleWhiteSpace;
    }
    export interface IHTMLTextFontOptions extends Pick<IHTMLFont, 'weight' | 'style' | 'family'> {
        /** font-display property */
        display: FontDisplay;
    }
    /**
     * Font information for HTMLText
     * @memberof PIXI
     * @since 7.2.0
     */
    export interface IHTMLFont {
        /** User-supplied URL request */
        originalUrl: string;
        /** Base64 string for font */
        dataSrc: string;
        /** FontFace installed in the document */
        fontFace: FontFace | null;
        /** Blob-based URL for font */
        src: string;
        /** Family name of font */
        family: string;
        /** Weight of the font */
        weight: TextStyleFontWeight;
        /** Style of the font */
        style: TextStyleFontStyle;
        /** Display property of the font */
        display: FontDisplay;
        /** Reference counter */
        refs: number;
    }
    /**
     * Used internally to restrict text style usage and convert easily to CSS.
     * @class
     * @memberof PIXI
     * @param {PIXI.ITextStyle|PIXI.IHTMLTextStyle} [style] - Style to copy.
     * @since 7.2.0
     */
    export class HTMLTextStyle extends TextStyle {
        /** The collection of installed fonts */
        static availableFonts: Record<string, IHTMLFont>;
        /**
         * List of default options, these are largely the same as TextStyle,
         * with the exception of whiteSpace, which is set to 'normal' by default.
         */
        static readonly defaultOptions: IHTMLTextStyle;
        /** For using custom fonts */
        private _fonts;
        /** List of internal style rules */
        private _overrides;
        /** Global rules or stylesheet, useful for creating rules for rendering */
        private _stylesheet;
        /** Track font changes internally */
        private fontsDirty;
        /**
         * Convert a TextStyle to HTMLTextStyle
         * @param originalStyle
         * @example
         * import {TextStyle } from 'pixi.js';
         * import {HTMLTextStyle} from '@pixi/text-html';
         * const style = new TextStyle();
         * const htmlStyle = HTMLTextStyle.from(style);
         */
        static from(originalStyle: TextStyle | Partial<IHTMLTextStyle>): HTMLTextStyle;
        /** Clear the current font */
        cleanFonts(): void;
        /**
         * Because of how HTMLText renders, fonts need to be imported
         * @param url
         * @param options
         */
        loadFont(url: string, options?: Partial<IHTMLTextFontOptions>): Promise<void>;
        /**
         * Add a style override, this can be any CSS property
         * it will override any built-in style. This is the
         * property and the value as a string (e.g., `color: red`).
         * This will override any other internal style.
         * @param {string} value - CSS style(s) to add.
         * @example
         * style.addOverride('background-color: red');
         */
        addOverride(...value: string[]): void;
        /**
         * Remove any overrides that match the value.
         * @param {string} value - CSS style to remove.
         * @example
         * style.removeOverride('background-color: red');
         */
        removeOverride(...value: string[]): void;
        /**
         * Internally converts all of the style properties into CSS equivalents.
         * @param scale
         * @returns The CSS style string, for setting `style` property of root HTMLElement.
         */
        toCSS(scale: number): string;
        /** Get the font CSS styles from the loaded font, If available. */
        toGlobalCSS(): string;
        /** Internal stylesheet contents, useful for creating rules for rendering */
        get stylesheet(): string;
        set stylesheet(value: string);
        /**
         * Convert numerical colors into hex-strings
         * @param color
         */
        private normalizeColor;
        /** Convert the internal drop-shadow settings to CSS text-shadow */
        private dropShadowToCSS;
        /** Resets all properties to the defaults specified in TextStyle.prototype._default */
        reset(): void;
        /**
         * Called after the image is loaded but before drawing to the canvas.
         * Mostly used to handle Safari's font loading bug.
         * @ignore
         */
        onBeforeDraw(): Promise<void>;
        /**
         * Proving that Safari is the new IE
         * @ignore
         */
        private get isSafari();
        set fillGradientStops(_value: number[]);
        get fillGradientStops(): number[];
        set fillGradientType(_value: number);
        get fillGradientType(): number;
        set miterLimit(_value: number);
        get miterLimit(): number;
        set trim(_value: boolean);
        get trim(): boolean;
        set textBaseline(_value: TextStyleTextBaseline);
        get textBaseline(): TextStyleTextBaseline;
        set leading(_value: number);
        get leading(): number;
        set lineJoin(_value: TextStyleLineJoin);
        get lineJoin(): TextStyleLineJoin;
    }
}
declare module "packages/text-html/src/HTMLText" {
    import { Rectangle } from "packages/core/src/index";
    import { Sprite } from "packages/sprite/src/index";
    import { TextStyle } from "packages/text/src/index";
    import { HTMLTextStyle } from "packages/text-html/src/HTMLTextStyle";
    import type { IRenderer, ISize, Renderer } from "packages/core/src/index";
    import type { IDestroyOptions } from "packages/display/src/index";
    import type { ITextStyle } from "packages/text/src/index";
    /**
     * Alternative to {@link PIXI.Text|Text} but supports multi-style HTML text. There are
     * few key differences between this and {@link PIXI.Text|Text}:
     * <br>&bull; HTMLText not support {@link https://caniuse.com/mdn-svg_elements_foreignobject|Internet Explorer}.
     * <br>&bull; Rendering is text asynchronous. If statically rendering, listen to `update` event on BaseTexture.
     * <br>&bull; Does not support all style options (e.g., `lineJoin`, `leading`, `textBaseline`, `trim`, `miterLimit`,
     *   `fillGradientStops`, `fillGradientType`)
     * @example
     * import { HTMLText } from 'pixi.js';
     *
     * const text = new HTMLText("Hello <b>World</b>", { fontSize: 20 });
     *
     * text.texture.baseTexture.on('update', () => {
     *   console.log('Text is redrawn!');
     * });
     * @class
     * @memberof PIXI
     * @extends PIXI.Sprite
     * @since 7.2.0
     */
    export class HTMLText extends Sprite {
        /**
         * Default opens when destroying.
         * @type {PIXI.IDestroyOptions}
         * @property {boolean} [texture=true] - Whether to destroy the texture.
         * @property {boolean} [children=false] - Whether to destroy the children.
         * @property {boolean} [baseTexture=true] - Whether to destroy the base texture.
         */
        static defaultDestroyOptions: IDestroyOptions;
        /** Default maxWidth, set at construction */
        static defaultMaxWidth: number;
        /** Default maxHeight, set at construction */
        static defaultMaxHeight: number;
        /** Default resolution, make sure autoResolution or defaultAutoResolution is `false`. */
        static defaultResolution: number | undefined;
        /** Default autoResolution for all HTMLText objects */
        static defaultAutoResolution: boolean;
        /** The maximum width in rendered pixels that the content can be, any larger will be hidden */
        maxWidth: number;
        /** The maximum height in rendered pixels that the content can be, any larger will be hidden */
        maxHeight: number;
        private _domElement;
        private _styleElement;
        private _svgRoot;
        private _foreignObject;
        private _image;
        private _loadImage;
        private _resolution;
        private _text;
        private _style;
        private _autoResolution;
        private _loading;
        private localStyleID;
        private dirty;
        /** The HTMLTextStyle object is owned by this instance */
        private ownsStyle;
        /**
         * @param {string} [text] - Text contents
         * @param {PIXI.HTMLTextStyle|PIXI.TextStyle|PIXI.ITextStyle} [style] - Style setting to use.
         *        Strongly recommend using an HTMLTextStyle object. Providing a PIXI.TextStyle
         *        will convert the TextStyle to an HTMLTextStyle and will no longer be linked.
         */
        constructor(text?: string, style?: HTMLTextStyle | TextStyle | Partial<ITextStyle>);
        /**
         * Calculate the size of the output text without actually drawing it.
         * This includes the `padding` in the `style` object.
         * This can be used as a fast-pass to do things like text-fitting.
         * @param {object} [overrides] - Overrides for the text, style, and resolution.
         * @param {string} [overrides.text] - The text to measure, if not specified, the current text is used.
         * @param {PIXI.HTMLTextStyle} [overrides.style] - The style to measure, if not specified, the current style is used.
         * @param {number} [overrides.resolution] - The resolution to measure, if not specified, the current resolution is used.
         * @returns {PIXI.ISize} Width and height of the measured text.
         */
        measureText(overrides?: {
            text?: string;
            style?: HTMLTextStyle;
            resolution?: number;
        }): ISize;
        /**
         * Manually refresh the text.
         * @public
         * @param {boolean} respectDirty - Whether to abort updating the
         *        text if the Text isn't dirty and the function is called.
         */
        updateText(respectDirty?: boolean): Promise<void>;
        /** The raw image element that is rendered under-the-hood. */
        get source(): HTMLImageElement;
        /**
         * Update the texture resource.
         * @private
         */
        updateTexture(): void;
        /**
         * Renders the object using the WebGL renderer
         * @param {PIXI.Renderer} renderer - The renderer
         * @private
         */
        _render(renderer: Renderer): void;
        /**
         * Renders the object using the Canvas Renderer.
         * @private
         * @param {PIXI.CanvasRenderer} renderer - The renderer
         */
        _renderCanvas(renderer: IRenderer): void;
        /**
         * Get the local bounds.
         * @param {PIXI.Rectangle} rect - Input rectangle.
         * @returns {PIXI.Rectangle} Local bounds
         */
        getLocalBounds(rect: Rectangle): Rectangle;
        _calculateBounds(): void;
        /**
         * Handle dirty style changes
         * @private
         */
        _onStyleChange(): void;
        /**
         * Destroy this Text object. Don't use after calling.
         * @param {boolean|object} options - Same as Sprite destroy options.
         */
        destroy(options?: boolean | IDestroyOptions | undefined): void;
        /**
         * Get the width in pixels.
         * @member {number}
         */
        get width(): number;
        set width(value: number);
        /**
         * Get the height in pixels.
         * @member {number}
         */
        get height(): number;
        set height(value: number);
        /** The base style to render with text. */
        get style(): HTMLTextStyle;
        set style(style: HTMLTextStyle | TextStyle | Partial<ITextStyle>);
        /**
         * Contents of text. This can be HTML text and include tags.
         * @example
         * const text = new HTMLText('This is a <em>styled</em> text!');
         * @member {string}
         */
        get text(): string;
        set text(text: string);
        /**
         * The resolution / device pixel ratio of the canvas.
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         * @member {number}
         * @default 1
         */
        get resolution(): number;
        set resolution(value: number);
        /**
         * Sanitise text - replace `<br>` with `<br/>`, `&nbsp;` with `&#160;`
         * @param text
         * @see https://www.sitepoint.com/community/t/xhtml-1-0-transitional-xml-parsing-error-entity-nbsp-not-defined/3392/3
         */
        private sanitiseText;
    }
}
declare module "packages/text-html/src/index" {
    export * from "packages/text-html/src/HTMLText";
    export * from "packages/text-html/src/HTMLTextStyle";
}
declare module "bundles/pixi.js/src/index" {
    import "packages/mixin-cache-as-bitmap/src/index";
    import "packages/mixin-get-child-by-name/src/index";
    import "packages/mixin-get-global-position/src/index";
    export * from "bundles/pixi.js/src/filters";
    export * from "packages/accessibility/src/index";
    export * from "packages/app/src/index";
    export * from "packages/assets/src/index";
    export * from "packages/compressed-textures/src/index";
    export * from "packages/core/src/index";
    export * from "packages/display/src/index";
    export * from "packages/events/src/index";
    export * from "packages/extract/src/index";
    export * from "packages/filter-alpha/src/index";
    export * from "packages/filter-blur/src/index";
    export * from "packages/filter-color-matrix/src/index";
    export * from "packages/filter-displacement/src/index";
    export * from "packages/filter-fxaa/src/index";
    export * from "packages/filter-noise/src/index";
    export * from "packages/graphics/src/index";
    export * from "packages/mesh/src/index";
    export * from "packages/mesh-extras/src/index";
    export * from "packages/particle-container/src/index";
    export * from "packages/prepare/src/index";
    export * from "packages/sprite/src/index";
    export * from "packages/sprite-animated/src/index";
    export * from "packages/sprite-tiling/src/index";
    export * from "packages/spritesheet/src/index";
    export * from "packages/text/src/index";
    export * from "packages/text-bitmap/src/index";
    export * from "packages/text-html/src/index";
}
declare module "packages/canvas-renderer/src/BaseTexture" { }
declare module "packages/canvas-renderer/src/utils/canUseNewCanvasBlendModes" {
    /**
     * Checks whether the Canvas BlendModes are supported by the current browser
     * @private
     * @returns {boolean} whether they are supported
     */
    export function canUseNewCanvasBlendModes(): boolean;
}
declare module "packages/canvas-renderer/src/utils/mapCanvasBlendModesToPixi" {
    /**
     * Maps blend combinations to Canvas.
     * @memberof PIXI
     * @function mapCanvasBlendModesToPixi
     * @private
     * @param {string[]} [array=[]] - The array to output into.
     * @returns {string[]} Mapped modes.
     */
    export function mapCanvasBlendModesToPixi(array?: string[]): string[];
}
declare module "packages/canvas-renderer/src/CanvasMaskSystem" {
    import type { ExtensionMetadata, ISystem, MaskData } from "packages/core/src/index";
    import type { Container } from "packages/display/src/index";
    import type { Graphics } from "packages/graphics/src/index";
    import type { CanvasRenderer } from "packages/canvas-renderer/src/CanvasRenderer";
    /**
     * A set of functions used to handle masking.
     *
     * Sprite masking is not supported on the CanvasRenderer.
     * @class
     * @memberof PIXI
     */
    export class CanvasMaskSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A reference to the current renderer */
        private renderer;
        private _foundShapes;
        /** @param renderer - A reference to the current renderer */
        constructor(renderer: CanvasRenderer);
        /**
         * This method adds it to the current stack of masks.
         * @param maskData - the maskData that will be pushed
         */
        pushMask(maskData: MaskData | Graphics): void;
        /**
         * Renders all PIXI.Graphics shapes in a subtree.
         * @param container - container to scan.
         * @param out - where to put found shapes
         */
        recursiveFindShapes(container: Container, out: Array<Graphics>): void;
        /**
         * Renders a PIXI.Graphics shape.
         * @param graphics - The object to render.
         */
        renderGraphicsShape(graphics: Graphics): void;
        /**
         * Restores the current drawing context to the state it was before the mask was applied.
         * @param renderer - The renderer context to use.
         */
        popMask(renderer: CanvasRenderer): void;
        /** Destroys this canvas mask manager. */
        destroy(): void;
    }
}
declare module "packages/canvas-renderer/src/CanvasObjectRendererSystem" {
    import type { ExtensionMetadata, IRenderableObject, IRendererRenderOptions, ISystem } from "packages/core/src/index";
    import type { CanvasRenderer } from "packages/canvas-renderer/src/CanvasRenderer";
    /**
     * system that provides a render function that focussing on rendering Pixi Scene Graph objects
     * to either the main view or to a renderTexture. Used for Canvas `2d` contexts
     * @memberof PIXI
     */
    export class CanvasObjectRendererSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A reference to the current renderer */
        private renderer;
        renderingToScreen: boolean;
        lastObjectRendered: IRenderableObject;
        /** @param renderer - A reference to the current renderer */
        constructor(renderer: CanvasRenderer);
        /**
         * Renders the object to its Canvas view.
         * @param displayObject - The object to be rendered.
         * @param options - the options to be passed to the renderer
         */
        render(displayObject: IRenderableObject, options?: IRendererRenderOptions): void;
        destroy(): void;
    }
}
declare module "packages/canvas-renderer/src/CanvasRenderer" {
    import { RENDERER_TYPE, SystemManager } from "packages/core/src/index";
    import type { BackgroundSystem, BLEND_MODES, ColorSource, ExtensionMetadata, GenerateTextureSystem, ICanvas, ICanvasRenderingContext2D, IGenerateTextureOptions, IRenderableObject, IRenderer, IRendererOptions, IRendererPlugins, IRendererRenderOptions, Matrix, PluginSystem, Rectangle, RenderTexture, StartupSystem, ViewSystem } from "packages/core/src/index";
    import type { DisplayObject } from "packages/display/src/index";
    import type { CanvasContextSystem, SmoothingEnabledProperties } from "packages/canvas-renderer/src/CanvasContextSystem";
    import type { CanvasMaskSystem } from "packages/canvas-renderer/src/CanvasMaskSystem";
    import type { CanvasObjectRendererSystem } from "packages/canvas-renderer/src/CanvasObjectRendererSystem";
    export interface CanvasRenderer extends GlobalMixins.CanvasRenderer {
    }
    /**
     * The CanvasRenderer draws the scene and all its content onto a 2d canvas.
     *
     * This renderer should be used for browsers that support WebGL.
     *
     * This renderer should be used for browsers that do not support WebGL.
     * Don't forget to add the view to your DOM or you will not see anything!
     *
     * Renderer is composed of systems that manage specific tasks. The following systems are added by default
     * whenever you create a renderer:
     *
     * | System                               | Description                                                                   |
     * | ------------------------------------ | ----------------------------------------------------------------------------- |
     *
     * | Generic Systems                      | Systems that manage functionality that all renderer types share               |
     * | ------------------------------------ | ----------------------------------------------------------------------------- |
     * | {@link PIXI.ViewSystem}              | This manages the main view of the renderer usually a Canvas                   |
     * | {@link PIXI.PluginSystem}            | This manages plugins for the renderer                                         |
     * | {@link PIXI.BackgroundSystem}        | This manages the main views background color and alpha                        |
     * | {@link PIXI.StartupSystem}           | Boots up a renderer and initiatives all the systems                           |
     * | {@link PIXI.EventSystem}             | This manages UI events.                                                       |
     * | {@link PIXI.GenerateTextureSystem}   | This adds the ability to generate textures from any PIXI.DisplayObject        |
     *
     * | PixiJS High-Level Systems            | Set of specific systems designed to work with PixiJS objects                  |
     * | ------------------------------------ | ----------------------------------------------------------------------------- |
     * | {@link PIXI.CanvasContextSystem}     | This manages the canvas `2d` contexts and their state                         |
     * | {@link PIXI.CanvasMaskSystem}        | This manages masking operations.                                              |
     * | {@link PIXI.CanvasExtract}           | This extracts image data from a PIXI.DisplayObject                            |
     * | {@link PIXI.CanvasPrepare}           | This prepares a PIXI.DisplayObject async for rendering                        |
     *
     * The breadth of the API surface provided by the renderer is contained within these systems.
     * @class
     * @memberof PIXI
     */
    export class CanvasRenderer extends SystemManager<CanvasRenderer> implements IRenderer {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * Options passed to the constructor.
         * @member {PIXI.IRendererOptions}
         */
        readonly options: IRendererOptions;
        /**
         * Used with autoDetectRenderer, this is always supported for any environment, so return true.
         * @ignore
         */
        static test(): boolean;
        /**
         * Fired after rendering finishes.
         * @event PIXI.CanvasRenderer#postrender
         */
        /**
         * Fired before rendering starts.
         * @event PIXI.CanvasRenderer#prerender
         */
        /**
         * The type of the renderer. will be PIXI.RENDERER_TYPE.CANVAS
         * @member {number}
         * @see PIXI.RENDERER_TYPE
         */
        readonly type = RENDERER_TYPE.CANVAS;
        /** When logging Pixi to the console, this is the name we will show */
        readonly rendererLogId = "Canvas";
        /**
         * textureGenerator system instance
         * @readonly
         */
        textureGenerator: GenerateTextureSystem;
        /**
         * background system instance
         * @readonly
         */
        background: BackgroundSystem;
        /**
         * canvas mask system instance
         * @readonly
         */
        mask: CanvasMaskSystem;
        /**
         * plugin system instance
         * @readonly
         */
        _plugin: PluginSystem;
        /**
         * Canvas context system instance
         * @readonly
         */
        canvasContext: CanvasContextSystem;
        /**
         * Startup system instance
         * @readonly
         */
        startup: StartupSystem;
        /**
         * View system instance
         * @readonly
         */
        _view: ViewSystem;
        /**
         * renderer system instance
         * @readonly
         */
        objectRenderer: CanvasObjectRendererSystem;
        /**
         * @param {PIXI.IRendererOptions} [options] - See {@link PIXI.settings.RENDER_OPTIONS} for defaults.
         */
        constructor(options?: Partial<IRendererOptions>);
        /**
         * Useful function that returns a texture of the display object that can then be used to create sprites
         * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
         * @param displayObject - The displayObject the object will be generated from.
         * @param {IGenerateTextureOptions} options - Generate texture options.
         * @param {PIXI.Rectangle} options.region - The region of the displayObject, that shall be rendered,
         *        if no region is specified, defaults to the local bounds of the displayObject.
         * @param {number} [options.resolution] - If not given, the renderer's resolution is used.
         * @param {PIXI.MSAA_QUALITY} [options.multisample] - If not given, the renderer's multisample is used.
         * @returns A texture of the graphics object.
         */
        generateTexture(displayObject: IRenderableObject, options?: IGenerateTextureOptions): RenderTexture;
        reset(): void;
        /**
         * Renders the object to its WebGL view.
         * @param displayObject - The object to be rendered.
         * @param options - Object to use for render options.
         * @param {PIXI.RenderTexture} [options.renderTexture] - The render texture to render to.
         * @param {boolean} [options.clear=true] - Should the canvas be cleared before the new render.
         * @param {PIXI.Matrix} [options.transform] - A transform to apply to the render texture before rendering.
         * @param {boolean} [options.skipUpdateTransform=false] - Should we skip the update transform pass?
         */
        render(displayObject: DisplayObject, options?: IRendererRenderOptions): void;
        /** Clear the canvas of renderer. */
        clear(): void;
        /**
         * Removes everything from the renderer and optionally removes the Canvas DOM element.
         * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
         */
        destroy(removeView?: boolean): void;
        /** Collection of plugins */
        get plugins(): IRendererPlugins;
        /**
         * Resizes the canvas view to the specified width and height.
         * @param desiredScreenWidth - the desired width of the screen
         * @param desiredScreenHeight - the desired height of the screen
         */
        resize(desiredScreenWidth: number, desiredScreenHeight: number): void;
        /**
         * Same as view.width, actual number of pixels in the canvas by horizontal.
         * @member {number}
         * @readonly
         * @default 800
         */
        get width(): number;
        /**
         * Same as view.height, actual number of pixels in the canvas by vertical.
         * @member {number}
         * @readonly
         * @default 600
         */
        get height(): number;
        /** The resolution / device pixel ratio of the renderer. */
        get resolution(): number;
        set resolution(value: number);
        /** Whether CSS dimensions of canvas view should be resized to screen dimensions automatically. */
        get autoDensity(): boolean;
        /** The canvas element that everything is drawn to.*/
        get view(): ICanvas;
        /**
         * Measurements of the screen. (0, 0, screenWidth, screenHeight).
         * Its safe to use as filterArea or hitArea for the whole stage.
         */
        get screen(): Rectangle;
        /** the last object rendered by the renderer. Useful for other plugins like interaction managers */
        get lastObjectRendered(): IRenderableObject;
        /** Flag if we are rendering to the screen vs renderTexture */
        get renderingToScreen(): boolean;
        /**
         * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
         * If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
         * frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
         * to clear the canvas every frame. Disable this by setting this to false. For example, if
         * your game has a canvas filling background image you often don't need this set.
         */
        get clearBeforeRender(): boolean;
        /**
         * Tracks the blend modes useful for this renderer.
         * @deprecated since 7.0.0 use `renderer.canvasContext.blendModes` instead
         */
        get blendModes(): string[];
        /**
         * system that manages canvas masks
         * @deprecated since 7.0.0 use `renderer.canvasContext.mask`
         */
        get maskManager(): CanvasMaskSystem;
        /**
         * Boolean flag controlling canvas refresh.
         * @deprecated since 7.0.0
         */
        get refresh(): boolean;
        /**
         * The root canvas 2d context that everything is drawn with.
         * @deprecated since 7.0.0 Use `renderer.canvasContext.rootContext instead
         */
        get rootContext(): ICanvasRenderingContext2D;
        /**
         * The currently active canvas 2d context (could change with renderTextures)
         * @deprecated since 7.0.0 Use `renderer.canvasContext.activeContext instead
         */
        get context(): ICanvasRenderingContext2D;
        /**
         * The canvas property used to set the canvas smoothing property.
         * @deprecated since 7.0.0 Use `renderer.canvasContext.smoothProperty` instead.
         */
        get smoothProperty(): SmoothingEnabledProperties;
        /**
         * Sets the blend mode of the renderer.
         * @param {number} blendMode - See {@link PIXI.BLEND_MODES} for valid values.
         * @param {boolean} [readyForOuterBlend=false] - Some blendModes are dangerous, they affect outer space of sprite.
         * Pass `true` only if you are ready to use them.
         * @deprecated since 7.0.0 Use `renderer.canvasContext.setBlendMode` instead.
         */
        setBlendMode(blendMode: BLEND_MODES, readyForOuterBlend?: boolean): void;
        /**
         * Checks if blend mode has changed.
         * @deprecated since 7.0.0 Use `renderer.canvasContext.invalidateBlendMode` instead.
         */
        invalidateBlendMode(): void;
        /**
         * Sets matrix of context.
         * called only from render() methods
         * takes care about resolution
         * @param transform - world matrix of current element
         * @param roundPixels - whether to round (tx,ty) coords
         * @param localResolution - If specified, used instead of `renderer.resolution` for local scaling
         * @deprecated since 7.0.0 - Use `renderer.canvasContext.setContextTransform` instead.
         */
        setContextTransform(transform: Matrix, roundPixels?: boolean, localResolution?: number): void;
        /**
         * The background color to fill if not transparent
         * @deprecated since 7.0.0
         */
        get backgroundColor(): ColorSource;
        /**
         * @deprecated since 7.0.0
         * @ignore
         */
        set backgroundColor(value: ColorSource);
        /**
         * The background color alpha. Setting this to 0 will make the canvas transparent.
         * @member {number}
         * @deprecated since 7.0.0
         */
        get backgroundAlpha(): number;
        /**
         * @deprecated since 7.0.0
         * @ignore
         */
        set backgroundAlpha(value: number);
        /**
         * old abstract function not used by canvas renderer
         * @deprecated since 7.0.0
         */
        get preserveDrawingBuffer(): boolean;
        /**
         * old abstract function not used by canvas renderer
         * @deprecated since 7.0.0
         */
        get useContextAlpha(): boolean;
        /** @private */
        static readonly __plugins: IRendererPlugins;
        /** @private */
        static readonly __systems: Record<string, any>;
    }
}
declare module "packages/canvas-renderer/src/CanvasContextSystem" {
    import { BLEND_MODES, Matrix } from "packages/core/src/index";
    import type { ColorSource, ExtensionMetadata, ICanvasRenderingContext2D, ISystem } from "packages/core/src/index";
    import type { CanvasRenderer } from "packages/canvas-renderer/src/CanvasRenderer";
    /**
     * Rendering context for all browsers. This includes platform-specific
     * properties that are not included in the spec for CanvasRenderingContext2D
     */
    export interface CrossPlatformCanvasRenderingContext2D extends ICanvasRenderingContext2D {
        webkitImageSmoothingEnabled: boolean;
        mozImageSmoothingEnabled: boolean;
        oImageSmoothingEnabled: boolean;
        msImageSmoothingEnabled: boolean;
    }
    export type SmoothingEnabledProperties = 'imageSmoothingEnabled' | 'webkitImageSmoothingEnabled' | 'mozImageSmoothingEnabled' | 'oImageSmoothingEnabled' | 'msImageSmoothingEnabled';
    /**
     * System that manages the canvas `2d` contexts
     * @memberof PIXI
     */
    export class CanvasContextSystem implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A reference to the current renderer */
        private renderer;
        /** The root canvas 2d context that everything is drawn with. */
        rootContext: CrossPlatformCanvasRenderingContext2D;
        /** The currently active canvas 2d context (could change with renderTextures) */
        activeContext: CrossPlatformCanvasRenderingContext2D;
        activeResolution: number;
        /** The canvas property used to set the canvas smoothing property. */
        smoothProperty: SmoothingEnabledProperties;
        /** Tracks the blend modes useful for this renderer. */
        readonly blendModes: string[];
        _activeBlendMode: BLEND_MODES;
        /** Projection transform, passed in render() stored here */
        _projTransform: Matrix;
        /** @private */
        _outerBlend: boolean;
        /** @param renderer - A reference to the current renderer */
        constructor(renderer: CanvasRenderer);
        /** initiates the system */
        init(): void;
        /**
         * Sets matrix of context.
         * called only from render() methods
         * takes care about resolution
         * @param transform - world matrix of current element
         * @param roundPixels - whether to round (tx,ty) coords
         * @param localResolution - If specified, used instead of `renderer.resolution` for local scaling
         */
        setContextTransform(transform: Matrix, roundPixels?: boolean, localResolution?: number): void;
        /**
         * Clear the canvas of renderer.
         * @param {string} [clearColor] - Clear the canvas with this color, except the canvas is transparent.
         * @param {number} [alpha] - Alpha to apply to the background fill color.
         */
        clear(clearColor?: ColorSource, alpha?: number): void;
        /**
         * Sets the blend mode of the renderer.
         * @param {number} blendMode - See {@link PIXI.BLEND_MODES} for valid values.
         * @param {boolean} [readyForOuterBlend=false] - Some blendModes are dangerous, they affect outer space of sprite.
         * Pass `true` only if you are ready to use them.
         */
        setBlendMode(blendMode: BLEND_MODES, readyForOuterBlend?: boolean): void;
        resize(): void;
        /** Checks if blend mode has changed. */
        invalidateBlendMode(): void;
        destroy(): void;
    }
}
declare module "packages/canvas-renderer/src/canvasUtils" {
    import type { ICanvas, Texture } from "packages/core/src/index";
    /**
     * Utility methods for Sprite/Texture tinting.
     *
     * Tinting with the CanvasRenderer involves creating a new canvas to use as a texture,
     * so be aware of the performance implications.
     * @namespace PIXI.canvasUtils
     * @memberof PIXI
     */
    export const canvasUtils: {
        canvas: ICanvas;
        /**
         * Basically this method just needs a sprite and a color and tints the sprite with the given color.
         * @memberof PIXI.canvasUtils
         * @param {PIXI.Sprite} sprite - the sprite to tint
         * @param sprite.texture
         * @param {number} color - the color to use to tint the sprite with
         * @returns {ICanvas|HTMLImageElement} The tinted canvas
         */
        getTintedCanvas: (sprite: {
            texture: Texture;
        }, color: number) => ICanvas | HTMLImageElement;
        /**
         * Basically this method just needs a sprite and a color and tints the sprite with the given color.
         * @memberof PIXI.canvasUtils
         * @param {PIXI.Texture} texture - the sprite to tint
         * @param {number} color - the color to use to tint the sprite with
         * @returns {CanvasPattern} The tinted canvas
         */
        getTintedPattern: (texture: Texture, color: number) => CanvasPattern;
        /**
         * Tint a texture using the 'multiply' operation.
         * @memberof PIXI.canvasUtils
         * @param {PIXI.Texture} texture - the texture to tint
         * @param {number} color - the color to use to tint the sprite with
         * @param {PIXI.ICanvas} canvas - the current canvas
         */
        tintWithMultiply: (texture: Texture, color: number, canvas: ICanvas) => void;
        /**
         * Tint a texture using the 'overlay' operation.
         * @memberof PIXI.canvasUtils
         * @param {PIXI.Texture} texture - the texture to tint
         * @param {number} color - the color to use to tint the sprite with
         * @param {PIXI.ICanvas} canvas - the current canvas
         */
        tintWithOverlay: (texture: Texture, color: number, canvas: ICanvas) => void;
        /**
         * Tint a texture pixel per pixel.
         * @memberof PIXI.canvasUtils
         * @param {PIXI.Texture} texture - the texture to tint
         * @param {number} color - the color to use to tint the sprite with
         * @param {PIXI.ICanvas} canvas - the current canvas
         */
        tintWithPerPixel: (texture: Texture, color: number, canvas: ICanvas) => void;
        /**
         * Rounds the specified color according to the canvasUtils.cacheStepsPerColorChannel.
         * @memberof PIXI.canvasUtils
         * @deprecated since 7.3.0
         * @see PIXI.Color.round
         * @param {number} color - the color to round, should be a hex color
         * @returns {number} The rounded color.
         */
        roundColor: (color: number) => number;
        /**
         * Number of steps which will be used as a cap when rounding colors.
         * @memberof PIXI.canvasUtils
         * @deprecated since 7.3.0
         * @type {number}
         */
        cacheStepsPerColorChannel: number;
        /**
         * Tint cache boolean flag.
         * @memberof PIXI.canvasUtils
         * @type {boolean}
         */
        convertTintToImage: boolean;
        /**
         * Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.
         * @memberof PIXI.canvasUtils
         * @type {boolean}
         */
        canUseMultiply: boolean;
        /**
         * The tinting method that will be used.
         * @memberof PIXI.canvasUtils
         * @type {Function}
         */
        tintMethod: (texture: Texture, color: number, canvas: ICanvas) => void;
    };
}
declare module "packages/canvas-renderer/src/index" {
    import "packages/canvas-renderer/src/BaseTexture";
    export * from "packages/canvas-renderer/src/CanvasContextSystem";
    export * from "packages/canvas-renderer/src/CanvasMaskSystem";
    export * from "packages/canvas-renderer/src/CanvasObjectRendererSystem";
    export * from "packages/canvas-renderer/src/CanvasRenderer";
    export * from "packages/canvas-renderer/src/canvasUtils";
    export * from "packages/canvas-renderer/src/utils/canUseNewCanvasBlendModes";
}
declare module "packages/canvas-sprite-tiling/src/TilingSprite" { }
declare module "packages/canvas-sprite-tiling/src/index" {
    import "packages/canvas-sprite-tiling/src/TilingSprite";
}
declare module "packages/canvas-particle-container/src/ParticleContainer" { }
declare module "packages/canvas-particle-container/src/index" {
    import "packages/canvas-particle-container/src/ParticleContainer";
}
declare module "packages/canvas-display/src/Container" { }
declare module "packages/canvas-display/src/DisplayObject" { }
declare module "packages/canvas-display/src/index" {
    import "packages/canvas-display/src/Container";
    import "packages/canvas-display/src/DisplayObject";
}
declare module "packages/canvas-text/src/Text" { }
declare module "packages/canvas-text/src/index" {
    import "packages/canvas-text/src/Text";
}
declare module "packages/canvas-extract/src/CanvasExtract" {
    import { Rectangle, RenderTexture } from "packages/core/src/index";
    import type { CanvasRenderer } from "packages/canvas-renderer/src/index";
    import type { ExtensionMetadata, ICanvas, ISystem } from "packages/core/src/index";
    import type { DisplayObject } from "packages/display/src/index";
    import type { IExtract } from "packages/extract/src/index";
    /**
     * The extract manager provides functionality to export content from the renderers.
     *
     * An instance of this class is automatically created by default, and can be found at `renderer.extract`
     * @class
     * @memberof PIXI
     */
    export class CanvasExtract implements ISystem, IExtract {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A reference to the current renderer */
        renderer: CanvasRenderer | null;
        /**
         * @param renderer - A reference to the current renderer
         */
        constructor(renderer: CanvasRenderer);
        /**
         * Will return a HTML Image of the target
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param format - Image format, e.g. "image/jpeg" or "image/webp".
         * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
         * @param frame - The frame the extraction is restricted to.
         * @returns HTML Image of the target
         */
        image(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<HTMLImageElement>;
        /**
         * Will return a base64 encoded string of this target. It works by calling
         *  `CanvasExtract.getCanvas` and then running toDataURL on that.
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param format - Image format, e.g. "image/jpeg" or "image/webp".
         * @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
         * @param frame - The frame the extraction is restricted to.
         * @returns A base64 encoded string of the texture.
         */
        base64(target?: DisplayObject | RenderTexture, format?: string, quality?: number, frame?: Rectangle): Promise<string>;
        /**
         * Creates a Canvas element, renders this target to it and then returns it.
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param frame - The frame the extraction is restricted to.
         * @returns A Canvas element with the texture rendered on.
         */
        canvas(target?: DisplayObject | RenderTexture, frame?: Rectangle): ICanvas;
        /**
         * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
         * order, with integer values between 0 and 255 (included).
         * @param target - A displayObject or renderTexture
         *  to convert. If left empty will use the main renderer
         * @param frame - The frame the extraction is restricted to.
         * @returns One-dimensional array containing the pixel data of the entire texture
         */
        pixels(target?: DisplayObject | RenderTexture, frame?: Rectangle): Uint8ClampedArray;
        /** Destroys the extract */
        destroy(): void;
    }
}
declare module "packages/canvas-extract/src/index" {
    export * from "packages/canvas-extract/src/CanvasExtract";
}
declare module "packages/canvas-graphics/src/Graphics" { }
declare module "packages/canvas-graphics/src/utils/PolygonUtils" {
    /**
     * Utilities for polygon
     * @class
     * @private
     */
    export class PolygonUtils {
        /**
         * Calculate points of an offset polygon
         * @see {@link http://csharphelper.com/blog/2016/01/enlarge-a-polygon-in-c/}
         * @private
         * @param {number[]} points - polygon coordinates
         * @param {number} offset
         * @returns {number[]} - offset points
         */
        static offsetPolygon(points: number[], offset: number): number[];
        /**
         * Determine the intersection point of two line segments
         * @see {@link here http://paulbourke.net/geometry/pointlineplane/}
         * @private
         * @param {number} x1 - x-coordinate of start point at first line
         * @param {number} y1 - y-coordinate of start point at first line
         * @param {number} x2 - x-coordinate of end point at first line
         * @param {number} y2 - y-coordinate of end point at first line
         * @param {number} x3 - x-coordinate of start point at second line
         * @param {number} y3 - y-coordinate of start point at second line
         * @param {number} x4 - x-coordinate of end point at second line
         * @param {number} y4 - y-coordinate of end point at second line
         * @returns [x, y] coordinates of intersection
         */
        static findIntersection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): [number, number] | null;
        /**
         * Determine polygon are clockwise or counterclockwise
         * @see {@link https://stackoverflow.com/questions/1165647}
         * @private
         * @param {number[]} polygon - polygon coordinates
         * @returns {boolean} - true if polygon is clockwise
         */
        static isPolygonClockwise(polygon: number[]): boolean;
    }
}
declare module "packages/canvas-graphics/src/CanvasGraphicsRenderer" {
    import { Matrix } from "packages/core/src/index";
    import type { CanvasRenderer } from "packages/canvas-renderer/src/index";
    import type { ExtensionMetadata } from "packages/core/src/index";
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Renderer dedicated to drawing and batching graphics objects.
     * @class
     * @protected
     * @memberof PIXI
     */
    export class CanvasGraphicsRenderer {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A reference to the current renderer */
        renderer: CanvasRenderer;
        private _svgMatrix;
        private _tempMatrix;
        /**
         * @param renderer - A reference to the current renderer.
         */
        constructor(renderer: CanvasRenderer);
        /**
         * calculates fill/stroke style for canvas
         * @private
         * @param style - A graphics {@link PIXI.FILL_STYLE} where if `texture` is specified then a tinted CanvasPattern
         * will be used for the fill.stroke
         * @param tint - color to set the fill/stroke too.
         */
        private _calcCanvasStyle;
        /**
         * Renders a Graphics object to a canvas.
         * @param graphics - the actual graphics object to render
         */
        render(graphics: Graphics): void;
        /**
         * Paint stroke for polygon and holes
         * @private
         * @param shape - Shape to be drawn
         * @param lineStyle - Line style for the shape
         * @param contextStrokeStyle - The strokeStyle for the canvas context
         * @param holes - Holes to be added to the shape
         * @param holesDirection -
         * @param worldAlpha - The multiplied alpha of the displayObject
         * @param context - The canvas context
         */
        private paintPolygonStroke;
        /**
         * Paint Ellipse
         * @private
         * @param shape - Shape to be drawn
         * @param fillStyle - Fill for the shape
         * @param lineStyle - Line style for the shape
         * @param contextFillStyle - The canvas context fill style
         * @param worldAlpha - The multiplied alpha of the displayObject
         * @param context - The canvas context
         */
        private paintEllipse;
        /**
         * Paint Rounded Rectangle
         * @private
         * @param shape - Shape to be drawn
         * @param fillStyle - Fill for the shape
         * @param lineStyle - Line style for the shape
         * @param contextFillStyle - The canvas context fill style
         * @param worldAlpha - The multiplied alpha of the displayObject
         * @param context - The canvas context
         */
        private paintRoundedRectangle;
        setPatternTransform(pattern: CanvasPattern, matrix: Matrix): void;
        /** destroy graphics object */
        destroy(): void;
    }
}
declare module "packages/canvas-graphics/src/index" {
    import "packages/canvas-graphics/src/Graphics";
    export * from "packages/canvas-graphics/src/CanvasGraphicsRenderer";
}
declare module "packages/canvas-mesh/src/settings" {
    import { settings } from "packages/core/src/index";
    export { settings };
}
declare module "packages/canvas-mesh/src/MeshMaterial" { }
declare module "packages/canvas-mesh/src/NineSlicePlane" { }
declare module "packages/canvas-mesh/src/Mesh" { }
declare module "packages/canvas-mesh/src/SimpleMesh" { }
declare module "packages/canvas-mesh/src/SimpleRope" { }
declare module "packages/canvas-mesh/src/CanvasMeshRenderer" {
    import type { CanvasRenderer } from "packages/canvas-renderer/src/index";
    import type { ExtensionMetadata } from "packages/core/src/index";
    import type { Mesh } from "packages/mesh/src/index";
    /**
     * Renderer dedicated to meshes.
     * @class
     * @protected
     * @memberof PIXI
     */
    export class CanvasMeshRenderer {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A reference to the current renderer */
        renderer: CanvasRenderer;
        /** @param renderer - A reference to the current renderer */
        constructor(renderer: CanvasRenderer);
        /**
         * Renders the Mesh
         * @param mesh - the Mesh to render
         */
        render(mesh: Mesh): void;
        /**
         * Draws the object in Triangle Mesh mode
         * @private
         * @param mesh - the Mesh to render
         */
        private _renderTriangleMesh;
        /**
         * Draws the object in triangle mode using canvas
         * @private
         * @param mesh - the current mesh
         */
        private _renderTriangles;
        /**
         * Draws one of the triangles that from the Mesh
         * @private
         * @param mesh - the current mesh
         * @param index0 - the index of the first vertex
         * @param index1 - the index of the second vertex
         * @param index2 - the index of the third vertex
         */
        private _renderDrawTriangle;
        /**
         * Renders a flat Mesh
         * @private
         * @param mesh - The Mesh to render
         */
        renderMeshFlat(mesh: Mesh): void;
        /** destroy the renderer */
        destroy(): void;
    }
}
declare module "packages/canvas-mesh/src/index" {
    import "packages/canvas-mesh/src/settings";
    import "packages/canvas-mesh/src/MeshMaterial";
    import "packages/canvas-mesh/src/NineSlicePlane";
    import "packages/canvas-mesh/src/Mesh";
    import "packages/canvas-mesh/src/SimpleMesh";
    import "packages/canvas-mesh/src/SimpleRope";
    export * from "packages/canvas-mesh/src/CanvasMeshRenderer";
}
declare module "packages/canvas-prepare/src/CanvasPrepare" {
    import { BasePrepare } from "packages/prepare/src/index";
    import type { CanvasRenderer } from "packages/canvas-renderer/src/index";
    import type { ExtensionMetadata, ICanvas, ICanvasRenderingContext2D, ISystem } from "packages/core/src/index";
    /**
     * The prepare manager provides functionality to upload content to the GPU.
     *
     * This cannot be done directly for Canvas like in WebGL, but the effect can be achieved by drawing
     * textures to an offline canvas. This draw call will force the texture to be moved onto the GPU.
     *
     * An instance of this class is automatically created by default, and can be found at `renderer.prepare`
     * @class
     * @extends PIXI.BasePrepare
     * @memberof PIXI
     */
    export class CanvasPrepare extends BasePrepare implements ISystem {
        /** @ignore */
        static extension: ExtensionMetadata;
        /**
         * An offline canvas to render textures to
         * @internal
         */
        canvas: ICanvas;
        /**
         * The context to the canvas
         * @internal
         */
        ctx: ICanvasRenderingContext2D;
        /**
         * @param renderer - A reference to the current renderer
         */
        constructor(renderer: CanvasRenderer);
        /** Destroys the plugin, don't use after this */
        destroy(): void;
    }
}
declare module "packages/canvas-prepare/src/index" {
    export * from "packages/canvas-prepare/src/CanvasPrepare";
}
declare module "packages/canvas-sprite/src/Sprite" { }
declare module "packages/canvas-sprite/src/CanvasSpriteRenderer" {
    import type { CanvasRenderer } from "packages/canvas-renderer/src/index";
    import type { ExtensionMetadata } from "packages/core/src/index";
    import type { Sprite } from "packages/sprite/src/index";
    /**
     * Types that can be passed to drawImage
     * @typedef {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} ICanvasImageSource
     * @memberof PIXI
     */
    /**
     * Renderer dedicated to drawing and batching sprites.
     * @class
     * @protected
     * @memberof PIXI
     */
    export class CanvasSpriteRenderer {
        /** @ignore */
        static extension: ExtensionMetadata;
        /** A reference to the current renderer */
        protected renderer: CanvasRenderer;
        /** @param renderer - A reference to the current renderer */
        constructor(renderer: CanvasRenderer);
        /**
         * Renders the sprite object.
         * @param sprite - the sprite to render when using this spritebatch
         */
        render(sprite: Sprite): void;
        /** destroy the sprite object */
        destroy(): void;
    }
}
declare module "packages/canvas-sprite/src/index" {
    import "packages/canvas-sprite/src/Sprite";
    export * from "packages/canvas-sprite/src/CanvasSpriteRenderer";
}
declare module "bundles/pixi.js-legacy/src/index" {
    import "packages/canvas-sprite-tiling/src/index";
    import "packages/canvas-particle-container/src/index";
    import "packages/canvas-display/src/index";
    import "packages/canvas-text/src/index";
    export * from "bundles/pixi.js/src/index";
    export * from "packages/canvas-extract/src/index";
    export * from "packages/canvas-graphics/src/index";
    export * from "packages/canvas-mesh/src/index";
    export * from "packages/canvas-prepare/src/index";
    export * from "packages/canvas-renderer/src/index";
    export * from "packages/canvas-sprite/src/index";
}
declare module "bundles/pixi.js-webworker/src/adapter" {
    import { settings } from "packages/core/src/index";
    import type { IAdapter } from "packages/core/src/index";
    export const WebWorkerAdapter: IAdapter;
    export { settings };
}
declare module "bundles/pixi.js-webworker/src/filters" {
    import { AlphaFilter } from "packages/filter-alpha/src/index";
    import { BlurFilter, BlurFilterPass } from "packages/filter-blur/src/index";
    import { ColorMatrixFilter } from "packages/filter-color-matrix/src/index";
    import { DisplacementFilter } from "packages/filter-displacement/src/index";
    import { FXAAFilter } from "packages/filter-fxaa/src/index";
    import { NoiseFilter } from "packages/filter-noise/src/index";
    /** @deprecated */
    const filters: {
        /** @deprecated */
        AlphaFilter: typeof AlphaFilter;
        /** @deprecated */
        BlurFilter: typeof BlurFilter;
        /** @deprecated */
        BlurFilterPass: typeof BlurFilterPass;
        /** @deprecated */
        ColorMatrixFilter: typeof ColorMatrixFilter;
        /** @deprecated */
        DisplacementFilter: typeof DisplacementFilter;
        /** @deprecated */
        FXAAFilter: typeof FXAAFilter;
        /** @deprecated */
        NoiseFilter: typeof NoiseFilter;
    };
    export { filters };
}
declare module "bundles/pixi.js-webworker/src/index" {
    import "packages/mixin-cache-as-bitmap/src/index";
    import "packages/mixin-get-child-by-name/src/index";
    import "packages/mixin-get-global-position/src/index";
    export * from "bundles/pixi.js-webworker/src/filters";
    export * from "packages/app/src/index";
    export * from "packages/assets/src/index";
    export * from "packages/compressed-textures/src/index";
    export * from "packages/core/src/index";
    export * from "packages/display/src/index";
    export * from "packages/extract/src/index";
    export * from "packages/filter-alpha/src/index";
    export * from "packages/filter-blur/src/index";
    export * from "packages/filter-color-matrix/src/index";
    export * from "packages/filter-displacement/src/index";
    export * from "packages/filter-fxaa/src/index";
    export * from "packages/filter-noise/src/index";
    export * from "packages/graphics/src/index";
    export * from "packages/mesh/src/index";
    export * from "packages/mesh-extras/src/index";
    export * from "packages/particle-container/src/index";
    export * from "packages/prepare/src/index";
    export * from "packages/sprite/src/index";
    export * from "packages/sprite-animated/src/index";
    export * from "packages/sprite-tiling/src/index";
    export * from "packages/spritesheet/src/index";
    export * from "packages/text/src/index";
    export * from "packages/text-bitmap/src/index";
    export * from "bundles/pixi.js-webworker/src/adapter";
}
declare module "packages/assets/src/types-deprecated" {
    import type { AssetsBundle, AssetsManifest, ResolvedAsset, UnresolvedAsset, UnresolvedAssetObject } from "packages/assets/src/types";
    /**
     * Please use `ResolvedAsset` instead.
     * @memberof PIXI
     * @deprecated since 7.2.0
     */
    export type ResolveAsset<T = any> = ResolvedAsset<T>;
    /**
     * Please use `ResolvedAsset` instead.
     * @memberof PIXI
     * @deprecated since 7.2.0
     */
    export type LoadAsset<T = any> = ResolvedAsset<T>;
    /**
     * Please use `AssetsBundle` instead.
     * @memberof PIXI
     * @deprecated since 7.2.0
     */
    export type ResolverBundle = AssetsBundle;
    /**
     * Please use `AssetsManifest` instead.
     * @memberof PIXI
     * @deprecated since 7.2.0
     */
    export type ResolverManifest = AssetsManifest;
    /**
     * Please use `UnresolvedAsset[]` instead.
     * @memberof PIXI
     * @deprecated since 7.2.0
     */
    export type ResolverAssetsArray = UnresolvedAsset[];
    /**
     * Please use `UnresolvedAssetObject` instead.
     * @memberof PIXI
     * @deprecated since 7.2.0
     */
    export type ResolverAssetsObject = UnresolvedAssetObject;
}
declare module "packages/basis/src/Basis" {
    import { INTERNAL_FORMATS } from "packages/compressed-textures/src/index";
    import { TYPES } from "packages/core/src/index";
    /**
     * The transcoding formats provided by basis_universal.
     *
     * NOTE: Not all of these formats are supported on WebGL!
     * @ignore
     */
    export enum BASIS_FORMATS {
        cTFETC1 = 0,
        cTFETC2 = 1,
        cTFBC1 = 2,
        cTFBC3 = 3,
        cTFBC4 = 4,
        cTFBC5 = 5,
        cTFBC7 = 6,
        cTFPVRTC1_4_RGB = 8,
        cTFPVRTC1_4_RGBA = 9,
        cTFASTC_4x4 = 10,
        cTFATC_RGB = 11,
        cTFATC_RGBA_INTERPOLATED_ALPHA = 12,
        cTFRGBA32 = 13,
        cTFRGB565 = 14,
        cTFBGR565 = 15,
        cTFRGBA4444 = 16
    }
    /**
     * Maps {@link BASIS_FORMATS} to {@link PIXI.INTERNAL_FORMATS}
     * @ignore
     */
    export const BASIS_FORMAT_TO_INTERNAL_FORMAT: {
        [id: number]: INTERNAL_FORMATS;
    };
    /**
     * Maps {@link BASIS_FORMATS} to {@link PIXI.TYPES}. These formats are a fallback when the basis file cannot be transcoded
     * to a valid compressed texture format.
     *
     * NOTE: {@link BASIS_FORMATS.cTFBGR565} is not supported, while {@link BASIS_FORMATS.cTFRGBA4444} is not implemented by
     *  [at]pixi/basis.
     * @ignore
     */
    export const BASIS_FORMAT_TO_TYPE: {
        [id: number]: TYPES;
    };
    /**
     * Maps {@link PIXI.INTERNAL_FORMATS} to {@link BASIS_FORMATS}
     * @ignore
     */
    export const INTERNAL_FORMAT_TO_BASIS_FORMAT: {
        [id: number]: number;
    };
    /**
     * Enumerates the basis formats with alpha components
     * @ignore
     */
    export const BASIS_FORMATS_ALPHA: {
        [id: number]: boolean;
    };
    /**
     * Binding to C++ {@code BasisFile} wrapper class.
     * @see https://github.com/BinomialLLC/basis_universal/blob/master/webgl/transcoder/basis_wrappers.cpp
     * @private
     */
    export class BasisFile {
        constructor(buffer: Uint8Array);
        getNumImages(): number;
        getNumLevels(imageId: number): number;
        getImageWidth(imageId: number, level: number): number;
        getImageHeight(imageId: number, level: number): number;
        getHasAlpha(): boolean;
        startTranscoding(): boolean;
        getImageTranscodedSizeInBytes(imageId: number, level: number, basisFormat: number): number;
        transcodeImage(dstBuff: Uint8Array, imageId: number, level: number, basisFormat: BASIS_FORMATS, pvrtcWrapAddressing: boolean, getAlphaForOpaqueFormats: boolean): number;
        close(): void;
        delete(): void;
    }
    /**
     * Compressed texture extensions relevant to the formats into which Basis can decompress into.
     * @ignore
     */
    export type BasisTextureExtensions = {
        s3tc?: WEBGL_compressed_texture_s3tc;
        s3tc_sRGB: WEBGL_compressed_texture_s3tc_srgb;
        etc: any;
        etc1: any;
        pvrtc: any;
        atc: any;
        astc: WEBGL_compressed_texture_astc;
    };
    /** API provided by basis_universal WebGL library. */
    export type BasisBinding = {
        BasisFile: typeof BasisFile;
        initializeBasis: () => void;
    };
    /**
     * Binding to basis_universal WebGL library.
     * @see https://github.com/BinomialLLC/basis_universal/blob/master/webgl/transcoder/build/basis_transcoder.js
     * @ignore
     */
    export type BASIS = (opts?: {
        wasmBinary: ArrayBuffer;
    }) => Promise<BasisBinding>;
}
declare module "packages/basis/src/TranscoderWorkerWrapper" {
    import type { BASIS, BASIS_FORMATS } from "packages/basis/src/Basis";
    /**
     * Initialization message sent by the main thread.
     * @ignore
     */
    export interface IInitializeTranscoderMessage {
        wasmSource: ArrayBuffer;
        type: 'init';
    }
    /**
     * Request parameters for transcoding basis files. It only supports transcoding all of the basis file at once.
     * @ignore
     */
    export interface ITranscodeMessage {
        requestID?: number;
        rgbFormat: number;
        rgbaFormat?: number;
        basisData?: Uint8Array;
        type: 'transcode';
    }
    /** @ignore */
    export interface ITranscodedImage {
        imageID: number;
        levelArray: Array<{
            levelID: number;
            levelWidth: number;
            levelHeight: number;
            levelBuffer: Uint8Array;
        }>;
        width: number;
        height: number;
    }
    /**
     * Response format for {@link TranscoderWorker}.
     * @ignore
     */
    export interface ITranscodeResponse {
        type: 'init' | 'transcode';
        requestID?: number;
        success: boolean;
        basisFormat?: BASIS_FORMATS;
        imageArray?: Array<{
            imageID: number;
            levelArray: Array<{
                levelID: number;
                levelWidth: number;
                levelHeight: number;
                levelBuffer: Uint8Array;
            }>;
            width: number;
            height: number;
        }>;
    }
    global {
        interface Window {
            BASIS: BASIS;
        }
    }
    /**
     * This wraps the transcoder web-worker functionality; it can be converted into a string to get the source code. It expects
     * you to prepend the transcoder JavaScript code so that the `BASIS` namespace is available.
     *
     * The transcoder worker responds to two types of messages: "init" and "transcode". You must always send the first "init"
     * {@link IInitializeTranscoderMessage} message with the WebAssembly binary; if the transcoder is successfully initialized,
     * the web-worker will respond by sending another {@link ITranscodeResponse} message with `success: true`.
     * @ignore
     */
    export function TranscoderWorkerWrapper(): void;
}
declare module "packages/basis/src/TranscoderWorker" {
    import type { BASIS_FORMATS } from "packages/basis/src/Basis";
    import type { ITranscodeResponse } from "packages/basis/src/TranscoderWorkerWrapper";
    /**
     * Worker class for transcoding *.basis files in background threads.
     *
     * To enable asynchronous transcoding, you need to provide the URL to the basis_universal transcoding
     * library.
     * @memberof PIXI.BasisParser
     */
    export class TranscoderWorker {
        /** URL for the script containing the basis_universal library. */
        static bindingURL: string;
        static jsSource: string;
        static wasmSource: ArrayBuffer;
        private static _onTranscoderInitializedResolve;
        /** a promise that when reslved means the transcoder is ready to be used */
        static onTranscoderInitialized: Promise<void>;
        isInit: boolean;
        load: number;
        requests: {
            [id: number]: {
                resolve: (data: ITranscodeResponse) => void;
                reject: () => void;
            };
        };
        private static _workerURL;
        private static _tempID;
        /** Generated URL for the transcoder worker script. */
        static get workerURL(): string;
        protected worker: Worker;
        protected initPromise: Promise<void>;
        protected onInit: () => void;
        constructor();
        /** @returns a promise that is resolved when the web-worker is initialized */
        initAsync(): Promise<void>;
        /**
         * Creates a promise that will resolve when the transcoding of a *.basis file is complete.
         * @param basisData - *.basis file contents
         * @param rgbaFormat - transcoding format for RGBA files
         * @param rgbFormat - transcoding format for RGB files
         * @returns a promise that is resolved with the transcoding response of the web-worker
         */
        transcodeAsync(basisData: Uint8Array, rgbaFormat: BASIS_FORMATS, rgbFormat: BASIS_FORMATS): Promise<ITranscodeResponse>;
        /**
         * Handles responses from the web-worker
         * @param e - a message event containing the transcoded response
         */
        protected onMessage: (e: MessageEvent) => void;
        /**
         * Loads the transcoder source code
         * @param jsURL - URL to the javascript basis transcoder
         * @param wasmURL - URL to the wasm basis transcoder
         * @returns A promise that resolves when both the js and wasm transcoders have been loaded.
         */
        static loadTranscoder(jsURL: string, wasmURL: string): Promise<[void, void]>;
        /**
         * Set the transcoder source code directly
         * @param jsSource - source for the javascript basis transcoder
         * @param wasmSource - source for the wasm basis transcoder
         */
        static setTranscoder(jsSource: string, wasmSource: ArrayBuffer): void;
    }
}
declare module "packages/basis/src/loader/BasisParser" {
    import { CompressedTextureResource } from "packages/compressed-textures/src/index";
    import { BufferResource } from "packages/core/src/index";
    import { BASIS_FORMATS } from "packages/basis/src/Basis";
    import { TranscoderWorker } from "packages/basis/src/TranscoderWorker";
    import type { BasisBinding, BasisTextureExtensions } from "packages/basis/src/Basis";
    export type TranscodedResourcesArray = (Array<CompressedTextureResource> | Array<BufferResource>) & {
        basisFormat: BASIS_FORMATS;
    };
    /**
     * Loader plugin for handling BASIS supercompressed texture files.
     *
     * To use this loader, you must bind the basis_universal WebAssembly transcoder. There are two ways of
     * doing this:
     *
     * 1. Adding a &lt;script&gt; tag to your HTML page to the transcoder bundle in this package, and serving
     * the WASM binary from the same location.
     *
     * ```html
     * <!-- Copy ./node_modules/@pixi/basis/assets/basis_.wasm into your assets directory
     *     as well, so it is served from the same folder as the JavaScript! -->
     * <script src="./node_modules/@pixi/basis/assets/basis_transcoder.js"></script>
     * ```
     *
     * NOTE: `basis_transcoder.js` expects the WebAssembly binary to be named `basis_transcoder.wasm`.
     * NOTE-2: This method supports transcoding on the main-thread. Only use this if you have 1 or 2 *.basis
     * files.
     *
     * 2. Loading the transcoder source from a URL.
     *
     * ```js
     * // Use this if you to use the default CDN url for @pixi/basis
     * BasisParser.loadTranscoder();
     *
     * // Use this if you want to serve the transcoder on your own
     * BasisParser.loadTranscoder('./basis_transcoder.js', './basis_transcoder.wasm');
     * ```
     *
     * NOTE: This can only be used with web-workers.
     * @class
     * @memberof PIXI
     * @implements {PIXI.ILoaderPlugin}
     */
    export class BasisParser {
        static basisBinding: BasisBinding;
        private static defaultRGBFormat;
        private static defaultRGBAFormat;
        private static fallbackMode;
        private static workerPool;
        /**
         * Runs transcoding and populates {@link imageArray}. It will run the transcoding in a web worker
         * if they are available.
         * @private
         */
        static transcode(arrayBuffer: ArrayBuffer): Promise<TranscodedResourcesArray>;
        /**
         * Finds a suitable worker for transcoding and sends a transcoding request
         * @private
         * @async
         */
        static transcodeAsync(arrayBuffer: ArrayBuffer): Promise<TranscodedResourcesArray>;
        /**
         * Runs transcoding on the main thread.
         * @private
         */
        static transcodeSync(arrayBuffer: ArrayBuffer): TranscodedResourcesArray;
        /**
         * Detects the available compressed texture formats on the device.
         * @param extensions - extensions provided by a WebGL context
         * @ignore
         */
        static autoDetectFormats(extensions?: Partial<BasisTextureExtensions>): void;
        /**
         * Binds the basis_universal transcoder to decompress *.basis files. You must initialize the transcoder library yourself.
         * @example
         * import { BasisParser } from '@pixi/basis';
         *
         * // BASIS() returns a Promise-like object
         * globalThis.BASIS().then((basisLibrary) =>
         * {
         *     // Initialize basis-library; otherwise, transcoded results maybe corrupt!
         *     basisLibrary.initializeBasis();
         *
         *     // Bind BasisParser to the transcoder
         *     BasisParser.bindTranscoder(basisLibrary);
         * });
         * @param basisLibrary - the initialized transcoder library
         * @private
         */
        static bindTranscoder(basisLibrary: BasisBinding): void;
        /**
         * Loads the transcoder source code for use in {@link PIXI.BasisParser.TranscoderWorker}.
         * @private
         * @param jsURL - URL to the javascript basis transcoder
         * @param wasmURL - URL to the wasm basis transcoder
         */
        static loadTranscoder(jsURL: string, wasmURL: string): Promise<[void, void]>;
        /**
         * Set the transcoder source code directly
         * @private
         * @param jsSource - source for the javascript basis transcoder
         * @param wasmSource - source for the wasm basis transcoder
         */
        static setTranscoder(jsSource: string, wasmSource: ArrayBuffer): void;
        static TranscoderWorker: typeof TranscoderWorker;
        static get TRANSCODER_WORKER_POOL_LIMIT(): number;
        static set TRANSCODER_WORKER_POOL_LIMIT(limit: number);
    }
}
declare module "packages/basis/src/loader/detectBasis" {
    import type { FormatDetectionParser } from "packages/assets/src/index";
    export const detectBasis: FormatDetectionParser;
}
declare module "packages/basis/src/loader/loadBasis" {
    import type { LoaderParser } from "packages/assets/src/index";
    import type { IBaseTextureOptions, Texture } from "packages/core/src/index";
    /** Load BASIS textures! */
    export const loadBasis: LoaderParser<Texture<import("@pixi/core").Resource> | Texture<import("@pixi/core").Resource>[], IBaseTextureOptions<any>, Record<string, any>>;
}
declare module "packages/basis/src/loader/index" {
    export * from "packages/basis/src/loader/BasisParser";
    export * from "packages/basis/src/loader/detectBasis";
    export * from "packages/basis/src/loader/loadBasis";
}
declare module "packages/basis/src/index" {
    export * from "packages/basis/src/Basis";
    export * from "packages/basis/src/loader/index";
    export * from "packages/basis/src/TranscoderWorker";
}
declare module "packages/core/src/geometry/utils/setVertexAttribArrays" {
    import type { Dict } from "packages/utils/src/index";
    import type { IRenderingContext } from "packages/core/src/IRenderer";
    /**
     * @param {WebGLRenderingContext} gl - The current WebGL context
     * @param {*} attribs
     * @param {*} state
     * @private
     */
    export function setVertexAttribArrays(gl: IRenderingContext, attribs: Dict<any>, state: Dict<any>): void;
}
declare module "packages/filter-blur/src/getMaxBlurKernelSize" {
    import type { IRenderingContext } from "packages/core/src/index";
    export function getMaxKernelSize(gl: IRenderingContext): number;
}
declare module "packages/graphics-extras/src/drawChamferRect" {
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Draw Rectangle with chamfer corners. These are angled corners.
     *
     * _Note: Only available with **@pixi/graphics-extras**._
     * @method PIXI.Graphics#drawChamferRect
     * @param this
     * @param {number} x - Upper left corner of rect
     * @param {number} y - Upper right corner of rect
     * @param {number} width - Width of rect
     * @param {number} height - Height of rect
     * @param {number} chamfer - non-zero real number, size of corner cutout
     * @returns {PIXI.Graphics} Returns self.
     */
    export function drawChamferRect(this: Graphics, x: number, y: number, width: number, height: number, chamfer: number): Graphics;
}
declare module "packages/graphics-extras/src/drawFilletRect" {
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Draw Rectangle with fillet corners. This is much like rounded rectangle
     * however it support negative numbers as well for the corner radius.
     *
     * _Note: Only available with **@pixi/graphics-extras**._
     * @method PIXI.Graphics#drawFilletRect
     * @param this
     * @param {number} x - Upper left corner of rect
     * @param {number} y - Upper right corner of rect
     * @param {number} width - Width of rect
     * @param {number} height - Height of rect
     * @param {number} fillet - accept negative or positive values
     * @returns {PIXI.Graphics} Returns self.
     */
    export function drawFilletRect(this: Graphics, x: number, y: number, width: number, height: number, fillet: number): Graphics;
}
declare module "packages/graphics-extras/src/drawRegularPolygon" {
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Draw a regular polygon where all sides are the same length.
     *
     * _Note: Only available with **@pixi/graphics-extras**._
     * @method PIXI.Graphics#drawRegularPolygon
     * @param this
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} radius - Polygon radius
     * @param {number} sides - Minimum value is 3
     * @param {number} rotation - Starting rotation values in radians..
     * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    export function drawRegularPolygon(this: Graphics, x: number, y: number, radius: number, sides: number, rotation?: number): Graphics;
}
declare module "packages/graphics-extras/src/drawRoundedPolygon" {
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Draw a regular polygon with rounded corners.
     *
     * _Note: Only available with **@pixi/graphics-extras**._
     * @method PIXI.Graphics#drawRoundedPolygon
     * @param this
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} radius - Polygon radius
     * @param {number} sides - Minimum value is 3
     * @param {number} corner - Corner size in pixels.
     * @param {number} rotation - Starting rotation values in radians..
     * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    export function drawRoundedPolygon(this: Graphics, x: number, y: number, radius: number, sides: number, corner: number, rotation?: number): Graphics;
}
declare module "packages/graphics-extras/src/drawRoundedShape" {
    import type { IPointData } from "packages/core/src/index";
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Draw a Shape with rounded corners.
     * Supports custom radius for each point.
     *
     * _Note: Only available with **@pixi/graphics-extras**._
     * @method PIXI.Graphics#drawRoundedShape
     * @param this
     * @param {(IPointData & { radius?: number })[]} points - Corners of the shape to draw. Minimum length is 3.
     * @param {number} radius - Corners default radius.
     * @param {boolean} useQuadraticCurve - If true, rounded corners will be drawn using quadraticCurve instead of arc.
     * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls.
     */
    export function drawRoundedShape(this: Graphics, points: (IPointData & {
        radius?: number;
    })[], radius: number, useQuadraticCurve?: boolean): Graphics;
}
declare module "packages/graphics-extras/src/drawStar" {
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Draw a star shape with an arbitrary number of points.
     *
     * _Note: Only available with **@pixi/graphics-extras**._
     * @method PIXI.Graphics#drawStar
     * @param this
     * @param x - Center X position of the star
     * @param y - Center Y position of the star
     * @param points - The number of points of the star, must be > 1
     * @param radius - The outer radius of the star
     * @param innerRadius - The inner radius between points, default half `radius`
     * @param rotation - The rotation of the star in radians, where 0 is vertical
     * @returns - This Graphics object. Good for chaining method calls
     */
    export function drawStar(this: Graphics, x: number, y: number, points: number, radius: number, innerRadius: number, rotation?: number): Graphics;
}
declare module "packages/graphics-extras/src/drawTorus" {
    import type { Graphics } from "packages/graphics/src/index";
    /**
     * Draw a torus shape, like a donut. Can be used for something like a circle loader.
     *
     * _Note: Only available with **@pixi/graphics-extras**._
     * @method PIXI.Graphics#drawTorus
     * @param this
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} innerRadius - Inner circle radius
     * @param {number} outerRadius - Outer circle radius
     * @param {number} [startArc=0] - Where to begin sweep, in radians, 0.0 = to the right
     * @param {number} [endArc=Math.PI*2] - Where to end sweep, in radians
     * @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    export function drawTorus(this: Graphics, x: number, y: number, innerRadius: number, outerRadius: number, startArc?: number, endArc?: number): Graphics;
}
declare module "packages/graphics-extras/src/index" {
    import { drawChamferRect } from "packages/graphics-extras/src/drawChamferRect";
    import { drawFilletRect } from "packages/graphics-extras/src/drawFilletRect";
    import { drawRegularPolygon } from "packages/graphics-extras/src/drawRegularPolygon";
    import { drawRoundedPolygon } from "packages/graphics-extras/src/drawRoundedPolygon";
    import { drawRoundedShape } from "packages/graphics-extras/src/drawRoundedShape";
    import { drawStar } from "packages/graphics-extras/src/drawStar";
    import { drawTorus } from "packages/graphics-extras/src/drawTorus";
    export interface IGraphicsExtras {
        drawTorus: typeof drawTorus;
        drawChamferRect: typeof drawChamferRect;
        drawFilletRect: typeof drawFilletRect;
        drawRegularPolygon: typeof drawRegularPolygon;
        drawRoundedPolygon: typeof drawRoundedPolygon;
        drawRoundedShape: typeof drawRoundedShape;
        drawStar: typeof drawStar;
    }
}
declare module "packages/math-extras/src/pointExtras" { }
declare module "packages/math-extras/src/rectangleExtras" { }
declare module "packages/math-extras/src/index" {
    import { Point } from "packages/core/src/index";
    import "packages/math-extras/src/pointExtras";
    import "packages/math-extras/src/rectangleExtras";
    import type { IPointData } from "packages/core/src/index";
    /**
     * The idea of a relative epsilon comparison is to find the difference between the two numbers,
     * and see if it is less than `Math.EPSILON`.
     *
     * _Note: Only available with **@pixi/math-extras**._
     * @param {number} a - First floating number to compare.
     * @param {number} b - Second floating number to compare.
     * @returns {boolean} Returns `true` if the difference between the values is less than `Math.EPSILON`; otherwise `false`.
     */
    export function floatEqual(a: number, b: number): boolean;
    /**
     * The idea of a relative epsilon comparison is to find the difference between the two numbers,
     * and see if it is less than a given epsilon.
     * A good epsilon would be the N% of the largest of the two values or `Math.EPSILON`.
     *
     * _Note: Only available with **@pixi/math-extras**._
     * @memberof PIXI
     * @param {number} a - First floating number to compare.
     * @param {number} b - Second floating number to compare.
     * @param {number} epsilon - The epsilon to compare to.
     * The larger the epsilon, the easier for the numbers to be considered equals.
     * @returns {boolean} Returns `true` if the difference between the values is less than the given epsilon;
     * otherwise `false`.
     */
    export function floatEqual(a: number, b: number, epsilon: number): boolean;
    /**
     * Computes the point where non-coincident and non-parallel Lines intersect.
     * Coincident or parallel lines return a `NaN` point `{x: NaN, y: NaN}`.
     * The intersection point may land outside the extents of the lines.
     *
     * _Note: Only available with **@pixi/math-extras**._
     * @param aStart - First point of the first line.
     * @param aEnd - Second point of the first line.
     * @param bStart - First point of the second line.
     * @param bEnd - Second point of the second line.
     * @returns {IPointData} The point where the lines intersect.
     */
    export function lineIntersection(aStart: IPointData, aEnd: IPointData, bStart: IPointData, bEnd: IPointData): Point;
    /**
     * Computes the point where non-coincident and non-parallel Lines intersect.
     * Coincident or parallel lines return a `NaN` point `{x: NaN, y: NaN}`.
     * The intersection point may land outside the extents of the lines.
     *
     * _Note: Only available with **@pixi/math-extras**._
     * @memberof PIXI
     * @param aStart - First point of the first line.
     * @param aEnd - Second point of the first line.
     * @param bStart - First point of the second line.
     * @param bEnd - Second point of the second line.
     * @param {IPointData} outPoint - A Point-like object in which to store the value,
     * optional (otherwise will create a new Point).
     * @returns {IPointData} The point where the lines intersect or a `NaN` Point.
     */
    export function lineIntersection<T extends IPointData>(aStart: IPointData, aEnd: IPointData, bStart: IPointData, bEnd: IPointData, outPoint: T): T;
    /**
     * Computes the point where non-coincident and non-parallel segments intersect.
     * Coincident, parallel or non-intersecting segments return a `NaN` point `{x: NaN, y: NaN}`.
     * The intersection point must land inside the extents of the segments or return a `NaN` Point.
     *
     * _Note: Only available with **@pixi/math-extras**._
     * @param aStart - Starting point of the first segment.
     * @param aEnd - Ending point of the first segment.
     * @param bStart - Starting point of the second segment.
     * @param bEnd - Ending point of the second segment.
     * @returns {IPointData} The point where the segments intersect.
     */
    export function segmentIntersection(aStart: IPointData, aEnd: IPointData, bStart: IPointData, bEnd: IPointData): Point;
    /**
     * Computes the point where non-coincident and non-parallel segments intersect.
     * Coincident, parallel or non-intersecting segments return a `NaN` point `{x: NaN, y: NaN}`.
     * The intersection point must land inside the extents of the segments or return a `NaN` Point.
     *
     * _Note: Only available with **@pixi/math-extras**._
     * @memberof PIXI
     * @param aStart - Starting point of the first segment.
     * @param aEnd - Ending point of the first segment.
     * @param bStart - Starting point of the second segment.
     * @param bEnd - Ending point of the second segment.
     * @param {IPointData} outPoint - A Point-like object in which to store the value,
     * optional (otherwise will create a new Point).
     * @returns {IPointData} The point where the segments intersect or a `NaN` Point.
     */
    export function segmentIntersection<T extends IPointData>(aStart: IPointData, aEnd: IPointData, bStart: IPointData, bEnd: IPointData, outPoint: T): T;
}
declare module "packages/unsafe-eval/src/syncUniforms" {
    import type { IUniformData, Renderer, UniformGroup } from "packages/core/src/index";
    export function syncUniforms(group: UniformGroup, uniformData: {
        [x: string]: IUniformData;
    }, ud: any, uv: any, renderer: Renderer): void;
}
declare module "packages/unsafe-eval/src/install" {
    import { ShaderSystem } from "packages/core/src/index";
    interface PIXICore {
        ShaderSystem: typeof ShaderSystem;
    }
    /**
     * Apply the no `new Function` patch to ShaderSystem in `@pixi/core`.
     * `@pixi/unsafe-eval` is self-installed since 7.1.0, so this function no longer needs to be called manually.
     * @param _core
     * @deprecated since 7.1.0
     */
    export function install(_core: PIXICore): void;
}
declare module "packages/unsafe-eval/src/index" {
    export * from "packages/unsafe-eval/src/install";
}
