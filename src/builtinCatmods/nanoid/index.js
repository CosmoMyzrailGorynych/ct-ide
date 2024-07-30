/*
Nano ID (https://github.com/ai/nanoid)

The MIT License (MIT)

Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function(exports){'use strict';let urlAlphabet='ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';if(typeof crypto==='undefined'){throw new Error('Your browser does not have secure random generator. If you don’t need unpredictable IDs, you can use nanoid/non-secure.')}let random=bytes=>crypto.getRandomValues(new Uint8Array(bytes));let customRandom=(alphabet,size,getRandom)=>{let mask=(2<<(Math.log(alphabet.length-1)/Math.LN2))-1;let step= - ~((1.6*mask*size)/alphabet.length);return()=>{let id='';while(true){let bytes=getRandom(step);let j=step;while(j--){id+=alphabet[bytes[j]&mask]||'';if(id.length===size){return id}}}}};let customAlphabet=(alphabet,size)=>customRandom(alphabet,size,random);let nanoid=(size=21)=>{let id='';let bytes=crypto.getRandomValues(new Uint8Array(size));while(size--){let byte=bytes[size]&63;if(byte<36){id+=byte.toString(36)}else if(byte<62){id+=(byte-26).toString(36).toUpperCase()}else if(byte<63){id+='_'}else{id+='-'}}return id};exports.customAlphabet=customAlphabet;exports.customRandom=customRandom;exports.generate=nanoid;exports.random=random;exports.urlAlphabet=urlAlphabet;return exports}(window.nanoid={}));
