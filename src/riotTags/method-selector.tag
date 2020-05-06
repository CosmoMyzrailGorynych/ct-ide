method-selector
    .panel.flexfix
        .flexfix-header
            .aSearchWrap.wide
                input.wide(
                    type="text" 
                    ref="searchField"
                    value="{searchString}"
                    onkeyup="{wire('this.searchString')}"
                )
        .flexfix-body
            virtual(each="{module in inputProviders}")
                h2 {module.name}
                .anActionMethod(
                    onclick="{selectMethod(module.code+'.'+code)}"
                    each="{name, code in module.methods}"
                    class="{active: selectedMethod === module.code+'.'+code}"
                    if="{!searchString || code.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 || name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1}"
                ).npl
                    code.inline.toright {module.code}.{code}
                    span   {name}
                    .clear

        .flexfix-footer
            .flexrow
                button.nml.secondary(onclick="{cancel}")
                    span {vocGlob.cancel}
                button.nml.secondary(onclick="{apply}" disabled="{!selectedMethod}")
                    span {voc.select}
    script.
        this.namespace = 'inputMethodSelector';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        const fs = require('fs-extra'),
              path = require('path');
        const libsDir = './data/ct.libs';

        this.refreshModules = e => {
            this.inputProviders = [];
            const promises = [];
            for (const modName in global.currentProject.libs) {
                promises.push(
                    fs.readJSON(path.join(libsDir, modName, 'module.json'))
                    .then(data => {
                        if (data.inputMethods) {
                            this.inputProviders.push({
                                name: data.main.name,
                                code: modName,
                                methods: data.inputMethods
                            });
                        }
                    })
                );
            }
            Promise.all(promises)
            .finally(() => {
                this.update();
            });
        };
        this.refreshModules();
        
        window.signals.on('modulesChanged', this.refreshModules);
        this.on('unmount', () => {
            window.signals.off('modulesChanged', this.refreshModules);
        });

        this.selectMethod = code => e => {
            this.selectedMethod = code;
        };
        this.cancel = e => {
            this.searchString = '';
            this.selectedMethod = '';
            this.parent.addingMethod = false;
            this.parent.update();
        };
        this.apply = e => {
            this.opts.action.methods.push({
                code: this.selectedMethod
            });
            this.searchString = '';
            this.selectedMethod = '';
            this.parent.addingMethod = false;
            this.parent.update();
        };