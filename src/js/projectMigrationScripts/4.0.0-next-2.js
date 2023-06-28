window.migrationProcess = window.migrationProcess || [];

window.migrationProcess.push({
    version: '4.0.0-next-2',
    process: project => new Promise(resolve => {
        const assets = [];
        const oldGroups = {};
        // Flatten old groups into one group map
        for (const key in project.groups) {
            for (const group of project.groups[key]) {
                if (!(group.name in oldGroups)) {
                    oldGroups[group.name] = group;
                }
            }
        }
        // Turn old groups into asset folders
        project.assets = project.assets ?? [];
        for (const key in oldGroups) {
            const group = oldGroups[key];
            group.entries = [];
            group.type = 'folder';
            project.assets.push(group);
        }
        const typeToCollectionMap = {
            template: 'templates',
            room: 'rooms',
            sound: 'sounds',
            style: 'styles',
            skeleton: 'skeletons',
            texture: 'textures',
            tandem: 'emitterTandems',
            font: 'fonts'
        };
        // Put assets into folders.
        // Ensure all of them have an asset type set in their object.
        for (const assetType in typeToCollectionMap) {
            const collectionName = typeToCollectionMap[assetType];
            for (const asset of project[collectionName]) {
                asset.type = assetType;
                if (asset.group) {
                    const groupName = project.groups[collectionName]
                        .find(g => g.uid === asset.group.uid).name;
                    oldGroups[groupName].assets.entries.push(asset);
                } else {
                    assets.push(asset);
                }
            }
            delete project[collectionName];
        }
        delete project.groups;
        resolve();
    })
});
