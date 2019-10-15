## Loading a story

### ct.yarn.openStory(data) ⇒ `YarnStory`

Opens the given JSON object and returns a YarnStory object, ready for playing.

### ct.yarn.openFromFile(data) ⇒ `Promise<YarnStory>`

Opens the given JSON object and returns a promise that resolves into a YarnStory.


## YarnStory
**Kind**: private class

### new YarnStory(data, [first])
Creates a new YarnStory


**Returns**: `YarnStory` - self

| Param | Type | Description |
| --- | --- | --- |
| data | `Object` | The exported, inlined Yarn's .json file |
| [first] | `String` | The starting node's name from which to run the story. Defaults to "Start" |


### yarnStory.text ⇒ `String` \| `Boolean`
Returns the current text line, including the character's name

**Kind**: instance property of `YarnStory`

**Returns**: `String` \| `Boolean` - Returns `false` if the current position is not a speech line,
     otherwise returns the current line.

### yarnStory.character ⇒ `Boolean` \| `String` \| `undefined`
Returns the character's name that says the current text line.
It is expected that your character's names will be in one word,
otherwise they will be detected as parts of the speech line.
E.g. `Cat: Hello!` will return `'Cat'`, but `Kitty cat: Hello!`
will return `undefined`.

**Kind**: instance property of `YarnStory`

**Returns**: `Boolean` \| `String` \| `undefined` - Returns `false` if the current position is not a speech line,
     `undefined` if the line does not have a character specified, and a string of your character
     if it was specified.

### yarnStory.body ⇒ `String` \| `Boolean`
Returns the the current text line, without a character.
It is expected that your character's names will be in one word,
otherwise they will be detected as parts of the speech line.
E.g. `Cat: Hello!` will return `'Cat'`, but `Kitty cat: Hello!`
will return `undefined`.

**Kind**: instance property of `YarnStory`

**Returns**: `String` \| `Boolean` - The speech line or `false` if the current position
     is not a speech line.

### yarnStory.title ⇒ `String`
Returns the title of the current node

**Kind**: instance property of `YarnStory`

**Returns**: `String` - The title of the current node

### yarnStory.command ⇒ `String` \| `Boolean`
Returns the current command

**Kind**: instance property of `YarnStory`

**Returns**: `String` \| `Boolean` - The current command, or `false` if the current
     position is not a command.

### yarnStory.tags ⇒ `String`
Returns the tags of the current node

**Kind**: instance property of `YarnStory`

**Returns**: `String` - The tags of the current node.

### yarnStory.options ⇒ `Array<String>`
Returns currently possible dialogue options, if there are any.

**Kind**: instance property of `YarnStory`

**Returns**: `Array<String>` - An array of possible dialogue lines.

### yarnStory.variables : `Object`
Current variables

**Kind**: instance property of `YarnStory`

### yarnStory.start() ⇒ `void`
Starts the story, essentially jumping to a starting node

**Kind**: instance method of `YarnStory`

### yarnStory.say(line) ⇒ `void`
"Says" the given option, advancing the story further on a taken branch, if this dialogue option exists.

**Kind**: instance method of `YarnStory`

| Param | Type | Description |
| --- | --- | --- |
| line | `String` | The line to say |


### yarnStory.jump(title) ⇒ `void`
Manually moves the story to a node with a given title

**Kind**: instance method of `YarnStory`

| Param | Type | Description |
| --- | --- | --- |
| title | `String` | The title of the needed node |


### yarnStory.back() ⇒ `void`
Moves back to the previous node, but just once

**Kind**: instance method of `YarnStory`

### yarnStory.next() ⇒ `void`
Naturally advances in the story, if no options are available

**Kind**: instance method of `YarnStory`


### yarnStory.nodes ⇒ `Object`

An object containing all the nodes in the story. Each key in this object stands for a node's title.

**Kind**: instance property of `YarnStory`

### yarnStory.visited(title) ⇒ `Boolean`
Checks whether a given node was visited

**Kind**: instance method of `YarnStory`

**Returns**: `Boolean` - Returns `true` if the specified node was visited, `false` otherwise.

| Param | Type | Description |
| --- | --- | --- |
| title | `String` | The node's title to check against |

## Events

You can listen to events by using `story.on('eventName', data => /* handler */)`.
For other event-related functions, see [PIXI.utils.EventEmitter](http://pixijs.download/release/docs/PIXI.utils.EventEmitter.html) as `YarnStory` extends this class. For examples, see the "Info" tab.

**Possible events:**

* `drained` — dispatched when the story has ended, either by the `<<stop>>` command or when nothing left to play.
* `newnode` — dispatched when the story switched to a new Yarn's node.
* `start` — called at the start of the story. Can be called more than once by calling `YarnStory.start()`.
* `command` — called when the story has advanced and faced a command.
* `options` — called when the story has advanced and faced a number of dialogue options.
* `text` — called when the story has advanced and returned a new dialogue line.
* `next` — called when the story advances in some way.