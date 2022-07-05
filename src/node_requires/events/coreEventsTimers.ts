const coreEvents = {} as Record<string, IEventDeclaration>;

for (let i = 1; i < 7; i++) {
    coreEvents[`core_Timer${i}`] = {
        name: `Timer ${i}`,
        applicable: ['template', 'room'],
        icon: 'clock',
        category: 'timers',
        codeTargets: ['thisOnCreate', 'thisOnStep'],
        inlineCodeTemplates: {
            thisOnCreate: `this.timer${i} = 0;`,
            thisOnStep: `
if (this.timer${i} > 0 && this.timer${i} <= (ct.delta / ct.speed)) {
    this.timer = 0;
    \n/*%%USER_CODE%%*/\n
} else {
    this.timer${i} -= ct.delta / ct.speed;
}`
        }
    };
}

export = coreEvents;
