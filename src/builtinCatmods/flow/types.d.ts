interface IGate extends Function {
    /**
     * Opens or closes the gate.
     */
    toggle: () => void;

    /**
     * Opens the gate, allowing the inner function to be called.
     */
    open: () => void;

    /**
     * Closes the gate, disallowing the execution of the inner function.
     */
    close: () => void;
}

/** A collection of high-level utilities for flow control, that are especially useful while working with asynchronous events. */
declare namespace flow {
    /**
     * The same as `ct.u.wait`. Returns a Promise that resolves after the given time, in milliseconds.
     */
    function wait(ms: number): Promise<void>;

    /**
     * Constructs and returns a gate — a new function that will execute a given one only when the gate is opened.
     * The gate can be opened and closed with `ourGate.open()`, `yourGate.close()` and `yourGate.toggle()` methods,
     * and called later with `yourGate()`.
     *
     * **Example:**
     *
     * ```js
     * var gate = ct.flow.gate(() => {
     *   console.log('It works!');
     * });
     * gate(); // Does not work, the gate is not opened by default.
     * gate.open();
     * gate(); // Will now work
     * ```
     */
    function gate(func: Function, openedByDefault?: boolean): IGate;


    /**
     * Creates and returns a new function that will execute a function `func` with a delay
     * and no more than once in the given period. The call to the original function is made
     * after the period has elapsed, after which the delay function may be triggered again.
     *
     * **Example:**
     *
     * ```js
     * var delayed1 = ct.flow.delay(() => {
     *   console.log('It works!');
     * }, 300);
     * for (var i = 0; i < 3; i++) {
     *   delayed1(); // The original function will work only once, because there are no pauses
     * }
     *
     * var delayed2 = ct.flow.delay(() => {
     *   console.log('It works!');
     * }, 300);
     * delayed2();
     * ct.u.wait(500)
     * .then(delayed2); // Will work twice
     * ```
     *
     * **Note:** the created function will stop working if the game switches to another room.
     */
    function delay(func: Function, ms: number): Function;

    /**
     * Returns a new function that sets a timer to call the original function,
     * similar to `ct.flow.delay`. This function, however, will reset its timer on each call.
     * This construction is also known as a cumulative delay.
     *
     * **Example:**
     *
     * ```js
     * var delayed1 = ct.flow.retriggerableDelay(() => {
     *   console.log('It works!');
     * }, 3000);
     * delayed1();
     * ct.u.wait(2000)
     * .then(delayed2); // Will work once in 5 seconds
     *
     * var delayed2 = ct.flow.retriggerableDelay(() => {
     *   console.log('It works!');
     * }, 3000);
     * delayed2();
     * ct.u.wait(4000)
     * .then(delayed2); // Will work twice in 7 seconds
     * ```
     *
     * **Note:** the created function will stop working if the game switches to another room.
     */
    function retriggerableDelay(func: Function, ms: number): Function;

    /**
     * Similar to `ct.flow.delay`, this method will return a new function that will limit
     * the execution of the `func` to max once in `ms` period. It will call the function first
     * and then block the execution for `ms` time, though.
     */
    function timer(func: Function, ms: number): Function;
}
