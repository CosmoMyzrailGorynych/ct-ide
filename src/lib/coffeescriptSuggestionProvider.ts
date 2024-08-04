/* eslint-disable no-underscore-dangle */
import type Monaco from 'monaco-editor';
import type ts from 'typescript';

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

// The principle here is that we create an offscreen TypeScript document,
// put CoffeeScript statements into it with `@` replacement, and steal
// its code suggestions into another code editor.
export class CompletionsProvider {
    private _worker: (uri: string) => Promise<Monaco.languages.typescript.TypeScriptWorker>;
    constructor(worker: (uri: string) => Promise<Monaco.languages.typescript.TypeScriptWorker>) {
        this._worker = worker;
    }
    triggerCharacters = ['@', '.'];
    completionsModel = monaco.editor.createModel('', 'typescript');
    async provideCompletionItems(model: Monaco.editor.ITextModel & {
        ctCodePrefix?: string;
    }, position: Monaco.IPosition) {
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
        currentLine = currentLine.split(' ').pop()!;
        // Add type definitions set by a code-editor-scriptable tag.
        currentLine = (model.ctCodePrefix || 'function () {') + currentLine;
        currentLine += '\n}';
        const suggestPos = currentLine.length - 1;
        this.completionsModel.setValue(currentLine);
        const client = await this._worker(this.completionsModel.uri.toString());
        const completions: ts.CompletionInfo | undefined =
            await client.getCompletionsAtPosition(
                this.completionsModel.uri.toString(),
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
                kind: workerToTSTypeMap[completion.kind as keyof typeof workerToTSTypeMap] ||
                      workerToTSTypeMap.default,
                insertText: completion.insertText || completion.name
            }))
        };
    }
}
