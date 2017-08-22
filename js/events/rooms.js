window.events = window.events || {};
//-------------- events -------------------

// костыли для ace
events.roomoncreate = function () {
    roomoncreate.moveCursorTo(0,0);
    roomoncreate.clearSelection();
    roomoncreate.focus();
}
events.roomonstep = function () {
    roomonstep.moveCursorTo(0,0);
    roomonstep.clearSelection();
    roomonstep.focus();
}
events.roomondraw = function () {
    roomondraw.moveCursorTo(0,0);
    roomondraw.clearSelection();
    roomondraw.focus();
}
events.roomonleave = function () {
    roomonleave.moveCursorTo(0,0);
    roomonleave.clearSelection();
    roomonleave.focus();
}

//-------------- ace ----------------------

$(function () {$(function() {
    roomoncreate.sess.on('change', function(e) {
        currentRoom.oncreate = roomoncreate.getValue();
    });
    roomonstep.sess.on('change', function(e) {
        currentRoom.onstep = roomonstep.getValue();
    });
    roomondraw.sess.on('change', function(e) {
        currentRoom.ondraw = roomondraw.getValue();
    });
    roomonleave.sess.on('change', function(e) {
        currentRoom.onleave = roomonleave.getValue();
    });
})});
