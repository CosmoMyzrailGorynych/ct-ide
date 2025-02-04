import {ExportedStyle} from './exporter/_exporterContracts';
import {getById} from './resources';
import {getFontDomName} from './resources/typefaces';
import {Color} from 'node_modules/pixi.js';

export const styleToTextStyle = (s: IStyle, forIde?: boolean): ExportedStyle => {
    const o = {
        fontFamily: s.font.family,
        fontSize: s.font.size,
        fontStyle: s.font.italic ? 'italic' : 'normal',
        fontWeight: s.font.weight,
        align: s.font.halign,
        lineJoin: 'round',
        lineHeight: s.font.lineHeight || s.font.size * 1.35
    } as ExportedStyle;
    if (s.typeface !== -1) {
        const typeface = getById('typeface', s.typeface);
        if (forIde) {
            const font = typeface.fonts.find(f =>
                f.weight === s.font.weight &&
                f.italic === s.font.italic);
            if (font) {
                o.fontFamily = getFontDomName(font);
            }
        } else if ((o.fontFamily as string).trim()) {
            o.fontFamily = typeface.name + ', ' + o.fontFamily;
        } else {
            o.fontFamily = typeface.name;
        }
    }
    if (s.font.wrap) {
        o.wordWrap = true;
        o.wordWrapWidth = s.font.wrapPosition || 100;
    }
    if (s.fill) {
        if (Number(s.fill.type) === 0) {
            o.fill = s.fill.color ? new Color(s.fill.color).toNumber() : 0xFFFFFF;
        } else if (Number(s.fill.type) === 1) {
            o.fill = [
                s.fill.color1 ? new Color(s.fill.color1).toNumber() : 0xFFFFFF,
                s.fill.color2 ? new Color(s.fill.color1).toNumber() : 0xFFFFFF
            ];
            if (Number(s.fill.gradtype) === 1) {
                o.fillGradientType = 0;
            } else if (Number(s.fill.gradtype) === 2) {
                o.fillGradientType = 1;
            }
        }
    }
    if (s.stroke) {
        o.stroke = {
            color: s.stroke.color,
            width: s.stroke.weight
        };
    }
    if (s.shadow) {
        o.dropShadow = {
            blur: s.shadow.blur,
            color: new Color(s.shadow.color).toNumber(),
            angle: Math.atan2(s.shadow.y, s.shadow.x),
            distance: Math.hypot(s.shadow.x, s.shadow.y),
            alpha: new Color(s.shadow.color).alpha
        };
    }
    return o;
};
