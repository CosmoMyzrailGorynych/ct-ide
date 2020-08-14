declare namespace PIXI {
    interface Transform {
        proj?: PIXI.projection.AbstractProjection;
    }
    interface ObservablePoint {
        _x?: number;
        _y?: number;
    }
}
declare module PIXI.projection {
    class AbstractProjection {
        constructor(legacy: PIXI.Transform, enable?: boolean);
        legacy: PIXI.Transform;
        _enabled: boolean;
        get enabled(): boolean;
        set enabled(value: boolean);
        clear(): void;
    }
    enum TRANSFORM_STEP {
        NONE = 0,
        BEFORE_PROJ = 4,
        PROJ = 5,
        ALL = 9
    }
}
declare module PIXI.projection {
    class LinearProjection<T> extends AbstractProjection {
        updateLocalTransform(lt: PIXI.Matrix): void;
        _projID: number;
        _currentProjID: number;
        _affine: AFFINE;
        affinePreserveOrientation: boolean;
        scaleAfterAffine: boolean;
        set affine(value: AFFINE);
        get affine(): AFFINE;
        local: T;
        world: T;
        set enabled(value: boolean);
        clear(): void;
    }
}
declare module PIXI.projection {
    class Batch3dGeometry extends PIXI.Geometry {
        _buffer: PIXI.Buffer;
        _indexBuffer: PIXI.Buffer;
        constructor(_static?: boolean);
    }
    class Batch2dPluginFactory {
        static create(options: any): any;
    }
}
declare module PIXI.projection {
    import AbstractBatchRenderer = PIXI.AbstractBatchRenderer;
    class UniformBatchRenderer extends AbstractBatchRenderer {
        _iIndex: number;
        _aIndex: number;
        _dcIndex: number;
        _bufferedElements: Array<any>;
        _attributeBuffer: PIXI.ViewableBuffer;
        _indexBuffer: Uint16Array;
        vertexSize: number;
        forceMaxTextures: number;
        getUniforms(sprite: PIXI.Sprite): any;
        syncUniforms(obj: any): void;
        defUniforms: {};
        buildDrawCalls(texArray: PIXI.BatchTextureArray, start: number, finish: number): void;
        drawBatches(): void;
        contextChange(): void;
    }
}
declare module PIXI.projection {
    import IPoint = PIXI.IPoint;
    abstract class Surface implements IWorldTransform {
        surfaceID: string;
        _updateID: number;
        vertexSrc: string;
        fragmentSrc: string;
        fillUniforms(uniforms: any): void;
        clear(): void;
        boundsQuad(v: ArrayLike<number>, out: any, after?: PIXI.Matrix): void;
        abstract apply(pos: IPoint, newPos: IPoint): IPoint;
        abstract applyInverse(pos: IPoint, newPos: IPoint): IPoint;
    }
}
declare module PIXI.projection {
    import IPoint = PIXI.IPoint;
    class BilinearSurface extends Surface {
        distortion: PIXI.Point;
        constructor();
        clear(): void;
        apply(pos: IPoint, newPos?: IPoint): IPoint;
        applyInverse(pos: IPoint, newPos: IPoint): IPoint;
        mapSprite(sprite: PIXI.Sprite, quad: Array<IPoint>, outTransform?: PIXI.Transform): this;
        mapQuad(rect: PIXI.Rectangle, quad: Array<IPoint>, outTransform: PIXI.Transform): this;
        fillUniforms(uniforms: any): void;
    }
}
declare module PIXI.projection {
    class Container2s extends PIXI.Container {
        constructor();
        proj: ProjectionSurface;
        get worldTransform(): any;
    }
}
declare namespace PIXI {
    interface Matrix extends PIXI.projection.IWorldTransform {
        apply(pos: IPoint, newPos?: IPoint): IPoint;
        applyInverse(pos: IPoint, newPos?: IPoint): IPoint;
    }
}
declare module PIXI.projection {
    import IPoint = PIXI.IPoint;
    interface IWorldTransform {
        apply(pos: IPoint, newPos: IPoint): IPoint;
        applyInverse(pos: IPoint, newPos: IPoint): IPoint;
    }
    class ProjectionSurface extends AbstractProjection {
        constructor(legacy: PIXI.Transform, enable?: boolean);
        _surface: Surface;
        _activeProjection: ProjectionSurface;
        set enabled(value: boolean);
        get surface(): Surface;
        set surface(value: Surface);
        applyPartial(pos: IPoint, newPos?: IPoint): IPoint;
        apply(pos: IPoint, newPos?: IPoint): IPoint;
        applyInverse(pos: IPoint, newPos: IPoint): IPoint;
        mapBilinearSprite(sprite: PIXI.Sprite, quad: Array<IPoint>): void;
        _currentSurfaceID: number;
        _currentLegacyID: number;
        _lastUniforms: any;
        clear(): void;
        get uniforms(): any;
    }
}
declare module PIXI.projection {
    class BatchBilineardGeometry extends PIXI.Geometry {
        _buffer: PIXI.Buffer;
        _indexBuffer: PIXI.Buffer;
        constructor(_static?: boolean);
    }
    class BatchBilinearPluginFactory {
        static create(options: any): any;
    }
}
declare module PIXI {
    interface Sprite {
        convertTo2s(): void;
    }
    interface Container {
        convertTo2s(): void;
        convertSubtreeTo2s(): void;
    }
}
declare module PIXI.projection {
}
declare module PIXI.projection {
    class Sprite2s extends PIXI.Sprite {
        constructor(texture: PIXI.Texture);
        proj: ProjectionSurface;
        aTrans: PIXI.Matrix;
        _calculateBounds(): void;
        calculateVertices(): void;
        calculateTrimmedVertices(): void;
        get worldTransform(): any;
    }
}
declare module PIXI.projection {
    class Text2s extends PIXI.Text {
        constructor(text?: string, style?: PIXI.TextStyle, canvas?: HTMLCanvasElement);
        proj: ProjectionSurface;
        aTrans: PIXI.Matrix;
        get worldTransform(): any;
    }
}
declare module PIXI.projection {
    function container2dWorldTransform(): any;
    class Container2d extends PIXI.Container {
        constructor();
        proj: Projection2d;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        get worldTransform(): any;
    }
    let container2dToLocal: <T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP) => T;
}
declare module PIXI.projection {
    import IPoint = PIXI.IPoint;
    enum AFFINE {
        NONE = 0,
        FREE = 1,
        AXIS_X = 2,
        AXIS_Y = 3,
        POINT = 4,
        AXIS_XR = 5
    }
    class Matrix2d {
        static readonly IDENTITY: Matrix2d;
        static readonly TEMP_MATRIX: Matrix2d;
        mat3: Float64Array;
        floatArray: Float32Array;
        constructor(backingArray?: ArrayLike<number>);
        get a(): number;
        get b(): number;
        get c(): number;
        get d(): number;
        get tx(): number;
        get ty(): number;
        set a(value: number);
        set b(value: number);
        set c(value: number);
        set d(value: number);
        set tx(value: number);
        set ty(value: number);
        set(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
        toArray(transpose?: boolean, out?: Float32Array): Float32Array;
        apply(pos: IPoint, newPos: IPoint): IPoint;
        translate(tx: number, ty: number): this;
        scale(x: number, y: number): this;
        scaleAndTranslate(scaleX: number, scaleY: number, tx: number, ty: number): void;
        applyInverse(pos: IPoint, newPos: IPoint): IPoint;
        invert(): Matrix2d;
        identity(): Matrix2d;
        clone(): Matrix2d;
        copyTo2dOr3d(matrix: Matrix2d): Matrix2d;
        copyTo(matrix: PIXI.Matrix, affine?: AFFINE, preserveOrientation?: boolean): PIXI.Matrix;
        copyFrom(matrix: PIXI.Matrix): this;
        setToMultLegacy(pt: PIXI.Matrix, lt: Matrix2d): this;
        setToMultLegacy2(pt: Matrix2d, lt: PIXI.Matrix): this;
        setToMult(pt: Matrix2d, lt: Matrix2d): this;
        prepend(lt: any): this;
    }
}
declare module PIXI.projection {
    class Mesh2d extends PIXI.Mesh {
        static defaultVertexShader: string;
        static defaultFragmentShader: string;
        constructor(geometry: PIXI.Geometry, shader: PIXI.Shader, state: PIXI.State, drawMode?: number);
        vertexData2d: Float32Array;
        proj: Projection2d;
        calculateVertices(): void;
        _renderDefault(renderer: PIXI.Renderer): void;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        get worldTransform(): any;
    }
    class SimpleMesh2d extends Mesh2d {
        constructor(texture: PIXI.Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number);
        autoUpdate: boolean;
        get vertices(): Float32Array;
        set vertices(value: Float32Array);
        protected _render(renderer?: PIXI.Renderer): void;
    }
}
declare module PIXI.projection {
    import IPoint = PIXI.IPoint;
    class Projection2d extends LinearProjection<Matrix2d> {
        constructor(legacy: PIXI.Transform, enable?: boolean);
        matrix: Matrix2d;
        pivot: PIXI.ObservablePoint;
        reverseLocalOrder: boolean;
        onChange(): void;
        setAxisX(p: IPoint, factor?: number): void;
        setAxisY(p: IPoint, factor?: number): void;
        mapSprite(sprite: PIXI.Sprite, quad: Array<IPoint>): void;
        mapQuad(rect: PIXI.Rectangle, p: Array<IPoint>): void;
        updateLocalTransform(lt: PIXI.Matrix): void;
        clear(): void;
    }
}
declare module PIXI {
    interface Sprite {
        _texture: PIXI.Texture;
        vertexData: Float32Array;
        vertexTrimmedData: Float32Array;
        _transformID?: number;
        _textureID?: number;
        _transformTrimmedID?: number;
        _textureTrimmedID?: number;
        _anchor?: ObservablePoint;
        convertTo2d?(): void;
    }
    interface Container {
        convertTo2d?(): void;
        convertSubtreeTo2d?(): void;
    }
    interface SimpleMesh {
        convertTo2d?(): void;
    }
    interface Graphics {
        convertTo2d?(): void;
    }
}
declare module PIXI.projection {
}
declare module PIXI.projection {
    class Sprite2d extends PIXI.Sprite {
        constructor(texture: PIXI.Texture);
        vertexData2d: Float32Array;
        proj: Projection2d;
        _calculateBounds(): void;
        calculateVertices(): void;
        calculateTrimmedVertices(): void;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        get worldTransform(): any;
    }
}
declare module PIXI.projection {
    class Text2d extends PIXI.Text {
        constructor(text?: string, style?: PIXI.TextStyle, canvas?: HTMLCanvasElement);
        proj: Projection2d;
        vertexData2d: Float32Array;
        get worldTransform(): any;
    }
}
declare module PIXI.projection {
    class TilingSprite2d extends PIXI.TilingSprite {
        constructor(texture: PIXI.Texture, width: number, height: number);
        tileProj: Projection2d;
        proj: Projection2d;
        get worldTransform(): any;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        _render(renderer: PIXI.Renderer): void;
    }
}
declare module PIXI.projection {
    class TilingSprite2dRenderer extends PIXI.ObjectRenderer {
        constructor(renderer: PIXI.Renderer);
        shader: PIXI.Shader;
        simpleShader: PIXI.Shader;
        quad: PIXI.QuadUv;
        render(ts: any): void;
    }
}
declare module PIXI.projection {
}
declare module PIXI.projection {
    class SpriteMaskFilter2d extends PIXI.Filter {
        constructor(sprite: PIXI.Sprite);
        maskSprite: PIXI.Sprite;
        maskMatrix: Matrix2d;
        apply(filterManager: PIXI.systems.FilterSystem, input: PIXI.RenderTexture, output: PIXI.RenderTexture, clearMode?: boolean): void;
        static calculateSpriteMatrix(input: PIXI.RenderTexture, mappedMatrix: Matrix2d, sprite: PIXI.Sprite): Matrix2d;
    }
}
declare module PIXI.projection {
    class Camera3d extends Container3d {
        constructor();
        _far: number;
        _near: number;
        _focus: number;
        _orthographic: boolean;
        get far(): number;
        get near(): number;
        get focus(): number;
        get ortographic(): boolean;
        setPlanes(focus: number, near?: number, far?: number, orthographic?: boolean): void;
    }
}
declare module PIXI.projection {
    function container3dWorldTransform(): any;
    class Container3d extends PIXI.Container {
        constructor();
        proj: Projection3d;
        isFrontFace(forceUpdate?: boolean): boolean;
        getDepth(forceUpdate?: boolean): number;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        get worldTransform(): any;
        get position3d(): PIXI.IPoint;
        get scale3d(): PIXI.IPoint;
        get euler(): IEuler;
        get pivot3d(): PIXI.IPoint;
        set position3d(value: PIXI.IPoint);
        set scale3d(value: PIXI.IPoint);
        set euler(value: IEuler);
        set pivot3d(value: PIXI.IPoint);
    }
    let container3dToLocal: <T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP) => T;
    let container3dGetDepth: (forceUpdate?: boolean) => number;
    let container3dIsFrontFace: (forceUpdate?: boolean) => boolean;
}
declare module PIXI.projection {
    class Euler {
        constructor(x?: number, y?: number, z?: number);
        _quatUpdateId: number;
        _quatDirtyId: number;
        quaternion: Float64Array;
        _x: number;
        _y: number;
        _z: number;
        _sign: number;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get pitch(): number;
        set pitch(value: number);
        get yaw(): number;
        set yaw(value: number);
        get roll(): number;
        set roll(value: number);
        set(x?: number, y?: number, z?: number): void;
        copyFrom(euler: IEuler): void;
        copyTo(p: IEuler): IEuler;
        equals(euler: IEuler): boolean;
        clone(): Euler;
        update(): boolean;
    }
}
declare module PIXI.projection {
    import IPoint = PIXI.IPoint;
    class Matrix3d {
        static readonly IDENTITY: Matrix3d;
        static readonly TEMP_MATRIX: Matrix3d;
        mat4: Float64Array;
        floatArray: Float32Array;
        _dirtyId: number;
        _updateId: number;
        _mat4inv: Float64Array;
        cacheInverse: boolean;
        constructor(backingArray?: ArrayLike<number>);
        get a(): number;
        get b(): number;
        get c(): number;
        get d(): number;
        get tx(): number;
        get ty(): number;
        set a(value: number);
        set b(value: number);
        set c(value: number);
        set d(value: number);
        set tx(value: number);
        set ty(value: number);
        set(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
        toArray(transpose?: boolean, out?: Float32Array): Float32Array;
        setToTranslation(tx: number, ty: number, tz: number): void;
        setToRotationTranslationScale(quat: Float64Array, tx: number, ty: number, tz: number, sx: number, sy: number, sz: number): Float64Array;
        apply(pos: IPoint, newPos: IPoint): IPoint;
        translate(tx: number, ty: number, tz: number): this;
        scale(x: number, y: number, z?: number): this;
        scaleAndTranslate(scaleX: number, scaleY: number, scaleZ: number, tx: number, ty: number, tz: number): void;
        applyInverse(pos: IPoint, newPos: IPoint): IPoint;
        invert(): Matrix3d;
        invertCopyTo(matrix: Matrix3d): void;
        identity(): Matrix3d;
        clone(): Matrix3d;
        copyTo3d(matrix: Matrix3d): Matrix3d;
        copyTo2d(matrix: Matrix2d): Matrix2d;
        copyTo2dOr3d(matrix: Matrix2d | Matrix3d): Matrix2d | Matrix3d;
        copyTo(matrix: PIXI.Matrix, affine?: AFFINE, preserveOrientation?: boolean): PIXI.Matrix;
        copyFrom(matrix: PIXI.Matrix): this;
        setToMultLegacy(pt: PIXI.Matrix, lt: Matrix3d): this;
        setToMultLegacy2(pt: Matrix3d, lt: PIXI.Matrix): this;
        setToMult(pt: Matrix3d, lt: Matrix3d): this;
        prepend(lt: any): void;
        static glMatrixMat4Invert(out: Float64Array, a: Float64Array): Float64Array;
        static glMatrixMat4Multiply(out: Float64Array, a: Float64Array, b: Float64Array): Float64Array;
    }
}
declare module PIXI.projection {
    class Mesh3d2d extends PIXI.Mesh {
        constructor(geometry: PIXI.Geometry, shader: PIXI.Shader, state: PIXI.State, drawMode?: number);
        vertexData2d: Float32Array;
        proj: Projection3d;
        calculateVertices(): void;
        get worldTransform(): any;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        isFrontFace(forceUpdate?: boolean): any;
        getDepth(forceUpdate?: boolean): any;
        get position3d(): PIXI.IPoint;
        get scale3d(): PIXI.IPoint;
        get euler(): Euler;
        get pivot3d(): PIXI.IPoint;
        set position3d(value: PIXI.IPoint);
        set scale3d(value: PIXI.IPoint);
        set euler(value: Euler);
        set pivot3d(value: PIXI.IPoint);
    }
    class SimpleMesh3d2d extends Mesh3d2d {
        constructor(texture: PIXI.Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number);
        autoUpdate: boolean;
        get vertices(): Float32Array;
        set vertices(value: Float32Array);
        protected _render(renderer?: PIXI.Renderer): void;
    }
}
declare module PIXI.projection {
    type IEuler = Euler | ObservableEuler;
    class ObservableEuler {
        cb: any;
        scope: any;
        constructor(cb: any, scope: any, x?: number, y?: number, z?: number);
        _quatUpdateId: number;
        _quatDirtyId: number;
        quaternion: Float64Array;
        _x: number;
        _y: number;
        _z: number;
        _sign: number;
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get pitch(): number;
        set pitch(value: number);
        get yaw(): number;
        set yaw(value: number);
        get roll(): number;
        set roll(value: number);
        set(x?: number, y?: number, z?: number): void;
        copyFrom(euler: IEuler): void;
        copyTo(p: IEuler): IEuler;
        equals(euler: IEuler): boolean;
        clone(): Euler;
        update(): boolean;
    }
}
declare namespace PIXI {
    interface IPoint {
        z?: number;
        set(x?: number, y?: number, z?: number): void;
    }
    interface Point {
        z?: number;
        set(x?: number, y?: number, z?: number): void;
    }
    interface ObservablePoint {
        _z?: number;
        z: number;
        cb?: any;
        scope?: any;
        set(x?: number, y?: number, z?: number): void;
    }
}
declare module PIXI.projection {
    class Point3d extends PIXI.Point {
        constructor(x?: number, y?: number, z?: number);
        set(x?: number, y?: number, z?: number): this;
        copyFrom(p: PIXI.IPoint): this;
        copyTo(p: PIXI.Point): PIXI.Point;
    }
    class ObservablePoint3d extends PIXI.ObservablePoint {
        _z: number;
        get z(): number;
        set z(value: number);
        set(x?: number, y?: number, z?: number): this;
        copyFrom(p: PIXI.IPoint): this;
        copyTo(p: PIXI.IPoint): PIXI.IPoint;
    }
}
declare module PIXI.projection {
    class Projection3d extends LinearProjection<Matrix3d> {
        constructor(legacy: PIXI.Transform, enable?: boolean);
        cameraMatrix: Matrix3d;
        _cameraMode: boolean;
        get cameraMode(): boolean;
        set cameraMode(value: boolean);
        position: ObservablePoint3d;
        scale: ObservablePoint3d;
        euler: ObservableEuler;
        pivot: ObservablePoint3d;
        onChange(): void;
        clear(): void;
        updateLocalTransform(lt: PIXI.Matrix): void;
    }
}
declare module PIXI {
    interface Container {
        convertTo3d(): void;
        convertSubtreeTo3d(): void;
    }
}
declare module PIXI.projection {
}
declare module PIXI.projection {
    class Sprite3d extends PIXI.Sprite {
        constructor(texture: PIXI.Texture);
        vertexData2d: Float32Array;
        proj: Projection3d;
        culledByFrustrum: boolean;
        trimmedCulledByFrustrum: boolean;
        calculateVertices(): void;
        calculateTrimmedVertices(): void;
        _calculateBounds(): void;
        _render(renderer: PIXI.Renderer): void;
        containsPoint(point: PIXI.IPoint): boolean;
        get worldTransform(): any;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        isFrontFace(forceUpdate?: boolean): any;
        getDepth(forceUpdate?: boolean): any;
        get position3d(): PIXI.IPoint;
        get scale3d(): PIXI.IPoint;
        get euler(): Euler;
        get pivot3d(): PIXI.IPoint;
        set position3d(value: PIXI.IPoint);
        set scale3d(value: PIXI.IPoint);
        set euler(value: Euler);
        set pivot3d(value: PIXI.IPoint);
    }
}
declare module PIXI.projection {
    class Text3d extends PIXI.Text {
        constructor(text?: string, style?: PIXI.TextStyle, canvas?: HTMLCanvasElement);
        proj: Projection3d;
        vertexData2d: Float32Array;
        get worldTransform(): any;
        toLocal<T extends PIXI.IPoint>(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: T, skipUpdate?: boolean, step?: TRANSFORM_STEP): T;
        isFrontFace(forceUpdate?: boolean): any;
        getDepth(forceUpdate?: boolean): any;
        get position3d(): PIXI.IPoint;
        get scale3d(): PIXI.IPoint;
        get euler(): IEuler;
        get pivot3d(): PIXI.IPoint;
        set position3d(value: PIXI.IPoint);
        set scale3d(value: PIXI.IPoint);
        set euler(value: IEuler);
        set pivot3d(value: PIXI.IPoint);
    }
}
declare module PIXI.projection.utils {
    import IPoint = PIXI.IPoint;
    function getIntersectionFactor(p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint, out: IPoint): number;
    function getPositionFromQuad(p: Array<IPoint>, anchor: IPoint, out: IPoint): IPoint;
}
