ct.sprite = function (source, name, frames) {
    var gr = ct.res.registry[source];
    if (!gr) {
        console.error('[ct.sprite] Graphic asset does not exist: ' + source);
        return false;
    }
    if (ct.res.registry[name]) {
        console.error('[ct.sprite] Graphic asset with this name already exists: ' + name);
        return false;
    }
    var spr = {
        anchor: {
            x: gr.anchor.x,
            y: gr.anchor.y
        },
        atlas: gr.atlas,
        frames: frames.length,
        shape: gr.shape,
        textures: frames.map(function (id) {
            if (gr.textures[id]) {
                return gr.textures[id];
            }
            console.error('[ct.sprite] Frame '+ id + ' does not exist in the asset: '+ source);
            return gr.textures[0];
        }),
    };
    ct.res.registry[name] = spr;
    return true;
};
