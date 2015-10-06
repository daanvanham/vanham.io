'use strict';

var Wanted = require('wanted'),
	Devour = require('devour'),
	gutil = require('gulp-util'),
	hjson = require('hjson'),
	fs = require('fs');

(function(wanted) {
	wanted
		.on('install', function(module) {
			//  accept all module installs/updates
			module.accept();

			gutil.log(
				'Wanted:',
				gutil.colors.magenta(module.name),
				gutil.colors.cyan(module.state),
				gutil.colors.yellow(module.version)
			);
		})

		.on('ready', function() {
			fs.readFile(__dirname + '/gulp/config/devour.json', function(error, data) {
				new Devour(hjson.parse(String(data)))
					.task('clean')
					.task('html',       './public/html/**/*.html')
					.task('script',     './public/js/**/*.js')
					.task('style',      './public/css/**/*.css')
					.start();
			});
		})

		.check({scope: 'devDependencies'});
})(new Wanted());
