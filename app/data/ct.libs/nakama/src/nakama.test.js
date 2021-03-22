import { Session, DefaultSocket } from "@heroiclabs/nakama-js";

const NakamaWrapper = require('./nakama').default;

let Nakama;

beforeEach(() => {
    localStorage.clear();
    Nakama = new NakamaWrapper("127.0.0.1", "7350", false)
});

describe('nakama', () => {
    describe('initiate', () => {
        test('session and socket exist', async () => {
            await Nakama.initiate()

            expect(Nakama.session).not.toBeUndefined();
            expect(Nakama.socket).not.toBeUndefined();
        });
    })

    describe('checkSessionAndAuthenticate', () => {
        test('new session gets created if session does not exist', async () => {
            expect(Nakama.session).toBeUndefined()
            await Nakama.checkSessionAndAuthenticate();
            expect(Nakama.session).toBeInstanceOf(Session);
        });

        test('existing session is still valid so return it', async () => {
            expect(Nakama.session).toBeUndefined()

            const existing_session = await Nakama.createSession()

            await Nakama.checkSessionAndAuthenticate();

            expect(Nakama.session).toEqual(existing_session);
        });

        test('existing session is not valid so create a new session', async () => {
            expect(Nakama.session).toBeUndefined()

            const expired_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTQ5NjIzNDEsImV4cCI6MTYxNDk2MjM0MiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.YXR26DYwENDtf6KjAMsNWE2UNm0PFDGhuMvI_vd3EMs"
            localStorage.setItem("nakamaAuthToken", expired_token)

            await Nakama.checkSessionAndAuthenticate();

            const new_token = localStorage.getItem("nakamaAuthToken")
            expect(new_token).not.toEqual(expired_token);
        });
    })

    describe('establishSocketConnection', () => {
        test('socket gets created', async () => {
            expect(Nakama.socket).toBeUndefined()
            await Nakama.checkSessionAndAuthenticate();
            await Nakama.establishSocketConnection();
            expect(Nakama.socket).toBeInstanceOf(DefaultSocket);
        });
    })

    describe('createSession', () => {
        test('session gets created and stored in localstorage', async () => {
            const session = await Nakama.createSession();

            expect(localStorage.setItem).toHaveBeenLastCalledWith("nakamaAuthToken", session.token);
            expect(Nakama.session).toBeInstanceOf(Session);
        });
    })
})
