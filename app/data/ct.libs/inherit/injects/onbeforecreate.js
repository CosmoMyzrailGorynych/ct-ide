if ((this instanceof ct.types.Copy) && this.inheritedType) {
    this.inherit = {
        onCreate: () => {
            const oldType = this.type,
                  oldInherited = this.inheritedType;
            this.type = this.inheritedType;
            this.inheritedType = ct.types.templates[this.inheritedType].extends.inheritedType;
            ct.types.templates[oldInherited].onCreate.apply(this);
            this.type = oldType;
            this.inheritedType = oldInherited;
        },
        onStep: () => {
            const oldType = this.type,
                  oldInherited = this.inheritedType;
            this.type = this.inheritedType;
            this.inheritedType = ct.types.templates[this.inheritedType].extends.inheritedType;
            ct.types.templates[oldInherited].onStep.apply(this);
            this.type = oldType;
            this.inheritedType = oldInherited;
        },
        onDraw: () => {
            const oldType = this.type,
                  oldInherited = this.inheritedType;
            this.type = this.inheritedType;
            this.inheritedType = ct.types.templates[this.inheritedType].extends.inheritedType;
            ct.types.templates[oldInherited].onDraw.apply(this);
            this.type = oldType;
            this.inheritedType = oldInherited;
        },
        onDestroy: () => {
            const oldType = this.type,
                  oldInherited = this.inheritedType;
            this.type = this.inheritedType;
            this.inheritedType = ct.types.templates[this.inheritedType].extends.inheritedType;
            ct.types.templates[oldInherited].onDestroy.apply(this);
            this.type = oldType;
            this.inheritedType = oldInherited;
        }
    };
}
