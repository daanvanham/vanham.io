'use strict';

const Path = require('path');

exports.register = (server, options, next) => {
	server.route({
		method: 'GET',
		path: '/static/{spoiler}/{path*}',
		handler: (request, reply) => {
			let file = request.params.path.split('.'),
				path = [process.cwd(), 'public'],
				type = file[file.length - 1];

			if (['js', 'css'].indexOf(type) !== -1) {
				path.push(file[file.length - 1]);
			}

			if (request.params.spoiler === 'img') {
				// if img and cache spoiler is missing just return the image
				request.params.path = 'img/' + request.params.path;
			}

			path.push(request.params.path);

			return reply.file(Path.join.apply(Path, path));
		},

		config: {
			cache: {
				expiresIn: 60 * 60 * 1000 * 24 * 7,
				privacy: 'private'
			},
			cors: {
				origin: [
					'https://vanham.io'
				]
			},
			plugins: {
				blankie: {
					styleSrc: ['self', 'unsafe-inline'],
					reportUri: '/api/1.0.0/csp/report'
				}
			}
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
