const tsTranspiler = new Bun.Transpiler({
    loader: 'ts'
});

export default (input: string): Promise<string> => tsTranspiler.transform(input);
