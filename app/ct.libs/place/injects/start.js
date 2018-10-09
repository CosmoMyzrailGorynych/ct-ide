
ct.place.ctypeCollections = {};
Object.defineProperty(ct.types.Copy.prototype, 'ctype', {
    set: function(value) {
        if (this.ctype) {
            ct.place.ctypeCollections[this.ctype].splice(ct.place.ctypeCollections[this.ctype].indexOf(this), 1);
        }
        if (value) {
            if (!(value in ct.place.ctypeCollections)) {
                ct.place.ctypeCollections[value] = [];
            }
            ct.place.ctypeCollections[value].push(this);
        }
        this.$ctype = value;
    },
    get: function() {
        return this.$ctype;
    }
});
