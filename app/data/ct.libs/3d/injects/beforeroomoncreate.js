if (ct.camera3d) {
    ct.camera3d.destroy();
}
ct.camera3d = new PIXI.projection.Camera3d();
// Disable alignment by 2D camera
ct.camera3d.isUi = true;
ct.camera3d.position.set(ct.camera.width / 2, ct.camera.height / 2);
ct.camera3d.position3d.set(ct.camera.width / 2, ct.camera.height / 2, ct.room.threeDCameraZ);
ct.camera3d.follow = null;
ct.camera3d.shiftX = ct.camera3d.shiftY = ct.camera3d.shiftY = 0;
console.log('heyoo');
ct.camera3d.setPlanes(1000, 10, 10000, false);
ct.pixiApp.stage.addChild(ct.camera3d);
ct.camera3d.room = new PIXI.projection.Container3d();
ct.camera3d.addChild(ct.camera3d.room);
