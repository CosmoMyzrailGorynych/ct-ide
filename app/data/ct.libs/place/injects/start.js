Object.defineProperty(ct.types.Copy.prototype, 'ctype', {
    set: function (value) {
        this.$ctype = value;
    },
    get: function () {
        return this.$ctype;
    }
});
Object.defineProperty(ct.types.Copy.prototype, 'moveContinuous', {
    value: function (ctype, precision) {
        if (this.gravity) {
            this.hspeed += this.gravity * ct.delta * Math.cos(this.gravityDir * Math.PI / 180);
            this.vspeed += this.gravity * ct.delta * Math.sin(this.gravityDir * Math.PI / 180);
        }
        return ct.place.moveAlong(this, this.direction, this.speed * ct.delta, ctype, precision);
    }
});

Object.defineProperty(ct.types.Copy.prototype, 'moveContinuousByAxes', {
    value: function (ctype, precision) {
        if (this.gravity) {
            this.hspeed += this.gravity * ct.delta * Math.cos(this.gravityDir * Math.PI / 180);
            this.vspeed += this.gravity * ct.delta * Math.sin(this.gravityDir * Math.PI / 180);
        }
        return ct.place.moveByAxes(
            this,
            this.hspeed * ct.delta,
            this.vspeed * ct.delta,
            ctype,
            precision
        );
    }
});
