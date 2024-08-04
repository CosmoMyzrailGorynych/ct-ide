import {getPathToTtf} from '../typefaces';
import fs from '../../neutralino-fs-extra';

export class TypefacePreviewer {
    static get(typeface: ITypeface, fileSys?: boolean | 'last'): string {
        if (fileSys) {
            if (fileSys === 'last') {
                return `f${typeface.uid}.png`;
            }
            const path = require('path');
            return path.join(window.projdir, 'prev', `f${typeface.uid}.png`);
        }
        return `${window.projdir.replace(/\\/g, '/')}/prev/f${
            typeface.uid
        }.png`;
    }

    static getClassic(typeface: ITypeface, _x2: boolean, fileSys: boolean): string {
        return TypefacePreviewer.get(typeface, fileSys);
    }

    static retain(): string[] {
        return [];
    }

    static retainPreview(assets: ITypeface[]): string[] {
        return assets.map((typeface) => TypefacePreviewer.get(typeface, 'last'));
    }

    static async create(typeface: ITypeface): Promise<HTMLCanvasElement> {
        const [firstFont] = typeface.fonts;
        const template = {
            weight: firstFont.weight,
            style: firstFont.italic ? 'italic' : 'normal'
        };
        const face = new FontFace(
            'CTPROJFONT' + typeface.name,
            `url('${getPathToTtf(firstFont)}')`,
            template
        );

        const loaded = await face.load();
        (loaded as any).external = true;
        (loaded as any).ctId = (face as any).ctId = typeface.uid;
        document.fonts.add(loaded);

        const canvas = document.createElement('canvas');
        const cx = canvas.getContext('2d')!;
        canvas.width = canvas.height = 128;
        cx.clearRect(0, 0, canvas.width, canvas.height);
        cx.fillStyle = '#000';
        cx.rect(0, 0, canvas.width, canvas.height);
        cx.fill();
        cx.font = `${firstFont.italic ? 'italic ' : ''}${firstFont.weight} ${Math.floor(96 * 0.75)}px "${loaded.family}"`;
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillStyle = '#fff';
        cx.fillText('Gg', canvas.width / 2, canvas.height / 2);

        return canvas;
    }

    static async save(typeface: ITypeface): Promise<string> {
        try {
            const destPath = TypefacePreviewer.get(typeface, true);
            const canvas = await TypefacePreviewer.create(typeface);
            const dataURL = canvas.toDataURL();
            const previewBuffer = dataURL.replace(
                /^data:image\/\w+;base64,/,
                ''
            );
            const buf = Buffer.from(previewBuffer, 'base64');
            await fs.writeFile(TypefacePreviewer.get(typeface, true), buf);
            return destPath;
        } catch (e) {
            console.error(e);
            return '';
        }
    }
}
