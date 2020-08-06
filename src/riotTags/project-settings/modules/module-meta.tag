module-meta(onclick="{toggleModule(opts.module.name)}")
    .flexrow
        div
            h1 {opts.module.manifest.main.name}
            code {opts.module.name} v{opts.module.manifest.main.version}
        label.nogrow.bigpower(class="{off: !(opts.module.name in global.currentProject.libs)}")
            svg.feather
                use(xlink:href="data/icons.svg#{opts.module.name in global.currentProject.libs? 'check' : 'x'}")
            span
    .hsub(if="{opts.module.manifest.main.tagline}") {opts.module.manifest.main.tagline}

    div(if="{opts.module.manifest.dependencies && opts.module.manifest.dependencies.length}")
        b {voc.dependencies}
        .inlineblock(each="{dependency in opts.module.manifest.dependencies}")
            svg.feather(if="{dependency in global.currentProject.libs}").success
                use(xlink:href="data/icons.svg#check")
            svg.feather(if="{!(dependency in global.currentProject.libs)}").error
                use(xlink:href="data/icons.svg#alert-circle")
            span   {dependency}
    div(if="{opts.module.manifest.optionalDependencies && opts.module.manifest.optionalDependencies.length}")
        b {voc.optionalDependencies}
        .inlineblock(each="{dependency in opts.module.manifest.optionalDependencies}")
            svg.feather(if="{dependency in global.currentProject.libs}").success
                use(xlink:href="data/icons.svg#check")
            svg.feather(if="{!(dependency in global.currentProject.libs)}").warning
                use(xlink:href="data/icons.svg#alert-triangle")
            span   {dependency}

    .filler

    .flexrow
        .aModuleAuthorList
            a.external(
                each="{author in opts.module.manifest.main.authors}"
                onclick="{stopPropagation}"
                title="{voc.author}"
                href="{author.site || 'mailto:'+author.mail}"
            )
                svg.feather
                    use(xlink:href="data/icons.svg#user")
                span {author.name}
        svg.feather.aModuleIcon
            use(xlink:href="data/icons.svg#{getIcon(opts.module)}")
    script.
        this.namespace = 'modules';
        this.mixin(window.riotVoc);

        const {getIcon} = require('./data/node_requires/resources/modules');

        this.getIcon = getIcon;

        const glob = require('./data/node_requires/glob');

        const tryLoadTypedefs = () => {
            const fs = require('fs-extra'),
                  path = require('path');
            if (!(this.opts.module.name in global.currentProject.libs)) {
                return;
            }
            const typedefPath = path.join(this.opts.module.path, 'types.d.ts');
            fs.pathExists(typedefPath)
            .then(exists => {
                const ts = monaco.languages.typescript;
                if (!exists) {
                    // generate dummy typedefs if none were provided by the module
                    const catmodTypedefs = `declare namespace ct {\n/** Sorry, no in-code docs for this module :c */\n var ${this.opts.module.name}: any; }`;
                    glob.moduleTypings[this.opts.module.name] = [
                        ts.javascriptDefaults.addExtraLib(catmodTypedefs),
                        ts.typescriptDefaults.addExtraLib(catmodTypedefs)
                    ];
                    return;
                }
                fs.readFile(typedefPath, 'utf8')
                .then(catmodTypedefs => {
                    glob.moduleTypings[this.opts.module.name] = [
                        ts.javascriptDefaults.addExtraLib(catmodTypedefs),
                        ts.typescriptDefaults.addExtraLib(catmodTypedefs)
                    ];
                });
            });
        };
        const removeTypedefs = () => {
            if (glob.moduleTypings[this.opts.module.name]) {
                for (const lib of glob.moduleTypings[this.opts.module.name]) {
                    lib.dispose();
                }
            }
        };
        const addDefaults = () => {
            const {name} = this.opts.module;
            for (const field of this.opts.module.manifest.fields) {
                if (!global.currentProject.libs[name][field.key]) {
                    if (field.default) {
                        global.currentProject.libs[name][field.key] = field.default;
                    } else if (field.type === 'number') {
                        global.currentProject.libs[name][field.key] = 0;
                    } else if (field.type === 'checkbox') {
                        global.currentProject.libs[name][field.key] = false;
                    } else {
                        global.currentProject.libs[name][field.key] = '';
                    }
                }
            }
        };

        this.toggleModule = () => e => {
            if (global.currentProject.libs[this.opts.module.name]) {
                delete global.currentProject.libs[this.opts.module.name];
                removeTypedefs();
            } else {
                global.currentProject.libs[this.opts.module.name] = {};
                tryLoadTypedefs();
                // 'Settings' page
                if (this.opts.module.manifest.fields) {
                    addDefaults();
                }
            }
            window.signals.trigger('modulesChanged');
            glob.modified = true;
            e.stopPropagation();
        };

        this.stopPropagation = e => {
            e.stopPropagation();
        };
