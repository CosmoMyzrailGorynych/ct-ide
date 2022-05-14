ct.inherit = {
    isChild(template, assertedTemplate) {
        // Get template names from copies
        if (template instanceof Copy) {
            ({template} = template);
        }
        if (assertedTemplate instanceof Copy) {
            assertedTemplate = assertedTemplate.template;
        }
        // Throw an error if a particular template does not exist.
        if (!(template in ct.templates.templates)) {
            throw new Error(`[ct.inherit] The template ${template} does not exist. A typo?`);
        }
        if (!(assertedTemplate in ct.templates.templates)) {
            throw new Error(`[ct.inherit] The template ${assertedTemplate} does not exist. A typo?`);
        }
        // Well, technically a template is not a child of itself,
        // but I suppose you expect to get `true`
        // while checking whether a copy belongs to a particular class.
        if (template === assertedTemplate) {
            return true;
        }
        let proposedTemplate = ct.templates.templates[template].extends.inheritedTemplate;
        while (proposedTemplate) {
            if (proposedTemplate === assertedTemplate) {
                return true;
            }
            proposedTemplate = ct.templates.templates[proposedTemplate].extends.inheritedTemplate;
        }
        return false;
    },
    isParent(template, assertedTemplate) {
        return ct.inherit.isChild(assertedTemplate, template);
    },
    list(template) {
        // Throw an error if a particular template does not exist.
        if (!(template in ct.templates.templates)) {
            throw new Error(`[ct.inherit] The template ${template} does not exist. A typo?`);
        }

        // Get a list of all child templates to concat their ct.templates.lists in one go
        const templates = [];
        for (const i in ct.templates.list) {
            if (i !== 'BACKGROUND' && i !== 'TILEMAP' && ct.inherit.isParent(template, i)) {
                templates.push(i);
            }
        }

        return [].concat(...templates.map(t => ct.templates.list[t]));
    }
};
