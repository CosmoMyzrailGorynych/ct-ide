type ScriptableCode = Record<EventCodeTargets, string>;

import {ExporterError, highlightProblem} from './ExporterError';
const {getEventByLib} = require('../events');
import {readFile} from 'fs-extra';
import {getModulePathByName, loadModuleByName} from './../resources/modules';
import {join} from 'path';
const coffeeScript = require('coffeescript');
const typeScript = require('sucrase').transform;

const coffeeScriptOptions = {
    sourceMap: false,
    bare: true,
    header: false
};

const eventsCache: Record<string, string> = {};
const resetEventsCache = (): void => {
    for (const key in eventsCache) {
        delete eventsCache[key];
    }
};
const getEventCacheName = (lib: string, eventCode: string, target: string) =>
    `${lib};${eventCode};${target}`;
const populateEventCache = async (project: IProject): Promise<Record<string, string>> => {
    const modulesPromises = [];
    const libs = Object.keys(project.libs);
    for (const libCode in project.libs) {
        modulesPromises.push(loadModuleByName(libCode));
    }
    const modulesManifests = await Promise.all(modulesPromises);
    const eventLoadPromises = [];
    for (let i = 0; i < libs.length; i++) {
        const libCode = libs[i];
        const modulesManifest = modulesManifests[i];
        if (modulesManifest.events) {
            for (const eventCode in modulesManifest.events) {
                const event = modulesManifest.events[eventCode];
                for (const eventTarget of event.codeTargets) {
                    const cacheName = getEventCacheName(libCode, eventCode, eventTarget);
                    // eslint-disable-next-line max-depth
                    if (event.inlineCodeTemplates && (eventTarget in event.inlineCodeTemplates)) {
                        eventsCache[cacheName] = event.inlineCodeTemplates[eventTarget];
                    } else {
                        eventLoadPromises.push(readFile(join(
                            getModulePathByName(libCode),
                            'events',
                            `${eventCode}_${eventTarget}.js`
                        ), {
                            encoding: 'utf8'
                        })
                        .then(content => {
                            eventsCache[cacheName] = content;
                        })
                        .catch(e => {
                            throw new Error(`Failed to load the template for eventTarget ${cacheName}: it was neither inlined nor was accessible in the filesystem. It is usually a modder's error. Filesystem error: ${e}`);
                        }));
                    }
                }
            }
        }
    }
    await Promise.all(eventLoadPromises);
    return eventsCache;
};
const getFromCache = (event: IScriptableEvent, target: string): string => {
    const cacheName = getEventCacheName(event.lib, event.eventKey, target);
    return eventsCache[cacheName];
};

const resourcesAPI = require('./../resources');
const getAssetName = (assetId: string, assetType: resourceType) => {
    if (resourcesAPI[assetType + 's'].getName) {
        return resourcesAPI[assetType + 's'].getName(assetId);
    }
    return resourcesAPI[assetType + 's'].getById(assetId).name;
};

// eslint-disable-next-line max-lines-per-function
const getBaseScripts = function (entity: IScriptable, project: IProject): ScriptableCode {
    const domains = {
        thisOnStep: '',
        thisOnCreate: '',
        thisOnDraw: '',
        thisOnDestroy: '',
        rootRoomOnCreate: '',
        rootRoomOnStep: '',
        rootRoomOnDraw: '',
        rootRoomOnLeave: ''
    };
    for (const event of entity.events) {
        const {lib, eventKey} = event;
        let {code} = event;
        try { // Apply converters to the user's code first
            if (project.language === 'coffeescript') {
                code = coffeeScript.compile(code, coffeeScriptOptions);
            } else if (project.language === 'typescript') {
                if (code.trim()) {
                    ({code} = typeScript(code, {
                        transforms: ['typescript']
                    }));
                } else {
                    code = '';
                }
            }
        } catch (e) {
            const errorMessage = `${e.name || 'An error'} occured while compiling ${eventKey} (${lib}) event of ${entity.name} ${entity.type}`;
            const exporterError = new ExporterError(errorMessage, {
                resourceId: entity.uid,
                resourceName: entity.name,
                resourceType: entity.type,
                eventKey,
                problematicCode: highlightProblem(e.code || code, e.location || e.loc),
                clue: 'syntax'
            }, e);
            throw exporterError;
        }
        const eventArgs = event.arguments;
        const eventSpec = getEventByLib(eventKey, lib) as IEventDeclaration;
        const requiredArgs = eventSpec.arguments || {};
        for (const target of eventSpec.codeTargets) {
            let resultingCode: string;
            // Add a preamble to each event for easier debugging by users
            resultingCode = `/* ${entity.type} ${entity.name} — ${event.lib}_${event.eventKey} (${eventSpec.name} event) */\n`;
            if (lib === 'core') {
                resultingCode += eventSpec.inlineCodeTemplates[target];
            } else {
                resultingCode += getFromCache(event, target);
            }
            for (const argCode in requiredArgs) {
                if (!(argCode in eventArgs)) {
                    const errorMessage = `Argument ${argCode} is missing in the event ${eventSpec.name}, of a ${entity.type} ${entity.uid}.`;
                    const exporterError = new ExporterError(errorMessage, {
                        resourceId: entity.uid,
                        resourceName: entity.name,
                        resourceType: entity.type,
                        clue: 'eventConfiguration'
                    });
                    throw exporterError;
                }
                const exp = new RegExp(`/\\*%%${argCode}%%\\*/`, 'g');
                const argType = eventSpec.arguments[argCode].type;
                if (['template', 'room', 'sound', 'tandem', 'font', 'style', 'texture'].indexOf(argType) !== -1) {
                    const value = getAssetName(String(eventArgs[argCode]), argType as resourceType);
                    resultingCode = resultingCode.replace(exp, `'${value.replace(/'/g, '\\\'')}'`);
                } else if (typeof eventArgs[argCode] === 'string') {
                    // Wrap the value into singular quotes, escape existing quotes
                    resultingCode = resultingCode.replace(exp, `'${String(eventArgs[argCode]).replace(/'/g, '\\\'')}'`);
                } else {
                    resultingCode = resultingCode.replace(exp, String(eventArgs[argCode]));
                }
            }
            resultingCode = resultingCode.replace(/\/\*%%ENTITY_TYPE%%\*\//g, `'${entity.type}'`);
            resultingCode = resultingCode.replace(/\/\*%%ENTITY_NAME%%\*\//g, `'${entity.name}'`);
            resultingCode = resultingCode.replace(/\/\*%%USER_CODE%%\*\//g, code);
            domains[target] += resultingCode;
            domains[target] += '\n';
        }
    }
    return domains;
};


export {
    getBaseScripts,
    resetEventsCache,
    populateEventCache
};
