//
    @attribute room
        The room to edit
    @attribute onclose (riot function)

room-editor.aPanel.aView
    canvas(ref="canvas" onwheel="{triggerWheelEvent}" oncontextmenu="{openMenus}")
    // Toolbar
    .room-editor-aToolsetHolder
        .room-editor-aToolbar.aButtonGroup.vertical
            button.forcebackground(
                onclick="{setTool('select')}"
                class="{active: currentTool === 'select'}"
                title="{voc.tools.select} (Q)"
                data-hotkey="q"
                data-hotkey-require-scope="rooms"
            )
                svg.feather
                    use(xlink:href="#cursor")
            button.forcebackground(
                onclick="{setTool('addCopies')}"
                class="{active: currentTool === 'addCopies'}"
                title="{voc.tools.addCopies} (W)"
                data-hotkey="w"
                data-hotkey-require-scope="rooms"
            )
                svg.feather
                    use(xlink:href="#template")
            button.forcebackground(
                onclick="{setTool('addTiles')}"
                class="{active: currentTool === 'addTiles'}"
                title="{voc.tools.addTiles} (E)"
                data-hotkey="e"
                data-hotkey-require-scope="rooms"
            )
                svg.feather
                    use(xlink:href="#grid")
            button.forcebackground(
                onclick="{setTool('manageBackgrounds')}"
                class="{active: currentTool === 'manageBackgrounds'}"
                title="{voc.tools.manageBackgrounds} (R)"
                data-hotkey="r"
                data-hotkey-require-scope="rooms"
            )
                svg.feather
                    use(xlink:href="#image")
            button.forcebackground(
                onclick="{setTool('roomProperties')}"
                class="{active: currentTool === 'roomProperties'}"
                title="{voc.tools.roomProperties} (T)"
                data-hotkey="t"
                data-hotkey-require-scope="rooms"
            )
                svg.feather
                    use(xlink:href="#settings")

        // Contextual panels for tools
        .room-editor-aContextPanel(
            if="{currentTool === 'select' && pixiEditor}"
        )
            h3.nogrow.nm.inlineblock {vocGlob.select}:
            .aSpacer.inlineblock
            .aButtonGroup.nm
                button.inline.square(
                    each="{lockable in lockableTypes}"
                    class="{active: parent.pixiEditor && parent.pixiEditor[lockable.key]}"
                    onclick="{toggleSelectables}"
                    title="{voc[lockable.hintVocKey]}"
                )
                    svg.feather
                        use(xlink:href="#{lockable.icon}")
            room-entities-properties(ref="propertiesPanel" pixieditor="{pixiEditor}" ontransformchange="{updateSelectFrame}")
        room-properties.room-editor-aContextPanel(
            if="{currentTool === 'roomProperties'}"
            room="{opts.room}"
            history="{pixiEditor?.history}"
            updatebg="{changeBgColor}"
            ref="propertiesPanel"
        )
        room-template-picker.room-editor-aContextPanel(
            if="{currentTool === 'addCopies'}"
            onselect="{changeSelectedTemplate}"
            selectedtemplate="{currentTemplate}"
        )
        room-tile-editor.room-editor-aContextPanel(
            if="{currentTool === 'addTiles'}"
            layer="{currentTileLayer}"
            layers="{pixiEditor.tileLayers}"
            onchangetile="{changeTilePatch}"
            onchangelayer="{changeTileLayer}"
            pixieditor="{pixiEditor}"
            removelayer="{pixiEditor?.removeLayer?.bind(pixiEditor)}"
            addlayer="{pixiEditor?.addTileLayer?.bind(pixiEditor)}"
            ref="tileEditor"
        )
        room-backgrounds-editor.room-editor-aContextPanel(
            if="{currentTool === 'manageBackgrounds'}"
            backgrounds="{pixiEditor?.backgrounds}"
            addbackground="{pixiEditor?.addBackground?.bind(pixiEditor)}"
            room="{opts.room}"
            history="{pixiEditor?.history}"
            ref="backgroundsEditor"
        )

        // Global controls placed at the top-center
        .room-editor-aTopPanel
            button.slim(onclick="{pixiEditor?.history.undo.bind(pixiEditor.history)}" title="{vocGlob.undo} (Ctrl+Z)" class="{dim: !pixiEditor?.history.canUndo}")
                svg.feather
                    use(xlink:href="#undo")
            button.slim(onclick="{pixiEditor?.history.redo.bind(pixiEditor.history)}" title="{vocGlob.redo} (Ctrl+Shift+Z)" class="{dim: !pixiEditor?.history.canRedo}")
                svg.feather
                    use(xlink:href="#redo")
            label.checkbox(title="Shift+S")
                input(
                    type="checkbox"
                    onchange="{changeSimulated}"
                    checked="{pixiEditor?.simulate}"
                    data-hotkey="S"
                    data-hotkey-require-scope="rooms"
                )
                span {voc.simulate}
            button(onclick="{openZoomMenu}")
                span(ref="zoomLabel") {Math.round(pixiEditor?.getZoom() || 100)}%
            button(onclick="{openGridMenu}")
                span {voc.grid}
            button.slim(onclick="{openVisibilityMenu}")
                svg.feather
                    use(xlink:href="#eye")
            button(onclick="{openEventsList}")
                span {voc.events}
            button(onclick="{saveRoom}")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.save}

    room-events-editor(if="{editingEvents}" room="{opts.room}" onsave="{closeRoomEvents}")
    context-menu(menu="{gridMenu}" ref="gridMenu")
    context-menu(menu="{zoomMenu}" ref="zoomMenu")
    context-menu(menu="{visibilityMenu}" ref="visibilityMenu" if="{pixiEditor}")
    context-menu(menu="{entitiesMenu}" ref="entitiesMenu" if="{pixiEditor}")
    script.
        this.namespace = 'roomView';
        this.mixin(window.riotVoc);

        this.freePlacementMode = false;
        const modifiersDownListener = e => {
            if (e.repeat ||
                !window.hotkeys.inScope('rooms') ||
                window.hotkeys.isFormField(e.target)
            ) {
                return;
            }
            if (e.key === 'Alt') {
                this.freePlacementMode = true;
                e.preventDefault();
            } else if (e.key === 'Control' || e.key === 'Meta') {
                this.controlMode = true;
                e.preventDefault();
            }
        };
        const modifiersUpListener = e => {
            if (e.repeat ||
                !window.hotkeys.inScope('rooms') ||
                window.hotkeys.isFormField(e.target)
            ) {
                return;
            }
            if (e.key === 'Alt') {
                this.freePlacementMode = false;
                e.preventDefault();
            } else if (e.key === 'Control' || e.key.Meta) {
                this.controlMode = false;
                e.preventDefault();
            }
        };
        const blurListener = () => {
            // Specifically designed to catch Alt+Tab
            this.freePlacementMode = false;
        };
        const gridToggleListener = e => {
            if (!window.hotkeys.inScope('rooms') || window.hotkeys.isFormField(e.target)) {
                return;
            }
            this.gridOn = !this.gridOn;
        };
        this.on('mount', () => {
            window.hotkeys.push('roomEditor');
            window.hotkeys.on('Control+g', gridToggleListener);
            document.addEventListener('keydown', modifiersDownListener);
            document.addEventListener('keyup', modifiersUpListener);
            window.addEventListener('blur', blurListener);
        });
        this.on('unmount', () => {
            window.hotkeys.exit('roomEditor');
            window.hotkeys.off('Control+g', gridToggleListener);
            document.removeEventListener('keydown', modifiersDownListener);
            document.removeEventListener('keyup', modifiersUpListener);
            window.addEventListener('blur', blurListener);
        });

        this.lockableTypes = [{
            icon: 'template',
            hintVocKey: 'copies',
            key: 'selectCopies'
        }, {
            icon: 'grid',
            hintVocKey: 'tiles',
            key: 'selectTiles'
        }];
        this.toggleSelectables = e => {
            this.pixiEditor[e.item.lockable.key] = !this.pixiEditor[e.item.lockable.key];
        };
        this.updateSelectFrame = () => {
            this.pixiEditor.transformer.setup();
        };

        const {setup} = require('./data/node_requires/roomEditor');
        this.on('mount', () => {
            setup(this.refs.canvas, this);
            // adds this.pixiEditor
            [this.currentTileLayer] = this.pixiEditor.tileLayers;
            this.update();
        });
        this.on('unmount', () => {
            this.pixiEditor.destroy(false, {
                children: true
            });
        });
        this.triggerWheelEvent = e => {
            e.preventUpdate = true;
            // pixi v5 doesn't have a wheel event! we will have to fabricate one.
            // eslint-disable-next-line no-underscore-dangle
            this.pixiEditor.stage._events.wheel.fn({
                type: 'wheel',
                target: this.pixiEditor.stage,
                currentTarget: this.pixiEditor.stage,
                // eslint-disable-next-line id-blacklist
                data: {
                    global: {
                        x: e.offsetX,
                        y: e.offsetY
                    },
                    originalEvent: e
                }
            });
        };
        // Keyboard events
        const phabricateEvent = (name, e) => {
            // eslint-disable-next-line no-underscore-dangle
            if (!(name in this.pixiEditor.stage._events)) {
                console.error(`An event ${name} was triggered on the room editor, but it is not allowed.`);
                return;
            }
            // eslint-disable-next-line no-underscore-dangle
            this.pixiEditor.stage._events[name].fn({
                type: name,
                target: this.pixiEditor.stage,
                currentTarget: this.pixiEditor.stage,
                // eslint-disable-next-line id-blacklist
                data: {
                    originalEvent: e
                }
            });
        };
        /**
         * Routes DOM keyboard events into the RoomEditor to trigger hotkey events there.
         */
        // eslint-disable-next-line complexity
        const triggerKeyboardEvent = e => {
            if (!window.hotkeys.inScope('rooms')) {
                return false;
            }
            if (['input', 'textarea', 'select'].includes(e.target.nodeName.toLowerCase())) {
                return false;
            }
            const ctrlKey = navigator.platform.indexOf('Mac') > -1 ?
                e.metaKey :
                e.ctrlKey;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                return phabricateEvent('delete', e);
            } else if (e.code === 'KeyC' && ctrlKey) {
                return phabricateEvent('copy', e);
            } else if (e.code === 'KeyV' && ctrlKey) {
                return phabricateEvent('paste', e);
            } else if (e.code === 'KeyZ' && ctrlKey && e.shiftKey) {
                return phabricateEvent('redo', e);
            } else if (e.code === 'KeyZ' && ctrlKey) {
                return phabricateEvent('undo', e);
            } else if (e.code === 'KeyH') {
                return phabricateEvent('home', e);
            } else if (e.key === 'ArrowRight') {
                return phabricateEvent('nudgeright', e);
            } else if (e.key === 'ArrowLeft') {
                return phabricateEvent('nudgeleft', e);
            } else if (e.key === 'ArrowUp') {
                return phabricateEvent('nudgeup', e);
            } else if (e.key === 'ArrowDown') {
                return phabricateEvent('nudgedown', e);
            } else if (e.key === 'Tab') {
                phabricateEvent('tab', e);
                return e.preventDefault();
            }
            return false;
        };
        this.on('mount', () => {
            window.addEventListener('keydown', triggerKeyboardEvent);
        });
        this.on('unmount', () => {
            window.removeEventListener('keydown', triggerKeyboardEvent);
        });

        this.currentTool = 'select';
        /**
         * Describes which tools must have specific entity types visible.
         * When a tool is selected and the entity type is hidden, its visibility
         * is automatically turned on.
         * The dictionary maps tools' names to boolean flags in the RoomEditor class.
         */
        const mandatoryVisibilityMap = {
            addCopies: 'copiesVisible',
            addTiles: 'tilesVisible',
            manageBackgrounds: 'backgroundsVisible'
        };
        this.setTool = tool => () => {
            this.currentTool = tool;
            if (tool in mandatoryVisibilityMap) {
                this.pixiEditor[mandatoryVisibilityMap[tool]] = true;
            }
            if (tool !== 'select') {
                this.pixiEditor.transformer.clear();
            }
            if (tool === 'addTiles' && !this.pixiEditor.tileLayers.includes(this.currentTileLayer)) {
                [this.currentTileLayer] = this.pixiEditor.tileLayers;
            }
        };

        /* These are used to describe current template selection when the addCopy tool is on */
        this.currentTemplate = -1;
        this.changeSelectedTemplate = template => {
            this.currentTemplate = template;
            this.update();
        };

        this.tilePatch = void 0;
        this.changeTilePatch = tilePatch => {
            this.tilePatch = tilePatch;
        };
        this.changeTileLayer = layer => {
            this.currentTileLayer = layer;
        };

        this.zoom = 1;

        this.changeBgColor = (e, color) => {
            this.opts.room.backgroundColor = color;
            this.pixiEditor.renderer.backgroundColor = PIXI.utils.string2hex(color);
        };

        this.changeSimulated = () => {
            this.pixiEditor.simulate = !this.pixiEditor.simulate;
        };

        this.gridOn = true;
        this.gridMenu = {
            opened: false,
            items: [{
                label: this.voc.gridOff,
                click: () => {
                    this.gridOn = !this.gridOn;
                },
                type: 'checkbox',
                checked: () => !this.gridOn,
                hotkeyLabel: 'Ctrl+G'
            }, {
                label: this.voc.toggleDiagonalGrid,
                click: () => {
                    this.opts.room.diagonalGrid = !this.opts.room.diagonalGrid;
                },
                type: 'checkbox',
                checked: () => this.opts.room.diagonalGrid
            }, {
                label: this.voc.changeGridSize,
                click: () => {
                    window.alertify
                    .confirm(this.voc.gridSize + `<br/><input type="number" value="${this.opts.room.gridX}" style="width: 6rem;" min=2 id="theGridSizeX"> x <input type="number" value="${this.opts.room.gridY}" style="width: 6rem;" min=2 id="theGridSizeY">`)
                    .then(e => {
                        if (e.buttonClicked === 'ok') {
                            this.opts.room.gridX = Number(document.getElementById('theGridSizeX').value);
                            this.opts.room.gridY = Number(document.getElementById('theGridSizeY').value);
                        }
                        this.update();
                    });
                }
            }]
        };
        this.openGridMenu = e => {
            this.refs.gridMenu.popup(e.clientX, e.clientY);
        };

        this.zoomMenu = {
            opened: false,
            items: [...[12.5, 25, 50, 100, 200, 400, 800].map(zoom => ({
                label: `${zoom}%`,
                click: () => {
                    this.zoom = 1 / zoom * 100;
                    this.pixiEditor.zoomTo(zoom);
                }
            })), {
                type: 'separator'
            }, {
                label: this.voc.resetView,
                click: () => {
                    this.pixiEditor.goHome();
                },
                hotkeyLabel: 'H'
            }]
        };
        this.openZoomMenu = e => {
            this.refs.zoomMenu.popup(e.clientX, e.clientY);
        };

        const entityToIconMap = {
            copies: 'template',
            tiles: 'grid',
            backgrounds: 'image'
        };
        const entityVisibilityItems = [];
        for (const entityType in entityToIconMap) {
            entityVisibilityItems.push({
                label: this.voc[entityType],
                click: () => {
                    this.pixiEditor[entityType + 'Visible'] = !this.pixiEditor[entityType + 'Visible'];
                },
                type: 'checkbox',
                checked: () => this.pixiEditor[entityType + 'Visible']
            });
        }
        this.visibilityMenu = {
            opened: false,
            items: [
                ...entityVisibilityItems,
                {
                    type: 'separator'
                },
                {
                    label: this.voc.xrayMode,
                    click: () => {
                        this.pixiEditor.xrayMode = !this.pixiEditor.xrayMode;
                    },
                    type: 'checkbox',
                    checked: () => this.pixiEditor.xrayMode
                },
                {
                    label: this.voc.colorizeTileLayers,
                    click: () => {
                        this.pixiEditor.colorizeTileLayers = !this.pixiEditor.colorizeTileLayers;
                    },
                    type: 'checkbox',
                    checked: () => this.pixiEditor.colorizeTileLayers
                }
            ]
        };
        this.openVisibilityMenu = e => {
            this.refs.visibilityMenu.popup(e.clientX, e.clientY);
        };

        this.entitiesMenu = {
            opened: false,
            items: [{
                label: this.vocGlob.copy,
                click: () => {
                    this.pixiEditor.copySelection();
                },
                icon: 'copy',
                hotkeyLabel: 'Ctrl+C',
                if: () => this.pixiEditor.currentSelection.size
            }, {
                label: this.vocGlob.paste,
                click: () => {
                    this.pixiEditor.pasteSelection();
                },
                icon: 'clipboard',
                hotkeyLabel: 'Ctrl+V',
                if: () => this.pixiEditor.clipboard.size
            }, {
                type: 'separator',
                if: () => this.pixiEditor.currentSelection.size
            }, {
                label: this.vocGlob.delete,
                click: () => {
                    this.pixiEditor.deleteSelected();
                },
                icon: 'trash',
                hotkeyLabel: 'Delete',
                if: () => this.pixiEditor.currentSelection.size
            }]
        };
        this.openMenus = e => {
            e.preventDefault();
            if (this.currentTool === 'select' || this.pixiEditor.clipboard.size) {
                this.refs.entitiesMenu.popup(e.clientX, e.clientY);
            }
        };

        this.editingEvents = false;
        this.openEventsList = () => {
            this.editingEvents = true;
        };
        this.closeRoomEvents = () => {
            this.editingEvents = false;
            this.update();
        };

        this.saveRoom = async () => {
            if (this.pixiEditor.currentSelection.size && this.refs.propertiesPanel) {
                this.refs.propertiesPanel.applyChanges();
            }
            const {writeRoomPreview} = require('./data/node_requires/resources/rooms');
            this.pixiEditor.serialize();
            await Promise.all([
                writeRoomPreview(this.opts.room, this.pixiEditor.getSplashScreen(true), true),
                writeRoomPreview(this.opts.room, this.pixiEditor.getSplashScreen(false), false)
            ]);
            this.opts.onclose();
        };

        const resizeEditor = () => {
            setTimeout(() => {
                this.pixiEditor.resize();
            }, 10);
        };
        const serialize = () => {
            this.pixiEditor.serialize();
        };
        this.on('mount', () => {
            window.signals.on('exportProject', serialize);
            window.signals.on('roomsFocus', resizeEditor);
        });
        this.on('unmount', () => {
            window.signals.off('exportProject', serialize);
            window.signals.off('roomsFocus', resizeEditor);
        });
