import {styleToTextStyle} from './../styleUtils';
export const stringifyStyles = (proj: IProject): string => {
    var styles = '';
    for (const styl in proj.styles) {
        var s = proj.styles[styl],
            o = styleToTextStyle(s);
        styles += `
styles.new(
    "${s.name}",
    ${JSON.stringify(o, null, '    ')});
`;
    }
    return styles;
};
