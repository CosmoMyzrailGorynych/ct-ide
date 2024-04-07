const blocks: (IBlockCommandDeclaration | IBlockComputedDeclaration)[] = [];

for (const method of ['log', 'warn', 'error']) {
    blocks.push({
        name: `Console ${method}`,
        type: 'command',
        code: method,
        icon: 'terminal',
        jsTemplate: (values) => `console.${method}(${values.any})`,
        lib: 'core.console',
        i18nKey: `console ${method}`,
        pieces: [{
            type: 'argument',
            key: 'any',
            typeHint: 'wildcard'
        }]
    });
}

export default blocks;
