actions-input-selector
    .aPanel.flexfix
        .flexfix-header
            .aSearchWrap.wide
                input.wide(
                    type="text"
                    ref="searchField"
                    value="{searchString}"
                    onkeyup="{wire('searchString')}"
                )
                svg.feather
                    use(xlink:href="#search")
        .flexfix-body
            virtual(each="{module in inputProviders}")
                h2 {module.name}
                label.anActionMethod.checkbox(
                    each="{name, code in module.methods}"
                    if="{!searchString || matchAny([name, code, module.name])}"
                )
                    code.inline.toright {module.code}.{code}
                    input(
                        type="checkbox" checked="{selectedMethods.indexOf(module.code+'.'+code) !== -1}"
                        onchange="{selectMethod(module.code+'.'+code)}"
                    )
                    span   {name}
                    .clear

        .flexfix-footer
            .flexrow
                button.nml.secondary(onclick="{cancel}")
                    span {voc.cancel}
                button.nml.secondary(onclick="{apply}" disabled="{!selectedMethods || selectedMethods.length === 0}")
                    span {voc.select} {selectedMethods.length || ''}
    script.
        this.namespace = 'common';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);

        const fs = require('fs-extra'),
              path = require('path');
        const libsDir = './data/ct.libs';

        this.selectedMethods = [];

        this.matchAny = strings =>
            strings.some(string => string.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1);

        this.refreshModules = () => {
            this.inputProviders = [];
            const promises = [];
            for (const modName in global.currentProject.libs) {
                const promise =
                    fs.readJSON(path.join(libsDir, modName, 'module.json'))
                    .then(catmod => {
                        if (catmod.inputMethods) {
                            this.inputProviders.push({
                                name: catmod.main.name,
                                code: modName,
                                methods: catmod.inputMethods
                            });
                        }
                    });
                promises.push(promise);
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

        this.selectMethod = (code) => () => {
            if (this.selectedMethods) {
                const ind = this.selectedMethods.indexOf(code);
                if (ind > -1) {
                    this.selectedMethods.splice(ind, 1);
                } else {
                    this.selectedMethods.push(code);
                }
            } else {
                this.selectedMethods = [code];
            }
        };
        this.cancel = () => {
            this.searchString = '';
            this.selectedMethods = [];
            this.parent.addingMethod = false;
            this.parent.update();
        };
        this.apply = () => {
            this.selectedMethods.forEach((code) => {
                // Skip input methods that already exist in the action
                if (this.opts.action.methods.some(method => method.code === code)) {
                    return;
                }
                this.opts.action.methods.push({
                    code
                });
            });
            this.searchString = '';
            this.selectedMethods = [];
            this.parent.addingMethod = false;
            this.parent.update();
        };
