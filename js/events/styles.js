window.events = window.events || {};
//-------------- events -------------------

events.openStyle = function(style) {
    currentStyle = currentProject.styles[style];
    currentStyleId = style;
    $('#iftochangefont')[0].checked = !!currentStyle.font;
    $('#iftochangefill')[0].checked = !!currentStyle.fill;
    $('#iftochangestroke')[0].checked = !!currentStyle.stroke;
    $('#iftochangeshadow')[0].checked = !!currentStyle.shadow;
    if (currentStyle.fill) {
        $('#stylefillinner [name="filltype"][value="{0}"]'.f(currentStyle.fill.type)).click().change();
        if (currentStyle.fill.type == 1) {
            $('#stylefillinner [name="fillgradtype"][value="{0}"]'.f(currentStyle.fill.gradtype)).click().change();
        }
    }
    $('#styleview [data-input]:not([type="radio"])').each(function() {
        me = $(this);
        if (me.hasClass('color')) {
            me.val(eval(me.attr('data-input')) == undefined ? '#000000' : eval(me.attr('data-input')));
        } else if (me.attr('type') == 'number') {
            me.val(eval(me.attr('data-input')) == undefined ? 0 : eval(me.attr('data-input')));
        } else {
            me.val(eval(me.attr('data-input')) == undefined ? '' : eval(me.attr('data-input')));
        }
    });
    events.refreshStyleGraphic();

    $('#styleview .pattern, \
       #styleview .solidfill, \
       #styleview .gradientfill').hide();

    $('#styleview .align button').removeClass('selected');
    if (currentStyle.font) {
        $('#styleview .align button[value="{0} {1}"]'.f(currentStyle.font.valign, currentStyle.font.halign)).removeClass('selected');
    }

    opening = true;
    events.styleToggleFont.apply(document.getElementById('iftochangefont'));
    events.styleToggleFill.apply(document.getElementById('iftochangefill'));
    events.styleToggleShadow.apply(document.getElementById('iftochangeshadow'));
    events.styleToggleStroke.apply(document.getElementById('iftochangestroke'));
    opening = false;

    $('#styleview').show();
};
events.styleToggleFont = function() {
    if (this.checked) {
        $('#stylefontinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.font = {
                family: 'sans-serif',
                size: 12
            };
            $('#fontsize').val(12);
            $('#fontfamily').val('sans-serif');
            $('#stylefontinner .align button').removeClass('selected');
        }
    } else {
        $('#stylefontinner').attr('disabled', 'disabled');
        currentStyle.font = false;
    }
};
events.styleToggleFill = function() {
    if (this.checked) {
        $('#stylefillinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.fill = {};
            $('#stylefillinner [name="filltype"]:eq(0)').click();
        }
    } else {
        $('#stylefillinner').attr('disabled', 'disabled');
        currentStyle.fill = false;
    }
};
events.styleToggleStroke = function() {
    if (this.checked) {
        $('#stylestrokeinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.stroke = {
                color: '#000000',
                weight: 1
            };
            $('#strokecolor').val('#000000');
            $('#strokeweight').val(1);
        }
    } else {
        $('#stylestrokeinner').attr('disabled', 'disabled');
        currentStyle.stroke = false;
    }
};
events.styleToggleShadow = function() {
    if (this.checked) {
        $('#styleshadowinner').removeAttr('disabled');
        if (!opening) {
            currentStyle.shadow = {
                color: '#000000',
                x: 0,
                y: 0,
                blur: 0
            };
            $('#shadowcolor').val('#000000');
            $('#shadowblur, #shadowx, #shadowy').val(0);
        }
    } else {
        $('#styleshadowinner').attr('disabled', 'disabled');
        currentStyle.shadow = false;
    }
};
events.styleShowSolid = function () {
    if (!currentStyle.fill.color) {
        currentStyle.fill.color = '#000';
        $('#fillcolor').val('#000000');
    }
    $('#styleview .pattern, #styleview .gradientfill').hide();
    $('#styleview .solidfill').show();
};
events.styleShowGrad = function () {
    if (!currentStyle.fill.gradsize) {
        currentStyle.fill.color1 = '#fff';
        currentStyle.fill.color2 = '#000';
        $('#fillgradsize').val(50);
        currentStyle.fill.gradsize = 50;
        $('#fillcolor1').val('#ffffff');
        $('#fillcolor2').val('#000000');
        currentStyle.fill.gradtype = 2;
        $('#stylefillinner [name="fillgradtype"][value="{0}"]'.f(currentStyle.fill.gradtype)).click().change();
    }
    $('#styleview .pattern, #styleview .solidfill').hide();
    $('#styleview .gradientfill').show();
};
events.styleShowPattern = function () {
    if (!currentStyle.fill.patname) {
        $('#fillpatname').val('');
    }
    $('#styleview .gradientfill, #styleview .solidfill').hide();
    $('#styleview .pattern').show();
};
events.refreshStyleGraphic = function() {
    styleCanvas.x.strokeStyle = '#000000'; // обводка
    styleCanvas.x.globalAlpha = 1; // непрозрачность
    styleCanvas.x.font = '12px sans-serif'; // шрифт
    styleCanvas.x.fillStyle = '#000000'; // заливка
    styleCanvas.x.shadowBlur = 0; // размытие тени
    styleCanvas.x.shadowColor = 'none'; // цвет тени
    styleCanvas.x.shadowOffsetX = 0; // смещение тени по горизонтали
    styleCanvas.x.shadowOffsetY = 0; // смещение тени по вертикали
    styleCanvas.x.lineWidth = 0; // толщина линий для обводки
    styleCanvas.x.textBaseline = 'alphabet'; // способ выравнивания текста по вертикали
    styleCanvas.x.textAlign = 'left';

    styleCanvas.x.clearRect(0, 0, styleCanvas.width, styleCanvas.height);
    events.styleSet(styleCanvas.x);

    styleCanvas.x.save();
    styleCanvas.x.translate(100,100);
    styleCanvas.x.beginPath();
    styleCanvas.x.rect(0, 0, 100, 100);
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }
    styleCanvas.x.restore();

    styleCanvas.x.save();
    styleCanvas.x.translate(300,100);
    styleCanvas.x.beginPath();
    styleCanvas.x.arc(50, 50, 50, 0, 2 * Math.PI);
    styleCanvas.x.closePath();
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }
    styleCanvas.x.restore();


    styleCanvas.x.save();
    styleCanvas.x.translate(styleCanvas.width / 2, 300);
    styleCanvas.x.fillText(languageJSON.styleview.testtext, 0, 0);
    if (currentStyle.stroke) {
        styleCanvas.x.strokeText(languageJSON.styleview.testtext, 0, 0);
    }
    styleCanvas.x.restore();
};
events.styleSet = function (cx) {
    if (currentStyle.font) {
        cx.font = currentStyle.font.size + 'px ' + currentStyle.font.family;
        cx.textBaseline = currentStyle.font.valign;
        cx.textAlign = currentStyle.font.halign;
    }
    if (currentStyle.fill) {
        if (currentStyle.fill.type == 0) {
            cx.fillStyle = currentStyle.fill.color;
        } else if (currentStyle.fill.type == 1) {
            var grad;
            if (!currentStyle.fill.gradsize) {
                currentStyle.fill.gradsize = 50;
                currentStyle.fill.color1 = '#fff';
                currentStyle.fill.color2 = '#000';
            }
            if (currentStyle.fill.gradtype == 0) {
                grad = styleCanvas.x.createRadialGradient(
                    currentStyle.fill.gradsize,
                    currentStyle.fill.gradsize,
                    0,
                    currentStyle.fill.gradsize,
                    currentStyle.fill.gradsize,
                    currentStyle.fill.gradsize);
            } else if (currentStyle.fill.gradtype == 1) {
                grad = styleCanvas.x.createLinearGradient(0, 0, 0, currentStyle.fill.gradsize);
            } else {
                grad = cx.createLinearGradient(0, 0, currentStyle.fill.gradsize, 0);
            }
            grad.addColorStop(0, currentStyle.fill.color1);
            grad.addColorStop(1, currentStyle.fill.color2);
            cx.fillStyle = grad;
        } else if (currentStyle.fill.type == 2) {
            if (currentStyle.fill.patname != '') {
                var imga = document.createElement('img');
                imga.onload = function () {
                    events.styleRedrawPreview();
                }
                for (var i = 0; i < currentProject.graphs.length; i++) {
                    if (currentProject.graphs[i].name == currentStyle.fill.patname) {
                        cx.img = imga;
                        imga.src = sessionStorage.projdir + '/img/' + currentProject.graphs[i].origname;
                        break;
                    }
                }
            }
            cx.fillStyle = '#fff';
        }
    }
    if (currentStyle.stroke) {
        cx.strokeStyle = currentStyle.stroke.color;
        cx.lineWidth = currentStyle.stroke.weight;
    }
    if (currentStyle.shadow) {
        cx.shadowColor = currentStyle.shadow.color;
        cx.shadowBlur = currentStyle.shadow.blur;
        cx.shadowOffsetX = currentStyle.shadow.x;
        cx.shadowOffsetY = currentStyle.shadow.y;
    }
};
events.styleRedrawPreview = function () {
    styleCanvas.x.fillStyle = styleCanvas.x.createPattern(styleCanvas.x.img,"repeat");
    styleCanvas.x.clearRect(0, 0, styleCanvas.width, styleCanvas.height);

    styleCanvas.x.beginPath();
    styleCanvas.x.rect(100, 100, 100, 100);
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }

    styleCanvas.x.beginPath();
    styleCanvas.x.arc(350, 150, 50, 0, 2 * Math.PI);
    styleCanvas.x.closePath();
    styleCanvas.x.fill();
    if (currentStyle.stroke) {
        styleCanvas.x.stroke();
    }

    styleCanvas.x.fillText(languageJSON.styleview.testtext, styleCanvas.width / 2, 300);
    if (currentStyle.stroke) {
        styleCanvas.x.strokeText(languageJSON.styleview.testtext, styleCanvas.width / 2, 300);
    }
};

events.styleSave = function() {
    events.styleGenPreview();
    events.fillStyles();
    $('#styleview').hide();
};
events.styleSetAlign = function () {
    var arr = this.value.split(' ');
    currentStyle.font.valign = arr[0];
    currentStyle.font.halign = arr[1];
    events.refreshStyleGraphic();
};
events.styleGenPreview = function () {
    var c = document.createElement('canvas');
    c.x = c.getContext('2d');
    c.width = c.height = 64;
    c.x.clearRect(0, 0, 64, 64);
    events.styleSet(c.x);
    styleCanvas.x.textBaseline = 'middle';
    styleCanvas.x.textAlign = 'center';
    c.x.fillText('Aa',32,32);
    if (currentStyle.stroke) {
        c.x.strokeText('Aa',32,32);
    }
    var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile(sessionStorage.projdir + '/img/s' + currentStyle.uid + '.png', buf, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('new thumbnail', sessionStorage.projdir + '/img/s' + currentStyle.uid + '.png');
        $('#styles .cards li[data-style="{0}"] img'.f(currentStyleId)).attr('src', '')
        .attr('src', sessionStorage.projdir + '/img/s' + currentProject.styles[currentStyleId].uid + '.png?{0}'.f(Math.random()));
    });
    $(c).remove(); // is needed?
};

events.styleFindPattern = function () {
    $('#tempgraphic .cards')
    .undelegate('li','click')
    .children()
    .remove();
    $('#graphic .cards li')
    .clone()
        .appendTo("#tempgraphic .cards");
    $('#tempgraphic .cards').delegate('li','click', function () {
        var me = $(this);
        $('#fillpatname').val(currentProject.graphs[me.attr('data-graph')].name).change();
        $('#tempgraphic').hide();
    });
    $('#tempgraphic').show();
};

//------------ menus ----------------------

styleMenu = new gui.Menu(); // +
styleMenu.append(new gui.MenuItem({
    label: languageJSON.common.open,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'folder.png',
    click: function () {
        $('#styles .cards li[data-style="{0}"]'.f(currentStyleId)).click();
    }
}));
styleMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.duplicate,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'plus.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r,
                        st = JSON.parse(JSON.stringify(currentStyle));
                    currentProject.styletick ++;
                    st.name = nam;
                    st.uid = currentProject.styletick;
                    currentProject.styles.push(st);
                    currentStyleId = currentProject.styles.length - 1;
                    currentStyle = currentProject.styles[currentStyleId];
                    events.styleGenPreview();
                    events.fillStyles();
                }
            }
        }, currentStyle.name + '_dup');
    }
}));
styleMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.rename,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'edit.png',
    click: function () {
        alertify.prompt(languageJSON.common.newname, function (e, r) {
            if (e) {
                if (r != '') {
                    var nam = r;
                    currentStyle.name = nam;
                    events.fillStyles();
                }
            }
        }, currentStyle.name);
    }
}));
styleMenu.append(new gui.MenuItem({ // +
    label: languageJSON.common.delete,
    icon: assets + (isMac ? '/img/black/' : '/img/blue/') + 'delete.png',
    click: function () {
        alertify.confirm(languageJSON.common.confirmDelete.f(currentStyle.name), function (e) {
            if (e) {
                currentProject.styles.splice(currentStyleId,1);
                events.fillStyles();
            }
        });
    }
}));

//-------------- UI links -----------------

$(function () {
    // delegate events on style cards
    $('#styles .cards').delegate('li', 'click', function() {
        events.openStyle($(this).attr('data-style'));
    }).delegate('li', 'contextmenu', function(e) {
        var me = $(this);
        currentStyle = currentProject.styles[me.attr('data-style')];
        currentStyleId = me.attr('data-style');
        styleMenu.popup(e.clientX, e.clientY);
    });
    // styleview events
    $('#styleview').delegate('input', 'change', events.refreshStyleGraphic);
    $('#styleview .align button').click(function () {
        $('#styleview .align button').removeClass('selected');
        $(this).addClass('selected');
    })
});
