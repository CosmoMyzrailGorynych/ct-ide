import {getByPath} from '../../i18n';
import {assetTypes, exists, getById, getOfType} from '..';
import {getTypescriptEnumName} from '../enums';

const capitalize = (str: string): string => str.slice(0, 1).toUpperCase() + str.slice(1);

export const getFieldsExtends = (): IExtensionField[] => {
    const enums = getOfType('enum');
    const defaultFieldTypes = ['text', 'textfield', 'code', '', 'number', 'sliderAndNumber', '', ...assetTypes, '', 'checkbox', 'color'];
    if (getOfType('enum').length) {
        defaultFieldTypes.push('');
    }
    const fieldTypeOptions = defaultFieldTypes.map(type => ({
        // eslint-disable-next-line no-nested-ternary
        name: type === '' ?
            '' :
            (assetTypes.includes(type as resourceType) ?
                capitalize(getByPath(`common.assetTypes.${type}.0`) as string) :
                getByPath('common.fieldTypes.' + type)
            ),
        value: type
    }));
    fieldTypeOptions.push(...enums.map(enumAsset => ({
        name: enumAsset.name,
        value: `enum@${enumAsset.uid}`
    })));
    const options: IExtensionField[] = [{
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
            name: getByPath('common.required'),
            type: 'checkbox',
            key: 'required',
            default: false
        }, {
            name: getByPath('settings.content.fieldStructure'),
            type: 'select',
            key: 'structure',
            default: 'atomic',
            options: [{
                name: getByPath('settings.content.structureTypes.atomic'),
                value: 'atomic'
            }, {
                name: getByPath('settings.content.structureTypes.array'),
                value: 'array'
            }, {
                name: getByPath('settings.content.structureTypes.map'),
                value: 'map'
            }]
        }, {
            name: getByPath('settings.content.fieldType'),
            type: 'select',
            key: 'type',
            options: fieldTypeOptions,
            default: 'text'
        }, {
            name: getByPath('settings.content.mappedType'),
            type: 'select',
            key: 'mappedType',
            options: fieldTypeOptions,
            if: ['structure', 'map'],
            default: 'number'
        }, {
            name: getByPath('settings.content.fixedLength'),
            type: 'number',
            key: 'fixedLength',
            if: ['structure', 'array']
        }] as IExtensionField[]
    }];
    return options;
};

/** Returns an object for extensions-editor to display UI for configuring content types */
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
    sliderAndNumber: 'number',
    text: 'string',
    room: 'string',
    sound: 'string',
    tandem: 'string',
    template: 'string',
    texture: 'string',
    textfield: 'string',
    behavior: 'string',
    typeface: 'string',
    script: 'string',
    style: 'string',
    enum: 'string'
};

const getTsTypeFromFieldType = (ftype: IFieldSchema['type']): string => {
    if (!ftype.startsWith('enum@')) {
        return fieldTypeToTsType[ftype];
    }
    return getTypescriptEnumName(getById('enum', ftype.split('@')[1]));
};
const getTsFieldType = (field: IContentType['specification'][0]) => {
    if (field.structure === 'array') {
        return `${getTsTypeFromFieldType(field.type)}[]`;
    }
    if (field.structure === 'map') {
        return `Record<${getTsTypeFromFieldType(field.type)}, ${getTsTypeFromFieldType(field.mappedType!)}>`;
    }
    return getTsTypeFromFieldType(field.type);
};
const getTsType = (content: IContentType): string => {
    const fields = content.specification
        .map(f => `        /**${f.readableName || f.name}*/
        '${f.name}': ${getTsFieldType(f)};`)
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
        let fieldType: IExtensionField['type'] = spec.type || 'text';
        if (spec.structure === 'array') {
            fieldType = 'array';
        } else if (spec.structure === 'map') {
            fieldType = 'map';
        }
        const field: IExtensionField = {
            key: spec.name || spec.readableName,
            name: spec.readableName || spec.name,
            type: fieldType,
            required: spec.required
        };
        if (spec.structure === 'array') {
            field.arrayType = spec.type || ('text' as IExtensionField['type']);
            if (spec.fixedLength) {
                field.arrayLength = spec.fixedLength;
            }
            field.default = () => [] as unknown[];
        } else if (spec.structure === 'map') {
            field.mapKeyType = spec.type;
            field.mapValueType = spec.mappedType;
            field.default = () => ({} as Record<string | number, unknown>);
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


// Checks whether the passed value is a valid reference to an asset or a -1 (empty reference).
const validateRef = (val: unknown, assetType: resourceType): boolean => {
    if (val === -1) {
        return true;
    }
    if (typeof val !== 'string') {
        return false;
    }
    return exists(assetType, val);
};

type directlyValidated = Exclude<IFieldSchema['type'] | IExtensionField['type'], 'h1' | 'h2' | 'h3' | 'h4' | 'array' | 'group' | 'table' | 'map'>;

// For each field type, map it to a tuple of a validation function and a default value getter.
const validationTypeMap: Record<directlyValidated, [
    (val: unknown, field?: IExtensionField) => boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (field?: IExtensionField) => any]
> = {
    code: [val => typeof val === 'string', field => field?.default ?? ''],
    color: [val => typeof val === 'string' && val.startsWith('#'), field => field?.default ?? '#ffffff'],
    text: [val => typeof val === 'string', field => field?.default ?? ''],
    textfield: [val => typeof val === 'string', field => field?.default ?? ''],
    point2D: [val => Array.isArray(val) && val.length === 2 && val.every(elt => typeof elt === 'number'), () => [0, 0]],
    number: [val => typeof val === 'number', field => field?.default ?? 0],
    slider: [val => typeof val === 'number', field => field?.default ?? 0],
    sliderAndNumber: [val => typeof val === 'number', field => field?.default ?? 0],
    checkbox: [val => typeof val === 'boolean', field => field?.default ?? false],
    icon: [val => typeof val === 'string', field => field?.default ?? 'circle'],
    radio: [
        (val, field) => field?.options?.some?.(o => o.value === val) ?? (typeof val === 'string'),
        (field) => field?.default ?? field?.options?.[0].value
    ],
    select: [
        (val, field) => field?.options?.some?.(o => o.value === val) ?? (typeof val === 'string'),
        (field) => field?.default ?? field?.options?.[0].value
    ],
    behavior: [val => validateRef(val, 'behavior'), () => -1],
    typeface: [val => validateRef(val, 'typeface'), () => -1],
    room: [val => validateRef(val, 'room'), () => -1],
    script: [val => validateRef(val, 'script'), () => -1],
    sound: [val => validateRef(val, 'sound'), () => -1],
    style: [val => validateRef(val, 'style'), () => -1],
    tandem: [val => validateRef(val, 'tandem'), () => -1],
    template: [val => validateRef(val, 'template'), () => -1],
    texture: [val => validateRef(val, 'texture'), () => -1],
    enum: [val => validateRef(val, 'enum'), () => -1]
};

const enumValidatorTuple: [
    (val: unknown, enumAsset: IEnum) => boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (enumAsset: IEnum) => string
] = [
    (v, enumAsset) => enumAsset.values.includes(v as string),
    enumAsset => enumAsset.values[0]
];

const isValid = (value: any, fieldType: directlyValidated | `enum@${string}`): boolean => {
    if (fieldType.startsWith('enum@')) {
        const [, id] = fieldType.split('@');
        const enumAsset = getById('enum', id);
        return enumValidatorTuple[0](value, enumAsset);
    }
    const [validator] = validationTypeMap[fieldType as directlyValidated];
    return validator(value);
};
/**
 * Checks a primitive value against its type and resets it to its default value if it is invalid.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateValue = (obj: any[] | any, key: string | number, fieldType: directlyValidated | `enum@${string}`): void => {
    const val = obj[key];
    if (fieldType.startsWith('enum@')) {
        const [, id] = fieldType.split('@');
        const enumAsset = getById('enum', id);
        if (!enumValidatorTuple[0](val, enumAsset)) {
            obj[key] = enumValidatorTuple[1](enumAsset);
        }
    } else {
        // Get the validation function and the default value getter for this field type.
        const [validator, defaultValue] = validationTypeMap[fieldType as directlyValidated];
        if (!validator(val)) {
            obj[key] = defaultValue();
        }
    }
};

/**
 * Checks whether the target object has its values suiting the types of schema's fields
 * and resets values to default ones if they are invalid.
 */
export const validateContentEntries = (
    schema: IFieldSchema[],
    target: Record<string, unknown>
): void => {
    for (const field of schema) {
        let val = target[field.name];
        const ftype = field.type;
        if (field.structure === 'array') {
            if (!Array.isArray(val)) {
                val = target[field.name] = [];
            }
            const elts = val as unknown[];
            for (let i = 0; i < elts.length; i++) {
                validateValue(elts, i, ftype);
            }
        } else if (field.structure === 'map') {
            const map = val as Record<string | number, unknown>;
            for (const key in map) {
                // Remove invalid keys
                if (!isValid(key, field.type)) {
                    delete map[key];
                    continue;
                }
                validateValue(val, key, field.mappedType!);
            }
        } else {
            validateValue(target, field.name, ftype);
        }
    }
};
/**
 * Checks whether the target object has its values suiting the types of extension's fields
 * and resets values to default ones if they are invalid.
 */
export const validateExtends = (
    extensions: IExtensionField[],
    target: Record<string, unknown>
) => {
    for (const extension of extensions) {
        if (!extension.key) {
            continue;
        }
        if (extension.type === 'array') {
            if (!Array.isArray(target[extension.key])) {
                target[extension.key] = [];
            }
            for (let i = 0; i < (target[extension.key] as unknown[]).length; i++) {
                validateValue(target[extension.key], i, extension.arrayType! as directlyValidated);
            }
        } else if (extension.type === 'map') {
            if (typeof target[extension.key] !== 'object' || Array.isArray(target[extension.key])) {
                target[extension.key] = {};
            }
            const map = target[extension.key] as Record<string | number, unknown>;
            for (const key of Object.keys(map)) {
                // Remove invalid keys
                if (!isValid(key, extension.mapKeyType!)) {
                    delete map[key];
                    continue;
                }
                validateValue(map, key, extension.mapValueType!);
            }
        } else if (extension.type === 'group' && extension.items) {
            if (typeof target[extension.key] !== 'object' || Array.isArray(target[extension.key])) {
                target[extension.key] = {};
            }
            validateExtends(extension.items, target[extension.key] as Record<string, unknown>);
        } else if (extension.type === 'table' && extension.fields) {
            target[extension.key] = target[extension.key] || [];
            for (const row of target[extension.key] as Record<string, unknown>[]) {
                validateExtends(extension.fields, row);
            }
        } else {
            validateValue(target, extension.key, extension.type as directlyValidated);
        }
    }
};
