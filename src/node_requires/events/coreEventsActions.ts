/* eslint-disable camelcase */
const keyToActionProp = {
    OnActionPress: 'pressed',
    OnActionRelease: 'released',
    OnActionDown: 'down'
} as Record<string, string>;

const coreEvents = {} as Record<string, IEventDeclaration>;

for (const key in keyToActionProp) {
    const prop = keyToActionProp[key];
    coreEvents[`core_${key}`] = {
        name: key,
        parameterizedName: `${key} %%action%%`,
        applicable: ['template', 'room'],
        icon: 'airplay',
        category: 'actions',
        arguments: {
            action: {
                name: 'Action',
                type: 'action'
            }
        },
        repeatable: true,
        codeTargets: ['thisOnStep'],
        inlineCodeTemplates: {
            thisOnStep: `
if (actions[/*%%action%%*/].${prop}) {
    \n/*%%USER_CODE%%*/\n
}`
        }
    };
}

coreEvents.core_OnActionDown.locals = {
    value: {
        type: 'number',
        description: 'Current action\'s value'
    }
};
coreEvents.core_OnActionPress.locals = {
    value: {
        type: 'number',
        description: 'Current action\'s value'
    }
};
coreEvents.core_OnActionDown.inlineCodeTemplates.thisOnStep = `
if (actions[/*%%action%%*/].down) {
    let value = actions[/*%%action%%*/].value;
    \n/*%%USER_CODE%%*/\n
}`;
coreEvents.core_OnActionPress.inlineCodeTemplates.thisOnStep = `
if (actions[/*%%action%%*/].pressed) {
    let value = actions[/*%%action%%*/].value;
    \n/*%%USER_CODE%%*/\n
}`;

export = coreEvents;
