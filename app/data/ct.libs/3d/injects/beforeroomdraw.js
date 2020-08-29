if (this === ct.room) {
    for (const child of ct.camera3d.room.children) {
        child.distanceToCamera = child.getDepth();
    }
    ct.camera3d.room.children.sort(function sortByDepth(a, b) {
        return b.distanceToCamera - a.distanceToCamera;
    });
    if (ct.camera3d.follow) {
        const {follow} = ct.camera3d;
        ct.camera3d.position3d.set(
            follow.x + ct.camera3d.shiftX,
            follow.y + ct.camera3d.shiftY,
            follow.z + ct.camera3d.shiftZ
        );
    }
}
