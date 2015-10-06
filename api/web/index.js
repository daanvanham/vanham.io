'use strict';

exports.register = function(server, options, next) {
	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply) {
			return reply.view('base');
		}
	});

	server.route({
		method: 'GET',
		path: '/{friendlyURL}',
		handler: function(request, reply) {
			return reply.view('base');
		}
	});

	server.route({
		method: 'GET',
		path: '/template/detail',
		handler: function(request, reply) {
			return reply.view('detail');
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
