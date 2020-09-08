ct.sprite = function sprite(source, name, frames) {
    const gr = ct.res.textures[source];
    if (!gr) {
        console.error('[ct.sprite] Graphic asset does not exist: ' + source);
        return false;
    }
    if (ct.res.textures[name]) {
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
        textures: frames.map(function mapSpriteFrames(id) {
            if (gr.textures[id]) {
                return gr.textures[id];
            }
            console.error(`[ct.sprite] Frame #${id} does not exist in the asset ${source}`);
            return gr.textures[0];
        })
    };
    ct.res.textures[name] = spr;
    return true;
};
