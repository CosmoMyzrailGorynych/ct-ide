main-menu.flexcol
    nav.nogrow.flexrow(if="{window.currentProject}")
        ul#fullscreen.nav
            li.nbr(onclick="{toggleFullscreen}" title="{voc.min} (F11)")
                svg.feather
                    use(xlink:href="data/icons.svg#{fullscreen? 'minimize-2' : 'maximize-2'}" data-hotkey="F11")

        ul#app.nav.tabs
            li.it30#ctlogo(onclick="{ctClick}" title="{voc.ctIDE}")
                svg.feather
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
    div.flexitem.relative(if="{window.currentProject}")
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
            const {remote} = require('electron');
            remote.getCurrentWindow().setFullScreen(this.fullscreen);
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
            const data = YAML.safeDump(currentProject);
            return fs.outputFile(sessionStorage.projdir + '.ict', data)
            .then(() => {
                alertify.success(languageJSON.common.savedcomm, "success", 3000);
                this.saveRecoveryDebounce();
                fs.remove(sessionStorage.projdir + '.ict.recovery')
                .then(() => console.log())
                .catch(console.error);
                glob.modified = false;
            })
            .catch(alertify.error);
        };
        this.saveRecovery = () => {
            if (currentProject) {
                const YAML = require('js-yaml');
                const data = YAML.safeDump(currentProject);
                fs.outputFile(sessionStorage.projdir + '.ict.recovery', data);
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

        // a map from IPC messages to scripts sent to the ct.js game, to shorten the code
        const toolbarResponseScripts = {
            togglePause: `
                if (PIXI.Ticker.shared.started) {
                    PIXI.Ticker.shared.stop();
                } else {
                    PIXI.Ticker.shared.start();
                }`,
            restartGame: 'window.location.reload();',
            restartRoom: 'ct.rooms.switch(ct.room.name);'
        }
        // Listen for ct.js toolbar's events
        const {ipcRenderer} = require('electron');
        ipcRenderer.on('debuggerToolbar', (event, message) => {
            console.log(message);
            if (message in toolbarResponseScripts) {
                previewWindow.webContents.executeJavaScript(toolbarResponseScripts[message]);
            } else if (message === 'makeScreenshot') {
                // Ask for game canvas geometry
                const rect = previewWindow.webContents.executeJavaScript(`
                    new Promise(resolve => {
                        const b = document.querySelector('#ct canvas').getBoundingClientRect();
                        // Needs to be copied manually, otherwise resolves into an empty object
                        resolve({x: b.x, y: b.y, width: b.width, height: b.height});
                    });
                `).then(rect => {
                    previewWindow.capturePage(rect).then(img => {
                        // @see https://www.electronjs.org/docs/api/native-image
                        const fs = require('fs-extra'),
                              path = require('path');
                        const buff = img.toPNG();
                        const now = new Date(),
                              timestring = `${now.getFullYear()}-${('0'+now.getMonth()+1).slice(-2)}-${('0'+now.getDate()).slice(-2)} ${(new Date()).getHours()}-${('0'+now.getMinutes()).slice(-2)}-${('0'+now.getSeconds()).slice(-2)}`,
                              name = `Screenshot of ${currentProject.settings.title || 'ct.js game'} at ${timestring}.png`,
                              fullPath = path.join(__dirname, name);
                        const stream = fs.createWriteStream(fullPath);
                        stream.on('finish', () => {
                            alertify.success(`Saved to ${fullPath}`);
                        });
                        stream.end(buff);
                    }).catch(alertify.error);
                });
            } else if (message === 'openExternal') {
                const shell = require('electron').shell;
                shell.openExternal(`http://localhost:${server.address().port}/`);
            } else if (message === 'toggleFullscreen') {
                previewWindow.setFullScreen(!previewWindow.isFullScreen());
            } else if (message.indexOf('switchRoom') === 0) {
                const room = message.split(':').slice(1).join('');
                previewWindow.webContents.executeJavaScript(`ct.rooms.switch('${room}')`);
            } else if (message === 'closeDebugger') {
                // close both windows
                previewWindow.destroy();
                toolbarWindow.destroy();
                previewWindow = toolbarWindow = null;
            } else if (message === 'toggleDevTools') {
                previewWindow.webContents.toggleDevTools();
            } else if (message === 'openQrCodes') {
                if (qrCodesWindow) {
                    qrCodesWindow.focus();
                } else {
                    const {BrowserWindow} = require('electron').remote;
                    qrCodesWindow = new BrowserWindow({
                        width: 700,
                        height: 440,
                        resizable: true,
                        webPreferences: {
                            nodeIntegration: true,
                            affinity: 'ct.IDE',
                            title: 'ct.js networking',
                            icon: 'ct_ide.png'
                        }
                    });
                    qrCodesWindow.setMenuBarVisibility(false);
                    qrCodesWindow.on('close', () => {
                        qrCodesWindow = null;
                    });
                    qrCodesWindow.loadFile('qrCodePanel.html', {
                        query: {
                            port: server.address().port
                        }
                    });
                }
            }
        });

        var previewWindow, toolbarWindow, qrCodesWindow;
        this.runProject = e => {
            // Clean up previous instances of a toolbar and a debugger
            if (previewWindow) {
                previewWindow.destroy();
                previewWindow = null;
            }
            if (toolbarWindow) {
                toolbarWindow.destroy();
                toolbarWindow = null;
            }

            const runCtExport = require('./data/node_requires/exporter');
            runCtExport(currentProject, sessionStorage.projdir)
            .then(path => {
                const {BrowserWindow} = require('electron').remote;

                // Get displays to position everything nicely
                // Eithe aim for the first external monitor, or to the main one
                const nativeScreen = require('electron').remote.screen;
                const primary = nativeScreen.getPrimaryDisplay()
                const targetScreen = nativeScreen.getAllDisplays().find(display => display.id !== primary.id) ||
                                     primary;

                // Spawn a new preview window
                previewWindow =  new BrowserWindow({
                    title: 'ct.js',
                    icon: 'ct_ide.png',
                    x: targetScreen.bounds.x,
                    y: targetScreen.bounds.y,
                    width: targetScreen.bounds.width,
                    height: targetScreen.bounds.height,
                    resizable: true,
                    webPreferences: {
                        devTools: true,
                        nodeIntegration: true,
                        affinity: 'ct game'
                    }
                });
                previewWindow.setMenuBarVisibility(false);
                previewWindow.maximize();
                previewWindow.loadURL(`http://localhost:${server.address().port}`);
                previewWindow.focus();
                previewWindow.webContents.openDevTools();

                // Align the toolbar to top-center position
                const x = targetScreen.bounds.x + (targetScreen.bounds.width - 480) / 2,
                      y = targetScreen.bounds.y;

                // Create a toolbar that provides additional game-related tools
                toolbarWindow = new BrowserWindow({
                    width: 480,
                    height: 40,
                    x,
                    y,
                    //width: 1024, // In case you need to call a debugger
                    //height: 1024,
                    minHeight: 20,
                    minWidth: 208,
                    frame: false,
                    transparent: true,
                    resizable: false,
                    title: 'ct.js',
                    icon: 'ct_ide.png',
                    alwaysOnTop: true,
                    webPreferences: {
                        devTools: true,
                        nodeIntegration: true,
                        affinity: 'ct.IDE'
                    }
                });
                // This line will prevent the toolbar from stucking behind a Windows taskbar / MacOS dock
                toolbarWindow.setAlwaysOnTop(true, 'pop-up-menu');
                toolbarWindow.loadFile('debuggerToolbar.html', {
                    query: {
                        parentId: require('electron').remote.getCurrentWindow().id,
                        rooms: currentProject.rooms.map(room => room.name)
                    }
                });
                //toolbarWindow.webContents.openDevTools();

                // listeners for events when one of the windows is closed; destroy both
                const closer = () => {
                    if (previewWindow) {
                        previewWindow.destroy();
                    }
                    if (toolbarWindow) {
                        toolbarWindow.destroy();
                    }
                    toolbarWindow = previewWindow = null;
                };
                toolbarWindow.on('closed', closer);
                previewWindow.on('closed', closer);
            })
            .catch(e => {
                window.alertify.error(e);
                console.error(e);
            });
        };
        this.runProjectAlt = e => {
            const runCtExport = require('./data/node_requires/exporter');
            runCtExport(currentProject, sessionStorage.projdir)
            .then(path => {
                console.log(path);
                const shell = require('electron').shell;
                shell.openExternal(`http://localhost:${server.address().port}/`);
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
                await fs.copy(sessionStorage.projdir + '.ict', path.join(inDir, sessionStorage.projname));
                await fs.copy(sessionStorage.projdir, path.join(inDir, sessionStorage.projname.slice(0, -4)));

                const archive = archiver('zip'),
                    output = fs.createWriteStream(outName);

                output.on('close', () => {
                    const shell = require('electron').shell;
                    shell.showItemInFolder(outName);
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
            runCtExport(currentProject, sessionStorage.projdir)
            .then(() => {
                let archive = archiver('zip'),
                    output = fs.createWriteStream(exportFile);

                output.on('close', () => {
                    const shell = require('electron').shell;
                    shell.showItemInFolder(exportFile);
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
                    fs.ensureDir(path.join(sessionStorage.projdir, '/include'))
                    .then(() => {
                        const shell = require('electron').shell;
                        shell.openItem(path.join(sessionStorage.projdir, '/include'));
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
                        checked: localStorage.codeLigatures !== 'off',
                        click: () => {
                            localStorage.codeLigatures = localStorage.codeLigatures === 'off'? 'on' : 'off';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }, {
                        label: window.languageJSON.menu.codeDense,
                        type: 'checkbox',
                        checked: localStorage.codeDense === 'on',
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
                    const {shell} = require('electron');
                    shell.openExternal('https://github.com/ct-js/ct-js');
                },
                icon: 'code'
            }, {
                label: window.languageJSON.common.donate,
                icon: 'heart',
                click: function () {
                    const {shell} = require('electron');
                    shell.openExternal('https://www.patreon.com/comigo');
                }
            }, {
                label: window.languageJSON.common.ctsite,
                click: function () {
                    const {shell} = require('electron');
                    shell.openExternal('https://ctjs.rocks/');
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
                    const {shell} = require('electron');
                    shell.openExternal('https://github.com/ct-js/ct-js/tree/develop/app/data/i18n');
                }
            });
        })
        .catch(e => {
            alert('Could not get i18n files: ' + e);
        });