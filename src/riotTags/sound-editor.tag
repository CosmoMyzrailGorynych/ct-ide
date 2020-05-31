sound-editor.panel.view
    .modal
        b {voc.name}
        br
        input.wide(type="text" value="{sound.name}" onchange="{wire('this.sound.name')}")
        .anErrorNotice(if="{nameTaken}") {vocGlob.nametaken}
        br
        p
            label
                b {voc.poolSize}
                input(type="number" min="1" max="32" value="{sound.poolSize || 5}" onchange="{wire('this.sound.poolSize')}")
        audio(
            if="{sound && sound.origname}"
            ref="audio" controls loop
            src="file://{global.projdir + '/snd/' + sound.origname + '?' + sound.lastmod}"
            onplay="{notifyPlayerPlays}"
        )
        p
            label.checkbox
                input(type="checkbox" checked="{sound.isMusic}" onchange="{wire('this.sound.isMusic')}")
                span   {voc.isMusicFile}
        label.file
            .button.wide.nml
                svg.feather
                    use(xlink:href="data/icons.svg#plus")
                span {voc.import}
            input(type="file" ref="inputsound" accept=".mp3,.ogg,.wav" onchange="{changeSoundFile}")
        p.nmb
            button.wide(onclick="{soundSave}" title="Shift+Control+S" data-hotkey="Control+S")
                svg.feather
                    use(xlink:href="data/icons.svg#check")
                span {voc.save}
    script.
        const path = require('path');
        const fs = require('fs-extra');
        this.namespace = 'soundview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.playing = false;
        this.sound = this.opts.sound;
        this.on('update', () => {
            const sound = global.currentProject.sounds.find(sound =>
                this.sound.name === sound.name && this.sound !== sound);
            if (sound) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
        });
        this.notifyPlayerPlays = () => {
            this.playing = true;
        };
        this.soundSave = () => {
            if (this.playing) {
                this.togglePlay();
            }
            this.parent.editing = false;
            this.parent.update();
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
        this.changeSoundFile = () => {
            const val = this.refs.inputsound.files[0].path;
            fs.copy(val, global.projdir + '/snd/s' + this.sound.uid + path.extname(val), e => {
                if (e) {
                    console.error(e);
                    alertify.error(e);
                    return;
                }
                if (!this.sound.lastmod && this.sound.name === 'Sound_' + this.sound.uid.split('-').pop()) {
                    this.sound.name = path.basename(val, path.extname(val));
                }
                this.sound.origname = 's' + this.sound.uid + path.extname(val);
                this.sound.lastmod = Number(new Date());
                this.update();
            });
            this.refs.inputsound.value = '';
        };
