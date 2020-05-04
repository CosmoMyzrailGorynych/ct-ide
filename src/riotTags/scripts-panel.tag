scripts-panel
    h1.flexfix-header {voc.header}
    ul.menu.flexfix-body
        li(each="{script, index in global.currentProject.scripts}" onclick="{selectScript}")
            code {script.name}
            div.toright.scripts-panel-aDeleteButton(onclick="{deleteScript}" title="{voc.deleteScript}")
                svg.feather.dim
                    use(xlink:href="data/icons.svg#delete")
            // Use opacity to keep nice layout
            div.toright(onclick="{moveDown}"  style="opacity: {index === global.currentProject.scripts.length - 1? 0 : 1};" title="{voc.moveDown}")
                svg.feather.dim
                    use(xlink:href="data/icons.svg#arrow-down")
            div.toright(onclick="{moveUp}" title="{voc.moveUp}" style="opacity: {index === 0? 0 : 1};")
                svg.feather.dim
                    use(xlink:href="data/icons.svg#arrow-up")
    button.flexfix-footer(onclick="{addNewScript}")
        svg.feather
            use(xlink:href="data/icons.svg#plus")
        span {voc.addNew}
    script-editor(if="{currentScript}" script="{currentScript}")
    script.
        this.namespace = 'settings.scripts';
        this.mixin(window.riotVoc);
        this.currentProject = global.currentProject;
        this.currentProject.scripts = this.currentProject.scripts || [];

        this.addNewScript = e => {
            var script = {
                name: 'New Script',
                code: `/* ${this.voc.newScriptComment} */`
            };
            this.currentProject.scripts.push(script);
            this.currentScript = script;
        };
        this.selectScript = e => {
            this.currentScript = e.item.script;
        };
        this.deleteScript = e => {
            const script = e.item.script,
                  ind = this.currentProject.scripts.indexOf(script);
            this.currentProject.scripts.splice(ind, 1);
            for (const lib of glob.scriptTypings[script.name]) {
                lib.dispose();
            }
            delete glob.scriptTypings[script.name];
            e.stopPropagation();
        };

        this.moveUp = e => {
            e.stopPropagation();
            let script = e.item.script;
            let topPush = true;
            let top = [];
            let bottom = [];
            for (const element of this.currentProject.scripts) {
                if (element === script) {
                    topPush = false;
                } else if (topPush) {
                    top.push(element);
                } else {
                    bottom.push(element);
                }
            }
            top.splice(top.length - 1, 0, script);
            const out = [...top, ...bottom];
            console.debug(out);
            this.currentProject.scripts = out;
        };

        this.moveDown = e => {
            e.stopPropagation();
            let script = e.item.script;
            let topPush = true;
            let top = [];
            let bottom = [];
            for (const element of this.currentProject.scripts) {
                if (element === script) {
                    topPush = false;
                } else if (topPush) {
                    top.push(element);
                } else {
                    bottom.push(element);
                }
            }
            bottom.splice(1, 0, script);
            const out = [...top, ...bottom];
            console.debug(out);
            this.currentProject.scripts = out;
        };

        const glob = require('./data/node_requires/glob');
        glob.scriptTypings = glob.scriptTypings || {};
        for (const script of global.currentProject.scripts) {
            glob.scriptTypings[script.name] = [
                monaco.languages.typescript.javascriptDefaults.addExtraLib(script.code),
                monaco.languages.typescript.typescriptDefaults.addExtraLib(script.code)
            ];
        }