ct.sprite = function (source, name, frames) {
    var gr = ct.res.graphs[source];
    if (!gr) {
        console.error('[ct.sprite] Graphic asset does not exist: ' + source);
        return false;
    }
    if (ct.res.graphs[name]) {
        console.error('[ct.sprite] Graphic asset with this name already exists: ' + name);
        return false;
    }
    var spr = {
        atlas: gr.atlas,
        frames: frames.map(function (id) {
            if (gr.frames[id]) {
                return gr.frames[id];
            }
            console.error('[ct.sprite] Frame '+ id + ' does not exist in the asset: '+ source);
            return gr.frames[0];
        }),
        width: gr.width,
        height: gr.height,
        shape: gr.shape,
        x: gr.x,
        y: gr.y
    };
    ct.res.graphs[name] = spr;
    return true;
};
