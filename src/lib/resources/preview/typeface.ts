import {getPathToTtf} from '../typefaces';
import {getById} from '..';
import path from 'path';
import {outputCanvasToFile} from '../../utils/imageUtils';

import {BlobCache} from 'src/lib/blobCache';
export const cache = new BlobCache();
signals.on('resetAll', () => {
    cache.reset();
});

export class TypefacePreviewer {
    static getFs(typeface: string | ITypeface, getLastPortion?: boolean): string {
        if (typeof typeface === 'string') {
            typeface = getById('typeface', typeface);
        }
        if (getLastPortion) {
            return `f${typeface.uid}.png`;
        }
        return path.join(window.projdir, 'prev', `f${typeface.uid}.png`);
    }

    static get(typeface: ITypeface | assetRef): Promise<string> {
        if (typeface === -1) {
            return Promise.resolve('data/img/notexture.png');
        }
        if (typeof typeface === 'string') {
            typeface = getById('typeface', typeface);
        }
        return cache.getUrl(TypefacePreviewer.getFs(typeface));
    }

    static retain(): string[] {
        return [];
    }

    static retainPreview(assets: ITypeface[]): string[] {
        return assets.map((typeface) => TypefacePreviewer.getFs(typeface, true));
    }

    static async create(typeface: ITypeface): Promise<HTMLCanvasElement> {
        const [firstFont] = typeface.fonts;
        const template = {
            weight: firstFont.weight,
            style: firstFont.italic ? 'italic' : 'normal'
        };
        const face = new FontFace(
            'CTPROJFONT' + typeface.name,
            `url('${await getPathToTtf(firstFont)}')`,
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
            const destPath = TypefacePreviewer.getFs(typeface);
            const canvas = await TypefacePreviewer.create(typeface);
            await outputCanvasToFile(canvas, destPath);
            return destPath;
        } catch (e) {
            console.error(e);
            return '';
        }
    }
}
