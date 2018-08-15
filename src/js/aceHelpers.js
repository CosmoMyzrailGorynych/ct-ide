(window => {
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
                    editor.style.fontSize = num+'px';
                }
                return false;
            },
            readOnly: true
        });
        editor.commands.addCommand({
            name: 'decreaseFontSize',
            bindKey: {
                win: 'Ctrl-minus',
                mac: 'Command-minus'
            },
            exec(editor) {
                var num = Number(localStorage.fontSize);
                if (num > 6) {
                    num--;
                    localStorage.fontSize = num;
                    editor.style.fontSize = num+'px';
                }
                return false;
            },
            readOnly: true
        });
    };

    var defaultOptions = {
        mode: 'plain_text'
    };

    /**
     * Монтирует редактор Ace на указанный тег
     *
     * @global
     * @param {HTMLTextareaElement|HTMLDivElement} tag Тег, куда монтируется редактор. Может быть целевым полем ввода textarea или обёрткой для автоматически создаваемой textarea.
     * @param {Object} [options] Опции
     * @param {String} [options.mode='plain_text'] Режим поля ввода. Определяет подсветку синтаксиса и проверки кода на валидность. Может быть 'plain_text', 'markdown', 'javascript', 'html' или 'css'
     * @returns {AceEditor} Editor instance
     */
    window.setupAceEditor = (tag, options) => {
        options = options || defaultOptions;
        var aceEditor = window.ace.edit(tag);
        extendHotkeys(aceEditor);
        aceEditor.setTheme('ace/theme/' + (localStorage.UItheme === 'Night'? 'ambiance': 'tomorrow'));
        tag.aceEditor = aceEditor;
        aceEditor.session = aceEditor.getSession();
        tag.style.fontSize = localStorage.fontSize + 'px';
        aceEditor.session.setMode('ace/mode/' + options.mode || defaultOptions.mode);
        aceEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        return aceEditor;
    };
})(this);
