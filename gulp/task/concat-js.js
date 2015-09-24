'use strict';

module.exports = function(stream, devour) {
	return stream
		.pipe(devour.plugin('concat', 'bundle.js'))
		.pipe(devour.write('./js'))
		.pipe(devour.plugin('uglify'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.write('./js'));
};
