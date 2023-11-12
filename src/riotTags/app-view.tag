app-view.flexcol
    nav.nogrow.flexrow(if="{global.currentProject}" ref="mainNav")
        ul.aNav.tabs.nogrow
            li.limitwidth(onclick="{changeTab('menu')}" title="{voc.ctIDE}" class="{active: tab === 'menu'}" ref="mainMenuButton")
                svg.feather.nmr
                    use(xlink:href="#menu")
            li.limitwidth(onclick="{changeTab('patrons')}" title="{voc.patrons}" class="{active: tab === 'patrons'}")
                svg.feather
                    use(xlink:href="#heart")
            li.limitwidth(onclick="{saveProject}" title="{vocGlob.save} (Control+S)" data-hotkey="Control+s")
                svg.feather
                    use(xlink:href="#save")
            li.nbl.nogrow.noshrink(onclick="{runProject}" class="{active: tab === 'debug'}" title="{voc.launch} {voc.launchHotkeys}" data-hotkey="F5")
                svg.feather.rotateccw(show="{exportingProject}")
                    use(xlink:href="#refresh-ccw")
                svg.feather(hide="{exportingProject}")
                    use(xlink:href="#play")
                span(if="{tab !== 'debug'}") {voc.launch}
                span(if="{tab === 'debug'}") {voc.restart}
            li.nogrow.noshrink(onclick="{changeTab('project')}" class="{active: tab === 'project'}" data-hotkey="Control+1" title="Control+1" ref="projectTab")
                svg.feather
                    use(xlink:href="#sliders")
                span {voc.project}
            li.nogrow.noshrink(onclick="{changeTab('assets')}" class="{active: tab === 'assets'}" data-hotkey="Control+2" title="Control+2" ref="projectTab")
                svg.feather
                    use(xlink:href="#folder")
                span {voc.assets}
            .aTabsWrapper(
                onwheel="{scrollHorizontally}"
                class="{shadowleft: scrollableLeft, shadowright: scrollableRight}"
            )
                ul.aNav.flexrow.xscroll(ref="tabswrap")
                    li.nogrow(
                        each="{asset, ind in openedAssets}"
                        class="{active: asset === tab}"
                        onclick="{changeTab(asset)}"
                        onauxclick="{closeAsset}"
                        data-hotkey="{ind < 8 ? 'Control+' + (ind + 3) : ''}"
                        ref="openedTabs"
                    )
                        svg.feather
                            use(xlink:href="#{iconMap[asset.type]}")
                        span {getName(asset)}
                        .app-view-anUnsavedIcon(if="{tabsDirty[ind]}" onclick="{closeAsset}")
                            svg.feather.anActionableIcon.warning
                                use(xlink:href="#circle")
                            svg.feather.anActionableIcon
                                use(xlink:href="#x")
                        svg.feather.anActionableIcon(if="{!tabsDirty[ind]}" onclick="{closeAsset}")
                            use(xlink:href="#x")
            li.nogrow.noshrink.relative.bl(onclick="{callTour}" data-hotkey="F1" title="{voc.tour.header}")
                .aPulser(if="{!localStorage.wizardUsed}")
                svg.feather
                    use(xlink:href="#help-circle")
    div.flexitem.relative(if="{global.currentProject}")
        main-menu(show="{tab === 'menu'}" ref="mainMenu")
        debugger-screen-embedded(if="{tab === 'debug'}" params="{debugParams}" data-hotkey-scope="play" ref="debugger")
        project-settings(show="{tab === 'project'}" data-hotkey-scope="project" ref="projectsSettings")
        patrons-screen(if="{tab === 'patrons'}" ref="patrons" data-hotkey-scope="patrons")
        asset-browser.pad.aView#theAssetBrowser(
            show="{tab === 'assets'}"
            ref="assets"
            data-hotkey-scope="assets"
            namespace="projectBrowser"
            click="{rerouteOpenAsset2}"
        )
            yield(to="filterArea")
                // Riot sorcery: `this` points to the asset-browser, not app-view
                create-asset-menu(
                    inline="yup" square="ye"
                    collection="{currentCollection}"
                    folder="{currentFolder}"
                    onimported="{parent.rerouteOpenAsset}"
                )
        // Asset editors
        .aView(
            each="{asset in openedAssets}"
            data-is="{editorMap[asset.type]}"
            show="{asset === tab}"
            asset="{asset}"
            ondone="{closeAssetRequest}"
            ref="openedEditors"
        )
    exporter-error(if="{exporterError}" error="{exporterError}" onclose="{closeExportError}")
    new-project-onboarding(if="{sessionStorage.showOnboarding && localStorage.showOnboarding !== 'off'}")
    notepad-panel(ref="notepadPanel")
    tour-guide(tour="{appTour}" onfinish="{onAppTourFinish}" ref="tour" header="{voc.tour.header}")
    asset-confirm(
        discard="{assetDiscard}"
        cancel="{assetCancel}"
        apply="{assetApply}"
        asset="{confirmationAsset}"
        if="{showAssetConfirmation}"
    )
    dnd-processor(if="{global.currentProject}" currentfolder="{refs.assets.currentFolder}")
    script.
        const fs = require('fs-extra');

        this.namespace = 'appView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.tab = 'assets'; // A tab can be either a string ('project', 'assets', etc.) or an asset object
        this.openedAssets = [];
        this.tabsDirty = [];
        this.refreshDirty = () => {
            const tabs = this.refs.openedEditors || [];
            this.tabsDirty = (Array.isArray(tabs) ? tabs : [tabs])
                .map(riotTab => riotTab.isDirty());
        };
        this.changeTab = tab => () => {
            this.tab = tab;
            this.refreshDirty();
            window.hotkeys.cleanScope();
            window.signals.trigger('globalTabChanged', tab);
            if (typeof tab === 'string') {
                // The current tab is a predefined panel
                window.signals.trigger(`${tab}Focus`);
                window.hotkeys.push(tab);
            } else {
                // The current tab is an asset
                if (['room', 'template', 'behavior'].includes(tab.type)) {
                    window.orders.trigger('forceCodeEditorLayout');
                }
                window.hotkeys.push(tab.uid);
            }
        };
        window.signals.on('assetChanged', this.refreshDirty);
        this.on('unmount', () => {
            window.signals.off('assetChanged', this.refreshDirty);
        });

        const resources = require('./data/node_requires/resources');
        this.editorMap = resources.editorMap;
        this.getName = resources.getName;
        this.iconMap = resources.resourceToIconMap;
        this.openAsset = (asset, noOpen) => () => {
            // Check whether the asset is not yet opened
            if (!this.openedAssets.includes(asset)) {
                // Try putting the asset next to the already opened one
                const pos = this.openedAssets.indexOf(this.tab);
                if (pos !== -1) {
                    this.openedAssets.splice(pos + 1, 0, asset);
                } else {
                    this.openedAssets.push(asset);
                }
                const newPos = this.openedAssets.indexOf(asset);
                setTimeout(() => {
                    const tabs = Array.isArray(this.refs.openedTabs) ?
                        this.refs.openedTabs :
                        [this.refs.openedTabs];
                    tabs[newPos].scrollIntoView();
                }, 100);
            } else if (noOpen) {
                // eslint-disable-next-line no-console
                console.warn('[app-view] An already opened asset was called with noOpen. This is probably a bug as you either do open assets or create them elsewhere without opening.');
            }
            if (!noOpen) {
                this.changeTab(asset)();
            }
        };
        this.rerouteOpenAsset = asset => {
            this.openAsset(asset)();
            this.update();
        };
        this.rerouteOpenAsset2 = asset => () => {
            this.openAsset(asset)();
            this.update();
        };
        const assetOpenOrder = asset => {
            if (typeof asset === 'string') {
                asset = resources.getById(null, asset);
            }
            this.openAsset(asset)();
            this.update();
        };
        const assetsOpenOrder = assets => {
            if (typeof assets[0] === 'string') {
                assets = assets.map(asset => resources.getById(null, asset));
            }
            for (const asset of assets) {
                this.openAsset(asset)();
            }
            this.update();
        };
        window.orders.on('openAsset', assetOpenOrder);
        window.orders.on('openAssets', assetsOpenOrder);
        this.on('unmount', () => {
            window.orders.off('openAsset', assetOpenOrder);
        });
        this.on('unmount', () => {
            window.orders.off('openAssets', assetsOpenOrder);
        });
        this.closeAsset = e => {
            e.stopPropagation();
            e.preventDefault();
            const {asset, ind} = e.item;
            const editors = Array.isArray(this.refs.openedEditors) ?
                this.refs.openedEditors :
                [this.refs.openedEditors];
            const editor = editors[ind];
            if (editor.isDirty()) {
                this.showAssetConfirmation = true;
                this.confirmationAsset = asset;
            } else {
                // TODO: Check if the asset editor is in dirty state
                this.openedAssets.splice(ind, 1);
                if (this.tab === asset) {
                    this.changeTab('assets')();
                }
            }
        };
        this.closeAssetRequest = asset => {
            const ind = this.openedAssets.findIndex(a => a.uid === asset.uid);
            this.openedAssets.splice(ind, 1);
            if (typeof this.tab !== 'string' && this.tab.uid === asset.uid) {
                this.changeTab('assets')();
            }
            this.update();
        };
        this.assetDiscard = () => {
            const ind = this.openedAssets.findIndex(a => a.uid === this.confirmationAsset.uid);
            this.openedAssets.splice(ind, 1);
            this.showAssetConfirmation = false;
            if (typeof this.tab !== 'string' && this.tab.uid === this.confirmationAsset.uid) {
                this.changeTab('assets')();
            }
            this.confirmationAsset = void 0;
            this.update();
        };
        this.assetCancel = () => {
            this.showAssetConfirmation = false;
            this.confirmationAsset = void 0;
            this.update();
        };
        this.assetApply = async () => {
            const ind = this.openedAssets.findIndex(a => a.uid === this.confirmationAsset.uid);
            const editors = Array.isArray(this.refs.openedEditors) ?
                this.refs.openedEditors :
                [this.refs.openedEditors];
            const editor = editors[ind];
            const response = await editor.saveAsset();
            if (response === false) {
                return; // Editors can return `false` explicitly to tell that the editor
                        // cannot be closed right now.
            }
            this.openedAssets.splice(this.openedAssets.indexOf(this.confirmationAsset), 1);
            if (typeof this.tab !== 'string' && this.tab.uid === this.confirmationAsset.uid) {
                this.changeTab('assets')();
            }
            this.showAssetConfirmation = false;
            this.confirmationAsset = void 0;
            this.update();
        };

        this.saveProject = async () => {
            const {saveProject} = require('./data/node_requires/resources/projects');
            try {
                await saveProject();
                this.saveRecoveryDebounce();
                alertify.success(this.vocGlob.savedMessage, 'success', 3000);
            } catch (e) {
                alertify.error(e);
            }
        };
        this.saveRecovery = () => {
            if (global.currentProject) {
                const YAML = require('js-yaml');
                const recoveryYAML = YAML.dump(global.currentProject);
                fs.outputFile(global.projdir + '.ict.recovery', recoveryYAML);
            }
            this.saveRecoveryDebounce();
        };
        this.saveRecoveryDebounce = window.debounce(this.saveRecovery, 1000 * 60 * 5);
        window.signals.on('saveProject', this.saveProject);
        this.on('unmount', () => {
            window.signals.off('saveProject', this.saveProject);
        });
        this.saveRecoveryDebounce();

        const {getExportDir} = require('./data/node_requires/platformUtils');
        // Run a local server for ct.js games
        let fileServer;
        if (!this.debugServerStarted) {
            getExportDir().then(dir => {
                const fileServerSettings = {
                    public: dir,
                    cleanUrls: true
                };
                const handler = require('serve-handler');
                fileServer = require('http').createServer((request, response) =>
                    handler(request, response, fileServerSettings));
                fileServer.listen(0, () => {
                    // eslint-disable-next-line no-console
                    console.info(`[ct.debugger] Running dev server at http://localhost:${fileServer.address().port}`);
                });
                this.debugServerStarted = true;
            });
        }

        this.runProject = () => {
            if (this.exportingProject) {
                return;
            }
            document.body.style.cursor = 'progress';
            this.exportingProject = true;
            this.update();
            const runCtExport = require('./data/node_requires/exporter').exportCtProject;
            this.exporterError = void 0;
            runCtExport(global.currentProject, global.projdir)
            .then(() => {
                if (localStorage.disableBuiltInDebugger === 'yes') {
                    // Open in default browser
                    nw.Shell.openExternal(`http://localhost:${fileServer.address().port}/`);
                } else if (this.tab === 'debug') {
                    // Restart the game as we already have the tab opened
                    this.refs.debugger.restartGame();
                } else {
                    // Open the debugger as usual
                    this.tab = 'debug';
                    this.debugParams = {
                        title: global.currentProject.settings.authoring.title,
                        link: `http://localhost:${fileServer.address().port}/`
                    };
                }
            })
            .catch(e => {
                this.exporterError = e;
                console.error(e);
            })
            .finally(() => {
                document.body.style.cursor = '';
                this.exportingProject = false;
                this.update();
            });
        };
        this.runProjectAlt = () => {
            if (this.exportingProject) {
                return;
            }
            document.body.style.cursor = 'progress';
            this.exportingProject = true;
            this.exporterError = void 0;
            const runCtExport = require('./data/node_requires/exporter').exportCtProject;
            runCtExport(global.currentProject, global.projdir)
            .then(() => {
                nw.Shell.openExternal(`http://localhost:${fileServer.address().port}/`);
            })
            .catch(e => {
                this.exporterError = e;
                console.error(e);
            })
            .finally(() => {
                document.body.style.cursor = '';
                this.exportingProject = false;
                this.update();
            });
        };
        window.hotkeys.on('Alt+F5', this.runProjectAlt);
        this.on('unmount', () => {
            window.hotkeys.off('Alt+F5', this.runProjectAlt);
        });
        this.closeExportError = () => {
            this.exporterError = void 0;
            this.update();
        };

        // TODO: Remake the app tour
        // eslint-disable-next-line max-lines-per-function
        this.callTour = () => {
            this.appTour = [{
                message: this.voc.tour.aboutTour
            }, {
                message: this.voc.tour.helpPanel,
                highlight: this.refs.notepadPanel.refs.toggleButton
            }, {
                message: this.voc.tour.helpPanelTabs,
                highlight: this.refs.notepadPanel.refs.tabs,
                runBefore: () => new Promise(resolve => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                    setTimeout(() => {
                        resolve();
                    }, 350);
                }),
                undo: () => new Promise(resolve => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                    setTimeout(() => {
                        resolve();
                    }, 350);
                })
            }, {
                message: this.voc.tour.projectResources,
                highlight: this.refs.mainNav,
                runBefore: () => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                },
                undo: () => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                }
            }, {
                message: this.voc.tour.tabTextures,
                highlight: this.refs.textureTab,
                runBefore: () => {
                    this.changeTab('textures')();
                    this.update();
                }
            }, {
                message: this.voc.tour.tabTexturesImport,
                highlight: this.refs.textures.refs.textures.refs.importBlock
            }, {
                message: this.voc.tour.tabTexturesGallery,
                highlight: this.refs.textures.refs.textures.refs.galleryButton
            }, {
                message: this.voc.tour.tabTexturesClipboard,
                highlight: this.refs.textures.refs.textures.refs.clipboardPaste
            }, {
                message: this.voc.tour.tabTexturesPlaceholders,
                highlight: this.refs.textures.refs.textures.refs.placeholderGenButton
            }, {
                message: this.voc.tour.tabTemplates,
                highlight: this.refs.templatesTab,
                runBefore: () => {
                    this.changeTab('templates')();
                    this.update();
                },
                undo: () => {
                    this.changeTab('textures')();
                    this.update();
                }
            }, {
                message: this.voc.tour.tabRooms,
                highlight: this.refs.roomsTab,
                runBefore: () => {
                    this.changeTab('rooms')();
                    this.update();
                },
                undo: () => {
                    this.changeTab('templates')();
                    this.update();
                }
            }, {
                message: this.voc.tour.tabSounds,
                highlight: this.refs.soundsTab,
                runBefore: () => {
                    this.changeTab('sounds')();
                    this.update();
                },
                undo: () => {
                    this.changeTab('rooms')();
                    this.update();
                }
            }, {
                message: this.voc.tour.tabSoundsImport,
                highlight: this.refs.sounds.refs.sounds.refs.createButton
            }, {
                message: this.voc.tour.tabSoundsGallery,
                highlight: this.refs.sounds.refs.sounds.refs.galleryButton
            }, {
                message: this.voc.tour.tabSoundsRecord,
                highlight: this.refs.sounds.refs.sounds.refs.recordButton
            }, {
                message: this.voc.tour.tabInterlude,
                highlight: this.refs.mainNav
            }, {
                message: this.voc.tour.tabUI,
                highlight: this.refs.uiTab,
                runBefore: () => {
                    this.changeTab('ui')();
                    this.update();
                },
                undo: () => {
                    this.changeTab('sounds')();
                    this.update();
                }
            }, {
                message: this.voc.tour.tabFX,
                highlight: this.refs.fxTab,
                runBefore: () => {
                    this.changeTab('fx')();
                    this.update();
                },
                undo: () => {
                    this.changeTab('ui')();
                    this.update();
                }
            }, {
                message: this.voc.tour.tabProject,
                highlight: this.refs.projectTab,
                runBefore: () => {
                    this.changeTab('project')();
                    this.update();
                },
                undo: () => {
                    this.changeTab('fx')();
                    this.update();
                }
            }, {
                message: this.voc.tour.tabProjectModules,
                highlight: this.refs.projectsSettings.refs.modulesTab,
                runBefore: () => {
                    this.refs.projectsSettings.refs.modulesTab.click();
                }
            }, {
                message: this.voc.tour.tabProjectModuleDocs,
                highlight: this.refs.notepadPanel.refs.modulesTab,
                runBefore: () => new Promise(resolve => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                    setTimeout(() => {
                        resolve();
                    }, 350);
                }),
                undo: () => new Promise(resolve => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                    setTimeout(() => {
                        resolve();
                    }, 350);
                })
            }, {
                message: this.voc.tour.tabMainMenu,
                highlight: this.refs.mainMenuButton,
                runBefore: () => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                    this.changeTab('menu')();
                    this.update();
                },
                undo: () => {
                    this.refs.notepadPanel.refs.toggleButton.click();
                    this.changeTab('fx')();
                    this.update();
                    return new Promise(resolve => {
                        this.refs.notepadPanel.refs.toggleButton.click();
                        setTimeout(() => {
                            resolve();
                        }, 350);
                    });
                }
            }, {
                message: this.voc.tour.tabMainMenuSettings,
                highlight: this.refs.mainMenu.refs.settings.root
            }, {
                message: this.voc.tour.tabMainMenuMeta,
                highlight: this.refs.mainMenu.refs.meta.root
            }, {
                message: this.voc.tour.helpPanelReminder,
                highlight: this.refs.notepadPanel.refs.toggleButton,
                additionalActions: [{
                    label: this.voc.tour.buttonStartTutorial,
                    click: () => {
                        window.signals.trigger('openDocs', {
                            path: '/tut-making-shooter.html'
                        });
                        this.refs.tour.stop();
                    }
                }]
            }];
            this.update();
            this.refs.tour.start();
            localStorage.wizardUsed = true;
        };
        this.onAppTourFinish = () => {
            this.update();
        };

        this.scrollHorizontally = e => {
            const {tabswrap} = this.refs;
            // Have to cache scrollLeft as smooth scrolling creates a lag in read operations
            const newScrollLeft = tabswrap.scrollLeft + e.deltaY;
            tabswrap.scrollLeft = newScrollLeft;
            this.updateScrollShadows(newScrollLeft);
        };
        this.updateScrollShadows = val => {
            const {tabswrap} = this.refs;
            val = val ?? tabswrap.scrollLeft;
            this.scrollableLeft = val > 0;
            this.scrollableRight = val < tabswrap.scrollWidth - tabswrap.clientWidth;
        };

        this.toggleFullscreen = function toggleFullscreen() {
            nw.Window.get().toggleFullscreen();
        };
        window.hotkeys.on('F11', this.toggleFullscreen);
        this.on('unmount', () => {
            window.hotkeys.off('F11', this.toggleFullscreen);
        });
