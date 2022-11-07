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
            name || `${ct.meta.name || 'Screenshot'}_${screenshots}.png`
        );
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    ct.capture = {
        screen(name) {
            const renderTexture = PIXI.RenderTexture.create({
                width: ct.pixiApp.renderer.width,
                height: ct.pixiApp.renderer.height
            });
            ct.pixiApp.renderer.render(ct.pixiApp.stage, renderTexture);
            const canvas = ct.pixiApp.renderer.extract.canvas(renderTexture);
            downloadTexture(canvas, name);
        },
        portion(x, y, width, height, name) {
            const rec = new PIXI.Rectangle(x, y, width, height);
            const renderTexture = PIXI.RenderTexture.create({
                width: ct.pixiApp.renderer.width,
                height: ct.pixiApp.renderer.height
            });
            ct.pixiApp.renderer.render(ct.pixiApp.stage, renderTexture);
            renderTexture.frame = rec;
            const canvas = ct.pixiApp.renderer.extract.canvas(renderTexture);
            downloadTexture(canvas, name);
        },
        object(obj, name) {
            const prevX = obj.x,
                  prevY = obj.y;
            obj.x = obj.y = 0;
            const canvas = ct.pixiApp.renderer.extract.canvas(obj, obj.getBounds());
            downloadTexture(canvas, name);
            obj.x = prevX;
            obj.y = prevY;
        }
    };
})();
