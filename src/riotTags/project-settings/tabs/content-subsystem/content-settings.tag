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
        this.mixin(require('./data/node_requires/riotMixins/voc').default);
        window.currentProject.contentTypes = window.currentProject.contentTypes || [];
        this.contentTypes = window.currentProject.contentTypes;

        this.extends = require('./data/node_requires/resources/content').getExtends();

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
