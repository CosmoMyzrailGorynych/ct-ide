window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '2.0.0',
    process: project => new Promise(resolve => {
        if (!project.templates) {
            project.templates = project.types;
            delete project.types;
        }
        const ctTypesRegex = /ct\.types/g;
        for (const template of project.templates) {
            for (const i of ['onstep', 'ondraw', 'ondestroy', 'oncreate']) {
                template[i].replace(ctTypesRegex, 'ct.templates');
            }
        }
        for (const room of project.rooms) {
            for (const i of ['onstep', 'ondraw', 'onleave', 'oncreate']) {
                room[i].replace(ctTypesRegex, 'ct.templates');
            }
        }

        // ctype property from ct.place got renamed into cgroup.
        for (const template of project.templates) {
            if (template.extends && template.extends.ctype) {
                template.extends.cgroup = template.extends.ctype;
                delete template.extends.ctype;
            }
        }

        project.groups.templates = project.groups.templates || project.groups.types || [];
        if ('types' in project.groups) {
            delete project.groups.types;
        }

        resolve();
    })
});
