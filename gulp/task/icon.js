'use strict';

module.exports = (stream, devour) => {
	return stream
		.pipe(devour.plugin('svg-sprite', {
			mode: {
				symbol: {
					dest: '',
					sprite: 'sprite.svg'
				}
			},
			shape: {
				id: {
					generator: '%s-icon'
				}
			}
		}))
		.pipe(devour.write('./img'));
};
