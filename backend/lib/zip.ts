import zl from 'zip-lib';

export default async (payload: {
    files?: string[],
    dir: string,
    out: string
}): Promise<string> => {
    if (payload.files) {
        const zip = new zl.Zip();
        for (const file of payload.files) {
            zip.addFile(file, file.replace(payload.dir, ''));
        }
        await zip.archive(payload.out);
        return payload.out;
    }
    await zl.archiveFolder(payload.dir, payload.out);
    return payload.out;
};
