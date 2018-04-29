/* global ct */

ct.canvas = {
    create(w, h) {
        var canv = document.createElement('canvas');
        canv.setAttribute('width', w);
        canv.setAttribute('height', h);
        canv.x = canv.getContext('2d');
        return canv;
    },
    drawTile(canv, img, imgindex, x, y) {
        var graph = ct.res.graphs[img],
            frame = graph.frames[imgindex];
        canv.x.drawImage(
            graph.atlas,
            frame[0], frame[1], graph.width, graph.height,
            x-graph.x, y-graph.y, graph.width, graph.height);
    },
    drawTileExt(canv, img, imgindex, x, y, hs, vs, r, a) {
        canv.x.save();
        canv.x.globalAlpha = a;
        canv.x.translate(x-ct.rooms.current.x,y-ct.rooms.current.y);
        canv.x.rotate(r*Math.PI/180);
        canv.x.scale(hs,vs);
        ct.canvas.drawTile(canv, img, imgindex, x, y);
        canv.x.restore();
    },
    appendTo(canv, id) {
        (id.appendChild || document.getElementById(id).appendChild)(canv);
    },
    draw(canv, x, y) {
        ct.x.drawImage(canv, x, y);
    }
};
