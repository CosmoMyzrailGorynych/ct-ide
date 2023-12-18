const sprite = function sprite(source, name, frames) {
    const gr = res.getTexture(source);
    if (!gr) {
        console.error('[sprite] Graphic asset does not exist: ' + source);
        return false;
    }
    if (res.textures[name]) {
        console.error('[sprite] Graphic asset with this name already exists: ' + name);
        return false;
    }
    var spr = frames.map(function mapSpriteFrames(id) {
        if (gr[id]) {
            return gr[id];
        }
        console.error(`[sprite] Frame #${id} does not exist in the asset ${source}`);
        return gr[0];
    });
    spr.shape = gr.shape;
    res.textures[name] = spr;
    return true;
};
window.sprite = sprite;
