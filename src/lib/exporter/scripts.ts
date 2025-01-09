import {ExporterError, highlightProblem} from './ExporterError';
import {civetOptions} from './scriptableProcessor';
import {compile as compileCatnip} from '../catnip/compiler';

import {compile as civet} from '@danielx/civet';

export const stringifyScripts = (scripts: IScript[]): string =>
    scripts.reduce((acc, script) => {
        let code;
        try { // Apply converters to the user's code first
            switch (script.language) {
            case 'typescript':
                code = script.code as string;
                break;
            case 'civet':
                code = civet(script.code as string, civetOptions);
                break;
            case 'catnip':
                code = compileCatnip(script.code as BlockScript, {
                    resourceId: script.uid,
                    resourceName: script.name,
                    resourceType: script.type,
                    eventKey: 'onRun'
                });
                code = 'var ' + script.variables.join(', ') + ';\n' + code;
                break;
            default: throw new Error(`Unsupported script language: ${script.language}`);
            }
            return acc + `'${script.name}': function (options) {\n${code}\n},`;
        } catch (e) {
            const errorMessage = `${e.name || 'An error'} occured while compiling script ${script.name}`;
            if (e instanceof ExporterError) {
                // Passthrough already formatted errors, mainly coming from Catnip
                throw e;
            } else {
                if (e.location || e.loc) {
                    const exporterError = new ExporterError(errorMessage, {
                        resourceId: script.uid,
                        resourceName: script.name,
                        resourceType: script.type,
                        problematicCode: highlightProblem(e.code || code, e.location || e.loc),
                        clue: 'syntax'
                    }, e);
                    throw exporterError;
                }
                throw new ExporterError(errorMessage + e, {
                    resourceId: script.uid,
                    resourceName: script.name,
                    resourceType: script.type,
                    clue: 'unknownError'
                });
            }
        }
    }, '');

export const getStartupScripts = (scripts: IScript[]): string => {
    const startup = scripts.filter(s => s.runAutomatically);
    return startup.reduce(
        (acc, script) => acc + `scripts['${script.name}']({});\n`,
        ''
    );
};
