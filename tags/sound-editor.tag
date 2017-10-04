sound-editor.panel.view
    .modal
        b {voc.name}
        br
        input.wide(type="text" value="{sound.name}" onchange="{wire('this.sound')}")
        br
        br
        label.file
            button.inline
                i.icon.icon-plus
                span {voc.import}
            input(type="file" ref="inputsound" accept=".mp3,.ogg,.wav" onchange="{changeSoundFile}")
        audio(
            ref="audio" controls loop 
            if="{sound.origname}" 
            src="{sessionStorage.projdir + '/snd/' + sound.origname}"
            onplay="{notifyPlayerPlays}"
        )
        br
        br
        button.wide(onclick="{soundSave}")
            i.icon.icon-confirm
            span {voc.save}
    script.
        this.voc = window.languageJSON.soundview;
        this.mixin(window.riotWired);
        this.playing = false;
        this.on('mount', () => {
            this.sound = this.opts.sound;
            $('#soundview').show();
        });
        this.notifyPlayerPlays = e => {
            this.playing = true;
        };
        this.soundSave = e => {
            if (this.playing) {
                this.togglePlay();
            }
            this.parent.editing = false;
            this.parent.update();
        };
        this.togglePlay = function () {
            if (this.playing) {
                this.playing = false;
                this.refs.audio.pause();
            } else {
                this.playing = true;
                this.refs.audio.play();
            }
        };
        this.changeSoundFile = () => {
            this.opts.sound.origname = 's' + currentSound.uid + path.extname(this.refs.inputsound.value);
            megacopy(this.refs.inputsound.value, sessionStorage.projdir + '/snd/' + this.opts.sound.origname, function (e) {
                console.error(e);
            });
            this.refs.inputsound.value = '';
        };
