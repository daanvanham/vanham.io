'use strict';

var emoji = require('emoji-table').map(function(item) {
		return item.char;
	}),

	map = {};

module.exports = (stream, devour, type) => {
	var regex = type === 'css' ? /(\.[a-z0-9- .]+)(?:[a-z>\[\]: -]+)?{/g : /class="?([a-z0-9- ]+)"?/g;

	return stream.pipe(devour.plugin('replace', regex, function(match, className) {
		className.trim().split(' ').forEach(function(item) {
			if (type === 'css' && !/^\./.test(item)) {
				return;
			}

			item.replace(/\./, '').split('.').forEach(function(item) {
				if (!(item in map)) {
					map[item] = emoji.shift();
				}

				match = match.replace(item, map[item]);
			});
		});

		return match;
	}));
};
