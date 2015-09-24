'use strict';

module.exports = function(stream, devour) {
	return stream
		.pipe(devour.plugin('myth'))
		.pipe(devour.write('./css'))
		.pipe(devour.plugin('minify-css'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.write('./css'));
};
