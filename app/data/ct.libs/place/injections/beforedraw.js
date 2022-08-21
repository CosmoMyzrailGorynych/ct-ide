if ([/*%debugMode%*/][0] && this instanceof ct.templates.Copy) {
    const inverse = this.transform.localTransform.clone().invert();
    this.$cDebugCollision.transform.setFromMatrix(inverse);
    this.$cDebugCollision.position.set(0, 0);
    this.$cDebugText.transform.setFromMatrix(inverse);
    this.$cDebugText.position.set(0, 0);

    const newtext = `Partitions: ${this.$chashes.join(', ')}
CGroup: ${this.cgroup || 'unset'}
Shape: ${(this._shape && this._shape.__type) || 'unused'}`;
    if (this.$cDebugText.text !== newtext) {
        this.$cDebugText.text = newtext;
    }
    this.$cDebugCollision
    .clear();
    ct.place.drawDebugGraphic.apply(this);
    this.$cHadCollision = false;
}
