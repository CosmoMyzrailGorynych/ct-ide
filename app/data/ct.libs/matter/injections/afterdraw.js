if (this.matterEnable) {
    this.rotation = this.matterBody.angle;
    this.x = this.matterBody.position.x;
    this.y = this.matterBody.position.y;
    //this.speed = this.matterBody.speed;
    this.hspeed = this.matterBody.velocity.x;
    this.vspeed = this.matterBody.velocity.y;
    //this.direction = u.pdn(this.hspeed, this.vspeed);
}
