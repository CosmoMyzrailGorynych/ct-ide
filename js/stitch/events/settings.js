
//-------------- events -------------------

events.fillProjectSettings = function() {
    $('#settings [data-input]:not([type="checkbox"], [type="radio"])').each(function() {
        me = $(this);
        try {
            me.val(eval(me.attr('data-input'))); // D:
        } catch(e) {
            console.log(e);
        }
    });
    $('#settings [data-input]').filter('[type="checkbox"], [type="radio"]').each(function() {
        me = $(this);
        try {
            me.prop("checked", eval(me.attr('data-input'))); // D:
        } catch(e) {
            console.log(e);
        }
    });
};