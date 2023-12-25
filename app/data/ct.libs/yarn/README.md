`yarn` is a tool to read Yarn projects and create dialogues/interactive fiction in your games. Under the hood, it uses [Bondage.js](https://github.com/hylyh/bondage.js) to parse Yarn syntax.

# Writing the story

Stories are better written with the Yarn Editor, which can be found [here](https://github.com/YarnSpinnerTool/YarnEditor), with its [online edit tool](https://yarnspinnertool.github.io/YarnEditor/).

See the [Yarn guide](https://github.com/YarnSpinnerTool/YarnSpinner/blob/master/Documentation/YarnSpinner-Dialogue/Yarn-Syntax.md) for nodes' syntax. When you're done, press File -> Save as JSON.

# Loading stories and working with them

Though there are tons of different methods and parameters to work with, you'll probably use just five of them to create your first interactive story. You can use a plain JSON object copy-pasted from Yarn Editor:

```js
var storyData = {/* Your exported yarn .json file */}
var story = yarn.openStory(storyData);
story.on('text', text => {
    // A new line appeared. Update UIs, create copies for blurbs, etc.
});
story.on('command', command => {
    // a command was called by a syntax `<<command>>` (you get the string without the <<chevrons>>)
});
story.on('options', options => {
    // here you get an array of strings your character can say. Use it to create reply buttons
});
rooms.current.story = story; // to use it later in UI and your game's logic
```

**OR** you can load from a file in your project folder -> includes:

```js
yarn.openFromFile('myStory.json')
.then(story => {
    rooms.current.story = story;
    story.on('text', text => {
        // A new line appeared. Update UIs, create copies for blurbs, etc.
    });
    story.on('command', command => {
        // a command was called by a syntax `<<command>>` (you get the string without the <<chevrons>>)
    });
    story.on('options', options => {
        // here you get an array of strings your character can say. Use it to create reply buttons
    });
});
```

To advance through your story, use `story.say('The answer')`:

```js
rooms.current.story.on('options', options => {
    for (const option of options) {
        templates.copy('SpeechButton', 0, 0, {
            option: option
        });
    }
});
// Later, in your button's click events:
rooms.current.story.say(this.option);
```

See the demo `yarn` in the `examples` folder for a full-featured dialogue system.


# Using functions

By default, `yarn` will execute the built-in Yarn's functions and statements, but there are also a couple of additional "magical" functions:

* `<<sound("Wzhooh")>>` to play 2D sounds;
* `<<room("ParkScene")>>` to switch to other rooms;
* `<<wait(3000)>>` to pause the execution for a given number of milliseconds.

These won't trigger the `command` or `next` events and will work automatically. You can disable this behavior and manage these commands by yourself by disabling "Use magic commands" in the Settings tab.
