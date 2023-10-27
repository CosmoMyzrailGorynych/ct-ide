import {getByPath} from '../../i18n';

export const getFieldsExtends = () => [{
    name: getByPath('settings.content.typeSpecification'),
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
        options: ['text', 'textfield', 'code', '', 'number', 'sliderAndNumber', 'point2D', '', 'texture', 'template', 'sound', 'room', 'tandem', '', 'checkbox', 'color'].map(type => ({
            name: type === '' ? '' : getByPath('common.fieldTypes.' + type),
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
    }]
}];

export const getExtends = () => [{
    name: getByPath('settings.content.typeName'),
    type: 'text',
    key: 'name',
    help: getByPath('settings.content.typeNameHint'),
    required: true
}, {
    name: getByPath('settings.content.typeReadableName'),
    type: 'text',
    key: 'readableName',
    help: getByPath('settings.content.typeReadableNameHint')
}, {
    name: getByPath('settings.content.icon'),
    type: 'icon',
    key: 'icon',
    default: 'copy'
}, ...getFieldsExtends()];

interface IFieldSchema {
    name: string,
    readableName: string,
    type: 'text' | 'textfield' | 'code' | '' | 'number' | 'sliderAndNumber' | 'point2D' | 'texture' | 'template' | 'sound' | 'room' | 'tandem' | '' | 'checkbox' | 'color',
    required: boolean
    array: boolean
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
            field.default = () => [] as any[];
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
