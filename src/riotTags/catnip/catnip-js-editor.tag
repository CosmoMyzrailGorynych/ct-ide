//-
    A JavaScript code editor with no minimap to be put into catnip blocks.

    @attribute values (Record<string, any>)
        An object that has all the block's values. It must have values[key] preset.
    @attribute key (string)
        The key to modify in block's values.
    @attribute [readonly] (atomic)

catnip-js-editor
    .catnip-js-editor-aCodeEditor(ref="codebox")
    script.
        const editorOptions = {
            language: 'typescript',
            lockWrapper: true,
            minimap: {
                autohide: true
            },
            links: false
        };
        const layout = () => {
            setTimeout(() => {
                if (this.codeEditor) {
                    this.codeEditor.layout();
                }
            }, 150);
        };
        this.on('mount', () => {
            setTimeout(() => {
                this.codeEditor = window.setupCodeEditor(
                    this.refs.codebox,
                    Object.assign({}, editorOptions, {
                        readOnly: Boolean(this.opts.readonly),
                        value: !this.opts.readonly ? this.opts.values[this.opts.key] : '// ...',
                        wrapper: ['import * as pixiTemp from \'bundles/pixi.js/src/index\'; function catnipJs(this: pixiTemp.DisplayObject & Record<string, any>) {', '}']
                    })
                );
                this.codeEditor.onDidChangeModelContent(() => {
                    this.opts.values[this.opts.key] = this.codeEditor.getPureValue();
                });
                window.addEventListener('resize', layout);
            }, 0);
        });
        window.orders.on('forceCodeEditorLayout', layout);
        this.on('unmount', () => {
            window.removeEventListener('resize', layout);
            window.orders.off('forceCodeEditorLayout', layout);
            // Manually destroy code editors, to free memory
            if (this.codeEditor) {
                this.codeEditor.dispose();
            }
        });
