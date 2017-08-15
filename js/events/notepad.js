window.events = window.events || {};
//-------------- events -------------------

events.notepadToggle = function() {
    var pad = $('#notepad');
    if (pad.hasClass('opened')) {
        pad.children('button').find('i').removeClass('icon-next').addClass('icon-back');
        pad.css('left', (window.innerWidth + 'px'));
        pad.removeClass('opened');
    } else {
        pad.children('button').find('i').removeClass('icon-back').addClass('icon-next');
        pad.css('left', (window.innerWidth - pad.width()) + 'px');
        pad.addClass('opened');
    }
};

//-------------- ace ----------------------
$(function () {$(function() {
    notepadlocal.getSession().on('change', function(e) {
        currentProject.notes = notepadlocal.getValue();
        glob.modified = true;
    });
    notepadglobal.getSession().on('change', function(e) {
        localStorage.notes = notepadglobal.getValue();
    });
})});
//-------------- onload -------------------
$(function () {$(function() {
    notepadglobal.setValue(localStorage.notes);
})});

$(function () {
    $('#helppages iframe').prop('src', exec + '/docs/index.html');
});
