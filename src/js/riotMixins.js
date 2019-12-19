(function () {
    const glob = require('./data/node_requires/glob');
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
        glob.modified = true;
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
        const way = tag.namespace.split(/(?<!\\)\./gi);
        for (let i = 0, l = way.length; i < l; i++) {
            way[i] = way[i].replace(/\\./g, '.');
        }
        const updateLocales = () => {
            let space = window.languageJSON;
            for (const partial of way) {
                space = space[partial];
            }
            tag.voc = space;
            tag.vocGlob = window.languageJSON.common;
        };
        updateLocales();
        window.signals.on('updateLocales', updateLocales);
        tag.on('unmount', () => {
            window.signals.off('updateLocales', updateLocales);
        });
    };
    window.riotVoc = {
        init() {
            voc(this);
        }
    };

    var niceTime = function(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const today = new Date();
        if (date.getDate() !== today.getDate() ||
            date.getFullYear() !== today.getFullYear() ||
            date.getMonth() !== today.getMonth()
        ) {
            return date.toLocaleDateString();
        }
        return date.toLocaleTimeString();
    };
    window.riotNiceTime = {
        init() {
            this.niceTime = niceTime;
        }
    };
})();
