import {ExportedFolder, ExportedAsset} from './_exporterContracts';

export const getAssetTree = (assets: folderEntries, project: IProject):
(ExportedFolder | ExportedAsset)[] =>
    assets
    .filter(asset => asset.type === 'folder' || project.settings.export.bundleAssetTypes[asset.type])
    .map(asset => {
        if (asset.type === 'folder') {
            return {
                name: asset.name,
                type: 'folder' as resourceType,
                entries: getAssetTree(asset.entries, project)
            };
        }
        return {
            name: asset.name,
            type: asset.type
        };
    });
