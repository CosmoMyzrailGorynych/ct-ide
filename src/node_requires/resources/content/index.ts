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
    typeface: 'string',
    script: 'string',
    style: 'string',
    icon: 'string'
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

type directlyValidated = Exclude<IFieldSchema['type'] | IExtensionField['type'], 'h1' | 'h2' | 'h3' | 'h4' | 'array' | 'group' | 'table'>;

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
    texture: [val => validateRef(val, 'texture'), () => -1]
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

        // Get the validation function and the default value getter for this field type.
        const [validator, defaultValue] = validationTypeMap[ftype];

        if (field.array) {
            if (!Array.isArray(val)) {
                target[field.name] = [];
                val = target[field.name];
            }
            const elts = val as unknown[];
            target[field.name] = elts
                .map(v => (validator(v) ? v : defaultValue()));
        } else if (!validator(val)) {
            target[field.name] = defaultValue();
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
            target[extension.key] = target[extension.key] || [];
            const [validator, defaultValue] = validationTypeMap[(extension.arrayType ?? 'text') as directlyValidated];
            target[extension.key] = (target[extension.key] as unknown[])
                .map(elt => (validator(elt, extension) ? elt : defaultValue(extension)));
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
            const [validator, defaultValue] =
                validationTypeMap[extension.type as directlyValidated];
            target[extension.key] = validator(target[extension.key], extension) ?
                target[extension.key] :
                defaultValue(extension);
        }
    }
};
