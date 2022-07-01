/* eslint-disable camelcase */
const coreEvents = {
    // Basic, primitive events, aka lifecycle events
    core_OnCreate: {
        name: 'On create',
        applicable: ['template'],
        icon: 'sun',
        category: 'lifecycle',
        codeTargets: ['thisOnCreate'],
        inlineCodeTemplates: {
            thisOnCreate: '{\n/*%%USER_CODE%%*/\n}'
        }
    },
    core_OnRoomStart: {
        name: 'On room start',
        applicable: ['room'],
        icon: 'sun',
        category: 'lifecycle',
        codeTargets: ['thisOnCreate'],
        inlineCodeTemplates: {
            thisOnCreate: '{\n/*%%USER_CODE%%*/\n}'
        }
    },
    core_OnStep: {
        name: 'On frame start',
        applicable: ['template', 'room'],
        icon: 'skip-back',
        category: 'lifecycle',
        codeTargets: ['thisOnStep'],
        inlineCodeTemplates: {
            thisOnStep: '{\n/*%%USER_CODE%%*/\n}'
        }
    },
    core_OnDraw: {
        name: 'On frame end',
        applicable: ['template', 'room'],
        icon: 'skip-forward',
        category: 'lifecycle',
        codeTargets: ['thisOnDraw'],
        inlineCodeTemplates: {
            thisOnDraw: '{\n/*%%USER_CODE%%*/\n}'
        }
    },
    core_OnDestroy: {
        name: 'On destroy',
        applicable: ['template'],
        icon: 'trash',
        category: 'lifecycle',
        codeTargets: ['thisOnDestroy'],
        inlineCodeTemplates: {
            thisOnDestroy: '{\n/*%%USER_CODE%%*/\n}'
        }
    },
    core_OnRoomEnd: {
        name: 'On room end',
        applicable: ['room'],
        icon: 'trash',
        category: 'lifecycle',
        codeTargets: ['thisOnDestroy'],
        inlineCodeTemplates: {
            thisOnDestroy: '{\n/*%%USER_CODE%%*/\n}'
        }
    }
} as Record<string, IEventDeclaration>;

export = coreEvents;

