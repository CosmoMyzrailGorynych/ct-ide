import {FontPreviewer} from './font';
import {RoomPreviewer} from './room';
import {StylePreviewer} from './style';
import {TexturePreviewer} from './texture';
import {getByTypes} from '..';
import {getStartingRoom} from '../rooms';

const fs = require('fs-extra');
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
            ...FontPreviewer.retain(),
            ...RoomPreviewer.retain(),
            ...StylePreviewer.retain(),
            ...TexturePreviewer.retain(assets.texture)
        ];

        const imgFilenames = fs.readdirSync(global.projdir + '/img');
        for (const filename of imgFilenames) {
            if (imagesToKeep.indexOf(filename) === -1) {
                if (!trashChecked) {
                    fs.ensureDir(global.projdir + '/trash');
                }
                fs.moveSync(
                    global.projdir + '/img/' + filename,
                    global.projdir + '/trash/' + filename,
                    {
                        overwrite: true
                    }
                );
            }
        }

        if (fs.existsSync(global.projdir + '/prev')) {
            const previewsToKeep = [
                ...FontPreviewer.retainPreview(assets.font),
                ...RoomPreviewer.retainPreview(assets.room),
                ...StylePreviewer.retainPreview(assets.style),
                ...TexturePreviewer.retainPreview(assets.texture)
            ];

            const previewFilenames = fs.readdirSync(global.projdir + '/prev');
            if (!trashChecked) {
                await fs.ensureDir(global.projdir + '/trash');
                trashChecked = true;
            }
            for (const filename of previewFilenames) {
                if (previewsToKeep.indexOf(filename) === -1) {
                    // eslint-disable-next-line max-depth
                    fs.moveSync(
                        global.projdir + '/prev/' + filename,
                        global.projdir + '/trash/' + filename,
                        {
                            overwrite: true
                        }
                    );
                }
            }
        }
    }

    fs.ensureDir(global.projdir + '/prev');

    const generationPromises: Promise<unknown>[] = [];
    generationPromises.push(...assets.font.map(async (font: IFont) => {
        if (!(await fileExists(FontPreviewer.get(font, true)))) {
            return FontPreviewer.save(font);
        }
        return Promise.resolve();
    }));

    const startingRoom = getStartingRoom();
    generationPromises.push(...assets.room.map(async (room: IRoom) => {
        if (!(await fileExists(RoomPreviewer.get(room, true)))) {
            // Generate an additional preview as a splash image
            return RoomPreviewer.save(
                room,
                room === startingRoom
            );
        }
        return Promise.resolve();
    }));
    generationPromises.push(...assets.style.map(async (style: IStyle) => {
        if (!(await fileExists(StylePreviewer.get(style, true)))) {
            return StylePreviewer.save(style);
        }
        return Promise.resolve();
    }));
    generationPromises.push(...assets.texture.map(async (texture: ITexture) => {
        if (!(await fileExists(TexturePreviewer.get(texture, true)))) {
            return TexturePreviewer.save(texture);
        }
        return Promise.resolve();
    }));
    await Promise.all(generationPromises);
};
