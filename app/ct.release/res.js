/***************************************
            [ res cotomod ]
***************************************/

ct.res = {
    graphsLoaded: 0,
    graphsTotal: @graphsTotal@,
    graphsError: 0,
    soundsLoaded: 0,
    soundsTotal: @sndtotal@,
    soundsError: 0,
    graphUrls: [@graphUrls@ %resload%],
    images: {},
    sounds: {},
    graphs: {},
    fetchImage: function (url,callback) {
        // Load an image. When comlete, put it in resource object or execute a callback
        // If failed, replace an image with an empty one
        img = document.createElement('img');
        img.src = url;
        img.onload = function () {
            ct.res.images[url] = this;
            ct.res.graphsLoaded ++;
            if (callback)
                callback();
            else {
                if (ct.res.graphsLoaded + ct.res.graphsError == ct.res.graphsTotal) {
                    ct.res.parseImages();
                }
            } 
        };
        img.onerror = img.onabort = function () { 
            ct.res.images[url] = this;
            ct.res.graphsError ++;
            if (callback)
                callback(true);
            else {
                console.log('[ct.res] Изображение с url ' + this.src + ' не удалось загрузить :( Возможно, обновление страницы решит эту проблему.');
                console.log('[ct.res] An image from ' + this.src + ' wasn\'t loaded :( Maybe refreshing the page will solve this problem…');
                if (ct.res.graphsLoaded + ct.res.graphsError == ct.res.graphsTotal) {
                    ct.res.parseImages();
                }
            };
            this.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=";
        }
    },
    'makeSprite': function (name,url,x,y,w,h,xo,yo,cols,rows,untill,shape) {
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
            for (var xx = 0; xx < cols; xx ++) {
                o.frames.push([x + xx * o.width,y + yy * o.height]);
                if (yy * cols + xx >= untill) break;
            }
            if (yy * cols + xx >= untill) break;
        }
        if (shape) {
            o.shape = shape;
        } else {
            o.shape = {type: 'point'};
        }
        ct.res.graphs[name] = o;
    },
    'parseImages': function () {
        // filled by IDE and catmods. Usually atlases are splitted here.

        @res@
        %res%
    }
};

// start loading images
for (i in ct.res.graphUrls) {
    ct.res.fetchImage(ct.res.graphUrls[i]);
};