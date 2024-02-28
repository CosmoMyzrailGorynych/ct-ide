window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.1.0',
    process: project => new Promise(resolve => {
        const walker = collection => {
            for (const item of collection) {
                if (['template', 'behavior', 'room'].includes(item.type)) {
                    item.extendTypes = item.extendTypes ?? '';
                } else if (item.type === 'folder') {
                    walker(item.entries);
                }
            }
        };
        walker(project.assets);
        resolve();
    })
});
