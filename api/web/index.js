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

	next();
};

exports.register.attributes = require('./package.json');
