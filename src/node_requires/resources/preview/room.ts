
import {getById} from '..';
import {outputCanvasToFile} from '../../utils/imageUtils';

import * as PIXI from 'node_modules/pixi.js';

export class RoomPreviewer {
    static get(room: assetRef | IRoom, fileSys?: boolean | 'last'): string {
        if (room === -1) {
            return 'data/img/notexture.png';
        }
        if (typeof room === 'string') {
            room = getById('room', room);
        }
        if (fileSys) {
            if (fileSys === 'last') {
                return `r${room.uid}.png`;
            }
            const path = require('path');
            return path.join(global.projdir, 'prev', `r${room.uid}.png`);
        }
        return `file://${global.projdir.replace(/\\/g, '/')}/prev/r${
            room.uid
        }.png?cache=${room.lastmod}`;
    }

    static getClassic(
        room: assetRef | IRoom,
        _x2: boolean,
        fileSys: boolean
    ): string {
        const result = RoomPreviewer.get(room, fileSys);
        return result;
    }

    static retain(): string[] {
        return ['splash.png'];
    }

    static retainPreview(rooms: IRoom[]): string[] {
        return rooms.map((room) => RoomPreviewer.get(room, 'last'));
    }

    static create(room: IRoom): Promise<HTMLCanvasElement> {
        const w = 340,
              h = 256;
        const renderTexture = PIXI.RenderTexture.create({
            width: w,
            height: h
        });
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const pixelart = Boolean(currentProject.settings.rendering.pixelatedrender);
        const scale = Math.min(w / room.width, h / room.height);
        // turning it into an import creates a circular dependency (? or race condition?)
        // and breaks everything, so DON'T TOUCH THIS
        const {RoomEditorPreview} = require('../../roomEditor/previewer');
        const preview = new RoomEditorPreview(
            {
                view: canvas
            },
            room,
            pixelart,
            {
                x: (w - room.width * scale) / 2,
                y: (h - room.height * scale) / 2,
                scale
            }
        );
        preview.renderer.render(preview.stage, {
            renderTexture
        });
        return Promise.resolve(preview.renderer.extract.canvas(renderTexture) as HTMLCanvasElement);
    }

    static async save(
        room: assetRef | IRoom,
        asSplash: boolean
    ): Promise<string> {
        try {
            if (typeof room === 'number') {
                throw new Error('Cannot write a room preview for a room -1');
            }
            if (typeof room === 'string') {
                room = getById('room', room);
            }
            const destPath = RoomPreviewer.get(room, true);
            const canvas = await RoomPreviewer.create(room);
            if (asSplash) {
                const path = require('path');
                const splash = path.join(
                    window.projdir,
                    'img',
                    'splash.png'
                );
                return Promise.all([
                    outputCanvasToFile(canvas, destPath),
                    outputCanvasToFile(canvas, splash)
                ]).then(() => destPath);
            }
            await outputCanvasToFile(canvas, destPath);
            return destPath;
        } catch (e) {
            console.error(e);
            return '';
        }
    }
}
