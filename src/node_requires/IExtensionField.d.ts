declare interface IExtensionField {
    /** The displayed name. */
    name: string,
    /**
     * 'h1', 'h2', 'h3', 'h4' are purely decorational, for grouping fields.
     * Others denote the type of an input field.
     */
    type: 'h1' | 'h2' | 'h3' | 'h4' |
          'text' | 'textfield' | 'code' |
          'number' | 'slider' | 'sliderAndNumber' | 'point2D' | 'color' |
          'checkbox' | 'radio' | 'select' | 'icon' |
          'group' | 'table' | 'array' |
          'texture' | 'template' | 'room' | 'sound' | 'behavior' | 'tandem',
    /**
     * The name of a JSON key to write into the `opts.entity`.
     * Not needed for hN types or 'group', but is required otherwise.
     * The key may have special suffixes that tell the exporter to unwrap foreign keys
     * (resources' UIDs) into asset names. These are supposed to always be used with
     * `'template'`, `'texture'`, and other asset input types.
     * Example: 'enemyClass@@template', 'background@@texture'.
     */
    key?: string,
    /** The default value; it is not written to the `opts.entity`, but is shown in inputs. */
    default?: any,
    /** A text label describing the purpose of a field */
    help?: string,
    /**
     * Adds an asterisk and will mark empty or unchecked fields with red color.
     * ⚠ No other logic provided!
     */
    required?: boolean,
    /**
     * Shows the field only when the value for the specified key of the same object
     * is truthy. */
    if?: string,
    /**
     * Used with type === 'radio' and type === 'select'.
     */
    options?: Array<{
        value: any,
        name: string,
        help?: string
    }>,
    /** For type=number or type=slider only, added to the input field. */
    min?: number,
    /** For type=number or type=slider only, added to the input field. */
    max?: number,
    /** For type=number or type=slider only, added to the input field. */
    step?: number,
    /**
     * The type of the fields used for the array editor (when `type` is 'array').
     * It supports a subset of fields supported by extensions-editor itself,
     * excluding headers, groups, tables, icons, radio, select, and arrays.
     */
    arrayType?: string,
    /** For type === 'group', the grouped items. */
    items?: IExtensionField[],
     /** For type === 'table' */
    fields?: IExtensionField[],
    /**
     * Whether to collect values and suggest them later
     * as an auto-completion results. (Not yet implemented)
     */
    collect?: boolean,
    /** The name of a category under which to store suggestions from `collect`. */
    collectScope?: string
}
