project-settings.panel.view.pad.flexrow
    -
        var tabs = ['authoring', 'actions', 'branding', 'rendering', 'scripts'];
        var iconMap = {
            authoring: 'edit',
            actions: 'airplay',
            branding: 'droplet',
            rendering: 'room',
            scripts: 'terminal',
            default: 'settings'
        };
    aside.nogrow.noshrink
        ul.nav.tabs.vertical
            // A bit of Pug sorcery, destroyed by Riot.js syntax
            // Iterate over an array of sections. Template out Riot syntax inside `these` backticks.
            each name in tabs
                li(onclick=`{openTab('${name}')}` class=`{active: tab === '${name}'}` title=`{voc.${name}.heading}`)
                    svg.feather
                        use(xlink:href=`data/icons.svg#${(name in iconMap)? iconMap[name] : iconMap.default}`)
                    span='{voc.' + name + '.heading}'
    main
        each name in tabs
            div(if=`{tab === '${name}'}`)
                // This outputs a templated tag name. Magic!
                #{name + '-settings'}
    script.
        this.namespace = 'settings';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = global.currentProject;
        this.currentProject.settings.fps = this.currentProject.settings.fps || 30;

        this.tab = 'authoring';
        this.openTab = tab => () => {
            this.tab = tab;
        };