actions-editor.panel.view.pad
    .panel.pad.flexfix.tall
        .flexfix-header
            h1 
                | {voc.actionsEditor}
                docs-shortcut(path="/actions.href")
            p(if="{!currentProject.actions || !currentProject.actions.length}") {voc.noActionsYet}
        .flexfix-body(if="{!currentProject.actions || !currentProject.actions.length}")
            button.nml(onclick="{addNewAction}")
                i.icon-plus
                span   {vocGlob.add}
        .flexfix-body.aStrippedList.nmt(if="{currentProject.actions && currentProject.actions.length}")
            li.hide800.npl.npr
                .c4.npt.npb.npl
                    b {voc.actions}
                .c8.npt.npb.npr
                    b {voc.methods}
                .clear
            li.npl.npt(each="{action, ind in currentProject.actions}")
                .c4.npl.breakon800
                    .flexrow.middle
                        div.relative.wide
                            input.wide(type="text" placeholder="{voc.inputActionNamePlaceholder}" value="{action.name}" onchange="{wire('window.currentProject.actions.'+ ind +'.name')}")
                            .anErrorNotice(if="{nameTaken === action.name}") {vocGlob.nametaken} 
                        .spacer
                        i.a.icon-x(title="{voc.deleteAction}" onclick="{deleteAction}")
                .c8.npr.breakon800
                    ul.aStrippedList.nmt
                        li.flexrow.middle.npl(each="{method, mInd in action.methods}")
                            .fifty.npt.npl.npb
                                code.inline {method.code}
                            .fifty.npt.npr.npb
                                b {voc.multiplier}:
                                input.short(
                                    type="number" step="0.1"
                                    value="{method.multiplier === void 0? 1 : method.multiplier}"
                                    onchange="{wire('window.currentProject.actions.'+ ind +'.methods.'+ mInd +'.multiplier')}"
                                )
                            i.icon-x.a(title="{voc.deleteMethod}" onclick="{deleteMethod(action)}")
                    button.nml(onclick="{addMethod}")
                        i.icon-plus
                        span   {voc.addMethod}
                .clear
            p
                button.nml(onclick="{addNewAction}")
                    i.icon-plus
                    span   {voc.addAction}
        .flexfix-footer
            button.wide(onclick="{saveActions}")
                i.icon-save
                span   {vocGlob.save}
    .dimmer(show="{addingMethod}")
        method-selector(action="{editedAction}" ref="methodSelector")
    script.
        currentProject.actions = currentProject.actions || [];
        this.namespace = 'actionsEditor';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.addNewAction = e => {
            currentProject.actions.push({
                name: 'NewAction',
                methods: []
            });
        };
        this.deleteAction = e => {
            const ind = currentProject.actions.indexOf(e.item.action);
            currentProject.actions.splice(ind, 1);
        };
        this.addMethod = e => {
            this.addingMethod = true;
            this.editedAction = e.item.action;
            setTimeout(() => {
                this.refs.methodSelector.refs.searchField.focus();
            }, 0);
        };
        this.deleteMethod = action => e => {
            const ind = action.methods.indexOf(e.item.method);
            action.methods.splice(ind, 1);
        };
        this.saveActions = e => {
            this.parent.editingActions = false;
            this.parent.update();
        };