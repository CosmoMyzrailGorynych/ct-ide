if (this.threeDEnabled) {
    this.convertTo3d();
    if (this.threeDOrientation === 'xPositive') {
        this.euler.y = Math.PI / 2;
    } else if (this.threeDOrientation === 'xNegative') {
        this.euler.y = -Math.PI / 2;
    } else if (this.threeDOrientation === 'yPositive') {
        this.euler.x = Math.PI / 2;
    } else if (this.threeDOrientation === 'yNegative') {
        this.euler.x = -Math.PI / 2;
    } else if (this.threeDOrientation === 'zNegative') {
        this.euler.x = Math.PI;
    } else {
        this.euler.x = ct.camera3d.euler.x;
        this.euler.y = ct.camera3d.euler.y;
        this.euler.z = ct.camera3d.euler.z;
    }
    if (!ct.room.threeDFlipYZ) {
        this.position3d.set(this.x, this.y, -this.depth);
    } else {
        this.position3d.set(this.x, -this.depth, this.y);
    }
    this.position.set(0);
}
