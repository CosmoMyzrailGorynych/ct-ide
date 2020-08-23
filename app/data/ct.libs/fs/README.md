A module that provides a uniform API for storing and loading data for games exported for desktop.

It allows you to easily save and load JSON objects, as well as plain text data.

[JSON objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) are regular JavaScript objects, but without functions, Date objects, RegExps, circular references, and some other advanced stuff. If your variable consists of other objects, arrays, strings, numbers and boolean, it can be safely stored, and loaded later in the same form. Thus, they are great for saving your game state.

By default, all file operations will be done under the application data directory on the player's system. For Windows this will be `%AppData%`, Linux will be `$XDG_DATA_HOME` (or `$HOME/.local/share` if unset), and macOS will be `$HOME/Library/Application Support`. For other operating systems, the player's home directory will be used instead.

Within the application directory, ct.js will create a path using the defined Author Name and Project Name. If both are set, then the path would be `${Application Data Path}/${Author Name}/${Project Name}`, if only the Project Name is set, it would be `${Application Data Path}/${Project Name}`.

> **For Example**: If a player with the name `naturecodevoid` was running the game `jettyCat` by `comigo` on Linux, the default directory would be:
 `/home/naturecodevoid/.local/share/comigo/jettyCat`

 You can verify this by calling `ct.fs.getPath('')` or by checking the variable `ct.fs.gameFolder`.

It is not recommended, but you can set `ct.fs.gameFolder` to a different directory. This is useful if your meta fields (Author Name, Project Name) have changed, but you wish to preserve user data.

Also to note, operations outside of the game folder are not recommended and by default are not allowed, causing an error to appear in the game's console. To allow operations outside of the game folder set `ct.fs.forceLocal` to `false` first.

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