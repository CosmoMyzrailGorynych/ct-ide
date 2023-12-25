Nano ID for ct.js

This catmod is a bit modified and minified `nanoid` [npm module](https://github.com/ai/nanoid). The original module is made by Andrey Sitnik and dozens of contributors, and is distributed under the MIT license.

Nano ID is an URL-friendly, secure ID generator that is shorter but more collision-resilient than GUID.

# Usage

```js
// Regular ID
var id  = nanoid.generate() //=> "V1StGXR8_Z5jdHi6B-myT"
// An ID of a specific size
var shortId =  nanoid.generate(10) //=> "IRFa-VaY2b"
```
