content-settings
    docs-shortcut.toright(path="/content-subsystem.html")
    h1 {voc.heading}
    button(onclick="{addContentType}" if="{contentTypes.length}")
        svg.feather
            use(xlink:href="#plus")
        span {voc.addContentType}

    // References to `this` get weird here.
    // See https://v3.riotjs.vercel.app/api/#yield-and-loops
    collapsible-section.aPanel(each="{type in contentTypes}" contentType="{type}")
        yield(to="header")
            h3
                svg.feather
                    use(xlink:href="#{type.icon || 'copy'}")
                | {type.readableName || type.name || parent.voc.missingTypeName}
                | (
                code {type.name}
                | )
        extensions-editor(customextends="{parent.extends}" entity="{type}" compact="true" onchanged="{() => this.update()}")
        p
        button(onclick="{parent.gotoEntries(type)}")
            svg.feather
                use(xlink:href="#arrow-right")
            span {parent.voc.gotoEntries}
        button(onclick="{parent.confirmDeletion}")
            svg.feather
                use(xlink:href="#trash")
            span {parent.voc.deleteContentType}
    p
    button(onclick="{addContentType}")
        svg.feather
            use(xlink:href="#plus")
        span {voc.addContentType}
    script.
        this.namespace = 'settings.content';
        this.mixin(window.riotVoc);
        window.currentProject.contentTypes = window.currentProject.contentTypes || [];
        this.contentTypes = window.currentProject.contentTypes;

        this.extends = [{
            name: this.voc.typeName,
            type: 'text',
            key: 'name',
            help: this.voc.typeNameHint,
            required: true
        }, {
            name: this.voc.typeReadableName,
            type: 'text',
            key: 'readableName',
            help: this.voc.typeReadableNameHint
        }, {
            name: this.voc.icon,
            type: 'icon',
            key: 'icon',
            default: 'copy'
        }, {
            name: this.voc.typeSpecification,
            type: 'table',
            key: 'specification',
            fields: [{
                name: this.voc.fieldName,
                type: 'text',
                key: 'name',
                help: this.voc.fieldNameHint
            }, {
                name: this.voc.fieldReadableName,
                type: 'text',
                key: 'readableName',
                help: this.voc.fieldReadableNameHint
            }, {
                name: this.voc.fieldType,
                type: 'select',
                key: 'type',
                options: ['text', 'textfield', 'code', '', 'number', 'sliderAndNumber', 'point2D', '', 'texture', 'template', 'sound', 'room', 'tandem', '', 'checkbox', 'color'].map(type => ({
                    name: this.vocGlob.fieldTypes[type] || '',
                    value: type
                })),
                default: 'text'
            }, {
                name: this.vocGlob.required,
                type: 'checkbox',
                key: 'required',
                default: false
            }, {
                name: this.voc.array,
                type: 'checkbox',
                key: 'array',
                default: false
            }]
        }];

        this.addContentType = () => {
            this.contentTypes.push({
                name: '',
                readableName: '',
                entries: [],
                specification: []
            });
            window.signals.trigger('contentTypeCreated');
        };

        this.confirmDeletion = e => {
            window.alertify.confirm(this.voc.confirmDeletionMessage)
            .then(a => {
                if (a.buttonClicked === 'ok') {
                    const type = this.contentTypes.indexOf(e.item.type);
                    this.contentTypes.splice(type, 1);
                    this.update();
                }
            });
        };

        this.gotoEntries = contentType => () => {
            window.orders.trigger('openContentEntries', contentType);
        };
