scripts-settings.flexrow(class="{opts.class}")
    aside.flexfix
        ul.aMenu.flexfix-body
            li(each="{script, index in window.currentProject.scripts}" onclick="{selectScript}" class="{active: currentScript === script}")
                .crop {script.name}
                .scripts-settings-ScriptActions
                    .anActionableIcon(onclick="{moveUp}" title="{voc.moveUp}" if="{index !== 0}")
                        svg.feather
                            use(xlink:href="#arrow-up")
                    .anActionableIcon(onclick="{moveDown}" if="{index !== window.currentProject.scripts.length - 1}" title="{voc.moveDown}").nml
                        svg.feather
                            use(xlink:href="#arrow-down")
                    .anActionableIcon(onclick="{deleteScript}" title="{voc.deleteScript}")
                        svg.feather.red
                            use(xlink:href="#delete")
        button.flexfix-footer(onclick="{addNewScript}")
            svg.feather
                use(xlink:href="#plus")
            span {voc.addNew}
    project-script-editor(if="{currentScript}" script="{currentScript}")
    .dim.pad(if="{!currentScript}") {voc.scriptsHint}
    script.
        this.namespace = 'settings.scripts';
        this.mixin(require('src/lib/riotMixins/voc').default);
        this.currentProject = window.currentProject;
        this.currentProject.scripts = this.currentProject.scripts || [];

        const {dropScriptModel, addScriptModel} = require('src/lib/resources/projects/scripts');

        this.addNewScript = () => {
            const oldScriptNames = this.currentProject.scripts.map(script => script.name);
            let newName = 'New Script';
            for (let i = 1; oldScriptNames.indexOf(newName) !== -1; i++) {
                newName = `New Script ${i}`;
            }
            const script = {
                name: newName,
                code: `/* ${this.voc.newScriptComment} */`
            };
            addScriptModel(script);
            this.currentProject.scripts.push(script);
            this.currentScript = script;
        };
        this.selectScript = e => {
            this.currentScript = e.item.script;
        };
        this.deleteScript = e => {
            const {script} = e.item,
                  ind = this.currentProject.scripts.indexOf(script);
            this.currentProject.scripts.splice(ind, 1);
            dropScriptModel(script);
            e.stopPropagation();
        };

        this.moveUp = e => {
            e.stopPropagation();
            const clickedScript = e.item.script;
            const top = [];
            const bottom = [];
            let topPush = true;
            for (const projScript of this.currentProject.scripts) {
                if (projScript === clickedScript) {
                    topPush = false;
                } else if (topPush) {
                    top.push(projScript);
                } else {
                    bottom.push(projScript);
                }
            }
            top.splice(top.length - 1, 0, clickedScript);
            const out = [...top, ...bottom];
            this.currentProject.scripts = out;
        };

        this.moveDown = e => {
            e.stopPropagation();
            const clickedScript = e.item.script;
            const top = [];
            const bottom = [];
            let topPush = true;
            for (const projScript of this.currentProject.scripts) {
                if (projScript === clickedScript) {
                    topPush = false;
                } else if (topPush) {
                    top.push(projScript);
                } else {
                    bottom.push(projScript);
                }
            }
            bottom.splice(1, 0, clickedScript);
            const out = [...top, ...bottom];
            this.currentProject.scripts = out;
        };
