'use strict';

exports.register = function(server, options, next) {
	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply) {
			return reply.view('base').header('Content-Type', 'text/html; charset=utf-8');
		}
	});

	server.route({
		method: 'GET',
		path: '/404',
		handler: function(request, reply) {
			return reply.view('404').code(404).header('Content-Type', 'text/html; charset=utf-8');
		}
	});

	server.route({
		method: 'GET',
		path: '/{friendlyURL}',
		handler: function(request, reply) {
			return reply.view('base').header('Content-Type', 'text/html; charset=utf-8');
		}
	});

	server.route({
		method: 'GET',
		path: '/template/detail',
		handler: function(request, reply) {
			return reply.view('detail').header('Content-Type', 'text/html; charset=utf-8');
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
