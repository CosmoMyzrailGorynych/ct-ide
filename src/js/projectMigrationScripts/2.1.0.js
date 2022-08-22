window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '2.1.0',
    // eslint-disable-next-line max-lines-per-function
    process: project => new Promise(resolve => {
        const templateEventMap = {
            oncreate: 'OnCreate',
            onstep: 'OnStep',
            ondestroy: 'OnDestroy',
            ondraw: 'OnDraw'
        };
        const roomEventMap = {
            oncreate: 'OnRoomStart',
            onstep: 'OnStep',
            ondraw: 'OnDraw',
            onleave: 'OnRoomEnd'
        };
        for (const template of project.templates) {
            if (!template.events) {
                template.events = [];
                for (const key in templateEventMap) {
                    if (template[key]) {
                        template.events.push({
                            lib: 'core',
                            arguments: {},
                            code: template[key],
                            eventKey: templateEventMap[key]
                        });
                    }
                    delete template[key];
                }
            }
            template.type = 'template';
            if (!('loopAnimation' in template)) {
                template.loopAnimation = true;
            }
        }
        for (const room of project.rooms) {
            if (!room.events) {
                room.events = [];
                for (const key in roomEventMap) {
                    if (room[key]) {
                        room.events.push({
                            lib: 'core',
                            arguments: {},
                            code: room[key],
                            eventKey: roomEventMap[key]
                        });
                        delete room[key];
                    }
                }
            }
            room.type = 'room';
        }
        resolve();
    })
});
