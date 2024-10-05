import {ExporterError, highlightProblem} from './ExporterError';
import {civetOptions} from './scriptableProcessor';

import {compile as civet} from '@danielx/civet';
const typeScript = require('sucrase').transform;

export const stringifyScripts = (scripts: IScript[]): string =>
    scripts.reduce((acc, script) => {
        let code;
        try { // Apply converters to the user's code first
            code = script.language === 'civet' ?
                civet(script.code as string, civetOptions) :
                typeScript(script.code as string, {
                    transforms: ['typescript']
                }).code;
            return acc + `'${script.name}': function (options) {${code}},`;
        } catch (e) {
            const errorMessage = `${e.name || 'An error'} occured while compiling script ${script.name}`;
            const exporterError = new ExporterError(errorMessage, {
                resourceId: script.uid,
                resourceName: script.name,
                resourceType: script.type,
                problematicCode: highlightProblem(e.code || code, e.location || e.loc),
                clue: 'syntax'
            }, e);
            throw exporterError;
        }
    }, '');

export const getStartupScripts = (scripts: IScript[]): string => {
    const startup = scripts.filter(s => s.runAutomatically);
    return startup.reduce(
        (acc, script) => acc + `scripts['${script.name}']({});\n`,
        ''
    );
};
