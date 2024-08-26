const {setData, getData} = Neutralino.storage;
const {filesystem} = Neutralino;

const storage: Record<string, string> = {};

const debounce = (func: () => void, timeout = 300) => {
    let timer: number;
    return (...args: unknown[]) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
};

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
    try {
        const savedStorage = JSON.parse(await getData('storage'));
        for (const key in savedStorage) {
            localStorage.setItem(key, savedStorage[key]);
            storage[key] = savedStorage[key];
        }
    } catch (e) {
        void e;
    }
};

export const flush = () => setData('storage', JSON.stringify(storage));

const flushDebounced = debounce(flush, 50);

export const write = (
    key: string,
    value: string | number | Date | Record<string, never> | never[]
) => {
    if (value instanceof Date) {
        value = value.toJSON();
    }
    if (typeof value === 'number') {
        value = value.toString();
    }
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
    storage[key] = value;
    flushDebounced();
};
export const read = (key: string) => localStorage.getItem(key);
export const deleteKey = (key: string) => {
    localStorage.removeItem(key);
    delete storage[key];
    flushDebounced();
};
