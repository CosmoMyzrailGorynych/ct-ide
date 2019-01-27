ct.touch.pressed.length = 0;
ct.touch.released.length = 0;
for (const touch of ct.touch.down) {
    touch.xprev = touch.x;
    touch.yprev = touch.y;
}
