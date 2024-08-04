import {transform} from 'sucrase';
import {getAllEnumsTypescript, getTypescriptEnumName} from '../resources/enums';
import {getOfType} from '../resources';

export const compileEnums = (production: boolean): string => {
    let output = transform(getAllEnumsTypescript(), {
        transforms: ['typescript']
    }).code;
    if (production) {
        return output;
    }
    const enums = getOfType('enum');
    output += '\n' + enums.map(e => {
        const tsName = getTypescriptEnumName(e);
        return `window.${tsName} = ${tsName};`;
    }).join('\n');
    return output;
};
