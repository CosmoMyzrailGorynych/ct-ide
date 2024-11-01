import zl from 'zip-lib';

export default async (payload: {
    inPath: string,
    outPath: string
}): Promise<string> => {
    await zl.extract(payload.inPath, payload.outPath);
    return payload.outPath;
};
