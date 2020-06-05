script-editor
    .flexfix.tall
        div.flexfix-header
            b {voc.name}
            input(type="text" value="{script.name}" onchange="{updateScriptName}")
        .flexfix-body
            .aCodeEditor(ref="editor")
        button.nm.flexfix-footer(onclick="{saveScript}" title="Shift+Control+S" data-hotkey="Control+S")
            svg.feather
                use(xlink:href="data/icons.svg#check")
            span {voc.done}
    script.
        this.namespace = 'common';
        this.mixin(window.riotVoc);
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
        this.on('mount', () => {
            setTimeout(() => {
                var editorOptions = {
                    language: 'javascript'
                };
                this.editor = window.setupCodeEditor(this.refs.editor, editorOptions);
                this.editor.onDidChangeModelContent(() => {
                    this.script.code = this.editor.getValue();
                });
                this.editor.setValue(this.script.code);
                window.addEventListener('resize', updateEditorSize);
                window.signals.on('settingsFocus', updateEditorSizeDeferred);
            }, 0);
            this.oldName = this.script.name;
        });
        this.on('unmount', () => {
            // Manually destroy the editor to free up the memory
            this.editor.dispose();
        });

        this.saveScript = () => {
            const glob = require('./data/node_requires/glob');
            if (glob.scriptTypings[this.oldName]) {
                for (const lib of glob.scriptTypings[this.oldName]) {
                    lib.dispose();
                }
                delete glob.scriptTypings[this.oldName];
            }
            glob.scriptTypings[this.script.name] = [
                monaco.languages.typescript.javascriptDefaults.addExtraLib(this.script.code),
                monaco.languages.typescript.typescriptDefaults.addExtraLib(this.script.code)
            ];
            this.parent.currentScript = null;
            this.parent.update();
        };

        this.updateScriptName = e => {
            this.script.name = e.target.value.trim();
        };