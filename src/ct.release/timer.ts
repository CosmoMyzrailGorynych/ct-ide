import uLib from './u';
import roomsLib from './rooms';

const ctTimerTime = Symbol('time');
const ctTimerRoomUid = Symbol('roomUid');
const ctTimerTimeLeftOriginal = Symbol('timeLeftOriginal');
const promiseResolve = Symbol('promiseResolve');
const promiseReject = Symbol('promiseReject');

/**
 * @property {boolean} isUi Whether the timer uses ct.deltaUi or not.
 * @property {string|false} name The name of the timer
 */
export class CtTimer {
    [ctTimerRoomUid]: number;
    name: string;
    isUi: boolean;
    [ctTimerTime]: number;
    [ctTimerTimeLeftOriginal]: number;
    timeLeft: number;
    promise: Promise<void>;
    [promiseResolve]: () => (Promise<unknown> | void);
    [promiseReject]: (message?: unknown) => void;
    rejected = false;
    done = false;
    settled = false;
    /**
     * An object for holding a timer
     *
     * @param timeMs The length of the timer, **in milliseconds**
     * @param [name=false] The name of the timer
     * @param [uiDelta=false] If `true`, it will use `ct.deltaUi` for counting time.
     * if `false`, it will use `ct.delta` for counting time.
     */
    constructor(timeMs: number, name?: string, uiDelta = false) {
        this[ctTimerRoomUid] = roomsLib.current.uid || null;
        this.name = name && name.toString();
        this.isUi = uiDelta;
        this[ctTimerTime] = 0;
        this[ctTimerTimeLeftOriginal] = timeMs / 1000;
        this.timeLeft = this[ctTimerTimeLeftOriginal];
        this.promise = new Promise((resolve, reject) => {
            this[promiseResolve] = resolve;
            this[promiseReject] = reject;
        });
        timerLib.timers.add(this);
    }

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     *
     * @param {Function} onfulfilled The callback to execute when the Promise is resolved.
     * @param {Function} [onrejected] The callback to execute when the Promise is rejected.
     * @returns {Promise} A Promise for the completion of which ever callback is executed.
     */
    then(arg: () => unknown): Promise<unknown> {
        return this.promise.then(arg);
    }
    /**
     * Attaches a callback for the rejection of the Promise.
     *
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    catch(onrejected: (e: Error) => void): Promise<unknown> {
        return this.promise.catch(onrejected);
    }

    /**
     * The time passed on this timer, **in seconds**
     * @type {number}
     */
    get time(): number {
        return this[ctTimerTime];
    }
    set time(newTime: number) {
        this[ctTimerTime] = newTime;
    }

    /**
     * Updates the timer. **DONT CALL THIS UNLESS YOU KNOW WHAT YOU ARE DOING**
     *
     * @returns {void}
     * @private
     */
    update(): void {
        // Not something that would normally happen,
        // but do check whether this timer was not automatically removed
        if (this.rejected === true || this.done === true) {
            this.remove();
            return;
        }
        this[ctTimerTime] += this.isUi ? uLib.timeUi : uLib.time;
        if (roomsLib.current.uid !== this[ctTimerRoomUid] && this[ctTimerRoomUid] !== null) {
            this.reject({
                info: 'Room has been switched',
                from: 'timer'
            }); // Reject if the room was switched
        }

        // If the timer is supposed to end
        if (this.timeLeft !== 0) {
            this.timeLeft = this[ctTimerTimeLeftOriginal] - this.time;
            if (this.timeLeft <= 0) {
                this.resolve();
            }
        }
    }

    /**
     * Instantly triggers the timer and calls the callbacks added through `then` method.
     * @returns {void}
     */
    resolve(): void {
        if (this.settled) {
            return;
        }
        this.done = true;
        this.settled = true;
        this[promiseResolve]();
        this.remove();
    }
    /**
     * Stops the timer with a given message by rejecting a Promise object.
     * @param {any} message The value to pass to the `catch` callback
     * @returns {void}
     */
    reject(message: unknown): void {
        if (this.settled) {
            return;
        }
        this.rejected = true;
        this.settled = true;
        this[promiseReject](message);
        this.remove();
    }
    /**
     * Removes the timer from ct.js game loop. This timer will not trigger.
     * @returns {void}
     */
    remove(): void {
        timerLib.timers.delete(this);
    }
}

/**
 * Timer utilities
 * @namespace
 */
const timerLib = {
    /**
     * A set with all the active timers.
     * @type Set<CtTimer>
     */
    timers: new Set(),
    counter: 0,
    /**
     * Adds a new timer with a given name
     *
     * @param timeMs The length of the timer, **in milliseconds**
     * @param [name] The name of the timer, which you use
     * to access it from `ct.timer.timers`.
     * @returns {CtTimer} The timer
     */
    add(timeMs: number, name?: string): CtTimer {
        return new CtTimer(timeMs, name, false);
    },
    /**
     * Adds a new timer with a given name that runs in a UI time scale
     *
     * @param timeMs The length of the timer, **in milliseconds**
     * @param [name=false] The name of the timer, which you use
     * to access it from `ct.timer.timers`.
     * @returns The timer
     */
    addUi(timeMs: number, name?: string): CtTimer {
        return new CtTimer(timeMs, name, true);
    },
    /**
     * Updates the timers. **DONT CALL THIS UNLESS YOU KNOW WHAT YOU ARE DOING**
     *
     * @returns {void}
     * @private
     */
    updateTimers(): void {
        for (const timer of this.timers) {
            timer.update();
        }
    }
};
export default timerLib;
