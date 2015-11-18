'use strict';

const Glue = require('glue'),
	Hoek = require('hoek'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	Config = require('./lib/config'),
	manifest = Config.get('manifest'),
	helper = require('./helper/handlebars.js');

let server;

fs.readdirSync('./api')
	.filter(item => {
		return fs.statSync('./api/' + item).isDirectory();
	})
	.forEach(item => {
		let plugin = {};

		plugin['./api/' + item] = [{
			select: ['web'],
			options: {}
		}];

		manifest.plugins.push(plugin);
	});

Glue.compose(manifest, {relativeTo: __dirname}, (error, svr) => {
	if (error) {
		throw new Error(error);
	}

	server = svr;
	mongoose.connect(Config.get('database/dsn'));

	server.register(require('vision'), err => {
		Hoek.assert(!err, err);

		server.views({
			engines: {
				html: require('handlebars')
			},
			path: __dirname + '/public/html'
		});
	});

	if (!module.parent) {
		server.start(error => {
			console.log(' - server started at port ' + server.info.port);
		});
	}
});

module.exports = server;
