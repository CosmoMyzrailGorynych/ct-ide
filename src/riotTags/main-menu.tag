main-menu.flexcol
    nav.nogrow.flexrow(if="{global.currentProject}")
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
            li(onclick="{changeTab('project')}" class="{active: tab === 'project'}" data-hotkey="Control+1" title="Control+1")
                svg.feather
                    use(xlink:href="data/icons.svg#sliders")
                span {voc.project}
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
        project-settings(show="{tab === 'project'}" data-hotkey-scope="project")
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

        this.tab = 'project';
        this.changeTab = tab => () => {
            this.tab = tab;
            hotkey.cleanScope();
            hotkey.push(tab);
            window.signals.trigger('globalTabChanged');
            window.signals.trigger(`${tab}Focus`);
        };

        const languageSubmenu = {
            items: [],
            columns: 2
        };
        const recentProjectsSubmenu = {
            items: []
        };
        this.refreshLatestProject = function refreshLatestProject() {
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
                    click() {
                        alertify.confirm(window.languageJSON.common.reallyexit, e => {
                            if (e) {
                                window.signals.trigger('resetAll');
                                window.loadProject(project);
                            }
                        });
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
        this.saveProject = async () => {
            try {
                const YAML = require('js-yaml');
                const projectYAML = YAML.dump(global.currentProject);
                await fs.outputFile(global.projdir + '.ict', projectYAML);
                this.saveRecoveryDebounce();
                fs.remove(global.projdir + '.ict.recovery')
                .catch(console.error);
                glob.modified = false;
                alertify.success(window.languageJSON.common.savedcomm, 'success', 3000);
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

        const {getWritableDir} = require('./data/node_requires/platformUtils');
        // Run a local server for ct.js games
        let fileServer;
        getWritableDir().then(dir => {
            const nstatic = require('node-static');
            fileServer = new nstatic.Server(path.join(dir, '/export/'), {
                cache: false,
                serverInfo: 'ctjsgameeditor'
            });
        });
        const server = require('http').createServer((request, response) => {
            request.addListener('end', () => {
                fileServer.serve(request, response);
            }).resume();
        });
        server.listen(0);

        this.runProject = () => {
            document.body.style.cursor = 'progress';
            const runCtExport = require('./data/node_requires/exporter');
            runCtExport(global.currentProject, global.projdir)
            .then(() => {
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
        this.runProjectAlt = () => {
            const runCtExport = require('./data/node_requires/exporter');
            runCtExport(global.currentProject, global.projdir)
            .then(() => {
                nw.Shell.openExternal(`http://localhost:${server.address().port}/`);
            });
        };
        hotkey.on('Alt+F5', this.runProjectAlt);

        this.zipProject = async () => {
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
        this.zipExport = async () => {
            const writable = await getWritableDir();
            const runCtExport = require('./data/node_requires/exporter');
            const exportFile = path.join(writable, '/export.zip'),
                  inDir = path.join(writable, '/export/');
            await fs.remove(exportFile);
            runCtExport(global.currentProject, global.projdir)
            .then(() => {
                const archive = archiver('zip'),
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
                    win.showDevTools();
                }
            }, {
                label: window.languageJSON.menu.copySystemInfo,
                icon: 'file-text',
                click: () => {
                    const os = require('os'),
                          path = require('path');
                    const packaged = path.basename(process.execPath, path.extname(process.execPath)) !== 'nw';
                    const report = `Ct.js v${process.versions.ctjs} 😽 ${packaged ? '(packaged)' : '(runs from sources)'}\n\n` +
                          `NW.JS v${process.versions.nw}\n` +
                          `Chromium v${process.versions.chromium}\n` +
                          `Node.js v${process.versions.node}\n` +
                          `Pixi.js v${PIXI.VERSION}\n\n` +
                          `OS ${process.platform} ${process.arch} // ${os.type()} ${os.release()}`;
                    nw.Clipboard.get().set(report, 'text');
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

        const settingsSubmenu = {
            items: [{
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
                        label: window.languageJSON.menu.themeSpringStream || 'Spring Stream',
                        icon: () => localStorage.UItheme === 'SpringStream' && 'check',
                        click: () => {
                            this.switchTheme('SpringStream');
                        }
                    }, {
                        type: 'separator'
                    }, {
                        label: window.languageJSON.menu.themeNight || 'Night',
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
                    }, {
                        label: window.languageJSON.menu.themeLucasDracula || 'LucasDracula',
                        icon: () => localStorage.UItheme === 'LucasDracula' && 'check',
                        click: () => {
                            this.switchTheme('LucasDracula');
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
                            localStorage.codeLigatures = localStorage.codeLigatures === 'off' ? 'on' : 'off';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }, {
                        label: window.languageJSON.menu.codeDense,
                        type: 'checkbox',
                        checked: () => localStorage.codeDense === 'on',
                        click: () => {
                            localStorage.codeDense = localStorage.codeDense === 'off' ? 'on' : 'off';
                            window.signals.trigger('codeFontUpdated');
                        }
                    }]
                }
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.common.zoomIn,
                icon: 'zoom-in',
                click: () => {
                    const win = nw.Window.get();
                    let zoom = win.zoomLevel + 0.5;
                    if (Number.isNaN(zoom) || !zoom || !Number.isFinite(zoom)) {
                        zoom = 0;
                    } else if (zoom > 5) {
                        zoom = 5;
                    }
                    win.zoomLevel = zoom;

                    localStorage.editorZooming = zoom;
                },
                hotkey: 'Control+=',
                hotkeyLabel: 'Ctrl+='
            }, {
                label: window.languageJSON.common.zoomOut,
                icon: 'zoom-out',
                click: () => {
                    const win = nw.Window.get();
                    let zoom = win.zoomLevel - 0.5;
                    if (Number.isNaN(zoom) || !zoom || !Number.isFinite(zoom)) {
                        zoom = 0;
                    } else if (zoom < -3) {
                        zoom = -3;
                    }
                    win.zoomLevel = zoom;

                    localStorage.editorZooming = zoom;
                },
                hotkey: 'Control+-',
                hotkeyLabel: 'Ctrl+-'
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
                label: this.voc.exportDesktop,
                click: () => {
                    this.showExporter = true;
                    this.update();
                },
                icon: 'package'
            }, {
                label: this.voc.zipExport,
                click: this.zipExport,
                icon: 'upload-cloud'
            }, {
                label: this.voc.zipProject,
                click: this.zipProject
            }, {
                label: this.voc.openIncludeFolder,
                click: () => {
                    fs.ensureDir(path.join(global.projdir, '/include'))
                    .then(() => {
                        nw.Shell.openItem(path.join(global.projdir, '/include'));
                    });
                }
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.menu.startScreen,
                click: () => {
                    alertify.confirm(window.languageJSON.common.reallyexit, e => {
                        if (e) {
                            window.signals.trigger('resetAll');
                        }
                    });
                }
            }, {
                label: window.languageJSON.intro.latest,
                submenu: recentProjectsSubmenu
            }, {
                type: 'separator'
            }, {
                label: window.languageJSON.menu.settings,
                submenu: settingsSubmenu,
                icon: 'settings'
            }, {
                label: window.languageJSON.common.contribute,
                click: () => {
                    nw.Shell.openExternal('https://github.com/ct-js/ct-js');
                },
                icon: 'code'
            }, {
                label: window.languageJSON.common.donate,
                icon: 'heart',
                click: () => {
                    nw.Shell.openExternal('https://www.patreon.com/comigo');
                }
            }, {
                label: window.languageJSON.menu.troubleshooting,
                icon: 'alert-circle',
                submenu: troubleshootingSubmenu
            }, {
                label: window.languageJSON.common.ctsite,
                click: () => {
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
            try {
                window.languageJSON = i18n.loadLanguage(filename);
                localStorage.appLanguage = filename;
                window.signals.trigger('updateLocales');
                window.riot.update();
            } catch (e) {
                alertify.alert('Could not open a language file: ' + e);
            }
        };
        var {switchLanguage} = this;

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
                    click: () => {
                        switchLanguage(file);
                    }
                });
            });
            languageSubmenu.items.push({
                type: 'separator'
            });
            languageSubmenu.items.push({
                label: window.languageJSON.common.translateToYourLanguage,
                click: () => {
                    nw.Shell.openExternal('https://github.com/ct-js/ct-js/tree/develop/app/data/i18n');
                }
            });
        })
        .catch(e => {
            alertify.alert('Could not get i18n files: ' + e);
        });