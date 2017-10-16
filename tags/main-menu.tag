main-menu.flexcol
    nav.nogrow.flexrow(if="{window.currentProject}")
        ul#fullscreen.nav
            li(onclick="{toggleFullscreen}" title="{voc.min}")
                i(class="icon-{fullscreen? 'minimize-2' : 'maximize-2'}")

        ul#app.nav.tabs
            li.it30#ctlogo(onclick="{ctClick}" title="{voc.ctIDE}")
                i.icon-menu
            li.it30(onclick="{saveProject}" title="{voc.save}")
                i.icon-save
            li.it30(onclick="{runProject}" title="{voc.launch}")
                i.icon-play

        ul#mainnav.nav.tabs
            li(onclick="{changeTab('settings')}" class="{active: tab === 'settings'}")
                i.icon-settings
                span {voc.settings}
            li(onclick="{changeTab('modules')}" class="{active: tab === 'modules'}")
                i.icon-mod
                span {voc.modules}
            li(onclick="{changeTab('graphic')}" class="{active: tab === 'graphic'}")
                i.icon-picture
                span {voc.graphic}
            li(onclick="{changeTab('styles')}" class="{active: tab === 'styles'}")
                i.icon-droplet
                span {voc.styles}
            li(onclick="{changeTab('sounds')}" class="{active: tab === 'sounds'}")
                i.icon-headphones
                span {voc.sounds}
            li(onclick="{changeTab('types')}" class="{active: tab === 'types'}")
                i.icon-user
                span {voc.types}
            li(onclick="{changeTab('rooms')}" class="{active: tab === 'rooms'}")
                i.icon-map
                span {voc.rooms}
    div.flexitem.relative(if="{window.currentProject}")
        settings-panel(show="{tab === 'settings'}")
        modules-panel(show="{tab === 'modules'}")
        graphics-panel(show="{tab === 'graphic'}")
        styles-panel(show="{tab === 'styles'}")
        sounds-panel(show="{tab === 'sounds'}")
        types-panel(show="{tab === 'types'}")
        rooms-panel(show="{tab === 'rooms'}")
    script.
        this.voc = window.languageJSON.menu;
        const fs = require('fs-extra');

        this.tab = 'settings';
        this.changeTab = tab => e => {
            this.tab = tab;
            window.signals.trigger('globalTabChanged');
        };
        var gui = require('nw.gui'),
            win = gui.Window.get();
        
        this.fullscreen = false;
        this.toggleFullscreen = function() {
            win.toggleFullscreen();
            this.fullscreen = !this.fullscreen;
        };
        
        this.ctClick = (e) => {
            catMenu.popup(e.clientX, e.clientY);
        };
        this.saveProject = () => {
            fs.outputJSON(sessionStorage.projdir + '.ict', currentProject, (e) => {
                if (e) {
                    alertify.error(e);
                }
                alertify.log(languageJSON.common.savedcomm, "success", 3000);
                glob.modified = false;
            })
        };
        window.signals.on('saveProject', () => {
            this.saveProject();
        });
        this.runProject = e => {
            window.runCtProject();
        };
        
        var gui = require('nw.gui');
        var catMenu = new gui.Menu();
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.save,
            icon: (window.isMac ? './img/black/' : './img/blue/') + 'save.png',
            click: this.saveProject
        }));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.menu.startscreen,
            icon: (window.isMac ? './img/black/' : './img/blue/') + 'folder.png',
            click: (e) => {
                if (!confirm(window.languageJSON.common.reallyexit)) {
                    return false;
                }
                window.signals.trigger('resetAll');
            }
        }));
        catMenu.append(new gui.MenuItem({type: 'separator'}));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.ctsite,
            icon: (window.isMac ? './img/black/' : './img/blue/') + 'arrow.png',
            click: function () {
                gui.Shell.openExternal('http://ctjs.ru/');
            }
        }));
        catMenu.append(new gui.MenuItem({type: 'separator'}));
        catMenu.append(new gui.MenuItem({
            label: window.languageJSON.common.exit,
            icon: (window.isMac ? './img/black/' : './img/blue/') + 'exit.png',
            click: function (e) {
                alertify
                .confirm(window.languageJSON.common.exitconfirm)
                .then(e => {
                    if (e.buttonClicked === 'ok') {
                        gui.App.quit();
                    }
                });
            }
        }));
