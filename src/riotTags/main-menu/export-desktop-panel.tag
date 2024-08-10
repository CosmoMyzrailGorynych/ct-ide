export-desktop-panel.aDimmer
    .aModal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            .aSpacer(if="{!authoring.title}")
            .aPanel.pad.error(if="{!authoring.title}") {voc.projectTitleRequired}
            .aSpacer(if="{!authoring.description}")
            .aPanel.pad.warning(if="{!authoring.appId}") {voc.appIdRequired}
            .aSpacer(if="{authoring.appId && authoring.title && !log.length}")
            .aPanel.pad.success(if="{authoring.appId && authoring.title && !log.length}") {voc.goodToGo}
            .aSpacer
            h3(if="{log.length}")
                | {voc.log}
                .rem.a(onclick="{copyLog}").toright {vocGlob.copy}
            pre.selectable(if="{log.length}" ref="log")
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
                    span(if="{working}")   {voc.working}
                    span(if="{!working}")   {voc.export}
    script.
        this.namespace = 'exportPanel';
        this.mixin(require('src/lib/riotMixins/voc').default);
        this.mixin(require('src/lib/riotMixins/wire').default);
        this.working = false;
        this.log = [];

        window.currentProject.settings.export = window.currentProject.settings.export || {};
        this.projSettings = window.currentProject.settings;
        this.authoring = this.projSettings.authoring;

        const progressListener = e => {
            console.log(e, e.detail);
            const logLine = e.detail;
            this.log.push(logLine);
            this.update();
            this.refs.log.scroll({
                top: this.refs.log.scrollHeight
            });
        };
        Neutralino.events.on('desktopBuildProgress', progressListener);
        this.on('unmount', () => {
            Neutralino.events.off('desktopBuildProgress', progressListener);
        });

        // eslint-disable-next-line max-lines-per-function
        this.export = async () => {
            this.working = true;
            this.log = ['Exporting the web build…'];
            this.update();

            const runCtExport = require('src/lib/exporter').exportCtProject;
            const {exportForDesktop} = require('src/lib/exporter/packagers/desktop');
            const {dirname} = require('path');

            try {
                const projectDir = window.projdir;
                const exportedPath = await runCtExport(window.currentProject, projectDir, true, true);
                const buildsPath = await exportForDesktop(
                    window.currentProject,
                    dirname(exportedPath)
                );
                alertify.success(`Success! Exported to ${buildsPath}`);
                this.working = false;
                this.update();
            } catch (e) {
                this.working = false;
                this.log.push(e);
                this.update();
                alertify.error(e);
                throw e;
            }
        };
