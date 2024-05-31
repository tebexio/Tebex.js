/**!
 * Tebex.js - MIT License
 * 
 * Copyright (c) 2024 Tebex Ltd - https://js.tebex.io
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version$1 = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version$1,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var zoid$2 = {exports: {}};

/**
 * @internal
 */
const err = (msg = "") => {
    throw new Error("Tebex.js error" + (msg ? ": " : "") + msg.trim());
};
/**
 * @internal
 */
const assert = (condition, msg = "assert failed") => {
    if (!condition)
        err(msg);
};

/**
 * @internal
 */
/**
 * @internal
 */
const isNullOrUndefined = (value) => value === undefined || value == null;
/**
 * @internal
 */
const isString = (value) => typeof value === "string";
/**
 * @internal
 */
const isArray$1 = (value) => Array.isArray(value);
/**
 * @internal
 */
const isObject = (value) => typeof value === "object" && value !== null && !isArray$1(value);

/**
 * @internal
 */
const isEnvBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";
/**
 * @internal
 */
const isApplePayAvailable = () => isEnvBrowser() &&
    // @ts-ignore
    typeof window.ApplePaySession !== "undefined" &&
    // @ts-ignore
    window.ApplePaySession.canMakePayments();
/**
 * @internal
 */
const isMobile = (width, height) => {
    if (!isEnvBrowser())
        return false;
    // If on some old device that doesn't support matchMedia, best be safe and treat it as a mobile?
    if (!window.matchMedia)
        return true;
    const query = window.matchMedia(`(max-width: ${width}) or (max-height: ${height})`);
    return query.matches;
};

const camelToDash = (str) => str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
/**
 * @internal
 */
const createElement = (type) => document.createElement(type);
/**
 * @internal
 */
const getAttribute = (el, name) => el.getAttribute(name);
/**
 * @internal
 */
const setAttribute = (el, name, value) => {
    const attr = camelToDash(name);
    if (value === true)
        el.setAttribute(attr, "");
    else if (value === false || value === null || value === undefined)
        el.removeAttribute(attr);
    else
        el.setAttribute(attr, value + "");
};
/**
 * Custom JSX render function
 * @internal
 */
const h = (type, attrs, ...children) => {
    const el = createElement(type);
    if (isObject(attrs)) {
        for (let name in attrs)
            setAttribute(el, name, attrs[name]);
    }
    for (let child of children.flat())
        el.append(child);
    return el;
};

/**
 * @internal
 */
const nextFrame = async () => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
});
/**
 * @internal
 */
const transitionEnd = async (el) => new Promise((resolve) => {
    if (!getComputedStyle(el).transition)
        resolve();
    const done = () => {
        el.removeEventListener("transitionend", done);
        el.removeEventListener("transitioncancel", done);
        resolve();
    };
    el.addEventListener("transitionend", done);
    el.addEventListener("transitioncancel", done);
});

/**
 * Zoid does a weird infinite loop to check that document.body exists,
 * which could cause SSR builds to hang indefinitely if they imported Tebex.js.
 * This stubs in document.body inside non-browser environments.
 * @internal
 */
var window$1 = isEnvBrowser() ? window : {
    document: {
        body: {}
    }
};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
kMaxLength();

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) ;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var zoid_frame = {exports: {}};

var hasRequiredZoid_frame;

function requireZoid_frame () {
	if (hasRequiredZoid_frame) return zoid_frame.exports;
	hasRequiredZoid_frame = 1;
	(function (module, exports) {
		!function(root, factory) {
		    module.exports = factory() ;
		}("undefined" != typeof self ? self : commonjsGlobal, (function() {
		    return function(modules) {
		        var installedModules = {};
		        function __webpack_require__(moduleId) {
		            if (installedModules[moduleId]) return installedModules[moduleId].exports;
		            var module = installedModules[moduleId] = {
		                i: moduleId,
		                l: !1,
		                exports: {}
		            };
		            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		            module.l = !0;
		            return module.exports;
		        }
		        __webpack_require__.m = modules;
		        __webpack_require__.c = installedModules;
		        __webpack_require__.d = function(exports, name, getter) {
		            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
		                enumerable: !0,
		                get: getter
		            });
		        };
		        __webpack_require__.r = function(exports) {
		            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
		                value: "Module"
		            });
		            Object.defineProperty(exports, "__esModule", {
		                value: !0
		            });
		        };
		        __webpack_require__.t = function(value, mode) {
		            1 & mode && (value = __webpack_require__(value));
		            if (8 & mode) return value;
		            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
		            var ns = Object.create(null);
		            __webpack_require__.r(ns);
		            Object.defineProperty(ns, "default", {
		                enumerable: !0,
		                value: value
		            });
		            if (2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
		                return value[key];
		            }.bind(null, key));
		            return ns;
		        };
		        __webpack_require__.n = function(module) {
		            var getter = module && module.__esModule ? function() {
		                return module.default;
		            } : function() {
		                return module;
		            };
		            __webpack_require__.d(getter, "a", getter);
		            return getter;
		        };
		        __webpack_require__.o = function(object, property) {
		            return {}.hasOwnProperty.call(object, property);
		        };
		        __webpack_require__.p = "";
		        return __webpack_require__(__webpack_require__.s = 0);
		    }([ function(module, __webpack_exports__, __webpack_require__) {
		        __webpack_require__.r(__webpack_exports__);
		        __webpack_require__.d(__webpack_exports__, "PopupOpenError", (function() {
		            return dom_PopupOpenError;
		        }));
		        __webpack_require__.d(__webpack_exports__, "create", (function() {
		            return component_create;
		        }));
		        __webpack_require__.d(__webpack_exports__, "destroy", (function() {
		            return component_destroy;
		        }));
		        __webpack_require__.d(__webpack_exports__, "destroyComponents", (function() {
		            return destroyComponents;
		        }));
		        __webpack_require__.d(__webpack_exports__, "destroyAll", (function() {
		            return destroyAll;
		        }));
		        __webpack_require__.d(__webpack_exports__, "PROP_TYPE", (function() {
		            return PROP_TYPE;
		        }));
		        __webpack_require__.d(__webpack_exports__, "PROP_SERIALIZATION", (function() {
		            return PROP_SERIALIZATION;
		        }));
		        __webpack_require__.d(__webpack_exports__, "CONTEXT", (function() {
		            return CONTEXT;
		        }));
		        __webpack_require__.d(__webpack_exports__, "EVENT", (function() {
		            return EVENT;
		        }));
		        function _setPrototypeOf(o, p) {
		            return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
		                o.__proto__ = p;
		                return o;
		            })(o, p);
		        }
		        function _inheritsLoose(subClass, superClass) {
		            subClass.prototype = Object.create(superClass.prototype);
		            subClass.prototype.constructor = subClass;
		            _setPrototypeOf(subClass, superClass);
		        }
		        function _extends() {
		            return (_extends = Object.assign || function(target) {
		                for (var i = 1; i < arguments.length; i++) {
		                    var source = arguments[i];
		                    for (var key in source) ({}).hasOwnProperty.call(source, key) && (target[key] = source[key]);
		                }
		                return target;
		            }).apply(this, arguments);
		        }
		        function utils_isPromise(item) {
		            try {
		                if (!item) return !1;
		                if ("undefined" != typeof Promise && item instanceof Promise) return !0;
		                if ("undefined" != typeof window$1 && "function" == typeof window$1.Window && item instanceof window$1.Window) return !1;
		                if ("undefined" != typeof window$1 && "function" == typeof window$1.constructor && item instanceof window$1.constructor) return !1;
		                var _toString = {}.toString;
		                if (_toString) {
		                    var name = _toString.call(item);
		                    if ("[object Window]" === name || "[object global]" === name || "[object DOMWindow]" === name) return !1;
		                }
		                if ("function" == typeof item.then) return !0;
		            } catch (err) {
		                return !1;
		            }
		            return !1;
		        }
		        var dispatchedErrors = [];
		        var possiblyUnhandledPromiseHandlers = [];
		        var activeCount = 0;
		        var flushPromise;
		        function flushActive() {
		            if (!activeCount && flushPromise) {
		                var promise = flushPromise;
		                flushPromise = null;
		                promise.resolve();
		            }
		        }
		        function startActive() {
		            activeCount += 1;
		        }
		        function endActive() {
		            activeCount -= 1;
		            flushActive();
		        }
		        var promise_ZalgoPromise = function() {
		            function ZalgoPromise(handler) {
		                var _this = this;
		                this.resolved = void 0;
		                this.rejected = void 0;
		                this.errorHandled = void 0;
		                this.value = void 0;
		                this.error = void 0;
		                this.handlers = void 0;
		                this.dispatching = void 0;
		                this.stack = void 0;
		                this.resolved = !1;
		                this.rejected = !1;
		                this.errorHandled = !1;
		                this.handlers = [];
		                if (handler) {
		                    var _result;
		                    var _error;
		                    var resolved = !1;
		                    var rejected = !1;
		                    var isAsync = !1;
		                    startActive();
		                    try {
		                        handler((function(res) {
		                            if (isAsync) _this.resolve(res); else {
		                                resolved = !0;
		                                _result = res;
		                            }
		                        }), (function(err) {
		                            if (isAsync) _this.reject(err); else {
		                                rejected = !0;
		                                _error = err;
		                            }
		                        }));
		                    } catch (err) {
		                        endActive();
		                        this.reject(err);
		                        return;
		                    }
		                    endActive();
		                    isAsync = !0;
		                    resolved ? this.resolve(_result) : rejected && this.reject(_error);
		                }
		            }
		            var _proto = ZalgoPromise.prototype;
		            _proto.resolve = function(result) {
		                if (this.resolved || this.rejected) return this;
		                if (utils_isPromise(result)) throw new Error("Can not resolve promise with another promise");
		                this.resolved = !0;
		                this.value = result;
		                this.dispatch();
		                return this;
		            };
		            _proto.reject = function(error) {
		                var _this2 = this;
		                if (this.resolved || this.rejected) return this;
		                if (utils_isPromise(error)) throw new Error("Can not reject promise with another promise");
		                if (!error) {
		                    var _err = error && "function" == typeof error.toString ? error.toString() : {}.toString.call(error);
		                    error = new Error("Expected reject to be called with Error, got " + _err);
		                }
		                this.rejected = !0;
		                this.error = error;
		                this.errorHandled || setTimeout((function() {
		                    _this2.errorHandled || function(err, promise) {
		                        if (-1 === dispatchedErrors.indexOf(err)) {
		                            dispatchedErrors.push(err);
		                            setTimeout((function() {
		                                throw err;
		                            }), 1);
		                            for (var j = 0; j < possiblyUnhandledPromiseHandlers.length; j++) possiblyUnhandledPromiseHandlers[j](err, promise);
		                        }
		                    }(error, _this2);
		                }), 1);
		                this.dispatch();
		                return this;
		            };
		            _proto.asyncReject = function(error) {
		                this.errorHandled = !0;
		                this.reject(error);
		                return this;
		            };
		            _proto.dispatch = function() {
		                var resolved = this.resolved, rejected = this.rejected, handlers = this.handlers;
		                if (!this.dispatching && (resolved || rejected)) {
		                    this.dispatching = !0;
		                    startActive();
		                    var chain = function(firstPromise, secondPromise) {
		                        return firstPromise.then((function(res) {
		                            secondPromise.resolve(res);
		                        }), (function(err) {
		                            secondPromise.reject(err);
		                        }));
		                    };
		                    for (var i = 0; i < handlers.length; i++) {
		                        var _handlers$i = handlers[i], onSuccess = _handlers$i.onSuccess, onError = _handlers$i.onError, promise = _handlers$i.promise;
		                        var _result2 = void 0;
		                        if (resolved) try {
		                            _result2 = onSuccess ? onSuccess(this.value) : this.value;
		                        } catch (err) {
		                            promise.reject(err);
		                            continue;
		                        } else if (rejected) {
		                            if (!onError) {
		                                promise.reject(this.error);
		                                continue;
		                            }
		                            try {
		                                _result2 = onError(this.error);
		                            } catch (err) {
		                                promise.reject(err);
		                                continue;
		                            }
		                        }
		                        if (_result2 instanceof ZalgoPromise && (_result2.resolved || _result2.rejected)) {
		                            var promiseResult = _result2;
		                            promiseResult.resolved ? promise.resolve(promiseResult.value) : promise.reject(promiseResult.error);
		                            promiseResult.errorHandled = !0;
		                        } else utils_isPromise(_result2) ? _result2 instanceof ZalgoPromise && (_result2.resolved || _result2.rejected) ? _result2.resolved ? promise.resolve(_result2.value) : promise.reject(_result2.error) : chain(_result2, promise) : promise.resolve(_result2);
		                    }
		                    handlers.length = 0;
		                    this.dispatching = !1;
		                    endActive();
		                }
		            };
		            _proto.then = function(onSuccess, onError) {
		                if (onSuccess && "function" != typeof onSuccess && !onSuccess.call) throw new Error("Promise.then expected a function for success handler");
		                if (onError && "function" != typeof onError && !onError.call) throw new Error("Promise.then expected a function for error handler");
		                var promise = new ZalgoPromise;
		                this.handlers.push({
		                    promise: promise,
		                    onSuccess: onSuccess,
		                    onError: onError
		                });
		                this.errorHandled = !0;
		                this.dispatch();
		                return promise;
		            };
		            _proto.catch = function(onError) {
		                return this.then(void 0, onError);
		            };
		            _proto.finally = function(onFinally) {
		                if (onFinally && "function" != typeof onFinally && !onFinally.call) throw new Error("Promise.finally expected a function");
		                return this.then((function(result) {
		                    return ZalgoPromise.try(onFinally).then((function() {
		                        return result;
		                    }));
		                }), (function(err) {
		                    return ZalgoPromise.try(onFinally).then((function() {
		                        throw err;
		                    }));
		                }));
		            };
		            _proto.timeout = function(time, err) {
		                var _this3 = this;
		                if (this.resolved || this.rejected) return this;
		                var timeout = setTimeout((function() {
		                    _this3.resolved || _this3.rejected || _this3.reject(err || new Error("Promise timed out after " + time + "ms"));
		                }), time);
		                return this.then((function(result) {
		                    clearTimeout(timeout);
		                    return result;
		                }));
		            };
		            _proto.toPromise = function() {
		                if ("undefined" == typeof Promise) throw new TypeError("Could not find Promise");
		                return Promise.resolve(this);
		            };
		            _proto.lazy = function() {
		                this.errorHandled = !0;
		                return this;
		            };
		            ZalgoPromise.resolve = function(value) {
		                return value instanceof ZalgoPromise ? value : utils_isPromise(value) ? new ZalgoPromise((function(resolve, reject) {
		                    return value.then(resolve, reject);
		                })) : (new ZalgoPromise).resolve(value);
		            };
		            ZalgoPromise.reject = function(error) {
		                return (new ZalgoPromise).reject(error);
		            };
		            ZalgoPromise.asyncReject = function(error) {
		                return (new ZalgoPromise).asyncReject(error);
		            };
		            ZalgoPromise.all = function(promises) {
		                var promise = new ZalgoPromise;
		                var count = promises.length;
		                var results = [].slice();
		                if (!count) {
		                    promise.resolve(results);
		                    return promise;
		                }
		                var chain = function(i, firstPromise, secondPromise) {
		                    return firstPromise.then((function(res) {
		                        results[i] = res;
		                        0 == (count -= 1) && promise.resolve(results);
		                    }), (function(err) {
		                        secondPromise.reject(err);
		                    }));
		                };
		                for (var i = 0; i < promises.length; i++) {
		                    var prom = promises[i];
		                    if (prom instanceof ZalgoPromise) {
		                        if (prom.resolved) {
		                            results[i] = prom.value;
		                            count -= 1;
		                            continue;
		                        }
		                    } else if (!utils_isPromise(prom)) {
		                        results[i] = prom;
		                        count -= 1;
		                        continue;
		                    }
		                    chain(i, ZalgoPromise.resolve(prom), promise);
		                }
		                0 === count && promise.resolve(results);
		                return promise;
		            };
		            ZalgoPromise.hash = function(promises) {
		                var result = {};
		                var awaitPromises = [];
		                var _loop = function(key) {
		                    if (promises.hasOwnProperty(key)) {
		                        var value = promises[key];
		                        utils_isPromise(value) ? awaitPromises.push(value.then((function(res) {
		                            result[key] = res;
		                        }))) : result[key] = value;
		                    }
		                };
		                for (var key in promises) _loop(key);
		                return ZalgoPromise.all(awaitPromises).then((function() {
		                    return result;
		                }));
		            };
		            ZalgoPromise.map = function(items, method) {
		                return ZalgoPromise.all(items.map(method));
		            };
		            ZalgoPromise.onPossiblyUnhandledException = function(handler) {
		                return function(handler) {
		                    possiblyUnhandledPromiseHandlers.push(handler);
		                    return {
		                        cancel: function() {
		                            possiblyUnhandledPromiseHandlers.splice(possiblyUnhandledPromiseHandlers.indexOf(handler), 1);
		                        }
		                    };
		                }(handler);
		            };
		            ZalgoPromise.try = function(method, context, args) {
		                if (method && "function" != typeof method && !method.call) throw new Error("Promise.try expected a function");
		                var result;
		                startActive();
		                try {
		                    result = method.apply(context, args || []);
		                } catch (err) {
		                    endActive();
		                    return ZalgoPromise.reject(err);
		                }
		                endActive();
		                return ZalgoPromise.resolve(result);
		            };
		            ZalgoPromise.delay = function(_delay) {
		                return new ZalgoPromise((function(resolve) {
		                    setTimeout(resolve, _delay);
		                }));
		            };
		            ZalgoPromise.isPromise = function(value) {
		                return !!(value && value instanceof ZalgoPromise) || utils_isPromise(value);
		            };
		            ZalgoPromise.flush = function() {
		                return function(Zalgo) {
		                    var promise = flushPromise = flushPromise || new Zalgo;
		                    flushActive();
		                    return promise;
		                }(ZalgoPromise);
		            };
		            return ZalgoPromise;
		        }();
		        function isRegex(item) {
		            return "[object RegExp]" === {}.toString.call(item);
		        }
		        var WINDOW_TYPE = {
		            IFRAME: "iframe",
		            POPUP: "popup"
		        };
		        var IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n";
		        function getActualProtocol(win) {
		            void 0 === win && (win = window$1);
		            return win.location.protocol;
		        }
		        function getProtocol(win) {
		            void 0 === win && (win = window$1);
		            if (win.mockDomain) {
		                var protocol = win.mockDomain.split("//")[0];
		                if (protocol) return protocol;
		            }
		            return getActualProtocol(win);
		        }
		        function isAboutProtocol(win) {
		            void 0 === win && (win = window$1);
		            return "about:" === getProtocol(win);
		        }
		        function utils_getParent(win) {
		            void 0 === win && (win = window$1);
		            if (win) try {
		                if (win.parent && win.parent !== win) return win.parent;
		            } catch (err) {}
		        }
		        function getOpener(win) {
		            void 0 === win && (win = window$1);
		            if (win && !utils_getParent(win)) try {
		                return win.opener;
		            } catch (err) {}
		        }
		        function canReadFromWindow(win) {
		            try {
		                return !0;
		            } catch (err) {}
		            return !1;
		        }
		        function getActualDomain(win) {
		            void 0 === win && (win = window$1);
		            var location = win.location;
		            if (!location) throw new Error("Can not read window location");
		            var protocol = getActualProtocol(win);
		            if (!protocol) throw new Error("Can not read window protocol");
		            if ("file:" === protocol) return "file://";
		            if ("about:" === protocol) {
		                var parent = utils_getParent(win);
		                return parent && canReadFromWindow() ? getActualDomain(parent) : "about://";
		            }
		            var host = location.host;
		            if (!host) throw new Error("Can not read window host");
		            return protocol + "//" + host;
		        }
		        function getDomain(win) {
		            void 0 === win && (win = window$1);
		            var domain = getActualDomain(win);
		            return domain && win.mockDomain && 0 === win.mockDomain.indexOf("mock:") ? win.mockDomain : domain;
		        }
		        function isSameDomain(win) {
		            if (!function(win) {
		                try {
		                    if (win === window$1) return !0;
		                } catch (err) {}
		                try {
		                    var desc = Object.getOwnPropertyDescriptor(win, "location");
		                    if (desc && !1 === desc.enumerable) return !1;
		                } catch (err) {}
		                try {
		                    if (isAboutProtocol(win) && canReadFromWindow()) return !0;
		                } catch (err) {}
		                try {
		                    if (function(win) {
		                        void 0 === win && (win = window$1);
		                        return "mock:" === getProtocol(win);
		                    }(win) && canReadFromWindow()) return !0;
		                } catch (err) {}
		                try {
		                    if (getActualDomain(win) === getActualDomain(window$1)) return !0;
		                } catch (err) {}
		                return !1;
		            }(win)) return !1;
		            try {
		                if (win === window$1) return !0;
		                if (isAboutProtocol(win) && canReadFromWindow()) return !0;
		                if (getDomain(window$1) === getDomain(win)) return !0;
		            } catch (err) {}
		            return !1;
		        }
		        function assertSameDomain(win) {
		            if (!isSameDomain(win)) throw new Error("Expected window to be same domain");
		            return win;
		        }
		        function isAncestorParent(parent, child) {
		            if (!parent || !child) return !1;
		            var childParent = utils_getParent(child);
		            return childParent ? childParent === parent : -1 !== function(win) {
		                var result = [];
		                try {
		                    for (;win.parent !== win; ) {
		                        result.push(win.parent);
		                        win = win.parent;
		                    }
		                } catch (err) {}
		                return result;
		            }(child).indexOf(parent);
		        }
		        function getFrames(win) {
		            var result = [];
		            var frames;
		            try {
		                frames = win.frames;
		            } catch (err) {
		                frames = win;
		            }
		            var len;
		            try {
		                len = frames.length;
		            } catch (err) {}
		            if (0 === len) return result;
		            if (len) {
		                for (var i = 0; i < len; i++) {
		                    var frame = void 0;
		                    try {
		                        frame = frames[i];
		                    } catch (err) {
		                        continue;
		                    }
		                    result.push(frame);
		                }
		                return result;
		            }
		            for (var _i = 0; _i < 100; _i++) {
		                var _frame = void 0;
		                try {
		                    _frame = frames[_i];
		                } catch (err) {
		                    return result;
		                }
		                if (!_frame) return result;
		                result.push(_frame);
		            }
		            return result;
		        }
		        function getAllChildFrames(win) {
		            var result = [];
		            for (var _i3 = 0, _getFrames2 = getFrames(win); _i3 < _getFrames2.length; _i3++) {
		                var frame = _getFrames2[_i3];
		                result.push(frame);
		                for (var _i5 = 0, _getAllChildFrames2 = getAllChildFrames(frame); _i5 < _getAllChildFrames2.length; _i5++) result.push(_getAllChildFrames2[_i5]);
		            }
		            return result;
		        }
		        function getTop(win) {
		            void 0 === win && (win = window$1);
		            try {
		                if (win.top) return win.top;
		            } catch (err) {}
		            if (utils_getParent(win) === win) return win;
		            try {
		                if (isAncestorParent(window$1, win) && window$1.top) return window$1.top;
		            } catch (err) {}
		            try {
		                if (isAncestorParent(win, window$1) && window$1.top) return window$1.top;
		            } catch (err) {}
		            for (var _i7 = 0, _getAllChildFrames4 = getAllChildFrames(win); _i7 < _getAllChildFrames4.length; _i7++) {
		                var frame = _getAllChildFrames4[_i7];
		                try {
		                    if (frame.top) return frame.top;
		                } catch (err) {}
		                if (utils_getParent(frame) === frame) return frame;
		            }
		        }
		        function getAllFramesInWindow(win) {
		            var top = getTop(win);
		            if (!top) throw new Error("Can not determine top window");
		            var result = [].concat(getAllChildFrames(top), [ top ]);
		            -1 === result.indexOf(win) && (result = [].concat(result, [ win ], getAllChildFrames(win)));
		            return result;
		        }
		        var iframeWindows = [];
		        var iframeFrames = [];
		        function isWindowClosed(win, allowMock) {
		            void 0 === allowMock && (allowMock = !0);
		            try {
		                if (win === window$1) return !1;
		            } catch (err) {
		                return !0;
		            }
		            try {
		                if (!win) return !0;
		            } catch (err) {
		                return !0;
		            }
		            try {
		                if (win.closed) return !0;
		            } catch (err) {
		                return !err || err.message !== IE_WIN_ACCESS_ERROR;
		            }
		            if (allowMock && isSameDomain(win)) try {
		                if (win.mockclosed) return !0;
		            } catch (err) {}
		            try {
		                if (!win.parent || !win.top) return !0;
		            } catch (err) {}
		            var iframeIndex = function(collection, item) {
		                for (var i = 0; i < collection.length; i++) try {
		                    if (collection[i] === item) return i;
		                } catch (err) {}
		                return -1;
		            }(iframeWindows, win);
		            if (-1 !== iframeIndex) {
		                var frame = iframeFrames[iframeIndex];
		                if (frame && function(frame) {
		                    if (!frame.contentWindow) return !0;
		                    if (!frame.parentNode) return !0;
		                    var doc = frame.ownerDocument;
		                    if (doc && doc.documentElement && !doc.documentElement.contains(frame)) {
		                        var parent = frame;
		                        for (;parent.parentNode && parent.parentNode !== parent; ) parent = parent.parentNode;
		                        if (!parent.host || !doc.documentElement.contains(parent.host)) return !0;
		                    }
		                    return !1;
		                }(frame)) return !0;
		            }
		            return !1;
		        }
		        function getFrameByName(win, name) {
		            var winFrames = getFrames(win);
		            for (var _i9 = 0; _i9 < winFrames.length; _i9++) {
		                var childFrame = winFrames[_i9];
		                try {
		                    if (isSameDomain(childFrame) && childFrame.name === name && -1 !== winFrames.indexOf(childFrame)) return childFrame;
		                } catch (err) {}
		            }
		            try {
		                if (-1 !== winFrames.indexOf(win.frames[name])) return win.frames[name];
		            } catch (err) {}
		            try {
		                if (-1 !== winFrames.indexOf(win[name])) return win[name];
		            } catch (err) {}
		        }
		        function getAncestor(win) {
		            void 0 === win && (win = window$1);
		            return getOpener(win = win || window$1) || utils_getParent(win) || void 0;
		        }
		        function anyMatch(collection1, collection2) {
		            for (var _i17 = 0; _i17 < collection1.length; _i17++) {
		                var item1 = collection1[_i17];
		                for (var _i19 = 0; _i19 < collection2.length; _i19++) if (item1 === collection2[_i19]) return !0;
		            }
		            return !1;
		        }
		        function getDistanceFromTop(win) {
		            void 0 === win && (win = window$1);
		            var distance = 0;
		            var parent = win;
		            for (;parent; ) (parent = utils_getParent(parent)) && (distance += 1);
		            return distance;
		        }
		        function isSameTopWindow(win1, win2) {
		            var top1 = getTop(win1) || win1;
		            var top2 = getTop(win2) || win2;
		            try {
		                if (top1 && top2) return top1 === top2;
		            } catch (err) {}
		            var allFrames1 = getAllFramesInWindow(win1);
		            var allFrames2 = getAllFramesInWindow(win2);
		            if (anyMatch(allFrames1, allFrames2)) return !0;
		            var opener1 = getOpener(top1);
		            var opener2 = getOpener(top2);
		            return opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2) || opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1), 
		            !1;
		        }
		        function matchDomain(pattern, origin) {
		            if ("string" == typeof pattern) {
		                if ("string" == typeof origin) return "*" === pattern || origin === pattern;
		                if (isRegex(origin)) return !1;
		                if (Array.isArray(origin)) return !1;
		            }
		            return isRegex(pattern) ? isRegex(origin) ? pattern.toString() === origin.toString() : !Array.isArray(origin) && Boolean(origin.match(pattern)) : !!Array.isArray(pattern) && (Array.isArray(origin) ? JSON.stringify(pattern) === JSON.stringify(origin) : !isRegex(origin) && pattern.some((function(subpattern) {
		                return matchDomain(subpattern, origin);
		            })));
		        }
		        function getDomainFromUrl(url) {
		            return url.match(/^(https?|mock|file):\/\//) ? url.split("/").slice(0, 3).join("/") : getDomain();
		        }
		        function onCloseWindow(win, callback, delay, maxtime) {
		            void 0 === delay && (delay = 1e3);
		            void 0 === maxtime && (maxtime = 1 / 0);
		            var timeout;
		            !function check() {
		                if (isWindowClosed(win)) {
		                    timeout && clearTimeout(timeout);
		                    return callback();
		                }
		                if (maxtime <= 0) clearTimeout(timeout); else {
		                    maxtime -= delay;
		                    timeout = setTimeout(check, delay);
		                }
		            }();
		            return {
		                cancel: function() {
		                    timeout && clearTimeout(timeout);
		                }
		            };
		        }
		        function isWindow(obj) {
		            try {
		                if (obj === window$1) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if ("[object Window]" === {}.toString.call(obj)) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (window$1.Window && obj instanceof window$1.Window) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && obj.self === obj) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && obj.parent === obj) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && obj.top === obj) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && "__unlikely_value__" === obj.__cross_domain_utils_window_check__) return !1;
		            } catch (err) {
		                return !0;
		            }
		            try {
		                if ("postMessage" in obj && "self" in obj && "location" in obj) return !0;
		            } catch (err) {}
		            return !1;
		        }
		        function getFrameForWindow(win) {
		            if (isSameDomain(win)) return assertSameDomain(win).frameElement;
		            for (var _i21 = 0, _document$querySelect2 = document.querySelectorAll("iframe"); _i21 < _document$querySelect2.length; _i21++) {
		                var frame = _document$querySelect2[_i21];
		                if (frame && frame.contentWindow && frame.contentWindow === win) return frame;
		            }
		        }
		        function closeWindow(win) {
		            if (function(win) {
		                void 0 === win && (win = window$1);
		                return Boolean(utils_getParent(win));
		            }(win)) {
		                var frame = getFrameForWindow(win);
		                if (frame && frame.parentElement) {
		                    frame.parentElement.removeChild(frame);
		                    return;
		                }
		            }
		            try {
		                win.close();
		            } catch (err) {}
		        }
		        function util_safeIndexOf(collection, item) {
		            for (var i = 0; i < collection.length; i++) try {
		                if (collection[i] === item) return i;
		            } catch (err) {}
		            return -1;
		        }
		        var weakmap_CrossDomainSafeWeakMap = function() {
		            function CrossDomainSafeWeakMap() {
		                this.name = void 0;
		                this.weakmap = void 0;
		                this.keys = void 0;
		                this.values = void 0;
		                this.name = "__weakmap_" + (1e9 * Math.random() >>> 0) + "__";
		                if (function() {
		                    if ("undefined" == typeof WeakMap) return !1;
		                    if (void 0 === Object.freeze) return !1;
		                    try {
		                        var testWeakMap = new WeakMap;
		                        var testKey = {};
		                        Object.freeze(testKey);
		                        testWeakMap.set(testKey, "__testvalue__");
		                        return "__testvalue__" === testWeakMap.get(testKey);
		                    } catch (err) {
		                        return !1;
		                    }
		                }()) try {
		                    this.weakmap = new WeakMap;
		                } catch (err) {}
		                this.keys = [];
		                this.values = [];
		            }
		            var _proto = CrossDomainSafeWeakMap.prototype;
		            _proto._cleanupClosedWindows = function() {
		                var weakmap = this.weakmap;
		                var keys = this.keys;
		                for (var i = 0; i < keys.length; i++) {
		                    var value = keys[i];
		                    if (isWindow(value) && isWindowClosed(value)) {
		                        if (weakmap) try {
		                            weakmap.delete(value);
		                        } catch (err) {}
		                        keys.splice(i, 1);
		                        this.values.splice(i, 1);
		                        i -= 1;
		                    }
		                }
		            };
		            _proto.isSafeToReadWrite = function(key) {
		                return !isWindow(key);
		            };
		            _proto.set = function(key, value) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    weakmap.set(key, value);
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var name = this.name;
		                    var entry = key[name];
		                    entry && entry[0] === key ? entry[1] = value : Object.defineProperty(key, name, {
		                        value: [ key, value ],
		                        writable: !0
		                    });
		                    return;
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                var keys = this.keys;
		                var values = this.values;
		                var index = util_safeIndexOf(keys, key);
		                if (-1 === index) {
		                    keys.push(key);
		                    values.push(value);
		                } else values[index] = value;
		            };
		            _proto.get = function(key) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    if (weakmap.has(key)) return weakmap.get(key);
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var entry = key[this.name];
		                    return entry && entry[0] === key ? entry[1] : void 0;
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                var index = util_safeIndexOf(this.keys, key);
		                if (-1 !== index) return this.values[index];
		            };
		            _proto.delete = function(key) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    weakmap.delete(key);
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var entry = key[this.name];
		                    entry && entry[0] === key && (entry[0] = entry[1] = void 0);
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                var keys = this.keys;
		                var index = util_safeIndexOf(keys, key);
		                if (-1 !== index) {
		                    keys.splice(index, 1);
		                    this.values.splice(index, 1);
		                }
		            };
		            _proto.has = function(key) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    if (weakmap.has(key)) return !0;
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var entry = key[this.name];
		                    return !(!entry || entry[0] !== key);
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                return -1 !== util_safeIndexOf(this.keys, key);
		            };
		            _proto.getOrSet = function(key, getter) {
		                if (this.has(key)) return this.get(key);
		                var value = getter();
		                this.set(key, value);
		                return value;
		            };
		            return CrossDomainSafeWeakMap;
		        }();
		        function _getPrototypeOf(o) {
		            return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
		                return o.__proto__ || Object.getPrototypeOf(o);
		            })(o);
		        }
		        function _isNativeReflectConstruct() {
		            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
		            if (Reflect.construct.sham) return !1;
		            if ("function" == typeof Proxy) return !0;
		            try {
		                Date.prototype.toString.call(Reflect.construct(Date, [], (function() {})));
		                return !0;
		            } catch (e) {
		                return !1;
		            }
		        }
		        function construct_construct(Parent, args, Class) {
		            return (construct_construct = _isNativeReflectConstruct() ? Reflect.construct : function(Parent, args, Class) {
		                var a = [ null ];
		                a.push.apply(a, args);
		                var instance = new (Function.bind.apply(Parent, a));
		                Class && _setPrototypeOf(instance, Class.prototype);
		                return instance;
		            }).apply(null, arguments);
		        }
		        function wrapNativeSuper_wrapNativeSuper(Class) {
		            var _cache = "function" == typeof Map ? new Map : void 0;
		            return (wrapNativeSuper_wrapNativeSuper = function(Class) {
		                if (null === Class || !(fn = Class, -1 !== Function.toString.call(fn).indexOf("[native code]"))) return Class;
		                var fn;
		                if ("function" != typeof Class) throw new TypeError("Super expression must either be null or a function");
		                if (void 0 !== _cache) {
		                    if (_cache.has(Class)) return _cache.get(Class);
		                    _cache.set(Class, Wrapper);
		                }
		                function Wrapper() {
		                    return construct_construct(Class, arguments, _getPrototypeOf(this).constructor);
		                }
		                Wrapper.prototype = Object.create(Class.prototype, {
		                    constructor: {
		                        value: Wrapper,
		                        enumerable: !1,
		                        writable: !0,
		                        configurable: !0
		                    }
		                });
		                return _setPrototypeOf(Wrapper, Class);
		            })(Class);
		        }
		        function getFunctionName(fn) {
		            return fn.name || fn.__name__ || fn.displayName || "anonymous";
		        }
		        function setFunctionName(fn, name) {
		            try {
		                delete fn.name;
		                fn.name = name;
		            } catch (err) {}
		            fn.__name__ = fn.displayName = name;
		            return fn;
		        }
		        function base64encode(str) {
		            if ("function" == typeof btoa) return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (function(m, p1) {
		                return String.fromCharCode(parseInt(p1, 16));
		            }))).replace(/[=]/g, "");
		            if ("undefined" != typeof Buffer) return Buffer.from(str, "utf8").toString("base64").replace(/[=]/g, "");
		            throw new Error("Can not find window.btoa or Buffer");
		        }
		        function uniqueID() {
		            var chars = "0123456789abcdef";
		            return "uid_" + "xxxxxxxxxx".replace(/./g, (function() {
		                return chars.charAt(Math.floor(Math.random() * chars.length));
		            })) + "_" + base64encode((new Date).toISOString().slice(11, 19).replace("T", ".")).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
		        }
		        var objectIDs;
		        function serializeArgs(args) {
		            try {
		                return JSON.stringify([].slice.call(args), (function(subkey, val) {
		                    return "function" == typeof val ? "memoize[" + function(obj) {
		                        objectIDs = objectIDs || new weakmap_CrossDomainSafeWeakMap;
		                        if (null == obj || "object" != typeof obj && "function" != typeof obj) throw new Error("Invalid object");
		                        var uid = objectIDs.get(obj);
		                        if (!uid) {
		                            uid = typeof obj + ":" + uniqueID();
		                            objectIDs.set(obj, uid);
		                        }
		                        return uid;
		                    }(val) + "]" : val;
		                }));
		            } catch (err) {
		                throw new Error("Arguments not serializable -- can not be used to memoize");
		            }
		        }
		        function getEmptyObject() {
		            return {};
		        }
		        var memoizeGlobalIndex = 0;
		        var memoizeGlobalIndexValidFrom = 0;
		        function memoize(method, options) {
		            void 0 === options && (options = {});
		            var _options$thisNamespac = options.thisNamespace, thisNamespace = void 0 !== _options$thisNamespac && _options$thisNamespac, cacheTime = options.time;
		            var simpleCache;
		            var thisCache;
		            var memoizeIndex = memoizeGlobalIndex;
		            memoizeGlobalIndex += 1;
		            var memoizedFunction = function() {
		                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		                if (memoizeIndex < memoizeGlobalIndexValidFrom) {
		                    simpleCache = null;
		                    thisCache = null;
		                    memoizeIndex = memoizeGlobalIndex;
		                    memoizeGlobalIndex += 1;
		                }
		                var cache;
		                cache = thisNamespace ? (thisCache = thisCache || new weakmap_CrossDomainSafeWeakMap).getOrSet(this, getEmptyObject) : simpleCache = simpleCache || {};
		                var cacheKey = serializeArgs(args);
		                var cacheResult = cache[cacheKey];
		                if (cacheResult && cacheTime && Date.now() - cacheResult.time < cacheTime) {
		                    delete cache[cacheKey];
		                    cacheResult = null;
		                }
		                if (cacheResult) return cacheResult.value;
		                var time = Date.now();
		                var value = method.apply(this, arguments);
		                cache[cacheKey] = {
		                    time: time,
		                    value: value
		                };
		                return value;
		            };
		            memoizedFunction.reset = function() {
		                simpleCache = null;
		                thisCache = null;
		            };
		            return setFunctionName(memoizedFunction, (options.name || getFunctionName(method)) + "::memoized");
		        }
		        memoize.clear = function() {
		            memoizeGlobalIndexValidFrom = memoizeGlobalIndex;
		        };
		        function memoizePromise(method) {
		            var cache = {};
		            function memoizedPromiseFunction() {
		                var _arguments = arguments, _this = this;
		                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		                var key = serializeArgs(args);
		                if (cache.hasOwnProperty(key)) return cache[key];
		                cache[key] = promise_ZalgoPromise.try((function() {
		                    return method.apply(_this, _arguments);
		                })).finally((function() {
		                    delete cache[key];
		                }));
		                return cache[key];
		            }
		            memoizedPromiseFunction.reset = function() {
		                cache = {};
		            };
		            return setFunctionName(memoizedPromiseFunction, getFunctionName(method) + "::promiseMemoized");
		        }
		        function src_util_noop() {}
		        function once(method) {
		            var called = !1;
		            return setFunctionName((function() {
		                if (!called) {
		                    called = !0;
		                    return method.apply(this, arguments);
		                }
		            }), getFunctionName(method) + "::once");
		        }
		        function stringifyError(err, level) {
		            void 0 === level && (level = 1);
		            if (level >= 3) return "stringifyError stack overflow";
		            try {
		                if (!err) return "<unknown error: " + {}.toString.call(err) + ">";
		                if ("string" == typeof err) return err;
		                if (err instanceof Error) {
		                    var stack = err && err.stack;
		                    var message = err && err.message;
		                    if (stack && message) return -1 !== stack.indexOf(message) ? stack : message + "\n" + stack;
		                    if (stack) return stack;
		                    if (message) return message;
		                }
		                return err && err.toString && "function" == typeof err.toString ? err.toString() : {}.toString.call(err);
		            } catch (newErr) {
		                return "Error while stringifying error: " + stringifyError(newErr, level + 1);
		            }
		        }
		        function stringify(item) {
		            return "string" == typeof item ? item : item && item.toString && "function" == typeof item.toString ? item.toString() : {}.toString.call(item);
		        }
		        function extend(obj, source) {
		            if (!source) return obj;
		            if (Object.assign) return Object.assign(obj, source);
		            for (var key in source) source.hasOwnProperty(key) && (obj[key] = source[key]);
		            return obj;
		        }
		        memoize((function(obj) {
		            if (Object.values) return Object.values(obj);
		            var result = [];
		            for (var key in obj) obj.hasOwnProperty(key) && result.push(obj[key]);
		            return result;
		        }));
		        function identity(item) {
		            return item;
		        }
		        function safeInterval(method, time) {
		            var timeout;
		            !function loop() {
		                timeout = setTimeout((function() {
		                    method();
		                    loop();
		                }), time);
		            }();
		            return {
		                cancel: function() {
		                    clearTimeout(timeout);
		                }
		            };
		        }
		        function arrayFrom(item) {
		            return [].slice.call(item);
		        }
		        function isDefined(value) {
		            return null != value;
		        }
		        function util_isRegex(item) {
		            return "[object RegExp]" === {}.toString.call(item);
		        }
		        function util_getOrSet(obj, key, getter) {
		            if (obj.hasOwnProperty(key)) return obj[key];
		            var val = getter();
		            obj[key] = val;
		            return val;
		        }
		        function cleanup(obj) {
		            var tasks = [];
		            var cleaned = !1;
		            var cleanErr;
		            var cleaner = {
		                set: function(name, item) {
		                    if (!cleaned) {
		                        obj[name] = item;
		                        cleaner.register((function() {
		                            delete obj[name];
		                        }));
		                    }
		                    return item;
		                },
		                register: function(method) {
		                    var task = once((function() {
		                        return method(cleanErr);
		                    }));
		                    cleaned ? method(cleanErr) : tasks.push(task);
		                    return {
		                        cancel: function() {
		                            var index = tasks.indexOf(task);
		                            -1 !== index && tasks.splice(index, 1);
		                        }
		                    };
		                },
		                all: function(err) {
		                    cleanErr = err;
		                    var results = [];
		                    cleaned = !0;
		                    for (;tasks.length; ) {
		                        var task = tasks.shift();
		                        results.push(task());
		                    }
		                    return promise_ZalgoPromise.all(results).then(src_util_noop);
		                }
		            };
		            return cleaner;
		        }
		        function assertExists(name, thing) {
		            if (null == thing) throw new Error("Expected " + name + " to be present");
		            return thing;
		        }
		        var util_ExtendableError = function(_Error) {
		            _inheritsLoose(ExtendableError, _Error);
		            function ExtendableError(message) {
		                var _this6;
		                (_this6 = _Error.call(this, message) || this).name = _this6.constructor.name;
		                "function" == typeof Error.captureStackTrace ? Error.captureStackTrace(function(self) {
		                    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		                    return self;
		                }(_this6), _this6.constructor) : _this6.stack = new Error(message).stack;
		                return _this6;
		            }
		            return ExtendableError;
		        }(wrapNativeSuper_wrapNativeSuper(Error));
		        function getBody() {
		            var body = document.body;
		            if (!body) throw new Error("Body element not found");
		            return body;
		        }
		        function isDocumentReady() {
		            return Boolean(document.body) && "complete" === document.readyState;
		        }
		        function isDocumentInteractive() {
		            return Boolean(document.body) && "interactive" === document.readyState;
		        }
		        function urlEncode(str) {
		            return encodeURIComponent(str);
		        }
		        memoize((function() {
		            return new promise_ZalgoPromise((function(resolve) {
		                if (isDocumentReady() || isDocumentInteractive()) return resolve();
		                var interval = setInterval((function() {
		                    if (isDocumentReady() || isDocumentInteractive()) {
		                        clearInterval(interval);
		                        return resolve();
		                    }
		                }), 10);
		            }));
		        }));
		        function parseQuery(queryString) {
		            return function(method, logic, args) {
		                void 0 === args && (args = []);
		                var cache = method.__inline_memoize_cache__ = method.__inline_memoize_cache__ || {};
		                var key = serializeArgs(args);
		                return cache.hasOwnProperty(key) ? cache[key] : cache[key] = function() {
		                    var params = {};
		                    if (!queryString) return params;
		                    if (-1 === queryString.indexOf("=")) return params;
		                    for (var _i2 = 0, _queryString$split2 = queryString.split("&"); _i2 < _queryString$split2.length; _i2++) {
		                        var pair = _queryString$split2[_i2];
		                        (pair = pair.split("="))[0] && pair[1] && (params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]));
		                    }
		                    return params;
		                }.apply(void 0, args);
		            }(parseQuery, 0, [ queryString ]);
		        }
		        function extendQuery(originalQuery, props) {
		            void 0 === props && (props = {});
		            return props && Object.keys(props).length ? function(obj) {
		                void 0 === obj && (obj = {});
		                return Object.keys(obj).filter((function(key) {
		                    return "string" == typeof obj[key] || "boolean" == typeof obj[key];
		                })).map((function(key) {
		                    var val = obj[key];
		                    if ("string" != typeof val && "boolean" != typeof val) throw new TypeError("Invalid type for query");
		                    return urlEncode(key) + "=" + urlEncode(val.toString());
		                })).join("&");
		            }(_extends({}, parseQuery(originalQuery), props)) : originalQuery;
		        }
		        function appendChild(container, child) {
		            container.appendChild(child);
		        }
		        function isElement(element) {
		            return element instanceof window$1.Element || null !== element && "object" == typeof element && 1 === element.nodeType && "object" == typeof element.style && "object" == typeof element.ownerDocument;
		        }
		        function getElementSafe(id, doc) {
		            void 0 === doc && (doc = document);
		            return isElement(id) ? id : "string" == typeof id ? doc.querySelector(id) : void 0;
		        }
		        function elementReady(id) {
		            return new promise_ZalgoPromise((function(resolve, reject) {
		                var name = stringify(id);
		                var el = getElementSafe(id);
		                if (el) return resolve(el);
		                if (isDocumentReady()) return reject(new Error("Document is ready and element " + name + " does not exist"));
		                var interval = setInterval((function() {
		                    if (el = getElementSafe(id)) {
		                        resolve(el);
		                        clearInterval(interval);
		                    } else if (isDocumentReady()) {
		                        clearInterval(interval);
		                        return reject(new Error("Document is ready and element " + name + " does not exist"));
		                    }
		                }), 10);
		            }));
		        }
		        var dom_PopupOpenError = function(_ExtendableError) {
		            _inheritsLoose(PopupOpenError, _ExtendableError);
		            function PopupOpenError() {
		                return _ExtendableError.apply(this, arguments) || this;
		            }
		            return PopupOpenError;
		        }(util_ExtendableError);
		        var awaitFrameLoadPromises;
		        function awaitFrameLoad(frame) {
		            if ((awaitFrameLoadPromises = awaitFrameLoadPromises || new weakmap_CrossDomainSafeWeakMap).has(frame)) {
		                var _promise = awaitFrameLoadPromises.get(frame);
		                if (_promise) return _promise;
		            }
		            var promise = new promise_ZalgoPromise((function(resolve, reject) {
		                frame.addEventListener("load", (function() {
		                    !function(frame) {
		                        !function() {
		                            for (var i = 0; i < iframeWindows.length; i++) {
		                                var closed = !1;
		                                try {
		                                    closed = iframeWindows[i].closed;
		                                } catch (err) {}
		                                if (closed) {
		                                    iframeFrames.splice(i, 1);
		                                    iframeWindows.splice(i, 1);
		                                }
		                            }
		                        }();
		                        if (frame && frame.contentWindow) try {
		                            iframeWindows.push(frame.contentWindow);
		                            iframeFrames.push(frame);
		                        } catch (err) {}
		                    }(frame);
		                    resolve(frame);
		                }));
		                frame.addEventListener("error", (function(err) {
		                    frame.contentWindow ? resolve(frame) : reject(err);
		                }));
		            }));
		            awaitFrameLoadPromises.set(frame, promise);
		            return promise;
		        }
		        function awaitFrameWindow(frame) {
		            return awaitFrameLoad(frame).then((function(loadedFrame) {
		                if (!loadedFrame.contentWindow) throw new Error("Could not find window in iframe");
		                return loadedFrame.contentWindow;
		            }));
		        }
		        function dom_iframe(options, container) {
		            void 0 === options && (options = {});
		            var style = options.style || {};
		            var frame = function(tag, options, container) {
		                void 0 === tag && (tag = "div");
		                void 0 === options && (options = {});
		                tag = tag.toLowerCase();
		                var element = document.createElement(tag);
		                options.style && extend(element.style, options.style);
		                options.class && (element.className = options.class.join(" "));
		                options.id && element.setAttribute("id", options.id);
		                if (options.attributes) for (var _i10 = 0, _Object$keys2 = Object.keys(options.attributes); _i10 < _Object$keys2.length; _i10++) {
		                    var key = _Object$keys2[_i10];
		                    element.setAttribute(key, options.attributes[key]);
		                }
		                options.styleSheet && function(el, styleText, doc) {
		                    void 0 === doc && (doc = window$1.document);
		                    el.styleSheet ? el.styleSheet.cssText = styleText : el.appendChild(doc.createTextNode(styleText));
		                }(element, options.styleSheet);
		                if (options.html) {
		                    if ("iframe" === tag) throw new Error("Iframe html can not be written unless container provided and iframe in DOM");
		                    element.innerHTML = options.html;
		                }
		                return element;
		            }("iframe", {
		                attributes: _extends({
		                    allowTransparency: "true"
		                }, options.attributes || {}),
		                style: _extends({
		                    backgroundColor: "transparent",
		                    border: "none"
		                }, style),
		                html: options.html,
		                class: options.class
		            });
		            var isIE = window$1.navigator.userAgent.match(/MSIE|Edge/i);
		            frame.hasAttribute("id") || frame.setAttribute("id", uniqueID());
		            awaitFrameLoad(frame);
		            (options.url || isIE) && frame.setAttribute("src", options.url || "about:blank");
		            return frame;
		        }
		        function addEventListener(obj, event, handler) {
		            obj.addEventListener(event, handler);
		            return {
		                cancel: function() {
		                    obj.removeEventListener(event, handler);
		                }
		            };
		        }
		        function showElement(element) {
		            element.style.setProperty("display", "");
		        }
		        function hideElement(element) {
		            element.style.setProperty("display", "none", "important");
		        }
		        function destroyElement(element) {
		            element && element.parentNode && element.parentNode.removeChild(element);
		        }
		        function isElementClosed(el) {
		            return !(el && el.parentNode && el.ownerDocument && el.ownerDocument.documentElement && el.ownerDocument.documentElement.contains(el));
		        }
		        function onResize(el, handler, _temp) {
		            var _ref2 = void 0 === _temp ? {} : _temp, _ref2$width = _ref2.width, width = void 0 === _ref2$width || _ref2$width, _ref2$height = _ref2.height, height = void 0 === _ref2$height || _ref2$height, _ref2$interval = _ref2.interval, interval = void 0 === _ref2$interval ? 100 : _ref2$interval, _ref2$win = _ref2.win, win = void 0 === _ref2$win ? window$1 : _ref2$win;
		            var currentWidth = el.offsetWidth;
		            var currentHeight = el.offsetHeight;
		            var canceled = !1;
		            handler({
		                width: currentWidth,
		                height: currentHeight
		            });
		            var check = function() {
		                if (!canceled && function(el) {
		                    return Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
		                }(el)) {
		                    var newWidth = el.offsetWidth;
		                    var newHeight = el.offsetHeight;
		                    (width && newWidth !== currentWidth || height && newHeight !== currentHeight) && handler({
		                        width: newWidth,
		                        height: newHeight
		                    });
		                    currentWidth = newWidth;
		                    currentHeight = newHeight;
		                }
		            };
		            var observer;
		            var timeout;
		            win.addEventListener("resize", check);
		            if (void 0 !== win.ResizeObserver) {
		                (observer = new win.ResizeObserver(check)).observe(el);
		                timeout = safeInterval(check, 10 * interval);
		            } else if (void 0 !== win.MutationObserver) {
		                (observer = new win.MutationObserver(check)).observe(el, {
		                    attributes: !0,
		                    childList: !0,
		                    subtree: !0,
		                    characterData: !1
		                });
		                timeout = safeInterval(check, 10 * interval);
		            } else timeout = safeInterval(check, interval);
		            return {
		                cancel: function() {
		                    canceled = !0;
		                    observer.disconnect();
		                    window$1.removeEventListener("resize", check);
		                    timeout.cancel();
		                }
		            };
		        }
		        function isShadowElement(element) {
		            for (;element.parentNode; ) element = element.parentNode;
		            return "[object ShadowRoot]" === element.toString();
		        }
		        var currentScript = "undefined" != typeof document ? document.currentScript : null;
		        var getCurrentScript = memoize((function() {
		            if (currentScript) return currentScript;
		            if (currentScript = function() {
		                try {
		                    var stack = function() {
		                        try {
		                            throw new Error("_");
		                        } catch (err) {
		                            return err.stack || "";
		                        }
		                    }();
		                    var stackDetails = /.*at [^(]*\((.*):(.+):(.+)\)$/gi.exec(stack);
		                    var scriptLocation = stackDetails && stackDetails[1];
		                    if (!scriptLocation) return;
		                    for (var _i22 = 0, _Array$prototype$slic2 = [].slice.call(document.getElementsByTagName("script")).reverse(); _i22 < _Array$prototype$slic2.length; _i22++) {
		                        var script = _Array$prototype$slic2[_i22];
		                        if (script.src && script.src === scriptLocation) return script;
		                    }
		                } catch (err) {}
		            }()) return currentScript;
		            throw new Error("Can not determine current script");
		        }));
		        var currentUID = uniqueID();
		        memoize((function() {
		            var script;
		            try {
		                script = getCurrentScript();
		            } catch (err) {
		                return currentUID;
		            }
		            var uid = script.getAttribute("data-uid");
		            if (uid && "string" == typeof uid) return uid;
		            if ((uid = script.getAttribute("data-uid-auto")) && "string" == typeof uid) return uid;
		            if (script.src) {
		                var hashedString = function(str) {
		                    var hash = "";
		                    for (var i = 0; i < str.length; i++) {
		                        var total = str[i].charCodeAt(0) * i;
		                        str[i + 1] && (total += str[i + 1].charCodeAt(0) * (i - 1));
		                        hash += String.fromCharCode(97 + Math.abs(total) % 26);
		                    }
		                    return hash;
		                }(JSON.stringify({
		                    src: script.src,
		                    dataset: script.dataset
		                }));
		                uid = "uid_" + hashedString.slice(hashedString.length - 30);
		            } else uid = uniqueID();
		            script.setAttribute("data-uid-auto", uid);
		            return uid;
		        }));
		        function toPx(val) {
		            return function(val) {
		                if ("number" == typeof val) return val;
		                var match = val.match(/^([0-9]+)(px|%)$/);
		                if (!match) throw new Error("Could not match css value from " + val);
		                return parseInt(match[1], 10);
		            }(val) + "px";
		        }
		        function toCSS(val) {
		            return "number" == typeof val ? toPx(val) : "string" == typeof (str = val) && /^[0-9]+%$/.test(str) ? val : toPx(val);
		            var str;
		        }
		        function global_getGlobal(win) {
		            void 0 === win && (win = window$1);
		            var globalKey = "__post_robot_10_0_44__";
		            return win !== window$1 ? win[globalKey] : win[globalKey] = win[globalKey] || {};
		        }
		        var getObj = function() {
		            return {};
		        };
		        function globalStore(key, defStore) {
		            void 0 === key && (key = "store");
		            void 0 === defStore && (defStore = getObj);
		            return util_getOrSet(global_getGlobal(), key, (function() {
		                var store = defStore();
		                return {
		                    has: function(storeKey) {
		                        return store.hasOwnProperty(storeKey);
		                    },
		                    get: function(storeKey, defVal) {
		                        return store.hasOwnProperty(storeKey) ? store[storeKey] : defVal;
		                    },
		                    set: function(storeKey, val) {
		                        store[storeKey] = val;
		                        return val;
		                    },
		                    del: function(storeKey) {
		                        delete store[storeKey];
		                    },
		                    getOrSet: function(storeKey, getter) {
		                        return util_getOrSet(store, storeKey, getter);
		                    },
		                    reset: function() {
		                        store = defStore();
		                    },
		                    keys: function() {
		                        return Object.keys(store);
		                    }
		                };
		            }));
		        }
		        var WildCard = function() {};
		        function getWildcard() {
		            var global = global_getGlobal();
		            global.WINDOW_WILDCARD = global.WINDOW_WILDCARD || new WildCard;
		            return global.WINDOW_WILDCARD;
		        }
		        function windowStore(key, defStore) {
		            void 0 === key && (key = "store");
		            void 0 === defStore && (defStore = getObj);
		            return globalStore("windowStore").getOrSet(key, (function() {
		                var winStore = new weakmap_CrossDomainSafeWeakMap;
		                var getStore = function(win) {
		                    return winStore.getOrSet(win, defStore);
		                };
		                return {
		                    has: function(win) {
		                        return getStore(win).hasOwnProperty(key);
		                    },
		                    get: function(win, defVal) {
		                        var store = getStore(win);
		                        return store.hasOwnProperty(key) ? store[key] : defVal;
		                    },
		                    set: function(win, val) {
		                        getStore(win)[key] = val;
		                        return val;
		                    },
		                    del: function(win) {
		                        delete getStore(win)[key];
		                    },
		                    getOrSet: function(win, getter) {
		                        return util_getOrSet(getStore(win), key, getter);
		                    }
		                };
		            }));
		        }
		        function getInstanceID() {
		            return globalStore("instance").getOrSet("instanceID", uniqueID);
		        }
		        function resolveHelloPromise(win, _ref) {
		            var domain = _ref.domain;
		            var helloPromises = windowStore("helloPromises");
		            var existingPromise = helloPromises.get(win);
		            existingPromise && existingPromise.resolve({
		                domain: domain
		            });
		            var newPromise = promise_ZalgoPromise.resolve({
		                domain: domain
		            });
		            helloPromises.set(win, newPromise);
		            return newPromise;
		        }
		        function sayHello(win, _ref4) {
		            return (0, _ref4.send)(win, "postrobot_hello", {
		                instanceID: getInstanceID()
		            }, {
		                domain: "*",
		                timeout: -1
		            }).then((function(_ref5) {
		                var origin = _ref5.origin, instanceID = _ref5.data.instanceID;
		                resolveHelloPromise(win, {
		                    domain: origin
		                });
		                return {
		                    win: win,
		                    domain: origin,
		                    instanceID: instanceID
		                };
		            }));
		        }
		        function getWindowInstanceID(win, _ref6) {
		            var send = _ref6.send;
		            return windowStore("windowInstanceIDPromises").getOrSet(win, (function() {
		                return sayHello(win, {
		                    send: send
		                }).then((function(_ref7) {
		                    return _ref7.instanceID;
		                }));
		            }));
		        }
		        function markWindowKnown(win) {
		            windowStore("knownWindows").set(win, !0);
		        }
		        function isSerializedType(item) {
		            return "object" == typeof item && null !== item && "string" == typeof item.__type__;
		        }
		        function determineType(val) {
		            return void 0 === val ? "undefined" : null === val ? "null" : Array.isArray(val) ? "array" : "function" == typeof val ? "function" : "object" == typeof val ? val instanceof Error ? "error" : "function" == typeof val.then ? "promise" : "[object RegExp]" === {}.toString.call(val) ? "regex" : "[object Date]" === {}.toString.call(val) ? "date" : "object" : "string" == typeof val ? "string" : "number" == typeof val ? "number" : "boolean" == typeof val ? "boolean" : void 0;
		        }
		        function serializeType(type, val) {
		            return {
		                __type__: type,
		                __val__: val
		            };
		        }
		        var _SERIALIZER;
		        var SERIALIZER = ((_SERIALIZER = {}).function = function() {}, _SERIALIZER.error = function(_ref) {
		            return serializeType("error", {
		                message: _ref.message,
		                stack: _ref.stack,
		                code: _ref.code,
		                data: _ref.data
		            });
		        }, _SERIALIZER.promise = function() {}, _SERIALIZER.regex = function(val) {
		            return serializeType("regex", val.source);
		        }, _SERIALIZER.date = function(val) {
		            return serializeType("date", val.toJSON());
		        }, _SERIALIZER.array = function(val) {
		            return val;
		        }, _SERIALIZER.object = function(val) {
		            return val;
		        }, _SERIALIZER.string = function(val) {
		            return val;
		        }, _SERIALIZER.number = function(val) {
		            return val;
		        }, _SERIALIZER.boolean = function(val) {
		            return val;
		        }, _SERIALIZER.null = function(val) {
		            return val;
		        }, _SERIALIZER[void 0] = function(val) {
		            return serializeType("undefined", val);
		        }, _SERIALIZER);
		        var defaultSerializers = {};
		        var _DESERIALIZER;
		        var DESERIALIZER = ((_DESERIALIZER = {}).function = function() {
		            throw new Error("Function serialization is not implemented; nothing to deserialize");
		        }, _DESERIALIZER.error = function(_ref2) {
		            var stack = _ref2.stack, code = _ref2.code, data = _ref2.data;
		            var error = new Error(_ref2.message);
		            error.code = code;
		            data && (error.data = data);
		            error.stack = stack + "\n\n" + error.stack;
		            return error;
		        }, _DESERIALIZER.promise = function() {
		            throw new Error("Promise serialization is not implemented; nothing to deserialize");
		        }, _DESERIALIZER.regex = function(val) {
		            return new RegExp(val);
		        }, _DESERIALIZER.date = function(val) {
		            return new Date(val);
		        }, _DESERIALIZER.array = function(val) {
		            return val;
		        }, _DESERIALIZER.object = function(val) {
		            return val;
		        }, _DESERIALIZER.string = function(val) {
		            return val;
		        }, _DESERIALIZER.number = function(val) {
		            return val;
		        }, _DESERIALIZER.boolean = function(val) {
		            return val;
		        }, _DESERIALIZER.null = function(val) {
		            return val;
		        }, _DESERIALIZER[void 0] = function() {}, _DESERIALIZER);
		        var defaultDeserializers = {};
		        new promise_ZalgoPromise((function(resolve) {
		            if (window$1.document && window$1.document.body) return resolve(window$1.document.body);
		            var interval = setInterval((function() {
		                if (window$1.document && window$1.document.body) {
		                    clearInterval(interval);
		                    return resolve(window$1.document.body);
		                }
		            }), 10);
		        }));
		        function cleanupProxyWindows() {
		            var idToProxyWindow = globalStore("idToProxyWindow");
		            for (var _i2 = 0, _idToProxyWindow$keys2 = idToProxyWindow.keys(); _i2 < _idToProxyWindow$keys2.length; _i2++) {
		                var id = _idToProxyWindow$keys2[_i2];
		                idToProxyWindow.get(id).shouldClean() && idToProxyWindow.del(id);
		            }
		        }
		        function getSerializedWindow(winPromise, _ref) {
		            var send = _ref.send, _ref$id = _ref.id, id = void 0 === _ref$id ? uniqueID() : _ref$id;
		            var windowNamePromise = winPromise.then((function(win) {
		                if (isSameDomain(win)) return assertSameDomain(win).name;
		            }));
		            var windowTypePromise = winPromise.then((function(window) {
		                if (isWindowClosed(window)) throw new Error("Window is closed, can not determine type");
		                return getOpener(window) ? WINDOW_TYPE.POPUP : WINDOW_TYPE.IFRAME;
		            }));
		            windowNamePromise.catch(src_util_noop);
		            windowTypePromise.catch(src_util_noop);
		            var getName = function() {
		                return winPromise.then((function(win) {
		                    if (!isWindowClosed(win)) return isSameDomain(win) ? assertSameDomain(win).name : windowNamePromise;
		                }));
		            };
		            return {
		                id: id,
		                getType: function() {
		                    return windowTypePromise;
		                },
		                getInstanceID: memoizePromise((function() {
		                    return winPromise.then((function(win) {
		                        return getWindowInstanceID(win, {
		                            send: send
		                        });
		                    }));
		                })),
		                close: function() {
		                    return winPromise.then(closeWindow);
		                },
		                getName: getName,
		                focus: function() {
		                    return winPromise.then((function(win) {
		                        win.focus();
		                    }));
		                },
		                isClosed: function() {
		                    return winPromise.then((function(win) {
		                        return isWindowClosed(win);
		                    }));
		                },
		                setLocation: function(href, opts) {
		                    void 0 === opts && (opts = {});
		                    return winPromise.then((function(win) {
		                        var domain = window$1.location.protocol + "//" + window$1.location.host;
		                        var _opts$method = opts.method, method = void 0 === _opts$method ? "get" : _opts$method, body = opts.body;
		                        if (0 === href.indexOf("/")) href = "" + domain + href; else if (!href.match(/^https?:\/\//) && 0 !== href.indexOf(domain)) throw new Error("Expected url to be http or https url, or absolute path, got " + JSON.stringify(href));
		                        if ("post" === method) return getName().then((function(name) {
		                            if (!name) throw new Error("Can not post to window without target name");
		                            !function(_ref3) {
		                                var url = _ref3.url, target = _ref3.target, body = _ref3.body, _ref3$method = _ref3.method, method = void 0 === _ref3$method ? "post" : _ref3$method;
		                                var form = document.createElement("form");
		                                form.setAttribute("target", target);
		                                form.setAttribute("method", method);
		                                form.setAttribute("action", url);
		                                form.style.display = "none";
		                                if (body) for (var _i24 = 0, _Object$keys4 = Object.keys(body); _i24 < _Object$keys4.length; _i24++) {
		                                    var _body$key;
		                                    var key = _Object$keys4[_i24];
		                                    var input = document.createElement("input");
		                                    input.setAttribute("name", key);
		                                    input.setAttribute("value", null == (_body$key = body[key]) ? void 0 : _body$key.toString());
		                                    form.appendChild(input);
		                                }
		                                getBody().appendChild(form);
		                                form.submit();
		                                getBody().removeChild(form);
		                            }({
		                                url: href,
		                                target: name,
		                                method: method,
		                                body: body
		                            });
		                        }));
		                        if ("get" !== method) throw new Error("Unsupported method: " + method);
		                        if (isSameDomain(win)) try {
		                            if (win.location && "function" == typeof win.location.replace) {
		                                win.location.replace(href);
		                                return;
		                            }
		                        } catch (err) {}
		                        win.location = href;
		                    }));
		                },
		                setName: function(name) {
		                    return winPromise.then((function(win) {
		                        var sameDomain = isSameDomain(win);
		                        var frame = getFrameForWindow(win);
		                        if (!sameDomain) throw new Error("Can not set name for cross-domain window: " + name);
		                        assertSameDomain(win).name = name;
		                        frame && frame.setAttribute("name", name);
		                        windowNamePromise = promise_ZalgoPromise.resolve(name);
		                    }));
		                }
		            };
		        }
		        var window_ProxyWindow = function() {
		            function ProxyWindow(_ref2) {
		                var send = _ref2.send, win = _ref2.win, serializedWindow = _ref2.serializedWindow;
		                this.id = void 0;
		                this.isProxyWindow = !0;
		                this.serializedWindow = void 0;
		                this.actualWindow = void 0;
		                this.actualWindowPromise = void 0;
		                this.send = void 0;
		                this.name = void 0;
		                this.actualWindowPromise = new promise_ZalgoPromise;
		                this.serializedWindow = serializedWindow || getSerializedWindow(this.actualWindowPromise, {
		                    send: send
		                });
		                globalStore("idToProxyWindow").set(this.getID(), this);
		                win && this.setWindow(win, {
		                    send: send
		                });
		            }
		            var _proto = ProxyWindow.prototype;
		            _proto.getID = function() {
		                return this.serializedWindow.id;
		            };
		            _proto.getType = function() {
		                return this.serializedWindow.getType();
		            };
		            _proto.isPopup = function() {
		                return this.getType().then((function(type) {
		                    return type === WINDOW_TYPE.POPUP;
		                }));
		            };
		            _proto.setLocation = function(href, opts) {
		                var _this = this;
		                return this.serializedWindow.setLocation(href, opts).then((function() {
		                    return _this;
		                }));
		            };
		            _proto.getName = function() {
		                return this.serializedWindow.getName();
		            };
		            _proto.setName = function(name) {
		                var _this2 = this;
		                return this.serializedWindow.setName(name).then((function() {
		                    return _this2;
		                }));
		            };
		            _proto.close = function() {
		                var _this3 = this;
		                return this.serializedWindow.close().then((function() {
		                    return _this3;
		                }));
		            };
		            _proto.focus = function() {
		                var _this4 = this;
		                var isPopupPromise = this.isPopup();
		                var getNamePromise = this.getName();
		                var reopenPromise = promise_ZalgoPromise.hash({
		                    isPopup: isPopupPromise,
		                    name: getNamePromise
		                }).then((function(_ref3) {
		                    var name = _ref3.name;
		                    _ref3.isPopup && name && window$1.open("", name);
		                }));
		                var focusPromise = this.serializedWindow.focus();
		                return promise_ZalgoPromise.all([ reopenPromise, focusPromise ]).then((function() {
		                    return _this4;
		                }));
		            };
		            _proto.isClosed = function() {
		                return this.serializedWindow.isClosed();
		            };
		            _proto.getWindow = function() {
		                return this.actualWindow;
		            };
		            _proto.setWindow = function(win, _ref4) {
		                var send = _ref4.send;
		                this.actualWindow = win;
		                this.actualWindowPromise.resolve(this.actualWindow);
		                this.serializedWindow = getSerializedWindow(this.actualWindowPromise, {
		                    send: send,
		                    id: this.getID()
		                });
		                windowStore("winToProxyWindow").set(win, this);
		            };
		            _proto.awaitWindow = function() {
		                return this.actualWindowPromise;
		            };
		            _proto.matchWindow = function(win, _ref5) {
		                var _this5 = this;
		                var send = _ref5.send;
		                return promise_ZalgoPromise.try((function() {
		                    return _this5.actualWindow ? win === _this5.actualWindow : promise_ZalgoPromise.hash({
		                        proxyInstanceID: _this5.getInstanceID(),
		                        knownWindowInstanceID: getWindowInstanceID(win, {
		                            send: send
		                        })
		                    }).then((function(_ref6) {
		                        var match = _ref6.proxyInstanceID === _ref6.knownWindowInstanceID;
		                        match && _this5.setWindow(win, {
		                            send: send
		                        });
		                        return match;
		                    }));
		                }));
		            };
		            _proto.unwrap = function() {
		                return this.actualWindow || this;
		            };
		            _proto.getInstanceID = function() {
		                return this.serializedWindow.getInstanceID();
		            };
		            _proto.shouldClean = function() {
		                return Boolean(this.actualWindow && isWindowClosed(this.actualWindow));
		            };
		            _proto.serialize = function() {
		                return this.serializedWindow;
		            };
		            ProxyWindow.unwrap = function(win) {
		                return ProxyWindow.isProxyWindow(win) ? win.unwrap() : win;
		            };
		            ProxyWindow.serialize = function(win, _ref7) {
		                var send = _ref7.send;
		                cleanupProxyWindows();
		                return ProxyWindow.toProxyWindow(win, {
		                    send: send
		                }).serialize();
		            };
		            ProxyWindow.deserialize = function(serializedWindow, _ref8) {
		                var send = _ref8.send;
		                cleanupProxyWindows();
		                return globalStore("idToProxyWindow").get(serializedWindow.id) || new ProxyWindow({
		                    serializedWindow: serializedWindow,
		                    send: send
		                });
		            };
		            ProxyWindow.isProxyWindow = function(obj) {
		                return Boolean(obj && !isWindow(obj) && obj.isProxyWindow);
		            };
		            ProxyWindow.toProxyWindow = function(win, _ref9) {
		                var send = _ref9.send;
		                cleanupProxyWindows();
		                if (ProxyWindow.isProxyWindow(win)) return win;
		                var actualWindow = win;
		                return windowStore("winToProxyWindow").get(actualWindow) || new ProxyWindow({
		                    win: actualWindow,
		                    send: send
		                });
		            };
		            return ProxyWindow;
		        }();
		        function addMethod(id, val, name, source, domain) {
		            var methodStore = windowStore("methodStore");
		            var proxyWindowMethods = globalStore("proxyWindowMethods");
		            if (window_ProxyWindow.isProxyWindow(source)) proxyWindowMethods.set(id, {
		                val: val,
		                name: name,
		                domain: domain,
		                source: source
		            }); else {
		                proxyWindowMethods.del(id);
		                methodStore.getOrSet(source, (function() {
		                    return {};
		                }))[id] = {
		                    domain: domain,
		                    name: name,
		                    val: val,
		                    source: source
		                };
		            }
		        }
		        function lookupMethod(source, id) {
		            var methodStore = windowStore("methodStore");
		            var proxyWindowMethods = globalStore("proxyWindowMethods");
		            return methodStore.getOrSet(source, (function() {
		                return {};
		            }))[id] || proxyWindowMethods.get(id);
		        }
		        function function_serializeFunction(destination, domain, val, key, _ref3) {
		            on = (_ref = {
		                on: _ref3.on,
		                send: _ref3.send
		            }).on, send = _ref.send, globalStore("builtinListeners").getOrSet("functionCalls", (function() {
		                return on("postrobot_method", {
		                    domain: "*"
		                }, (function(_ref2) {
		                    var source = _ref2.source, origin = _ref2.origin, data = _ref2.data;
		                    var id = data.id, name = data.name;
		                    var meth = lookupMethod(source, id);
		                    if (!meth) throw new Error("Could not find method '" + name + "' with id: " + data.id + " in " + getDomain(window$1));
		                    var methodSource = meth.source, domain = meth.domain, val = meth.val;
		                    return promise_ZalgoPromise.try((function() {
		                        if (!matchDomain(domain, origin)) throw new Error("Method '" + data.name + "' domain " + JSON.stringify(util_isRegex(meth.domain) ? meth.domain.source : meth.domain) + " does not match origin " + origin + " in " + getDomain(window$1));
		                        if (window_ProxyWindow.isProxyWindow(methodSource)) return methodSource.matchWindow(source, {
		                            send: send
		                        }).then((function(match) {
		                            if (!match) throw new Error("Method call '" + data.name + "' failed - proxy window does not match source in " + getDomain(window$1));
		                        }));
		                    })).then((function() {
		                        return val.apply({
		                            source: source,
		                            origin: origin
		                        }, data.args);
		                    }), (function(err) {
		                        return promise_ZalgoPromise.try((function() {
		                            if (val.onError) return val.onError(err);
		                        })).then((function() {
		                            err.stack && (err.stack = "Remote call to " + name + "(" + function(args) {
		                                void 0 === args && (args = []);
		                                return arrayFrom(args).map((function(arg) {
		                                    return "string" == typeof arg ? "'" + arg + "'" : void 0 === arg ? "undefined" : null === arg ? "null" : "boolean" == typeof arg ? arg.toString() : Array.isArray(arg) ? "[ ... ]" : "object" == typeof arg ? "{ ... }" : "function" == typeof arg ? "() => { ... }" : "<" + typeof arg + ">";
		                                })).join(", ");
		                            }(data.args) + ") failed\n\n" + err.stack);
		                            throw err;
		                        }));
		                    })).then((function(result) {
		                        return {
		                            result: result,
		                            id: id,
		                            name: name
		                        };
		                    }));
		                }));
		            }));
		            var _ref, on, send;
		            var id = val.__id__ || uniqueID();
		            destination = window_ProxyWindow.unwrap(destination);
		            var name = val.__name__ || val.name || key;
		            "string" == typeof name && "function" == typeof name.indexOf && 0 === name.indexOf("anonymous::") && (name = name.replace("anonymous::", key + "::"));
		            if (window_ProxyWindow.isProxyWindow(destination)) {
		                addMethod(id, val, name, destination, domain);
		                destination.awaitWindow().then((function(win) {
		                    addMethod(id, val, name, win, domain);
		                }));
		            } else addMethod(id, val, name, destination, domain);
		            return serializeType("cross_domain_function", {
		                id: id,
		                name: name
		            });
		        }
		        function serializeMessage(destination, domain, obj, _ref) {
		            var _serialize;
		            var on = _ref.on, send = _ref.send;
		            return function(obj, serializers) {
		                void 0 === serializers && (serializers = defaultSerializers);
		                var result = JSON.stringify(obj, (function(key) {
		                    var val = this[key];
		                    if (isSerializedType(this)) return val;
		                    var type = determineType(val);
		                    if (!type) return val;
		                    var serializer = serializers[type] || SERIALIZER[type];
		                    return serializer ? serializer(val, key) : val;
		                }));
		                return void 0 === result ? "undefined" : result;
		            }(obj, ((_serialize = {}).promise = function(val, key) {
		                return function(destination, domain, val, key, _ref) {
		                    return serializeType("cross_domain_zalgo_promise", {
		                        then: function_serializeFunction(destination, domain, (function(resolve, reject) {
		                            return val.then(resolve, reject);
		                        }), key, {
		                            on: _ref.on,
		                            send: _ref.send
		                        })
		                    });
		                }(destination, domain, val, key, {
		                    on: on,
		                    send: send
		                });
		            }, _serialize.function = function(val, key) {
		                return function_serializeFunction(destination, domain, val, key, {
		                    on: on,
		                    send: send
		                });
		            }, _serialize.object = function(val) {
		                return isWindow(val) || window_ProxyWindow.isProxyWindow(val) ? serializeType("cross_domain_window", window_ProxyWindow.serialize(val, {
		                    send: send
		                })) : val;
		            }, _serialize));
		        }
		        function deserializeMessage(source, origin, message, _ref2) {
		            var _deserialize;
		            var send = _ref2.send;
		            return function(str, deserializers) {
		                void 0 === deserializers && (deserializers = defaultDeserializers);
		                if ("undefined" !== str) return JSON.parse(str, (function(key, val) {
		                    if (isSerializedType(this)) return val;
		                    var type;
		                    var value;
		                    if (isSerializedType(val)) {
		                        type = val.__type__;
		                        value = val.__val__;
		                    } else {
		                        type = determineType(val);
		                        value = val;
		                    }
		                    if (!type) return value;
		                    var deserializer = deserializers[type] || DESERIALIZER[type];
		                    return deserializer ? deserializer(value, key) : value;
		                }));
		            }(message, ((_deserialize = {}).cross_domain_zalgo_promise = function(serializedPromise) {
		                return function(source, origin, _ref2) {
		                    return new promise_ZalgoPromise(_ref2.then);
		                }(0, 0, serializedPromise);
		            }, _deserialize.cross_domain_function = function(serializedFunction) {
		                return function(source, origin, _ref4, _ref5) {
		                    var id = _ref4.id, name = _ref4.name;
		                    var send = _ref5.send;
		                    var getDeserializedFunction = function(opts) {
		                        void 0 === opts && (opts = {});
		                        function crossDomainFunctionWrapper() {
		                            var _arguments = arguments;
		                            return window_ProxyWindow.toProxyWindow(source, {
		                                send: send
		                            }).awaitWindow().then((function(win) {
		                                var meth = lookupMethod(win, id);
		                                if (meth && meth.val !== crossDomainFunctionWrapper) return meth.val.apply({
		                                    source: window$1,
		                                    origin: getDomain()
		                                }, _arguments);
		                                var _args = [].slice.call(_arguments);
		                                return opts.fireAndForget ? send(win, "postrobot_method", {
		                                    id: id,
		                                    name: name,
		                                    args: _args
		                                }, {
		                                    domain: origin,
		                                    fireAndForget: !0
		                                }) : send(win, "postrobot_method", {
		                                    id: id,
		                                    name: name,
		                                    args: _args
		                                }, {
		                                    domain: origin,
		                                    fireAndForget: !1
		                                }).then((function(res) {
		                                    return res.data.result;
		                                }));
		                            })).catch((function(err) {
		                                throw err;
		                            }));
		                        }
		                        crossDomainFunctionWrapper.__name__ = name;
		                        crossDomainFunctionWrapper.__origin__ = origin;
		                        crossDomainFunctionWrapper.__source__ = source;
		                        crossDomainFunctionWrapper.__id__ = id;
		                        crossDomainFunctionWrapper.origin = origin;
		                        return crossDomainFunctionWrapper;
		                    };
		                    var crossDomainFunctionWrapper = getDeserializedFunction();
		                    crossDomainFunctionWrapper.fireAndForget = getDeserializedFunction({
		                        fireAndForget: !0
		                    });
		                    return crossDomainFunctionWrapper;
		                }(source, origin, serializedFunction, {
		                    send: send
		                });
		            }, _deserialize.cross_domain_window = function(serializedWindow) {
		                return window_ProxyWindow.deserialize(serializedWindow, {
		                    send: send
		                });
		            }, _deserialize));
		        }
		        var SEND_MESSAGE_STRATEGIES = {};
		        SEND_MESSAGE_STRATEGIES.postrobot_post_message = function(win, serializedMessage, domain) {
		            0 === domain.indexOf("file:") && (domain = "*");
		            win.postMessage(serializedMessage, domain);
		        };
		        SEND_MESSAGE_STRATEGIES.postrobot_global = function(win, serializedMessage) {
		            if (!function(win) {
		                return (win = win || window$1).navigator.mockUserAgent || win.navigator.userAgent;
		            }(window$1).match(/MSIE|rv:11|trident|edge\/12|edge\/13/i)) throw new Error("Global messaging not needed for browser");
		            if (!isSameDomain(win)) throw new Error("Post message through global disabled between different domain windows");
		            if (!1 !== isSameTopWindow(window$1, win)) throw new Error("Can only use global to communicate between two different windows, not between frames");
		            var foreignGlobal = global_getGlobal(win);
		            if (!foreignGlobal) throw new Error("Can not find postRobot global on foreign window");
		            foreignGlobal.receiveMessage({
		                source: window$1,
		                origin: getDomain(),
		                data: serializedMessage
		            });
		        };
		        function send_sendMessage(win, domain, message, _ref2) {
		            var on = _ref2.on, send = _ref2.send;
		            return promise_ZalgoPromise.try((function() {
		                var domainBuffer = windowStore().getOrSet(win, (function() {
		                    return {};
		                }));
		                domainBuffer.buffer = domainBuffer.buffer || [];
		                domainBuffer.buffer.push(message);
		                domainBuffer.flush = domainBuffer.flush || promise_ZalgoPromise.flush().then((function() {
		                    if (isWindowClosed(win)) throw new Error("Window is closed");
		                    var serializedMessage = serializeMessage(win, domain, ((_ref = {}).__post_robot_10_0_44__ = domainBuffer.buffer || [], 
		                    _ref), {
		                        on: on,
		                        send: send
		                    });
		                    var _ref;
		                    delete domainBuffer.buffer;
		                    var strategies = Object.keys(SEND_MESSAGE_STRATEGIES);
		                    var errors = [];
		                    for (var _i2 = 0; _i2 < strategies.length; _i2++) {
		                        var strategyName = strategies[_i2];
		                        try {
		                            SEND_MESSAGE_STRATEGIES[strategyName](win, serializedMessage, domain);
		                        } catch (err) {
		                            errors.push(err);
		                        }
		                    }
		                    if (errors.length === strategies.length) throw new Error("All post-robot messaging strategies failed:\n\n" + errors.map((function(err, i) {
		                        return i + ". " + stringifyError(err);
		                    })).join("\n\n"));
		                }));
		                return domainBuffer.flush.then((function() {
		                    delete domainBuffer.flush;
		                }));
		            })).then(src_util_noop);
		        }
		        function getResponseListener(hash) {
		            return globalStore("responseListeners").get(hash);
		        }
		        function deleteResponseListener(hash) {
		            globalStore("responseListeners").del(hash);
		        }
		        function isResponseListenerErrored(hash) {
		            return globalStore("erroredResponseListeners").has(hash);
		        }
		        function getRequestListener(_ref) {
		            var name = _ref.name, win = _ref.win, domain = _ref.domain;
		            var requestListeners = windowStore("requestListeners");
		            "*" === win && (win = null);
		            "*" === domain && (domain = null);
		            if (!name) throw new Error("Name required to get request listener");
		            for (var _i4 = 0, _ref3 = [ win, getWildcard() ]; _i4 < _ref3.length; _i4++) {
		                var winQualifier = _ref3[_i4];
		                if (winQualifier) {
		                    var nameListeners = requestListeners.get(winQualifier);
		                    if (nameListeners) {
		                        var domainListeners = nameListeners[name];
		                        if (domainListeners) {
		                            if (domain && "string" == typeof domain) {
		                                if (domainListeners[domain]) return domainListeners[domain];
		                                if (domainListeners.__domain_regex__) for (var _i6 = 0, _domainListeners$__DO2 = domainListeners.__domain_regex__; _i6 < _domainListeners$__DO2.length; _i6++) {
		                                    var _domainListeners$__DO3 = _domainListeners$__DO2[_i6], listener = _domainListeners$__DO3.listener;
		                                    if (matchDomain(_domainListeners$__DO3.regex, domain)) return listener;
		                                }
		                            }
		                            if (domainListeners["*"]) return domainListeners["*"];
		                        }
		                    }
		                }
		            }
		        }
		        function handleRequest(source, origin, message, _ref) {
		            var on = _ref.on, send = _ref.send;
		            var options = getRequestListener({
		                name: message.name,
		                win: source,
		                domain: origin
		            });
		            var logName = "postrobot_method" === message.name && message.data && "string" == typeof message.data.name ? message.data.name + "()" : message.name;
		            function sendResponse(ack, data, error) {
		                return promise_ZalgoPromise.flush().then((function() {
		                    if (!message.fireAndForget && !isWindowClosed(source)) try {
		                        return send_sendMessage(source, origin, {
		                            id: uniqueID(),
		                            origin: getDomain(window$1),
		                            type: "postrobot_message_response",
		                            hash: message.hash,
		                            name: message.name,
		                            ack: ack,
		                            data: data,
		                            error: error
		                        }, {
		                            on: on,
		                            send: send
		                        });
		                    } catch (err) {
		                        throw new Error("Send response message failed for " + logName + " in " + getDomain() + "\n\n" + stringifyError(err));
		                    }
		                }));
		            }
		            return promise_ZalgoPromise.all([ promise_ZalgoPromise.flush().then((function() {
		                if (!message.fireAndForget && !isWindowClosed(source)) try {
		                    return send_sendMessage(source, origin, {
		                        id: uniqueID(),
		                        origin: getDomain(window$1),
		                        type: "postrobot_message_ack",
		                        hash: message.hash,
		                        name: message.name
		                    }, {
		                        on: on,
		                        send: send
		                    });
		                } catch (err) {
		                    throw new Error("Send ack message failed for " + logName + " in " + getDomain() + "\n\n" + stringifyError(err));
		                }
		            })), promise_ZalgoPromise.try((function() {
		                if (!options) throw new Error("No handler found for post message: " + message.name + " from " + origin + " in " + window$1.location.protocol + "//" + window$1.location.host + window$1.location.pathname);
		                if (!matchDomain(options.domain, origin)) throw new Error("Request origin " + origin + " does not match domain " + options.domain.toString());
		                return options.handler({
		                    source: source,
		                    origin: origin,
		                    data: message.data
		                });
		            })).then((function(data) {
		                return sendResponse("success", data);
		            }), (function(error) {
		                return sendResponse("error", null, error);
		            })) ]).then(src_util_noop).catch((function(err) {
		                if (options && options.handleError) return options.handleError(err);
		                throw err;
		            }));
		        }
		        function handleAck(source, origin, message) {
		            if (!isResponseListenerErrored(message.hash)) {
		                var options = getResponseListener(message.hash);
		                if (!options) throw new Error("No handler found for post message ack for message: " + message.name + " from " + origin + " in " + window$1.location.protocol + "//" + window$1.location.host + window$1.location.pathname);
		                try {
		                    if (!matchDomain(options.domain, origin)) throw new Error("Ack origin " + origin + " does not match domain " + options.domain.toString());
		                    if (source !== options.win) throw new Error("Ack source does not match registered window");
		                } catch (err) {
		                    options.promise.reject(err);
		                }
		                options.ack = !0;
		            }
		        }
		        function handleResponse(source, origin, message) {
		            if (!isResponseListenerErrored(message.hash)) {
		                var options = getResponseListener(message.hash);
		                if (!options) throw new Error("No handler found for post message response for message: " + message.name + " from " + origin + " in " + window$1.location.protocol + "//" + window$1.location.host + window$1.location.pathname);
		                if (!matchDomain(options.domain, origin)) throw new Error("Response origin " + origin + " does not match domain " + (pattern = options.domain, 
		                Array.isArray(pattern) ? "(" + pattern.join(" | ") + ")" : isRegex(pattern) ? "RegExp(" + pattern.toString() + ")" : pattern.toString()));
		                var pattern;
		                if (source !== options.win) throw new Error("Response source does not match registered window");
		                deleteResponseListener(message.hash);
		                "error" === message.ack ? options.promise.reject(message.error) : "success" === message.ack && options.promise.resolve({
		                    source: source,
		                    origin: origin,
		                    data: message.data
		                });
		            }
		        }
		        function receive_receiveMessage(event, _ref2) {
		            var on = _ref2.on, send = _ref2.send;
		            var receivedMessages = globalStore("receivedMessages");
		            try {
		                if (!window$1 || window$1.closed || !event.source) return;
		            } catch (err) {
		                return;
		            }
		            var source = event.source, origin = event.origin;
		            var messages = function(message, source, origin, _ref) {
		                var on = _ref.on, send = _ref.send;
		                var parsedMessage;
		                try {
		                    parsedMessage = deserializeMessage(source, origin, message, {
		                        on: on,
		                        send: send
		                    });
		                } catch (err) {
		                    return;
		                }
		                if (parsedMessage && "object" == typeof parsedMessage && null !== parsedMessage) {
		                    var parseMessages = parsedMessage.__post_robot_10_0_44__;
		                    if (Array.isArray(parseMessages)) return parseMessages;
		                }
		            }(event.data, source, origin, {
		                on: on,
		                send: send
		            });
		            if (messages) {
		                markWindowKnown(source);
		                for (var _i2 = 0; _i2 < messages.length; _i2++) {
		                    var message = messages[_i2];
		                    if (receivedMessages.has(message.id)) return;
		                    receivedMessages.set(message.id, !0);
		                    if (isWindowClosed(source) && !message.fireAndForget) return;
		                    0 === message.origin.indexOf("file:") && (origin = "file://");
		                    try {
		                        "postrobot_message_request" === message.type ? handleRequest(source, origin, message, {
		                            on: on,
		                            send: send
		                        }) : "postrobot_message_response" === message.type ? handleResponse(source, origin, message) : "postrobot_message_ack" === message.type && handleAck(source, origin, message);
		                    } catch (err) {
		                        setTimeout((function() {
		                            throw err;
		                        }), 0);
		                    }
		                }
		            }
		        }
		        function on_on(name, options, handler) {
		            if (!name) throw new Error("Expected name");
		            if ("function" == typeof (options = options || {})) {
		                handler = options;
		                options = {};
		            }
		            if (!handler) throw new Error("Expected handler");
		            (options = options || {}).name = name;
		            options.handler = handler || options.handler;
		            var win = options.window;
		            var domain = options.domain;
		            var requestListener = function addRequestListener(_ref4, listener) {
		                var name = _ref4.name, win = _ref4.win, domain = _ref4.domain;
		                var requestListeners = windowStore("requestListeners");
		                if (!name || "string" != typeof name) throw new Error("Name required to add request listener");
		                if (Array.isArray(win)) {
		                    var listenersCollection = [];
		                    for (var _i8 = 0, _win2 = win; _i8 < _win2.length; _i8++) listenersCollection.push(addRequestListener({
		                        name: name,
		                        domain: domain,
		                        win: _win2[_i8]
		                    }, listener));
		                    return {
		                        cancel: function() {
		                            for (var _i10 = 0; _i10 < listenersCollection.length; _i10++) listenersCollection[_i10].cancel();
		                        }
		                    };
		                }
		                if (Array.isArray(domain)) {
		                    var _listenersCollection = [];
		                    for (var _i12 = 0, _domain2 = domain; _i12 < _domain2.length; _i12++) _listenersCollection.push(addRequestListener({
		                        name: name,
		                        win: win,
		                        domain: _domain2[_i12]
		                    }, listener));
		                    return {
		                        cancel: function() {
		                            for (var _i14 = 0; _i14 < _listenersCollection.length; _i14++) _listenersCollection[_i14].cancel();
		                        }
		                    };
		                }
		                var existingListener = getRequestListener({
		                    name: name,
		                    win: win,
		                    domain: domain
		                });
		                win && "*" !== win || (win = getWildcard());
		                domain = domain || "*";
		                if (existingListener) throw win && domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString() + " for " + (win === getWildcard() ? "wildcard" : "specified") + " window") : win ? new Error("Request listener already exists for " + name + " for " + (win === getWildcard() ? "wildcard" : "specified") + " window") : domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString()) : new Error("Request listener already exists for " + name);
		                var nameListeners = requestListeners.getOrSet(win, (function() {
		                    return {};
		                }));
		                var domainListeners = util_getOrSet(nameListeners, name, (function() {
		                    return {};
		                }));
		                var strDomain = domain.toString();
		                var regexListeners;
		                var regexListener;
		                util_isRegex(domain) ? (regexListeners = util_getOrSet(domainListeners, "__domain_regex__", (function() {
		                    return [];
		                }))).push(regexListener = {
		                    regex: domain,
		                    listener: listener
		                }) : domainListeners[strDomain] = listener;
		                return {
		                    cancel: function() {
		                        delete domainListeners[strDomain];
		                        if (regexListener) {
		                            regexListeners.splice(regexListeners.indexOf(regexListener, 1));
		                            regexListeners.length || delete domainListeners.__domain_regex__;
		                        }
		                        Object.keys(domainListeners).length || delete nameListeners[name];
		                        win && !Object.keys(nameListeners).length && requestListeners.del(win);
		                    }
		                };
		            }({
		                name: name,
		                win: win,
		                domain: domain
		            }, {
		                handler: options.handler,
		                handleError: options.errorHandler || function(err) {
		                    throw err;
		                },
		                window: win,
		                domain: domain || "*",
		                name: name
		            });
		            return {
		                cancel: function() {
		                    requestListener.cancel();
		                }
		            };
		        }
		        var send_send = function send(win, name, data, options) {
		            var domainMatcher = (options = options || {}).domain || "*";
		            var responseTimeout = options.timeout || -1;
		            var childTimeout = options.timeout || 5e3;
		            var fireAndForget = options.fireAndForget || !1;
		            return promise_ZalgoPromise.try((function() {
		                !function(name, win, domain) {
		                    if (!name) throw new Error("Expected name");
		                    if (domain && "string" != typeof domain && !Array.isArray(domain) && !util_isRegex(domain)) throw new TypeError("Can not send " + name + ". Expected domain " + JSON.stringify(domain) + " to be a string, array, or regex");
		                    if (isWindowClosed(win)) throw new Error("Can not send " + name + ". Target window is closed");
		                }(name, win, domainMatcher);
		                if (function(parent, child) {
		                    var actualParent = getAncestor(child);
		                    if (actualParent) return actualParent === parent;
		                    if (child === parent) return !1;
		                    if (getTop(child) === child) return !1;
		                    for (var _i15 = 0, _getFrames8 = getFrames(parent); _i15 < _getFrames8.length; _i15++) if (_getFrames8[_i15] === child) return !0;
		                    return !1;
		                }(window$1, win)) return function(win, timeout, name) {
		                    void 0 === timeout && (timeout = 5e3);
		                    void 0 === name && (name = "Window");
		                    var promise = function(win) {
		                        return windowStore("helloPromises").getOrSet(win, (function() {
		                            return new promise_ZalgoPromise;
		                        }));
		                    }(win);
		                    -1 !== timeout && (promise = promise.timeout(timeout, new Error(name + " did not load after " + timeout + "ms")));
		                    return promise;
		                }(win, childTimeout);
		            })).then((function(_temp) {
		                return function(win, targetDomain, actualDomain, _ref) {
		                    var send = _ref.send;
		                    return promise_ZalgoPromise.try((function() {
		                        return "string" == typeof targetDomain ? targetDomain : promise_ZalgoPromise.try((function() {
		                            return actualDomain || sayHello(win, {
		                                send: send
		                            }).then((function(_ref2) {
		                                return _ref2.domain;
		                            }));
		                        })).then((function(normalizedDomain) {
		                            if (!matchDomain(targetDomain, targetDomain)) throw new Error("Domain " + stringify(targetDomain) + " does not match " + stringify(targetDomain));
		                            return normalizedDomain;
		                        }));
		                    }));
		                }(win, domainMatcher, (void 0 === _temp ? {} : _temp).domain, {
		                    send: send
		                });
		            })).then((function(targetDomain) {
		                var domain = targetDomain;
		                var logName = "postrobot_method" === name && data && "string" == typeof data.name ? data.name + "()" : name;
		                var promise = new promise_ZalgoPromise;
		                var hash = name + "_" + uniqueID();
		                if (!fireAndForget) {
		                    var responseListener = {
		                        name: name,
		                        win: win,
		                        domain: domain,
		                        promise: promise
		                    };
		                    !function(hash, listener) {
		                        globalStore("responseListeners").set(hash, listener);
		                    }(hash, responseListener);
		                    var reqPromises = windowStore("requestPromises").getOrSet(win, (function() {
		                        return [];
		                    }));
		                    reqPromises.push(promise);
		                    promise.catch((function() {
		                        !function(hash) {
		                            globalStore("erroredResponseListeners").set(hash, !0);
		                        }(hash);
		                        deleteResponseListener(hash);
		                    }));
		                    var totalAckTimeout = function(win) {
		                        return windowStore("knownWindows").get(win, !1);
		                    }(win) ? 1e4 : 2e3;
		                    var totalResTimeout = responseTimeout;
		                    var ackTimeout = totalAckTimeout;
		                    var resTimeout = totalResTimeout;
		                    var interval = safeInterval((function() {
		                        if (isWindowClosed(win)) return promise.reject(new Error("Window closed for " + name + " before " + (responseListener.ack ? "response" : "ack")));
		                        if (responseListener.cancelled) return promise.reject(new Error("Response listener was cancelled for " + name));
		                        ackTimeout = Math.max(ackTimeout - 500, 0);
		                        -1 !== resTimeout && (resTimeout = Math.max(resTimeout - 500, 0));
		                        return responseListener.ack || 0 !== ackTimeout ? 0 === resTimeout ? promise.reject(new Error("No response for postMessage " + logName + " in " + getDomain() + " in " + totalResTimeout + "ms")) : void 0 : promise.reject(new Error("No ack for postMessage " + logName + " in " + getDomain() + " in " + totalAckTimeout + "ms"));
		                    }), 500);
		                    promise.finally((function() {
		                        interval.cancel();
		                        reqPromises.splice(reqPromises.indexOf(promise, 1));
		                    })).catch(src_util_noop);
		                }
		                return send_sendMessage(win, domain, {
		                    id: uniqueID(),
		                    origin: getDomain(window$1),
		                    type: "postrobot_message_request",
		                    hash: hash,
		                    name: name,
		                    data: data,
		                    fireAndForget: fireAndForget
		                }, {
		                    on: on_on,
		                    send: send
		                }).then((function() {
		                    return fireAndForget ? promise.resolve() : promise;
		                }), (function(err) {
		                    throw new Error("Send request message failed for " + logName + " in " + getDomain() + "\n\n" + stringifyError(err));
		                }));
		            }));
		        };
		        function setup_toProxyWindow(win) {
		            return window_ProxyWindow.toProxyWindow(win, {
		                send: send_send
		            });
		        }
		        function lib_global_getGlobal(win) {
		            if (!isSameDomain(win)) throw new Error("Can not get global for window on different domain");
		            win.__zoid_9_0_86__ || (win.__zoid_9_0_86__ = {});
		            return win.__zoid_9_0_86__;
		        }
		        function tryGlobal(win, handler) {
		            try {
		                return handler(lib_global_getGlobal(win));
		            } catch (err) {}
		        }
		        function getProxyObject(obj) {
		            return {
		                get: function() {
		                    var _this = this;
		                    return promise_ZalgoPromise.try((function() {
		                        if (_this.source && _this.source !== window$1) throw new Error("Can not call get on proxy object from a remote window");
		                        return obj;
		                    }));
		                }
		            };
		        }
		        function basicSerialize(data) {
		            return base64encode(JSON.stringify(data));
		        }
		        function getUIDRefStore(win) {
		            var global = lib_global_getGlobal(win);
		            global.references = global.references || {};
		            return global.references;
		        }
		        function crossDomainSerialize(_ref) {
		            var data = _ref.data, metaData = _ref.metaData, sender = _ref.sender, receiver = _ref.receiver, _ref$passByReference = _ref.passByReference, passByReference = void 0 !== _ref$passByReference && _ref$passByReference, _ref$basic = _ref.basic, basic = void 0 !== _ref$basic && _ref$basic;
		            var proxyWin = setup_toProxyWindow(receiver.win);
		            var serializedMessage = basic ? JSON.stringify(data) : serializeMessage(proxyWin, receiver.domain, data, {
		                on: on_on,
		                send: send_send
		            });
		            var reference = passByReference ? function(val) {
		                var uid = uniqueID();
		                getUIDRefStore(window$1)[uid] = val;
		                return {
		                    type: "uid",
		                    uid: uid
		                };
		            }(serializedMessage) : {
		                type: "raw",
		                val: serializedMessage
		            };
		            return {
		                serializedData: basicSerialize({
		                    sender: {
		                        domain: sender.domain
		                    },
		                    metaData: metaData,
		                    reference: reference
		                }),
		                cleanReference: function() {
		                    win = window$1, "uid" === (ref = reference).type && delete getUIDRefStore(win)[ref.uid];
		                    var win, ref;
		                }
		            };
		        }
		        function crossDomainDeserialize(_ref2) {
		            var sender = _ref2.sender, _ref2$basic = _ref2.basic, basic = void 0 !== _ref2$basic && _ref2$basic;
		            var message = function(serializedData) {
		                return JSON.parse(function(str) {
		                    if ("function" == typeof atob) return decodeURIComponent([].map.call(atob(str), (function(c) {
		                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
		                    })).join(""));
		                    if ("undefined" != typeof Buffer) return Buffer.from(str, "base64").toString("utf8");
		                    throw new Error("Can not find window.atob or Buffer");
		                }(serializedData));
		            }(_ref2.data);
		            var reference = message.reference, metaData = message.metaData;
		            var win;
		            win = "function" == typeof sender.win ? sender.win({
		                metaData: metaData
		            }) : sender.win;
		            var domain;
		            domain = "function" == typeof sender.domain ? sender.domain({
		                metaData: metaData
		            }) : "string" == typeof sender.domain ? sender.domain : message.sender.domain;
		            var serializedData = function(win, ref) {
		                if ("raw" === ref.type) return ref.val;
		                if ("uid" === ref.type) return getUIDRefStore(win)[ref.uid];
		                throw new Error("Unsupported ref type: " + ref.type);
		            }(win, reference);
		            return {
		                data: basic ? JSON.parse(serializedData) : function(source, origin, message) {
		                    return deserializeMessage(source, origin, message, {
		                        on: on_on,
		                        send: send_send
		                    });
		                }(win, domain, serializedData),
		                metaData: metaData,
		                sender: {
		                    win: win,
		                    domain: domain
		                },
		                reference: reference
		            };
		        }
		        var PROP_TYPE = {
		            STRING: "string",
		            OBJECT: "object",
		            FUNCTION: "function",
		            BOOLEAN: "boolean",
		            NUMBER: "number",
		            ARRAY: "array"
		        };
		        var PROP_SERIALIZATION = {
		            JSON: "json",
		            DOTIFY: "dotify",
		            BASE64: "base64"
		        };
		        var CONTEXT = WINDOW_TYPE;
		        var EVENT = {
		            RENDER: "zoid-render",
		            RENDERED: "zoid-rendered",
		            DISPLAY: "zoid-display",
		            ERROR: "zoid-error",
		            CLOSE: "zoid-close",
		            DESTROY: "zoid-destroy",
		            PROPS: "zoid-props",
		            RESIZE: "zoid-resize",
		            FOCUS: "zoid-focus"
		        };
		        function buildChildWindowName(_ref) {
		            return "__zoid__" + _ref.name + "__" + _ref.serializedPayload + "__";
		        }
		        function parseWindowName(windowName) {
		            if (!windowName) throw new Error("No window name");
		            var _windowName$split = windowName.split("__"), zoidcomp = _windowName$split[1], name = _windowName$split[2], serializedInitialPayload = _windowName$split[3];
		            if ("zoid" !== zoidcomp) throw new Error("Window not rendered by zoid - got " + zoidcomp);
		            if (!name) throw new Error("Expected component name");
		            if (!serializedInitialPayload) throw new Error("Expected serialized payload ref");
		            return {
		                name: name,
		                serializedInitialPayload: serializedInitialPayload
		            };
		        }
		        var parseInitialParentPayload = memoize((function(windowName) {
		            var _crossDomainDeseriali = crossDomainDeserialize({
		                data: parseWindowName(windowName).serializedInitialPayload,
		                sender: {
		                    win: function(_ref2) {
		                        return function(windowRef) {
		                            if ("opener" === windowRef.type) return assertExists("opener", getOpener(window$1));
		                            if ("parent" === windowRef.type && "number" == typeof windowRef.distance) return assertExists("parent", function(win, n) {
		                                void 0 === n && (n = 1);
		                                return function(win, n) {
		                                    void 0 === n && (n = 1);
		                                    var parent = win;
		                                    for (var i = 0; i < n; i++) {
		                                        if (!parent) return;
		                                        parent = utils_getParent(parent);
		                                    }
		                                    return parent;
		                                }(win, getDistanceFromTop(win) - n);
		                            }(window$1, windowRef.distance));
		                            if ("global" === windowRef.type && windowRef.uid && "string" == typeof windowRef.uid) {
		                                var _ret = function() {
		                                    var uid = windowRef.uid;
		                                    var ancestor = getAncestor(window$1);
		                                    if (!ancestor) throw new Error("Can not find ancestor window");
		                                    for (var _i2 = 0, _getAllFramesInWindow2 = getAllFramesInWindow(ancestor); _i2 < _getAllFramesInWindow2.length; _i2++) {
		                                        var frame = _getAllFramesInWindow2[_i2];
		                                        if (isSameDomain(frame)) {
		                                            var win = tryGlobal(frame, (function(global) {
		                                                return global.windows && global.windows[uid];
		                                            }));
		                                            if (win) return {
		                                                v: win
		                                            };
		                                        }
		                                    }
		                                }();
		                                if ("object" == typeof _ret) return _ret.v;
		                            } else if ("name" === windowRef.type) {
		                                var name = windowRef.name;
		                                return assertExists("namedWindow", function(win, name) {
		                                    return getFrameByName(win, name) || function findChildFrameByName(win, name) {
		                                        var frame = getFrameByName(win, name);
		                                        if (frame) return frame;
		                                        for (var _i11 = 0, _getFrames4 = getFrames(win); _i11 < _getFrames4.length; _i11++) {
		                                            var namedFrame = findChildFrameByName(_getFrames4[_i11], name);
		                                            if (namedFrame) return namedFrame;
		                                        }
		                                    }(getTop(win) || win, name);
		                                }(assertExists("ancestor", getAncestor(window$1)), name));
		                            }
		                            throw new Error("Unable to find " + windowRef.type + " parent component window");
		                        }(_ref2.metaData.windowRef);
		                    }
		                }
		            });
		            return {
		                parent: _crossDomainDeseriali.sender,
		                payload: _crossDomainDeseriali.data,
		                reference: _crossDomainDeseriali.reference
		            };
		        }));
		        function getInitialParentPayload() {
		            return parseInitialParentPayload(window$1.name);
		        }
		        function window_getWindowRef(targetWindow, currentWindow) {
		            void 0 === currentWindow && (currentWindow = window$1);
		            if (targetWindow === utils_getParent(currentWindow)) return {
		                type: "parent",
		                distance: getDistanceFromTop(targetWindow)
		            };
		            if (targetWindow === getOpener(currentWindow)) return {
		                type: "opener"
		            };
		            if (isSameDomain(targetWindow) && !(win = targetWindow, win === getTop(win))) {
		                var windowName = assertSameDomain(targetWindow).name;
		                if (windowName) return {
		                    type: "name",
		                    name: windowName
		                };
		            }
		            var win;
		        }
		        function normalizeChildProp(propsDef, props, key, value, helpers) {
		            if (!propsDef.hasOwnProperty(key)) return value;
		            var prop = propsDef[key];
		            return "function" == typeof prop.childDecorate ? prop.childDecorate({
		                value: value,
		                uid: helpers.uid,
		                tag: helpers.tag,
		                close: helpers.close,
		                focus: helpers.focus,
		                onError: helpers.onError,
		                onProps: helpers.onProps,
		                resize: helpers.resize,
		                getParent: helpers.getParent,
		                getParentDomain: helpers.getParentDomain,
		                show: helpers.show,
		                hide: helpers.hide,
		                export: helpers.export,
		                getSiblings: helpers.getSiblings
		            }) : value;
		        }
		        function child_focus() {
		            return promise_ZalgoPromise.try((function() {
		                window$1.focus();
		            }));
		        }
		        function child_destroy() {
		            return promise_ZalgoPromise.try((function() {
		                window$1.close();
		            }));
		        }
		        var props_defaultNoop = function() {
		            return src_util_noop;
		        };
		        var props_decorateOnce = function(_ref) {
		            return once(_ref.value);
		        };
		        function eachProp(props, propsDef, handler) {
		            for (var _i2 = 0, _Object$keys2 = Object.keys(_extends({}, props, propsDef)); _i2 < _Object$keys2.length; _i2++) {
		                var key = _Object$keys2[_i2];
		                handler(key, propsDef[key], props[key]);
		            }
		        }
		        function serializeProps(propsDef, props, method) {
		            var params = {};
		            return promise_ZalgoPromise.all(function(props, propsDef, handler) {
		                var results = [];
		                eachProp(props, propsDef, (function(key, propDef, value) {
		                    var result = function(key, propDef, value) {
		                        return promise_ZalgoPromise.resolve().then((function() {
		                            var _METHOD$GET$METHOD$PO, _METHOD$GET$METHOD$PO2;
		                            if (null != value && propDef) {
		                                var getParam = (_METHOD$GET$METHOD$PO = {}, _METHOD$GET$METHOD$PO.get = propDef.queryParam, 
		                                _METHOD$GET$METHOD$PO.post = propDef.bodyParam, _METHOD$GET$METHOD$PO)[method];
		                                var getValue = (_METHOD$GET$METHOD$PO2 = {}, _METHOD$GET$METHOD$PO2.get = propDef.queryValue, 
		                                _METHOD$GET$METHOD$PO2.post = propDef.bodyValue, _METHOD$GET$METHOD$PO2)[method];
		                                if (getParam) return promise_ZalgoPromise.hash({
		                                    finalParam: promise_ZalgoPromise.try((function() {
		                                        return "function" == typeof getParam ? getParam({
		                                            value: value
		                                        }) : "string" == typeof getParam ? getParam : key;
		                                    })),
		                                    finalValue: promise_ZalgoPromise.try((function() {
		                                        return "function" == typeof getValue && isDefined(value) ? getValue({
		                                            value: value
		                                        }) : value;
		                                    }))
		                                }).then((function(_ref) {
		                                    var finalParam = _ref.finalParam, finalValue = _ref.finalValue;
		                                    var result;
		                                    if ("boolean" == typeof finalValue) result = finalValue.toString(); else if ("string" == typeof finalValue) result = finalValue.toString(); else if ("object" == typeof finalValue && null !== finalValue) {
		                                        if (propDef.serialization === PROP_SERIALIZATION.JSON) result = JSON.stringify(finalValue); else if (propDef.serialization === PROP_SERIALIZATION.BASE64) result = base64encode(JSON.stringify(finalValue)); else if (propDef.serialization === PROP_SERIALIZATION.DOTIFY || !propDef.serialization) {
		                                            result = function dotify(obj, prefix, newobj) {
		                                                void 0 === prefix && (prefix = "");
		                                                void 0 === newobj && (newobj = {});
		                                                prefix = prefix ? prefix + "." : prefix;
		                                                for (var key in obj) obj.hasOwnProperty(key) && null != obj[key] && "function" != typeof obj[key] && (obj[key] && Array.isArray(obj[key]) && obj[key].length && obj[key].every((function(val) {
		                                                    return "object" != typeof val;
		                                                })) ? newobj["" + prefix + key + "[]"] = obj[key].join(",") : obj[key] && "object" == typeof obj[key] ? newobj = dotify(obj[key], "" + prefix + key, newobj) : newobj["" + prefix + key] = obj[key].toString());
		                                                return newobj;
		                                            }(finalValue, key);
		                                            for (var _i2 = 0, _Object$keys2 = Object.keys(result); _i2 < _Object$keys2.length; _i2++) {
		                                                var dotkey = _Object$keys2[_i2];
		                                                params[dotkey] = result[dotkey];
		                                            }
		                                            return;
		                                        }
		                                    } else "number" == typeof finalValue && (result = finalValue.toString());
		                                    params[finalParam] = result;
		                                }));
		                            }
		                        }));
		                    }(key, propDef, value);
		                    results.push(result);
		                }));
		                return results;
		            }(props, propsDef)).then((function() {
		                return params;
		            }));
		        }
		        function parentComponent(_ref) {
		            var uid = _ref.uid, options = _ref.options, _ref$overrides = _ref.overrides, overrides = void 0 === _ref$overrides ? {} : _ref$overrides, _ref$parentWin = _ref.parentWin, parentWin = void 0 === _ref$parentWin ? window$1 : _ref$parentWin;
		            var propsDef = options.propsDef, containerTemplate = options.containerTemplate, prerenderTemplate = options.prerenderTemplate, tag = options.tag, name = options.name, attributes = options.attributes, dimensions = options.dimensions, autoResize = options.autoResize, url = options.url, domainMatch = options.domain, xports = options.exports;
		            var initPromise = new promise_ZalgoPromise;
		            var handledErrors = [];
		            var clean = cleanup();
		            var state = {};
		            var inputProps = {};
		            var internalState = {
		                visible: !0
		            };
		            var event = overrides.event ? overrides.event : (triggered = {}, handlers = {}, 
		            emitter = {
		                on: function(eventName, handler) {
		                    var handlerList = handlers[eventName] = handlers[eventName] || [];
		                    handlerList.push(handler);
		                    var cancelled = !1;
		                    return {
		                        cancel: function() {
		                            if (!cancelled) {
		                                cancelled = !0;
		                                handlerList.splice(handlerList.indexOf(handler), 1);
		                            }
		                        }
		                    };
		                },
		                once: function(eventName, handler) {
		                    var listener = emitter.on(eventName, (function() {
		                        listener.cancel();
		                        handler();
		                    }));
		                    return listener;
		                },
		                trigger: function(eventName) {
		                    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		                    var handlerList = handlers[eventName];
		                    var promises = [];
		                    if (handlerList) {
		                        var _loop = function(_i2) {
		                            var handler = handlerList[_i2];
		                            promises.push(promise_ZalgoPromise.try((function() {
		                                return handler.apply(void 0, args);
		                            })));
		                        };
		                        for (var _i2 = 0; _i2 < handlerList.length; _i2++) _loop(_i2);
		                    }
		                    return promise_ZalgoPromise.all(promises).then(src_util_noop);
		                },
		                triggerOnce: function(eventName) {
		                    if (triggered[eventName]) return promise_ZalgoPromise.resolve();
		                    triggered[eventName] = !0;
		                    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) args[_key4 - 1] = arguments[_key4];
		                    return emitter.trigger.apply(emitter, [ eventName ].concat(args));
		                },
		                reset: function() {
		                    handlers = {};
		                }
		            });
		            var triggered, handlers, emitter;
		            var props = overrides.props ? overrides.props : {};
		            var currentProxyWin;
		            var currentProxyContainer;
		            var childComponent;
		            var currentChildDomain;
		            var currentContainer;
		            var onErrorOverride = overrides.onError;
		            var getProxyContainerOverride = overrides.getProxyContainer;
		            var showOverride = overrides.show;
		            var hideOverride = overrides.hide;
		            var closeOverride = overrides.close;
		            var renderContainerOverride = overrides.renderContainer;
		            var getProxyWindowOverride = overrides.getProxyWindow;
		            var setProxyWinOverride = overrides.setProxyWin;
		            var openFrameOverride = overrides.openFrame;
		            var openPrerenderFrameOverride = overrides.openPrerenderFrame;
		            var prerenderOverride = overrides.prerender;
		            var openOverride = overrides.open;
		            var openPrerenderOverride = overrides.openPrerender;
		            var watchForUnloadOverride = overrides.watchForUnload;
		            var getInternalStateOverride = overrides.getInternalState;
		            var setInternalStateOverride = overrides.setInternalState;
		            var resolveInitPromise = function() {
		                return promise_ZalgoPromise.try((function() {
		                    return overrides.resolveInitPromise ? overrides.resolveInitPromise() : initPromise.resolve();
		                }));
		            };
		            var rejectInitPromise = function(err) {
		                return promise_ZalgoPromise.try((function() {
		                    return overrides.rejectInitPromise ? overrides.rejectInitPromise(err) : initPromise.reject(err);
		                }));
		            };
		            var getPropsForChild = function(initialChildDomain) {
		                var result = {};
		                for (var _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
		                    var key = _Object$keys2[_i2];
		                    var prop = propsDef[key];
		                    prop && !1 === prop.sendToChild || prop && prop.sameDomain && !matchDomain(initialChildDomain, getDomain(window$1)) || (result[key] = props[key]);
		                }
		                return promise_ZalgoPromise.hash(result);
		            };
		            var getInternalState = function() {
		                return promise_ZalgoPromise.try((function() {
		                    return getInternalStateOverride ? getInternalStateOverride() : internalState;
		                }));
		            };
		            var setInternalState = function(newInternalState) {
		                return promise_ZalgoPromise.try((function() {
		                    return setInternalStateOverride ? setInternalStateOverride(newInternalState) : internalState = _extends({}, internalState, newInternalState);
		                }));
		            };
		            var getProxyWindow = function() {
		                return getProxyWindowOverride ? getProxyWindowOverride() : promise_ZalgoPromise.try((function() {
		                    var windowProp = props.window;
		                    if (windowProp) {
		                        var _proxyWin = setup_toProxyWindow(windowProp);
		                        clean.register((function() {
		                            return windowProp.close();
		                        }));
		                        return _proxyWin;
		                    }
		                    return new window_ProxyWindow({
		                        send: send_send
		                    });
		                }));
		            };
		            var setProxyWin = function(proxyWin) {
		                return setProxyWinOverride ? setProxyWinOverride(proxyWin) : promise_ZalgoPromise.try((function() {
		                    currentProxyWin = proxyWin;
		                }));
		            };
		            var show = function() {
		                return showOverride ? showOverride() : promise_ZalgoPromise.hash({
		                    setState: setInternalState({
		                        visible: !0
		                    }),
		                    showElement: currentProxyContainer ? currentProxyContainer.get().then(showElement) : null
		                }).then(src_util_noop);
		            };
		            var hide = function() {
		                return hideOverride ? hideOverride() : promise_ZalgoPromise.hash({
		                    setState: setInternalState({
		                        visible: !1
		                    }),
		                    showElement: currentProxyContainer ? currentProxyContainer.get().then(hideElement) : null
		                }).then(src_util_noop);
		            };
		            var getUrl = function() {
		                return "function" == typeof url ? url({
		                    props: props
		                }) : url;
		            };
		            var getAttributes = function() {
		                return "function" == typeof attributes ? attributes({
		                    props: props
		                }) : attributes;
		            };
		            var getInitialChildDomain = function() {
		                return getDomainFromUrl(getUrl());
		            };
		            var openFrame = function(context, _ref2) {
		                var windowName = _ref2.windowName;
		                return openFrameOverride ? openFrameOverride(context, {
		                    windowName: windowName
		                }) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) return getProxyObject(dom_iframe({
		                        attributes: _extends({
		                            name: windowName,
		                            title: name
		                        }, getAttributes().iframe)
		                    }));
		                }));
		            };
		            var openPrerenderFrame = function(context) {
		                return openPrerenderFrameOverride ? openPrerenderFrameOverride(context) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) return getProxyObject(dom_iframe({
		                        attributes: _extends({
		                            name: "__zoid_prerender_frame__" + name + "_" + uniqueID() + "__",
		                            title: "prerender__" + name
		                        }, getAttributes().iframe)
		                    }));
		                }));
		            };
		            var openPrerender = function(context, proxyWin, proxyPrerenderFrame) {
		                return openPrerenderOverride ? openPrerenderOverride(context, proxyWin, proxyPrerenderFrame) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) {
		                        if (!proxyPrerenderFrame) throw new Error("Expected proxy frame to be passed");
		                        return proxyPrerenderFrame.get().then((function(prerenderFrame) {
		                            clean.register((function() {
		                                return destroyElement(prerenderFrame);
		                            }));
		                            return awaitFrameWindow(prerenderFrame).then((function(prerenderFrameWindow) {
		                                return assertSameDomain(prerenderFrameWindow);
		                            })).then((function(win) {
		                                return setup_toProxyWindow(win);
		                            }));
		                        }));
		                    }
		                    throw new Error("No render context available for " + context);
		                }));
		            };
		            var focus = function() {
		                return promise_ZalgoPromise.try((function() {
		                    if (currentProxyWin) return promise_ZalgoPromise.all([ event.trigger(EVENT.FOCUS), currentProxyWin.focus() ]).then(src_util_noop);
		                }));
		            };
		            var getCurrentWindowReferenceUID = function() {
		                var global = lib_global_getGlobal(window$1);
		                global.windows = global.windows || {};
		                global.windows[uid] = window$1;
		                clean.register((function() {
		                    delete global.windows[uid];
		                }));
		                return uid;
		            };
		            var getWindowRef = function(target, initialChildDomain, context, proxyWin) {
		                if (initialChildDomain === getDomain(window$1)) return {
		                    type: "global",
		                    uid: getCurrentWindowReferenceUID()
		                };
		                if (target !== window$1) throw new Error("Can not construct cross-domain window reference for different target window");
		                if (props.window) {
		                    var actualComponentWindow = proxyWin.getWindow();
		                    if (!actualComponentWindow) throw new Error("Can not construct cross-domain window reference for lazy window prop");
		                    if (getAncestor(actualComponentWindow) !== window$1) throw new Error("Can not construct cross-domain window reference for window prop with different ancestor");
		                }
		                if (context === CONTEXT.POPUP) return {
		                    type: "opener"
		                };
		                if (context === CONTEXT.IFRAME) return {
		                    type: "parent",
		                    distance: getDistanceFromTop(window$1)
		                };
		                throw new Error("Can not construct window reference for child");
		            };
		            var initChild = function(childDomain, childExports) {
		                return promise_ZalgoPromise.try((function() {
		                    currentChildDomain = childDomain;
		                    childComponent = childExports;
		                    resolveInitPromise();
		                    clean.register((function() {
		                        return childExports.close.fireAndForget().catch(src_util_noop);
		                    }));
		                }));
		            };
		            var resize = function(_ref3) {
		                var width = _ref3.width, height = _ref3.height;
		                return promise_ZalgoPromise.try((function() {
		                    event.trigger(EVENT.RESIZE, {
		                        width: width,
		                        height: height
		                    });
		                }));
		            };
		            var destroy = function(err) {
		                return promise_ZalgoPromise.try((function() {
		                    return event.trigger(EVENT.DESTROY);
		                })).catch(src_util_noop).then((function() {
		                    return clean.all(err);
		                })).then((function() {
		                    initPromise.asyncReject(err || new Error("Component destroyed"));
		                }));
		            };
		            var close = memoize((function(err) {
		                return promise_ZalgoPromise.try((function() {
		                    if (closeOverride) {
		                        if (isWindowClosed(closeOverride.__source__)) return;
		                        return closeOverride();
		                    }
		                    return promise_ZalgoPromise.try((function() {
		                        return event.trigger(EVENT.CLOSE);
		                    })).then((function() {
		                        return destroy(err || new Error("Component closed"));
		                    }));
		                }));
		            }));
		            var open = function(context, _ref4) {
		                var proxyWin = _ref4.proxyWin, proxyFrame = _ref4.proxyFrame, windowName = _ref4.windowName;
		                return openOverride ? openOverride(context, {
		                    proxyWin: proxyWin,
		                    proxyFrame: proxyFrame,
		                    windowName: windowName
		                }) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) {
		                        if (!proxyFrame) throw new Error("Expected proxy frame to be passed");
		                        return proxyFrame.get().then((function(frame) {
		                            return awaitFrameWindow(frame).then((function(win) {
		                                clean.register((function() {
		                                    return destroyElement(frame);
		                                }));
		                                clean.register((function() {
		                                    return function(win) {
		                                        for (var _i2 = 0, _requestPromises$get2 = windowStore("requestPromises").get(win, []); _i2 < _requestPromises$get2.length; _i2++) _requestPromises$get2[_i2].reject(new Error("Window " + (isWindowClosed(win) ? "closed" : "cleaned up") + " before response")).catch(src_util_noop);
		                                    }(win);
		                                }));
		                                return win;
		                            }));
		                        }));
		                    }
		                    throw new Error("No render context available for " + context);
		                })).then((function(win) {
		                    proxyWin.setWindow(win, {
		                        send: send_send
		                    });
		                    return proxyWin.setName(windowName).then((function() {
		                        return proxyWin;
		                    }));
		                }));
		            };
		            var watchForUnload = function() {
		                return promise_ZalgoPromise.try((function() {
		                    var unloadWindowListener = addEventListener(window$1, "unload", once((function() {
		                        destroy(new Error("Window navigated away"));
		                    })));
		                    var closeParentWindowListener = onCloseWindow(parentWin, destroy, 3e3);
		                    clean.register(closeParentWindowListener.cancel);
		                    clean.register(unloadWindowListener.cancel);
		                    if (watchForUnloadOverride) return watchForUnloadOverride();
		                }));
		            };
		            var checkWindowClose = function(proxyWin) {
		                var closed = !1;
		                return proxyWin.isClosed().then((function(isClosed) {
		                    if (isClosed) {
		                        closed = !0;
		                        return close(new Error("Detected component window close"));
		                    }
		                    return promise_ZalgoPromise.delay(200).then((function() {
		                        return proxyWin.isClosed();
		                    })).then((function(secondIsClosed) {
		                        if (secondIsClosed) {
		                            closed = !0;
		                            return close(new Error("Detected component window close"));
		                        }
		                    }));
		                })).then((function() {
		                    return closed;
		                }));
		            };
		            var onError = function(err) {
		                return onErrorOverride ? onErrorOverride(err) : promise_ZalgoPromise.try((function() {
		                    if (-1 === handledErrors.indexOf(err)) {
		                        handledErrors.push(err);
		                        initPromise.asyncReject(err);
		                        return event.trigger(EVENT.ERROR, err);
		                    }
		                }));
		            };
		            var exportsPromise = new promise_ZalgoPromise;
		            var xport = function(actualExports) {
		                return promise_ZalgoPromise.try((function() {
		                    exportsPromise.resolve(actualExports);
		                }));
		            };
		            initChild.onError = onError;
		            var renderTemplate = function(renderer, _ref8) {
		                return renderer({
		                    uid: uid,
		                    container: _ref8.container,
		                    context: _ref8.context,
		                    doc: _ref8.doc,
		                    frame: _ref8.frame,
		                    prerenderFrame: _ref8.prerenderFrame,
		                    focus: focus,
		                    close: close,
		                    state: state,
		                    props: props,
		                    tag: tag,
		                    dimensions: "function" == typeof dimensions ? dimensions({
		                        props: props
		                    }) : dimensions,
		                    event: event
		                });
		            };
		            var prerender = function(proxyPrerenderWin, _ref9) {
		                var context = _ref9.context;
		                return prerenderOverride ? prerenderOverride(proxyPrerenderWin, {
		                    context: context
		                }) : promise_ZalgoPromise.try((function() {
		                    if (prerenderTemplate) {
		                        var prerenderWindow = proxyPrerenderWin.getWindow();
		                        if (prerenderWindow && isSameDomain(prerenderWindow) && function(win) {
		                            try {
		                                if (!win.location.href) return !0;
		                                if ("about:blank" === win.location.href) return !0;
		                            } catch (err) {}
		                            return !1;
		                        }(prerenderWindow)) {
		                            var doc = (prerenderWindow = assertSameDomain(prerenderWindow)).document;
		                            var el = renderTemplate(prerenderTemplate, {
		                                context: context,
		                                doc: doc
		                            });
		                            if (el) {
		                                if (el.ownerDocument !== doc) throw new Error("Expected prerender template to have been created with document from child window");
		                                !function(win, el) {
		                                    var tag = el.tagName.toLowerCase();
		                                    if ("html" !== tag) throw new Error("Expected element to be html, got " + tag);
		                                    var documentElement = win.document.documentElement;
		                                    for (var _i6 = 0, _arrayFrom2 = arrayFrom(documentElement.children); _i6 < _arrayFrom2.length; _i6++) documentElement.removeChild(_arrayFrom2[_i6]);
		                                    for (var _i8 = 0, _arrayFrom4 = arrayFrom(el.children); _i8 < _arrayFrom4.length; _i8++) documentElement.appendChild(_arrayFrom4[_i8]);
		                                }(prerenderWindow, el);
		                                var _autoResize$width = autoResize.width, width = void 0 !== _autoResize$width && _autoResize$width, _autoResize$height = autoResize.height, height = void 0 !== _autoResize$height && _autoResize$height, _autoResize$element = autoResize.element, element = void 0 === _autoResize$element ? "body" : _autoResize$element;
		                                if ((element = getElementSafe(element, doc)) && (width || height)) {
		                                    var prerenderResizeListener = onResize(element, (function(_ref10) {
		                                        resize({
		                                            width: width ? _ref10.width : void 0,
		                                            height: height ? _ref10.height : void 0
		                                        });
		                                    }), {
		                                        width: width,
		                                        height: height,
		                                        win: prerenderWindow
		                                    });
		                                    event.on(EVENT.RENDERED, prerenderResizeListener.cancel);
		                                }
		                            }
		                        }
		                    }
		                }));
		            };
		            var renderContainer = function(proxyContainer, _ref11) {
		                var proxyFrame = _ref11.proxyFrame, proxyPrerenderFrame = _ref11.proxyPrerenderFrame, context = _ref11.context, rerender = _ref11.rerender;
		                return renderContainerOverride ? renderContainerOverride(proxyContainer, {
		                    proxyFrame: proxyFrame,
		                    proxyPrerenderFrame: proxyPrerenderFrame,
		                    context: context,
		                    rerender: rerender
		                }) : promise_ZalgoPromise.hash({
		                    container: proxyContainer.get(),
		                    frame: proxyFrame ? proxyFrame.get() : null,
		                    prerenderFrame: proxyPrerenderFrame ? proxyPrerenderFrame.get() : null,
		                    internalState: getInternalState()
		                }).then((function(_ref12) {
		                    var container = _ref12.container, visible = _ref12.internalState.visible;
		                    var innerContainer = renderTemplate(containerTemplate, {
		                        context: context,
		                        container: container,
		                        frame: _ref12.frame,
		                        prerenderFrame: _ref12.prerenderFrame,
		                        doc: document
		                    });
		                    if (innerContainer) {
		                        visible || hideElement(innerContainer);
		                        appendChild(container, innerContainer);
		                        var containerWatcher = function(element, handler) {
		                            handler = once(handler);
		                            var cancelled = !1;
		                            var mutationObservers = [];
		                            var interval;
		                            var sacrificialFrame;
		                            var sacrificialFrameWin;
		                            var cancel = function() {
		                                cancelled = !0;
		                                for (var _i18 = 0; _i18 < mutationObservers.length; _i18++) mutationObservers[_i18].disconnect();
		                                interval && interval.cancel();
		                                sacrificialFrameWin && sacrificialFrameWin.removeEventListener("unload", elementClosed);
		                                sacrificialFrame && destroyElement(sacrificialFrame);
		                            };
		                            var elementClosed = function() {
		                                if (!cancelled) {
		                                    handler();
		                                    cancel();
		                                }
		                            };
		                            if (isElementClosed(element)) {
		                                elementClosed();
		                                return {
		                                    cancel: cancel
		                                };
		                            }
		                            if (window$1.MutationObserver) {
		                                var mutationElement = element.parentElement;
		                                for (;mutationElement; ) {
		                                    var mutationObserver = new window$1.MutationObserver((function() {
		                                        isElementClosed(element) && elementClosed();
		                                    }));
		                                    mutationObserver.observe(mutationElement, {
		                                        childList: !0
		                                    });
		                                    mutationObservers.push(mutationObserver);
		                                    mutationElement = mutationElement.parentElement;
		                                }
		                            }
		                            (sacrificialFrame = document.createElement("iframe")).setAttribute("name", "__detect_close_" + uniqueID() + "__");
		                            sacrificialFrame.style.display = "none";
		                            awaitFrameWindow(sacrificialFrame).then((function(frameWin) {
		                                (sacrificialFrameWin = assertSameDomain(frameWin)).addEventListener("unload", elementClosed);
		                            }));
		                            element.appendChild(sacrificialFrame);
		                            interval = safeInterval((function() {
		                                isElementClosed(element) && elementClosed();
		                            }), 1e3);
		                            return {
		                                cancel: cancel
		                            };
		                        }(innerContainer, (function() {
		                            var removeError = new Error("Detected container element removed from DOM");
		                            return promise_ZalgoPromise.delay(1).then((function() {
		                                if (!isElementClosed(innerContainer)) {
		                                    clean.all(removeError);
		                                    return rerender().then(resolveInitPromise, rejectInitPromise);
		                                }
		                                close(removeError);
		                            }));
		                        }));
		                        clean.register((function() {
		                            return containerWatcher.cancel();
		                        }));
		                        clean.register((function() {
		                            return destroyElement(innerContainer);
		                        }));
		                        return currentProxyContainer = getProxyObject(innerContainer);
		                    }
		                }));
		            };
		            var getHelpers = function() {
		                return {
		                    state: state,
		                    event: event,
		                    close: close,
		                    focus: focus,
		                    resize: resize,
		                    onError: onError,
		                    updateProps: updateProps,
		                    show: show,
		                    hide: hide
		                };
		            };
		            var setProps = function(newInputProps) {
		                void 0 === newInputProps && (newInputProps = {});
		                var container = currentContainer;
		                var helpers = getHelpers();
		                extend(inputProps, newInputProps);
		                !function(propsDef, existingProps, inputProps, helpers, container) {
		                    var state = helpers.state, close = helpers.close, focus = helpers.focus, event = helpers.event, onError = helpers.onError;
		                    eachProp(inputProps, propsDef, (function(key, propDef, val) {
		                        var valueDetermined = !1;
		                        var value = val;
		                        Object.defineProperty(existingProps, key, {
		                            configurable: !0,
		                            enumerable: !0,
		                            get: function() {
		                                if (valueDetermined) return value;
		                                valueDetermined = !0;
		                                return function() {
		                                    if (!propDef) return value;
		                                    var alias = propDef.alias;
		                                    alias && !isDefined(val) && isDefined(inputProps[alias]) && (value = inputProps[alias]);
		                                    propDef.value && (value = propDef.value({
		                                        props: existingProps,
		                                        state: state,
		                                        close: close,
		                                        focus: focus,
		                                        event: event,
		                                        onError: onError,
		                                        container: container
		                                    }));
		                                    !propDef.default || isDefined(value) || isDefined(inputProps[key]) || (value = propDef.default({
		                                        props: existingProps,
		                                        state: state,
		                                        close: close,
		                                        focus: focus,
		                                        event: event,
		                                        onError: onError,
		                                        container: container
		                                    }));
		                                    if (isDefined(value)) {
		                                        if (propDef.type === PROP_TYPE.ARRAY ? !Array.isArray(value) : typeof value !== propDef.type) throw new TypeError("Prop is not of type " + propDef.type + ": " + key);
		                                    } else if (!1 !== propDef.required && !isDefined(inputProps[key])) throw new Error('Expected prop "' + key + '" to be defined');
		                                    isDefined(value) && propDef.decorate && (value = propDef.decorate({
		                                        value: value,
		                                        props: existingProps,
		                                        state: state,
		                                        close: close,
		                                        focus: focus,
		                                        event: event,
		                                        onError: onError,
		                                        container: container
		                                    }));
		                                    return value;
		                                }();
		                            }
		                        });
		                    }));
		                    eachProp(existingProps, propsDef, src_util_noop);
		                }(propsDef, props, inputProps, helpers, container);
		            };
		            var updateProps = function(newProps) {
		                setProps(newProps);
		                return initPromise.then((function() {
		                    var child = childComponent;
		                    var proxyWin = currentProxyWin;
		                    if (child && proxyWin && currentChildDomain) return getPropsForChild(currentChildDomain).then((function(childProps) {
		                        return child.updateProps(childProps).catch((function(err) {
		                            return checkWindowClose(proxyWin).then((function(closed) {
		                                if (!closed) throw err;
		                            }));
		                        }));
		                    }));
		                }));
		            };
		            var getProxyContainer = function(container) {
		                return getProxyContainerOverride ? getProxyContainerOverride(container) : promise_ZalgoPromise.try((function() {
		                    return elementReady(container);
		                })).then((function(containerElement) {
		                    isShadowElement(containerElement) && (containerElement = function insertShadowSlot(element) {
		                        var shadowHost = function(element) {
		                            var shadowRoot = function(element) {
		                                for (;element.parentNode; ) element = element.parentNode;
		                                if (isShadowElement(element)) return element;
		                            }(element);
		                            if (shadowRoot && shadowRoot.host) return shadowRoot.host;
		                        }(element);
		                        if (!shadowHost) throw new Error("Element is not in shadow dom");
		                        var slotName = "shadow-slot-" + uniqueID();
		                        var slot = document.createElement("slot");
		                        slot.setAttribute("name", slotName);
		                        element.appendChild(slot);
		                        var slotProvider = document.createElement("div");
		                        slotProvider.setAttribute("slot", slotName);
		                        shadowHost.appendChild(slotProvider);
		                        return isShadowElement(shadowHost) ? insertShadowSlot(slotProvider) : slotProvider;
		                    }(containerElement));
		                    currentContainer = containerElement;
		                    return getProxyObject(containerElement);
		                }));
		            };
		            return {
		                init: function() {
		                    !function() {
		                        event.on(EVENT.RENDER, (function() {
		                            return props.onRender();
		                        }));
		                        event.on(EVENT.DISPLAY, (function() {
		                            return props.onDisplay();
		                        }));
		                        event.on(EVENT.RENDERED, (function() {
		                            return props.onRendered();
		                        }));
		                        event.on(EVENT.CLOSE, (function() {
		                            return props.onClose();
		                        }));
		                        event.on(EVENT.DESTROY, (function() {
		                            return props.onDestroy();
		                        }));
		                        event.on(EVENT.RESIZE, (function() {
		                            return props.onResize();
		                        }));
		                        event.on(EVENT.FOCUS, (function() {
		                            return props.onFocus();
		                        }));
		                        event.on(EVENT.PROPS, (function(newProps) {
		                            return props.onProps(newProps);
		                        }));
		                        event.on(EVENT.ERROR, (function(err) {
		                            return props && props.onError ? props.onError(err) : rejectInitPromise(err).then((function() {
		                                setTimeout((function() {
		                                    throw err;
		                                }), 1);
		                            }));
		                        }));
		                        clean.register(event.reset);
		                    }();
		                },
		                render: function(_ref14) {
		                    var target = _ref14.target, container = _ref14.container, context = _ref14.context, rerender = _ref14.rerender;
		                    return promise_ZalgoPromise.try((function() {
		                        var initialChildDomain = getInitialChildDomain();
		                        var childDomainMatch = domainMatch || getInitialChildDomain();
		                        !function(target, childDomainMatch, container) {
		                            if (target !== window$1) {
		                                if (!isSameTopWindow(window$1, target)) throw new Error("Can only renderTo an adjacent frame");
		                                var origin = getDomain();
		                                if (!matchDomain(childDomainMatch, origin) && !isSameDomain(target)) throw new Error("Can not render remotely to " + childDomainMatch.toString() + " - can only render to " + origin);
		                                if (container && "string" != typeof container) throw new Error("Container passed to renderTo must be a string selector, got " + typeof container + " }");
		                            }
		                        }(target, childDomainMatch, container);
		                        var delegatePromise = promise_ZalgoPromise.try((function() {
		                            if (target !== window$1) return function(context, target) {
		                                var delegateProps = {};
		                                for (var _i4 = 0, _Object$keys4 = Object.keys(props); _i4 < _Object$keys4.length; _i4++) {
		                                    var propName = _Object$keys4[_i4];
		                                    var propDef = propsDef[propName];
		                                    propDef && propDef.allowDelegate && (delegateProps[propName] = props[propName]);
		                                }
		                                var childOverridesPromise = send_send(target, "zoid_delegate_" + name, {
		                                    uid: uid,
		                                    overrides: {
		                                        props: delegateProps,
		                                        event: event,
		                                        close: close,
		                                        onError: onError,
		                                        getInternalState: getInternalState,
		                                        setInternalState: setInternalState,
		                                        resolveInitPromise: resolveInitPromise,
		                                        rejectInitPromise: rejectInitPromise
		                                    }
		                                }).then((function(_ref13) {
		                                    var parentComp = _ref13.data.parent;
		                                    clean.register((function(err) {
		                                        if (!isWindowClosed(target)) return parentComp.destroy(err);
		                                    }));
		                                    return parentComp.getDelegateOverrides();
		                                })).catch((function(err) {
		                                    throw new Error("Unable to delegate rendering. Possibly the component is not loaded in the target window.\n\n" + stringifyError(err));
		                                }));
		                                getProxyContainerOverride = function() {
		                                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.getProxyContainer.apply(childOverrides, args);
		                                    }));
		                                };
		                                renderContainerOverride = function() {
		                                    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.renderContainer.apply(childOverrides, args);
		                                    }));
		                                };
		                                showOverride = function() {
		                                    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.show.apply(childOverrides, args);
		                                    }));
		                                };
		                                hideOverride = function() {
		                                    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.hide.apply(childOverrides, args);
		                                    }));
		                                };
		                                watchForUnloadOverride = function() {
		                                    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) args[_key5] = arguments[_key5];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.watchForUnload.apply(childOverrides, args);
		                                    }));
		                                };
		                                if (context === CONTEXT.IFRAME) {
		                                    getProxyWindowOverride = function() {
		                                        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) args[_key6] = arguments[_key6];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.getProxyWindow.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openFrameOverride = function() {
		                                        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) args[_key7] = arguments[_key7];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.openFrame.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openPrerenderFrameOverride = function() {
		                                        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) args[_key8] = arguments[_key8];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.openPrerenderFrame.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    prerenderOverride = function() {
		                                        for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) args[_key9] = arguments[_key9];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.prerender.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openOverride = function() {
		                                        for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) args[_key10] = arguments[_key10];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.open.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openPrerenderOverride = function() {
		                                        for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) args[_key11] = arguments[_key11];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.openPrerender.apply(childOverrides, args);
		                                        }));
		                                    };
		                                }
		                                return childOverridesPromise;
		                            }(context, target);
		                        }));
		                        var windowProp = props.window;
		                        var watchForUnloadPromise = watchForUnload();
		                        var buildBodyPromise = serializeProps(propsDef, props, "post");
		                        var onRenderPromise = event.trigger(EVENT.RENDER);
		                        var getProxyContainerPromise = getProxyContainer(container);
		                        var getProxyWindowPromise = getProxyWindow();
		                        var finalSetPropsPromise = getProxyContainerPromise.then((function() {
		                            return setProps();
		                        }));
		                        var buildUrlPromise = finalSetPropsPromise.then((function() {
		                            return serializeProps(propsDef, props, "get").then((function(query) {
		                                return function(url, options) {
		                                    var query = options.query || {};
		                                    var hash = options.hash || {};
		                                    var originalUrl;
		                                    var originalHash;
		                                    var _url$split = url.split("#");
		                                    originalHash = _url$split[1];
		                                    var _originalUrl$split = (originalUrl = _url$split[0]).split("?");
		                                    originalUrl = _originalUrl$split[0];
		                                    var queryString = extendQuery(_originalUrl$split[1], query);
		                                    var hashString = extendQuery(originalHash, hash);
		                                    queryString && (originalUrl = originalUrl + "?" + queryString);
		                                    hashString && (originalUrl = originalUrl + "#" + hashString);
		                                    return originalUrl;
		                                }(function(url) {
		                                    if (!(domain = getDomainFromUrl(url), 0 === domain.indexOf("mock:"))) return url;
		                                    var domain;
		                                    throw new Error("Mock urls not supported out of test mode");
		                                }(getUrl()), {
		                                    query: query
		                                });
		                            }));
		                        }));
		                        var buildWindowNamePromise = getProxyWindowPromise.then((function(proxyWin) {
		                            return function(_temp2) {
		                                var _ref6 = void 0 === _temp2 ? {} : _temp2, proxyWin = _ref6.proxyWin, initialChildDomain = _ref6.initialChildDomain, childDomainMatch = _ref6.childDomainMatch, _ref6$target = _ref6.target, target = void 0 === _ref6$target ? window$1 : _ref6$target, context = _ref6.context;
		                                return function(_temp) {
		                                    var _ref5 = void 0 === _temp ? {} : _temp, proxyWin = _ref5.proxyWin, childDomainMatch = _ref5.childDomainMatch, context = _ref5.context;
		                                    return getPropsForChild(_ref5.initialChildDomain).then((function(childProps) {
		                                        return {
		                                            uid: uid,
		                                            context: context,
		                                            tag: tag,
		                                            childDomainMatch: childDomainMatch,
		                                            version: "9_0_86",
		                                            props: childProps,
		                                            exports: (win = proxyWin, {
		                                                init: function(childExports) {
		                                                    return initChild(this.origin, childExports);
		                                                },
		                                                close: close,
		                                                checkClose: function() {
		                                                    return checkWindowClose(win);
		                                                },
		                                                resize: resize,
		                                                onError: onError,
		                                                show: show,
		                                                hide: hide,
		                                                export: xport
		                                            })
		                                        };
		                                        var win;
		                                    }));
		                                }({
		                                    proxyWin: proxyWin,
		                                    initialChildDomain: initialChildDomain,
		                                    childDomainMatch: childDomainMatch,
		                                    context: context
		                                }).then((function(childPayload) {
		                                    var _crossDomainSerialize = crossDomainSerialize({
		                                        data: childPayload,
		                                        metaData: {
		                                            windowRef: getWindowRef(target, initialChildDomain, context, proxyWin)
		                                        },
		                                        sender: {
		                                            domain: getDomain(window$1)
		                                        },
		                                        receiver: {
		                                            win: proxyWin,
		                                            domain: childDomainMatch
		                                        },
		                                        passByReference: initialChildDomain === getDomain()
		                                    }), serializedData = _crossDomainSerialize.serializedData;
		                                    clean.register(_crossDomainSerialize.cleanReference);
		                                    return serializedData;
		                                }));
		                            }({
		                                proxyWin: (_ref7 = {
		                                    proxyWin: proxyWin,
		                                    initialChildDomain: initialChildDomain,
		                                    childDomainMatch: childDomainMatch,
		                                    target: target,
		                                    context: context
		                                }).proxyWin,
		                                initialChildDomain: _ref7.initialChildDomain,
		                                childDomainMatch: _ref7.childDomainMatch,
		                                target: _ref7.target,
		                                context: _ref7.context
		                            }).then((function(serializedPayload) {
		                                return buildChildWindowName({
		                                    name: name,
		                                    serializedPayload: serializedPayload
		                                });
		                            }));
		                            var _ref7;
		                        }));
		                        var openFramePromise = buildWindowNamePromise.then((function(windowName) {
		                            return openFrame(context, {
		                                windowName: windowName
		                            });
		                        }));
		                        var openPrerenderFramePromise = openPrerenderFrame(context);
		                        var renderContainerPromise = promise_ZalgoPromise.hash({
		                            proxyContainer: getProxyContainerPromise,
		                            proxyFrame: openFramePromise,
		                            proxyPrerenderFrame: openPrerenderFramePromise
		                        }).then((function(_ref15) {
		                            return renderContainer(_ref15.proxyContainer, {
		                                context: context,
		                                proxyFrame: _ref15.proxyFrame,
		                                proxyPrerenderFrame: _ref15.proxyPrerenderFrame,
		                                rerender: rerender
		                            });
		                        })).then((function(proxyContainer) {
		                            return proxyContainer;
		                        }));
		                        var openPromise = promise_ZalgoPromise.hash({
		                            windowName: buildWindowNamePromise,
		                            proxyFrame: openFramePromise,
		                            proxyWin: getProxyWindowPromise
		                        }).then((function(_ref16) {
		                            var proxyWin = _ref16.proxyWin;
		                            return windowProp ? proxyWin : open(context, {
		                                windowName: _ref16.windowName,
		                                proxyWin: proxyWin,
		                                proxyFrame: _ref16.proxyFrame
		                            });
		                        }));
		                        var openPrerenderPromise = promise_ZalgoPromise.hash({
		                            proxyWin: openPromise,
		                            proxyPrerenderFrame: openPrerenderFramePromise
		                        }).then((function(_ref17) {
		                            return openPrerender(context, _ref17.proxyWin, _ref17.proxyPrerenderFrame);
		                        }));
		                        var setStatePromise = openPromise.then((function(proxyWin) {
		                            currentProxyWin = proxyWin;
		                            return setProxyWin(proxyWin);
		                        }));
		                        var prerenderPromise = promise_ZalgoPromise.hash({
		                            proxyPrerenderWin: openPrerenderPromise,
		                            state: setStatePromise
		                        }).then((function(_ref18) {
		                            return prerender(_ref18.proxyPrerenderWin, {
		                                context: context
		                            });
		                        }));
		                        var setWindowNamePromise = promise_ZalgoPromise.hash({
		                            proxyWin: openPromise,
		                            windowName: buildWindowNamePromise
		                        }).then((function(_ref19) {
		                            if (windowProp) return _ref19.proxyWin.setName(_ref19.windowName);
		                        }));
		                        var getMethodPromise = promise_ZalgoPromise.hash({
		                            body: buildBodyPromise
		                        }).then((function(_ref20) {
		                            return options.method ? options.method : Object.keys(_ref20.body).length ? "post" : "get";
		                        }));
		                        var loadUrlPromise = promise_ZalgoPromise.hash({
		                            proxyWin: openPromise,
		                            windowUrl: buildUrlPromise,
		                            body: buildBodyPromise,
		                            method: getMethodPromise,
		                            windowName: setWindowNamePromise,
		                            prerender: prerenderPromise
		                        }).then((function(_ref21) {
		                            return _ref21.proxyWin.setLocation(_ref21.windowUrl, {
		                                method: _ref21.method,
		                                body: _ref21.body
		                            });
		                        }));
		                        var watchForClosePromise = openPromise.then((function(proxyWin) {
		                            !function watchForClose(proxyWin, context) {
		                                var cancelled = !1;
		                                clean.register((function() {
		                                    cancelled = !0;
		                                }));
		                                return promise_ZalgoPromise.delay(2e3).then((function() {
		                                    return proxyWin.isClosed();
		                                })).then((function(isClosed) {
		                                    if (!cancelled) return isClosed ? close(new Error("Detected " + context + " close")) : watchForClose(proxyWin, context);
		                                }));
		                            }(proxyWin, context);
		                        }));
		                        var onDisplayPromise = promise_ZalgoPromise.hash({
		                            container: renderContainerPromise,
		                            prerender: prerenderPromise
		                        }).then((function() {
		                            return event.trigger(EVENT.DISPLAY);
		                        }));
		                        var openBridgePromise = openPromise.then((function(proxyWin) {}));
		                        var runTimeoutPromise = loadUrlPromise.then((function() {
		                            return promise_ZalgoPromise.try((function() {
		                                var timeout = props.timeout;
		                                if (timeout) return initPromise.timeout(timeout, new Error("Loading component timed out after " + timeout + " milliseconds"));
		                            }));
		                        }));
		                        var onRenderedPromise = initPromise.then((function() {
		                            return event.trigger(EVENT.RENDERED);
		                        }));
		                        return promise_ZalgoPromise.hash({
		                            initPromise: initPromise,
		                            buildUrlPromise: buildUrlPromise,
		                            onRenderPromise: onRenderPromise,
		                            getProxyContainerPromise: getProxyContainerPromise,
		                            openFramePromise: openFramePromise,
		                            openPrerenderFramePromise: openPrerenderFramePromise,
		                            renderContainerPromise: renderContainerPromise,
		                            openPromise: openPromise,
		                            openPrerenderPromise: openPrerenderPromise,
		                            setStatePromise: setStatePromise,
		                            prerenderPromise: prerenderPromise,
		                            loadUrlPromise: loadUrlPromise,
		                            buildWindowNamePromise: buildWindowNamePromise,
		                            setWindowNamePromise: setWindowNamePromise,
		                            watchForClosePromise: watchForClosePromise,
		                            onDisplayPromise: onDisplayPromise,
		                            openBridgePromise: openBridgePromise,
		                            runTimeoutPromise: runTimeoutPromise,
		                            onRenderedPromise: onRenderedPromise,
		                            delegatePromise: delegatePromise,
		                            watchForUnloadPromise: watchForUnloadPromise,
		                            finalSetPropsPromise: finalSetPropsPromise
		                        });
		                    })).catch((function(err) {
		                        return promise_ZalgoPromise.all([ onError(err), destroy(err) ]).then((function() {
		                            throw err;
		                        }), (function() {
		                            throw err;
		                        }));
		                    })).then(src_util_noop);
		                },
		                destroy: destroy,
		                getProps: function() {
		                    return props;
		                },
		                setProps: setProps,
		                export: xport,
		                getHelpers: getHelpers,
		                getDelegateOverrides: function() {
		                    return promise_ZalgoPromise.try((function() {
		                        return {
		                            getProxyContainer: getProxyContainer,
		                            show: show,
		                            hide: hide,
		                            renderContainer: renderContainer,
		                            getProxyWindow: getProxyWindow,
		                            watchForUnload: watchForUnload,
		                            openFrame: openFrame,
		                            openPrerenderFrame: openPrerenderFrame,
		                            prerender: prerender,
		                            open: open,
		                            openPrerender: openPrerender,
		                            setProxyWin: setProxyWin
		                        };
		                    }));
		                },
		                getExports: function() {
		                    return xports({
		                        getExports: function() {
		                            return exportsPromise;
		                        }
		                    });
		                }
		            };
		        }
		        function defaultContainerTemplate(_ref) {
		            var uid = _ref.uid, frame = _ref.frame, prerenderFrame = _ref.prerenderFrame, doc = _ref.doc, props = _ref.props, event = _ref.event, dimensions = _ref.dimensions;
		            var width = dimensions.width, height = dimensions.height;
		            if (frame && prerenderFrame) {
		                var div = doc.createElement("div");
		                div.setAttribute("id", uid);
		                var style = doc.createElement("style");
		                props.cspNonce && style.setAttribute("nonce", props.cspNonce);
		                style.appendChild(doc.createTextNode("\n            #" + uid + " {\n                display: inline-block;\n                position: relative;\n                width: " + width + ";\n                height: " + height + ";\n            }\n\n            #" + uid + " > iframe {\n                display: inline-block;\n                position: absolute;\n                width: 100%;\n                height: 100%;\n                top: 0;\n                left: 0;\n                transition: opacity .2s ease-in-out;\n            }\n\n            #" + uid + " > iframe.zoid-invisible {\n                opacity: 0;\n            }\n\n            #" + uid + " > iframe.zoid-visible {\n                opacity: 1;\n        }\n        "));
		                div.appendChild(frame);
		                div.appendChild(prerenderFrame);
		                div.appendChild(style);
		                prerenderFrame.classList.add("zoid-visible");
		                frame.classList.add("zoid-invisible");
		                event.on(EVENT.RENDERED, (function() {
		                    prerenderFrame.classList.remove("zoid-visible");
		                    prerenderFrame.classList.add("zoid-invisible");
		                    frame.classList.remove("zoid-invisible");
		                    frame.classList.add("zoid-visible");
		                    setTimeout((function() {
		                        destroyElement(prerenderFrame);
		                    }), 1);
		                }));
		                event.on(EVENT.RESIZE, (function(_ref2) {
		                    var newWidth = _ref2.width, newHeight = _ref2.height;
		                    "number" == typeof newWidth && (div.style.width = toCSS(newWidth));
		                    "number" == typeof newHeight && (div.style.height = toCSS(newHeight));
		                }));
		                return div;
		            }
		        }
		        var cleanInstances = cleanup();
		        var cleanZoid = cleanup();
		        function component(opts) {
		            var options = function(options) {
		                var tag = options.tag, url = options.url, domain = options.domain, bridgeUrl = options.bridgeUrl, _options$props = options.props, props = void 0 === _options$props ? {} : _options$props, _options$dimensions = options.dimensions, dimensions = void 0 === _options$dimensions ? {} : _options$dimensions, _options$autoResize = options.autoResize, autoResize = void 0 === _options$autoResize ? {} : _options$autoResize, _options$allowedParen = options.allowedParentDomains, allowedParentDomains = void 0 === _options$allowedParen ? "*" : _options$allowedParen, _options$attributes = options.attributes, attributes = void 0 === _options$attributes ? {} : _options$attributes, _options$defaultConte = options.defaultContext, defaultContext = void 0 === _options$defaultConte ? CONTEXT.IFRAME : _options$defaultConte, _options$containerTem = options.containerTemplate, containerTemplate = void 0 === _options$containerTem ? defaultContainerTemplate : _options$containerTem, _options$prerenderTem = options.prerenderTemplate, prerenderTemplate = void 0 === _options$prerenderTem ? null : _options$prerenderTem, validate = options.validate, _options$eligible = options.eligible, eligible = void 0 === _options$eligible ? function() {
		                    return {
		                        eligible: !0
		                    };
		                } : _options$eligible, _options$logger = options.logger, logger = void 0 === _options$logger ? {
		                    info: src_util_noop
		                } : _options$logger, _options$exports = options.exports, xportsDefinition = void 0 === _options$exports ? src_util_noop : _options$exports, method = options.method, _options$children = options.children, children = void 0 === _options$children ? function() {
		                    return {};
		                } : _options$children;
		                var name = tag.replace(/-/g, "_");
		                var propsDef = _extends({}, {
		                    window: {
		                        type: PROP_TYPE.OBJECT,
		                        sendToChild: !1,
		                        required: !1,
		                        allowDelegate: !0,
		                        validate: function(_ref2) {
		                            var value = _ref2.value;
		                            if (!isWindow(value) && !window_ProxyWindow.isProxyWindow(value)) throw new Error("Expected Window or ProxyWindow");
		                            if (isWindow(value)) {
		                                if (isWindowClosed(value)) throw new Error("Window is closed");
		                                if (!isSameDomain(value)) throw new Error("Window is not same domain");
		                            }
		                        },
		                        decorate: function(_ref3) {
		                            return setup_toProxyWindow(_ref3.value);
		                        }
		                    },
		                    timeout: {
		                        type: PROP_TYPE.NUMBER,
		                        required: !1,
		                        sendToChild: !1
		                    },
		                    cspNonce: {
		                        type: PROP_TYPE.STRING,
		                        required: !1
		                    },
		                    onDisplay: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onRendered: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onRender: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onClose: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onDestroy: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onResize: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop
		                    },
		                    onFocus: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop
		                    },
		                    close: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref4) {
		                            return _ref4.close;
		                        }
		                    },
		                    focus: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref5) {
		                            return _ref5.focus;
		                        }
		                    },
		                    resize: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref6) {
		                            return _ref6.resize;
		                        }
		                    },
		                    uid: {
		                        type: PROP_TYPE.STRING,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref7) {
		                            return _ref7.uid;
		                        }
		                    },
		                    tag: {
		                        type: PROP_TYPE.STRING,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref8) {
		                            return _ref8.tag;
		                        }
		                    },
		                    getParent: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref9) {
		                            return _ref9.getParent;
		                        }
		                    },
		                    getParentDomain: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref10) {
		                            return _ref10.getParentDomain;
		                        }
		                    },
		                    show: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref11) {
		                            return _ref11.show;
		                        }
		                    },
		                    hide: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref12) {
		                            return _ref12.hide;
		                        }
		                    },
		                    export: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref13) {
		                            return _ref13.export;
		                        }
		                    },
		                    onError: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref14) {
		                            return _ref14.onError;
		                        }
		                    },
		                    onProps: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref15) {
		                            return _ref15.onProps;
		                        }
		                    },
		                    getSiblings: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref16) {
		                            return _ref16.getSiblings;
		                        }
		                    }
		                }, props);
		                if (!containerTemplate) throw new Error("Container template required");
		                return {
		                    name: name,
		                    tag: tag,
		                    url: url,
		                    domain: domain,
		                    bridgeUrl: bridgeUrl,
		                    method: method,
		                    propsDef: propsDef,
		                    dimensions: dimensions,
		                    autoResize: autoResize,
		                    allowedParentDomains: allowedParentDomains,
		                    attributes: attributes,
		                    defaultContext: defaultContext,
		                    containerTemplate: containerTemplate,
		                    prerenderTemplate: prerenderTemplate,
		                    validate: validate,
		                    logger: logger,
		                    eligible: eligible,
		                    children: children,
		                    exports: "function" == typeof xportsDefinition ? xportsDefinition : function(_ref) {
		                        var getExports = _ref.getExports;
		                        var result = {};
		                        var _loop = function(_i2, _Object$keys2) {
		                            var key = _Object$keys2[_i2];
		                            var type = xportsDefinition[key].type;
		                            var valuePromise = getExports().then((function(res) {
		                                return res[key];
		                            }));
		                            result[key] = type === PROP_TYPE.FUNCTION ? function() {
		                                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		                                return valuePromise.then((function(value) {
		                                    return value.apply(void 0, args);
		                                }));
		                            } : valuePromise;
		                        };
		                        for (var _i2 = 0, _Object$keys2 = Object.keys(xportsDefinition); _i2 < _Object$keys2.length; _i2++) _loop(_i2, _Object$keys2);
		                        return result;
		                    }
		                };
		            }(opts);
		            var name = options.name, tag = options.tag, defaultContext = options.defaultContext, eligible = options.eligible, children = options.children;
		            var global = lib_global_getGlobal(window$1);
		            var instances = [];
		            var isChild = function() {
		                if (function(name) {
		                    try {
		                        return parseWindowName(window$1.name).name === name;
		                    } catch (err) {}
		                    return !1;
		                }(name)) {
		                    var _payload = getInitialParentPayload().payload;
		                    if (_payload.tag === tag && matchDomain(_payload.childDomainMatch, getDomain())) return !0;
		                }
		                return !1;
		            };
		            var registerChild = memoize((function() {
		                if (isChild()) {
		                    if (window$1.xprops) {
		                        delete global.components[tag];
		                        throw new Error("Can not register " + name + " as child - child already registered");
		                    }
		                    var child = function(options) {
		                        var tag = options.tag, propsDef = options.propsDef, autoResize = options.autoResize, allowedParentDomains = options.allowedParentDomains;
		                        var onPropHandlers = [];
		                        var _getInitialParentPayl = getInitialParentPayload(), parent = _getInitialParentPayl.parent, payload = _getInitialParentPayl.payload;
		                        var parentComponentWindow = parent.win, parentDomain = parent.domain;
		                        var props;
		                        var exportsPromise = new promise_ZalgoPromise;
		                        var version = payload.version, uid = payload.uid, parentExports = payload.exports, context = payload.context, initialProps = payload.props;
		                        if ("9_0_86" !== version) throw new Error("Parent window has zoid version " + version + ", child window has version 9_0_86");
		                        var show = parentExports.show, hide = parentExports.hide, close = parentExports.close, onError = parentExports.onError, checkClose = parentExports.checkClose, parentExport = parentExports.export, parentResize = parentExports.resize, parentInit = parentExports.init;
		                        var getParent = function() {
		                            return parentComponentWindow;
		                        };
		                        var getParentDomain = function() {
		                            return parentDomain;
		                        };
		                        var onProps = function(handler) {
		                            onPropHandlers.push(handler);
		                            return {
		                                cancel: function() {
		                                    onPropHandlers.splice(onPropHandlers.indexOf(handler), 1);
		                                }
		                            };
		                        };
		                        var resize = function(_ref) {
		                            return parentResize.fireAndForget({
		                                width: _ref.width,
		                                height: _ref.height
		                            });
		                        };
		                        var xport = function(xports) {
		                            exportsPromise.resolve(xports);
		                            return parentExport(xports);
		                        };
		                        var getSiblings = function(_temp) {
		                            var anyParent = (void 0 === _temp ? {} : _temp).anyParent;
		                            var result = [];
		                            var currentParent = props.parent;
		                            void 0 === anyParent && (anyParent = !currentParent);
		                            if (!anyParent && !currentParent) throw new Error("No parent found for " + tag + " child");
		                            for (var _i2 = 0, _getAllFramesInWindow2 = getAllFramesInWindow(window$1); _i2 < _getAllFramesInWindow2.length; _i2++) {
		                                var win = _getAllFramesInWindow2[_i2];
		                                if (isSameDomain(win)) {
		                                    var xprops = assertSameDomain(win).xprops;
		                                    if (xprops && getParent() === xprops.getParent()) {
		                                        var winParent = xprops.parent;
		                                        if (anyParent || !currentParent || winParent && winParent.uid === currentParent.uid) {
		                                            var xports = tryGlobal(win, (function(global) {
		                                                return global.exports;
		                                            }));
		                                            result.push({
		                                                props: xprops,
		                                                exports: xports
		                                            });
		                                        }
		                                    }
		                                }
		                            }
		                            return result;
		                        };
		                        var setProps = function(newProps, origin, isUpdate) {
		                            void 0 === isUpdate && (isUpdate = !1);
		                            var normalizedProps = function(parentComponentWindow, propsDef, props, origin, helpers, isUpdate) {
		                                void 0 === isUpdate && (isUpdate = !1);
		                                var result = {};
		                                for (var _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
		                                    var key = _Object$keys2[_i2];
		                                    var prop = propsDef[key];
		                                    if (!prop || !prop.sameDomain || origin === getDomain(window$1) && isSameDomain(parentComponentWindow)) {
		                                        var value = normalizeChildProp(propsDef, 0, key, props[key], helpers);
		                                        result[key] = value;
		                                        prop && prop.alias && !result[prop.alias] && (result[prop.alias] = value);
		                                    }
		                                }
		                                if (!isUpdate) for (var _i4 = 0, _Object$keys4 = Object.keys(propsDef); _i4 < _Object$keys4.length; _i4++) {
		                                    var _key = _Object$keys4[_i4];
		                                    props.hasOwnProperty(_key) || (result[_key] = normalizeChildProp(propsDef, 0, _key, void 0, helpers));
		                                }
		                                return result;
		                            }(parentComponentWindow, propsDef, newProps, origin, {
		                                tag: tag,
		                                show: show,
		                                hide: hide,
		                                close: close,
		                                focus: child_focus,
		                                onError: onError,
		                                resize: resize,
		                                getSiblings: getSiblings,
		                                onProps: onProps,
		                                getParent: getParent,
		                                getParentDomain: getParentDomain,
		                                uid: uid,
		                                export: xport
		                            }, isUpdate);
		                            props ? extend(props, normalizedProps) : props = normalizedProps;
		                            for (var _i4 = 0; _i4 < onPropHandlers.length; _i4++) (0, onPropHandlers[_i4])(props);
		                        };
		                        var updateProps = function(newProps) {
		                            return promise_ZalgoPromise.try((function() {
		                                return setProps(newProps, parentDomain, !0);
		                            }));
		                        };
		                        return {
		                            init: function() {
		                                return promise_ZalgoPromise.try((function() {
		                                    isSameDomain(parentComponentWindow) && function(_ref3) {
		                                        var componentName = _ref3.componentName, parentComponentWindow = _ref3.parentComponentWindow;
		                                        var _crossDomainDeseriali2 = crossDomainDeserialize({
		                                            data: parseWindowName(window$1.name).serializedInitialPayload,
		                                            sender: {
		                                                win: parentComponentWindow
		                                            },
		                                            basic: !0
		                                        }), sender = _crossDomainDeseriali2.sender;
		                                        if ("uid" === _crossDomainDeseriali2.reference.type || "global" === _crossDomainDeseriali2.metaData.windowRef.type) {
		                                            var _crossDomainSerialize = crossDomainSerialize({
		                                                data: _crossDomainDeseriali2.data,
		                                                metaData: {
		                                                    windowRef: window_getWindowRef(parentComponentWindow)
		                                                },
		                                                sender: {
		                                                    domain: sender.domain
		                                                },
		                                                receiver: {
		                                                    win: window$1,
		                                                    domain: getDomain()
		                                                },
		                                                basic: !0
		                                            });
		                                            window$1.name = buildChildWindowName({
		                                                name: componentName,
		                                                serializedPayload: _crossDomainSerialize.serializedData
		                                            });
		                                        }
		                                    }({
		                                        componentName: options.name,
		                                        parentComponentWindow: parentComponentWindow
		                                    });
		                                    lib_global_getGlobal(window$1).exports = options.exports({
		                                        getExports: function() {
		                                            return exportsPromise;
		                                        }
		                                    });
		                                    !function(allowedParentDomains, domain) {
		                                        if (!matchDomain(allowedParentDomains, domain)) throw new Error("Can not be rendered by domain: " + domain);
		                                    }(allowedParentDomains, parentDomain);
		                                    markWindowKnown(parentComponentWindow);
		                                    !function() {
		                                        window$1.addEventListener("beforeunload", (function() {
		                                            checkClose.fireAndForget();
		                                        }));
		                                        window$1.addEventListener("unload", (function() {
		                                            checkClose.fireAndForget();
		                                        }));
		                                        onCloseWindow(parentComponentWindow, (function() {
		                                            child_destroy();
		                                        }));
		                                    }();
		                                    return parentInit({
		                                        updateProps: updateProps,
		                                        close: child_destroy
		                                    });
		                                })).then((function() {
		                                    return (_autoResize$width = autoResize.width, width = void 0 !== _autoResize$width && _autoResize$width, 
		                                    _autoResize$height = autoResize.height, height = void 0 !== _autoResize$height && _autoResize$height, 
		                                    _autoResize$element = autoResize.element, elementReady(void 0 === _autoResize$element ? "body" : _autoResize$element).catch(src_util_noop).then((function(element) {
		                                        return {
		                                            width: width,
		                                            height: height,
		                                            element: element
		                                        };
		                                    }))).then((function(_ref3) {
		                                        var width = _ref3.width, height = _ref3.height, element = _ref3.element;
		                                        element && (width || height) && context !== CONTEXT.POPUP && onResize(element, (function(_ref4) {
		                                            resize({
		                                                width: width ? _ref4.width : void 0,
		                                                height: height ? _ref4.height : void 0
		                                            });
		                                        }), {
		                                            width: width,
		                                            height: height
		                                        });
		                                    }));
		                                    var _autoResize$width, width, _autoResize$height, height, _autoResize$element;
		                                })).catch((function(err) {
		                                    onError(err);
		                                }));
		                            },
		                            getProps: function() {
		                                if (props) return props;
		                                setProps(initialProps, parentDomain);
		                                return props;
		                            }
		                        };
		                    }(options);
		                    child.init();
		                    return child;
		                }
		            }));
		            registerChild();
		            !function() {
		                var allowDelegateListener = on_on("zoid_allow_delegate_" + name, (function() {
		                    return !0;
		                }));
		                var delegateListener = on_on("zoid_delegate_" + name, (function(_ref2) {
		                    var _ref2$data = _ref2.data;
		                    return {
		                        parent: parentComponent({
		                            uid: _ref2$data.uid,
		                            options: options,
		                            overrides: _ref2$data.overrides,
		                            parentWin: _ref2.source
		                        })
		                    };
		                }));
		                cleanZoid.register(allowDelegateListener.cancel);
		                cleanZoid.register(delegateListener.cancel);
		            }();
		            global.components = global.components || {};
		            if (global.components[tag]) throw new Error("Can not register multiple components with the same tag: " + tag);
		            global.components[tag] = !0;
		            return {
		                init: function init(inputProps) {
		                    var instance;
		                    var uid = "zoid-" + tag + "-" + uniqueID();
		                    var props = inputProps || {};
		                    var _eligible = eligible({
		                        props: props
		                    }), eligibility = _eligible.eligible, reason = _eligible.reason;
		                    var onDestroy = props.onDestroy;
		                    props.onDestroy = function() {
		                        instance && eligibility && instances.splice(instances.indexOf(instance), 1);
		                        if (onDestroy) return onDestroy.apply(void 0, arguments);
		                    };
		                    var parent = parentComponent({
		                        uid: uid,
		                        options: options
		                    });
		                    parent.init();
		                    eligibility ? parent.setProps(props) : props.onDestroy && props.onDestroy();
		                    cleanInstances.register((function(err) {
		                        return parent.destroy(err || new Error("zoid destroyed all components"));
		                    }));
		                    var clone = function(_temp) {
		                        var _ref4$decorate = (void 0 === _temp ? {} : _temp).decorate;
		                        return init((void 0 === _ref4$decorate ? identity : _ref4$decorate)(props));
		                    };
		                    var _render = function(target, container, context) {
		                        return promise_ZalgoPromise.try((function() {
		                            if (!eligibility) {
		                                var err = new Error(reason || name + " component is not eligible");
		                                return parent.destroy(err).then((function() {
		                                    throw err;
		                                }));
		                            }
		                            if (!isWindow(target)) throw new Error("Must pass window to renderTo");
		                            return function(props, context) {
		                                return promise_ZalgoPromise.try((function() {
		                                    if (props.window) return setup_toProxyWindow(props.window).getType();
		                                    if (context) {
		                                        if (context !== CONTEXT.IFRAME && context !== CONTEXT.POPUP) throw new Error("Unrecognized context: " + context);
		                                        return context;
		                                    }
		                                    return defaultContext;
		                                }));
		                            }(props, context);
		                        })).then((function(finalContext) {
		                            container = function(context, container) {
		                                if (container) {
		                                    if ("string" != typeof container && !isElement(container)) throw new TypeError("Expected string or element selector to be passed");
		                                    return container;
		                                }
		                                if (context === CONTEXT.POPUP) return "body";
		                                throw new Error("Expected element to be passed to render iframe");
		                            }(finalContext, container);
		                            if (target !== window$1 && "string" != typeof container) throw new Error("Must pass string element when rendering to another window");
		                            return parent.render({
		                                target: target,
		                                container: container,
		                                context: finalContext,
		                                rerender: function() {
		                                    var newInstance = clone();
		                                    extend(instance, newInstance);
		                                    return newInstance.renderTo(target, container, context);
		                                }
		                            });
		                        })).catch((function(err) {
		                            return parent.destroy(err).then((function() {
		                                throw err;
		                            }));
		                        }));
		                    };
		                    instance = _extends({}, parent.getExports(), parent.getHelpers(), function() {
		                        var childComponents = children();
		                        var result = {};
		                        var _loop2 = function(_i4, _Object$keys4) {
		                            var childName = _Object$keys4[_i4];
		                            var Child = childComponents[childName];
		                            result[childName] = function(childInputProps) {
		                                var parentProps = parent.getProps();
		                                var childProps = _extends({}, childInputProps, {
		                                    parent: {
		                                        uid: uid,
		                                        props: parentProps,
		                                        export: parent.export
		                                    }
		                                });
		                                return Child(childProps);
		                            };
		                        };
		                        for (var _i4 = 0, _Object$keys4 = Object.keys(childComponents); _i4 < _Object$keys4.length; _i4++) _loop2(_i4, _Object$keys4);
		                        return result;
		                    }(), {
		                        isEligible: function() {
		                            return eligibility;
		                        },
		                        clone: clone,
		                        render: function(container, context) {
		                            return _render(window$1, container, context);
		                        },
		                        renderTo: function(target, container, context) {
		                            return _render(target, container, context);
		                        }
		                    });
		                    eligibility && instances.push(instance);
		                    return instance;
		                },
		                instances: instances,
		                driver: function(driverName, dep) {
		                    throw new Error("Driver support not enabled");
		                },
		                isChild: isChild,
		                canRenderTo: function(win) {
		                    return send_send(win, "zoid_allow_delegate_" + name).then((function(_ref3) {
		                        return _ref3.data;
		                    })).catch((function() {
		                        return !1;
		                    }));
		                },
		                registerChild: registerChild
		            };
		        }
		        var component_create = function(options) {
		            !function() {
		                if (!global_getGlobal().initialized) {
		                    global_getGlobal().initialized = !0;
		                    on = (_ref3 = {
		                        on: on_on,
		                        send: send_send
		                    }).on, send = _ref3.send, (global = global_getGlobal()).receiveMessage = global.receiveMessage || function(message) {
		                        return receive_receiveMessage(message, {
		                            on: on,
		                            send: send
		                        });
		                    };
		                    !function(_ref5) {
		                        var on = _ref5.on, send = _ref5.send;
		                        globalStore().getOrSet("postMessageListener", (function() {
		                            return addEventListener(window$1, "message", (function(event) {
		                                !function(event, _ref4) {
		                                    var on = _ref4.on, send = _ref4.send;
		                                    promise_ZalgoPromise.try((function() {
		                                        var source = event.source || event.sourceElement;
		                                        var origin = event.origin || event.originalEvent && event.originalEvent.origin;
		                                        var data = event.data;
		                                        "null" === origin && (origin = "file://");
		                                        if (source) {
		                                            if (!origin) throw new Error("Post message did not have origin domain");
		                                            receive_receiveMessage({
		                                                source: source,
		                                                origin: origin,
		                                                data: data
		                                            }, {
		                                                on: on,
		                                                send: send
		                                            });
		                                        }
		                                    }));
		                                }(event, {
		                                    on: on,
		                                    send: send
		                                });
		                            }));
		                        }));
		                    }({
		                        on: on_on,
		                        send: send_send
		                    });
		                    !function(_ref8) {
		                        var on = _ref8.on, send = _ref8.send;
		                        globalStore("builtinListeners").getOrSet("helloListener", (function() {
		                            var listener = on("postrobot_hello", {
		                                domain: "*"
		                            }, (function(_ref3) {
		                                resolveHelloPromise(_ref3.source, {
		                                    domain: _ref3.origin
		                                });
		                                return {
		                                    instanceID: getInstanceID()
		                                };
		                            }));
		                            var parent = getAncestor();
		                            parent && sayHello(parent, {
		                                send: send
		                            }).catch((function(err) {}));
		                            return listener;
		                        }));
		                    }({
		                        on: on_on,
		                        send: send_send
		                    });
		                }
		                var _ref3, on, send, global;
		            }();
		            var comp = component(options);
		            var init = function(props) {
		                return comp.init(props);
		            };
		            init.driver = function(name, dep) {
		                return comp.driver(name, dep);
		            };
		            init.isChild = function() {
		                return comp.isChild();
		            };
		            init.canRenderTo = function(win) {
		                return comp.canRenderTo(win);
		            };
		            init.instances = comp.instances;
		            var child = comp.registerChild();
		            child && (window$1.xprops = init.xprops = child.getProps());
		            return init;
		        };
		        function destroyComponents(err) {
		            var destroyPromise = cleanInstances.all(err);
		            cleanInstances = cleanup();
		            return destroyPromise;
		        }
		        var destroyAll = destroyComponents;
		        function component_destroy(err) {
		            destroyAll();
		            delete window$1.__zoid_9_0_86__;
		            !function() {
		                !function() {
		                    var responseListeners = globalStore("responseListeners");
		                    for (var _i2 = 0, _responseListeners$ke2 = responseListeners.keys(); _i2 < _responseListeners$ke2.length; _i2++) {
		                        var hash = _responseListeners$ke2[_i2];
		                        var listener = responseListeners.get(hash);
		                        listener && (listener.cancelled = !0);
		                        responseListeners.del(hash);
		                    }
		                }();
		                (listener = globalStore().get("postMessageListener")) && listener.cancel();
		                var listener;
		                delete window$1.__post_robot_10_0_44__;
		            }();
		            return cleanZoid.all(err);
		        }
		    } ]);
		})); 
	} (zoid_frame));
	return zoid_frame.exports;
}

var zoid$1 = {exports: {}};

var hasRequiredZoid;

function requireZoid () {
	if (hasRequiredZoid) return zoid$1.exports;
	hasRequiredZoid = 1;
	(function (module, exports) {
		!function(root, factory) {
		    module.exports = factory() ;
		}("undefined" != typeof self ? self : commonjsGlobal, (function() {
		    return function(modules) {
		        var installedModules = {};
		        function __webpack_require__(moduleId) {
		            if (installedModules[moduleId]) return installedModules[moduleId].exports;
		            var module = installedModules[moduleId] = {
		                i: moduleId,
		                l: !1,
		                exports: {}
		            };
		            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		            module.l = !0;
		            return module.exports;
		        }
		        __webpack_require__.m = modules;
		        __webpack_require__.c = installedModules;
		        __webpack_require__.d = function(exports, name, getter) {
		            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
		                enumerable: !0,
		                get: getter
		            });
		        };
		        __webpack_require__.r = function(exports) {
		            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
		                value: "Module"
		            });
		            Object.defineProperty(exports, "__esModule", {
		                value: !0
		            });
		        };
		        __webpack_require__.t = function(value, mode) {
		            1 & mode && (value = __webpack_require__(value));
		            if (8 & mode) return value;
		            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
		            var ns = Object.create(null);
		            __webpack_require__.r(ns);
		            Object.defineProperty(ns, "default", {
		                enumerable: !0,
		                value: value
		            });
		            if (2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
		                return value[key];
		            }.bind(null, key));
		            return ns;
		        };
		        __webpack_require__.n = function(module) {
		            var getter = module && module.__esModule ? function() {
		                return module.default;
		            } : function() {
		                return module;
		            };
		            __webpack_require__.d(getter, "a", getter);
		            return getter;
		        };
		        __webpack_require__.o = function(object, property) {
		            return {}.hasOwnProperty.call(object, property);
		        };
		        __webpack_require__.p = "";
		        return __webpack_require__(__webpack_require__.s = 0);
		    }([ function(module, __webpack_exports__, __webpack_require__) {
		        __webpack_require__.r(__webpack_exports__);
		        __webpack_require__.d(__webpack_exports__, "PopupOpenError", (function() {
		            return dom_PopupOpenError;
		        }));
		        __webpack_require__.d(__webpack_exports__, "create", (function() {
		            return component_create;
		        }));
		        __webpack_require__.d(__webpack_exports__, "destroy", (function() {
		            return component_destroy;
		        }));
		        __webpack_require__.d(__webpack_exports__, "destroyComponents", (function() {
		            return destroyComponents;
		        }));
		        __webpack_require__.d(__webpack_exports__, "destroyAll", (function() {
		            return destroyAll;
		        }));
		        __webpack_require__.d(__webpack_exports__, "PROP_TYPE", (function() {
		            return PROP_TYPE;
		        }));
		        __webpack_require__.d(__webpack_exports__, "PROP_SERIALIZATION", (function() {
		            return PROP_SERIALIZATION;
		        }));
		        __webpack_require__.d(__webpack_exports__, "CONTEXT", (function() {
		            return CONTEXT;
		        }));
		        __webpack_require__.d(__webpack_exports__, "EVENT", (function() {
		            return EVENT;
		        }));
		        function _setPrototypeOf(o, p) {
		            return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
		                o.__proto__ = p;
		                return o;
		            })(o, p);
		        }
		        function _inheritsLoose(subClass, superClass) {
		            subClass.prototype = Object.create(superClass.prototype);
		            subClass.prototype.constructor = subClass;
		            _setPrototypeOf(subClass, superClass);
		        }
		        function _extends() {
		            return (_extends = Object.assign || function(target) {
		                for (var i = 1; i < arguments.length; i++) {
		                    var source = arguments[i];
		                    for (var key in source) ({}).hasOwnProperty.call(source, key) && (target[key] = source[key]);
		                }
		                return target;
		            }).apply(this, arguments);
		        }
		        function utils_isPromise(item) {
		            try {
		                if (!item) return !1;
		                if ("undefined" != typeof Promise && item instanceof Promise) return !0;
		                if ("undefined" != typeof window$1 && "function" == typeof window$1.Window && item instanceof window$1.Window) return !1;
		                if ("undefined" != typeof window$1 && "function" == typeof window$1.constructor && item instanceof window$1.constructor) return !1;
		                var _toString = {}.toString;
		                if (_toString) {
		                    var name = _toString.call(item);
		                    if ("[object Window]" === name || "[object global]" === name || "[object DOMWindow]" === name) return !1;
		                }
		                if ("function" == typeof item.then) return !0;
		            } catch (err) {
		                return !1;
		            }
		            return !1;
		        }
		        var dispatchedErrors = [];
		        var possiblyUnhandledPromiseHandlers = [];
		        var activeCount = 0;
		        var flushPromise;
		        function flushActive() {
		            if (!activeCount && flushPromise) {
		                var promise = flushPromise;
		                flushPromise = null;
		                promise.resolve();
		            }
		        }
		        function startActive() {
		            activeCount += 1;
		        }
		        function endActive() {
		            activeCount -= 1;
		            flushActive();
		        }
		        var promise_ZalgoPromise = function() {
		            function ZalgoPromise(handler) {
		                var _this = this;
		                this.resolved = void 0;
		                this.rejected = void 0;
		                this.errorHandled = void 0;
		                this.value = void 0;
		                this.error = void 0;
		                this.handlers = void 0;
		                this.dispatching = void 0;
		                this.stack = void 0;
		                this.resolved = !1;
		                this.rejected = !1;
		                this.errorHandled = !1;
		                this.handlers = [];
		                if (handler) {
		                    var _result;
		                    var _error;
		                    var resolved = !1;
		                    var rejected = !1;
		                    var isAsync = !1;
		                    startActive();
		                    try {
		                        handler((function(res) {
		                            if (isAsync) _this.resolve(res); else {
		                                resolved = !0;
		                                _result = res;
		                            }
		                        }), (function(err) {
		                            if (isAsync) _this.reject(err); else {
		                                rejected = !0;
		                                _error = err;
		                            }
		                        }));
		                    } catch (err) {
		                        endActive();
		                        this.reject(err);
		                        return;
		                    }
		                    endActive();
		                    isAsync = !0;
		                    resolved ? this.resolve(_result) : rejected && this.reject(_error);
		                }
		            }
		            var _proto = ZalgoPromise.prototype;
		            _proto.resolve = function(result) {
		                if (this.resolved || this.rejected) return this;
		                if (utils_isPromise(result)) throw new Error("Can not resolve promise with another promise");
		                this.resolved = !0;
		                this.value = result;
		                this.dispatch();
		                return this;
		            };
		            _proto.reject = function(error) {
		                var _this2 = this;
		                if (this.resolved || this.rejected) return this;
		                if (utils_isPromise(error)) throw new Error("Can not reject promise with another promise");
		                if (!error) {
		                    var _err = error && "function" == typeof error.toString ? error.toString() : {}.toString.call(error);
		                    error = new Error("Expected reject to be called with Error, got " + _err);
		                }
		                this.rejected = !0;
		                this.error = error;
		                this.errorHandled || setTimeout((function() {
		                    _this2.errorHandled || function(err, promise) {
		                        if (-1 === dispatchedErrors.indexOf(err)) {
		                            dispatchedErrors.push(err);
		                            setTimeout((function() {
		                                throw err;
		                            }), 1);
		                            for (var j = 0; j < possiblyUnhandledPromiseHandlers.length; j++) possiblyUnhandledPromiseHandlers[j](err, promise);
		                        }
		                    }(error, _this2);
		                }), 1);
		                this.dispatch();
		                return this;
		            };
		            _proto.asyncReject = function(error) {
		                this.errorHandled = !0;
		                this.reject(error);
		                return this;
		            };
		            _proto.dispatch = function() {
		                var resolved = this.resolved, rejected = this.rejected, handlers = this.handlers;
		                if (!this.dispatching && (resolved || rejected)) {
		                    this.dispatching = !0;
		                    startActive();
		                    var chain = function(firstPromise, secondPromise) {
		                        return firstPromise.then((function(res) {
		                            secondPromise.resolve(res);
		                        }), (function(err) {
		                            secondPromise.reject(err);
		                        }));
		                    };
		                    for (var i = 0; i < handlers.length; i++) {
		                        var _handlers$i = handlers[i], onSuccess = _handlers$i.onSuccess, onError = _handlers$i.onError, promise = _handlers$i.promise;
		                        var _result2 = void 0;
		                        if (resolved) try {
		                            _result2 = onSuccess ? onSuccess(this.value) : this.value;
		                        } catch (err) {
		                            promise.reject(err);
		                            continue;
		                        } else if (rejected) {
		                            if (!onError) {
		                                promise.reject(this.error);
		                                continue;
		                            }
		                            try {
		                                _result2 = onError(this.error);
		                            } catch (err) {
		                                promise.reject(err);
		                                continue;
		                            }
		                        }
		                        if (_result2 instanceof ZalgoPromise && (_result2.resolved || _result2.rejected)) {
		                            var promiseResult = _result2;
		                            promiseResult.resolved ? promise.resolve(promiseResult.value) : promise.reject(promiseResult.error);
		                            promiseResult.errorHandled = !0;
		                        } else utils_isPromise(_result2) ? _result2 instanceof ZalgoPromise && (_result2.resolved || _result2.rejected) ? _result2.resolved ? promise.resolve(_result2.value) : promise.reject(_result2.error) : chain(_result2, promise) : promise.resolve(_result2);
		                    }
		                    handlers.length = 0;
		                    this.dispatching = !1;
		                    endActive();
		                }
		            };
		            _proto.then = function(onSuccess, onError) {
		                if (onSuccess && "function" != typeof onSuccess && !onSuccess.call) throw new Error("Promise.then expected a function for success handler");
		                if (onError && "function" != typeof onError && !onError.call) throw new Error("Promise.then expected a function for error handler");
		                var promise = new ZalgoPromise;
		                this.handlers.push({
		                    promise: promise,
		                    onSuccess: onSuccess,
		                    onError: onError
		                });
		                this.errorHandled = !0;
		                this.dispatch();
		                return promise;
		            };
		            _proto.catch = function(onError) {
		                return this.then(void 0, onError);
		            };
		            _proto.finally = function(onFinally) {
		                if (onFinally && "function" != typeof onFinally && !onFinally.call) throw new Error("Promise.finally expected a function");
		                return this.then((function(result) {
		                    return ZalgoPromise.try(onFinally).then((function() {
		                        return result;
		                    }));
		                }), (function(err) {
		                    return ZalgoPromise.try(onFinally).then((function() {
		                        throw err;
		                    }));
		                }));
		            };
		            _proto.timeout = function(time, err) {
		                var _this3 = this;
		                if (this.resolved || this.rejected) return this;
		                var timeout = setTimeout((function() {
		                    _this3.resolved || _this3.rejected || _this3.reject(err || new Error("Promise timed out after " + time + "ms"));
		                }), time);
		                return this.then((function(result) {
		                    clearTimeout(timeout);
		                    return result;
		                }));
		            };
		            _proto.toPromise = function() {
		                if ("undefined" == typeof Promise) throw new TypeError("Could not find Promise");
		                return Promise.resolve(this);
		            };
		            _proto.lazy = function() {
		                this.errorHandled = !0;
		                return this;
		            };
		            ZalgoPromise.resolve = function(value) {
		                return value instanceof ZalgoPromise ? value : utils_isPromise(value) ? new ZalgoPromise((function(resolve, reject) {
		                    return value.then(resolve, reject);
		                })) : (new ZalgoPromise).resolve(value);
		            };
		            ZalgoPromise.reject = function(error) {
		                return (new ZalgoPromise).reject(error);
		            };
		            ZalgoPromise.asyncReject = function(error) {
		                return (new ZalgoPromise).asyncReject(error);
		            };
		            ZalgoPromise.all = function(promises) {
		                var promise = new ZalgoPromise;
		                var count = promises.length;
		                var results = [].slice();
		                if (!count) {
		                    promise.resolve(results);
		                    return promise;
		                }
		                var chain = function(i, firstPromise, secondPromise) {
		                    return firstPromise.then((function(res) {
		                        results[i] = res;
		                        0 == (count -= 1) && promise.resolve(results);
		                    }), (function(err) {
		                        secondPromise.reject(err);
		                    }));
		                };
		                for (var i = 0; i < promises.length; i++) {
		                    var prom = promises[i];
		                    if (prom instanceof ZalgoPromise) {
		                        if (prom.resolved) {
		                            results[i] = prom.value;
		                            count -= 1;
		                            continue;
		                        }
		                    } else if (!utils_isPromise(prom)) {
		                        results[i] = prom;
		                        count -= 1;
		                        continue;
		                    }
		                    chain(i, ZalgoPromise.resolve(prom), promise);
		                }
		                0 === count && promise.resolve(results);
		                return promise;
		            };
		            ZalgoPromise.hash = function(promises) {
		                var result = {};
		                var awaitPromises = [];
		                var _loop = function(key) {
		                    if (promises.hasOwnProperty(key)) {
		                        var value = promises[key];
		                        utils_isPromise(value) ? awaitPromises.push(value.then((function(res) {
		                            result[key] = res;
		                        }))) : result[key] = value;
		                    }
		                };
		                for (var key in promises) _loop(key);
		                return ZalgoPromise.all(awaitPromises).then((function() {
		                    return result;
		                }));
		            };
		            ZalgoPromise.map = function(items, method) {
		                return ZalgoPromise.all(items.map(method));
		            };
		            ZalgoPromise.onPossiblyUnhandledException = function(handler) {
		                return function(handler) {
		                    possiblyUnhandledPromiseHandlers.push(handler);
		                    return {
		                        cancel: function() {
		                            possiblyUnhandledPromiseHandlers.splice(possiblyUnhandledPromiseHandlers.indexOf(handler), 1);
		                        }
		                    };
		                }(handler);
		            };
		            ZalgoPromise.try = function(method, context, args) {
		                if (method && "function" != typeof method && !method.call) throw new Error("Promise.try expected a function");
		                var result;
		                startActive();
		                try {
		                    result = method.apply(context, args || []);
		                } catch (err) {
		                    endActive();
		                    return ZalgoPromise.reject(err);
		                }
		                endActive();
		                return ZalgoPromise.resolve(result);
		            };
		            ZalgoPromise.delay = function(_delay) {
		                return new ZalgoPromise((function(resolve) {
		                    setTimeout(resolve, _delay);
		                }));
		            };
		            ZalgoPromise.isPromise = function(value) {
		                return !!(value && value instanceof ZalgoPromise) || utils_isPromise(value);
		            };
		            ZalgoPromise.flush = function() {
		                return function(Zalgo) {
		                    var promise = flushPromise = flushPromise || new Zalgo;
		                    flushActive();
		                    return promise;
		                }(ZalgoPromise);
		            };
		            return ZalgoPromise;
		        }();
		        function isRegex(item) {
		            return "[object RegExp]" === {}.toString.call(item);
		        }
		        var WINDOW_TYPE = {
		            IFRAME: "iframe",
		            POPUP: "popup"
		        };
		        var IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n";
		        function getActualProtocol(win) {
		            void 0 === win && (win = window$1);
		            return win.location.protocol;
		        }
		        function getProtocol(win) {
		            void 0 === win && (win = window$1);
		            if (win.mockDomain) {
		                var protocol = win.mockDomain.split("//")[0];
		                if (protocol) return protocol;
		            }
		            return getActualProtocol(win);
		        }
		        function isAboutProtocol(win) {
		            void 0 === win && (win = window$1);
		            return "about:" === getProtocol(win);
		        }
		        function utils_getParent(win) {
		            void 0 === win && (win = window$1);
		            if (win) try {
		                if (win.parent && win.parent !== win) return win.parent;
		            } catch (err) {}
		        }
		        function getOpener(win) {
		            void 0 === win && (win = window$1);
		            if (win && !utils_getParent(win)) try {
		                return win.opener;
		            } catch (err) {}
		        }
		        function canReadFromWindow(win) {
		            try {
		                return !0;
		            } catch (err) {}
		            return !1;
		        }
		        function getActualDomain(win) {
		            void 0 === win && (win = window$1);
		            var location = win.location;
		            if (!location) throw new Error("Can not read window location");
		            var protocol = getActualProtocol(win);
		            if (!protocol) throw new Error("Can not read window protocol");
		            if ("file:" === protocol) return "file://";
		            if ("about:" === protocol) {
		                var parent = utils_getParent(win);
		                return parent && canReadFromWindow() ? getActualDomain(parent) : "about://";
		            }
		            var host = location.host;
		            if (!host) throw new Error("Can not read window host");
		            return protocol + "//" + host;
		        }
		        function getDomain(win) {
		            void 0 === win && (win = window$1);
		            var domain = getActualDomain(win);
		            return domain && win.mockDomain && 0 === win.mockDomain.indexOf("mock:") ? win.mockDomain : domain;
		        }
		        function isSameDomain(win) {
		            if (!function(win) {
		                try {
		                    if (win === window$1) return !0;
		                } catch (err) {}
		                try {
		                    var desc = Object.getOwnPropertyDescriptor(win, "location");
		                    if (desc && !1 === desc.enumerable) return !1;
		                } catch (err) {}
		                try {
		                    if (isAboutProtocol(win) && canReadFromWindow()) return !0;
		                } catch (err) {}
		                try {
		                    if (function(win) {
		                        void 0 === win && (win = window$1);
		                        return "mock:" === getProtocol(win);
		                    }(win) && canReadFromWindow()) return !0;
		                } catch (err) {}
		                try {
		                    if (getActualDomain(win) === getActualDomain(window$1)) return !0;
		                } catch (err) {}
		                return !1;
		            }(win)) return !1;
		            try {
		                if (win === window$1) return !0;
		                if (isAboutProtocol(win) && canReadFromWindow()) return !0;
		                if (getDomain(window$1) === getDomain(win)) return !0;
		            } catch (err) {}
		            return !1;
		        }
		        function assertSameDomain(win) {
		            if (!isSameDomain(win)) throw new Error("Expected window to be same domain");
		            return win;
		        }
		        function isAncestorParent(parent, child) {
		            if (!parent || !child) return !1;
		            var childParent = utils_getParent(child);
		            return childParent ? childParent === parent : -1 !== function(win) {
		                var result = [];
		                try {
		                    for (;win.parent !== win; ) {
		                        result.push(win.parent);
		                        win = win.parent;
		                    }
		                } catch (err) {}
		                return result;
		            }(child).indexOf(parent);
		        }
		        function getFrames(win) {
		            var result = [];
		            var frames;
		            try {
		                frames = win.frames;
		            } catch (err) {
		                frames = win;
		            }
		            var len;
		            try {
		                len = frames.length;
		            } catch (err) {}
		            if (0 === len) return result;
		            if (len) {
		                for (var i = 0; i < len; i++) {
		                    var frame = void 0;
		                    try {
		                        frame = frames[i];
		                    } catch (err) {
		                        continue;
		                    }
		                    result.push(frame);
		                }
		                return result;
		            }
		            for (var _i = 0; _i < 100; _i++) {
		                var _frame = void 0;
		                try {
		                    _frame = frames[_i];
		                } catch (err) {
		                    return result;
		                }
		                if (!_frame) return result;
		                result.push(_frame);
		            }
		            return result;
		        }
		        function getAllChildFrames(win) {
		            var result = [];
		            for (var _i3 = 0, _getFrames2 = getFrames(win); _i3 < _getFrames2.length; _i3++) {
		                var frame = _getFrames2[_i3];
		                result.push(frame);
		                for (var _i5 = 0, _getAllChildFrames2 = getAllChildFrames(frame); _i5 < _getAllChildFrames2.length; _i5++) result.push(_getAllChildFrames2[_i5]);
		            }
		            return result;
		        }
		        function getTop(win) {
		            void 0 === win && (win = window$1);
		            try {
		                if (win.top) return win.top;
		            } catch (err) {}
		            if (utils_getParent(win) === win) return win;
		            try {
		                if (isAncestorParent(window$1, win) && window$1.top) return window$1.top;
		            } catch (err) {}
		            try {
		                if (isAncestorParent(win, window$1) && window$1.top) return window$1.top;
		            } catch (err) {}
		            for (var _i7 = 0, _getAllChildFrames4 = getAllChildFrames(win); _i7 < _getAllChildFrames4.length; _i7++) {
		                var frame = _getAllChildFrames4[_i7];
		                try {
		                    if (frame.top) return frame.top;
		                } catch (err) {}
		                if (utils_getParent(frame) === frame) return frame;
		            }
		        }
		        function getAllFramesInWindow(win) {
		            var top = getTop(win);
		            if (!top) throw new Error("Can not determine top window");
		            var result = [].concat(getAllChildFrames(top), [ top ]);
		            -1 === result.indexOf(win) && (result = [].concat(result, [ win ], getAllChildFrames(win)));
		            return result;
		        }
		        var iframeWindows = [];
		        var iframeFrames = [];
		        function isWindowClosed(win, allowMock) {
		            void 0 === allowMock && (allowMock = !0);
		            try {
		                if (win === window$1) return !1;
		            } catch (err) {
		                return !0;
		            }
		            try {
		                if (!win) return !0;
		            } catch (err) {
		                return !0;
		            }
		            try {
		                if (win.closed) return !0;
		            } catch (err) {
		                return !err || err.message !== IE_WIN_ACCESS_ERROR;
		            }
		            if (allowMock && isSameDomain(win)) try {
		                if (win.mockclosed) return !0;
		            } catch (err) {}
		            try {
		                if (!win.parent || !win.top) return !0;
		            } catch (err) {}
		            var iframeIndex = function(collection, item) {
		                for (var i = 0; i < collection.length; i++) try {
		                    if (collection[i] === item) return i;
		                } catch (err) {}
		                return -1;
		            }(iframeWindows, win);
		            if (-1 !== iframeIndex) {
		                var frame = iframeFrames[iframeIndex];
		                if (frame && function(frame) {
		                    if (!frame.contentWindow) return !0;
		                    if (!frame.parentNode) return !0;
		                    var doc = frame.ownerDocument;
		                    if (doc && doc.documentElement && !doc.documentElement.contains(frame)) {
		                        var parent = frame;
		                        for (;parent.parentNode && parent.parentNode !== parent; ) parent = parent.parentNode;
		                        if (!parent.host || !doc.documentElement.contains(parent.host)) return !0;
		                    }
		                    return !1;
		                }(frame)) return !0;
		            }
		            return !1;
		        }
		        function utils_getUserAgent(win) {
		            return (win = win || window$1).navigator.mockUserAgent || win.navigator.userAgent;
		        }
		        function getFrameByName(win, name) {
		            var winFrames = getFrames(win);
		            for (var _i9 = 0; _i9 < winFrames.length; _i9++) {
		                var childFrame = winFrames[_i9];
		                try {
		                    if (isSameDomain(childFrame) && childFrame.name === name && -1 !== winFrames.indexOf(childFrame)) return childFrame;
		                } catch (err) {}
		            }
		            try {
		                if (-1 !== winFrames.indexOf(win.frames[name])) return win.frames[name];
		            } catch (err) {}
		            try {
		                if (-1 !== winFrames.indexOf(win[name])) return win[name];
		            } catch (err) {}
		        }
		        function isOpener(parent, child) {
		            return parent === getOpener(child);
		        }
		        function getAncestor(win) {
		            void 0 === win && (win = window$1);
		            return getOpener(win = win || window$1) || utils_getParent(win) || void 0;
		        }
		        function anyMatch(collection1, collection2) {
		            for (var _i17 = 0; _i17 < collection1.length; _i17++) {
		                var item1 = collection1[_i17];
		                for (var _i19 = 0; _i19 < collection2.length; _i19++) if (item1 === collection2[_i19]) return !0;
		            }
		            return !1;
		        }
		        function getDistanceFromTop(win) {
		            void 0 === win && (win = window$1);
		            var distance = 0;
		            var parent = win;
		            for (;parent; ) (parent = utils_getParent(parent)) && (distance += 1);
		            return distance;
		        }
		        function isSameTopWindow(win1, win2) {
		            var top1 = getTop(win1) || win1;
		            var top2 = getTop(win2) || win2;
		            try {
		                if (top1 && top2) return top1 === top2;
		            } catch (err) {}
		            var allFrames1 = getAllFramesInWindow(win1);
		            var allFrames2 = getAllFramesInWindow(win2);
		            if (anyMatch(allFrames1, allFrames2)) return !0;
		            var opener1 = getOpener(top1);
		            var opener2 = getOpener(top2);
		            return opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2) || opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1), 
		            !1;
		        }
		        function matchDomain(pattern, origin) {
		            if ("string" == typeof pattern) {
		                if ("string" == typeof origin) return "*" === pattern || origin === pattern;
		                if (isRegex(origin)) return !1;
		                if (Array.isArray(origin)) return !1;
		            }
		            return isRegex(pattern) ? isRegex(origin) ? pattern.toString() === origin.toString() : !Array.isArray(origin) && Boolean(origin.match(pattern)) : !!Array.isArray(pattern) && (Array.isArray(origin) ? JSON.stringify(pattern) === JSON.stringify(origin) : !isRegex(origin) && pattern.some((function(subpattern) {
		                return matchDomain(subpattern, origin);
		            })));
		        }
		        function getDomainFromUrl(url) {
		            return url.match(/^(https?|mock|file):\/\//) ? url.split("/").slice(0, 3).join("/") : getDomain();
		        }
		        function onCloseWindow(win, callback, delay, maxtime) {
		            void 0 === delay && (delay = 1e3);
		            void 0 === maxtime && (maxtime = 1 / 0);
		            var timeout;
		            !function check() {
		                if (isWindowClosed(win)) {
		                    timeout && clearTimeout(timeout);
		                    return callback();
		                }
		                if (maxtime <= 0) clearTimeout(timeout); else {
		                    maxtime -= delay;
		                    timeout = setTimeout(check, delay);
		                }
		            }();
		            return {
		                cancel: function() {
		                    timeout && clearTimeout(timeout);
		                }
		            };
		        }
		        function isWindow(obj) {
		            try {
		                if (obj === window$1) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if ("[object Window]" === {}.toString.call(obj)) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (window$1.Window && obj instanceof window$1.Window) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && obj.self === obj) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && obj.parent === obj) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && obj.top === obj) return !0;
		            } catch (err) {
		                if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
		            }
		            try {
		                if (obj && "__unlikely_value__" === obj.__cross_domain_utils_window_check__) return !1;
		            } catch (err) {
		                return !0;
		            }
		            try {
		                if ("postMessage" in obj && "self" in obj && "location" in obj) return !0;
		            } catch (err) {}
		            return !1;
		        }
		        function normalizeMockUrl(url) {
		            if (!(domain = getDomainFromUrl(url), 0 === domain.indexOf("mock:"))) return url;
		            var domain;
		            throw new Error("Mock urls not supported out of test mode");
		        }
		        function getFrameForWindow(win) {
		            if (isSameDomain(win)) return assertSameDomain(win).frameElement;
		            for (var _i21 = 0, _document$querySelect2 = document.querySelectorAll("iframe"); _i21 < _document$querySelect2.length; _i21++) {
		                var frame = _document$querySelect2[_i21];
		                if (frame && frame.contentWindow && frame.contentWindow === win) return frame;
		            }
		        }
		        function closeWindow(win) {
		            if (function(win) {
		                void 0 === win && (win = window$1);
		                return Boolean(utils_getParent(win));
		            }(win)) {
		                var frame = getFrameForWindow(win);
		                if (frame && frame.parentElement) {
		                    frame.parentElement.removeChild(frame);
		                    return;
		                }
		            }
		            try {
		                win.close();
		            } catch (err) {}
		        }
		        function util_safeIndexOf(collection, item) {
		            for (var i = 0; i < collection.length; i++) try {
		                if (collection[i] === item) return i;
		            } catch (err) {}
		            return -1;
		        }
		        var weakmap_CrossDomainSafeWeakMap = function() {
		            function CrossDomainSafeWeakMap() {
		                this.name = void 0;
		                this.weakmap = void 0;
		                this.keys = void 0;
		                this.values = void 0;
		                this.name = "__weakmap_" + (1e9 * Math.random() >>> 0) + "__";
		                if (function() {
		                    if ("undefined" == typeof WeakMap) return !1;
		                    if (void 0 === Object.freeze) return !1;
		                    try {
		                        var testWeakMap = new WeakMap;
		                        var testKey = {};
		                        Object.freeze(testKey);
		                        testWeakMap.set(testKey, "__testvalue__");
		                        return "__testvalue__" === testWeakMap.get(testKey);
		                    } catch (err) {
		                        return !1;
		                    }
		                }()) try {
		                    this.weakmap = new WeakMap;
		                } catch (err) {}
		                this.keys = [];
		                this.values = [];
		            }
		            var _proto = CrossDomainSafeWeakMap.prototype;
		            _proto._cleanupClosedWindows = function() {
		                var weakmap = this.weakmap;
		                var keys = this.keys;
		                for (var i = 0; i < keys.length; i++) {
		                    var value = keys[i];
		                    if (isWindow(value) && isWindowClosed(value)) {
		                        if (weakmap) try {
		                            weakmap.delete(value);
		                        } catch (err) {}
		                        keys.splice(i, 1);
		                        this.values.splice(i, 1);
		                        i -= 1;
		                    }
		                }
		            };
		            _proto.isSafeToReadWrite = function(key) {
		                return !isWindow(key);
		            };
		            _proto.set = function(key, value) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    weakmap.set(key, value);
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var name = this.name;
		                    var entry = key[name];
		                    entry && entry[0] === key ? entry[1] = value : Object.defineProperty(key, name, {
		                        value: [ key, value ],
		                        writable: !0
		                    });
		                    return;
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                var keys = this.keys;
		                var values = this.values;
		                var index = util_safeIndexOf(keys, key);
		                if (-1 === index) {
		                    keys.push(key);
		                    values.push(value);
		                } else values[index] = value;
		            };
		            _proto.get = function(key) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    if (weakmap.has(key)) return weakmap.get(key);
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var entry = key[this.name];
		                    return entry && entry[0] === key ? entry[1] : void 0;
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                var index = util_safeIndexOf(this.keys, key);
		                if (-1 !== index) return this.values[index];
		            };
		            _proto.delete = function(key) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    weakmap.delete(key);
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var entry = key[this.name];
		                    entry && entry[0] === key && (entry[0] = entry[1] = void 0);
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                var keys = this.keys;
		                var index = util_safeIndexOf(keys, key);
		                if (-1 !== index) {
		                    keys.splice(index, 1);
		                    this.values.splice(index, 1);
		                }
		            };
		            _proto.has = function(key) {
		                if (!key) throw new Error("WeakMap expected key");
		                var weakmap = this.weakmap;
		                if (weakmap) try {
		                    if (weakmap.has(key)) return !0;
		                } catch (err) {
		                    delete this.weakmap;
		                }
		                if (this.isSafeToReadWrite(key)) try {
		                    var entry = key[this.name];
		                    return !(!entry || entry[0] !== key);
		                } catch (err) {}
		                this._cleanupClosedWindows();
		                return -1 !== util_safeIndexOf(this.keys, key);
		            };
		            _proto.getOrSet = function(key, getter) {
		                if (this.has(key)) return this.get(key);
		                var value = getter();
		                this.set(key, value);
		                return value;
		            };
		            return CrossDomainSafeWeakMap;
		        }();
		        function _getPrototypeOf(o) {
		            return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
		                return o.__proto__ || Object.getPrototypeOf(o);
		            })(o);
		        }
		        function _isNativeReflectConstruct() {
		            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
		            if (Reflect.construct.sham) return !1;
		            if ("function" == typeof Proxy) return !0;
		            try {
		                Date.prototype.toString.call(Reflect.construct(Date, [], (function() {})));
		                return !0;
		            } catch (e) {
		                return !1;
		            }
		        }
		        function construct_construct(Parent, args, Class) {
		            return (construct_construct = _isNativeReflectConstruct() ? Reflect.construct : function(Parent, args, Class) {
		                var a = [ null ];
		                a.push.apply(a, args);
		                var instance = new (Function.bind.apply(Parent, a));
		                Class && _setPrototypeOf(instance, Class.prototype);
		                return instance;
		            }).apply(null, arguments);
		        }
		        function wrapNativeSuper_wrapNativeSuper(Class) {
		            var _cache = "function" == typeof Map ? new Map : void 0;
		            return (wrapNativeSuper_wrapNativeSuper = function(Class) {
		                if (null === Class || !(fn = Class, -1 !== Function.toString.call(fn).indexOf("[native code]"))) return Class;
		                var fn;
		                if ("function" != typeof Class) throw new TypeError("Super expression must either be null or a function");
		                if (void 0 !== _cache) {
		                    if (_cache.has(Class)) return _cache.get(Class);
		                    _cache.set(Class, Wrapper);
		                }
		                function Wrapper() {
		                    return construct_construct(Class, arguments, _getPrototypeOf(this).constructor);
		                }
		                Wrapper.prototype = Object.create(Class.prototype, {
		                    constructor: {
		                        value: Wrapper,
		                        enumerable: !1,
		                        writable: !0,
		                        configurable: !0
		                    }
		                });
		                return _setPrototypeOf(Wrapper, Class);
		            })(Class);
		        }
		        function getFunctionName(fn) {
		            return fn.name || fn.__name__ || fn.displayName || "anonymous";
		        }
		        function setFunctionName(fn, name) {
		            try {
		                delete fn.name;
		                fn.name = name;
		            } catch (err) {}
		            fn.__name__ = fn.displayName = name;
		            return fn;
		        }
		        function base64encode(str) {
		            if ("function" == typeof btoa) return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (function(m, p1) {
		                return String.fromCharCode(parseInt(p1, 16));
		            }))).replace(/[=]/g, "");
		            if ("undefined" != typeof Buffer) return Buffer.from(str, "utf8").toString("base64").replace(/[=]/g, "");
		            throw new Error("Can not find window.btoa or Buffer");
		        }
		        function uniqueID() {
		            var chars = "0123456789abcdef";
		            return "uid_" + "xxxxxxxxxx".replace(/./g, (function() {
		                return chars.charAt(Math.floor(Math.random() * chars.length));
		            })) + "_" + base64encode((new Date).toISOString().slice(11, 19).replace("T", ".")).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
		        }
		        var objectIDs;
		        function serializeArgs(args) {
		            try {
		                return JSON.stringify([].slice.call(args), (function(subkey, val) {
		                    return "function" == typeof val ? "memoize[" + function(obj) {
		                        objectIDs = objectIDs || new weakmap_CrossDomainSafeWeakMap;
		                        if (null == obj || "object" != typeof obj && "function" != typeof obj) throw new Error("Invalid object");
		                        var uid = objectIDs.get(obj);
		                        if (!uid) {
		                            uid = typeof obj + ":" + uniqueID();
		                            objectIDs.set(obj, uid);
		                        }
		                        return uid;
		                    }(val) + "]" : val;
		                }));
		            } catch (err) {
		                throw new Error("Arguments not serializable -- can not be used to memoize");
		            }
		        }
		        function getEmptyObject() {
		            return {};
		        }
		        var memoizeGlobalIndex = 0;
		        var memoizeGlobalIndexValidFrom = 0;
		        function memoize(method, options) {
		            void 0 === options && (options = {});
		            var _options$thisNamespac = options.thisNamespace, thisNamespace = void 0 !== _options$thisNamespac && _options$thisNamespac, cacheTime = options.time;
		            var simpleCache;
		            var thisCache;
		            var memoizeIndex = memoizeGlobalIndex;
		            memoizeGlobalIndex += 1;
		            var memoizedFunction = function() {
		                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		                if (memoizeIndex < memoizeGlobalIndexValidFrom) {
		                    simpleCache = null;
		                    thisCache = null;
		                    memoizeIndex = memoizeGlobalIndex;
		                    memoizeGlobalIndex += 1;
		                }
		                var cache;
		                cache = thisNamespace ? (thisCache = thisCache || new weakmap_CrossDomainSafeWeakMap).getOrSet(this, getEmptyObject) : simpleCache = simpleCache || {};
		                var cacheKey = serializeArgs(args);
		                var cacheResult = cache[cacheKey];
		                if (cacheResult && cacheTime && Date.now() - cacheResult.time < cacheTime) {
		                    delete cache[cacheKey];
		                    cacheResult = null;
		                }
		                if (cacheResult) return cacheResult.value;
		                var time = Date.now();
		                var value = method.apply(this, arguments);
		                cache[cacheKey] = {
		                    time: time,
		                    value: value
		                };
		                return value;
		            };
		            memoizedFunction.reset = function() {
		                simpleCache = null;
		                thisCache = null;
		            };
		            return setFunctionName(memoizedFunction, (options.name || getFunctionName(method)) + "::memoized");
		        }
		        memoize.clear = function() {
		            memoizeGlobalIndexValidFrom = memoizeGlobalIndex;
		        };
		        function memoizePromise(method) {
		            var cache = {};
		            function memoizedPromiseFunction() {
		                var _arguments = arguments, _this = this;
		                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		                var key = serializeArgs(args);
		                if (cache.hasOwnProperty(key)) return cache[key];
		                cache[key] = promise_ZalgoPromise.try((function() {
		                    return method.apply(_this, _arguments);
		                })).finally((function() {
		                    delete cache[key];
		                }));
		                return cache[key];
		            }
		            memoizedPromiseFunction.reset = function() {
		                cache = {};
		            };
		            return setFunctionName(memoizedPromiseFunction, getFunctionName(method) + "::promiseMemoized");
		        }
		        function src_util_noop() {}
		        function once(method) {
		            var called = !1;
		            return setFunctionName((function() {
		                if (!called) {
		                    called = !0;
		                    return method.apply(this, arguments);
		                }
		            }), getFunctionName(method) + "::once");
		        }
		        function stringifyError(err, level) {
		            void 0 === level && (level = 1);
		            if (level >= 3) return "stringifyError stack overflow";
		            try {
		                if (!err) return "<unknown error: " + {}.toString.call(err) + ">";
		                if ("string" == typeof err) return err;
		                if (err instanceof Error) {
		                    var stack = err && err.stack;
		                    var message = err && err.message;
		                    if (stack && message) return -1 !== stack.indexOf(message) ? stack : message + "\n" + stack;
		                    if (stack) return stack;
		                    if (message) return message;
		                }
		                return err && err.toString && "function" == typeof err.toString ? err.toString() : {}.toString.call(err);
		            } catch (newErr) {
		                return "Error while stringifying error: " + stringifyError(newErr, level + 1);
		            }
		        }
		        function stringify(item) {
		            return "string" == typeof item ? item : item && item.toString && "function" == typeof item.toString ? item.toString() : {}.toString.call(item);
		        }
		        function extend(obj, source) {
		            if (!source) return obj;
		            if (Object.assign) return Object.assign(obj, source);
		            for (var key in source) source.hasOwnProperty(key) && (obj[key] = source[key]);
		            return obj;
		        }
		        memoize((function(obj) {
		            if (Object.values) return Object.values(obj);
		            var result = [];
		            for (var key in obj) obj.hasOwnProperty(key) && result.push(obj[key]);
		            return result;
		        }));
		        function identity(item) {
		            return item;
		        }
		        function safeInterval(method, time) {
		            var timeout;
		            !function loop() {
		                timeout = setTimeout((function() {
		                    method();
		                    loop();
		                }), time);
		            }();
		            return {
		                cancel: function() {
		                    clearTimeout(timeout);
		                }
		            };
		        }
		        function arrayFrom(item) {
		            return [].slice.call(item);
		        }
		        function isDefined(value) {
		            return null != value;
		        }
		        function util_isRegex(item) {
		            return "[object RegExp]" === {}.toString.call(item);
		        }
		        function util_getOrSet(obj, key, getter) {
		            if (obj.hasOwnProperty(key)) return obj[key];
		            var val = getter();
		            obj[key] = val;
		            return val;
		        }
		        function cleanup(obj) {
		            var tasks = [];
		            var cleaned = !1;
		            var cleanErr;
		            var cleaner = {
		                set: function(name, item) {
		                    if (!cleaned) {
		                        obj[name] = item;
		                        cleaner.register((function() {
		                            delete obj[name];
		                        }));
		                    }
		                    return item;
		                },
		                register: function(method) {
		                    var task = once((function() {
		                        return method(cleanErr);
		                    }));
		                    cleaned ? method(cleanErr) : tasks.push(task);
		                    return {
		                        cancel: function() {
		                            var index = tasks.indexOf(task);
		                            -1 !== index && tasks.splice(index, 1);
		                        }
		                    };
		                },
		                all: function(err) {
		                    cleanErr = err;
		                    var results = [];
		                    cleaned = !0;
		                    for (;tasks.length; ) {
		                        var task = tasks.shift();
		                        results.push(task());
		                    }
		                    return promise_ZalgoPromise.all(results).then(src_util_noop);
		                }
		            };
		            return cleaner;
		        }
		        function assertExists(name, thing) {
		            if (null == thing) throw new Error("Expected " + name + " to be present");
		            return thing;
		        }
		        var util_ExtendableError = function(_Error) {
		            _inheritsLoose(ExtendableError, _Error);
		            function ExtendableError(message) {
		                var _this6;
		                (_this6 = _Error.call(this, message) || this).name = _this6.constructor.name;
		                "function" == typeof Error.captureStackTrace ? Error.captureStackTrace(function(self) {
		                    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		                    return self;
		                }(_this6), _this6.constructor) : _this6.stack = new Error(message).stack;
		                return _this6;
		            }
		            return ExtendableError;
		        }(wrapNativeSuper_wrapNativeSuper(Error));
		        function getBody() {
		            var body = document.body;
		            if (!body) throw new Error("Body element not found");
		            return body;
		        }
		        function isDocumentReady() {
		            return Boolean(document.body) && "complete" === document.readyState;
		        }
		        function isDocumentInteractive() {
		            return Boolean(document.body) && "interactive" === document.readyState;
		        }
		        function urlEncode(str) {
		            return encodeURIComponent(str);
		        }
		        memoize((function() {
		            return new promise_ZalgoPromise((function(resolve) {
		                if (isDocumentReady() || isDocumentInteractive()) return resolve();
		                var interval = setInterval((function() {
		                    if (isDocumentReady() || isDocumentInteractive()) {
		                        clearInterval(interval);
		                        return resolve();
		                    }
		                }), 10);
		            }));
		        }));
		        function parseQuery(queryString) {
		            return function(method, logic, args) {
		                void 0 === args && (args = []);
		                var cache = method.__inline_memoize_cache__ = method.__inline_memoize_cache__ || {};
		                var key = serializeArgs(args);
		                return cache.hasOwnProperty(key) ? cache[key] : cache[key] = function() {
		                    var params = {};
		                    if (!queryString) return params;
		                    if (-1 === queryString.indexOf("=")) return params;
		                    for (var _i2 = 0, _queryString$split2 = queryString.split("&"); _i2 < _queryString$split2.length; _i2++) {
		                        var pair = _queryString$split2[_i2];
		                        (pair = pair.split("="))[0] && pair[1] && (params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]));
		                    }
		                    return params;
		                }.apply(void 0, args);
		            }(parseQuery, 0, [ queryString ]);
		        }
		        function extendQuery(originalQuery, props) {
		            void 0 === props && (props = {});
		            return props && Object.keys(props).length ? function(obj) {
		                void 0 === obj && (obj = {});
		                return Object.keys(obj).filter((function(key) {
		                    return "string" == typeof obj[key] || "boolean" == typeof obj[key];
		                })).map((function(key) {
		                    var val = obj[key];
		                    if ("string" != typeof val && "boolean" != typeof val) throw new TypeError("Invalid type for query");
		                    return urlEncode(key) + "=" + urlEncode(val.toString());
		                })).join("&");
		            }(_extends({}, parseQuery(originalQuery), props)) : originalQuery;
		        }
		        function appendChild(container, child) {
		            container.appendChild(child);
		        }
		        function isElement(element) {
		            return element instanceof window$1.Element || null !== element && "object" == typeof element && 1 === element.nodeType && "object" == typeof element.style && "object" == typeof element.ownerDocument;
		        }
		        function getElementSafe(id, doc) {
		            void 0 === doc && (doc = document);
		            return isElement(id) ? id : "string" == typeof id ? doc.querySelector(id) : void 0;
		        }
		        function elementReady(id) {
		            return new promise_ZalgoPromise((function(resolve, reject) {
		                var name = stringify(id);
		                var el = getElementSafe(id);
		                if (el) return resolve(el);
		                if (isDocumentReady()) return reject(new Error("Document is ready and element " + name + " does not exist"));
		                var interval = setInterval((function() {
		                    if (el = getElementSafe(id)) {
		                        resolve(el);
		                        clearInterval(interval);
		                    } else if (isDocumentReady()) {
		                        clearInterval(interval);
		                        return reject(new Error("Document is ready and element " + name + " does not exist"));
		                    }
		                }), 10);
		            }));
		        }
		        var dom_PopupOpenError = function(_ExtendableError) {
		            _inheritsLoose(PopupOpenError, _ExtendableError);
		            function PopupOpenError() {
		                return _ExtendableError.apply(this, arguments) || this;
		            }
		            return PopupOpenError;
		        }(util_ExtendableError);
		        var awaitFrameLoadPromises;
		        function awaitFrameLoad(frame) {
		            if ((awaitFrameLoadPromises = awaitFrameLoadPromises || new weakmap_CrossDomainSafeWeakMap).has(frame)) {
		                var _promise = awaitFrameLoadPromises.get(frame);
		                if (_promise) return _promise;
		            }
		            var promise = new promise_ZalgoPromise((function(resolve, reject) {
		                frame.addEventListener("load", (function() {
		                    !function(frame) {
		                        !function() {
		                            for (var i = 0; i < iframeWindows.length; i++) {
		                                var closed = !1;
		                                try {
		                                    closed = iframeWindows[i].closed;
		                                } catch (err) {}
		                                if (closed) {
		                                    iframeFrames.splice(i, 1);
		                                    iframeWindows.splice(i, 1);
		                                }
		                            }
		                        }();
		                        if (frame && frame.contentWindow) try {
		                            iframeWindows.push(frame.contentWindow);
		                            iframeFrames.push(frame);
		                        } catch (err) {}
		                    }(frame);
		                    resolve(frame);
		                }));
		                frame.addEventListener("error", (function(err) {
		                    frame.contentWindow ? resolve(frame) : reject(err);
		                }));
		            }));
		            awaitFrameLoadPromises.set(frame, promise);
		            return promise;
		        }
		        function awaitFrameWindow(frame) {
		            return awaitFrameLoad(frame).then((function(loadedFrame) {
		                if (!loadedFrame.contentWindow) throw new Error("Could not find window in iframe");
		                return loadedFrame.contentWindow;
		            }));
		        }
		        function dom_iframe(options, container) {
		            void 0 === options && (options = {});
		            var style = options.style || {};
		            var frame = function(tag, options, container) {
		                void 0 === tag && (tag = "div");
		                void 0 === options && (options = {});
		                tag = tag.toLowerCase();
		                var element = document.createElement(tag);
		                options.style && extend(element.style, options.style);
		                options.class && (element.className = options.class.join(" "));
		                options.id && element.setAttribute("id", options.id);
		                if (options.attributes) for (var _i10 = 0, _Object$keys2 = Object.keys(options.attributes); _i10 < _Object$keys2.length; _i10++) {
		                    var key = _Object$keys2[_i10];
		                    element.setAttribute(key, options.attributes[key]);
		                }
		                options.styleSheet && function(el, styleText, doc) {
		                    void 0 === doc && (doc = window$1.document);
		                    el.styleSheet ? el.styleSheet.cssText = styleText : el.appendChild(doc.createTextNode(styleText));
		                }(element, options.styleSheet);
		                if (options.html) {
		                    if ("iframe" === tag) throw new Error("Iframe html can not be written unless container provided and iframe in DOM");
		                    element.innerHTML = options.html;
		                }
		                return element;
		            }("iframe", {
		                attributes: _extends({
		                    allowTransparency: "true"
		                }, options.attributes || {}),
		                style: _extends({
		                    backgroundColor: "transparent",
		                    border: "none"
		                }, style),
		                html: options.html,
		                class: options.class
		            });
		            var isIE = window$1.navigator.userAgent.match(/MSIE|Edge/i);
		            frame.hasAttribute("id") || frame.setAttribute("id", uniqueID());
		            awaitFrameLoad(frame);
		            (options.url || isIE) && frame.setAttribute("src", options.url || "about:blank");
		            return frame;
		        }
		        function addEventListener(obj, event, handler) {
		            obj.addEventListener(event, handler);
		            return {
		                cancel: function() {
		                    obj.removeEventListener(event, handler);
		                }
		            };
		        }
		        function showElement(element) {
		            element.style.setProperty("display", "");
		        }
		        function hideElement(element) {
		            element.style.setProperty("display", "none", "important");
		        }
		        function destroyElement(element) {
		            element && element.parentNode && element.parentNode.removeChild(element);
		        }
		        function isElementClosed(el) {
		            return !(el && el.parentNode && el.ownerDocument && el.ownerDocument.documentElement && el.ownerDocument.documentElement.contains(el));
		        }
		        function onResize(el, handler, _temp) {
		            var _ref2 = void 0 === _temp ? {} : _temp, _ref2$width = _ref2.width, width = void 0 === _ref2$width || _ref2$width, _ref2$height = _ref2.height, height = void 0 === _ref2$height || _ref2$height, _ref2$interval = _ref2.interval, interval = void 0 === _ref2$interval ? 100 : _ref2$interval, _ref2$win = _ref2.win, win = void 0 === _ref2$win ? window$1 : _ref2$win;
		            var currentWidth = el.offsetWidth;
		            var currentHeight = el.offsetHeight;
		            var canceled = !1;
		            handler({
		                width: currentWidth,
		                height: currentHeight
		            });
		            var check = function() {
		                if (!canceled && function(el) {
		                    return Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
		                }(el)) {
		                    var newWidth = el.offsetWidth;
		                    var newHeight = el.offsetHeight;
		                    (width && newWidth !== currentWidth || height && newHeight !== currentHeight) && handler({
		                        width: newWidth,
		                        height: newHeight
		                    });
		                    currentWidth = newWidth;
		                    currentHeight = newHeight;
		                }
		            };
		            var observer;
		            var timeout;
		            win.addEventListener("resize", check);
		            if (void 0 !== win.ResizeObserver) {
		                (observer = new win.ResizeObserver(check)).observe(el);
		                timeout = safeInterval(check, 10 * interval);
		            } else if (void 0 !== win.MutationObserver) {
		                (observer = new win.MutationObserver(check)).observe(el, {
		                    attributes: !0,
		                    childList: !0,
		                    subtree: !0,
		                    characterData: !1
		                });
		                timeout = safeInterval(check, 10 * interval);
		            } else timeout = safeInterval(check, interval);
		            return {
		                cancel: function() {
		                    canceled = !0;
		                    observer.disconnect();
		                    window$1.removeEventListener("resize", check);
		                    timeout.cancel();
		                }
		            };
		        }
		        function isShadowElement(element) {
		            for (;element.parentNode; ) element = element.parentNode;
		            return "[object ShadowRoot]" === element.toString();
		        }
		        var currentScript = "undefined" != typeof document ? document.currentScript : null;
		        var getCurrentScript = memoize((function() {
		            if (currentScript) return currentScript;
		            if (currentScript = function() {
		                try {
		                    var stack = function() {
		                        try {
		                            throw new Error("_");
		                        } catch (err) {
		                            return err.stack || "";
		                        }
		                    }();
		                    var stackDetails = /.*at [^(]*\((.*):(.+):(.+)\)$/gi.exec(stack);
		                    var scriptLocation = stackDetails && stackDetails[1];
		                    if (!scriptLocation) return;
		                    for (var _i22 = 0, _Array$prototype$slic2 = [].slice.call(document.getElementsByTagName("script")).reverse(); _i22 < _Array$prototype$slic2.length; _i22++) {
		                        var script = _Array$prototype$slic2[_i22];
		                        if (script.src && script.src === scriptLocation) return script;
		                    }
		                } catch (err) {}
		            }()) return currentScript;
		            throw new Error("Can not determine current script");
		        }));
		        var currentUID = uniqueID();
		        memoize((function() {
		            var script;
		            try {
		                script = getCurrentScript();
		            } catch (err) {
		                return currentUID;
		            }
		            var uid = script.getAttribute("data-uid");
		            if (uid && "string" == typeof uid) return uid;
		            if ((uid = script.getAttribute("data-uid-auto")) && "string" == typeof uid) return uid;
		            if (script.src) {
		                var hashedString = function(str) {
		                    var hash = "";
		                    for (var i = 0; i < str.length; i++) {
		                        var total = str[i].charCodeAt(0) * i;
		                        str[i + 1] && (total += str[i + 1].charCodeAt(0) * (i - 1));
		                        hash += String.fromCharCode(97 + Math.abs(total) % 26);
		                    }
		                    return hash;
		                }(JSON.stringify({
		                    src: script.src,
		                    dataset: script.dataset
		                }));
		                uid = "uid_" + hashedString.slice(hashedString.length - 30);
		            } else uid = uniqueID();
		            script.setAttribute("data-uid-auto", uid);
		            return uid;
		        }));
		        function isPerc(str) {
		            return "string" == typeof str && /^[0-9]+%$/.test(str);
		        }
		        function toNum(val) {
		            if ("number" == typeof val) return val;
		            var match = val.match(/^([0-9]+)(px|%)$/);
		            if (!match) throw new Error("Could not match css value from " + val);
		            return parseInt(match[1], 10);
		        }
		        function toPx(val) {
		            return toNum(val) + "px";
		        }
		        function toCSS(val) {
		            return "number" == typeof val ? toPx(val) : isPerc(val) ? val : toPx(val);
		        }
		        function normalizeDimension(dim, max) {
		            if ("number" == typeof dim) return dim;
		            if (isPerc(dim)) return parseInt(max * toNum(dim) / 100, 10);
		            if ("string" == typeof (str = dim) && /^[0-9]+px$/.test(str)) return toNum(dim);
		            var str;
		            throw new Error("Can not normalize dimension: " + dim);
		        }
		        function global_getGlobal(win) {
		            void 0 === win && (win = window$1);
		            var globalKey = "__post_robot_10_0_44__";
		            return win !== window$1 ? win[globalKey] : win[globalKey] = win[globalKey] || {};
		        }
		        var getObj = function() {
		            return {};
		        };
		        function globalStore(key, defStore) {
		            void 0 === key && (key = "store");
		            void 0 === defStore && (defStore = getObj);
		            return util_getOrSet(global_getGlobal(), key, (function() {
		                var store = defStore();
		                return {
		                    has: function(storeKey) {
		                        return store.hasOwnProperty(storeKey);
		                    },
		                    get: function(storeKey, defVal) {
		                        return store.hasOwnProperty(storeKey) ? store[storeKey] : defVal;
		                    },
		                    set: function(storeKey, val) {
		                        store[storeKey] = val;
		                        return val;
		                    },
		                    del: function(storeKey) {
		                        delete store[storeKey];
		                    },
		                    getOrSet: function(storeKey, getter) {
		                        return util_getOrSet(store, storeKey, getter);
		                    },
		                    reset: function() {
		                        store = defStore();
		                    },
		                    keys: function() {
		                        return Object.keys(store);
		                    }
		                };
		            }));
		        }
		        var WildCard = function() {};
		        function getWildcard() {
		            var global = global_getGlobal();
		            global.WINDOW_WILDCARD = global.WINDOW_WILDCARD || new WildCard;
		            return global.WINDOW_WILDCARD;
		        }
		        function windowStore(key, defStore) {
		            void 0 === key && (key = "store");
		            void 0 === defStore && (defStore = getObj);
		            return globalStore("windowStore").getOrSet(key, (function() {
		                var winStore = new weakmap_CrossDomainSafeWeakMap;
		                var getStore = function(win) {
		                    return winStore.getOrSet(win, defStore);
		                };
		                return {
		                    has: function(win) {
		                        return getStore(win).hasOwnProperty(key);
		                    },
		                    get: function(win, defVal) {
		                        var store = getStore(win);
		                        return store.hasOwnProperty(key) ? store[key] : defVal;
		                    },
		                    set: function(win, val) {
		                        getStore(win)[key] = val;
		                        return val;
		                    },
		                    del: function(win) {
		                        delete getStore(win)[key];
		                    },
		                    getOrSet: function(win, getter) {
		                        return util_getOrSet(getStore(win), key, getter);
		                    }
		                };
		            }));
		        }
		        function getInstanceID() {
		            return globalStore("instance").getOrSet("instanceID", uniqueID);
		        }
		        function resolveHelloPromise(win, _ref) {
		            var domain = _ref.domain;
		            var helloPromises = windowStore("helloPromises");
		            var existingPromise = helloPromises.get(win);
		            existingPromise && existingPromise.resolve({
		                domain: domain
		            });
		            var newPromise = promise_ZalgoPromise.resolve({
		                domain: domain
		            });
		            helloPromises.set(win, newPromise);
		            return newPromise;
		        }
		        function sayHello(win, _ref4) {
		            return (0, _ref4.send)(win, "postrobot_hello", {
		                instanceID: getInstanceID()
		            }, {
		                domain: "*",
		                timeout: -1
		            }).then((function(_ref5) {
		                var origin = _ref5.origin, instanceID = _ref5.data.instanceID;
		                resolveHelloPromise(win, {
		                    domain: origin
		                });
		                return {
		                    win: win,
		                    domain: origin,
		                    instanceID: instanceID
		                };
		            }));
		        }
		        function getWindowInstanceID(win, _ref6) {
		            var send = _ref6.send;
		            return windowStore("windowInstanceIDPromises").getOrSet(win, (function() {
		                return sayHello(win, {
		                    send: send
		                }).then((function(_ref7) {
		                    return _ref7.instanceID;
		                }));
		            }));
		        }
		        function awaitWindowHello(win, timeout, name) {
		            void 0 === timeout && (timeout = 5e3);
		            void 0 === name && (name = "Window");
		            var promise = function(win) {
		                return windowStore("helloPromises").getOrSet(win, (function() {
		                    return new promise_ZalgoPromise;
		                }));
		            }(win);
		            -1 !== timeout && (promise = promise.timeout(timeout, new Error(name + " did not load after " + timeout + "ms")));
		            return promise;
		        }
		        function markWindowKnown(win) {
		            windowStore("knownWindows").set(win, !0);
		        }
		        function isSerializedType(item) {
		            return "object" == typeof item && null !== item && "string" == typeof item.__type__;
		        }
		        function determineType(val) {
		            return void 0 === val ? "undefined" : null === val ? "null" : Array.isArray(val) ? "array" : "function" == typeof val ? "function" : "object" == typeof val ? val instanceof Error ? "error" : "function" == typeof val.then ? "promise" : "[object RegExp]" === {}.toString.call(val) ? "regex" : "[object Date]" === {}.toString.call(val) ? "date" : "object" : "string" == typeof val ? "string" : "number" == typeof val ? "number" : "boolean" == typeof val ? "boolean" : void 0;
		        }
		        function serializeType(type, val) {
		            return {
		                __type__: type,
		                __val__: val
		            };
		        }
		        var _SERIALIZER;
		        var SERIALIZER = ((_SERIALIZER = {}).function = function() {}, _SERIALIZER.error = function(_ref) {
		            return serializeType("error", {
		                message: _ref.message,
		                stack: _ref.stack,
		                code: _ref.code,
		                data: _ref.data
		            });
		        }, _SERIALIZER.promise = function() {}, _SERIALIZER.regex = function(val) {
		            return serializeType("regex", val.source);
		        }, _SERIALIZER.date = function(val) {
		            return serializeType("date", val.toJSON());
		        }, _SERIALIZER.array = function(val) {
		            return val;
		        }, _SERIALIZER.object = function(val) {
		            return val;
		        }, _SERIALIZER.string = function(val) {
		            return val;
		        }, _SERIALIZER.number = function(val) {
		            return val;
		        }, _SERIALIZER.boolean = function(val) {
		            return val;
		        }, _SERIALIZER.null = function(val) {
		            return val;
		        }, _SERIALIZER[void 0] = function(val) {
		            return serializeType("undefined", val);
		        }, _SERIALIZER);
		        var defaultSerializers = {};
		        var _DESERIALIZER;
		        var DESERIALIZER = ((_DESERIALIZER = {}).function = function() {
		            throw new Error("Function serialization is not implemented; nothing to deserialize");
		        }, _DESERIALIZER.error = function(_ref2) {
		            var stack = _ref2.stack, code = _ref2.code, data = _ref2.data;
		            var error = new Error(_ref2.message);
		            error.code = code;
		            data && (error.data = data);
		            error.stack = stack + "\n\n" + error.stack;
		            return error;
		        }, _DESERIALIZER.promise = function() {
		            throw new Error("Promise serialization is not implemented; nothing to deserialize");
		        }, _DESERIALIZER.regex = function(val) {
		            return new RegExp(val);
		        }, _DESERIALIZER.date = function(val) {
		            return new Date(val);
		        }, _DESERIALIZER.array = function(val) {
		            return val;
		        }, _DESERIALIZER.object = function(val) {
		            return val;
		        }, _DESERIALIZER.string = function(val) {
		            return val;
		        }, _DESERIALIZER.number = function(val) {
		            return val;
		        }, _DESERIALIZER.boolean = function(val) {
		            return val;
		        }, _DESERIALIZER.null = function(val) {
		            return val;
		        }, _DESERIALIZER[void 0] = function() {}, _DESERIALIZER);
		        var defaultDeserializers = {};
		        function needsBridgeForBrowser() {
		            return !!utils_getUserAgent(window$1).match(/MSIE|trident|edge\/12|edge\/13/i);
		        }
		        function needsBridgeForWin(win) {
		            return !isSameTopWindow(window$1, win);
		        }
		        function needsBridgeForDomain(domain, win) {
		            if (domain) {
		                if (getDomain() !== getDomainFromUrl(domain)) return !0;
		            } else if (win && !isSameDomain(win)) return !0;
		            return !1;
		        }
		        function needsBridge(_ref) {
		            var win = _ref.win, domain = _ref.domain;
		            return !(!needsBridgeForBrowser() || domain && !needsBridgeForDomain(domain, win) || win && !needsBridgeForWin(win));
		        }
		        function getBridgeName(domain) {
		            return "__postrobot_bridge___" + (domain = domain || getDomainFromUrl(domain)).replace(/[^a-zA-Z0-9]+/g, "_");
		        }
		        function isBridge() {
		            return Boolean(window$1.name && window$1.name === getBridgeName(getDomain()));
		        }
		        var documentBodyReady = new promise_ZalgoPromise((function(resolve) {
		            if (window$1.document && window$1.document.body) return resolve(window$1.document.body);
		            var interval = setInterval((function() {
		                if (window$1.document && window$1.document.body) {
		                    clearInterval(interval);
		                    return resolve(window$1.document.body);
		                }
		            }), 10);
		        }));
		        function registerRemoteWindow(win) {
		            windowStore("remoteWindowPromises").getOrSet(win, (function() {
		                return new promise_ZalgoPromise;
		            }));
		        }
		        function findRemoteWindow(win) {
		            var remoteWinPromise = windowStore("remoteWindowPromises").get(win);
		            if (!remoteWinPromise) throw new Error("Remote window promise not found");
		            return remoteWinPromise;
		        }
		        function registerRemoteSendMessage(win, domain, sendMessage) {
		            findRemoteWindow(win).resolve((function(remoteWin, remoteDomain, message) {
		                if (remoteWin !== win) throw new Error("Remote window does not match window");
		                if (!matchDomain(remoteDomain, domain)) throw new Error("Remote domain " + remoteDomain + " does not match domain " + domain);
		                sendMessage.fireAndForget(message);
		            }));
		        }
		        function rejectRemoteSendMessage(win, err) {
		            findRemoteWindow(win).reject(err).catch(src_util_noop);
		        }
		        function linkWindow(_ref3) {
		            var win = _ref3.win, name = _ref3.name, domain = _ref3.domain;
		            var popupWindowsByName = globalStore("popupWindowsByName");
		            var popupWindowsByWin = windowStore("popupWindowsByWin");
		            for (var _i2 = 0, _popupWindowsByName$k2 = popupWindowsByName.keys(); _i2 < _popupWindowsByName$k2.length; _i2++) {
		                var winName = _popupWindowsByName$k2[_i2];
		                var _details = popupWindowsByName.get(winName);
		                _details && !isWindowClosed(_details.win) || popupWindowsByName.del(winName);
		            }
		            if (isWindowClosed(win)) return {
		                win: win,
		                name: name,
		                domain: domain
		            };
		            var details = popupWindowsByWin.getOrSet(win, (function() {
		                return name ? popupWindowsByName.getOrSet(name, (function() {
		                    return {
		                        win: win,
		                        name: name
		                    };
		                })) : {
		                    win: win
		                };
		            }));
		            if (details.win && details.win !== win) throw new Error("Different window already linked for window: " + (name || "undefined"));
		            if (name) {
		                details.name = name;
		                popupWindowsByName.set(name, details);
		            }
		            if (domain) {
		                details.domain = domain;
		                registerRemoteWindow(win);
		            }
		            popupWindowsByWin.set(win, details);
		            return details;
		        }
		        function setupBridge(_ref) {
		            var on = _ref.on, send = _ref.send, receiveMessage = _ref.receiveMessage;
		            windowOpen = window$1.open, window$1.open = function(url, name, options, last) {
		                var win = windowOpen.call(this, normalizeMockUrl(url), name, options, last);
		                if (!win) return win;
		                linkWindow({
		                    win: win,
		                    name: name,
		                    domain: url ? getDomainFromUrl(url) : null
		                });
		                return win;
		            };
		            var windowOpen;
		            !function(_ref) {
		                var on = _ref.on, send = _ref.send, receiveMessage = _ref.receiveMessage;
		                var popupWindowsByName = globalStore("popupWindowsByName");
		                on("postrobot_open_tunnel", (function(_ref2) {
		                    var source = _ref2.source, origin = _ref2.origin, data = _ref2.data;
		                    var bridgePromise = globalStore("bridges").get(origin);
		                    if (!bridgePromise) throw new Error("Can not find bridge promise for domain " + origin);
		                    return bridgePromise.then((function(bridge) {
		                        if (source !== bridge) throw new Error("Message source does not matched registered bridge for domain " + origin);
		                        if (!data.name) throw new Error("Register window expected to be passed window name");
		                        if (!data.sendMessage) throw new Error("Register window expected to be passed sendMessage method");
		                        if (!popupWindowsByName.has(data.name)) throw new Error("Window with name " + data.name + " does not exist, or was not opened by this window");
		                        var getWindowDetails = function() {
		                            return popupWindowsByName.get(data.name);
		                        };
		                        if (!getWindowDetails().domain) throw new Error("We do not have a registered domain for window " + data.name);
		                        if (getWindowDetails().domain !== origin) throw new Error("Message origin " + origin + " does not matched registered window origin " + (getWindowDetails().domain || "unknown"));
		                        registerRemoteSendMessage(getWindowDetails().win, origin, data.sendMessage);
		                        return {
		                            sendMessage: function(message) {
		                                if (window$1 && !window$1.closed && getWindowDetails()) {
		                                    var domain = getWindowDetails().domain;
		                                    if (domain) try {
		                                        receiveMessage({
		                                            data: message,
		                                            origin: domain,
		                                            source: getWindowDetails().win
		                                        }, {
		                                            on: on,
		                                            send: send
		                                        });
		                                    } catch (err) {
		                                        promise_ZalgoPromise.reject(err);
		                                    }
		                                }
		                            }
		                        };
		                    }));
		                }));
		            }({
		                on: on,
		                send: send,
		                receiveMessage: receiveMessage
		            });
		            !function(_ref2) {
		                var send = _ref2.send;
		                global_getGlobal(window$1).openTunnelToParent = function(_ref3) {
		                    var name = _ref3.name, source = _ref3.source, canary = _ref3.canary, sendMessage = _ref3.sendMessage;
		                    var tunnelWindows = globalStore("tunnelWindows");
		                    var parentWindow = utils_getParent(window$1);
		                    if (!parentWindow) throw new Error("No parent window found to open tunnel to");
		                    var id = function(_ref) {
		                        var name = _ref.name, source = _ref.source, canary = _ref.canary, sendMessage = _ref.sendMessage;
		                        !function() {
		                            var tunnelWindows = globalStore("tunnelWindows");
		                            for (var _i2 = 0, _tunnelWindows$keys2 = tunnelWindows.keys(); _i2 < _tunnelWindows$keys2.length; _i2++) {
		                                var key = _tunnelWindows$keys2[_i2];
		                                isWindowClosed(tunnelWindows[key].source) && tunnelWindows.del(key);
		                            }
		                        }();
		                        var id = uniqueID();
		                        globalStore("tunnelWindows").set(id, {
		                            name: name,
		                            source: source,
		                            canary: canary,
		                            sendMessage: sendMessage
		                        });
		                        return id;
		                    }({
		                        name: name,
		                        source: source,
		                        canary: canary,
		                        sendMessage: sendMessage
		                    });
		                    return send(parentWindow, "postrobot_open_tunnel", {
		                        name: name,
		                        sendMessage: function() {
		                            var tunnelWindow = tunnelWindows.get(id);
		                            if (tunnelWindow && tunnelWindow.source && !isWindowClosed(tunnelWindow.source)) {
		                                try {
		                                    tunnelWindow.canary();
		                                } catch (err) {
		                                    return;
		                                }
		                                tunnelWindow.sendMessage.apply(this, arguments);
		                            }
		                        }
		                    }, {
		                        domain: "*"
		                    });
		                };
		            }({
		                send: send
		            });
		            !function(_ref) {
		                var on = _ref.on, send = _ref.send, receiveMessage = _ref.receiveMessage;
		                promise_ZalgoPromise.try((function() {
		                    var opener = getOpener(window$1);
		                    if (opener && needsBridge({
		                        win: opener
		                    })) {
		                        registerRemoteWindow(opener);
		                        return (win = opener, windowStore("remoteBridgeAwaiters").getOrSet(win, (function() {
		                            return promise_ZalgoPromise.try((function() {
		                                var frame = getFrameByName(win, getBridgeName(getDomain()));
		                                if (frame) return isSameDomain(frame) && global_getGlobal(assertSameDomain(frame)) ? frame : new promise_ZalgoPromise((function(resolve) {
		                                    var interval;
		                                    var timeout;
		                                    interval = setInterval((function() {
		                                        if (frame && isSameDomain(frame) && global_getGlobal(assertSameDomain(frame))) {
		                                            clearInterval(interval);
		                                            clearTimeout(timeout);
		                                            return resolve(frame);
		                                        }
		                                    }), 100);
		                                    timeout = setTimeout((function() {
		                                        clearInterval(interval);
		                                        return resolve();
		                                    }), 2e3);
		                                }));
		                            }));
		                        }))).then((function(bridge) {
		                            return bridge ? window$1.name ? global_getGlobal(assertSameDomain(bridge)).openTunnelToParent({
		                                name: window$1.name,
		                                source: window$1,
		                                canary: function() {},
		                                sendMessage: function(message) {
		                                    try {
		                                        window$1;
		                                    } catch (err) {
		                                        return;
		                                    }
		                                    if (window$1 && !window$1.closed) try {
		                                        receiveMessage({
		                                            data: message,
		                                            origin: this.origin,
		                                            source: this.source
		                                        }, {
		                                            on: on,
		                                            send: send
		                                        });
		                                    } catch (err) {
		                                        promise_ZalgoPromise.reject(err);
		                                    }
		                                }
		                            }).then((function(_ref2) {
		                                var source = _ref2.source, origin = _ref2.origin, data = _ref2.data;
		                                if (source !== opener) throw new Error("Source does not match opener");
		                                registerRemoteSendMessage(source, origin, data.sendMessage);
		                            })).catch((function(err) {
		                                rejectRemoteSendMessage(opener, err);
		                                throw err;
		                            })) : rejectRemoteSendMessage(opener, new Error("Can not register with opener: window does not have a name")) : rejectRemoteSendMessage(opener, new Error("Can not register with opener: no bridge found in opener"));
		                        }));
		                        var win;
		                    }
		                }));
		            }({
		                on: on,
		                send: send,
		                receiveMessage: receiveMessage
		            });
		        }
		        function cleanupProxyWindows() {
		            var idToProxyWindow = globalStore("idToProxyWindow");
		            for (var _i2 = 0, _idToProxyWindow$keys2 = idToProxyWindow.keys(); _i2 < _idToProxyWindow$keys2.length; _i2++) {
		                var id = _idToProxyWindow$keys2[_i2];
		                idToProxyWindow.get(id).shouldClean() && idToProxyWindow.del(id);
		            }
		        }
		        function getSerializedWindow(winPromise, _ref) {
		            var send = _ref.send, _ref$id = _ref.id, id = void 0 === _ref$id ? uniqueID() : _ref$id;
		            var windowNamePromise = winPromise.then((function(win) {
		                if (isSameDomain(win)) return assertSameDomain(win).name;
		            }));
		            var windowTypePromise = winPromise.then((function(window) {
		                if (isWindowClosed(window)) throw new Error("Window is closed, can not determine type");
		                return getOpener(window) ? WINDOW_TYPE.POPUP : WINDOW_TYPE.IFRAME;
		            }));
		            windowNamePromise.catch(src_util_noop);
		            windowTypePromise.catch(src_util_noop);
		            var getName = function() {
		                return winPromise.then((function(win) {
		                    if (!isWindowClosed(win)) return isSameDomain(win) ? assertSameDomain(win).name : windowNamePromise;
		                }));
		            };
		            return {
		                id: id,
		                getType: function() {
		                    return windowTypePromise;
		                },
		                getInstanceID: memoizePromise((function() {
		                    return winPromise.then((function(win) {
		                        return getWindowInstanceID(win, {
		                            send: send
		                        });
		                    }));
		                })),
		                close: function() {
		                    return winPromise.then(closeWindow);
		                },
		                getName: getName,
		                focus: function() {
		                    return winPromise.then((function(win) {
		                        win.focus();
		                    }));
		                },
		                isClosed: function() {
		                    return winPromise.then((function(win) {
		                        return isWindowClosed(win);
		                    }));
		                },
		                setLocation: function(href, opts) {
		                    void 0 === opts && (opts = {});
		                    return winPromise.then((function(win) {
		                        var domain = window$1.location.protocol + "//" + window$1.location.host;
		                        var _opts$method = opts.method, method = void 0 === _opts$method ? "get" : _opts$method, body = opts.body;
		                        if (0 === href.indexOf("/")) href = "" + domain + href; else if (!href.match(/^https?:\/\//) && 0 !== href.indexOf(domain)) throw new Error("Expected url to be http or https url, or absolute path, got " + JSON.stringify(href));
		                        if ("post" === method) return getName().then((function(name) {
		                            if (!name) throw new Error("Can not post to window without target name");
		                            !function(_ref3) {
		                                var url = _ref3.url, target = _ref3.target, body = _ref3.body, _ref3$method = _ref3.method, method = void 0 === _ref3$method ? "post" : _ref3$method;
		                                var form = document.createElement("form");
		                                form.setAttribute("target", target);
		                                form.setAttribute("method", method);
		                                form.setAttribute("action", url);
		                                form.style.display = "none";
		                                if (body) for (var _i24 = 0, _Object$keys4 = Object.keys(body); _i24 < _Object$keys4.length; _i24++) {
		                                    var _body$key;
		                                    var key = _Object$keys4[_i24];
		                                    var input = document.createElement("input");
		                                    input.setAttribute("name", key);
		                                    input.setAttribute("value", null == (_body$key = body[key]) ? void 0 : _body$key.toString());
		                                    form.appendChild(input);
		                                }
		                                getBody().appendChild(form);
		                                form.submit();
		                                getBody().removeChild(form);
		                            }({
		                                url: href,
		                                target: name,
		                                method: method,
		                                body: body
		                            });
		                        }));
		                        if ("get" !== method) throw new Error("Unsupported method: " + method);
		                        if (isSameDomain(win)) try {
		                            if (win.location && "function" == typeof win.location.replace) {
		                                win.location.replace(href);
		                                return;
		                            }
		                        } catch (err) {}
		                        win.location = href;
		                    }));
		                },
		                setName: function(name) {
		                    return winPromise.then((function(win) {
		                        linkWindow({
		                            win: win,
		                            name: name
		                        });
		                        var sameDomain = isSameDomain(win);
		                        var frame = getFrameForWindow(win);
		                        if (!sameDomain) throw new Error("Can not set name for cross-domain window: " + name);
		                        assertSameDomain(win).name = name;
		                        frame && frame.setAttribute("name", name);
		                        windowNamePromise = promise_ZalgoPromise.resolve(name);
		                    }));
		                }
		            };
		        }
		        var window_ProxyWindow = function() {
		            function ProxyWindow(_ref2) {
		                var send = _ref2.send, win = _ref2.win, serializedWindow = _ref2.serializedWindow;
		                this.id = void 0;
		                this.isProxyWindow = !0;
		                this.serializedWindow = void 0;
		                this.actualWindow = void 0;
		                this.actualWindowPromise = void 0;
		                this.send = void 0;
		                this.name = void 0;
		                this.actualWindowPromise = new promise_ZalgoPromise;
		                this.serializedWindow = serializedWindow || getSerializedWindow(this.actualWindowPromise, {
		                    send: send
		                });
		                globalStore("idToProxyWindow").set(this.getID(), this);
		                win && this.setWindow(win, {
		                    send: send
		                });
		            }
		            var _proto = ProxyWindow.prototype;
		            _proto.getID = function() {
		                return this.serializedWindow.id;
		            };
		            _proto.getType = function() {
		                return this.serializedWindow.getType();
		            };
		            _proto.isPopup = function() {
		                return this.getType().then((function(type) {
		                    return type === WINDOW_TYPE.POPUP;
		                }));
		            };
		            _proto.setLocation = function(href, opts) {
		                var _this = this;
		                return this.serializedWindow.setLocation(href, opts).then((function() {
		                    return _this;
		                }));
		            };
		            _proto.getName = function() {
		                return this.serializedWindow.getName();
		            };
		            _proto.setName = function(name) {
		                var _this2 = this;
		                return this.serializedWindow.setName(name).then((function() {
		                    return _this2;
		                }));
		            };
		            _proto.close = function() {
		                var _this3 = this;
		                return this.serializedWindow.close().then((function() {
		                    return _this3;
		                }));
		            };
		            _proto.focus = function() {
		                var _this4 = this;
		                var isPopupPromise = this.isPopup();
		                var getNamePromise = this.getName();
		                var reopenPromise = promise_ZalgoPromise.hash({
		                    isPopup: isPopupPromise,
		                    name: getNamePromise
		                }).then((function(_ref3) {
		                    var name = _ref3.name;
		                    _ref3.isPopup && name && window$1.open("", name);
		                }));
		                var focusPromise = this.serializedWindow.focus();
		                return promise_ZalgoPromise.all([ reopenPromise, focusPromise ]).then((function() {
		                    return _this4;
		                }));
		            };
		            _proto.isClosed = function() {
		                return this.serializedWindow.isClosed();
		            };
		            _proto.getWindow = function() {
		                return this.actualWindow;
		            };
		            _proto.setWindow = function(win, _ref4) {
		                var send = _ref4.send;
		                this.actualWindow = win;
		                this.actualWindowPromise.resolve(this.actualWindow);
		                this.serializedWindow = getSerializedWindow(this.actualWindowPromise, {
		                    send: send,
		                    id: this.getID()
		                });
		                windowStore("winToProxyWindow").set(win, this);
		            };
		            _proto.awaitWindow = function() {
		                return this.actualWindowPromise;
		            };
		            _proto.matchWindow = function(win, _ref5) {
		                var _this5 = this;
		                var send = _ref5.send;
		                return promise_ZalgoPromise.try((function() {
		                    return _this5.actualWindow ? win === _this5.actualWindow : promise_ZalgoPromise.hash({
		                        proxyInstanceID: _this5.getInstanceID(),
		                        knownWindowInstanceID: getWindowInstanceID(win, {
		                            send: send
		                        })
		                    }).then((function(_ref6) {
		                        var match = _ref6.proxyInstanceID === _ref6.knownWindowInstanceID;
		                        match && _this5.setWindow(win, {
		                            send: send
		                        });
		                        return match;
		                    }));
		                }));
		            };
		            _proto.unwrap = function() {
		                return this.actualWindow || this;
		            };
		            _proto.getInstanceID = function() {
		                return this.serializedWindow.getInstanceID();
		            };
		            _proto.shouldClean = function() {
		                return Boolean(this.actualWindow && isWindowClosed(this.actualWindow));
		            };
		            _proto.serialize = function() {
		                return this.serializedWindow;
		            };
		            ProxyWindow.unwrap = function(win) {
		                return ProxyWindow.isProxyWindow(win) ? win.unwrap() : win;
		            };
		            ProxyWindow.serialize = function(win, _ref7) {
		                var send = _ref7.send;
		                cleanupProxyWindows();
		                return ProxyWindow.toProxyWindow(win, {
		                    send: send
		                }).serialize();
		            };
		            ProxyWindow.deserialize = function(serializedWindow, _ref8) {
		                var send = _ref8.send;
		                cleanupProxyWindows();
		                return globalStore("idToProxyWindow").get(serializedWindow.id) || new ProxyWindow({
		                    serializedWindow: serializedWindow,
		                    send: send
		                });
		            };
		            ProxyWindow.isProxyWindow = function(obj) {
		                return Boolean(obj && !isWindow(obj) && obj.isProxyWindow);
		            };
		            ProxyWindow.toProxyWindow = function(win, _ref9) {
		                var send = _ref9.send;
		                cleanupProxyWindows();
		                if (ProxyWindow.isProxyWindow(win)) return win;
		                var actualWindow = win;
		                return windowStore("winToProxyWindow").get(actualWindow) || new ProxyWindow({
		                    win: actualWindow,
		                    send: send
		                });
		            };
		            return ProxyWindow;
		        }();
		        function addMethod(id, val, name, source, domain) {
		            var methodStore = windowStore("methodStore");
		            var proxyWindowMethods = globalStore("proxyWindowMethods");
		            if (window_ProxyWindow.isProxyWindow(source)) proxyWindowMethods.set(id, {
		                val: val,
		                name: name,
		                domain: domain,
		                source: source
		            }); else {
		                proxyWindowMethods.del(id);
		                methodStore.getOrSet(source, (function() {
		                    return {};
		                }))[id] = {
		                    domain: domain,
		                    name: name,
		                    val: val,
		                    source: source
		                };
		            }
		        }
		        function lookupMethod(source, id) {
		            var methodStore = windowStore("methodStore");
		            var proxyWindowMethods = globalStore("proxyWindowMethods");
		            return methodStore.getOrSet(source, (function() {
		                return {};
		            }))[id] || proxyWindowMethods.get(id);
		        }
		        function function_serializeFunction(destination, domain, val, key, _ref3) {
		            on = (_ref = {
		                on: _ref3.on,
		                send: _ref3.send
		            }).on, send = _ref.send, globalStore("builtinListeners").getOrSet("functionCalls", (function() {
		                return on("postrobot_method", {
		                    domain: "*"
		                }, (function(_ref2) {
		                    var source = _ref2.source, origin = _ref2.origin, data = _ref2.data;
		                    var id = data.id, name = data.name;
		                    var meth = lookupMethod(source, id);
		                    if (!meth) throw new Error("Could not find method '" + name + "' with id: " + data.id + " in " + getDomain(window$1));
		                    var methodSource = meth.source, domain = meth.domain, val = meth.val;
		                    return promise_ZalgoPromise.try((function() {
		                        if (!matchDomain(domain, origin)) throw new Error("Method '" + data.name + "' domain " + JSON.stringify(util_isRegex(meth.domain) ? meth.domain.source : meth.domain) + " does not match origin " + origin + " in " + getDomain(window$1));
		                        if (window_ProxyWindow.isProxyWindow(methodSource)) return methodSource.matchWindow(source, {
		                            send: send
		                        }).then((function(match) {
		                            if (!match) throw new Error("Method call '" + data.name + "' failed - proxy window does not match source in " + getDomain(window$1));
		                        }));
		                    })).then((function() {
		                        return val.apply({
		                            source: source,
		                            origin: origin
		                        }, data.args);
		                    }), (function(err) {
		                        return promise_ZalgoPromise.try((function() {
		                            if (val.onError) return val.onError(err);
		                        })).then((function() {
		                            err.stack && (err.stack = "Remote call to " + name + "(" + function(args) {
		                                void 0 === args && (args = []);
		                                return arrayFrom(args).map((function(arg) {
		                                    return "string" == typeof arg ? "'" + arg + "'" : void 0 === arg ? "undefined" : null === arg ? "null" : "boolean" == typeof arg ? arg.toString() : Array.isArray(arg) ? "[ ... ]" : "object" == typeof arg ? "{ ... }" : "function" == typeof arg ? "() => { ... }" : "<" + typeof arg + ">";
		                                })).join(", ");
		                            }(data.args) + ") failed\n\n" + err.stack);
		                            throw err;
		                        }));
		                    })).then((function(result) {
		                        return {
		                            result: result,
		                            id: id,
		                            name: name
		                        };
		                    }));
		                }));
		            }));
		            var _ref, on, send;
		            var id = val.__id__ || uniqueID();
		            destination = window_ProxyWindow.unwrap(destination);
		            var name = val.__name__ || val.name || key;
		            "string" == typeof name && "function" == typeof name.indexOf && 0 === name.indexOf("anonymous::") && (name = name.replace("anonymous::", key + "::"));
		            if (window_ProxyWindow.isProxyWindow(destination)) {
		                addMethod(id, val, name, destination, domain);
		                destination.awaitWindow().then((function(win) {
		                    addMethod(id, val, name, win, domain);
		                }));
		            } else addMethod(id, val, name, destination, domain);
		            return serializeType("cross_domain_function", {
		                id: id,
		                name: name
		            });
		        }
		        function serializeMessage(destination, domain, obj, _ref) {
		            var _serialize;
		            var on = _ref.on, send = _ref.send;
		            return function(obj, serializers) {
		                void 0 === serializers && (serializers = defaultSerializers);
		                var result = JSON.stringify(obj, (function(key) {
		                    var val = this[key];
		                    if (isSerializedType(this)) return val;
		                    var type = determineType(val);
		                    if (!type) return val;
		                    var serializer = serializers[type] || SERIALIZER[type];
		                    return serializer ? serializer(val, key) : val;
		                }));
		                return void 0 === result ? "undefined" : result;
		            }(obj, ((_serialize = {}).promise = function(val, key) {
		                return function(destination, domain, val, key, _ref) {
		                    return serializeType("cross_domain_zalgo_promise", {
		                        then: function_serializeFunction(destination, domain, (function(resolve, reject) {
		                            return val.then(resolve, reject);
		                        }), key, {
		                            on: _ref.on,
		                            send: _ref.send
		                        })
		                    });
		                }(destination, domain, val, key, {
		                    on: on,
		                    send: send
		                });
		            }, _serialize.function = function(val, key) {
		                return function_serializeFunction(destination, domain, val, key, {
		                    on: on,
		                    send: send
		                });
		            }, _serialize.object = function(val) {
		                return isWindow(val) || window_ProxyWindow.isProxyWindow(val) ? serializeType("cross_domain_window", window_ProxyWindow.serialize(val, {
		                    send: send
		                })) : val;
		            }, _serialize));
		        }
		        function deserializeMessage(source, origin, message, _ref2) {
		            var _deserialize;
		            var send = _ref2.send;
		            return function(str, deserializers) {
		                void 0 === deserializers && (deserializers = defaultDeserializers);
		                if ("undefined" !== str) return JSON.parse(str, (function(key, val) {
		                    if (isSerializedType(this)) return val;
		                    var type;
		                    var value;
		                    if (isSerializedType(val)) {
		                        type = val.__type__;
		                        value = val.__val__;
		                    } else {
		                        type = determineType(val);
		                        value = val;
		                    }
		                    if (!type) return value;
		                    var deserializer = deserializers[type] || DESERIALIZER[type];
		                    return deserializer ? deserializer(value, key) : value;
		                }));
		            }(message, ((_deserialize = {}).cross_domain_zalgo_promise = function(serializedPromise) {
		                return function(source, origin, _ref2) {
		                    return new promise_ZalgoPromise(_ref2.then);
		                }(0, 0, serializedPromise);
		            }, _deserialize.cross_domain_function = function(serializedFunction) {
		                return function(source, origin, _ref4, _ref5) {
		                    var id = _ref4.id, name = _ref4.name;
		                    var send = _ref5.send;
		                    var getDeserializedFunction = function(opts) {
		                        void 0 === opts && (opts = {});
		                        function crossDomainFunctionWrapper() {
		                            var _arguments = arguments;
		                            return window_ProxyWindow.toProxyWindow(source, {
		                                send: send
		                            }).awaitWindow().then((function(win) {
		                                var meth = lookupMethod(win, id);
		                                if (meth && meth.val !== crossDomainFunctionWrapper) return meth.val.apply({
		                                    source: window$1,
		                                    origin: getDomain()
		                                }, _arguments);
		                                var _args = [].slice.call(_arguments);
		                                return opts.fireAndForget ? send(win, "postrobot_method", {
		                                    id: id,
		                                    name: name,
		                                    args: _args
		                                }, {
		                                    domain: origin,
		                                    fireAndForget: !0
		                                }) : send(win, "postrobot_method", {
		                                    id: id,
		                                    name: name,
		                                    args: _args
		                                }, {
		                                    domain: origin,
		                                    fireAndForget: !1
		                                }).then((function(res) {
		                                    return res.data.result;
		                                }));
		                            })).catch((function(err) {
		                                throw err;
		                            }));
		                        }
		                        crossDomainFunctionWrapper.__name__ = name;
		                        crossDomainFunctionWrapper.__origin__ = origin;
		                        crossDomainFunctionWrapper.__source__ = source;
		                        crossDomainFunctionWrapper.__id__ = id;
		                        crossDomainFunctionWrapper.origin = origin;
		                        return crossDomainFunctionWrapper;
		                    };
		                    var crossDomainFunctionWrapper = getDeserializedFunction();
		                    crossDomainFunctionWrapper.fireAndForget = getDeserializedFunction({
		                        fireAndForget: !0
		                    });
		                    return crossDomainFunctionWrapper;
		                }(source, origin, serializedFunction, {
		                    send: send
		                });
		            }, _deserialize.cross_domain_window = function(serializedWindow) {
		                return window_ProxyWindow.deserialize(serializedWindow, {
		                    send: send
		                });
		            }, _deserialize));
		        }
		        var SEND_MESSAGE_STRATEGIES = {};
		        SEND_MESSAGE_STRATEGIES.postrobot_post_message = function(win, serializedMessage, domain) {
		            0 === domain.indexOf("file:") && (domain = "*");
		            win.postMessage(serializedMessage, domain);
		        };
		        SEND_MESSAGE_STRATEGIES.postrobot_bridge = function(win, serializedMessage, domain) {
		            if (!needsBridgeForBrowser() && !isBridge()) throw new Error("Bridge not needed for browser");
		            if (isSameDomain(win)) throw new Error("Post message through bridge disabled between same domain windows");
		            if (!1 !== isSameTopWindow(window$1, win)) throw new Error("Can only use bridge to communicate between two different windows, not between frames");
		            !function(win, domain, message) {
		                var messagingChild = isOpener(window$1, win);
		                var messagingParent = isOpener(win, window$1);
		                if (!messagingChild && !messagingParent) throw new Error("Can only send messages to and from parent and popup windows");
		                findRemoteWindow(win).then((function(sendMessage) {
		                    return sendMessage(win, domain, message);
		                }));
		            }(win, domain, serializedMessage);
		        };
		        SEND_MESSAGE_STRATEGIES.postrobot_global = function(win, serializedMessage) {
		            if (!utils_getUserAgent(window$1).match(/MSIE|rv:11|trident|edge\/12|edge\/13/i)) throw new Error("Global messaging not needed for browser");
		            if (!isSameDomain(win)) throw new Error("Post message through global disabled between different domain windows");
		            if (!1 !== isSameTopWindow(window$1, win)) throw new Error("Can only use global to communicate between two different windows, not between frames");
		            var foreignGlobal = global_getGlobal(win);
		            if (!foreignGlobal) throw new Error("Can not find postRobot global on foreign window");
		            foreignGlobal.receiveMessage({
		                source: window$1,
		                origin: getDomain(),
		                data: serializedMessage
		            });
		        };
		        function send_sendMessage(win, domain, message, _ref2) {
		            var on = _ref2.on, send = _ref2.send;
		            return promise_ZalgoPromise.try((function() {
		                var domainBuffer = windowStore().getOrSet(win, (function() {
		                    return {};
		                }));
		                domainBuffer.buffer = domainBuffer.buffer || [];
		                domainBuffer.buffer.push(message);
		                domainBuffer.flush = domainBuffer.flush || promise_ZalgoPromise.flush().then((function() {
		                    if (isWindowClosed(win)) throw new Error("Window is closed");
		                    var serializedMessage = serializeMessage(win, domain, ((_ref = {}).__post_robot_10_0_44__ = domainBuffer.buffer || [], 
		                    _ref), {
		                        on: on,
		                        send: send
		                    });
		                    var _ref;
		                    delete domainBuffer.buffer;
		                    var strategies = Object.keys(SEND_MESSAGE_STRATEGIES);
		                    var errors = [];
		                    for (var _i2 = 0; _i2 < strategies.length; _i2++) {
		                        var strategyName = strategies[_i2];
		                        try {
		                            SEND_MESSAGE_STRATEGIES[strategyName](win, serializedMessage, domain);
		                        } catch (err) {
		                            errors.push(err);
		                        }
		                    }
		                    if (errors.length === strategies.length) throw new Error("All post-robot messaging strategies failed:\n\n" + errors.map((function(err, i) {
		                        return i + ". " + stringifyError(err);
		                    })).join("\n\n"));
		                }));
		                return domainBuffer.flush.then((function() {
		                    delete domainBuffer.flush;
		                }));
		            })).then(src_util_noop);
		        }
		        function getResponseListener(hash) {
		            return globalStore("responseListeners").get(hash);
		        }
		        function deleteResponseListener(hash) {
		            globalStore("responseListeners").del(hash);
		        }
		        function isResponseListenerErrored(hash) {
		            return globalStore("erroredResponseListeners").has(hash);
		        }
		        function getRequestListener(_ref) {
		            var name = _ref.name, win = _ref.win, domain = _ref.domain;
		            var requestListeners = windowStore("requestListeners");
		            "*" === win && (win = null);
		            "*" === domain && (domain = null);
		            if (!name) throw new Error("Name required to get request listener");
		            for (var _i4 = 0, _ref3 = [ win, getWildcard() ]; _i4 < _ref3.length; _i4++) {
		                var winQualifier = _ref3[_i4];
		                if (winQualifier) {
		                    var nameListeners = requestListeners.get(winQualifier);
		                    if (nameListeners) {
		                        var domainListeners = nameListeners[name];
		                        if (domainListeners) {
		                            if (domain && "string" == typeof domain) {
		                                if (domainListeners[domain]) return domainListeners[domain];
		                                if (domainListeners.__domain_regex__) for (var _i6 = 0, _domainListeners$__DO2 = domainListeners.__domain_regex__; _i6 < _domainListeners$__DO2.length; _i6++) {
		                                    var _domainListeners$__DO3 = _domainListeners$__DO2[_i6], listener = _domainListeners$__DO3.listener;
		                                    if (matchDomain(_domainListeners$__DO3.regex, domain)) return listener;
		                                }
		                            }
		                            if (domainListeners["*"]) return domainListeners["*"];
		                        }
		                    }
		                }
		            }
		        }
		        function handleRequest(source, origin, message, _ref) {
		            var on = _ref.on, send = _ref.send;
		            var options = getRequestListener({
		                name: message.name,
		                win: source,
		                domain: origin
		            });
		            var logName = "postrobot_method" === message.name && message.data && "string" == typeof message.data.name ? message.data.name + "()" : message.name;
		            function sendResponse(ack, data, error) {
		                return promise_ZalgoPromise.flush().then((function() {
		                    if (!message.fireAndForget && !isWindowClosed(source)) try {
		                        return send_sendMessage(source, origin, {
		                            id: uniqueID(),
		                            origin: getDomain(window$1),
		                            type: "postrobot_message_response",
		                            hash: message.hash,
		                            name: message.name,
		                            ack: ack,
		                            data: data,
		                            error: error
		                        }, {
		                            on: on,
		                            send: send
		                        });
		                    } catch (err) {
		                        throw new Error("Send response message failed for " + logName + " in " + getDomain() + "\n\n" + stringifyError(err));
		                    }
		                }));
		            }
		            return promise_ZalgoPromise.all([ promise_ZalgoPromise.flush().then((function() {
		                if (!message.fireAndForget && !isWindowClosed(source)) try {
		                    return send_sendMessage(source, origin, {
		                        id: uniqueID(),
		                        origin: getDomain(window$1),
		                        type: "postrobot_message_ack",
		                        hash: message.hash,
		                        name: message.name
		                    }, {
		                        on: on,
		                        send: send
		                    });
		                } catch (err) {
		                    throw new Error("Send ack message failed for " + logName + " in " + getDomain() + "\n\n" + stringifyError(err));
		                }
		            })), promise_ZalgoPromise.try((function() {
		                if (!options) throw new Error("No handler found for post message: " + message.name + " from " + origin + " in " + window$1.location.protocol + "//" + window$1.location.host + window$1.location.pathname);
		                if (!matchDomain(options.domain, origin)) throw new Error("Request origin " + origin + " does not match domain " + options.domain.toString());
		                return options.handler({
		                    source: source,
		                    origin: origin,
		                    data: message.data
		                });
		            })).then((function(data) {
		                return sendResponse("success", data);
		            }), (function(error) {
		                return sendResponse("error", null, error);
		            })) ]).then(src_util_noop).catch((function(err) {
		                if (options && options.handleError) return options.handleError(err);
		                throw err;
		            }));
		        }
		        function handleAck(source, origin, message) {
		            if (!isResponseListenerErrored(message.hash)) {
		                var options = getResponseListener(message.hash);
		                if (!options) throw new Error("No handler found for post message ack for message: " + message.name + " from " + origin + " in " + window$1.location.protocol + "//" + window$1.location.host + window$1.location.pathname);
		                try {
		                    if (!matchDomain(options.domain, origin)) throw new Error("Ack origin " + origin + " does not match domain " + options.domain.toString());
		                    if (source !== options.win) throw new Error("Ack source does not match registered window");
		                } catch (err) {
		                    options.promise.reject(err);
		                }
		                options.ack = !0;
		            }
		        }
		        function handleResponse(source, origin, message) {
		            if (!isResponseListenerErrored(message.hash)) {
		                var options = getResponseListener(message.hash);
		                if (!options) throw new Error("No handler found for post message response for message: " + message.name + " from " + origin + " in " + window$1.location.protocol + "//" + window$1.location.host + window$1.location.pathname);
		                if (!matchDomain(options.domain, origin)) throw new Error("Response origin " + origin + " does not match domain " + (pattern = options.domain, 
		                Array.isArray(pattern) ? "(" + pattern.join(" | ") + ")" : isRegex(pattern) ? "RegExp(" + pattern.toString() + ")" : pattern.toString()));
		                var pattern;
		                if (source !== options.win) throw new Error("Response source does not match registered window");
		                deleteResponseListener(message.hash);
		                "error" === message.ack ? options.promise.reject(message.error) : "success" === message.ack && options.promise.resolve({
		                    source: source,
		                    origin: origin,
		                    data: message.data
		                });
		            }
		        }
		        function receive_receiveMessage(event, _ref2) {
		            var on = _ref2.on, send = _ref2.send;
		            var receivedMessages = globalStore("receivedMessages");
		            try {
		                if (!window$1 || window$1.closed || !event.source) return;
		            } catch (err) {
		                return;
		            }
		            var source = event.source, origin = event.origin;
		            var messages = function(message, source, origin, _ref) {
		                var on = _ref.on, send = _ref.send;
		                var parsedMessage;
		                try {
		                    parsedMessage = deserializeMessage(source, origin, message, {
		                        on: on,
		                        send: send
		                    });
		                } catch (err) {
		                    return;
		                }
		                if (parsedMessage && "object" == typeof parsedMessage && null !== parsedMessage) {
		                    var parseMessages = parsedMessage.__post_robot_10_0_44__;
		                    if (Array.isArray(parseMessages)) return parseMessages;
		                }
		            }(event.data, source, origin, {
		                on: on,
		                send: send
		            });
		            if (messages) {
		                markWindowKnown(source);
		                for (var _i2 = 0; _i2 < messages.length; _i2++) {
		                    var message = messages[_i2];
		                    if (receivedMessages.has(message.id)) return;
		                    receivedMessages.set(message.id, !0);
		                    if (isWindowClosed(source) && !message.fireAndForget) return;
		                    0 === message.origin.indexOf("file:") && (origin = "file://");
		                    try {
		                        "postrobot_message_request" === message.type ? handleRequest(source, origin, message, {
		                            on: on,
		                            send: send
		                        }) : "postrobot_message_response" === message.type ? handleResponse(source, origin, message) : "postrobot_message_ack" === message.type && handleAck(source, origin, message);
		                    } catch (err) {
		                        setTimeout((function() {
		                            throw err;
		                        }), 0);
		                    }
		                }
		            }
		        }
		        function on_on(name, options, handler) {
		            if (!name) throw new Error("Expected name");
		            if ("function" == typeof (options = options || {})) {
		                handler = options;
		                options = {};
		            }
		            if (!handler) throw new Error("Expected handler");
		            (options = options || {}).name = name;
		            options.handler = handler || options.handler;
		            var win = options.window;
		            var domain = options.domain;
		            var requestListener = function addRequestListener(_ref4, listener) {
		                var name = _ref4.name, win = _ref4.win, domain = _ref4.domain;
		                var requestListeners = windowStore("requestListeners");
		                if (!name || "string" != typeof name) throw new Error("Name required to add request listener");
		                if (Array.isArray(win)) {
		                    var listenersCollection = [];
		                    for (var _i8 = 0, _win2 = win; _i8 < _win2.length; _i8++) listenersCollection.push(addRequestListener({
		                        name: name,
		                        domain: domain,
		                        win: _win2[_i8]
		                    }, listener));
		                    return {
		                        cancel: function() {
		                            for (var _i10 = 0; _i10 < listenersCollection.length; _i10++) listenersCollection[_i10].cancel();
		                        }
		                    };
		                }
		                if (Array.isArray(domain)) {
		                    var _listenersCollection = [];
		                    for (var _i12 = 0, _domain2 = domain; _i12 < _domain2.length; _i12++) _listenersCollection.push(addRequestListener({
		                        name: name,
		                        win: win,
		                        domain: _domain2[_i12]
		                    }, listener));
		                    return {
		                        cancel: function() {
		                            for (var _i14 = 0; _i14 < _listenersCollection.length; _i14++) _listenersCollection[_i14].cancel();
		                        }
		                    };
		                }
		                var existingListener = getRequestListener({
		                    name: name,
		                    win: win,
		                    domain: domain
		                });
		                win && "*" !== win || (win = getWildcard());
		                domain = domain || "*";
		                if (existingListener) throw win && domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString() + " for " + (win === getWildcard() ? "wildcard" : "specified") + " window") : win ? new Error("Request listener already exists for " + name + " for " + (win === getWildcard() ? "wildcard" : "specified") + " window") : domain ? new Error("Request listener already exists for " + name + " on domain " + domain.toString()) : new Error("Request listener already exists for " + name);
		                var nameListeners = requestListeners.getOrSet(win, (function() {
		                    return {};
		                }));
		                var domainListeners = util_getOrSet(nameListeners, name, (function() {
		                    return {};
		                }));
		                var strDomain = domain.toString();
		                var regexListeners;
		                var regexListener;
		                util_isRegex(domain) ? (regexListeners = util_getOrSet(domainListeners, "__domain_regex__", (function() {
		                    return [];
		                }))).push(regexListener = {
		                    regex: domain,
		                    listener: listener
		                }) : domainListeners[strDomain] = listener;
		                return {
		                    cancel: function() {
		                        delete domainListeners[strDomain];
		                        if (regexListener) {
		                            regexListeners.splice(regexListeners.indexOf(regexListener, 1));
		                            regexListeners.length || delete domainListeners.__domain_regex__;
		                        }
		                        Object.keys(domainListeners).length || delete nameListeners[name];
		                        win && !Object.keys(nameListeners).length && requestListeners.del(win);
		                    }
		                };
		            }({
		                name: name,
		                win: win,
		                domain: domain
		            }, {
		                handler: options.handler,
		                handleError: options.errorHandler || function(err) {
		                    throw err;
		                },
		                window: win,
		                domain: domain || "*",
		                name: name
		            });
		            return {
		                cancel: function() {
		                    requestListener.cancel();
		                }
		            };
		        }
		        var send_send = function send(win, name, data, options) {
		            var domainMatcher = (options = options || {}).domain || "*";
		            var responseTimeout = options.timeout || -1;
		            var childTimeout = options.timeout || 5e3;
		            var fireAndForget = options.fireAndForget || !1;
		            return promise_ZalgoPromise.try((function() {
		                !function(name, win, domain) {
		                    if (!name) throw new Error("Expected name");
		                    if (domain && "string" != typeof domain && !Array.isArray(domain) && !util_isRegex(domain)) throw new TypeError("Can not send " + name + ". Expected domain " + JSON.stringify(domain) + " to be a string, array, or regex");
		                    if (isWindowClosed(win)) throw new Error("Can not send " + name + ". Target window is closed");
		                }(name, win, domainMatcher);
		                if (function(parent, child) {
		                    var actualParent = getAncestor(child);
		                    if (actualParent) return actualParent === parent;
		                    if (child === parent) return !1;
		                    if (getTop(child) === child) return !1;
		                    for (var _i15 = 0, _getFrames8 = getFrames(parent); _i15 < _getFrames8.length; _i15++) if (_getFrames8[_i15] === child) return !0;
		                    return !1;
		                }(window$1, win)) return awaitWindowHello(win, childTimeout);
		            })).then((function(_temp) {
		                return function(win, targetDomain, actualDomain, _ref) {
		                    var send = _ref.send;
		                    return promise_ZalgoPromise.try((function() {
		                        return "string" == typeof targetDomain ? targetDomain : promise_ZalgoPromise.try((function() {
		                            return actualDomain || sayHello(win, {
		                                send: send
		                            }).then((function(_ref2) {
		                                return _ref2.domain;
		                            }));
		                        })).then((function(normalizedDomain) {
		                            if (!matchDomain(targetDomain, targetDomain)) throw new Error("Domain " + stringify(targetDomain) + " does not match " + stringify(targetDomain));
		                            return normalizedDomain;
		                        }));
		                    }));
		                }(win, domainMatcher, (void 0 === _temp ? {} : _temp).domain, {
		                    send: send
		                });
		            })).then((function(targetDomain) {
		                var domain = targetDomain;
		                var logName = "postrobot_method" === name && data && "string" == typeof data.name ? data.name + "()" : name;
		                var promise = new promise_ZalgoPromise;
		                var hash = name + "_" + uniqueID();
		                if (!fireAndForget) {
		                    var responseListener = {
		                        name: name,
		                        win: win,
		                        domain: domain,
		                        promise: promise
		                    };
		                    !function(hash, listener) {
		                        globalStore("responseListeners").set(hash, listener);
		                    }(hash, responseListener);
		                    var reqPromises = windowStore("requestPromises").getOrSet(win, (function() {
		                        return [];
		                    }));
		                    reqPromises.push(promise);
		                    promise.catch((function() {
		                        !function(hash) {
		                            globalStore("erroredResponseListeners").set(hash, !0);
		                        }(hash);
		                        deleteResponseListener(hash);
		                    }));
		                    var totalAckTimeout = function(win) {
		                        return windowStore("knownWindows").get(win, !1);
		                    }(win) ? 1e4 : 2e3;
		                    var totalResTimeout = responseTimeout;
		                    var ackTimeout = totalAckTimeout;
		                    var resTimeout = totalResTimeout;
		                    var interval = safeInterval((function() {
		                        if (isWindowClosed(win)) return promise.reject(new Error("Window closed for " + name + " before " + (responseListener.ack ? "response" : "ack")));
		                        if (responseListener.cancelled) return promise.reject(new Error("Response listener was cancelled for " + name));
		                        ackTimeout = Math.max(ackTimeout - 500, 0);
		                        -1 !== resTimeout && (resTimeout = Math.max(resTimeout - 500, 0));
		                        return responseListener.ack || 0 !== ackTimeout ? 0 === resTimeout ? promise.reject(new Error("No response for postMessage " + logName + " in " + getDomain() + " in " + totalResTimeout + "ms")) : void 0 : promise.reject(new Error("No ack for postMessage " + logName + " in " + getDomain() + " in " + totalAckTimeout + "ms"));
		                    }), 500);
		                    promise.finally((function() {
		                        interval.cancel();
		                        reqPromises.splice(reqPromises.indexOf(promise, 1));
		                    })).catch(src_util_noop);
		                }
		                return send_sendMessage(win, domain, {
		                    id: uniqueID(),
		                    origin: getDomain(window$1),
		                    type: "postrobot_message_request",
		                    hash: hash,
		                    name: name,
		                    data: data,
		                    fireAndForget: fireAndForget
		                }, {
		                    on: on_on,
		                    send: send
		                }).then((function() {
		                    return fireAndForget ? promise.resolve() : promise;
		                }), (function(err) {
		                    throw new Error("Send request message failed for " + logName + " in " + getDomain() + "\n\n" + stringifyError(err));
		                }));
		            }));
		        };
		        function setup_toProxyWindow(win) {
		            return window_ProxyWindow.toProxyWindow(win, {
		                send: send_send
		            });
		        }
		        function cleanUpWindow(win) {
		            for (var _i2 = 0, _requestPromises$get2 = windowStore("requestPromises").get(win, []); _i2 < _requestPromises$get2.length; _i2++) _requestPromises$get2[_i2].reject(new Error("Window " + (isWindowClosed(win) ? "closed" : "cleaned up") + " before response")).catch(src_util_noop);
		        }
		        var src_bridge;
		        src_bridge = {
		            setupBridge: setupBridge,
		            openBridge: function(url, domain) {
		                var bridges = globalStore("bridges");
		                var bridgeFrames = globalStore("bridgeFrames");
		                domain = domain || getDomainFromUrl(url);
		                return bridges.getOrSet(domain, (function() {
		                    return promise_ZalgoPromise.try((function() {
		                        if (getDomain() === domain) throw new Error("Can not open bridge on the same domain as current domain: " + domain);
		                        var name = getBridgeName(domain);
		                        if (getFrameByName(window$1, name)) throw new Error("Frame with name " + name + " already exists on page");
		                        var iframe = function(name, url) {
		                            var iframe = document.createElement("iframe");
		                            iframe.setAttribute("name", name);
		                            iframe.setAttribute("id", name);
		                            iframe.setAttribute("style", "display: none; margin: 0; padding: 0; border: 0px none; overflow: hidden;");
		                            iframe.setAttribute("frameborder", "0");
		                            iframe.setAttribute("border", "0");
		                            iframe.setAttribute("scrolling", "no");
		                            iframe.setAttribute("allowTransparency", "true");
		                            iframe.setAttribute("tabindex", "-1");
		                            iframe.setAttribute("hidden", "true");
		                            iframe.setAttribute("title", "");
		                            iframe.setAttribute("role", "presentation");
		                            iframe.src = url;
		                            return iframe;
		                        }(name, url);
		                        bridgeFrames.set(domain, iframe);
		                        return documentBodyReady.then((function(body) {
		                            body.appendChild(iframe);
		                            var bridge = iframe.contentWindow;
		                            return new promise_ZalgoPromise((function(resolve, reject) {
		                                iframe.addEventListener("load", resolve);
		                                iframe.addEventListener("error", reject);
		                            })).then((function() {
		                                return awaitWindowHello(bridge, 5e3, "Bridge " + url);
		                            })).then((function() {
		                                return bridge;
		                            }));
		                        }));
		                    }));
		                }));
		            },
		            linkWindow: linkWindow,
		            linkUrl: function(win, url) {
		                linkWindow({
		                    win: win,
		                    domain: getDomainFromUrl(url)
		                });
		            },
		            isBridge: isBridge,
		            needsBridge: needsBridge,
		            needsBridgeForBrowser: needsBridgeForBrowser,
		            hasBridge: function(url, domain) {
		                return globalStore("bridges").has(domain || getDomainFromUrl(url));
		            },
		            needsBridgeForWin: needsBridgeForWin,
		            needsBridgeForDomain: needsBridgeForDomain,
		            destroyBridges: function() {
		                var bridges = globalStore("bridges");
		                var bridgeFrames = globalStore("bridgeFrames");
		                for (var _i4 = 0, _bridgeFrames$keys2 = bridgeFrames.keys(); _i4 < _bridgeFrames$keys2.length; _i4++) {
		                    var frame = bridgeFrames.get(_bridgeFrames$keys2[_i4]);
		                    frame && frame.parentNode && frame.parentNode.removeChild(frame);
		                }
		                bridgeFrames.reset();
		                bridges.reset();
		            }
		        };
		        function lib_global_getGlobal(win) {
		            if (!isSameDomain(win)) throw new Error("Can not get global for window on different domain");
		            win.__zoid_9_0_86__ || (win.__zoid_9_0_86__ = {});
		            return win.__zoid_9_0_86__;
		        }
		        function tryGlobal(win, handler) {
		            try {
		                return handler(lib_global_getGlobal(win));
		            } catch (err) {}
		        }
		        function getProxyObject(obj) {
		            return {
		                get: function() {
		                    var _this = this;
		                    return promise_ZalgoPromise.try((function() {
		                        if (_this.source && _this.source !== window$1) throw new Error("Can not call get on proxy object from a remote window");
		                        return obj;
		                    }));
		                }
		            };
		        }
		        function basicSerialize(data) {
		            return base64encode(JSON.stringify(data));
		        }
		        function getUIDRefStore(win) {
		            var global = lib_global_getGlobal(win);
		            global.references = global.references || {};
		            return global.references;
		        }
		        function crossDomainSerialize(_ref) {
		            var data = _ref.data, metaData = _ref.metaData, sender = _ref.sender, receiver = _ref.receiver, _ref$passByReference = _ref.passByReference, passByReference = void 0 !== _ref$passByReference && _ref$passByReference, _ref$basic = _ref.basic, basic = void 0 !== _ref$basic && _ref$basic;
		            var proxyWin = setup_toProxyWindow(receiver.win);
		            var serializedMessage = basic ? JSON.stringify(data) : serializeMessage(proxyWin, receiver.domain, data, {
		                on: on_on,
		                send: send_send
		            });
		            var reference = passByReference ? function(val) {
		                var uid = uniqueID();
		                getUIDRefStore(window$1)[uid] = val;
		                return {
		                    type: "uid",
		                    uid: uid
		                };
		            }(serializedMessage) : {
		                type: "raw",
		                val: serializedMessage
		            };
		            return {
		                serializedData: basicSerialize({
		                    sender: {
		                        domain: sender.domain
		                    },
		                    metaData: metaData,
		                    reference: reference
		                }),
		                cleanReference: function() {
		                    win = window$1, "uid" === (ref = reference).type && delete getUIDRefStore(win)[ref.uid];
		                    var win, ref;
		                }
		            };
		        }
		        function crossDomainDeserialize(_ref2) {
		            var sender = _ref2.sender, _ref2$basic = _ref2.basic, basic = void 0 !== _ref2$basic && _ref2$basic;
		            var message = function(serializedData) {
		                return JSON.parse(function(str) {
		                    if ("function" == typeof atob) return decodeURIComponent([].map.call(atob(str), (function(c) {
		                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
		                    })).join(""));
		                    if ("undefined" != typeof Buffer) return Buffer.from(str, "base64").toString("utf8");
		                    throw new Error("Can not find window.atob or Buffer");
		                }(serializedData));
		            }(_ref2.data);
		            var reference = message.reference, metaData = message.metaData;
		            var win;
		            win = "function" == typeof sender.win ? sender.win({
		                metaData: metaData
		            }) : sender.win;
		            var domain;
		            domain = "function" == typeof sender.domain ? sender.domain({
		                metaData: metaData
		            }) : "string" == typeof sender.domain ? sender.domain : message.sender.domain;
		            var serializedData = function(win, ref) {
		                if ("raw" === ref.type) return ref.val;
		                if ("uid" === ref.type) return getUIDRefStore(win)[ref.uid];
		                throw new Error("Unsupported ref type: " + ref.type);
		            }(win, reference);
		            return {
		                data: basic ? JSON.parse(serializedData) : function(source, origin, message) {
		                    return deserializeMessage(source, origin, message, {
		                        on: on_on,
		                        send: send_send
		                    });
		                }(win, domain, serializedData),
		                metaData: metaData,
		                sender: {
		                    win: win,
		                    domain: domain
		                },
		                reference: reference
		            };
		        }
		        var PROP_TYPE = {
		            STRING: "string",
		            OBJECT: "object",
		            FUNCTION: "function",
		            BOOLEAN: "boolean",
		            NUMBER: "number",
		            ARRAY: "array"
		        };
		        var PROP_SERIALIZATION = {
		            JSON: "json",
		            DOTIFY: "dotify",
		            BASE64: "base64"
		        };
		        var CONTEXT = WINDOW_TYPE;
		        var EVENT = {
		            RENDER: "zoid-render",
		            RENDERED: "zoid-rendered",
		            DISPLAY: "zoid-display",
		            ERROR: "zoid-error",
		            CLOSE: "zoid-close",
		            DESTROY: "zoid-destroy",
		            PROPS: "zoid-props",
		            RESIZE: "zoid-resize",
		            FOCUS: "zoid-focus"
		        };
		        function buildChildWindowName(_ref) {
		            return "__zoid__" + _ref.name + "__" + _ref.serializedPayload + "__";
		        }
		        function parseWindowName(windowName) {
		            if (!windowName) throw new Error("No window name");
		            var _windowName$split = windowName.split("__"), zoidcomp = _windowName$split[1], name = _windowName$split[2], serializedInitialPayload = _windowName$split[3];
		            if ("zoid" !== zoidcomp) throw new Error("Window not rendered by zoid - got " + zoidcomp);
		            if (!name) throw new Error("Expected component name");
		            if (!serializedInitialPayload) throw new Error("Expected serialized payload ref");
		            return {
		                name: name,
		                serializedInitialPayload: serializedInitialPayload
		            };
		        }
		        var parseInitialParentPayload = memoize((function(windowName) {
		            var _crossDomainDeseriali = crossDomainDeserialize({
		                data: parseWindowName(windowName).serializedInitialPayload,
		                sender: {
		                    win: function(_ref2) {
		                        return function(windowRef) {
		                            if ("opener" === windowRef.type) return assertExists("opener", getOpener(window$1));
		                            if ("parent" === windowRef.type && "number" == typeof windowRef.distance) return assertExists("parent", function(win, n) {
		                                void 0 === n && (n = 1);
		                                return function(win, n) {
		                                    void 0 === n && (n = 1);
		                                    var parent = win;
		                                    for (var i = 0; i < n; i++) {
		                                        if (!parent) return;
		                                        parent = utils_getParent(parent);
		                                    }
		                                    return parent;
		                                }(win, getDistanceFromTop(win) - n);
		                            }(window$1, windowRef.distance));
		                            if ("global" === windowRef.type && windowRef.uid && "string" == typeof windowRef.uid) {
		                                var _ret = function() {
		                                    var uid = windowRef.uid;
		                                    var ancestor = getAncestor(window$1);
		                                    if (!ancestor) throw new Error("Can not find ancestor window");
		                                    for (var _i2 = 0, _getAllFramesInWindow2 = getAllFramesInWindow(ancestor); _i2 < _getAllFramesInWindow2.length; _i2++) {
		                                        var frame = _getAllFramesInWindow2[_i2];
		                                        if (isSameDomain(frame)) {
		                                            var win = tryGlobal(frame, (function(global) {
		                                                return global.windows && global.windows[uid];
		                                            }));
		                                            if (win) return {
		                                                v: win
		                                            };
		                                        }
		                                    }
		                                }();
		                                if ("object" == typeof _ret) return _ret.v;
		                            } else if ("name" === windowRef.type) {
		                                var name = windowRef.name;
		                                return assertExists("namedWindow", function(win, name) {
		                                    return getFrameByName(win, name) || function findChildFrameByName(win, name) {
		                                        var frame = getFrameByName(win, name);
		                                        if (frame) return frame;
		                                        for (var _i11 = 0, _getFrames4 = getFrames(win); _i11 < _getFrames4.length; _i11++) {
		                                            var namedFrame = findChildFrameByName(_getFrames4[_i11], name);
		                                            if (namedFrame) return namedFrame;
		                                        }
		                                    }(getTop(win) || win, name);
		                                }(assertExists("ancestor", getAncestor(window$1)), name));
		                            }
		                            throw new Error("Unable to find " + windowRef.type + " parent component window");
		                        }(_ref2.metaData.windowRef);
		                    }
		                }
		            });
		            return {
		                parent: _crossDomainDeseriali.sender,
		                payload: _crossDomainDeseriali.data,
		                reference: _crossDomainDeseriali.reference
		            };
		        }));
		        function getInitialParentPayload() {
		            return parseInitialParentPayload(window$1.name);
		        }
		        function window_getWindowRef(targetWindow, currentWindow) {
		            void 0 === currentWindow && (currentWindow = window$1);
		            if (targetWindow === utils_getParent(currentWindow)) return {
		                type: "parent",
		                distance: getDistanceFromTop(targetWindow)
		            };
		            if (targetWindow === getOpener(currentWindow)) return {
		                type: "opener"
		            };
		            if (isSameDomain(targetWindow) && !(win = targetWindow, win === getTop(win))) {
		                var windowName = assertSameDomain(targetWindow).name;
		                if (windowName) return {
		                    type: "name",
		                    name: windowName
		                };
		            }
		            var win;
		        }
		        function normalizeChildProp(propsDef, props, key, value, helpers) {
		            if (!propsDef.hasOwnProperty(key)) return value;
		            var prop = propsDef[key];
		            return "function" == typeof prop.childDecorate ? prop.childDecorate({
		                value: value,
		                uid: helpers.uid,
		                tag: helpers.tag,
		                close: helpers.close,
		                focus: helpers.focus,
		                onError: helpers.onError,
		                onProps: helpers.onProps,
		                resize: helpers.resize,
		                getParent: helpers.getParent,
		                getParentDomain: helpers.getParentDomain,
		                show: helpers.show,
		                hide: helpers.hide,
		                export: helpers.export,
		                getSiblings: helpers.getSiblings
		            }) : value;
		        }
		        function child_focus() {
		            return promise_ZalgoPromise.try((function() {
		                window$1.focus();
		            }));
		        }
		        function child_destroy() {
		            return promise_ZalgoPromise.try((function() {
		                window$1.close();
		            }));
		        }
		        var props_defaultNoop = function() {
		            return src_util_noop;
		        };
		        var props_decorateOnce = function(_ref) {
		            return once(_ref.value);
		        };
		        function eachProp(props, propsDef, handler) {
		            for (var _i2 = 0, _Object$keys2 = Object.keys(_extends({}, props, propsDef)); _i2 < _Object$keys2.length; _i2++) {
		                var key = _Object$keys2[_i2];
		                handler(key, propsDef[key], props[key]);
		            }
		        }
		        function serializeProps(propsDef, props, method) {
		            var params = {};
		            return promise_ZalgoPromise.all(function(props, propsDef, handler) {
		                var results = [];
		                eachProp(props, propsDef, (function(key, propDef, value) {
		                    var result = function(key, propDef, value) {
		                        return promise_ZalgoPromise.resolve().then((function() {
		                            var _METHOD$GET$METHOD$PO, _METHOD$GET$METHOD$PO2;
		                            if (null != value && propDef) {
		                                var getParam = (_METHOD$GET$METHOD$PO = {}, _METHOD$GET$METHOD$PO.get = propDef.queryParam, 
		                                _METHOD$GET$METHOD$PO.post = propDef.bodyParam, _METHOD$GET$METHOD$PO)[method];
		                                var getValue = (_METHOD$GET$METHOD$PO2 = {}, _METHOD$GET$METHOD$PO2.get = propDef.queryValue, 
		                                _METHOD$GET$METHOD$PO2.post = propDef.bodyValue, _METHOD$GET$METHOD$PO2)[method];
		                                if (getParam) return promise_ZalgoPromise.hash({
		                                    finalParam: promise_ZalgoPromise.try((function() {
		                                        return "function" == typeof getParam ? getParam({
		                                            value: value
		                                        }) : "string" == typeof getParam ? getParam : key;
		                                    })),
		                                    finalValue: promise_ZalgoPromise.try((function() {
		                                        return "function" == typeof getValue && isDefined(value) ? getValue({
		                                            value: value
		                                        }) : value;
		                                    }))
		                                }).then((function(_ref) {
		                                    var finalParam = _ref.finalParam, finalValue = _ref.finalValue;
		                                    var result;
		                                    if ("boolean" == typeof finalValue) result = finalValue.toString(); else if ("string" == typeof finalValue) result = finalValue.toString(); else if ("object" == typeof finalValue && null !== finalValue) {
		                                        if (propDef.serialization === PROP_SERIALIZATION.JSON) result = JSON.stringify(finalValue); else if (propDef.serialization === PROP_SERIALIZATION.BASE64) result = base64encode(JSON.stringify(finalValue)); else if (propDef.serialization === PROP_SERIALIZATION.DOTIFY || !propDef.serialization) {
		                                            result = function dotify(obj, prefix, newobj) {
		                                                void 0 === prefix && (prefix = "");
		                                                void 0 === newobj && (newobj = {});
		                                                prefix = prefix ? prefix + "." : prefix;
		                                                for (var key in obj) obj.hasOwnProperty(key) && null != obj[key] && "function" != typeof obj[key] && (obj[key] && Array.isArray(obj[key]) && obj[key].length && obj[key].every((function(val) {
		                                                    return "object" != typeof val;
		                                                })) ? newobj["" + prefix + key + "[]"] = obj[key].join(",") : obj[key] && "object" == typeof obj[key] ? newobj = dotify(obj[key], "" + prefix + key, newobj) : newobj["" + prefix + key] = obj[key].toString());
		                                                return newobj;
		                                            }(finalValue, key);
		                                            for (var _i2 = 0, _Object$keys2 = Object.keys(result); _i2 < _Object$keys2.length; _i2++) {
		                                                var dotkey = _Object$keys2[_i2];
		                                                params[dotkey] = result[dotkey];
		                                            }
		                                            return;
		                                        }
		                                    } else "number" == typeof finalValue && (result = finalValue.toString());
		                                    params[finalParam] = result;
		                                }));
		                            }
		                        }));
		                    }(key, propDef, value);
		                    results.push(result);
		                }));
		                return results;
		            }(props, propsDef)).then((function() {
		                return params;
		            }));
		        }
		        function parentComponent(_ref) {
		            var uid = _ref.uid, options = _ref.options, _ref$overrides = _ref.overrides, overrides = void 0 === _ref$overrides ? {} : _ref$overrides, _ref$parentWin = _ref.parentWin, parentWin = void 0 === _ref$parentWin ? window$1 : _ref$parentWin;
		            var propsDef = options.propsDef, containerTemplate = options.containerTemplate, prerenderTemplate = options.prerenderTemplate, tag = options.tag, name = options.name, attributes = options.attributes, dimensions = options.dimensions, autoResize = options.autoResize, url = options.url, domainMatch = options.domain, xports = options.exports;
		            var initPromise = new promise_ZalgoPromise;
		            var handledErrors = [];
		            var clean = cleanup();
		            var state = {};
		            var inputProps = {};
		            var internalState = {
		                visible: !0
		            };
		            var event = overrides.event ? overrides.event : (triggered = {}, handlers = {}, 
		            emitter = {
		                on: function(eventName, handler) {
		                    var handlerList = handlers[eventName] = handlers[eventName] || [];
		                    handlerList.push(handler);
		                    var cancelled = !1;
		                    return {
		                        cancel: function() {
		                            if (!cancelled) {
		                                cancelled = !0;
		                                handlerList.splice(handlerList.indexOf(handler), 1);
		                            }
		                        }
		                    };
		                },
		                once: function(eventName, handler) {
		                    var listener = emitter.on(eventName, (function() {
		                        listener.cancel();
		                        handler();
		                    }));
		                    return listener;
		                },
		                trigger: function(eventName) {
		                    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		                    var handlerList = handlers[eventName];
		                    var promises = [];
		                    if (handlerList) {
		                        var _loop = function(_i2) {
		                            var handler = handlerList[_i2];
		                            promises.push(promise_ZalgoPromise.try((function() {
		                                return handler.apply(void 0, args);
		                            })));
		                        };
		                        for (var _i2 = 0; _i2 < handlerList.length; _i2++) _loop(_i2);
		                    }
		                    return promise_ZalgoPromise.all(promises).then(src_util_noop);
		                },
		                triggerOnce: function(eventName) {
		                    if (triggered[eventName]) return promise_ZalgoPromise.resolve();
		                    triggered[eventName] = !0;
		                    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) args[_key4 - 1] = arguments[_key4];
		                    return emitter.trigger.apply(emitter, [ eventName ].concat(args));
		                },
		                reset: function() {
		                    handlers = {};
		                }
		            });
		            var triggered, handlers, emitter;
		            var props = overrides.props ? overrides.props : {};
		            var currentProxyWin;
		            var currentProxyContainer;
		            var childComponent;
		            var currentChildDomain;
		            var currentContainer;
		            var onErrorOverride = overrides.onError;
		            var getProxyContainerOverride = overrides.getProxyContainer;
		            var showOverride = overrides.show;
		            var hideOverride = overrides.hide;
		            var closeOverride = overrides.close;
		            var renderContainerOverride = overrides.renderContainer;
		            var getProxyWindowOverride = overrides.getProxyWindow;
		            var setProxyWinOverride = overrides.setProxyWin;
		            var openFrameOverride = overrides.openFrame;
		            var openPrerenderFrameOverride = overrides.openPrerenderFrame;
		            var prerenderOverride = overrides.prerender;
		            var openOverride = overrides.open;
		            var openPrerenderOverride = overrides.openPrerender;
		            var watchForUnloadOverride = overrides.watchForUnload;
		            var getInternalStateOverride = overrides.getInternalState;
		            var setInternalStateOverride = overrides.setInternalState;
		            var getDimensions = function() {
		                return "function" == typeof dimensions ? dimensions({
		                    props: props
		                }) : dimensions;
		            };
		            var resolveInitPromise = function() {
		                return promise_ZalgoPromise.try((function() {
		                    return overrides.resolveInitPromise ? overrides.resolveInitPromise() : initPromise.resolve();
		                }));
		            };
		            var rejectInitPromise = function(err) {
		                return promise_ZalgoPromise.try((function() {
		                    return overrides.rejectInitPromise ? overrides.rejectInitPromise(err) : initPromise.reject(err);
		                }));
		            };
		            var getPropsForChild = function(initialChildDomain) {
		                var result = {};
		                for (var _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
		                    var key = _Object$keys2[_i2];
		                    var prop = propsDef[key];
		                    prop && !1 === prop.sendToChild || prop && prop.sameDomain && !matchDomain(initialChildDomain, getDomain(window$1)) || (result[key] = props[key]);
		                }
		                return promise_ZalgoPromise.hash(result);
		            };
		            var getInternalState = function() {
		                return promise_ZalgoPromise.try((function() {
		                    return getInternalStateOverride ? getInternalStateOverride() : internalState;
		                }));
		            };
		            var setInternalState = function(newInternalState) {
		                return promise_ZalgoPromise.try((function() {
		                    return setInternalStateOverride ? setInternalStateOverride(newInternalState) : internalState = _extends({}, internalState, newInternalState);
		                }));
		            };
		            var getProxyWindow = function() {
		                return getProxyWindowOverride ? getProxyWindowOverride() : promise_ZalgoPromise.try((function() {
		                    var windowProp = props.window;
		                    if (windowProp) {
		                        var _proxyWin = setup_toProxyWindow(windowProp);
		                        clean.register((function() {
		                            return windowProp.close();
		                        }));
		                        return _proxyWin;
		                    }
		                    return new window_ProxyWindow({
		                        send: send_send
		                    });
		                }));
		            };
		            var setProxyWin = function(proxyWin) {
		                return setProxyWinOverride ? setProxyWinOverride(proxyWin) : promise_ZalgoPromise.try((function() {
		                    currentProxyWin = proxyWin;
		                }));
		            };
		            var show = function() {
		                return showOverride ? showOverride() : promise_ZalgoPromise.hash({
		                    setState: setInternalState({
		                        visible: !0
		                    }),
		                    showElement: currentProxyContainer ? currentProxyContainer.get().then(showElement) : null
		                }).then(src_util_noop);
		            };
		            var hide = function() {
		                return hideOverride ? hideOverride() : promise_ZalgoPromise.hash({
		                    setState: setInternalState({
		                        visible: !1
		                    }),
		                    showElement: currentProxyContainer ? currentProxyContainer.get().then(hideElement) : null
		                }).then(src_util_noop);
		            };
		            var getUrl = function() {
		                return "function" == typeof url ? url({
		                    props: props
		                }) : url;
		            };
		            var getAttributes = function() {
		                return "function" == typeof attributes ? attributes({
		                    props: props
		                }) : attributes;
		            };
		            var getInitialChildDomain = function() {
		                return getDomainFromUrl(getUrl());
		            };
		            var openFrame = function(context, _ref2) {
		                var windowName = _ref2.windowName;
		                return openFrameOverride ? openFrameOverride(context, {
		                    windowName: windowName
		                }) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) return getProxyObject(dom_iframe({
		                        attributes: _extends({
		                            name: windowName,
		                            title: name
		                        }, getAttributes().iframe)
		                    }));
		                }));
		            };
		            var openPrerenderFrame = function(context) {
		                return openPrerenderFrameOverride ? openPrerenderFrameOverride(context) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) return getProxyObject(dom_iframe({
		                        attributes: _extends({
		                            name: "__zoid_prerender_frame__" + name + "_" + uniqueID() + "__",
		                            title: "prerender__" + name
		                        }, getAttributes().iframe)
		                    }));
		                }));
		            };
		            var openPrerender = function(context, proxyWin, proxyPrerenderFrame) {
		                return openPrerenderOverride ? openPrerenderOverride(context, proxyWin, proxyPrerenderFrame) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) {
		                        if (!proxyPrerenderFrame) throw new Error("Expected proxy frame to be passed");
		                        return proxyPrerenderFrame.get().then((function(prerenderFrame) {
		                            clean.register((function() {
		                                return destroyElement(prerenderFrame);
		                            }));
		                            return awaitFrameWindow(prerenderFrame).then((function(prerenderFrameWindow) {
		                                return assertSameDomain(prerenderFrameWindow);
		                            })).then((function(win) {
		                                return setup_toProxyWindow(win);
		                            }));
		                        }));
		                    }
		                    if (context === CONTEXT.POPUP) return proxyWin;
		                    throw new Error("No render context available for " + context);
		                }));
		            };
		            var focus = function() {
		                return promise_ZalgoPromise.try((function() {
		                    if (currentProxyWin) return promise_ZalgoPromise.all([ event.trigger(EVENT.FOCUS), currentProxyWin.focus() ]).then(src_util_noop);
		                }));
		            };
		            var getCurrentWindowReferenceUID = function() {
		                var global = lib_global_getGlobal(window$1);
		                global.windows = global.windows || {};
		                global.windows[uid] = window$1;
		                clean.register((function() {
		                    delete global.windows[uid];
		                }));
		                return uid;
		            };
		            var getWindowRef = function(target, initialChildDomain, context, proxyWin) {
		                if (initialChildDomain === getDomain(window$1)) return {
		                    type: "global",
		                    uid: getCurrentWindowReferenceUID()
		                };
		                if (target !== window$1) throw new Error("Can not construct cross-domain window reference for different target window");
		                if (props.window) {
		                    var actualComponentWindow = proxyWin.getWindow();
		                    if (!actualComponentWindow) throw new Error("Can not construct cross-domain window reference for lazy window prop");
		                    if (getAncestor(actualComponentWindow) !== window$1) throw new Error("Can not construct cross-domain window reference for window prop with different ancestor");
		                }
		                if (context === CONTEXT.POPUP) return {
		                    type: "opener"
		                };
		                if (context === CONTEXT.IFRAME) return {
		                    type: "parent",
		                    distance: getDistanceFromTop(window$1)
		                };
		                throw new Error("Can not construct window reference for child");
		            };
		            var initChild = function(childDomain, childExports) {
		                return promise_ZalgoPromise.try((function() {
		                    currentChildDomain = childDomain;
		                    childComponent = childExports;
		                    resolveInitPromise();
		                    clean.register((function() {
		                        return childExports.close.fireAndForget().catch(src_util_noop);
		                    }));
		                }));
		            };
		            var resize = function(_ref3) {
		                var width = _ref3.width, height = _ref3.height;
		                return promise_ZalgoPromise.try((function() {
		                    event.trigger(EVENT.RESIZE, {
		                        width: width,
		                        height: height
		                    });
		                }));
		            };
		            var destroy = function(err) {
		                return promise_ZalgoPromise.try((function() {
		                    return event.trigger(EVENT.DESTROY);
		                })).catch(src_util_noop).then((function() {
		                    return clean.all(err);
		                })).then((function() {
		                    initPromise.asyncReject(err || new Error("Component destroyed"));
		                }));
		            };
		            var close = memoize((function(err) {
		                return promise_ZalgoPromise.try((function() {
		                    if (closeOverride) {
		                        if (isWindowClosed(closeOverride.__source__)) return;
		                        return closeOverride();
		                    }
		                    return promise_ZalgoPromise.try((function() {
		                        return event.trigger(EVENT.CLOSE);
		                    })).then((function() {
		                        return destroy(err || new Error("Component closed"));
		                    }));
		                }));
		            }));
		            var open = function(context, _ref4) {
		                var proxyWin = _ref4.proxyWin, proxyFrame = _ref4.proxyFrame, windowName = _ref4.windowName;
		                return openOverride ? openOverride(context, {
		                    proxyWin: proxyWin,
		                    proxyFrame: proxyFrame,
		                    windowName: windowName
		                }) : promise_ZalgoPromise.try((function() {
		                    if (context === CONTEXT.IFRAME) {
		                        if (!proxyFrame) throw new Error("Expected proxy frame to be passed");
		                        return proxyFrame.get().then((function(frame) {
		                            return awaitFrameWindow(frame).then((function(win) {
		                                clean.register((function() {
		                                    return destroyElement(frame);
		                                }));
		                                clean.register((function() {
		                                    return cleanUpWindow(win);
		                                }));
		                                return win;
		                            }));
		                        }));
		                    }
		                    if (context === CONTEXT.POPUP) {
		                        var _getDimensions = getDimensions(), _getDimensions$width = _getDimensions.width, width = void 0 === _getDimensions$width ? "300px" : _getDimensions$width, _getDimensions$height = _getDimensions.height, height = void 0 === _getDimensions$height ? "150px" : _getDimensions$height;
		                        width = normalizeDimension(width, window$1.outerWidth);
		                        height = normalizeDimension(height, window$1.outerWidth);
		                        var win = function(url, options) {
		                            var _options$closeOnUnloa = (options = options || {}).closeOnUnload, closeOnUnload = void 0 === _options$closeOnUnloa ? 1 : _options$closeOnUnloa, _options$name = options.name, name = void 0 === _options$name ? "" : _options$name, width = options.width, height = options.height;
		                            var top = 0;
		                            var left = 0;
		                            width && (window$1.outerWidth ? left = Math.round((window$1.outerWidth - width) / 2) + window$1.screenX : window$1.screen.width && (left = Math.round((window$1.screen.width - width) / 2)));
		                            height && (window$1.outerHeight ? top = Math.round((window$1.outerHeight - height) / 2) + window$1.screenY : window$1.screen.height && (top = Math.round((window$1.screen.height - height) / 2)));
		                            delete options.closeOnUnload;
		                            delete options.name;
		                            width && height && (options = _extends({
		                                top: top,
		                                left: left,
		                                width: width,
		                                height: height,
		                                status: 1,
		                                toolbar: 0,
		                                menubar: 0,
		                                resizable: 1,
		                                scrollbars: 1
		                            }, options));
		                            var params = Object.keys(options).map((function(key) {
		                                if (null != options[key]) return key + "=" + stringify(options[key]);
		                            })).filter(Boolean).join(",");
		                            var win;
		                            try {
		                                win = window$1.open("", name, params);
		                            } catch (err) {
		                                throw new dom_PopupOpenError("Can not open popup window - " + (err.stack || err.message));
		                            }
		                            if (isWindowClosed(win)) {
		                                throw new dom_PopupOpenError("Can not open popup window - blocked");
		                            }
		                            closeOnUnload && window$1.addEventListener("unload", (function() {
		                                return win.close();
		                            }));
		                            return win;
		                        }(0, _extends({
		                            name: windowName,
		                            width: width,
		                            height: height
		                        }, getAttributes().popup));
		                        clean.register((function() {
		                            return closeWindow(win);
		                        }));
		                        clean.register((function() {
		                            return cleanUpWindow(win);
		                        }));
		                        return win;
		                    }
		                    throw new Error("No render context available for " + context);
		                })).then((function(win) {
		                    proxyWin.setWindow(win, {
		                        send: send_send
		                    });
		                    return proxyWin.setName(windowName).then((function() {
		                        return proxyWin;
		                    }));
		                }));
		            };
		            var watchForUnload = function() {
		                return promise_ZalgoPromise.try((function() {
		                    var unloadWindowListener = addEventListener(window$1, "unload", once((function() {
		                        destroy(new Error("Window navigated away"));
		                    })));
		                    var closeParentWindowListener = onCloseWindow(parentWin, destroy, 3e3);
		                    clean.register(closeParentWindowListener.cancel);
		                    clean.register(unloadWindowListener.cancel);
		                    if (watchForUnloadOverride) return watchForUnloadOverride();
		                }));
		            };
		            var checkWindowClose = function(proxyWin) {
		                var closed = !1;
		                return proxyWin.isClosed().then((function(isClosed) {
		                    if (isClosed) {
		                        closed = !0;
		                        return close(new Error("Detected component window close"));
		                    }
		                    return promise_ZalgoPromise.delay(200).then((function() {
		                        return proxyWin.isClosed();
		                    })).then((function(secondIsClosed) {
		                        if (secondIsClosed) {
		                            closed = !0;
		                            return close(new Error("Detected component window close"));
		                        }
		                    }));
		                })).then((function() {
		                    return closed;
		                }));
		            };
		            var onError = function(err) {
		                return onErrorOverride ? onErrorOverride(err) : promise_ZalgoPromise.try((function() {
		                    if (-1 === handledErrors.indexOf(err)) {
		                        handledErrors.push(err);
		                        initPromise.asyncReject(err);
		                        return event.trigger(EVENT.ERROR, err);
		                    }
		                }));
		            };
		            var exportsPromise = new promise_ZalgoPromise;
		            var xport = function(actualExports) {
		                return promise_ZalgoPromise.try((function() {
		                    exportsPromise.resolve(actualExports);
		                }));
		            };
		            initChild.onError = onError;
		            var renderTemplate = function(renderer, _ref8) {
		                return renderer({
		                    uid: uid,
		                    container: _ref8.container,
		                    context: _ref8.context,
		                    doc: _ref8.doc,
		                    frame: _ref8.frame,
		                    prerenderFrame: _ref8.prerenderFrame,
		                    focus: focus,
		                    close: close,
		                    state: state,
		                    props: props,
		                    tag: tag,
		                    dimensions: getDimensions(),
		                    event: event
		                });
		            };
		            var prerender = function(proxyPrerenderWin, _ref9) {
		                var context = _ref9.context;
		                return prerenderOverride ? prerenderOverride(proxyPrerenderWin, {
		                    context: context
		                }) : promise_ZalgoPromise.try((function() {
		                    if (prerenderTemplate) {
		                        var prerenderWindow = proxyPrerenderWin.getWindow();
		                        if (prerenderWindow && isSameDomain(prerenderWindow) && function(win) {
		                            try {
		                                if (!win.location.href) return !0;
		                                if ("about:blank" === win.location.href) return !0;
		                            } catch (err) {}
		                            return !1;
		                        }(prerenderWindow)) {
		                            var doc = (prerenderWindow = assertSameDomain(prerenderWindow)).document;
		                            var el = renderTemplate(prerenderTemplate, {
		                                context: context,
		                                doc: doc
		                            });
		                            if (el) {
		                                if (el.ownerDocument !== doc) throw new Error("Expected prerender template to have been created with document from child window");
		                                !function(win, el) {
		                                    var tag = el.tagName.toLowerCase();
		                                    if ("html" !== tag) throw new Error("Expected element to be html, got " + tag);
		                                    var documentElement = win.document.documentElement;
		                                    for (var _i6 = 0, _arrayFrom2 = arrayFrom(documentElement.children); _i6 < _arrayFrom2.length; _i6++) documentElement.removeChild(_arrayFrom2[_i6]);
		                                    for (var _i8 = 0, _arrayFrom4 = arrayFrom(el.children); _i8 < _arrayFrom4.length; _i8++) documentElement.appendChild(_arrayFrom4[_i8]);
		                                }(prerenderWindow, el);
		                                var _autoResize$width = autoResize.width, width = void 0 !== _autoResize$width && _autoResize$width, _autoResize$height = autoResize.height, height = void 0 !== _autoResize$height && _autoResize$height, _autoResize$element = autoResize.element, element = void 0 === _autoResize$element ? "body" : _autoResize$element;
		                                if ((element = getElementSafe(element, doc)) && (width || height)) {
		                                    var prerenderResizeListener = onResize(element, (function(_ref10) {
		                                        resize({
		                                            width: width ? _ref10.width : void 0,
		                                            height: height ? _ref10.height : void 0
		                                        });
		                                    }), {
		                                        width: width,
		                                        height: height,
		                                        win: prerenderWindow
		                                    });
		                                    event.on(EVENT.RENDERED, prerenderResizeListener.cancel);
		                                }
		                            }
		                        }
		                    }
		                }));
		            };
		            var renderContainer = function(proxyContainer, _ref11) {
		                var proxyFrame = _ref11.proxyFrame, proxyPrerenderFrame = _ref11.proxyPrerenderFrame, context = _ref11.context, rerender = _ref11.rerender;
		                return renderContainerOverride ? renderContainerOverride(proxyContainer, {
		                    proxyFrame: proxyFrame,
		                    proxyPrerenderFrame: proxyPrerenderFrame,
		                    context: context,
		                    rerender: rerender
		                }) : promise_ZalgoPromise.hash({
		                    container: proxyContainer.get(),
		                    frame: proxyFrame ? proxyFrame.get() : null,
		                    prerenderFrame: proxyPrerenderFrame ? proxyPrerenderFrame.get() : null,
		                    internalState: getInternalState()
		                }).then((function(_ref12) {
		                    var container = _ref12.container, visible = _ref12.internalState.visible;
		                    var innerContainer = renderTemplate(containerTemplate, {
		                        context: context,
		                        container: container,
		                        frame: _ref12.frame,
		                        prerenderFrame: _ref12.prerenderFrame,
		                        doc: document
		                    });
		                    if (innerContainer) {
		                        visible || hideElement(innerContainer);
		                        appendChild(container, innerContainer);
		                        var containerWatcher = function(element, handler) {
		                            handler = once(handler);
		                            var cancelled = !1;
		                            var mutationObservers = [];
		                            var interval;
		                            var sacrificialFrame;
		                            var sacrificialFrameWin;
		                            var cancel = function() {
		                                cancelled = !0;
		                                for (var _i18 = 0; _i18 < mutationObservers.length; _i18++) mutationObservers[_i18].disconnect();
		                                interval && interval.cancel();
		                                sacrificialFrameWin && sacrificialFrameWin.removeEventListener("unload", elementClosed);
		                                sacrificialFrame && destroyElement(sacrificialFrame);
		                            };
		                            var elementClosed = function() {
		                                if (!cancelled) {
		                                    handler();
		                                    cancel();
		                                }
		                            };
		                            if (isElementClosed(element)) {
		                                elementClosed();
		                                return {
		                                    cancel: cancel
		                                };
		                            }
		                            if (window$1.MutationObserver) {
		                                var mutationElement = element.parentElement;
		                                for (;mutationElement; ) {
		                                    var mutationObserver = new window$1.MutationObserver((function() {
		                                        isElementClosed(element) && elementClosed();
		                                    }));
		                                    mutationObserver.observe(mutationElement, {
		                                        childList: !0
		                                    });
		                                    mutationObservers.push(mutationObserver);
		                                    mutationElement = mutationElement.parentElement;
		                                }
		                            }
		                            (sacrificialFrame = document.createElement("iframe")).setAttribute("name", "__detect_close_" + uniqueID() + "__");
		                            sacrificialFrame.style.display = "none";
		                            awaitFrameWindow(sacrificialFrame).then((function(frameWin) {
		                                (sacrificialFrameWin = assertSameDomain(frameWin)).addEventListener("unload", elementClosed);
		                            }));
		                            element.appendChild(sacrificialFrame);
		                            interval = safeInterval((function() {
		                                isElementClosed(element) && elementClosed();
		                            }), 1e3);
		                            return {
		                                cancel: cancel
		                            };
		                        }(innerContainer, (function() {
		                            var removeError = new Error("Detected container element removed from DOM");
		                            return promise_ZalgoPromise.delay(1).then((function() {
		                                if (!isElementClosed(innerContainer)) {
		                                    clean.all(removeError);
		                                    return rerender().then(resolveInitPromise, rejectInitPromise);
		                                }
		                                close(removeError);
		                            }));
		                        }));
		                        clean.register((function() {
		                            return containerWatcher.cancel();
		                        }));
		                        clean.register((function() {
		                            return destroyElement(innerContainer);
		                        }));
		                        return currentProxyContainer = getProxyObject(innerContainer);
		                    }
		                }));
		            };
		            var getHelpers = function() {
		                return {
		                    state: state,
		                    event: event,
		                    close: close,
		                    focus: focus,
		                    resize: resize,
		                    onError: onError,
		                    updateProps: updateProps,
		                    show: show,
		                    hide: hide
		                };
		            };
		            var setProps = function(newInputProps) {
		                void 0 === newInputProps && (newInputProps = {});
		                var container = currentContainer;
		                var helpers = getHelpers();
		                extend(inputProps, newInputProps);
		                !function(propsDef, existingProps, inputProps, helpers, container) {
		                    var state = helpers.state, close = helpers.close, focus = helpers.focus, event = helpers.event, onError = helpers.onError;
		                    eachProp(inputProps, propsDef, (function(key, propDef, val) {
		                        var valueDetermined = !1;
		                        var value = val;
		                        Object.defineProperty(existingProps, key, {
		                            configurable: !0,
		                            enumerable: !0,
		                            get: function() {
		                                if (valueDetermined) return value;
		                                valueDetermined = !0;
		                                return function() {
		                                    if (!propDef) return value;
		                                    var alias = propDef.alias;
		                                    alias && !isDefined(val) && isDefined(inputProps[alias]) && (value = inputProps[alias]);
		                                    propDef.value && (value = propDef.value({
		                                        props: existingProps,
		                                        state: state,
		                                        close: close,
		                                        focus: focus,
		                                        event: event,
		                                        onError: onError,
		                                        container: container
		                                    }));
		                                    !propDef.default || isDefined(value) || isDefined(inputProps[key]) || (value = propDef.default({
		                                        props: existingProps,
		                                        state: state,
		                                        close: close,
		                                        focus: focus,
		                                        event: event,
		                                        onError: onError,
		                                        container: container
		                                    }));
		                                    if (isDefined(value)) {
		                                        if (propDef.type === PROP_TYPE.ARRAY ? !Array.isArray(value) : typeof value !== propDef.type) throw new TypeError("Prop is not of type " + propDef.type + ": " + key);
		                                    } else if (!1 !== propDef.required && !isDefined(inputProps[key])) throw new Error('Expected prop "' + key + '" to be defined');
		                                    isDefined(value) && propDef.decorate && (value = propDef.decorate({
		                                        value: value,
		                                        props: existingProps,
		                                        state: state,
		                                        close: close,
		                                        focus: focus,
		                                        event: event,
		                                        onError: onError,
		                                        container: container
		                                    }));
		                                    return value;
		                                }();
		                            }
		                        });
		                    }));
		                    eachProp(existingProps, propsDef, src_util_noop);
		                }(propsDef, props, inputProps, helpers, container);
		            };
		            var updateProps = function(newProps) {
		                setProps(newProps);
		                return initPromise.then((function() {
		                    var child = childComponent;
		                    var proxyWin = currentProxyWin;
		                    if (child && proxyWin && currentChildDomain) return getPropsForChild(currentChildDomain).then((function(childProps) {
		                        return child.updateProps(childProps).catch((function(err) {
		                            return checkWindowClose(proxyWin).then((function(closed) {
		                                if (!closed) throw err;
		                            }));
		                        }));
		                    }));
		                }));
		            };
		            var getProxyContainer = function(container) {
		                return getProxyContainerOverride ? getProxyContainerOverride(container) : promise_ZalgoPromise.try((function() {
		                    return elementReady(container);
		                })).then((function(containerElement) {
		                    isShadowElement(containerElement) && (containerElement = function insertShadowSlot(element) {
		                        var shadowHost = function(element) {
		                            var shadowRoot = function(element) {
		                                for (;element.parentNode; ) element = element.parentNode;
		                                if (isShadowElement(element)) return element;
		                            }(element);
		                            if (shadowRoot && shadowRoot.host) return shadowRoot.host;
		                        }(element);
		                        if (!shadowHost) throw new Error("Element is not in shadow dom");
		                        var slotName = "shadow-slot-" + uniqueID();
		                        var slot = document.createElement("slot");
		                        slot.setAttribute("name", slotName);
		                        element.appendChild(slot);
		                        var slotProvider = document.createElement("div");
		                        slotProvider.setAttribute("slot", slotName);
		                        shadowHost.appendChild(slotProvider);
		                        return isShadowElement(shadowHost) ? insertShadowSlot(slotProvider) : slotProvider;
		                    }(containerElement));
		                    currentContainer = containerElement;
		                    return getProxyObject(containerElement);
		                }));
		            };
		            return {
		                init: function() {
		                    !function() {
		                        event.on(EVENT.RENDER, (function() {
		                            return props.onRender();
		                        }));
		                        event.on(EVENT.DISPLAY, (function() {
		                            return props.onDisplay();
		                        }));
		                        event.on(EVENT.RENDERED, (function() {
		                            return props.onRendered();
		                        }));
		                        event.on(EVENT.CLOSE, (function() {
		                            return props.onClose();
		                        }));
		                        event.on(EVENT.DESTROY, (function() {
		                            return props.onDestroy();
		                        }));
		                        event.on(EVENT.RESIZE, (function() {
		                            return props.onResize();
		                        }));
		                        event.on(EVENT.FOCUS, (function() {
		                            return props.onFocus();
		                        }));
		                        event.on(EVENT.PROPS, (function(newProps) {
		                            return props.onProps(newProps);
		                        }));
		                        event.on(EVENT.ERROR, (function(err) {
		                            return props && props.onError ? props.onError(err) : rejectInitPromise(err).then((function() {
		                                setTimeout((function() {
		                                    throw err;
		                                }), 1);
		                            }));
		                        }));
		                        clean.register(event.reset);
		                    }();
		                },
		                render: function(_ref14) {
		                    var target = _ref14.target, container = _ref14.container, context = _ref14.context, rerender = _ref14.rerender;
		                    return promise_ZalgoPromise.try((function() {
		                        var initialChildDomain = getInitialChildDomain();
		                        var childDomainMatch = domainMatch || getInitialChildDomain();
		                        !function(target, childDomainMatch, container) {
		                            if (target !== window$1) {
		                                if (!isSameTopWindow(window$1, target)) throw new Error("Can only renderTo an adjacent frame");
		                                var origin = getDomain();
		                                if (!matchDomain(childDomainMatch, origin) && !isSameDomain(target)) throw new Error("Can not render remotely to " + childDomainMatch.toString() + " - can only render to " + origin);
		                                if (container && "string" != typeof container) throw new Error("Container passed to renderTo must be a string selector, got " + typeof container + " }");
		                            }
		                        }(target, childDomainMatch, container);
		                        var delegatePromise = promise_ZalgoPromise.try((function() {
		                            if (target !== window$1) return function(context, target) {
		                                var delegateProps = {};
		                                for (var _i4 = 0, _Object$keys4 = Object.keys(props); _i4 < _Object$keys4.length; _i4++) {
		                                    var propName = _Object$keys4[_i4];
		                                    var propDef = propsDef[propName];
		                                    propDef && propDef.allowDelegate && (delegateProps[propName] = props[propName]);
		                                }
		                                var childOverridesPromise = send_send(target, "zoid_delegate_" + name, {
		                                    uid: uid,
		                                    overrides: {
		                                        props: delegateProps,
		                                        event: event,
		                                        close: close,
		                                        onError: onError,
		                                        getInternalState: getInternalState,
		                                        setInternalState: setInternalState,
		                                        resolveInitPromise: resolveInitPromise,
		                                        rejectInitPromise: rejectInitPromise
		                                    }
		                                }).then((function(_ref13) {
		                                    var parentComp = _ref13.data.parent;
		                                    clean.register((function(err) {
		                                        if (!isWindowClosed(target)) return parentComp.destroy(err);
		                                    }));
		                                    return parentComp.getDelegateOverrides();
		                                })).catch((function(err) {
		                                    throw new Error("Unable to delegate rendering. Possibly the component is not loaded in the target window.\n\n" + stringifyError(err));
		                                }));
		                                getProxyContainerOverride = function() {
		                                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.getProxyContainer.apply(childOverrides, args);
		                                    }));
		                                };
		                                renderContainerOverride = function() {
		                                    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.renderContainer.apply(childOverrides, args);
		                                    }));
		                                };
		                                showOverride = function() {
		                                    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.show.apply(childOverrides, args);
		                                    }));
		                                };
		                                hideOverride = function() {
		                                    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.hide.apply(childOverrides, args);
		                                    }));
		                                };
		                                watchForUnloadOverride = function() {
		                                    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) args[_key5] = arguments[_key5];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.watchForUnload.apply(childOverrides, args);
		                                    }));
		                                };
		                                if (context === CONTEXT.IFRAME) {
		                                    getProxyWindowOverride = function() {
		                                        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) args[_key6] = arguments[_key6];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.getProxyWindow.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openFrameOverride = function() {
		                                        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) args[_key7] = arguments[_key7];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.openFrame.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openPrerenderFrameOverride = function() {
		                                        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) args[_key8] = arguments[_key8];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.openPrerenderFrame.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    prerenderOverride = function() {
		                                        for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) args[_key9] = arguments[_key9];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.prerender.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openOverride = function() {
		                                        for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) args[_key10] = arguments[_key10];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.open.apply(childOverrides, args);
		                                        }));
		                                    };
		                                    openPrerenderOverride = function() {
		                                        for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) args[_key11] = arguments[_key11];
		                                        return childOverridesPromise.then((function(childOverrides) {
		                                            return childOverrides.openPrerender.apply(childOverrides, args);
		                                        }));
		                                    };
		                                } else context === CONTEXT.POPUP && (setProxyWinOverride = function() {
		                                    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) args[_key12] = arguments[_key12];
		                                    return childOverridesPromise.then((function(childOverrides) {
		                                        return childOverrides.setProxyWin.apply(childOverrides, args);
		                                    }));
		                                });
		                                return childOverridesPromise;
		                            }(context, target);
		                        }));
		                        var windowProp = props.window;
		                        var watchForUnloadPromise = watchForUnload();
		                        var buildBodyPromise = serializeProps(propsDef, props, "post");
		                        var onRenderPromise = event.trigger(EVENT.RENDER);
		                        var getProxyContainerPromise = getProxyContainer(container);
		                        var getProxyWindowPromise = getProxyWindow();
		                        var finalSetPropsPromise = getProxyContainerPromise.then((function() {
		                            return setProps();
		                        }));
		                        var buildUrlPromise = finalSetPropsPromise.then((function() {
		                            return serializeProps(propsDef, props, "get").then((function(query) {
		                                return function(url, options) {
		                                    var query = options.query || {};
		                                    var hash = options.hash || {};
		                                    var originalUrl;
		                                    var originalHash;
		                                    var _url$split = url.split("#");
		                                    originalHash = _url$split[1];
		                                    var _originalUrl$split = (originalUrl = _url$split[0]).split("?");
		                                    originalUrl = _originalUrl$split[0];
		                                    var queryString = extendQuery(_originalUrl$split[1], query);
		                                    var hashString = extendQuery(originalHash, hash);
		                                    queryString && (originalUrl = originalUrl + "?" + queryString);
		                                    hashString && (originalUrl = originalUrl + "#" + hashString);
		                                    return originalUrl;
		                                }(normalizeMockUrl(getUrl()), {
		                                    query: query
		                                });
		                            }));
		                        }));
		                        var buildWindowNamePromise = getProxyWindowPromise.then((function(proxyWin) {
		                            return function(_temp2) {
		                                var _ref6 = void 0 === _temp2 ? {} : _temp2, proxyWin = _ref6.proxyWin, initialChildDomain = _ref6.initialChildDomain, childDomainMatch = _ref6.childDomainMatch, _ref6$target = _ref6.target, target = void 0 === _ref6$target ? window$1 : _ref6$target, context = _ref6.context;
		                                return function(_temp) {
		                                    var _ref5 = void 0 === _temp ? {} : _temp, proxyWin = _ref5.proxyWin, childDomainMatch = _ref5.childDomainMatch, context = _ref5.context;
		                                    return getPropsForChild(_ref5.initialChildDomain).then((function(childProps) {
		                                        return {
		                                            uid: uid,
		                                            context: context,
		                                            tag: tag,
		                                            childDomainMatch: childDomainMatch,
		                                            version: "9_0_86",
		                                            props: childProps,
		                                            exports: (win = proxyWin, {
		                                                init: function(childExports) {
		                                                    return initChild(this.origin, childExports);
		                                                },
		                                                close: close,
		                                                checkClose: function() {
		                                                    return checkWindowClose(win);
		                                                },
		                                                resize: resize,
		                                                onError: onError,
		                                                show: show,
		                                                hide: hide,
		                                                export: xport
		                                            })
		                                        };
		                                        var win;
		                                    }));
		                                }({
		                                    proxyWin: proxyWin,
		                                    initialChildDomain: initialChildDomain,
		                                    childDomainMatch: childDomainMatch,
		                                    context: context
		                                }).then((function(childPayload) {
		                                    var _crossDomainSerialize = crossDomainSerialize({
		                                        data: childPayload,
		                                        metaData: {
		                                            windowRef: getWindowRef(target, initialChildDomain, context, proxyWin)
		                                        },
		                                        sender: {
		                                            domain: getDomain(window$1)
		                                        },
		                                        receiver: {
		                                            win: proxyWin,
		                                            domain: childDomainMatch
		                                        },
		                                        passByReference: initialChildDomain === getDomain()
		                                    }), serializedData = _crossDomainSerialize.serializedData;
		                                    clean.register(_crossDomainSerialize.cleanReference);
		                                    return serializedData;
		                                }));
		                            }({
		                                proxyWin: (_ref7 = {
		                                    proxyWin: proxyWin,
		                                    initialChildDomain: initialChildDomain,
		                                    childDomainMatch: childDomainMatch,
		                                    target: target,
		                                    context: context
		                                }).proxyWin,
		                                initialChildDomain: _ref7.initialChildDomain,
		                                childDomainMatch: _ref7.childDomainMatch,
		                                target: _ref7.target,
		                                context: _ref7.context
		                            }).then((function(serializedPayload) {
		                                return buildChildWindowName({
		                                    name: name,
		                                    serializedPayload: serializedPayload
		                                });
		                            }));
		                            var _ref7;
		                        }));
		                        var openFramePromise = buildWindowNamePromise.then((function(windowName) {
		                            return openFrame(context, {
		                                windowName: windowName
		                            });
		                        }));
		                        var openPrerenderFramePromise = openPrerenderFrame(context);
		                        var renderContainerPromise = promise_ZalgoPromise.hash({
		                            proxyContainer: getProxyContainerPromise,
		                            proxyFrame: openFramePromise,
		                            proxyPrerenderFrame: openPrerenderFramePromise
		                        }).then((function(_ref15) {
		                            return renderContainer(_ref15.proxyContainer, {
		                                context: context,
		                                proxyFrame: _ref15.proxyFrame,
		                                proxyPrerenderFrame: _ref15.proxyPrerenderFrame,
		                                rerender: rerender
		                            });
		                        })).then((function(proxyContainer) {
		                            return proxyContainer;
		                        }));
		                        var openPromise = promise_ZalgoPromise.hash({
		                            windowName: buildWindowNamePromise,
		                            proxyFrame: openFramePromise,
		                            proxyWin: getProxyWindowPromise
		                        }).then((function(_ref16) {
		                            var proxyWin = _ref16.proxyWin;
		                            return windowProp ? proxyWin : open(context, {
		                                windowName: _ref16.windowName,
		                                proxyWin: proxyWin,
		                                proxyFrame: _ref16.proxyFrame
		                            });
		                        }));
		                        var openPrerenderPromise = promise_ZalgoPromise.hash({
		                            proxyWin: openPromise,
		                            proxyPrerenderFrame: openPrerenderFramePromise
		                        }).then((function(_ref17) {
		                            return openPrerender(context, _ref17.proxyWin, _ref17.proxyPrerenderFrame);
		                        }));
		                        var setStatePromise = openPromise.then((function(proxyWin) {
		                            currentProxyWin = proxyWin;
		                            return setProxyWin(proxyWin);
		                        }));
		                        var prerenderPromise = promise_ZalgoPromise.hash({
		                            proxyPrerenderWin: openPrerenderPromise,
		                            state: setStatePromise
		                        }).then((function(_ref18) {
		                            return prerender(_ref18.proxyPrerenderWin, {
		                                context: context
		                            });
		                        }));
		                        var setWindowNamePromise = promise_ZalgoPromise.hash({
		                            proxyWin: openPromise,
		                            windowName: buildWindowNamePromise
		                        }).then((function(_ref19) {
		                            if (windowProp) return _ref19.proxyWin.setName(_ref19.windowName);
		                        }));
		                        var getMethodPromise = promise_ZalgoPromise.hash({
		                            body: buildBodyPromise
		                        }).then((function(_ref20) {
		                            return options.method ? options.method : Object.keys(_ref20.body).length ? "post" : "get";
		                        }));
		                        var loadUrlPromise = promise_ZalgoPromise.hash({
		                            proxyWin: openPromise,
		                            windowUrl: buildUrlPromise,
		                            body: buildBodyPromise,
		                            method: getMethodPromise,
		                            windowName: setWindowNamePromise,
		                            prerender: prerenderPromise
		                        }).then((function(_ref21) {
		                            return _ref21.proxyWin.setLocation(_ref21.windowUrl, {
		                                method: _ref21.method,
		                                body: _ref21.body
		                            });
		                        }));
		                        var watchForClosePromise = openPromise.then((function(proxyWin) {
		                            !function watchForClose(proxyWin, context) {
		                                var cancelled = !1;
		                                clean.register((function() {
		                                    cancelled = !0;
		                                }));
		                                return promise_ZalgoPromise.delay(2e3).then((function() {
		                                    return proxyWin.isClosed();
		                                })).then((function(isClosed) {
		                                    if (!cancelled) return isClosed ? close(new Error("Detected " + context + " close")) : watchForClose(proxyWin, context);
		                                }));
		                            }(proxyWin, context);
		                        }));
		                        var onDisplayPromise = promise_ZalgoPromise.hash({
		                            container: renderContainerPromise,
		                            prerender: prerenderPromise
		                        }).then((function() {
		                            return event.trigger(EVENT.DISPLAY);
		                        }));
		                        var openBridgePromise = openPromise.then((function(proxyWin) {
		                            return function(proxyWin, initialChildDomain, context) {
		                                return promise_ZalgoPromise.try((function() {
		                                    return proxyWin.awaitWindow();
		                                })).then((function(win) {
		                                    if (src_bridge && src_bridge.needsBridge({
		                                        win: win,
		                                        domain: initialChildDomain
		                                    }) && !src_bridge.hasBridge(initialChildDomain, initialChildDomain)) {
		                                        var bridgeUrl = "function" == typeof options.bridgeUrl ? options.bridgeUrl({
		                                            props: props
		                                        }) : options.bridgeUrl;
		                                        if (!bridgeUrl) throw new Error("Bridge needed to render " + context);
		                                        var bridgeDomain = getDomainFromUrl(bridgeUrl);
		                                        src_bridge.linkUrl(win, initialChildDomain);
		                                        return src_bridge.openBridge(normalizeMockUrl(bridgeUrl), bridgeDomain);
		                                    }
		                                }));
		                            }(proxyWin, initialChildDomain, context);
		                        }));
		                        var runTimeoutPromise = loadUrlPromise.then((function() {
		                            return promise_ZalgoPromise.try((function() {
		                                var timeout = props.timeout;
		                                if (timeout) return initPromise.timeout(timeout, new Error("Loading component timed out after " + timeout + " milliseconds"));
		                            }));
		                        }));
		                        var onRenderedPromise = initPromise.then((function() {
		                            return event.trigger(EVENT.RENDERED);
		                        }));
		                        return promise_ZalgoPromise.hash({
		                            initPromise: initPromise,
		                            buildUrlPromise: buildUrlPromise,
		                            onRenderPromise: onRenderPromise,
		                            getProxyContainerPromise: getProxyContainerPromise,
		                            openFramePromise: openFramePromise,
		                            openPrerenderFramePromise: openPrerenderFramePromise,
		                            renderContainerPromise: renderContainerPromise,
		                            openPromise: openPromise,
		                            openPrerenderPromise: openPrerenderPromise,
		                            setStatePromise: setStatePromise,
		                            prerenderPromise: prerenderPromise,
		                            loadUrlPromise: loadUrlPromise,
		                            buildWindowNamePromise: buildWindowNamePromise,
		                            setWindowNamePromise: setWindowNamePromise,
		                            watchForClosePromise: watchForClosePromise,
		                            onDisplayPromise: onDisplayPromise,
		                            openBridgePromise: openBridgePromise,
		                            runTimeoutPromise: runTimeoutPromise,
		                            onRenderedPromise: onRenderedPromise,
		                            delegatePromise: delegatePromise,
		                            watchForUnloadPromise: watchForUnloadPromise,
		                            finalSetPropsPromise: finalSetPropsPromise
		                        });
		                    })).catch((function(err) {
		                        return promise_ZalgoPromise.all([ onError(err), destroy(err) ]).then((function() {
		                            throw err;
		                        }), (function() {
		                            throw err;
		                        }));
		                    })).then(src_util_noop);
		                },
		                destroy: destroy,
		                getProps: function() {
		                    return props;
		                },
		                setProps: setProps,
		                export: xport,
		                getHelpers: getHelpers,
		                getDelegateOverrides: function() {
		                    return promise_ZalgoPromise.try((function() {
		                        return {
		                            getProxyContainer: getProxyContainer,
		                            show: show,
		                            hide: hide,
		                            renderContainer: renderContainer,
		                            getProxyWindow: getProxyWindow,
		                            watchForUnload: watchForUnload,
		                            openFrame: openFrame,
		                            openPrerenderFrame: openPrerenderFrame,
		                            prerender: prerender,
		                            open: open,
		                            openPrerender: openPrerender,
		                            setProxyWin: setProxyWin
		                        };
		                    }));
		                },
		                getExports: function() {
		                    return xports({
		                        getExports: function() {
		                            return exportsPromise;
		                        }
		                    });
		                }
		            };
		        }
		        function defaultContainerTemplate(_ref) {
		            var uid = _ref.uid, frame = _ref.frame, prerenderFrame = _ref.prerenderFrame, doc = _ref.doc, props = _ref.props, event = _ref.event, dimensions = _ref.dimensions;
		            var width = dimensions.width, height = dimensions.height;
		            if (frame && prerenderFrame) {
		                var div = doc.createElement("div");
		                div.setAttribute("id", uid);
		                var style = doc.createElement("style");
		                props.cspNonce && style.setAttribute("nonce", props.cspNonce);
		                style.appendChild(doc.createTextNode("\n            #" + uid + " {\n                display: inline-block;\n                position: relative;\n                width: " + width + ";\n                height: " + height + ";\n            }\n\n            #" + uid + " > iframe {\n                display: inline-block;\n                position: absolute;\n                width: 100%;\n                height: 100%;\n                top: 0;\n                left: 0;\n                transition: opacity .2s ease-in-out;\n            }\n\n            #" + uid + " > iframe.zoid-invisible {\n                opacity: 0;\n            }\n\n            #" + uid + " > iframe.zoid-visible {\n                opacity: 1;\n        }\n        "));
		                div.appendChild(frame);
		                div.appendChild(prerenderFrame);
		                div.appendChild(style);
		                prerenderFrame.classList.add("zoid-visible");
		                frame.classList.add("zoid-invisible");
		                event.on(EVENT.RENDERED, (function() {
		                    prerenderFrame.classList.remove("zoid-visible");
		                    prerenderFrame.classList.add("zoid-invisible");
		                    frame.classList.remove("zoid-invisible");
		                    frame.classList.add("zoid-visible");
		                    setTimeout((function() {
		                        destroyElement(prerenderFrame);
		                    }), 1);
		                }));
		                event.on(EVENT.RESIZE, (function(_ref2) {
		                    var newWidth = _ref2.width, newHeight = _ref2.height;
		                    "number" == typeof newWidth && (div.style.width = toCSS(newWidth));
		                    "number" == typeof newHeight && (div.style.height = toCSS(newHeight));
		                }));
		                return div;
		            }
		        }
		        function defaultPrerenderTemplate(_ref) {
		            var doc = _ref.doc, props = _ref.props;
		            var html = doc.createElement("html");
		            var body = doc.createElement("body");
		            var style = doc.createElement("style");
		            var spinner = doc.createElement("div");
		            spinner.classList.add("spinner");
		            props.cspNonce && style.setAttribute("nonce", props.cspNonce);
		            html.appendChild(body);
		            body.appendChild(spinner);
		            body.appendChild(style);
		            style.appendChild(doc.createTextNode("\n            html, body {\n                width: 100%;\n                height: 100%;\n            }\n\n            .spinner {\n                position: fixed;\n                max-height: 60vmin;\n                max-width: 60vmin;\n                height: 40px;\n                width: 40px;\n                top: 50%;\n                left: 50%;\n                box-sizing: border-box;\n                border: 3px solid rgba(0, 0, 0, .2);\n                border-top-color: rgba(33, 128, 192, 0.8);\n                border-radius: 100%;\n                animation: rotation .7s infinite linear;\n            }\n\n            @keyframes rotation {\n                from {\n                    transform: translateX(-50%) translateY(-50%) rotate(0deg);\n                }\n                to {\n                    transform: translateX(-50%) translateY(-50%) rotate(359deg);\n                }\n            }\n        "));
		            return html;
		        }
		        var cleanInstances = cleanup();
		        var cleanZoid = cleanup();
		        function component(opts) {
		            var options = function(options) {
		                var tag = options.tag, url = options.url, domain = options.domain, bridgeUrl = options.bridgeUrl, _options$props = options.props, props = void 0 === _options$props ? {} : _options$props, _options$dimensions = options.dimensions, dimensions = void 0 === _options$dimensions ? {} : _options$dimensions, _options$autoResize = options.autoResize, autoResize = void 0 === _options$autoResize ? {} : _options$autoResize, _options$allowedParen = options.allowedParentDomains, allowedParentDomains = void 0 === _options$allowedParen ? "*" : _options$allowedParen, _options$attributes = options.attributes, attributes = void 0 === _options$attributes ? {} : _options$attributes, _options$defaultConte = options.defaultContext, defaultContext = void 0 === _options$defaultConte ? CONTEXT.IFRAME : _options$defaultConte, _options$containerTem = options.containerTemplate, containerTemplate = void 0 === _options$containerTem ? defaultContainerTemplate : _options$containerTem, _options$prerenderTem = options.prerenderTemplate, prerenderTemplate = void 0 === _options$prerenderTem ? defaultPrerenderTemplate : _options$prerenderTem, validate = options.validate, _options$eligible = options.eligible, eligible = void 0 === _options$eligible ? function() {
		                    return {
		                        eligible: !0
		                    };
		                } : _options$eligible, _options$logger = options.logger, logger = void 0 === _options$logger ? {
		                    info: src_util_noop
		                } : _options$logger, _options$exports = options.exports, xportsDefinition = void 0 === _options$exports ? src_util_noop : _options$exports, method = options.method, _options$children = options.children, children = void 0 === _options$children ? function() {
		                    return {};
		                } : _options$children;
		                var name = tag.replace(/-/g, "_");
		                var propsDef = _extends({}, {
		                    window: {
		                        type: PROP_TYPE.OBJECT,
		                        sendToChild: !1,
		                        required: !1,
		                        allowDelegate: !0,
		                        validate: function(_ref2) {
		                            var value = _ref2.value;
		                            if (!isWindow(value) && !window_ProxyWindow.isProxyWindow(value)) throw new Error("Expected Window or ProxyWindow");
		                            if (isWindow(value)) {
		                                if (isWindowClosed(value)) throw new Error("Window is closed");
		                                if (!isSameDomain(value)) throw new Error("Window is not same domain");
		                            }
		                        },
		                        decorate: function(_ref3) {
		                            return setup_toProxyWindow(_ref3.value);
		                        }
		                    },
		                    timeout: {
		                        type: PROP_TYPE.NUMBER,
		                        required: !1,
		                        sendToChild: !1
		                    },
		                    cspNonce: {
		                        type: PROP_TYPE.STRING,
		                        required: !1
		                    },
		                    onDisplay: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onRendered: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onRender: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onClose: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onDestroy: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop,
		                        decorate: props_decorateOnce
		                    },
		                    onResize: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop
		                    },
		                    onFocus: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        allowDelegate: !0,
		                        default: props_defaultNoop
		                    },
		                    close: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref4) {
		                            return _ref4.close;
		                        }
		                    },
		                    focus: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref5) {
		                            return _ref5.focus;
		                        }
		                    },
		                    resize: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref6) {
		                            return _ref6.resize;
		                        }
		                    },
		                    uid: {
		                        type: PROP_TYPE.STRING,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref7) {
		                            return _ref7.uid;
		                        }
		                    },
		                    tag: {
		                        type: PROP_TYPE.STRING,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref8) {
		                            return _ref8.tag;
		                        }
		                    },
		                    getParent: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref9) {
		                            return _ref9.getParent;
		                        }
		                    },
		                    getParentDomain: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref10) {
		                            return _ref10.getParentDomain;
		                        }
		                    },
		                    show: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref11) {
		                            return _ref11.show;
		                        }
		                    },
		                    hide: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref12) {
		                            return _ref12.hide;
		                        }
		                    },
		                    export: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref13) {
		                            return _ref13.export;
		                        }
		                    },
		                    onError: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref14) {
		                            return _ref14.onError;
		                        }
		                    },
		                    onProps: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref15) {
		                            return _ref15.onProps;
		                        }
		                    },
		                    getSiblings: {
		                        type: PROP_TYPE.FUNCTION,
		                        required: !1,
		                        sendToChild: !1,
		                        childDecorate: function(_ref16) {
		                            return _ref16.getSiblings;
		                        }
		                    }
		                }, props);
		                if (!containerTemplate) throw new Error("Container template required");
		                return {
		                    name: name,
		                    tag: tag,
		                    url: url,
		                    domain: domain,
		                    bridgeUrl: bridgeUrl,
		                    method: method,
		                    propsDef: propsDef,
		                    dimensions: dimensions,
		                    autoResize: autoResize,
		                    allowedParentDomains: allowedParentDomains,
		                    attributes: attributes,
		                    defaultContext: defaultContext,
		                    containerTemplate: containerTemplate,
		                    prerenderTemplate: prerenderTemplate,
		                    validate: validate,
		                    logger: logger,
		                    eligible: eligible,
		                    children: children,
		                    exports: "function" == typeof xportsDefinition ? xportsDefinition : function(_ref) {
		                        var getExports = _ref.getExports;
		                        var result = {};
		                        var _loop = function(_i2, _Object$keys2) {
		                            var key = _Object$keys2[_i2];
		                            var type = xportsDefinition[key].type;
		                            var valuePromise = getExports().then((function(res) {
		                                return res[key];
		                            }));
		                            result[key] = type === PROP_TYPE.FUNCTION ? function() {
		                                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		                                return valuePromise.then((function(value) {
		                                    return value.apply(void 0, args);
		                                }));
		                            } : valuePromise;
		                        };
		                        for (var _i2 = 0, _Object$keys2 = Object.keys(xportsDefinition); _i2 < _Object$keys2.length; _i2++) _loop(_i2, _Object$keys2);
		                        return result;
		                    }
		                };
		            }(opts);
		            var name = options.name, tag = options.tag, defaultContext = options.defaultContext, eligible = options.eligible, children = options.children;
		            var global = lib_global_getGlobal(window$1);
		            var instances = [];
		            var isChild = function() {
		                if (function(name) {
		                    try {
		                        return parseWindowName(window$1.name).name === name;
		                    } catch (err) {}
		                    return !1;
		                }(name)) {
		                    var _payload = getInitialParentPayload().payload;
		                    if (_payload.tag === tag && matchDomain(_payload.childDomainMatch, getDomain())) return !0;
		                }
		                return !1;
		            };
		            var registerChild = memoize((function() {
		                if (isChild()) {
		                    if (window$1.xprops) {
		                        delete global.components[tag];
		                        throw new Error("Can not register " + name + " as child - child already registered");
		                    }
		                    var child = function(options) {
		                        var tag = options.tag, propsDef = options.propsDef, autoResize = options.autoResize, allowedParentDomains = options.allowedParentDomains;
		                        var onPropHandlers = [];
		                        var _getInitialParentPayl = getInitialParentPayload(), parent = _getInitialParentPayl.parent, payload = _getInitialParentPayl.payload;
		                        var parentComponentWindow = parent.win, parentDomain = parent.domain;
		                        var props;
		                        var exportsPromise = new promise_ZalgoPromise;
		                        var version = payload.version, uid = payload.uid, parentExports = payload.exports, context = payload.context, initialProps = payload.props;
		                        if ("9_0_86" !== version) throw new Error("Parent window has zoid version " + version + ", child window has version 9_0_86");
		                        var show = parentExports.show, hide = parentExports.hide, close = parentExports.close, onError = parentExports.onError, checkClose = parentExports.checkClose, parentExport = parentExports.export, parentResize = parentExports.resize, parentInit = parentExports.init;
		                        var getParent = function() {
		                            return parentComponentWindow;
		                        };
		                        var getParentDomain = function() {
		                            return parentDomain;
		                        };
		                        var onProps = function(handler) {
		                            onPropHandlers.push(handler);
		                            return {
		                                cancel: function() {
		                                    onPropHandlers.splice(onPropHandlers.indexOf(handler), 1);
		                                }
		                            };
		                        };
		                        var resize = function(_ref) {
		                            return parentResize.fireAndForget({
		                                width: _ref.width,
		                                height: _ref.height
		                            });
		                        };
		                        var xport = function(xports) {
		                            exportsPromise.resolve(xports);
		                            return parentExport(xports);
		                        };
		                        var getSiblings = function(_temp) {
		                            var anyParent = (void 0 === _temp ? {} : _temp).anyParent;
		                            var result = [];
		                            var currentParent = props.parent;
		                            void 0 === anyParent && (anyParent = !currentParent);
		                            if (!anyParent && !currentParent) throw new Error("No parent found for " + tag + " child");
		                            for (var _i2 = 0, _getAllFramesInWindow2 = getAllFramesInWindow(window$1); _i2 < _getAllFramesInWindow2.length; _i2++) {
		                                var win = _getAllFramesInWindow2[_i2];
		                                if (isSameDomain(win)) {
		                                    var xprops = assertSameDomain(win).xprops;
		                                    if (xprops && getParent() === xprops.getParent()) {
		                                        var winParent = xprops.parent;
		                                        if (anyParent || !currentParent || winParent && winParent.uid === currentParent.uid) {
		                                            var xports = tryGlobal(win, (function(global) {
		                                                return global.exports;
		                                            }));
		                                            result.push({
		                                                props: xprops,
		                                                exports: xports
		                                            });
		                                        }
		                                    }
		                                }
		                            }
		                            return result;
		                        };
		                        var setProps = function(newProps, origin, isUpdate) {
		                            void 0 === isUpdate && (isUpdate = !1);
		                            var normalizedProps = function(parentComponentWindow, propsDef, props, origin, helpers, isUpdate) {
		                                void 0 === isUpdate && (isUpdate = !1);
		                                var result = {};
		                                for (var _i2 = 0, _Object$keys2 = Object.keys(props); _i2 < _Object$keys2.length; _i2++) {
		                                    var key = _Object$keys2[_i2];
		                                    var prop = propsDef[key];
		                                    if (!prop || !prop.sameDomain || origin === getDomain(window$1) && isSameDomain(parentComponentWindow)) {
		                                        var value = normalizeChildProp(propsDef, 0, key, props[key], helpers);
		                                        result[key] = value;
		                                        prop && prop.alias && !result[prop.alias] && (result[prop.alias] = value);
		                                    }
		                                }
		                                if (!isUpdate) for (var _i4 = 0, _Object$keys4 = Object.keys(propsDef); _i4 < _Object$keys4.length; _i4++) {
		                                    var _key = _Object$keys4[_i4];
		                                    props.hasOwnProperty(_key) || (result[_key] = normalizeChildProp(propsDef, 0, _key, void 0, helpers));
		                                }
		                                return result;
		                            }(parentComponentWindow, propsDef, newProps, origin, {
		                                tag: tag,
		                                show: show,
		                                hide: hide,
		                                close: close,
		                                focus: child_focus,
		                                onError: onError,
		                                resize: resize,
		                                getSiblings: getSiblings,
		                                onProps: onProps,
		                                getParent: getParent,
		                                getParentDomain: getParentDomain,
		                                uid: uid,
		                                export: xport
		                            }, isUpdate);
		                            props ? extend(props, normalizedProps) : props = normalizedProps;
		                            for (var _i4 = 0; _i4 < onPropHandlers.length; _i4++) (0, onPropHandlers[_i4])(props);
		                        };
		                        var updateProps = function(newProps) {
		                            return promise_ZalgoPromise.try((function() {
		                                return setProps(newProps, parentDomain, !0);
		                            }));
		                        };
		                        return {
		                            init: function() {
		                                return promise_ZalgoPromise.try((function() {
		                                    isSameDomain(parentComponentWindow) && function(_ref3) {
		                                        var componentName = _ref3.componentName, parentComponentWindow = _ref3.parentComponentWindow;
		                                        var _crossDomainDeseriali2 = crossDomainDeserialize({
		                                            data: parseWindowName(window$1.name).serializedInitialPayload,
		                                            sender: {
		                                                win: parentComponentWindow
		                                            },
		                                            basic: !0
		                                        }), sender = _crossDomainDeseriali2.sender;
		                                        if ("uid" === _crossDomainDeseriali2.reference.type || "global" === _crossDomainDeseriali2.metaData.windowRef.type) {
		                                            var _crossDomainSerialize = crossDomainSerialize({
		                                                data: _crossDomainDeseriali2.data,
		                                                metaData: {
		                                                    windowRef: window_getWindowRef(parentComponentWindow)
		                                                },
		                                                sender: {
		                                                    domain: sender.domain
		                                                },
		                                                receiver: {
		                                                    win: window$1,
		                                                    domain: getDomain()
		                                                },
		                                                basic: !0
		                                            });
		                                            window$1.name = buildChildWindowName({
		                                                name: componentName,
		                                                serializedPayload: _crossDomainSerialize.serializedData
		                                            });
		                                        }
		                                    }({
		                                        componentName: options.name,
		                                        parentComponentWindow: parentComponentWindow
		                                    });
		                                    lib_global_getGlobal(window$1).exports = options.exports({
		                                        getExports: function() {
		                                            return exportsPromise;
		                                        }
		                                    });
		                                    !function(allowedParentDomains, domain) {
		                                        if (!matchDomain(allowedParentDomains, domain)) throw new Error("Can not be rendered by domain: " + domain);
		                                    }(allowedParentDomains, parentDomain);
		                                    markWindowKnown(parentComponentWindow);
		                                    !function() {
		                                        window$1.addEventListener("beforeunload", (function() {
		                                            checkClose.fireAndForget();
		                                        }));
		                                        window$1.addEventListener("unload", (function() {
		                                            checkClose.fireAndForget();
		                                        }));
		                                        onCloseWindow(parentComponentWindow, (function() {
		                                            child_destroy();
		                                        }));
		                                    }();
		                                    return parentInit({
		                                        updateProps: updateProps,
		                                        close: child_destroy
		                                    });
		                                })).then((function() {
		                                    return (_autoResize$width = autoResize.width, width = void 0 !== _autoResize$width && _autoResize$width, 
		                                    _autoResize$height = autoResize.height, height = void 0 !== _autoResize$height && _autoResize$height, 
		                                    _autoResize$element = autoResize.element, elementReady(void 0 === _autoResize$element ? "body" : _autoResize$element).catch(src_util_noop).then((function(element) {
		                                        return {
		                                            width: width,
		                                            height: height,
		                                            element: element
		                                        };
		                                    }))).then((function(_ref3) {
		                                        var width = _ref3.width, height = _ref3.height, element = _ref3.element;
		                                        element && (width || height) && context !== CONTEXT.POPUP && onResize(element, (function(_ref4) {
		                                            resize({
		                                                width: width ? _ref4.width : void 0,
		                                                height: height ? _ref4.height : void 0
		                                            });
		                                        }), {
		                                            width: width,
		                                            height: height
		                                        });
		                                    }));
		                                    var _autoResize$width, width, _autoResize$height, height, _autoResize$element;
		                                })).catch((function(err) {
		                                    onError(err);
		                                }));
		                            },
		                            getProps: function() {
		                                if (props) return props;
		                                setProps(initialProps, parentDomain);
		                                return props;
		                            }
		                        };
		                    }(options);
		                    child.init();
		                    return child;
		                }
		            }));
		            registerChild();
		            !function() {
		                var allowDelegateListener = on_on("zoid_allow_delegate_" + name, (function() {
		                    return !0;
		                }));
		                var delegateListener = on_on("zoid_delegate_" + name, (function(_ref2) {
		                    var _ref2$data = _ref2.data;
		                    return {
		                        parent: parentComponent({
		                            uid: _ref2$data.uid,
		                            options: options,
		                            overrides: _ref2$data.overrides,
		                            parentWin: _ref2.source
		                        })
		                    };
		                }));
		                cleanZoid.register(allowDelegateListener.cancel);
		                cleanZoid.register(delegateListener.cancel);
		            }();
		            global.components = global.components || {};
		            if (global.components[tag]) throw new Error("Can not register multiple components with the same tag: " + tag);
		            global.components[tag] = !0;
		            return {
		                init: function init(inputProps) {
		                    var instance;
		                    var uid = "zoid-" + tag + "-" + uniqueID();
		                    var props = inputProps || {};
		                    var _eligible = eligible({
		                        props: props
		                    }), eligibility = _eligible.eligible, reason = _eligible.reason;
		                    var onDestroy = props.onDestroy;
		                    props.onDestroy = function() {
		                        instance && eligibility && instances.splice(instances.indexOf(instance), 1);
		                        if (onDestroy) return onDestroy.apply(void 0, arguments);
		                    };
		                    var parent = parentComponent({
		                        uid: uid,
		                        options: options
		                    });
		                    parent.init();
		                    eligibility ? parent.setProps(props) : props.onDestroy && props.onDestroy();
		                    cleanInstances.register((function(err) {
		                        return parent.destroy(err || new Error("zoid destroyed all components"));
		                    }));
		                    var clone = function(_temp) {
		                        var _ref4$decorate = (void 0 === _temp ? {} : _temp).decorate;
		                        return init((void 0 === _ref4$decorate ? identity : _ref4$decorate)(props));
		                    };
		                    var _render = function(target, container, context) {
		                        return promise_ZalgoPromise.try((function() {
		                            if (!eligibility) {
		                                var err = new Error(reason || name + " component is not eligible");
		                                return parent.destroy(err).then((function() {
		                                    throw err;
		                                }));
		                            }
		                            if (!isWindow(target)) throw new Error("Must pass window to renderTo");
		                            return function(props, context) {
		                                return promise_ZalgoPromise.try((function() {
		                                    if (props.window) return setup_toProxyWindow(props.window).getType();
		                                    if (context) {
		                                        if (context !== CONTEXT.IFRAME && context !== CONTEXT.POPUP) throw new Error("Unrecognized context: " + context);
		                                        return context;
		                                    }
		                                    return defaultContext;
		                                }));
		                            }(props, context);
		                        })).then((function(finalContext) {
		                            container = function(context, container) {
		                                if (container) {
		                                    if ("string" != typeof container && !isElement(container)) throw new TypeError("Expected string or element selector to be passed");
		                                    return container;
		                                }
		                                if (context === CONTEXT.POPUP) return "body";
		                                throw new Error("Expected element to be passed to render iframe");
		                            }(finalContext, container);
		                            if (target !== window$1 && "string" != typeof container) throw new Error("Must pass string element when rendering to another window");
		                            return parent.render({
		                                target: target,
		                                container: container,
		                                context: finalContext,
		                                rerender: function() {
		                                    var newInstance = clone();
		                                    extend(instance, newInstance);
		                                    return newInstance.renderTo(target, container, context);
		                                }
		                            });
		                        })).catch((function(err) {
		                            return parent.destroy(err).then((function() {
		                                throw err;
		                            }));
		                        }));
		                    };
		                    instance = _extends({}, parent.getExports(), parent.getHelpers(), function() {
		                        var childComponents = children();
		                        var result = {};
		                        var _loop2 = function(_i4, _Object$keys4) {
		                            var childName = _Object$keys4[_i4];
		                            var Child = childComponents[childName];
		                            result[childName] = function(childInputProps) {
		                                var parentProps = parent.getProps();
		                                var childProps = _extends({}, childInputProps, {
		                                    parent: {
		                                        uid: uid,
		                                        props: parentProps,
		                                        export: parent.export
		                                    }
		                                });
		                                return Child(childProps);
		                            };
		                        };
		                        for (var _i4 = 0, _Object$keys4 = Object.keys(childComponents); _i4 < _Object$keys4.length; _i4++) _loop2(_i4, _Object$keys4);
		                        return result;
		                    }(), {
		                        isEligible: function() {
		                            return eligibility;
		                        },
		                        clone: clone,
		                        render: function(container, context) {
		                            return _render(window$1, container, context);
		                        },
		                        renderTo: function(target, container, context) {
		                            return _render(target, container, context);
		                        }
		                    });
		                    eligibility && instances.push(instance);
		                    return instance;
		                },
		                instances: instances,
		                driver: function(driverName, dep) {
		                    throw new Error("Driver support not enabled");
		                },
		                isChild: isChild,
		                canRenderTo: function(win) {
		                    return send_send(win, "zoid_allow_delegate_" + name).then((function(_ref3) {
		                        return _ref3.data;
		                    })).catch((function() {
		                        return !1;
		                    }));
		                },
		                registerChild: registerChild
		            };
		        }
		        var component_create = function(options) {
		            !function() {
		                if (!global_getGlobal().initialized) {
		                    global_getGlobal().initialized = !0;
		                    on = (_ref3 = {
		                        on: on_on,
		                        send: send_send
		                    }).on, send = _ref3.send, (global = global_getGlobal()).receiveMessage = global.receiveMessage || function(message) {
		                        return receive_receiveMessage(message, {
		                            on: on,
		                            send: send
		                        });
		                    };
		                    !function(_ref5) {
		                        var on = _ref5.on, send = _ref5.send;
		                        globalStore().getOrSet("postMessageListener", (function() {
		                            return addEventListener(window$1, "message", (function(event) {
		                                !function(event, _ref4) {
		                                    var on = _ref4.on, send = _ref4.send;
		                                    promise_ZalgoPromise.try((function() {
		                                        var source = event.source || event.sourceElement;
		                                        var origin = event.origin || event.originalEvent && event.originalEvent.origin;
		                                        var data = event.data;
		                                        "null" === origin && (origin = "file://");
		                                        if (source) {
		                                            if (!origin) throw new Error("Post message did not have origin domain");
		                                            receive_receiveMessage({
		                                                source: source,
		                                                origin: origin,
		                                                data: data
		                                            }, {
		                                                on: on,
		                                                send: send
		                                            });
		                                        }
		                                    }));
		                                }(event, {
		                                    on: on,
		                                    send: send
		                                });
		                            }));
		                        }));
		                    }({
		                        on: on_on,
		                        send: send_send
		                    });
		                    setupBridge({
		                        on: on_on,
		                        send: send_send,
		                        receiveMessage: receive_receiveMessage
		                    });
		                    !function(_ref8) {
		                        var on = _ref8.on, send = _ref8.send;
		                        globalStore("builtinListeners").getOrSet("helloListener", (function() {
		                            var listener = on("postrobot_hello", {
		                                domain: "*"
		                            }, (function(_ref3) {
		                                resolveHelloPromise(_ref3.source, {
		                                    domain: _ref3.origin
		                                });
		                                return {
		                                    instanceID: getInstanceID()
		                                };
		                            }));
		                            var parent = getAncestor();
		                            parent && sayHello(parent, {
		                                send: send
		                            }).catch((function(err) {}));
		                            return listener;
		                        }));
		                    }({
		                        on: on_on,
		                        send: send_send
		                    });
		                }
		                var _ref3, on, send, global;
		            }();
		            var comp = component(options);
		            var init = function(props) {
		                return comp.init(props);
		            };
		            init.driver = function(name, dep) {
		                return comp.driver(name, dep);
		            };
		            init.isChild = function() {
		                return comp.isChild();
		            };
		            init.canRenderTo = function(win) {
		                return comp.canRenderTo(win);
		            };
		            init.instances = comp.instances;
		            var child = comp.registerChild();
		            child && (window$1.xprops = init.xprops = child.getProps());
		            return init;
		        };
		        function destroyComponents(err) {
		            src_bridge && src_bridge.destroyBridges();
		            var destroyPromise = cleanInstances.all(err);
		            cleanInstances = cleanup();
		            return destroyPromise;
		        }
		        var destroyAll = destroyComponents;
		        function component_destroy(err) {
		            destroyAll();
		            delete window$1.__zoid_9_0_86__;
		            !function() {
		                !function() {
		                    var responseListeners = globalStore("responseListeners");
		                    for (var _i2 = 0, _responseListeners$ke2 = responseListeners.keys(); _i2 < _responseListeners$ke2.length; _i2++) {
		                        var hash = _responseListeners$ke2[_i2];
		                        var listener = responseListeners.get(hash);
		                        listener && (listener.cancelled = !0);
		                        responseListeners.del(hash);
		                    }
		                }();
		                (listener = globalStore().get("postMessageListener")) && listener.cancel();
		                var listener;
		                delete window$1.__post_robot_10_0_44__;
		            }();
		            return cleanZoid.all(err);
		        }
		    } ]);
		})); 
	} (zoid$1));
	return zoid$1.exports;
}

(function (module) {
	/* eslint import/no-commonjs: 0 */

	// eslint-disable-next-line no-process-env
	if (process && process.env && process.env.ZOID_FRAME_ONLY) {
	    // $FlowFixMe
	    module.exports = requireZoid_frame();
	    // $FlowFixMe
	    module.exports.default = module.exports;
	} else {
	    // $FlowFixMe
	    module.exports = requireZoid();
	    // $FlowFixMe
	    module.exports.default = module.exports;
	} 
} (zoid$2));

var zoidExports = zoid$2.exports;
var zoid = /*@__PURE__*/getDefaultExportFromCjs(zoidExports);

let createNanoEvents = () => ({
  emit(event, ...args) {
    let callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i](...args);
    }
  },
  events: {},
  on(event, cb) {
    this.events[event]?.push(cb) || (this.events[event] = [cb]);
    return () => {
      this.events[event] = this.events[event]?.filter(i => cb !== i);
    }
  }
});

var styles$1 = ".tebex-js-lightbox{all:unset;zoom:1;forced-color-adjust:none;position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:var(--tebex-js-z-index,9999999);background:var(--tebex-js-lightbox-bg,rgba(0,0,0,.8));opacity:0;transition-property:opacity;transition-duration:var(--tebex-js-duration,.4s);transition-timing-function:var(--tebex-js-timing,ease);will-change:opacity;display:flex;justify-content:center;align-items:center;}.tebex-js-lightbox--visible{opacity:1;}.tebex-js-lightbox__holder{display:block;border:0;overflow:hidden;border-radius:5px;}.tebex-js-lightbox__holder > div{display:block!important;}";

class Lightbox {
    constructor() {
        assert(isEnvBrowser());
        this.body = document.body;
        const stylesheet = createElement("style");
        stylesheet.append(styles$1);
        this.body.append(stylesheet);
        this.root = this.render();
        this.holder = this.root.querySelector(".tebex-js-lightbox__holder");
    }
    render() {
        return (h("div", { class: "tebex-js-lightbox" },
            h("div", { class: "tebex-js-lightbox__holder", role: "dialog" })));
    }
    async show() {
        this.body.append(this.root);
        await nextFrame();
        this.root.classList.add("tebex-js-lightbox--visible");
        await transitionEnd(this.root);
    }
    async hide() {
        this.root.classList.remove("tebex-js-lightbox--visible");
        await nextFrame();
        await transitionEnd(this.root);
        this.body.removeChild(this.root);
    }
}

var styles = "html,body{width:100px;height:100px;overflow:hidden;}.tebex-js-spinner{position:fixed;max-height:60vmin;max-width:60vmin;height:40px;width:40px;top:50%;left:50%;box-sizing:border-box;border:3px solid rgba(0,0,0,.2);border-top-color:#FFF;border-radius:100%;animation:tebex-js-spinner-rotation .7s infinite linear;}@keyframes tebex-js-spinner-rotation{from{transform:translateX(-50%) translateY(-50%) rotate(0deg);}to{transform:translateX(-50%) translateY(-50%) rotate(359deg);}}";

const spinnerRender = ({ doc, props }) => {
    const html = (h("html", null,
        h("body", null,
            h("style", { nonce: props.cspNonce }, styles),
            h("div", { class: "tebex-js-spinner" }))));
    // move elements to iframe document
    if (doc)
        doc.adoptNode(html);
    return html;
};

var _Checkout_instances, _Checkout_showLightbox, _Checkout_buildComponent, _Checkout_renderComponent;
const DEFAULT_WIDTH = "800px";
const DEFAULT_HEIGHT = "760px";
const EVENT_NAMES = [
    "open",
    "close",
    "payment:complete",
    "payment:error"
];
/**
 * Tebex checkout instance.
 */
class Checkout {
    constructor() {
        _Checkout_instances.add(this);
        this.ident = null;
        this.theme = "light"; // TODO: add "auto" mode that auto-detects user theme preference
        this.colors = [];
        this.endpoint = "https://pay.tebex.io";
        this.isOpen = false;
        this.emitter = createNanoEvents();
        this.lightbox = null;
        this.component = null;
        this.zoid = null;
    }
    /**
     * Configure the Tebex checkout settings.
     */
    init(options) {
        this.ident = options.ident;
        this.theme = options.theme ?? this.theme;
        this.colors = options.colors ?? this.colors;
        this.endpoint = options.endpoint ?? this.endpoint;
        assert(!isNullOrUndefined(this.ident), "ident option is required");
        assert(["light", "dark"].includes(this.theme), `invalid theme option "${this.theme}"`);
        for (let { color, name } of this.colors) {
            assert(["primary", "secondary"].includes(name), `invalid color name "${name}"`);
            assert(!color.includes("var("), `invalid ${name} color: colors cannot include CSS variables`);
        }
    }
    /**
     * Subscribe to Tebex checkout events, such as when the embed is closed or when a payment is completed.
     * NOTE: None of these events should not be used to confirm actual receipt of payment - you should use Webhooks for that.
     */
    on(event, callback) {
        // @ts-ignore - handles legacy event name
        if (event === "payment_complete")
            event = "payment:complete";
        // @ts-ignore - handles legacy event name
        if (event === "payment_error")
            event = "payment:error";
        assert(EVENT_NAMES.includes(event), `invalid event name "${event}"`);
        return this.emitter.on(event, callback);
    }
    /**
     * Launch the Tebex checkout panel.
     * On desktop, the panel will launch in a "lightbox" mode that covers the screen. On mobile, it will be opened as a new page.
     */
    async launch() {
        if (isMobile(DEFAULT_WIDTH, DEFAULT_HEIGHT)) {
            __classPrivateFieldGet(this, _Checkout_instances, "m", _Checkout_renderComponent).call(this, document.body, true);
            this.isOpen = true;
            this.emitter.emit("open");
            return;
        }
        await __classPrivateFieldGet(this, _Checkout_instances, "m", _Checkout_showLightbox).call(this);
    }
    /**
     * Close the Tebex checkout panel.
     */
    async close() {
        if (this.lightbox)
            await this.lightbox.hide();
        if (this.zoid) {
            await this.zoid.close();
            this.isOpen = false;
            this.emitter.emit("close");
        }
    }
    /**
     * Render the Tebex checkout panel immediately, into a specified HTML element.
     * If `popupOnMobile` is true, then on mobile devices the checkout will be immediately opened as a new page instead.
     */
    render(element, width, height, popupOnMobile = true) {
        width = isString(width) ? width : `${width}px`;
        height = isString(height) ? height : `${height}px`;
        __classPrivateFieldGet(this, _Checkout_instances, "m", _Checkout_buildComponent).call(this, width, height);
        __classPrivateFieldGet(this, _Checkout_instances, "m", _Checkout_renderComponent).call(this, element, popupOnMobile && isMobile(width, height));
        this.isOpen = true;
        this.emitter.emit("open");
    }
}
_Checkout_instances = new WeakSet(), _Checkout_showLightbox = async function _Checkout_showLightbox() {
    if (!this.lightbox)
        this.lightbox = new Lightbox();
    await this.lightbox.show();
    __classPrivateFieldGet(this, _Checkout_instances, "m", _Checkout_renderComponent).call(this, this.lightbox.holder, false);
    this.isOpen = true;
    this.emitter.emit("open");
}, _Checkout_buildComponent = function _Checkout_buildComponent(width = DEFAULT_HEIGHT, height = DEFAULT_HEIGHT) {
    this.component = zoid.create({
        tag: "tebex-js-checkout-component",
        url: () => this.endpoint + "/" + this.ident,
        autoResize: {
            width: false,
            height: false,
        },
        dimensions: {
            width,
            height,
        },
        prerenderTemplate: spinnerRender,
        attributes: {
            iframe: {
                allow: "payment https://pay.tebex.io",
            },
        },
    });
}, _Checkout_renderComponent = function _Checkout_renderComponent(container, popup) {
    const url = new URL(window.location.href);
    if (!this.component)
        __classPrivateFieldGet(this, _Checkout_instances, "m", _Checkout_buildComponent).call(this);
    this.zoid = this.component({
        colors: this.colors,
        theme: this.theme,
        onOpenWindow: (url) => {
            window.open(url);
        },
        onClosePopup: async () => {
            await this.zoid.close();
            if (this.lightbox)
                await this.lightbox.hide();
            this.isOpen = false;
            this.emitter.emit("close");
        },
        onPaymentComplete: (e) => {
            this.emitter.emit("payment:complete", e);
        },
        onPaymentError: (e) => {
            this.emitter.emit("payment:error", e);
        },
        isApplePayAvailable: isApplePayAvailable(),
        isEmbedded: !popup,
        referrer: url.hostname,
        path: url.pathname,
        version: "1.0.0"
    });
    this.zoid.render(container, popup ? "popup" : "iframe");
};

/**
 * @deprecated
 */
const events = {
    /**
     * @deprecated - use string "open" instead.
     */
    OPEN: "open",
    /**
     * @deprecated - use string "close" instead.
     */
    CLOSE: "close",
    /**
     * @deprecated - use string "payment:complete" instead.
     */
    PAYMENT_COMPLETE: "payment:complete",
    /**
     * @deprecated - use string "payment:error" instead.
     */
    PAYMENT_ERROR: "payment:error"
};

var legacy = /*#__PURE__*/Object.freeze({
    __proto__: null,
    events: events
});

var _TebexCheckout_instances, _TebexCheckout_root, _TebexCheckout_shadow, _TebexCheckout_mode, _TebexCheckout_open, _TebexCheckout_height, _TebexCheckout_didInit, _TebexCheckout_init, _TebexCheckout_launchOrClose, _TebexCheckout_resize;
class TebexCheckout extends HTMLElement {
    get ident() {
        return this.checkout.ident;
    }
    set ident(ident) {
        setAttribute(this, "ident", ident);
    }
    get open() {
        return __classPrivateFieldGet(this, _TebexCheckout_open, "f");
    }
    set open(open) {
        setAttribute(this, "open", open);
    }
    get height() {
        return __classPrivateFieldGet(this, _TebexCheckout_height, "f");
    }
    set height(height) {
        setAttribute(this, "height", height);
    }
    static get observedAttributes() {
        return [
            "ident",
            "open",
            "height"
        ];
    }
    constructor() {
        super();
        _TebexCheckout_instances.add(this);
        this.checkout = new Checkout();
        _TebexCheckout_root.set(this, null);
        _TebexCheckout_shadow.set(this, null);
        _TebexCheckout_mode.set(this, "popover");
        _TebexCheckout_open.set(this, false);
        _TebexCheckout_height.set(this, 700);
        _TebexCheckout_didInit.set(this, false);
        __classPrivateFieldSet(this, _TebexCheckout_shadow, this.attachShadow({ mode: "open" }), "f");
        __classPrivateFieldSet(this, _TebexCheckout_root, createElement("div"), "f");
        __classPrivateFieldGet(this, _TebexCheckout_shadow, "f").append(__classPrivateFieldGet(this, _TebexCheckout_root, "f"));
        // Emit checkout events as DOM events on the element
        for (let event of EVENT_NAMES) {
            this.checkout.on(event, (e) => {
                this.dispatchEvent(new CustomEvent(event, { detail: e }));
            });
        }
    }
    connectedCallback() {
        if (getAttribute(this, "ident"))
            __classPrivateFieldGet(this, _TebexCheckout_instances, "m", _TebexCheckout_init).call(this);
    }
    disconnectedCallback() {
        this.checkout.emitter.emit("close");
    }
    attributeChangedCallback(key, oldVal, newVal) {
        if (oldVal === newVal)
            return;
        switch (key) {
            case "ident":
                this.checkout.ident = newVal;
                __classPrivateFieldGet(this, _TebexCheckout_instances, "m", _TebexCheckout_init).call(this);
                break;
            case "open":
                __classPrivateFieldSet(this, _TebexCheckout_open, (oldVal === "false" || !oldVal) && (newVal === "" || !!newVal), "f");
                __classPrivateFieldGet(this, _TebexCheckout_instances, "m", _TebexCheckout_launchOrClose).call(this);
                break;
            case "height":
                __classPrivateFieldSet(this, _TebexCheckout_height, parseInt(newVal), "f");
                __classPrivateFieldGet(this, _TebexCheckout_instances, "m", _TebexCheckout_resize).call(this);
                break;
        }
    }
}
_TebexCheckout_root = new WeakMap(), _TebexCheckout_shadow = new WeakMap(), _TebexCheckout_mode = new WeakMap(), _TebexCheckout_open = new WeakMap(), _TebexCheckout_height = new WeakMap(), _TebexCheckout_didInit = new WeakMap(), _TebexCheckout_instances = new WeakSet(), _TebexCheckout_init = function _TebexCheckout_init() {
    if (__classPrivateFieldGet(this, _TebexCheckout_didInit, "f"))
        return;
    __classPrivateFieldSet(this, _TebexCheckout_didInit, true, "f");
    let colors = [];
    if (this.hasAttribute("color-primary"))
        colors.push({ name: "primary", color: getAttribute(this, "color-primary") });
    if (this.hasAttribute("color-secondary"))
        colors.push({ name: "secondary", color: getAttribute(this, "color-secondary") });
    this.checkout.init({
        ident: getAttribute(this, "ident"),
        theme: getAttribute(this, "theme"),
        colors: colors,
        endpoint: getAttribute(this, "endpoint"),
    });
    __classPrivateFieldSet(this, _TebexCheckout_mode, this.hasAttribute("inline") ? "inline" : "popover", "f");
    if (__classPrivateFieldGet(this, _TebexCheckout_mode, "f") === "inline")
        this.checkout.render(__classPrivateFieldGet(this, _TebexCheckout_root, "f"), "100%", __classPrivateFieldGet(this, _TebexCheckout_height, "f"), false);
    else if (__classPrivateFieldGet(this, _TebexCheckout_mode, "f") === "popover")
        __classPrivateFieldGet(this, _TebexCheckout_instances, "m", _TebexCheckout_launchOrClose).call(this);
}, _TebexCheckout_launchOrClose = function _TebexCheckout_launchOrClose() {
    // Opening and closing the checkout is only for "popover" mode
    if (__classPrivateFieldGet(this, _TebexCheckout_mode, "f") !== "popover")
        return;
    // Checkout didn't init with an ident yet! Do nothing; this function will be called again after init
    if (!__classPrivateFieldGet(this, _TebexCheckout_didInit, "f"))
        return;
    if (__classPrivateFieldGet(this, _TebexCheckout_open, "f") && !this.checkout.isOpen)
        this.checkout.launch();
    if (!__classPrivateFieldGet(this, _TebexCheckout_open, "f") && this.checkout.isOpen)
        this.checkout.close();
}, _TebexCheckout_resize = function _TebexCheckout_resize() {
    // Resizing only makes sense in "inline" mode
    if (__classPrivateFieldGet(this, _TebexCheckout_mode, "f") !== "inline")
        return;
    // Check that a Zoid instance is actually available
    const zoid = this.checkout.zoid;
    if (!zoid)
        return;
    zoid.resize({ height: __classPrivateFieldGet(this, _TebexCheckout_height, "f") });
};
if (isEnvBrowser())
    customElements.define("tebex-checkout", TebexCheckout);

/**
 * Current Tebex.js package version
 */
const version = "1.0.0";
/**
 * Tebex checkout API
 */
const checkout = new Checkout();
var index = {
    version,
    checkout,
    ...legacy
};

export { checkout, index as default, events, version };
