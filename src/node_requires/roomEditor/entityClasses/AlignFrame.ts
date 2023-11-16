import {getPixiSwatch} from '../../themes';
import {RoomEditor} from '..';
import {ViewportFrame} from './ViewportFrame';

export class AlignFrame extends ViewportFrame {
    constructor(editor: RoomEditor) {
        super(editor);
        this.icon
        .lineStyle(2, getPixiSwatch('act'), 1, 0.5)
        .moveTo(7, 0)
        .lineTo(7, 18)
        .moveTo(17, 0)
        .lineTo(17, 18)
        .moveTo(3, 5)
        .lineTo(21, 5)
        .moveTo(3, 15)
        .lineTo(21, 15);
        this.redrawFrame();
    }

    redrawFrame(): void {
        if (!(this.editor.currentUiSelection && this.editor.currentUiSelection.align)) {
            this.visible = false;
            return;
        }
        const {align} = this.editor.currentUiSelection;
        if (align.frame.x1 === 0 && // No need to draw a frame if it matches the room
            align.frame.y1 === 0 &&
            align.frame.x2 === 100 &&
            align.frame.y2 === 100
        ) {
            this.visible = false;
            return;
        }
        this.visible = true;
        const {ctRoom} = this.editor;
        this.x = align.frame.x1 / 100 * ctRoom.width;
        this.y = align.frame.y1 / 100 * ctRoom.height;

        const width = (align.frame.x2 - align.frame.x1) / 100 * ctRoom.width,
              height = (align.frame.y2 - align.frame.y1) / 100 * ctRoom.height;
        super.redrawFrame(width, height);

        if (align.padding.top !== 0 ||
            align.padding.bottom !== 0 ||
            align.padding.left !== 0 ||
            align.padding.right !== 0
        ) {
            this.lineStyle(2 * this.editor.camera.scale.x, getPixiSwatch('act'))
            .drawRoundedRect(
                align.padding.left,
                align.padding.top,
                width - align.padding.left - align.padding.right,
                height - align.padding.top - align.padding.bottom,
                0.1
            );
        }
    }
}
