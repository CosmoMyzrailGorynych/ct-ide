const coffeescript = require('coffeescript');
const coffeescriptSettings = {
    bare: true,
    sourcemaps: false
};

import {uidMap} from '..';

export const convertCoffeeToJs = (): void => {
    const proj = window.currentProject;
    if (proj.language !== 'coffeescript') {
        throw new Error('Project is already not in CoffeeScript');
    }
    const changeset = [];
    try {
        for (const [, asset] of uidMap) {
            if (asset.type === 'template' || asset.type === 'room') {
                for (const event of (asset as IScriptable).events) {
                    changeset.push({
                        event,
                        code: coffeescript.compile(event.code, coffeescriptSettings)
                    });
                }
            }
        }
        proj.language = 'typescript';
        for (const change of changeset) {
            change.event.code = change.code;
        }
        window.alertify.success('Done! 👏');
    } catch (err) {
        window.alertify.error('Could not convert to JavaScript. Operation rollbacked, everything is fine, but you need to fix your scripts.');
        window.alertify.error(err.stack);
    }
};
