'use strict';

var api = require('./api'),
	base = '/api/v1/blog',
	Joi = require('joi');

exports.register = function(server, options, next) {
	server.route({
		method: 'GET',
		path: base,
		handler: api.index
	});

	server.route({
		method: 'GET',
		path: base + '/{id}',
		handler: api.fetch
	});

	next();
};

exports.register.attributes = require('./package.json');
