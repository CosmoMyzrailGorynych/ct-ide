/* eslint-disable no-underscore-dangle */
const {languages} = monaco;

// The principle here is that we create an offscreen TypeScript document,
// put CoffeeScript statements into it with `@` replacement, and steal
// its code suggestions into another code editor.

const enslavedModel = monaco.editor.createModel('', 'typescript');
let workhorse;
languages.typescript.getTypeScriptWorker()
.then(worker => worker(enslavedModel.uri))
.then(service => {
    workhorse = service;
});

// There's definitely something not used in this list, but whatever
const workerToTSTypeMap = {
    function: monaco.languages.CompletionItemKind.Function,
    method: monaco.languages.CompletionItemKind.Function,
    property: monaco.languages.CompletionItemKind.Property,
    constant: monaco.languages.CompletionItemKind.Constant,
    namespace: monaco.languages.CompletionItemKind.Module,
    module: monaco.languages.CompletionItemKind.Module,
    class: monaco.languages.CompletionItemKind.Class,
    var: monaco.languages.CompletionItemKind.Variable,
    variable: monaco.languages.CompletionItemKind.Variable,
    default: monaco.languages.CompletionItemKind.Text
};

module.exports.atCompletions = {
    triggerCharacters: ['@', '.'],
    provideCompletionItems: async (model, position) => {
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: 0,
            endColumn: position.column
        };
        let currentLine = model.getValueInRange(range);
        // decaffeinate properties of `this`
        if (currentLine.endsWith('@')) {
            currentLine = currentLine.slice(0, -1) + 'this.';
        }
        currentLine = currentLine.split(' ').pop();
        // Add type definitions set by a code-editor-scriptable tag.
        currentLine = (model.ctCodePrefix || 'function () {') + currentLine;
        currentLine += '\n}';
        const suggestPos = currentLine.length - 1;
        enslavedModel.setValue(currentLine);
        const completions = await workhorse.getCompletionsAtPosition(
            enslavedModel.uri.toString(),
            suggestPos
        );
        if (!completions) {
            return {
                suggestions: []
            };
        }
        return {
            suggestions: completions.entries
            .filter(completion => !completion.name.startsWith('_'))
            .map(completion => ({
                label: completion.name,
                kind: workerToTSTypeMap[completion.kind] || workerToTSTypeMap.default,
                insertText: completion.insertText || completion.name
            }))
        };
    }
};
