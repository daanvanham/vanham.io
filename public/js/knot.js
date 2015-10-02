
//BEGIN INCLUDE: lib/json-formatter
/**
 *  Format a string containing (valid) js variables into proper JSON so it can be handled by JSON.parse
 *  @package    JSONFormatter
 *  @author     Rogier Spieker <rogier@konfirm.eu>
 */
(function(scope, factory) {
	// $lab:coverage:off$
	var name = 'JSONFormatter';

	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = factory();
	}
	else if (typeof define === 'function' && define.amd) {
		define(name, factory);
	}
	else {
		(typeof exports === 'object' ? exports : scope)[name] = factory();
	}
	// $lab:coverage:on$
})(this, function() {

	function JSONFormatter() {
		//  Implement a Singleton pattern and allow JSONFormatter to be invoked without the `new` keyword
		if (typeof JSONFormatter.prototype.__instance !== 'undefined' || !(this instanceof JSONFormatter)) {
			return JSONFormatter.prototype.__instance || new JSONFormatter();
		}
		JSONFormatter.prototype.__instance = this;

		var formatter = this,
			special = '\'":,{}[] ',
			quotation = '"',
			pattern = {
				escape: /["\\\/\b\f\n\r\t]/,
				noquote: /^(?:true|false|null|-?[0-9]+(?:\.[0-9]+)?)$/i,
				trailer: /[,]+$/
			};

		/**
		 *  Determine is a token is a special character
		 *  @name    isSpecial
		 *  @access  internal
		 *  @param   string  token
		 *  @return  bool  special
		 */
		function isSpecial(token) {
			return special.indexOf(token) >= 0;
		}

		/**
		 *  Add quotes if required
		 *  @name    addQuotation
		 *  @access  internal
		 *  @param   string  token
		 *  @param   bool    force
		 *  @return  string  JSON-token
		 */
		function addQuotation(token, force) {
			var quote = quotation;

			//  if quotation is not enforced, we must skip application of quotes for certain tokens
			if (!force && (isSpecial(token) || pattern.noquote.test(token))) {
				quote = '';
			}

			return quote + token + quote;
		}

		/**
		 *  Remove trailing commas from the result stack
		 *  @name    removeTrailing
		 *  @access  internal
		 *  @param   Array  result
		 *  @return  Array  result
		 */
		function removeTrailing(result) {
			return pattern.trailer.test(result) ? removeTrailing(result.substr(0, result.length - 1)) : result;
		}

		/**
		 *  Handle a quoted string, ensuring proper escaping for double quoted strings
		 *  @name    escapeQuotedInput
		 *  @access  internal
		 *  @param   string  token
		 *  @array   Array   list
		 *  @return  Array   result
		 */
		function escapeQuotedInput(token, list) {
			var result = [],
				character;

			//  token is the initial (opening) quotation character, we are not (yet) interested in this,
			//  as we need to process the stuff in list, right until we find a matching token
			while (list.length) {
				character = list.shift();

				//  reduce provided escaping
				if (character[character.length - 1] === '\\') {
					if (!pattern.escape.test(list[0])) {
						//  remove the escape character
						character = character.substr(0, character.length - 1);
					}

					//  add the result
					result.push(character);

					//  while we are at it, we may aswel move the (at least previously) escaped
					//  character to the result
					result.push(list.shift());
					continue;
				}
				else if (character === token) {
					//  with the escaping taken care of, we now know the string has ended
					break;
				}

				result.push(character);
			}

			return addQuotation(result.join(''));
		}

		/**
		 *  Compile the JSON-formatted string from a list of 'tokenized' data
		 *  @name    compiler
		 *  @access  internal
		 *  @param   Array   list
		 *  @return  string  JSON-formatted
		 */
		function compiler(list) {
			var result = '',
				token;

			while (list.length) {
				token = list.shift();

				switch (token) {
					//  ignore whitespace outside of quoted patterns
					case ' ':
						break;

					//  remove any trailing commas and whitespace
					case '}':
					case ']':
						result = removeTrailing(result).concat([token]);
						break;

					//  add/remove escaping
					case '"':
					case '\'':
						result += escapeQuotedInput(token, list);
						break;

					//  determine if the value needs to be quoted (always true if the next item in the list is a separator)
					default:
						result += addQuotation(token, list[0] === ':');
						break;
				}
			}

			return result;
		}

		/**
		 *  Tokenize the input, adding each special character to be its own item in the resulting array
		 *  @name    tokenize
		 *  @access  internal
		 *  @param   string  input
		 *  @result  Array   tokens
		 */
		function tokenize(input) {
			var result = [],
				i;

			//  check each character in the string
			for (i = 0; i < input.length; ++i) {
				//  if there is not result or the current or previous input is special, we create a new result item
				if (result.length === 0 || isSpecial(input[i]) || isSpecial(result[result.length - 1])) {
					result.push(input[i]);
				}
				//  extend the previous item
				else {
					result[result.length - 1] += input[i];
				}
			}

			return result;
		}

		/**
		 *  Prepare a string to become a JSON-representation
		 *  @name    prepare
		 *  @access  public
		 *  @param   string  input
		 *  @return  string  JSON-formatted
		 */
		formatter.prepare = function(input) {
			//  tokenize the input and feed it to the compiler in one go
			return compiler(tokenize(input))
				//  determine whether we are dealing with an Object or Array notation
				.replace(/^.*?([:,]).*$/, function(match, symbol) {
					var character = symbol === ':' ? '{}' : '[]';

					//  figure out if the notation should be added or may be skipped
					return match[0] !== character[0] ? character[0] + removeTrailing(match) + character[1] : match;
				})
			;
		};

		/**
		 *  Prepare a string and parse it using JSON.parse
		 *  @name    parse
		 *  @access  public
		 *  @param   string  input
		 *  @return  mixed   parsed
		 */
		formatter.parse = function(input) {
			return JSON.parse(formatter.prepare(input));
		};
	}

	//  expose the interface
	return JSONFormatter;
});

//END INCLUDE: lib/json-formatter [617.22µs, 5.89KB]
;(function(global, factory) {
	'use strict';

	/**
	 *  Simplified data-binding, never using eval
	 *  (e.g. Content-Security-Policy does not need the 'unsafe-eval' flag)
	 *  @package  Knot
	 */
	function Knot() {
		var knot = this,
			json, buffer;

		/**
		 *  Initialiser
		 *  @name    init
		 *  @access  internal
		 *  @return  void
		 */
		function init() {
			if (!compatible()) {
				return setTimeout(function() {
					ready('Unsupported browser');
				}, 0);
			}

			//  the JSON formatter
			json = new JSONFormatter();

			//  the default options
			buffer = {
				defaults: {
					greedy: true,
					attribute: 'data-knot'
				},
				extension: {},
				rAF: global.requestAnimationFrame || function(f) {
					setTimeout(f, 16);
				}
			};

			//  add the DOMContentLoaded event to the document, so we can trigger the 'ready' handlers early on
			document.addEventListener('DOMContentLoaded', function() {
				//  call any registered 'ready' handler
				ready();

				//  mark the internal 'ready' buffer as bool true so any callback added after knot
				//  has become ready can be invoked (almost) immediately
				buffer.ready = true;
			}, false);

			//  register the default extensions
			factory(extension);
		}

		/**
		 *  Basic compatibility check
		 *  @name    compatible
		 *  @access  internal
		 *  @return  void  [throws Error is not compatible]
		 */
		function compatible() {
			var result = true;

			result = result && 'addEventListener' in document;
			result = result && 'defineProperties' in Object;
			result = result && 'getOwnPropertyDescriptor' in Object;

			return result;
		}

		/**
		 *  Convert given array-like value to be a true array
		 *  @name    castToArray
		 *  @access  internal
		 *  @param   Array-like  value
		 *  @return  Array  value
		 */
		function castToArray(cast) {
			return Array.prototype.slice.call(cast);
		}

		/**
		 *  Invoke all provided functions as callback
		 *  @name    ready
		 *  @access  internal
		 *  @param   string  error
		 *  @return  Knot    instance
		 */
		function ready(error, list) {
			var arg = [error, knot];

			list = list || buffer && 'ready' in buffer ? buffer.ready : false;

			if (list) {
				for (var i = 0; i < list.length; ++i) {
					list[i].apply(null, arg);
				}
			}

			return knot;
		}

		/**
		 *  Obtain and/or register an extension to be defined in the data attribute
		 *  @name    extension
		 *  @access  internal
		 *  @param   string    name
		 *  @param   function  handler  [optional, default undefined - obtain the extension]
		 *  @return  function  handler
		 */
		function extension(name, handler) {
			if (handler) {
				buffer.extension[name] = handler;
			}

			if (!(name in buffer.extension)) {
				return function() {
					console.error('Knot: Unknown extension "' + name + '"');
				};
			}

			return buffer.extension[name];
		}

		/**
		 *  Obtain all textNodes residing within given element
		 *  @name    textNodes
		 *  @access  internal
		 *  @param   DOMElement
		 *  @return  Array  textNodes
		 */
		function textNodes(element) {
			var result = [],
				walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false),
				node;

			while ((node = walker.nextNode())) {
				result.push(node);
			}

			return result;
		}

		/**
		 *  Obtain all elements containing the data attribute residing within given element
		 *  @name    attributes
		 *  @access  internal
		 *  @param   DOMElement
		 *  @return  Array  textNodes
		 */
		function attributes(element) {
			var result = [],
				list, i;

			switch (element.nodeType) {
				case 11:  //  DocumentFragment
					for (i = 0; i < element.childNodes.length; ++i) {
						result = result.concat(attributes(element.childNodes[i]));
					}

					break;

				case 1:  //  DOMElement
					if (element.hasAttribute(buffer.defaults.attribute)) {
						result.push(element);
					}
					/*falls through*/
				case 9:  //  DOMDocument
					list = element.querySelectorAll('[' + buffer.defaults.attribute + ']');
					for (i = 0; i < list.length; ++i) {
						result.push(list[i]);
					}

					break;
			}

			return result;
		}

		/**
		 *  Split a DOMText node into placeholder and non-placeholder parts, returning an array of all DOMText nodes
		 *  containing a placeholder
		 *  @name   splitter
		 *  @access internal
		 *  @param  DOMText node
		 *  @return array   DOMText nodes
		 */
		function splitter(node) {
			var match = node.nodeValue.match(/(\{([^\{]+)\})/),
				content = match ? (match.index === 0 ? node : node.splitText(match.index)) : null,
				remainder = match ? content.splitText(match[1].length) : null,
				result = content ? [content] : [];

			if (content) {
				content.original = content.nodeValue;
			}

			if (remainder) {
				result = result.concat(splitter(remainder));
			}

			return result;
		}

		/**
		 *  Obtain all placeholder DOMText nodes within given element
		 *  @name    placeholders
		 *  @access  internal
		 *  @param   DOMNode element
		 *  @return  array   DOMText nodes
		 */
		function placeholders(element) {
			var result = [];

			textNodes(element).forEach(function(node) {
				result = result.concat(splitter(node));
			});

			return result;
		}

		/**
		 *  Populate an options object based on the defaults and override any provided setting
		 *  @name    defaults
		 *  @access  internal
		 *  @param   Object  options  [optional, default undefined - the full default options]
		 *  @result  Object  options
		 */
		function defaults(options) {
			var p;

			if (options && typeof options === 'object') {
				for (p in options) {
					buffer.defaults[p] = options[p];
				}
			}

			return buffer.defaults;
		}

		/**
		 *  Prepare delegation for all keys of the provided model
		 *  @name    prepare
		 *  @access  internal
		 *  @param   Object  model
		 *  @return  Object  prepared model
		 */
		function prepare(model) {
			var descriptor = {
					prepared: {enumerable: false, value: true}
				},
				key, handler;

			if (typeof model === 'object' && !('prepared' in model && model.prepared)) {
				for (key in model) {
					//  skip any previously prepared key
					//  we detect "our own" delegation by looking for the provider in the handler function
					if (typeof model[key] !== 'function' || !('provider' in model[key])) {
						if (typeof model[key] === 'function') {
							descriptor[key] = {
								enumerable: true,
								writable: false,
								value: model[key]
							}
						}
						else if (typeof model[key] === 'object' && !(model[key] instanceof Array)) {
							descriptor[key] = {
								enumerable: true,
								writable: false,
								value: prepare(model[key])
							}
						}
						else {
							handler = delegate(model[key], model);

							descriptor[key] = {
								enumerable: true,
								get: handler,
								set: handler
							};
						}
					}
					else if ('scope' in model[key] && !model[key].scope()) {
						model[key].scope(model);
					}
				}

				Object.defineProperties(model, descriptor);
			}

			return model;
		}

		/**
		 *  Obtain the delegate function applied to a model property by Knot
		 *  @name    getDelegate
		 *  @access  internal
		 *  @param   object    model
		 *  @param   string    key
		 *  @return  function  delegate  [false, if no delegate was found]
		 */
		function getDelegate(model, key) {
			var result = false,
				descriptor, nest;

			if (key in model) {
				//  if a model key is an explicitly assigned delegate, we utilize it
				if (typeof model[key] === 'function' && 'element' in model[key]) {
					result = model[key];
				}
				//  otherwise we need to get the property descriptor first
				else {
					descriptor = Object.getOwnPropertyDescriptor(model, key);
					result = descriptor.get;
				}
			}
			else {
				nest = key.indexOf('.');
				if (nest > 0 && key.substr(0, nest) in model) {
					return getDelegate(model[key.substr(0, nest)], key.substr(nest + 1));
				}
			}

			return result;
		}

		/**
		 *  Create a delegation method for the given data
		 *  @name    delegate
		 *  @access  internal
		 *  @param   mixed     data
		 *  @param   Object    scope
		 *  @return  function  delegate
		 */
		function delegate(data, scope) {
			var elements = [],
				subscriber = [],
				accessor = [],
				value = update(data),
				fn = function() {
					if (arguments.length) {
						data  = fn.provider(arguments[0]);
						value = update.apply(scope, [data, elements, subscriber, 'delegate']);
					}
					else if (accessor.length) {
						accessor.forEach(function(callback) {
							callback.apply(null, [data]);
						});
					}

					return value;
				};

			//  if we are dealing with arrays, we'd like to know about mutations
			if (data instanceof Array) {
				['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(key) {
					if (typeof data[key] === 'function') {
						data['_' + key] = data[key];
						data[key] = function() {
							var result = data['_' + key].apply(data, arguments);

							//  map the changes
							data.forEach(function(item, index) {
								data[index] = prepare(item);
							});

							update.apply(scope, [data, elements, subscriber, key]);

							return result;
						};
					}
				});

				data.forEach(function(item, index) {
					data[index] = prepare(item);
				});
			}

			//  The main provider, responsible for handling all value changes
			fn.provider = function(data) {
				var callback;

				if (typeof data === 'function') {
					callback = data;
					data = function() {
						return update.apply(scope, [callback.apply(null, arguments), elements, subscriber, 'function']);
					};
				}

				return data;
			};

			//  Scope getter/setter (setting only allowed once)
			fn.scope = function() {
				if (!scope && arguments.length) {
					scope = arguments[0];
				}

				return scope;
			};

			//  Add an element to the list and ensure the correct (initial) value
			fn.element = function() {
				var list;

				if (arguments.length) {
					list = castToArray(arguments);

					list.forEach(function(elm) {
						observe(elm, fn);
					});

					update.apply(scope, [data, list, undefined, 'element']);
					elements = elements.concat(list);
				}
				else {
					return elements;
				}

				return fn;
			};

			//  Subscribe a handler which receives all 'reads'
			fn.access = function() {
				accessor = accessor.concat(castToArray(arguments));

				return fn;
			};

			//  subscribe a handler which receives all changes
			fn.subscribe = function() {
				subscriber = subscriber.concat(castToArray(arguments));

				return fn;
			};

			//  finally: call the fn.provider to properly associate the data
			fn.provider(data);

			return fn;
		}

		/**
		 *  Update zero or more elements (optionally passed on to subscribers) and return the value
		 *  @name    update
		 *  @access  internal
		 *  @param   mixed   data
		 *  @param   array   elements     [optional, default undefined - nothing to update]
		 *  @param   Array   subscribers  [optional, default undefined - no pass through subscribers]
		 *  @param   string  name         [optional, default undefined - 'unknown']
		 *  @return  mixed   value
		 */
		function update(data, elements, subscribers, name) {
			var value = typeof data === 'function' ? data() : data,
				model = this,
				nodeValue;

			if (subscribers) {
				subscribers.forEach(function(sub) {
					var result = sub.apply(null, [value, model, name]);

					if (result !== undefined) {
						value = result;
					}
				});
			}

			if (elements) {
				nodeValue = '' + value;
				elements.forEach(function(element) {
					if (nodeValue !== element.nodeValue) {
						buffer.rAF.apply(global, [function() {
							element.nodeValue = nodeValue;

							if (element.nodeType === 3) {
								if (/^$/.test(nodeValue) && !('__parent' in element) && element === element.parentNode.firstChild) {
									element.__parent = element.parentNode;
									element.parentNode.removeChild(element);
								}
								else if ('__parent' in element) {
									element.__parent.insertBefore(element, element.__parent.firstChild);
									delete element.__parent;
								}
							}
						}]);
					}
				});
			}

			return typeof data === 'function' ? data : value;
		}

		/**
		 *  Persist a value to the model
		 *  @name    persist
		 *  @access  internal
		 *  @param   function  delegate
		 *  @param   mixed     value
		 *  @return  void
		 *  @note    This function is triggered from MutationObservers/-Events
		 */
		function persist(delegation, value) {
			var current = delegation(),
				type = typeof current;

			if (type === 'object') {
				type = type instanceof Array ? 'array' : type;
			}

			switch (type) {
				case 'function':
					if (current !== value) {
						delegation(value);
					}
					break;

				case 'number':
					if (+current !== +value) {
						delegation(+value);
					}
					break;

				case 'boolean':
					if (!!current !== !!value) {
						delegation(!!value);
					}
					break;

				case 'string':
					/*falls through*/
				default:
					if (current !== value) {
						delegation(value);
					}
					break;
			}
		}

		/**
		 *  Observe the DOMElement(s) bound to the model key and persist changes from outside Knot
		 *  @name    observe
		 *  @access  internal
		 *  @param   DOMText   text
		 *  @param   function  delegate
		 *  @return  void
		 */
		function observe(text, delegation) {
			var observer;

			if (!('observer' in buffer)) {
				buffer.observer = global.MutationObserver || global.webkitMutationObserver || false;
				buffer.textObserverConfig = {
					characterData: true,
					characterDataOldValue: true
				};
			}

			if (buffer.observer) {
				observer = new buffer.observer(function(mutations) {
					mutations.forEach(function(mutation) {
						persist(delegation, mutation.target.nodeValue);
					});
				});

				observer.observe(text, buffer.textObserverConfig);
			}
			else if (text.addEventListener) {
				text.addEventListener('DOMCharacterDataModified', function(e) {
					if (e.newValue) {
						persist(delegation, e.newValue);
					}
				});
			}
		}

		/**
		 *  Register one or more functions to be called once Knot is ready to
		 *  tie together models and elements
		 *  @name    ready
		 *  @access  public
		 *  @param   function ...  [variadic, provide as many functions you need]
		 *  @return  Knot instance [chainable]
		 */
		knot.ready = function() {
			var arg = castToArray(arguments);

			if (!buffer) {
				buffer = {};
			}
			if (!('ready' in buffer)) {
				buffer.ready = [];
			}
			else if (buffer.ready === true) {
				return ready(arg);
			}

			buffer.ready = buffer.ready.concat(arg);

			return knot;
		};

		/**
		 *  Tie a model to zero or more elements
		 *  @name    tie
		 *  @access  public
		 *  @param   Object      model
		 *  @param   DOMElement  ...     [variadic, zero or more DOMElement instances]
		 *  @param   Object      options [optional, default undefined - default options]
		 *  @return  void
		 *  @note    If no DOMElements are provided, the model will be bound to the entire document
		 */
		knot.tie = function() {
			var arg = castToArray(arguments),
				model = typeof arg[0] === 'object' && !('nodeType' in arg[0]) ? arg.shift() : {},
				options = defaults(arg.length > 0 && (typeof arg[arg.length - 1] === 'object' && !('nodeType' in arg[arg.length - 1])) ? arg.pop() : {}),
				node;

			if (arg.length <= 0) {
				arg.push(document.body);
			}

			model = prepare(model);

			if (!('ties' in buffer)) {
				buffer.ties = [];
			}
			buffer.ties.push({model: model, target: arg.slice()});

			while (arg.length) {
				node = arg.shift();

				placeholders(node)
					.forEach(function(text) {
						var placeholder = text.nodeValue.substr(1, text.nodeValue.length - 2).split(/:/),
							key = placeholder.shift(),
							initial = placeholder.length ? placeholder.join(':') : '',
							delegated = getDelegate(model, key);

						if (delegated) {
							if (!delegated()) {
								delegated(initial);
							}
						}
						else if (options.greedy) {
							delegated = delegate(initial, model);
							Object.defineProperty(model, key, {
								enumerable: true,
								get: delegated,
								set: delegated
							});
						}

						//  if Knot created the delegate, we should register the element to the delegation
						if (delegated) {
							delegated.element(text);
						}
					})
				;

				attributes(node)
					.forEach(function(target) {
						var config;

						if (document.body.contains(target)) {
 							config = json.parse(target.getAttribute(buffer.defaults.attribute));

 							if (typeof config === 'object') {
								Object.keys(config)
									.forEach(function(key) {
										var ex = extension(key);

										ex(target, model, config[key], getDelegate);
									})
								;
							}
						}
					})
				;
			}

			return model;
		};

		/**
		 *  Get/set the default options
		 *  @name    defaults
		 *  @param   Object  options  [optional, default undefined - do not set anything]
		 *  @return  Object  default options
		 */
		knot.defaults = function(options) {
			if (options && typeof options === 'object') {
				buffer.defaults = defaults(options);
			}

			return buffer.defaults;
		};

		/**
		 *  Create a delegate for given data
		 *  @name    delegate
		 *  @access  public
		 *  @param   mixed     data
		 *  @return  function  delegate
		 */
		knot.delegate = delegate;
		knot.delegate.get = getDelegate;

		/**
		 *  Register an extension to handle settings from a data attribute
		 *  @name    extension
		 *  @access  public
		 *  @param   string    name
		 *  @param   function  handler
		 *  @return  function  handler
		 */
		knot.extension = extension;

		/**
		 *  Obtain the model(s) influencing the provided element
		 *  @name    ties
		 *  @access  public
		 *  @param   DOMNode  element
		 *  @return  Array    models
		 */
		knot.ties = function(element) {
			var result = [],
				ancestry = [element];

			if ('ties' in buffer) {
				//  obtain a the ancestry (parent relations) for the given element
				while (ancestry[ancestry.length - 1].parentNode) {
					ancestry.push(ancestry[ancestry.length - 1].parentNode);
				}

				//  iterator over each tied model
				buffer.ties.forEach(function(tie) {
					var list = tie.target.filter(function(node) {
							return ancestry.indexOf(node) >= 0;
						});

					if (list.length) {
						result.push(tie.model);
					}
				});
			}

			return result;
		};

		//  initialise knot
		init();
	}

	//  register the (only) Knot instance to the global scope
	global.knot = new Knot();

})(this, function(register) {


	//BEGIN INCLUDE: extension/attribute
	register('attribute', function(element, model, config, delegation) {
		'use strict';

		function update(key, value) {
			if (value) {
				element.setAttribute(key, value);
			}
			else {
				element.removeAttribute(key);
			}
		}

		Object.keys(config)
			.forEach(function(key) {
				var delegated = delegation(model, config[key]);

				//  If knot created delegation for the key, we subscribe to changes
				if (delegated) {
					//  subscribe to value changes
					delegated.subscribe(function(value) {
						if (element.getAttribute(key) !== value) {
							update(key, value);
						}
					});
				}

				//  set the attribute based on the model value
				update(key, model[config[key]]);
			})
		;
	});

	//END INCLUDE: extension/attribute [101.81µs, 682.00bytes]
	//BEGIN INCLUDE: extension/style
	register('style', function(element, model, config, delegation) {
		'use strict';

		Object.keys(config)
			.forEach(function(key) {
				var delegated = delegation(model, config[key]),
					propagate = function(value) {
						var list;

						if ('classList' in element) {
							element.classList[!!value ? 'add' : 'remove'](key);
						}

						//  the old-fashioned method of applying classes
						else {
							if (!pattern) {
								pattern = new RegExp('(?:^|\\s+)' + key + '(\\s+|$)');
							}

							list = element.className.replace(pattern, function(match, after) {
								return after || '';
							});

							element.className = list + (!!value ? ' ' + key : '');
						}
					},

					pattern;

				//  If knot created delegation for the key, we subscribe to changes
				if (delegated) {
					//  subscribe to value changes
					delegated.subscribe(propagate);
				}

				//  set the attribute based on the model value
				propagate(model[config[key]]);
			})
		;
	});

	//END INCLUDE: extension/style [75.77µs, 954.00bytes]
	//BEGIN INCLUDE: extension/text
	register('text', function(element, model, key, delegation) {
		'use strict';

		var delegated = delegation(model, key),
			text = element.firstChild && element.firstChild.nodeType === 3 ? element.firstChild : document.createTextNode(delegated ? delegated() : ''),
			propagate = function() {
				if (text.parentNode !== element) {
					if (element.firstChild) {
						element.insertBefore(text, element.firstChild);
					}
					else {
						element.appendChild(text);
					}
				}
			};

		if (delegated) {
			delegated.subscribe(propagate);
			delegated.element(text);

			console.log(key, delegated.element());
		}

		propagate(model[key]);
	});

	//END INCLUDE: extension/text [58.51µs, 627.00bytes]
	//BEGIN INCLUDE: extension/each
	register('each', function(element, model, key, delegation) {
		'use strict';

		var template = [],
			delegated = delegation(model, key),
			mimic;

		//  absorb all childNodes into the template
		while (element.firstChild) {
			template.push(element.removeChild(element.firstChild).cloneNode(true));
		}

		function update() {
			var output = document.createDocumentFragment(),
				ties = [];

			model[key].forEach(function(value, index) {
				var arg = [typeof value === 'object' ? value : {$item: value}],
					i;

				for (i = 0; i < template.length; ++i) {
					arg.push(output.appendChild(template[i].cloneNode(true)));
				}

				ties.push(function() {
					knot.tie.apply(knot, arg);
				});
			});

			//  clear the element and redraw the new output
			while (element.lastChild) {
				element.removeChild(element.lastChild);
			}

			element.appendChild(output);

			ties.forEach(function(tie) {
				tie();
			});
		}

		delegated.subscribe(function() {
			update();
		});

		update();
	});

	//END INCLUDE: extension/each [65.31µs, 965.00bytes]
	//BEGIN INCLUDE: extension/event
	register('event', function(element, model, config, delegation) {
		'use strict';

		Object.keys(config)
			.forEach(function(key) {
				var part = typeof config[key] === 'string' ? config[key].split('.') : [],
					scope = model;

				while (part.length) {
					if (part[0] in scope) {
						scope = scope[part[0]];
					}

					part.shift();
				}

				element.addEventListener(key, function(e) {
					if (typeof scope === 'function') {
						scope.apply(model, [e, model, config[key]]);
					}
					else if (typeof scope === 'object' && !(scope[config[key]] instanceof Array)) {
						Object.keys(config[key])
							.forEach(function(k) {
								var delegated = k in scope ? delegation(scope, k) : null;

								if (delegated) {
									delegated(config[key][k]);
								}
							})
						;
					}
				}, false);
			})
		;
	});

	//END INCLUDE: extension/event [109.41µs, 805.00bytes]
});
