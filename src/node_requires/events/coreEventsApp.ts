/* eslint-disable camelcase */
const coreEvents = {
    core_OnAppBlur: {
        name: 'Blur',
        applicable: ['room'],
        icon: 'monitor',
        category: 'app',
        codeTargets: ['thisOnCreate', 'thisOnDestroy'],
        inlineCodeTemplates: {
            thisOnCreate: `
                this.onAppBlur = () => {
                    /*%%USER_CODE%%*/
                };
                window.addEventListener('blur', this.onAppBlur);`,
            thisOnDestroy: 'window.removeEventListener(\'blur\', this.onAppBlur);'
        }
    },
    core_OnAppFocus: {
        name: 'Focus',
        applicable: ['room'],
        icon: 'room',
        category: 'app',
        codeTargets: ['thisOnCreate', 'thisOnDestroy'],
        inlineCodeTemplates: {
            thisOnCreate: `
                this.onAppFocus = () => {
                    /*%%USER_CODE%%*/
                };
                window.addEventListener('focus', this.onAppFocus);`,
            thisOnDestroy: 'window.removeEventListener(\'focus\', this.onAppFocus);'
        }
    }
} as Record<string, IEventDeclaration>;

export = coreEvents;

