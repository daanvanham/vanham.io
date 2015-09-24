'use strict';

exports.register = function(server, options, next) {
	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply) {
			return reply.view('base');
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
