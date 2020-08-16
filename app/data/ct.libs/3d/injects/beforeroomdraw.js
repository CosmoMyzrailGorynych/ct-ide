if (this === ct.room) {
    for (const child of ct.camera3d.room.children) {
        child.distanceToCamera = child.getDepth();
    }
    ct.camera3d.room.children.sort(function sortByDepth(a, b) {
        return b.distanceToCamera - a.distanceToCamera;
    });
}
