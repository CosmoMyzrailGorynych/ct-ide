//
    @attribute assettype (string)
        The asset type to check duplicate names against.
        Must match the asset type in the resources API at src/node_requires/resources.

    @attribute defaultname (string)

    @attribute oncancelled (riot function)

    @attribute onsubmitted (riot function)
        Passes the name of the asset as the only argument to the specified function.

new-asset-prompt.aDimmer.pointer.pad.fadein(onclick="{closeOnDimmer}" ref="dimmer")

    button.aDimmer-aCloseButton.forcebackground(if="{opts.oncancelled}" title="{vocGlob.close}" onclick="{opts.oncancelled}")
        svg.feather
            use(xlink:href="#x")

    .aModal.pad.cursordefault.appear.npb
        h1.nmt {voc.heading}
        p.nmb {voc.selectNewName}
        .relative
            input(
                type="text"
                value="{currentName}"
                oninput="{setName}"
                onkeydown="{catchSubmit}"
                class="{error: invalidName}"
                pattern="[^'\"]+"
                ref="input"
            )
            .anErrorNotice(ref="error" if="{invalidName && currentName}") {vocGlob.nameTaken}
            .anErrorNotice(ref="error" if="{invalidName && !currentName}") {vocGlob.cannotBeEmpty}
        p
        .inset.flexrow
            button.nogrow(onclick="{opts.oncancelled}")
                svg.feather
                    use(xlink:href="#x")
                span {vocGlob.cancel}
            .aSpacer
            button.success.nogrow(onclick="{tryPickName}")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.create}

    script.
        this.namespace = 'newAssetPrompt';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        this.on('mount', () => {
            this.refs.input.focus();
        });

        const resourcesAPI = require('./data/node_requires/resources');

        this.closeOnDimmer = e => {
            if (e.target === this.root) {
                if (this.opts.oncancelled) {
                    this.opts.oncancelled();
                }
            }
            e.stopPropagation();
        };

        this.currentName = this.opts.defaultname ?? '';
        if (this.currentName) {
            this.invalidName = resourcesAPI
                .getOfType(this.opts.assettype)
                .find(a => a.name === this.currentName);
        } else {
            this.invalidName = true;
        }
        this.setName = e => {
            const name = e.target.value.trim();
            this.currentName = name;
            if (name === '') {
                this.invalidName = true;
                return;
            }
            if (resourcesAPI.getOfType(this.opts.assettype).find(a => a.name === name)) {
                this.invalidName = true;
            } else {
                this.invalidName = false;
            }
        };

        this.catchSubmit = e => {
            if (e.code === 'Enter') {
                this.tryPickName();
            }
        };

        const jellify = require('./data/node_requires/jellify');
        const {soundbox} = require('./data/node_requires/3rdparty/soundbox');
        this.tryPickName = () => {
            if (this.invalidName) {
                jellify(this.refs.error);
                soundbox.play('Failure');
                return;
            }
            this.opts.onsubmitted(this.currentName);
        };
