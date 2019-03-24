(function () {
    ct.vkeys = {
        button(options) {
            var opts = ct.u.ext({
                key: 'vkeys.Vk1',
                depth: 100,
                texNormal: -1,
                x: function() {
                    return ct.room.x + 128;
                },
                y: function() {
                    return ct.room.y + 128;
                }
            }, options || {});
            return ct.types.copy('VKEY', 0, 0, {
                opts: opts
            });
        }
    };
})();
