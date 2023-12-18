type BehaviorType = 'template' | 'room';

interface IBehavior extends IScriptable {
    type: 'behavior',
    readonly behaviorType: BehaviorType,
    specification: UserDefinedField[]
}
