type canvasPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

interface IRoomBackground {
    depth: number,
    texture: assetRef,
    parallaxX: number,
    parallaxY: number,
    shiftX: number,
    shiftY: number,
    movementX: number,
    movementY: number,
    scaleX: number,
    scaleY: number,
    repeat: canvasPatternRepeat
}

type CopyAlignment = 'start' | 'center' | 'end' | 'scale' | 'both';

interface IRoomCopy {
    x: number,
    y: number,
    /** The UID of the template used */
    uid: string,
    scale: {
        x: number,
        y: number
    },
    rotation?: number,
    tint?: number,
    opacity?: number,
    customText?: string,
    /** For text labels; sets around which point a text label aligns itself. */
    customAnchor?: {
        x: number,
        y: number
    },
    /**
     * For text labels only. Sets the size of the label's font.
     * This will be converted to number in the editor but putting
     * an empty string counts as having no custom text size
     */
    customSize?: string,
    /**
     * For text labels only. Limits how wide a line can span.
     * This will be converted to number in the editor but putting
     * an empty string counts as having no custom text size
     */
    customWordWrap?: string,
    align?: {
        frame: {
            x1: number,
            y1: number,
            x2: number,
            y2: number
        },
        alignX: CopyAlignment,
        alignY: CopyAlignment,
        padding: {
            left: number,
            top: number,
            right: number,
            bottom: number
        }
    },
    /** @deprecated */
    exts: {
        [key: string]: unknown
    },
    /** User-defined properties set to this specific copy */
    customProperties: Record<string, unknown>
}

interface ITileTemplate {
    x: number;
    y: number;
    opacity: number;
    tint: number;
    frame: number;
    scale: {
        x: number,
        y: number
    };
    rotation: number;
    texture: string;
}

interface ITileLayerTemplate {
    depth: number;
    tiles: Array<ITileTemplate>,
    extends?: Record<string, unknown>
    hidden?: boolean;
}

interface IRoom extends IScriptableBehaviors {
    type: 'room';
    width: number;
    height: number;
    /** A CSS color */
    backgroundColor: string;
    backgrounds: Array<IRoomBackground>;
    copies: Array<IRoomCopy>;
    tiles: Array<ITileLayerTemplate>;
    gridX: number;
    gridY: number;
    diagonalGrid: boolean;
    simulate: boolean;
    restrictCamera?: boolean;
    restrictMinX?: number;
    restrictMinY?: number;
    restrictMaxX?: number;
    restrictMaxY?: number;
    follow: assetRef;
    isUi: boolean;
    extends: {
        [key: string]: unknown
    };
}
