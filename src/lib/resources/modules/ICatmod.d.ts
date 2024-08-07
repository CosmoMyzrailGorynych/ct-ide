declare interface ICatmodAuthor {
    name: string,
    mail: string
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
    fields?: IExtensionField<unknown>[],
    templateExtends?: IExtensionField<unknown>[],
    tileLayerExtends?: IExtensionField<unknown>[],
    copyExtends?: IExtensionField<unknown>[],
    roomExtends?: IExtensionField<unknown>[],
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
