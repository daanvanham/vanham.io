'use strict';

module.exports = (stream, devour) => {
	return stream
		.pipe(devour.plugin('minify-html'))
		.pipe(devour.pipe('selector', 'html'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.write('./html'));
};
