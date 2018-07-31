script-editor.view.panel
    .flexfix.tall
        div.flexfix-header
            b {voc.name}  
            input(type="text" value="{script.name}" onchange="{wire('this.script.name')}")
        .flexfix-body
            .acer(ref="editor")
        button.nm.flexfix-footer(onclick="{saveScript}")
            i.icon.icon-confirm
            span {voc.done}
    script.
        this.namespace = 'common';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.script = this.opts.script;
        this.on('mount', e => {
            setTimeout(() => {
                var editorOptions = {
                    mode: 'javascript'
                };
                this.editor = window.setupAceEditor(this.refs.editor, editorOptions);
                this.editor.session.on('change', e => {
                    this.script.code = this.editor.getValue();
                });
                this.editor.setValue(this.script.code);
            }, 0);
        });
        this.saveScript = e => {
            this.parent.currentScript = null;
            this.parent.update();
        };