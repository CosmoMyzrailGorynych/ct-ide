import {getByPath} from '../../i18n';
import {assetTypes} from '..';

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

interface IFieldSchema {
    name: string,
    readableName: string,
    type: 'text' | 'textfield' | 'code' | '' | 'number' | 'sliderAndNumber' | 'point2D' | 'texture' | 'template' | 'sound' | 'room' | 'tandem' | '' | 'checkbox' | 'color',
    required: boolean
    array: boolean,
    fixedLength?: number
}

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
