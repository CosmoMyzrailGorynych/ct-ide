main-menu.flexcol
    nav.nogrow.flexrow(if="{window.currentProject}")
        ul#fullscreen.nav
            li(onclick="{toggleFullscreen}" title="{voc.min}")
                i(class="icon-{fullscreen? 'minimize-2' : 'maximize-2'}")

        ul#app.nav.tabs
            li.it30#ctlogo(onclick="{ctClick}" title="{voc.ctIDE}")
                i.icon-menu
            li.it30(onclick="{saveProject}" title="{voc.save}")
                i.icon-save
            li.it30(onclick="{runProject}" title="{voc.launch}")
                i.icon-play

        ul#mainnav.nav.tabs
            li(onclick="{changeTab('settings')}" class="{active: tab === 'settings'}")
                i.icon-settings
                span {voc.settings}
            li(onclick="{changeTab('modules')}" class="{active: tab === 'modules'}")
                i.icon-mod
                span {voc.modules}
            li(onclick="{changeTab('graphic')}" class="{active: tab === 'graphic'}")
                i.icon-picture
                span {voc.graphic}
            li(onclick="{changeTab('styles')}" class="{active: tab === 'styles'}")
                i.icon-droplet
                span {voc.styles}
            li(onclick="{changeTab('sounds')}" class="{active: tab === 'sounds'}")
                i.icon-headphones
                span {voc.sounds}
            li(onclick="{changeTab('types')}" class="{active: tab === 'types'}")
                i.icon-user
                span {voc.types}
            li(onclick="{changeTab('rooms')}" class="{active: tab === 'rooms'}")
                i.icon-map
                span {voc.rooms}
    div.flexitem.relative(if="{window.currentProject}")
        settings-panel(show="{tab === 'settings'}")
        modules-panel(show="{tab === 'modules'}")
        graphics-panel(show="{tab === 'graphic'}")
        styles-panel(show="{tab === 'styles'}")
        sounds-panel(show="{tab === 'sounds'}")
        types-panel(show="{tab === 'types'}")
        rooms-panel(show="{tab === 'rooms'}")
    script.
        const fs = require('fs-extra'),
              path = require('path');
        const zip = require('cross-zip');

        this.namespace = 'menu';
        this.mixin(window.riotVoc);

        this.tab = 'settings';
        this.changeTab = tab => e => {
            this.tab = tab;
            window.signals.trigger('globalTabChanged');
        };
        const gui = require('nw.gui'),
              win = gui.Window.get();
        
        this.fullscreen = false;
        this.toggleFullscreen = function() {
            win.toggleFullscreen();
            this.fullscreen = !this.fullscreen;
        };
        
        this.ctClick = (e) => {
            catMenu.popup(e.clientX, e.clientY);
        };
        this.saveProject = () => {
            return fs.outputJSON(sessionStorage.projdir + '.ict', currentProject, {
                spaces: 2  
            }).then(() => {
                alertify.success(languageJSON.common.savedcomm, "success", 3000);
                glob.modified = false;
            })
            .catch(alertify.error);
        };
        window.signals.on('saveProject', () => {
            this.saveProject();
        });

        const nstatic = require('node-static');
        const exec = path.dirname(process.execPath).replace(/\\/g,'/');
        const fileServer = new nstatic.Server(path.join(exec, '/export/'), {
            cache: false,
            serverInfo: 'ctjsgameeditor'
        });

        const server = require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                fileServer.serve(request, response);
            }).resume();
        });
        server.listen(0);
        
        this.runProject = e => {
            window.runCtProject()
            .then(path => {
                gui.Shell.openExternal(`http://localhost:${server.address().port}/`);
            })
            .catch(e => {
                window.alertify.error(e);
                console.error(e);
            });
        };

        this.zipProject = e => {
            var inDir = path.resolve('./zipexport/'),
                outName = path.resolve(`./${sessionStorage.projname}.zip`);
            this.saveProject()
            .then(fs.remove(outName))
            .then(fs.emptyDir(inDir))
            .then(() => new Promise(resolve => {
                setTimeout(resolve, 100);
            }))
            .then(fs.copy(sessionStorage.projdir + '.ict', path.join(inDir, sessionStorage.projname + '.ict')))
            .then(fs.copy(sessionStorage.projdir, path.join(inDir, sessionStorage.projname)))
            .then(() => new Promise(resolve => {
                setTimeout(resolve, 100);
            }))
            .then(() => {
                zip.zip('./zipexport/.', outName, err => {
                    if (err) {
                        alertify.error(err);
                        console.error(err);
                        return;
                    }
                    nw.Shell.showItemInFolder(outName);
                });
            })
            .catch(alertify.error);
        };
        this.zipExport = e => {
            var exportFile = path.resolve('./export.zip');
            fs.remove(exportFile)
            .then(() => window.runCtProject())
            .then(() => {
                zip.zip('./export/.', exportFile, err => {
                    if (err) {
                        window.fuck = err;
                        console.error(err);
                        if (err.code !== 12) {
                            alertify.error(err);
                            return;
                        }
                    }
                    nw.Shell.showItemInFolder(exportFile);
                });
            })
            .catch(alertify.error);
        };
        
        var catMenu = new gui.Menu();
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.save,
            click: this.saveProject
        }));
        catMenu.append(new gui.MenuItem({
            label: this.voc.zipProject,
            click: this.zipProject
        }));
        catMenu.append(new gui.MenuItem({
            label: this.voc.zipExport,
            click: this.zipExport
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.startscreen,
            click: (e) => {
                if (!confirm(window.languageJSON.common.reallyexit)) {
                    return false;
                }
                window.signals.trigger('resetAll');
            }
        }));
        catMenu.append(new gui.MenuItem({type: 'separator'}));
        var languageSubmenu = new nw.Menu();
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.language,
            submenu: languageSubmenu
        }))
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.ctsite,
            click: function () {
                gui.Shell.openExternal('https://ctjs.rocks/');
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
            try {
                const vocDefault = fs.readJSONSync('./i18n/English.json');
                const voc = fs.readJSONSync(`./i18n/${filename}.json`);
                console.log('loaded');
                window.languageJSON = window.___extend(vocDefault, voc);
                localStorage.appLanguage = filename;
                window.signals.trigger('updateLocales');
                window.riot.update();
                console.log('changed');
            } catch(e) {
                alert('Could not open a language file: ' + e);
            }
        };
        var switchLanguage = this.switchLanguage;

        fs.readdir('./i18n/')
        .then(files => {
            files.forEach(filename => {
                var file = filename.slice(0, -5);
                languageSubmenu.append(new nw.MenuItem({
                    label: file,
                    click: function() {
                        console.log('clicked');
                        switchLanguage(file);
                    }
                }));
            });
        })
        .catch(e => {
            alert('Could not get i18n files: ' + e);
        });