export-panel
    .dim
    .modal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            p {voc.firstrunnotice}
            fieldset
                label.checkbox
                    input(type="checkbox" checked="{currentProject.settings.export.linux}" onchange="{wire('window.currentProject.settings.export.linux')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#linux")
                    |   Linux
                label.checkbox
                    input(type="checkbox" checked="{currentProject.settings.export.mac}" onchange="{wire('window.currentProject.settings.export.mac')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#apple")
                    |   MacOS
                label.checkbox
                    input(type="checkbox" checked="{currentProject.settings.export.windows}" onchange="{wire('window.currentProject.settings.export.windows')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#windows")
                    |   Windows
            fieldset
                b {voc.launchMode}
                each key in ['maximized', 'fullscreen', 'windowed']
                    label.checkbox
                        input(type="radio" value=key checked=`{currentProject.settings.desktopMode === '${key}'}` onchange="{wire('window.currentProject.settings.desktopMode')}")
                        span=`{voc.launchModes.${key}}`
            p.warning(if="{currentProject.settings.export.windows && process.platform !== 'win32'}")
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
        currentProject.settings.export = currentProject.settings.export || {};

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
                      projectDir = sessionStorage.projdir,
                      exportDir = path.join(writable, 'export'),
                      buildDir = path.join(writable, 'builds');

                this.log.push('Exporting the project…');
                this.update();
                await runCtExport(currentProject, projectDir);
                this.log.push('Adding desktop resources…');
                this.update();
                await fs.copy('./data/ct.release/desktopPack/', exportDir);

                // Create package.json with needed metadata
                this.log.push('Preparing build metadata…');
                this.update();
                const packageJson = fs.readJSONSync('./data/ct.release/desktopPack/package.json');
                const version = currentProject.settings.version.join('.') + currentProject.settings.versionPostfix;
                packageJson.version = version;
                if (currentProject.settings.title) {
                    packageJson.name = currentProject.settings.title;
                    packageJson.window.title = currentProject.settings.title;
                }
                const startingRoom = currentProject.rooms.find(room => room.uid === currentProject.startroom) || currentProject.rooms[0];
                packageJson.window.width = startingRoom.width;
                packageJson.window.height = startingRoom.height;
                packageJson.window.mode = currentProject.settings.desktopMode || 'maximized';
                await fs.outputJSON(path.join(exportDir, 'package.json'), packageJson);

                this.log.push('Baking icons…');
                this.update();
                const png2icons = require('png2icons'),
                      {getTextureOrig} = require('./data/node_requires/resources/textures');
                const iconPath = getTextureOrig(currentProject.settings.branding.icon || -1, true),
                      icon = await fs.readFile(iconPath);
                await fs.outputFile(path.join(exportDir, 'icon.icns'), png2icons.createICNS(
                    icon,
                    currentProject.settings.pixelatedrender? png2icons.BILINEAR : png2icons.HERMITE
                ));
                await fs.outputFile(path.join(exportDir, 'icon.ico'), png2icons.createICO(
                    icon,
                    currentProject.settings.antialias? png2icons.BILINEAR : png2icons.HERMITE,
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
                    electronVersion: process.versions.electron,
                    icon: path.join(exportDir, 'icon'),

                    // generic data
                    appCategoryType: 'public.app-category.games',

                    // Game-specific metadata
                    executableName: currentProject.settings.title || 'ct.js game',
                    appCopyright: currentProject.settings.author && `Copyright © ${currentProject.settings.author} ${(new Date()).getFullYear()}`,
                    win32metadata: currentProject.settings.author && {
                        CompanyName: currentProject.settings.author,
                        FileDescription: currentProject.settings.description || 'A cool game made in ct.js game editor'
                    }
                };

                // wtf and why do I need it? @see https://github.com/electron/electron-packager/issues/875
                process.noAsar = true;

                console.info('Messages "Packaging app for platform *" are not errors, this is how electron-packer works ¯\\_(ツ)_/¯');
                if (currentProject.settings.export.linux) {
                    this.log.push('Building for Linux…');
                    const paths = await packager(Object.assign({}, baseOptions, {
                        platform: 'linux',
                        arch: 'all'
                    }));
                    this.log.push(`Linux builds are ready at these paths:\n  ${paths.join('\n  ')}`);
                    this.update();
                }
                if (currentProject.settings.export.mac) {
                    this.log.push('Building for MacOS…');
                    this.update();
                    const paths = await packager(Object.assign({}, baseOptions, {
                        platform: 'darwin',
                        arch: 'all'
                    }));
                    this.log.push(`Mac builds are ready at these paths:\n  ${paths.join('\n  ')}`);
                    this.update();
                }
                if (currentProject.settings.export.windows) {
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
                const {shell} = require('electron');
                shell.openItem(buildDir);
            } catch (e) {
                this.log.push(e);
                this.working = false;
                this.update();
                alertify.error(e);
                throw e;
            }
        };

        this.copyLog = e => {
            const {clipboard} = require('electron');
            clipboard.writeText(this.log.join('\n'));
        };