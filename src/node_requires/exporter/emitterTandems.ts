import {ExporterError} from './ExporterError';

import {ExportedTandems} from './_exporterContracts';

import {getById} from '../resources/';


export const stringifyTandems = (input: ITandem[]): string => {
    const tandems: ExportedTandems = {};
    for (const tandem of input) {
        tandems[tandem.name] = tandem.emitters.map(emitter => {
            if (emitter.texture === -1) {
                const errorMessage = `The emitter tandem ${tandem.name} has an emitter without a texture, see Emitter ${emitter.uid.split('-').pop()}.`;
                const exporterError = new ExporterError(errorMessage, {
                    resourceId: tandem.uid,
                    resourceName: tandem.name,
                    resourceType: 'tandem',
                    clue: 'emptyEmitter'
                });
                throw exporterError;
            }
            return {
                ...emitter,
                texture: getById('texture', emitter.texture).name
            };
        });
    }
    return JSON.stringify(tandems, null, '    ');
};
