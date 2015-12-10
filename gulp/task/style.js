'use strict';

const Path = require('path'),
	md5 = require('md5'),
	fs = require('fs');

function spoiler(match, file) {
	return 'url(/static/' + md5(fs.readFileSync(Path.join(process.cwd(), 'public/img', file))).substr(0, 5) + '/img' + file + ')';
}

module.exports = (stream, devour) => {
	return stream
		.pipe(devour.plugin('myth'))
		.pipe(devour.plugin('minify-css'))
		.pipe(devour.pipe('combine', 'css'))
		.pipe(devour.pipe('selector', 'css'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.plugin('replace', /url\(\/static\/img([a-zA-Z\/\.]+)\)/g, spoiler))
		.pipe(devour.write('./css'));
};
