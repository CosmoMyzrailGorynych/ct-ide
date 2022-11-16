{
    /* eslint-disable no-underscore-dangle */
    // Allow for running under nodejs/requirejs in tests
    const _monaco = global.monaco;

    const thisProperties = [
        'x',
        'y',
        'xprev',
        'yprev',
        'xstart',
        'ystart',
        'speed',
        'gravity',
        'gravityDiv',
        'vspeed',
        'hspeed',
        'direction',
        'scale',
        'scale.x',
        'scale.y',
        'angle',
        'rotation',
        'tint',
        'alpha',
        'skew',
        'skew.x',
        'skew.y',
        'anchor',
        'anchor.x',
        'anchor.y',
        'pivot',
        'pivot.x',
        'pivot.y',
        'children',
        'depth',
        'animationSpeed',
        'autoUpdate',
        'blendMode',
        'buttonMode',
        'cacheAsBitmap',
        'filterArea',
        'filters',
        'height',
        'hitArea',
        'interactive',
        'interactiveChildren',
        'isMask',
        'isSprite',
        'localTransform',
        'loop',
        'mask',
        'name',
        'onComplete',
        'onFrameChange',
        'onLoop',
        'parent',
        'playing',
        'texture',
        'textures',
        'tex',
        'totalFrames',
        'transform',
        'visible',
        'width',
        'worldAlpha',
        'worldTransform',
        'worldVisible',
        'getBounds',
        'getChildAt',
        'getChildByName',
        'getChildIndex',
        'getGlobalPosition',
        'getLocalBounds',
        'gotoAndPlay',
        'gotoAndStop',
        'play',
        'removeChild',
        'removeChildAt',
        'removeChildren',
        'setChildIndex',
        'setParent',
        'setTransform',
        'sortChildren',
        'stop',
        'swapChildren',
        'toGlobal',
        'toLocal',
        'update',
        'updateTransform',
        'addChild',
        'addChildAt',
        'move()',
        'moveContinuous',
        'moveContinuousByAxes',
        'moveSmart',
        'moveBullet'
    ];

    const fs = require('fs-extra');
    const ctProps = [];

    const makeDoc = node => {
        let str = node.description;
        if (node.params && node.params.length) {
            str += '\n\n';
            str += node.params.map(p => `\`@param ${p.name} (${p?.type?.names[0] || 'any'})\` ${p.description || ''}`).join('\n');
        }
        if (node.returns && node.returns?.type?.names[0]) {
            str += '\n\n';
            str += `\`@returns (${node.returns.type.names[0]})\` ${node.returns.description || ''}`;
        }
        return str;
    };

    const jsdocToCompletionMap = {
        function: monaco.languages.CompletionItemKind.Method,
        member: monaco.languages.CompletionItemKind.Property,
        constant: monaco.languages.CompletionItemKind.Constant,
        namespace: monaco.languages.CompletionItemKind.Module,
        class: monaco.languages.CompletionItemKind.Class
    };

    fs.readJSON('./data/ctLibJSDocAst.json')
    .then(ast => {
        const ctAst = ast.filter(node => node.longname.startsWith('ct.'));
        for (const node of ctAst) {
            if (node.undocumented) {
                continue;
            }
            ctProps.push({
                name: node.name,
                ancestor: node.memberof,
                kind: jsdocToCompletionMap[node.kind] || monaco.languages.CompletionItemKind.Text,
                documentation: {
                    value: makeDoc(node)
                },
                type: node?.returns?.type?.names[0] || void 0
            });
        }
    });

    const propsSuggestions = thisProperties.map(str => ({
        label: str,
        kind: _monaco.languages.CompletionItemKind.Text,
        insertText: str
    }));

    /* eslint-disable no-template-curly-in-string */
    module.exports.atCompletions = {
        triggerCharacters: ['@', '.'],
        provideCompletionItems: (model, position) => {
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: 0,
                endColumn: position.column
            };
            const currentLine = model.getValueInRange(range);
            if (currentLine.endsWith('@') || currentLine.endsWith('this.')) {
                return {
                    suggestions: propsSuggestions.map(i => ({
                        ...i
                    }))
                };
            } else if (currentLine.endsWith('.')) {
                const ancestorLine = currentLine.slice(0, -1);
                const suggestions = [];
                for (const prop of ctProps) {
                    if (ancestorLine.endsWith(prop.ancestor)) {
                        suggestions.push({
                            label: prop.name,
                            insertText: prop.name,
                            detail: prop.type,
                            kind: prop.kind,
                            documentation: prop.documentation
                        });
                    }
                }
                return {
                    suggestions
                };
            }
            return {
                suggestions: []
            };
        }
    };
}
