modules-panel.panel.view
    .pt20.borderright.tall
        ul#moduleincluded
            li(each="{module in enabledModules}" onclick="{renderModule(module)}")
                i.icon.icon-confirm
                span module
        ul#modulelist
            li(each="{module in allModules}" onclick="{renderModule(module)}")
                i.icon(class="icon-{(module in enabledModules)? 'confirm on' : 'share off'}")
                span module
    .pt80.tall
        ul.nav.tabs
            li#modinfo(onclick="{changeTab('moduleinfo')}" class="{active: tab === 'moduleinfo'}")
                i.icon.icon-message
                span {voc.info}
            li#modsettings(onclick="{changeTab('modulesettings')}" class="{active: tab === 'modulesettings'}" if="{currentModule.fields}")
                i.icon.icon-settings
                span {voc.settings}
            li#modhelp(onclick="{changeTab('modulehelp')}" class="{active: tab === 'modulehelp'}" if="{currentModule.methods || currentModule.params}")
                i.icon.icon-document
                span {voc.help}
            li#modlogs(onclick="{changeTab('modulelogs')}" class="{active: tab === 'modulelogs'}")
                i.icon.icon-coding
                span {voc.logs}
        div
            #moduleinfo.tabbed(show="{tab === 'moduleinfo'}")
                label.bigpower(onclick="{toggleModule}")
                    i.icon(class="icon-{currentModuleName in currentProject.libs? 'confirm' : ''}")
                    span
                h1#modname
                    span {currentModule.main.name}
                    span.version {currentModule.main.version}
                a#modsite.external(title="{voc.author}" href="{currentModule.info.site}")
                    i.icon.icon-boy
                    span#modauthor currentModule.info.author
                i#modinjects.icon.icon-flash.warning(title="{voc.hasinjects}" show="{currentModule.injects}")
                i#modconfigurable.icon.icon-settings.success(title="{voc.hasfields}" show="{currentModule.fields}")
                
                #modinfohtml {{currentModuleHelp}}
                h1(if="{currentModule.main.license}") {voc.license}
                span(if="{currentModule.main.license}") {{currentModuleLicense}}
                
            #modulesettings.tabbed(show="{tab === 'modulesettings'}" if="{currentModule.fields && currentModuleName in currentProject.libs}")
                dl(each="{field in currentModule.fields}")
                    dt {field.name}
                    dd
                        textarea(
                            if="{field.type === 'textfield'}" 
                            value="{window.currentProject[libs.currentModule][field]}" 
                            onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field)}"
                        )
                        input(
                            if="{field.type === 'number'}" 
                            type="number"
                            value="{window.currentProject[libs.currentModule][field]}" 
                            onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field)}"
                        )
                        input(
                            if="{field.type === 'checkbox'}" 
                            type="checkbox"
                            checked="{window.currentProject[libs.currentModule][field]}"
                            onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field)}"
                        )
                        input(
                            if="{['checkbox', 'number', 'textfield'].indexOf(field.type) === -1}" 
                            type="text"
                            value="{window.currentProject[libs.currentModule][field]}" 
                            onchange="{wire('window.currentProject.libs.' + currentModuleName + '.' + field)}"
                        )
                        //- Это хреновая затея!!!
                        div(class="desc" if="{field.help}") {{md.render(field.help)}}
            #modulehelp.tabbed(show="{tab === 'modulehelp'}" if="{currentModule.methods || currentModule.params}")
                h1 {voc.methods}
                virtual(each="{method, name in currentModule.methods}")
                    h2(oncontextmenu="{showCopyMenu}") ct.{currentModuleName}.{name}
                    //- Это тоже хреновая затея!!!
                    span(if="{method.exp}") {{md.render(method.exp)}}
                p(if="{!currentModule.methods}") {voc.nomethods}
                
                h1 {voc.parameters}
                virtual(each="{parameter, name in currentModule.params}")
                    h2(oncontextmenu="{showCopyMenu}") ct.{currentModuleName}.{name}
                    span(if="{method.exp}") {{md.render(parameter.exp)}}
                p(if="{!currentModule.parameters}") {voc.noparameters}
            #modulelogs.tabbed(show="{tab === 'modulelogs'}")
                h1 {voc.logs2}
                span {{currentModuleLogs}}
    script.
        const path = require('path'),
              fs = require('fs-extra');
        const md = require('markdown-it')({
            html: false,
            linkify: true
        });
        this.md = md;
        this.mixin(window.riotWired);
        var exec = path.dirname(process.execPath).replace(/\\/g,'/');
        
        this.voc = window.languageJSON.modules;
        window.events = window.events || {};
        
        this.tab = 'moduleinfo';
        this.changeTab = tab => e => {
            this.tab = tab;
        };
        
        this.allModules = [];
        this.on('update', () => {
            this.enabledModules = window.currentProject.libs;
        });
        this.currentModule = {};
        
        fs.readdir(exec + '/ct.libs', function(err, files) {
            if (err) {
                throw err;
            }
            for (var i = 0; i < files.length; i++) {
                if (path.extname(files[i]) == '.json') {
                    this.allModules.push(path.basename(files[i], '.json'));
                }
            }
            this.update();
        });
        this.toggleModule = module => e => {
            if (window.currentProject.libs[module]) {
                delete window.currentProject.libs[module];
            } else {
                window.currentProject.libs[module] = {};
                // 'Settings' page
                if (currentModule.fields && currentProject.libs[name]) {
                    for (var k in currentModule.fields) {
                        if (!currentProject.libs[name][currentModule.fields[k].key]) {
                            if (currentModule.fields[k].default) {
                                currentProject.libs[name][currentModule.fields[k].key] = currentModule.fields[k].default;
                            } else {
                                if (currentModule.fields[k].type == 'number') {
                                    currentProject.libs[name][currentModule.fields[k].key] = 0;
                                } else if (currentModule.fields[k].type == 'checkbox') {
                                    currentProject.libs[name][currentModule.fields[k].key] = false;
                                } else {
                                    currentProject.libs[name][currentModule.fields[k].key] = '';
                                }
                            }
                        }
                    }
                }
            }
            this.renderModule(module);
            window.glob.modified = true;
        };
        this.renderModule = name => {
            fs.readFile(exec + '/ct.libs/' + name + '.json', (err, data) => {
                if (err) {
                    throw err;
                }
                this.currentModule = JSON.parse(data);
                this.currentModuleName = name;
                
                this.currentModuleHelp = md.render(this.currentModule.main.help || '');
                if (this.currentModule.main.license) {
                    this.currentModuleLicense = md.render(this.currentModule.main.license);
                }
                this.currentModuleLogs = md.render(currentModule.main.logs || '');
            });
            this.tab = 'moduleinfo';
        };
        
        var copymeMenu = new gui.Menu();
        copymeMenu.append(new gui.MenuItem({
            label: languageJSON.common.copy,
            click: function (e) {
                clipboard.set(currentFragment, 'text');
            }
        }));
        copymeMenu.append(new gui.MenuItem({
            label: languageJSON.common.addtonotes,
            click: function (e) {
                var editor = $('#notepaglobal .acer')[0].acer;
                editor.setValue(editor.getValue() + '\n' + currentFragment);
            }
        }));
        this.showCopyMenu = e => {
            copymeMenu.popup(e.pageX, e.pageY);
        };
