export-mobile-panel.aDimmer
    .aModal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            p
                svg.feather.warning
                    use(xlink:href="#alert-triangle")
                |
                | {voc.requiresInternetNotice}

            .aPanel.pad.error(if="{!projSettings.authoring.title}")
                svg.feather
                    use(xlink:href="#alert-circle")
                |
                | {voc.projectTitleRequired}
            .aSpacer(if="{!projSettings.authoring.title}")
            .aPanel.pad.error(if="{!projSettings.authoring.appId}")
                svg.feather
                    use(xlink:href="#alert-circle")
                |
                | {voc.appIdRequired}
            .aSpacer(if="{!projSettings.authoring.appId}")
            .aPanel.pad.warning(if="{!nodeEnabled}")
                p.nmt {voc.nodeJsNotFound}
                p {voc.nodeJsIcons}
                button(onclick="{openNodeJsDownloads}") {voc.nodeJsDownloadPage}
            .aSpacer(if="{!nodeEnabled}")
            .aPanel.pad.error(if="{noAndroidSdkFound}")
                p.nmt
                    svg.feather
                        use(xlink:href="#alert-circle")
                    |
                    | {voc.noAndroidSdkFound}
                button(onclick="{gotoAndroidStudio}")
                    svg.feather
                        use(xlink:href="#external-link")
                    span {voc.downloadAndroidStudio}
                p.nmb {voc.envVarNotice}
            .aSpacer(if="{noAndroidSdkFound}")

            .aPanel.pad.error(if="{noJdkFound}")
                p.nmt
                    svg.feather
                        use(xlink:href="#alert-circle")
                    |
                    | {voc.noJdkFound}
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

        this.nodeEnabled = require('./data/node_requires/platformUtils').isNodeInstalled;
        this.openNodeJsDownloads = () => {
            nw.Shell.openExternal('https://nodejs.org/en/download/');
        };
        this.on('update', () => {
            this.nodeEnabled = require('./data/node_requires/platformUtils').isNodeInstalled;
            // eslint-disable-next-line no-process-env
            this.noAndroidSdkFound = !process.env.ANDROID_SDK_ROOT;
            // eslint-disable-next-line no-process-env
            this.noJdkFound = !process.env.JAVA_HOME;
            if (!this.noJdkFound) {
                // eslint-disable-next-line no-process-env
                if (process.env.JAVA_HOME.indexOf('jdk-17') === -1) {
                    this.noJdkFound = true;
                }
            }
        });

        this.projSettings = global.currentProject.settings;

        const {exportCtProject} = require('./data/node_requires/exporter');
        const {dirname} = require('path');
        this.export = async () => {
            if (this.working) {
                return;
            }
            this.log = ['Exporting the web build…'];
            this.working = true;
            const onProgress = progress => {
                this.log.push(progress);
                this.update();
            };
            try {
                const projectDir = global.projdir;
                const exportedPath = await exportCtProject(global.currentProject, projectDir, true, false);
                const {exportMobile} = require('./data/node_requires/exporter/mobilePackager');
                const apkFolder = await exportMobile(
                    global.currentProject,
                    dirname(exportedPath),
                    onProgress
                );
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
            nw.Shell.openExternal('https://www.oracle.com/java/technologies/downloads/#java17');
        };

