/* eslint-disable no-mixed-operators */
import {compile, SourceMap} from '@danielx/civet';
import {civetOptions} from './exporter/scriptableProcessor';
import Monaco from 'monaco-editor';

export type SourcemapLines = SourceMap['data']['lines'];

/**
 * The normal direction for sourcemapping is reverse,
 * given a position in the generated file it points
 * to a position in the source file.
 *
 * To do the opposite and find the position in the generated file
 * from the source file ("forward map") we want to find the "best" mapping.
 * The best mapping is the closest mapping with line <= original line
 * (ideally it will be equal to the original line), and column <= (original column).
 *
 * To find that mapping we check every reverse mapping holding on
 * to the best one so far.
 * If we're in the middle of an identifier and the best one begins
 * a few characters before the original column that is probably fine
 * since we don't map into the middle of identifiers.
 *
 * We linearly advance the found line and offset by the difference.
 */
export const forwardMap = function (sourcemapLines: SourcemapLines, position: Monaco.Position) {
    assert('line' in position, 'position must have line');
    assert('character' in position, 'position must have character');

    const {lineNumber: origLine, column: origOffset} = position;

    let col = 0;
    let bestLine = -1,
        bestOffset = -1,
        foundLine = -1,
        foundOffset = -1;

    sourcemapLines.forEach((line, i) => {
        col = 0;
        line.forEach((mapping) => {
            col += mapping[0];

            if (mapping.length === 4) {
          // find best line without going beyond
                const [, , srcLine, srcOffset] = mapping;
                if (srcLine <= origLine) {
                    if (srcLine > bestLine &&
                        (srcOffset <= origOffset) ||
                        srcLine === bestLine &&
                        (srcOffset <= origOffset) &&
                        (srcOffset >= bestOffset)
                    ) {
                        bestLine = srcLine;
                        bestOffset = srcOffset;
                        foundLine = i;
                        foundOffset = col;
                    }
                }
            }
        });
    });

    if (foundLine >= 0) {
        const genLine = foundLine + origLine - bestLine;
        const genOffset = foundOffset + origOffset - bestOffset;

      // console.log(`transformed position ${[origLine, origOffset]} => ${[genLine, genOffset]}`)

        return {
            lineNumber: genLine,
            column: genOffset
        };
    }

    // console.warn(`couldn't forward map src position: ${[origLine, origOffset]}`)
    return position;
};

const tsEditor = monaco.editor.create(document.createElement('textarea'), {
    language: 'typescript'
});
export const completionsProvider: Monaco.languages.CompletionItemProvider = {
    provideCompletionItems: async (model, position) => {
        const {code, sourceMap} = await compile(model.getValue(), {
            ...civetOptions,
            sync: false,
            sourceMap: true
        });
        const client = await monaco.languages.typescript.getTypeScriptWorker();
        const worker = await client(tsEditor.getModel()!.uri);
        tsEditor.setValue(code);
        const completions = await worker.getCompletionsAtPosition('ctjs.ts', model.getOffsetAt(position));
        for (const completion of completions) {
            const {lineNumber, column} =
                forwardMap(sourceMap.data.lines, completion.range.start);
            completion.range.start.lineNumber = lineNumber;
            completion.range.start.column = column;
        }
        return completions;
    }
};
