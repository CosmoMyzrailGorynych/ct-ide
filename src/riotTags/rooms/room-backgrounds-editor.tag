room-backgrounds-editor.room-editor-Backgrounds.tabbed.tall
    ul
        li.bg(each="{background, ind in opts.room.backgrounds}" oncontextmenu="{onContextMenu}")
            img(src="{getTexturePreview(background.texture)}" onclick="{onChangeBgTexture}")
            span
                span(class="{active: detailedBackground === background}" onclick="{editBackground}")
                    svg.feather
                        use(xlink:href="data/icons.svg#settings")
                | {getTextureFromId(background.texture).name} ({background.depth})
            .clear
            .anErrorNotice(if="{background.texture && background.texture !== -1 && !getTextureFromId(background.texture).tiled && !getTextureFromId(background.texture).ignoreTiledUse}")
                | {voc.notBackgroundTextureWarning}
                |
                span.a(onclick="{fixTexture(background)}") {voc.fixBackground}
                |
                |
                span.a(onclick="{dismissWarning(background)}") {voc.dismissWarning}
            div(if="{detailedBackground === background}")
                .clear
                label
                    b {voc.depth}
                    input.wide(type="number" value="{background.depth || 0}" step="0" oninput="{onChangeBgDepth}")

                b {voc.shift}
                .clear
                label.fifty.npl.npt
                    input.wide(type="number" value="{background.extends.shiftX || 0}" step="8" oninput="{wire('this.detailedBackground.extends.shiftX')}")
                label.fifty.npr.npt
                    input.wide(type="number" value="{background.extends.shiftY || 0}" step="8" oninput="{wire('this.detailedBackground.extends.shiftY')}")

                b {voc.scale}
                .clear
                label.fifty.npl.npt
                    input.wide(type="number" value="{background.extends.scaleX || 1}" step="0.01" oninput="{wire('this.detailedBackground.extends.scaleX')}")
                label.fifty.npr.npt
                    input.wide(type="number" value="{background.extends.scaleY || 1}" step="0.01" oninput="{wire('this.detailedBackground.extends.scaleY')}")

                b {voc.movement}
                .clear
                label.fifty.npl.npt
                    input.wide(type="number" value="{background.extends.movementX || 0}" step="0.1" oninput="{wire('this.detailedBackground.extends.movementX')}")
                label.fifty.npr.npt
                    input.wide(type="number" value="{background.extends.movementY || 0}" step="0.1" oninput="{wire('this.detailedBackground.extends.movementY')}")

                b {voc.parallax}
                .clear
                label.fifty.npl.npt
                    input.wide(type="number" value="{background.extends.parallaxX || 1}" step="0.01" oninput="{wire('this.detailedBackground.extends.parallaxX')}")
                label.fifty.npr.npt
                    input.wide(type="number" value="{background.extends.parallaxY || 1}" step="0.01" oninput="{wire('this.detailedBackground.extends.parallaxY')}")
                .clear

                b {voc.repeat}
                select(onchange="{wire('this.detailedBackground.extends.repeat')}")
                    option(value="repeat" selected="{detailedBackground.extends.repeat === 'repeat'}") repeat
                    option(value="repeat-x" selected="{detailedBackground.extends.repeat === 'repeat-x'}") repeat-x
                    option(value="repeat-y" selected="{detailedBackground.extends.repeat === 'repeat-y'}") repeat-y
                    option(value="no-repeat" selected="{detailedBackground.extends.repeat === 'no-repeat'}") no-repeat

    button.inline.wide(onclick="{addBg}")
        svg.feather
            use(xlink:href="data/icons.svg#plus")
        span {voc.add}
    texture-selector(ref="texturePicker" if="{pickingBackground}" oncancelled="{onTextureCancel}" onselected="{onTextureSelected}")
    context-menu(menu="{roomBgMenu}" ref="roomBgMenu")
    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;

        const {getTextureFromId, getTexturePreview} = require('./data/node_requires/resources/textures');
        this.getTextureFromId = getTextureFromId;
        this.getTexturePreview = getTexturePreview;

        this.pickingBackground = false;
        this.namespace = 'roombackgrounds';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.on('update', () => {
            if (this.parent.tab === 'roombackgrounds') {
                this.parent.refreshRoomCanvas();
            }
        });
        this.onTextureSelected = texture => () => {
            this.editingBackground.texture = texture.uid;
            this.pickingBackground = false;
            this.creatingBackground = false;
            this.update();
        };
        this.onTextureCancel = () => {
            this.pickingBackground = false;
            if (this.creatingBackground) {
                const bgs = this.opts.room.backgrounds;
                bgs.splice(bgs.indexOf(this.editingBackground), 1);
                this.parent.resortRoom();
                this.creatingBackground = false;
            }
            this.update();
        };
        this.addBg = () => {
            var newBg = {
                depth: 0,
                texture: -1,
                extends: {}
            };
            this.opts.room.backgrounds.push(newBg);
            this.editingBackground = newBg;
            this.pickingBackground = true;
            this.creatingBackground = true;
            this.opts.room.backgrounds.sort((a, b) => a.depth - b.depth);
            this.parent.resortRoom();
            this.update();
        };
        this.onContextMenu = e => {
            this.editedBg = Number(e.item.ind);
            this.refs.roomBgMenu.popup(e.clientX, e.clientY);
            e.preventDefault();
        };
        this.roomBgMenu = {
            opened: false,
            items: [{
                label: window.languageJSON.common.delete,
                click: () => {
                    this.opts.room.backgrounds.splice(this.editedBg, 1);
                    this.parent.resortRoom();
                    this.update();
                }
            }]
        };
        this.onChangeBgTexture = e => {
            this.pickingBackground = true;
            this.editingBackground = e.item.background;
            this.update();
        };
        this.onChangeBgDepth = e => {
            e.item.background.depth = Number(e.target.value);
            this.opts.room.backgrounds.sort((a, b) => a.depth - b.depth);
            this.parent.resortRoom();
        };

        this.editBackground = e => {
            if (this.detailedBackground === e.item.background) {
                this.detailedBackground = void 0;
            } else {
                this.detailedBackground = e.item.background;
                if (!('extends' in this.detailedBackground)) {
                    this.detailedBackground.extends = {};
                }
            }
        };

        this.fixTexture = background => () => {
            const tex = getTextureFromId(background.texture);
            tex.tiled = true;
        };
        this.dismissWarning = background => () => {
            const tex = getTextureFromId(background.texture);
            tex.ignoreTiledUse = true;
        };