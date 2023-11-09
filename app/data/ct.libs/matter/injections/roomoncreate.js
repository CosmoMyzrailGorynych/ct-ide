if (this === rooms.current) {
    matter.on('collisionStart', e => {
        const {pairs} = e;
        matter.walkOverWithRulebook(matter.rulebookStart, pairs);
    });
    matter.on('collisionActive', e => {
        const {pairs} = e;
        matter.walkOverWithRulebook(matter.rulebookActive, pairs);
    });
    matter.on('collisionEnd', e => {
        const {pairs} = e;
        matter.walkOverWithRulebook(matter.rulebookEnd, pairs);
    });
}

for (const layer of this.tileLayers) {
    if (!layer.matterMakeStatic) {
        continue;
    }
    if (this.children.indexOf(layer) === -1) {
        continue;
    }
    matter.createStaticTilemap(layer);
}
