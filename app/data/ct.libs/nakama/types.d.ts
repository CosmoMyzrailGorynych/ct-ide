// THESE DO NOT GET UPDATED IF NAKAMA-JS CHANGES
// IN THE FUTURE THEY SHOULD AUTO UPDATE EVERY TIME YOU BUILD 
// (FETCH THEM FROM NODE_MODULES AND IMPORT THEM HERE)

interface Socket {
    connect(session: Session, createStatus: boolean): Promise<Session>;
    disconnect(fireDisconnectEvent: boolean): void;
    send(message: ChannelJoin | ChannelLeave | ChannelMessageSend | ChannelMessageUpdate | ChannelMessageRemove | CreateMatch | JoinMatch | LeaveMatch | MatchDataSend | MatchmakerAdd | MatchmakerRemove | Rpc | StatusFollow | StatusUnfollow | StatusUpdate): Promise<any>;
    addMatchmaker(query: string, minCount: number, maxCount: number, stringProperties?: Record<string, string>, numericProperties?: Record<string, number>): Promise<MatchmakerMatched>;
    createMatch(): Promise<Match>;
    followUsers(user_ids: string[]): Promise<Status>;
    joinChat(target: string, type: number, persistence: boolean, hidden: boolean): Promise<Channel>;
    joinMatch(match_id?: string, token?: string, metadata?: {}): Promise<Match>;
    leaveChat(channel_id: string): Promise<void>;
    leaveMatch(matchId: string): Promise<void>;
    removeChatMessage(channel_id: string, message_id: string): Promise<ChannelMessageAck>;
    removeMatchmaker(ticket: string): Promise<void>;
    rpc(id?: string, payload?: string, http_key?: string): Promise<ApiRpc>;
    sendMatchState(matchId: string, opCode: number, data: any, presence?: Presence[]): Promise<void>;
    unfollowUsers(user_ids: string[]): Promise<void>;
    updateChatMessage(channel_id: string, message_id: string, content: any): Promise<ChannelMessageAck>;
    updateStatus(status?: string): Promise<void>;
    writeChatMessage(channel_id: string, content: any): Promise<ChannelMessageAck>;
    ondisconnect: (evt: Event) => void;
    onerror: (evt: Event) => void;
    onnotification: (notification: Notification) => void;
    onmatchdata: (matchData: MatchData) => void;
    onmatchpresence: (matchPresence: MatchPresenceEvent) => void;
    onmatchmakermatched: (matchmakerMatched: MatchmakerMatched) => void;
    onstatuspresence: (statusPresence: StatusPresenceEvent) => void;
    onstreampresence: (streamPresence: StreamPresenceEvent) => void;
    onstreamdata: (streamData: StreamData) => void;
    onchannelmessage: (channelMessage: ChannelMessage) => void;
    onchannelpresence: (channelPresence: ChannelPresenceEvent) => void;
}

interface Session {
    readonly token: string;
    readonly created_at: number;
    readonly expires_at: number;
    readonly username: string;
    readonly user_id: string;
    readonly vars: object;
    isexpired(currenttime: number): boolean;
}

declare namespace Nakama {
    /**
     * Nakama socket for communicating with the server
     */
    let socket: Socket;

    /**
    * Current Nakama session of the player
    */
    let session: Session;

    /**
    * Current state of the session, defaults to an empty object. Useful for storing players etc. 
    */
    let state: object;
}
