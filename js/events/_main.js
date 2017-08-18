/*
    ___                 _
   | __|__ __ ___  _ _ | |_  ___
   | _| \ V // -_)| ' \|  _|(_-<
   |___| \_/ \___||_||_|\__|/__/

*/

function initdatainput (selector) {
    return $(selector + ' [data-input]').change(function() {
        try {
            // won't work with arrays...
            /*
            var me = $(this),
                arr = me.attr('data-input').split('.');
            context = window;
            for (var i = 0; i < arr.length - 1; i++) {
                context = context[arr[i]];
            }
            context[arr[arr.length - 1]] = me.val();
            */
            var me = $(this);
            if (me.attr('type') == 'text' || !me.attr('type') || me[0].tagName.toUpperCase() == 'TEXTAREA') {
                eval(me.attr('data-input') + ' = "' + me.val().replace(/\"/g, '\\"') + '"');
            } else {
                eval(me.attr('data-input') + ' = ' + me.val());
            }

            // bind events on graphview inputs
            me.filter('#graphx, #graphy, \
               #graphviewshaperound, \
               #graphviewshaperectangle, \
               #graphrad, \
               #graphtop, #graphleft, #graphright, #graphbottom, \
               #graphcols, #graphrows, \
               #graphframes')
            .change(events.refreshGraphCanvas);
            glob.modified = true;
        } catch (err) {
            console.error(err);
            document.getElementById('scream').play();
        }
    });
}
$(function() {
    initdatainput('body');
});

/* templates */

tmpl = {
    type: '<li data-type="{2}" data-graph="{3}"><span>{0}</span><img src="{1}"/></li>',
    style: '<li data-style="{2}"><span>{0}</span><img src="{1}"/></li>',
    background: '<li class="bg" data-background="{2}"><img src="{0}" /><span>{1}</span></li>'
};


/* some patterns */
apatterns = {
    SymbolDigitUnderscore: /[^qwertyuiopasdfghjklzxcvbnm1234567890_]/gi
}
patterns = {
    images: /\.(jpg|gif|png|jpeg)/gi
}

/*
    temporary global objects for editing:

    currentGraphic = {};
    currentType = {};
    currentSound = {};
    currentRoom = {};
    currentStyle = {};
    currentMod = {};
    currentProject = {};
*/

function checkAntiPattern() {
    var me = $(this);
    if (apatterns[me.attr('data-apattern')].exec(me.val())) {
        passed = false;
        me.addClass('error');
    } else {
        me.removeClass('error');
    }
}

function checkPattern() {
    var me = $(this);
    if (!patterns[me.attr('data-pattern')].exec(me.val())) {
        passed = false;
        me.addClass('error');
    } else {
        me.removeClass('error');
    }
}

$(function() {

    // init events
    $('[data-event]:not([type="file"])').click(function(e) {
        var me = $(this);
        passed = true;
        try {
            if (me.attr('data-check')) {
                var they = $(me.attr('data-check'));
                they.filter('[data-pattern]').each(function() {
                    checkPattern.apply(this);
                });
                they.filter('[data-apattern]').each(function() {
                    checkAntiPattern.apply(this);
                });
                they.filter('[data-required]').each(function() {
                    if (this.value == '') {
                        passed = false;
                        $(this).addClass('error');
                    } else {
                        $(this).removeClass('error');
                    }
                });
            }
            if (passed) {
                events[me.attr('data-event')].call(me[0], e);
            }
        } catch (err) {
            console.error(err);
            document.getElementById('scream').play();
        }
    });
    // wrapping [type="file"] in jQuery causes a DOM error?! O_o
    // the same is with console.log(input);
    $('[data-event][type="file"]').each(function() {
        this.onchange = function() { // we don't need validations, do we?
            var me = this;
            try {
                events[me.attributes['data-event'].value].call(me[0], ($(me)));
            } catch (err) {
                console.error(err);
                document.getElementById('scream').play();
            }
            // back to default
            //me.value = '';
        }
    });
    preparetext('body');
});
