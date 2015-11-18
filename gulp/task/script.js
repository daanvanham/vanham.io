'use strict';

const sourcemaps = require('gulp-sourcemaps');

module.exports = (stream, devour) => {
	return stream
		.pipe(sourcemaps.init())
		.pipe(devour.write('./js'))
		.pipe(devour.pipe('combine', 'js'))
		.pipe(devour.plugin('uglify'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(sourcemaps.write('./'))
		.pipe(devour.write('./js'));
};
