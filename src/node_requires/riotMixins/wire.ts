const glob = require('../glob');

/**
 * Usually used as listeners to input events, this method changes the tag's property based
 * on the value of the input tag inside the input event.
 *
 * @param that The riot tag. You don't need to write it in `wire()`
 * as it is automatically assigned.
 * @param {string} field The dot-notation path to a property inside the current tag.
 * If starts with `global` or `window`, will change a property in the global scope
 * (which is discouraged).
 * @param {boolean} update Calls the update() method on the tag after changing the value.
 * It is usually not needed as event listeners already do it, but can be useful
 * with input-like child tags.
 *
 * @example
 * ```js
 * this.mixin(window.riotWire)
 * ```
 * ```pug
 * input(type="text" oninput="{wire('field.subfield')}")
 * ```
 * ```pug
 * asset-input(onchanged="{wire('field.subfield', true)}")
 * ```
 *
 * @note By default, the wire function does not accout min and max values on input[type="number"]
 * so the users can exceed the range when they want to, but you can enforce min and max values
 * with an data-wired-force-minmax atomic attribute.
 */
const wire = (that: IRiotTag, field: string, update: boolean) => (e: InputEvent) => {
    var way = field.split(/(?<!\\)\./gi),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        root: Record<string, any>, val;
    for (let i = 0, l = way.length; i < l; i++) {
        way[i] = way[i].replace(/\\./g, '.');
    }
    root = that;
    if (way[0] === 'global' || way[0] === 'window') {
        root = global;
        way.shift();
    } else if (way[0] === 'this') {
        way.shift();
    }
    while (way.length > 1) {
        root = root[way[0]];
        way.shift();
    }
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLOptionElement;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        val = target.checked;
    } else if (target instanceof HTMLInputElement && (target.type === 'number' || target.type === 'range')) {
        val = Number(target.value);
        if (target.hasAttribute('data-wired-force-minmax')) {
            val = Math.max(Number(target.min), Math.min(Number(target.max), val));
        }
    } else {
        val = target.value;
    }
    root[way[0]] = val;
    glob.modified = true;
    if (update && ('update' in that)) {
        that.update();
    }
    return val;
};
export default {
    init(this: IRiotTag): void {
        this.wire = wire.bind(this, this);
    }
};
