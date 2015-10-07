'use strict';

module.exports = function(stream, devour) {
	return stream
		.pipe(devour.plugin('myth'))
		.pipe(devour.plugin('minify-css'))
		.pipe(devour.pipe('combine', 'css'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.write('./css'));
};
