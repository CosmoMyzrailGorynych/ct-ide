/* eslint-disable camelcase */
const keyToMethod = {
    OnTextChange: 'onchange',
    OnTextInput: 'oninput'
} as Record<string, string>;

const coreEvents = {} as Record<string, IEventDeclaration>;

for (const key in keyToMethod) {
    const methodName = keyToMethod[key];
    coreEvents[`core_${key}`] = {
        name: key,
        applicable: ['template'],
        icon: 'textbox',
        category: 'input',
        codeTargets: ['thisOnCreate'],
        baseClasses: [
            'TextBox'
        ],
        inlineCodeTemplates: {
            thisOnCreate: `
this.${methodName} = (function (value) {
    \n/*%%USER_CODE%%*/\n
}).bind(this);`
        },
        arguments: {
            value: {
                name: 'Value',
                type: 'string'
            }
        }
    };
}

export = coreEvents;
