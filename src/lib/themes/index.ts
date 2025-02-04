import * as PIXI from 'pixi.js';
import {getLanguageJSON} from '../i18n';
import {write} from '../neutralino-storage';

import type {editor} from 'monaco-editor';

import MonacoDay from '../monaco-themes/Day.json';
import MonacoSpringStream from '../monaco-themes/SpringStream.json';
import MonacoGhost from '../monaco-themes/Ghost.json';
import MonacoAlmaSakura from '../monaco-themes/AlmaSakura.json';
import MonacoForest from '../monaco-themes/Forest.json';
import MonacoGoldenEye from '../monaco-themes/GoldenEye.json';
import MonacoNord from '../monaco-themes/Nord.json';
import MonacoOneDarkPro from '../monaco-themes/OneDarkPro.json';
import MonacoHorizon from '../monaco-themes/Horizon.json';
import MonacoPooxelGreen from '../monaco-themes/PooxelGreen.json';
import MonacoPooxelBlue from '../monaco-themes/PooxelBlue.json';
import MonacoRosePineDawn from '../monaco-themes/RosePineDawn.json';
import MonacoRosePineMoon from '../monaco-themes/RosePineMoon.json';
import MonacoRosePine from '../monaco-themes/RosePine.json';
import MonacoLucasDracula from '../monaco-themes/LucasDracula.json';
import MonacoSynthwave from '../monaco-themes/Synthwave.json';
import MonacoNight from '../monaco-themes/Night.json';
import MonacoHCBlack from '../monaco-themes/HCBlack.json';

const defaultTheme = 'Day';
/**
 * The list of the built-in themes coupled with the list of accent colors
 * shown in the theme list.
 * Theme name — background color — accent colors
 */
const builtInThemes: [string, string[], editor.IStandaloneThemeData][] = [
    ['Day', ['#ffffff', '#5144db', '#446adb'], MonacoDay as editor.IStandaloneThemeData],
    ['SpringStream', ['#ffffff', '#00c09e'], MonacoSpringStream as editor.IStandaloneThemeData],
    ['Ghost', ['#fff1eb', '#70579c'], MonacoGhost as editor.IStandaloneThemeData],
    ['AlmaSakura', ['#372D2D', '#C4B0B3', '#DB5A6B'], MonacoAlmaSakura as editor.IStandaloneThemeData],
    ['Forest', ['#3c474d', '#a7c080'], MonacoForest as editor.IStandaloneThemeData],
    ['GoldenEye', ['#144000', '#ffd700'], MonacoGoldenEye as editor.IStandaloneThemeData],
    ['Nord', ['#3B4252', '#88C0D0'], MonacoNord as editor.IStandaloneThemeData],
    ['OneDarkPro', ['#282C34', '#D7DAE0'], MonacoOneDarkPro as editor.IStandaloneThemeData],
    ['Horizon', ['#1C1E26', '#E95378'], MonacoHorizon as editor.IStandaloneThemeData],
    ['PooxelGreen', ['#292929', '#00d059'], MonacoPooxelGreen as editor.IStandaloneThemeData],
    ['PooxelBlue', ['#292932', '#5db9ff'], MonacoPooxelBlue as editor.IStandaloneThemeData],
    ['RosePineDawn', ['#fffaf3', '#907aa9', '#d7827e'], MonacoRosePineDawn as editor.IStandaloneThemeData],
    ['RosePineMoon', ['#2a273f', '#c4a7e7', '#ea9a97'], MonacoRosePineMoon as editor.IStandaloneThemeData],
    ['RosePine', ['#1f1d2e', '#c4a7e7', '#ebbcba'], MonacoRosePine as editor.IStandaloneThemeData],
    ['LucasDracula', ['#161427', '#FFCFD4', '#FF70B1'], MonacoLucasDracula as editor.IStandaloneThemeData],
    ['Synthwave', ['#241B2F', '#FEDE5D', '#36F9F6', '#FF7EDB'], MonacoSynthwave as editor.IStandaloneThemeData],
    ['Night', ['#0c0d17', '#44dbb5'], MonacoNight as editor.IStandaloneThemeData],
    ['HCBlack', ['#080808', '#ffff00', '#00ffff'], MonacoHCBlack as editor.IStandaloneThemeData]
];
interface ITheme {
    name: string;
    swathes?: string[];
    translated: string;
    monacoTheme: editor.IStandaloneThemeData;
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
write('UItheme', localStorage.UItheme || 'Day');

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

export const getTheme = (name: string): ITheme | void =>
    registeredThemes.find(t => t.name === name);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerTheme = (
    name: string,
    swatches: string[],
    monacoTheme: editor.IStandaloneThemeData
): ITheme => {
    if (getTheme(name)) {
        throw new Error(`A theme called ${name} is already registered.`);
    }
    window.monaco.editor.defineTheme(name, monacoTheme);
    const css = `/data/theme${name}.css`;
    const theme = {
        name,
        get translated() {
            return getLanguageJSON().mainMenu.settings.themes[name] || name;
        },
        swatches,
        monacoTheme,
        css
    };
    registeredThemes.push(theme);
    return theme;
};

export const loadBuiltInThemes = (): void => {
    for (const theme of builtInThemes) {
        if (getTheme(theme[0])) {
            continue;
        }
        registerTheme(theme[0], theme[1], theme[2]);
    }
};

export const switchToTheme = async (name: string): Promise<void> => {
    try {
        const theme = getTheme(name);
        if (!theme) {
            throw new Error(`A theme called ${name} either does not exist or is not loaded.`);
        }
        const link = (document.getElementById('themeCSS') as HTMLLinkElement);
        // Avoid flickering on startup theme reloading
        if (link.href !== theme.css) {
            const theWait = waitForStylesheet();
            link.href = theme.css;
            await theWait;
            updateSwatches();
        }
        window.monaco.editor.setTheme(theme.name);
        window.signals.trigger('UIThemeChanged', name);
        write('UItheme', name);
    } catch (oO) {
        window.alertify.error(`Could not load theme ${name}. Rolling back to the default ${defaultTheme}.`);
        console.error(oO);
        await switchToTheme(defaultTheme);
    }
};

/**
 * @async
 */
export const loadTheme = (): Promise<void> => switchToTheme(localStorage.UItheme);

export const getThemeList = (): ITheme[] => [...registeredThemes];

export const getSwatches = (): Record<string, string> => {
    if (!currentSwatches) {
        updateSwatches();
    }
    return {
        ...currentSwatches
    };
};

export const getPixiSwatch = (color: string): number => {
    if (!currentSwatches) {
        updateSwatches();
    }
    return new PIXI.Color(currentSwatches[color]).toNumber();
};

export const getSwatch = (color: string): string => {
    if (!currentSwatches) {
        updateSwatches();
    }
    return currentSwatches[color];
};
