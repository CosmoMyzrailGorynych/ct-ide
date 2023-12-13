/* eslint-disable no-console */
(function discordRichPresence() {
    // Disable IPC for windows 11 as it quacking crashes
    if (process.platform === 'win32') {
        const windows11 = require('child_process')
            .execSync('ver')
            .toString()
            .trim()
            .indexOf('Version 10.0.2') !== -1;
        if (windows11) {
            return;
        }
    }

    const appId = '749670101904785502';
    const startTimestamp = new Date();
    let failed = false;

    const RPC = require('discord-rpc');
    const client = new RPC.Client({
        transport: 'ipc'
    });

    const notifyFailed = () => {
        if (!failed) {
            failed = true;
            console.error('Could not enable Discord Rich Presence.');
            setTimeout(() => {
                alertify.log('Could not enable Discord Rich Presence.');
            }, 1750);
        }
    };
    const setActivity = status => {
        client.setActivity(status)
        .then(() => console.debug('[discord] Successfully changed rich presence.'))
        .catch((...err) => {
            console.error(...err);
            notifyFailed();
        });
    };

    let scheduledTimeout = false,
        scheduledStatus = false;
    const tryStatusUpdate = () => {
        if (!scheduledTimeout && scheduledStatus) {
            setActivity(scheduledStatus);
            scheduledStatus = false;
            // eslint-disable-next-line no-use-before-define
            delay();
        }
    };
    const delay = () => {
        console.debug('[discord] Delaying status update…');
        // Extra 100ms to avoid race conditions due to network issues
        scheduledTimeout = setTimeout(() => {
            scheduledTimeout = false;
            tryStatusUpdate();
        }, 15100);
    };
    const requestStatusUpdate = status => {
        scheduledStatus = status;
        tryStatusUpdate(scheduledStatus);
    };

    const activityMap = {
        debug: 'Testing a game',
        project: 'Configuring a project',
        textures: 'Working with textures',
        ui: 'Editing fonts and styles',
        fx: 'Creating particle systems',
        sounds: 'Managing sounds',
        templates: 'Coding templates',
        rooms: 'Designing rooms'
    };

    const changeDiscordStatus = (tab) => {
        let details, state;
        if (!tab) {
            state = 'Start screen';
            details = void 0;
        } else {
            details = window.currentProject ? window.currentProject.settings.authoring.title : null;
            state = activityMap[tab];
        }
        const activity = {
            startTimestamp,
            state,
            largeImageKey: 'icon-lg',
            largeImageText: 'ct.js',
            smallImageKey: `icon-small-${tab}`,
            smallImageText: state,
            instance: false
        };
        if (details) {
            activity.details = details;
        }
        requestStatusUpdate(activity);
    };

    window.signals.on('globalTabChanged', (tab) => {
        changeDiscordStatus(tab);
    });
    window.signals.on('resetAll', () => {
        changeDiscordStatus();
    });

    client
    .login({
        clientId: appId
    })
    .catch((...err) => {
        console.error(...err);
        notifyFailed();
    });

    client.on('ready', () => {
        console.debug('[discord] Ready to use discord rich presence!');
        requestStatusUpdate({
            startTimestamp,
            details: 'Just launched',
            largeImageKey: 'icon-lg',
            largeImageText: 'ct.js',
            instance: false
        });
    });
})();
