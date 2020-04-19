room-type-picker.room-editor-TypeSwatches.tabbed.tall
    .aSearchWrap
        input.inline(type="text" onkeyup="{fuseSearch}" ref="fusesearch")
        svg.feather
            use(xlink:href="data/icons.svg#search")
    .room-editor-aTypeSwatch(
        if="{!searchResults}"
        onclick="{parent.roomUnpickType}"
        class="{active: opts.current === -1}"
    )
        span {voc.selectAndMove}
        svg.feather
            use(xlink:href="data/icons.svg#move")
    .room-editor-aTypeSwatch(
        each="{type in (searchResults? searchResults : types)}"
        title="{type.name}"
        onclick="{selectType(type)}"
        class="{active: parent.opts.current === type}"
    )
        span {type.name}
        img(
            src="{type.texture === -1? 'data/img/notexture.png' : (glob.texturemap[type.texture].src.split('?')[0] + '_prev.png?' + getTypeTextureRevision(type))}"
            draggable="false"
        )
    .room-editor-aTypeSwatch.filler
    .room-editor-aTypeSwatch.filler
    .room-editor-aTypeSwatch.filler
    .room-editor-aTypeSwatch.filler
    .room-editor-aTypeSwatch.filler
    .room-editor-aTypeSwatch.filler
    .room-editor-aTypeSwatch.filler

    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.namespace = 'roomview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.getTypeTextureRevision = type => glob.texturemap[type.texture].g.lastmod;

        this.updateTypeList = () => {
            this.types = [...global.currentProject.types];
            this.types.sort((a, b) => a.name.localeCompare(b.name));
            this.fuseSearch();
        };
        var typesChanged = () => {
            this.updateTypeList();
            this.update();
        };
        window.signals.on('typesChanged', typesChanged);
        this.on('unmount', () => {
            window.signals.off('typesChanged', typesChanged);
        });
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
            var val = (e? e.target.value : this.refs.fusesearch.value).trim();
            if (val) {
                var fuse = new Fuse(this.types, fuseOptions);
                this.searchResults = fuse.search(val);
            } else {
                this.searchResults = null;
            }
        };
        this.selectType = type => e => {
            this.parent.currentType = type;
            this.parent.selectedCopies = false;
        };
        this.on('mount', this.updateTypeList);