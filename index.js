'use strict';

var Glue = require('glue'),
	Hoek = require('hoek'),
	Config = require('./lib/config'),
	manifest = Config.get('manifest'),
	handlebars = require('handlebars'),
	helper = require('./helper/handlebars.js'),
	server;

Glue.compose(manifest, {relativeTo: __dirname}, function(error, svr) {
	if (error) {
		throw new Error(error);
	}

	server = svr;

	server.register(require('vision'), function(err) {
		Hoek.assert(!err, err);

		server.views({
			engines: {
				html: handlebars
			},
			path: __dirname + '/public/html'
		});
	});

	if (!module.parent) {
		server.start(function(error) {
			console.log(' - server started at port ' + server.info.port);
		});
	}
});

module.exports = server;
