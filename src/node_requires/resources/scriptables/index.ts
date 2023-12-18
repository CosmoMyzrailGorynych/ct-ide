import {getEventByLib} from '../../events';

export const getIcons = (asset: IScriptable): string[] => {
    const icons: string[] = [];
    for (let i = 0; i < 5 && i < asset.events.length; i++) {
        const event = asset.events[i];
        icons.push(getEventByLib(event.eventKey, event.lib).icon);
    }
    if (asset.events.length > 5) {
        icons.push('more-horizontal');
    }
    return icons;
};
