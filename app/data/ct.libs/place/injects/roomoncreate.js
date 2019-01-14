/* global SSCD */
ct.place.tileGrid = {};
if (ct.types.list.TILELAYER) {
    for (const layer of ct.types.list.TILELAYER) {
        for (let i = 0, l = layer.tiles.length; i < l; i++) {
            const t = layer.tiles[i];
            // eslint-disable-next-line no-underscore-dangle
            t._shape = new SSCD.Rectangle(new SSCD.Vector(t.x, t.y), new SSCD.Vector(t.width, t.height));
            t.$chashes = ct.place.getHashes(t);
            /* eslint max-depth: 0 */
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
}
