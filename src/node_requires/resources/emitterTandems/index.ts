const getThumbnail = function getThumbnail(): string {
    return 'sparkles';
};
const getById = function getById(id: string): ITandem {
    const tandem = (window as Window).currentProject.emitterTandems
        .find((t: ITandem) => t.uid === id);
    if (!tandem) {
        throw new Error(`Attempt to get a non-existent tandem with ID ${id}`);
    }
    return tandem;
};

const defaultEmitter = require('./defaultEmitter');

const createNewTandem = function createNewTandem(group?: assetRef): ITandem {
    const emitter = defaultEmitter.get();
    const generateGUID = require('./../../generateGUID');
    const id = generateGUID(),
          slice = id.slice(-6);

    const tandem = {
        name: 'Tandem_' + slice,
        uid: id,
        origname: 'pt' + slice,
        emitters: [emitter],
        group,
        lastmod: Number(new Date()),
        type: 'tandem'
    } as ITandem;

    return tandem;
};

export {
    getThumbnail,
    getById,
    defaultEmitter,
    createNewTandem
};
