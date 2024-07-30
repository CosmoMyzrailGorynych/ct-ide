import { Client, Session } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

import Logger from "./logger"

export default class Nakama {
    constructor(clientHost, clientPort, useSSL) {
        this.useSSL = useSSL;
        this.client = new Client("defaultkey", clientHost, clientPort, this.useSSL);

        this.session;
        this.socket;

        this.state = {}
    }

    initiate = async () => {
        await this.checkSessionAndAuthenticate()
        await this.establishSocketConnection()

        Logger.log("ct.nakama has loaded!", "✨");
    }

    checkSessionAndAuthenticate = async () => {
        // Checks browser for session and authenticates with server

        let nakamaAuthToken = localStorage.getItem("nakamaAuthToken");

        if (nakamaAuthToken && nakamaAuthToken != "") {
            Logger.log("Session Found");

            let session = Session.restore(nakamaAuthToken);
            let currentTimeInSec = new Date() / 1000;

            if (!session.isexpired(currentTimeInSec)) {
                // Session valid so restore it
                this.session = session
                Logger.log("Session Restored");
            } else {
                Logger.log("Session Expired");
                await this.createSession()
            }
        } else {
            await this.createSession()
        }

        Logger.success("Authenticated Session");
    };

    establishSocketConnection = async () => {
        // Create connection to the server via websockets
        const trace = false; // TODO: understand what this does
        this.socket = this.client.createSocket(this.useSSL, trace);
        await this.socket.connect(this.session);

        Logger.success("Established Websocket Connection");
    };

    createSession = async () => {
        Logger.log("Creating New Session");

        const newUserId = uuidv4();

        let nakamaSession = await this.client.authenticateCustom(newUserId, true, newUserId);
        localStorage.setItem("nakamaAuthToken", nakamaSession.token);
        this.session = nakamaSession

        return this.session
    }
}
