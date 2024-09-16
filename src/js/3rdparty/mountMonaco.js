const path = require('path');

// workaround monaco-css not understanding the environment
self.module = void 0;
// workaround monaco-typescript not understanding the environment
self.process.browser = true;
window.__filename = window.__filename || path.join(__dirname, 'index.html');

// @see https://github.com/microsoft/monaco-editor-samples/blob/master/nwjs-amd-v2/index.html
const monaco = require('monaco-editor');
window.monaco = monaco;
self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return './data/monaco-workers/vs/language/json/json.worker.js';
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return './data/monaco-workers/vs/language/css/css.worker.js';
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return './data/monaco-workers/vs/language/html/html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './data/monaco-workers/vs/language/typescript/ts.worker.js';
        }
        return './data/monaco-workers/vs/editor/editor.worker.js';
    }
};

const monacoConfig = {
    hovers: false,
    codeActions: true,
    completionItems: true,
    definitions: true,
    diagnostics: true,
    documentHighlights: true,
    // eslint-disable-next-line id-length
    documentRangeFormattingEdits: true,
    documentSymbols: true,
    inlayHints: true,
    onTypeFormattingEdits: true,
    references: true,
    rename: true,
    signatureHelp: true
};
// Need to set defaults before any editor is created
monaco.languages.typescript.typescriptDefaults.setModeConfiguration(monacoConfig);
monaco.languages.typescript.javascriptDefaults.setModeConfiguration(monacoConfig);

// Extended typescript tokenizer
const typescriptTokenizer = require('src/node_requires/typescriptTokenizer.js').language;
// Extended coffeescript tokenizer & suggestions provider
const coffeescriptTokenizer = require('src/node_requires/coffeescriptTokenizer.js').language;
// Must be a `require` or typescript package becomes deadly confused
const {completionsProvider: civetCompletions} = require('src/node_requires/civetLanguageFeatures');
const {HoverProvider: TsHoverProvider} = require('src/node_requires/catniplessTsHoverProvider.js');

themeManager.loadBuiltInThemes();
// To rollback to a default theme if the set one is inaccessible ⤵
themeManager.loadTheme();

// I have no guilt of this solution
// @see https://github.com/microsoft/monaco-editor/issues/884
monaco.editor.create(document.createElement('textarea'), {
    language: 'typescript',
    value: '(:'
});

monaco.languages.register({
    id: 'civet'
});

monaco.editor.create(document.createElement('textarea'), {
    language: 'civet',
    value: ':)'
});
setTimeout(() => {

    monaco.languages.setMonarchTokensProvider('typescript', typescriptTokenizer);
    monaco.languages.setMonarchTokensProvider('civet', coffeescriptTokenizer);
    monaco.languages.registerCompletionItemProvider('civet', civetCompletions);
    window.signals.trigger('monacoBooted');
    monaco.languages.typescript.getTypeScriptWorker()
    .then((client) => {
        const hoverProvider = new TsHoverProvider(client);
        monaco.languages.registerHoverProvider('typescript', hoverProvider);
        monaco.languages.registerHoverProvider('javascript', hoverProvider);

        window.signals.trigger('monacoBooted');
    });
}, 1000);

window.signals = window.signals || riot.observable({});
window.orders = window.orders || riot.observable({});
