scripts-panel
    h1.flexfix-header {voc.header}
    ul.menu.flexfix-body
        li(each="{script in currentProject.scripts}" onclick="{selectScript}")
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
        this.currentProject = window.currentProject;
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
            var script = e.item.script,
                ind = this.currentProject.scripts.indexOf(script);
            this.currentProject.scripts.splice(ind, 1);
            e.stopPropagation();
        };