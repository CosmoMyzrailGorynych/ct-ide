//
    @attribute onclose (riot function)
        Called when a user presses the "Close" button. Passes no arguments.
texture-generator.view
    .flexcol.tall
        .flexrow.tall
            .panel.texture-generator-Settings.nogrow
                fieldset
                    label.block
                        b {voc.name}
                        input.wide(type="text" oninput="{wire('this.textureName')}" value="{textureName}")
                    .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nametaken}
                fieldset
                    label.block
                        b {voc.width}
                        input.wide(type="number" oninput="{wire('this.textureWidth')}" value="{textureWidth}" min="8" step="8")
                    label.block
                        b {voc.height}
                        input.wide(type="number" oninput="{wire('this.textureHeight')}" value="{textureHeight}" min="8" step="8")
                    label.block
                        b {voc.color}
                    color-input(onchange="{changeColor}" color="{textureColor}")
                fieldset
                    b {voc.form}
                    label.block.checkbox
                        input(type="radio" value="rect" checked="{form === 'rect'}" onchange="{wire('this.form')}")
                        span {voc.formRectangular}
                    label.block.checkbox
                        input(type="radio" value="round" checked="{form === 'round'}" onchange="{wire('this.form')}")
                        span {voc.formRound}
                    label.block.checkbox
                        input(type="radio" value="diamond" checked="{form === 'diamond'}" onchange="{wire('this.form')}")
                        span {voc.formDiamond}
                fieldset
                    b {voc.filler}
                    label.block.checkbox
                        input(type="radio" value="none" checked="{filler === 'none'}" onchange="{wire('this.filler')}")
                        span {voc.fillerNone}
                    label.block.checkbox
                        input(type="radio" value="cross" checked="{filler === 'cross'}" onchange="{wire('this.filler')}")
                        span {voc.fillerCross}
                    label.block.checkbox
                        input(type="radio" value="arrow" checked="{filler === 'arrow'}" onchange="{wire('this.filler')}")
                        span {voc.fillerArrow}
                    label.block.checkbox
                        input(type="radio" value="label" checked="{filler === 'label'}" onchange="{wire('this.filler')}")
                        span {voc.fillerLabel}
                fieldset(if="{filler === 'label'}")
                    label.block
                        b {voc.label}
                        |
                        | {voc.optional}
                        input.wide(type="text" oninput="{wire('this.textureLabel')}" value="{textureLabel}")
            .texture-generator-aPreview
                canvas(ref="canvas" style="image-rendering: {small ? 'pixelated' : 'unset'}; transform: scale({small ? 4 : 1});")
                .texture-generator-aScalingNotice(if="{textureWidth < 64 && textureHeight < 64}")
                    | {voc.scalingAtX4}
        .flexrow.nogrow
            button(onclick="{close}")
                svg.feather
                    use(xlink:href="data/icons.svg#x")
                span {vocGlob.close}
            button(onclick="{createAndClose}")
                svg.feather
                    use(xlink:href="data/icons.svg#check")
                span {voc.createAndClose}
            button(onclick="{create}")
                svg.feather
                    use(xlink:href="data/icons.svg#loader")
                span {voc.createAndContinue}
    script.
        this.namespace = 'textureGenerator';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.textureName = 'Placeholder';
        this.textureWidth = this.textureHeight = 64;
        this.textureColor = '#446adb';
        this.textureLabel = '';
        this.form = 'rect';
        this.filler = 'label';

        this.changeColor = e => {
            this.wire('this.textureColor')(e);
            this.update();
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
            x.clearRect(0, 0, canvas.width, canvas.height);

            x.fillStyle = this.textureColor;
            if (this.form === 'rect') {
                x.fillRect(0, 0, canvas.width, canvas.height);
            } else if (this.form === 'round') {
                x.beginPath();
                x.ellipse(
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width / 2,
                    canvas.height / 2,
                    0,
                    0,
                    Math.PI * 2
                );
                x.closePath();
                x.fill();
            } else if (this.form === 'diamond') {
                x.moveTo(canvas.width / 2, 0);
                x.lineTo(canvas.width, canvas.height / 2);
                x.lineTo(canvas.width / 2, canvas.height);
                x.lineTo(0, canvas.height / 2);
                x.closePath();
                x.fill();
            }

            const dark = window.brehautColor(this.textureColor).getLuminance() < 0.5;

            if (this.filler === 'label') {
                let label;
                if (this.textureLabel.trim()) {
                    label = this.textureLabel.trim();
                } else {
                    label = `${canvas.width}×${canvas.height}`;
                }

                // Fit the text into 80% of canvas' width
                x.font = '100px Iosevka';
                const measure = x.measureText(label).width;
                let k = canvas.width * 0.8 / measure;
                // Cannot exceed canvas' height
                if (k * 100 > canvas.height * 0.8) {
                    k = canvas.height * 0.8 / 100;
                }

                x.font = `${Math.round(k * 100)}px Iosevka`;
                x.textBaseline = 'middle';
                x.textAlign = 'center';

                x.fillStyle = dark ? '#fff' : '#000';
                x.fillText(label, canvas.width / 2, canvas.height / 2);
            } else if (this.filler === 'cross') {
                x.beginPath();
                x.strokeStyle = dark ? '#fff' : '#000';
                x.lineWidth = (canvas.width > 16 && canvas.height > 16) ? 2 : 1;
                if (this.form === 'rect') {
                    x.moveTo(0, 0);
                    x.lineTo(canvas.width, canvas.height);
                    x.moveTo(canvas.width, 0);
                    x.lineTo(0, canvas.height);
                } else if (this.form === 'round') {
                    let dx = Math.cos(Math.PI / 4) * canvas.width / 2;
                    let dy = Math.sin(Math.PI / 4) * canvas.height / 2;
                    x.moveTo(canvas.width / 2 + dx, canvas.height / 2 + dy);
                    x.lineTo(canvas.width / 2 - dx, canvas.height / 2 - dy);
                    x.moveTo(canvas.width / 2 - dx, canvas.height / 2 + dy);
                    x.lineTo(canvas.width / 2 + dx, canvas.height / 2 - dy);
                } else if (this.form === 'diamond') {
                    x.moveTo(canvas.width * 0.25, canvas.height * 0.25);
                    x.lineTo(canvas.width * 0.75, canvas.height * 0.75);
                    x.moveTo(canvas.width * 0.75, canvas.height * 0.25);
                    x.lineTo(canvas.width * 0.25, canvas.height * 0.75);
                }
                x.stroke();
            } else if (this.filler === 'arrow') {
                let arrowSize = Math.min(canvas.width, canvas.height) * 0.2;
                x.beginPath();
                x.strokeStyle = dark ? '#fff' : '#000';
                x.lineWidth = (canvas.width > 16 && canvas.height > 16) ? 2 : 1;
                x.moveTo(canvas.width * 0.3, canvas.height * 0.5);
                x.lineTo(canvas.width * 0.7, canvas.height * 0.5);
                x.moveTo(canvas.width * 0.7 - arrowSize, canvas.height * 0.5 - arrowSize);
                x.lineTo(canvas.width * 0.7, canvas.height * 0.5);
                x.lineTo(canvas.width * 0.7 - arrowSize, canvas.height * 0.5 + arrowSize);
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
            const {textures} = global.currentProject;
            this.nameTaken = textures.find(texture => this.textureName === texture.name);

            if (this.nameTaken) {
                this.update();
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                if (localStorage.disableSounds !== 'on') {
                    soundbox.play('Failure');
                }
                return false;
            }

            this.refreshCanvas();
            const {canvas} = this.refs;
            const {importImageToTexture} = require('./data/node_requires/resources/textures');
            const png = canvas.toDataURL();
            const imageBase64 = png.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = new Buffer(imageBase64, 'base64');
            await importImageToTexture(imageBuffer, this.textureName);
            window.alertify.success(this.voc.generationSuccessMessage.replace('$1', this.textureName));

            return true;
        };
        this.createAndClose = async () => {
            if (!(await this.create())) {
                return;
            }
            this.close();
        };
