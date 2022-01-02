ct.sprite = function sprite(source, name, frames) {
    const gr = ct.res.getTexture(source);
    if (!gr) {
        console.error('[ct.sprite] Graphic asset does not exist: ' + source);
        return false;
    }
    if (ct.res.textures[name]) {
        console.error('[ct.sprite] Graphic asset with this name already exists: ' + name);
        return false;
    }
    var spr = frames.map(function mapSpriteFrames(id) {
        if (gr[id]) {
            return gr[id];
        }
        console.error(`[ct.sprite] Frame #${id} does not exist in the asset ${source}`);
        return gr[0];
    });
    spr.shape = gr.shape;
    ct.res.textures[name] = spr;
    return true;
};
