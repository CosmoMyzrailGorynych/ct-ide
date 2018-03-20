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
                li#modsettings(onclick="{changeTab('modulesettings')}" class="{active: tab === 'modulesettings'}" if="{currentModule.fields && currentModuleName in currentProject.libs}")
                    i.icon-settings
                    span {voc.settings}
                li#modhelp(onclick="{changeTab('modulehelp')}" class="{active: tab === 'modulehelp'}" if="{currentModule.methods || currentModule.params}")
                    i.icon-document
                    span {voc.help}
                li#modlogs(onclick="{changeTab('modulelogs')}" class="{active: tab === 'modulelogs'}")
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
                    a#modsite.external(title="{voc.author}" href="{currentModule.info.site}")
                        i.icon-user
                        span#modauthor {currentModule.info.author}
                    i#modinjects.icon-zap.warning(title="{voc.hasinjects}" show="{currentModule.injects}")
                    i#modconfigurable.icon-settings.success(title="{voc.hasfields}" show="{currentModule.fields}")
                    
                    #modinfohtml 
                        raw(ref="raw" content="{currentModuleHelp}")
                    h1(if="{currentModule.main.license}") {voc.license}
                    raw(ref="raw" if="{currentModule.main.license}" content="{currentModuleLicense}")
                    
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
                #modulehelp.tabbed(show="{tab === 'modulehelp'}" if="{currentModule.methods || currentModule.params}")
                    h1 {voc.methods}
                    virtual(each="{method, name in currentModule.methods}")
                        h2(oncontextmenu="{showCopyMenu}") ct.{currentModuleName}.{name}
                        //- Это тоже хреновая затея!!!
                        span(if="{method.exp}")
                            raw(ref="raw" content="{md.render(method.exp)}")
                    p(if="{!currentModule.methods || !Object.keys(currentModule.methods).length}") {voc.nomethods}
                    
                    h1 {voc.parameters}
                    virtual(each="{parameter, name in currentModule.params}")
                        h2(oncontextmenu="{showCopyMenu}") ct.{currentModuleName}.{name}
                        span(if="{parameter.exp}")
                            raw(ref="raw" content="{md.render(parameter.exp)}")
                    p(if="{!currentModule.params || !Object.keys(currentModule.params).length}") {voc.noparameters}
                #modulelogs.tabbed(show="{tab === 'modulelogs'}")
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
                if (path.extname(files[i]) === '.json') {
                    this.allModules.push(path.basename(files[i], '.json'));
                }
            }
            this.currentModuleHelp = '';
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
            fs.readJSON('./ct.libs/' + name + '.json', (err, data) => {
                if (err) {
                    alertify.error(err);
                }
                this.currentModule = data;
                this.currentModuleName = name;
                
                this.currentModuleHelp = md.render(this.currentModule.main.help || '');
                this.currentModuleLicense = md.render(this.currentModule.main.license || '');
                this.currentModuleLogs = md.render(this.currentModule.main.logs || '');
                this.update();
            });
            this.tab = 'moduleinfo';
        };
        
        var clipboard = nw.Clipboard.get();
        var copymeMenu = new gui.Menu();
        copymeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.copy,
            click: function (e) {
                clipboard.set(currentFragment, 'text');
            }
        }));
        copymeMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.addtonotes,
            click: function (e) {
                var editor = $('#notepaglobal .acer')[0].acer;
                editor.setValue(editor.getValue() + '\n' + currentFragment);
            }
        }));
        this.showCopyMenu = e => {
            copymeMenu.popup(e.pageX, e.pageY);
        };
