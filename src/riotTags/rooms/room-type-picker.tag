room-template-picker.room-editor-TemplateSwatches.tabbed.tall
    .aSearchWrap
        input.inline(type="text" onkeyup="{fuseSearch}" ref="fusesearch")
        svg.feather
            use(xlink:href="#search")
    .room-editor-aTemplateSwatch(
        if="{!searchResults}"
        onclick="{parent.roomUnpickTemplate}"
        class="{active: opts.current === -1}"
    )
        span {voc.selectAndMove}
        svg.feather
            use(xlink:href="#move")
    .room-editor-aTemplateSwatch(
        each="{template in (searchResults? searchResults : templates)}"
        title="{template.name}"
        onclick="{selectTemplate(template)}"
        class="{active: parent.opts.current === template}"
    )
        span {template.name}
        img(
            src="{template.texture === -1? 'data/img/notexture.png' : (glob.texturemap[template.texture].src.split('?')[0] + '_prev.png?' + getTextureRevision(template))}"
            draggable="false"
        )
    .room-editor-aTemplateSwatch.filler
    .room-editor-aTemplateSwatch.filler
    .room-editor-aTemplateSwatch.filler
    .room-editor-aTemplateSwatch.filler
    .room-editor-aTemplateSwatch.filler
    .room-editor-aTemplateSwatch.filler
    .room-editor-aTemplateSwatch.filler

    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.namespace = 'roomView';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.getTextureRevision = template => glob.texturemap[template.texture].g.lastmod;

        const fuseOptions = {
            shouldSort: true,
            tokenize: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['name']
        };
        const Fuse = require('fuse.js');
        this.fuseSearch = e => {
            if (!this.mounted) {
                this.searchResults = null;
                return;
            }
            var val = (e ? e.target.value : this.refs.fusesearch.value).trim();
            if (val) {
                var fuse = new Fuse(this.templates, fuseOptions);
                this.searchResults = fuse.search(val);
            } else {
                this.searchResults = null;
            }
        };
        this.selectTemplate = template => () => {
            this.parent.currentTemplate = template;
            this.parent.selectedCopies = false;
        };

        this.updateTemplateList = () => {
            this.templates = [...global.currentProject.templates];
            this.templates.sort((a, b) => a.name.localeCompare(b.name));
            this.fuseSearch();
        };
        this.updateTemplateList();
        var templatesChanged = () => {
            this.updateTemplateList();
            this.update();
        };

        window.signals.on('templatesChanged', templatesChanged);
        this.on('unmount', () => {
            window.signals.off('templatesChanged', templatesChanged);
        });

        this.on('mount', () => {
            this.mounted = true;
        });
