type builtinCharsets = 'allInFont' | 'punctuation' | 'basicLatin' | 'latinExtended' | 'cyrillic' | 'greekCoptic' | 'custom';

interface IFont {
    weight: fontWeight;
    italic: boolean;
    uid: string;
    origname: string;
}

interface ITypeface extends IAsset {
    type: 'typeface';
    fonts: IFont[];
    bitmapFont: boolean;
    bitmapFontSize: number;
    bitmapFontLineHeight: number;
    charsets: builtinCharsets[];
    customCharset?: string;
}
