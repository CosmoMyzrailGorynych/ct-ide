window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-3',
    process: project => new Promise(resolve => {
        const toPatch = [];
        const walker = collection => {
            for (const item of collection) {
                if (['room', 'template'].includes(item.type)) {
                    toPatch.push(item);
                } else if (item.type === 'folder') {
                    walker(item.entries);
                }
            }
        };
        walker(project.assets);
        for (const item of toPatch) {
            item.behaviors ??= [];
            if (item.type === 'template') {
                if (!item.baseClass) {
                    item.baseClass = 'AnimatedSprite';
                    item.nineSliceSettings = {
                        left: 16,
                        top: 16,
                        right: 16,
                        bottom: 16
                    };
                    item.style = -1;
                }
            }
        }
        resolve();
    })
});
