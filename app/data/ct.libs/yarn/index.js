/* eslint-disable no-cond-assign */
(function () {
    const commandPattern = /<<([\s\S]+?)>>/g;
    const optionsPattern = /\[\[(Answer:([^|]+?)\|)?([^|]+?)\]\]/g;
    const parse = function(raw) {
        try {
            let {body} = raw;
            const links = {};
            const options = [];
            const commands = [];
            let rawCommand, rawOption;
            while (rawCommand = commandPattern.exec(body)) {
                commands.push(rawCommand[1]);
            }
            while (rawOption = optionsPattern.exec(body)) {
                const option = rawOption[2] || rawOption[3];
                // eslint-disable-next-line prefer-destructuring
                links[option] = rawOption[3];
                options.push(option);
            }
            body = body
                .replace(commandPattern, '')
                .replace(optionsPattern, '')
                .trim();
            const tags = raw.tags.split(' ').filter(elt => elt); // filter out empty strings
            return {
                body,
                commands,
                options,
                tags,
                links
            };
        } catch (e) {
            console.error('An error occured while attempting to parse a node ', raw);
            throw e;
        }
    };
    class YarnStory {
        constructor(data) {
            if (!data.length) {
                throw new Error('An empty entity was given instead of a Yarn project');
            }
            this.nodes = {};
            for (const node of data) {
                node.title = node.title.trim();
                this.nodes[node.title] = node;
            }
            this.startingNode = this.nodes.Start || data[0];
            this.start();
        }
        start() {
            this.jump(this.startingNode.title);
        }
        get parsed() {
            // eslint-disable-next-line no-underscore-dangle
            return this.$parsed || (this.$parsed = parse(this.raw));
        }
        get options() {
            return this.parsed.options;
        }
        say(line) {
            if (!(line in this.parsed.links)) {
                this.log();
                throw new Error(`There is no such option as "${line}". It could be a typo, or maybe you are using a title instead of a dialogue option.`);
            }
            this.jump(this.parsed.links[line]);
        }
        jump(title) {
            if (!(title in this.nodes)) {
                this.log();
                throw new Error(`Could not find a node called "${title}".`);
            }
            this.previousNode = this.raw;
            this.raw = this.nodes[title];
            delete this.$parsed;
        }
        back() {
            this.jump(this.previousNode.title);
        }


        get text() {
            return this.parsed.body;
        }
        get body() {
            return this.parsed.body;
        }
        get title() {
            return this.raw.title;
        }
        get commands() {
            return this.parsed.commands;
        }
        get tags() {
            return this.parsed.tags;
        }

        log() {
            setTimeout(() => {
                // eslint-disable-next-line no-console
                console.log('The story in question is ', this);
                // eslint-disable-next-line no-console
                console.log('The current node is ', this.raw);
                // eslint-disable-next-line no-console
                console.log('The parsed data is ', this.parsed);
            }, 0);
        }
    }
    
    ct.yarn = {
        openStory(data) {
            return new YarnStory(data);
        },
        openFromFile(url) {
            return fetch(url)
            .then(data => data.json())
            .then(json => new YarnStory(json));
        }
    };
})();

