import fs from 'fs-extra';
import path from 'path';

const riotTagsDir = './src/riotTags';

// Regex to match Riot.js tag includes
const includeMatch = /\b(?<!\.)([a-z]+(-[a-z]+)+|raw)\b/g;

interface TagTree {
    [tagName: string]: string[];
}

const getTagNames = async (dir: string): Promise<string[]> => {
    const names: string[] = [];
    const entries = await fs.readdir(dir);

    // First pass is getting tag names only (based on filenames)
    await Promise.all(entries.map(async entry => {
        const entryPath = path.join(dir, entry);
        const stat = await fs.stat(entryPath);

        if (stat.isDirectory()) {
            names.push(...await getTagNames(entryPath));
        } else if (stat.isFile() && entry.endsWith('.tag')) {
            const tagName = entry.replace('.tag', '');
            names.push(tagName);
        }
    }));
    return names;
};

const buildTagTree = async (dir: string, tagNames: string[]): Promise<TagTree> => {
    const tree: TagTree = {};
    const entries = await fs.readdir(dir);
    // Second pass is forming a 1-level tree
    await Promise.all(entries.map(async entry => {
        const entryPath = path.join(dir, entry);
        const stat = await fs.stat(entryPath);
        if (stat.isDirectory()) {
            Object.assign(tree, await buildTagTree(entryPath, tagNames));
        } else if (stat.isFile() && entry.endsWith('.tag')) {
            const tagName = entry.replace('.tag', '');
            const content = await fs.readFile(entryPath, 'utf8');
            try {
                const [pug] = content.split(tagName)
                    .slice(1)
                    .join(tagName)
                    .split('script.');
                tree[tagName] = [...new Set(Array
                    .from(pug.matchAll(includeMatch), m => m[1])
                    .filter(name => tagNames.includes(name)))];
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(content.split(tagName));
                // eslint-disable-next-line no-console
                console.error(tagName);
                throw e;
            }
        }
    }));

    return tree;
};

const printTagChildren = (
    tree: TagTree,
    tagName: string,
    indent = '',
    depth: number,
    alreadyNoted: string[]
): void => {
    /* eslint-disable no-console */
    if (indent) {
        console.log(indent + '╰─' + tagName);
    } else {
        console.log(tagName);
    }
    // Stop if describing a tag that has itself as a parent
    if (alreadyNoted.includes(tagName)) {
        return;
    }
    if (!depth) {
        if (tree[tagName].length) {
            console.log(indent + '    ╰─(too deep)');
        }
        return;
    }
    for (const child of tree[tagName]) {
        if (child === tagName) {
            console.log(indent + '    ╰─(self)');
        } else {
            printTagChildren(
                tree,
                child,
                indent + '    ',
                depth - 1,
                [...alreadyNoted, tagName]
            );
        }
    }
    /* eslint-enable no-console */
};

const printTree = (tree: TagTree, depth = 7): void => {
    for (const tagName of Object.keys(tree)) {
        if (Object.keys(tree).some(tag2name =>
            tree[tag2name].includes(tagName) && tagName !== tag2name)
        ) {
            // Ignore non-top-level tags
            continue;
        }
        printTagChildren(tree, tagName, '', depth, []);
    }
};

const main = async () => {
    const tagNames = await getTagNames(riotTagsDir);
    const tagTree = await buildTagTree(riotTagsDir, tagNames);
    // eslint-disable-next-line no-console
    printTree(tagTree);
};


main();
