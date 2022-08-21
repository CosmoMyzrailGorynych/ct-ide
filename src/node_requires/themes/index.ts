import {join} from 'path';

const defaultTheme = 'Day';
const defaultMonacoTheme = defaultTheme;
const builtInThemes = [
    'Day',
    'SpringStream',
    'Ghost',
    'Forest',
    'Nord',
    'Horizon',
    'PooxelGreen',
    'PooxelBlue',
    'RosePineDawn',
    'RosePineMoon',
    'RosePine',
    'LucasDracula',
    'Night',
    'HCBlack'
];
interface ITheme {
    name: string;
    translated: string;
    monacoTheme: Record<string, unknown>;
    css: string;
}

// @see https://mmazzarolo.com/blog/2021-10-10-on-toggling-stylesheets/
const waitForStylesheet = (): Promise<void> => {
    const stylesheet = [...document.styleSheets].find(s => s.ownerNode === document.getElementById('themeCSS'));
    const oldHref = stylesheet?.href;
    return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            const stylesheet2 = [...document.styleSheets].find(s => s.ownerNode === document.getElementById('themeCSS'));
            if (stylesheet2 && (!oldHref || (stylesheet2.href && oldHref !== stylesheet2.href))) {
                clearInterval(interval);
                resolve();
            }
        }, 20);
    });
};

var currentSwatches: Record<string, string>;

const registeredThemes: ITheme[] = [];
localStorage.UItheme = localStorage.UItheme || 'Day';

const updateSwatches = (): void => {
    currentSwatches = {};
    var swatchTester = document.createElement('span');
    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=558165
    swatchTester.style.display = 'none';
    document.body.appendChild(swatchTester);
    swatchTester.innerText = 'sausage';
    for (const swatch of ['act', 'acttext', 'accent1', 'borderPale', 'borderBright', 'text', 'background', 'backgroundDeeper', 'act-contrast', 'acttext-contrast', 'accent1-contrast', 'red', 'green', 'orange']) {
        swatchTester.setAttribute('css-swatch', swatch);
        const style = window.getComputedStyle(swatchTester);
        currentSwatches[swatch] = style.getPropertyValue('color');
    }
    document.body.removeChild(swatchTester);
};

const mod = {
    registerTheme(name: string): ITheme {
        if (mod.getTheme(name)) {
            throw new Error(`A theme called ${name} is already registered.`);
        }
        let monacoTheme;
        try {
            monacoTheme = require(join('./data/node_requires/monaco-themes', `${name}.json`));
            (window as Window).monaco.editor.defineTheme(name, monacoTheme);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Could not load a monaco theme due to an error:', e, '\nFalling back to the default theme.');
            monacoTheme = require(join('./data/node_requires/monaco-themes', `${defaultMonacoTheme}.json`));
            (window as Window).monaco.editor.defineTheme(name, monacoTheme);
        }
        const css = `./data/theme${name}.css`;
        const theme = {
            name,
            get translated() {
                return (window as Window).languageJSON.mainMenu.settings.themes[name] || name;
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
    loadBuiltInThemes(): void {
        for (const themeName of builtInThemes) {
            if (mod.getTheme(themeName)) {
                continue;
            }
            mod.registerTheme(themeName);
        }
    },
    async switchToTheme(name: string): Promise<void> {
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
                const theWait = waitForStylesheet();
                link.href = theme.css;
                await theWait;
                updateSwatches();
            }
            (window as Window).monaco.editor.setTheme(theme.name);
            (window as Window).signals.trigger('UIThemeChanged', name);
            localStorage.UItheme = name;
        } catch (oO) {
            (window as Window).alertify.error(`Could not load theme ${name}. Rolling back to the default ${defaultTheme}.`);
            console.error(oO);
            await mod.switchToTheme(defaultTheme);
        }
    },
    /**
     * @async
     */
    loadTheme(): Promise<void> {
        return mod.switchToTheme(localStorage.UItheme);
    },
    getThemeList(): ITheme[] {
        return [...registeredThemes];
    },
    getSwatches(): Record<string, string> {
        if (!currentSwatches) {
            updateSwatches();
        }
        return {
            ...currentSwatches
        };
    },
    getPixiSwatch(color: string): number {
        if (!currentSwatches) {
            updateSwatches();
        }
        return PIXI.utils.rgb2hex(currentSwatches[color].split(', ').map(i => parseInt(i.replace(/[^0-9]/g, ''), 10) / 255));
    },
    getSwatch(color: string): string {
        if (!currentSwatches) {
            updateSwatches();
        }
        return currentSwatches[color];
    },
    updateSwatches
};

export = mod;
