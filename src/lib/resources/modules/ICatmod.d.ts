declare interface ICatmodAuthor {
    name: string,
    mail: string
}

declare interface ICatmodField<T> {
    /**
     * The displayed name.
     */
    name: string,
    /**
     * The type of a field
     */
    type: string,
    /**
     * The name of a JSON key to write into the `opts.entity`.
     * Not needed for hN types, but required otherwise
     */
    key?: string,
    /**
     * The default value; it is not written to the `opts.entity`, but is shown in inputs.
     */
    default?: T,
    /**
     * A text label describing the purpose of a field
     */
    help?: string,
    /**
     * Used with type === 'radio'.
     */
    options?: Array<{
        value: T,
        name: string,
        help?: string
    }>,

    /**
     * These are for type === 'table'
     */
    fields?: ICatmodField<unknown>[],

    /**
     * Used with type === 'number', 'slider', or 'sliderAndNumber'
     */
    min?: number,
    max?: number,
    step?: number

    /**
     * These are used with type === 'group'
     */
    openedByDefault?: boolean,
    lsKey?: string,
    items?: ICatmodField<unknown>[]
}

type moduleCategory =
    'customization' | 'utilities' | 'media' | 'misc' | 'desktop' |
    'motionPlanning' | 'inputs' | 'fx' | 'mobile' | 'integrations' |
    'tweaks' | 'networking' | 'default';

declare interface ICatmodManifest {
    main: {
        name: string,
        tagline: string,
        icon?: string,
        version: string,
        authors: ICatmodAuthor[],
        categories?: moduleCategory[]
    },
    fields?: ICatmodField<unknown>[],
    typeExtends?: ICatmodField<unknown>[],
    tileLayerExtends?: ICatmodField<unknown>[],
    copyExtends?: ICatmodField<unknown>[],
    roomExtends?: ICatmodField<unknown>[],
    inputMethods?: Record<string, string>,
    eventCategories?: Record<string, IEventCategory>,
    events?: Record<string, IEventDeclaration>
}

declare interface ICatmod {
    name: string,
    path: string,
    manifest: ICatmodManifest
}
declare interface ICatmodMeta {
    name: string,
    path: string,
    manifest?: ICatmodManifest
}
