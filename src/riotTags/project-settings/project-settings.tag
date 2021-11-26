project-settings.panel.view.pad.flexrow
    -
        var tabs = ['authoring', 'actions', 'branding', 'modules', 'scripts', 'rendering', 'export'];
        var iconMap = {
            authoring: 'edit',
            actions: 'airplay',
            branding: 'droplet',
            modules: 'ctmod',
            rendering: 'room',
            scripts: 'terminal',
            export: 'settings',
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
        h3(if="{modulesWithFields.length}") {voc.catmodsSettings}
        ul(if="{modulesWithFields.length}").nav.tabs.vertical
            li(
                each="{module in modulesWithFields}"
                onclick="{openModuleSettings(module)}"
                class="{active: tab === 'moduleSettings' && currentModule === module}"
                title="{module.manifest.main.name}"
            )
                svg.feather
                    use(xlink:href=`data/icons.svg#{getIcon(module)}`)
                span {module.manifest.main.name}
    main
        each name in tabs
            div(if=`{tab === '${name}'}`)
                // This outputs a templated tag name. Magic!
                #{name + '-settings'}
        .pad(if="{currentModule}")
            h1 {currentModule.manifest.main.name}
            extensions-editor(customextends="{currentModule.manifest.fields}" entity="{global.currentProject.libs[currentModule.name]}")
    script.
        this.namespace = 'settings';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);
        this.currentProject = global.currentProject;
        this.currentProject.settings.fps = this.currentProject.settings.fps || 30;

        this.tab = 'authoring';
        this.openTab = tab => () => {
            this.tab = tab;
            this.currentModule = null;
        };

        const {loadModules, getIcon} = require('./data/node_requires/resources/modules');
        this.getIcon = getIcon;

        this.modulesWithFields = [];
        this.updateModulesWithFields = async () => {
            this.modulesWithFields = (await loadModules())
                .filter(module => module.name in global.currentProject.libs)
                .filter(module => module.manifest.fields);
            this.update();
        };
        this.updateModulesWithFields();
        window.signals.on('modulesChanged', this.updateModulesWithFields);
        this.on('unmount', () => {
            window.signals.off('modulesChanged', this.updateModulesWithFields);
        });

        this.openModuleSettings = module => () => {
            this.currentModule = module;
            this.tab = 'moduleSettings';
        };
