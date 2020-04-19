scripts-panel
    h1.flexfix-header {voc.header}
    ul.menu.flexfix-body
        li(each="{script in global.currentProject.scripts}" onclick="{selectScript}")
            code {script.name}
            div.toright(onclick="{deleteScript}" title="{voc.deleteScript}")
                svg.feather.dim
                    use(xlink:href="data/icons.svg#delete")
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

        const glob = require('./data/node_requires/glob');
        glob.scriptTypings = glob.scriptTypings || {};
        for (const script of global.currentProject.scripts) {
            glob.scriptTypings[script.name] = [
                monaco.languages.typescript.javascriptDefaults.addExtraLib(script.code),
                monaco.languages.typescript.typescriptDefaults.addExtraLib(script.code)
            ];
        }