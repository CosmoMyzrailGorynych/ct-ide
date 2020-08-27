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
            x.fillRect(0, 0, canvas.width, canvas.height);

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

            const dark = window.brehautColor(this.textureColor).getLuminance() < 0.5;
            x.fillStyle = dark ? '#fff' : '#000';
            x.fillText(label, canvas.width / 2, canvas.height / 2);
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