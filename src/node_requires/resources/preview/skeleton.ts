import {imageContain, toBuffer} from '../../utils/imageUtils';
import {Spine, ISkeletonData} from 'node_modules/pixi-spine';
import {getSkeletonData} from '../skeletons';

import * as PIXI from 'node_modules/pixi.js';

export class SkeletonPreviewer {
    static get(skel: ISkeleton, fileSys?: boolean | 'last'): string {
        if (fileSys) {
            if (fileSys === 'last') {
                return `d${skel.uid}.png`;
            }
            const path = require('path');
            return path.join(global.projdir, 'prev', `d${skel.uid}.png`);
        }
        return `file://${global.projdir.replace(/\\/g, '/')}/prev/d${
            skel.uid
        }.png?cache=${skel.lastmod}`;
    }

    static getClassic(skel: ISkeleton, _x2: boolean, fileSys: boolean): string {
        return SkeletonPreviewer.get(skel, fileSys);
    }

    static retain(skels: ISkeleton[]): string[] {
        return skels.flatMap((skel) => [
            skel.origname,
            `${skel.origname.replace('_ske.json', '')}_tex.json`,
            `${skel.origname.replace('_ske.json', '')}_tex.png`
        ]);
    }

    static retainPreview(skels: ISkeleton[]): string[] {
        return skels.map((skel) => SkeletonPreviewer.get(skel, 'last'));
    }

    static async createWithBounds(skel: ISkeleton): Promise<[HTMLCanvasElement, PIXI.Rectangle]> {
        const {spineData} = await PIXI.Assets.load(getSkeletonData(skel, false));
        const spine = new Spine(spineData);

        const app = new PIXI.Application();
        app.stage.addChild(spine);
        spine.updateTransform();
        const bounds = spine.getBounds();

        const skelCanvas = app.renderer.extract.canvas(spine) as HTMLCanvasElement;
        return [skelCanvas, bounds];
    }

    static create(skel: ISkeleton): Promise<HTMLCanvasElement> {
        return this.createWithBounds(skel).then(([skelCanvas]) => skelCanvas);
    }

    static async saveWithBounds(skel: ISkeleton): Promise<[string, PIXI.Rectangle]> {
        const destPath = this.get(skel, true);
        const [source, bounds] = await this.createWithBounds(skel);
        const c = imageContain(source, 128, 128);
        const buf = toBuffer(c);
        const fs = require('fs-extra');
        await fs.writeFile(destPath, buf);
        return [destPath, bounds];
    }
    static save(skel: ISkeleton): Promise<string> {
        return this.saveWithBounds(skel).then(([path]) => path);
    }
}
