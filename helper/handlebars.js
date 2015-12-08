'use strict';

const handlebars = require('handlebars'),
	subresource = require('subresource'),
	fs = require('fs'),
	md5 = require('md5'),
	cache = {},
	dependencies = {
		development: {
			js: [
				'./public/js/konflux.js',
				'./public/js/kontext.js',
				'./public/js/base.js'
			],
			css: [
				'./public/css/layout.css',
				'./public/css/site-header.css',
				'./public/css/profile-block.css',
				'./public/css/blog-item.css',
				'./public/css/full-block.css',
				'./public/css/site-footer.css'
			],
			js: [
				'./public/js/ga.js'
			]
		},
		production: {
			js: [
				'./public/js/combined.min.js'
			],
			css: [
				'./public/css/combined.min.css'
			],
			js: [
				'./public/js/combined.min.js'
			]
		}
	};

function createTag(type, path) {
	let tag = [
		'crossorigin=anonymous',
		'integrity=' + cache[path].integrity,
		(type === 'js' ? 'src' : 'href') + '=' + path.replace(/\.\/public\/(?:cs|j)s/, '/static/' + cache[path].spoiler)
	];

	if (process.env.NODE_ENV === 'production' && type === 'js') {
		tag.push('async');
	}

	tag.unshift(type === 'css' ? '<link' : '<script');
	tag.push(type === 'css' ? 'rel=stylesheet />' : '></script>');

	return tag.join(' ');
}

Object.keys(dependencies[process.env.NODE_ENV || 'development']).forEach(type => {
	handlebars.registerHelper(type, function() {
		let html = '';

		dependencies[process.env.NODE_ENV || 'development'][type].forEach(path => {
			let data;

			if (!(path in cache)) {
				cache[path] = subresource(path);
				cache[path].spoiler = md5(fs.readFileSync(path)).substr(0, 5);
			}

			html += createTag(type, path);
		});

		return html;
	});
});
