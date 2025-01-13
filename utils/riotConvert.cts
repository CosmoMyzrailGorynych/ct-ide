import fs from 'fs-extra';
import path from 'path';

const riotTagsDir = './src/riotTags';
const tagsDir = './src/tempSvelte';

const docMatch = /^\/\/-?\n([\s\S]+?)\n\b/;
const scriptTagMatch = /^([\s\S]+?)\s+(script\.\n([\s\S]*))?$/;
const thisVocMatch = /\bthis\.voc(Glob|Full|Meta|)\b/g;
const vocNamespaceMatch = /this\.namespace = ['"](\S+)['"];?\s+this\.mixin\(require\('src\/lib\/riotMixins\/voc'\)\.default\);?/;
const mountUnmountMatch = /this\.on\('(unmount|mount)', ?/g;
const methodDefMatch = /this\.(\S+)\s*=\s*(?:(async)\s*?\s*?)?(\([\w :,<>{}]*\)|\w+\b) =>/g;
const classObjStatementMatch = /class="\{(\S+):([\s\S]+?)\}"/g;
const requireMatches = /const (\{[\S, ]+?\}|\S+) = require\((\S+)\);?\s+/g;
const eventAnonymousMatch = /(\S+) = (async )?\(?e\)? =>/g;
const assetAnonymousMatch = /(\S+) = (async )?\(?(asset|a)\)? =>/g;
const stringAnonymousMatch = /(\S+) = (async )?\(?(str\w*|path|char|u?id|name|src|dest|link|url)\)? =>/g;
const basicPropMatch = /^( *)this\.(\S+)\s*=\s*([^\n]+);/gm;
const showAttributeMatch = /\bshow="{([^\n]+?)}"/g;
const hideAttributeMatch = /\bhide="{([^\n]+?)}"/g;
const ifEachMatch = /(?<=\n)( +)([\w-.#]+?)\(([^)]*?)\b(if|each)="{([\s\S]+?)}"([\s\S]*?)\)/g;
const optsMatch = /\b(this\.)?opts\b/g;

type renameMap = Map<string, {
    newName: string;
    importPath: string;
}>;

// eslint-disable-next-line complexity, max-lines-per-function
const convert = (riot: string, filepath: string, renames: renameMap) => {
    let [, pug, , script] = riot.match(scriptTagMatch) || [];
    if (!pug) {
        throw new Error('Invalid Pug script tag in ' + filepath);
    }

    let svelte = '';
    // Move documentation out from the Pug code and neaten it a bit
    const documentation = riot.match(docMatch)?.[1] || '';
    if (documentation) {
        const lines = documentation
            .trimEnd()
            .split('\n')
            .map(line => line.slice(4));
        svelte += `<!--\n@component\n\n${lines.join('\n')}\n-->\n`;
        pug = pug.replace(docMatch, '');
    }

    // Wrap class definitions into {{double}} brackets for valid syntax
    pug = pug.replace(classObjStatementMatch, 'class="{{$1:$2}}"');

    // Replace show/hide attributes with class: directives
    pug = pug.replace(showAttributeMatch, 'class:show="{$1}"')
             .replace(hideAttributeMatch, 'class:hide="{$1}"');

    // Rewrite component names
    const usedTags: [string, string][] = [];
    for (const [oldName, {newName, importPath}] of renames) {
        // See if the current tag imports itself
        if (oldName === path.basename(filepath, '.tag')) {
            if (pug.includes(' ' + oldName)) { // Child tags are always indented, use it to detect them
                usedTags.push([newName, importPath]);
            }
        } else if (pug.includes(oldName)) {
            pug = pug.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
            usedTags.push([newName, importPath]);
        }
    }

    // Partially prepare if/each mixins
    // eslint-disable-next-line max-params
    pug = pug.replace(ifEachMatch, (match, indent, node, start, ifEach, expression, end) => {
        if (ifEach === 'each') {
            const [start, end] = expression.split(' in ');
            expression = `${end} as ${start}`;
        }
        return `${indent}+${ifEach}("${expression}")\n${indent}// TODO: indent\n${indent}${node}(${start || ''}${end || ''})`;
    });

    // Wrap the Pug code into a Svelte template tag
    svelte += '<template lang="pug">\n' + pug + '\n</template>';

    if (script) {
        const prefixChunks: string[] = [];

        // Outdent the script content
        script = script.split('\n')
                       .map(line => line.slice(8))
                       .join('\n');

        // Replace this.opts with $props
        if (script.search(optsMatch) !== -1) {
            prefixChunks.push('const opts = $props();');
            script = script.replace(optsMatch, 'opts');
        }

        // Turn all requires into imports and pull them to the root of the file
        const requires = [...(script.matchAll(requireMatches) || []).map(match => ({
            imports: match[1],
            path: match[2]
        }))];
        if (requires.length) {
            prefixChunks.push(requires.map(r => `import ${r.imports} from ${r.path};`).join('\n'));
            script = script.replace(requireMatches, '');
        }

        // Add import statements for the new tags
        if (usedTags.length) {
            prefixChunks.push(usedTags.map(t => `import ${t[0]} from '${t[1]}';`).join('\n'));
        }

        // Replace this.on('mount'/'unmount') with equivalents in Svelte
        if (mountUnmountMatch.test(script)) {
            prefixChunks.push('import {onMount, onDestroy} from \'svelte\';');
            script = script.replace(mountUnmountMatch, (match, event) =>
                `on${event === 'mount' ? 'Mount' : 'Destroy'}(`);
        }

        // Replace this.voc* to reading from vue store, and add an import of the i18n API
        if (script.includes('this.mixin(require(\'src/lib/riotMixins/voc\').default)')) {
            const names: string[] = [];
            const [, vocNamespace] = script.match(vocNamespaceMatch) || [];
            if (vocNamespace) {
                if (/\bvoc\b/.test(pug + script)) {
                    names.push('getNamespace');
                }
            }
            if (/\bvocGlob\b/.test(pug + script)) {
                names.push('vocGlob');
            }
            if (/\bvocFull\b/.test(pug + script)) {
                names.push('vocFull');
            }
            if (/\bvocMeta\b/.test(pug + script)) {
                names.push('vocMeta');
            }
            script = script.replace(new RegExp(`this\\.namespace = ['"]${vocNamespace}['"];?`, 'g'), '')
                            .replace('this.mixin(require(\'src/lib/riotMixins/voc\').default);\n', '')
                            .replace(thisVocMatch, '$voc$1');
            prefixChunks.push(`import {${names.join(', ')}} from 'src/lib/i18n';`);
            if (names.includes('getNamespace')) {
                script = `const voc = getNamespace('${vocNamespace}');\n\n` + script;
            }
        }

        // Turn methods in `this` into constants
        const methodDefNames = new Set([...script.matchAll(methodDefMatch)].map(match => match[1]));
        for (const methodName of methodDefNames) {
            script = script.replace(new RegExp(`this\\.${methodName} =`), `const ${methodName} =`)
                           .replace(new RegExp(`this\\.${methodName}\\b`, 'g'), methodName);
        }

        // Turn top-level props into $state variables if they are used in markup,
        // and make them `let` otherwise
        const propCalls = [...script.matchAll(basicPropMatch)].map(match => match[2]);
        const propDefs = [...script.matchAll(basicPropMatch)]
            .map(match => ({
                fullMatch: match[0],
                indentation: match[1].length,
                propName: match[2],
                propValue: match[3]
            }))
            // skip indented declarations
            .filter(match => match.indentation === 0);
        for (const propDef of propDefs) {
            let stateVar = true;
            if (pug.search(new RegExp(`\\b${propDef.propName}\\b`)) === -1) {
                stateVar = false;
            }
            if (propCalls.filter(c => c === propDef.propName).length === 1) {
                stateVar = false;
            }
            if (stateVar) {
                script = script.replace(propDef.fullMatch, `let ${propDef.propName} = $state(${propDef.propValue});`)
                               .replace(new RegExp(`this\\.${propDef.propName}\\b`, 'g'), propDef.propName);
            } else {
                script = script.replace(propDef.fullMatch, `let ${propDef.propName} = ${propDef.propValue};`)
                               .replace(new RegExp(`this\\.${propDef.propName}\\b`, 'g'), propDef.propName);
            }
        }

        // Guess types of event listeners on tags
        const events = [...(script.matchAll(eventAnonymousMatch) || []).map(match => match[1])];
        for (const eventName of events) {
            let guessedType = 'Event';
            if (pug.search(new RegExp('on((dbl|aux)?click|mouse\\w+)="{' + eventName)) !== -1) {
                guessedType = 'MouseEvent';
            } else if (pug.search(new RegExp('onwheel="{' + eventName)) !== -1) {
                guessedType = 'WheelEvent';
            } else if (pug.search(new RegExp('onkey\\w+="{' + eventName)) !== -1) {
                guessedType = 'KeyboardEvent';
            } else if (pug.search(new RegExp('on(input|change)="{' + eventName)) !== -1) {
                guessedType = 'InputEvent';
            } else if (pug.search(new RegExp('onsubmit="{' + eventName)) !== -1) {
                guessedType = 'SubmitEvent';
            } else if (pug.search(new RegExp('on(blur|focus)="{' + eventName)) !== -1) {
                guessedType = 'FocusEvent';
            } else if (pug.search(new RegExp('onpointer\\w+="{' + eventName)) !== -1) {
                guessedType = 'PointerEvent';
            } else if (pug.search(new RegExp('ondr(ag|op)="{' + eventName)) !== -1) {
                guessedType = 'DragEvent';
            }
            script = script.replace(new RegExp(`${eventName} = (async )?\\(?e\\)? =>`), `${eventName} = $1(e: ${guessedType}) =>`);
        }

        // Add types for methods that work with assets
        script = script.replaceAll(assetAnonymousMatch, (match, eventName, asyncTag, argName) => `${eventName} = ${asyncTag || ''}(${argName}: IAsset) =>`);

        // Add types for methods with string-like arguments
        script = script.replaceAll(stringAnonymousMatch, (match, eventName, asyncTag, argName) => `${eventName} = ${asyncTag || ''}(${argName}: string) =>`);

        // Wrap the script into a typescript tag
        if (prefixChunks.length) {
            svelte += '\n\n<script lang="ts">\n' + prefixChunks.join('\n\n') + '\n\n' + script.trim() + '\n</script>';
        } else {
            svelte += '\n\n<script lang="ts">\n' + script.trim() + '\n</script>';
        }
    }

    return svelte;
};

const dashCaseToTitleCase = (str: string): string =>
    str[0].toUpperCase() + str.slice(1).replace(/-(\w)/g, (_, c) => c.toUpperCase());

const getTagRenames = async (dir: string): Promise<renameMap> => {
    const entries = await fs.readdir(dir);
    const tagRenames: renameMap = new Map();
    await Promise.all(entries.map(async entry => {
        const entryPath = path.join(dir, entry);
        const stat = await fs.stat(entryPath);
        if (stat.isFile() && entry.endsWith('.tag')) {
            const oldName = path.basename(entry, '.tag');
            const newName = dashCaseToTitleCase(oldName);
            const relativePath = path.relative(riotTagsDir, entryPath);
            const importPath = path.join('src', tagsDir, relativePath.replace(oldName + '.tag', newName + '.svelte')).replaceAll('\\', '/');
            tagRenames.set(oldName, {
                newName,
                importPath
            });
        } else if (stat.isDirectory()) {
            for (const [name, rename] of await getTagRenames(entryPath)) {
                tagRenames.set(name, rename);
            }
        }
    }));
    return tagRenames;
};

const convertRiotTags = async (dir: string, renames: renameMap) => {
    const entries = await fs.readdir(dir);
    await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(dir, entry);
        const stat = await fs.stat(entryPath);
        if (stat.isDirectory()) {
            await convertRiotTags(entryPath, renames); // Recursively process subdirectories
        } else if (stat.isFile() && entry.endsWith('.tag')) {
            const riotContent = await fs.readFile(entryPath, 'utf8');
            const oldName = path.basename(entry, '.tag');
            const renameInfo = renames.get(oldName)!;
            try {
                const svelteContent = convert(riotContent, entryPath, renames);
                const relativePath = path.relative(riotTagsDir, entryPath);
                const outputPath = path.join(tagsDir, relativePath.replace(oldName + '.tag', renameInfo.newName + '.svelte'));
                await fs.ensureDir(path.dirname(outputPath)); // Ensure output directory exists
                await fs.writeFile(outputPath, svelteContent);
            } catch (error) {
                console.error(`Error processing ${entryPath}:`);
                throw error;
            }
        }
    }));
};

getTagRenames(riotTagsDir)
.then(renames => {
    convertRiotTags(riotTagsDir, renames);
});
