if ((this instanceof ct.templates.Copy) && this.lightTexture) {
    this.updateTransform();
    ct.light.updateOne(this.light);
}
