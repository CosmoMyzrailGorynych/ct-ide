modules-panel.panel.view
    .flexrow.tall
        .c3.borderright.tall
            ul#moduleincluded
                li(each="{module in enabledModules}" onclick="{renderModule(module)}")
                    i.icon-confirm
                    span {module}
            ul#modulelist
                li(each="{module in allModules}" onclick="{renderModule(module)}")
                    i.icon(class="icon-{(module in window.currentProject.libs)? 'confirm on' : 'mod off'}")
                    span {module}
        .c9.tall.flexfix(if="{currentModule}")
            ul.nav.tabs.flexfix-header.noshrink
                li#modinfo(onclick="{changeTab('moduleinfo')}" class="{active: tab === 'moduleinfo'}")
                    i.icon-info
                    span {voc.info}
                li#modsettings(if="{currentModule.fields && currentModuleName in currentProject.libs}" onclick="{changeTab('modulesettings')}" class="{active: tab === 'modulesettings'}")
                    i.icon-settings
                    span {voc.settings}
                li#modhelp( if="{currentModuleDocs}" onclick="{changeTab('modulehelp')}" class="{active: tab === 'modulehelp'}")
                    i.icon-document
                    span {voc.help}
                li#modlogs(if="{currentModuleLogs}" onclick="{changeTab('modulelogs')}" class="{active: tab === 'modulelogs'}")
                    i.icon-list
                    span {voc.logs}
            div.flexfix-body
                #moduleinfo.tabbed.nbt(show="{tab === 'moduleinfo'}")
                    label.bigpower(onclick="{toggleModule(currentModuleName)}" class="{off: !(currentModuleName in currentProject.libs)}")
                        i(class="icon-{currentModuleName in currentProject.libs? 'confirm' : 'delete'}")
                        span
                    h1#modname
                        span {currentModule.main.name}
                        span.version {currentModule.main.version}
                    a.external(each="{author in currentModule.main.authors}" title="{voc.author}" href="{author.site || 'mailto:'+author.mail}")
                        i.icon-user
                        span#modauthor {author.name}
                    i#modinjects.icon-zap.warning(title="{voc.hasinjects}" show="{currentModule.injects}")
                    i#modconfigurable.icon-settings.success(title="{voc.hasfields}" show="{currentModule.fields}")
                    i#modinputmethods.icon-airplay.success(title="{voc.hasinputmethods}" show="{currentModule.inputMethods}")

                    #modinfohtml(if="{currentModuleHelp}")
                        raw(ref="raw" content="{currentModuleHelp}")
                    h1(if="{currentModuleLicense}") {voc.license}
                    pre(if="{currentModuleLicense}")
                        code {currentModuleLicense}

                #modulesettings.tabbed.nbt(show="{tab === 'modulesettings'}" if="{currentModule.fields && currentModuleName in currentProject.libs}")
                    dl(each="{field in currentModule.fields}")
                        dt
                            label(if="{field.type === 'checkbox'}")
                                input(
                                    type="checkbox"
                                    checked="{window.currentProject.libs[currentModuleName][field.id]}"
                                    onchange="{wire('window.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                                )
                                |   {field.name}
                            span(if="{field.type !== 'checkbox'}")
                                |   {field.name}
                        dd
                            textarea(
                                if="{field.type === 'textfield'}"
                                value="{window.currentProject.libs[currentModuleName][field.id]}"
                                onchange="{wire('window.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                            )
                            input(
                                if="{field.type === 'number'}"
                                type="number"
                                value="{window.currentProject.libs[currentModuleName][field.id]}"
                                onchange="{wire('window.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                            )
                            label.block(if="{field.type === 'radio'}" each="{option in field.options}")
                                input(
                                    type="radio"
                                    value="{option.value}"
                                    checked="{window.currentProject.libs[currentModuleName][field.id] === option.value}"
                                    onchange="{wire('window.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                                )
                                |   {option.name}
                                div(class="desc" if="{option.help}")
                                    raw(ref="raw" content="{md.render(option.help)}")
                            input(
                                if="{['checkbox', 'number', 'textfield', 'radio'].indexOf(field.type) === -1}"
                                type="text"
                                value="{window.currentProject.libs[currentModuleName][field.id]}"
                                onchange="{wire('window.currentProject.libs.' + escapeDots(currentModuleName) + '.' + field.id)}"
                            )
                            //- That's a bad idea!!!
                            div(class="desc" if="{field.help}")
                                raw(ref="raw" content="{md.render(field.help)}")
                #modulehelp.tabbed.nbt(show="{tab === 'modulehelp'}" if="{currentModuleDocs}")
                    raw(ref="raw" content="{currentModuleDocs}")
                #modulelogs.tabbed.nbt(show="{tab === 'modulelogs'}" if="{currentModuleLogs}")
                    h1 {voc.logs2}
                    raw(ref="raw" content="{currentModuleLogs}")
    script.
        const path = require('path'),
              fs = require('fs-extra'),
              gui = require('nw.gui');
        const md = require('markdown-it')({
            html: false,
            linkify: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (__) {}
                }
                return ''; // use external default escaping
            }
        });
        const hljs = require('highlight.js');
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
            for (let i in window.currentProject.libs) {
                this.enabledModules.push(i);
            }
        });

        this.escapeDots = str => str.replace(/\./g, '\\.');

        fs.readdir(libsDir, (err, files) => {
            if (err) {
                throw err;
            }
            for (var i = 0; i < files.length; i++) {
                if (fs.pathExistsSync(path.join(libsDir, files[i], 'module.json'))) {
                    this.allModules.push(files[i]);
                }
            }
            this.currentModuleHelp = '';
            this.currentModuleDocs = '';
            this.currentModuleLicense = '';
            this.renderModule(this.allModules[0])();
            this.update();
        });
        this.toggleModule = moduleName => e => {
            if (window.currentProject.libs[moduleName]) {
                delete window.currentProject.libs[moduleName];
            } else {
                window.currentProject.libs[moduleName] = {};
                // 'Settings' page
                if (this.currentModule.fields && currentProject.libs[name]) {
                    for (var k in this.currentModule.fields) {
                        if (!currentProject.libs[name][this.currentModule.fields[k].key]) {
                            if (this.currentModule.fields[k].default) {
                                currentProject.libs[name][this.currentModule.fields[k].key] = this.currentModule.fields[k].default;
                            } else {
                                if (this.currentModule.fields[k].type == 'number') {
                                    currentProject.libs[name][this.currentModule.fields[k].key] = 0;
                                } else if (this.currentModule.fields[k].type == 'checkbox') {
                                    currentProject.libs[name][this.currentModule.fields[k].key] = false;
                                } else {
                                    currentProject.libs[name][this.currentModule.fields[k].key] = '';
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
                    if (name in window.currentProject.libs) {
                        delete window.currentProject.libs[name];
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

        var clipboard = nw.Clipboard.get();
        var copymeMenu = new gui.Menu();
        copymeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.copy,
            click: e => {
                clipboard.set(this.currentFragment, 'text');
            }
        }));
        copymeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.addtonotes,
            click: e => {
                currentProject.notes += '\n' + this.currentFragment;
            }
        }));
        this.showCopyMenu = e => {
            this.currentFragment = `ct.${this.currentModuleName}.${e.item.name || e.item.parameter || e.item.method}`;
            copymeMenu.popup(e.pageX, e.pageY);
            e.preventDefault();
        };
