if (this === ct.room) {
    ct.matter.on('collisionStart', e => {
        const {pairs} = e;
        ct.matter.walkOverWithRulebook(ct.matter.rulebookStart, pairs);
    });
    ct.matter.on('collisionActive', e => {
        const {pairs} = e;
        ct.matter.walkOverWithRulebook(ct.matter.rulebookActive, pairs);
    });
    ct.matter.on('collisionEnd', e => {
        const {pairs} = e;
        ct.matter.walkOverWithRulebook(ct.matter.rulebookEnd, pairs);
    });
}

for (const layer of this.tileLayers) {
    if (!layer.matterMakeStatic) {
        continue;
    }
    if (this.children.indexOf(layer) === -1) {
        continue;
    }
    ct.matter.createStaticTilemap(layer);
}
