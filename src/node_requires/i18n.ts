import fs from 'fs-extra';
const path = require('path');
const {extendValid} = require('./objectUtils');

let languageJSON: Record<string, Record<string, any>>;

const vocDefault = fs.readJSONSync('./data/i18n/English.json');

export const getI18nDir = function () {
    return './data/i18n/';
};

export const getLanguages = async () => {
    const languageFiles = await fs.readdir(getI18nDir())
    .then(files => files
            .filter(filename => path.extname(filename) === '.json')
            .filter(filename => filename !== 'Comments.json'));
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

export const loadLanguage = (lang: string) => {
    var voc;
    try {
        voc = fs.readJSONSync(`./data/i18n/${lang}.json`);
    } catch (e) {
        console.error(`An error occured while reading the language file ${lang}.json.`);
        throw e;
    }
    // eslint-disable-next-line no-console
    console.debug(`Loaded a language file ${lang}.json`);
    languageJSON = extendValid(vocDefault, voc);
    languageJSON.common.assetTypes.tandems = languageJSON.common.assetTypes.emitterTandems;
    return languageJSON;
};

export const localizeField = (obj: any, field: string) => obj[`${field}_${languageJSON.me.id}`] || obj[field];
export const getLanguageJSON = () => languageJSON;

loadLanguage(localStorage.appLanguage || 'English');
