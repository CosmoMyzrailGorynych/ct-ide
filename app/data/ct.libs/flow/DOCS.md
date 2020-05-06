## ct.flow.gate(func, [opened]) ⇒ `function`

Constructs and returns a gate — a new function that will execute a given one only when the gate is opened.
The gate can be opened and closed with `ourGate.open()`, `yourGate.close()` and `yourGate.toggle()` methods,
and called later with `yourGate()`.

**Example:**

```js
var gate = ct.flow.gate(() => {
    console.log('It works!');
});
gate(); // Does not work, the gate is not opened by default.
gate.open();
gate(); // Will now work
```

**Returns**: `function` - The constructed gate.  

| Param | Type | Description |
| --- | --- | --- |
| func | `function` | The function to execute. |
| [opened] | `Boolean` | The initial state of the created gate (`true` for being opened, default is `false`). |


## ct.flow.delay(func, [opened]) ⇒ `function`

Creates and returns a new function that will execute a function `func` with a delay
and no more than once in the given period. The call to the original function is made
after the period has elapsed, after which the delay function may be triggered again.

**Example:**

```js
var delayed1 = ct.flow.delay(() => {
    console.log('It works!');
}, 300);
for (var i = 0; i < 3; i++) {
    delayed1(); // The original function will work only once, because there are no pauses
}
var delayed2 = ct.flow.delay(() => {
    console.log('It works!');
}, 300);
delayed2();
ct.u.wait(500)
.then(delayed2); // Will work twice
```

**Note:** the created function will stop working if the game switches to another room.

**Returns**: `function` - The delayed function

| Param | Type | Description |
| --- | --- | --- |
| func | `function` | The function to postpone |
| ms | `Number` | The period to wait, in milliseconds |


## ct.flow.retriggerableDelay(func, ms) ⇒ `function`

Returns a new function that sets a timer to call the original function,
similar to `ct.flow.delay`. This function, however, will reset its timer on each call.
This construction is also known as a cumulative delay.

**Example:**

```js
var delayed1 = ct.flow.delay(() => {
    console.log('It works!');
}, 3000);
delayed1();
ct.u.wait(2000)
.then(delayed2); // Will work once in 5 seconds

var delayed2 = ct.flow.delay(() => {
    console.log('It works!');
}, 3000);
delayed2();
ct.u.wait(4000)
.then(delayed2); // Will work twice in 7 seconds
```

**Note:** the created function will stop working if the game switches to another room.

**Returns**: `function` - The delayed function  

| Param | Type | Description |
| --- | --- | --- |
| func | `function` | The function to postpone |
| ms | `Number` | The period to wait, in milliseconds |


## ct.flow.timer(func, ms) ⇒ `function`

Similar to `ct.flow.delay`, this method will return a new function that will limit
the execution of the `func` to max once in `ms` period. It will call the function first
and then block the execution for `ms` time, though.

It takes into account `ct.delta` or `ct.deltaUi`.

**Returns**: `function` - a new triggerable function  

| Param | Type | Description |
| --- | --- | --- |
| func | `function` | The function to limit |
| ms | `Number` | The period to wait, in milliseconds |
| [useUiDelta=false] | `Boolean` | If true, use `ct.deltaUi` instead of `ct.delta` |
