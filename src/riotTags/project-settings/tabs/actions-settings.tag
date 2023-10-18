actions-settings
    h1
        | {voc.heading}
        docs-shortcut(path="/actions.html")
    p(if="{!global.currentProject.actions || !global.currentProject.actions.length}") {voc.noActionsYet}
    div(if="{!global.currentProject.actions || !global.currentProject.actions.length}")
        button.nml(onclick="{addNewAction}")
            svg.feather
                use(xlink:href="#plus")
            span {voc.makeFromScratch}
        h2 {voc.presets}
        button.nml(onclick="{addXYMovementPreset}")
            svg.feather
                use(xlink:href="#move")
            span {voc.presetXYMovement}
        button.nml(onclick="{addTouchAndMousePreset}")
            svg.feather
                use(xlink:href="#smartphone")
            span {voc.presetTouchAndMouse}
        button.nml(onclick="{importCustomPreset}")
            svg.feather
                use(xlink:href="#download")
            span {voc.presetCustom}
    div(if="{global.currentProject.actions && global.currentProject.actions.length}")
        li.hide800.npl.npr
            .c4.npt.npb.npl
                b {voc.actions}
            .c8.np
                b {voc.methods}
            .clear
        li.npl.npt(each="{action, ind in global.currentProject.actions}")
            .c4.npl.breakon800
                .flexrow.middle
                    div.relative.wide
                        input.wide(type="text" placeholder="{voc.inputActionNamePlaceholder}" value="{action.name}" onchange="{checkActionNameAndSave}")
                        .anErrorNotice(if="{nameTaken === action.name}" ref="errors") {vocGlob.nameTaken}
                        .anErrorNotice(if="{action.name.trim() === ''}" ref="errors") {vocGlob.cannotBeEmpty}
                    .aSpacer
                    svg.feather.a(title="{voc.deleteAction}" onclick="{deleteAction}")
                        use(xlink:href="#x")
            .c8.npr.npl.breakon800
                ul.aStripedList.nmt
                    li.flexrow.middle.npl(each="{method, mInd in action.methods}")
                        .fifty.npt.npl.npb
                            code.inline {method.code}
                            svg.feather.orange(if="{!(method.code.split('.')[0] in global.currentProject.libs)}" title="{voc.methodModuleMissing}")
                                use(xlink:href="#alert-circle")
                        .fifty.npt.npr.npb
                            b {voc.multiplier}:
                            input.short(
                                type="number" step="0.1"
                                value="{method.multiplier === void 0? 1 : method.multiplier}"
                                onchange="{wire('global.currentProject.actions.'+ ind +'.methods.'+ mInd +'.multiplier')}"
                            )
                        svg.feather.a(title="{voc.deleteMethod}" onclick="{deleteMethod(action)}")
                            use(xlink:href="#x")
                button.nml(onclick="{addMethod}")
                    svg.feather
                        use(xlink:href="#plus")
                    span   {voc.addMethod}
            .clear
        p
            button.nml(onclick="{addNewAction}")
                svg.feather
                    use(xlink:href="#plus")
                span {voc.addAction}
            button.nml(onclick="{exportActionPreset}")
                svg.feather
                    use(xlink:href="#upload")
                span {voc.exportActionPreset}
    .aDimmer(show="{addingMethod}")
        actions-input-selector(action="{editedAction}" ref="methodSelector")
    script.
        global.currentProject.actions = global.currentProject.actions || [];
        this.namespace = 'settings.actions';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.addNewAction = () => {
            global.currentProject.actions.push({
                name: 'NewAction',
                methods: []
            });
        };
        this.deleteAction = e => {
            const ind = global.currentProject.actions.indexOf(e.item.action);
            global.currentProject.actions.splice(ind, 1);
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
        this.checkActionNameAndSave = e => {
            this.nameTaken = void 0;
            e.item.action.name = e.currentTarget.value.trim();
            const existingAction = global.currentProject.actions.find(action =>
                action !== e.item.action && action.name === e.item.action.name);
            if (existingAction) {
                this.nameTaken = e.item.action.name;
            }
        };

        const checkOrLoadModules = async (moduleNames) => {
            const modules = require('./data/node_requires/resources/modules');
            const promises = [];
            for (const i of moduleNames) {
                if (!modules.isModuleEnabled(i)) {
                    promises.push(modules.enableModule(i));
                }
            }
            if (promises.length) {
                await Promise.all(promises);
            }
        };
        // Presets
        // eslint-disable-next-line max-lines-per-function
        this.addXYMovementPreset = async () => {
            await checkOrLoadModules(['pointer', 'gamepad', 'keyboard', 'vkeys']);
            window.currentProject.actions = [{
                name: 'MoveX',
                methods: [{
                    code: 'keyboard.KeyD'
                }, {
                    code: 'keyboard.KeyA',
                    multiplier: -1
                }, {
                    code: 'keyboard.ArrowRight'
                }, {
                    code: 'keyboard.ArrowLeft',
                    multiplier: -1
                }, {
                    code: 'gamepad.Right'
                }, {
                    code: 'gamepad.Left',
                    multiplier: -1
                }, {
                    code: 'gamepad.LStickX'
                }, {
                    code: 'vkeys.Vjoy1X'
                }]
            }, {
                name: 'MoveY',
                methods: [{
                    code: 'keyboard.KeyW',
                    multiplier: -1
                }, {
                    code: 'keyboard.KeyS'
                }, {
                    code: 'keyboard.ArrowUp',
                    multiplier: -1
                }, {
                    code: 'keyboard.ArrowDown'
                }, {
                    code: 'gamepad.Up',
                    multiplier: -1
                }, {
                    code: 'gamepad.Down'
                }, {
                    code: 'gamepad.LStickY'
                }, {
                    code: 'vkeys.Vjoy1Y'
                }]
            }, {
                name: 'Jump',
                methods: [{
                    code: 'keyboard.Space'
                }, {
                    code: 'vkeys.Vk2'
                }, {
                    code: 'gamepad.Button1'
                }]
            }, {
                name: 'Sprint',
                methods: [{
                    code: 'keyboard.ShiftLeft'
                }, {
                    code: 'keyboard.ShiftRight'
                }, {
                    code: 'vkeys.Vk3'
                }, {
                    code: 'gamepad.Button2'
                }]
            }, {
                name: 'Crouch',
                methods: [{
                    code: 'keyboard.ControlLeft'
                }, {
                    code: 'keyboard.ControlRight'
                }, {
                    code: 'vkeys.Vk4'
                }, {
                    code: 'gamepad.Button3'
                }]
            }, {
                name: 'Shoot',
                methods: [{
                    code: 'pointer.Primary'
                }, {
                    code: 'vkeys.Vk1'
                }, {
                    code: 'gamepad.L2'
                }, {
                    code: 'gamepad.R2'
                }]
            }];
            this.update();
            this.refs.methodSelector.update();
        };
        this.addTouchAndMousePreset = async () => {
            await checkOrLoadModules(['pointer']);
            window.currentProject.actions = [{
                name: 'Press',
                methods: [{
                    code: 'pointer.Primary'
                }]
            }, {
                name: 'AltPress',
                methods: [{
                    code: 'pointer.Secondary'
                }, {
                    code: 'pointer.Double'
                }]
            }, {
                name: 'Scale',
                methods: [{
                    code: 'pointer.DeltaPinch'
                }, {
                    code: 'pointer.Wheel'
                }]
            }];
            this.update();
            this.methodSelector.update();
        };

        this.importCustomPreset = async () => {
            const filePath = await window.showOpenDialog({
                title: '',
                filter: '.json'
            });
            if (!filePath) {
                return;
            }
            const fs = require('fs-extra');
            const preset = await fs.readJSON(filePath);
            if (!preset || !preset.inputModules || !preset.actions) {
                window.alertify.error(this.voc.importErrorNotCtJsPreset);
                return;
            }
            const modules = require('./data/node_requires/resources/modules');
            const notInstalled = await modules.checkModulesExistence(preset.inputModules);
            if (notInstalled instanceof Array) {
                window.alertify.error(this.voc.importErrorMissingModules.replace('$1', notInstalled.join(', ')));
                return;
            }
            await checkOrLoadModules(preset.inputModules);
            // eslint-disable-next-line require-atomic-updates
            window.currentProject.actions = preset.actions;
            this.update();
        };
        this.exportActionPreset = async () => {
            const filePath = await window.showSaveDialog({
                defaultName: `Actions from ${window.currentProject.settings.authoring.title || 'a ct.js project'}.json`,
                filter: '.json'
            });
            if (!filePath) {
                return;
            }
            const writeData = {
                inputModules: [],
                actions: window.currentProject.actions
            };
            for (const action of window.currentProject.actions) {
                for (const method of action.methods) {
                    const partial = method.code.split('.');
                    partial.pop();
                    const moduleName = partial.join('.');
                    if (!writeData.inputModules.find(e => e === moduleName)) {
                        writeData.inputModules.push(moduleName);
                    }
                }
            }
            const fs = require('fs-extra');
            await fs.outputJSON(filePath, writeData);
            window.alertify.success(this.vocGlob.done);
        };
