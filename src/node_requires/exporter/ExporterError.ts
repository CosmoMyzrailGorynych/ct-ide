
interface IErrorRichInfo {
    resourceType?: resourceType,
    resourceName?: string,
    resourceId?: assetRef,
    eventKey?: string,
    problematicCode?: string,
    clue: 'syntax' | 'eventConfiguration' | 'emptySound' | 'emptyEmitter' | 'windowsFileLock' | 'unknown'
}

export class ExporterError<E extends Error | Error> extends Error {
    origMessage: string;
    richInfo: IErrorRichInfo;
    code?: string;
    loc?: {
        column: number
        line: number
    };
    location?: {/* eslint-disable camelcase */
        first_column: number,
        first_line: number,
        last_column: number,
        last_column_exclusive: number,
        last_line: number,
        last_line_exclusive: number,
        range: [number, number]
    };/* eslint-enable camelcase */
    constructor(
        message: string,
        richInfo: IErrorRichInfo,
        source?: E
    ) {
        super(message);
        this.richInfo = richInfo;
        if (source) {
            this.stack = message + '\n' + source.stack;
            this.origMessage = source.message;
            if ('location' in source) {
                this.location = (
                    source as E & {location: ExporterError<E>['location']}
                ).location as ExporterError<E>['location'];
            }
            if ('code' in source) {
                this.code = (source as E & {code: string}).code as string;
            }
        } else {
            this.stack = message;
        }
    }
}

export const highlightProblem = (
    code: string,
    location: ExporterError<Error>['location'] | ExporterError<Error>['loc']
): string => {
    const lines = code.split('\n');
    const output = [];
    let firstColumn, lastColumn, firstLine, lastLine;
    if ('first_column' in location) {
        firstColumn = location.first_column;
        firstLine = location.first_line;
        lastLine = location.last_line;
        lastColumn = location.last_column;
    } else {
        firstColumn = lastColumn = location.column;
        firstLine = lastLine = location.line - 1;
    }
    // Take a couple of lines before the error
    output.push(...lines.slice(Math.max(0, firstLine - 2), firstLine + 1));
    // Draw an arrow poking at the error
    output.push('_'.repeat(firstColumn) + '⮭'.repeat(firstLine === lastLine ? (lastColumn - firstColumn + 1) : 1));
    // Add subsequent lines if possible
    if (firstLine < lines.length - 1) {
        output.push(...lines.slice(
            firstLine + 1,
            firstLine + 3
        ));
    }
    return output.join('\n');
};
