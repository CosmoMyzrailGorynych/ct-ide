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
            li.nbl(onclick="{runProject}" class="{active: tab === 'debug'}" title="{voc.launch} {voc.launchHotkeys}" data-hotkey="F5")
                svg.feather.rotateccw(show="{exportingProject}")
                    use(xlink:href="#refresh-ccw")
                svg.feather(hide="{exportingProject}")
                    use(xlink:href="#play")
                span(if="{tab !== 'debug'}") {voc.launch}
                span(if="{tab === 'debug'}") {voc.restart}
            li(onclick="{changeTab('project')}" class="{active: tab === 'project'}" data-hotkey="Control+1" title="Control+1" ref="projectTab")
                svg.feather
                    use(xlink:href="#sliders")
                span {voc.project}
            li(onclick="{changeTab('textures')}" class="{active: tab === 'textures'}" data-hotkey="Control+2" title="Control+2" ref="textureTab")
                svg.feather
                    use(xlink:href="#texture")
                span {voc.texture}
            li(onclick="{changeTab('ui')}" class="{active: tab === 'ui'}" data-hotkey="Control+3" title="Control+3" ref="uiTab")
                svg.feather
                    use(xlink:href="#ui")
                span {voc.ui}
            li(onclick="{changeTab('fx')}" class="{active: tab === 'fx'}" data-hotkey="Control+4" title="Control+4" ref="fxTab")
                svg.feather
                    use(xlink:href="#sparkles")
                span {voc.fx}
            li(onclick="{changeTab('sounds')}" class="{active: tab === 'sounds'}" data-hotkey="Control+5" title="Control+5" ref="soundsTab")
                svg.feather
                    use(xlink:href="#headphones")
                span {voc.sounds}
            li(onclick="{changeTab('templates')}" class="{active: tab === 'templates'}" data-hotkey="Control+6" title="Control+6" ref="templatesTab")
                svg.feather
                    use(xlink:href="#template")
                span {voc.templates}
            li(onclick="{changeTab('rooms')}" class="{active: tab === 'rooms'}" data-hotkey="Control+7" title="Control+7" ref="roomsTab")
                svg.feather
                    use(xlink:href="#room")
                span {voc.rooms}
            li(onclick="{callTour}" data-hotkey="F1" title="{voc.tour.header}").relative.nogrow
                .aPulser(if="{!localStorage.wizardUsed}")
                svg.feather
                    use(xlink:href="#help-circle")
    div.flexitem.relative(if="{global.currentProject}")
        main-menu(show="{tab === 'menu'}" ref="mainMenu")
        debugger-screen-embedded(if="{tab === 'debug'}" params="{debugParams}" data-hotkey-scope="play" ref="debugger")
        project-settings(show="{tab === 'project'}" data-hotkey-scope="project" ref="projectsSettings")
        textures-panel(show="{tab === 'textures'}" ref="textures" data-hotkey-scope="textures")
        ui-panel(show="{tab === 'ui'}" ref="ui" data-hotkey-scope="ui")
        fx-panel(show="{tab === 'fx'}" ref="fx" data-hotkey-scope="fx")
        sounds-panel(show="{tab === 'sounds'}" ref="sounds" data-hotkey-scope="sounds")
        templates-panel(show="{tab === 'templates'}" ref="templates" data-hotkey-scope="templates")
        rooms-panel(show="{tab === 'rooms'}" ref="rooms" data-hotkey-scope="rooms")
        patrons-screen(if="{tab === 'patrons'}" ref="patrons" data-hotkey-scope="patrons")
    exporter-error(if="{exporterError}" error="{exporterError}" onclose="{closeExportError}")
    new-project-onboarding(if="{sessionStorage.showOnboarding && localStorage.showOnboarding !== 'off'}")
    notepad-panel(ref="notepadPanel")
    tour-guide(tour="{appTour}" onfinish="{onAppTourFinish}" ref="tour" header="{voc.tour.header}")
    script.
        const fs = require('fs-extra');

        this.namespace = 'appView';
        this.mixin(window.riotVoc);

        this.tab = 'project';
        this.changeTab = tab => () => {
            this.tab = tab;
            window.hotkeys.cleanScope();
            window.hotkeys.push(tab);
            window.signals.trigger('globalTabChanged', tab);
            window.signals.trigger(`${tab}Focus`);
            if (tab === 'rooms' || tab === 'templates') {
                window.orders.trigger('forceCodeEditorLayout');
            }
        };
        this.changeTab(this.tab)();

        const assetListener = asset => {
            const [assetType, uid] = asset.split('/');
            if (['emitters', 'emitterTandems', 'tandems'].includes(assetType)) {
                this.changeTab('fx')();
            } else if (['fonts', 'styles'].includes(assetType)) {
                this.changeTab('ui')();
            } else if (assetType === 'skeletons') {
                this.changeTab('textures')();
            } else {
                this.changeTab(assetType)();
            }
            this.update();
            if (this.refs[this.tab].openAsset) {
                this.refs[this.tab].openAsset(assetType, uid);
            }
        };
        window.orders.on('openAsset', assetListener);
        this.on('unmount', () => {
            window.orders.off('openAsset', assetListener);
        });

        this.saveProject = async () => {
            const {saveProject} = require('./data/node_requires/resources/projects');
            try {
                await saveProject();
                this.saveRecoveryDebounce();
                alertify.success(window.languageJSON.common.savedMessage, 'success', 3000);
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

        this.toggleFullscreen = function toggleFullscreen() {
            nw.Window.get().toggleFullscreen();
        };
        window.hotkeys.on('F11', this.toggleFullscreen);
        this.on('unmount', () => {
            window.hotkeys.off('F11', this.toggleFullscreen);
        });
