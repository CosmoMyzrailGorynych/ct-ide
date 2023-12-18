content-editor
    docs-shortcut.toright(path="/content-subsystem.html")
    h1 {contentType.readableName || contentType.name || voc.missingTypeName}
    extensions-editor(customextends="{extends}" entity="{contentType}")
    script.
        this.contentType = this.opts.contenttype;
        this.namespace = 'settings.content';
        this.mixin(require('./data/node_requires/riotMixins/voc').default);

        const {schemaToExtensions} = require('./data/node_requires/resources/content');

        this.makeExtends = () => {
            this.extends = [{
                name: this.voc.entries,
                key: 'entries',
                type: 'table',
                fields: schemaToExtensions(this.contentType.specification)
            }];
        };
        this.makeExtends();

        this.fixBrokenEntries = () => {
            for (const entry of this.contentType.entries) {
                for (const key in entry) {
                    const field = this.contentType.specification
                        .find(field => (field.name || field.readableName) === key);
                    if (!field) {
                        delete entry[key];
                        continue;
                    }
                }
                for (const field of this.contentType.specification) {
                    if (!entry[field.name || field.readableName] && field.array) {
                        entry[field.name || field.readableName] = [];
                    }
                }
            }
        };
        this.fixBrokenEntries();

        this.on('update', () => {
            if (this.contentType !== this.opts.contenttype) {
                this.contentType = this.opts.contenttype;
                this.makeExtends();
                this.fixBrokenEntries();
            }
        });
