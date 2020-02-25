A module that provides a uniform API for storing and loading data for your desktop games.

It allows you to easily save and load JSON objects, as well as plain text data.

JSON objects are regular JavaScript objects, but without functions, Date objects, RegExps, circular references, and some other advanced stuff. If your variable consists of other objects, arrays, strings, numbers and boolean, it can be safely stored, and loaded later in the same form. Thus, they are great for saving your game state.

By default, all the file operations will be performed relative to a special directory created for your game, which is templated as a `${User's home directory}/${Author name from the settings tab}/${Project's name from the same tab}`, e.g. `/home/comigo/Cosmo Myzrail Gorynych/Platformer complete tutorial` on a Linux machine. You can inspect this behavior by calling `ct.fs.getPath(...)`, or simply by reading ct.fs.gameFolder parameter.

This behavior can be changed by setting `ct.fs.gameFolder`, but it's not recommended unless you changed your meta fields and need to preserved user's data.

Every action in `ct.fs` is asynchronous so that a game stays responsive even on heavy loads, and thus you have to use JS Promises. This is not hard, though:

```js
// Here we store an object in a JSON file.
ct.fs.save('savedGame.json', this.gameData)
.then(() => {
    // Here our operation has completed, we can add a feedback now
    ct.types.copy('GenericNotification', 20, 20, {
        message: 'Game saved!'
    });
});
// This line will execute before creating the notification,
// because everything inside `.then(...)` is asynchronous.
// The notification will still be spawned though the copy is deleted,
// because ct.fs is not dependant on gameplay entities.
this.kill = true;
```

## Determining if ct.fs is supported

Ct.fs is designed for use on desktop devices, and its methods won't work in browsers. You can check for `ct.fs.isAvailable` to determine what you can do:

```js
if (ct.fs.isAvailable) {
    // All is well, we have an access to the filesystem.
    ct.fs.save('saveData.cat', ct.game); // your file should not necessarily have `json` extension, btw ;)
} else {
    // File system is not available; we can add a fallback to a browser's local storage instead.
    // see https://docs.ctjs.rocks/localstorage.html
    localStorage.saveData = JSON.stringify(ct.game);
}
```

## Hints

* If you store all your game progression info in one object, you can make your whole save/load system in about 2-3 lines of code with `ct.fs.save` and `ct.fs.load`.
* You can't simply store copies inside a save file, but you can serialize them by using a bit of js magic:
  ```js
  const hero = ct.types.list['Hero'][0];
  const saveData = {
      hero: {
          x: hero.x,
          y: hero.y
      },
      enemies: []
  };
  for (const enemy of ct.types.list['Enemy']) {
      saveData.enemies.push({
          x: enemy.x,
          y: enemy.y,
          hp: enemy.hp
      });
  }
  ct.fs.save('savegame.json', saveData);

  // Later…

  ct.fs.load('savegame.json', saveData => {
      const hero = ct.types.list['Hero'][0];
      hero.x = saveData.hero.x;
      hero.y = saveData.hero.y;
      for (const enemy of saveData.enemies) {
          ct.types.copy('Enemy', enemy.x, enemy.y);
      }
  });
  ```