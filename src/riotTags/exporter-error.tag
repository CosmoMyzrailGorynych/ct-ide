exporter-error.aDimmer.pointer.pad.fadein(onclick="{tryClose}")
    button.aDimmer-aCloseButton.forcebackground(
        title="{vocGlob.close}"
        onclick="{opts.onclose}"
    )
        svg.feather
            use(xlink:href="#x")
    .aModal.pad.npb.cursordefault.appear.flexfix
        .flexfix-body
            h3.npt.nmt
                span {voc.exporterErrorHeader}
            p
                svg.feather.act(if="{error.richInfo?.resourceType}")
                    use(xlink:href="#{resourceToIconMap[error.richInfo.resourceType]}")
                |
                |
                b(if="{error.richInfo?.resourceType}") {voc.errorSource.replace('$1', vocGlob.assetTypes[error.richInfo.resourceType + 's'][0]).replace('$2', error.richInfo.resourceName)}:
                |
                |
                span.monospace {error.message}
            // Propose solutions for generic mistakes
            p(if="{error.richInfo?.clue && error.richInfo.clue !== 'unknown'}")
                svg.feather.act
                    use(xlink:href="#help-circle")
                |
                |
                | {voc.clueSolutions[error.richInfo.clue]}
            code(if="{error.richInfo?.problematicCode}")
                pre {error.richInfo.problematicCode}
            .aPanel.pad.monospace.error(if="{error.origMessage}")
                svg.feather
                    use(xlink:href="#alert-circle")
                |
                |
                span {error.origMessage}
            h4(if="{error.stack && !error.richInfo?.problematicCode}") {voc.stacktrace}
            code(if="{error.stack && !error.richInfo?.problematicCode}")
                pre {error.stack}
        .inset.flexfix-footer.flexrow
            button.nogrow(onclick="{opts.onclose}")
                svg.feather
                    use(xlink:href="#x")
                span {vocGlob.close}
            button.nogrow(
                if="{error?.richInfo?.clue === 'windowsFileLock'}"
                onclick="{saveAndQuit}"
            )
                svg.feather
                    use(xlink:href="#save")
                span {voc.saveAndQuit}
            .aSpacer
            button.nogrow(
                if="{error?.richInfo?.resourceType && error?.richInfo?.resourceId}"
                onclick="{jumpToProblem}"
            )
                span {voc.jumpToProblem}
                svg.feather
                    use(xlink:href="#arrow-right")
    script.
        this.namespace = 'exporterError';
        this.mixin(window.riotVoc);

        this.resourceToIconMap = require('./data/node_requires/resources').resourceToIconMap;
        this.error = this.opts.error;
        // Propose solution for windows' eternal file locking problem
        if (this.error.code === 'ENOTEMPTY' || this.error.code === 'EPERM') {
            if (!('richInfo' in this.error)) {
                this.error.richInfo = {};
            }
            this.error.richInfo.clue = 'windowsFileLock';
        }
        this.tryClose = e => {
            if (e.target !== this.root) {
                return;
            }
            this.opts.onclose();
        };
        this.jumpToProblem = () => {
            const info = this.error.richInfo;
            window.orders.trigger('openAsset', `${info.resourceType}s/${info.resourceId}`);
            this.opts.onclose();
        };
        this.saveAndQuit = async () => {
            const {saveProject} = require('./data/node_requires/resources/projects');
            await saveProject();
            alertify.success(window.languageJSON.common.savedMessage, 'success', 3000);
            // Close after a second so a user sees a "saved" message and doesn't shit themselves
            setTimeout(() => {
                nw.App.quit();
            }, 1000);
        };

        const {soundbox} = require('./data/node_requires/3rdparty/soundbox');
        this.on('mount', () => {
            soundbox.play('Failure');
        });
