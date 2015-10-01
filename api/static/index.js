'use strict';

var Path = require('path');

exports.register = function(server, options, next) {
	server.route({
		method: 'GET',
		path: '/static/{path*}',
		handler: function(request, reply) {
			var file = request.params.path.split('.'),
				path = [process.cwd(), 'public'];

			if (['js', 'css'].indexOf(file[1]) !== -1) {
				path.push(file[1]);
			}

			path.push(request.params.path);

			return reply.file(Path.join(path.join('/')));
		},

		config: {
			cache: {
				expiresIn: 60 * 60 * 1000,
				privacy: 'private'
			},
			cors: {
				origin: [
					'https://vanham.io'
				]
			}
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
