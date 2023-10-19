import {getPathToTtf} from '../fonts';

export class FontPreviewer {
    static get(font: IFont, fileSys?: boolean | 'last'): string {
        if (fileSys) {
            if (fileSys === 'last') {
                return `f${font.uid}.png`;
            }
            const path = require('path');
            return path.join(global.projdir, 'prev', `f${font.uid}.png`);
        }
        return `file://${global.projdir.replace(/\\/g, '/')}/prev/f${
            font.uid
        }.png?cache=${font.lastmod}`;
    }

    static getClassic(font: IFont, _x2: boolean, fileSys: boolean): string {
        return FontPreviewer.get(font, fileSys);
    }

    static retain(_fonts: IFont[]): string[] {
        return [];
    }

    static retainPreview(fonts: IFont[]): string[] {
        return fonts.map((font) => FontPreviewer.get(font, 'last'));
    }

    static async create(font: IFont): Promise<HTMLCanvasElement> {
        const template = {
            weight: font.weight,
            style: font.italic ? 'italic' : 'normal'
        };
        const face = new FontFace(
            'CTPROJFONT' + font.typefaceName,
            `url('${getPathToTtf(font)}')`,
            template
        );

        const loaded = await face.load();
        (loaded as any).external = true;
        (loaded as any).ctId = (face as any).ctId = font.uid;
        document.fonts.add(loaded);

        const canvas = document.createElement('canvas');
        const cx = canvas.getContext('2d');
        canvas.width = canvas.height = 128;
        cx.clearRect(0, 0, 128, 128);
        cx.font = `${font.italic ? 'italic ' : ''}${font.weight} ${Math.floor(96 * 0.75)}px "${loaded.family}"`;
        cx.fillStyle = '#000';
        cx.fillText('Aa', 12 + 96 * 0.05, 12 + 96 * 0.75);

        return canvas;
    }

    static async save(font: IFont): Promise<string> {
        try {
            const fs = require('fs-extra');
            const destPath = FontPreviewer.get(font, true);
            const canvas = await FontPreviewer.create(font);
            const dataURL = canvas.toDataURL();
            const previewBuffer = dataURL.replace(
                /^data:image\/\w+;base64,/,
                ''
            );
            const buf = Buffer.from(previewBuffer, 'base64');
            await fs.writeFile(FontPreviewer.get(font, true), buf);
            return destPath;
        } catch (e) {
            console.error(e);
            return '';
        }
    }
}
