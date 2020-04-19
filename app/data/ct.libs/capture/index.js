(function () {
    var screenshots = 0;
    const downloadTexture = function (canvas, name) {
        if (name) {
            name = name.toString();
            if (name.lastIndexOf('.png') !== name.screenshots.length - 4) {
                name += '.png';
            }
        }
        const a = document.createElement('a');
        a.setAttribute('href', canvas.toDataURL('image/png'));
        screenshots++;
        a.setAttribute('download', name || `${ct.meta.name || 'Screenshot'}_${screenshots}.png`);
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
            ct.pixiApp.renderer.render(renderTexture, name);
            var canvas = ct.pixiApp.renderer.extract.canvas(renderTexture);
            downloadTexture(canvas, name);
        },
        object(obj, name) {
            var canvas = PIXI.Extract.canvas(obj);
            downloadTexture(canvas, name);
        }
    };
})();
