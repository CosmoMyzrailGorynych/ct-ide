declare type blockArgumentType = 'boolean' | 'number' | 'string' | 'color' | 'wildcard' | 'void';

declare interface IBlockPieceLabel {
    type: 'label';
    name: string;
    i18nKey?: string;
}
declare interface IBlockPieceIcon {
    type: 'icon';
    icon: string;
}
declare interface IBlockPieceCode {
    type: 'code';
    key: string;
}
declare interface IBlockPieceArgument {
    type: 'argument';
    key: string;
    typeHint: blockArgumentType;
    defaultConstant?: string;
    required?: boolean;
    assets?: resourceType | 'action';
}
declare interface IBlockPieceTextbox {
    type: 'textbox';
    key: string;
    default?: string;
}
declare interface IBlockPieceBlocks {
    type: 'blocks';
    placeholder?: 'doNothing' | 'putBlocksHere';
    key: string;
}
declare interface IBlockPieceBreak {
    type: 'break'
}

/**
 * A block will need to read and write to block values' variableName property.
 */
declare interface IBlockPropOrVariable {
    type: 'propVar';
}
/**
 * A block will need to read and write to block values' enumId and enumValue properties.
 */
declare interface IBlockEnumValue {
    type: 'enumValue';
}

declare interface IBlockFiller {
    type: 'filler'
}
declare interface IBlockAsyncMarker {
    type: 'asyncMarker'
}
declare interface IBlockOptions {
    type: 'options';
    allowCustom?: boolean;
    options: {
        key: string,
        name: string,
        i18nKey: string,
        typeHint: blockArgumentType,
        assets?: resourceType | 'action',
        defaultConstant?: string,
        required?: boolean
    }[];
}

declare type blockPiece = IBlockPieceLabel | IBlockPieceIcon | IBlockPieceCode |
                          IBlockPieceArgument | IBlockPieceTextbox | IBlockPieceBlocks |
                          IBlockPropOrVariable | IBlockFiller | IBlockAsyncMarker |
                          IBlockPieceBreak | IBlockOptions | IBlockEnumValue;

// eslint-disable-next-line no-use-before-define
type argumentValues = Record<string, IBlock[] | IBlock | string | number | boolean>;

declare interface IBlockDeclaration {
    /** The name of the parent library. Used for serialization. */
    lib: string;
    /** If set, the block will additionally appear in a category with this name */
    category?: string;
    /** A unique string corresponding to this block so it can be serialized and deserialized */
    code: string;
    /** Elements of the block, including input fields and decorations */
    pieces: blockPiece[];
    /** Icon shown at the beginning of the block */
    icon: string;
    /** Searchable command name. Also used as a label if i18nKey is not used or invalid. */
    name: string;
    /** Cached block name used for fuzzy search */
    bakedName?: string;
    /**
     * A string that is shown instead of the searchable name in a block.
     * This name is not used for fuzzy search.
     */
    displayName?: string;
    /**
     * A key in the translation file inside the catnip namespace to use
     * for the main label and search. Supports dot notation.
     */
    i18nKey?: string;
    /**
     * A key in the translation file inside the catnip namespace to use for the main label.
     * Supports dot notation.
     */
    displayI18nKey?: string;

    /** A markdown-formatted documentation shown in a tooltip when hovering over the block. */
    documentation?: string;
    /**
     * A key in the translation file inside the catnip namespace to use for the tooltip.
     * Supports dot notation.
     */
    documentationI18nKey?: string;

    hideLabel?: boolean;
    hideIcon?: boolean;
    /**
     * The function that is used by blocks compiler to render the JS code of this block.
     * `args` are the values of this block's input fields.
     * `safeId` can be used as a unique for this block instance integer
     * and create unique variable names.
     */
    jsTemplate: (
        args: Record<string, string>,
        safeId: number,
        customOptions: Record<string, string>
    ) => string;
    /** A CSS class to assign to this block in HTML */
    customClass?: string;
    /**
     * Mutators appear in context menus and replace the target block when selected,
     * preserving values.
     */
    mutators?: {
        lib: string,
        code: string
    }[];
}
/**
 * A block for an executable method that may have additional arguments
 * and cannot be nested inside other simiar commands.
 */
declare interface IBlockCommandDeclaration extends IBlockDeclaration {
    type: 'command';
    isGroup?: boolean;
}
/** A block for a variable, property, or an inline command that returns a value. */
declare interface IBlockComputedDeclaration extends IBlockDeclaration {
    type: 'computed';
    /**
     * The return type of the computed blocks. A block can be put
     * only in the slot of the same type unless the block or the target slot are wildcards.
     */
    typeHint: blockArgumentType;
    /**
     * This mutator gets applied when a user clicks on the block.
     * It is important for such blocks to switch to each other and be present in the context menu,
     * in `mutators` array.
     */
    onClickMutator?: {
        lib: string;
        code: string;
    }
}

declare type blockDeclaration = IBlockCommandDeclaration | IBlockComputedDeclaration;

declare interface IBlock {
    values: argumentValues;
    customOptions?: Record<string, string | IBlock>;
    groupClosed?: boolean;
    groupName?: string;
    lib: string;
    code: string;
}

type BlockScript = IBlock[];

declare type blockRegistry = Record<string, blockDeclaration>;
declare type blockMenu = {
    name: string;
    i18nKey?: string;
    items: blockDeclaration[];
    opened: boolean;
    icon?: string;
    hidden?: boolean;
}
