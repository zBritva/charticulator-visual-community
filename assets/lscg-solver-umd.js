(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define([], factory);
  else if (typeof exports === 'object')
    exports["LSCGSolver"] = factory();
  else
    root["LSCGSolver"] = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return /******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache 123123
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
        /******/
      }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
        /******/
      };
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
      /******/
    }
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
      /******/
    });
        /******/
      }
      /******/
    };
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
      /******/
    };
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
    /******/
  })
/************************************************************************/
/******/([
/* 0 */
/***/ (function (module, exports) {

      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      }())
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
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
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
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
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
        while (len) {
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

      process.nextTick = function (fun) {
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
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};

      function noop() { }

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) { return [] }

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () { return '/' };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () { return 0; };


      /***/
    }),
/* 1 */
/***/ (function (module, exports, __webpack_require__) {

      "use strict";
/* WEBPACK VAR INJECTION */(function (global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
        /* eslint-disable no-proto */



        var base64 = __webpack_require__(5)
        var ieee754 = __webpack_require__(6)
        var isArray = __webpack_require__(7)

        exports.Buffer = Buffer
        exports.SlowBuffer = SlowBuffer
        exports.INSPECT_MAX_BYTES = 50

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
        Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
          ? global.TYPED_ARRAY_SUPPORT
          : typedArraySupport()

        /*
         * Export kMaxLength after typed array support is determined.
         */
        exports.kMaxLength = kMaxLength()

        function typedArraySupport() {
          try {
            var arr = new Uint8Array(1)
            arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
            return arr.foo() === 42 && // typed array instances can be augmented
              typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
              arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
          } catch (e) {
            return false
          }
        }

        function kMaxLength() {
          return Buffer.TYPED_ARRAY_SUPPORT
            ? 0x7fffffff
            : 0x3fffffff
        }

        function createBuffer(that, length) {
          if (kMaxLength() < length) {
            throw new RangeError('Invalid typed array length')
          }
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            // Return an augmented `Uint8Array` instance, for best performance
            that = new Uint8Array(length)
            that.__proto__ = Buffer.prototype
          } else {
            // Fallback: Return an object instance of the Buffer class
            if (that === null) {
              that = new Buffer(length)
            }
            that.length = length
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

        function Buffer(arg, encodingOrOffset, length) {
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

        Buffer.poolSize = 8192 // not used by this implementation

        // TODO: Legacy, not needed anymore. Remove in next major version.
        Buffer._augment = function (arr) {
          arr.__proto__ = Buffer.prototype
          return arr
        }

        function from(that, value, encodingOrOffset, length) {
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
        }

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          Buffer.prototype.__proto__ = Uint8Array.prototype
          Buffer.__proto__ = Uint8Array
          if (typeof Symbol !== 'undefined' && Symbol.species &&
            Buffer[Symbol.species] === Buffer) {
            // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
            Object.defineProperty(Buffer, Symbol.species, {
              value: null,
              configurable: true
            })
          }
        }

        function assertSize(size) {
          if (typeof size !== 'number') {
            throw new TypeError('"size" argument must be a number')
          } else if (size < 0) {
            throw new RangeError('"size" argument must not be negative')
          }
        }

        function alloc(that, size, fill, encoding) {
          assertSize(size)
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
        }

        function allocUnsafe(that, size) {
          assertSize(size)
          that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
          if (!Buffer.TYPED_ARRAY_SUPPORT) {
            for (var i = 0; i < size; ++i) {
              that[i] = 0
            }
          }
          return that
        }

        /**
         * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
         * */
        Buffer.allocUnsafe = function (size) {
          return allocUnsafe(null, size)
        }
        /**
         * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
         */
        Buffer.allocUnsafeSlow = function (size) {
          return allocUnsafe(null, size)
        }

        function fromString(that, string, encoding) {
          if (typeof encoding !== 'string' || encoding === '') {
            encoding = 'utf8'
          }

          if (!Buffer.isEncoding(encoding)) {
            throw new TypeError('"encoding" must be a valid string encoding')
          }

          var length = byteLength(string, encoding) | 0
          that = createBuffer(that, length)

          var actual = that.write(string, encoding)

          if (actual !== length) {
            // Writing a hex string, for example, that contains invalid characters will
            // cause everything after the first invalid character to be ignored. (e.g.
            // 'abxxcd' will be treated as 'ab')
            that = that.slice(0, actual)
          }

          return that
        }

        function fromArrayLike(that, array) {
          var length = array.length < 0 ? 0 : checked(array.length) | 0
          that = createBuffer(that, length)
          for (var i = 0; i < length; i += 1) {
            that[i] = array[i] & 255
          }
          return that
        }

        function fromArrayBuffer(that, array, byteOffset, length) {
          array.byteLength // this throws if `array` is not a valid ArrayBuffer

          if (byteOffset < 0 || array.byteLength < byteOffset) {
            throw new RangeError('\'offset\' is out of bounds')
          }

          if (array.byteLength < byteOffset + (length || 0)) {
            throw new RangeError('\'length\' is out of bounds')
          }

          if (byteOffset === undefined && length === undefined) {
            array = new Uint8Array(array)
          } else if (length === undefined) {
            array = new Uint8Array(array, byteOffset)
          } else {
            array = new Uint8Array(array, byteOffset, length)
          }

          if (Buffer.TYPED_ARRAY_SUPPORT) {
            // Return an augmented `Uint8Array` instance, for best performance
            that = array
            that.__proto__ = Buffer.prototype
          } else {
            // Fallback: Return an object instance of the Buffer class
            that = fromArrayLike(that, array)
          }
          return that
        }

        function fromObject(that, obj) {
          if (Buffer.isBuffer(obj)) {
            var len = checked(obj.length) | 0
            that = createBuffer(that, len)

            if (that.length === 0) {
              return that
            }

            obj.copy(that, 0, 0, len)
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

        function checked(length) {
          // Note: cannot use `length < kMaxLength()` here because that fails when
          // length is NaN (which is otherwise coerced to zero.)
          if (length >= kMaxLength()) {
            throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
              'size: 0x' + kMaxLength().toString(16) + ' bytes')
          }
          return length | 0
        }

        function SlowBuffer(length) {
          if (+length != length) { // eslint-disable-line eqeqeq
            length = 0
          }
          return Buffer.alloc(+length)
        }

        Buffer.isBuffer = function isBuffer(b) {
          return !!(b != null && b._isBuffer)
        }

        Buffer.compare = function compare(a, b) {
          if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
            throw new TypeError('Arguments must be Buffers')
          }

          if (a === b) return 0

          var x = a.length
          var y = b.length

          for (var i = 0, len = Math.min(x, y); i < len; ++i) {
            if (a[i] !== b[i]) {
              x = a[i]
              y = b[i]
              break
            }
          }

          if (x < y) return -1
          if (y < x) return 1
          return 0
        }

        Buffer.isEncoding = function isEncoding(encoding) {
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
        }

        Buffer.concat = function concat(list, length) {
          if (!isArray(list)) {
            throw new TypeError('"list" argument must be an Array of Buffers')
          }

          if (list.length === 0) {
            return Buffer.alloc(0)
          }

          var i
          if (length === undefined) {
            length = 0
            for (i = 0; i < list.length; ++i) {
              length += list[i].length
            }
          }

          var buffer = Buffer.allocUnsafe(length)
          var pos = 0
          for (i = 0; i < list.length; ++i) {
            var buf = list[i]
            if (!Buffer.isBuffer(buf)) {
              throw new TypeError('"list" argument must be an Array of Buffers')
            }
            buf.copy(buffer, pos)
            pos += buf.length
          }
          return buffer
        }

        function byteLength(string, encoding) {
          if (Buffer.isBuffer(string)) {
            return string.length
          }
          if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
            (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
            return string.byteLength
          }
          if (typeof string !== 'string') {
            string = '' + string
          }

          var len = string.length
          if (len === 0) return 0

          // Use a for loop to avoid recursion
          var loweredCase = false
          for (; ;) {
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
                encoding = ('' + encoding).toLowerCase()
                loweredCase = true
            }
          }
        }
        Buffer.byteLength = byteLength

        function slowToString(encoding, start, end) {
          var loweredCase = false

          // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
          // property of a typed array.

          // This behaves neither like String nor Uint8Array in that we set start/end
          // to their upper/lower bounds if the value passed is out of range.
          // undefined is handled specially as per ECMA-262 6th Edition,
          // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
          if (start === undefined || start < 0) {
            start = 0
          }
          // Return early if start > this.length. Done here to prevent potential uint32
          // coercion fail below.
          if (start > this.length) {
            return ''
          }

          if (end === undefined || end > this.length) {
            end = this.length
          }

          if (end <= 0) {
            return ''
          }

          // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
          end >>>= 0
          start >>>= 0

          if (end <= start) {
            return ''
          }

          if (!encoding) encoding = 'utf8'

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
                encoding = (encoding + '').toLowerCase()
                loweredCase = true
            }
          }
        }

        // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
        // Buffer instances.
        Buffer.prototype._isBuffer = true

        function swap(b, n, m) {
          var i = b[n]
          b[n] = b[m]
          b[m] = i
        }

        Buffer.prototype.swap16 = function swap16() {
          var len = this.length
          if (len % 2 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 16-bits')
          }
          for (var i = 0; i < len; i += 2) {
            swap(this, i, i + 1)
          }
          return this
        }

        Buffer.prototype.swap32 = function swap32() {
          var len = this.length
          if (len % 4 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 32-bits')
          }
          for (var i = 0; i < len; i += 4) {
            swap(this, i, i + 3)
            swap(this, i + 1, i + 2)
          }
          return this
        }

        Buffer.prototype.swap64 = function swap64() {
          var len = this.length
          if (len % 8 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 64-bits')
          }
          for (var i = 0; i < len; i += 8) {
            swap(this, i, i + 7)
            swap(this, i + 1, i + 6)
            swap(this, i + 2, i + 5)
            swap(this, i + 3, i + 4)
          }
          return this
        }

        Buffer.prototype.toString = function toString() {
          var length = this.length | 0
          if (length === 0) return ''
          if (arguments.length === 0) return utf8Slice(this, 0, length)
          return slowToString.apply(this, arguments)
        }

        Buffer.prototype.equals = function equals(b) {
          if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
          if (this === b) return true
          return Buffer.compare(this, b) === 0
        }

        Buffer.prototype.inspect = function inspect() {
          var str = ''
          var max = exports.INSPECT_MAX_BYTES
          if (this.length > 0) {
            str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
            if (this.length > max) str += ' ... '
          }
          return '<Buffer ' + str + '>'
        }

        Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
          if (!Buffer.isBuffer(target)) {
            throw new TypeError('Argument must be a Buffer')
          }

          if (start === undefined) {
            start = 0
          }
          if (end === undefined) {
            end = target ? target.length : 0
          }
          if (thisStart === undefined) {
            thisStart = 0
          }
          if (thisEnd === undefined) {
            thisEnd = this.length
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

          start >>>= 0
          end >>>= 0
          thisStart >>>= 0
          thisEnd >>>= 0

          if (this === target) return 0

          var x = thisEnd - thisStart
          var y = end - start
          var len = Math.min(x, y)

          var thisCopy = this.slice(thisStart, thisEnd)
          var targetCopy = target.slice(start, end)

          for (var i = 0; i < len; ++i) {
            if (thisCopy[i] !== targetCopy[i]) {
              x = thisCopy[i]
              y = targetCopy[i]
              break
            }
          }

          if (x < y) return -1
          if (y < x) return 1
          return 0
        }

        // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
        // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
        //
        // Arguments:
        // - buffer - a Buffer to search
        // - val - a string, Buffer, or number
        // - byteOffset - an index into `buffer`; will be clamped to an int32
        // - encoding - an optional encoding, relevant is val is a string
        // - dir - true for indexOf, false for lastIndexOf
        function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
          // Empty buffer means no match
          if (buffer.length === 0) return -1

          // Normalize byteOffset
          if (typeof byteOffset === 'string') {
            encoding = byteOffset
            byteOffset = 0
          } else if (byteOffset > 0x7fffffff) {
            byteOffset = 0x7fffffff
          } else if (byteOffset < -0x80000000) {
            byteOffset = -0x80000000
          }
          byteOffset = +byteOffset  // Coerce to Number.
          if (isNaN(byteOffset)) {
            // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
            byteOffset = dir ? 0 : (buffer.length - 1)
          }

          // Normalize byteOffset: negative offsets start from the end of the buffer
          if (byteOffset < 0) byteOffset = buffer.length + byteOffset
          if (byteOffset >= buffer.length) {
            if (dir) return -1
            else byteOffset = buffer.length - 1
          } else if (byteOffset < 0) {
            if (dir) byteOffset = 0
            else return -1
          }

          // Normalize val
          if (typeof val === 'string') {
            val = Buffer.from(val, encoding)
          }

          // Finally, search either indexOf (if dir is true) or lastIndexOf
          if (Buffer.isBuffer(val)) {
            // Special case: looking for empty string/buffer always fails
            if (val.length === 0) {
              return -1
            }
            return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
          } else if (typeof val === 'number') {
            val = val & 0xFF // Search for a byte value [0-255]
            if (Buffer.TYPED_ARRAY_SUPPORT &&
              typeof Uint8Array.prototype.indexOf === 'function') {
              if (dir) {
                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
              } else {
                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
              }
            }
            return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
          }

          throw new TypeError('val must be string, number or Buffer')
        }

        function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
          var indexSize = 1
          var arrLength = arr.length
          var valLength = val.length

          if (encoding !== undefined) {
            encoding = String(encoding).toLowerCase()
            if (encoding === 'ucs2' || encoding === 'ucs-2' ||
              encoding === 'utf16le' || encoding === 'utf-16le') {
              if (arr.length < 2 || val.length < 2) {
                return -1
              }
              indexSize = 2
              arrLength /= 2
              valLength /= 2
              byteOffset /= 2
            }
          }

          function read(buf, i) {
            if (indexSize === 1) {
              return buf[i]
            } else {
              return buf.readUInt16BE(i * indexSize)
            }
          }

          var i
          if (dir) {
            var foundIndex = -1
            for (i = byteOffset; i < arrLength; i++) {
              if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                if (foundIndex === -1) foundIndex = i
                if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
              } else {
                if (foundIndex !== -1) i -= i - foundIndex
                foundIndex = -1
              }
            }
          } else {
            if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
            for (i = byteOffset; i >= 0; i--) {
              var found = true
              for (var j = 0; j < valLength; j++) {
                if (read(arr, i + j) !== read(val, j)) {
                  found = false
                  break
                }
              }
              if (found) return i
            }
          }

          return -1
        }

        Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
          return this.indexOf(val, byteOffset, encoding) !== -1
        }

        Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
          return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
        }

        Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
          return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
        }

        function hexWrite(buf, string, offset, length) {
          offset = Number(offset) || 0
          var remaining = buf.length - offset
          if (!length) {
            length = remaining
          } else {
            length = Number(length)
            if (length > remaining) {
              length = remaining
            }
          }

          // must be an even number of digits
          var strLen = string.length
          if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

          if (length > strLen / 2) {
            length = strLen / 2
          }
          for (var i = 0; i < length; ++i) {
            var parsed = parseInt(string.substr(i * 2, 2), 16)
            if (isNaN(parsed)) return i
            buf[offset + i] = parsed
          }
          return i
        }

        function utf8Write(buf, string, offset, length) {
          return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
        }

        function asciiWrite(buf, string, offset, length) {
          return blitBuffer(asciiToBytes(string), buf, offset, length)
        }

        function latin1Write(buf, string, offset, length) {
          return asciiWrite(buf, string, offset, length)
        }

        function base64Write(buf, string, offset, length) {
          return blitBuffer(base64ToBytes(string), buf, offset, length)
        }

        function ucs2Write(buf, string, offset, length) {
          return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
        }

        Buffer.prototype.write = function write(string, offset, length, encoding) {
          // Buffer#write(string)
          if (offset === undefined) {
            encoding = 'utf8'
            length = this.length
            offset = 0
            // Buffer#write(string, encoding)
          } else if (length === undefined && typeof offset === 'string') {
            encoding = offset
            length = this.length
            offset = 0
            // Buffer#write(string, offset[, length][, encoding])
          } else if (isFinite(offset)) {
            offset = offset | 0
            if (isFinite(length)) {
              length = length | 0
              if (encoding === undefined) encoding = 'utf8'
            } else {
              encoding = length
              length = undefined
            }
            // legacy write(string, encoding, offset, length) - remove in v0.13
          } else {
            throw new Error(
              'Buffer.write(string, encoding, offset[, length]) is no longer supported'
            )
          }

          var remaining = this.length - offset
          if (length === undefined || length > remaining) length = remaining

          if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
            throw new RangeError('Attempt to write outside buffer bounds')
          }

          if (!encoding) encoding = 'utf8'

          var loweredCase = false
          for (; ;) {
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
                encoding = ('' + encoding).toLowerCase()
                loweredCase = true
            }
          }
        }

        Buffer.prototype.toJSON = function toJSON() {
          return {
            type: 'Buffer',
            data: Array.prototype.slice.call(this._arr || this, 0)
          }
        }

        function base64Slice(buf, start, end) {
          if (start === 0 && end === buf.length) {
            return base64.fromByteArray(buf)
          } else {
            return base64.fromByteArray(buf.slice(start, end))
          }
        }

        function utf8Slice(buf, start, end) {
          end = Math.min(buf.length, end)
          var res = []

          var i = start
          while (i < end) {
            var firstByte = buf[i]
            var codePoint = null
            var bytesPerSequence = (firstByte > 0xEF) ? 4
              : (firstByte > 0xDF) ? 3
                : (firstByte > 0xBF) ? 2
                  : 1

            if (i + bytesPerSequence <= end) {
              var secondByte, thirdByte, fourthByte, tempCodePoint

              switch (bytesPerSequence) {
                case 1:
                  if (firstByte < 0x80) {
                    codePoint = firstByte
                  }
                  break
                case 2:
                  secondByte = buf[i + 1]
                  if ((secondByte & 0xC0) === 0x80) {
                    tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                    if (tempCodePoint > 0x7F) {
                      codePoint = tempCodePoint
                    }
                  }
                  break
                case 3:
                  secondByte = buf[i + 1]
                  thirdByte = buf[i + 2]
                  if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                    tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                    if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                      codePoint = tempCodePoint
                    }
                  }
                  break
                case 4:
                  secondByte = buf[i + 1]
                  thirdByte = buf[i + 2]
                  fourthByte = buf[i + 3]
                  if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                    tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                    if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                      codePoint = tempCodePoint
                    }
                  }
              }
            }

            if (codePoint === null) {
              // we did not generate a valid codePoint so insert a
              // replacement char (U+FFFD) and advance only 1 byte
              codePoint = 0xFFFD
              bytesPerSequence = 1
            } else if (codePoint > 0xFFFF) {
              // encode to utf16 (surrogate pair dance)
              codePoint -= 0x10000
              res.push(codePoint >>> 10 & 0x3FF | 0xD800)
              codePoint = 0xDC00 | codePoint & 0x3FF
            }

            res.push(codePoint)
            i += bytesPerSequence
          }

          return decodeCodePointsArray(res)
        }

        // Based on http://stackoverflow.com/a/22747272/680742, the browser with
        // the lowest limit is Chrome, with 0x10000 args.
        // We go 1 magnitude less, for safety
        var MAX_ARGUMENTS_LENGTH = 0x1000

        function decodeCodePointsArray(codePoints) {
          var len = codePoints.length
          if (len <= MAX_ARGUMENTS_LENGTH) {
            return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
          }

          // Decode in chunks to avoid "call stack size exceeded".
          var res = ''
          var i = 0
          while (i < len) {
            res += String.fromCharCode.apply(
              String,
              codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
            )
          }
          return res
        }

        function asciiSlice(buf, start, end) {
          var ret = ''
          end = Math.min(buf.length, end)

          for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i] & 0x7F)
          }
          return ret
        }

        function latin1Slice(buf, start, end) {
          var ret = ''
          end = Math.min(buf.length, end)

          for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i])
          }
          return ret
        }

        function hexSlice(buf, start, end) {
          var len = buf.length

          if (!start || start < 0) start = 0
          if (!end || end < 0 || end > len) end = len

          var out = ''
          for (var i = start; i < end; ++i) {
            out += toHex(buf[i])
          }
          return out
        }

        function utf16leSlice(buf, start, end) {
          var bytes = buf.slice(start, end)
          var res = ''
          for (var i = 0; i < bytes.length; i += 2) {
            res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
          }
          return res
        }

        Buffer.prototype.slice = function slice(start, end) {
          var len = this.length
          start = ~~start
          end = end === undefined ? len : ~~end

          if (start < 0) {
            start += len
            if (start < 0) start = 0
          } else if (start > len) {
            start = len
          }

          if (end < 0) {
            end += len
            if (end < 0) end = 0
          } else if (end > len) {
            end = len
          }

          if (end < start) end = start

          var newBuf
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            newBuf = this.subarray(start, end)
            newBuf.__proto__ = Buffer.prototype
          } else {
            var sliceLen = end - start
            newBuf = new Buffer(sliceLen, undefined)
            for (var i = 0; i < sliceLen; ++i) {
              newBuf[i] = this[i + start]
            }
          }

          return newBuf
        }

        /*
         * Need to make sure that buffer isn't trying to write out of bounds.
         */
        function checkOffset(offset, ext, length) {
          if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
          if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
        }

        Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) checkOffset(offset, byteLength, this.length)

          var val = this[offset]
          var mul = 1
          var i = 0
          while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul
          }

          return val
        }

        Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) {
            checkOffset(offset, byteLength, this.length)
          }

          var val = this[offset + --byteLength]
          var mul = 1
          while (byteLength > 0 && (mul *= 0x100)) {
            val += this[offset + --byteLength] * mul
          }

          return val
        }

        Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 1, this.length)
          return this[offset]
        }

        Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          return this[offset] | (this[offset + 1] << 8)
        }

        Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          return (this[offset] << 8) | this[offset + 1]
        }

        Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return ((this[offset]) |
            (this[offset + 1] << 8) |
            (this[offset + 2] << 16)) +
            (this[offset + 3] * 0x1000000)
        }

        Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return (this[offset] * 0x1000000) +
            ((this[offset + 1] << 16) |
              (this[offset + 2] << 8) |
              this[offset + 3])
        }

        Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) checkOffset(offset, byteLength, this.length)

          var val = this[offset]
          var mul = 1
          var i = 0
          while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul
          }
          mul *= 0x80

          if (val >= mul) val -= Math.pow(2, 8 * byteLength)

          return val
        }

        Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) checkOffset(offset, byteLength, this.length)

          var i = byteLength
          var mul = 1
          var val = this[offset + --i]
          while (i > 0 && (mul *= 0x100)) {
            val += this[offset + --i] * mul
          }
          mul *= 0x80

          if (val >= mul) val -= Math.pow(2, 8 * byteLength)

          return val
        }

        Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 1, this.length)
          if (!(this[offset] & 0x80)) return (this[offset])
          return ((0xff - this[offset] + 1) * -1)
        }

        Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          var val = this[offset] | (this[offset + 1] << 8)
          return (val & 0x8000) ? val | 0xFFFF0000 : val
        }

        Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 2, this.length)
          var val = this[offset + 1] | (this[offset] << 8)
          return (val & 0x8000) ? val | 0xFFFF0000 : val
        }

        Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return (this[offset]) |
            (this[offset + 1] << 8) |
            (this[offset + 2] << 16) |
            (this[offset + 3] << 24)
        }

        Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)

          return (this[offset] << 24) |
            (this[offset + 1] << 16) |
            (this[offset + 2] << 8) |
            (this[offset + 3])
        }

        Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)
          return ieee754.read(this, offset, true, 23, 4)
        }

        Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 4, this.length)
          return ieee754.read(this, offset, false, 23, 4)
        }

        Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 8, this.length)
          return ieee754.read(this, offset, true, 52, 8)
        }

        Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
          if (!noAssert) checkOffset(offset, 8, this.length)
          return ieee754.read(this, offset, false, 52, 8)
        }

        function checkInt(buf, value, offset, ext, max, min) {
          if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
          if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
          if (offset + ext > buf.length) throw new RangeError('Index out of range')
        }

        Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
          value = +value
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1
            checkInt(this, value, offset, byteLength, maxBytes, 0)
          }

          var mul = 1
          var i = 0
          this[offset] = value & 0xFF
          while (++i < byteLength && (mul *= 0x100)) {
            this[offset + i] = (value / mul) & 0xFF
          }

          return offset + byteLength
        }

        Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
          value = +value
          offset = offset | 0
          byteLength = byteLength | 0
          if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1
            checkInt(this, value, offset, byteLength, maxBytes, 0)
          }

          var i = byteLength - 1
          var mul = 1
          this[offset + i] = value & 0xFF
          while (--i >= 0 && (mul *= 0x100)) {
            this[offset + i] = (value / mul) & 0xFF
          }

          return offset + byteLength
        }

        Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
          if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
          this[offset] = (value & 0xff)
          return offset + 1
        }

        function objectWriteUInt16(buf, value, offset, littleEndian) {
          if (value < 0) value = 0xffff + value + 1
          for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
            buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
              (littleEndian ? i : 1 - i) * 8
          }
        }

        Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
          } else {
            objectWriteUInt16(this, value, offset, true)
          }
          return offset + 2
        }

        Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
          } else {
            objectWriteUInt16(this, value, offset, false)
          }
          return offset + 2
        }

        function objectWriteUInt32(buf, value, offset, littleEndian) {
          if (value < 0) value = 0xffffffff + value + 1
          for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
            buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
          }
        }

        Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset + 3] = (value >>> 24)
            this[offset + 2] = (value >>> 16)
            this[offset + 1] = (value >>> 8)
            this[offset] = (value & 0xff)
          } else {
            objectWriteUInt32(this, value, offset, true)
          }
          return offset + 4
        }

        Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
          } else {
            objectWriteUInt32(this, value, offset, false)
          }
          return offset + 4
        }

        Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1)

            checkInt(this, value, offset, byteLength, limit - 1, -limit)
          }

          var i = 0
          var mul = 1
          var sub = 0
          this[offset] = value & 0xFF
          while (++i < byteLength && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
              sub = 1
            }
            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
          }

          return offset + byteLength
        }

        Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1)

            checkInt(this, value, offset, byteLength, limit - 1, -limit)
          }

          var i = byteLength - 1
          var mul = 1
          var sub = 0
          this[offset + i] = value & 0xFF
          while (--i >= 0 && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
              sub = 1
            }
            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
          }

          return offset + byteLength
        }

        Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
          if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
          if (value < 0) value = 0xff + value + 1
          this[offset] = (value & 0xff)
          return offset + 1
        }

        Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
          } else {
            objectWriteUInt16(this, value, offset, true)
          }
          return offset + 2
        }

        Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
          } else {
            objectWriteUInt16(this, value, offset, false)
          }
          return offset + 2
        }

        Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            this[offset + 2] = (value >>> 16)
            this[offset + 3] = (value >>> 24)
          } else {
            objectWriteUInt32(this, value, offset, true)
          }
          return offset + 4
        }

        Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
          value = +value
          offset = offset | 0
          if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
          if (value < 0) value = 0xffffffff + value + 1
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
          } else {
            objectWriteUInt32(this, value, offset, false)
          }
          return offset + 4
        }

        function checkIEEE754(buf, value, offset, ext, max, min) {
          if (offset + ext > buf.length) throw new RangeError('Index out of range')
          if (offset < 0) throw new RangeError('Index out of range')
        }

        function writeFloat(buf, value, offset, littleEndian, noAssert) {
          if (!noAssert) {
            checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
          }
          ieee754.write(buf, value, offset, littleEndian, 23, 4)
          return offset + 4
        }

        Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
          return writeFloat(this, value, offset, true, noAssert)
        }

        Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
          return writeFloat(this, value, offset, false, noAssert)
        }

        function writeDouble(buf, value, offset, littleEndian, noAssert) {
          if (!noAssert) {
            checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
          }
          ieee754.write(buf, value, offset, littleEndian, 52, 8)
          return offset + 8
        }

        Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
          return writeDouble(this, value, offset, true, noAssert)
        }

        Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
          return writeDouble(this, value, offset, false, noAssert)
        }

        // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
        Buffer.prototype.copy = function copy(target, targetStart, start, end) {
          if (!start) start = 0
          if (!end && end !== 0) end = this.length
          if (targetStart >= target.length) targetStart = target.length
          if (!targetStart) targetStart = 0
          if (end > 0 && end < start) end = start

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
          if (end > this.length) end = this.length
          if (target.length - targetStart < end - start) {
            end = target.length - targetStart + start
          }

          var len = end - start
          var i

          if (this === target && start < targetStart && targetStart < end) {
            // descending copy from end
            for (i = len - 1; i >= 0; --i) {
              target[i + targetStart] = this[i + start]
            }
          } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
            // ascending copy from start
            for (i = 0; i < len; ++i) {
              target[i + targetStart] = this[i + start]
            }
          } else {
            Uint8Array.prototype.set.call(
              target,
              this.subarray(start, start + len),
              targetStart
            )
          }

          return len
        }

        // Usage:
        //    buffer.fill(number[, offset[, end]])
        //    buffer.fill(buffer[, offset[, end]])
        //    buffer.fill(string[, offset[, end]][, encoding])
        Buffer.prototype.fill = function fill(val, start, end, encoding) {
          // Handle string cases:
          if (typeof val === 'string') {
            if (typeof start === 'string') {
              encoding = start
              start = 0
              end = this.length
            } else if (typeof end === 'string') {
              encoding = end
              end = this.length
            }
            if (val.length === 1) {
              var code = val.charCodeAt(0)
              if (code < 256) {
                val = code
              }
            }
            if (encoding !== undefined && typeof encoding !== 'string') {
              throw new TypeError('encoding must be a string')
            }
            if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
              throw new TypeError('Unknown encoding: ' + encoding)
            }
          } else if (typeof val === 'number') {
            val = val & 255
          }

          // Invalid ranges are not set to a default, so can range check early.
          if (start < 0 || this.length < start || this.length < end) {
            throw new RangeError('Out of range index')
          }

          if (end <= start) {
            return this
          }

          start = start >>> 0
          end = end === undefined ? this.length : end >>> 0

          if (!val) val = 0

          var i
          if (typeof val === 'number') {
            for (i = start; i < end; ++i) {
              this[i] = val
            }
          } else {
            var bytes = Buffer.isBuffer(val)
              ? val
              : utf8ToBytes(new Buffer(val, encoding).toString())
            var len = bytes.length
            for (i = 0; i < end - start; ++i) {
              this[i + start] = bytes[i % len]
            }
          }

          return this
        }

        // HELPER FUNCTIONS
        // ================

        var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

        function base64clean(str) {
          // Node strips out invalid characters like \n and \t from the string, base64-js does not
          str = stringtrim(str).replace(INVALID_BASE64_RE, '')
          // Node converts strings with length < 2 to ''
          if (str.length < 2) return ''
          // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
          while (str.length % 4 !== 0) {
            str = str + '='
          }
          return str
        }

        function stringtrim(str) {
          if (str.trim) return str.trim()
          return str.replace(/^\s+|\s+$/g, '')
        }

        function toHex(n) {
          if (n < 16) return '0' + n.toString(16)
          return n.toString(16)
        }

        function utf8ToBytes(string, units) {
          units = units || Infinity
          var codePoint
          var length = string.length
          var leadSurrogate = null
          var bytes = []

          for (var i = 0; i < length; ++i) {
            codePoint = string.charCodeAt(i)

            // is surrogate component
            if (codePoint > 0xD7FF && codePoint < 0xE000) {
              // last char was a lead
              if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                  // unexpected trail
                  if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                  continue
                } else if (i + 1 === length) {
                  // unpaired lead
                  if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                  continue
                }

                // valid lead
                leadSurrogate = codePoint

                continue
              }

              // 2 leads in a row
              if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                leadSurrogate = codePoint
                continue
              }

              // valid surrogate pair
              codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
            } else if (leadSurrogate) {
              // valid bmp char, but last char was a lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            }

            leadSurrogate = null

            // encode utf8
            if (codePoint < 0x80) {
              if ((units -= 1) < 0) break
              bytes.push(codePoint)
            } else if (codePoint < 0x800) {
              if ((units -= 2) < 0) break
              bytes.push(
                codePoint >> 0x6 | 0xC0,
                codePoint & 0x3F | 0x80
              )
            } else if (codePoint < 0x10000) {
              if ((units -= 3) < 0) break
              bytes.push(
                codePoint >> 0xC | 0xE0,
                codePoint >> 0x6 & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
              )
            } else if (codePoint < 0x110000) {
              if ((units -= 4) < 0) break
              bytes.push(
                codePoint >> 0x12 | 0xF0,
                codePoint >> 0xC & 0x3F | 0x80,
                codePoint >> 0x6 & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
              )
            } else {
              throw new Error('Invalid code point')
            }
          }

          return bytes
        }

        function asciiToBytes(str) {
          var byteArray = []
          for (var i = 0; i < str.length; ++i) {
            // Node's code seems to be doing this and not & 0x7F..
            byteArray.push(str.charCodeAt(i) & 0xFF)
          }
          return byteArray
        }

        function utf16leToBytes(str, units) {
          var c, hi, lo
          var byteArray = []
          for (var i = 0; i < str.length; ++i) {
            if ((units -= 2) < 0) break

            c = str.charCodeAt(i)
            hi = c >> 8
            lo = c % 256
            byteArray.push(lo)
            byteArray.push(hi)
          }

          return byteArray
        }

        function base64ToBytes(str) {
          return base64.toByteArray(base64clean(str))
        }

        function blitBuffer(src, dst, offset, length) {
          for (var i = 0; i < length; ++i) {
            if ((i + offset >= dst.length) || (i >= src.length)) break
            dst[i + offset] = src[i]
          }
          return i
        }

        function isnan(val) {
          return val !== val // eslint-disable-line no-self-compare
        }

        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(4)))

      /***/
    }),
/* 2 */
/***/ (function (module, exports, __webpack_require__) {

      var internals;
      var isInitialized = false;
      var initializedHooks = [];

      var useWASM = true;
      if (typeof WebAssembly == "undefined") {
        useWASM = false;
      }

      if (useWASM) {
        internals = __webpack_require__(3)();
        internals.onRuntimeInitialized = function () {
          isInitialized = true;
          for (let i = 0; i < initializedHooks.length; i++) {
            initializedHooks[i]();
          }
        };
      } else {
        console.warn("WASMSolver: not using web assembly");
        internals = __webpack_require__(8)();
        isInitialized = true;
      }

      function initialize() {
        return new Promise(function (resolve, reject) {
          if (isInitialized) {
            resolve();
          } else {
            initializedHooks.push(function () {
              resolve();
            });
          }
        });
      }

      // Wrap the functions and constants from api.h
      var memory_alloc = internals.cwrap("memory_alloc", "number", ["number"]);
      var memory_free = internals.cwrap("memory_free", null, ["number"]);

      var getUint8Array = function (ptr, length) {
        return new Uint8Array(internals.HEAPU8.buffer, ptr, length);
      };
      var getUint16Array = function (ptr, length) {
        return new Uint16Array(internals.HEAPU16.buffer, ptr, length);
      };
      var getUint32Array = function (ptr, length) {
        return new Uint32Array(internals.HEAPU32.buffer, ptr, length);
      };
      var getFloat64Array = function (ptr, length) {
        return new Float64Array(internals.HEAPF64.buffer, ptr, length);
      };
      var getFloat32Array = function (ptr, length) {
        return new Float32Array(internals.HEAPF32.buffer, ptr, length);
      };

      var kSolverStrength_HARD = 0;
      var kSolverStrength_STRONG = 1;
      var kSolverStrength_MEDIUM = 2;
      var kSolverStrength_WEAK = 3;
      var kSolverStrength_WEAKER = 4;
      var kSolverStrength_DISABLED = 10;

      var kSolverAttribute_NUM_ITERATIONS = 1;
      var kSolverAttribute_TOLERANCE = 2;
      var kSolverAttribute_FLAGS = 3;

      var kSolverAttribute_NUM_VARIABLES = 10;
      var kSolverAttribute_NUM_CONSTRAINTS = 11;
      var kSolverAttribute_MAX_ITERATIONS = 12;
      var kSolverAttribute_ERROR = 13;

      var kSolverAttribute_HARD_LOSS = 20;
      var kSolverAttribute_SOFT_LOSS = 21;

      var kSolverAttribute_REGULARIZER_WEIGHT = 30;

      var kSolverFlag_DEFAULT = 0;
      var kSolverFlag_REDUCE = 1 << 1;
      var kSolverFlag_LAGRANGE = 1 << 2;

      var solver_create = internals.cwrap("solver_create", "number", []);
      var solver_destroy = internals.cwrap("solver_destroy", null, ["number"]);
      var solver_add_variable = internals.cwrap("solver_add_variable", null, [
        "number",
        "number",
        "number",
        "boolean"
      ]);
      var solver_make_constant = internals.cwrap("solver_make_constant", null, [
        "number",
        "number"
      ]);
      var solver_add_constraint = internals.cwrap("solver_add_constraint", "number", [
        "number",
        "number",
        "number",
        "number",
        "number",
        "number"
      ]);
      var solver_add_constraint_coefficient = internals.cwrap(
        "solver_add_constraint_coefficient",
        null,
        ["number", "number", "number", "number"]
      );
      var solver_set_constraint_strength = internals.cwrap(
        "solver_set_constraint_strength",
        null,
        ["number", "number", "number"]
      );
      var solver_set_constraint_bias = internals.cwrap(
        "solver_set_constraint_bias",
        null,
        ["number", "number", "number"]
      );
      var solver_clear_constraint_coefficients = internals.cwrap(
        "solver_clear_constraint_coefficients",
        null,
        ["number", "number"]
      );
      var solver_set_values = internals.cwrap("solver_set_values", null, [
        "number",
        "number",
        "number",
        "number"
      ]);
      var solver_get_values = internals.cwrap("solver_get_values", null, [
        "number",
        "number",
        "number",
        "number"
      ]);
      var solver_set_value = internals.cwrap("solver_set_value", null, [
        "number",
        "number",
        "number"
      ]);
      var solver_get_value = internals.cwrap("solver_get_value", "number", [
        "number",
        "number"
      ]);
      var solver_solve = internals.cwrap("solver_solve", null, ["number"]);
      var solver_compute_loss = internals.cwrap("solver_compute_loss", null, [
        "number"
      ]);
      var solver_set_attribute_i = internals.cwrap("solver_set_attribute_i", null, [
        "number",
        "number",
        "number"
      ]);
      var solver_set_attribute_f = internals.cwrap("solver_set_attribute_f", null, [
        "number",
        "number",
        "number"
      ]);
      var solver_get_attribute_i = internals.cwrap(
        "solver_get_attribute_i",
        "number",
        ["number", "number"]
      );
      var solver_get_attribute_f = internals.cwrap(
        "solver_get_attribute_f",
        "number",
        ["number", "number"]
      );

      var linalg_matrix_create = internals.cwrap(
        "linalg_matrix_create",
        "number",
        []
      );
      var linalg_matrix_init = internals.cwrap("linalg_matrix_init", null, [
        "number",
        "number",
        "number",
        "number"
      ]);
      var linalg_matrix_fill = internals.cwrap("linalg_matrix_fill", null, [
        "number",
        "number"
      ]);
      var linalg_matrix_destroy = internals.cwrap("linalg_matrix_destroy", null, [
        "number"
      ]);

      var linalg_matrix_data = internals.cwrap("linalg_matrix_data", null, [
        "number"
      ]);
      var linalg_matrix_size = internals.cwrap("linalg_matrix_size", "number", [
        "number"
      ]);
      var linalg_matrix_rows = internals.cwrap("linalg_matrix_rows", "number", [
        "number"
      ]);
      var linalg_matrix_cols = internals.cwrap("linalg_matrix_cols", "number", [
        "number"
      ]);
      var linalg_matrix_row_stride = internals.cwrap(
        "linalg_matrix_row_stride",
        "number",
        ["number"]
      );
      var linalg_matrix_col_stride = internals.cwrap(
        "linalg_matrix_col_stride",
        "number",
        ["number"]
      );
      var linalg_matrix_norm = internals.cwrap("linalg_matrix_norm", null, [
        "number"
      ]);
      var linalg_matrix_l1_norm = internals.cwrap("linalg_matrix_l1_norm", null, [
        "number"
      ]);

      var linalg_matrix_add = internals.cwrap("linalg_matrix_add", null, [
        "number",
        "number",
        "number"
      ]);
      var linalg_matrix_sub = internals.cwrap("linalg_matrix_sub", null, [
        "number",
        "number",
        "number"
      ]);
      var linalg_matrix_scale = internals.cwrap("linalg_matrix_scale", null, [
        "number",
        "number",
        "number"
      ]);
      var linalg_matrix_add_scale = internals.cwrap("linalg_matrix_add_scale", null, [
        "number",
        "number",
        "number",
        "number",
        "number"
      ]);
      var linalg_matrix_emul = internals.cwrap("linalg_matrix_emul", null, [
        "number",
        "number",
        "number"
      ]);
      var linalg_matrix_ediv = internals.cwrap("linalg_matrix_ediv", null, [
        "number",
        "number",
        "number"
      ]);
      var linalg_matrix_mmul = internals.cwrap("linalg_matrix_mmul", null, [
        "number",
        "number",
        "number"
      ]);

      var linalg_solve_linear_system = internals.cwrap(
        "linalg_solve_linear_system",
        null,
        ["number", "number", "number", "number"]
      );

      // Helper classes
      var WASMBuffer = function () {
        this.byte_size = 64;
        this.pointer = memory_alloc(this.byte_size);
        this._setupArrays();
      };
      function powerOf8(sz) {
        if (sz % 8 == 0) return sz;
        return sz + (8 - (sz % 8));
      }
      WASMBuffer.prototype._setupArrays = function () {
        this.U32 = getUint32Array(this.pointer, this.byte_size / 4);
        this.F64 = getFloat64Array(this.pointer, this.byte_size / 8);
      };
      WASMBuffer.prototype.destroy = function () {
        this.byte_size = 0;
        this.U32 = null;
        this.F64 = null;
        memory_free(this.pointer);
      };
      WASMBuffer.prototype.reserve = function (bytes) {
        if (this.byte_size >= bytes) return;
        else {
          memory_free(this.pointer);
          this.byte_size = powerOf8(bytes * 2);
          this.pointer = memory_alloc(this.byte_size);
          this._setupArrays();
        }
      };

      // ConstraintSolver class
      var ConstraintSolver = function () {
        this.solver = solver_create();
        this.buffer = new WASMBuffer();
      };

      ConstraintSolver.STRENGTH_HARD = kSolverStrength_HARD;
      ConstraintSolver.STRENGTH_STRONG = kSolverStrength_STRONG;
      ConstraintSolver.STRENGTH_MEDIUM = kSolverStrength_MEDIUM;
      ConstraintSolver.STRENGTH_WEAK = kSolverStrength_WEAK;
      ConstraintSolver.STRENGTH_WEAKER = kSolverStrength_WEAKER;
      ConstraintSolver.STRENGTH_DISABLED = kSolverStrength_DISABLED;
      ConstraintSolver.FLAG_DEFAULT = kSolverFlag_DEFAULT;
      ConstraintSolver.FLAG_REDUCE = kSolverFlag_REDUCE;
      ConstraintSolver.FLAG_LAGRANGE = kSolverFlag_LAGRANGE;

      ConstraintSolver.prototype.destroy = function () {
        solver_destroy(this.solver);
        this.buffer.destroy();
      };
      ConstraintSolver.prototype.addVariable = function (variable_name, value, edit) {
        solver_add_variable(this.solver, variable_name, value, edit);
      };
      ConstraintSolver.prototype.makeConstant = function (variable_name) {
        solver_make_constant(this.solver, variable_name);
      };
      ConstraintSolver.prototype.addConstraint = function (
        strength,
        bias,
        variable_names,
        weights
      ) {
        if (variable_names != null && weights != null) {
          this.buffer.reserve(16 * weights.length);
          let a1 = this.buffer.U32;
          let a2 = this.buffer.F64;
          for (var i = 0; i < weights.length; i++) {
            a1[i] = variable_names[i];
            a2[i + weights.length] = weights[i];
          }
          return solver_add_constraint(
            this.solver,
            strength,
            bias,
            weights.length,
            this.buffer.pointer,
            this.buffer.pointer + 8 * weights.length
          );
        } else {
          return solver_add_constraint(this.solver, strength, bias, 0, 0, 0);
        }
      };
      ConstraintSolver.prototype.addConstraintCoefficient = function (
        constraint,
        variable_name,
        weight
      ) {
        solver_add_constraint_coefficient(
          this.solver,
          constraint,
          variable_name,
          weight
        );
      };
      ConstraintSolver.prototype.setConstraintStrength = function (
        constraint,
        strength
      ) {
        solver_set_constraint_strength(this.solver, constraint, strength);
      };
      ConstraintSolver.prototype.setConstraintBias = function (constraint, bias) {
        solver_set_constraint_bias(this.solver, constraint, bias);
      };
      ConstraintSolver.prototype.clearConstraintCoefficients = function (constraint) {
        solver_clear_constraint_coefficients(this.solver, constraint);
      };
      ConstraintSolver.prototype.solve = function () {
        solver_solve(this.solver);
      };
      ConstraintSolver.prototype.computeLoss = function () {
        solver_compute_loss(this.solver);
      };
      ConstraintSolver.prototype.setValue = function (variable_name, value) {
        solver_set_value(this.solver, variable_name, value);
      };
      ConstraintSolver.prototype.getValue = function (variable_name) {
        return solver_get_value(this.solver, variable_name);
      };
      function defineSolverProperty(name, string_name, type, ro) {
        desc = {};
        if (type == "i") {
          desc.get = function () {
            return solver_get_attribute_i(this.solver, name);
          };
          desc.set = function (value) {
            solver_set_attribute_i(this.solver, name, value);
          };
        }
        if (type == "f") {
          desc.get = function () {
            return solver_get_attribute_f(this.solver, name);
          };
          desc.set = function (value) {
            solver_set_attribute_f(this.solver, name, value);
          };
        }
        if (ro) {
          desc.set = function () {
            throw new Error("property " + string_name + " is readonly");
          };
        }
        Object.defineProperty(ConstraintSolver.prototype, string_name, desc);
      }
      defineSolverProperty(kSolverAttribute_REGULARIZER_WEIGHT, "regularizerWeight", "f");
      defineSolverProperty(kSolverAttribute_MAX_ITERATIONS, "maxIterations", "i");
      defineSolverProperty(kSolverAttribute_TOLERANCE, "tolerance", "f");
      defineSolverProperty(kSolverAttribute_FLAGS, "flags", "i");
      defineSolverProperty(
        kSolverAttribute_NUM_CONSTRAINTS,
        "numConstraints",
        "i",
        true
      );
      defineSolverProperty(kSolverAttribute_NUM_VARIABLES, "numVariables", "i", true);
      defineSolverProperty(
        kSolverAttribute_NUM_ITERATIONS,
        "numIterations",
        "i",
        true
      );
      defineSolverProperty(kSolverAttribute_ERROR, "error", "f", true);
      defineSolverProperty(kSolverAttribute_HARD_LOSS, "hardLoss", "f", true);
      defineSolverProperty(kSolverAttribute_SOFT_LOSS, "softLoss", "f", true);

      function Matrix() {
        this.matrix = linalg_matrix_create();
      }
      Matrix.prototype.destroy = function () {
        linalg_matrix_destroy(this.matrix);
      };
      Matrix.prototype.init = function (rows, cols) {
        linalg_matrix_init(this.matrix, rows, cols, 0);
      };
      Matrix.prototype.fill = function (value) {
        linalg_matrix_fill(this.matrix, value);
      };
      Matrix.prototype.data = function () {
        var length = linalg_matrix_size(this.matrix);
        return getFloat64Array(linalg_matrix_data(this.matrix), length);
      };
      Matrix.prototype.norm = function () {
        return linalg_matrix_norm(this.matrix);
      };
      Matrix.prototype.l1Norm = function () {
        return linalg_matrix_l1_norm(this.matrix);
      };
      Matrix.Add = function (dest, a, b) {
        linalg_matrix_add(dest.matrix, a.matrix, b.matrix);
      };
      Matrix.Sub = function (dest, a, b) {
        linalg_matrix_sub(dest.matrix, a.matrix, b.matrix);
      };
      Matrix.Scale = function (dest, a, s) {
        linalg_matrix_scale(dest.matrix, a.matrix, s);
      };
      Matrix.AddScale = function (dest, a, sa, b, sb) {
        linalg_matrix_add_scale(dest.matrix, a.matrix, sa, b.matrix, sb);
      };
      Matrix.EMul = function (dest, a, b) {
        linalg_matrix_emul(dest.matrix, a.matrix, b.matrix);
      };
      Matrix.EDiv = function (dest, a, b) {
        linalg_matrix_ediv(dest.matrix, a.matrix, b.matrix);
      };
      Matrix.MMul = function (dest, a, b) {
        linalg_matrix_mmul(dest.matrix, a.matrix, b.matrix);
      };
      Object.defineProperty(Matrix.prototype, "rows", {
        get: function () {
          return linalg_matrix_rows(this.matrix);
        },
        set: function () {
          throw new Error("property rows is readonly");
        }
      });
      Object.defineProperty(Matrix.prototype, "rowStride", {
        get: function () {
          return linalg_matrix_row_stride(this.matrix);
        },
        set: function () {
          throw new Error("property row_stride is readonly");
        }
      });
      Object.defineProperty(Matrix.prototype, "cols", {
        get: function () {
          return linalg_matrix_cols(this.matrix);
        },
        set: function () {
          throw new Error("property cols is readonly");
        }
      });
      Object.defineProperty(Matrix.prototype, "colStride", {
        get: function () {
          return linalg_matrix_col_stride(this.matrix);
        },
        set: function () {
          throw new Error("property col_stride is readonly");
        }
      });

      Matrix.SolveLinearSystem = function (X, ker, A, B) {
        linalg_solve_linear_system(X.matrix, ker.matrix, A.matrix, B.matrix);
      };

      // Exports
      exports.memoryAlloc = memory_alloc;
      exports.memoryFree = memory_free;

      exports.getUint8Array = getUint8Array;
      exports.getUint16Array = getUint16Array;
      exports.getUint32Array = getUint32Array;
      exports.getFloat64Array = getFloat64Array;
      exports.getFloat32Array = getFloat32Array;

      exports.ConstraintSolver = ConstraintSolver;

      exports.Matrix = Matrix;

      exports.initialize = initialize;


      /***/
    }),
/* 3 */
/***/ (function (module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function (process, __dirname, Buffer) {
        var Module = (function () {
          var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
          return (
            function (Module) {
              Module = Module || {};

              var Module = typeof Module !== "undefined" ? Module : {}; var moduleOverrides = {}; var key; for (key in Module) { if (Module.hasOwnProperty(key)) { moduleOverrides[key] = Module[key] } } Module["arguments"] = []; Module["thisProgram"] = "./this.program"; Module["quit"] = (function (status, toThrow) { throw toThrow }); Module["preRun"] = []; Module["postRun"] = []; var ENVIRONMENT_IS_WEB = false; var ENVIRONMENT_IS_WORKER = false; var ENVIRONMENT_IS_NODE = false; var ENVIRONMENT_IS_SHELL = false; ENVIRONMENT_IS_WEB = typeof window === "object"; ENVIRONMENT_IS_WORKER = typeof importScripts === "function"; ENVIRONMENT_IS_NODE = typeof process === "object" && "function" === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER; ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER; var scriptDirectory = ""; function locateFile(path) { if (Module["locateFile"]) { return Module["locateFile"](path, scriptDirectory) } else { return scriptDirectory + path } } if (ENVIRONMENT_IS_NODE) { scriptDirectory = __dirname + "/"; var nodeFS; var nodePath; Module["read"] = function shell_read(filename, binary) { var ret; ret = tryParseAsDataURI(filename); if (!ret) { if (!nodeFS) nodeFS = null; if (!nodePath) nodePath = null; filename = nodePath["normalize"](filename); ret = nodeFS["readFileSync"](filename) } return binary ? ret : ret.toString() }; Module["readBinary"] = function readBinary(filename) { var ret = Module["read"](filename, true); if (!ret.buffer) { ret = new Uint8Array(ret) } assert(ret.buffer); return ret }; if (process["argv"].length > 1) { Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/") } Module["arguments"] = process["argv"].slice(2); process["on"]("uncaughtException", (function (ex) { if (!(ex instanceof ExitStatus)) { throw ex } })); process["on"]("unhandledRejection", (function (reason, p) { process["exit"](1) })); Module["quit"] = (function (status) { process["exit"](status) }); Module["inspect"] = (function () { return "[Emscripten Module object]" }) } else if (ENVIRONMENT_IS_SHELL) { if (typeof read != "undefined") { Module["read"] = function shell_read(f) { var data = tryParseAsDataURI(f); if (data) { return intArrayToString(data) } return read(f) } } Module["readBinary"] = function readBinary(f) { var data; data = tryParseAsDataURI(f); if (data) { return data } if (typeof readbuffer === "function") { return new Uint8Array(readbuffer(f)) } data = read(f, "binary"); assert(typeof data === "object"); return data }; if (typeof scriptArgs != "undefined") { Module["arguments"] = scriptArgs } else if (typeof arguments != "undefined") { Module["arguments"] = arguments } if (typeof quit === "function") { Module["quit"] = (function (status) { quit(status) }) } } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) { if (ENVIRONMENT_IS_WEB) { if (document.currentScript) { scriptDirectory = document.currentScript.src } } else { scriptDirectory = self.location.href } if (_scriptDir) { scriptDirectory = _scriptDir } if (scriptDirectory.indexOf("blob:") !== 0) { scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1) } else { scriptDirectory = "" } Module["read"] = function shell_read(url) { try { var xhr = new XMLHttpRequest; xhr.open("GET", url, false); xhr.send(null); return xhr.responseText } catch (err) { var data = tryParseAsDataURI(url); if (data) { return intArrayToString(data) } throw err } }; if (ENVIRONMENT_IS_WORKER) { Module["readBinary"] = function readBinary(url) { try { var xhr = new XMLHttpRequest; xhr.open("GET", url, false); xhr.responseType = "arraybuffer"; xhr.send(null); return new Uint8Array(xhr.response) } catch (err) { var data = tryParseAsDataURI(url); if (data) { return data } throw err } } } Module["readAsync"] = function readAsync(url, onload, onerror) { var xhr = new XMLHttpRequest; xhr.open("GET", url, true); xhr.responseType = "arraybuffer"; xhr.onload = function xhr_onload() { if (xhr.status == 200 || xhr.status == 0 && xhr.response) { onload(xhr.response); return } var data = tryParseAsDataURI(url); if (data) { onload(data.buffer); return } onerror() }; xhr.onerror = onerror; xhr.send(null) }; Module["setWindowTitle"] = (function (title) { document.title = title }) } else { } var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null); var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out); for (key in moduleOverrides) { if (moduleOverrides.hasOwnProperty(key)) { Module[key] = moduleOverrides[key] } } moduleOverrides = undefined; var STACK_ALIGN = 16; function staticAlloc(size) { var ret = STATICTOP; STATICTOP = STATICTOP + size + 15 & -16; return ret } function alignMemory(size, factor) { if (!factor) factor = STACK_ALIGN; var ret = size = Math.ceil(size / factor) * factor; return ret } var asm2wasmImports = { "f64-rem": (function (x, y) { return x % y }), "debugger": (function () { debugger }) }; var functionPointers = new Array(0); var GLOBAL_BASE = 1024; var ABORT = false; var EXITSTATUS = 0; function assert(condition, text) { if (!condition) { abort("Assertion failed: " + text) } } function getCFunc(ident) { var func = Module["_" + ident]; assert(func, "Cannot call unknown function " + ident + ", make sure it is exported"); return func } var JSfuncs = { "stackSave": (function () { stackSave() }), "stackRestore": (function () { stackRestore() }), "arrayToC": (function (arr) { var ret = stackAlloc(arr.length); writeArrayToMemory(arr, ret); return ret }), "stringToC": (function (str) { var ret = 0; if (str !== null && str !== undefined && str !== 0) { var len = (str.length << 2) + 1; ret = stackAlloc(len); stringToUTF8(str, ret, len) } return ret }) }; var toC = { "string": JSfuncs["stringToC"], "array": JSfuncs["arrayToC"] }; function ccall(ident, returnType, argTypes, args, opts) { function convertReturnValue(ret) { if (returnType === "string") return Pointer_stringify(ret); if (returnType === "boolean") return Boolean(ret); return ret } var func = getCFunc(ident); var cArgs = []; var stack = 0; if (args) { for (var i = 0; i < args.length; i++) { var converter = toC[argTypes[i]]; if (converter) { if (stack === 0) stack = stackSave(); cArgs[i] = converter(args[i]) } else { cArgs[i] = args[i] } } } var ret = func.apply(null, cArgs); ret = convertReturnValue(ret); if (stack !== 0) stackRestore(stack); return ret } function cwrap(ident, returnType, argTypes, opts) { argTypes = argTypes || []; var numericArgs = argTypes.every((function (type) { return type === "number" })); var numericRet = returnType !== "string"; if (numericRet && numericArgs && !opts) { return getCFunc(ident) } return (function () { return ccall(ident, returnType, argTypes, arguments, opts) }) } function Pointer_stringify(ptr, length) { if (length === 0 || !ptr) return ""; var hasUtf = 0; var t; var i = 0; while (1) { t = HEAPU8[ptr + i >> 0]; hasUtf |= t; if (t == 0 && !length) break; i++; if (length && i == length) break } if (!length) length = i; var ret = ""; if (hasUtf < 128) { var MAX_CHUNK = 1024; var curr; while (length > 0) { curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK))); ret = ret ? ret + curr : curr; ptr += MAX_CHUNK; length -= MAX_CHUNK } return ret } return UTF8ToString(ptr) } var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined; function UTF8ArrayToString(u8Array, idx) { var endPtr = idx; while (u8Array[endPtr]) ++endPtr; if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) { return UTF8Decoder.decode(u8Array.subarray(idx, endPtr)) } else { var u0, u1, u2, u3, u4, u5; var str = ""; while (1) { u0 = u8Array[idx++]; if (!u0) return str; if (!(u0 & 128)) { str += String.fromCharCode(u0); continue } u1 = u8Array[idx++] & 63; if ((u0 & 224) == 192) { str += String.fromCharCode((u0 & 31) << 6 | u1); continue } u2 = u8Array[idx++] & 63; if ((u0 & 240) == 224) { u0 = (u0 & 15) << 12 | u1 << 6 | u2 } else { u3 = u8Array[idx++] & 63; if ((u0 & 248) == 240) { u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3 } else { u4 = u8Array[idx++] & 63; if ((u0 & 252) == 248) { u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4 } else { u5 = u8Array[idx++] & 63; u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5 } } } if (u0 < 65536) { str += String.fromCharCode(u0) } else { var ch = u0 - 65536; str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023) } } } } function UTF8ToString(ptr) { return UTF8ArrayToString(HEAPU8, ptr) } function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) { if (!(maxBytesToWrite > 0)) return 0; var startIdx = outIdx; var endIdx = outIdx + maxBytesToWrite - 1; for (var i = 0; i < str.length; ++i) { var u = str.charCodeAt(i); if (u >= 55296 && u <= 57343) { var u1 = str.charCodeAt(++i); u = 65536 + ((u & 1023) << 10) | u1 & 1023 } if (u <= 127) { if (outIdx >= endIdx) break; outU8Array[outIdx++] = u } else if (u <= 2047) { if (outIdx + 1 >= endIdx) break; outU8Array[outIdx++] = 192 | u >> 6; outU8Array[outIdx++] = 128 | u & 63 } else if (u <= 65535) { if (outIdx + 2 >= endIdx) break; outU8Array[outIdx++] = 224 | u >> 12; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } else if (u <= 2097151) { if (outIdx + 3 >= endIdx) break; outU8Array[outIdx++] = 240 | u >> 18; outU8Array[outIdx++] = 128 | u >> 12 & 63; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } else if (u <= 67108863) { if (outIdx + 4 >= endIdx) break; outU8Array[outIdx++] = 248 | u >> 24; outU8Array[outIdx++] = 128 | u >> 18 & 63; outU8Array[outIdx++] = 128 | u >> 12 & 63; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } else { if (outIdx + 5 >= endIdx) break; outU8Array[outIdx++] = 252 | u >> 30; outU8Array[outIdx++] = 128 | u >> 24 & 63; outU8Array[outIdx++] = 128 | u >> 18 & 63; outU8Array[outIdx++] = 128 | u >> 12 & 63; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } } outU8Array[outIdx] = 0; return outIdx - startIdx } function stringToUTF8(str, outPtr, maxBytesToWrite) { return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite) } var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined; var WASM_PAGE_SIZE = 65536; var ASMJS_PAGE_SIZE = 16777216; var MIN_TOTAL_MEMORY = 16777216; function alignUp(x, multiple) { if (x % multiple > 0) { x += multiple - x % multiple } return x } var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64; function updateGlobalBuffer(buf) { Module["buffer"] = buffer = buf } function updateGlobalBufferViews() { Module["HEAP8"] = HEAP8 = new Int8Array(buffer); Module["HEAP16"] = HEAP16 = new Int16Array(buffer); Module["HEAP32"] = HEAP32 = new Int32Array(buffer); Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer); Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer); Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer); Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer); Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer) } var STATIC_BASE, STATICTOP, staticSealed; var STACK_BASE, STACKTOP, STACK_MAX; var DYNAMIC_BASE, DYNAMICTOP_PTR; STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0; staticSealed = false; function abortOnCannotGrowMemory() { abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ") } if (!Module["reallocBuffer"]) Module["reallocBuffer"] = (function (size) { var ret; try { var oldHEAP8 = HEAP8; ret = new ArrayBuffer(size); var temp = new Int8Array(ret); temp.set(oldHEAP8) } catch (e) { return false } var success = _emscripten_replace_memory(ret); if (!success) return false; return ret }); function enlargeMemory() { var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; var LIMIT = 2147483648 - PAGE_MULTIPLE; if (HEAP32[DYNAMICTOP_PTR >> 2] > LIMIT) { return false } var OLD_TOTAL_MEMORY = TOTAL_MEMORY; TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY); while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) { if (TOTAL_MEMORY <= 536870912) { TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE) } else { TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT) } } var replacement = Module["reallocBuffer"](TOTAL_MEMORY); if (!replacement || replacement.byteLength != TOTAL_MEMORY) { TOTAL_MEMORY = OLD_TOTAL_MEMORY; return false } updateGlobalBuffer(replacement); updateGlobalBufferViews(); return true } var byteLength; try { byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get); byteLength(new ArrayBuffer(4)) } catch (e) { byteLength = (function (buffer) { return buffer.byteLength }) } var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880; var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216; if (TOTAL_MEMORY < TOTAL_STACK) err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")"); if (Module["buffer"]) { buffer = Module["buffer"] } else { if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") { Module["wasmMemory"] = new WebAssembly.Memory({ "initial": TOTAL_MEMORY / WASM_PAGE_SIZE }); buffer = Module["wasmMemory"].buffer } else { buffer = new ArrayBuffer(TOTAL_MEMORY) } Module["buffer"] = buffer } updateGlobalBufferViews(); function getTotalMemory() { return TOTAL_MEMORY } function callRuntimeCallbacks(callbacks) { while (callbacks.length > 0) { var callback = callbacks.shift(); if (typeof callback == "function") { callback(); continue } var func = callback.func; if (typeof func === "number") { if (callback.arg === undefined) { Module["dynCall_v"](func) } else { Module["dynCall_vi"](func, callback.arg) } } else { func(callback.arg === undefined ? null : callback.arg) } } } var __ATPRERUN__ = []; var __ATINIT__ = []; var __ATMAIN__ = []; var __ATPOSTRUN__ = []; var runtimeInitialized = false; function preRun() { if (Module["preRun"]) { if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]]; while (Module["preRun"].length) { addOnPreRun(Module["preRun"].shift()) } } callRuntimeCallbacks(__ATPRERUN__) } function ensureInitRuntime() { if (runtimeInitialized) return; runtimeInitialized = true; callRuntimeCallbacks(__ATINIT__) } function preMain() { callRuntimeCallbacks(__ATMAIN__) } function postRun() { if (Module["postRun"]) { if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]]; while (Module["postRun"].length) { addOnPostRun(Module["postRun"].shift()) } } callRuntimeCallbacks(__ATPOSTRUN__) } function addOnPreRun(cb) { __ATPRERUN__.unshift(cb) } function addOnPostRun(cb) { __ATPOSTRUN__.unshift(cb) } function writeArrayToMemory(array, buffer) { HEAP8.set(array, buffer) } var runDependencies = 0; var runDependencyWatcher = null; var dependenciesFulfilled = null; function addRunDependency(id) { runDependencies++; if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) } } function removeRunDependency(id) { runDependencies--; if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) } if (runDependencies == 0) { if (runDependencyWatcher !== null) { clearInterval(runDependencyWatcher); runDependencyWatcher = null } if (dependenciesFulfilled) { var callback = dependenciesFulfilled; dependenciesFulfilled = null; callback() } } } Module["preloadedImages"] = {}; Module["preloadedAudios"] = {}; var dataURIPrefix = "data:application/wasm;base64,"; function isDataURI(filename) { return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0 } function integrateWasmJS() { var wasmTextFile = ""; var wasmBinaryFile = "data:application/wasm;base64,AGFzbQEAAAAB1wEcYAAAYAR/f39/AGAGf39/f39/AGAFf39/f38AYAF/AX9gA39/fwF/YAF/AGAAAX9gA39/fwBgAn9/AGAFf398f3wAYAJ/fABgAn9/AXxgAX8BfGADf398AGACf38Bf2AHf39/f39/fwBgDH9/f39/f398f39/fwBgDH9/f39/f39/f3x/fwBgA39/fwF8YAZ/f3x/f38Bf2AEf39/fABgBH9/fH8AYAd/f39/fH9/AGAIf39/f3x/f38AYAh/f39/f39/fwBgBX9/f39/AX9gBH9/f38BfwK+AhADZW52Bm1lbW9yeQIAgAIDZW52BXRhYmxlAXABIyMDZW52CXRhYmxlQmFzZQN/AANlbnYORFlOQU1JQ1RPUF9QVFIDfwADZW52CFNUQUNLVE9QA38AA2VudgVhYm9ydAAGA2Vudg1lbmxhcmdlTWVtb3J5AAcDZW52DmdldFRvdGFsTWVtb3J5AAcDZW52F2Fib3J0T25DYW5ub3RHcm93TWVtb3J5AAcDZW52Dl9fX2Fzc2VydF9mYWlsAAEDZW52GV9fX2N4YV9hbGxvY2F0ZV9leGNlcHRpb24ABANlbnYMX19fY3hhX3Rocm93AAgDZW52C19fX3NldEVyck5vAAYDZW52Bl9hYm9ydAAAA2VudhZfZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAUDZW52Cl9sbHZtX3RyYXAAAAPDAcEBBg8FBAgECQgFDwkJBBEGCQkBCQkQCQkGDgEJCAkJBgkBCAkJBgkSARABCQIDAQQGBgMBGwQPCQgGCRkJBAgIFwYGBgwOAQEJFAkGFgYJBgYEAQ4IDggOCQEMDwwGBwYJFhUUEwEICAEDDBATEAEICBAPAQkICAkGCQEIBA4EDQgMAQcABQkGCwYEBAEIAwIbAQMCBQgJBAYGGgkJCQQGBgkIAQgBCAcMCA8JCQgNBA8JAQgMCAIIDBgPCAoPBgYIBAYLAn8BIwELfwEjAgsHswgvEl9saW5hbGdfbWF0cml4X2FkZADKARhfbGluYWxnX21hdHJpeF9hZGRfc2NhbGUAxgEZX2xpbmFsZ19tYXRyaXhfY29sX3N0cmlkZQBHE19saW5hbGdfbWF0cml4X2NvbHMAuQEVX2xpbmFsZ19tYXRyaXhfY3JlYXRlALEBE19saW5hbGdfbWF0cml4X2RhdGEAqAEWX2xpbmFsZ19tYXRyaXhfZGVzdHJveQCjARNfbGluYWxnX21hdHJpeF9lZGl2AJ8BE19saW5hbGdfbWF0cml4X2VtdWwAlwETX2xpbmFsZ19tYXRyaXhfZmlsbACSARNfbGluYWxnX21hdHJpeF9pbml0AIwBFl9saW5hbGdfbWF0cml4X2wxX25vcm0AiwETX2xpbmFsZ19tYXRyaXhfbW11bACKARNfbGluYWxnX21hdHJpeF9ub3JtAIkBGV9saW5hbGdfbWF0cml4X3Jvd19zdHJpZGUAiAETX2xpbmFsZ19tYXRyaXhfcm93cwBHFF9saW5hbGdfbWF0cml4X3NjYWxlAIcBE19saW5hbGdfbWF0cml4X3NpemUAhgESX2xpbmFsZ19tYXRyaXhfc3ViAIUBG19saW5hbGdfc29sdmVfbGluZWFyX3N5c3RlbQCEAQdfbWFsbG9jABANX21lbW9yeV9hbGxvYwBbDF9tZW1vcnlfZnJlZQBVFl9zb2x2ZXJfYWRkX2NvbnN0cmFpbnQAbSJfc29sdmVyX2FkZF9jb25zdHJhaW50X2NvZWZmaWNpZW50AGwUX3NvbHZlcl9hZGRfdmFyaWFibGUAayVfc29sdmVyX2NsZWFyX2NvbnN0cmFpbnRfY29lZmZpY2llbnRzAGoUX3NvbHZlcl9jb21wdXRlX2xvc3MAaQ5fc29sdmVyX2NyZWF0ZQBoD19zb2x2ZXJfZGVzdHJveQBnF19zb2x2ZXJfZ2V0X2F0dHJpYnV0ZV9mAGYXX3NvbHZlcl9nZXRfYXR0cmlidXRlX2kAZRFfc29sdmVyX2dldF92YWx1ZQBkEl9zb2x2ZXJfZ2V0X3ZhbHVlcwBjFV9zb2x2ZXJfbWFrZV9jb25zdGFudABiF19zb2x2ZXJfc2V0X2F0dHJpYnV0ZV9mAGEXX3NvbHZlcl9zZXRfYXR0cmlidXRlX2kAYBtfc29sdmVyX3NldF9jb25zdHJhaW50X2JpYXMAXx9fc29sdmVyX3NldF9jb25zdHJhaW50X3N0cmVuZ3RoAF4RX3NvbHZlcl9zZXRfdmFsdWUAXRJfc29sdmVyX3NldF92YWx1ZXMAXA1fc29sdmVyX3NvbHZlAFoJZHluQ2FsbF92AJEBCmR5bkNhbGxfdmkAkAEKc3RhY2tB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CyADIAJB4ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB5ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB5gBqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB6gBqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB7ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB8ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB+ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB/gBqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBggFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBiAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBigFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBjgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBlAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBlgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBnAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBogFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBpgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyAD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SgRAIAJBAnYhBANAIBUoAgAiBSABIARBf2oiC0ECdGooAgAiBkEobGorAwAhHiAFIAZBKGxqQQxqIQggBSAGQShsakEYaiEOAkAgBSAGQShsakEQaiIHKAIAIgEEfyAOKAIAIREgBSAGQShsakEQaiEDAkACQANAIBEgASgCECICSARAIAEoAgAiAkUNAgUgAiARTg0DIAFBBGoiAigCACIDRQ0FIAIhASADIQILIAEhAyACIQEMAAALAAsgASECDAILIAMFIAciAQshAgsgAigCACIDRQRAQSAQDiIDIA4oAgA2AhAgA0QAAAAAAAAAADkDGCADQQA2AgAgA0EANgIEIAMgATYCCCACIAM2AgAgCCgCACgCACIBBH8gCCABNgIAIAIoAgAFIAMLIQEgBSAGQShsaigCECABEBYgBSAGQShsakEUaiIBIAEoAgBBAWo2AgALIAMrAxghHyAOKAIAIQUgCCgCACIBIAdHBEADQCABKAIQIgIgBUcEQCAeIAErAxggACgCACACQQV0aigCDCsDCKKgIR4LAkAgASgCBCICBEAgAiEBA0AgASgCACICBEAgAiEBDAELCwUgAUEIaiICKAIAIgMoAgAgAUYEQCADIQEMAgsgAiEBA38gASgCACIDQQhqIgEoAgAiAigCACADRgR/IAIFDAELCyEBCwsgASAHRw0ACwsgACgCACAFQQV0aigCDCAemiAfozkDCCAEQQFMDQIgCyEEIAkoAgAhAQwAAAsACwsgEigCACIABEAgAEF8aigCABALCyAQKAIAIgAEQCAAQXxqKAIAEAsLIA0oAgAiAARAIABBfGooAgAQCwsgFygCABALIBYoAgAQCyAKKAIUIgAEQCAAEAsLIAooAhgiAARAIAAQCwsgDygCACIARQRAIAwkBA8LIBMgADYCACAAEAsgDCQEC70BAQZ/IwQhBSMEQRBqJAQgAEEANgIAIABBADYCBCAAQQA2AgggAUEIaiIEKAIAIgJFIAFBBGoiBigCACIDRXJFBEBB/////wcgA20gAkgEQEEEEAUiB0HwDDYCACAHQcALQQYQBgsLIAAgAiADEBIgBCgCACICRSAGKAIAIgNFckUEQEH/////ByADbSACSARAQQQQBSIEQfAMNgIAIARBwAtBBhAGCwsgACACIAMQEiAAIAEgBRCuASAFJAQLwScC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AyAOBEAgDCADNgIIIAsgAUEQaiICNgIAIAJBADYCACANQQA2AgAgCigCACECIAAoAgAhBQUgCCADNgIACyAHIARBKGxqQRhqIgMgAUEYaiIBKQMANwMAIAMgASkDCDcDCCACIAVGBEAgBiEDBSAGIQEDQCABQVhqIgMgAkFYaiIEKQMANwMAIAMgBCgCCDYCCCABQWRqIgsgAkFkaiIMKAIANgIAIAFBaGogAkFoaigCACINNgIAIAFBbGogAkFsaiIOKAIAIhA2AgAgAUFoaiEIIBAEQCANIAg2AgggDCACQWhqIgg2AgAgCEEANgIAIA5BADYCAAUgCyAINgIACyABQXBqIgEgAkFwaiICKQMANwMAIAEgAikDCDcDCCAEIAVHBEAgBCECIAMhAQwBCwsgACgCACEFIAooAgAhAgsgACADNgIAIAogBkEoajYCACAPIAcgCUEobGo2AgAgAiAFRwRAIAIhAANAIABBZGogAEFoaigCABAaIABBWGoiACAFRw0ACwsgBUUEQA8LIAUQCwv/AwERfyAAQQRqIgcoAgAgACgCACIDa0EFdSIEQQFqIgJB////P0sEQBAICwJ/IABBCGoiCygCACADayIDQQV1Qf///x9JIRIgA0EEdSIDIAJPBEAgAyECCyASCwR/IAIFQf///z8LIggEQCAIQf///z9LBEBBCBAFIgJBqBYQFSACQZgNNgIAIAJB4AtBCBAGBSAIQQV0EA4hCQsLIAkgBEEFdGoiAyABEEEgACgCACIKIQEgBygCACICIApGBH8gAyEEIAoFIARBf2ogAkFgaiABa0EFdmshDCACIQEgAyECA0AgAkFgaiIFIAFBYGoiBCkCADcCACAFIAQpAgg3AgggAkFwaiINIAFBcGoiDigCADYCACACQXRqIAFBdGooAgAiDzYCACACQXhqIAFBeGoiECgCACIRNgIAIAJBdGohBiARBEAgDyAGNgIIIA4gAUF0aiIGNgIAIAZBADYCACAQQQA2AgAFIA0gBjYCAAsgAkF8aiABQXxqLAAAOgAAIAQgCkcEQCAEIQEgBSECDAELCyAJIAxBBXRqIQQgACgCACEBIAcoAgALIQIgACAENgIAIAcgA0EgajYCACALIAkgCEEFdGo2AgAgAiABRwRAIAIhAANAIABBcGogAEF0aigCABAgIABBYGoiACAB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JAQPCyAEQRRqIRIgBEEQaiENIARBDGohGCAEQRxqIRkgAEEkaiEPIABBKGohGiAEQQxqIRMgBEEQaiEbIARBDGohHCAEQRhqIRQgAEEMaiEdQQAhBgNAIAooAgBBCkcEQCAEQgA3AwAgBEIANwMIIARCADcDECAEQgA3AxggBEIANwMgIBggDTYCACAZQQA2AgAgDygCACICIBooAgBJBEAgAiAEKQMANwMAIAIgBCgCCDYCCCACQQxqIgUgEygCADYCACACIBsoAgAiBzYCECACIBIoAgAiCDYCFCACQRBqIQMgCARAIAcgAzYCCCATIA02AgAgDUEANgIAIBJBADYCAAUgBSADNgIACyACQRhqIgIgFCkDADcDACACIBQpAwg3AwggDyAPKAIAQShqNgIABSARIAQQpQELIBwgDSgCABAaIBEoAgAiCSAGQShsaiIOIAorAyA5AwAgCSAGQShsakEIaiIeIAooAgA2AgAgCSAGQShsakF/NgIYIApBCGoiHygCACAKQQRqIiAoAgAiAkYEQCAJIAZBKGxqQRBqIQgFIApBEGohISAJIAZBKGxqQQxqIQwgCSAGQShsakEQaiEHIAkgBkEobGpBEGohCyAJIAZBKGxqQRRqIRBBACEIA0AgBCACIAhBAnRqKAIANgIAAn8gASAEEBQsAARFISIgISgCACAIQQN0aisDACEjICILBEAgIyABIAQQFCsDCKIhJCAOIgIrAwAhIwUgHSAEEEAhFSAHKAIAIgIEQCAVKAIAIRYgCyEDAkACQANAIBYgAigCECIFSAR/IAIoAgAiBUUNAiACIQMgBQUgBSAWTg0DIAJBBGoiAygCACIFRQ0DIAULIQIMAAALAAsgAiEDCwUgByICIQMLIAMoAgAiBUUEQEEgEA4iBSAVKAIANgIQIAVEAAAAAAAAAAA5AxggBUEANgIAIAVBADYCBCAFIAI2AgggAyAFNgIAIAwoAgAoAgAiAgR/IAwgAjYCACADKAIABSAFCyECIAsoAgAgAhAWIBAgECgCAEEBajYCAAsgBUEYaiIDIQIgAysDACEkCyACICMgJKA5AwAgCEEBaiIIIB8oAgAgICgCACICa0ECdUkNAAsgByEICyAAIA4gBhBCIAkgBkEobGooAgwiBSAIRwRAA0AgACgCACILIAUoAhAiDEEFdGpBEGohEAJA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Ly4uL3RoaXJkX3BhcnR5L0VpZ2VuL0VpZ2VuL3NyYy9MVS9GdWxsUGl2TFUuaABrZXJuZWwAcmFuawByaHMucm93cygpID09IHJvd3MAX3NvbHZlX2ltcGwAcGVybXV0YXRpb25QAHN0YXJ0Um93ID49IDAgJiYgYmxvY2tSb3dzID49IDAgJiYgc3RhcnRSb3cgPD0geHByLnJvd3MoKSAtIGJsb2NrUm93cyAmJiBzdGFydENvbCA+PSAwICYmIGJsb2NrQ29scyA+PSAwICYmIHN0YXJ0Q29sIDw9IHhwci5jb2xzKCkgLSBibG9ja0NvbHMAcGVybXV0YXRpb25RAHYgPT0gVChWYWx1ZSkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS91dGlsL1hwckhlbHBlci5oAHZhcmlhYmxlX2lmX2R5bmFtaWMAcm93cyA9PSB0aGlzLT5yb3dzKCkgJiYgY29scyA9PSB0aGlzLT5jb2xzKCkgJiYgIkRlbnNlQmFzZTo6cmVzaXplKCkgZG9lcyBub3QgYWN0dWFsbHkgYWxsb3cgdG8gcmVzaXplLiIAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9EZW5zZUJhc2UuaAAoKCFQYW5lbE1vZGUpICYmIHN0cmlkZT09MCAmJiBvZmZzZXQ9PTApIHx8IChQYW5lbE1vZGUgJiYgc3RyaWRlPj1kZXB0aCAmJiBvZmZzZXQ8PXN0cmlkZSkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9wcm9kdWN0cy9HZW5lcmFsQmxvY2tQYW5lbEtlcm5lbC5oAGRzdC5yb3dzKCk9PWFfbGhzLnJvd3MoKSAmJiBkc3QuY29scygpPT1hX3Jocy5jb2xzKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9wcm9kdWN0cy9HZW5lcmFsTWF0cml4TWF0cml4LmgAc2NhbGVBbmRBZGRUbwBtYXRyaXhMVQBtX2lzSW5pdGlhbGl6ZWQgfHwgbV91c2VQcmVzY3JpYmVkVGhyZXNob2xkAHRocmVzaG9sZABub256ZXJvUGl2b3RzAHJvdyA+PSAwICYmIHJvdyA8IHJvd3MoKSAmJiBjb2wgPj0gMCAmJiBjb2wgPCBjb2xzKCkAaT49MCAmJiBqPj0wICYmIGk8c2l6ZSgpICYmIGo8c2l6ZSgpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUGVybXV0YXRpb25NYXRyaXguaABhcHBseVRyYW5zcG9zaXRpb25PblRoZVJpZ2h0AGFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUAaW5kZXggPj0gMCAmJiBpbmRleCA8IHNpemUoKQBzcmMvY3BwLy4uLy4uL3RoaXJkX3BhcnR5L0VpZ2VuL0VpZ2VuL3NyYy9Db3JlL0RlbnNlQ29lZmZzQmFzZS5oAG9wZXJhdG9yW10AZHN0LnJvd3MoKSA9PSBkc3RSb3dzICYmIGRzdC5jb2xzKCkgPT0gZHN0Q29scwBzcmMvY3BwLy4uLy4uL3RoaXJkX3BhcnR5L0VpZ2VuL0VpZ2VuL3NyYy9Db3JlL0Fzc2lnbkV2YWx1YXRvci5oAHJlc2l6ZV9pZl9hbGxvd2VkAG1faXNJbml0aWFsaXplZCAmJiAiU29sdmVyIGlzIG5vdCBpbml0aWFsaXplZC4iAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0l0ZXJhdGl2ZUxpbmVhclNvbHZlcnMvSXRlcmF0aXZlU29sdmVyQmFzZS5oAHNvbHZlV2l0aEd1ZXNzAGRlcml2ZWQoKS5yb3dzKCk9PWIucm93cygpICYmICJzb2x2ZSgpOiBpbnZhbGlkIG51bWJlciBvZiByb3dzIG9mIHRoZSByaWdodCBoYW5kIHNpZGUgbWF0cml4IGIiAG1faXNJbml0aWFsaXplZCAmJiAiQ29uanVnYXRlR3JhZGllbnQgaXMgbm90IGluaXRpYWxpemVkLiIAaXRlcmF0aW9ucwBsaHMuY29scygpID09IHJocy5yb3dzKCkgJiYgImludmFsaWQgbWF0cml4IHByb2R1Y3QiICYmICJpZiB5b3Ugd2FudGVkIGEgY29lZmYtd2lzZSBvciBhIGRvdCBwcm9kdWN0IHVzZSB0aGUgcmVzcGVjdGl2ZSBleHBsaWNpdCBmdW5jdGlvbnMiAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUHJvZHVjdC5oAFByb2R1Y3QAYUxocy5yb3dzKCkgPT0gYVJocy5yb3dzKCkgJiYgYUxocy5jb2xzKCkgPT0gYVJocy5jb2xzKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9Dd2lzZUJpbmFyeU9wLmgAQ3dpc2VCaW5hcnlPcAByb3dzID49IDAgJiYgKFJvd3NBdENvbXBpbGVUaW1lID09IER5bmFtaWMgfHwgUm93c0F0Q29tcGlsZVRpbWUgPT0gcm93cykgJiYgY29scyA+PSAwICYmIChDb2xzQXRDb21waWxlVGltZSA9PSBEeW5hbWljIHx8IENvbHNBdENvbXBpbGVUaW1lID09IGNvbHMpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvQ3dpc2VOdWxsYXJ5T3AuaABDd2lzZU51bGxhcnlPcAB0aGlzLT5yb3dzKCk+MCAmJiB0aGlzLT5jb2xzKCk+MCAmJiAieW91IGFyZSB1c2luZyBhbiBlbXB0eSBtYXRyaXgiAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUmVkdXguaAByZWR1eABtX2lzSW5pdGlhbGl6ZWQgJiYgIkRpYWdvbmFsUHJlY29uZGl0aW9uZXIgaXMgbm90IGluaXRpYWxpemVkLiIAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvSXRlcmF0aXZlTGluZWFyU29sdmVycy9CYXNpY1ByZWNvbmRpdGlvbmVycy5oAHNvbHZlAG1faW52ZGlhZy5zaXplKCk9PWIucm93cygpICYmICJEaWFnb25hbFByZWNvbmRpdGlvbmVyOjpzb2x2ZSgpOiBpbnZhbGlkIG51bWJlciBvZiByb3dzIG9mIHRoZSByaWdodCBoYW5kIHNpZGUgbWF0cml4IGIiAHNpemUoKSA9PSBvdGhlci5zaXplKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9Eb3QuaABkb3QAZHN0LnJvd3MoKSA9PSBzcmMucm93cygpICYmIGRzdC5jb2xzKCkgPT0gc3JjLmNvbHMoKQBtYXQucm93cygpPjAgJiYgbWF0LmNvbHMoKT4wICYmICJ5b3UgYXJlIHVzaW5nIGFuIGVtcHR5IG1hdHJpeCIAcnVuAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUHJvZHVjdEV2YWx1YXRvcnMuaAAoaT49MCkgJiYgKCAoKEJsb2NrUm93cz09MSkgJiYgKEJsb2NrQ29scz09WHByVHlwZTo6Q29sc0F0Q29tcGlsZVRpbWUpICYmIGk8eHByLnJvd3MoKSkgfHwoKEJsb2NrUm93cz09WHByVHlwZTo6Um93c0F0Q29tcGlsZVRpbWUpICYmIChCbG9ja0NvbHM9PTEpICYmIGk8eHByLmNvbHMoKSkpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvQmxvY2suaABCbG9jawByb3dzKCk+MCAmJiBjb2xzKCk+MCAmJiAieW91IGFyZSB1c2luZyBhIG5vbiBpbml0aWFsaXplZCBtYXRyaXgiAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL1NwYXJzZUNvcmUvU3BhcnNlUmVkdXguaABzdW0Ab3BlcmF0b3IoKQAoZGF0YVB0ciA9PSAwKSB8fCAoIHJvd3MgPj0gMCAmJiAoUm93c0F0Q29tcGlsZVRpbWUgPT0gRHluYW1pYyB8fCBSb3dzQXRDb21waWxlVGltZSA9PSByb3dzKSAmJiBjb2xzID49IDAgJiYgKENvbHNBdENvbXBpbGVUaW1lID09IER5bmFtaWMgfHwgQ29sc0F0Q29tcGlsZVRpbWUgPT0gY29scykpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvTWFwQmFzZS5oAE1hcEJhc2UAdmVjU2l6ZSA+PSAwACghKFJvd3NBdENvbXBpbGVUaW1lIT1EeW5hbWljKSB8fCAocm93cz09Um93c0F0Q29tcGlsZVRpbWUpKSAmJiAoIShDb2xzQXRDb21waWxlVGltZSE9RHluYW1pYykgfHwgKGNvbHM9PUNvbHNBdENvbXBpbGVUaW1lKSkgJiYgKCEoUm93c0F0Q29tcGlsZVRpbWU9PUR5bmFtaWMgJiYgTWF4Um93c0F0Q29tcGlsZVRpbWUhPUR5bmFtaWMpIHx8IChyb3dzPD1NYXhSb3dzQXRDb21waWxlVGltZSkpICYmICghKENvbHNBdENvbXBpbGVUaW1lPT1EeW5hbWljICYmIE1heENvbHNBdENvbXBpbGVUaW1lIT1EeW5hbWljKSB8fCAoY29sczw9TWF4Q29sc0F0Q29tcGlsZVRpbWUpKSAmJiByb3dzPj0wICYmIGNvbHM+PTAgJiYgIkludmFsaWQgc2l6ZXMgd2hlbiByZXNpemluZyBhIG1hdHJpeCBvciBhcnJheS4iAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUGxhaW5PYmplY3RCYXNlLmgAcmVzaXplAGl0LT5yb3coKT49MCAmJiBpdC0+cm93KCk8bWF0LnJvd3MoKSAmJiBpdC0+Y29sKCk+PTAgJiYgaXQtPmNvbCgpPG1hdC5jb2xzKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvU3BhcnNlQ29yZS9TcGFyc2VNYXRyaXguaABzZXRfZnJvbV90cmlwbGV0cwAhaXNDb21wcmVzc2VkKCkAaW5zZXJ0QmFja1VuY29tcHJlc3NlZABtX2lubmVyTm9uWmVyb3Nbb3V0ZXJdPD0obV9vdXRlckluZGV4W291dGVyKzFdIC0gbV9vdXRlckluZGV4W291dGVyXSkAY29sbGFwc2VEdXBsaWNhdGVzACgoU2l6ZUF0Q29tcGlsZVRpbWUgPT0gRHluYW1pYyAmJiAoTWF4U2l6ZUF0Q29tcGlsZVRpbWU9PUR5bmFtaWMgfHwgc2l6ZTw9TWF4U2l6ZUF0Q29tcGlsZVRpbWUpKSB8fCBTaXplQXRDb21waWxlVGltZSA9PSBzaXplKSAmJiBzaXplPj0wAFN0OWV4Y2VwdGlvbgBOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQBTdDl0eXBlX2luZm8ATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAE4xMF9fY3h4YWJpdjExN19fY2xhc3NfdHlwZV9pbmZvRQBzdGQ6OmJhZF9hbGxvYwBTdDliYWRfYWxsb2MAU3QxMWxvZ2ljX2Vycm9yAFN0MTJsZW5ndGhfZXJyb3I="; var asmjsCodeFile = ""; if (!isDataURI(wasmTextFile)) { wasmTextFile = locateFile(wasmTextFile) } if (!isDataURI(wasmBinaryFile)) { wasmBinaryFile = locateFile(wasmBinaryFile) } if (!isDataURI(asmjsCodeFile)) { asmjsCodeFile = locateFile(asmjsCodeFile) } var wasmPageSize = 64 * 1024; var info = { "global": null, "env": null, "asm2wasm": asm2wasmImports, "parent": Module }; var exports = null; function mergeMemory(newBuffer) { var oldBuffer = Module["buffer"]; if (newBuffer.byteLength < oldBuffer.byteLength) { err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here") } var oldView = new Int8Array(oldBuffer); var newView = new Int8Array(newBuffer); newView.set(oldView); updateGlobalBuffer(newBuffer); updateGlobalBufferViews() } function fixImports(imports) { return imports } function getBinary() { try { if (Module["wasmBinary"]) { return new Uint8Array(Module["wasmBinary"]) } var binary = tryParseAsDataURI(wasmBinaryFile); if (binary) { return binary } if (Module["readBinary"]) { return Module["readBinary"](wasmBinaryFile) } else { throw "both async and sync fetching of the wasm failed" } } catch (err) { abort(err) } } function getBinaryPromise() { if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") { return null } return new Promise((function (resolve, reject) { resolve(getBinary()) })) } function doNativeWasm(global, env, providedBuffer) { if (typeof WebAssembly !== "object") { err("no native wasm support detected"); return false } if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) { err("no native wasm Memory in use"); return false } env["memory"] = Module["wasmMemory"]; info["global"] = { "NaN": NaN, "Infinity": Infinity }; info["global.Math"] = Math; info["env"] = env; function receiveInstance(instance, module) { exports = instance.exports; if (exports.memory) mergeMemory(exports.memory); Module["asm"] = exports; Module["usingWasm"] = true; removeRunDependency("wasm-instantiate") } addRunDependency("wasm-instantiate"); if (Module["instantiateWasm"]) { try { return Module["instantiateWasm"](info, receiveInstance) } catch (e) { err("Module.instantiateWasm callback failed with error: " + e); return false } } function receiveInstantiatedSource(output) { receiveInstance(output["instance"], output["module"]) } function instantiateArrayBuffer(receiver) { WebAssembly.instantiate(getBinary(), info).then(receiver).catch((function (reason) { err("failed to asynchronously prepare wasm: " + reason); abort(reason) })) } if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") { WebAssembly.instantiateStreaming(wasmBinaryFile, info).then(receiveInstantiatedSource).catch((function (reason) { err("wasm streaming compile failed: " + reason); err("falling back to ArrayBuffer instantiation"); instantiateArrayBuffer(receiveInstantiatedSource) })) } else { instantiateArrayBuffer(receiveInstantiatedSource) } return {} } Module["asmPreload"] = Module["asm"]; var asmjsReallocBuffer = Module["reallocBuffer"]; var wasmReallocBuffer = (function (size) { var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; size = alignUp(size, PAGE_MULTIPLE); var old = Module["buffer"]; var oldSize = old.byteLength; if (Module["usingWasm"]) { try { var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize); if (result !== (-1 | 0)) { return Module["buffer"] = Module["wasmMemory"].buffer } else { return null } } catch (e) { return null } } }); Module["reallocBuffer"] = (function (size) { if (finalMethod === "asmjs") { return asmjsReallocBuffer(size) } else { return wasmReallocBuffer(size) } }); var finalMethod = ""; Module["asm"] = (function (global, env, providedBuffer) { env = fixImports(env); if (!env["table"]) { var TABLE_SIZE = Module["wasmTableSize"]; if (TABLE_SIZE === undefined) TABLE_SIZE = 1024; var MAX_TABLE_SIZE = Module["wasmMaxTableSize"]; if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") { if (MAX_TABLE_SIZE !== undefined) { env["table"] = new WebAssembly.Table({ "initial": TABLE_SIZE, "maximum": MAX_TABLE_SIZE, "element": "anyfunc" }) } else { env["table"] = new WebAssembly.Table({ "initial": TABLE_SIZE, element: "anyfunc" }) } } else { env["table"] = new Array(TABLE_SIZE) } Module["wasmTable"] = env["table"] } if (!env["memoryBase"]) { env["memoryBase"] = Module["STATIC_BASE"] } if (!env["tableBase"]) { env["tableBase"] = 0 } var exports; exports = doNativeWasm(global, env, providedBuffer); assert(exports, "no binaryen method succeeded."); return exports }) } integrateWasmJS(); STATIC_BASE = GLOBAL_BASE; STATICTOP = STATIC_BASE + 6976; __ATINIT__.push(); var STATIC_BUMP = 6976; Module["STATIC_BASE"] = STATIC_BASE; Module["STATIC_BUMP"] = STATIC_BUMP; STATICTOP += 16; function ___assert_fail(condition, filename, line, func) { abort("Assertion failed: " + Pointer_stringify(condition) + ", at: " + [filename ? Pointer_stringify(filename) : "unknown filename", line, func ? Pointer_stringify(func) : "unknown function"]) } function ___cxa_allocate_exception(size) { return _malloc(size) } function __ZSt18uncaught_exceptionv() { return !!__ZSt18uncaught_exceptionv.uncaught_exception } var EXCEPTIONS = { last: 0, caught: [], infos: {}, deAdjust: (function (adjusted) { if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted; for (var key in EXCEPTIONS.infos) { var ptr = +key; var info = EXCEPTIONS.infos[ptr]; if (info.adjusted === adjusted) { return ptr } } return adjusted }), addRef: (function (ptr) { if (!ptr) return; var info = EXCEPTIONS.infos[ptr]; info.refcount++ }), decRef: (function (ptr) { if (!ptr) return; var info = EXCEPTIONS.infos[ptr]; assert(info.refcount > 0); info.refcount--; if (info.refcount === 0 && !info.rethrown) { if (info.destructor) { Module["dynCall_vi"](info.destructor, ptr) } delete EXCEPTIONS.infos[ptr]; ___cxa_free_exception(ptr) } }), clearRef: (function (ptr) { if (!ptr) return; var info = EXCEPTIONS.infos[ptr]; info.refcount = 0 }) }; function ___cxa_throw(ptr, type, destructor) { EXCEPTIONS.infos[ptr] = { ptr: ptr, adjusted: ptr, type: type, destructor: destructor, refcount: 0, caught: false, rethrown: false }; EXCEPTIONS.last = ptr; if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) { __ZSt18uncaught_exceptionv.uncaught_exception = 1 } else { __ZSt18uncaught_exceptionv.uncaught_exception++ } throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch." } function _abort() { Module["abort"]() } function _llvm_trap() { abort("trap!") } function _emscripten_memcpy_big(dest, src, num) { HEAPU8.set(HEAPU8.subarray(src, src + num), dest); return dest } function ___setErrNo(value) { if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value; return value } DYNAMICTOP_PTR = staticAlloc(4); STACK_BASE = STACKTOP = alignMemory(STATICTOP); STACK_MAX = STACK_BASE + TOTAL_STACK; DYNAMIC_BASE = alignMemory(STACK_MAX); HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE; staticSealed = true; var ASSERTIONS = false; function intArrayToString(array) { var ret = []; for (var i = 0; i < array.length; i++) { var chr = array[i]; if (chr > 255) { if (ASSERTIONS) { assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.") } chr &= 255 } ret.push(String.fromCharCode(chr)) } return ret.join("") } var decodeBase64 = typeof atob === "function" ? atob : (function (input) { var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; var output = ""; var chr1, chr2, chr3; var enc1, enc2, enc3, enc4; var i = 0; input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); do { enc1 = keyStr.indexOf(input.charAt(i++)); enc2 = keyStr.indexOf(input.charAt(i++)); enc3 = keyStr.indexOf(input.charAt(i++)); enc4 = keyStr.indexOf(input.charAt(i++)); chr1 = enc1 << 2 | enc2 >> 4; chr2 = (enc2 & 15) << 4 | enc3 >> 2; chr3 = (enc3 & 3) << 6 | enc4; output = output + String.fromCharCode(chr1); if (enc3 !== 64) { output = output + String.fromCharCode(chr2) } if (enc4 !== 64) { output = output + String.fromCharCode(chr3) } } while (i < input.length); return output }); function intArrayFromBase64(s) { if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) { var buf; try { buf = Buffer.from(s, "base64") } catch (_) { buf = new Buffer(s, "base64") } return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength) } try { var decoded = decodeBase64(s); var bytes = new Uint8Array(decoded.length); for (var i = 0; i < decoded.length; ++i) { bytes[i] = decoded.charCodeAt(i) } return bytes } catch (_) { throw new Error("Converting base64 string to bytes failed.") } } function tryParseAsDataURI(filename) { if (!isDataURI(filename)) { return } return intArrayFromBase64(filename.slice(dataURIPrefix.length)) } Module["wasmTableSize"] = 35; Module["wasmMaxTableSize"] = 35; Module.asmGlobalArg = {}; Module.asmLibraryArg = { "abort": abort, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "___assert_fail": ___assert_fail, "___cxa_allocate_exception": ___cxa_allocate_exception, "___cxa_throw": ___cxa_throw, "___setErrNo": ___setErrNo, "_abort": _abort, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_llvm_trap": _llvm_trap, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "STACKTOP": STACKTOP }; var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer); Module["asm"] = asm; var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = (function () { return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments) }); var _linalg_matrix_add = Module["_linalg_matrix_add"] = (function () { return Module["asm"]["_linalg_matrix_add"].apply(null, arguments) }); var _linalg_matrix_add_scale = Module["_linalg_matrix_add_scale"] = (function () { return Module["asm"]["_linalg_matrix_add_scale"].apply(null, arguments) }); var _linalg_matrix_col_stride = Module["_linalg_matrix_col_stride"] = (function () { return Module["asm"]["_linalg_matrix_col_stride"].apply(null, arguments) }); var _linalg_matrix_cols = Module["_linalg_matrix_cols"] = (function () { return Module["asm"]["_linalg_matrix_cols"].apply(null, arguments) }); var _linalg_matrix_create = Module["_linalg_matrix_create"] = (function () { return Module["asm"]["_linalg_matrix_create"].apply(null, arguments) }); var _linalg_matrix_data = Module["_linalg_matrix_data"] = (function () { return Module["asm"]["_linalg_matrix_data"].apply(null, arguments) }); var _linalg_matrix_destroy = Module["_linalg_matrix_destroy"] = (function () { return Module["asm"]["_linalg_matrix_destroy"].apply(null, arguments) }); var _linalg_matrix_ediv = Module["_linalg_matrix_ediv"] = (function () { return Module["asm"]["_linalg_matrix_ediv"].apply(null, arguments) }); var _linalg_matrix_emul = Module["_linalg_matrix_emul"] = (function () { return Module["asm"]["_linalg_matrix_emul"].apply(null, arguments) }); var _linalg_matrix_fill = Module["_linalg_matrix_fill"] = (function () { return Module["asm"]["_linalg_matrix_fill"].apply(null, arguments) }); var _linalg_matrix_init = Module["_linalg_matrix_init"] = (function () { return Module["asm"]["_linalg_matrix_init"].apply(null, arguments) }); var _linalg_matrix_l1_norm = Module["_linalg_matrix_l1_norm"] = (function () { return Module["asm"]["_linalg_matrix_l1_norm"].apply(null, arguments) }); var _linalg_matrix_mmul = Module["_linalg_matrix_mmul"] = (function () { return Module["asm"]["_linalg_matrix_mmul"].apply(null, arguments) }); var _linalg_matrix_norm = Module["_linalg_matrix_norm"] = (function () { return Module["asm"]["_linalg_matrix_norm"].apply(null, arguments) }); var _linalg_matrix_row_stride = Module["_linalg_matrix_row_stride"] = (function () { return Module["asm"]["_linalg_matrix_row_stride"].apply(null, arguments) }); var _linalg_matrix_rows = Module["_linalg_matrix_rows"] = (function () { return Module["asm"]["_linalg_matrix_rows"].apply(null, arguments) }); var _linalg_matrix_scale = Module["_linalg_matrix_scale"] = (function () { return Module["asm"]["_linalg_matrix_scale"].apply(null, arguments) }); var _linalg_matrix_size = Module["_linalg_matrix_size"] = (function () { return Module["asm"]["_linalg_matrix_size"].apply(null, arguments) }); var _linalg_matrix_sub = Module["_linalg_matrix_sub"] = (function () { return Module["asm"]["_linalg_matrix_sub"].apply(null, arguments) }); var _linalg_solve_linear_system = Module["_linalg_solve_linear_system"] = (function () { return Module["asm"]["_linalg_solve_linear_system"].apply(null, arguments) }); var _malloc = Module["_malloc"] = (function () { return Module["asm"]["_malloc"].apply(null, arguments) }); var _memory_alloc = Module["_memory_alloc"] = (function () { return Module["asm"]["_memory_alloc"].apply(null, arguments) }); var _memory_free = Module["_memory_free"] = (function () { return Module["asm"]["_memory_free"].apply(null, arguments) }); var _solver_add_constraint = Module["_solver_add_constraint"] = (function () { return Module["asm"]["_solver_add_constraint"].apply(null, arguments) }); var _solver_add_constraint_coefficient = Module["_solver_add_constraint_coefficient"] = (function () { return Module["asm"]["_solver_add_constraint_coefficient"].apply(null, arguments) }); var _solver_add_variable = Module["_solver_add_variable"] = (function () { return Module["asm"]["_solver_add_variable"].apply(null, arguments) }); var _solver_clear_constraint_coefficients = Module["_solver_clear_constraint_coefficients"] = (function () { return Module["asm"]["_solver_clear_constraint_coefficients"].apply(null, arguments) }); var _solver_compute_loss = Module["_solver_compute_loss"] = (function () { return Module["asm"]["_solver_compute_loss"].apply(null, arguments) }); var _solver_create = Module["_solver_create"] = (function () { return Module["asm"]["_solver_create"].apply(null, arguments) }); var _solver_destroy = Module["_solver_destroy"] = (function () { return Module["asm"]["_solver_destroy"].apply(null, arguments) }); var _solver_get_attribute_f = Module["_solver_get_attribute_f"] = (function () { return Module["asm"]["_solver_get_attribute_f"].apply(null, arguments) }); var _solver_get_attribute_i = Module["_solver_get_attribute_i"] = (function () { return Module["asm"]["_solver_get_attribute_i"].apply(null, arguments) }); var _solver_get_value = Module["_solver_get_value"] = (function () { return Module["asm"]["_solver_get_value"].apply(null, arguments) }); var _solver_get_values = Module["_solver_get_values"] = (function () { return Module["asm"]["_solver_get_values"].apply(null, arguments) }); var _solver_make_constant = Module["_solver_make_constant"] = (function () { return Module["asm"]["_solver_make_constant"].apply(null, arguments) }); var _solver_set_attribute_f = Module["_solver_set_attribute_f"] = (function () { return Module["asm"]["_solver_set_attribute_f"].apply(null, arguments) }); var _solver_set_attribute_i = Module["_solver_set_attribute_i"] = (function () { return Module["asm"]["_solver_set_attribute_i"].apply(null, arguments) }); var _solver_set_constraint_bias = Module["_solver_set_constraint_bias"] = (function () { return Module["asm"]["_solver_set_constraint_bias"].apply(null, arguments) }); var _solver_set_constraint_strength = Module["_solver_set_constraint_strength"] = (function () { return Module["asm"]["_solver_set_constraint_strength"].apply(null, arguments) }); var _solver_set_value = Module["_solver_set_value"] = (function () { return Module["asm"]["_solver_set_value"].apply(null, arguments) }); var _solver_set_values = Module["_solver_set_values"] = (function () { return Module["asm"]["_solver_set_values"].apply(null, arguments) }); var _solver_solve = Module["_solver_solve"] = (function () { return Module["asm"]["_solver_solve"].apply(null, arguments) }); var stackAlloc = Module["stackAlloc"] = (function () { return Module["asm"]["stackAlloc"].apply(null, arguments) }); var stackRestore = Module["stackRestore"] = (function () { return Module["asm"]["stackRestore"].apply(null, arguments) }); var stackSave = Module["stackSave"] = (function () { return Module["asm"]["stackSave"].apply(null, arguments) }); var dynCall_v = Module["dynCall_v"] = (function () { return Module["asm"]["dynCall_v"].apply(null, arguments) }); var dynCall_vi = Module["dynCall_vi"] = (function () { return Module["asm"]["dynCall_vi"].apply(null, arguments) }); Module["asm"] = asm; Module["cwrap"] = cwrap; Module["then"] = (function (func) { if (Module["calledRun"]) { func(Module) } else { var old = Module["onRuntimeInitialized"]; Module["onRuntimeInitialized"] = (function () { if (old) old(); func(Module) }) } return Module }); function ExitStatus(status) { this.name = "ExitStatus"; this.message = "Program terminated with exit(" + status + ")"; this.status = status } ExitStatus.prototype = new Error; ExitStatus.prototype.constructor = ExitStatus; dependenciesFulfilled = function runCaller() { if (!Module["calledRun"]) run(); if (!Module["calledRun"]) dependenciesFulfilled = runCaller }; function run(args) { args = args || Module["arguments"]; if (runDependencies > 0) { return } preRun(); if (runDependencies > 0) return; if (Module["calledRun"]) return; function doRun() { if (Module["calledRun"]) return; Module["calledRun"] = true; if (ABORT) return; ensureInitRuntime(); preMain(); if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"](); postRun() } if (Module["setStatus"]) { Module["setStatus"]("Running..."); setTimeout((function () { setTimeout((function () { Module["setStatus"]("") }), 1); doRun() }), 1) } else { doRun() } } Module["run"] = run; function abort(what) { if (Module["onAbort"]) { Module["onAbort"](what) } if (what !== undefined) { out(what); err(what); what = JSON.stringify(what) } else { what = "" } ABORT = true; EXITSTATUS = 1; throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info." } Module["abort"] = abort; if (Module["preInit"]) { if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]]; while (Module["preInit"].length > 0) { Module["preInit"].pop()() } } Module["noExitRuntime"] = true; run()





              return Module;
            }
          );
        })();
        if (true)
          module.exports = Module;
        else if (typeof define === 'function' && define['amd'])
          define([], function () { return Module; });
        else if (typeof exports === 'object')
          exports["Module"] = Module;

        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(0), "/", __webpack_require__(1).Buffer))

      /***/
    }),
/* 4 */
/***/ (function (module, exports) {

      var g;

      // This works in non-strict mode
      g = (function () {
        return this;
      })();

      try {
        // This works if eval is allowed (see CSP)
        g = g || Function("return this")() || (1, eval)("this");
      } catch (e) {
        // This works if the window reference is available
        if (typeof window === "object")
          g = window;
      }

      // g can still be undefined, but nothing to do about it...
      // We return undefined, instead of nothing here, so it's
      // easier to handle this case. if(!global) { ...}

      module.exports = g;


      /***/
    }),
/* 5 */
/***/ (function (module, exports, __webpack_require__) {

      "use strict";


      exports.byteLength = byteLength
      exports.toByteArray = toByteArray
      exports.fromByteArray = fromByteArray

      var lookup = []
      var revLookup = []
      var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

      var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i]
        revLookup[code.charCodeAt(i)] = i
      }

      // Support decoding URL-safe base64 strings, as Node.js does.
      // See: https://en.wikipedia.org/wiki/Base64#URL_applications
      revLookup['-'.charCodeAt(0)] = 62
      revLookup['_'.charCodeAt(0)] = 63

      function getLens(b64) {
        var len = b64.length

        if (len % 4 > 0) {
          throw new Error('Invalid string. Length must be a multiple of 4')
        }

        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        var validLen = b64.indexOf('=')
        if (validLen === -1) validLen = len

        var placeHoldersLen = validLen === len
          ? 0
          : 4 - (validLen % 4)

        return [validLen, placeHoldersLen]
      }

      // base64 is 4/3 + up to two characters of the original data
      function byteLength(b64) {
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }

      function _byteLength(b64, validLen, placeHoldersLen) {
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }

      function toByteArray(b64) {
        var tmp
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]

        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

        var curByte = 0

        // if there are placeholders, only get up to the last complete 4 chars
        var len = placeHoldersLen > 0
          ? validLen - 4
          : validLen

        for (var i = 0; i < len; i += 4) {
          tmp =
            (revLookup[b64.charCodeAt(i)] << 18) |
            (revLookup[b64.charCodeAt(i + 1)] << 12) |
            (revLookup[b64.charCodeAt(i + 2)] << 6) |
            revLookup[b64.charCodeAt(i + 3)]
          arr[curByte++] = (tmp >> 16) & 0xFF
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 2) {
          tmp =
            (revLookup[b64.charCodeAt(i)] << 2) |
            (revLookup[b64.charCodeAt(i + 1)] >> 4)
          arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 1) {
          tmp =
            (revLookup[b64.charCodeAt(i)] << 10) |
            (revLookup[b64.charCodeAt(i + 1)] << 4) |
            (revLookup[b64.charCodeAt(i + 2)] >> 2)
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }

        return arr
      }

      function tripletToBase64(num) {
        return lookup[num >> 18 & 0x3F] +
          lookup[num >> 12 & 0x3F] +
          lookup[num >> 6 & 0x3F] +
          lookup[num & 0x3F]
      }

      function encodeChunk(uint8, start, end) {
        var tmp
        var output = []
        for (var i = start; i < end; i += 3) {
          tmp =
            ((uint8[i] << 16) & 0xFF0000) +
            ((uint8[i + 1] << 8) & 0xFF00) +
            (uint8[i + 2] & 0xFF)
          output.push(tripletToBase64(tmp))
        }
        return output.join('')
      }

      function fromByteArray(uint8) {
        var tmp
        var len = uint8.length
        var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        var parts = []
        var maxChunkLength = 16383 // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
          parts.push(encodeChunk(
            uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
          ))
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
          tmp = uint8[len - 1]
          parts.push(
            lookup[tmp >> 2] +
            lookup[(tmp << 4) & 0x3F] +
            '=='
          )
        } else if (extraBytes === 2) {
          tmp = (uint8[len - 2] << 8) + uint8[len - 1]
          parts.push(
            lookup[tmp >> 10] +
            lookup[(tmp >> 4) & 0x3F] +
            lookup[(tmp << 2) & 0x3F] +
            '='
          )
        }

        return parts.join('')
      }


      /***/
    }),
/* 6 */
/***/ (function (module, exports) {

      exports.read = function (buffer, offset, isLE, mLen, nBytes) {
        var e, m
        var eLen = (nBytes * 8) - mLen - 1
        var eMax = (1 << eLen) - 1
        var eBias = eMax >> 1
        var nBits = -7
        var i = isLE ? (nBytes - 1) : 0
        var d = isLE ? -1 : 1
        var s = buffer[offset + i]

        i += d

        e = s & ((1 << (-nBits)) - 1)
        s >>= (-nBits)
        nBits += eLen
        for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) { }

        m = e & ((1 << (-nBits)) - 1)
        e >>= (-nBits)
        nBits += mLen
        for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) { }

        if (e === 0) {
          e = 1 - eBias
        } else if (e === eMax) {
          return m ? NaN : ((s ? -1 : 1) * Infinity)
        } else {
          m = m + Math.pow(2, mLen)
          e = e - eBias
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
      }

      exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c
        var eLen = (nBytes * 8) - mLen - 1
        var eMax = (1 << eLen) - 1
        var eBias = eMax >> 1
        var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
        var i = isLE ? 0 : (nBytes - 1)
        var d = isLE ? 1 : -1
        var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

        value = Math.abs(value)

        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0
          e = eMax
        } else {
          e = Math.floor(Math.log(value) / Math.LN2)
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--
            c *= 2
          }
          if (e + eBias >= 1) {
            value += rt / c
          } else {
            value += rt * Math.pow(2, 1 - eBias)
          }
          if (value * c >= 2) {
            e++
            c /= 2
          }

          if (e + eBias >= eMax) {
            m = 0
            e = eMax
          } else if (e + eBias >= 1) {
            m = ((value * c) - 1) * Math.pow(2, mLen)
            e = e + eBias
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
            e = 0
          }
        }

        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) { }

        e = (e << mLen) | m
        eLen += mLen
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) { }

        buffer[offset + i - d] |= s * 128
      }


      /***/
    }),
/* 7 */
/***/ (function (module, exports) {

      var toString = {}.toString;

      module.exports = Array.isArray || function (arr) {
        return toString.call(arr) == '[object Array]';
      };


      /***/
    }),
/* 8 */
/***/ (function (module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function (process, __dirname, Buffer) {
        var Module = (function () {
          var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
          return (
            function (Module) {
              Module = Module || {};

              var Module = typeof Module !== "undefined" ? Module : {}; var moduleOverrides = {}; var key; for (key in Module) { if (Module.hasOwnProperty(key)) { moduleOverrides[key] = Module[key] } } Module["arguments"] = []; Module["thisProgram"] = "./this.program"; Module["quit"] = (function (status, toThrow) { throw toThrow }); Module["preRun"] = []; Module["postRun"] = []; var ENVIRONMENT_IS_WEB = false; var ENVIRONMENT_IS_WORKER = false; var ENVIRONMENT_IS_NODE = false; var ENVIRONMENT_IS_SHELL = false; ENVIRONMENT_IS_WEB = typeof window === "object"; ENVIRONMENT_IS_WORKER = typeof importScripts === "function"; ENVIRONMENT_IS_NODE = typeof process === "object" && "function" === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER; ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER; var scriptDirectory = ""; function locateFile(path) { if (Module["locateFile"]) { return Module["locateFile"](path, scriptDirectory) } else { return scriptDirectory + path } } if (ENVIRONMENT_IS_NODE) { scriptDirectory = __dirname + "/"; var nodeFS; var nodePath; Module["read"] = function shell_read(filename, binary) { var ret; ret = tryParseAsDataURI(filename); if (!ret) { if (!nodeFS) nodeFS = null; if (!nodePath) nodePath = null; filename = nodePath["normalize"](filename); ret = nodeFS["readFileSync"](filename) } return binary ? ret : ret.toString() }; Module["readBinary"] = function readBinary(filename) { var ret = Module["read"](filename, true); if (!ret.buffer) { ret = new Uint8Array(ret) } assert(ret.buffer); return ret }; if (process["argv"].length > 1) { Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/") } Module["arguments"] = process["argv"].slice(2); process["on"]("uncaughtException", (function (ex) { if (!(ex instanceof ExitStatus)) { throw ex } })); process["on"]("unhandledRejection", (function (reason, p) { process["exit"](1) })); Module["quit"] = (function (status) { process["exit"](status) }); Module["inspect"] = (function () { return "[Emscripten Module object]" }) } else if (ENVIRONMENT_IS_SHELL) { if (typeof read != "undefined") { Module["read"] = function shell_read(f) { var data = tryParseAsDataURI(f); if (data) { return intArrayToString(data) } return read(f) } } Module["readBinary"] = function readBinary(f) { var data; data = tryParseAsDataURI(f); if (data) { return data } if (typeof readbuffer === "function") { return new Uint8Array(readbuffer(f)) } data = read(f, "binary"); assert(typeof data === "object"); return data }; if (typeof scriptArgs != "undefined") { Module["arguments"] = scriptArgs } else if (typeof arguments != "undefined") { Module["arguments"] = arguments } if (typeof quit === "function") { Module["quit"] = (function (status) { quit(status) }) } } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) { if (ENVIRONMENT_IS_WEB) { if (document.currentScript) { scriptDirectory = document.currentScript.src } } else { scriptDirectory = self.location.href } if (_scriptDir) { scriptDirectory = _scriptDir } if (scriptDirectory.indexOf("blob:") !== 0) { scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1) } else { scriptDirectory = "" } Module["read"] = function shell_read(url) { try { var xhr = new XMLHttpRequest; xhr.open("GET", url, false); xhr.send(null); return xhr.responseText } catch (err) { var data = tryParseAsDataURI(url); if (data) { return intArrayToString(data) } throw err } }; if (ENVIRONMENT_IS_WORKER) { Module["readBinary"] = function readBinary(url) { try { var xhr = new XMLHttpRequest; xhr.open("GET", url, false); xhr.responseType = "arraybuffer"; xhr.send(null); return new Uint8Array(xhr.response) } catch (err) { var data = tryParseAsDataURI(url); if (data) { return data } throw err } } } Module["readAsync"] = function readAsync(url, onload, onerror) { var xhr = new XMLHttpRequest; xhr.open("GET", url, true); xhr.responseType = "arraybuffer"; xhr.onload = function xhr_onload() { if (xhr.status == 200 || xhr.status == 0 && xhr.response) { onload(xhr.response); return } var data = tryParseAsDataURI(url); if (data) { onload(data.buffer); return } onerror() }; xhr.onerror = onerror; xhr.send(null) }; Module["setWindowTitle"] = (function (title) { document.title = title }) } else { } var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null); var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out); for (key in moduleOverrides) { if (moduleOverrides.hasOwnProperty(key)) { Module[key] = moduleOverrides[key] } } moduleOverrides = undefined; var STACK_ALIGN = 16; function staticAlloc(size) { var ret = STATICTOP; STATICTOP = STATICTOP + size + 15 & -16; return ret } function alignMemory(size, factor) { if (!factor) factor = STACK_ALIGN; var ret = size = Math.ceil(size / factor) * factor; return ret } var asm2wasmImports = { "f64-rem": (function (x, y) { return x % y }), "debugger": (function () { debugger }) }; var functionPointers = new Array(0); var GLOBAL_BASE = 1024; var ABORT = false; var EXITSTATUS = 0; function assert(condition, text) { if (!condition) { abort("Assertion failed: " + text) } } function getCFunc(ident) { var func = Module["_" + ident]; assert(func, "Cannot call unknown function " + ident + ", make sure it is exported"); return func } var JSfuncs = { "stackSave": (function () { stackSave() }), "stackRestore": (function () { stackRestore() }), "arrayToC": (function (arr) { var ret = stackAlloc(arr.length); writeArrayToMemory(arr, ret); return ret }), "stringToC": (function (str) { var ret = 0; if (str !== null && str !== undefined && str !== 0) { var len = (str.length << 2) + 1; ret = stackAlloc(len); stringToUTF8(str, ret, len) } return ret }) }; var toC = { "string": JSfuncs["stringToC"], "array": JSfuncs["arrayToC"] }; function ccall(ident, returnType, argTypes, args, opts) { function convertReturnValue(ret) { if (returnType === "string") return Pointer_stringify(ret); if (returnType === "boolean") return Boolean(ret); return ret } var func = getCFunc(ident); var cArgs = []; var stack = 0; if (args) { for (var i = 0; i < args.length; i++) { var converter = toC[argTypes[i]]; if (converter) { if (stack === 0) stack = stackSave(); cArgs[i] = converter(args[i]) } else { cArgs[i] = args[i] } } } var ret = func.apply(null, cArgs); ret = convertReturnValue(ret); if (stack !== 0) stackRestore(stack); return ret } function cwrap(ident, returnType, argTypes, opts) { argTypes = argTypes || []; var numericArgs = argTypes.every((function (type) { return type === "number" })); var numericRet = returnType !== "string"; if (numericRet && numericArgs && !opts) { return getCFunc(ident) } return (function () { return ccall(ident, returnType, argTypes, arguments, opts) }) } function Pointer_stringify(ptr, length) { if (length === 0 || !ptr) return ""; var hasUtf = 0; var t; var i = 0; while (1) { t = HEAPU8[ptr + i >> 0]; hasUtf |= t; if (t == 0 && !length) break; i++; if (length && i == length) break } if (!length) length = i; var ret = ""; if (hasUtf < 128) { var MAX_CHUNK = 1024; var curr; while (length > 0) { curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK))); ret = ret ? ret + curr : curr; ptr += MAX_CHUNK; length -= MAX_CHUNK } return ret } return UTF8ToString(ptr) } var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined; function UTF8ArrayToString(u8Array, idx) { var endPtr = idx; while (u8Array[endPtr]) ++endPtr; if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) { return UTF8Decoder.decode(u8Array.subarray(idx, endPtr)) } else { var u0, u1, u2, u3, u4, u5; var str = ""; while (1) { u0 = u8Array[idx++]; if (!u0) return str; if (!(u0 & 128)) { str += String.fromCharCode(u0); continue } u1 = u8Array[idx++] & 63; if ((u0 & 224) == 192) { str += String.fromCharCode((u0 & 31) << 6 | u1); continue } u2 = u8Array[idx++] & 63; if ((u0 & 240) == 224) { u0 = (u0 & 15) << 12 | u1 << 6 | u2 } else { u3 = u8Array[idx++] & 63; if ((u0 & 248) == 240) { u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3 } else { u4 = u8Array[idx++] & 63; if ((u0 & 252) == 248) { u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4 } else { u5 = u8Array[idx++] & 63; u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5 } } } if (u0 < 65536) { str += String.fromCharCode(u0) } else { var ch = u0 - 65536; str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023) } } } } function UTF8ToString(ptr) { return UTF8ArrayToString(HEAPU8, ptr) } function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) { if (!(maxBytesToWrite > 0)) return 0; var startIdx = outIdx; var endIdx = outIdx + maxBytesToWrite - 1; for (var i = 0; i < str.length; ++i) { var u = str.charCodeAt(i); if (u >= 55296 && u <= 57343) { var u1 = str.charCodeAt(++i); u = 65536 + ((u & 1023) << 10) | u1 & 1023 } if (u <= 127) { if (outIdx >= endIdx) break; outU8Array[outIdx++] = u } else if (u <= 2047) { if (outIdx + 1 >= endIdx) break; outU8Array[outIdx++] = 192 | u >> 6; outU8Array[outIdx++] = 128 | u & 63 } else if (u <= 65535) { if (outIdx + 2 >= endIdx) break; outU8Array[outIdx++] = 224 | u >> 12; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } else if (u <= 2097151) { if (outIdx + 3 >= endIdx) break; outU8Array[outIdx++] = 240 | u >> 18; outU8Array[outIdx++] = 128 | u >> 12 & 63; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } else if (u <= 67108863) { if (outIdx + 4 >= endIdx) break; outU8Array[outIdx++] = 248 | u >> 24; outU8Array[outIdx++] = 128 | u >> 18 & 63; outU8Array[outIdx++] = 128 | u >> 12 & 63; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } else { if (outIdx + 5 >= endIdx) break; outU8Array[outIdx++] = 252 | u >> 30; outU8Array[outIdx++] = 128 | u >> 24 & 63; outU8Array[outIdx++] = 128 | u >> 18 & 63; outU8Array[outIdx++] = 128 | u >> 12 & 63; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63 } } outU8Array[outIdx] = 0; return outIdx - startIdx } function stringToUTF8(str, outPtr, maxBytesToWrite) { return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite) } var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined; var WASM_PAGE_SIZE = 65536; var ASMJS_PAGE_SIZE = 16777216; var MIN_TOTAL_MEMORY = 16777216; function alignUp(x, multiple) { if (x % multiple > 0) { x += multiple - x % multiple } return x } var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64; function updateGlobalBuffer(buf) { Module["buffer"] = buffer = buf } function updateGlobalBufferViews() { Module["HEAP8"] = HEAP8 = new Int8Array(buffer); Module["HEAP16"] = HEAP16 = new Int16Array(buffer); Module["HEAP32"] = HEAP32 = new Int32Array(buffer); Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer); Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer); Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer); Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer); Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer) } var STATIC_BASE, STATICTOP, staticSealed; var STACK_BASE, STACKTOP, STACK_MAX; var DYNAMIC_BASE, DYNAMICTOP_PTR; STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0; staticSealed = false; function abortOnCannotGrowMemory() { abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ") } if (!Module["reallocBuffer"]) Module["reallocBuffer"] = (function (size) { var ret; try { var oldHEAP8 = HEAP8; ret = new ArrayBuffer(size); var temp = new Int8Array(ret); temp.set(oldHEAP8) } catch (e) { return false } var success = _emscripten_replace_memory(ret); if (!success) return false; return ret }); function enlargeMemory() { var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; var LIMIT = 2147483648 - PAGE_MULTIPLE; if (HEAP32[DYNAMICTOP_PTR >> 2] > LIMIT) { return false } var OLD_TOTAL_MEMORY = TOTAL_MEMORY; TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY); while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) { if (TOTAL_MEMORY <= 536870912) { TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE) } else { TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT) } } var replacement = Module["reallocBuffer"](TOTAL_MEMORY); if (!replacement || replacement.byteLength != TOTAL_MEMORY) { TOTAL_MEMORY = OLD_TOTAL_MEMORY; return false } updateGlobalBuffer(replacement); updateGlobalBufferViews(); return true } var byteLength; try { byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get); byteLength(new ArrayBuffer(4)) } catch (e) { byteLength = (function (buffer) { return buffer.byteLength }) } var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880; var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216; if (TOTAL_MEMORY < TOTAL_STACK) err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")"); if (Module["buffer"]) { buffer = Module["buffer"] } else { if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") { Module["wasmMemory"] = new WebAssembly.Memory({ "initial": TOTAL_MEMORY / WASM_PAGE_SIZE }); buffer = Module["wasmMemory"].buffer } else { buffer = new ArrayBuffer(TOTAL_MEMORY) } Module["buffer"] = buffer } updateGlobalBufferViews(); function getTotalMemory() { return TOTAL_MEMORY } function callRuntimeCallbacks(callbacks) { while (callbacks.length > 0) { var callback = callbacks.shift(); if (typeof callback == "function") { callback(); continue } var func = callback.func; if (typeof func === "number") { if (callback.arg === undefined) { Module["dynCall_v"](func) } else { Module["dynCall_vi"](func, callback.arg) } } else { func(callback.arg === undefined ? null : callback.arg) } } } var __ATPRERUN__ = []; var __ATINIT__ = []; var __ATMAIN__ = []; var __ATPOSTRUN__ = []; var runtimeInitialized = false; function preRun() { if (Module["preRun"]) { if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]]; while (Module["preRun"].length) { addOnPreRun(Module["preRun"].shift()) } } callRuntimeCallbacks(__ATPRERUN__) } function ensureInitRuntime() { if (runtimeInitialized) return; runtimeInitialized = true; callRuntimeCallbacks(__ATINIT__) } function preMain() { callRuntimeCallbacks(__ATMAIN__) } function postRun() { if (Module["postRun"]) { if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]]; while (Module["postRun"].length) { addOnPostRun(Module["postRun"].shift()) } } callRuntimeCallbacks(__ATPOSTRUN__) } function addOnPreRun(cb) { __ATPRERUN__.unshift(cb) } function addOnPostRun(cb) { __ATPOSTRUN__.unshift(cb) } function writeArrayToMemory(array, buffer) { HEAP8.set(array, buffer) } var runDependencies = 0; var runDependencyWatcher = null; var dependenciesFulfilled = null; function addRunDependency(id) { runDependencies++; if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) } } function removeRunDependency(id) { runDependencies--; if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) } if (runDependencies == 0) { if (runDependencyWatcher !== null) { clearInterval(runDependencyWatcher); runDependencyWatcher = null } if (dependenciesFulfilled) { var callback = dependenciesFulfilled; dependenciesFulfilled = null; callback() } } } Module["preloadedImages"] = {}; Module["preloadedAudios"] = {}; var dataURIPrefix = "data:application/wasm;base64,"; function isDataURI(filename) { return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0 } function integrateWasmJS() { var wasmTextFile = ""; var wasmBinaryFile = "data:application/wasm;base64,AGFzbQEAAAAB1wEcYAAAYAR/f39/AGAGf39/f39/AGAFf39/f38AYAF/AX9gA39/fwF/YAF/AGAAAX9gA39/fwBgAn9/AGAFf398f3wAYAJ/fABgAn9/AXxgAX8BfGADf398AGACf38Bf2AHf39/f39/fwBgDH9/f39/f398f39/fwBgDH9/f39/f39/f3x/fwBgA39/fwF8YAZ/f3x/f38Bf2AEf39/fABgBH9/fH8AYAd/f39/fH9/AGAIf39/f3x/f38AYAh/f39/f39/fwBgBX9/f39/AX9gBH9/f38BfwK+AhADZW52Bm1lbW9yeQIAgAIDZW52BXRhYmxlAXABIyMDZW52CXRhYmxlQmFzZQN/AANlbnYORFlOQU1JQ1RPUF9QVFIDfwADZW52CFNUQUNLVE9QA38AA2VudgVhYm9ydAAGA2Vudg1lbmxhcmdlTWVtb3J5AAcDZW52DmdldFRvdGFsTWVtb3J5AAcDZW52F2Fib3J0T25DYW5ub3RHcm93TWVtb3J5AAcDZW52Dl9fX2Fzc2VydF9mYWlsAAEDZW52GV9fX2N4YV9hbGxvY2F0ZV9leGNlcHRpb24ABANlbnYMX19fY3hhX3Rocm93AAgDZW52C19fX3NldEVyck5vAAYDZW52Bl9hYm9ydAAAA2VudhZfZW1zY3JpcHRlbl9tZW1jcHlfYmlnAAUDZW52Cl9sbHZtX3RyYXAAAAPDAcEBBg8FBAgECQgFDwkJBBEGCQkBCQkQCQkGDgEJCAkJBgkBCAkJBgkSARABCQIDAQQGBgMBGwQPCQgGCRkJBAgIFwYGBgwOAQEJFAkGFgYJBgYEAQ4IDggOCQEMDwwGBwYJFhUUEwEICAEDDBATEAEICBAPAQkICAkGCQEIBA4EDQgMAQcABQkGCwYEBAEIAwIbAQMCBQgJBAYGGgkJCQQGBgkIAQgBCAcMCA8JCQgNBA8JAQgMCAIIDBgPCAoPBgYIBAYLAn8BIwELfwEjAgsHswgvEl9saW5hbGdfbWF0cml4X2FkZADKARhfbGluYWxnX21hdHJpeF9hZGRfc2NhbGUAxgEZX2xpbmFsZ19tYXRyaXhfY29sX3N0cmlkZQBHE19saW5hbGdfbWF0cml4X2NvbHMAuQEVX2xpbmFsZ19tYXRyaXhfY3JlYXRlALEBE19saW5hbGdfbWF0cml4X2RhdGEAqAEWX2xpbmFsZ19tYXRyaXhfZGVzdHJveQCjARNfbGluYWxnX21hdHJpeF9lZGl2AJ8BE19saW5hbGdfbWF0cml4X2VtdWwAlwETX2xpbmFsZ19tYXRyaXhfZmlsbACSARNfbGluYWxnX21hdHJpeF9pbml0AIwBFl9saW5hbGdfbWF0cml4X2wxX25vcm0AiwETX2xpbmFsZ19tYXRyaXhfbW11bACKARNfbGluYWxnX21hdHJpeF9ub3JtAIkBGV9saW5hbGdfbWF0cml4X3Jvd19zdHJpZGUAiAETX2xpbmFsZ19tYXRyaXhfcm93cwBHFF9saW5hbGdfbWF0cml4X3NjYWxlAIcBE19saW5hbGdfbWF0cml4X3NpemUAhgESX2xpbmFsZ19tYXRyaXhfc3ViAIUBG19saW5hbGdfc29sdmVfbGluZWFyX3N5c3RlbQCEAQdfbWFsbG9jABANX21lbW9yeV9hbGxvYwBbDF9tZW1vcnlfZnJlZQBVFl9zb2x2ZXJfYWRkX2NvbnN0cmFpbnQAbSJfc29sdmVyX2FkZF9jb25zdHJhaW50X2NvZWZmaWNpZW50AGwUX3NvbHZlcl9hZGRfdmFyaWFibGUAayVfc29sdmVyX2NsZWFyX2NvbnN0cmFpbnRfY29lZmZpY2llbnRzAGoUX3NvbHZlcl9jb21wdXRlX2xvc3MAaQ5fc29sdmVyX2NyZWF0ZQBoD19zb2x2ZXJfZGVzdHJveQBnF19zb2x2ZXJfZ2V0X2F0dHJpYnV0ZV9mAGYXX3NvbHZlcl9nZXRfYXR0cmlidXRlX2kAZRFfc29sdmVyX2dldF92YWx1ZQBkEl9zb2x2ZXJfZ2V0X3ZhbHVlcwBjFV9zb2x2ZXJfbWFrZV9jb25zdGFudABiF19zb2x2ZXJfc2V0X2F0dHJpYnV0ZV9mAGEXX3NvbHZlcl9zZXRfYXR0cmlidXRlX2kAYBtfc29sdmVyX3NldF9jb25zdHJhaW50X2JpYXMAXx9fc29sdmVyX3NldF9jb25zdHJhaW50X3N0cmVuZ3RoAF4RX3NvbHZlcl9zZXRfdmFsdWUAXRJfc29sdmVyX3NldF92YWx1ZXMAXA1fc29sdmVyX3NvbHZlAFoJZHluQ2FsbF92AJEBCmR5bkNhbGxfdmkAkAEKc3RhY2tB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CyADIAJB4ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB5ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB5gBqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB6gBqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB7ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB8ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB+ABqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB/gBqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBggFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBiAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBigFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBjgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBlAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBlgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBnAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBogFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBpgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBqAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBrAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBsgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBtAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBugFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBvgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBwAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBxAFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJBxgFqIgFuIgQgAUkEQCABIQJBASEBIAMhAAwPCyADIAQgAWxGBEAgASECQQkhAQwPCyADIAJB0AFqIgRuIgEgBEkhCCACQdIBaiECIAMgASAEbEYiCgR/QQkFQQALIQEgCARAQQEhAQsgCARAIAMhAAsgCCAKcgRAIAQhAgsLCwsLCwsLCwsLCwsLCwsCQAJAAkACQCABQQ9xDgoBAgICAgICAgIAAgsMBQsMAQsMAQsMAQsLIAENAwsgCSAFQQFqIgVBMEYiA2oiAiEJIAJB0gFsIQIgAwRAQQAhBQsMAAALAAsgByADNgIAIAMhAAwCCyAHIAM2AgALCyAGJAQgAAu1BAIHfwJ9IAEoAgAhAwJAIABBBGoiCCgCACIFRSIGBEBBACEBBSAAKAIAIAVBf2oiBCAFcUUiBwR/IAQgA3EFIAMgBUkEfyADBSADIAVwCwsiAUECdGooAgAiAgRAIAIoAgAiAgRAIAcEQANAAkAgAigCBCIHIANGIAcgBHEgAUZyRQ0GIAIoAgggA0YNACACKAIAIgINAQwGCwsgAkEMag8LA0ACQCACKAIEIgQgA0cEQCAEIAVPBEAgBCAFcCEECyAEIAFHDQYLIAIoAgggA0YNACACKAIAIgINAQwFCwsgAkEMag8LCwsLQRAQDiIEIAM2AgggBEEANgIMIAQgAzYCBCAEQQA2AgACQCAGIAAqAhAiCSAFs5QgAEEMaiIGKAIAQQFqsyIKXXIEQCAAIAVBAXQgBUEDSSAFQX9qIAVxQQBHcnIiASAKIAmVjakiAkkEfyACBSABCxAoIAgoAgAiAkF/aiIBIAJxRQRAIAEgA3EhAQwCCyADIAJJBH8gAwUgAyACcAshAQUgBSECCwsCQAJAIAAoAgAgAUECdGoiAygCACIBBEAgBCABKAIANgIADAEFIAQgAEEIaiIBKAIANgIAIAEgBDYCACADIAE2AgAgBCgCACIBBEAgASgCBCEBIAJBf2oiAyACcQRAIAEgAk8EQCABIAJwIQELBSABIANxIQELIAAoAgAgAUECdGohAQwCCwsMAQsgASAENgIACyAGIAYoAgBBAWo2AgAgBEEMaguKAwENfyMEIQUjBEEQaiQEIAAgASkCADcCACAAIAEpAgg3AgggAEEUaiILQQA2AgAgAEEYaiIHQQA2AgAgAEEQaiIGIABBFGoiDDYCACABKAIQIgMgAUEUaiINRgRAIAAgASwAHDoAHCAFJAQPCyAFQQxqIQggBUEIaiEJIAVBBGohDgNAIAUgDDYCACAIIAUoAgA2AgAgBiAIIAkgDiADQRBqIgQQpAEiCigCAEUEQEEUEA4iAiAEKAIANgIQIAkoAgAhBCACQQA2AgAgAkEANgIEIAIgBDYCCCAKIAI2AgAgBigCACgCACIEBEAgBiAENgIAIAooAgAhAgsgCygCACACEBYgByAHKAIAQQFqNgIACyADKAIEIgIEQCACIQMDQCADKAIAIgIEQCACIQMMAQsLBSADQQhqIgQoAgAiAigCACADRgR/IAIFIAQhAwN/IAMoAgAiBEEIaiIDKAIAIgIoAgAgBEYEfyACBQwBCwsLIQMLIAMgDUcNAAsgACABLAAcOgAcIAUkBAu5BgENf0GoMiwAAEUEQEGoMiwAAEEBRgR/QQAFQagyQQE6AABBAQsEQEGwMkEANgIAQbQyQQA2AgBBuDJBADYCAAsLQbQyQbAyKAIANgIAIAFBDGoiCigCACIGIAFBEGoiCEYEQA8LA0AgBisDGJlEOoww4o55RT5jBEAgACgCACILIAZBEGoiDCgCACINQQV0akEQaiEOIAsgDUEFdGpBFGoiBygCACIJBEAgByEDIAkhBANAIARBBGohBSAEKAIQIAJIIg9FBEAgBCEFCyAPBEAgAyEECyAFKAIAIgUEQCAEIQMgBSEEDAELCyAEIAdHBEAgBCgCECACTARAIAQoAgQiAwRAA0AgAygCACIFBEAgBSEDDAELCwUgBEEIaiIDKAIAIgUoAgAgBEYEfyAFBQN/IAMoAgAiB0EIaiIDKAIAIgUoAgAgB0YEfyAFBQwBCwsLIQMLIA4oAgAgBEYEQCAOIAM2AgALIAsgDUEFdGpBGGoiAyADKAIAQX9qNgIAIAkgBBAqIAQQCwsLC0G0MigCACIDQbgyKAIARgRAQbAyIAwQJwUgAyAMKAIANgIAQbQyIANBBGo2AgALCyAGKAIEIgMEQANAIAMoAgAiBARAIAQhAwwBCwsFIAZBCGoiAygCACIEKAIAIAZGBH8gBAUDfyADKAIAIgZBCGoiAygCACIEKAIAIAZGBH8gBAUMAQsLCyEDCyADIAhHBEAgAyEGDAELC0GwMigCACICQbQyKAIAIgdGBEAPCyABQRRqIQYDQCACKAIAIQUgCCgCACIEBEAgCCEAIAQhAQNAIAFBBGohAyABKAIQIAVIIglFBEAgASEDCyAJBEAgACEBCyADKAIAIgMEQCABIQAgAyEBDAELCyABIAhHBEAgBSABKAIQTgRAIAEoAgQiAARAA0AgACgCACIDBEAgAyEADAELCwUgAUEIaiIAKAIAIgMoAgAgAUYEfyADBQN/IAAoAgAiBUEIaiIAKAIAIgMoAgAgBUYEfyADBQwBCwsLIQALIAooAgAgAUYEQCAKIAA2AgALIAYgBigCAEF/ajYCACAEIAEQKiABEAsLCwsgAkEEaiICIAdHDQALC40VAh1/AnwjBCEDIwRB8ABqJAQgACgCACICIABBBGoiESgCACIERwRAA0AgAkEIaiEIIAIsABwEQCAIQX82AgAFIAggATYCACABQQFqIQELIAJBIGoiAiAERw0ACyABIQgLIANB3ABqIg9BADYCACAPQQRqIhNBADYCACAPQQhqIhRBADYCACAPIABBIGoiFSgCACIBIABBJGoiBCgCACILRgR/QQAFQQAhAgNAIAIgASgCGEF/RmohAiABQShqIgEgC0cNAAsgAgsiC0EFbBAdIANBOGoiCkEAOgAAIApBBGoiBkIANwIAIAZCADcCCCAGQgA3AhAgBkIANwIYIAogCzYCCCAKQQA2AhwgCiAIQQJ0QQRqEBAiATYCDCABRQRAQQQQBSICQfAMNgIAIAJBwAtBBhAGCyAGIAg2AgAgCkEQaiIWKAIAIgIEfyACEAsgFkEANgIAIApBDGoiASEXIAEoAgAhASAGKAIABSAKQQxqIRcgCAshAiADQQhqIQUgAyIMQRhqIQkgAUEAIAJBAnRBBGoQDRogA0EwaiINQQA2AgAgDUEEaiIOQQA2AgAgDSAIEBEgA0EoaiIQQQA2AgAgEEEEaiIYQQA2AgAgECAIEBEgA0EgaiISQQA2AgAgEkEEaiIZQQA2AgAgEiALEBECQCAVKAIAIgMgBCgCACIaRwRAIAVBBGohGyAFQQhqIRxBACECA0ACQCADKAIYQX9GBEACfAJAAkACQAJAAkACQAJAIAMoAggOCwABAgMEBgYGBgYFBgtEAAAAAAAAJEAMBgtEAAAAAAAA8D8MBQtEmpmZmZmZuT8MBAtEexSuR+F6hD8MAwtE/Knx0k1iUD8MAgtEAAAAAAAAAAAMAQtEAAAAAAAAAAALIR4gAygCDCIBIANBEGoiHUcEQANAIAAoAgAgASgCEEEFdGpBCGohBCAeIAErAxiiIR8gBSACNgIAIBsgBCgCADYCACAcIB85AwAgEygCACIEIBQoAgBJBEAgBCAFKQMANwMAIAQgBSkDCDcDCCATIARBEGo2AgAFIA8gBRAbCyABKAIEIgQEQCAEIQEDQCABKAIAIgQEQCAEIQEMAQsLBSABQQhqIgQoAgAiBygCACABRgR/IAcFIAQhAQN/IAEoAgAiB0EIaiIBKAIAIgQoAgAgB0YEfyAEBQwBCwsLIQELIAEgHUcNAAsLIAJBf0ogGSgCACACSnFFDQEgEigCACACQQN0aiAeIAMrAwCimjkDACACQQFqIQILIANBKGoiAyAaRw0BDAMLC0HsFkGJF0GYA0HKFxAECwsgDCAPKAIANgIAIAkgEygCADYCACAMIAkgCiAFEBwCQCAAKAIAIgEgESgCACIDRwRAIBgoAgAhBCAQKAIAIQcDQAJAIAEsABxFBEAgASgCCCICQX9KIAQgAkpxRQ0BIAcgAkEDdGogASgCDCsDCDkDAAsgAUEgaiIBIANHDQEMAwsLQewWQYkXQZgDQcoXEAQLCyAFIAYoAgBBAXQ2AgAgDEQAAAAAAACwPDkDAAJAIABBgAFqIgcoAgAiAigCBCIBBEAgAigCACABQX9qIgQgAXFFIgkEfyAEQQJxBSABQQJLBH9BAgVBAiABcAsLIgZBAnRqKAIAIgMEQCADKAIAIgMEQAJAAkAgCQRAA0AgAygCBCIJQQJGIhQgCSAEcSAGRnJFDQMgFARAIAMoAghBAkYNAwsgAygCACIDDQALBQNAIAMoAgQiBEECRgRAIAMoAghBAkYNAwUgBCABTwRAIAQgAXAhBAsgBCAGRw0ECyADKAIAIgMNAAsLDAELIAwgAkH4CxAMKwMAOQMAIAcoAgAiAigCBCEBCyABRQ0DCwsgAigCACABQX9qIgQgAXFFIgkEfyAEQQxxBSABQQxLBH9BDAVBDCABcAsLIgZBAnRqKAIAIgMEQCADKAIAIgMEQAJAIAkEQCADIQEDQCABKAIEIgNBDEYiCSADIARxIAZGckUNBiAJBEAgASgCCEEMRg0DCyABKAIAIgENAAsMBQUDQCADKAIEIgRBDEYEQCADKAIIQQxGDQMFIAQgAU8EQCAEIAFwIQQLIAQgBkcNBwsgAygCACIDDQAMBgALAAsACyAFIAJB/AsQDCgCADYCAAsLCwsgECgCACEDIA4oAgAgGCgCACICRwRAIA0gAkEBEA8gDigCACACRwRAQdUXQYQYQdEFQcUYEAQLCyACQQBKBEAgDSgCACEEQQAhAQNAIAQgAUEDdGogAyABQQN0aisDADkDACABQQFqIgEgAkcNAAsLIAcoAgAhASALBHwgCiASIA0gECABQfALEAwrAwAgBSAMEEogBSgCACEBIAcoAgBBiAwQDCABNgIAIAwrAwAFIAFBiAwQDEEANgIARAAAAAAAAAAACyEeIAcoAgBBjAwQDCAeOQMAIAcoAgBBgAwQDCAINgIAIAcoAgBBhAwQDCALNgIAAkAgACgCACIBIBEoAgAiA0cEQCAOKAIAIQggDSgCACEEA0ACQCABLAAcRQRAIAEoAggiAkF/SiAIIAJKcUUNASABKAIMIAQgAkEDdGorAwA5AwgLIAFBIGoiASADRw0BDAMLC0HsFkGJF0GYA0HKFxAECwsCQCAAKAJ4IABB9ABqIgkoAgAiAWsiAkEASgRAIAJBAnYhBANAIBUoAgAiBSABIARBf2oiC0ECdGooAgAiBkEobGorAwAhHiAFIAZBKGxqQQxqIQggBSAGQShsakEYaiEOAkAgBSAGQShsakEQaiIHKAIAIgEEfyAOKAIAIREgBSAGQShsakEQaiEDAkACQANAIBEgASgCECICSARAIAEoAgAiAkUNAgUgAiARTg0DIAFBBGoiAigCACIDRQ0FIAIhASADIQILIAEhAyACIQEMAAALAAsgASECDAILIAMFIAciAQshAgsgAigCACIDRQRAQSAQDiIDIA4oAgA2AhAgA0QAAAAAAAAAADkDGCADQQA2AgAgA0EANgIEIAMgATYCCCACIAM2AgAgCCgCACgCACIBBH8gCCABNgIAIAIoAgAFIAMLIQEgBSAGQShsaigCECABEBYgBSAGQShsakEUaiIBIAEoAgBBAWo2AgALIAMrAxghHyAOKAIAIQUgCCgCACIBIAdHBEADQCABKAIQIgIgBUcEQCAeIAErAxggACgCACACQQV0aigCDCsDCKKgIR4LAkAgASgCBCICBEAgAiEBA0AgASgCACICBEAgAiEBDAELCwUgAUEIaiICKAIAIgMoAgAgAUYEQCADIQEMAgsgAiEBA38gASgCACIDQQhqIgEoAgAiAigCACADRgR/IAIFDAELCyEBCwsgASAHRw0ACwsgACgCACAFQQV0aigCDCAemiAfozkDCCAEQQFMDQIgCyEEIAkoAgAhAQwAAAsACwsgEigCACIABEAgAEF8aigCABALCyAQKAIAIgAEQCAAQXxqKAIAEAsLIA0oAgAiAARAIABBfGooAgAQCwsgFygCABALIBYoAgAQCyAKKAIUIgAEQCAAEAsLIAooAhgiAARAIAAQCwsgDygCACIARQRAIAwkBA8LIBMgADYCACAAEAsgDCQEC70BAQZ/IwQhBSMEQRBqJAQgAEEANgIAIABBADYCBCAAQQA2AgggAUEIaiIEKAIAIgJFIAFBBGoiBigCACIDRXJFBEBB/////wcgA20gAkgEQEEEEAUiB0HwDDYCACAHQcALQQYQBgsLIAAgAiADEBIgBCgCACICRSAGKAIAIgNFckUEQEH/////ByADbSACSARAQQQQBSIEQfAMNgIAIARBwAtBBhAGCwsgACACIAMQEiAAIAEgBRCuASAFJAQLwScC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AyAOBEAgDCADNgIIIAsgAUEQaiICNgIAIAJBADYCACANQQA2AgAgCigCACECIAAoAgAhBQUgCCADNgIACyAHIARBKGxqQRhqIgMgAUEYaiIBKQMANwMAIAMgASkDCDcDCCACIAVGBEAgBiEDBSAGIQEDQCABQVhqIgMgAkFYaiIEKQMANwMAIAMgBCgCCDYCCCABQWRqIgsgAkFkaiIMKAIANgIAIAFBaGogAkFoaigCACINNgIAIAFBbGogAkFsaiIOKAIAIhA2AgAgAUFoaiEIIBAEQCANIAg2AgggDCACQWhqIgg2AgAgCEEANgIAIA5BADYCAAUgCyAINgIACyABQXBqIgEgAkFwaiICKQMANwMAIAEgAikDCDcDCCAEIAVHBEAgBCECIAMhAQwBCwsgACgCACEFIAooAgAhAgsgACADNgIAIAogBkEoajYCACAPIAcgCUEobGo2AgAgAiAFRwRAIAIhAANAIABBZGogAEFoaigCABAaIABBWGoiACAFRw0ACwsgBUUEQA8LIAUQCwv/AwERfyAAQQRqIgcoAgAgACgCACIDa0EFdSIEQQFqIgJB////P0sEQBAICwJ/IABBCGoiCygCACADayIDQQV1Qf///x9JIRIgA0EEdSIDIAJPBEAgAyECCyASCwR/IAIFQf///z8LIggEQCAIQf///z9LBEBBCBAFIgJBqBYQFSACQZgNNgIAIAJB4AtBCBAGBSAIQQV0EA4hCQsLIAkgBEEFdGoiAyABEEEgACgCACIKIQEgBygCACICIApGBH8gAyEEIAoFIARBf2ogAkFgaiABa0EFdmshDCACIQEgAyECA0AgAkFgaiIFIAFBYGoiBCkCADcCACAFIAQpAgg3AgggAkFwaiINIAFBcGoiDigCADYCACACQXRqIAFBdGooAgAiDzYCACACQXhqIAFBeGoiECgCACIRNgIAIAJBdGohBiARBEAgDyAGNgIIIA4gAUF0aiIGNgIAIAZBADYCACAQQQA2AgAFIA0gBjYCAAsgAkF8aiABQXxqLAAAOgAAIAQgCkcEQCAEIQEgBSECDAELCyAJIAxBBXRqIQQgACgCACEBIAcoAgALIQIgACAENgIAIAcgA0EgajYCACALIAkgCEEFdGo2AgAgAiABRwRAIAIhAANAIABBcGogAEF0aigCABAgIABBYGoiACAB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JAQPCyAEQRRqIRIgBEEQaiENIARBDGohGCAEQRxqIRkgAEEkaiEPIABBKGohGiAEQQxqIRMgBEEQaiEbIARBDGohHCAEQRhqIRQgAEEMaiEdQQAhBgNAIAooAgBBCkcEQCAEQgA3AwAgBEIANwMIIARCADcDECAEQgA3AxggBEIANwMgIBggDTYCACAZQQA2AgAgDygCACICIBooAgBJBEAgAiAEKQMANwMAIAIgBCgCCDYCCCACQQxqIgUgEygCADYCACACIBsoAgAiBzYCECACIBIoAgAiCDYCFCACQRBqIQMgCARAIAcgAzYCCCATIA02AgAgDUEANgIAIBJBADYCAAUgBSADNgIACyACQRhqIgIgFCkDADcDACACIBQpAwg3AwggDyAPKAIAQShqNgIABSARIAQQpQELIBwgDSgCABAaIBEoAgAiCSAGQShsaiIOIAorAyA5AwAgCSAGQShsakEIaiIeIAooAgA2AgAgCSAGQShsakF/NgIYIApBCGoiHygCACAKQQRqIiAoAgAiAkYEQCAJIAZBKGxqQRBqIQgFIApBEGohISAJIAZBKGxqQQxqIQwgCSAGQShsakEQaiEHIAkgBkEobGpBEGohCyAJIAZBKGxqQRRqIRBBACEIA0AgBCACIAhBAnRqKAIANgIAAn8gASAEEBQsAARFISIgISgCACAIQQN0aisDACEjICILBEAgIyABIAQQFCsDCKIhJCAOIgIrAwAhIwUgHSAEEEAhFSAHKAIAIgIEQCAVKAIAIRYgCyEDAkACQANAIBYgAigCECIFSAR/IAIoAgAiBUUNAiACIQMgBQUgBSAWTg0DIAJBBGoiAygCACIFRQ0DIAULIQIMAAALAAsgAiEDCwUgByICIQMLIAMoAgAiBUUEQEEgEA4iBSAVKAIANgIQIAVEAAAAAAAAAAA5AxggBUEANgIAIAVBADYCBCAFIAI2AgggAyAFNgIAIAwoAgAoAgAiAgR/IAwgAjYCACADKAIABSAFCyECIAsoAgAgAhAWIBAgECgCAEEBajYCAAsgBUEYaiIDIQIgAysDACEkCyACICMgJKA5AwAgCEEBaiIIIB8oAgAgICgCACICa0ECdUkNAAsgByEICyAAIA4gBhBCIAkgBkEobGooAgwiBSAIRwRAA0AgACgCACILIAUoAhAiDEEFdGpBEGohEAJA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Ly4uL3RoaXJkX3BhcnR5L0VpZ2VuL0VpZ2VuL3NyYy9MVS9GdWxsUGl2TFUuaABrZXJuZWwAcmFuawByaHMucm93cygpID09IHJvd3MAX3NvbHZlX2ltcGwAcGVybXV0YXRpb25QAHN0YXJ0Um93ID49IDAgJiYgYmxvY2tSb3dzID49IDAgJiYgc3RhcnRSb3cgPD0geHByLnJvd3MoKSAtIGJsb2NrUm93cyAmJiBzdGFydENvbCA+PSAwICYmIGJsb2NrQ29scyA+PSAwICYmIHN0YXJ0Q29sIDw9IHhwci5jb2xzKCkgLSBibG9ja0NvbHMAcGVybXV0YXRpb25RAHYgPT0gVChWYWx1ZSkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS91dGlsL1hwckhlbHBlci5oAHZhcmlhYmxlX2lmX2R5bmFtaWMAcm93cyA9PSB0aGlzLT5yb3dzKCkgJiYgY29scyA9PSB0aGlzLT5jb2xzKCkgJiYgIkRlbnNlQmFzZTo6cmVzaXplKCkgZG9lcyBub3QgYWN0dWFsbHkgYWxsb3cgdG8gcmVzaXplLiIAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9EZW5zZUJhc2UuaAAoKCFQYW5lbE1vZGUpICYmIHN0cmlkZT09MCAmJiBvZmZzZXQ9PTApIHx8IChQYW5lbE1vZGUgJiYgc3RyaWRlPj1kZXB0aCAmJiBvZmZzZXQ8PXN0cmlkZSkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9wcm9kdWN0cy9HZW5lcmFsQmxvY2tQYW5lbEtlcm5lbC5oAGRzdC5yb3dzKCk9PWFfbGhzLnJvd3MoKSAmJiBkc3QuY29scygpPT1hX3Jocy5jb2xzKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9wcm9kdWN0cy9HZW5lcmFsTWF0cml4TWF0cml4LmgAc2NhbGVBbmRBZGRUbwBtYXRyaXhMVQBtX2lzSW5pdGlhbGl6ZWQgfHwgbV91c2VQcmVzY3JpYmVkVGhyZXNob2xkAHRocmVzaG9sZABub256ZXJvUGl2b3RzAHJvdyA+PSAwICYmIHJvdyA8IHJvd3MoKSAmJiBjb2wgPj0gMCAmJiBjb2wgPCBjb2xzKCkAaT49MCAmJiBqPj0wICYmIGk8c2l6ZSgpICYmIGo8c2l6ZSgpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUGVybXV0YXRpb25NYXRyaXguaABhcHBseVRyYW5zcG9zaXRpb25PblRoZVJpZ2h0AGFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUAaW5kZXggPj0gMCAmJiBpbmRleCA8IHNpemUoKQBzcmMvY3BwLy4uLy4uL3RoaXJkX3BhcnR5L0VpZ2VuL0VpZ2VuL3NyYy9Db3JlL0RlbnNlQ29lZmZzQmFzZS5oAG9wZXJhdG9yW10AZHN0LnJvd3MoKSA9PSBkc3RSb3dzICYmIGRzdC5jb2xzKCkgPT0gZHN0Q29scwBzcmMvY3BwLy4uLy4uL3RoaXJkX3BhcnR5L0VpZ2VuL0VpZ2VuL3NyYy9Db3JlL0Fzc2lnbkV2YWx1YXRvci5oAHJlc2l6ZV9pZl9hbGxvd2VkAG1faXNJbml0aWFsaXplZCAmJiAiU29sdmVyIGlzIG5vdCBpbml0aWFsaXplZC4iAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0l0ZXJhdGl2ZUxpbmVhclNvbHZlcnMvSXRlcmF0aXZlU29sdmVyQmFzZS5oAHNvbHZlV2l0aEd1ZXNzAGRlcml2ZWQoKS5yb3dzKCk9PWIucm93cygpICYmICJzb2x2ZSgpOiBpbnZhbGlkIG51bWJlciBvZiByb3dzIG9mIHRoZSByaWdodCBoYW5kIHNpZGUgbWF0cml4IGIiAG1faXNJbml0aWFsaXplZCAmJiAiQ29uanVnYXRlR3JhZGllbnQgaXMgbm90IGluaXRpYWxpemVkLiIAaXRlcmF0aW9ucwBsaHMuY29scygpID09IHJocy5yb3dzKCkgJiYgImludmFsaWQgbWF0cml4IHByb2R1Y3QiICYmICJpZiB5b3Ugd2FudGVkIGEgY29lZmYtd2lzZSBvciBhIGRvdCBwcm9kdWN0IHVzZSB0aGUgcmVzcGVjdGl2ZSBleHBsaWNpdCBmdW5jdGlvbnMiAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUHJvZHVjdC5oAFByb2R1Y3QAYUxocy5yb3dzKCkgPT0gYVJocy5yb3dzKCkgJiYgYUxocy5jb2xzKCkgPT0gYVJocy5jb2xzKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9Dd2lzZUJpbmFyeU9wLmgAQ3dpc2VCaW5hcnlPcAByb3dzID49IDAgJiYgKFJvd3NBdENvbXBpbGVUaW1lID09IER5bmFtaWMgfHwgUm93c0F0Q29tcGlsZVRpbWUgPT0gcm93cykgJiYgY29scyA+PSAwICYmIChDb2xzQXRDb21waWxlVGltZSA9PSBEeW5hbWljIHx8IENvbHNBdENvbXBpbGVUaW1lID09IGNvbHMpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvQ3dpc2VOdWxsYXJ5T3AuaABDd2lzZU51bGxhcnlPcAB0aGlzLT5yb3dzKCk+MCAmJiB0aGlzLT5jb2xzKCk+MCAmJiAieW91IGFyZSB1c2luZyBhbiBlbXB0eSBtYXRyaXgiAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUmVkdXguaAByZWR1eABtX2lzSW5pdGlhbGl6ZWQgJiYgIkRpYWdvbmFsUHJlY29uZGl0aW9uZXIgaXMgbm90IGluaXRpYWxpemVkLiIAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvSXRlcmF0aXZlTGluZWFyU29sdmVycy9CYXNpY1ByZWNvbmRpdGlvbmVycy5oAHNvbHZlAG1faW52ZGlhZy5zaXplKCk9PWIucm93cygpICYmICJEaWFnb25hbFByZWNvbmRpdGlvbmVyOjpzb2x2ZSgpOiBpbnZhbGlkIG51bWJlciBvZiByb3dzIG9mIHRoZSByaWdodCBoYW5kIHNpZGUgbWF0cml4IGIiAHNpemUoKSA9PSBvdGhlci5zaXplKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvQ29yZS9Eb3QuaABkb3QAZHN0LnJvd3MoKSA9PSBzcmMucm93cygpICYmIGRzdC5jb2xzKCkgPT0gc3JjLmNvbHMoKQBtYXQucm93cygpPjAgJiYgbWF0LmNvbHMoKT4wICYmICJ5b3UgYXJlIHVzaW5nIGFuIGVtcHR5IG1hdHJpeCIAcnVuAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUHJvZHVjdEV2YWx1YXRvcnMuaAAoaT49MCkgJiYgKCAoKEJsb2NrUm93cz09MSkgJiYgKEJsb2NrQ29scz09WHByVHlwZTo6Q29sc0F0Q29tcGlsZVRpbWUpICYmIGk8eHByLnJvd3MoKSkgfHwoKEJsb2NrUm93cz09WHByVHlwZTo6Um93c0F0Q29tcGlsZVRpbWUpICYmIChCbG9ja0NvbHM9PTEpICYmIGk8eHByLmNvbHMoKSkpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvQmxvY2suaABCbG9jawByb3dzKCk+MCAmJiBjb2xzKCk+MCAmJiAieW91IGFyZSB1c2luZyBhIG5vbiBpbml0aWFsaXplZCBtYXRyaXgiAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL1NwYXJzZUNvcmUvU3BhcnNlUmVkdXguaABzdW0Ab3BlcmF0b3IoKQAoZGF0YVB0ciA9PSAwKSB8fCAoIHJvd3MgPj0gMCAmJiAoUm93c0F0Q29tcGlsZVRpbWUgPT0gRHluYW1pYyB8fCBSb3dzQXRDb21waWxlVGltZSA9PSByb3dzKSAmJiBjb2xzID49IDAgJiYgKENvbHNBdENvbXBpbGVUaW1lID09IER5bmFtaWMgfHwgQ29sc0F0Q29tcGlsZVRpbWUgPT0gY29scykpAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvTWFwQmFzZS5oAE1hcEJhc2UAdmVjU2l6ZSA+PSAwACghKFJvd3NBdENvbXBpbGVUaW1lIT1EeW5hbWljKSB8fCAocm93cz09Um93c0F0Q29tcGlsZVRpbWUpKSAmJiAoIShDb2xzQXRDb21waWxlVGltZSE9RHluYW1pYykgfHwgKGNvbHM9PUNvbHNBdENvbXBpbGVUaW1lKSkgJiYgKCEoUm93c0F0Q29tcGlsZVRpbWU9PUR5bmFtaWMgJiYgTWF4Um93c0F0Q29tcGlsZVRpbWUhPUR5bmFtaWMpIHx8IChyb3dzPD1NYXhSb3dzQXRDb21waWxlVGltZSkpICYmICghKENvbHNBdENvbXBpbGVUaW1lPT1EeW5hbWljICYmIE1heENvbHNBdENvbXBpbGVUaW1lIT1EeW5hbWljKSB8fCAoY29sczw9TWF4Q29sc0F0Q29tcGlsZVRpbWUpKSAmJiByb3dzPj0wICYmIGNvbHM+PTAgJiYgIkludmFsaWQgc2l6ZXMgd2hlbiByZXNpemluZyBhIG1hdHJpeCBvciBhcnJheS4iAHNyYy9jcHAvLi4vLi4vdGhpcmRfcGFydHkvRWlnZW4vRWlnZW4vc3JjL0NvcmUvUGxhaW5PYmplY3RCYXNlLmgAcmVzaXplAGl0LT5yb3coKT49MCAmJiBpdC0+cm93KCk8bWF0LnJvd3MoKSAmJiBpdC0+Y29sKCk+PTAgJiYgaXQtPmNvbCgpPG1hdC5jb2xzKCkAc3JjL2NwcC8uLi8uLi90aGlyZF9wYXJ0eS9FaWdlbi9FaWdlbi9zcmMvU3BhcnNlQ29yZS9TcGFyc2VNYXRyaXguaABzZXRfZnJvbV90cmlwbGV0cwAhaXNDb21wcmVzc2VkKCkAaW5zZXJ0QmFja1VuY29tcHJlc3NlZABtX2lubmVyTm9uWmVyb3Nbb3V0ZXJdPD0obV9vdXRlckluZGV4W291dGVyKzFdIC0gbV9vdXRlckluZGV4W291dGVyXSkAY29sbGFwc2VEdXBsaWNhdGVzACgoU2l6ZUF0Q29tcGlsZVRpbWUgPT0gRHluYW1pYyAmJiAoTWF4U2l6ZUF0Q29tcGlsZVRpbWU9PUR5bmFtaWMgfHwgc2l6ZTw9TWF4U2l6ZUF0Q29tcGlsZVRpbWUpKSB8fCBTaXplQXRDb21waWxlVGltZSA9PSBzaXplKSAmJiBzaXplPj0wAFN0OWV4Y2VwdGlvbgBOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQBTdDl0eXBlX2luZm8ATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAE4xMF9fY3h4YWJpdjExN19fY2xhc3NfdHlwZV9pbmZvRQBzdGQ6OmJhZF9hbGxvYwBTdDliYWRfYWxsb2MAU3QxMWxvZ2ljX2Vycm9yAFN0MTJsZW5ndGhfZXJyb3I="; var asmjsCodeFile = ""; if (!isDataURI(wasmTextFile)) { wasmTextFile = locateFile(wasmTextFile) } if (!isDataURI(wasmBinaryFile)) { wasmBinaryFile = locateFile(wasmBinaryFile) } if (!isDataURI(asmjsCodeFile)) { asmjsCodeFile = locateFile(asmjsCodeFile) } var wasmPageSize = 64 * 1024; var info = { "global": null, "env": null, "asm2wasm": asm2wasmImports, "parent": Module }; var exports = null; function mergeMemory(newBuffer) { var oldBuffer = Module["buffer"]; if (newBuffer.byteLength < oldBuffer.byteLength) { err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here") } var oldView = new Int8Array(oldBuffer); var newView = new Int8Array(newBuffer); newView.set(oldView); updateGlobalBuffer(newBuffer); updateGlobalBufferViews() } function fixImports(imports) { return imports } function getBinary() { try { if (Module["wasmBinary"]) { return new Uint8Array(Module["wasmBinary"]) } var binary = tryParseAsDataURI(wasmBinaryFile); if (binary) { return binary } if (Module["readBinary"]) { return Module["readBinary"](wasmBinaryFile) } else { throw "both async and sync fetching of the wasm failed" } } catch (err) { abort(err) } } function getBinaryPromise() { if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") { return fe_tch(wasmBinaryFile, { credentials: "same-origin" }).then((function (response) { if (!response["ok"]) { throw "failed to load wasm binary file at '" + wasmBinaryFile + "'" } return response["arrayBuffer"]() })).catch((function () { return getBinary() })) } return new Promise((function (resolve, reject) { resolve(getBinary()) })) } function doNativeWasm(global, env, providedBuffer) { if (typeof WebAssembly !== "object") { err("no native wasm support detected"); return false } if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) { err("no native wasm Memory in use"); return false } env["memory"] = Module["wasmMemory"]; info["global"] = { "NaN": NaN, "Infinity": Infinity }; info["global.Math"] = Math; info["env"] = env; function receiveInstance(instance, module) { exports = instance.exports; if (exports.memory) mergeMemory(exports.memory); Module["asm"] = exports; Module["usingWasm"] = true; removeRunDependency("wasm-instantiate") } addRunDependency("wasm-instantiate"); if (Module["instantiateWasm"]) { try { return Module["instantiateWasm"](info, receiveInstance) } catch (e) { err("Module.instantiateWasm callback failed with error: " + e); return false } } function receiveInstantiatedSource(output) { receiveInstance(output["instance"], output["module"]) } function instantiateArrayBuffer(receiver) { WebAssembly.instantiate(getBinary(), info).then(receiver).catch((function (reason) { err("failed to asynchronously prepare wasm: " + reason); abort(reason) })) } if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") { WebAssembly.instantiateStreaming(wasmBinaryFile, info).then(receiveInstantiatedSource).catch((function (reason) { err("wasm streaming compile failed: " + reason); err("falling back to ArrayBuffer instantiation"); instantiateArrayBuffer(receiveInstantiatedSource) })) } else { instantiateArrayBuffer(receiveInstantiatedSource) } return {} } Module["asmPreload"] = Module["asm"]; var asmjsReallocBuffer = Module["reallocBuffer"]; var wasmReallocBuffer = (function (size) { var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; size = alignUp(size, PAGE_MULTIPLE); var old = Module["buffer"]; var oldSize = old.byteLength; if (Module["usingWasm"]) { try { var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize); if (result !== (-1 | 0)) { return Module["buffer"] = Module["wasmMemory"].buffer } else { return null } } catch (e) { return null } } }); Module["reallocBuffer"] = (function (size) { if (finalMethod === "asmjs") { return asmjsReallocBuffer(size) } else { return wasmReallocBuffer(size) } }); var finalMethod = ""; Module["asm"] = (function (global, env, providedBuffer) { env = fixImports(env); if (!env["table"]) { var TABLE_SIZE = Module["wasmTableSize"]; if (TABLE_SIZE === undefined) TABLE_SIZE = 1024; var MAX_TABLE_SIZE = Module["wasmMaxTableSize"]; if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") { if (MAX_TABLE_SIZE !== undefined) { env["table"] = new WebAssembly.Table({ "initial": TABLE_SIZE, "maximum": MAX_TABLE_SIZE, "element": "anyfunc" }) } else { env["table"] = new WebAssembly.Table({ "initial": TABLE_SIZE, element: "anyfunc" }) } } else { env["table"] = new Array(TABLE_SIZE) } Module["wasmTable"] = env["table"] } if (!env["memoryBase"]) { env["memoryBase"] = Module["STATIC_BASE"] } if (!env["tableBase"]) { env["tableBase"] = 0 } var exports; exports = doNativeWasm(global, env, providedBuffer); assert(exports, "no binaryen method succeeded."); return exports }) } integrateWasmJS(); STATIC_BASE = GLOBAL_BASE; STATICTOP = STATIC_BASE + 6976; __ATINIT__.push(); var STATIC_BUMP = 6976; Module["STATIC_BASE"] = STATIC_BASE; Module["STATIC_BUMP"] = STATIC_BUMP; STATICTOP += 16; function ___assert_fail(condition, filename, line, func) { abort("Assertion failed: " + Pointer_stringify(condition) + ", at: " + [filename ? Pointer_stringify(filename) : "unknown filename", line, func ? Pointer_stringify(func) : "unknown function"]) } function ___cxa_allocate_exception(size) { return _malloc(size) } function __ZSt18uncaught_exceptionv() { return !!__ZSt18uncaught_exceptionv.uncaught_exception } var EXCEPTIONS = { last: 0, caught: [], infos: {}, deAdjust: (function (adjusted) { if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted; for (var key in EXCEPTIONS.infos) { var ptr = +key; var info = EXCEPTIONS.infos[ptr]; if (info.adjusted === adjusted) { return ptr } } return adjusted }), addRef: (function (ptr) { if (!ptr) return; var info = EXCEPTIONS.infos[ptr]; info.refcount++ }), decRef: (function (ptr) { if (!ptr) return; var info = EXCEPTIONS.infos[ptr]; assert(info.refcount > 0); info.refcount--; if (info.refcount === 0 && !info.rethrown) { if (info.destructor) { Module["dynCall_vi"](info.destructor, ptr) } delete EXCEPTIONS.infos[ptr]; ___cxa_free_exception(ptr) } }), clearRef: (function (ptr) { if (!ptr) return; var info = EXCEPTIONS.infos[ptr]; info.refcount = 0 }) }; function ___cxa_throw(ptr, type, destructor) { EXCEPTIONS.infos[ptr] = { ptr: ptr, adjusted: ptr, type: type, destructor: destructor, refcount: 0, caught: false, rethrown: false }; EXCEPTIONS.last = ptr; if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) { __ZSt18uncaught_exceptionv.uncaught_exception = 1 } else { __ZSt18uncaught_exceptionv.uncaught_exception++ } throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch." } function _abort() { Module["abort"]() } function _llvm_trap() { abort("trap!") } function _emscripten_memcpy_big(dest, src, num) { HEAPU8.set(HEAPU8.subarray(src, src + num), dest); return dest } function ___setErrNo(value) { if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value; return value } DYNAMICTOP_PTR = staticAlloc(4); STACK_BASE = STACKTOP = alignMemory(STATICTOP); STACK_MAX = STACK_BASE + TOTAL_STACK; DYNAMIC_BASE = alignMemory(STACK_MAX); HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE; staticSealed = true; var ASSERTIONS = false; function intArrayToString(array) { var ret = []; for (var i = 0; i < array.length; i++) { var chr = array[i]; if (chr > 255) { if (ASSERTIONS) { assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.") } chr &= 255 } ret.push(String.fromCharCode(chr)) } return ret.join("") } var decodeBase64 = typeof atob === "function" ? atob : (function (input) { var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; var output = ""; var chr1, chr2, chr3; var enc1, enc2, enc3, enc4; var i = 0; input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); do { enc1 = keyStr.indexOf(input.charAt(i++)); enc2 = keyStr.indexOf(input.charAt(i++)); enc3 = keyStr.indexOf(input.charAt(i++)); enc4 = keyStr.indexOf(input.charAt(i++)); chr1 = enc1 << 2 | enc2 >> 4; chr2 = (enc2 & 15) << 4 | enc3 >> 2; chr3 = (enc3 & 3) << 6 | enc4; output = output + String.fromCharCode(chr1); if (enc3 !== 64) { output = output + String.fromCharCode(chr2) } if (enc4 !== 64) { output = output + String.fromCharCode(chr3) } } while (i < input.length); return output }); function intArrayFromBase64(s) { if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) { var buf; try { buf = Buffer.from(s, "base64") } catch (_) { buf = new Buffer(s, "base64") } return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength) } try { var decoded = decodeBase64(s); var bytes = new Uint8Array(decoded.length); for (var i = 0; i < decoded.length; ++i) { bytes[i] = decoded.charCodeAt(i) } return bytes } catch (_) { throw new Error("Converting base64 string to bytes failed.") } } function tryParseAsDataURI(filename) { if (!isDataURI(filename)) { return } return intArrayFromBase64(filename.slice(dataURIPrefix.length)) } Module["wasmTableSize"] = 35; Module["wasmMaxTableSize"] = 35; Module.asmGlobalArg = {}; Module.asmLibraryArg = { "abort": abort, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "___assert_fail": ___assert_fail, "___cxa_allocate_exception": ___cxa_allocate_exception, "___cxa_throw": ___cxa_throw, "___setErrNo": ___setErrNo, "_abort": _abort, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_llvm_trap": _llvm_trap, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "STACKTOP": STACKTOP }; var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer); Module["asm"] = asm; var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = (function () { return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments) }); var _linalg_matrix_add = Module["_linalg_matrix_add"] = (function () { return Module["asm"]["_linalg_matrix_add"].apply(null, arguments) }); var _linalg_matrix_add_scale = Module["_linalg_matrix_add_scale"] = (function () { return Module["asm"]["_linalg_matrix_add_scale"].apply(null, arguments) }); var _linalg_matrix_col_stride = Module["_linalg_matrix_col_stride"] = (function () { return Module["asm"]["_linalg_matrix_col_stride"].apply(null, arguments) }); var _linalg_matrix_cols = Module["_linalg_matrix_cols"] = (function () { return Module["asm"]["_linalg_matrix_cols"].apply(null, arguments) }); var _linalg_matrix_create = Module["_linalg_matrix_create"] = (function () { return Module["asm"]["_linalg_matrix_create"].apply(null, arguments) }); var _linalg_matrix_data = Module["_linalg_matrix_data"] = (function () { return Module["asm"]["_linalg_matrix_data"].apply(null, arguments) }); var _linalg_matrix_destroy = Module["_linalg_matrix_destroy"] = (function () { return Module["asm"]["_linalg_matrix_destroy"].apply(null, arguments) }); var _linalg_matrix_ediv = Module["_linalg_matrix_ediv"] = (function () { return Module["asm"]["_linalg_matrix_ediv"].apply(null, arguments) }); var _linalg_matrix_emul = Module["_linalg_matrix_emul"] = (function () { return Module["asm"]["_linalg_matrix_emul"].apply(null, arguments) }); var _linalg_matrix_fill = Module["_linalg_matrix_fill"] = (function () { return Module["asm"]["_linalg_matrix_fill"].apply(null, arguments) }); var _linalg_matrix_init = Module["_linalg_matrix_init"] = (function () { return Module["asm"]["_linalg_matrix_init"].apply(null, arguments) }); var _linalg_matrix_l1_norm = Module["_linalg_matrix_l1_norm"] = (function () { return Module["asm"]["_linalg_matrix_l1_norm"].apply(null, arguments) }); var _linalg_matrix_mmul = Module["_linalg_matrix_mmul"] = (function () { return Module["asm"]["_linalg_matrix_mmul"].apply(null, arguments) }); var _linalg_matrix_norm = Module["_linalg_matrix_norm"] = (function () { return Module["asm"]["_linalg_matrix_norm"].apply(null, arguments) }); var _linalg_matrix_row_stride = Module["_linalg_matrix_row_stride"] = (function () { return Module["asm"]["_linalg_matrix_row_stride"].apply(null, arguments) }); var _linalg_matrix_rows = Module["_linalg_matrix_rows"] = (function () { return Module["asm"]["_linalg_matrix_rows"].apply(null, arguments) }); var _linalg_matrix_scale = Module["_linalg_matrix_scale"] = (function () { return Module["asm"]["_linalg_matrix_scale"].apply(null, arguments) }); var _linalg_matrix_size = Module["_linalg_matrix_size"] = (function () { return Module["asm"]["_linalg_matrix_size"].apply(null, arguments) }); var _linalg_matrix_sub = Module["_linalg_matrix_sub"] = (function () { return Module["asm"]["_linalg_matrix_sub"].apply(null, arguments) }); var _linalg_solve_linear_system = Module["_linalg_solve_linear_system"] = (function () { return Module["asm"]["_linalg_solve_linear_system"].apply(null, arguments) }); var _malloc = Module["_malloc"] = (function () { return Module["asm"]["_malloc"].apply(null, arguments) }); var _memory_alloc = Module["_memory_alloc"] = (function () { return Module["asm"]["_memory_alloc"].apply(null, arguments) }); var _memory_free = Module["_memory_free"] = (function () { return Module["asm"]["_memory_free"].apply(null, arguments) }); var _solver_add_constraint = Module["_solver_add_constraint"] = (function () { return Module["asm"]["_solver_add_constraint"].apply(null, arguments) }); var _solver_add_constraint_coefficient = Module["_solver_add_constraint_coefficient"] = (function () { return Module["asm"]["_solver_add_constraint_coefficient"].apply(null, arguments) }); var _solver_add_variable = Module["_solver_add_variable"] = (function () { return Module["asm"]["_solver_add_variable"].apply(null, arguments) }); var _solver_clear_constraint_coefficients = Module["_solver_clear_constraint_coefficients"] = (function () { return Module["asm"]["_solver_clear_constraint_coefficients"].apply(null, arguments) }); var _solver_compute_loss = Module["_solver_compute_loss"] = (function () { return Module["asm"]["_solver_compute_loss"].apply(null, arguments) }); var _solver_create = Module["_solver_create"] = (function () { return Module["asm"]["_solver_create"].apply(null, arguments) }); var _solver_destroy = Module["_solver_destroy"] = (function () { return Module["asm"]["_solver_destroy"].apply(null, arguments) }); var _solver_get_attribute_f = Module["_solver_get_attribute_f"] = (function () { return Module["asm"]["_solver_get_attribute_f"].apply(null, arguments) }); var _solver_get_attribute_i = Module["_solver_get_attribute_i"] = (function () { return Module["asm"]["_solver_get_attribute_i"].apply(null, arguments) }); var _solver_get_value = Module["_solver_get_value"] = (function () { return Module["asm"]["_solver_get_value"].apply(null, arguments) }); var _solver_get_values = Module["_solver_get_values"] = (function () { return Module["asm"]["_solver_get_values"].apply(null, arguments) }); var _solver_make_constant = Module["_solver_make_constant"] = (function () { return Module["asm"]["_solver_make_constant"].apply(null, arguments) }); var _solver_set_attribute_f = Module["_solver_set_attribute_f"] = (function () { return Module["asm"]["_solver_set_attribute_f"].apply(null, arguments) }); var _solver_set_attribute_i = Module["_solver_set_attribute_i"] = (function () { return Module["asm"]["_solver_set_attribute_i"].apply(null, arguments) }); var _solver_set_constraint_bias = Module["_solver_set_constraint_bias"] = (function () { return Module["asm"]["_solver_set_constraint_bias"].apply(null, arguments) }); var _solver_set_constraint_strength = Module["_solver_set_constraint_strength"] = (function () { return Module["asm"]["_solver_set_constraint_strength"].apply(null, arguments) }); var _solver_set_value = Module["_solver_set_value"] = (function () { return Module["asm"]["_solver_set_value"].apply(null, arguments) }); var _solver_set_values = Module["_solver_set_values"] = (function () { return Module["asm"]["_solver_set_values"].apply(null, arguments) }); var _solver_solve = Module["_solver_solve"] = (function () { return Module["asm"]["_solver_solve"].apply(null, arguments) }); var stackAlloc = Module["stackAlloc"] = (function () { return Module["asm"]["stackAlloc"].apply(null, arguments) }); var stackRestore = Module["stackRestore"] = (function () { return Module["asm"]["stackRestore"].apply(null, arguments) }); var stackSave = Module["stackSave"] = (function () { return Module["asm"]["stackSave"].apply(null, arguments) }); var dynCall_v = Module["dynCall_v"] = (function () { return Module["asm"]["dynCall_v"].apply(null, arguments) }); var dynCall_vi = Module["dynCall_vi"] = (function () { return Module["asm"]["dynCall_vi"].apply(null, arguments) }); Module["asm"] = asm; Module["cwrap"] = cwrap; Module["then"] = (function (func) { if (Module["calledRun"]) { func(Module) } else { var old = Module["onRuntimeInitialized"]; Module["onRuntimeInitialized"] = (function () { if (old) old(); func(Module) }) } return Module }); function ExitStatus(status) { this.name = "ExitStatus"; this.message = "Program terminated with exit(" + status + ")"; this.status = status } ExitStatus.prototype = new Error; ExitStatus.prototype.constructor = ExitStatus; dependenciesFulfilled = function runCaller() { if (!Module["calledRun"]) run(); if (!Module["calledRun"]) dependenciesFulfilled = runCaller }; function run(args) { args = args || Module["arguments"]; if (runDependencies > 0) { return } preRun(); if (runDependencies > 0) return; if (Module["calledRun"]) return; function doRun() { if (Module["calledRun"]) return; Module["calledRun"] = true; if (ABORT) return; ensureInitRuntime(); preMain(); if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"](); postRun() } if (Module["setStatus"]) { Module["setStatus"]("Running..."); setTimeout((function () { setTimeout((function () { Module["setStatus"]("") }), 1); doRun() }), 1) } else { doRun() } } Module["run"] = run; function abort(what) { if (Module["onAbort"]) { Module["onAbort"](what) } if (what !== undefined) { out(what); err(what); what = JSON.stringify(what) } else { what = "" } ABORT = true; EXITSTATUS = 1; throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info." } Module["abort"] = abort; if (Module["preInit"]) { if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]]; while (Module["preInit"].length > 0) { Module["preInit"].pop()() } } Module["noExitRuntime"] = true; run()





              return Module;
            }
          );
        })();
        if (true)
          module.exports = Module;
        else if (typeof define === 'function' && define['amd'])
          define([], function () { return Module; });
        else if (typeof exports === 'object')
          exports["Module"] = Module;

        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(0), "/", __webpack_require__(1).Buffer))

      /***/
    })
/******/]);
});