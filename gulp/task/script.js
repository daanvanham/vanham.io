'use strict';

module.exports = (stream, devour) => {
	return stream
		.pipe(devour.plugin('sourcemaps').init())
		.pipe(devour.pipe('combine', 'js'))
		.pipe(devour.plugin('uglify'))
		.pipe(devour.pipe('selector', 'js'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.plugin('sourcemaps').write('./'))
		.pipe(devour.write('./js'));
};
