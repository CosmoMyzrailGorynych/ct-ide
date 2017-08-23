/*
    ___                 _
   | __|__ __ ___  _ _ | |_  ___
   | _| \ V // -_)| ' \|  _|(_-<
   |___| \_/ \___||_||_|\__|/__/

*/

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
