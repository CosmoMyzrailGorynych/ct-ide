import zl from 'zip-lib';

export default async (payload: {
    in: string,
    out: string
}): Promise<string> => {
    await zl.extract(payload.in, payload.out);
    return payload.out;
};
