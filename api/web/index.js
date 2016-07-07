'use strict';

function handler(view) {
	if (process.env.NODE_ENV === 'production') {
		view += '.min.html';
	}

	return (request, reply) => {
		reply.view(view).header('Content-Type', 'text/html; charset=utf-8');
	};
}

exports.register = (server, options, next) => {
	server.route({
		method: 'GET',
		path: '/',
		handler: handler('base')
	});

	server.route({
		method: 'GET',
		path: '/404',
		handler: handler('404')
	});

	server.route({
		method: 'GET',
		path: '/this-is-not-the-webpage-you-are-looking-for',
		handler: handler('404')
	});

	server.route({
		method: 'GET',
		path: '/{friendlyURL}',
		handler: handler('base')
	});

	server.route({
		method: 'GET',
		path: '/template/detail',
		handler: handler('detail')
	});

	/* ServiceWorker routes */
	server.route({
		method: 'GET',
		path: '/service-worker.js',
		handler: function(request, reply) {
			reply.file('service-worker.js');
		}
	});

	server.route({
		method: 'GET',
		path: '/sw-toolbox.js',
		handler: function(request, reply) {
			reply.file('node_modules/sw-toolbox/sw-toolbox.js');
		}
	});

	server.route({
		method: 'GET',
		path: '/manifest.json',
		handler: function(request, reply) {
			reply.file('manifest.json');
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
