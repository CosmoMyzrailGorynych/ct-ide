import {Sprite, Texture, Application} from 'pixi.js';
import {utils as pixiSoundUtils} from '@pixi/sound';
import {join} from 'path';

import {outputCanvasToFile} from '../../utils/imageUtils';

import {getById} from '..';
import {TexturePreviewer} from './texture';
import {loadVariant, unloadVariant} from '../sounds';

import {BlobCache} from 'src/lib/blobCache';
export const cache = new BlobCache();
signals.on('resetAll', () => {
    cache.reset();
});

export class SoundPreviewer {
    static getFs(
        sound: string | ISound,
        variantUid?: string,
        lastPart?: boolean,
        long?: boolean
    ): string {
        if (typeof sound === 'string') {
            sound = getById('sound', sound);
        }
        if (!variantUid) {
            variantUid = sound.variants[0].uid;
        }
        const basename = `snd${sound.uid}_${variantUid}${long ? '_long' : ''}.png`;
        if (lastPart) {
            return basename;
        }
        return join(window.projdir, 'prev', basename);
    }
    static get(sound: ISound, variantUid?: string, long?: boolean): Promise<string> {
        if (sound.variants.length === 0 && !variantUid) {
            return TexturePreviewer.get(-1);
        }
        return cache.getUrl(SoundPreviewer.getFs(sound, variantUid, false, long));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static retain(sounds: ISound[]): string[] {
        return [];
    }

    static retainPreview(sounds: ISound[]): string[] {
        const filenames: string[] = [];
        for (const sound of sounds) {
            for (const variant of sound.variants) {
                filenames.push(SoundPreviewer.getFs(sound, variant.uid, true));
                filenames.push(SoundPreviewer.getFs(sound, variant.uid, true, true));
            }
        }
        return filenames;
    }

    static async create(soundAsset: ISound, variant?: ISound['variants'][0], long?: boolean): Promise<HTMLCanvasElement> {
        const sound = await loadVariant(
            soundAsset,
            variant || soundAsset.variants[0]
        );

        const base = pixiSoundUtils.render(sound, {
            height: long ? 100 : 128,
            width: long ? 960 : 128,
            fill: '#ff0000'
        });
        const waveform = new Sprite(new Texture(base as any));
        const app = new Application();
        app.stage.addChild(waveform);
        waveform.updateTransform();
        const canvas = app.renderer.extract.canvas(waveform) as
            HTMLCanvasElement;
        app.destroy(false, {
            children: true
        });
        unloadVariant(soundAsset, variant || soundAsset.variants[0], `preview${long ? 'Long' : ''}`);
        return canvas;
    }

    static async save(sound: ISound, variant?: ISound['variants'][0]): Promise<string> {
        if (variant) {
            const canvases = await Promise.all([
                SoundPreviewer.create(sound, variant, false),
                SoundPreviewer.create(sound, variant, true)
            ]);
            await Promise.all(canvases.map((canvas, id) =>
                outputCanvasToFile(canvas, SoundPreviewer.getFs(
                    sound,
                    variant.uid,
                    false,
                    id === 1 // The second canvas is for the long preview
                ))));
            return SoundPreviewer.get(sound, variant.uid);
        }
        await Promise.all(sound.variants.map((variant) => SoundPreviewer.save(sound, variant)));
        return SoundPreviewer.get(sound);
    }
}
