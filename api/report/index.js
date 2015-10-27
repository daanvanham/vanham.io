'use strict';

var Config = require(process.cwd() + '/lib/config'),
	mongoose = require('mongoose'),
	ReportModel = mongoose.model('report', new mongoose.Schema({
		'user-agent': String,
		version: Number,
		report: mongoose.Schema.Types.Mixed
	}));

/**
 * This route uses a fix for CSP2.0 where the Content-Type header is set to
 * application/csp-report. Since this currently results in a
 * 415 Unsupported Media Type, we set the config.payload.parse to false and
 * check ourselved. This handler is based on the gist:
 * https://gist.github.com/rspieker/8ab68c383c95fe3e306a
 */

exports.register = function(server, options, next) {
	server.route({
		method: 'POST',
		path: '/api/v1/report/csp',
		handler: function(request, reply) {
			var type = request.headers['content-type'].match(/^application\/(csp-report|json)$/),
				data = type ? JSON.parse(String(request.payload)) : null;

			if (!type || !data) {
				return reply();
			}

			new ReportModel({
				'user-agent': request.headers['user-agent'],
				version: type ? (type[1] === 'csp-report' ? 2 : 1) : null,
				report: data
			}).save(function(error) {
				reply();
			});
		},

		config: {
			payload: {
				parse: false
			}
		}
	});

	next();
};

exports.register.attributes = require('./package.json');
