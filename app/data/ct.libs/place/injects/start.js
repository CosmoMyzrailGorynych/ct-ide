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
Object.defineProperty(ct.types.Copy.prototype, 'moveContinuous', {
    value: function (ctype, precision) {
        if (this.gravity) {
            this.hspeed += this.gravity * ct.delta * Math.cos(this.gravityDir*Math.PI/-180);
            this.vspeed += this.gravity * ct.delta * Math.sin(this.gravityDir*Math.PI/-180);
        }
        return ct.place.moveAlong(this, this.direction, this.speed, ctype, precision);
    } 
});
