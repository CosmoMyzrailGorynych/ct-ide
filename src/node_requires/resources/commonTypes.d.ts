type resourceType = 'template' | 'room' | 'sound' | 'style' |
                    'texture' | 'tandem' | 'typeface' | 'behavior' | 'script' |
                    'enum';

type fontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

type assetRef = -1 | string; // Either an empty string or a UID

interface IDisposable {
    dispose(): void;
}
