window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '1.8.0',
    process: project => new Promise(resolve => {
        project.contentTypes = project.contentTypes || [];
        project.groups = project.groups || {
            fonts: [],
            textures: [],
            styles: [],
            rooms: [],
            types: [],
            sounds: [],
            emitterTandems: []
        };
        // ctype property from ct.place got renamed into cgroup.
        for (const type of project.types) {
            if (type.extends && type.extends.ctype) {
                type.extends.cgroup = type.extends.ctype;
                delete type.extends.ctype;
            }
        }

        resolve();
    })
});
