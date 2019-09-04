const fs = require('fs-extra');
const {extend} = require('./objectUtils');

const vocDefault = fs.readJSONSync('./data/i18n/English.json');
var i18n;

const loadLanguage = lang => {
    const voc = fs.readJSONSync(`./data/i18n/${lang}.json`);
    // eslint-disable-next-line no-console
    console.debug(`Loaded a language file ${lang}.json`);
    i18n.languageJSON = extend({}, extend(vocDefault, voc));
    return i18n.languageJSON;
};

i18n = {
    loadLanguage
};


loadLanguage(localStorage.appLanguage || 'English');

module.exports = i18n;
