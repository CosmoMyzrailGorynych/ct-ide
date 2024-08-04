const {setData, getData, getKeys} = Neutralino.storage;
const {filesystem} = Neutralino;

export const init = async () => {
    try {
        await filesystem.getStats('./.storage');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.debug(err);
        // eslint-disable-next-line no-console
        console.debug('Creating directory \'./.storage\'...');
        await filesystem.createDirectory('./.storage');
    }
    const keys = await getKeys();
    await Promise.all(keys.map(async (key) => {
        const value = await getData(key);
        localStorage.setItem(key, value);
    }));
};
export const write = (key: string, value: string | Record<string, any> | any[]) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
    setData(key, value);
};
export const read = (key: string) => localStorage.getItem(key);
export const deleteKey = (key: string) => {
    localStorage.removeItem(key);
    setData(key, null as unknown as string);
};
