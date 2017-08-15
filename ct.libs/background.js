/***************************************
        [ background cotomod ]
    [(c) Cosmo Myzrail Gorynych]
***************************************/

ct.background = {
  'types': { },
  'pattern': function (name,gxname) {
    var c = document.createElement('canvas');
    c.width = ct.graphs[gxname].width;
    c.height = ct.graphs[gxname].height;
    var cc = c.getContext('2d');
    cc.drawImage(ct.graphs[gxname].atlas,ct.graphs[gxname].frames[0][0],ct.graphs[gxname].frames[0][1],ct.graphs[gxname].width,ct.graphs[gxname].height,0,0,ct.graphs[gxname].width,ct.graphs[gxname].height);
    var pat = ct.x.createPattern(c,"repeat");
    pat.method = 'pattern';
    pat.width = c.width;
    pat.height = c.height;
    ct.background.types[name] = pat;
  },
  'solid': function (name,color) {
    var pat = color;
    pat.method = 'solid';
    ct.background.types[name] = pat;
  },
  'add': function (name,depth) {
      var copy = {
      type: 'BACKGROUND',
      events: function () {
        var m = ct.x.fillStyle;
        ct.x.fillStyle = ct.background.types[this.link];
        ct.x.save();
        ct.x.translate(-ct.rooms.current.x,-ct.rooms.current.y)
        ct.x.fillRect(ct.rooms.current.x,ct.rooms.current.y,ct.width,ct.height);
        ct.x.restore();
        ct.x.fillStyle = m;
      },
      'link': name,
      'depth': depth
    };
    ct.stack.push(copy);
  },
};

ct.libs += ' background';