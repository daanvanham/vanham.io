'use strict';

module.exports = function(stream, devour) {
	return stream
		.pipe(devour.write('./html'))
		.pipe(devour.plugin('minify-html'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.write('./html'));
};
