sound-editor.aView.pad.flexfix(onclick="{tryClose}")
    .flexfix-header.sound-editor-aWrapper.flexrow
        // TODO: make it dynamic
        // need to somehow get the played variant back
        // from the sound lib
        img.soundthumbnail(src="{getPreview(asset.variants[0], true)}" if="{asset.variants.length}")
        .aSpacer(if="{!asset.variants.length}")
        .aSpacer.nogrow
        button.round.square.nogrow.alignmiddle(onclick="{playAsset}")
            svg.feather
                use(xlink:href="#{currentSoundPlaying ? 'pause' : 'play'}")
    .flexfix-body.sound-editor-aWrapper.flexrow.sound-editor-Columns
        .fifty.npl.flexfix.tall
            .flexfix-header
                h2.nmt {voc.variants}
            .flexfix-body
                ul.aStripedList
                    li.flexrow.wide.npr.npl(each="{variant in asset.variants}")
                        img.aVariantThumbnail.soundthumbnail(src="{getPreview(variant, true)}")
                        .aSpacer.nogrow
                        button.square.inline.alignmiddle.nogrow.large(onclick="{playVariant(variant)}" title="{vocGlob.play}")
                            svg.feather
                                use(xlink:href="#{(currentSoundPlaying && currentVariant === variant) ? 'pause' : 'play'}")
                        button.square.inline.alignmiddle.nogrow(title="{vocGlob.reimport}")
                            svg.feather
                                use(xlink:href="#refresh-ccw")
                        button.square.inline.alignmiddle.nogrow.nmr(onclick="{deleteVariant(variant)}" title="{vocGlob.delete}")
                            svg.feather
                                use(xlink:href="#x")
                .aSpacer
                .flexrow
                    button(onclick="{openRecorder}")
                        svg.feather
                            use(xlink:href="#mic")
                            span {vocFull.sounds.record}
                    .aSpacer.nogrow
                    button(onclick="{openGallery}")
                        svg.feather
                            use(xlink:href="#music")
                            span {vocGlob.openAssetGallery}
                    .aSpacer.nogrow
                    label.file
                        .button.wide.nm
                            svg.feather
                                use(xlink:href="#folder-plus")
                            span  {voc.addVariant}
                        input(type="file" ref="inputsound" accept=".mp3,.ogg,.wav" onchange="{importVariant}")
            .flexfix-footer
                h2.nmt {vocGlob.settings}
                .aSpacer
                label.checkbox
                    input(type="checkbox")
                    b {voc.preload}
        .fifty.npr.flexfix.tall
            .flexfix-header
                h2.nmt {voc.effects}
            .flexfix-body
                virtual(each="{prop in ['volume', 'pitch', 'distortion']}")
                    .flexrow.sound-editor-aFilter
                        label.checkbox
                            input(
                                type="checkbox"
                                checked="{asset[prop].enabled}"
                                onchange="{toggleCheckbox(prop)}"
                            )
                            b {voc[prop]}
                        range-selector(
                            float-value="float-value" float-precision="2"
                            min="0" max="{prop === 'distortion' ? 1 : 2}"
                            preset-min="{asset[prop].min}" preset-max="{asset[prop].max}"
                            onrange-changed="{setProp(prop)}"
                            circle-focus-border="2px solid {swatches.act}"
                            circle-color="{swatches.act}"
                            circle-border="0"
                            slider-color="{swatches.borderBright}"
                            circle-size="24px"
                        )
                .flexrow.sound-editor-aFilter
                    label.checkbox
                        input(type="checkbox" checked="{asset.reverb.enabled}" onchange="{toggleCheckbox('reverb')}")
                        b {voc.reverb}
                    div
                        span {voc.reverbDuration}
                        range-selector(
                            float-value="float-value" float-precision="2"
                            min="0" max="60"
                            preset-min="{asset.reverb.secondsMin}" preset-max="{asset.reverb.secondsMax}"
                            onrange-changed="{setProp('reverb', 'seconds')}"
                            circle-focus-border="2px solid {swatches.act}"
                            circle-color="{swatches.act}"
                            circle-border="0"
                            slider-color="{swatches.borderBright}"
                            circle-size="24px"
                        )
                        span {voc.reverbDecay}
                        range-selector(
                            float-value="float-value" float-precision="2"
                            min="0" max="60"
                            preset-min="{asset.reverb.decayMin}" preset-max="{asset.reverb.decayMax}"
                            onrange-changed="{setProp('reverb', 'decay')}"
                            circle-focus-border="2px solid {swatches.act}"
                            circle-color="{swatches.act}"
                            circle-border="0"
                            slider-color="{swatches.borderBright}"
                            circle-size="24px"
                        )
                        label.checkbox
                            input(type="checkbox" checked="{asset.reverb.reverse}" onchange="{toggleCheckbox('reverse')}")
                            b {voc.reverseReverb}
                .flexrow.sound-editor-aFilter
                    label.checkbox
                        input(type="checkbox" checked="{asset.eq.enabled}" onchange="{toggleCheckbox('eq')}")
                        b {voc.equalizer}
                    div
                        - var frequences = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];
                        each val in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                            .flexrow
                                code.sound-editor-aBand=`${frequences[val]}{voc.hertz}`
                                range-selector.sound-editor-aFilter-eqBand(
                                    hide-legend="hide-legend"
                                    float-value="float-value" float-precision="2"
                                    min="-40" max="40"
                                    preset-min=`{asset.eq.bands[${val}].min}` preset-max=`{asset.eq.bands[${val}].max}`
                                    onrange-changed=`{setProp('eq', ${val})}`
                                    circle-focus-border="2px solid {swatches.act}"
                                    circle-color="{swatches.act}"
                                    circle-border="0"
                                    slider-color="{swatches.borderBright}"
                                    circle-size="24px"
                                )
                        .flexrow
                            code.sound-editor-aBand
                            span.nogrow -40
                            .aSpacer
                            span.nogrow 0
                            .aSpacer
                            span.nogrow 40
    .flexfix-footer.sound-editor-aWrapper
        p.nmb
            button.wide(onclick="{saveAndClose}" title="Shift+Control+S" data-hotkey="Control+S")
                svg.feather
                    use(xlink:href="#check")
                span {vocGlob.apply}
    builtin-asset-gallery(
        if="{showGallery}"
        type="sounds" sound="{asset}"
        onclose="{closeGallery}"
    )
    sound-recorder(
        if="{showRecorder}"
        sound="{asset}"
        onclose="{closeRecorder}"
    )
    script.
        const path = require('path');
        this.namespace = 'soundView';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.mixin(require('./data/node_requires/riotMixins/discardio').default);

        this.swatches = require('./data/node_requires/themes').getSwatches();

        const soundResMethods = require('./data/node_requires/resources/sounds');
        const {SoundPreviewer} = require('./data/node_requires/resources/preview/sound');
        const {playVariant, playWithoutEffects} = require('./data/ct.shared/ctSound');

        this.currentSoundPlaying = null;
        soundResMethods.loadSound(this.asset);

        this.getPreview = (variant, long) => SoundPreviewer.get(this.asset, false, variant.uid, long);

        this.reimportVariant = variant => e => {
            // TODO:
            // remove the old variant from pixi.sound first
        };

        this.deleteVariant = variant => e => {
            const newVariants = this.asset.variants.filter(el => {
                return el.uid !== variant.uid;
            })
            this.asset.variants = newVariants;
        };

        this.playAsset = () => {
            const variant = this.asset.variants[
                Math.floor(Math.random() * this.asset.variants.length)
            ];
            this.playVariant(variant, true)();
        };

        const onSoundComplete = (sound) => {
            this.currentSoundPlaying = null;
            this.currentVariant = null;
            this.update();
        };
        this.playVariant = (variant, testing) => () => {
            // Stop any previous sound
            if (this.currentSoundPlaying) {
                this.currentSoundPlaying.stop();
                this.currentSoundPlaying = null;
                if (testing) {
                    this.currentVariant = null;
                    return;
                }
            }
            // Clicked on the save variant that was played: just stop playback.
            if (this.currentVariant === variant) {
                this.currentVariant = null;
                return;
            }
            this.currentVariant = variant;
            this.currentSoundPlaying = (testing ? playVariant : playWithoutEffects)(this.asset, variant, {
                complete: onSoundComplete
            });
        };

        this.importVariant = async () => {
            const source = this.refs.inputsound.files[0].path;
            const sounds = require('./data/node_requires/resources/sounds');
            if (!this.asset.lastmod && this.asset.name === 'New Sound') {
                this.asset.name = path.basename(source, path.extname(source));
            }
            const variant = await sounds.addSoundFile(this.asset, source);
            this.smallWaveforms[variant.uid] =
                SoundPreviewer.get(this.asset, false, variant.uid, false);
            this.largeWaveforms[variant.uid] =
                SoundPreviewer.get(this.asset, false, variant.uid, true);
            this.update();
            soundResMethods.loadSound(this.asset);
        };

        this.toggleCheckbox = prop => e => {
            // TODO: volume and pitch
            console.log(prop);
            this.asset[prop].enabled = !this.asset[prop].enabled;
        };
        this.setProp = (prop, arg = null) => e => {
            const { minRangeValue: min, maxRangeValue: max } = e.detail;
            if(arg !== null) {
                if(prop === "eq") {
                    this.asset[prop].bands[parseInt(arg)] = {
                        min,
                        max
                    };
                } else {
                    this.asset[prop][arg + 'Min'] = min;
                    this.asset[prop][arg + 'Max'] = max;
                }
            } else {
                this.asset[prop].min = min;
                this.asset[prop].max = max;
            }
        };

        this.saveAsset = () => {
            this.writeChanges();
            if (this.currentSoundPlaying) {
                this.currentSoundPlaying.stop();
            }
            return true;
        };
        this.saveAndClose = () => {
            this.saveAsset();
            this.opts.ondone(this.asset);
        };


        // Built-in asset gallery

        this.showGallery = false;
        this.openGallery = () => {
            this.showGallery = true;
        };
        this.closeGallery = () => {
            this.showGallery = false;
            soundResMethods.loadSound(this.asset);
            this.update();
        };

        // Recorder

        this.showRecorder = false;
        this.openRecorder = () => {
            this.showRecorder = true;
        };
        this.closeRecorder = () => {
            this.showRecorder = false;
            soundResMethods.loadSound(this.asset);
            this.update();
        };
