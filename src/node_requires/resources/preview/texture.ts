import {crop, imageContain, toBuffer} from '../../utils/imageUtils';
import {getDOMImageFromTexture} from '../textures';
import {getById} from '..';

export class TexturePreviewer {
    static get(
        texture: assetRef | ITexture,
        fileSys?: boolean | 'last'
    ): string {
        if (texture === -1) {
            return 'data/img/notexture.png';
        }
        if (typeof texture === 'string') {
            texture = getById('texture', texture);
        }
        if (fileSys) {
            if (fileSys === 'last') {
                return `i${texture.uid}.png`;
            }
            const path = require('path');
            return path.join(global.projdir, 'prev', `i${texture.uid}.png`);
        }
        return `file://${global.projdir.replace(/\\/g, '/')}/prev/i${
            texture.uid
        }.png?cache=${texture.lastmod}`;
    }

    static getClassic(
        texture: assetRef | ITexture,
        _x2: boolean,
        fileSys: boolean
    ): string {
        return TexturePreviewer.get(texture, fileSys);
    }

    static retain(textures: ITexture[]): string[] {
        return (textures || []).map((texture) => texture.origname);
    }

    static retainPreview(textures: ITexture[]): string[] {
        return textures.map((tex) => TexturePreviewer.get(tex, 'last'));
    }

    static create(texture: string | ITexture): Promise<HTMLImageElement> {
        return getDOMImageFromTexture(texture);
    }

    static async save(texture: string | ITexture): Promise<string> {
        try {
            const destPath = TexturePreviewer.get(texture, true);
            if (typeof texture === 'string') {
                texture = getById('texture', texture);
            }
            const source = await getDOMImageFromTexture(texture);
            const frame = crop(
                source,
                texture.offx,
                texture.offy,
                texture.width,
                texture.height
            );
            const c = imageContain(frame, 128, 128);
            const buf = toBuffer(c);
            const fs = require('fs-extra');
            await fs.writeFile(destPath, buf);
            return destPath;
        } catch (e) {
            console.error(e);
            return '';
        }
    }
}
