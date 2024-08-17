//
    Allows a user to import an arbitrary number of bundled assets into the current project

    @attribute type (string)
        The type of assets to show. Currently supports "textures" and "sounds"

    @attribute [sound] (ISound)
        The sound that will receive sound files as its variants.
        Required for the "sounds" type.

    @attribute [folder] (IAssetFolder | null)
        The target folder for new assets to be put to, or null for the project's root.
        Required for the "textures" asset type.

    @attribute [onclose] (riot function)
        A callback that is triggered when a user makes an action to close the gallery

builtin-asset-gallery.aPanel.aView.pad
    .flexfix.tall
        .flexfix-header
            .toright
                .aButtonGroup
                    button(
                        title="{voc.visitSource}"
                        onclick="{() => openLink(currentSet.meta.source)}"
                        if="{currentSet && currentSet.meta.source}"
                    )
                        svg.feather
                            use(xlink:href="#external-link")
                    button(
                        title="{voc.visitAuthorsItch}"
                        onclick="{() => openLink(currentSet.meta.itch)}"
                        if="{currentSet && currentSet.meta.itch}"
                    )
                        svg.icon
                            use(xlink:href="#itch-dot-io")
                    button(
                        title="{voc.visitAuthorsTwitter}"
                        onclick="{() => openLink(currentSet.meta.twitter)}"
                        if="{currentSet && currentSet.meta.twitter}"
                    )
                        svg.icon
                            use(xlink:href="#twitter")
                    button(
                        title="{voc.tipAuthor}"
                        onclick="{() => openLink(currentSet.meta.donate)}"
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
                button(onclick="{opts.onclose}" if="{opts.onclose}")
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
                .a.inline(onclick="{returnToGallery}") {vocGlob.assetTypes[opts.type.slice(0, -1)][1]}
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
                        image-loader(if="{set.hasSpash}" promise="{cache.getUrl(galleryBaseHref + '/' + parent.opts.type + '/' + set.name + '/Splash.png')}")
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
                        image-loader(if="{entry.type === 'image'}" promise="{cache.getUrl(entry.path)}")
                    .aCard-Properties
                        span {entry.name}
                    .aCard-Actions
                        button.forcebackground.tiny(if="{entry.type === 'sound'}" onpointerover="{playSound(entry.path)}" onpointerout="{stopSound}")
                            // Here .unclickable prevents pointerover events triggering while hovering the icon itself.
                            // This prevents the same sound playing twice at the same time when hovering the play button
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
        this.mixin(require('src/lib/riotMixins/voc').default);
        const fs = require('src/lib/neutralino-fs-extra'),
              path = require('path'),
              {BlobCache} = require('src/lib/blobCache');
        const {createAsset, isNameOccupied} = require('src/lib/resources');
        const {getAssetDirectory} = require('src/lib/platformUtils');

        this.cache = new BlobCache();
        this.cache.bind(this);

        const {os} = Neutralino;
        this.openLink = link => os.open(link);

        const root = path.join(getAssetDirectory(), this.opts.type);
        this.galleryBaseHref = getAssetDirectory();

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
        const {getCleanTextureName} = require('src/lib/resources/textures');
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
                return isNameOccupied('texture', name);
            }
            return false;
        };

        this.playSound = fsPath => async () => {
            this.cancelSound = false;
            const soundUrl = await this.cache.getUrl(fsPath);
            if (!this.cancelSound) {
                this.currentSound = soundUrl;
                this.update();
            }
        };
        this.stopSound = () => {
            this.cancelSound = true;
            this.currentSound = void 0;
        };

        const {addSoundFile} = require('src/lib/resources/sounds');
        this.importIntoProject = entry => async () => {
            if (this.checkNameOccupied(entry.type, entry.name)) {
                window.alertify.error(this.voc.cannotImportNameOccupied.replace('$1', entry.name));
            }
            if (entry.type === 'image') {
                await createAsset('texture', this.opts.folder || null, {
                    src: entry.path,
                    name: path.basename(entry.path, path.extname(entry.path))
                });
            } else if (entry.type === 'sound') {
                await addSoundFile(this.opts.sound, entry.path);
            } else {
                window.alertify.error(this.vocGlob.wrongFormat);
                return;
            }
            window.alertify.success(this.vocGlob.done);
            this.update();
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
                        return createAsset('texture', this.opts.folder || null, {
                            src: entry.path,
                            name: path.basename(entry.path, path.extname(entry.path))
                        });
                    }
                    if (entry.type === 'sound') {
                        soundsPresent = true;
                        return addSoundFile(this.opts.sound, entry.path);
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
