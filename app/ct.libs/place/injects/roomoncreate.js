for (const layer of ct.types.list.TILELAYER) {
    for (let i = 0, l = layer.tiles.length; i < l; i++) {
        const t = layer.tiles[i];
        t.$chashes = ct.place.getHashes(t);
        for (const hash of t.$chashes) {
            if (!(hash in ct.place.tileGrid)) {
                ct.place.tileGrid[hash] = [t];
            } else {
                ct.place.tileGrid[hash].push(t);
            }
        }
        t.depth = layer.depth;
    }
}
