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
					.task('concat-js', './client/src/js/**/*.js', false)
					.task('concat-css', './client/src/css/**/*.css', false)
					.task('html', './client/src/html/**/*.html')
					.task('script', './client/src/js/**/*.js')
					.task('style', './client/src/css/**/*.css')
					.start();
			});
		})

		.check({scope: 'devDependencies'});
})(new Wanted());
