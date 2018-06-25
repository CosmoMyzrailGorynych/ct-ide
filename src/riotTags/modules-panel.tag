modules-panel.panel.view
    .flexrow
        .c3.borderright.tall
            ul#moduleincluded
                li(each="{module in enabledModules}" onclick="{renderModule(module)}")
                    i.icon-confirm
                    span {module}
            ul#modulelist
                li(each="{module in allModules}" onclick="{renderModule(module)}")
                    i.icon(class="icon-{(module in window.currentProject.libs)? 'confirm on' : 'mod off'}")
                    span {module}
        .c9.tall(if="{currentModule}")
            ul.nav.tabs
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
            div
                #moduleinfo.tabbed(show="{tab === 'moduleinfo'}")
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
                    
                    #modinfohtml(if="{currentModuleHelp}")
                        raw(ref="raw" content="{currentModuleHelp}")
                    h1(if="{currentModule.main.license}") {voc.license}
                    pre(if="{currentModule.main.license}")
                        code {currentModuleLicense}
                    
                #modulesettings.tabbed(show="{tab === 'modulesettings'}" if="{currentModule.fields && currentModuleName in currentProject.libs}")
                    dl(each="{field in currentModule.fields}")
                        dt {field.name}
                        dd
                            textarea(
                                if="{field.type === 'textfield'}" 
                                value="{window.currentProject.libs[currentModuleName][field.id]}" 
                                onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field.id)}"
                            )
                            input(
                                if="{field.type === 'number'}" 
                                type="number"
                                value="{window.currentProject.libs[currentModuleName][field.id]}" 
                                onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field.id)}"
                            )
                            input(
                                if="{field.type === 'checkbox'}" 
                                type="checkbox"
                                checked="{window.currentProject.libs[currentModuleName][field.id]}"
                                onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field.id)}"
                            )
                            input(
                                if="{['checkbox', 'number', 'textfield'].indexOf(field.type) === -1}" 
                                type="text"
                                value="{window.currentProject.libs[currentModuleName][field.id]}" 
                                onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field.id)}"
                            )
                            //- Это хреновая затея!!!
                            div(class="desc" if="{field.help}")
                                raw(ref="raw" content="{md.render(field.help)}")
                #modulehelp.tabbed(show="{tab === 'modulehelp'}" if="{currentModuleDocs}")
                    raw(ref="raw" content="{currentModuleDocs}")
                #modulelogs.tabbed(show="{tab === 'modulelogs'}" if="{currentModuleLogs}")
                    h1 {voc.logs2}
                    raw(ref="raw" content="{currentModuleLogs}")
    script.
        const path = require('path'),
              fs = require('fs-extra'),
              gui = require('nw.gui');
        const md = require('markdown-it')({
            html: false,
            linkify: true
        });
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
        
        fs.readdir('./ct.libs', (err, files) => {
            if (err) {
                throw err;
            }
            for (var i = 0; i < files.length; i++) {
                if (fs.pathExistsSync(path.join('./ct.libs', files[i], 'module.json'))) {
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
            window.glob.modified = true;
        };
        this.renderModule = name => e => {
            fs.readJSON(path.join('./ct.libs', name, 'module.json'), (err, data) => {
                if (err) {
                    alertify.error(err);
                    return;
                }
                this.currentModule = data;
                this.currentModuleName = name;
                
                if (fs.pathExistsSync(path.join('./ct.libs', name, 'README.md'))) {
                    this.currentModuleHelp = md.render(fs.readFileSync(path.join('./ct.libs', name, 'README.md'), {
                        encoding: 'utf8'
                    }) || '');
                } else {
                    this.currentModuleHelp = false;
                }
                if (fs.pathExistsSync(path.join('./ct.libs', name, 'DOCS.md'))) {
                    this.currentModuleDocs = md.render(fs.readFileSync(path.join('./ct.libs', name, 'DOCS.md'), {
                        encoding: 'utf8'
                    }) || '');
                } else {
                    this.currentModuleDocs = false;
                }
                if (fs.pathExistsSync(path.join('./ct.libs', name, 'CHANGELOG.md'))) {
                    this.currentModuleLogs = md.render(fs.readFileSync(path.join('./ct.libs', name, 'CHANGELOG.md'), {
                        encoding: 'utf8'
                    }) || '');
                } else {
                    this.currentModuleLogs = false;
                }
                if (fs.pathExistsSync(path.join('./ct.libs', name, 'LICENSE'))) {
                    this.currentModuleLicense = fs.readFileSync(path.join('./ct.libs', name, 'LICENSE'), {
                        encoding: 'utf8'
                    }) || '';
                } else {
                    this.currentModuleLicense = false;
                }
                this.currentModule.injects = fs.pathExistsSync(path.join('./ct.libs', name, 'injects'));
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
