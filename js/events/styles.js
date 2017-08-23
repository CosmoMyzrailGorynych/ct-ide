//-------------- UI links -----------------

$(function () {
    // styleview events
    $('#styleview').delegate('input', 'change', events.refreshStyleGraphic);
});
