(window => {
    var ctjsCoreCompletions = [
        'ct.pixiApp',
        'ct.libs',
        'ct.speed',
        'ct.delta',
        'ct.stack',
        'ct.types',
        'ct.types.Copy()',
        'ct.types.list[\'Type\']',
        'ct.types.make(\'Type\', x, y)',
        'ct.types.move(copy)',
        'ct.types.addSpeed(copy, speed, dir)',
        'ct.types.each(copy, function() {})',
        'ct.types.with(copy, function() {})',
        'ct.types.copy(\'Type\', x, y)',
        'ct.types.addSpd(copy, speed, dir)',
        'ct.fps',
        'ct.version',
        'ct.width',
        'ct.height',
        'ct.pixiApp',
        'ct.styles.get(\'StyleName\')',
        'ct.styles.get(\'StyleName\' {/* overrides */})',
        'ct.u.ldx(length, dir)',
        'ct.u.ldy(length, dir)',
        'ct.u.pdn(x1, y1, x2, y2)',
        'ct.u.pdc(x1, y1, x2, y2)',
        'ct.u.deltaDir(dir1, dir2)',
        'ct.u.clamp(min, value, max)',
        'ct.u.lerp(a, b, alpha)',
        'ct.u.unlerp(a, b, value)',
        'ct.u.prect(x, y, copy)',
        'ct.u.pcircle(x, y, copy)',
        'ct.u.ext(destination, source)',
        'ct.u.inspect(obj)',
        'ct.u.load(scriptUrl)',
        'ct.u.wait(1000)',
        'ct.u.lengthDirX(length, dir)',
        'ct.u.lengthDirY(length, dir)',
        'ct.u.pointDirection(x1, y1, x2, y2)',
        'ct.u.pointDistance(x1, y1, x2, y2)',
        'ct.u.pointRectangle(x, y, copy)',
        'ct.u.pointCircle(x, y, copy)',
        'ct.mouse.x',
        'ct.mouse.y',
        'ct.mouse.xprev',
        'ct.mouse.yprev',
        'ct.mouse.inside',
        'ct.mouse.pressed',
        'ct.mouse.down',
        'ct.mouse.released',
        'ct.mouse.button',
        'ct.mouse.clear()',
        'ct.mouse.hovers(copy)',
        'ct.rooms.templates[\'Room\']',
        'ct.rooms.make.apply(room)',
        'ct.rooms.clear()',
        'ct.rooms.switch(\'NewRoom\')',
        'ct.res.fetchImage(url, function(error, image) {})',
        'ct.res.getTexture(\'SpriteName\', frame)',
        'ct.sound.spawn(\'Name\', options)',
        'ct.room',
        'ct.room.center',
        'ct.room.name',
        'ct.room.borderY',
        'ct.room.borderX',
        'ct.room.follow',
        'ct.room.followDrift',
        'ct.room.followShiftX',
        'ct.room.followShiftY',
        'ct.room.x',
        'ct.room.y',
        'this.speed',
        'this.direction',
        'this.gravity',
        'this.gravityDir',
        'this.hspeed',
        'this.vspeed',
        'this.move()'
    ];
    var prepareCompletions = (array, meta) => array.map(function(word) {
        return {
            caption: word,
            value: word,
            meta
        };
    });
    var jsCompleter = {
        getCompletions(editor, session, pos, prefix, callback) {
            callback(null, prepareCompletions(ctjsCoreCompletions, 'core'));
        }
    };

    /**
     * Добавляет пользовательские хоткеи к редактору.
     * @param {AceEditor} editor Редактор, к которому привязываются хоткеи
     * @returns {void}
     */
    var extendHotkeys = editor => {
        editor.$blockScrolling = Infinity;
        editor.commands.addCommand({
            name: 'increaseFontSize',
            bindKey: {
                win: 'Ctrl-+',
                mac: 'Command-+'
            },
            exec(editor) {
                var num = Number(localStorage.fontSize);
                if (num < 48) {
                    num++;
                    localStorage.fontSize = num;
                    editor.tag.style.fontSize = num+'px';
                }
                return false;
            },
            readOnly: true
        });
        editor.commands.addCommand({
            name: 'decreaseFontSize',
            bindKey: {
                win: 'Ctrl--',
                mac: 'Command--'
            },
            exec(editor) {
                var num = Number(localStorage.fontSize);
                if (num > 6) {
                    num--;
                    localStorage.fontSize = num;
                    editor.tag.style.fontSize = num+'px';
                }
                return false;
            },
            readOnly: true
        });
    };

    var defaultOptions = {
        mode: 'plain_text'
    };

    var highlightBracketsOverride = function(Range) {
        var {session} = this;
        if (!session || !session.bgTokenizer) { return; }
        if (session.$bracketHighlight) { // Remove highlighting and set vars undefined
            session.$bracketHighlight = session.removeMarker(session.$bracketHighlight);
            session.$bracketHighlightMatch = session.removeMarker(session.$bracketHighlightMatch);
        }
        var cursorPos = this.getCursorPosition();
        cursorPos.column += 1; // Look for right-side bracket first
        var matchPos = session.findMatchingBracket(cursorPos);
        var matchRange;
        if (matchPos) {
            matchRange = new Range(matchPos.row, matchPos.column, matchPos.row, matchPos.column + 1);
        } else { // No right-side bracket, check left
            cursorPos.column -= 1;
            matchPos = session.findMatchingBracket(cursorPos);
            if (matchPos) {
                matchRange = new Range(matchPos.row, matchPos.column, matchPos.row, matchPos.column + 1);
            }
        }
        if (matchRange) {
            var cursorRange = new Range(cursorPos.row, cursorPos.column - 1, cursorPos.row, cursorPos.column);
            session.$bracketHighlight = session.addMarker(cursorRange, 'ace_bracket', 'text');
            session.$bracketHighlightMatch = session.addMarker(matchRange, 'ace_bracket', 'text');
        }
    };

    /**
     * Mounts an Ace editor on the passed tag.
     *
     * @global
     * @param {HTMLTextareaElement|HTMLDivElement} tag Тег, куда монтируется редактор. Может быть целевым полем ввода textarea или обёрткой для автоматически создаваемой textarea.
     * @param {Object} [options] Опции
     * @param {String} [options.mode='plain_text'] Режим поля ввода. Определяет подсветку синтаксиса и проверки кода на валидность. Может быть 'plain_text', 'markdown', 'javascript', 'html' или 'css'
     * @returns {AceEditor} Editor instance
     */
    window.setupAceEditor = (tag, options) => {
        /* global ace */
        const langTools = ace.require('ace/ext/language_tools');

        options = options || defaultOptions;
        var aceEditor = window.ace.edit(tag);
        extendHotkeys(aceEditor);
        aceEditor.setTheme('ace/theme/' + (localStorage.UItheme === 'Night'? 'ambiance': 'tomorrow'));
        tag.aceEditor = aceEditor;
        aceEditor.tag = tag;
        aceEditor.session = aceEditor.getSession();
        tag.style.fontSize = localStorage.fontSize + 'px';
        aceEditor.session.setMode('ace/mode/' + options.mode || defaultOptions.mode);
        aceEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: false,
            enableLiveAutocompletion: true
        });
        aceEditor.completers = [langTools.textCompleter, jsCompleter];
        var {Range} = window.ace.define.modules['ace/range']; // Needed for highlight override
        aceEditor.$highlightBrackets = highlightBracketsOverride.bind(aceEditor, Range);
        return aceEditor;
    };
})(this);
