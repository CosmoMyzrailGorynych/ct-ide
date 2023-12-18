declare interface IEventCategory {
    name: string;
    hint?: string;
    icon: string;
    [key: string]: string;
}

type EventApplicableEntities = 'template' | 'room';
type EventArgumentTypes =
    'integer' | 'float' | 'string' | 'boolean' |
    'template' | 'room' | 'sound' | 'tandem' | 'font' | 'style' | 'texture' | 'action';
type EventCodeTargets =
    'thisOnStep' | 'thisOnCreate' | 'thisOnDraw' | 'thisOnDestroy' |
    'rootRoomOnCreate' | 'rootRoomOnStep' | 'rootRoomOnDraw' | 'rootRoomOnLeave';

declare interface IEventArgumentDeclaration {
    name: string;
    type: EventArgumentTypes;
    default?: unknown;
}
declare interface IEventLocalVarDeclaration {
    type: string;
    description?: string;
}

declare interface IEventDeclaration extends Record<string, unknown> {
    /**
     * The displayed name of the event.
     * Core events get translated through i18n module anyways.
     */
    name: string;
    /**
     * A template string to be displayed in event list,
     * used with parameterized events to differ them visually through UI.
     */
    parameterizedName?: string;
    hint?: string;
    /**
     * A list of entities this event can be added to.
     */
    applicable: EventApplicableEntities[];
    /**
     * If `applicable` has "template", this tells the template editor to filter
     * this event out if the template's base class is not included in this array.
     */
    baseClasses?: TemplateBaseClass[];
    icon: string;
    /**
     * If set to true, the event in event list editor will try to fetch a thumbnail
     * of the first room, template, or texture in the arguments list and display it.
     */
    useAssetThumbnail?: boolean;
    category: string;
    /**
     * Arguments editable through ct.IDE UI to further narrow the event by a game developer,
     * or to provide additional settings to them.
     */
    arguments?: {
        [key: string]: IEventArgumentDeclaration;
    };
    /**
     * If set to true, the same event can be added several times.
     * It is usually used with parametrized events.
     */
    repeatable?: boolean;
    /**
     * Local variables introduced into context by the surrounding function's code.
     * Usually used by modules to pass additional info about the current event.
     *
     * Example: in an event "Collision with template Sausage", a local var called
     * `other` can point to the copy that caused this event (aside from `this`).
     */
    locals?: {
        [key: string]: IEventLocalVarDeclaration;
    };
    codeTargets: EventCodeTargets[];
    inlineCodeTemplates?: Partial<Record<EventCodeTargets, string>>;
}
