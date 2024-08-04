/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from './neutralino-fs-extra';
import path from 'path';
import {extendValid} from './objectUtils';
import {isDev} from './platformUtils';

type vocLike = {
    me: {
        id: string,
        native: string,
        eng: string
    },
    [key: string]: Record<string, any>
};

let languageJSON: vocLike;
let vocDefault: vocLike;

export const getI18nDir = function (): string {
    if (isDev()) {
        return path.join(NL_CWD, 'src/i18n');
    }
    return path.join(NL_CWD, 'i18n');
};

type LanguageDescriptor = {
    filename: string;
    meta: {
        id: string,
        native: string,
        eng: string
    };
};

export const getLanguages = async (): Promise<LanguageDescriptor[]> => {
    const languageFiles = (await fs.readdir(getI18nDir()))
        .filter(filename => filename.endsWith('.json'))
        .filter(filename => filename !== 'Comments.json');
    const languageMetadata = await Promise.all(languageFiles.map(filename =>
        fs.readJSON(path.join(getI18nDir(), filename))));
    const results = [];
    for (let i = 0; i < languageMetadata.length; i++) {
        results.push({
            filename: languageFiles[i],
            meta: languageMetadata[i].me
        });
    }
    return results;
};

export const loadLanguage = async (lang: string): Promise<vocLike> => {
    var voc: vocLike;
    try {
        voc = await fs.readJSON(path.join(getI18nDir(), lang + '.json'));
    } catch (e) {
        console.error(`🌐 An error occured while reading the language file ${lang}.json.`);
        throw e;
    }
    // eslint-disable-next-line no-console
    console.debug(`🌐 Loaded a language file ${lang}.json`);
    languageJSON = extendValid(vocDefault, voc) as vocLike;
    languageJSON.common.assetTypes.tandems = languageJSON.common.assetTypes.emitterTandems;
    return languageJSON;
};

export const localizeField = (obj: Record<string, any>, field: string): string =>
    obj[`${field}_${languageJSON.me.id}`] || obj[field];
export const getLanguageJSON = (): Record<string, Record<string, any>> => languageJSON;

/**
 * Returns a translation for the given translation key written in a dot notation.
 * For example, the path can be "intro.newProject.button" and it will return "Create New"
 * in a current language.
 */
export const getByPath = (path: string): string | Record<string, any> => {
    const way = path.split(/(?<!\\)\./gi);
    for (let i = 0, l = way.length; i < l; i++) {
        way[i] = way[i].replace(/\\./g, '.');
    }
    let space: Record<string, any> = languageJSON;
    for (const partial of way) {
        space = space[partial];
    }
    return space;
};

export const initTranslations = async () => {
    vocDefault = await fs.readJSON(path.join(getI18nDir(), 'English.json'));
    await loadLanguage(localStorage.appLanguage || 'English');
};
