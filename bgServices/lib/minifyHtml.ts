/* eslint-disable id-length */
import {minify} from 'html-minifier-terser';

export default (input: string): Promise<string> => minify(input, {
    caseSensitive: true,
    collapseBooleanAttributes: true,
    removeComments: true,
    removeAttributeQuotes: true,
    continueOnParseError: true,
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true
});
