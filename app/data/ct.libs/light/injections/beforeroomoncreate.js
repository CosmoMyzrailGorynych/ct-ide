if (this === rooms.current) {
    light.clear();
    light.ambientColor =u.hexToPixi(rooms.current.lightAmbientColor || '#FFFFFF');
}
