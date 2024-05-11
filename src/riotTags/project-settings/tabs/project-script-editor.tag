project-script-editor.aView
    .flexfix.tall
        div.flexfix-header
            b {voc.name}
            input(type="text" value="{script.name}" onchange="{updateScriptName}")
        .flexfix-body
            .aCodeEditor(ref="editor")
        button.nm.flexfix-footer(onclick="{saveScript}" title="Shift+Control+S" data-hotkey="Control+S")
            svg.feather
                use(xlink:href="#check")
            span {voc.done}
    script.
        this.namespace = 'common';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        this.script = this.opts.script;
        const updateEditorSize = () => {
            this.editor.layout();
        };
        const updateEditorSizeDeferred = function () {
            setTimeout(updateEditorSize, 0);
        };

        const {scriptModels} = require('src/node_requires/resources/projects/scripts');
        this.on('unmount', () => {
            window.removeEventListener('resize', updateEditorSize);
            window.signals.off('settingsFocus', updateEditorSizeDeferred);
        });
        this.on('mount', () => {
            setTimeout(() => {
                this.editor = window.setupCodeEditor(this.refs.editor, {
                    model: scriptModels.get(this.script)
                });
                this.editor.onDidChangeModelContent(() => {
                    this.script.code = this.editor.getValue();
                });
                window.addEventListener('resize', updateEditorSize);
                window.signals.on('settingsFocus', updateEditorSizeDeferred);
            }, 0);
        });
        this.on('unmount', () => {
            // Manually destroy the editor to free up the memory
            this.editor.dispose();
        });

        this.saveScript = () => {
            this.parent.currentScript = null;
            this.parent.update();
        };

        this.updateScriptName = e => {
            this.script.name = e.target.value.trim();
        };
