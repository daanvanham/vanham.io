'use strict';

var sourcemaps = require('gulp-sourcemaps');

module.exports = function(stream, devour) {
	return stream
		.pipe(sourcemaps.init())
		.pipe(devour.write('./js'))
		.pipe(devour.plugin('uglify'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(sourcemaps.write('./'))
		.pipe(devour.write('./js'));
};
