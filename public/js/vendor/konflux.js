/*
 *       __    Konflux (version 1.0.0-alpha.59 - 2015-10-02) - a javascript helper library
 *      /\_\
 *   /\/ / /   Copyright 2012-2015, Konfirm (Rogier Spieker)
 *   \  / /    Released under the MIT license
 *    \/_/     More information: http://konfirm.net/konflux
 *
 *  Contributors:
 *  - Daan van Ham <daan@vanham.io>
 *  - Paul den Otter <pauldenotter@gmail.com>
 */

;(function(window, register, undefined) {
	'use strict';

	/*
	 *  BUILD INFO
	 *  ---------------------------------------------------------------------
	 *    date: Fri Oct 02 2015 10:26:02 GMT+0200 (CEST)
	 *    time: 27.74ms
	 *    size: 135.72KB
	 *  ---------------------------------------------------------------------
	 *   files: included 14 files
	 *     +2.02KB src/core/url
	 *     +3.35KB src/core/timing
	 *     +3.81KB src/core/array
	 *     +9.57KB src/core/string [uses: array]
	 *     +5.63KB src/core/point
	 *    +10.22KB src/core/iterator [uses: array]
	 *     +9.38KB src/core/dom [uses: iterator, style]
	 *     +7.45KB src/core/browser [uses: string]
	 *    +34.34KB src/core/event [uses: browser, dom, iterator, point, string, style]
	 *    +18.22KB src/core/style [uses: array, browser, event, string, url]
	 *     +5.73KB src/core/storage [uses: string]
	 *     +6.62KB src/core/observer [uses: array]
	 *     +2.89KB src/core/number [uses: string]
	 *     +8.97KB src/core/ajax [uses: event, observer, string, url]
	 */

	var version = '1.0.0-alpha.59 - 2015-10-02 - 5203429';

	/**
	 *  The Konflux object
	 *  @name    Konflux
	 *  @type    constructor function
	 *  @access  internal
	 *  @return  object   konflux
	 *  @note    konflux is available both as (window.)konflux and (window.)kx
	 */
	function Konflux() {
		/*jshint validthis: true*/
		var kx = this,
			counter = 0,
			timestamp;

		function init() {
			timestamp = kx.time();
		}

		/**
		 *  Verify whether given argument is empty
		 *  @name    empty
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed variable to check
		 *  @return  bool  empty
		 *  @note    The function follows PHP's empty function; null, undefined, 0, '', '0', {}, [] and false are all considered empty
		 */
		function empty(p) {
			var types = {
					array:   function(a) {
						return a.length > 0;
					},

					object:  function(o) {
						for (o in o) {
							return true;
						}

						return false;
					},

					boolean: function(b) {
						return b;
					},

					number:  function(n) {
						return n !== 0;
					},

					string:  function(s) {
						return !/^0?$/.test(s);
					}
				},
				t = kx.type(p);

			if (isType('function', types[t]) && types[t](p)) {
				return false;
			}

			return true;
		}

		/**
		 *  Test the type of given variable
		 *  @name    isType
		 *  @type    method
		 *  @access  internal
		 *  @param   string type
		 *  @param   mixed  variable
		 *  @return  bool   is type
		 */
		function isType(type, variable) {
			var full = kx.type(variable),
				check = type && type.length ? full.substr(0, type.length) : null;

			if (check !== type) {
				switch (full) {
					case 'object':
						check = kx.type(variable, true).substr(0, type.length);
						break;

					case 'number':
						check = (parseInt(variable, 10) === variable ? 'integer' : 'float').substr(0, type.length);
						break;
				}
			}

			return check === type;
		}

		/**
		 *  Obtain the milliseconds since the UNIX Epoch (Jan 1, 1970 00:00:00.000)
		 *  @name    time
		 *  @type    method
		 *  @access  public
		 *  @return  int milliseconds
		 */
		kx.time = function() {
			return Date.now ? Date.now() : (new Date()).getTime();
		};

		/**
		 *  Obtain the elapsed time since Konflux started (roughly), using the format: [Nd] hh:mm:ss.ms
		 *  @name    elapsed
		 *  @type    method
		 *  @access  public
		 *  @return  string formatted time
		 */
		kx.elapsed = function() {
			var day = 86400000,
				hour = 3600000,
				minute = 60000,
				delta = Math.abs((new Date()).getTime() - timestamp),
				days = Math.floor(delta / day),
				hours = Math.floor((delta -= days * day) / hour),
				minutes = Math.floor((delta -= hours * hour) / minute),
				seconds = Math.floor((delta -= minutes * minute) / 1000),
				ms = Math.floor(delta -= seconds * 1000),
				zero = '000';

			return (days > 0 ? days + 'd ' : '') +
					(zero + hours).substr(-2) + ':' +
					(zero + minutes).substr(-2) + ':' +
					(zero + seconds).substr(-2) + '.' +
					(zero + ms).substr(-3);
		};

		/**
		 *  Obtain an unique key, the key is guaranteed to be unique within the browser runtime
		 *  @name    unique
		 *  @type    method
		 *  @access  public
		 *  @return  string key
		 */
		kx.unique = function() {
			return (++counter + kx.time() % 86400000).toString(36);
		};

		/**
		 *  Shorthand method for creating a combined version of several objects
		 *  @name    combine
		 *  @type    method
		 *  @access  public
		 *  @param   object variable1
		 *  @param   object ...
		 *  @param   object variableN
		 *  @return  function constructor
		 */
		kx.combine = function() {
			var obj = {},
				arg = arguments,
				i, p;

			for (i = 0; i < arg.length; ++i) {
				if (kx.isType('object', arg[i])) {
					for (p in arg[i]) {
						obj[p] = p in obj && kx.isType('object', obj[p]) ? kx.combine(arg[i][p], obj[p]) : arg[i][p];
					}
				}
			}

			return obj;
		};

		/**
		 *  Verify whether given arguments are empty
		 *  @name    empty
		 *  @type    method
		 *  @access  public
		 *  @param   mixed variable1
		 *  @param   mixed ...
		 *  @param   mixed variableN
		 *  @return  bool  variables are empty
		 */
		kx.empty = function() {
			var arg = Array.prototype.slice.call(arguments);

			while (arg.length) {
				if (!empty(arg.shift())) {
					return false;
				}
			}

			return true;
		};

		/**
		 *  Determine the type of given variable
		 *  @name    type
		 *  @type    method
		 *  @access  public
		 *  @param   mixed  variable
		 *  @param   bool   explicit types [optional, default undefined - simple types]
		 *  @return  string type
		 */
		kx.type = function(variable, explicit) {
			var result = variable instanceof Array ? 'array' : (variable === null ? 'null' : typeof variable),
				name;

			if (explicit && result === 'object') {
				name = /(?:function\s+)?(.{1,})\(/i.exec(variable.constructor.toString());

				if (name && name.length > 1 && name[1] !== 'Object') {
					return name[1];
				}
			}

			return result;
		};

		/**
		 *  Test the type of given variable
		 *  @name    isType
		 *  @type    method
		 *  @access  public
		 *  @param   string type
		 *  @param   mixed  variable
		 *  @return  bool   is type
		 */
		kx.isType = isType;

		/**
		 *  Obtain the konflux version info
		 *  @name   version
		 *  @type   method
		 *  @access public
		 *  @param  bool   info [optional, default false - no build information]
		 *  @return string version (object info if bool info is true)
		 */
		kx.version = function(info) {
			var match = version.split(' - '),
				prop = ['version', 'date', 'revision', 'type'],
				result = {};

			while (prop.length && match.length) {
				result[prop.shift()] = match.shift();
			}

			return info ? result : result.version;
		};

		/**
		 *  Provide feedback about deprecated features, once (per function, per browser view)
		 *  @name    deprecate
		 *  @type    function
		 *  @access  public
		 *  @param   string   message
		 *  @param   function callback
		 *  @param   object   scope [optional, default undefined - no scope]
		 *  @return  void
		 */
		kx.deprecate = function(message, callback, scope) {
			var shown;

			return function() {
				var method = ['info', 'warn', 'log'],
					i;

				if (!shown) {
					shown = true;

					for (i = 0 ; i < method.length; ++i) {
						/*global console*/
						if (kx.isType('function', console[method[i]])) {
							console[method[i]](kx.elapsed() + ' DEPRECATED: ' + message);
							break;
						}
					}
				}

				return callback.apply(scope || null, arguments);
			};
		};

		/**
		 *  Register a module or function onto the kx object
		 *  @name    register
		 *  @access  public
		 *  @param   string  name
		 *  @param   mixed   value [one of: object (module) or function]
		 *  @return  mixed   old value
		 */
		kx.register = function(name, module) {
			var result = false;

			if (kx.isType('function', module) || kx.isType('object', module)) {
				result = name in kx ? kx[name] : null;
				kx[name] = module;
			}

			return result;
		};

		init();
	}

	(function(konflux) {
		//  register object instances
		if (register) {
			register(konflux);
		}

		//  make konflux available on the global (window) scope both as 'konflux' and 'kx'
		window.konflux = window.kx = konflux;
	})(new Konflux());

})(window, function(konflux) {
	//BEGIN INCLUDE: core/url
	/**
	 *  Handle URL's/URI's
	 *  @module  url
	 *  @note    available as konflux.url / kx.url
	 */
	function KonfluxURL() {
		/*jshint validthis: true*/
		var url = this;

		/**
		 *  Parse given URL into its URI components
		 *  @name    parse
		 *  @type    function
		 *  @access  internal
		 *  @param   string location
		 *  @return  object result
		 */
		function parse(location) {
			//  URL regex + key processing based on the work of Derek Watson's jsUri (http://code.google.com/p/jsuri/)
			var match = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(location),
				prop = ['source', 'protocol', 'domain', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
				result = {};
			while (prop.length) {
				result[prop.shift()] = match.length ? match.shift() : '';
			}

			if (result.query) {
				result.query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(a, b, c) {
					if (konflux.isType('object', result.query)) {
						result.query = {};
					}

					if (b) {
						result.query[b] = c;
					}
				});
			}

			return result;
		}

		/**
		 *  The parsed url for the URL of the current page
		 *  @name    current
		 *  @type    object
		 *  @access  public
		 */
		url.current = !konflux.isType('undefined', window.location.href) ? parse(window.location.href) : false;

		/**
		 *  Parse given URL into its URI components
		 *  @name    parse
		 *  @type    method
		 *  @access  public
		 *  @param   string url
		 *  @return  object result
		 */
		url.parse   = parse;

		/**
		 *  Determine whether given URL is on the same domain as the page itself
		 *  @name    isLocal
		 *  @type    method
		 *  @access  public
		 *  @param   string location
		 *  @return  bool   local
		 */
		url.isLocal = function(location) {
			return url.current.domain === url.parse(location).domain;
		};
	}

	konflux.register('url', new KonfluxURL());

	//END INCLUDE: core/url [726.34µs, 1.89KB]
	//BEGIN INCLUDE: core/timing
	/**
	 *  Timing utils
	 *  @module  timing
	 *  @note    available as konflux.timing / kx.timing
	 */
	function KonfluxTiming() {
		/*jshint validthis: true*/
		var timing = this,
			stack = {};

		/*global KonfluxTimingDelay*/

		//BEGIN INCLUDE: timing/delay
		/**
		 *  Delay object, instances of this are be provided for all KonfluxTimings
		 *  @name    KonfluxTimingDelay
		 *  @type    class
		 *  @access  internal
		 *  @param   function handle
		 *  @param   Number   timeout
		 *  @param   string   reference
		 *  @return  KonfluxTimingDelay  object
		 */
		function KonfluxTimingDelay(handler, timeout, reference) {
			//
			'use strict';

			/*jshint validthis: true*/
			var delay = this,
				timer, raf;

			/**
			 *  Cancel the timer
			 *  @name    cancel
			 *  @type    function
			 *  @access  internal
			 *  @return  void
			 */
			function cancel() {
				clearTimeout(timer);
			}

			/**
			 *  Start the timer
			 *  @name    start
			 *  @type    function
			 *  @access  internal
			 *  @return  void
			 */
			function start() {
				timer = setTimeout(function() {
					if (!raf) {
						raf = konflux.browser.feature('requestAnimationFrame') || function(ready) {
							setTimeout(ready, 16);
						};
					}

					raf(cancel);

					handler.call();
				}, timeout);
			}

			//  expose
			/**
			 *  Cancel the timer
			 *  @name    cancel
			 *  @type    method
			 *  @access  public
			 *  @return  void
			 */
			delay.cancel = cancel;

			/**
			 *  Obtain the associated reference
			 *  @name    reference
			 *  @type    method
			 *  @access  public
			 *  @return  string reference
			 */
			delay.reference = function() {
				return reference;
			};

			start();
		}

		//END INCLUDE: timing/delay [733.16µs, 1.29KB]
		/**
		 *  Remove timer object by their reference
		 *  @name    remove
		 *  @type    function
		 *  @access  internal
		 *  @param   string reference
		 *  @return  void
		 */
		function remove(reference) {
			if (typeof stack[reference] !== 'undefined') {
				//  cancel the stack reference
				stack[reference].cancel();

				//  delete it
				delete stack[reference];
			}
		}

		/**
		 *  Create a timer object to call given handler after given delay and store it with given reference
		 *  @name    create
		 *  @type    function
		 *  @access  internal
		 *  @param   function handle
		 *  @param   Number   delay
		 *  @param   string   reference
		 *  @return  KonfluxTimingDelay  object
		 */
		function create(handler, delay, reference) {
			if (reference) {
				remove(reference);
			}
			else {
				reference = handler.toString() || konflux.unique();
			}

			stack[reference] = new KonfluxTimingDelay(handler, delay || 0, reference);

			return stack[reference];
		}

		//  expose
		/**
		 *  Remove timer object by their reference
		 *  @name    remove
		 *  @type    method
		 *  @access  public
		 *  @param   string reference
		 *  @return  void
		 */
		timing.remove = remove;

		/**
		 *  Create a timer object to call given handler after given delay and store it with given reference
		 *  @name    create
		 *  @type    method
		 *  @access  public
		 *  @param   function handle
		 *  @param   Number   delay
		 *  @param   string   reference
		 *  @return  KonfluxTimingDelay  object
		 */
		timing.create = create;
	}

	konflux.register('timing', new KonfluxTiming());

	//END INCLUDE: core/timing [1.93ms, 3.14KB]
	//BEGIN INCLUDE: core/array
	/**
	 *  Array utils
	 *  @module  array
	 *  @note    available as konflux.array / kx.array
	 */
	function KonfluxArray() {
		/*jshint validthis: true*/
		var array = this;

		/**
		 *  Determine whether given value (needle) is in the array (haystack)
		 *  @name    contains
		 *  @type    function
		 *  @access  internal
		 *  @param   array haystack
		 *  @param   mixed needle
		 *  @return  int   position
		 */
		function contains(a, v) {
			for (var i = 0; i < a.length; ++i) {
				if (a[i] === v) {
					return i;
				}
			}

			return false;
		}

		/**
		 *  Return the difference between two arrays
		 *  @name    diff
		 *  @type    function
		 *  @access  internal
		 *  @param   array array1
		 *  @param   array array2
		 *  @return  array difference
		 */
		function diff(a, b) {
			var ret = [],
				i;

			for (i = 0; i < a.length; ++i) {
				if (contains(b, a[i]) === false) {
					ret.push(a[i]);
				}
			}

			return ret;
		}

		/**
		 *  Create an array with values between (including) given start and end
		 *  @name    range
		 *  @type    function
		 *  @access  internal
		 *  @param   number start
		 *  @param   number end
		 *  @return  array range
		 */
		function range(a, b) {
			var r = [];
			b -= a;
			while (r.length <= b) {
				r.push(a + r.length);
			}

			return r;
		}

		/**
		 *  Shuffle given array
		 *  @name    shuffle
		 *  @type    function
		 *  @access  internal
		 *  @param   array source
		 *  @return  array shuffled
		 */
		function shuffle(a) {
			for (var j, x, i = a.length; i; j = (Math.random() * i) | 0, x = a[--i], a[i] = a[j], a[j] = x);
			return a;
		}

		/**
		 *  Cast given value to an array
		 *  @name    cast
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed source
		 *  @return  array source (bool false if the cast could not be done)
		 *  @note    any scalar value will become an array holding that value (e.g. 'my string' becomes ['my string'])
		 */
		function cast(mixed) {
			var result = false,
				len, i;

			switch (konflux.type(mixed)) {
				case 'object':
					if (!('length' in mixed)) {
						result = [mixed];
						break;
					}

					try {
						result = Array.prototype.slice.call(mixed);
					}
					catch (e) {
						for (result = [], len = mixed.length, i = 0; i < len; ++i) {
							result.push(mixed[i]);
						}
					}

					break;

				case 'null':
				case 'undefined':
					result = [];
					break;

				default:
					result = [mixed];
					break;
			}

			return result;
		}

		//  expose
		/**
		 *  Does the array contain given value
		 *  @name    contains
		 *  @type    method
		 *  @access  public
		 *  @param   array   haystack
		 *  @param   mixed   needle
		 *  @return  boolean contains
		 */
		array.contains = contains;

		/**
		 *  Return the difference between two arrays
		 *  @name    diff
		 *  @type    method
		 *  @access  public
		 *  @param   array array1
		 *  @param   array array2
		 *  @return  array difference
		 */
		array.diff = diff;

		/**
		 *  Create an array with values between (including) given start and end
		 *  @name    range
		 *  @type    method
		 *  @access  public
		 *  @param   int start
		 *  @param   int end
		 *  @return  array range
		 */
		array.range = range;

		/**
		 *  Shuffle given array
		 *  @name    shuffle
		 *  @type    method
		 *  @access  public
		 *  @param   array source
		 *  @return  array shuffled
		 */
		array.shuffle = shuffle;

		/**
		 *  Cast given value to an array
		 *  @name    cast
		 *  @type    method
		 *  @access  public
		 *  @param   mixed source
		 *  @return  array source (bool false if the cast could not be done)
		 *  @note    any scalar value will become an array holding that value (e.g. 'my string' becomes ['my string'])
		 */
		array.cast = cast;
	}

	konflux.register('array', new KonfluxArray());

	//END INCLUDE: core/array [1.03ms, 3.58KB]
	//BEGIN INCLUDE: core/string
	/**
	 *  String utils
	 *  @module  string
	 *  @note    available as konflux.string / kx.string
	 */
	function KonfluxString() {
		/*jshint validthis: true*/
		var string = this;

		//  'constants'
		string.PAD_LEFT    = 1;
		string.PAD_BOTH    = 2;
		string.PAD_RIGHT   = 3;
		string.TRIM_LEFT   = 1;
		string.TRIM_BOTH   = 2;
		string.TRIM_RIGHT  = 3;
		string.CHUNK_START = 1;
		string.CHUNK_END   = 2;

		/**
		 *  Javascript port of Java's String.hashCode()
		 *  (Based on http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/)
		 *  @name    hashCode
		 *  @type    function
		 *  @access  internal
		 *  @param   string input
		 *  @return  number hash (32bit integer)
		 */
		function hashCode(s) {
			for (var r = 0, i = 0, l = s.length; i < l; ++i) {
				r  = (r = r * 31 + s.charCodeAt(i)) & r;
			}

			return r;
		}

		/**
		 *  Create a hash from a string
		 *  @name    hash
		 *  @type    function
		 *  @access  internal
		 *  @param   string source
		 *  @return  string hash
		 */
		function hash(s) {
			var p = 16,
				pad = ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' + s).substr(-(Math.ceil((s.length || 1) / p) * p)),
				r = 0;

			while (pad.length) {
				r  += hashCode(pad.substr(0, p));
				pad = pad.substr(p);
			}

			return Math.abs(r).toString(36);
		}

		/**
		 *  Return the ASCII value of given character
		 *  @name    ord
		 *  @type    function
		 *  @access  internal
		 *  @param   string character
		 *  @return  number character code
		 */
		function ord(s) {
			return s.charCodeAt(0);
		}

		/**
		 *  Return the character corresponding with given ASCII value
		 *  @name    chr
		 *  @type    function
		 *  @access  internal
		 *  @param   number character code
		 *  @return  string character
		 */
		function chr(n) {
			return String.fromCharCode(n);
		}

		/**
		 *  Pad a string
		 *  @name    pad
		 *  @type    function
		 *  @access  internal
		 *  @param   string to pad
		 *  @param   number length
		 *  @param   string pad string
		 *  @param   int pad type
		 *  @return  padded string
		 */
		function pad(s, n, c, t) {
			c = new Array(n + 1).join(c);

			return (n -= s.length) > 0 && (t = t === string.PAD_LEFT ? n : (t === string.PAD_BOTH ? Math.ceil(n / 2) : 0)) !== false ? (t > 0 ? c.substr(0, t) : '') + s + c.substr(0, n - t) : s;
		}

		/**
		 *  Generate a checksum for given string
		 *  @name    checksum
		 *  @type    function
		 *  @access  internal
		 *  @param   string source
		 *  @return  string checksum
		 */
		function checksum(s) {
			for (var n = s.length, r = 0; n > 0; --n) {
				r += n * ord(s[n]);
			}

			return Math.abs((r + '' + s.length) | 0).toString(36);
		}

		/**
		 *  Generate a UUID
		 *  @name    uuid
		 *  @type    function
		 *  @access  internal
		 *  @return  string uuid
		 */
		function uuid() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0;

				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}

		/**
		 *  Split given string into chunks of given size
		 *  @name    chunk
		 *  @type    function
		 *  @access  internal
		 *  @param   string input
		 *  @param   int    size [optional, default 1]
		 *  @param   bool   end [optional, default false - start from the beginning of the input string]
		 *  @return  array chunks
		 *  @note    the last chunk is provided as is, there for it can be of a length less than given size
		 */
		function chunk(input, size, end) {
			var source = '' + input,
				output = [],
				i;

			if (!size || size === 1) {
				output = source.split('');
			}
			else if (input.length < size) {
				output.push(input);
			}
			else if (end) {
				for (i = source.length; i > 0; output.unshift(source.substr(i -= Math.min(source.length, size))), source) {
					source = source.substring(0, i);
				}
			}
			else {
				while (source.length > 0, output.push(source.substring(0, size)), source) {
					source = source.substr(size);
				}
			}

			return output;
		}

		/**
		 *  Convert characters based on their ASCII value
		 *  @name    ascii
		 *  @type    function
		 *  @access  internal
		 *  @param   string input
		 *  @param   object conversion (syntax: {replacement: [ASCII value, ASCII value, ...]})
		 *  @return  string converted
		 */
		function ascii(input, convert) {
			var result = [],
				i, p, s;

			for (i = 0; i < input.length; ++i) {
				s = input.substr(i, 1);
				for (p in convert) {
					if (konflux.array.contains(convert[p], s.charCodeAt(0)) !== false) {
						s = p;
						break;
					}
				}

				result.push(s);
			}

			return result.join('');
		}

		/**
		 *  Convert characters based on their ASCII value
		 *  @name    ascii
		 *  @type    method
		 *  @access  public
		 *  @param   string input
		 *  @param   object conversion (syntax: {replacement: [ASCII value, ASCII value, ...]} - optional, default high ASCII characters)
		 *  @return  string converted
		 */
		string.ascii = function(input, user) {
			return ascii(input, user || {
				A: [192, 193, 194, 195, 196, 197],
				C: [199],
				E: [200, 201, 202, 203],
				I: [204, 205, 206, 207],
				D: [208],
				N: [209],
				O: [210, 211, 212, 213, 214, 216],
				U: [217, 218, 219, 220],
				Y: [221],
				ss: [223],
				a: [224, 225, 226, 227, 228, 229],
				beta: [946],
				c: [231],
				e: [232, 233, 234, 235],
				i: [236, 237, 238, 239],
				n: [241],
				o: [240, 242, 243, 244, 245, 246],
				u: [249, 250, 251, 252],
				y: [253]
			});
		};

		/**
		 *  Trim string from leading/trailing pattern (whitespace by default)
		 *  @name    trim
		 *  @type    method
		 *  @access  public
		 *  @param   string input
		 *  @param   string character [default \s, may be the contents of a regular expression pattern]
		 *  @param   int    side [optional, One of: TRIM_BOTH (default), TRIM_LEFT, TRIM_RIGHT]
		 *  @return  string trimmed
		 *  @note    the side params are located in konflux.string (e.g. konflux.string.TRIM_LEFT)
		 */
		string.trim = function(input, chr, dir) {
			var chars = chr || ' \n\r\t\f',
				f, t;

			for (t = input.length; t > 0 && dir !== string.TRIM_LEFT && chars.indexOf(input.charAt(--t)) >= 0;);
			for (f = 0; f < t && dir !== string.TRIM_RIGHT && chars.indexOf(input.charAt(f)) >= 0; ++f);

			return input.substring(f, t + 1);
		};

		/**
		 *  Reverse given string
		 *  @name    reverse
		 *  @type    method
		 *  @access  public
		 *  @param   string input
		 *  @return  string reversed
		 */
		string.reverse = function(s) {
			for (var n = s.length, r = ''; n > 0; --n) {
				r += s[n];
			}

			return r;
		};

		/**
		 *  Pad a string
		 *  @name    pad
		 *  @type    method
		 *  @access  public
		 *  @param   string to pad
		 *  @param   number length
		 *  @param   string pad string [optional, default ' ' - a space]
		 *  @param   int type [optional, default PAD_RIGHT - add padding to the right. One of: PAD_LEFT, PAD_RIGHT (default), PAD_BOTH]
		 *  @return  string padded
		 *  @note    the type params are located in konflux.string (e.g. konflux.string.PAD_LEFT)
		 */
		string.pad = function(s, n, c, t) {
			return pad(s, n, c || ' ', t || string.PAD_RIGHT);
		};

		/**
		 *  Uppercase the first character of given string
		 *  @name    ucFirst
		 *  @type    method
		 *  @access  public
		 *  @param   string input
		 *  @return  string uppercased first character
		 */
		string.ucFirst = function(input) {
			return input.charAt(0).toUpperCase() + input.substr(1);
		};

		/**
		 *  Create a hash from a string
		 *  @name    hash
		 *  @type    method
		 *  @access  public
		 *  @param   string input
		 *  @return  string hash
		 */
		string.hash = hash;

		/**
		 *  Generate a checksum for given string
		 *  @name    checksum
		 *  @type    method
		 *  @access  public
		 *  @param   string source
		 *  @return  string checksum
		 */
		string.checksum = checksum;

		/**
		 *  Generate a UUID
		 *  @name    uuid
		 *  @type    method
		 *  @access  public
		 *  @return  string uuid
		 */
		string.uuid = uuid;

		/**
		 *  Return the ASCII value of given character
		 *  @name    ord
		 *  @type    method
		 *  @access  public
		 *  @param   string character
		 *  @return  number character code
		 */
		string.ord = ord;

		/**
		 *  Return the character corresponding with given ASCII value
		 *  @name    chr
		 *  @type    method
		 *  @access  public
		 *  @param   int    code
		 *  @return  string character
		 */
		string.chr = chr;

		/**
		 *  Divide the given input string into chunks of certain size
		 *  @name    chunk
		 *  @type    method
		 *  @access  public
		 *  @param   string input
		 *  @param   int    size [optional, default 1]
		 *  @param   int    direction [optional, default CHUNK_START - start the chunks from the start, one of: CHUNK_START, CHUNK_END]
		 *  @return  array chunks
		 *  @note    the last chunk is provided as is, there for it can be of a length less than given size
		 */
		string.chunk = function(input, size, start) {
			return chunk(input, size || 1, start === string.CHUNK_END);
		};

		/**
		 *  Prepare given input string for use in a regular expression
		 *  @name    escapeRegExp
		 *  @type    method
		 *  @access  public
		 *  @param   string input
		 *  @param   string delimiter [optional, default null - no delimeter to consider]
		 *  @return  string escaped
		 */
		string.escapeRegExp = function(input, delimeter) {
			var chars = '.\\+*?[^]$(){}=!<>|:-'.split(''),
				pattern = new RegExp('[' + chars.concat(delimeter ? [delimeter] : []).join('\\') + ']', 'g');

			return konflux.isType('string', input) ? input.replace(pattern, '\\$&') : '';
		};
	}

	konflux.register('string', new KonfluxString());

	//END INCLUDE: core/string [1.83ms, 9.17KB]
	//BEGIN INCLUDE: core/point
	/**
	 *  KonfluxPoint object, handling the (heavy) lifting of working with points
	 *  @module  point
	 *  @factory konflux.point
	 *  @param   number x position
	 *  @param   number y position
	 *  @note    available as konflux.point / kx.point
	 */
	function KonfluxPoint(x, y) {
		/*jshint validthis: true*/
		var point = this;

		point.x = x || 0;
		point.y = y || 0;

		/**
		 *  Move the point to a specific position
		 *  @name    to
		 *  @type    method
		 *  @access  public
		 *  @param   number x
		 *  @param   number y
		 *  @return  KonfluxPoint  point
		 */
		point.to = function(x, y) {
			point.x = x;
			point.y = y;

			return point;
		};

		/**
		 *  Snap the point to a grid
		 *  @name    snap
		 *  @type    method
		 *  @access  public
		 *  @param   number grid [optional, default 1 - round the position x and y]
		 *  @return  KonfluxPoint  point
		 */
		point.snap = function(grid) {
			point.x = grid ? Math.round(point.x / grid) * grid : Math.round(point.x);
			point.y = grid ? Math.round(point.y / grid) * grid : Math.round(point.y);

			return point;
		};

		/**
		 *  Create a new point based on the current
		 *  @name    clone
		 *  @type    method
		 *  @access  public
		 *  @return  KonfluxPoint  point
		 */
		point.clone = function() {
			return new KonfluxPoint(point.x, point.y);
		};

		/**
		 *  Move the point object by given x and y
		 *  @name    move
		 *  @type    method
		 *  @access  public
		 *  @param   number x
		 *  @param   number y
		 *  @return  KonfluxPoint  point
		 */
		point.move = function(x, y) {
			point.x += x;
			point.y += y;

			return point;
		};

		/**
		 *  Is given point on the exact same position
		 *  @name    equal
		 *  @type    method
		 *  @access  public
		 *  @param   KonfluxPoint point
		 *  @param   bool    round
		 *  @return  bool    equal
		 */
		point.equal = function(p, round) {
			return round ? Math.round(point.x) === Math.round(p.x) && Math.round(point.y) === Math.round(p.y) : point.x === p.x && point.y === p.y;
		};

		/**
		 *  Scale the points coordinates by given factor
		 *  @name    scale
		 *  @type    method
		 *  @access  public
		 *  @param   number factor
		 *  @return  void
		 */
		point.scale = function(factor) {
			point.x *= factor;
			point.y *= factor;

			return point;
		};

		/**
		 *  Subtract a point for the current point
		 *  @name    subtract
		 *  @type    method
		 *  @access  public
		 *  @param   object point
		 *  @return  KonfluxPoint
		 */
		point.subtract = function(p) {
			return new KonfluxPoint(point.x - p.x, point.y - p.y);
		};

		/**
		 *  Add a point to the current point
		 *  @name    add
		 *  @type    method
		 *  @access  public
		 *  @param   object point
		 *  @return  KonfluxPoint
		 */
		point.add = function(p) {
			return new KonfluxPoint(point.x + p.x, point.y + p.y);
		};

		/**
		 *  Get the distance between given and current point
		 *  @name    distance
		 *  @type    method
		 *  @access  public
		 *  @param   object point
		 *  @return  number distance
		 */
		point.distance = function(p) {
			return Math.sqrt(Math.pow(Math.abs(point.x - p.x), 2) + Math.pow(Math.abs(point.y - p.y), 2));
		};

		/**
		 *  Get the angle in radians between given and current point
		 *  @name    angle
		 *  @type    method
		 *  @access  public
		 *  @param   object point
		 *  @return  number angle
		 */
		point.angle = function(p) {
			return Math.atan2(p.x - point.x, p.y - point.y);
		};

		/**
		 *  Create a point with the maximum coordinates of both the current and given point
		 *  @name    max
		 *  @type    method
		 *  @access  public
		 *  @param   KonfluxPoint point1
		 *  @param   KonfluxPoint ...
		 *  @param   KonfluxPoint pointN
		 *  @return  KonfluxPoint
		 */
		point.max = function() {
			var x = point.x,
				y = point.y,
				i;

			for (i = 0; i < arguments.length; ++i) {
				x = Math.max(x, arguments[i].x);
				y = Math.max(y, arguments[i].y);
			}

			return new KonfluxPoint(x, y);
		};

		/**
		 *  Create a point with the minimum coordinates of both the current and given point
		 *  @name    min
		 *  @type    method
		 *  @access  public
		 *  @param   KonfluxPoint point1
		 *  @param   KonfluxPoint ...
		 *  @param   KonfluxPoint pointN
		 *  @return  KonfluxPoint
		 */
		point.min = function() {
			var x = point.x,
				y = point.y,
				i;

			for (i = 0; i < arguments.length; ++i) {
				x = Math.min(x, arguments[i].x);
				y = Math.min(y, arguments[i].y);
			}

			return new KonfluxPoint(x, y);
		};

		/**
		 *  Create a new point from the current mapped to isometric coordinates
		 *  @name    iso
		 *  @type    method
		 *  @access  public
		 *  @param   number angle [optional, default 30 degrees]
		 *  @return  KonfluxPoint
		 */
		point.iso = function(angle) {
			angle = (angle || 30) * Math.PI / 180;

			return new KonfluxPoint(
				point.x - point.y,
				(point.x + point.y) * angle
			);
		};

		/**
		 *  Create a new point between the current and given point
		 *  @name    mid
		 *  @type    method
		 *  @access  public
		 *  @param   KonfluxPoint p
		 *  @return  KonfluxPoint mid
		 */
		point.mid = function(p) {
			return new KonfluxPoint(
				(point.x + p.x) * 0.5,
				(point.y + p.y) * 0.5
			);
		};
	}

	/**
	 *  Create a KonfluxPoint instance
	 *  @name   point
	 *  @type   method
	 *  @access public
	 *  @param  number x position
	 *  @param  number y position
	 *  @return KonfluxPoint point
	 *  @note   As of konflux version > 0.3.1 the points are created without the new keyword
	 *          ('new konflux.point(X, Y)' can now be 'konflux.point(X, Y)')
	 */
	konflux.register('point', function(x, y) {
		return new KonfluxPoint(x, y);
	});

	//END INCLUDE: core/point [794.50µs, 5.34KB]
	//BEGIN INCLUDE: core/iterator
	/**
	 *  Iterator object, providing a uniform mechanism to traverse collections (Array, Object, DOMNodeList, etc)
	 *  @module  iterator
	 *  @factory konflux.iterator
	 *  @param   mixed collection
	 *  @note    available as konflux.iterator / kx.iterator
	 */
	function KonfluxIterator(collection) {
		/*jshint validthis: true*/
		var iterator = this,
			keys, current;

		/**
		 *  Initialize the iterator object
		 *  @name    init
		 *  @type    function
		 *  @access  internal
		 *  @return  void
		 */
		function init() {
			var p;

			collection = collection || [];

			if (typeof collection !== 'object') {
				collection = [collection];
			}

			//  create a magic property for the length
			if ('length' in collection) {
				property('length');
			}

			//  decorate the iterator with the various collection members
			for (p in collection) {
				if (!(p in iterator)) {
					iterator[p] = relay(p);
				}
			}

			keys = iterator.keys();
		}

		/**
		 *  Create relayed access to a collection member
		 *  @name    relay
		 *  @type    function
		 *  @access  internal
		 *  @param   string member name
		 *  @return  function relay
		 */
		function relay(member) {
			if (konflux.isType('function', collection[member])) {
				return function() {
					return collection[member].apply(collection, konflux.array.cast(arguments));
				};
			}

			return collection[member];
		}

		/**
		 *  Try to create a getter for the given property, copy the value if a getter is not possible
		 *  @name    property
		 *  @type    function
		 *  @access  internal
		 *  @param   string name
		 *  @return  mixed  result (the property value if it was copied, KonfluxIterator otherwise)
		 */
		function property(name) {
			//  Unfortunatly we have to fall back onto a try catch block, as the IE8 implementation does not
			//  accept defined properties on any object other than DOMElements
			try {
				return Object.defineProperty(iterator, name, {
					get: function() {
						return collection[name];
					}
				});
			}
			catch (e) {
				return (iterator[name] = collection[name]);
			}
		}

		/**
		 *  Expand the underlying collection with another
		 *  @name    add
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed  append
		 *  @return  void
		 */
		function add(append) {
			var length, i;

			//  for now we only support index based objects to handle expansion
			if (!('length' in collection)) {
				return false;
			}

			//  we enforce the underlying collection to become an array
			if (!(collection instanceof Array)) {
				collection = konflux.array.cast(collection);
			}

			//  if we are trying to append a KonfluxIterator instance, we want the underlying collection
			if (append instanceof KonfluxIterator) {
				append = append.collection();
			}

			//  and ensure it'll be an array
			if (!(append instanceof Array)) {
				append = konflux.isType('object', append) ? [append] : konflux.array.cast(append);
			}

			//  if the appending variable holds an array, we concatenate it into the collection
			if (append instanceof Array) {
				length     = collection.length;
				collection = collection.concat(append);
				keys       = iterator.keys();

				for (i = length; i < collection.length; ++i) {
					property(i);
				}

				return true;
			}

			return false;
		}

		/**
		 *  Create a function which implements a specific signature (which occurs repeatedly)
		 *  @name    implement
		 *  @type    function
		 *  @access  internal
		 *  @param   string   name
		 *  @param   function evaluation
		 *  @param   bool     one [optional, default undefined (false-ish) - return a KonfluxIterator]
		 *  @return  function implementation
		 */
		function implement(name, evaluate, one) {
			return function(callback, context) {
				var list, result, keys, i;

				//  always use the native implementation, if it exists
				if (name in collection && konflux.isType('function', collection[name])) {
					return new KonfluxIterator(collection[name].apply(collection, arguments));
				}

				list = collection instanceof Array ? [] : {};

				keys = iterator.keys();
				for (i = 0; i < keys.length; ++i) {
					result = evaluate(callback.apply(context || undefined, [collection[keys[i]], keys[i], collection]), collection[keys[i]]);

					if (result) {
						if (one) {
							return result;
						}

						list[keys[i]] = result;
					}
				}

				return konflux.iterator(list);
			};
		}

		/**
		 *  Obtain the raw underlying collection
		 *  @name    collection
		 *  @type    method
		 *  @access  public
		 *  @return  mixed collection
		 */
		iterator.collection = function() {
			return collection;
		};

		/**
		 *  Get or set the cursor position, if an non-existant position is given, the cursor does not budge
		 *  @name    cursor
		 *  @type    method
		 *  @access  public
		 *  @param   mixed index [optional, default null - don't update the cursor]
		 *  @return  mixed value
		 */
		iterator.cursor = function(index) {
			var result;

			if (index) {
				if (collection instanceof Array && index in keys) {
					current = index;
				}
				else if (!(collection instanceof Array)) {
					result = konflux.array.contains(keys, index);

					if (result) {
						current = result;
					}
				}
			}

			result = current || 0;

			return collection instanceof Array ? result : keys[result];
		};

		/**
		 *  Obtain a member from the underlying collection
		 *  @name    item
		 *  @type    method
		 *  @access  public
		 *  @param   mixed index
		 *  @return  mixed value
		 */
		iterator.item = function(index) {
			if ('item' in collection && konflux.isType('function', collection.item)) {
				return collection.item(index);
			}

			return ('length' in collection && (index >= 0 || index < collection.length)) || index in collection ? collection[index] : null;
		};

		/**
		 *  Obtain the current value, whithout shifting the cursor
		 *  @name    current
		 *  @type    method
		 *  @access  public
		 *  @return  mixed value
		 */
		iterator.current = function() {
			if (!current) {
				current = 0;
			}

			return typeof keys[current] !== 'undefined' ? iterator.item(keys[current]) : false;
		};

		/**
		 *  Obtain an array which contains all the keys for the underlying collection
		 *  @name    keys
		 *  @type    method
		 *  @access  public
		 *  @return  Array keys
		 */
		iterator.keys = function() {
			var result = [];

			iterator.each(function(value, key) {
				result.push(key);
			});

			return result;
		};

		/**
		 *  Create a new KonfluxIterator from the current containing only elements which received a true(-ish) result
		 *  from the provided filter method
		 *  @name    filter
		 *  @type    method
		 *  @access  public
		 *  @param   function evaluate
		 *  @param   object   thisArg 'this' [optional, default undefined]
		 *  @return  KonfluxIterator matches
		 */
		iterator.filter = implement('filter', function(result, item) {
			return !!result ? item : false;
		});

		/**
		 *  Return the first matching item (true-ish result from the evaluation function) from the iterator
		 *  @name    find
		 *  @type    method
		 *  @access  public
		 *  @param   function map
		 *  @param   object   thisArg 'this' [optional, default undefined]
		 *  @return  KonfluxIterator found
		 */
		iterator.find = implement('find', function(result, item) {
			return !!result ? item : false;
		}, true);

		/**
		 *  Create a new KonfluxIterator from the current containing items (possibly) modified by the map function
		 *  @name    map
		 *  @type    method
		 *  @access  public
		 *  @param   function map
		 *  @param   object   thisArg 'this' [optional, default undefined]
		 *  @return  KonfluxIterator mapped
		 */
		iterator.map = implement('map', function(result) {
			return result;
		});

		/**
		 *  Obtain the previous value, shifting the cursor to the previous position
		 *  @name    previous
		 *  @type    method
		 *  @access  public
		 *  @return  mixed value
		 */
		iterator.previous = function() {
			current = Math.max(typeof current !== 'undefined' ? current - 1 : 0, -1);

			return iterator.current();
		};

		/**
		 *  Obtain the previous value, shifting the cursor back
		 *  @name    prev
		 *  @type    method
		 *  @access  public
		 *  @return  mixed value
		 *  @alias   iterator.previous
		 */
		iterator.prev = iterator.previous;

		/**
		 *  Obtain the next value, shifting the cursor to the next position
		 *  @name    next
		 *  @type    method
		 *  @access  public
		 *  @return  mixed value
		 */
		iterator.next = function() {
			current = Math.min(typeof current !== 'undefined' ? current + 1 : 0, keys.length);

			return iterator.current();
		};

		/**
		 *  Traverse the underlying collection and call given handle on every item in the collection
		 *  @name    each
		 *  @type    method
		 *  @access  public
		 *  @param   function   callback
		 *  @param   object     thisArg (value to use as this when executing callback)
		 *  @return  KonfluxIterator instance
		 */
		iterator.each = function(callback, thisArg) {
			var p;

			if ('length' in collection) {
				for (p = 0; p < collection.length; ++p) {
					callback.apply(thisArg || undefined, [collection[p], p, iterator]);
				}
			}
			else {
				for (p in collection) {
					callback.apply(thisArg || undefined, [collection[p], p, iterator]);
				}
			}

			return iterator;
		};

		/**
		 *  Add items to the collection
		 *  @name    add
		 *  @type    method
		 *  @access  public
		 *  @param   mixed argument1
		 *  @param   mixed ...
		 *  @param   mixed argumentN
		 *  @return  KonfluxIterator instance
		 *  @note    Adding items to the collection will destroy the original collection and turn it into an array
		 *  @note    Any scalar variable type (String, Number, Boolean and NULL) will added as is, any
		 *           Array or Object will be disected and treated as array (if possible)
		 */
		iterator.add = function() {
			var i;

			for (i = 0; i < arguments.length; ++i) {
				add(arguments[i]);
			}

			return iterator;
		};

		init();
	}

	/**
	 *  Create a KonfluxIterator instance
	 *  @name   iterator
	 *  @type   method
	 *  @access public
	 *  @param  mixed collection
	 *  @return KonfluxIterator iterator
	 */
	konflux.register('iterator', function(collection) {
		return collection instanceof KonfluxIterator ? collection : new KonfluxIterator(collection);
	});

	//END INCLUDE: core/iterator [963.28µs, 9.80KB]
	//BEGIN INCLUDE: core/dom
	/**
	 *  DOM Structure helper
	 *  @module  dom
	 *  @note    available as konflux.dom / kx.dom
	 */
	function KonfluxDOM() {
		/*jshint validthis: true*/
		var dom = this;

		//  constants
		dom.STACK_NEGATIVE   = 1;
		dom.STACK_BLOCK      = dom.STACK_NEGATIVE << 1;
		dom.STACK_FLOAT      = dom.STACK_BLOCK << 1;
		dom.STACK_INLINE     = dom.STACK_FLOAT << 1;
		dom.STACK_POSITIONED = dom.STACK_INLINE << 1;
		dom.STACK_POSITIVE   = dom.STACK_POSITIONED << 1;
		dom.STACK_GLOBAL     = dom.STACK_POSITIVE << 1;

		/**
		 *  Append given source element or structure to the target element
		 *  @name   appendTo
		 *  @type   function
		 *  @access internal
		 *  @param  DOMElement target
		 *  @param  mixed source (one of: DOMElement, Object structure)
		 *  @return Array of added source elements
		 */
		function appendTo(target, source) {
			var result, i;

			if (konflux.isType('string', target)) {
				target = document.querySelector(target);
			}

			if (source instanceof Array) {
				result = [];
				for (i = 0; i < source.length; ++i) {
					result.push(appendTo(target, source[i]));
				}
			}
			else {
				result = target.appendChild(source);
			}

			return result;
		}

		/**
		 *  Determine whether element is in the ancestor element or the ancestor element itself
		 *  @name   contains
		 *  @type   function
		 *  @access internal
		 *  @param  DOMElement ancestor
		 *  @param  DOMElement element
		 *  @return bool element is (in) ancestor
		 */
		function contains(ancestor, element) {
			//  use the contains method if it exists
			if ('contains' in ancestor) {
				return ancestor.contains(element);
			}

			//  old school tree walker
			while (element !== ancestor && element) {
				element = element.parentNode;
			}

			return !!element;
		}

		/**
		 *  Create a dom structure from given variable
		 *  @name   createStructure
		 *  @type   function
		 *  @access internal
		 *  @param  mixed   source
		 *  @param  DOMNode scope
		 *  @return DOMElement structure
		 */
		function createStructure(struct, scope) {
			var nodeName, element, p, i;

			switch (konflux.type(struct)) {
				case 'array':
					element = [];
					for (i = 0; i < struct.length; ++i) {
						element.push(createStructure(struct[i]));
					}

					break;

				case 'object':
					nodeName = 'tag' in struct ? struct.tag : ('name' in struct ? struct.name : 'div');

					if (!/^[a-z]+[a-z0-9-]*$/i.test(nodeName)) {
						element = (scope ? scope.querySelector(nodeName) : null) || document.querySelector(nodeName);
					}
					else {
						element = document.createElement(nodeName);
					}

					for (p in struct) {
						switch (p)
						{
							case 'name':
								if ('tag' in struct) {
									element.setAttribute('name', struct[p]);
								}

								break;

							case 'child':
							case 'content':
								appendTo(element, createStructure(struct[p], element));
								break;

							case 'class':
							case 'className':
								element.setAttribute('class', struct[p]);
								break;

							default:
								element.setAttribute(p, struct[p]);
								break;
						}
					}

					break;

				case 'boolean':
					struct = struct ? 'true' : 'false';
					/* falls through */
				default:
					element = document.createTextNode(struct);
					break;
			}

			return element;
		}

		/**
		 *  Obtain the stacking order index
		 *  @name   stackOrderIndex
		 *  @type   function
		 *  @access internal
		 *  @param  DOMElement node
		 *  @return object stack order (format: {type:<int>, index:<int>})
		 *  @note   the dom constants: STACK_NEGATIVE, STACK_BLOCK, STACK_FLOAT
		 *          STACK_INLINE, STACK_POSITIONED, STACK_POSITIVE, STACK_GLOBAL
		 *          with the type number to determine the matching type.
		 *          e.g. type & konflux.dom.STACK_POSITIONED !== 0 is a positioned element
		 *  @see    spec:  http://www.w3.org/TR/CSS2/zindex.html#painting-order
		 *  @see    human: http://philipwalton.com/articles/what-no-one-told-you-about-z-index/
		 */
		function stackOrderIndex(node) {
			var zIndex = +konflux.style.get(node, 'z-index'),
				opacity = parseFloat(konflux.style.get(node, 'opacity')),
				position = konflux.style.get(node, 'position'),
				display = konflux.style.get(node, 'display'),
				floatValue = konflux.style.get(node, 'float'),
				context = (position !== 'static' && zIndex !== 'auto') || opacity < 1,

				//  https://developer.mozilla.org/en-US/docs/Web/CSS/display
				blockType = /^(?:(?:inline\-)?block|list\-item|table(?:\-(?:cell|caption|column|row))?|table\-(?:column|footer|header|row)\-group|flex|grid)$/.test(display),
				type = parseInt([

					//  fixed positioning, a world in its own
					position === 'fixed' ? 1 : 0,

					//  positive stacking context: 0/1
					context && (zIndex === 'auto' || zIndex >= 0) ? 1 : 0,

					//  positioned (and not stacking context)
					position !== 'static' && !context ? 1 : 0,

					//  inline level elements (natural position order)
					floatValue === 'none' && position === 'static' && !blockType ? 1 : 0,

					//  floating elements are between natural positioned inline and block level elements
					floatValue !== 'none' && !context && position === 'static' ? 1 : 0,

					//  block level element (natural position order)
					floatValue === 'none' && position === 'static' && blockType ? 1 : 0,

					//  negative stacking context
					context && zIndex < 0 ? 1 : 0
				].join(''), 2);

			return {
				type: type,
				index: position !== 'static' || !zIndex || zIndex === 'auto' ? 0 : zIndex,
				context: (dom.STACK_NEGATIVE & type || dom.STACK_POSITIONED & type || dom.STACK_POSITIVE & type || dom.STACK_GLOBAL & type) !== 0
			};
		}

		/**
		 *  Get the unique reference for given DOM element, adds it if it does not yet exist
		 *  @name    elementReference
		 *  @type    function
		 *  @access  internal
		 *  @param   DOMElement element
		 *  @param   bool       hidden [optional, default false]
		 *  @return  string unique reference
		 *  @note    this function adds an attribute 'data-kxref' to the element if the reference is not hidden
		 *           (the hidden option is not considered to be best practise)
		 */
		function elementReference(element, hidden) {
			var name = 'kxref',
				prepare = {
					window: window,
					document: document,
					root: document.documentElement,
					head: document.head,
					body: document.body
				},
				reference, p;

			//  we don't ever contaminate the window object, document, documentElement or body element
			for (p in prepare) {
				if (element === prepare[p]) {
					return p;
				}
			}

			if (!element || !('nodeType' in element) || element.nodeType !== 1) {
				return false;
			}
			else {
				reference = hidden ? (name in element ? element[name] : null) : element.getAttribute('data-' + name);
			}

			//  if no reference was set yet, do so now
			if (!reference) {
				reference = konflux.unique();

				if (hidden) {
					element[name] = reference;
				}
				else {
					element.setAttribute('data-' + name, reference);
				}
			}

			return reference;
		}

		/**
		 *  Create a dom structure from given variable
		 *  @name   create
		 *  @type   method
		 *  @access public
		 *  @param  mixed source
		 *  @return DOMElement structure
		 */
		dom.create = createStructure;

		/**
		 *  Append given source element or structure to the target element
		 *  @name   appendTo
		 *  @type   method
		 *  @access public
		 *  @param  DOMElement target
		 *  @param  mixed source (one of: DOMElement, Object structure)
		 *  @return Array of added source elements
		 */
		dom.appendTo = function(target, source) {
			return appendTo(target, konflux.isType('object', source) && !konflux.isType('undefined', source.nodeType) ? source : createStructure(source, target));
		};

		/**
		 *  Determine whether element is in the ancestor element or the ancestor element itself
		 *  @name   contains
		 *  @type   method
		 *  @access public
		 *  @param  DOMElement ancestor
		 *  @param  DOMElement element
		 *  @return bool is (in) ancestor
		 */
		dom.contains = contains;

		/**
		 *  Select elements matching given CSS selector
		 *  @name   select
		 *  @type   method
		 *  @access public
		 *  @param  string     selector
		 *  @param  DOMElement parent
		 *  @return KonfluxIterator nodeList
		 */
		dom.select = function(selector, parent) {
			return konflux.iterator((parent || document).querySelectorAll(selector));
		};

		/**
		 *  Get the unique reference for given DOM element, adds it if it does not yet exist
		 *  @name    reference
		 *  @type    method
		 *  @access  public
		 *  @param   DOMElement element
		 *  @return  string unique reference
		 *  @note    this function adds an attribute 'data-kxref' to the element
		 */
		dom.reference = function(element) {
			return elementReference(element);
		};

		/**
		 *  Obtain the stacking order level
		 *  @name   stackLevel
		 *  @type   method
		 *  @access public
		 *  @param  DOMElement node
		 *  @return object stack order (format: {type:<int>, index:<int>})
		 */
		dom.stackLevel = stackOrderIndex;
	}

	;(function(dom) {
		konflux.register('dom', dom);

		/**
		 *  Select elements matching given CSS selector
		 *  @name   select
		 *  @type   method
		 *  @access public
		 *  @param  string     selector
		 *  @param  DOMElement parent
		 *  @return DOMNodeList (empty Array if the dom module is not available)
		 */
		konflux.register('select', function(selector, parent) {
			return dom.select(selector, parent);
		});
	})(new KonfluxDOM());

	//END INCLUDE: core/dom [1.80ms, 9.03KB]
	//BEGIN INCLUDE: core/browser
	/**
	 *  Browser/feature detection
	 *  @module  browser
	 *  @note    available as konflux.browser / kx.browser
	 */
	function KonfluxBrowser() {
		/*jshint validthis: true*/
		var browser = this,
			support = {
				touch: 'ontouchstart' in window || 'msMaxTouchPoints' in navigator
			},
			prefix,
			ieVersion;

		/**
		 *  Determine whether or not the browser is Internet Explorer (4+)
		 *  @name    detectIE
		 *  @type    function
		 *  @access  internal
		 *  @return  mixed (boolean false if not IE, version number if IE)
		 */
		function detectIE() {
			//  https://gist.github.com/527683 (Conditional comments only work for IE 5 - 9)
			var node = document.createElement('div'),
				check = node.getElementsByTagName('i'),
				version = 4;

			//  Starting with IE 4 (as version is incremented before first use), an <i> element is added to
			//  the 'node' element surrounded by conditional comments. The 'check' variable is automatically updated
			//  to contain all <i> elements. These elements are not there if the browser does not support conditional
			//  comments or does not match the IE version
			//  Note that there are two conditions for the while loop; the innerHTML filling and the check, the while
			//  loop itself has no body (as it is closed off by a semi-colon right after declaration)
			while (node.innerHTML = '<!--[if gt IE ' + version + ']><i></i><![endif]-->', check.length && version < 10) {
				++version;
			}

			//  Added IE's @cc_on trickery for browser which do not support conditional comments (such as IE10)
			version = version > 4 ? version : /*jshint evil: true */Function('/*@cc_on return document.documentMode;@*/return false')()/*jshint evil: false */;

			//  IE11 removed the @cc_on syntax, so we need to go deeper
			return version ? version : ('-ms-ime-align' in document.documentElement.style ? 11 : false);
		}

		/**
		 *  Determine whether or not the browser has given feature in either the window or document scope
		 *  @name    hasFeature
		 *  @type    function
		 *  @access  internal
		 *  @param   string   feature
		 *  @return  boolean  has feature
		 */
		function hasFeature(feature) {
			return !konflux.isType('undefined', support[feature]) ? support[feature] : feature in window || feature in document;
		}

		/**
		 *  Obtain a specific feature from the browser, be it the native property or the vendor prefixed property
		 *  @name    getFeature
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed    feature [one of: string feature or array with string features]
		 *  @param   array    scope(s) [optional, default null - global scopes]
		 *  @return  mixed    feature (false if it doesn't exist)
		 */
		function getFeature(feature, scope) {
			var vendor = vendorPrefix(),

				//  the objects to search for the feature
				object = scope ? scope : [
					window,
					document,
					navigator
				],
				search = [],
				uc, i;

			if (!(feature instanceof Array)) {
				feature = [feature];
			}

			for (i = 0; i < feature.length; ++i) {
				uc = konflux.string.ucFirst(feature[i]);
				search = search.concat([
					feature[i],
					vendor + uc,
					vendor.toLowerCase() + uc
				]);
			}

			while (search.length) {
				feature = search.shift();

				for (i = 0; i < object.length; ++i) {
					if (feature in object[i]) {
						return object[i][feature];
					}
				}
			}

			return false;
		}

		/**
		 *  Obtain the vendor prefix for the current browser
		 *  @name   vendorPrefix
		 *  @type   function
		 *  @access internal
		 *  @return string prefix
		 */
		function vendorPrefix() {
			var vendor = ['Icab', 'Khtml', 'O', 'ms', 'Moz', 'webkit'],
				regex  = new RegExp('^(' + vendor.join('|') + ')(?=[A-Z])'),
				script = document.createElement('script'),
				p;

			//  try to find any vendor prefixed style property on our script node
			for (p in script.style) {
				if (regex.test(p)) {
					prefix = p.match(regex).shift();
					break;
				}
			}

			//  as a last resort, try to see if the <pre>Opacity property exists
			while (!prefix && vendor.length) {
				p = vendor.pop();
				if (p + 'Opacity' in script.style) {
					prefix = p;
				}
			}

			script = null;

			return prefix;
		}

		/**
		 *  Verify if the browser at hand is any version of Internet Explorer (4+)
		 *  @name    ie
		 *  @type    method
		 *  @access  public
		 *  @param   number min version [optional, default null - obtain the version number]
		 *  @return  mixed (boolean false if not IE (or not minimal version), version number if IE)
		 *  @see     detectIE
		 *  @note    this public implementation caches the result
		 */
		browser.ie = function(min) {
			if (konflux.isType('undefined', ieVersion)) {
				ieVersion = detectIE();
			}

			return min && ieVersion ? ieVersion < min : ieVersion;
		};

		/**
		 *  Obtain the vendor prefix for the current browser
		 *  @name    prefix
		 *  @type    method
		 *  @access  public
		 *  @return  string prefix
		 *  @note    this public implementation caches the result
		 */
		browser.prefix = function() {
			if (!prefix) {
				prefix = vendorPrefix();
			}

			return prefix;
		};

		/**
		 *  Obtain a specific feature from the browser
		 *  @name    feature
		 *  @type    method
		 *  @access  public
		 *  @param   mixed    feature [one of: string feature or array with string features]
		 *  @param   mixed    scope(s) [optional, default null - global scopes]
		 *  @return  mixed    feature (false if it doesn't exist)
		 *  @note    this method attempts to search for the native feature and falls back onto vendor prefixed features
		 */
		browser.feature = function(feature, scope) {
			if (scope && !(scope instanceof Array)) {
				scope = [scope];
			}

			return getFeature(feature, scope);
		};

		/**
		 *  Test whether or not the browser at hand is aware of given feature(s) exist in either the window or document scope
		 *  @name    supports
		 *  @type    method
		 *  @access  public
		 *  @param   string feature1
		 *  @param   string ...
		 *  @param   string featureN
		 *  @return  boolean support
		 *  @note    multiple features can be provided, in which case the return value indicates the support of all given features
		 */
		browser.supports = function() {
			var r = true,
				i = arguments.length;

			//  test all the features given
			while (r && --i >= 0) {
				r = r && hasFeature(arguments[i]);
			}

			return r;
		};

		/**
		 *  Enable the HTML5 fullscreen mode for given element
		 *  @name    fullscreen
		 *  @type    method
		 *  @access  public
		 *  @param   DOMNode target [optional, default document.documentElement]
		 *  @return  bool    success
		 *  @note    this method is highly experimental
		 */
		browser.fullscreen = function(target) {
			var check = ['fullScreen', 'isFullScreen'],
				vendor = browser.prefix().toLowerCase(),
				method, i;

			if (!target) {
				target = document.documentElement;
			}

			for (i = 0, method = null; i < check.length, method === null; ++i) {
				method = check[i] in document ? check[i] : vendor + konflux.string.ucFirst(check[i]);
				if (!(method in document)) {
					method = null;
				}
			}

			vendor = method.match(new RegExp('^' + vendor)) ? vendor : null;
			vendor = (vendor || (document[method] ? 'cancel' : 'request')) + konflux.string.ucFirst((vendor ? (document[method] ? 'cancel' : 'request') : '') + konflux.string.ucFirst(check[0]));

			(document[method] ? document : target)[vendor](target.ALLOW_KEYBOARD_INPUT || null);
		};
	}

	konflux.register('browser', new KonfluxBrowser());

	//END INCLUDE: core/browser [1.46ms, 7.17KB]
	//BEGIN INCLUDE: core/event
	/**
	 *  Event attachment handler
	 *  @module  event
	 *  @note    available as konflux.event / Konflux.event
	 */
	function KonfluxEvent() {
		/*jshint validthis: true*/
		var event = this,
			queue = {},
			delegate, touch;

		/*global KonfluxEventDelegate*/

		//BEGIN INCLUDE: event/delegate
		/**
		 *  Delegate manager object, keep track of all delegates created for DOMElement/Event combinations
		 *  @name    KonfluxEventDelegate
		 *  @type    module
		 *  @access  internal
		 */
		function KonfluxEventDelegate(unifier) {
			//
			'use strict';

			/*global konflux*/

			/*jshint validthis: true*/
			var delegation = this,
				separator = '!',
				store = {};

			/**
			 *  Unify the event type into an object alway containing the name and the namespace
			 *  @name    namespace
			 *  @type    function
			 *  @access  internal
			 *  @param   string event type
			 *  @return  object namespace ({name: * | type, namespace: * || namespace})
			 */
			function namespace(type) {
				var match = type ? type.match(/^([^\.]*)?(?:\.(.+))?$/) : ['', '*', '*'];

				return {
					name: match[1] || '*',
					namespace: match[2] || '*'
				};
			}

			/**
			 *  Obtain a proper key value for given target DOMElement
			 *  @name    targetKey
			 *  @type    function
			 *  @access  internal
			 *  @param   DOMElement target
			 *  @return  string     key
			 */
			function targetKey(target) {
				return konflux.dom.reference(target);
			}

			/**
			 *  Remove whitespace and comments from given input, making nearly every string usable as key
			 *  @name    strip
			 *  @type    function
			 *  @access  internal
			 *  @param   string input
			 *  @return  string stripped
			 */
			function strip(input) {
				return (input + '').replace(/\s+|\/\*.*?\*\//g, '');
			}

			/**
			 *  Create a delegate function for the given combination of arguments, or return the previously created one
			 *  @name    create
			 *  @type    function
			 *  @access  internal
			 *  @param   DOMElement target
			 *  @param   string event namespace
			 *  @param   string event name
			 *  @param   string filter
			 *  @param   function handler
			 *  @param   bool capture
			 *  @return  object delegate ({target, namespace, type, filter, capture, delegate})
			 */
			function create(target, ns, type, filter, handler, capture) {
				var key = [
						targetKey(target),
						ns,
						type,
						filter ? strip(filter) : false,
						capture || false,
						strip(handler)
					].join(separator);

				//  if the key does not yet exist in the store, we create it
				if (!(key in store)) {
					store[key] = {
						target: target,
						namespace: ns,
						type: type,
						filter: filter,
						capture: capture || false,
						delegate: function(e) {
							var evt = e || window.event,
								result;

							if (filter) {
								if (!('target' in evt) && 'srcElement' in evt) {
									evt.target = evt.srcElement;
								}

								konflux.select(filter, target).each(function(element) {
									if (evt.target === element || konflux.dom.contains(element, evt.target)) {
										evt.delegate = target;
										result = handler.apply(element, [unifier(evt)]);
									}
								});
							}
							else if (handler) {
								result = handler.apply(target, [unifier(evt)]);
							}

							if (result === false) {
								if (evt.stopPropagation) {
									evt.stopPropagation();
								}
								else if (evt.cancelBubble) {
									evt.cancelBubble = true;
								}
							}
						}
					};
				}

				return store[key];
			}

			/**
			 *  Remove given key from the store
			 *  @name    remove
			 *  @type    function
			 *  @access  internal
			 *  @param   string key
			 *  @return  void
			 */
			function remove(key) {
				if (key in store) {
					delete store[key];
				}
			}

			/**
			 *  Find all delegates that match given arguments
			 *  @name    find
			 *  @type    function
			 *  @access  internal
			 *  @param   DOMElement target
			 *  @param   string event namespace
			 *  @param   string event name
			 *  @param   string filter
			 *  @param   function handler
			 *  @return  Array matches
			 */
			function find(target, ns, type, filter, handler) {
				var wildcard = '.*?',
					pattern = new RegExp([
						'^' + (target ? konflux.string.escapeRegExp(targetKey(target)) : wildcard),
						ns && ns !== '*' ? konflux.string.escapeRegExp(ns) : wildcard,
						type && type !== '*' ? konflux.string.escapeRegExp(type) : wildcard,
						filter ? konflux.string.escapeRegExp(strip(filter)) : wildcard,
						wildcard,
						(handler ? konflux.string.escapeRegExp(strip(handler)) : wildcard) + '$'
					].join(separator)),
					result = {},
					p;

				for (p in store) {
					if (pattern.test(p)) {
						result[p] = store[p];
					}
				}

				return result;
			}

			/**
			 *  Find all delegates that match given arguments
			 *  @name    find
			 *  @type    method
			 *  @access  public
			 *  @param   DOMElement target
			 *  @param   string event namespace
			 *  @param   string event name
			 *  @param   string filter
			 *  @param   function handler
			 *  @return  Array matches
			 */
			delegation.find = function(target, name, filter, handler) {
				var type = namespace(name),
					finds = find(target, type.namespace, type.name, filter, handler),
					result = [],
					p;

				for (p in finds) {
					result.push(finds[p]);
				}

				return result;
			};

			/**
			 *  Remove all delegates that match given arguments, and return all of the removed delegates
			 *  @name    find
			 *  @type    method
			 *  @access  public
			 *  @param   DOMElement target
			 *  @param   string event namespace
			 *  @param   string event name
			 *  @param   string filter
			 *  @param   function handler
			 *  @return  Array matches
			 */
			delegation.remove = function(target, name, filter, handler) {
				var type = namespace(name),
					finds = find(target, type.namespace, type.name, filter, handler),
					result = [],
					p;

				for (p in finds) {
					result.push(finds[p]);
					remove(p);
				}

				return result;
			};

			/**
			 *  Create a delegate function for the given combination of arguments, or return the previously created one
			 *  @name    create
			 *  @type    method
			 *  @access  public
			 *  @param   DOMElement target
			 *  @param   string event
			 *  @param   string filter
			 *  @param   function handler
			 *  @param   bool capture
			 *  @return  object delegate ({target, namespace, type, filter, capture, delegate})
			 */
			delegation.create = function(target, name, filter, handler, capture) {
				var type = namespace(name);

				return create(target, type.namespace, type.name, filter, handler, capture || false);
			};
		}

		//END INCLUDE: event/delegate [1.10ms, 5.88KB]
		/**
		 *  Ready state handler, removes all relevant triggers and executes any handler that is set
		 *  @name    handleReadyState
		 *  @type    function
		 *  @access  internal
		 *  @return  void
		 */
		function handleReadyState(e) {
			var run = false,
				p;

			if (document.removeEventListener) {
				document.removeEventListener('DOMContentLoaded', handleReadyState, false);
				window.removeEventListener('load', handleReadyState, false);
				run = true;
			}
			else if (document.readyState === 'complete') {
				document.detachEvent('onreadystate', handleReadyState);
				window.detachEvent('onload', handleReadyState);
				run = true;
			}

			if (run && queue.ready) {
				for (p in queue.ready) {
					queue.ready[p].call(e);
				}
			}
		}

		/**
		 *  Get the event name for given event
		 *  @name    getEventName
		 *  @type    function
		 *  @access  internal
		 *  @param   string     name
		 *  @param   DOMElement target
		 *  @return  string     name
		 */
		function getEventName(name, target) {
			var match = name.match(/^(transition|animation)(end|iteration|start)$/i),
				property;

			if (match && (property = konflux.style.property(match[1], target)) !== match[1]) {
				property = property.substr(0, property.length - match[1].length);
				name = property['to' + (property.length <= 2 ? 'Upper' : 'Lower') + 'Case']() + konflux.string.ucFirst(match[1]) + konflux.string.ucFirst(match[2]);
			}

			return name;
		}

		/**
		 *  Get the proper event type for given event trigger
		 *  @name    getEventType
		 *  @type    function
		 *  @access  internal
		 *  @param   string name
		 *  @return  string type
		 */
		function getEventType(name) {
			var list = '!afterprint!beforeprint!canplay!canplaythrough!change!domcontentloaded!durationchange!emptied!ended!input!invalid!loadeddata!loadedmetadata!offline!online!pause!play!playing!ratechange!readystatechange!reset!seeked!seeking!stalled!submit!suspend!timeupdate!volumechange!waiting!abort!domactivate!error!load!resize!scroll!select!unload!animationend!animationiteration!animationstart!beforeunload!blur!domfocusin!domfocusout!focus!focusin!focusout!click!contextmenu!dblclick!mousedown!mouseenter!mouseleave!mousemove!mouseout!mouseover!mouseup!show!compositionend!compositionstart!compositionupdate!copy!cut!paste!drag!dragend!dragenter!dragleave!dragover!dragstart!drop!hashchange!keydown!keypress!keyup!pagehide!pageshow!popstate!touchcancel!touchend!touchmove!touchstart!transitionend!wheel!',
				position = list.indexOf('!' + name.toLowerCase() + '!'),
				result;

			if (position < 0) {
				//  Use a Custom event for anything we don't know
				result = 'Custom';
			}

			//  'afterprint'         (HTML5) The associated document has started printing or the print preview has been closed.
			//  'beforeprint'        (HTML5) The associated document is about to be printed or previewed for printing.
			//  'canplay'            (HTML5 media) The user agent can play the media, but estimates that not enough data has been
			//                                     loaded to play the media up to its end without having to stop for further
			//                                     buffering of content.
			//  'canplaythrough'     (HTML5 media) The user agent can play the media, and estimates that enough data has been
			//                                     loaded to play the media up to its end without having to stop for further
			//                                     buffering of content.
			//  'change'             (DOM L2, HTML5) An element loses focus and its value changed since gaining focus.
			//  'DOMContentLoaded'   (HTML5) The document has finished loading (but not its dependent resources).
			//  'durationchange'     (HTML5 media) The duration attribute has been updated.
			//  'emptied'            (HTML5 media) The media has become empty; for example, this event is sent if the media has
			//                                     already been loaded (or partially loaded), and the load() method is called
			//                                     to reload it.
			//  'ended'              (HTML5 media) Playback has stopped because the end of the media was reached.
			//  'input'              (HTML5) The value of an element changes or the content of an element with the attribute
			//                               contenteditable is modified.
			//  'invalid'            (HTML5) A submittable element has been checked and doesn't satisfy its constraints.
			//  'loadeddata'         (HTML5 media) The first frame of the media has finished loading.
			//  'loadedmetadata'     (HTML5 media) The metadata has been loaded.
			//  'offline'            (HTML5 offline) The browser has lost access to the network.
			//  'online'             (HTML5 offline) The browser has gained access to the network (but particular websites
			//                                       might be unreachable).
			//  'pause'              (HTML5 media) Playback has been paused.
			//  'play'               (HTML5 media) Playback has begun.
			//  'playing'            (HTML5 media) Playback is ready to start after having been paused or delayed due to
			//                                     lack of data.
			//  'ratechange'         (HTML5 media) The playback rate has changed.
			//  'readystatechange'   (HTML5 and XMLHttpRequest) The readyState attribute of a document has changed.
			//  'reset'              (DOM L2, HTML5) A form is reset.
			//  'seeked'             (HTML5 media) A seek operation completed.
			//  'seeking'            (HTML5 media) A seek operation began.
			//  'stalled'            (HTML5 media) The user agent is trying to fetch media data, but data is unexpectedly
			//                                     not forthcoming.
			//  'submit'             (DOM L2, HTML5) A form is submitted.
			//  'suspend'            (HTML5 media) Media data loading has been suspended.
			//  'timeupdate'         (HTML5 media) The time indicated by the currentTime attribute has been updated.
			//  'volumechange'       (HTML5 media) The volume has changed.
			//  'waiting'            (HTML5 media) Playback has stopped because of a temporary lack of data.
			else if (position < 277) {
				//  HTMLEvent
				result = 'HTML';
			}

			//  'abort'              (DOM L3) The loading of a resource has been aborted.
			//  'DOMActivate'        (DOM L3) A button, link or state changing element is activated (use click instead).
			//  'error'              (DOM L3) A resource failed to load.
			//  'load'               (DOM L3) A resource and its dependent resources have finished loading.
			//  'resize'             (DOM L3) The document view has been resized.
			//  'scroll'             (DOM L3) The document view or an element has been scrolled.
			//  'select'             (DOM L3) Some text is being selected.
			//  'unload'             (DOM L3) The document or a dependent resource is being unloaded.
			else if (position < 334) {
				//  UIEvent
				result = 'UI';
			}

			//  'animationend'       (CSS Animations) A CSS animation has completed.
			//  'animationiteration' (CSS Animations) A CSS animation is repeated.
			//  'animationstart'     (CSS Animations) A CSS animation has started.
			else if (position < 381) {
				//  AnimationEvent
				result = 'Animation';
			}

			//  'beforeunload'       (HTML5)
			else if (position < 394) {
				//  BeforeUnloadEvent
				result = 'BeforeUnload';
			}

			//  'blur'               (DOM L3) An element has lost focus (does not bubble).
			//  'DOMFocusIn'         (DOM L3) An element has received focus (use focus or focusin instead).
			//  'DOMFocusOut'        (DOM L3) An element has lost focus (use blur or focusout instead).
			//  'focus'              (DOM L3) An element has received focus (does not bubble).
			//  'focusin'            (DOM L3) An element is about to receive focus (bubbles).
			//  'focusout'           (DOM L3) An element is about to lose focus (bubbles).
			else if (position < 445) {
				//  FocusEvent
				result = 'Focus';
			}

			//  'click'              (DOM L3) A pointing device button has been pressed and released on an element.
			//  'contextmenu'        (HTML5) The right button of the mouse is clicked (before the context menu is displayed).
			//  'dblclick'           (DOM L3) A pointing device button is clicked twice on an element.
			//  'mousedown'          (DOM L3) A pointing device button (usually a mouse) is pressed on an element.
			//  'mouseenter'         (DOM L3) A pointing device is moved onto the element that has the listener attached.
			//  'mouseleave'         (DOM L3) A pointing device is moved off the element that has the listener attached.
			//  'mousemove'          (DOM L3) A pointing device is moved over an element.
			//  'mouseout'           (DOM L3) A pointing device is moved off the element that has the listener attached or
			//                                off one of its children.
			//  'mouseover'          (DOM L3) A pointing device is moved onto the element that has the listener attached or
			//                                onto one of its children.
			//  'mouseup'            (DOM L3) A pointing device button is released over an element.
			//  'show'               (HTML5) A contextmenu event was fired on/bubbled to an element that has a
			//                               contextmenu attribute
			else if (position < 546) {
				//  MouseEvent
				result = 'Mouse';
			}

			//  'compositionend'     (DOM L3) The composition of a passage of text has been completed or canceled.
			//  'compositionstart'   (DOM L3) The composition of a passage of text is prepared (similar to keydown for
			//                                a keyboard input, but works with other inputs such as speech recognition).
			//  'compositionupdate'  (DOM L3) A character is added to a passage of text being composed.
			else if (position < 596) {
				//  CompositionEvent
				result = 'Composition';
			}

			//  'copy'               (Clipboard) The text selection has been added to the clipboard.
			//  'cut'                (Clipboard) The text selection has been removed from the document and added to the clipboard.
			//  'paste'              (Clipboard) Data has been transfered from the system clipboard to the document.
			else if (position < 611) {
				//  ClipboardEvent
				result = 'Clipboard';
			}

			//  'drag'               (HTML5) An element or text selection is being dragged (every 350ms).
			//  'dragend'            (HTML5) A drag operation is being ended (by releasing a mouse button or hitting the
			//                               escape key).
			//  'dragenter'          (HTML5) A dragged element or text selection enters a valid drop target.
			//  'dragleave'          (HTML5) A dragged element or text selection enters a valid drop target.
			//  'dragover'           (HTML5) An element or text selection is being dragged over a valid drop target (every 350ms).
			//  'dragstart'          (HTML5) The user starts dragging an element or text selection.
			//  'drop'               (HTML5) An element is dropped on a valid drop target.
			else if (position < 668) {
				//  DragEvent
				result = 'Drag';
			}

			//  'hashchange'         (HTML5) The fragment identifier of the URL has changed (the part of the URL after the #).
			else if (position < 679) {
				//  HashChangeEvent
				result = 'HashChange';
			}

			//  'keydown'            (DOM L3) A key is pressed down.
			//  'keypress'           (DOM L3) A key is pressed down and that key normally produces a character value
			//                                (use input instead).
			//  'keyup'              (DOM L3) A key is released.
			else if (position < 702) {
				//  KeyboardEvent
				result = 'Keyboard';
			}

			//  'pagehide'           (HTML5) A session history entry is being traversed from.
			//  'pageshow'           (HTML5) A session history entry is being traversed to.
			else if (position < 720) {
				//  PageTransitionEvent
				result = 'PageTransition';
			}

			//  'popstate'           (HTML5) A session history entry is being navigated to (in certain cases).
			else if (position < 729) {
				//  PopStateEvent
				result = 'PopState';
			}

			//  'touchcancel'        (Touch Events) A touch point has been disrupted in an implementation-specific manners
			//                                      (too many touch points for example).
			//  'touchend'           (Touch Events) A touch point is removed from the touch surface.
			//  'touchmove'          (Touch Events) A touch point is moved along the touch surface.
			//  'touchstart'         (Touch Events) A touch point is placed on the touch surface.
			else if (position < 771) {
				//  TouchEvent
				result = 'Touch';
			}

			//  'transitionend'      (Transition Events) A CSS Transition has completed.
			else if (position < 777) {
				//  TransitionEvent
				result = 'Transition';
			}

			//  'wheel'              (DOM L3) A wheel button of a pointing device is rotated in any direction.
			else if (position < 786) {
				//  WheelEvent
				result = 'Wheel';
			}

			return result + 'Event';
		}

		/**
		 *  Get a property name unique per event type/dom element
		 *  @name    getEventProperty
		 *  @type    function
		 *  @access  internal
		 *  @param   DOMElement target
		 *  @param   string     type
		 *  @return  string name
		 */
		function getEventProperty(target, type) {
			return '__kxevt_' + type + '_' + konflux.dom.reference(target);
		}

		/**
		 *  Unify the event object, which makes event more consistent across browsers
		 *  @name    unifyEvent
		 *  @type    function
		 *  @access  internal
		 *  @return  Event object
		 */
		function unifyEvent(e) {
			var evt = e || window.event;

			if (konflux.isType('undefined', evt.target)) {
				evt.target = !konflux.isType('undefined', evt.srcElement) ? evt.srcElement : null;
			}

			if (konflux.isType('undefined', evt.type)) {
				evt.type = evt.eventType;
			}

			evt.family = getEventType(evt.type);

			if (/^(mouse[a-z]+|drag(?:[a-z]+)?|drop|(?:dbl)?click)$/i.test(evt.type)) {
				evt.mouse = konflux.point(
					evt.pageX ? evt.pageX : (evt.clientX ? evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft : 0),
					evt.pageY ? evt.pageY : (evt.clientY ? evt.clientY + document.body.scrollTop + document.documentElement.scrollTop : 0)
				);
			}

			return evt;
		}

		/**
		 *  Prepare an iterator containing all given targets as item
		 *  @name    prepareTargetIterator
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed target [one of: string CSSSelector, DOMElement, DOMNodeList, Array DOMElement, KonfluxIterator DOMElement, window]
		 *  @return  KonfluxIterator target
		 */
		function prepareTargetIterator(targets) {
			if (!targets) {
				targets = [];
			}

			if (targets === window) {
				targets = [targets];
			}

			if (konflux.isType('string', targets)) {
				targets = document.querySelectorAll(targets);
			}

			if (!konflux.isType('number', targets.length)) {
				targets = [targets];
			}

			return konflux.iterator(targets);
		}

		/**
		 *  Prepare an iterator containing all given events as item
		 *  @name    prepareEventIterator
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed event [one of: string events, Array events, KonfluxIterator events]
		 *  @return  KonfluxIterator events
		 */
		function prepareEventIterator(events) {
			if (konflux.isType('string', events)) {
				events = events.replace(/\*/g, '').split(/[\s*,]+/);
			}
			else if (!events) {
				events = [];
			}

			return konflux.iterator(events);
		}

		/**
		 *  Attach event handler(s) to elements
		 *  @name    listen
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed target [one of: string CSSSelector, DOMElement, DOMNodeList, Array DOMElement, KonfluxIterator DOMElement, window]
		 *  @param   mixed event [one of: string events, Array events, KonfluxIterator events]
		 *  @param   mixed [one of: function handler or string CSSSelector]
		 *  @param   mixed [one of: function handler or bool capture]
		 *  @param   mixed [one of: bool capture or null]
		 *  @return  void
		 */
		function listen(targets, events, filter, handler, capture) {
			if (!delegate) {
				delegate = new KonfluxEventDelegate(unifyEvent);
			}

			events = prepareEventIterator(events);
			prepareTargetIterator(targets).each(function(target) {
				events.each(function(event) {
					var setting = delegate.create(target, event, filter, handler, capture || filter ? true : false);

					attach(setting.target, setting.type, setting.delegate, setting.capture);
				});
			});
		}

		/**
		 *  Remove event handlers from elements
		 *  @name    remove
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed [one of: string CSSSelector, DOMElement, DOMNodeList, Array DOMElement, KonfluxIterator DOMElement, function handler, window]
		 *  @param   mixed [one of: string events, Array events, KonfluxIterator events, function handler, null]
		 *  @param   mixed [one of: string CSSSelector, function handler, null]
		 *  @param   mixed [one of: function handler, null]
		 *  @return  void
		 */
		function remove(targets, events, filter, handler) {
			var result = [],
				i;

			if (delegate) {
				if (!targets) {
					result = result.concat(delegate.find(null, null, null, handler));
				}
				else {
					prepareTargetIterator(targets).each(function(target) {
						if (!events) {
							result = result.concat(delegate.find(target, null, null, handler));
						}
						else {
							prepareEventIterator(events).each(function(event) {
								result = result.concat(delegate.find(target, event, filter, handler));
							});
						}
					});
				}

				if (result.length > 0) {
					for (i = 0; i < result.length; ++i) {
						detach(result[i].target, result[i].type, result[i].delegate, result[i].capture);
						delegate.remove(result[i].target, result[i].type, filter, handler);
					}

					return true;
				}
			}

			return false;
		}

		/**
		 *  Attach an event handler to the target element
		 *  @name    attach
		 *  @type    function
		 *  @access  internal
		 *  @param   DOMElement target
		 *  @param   string     event
		 *  @param   function   handler
		 *  @param   bool       capture
		 *  @return  void
		 */
		function attach(target, type, handler, capture) {
			var prop;

			if (target.addEventListener) {
				target.addEventListener(getEventName(type), handler, capture);
			}
			else if (target.attachEvent) {
				switch (getEventType(type)) {
					case 'CustomEvent':
						prop = getEventProperty(target, type);
						if (!(prop in target)) {
							Object.defineProperty(target, prop, {
								//  allow us to meddle with the defined property later on (e.g. remove it)
								configurable: true,

								//  prevent this property from showing up in a for .. in loop
								enumerable: false,
								get: function() {
									return type;
								},

								set: function(callback) {
									var name = 'on' + type,
										i;

									if (!(name in this)) {
										this[name] = [];
									}

									if (konflux.isType('function', callback)) {
										this[name].push(callback);
									}
									else {
										callback.returnValue = true;
										callback.srcElement  = this;

										for (i = 0; i < this[name].length; ++i) {
											this[name][i].apply(this, [callback]);
											if (!callback.returnValue) {
												break;
											}
										}
									}
								}
							});
						}

						//  assign the event handler
						target[prop] = handler;
						break;

					default:

						//  we deliberately ignore the 'capturing', as this will actually route any (such) event through
						//  the capture target in IE8 (which is the only browser using attachEvent
						target.attachEvent('on' + type, handler);
						break;
				}
			}

			return;
		}

		/**
		 *  Detach the event associated with the event type, handler and capturing from the target element
		 *  @name    detach
		 *  @type    function
		 *  @access  internal
		 *  @param   DOMElement target
		 *  @param   string     event
		 *  @param   function   handler
		 *  @param   bool       capture
		 *  @return  void
		 */
		function detach(target, type, handler, capture) {
			if (target.removeEventListener) {
				target.removeEventListener(getEventName(type), handler, capture);
			}
			else if (target.detachEvent) {
				switch (getEventType(type)) {
					case 'CustomEvent':
						delete target[getEventProperty(target, type)];
						break;

					default:
						target.detachEvent('on' + type, handler);
						break;
				}
			}
		}

		//  Custom events

		/**
		 *  Create an event object and fire it for any given target
		 *  @name    dispatch
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed  target [one of: string CSSSelector, DOMElement, DOMNodeList, Array DOMElement, KonfluxIterator DOMElement]
		 *  @param   string type
		 *  @param   object option
		 *  @return  void
		 */
		function dispatch(targets, name, option) {
			var type = getEventType(name) || 'CustomEvent',
				Support = konflux.browser.feature(type),
				detail  = option || {},
				trigger = false,
				p;

			//  IE11 actually has the CustomEvent (and the likes), but one cannot construct those directly as they are objects
			if (Support && konflux.isType('function', Support)) {
				trigger = new Support(name, {
					detail: detail,
					cancelable: true
				});
			}
			else if ('createEvent' in document) {
				trigger = document.createEvent(type);
				if (option || type === 'CustomEvent') {
					trigger.initCustomEvent(name, false, true, detail);
				}
				else {
					trigger.initEvent(name, false, true);
				}
			}
			else if ('createEventObject' in document) {
				trigger = document.createEventObject();
				trigger.eventType = name;
				trigger.detail    = detail;
			}

			if (trigger) {
				prepareTargetIterator(targets).each(function(target) {
					if ('dispatchEvent' in target) {
						target.dispatchEvent(trigger);
					}
					else if ('fireEvent' in target) {
						if (type === 'CustomEvent') {
							p = getEventProperty(target, name);

							//  simply set the event property as we've already set up an setter function on it
							if (!konflux.isType('undefined', target[p])) {
								target[p] = trigger;
							}
						}
						else {
							target.fireEvent('on' + name, trigger);
						}
					}

				});

				return true;
			}

			return false;
		}

		//  expose public API

		/**
		 *  Attach event handler(s) to elements
		 *  @name    add
		 *  @type    method
		 *  @access  public
		 *  @param   mixed target [one of: string CSSSelector, DOMElement, DOMNodeList, Array DOMElement, KonfluxIterator DOMElement]
		 *  @param   mixed event [one of: string events, Array events, KonfluxIterator events]
		 *  @param   mixed [one of: function handler or string CSSSelector]
		 *  @param   mixed [one of: function handler or bool capture]
		 *  @param   mixed [one of: bool capture or null]
		 *  @return  KonfluxEvent reference
		 *
		 *  @note    event.add(target, event, handler [,capture]) - add event handler(s) to target(s)
		 *  @note    event.add(target, event, filter, handler [,capture]) - add event handler(s) to a selection of elements in target(s) matching given filter
		 */
		event.add = function(targets, events, filter, handler, capture) {
			setTimeout(function() {
				listen.apply(event, [targets, events].concat(
					konflux.isType('function', filter) ? [null, filter, handler] : [filter, handler, capture]
				));
			}, 1);

			return event;
		};

		/**
		 *  Remove event handlers from elements
		 *  @name    remove
		 *  @type    method
		 *  @access  public
		 *  @param   mixed [one of: string CSSSelector, DOMElement, DOMNodeList, Array DOMElement, KonfluxIterator DOMElement, function handler]
		 *  @param   mixed [one of: string events, Array events, KonfluxIterator events, function handler, null]
		 *  @param   mixed [one of: string CSSSelector, function handler, null]
		 *  @param   mixed [one of: function handler, null]
		 *  @return  KonfluxEvent reference
		 *
		 *  @note    event.remove(target)  - remove all event handling from given target(s)
		 *  @note    event.remove(handler) - remove any event handling using given handler from any target
		 *  @note    event.remove(target, event)   - remove given event(s) from given target(s)
		 *  @note    event.remove(target, handler) - remove any event handling using given handler from given target(s)
		 *  @note    event.remove(target, event, filter)  - remove given event(s) using given selector from given target(s)
		 *  @note    event.remove(target, event, handler) - remove given event(s) using given handler from given target(s)
		 *  @note    event.remove(target, event, filter, handler) - remove given event(s) matching given filter using given handler from given target(s)
		 */
		event.remove = function(targets, events, filter, handler) {
			var arg = [targets, events, filter, handler];

			//  if the first argument is a function, we assume it is a handler
			//  and remove the events using it from all elements
			if (konflux.isType('function', targets)) {
				arg = [null, null, null, targets];
			}

			//  if the second argument is a function, we assume the first argument
			//  to be the target(s) and remove all events using this handler from
			//  given target(s)
			else if (konflux.isType('function', events)) {
				arg = [targets, null, null, events];
			}

			//  if the third argument is a function, we know it is not a filter
			else if (konflux.isType('function', filter)) {
				arg = [targets, events, null, filter];
			}

			remove.apply(event, arg);
			return event;
		};

		/**
		 *  Trigger a custom event
		 *  @name    trigger
		 *  @type    method
		 *  @access  public
		 *  @param   DOMElement target
		 *  @param   string     name
		 *  @return  void
		 */
		event.trigger = function(target, name, option) {
			return dispatch(target, name, option);
		};

		/**
		 *  Is the browser capable of touch events
		 *  @name    hasTouch
		 *  @type    method
		 *  @access  public
		 *  @return  bool is touch device
		 */
		event.hasTouch = function() {
			if (!konflux.isType('boolean', touch)) {
				touch = konflux.browser.supports('touch');
			}

			return touch;
		};

		/**
		 *  Register handlers which get triggered when the DOM is ready for interactions
		 *  @name    ready
		 *  @type    method
		 *  @access  public
		 *  @param   function handler
		 *  @return  bool     isReady
		 */
		event.ready = function(handler) {
			//  the document is ready already
			if (/^interactive|complete$/.test(document.readyState)) {
				// make sure we run the 'event' asynchronously
				setTimeout(handler, 1);

				return true;
			}

			//  we cannot use the event.listen method, as we need very different event listeners
			if (typeof queue.ready === 'undefined') {
				queue.ready = [];

				if (document.addEventListener) {
					//  prefer the 'DOM ready' event
					document.addEventListener('DOMContentLoaded', handleReadyState, false);

					//  failsafe to window.onload
					window.addEventListener('load', handleReadyState, false);
				}
				else {
					//  the closest we can get to 'DOMContentLoaded' in IE, this is still prior to onload
					document.attachEvent('onreadystatechange', handleReadyState);

					//  again the failsafe, now IE style
					window.attachEvent('onload', handleReadyState);
				}
			}

			queue.ready.push(handler);
			return false;
		};

		//  Announce deprecation
		event.listen = konflux.deprecate(
			'konflux.event.listen is deprecated, use konflux.event.add instead (a drop-in replacement)',
			event.add
		);
		event.live = konflux.deprecate(
			'konflux.event.live is deprecated, use konflux.event.add instead (a drop-in replacement)',
			event.add
		);
	}

	konflux.register('event', new KonfluxEvent());

	/**
	 *  Convenience function bridging the event.ready method
	 *  @name    ready
	 *  @type    method
	 *  @access  public
	 *  @param   function handler
	 *  @return  bool     is ready
	 */
	konflux.register('ready', function(handler) {
		return 'event' in konflux ? konflux.event.ready(handler) : false;
	});

	//END INCLUDE: core/event [4.15ms, 33.40KB]
	//BEGIN INCLUDE: core/style
	/**
	 *  Style(sheet) manipulation
	 *  @module  style
	 *  @note    available as konflux.style / kx.style
	 */
	function KonfluxStyle() {
		/*jshint validthis: true*/
		var style = this;

		/**
		 *  Obtain the script property notation for given property
		 *  @name    scriptProperty
		 *  @type    function
		 *  @access  internal
		 *  @param   string property
		 *  @return  string script property
		 *  @note    'background-color' => 'backgroundColor'
		 */
		function scriptProperty(property) {
			var n = 0;

			if (property === 'float') {
				return 'cssFloat';
			}

			while ((n = property.indexOf('-', n)) >= 0) {
				property = property.substr(0, n) + property.charAt(++n).toUpperCase() + property.substring(n + 1);
			}

			return property;
		}

		/**
		 *  Obtain the CSS property notation for given property
		 *  @name    cssProperty
		 *  @type    function
		 *  @access  internal
		 *  @param   string property
		 *  @return  string CSS property
		 *  @note    'backgroundColor' => 'background-color'
		 */
		function cssProperty(property) {
			if (property === 'cssFloat') {
				property = 'float';
			}

			return property.replace(/([A-Z])/g, '-$1').toLowerCase();
		}

		/**
		 *  Determine whether or not the property is supported and try a vendor prefix, otherwise return false
		 *  @name    hasProperty
		 *  @type    function
		 *  @access  internal
		 *  @param   string  property
		 *  @param   DOMNode target [optional, default undefined - document.body]
		 *  @return  mixed  (one of: string (script)property, or false)
		 */
		function hasProperty(property, target) {
			property = scriptProperty(property);
			target   = target || document.body;

			if (property in target.style) {
				return property;
			}

			property = konflux.browser.prefix() + konflux.string.ucFirst(property);
			if (property in target.style) {
				return property;
			}

			return false;
		}

		/**
		 *  Obtain all local stylesheets, where local is determined on a match of the domain
		 *  @name    getLocalStylesheets
		 *  @type    function
		 *  @access  internal
		 *  @return  array stylesheets
		 */
		function getLocalStylesheets() {
			var all = document.styleSheets,
				list = [],
				i;

			for (i = 0; i < all.length; ++i) {
				if (konflux.url.isLocal(all[i].href)) {
					list.push(all[i]);
				}
			}

			return list;
		}

		/**
		 *  Obtain specific stylesheets
		 *  @name    getStylesheet
		 *  @type    function
		 *  @access  internal
		 *  @param   string name [optional, default 'all' - all stylesheets. Possible values 'first', 'last', 'all' or string filename]
		 *  @param   bool   includeOffset [optional, default false - local stylesheets only]
		 *  @return  array stylesheets
		 */
		function getStylesheet(name, includeOffsite) {
			var list = includeOffsite ? document.styleSheets : getLocalStylesheets(),
				match = [],
				i;

			switch (name) {
				//  get the first stylesheet from the list of selected stylesheets
				case 'first':
					if (list.length > 0) {
						match = [list[0]];
					}

					break;

				//  get the last stylesheet from the list of selected stylesheets
				case 'last':
					if (list.length > 0) {
						match = [list[list.length - 1]];
					}

					break;

				default:

					//  if no name was provided, return the entire list of (editable) stylesheets
					if (name === 'all') {
						match = list;
					}
					else if (!name) {
						match = false;
					}

					//  search for the stylesheet(s) whose href matches the given name
					else if (list.length > 0) {
						for (i = 0; i < list.length; ++i) {
							if (list[i].href && list[i].href.substr(-name.length) === name) {
								match.push(list[i]);
							}
							else if (list[i].title && list[i].title === name) {
								match.push(list[i]);
							}
						}
					}

					break;
			}

			return match;
		}

		/**
		 *  Obtain a stylesheet by its url or title
		 *  @name    findStylesheet
		 *  @type    function
		 *  @access  internal
		 *  @param   string url
		 *  @param   string name
		 *  @return  StyleSheet (bool false if not found)
		 */
		function findStylesheet(url, name) {
			var match = getStylesheet(url, true);
			if (name && match.length === 0) {
				match = getStylesheet(name, true);
			}

			return match.length > 0 ? match[0] : false;
		}

		/**
		 *  Create a new stylesheet
		 *  @name    createStylesheet
		 *  @type    function
		 *  @access  internal
		 *  @param   string url
		 *  @param   bool   before (effectively true for being the first stylesheet, anything else for last)
		 *  @param   string name
		 *  @return  style node
		 */
		function createStylesheet(url, before, name) {
			var element = findStylesheet(url, name),
				head = document.head || document.getElementsByTagName('head')[0];

			if (!element) {
				element = document.createElement(url ? 'link' : 'style');
				element.setAttribute('type', 'text/css');
				element.setAttribute('title', name || 'konflux.style.' + konflux.unique());

				if (/link/i.test(element.nodeName)) {
					element.setAttribute('rel', 'stylesheet');
					element.setAttribute('href', url);
				}

				if (before && document.head.firstChild) {
					head.insertBefore(element, head.firstChild);
				}
				else {
					head.appendChild(element);
				}
			}

			return element;
		}

		/**
		 *  Parse the style declarations' cssText into key/value pairs
		 *  @name    getStyleProperties
		 *  @type    function
		 *  @access  internal
		 *  @param   CSS Rule
		 *  @return  Object key value pairs
		 */
		function getStyleProperties(declaration) {
			var list = declaration.split(/\s*;\s*/),
				rules = {},
				i, part;

			for (i = 0; i < list.length; ++i) {
				part = list[i].split(/\s*:\s*/);

				if (part[0] !== '') {
					rules[scriptProperty(part.shift())] = normalizeValue(part.join(':'));
				}
			}

			return rules;
		}

		/**
		 *  Normalize given selector string
		 *  @name    normalizeSelector
		 *  @type    function
		 *  @access  internal
		 *  @param   string selector
		 *  @return  string normalized selector
		 */
		function normalizeSelector(selector) {
			return selector.split(/\s+/).join(' ').toLowerCase();
		}

		/**
		 *  Normalize given CSS value
		 *  @name    normalizeValue
		 *  @type    function
		 *  @access  internal
		 *  @param   string value
		 *  @return  string normalized value
		 */
		function normalizeValue(value) {
			var pattern = {
					//  minimize whitespace
					' ': /\s+/g,

					//  unify quotes
					'"': /["']/g,

					//  unify whitespace around separators
					',': /\s*,\s*/g,

					//  remove leading 0 from decimals
					'.': /\b0+\./g,

					//  remove units from 0 value
					0: /0(?:px|em|%|pt)\b/g
				},
				p;

			for (p in pattern) {
				value = value.replace(pattern[p], p);
			}

			//  most browsers will recalculate hex color notation to rgb, so we do the same
			pattern = value.match(/#([0-9a-f]+)/);
			if (pattern && pattern.length > 0) {
				pattern = pattern[1];
				if (pattern.length % 3 !== 0) {
					pattern = konflux.string.pad(pattern, 6, '0');
				}
				else if (pattern.length === 3) {
					pattern = pattern[0] + pattern[0] + pattern[1] + pattern[1] + pattern[2] + pattern[2];
				}

				value = 'rgb(' + [
					parseInt(pattern[0] + pattern[1], 16),
					parseInt(pattern[2] + pattern[3], 16),
					parseInt(pattern[4] + pattern[5], 16)
				].join(',') + ')';
			}

			return value;
		}

		/**
		 *  Add one or more css classes to given element
		 *  @name    addClass
		 *  @type    method
		 *  @access  public
		 *  @param   DOMelement element
		 *  @param   string classes (separated by any combination of whitespace and/or comma
		 *  @return  string classes
		 */
		style.addClass = function(element, classes) {
			var current = konflux.string.trim(element.className).split(/\s+/);

			element.className = current.concat(konflux.array.diff(classes.split(/[,\s]+/), current)).join(' ');

			return element.className;
		};

		/**
		 *  Remove one or more css classes from given element
		 *  @name    removeClass
		 *  @type    method
		 *  @access  public
		 *  @param   DOMElement element
		 *  @param   string classes (separated by any combination of whitespace and/or comma
		 *  @return  string classes
		 */
		style.removeClass = function(element, classes) {
			var delta = konflux.string.trim(element.className).split(/\s+/),
				classList = konflux.string.trim(classes).split(/[,\s]+/),
				i, p;

			for (i = 0; i < classList.length; ++i) {
				p = konflux.array.contains(delta, classList[i]);

				if (p !== false) {
					delta.splice(p, 1);
				}
			}

			element.className = delta.join(' ');

			return element.className;
		};

		/**
		 *  Toggle one or more css classes on given element
		 *  @name    toggleClass
		 *  @type    method
		 *  @access  public
		 *  @param   DOMElement element
		 *  @param   string classes (separated by any combination of whitespace and/or comma
		 *  @return  string classes
		 */
		style.toggleClass = function(element, classes) {
			var current = konflux.string.trim(element.className).split(/\s+/),
				classList = konflux.string.trim(classes).split(/[,\s]+/),
				i, p;

			for (i = 0; i < classList.length; ++i) {
				p = konflux.array.contains(current, classList[i]);
				if (p !== false) {
					current.splice(p, 1);
				}
				else {
					current.push(classList[i]);
				}
			}

			element.className = current.join(' ');

			return element.className;
		};

		/**
		 *  Apply style rules to target DOMElement
		 *  @name    inline
		 *  @type    method
		 *  @access  public
		 *  @param   DOMElement target
		 *  @param   object style rules
		 *  @return  KonfluxStyle reference
		 */
		style.inline = function(target, rules) {
			var p, q;

			for (p in rules) {
				q = hasProperty(p);

				if (q) {
					target.style[q] = rules[p];
				}
			}

			return style;
		};

		/**
		 *  Obtain a CSS selector for given element
		 *  @name    selector
		 *  @type    method
		 *  @access  public
		 *  @param   DOMElement target
		 *  @param   bool       skipNode [optional, default false - include node name]
		 *  @return  string selector
		 */
		style.selector = function(target, skipNode) {
			var node = target.nodeName.toLowerCase(),
				id = target.hasAttribute('id') ? '#' + target.getAttribute('id') : null,
				classes = target.hasAttribute('class') ? '.' + konflux.string.trim(target.getAttribute('class')).split(/\s+/).join('.') : null,
				select = '';

			if (arguments.length === 1 || id || classes) {
				select = (skipNode ? '' : node) + (id || classes || '');
			}

			return konflux.string.trim((!id && target.parentNode && target !== document.body ? style.selector(target.parentNode, true) + ' ' : '') + select);
		};

		/**
		 *  Obtain a stylesheet by its name or by a mnemonic (first, last, all)
		 *  @name    sheet
		 *  @type    method
		 *  @access  public
		 *  @param   string target [optional, default 'all' - all stylesheets. Possible values 'first', 'last', 'all' or string filename]
		 *  @param   bool   editable [optional, default true - only editable stylesheets]
		 *  @return  array  stylesheets
		 */
		style.sheet = function(target, editable) {
			var list = getStylesheet(konflux.isType('string', target) ? target : null, editable === false ? true : false),
				i;

			if (konflux.isType('undefined', target.nodeName)) {
				for (i = 0; i < list.length; ++i) {
					if (list[i].ownerNode === target) {
						return [list[i]];
					}
				}
			}

			return list;
		};

		/**
		 *  Create a new stylesheet, either as first or last
		 *  @name    create
		 *  @type    method
		 *  @access  public
		 *  @param   bool  before all other stylesheets
		 *  @return  styleSheet
		 */
		style.create = function(name, before) {
			var element = createStylesheet(false, before, name);

			return element.sheet || false;
		};

		/**
		 *  Load an external stylesheet, either as first or last
		 *  @name    load
		 *  @type    method
		 *  @access  public
		 *  @param   string   url the url of the stylesheet to load
		 *  @param   function callback
		 *  @param   bool     before all other style sheets
		 *  @return  style node (<link...> element)
		 */
		style.load = function(url, callback, before) {
			var style = createStylesheet(url, before);

			//  if style is a StyleSheet object, it has the ownerNode property containing the actual DOMElement in which it resides
			if (konflux.isType('undefined', style.ownerNode)) {
				style = style.ownerNode;

				//  it is safe to assume here that the stylesheet was loaded, hence we need to apply the callback (with a slight delay, so the order of returning and execution of the callback is the same for both load scenario's)
				if (callback) {
					setTimeout(function() {
						callback.apply(style, [style]);
					}, 1);
				}
			}
			else if (callback) {
				konflux.event.add(style, 'load', function(e) {
					callback.apply(style, [e]);
				});
			}

			return style;
		};

		/**
		 *  Determine whether or not the given style (node) is editable
		 *  @name    isEditable
		 *  @type    method
		 *  @access  public
		 *  @param   Stylesheet object or DOMelement style/link
		 *  @return  bool  editable
		 */
		style.isEditable = function(stylesheet) {
			var list = getLocalStylesheets(),
				node = konflux.isType('undefined', stylesheet.ownerNode) ? stylesheet.ownerNode : stylesheet,
				i;

			for (i = 0; i < list.length; ++i) {
				if (list[i].ownerNode === node) {
					return true;
				}
			}

			return false;
		};

		/**
		 *  Create and add a new style rule
		 *  @name    add
		 *  @type    method
		 *  @access  public
		 *  @param   string selector
		 *  @param   mixed  rules (one of; object {property: value} or string 'property: value')
		 *  @param   mixed  sheet (either a sheet object or named reference, like 'first', 'last' or file name)
		 *  @param   bool   skipNode [optional, default false - include node name]
		 *  @return  int    index at which the rule was added
		 */
		style.add = function(selector, rules, sheet, skipNode) {
			var rule = '',
				find, p, pr;

			//  in case the selector is not a string but a DOMElement, we go out and create a selector from it
			if (konflux.isType('object', selector) && 'nodeType' in selector) {
				selector = style.selector(selector, skipNode) || style.selector(selector);
			}

			//  make the rules into an object
			if (konflux.isType('string', rules)) {
				rules = getStyleProperties(rules);
			}

			//  if rules isn't an object, we exit right here
			if (!konflux.isType('object', rules)) {
				return false;
			}

			//  if no sheet was provided, or a string reference to a sheet was provided, resolve it
			if (!sheet || konflux.isType('string', sheet)) {
				sheet = getStylesheet(sheet || 'last');
			}

			//  in case we now have a list of stylesheets, we either want one (if there's just one) or we add the style to all
			if (sheet instanceof Array) {
				if (sheet.length === 1) {
					sheet = sheet[0];
				}
				else if (sheet.length <= 0) {
					sheet = createStylesheet().sheet;
				}
				else {
					rule = true;
					for (p = 0; p < sheet.length; ++p) {
						rule = rule && style.add(selector, rules, sheet[p]);
					}

					return rule;
				}
			}

			//  populate the find buffer, so we can determine which style rules we actually need
			find = style.find(selector, sheet);
			for (p in rules) {
				if (!(p in find) || normalizeValue(find[p]) !== normalizeValue(rules[p])) {
					pr = hasProperty(p);
					if (pr) {
						rule += (rule !== '' ? ';' : '') + cssProperty(pr) + ':' + rules[p];
					}
				}
			}

			//  finally, add the rules to the stylesheet
			if (sheet.addRule) {
				return sheet.addRule(selector, rule);
			}
			else if (sheet.insertRule) {
				return sheet.insertRule(selector + '{' + rule + '}', sheet.cssRules.length);
			}

			return false;
		};

		/**
		 *  Find all style rules for given selector (in optionally given sheet)
		 *  @name    find
		 *  @type    method
		 *  @access  public
		 *  @param   string selector
		 *  @param   mixed  sheet [optional, either a sheet object or named reference, like 'first', 'last' or file name]
		 *  @return  object style rules
		 */
		style.find = function(selector, sheet) {
			var match = {},
				rules, i, j;

			if (selector) {
				selector = normalizeSelector(selector);
			}

			if (!sheet) {
				sheet = getStylesheet();
			}
			else if (!(sheet instanceof Array)) {
				sheet = [sheet];
			}

			for (i = 0; i < sheet.length; ++i) {
				rules = konflux.type(sheet[i].cssRules) ? sheet[i].cssRules : sheet[i].rules;
				if (rules && rules.length) {
					for (j = 0; j < rules.length; ++j) {
						if ('selectorText' in rules[j] && (!selector || normalizeSelector(rules[j].selectorText) === selector)) {
							match = konflux.combine(match, getStyleProperties(rules[j].style.cssText));
						}
					}
				}
			}

			return match;
		};

		/**
		 *  Get the given style property from element
		 *  @name    get
		 *  @type    method
		 *  @access  public
		 *  @param   DOMElement element
		 *  @param   string     property
		 *  @param   string     pseudo tag [optional, default undefined - no pseudo tag]
		 *  @return  string     value
		 */
		style.get = function(element, property, pseudo) {
			var value;

			property = hasProperty(property);
			if (property) {
				if (window.getComputedStyle) {
					value = document.defaultView.getComputedStyle(element, pseudo || null).getPropertyValue(cssProperty(property));
				}
				else if (element.currentStyle) {
					value = element.currentStyle(scriptProperty(property));
				}
			}

			return value;
		};

		/**
		 *  Determine whether or not the property is supported and try a vendor prefix, otherwise return false
		 *  @name    property
		 *  @type    method
		 *  @access  public
		 *  @param   string  property
		 *  @param   DOMNode target [optional, default undefined - document.body]
		 *  @return  mixed  (one of: string (script)property, or false)
		 */
		style.property = hasProperty;

		/**
		 *  Calculate the specificity of a selector
		 *  @name    specificity
		 *  @type    method
		 *  @access  public
		 *  @param   string selector
		 *  @return  string specificity ('0.0.0.0')
		 */
		style.specificity = function(selector) {
			var result = [0, 0, 0, 0],
				match = konflux.string.trim(selector.replace(/([#\.\:\[]+)/g, ' $1')).split(/[^a-z0-9\.\[\]'":\*\.#=_-]+/),
				i;

			for (i = 0; i < match.length; ++i) {
				++result[/^#/.test(match[i]) ? 1 : (/^(?:\.|\[|:[^:])/.test(match[i]) ? 2 : 3)];
			}

			return result.join('.');
		};
	}

	konflux.register('style', new KonfluxStyle());

	//END INCLUDE: core/style [2.16ms, 17.58KB]
	//BEGIN INCLUDE: core/storage
	/**
	 *  Storage object, a simple wrapper for localStorage
	 *  @module  storage
	 *  @note    available as konflux.storage / kx.storage
	 */
	function KonfluxStorage() {
		/*jshint validthis: true*/
		var ls = this,
			maxSize = 2048,
			storage = konflux.isType('undefined', window.localStorage) ? window.localStorage : false,
			fragmentPattern = /^\[fragment:([0-9]+),([0-9]+),([a-z0-9_]+)\]$/;

		/**
		 *  Combine stored fragments together into the original data string
		 *  @name    combineFragments
		 *  @type    function
		 *  @access  internal
		 *  @param   string data index
		 *  @return  string data combined
		 */
		function combineFragments(data) {
			var match = data ? data.match(fragmentPattern) : false,
				part, fragment, length, variable, i;

			if (match) {
				fragment = parseInt(match[1], 10);
				length   = parseInt(match[2], 10);
				variable = match[3];
				data     = '';

				for (i = 0; i < fragment; ++i) {
					part = storage.getItem(variable + i);
					if (part !== null) {
						data += part;
					}
					else {
						return false;
					}
				}

				if (!data || data.length !== length) {
					return false;
				}
			}

			return data;
		}

		/**
		 *  Split a large data string into several smaller fragments
		 *  @name    createFragments
		 *  @type    function
		 *  @access  internal
		 *  @param   string name
		 *  @param   string data
		 *  @return  bool   success
		 */
		function createFragments(name, data) {
			var variable = '__' + name,
				fragment = Math.ceil(data.length / maxSize),
				i;

			for (i = 0; i < fragment; ++i) {
				storage.setItem(variable + i, data.substring(i * maxSize, Math.min((i + 1) * maxSize, data.length)));
			}

			//  write the index
			storage.setItem(name, '[fragment:' + fragment + ',' + data.length + ',' + variable + ']');
		}

		/**
		 *  Remove all fragmented keys
		 *  @name    dropFragments
		 *  @type    function
		 *  @access  internal
		 *  @param   array  match
		 *  @return  void
		 */
		function dropFragments(match) {
			var fragment = parseInt(match[1], 10),
				variable = match[3],
				i;

			for (i = 0; i < fragment; ++i) {
				remove(variable + i);
			}
		}

		/**
		 *  Obtain all data from localStorage
		 *  @name    getAll
		 *  @type    function
		 *  @access  internal
		 *  @return  mixed  data
		 */
		function getAll() {
			var result = null,
				i, key;

			if (storage) {
				result = {};
				for (i = 0; i < storage.length; ++i) {
					key = storage.key(i);
					result[key] = getItem(key);
				}
			}

			return result;
		}

		/**
		 *  Obtain the data for given name
		 *  @name    getItem
		 *  @type    function
		 *  @access  internal
		 *  @param   string name
		 *  @return  mixed  data
		 */
		function getItem(name) {
			var data = storage ? storage.getItem(name) : false;

			if (data && data.match(fragmentPattern)) {
				data = combineFragments(data);
			}

			if (data && data.match(/^[a-z0-9]+:.*$/i)) {
				data = /([a-z0-9]+):(.*)/i.exec(data);
				if (data.length > 2 && data[1] === konflux.string.checksum(data[2])) {
					return JSON.parse(data[2]);
				}
			}

			return data ? data : false;
		}

		/**
		 *  Set the data for given name
		 *  @name    setItem
		 *  @type    function
		 *  @access  internal
		 *  @param   string name
		 *  @param   mixed  data
		 *  @return  string data
		 */
		function setItem(name, data) {
			data = JSON.stringify(data);
			data = konflux.string.checksum(data) + ':' + data;

			if (storage) {
				return data.length > maxSize ? createFragments(name, data) : storage.setItem(name, data);
			}

			return false;
		}

		/**
		 *  Remove the data for given name
		 *  @name    remove
		 *  @type    function
		 *  @access  internal
		 *  @param   string name
		 *  @return  bool   success
		 */
		function remove(name) {
			var data, match;

			if (storage) {
				data = storage.getItem(name);
				if (data && (match = data.match(fragmentPattern))) {
					dropFragments(match);
				}

				return storage.removeItem(name);
			}

			return false;
		}

		/**
		 *  Get the data for given name
		 *  @name    get
		 *  @type    method
		 *  @access  public
		 *  @param   string name [optional, default null - get all stored entries]
		 *  @return  mixed  data
		 */
		ls.get = function(name) {
			return name ? getItem(name) : getAll();
		};

		/**
		 *  Set the data for given name
		 *  @name    set
		 *  @type    method
		 *  @access  public
		 *  @param   string name
		 *  @param   mixed  data
		 *  @return  void
		 */
		ls.set = setItem;

		/**
		 *  Remove the data for given name
		 *  @name    remove
		 *  @type    method
		 *  @access  public
		 *  @param   string name
		 *  @return  bool   success
		 */
		ls.remove = remove;

		/**
		 *  Get the amount of stored keys
		 *  @name    length
		 *  @type    method
		 *  @access  public
		 *  @return  number stored keys
		 */
		ls.length = function() {
			return storage ? storage.length : false;
		};

		/**
		 *  Obtain all the keys
		 *  @name    keys
		 *  @type    method
		 *  @access  public
		 *  @return  Array  keys
		 */
		ls.keys = function() {
			var key = getAll(),
				list = [],
				p;

			for (p in key) {
				list.push(p);
			}

			return list;
		};

		/**
		 *  Flush all stored items
		 *  @name    flush
		 *  @type    method
		 *  @access  public
		 *  @return  void
		 */
		ls.flush = function() {
			var list = ls.keys(),
				i;
			for (i = 0; i < list.length; ++i) {
				remove(list[i]);
			}
		};

		/**
		 *  Obtain the (approximate) byte size of the entire storage
		 *  @name    size
		 *  @type    method
		 *  @access  public
		 *  @return  int size
		 */
		ls.size = function() {
			return decodeURI(encodeURIComponent(JSON.stringify(localStorage))).length;
		};
	}

	konflux.register('storage', new KonfluxStorage());

	//END INCLUDE: core/storage [778.53µs, 5.42KB]
	//BEGIN INCLUDE: core/observer
	/**
	 *  Observer object, handles subscriptions to messages
	 *  @module  observer
	 *  @note    available as konflux.observer / kx.observer
	 */
	function KonfluxObserver() {
		/*jshint validthis: true*/
		var observer = this,
			subscription = {},
			active = {};

		/*global KonfluxObservation*/

		//BEGIN INCLUDE: observer/observation
		/**
		 *  Observation object, instances of this are be provided to all observer notification subscribers
		 *  @name    KonfluxObservation
		 *  @type    module
		 *  @access  internal
		 *  @param   string type
		 *  @param   function handle
		 *  @param   string reference
		 *  @return  KonfluxObservation object
		 */
		function KonfluxObservation(type, handle, reference) {
			'use strict';

			/*global konflux, disable, active*/

			/*jshint validthis: true*/
			var observation = this;

			observation.type      = type;
			observation.reference = reference;
			observation.timeStamp = konflux.time();
			observation.timeDelta = konflux.elapsed();

			/**
			 *  Unsubscribe from the current observer stack
			 *  @name    unsubscribe
			 *  @type    method
			 *  @access  public
			 *  @return  void
			 */
			observation.unsubscribe = function() {
				return disable(type, handle);
			};
			/**
			 *  Stop the execution of this Observation
			 *  @name    stop
			 *  @type    method
			 *  @access  public
			 *  @return  void
			 */
			observation.stop = function() {
				active[reference] = false;
			};
		}

		//END INCLUDE: observer/observation [1.06ms, 1.02KB]
		/**
		 *  Create the subscription stack if it does not exist
		 *  @name    ensureSubscriptionStack
		 *  @type    function
		 *  @access  internal
		 *  @param   string stack name
		 *  @return  void
		 */
		function ensureSubscriptionStack(stack) {
			if (typeof subscription[stack] === 'undefined') {
				subscription[stack] = [];
			}
		}

		/**
		 *  Add handler to specified stack
		 *  @name    add
		 *  @type    function
		 *  @access  internal
		 *  @param   string stack name
		 *  @param   function handler
		 *  @return  int total number of subscriptions in this stack
		 */
		function add(stack, handle) {
			ensureSubscriptionStack(stack);

			return subscription[stack].push(handle);
		}

		/**
		 *  Disable a handler for specified stack
		 *  @name    disable
		 *  @type    function
		 *  @access  internal
		 *  @param   string stack name
		 *  @param   function handler
		 *  @return  void
		 *  @note    this method is used from the Observation object, which would influence the number of
		 *           subscriptions if the subscription itself was removed immediately
		 */
		function disable(stack, handle) {
			var i;

			for (i = 0; i < subscription[stack].length; ++i) {
				if (subscription[stack][i] === handle) {
					subscription[stack][i] = false;
				}
			}
		}

		/**
		 *  Remove specified handler (and all disabled handlers) from specified stack
		 *  @name    remove
		 *  @type    function
		 *  @access  internal
		 *  @param   string stack name
		 *  @param   function handler [optional, default null - remove the entire stack]
		 *  @return  array removed handlers
		 */
		function remove(stack, handle) {
			var out = [],
				keep = [],
				i;

			ensureSubscriptionStack(stack);

			for (i = 0; i < subscription[stack].length; ++i) {
				(!subscription[stack][i] || subscription[stack][i] === handle ? out : keep).push(subscription[stack][i]);
			}

			subscription[stack] = keep;

			return out;
		}

		/**
		 *  Flush specified stack
		 *  @name    flush
		 *  @type    function
		 *  @access  internal
		 *  @param   string stack name
		 *  @return  array removed handlers (false if the stack did not exist);
		 */
		function flush(stack) {
			var out = false;

			if (konflux.isType('undefined', subscription[stack])) {
				out = subscription[stack];
				delete subscription[stack];
			}

			return out;
		}

		/**
		 *  Trigger the handlers in specified stack
		 *  @name    trigger
		 *  @type    function
		 *  @access  internal
		 *  @param   string stack name
		 *  @param   mixed variable1
		 *  @param   mixed ...
		 *  @param   mixed variableN
		 *  @return  void
		 */
		function trigger(stack) {
			var arg = konflux.array.cast(arguments),
				ref = konflux.unique(),
				part = stack.split('.'),
				wildcard = false,
				name, i;

			while (part.length >= 0) {
				active[ref] = true;
				name = part.join('.') + (wildcard ? (part.length ? '.' : '') + '*' : '');
				wildcard = true;

				if (typeof subscription[name] !== 'undefined') {
					for (i = 0; i < subscription[name].length; ++i) {
						if (!active[ref]) {
							break;
						}

						if (subscription[name][i]) {
							arg[0] = new KonfluxObservation(stack, subscription[name][i], ref);
							subscription[name][i].apply(subscription[name][i], arg);
						}
					}
				}

				if (!part.pop()) {
					break;
				}
			}

			delete active[ref];
		}

		/**
		 *  Subscribe a handler to an observer stack
		 *  @name    subscribe
		 *  @type    method
		 *  @access  public
		 *  @param   string stack name
		 *  @param   function handle
		 *  @param   function callback [optional, default undefined]
		 *  @return  KonfluxObserver reference
		 */
		observer.subscribe = function(stack, handle, callback) {
			var list = stack.split(/[\s,]+/),
				result = true,
				i;

			for (i = 0; i < list.length; ++i) {
				result = (add(list[i], handle) ? true : false) && result;
			}

			if (callback) {
				callback.apply(observer, [result]);
			}

			return observer;
		};

		/**
		 *  Unsubscribe a handler from an observer stack
		 *  @name    unsubscribe
		 *  @type    method
		 *  @access  public
		 *  @param   string stack name
		 *  @param   function handle
		 *  @param   function callback [optional, default undefined]
		 *  @return  KonfluxObserver reference
		 */
		observer.unsubscribe = function(stack, handle, callback) {
			var list = stack.split(/[\s,]+/),
				result = [],
				i;

			for (i = 0; i < list.length; ++i) {
				result = result.concat(handle ? remove(list[i], handle) : flush(list[i]));
			}

			if (callback) {
				callback.apply(observer, [result]);
			}

			return observer;
		};

		/**
		 *  Notify all subscribers to a stack
		 *  @name    notify
		 *  @type    method
		 *  @access  public
		 *  @param   string stack name
		 *  @param   mixed  variable1
		 *  @param   mixed  ...
		 *  @param   mixed  variableN
		 *  @return  void
		 */
		observer.notify = function() {
			var arg = konflux.array.cast(arguments),
				list = arg.shift().split(/[\s,]+/),
				i;

			for (i = 0; i < list.length; ++i) {
				trigger.apply(observer, [list[i]].concat(arg));
			}
		};
	}

	konflux.register('observer', new KonfluxObserver());

	//END INCLUDE: core/observer [3.40ms, 6.31KB]
	//BEGIN INCLUDE: core/number
	/**
	 *  Number utils
	 *  @module  number
	 *  @note    available as konflux.number / kx.number
	 */
	function KonfluxNumber() {
		/*jshint validthis: true*/
		var number = this;

		/**
		 *  Test wheter given input is an even number
		 *  @name    even
		 *  @type    method
		 *  @access  public
		 *  @param   number input
		 *  @return  bool even
		 */
		number.even = function(input) {
			input = +input;

			return (input | 0) === input && input % 2 === 0;
		};

		/**
		 *  Test wheter given input is an odd number
		 *  @name    odd
		 *  @type    method
		 *  @access  public
		 *  @param   number input
		 *  @return  bool odd
		 */
		number.odd = function(input) {
			input = +input;

			return (input | 0) === input && !number.even(input);
		};

		/**
		 *  Test wheter given input lies between the low and high values (including the low and high values)
		 *  @name    between
		 *  @type    method
		 *  @access  public
		 *  @param   number input
		 *  @param   number a
		 *  @param   number b
		 *  @return  bool between
		 */
		number.between = function(input, a, b) {
			input = +input;
			a     = +a;
			b     = +b;

			return input >= Math.min(a, b) && input <= Math.max(a, b);
		};

		/**
		 *  Format a number with a given set of decimal length, decimals separator and/or thousands separator
		 *  @name    format
		 *  @type    method
		 *  @access  public
		 *  @param   number input
		 *  @param   number decimals [optional, default 0 - no precision]
		 *  @param   string decimals separator [optional, default '.']
		 *  @param   string thousands separator [optional, default ',']
		 *  @return  string formatted number
		 *  @note    this method is compatible with PHP's number_format function, it either accepts 2 or 4 arguments
		 */
		number.format = function(input, precision, point, separator) {
			var multiplier = precision ? Math.pow(10, precision) : 0;

			//  check whether default values need to be assigned
			point     = !konflux.isType('undefined', point) ? point : '.';
			separator = !konflux.isType('undefined', separator) || arguments.length < 3 ? separator : ',';

			//  format the number
			input = +(('' + input).replace(/[,\.]+/, '.'));

			//  round the last desired decimal
			input = multiplier > 0 ? Math.round(input * multiplier) / multiplier : input;

			//  split input into int value and decimal value
			input = ('' + (!isFinite(input) ? 0 : +input)).split('.');

			//  apply thousands separator, if applicable (number length exceeds 3 and we have a non-empty separator)
			if (input[0].length > 3 && separator && separator !== '') {
				input[0] = konflux.string.chunk(input[0], 3, konflux.string.CHUNK_END).join(separator);
			}

			return input[0] + (precision > 0 ? point + konflux.string.pad(input[1] || '', precision, '0', konflux.string.PAD_RIGHT) : '');
		};
	}

	konflux.register('number', new KonfluxNumber());

	//END INCLUDE: core/number [822.68µs, 2.74KB]
	//BEGIN INCLUDE: core/ajax
	/**
	 *  Handle AJAX requests
	 *  @module  ajax
	 *  @note    available as konflux.ajax / kx.ajax
	 */
	function KonfluxAjax() {
		/*jshint validthis: true*/
		var ajax = this,
			stat = {},
			header = false;

		/*global KonfluxFormData*/

		//BEGIN INCLUDE: ajax/formdata
		/**
		 *  FormData stub, in case a browser doesn't feature the FormData object
		 *  @name    KonfluxFormData
		 *  @type    module
		 *  @access  internal
		 *  @return  KonfluxFormData object
		 */
		function KonfluxFormData() {
			'use strict';

			/*global  konflux*/

			/*jshint validthis: true*/
			var formdata = this,
				data = {};

			/**
			 *  Append a key/value pair to the KonfluxFormData instance
			 *  @name    append
			 *  @type    method
			 *  @access  public
			 *  @param   string key
			 *  @param   mixed  value (can be anything but an object)
			 *  @return  KonfluxFormData reference
			 */
			formdata.append = function(key, value) {
				if (konflux.isType('object', value)) {
					data[key] = value;
				}

				return formdata;
			};

			/**
			 *  Serialize the KonfluxFormData instance into a string
			 *  @name    serialize
			 *  @type    method
			 *  @access  public
			 *  @return  string  urlencoded data
			 */
			formdata.serialize = function() {
				var r = [],
					p;

				for (p in data) {
					r.push(p + '=' + encodeURIComponent(data[p]));
				}

				return r.join('&');
			};

			/**
			 *  Convenience method to make KonfluxFormData serialization work if used as string
			 *  @name    toString
			 *  @type    method
			 *  @access  public
			 *  @return  string urlencodes data
			 *  @note    This method is autmatically called when a KonfluxFormData instance is used as string (e.g. KonfluxFormData + '')
			 */
			KonfluxFormData.toString = function() {
				return formdata.serialize();
			};
		}

		//END INCLUDE: ajax/formdata [554.03µs, 1.41KB]
		/**
		 *  Obtain the default headers
		 *  @name    getHeader
		 *  @type    function
		 *  @access  internal
		 *  @param   string url
		 *  @return  object headers
		 */
		function getHeader(url) {
			if (!header) {
				header = {
					'X-Konflux': 'konflux/' + konflux.string.ascii(konflux.version())
				};
			}

			// Since browsers "preflight" requests for cross-site HTTP requests with
			// custom headers we should not try to send them, or request will fail
			// silently
			//
			// For more information, please refer to:
			// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests

			return konflux.url.isLocal(url) ? header : {};
		}

		/**
		 *  Obtain a new XHR object
		 *  @name    getXMLHTTPRequest
		 *  @type    function
		 *  @access  internal
		 *  @return  object XMLHttpRequest
		 */
		function getXMLHTTPRequest() {
			var xhr     = new XMLHttpRequest();
			xhr.__kxref = konflux.unique();

			return xhr;
		}

		/**
		 *  Request a resource using XHR
		 *  @name    request
		 *  @type    function
		 *  @access  internal
		 *  @param   object config
		 *  @return  object XMLHttpRequest
		 */
		function request(config) {
			var url     = 'url' in config ? config.url : (konflux.url ? konflux.url.path : null),
				type    = 'type' in config ? config.type.toUpperCase() : 'GET',
				data    = 'data' in config ? prepareData(config.data) : '',
				async   = 'async' in config ? config.async : true,
				headers = 'header' in config ? combine(config.header, getHeader(url)) : getHeader(url),
				xhr     = getXMLHTTPRequest(),
				p;

			if (!/^(POST|PUT)$/.test(type)) {
				url += 'data' in config && config.data !== '' ? '?' + (typeof config.data === 'string' ? config.data : data) : '';
				data = null;
			}

			xhr.onload = xhrComplete(xhr, config, type);

			if ('progress' in config && konflux.isType('function', config.progress)) {
				konflux.event.add(xhr.upload, 'progress', config.progress);
			}

			if ('error' in config && konflux.isType('function', config.error)) {
				konflux.event.add(xhr, 'error', config.error);
			}

			if ('abort' in config && konflux.isType('function', config.abort)) {
				konflux.event.add(xhr, 'abort', config.abort);
			}

			xhr.open(type, url, async);
			if (headers) {
				for (p in headers) {
					xhr.setRequestHeader(p, headers[p]);
				}
			}

			xhr.send(data);

			return xhr;
		}

		/**
		 *  Handle the XMLHTTPRequest 'load'-event
		 *  @name    xhrComplete
		 *  @access  internal
		 *  @param   XMLHTTPRequest  xhr
		 *  @param   object          config
		 *  @param   string          type
		 *  @return  function handler
		 */
		function xhrComplete(xhr, config, type) {
			return function() {
				var status = Math.floor(this.status * 0.01),
					state = false;
				++stat[type];

				if (status === 2 && 'success' in config) {
					state = 'success';
					config.success.apply(this, process(this));
				}
				else if (status >= 4 && 'error' in config) {
					state = 'error';
					config.error.apply(this, process(this));
				}

				if ('complete' in config) {
					state = !state ? 'complete' : state;
					config.complete.apply(this, [this.status, this.statusText, this]);
				}

				if (state) {
					konflux.observer.notify('konflux.ajax.' + type.toLowerCase() + '.' + state, xhr, config);
				}
			};
		}

		/**
		 *  Process an XHR response
		 *  @name    process
		 *  @type    function
		 *  @access  internal
		 *  @param   object XMLHttpRequest
		 *  @return  array  response ([status, response text, XMLHttpRequest])
		 */
		function process(xhr) {
			var contentType = xhr.getResponseHeader('content-type'),
				result = [
					xhr.status,
					xhr.responseText,
					xhr
				],
				match;

			if (contentType && (match = contentType.match(/([^;]+)/))) {
				contentType = match[1];
			}

			switch (contentType) {
				case 'application/json':
					result[1] = JSON.parse(result[1]);
					break;
			}

			return result;
		}

		/**
		 *  Prepare data to be send
		 *  @name    prepareData
		 *  @type    function
		 *  @access  internal
		 *  @param   mixed  data
		 *  @param   string name
		 *  @param   FormData (or KonfluxFormData) object
		 *  @return  FormData (or KonfluxFormData) object
		 */
		function prepareData(data, name, formData) {
			var r = formData || (typeof FormData !== 'undefined' ? new FormData() : new KonfluxFormData()),
				p;

			if (typeof File !== 'undefined' && data instanceof File) {
				r.append(name, data, data.name);
			}
			else if (typeof Blob !== 'undefined' && data instanceof Blob) {
				r.append(name, data, 'blob');
			}
			else if (data instanceof Array || (FileList !== 'undefined' && data instanceof FileList)) {
				for (p = 0; p < data.length; ++p) {
					prepareData(data[p], (name || '') + '[' + p + ']', r);
				}
			}
			else if (konflux.isType('object', data)) {
				for (p in data) {
					prepareData(data[p], name ? name + '[' + encodeURIComponent(p) + ']' : encodeURIComponent(p), r);
				}
			}
			else {
				r.append(name, data);
			}

			return r;
		}

		/**
		 *  Obtain a handler function for given request, this handler is triggered by the konflux observer (konflux.ajax.<type>)
		 *  @name    requestType
		 *  @type    function
		 *  @access  internal
		 *  @param   string   type
		 *  @return  function handler
		 */
		function requestType(t) {
			var handler = function(config) {
					switch (konflux.type(config)) {
						case 'object':
							config.type = t;
							break;

						//  we assume an URL
						case 'string':
							config = {
								url: config,
								type: t
							};

							break;

						default:
							config = {
								type: t
							};

							break;
					}

					return request(config);
				};

			stat[t.toUpperCase()] = 0;
			konflux.observer.subscribe('konflux.ajax.' + t.toLowerCase(), function(ob, config) {
				handler(config);
			});

			return handler;
		}

		/**
		 *  Perform a request
		 *  @name    request
		 *  @type    method
		 *  @access  public
		 *  @param   object config
		 *  @return  object XMLHttpRequest
		 */
		ajax.request = request;

		/**
		 *  Perform a GET request
		 *  @name    get
		 *  @type    method
		 *  @access  public
		 *  @param   object config
		 *  @return  object XMLHttpRequest
		 */
		ajax.get = requestType('GET');

		/**
		 *  Perform a POST request
		 *  @name    post
		 *  @type    method
		 *  @access  public
		 *  @param   object config
		 *  @return  object XMLHttpRequest
		 */
		ajax.post = requestType('POST');

		/**
		 *  Perform a PUT request
		 *  @name    put
		 *  @type    method
		 *  @access  public
		 *  @param   object config
		 *  @return  object XMLHttpRequest
		 */
		ajax.put = requestType('PUT');

		/**
		 *  Perform a DELETE request
		 *  @name    del
		 *  @type    method
		 *  @access  public
		 *  @param   object config
		 *  @return  object XMLHttpRequest
		 */
		ajax.del = requestType('DELETE');

		/**
		 *  Perform a PURGE request (mostly supported by caching servers such as Varnish)
		 *  @name    purge
		 *  @type    method
		 *  @access  public
		 *  @param   object config
		 *  @return  object XMLHttpRequest
		 */
		ajax.purge = requestType('PURGE');
	}

	konflux.register('ajax', new KonfluxAjax());

	//END INCLUDE: core/ajax [2.07ms, 8.58KB]
});
