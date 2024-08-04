// This file exports a parseFile method that takes a .d.ts file and returns
// an array of usable methods and properties Catnip can use.

/* eslint-disable no-use-before-define */
import ts from 'typescript';
import path from 'path';

const paramConstTypeMap: Partial<Record<ts.SyntaxKind, blockArgumentType | 'BLOCKS'>> = {
    [ts.SyntaxKind.AnyKeyword]: 'wildcard',
    [ts.SyntaxKind.Unknown]: 'wildcard',
    [ts.SyntaxKind.ObjectKeyword]: 'wildcard',
    [ts.SyntaxKind.ThisType]: 'wildcard',
    [ts.SyntaxKind.UnionType]: 'wildcard',
    [ts.SyntaxKind.IntersectionType]: 'wildcard',
    [ts.SyntaxKind.ParenthesizedType]: 'wildcard',
    [ts.SyntaxKind.TypeLiteral]: 'wildcard',
    [ts.SyntaxKind.TypeReference]: 'wildcard',
    [ts.SyntaxKind.BooleanKeyword]: 'boolean',
    [ts.SyntaxKind.FalseKeyword]: 'boolean',
    [ts.SyntaxKind.TrueKeyword]: 'boolean',
    [ts.SyntaxKind.NumberKeyword]: 'number',
    [ts.SyntaxKind.StringKeyword]: 'string',
    [ts.SyntaxKind.VoidKeyword]: 'void',
    [ts.SyntaxKind.FunctionType]: 'BLOCKS'
};

const usefulMap = {
    [ts.SyntaxKind.FunctionDeclaration]: 'function' as const,
    [ts.SyntaxKind.MethodSignature]: 'function' as const,
    [ts.SyntaxKind.PropertySignature]: 'prop' as const
};

type usableArgument = {
    type: blockArgumentType | 'BLOCKS',
    name: string,
    required: boolean
};
export type usableDeclaration = {
    name: string;
    returnType?: blockArgumentType;
    description?: string;
    jsDoc?: ts.JSDoc[];
    node: ts.Node;
} & ({
    kind: 'function';
    args: usableArgument[];
} | {
    kind: 'prop'
});

const simplifyJsDoc = (jsDoc: ts.JSDoc[] | void): string | void => {
    if (!jsDoc) {
        return void 0;
    }
    return jsDoc.map<string>(doc => (Array.isArray(doc.comment) ?
        (doc.comment as ts.NodeArray<ts.JSDocComment>)
            .map(comment => comment)
            .join('\n') :
        doc.comment as string))
    .join('\n\n');
};

/**
 * Returns an object for further use by Catnip that describes the given
 * argument of a method.
 */
const paramToUsefulArg = (param: ts.ParameterDeclaration): usableArgument => {
    let tsType = (param.type as any)?.typeName?.escapedText ?? 'any';
    if (param.type &&
        (ts.isToken(param.type) ||
            param?.type?.kind === ts.SyntaxKind.FunctionType)) {
        tsType = paramConstTypeMap[param.type.kind as keyof typeof paramConstTypeMap] ?? 'any';
    }
    if (tsType === 'any') {
        // eslint-disable-next-line max-len
        // console.warn('[catnip\'s declaration extractor] Unknown type', param.type?.kind, param.type, 'in', name);
        tsType = 'wildcard';
    }
    return {
        name: (param.name as any).escapedText,
        type: tsType,
        required: !param.questionToken && !param.initializer
    };
};

/**
 * Traverses the AST of a TypeScript file and extracts useful declarations
 * of methods and properties.
 */
// eslint-disable-next-line max-lines-per-function, complexity
const visit = (
    node: ts.Node,
    topLevelPath: string,
    onUseful: ((useful: usableDeclaration) => void)
) => {
    switch (node.kind) {
    // Traverse nodes inside modules and namespaces
    case ts.SyntaxKind.ModuleDeclaration: {
        const moduleName = (node as ts.ModuleDeclaration).name.text;
        ts.forEachChild(node, child => visit(child, `${topLevelPath}.${moduleName}`, onUseful));
    } break;
    case ts.SyntaxKind.ModuleBlock:
        ts.forEachChild(node, child => visit(child, `${topLevelPath}`, onUseful));
        break;
    // `var` statements
    case ts.SyntaxKind.FirstStatement: {
        const first = node as ts.VariableStatement;
        if (first.declarationList && first.declarationList.declarations.length) {
            for (const declaration of first.declarationList.declarations) {
                const {name} = declaration;
                let usefulName: string;
                // Some variables can be top-level constants, use their name as is
                if (topLevelPath === 'root') {
                    usefulName = (name as any).escapedText;
                } else {
                    // Remove the `root.` ⤵️
                    usefulName = `${topLevelPath.slice(5)}.${(name as any).escapedText}`;
                }
                onUseful({
                    name: usefulName,
                    kind: 'prop',
                    returnType: declaration?.type?.kind ?
                        ((paramConstTypeMap[declaration?.type?.kind] as blockArgumentType) ?? 'wildcard') :
                        'wildcard',
                    description: (first as any).jsDoc?.[0].comment,
                    jsDoc: (first as any).jsDoc,
                    node
                });
                if ((declaration?.type as any)?.members) {
                    // eslint-disable-next-line max-depth
                    for (const member of (declaration.type as any).members) {
                        visit(member, `${topLevelPath}.${(name as any).escapedText}`, onUseful);
                    }
                }
            }
        }
    } break;
    // Any method
    // ⚠️ Triple case here
    case ts.SyntaxKind.PropertySignature:
    case ts.SyntaxKind.MethodSignature:
    case ts.SyntaxKind.FunctionDeclaration: {
        const {name, type, jsDoc} = (node as (
                ts.PropertySignature |
                ts.FunctionDeclaration
            ) & {jsDoc: ts.JSDoc[]});
        let args: {
            type: blockArgumentType | 'BLOCKS';
            name: string;
            required: boolean;
        }[] = [];
        if (node.kind === ts.SyntaxKind.FunctionDeclaration ||
            node.kind === ts.SyntaxKind.MethodSignature
        ) {
            args = (node as ts.FunctionDeclaration | ts.MethodSignature)
                .parameters.map(paramToUsefulArg);
        }
        // Some methods can be top-level functions, use their name as is
        let usefulName: string;
        if (topLevelPath === 'root') {
            usefulName = (name as any).escapedText;
        } else {
            // Remove the `root.` ⤵️
            usefulName = `${topLevelPath.slice(5)}.${(name as any).escapedText}`;
        }
        const useful: Partial<usableDeclaration> = {
            name: usefulName,
            kind: usefulMap[node.kind],
            jsDoc,
            node
        };
        useful.returnType = type ?
            ((paramConstTypeMap[type.kind] as blockArgumentType) ?? 'wildcard') :
            'wildcard';
        if (useful.kind === 'function') {
            useful.args = args;
        }
        const description = simplifyJsDoc(jsDoc);
        if (description) {
            useful.description = description;
        }
        onUseful(useful as usableDeclaration);
    } break;
    default:
        // console.debug('skipping', node.kind, ts.SyntaxKind[node.kind], node);
        void 0;
    }
};

export const parseFile = async (filename: string): Promise<usableDeclaration[]> => {
    const txt = await fetch(filename).then(response => response.text());
    const program = ts.createProgram([filename], {}, {
        readFile: () => txt,
        // eslint-disable-next-line id-length
        useCaseSensitiveFileNames: () => true,
        fileExists: () => true,
        getDefaultLibFileName: () => 'browser',
        getCurrentDirectory: () => path.dirname(filename),
        getCanonicalFileName: () => path.basename(filename),
        getSourceFile: (src: string) => ts.createSourceFile(
            path.basename(src),
            txt,
            ts.ScriptTarget.ES2020
        ),
        writeFile: () => {
            void 'noop';
        },
        getNewLine: () => 'LF'
    });
    // const checker = program.getTypeChecker();
    const [sourceFile] = program.getSourceFiles();
    const results: usableDeclaration[] = [];
    ts.forEachChild(sourceFile, node => visit(node, 'root', useful => results.push(useful)));
    return results;
};

