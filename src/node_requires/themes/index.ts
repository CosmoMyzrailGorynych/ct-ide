const path = require('path');

const defaultTheme = 'Day';
const builtInThemes = [
    'Day',
    'SpringStream',
    'Forest',
    'Horizon',
    'LucasDracula',
    'Night',
    'HCBlack'
];
interface ITheme {
    name: string;
    translated: string;
    monacoTheme: object;
    css: string;
}

const registeredThemes: ITheme[] = [];
localStorage.UItheme = localStorage.UItheme || 'Day';

const mod = {
    registerTheme(name: string): ITheme {
        if (mod.getTheme(name)) {
            throw new Error(`A theme called ${name} is already registered.`);
        }
        const monacoTheme = require(path.join('./data/node_requires/monaco-themes', `${name}.json`));
        (window as any).monaco.editor.defineTheme(name, monacoTheme);
        const css = `./data/theme${name}.css`;
        const theme = {
            name,
            get translated() {
                return (window as any).languageJSON.menu[`theme${name}`] || name;
            },
            monacoTheme,
            css
        };
        registeredThemes.push(theme);
        return theme;
    },
    getTheme(name: string): ITheme | void {
        return registeredThemes.find(t => t.name === name);
    },
    loadBuiltInThemes() {
        for (const themeName of builtInThemes) {
            if (mod.getTheme(themeName)) {
                continue;
            }
            mod.registerTheme(themeName);
        }
    },
    async switchToTheme(name: string) {
        const fs = require('fs-extra');
        try {
            const theme = mod.getTheme(name);
            if (!theme) {
                throw new Error(`A theme called ${name} either does not exist or is not loaded.`);
            }
            await fs.lstat(theme.css);
            const link = (document.getElementById('themeCSS') as HTMLLinkElement);
            // Avoid flickering on startup theme reloading
            if (link.href !== theme.css) {
                link.href = theme.css;
            }
            (window as any).monaco.editor.setTheme(theme.name);
            (window as any).signals.trigger('UIThemeChanged', name);
            localStorage.UItheme = name;
        } catch (o_O) {
            (window as any).alertify.error(`Could not load theme ${name}. Rolling back to the default ${defaultTheme}.`);
            await mod.switchToTheme(defaultTheme);
        }
    },
    /**
     * @async
     */
    loadTheme() {
        return mod.switchToTheme(localStorage.UItheme);
    },
    getThemeList(): ITheme[] {
        return [...registeredThemes];
    }
};

module.exports = mod;
