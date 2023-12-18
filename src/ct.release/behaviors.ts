import {ExportedBehavior, ExportedBehaviorDynamic} from '../node_requires/exporter/_exporterContracts';

import {Room} from './rooms';
import type {BasicCopy} from './templates';

const behaviorsLib = {
    templates: [/*!@behaviorsTemplates@*/][0] as Record<string, ExportedBehavior>,
    rooms: [/*!@behaviorsRooms@*/][0] as Record<string, ExportedBehavior>,
    /**
     * Adds a behavior to the given room or template.
     * Only dynamic behaviors can be added.
     * (Static behaviors are marked with a frozen (❄️) sign in UI.)
     * @param target The room or template to which the behavior should be added.
     * @param behavior The name of the behavior to be added, as it was named in ct.IDE.
     */
    add(target: Room | BasicCopy, behavior: string): void {
        if (target.behaviors.includes(behavior)) {
            throw new Error(`[behaviors.add] Behavior ${behavior} already exists on ${target instanceof Room ? target.name : target.template}`);
        }
        const domain = target instanceof Room ? 'rooms' : 'templates';
        if (behaviorsLib[domain][behavior] === 'static') {
            throw new Error(`[behaviors.add] Behavior ${behavior} cannot be added to ${target instanceof Room ? target.name : target.template} because this behavior cannot be added dynamically.`);
        }
        if (!behaviorsLib[domain][behavior]) {
            throw new Error(`[behaviors.add] Behavior ${behavior} does not exist or cannot be applied to ${domain}.`);
        }
        target.behaviors.push(behavior);
    },
    /**
     * Removes a behavior from the given room or template.
     * Only dynamic behaviors can be removed.
     * (Static behaviors are marked with a frozen (❄️) sign in UI.)
     * @param target The room or template from which the behavior should be removed.
     * @param behavior The name of the behavior to be removed, as it was named in ct.IDE.
     */
    remove(target: Room | BasicCopy, behavior: string): void {
        if (!target.behaviors.includes(behavior)) {
            throw new Error(`[behaviors.remove] Behavior ${behavior} already exists on ${target instanceof Room ? target.name : target.template}`);
        }
        const domain = target instanceof Room ? 'rooms' : 'templates';
        if (behaviorsLib[domain][behavior] === 'static') {
            throw new Error(`[behaviors.remove] Behavior ${behavior} cannot be removed from ${target instanceof Room ? target.name : target.template} because this behavior cannot be removed dynamically.`);
        }
        if (!behaviorsLib[domain][behavior]) {
            throw new Error(`[behaviors.remove] Behavior ${behavior} does not exist or cannot be applied to ${domain}.`);
        }
        target.behaviors.splice(target.behaviors.indexOf(behavior), 1);
    },
    /**
     * Tells whether the specified object has a behavior applied to it.
     * @param target A room or a copy to test against.
     * @param behavior The behavior to look for.
     */
    has(target: Room | BasicCopy, behavior: string): boolean {
        return target.behaviors.includes(behavior);
    }
};

export const runBehaviors = (target: Room | BasicCopy, domain: 'rooms' | 'templates', kind: keyof ExportedBehaviorDynamic): void => {
    for (const bh of target.behaviors) {
        const fn = behaviorsLib[domain][bh];
        if (fn === 'static' || !fn) {
            throw new Error(`A ${target instanceof Room ? 'room' : 'copy'} with a name ${target instanceof Room ? target.name : target.template} tried to run a behavior named ${bh} that cannot be run dynamically.`);
        }
        fn[kind]?.apply(target);
    }
};

export default behaviorsLib;
