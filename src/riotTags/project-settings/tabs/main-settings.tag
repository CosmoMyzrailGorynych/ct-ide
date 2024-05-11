main-settings
    h1
        span {voc.main.heading}
    h2
        svg.feather
            use(xlink:href='#edit')
        span {voc.authoring.heading}
    b {voc.authoring.title}
    br
    input(type="text" value="{authoring.title}" onchange="{changeTitle}")
    br
    b {voc.authoring.author}
    br
    input(type="text" value="{authoring.author}" onchange="{wire('authoring.author')}")
    br
    b {voc.authoring.site}
    br
    input(type="text" value="{authoring.site}" onchange="{wire('authoring.site')}")
    br
    b {voc.authoring.version}
    br
    input(type="number" style="width: 1.5rem;" value="{authoring.version[0]}" length="3" min="0" onchange="{wire('authoring.version.0')}")
    |  .
    input(type="number" style="width: 1.5rem;" value="{authoring.version[1]}" length="3" min="0" onchange="{wire('authoring.version.1')}")
    |  .
    input(type="number" style="width: 1.5rem;" value="{authoring.version[2]}" length="3" min="0" onchange="{wire('authoring.version.2')}")
    .inlineblock
        |   {voc.authoring.versionPostfix}
        input(type="text" style="width: 3rem;" value="{authoring.versionPostfix}" length="5" onchange="{wire('authoring.versionPostfix')}")
    br
    b {voc.authoring.appId}
    hover-hint(text="{voc.authoring.appIdExplanation}")
    br
    input(type="text" value="{authoring.appId}" onchange="{wire('authoring.appId')}")

    h2 {voc.main.miscHeading}
    b {voc.main.backups}
    br
    input(type="number" value="{currentProject.backups ?? 3}" min="0" max="25" onchange="{wire('currentProject.backups')}")

    script.
        this.namespace = 'settings';
        this.mixin(require('src/node_requires/riotMixins/voc').default);
        this.mixin(require('src/node_requires/riotMixins/wire').default);
        this.currentProject = window.currentProject;
        this.authoring = this.currentProject.settings.authoring;

        this.changeTitle = e => {
            this.authoring.title = e.target.value.trim();
        };
