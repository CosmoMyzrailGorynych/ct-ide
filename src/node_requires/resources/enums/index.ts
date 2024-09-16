import generateGUID from '../../generateGUID';
import {getOfType} from '..';
import {IDisposable, languages} from 'monaco-editor';
import {promptName} from '../promptName';

export const getTypescriptEnumName = (enumType: IEnum): string => enumType.name.replace(/\s/g, '_');
export const getTypescriptForEnum = (enumType: IEnum): string => `enum ${getTypescriptEnumName(enumType)} {
${enumType.values.map((v, ind) => `    ${v} = ${ind},`).join('\n')}
};`;

export const getAllEnumsTypescript = (): string => getOfType('enum')
    .map(getTypescriptForEnum)
    .join('\n');

let enumsDisposable: IDisposable | null = null;
export const updateEnumsTs = (): void => {
    if (enumsDisposable) {
        enumsDisposable.dispose();
    }
    enumsDisposable = languages.typescript.typescriptDefaults.addExtraLib(getAllEnumsTypescript());
};
window.signals.on('enumChanged', updateEnumsTs);

export const areThumbnailsIcons = true;
export const getThumbnail = () => 'list';

export const createAsset = async (): Promise<IEnum> => {
    const name = await promptName('enum', 'NewEnumeration');
    if (!name) {
        // eslint-disable-next-line no-throw-literal
        throw 'cancelled';
    }
    const enumAsset = {
        name,
        values: ['Value1'],
        lastmod: Number(new Date()),
        type: 'enum' as const,
        uid: generateGUID()
    };
    return enumAsset;
};

export const removeAsset = (en: IEnum) => {
    // Remove enumeration as input type from all content types and behaviors.
    for (const contentType of currentProject.contentTypes) {
        for (const field of contentType.specification) {
            if (field.type === `enum@${en.uid}`) {
                field.type = 'text';
            }
        }
    }
    for (const behavior of getOfType('behavior')) {
        for (const field of behavior.specification) {
            if (field.type === `enum@${en.uid}`) {
                field.type = 'text';
            }
        }
    }
};
