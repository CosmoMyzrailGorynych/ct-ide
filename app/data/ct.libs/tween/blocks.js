module.exports = [{
    name: 'Animate property',
    name_Ru: 'Анимировать свойство',
    displayName: 'Animate object\'s',
    displayName_Ru: 'Анимировать у объекта',
    type: 'command',
    code: 'animate',
    pieces: [{
        type: 'argument',
        key: 'target',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'property',
        i18nKey: 'property'
    }, {
        type: 'argument',
        key: 'property',
        typeHint: 'string',
        required: true
    }, {
        type: 'label',
        name: 'to',
        i18nKey: 'toDestination'
    }, {
        type: 'argument',
        key: 'value',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'for',
        i18nKey: 'forDuring'
    }, {
        type: 'argument',
        key: 'duration',
        typeHint: 'number',
        required: true,
        defaultConstant: '1000'
    }, {
        type: 'asyncMarker'
    }, {
        type: 'break'
    }, {
        type: 'icon',
        icon: 'redo'
    }, {
        type: 'label',
        name: 'then',
        i18nKey: 'then'
    }, {
        type: 'blocks',
        placeholder: 'do nothing',
        key: 'then'
    }, {
        type: 'icon',
        icon: 'alert-octagon'
    }, {
        type: 'label',
        name: 'catch',
        i18nKey: 'catch'
    }, {
        type: 'blocks',
        placeholder: 'do nothing',
        key: 'catch'
    }, {
        type: 'options',
        options: [{
            key: 'curve',
            name: 'curve',
            name_Ru: 'Кривая',
            typeHint: 'wildcard'
        }]
    }],
    jsTemplate: values => `
        tween.add({
            obj: ${values.target},
            duration: ${values.duration},
            fields: {
                ${values.property}: ${values.value}
            }
        }).then(() => {
            ${values.then}
        }).catch(() => {
            ${values.catch}
        });
    `
}, {
    name: 'Animate scale',
    name_Ru: 'Анимировать размер',
    displayName: 'Animate object\'s',
    displayName_Ru: 'Анимировать у объекта',
    type: 'command',
    code: 'animate scale',
    pieces: [{
        type: 'argument',
        key: 'target',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'scale',
        i18nKey: 'scale'
    }, {
        type: 'label',
        name: 'to',
        i18nKey: 'toDestination'
    }, {
        type: 'argument',
        key: 'x',
        typeHint: 'number',
        required: true
    }, {
        type: 'argument',
        key: 'y',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'for',
        i18nKey: 'forDuring'
    }, {
        type: 'argument',
        key: 'duration',
        typeHint: 'number',
        required: true,
        defaultConstant: '1000'
    }, {
        type: 'asyncMarker'
    }, {
        type: 'break'
    }, {
        type: 'icon',
        icon: 'redo'
    }, {
        type: 'label',
        name: 'then',
        i18nKey: 'then'
    }, {
        type: 'blocks',
        placeholder: 'do nothing',
        key: 'then'
    }, {
        type: 'icon',
        icon: 'alert-octagon'
    }, {
        type: 'label',
        name: 'catch',
        i18nKey: 'catch'
    }, {
        type: 'blocks',
        placeholder: 'do nothing',
        key: 'catch'
    }, {
        type: 'options',
        options: [{
            key: 'curve',
            name: 'curve',
            name_Ru: 'Кривая',
            typeHint: 'wildcard'
        }]
    }],
    jsTemplate: values => `
        tween.add({
            obj: ${values.target}.scale,
            duration: ${values.duration},
            fields: {
                x: ${values.x},
                y: ${values.y}
            }
        }).then(() => {
            ${values.then}
        }).catch(() => {
            ${values.catch}
        });
    `
}, {
    name: 'Animate position',
    name_Ru: 'Анимировать расположение',
    displayName: 'Animate object\'s',
    displayName_Ru: 'Анимировать у объекта',
    type: 'command',
    code: 'animate position',
    pieces: [{
        type: 'argument',
        key: 'target',
        typeHint: 'wildcard',
        required: true
    }, {
        type: 'label',
        name: 'position',
        i18nKey: 'position'
    }, {
        type: 'label',
        name: 'to',
        i18nKey: 'toDestination'
    }, {
        type: 'argument',
        key: 'x',
        typeHint: 'number',
        required: true
    }, {
        type: 'argument',
        key: 'y',
        typeHint: 'number',
        required: true
    }, {
        type: 'label',
        name: 'for',
        i18nKey: 'forDuring'
    }, {
        type: 'argument',
        key: 'duration',
        typeHint: 'number',
        required: true,
        defaultConstant: '1000'
    }, {
        type: 'asyncMarker'
    }, {
        type: 'break'
    }, {
        type: 'icon',
        icon: 'redo'
    }, {
        type: 'label',
        name: 'then',
        i18nKey: 'then'
    }, {
        type: 'blocks',
        placeholder: 'do nothing',
        key: 'then'
    }, {
        type: 'icon',
        icon: 'alert-octagon'
    }, {
        type: 'label',
        name: 'catch',
        i18nKey: 'catch'
    }, {
        type: 'blocks',
        placeholder: 'do nothing',
        key: 'catch'
    }, {
        type: 'options',
        options: [{
            key: 'curve',
            name: 'curve',
            name_Ru: 'Кривая',
            typeHint: 'wildcard'
        }]
    }],
    jsTemplate: values => `
        tween.add({
            obj: ${values.target},
            duration: ${values.duration},
            fields: {
                x: ${values.x},
                y: ${values.y}
            }
        }).then(() => {
            ${values.then}
        }).catch(() => {
            ${values.catch}
        });
    `
}];
