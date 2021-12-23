app-view.flexcol
    nav.nogrow.flexrow(if="{global.currentProject}")
        ul#app.aNav.tabs
            li.it30#ctlogo(onclick="{changeTab('menu')}" title="{voc.ctIDE}" class="{active: tab === 'menu'}")
                svg.feather.nmr
                    use(xlink:href="#menu")
            li.it30(onclick="{changeTab('patrons')}" title="{voc.patrons}" class="{active: tab === 'patrons'}")
                svg.feather
                    use(xlink:href="#heart")
            li.it30.nbr(onclick="{saveProject}" title="{vocGlob.save} (Control+S)" data-hotkey="Control+s")
                svg.feather
                    use(xlink:href="#save")

        ul#mainnav.aNav.tabs
            li.nbl.it30(onclick="{runProject}" class="{active: tab === 'debug'}" title="{voc.launch} {voc.launchHotkeys}" data-hotkey="F5")
                svg.feather.rotateccw(show="{exportingProject}")
                    use(xlink:href="#refresh-ccw")
                svg.feather(hide="{exportingProject}")
                    use(xlink:href="#play")
                span(if="{tab !== 'debug'}") {voc.launch}
                span(if="{tab === 'debug'}") {voc.restart}
            li(onclick="{changeTab('project')}" class="{active: tab === 'project'}" data-hotkey="Control+1" title="Control+1")
                svg.feather
                    use(xlink:href="#sliders")
                span {voc.project}
            li(onclick="{changeTab('textures')}" class="{active: tab === 'textures'}" data-hotkey="Control+2" title="Control+2")
                svg.feather
                    use(xlink:href="#texture")
                span {voc.texture}
            li(onclick="{changeTab('ui')}" class="{active: tab === 'ui'}" data-hotkey="Control+3" title="Control+3")
                svg.feather
                    use(xlink:href="#ui")
                span {voc.ui}
            li(onclick="{changeTab('fx')}" class="{active: tab === 'fx'}" data-hotkey="Control+4" title="Control+4")
                svg.feather
                    use(xlink:href="#sparkles")
                span {voc.fx}
            li(onclick="{changeTab('sounds')}" class="{active: tab === 'sounds'}" data-hotkey="Control+5" title="Control+5")
                svg.feather
                    use(xlink:href="#headphones")
                span {voc.sounds}
            li(onclick="{changeTab('types')}" class="{active: tab === 'types'}" data-hotkey="Control+6" title="Control+6")
                svg.feather
                    use(xlink:href="#type")
                span {voc.types}
            li(onclick="{changeTab('rooms')}" class="{active: tab === 'rooms'}" data-hotkey="Control+7" title="Control+7")
                svg.feather
                    use(xlink:href="#room")
                span {voc.rooms}
    div.flexitem.relative(if="{global.currentProject}")
        main-menu(show="{tab === 'menu'}")
        debugger-screen-embedded(if="{tab === 'debug'}" params="{debugParams}" data-hotkey-scope="play" ref="debugger")
        project-settings(show="{tab === 'project'}" data-hotkey-scope="project")
        textures-panel(show="{tab === 'textures'}" data-hotkey-scope="textures")
        ui-panel(show="{tab === 'ui'}" data-hotkey-scope="ui")
        fx-panel(show="{tab === 'fx'}" data-hotkey-scope="fx")
        sounds-panel(show="{tab === 'sounds'}" data-hotkey-scope="sounds")
        types-panel(show="{tab === 'types'}" data-hotkey-scope="types")
        rooms-panel(show="{tab === 'rooms'}" data-hotkey-scope="rooms")
        patreon-screen(if="{tab === 'patrons'}" data-hotkey-scope="patrons")
    new-project-onboarding(if="{sessionStorage.showOnboarding && localStorage.showOnboarding !== 'off'}")
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
        };
        this.changeTab(this.tab)();

        const assetListener = asset => {
            const [assetType] = asset.split('/');
            this.changeTab(assetType)();
            this.update();
        };
        window.orders.on('openAsset', assetListener);
        this.on('unmount', () => {
            window.orders.off('openAsset', assetListener);
        });

        this.saveProject = async () => {
            try {
                const fs = require('fs-extra');
                const YAML = require('js-yaml');
                const glob = require('./data/node_requires/glob');
                const projectYAML = YAML.dump(global.currentProject);
                await fs.outputFile(global.projdir + '.ict', projectYAML);
                this.saveRecoveryDebounce();
                fs.remove(global.projdir + '.ict.recovery')
                .catch(console.error);
                glob.modified = false;
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
            document.body.style.cursor = 'progress';
            this.exportingProject = true;
            this.update();
            const runCtExport = require('./data/node_requires/exporter');
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
                window.alertify.error(e);
                console.error(e);
            })
            .finally(() => {
                document.body.style.cursor = '';
                this.exportingProject = false;
                this.update();
            });
        };
        this.runProjectAlt = () => {
            const runCtExport = require('./data/node_requires/exporter');
            runCtExport(global.currentProject, global.projdir)
            .then(() => {
                nw.Shell.openExternal(`http://localhost:${fileServer.address().port}/`);
            });
        };
        window.hotkeys.on('Alt+F5', this.runProjectAlt);
        this.on('unmount', () => {
            window.hotkeys.off('Alt+F5', this.runProjectAlt);
        });

        this.toggleFullscreen = function toggleFullscreen() {
            nw.Window.get().toggleFullscreen();
        };
        window.hotkeys.on('F11', this.toggleFullscreen);
        this.on('unmount', () => {
            window.hotkeys.off('F11', this.toggleFullscreen);
        });
