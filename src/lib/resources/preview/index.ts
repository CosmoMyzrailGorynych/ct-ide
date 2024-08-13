import {TypefacePreviewer} from './typeface';
import {RoomPreviewer} from './room';
import {StylePreviewer} from './style';
import {TexturePreviewer} from './texture';
import {SoundPreviewer} from './sound';
import {getByTypes} from '..';
import {getStartingRoom} from '../rooms';
import fs from '../../neutralino-fs-extra';

const fileExists = async (path: string) =>
    Boolean(await fs.stat(path).catch((e: Error): void => void e));

// eslint-disable-next-line max-lines-per-function
export const preparePreviews = async function (
    projectData: IProject,
    trashOrphans: boolean
): Promise<void> {
    let trashChecked = false;
    const assets = getByTypes();

    if (trashOrphans) {
        const imagesToKeep = [
            ...TypefacePreviewer.retain(),
            ...RoomPreviewer.retain(),
            ...StylePreviewer.retain(),
            ...SoundPreviewer.retain(assets.sound),
            ...TexturePreviewer.retain(assets.texture)
        ];

        const imgFilenames = await fs.readdir(window.projdir + '/img');
        Promise.all(imgFilenames.map(async (filename) => {
            if (imagesToKeep.indexOf(filename) === -1) {
                if (!trashChecked) {
                    fs.ensureDir(window.projdir + '/trash');
                }
                await fs.move(
                    window.projdir + '/img/' + filename,
                    window.projdir + '/trash/' + filename,
                    {
                        overwrite: true
                    }
                );
            }
        }));

        if (await fs.exists(window.projdir + '/prev')) {
            const previewsToKeep = [
                ...TypefacePreviewer.retainPreview(assets.typeface),
                ...RoomPreviewer.retainPreview(assets.room),
                ...StylePreviewer.retainPreview(assets.style),
                ...SoundPreviewer.retainPreview(assets.sound),
                ...TexturePreviewer.retainPreview(assets.texture)
            ];

            const previewFilenames = await fs.readdir(window.projdir + '/prev');
            if (!trashChecked) {
                trashChecked = true;
                await fs.ensureDir(window.projdir + '/trash');
            }
            await Promise.all(previewFilenames.map(async (filename) => {
                if (previewsToKeep.indexOf(filename) === -1) {
                    // eslint-disable-next-line max-depth
                    await fs.move(
                        window.projdir + '/prev/' + filename,
                        window.projdir + '/trash/' + filename,
                        {
                            overwrite: true
                        }
                    );
                }
            }));
        }
    }

    fs.ensureDir(window.projdir + '/prev');

    const generationPromises: Promise<unknown>[] = [];
    generationPromises.push(...assets.typeface.map(async (typeface: ITypeface) => {
        if (!(await fileExists(TypefacePreviewer.getFs(typeface)))) {
            return TypefacePreviewer.save(typeface);
        }
        return Promise.resolve();
    }));

    const startingRoom = getStartingRoom();
    generationPromises.push(...assets.room.map(async (room: IRoom) => {
        if (!(await fileExists(RoomPreviewer.getFs(room)))) {
            // Generate an additional preview as a splash image
            return RoomPreviewer.save(
                room,
                room === startingRoom
            );
        }
        return Promise.resolve();
    }));
    generationPromises.push(...assets.style.map(async (style: IStyle) => {
        if (!(await fileExists(StylePreviewer.getFs(style)))) {
            return StylePreviewer.save(style);
        }
        return Promise.resolve();
    }));
    generationPromises.push(...assets.texture.map(async (texture: ITexture) => {
        if (!(await fileExists(TexturePreviewer.getFs(texture)))) {
            return TexturePreviewer.save(texture);
        }
        return Promise.resolve();
    }));
    generationPromises.push(...assets.sound.map(async (sound: ISound) => {
        if (!(await fileExists(SoundPreviewer.getFs(sound)))) {
            return SoundPreviewer.save(sound);
        }
        return Promise.resolve();
    }));
    await Promise.all(generationPromises);
};
