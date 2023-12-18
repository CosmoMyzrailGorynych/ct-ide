project-settings.aPanel.aView.pad.flexrow
    -
        var tabs = ['authoring', 'actions', 'branding', 'content', 'modules', 'scripts', 'rendering', 'export'];
        var iconMap = {
            authoring: 'edit',
            actions: 'airplay',
            branding: 'droplet',
            'content': 'table-sidebar',
            modules: 'ctmod',
            rendering: 'room',
            scripts: 'terminal',
            export: 'settings',
            default: 'settings'
        };
    aside.nogrow.noshrink
        ul.aNav.vertical.nbr
            // A bit of Pug sorcery, destroyed by Riot.js syntax
            // Iterate over an array of sections. Template out Riot syntax inside `these` backticks.
            each name in tabs
                li(onclick=`{openTab('${name}')}` class=`{active: tab === '${name}'}` title=`{voc.${name}.heading}` ref=`${name}Tab`)
                    svg.feather
                        use(xlink:href=`#${(name in iconMap)? iconMap[name] : iconMap.default}`)
                    span='{voc.' + name + '.heading}'
        h3(if="{modulesWithFields.length}") {voc.catmodsSettings}
        ul(if="{modulesWithFields.length}").aNav.vertical.nbr
            li(
                each="{module in modulesWithFields}"
                onclick="{openModuleSettings(module)}"
                class="{active: tab === 'moduleSettings' && currentModule === module}"
                title="{module.manifest.main.name}"
            )
                svg.feather
                    use(xlink:href=`#{getIcon(module)}`)
                span {localizeField(module.manifest.main, 'name')}
        h3(if="{currentProject.contentTypes && currentProject.contentTypes.length}") {voc.contentTypes}
        ul(if="{currentProject.contentTypes && currentProject.contentTypes.length}").aNav.vertical.nbr
            li(
                each="{contentType in currentProject.contentTypes}"
                onclick="{openContentType(contentType)}"
                class="{active: tab === 'contentEntriesEditor' && currentContentType === contentType}"
                title="{contentType.readableName || contentType.name || voc.content.missingTypeName}"
            )
                svg.feather
                    use(xlink:href=`#{contentType.icon || 'copy'}`)
                span {contentType.readableName || contentType.name || voc.content.missingTypeName}
    main.aPanel
        each name in tabs
            div(if=`{tab === '${name}'}`)
                // This outputs a templated tag name. Magic!
                #{name + '-settings'}
        .pad(if="{tab === 'moduleSettings' && currentModule}")
            h1 {localizeField(currentModule.manifest.main, 'name')}
            extensions-editor(customextends="{currentModule.manifest.fields}" entity="{global.currentProject.libs[currentModule.name]}")
        content-editor(if="{tab === 'contentEntriesEditor' && currentContentType}" contenttype="{currentContentType}")
    script.
        this.namespace = 'settings';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        this.mixin(require('./data/node_requires/riotMixins/wire').default);
        this.currentProject = global.currentProject;
        this.currentProject.settings.fps = this.currentProject.settings.fps || 30;

        this.tab = 'authoring';
        this.openTab = tab => () => {
            this.tab = tab;
            this.currentModule = null;
            this.currentContentType = null;
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

        const contentEditorListener = contentType => {
            this.tab = 'contentEntriesEditor';
            this.currentContentType = contentType;
            this.update();
        };
        window.orders.on('openContentEntries', contentEditorListener);
        this.on('unmount', () => {
            window.orders.off('openContentEntries', contentEditorListener);
        });
        this.rerender = () => {
            this.update();
        };
        window.signals.on('contentTypeCreated', this.rerender);
        this.on('unmount', () => {
            window.signals.off('contentTypeCreated', this.rerender);
        });

        this.openModuleSettings = module => () => {
            this.currentContentType = null;
            this.currentModule = module;
            this.tab = 'moduleSettings';
        };
        this.openContentType = type => () => {
            this.currentModule = null;
            this.currentContentType = type;
            this.tab = 'contentEntriesEditor';
        };
