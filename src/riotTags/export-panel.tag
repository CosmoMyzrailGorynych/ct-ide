export-panel
    .dim
    .modal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            p {voc.firstrunnotice}
            .fifty.npl
                label
                    i.icon-windows
                    input(type="checkbox" checked="{currentProject.settings.export.windows64}" onchange="{wire('window.currentProject.settings.export.windows64')}")
                    |   Windows x64
                label
                    i.icon-windows
                    input(type="checkbox" checked="{currentProject.settings.export.windows32}" onchange="{wire('window.currentProject.settings.export.windows32')}")
                    |   Windows x32
            .fifty.npr
                label
                    i.icon-linux
                    input(type="checkbox" checked="{currentProject.settings.export.linux64}" onchange="{wire('window.currentProject.settings.export.linux64')}")
                    |   Linux x64
                label
                    i.icon-linux
                    input(type="checkbox" checked="{currentProject.settings.export.linux32}" onchange="{wire('window.currentProject.settings.export.linux32')}")
                    |   Linux x32
            .clear
            .fifty.npl.npt
                label
                    i.icon-apple
                    input(type="checkbox" checked="{currentProject.settings.export.mac64}" onchange="{wire('window.currentProject.settings.export.mac64')}")
                    |   Mac x64
            .clear
            p 
                label
                    input(type="checkbox" checked="{currentProject.settings.export.debug}" onchange="{wire('window.currentProject.settings.export.debug')}")
                    |   {voc.debug}
            h3(if="{log.length}")
                | {voc.log}
                .rem.a(onclick="{copyLog}").toright {vocGlob.copy}
            pre(if="{log.length}")
                div(each="{text in log}") {text}
        .flexfix-footer
            .flexrow
                button(onclick="{close}") {voc.hide}
                button(onclick="{export}") 
                    span.inlineblock.rotateccw(if="{working}")
                        i.icon-refresh-ccw
                    i.icon-upload(if="{!working}")
                    span(if="{working}")   {voc.working}
                    span(if="{!working}")   {voc.export}
    script.
        this.namespace = 'exportPanel';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.working = false;
        this.log = [];

        const path = require('path'),
              fs = require('fs-extra');
        const exec = path.dirname(process.execPath).replace(/\\/g,'/');

        this.close = function () {
            this.parent.showExporter = false;
            this.parent.update();
        };
        this.export = e => {
            if (this.working) {
                return;
            }
            this.log = [];
            this.working = true;
            this.update();
            const version = currentProject.settings.version.join('.') + currentProject.settings.versionPostfix;
            window.runCtProject()
            .then(() => fs.copy('./data/ct.release/nwPack/', `${exec}/export/`))
            .then(() => {
                const json = fs.readJSONSync('./data/ct.release/nwPack/package.json');
                json.version = version;
                if (currentProject.settings.title) {
                    json.name = currentProject.settings.title;
                    json.window.title = currentProject.settings.title;
                }
                const startingRoom = currentProject.rooms.find(room => room.uid === currentProject.startroom) || currentProject.rooms[0];
                json.window.width = startingRoom.width;
                json.window.height = startingRoom.height;
                return fs.outputJSON(`${exec}/export/package.json`, json);
            })
            .then(() => {
                const NwBuilder = require('nw-builder');
                const platforms = [];
                if (currentProject.settings.export.mac64) {
                    platforms.push('osx64');
                }
                if (currentProject.settings.export.windows64) {
                    platforms.push('win64');
                }
                if (currentProject.settings.export.windows32) {
                    platforms.push('win32');
                }
                if (currentProject.settings.export.linux64) {
                    platforms.push('linux64');
                }
                if (currentProject.settings.export.linux32) {
                    platforms.push('linux32');
                }
                const options = {
                    files: `${exec}/export/**/**`, // use the glob format
                    version: process.versions.nw,
                    platforms,
                    flavor: (currentProject.settings.export.debug? 'sdk' : 'normal'),
                    appName: currentProject.settings.title || 'ct.js Game',
                    buildDir: './exportDesktop',
                    buildType: 'versioned',
                    macIcns: './ct.ide.icns'
                };
                if (process.platform === 'win32') {
                    options.winIco = './ct.ide.ico';
                    if (currentProject.settings.author) {
                        options.winVersionString = {
                            CompanyName: currentProject.settings.author,
                            FileDescription: currentProject.settings.title || 'ct.js Game',
                            ProductName: currentProject.settings.title || 'ct.js Game',
                            LegalCopyright: `Copyright ${(new Date()).getFullYear()}`,
                        }
                    }
                }
                this.builder = new NwBuilder(options);
                this.builder.on('log', log => {
                    this.log.push(log);
                    this.update();
                })
                .on('error', err => {
                    console.error(err);
                    this.log.push(err);
                    this.update();
                });
                return this.builder.build();
            })
            .then(() => {
                this.log.push('Success! Exported to:');
                this.log.push(path.resolve('./exportDesktop/'));
                this.working = false;
                nw.Shell.showItemInFolder(path.resolve(`./exportDesktop/${currentProject.settings.title || 'ctjs-game'} - v${version}`));
                this.update();
            })
            .catch(error => {
                this.log.push(error);
                alertyfy.error(error);
                console.error(error);
                this.working = false;
                this.update();
            });
        };

        this.copyLog = e => {
            nw.Clipboard.get().set(this.log.join('\n'));
        };