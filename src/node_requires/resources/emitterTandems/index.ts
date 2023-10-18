const getThumbnail = function getThumbnail(): string {
    return 'sparkles';
};

import * as defaultEmitter from './defaultEmitter';

const createNewTandem = (): ITandem => {
    const emitter = defaultEmitter.get();
    const generateGUID = require('./../../generateGUID');
    const id = generateGUID(),
          slice = id.slice(-6);

    const tandem = {
        name: 'Tandem_' + slice,
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
