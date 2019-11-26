main-menu.flexcol
    nav.nogrow.flexrow(if="{window.currentProject}")
        ul#fullscreen.nav
            li.nbr(onclick="{toggleFullscreen}" title="{voc.min}")
                i(class="icon-{fullscreen? 'minimize-2' : 'maximize-2'} (F11)" data-hotkey="F11")

        ul#app.nav.tabs
            li.it30#ctlogo(onclick="{ctClick}" title="{voc.ctIDE}")
                i.icon-menu
            li.it30(onclick="{changeTab('patrons')}" title="{voc.patrons}" class="{active: tab === 'patrons'}")
                i.icon-heart
            li.it30(onclick="{saveProject}" title="{voc.save} (Control+S)" data-hotkey="Control+s")
                i.icon-save
            li.nbr.it30(onclick="{runProject}" title="{voc.launch} {voc.launchHotkeys}" data-hotkey="F5")
                i.icon-play

        ul#mainnav.nav.tabs
            li(onclick="{changeTab('settings')}" class="{active: tab === 'settings'}" data-hotkey="Control+1" title="Control+1")
                i.icon-settings
                span {voc.settings}
            li(onclick="{changeTab('modules')}" class="{active: tab === 'modules'}" data-hotkey="Control+2" title="Control+2")
                i.icon-mod
                span {voc.modules}
            li(onclick="{changeTab('texture')}" class="{active: tab === 'texture'}" data-hotkey="Control+3" title="Control+3")
                i.icon-picture
                span {voc.texture}
            li(onclick="{changeTab('ui')}" class="{active: tab === 'ui'}" data-hotkey="Control+4" title="Control+4")
                i.icon-droplet
                span {voc.ui}
            li(onclick="{changeTab('sounds')}" class="{active: tab === 'sounds'}" data-hotkey="Control+5" title="Control+5")
                i.icon-headphones
                span {voc.sounds}
            li(onclick="{changeTab('types')}" class="{active: tab === 'types'}" data-hotkey="Control+6" title="Control+6")
                i.icon-user
                span {voc.types}
            li(onclick="{changeTab('rooms')}" class="{active: tab === 'rooms'}" data-hotkey="Control+7" title="Control+7")
                i.icon-map
                span {voc.rooms}
    div.flexitem.relative(if="{window.currentProject}")
        settings-panel(show="{tab === 'settings'}" data-hotkey-scope="settings")
        modules-panel(show="{tab === 'modules'}" data-hotkey-scope="modules")
        textures-panel(show="{tab === 'texture'}" data-hotkey-scope="texture")
        ui-panel(show="{tab === 'ui'}" data-hotkey-scope="ui")
        sounds-panel(show="{tab === 'sounds'}" data-hotkey-scope="sounds")
        types-panel(show="{tab === 'types'}" data-hotkey-scope="types")
        rooms-panel(show="{tab === 'rooms'}" data-hotkey-scope="rooms")
        license-panel(if="{showLicense}")
        patreon-screen(if="{tab === 'patrons'}" data-hotkey-scope="patrons")
        export-panel(show="{showExporter}")
    script.
        const fs = require('fs-extra'),
              path = require('path');
        const archiver = require('archiver');
        const runCtExport = require('./data/node_requires/exporter');
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
        const gui = require('nw.gui'),
              win = gui.Window.get();

        this.fullscreen = false;
        this.toggleFullscreen = function() {
            win.toggleFullscreen();
            this.fullscreen = !this.fullscreen;
        };

        this.refreshLatestProject = function() {
            while (recentProjectsSubmenu.items.length) {
                recentProjectsSubmenu.removeAt(0);
            }
            var lastProjects;
            if (('lastProjects' in localStorage) &&
                (localStorage.lastProjects !== '')) {
                lastProjects = localStorage.lastProjects.split(';');
            } else {
                lastProjects = [];
            }
            for (const project of lastProjects) {
                recentProjectsSubmenu.append(new gui.MenuItem({
                    label: project,
                    click: function () {
                        if (!confirm(window.languageJSON.common.reallyexit)) {
                            return false;
                        }
                        window.signals.trigger('resetAll');
                        window.loadProject(project);
                    }
                }))
            }
        };
        this.ctClick = (e) => {
            this.refreshLatestProject();
            catMenu.popup(e.clientX, e.clientY);
        };
        this.saveProject = () => {
            return fs.outputJSON(sessionStorage.projdir + '.ict', currentProject, {
                spaces: 2
            }).then(() => {
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
                fs.outputJSON(sessionStorage.projdir + '.ict.recovery', currentProject, {
                    spaces: 2
                });
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

        var previewWindow;
        this.runProject = e => {
            runCtExport(currentProject, sessionStorage.projdir)
            .then(path => {
                if (previewWindow) {
                    var nwWin = nw.Window.get(previewWindow);
                    nwWin.show();
                    nwWin.focus();
                    previewWindow.document.getElementById('thePreview').reload();
                    return;
                }
                nw.Window.open(`preview.html?title=${encodeURIComponent(currentProject.settings.title || 'ct.js game')}`, {
                    new_instance: false,
                    id: 'ctPreview',
                    frame: true,
                    fullscreen: false
                }, function(newWin) {
                    var wind = newWin.window;
                    previewWindow = wind;
                    newWin.once('loaded', e => {
                        newWin.title = 'ct.IDE Debugger';
                        const win = newWin.window;
                        newWin.leaveFullscreen();
                        newWin.maximize();
                        var game = win.document.getElementById('thePreview');
                        game.src = `http://localhost:${server.address().port}/`;
                    });
                    newWin.once('closed', e => {
                        previewWindow = null;
                    })
                });
            })
            .catch(e => {
                window.alertify.error(e);
                console.error(e);
            });
        };
        this.runProjectAlt = e => {
            runCtExport(currentProject, sessionStorage.projdir)
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
                await fs.copy(sessionStorage.projdir + '.ict', path.join(inDir, sessionStorage.projname));
                await fs.copy(sessionStorage.projdir, path.join(inDir, sessionStorage.projname.slice(0, -4)));

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
            let exportFile = path.join(writable, '/export.zip'),
                inDir = path.join(writable, '/export/');
            await fs.remove(exportFile);
            runCtExport(currentProject, sessionStorage.projdir)
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

        var catMenu = new gui.Menu();
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.save,
            click: this.saveProject
        }));
        catMenu.append(new gui.MenuItem({
            label: this.voc.openIncludeFolder,
            click: e => {
                nw.Shell.openItem(path.join(sessionStorage.projdir, '/include'));
            }
        }))
        catMenu.append(new gui.MenuItem({
            label: this.voc.zipProject,
            click: this.zipProject
        }));
        catMenu.append(new gui.MenuItem({
            label: this.voc.zipExport,
            click: this.zipExport
        }));
        catMenu.append(new gui.MenuItem({
            label: this.voc.exportDesktop,
            click: e => {
                this.showExporter = true;
                this.update();
            }
        }));
        catMenu.append(new gui.MenuItem({
            type: 'separator'
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.startScreen,
            click: (e) => {
                if (!confirm(window.languageJSON.common.reallyexit)) {
                    return false;
                }
                window.signals.trigger('resetAll');
            }
        }));
        var recentProjectsSubmenu = new nw.Menu();
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.intro.latest,
            submenu: recentProjectsSubmenu
        }));

        catMenu.append(new gui.MenuItem({type: 'separator'}));

        var languageSubmenu = new nw.Menu();
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.language,
            submenu: languageSubmenu
        }));

        var themeSubmenu = new nw.Menu();
        themeSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.themeDay,
            click: () => {
                this.switchTheme('Day');
            }
        }));
        themeSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.themeNight,
            click: () => {
                this.switchTheme('Night');
            }
        }));
        themeSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.themeHorizon || 'Horizon',
            click: () => {
                this.switchTheme('Horizon');
            }
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.theme,
            submenu: themeSubmenu
        }));
        this.switchTheme = theme => {
            localStorage.UItheme = theme;
            document.getElementById('themeCSS').href = `./data/theme${theme}.css`;
            window.signals.trigger('UIThemeChanged', theme);
        };
        localStorage.UItheme = localStorage.UItheme || 'Day';

        var fontSubmenu = new nw.Menu();
        fontSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.codeFontDefault,
            click: () => {
                localStorage.fontFamily = '';
                window.signals.trigger('codeFontUpdated');
            }
        }));
        fontSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.codeFontOldSchool,
            click: () => {
                localStorage.fontFamily = 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace';
                window.signals.trigger('codeFontUpdated');
            }
        }));
        fontSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.codeFontSystem,
            click: () => {
                localStorage.fontFamily = 'monospace';
                window.signals.trigger('codeFontUpdated');
            }
        }));
        fontSubmenu.append(new gui.MenuItem({
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
        }));
        fontSubmenu.append(new gui.MenuItem({type: 'separator'}));
        fontSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.codeLigatures,
            type: 'checkbox',
            checked: localStorage.codeLigatures !== 'off',
            click: () => {
                localStorage.codeLigatures = localStorage.codeLigatures === 'off'? 'on' : 'off';
                window.signals.trigger('codeFontUpdated');
            }
        }));
        fontSubmenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.codeDense,
            type: 'checkbox',
            checked: localStorage.codeDense === 'on',
            click: () => {
                localStorage.codeDense = localStorage.codeDense === 'off'? 'on' : 'off';
                window.signals.trigger('codeFontUpdated');
            }
        }));

        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.codeFont,
            submenu: fontSubmenu
        }));

        catMenu.append(new gui.MenuItem({type: 'separator'}));

        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.contribute,
            click: function () {
                gui.Shell.openExternal('https://github.com/ct-js/ct-js');
            }
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.ctsite,
            click: function () {
                gui.Shell.openExternal('https://ctjs.rocks/');
            }
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.license,
            click: () => {
                this.showLicense = true;
                this.update();
            }
        }));

        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.donate,
            click: function () {
                gui.Shell.openExternal('https://www.patreon.com/comigo');
            }
        }));

        catMenu.append(new gui.MenuItem({type: 'separator'}));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.exit,
            click: function (e) {
                alertify
                .confirm(window.languageJSON.common.exitconfirm)
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        gui.App.quit();
                    }
                });
            }
        }));

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
                languageSubmenu.append(new nw.MenuItem({
                    label: file,
                    click: function() {
                        switchLanguage(file);
                    }
                }));
            });
            languageSubmenu.append(new nw.MenuItem({
                type: 'separator'
            }));
            languageSubmenu.append(new nw.MenuItem({
                label: window.languageJSON.common.translateToYourLanguage,
                click: function() {
                    gui.Shell.openExternal('https://github.com/ct-js/ct-js/tree/develop/app/data/i18n');
                }
            }));
        })
        .catch(e => {
            alert('Could not get i18n files: ' + e);
        });