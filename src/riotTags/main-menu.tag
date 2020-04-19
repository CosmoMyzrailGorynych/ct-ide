main-menu.flexcol
    nav.nogrow.flexrow(if="{global.currentProject}")
        ul#fullscreen.nav
            li.nbr(onclick="{toggleFullscreen}" title="{voc.min} (F11)")
                svg.feather
                    use(xlink:href="data/icons.svg#{fullscreen? 'minimize-2' : 'maximize-2'}" data-hotkey="F11")

        ul#app.nav.tabs
            li.it30#ctlogo(onclick="{ctClick}" title="{voc.ctIDE}")
                svg.feather.nmr
                    use(xlink:href="data/icons.svg#menu")
                context-menu#theCatMenu(menu="{catMenu}" ref="catMenu")
            li.it30(onclick="{changeTab('patrons')}" title="{voc.patrons}" class="{active: tab === 'patrons'}")
                svg.feather
                    use(xlink:href="data/icons.svg#heart")
            li.it30(onclick="{saveProject}" title="{voc.save} (Control+S)" data-hotkey="Control+s")
                svg.feather
                    use(xlink:href="data/icons.svg#save")
            li.nbr.it30(onclick="{runProject}" title="{voc.launch} {voc.launchHotkeys}" data-hotkey="F5")
                svg.feather
                    use(xlink:href="data/icons.svg#play")

        ul#mainnav.nav.tabs
            li(onclick="{changeTab('settings')}" class="{active: tab === 'settings'}" data-hotkey="Control+1" title="Control+1")
                svg.feather
                    use(xlink:href="data/icons.svg#settings")
                span {voc.settings}
            li(onclick="{changeTab('modules')}" class="{active: tab === 'modules'}" data-hotkey="Control+2" title="Control+2")
                svg.feather
                    use(xlink:href="data/icons.svg#ctmod")
                span {voc.modules}
            li(onclick="{changeTab('texture')}" class="{active: tab === 'texture'}" data-hotkey="Control+3" title="Control+3")
                svg.feather
                    use(xlink:href="data/icons.svg#coin")
                span {voc.texture}
            li(onclick="{changeTab('ui')}" class="{active: tab === 'ui'}" data-hotkey="Control+4" title="Control+4")
                svg.feather
                    use(xlink:href="data/icons.svg#droplet")
                span {voc.ui}
            li(onclick="{changeTab('fx')}" class="{active: tab === 'fx'}" data-hotkey="Control+5" title="Control+5")
                svg.feather
                    use(xlink:href="data/icons.svg#sparkles")
                span {voc.fx}
            li(onclick="{changeTab('sounds')}" class="{active: tab === 'sounds'}" data-hotkey="Control+6" title="Control+6")
                svg.feather
                    use(xlink:href="data/icons.svg#headphones")
                span {voc.sounds}
            li(onclick="{changeTab('types')}" class="{active: tab === 'types'}" data-hotkey="Control+7" title="Control+7")
                svg.feather
                    use(xlink:href="data/icons.svg#user")
                span {voc.types}
            li(onclick="{changeTab('rooms')}" class="{active: tab === 'rooms'}" data-hotkey="Control+8" title="Control+8")
                svg.feather
                    use(xlink:href="data/icons.svg#room")
                span {voc.rooms}
    div.flexitem.relative(if="{global.currentProject}")
        settings-panel(show="{tab === 'settings'}" data-hotkey-scope="settings")
        modules-panel(show="{tab === 'modules'}" data-hotkey-scope="modules")
        textures-panel(show="{tab === 'texture'}" data-hotkey-scope="texture")
        ui-panel(show="{tab === 'ui'}" data-hotkey-scope="ui")
        fx-panel(show="{tab === 'fx'}" data-hotkey-scope="fx")
        sounds-panel(show="{tab === 'sounds'}" data-hotkey-scope="sounds")
        types-panel(show="{tab === 'types'}" data-hotkey-scope="types")
        rooms-panel(show="{tab === 'rooms'}" data-hotkey-scope="rooms")
        license-panel(if="{showLicense}")
        patreon-screen(if="{tab === 'patrons'}" data-hotkey-scope="patrons")
        export-panel(show="{showExporter}")
    new-project-onboarding(if="{sessionStorage.showOnboarding && localStorage.showOnboarding !== 'off'}")
    script.
        const fs = require('fs-extra'),
              path = require('path');
        const archiver = require('archiver');
        const glob = require('./data/node_requires/glob');

        // Mounts the hotkey plugins, enabling hotkeys on elements with data-hotkey attributes
        const hotkey = require('./data/node_requires/hotkeys')(document);
        this.on('unmount', () => {
            hotkey.unmount();
        });

        this.namespace = 'menu';
        this.mixin(window.riotVoc);

        this.tab = 'settings';
        this.changeTab = tab => e => {
            this.tab = tab;
            hotkey.cleanScope();
            hotkey.push(tab);
            window.signals.trigger('globalTabChanged');
            window.signals.trigger(`${tab}Focus`);
        };

        this.fullscreen = false;
        this.toggleFullscreen = function() {
            this.fullscreen = !this.fullscreen;
            if (this.fullscreen) {
                nw.Window.get().enterFullscreen();
            } else {
                nw.Window.get().leaveFullscreen();
            }
        };

        const languageSubmenu = {
            items: []
        };
        const recentProjectsSubmenu = {
            items: []
        };
        this.refreshLatestProject = function() {
            recentProjectsSubmenu.items.length = 0;
            var lastProjects;
            if (('lastProjects' in localStorage) &&
                (localStorage.lastProjects !== '')) {
                lastProjects = localStorage.lastProjects.split(';');
            } else {
                lastProjects = [];
            }
            for (const project of lastProjects) {
                recentProjectsSubmenu.items.push({
                    label: project,
                    click: function () {
                        if (!confirm(window.languageJSON.common.reallyexit)) {
                            return false;
                        }
                        window.signals.trigger('resetAll');
                        window.loadProject(project);
                    }
                });
            }
        };
        this.ctClick = (e) => {
            this.refreshLatestProject();
            if (e) {
                this.refs.catMenu.toggle();
            }
        };
        this.saveProject = () => {
            const YAML = require('js-yaml');
            const data = YAML.safeDump(global.currentProject);
            return fs.outputFile(global.projdir + '.ict', data)
            .then(() => {
                alertify.success(languageJSON.common.savedcomm, "success", 3000);
                this.saveRecoveryDebounce();
                fs.remove(global.projdir + '.ict.recovery')
                .then(() => console.log())
                .catch(console.error);
                glob.modified = false;
            })
            .catch(alertify.error);
        };
        this.saveRecovery = () => {
            if (global.currentProject) {
                const YAML = require('js-yaml');
                const data = YAML.safeDump(global.currentProject);
                fs.outputFile(global.projdir + '.ict.recovery', data);
            }
            this.saveRecoveryDebounce();
        };
        this.saveRecoveryDebounce = debounce(this.saveRecovery, 1000 * 60 * 5);
        window.signals.on('saveProject', this.saveProject);
        this.on('unmount', () => {
            window.signals.off('saveProject', this.saveProject);
        });
        this.saveRecoveryDebounce();

        const {getWritableDir} = require('./data/node_requires/platformUtils');
        // Run a local server for ct.js games
        let fileServer;
        getWritableDir().then(dir => {
            const nstatic = require('node-static');
            fileServer = new nstatic.Server(path.join(dir, '/export/'), {
                cache: false,
                serverInfo: 'ctjsgameeditor'
            });
            console.log('[serverPath]', path.join(dir, '/export/'));
        });
        const server = require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                fileServer.serve(request, response);
            }).resume();
        });
        server.listen(0);

        this.runProject = e => {
            document.body.style.cursor = 'progress';
            const runCtExport = require('./data/node_requires/exporter');
            runCtExport(global.currentProject, global.projdir)
            .then(path => {
                if (localStorage.disableBuiltInDebugger === 'yes') {
                    nw.Shell.openExternal(`http://localhost:${server.address().port}/`);
                } else {
                    window.openDebugger(`http://localhost:${server.address().port}`);
                }
            })
            .catch(e => {
                window.alertify.error(e);
                console.error(e);
            })
            .finally(() => {
                document.body.style.cursor = '';
            });
        };
        this.runProjectAlt = e => {
            const runCtExport = require('./data/node_requires/exporter');
            runCtExport(global.currentProject, global.projdir)
            .then(path => {
                console.log(path);
                nw.Shell.openExternal(`http://localhost:${server.address().port}/`);
            });
        };
        hotkey.on('Alt+F5', this.runProjectAlt);

        this.zipProject = async e => {
            try {
                const os = require('os');
                const path = require('path');

                const writable = await getWritableDir();
                const inDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ctZipProject-')),
                      outName = path.join(writable, `/${sessionStorage.projname}.zip`);

                await this.saveProject();
                await fs.remove(outName);
                await fs.remove(inDir);
                await fs.copy(global.projdir + '.ict', path.join(inDir, sessionStorage.projname));
                await fs.copy(global.projdir, path.join(inDir, sessionStorage.projname.slice(0, -4)));

                const archive = archiver('zip'),
                    output = fs.createWriteStream(outName);

                output.on('close', () => {
                    nw.Shell.showItemInFolder(outName);
                    alertify.success(this.voc.successZipProject.replace('{0}', outName));
                    fs.remove(inDir);
                });

                archive.pipe(output);
                archive.directory(inDir, false);
                archive.finalize();
            } catch (e) {
                alertify.error(e);
            }
        };
        this.zipExport = async e => {
            const writable = await getWritableDir();
            const runCtExport = require('./data/node_requires/exporter');
            let exportFile = path.join(writable, '/export.zip'),
                inDir = path.join(writable, '/export/');
            await fs.remove(exportFile);
            runCtExport(global.currentProject, global.projdir)
            .then(() => {
                let archive = archiver('zip'),
                    output = fs.createWriteStream(exportFile);

                output.on('close', () => {
                    nw.Shell.showItemInFolder(exportFile);
                    alertify.success(this.voc.successZipExport.replace('{0}', exportFile));
                });

                archive.pipe(output);
                archive.directory(inDir, false);
                archive.finalize();
            })
            .catch(alertify.error);
        };
        localStorage.UItheme = localStorage.UItheme || 'Day';
        this.switchTheme = theme => {
            localStorage.UItheme = theme;
            document.getElementById('themeCSS').href = `./data/theme${theme}.css`;
            window.signals.trigger('UIThemeChanged', theme);
        };

        const troubleshootingSubmenu = {
            items: [{
                label: window.languageJSON.menu.toggleDevTools,
                icon: 'terminal',
                hotkeyLabel: 'Ctrl+Shift+C',
                click: () => {
                    const win = nw.Window.get();
                    if (win.isDevToolsOpen()) {
                        win.closeDevTools();
                    } else {
                        win.showDevTools();
                    }
                }
            }, {
                label: window.languageJSON.menu.copySystemInfo,
                icon: 'file-text',
                click: async () => {
                    const os = require('os');
                    const YAML = require('js-yaml');
                    const report = `Ct.js v${remote.app.getVersion()} 😽 ${remote.app.isPackaged? '(packaged)' : '(runs from sources)'}\n\n` +
                          `NW.JS v${process.versions.nw}\n` +
                          `Chromium v${process.versions.chromium}\n` +
                          `Node.js v${process.versions.node}\n` +
                          `Pixi.js v${PIXI.VERSION}\n\n` +
                          `OS ${process.platform} ${process.arch} // ${os.type()} ${os.release()}`;
                    nw.Clipboard.get().set(report, 'text');
                }
            }, {
                label: window.languageJSON.menu.disableAcceleration,
                type: 'checkbox',
                checked: () => fs.existsSync('./pleaseCtJSLoadWithoutGPUAccelerationMmkay'),
                click: async () => {
                    if (await fs.exists('./pleaseCtJSLoadWithoutGPUAccelerationMmkay')) {
                        await fs.remove('./pleaseCtJSLoadWithoutGPUAccelerationMmkay');
                    } else {
                        await fs.outputFile('./pleaseCtJSLoadWithoutGPUAccelerationMmkay', 'Do it.');
                    }
                    this.update();
                }
            }, {
                label: window.languageJSON.menu.disableBuiltInDebugger,
                type: 'checkbox',
                checked: () => localStorage.disableBuiltInDebugger === 'yes',
                click: () => {
                    if (localStorage.disableBuiltInDebugger === 'yes') {
                        localStorage.disableBuiltInDebugger = 'no';
                    } else {
                        localStorage.disableBuiltInDebugger = 'yes';
                    }
                }
            }, {
                type: 'separator'
            }, {
                icon: 'discord',
                iconClass: 'icon',
                label: window.languageJSON.menu.visitDiscordForGamedevSupport,
                click: () => {
                    nw.Shell.openExternal('https://discord.gg/3f7TsRC');
                }
            }, {
                icon: 'github',
                iconClass: 'icon',
                label: window.languageJSON.menu.postAnIssue,
                click: () => {
                    nw.Shell.openExternal('https://github.com/ct-js/ct-js/issues/new/choose');
                }
            }]
        };

        this.catMenu = {
            items: [{
                label: window.languageJSON.common.save,
                icon: 'save',
                click: this.saveProject,
                hotkey: 'Control+s',
                hotkeyLabel: 'Ctrl+S'
            }, {
                label: this.voc.openIncludeFolder,
                click: e => {
                    fs.ensureDir(path.join(global.projdir, '/include'))
                    .then(() => {
                        nw.Shell.openItem(path.join(global.projdir, '/include'));
                    });
                }
            }, {
                label: this.voc.zipProject,
                click: this.zipProject
            }, {
                label: this.voc.zipExport,
                click: this.zipExport,
                icon: 'upload-cloud'
            }, {
                label: this.voc.exportDesktop,
                click: e => {
                    this.showExporter = true;
                    this.update();
                },
                icon: 'package'
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.zoomIn,
                icon: 'zoom-in',
                click: e => {
                    const win = nw.Window.get();
                    let zoom = win.zoomLevel + 0.5;
                    if (Number.isNaN(zoom) || !zoom || !Number.isFinite(zoom)) {
                        zoom = 0;
                    } else if (zoom > 5) {
                        zoom = 5;
                    }
                    win.zoomLevel = zoom;

                    console.debug('Zoom in to ', zoom);
                    localStorage.editorZooming = zoom;
                },
                hotkey: 'Control+=',
                hotkeyLabel: 'Ctrl+='
            }, {
                label: window.languageJSON.common.zoomOut,
                icon: 'zoom-out',
                click: e => {
                    const win = nw.Window.get();
                    let zoom = win.zoomLevel - 0.5;
                    if (Number.isNaN(zoom) || !zoom || !Number.isFinite(zoom)) {
                        zoom = 0;
                    } else if (zoom < -3) {
                        zoom = -3;
                    }
                    win.zoomLevel = zoom;

                    console.debug('Zoom out to ', zoom);
                    localStorage.editorZooming = zoom;
                },
                hotkey: 'Control+-',
                hotkeyLabel: 'Ctrl+-'
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.menu.startScreen,
                click: (e) => {
                    if (!confirm(window.languageJSON.common.reallyexit)) {
                        return false;
                    }
                    window.signals.trigger('resetAll');
                }
            }, {
                label: window.languageJSON.intro.latest,
                submenu: recentProjectsSubmenu
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.language,
                submenu: languageSubmenu
            }, {
                label: window.languageJSON.menu.theme,
                submenu: {
                    items: [{
                        label: window.languageJSON.menu.themeDay,
                        icon: () => localStorage.UItheme === 'Day' && 'check',
                        click: () => {
                            this.switchTheme('Day');
                        }
                    }, {
                        label: window.languageJSON.menu.themeNight,
                        icon: () => localStorage.UItheme === 'Night' && 'check',
                        click: () => {
                            this.switchTheme('Night');
                        }
                    }, {
                        label: window.languageJSON.menu.themeHorizon || 'Horizon',
                        icon: () => localStorage.UItheme === 'Horizon' && 'check',
                        click: () => {
                            this.switchTheme('Horizon');
                        }
                    }]
                }
            }, {
                label: window.languageJSON.menu.codeFont,
                submenu: {
                    items: [{
                        label: window.languageJSON.menu.codeFontDefault,
                        icon: () => !localStorage.fontFamily && 'check',
                        click: () => {
                            localStorage.fontFamily = '';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }, {
                        label: window.languageJSON.menu.codeFontOldSchool,
                        icon: () => localStorage.fontFamily === 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace' && 'check',
                        click: () => {
                            localStorage.fontFamily = 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }, {
                        label: window.languageJSON.menu.codeFontSystem,
                        icon: () => localStorage.fontFamily === 'monospace' && 'check',
                        click: () => {
                            localStorage.fontFamily = 'monospace';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }, {
                        label: window.languageJSON.menu.codeFontCustom,
                        click: () => {
                            alertify
                            .defaultValue(localStorage.fontFamily || '')
                            .prompt(window.languageJSON.menu.newFont)
                            .then(e => {
                                if (e.inputValue && e.buttonClicked !== 'cancel') {
                                    localStorage.fontFamily = `"${e.inputValue}", monospace`;
                                }
                                window.signals.trigger('codeFontUpdated');
                            });
                        }
                    }, {
                        type: 'separator'
                    }, {
                        label: window.languageJSON.menu.codeLigatures,
                        type: 'checkbox',
                        checked: () => localStorage.codeLigatures !== 'off',
                        click: () => {
                            localStorage.codeLigatures = localStorage.codeLigatures === 'off'? 'on' : 'off';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }, {
                        label: window.languageJSON.menu.codeDense,
                        type: 'checkbox',
                        checked: () => localStorage.codeDense === 'on',
                        click: () => {
                            localStorage.codeDense = localStorage.codeDense === 'off'? 'on' : 'off';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }]
                }
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.contribute,
                click: function () {
                    nw.Shell.openExternal('https://github.com/ct-js/ct-js');
                },
                icon: 'code'
            }, {
                label: window.languageJSON.common.donate,
                icon: 'heart',
                click: function () {
                    nw.Shell.openExternal('https://www.patreon.com/comigo');
                }
            }, {
                label: window.languageJSON.menu.troubleshooting,
                icon: 'alert-circle',
                submenu: troubleshootingSubmenu
            }, {
                label: window.languageJSON.common.ctsite,
                click: function () {
                    nw.Shell.openExternal('https://ctjs.rocks/');
                }
            }, {
                label: window.languageJSON.menu.license,
                click: () => {
                    this.showLicense = true;
                    this.update();
                }
            }]
        };
        this.switchLanguage = filename => {
            const i18n = require('./data/node_requires/i18n.js');
            const {extend} = require('./data/node_requires/objectUtils');
            try {
                window.languageJSON = i18n.loadLanguage(filename);
                localStorage.appLanguage = filename;
                window.signals.trigger('updateLocales');
                window.riot.update();
                console.log('Applied a new language file.');
            } catch(e) {
                alert('Could not open a language file: ' + e);
            }
        };
        var switchLanguage = this.switchLanguage;

        fs.readdir('./data/i18n/')
        .then(files => {
            files.forEach(filename => {
                if (path.extname(filename) !== '.json') {
                    return;
                }
                var file = filename.slice(0, -5);
                if (file === 'Comments') {
                    return;
                }
                languageSubmenu.items.push({
                    label: file,
                    icon: () => localStorage.appLanguage === file && 'check',
                    click: function() {
                        switchLanguage(file);
                    }
                });
            });
            languageSubmenu.items.push({
                type: 'separator'
            });
            languageSubmenu.items.push({
                label: window.languageJSON.common.translateToYourLanguage,
                click: function() {
                    nw.Shell.openExternal('https://github.com/ct-js/ct-js/tree/develop/app/data/i18n');
                }
            });
        })
        .catch(e => {
            alert('Could not get i18n files: ' + e);
        });