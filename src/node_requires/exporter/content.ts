import {getUnwrappedBySpec} from './utils';

export const stringifyContent = (project: IProject): string => {
    const contentDb = {} as Record<string, Record<string, unknown>[]>;
    for (const contentType of project.contentTypes) {
        contentDb[contentType.name || contentType.readableName] = contentType.entries.map(entry =>
            getUnwrappedBySpec(entry, contentType.specification));
    }
    return JSON.stringify(contentDb)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
};
