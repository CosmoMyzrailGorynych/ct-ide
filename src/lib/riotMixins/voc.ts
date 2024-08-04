import {getLanguageJSON, localizeField} from '../i18n';

const capitalize = (str: string): string => str.slice(0, 1).toUpperCase() + str.slice(1);

const voc = (riotTag: IRiotTag): void => {
    const updateLocales = () => {
        const languageJSON = getLanguageJSON();
        if (riotTag.namespace) {
            const way = riotTag.namespace.split(/(?<!\\)\./gi);
            for (let i = 0, l = way.length; i < l; i++) {
                way[i] = way[i].replace(/\\./g, '.');
            }
            let space = languageJSON;
            for (const partial of way) {
                space = space[partial];
            }
            riotTag.voc = space;
        }
        riotTag.vocGlob = languageJSON.common;
        riotTag.vocMeta = languageJSON.me;
        riotTag.vocFull = languageJSON;
        riotTag.capitalize = capitalize;
        riotTag.localizeField = localizeField;
    };
    updateLocales();
    window.signals.on('updateLocales', updateLocales);
    riotTag.on('unmount', () => {
        window.signals.off('updateLocales', updateLocales);
    });
};
export default {
    init(this: IRiotTag): void {
        voc(this);
    }
};
