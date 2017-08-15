window.events = window.events || {};
//-------------- events -------------------

events.fullscreen = function() {
    win.toggleFullscreen();
    $('#fullscreen .icon').toggleClass('icon-minimize').toggleClass('icon-maximize');
};
// cat
events.ct = function(e) {
    catMenu.popup(e.clientX, e.clientY);
};
events.save = function() {
    fs.outputJSON(projdir + '.ict', currentProject, function(e) {
        if (e) {
            throw e;
        }
        alertify.log(languageJSON.common.savedcomm, "success", 3000);
        glob.modified = false;
    })
};
events.checkSave = function () {
    if (window.currentProject) {
        $('#graphview:visible #graphviewdone,\
           #styleview:visible button:last,\
           #soundview:visible button:last,\
           #typeview:visible #typedone,\
           #roomview:visible #roomviewdone').click();
    }
};

//------------ menus ----------------------

catMenu = new gui.Menu();
catMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function (e) {
        $('#findProject').click();
    }
}));
catMenu.append(new gui.MenuItem({
    label: languageJSON.common.save,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'save.png',
    click: events.save
}));
catMenu.append(new gui.MenuItem({
    label: languageJSON.intro.newProject.text,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'star.png',
    click: function (e) {
        alertify.prompt(languageJSON.intro.newProject.input, function (e,r) {
            if (e) {
                console.log(e,r);
                if (!apatterns.SymbolDigitUnderscore.test(r)) {
                    $('#id').val(r);
                    events.newProject();
                } else {
                    alertify.error(languageJSON.intro.newProject.nameerr);
                }
            }
        });
    }
}));

catMenu.append(new gui.MenuItem({type: 'separator'}));

catMenu.append(new gui.MenuItem({
    label: languageJSON.common.ctsite,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'arrow.png',
    click: function () {
        gui.Shell.openExternal('http://ctjs.ru/');
    }
}));

catMenu.append(new gui.MenuItem({type: 'separator'}));

catMenu.append(new gui.MenuItem({
    label: languageJSON.common.exit,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'exit.png',
    click: function (e) {
        alertify.confirm(languageJSON.common.exitconfirm, function (e) {
            if (e) {
                gui.App.quit();
            }
        });
    }
}));

//------------ UI links -------------------
$(function () {
    $('#mainnav [data-tab]').click(function () {
        events.checkSave();
    });
});
