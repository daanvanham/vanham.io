'use strict';

var alphabet = 'abcdefghijklmnopqrstuvwxyz',
	emoji = ['1F601','1F602','1F603','1F604','1F605','1F606','1F609','1F60A','1F60B','1F60C','1F60D','1F60F','1F612','1F613','1F614','1F616','1F618','1F61A','1F61C','1F61D','1F61E','1F620','1F621','1F622','1F623','1F624','1F625','1F628','1F629','1F62A','1F62B','1F62D','1F630','1F631','1F632','1F633','1F635','1F637','1F638','1F639','1F63A','1F63B','1F63C','1F63D','1F63E','1F63F','1F640','1F645','1F646','1F647','1F648','1F649','1F64A','1F64B','1F64C','1F64D','1F64E','1F64F'],
	map = {},
	count = 0;

module.exports = (stream, devour, type) => {
	var regex = type === 'css' ? /(\.[a-z0-9- .]+)(?:[a-z>\[\]: -]+)?{/g : /class="?([a-z0-9- ]+)"?/g;

	return stream.pipe(devour.plugin('replace', regex, function(match, className) {
		className.trim().split(' ').forEach(function(item) {
			if (type === 'css' && !/^\./.test(item)) {
				return;
			}

			item.replace(/\./, '').split('.').forEach(function(item) {
				if (!(item in map)) {
					// map[item] = alphabet[count++];
					map[item] = emoji[count++];
				}

				// match = match.replace(item, map[item]);
				match = match.replace(item, (type === 'css' ? '\\0' : '&#x') + map[item] + (type === 'css' ? ' ' : ''));
			});
		});

		return match;
	}));
};
