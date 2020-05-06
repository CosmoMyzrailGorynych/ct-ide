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
        } else if (way[0] === 'global') {
            root = global;
        } else {
            root = window;
        }
        way.shift();
        while (way.length > 1) {
            root = root[way[0]];
            way.shift();
        }
        if (e.target.type === 'checkbox') {
            val = e.target.checked;
        } else if (e.target.type === 'number' || e.target.type === 'range') {
            val = Number(e.target.value);
            if (e.target.hasAttribute('data-wired-force-minmax')) {
                val = Math.max(Number(e.target.min), Math.min(Number(e.target.max), val));
            }
        } else {
            val = e.target.value;
        }
        root[way[0]] = val;
        glob.modified = true;
        if (update && ('update' in that)) {
            that.update();
        }
        return val;
    };
    window.riotWired = {
        init() {
            this.wire = wire.bind(this, this);
        }
    };

    var voc = tag => {
        const updateLocales = () => {
            if (tag.namespace) {
                const way = tag.namespace.split(/(?<!\\)\./gi);
                for (let i = 0, l = way.length; i < l; i++) {
                    way[i] = way[i].replace(/\\./g, '.');
                }
                let space = window.languageJSON;
                for (const partial of way) {
                    space = space[partial];
                }
                tag.voc = space;
            }
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
