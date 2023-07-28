sound-editor.aView.aPanel.pad(class="{opts.class}")
    p
        label
            b {voc.poolSize}
            input(type="number" min="1" max="32" value="{sound.poolSize || 5}" onchange="{wire('sound.poolSize')}")
    audio(
        if="{sound && sound.origname}"
        ref="audio" controls loop
        src="file://{global.projdir + '/snd/' + sound.origname + '?' + sound.lastmod}"
        onplay="{notifyPlayerPlays}"
    )
    p
        label.checkbox
            input(type="checkbox" checked="{sound.isMusic}" onchange="{wire('sound.isMusic')}")
            span   {voc.isMusicFile}
    label.file
        .button.wide.nml
            svg.feather
                use(xlink:href="#plus")
            span {voc.import}
        input(type="file" ref="inputsound" accept=".mp3,.ogg,.wav" onchange="{changeSoundFile}")
    p.nmb
        button.wide(onclick="{applyChanges}" title="Shift+Control+S" data-hotkey="Control+S")
            svg.feather
                use(xlink:href="#check")
            span {vocGlob.apply}
    script.
        const path = require('path');
        this.namespace = 'soundView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        this.playing = false;
        this.sound = this.opts.asset;
        this.notifyPlayerPlays = () => {
            this.playing = true;
        };
        this.saveAsset = () => {
            this.writeChanges();
            if (this.playing) {
                this.togglePlay();
            }
            return true;
        };
        this.applyChanges = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };
        this.togglePlay = function togglePlay() {
            if (this.playing) {
                this.playing = false;
                this.refs.audio.pause();
            } else {
                this.playing = true;
                this.refs.audio.play();
            }
        };
        this.changeSoundFile = async () => {
            const val = this.refs.inputsound.files[0].path;
            this.refs.inputsound.value = '';
            const sounds = require('./data/node_requires/resources/sounds');
            if (!this.sound.lastmod && this.sound.name === 'Sound_' + this.sound.uid.split('-').pop()) {
                this.sound.name = path.basename(val, path.extname(val));
            }
            await sounds.addSoundFile(this.sound, val);
            this.update();
        };
