(function discordRichPresence() {
    const appId = '749670101904785502';
    const startTimestamp = new Date();
    let available = false;

    const RPC = require('discord-rpc');
    const client = new RPC.Client({
        transport: 'ipc'
    });

    const limitRate = function limitRate(func, ms) {
        // The same may be done with ct.flow.gate + ct.flow.
        var timer;
        var delay = function (...args) {
            if (!timer) {
                timer = true;
                setTimeout(() => {
                    timer = false;
                }, ms);
                func(...args);
            }
        };
        return delay;
    };

    const setActivity = limitRate(function setActivity(activity) {
        if (!available) {
            return;
        }
        client.setActivity(activity)
        .catch(console.error);
    }, 1000 * 15);

    client.login({
        clientId: appId
    })
    .catch(console.error);
    client.on('ready', () => {
        available = true;
        setActivity({
            startTimestamp,
            details: 'Just launched',
            largeImageKey: 'icon-lg',
            instance: false
        });
    });

    /**
     * {
            details: 'Testing',
            state: 'Rich Presence',
            smartTimestamp: new Date(),
            largeImageText: 'Hello world',
            smallImageText: 'Hello smaller world'
        }
     */
    const activityMap = {
        debug: 'Tests a game',
        project: 'Configures project\'s settings',
        textures: 'Works with textures',
        ui: 'Edits fonts and styles',
        fx: 'Creates particle systems',
        sounds: 'Manages sounds',
        types: 'Codes types',
        rooms: 'Designs levels'
    };
    window.signals.on('globalTabChanged', tab => {
        const activity = {
            startTimestamp,
            details: window.currentProject.settings.authoring.title || void 0,
            state: activityMap[tab],
            largeImageKey: 'icon-lg',
            smallImageKey: `icon-small-${tab}`,
            smallImageText: activityMap[tab],
            instance: false
        };
        setActivity(activity);
    });
})();
