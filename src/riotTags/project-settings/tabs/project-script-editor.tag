project-script-editor
    .flexfix.tall
        div.flexfix-header
            b {voc.name}
            input(type="text" value="{script.name}" onchange="{updateScriptName}")
        .flexfix-body
            .aCodeEditor(ref="editor")
    script.
        this.namespace = 'common';
        this.mixin(require('src/node_requires/riotMixins/voc').default);

        this.script = this.opts.script;
        const updateEditorSize = () => {
            this.editor.layout();
        };
        const updateEditorSizeDeferred = function (tab) {
            if (tab === 'project') {
                setTimeout(updateEditorSize, 0);
            }
        };

        const {scriptModels} = require('src/node_requires/resources/projects/scripts');
        this.on('mount', () => {
            setTimeout(() => {
                this.editor = window.setupCodeEditor(this.refs.editor, {
                    model: scriptModels.get(this.script)
                });
                this.editor.onDidChangeModelContent(() => {
                    this.script.code = this.editor.getValue();
                });
                window.addEventListener('resize', updateEditorSize);
                window.signals.on('globalTabChanged', updateEditorSizeDeferred);
            }, 0);
        });
        this.on('update', () => {
            if (this.opts.script !== this.script) {
                this.script = this.opts.script;
                this.editor.setModel(scriptModels.get(this.script));
            }
        });
        this.on('unmount', () => {
            window.removeEventListener('resize', updateEditorSize);
            window.signals.off('globalTabChanged', updateEditorSizeDeferred);
            // Manually destroy the editor to free up the memory
            this.editor.dispose();
        });

        this.updateScriptName = e => {
            this.script.name = e.target.value.trim();
        };
