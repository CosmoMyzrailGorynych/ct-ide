ct.draw.patch = function (img, ind, marginx, marginy, x, y, width, height) {
    if (typeof marginx === 'object') {
        ({marginx, marginy, x, y, width, height} = marginx);
    }
    var slices = [];
    slices.push([ // central
        ct.res.graphs[img].frames[ind][0] + marginx,
        ct.res.graphs[img].frames[ind][1] + marginy,
        ct.res.graphs[img].width - marginx * 2,
        ct.res.graphs[img].height - marginy * 2, 
        x + marginx - ct.rooms.current.x,
        y + marginy - ct.rooms.current.y,
        width - marginx * 2,
        height - marginy * 2
    ]);
    if (marginx > 0) {
        slices.push([ // left
            ct.res.graphs[img].frames[ind][0],
            ct.res.graphs[img].frames[ind][1] + marginy,
            marginx,
            ct.res.graphs[img].height - marginy * 2, 
            x - ct.rooms.current.x,
            y + marginy - ct.rooms.current.y,
            marginx,
            height - marginy * 2
        ]);
        slices.push([ // right
            ct.res.graphs[img].frames[ind][0] + ct.res.graphs[img].width - marginx,
            ct.res.graphs[img].frames[ind][1] + marginy,
            marginx,
            ct.res.graphs[img].height - marginy * 2, 
            x + width - marginx - ct.rooms.current.x,
            y + marginy - ct.rooms.current.y,
            marginx,
            height - marginy * 2
        ]);
    }
    if (marginy > 0) {
        slices.push([ // top
            ct.res.graphs[img].frames[ind][0] + marginx,
            ct.res.graphs[img].frames[ind][1],
            ct.res.graphs[img].height - marginy * 2,
            marginy, 
            x + marginx - ct.rooms.current.x,
            y - ct.rooms.current.y,
            width - marginx * 2,
            marginy
        ]);
        slices.push([ // bottom
            ct.res.graphs[img].frames[ind][0] + marginx,
            ct.res.graphs[img].frames[ind][1] + ct.res.graphs[img].height - marginy,
            ct.res.graphs[img].width - marginx * 2, 
            marginy,
            x + marginx - ct.rooms.current.x,
            y + height - marginy - ct.rooms.current.y,
            width - marginx * 2,
            marginy,
        ]);
    }
    if (marginx > 0 && marginy > 0) {
        slices.push([
            slices[1][0], slices[3][1],
            slices[1][2], slices[3][3],
            slices[1][4], slices[3][5],
            slices[1][6], slices[3][7]
        ]);
        slices.push([
            slices[2][0], slices[4][1],
            slices[2][2], slices[4][3],
            slices[2][4], slices[4][5],
            slices[2][6], slices[4][7]
        ]);
        slices.push([
            slices[2][0], slices[3][1],
            slices[2][2], slices[3][3],
            slices[2][4], slices[3][5],
            slices[2][6], slices[3][7]
        ]);
        slices.push([
            slices[1][0], slices[4][1],
            slices[1][2], slices[4][3],
            slices[1][4], slices[4][5],
            slices[1][6], slices[4][7]
        ]);
    }
    for (const slice of slices) {
        ct.x.drawImage(
            ct.res.graphs[img].atlas,
            slice[0], slice[1],
            slice[2], slice[3],
            slice[4], slice[5],
            slice[6], slice[7]
        );
    }
};
