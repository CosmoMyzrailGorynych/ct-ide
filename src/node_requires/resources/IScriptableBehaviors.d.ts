/** Describes an asset that supports scripting and can have behaviors linked to it */
interface IScriptableBehaviors extends IScriptable {
    /** assetRefs uid key to IBehavior */
    behaviors: string[]
}
