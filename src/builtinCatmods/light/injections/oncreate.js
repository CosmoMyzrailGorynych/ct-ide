if (templates.isCopy(this) && this.lightTexture) {
    this.updateTransform();
    light.updateOne(this.light);
}
