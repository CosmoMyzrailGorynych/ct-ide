window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '3.2.0',
    process: project => new Promise(resolve => {
        // Mark all older projects as TypeScript projects
        project.language = 'typescript';
        // Add `follow` key for all the rooms (camera follow in room properties)
        for (const room of project.rooms) {
            room.follow = room.follow || -1;
        }
        resolve();
    })
});
