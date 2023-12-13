declare interface IStyle extends IAsset {
    name: string;
    font: {
        family: string;
        size: number;
        italic?: boolean;
        weight: string;
        halign: string;
        lineHeight?: number;
        wrap?: boolean;
        wrapPosition?: number;
    };
    fill?: {
        type: string;
        color?: string;
        color1?: string;
        color2?: string;
        gradtype?: string;
    };
    stroke?: {
        weight: number;
        color: string;
    };
    shadow?: {
        x: number;
        y: number;
        blur: number;
        color: string | number;
    }
}
