ct.canvas = {
    'create': function (w,h) {
        var canv = document.createElement("canvas");
        canv.setAttribute('width', w);
        canv.setAttribute('height', h);
        canv.x = canv.getContext("2d");
        return canv;
    },
    'drawTile': function (canv, img,imgindex, x, y) {
        canv.x.drawImage(ct.graphs[img].atlas,ct.graphs[img]['frames'][imgindex][0],ct.graphs[img]['frames'][imgindex][1],ct.graphs[img].width,ct.graphs[img].height,x-ct.graphs[img].x,y-ct.graphs[img].y,ct.graphs[img].width,ct.graphs[img].height);
    },
    'drawTileExt': function (canv,img,imgindex,x,y,hs,vs,r,a) {
        canv.x.save();
        canv.x.globalAlpha = a;
        canv.x.translate(x-ct.rooms.current.x,y-ct.rooms.current.y);
        canv.x.rotate(r*Math.PI/180);
        canv.x.scale(hs,vs);
        canv.x.drawImage(ct.graphs[img].atlas,ct.graphs[img]['frames'][imgindex][0],ct.graphs[img]['frames'][imgindex][1],ct.graphs[img].width,ct.graphs[img].height,-ct.graphs[img].x,-ct.graphs[img].y,ct.graphs[img].width,ct.graphs[img].height);
        canv.x.restore();
    },
    'appendTo': function (canv,id) {
        document.getElementById(id).appendChild(canv);
    }
};
ct.libs += "canvas";