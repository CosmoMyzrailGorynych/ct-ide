window.events = window.events || {};
//-------------- events -------------------

events.fillModuleList = function() {
    fs.readdir(exec + '/ct.libs', function(err, files) {
        if (err) {
            throw err;
        }
        $('#modulelist, #moduleincluded').empty();
        for (var i = 0; i < files.length; i++) {
            if (path.extname(files[i]) == '.json') {
                var q = path.basename(files[i], '.json');
                if (currentProject.libs[q]) {
                    $('#modulelist').append('<li><i class="icon icon-confirm" /><span>{0}</span></li>'.f(q));
                    $('#moduleincluded').append('<li><i class="icon icon-confirm" /><span>{0}</span></li>'.f(q));
                } else {
                    $('#modulelist').append('<li><i class="icon icon-share" /><span>{0}</span></li>'.f(q));
                }
            }
        }
    });
};
events.openModules = function() {
    $('#modules .borderright li:eq(0)').click();
};
events.toggleModule = function() {
    if (currentProject.libs[currentModName]) {
        delete currentProject.libs[currentModName];
    } else {
        currentProject.libs[currentModName] = {};
    }
    events.renderMod(currentModName);
    glob.modified = true;
    events.fillModuleList();
};
events.renderMod = function(name) {
    fs.readFile(exec + '/ct.libs/' + name + '.json', function(err, data) {
        if (err) {
            throw err;
        }
        currentMod = JSON.parse(data);
        currentModName = name;

        // super-duper button
        if (currentProject.libs[currentModName]) {
            $('#moduleinfo .bigpower').removeClass('off');
        } else {
            $('#moduleinfo .bigpower').addClass('off');
        }

        // 'Info' page
        $('#modname span:eq(0)').text(currentMod.main.name);
        $('#modname span:eq(1)').text(currentMod.main.version);
        $('#modauthor').text(currentMod.info.author);
        $('#modsite').attr('href', currentMod.info.site);
        if (currentMod.injects) {
            $('#modinjects').show();
        } else {
            $('#modinjects').hide();
        }
        if (currentMod.fields) {
            $('#modconfigurable').show();
        } else {
            $('#modconfigurable').hide();
        }
        $('#modinfohtml').children().remove();
        //description
        if (currentMod.main.help) {
            $('#modinfohtml').append('<p>{0}</p>'.f(md.render(currentMod.main.help)));
        }
        if (currentMod.main.license) {
            $('#modinfohtml').append('<h1>{1}</h1><p>{0}</p>'.f(md.render(currentMod.main.license), languageJSON.modules.license));
        }
        preparetext('#modinfohtml');

        // 'Settings' page
        $('#modulesettings').empty();
        if (currentMod.fields && currentProject.libs[name]) {
            for (var k in currentMod.fields) {
                if (!currentProject.libs[name][currentMod.fields[k].key]) {
                    if (currentMod.fields[k].default) {
                        currentProject.libs[name][currentMod.fields[k].key] = currentMod.fields[k].default;
                    } else {
                        if (currentMod.fields[k].type == 'number') {
                            currentProject.libs[name][currentMod.fields[k].key] = 0;
                        } else if (currentMod.fields[k].type == 'checkbox') {
                            currentProject.libs[name][currentMod.fields[k].key] = false;
                        } else {
                            currentProject.libs[name][currentMod.fields[k].key] = '';
                        }
                    }
                }
                if (currentMod.fields[k].type == 'textfield') {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><textarea data-input="{1}"></textarea><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings textarea:last').val(currentProject.libs[name][currentMod.fields[k].key]);
                } else if (currentMod.fields[k].type == 'number') {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><input type="number" data-input="{1}" /><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings input:last').val(currentProject.libs[name][currentMod.fields[k].key]);
                } else if (currentMod.fields[k].type == 'checkbox') {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><input type="checkbox" data-input="{1}" /><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings input:last').prop('checked', currentProject.libs[name][currentMod.fields[k].key]);
                } else {
                    $('#modulesettings').append('<dl><dt>{0}</dt><dd><input type="text" data-input="{1}" /><div class="desc">{2}</div></dd></dl>'.f(
                        currentMod.fields[k].name,
                        'currentProject.libs.' + name + '.' + currentMod.fields[k].key,
                        currentMod.fields[k].help ? md.render(currentMod.fields[k].help) : ''
                    ));
                    $('#modulesettings input:last').val(currentProject.libs[name][currentMod.fields[k].key]);
                }
            }
            preparetext('#modulesettings');
            $('#modsettings').show();
        } else {
            $('#modsettings').hide();
        }

        // 'Reference' page
        var html = '', i = 0;
        if (currentMod.methods) {
            html += '<h1>{0}</h1>'.f(languageJSON.modules.methods);
            i = 0;
            for (i in currentMod.methods) {
                // TODO: escape
                html += '<h2 class="copyme">ct.{0}.{1}</h2>'.f(name, i);
                if (currentMod.methods[i].exp) html += '<p>{0}</p>'.f(md.render(currentMod.methods[i].exp));
            }
            if (i == 0) {
                html += languageJSON.modules.nomethods;
            }
        }
        if (currentMod.params) {
            html += '<h1>{0}</h1>'.f(languageJSON.modules.parameters);
            i = 0;
            for (i in currentMod.params) {
                // TODO: escape
                html += '<h2 class="copyme">ct.{0}.{1}</h2>'.f(name, i);
                if (currentMod.params[i].exp) html += '<p>{0}</p>'.f(md.render(currentMod.params[i].exp));
            }
            if (i == 0) {
                html += languageJSON.modules.noparameters;
            }
        }
        $('#modulehelp').empty();
        $('#modulehelp').append(html);
        if (!(currentMod.params || currentMod.methods)) {
            $('#modhelp').hide();
        } else {
            $('#modhelp').show();
        }

        // 'Logs' page
        if (currentMod.main.logs) {
            $('#modulelogs').html(md.render(currentMod.main.logs));
            $('#modlogs').show();
        } else {
            $('#modlogs').hide();
        }
        $('#modinfo').click();
    });
};

//------------ menus ----------------------

// copyme
copymeMenu = new gui.Menu();
copymeMenu.append(new gui.MenuItem({
    label: languageJSON.common.copy,
    click: function (e) {
        clipboard.set(currentFragment,'text');
    }
}));
copymeMenu.append(new gui.MenuItem({
    label: languageJSON.common.addtonotes,
    click: function (e) {
        var editor = $('#notepaglobal .acer')[0].acer;
        editor.setValue(editor.getValue() + '\n' + currentFragment);
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on module lists
    $('#moduleincluded, #modulelist').delegate('li', 'click', function() {
        me = $(this);
        events.renderMod(me.text());
    });
});
