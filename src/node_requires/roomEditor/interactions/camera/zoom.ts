import {IRoomEditorInteraction} from '../..';
import {ease, Easing} from 'node_modules/pixi-ease';

interface IZoomData {
    ease: Easing
}

const zoomInteraction: IRoomEditorInteraction<IZoomData> = {
    ifListener: 'wheel',
    if() {
        return true;
    },
    listeners: {
        wheel(e, roomTag, affixedData, finishCallback) {
            const oldZoom = roomTag.zoom;
            const dx = this.screen.width / 2 - e.data.global.x,
                  dy = this.screen.height / 2 - e.data.global.y;
            let newZoom;
            if ((e.data.originalEvent as WheelEvent).deltaY < 0) {
                newZoom = oldZoom * 0.75;
            } else {
                newZoom = oldZoom * 1.25;
            }
            if (Math.abs(newZoom - 1) < 0.1) {
                newZoom = 1;
            }
            roomTag.zoom = newZoom;
            if (affixedData.ease) {
                affixedData.ease.remove();
            }
            affixedData.ease = ease.add(this.camera, {
                scale: newZoom,
                x: this.camera.x + dx * (newZoom - this.camera.scale.x),
                y: this.camera.y + dy * (newZoom - this.camera.scale.y)
            }, {
                duration: 200
            })
            .on('each', () => {
                this.camera.updateTransform();
                this.realignCamera();
                roomTag.refs.zoomLabel.innerHTML = `${Math.round(this.getZoom())}%`;
            })
            .once('complete', finishCallback);
        }
    }
};

export {zoomInteraction};
