main-menu
    nav
        ul#app.nav
            li#fullscreen(onclick="{toggleFullscreen}" title="{voc.min}")
                i.icon(class="{fullscreen? 'minimize' : 'maximize'}")

        ul#mainnav.nav.tabs
            li.it30#ctlogo(onclick="{ctClick}" title="{voc.ctIDE}")
                img(src="img/ct.ide.svg")
            li.it30(onclick="{saveProject}" title="{voc.save}")
                i.icon.icon-save
            li.it30(data-event="run" title="{voc.launch}")
                i.icon.icon-play

            li(onclick="{changeTab('settings')}")
                i.icon.icon-settings
                span {voc.settings}
            li(onclick="{changeTab('modules')}")
                i.icon.icon-share
                span {voc.modules}
            li(onclick="{changeTab('graphic')}")
                i.icon.icon-picture
                span {voc.graphic}
            li(onclick="{changeTab('styles')}")
                i.icon.icon-brush
                span {voc.styles}
            li(onclick="{changeTab('sounds')}")
                i.icon.icon-music
                span {voc.sounds}
            li(onclick="{changeTab('types')}")
                i.icon.icon-smile
                span {voc.types}
            li(onclick="{changeTab('rooms')}")
                i.icon.icon-room
                span {voc.rooms}
    div
        settings-panel
        modules-panel
        //
            include ./../pug/includes/graphic.pug
            include ./../pug/includes/graphview.pug
            include ./../pug/includes/sounds.pug
            include ./../pug/includes/soundview.pug
            include ./../pug/includes/styles.pug
            include ./../pug/includes/styleview.pug
            include ./../pug/includes/types.pug
            include ./../pug/includes/typeview.pug
            include ./../pug/includes/rooms.pug
            include ./../pug/includes/roomview.pug
    script.
        this.voc = window.languageJSON.menu;
        this.tab = 'settings';
        this.changeTab = tab => e => {
            this.tab = tab;
            if (tab === 'modules') {
                this.openModules(e);
            }
            this.checkSave();
            window.signals.trigger('globalTabChanged');
        };
        var gui = require('nw.gui'),
            win = gui.Window.get();
        
        this.fullscreen = false;
        this.toggleFullscreen = function() {
            win.toggleFullscreen();
            this.fullscreen = !this.fullscreen;
        };
        
        this.ctClick = function(e) {
            catMenu.popup(e.clientX, e.clientY);
        };
        this.saveProject = function() {
            fs.outputJSON(sessionStorage.projdir + '.ict', currentProject, function(e) {
                if (e) {
                    throw e;
                }
                alertify.log(languageJSON.common.savedcomm, "success", 3000);
                glob.modified = false;
            })
        };
        
        var gui = require('nw.gui');
        var catMenu = new gui.Menu();
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.open,
            icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
            click: function (e) {
                $('#findProject').click();
            }
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.save,
            icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'save.png',
            click: this.saveProject
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.intro.newProject.text,
            icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'star.png',
            click: function (e) {
                alertify.prompt(window.languageJSON.intro.newProject.input, function (e,r) {
                    if (e) {
                        console.log(e,r);
                        if (!apatterns.SymbolDigitUnderscore.test(r)) {
                            $('#id').val(r);
                            this.newProject();
                        } else {
                            alertify.error(window.languageJSON.intro.newProject.nameerr);
                        }
                    }
                });
            }
        }));
        
        catMenu.append(new gui.MenuItem({type: 'separator'}));
        
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.ctsite,
            icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'arrow.png',
            click: function () {
                gui.Shell.openExternal('http://ctjs.ru/');
            }
        }));
        
        catMenu.append(new gui.MenuItem({type: 'separator'}));
        
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.exit,
            icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'exit.png',
            click: function (e) {
                window.alertify.confirm(window.languageJSON.common.exitconfirm, function (e) {
                    if (e) {
                        gui.App.quit();
                    }
                });
            }
        }));
