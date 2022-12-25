(function codeEditorCompletions() {
    const getInsertRange = function getInsertRange(model, position) {
        var word = model.getWordUntilPosition(position);
        return {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
        };
    };

    const createTemplateProposals = function createTemplateProposals(range) {
        // filtering is done by the Monaco editor
        return global.currentProject.templates.map(template => ({
            label: template.name,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: `'${template.name}'`,
            range
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const createRoomProposals = function createRoomProposals(range) {
        return global.currentProject.rooms.map(room => ({
            label: room.name,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: `'${room.name}'`,
            range
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const createSoundProposals = function createSoundProposals(range) {
        return global.currentProject.sounds.map(sound => ({
            label: sound.name,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: `'${sound.name}'`,
            range
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const createActionProposals = function createActionProposals(range) {
        return global.currentProject.actions.map(action => ({
            label: action.name,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: action.name,
            range
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const createPSProposals = function createPSProposals(range) {
        return global.currentProject.emitterTandems.map(et => ({
            label: et.name,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: `'${et.name}'`,
            range
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const checkMatch = function checkMatch(model, position, regex) {
        var textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
        });
        return textUntilPosition.match(regex);
    };

    const provideTemplateNames = function provideTemplateNames(model, position) {
        if (!checkMatch(model, position, /ct\.templates\.((make|copy|exists)\(|list\[|templates\[)$/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createTemplateProposals(range)
        };
    };
    const provideTemplateNamesCS = function provideTemplateNamesCS(model, position) {
        if (!checkMatch(model, position, /ct\.templates\.((make|copy|exists)( |\()|list\[|templates\[)$/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createTemplateProposals(range)
        };
    };

    const provideRoomNames = function provideRoomNames(model, position) {
        if (!checkMatch(model, position, /ct\.rooms\.((switch|append|prepend|merge)\(|templates\[|list\[)$/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createRoomProposals(range)
        };
    };
    const provideRoomNamesCS = function provideRoomNamesCS(model, position) {
        if (!checkMatch(model, position, /ct\.rooms\.((switch|append|prepend|merge)( |\()|templates\[|list\[)$/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createRoomProposals(range)
        };
    };

    const provideSoundNames = function provideSoundNames(model, position) {
        if (!checkMatch(model, position, /ct\.sound\.(spawn|volume|fade|stop|pause|resume|position|load|playing)\($/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createSoundProposals(range)
        };
    };
    const provideSoundNamesCS = function provideSoundNamesCS(model, position) {
        if (!checkMatch(model, position, /ct\.sound\.(spawn|volume|fade|stop|pause|resume|position|load|playing)( |\()$/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createSoundProposals(range)
        };
    };

    // Suits both coffeescript and typescript
    const provideActionNames = function provideActionNames(model, position) {
        if (!checkMatch(model, position, /ct\.actions\.$/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createActionProposals(range)
        };
    };

    const providePSNames = function providePSNames(model, position) {
        if (!checkMatch(model, position, /ct\.emitters\.(fire|append|follow)\($/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createPSProposals(range)
        };
    };
    const providePSNamesCS = function providePSNamesCS(model, position) {
        if (!checkMatch(model, position, /ct\.emitters\.(fire|append|follow)(\(| )$/)) {
            return {
                suggestions: []
            };
        }
        const range = getInsertRange(model, position);
        return {
            suggestions: createPSProposals(range)
        };
    };

    window.signals = window.signals || riot.observable({});
    window.signals.on('monacoBooted', () => {
        monaco.languages.registerCompletionItemProvider('typescript', {
            provideCompletionItems: provideTemplateNames,
            triggerCharacters: ['(', '[']
        });
        monaco.languages.registerCompletionItemProvider('coffeescript', {
            provideCompletionItems: provideTemplateNamesCS,
            triggerCharacters: [' ', '(', '[']
        });
        monaco.languages.registerCompletionItemProvider('typescript', {
            provideCompletionItems: provideSoundNames,
            triggerCharacters: ['(']
        });
        monaco.languages.registerCompletionItemProvider('coffeescript', {
            provideCompletionItems: provideSoundNamesCS,
            triggerCharacters: ['(', ' ']
        });
        monaco.languages.registerCompletionItemProvider('typescript', {
            provideCompletionItems: provideActionNames,
            triggerCharacters: ['.']
        });
        monaco.languages.registerCompletionItemProvider('coffeescript', {
            provideCompletionItems: provideActionNames,
            triggerCharacters: ['.']
        });
        monaco.languages.registerCompletionItemProvider('typescript', {
            provideCompletionItems: provideRoomNames,
            triggerCharacters: ['(', '[']
        });
        monaco.languages.registerCompletionItemProvider('coffeescript', {
            provideCompletionItems: provideRoomNamesCS,
            triggerCharacters: ['(', '[', ' ']
        });
        monaco.languages.registerCompletionItemProvider('typescript', {
            provideCompletionItems: providePSNames,
            triggerCharacters: ['(']
        });
        monaco.languages.registerCompletionItemProvider('coffeescript', {
            provideCompletionItems: providePSNamesCS,
            triggerCharacters: ['(', ' ']
        });
    });
})();
