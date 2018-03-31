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
        img.onload = function() {
            ct.res.images[url] = img;
            ct.res.graphsLoaded++;
            if (callback) {
                return callback(null, img);
            } else if (ct.res.graphsLoaded + ct.res.graphsError === ct.res.graphsTotal) {
                ct.res.parseImages();
            }
            return void 0;
        };
        img.onerror = img.onabort = function(e) { 
            ct.res.images[url] = img;
            ct.res.graphsError++;
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';
            if (callback) {
                return callback(e);
            }
            console.error('[ct.res] An image from ' + img.src + ' wasn\'t loaded :( Maybe refreshing the page will solve this problem…');
            if (ct.res.graphsLoaded + ct.res.graphsError === ct.res.graphsTotal) {
                ct.res.parseImages();
            }
            return void 0;
        };
    },
    makeSprite(name, url, opts) {
        var i, o;
        opts.cols = opts.cols || 1;
        opts.rows = opts.rows || 1;
        opts.x = opts.x || 0;
        opts.y = opts.y || 0;
        opts.marginx = opts.marginx || 0;
        opts.marginy = opts.marginy || 0;
        opts.shiftx = opts.shiftx || 0;
        opts.shifty = opts.shifty || 0;
        // extracts sprite from atlas
        o = {};
        i = ct.res.images[url];
        o.atlas = i;
        o.frames = [];
        o.x = opts.xo || 0;
        o.y = opts.yo || 0;
        if (!opts.untill) {
            opts.untill = opts.cols*opts.rows;
            o.untill = opts.untill;
        }
        o.width = opts.w || 1;
        o.height = opts.h || 1;
        for (var yy = 0; yy < (opts.rows || 1); yy++) {
            for (var xx = 0; xx < opts.cols; xx++) {
                o.frames.push([opts.shiftx + opts.x + xx * (o.width + opts.marginx), opts.shifty + opts.y + yy * (o.height + opts.marginy)]);
                if (yy * opts.cols + xx >= opts.untill) {
                    break;
                }
            }
        }
        if (opts.shape) {
            o.shape = opts.shape;
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
