type builtinCharsets = 'allInFont' | 'punctuation' | 'basicLatin' | 'latinExtended' | 'cyrillic' | 'greekCoptic' | 'custom';

interface IFont extends IAsset {
    typefaceName: string;
    origname: string;
    weight: fontWeight;
    italic: boolean;
    bitmapFont: boolean;
    bitmapFontSize: number;
    bitmapFontLineHeight: number;
    charsets: builtinCharsets[];
    customCharset?: string;
}
