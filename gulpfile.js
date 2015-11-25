'use strict';

const Wanted = require('wanted'),
	Devour = require('devour'),
	gutil = require('gulp-util'),
	hjson = require('hjson'),
	fs = require('fs');

(wanted => {
	wanted
		.on('install', module => {
			//  accept all module installs/updates
			module.accept();

			gutil.log(
				'Wanted:',
				gutil.colors.magenta(module.name),
				gutil.colors.cyan(module.state),
				gutil.colors.yellow(module.version)
			);
		})

		.on('ready', () => {
			fs.readFile(__dirname + '/gulp/config/devour.json', (error, data) => {
				new Devour(hjson.parse(String(data)))
					.task('clean')
					.task('html',       ['./public/html/**/*.html', '!./public/html/**/*.min.html'])
					.task('script',     ['./public/js/**/*.js', '!./public/js/combined.min.js'])
					.task('style',      ['./public/css/**/*.css', '!./public/css/combined.min.css'])
					.start();
			});
		})

		.check({scope: 'devDependencies'});
})(new Wanted());
