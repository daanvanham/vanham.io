'use strict';

module.exports = (stream, devour, type, min) => {
	stream = stream
		.pipe(devour.pipe('order'))
		.pipe(devour.plugin('concat', 'combined.' + type));

	if (min) {
		stream = stream
			.pipe(devour.plugin(type === 'js' ? 'uglify' : 'minify-css'))
			.pipe(devour.plugin('rename', devour.min));
	}

	return stream;
};
