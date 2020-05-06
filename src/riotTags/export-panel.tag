export-panel
    .dim
    .modal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            p {voc.firstrunnotice}
            fieldset
                label.checkbox
                    input(type="checkbox" checked="{global.currentProject.settings.export.linux}" onchange="{wire('global.currentProject.settings.export.linux')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#linux")
                    |   Linux
                label.checkbox(disabled="{process.platform === 'win32'}" title="{process.platform === 'win32' && voc.cannotBuildForMacOnWin}")
                    input(type="checkbox" checked="{global.currentProject.settings.export.mac}" onchange="{wire('global.currentProject.settings.export.mac')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#apple")
                    |   MacOS
                label.checkbox
                    input(type="checkbox" checked="{global.currentProject.settings.export.windows}" onchange="{wire('global.currentProject.settings.export.windows')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#windows")
                    |   Windows
            fieldset
                b {voc.launchMode}
                each key in ['maximized', 'fullscreen', 'windowed']
                    label.checkbox
                        input(type="radio" value=key checked=`{global.currentProject.settings.desktopMode === '${key}'}` onchange="{wire('global.currentProject.settings.desktopMode')}")
                        span=`{voc.launchModes.${key}}`
            p.warning(if="{global.currentProject.settings.export.windows && process.platform !== 'win32'}")
                svg.feather
                    use(xlink:href="data/icons.svg#alert-triangle")
                |
                |
                span {voc.windowsCrossBuildWarning}
                span(if="{process.platform === 'darwin'}") {voc.windowsCrossBuildMacOs}
            .spacer
            h3(if="{log.length}")
                | {voc.log}
                .rem.a(onclick="{copyLog}").toright {vocGlob.copy}
            pre(if="{log.length}")
                div(each="{text in log}") {text.toString()}
        .flexfix-footer
            .flexrow
                button(onclick="{close}") {voc.hide}
                button(onclick="{export}")
                    span.inlineblock.rotateccw(if="{working}")
                        svg.feather
                            use(xlink:href="data/icons.svg#refresh-ccw")
                    svg.feather(if="{!working}")
                        use(xlink:href="data/icons.svg#upload")
                    span(if="{working}")   {voc.working}
                    span(if="{!working}")   {voc.export}
    script.
        this.namespace = 'exportPanel';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.working = false;
        this.log = [];
        global.currentProject.settings.export = global.currentProject.settings.export || {};

        this.close = function () {
            this.parent.showExporter = false;
            this.parent.update();
        };
        this.export = async e => {
            if (this.working) {
                return;
            }
            try {
                const path = require('path'),
                      fs = require('fs-extra');

                this.log = [];
                this.working = true;
                this.update();

                const {getWritableDir} = require('./data/node_requires/platformUtils');
                const runCtExport = require('./data/node_requires/exporter');
                const writable = await getWritableDir(),
                      projectDir = global.projdir,
                      exportDir = path.join(writable, 'export'),
                      buildDir = path.join(writable, 'builds');

                this.log.push('Exporting the project…');
                this.update();
                await runCtExport(global.currentProject, projectDir);
                this.log.push('Adding desktop resources…');
                this.update();
                await fs.copy('./data/ct.release/desktopPack/', exportDir);

                // Create package.json with needed metadata
                this.log.push('Preparing build metadata…');
                this.update();
                const packageJson = fs.readJSONSync('./data/ct.release/desktopPack/package.json');
                const version = global.currentProject.settings.version.join('.') + global.currentProject.settings.versionPostfix;
                packageJson.version = version;
                if (global.currentProject.settings.title) {
                    packageJson.name = global.currentProject.settings.title;
                    packageJson.window.title = global.currentProject.settings.title;
                }
                const startingRoom = global.currentProject.rooms.find(room => room.uid === global.currentProject.startroom) || global.currentProject.rooms[0];
                packageJson.window.width = startingRoom.width;
                packageJson.window.height = startingRoom.height;
                packageJson.window.mode = global.currentProject.settings.desktopMode || 'maximized';
                await fs.outputJSON(path.join(exportDir, 'package.json'), packageJson);

                this.log.push('Baking icons…');
                this.update();
                const png2icons = require('png2icons'),
                      {getTextureOrig} = require('./data/node_requires/resources/textures');
                const iconPath = getTextureOrig(global.currentProject.settings.branding.icon || -1, true),
                      icon = await fs.readFile(iconPath);
                await fs.outputFile(path.join(exportDir, 'icon.icns'), png2icons.createICNS(
                    icon,
                    global.currentProject.settings.pixelatedrender? png2icons.BILINEAR : png2icons.HERMITE
                ));
                await fs.outputFile(path.join(exportDir, 'icon.ico'), png2icons.createICO(
                    icon,
                    global.currentProject.settings.antialias? png2icons.BILINEAR : png2icons.HERMITE,
                    0, true, true
                ));

                this.log.push('Ready to bake packages. Be patient!');
                this.update();
                const packager = require('electron-packager');
                const baseOptions = {
                    // Build parameters
                    dir: exportDir,
                    out: buildDir,
                    asar: true,
                    overwrite: true,
                    electronVersion: '8.2.2',
                    icon: path.join(exportDir, 'icon'),

                    // generic data
                    appCategoryType: 'public.app-category.games',

                    // Game-specific metadata
                    executableName: global.currentProject.settings.title || 'ct.js game',
                    appCopyright: global.currentProject.settings.author && `Copyright © ${global.currentProject.settings.author} ${(new Date()).getFullYear()}`,
                    win32metadata: global.currentProject.settings.author && {
                        CompanyName: global.currentProject.settings.author,
                        FileDescription: global.currentProject.settings.description || 'A cool game made in ct.js game editor'
                    }
                };

                // wtf and why do I need it? @see https://github.com/electron/electron-packager/issues/875
                process.noAsar = true;

                console.info('Messages "Packaging app for platform *" are not errors, this is how electron-packer works ¯\\_(ツ)_/¯');
                if (global.currentProject.settings.export.linux) {
                    this.log.push('Building for Linux…');
                    const paths = await packager(Object.assign({}, baseOptions, {
                        platform: 'linux',
                        arch: 'all'
                    }));
                    this.log.push(`Linux builds are ready at these paths:\n  ${paths.join('\n  ')}`);
                    this.update();
                }
                if (global.currentProject.settings.export.mac && process.platform !== 'win32') {
                    this.log.push('Building for MacOS…');
                    this.update();
                    const paths = await packager(Object.assign({}, baseOptions, {
                        platform: 'darwin',
                        arch: 'all'
                    }));
                    this.log.push(`Mac builds are ready at these paths:\n  ${paths.join('\n  ')}`);
                    this.update();
                }
                if (global.currentProject.settings.export.windows) {
                    this.log.push('Building for Windows…');
                    const paths = await packager(Object.assign({}, baseOptions, {
                        platform: 'win32',
                        arch: 'all'
                    }));
                    this.log.push(`Windows builds are ready at these paths:\n  ${paths.join('\n  ')}`);
                    this.update();
                }
                this.log.push('Success!');
                this.log.push(buildDir);
                alertify.success(`Success! Exported to ${buildDir}`);
                this.working = false;
                this.update();
                nw.Shell.openItem(buildDir);
            } catch (e) {
                this.log.push(e);
                this.working = false;
                this.update();
                alertify.error(e);
                throw e;
            }
        };

        this.copyLog = e => {
            nw.Clipboard.get().set(this.log.join('\n'), 'text');
        };