//
    @attribute onclose (riot function)
        Called when a user presses the "Close" button. Passes no arguments.
    @attribute [folder] (IAssetFolder)
texture-generator
    .flexcol.tall
        .flexrow.tall
            .aPanel.texture-generator-Settings.nogrow
                fieldset
                    label.block
                        b {voc.name}
                        input.wide(type="text" oninput="{wire('textureName')}" value="{textureName}")
                    .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nameTaken}
                fieldset
                    label.block
                        b {voc.width}
                        input.wide(type="number" oninput="{wire('textureWidth')}" value="{textureWidth}" min="8" step="8")
                    label.block
                        b {voc.height}
                        input.wide(type="number" oninput="{wire('textureHeight')}" value="{textureHeight}" min="8" step="8")
                    label.block
                        b {voc.color}
                    color-input(onchange="{changeColor}" color="{textureColor}")
                fieldset
                    b {voc.form}
                    label.block.checkbox
                        input(type="radio" value="rect" checked="{form === 'rect'}" onchange="{wire('form')}")
                        span {voc.formRectangular}
                    label.block.checkbox
                        input(type="radio" value="round" checked="{form === 'round'}" onchange="{wire('form')}")
                        span {voc.formRound}
                    label.block.checkbox
                        input(type="radio" value="diamond" checked="{form === 'diamond'}" onchange="{wire('form')}")
                        span {voc.formDiamond}
                fieldset
                    b {voc.filler}
                    label.block.checkbox
                        input(type="radio" value="none" checked="{filler === 'none'}" onchange="{wire('filler')}")
                        span {voc.fillerNone}
                    label.block.checkbox
                        input(type="radio" value="cross" checked="{filler === 'cross'}" onchange="{wire('filler')}")
                        span {voc.fillerCross}
                    label.block.checkbox
                        input(type="radio" value="arrow" checked="{filler === 'arrow'}" onchange="{wire('filler')}")
                        span {voc.fillerArrow}
                    label.block.checkbox
                        input(type="radio" value="label" checked="{filler === 'label'}" onchange="{wire('filler')}")
                        span {voc.fillerLabel}
                fieldset(if="{filler === 'label'}")
                    label.block
                        b {voc.label}
                        |
                        | {voc.optional}
                        input.wide(type="text" oninput="{wire('textureLabel')}" value="{textureLabel}")
            .texture-generator-aPreview
                canvas(ref="canvas" style="image-rendering: {small ? 'pixelated' : 'unset'}; transform: scale({small ? 4 : 1});")
                .texture-generator-aScalingNotice(if="{textureWidth < 64 && textureHeight < 64}")
                    | {voc.scalingAtX4}
        .flexrow.nogrow
            button(onclick="{createAndClose}")
                svg.feather
                    use(xlink:href="#check")
                span {voc.createAndClose}
            button(onclick="{create}")
                svg.feather
                    use(xlink:href="#loader")
                span {voc.createAndContinue}
    script.
        this.namespace = 'textureGenerator';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);

        const {getOfType, createAsset} = require('./data/node_requires/resources');

        this.textureName = 'Placeholder';
        this.textureWidth = this.textureHeight = 64;
        this.textureColor = '#446adb';
        this.textureLabel = '';
        this.form = 'rect';
        this.filler = 'label';

        this.changeColor = e => {
            this.wire('textureColor')(e);
            this.update();
        };

        const drawForm = (c, x) => {
            const w = c.width;
            const h = c.height;
            x.fillStyle = this.textureColor;
            if (this.form === 'rect') {
                x.fillRect(0, 0, w, h);
            } else if (this.form === 'round') {
                x.beginPath();
                x.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
                x.closePath();
                x.fill();
            } else if (this.form === 'diamond') {
                x.moveTo(w / 2, 0);
                x.lineTo(w, h / 2);
                x.lineTo(w / 2, h);
                x.lineTo(0, h / 2);
                x.closePath();
                x.fill();
            }
        };
        this.refreshCanvas = () => {
            const {canvas} = this.refs;
            if (!canvas.x) {
                canvas.x = canvas.getContext('2d');
            }
            const {x} = canvas;
            this.small = this.textureWidth < 64 && this.textureHeight < 64;
            canvas.width = this.textureWidth;
            canvas.height = this.textureHeight;
            const w = canvas.width;
            const h = canvas.height;
            x.clearRect(0, 0, w, h);
            drawForm(canvas, x);

            const dark = window.brehautColor(this.textureColor).getLuminance() < 0.5;
            if (this.filler === 'label') {
                let label;
                if (this.textureLabel.trim()) {
                    label = this.textureLabel.trim();
                } else {
                    label = `${w}×${h}`;
                }

                // Fit the text into 80% of canvas' width
                x.font = '100px Iosevka';
                const measure = x.measureText(label).width;
                let k = w * 0.8 / measure;
                // Cannot exceed canvas' height
                if (k * 100 > h * 0.8) {
                    k = h * 0.8 / 100;
                }

                x.font = `${Math.round(k * 100)}px Iosevka`;
                x.textBaseline = 'middle';
                x.textAlign = 'center';

                x.fillStyle = dark ? '#fff' : '#000';
                x.fillText(label, w / 2, h / 2);
            } else if (this.filler === 'cross') {
                x.beginPath();
                x.strokeStyle = dark ? '#fff' : '#000';
                x.lineWidth = (w > 16 && h > 16) ? 2 : 1;
                if (this.form === 'rect') {
                    x.moveTo(0, 0);
                    x.lineTo(w, h);
                    x.moveTo(w, 0);
                    x.lineTo(0, h);
                } else if (this.form === 'round') {
                    const dx = Math.cos(Math.PI / 4) * w / 2;
                    const dy = Math.sin(Math.PI / 4) * h / 2;
                    x.moveTo(w / 2 + dx, h / 2 + dy);
                    x.lineTo(w / 2 - dx, h / 2 - dy);
                    x.moveTo(w / 2 - dx, h / 2 + dy);
                    x.lineTo(w / 2 + dx, h / 2 - dy);
                } else if (this.form === 'diamond') {
                    x.moveTo(w * 0.25, h * 0.25);
                    x.lineTo(w * 0.75, h * 0.75);
                    x.moveTo(w * 0.75, h * 0.25);
                    x.lineTo(w * 0.25, h * 0.75);
                }
                x.stroke();
            } else if (this.filler === 'arrow') {
                const arrowSize = Math.min(w, h) * 0.2;
                x.beginPath();
                x.strokeStyle = dark ? '#fff' : '#000';
                x.lineWidth = (w > 16 && h > 16) ? 2 : 1;
                x.moveTo(w * 0.3, h * 0.5);
                x.lineTo(w * 0.7, h * 0.5);
                x.moveTo(w * 0.7 - arrowSize, h * 0.5 - arrowSize);
                x.lineTo(w * 0.7, h * 0.5);
                x.lineTo(w * 0.7 - arrowSize, h * 0.5 + arrowSize);
                x.stroke();
            }
        };

        this.on('mount', this.refreshCanvas);
        this.on('update', this.refreshCanvas);

        this.close = () => {
            if (this.opts.onclose) {
                this.opts.onclose();
            }
        };
        this.create = async () => {
            this.nameTaken = getOfType('texture')
                .find(texture => this.textureName === texture.name);

            if (this.nameTaken) {
                this.update();
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                const {soundbox} = require('./data/node_requires/3rdparty/soundbox');
                soundbox.play('Failure');
                return false;
            }

            this.refreshCanvas();
            const {canvas} = this.refs;
            const png = canvas.toDataURL();
            const imageBase64 = png.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = new Buffer(imageBase64, 'base64');
            await createAsset('texture', this.opts.folder || null, {
                src: imageBuffer,
                name: this.textureName
            });
            window.alertify.success(this.voc.generationSuccessMessage.replace('$1', this.textureName));

            return true;
        };
        this.createAndClose = async () => {
            if (!(await this.create())) {
                return;
            }
            this.close();
        };
