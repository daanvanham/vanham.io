'use strict';

function spoiler() {
	var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+='.split(''),
		result = [alphabet[Math.round(Math.random() * (alphabet.length - 1))]];

	while (result.length <= 5) {
		result.push(alphabet[Math.round(Math.random() * (alphabet.length - 1))]);
	}

	return result.join('');
}

module.exports = function(stream, devour) {
	return stream
		.pipe(devour.plugin('myth'))
		.pipe(devour.plugin('minify-css'))
		.pipe(devour.pipe('combine', 'css'))
		.pipe(devour.plugin('rename', devour.min))
		.pipe(devour.plugin('replace', /url\(\/static\/img/g, 'url(/static/' + spoiler() + '/img'))
		.pipe(devour.write('./css'));
};
