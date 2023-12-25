# General use of `gamedistribution`
An easy way to display `Game Distribution` Ads. 

## Catmods' settings -> Game Distribution

* GameID
* Auto init
* Localization of the Ads
* Enable GDPR
* Enable Debug, note you can enable debug in console just write `gdsdk.openConsole()` then the GD debug bar will appear, and it will keep showing until you delete the localStorage in your game.

## How do you use `gamedistribution`?

* To use it you need to init the `Game Distribution SDK`.

* You can do this from `Catmods' settings -> Game Distribution` and check `Auto init Game Distribution SDK`.

* If you prefer to initialize `Game Distribution SDK` manually you can add this code into a `custom script`.

### Init the Game Distribution SDK

!important: Make sure this runs only `one time`.

```js
gamedistribution.init();
```

### Show an Ad manually

Inside a `Click` event add this code:

```js
if (!gamedistribution.adPlaying) {
  gamedistribution.showAd();
}
```

* Now go to your `UI` room and add an event of `Ads` `Check if an Ads has finished`

* Inside the code and according to your game logic you can add something like this:

```js
rooms.current.coins +=1;
```
- This way you reward the player with 1 coin after the Ad has finished.

## Available methods

`gamedistribution.init();`
Initialize the Game distribution SDK, manually.

`gamedistribution.gdsdkReady()`
Check if Game distribution SDK, is ready to show Ads.

`gamedistribution.pauseGame()`
Used to pause the game.

`gamedistribution.resumeGame()`
Used to resume the game.

`gamedistribution.showAd();`
Is available when GD SDK is ready, so you can call this method in a button click of wherever you want but `make sure is called one time` 

`gamedistribution.isAdFinished();`
This method is the same as the event that you can add into the events editor in the room, according to the image we seen above.

## Available Variables 

* var isFinished: boolean; `Used to check if an Ad is completed.` 
* var isPaused: boolean; `Used to check if the game is paused or running.`
* var sdkReady: boolean; `Use to check if the Game Distribution SDK is ready to display Ads.`
* var adPlaying: boolean; `Used to check if an Ad is showing.`

### Game Distribution SDK

Check if the `Game Distribution SDK` is ready to display Ads.
```js
if (gamedistribution.sdkReady) {
        //Usually you don't need to use this method but in case you want.
        //Do something here...
}
```

### Ad has finished, completed.

In case you don't want to use the built-in `event` to check if the Ad has finished, you can use `gamedistribution.isFinished` in `OnStep` like:
```js
if(gamedistribution.isFinished){
    //Reward the player here
    this.coins +=1;
    gamedistribution.isFinished = false;
    gamedistribution.isPaused = false;
}
```
### Pause the game. Please make sure you mute the music and sounds otherwise Game Distribution is going to reject your game.

In some case you maybe want to pause the game manually do:
```js
if(!gamedistribution.isPaused){
        if (gamedistribution.adPlaying) {
            gamedistribution.isPaused = true;
            //Do something here...
        }
    }
```

### Resume the game after the Ad is completed. Remember to enable music and sounds.

In case you need to manually resume the game do:
```js
if(gamedistribution.isPaused){
  if (!gamedistribution.adPlaying) {
    gamedistribution.isPaused = false;
    //Do something
  }
}
```

### Show an Ad manually
Make sure this runs `one time` maybe with a `button click` or any event that triggers `only once`.
```js
if (!gamedistribution.adPlaying) {
  gamedistribution.showAd();
}
```


A mini tutorial is available here: https://www.youtube.com/watch?v=CO7kU1vkwXg and thats it...

Enjoy making money with Ads.

By Ulises Freitas.
