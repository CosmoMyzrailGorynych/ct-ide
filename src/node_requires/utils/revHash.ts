import {createHash} from 'crypto';

export const revHash = (value: string | Buffer): string =>
    createHash('md5')
    .update(value)
    .digest('hex')
    .slice(0, 10);
