import {ExportedStyle} from './../node_requires/exporter/_exporterContracts';

const stylesLib = {
    /**
     * @catnipIgnore
     */
    types: {} as Record<string, ExportedStyle>,
    /**
     * Creates a new style with a given name.
     * Technically, it just writes `data` to `styles.types`
     * @catnipIgnore
     */
    new(name: string, styleTemplate: ExportedStyle): ExportedStyle {
        stylesLib.types[name] = styleTemplate;
        return styleTemplate;
    },
    /**
     * Returns a style of a given name. The actual behavior strongly depends on `copy` parameter.
     * @param name The name of the style to load
     * @catnipAsset name:style
     * @param [copy] If not set, returns the source style object.
     * Editing it will affect all new style calls.
     * When set to `true`, will create a new object, which you can safely modify
     * without affecting the source style.
     * When set to an object, this will create a new object as well,
     * augmenting it with given properties.
     * @returns {object} The resulting style
     */
    get(name: string, copy?: boolean | Record<string, unknown>): ExportedStyle {
        if (copy === true) {
            return Object.assign({}, stylesLib.types[name]);
        }
        if (copy) {
            return Object.assign(Object.assign({}, stylesLib.types[name]), copy);
        }
        return stylesLib.types[name];
    }
};
export default stylesLib;
