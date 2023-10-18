//
    Allows a user to import an arbitrary number of bundled assets into the current project

    @attribute type (string)
        The type of assets to show. Currently supports "textures" and "sounds"

    @attribute onclose (riot function)
        A callback that is triggered when a user makes an action to close the gallery

builtin-asset-gallery.aPanel.aView.pad
    .flexfix.tall
        .flexfix-header
            .toright
                .aButtonGroup
                    button(
                        title="{voc.visitSource}"
                        onclick="{() => nw.Shell.openExternal(currentSet.meta.source)}"
                        if="{currentSet && currentSet.meta.source}"
                    )
                        svg.feather
                            use(xlink:href="#external-link")
                    button(
                        title="{voc.visitAuthorsItch}"
                        onclick="{() => nw.Shell.openExternal(currentSet.meta.itch)}"
                        if="{currentSet && currentSet.meta.itch}"
                    )
                        svg.icon
                            use(xlink:href="#itch-dot-io")
                    button(
                        title="{voc.visitAuthorsTwitter}"
                        onclick="{() => nw.Shell.openExternal(currentSet.meta.twitter)}"
                        if="{currentSet && currentSet.meta.twitter}"
                    )
                        svg.icon
                            use(xlink:href="#twitter")
                    button(
                        title="{voc.tipAuthor}"
                        onclick="{() => nw.Shell.openExternal(currentSet.meta.donate)}"
                        if="{currentSet && currentSet.meta.donate}"
                    )
                        svg.feather
                            use(xlink:href="#heart")
                button(onclick="{importAllPossible}" if="{currentSet}")
                    svg.feather(if="{!massImportInProgress}")
                        use(xlink:href="#download")
                    svg.feather.rotate(if="{massImportInProgress}")
                        use(xlink:href="#refresh-cw")
                    span {voc.importAll}
                button(onclick="{opts.onclose}")
                    svg.feather
                        use(xlink:href="#log-out")
                    span {vocGlob.close}
            h2.nmt
                | {voc.assetGalleryHeader}
                hover-hint(text="{voc.galleryTip}")
                |
                svg.feather
                    use(xlink:href="#chevron-right")
                |
                .a.inline(onclick="{returnToGallery}") {vocGlob.assetTypes[opts.type.slice(0, -1)][2]}
                |
                span(if="{currentSet}")
                    svg.feather
                        use(xlink:href="#chevron-right")
                    |
                    | {currentSet.name}
        .flexfix-body(if="{!currentSet}")
            ul.Cards.largeicons
                li.aCard(
                    each="{set in sets}"
                    onclick="{openSet(set)}"
                    no-reorder
                )
                    .aCard-aThumbnail
                        svg.feather(if="{!set.hasSpash}")
                            use(xlink:href="#folder")
                        img(if="{set.hasSpash}" src="{galleryBaseHref}/{parent.opts.type}/{set.name}/Splash.png")
                    .aCard-Properties
                        span(title="{set.name}") {set.name}
                        span(title="{voc.byAuthorPrefix} {set.meta.author}") {voc.byAuthorPrefix} {set.meta.author}
        .flexfix-body(if="{currentSet}")
            span(if="{state === 'loading'}") {vocGlob.loading}
            ul.Cards.largeicons(if="{state !== 'loading'}")
                li.aCard(
                    each="{entry in currentSetEntries}"
                    no-reorder
                )
                    .aCard-aThumbnail
                        svg.feather(if="{entry.type === 'sound'}")
                            use(xlink:href="#music")
                        img(if="{entry.type === 'image'}" src="{entry.href}")
                    .aCard-Properties
                        span {entry.name}
                    .aCard-Actions
                        button.forcebackground.tiny(if="{entry.type === 'sound'}" onpointerover="{playSound(entry.href)}" onpointerout="{stopSound}")
                            // Here .unclickable prevents pointerover events triggering while hovering the icon itself
                            svg.feather.unclickable
                                use(xlink:href="#play")
                        button.forcebackground.tiny(if="{!checkNameOccupied(entry.type, entry.name)}" onclick="{importIntoProject(entry)}" title="{voc.importIntoProject}")
                            svg.feather
                                use(xlink:href="#download")
                        button.forcebackground.tiny(if="{checkNameOccupied(entry.type, entry.name)}" disabled title="{voc.cannotImportExplanation}")
                            svg.feather
                                use(xlink:href="#edit")
                            span {voc.nameOccupied}
    audio(
            if="{currentSound}"
            ref="audioPreview" loop autoplay
            src="{currentSound}"
            onplay="{notifyPlayerPlays}"
    )
    script.
        this.namespace = 'builtinAssetGallery';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        const fs = require('fs-extra'),
              path = require('path');
        const {getGalleryDir} = require('./data/node_requires/platformUtils');
        const root = path.join(getGalleryDir(), this.opts.type);
        this.root = root;
        this.galleryBaseHref = getGalleryDir(this);

        this.sets = [];
        this.currentSet = false;
        this.currentSetEntries = [];
        this.state = 'gallery';

        fs.readdir(root, {
            withFileTypes: true
        })
        .then(entries => entries.filter(entry => entry.isDirectory()).map(entry => entry.name))
        .then(dirs => dirs.map(dir => Promise.all([
            fs.pathExists(path.join(root, dir, 'Splash.png')),
            fs.pathExists(path.join(root, dir, 'license.txt')),
            fs.readJSON(path.join(root, dir, 'meta.json')),
            Promise.resolve(dir)
        ])))
        .then(promises => Promise.all(promises))
        .then(setsData => {
            this.sets = setsData.map(set => ({
                hasSpash: set[0],
                hasLicense: set[1],
                meta: set[2],
                name: set[3]
            }));
            this.update();
        });

        const imageTester = /\.(jpe?g|png|gif|bmp|webp)$/;
        const soundTester = /\.(wav|ogg|mp3)$/;
        const {getCleanTextureName} = require('./data/node_requires/resources/textures');
        this.openSet = set => () => {
            this.currentSet = set;
            this.currentSetEntries = [];
            this.state = 'loading';
            fs.readdir(path.join(root, set.name), {
                withFileTypes: true
            })
            .then(entries => entries.filter(entry => !entry.isDirectory()).map(entry => entry.name))
            .then(entries => entries.filter(entry => !['Splash.png', 'license.txt', 'meta.json'].includes(entry)))
            .then(entries => {
                for (const entry of entries) {
                    const fsPath = path.join(root, set.name, entry);
                    let type;
                    if (imageTester.test(entry)) {
                        type = 'image';
                    } else if (soundTester.test(entry)) {
                        type = 'sound';
                    } else {
                        type = 'unknown';
                    }
                    this.currentSetEntries.push({
                        path: fsPath,
                        href: 'file://' + path.posix.normalize(fsPath),
                        name: getCleanTextureName(path.basename(entry, path.extname(entry))),
                        type
                    });
                }
                this.state = 'complete';
                this.update();
            });
        };
        this.returnToGallery = () => {
            this.state = 'gallery';
            this.currentSet = false;
            this.currentSetEntries = [];
        };

        this.checkNameOccupied = (fileType, name) => {
            if (fileType === 'unknown') {
                return true;
            }
            if (fileType === 'image') {
                return window.currentProject.textures.find(texture => texture.name === name);
            }
            return window.currentProject.sounds.find(sound => sound.name === name);
        };

        this.playSound = sound => () => {
            this.currentSound = sound;
        };
        this.stopSound = () => {
            this.currentSound = void 0;
        };

        const {importImageToTexture} = require('./data/node_requires/resources/textures');
        const {createNewSound, addSoundFile} = require('./data/node_requires/resources/sounds');
        this.importIntoProject = entry => () => {
            if (this.checkNameOccupied(entry.type, entry.name)) {
                window.alertify.error(this.voc.cannotImportNameOccupied.replace('$1', entry.name));
            }
            if (entry.type === 'image') {
                importImageToTexture(entry.path)
                .then(() => {
                    window.alertify.success(this.vocGlob.done);
                    this.update();
                });
            } else if (entry.type === 'sound') {
                const sound = createNewSound(entry.name);
                addSoundFile(sound, entry.path)
                .then(() => {
                    window.signals.trigger('soundCreated');
                    window.alertify.success(this.vocGlob.done);
                    this.update();
                });
            }
        };

        this.importAllPossible = async () => {
            this.massImportInProgress = true;
            let soundsPresent = false;
            let texturesPresent = false;
            const promises = this.currentSetEntries
                .filter(entry => !this.checkNameOccupied(entry.type, entry.name))
                .map(entry => {
                    if (entry.type === 'image') {
                        texturesPresent = true;
                        return importImageToTexture(entry.path, false, true);
                    }
                    if (entry.type === 'sound') {
                        soundsPresent = true;
                        const sound = createNewSound(entry.name);
                        return addSoundFile(sound, entry.path);
                    }
                    // Unknown asset type
                    return Promise.resolve();
                });
            await Promise.all(promises);
            if (texturesPresent) {
                window.signals.trigger('textureCreated');
            }
            if (soundsPresent) {
                window.signals.trigger('soundCreated');
            }
            this.massImportInProgress = false;
            window.alertify.success(this.vocGlob.done);
            this.update();
        };
