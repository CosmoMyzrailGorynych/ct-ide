declare interface IScriptablesFragment extends Pick<
    Record<EventCodeTargets, string>,
    'rootRoomOnCreate' | 'rootRoomOnStep' | 'rootRoomOnDraw' | 'rootRoomOnLeave'
> {
    libCode: string;
}
