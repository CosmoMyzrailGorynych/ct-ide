if (ct.sound.follow && !ct.sound.follow.kill) {
    ct.sound.howler.pos(ct.sound.follow.x, ct.sound.follow.y, ct.sound.useDepth ? ct.sound.follow.z : 0);
} else if (ct.sound.manageListenerPosition) {
    ct.sound.howler.pos(ct.camera.x, ct.camera.y, ct.camera.z || 0);
}
