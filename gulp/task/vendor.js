'use strict';

module.exports = (stream, devour) => {
	return stream
		.pipe(devour.plugin('uglify'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.write('./js/vendor'));
};
