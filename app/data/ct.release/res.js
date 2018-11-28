(function (ct) {
    const loader = new PIXI.loaders.Loader();
    ct.res = {
        graphsLoaded: 0,
        graphsError: 0,
        soundsLoaded: 0,
        soundsTotal: [/*@sndtotal@*/][0],
        soundsError: 0,
        images: {},
        sounds: {},
        registry: [/*@graphregistry@*/][0],
        fetchImage(url, callback) {
            loader.add(url, url);
            loader.load((loader, resources) => {
                callback(resources);
            });
            loader.onError((loader, resources) => {
                loader.add(url, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=');
                console.error('[ct.res] An image from ' + resources + ' wasn\'t loaded :( Maybe refreshing the page will solve this problem…');
                ct.res.graphsError++;
            });
        },
        parseImages() {
            // filled by IDE and catmods. As usual, atlases are splitted here.
            /*@res@*/
            /*%res%*/
        },
        getTexture(name, frame) {
            const reg = ct.res.registry[name];
            if (frame !== void 0) {
                return reg.textures[frame];
            }
            return reg.textures;
        }
    };
    
    PIXI.loader.onComplete.add(() => {
        for (const graph in ct.res.registry) {
            const reg = ct.res.registry[graph];
            reg.textures = [];
            if (reg.frames) {
                for (let i = 0; i < reg.frames; i++) {
                    const texture = PIXI.loader.resources[reg.atlas].textures[`${graph}_frame${i}`];
                    texture.defaultAnchor = new PIXI.Point(reg.anchor.x, reg.anchor.y);
                    reg.textures.push(texture);
                }
            } else {
                const texture = PIXI.loader.resources[reg.atlas].texture;
                reg.textures.push(texture);
            }
        }
        setTimeout(() => {
            /*%start%*/
            ct.pixiApp.ticker.add(ct.loop);
            ct.rooms.forceSwitch(ct.rooms.starting);
            ct.mouse.setupListeners();
        }, 0);
    });
    ct.res.parseImages();
})(ct);
