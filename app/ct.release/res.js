ct.res = {
    graphsLoaded: 0,
    graphsTotal: [/*@graphsTotal@*/][0],
    graphsError: 0,
    soundsLoaded: 0,
    soundsTotal: [/*@sndtotal@*/][0],
    soundsError: 0,
    graphUrls: [/*@graphUrls@*//*%resload%*/],
    images: {},
    sounds: {},
    graphs: {},
    fetchImage(url, callback) {
        // Load an image. When comlete, put it in resource object or execute a callback
        // If failed, replace an image with an empty one
        var img = document.createElement('img');
        img.src = url;
        img.onload = function () {
            ct.res.images[url] = img;
            ct.res.graphsLoaded++;
            if (callback) {
                return callback();
            } else if (ct.res.graphsLoaded + ct.res.graphsError === ct.res.graphsTotal) {
                ct.res.parseImages();
            }
            return void 0;
        };
        img.onerror = img.onabort = function () { 
            ct.res.images[url] = img;
            ct.res.graphsError++;
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';
            if (callback) {
                return callback(true);
            }
            console.error('[ct.res] An image from ' + img.src + ' wasn\'t loaded :( Maybe refreshing the page will solve this problem…');
            if (ct.res.graphsLoaded + ct.res.graphsError === ct.res.graphsTotal) {
                ct.res.parseImages();
            }
            return void 0;
        };
    },
    makeSprite(name, url, x, y, w, h, xo, yo, cols, rows, untill, shape) {
        // extracts sprite from atlas
        var o = {},
            i = ct.res.images[url];
        o.atlas = i;
        o.frames = [];
        o.x = xo;
        o.y = yo;
        if (untill === 0) {
            untill = cols*rows;
            o.untill = untill;
        }
        o.width = w / cols;
        o.height = h / rows;
        for (var yy = 0; yy < rows; yy++) {
            for (var xx = 0; xx < cols; xx++) {
                o.frames.push([x + xx * o.width,y + yy * o.height]);
                if (yy * cols + xx >= untill) {
                    break;
                }
            }
        }
        if (shape) {
            o.shape = shape;
        } else {
            o.shape = {type: 'point'};
        }
        ct.res.graphs[name] = o;
    },
    parseImages() {
        // filled by IDE and catmods. As usual, atlases are splitted here.
        /*@res@*/
        /*%res%*/
    }
};

// start loading images
for (const i in ct.res.graphUrls) {
    ct.res.fetchImage(ct.res.graphUrls[i]);
}
