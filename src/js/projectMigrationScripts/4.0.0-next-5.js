window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-5',
    process: project => new Promise(resolve => {
        const walker = collection => {
            for (const item of collection) {
                if (item.type === 'sound') {
                    item.panning = item.panning ?? {
                        refDistance: 0.5,
                        rolloffFactor: 1
                    };
                } else if (item.type === 'folder') {
                    walker(item.entries);
                }
            }
        };
        walker(project.assets);
        resolve();
    })
});
