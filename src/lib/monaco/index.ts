import * as monaco from 'monaco-editor';
window.monaco = monaco;

import completions from './completions';
import helpers from './helpers';

// Extended coffeescript/civet tokenizer & suggestions provider
import {language as coffeescriptTokenizer} from './coffeescriptTokenizer';
import {completionsProvider as civetCompletions} from './civetLanguageFeatures';
// Extended typescript tokenizer
import {language as typescriptTokenizer} from './typescriptTokenizer';
// Hover provider for TypeScript and Civet that removes Catnip-specific annotations
import {HoverProvider as TsHoverProvider} from './catniplessTsHoverProvider';

import * as themeManager from 'src/lib/themes';

// eslint-disable-next-line max-lines-per-function
export default () => {
    // @see https://github.com/microsoft/monaco-editor-samples/blob/master/nwjs-amd-v2/index.html
    self.MonacoEnvironment = {
        getWorkerUrl(moduleId, label) {
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

    themeManager.loadBuiltInThemes();
    // To rollback to a default theme if the set one is inaccessible ⤵
    themeManager.loadTheme();

    monaco.languages.register({
        id: 'civet',
        aliases: ['Civet'],
        filenamePatterns: ['*.civet']
    });
    monaco.languages.setLanguageConfiguration('civet', {
        autoClosingPairs: [{
            open: '(',
            close: ')'
        }, {
            open: '[',
            close: ']'
        }, {
            open: '{',
            close: '}'
        }, {
            open: '"',
            close: '"'
        }, {
            open: '\'',
            close: '\''
        }, {
            open: '`',
            close: '`'
        }, {
            open: '/*',
            close: '*/'
        }, {
            open: '"""\n',
            close: '\n"""'
        }],
        brackets: [
            ['(', ')'],
            ['[', ']'],
            ['{', '}']
        ],
        colorizedBracketPairs: [
            ['(', ')'],
            ['[', ']'],
            ['{', '}']
        ],
        indentationRules: {
            increaseIndentPattern: /^\s*(if|for|while|else|switch)[\s\S]*$/,
            decreaseIndentPattern: /^\s*(break|return)$/
        }
    });
    // I have no guilt of this solution
    // @see https://github.com/microsoft/monaco-editor/issues/884
    monaco.editor.create(document.createElement('textarea'), {
        language: 'typescript',
        value: '(:'
    });
    monaco.editor.create(document.createElement('textarea'), {
        language: 'civet',
        value: ':)'
    });
    setTimeout(() => {
        monaco.languages.typescript.getTypeScriptWorker()
        .then((client) => {
            monaco.languages.setMonarchTokensProvider('typescript', typescriptTokenizer as monaco.languages.IMonarchLanguage);
            monaco.languages.setMonarchTokensProvider('civet', coffeescriptTokenizer as monaco.languages.IMonarchLanguage);
            monaco.languages.registerCompletionItemProvider('civet', civetCompletions);

            const hoverProvider = new TsHoverProvider(client);
            monaco.languages.registerHoverProvider('typescript', hoverProvider);
            monaco.languages.registerHoverProvider('javascript', hoverProvider);

            window.signals.trigger('monacoBooted');
        });
        helpers();
        completions();
    }, 1000);
};
