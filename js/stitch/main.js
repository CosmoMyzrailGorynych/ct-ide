
//    __  __        _       
//   |  \/  | __ _ (_) _ _  
//   | |\/| |/ _` || || ' \ 
//   |_|  |_|\__,_||_||_||_|
//                          

/*******************************************

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

*******************************************/

/* 
   String.f (String.format - alias)
   Super-duper basic templating function.
   "I have {0} apples".f(3)
   ==> 'I have 3 apples'
   use double curly braces to get single ones
*/

preparetext = function(selector) {
    $(selector + ' a').click(function() {
        gui.Shell.openExternal($(this).attr('href'));
        return false;
    });
    $(selector).undelegate('contextmenu','.copyme')
    .delegate('contextmenu','.copyme', function (e) {
        currentFragment = $(this).text();
        copymeMenu.popup(e.clientX, e.clientY);
    });
    initdatainput(selector);
};


/********************************/

// first-launch setup
if (!localStorage.fontSize) {
    localStorage.fontSize = 18;
    localStorage.lastProjects = '';
    localStorage.notes = '';
}



// ace hotkeys
// decrease and increase font size
function extend_hotkeys (editor) {
    editor.commands.addCommand({
        name: 'increaseFontSize',
        bindKey: {win: 'Ctrl-+',  mac: 'Command-+'},
        exec: function(editor) {
            var num = Number(localStorage.fontSize);
            if (num < 48) {
                num ++;
                localStorage.fontSize = num;
                editor.style.fontSize = num+'px';
            }
            return false;
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'decreaseFontSize',
        bindKey: {win: 'Ctrl-minus',  mac: 'Command-minus'},
        exec: function(editor) {
            var num = Number(localStorage.fontSize);
            if (num > 6) {
                num --;
                localStorage.fontSize = num;
                editor.style.fontSize = num+'px';
            }
            return false;
        },
        readOnly: true
    });
}

// bind f1
key('f1', function () {
    gui.Shell.openItem(exec + '/docs/index.html')
});
key('ctrl + S', function () {
    events.save();
});

$(function () {
    graphCanvas = $('#atlas canvas')[0];
    graphCanvas.x = graphCanvas.getContext('2d');
    grprCanvas = $('#preview canvas')[0];
    grprCanvas.x = grprCanvas.getContext('2d');
    styleCanvas = $('#stylepreview canvas')[0];
    styleCanvas.x = styleCanvas.getContext('2d');
    roomCanvas = $('#roomview .editor canvas')[0];
    roomCanvas.x = roomCanvas.getContext('2d');
    roomCanvas.x.imageSmoothingEnabled = false;

    // ace
    acers = []; // скрытая реклама хохо
    langTools = ace.require("ace/ext/language_tools");
    $('.acer').each(function () {
        // [ace] == textarea/editor wrap
        // [ace].acer == ace instance (`editor`)
        // [ace].acer.sess == ace session
        jq = $(this);
        var me = ace.edit(this);
        extend_hotkeys(me);
        me.setTheme('ace/theme/tomorrow');
        this.acer = me;
        me.sess = me.getSession();
        this.style.fontSize = localStorage.fontSize + 'px';
        window[jq.attr('data-acervar')] = me;
        me.sess.setMode("ace/mode/" + jq.attr('data-mode'));
        me.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        acers.push(me);
    });

    // intro
    if (localStorage.lastProjects != '') {
        glob.lastProjects = localStorage.lastProjects.split(';');
    } else {
        glob.lastProjects = [];
    }
    if (glob.lastProjects[0] != '') {
        for (var i = 0; i < glob.lastProjects.length; i++) {
            $('#recent').append('<li data-name="{1}"><span>{0}</span></li>'.f(
                glob.lastProjects[i],
                path.basename(glob.lastProjects[i],'.json')
            ));
        }
    }


    alertify.set({ 
        labels: {
            ok: languageJSON.common.ok,
            cancel: languageJSON.common.cancel
        } 
    });

    // Run IDE
    $(function () { $(function () {
        $('#loading').fadeOut(200);
    })});

    // catch exir
    win.on('close', function () {
        if (glob.modified) {
            if (!confirm(languageJSON.common.reallyexit)) {
                return false;
            } else {
                this.close(true);
            }
        } else {
            this.close(true);
        }
    });
});

//setup ui components
$(function () {
    // styleview sliders
    $('#shadowblurslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [0,1],
            '20%': [10,1],
            '50%': [50,1],
            'max': [300,1]
        },
        step: 1
    }).on(function () {
        $('#shadowblur').change();
    }).Link('lower').to($('#shadowblur'));

    $('#strokeweightslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [1],
            'max': [30]
        },
        step: 1
    }).on('change',function () {
        $('#strokeweight').change();
    }).Link('lower').to($('#strokeweight'));

    $('#gradsizeslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [0,1],
            '5%': [10,1],
            '40%': [50,1],
            '80%': [300,1],
            'max': [1024,1]
        },
        step: 1
    }).on('change',function () {
        $('#fillgradsize').change();
    }).Link('lower').to($('#fillgradsize'));

    $('#fontsizeslider').noUiSlider({
        start: [0],
        connect: "lower",
        range: {
            'min': [6,1],
            '70%': [72,1],
            'max': [300,1]
        },
        step: 1
    }).on('change', function () {
        $('#fontsize').change();
    }).Link('lower').to($('#fontsize'));

    // colorpickers
    $('input.color:not(.rgb):not(#previewbgcolor)').val('#000').colorPicker({
        actionCallback: function (e,a) {
            var me = $(this.input);
            //console.log(e,a,this,this.input);
            if (me.attr('data-input')) {
                if (me.attr('type') == 'text' || !me.attr('type') || me[0].tagName.toUpperCase() == 'TEXTAREA') {
                    eval(me.attr('data-input') + ' = "' + me.val().replace(/\"/g, '\\"') + '"');
                } else {
                    eval(me.attr('data-input') + ' = ' + me.val());
                }
            }
            me.change();
        }
    });
    $('input.color.rgb:not(#previewbgcolor)').val('#000').colorPicker({
        noAlpha: true,
        customBG: '#222',
        actionCallback: function (e,a) {
            var me = $(this);
            console.log(e,a,this);
            if (me.attr('data-input')) {
                if (me.attr('type') == 'text' || !me.attr('type') || me[0].tagName.toUpperCase() == 'TEXTAREA') {
                    eval(me.attr('data-input') + ' = "' + me.val().replace(/\"/g, '\\"') + '"');
                } else {
                    eval(me.attr('data-input') + ' = ' + me.val());
                }
            }
            me.change();
        }
    });
    $('#previewbgcolor').val('#000').colorPicker({
        noAlpha: true,
        customBG: '#222',
        actionCallback: function () {
            $('#preview').css('background',$('#previewbgcolor').val());
        }
    });
});