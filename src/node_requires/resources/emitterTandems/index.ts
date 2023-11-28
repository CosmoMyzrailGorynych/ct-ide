import {promptName} from '../promptName';

const getThumbnail = function getThumbnail(): string {
    return 'sparkles';
};

import * as defaultEmitter from './defaultEmitter';

const createNewTandem = async (): Promise<ITandem> => {
    const name = await promptName('tandem', 'New Emitter Tandem');
    if (!name) {
        // eslint-disable-next-line no-throw-literal
        throw 'cancelled';
    }

    const emitter = defaultEmitter.get();
    const generateGUID = require('./../../generateGUID');
    const id = generateGUID(),
          slice = id.slice(-6);

    const tandem = {
        name,
        uid: id,
        origname: 'pt' + slice,
        emitters: [emitter],
        lastmod: Number(new Date()),
        type: 'tandem'
    } as ITandem;

    return tandem;
};

export const areThumbnailsIcons = true;

export {
    getThumbnail,
    defaultEmitter,
    createNewTandem as createAsset
};
