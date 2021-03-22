if ((this instanceof ct.types.Copy) && this.lightTexture) {
    this.updateTransform();
    ct.light.updateOne(this.light);
}
