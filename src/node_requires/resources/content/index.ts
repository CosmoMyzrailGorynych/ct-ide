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
