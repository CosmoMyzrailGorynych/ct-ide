(window => {
    var wire = (that, field, update) => e => {
        var way = field.split(/(?<!\\)\./gi),
            root, val;
        for (let i = 0, l = way.length; i < l; i++) {
            way[i] = way[i].replace(/\\./g, '.');
        }
        if (way[0] === 'this') {
            root = that;
        } else {
            root = window;
        }
        way.shift();
        if (e.target.type === 'checkbox') {
            val = e.target.checked;
        } else if (e.target.type === 'number') {
            val = Number(e.target.value);
        } else {
            val = e.target.value;
        }
        while (way.length > 1) {
            root = root[way[0]];
            way.shift();
        }
        root[way[0]] = val;
        window.glob.modified = true;
        if (update && ('update' in that)) {
            that.update();
        }
    };
    window.riotWired = {
        init() {
            this.wire = wire.bind(this, this);
        }
    };

    var voc = tag => {
        tag.vocGlob = window.languageJSON.common;
        tag.voc = window.languageJSON[tag.namespace];
        window.signals.on('updateLocales', () => {
            tag.voc = window.languageJSON[tag.namespace];
            tag.vocGlob = window.languageJSON.common;
        });
    };
    window.riotVoc = {
        init() {
            voc(this);
        }
    };
})(this);
