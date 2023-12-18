import {styleToTextStyle} from './../styleUtils';
export const stringifyStyles = (input: IStyle[]): string => {
    var styles = '';
    for (const s of input) {
        const o = styleToTextStyle(s);
        styles += `
styles.new(
    "${s.name}",
    ${JSON.stringify(o, null, '    ')});
`;
    }
    return styles;
};
