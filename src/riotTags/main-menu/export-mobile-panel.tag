export-mobile-panel.aDimmer
    .aModal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            p(if="{!projSettings.authoring.title}")
                svg.feather.error
                    use(xlink:href="#alert-circle")
                |
                | {voc.projectTitleRequired}
            p(if="{!projSettings.authoring.appId}")
                svg.feather.error
                    use(xlink:href="#alert-circle")
                |
                | {voc.appIdRequired}
            p
                svg.feather.warning
                    use(xlink:href="#alert-triangle")
                |
                | {voc.requiresInternetNotice}

            .aPanel.pad.error(if="{noAndroidSdkFound}")
                p.nmt {voc.noAndroidSdkFound}
                button(onclick="{gotoAndroidStudio}")
                    svg.feather
                        use(xlink:href="#external-link")
                    span {voc.downloadAndroidStudio}
                p.nmb {voc.envVarNotice}
            .aSpacer(if="{noAndroidSdkFound}")

            .aPanel.pad.error(if="{noJdkFound}")
                p.nmt {voc.noJdkFound}
                button(onclick="{gotoJavaDownloads}")
                    svg.feather
                        use(xlink:href="#external-link")
                    span {voc.downloadJDK}
                p.nmb {voc.envVarNotice}
            .aSpacer(if="{noJdkFound}")

            h3.nmt(if="{log.length}")
                | {voc.log}
                .rem.a(onclick="{copyLog}").toright {vocGlob.copy}
            pre.selectable(if="{log.length}")
                div(each="{text in log}") {text.toString()}
        .flexfix-footer
            .flexrow
                button(onclick="{opts.onclose}") {voc.hide}
                button(onclick="{export}").nmr
                    span.inlineblock.rotateccw(if="{working}")
                        svg.feather
                            use(xlink:href="#refresh-ccw")
                    svg.feather(if="{!working}")
                        use(xlink:href="#upload")
                    |
                    span(if="{working}") {voc.working}
                    span(if="{!working}") {voc.export}
    script.
        this.namespace = 'exportPanel';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.working = false;
        this.log = [];

        this.on('update', () => {
            // eslint-disable-next-line no-process-env
            this.noAndroidSdkFound = !process.env.ANDROID_SDK_ROOT;
            // eslint-disable-next-line no-process-env
            this.noJdkFound = !process.env.JAVA_HOME;
            if (!this.noJdkFound) {
                // eslint-disable-next-line no-process-env
                if (process.env.JAVA_HOME.indexOf('jdk-11') === -1) {
                    this.noJdkFound = true;
                }
            }
        });

        global.currentProject.settings.export = global.currentProject.settings.export || {};
        const projSettings = global.currentProject.settings;
        this.projSettings = global.currentProject.settings;

        // @see https://cordova.apache.org/docs/en/latest/config_ref/images.html
        const androidIcons = {
            // ldpi: 36,
            mdpi: 48,
            hdpi: 72,
            xhdpi: 96,
            xxhdpi: 144,
            xxxhdpi: 192
        };
        // Pairs of total canvas side length and suggested icon size
        const androidUniversalIcons = {
            // ldpi: [54, 36],
            mdpi: [108, 72],
            hdpi: [162, 110],
            xhdpi: [216, 144],
            xxhdpi: [324, 220],
            xxxhdpi: [432, 294]
        };
        // Sizes for portrait mode; landscape modes are simply rotated
        const androidSplashScreens = {
            mdpi: [320, 480],
            hdpi: [480, 800],
            xhdpi: [720, 1280],
            xxhdpi: [960, 1600],
            xxxhdpi: [1280, 1920]
        };

        // eslint-disable-next-line max-lines-per-function
        this.export = async () => {
            if (this.working) {
                return;
            }
            this.log = [];
            this.working = true;
            this.update();
            try {
                const path = require('path'),
                      fs = require('fs-extra');
                const execa = require('execa');
                const {getBuildDir, getExportDir} = require('./data/node_requires/platformUtils');
                const runCtExport = require('./data/node_requires/exporter').exportCtProject;

                const appId = projSettings.authoring.appId || 'rocks.ctjs.defaultpackageid';
                const version = projSettings.authoring.version.join('.') + projSettings.authoring.versionPostfix;

                const projectDir = global.projdir,
                      exportDir = await getExportDir(),
                      buildDir = await getBuildDir();
                const capacitorProjectPath = path.join(
                    buildDir,
                    `${projSettings.authoring.title || 'mobileBuild'}-android`
                );
                const execaConfig = {
                    preferLocal: true,
                    localDir: path.join(process.cwd(), 'node_modules/@capacitor/cli/bin/'),
                    cwd: capacitorProjectPath
                };
                const execaNpmConfig = {
                    ...execaConfig,
                    localDir: path.join(process.cwd(), 'node_modules/npm/bin/')
                };

                this.log.push('Exporting the ct.js project…');
                this.update();
                await runCtExport(global.currentProject, projectDir, true);

                this.log.push('Checking for an existing Capacitor project…');
                this.update();

                const existingProject = await fs.pathExists(path.join(capacitorProjectPath, 'capacitor.config.json'));
                if (existingProject) {
                    this.log.push('Discovered an existing Capacitor project.');
                } else {
                    this.log.push('No existing projects found. Will create one.');
                }
                this.update();

                this.log.push('Preparing build directories…');
                this.update();
                const webAppPath = path.join(capacitorProjectPath, 'web');
                await fs.remove(webAppPath);
                await fs.copy(exportDir, webAppPath);

                if (!existingProject) {
                    this.log.push('Creating Capacitor project…');
                    this.update();
                    this.log.push((await execa('npm', [
                        'init',
                        '-y'
                    ], execaNpmConfig)).stdout);
                    this.log.push((await execa('npm', [
                        'install',
                        '@capacitor/core',
                        '@capacitor/cli',
                        '@capacitor/android',
                        '--save'
                    ], execaNpmConfig)).stdout);
                    this.log.push((await execa('capacitor', [
                        'init',
                        projSettings.authoring.title || 'Ct.js game',
                        appId,
                        '--web-dir',
                        webAppPath
                    ], execaConfig)).stdout);
                    this.log.push('Adding Android platform…');
                    this.update();
                    this.log.push((await execa('capacitor', [
                        'add',
                        'android'
                    ], execaConfig)).stdout);
                }

                this.log.push('Configuring the Capacitor project…');
                this.update();
                const {CapacitorProject} = require('@capacitor/project');
                const project = new CapacitorProject({
                    android: {
                        path: path.join(capacitorProjectPath, 'android')
                    }
                });
                await project.load();
                await project.android.setPackageName(appId);
                await project.android.setVersionName(version);
                await project.android.getAndroidManifest().setAttrs('manifest/application/activity', {
                    'android:screenOrientation': projSettings.rendering.mobileScreenOrientation
                });
                await project.commit();

                this.log.push('Baking icons and splash screens…');
                this.update();
                const {getDOMImage} = require('./data/node_requires/resources/textures');
                const iconsSplashesPromises = [];
                const {imageCover, imageContain, imagePlaceInRect, imageRound, outputCanvasToFile} =
                    require('./data/node_requires/utils/imageUtils');
                const projIconImage = await getDOMImage(projSettings.branding.icon || -1, 'ct_ide.png');
                for (const name in androidIcons) {
                    const icon = imageContain(
                        projIconImage,
                        androidIcons[name],
                        androidIcons[name],
                        projSettings.branding.forceSmoothIcons
                    );
                    // "Universal outer", "Universal inner"
                    const [uo, ui] = androidUniversalIcons[name];
                    const universalIcon = imagePlaceInRect(
                        projIconImage,
                        uo, uo, ui, ui,
                        projSettings.branding.forceSmoothIcons
                    );
                    const roundIcon = imageRound(icon);
                    iconsSplashesPromises.push(outputCanvasToFile(
                        icon,
                        path.join(capacitorProjectPath, 'android/app/src/main/res', `mipmap-${name}`, 'ic_launcher.png')
                    ));
                    iconsSplashesPromises.push(outputCanvasToFile(
                        universalIcon,
                        path.join(capacitorProjectPath, 'android/app/src/main/res', `mipmap-${name}`, 'ic_launcher_foreground.png')
                    ));
                    iconsSplashesPromises.push(outputCanvasToFile(
                        roundIcon,
                        path.join(capacitorProjectPath, 'android/app/src/main/res', `mipmap-${name}`, 'ic_launcher_round.png')
                    ));
                }
                const projSplashImage = await getDOMImage(projSettings.branding.splashScreen || -1, 'data/img/defaultSplashScreen.png');
                for (const name in androidSplashScreens) {
                    const portrait = imageCover(
                        projSplashImage,
                        androidSplashScreens[name][0],
                        androidSplashScreens[name][1],
                        projSettings.branding.forceSmoothSplashScreen
                    );
                    const landscape = imageCover(
                        projSplashImage,
                        androidSplashScreens[name][1],
                        androidSplashScreens[name][0],
                        projSettings.branding.forceSmoothSplashScreen
                    );
                    iconsSplashesPromises.push(outputCanvasToFile(
                        portrait,
                        path.join(capacitorProjectPath, 'android/app/src/main/res', `drawable-port-${name}`, 'splash.png')
                    ));
                    iconsSplashesPromises.push(outputCanvasToFile(
                        landscape,
                        path.join(capacitorProjectPath, 'android/app/src/main/res', `drawable-land-${name}`, 'splash.png')
                    ));
                }
                const miniSplash = imageCover(projSplashImage, 480, 320);
                iconsSplashesPromises.push(outputCanvasToFile(
                    miniSplash,
                    path.join(capacitorProjectPath, 'android/app/src/main/res/drawable/splash.png')
                ));
                await Promise.all(iconsSplashesPromises);

                this.log.push('Fetching available emulator devices…');
                this.update();
                const [, , device] = (await execa('capacitor', [
                    'run',
                    '--list',
                    'android'
                ], execaConfig)).stdout.split('\n')[2].split(/ {2,}/);
                if (!device) {
                    throw new Error('No available devices found! You will need to add one to your Android Studio > Android Virtual Device Manager.');
                }
                this.log.push(`Will use ${device}.`);
                this.update();

                this.log.push('Baking APK…');
                this.update();
                this.log.push((await execa('capacitor', [
                    'run',
                    '--target',
                    device,
                    'android'
                ], execaConfig)).stdout);

                this.log.push('Success! Emulator launched. APK files are available at:');
                const apkFolder = path.join(capacitorProjectPath, 'android/app/build/outputs/apk');
                this.log.push(apkFolder);
                alertify.success(`Success! APK is at ${apkFolder}.`);

                this.working = false;
                this.update();
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

        this.gotoAndroidStudio = () => {
            nw.Shell.openExternal('https://developer.android.com/studio/');
        };
        this.gotoJavaDownloads = () => {
            nw.Shell.openExternal('https://www.oracle.com/java/technologies/downloads/');
        };

