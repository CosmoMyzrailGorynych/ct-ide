ct.pointer.updateGestures();
{
    const positionGame = ct.u.uiToGameCoord(ct.pointer.xui, ct.pointer.yui);
    ct.pointer.x = positionGame.x;
    ct.pointer.y = positionGame.y;
}
