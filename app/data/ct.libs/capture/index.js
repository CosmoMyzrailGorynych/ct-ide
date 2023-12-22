(function () {
    var screenshots = 0;
    const downloadTexture = function (canvas, name) {
        if (name) {
            name = name.toString();
            if (!name.endsWith('.png')) {
                name += '.png';
            }
        }
        const a = document.createElement('a');
        a.setAttribute('href', canvas.toDataURL('image/png'));
        screenshots++;
        a.setAttribute(
            'download',
            name || `${meta.name || 'Screenshot'}_${screenshots}.png`
        );
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    const captureCanvas = (x = null, y = null, width = null, height = null, name) => {
        const renderTexture = PIXI.RenderTexture.create({
            width: pixiApp.renderer.width, height: pixiApp.renderer.height
        });
        pixiApp.renderer.render(pixiApp.stage, {
            renderTexture
        });
        if (x) {
            renderTexture.frame = new PIXI.Rectangle(x, y, width, height);
        }
        const canvas = pixiApp.renderer.extract.canvas(renderTexture);
        downloadTexture(canvas, name);
    };
    capture = {
        screen(name) {
            captureCanvas(null, null, null, null, name);
        },
        portion(x, y, width, height, name) {
            captureCanvas(x, y, width, height, name);
        },
        object(obj, name) {
            const {width, height} = obj.getBounds();
            const canvas = pixiApp.renderer.extract.canvas(obj, {
                x: 0,
                y: 0,
                width: width / obj.scale.x,
                height: height / obj.scale.y
            });
            downloadTexture(canvas, name);
        }
    };
})();
