
//    __  __        _
//   |  \/  | __ _ (_) _ _
//   | |\/| |/ _` || || ' \
//   |_|  |_|\__,_||_||_||_|
//

/**

 [data-event] --> onClick events. Declared in events.js
 This schecks some other attributes:
     [data-check] - required fields/fields with patterns etc... CSS selector
         [data-apattern] - requires RegExpr pattern to be false
         [data-pattern] - requires RegExpr pattern to be true
         [data-required] - must be non-empty

 [data-tab]   --> tabs component; this attribute is a css selector of elements to display.
 [data-input] --> onChange events (usually - may be triggered by jQuery). Attributes are pointing to JavaScript global variables.
    common variables:
        - currentGraphic
        - currentGraphicId

        - currentType
        - currentTypeId

        - currentSound
        - currentSoundId

        - currentRoom
        - currentRoomId

        - currentStyle
        - currentStyleId

        - currentMod
        - currentModName

        - currentProject

        - currentFragment – not used in currentProject; just a temp variable for copying text
        - currentTypePick – currently selected type in room editor
        - currentBackground

    try to save JSON-structures of projects.

 [data-mode]  --> ace.io language mode. Requires .acer class.

 // Maps

 glob.typemap:  uid      --> type index
 glob.graphmap: origname --> image
                             .g --> graph object

*/

/*
   String.f (String.format - alias)
   Super-duper basic templating function.
   "I have {0} apples".f(3)
   ==> 'I have 3 apples'
   use double curly braces to get single ones
*/

// first-launch setup
if (!localStorage.fontSize) {
    localStorage.fontSize = 18;
    localStorage.lastProjects = '';
    localStorage.notes = '';
}

// bind f1
key('f1', function () {
    gui.Shell.openItem(exec + '/docs/index.html')
});
key('ctrl + S', function () {
    events.save();
});

setTimeout(() => {
    window.alertify.set({
        labels: {
            ok: window.languageJSON.common.ok,
            cancel: window.languageJSON.common.cancel
        }
    });
});
