'use strict';

module.exports = function(stream, devour) {
	return stream
		.pipe(devour.write('./html'))
		.pipe(devour.plugin('html-minifier'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.write('./html'));
};
