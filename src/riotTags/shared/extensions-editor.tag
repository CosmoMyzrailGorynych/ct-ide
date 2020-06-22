//
    The tag shows editable extends for a given asset type.
    Will be an empty inline element if no suitable extends were found.

    @attribute entity (riot object)
        An object to which apply editing to.
    @attribute type (string, 'type'|'tileLayer')
        The type of the edited asset.

    @attribute [compact] (atomic)
        Whether to use a more compact layout, replacing full-text hints with icons
        and using more compact classes for fields.

    @attribute [customextends] (riot Array<object>)
        Instead of reading modules' directory, use these extends specification instead.
        Useful for quickly generating markup for built-in fields.

extensions-editor
    virtual(each="{ext in extensions}")
        label
            div(class="{parent.opts.compact ? 'flexrow' : 'block'}")
                input.nogrow(
                    type="checkbox"
                    value="{parent.opts.entity[ext.key] || ext.default}"
                    onchange="{wire('this.opts.entity.'+ ext.key)}"
                    if="{ext.type === 'checkbox'}"
                )
                b.nogrow {ext.name}
                b.nogrow(if="{ext.type !== 'checkbox'}") :
                .filler(if="{parent.opts.compact}")
                hover-hint(if="{ext.help && parent.opts.compact}" text="{ext.help}")
            input.wide(
                class="{compact: parent.opts.compact}"
                type="text"
                value="{parent.opts.entity[ext.key] || ext.default}"
                onchange="{wire('this.opts.entity.'+ ext.key)}"
                if="{ext.type === 'text'}"
            )
            input.wide(
                class="{compact: parent.opts.compact}"
                type="number"
                value="{parent.opts.entity[ext.key] || ext.default}"
                onchange="{wire('this.opts.entity.'+ ext.key)}"
                if="{ext.type === 'number'}"
            )
            .dim(if="{ext.help && !parent.opts.compact}") {ext.help}
    script.
        const libsDir = './data/ct.libs';
        const fs = require('fs-extra'),
              path = require('path');

        this.mixin(window.riotWired);

        this.extensions = [];
        this.refreshExtends = () => {
            if (this.opts.customextends) {
                this.extensions = this.opts.customextends;
                return;
            }

            this.extensions = [];

            for (const lib in global.currentProject.libs) {
                fs.readJSON(path.join(libsDir, lib, 'module.json'))
                .then(moduleJson => {
                    const key = this.opts.type + 'Extends';
                    if (key in moduleJson) {
                        this.extensions.push(...moduleJson[key]);
                    }
                    this.update();
                });
            }
        };
        window.signals.on('modulesChanged', this.refreshExtends);
        this.on('unmount', () => {
            window.signals.off('modulesChanged', this.refreshExtends);
        });
        this.refreshExtends();
