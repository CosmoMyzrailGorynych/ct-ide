class YarnStory extends PIXI.utils.EventEmitter {
    /**
     * Returns the current text line, including the character's name.
     * Returns `false` if the current position is not a speech line.
     */
    text: string | false;

    /**
     * The character's name that says the current text line.
     *
     * Returns `false` if the current position is not a speech line,
     * `undefined` if the line does not have a character specified,
     * and a string of your character if it was specified.
     */
    character: false | string | undefined;

    /**
     * Returns the the current text line, without a character,
     * or `false` if the current position is not a speech line.
     */
    body: string | false;

    /** Returns the title of the current node. */
    title: string;

    /** The current command, or `false` if the current position is not a command. */
    command: string | false;

    /** The tags of the current node. */
    tags: string;

    /** Returns currently possible dialogue options, if there are any. */
    options: Array<string> | false;

    /** Current variables in the Yarn story. */
    variables : object;

    /** An object containing all the nodes in the story. Each key in this object stands for a node's title. */
    nodes: object;

    /** Starts the story, essentially jumping to a starting node */
    start(): void;

    /** "Says" the given option, advancing the story further on a taken branch, if this dialogue option exists. */
    say(line: string): void;

    /** Manually moves the story to a node with a given title */
    jump(title: string): void;

    /** Moves back to the previous node, but just once */
    back(): void;

    /** Naturally advances in the story, if no options are available */
    next(): void;

    /** Checks whether a given node was visited. `Boolean` - Returns `true` if the specified node was visited, `false` otherwise. */
    visited(title: string): Boolean;
}

declare namespace ct {
    namespace yarn {
        /**
         * Opens the given JSON object and returns a YarnStory object, ready for playing.
         */
        function openStory(data: object): YarnStory;

        /**
         * Opens the given JSON file and returns a promise that resolves into a YarnStory.
         */
        function openFromFile(path: string): Promise<YarnStory>;
    }
}