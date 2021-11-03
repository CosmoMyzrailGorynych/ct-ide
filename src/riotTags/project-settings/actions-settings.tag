actions-settings
    h1
        | {voc.heading}
        docs-shortcut(path="/actions.html")
    p(if="{!global.currentProject.actions || !global.currentProject.actions.length}") {voc.noActionsYet}
    div(if="{!global.currentProject.actions || !global.currentProject.actions.length}")
        button.nml(onclick="{addNewAction}")
            svg.feather
                use(xlink:href="data/icons.svg#plus")
            span {voc.makeFromScratch}
        i.dim {voc.orPickPreset}
        button.nml(onclick="{addXYMovementPreset}")
            svg.feather
                use(xlink:href="data/icons.svg#move")
            span {voc.presetXYMovement}
        button.nml(onclick="{addTouchAndMousePreset}")
            svg.feather
                use(xlink:href="data/icons.svg#smartphone")
            span {voc.presetTouchAndMouse}
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
                        .anErrorNotice(if="{nameTaken === action.name}" ref="errors") {vocGlob.nametaken}
                        .anErrorNotice(if="{action.name.trim() === ''}" ref="errors") {vocGlob.cannotBeEmpty}
                    .spacer
                    svg.feather.a(title="{voc.deleteAction}" onclick="{deleteAction}")
                        use(xlink:href="data/icons.svg#x")
            .c8.npr.npl.breakon800
                ul.aStripedList.nmt
                    li.flexrow.middle.npl(each="{method, mInd in action.methods}")
                        .fifty.npt.npl.npb
                            code.inline {method.code}
                            svg.feather.orange(if="{!(method.code.split('.')[0] in global.currentProject.libs)}" title="{voc.methodModuleMissing}")
                                use(xlink:href="data/icons.svg#alert-circle")
                        .fifty.npt.npr.npb
                            b {voc.multiplier}:
                            input.short(
                                type="number" step="0.1"
                                value="{method.multiplier === void 0? 1 : method.multiplier}"
                                onchange="{wire('global.currentProject.actions.'+ ind +'.methods.'+ mInd +'.multiplier')}"
                            )
                        svg.feather.a(title="{voc.deleteMethod}" onclick="{deleteMethod(action)}")
                            use(xlink:href="data/icons.svg#x")
                button.nml(onclick="{addMethod}")
                    svg.feather
                        use(xlink:href="data/icons.svg#plus")
                    span   {voc.addMethod}
            .clear
        p
            button.nml(onclick="{addNewAction}")
                svg.feather
                    use(xlink:href="data/icons.svg#plus")
                span   {voc.addAction}
    .dimmer(show="{addingMethod}")
        actions-input-selector(action="{editedAction}" ref="methodSelector")
    script.
        global.currentProject.actions = global.currentProject.actions || [];
        this.namespace = 'settings.actions';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
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
            for (let i of moduleNames) {
                if (!modules.isModuleEnabled(i)) {
                    promises.push(modules.enableModule(i));
                }
            }
            if (promises.length) {
                await Promise.all(promises);
            }
        };
        // Presets
        this.addXYMovementPreset = async () => {
            await checkOrLoadModules(['touch', 'mouse', 'gamepad', 'keyboard', 'vkeys']);
            currentProject.actions = [{
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
                    code: 'mouse.Left'
                }, {
                    code: 'vkeys.Vk1'
                }, {
                    code: 'gamepad.L2'
                }, {
                    code: 'gamepad.R2'
                }]
            }];
            this.update();
            this.methodSelector.update();
        };
        this.addTouchAndMousePreset = async () => {
            await checkOrLoadModules(['touch', 'mouse']);
            currentProject.actions = [{
                name: 'Press',
                methods: [{
                    code: 'touch.Any'
                }, {
                    code: 'mouse.Left'
                }]
            }, {
                name: 'AltPress',
                methods: [{
                    code: 'touch.Double'
                }, {
                    code: 'mouse.Right'
                }]
            }, {
                name: 'Scale',
                methods: [{
                    code: 'touch.DeltaPinch'
                }, {
                    code: 'mouse.Wheel'
                }]
            }];
            this.update();
            this.methodSelector.update();
        };
