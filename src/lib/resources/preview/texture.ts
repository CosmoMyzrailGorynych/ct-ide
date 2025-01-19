import {crop, imageContain, toBuffer} from '../../utils/imageUtils';
import {getDOMImageFromTexture} from '../textures';
import {getById} from '..';
import fs from '../../neutralino-fs-extra';
import path from 'path';
import {getFilesDir} from '../projects';

export class TexturePreviewer {
    /**
     * Gets the filesystem path to the preview image of a given texture.
     * @param lastPortion If true, returns the last portion of the filepath.
     */
    static getFs = (texture: string | ITexture, lastPortion?: boolean): string => {
        if (typeof texture === 'string') {
            texture = getById('texture', texture);
        }
        if (lastPortion) {
            return `i${texture.uid}.png`;
        }
        return path.join(getFilesDir(), 'prev', `i${texture.uid}.png`);
    };
    /**
     * Retrieves the path to the texture's preview image based on the provided texture.
     *
     * @param texture - The texture reference or object to get the preview for.
     * @param fileSys - Optional parameter to specify the file system location.
     *                  If `true`, returns the full file system path.
     *                  If `'last'`, returns the last portion of the filepath.
     *                  If not provided, returns the relative path.
     *
     * @returns The path to the texture's preview image.
     */
    static get(texture: assetRef | ITexture): string {
        if (texture === -1) {
            return '/data/img/notexture.png';
        }
        if (typeof texture === 'string') {
            texture = getById('texture', texture);
        }
        return `/project/prev/i${texture.uid}.png`;
    }

    static retain(textures: ITexture[]): string[] {
        return (textures || []).map((texture) => texture.origname);
    }

    static retainPreview(textures: ITexture[]): string[] {
        return textures.map((tex) => TexturePreviewer.getFs(tex, true));
    }

    static create(texture: string | ITexture): Promise<HTMLImageElement> {
        return getDOMImageFromTexture(texture);
    }

    static async save(texture: string | ITexture): Promise<string> {
        try {
            const destPath = TexturePreviewer.getFs(texture);
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
            await fs.writeFile(destPath, buf);
            return destPath;
        } catch (e) {
            console.error(e);
            return '';
        }
    }
}
