const i18n = require('../i18n');

const categories: Record<string, IEventCategory> = {
    lifecycle: {
        name: 'Lifecycle',
        icon: 'rotate-cw'
    },
    actions: {
        name: 'Actions',
        icon: 'airplay'
    },
    pointer: {
        name: 'PointerEvents',
        icon: 'ui'
    },
    animation: {
        name: 'AnimatedSpriteEvents',
        icon: 'template'
    },
    timers: {
        name: 'Timers',
        icon: 'clock'
    },
    misc: {
        name: 'Miscellaneous',
        icon: 'grid'
    }
};

import * as coreEventsLifecycle from './coreEventsLifecycle';
import * as coreEventsActions from './coreEventsActions';
import * as coreEventsAnimation from './coreEventsAnimation';
import * as coreEventsPointer from './coreEventsPointer';
import * as coreEventsTimers from './coreEventsTimers';

const events: Record<string, IEventDeclaration> = {
    // Basic, primitive events, aka lifecycle events
    ...coreEventsLifecycle,
    ...coreEventsActions,
    ...coreEventsPointer,
    ...coreEventsAnimation,
    ...coreEventsTimers
};

const eventNameRegex = /^(\S+?)_(\S+)$/;
/**
 * Returns the library and the event code from the full event key
 */
const splitEventName = (name: string): [string, string] => {
    const result = eventNameRegex.exec(name);
    return [result[1], result[2]];
};

type EventMenuEventData = {
    eventKey: string,
    event: IEventDeclaration
}
interface IEventMenuEvent extends IMenuItem {
    affixedData: EventMenuEventData
}

interface IEventMenuSubmenu extends IMenuItem {
    affixedData: {
        key: string;
        category: IEventCategory;
        core: boolean;
    }
    submenu: {
        items: IEventMenuEvent[];
    }
}
type EventMenu = {
    items: IEventMenuSubmenu[];
};

const localizeCategoryName = (categoryKey: string): string => {
    const i18nScriptables = i18n.languageJSON.scriptables;
    const category = categories[categoryKey];
    if (i18nScriptables.coreEventsCategories[categoryKey]) {
        return i18nScriptables.coreEventsCategories[categoryKey];
    }
    return i18n.localizeField(category, 'name');
};
const timerPattern = /^Timer(\d)$/;
const propToCoreDictionary = {
    category: 'coreEventsCategories',
    name: 'coreEvents',
    hint: 'coreEventsDescriptions'
} as Record<string, string>;
const localizeProp = (eventFullCode: string, prop: string): string => {
    const [lib, eventCode] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    if (lib === 'core') {
        if (timerPattern.test(eventCode)) {
            return i18n.languageJSON.scriptables[propToCoreDictionary[prop]].Timer.replace('$1', timerPattern.exec(eventCode)[1]);
        }
        return i18n.languageJSON.scriptables[propToCoreDictionary[prop]][eventCode];
    }
    return i18n.localizeField(event, prop);
};

const resourcesAPI = require('./../resources');
const getAssetName = (assetId: string, assetType: resourceType) => {
    if (resourcesAPI[assetType + 's'].getName) {
        return resourcesAPI[assetType + 's'].getName(assetId);
    }
    return resourcesAPI[assetType + 's'].getById(assetId).name;
};
const getAssetThumbnail = (assetId: string, assetType: resourceType): string | false => {
    if (resourcesAPI[assetType + 's'].getThumbnail) {
        return resourcesAPI[assetType + 's'].getThumbnail(assetId, false, false);
    }
    return false;
};
const localizeParametrized = (eventFullCode: string, scriptedEvent: IScriptableEvent): string => {
    const [lib, eventCode] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    let {name} = event;
    if (lib === 'core') {
        name = i18n.languageJSON.scriptables.coreParameterizedNames[eventCode];
    } else {
        name = i18n.localizeField(event, 'parameterizedName');
    }
    for (const argName in event.arguments) {
        let value = String(scriptedEvent.arguments[argName]);
        if (['template', 'room', 'sound', 'tandem', 'font', 'style', 'texture'].indexOf(event.arguments[argName].type) !== -1) {
            value = getAssetName(value, event.arguments[argName].type as resourceType);
        }
        const regex = new RegExp(`%%${argName}%%`);
        name = name.replace(regex, value ?? '???');
    }
    return name;
};
const localizeArgument = (eventFullCode: string, arg: string): string => {
    const [lib] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    if (lib === 'core') {
        return i18n.languageJSON.scriptables.coreEventsArguments[arg];
    }
    return i18n.localizeField(event.arguments[arg], 'name');
};
const localizeLocalVarDesc = (eventFullCode: string, local: string): string => {
    const [lib, eventCode] = splitEventName(eventFullCode);
    const event = events[eventFullCode];
    if (lib === 'core') {
        return i18n.languageJSON.scriptables.coreEventsLocals[`${eventCode}_${local}`];
    }
    return i18n.localizeField(event.locals[local], 'description');
};
const tryGetIcon = (eventFullCode: string, scriptedEvent: IScriptableEvent): string | false => {
    const event = events[eventFullCode];
    if (!event.useAssetThumbnail) {
        return false;
    }
    for (const argName in event.arguments) {
        if (['template', 'room', 'texture'].indexOf(event.arguments[argName].type) !== -1) {
            const value = String(scriptedEvent.arguments[argName]);
            return getAssetThumbnail(value, event.arguments[argName].type as resourceType);
        }
    }
    return false;
};

const bakeCategories = function bakeCategories(
    entity: EventApplicableEntities,
    callback: (affixedData: IEventDeclaration) => void
): EventMenu {
    const menu = {
        items: [] as IEventMenuSubmenu[]
    };
    // Add categories
    for (const categoryKey in categories) {
        menu.items.push({
            label: localizeCategoryName(categoryKey),
            affixedData: {
                key: categoryKey,
                category: categories[categoryKey],
                core: true
            },
            icon: categories[categoryKey].icon,
            submenu: {
                items: [] as IEventMenuEvent[]
            }
        });
    }
    const miscCategory = menu.items.find(s => s.affixedData.core && s.affixedData.key === 'misc');
    for (const eventKey in events) {
        const event = events[eventKey];
        // Filter out events for other entities
        if (!event.applicable.includes(entity)) {
            continue;
        }
        // Find if there is already a category for this event.
        let category = menu.items.find(section => section.affixedData.key === event.category);
        if (!category) {
            // Fallback to the "misc" category
            category = miscCategory;
        }
        // Add an event to a category
        category.submenu.items.push({
            label: localizeProp(eventKey, 'name') || event.name,
            hint: localizeProp(eventKey, 'hint') || event.hint,
            affixedData: {
                eventKey,
                event
            },
            icon: event.icon,
            click: callback
        });
    }
    // Reorder categories so that Misc is in the end of the list
    menu.items.splice(menu.items.indexOf(miscCategory), 1);
    menu.items.push(miscCategory);
    // Remove empty categories
    menu.items = menu.items.filter(cat => cat.submenu.items.length);
    return menu;
};

const getEventByLib = (event: string, libName: string): IEventDeclaration =>
    events[`${libName}_${event}`];

const getArgumentsTypeScript = (event: IEventDeclaration): string => {
    let code = '';
    if (event.locals) {
        for (const key in event.locals) {
            const local = event.locals[key];
            code += `var ${key}: ${local.type};`;
        }
    }
    return code;
};


const importEventsFromCatmod = (manifest: ICatmodManifest, catmodName: string): void => {
    if (manifest.events) {
        for (const eventName in manifest.events) {
            const event = manifest.events[eventName];
            const fullEventName = `${catmodName}_${eventName}`;
            events[fullEventName] = event;
        }
    }
    if (manifest.eventCategories) {
        for (const categoryName in manifest.eventCategories) {
            const eventCategory = manifest.eventCategories[categoryName];
            // Do not overwrite existing categories
            if (!(categoryName in categories)) {
                categories[categoryName] = eventCategory;
            }
        }
    }
};
import {loadModuleByName} from './../resources/modules';
const loadAllModulesEvents = async (): Promise<void> => {
    const promises = [];
    for (const libName in window.currentProject.libs) {
        promises.push(loadModuleByName(libName).then(catmod => {
            importEventsFromCatmod(catmod, libName);
        }));
    }
    await Promise.all(promises);
};
const unloadEventsFromModule = (moduleName: string): void => {
    for (const eventKey in events) {
        const [lib] = splitEventName(eventKey);
        if (lib === moduleName) {
            delete events[eventKey];
        }
    }
    // Don't quite need to remove categories;
    // empty ones will be filtered out every time an event menu is requested.
};
const unloadAllEvents = (): void => {
    for (const eventKey in events) {
        const [lib] = splitEventName(eventKey);
        if (lib !== 'core') {
            delete events[eventKey];
        }
    }
};

export {
    categories,
    events,
    bakeCategories,
    getEventByLib,
    splitEventName,
    getArgumentsTypeScript,
    localizeCategoryName,
    localizeParametrized,
    localizeProp,
    localizeArgument,
    localizeLocalVarDesc,
    tryGetIcon,
    importEventsFromCatmod,
    unloadEventsFromModule,
    unloadAllEvents,
    loadAllModulesEvents
};
