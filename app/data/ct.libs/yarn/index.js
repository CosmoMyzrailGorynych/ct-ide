/* eslint-disable no-cond-assign */
/* global bondage */
(function () {
    const characterLine = /^(?:([\S]+):)?\s*([\s\S]+)/;
    const soundCall = /^sound\("([\s\S]*)"\)$/;
    const roomCall = /^room\("([\s\S]*)"\)$/;
    const waitCall = /^wait\(([0-9]+)\)$/;
    const playSound = function(sound) {
        if (!(sound in ct.res.sounds)) {
            console.error(`Skipping an attempt to play a non-existent sound ${sound} in a YarnStory`);
            return;
        }
        ct.sound.spawn(sound);
    };
    const switchRoom = function(room) {
        if (!(room in ct.rooms.templates)) {
            throw new Error(`An attempt to switch to a non-existent room ${room} in a YarnStory`);
        }
        ct.rooms.switch(room);
    };

    // Maybe it won't be needed someday
    /**
     * Parses "magic" functions and executes them
     *
     * @param {String} command A trimmed command string
     * @param {YarnStory} story The story that runs this command
     * @returns {Boolean|String} Returns `false` if no command was executied,
     *      `true` if a synchronous function was executed, and `"async"`
     *      if an asynchronous function was called.
     */
    const ctCommandParser = function(command, story) {
        if (soundCall.test(command)) {
            playSound(soundCall.exec(command)[1]);
            return true;
        } else if (roomCall.test(command)) {
            switchRoom(roomCall.exec(command)[1]);
            return true;
        } else if (waitCall.test(command)) {
            const ms = parseInt(waitCall.exec(command)[1], 10);
            if (!ms && ms !== 0) {
                throw Error(`Invalid command ${command}: wrong number format.`);
            }
            ct.u.waitUi(ms)
            .then(() => story.next());
            return 'async';
        }
        return false;
    };
    const extendWithCtFunctions = function(bondage) {
        const fs = bondage.functions;
        fs.sound = playSound;
        fs.room = switchRoom;
    };
    class YarnStory extends PIXI.utils.EventEmitter {
        /**
         * Creates a new YarnStory
         * @param {Object} data The exported, inlined Yarn's .json file
         * @param {String} [first] The starting node's name from which to run the story. Defaults to "Start"
         * @returns {YarnStory} self
         */
        constructor(data, first) {
            super();
            this.bondage = new bondage.Runner();
            extendWithCtFunctions(this.bondage);
            this.bondage.load(data);

            this.nodes = this.bondage.yarnNodes;
            this.startingNode = first? this.nodes[first] : this.nodes.Start;
        }

        /**
         * Starts the story, essentially jumping to a starting node
         * @returns {void}
         */
        start() {
            this.jump(this.startingNode.title);
            this.emit('start', this.scene);
        }
        /**
         * "Says" the given option, advancing the story further on a taken branch, if this dialogue option exists.
         * @param {String} line The line to say
         * @returns {void}
         */
        say(line) {
            const ind = this.options.indexOf(line);
            if (ind === -1) {
                throw new Error(`There is no line "${line}". Is it a typo?`);
            }
            this.currentStep.select(ind);
            this.next();
        }
        /**
         * Manually moves the story to a node with a given title
         *
         * @param {String} title The title of the needed node
         * @returns {void}
         */
        jump(title) {
            if (!(title in this.nodes)) {
                throw new Error(`Could not find a node called "${title}".`);
            }
            this.position = 0;
            this.scene = this.bondage.run(title);
            this.next();
        }
        /**
         * Moves back to the previous node, but just once
         *
         * @returns {void}
         */
        back() {
            this.jump(this.previousNode.title);
        }
        /**
         * Naturally advances in the story, if no options are available
         * @returns {void}
         */
        next() {
            this.currentStep = this.scene.next().value;
            if (this.currentStep instanceof bondage.TextResult ||
                this.currentStep instanceof bondage.CommandResult) {
                if (this.raw !== this.currentStep.data) {
                    this.previousNode = this.raw;
                    this.raw = this.currentStep.data;
                    this.emit('newnode', this.currentStep);
                }
            }
            if (this.currentStep) {
                if (this.currentStep instanceof bondage.TextResult) {
                    // Optionally, skip empty lines
                    if ([/*%skipEmpty%*/][0] && !this.text.trim()) {
                        this.next();
                        return;
                    }
                    this.emit('text', this.text);
                } else if (this.currentStep instanceof bondage.CommandResult) {
                    if ([/*%magic%*/][0]) {
                        const commandStatus = ctCommandParser(this.command.trim(), this);
                        if (commandStatus && commandStatus !== 'async') {
                            this.next(); // Automatically advance the story after magic commands
                            // Async commands should call `this.next()` by themselves
                            return;
                        } else if (commandStatus === 'async') {
                            return;
                        }
                    }
                    this.emit('command', this.command.trim());
                } else if (this.currentStep instanceof bondage.OptionsResult) {
                    this.emit('options', this.options);
                }
                this.emit('next', this.currentStep);
            } else {
                this.emit('drained', this.currentStep);
            }
        }

        /**
         * Returns the current text line, including the character's name
         *
         * @returns {String|Boolean} Returns `false` if the current position is not a speech line,
         *      otherwise returns the current line.
         */
        get text() {
            if (this.currentStep instanceof bondage.TextResult) {
                return this.currentStep.text;
            }
            return false;
        }
        /**
         * Returns the character's name that says the current text line.
         * It is expected that your character's names will be in one word,
         * otherwise they will be detected as parts of the speech line.
         * E.g. `Cat: Hello!` will return `'Cat'`, but `Kitty cat: Hello!`
         * will return `undefined`.
         *
         * @return {Boolean|String|undefined} Returns `false` if the current position is not a speech line,
         *      `undefined` if the line does not have a character specified, and a string of your character
         *      if it was specified.
         */
        get character() {
            return this.text && characterLine.exec(this.text)[1];
        }

        /**
         * Returns the the current text line, without a character.
         * It is expected that your character's names will be in one word,
         * otherwise they will be detected as parts of the speech line.
         * E.g. `Cat: Hello!` will return `'Cat'`, but `Kitty cat: Hello!`
         * will return `undefined`.
         *
         * @return {String|Boolean} The speech line or `false` if the current position
         *      is not a speech line.
         */
        get body() {
            return this.text && characterLine.exec(this.text)[2];
        }
        /**
         * Returns the title of the current node
         *
         * @returns {String} The title of the current node
         */
        get title() {
            return this.raw.title;
        }
        /**
         * Returns the current command
         *
         * @returns {String|Boolean} The current command, or `false` if the current
         *      position is not a command.
         */
        get command() {
            if (this.currentStep instanceof bondage.CommandResult) {
                return this.currentStep.text;
            }
            return false;
        }
        /**
         * Returns the tags of the current node
         *
         * @returns {String} The tags of the current node.
         */
        get tags() {
            return this.raw.tags;
        }
        /**
         * Returns currently possible dialogue options, if there are any.
         * @returns {Array<String>|Boolean} An array of possible dialogue lines.
         */
        get options() {
            if (this.currentStep instanceof bondage.OptionsResult) {
                return this.currentStep.options;
            }
            return false;
        }
        /**
         * Current variables
         * @type {Object}
         */
        get variables() {
            return this.bondage.variables;
        }
        /**
         * Checks whether a given node was visited
         * @param {String} title The node's title to check against
         * @returns {Boolean} Returns `true` if the specified node was visited, `false` otherwise.
         */
        visited(title) {
            return (title in this.bondage.visited && this.bondage.visited[title]);
        }
    }

    ct.yarn = {
        /**
         * Opens the given JSON object and returns a YarnStory object, ready for playing.
         * @param {Object} data The JSON object of a Yarn story
         * @returns {YarnStory} The YarnStory object
         */
        openStory(data) {
            return new YarnStory(data);
        },
        /**
         * Opens the given JSON object and returns a promise that resolves into a YarnStory.
         * @param {String} url The link to the JSON file, relative or absolute. Use `myProject.json`
         * for stories stored in your `project/include` directory.
         * @returns {Promise<YarnStory>} A promise that resolves into a YarnStory object after downloading the story
         */
        openFromFile(url) {
            return fetch(url)
            .then(data => data.json())
            .then(json => new YarnStory(json));
        }
    };
})();

