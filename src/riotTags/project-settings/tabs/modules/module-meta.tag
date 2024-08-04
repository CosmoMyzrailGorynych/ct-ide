module-meta(onclick="{toggleModule(opts.module.name)}" class="{opts.class} {dim: opts.module.manifest.main.deprecated}")
    .flexrow
        div
            h1.nmt
                svg.feather(if="{opts.module.manifest.main.icon}")
                    use(xlink:href="#{opts.module.manifest.main.icon}")
                | {localizeField(opts.module.manifest.main, 'name')}
            code
                | {opts.module.name} v{opts.module.manifest.main.version}
                |
                span(if="{opts.module.manifest.main.version.indexOf(0) === 0}") {voc.preview}

        label.nogrow.bigpower(class="{off: !(opts.module.name in window.currentProject.libs)}")
            svg.feather
                use(xlink:href="#{opts.module.name in window.currentProject.libs? 'check' : 'x'}")
            span
    .hsub(if="{opts.module.manifest.main.tagline}") {localizeField(opts.module.manifest.main, 'tagline')}

    div(if="{opts.module.manifest.dependencies && opts.module.manifest.dependencies.length}")
        b {voc.dependencies}
        .inlineblock(each="{dependency in opts.module.manifest.dependencies}")
            svg.feather(if="{dependency in window.currentProject.libs}").success
                use(xlink:href="#check")
            svg.feather(if="{!(dependency in window.currentProject.libs)}").error
                use(xlink:href="#alert-circle")
            span   {dependency}
    div(if="{opts.module.manifest.optionalDependencies && opts.module.manifest.optionalDependencies.length}")
        b {voc.optionalDependencies}
        .inlineblock(each="{dependency in opts.module.manifest.optionalDependencies}")
            svg.feather(if="{dependency in window.currentProject.libs}").success
                use(xlink:href="#check")
            svg.feather(if="{!(dependency in window.currentProject.libs)}").warning
                use(xlink:href="#alert-triangle")
            span   {dependency}

    .filler

    .flexrow
        span.nogrow.module-meta-aWarningIcon(title="{voc.deprecatedTooltip}" if="{opts.module.manifest.main.deprecated}")
            svg.feather.error
                use(xlink:href="#alert-circle")
        span.nogrow.module-meta-aWarningIcon(title="{voc.previewTooltip}" if="{opts.module.manifest.main.version.indexOf(0) === 0}")
            svg.feather.warning
                use(xlink:href="#alert-triangle")
        .aModuleAuthorList
            a.external(
                each="{author in opts.module.manifest.main.authors}"
                onclick="{stopPropagation}"
                title="{voc.author}"
                href="{author.site || 'mailto:'+author.mail}"
            )
                svg.feather
                    use(xlink:href="#user")
                span {author.name}
        svg.feather.aModuleIcon
            use(xlink:href="#{getIcon(opts.module)}")
    script.
        this.namespace = 'modules';
        this.mixin(require('src/lib/riotMixins/voc').default);

        const {getIcon, isModuleEnabled, enableModule, disableModule} = require('src/lib/resources/modules');

        this.getIcon = getIcon;

        const glob = require('src/lib/glob');

        this.toggleModule = () => async e => {
            e.stopPropagation();
            if (isModuleEnabled(this.opts.module.name)) {
                disableModule(this.opts.module.name);
            } else {
                await enableModule(this.opts.module.name);
            }
            window.signals.trigger('modulesChanged');
            glob.modified = true;
            this.update();
        };

        this.stopPropagation = e => {
            e.stopPropagation();
        };
