export-panel.aDimmer
    .aModal.pad.flexfix
        .flexfix-header
            h2.nmt {voc.exportPanel}
        .flexfix-body
            h3(if="{log.length}")
                | {voc.log}
                .rem.a(onclick="{copyLog}").toright {vocGlob.copy}
            p.aPanel.pad.error(if="{!authoring.title}") {voc.projectTitleRequired}
            p.aPanel.pad.warning(if="{!authoring.appId}") {voc.appIdRequired}
            p.aPanel.pad.success(if="{authoring.appId && authoring.title && !log.length}") {voc.goodToGo}
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
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.working = false;
        this.log = [];

        global.currentProject.settings.export = global.currentProject.settings.export || {};
        this.projSettings = global.currentProject.settings;
        this.authoring = this.projSettings.authoring;

        // eslint-disable-next-line max-lines-per-function
        this.export = async () => {
            this.working = true;
            this.log = ['Exporting the web build…'];
            this.update();

            const runCtExport = require('./data/node_requires/exporter').exportCtProject;
            const {exportForDesktop} = require('./data/node_requires/exporter/desktopPackager');
            const {dirname} = require('path');

            try {
                const projectDir = global.projdir;
                const exportedPath = await runCtExport(global.currentProject, projectDir, true, true);
                const buildsPath = await exportForDesktop(
                    global.currentProject,
                    dirname(exportedPath),
                    logLine => {
                        this.log.push(logLine);
                        this.update();
                        this.refs.log.scroll({
                            top: this.refs.log.scrollHeight
                        });
                    }
                );
                alertify.success(`Success! Exported to ${buildsPath}`);
                this.working = false;
                this.update();
                nw.Shell.openItem(buildsPath);
            } catch (e) {
                this.working = false;
                this.log.push(e);
                this.update();
                alertify.error(e);
                throw e;
            }
        };
