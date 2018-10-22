/**
 * draw cotomod
 */

ct.draw = function (t, x, y) {
    t.draw(x, y);
};
ct.u.ext(ct.draw, {
    circle(x, y, r, o) {
        ct.x.beginPath();
        ct.x.arc(x - ct.rooms.current.x, y - ct.rooms.current.y, r, 0, 2*Math.PI);
        if (o) {
            ct.x.stroke();
        } else {
            ct.x.fill();
        }
    },
    line(x, y, xx, yy) {
        ct.x.beginPath();
        ct.x.moveTo(x - ct.rooms.current.x, y - ct.rooms.current.y);
        ct.x.lineTo(xx - ct.rooms.current.x, yy - ct.rooms.current.y);
        ct.x.stroke();
    },
    image(img, imgindex, x, y) {
        const graphic = ct.res.graphs[img];
        ct.x.drawImage(
            graphic.atlas,
            graphic.frames[imgindex][0],
            graphic.frames[imgindex][1],
            graphic.width,
            graphic.height,
            x - graphic.x - ct.rooms.current.x,
            y - graphic.y - ct.rooms.current.y,
            graphic.width,
            graphic.height
        );
    },
    imgext(img, imgindex, x, y, hs, vs, r, a) {
        ct.x.save();
        ct.x.globalAlpha = a;
        ct.x.translate(x - ct.rooms.current.x, y - ct.rooms.current.y);
        ct.x.rotate(-r * Math.PI/180);
        ct.x.scale(hs,vs);
        const graphic = ct.res.graphs[img];
        ct.x.drawImage(
            graphic.atlas,
            graphic.frames[imgindex][0],
            graphic.frames[imgindex][1],
            graphic.width,
            graphic.height,
            -graphic.x,
            -graphic.y,
            graphic.width,
            graphic.height
        );
        ct.x.restore();
    },
    copy(copy,x,y) {
        if (copy.transform) {
            ct.draw.imgext(copy.graph, Math.floor(copy.frame) % ct.res.graphs[copy.graph].frames.length, x, y, copy.tx, copy.ty, copy.tr, copy.ta);
        } else {
            ct.draw.image(copy.graph, Math.floor(copy.frame) % ct.res.graphs[copy.graph].frames.length, x, y);
        }
    },
    text(str, x, y, o) {
        if (o) {
            ct.x.strokeText(str,x-ct.rooms.current.x,y-ct.rooms.current.y);
        } else {
            ct.x.fillText(str,x-ct.rooms.current.x,y-ct.rooms.current.y);
        }
    },
    rectangle(x, y, w, h, o) {
        if (o) {
            ct.x.strokeRect(x - ct.rooms.current.x, y-ct.rooms.current.y, w, h);
        } else {
            ct.x.fillRect(x - ct.rooms.current.x, y-ct.rooms.current.y, w, h);
        }
    },
    rect(x, y, xx, yy, o) {
        ct.x.beginPath();
        ct.x.moveTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
        ct.x.lineTo(xx - ct.rooms.current.x,y - ct.rooms.current.y);
        ct.x.lineTo(xx - ct.rooms.current.x,yy - ct.rooms.current.y);
        ct.x.lineTo(x - ct.rooms.current.x,yy - ct.rooms.current.y);
        ct.x.closePath();
        if (o) {
            ct.x.stroke();
        } else {
            ct.x.fill();
        }
    },
    fix(x, y) {
        ct.x.save();
        ct.x.translate(x, y);
    },
    unfix: ct.x.restore.bind(ct.x),
    polygon(points, close, outline) {
        ct.x.beginPath();
        ct.x.moveTo(points[0][0] - ct.rooms.current.x, ct.rooms.current.y - points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ct.x.lineTo(points[i][0] - ct.rooms.current.x, ct.rooms.current.y - points[i][1]);
        }
        if (close) {
            ct.x.closePath();
        }
        if (outline) {
            ct.x.stroke();
        } else {
            ct.x.fill();
        }
    }
});
ct.u.ext(ct.draw.polygon, {
    begin(x, y) {
        ct.x.beginPath();
        ct.x.moveTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
    },
    move(x,y) {
        ct.x.moveTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
    },
    line(x,y) {
        ct.x.lineTo(x - ct.rooms.current.x,y - ct.rooms.current.y);
    },
    close() {
        ct.x.closePath();
    },
    fill() {
        ct.x.fill();
    },
    stroke() {
        ct.x.stroke();
    }
});
ct.draw.img = ct.draw.image;
