import {getEventByLib} from '../../events';

export const getIcons = (asset: IScriptable): string[] => {
    const icons: string[] = [];
    // Show at max 5 event icons
    for (let i = 0; i < 5 && i < asset.events.length; i++) {
        const event = asset.events[i];
        const eventDeclaration = getEventByLib(event.eventKey, event.lib);
        if (!eventDeclaration) {
            // signal the user about missing events
            icons.push('alert-circle');
        } else {
            icons.push(eventDeclaration.icon);
        }
    }
    if (asset.events.length > 5) {
        icons.push('more-horizontal');
    }
    return icons;
};
