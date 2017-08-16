(window => {
    var wire = field => e => {
        var way = field.split('.'),
            root, val;
        if (way[0] === 'this') {
            root = this;
        } else {
            root = window;
        }
        if (e.target.type === 'checkbox' ||
            e.target.type === 'radio') {
            val = e.target.checked;
        } else {
            val = e.target.value;
        }
        while (way.length > 1) {
            root = root[way[0]];
            root.shift();
        }
        root[way[0]] = val;
    };
    window.riotWired = {
        init() {
            this.wire = wire;
        }
    };
})(this);
