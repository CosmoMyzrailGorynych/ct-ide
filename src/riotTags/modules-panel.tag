modules-panel.panel.view
    .flexrow.tall
        .c3.borderright.tall
            ul#moduleincluded
                li(each="{module in enabledModules}" onclick="{renderModule(module)}")
                    svg.feather.success
                        use(xlink:href="data/icons.svg#check")
                    span {module}
            ul#modulelist
                li(each="{module in allModules}" onclick="{renderModule(module)}")
                    svg.feather(class="{(module in global.currentProject.libs)? 'success on' : 'off'}")
                        use(xlink:href="data/icons.svg#{(module in global.currentProject.libs)? 'check' : 'ctmod'}")
                    span {module}
            label.file.flexfix-footer.nmb
                input(
                    type="file"
                    ref="importmodules"
                    accept=".zip"
                    onchange="{importModules}")
                .button.wide.inline.nml.nmr
                    svg.feather
                        use(xlink:href="data/icons.svg#folder")
                    span {voc.importModules}
        .c9.tall.flexfix(if="{currentModule}")
            ul.nav.tabs.flexfix-header.noshrink
                li#modinfo(onclick="{changeTab('moduleinfo')}" class="{active: tab === 'moduleinfo'}")
                    svg.feather
                        use(xlink:href="data/icons.svg#info")
                    span {voc.info}
                li#modsettings(if="{currentModule.fields && currentModuleName in global.currentProject.libs}" onclick="{changeTab('modulesettings')}" class="{active: tab === 'modulesettings'}")
                    svg.feather
                        use(xlink:href="data/icons.svg#settings")
                    span {voc.settings}
                li#modhelp( if="{currentModuleDocs}" onclick="{changeTab('modulehelp')}" class="{active: tab === 'modulehelp'}")
                    svg.feather
                        use(xlink:href="data/icons.svg#file-text")
                    span {voc.help}
                li#modlogs(if="{currentModuleLogs}" onclick="{changeTab('modulelogs')}" class="{active: tab === 'modulelogs'}")
                    svg.feather
                        use(xlink:href="data/icons.svg#list")
                    span {voc.logs}
            div.flexfix-body
                #moduleinfo.tabbed.nbt(show="{tab === 'moduleinfo'}")
                    label.bigpower(onclick="{toggleModule(currentModuleName)}" class="{off: !(currentModuleName in global.currentProject.libs)}")
                        svg.feather
                            use(xlink:href="data/icons.svg#{currentModuleName in global.currentProject.libs? 'check' : 'x'}")
                        span
                    h1#modname
                        span {currentModule.main.name}
                        span.version {currentModule.main.version}
                    a.external(each="{author in currentModule.main.authors}" title="{voc.author}" href="{author.site || 'mailto:'+author.mail}")
                        svg.feather
                            use(xlink:href="data/icons.svg#user")
                        span#modauthor {author.name}

                    span(title="{voc.hasinjects}" show="{currentModule.injects}")
                        svg.feather.warning#modinjects
                            use(xlink:href="data/icons.svg#zap")
                    span(title="{voc.hasfields}" show="{currentModule.fields}")
                        svg.feather.success
                            use(xlink:href="data/icons.svg#settings")
                    span(title="{voc.hasinputmethods}" show="{currentModule.inputMethods}")
                        svg.feather.success
                            use(xlink:href="data/icons.svg#airplay")

                    div(if="{currentModule.dependencies && currentModule.dependencies.length}")
                        .spacer
                        b {voc.dependencies}
                        .inlineblock(each="{dependency in currentModule.dependencies}")
                            svg.feather(if="{dependency in global.currentProject.libs}").success
                                use(xlink:href="data/icons.svg#check")
                            svg.feather(if="{!(dependency in global.currentProject.libs)}").error
                                use(xlink:href="data/icons.svg#alert-circle")
                            span   {dependency}

                    div(if="{currentModule.optionalDependencies && currentModule.optionalDependencies.length}")
                        .spacer
                        b {voc.optionalDependencies}
                        .inlineblock(each="{dependency in currentModule.optionalDependencies}")
                            svg.feather(if="{dependency in global.currentProject.libs}").success
                                use(xlink:href="data/icons.svg#check")
                            svg.feather(if="{!(dependency in global.currentProject.libs)}").warning
                                use(xlink:href="data/icons.svg#alert-triangle")
                            span   {dependency}

                    #modinfohtml(if="{currentModuleHelp}" oncontextmenu="{onContextMenu}")
                        raw(ref="raw" content="{currentModuleHelp}")
                    h1(if="{currentModuleLicense}") {voc.license}
                    pre(if="{currentModuleLicense}")
                        code {currentModuleLicense}

                #modulesettings.tabbed.nbt(show="{tab === 'modulesettings'}" if="{currentModule.fields && currentModuleName in global.currentProject.libs}")
                    dl(each="{field in currentModule.fields}")
                        dt
                            label.block.checkbox(if="{field.type === 'checkbox'}")
                                input(
                                    type="checkbox"
                                    checked="{global.currentProject.libs[currentModuleName][field.id]}"
                                    onchange="{wire('global.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                                )
                                |   {field.name}
                            span(if="{field.type !== 'checkbox'}")
                                |   {field.name}
                        dd
                            textarea(
                                if="{field.type === 'textfield'}"
                                value="{global.currentProject.libs[currentModuleName][field.id]}"
                                onchange="{wire('global.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                            )
                            input(
                                if="{field.type === 'number'}"
                                type="number"
                                value="{global.currentProject.libs[currentModuleName][field.id]}"
                                onchange="{wire('global.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                            )
                            label.block.checkbox(if="{field.type === 'radio'}" each="{option in field.options}")
                                input(
                                    type="radio"
                                    value="{option.value}"
                                    checked="{global.currentProject.libs[currentModuleName][field.id] === option.value}"
                                    onchange="{wire('global.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                                )
                                |   {option.name}
                                div(class="desc" if="{option.help}")
                                    raw(ref="raw" content="{md.render(option.help)}")
                            input(
                                if="{['checkbox', 'number', 'textfield', 'radio'].indexOf(field.type) === -1}"
                                type="text"
                                value="{global.currentProject.libs[currentModuleName][field.id]}"
                                onchange="{wire('global.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                            )
                            //- That's a bad idea!!!
                            div(class="desc" if="{field.help}")
                                raw(ref="raw" content="{md.render(field.help)}")
                #modulehelp.tabbed.nbt(show="{tab === 'modulehelp'}" if="{currentModuleDocs}")
                    raw(ref="raw" content="{currentModuleDocs}" oncontextmenu="{onContextMenu}")
                #modulelogs.tabbed.nbt(show="{tab === 'modulelogs'}" if="{currentModuleLogs}")
                    h1 {voc.logs2}
                    raw(ref="raw" content="{currentModuleLogs}")

    script.
        const path = require('path'),
              fs = require('fs-extra'),
              unzipper = require('unzipper');
        const md = require('markdown-it')({
            html: false,
            linkify: true,
            highlight: function (str, lang) {
                const hljs = require('highlight.js');
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (__) {}
                }
                return ''; // use external default escaping
            }
        });
        const glob = require('./data/node_requires/glob');
        const libsDir = './data/ct.libs';
        this.md = md;
        this.mixin(window.riotWired);
        this.namespace = 'modules';
        this.mixin(window.riotVoc);
        var exec = path.dirname(process.execPath).replace(/\\/g,'/');

        this.currentModule = false;
        this.currentModuleHelp = '';
        this.currentModuleDocs = '';
        this.currentModuleLicense = '';

        this.tab = 'moduleinfo';
        this.changeTab = tab => e => {
            this.tab = tab;
        };

        this.allModules = [];
        this.on('update', () => {
            this.enabledModules = [];
            for (let i in global.currentProject.libs) {
                this.enabledModules.push(i);
            }
        });

        this.escapeDots = str => str.replace(/\./g, '\\.');

        const tryLoadTypedefs = moduleName => {
            if (!(moduleName in global.currentProject.libs)) {
                return;
            }
            const typedefPath = path.join(libsDir, moduleName, 'types.d.ts');
            fs.pathExists(typedefPath)
            .then(exists => {
                if (!exists) {
                    // generate dummy typedefs if none were provided by the module
                    const data = `declare namespace ct {\n/** Sorry, no in-code docs for this module :c */\n var ${moduleName}: any; }`;
                    glob.moduleTypings[moduleName] = [
                        monaco.languages.typescript.javascriptDefaults.addExtraLib(data),
                        monaco.languages.typescript.typescriptDefaults.addExtraLib(data)
                    ];
                    return;
                }
                fs.readFile(typedefPath, 'utf8')
                .then(data => {
                    glob.moduleTypings[moduleName] = [
                        monaco.languages.typescript.javascriptDefaults.addExtraLib(data),
                        monaco.languages.typescript.typescriptDefaults.addExtraLib(data)
                    ];
                });
            });
        };
        const removeTypedefs = moduleName => {
            if (glob.moduleTypings[moduleName]) {
                for (const lib of glob.moduleTypings[moduleName]) {
                    lib.dispose();
                }
            }
        };
        fs.readdir(libsDir, (err, files) => {
            if (err) {
                throw err;
            }
            for (var i = 0; i < files.length; i++) {
                if (fs.pathExistsSync(path.join(libsDir, files[i], 'module.json'))) {
                    const moduleName = files[i];
                    this.allModules.push(moduleName);
                    tryLoadTypedefs(moduleName);
                }
            }
            this.currentModuleHelp = '';
            this.currentModuleDocs = '';
            this.currentModuleLicense = '';
            this.renderModule(this.allModules[0])();
            this.update();
        });
        this.toggleModule = moduleName => e => {
            if (global.currentProject.libs[moduleName]) {
                delete global.currentProject.libs[moduleName];
                removeTypedefs(moduleName);
            } else {
                global.currentProject.libs[moduleName] = {};
                tryLoadTypedefs(moduleName);
                // 'Settings' page
                if (this.currentModule.fields && global.currentProject.libs[name]) {
                    for (const field of this.currentModule.fields) {
                        if (!global.currentProject.libs[name][field.key]) {
                            if (field.default) {
                                global.currentProject.libs[name][field.key] = field.default;
                            } else {
                                if (field.type == 'number') {
                                    global.currentProject.libs[name][field.key] = 0;
                                } else if (field.type == 'checkbox') {
                                    global.currentProject.libs[name][field.key] = false;
                                } else {
                                    global.currentProject.libs[name][field.key] = '';
                                }
                            }
                        }
                    }
                }
            }
            this.renderModule(moduleName)(e);
            window.signals.trigger('modulesChanged');
            glob.modified = true;
        };
        this.renderModule = name => e => {
            fs.readJSON(path.join(libsDir, name, 'module.json'), (err, data) => {
                if (err) {
                    alertify.error(err);
                    if (name in global.currentProject.libs) {
                        delete global.currentProject.libs[name];
                    }
                    this.currentModule = false;
                    this.update();
                    return;
                }
                this.currentModule = data;
                this.currentModuleName = name;

                if (fs.pathExistsSync(path.join(libsDir, name, 'README.md'))) {
                    this.currentModuleHelp = md.render(fs.readFileSync(path.join(libsDir, name, 'README.md'), {
                        encoding: 'utf8'
                    }) || '');
                } else {
                    this.currentModuleHelp = false;
                }
                if (fs.pathExistsSync(path.join(libsDir, name, 'DOCS.md'))) {
                    this.currentModuleDocs = md.render(fs.readFileSync(path.join(libsDir, name, 'DOCS.md'), {
                        encoding: 'utf8'
                    }) || '');
                } else {
                    this.currentModuleDocs = false;
                }
                if (fs.pathExistsSync(path.join(libsDir, name, 'CHANGELOG.md'))) {
                    this.currentModuleLogs = md.render(fs.readFileSync(path.join(libsDir, name, 'CHANGELOG.md'), {
                        encoding: 'utf8'
                    }) || '');
                } else {
                    this.currentModuleLogs = false;
                }
                if (fs.pathExistsSync(path.join(libsDir, name, 'LICENSE'))) {
                    this.currentModuleLicense = fs.readFileSync(path.join(libsDir, name, 'LICENSE'), {
                        encoding: 'utf8'
                    }) || '';
                } else {
                    this.currentModuleLicense = false;
                }
                this.currentModule.injects = fs.pathExistsSync(path.join(libsDir, name, 'injects'));
                this.update();
            });
            this.tab = 'moduleinfo';
        };

        this.onContextMenu = e => {
            console.log(e);
        };
        this.contextMenu = {
            items: [{
                label: window.languageJSON.common.copy,
                icon: 'copy',
                click: () => {

                }
            }]
        };

        this.importModules = async (e) => {
            const files = e.target.files;
            if (files.length === 0) {
                return;
            }
            const value = files[0].path;
            e.target.value = '';
            let parentName = null;
            let moduleName = null;
            const entries = [];
            fs.createReadStream(value)
            .pipe(unzipper.Parse())
            .on('entry', async (entry) => {
                const fileName = entry.path.toLowerCase();
                if (path.basename(fileName) === 'module.json') {
                    // okay, we consumes the entry by buffering the contents into memory.
                    const content = entry.tmpContent = await entry.buffer();
                    const json = JSON.parse(content.toString());
                    moduleName = json.main.packageName || path.basename(value, '.zip');
                    const indexOf = fileName.indexOf('/');
                    if (indexOf !== -1) {
                        parentName = fileName.substring(0, indexOf);
                    }
                }
                entries.push(entry);
            })
            .on('finish', async () => {
                if (moduleName !== null) {
                    // okay, let's create parent directory
                    await fs.ensureDir(path.join(libsDir, moduleName));
                    for (let entry of entries) {
                        const filePath = entry.path;
                        const indexOf = filePath.indexOf('/')
                        if (filePath === parentName) {
                            continue;
                        }
                        if (indexOf !== -1) {
                            if (parentName !== null) {
                                entry.path = `${moduleName}${filePath.substring(indexOf)}`;
                            } else {
                                entry.path = `${moduleName}/${filePath}`;
                            }
                        } else {
                            entry.path = `${moduleName}/${filePath}`;
                        }
                        entry.path =  path.join(libsDir, entry.path);
                         // 'Directory' or 'File'
                        if (entry.type === 'Directory') {
                            await fs.ensureDir(entry.path);
                        } else {
                            const fileName = entry.path.toLowerCase();
                            if (fileName.endsWith("module.json")) {
                                const content = entry.tmpContent;
                                await fs.writeFile(entry.path, content);
                            } else {
                                entry.pipe(fs.createWriteStream(entry.path))
                                .on('error', (e) => {
                                    alertify.error(e);
                                    console.log(e);
                                    return;
                                });
                            }
                        }
                    }
                    this.allModules.push(moduleName);
                    this.update();
                }
            });
        };
