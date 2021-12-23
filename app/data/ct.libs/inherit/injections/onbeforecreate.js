if ((this instanceof ct.templates.Copy) && this.inheritedTemplate) {
    this.inherit = {
        onCreate: () => {
            const oldTemplate = this.template,
                  oldInherited = this.inheritedTemplate;
            this.template = this.inheritedTemplate;
            this.inheritedTemplate = ct.templates.templates[this.inheritedTemplate].extends.inheritedTemplate;
            ct.templates.templates[oldInherited].onCreate.apply(this);
            this.template = oldTemplate;
            this.inheritedTemplate = oldInherited;
        },
        onStep: () => {
            const oldTemplate = this.template,
                  oldInherited = this.inheritedTemplate;
            this.template = this.inheritedTemplate;
            this.inheritedTemplate = ct.templates.templates[this.inheritedTemplate].extends.inheritedTemplate;
            ct.templates.templates[oldInherited].onStep.apply(this);
            this.template = oldTemplate;
            this.inheritedTemplate = oldInherited;
        },
        onDraw: () => {
            const oldTemplate = this.template,
                  oldInherited = this.inheritedTemplate;
            this.template = this.inheritedTemplate;
            this.inheritedTemplate = ct.templates.templates[this.inheritedTemplate].extends.inheritedTemplate;
            ct.templates.templates[oldInherited].onDraw.apply(this);
            this.template = oldTemplate;
            this.inheritedTemplate = oldInherited;
        },
        onDestroy: () => {
            const oldTemplate = this.template,
                  oldInherited = this.inheritedTemplate;
            this.template = this.inheritedTemplate;
            this.inheritedTemplate = ct.templates.templates[this.inheritedTemplate].extends.inheritedTemplate;
            ct.templates.templates[oldInherited].onDestroy.apply(this);
            this.template = oldTemplate;
            this.inheritedTemplate = oldInherited;
        }
    };
}
