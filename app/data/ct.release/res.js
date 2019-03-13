(function (ct) {
    const loader = new PIXI.loaders.Loader();
    const loadingLabel = ct.pixiApp.view.previousSibling,
          loadingBar = loadingLabel.querySelector('.ct-aLoadingBar');
    /* global dragonBones */
    const dbFactory = window.dragonBones? dragonBones.PixiFactory.factory : null;
    ct.res = {
        soundsLoaded: 0,
        soundsTotal: [/*@sndtotal@*/][0],
        soundsError: 0,
        sounds: {},
        registry: [/*@textureregistry@*/][0],
        skelRegistry: [/*@skeletonregistry@*/][0],
        fetchImage(url, callback) {
            loader.add(url, url);
            loader.load((loader, resources) => {
                callback(resources);
            });
            loader.onError((loader, resources) => {
                loader.add(url, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=');
                console.error('[ct.res] An image from ' + resources + ' wasn\'t loaded :( Maybe refreshing the page will solve this problem…');
                ct.res.texturesError++;
            });
        },
        parseImages() {
            // filled by IDE and catmods. As usual, atlases are splitted here.
            /*@res@*/
            /*%res%*/
            PIXI.loader.load();
        },
        getTexture(name, frame) {
            if (name === -1) {
                if (frame !== void 0) {
                    return PIXI.Texture.EMPTY;
                }
                return [PIXI.Texture.EMPTY];
            }
            const reg = ct.res.registry[name];
            if (frame !== void 0) {
                return reg.textures[frame];
            }
            return reg.textures;
        },
        makeSkeleton(name) {
            const r = ct.res.skelRegistry[name],
                  skel = dbFactory.buildArmatureDisplay('Armature', r.data.name);
            skel.ctName = name;
            skel.on(dragonBones.EventObject.SOUND_EVENT, function (event) {
                if (ct.sound.exists(event.name)) {
                    ct.sound.spawn(event.name);
                } else {
                    console.warn(`Skeleton ${skel.ctName} tries to play a non-existing sound ${event.name} at animation ${skel.animation.lastAnimationName}`);
                }
            });
            return skel;
        }
    };
    
    PIXI.loader.onLoad.add(e => {
        loadingLabel.setAttribute('data-progress', e.progress);
        loadingBar.style.width = e.progress + '%';
    });
    PIXI.loader.onComplete.add(() => {
        for (const texture in ct.res.registry) {
            const reg = ct.res.registry[texture];
            reg.textures = [];
            if (reg.frames) {
                for (let i = 0; i < reg.frames; i++) {
                    const tex = PIXI.loader.resources[reg.atlas].textures[`${texture}_frame${i}`];
                    tex.defaultAnchor = new PIXI.Point(reg.anchor.x, reg.anchor.y);
                    reg.textures.push(tex);
                }
            } else {
                const texture = PIXI.loader.resources[reg.atlas].texture;
                reg.textures.push(texture);
            }
        }
        for (const skel in ct.res.skelRegistry) {
            ct.res.skelRegistry[skel].data = PIXI.loader.resources[ct.res.skelRegistry[skel].origname + '_ske.json'].data;
        }
        /*%resload%*/
        loadingLabel.classList.add('hidden');
        setTimeout(() => {
            /*%start%*/
            ct.pixiApp.ticker.add(ct.loop);
            ct.rooms.forceSwitch(ct.rooms.starting);
        }, 0);
    });
    ct.res.parseImages();
})(ct);
