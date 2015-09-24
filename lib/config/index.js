'use strict';

function Config() {
	var config = this,
		fs = require('fs'),
		settings;

	function init() {
		settings = JSON.parse(fs.readFileSync('./config/' + (process.env.NODE_ENV || 'development') + '.json', {encoding: 'utf8'}));
	}

	config.get = function get(path) {
		var obj = settings;

		path.split('/').forEach(function(key) {
			if (key in obj) {
				return (obj = obj[key]);
			}

			throw new Error('Trying to get "' + path + '" but key "' + key + '" was not found');
		});

		return obj;
	};

	config.set = function set(path, value) {
		var keys = path.split('/'),
			last = keys.pop(),
			obj = settings;

		keys.forEach(function(key) {
			if (key in obj) {
				return (obj = obj[key]);
			}

			return (obj = obj[key] = {});
		});

		obj[last] = value;

		return config;
	};

	init();
}

module.exports = new Config();
