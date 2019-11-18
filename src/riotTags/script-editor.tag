script-editor.view.panel
    .flexfix.tall
        div.flexfix-header
            b {voc.name}
            input(type="text" value="{script.name}" onchange="{wire('this.script.name')}")
        .flexfix-body
            .aCodeEditor(ref="editor")
        button.nm.flexfix-footer(onclick="{saveScript}")
            i.icon.icon-confirm
            span {voc.done}
    script.
        this.namespace = 'common';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.script = this.opts.script;
        const updateEditorSize = () => {
            this.editor.layout();
        };
        const updateEditorSizeDeferred = function () {
            setTimeout(updateEditorSize, 0);
        };
        this.on('unmount', () => {
            window.removeEventListener('resize', updateEditorSize);
            window.signals.off('settingsFocus', updateEditorSizeDeferred);
        });
        this.on('mount', e => {
            setTimeout(() => {
                var editorOptions = {
                    language: 'javascript'
                };
                this.editor = window.setupCodeEditor(this.refs.editor, editorOptions);
                this.editor.onDidChangeModelContent(e => {
                    this.script.code = this.editor.getValue();
                });
                this.editor.setValue(this.script.code);
                window.addEventListener('resize', updateEditorSize);
                window.signals.on('settingsFocus', updateEditorSizeDeferred);
            }, 0);
        });
        this.on('unmount', () => {
            // Manually destroy the editor to free up the memory
            this.editor.dispose();
        });

        this.saveScript = e => {
            this.parent.currentScript = null;
            this.parent.update();
        };