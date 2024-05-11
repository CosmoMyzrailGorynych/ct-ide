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
// workaround monaco-css not understanding the environment
self.module = void 0;
// workaround monaco-typescript not understanding the environment
self.process.browser = true;

// Extended typescript tokenizer
const typescriptTokenizer = require('src/node_requires/typescriptTokenizer.js').language;
// Extended coffeescript tokenizer & suggestions provider
const coffeescriptTokenizer = require('src/node_requires/coffeescriptTokenizer.js').language;
const coffeescriptSuggestions = require('src/node_requires/coffeescriptSuggestionProvider.js');

themeManager.loadBuiltInThemes();
// To rollback to a default theme if the set one is inaccessible ⤵
themeManager.loadTheme();

// I have no guilt of this solution
// @see https://github.com/microsoft/monaco-editor/issues/884
monaco.editor.create(document.createElement('textarea'), {
    language: 'typescript',
    value: '(:'
});
monaco.editor.create(document.createElement('textarea'), {
    language: 'coffeescript',
    value: ':)'
});
setTimeout(() => {
    monaco.languages.setMonarchTokensProvider('typescript', typescriptTokenizer);
    monaco.languages.setMonarchTokensProvider('coffeescript', coffeescriptTokenizer);
    monaco.languages.registerCompletionItemProvider('coffeescript', coffeescriptSuggestions.atCompletions);
    window.signals.trigger('monacoBooted');
}, 1000);

window.signals = window.signals || riot.observable({});
window.orders = window.orders || riot.observable({});
