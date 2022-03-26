if ((this instanceof ct.templates.Copy) && this.lightTexture) {
    this.light = ct.light.add(ct.res.getTexture(this.lightTexture, 0), this.x, this.y, {
        tint: ct.u.hexToPixi(this.lightColor || '#FFFFFF'),
        scaleFactor: this.lightScale === void 0 ? true : this.lightScale,
        copyOpacity: this.lightOpacity === void 0 ? true : this.lightOpacity,
        owner: this
    });
    this.light.scale.x = this.light.scale.y = this.lightScale || 1;
}
