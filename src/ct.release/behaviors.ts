import {ExportedBehavior, ExportedBehaviorDynamic} from '../lib/exporter/_exporterContracts';

import {Room} from './rooms';
import type {BasicCopy} from './templates';

const behaviorsLib = {
    /**
     * @catnipIgnore
     */
    templates: [/*!@behaviorsTemplates@*/][0] as Record<string, ExportedBehavior>,
    /**
     * @catnipIgnore
     */
    rooms: [/*!@behaviorsRooms@*/][0] as Record<string, ExportedBehavior>,
    /**
     * Adds a behavior to the given room or template.
     * Only dynamic behaviors can be added.
     * (Static behaviors are marked with a frozen (❄️) sign in UI.)
     * @param target The room or template to which the behavior should be added.
     * @param behavior The name of the behavior to be added, as it was named in ct.IDE.
     * @catnipAsset behavior:behavior
     */
    add(target: Room | BasicCopy, behavior: string): void {
        if (target.behaviors.includes(behavior)) {
            throw new Error(`[behaviors.add] Behavior ${behavior} already exists on ${target instanceof Room ? target.name : target.template}`);
        }
        const domain = target instanceof Room ? 'rooms' : 'templates';
        const bh = behaviorsLib[domain][behavior];
        if (bh === 'static') {
            throw new Error(`[behaviors.add] Behavior ${behavior} cannot be added to ${target instanceof Room ? target.name : target.template} because this behavior cannot be added dynamically.`);
        }
        if (!bh) {
            throw new Error(`[behaviors.add] Behavior ${behavior} does not exist or cannot be applied to ${domain}.`);
        }
        target.behaviors.push(behavior);
        if (bh.thisOnAdded) {
            bh.thisOnAdded.apply(target);
        }
    },
    /**
     * Removes a behavior from the given room or template.
     * Only dynamic behaviors can be removed.
     * (Static behaviors are marked with a frozen (❄️) sign in UI.)
     * @param target The room or template from which the behavior should be removed.
     * @param behavior The name of the behavior to be removed, as it was named in ct.IDE.
     * @catnipAsset behavior:behavior
     */
    remove(target: Room | BasicCopy, behavior: string): void {
        if (!target.behaviors.includes(behavior)) {
            throw new Error(`[behaviors.remove] Behavior ${behavior} already exists on ${target instanceof Room ? target.name : target.template}`);
        }
        const domain = target instanceof Room ? 'rooms' : 'templates';
        const bh = behaviorsLib[domain][behavior];
        if (bh === 'static') {
            throw new Error(`[behaviors.remove] Behavior ${behavior} cannot be removed from ${target instanceof Room ? target.name : target.template} because this behavior cannot be removed dynamically.`);
        }
        if (!bh) {
            throw new Error(`[behaviors.remove] Behavior ${behavior} does not exist or cannot be applied to ${domain}.`);
        }
        if (bh.thisOnRemoved) {
            bh.thisOnRemoved.apply(target);
        }
        target.behaviors.splice(target.behaviors.indexOf(behavior), 1);
    },
    /**
     * Tells whether the specified object has a behavior applied to it.
     * @param target A room or a copy to test against.
     * @param behavior The behavior to look for.
     * @catnipAsset behavior:behavior
     */
    has(target: Room | BasicCopy, behavior: string): boolean {
        return target.behaviors.includes(behavior);
    }
};

/**
 * @catnipIgnore
 */
export const runBehaviors = (target: Room | BasicCopy, domain: 'rooms' | 'templates', kind: keyof ExportedBehaviorDynamic): void => {
    for (const bh of target.behaviors) {
        const fn = behaviorsLib[domain][bh];
        if (fn === 'static' || !fn) {
            continue;
        }
        fn[kind]?.apply(target);
    }
};

export default behaviorsLib;
