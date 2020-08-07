export-panel
    .dim
    .modal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            p {voc.firstrunnotice}
            fieldset
                label.checkbox
                    input(type="checkbox" checked="{projSettings.export.linux}" onchange="{wire('this.projSettings.export.linux')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#linux")
                    |   Linux
                label.checkbox(disabled="{process.platform === 'win32'}" title="{process.platform === 'win32' && voc.cannotBuildForMacOnWin}")
                    input(type="checkbox" checked="{projSettings.export.mac}" onchange="{wire('this.projSettings.export.mac')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#apple")
                    |   MacOS
                label.checkbox
                    input(type="checkbox" checked="{projSettings.export.windows}" onchange="{wire('this.projSettings.export.windows')}")
                    svg.icon
                        use(xlink:href="data/icons.svg#windows")
                    |   Windows
            p.warning(if="{projSettings.export.windows && process.platform !== 'win32'}")
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
                button(onclick="{closeExporter}") {voc.hide}
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
        const projSettings = global.currentProject.settings;
        this.projSettings = global.currentProject.settings;


        this.closeExporter = function closeExporter() {
            this.parent.showExporter = false;
            this.parent.update();
        };
        const bakeIcons = async exportDir => {
            const path = require('path'),
                  fs = require('fs-extra');

            const png2icons = require('png2icons'),
                  {getTextureOrig} = require('./data/node_requires/resources/textures');
            const iconPath = getTextureOrig(projSettings.branding.icon || -1, true),
                  icon = await fs.readFile(iconPath);
            await fs.outputFile(path.join(exportDir, 'icon.icns'), png2icons.createICNS(
                icon,
                projSettings.rendering.pixelatedrender ? png2icons.BILINEAR : png2icons.HERMITE
            ));
            await fs.outputFile(path.join(exportDir, 'icon.ico'), png2icons.createICO(
                icon,
                projSettings.rendering.antialias ? png2icons.BILINEAR : png2icons.HERMITE,
                0, true, true
            ));
        };
        // eslint-disable-next-line max-lines-per-function
        this.export = async () => {
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
                const version = projSettings.authoring.version.join('.') + projSettings.authoring.versionPostfix;
                packageJson.version = version;
                if (projSettings.authoring.title) {
                    packageJson.name = projSettings.authoring.title;
                    packageJson.window.title = projSettings.authoring.title;
                }
                const startingRoom = global.currentProject.rooms.find(room =>
                    room.uid === global.currentProject.startroom) || global.currentProject.rooms[0];
                packageJson.window.width = startingRoom.width;
                packageJson.window.height = startingRoom.height;
                packageJson.window.mode = projSettings.rendering.desktopMode || 'maximized';
                await fs.outputJSON(path.join(exportDir, 'package.json'), packageJson);

                this.log.push('Baking icons…');
                this.update();
                await bakeIcons(exportDir);
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
                    executableName: projSettings.authoring.title || 'ct.js game',
                    appCopyright: projSettings.authoring.author && `Copyright © ${projSettings.authoring.author} ${(new Date()).getFullYear()}`,
                    win32metadata: projSettings.authoring.author && {
                        CompanyName: projSettings.authoring.author,
                        FileDescription: projSettings.authoring.description || 'A cool game made in ct.js game editor'
                    }
                };

                // wtf and why do I need it? @see https://github.com/electron/electron-packager/issues/875
                process.noAsar = true;

                // eslint-disable-next-line  no-console
                console.info('Messages "Packaging app for platform *" are not errors, this is how electron-packer works ¯\\_(ツ)_/¯');

                const platformMap = {
                    linux: 'linux',
                    mac: 'darwin',
                    windows: 'win32'
                };
                for (const settingKey in platformMap) {
                    if (!projSettings.export[settingKey]) {
                        continue;
                    }
                    const platform = platformMap[settingKey];
                    this.log.push(`Building for ${settingKey}…`);
                    // eslint-disable-next-line no-await-in-loop
                    const paths = await packager(Object.assign({}, baseOptions, {
                        platform,
                        arch: 'all'
                    }));
                    this.log.push(`${settingKey} builds are ready at these paths:\n  ${paths.join('\n  ')}`);
                    this.update();
                }

                this.log.push('Success! Exported to:');
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

        this.copyLog = () => {
            nw.Clipboard.get().set(this.log.join('\n'), 'text');
        };