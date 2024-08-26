/* eslint-disable id-length */
import {minify} from 'htmlfy';

export default (input: string): Promise<string> => Promise.resolve(minify(input));
