window.events = window.events || {};
//-------------- events -------------------

// костыли для ace
events.typeoncreate = function () {
    // При запуске триггерится жмак первых табов в навигациях.
    // Здесь есть предохранитель.
    if (window.currentType) {
        typeoncreate.moveCursorTo(0,0);
        typeoncreate.clearSelection();
        typeoncreate.focus();
    }
}
events.typeonstep = function () {
    typeonstep.moveCursorTo(0,0);
    typeonstep.clearSelection();
    typeonstep.focus();
}
events.typeondraw = function () {
    typeondraw.moveCursorTo(0,0);
    typeondraw.clearSelection();
    typeondraw.focus();
}
events.typeondestroy = function () {
    typeondestroy.moveCursorTo(0,0);
    typeondestroy.clearSelection();
    typeondestroy.focus();
}
events.typeSave = function () {
    events.fillTypes();
    glob.modified = true;
    $('#typeview').hide();
};
