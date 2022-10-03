export const flattenGroups = (project: IProject): Record<string, Record<string, string>> => {
    const out: Record<string, Record<string, string>> = {};
    let thing: keyof typeof project.groups;
    for (thing in project.groups) {
        out[thing] = {
            '-1': 'ungrouped'
        };
        for (const group of project.groups[thing]) {
            out[thing][group.uid] = group.name;
        }
    }
    return out;
};
export const getGroups = (project: IProject): Record<string, Record<string, string[]>> => {
    const out: Record<string, Record<string, string[]>> = {};
    let thing: keyof typeof project.groups;
    const flattened = flattenGroups(project);
    for (thing in project.groups) {
        out[thing] = {};
        for (const groupId in flattened[thing]) {
            out[thing][flattened[thing][groupId]] = [];
        }
        for (const asset of project[thing]) {
            const groupName = asset.group ? flattened[thing][asset.group] : 'ungrouped';
            out[thing][groupName].push(('name' in asset) ? asset.name : asset.typefaceName);
        }
    }
    return out;
};
