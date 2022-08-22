const coreEvents = {} as Record<string, IEventDeclaration>;

for (let i = 1; i < 7; i++) {
    coreEvents[`core_Timer${i}`] = {
        name: `Timer ${i}`,
        parameterizedName: `%%name%% (Timer ${i})`,
        applicable: ['template', 'room'],
        icon: 'clock',
        category: 'timers',
        codeTargets: ['thisOnStep'],
        inlineCodeTemplates: {
            thisOnStep: `
if (this.timer${i} > 0 && this.timer${i} <= ((/*%%isUi%%*/ ? ct.deltaUi : ct.delta) / ct.speed)) {
    this.timer${i} = 0;
    \n/*%%USER_CODE%%*/\n
} else {
    this.timer${i} -= (/*%%isUi%%*/ ? ct.deltaUi : ct.delta) / ct.speed;
}`
        },
        arguments: {
            name: {
                name: 'Name',
                type: 'string'
            },
            isUi: {
                name: 'UI event',
                type: 'boolean'
            }
        },
        repeatable: false
    };
}

export = coreEvents;
