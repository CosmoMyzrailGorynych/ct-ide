
# Multiplayer in ct.js!
This is a catmod to enable the use of the [Nakama JS Client library](https://heroiclabs.com/docs/javascript-client-guide/) into the [ct.js game engine](https://ctjs.rocks/). You can now build a fully scalable multiplayer game all with the amazing tools ct.js provides!

Nakama makes it possible to create virtually any type of multiplayer experience you desire. Here are some of its features:

 - Low latency realtime engine
 - Server-authoritative multiplayer
 - Match listing and lobby rooms
 - Leaderboards
 - Social sign-in: Facebook, Google, and more
 - Realtime, room-based, persisted chat channels
 - [And a lot more!](https://heroiclabs.com/)

## Video Tutorial Series!
[![image](https://user-images.githubusercontent.com/10382821/109438818-7af12480-7a23-11eb-8752-f67d6c42a44c.png)](https://www.youtube.com/watch?v=Glo9t3TV1vg&list=PLOoNs4RDYDKDtF5LO-LwuJiRD6m81rI8e
)
(image will take you to YouTube once clicked)

## Notice:
This catmod is still in the very early stages of development.  **It is not production ready!** I plan to create documentation, examples and a tutorial series to go through how to use this library all in the near future once the codebase gets stable.

Any feedback is welcome and I am super excited to what we can build with this. 

## Getting Started:

1. You'll need a [local instance of a Nakama server](https://heroiclabs.com/docs/nakama-download/) before you begin.
2. Download the [latest release](https://github.com/alexandargyurov/ct.nakama/releases) of this catmod.
3. Import the module into ct.js in the `Catmods` section.
4. You should be all set! 🚀


## Example Usage:
⚠️ Not all properties and functions have been documented! 

You can access the global variable called `Nakama` anywhere in ct.js. This is the class which provides you with all the functionality of Nakama.

|Property|Description|
|--|--|
|`Nakama.client`  |Returns the client|
|`Nakama.session`| Returns the current client session
|`Nakama.socket`  |Returns the current socket connection to the server|
|`Nakama.state`  |Returns the current state, defaults to an empty object. Useful for storing current players and other global objects.|

### Create a match
From https://heroiclabs.com/docs/gameplay-multiplayer-realtime/#create-a-match
```
let response = await Nakama.socket.createMatch();
console.log("Created match with ID:", response.match.match_id);
```

### Join a match
From https://heroiclabs.com/docs/gameplay-multiplayer-realtime/#join-a-match
```
let id = "<matchid>";
let match = await Nakama.socket.joinMatch(id);
Nakama.state.players = match.presences

Nakama.state.players.forEach((opponent) => {
  console.log("User id %o, username %o.", opponent.user_id, opponent.username);
});
```
## Useful Links

https://github.com/heroiclabs/nakama-js

https://heroiclabs.com/docs/

## Getting Help
Please open any issue such as bugs 🐛 or feature requests ✨ on GitHub. You can find me on the [ct.js Discord](https://discord.gg/Egwh9ETmJF) as well if you want to chat :)

## Contributing 
All contribution is welcome. Like I mentioned, this is still in the early days of a development, there's no roadmap, no planned features, just me working on it as I go along. 

If you'd like to build this yourself:
 1. Clone the repo
 2. `npm install`
 3. `npm build`
 5. A `dist` folder gets created with a zip for ct.js (you might need to create the dist folder in advance)

## Licensing
As the [heroiclabs/nakama-js](https://github.com/heroiclabs/nakama-js) is under the Apache License 2.0, this library also falls under the Apache-2 License.
