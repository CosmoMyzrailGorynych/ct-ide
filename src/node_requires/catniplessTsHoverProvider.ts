// This hover provider removes @catnip tags from documentation,
// but otherwise copies the source of monaco-editor's HoverProvider.

/* eslint-disable id-blacklist */
/* eslint-disable no-underscore-dangle */
import type Monaco from 'monaco-editor';
import type ts from 'typescript';

/** Custom hover provider that removes @catnip tags from documentation  */
const displayPartsToString = function (displayParts?: ts.SymbolDisplayPart[]) {
    if (displayParts) {
        return displayParts.map((displayPart) => displayPart.text).join('');
    }
    return '';
};

const tagToString = function (tag: ts.JSDocTagInfo) {
    let tagLabel = `*@${tag.name}*`;
    if (tag.name === 'param' && tag.text) {
        const [paramName, ...rest] = tag.text;
        tagLabel += `\`${paramName.text}\``;
        if (rest.length > 0) {
            tagLabel += ` — ${rest.map((r) => r.text).join(' ')}`;
        }
    } else if (Array.isArray(tag.text)) {
        tagLabel += ` — ${tag.text.map((r) => r.text).join(' ')}`;
    } else if (tag.text) {
        tagLabel += ` — ${tag.text}`;
    }
    return tagLabel;
};
export class HoverProvider {
    private _worker: (uri: string) => Promise<Monaco.languages.typescript.TypeScriptWorker>;
    constructor(worker: (uri: string) => Promise<Monaco.languages.typescript.TypeScriptWorker>) {
        this._worker = worker;
    }
    // eslint-disable-next-line class-methods-use-this
    _textSpanToRange(model: Monaco.editor.ITextModel & {
        ctCodePrefix?: string;
    }, span: ts.TextSpan): Monaco.IRange {
        const p1 = model.getPositionAt(span.start);
        const p2 = model.getPositionAt(span.start + span.length);
        const {lineNumber: startLineNumber, column: startColumn} = p1;
        const {lineNumber: endLineNumber, column: endColumn} = p2;
        return {
            startLineNumber, startColumn, endLineNumber, endColumn
        };
    }
    async provideHover(model: Monaco.editor.ITextModel & {
        ctCodePrefix?: string;
    }, position: Monaco.IPosition) {
        const resource = model.uri.toString();
        const offset = model.getOffsetAt(position);
        const worker = await this._worker(resource);
        if (model.isDisposed()) {
            return;
        }
        const info = await worker.getQuickInfoAtPosition(
            resource.toString(),
            offset
        ) as ts.QuickInfo | undefined;
        if (!info || model.isDisposed()) {
            return;
        }
        const documentation = displayPartsToString(info.documentation);
        const tags = info.tags ?
            info.tags
                .filter(tag => !tag.name.startsWith('catnip'))
                .map((tag) => tagToString(tag))
                .join('  \n\n') :
            '';
        const contents = displayPartsToString(info.displayParts);
        // eslint-disable-next-line consistent-return
        return {
            range: this._textSpanToRange(model, info.textSpan),
            contents: [
                {
                    value: '```typescript\n' + contents + '\n```\n'
                },
                {
                    value: documentation + (tags ? '\n\n' + tags : '')
                }
            ]
        };
    }
}
