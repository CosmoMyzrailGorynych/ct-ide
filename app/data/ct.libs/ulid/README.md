# Ulid  ct.ulid

This `Catmod` is for you to generate unique IDs.

## How to use it

```js
// Create an unique ID. Default pattern is going to be 8-4-4-12
var id  = ct.ulid.make(); 
//Result is: f2eda03a-dd0d-d723-6ff3-765480b5d3ba
```
## Create a custom UUID

Use the 5 fields in Catmods'settings->ct.ulid to set custom regex quantity.

Later use `ct.ulid.custom()` to generate a new `ID`
```js
var id = ct.ulid.custom();
``` 
