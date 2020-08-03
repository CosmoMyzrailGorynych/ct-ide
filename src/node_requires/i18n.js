const fs = require('fs-extra');
const {extendValid} = require('./objectUtils');

const vocDefault = fs.readJSONSync('./data/i18n/English.json');
var i18n;

const loadLanguage = lang => {
    var voc;
    try {
        voc = fs.readJSONSync(`./data/i18n/${lang}.json`);
    } catch (e) {
        console.error(`An error occured while reading the language file ${lang}.json.`);
        throw e;
    }
    // eslint-disable-next-line no-console
    console.debug(`Loaded a language file ${lang}.json`);
    i18n.languageJSON = extendValid(vocDefault, voc);
    return i18n.languageJSON;
};

i18n = {
    loadLanguage
};


loadLanguage(localStorage.appLanguage || 'English');

module.exports = i18n;
