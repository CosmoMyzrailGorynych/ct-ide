window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '5.0.0',
    process: project => new Promise(resolve => {
        if (project.language === 'coffeescript') {
            project.language = 'civet';
        }
        const walker = collection => {
            for (const item of collection) {
                if (item.type === 'script' && item.language === 'coffeescript') {
                    item.language = 'civet';
                } else if (item.type === 'folder') {
                    walker(item.entries);
                }
            }
        };
        walker(project.assets);
        resolve();
    })
});
