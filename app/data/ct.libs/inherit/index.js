ct.inherit = {
    isChild(type, assertedType) {
        // Get type names from copies
        if (type instanceof Copy) {
            ({type} = type);
        }
        if (assertedType instanceof Copy) {
            assertedType = assertedType.type;
        }
        // Throw an error if a particular type does not exist.
        if (!(type in ct.types.templates)) {
            throw new Error(`[ct.inherit] The type ${type} does not exist. A typo?`);
        }
        if (!(assertedType in ct.types.templates)) {
            throw new Error(`[ct.inherit] The type ${assertedType} does not exist. A typo?`);
        }
        // Well, technically a type is not a child of itself, but I suppose you expect to get `true`
        // while checking whether a copy belongs to a particular class.
        if (type === assertedType) {
            return true;
        }
        let proposedType = ct.types.templates[type].extends.inheritedType;
        while (proposedType) {
            if (proposedType === assertedType) {
                return true;
            }
            proposedType = ct.types.templates[proposedType].extends.inheritedType;
        }
        return false;
    },
    isParent(type, assertedType) {
        return ct.inherit.isChild(assertedType, type);
    },
    list(type) {
        // Throw an error if a particular type does not exist.
        if (!(type in ct.types.templates)) {
            throw new Error(`[ct.inherit] The type ${type} does not exist. A typo?`);
        }

        // Get a list of all child types to concat their ct.types.lists in one go
        const types = [];
        for (const i in ct.types.list) {
            if (i !== 'BACKGROUND' && i !== 'TILELAYER' && ct.inherit.isParent(type, i)) {
                types.push(i);
            }
        }

        return [].concat(...types.map(t => ct.types.list[t]));
    }
};
