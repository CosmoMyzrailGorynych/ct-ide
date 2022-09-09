const getProp = function (context: unknown, path: string): unknown {
    var way = path.split(/(?<!\\)\./gi);
    while (way.length > 1) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context = (context as any)[way[0]];
        way.shift();
    }
    return context;
};

const writeProp = function (context: unknown, path: string, value: unknown): void {
    var way = path.split(/(?<!\\)\./gi);
    while (way.length > 2) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(way[0] in (context as any))) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (context as any)[way[0]] = {};
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context = (context as any)[way[0]];
        way.shift();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (context as any)[way[0]] = value;
};

export {
    getProp,
    writeProp
};
