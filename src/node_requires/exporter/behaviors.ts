import {getBaseScripts} from './scriptableProcessor';
import {getById} from '../resources';

/**
 * Creates a shallow copy of the specified asset, augmenting its events list with static events
 * of the linked behaviors.
 */
export const embedStaticBehaviors = <T extends IScriptableBehaviors>(
    asset: T,
    project: IProject
): T => {
    if (!asset.behaviors.length) {
        return asset;
    }
    const behaviors = asset.behaviors
        .map(bh => getById('behavior', bh))
        .filter(bh => {
            const scripts = getBaseScripts(bh, project);
            return !Object.keys(scripts).some(key => key.startsWith('rootRoom'));
        });
    return {
        ...asset,
        events: asset.events
            .concat(...behaviors
                .map(bh => bh.events))
    };
};

export const getBehaviorsList = (asset: IScriptableBehaviors): string[] =>
    asset.behaviors.map(bh => getById('behavior', bh).name);

type behaviorsExport = {
    templates: string,
    rooms: string
};
export const stringifyBehaviors = (behaviors: IBehavior[], project: IProject): behaviorsExport => {
    const stitcher = (bhs: IBehavior[]) => '{' + bhs.map(behavior => {
        const scripts = getBaseScripts(behavior, project);
        const isStatic = (Object.keys(scripts) as EventCodeTargets[])
            .some(key => key.startsWith('rootRoom') && scripts[key]);
        if (isStatic) {
            return `'${behavior.name}': 'static'`;
        }
        return `'${behavior.name}': {
            ${(Object.keys(scripts) as EventCodeTargets[])
                .filter(key => scripts[key]).map(key => `'${key}': function () {
            ${scripts[key as EventCodeTargets]}
            }`)
            .join(',\n')}
        }`;
    }).join(',\n') + '}';

    const templatesBh = behaviors.filter(bh => bh.behaviorType === 'template');
    const roomsBh = behaviors.filter(bh => bh.behaviorType === 'room');

    return {
        templates: stitcher(templatesBh),
        rooms: stitcher(roomsBh)
    };
};
