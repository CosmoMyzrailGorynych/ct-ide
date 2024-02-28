import {getByPath} from '../../i18n';
import {assetTypes, exists} from '..';

const capitalize = (str: string): string => str.slice(0, 1).toUpperCase() + str.slice(1);

export const getFieldsExtends = (): IExtensionField[] => [{
    name: getByPath('settings.content.typeSpecification') as string,
    type: 'table',
    key: 'specification',
    fields: [{
        name: getByPath('settings.content.fieldName'),
        type: 'text',
        key: 'name',
        help: getByPath('settings.content.fieldNameHint')
    }, {
        name: getByPath('settings.content.fieldReadableName'),
        type: 'text',
        key: 'readableName',
        help: getByPath('settings.content.fieldReadableNameHint')
    }, {
        name: getByPath('settings.content.fieldType'),
        type: 'select',
        key: 'type',
        options: ['text', 'textfield', 'code', '', 'number', 'sliderAndNumber', 'point2D', '', ...assetTypes, '', 'checkbox', 'color'].map(type => ({
            // eslint-disable-next-line no-nested-ternary
            name: type === '' ?
                '' :
                (assetTypes.includes(type as resourceType) ?
                    capitalize(getByPath(`common.assetTypes.${type}.0`) as string) :
                    getByPath('common.fieldTypes.' + type)
                ),
            value: type
        })),
        default: 'text'
    }, {
        name: getByPath('common.required'),
        type: 'checkbox',
        key: 'required',
        default: false
    }, {
        name: getByPath('settings.content.array'),
        type: 'checkbox',
        key: 'array',
        default: false
    }, {
        name: getByPath('settings.content.fixedLength'),
        type: 'number',
        key: 'fixedLength',
        if: 'array'
    }] as IExtensionField[]
}];

export const getExtends = (): IExtensionField[] => [{
    name: getByPath('settings.content.typeName') as string,
    type: 'text',
    key: 'name',
    help: getByPath('settings.content.typeNameHint') as string,
    required: true
}, {
    name: getByPath('settings.content.typeReadableName') as string,
    type: 'text',
    key: 'readableName',
    help: getByPath('settings.content.typeReadableNameHint') as string
}, {
    name: getByPath('settings.content.icon') as string,
    type: 'icon',
    key: 'icon',
    default: 'copy'
}, ...getFieldsExtends()];

export const fieldTypeToTsType: Record<IFieldSchema['type'], string> = {
    checkbox: 'boolean',
    code: 'string',
    color: 'string',
    number: 'number',
    point2D: '[number, number]',
    sliderAndNumber: 'number',
    text: 'string',
    room: 'string',
    sound: 'string',
    tandem: 'string',
    template: 'string',
    texture: 'string',
    textfield: 'string',
    behavior: 'string',
    font: 'string',
    script: 'string',
    style: 'string'
};

const getTsType = (content: IContentType): string => {
    const fields = content.specification
        .map(f => `        /**${f.readableName || f.name}*/
        '${f.name}': ${fieldTypeToTsType[f.type]}${f.array ? '[]' : ''};`)
        .join('\n');
    return `
    var ${content.name}: {
${fields}
    }[];`;
};
const getTsTypings = (project: IProject): string =>
    `declare namespace content {
    ${project.contentTypes.map(getTsType).join('\n')}
}`;

let dsHandle: false | [IDisposable, IDisposable] = false;
export const updateContentTypedefs = (project: IProject) => {
    if (dsHandle) {
        dsHandle[0].dispose();
        dsHandle[1].dispose();
        dsHandle = false;
    }
    const ts = monaco.languages.typescript;
    const typedefs = getTsTypings(project);
    dsHandle = [
        ts.javascriptDefaults.addExtraLib(typedefs),
        ts.typescriptDefaults.addExtraLib(typedefs)
    ];
};

export const schemaToExtensions = (schema: IFieldSchema[]): IExtensionField[] => schema
    .map((spec: IFieldSchema) => {
        const field: IExtensionField = {
            key: spec.name || spec.readableName,
            name: spec.readableName || spec.name,
            type: spec.array ? 'array' : (spec.type || 'text'),
            required: spec.required
        };
        if (field.type === 'array') {
            field.arrayType = spec.type || 'text';
            if (spec.fixedLength) {
                field.arrayLength = spec.fixedLength;
            }
            field.default = () => [] as unknown[];
        } else if (field.type === 'sliderAndNumber') {
            field.min = 0;
            field.max = 100;
            field.step = 1;
            field.default = 0;
        } else if (['texture', 'template', 'room', 'sound', 'tandem'].includes(field.type)) {
            field.default = -1;
        } else if (field.type === 'number') {
            field.default = 0;
        }
        return field;
    });

const validationType: Record<IFieldSchema['type'], 'ref' | 'string' | 'number' | 'boolean' | 'vec2'> = {
    code: 'string',
    color: 'string',
    text: 'string',
    textfield: 'string',
    point2D: 'vec2',
    number: 'number',
    sliderAndNumber: 'number',
    checkbox: 'boolean',
    behavior: 'ref',
    font: 'ref',
    room: 'ref',
    script: 'ref',
    sound: 'ref',
    style: 'ref',
    tandem: 'ref',
    template: 'ref',
    texture: 'ref'
};

export const validateExtends = (schema: IFieldSchema[], target: Record<string, unknown>): void => {
    for (const field of schema) {
        const val = target[field.name],
              valType = validationType[field.type];
        if (valType === 'number' && typeof val !== 'number') {
            target[field.name] = 0;
        } else if (valType === 'boolean' && typeof val !== 'boolean') {
            target[field.name] = false;
        } else if (valType === 'string' && typeof val !== 'string') {
            target[field.name] = '';
        } else if (valType === 'ref') {
            if (typeof val !== 'string' && val !== -1) {
                target[field.name] = -1;
            } else if (val !== -1 && !exists(field.type, val)) {
                target[field.name] = -1;
            }
        } else if (valType === 'vec2') {
            if (!Array.isArray(val) || (Array.isArray(val) && val.length !== 2)) {
                target[field.name] = [0, 0];
            }
        }
    }
};
