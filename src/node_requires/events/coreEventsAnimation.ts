/* eslint-disable camelcase */
const keyToMethod = {
    OnAnimationLoop: 'onLoop',
    OnAnimationComplete: 'onComplete',
    OnFrameChange: 'onFrameChange'
} as Record<string, string>;

const coreEvents = {} as Record<string, IEventDeclaration>;

for (const key in keyToMethod) {
    const methodName = keyToMethod[key];
    coreEvents[`core_${key}`] = {
        name: key,
        applicable: ['template'],
        icon: 'template',
        category: 'animation',
        codeTargets: ['thisOnCreate'],
        baseClasses: [
            'AnimatedSprite'
        ],
        inlineCodeTemplates: {
            thisOnCreate: `
this.${methodName} = (function () {
    \n/*%%USER_CODE%%*/\n
}).bind(this);`
        }
    };
}

export = coreEvents;
