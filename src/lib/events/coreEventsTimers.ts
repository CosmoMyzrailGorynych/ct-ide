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
if (this.timer${i} > 0 && this.timer${i} <= (/*%%isUi%%*/ ? u.timeUi : u.time)) {
    this.timer${i} = 0;
    \n/*%%USER_CODE%%*/\n
} else {
    this.timer${i} -= /*%%isUi%%*/ ? u.timeUi : u.time;
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
