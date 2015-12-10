'use strict';

var emoji = require('emoji-table').map(function(item) {
		return item.char;
	}),

	map = {};

module.exports = (stream, devour, type) => {
	var regex;

	switch (type) {
		case 'html':
			regex = /class=(?:([a-z0-9-]+)|"([a-z0-9- ]+)")/g;
			break;

		case 'css':
			regex = /(\.[a-z0-9- .]+)(?:[a-z>\[\]\(\):=" -]+)?{/g;
			break;

		case 'js':
			regex = /(?:'|")(\.[a-z0-9- .]+)(?:[a-z\[\]\(\)>.=: -]+)?(?:'|")/g;
			break;
	}

	return stream.pipe(devour.plugin('replace', regex, function(match, className, htmlClassName) {
		(className || htmlClassName).trim().split(' ').forEach(function(item) {
			if ((type === 'css' || type === 'js') && !/^\./.test(item)) {
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
