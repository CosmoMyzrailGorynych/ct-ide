export const optionsToStringObj = (options: Record<string, string>): string =>
    '{\n' + Object.entries(options)
        .map(([key, value]) => `${key}: ${value}`)
        .join(',\n') +
    '\n}';

export const getOptions = (
    values: Record<string, string>,
    keys: string[],
    customOptions?: Record<string, string>
): Record<string, string> | false => {
    const options: Record<string, string> = {};
    let hasOptions = false;
    for (const key of keys) {
        if (values[key] !== 'undefined') {
            options[key] = values[key];
            hasOptions = true;
        }
    }
    if (customOptions) {
        for (const key of Object.keys(customOptions)) {
            if (customOptions[key] !== 'undefined') {
                options[key] = customOptions[key];
                hasOptions = true;
            }
        }
    }
    return hasOptions && options;
};
