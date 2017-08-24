/*
    ___                 _
   | __|__ __ ___  _ _ | |_  ___
   | _| \ V // -_)| ' \|  _|(_-<
   |___| \_/ \___||_||_|\__|/__/

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
