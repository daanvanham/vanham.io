'use strict';

var Path = require('path');

exports.register = function(server, options, next) {
	server.route({
		method: 'GET',
		path: '/static/{path*}',
		handler: function(request, reply) {
			var file = request.params.path.split('.');

			return reply.file(Path.join(process.cwd(), 'public', file[1], request.params.path));
		},
		config: {
			cache: {
				expiresIn: 60 * 60 * 1000,
				privacy: 'private'
			}
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
