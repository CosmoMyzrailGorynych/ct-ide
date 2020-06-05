scripts-settings
    h1 {voc.heading}
    ul.menu
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
    button(onclick="{addNewScript}")
        svg.feather
            use(xlink:href="data/icons.svg#plus")
        span {voc.addNew}
    script-editor(if="{currentScript}" script="{currentScript}")
    script.
        this.namespace = 'settings.scripts';
        this.mixin(window.riotVoc);
        this.currentProject = global.currentProject;
        this.currentProject.scripts = this.currentProject.scripts || [];

        const glob = require('./data/node_requires/glob');
        glob.scriptTypings = glob.scriptTypings || {};
        for (const script of global.currentProject.scripts) {
            glob.scriptTypings[script.name] = [
                monaco.languages.typescript.javascriptDefaults.addExtraLib(script.code),
                monaco.languages.typescript.typescriptDefaults.addExtraLib(script.code)
            ];
        }

        this.addNewScript = () => {
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
            const {script} = e.item,
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