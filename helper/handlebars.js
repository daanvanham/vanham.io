'use strict';

var handlebars = require('handlebars'),
	subresource = require('subresource'),
	cache = {},
	dependencies = {
		development: {
			js: [
				'./public/js/konflux.js',
				'./public/js/knot.js',
				'./public/js/base.js'
			],
			css: [
				'./public/css/layout.css'
			]
		},
		production: {
			js: [
				'./public/js/combined.min.js'
			],
			css: [
				'./public/css/combined.min.css'
			]
		}
	},
	createTag = function createTag(type, path) {
		var tag = ['crossorigin=anonymous', 'integrity=' + cache[path].integrity, (type === 'js' ? 'src' : 'href') + '=' + path.replace(/\.\/public\/(?:cs|j)s/, '/static')];

		tag.unshift(type === 'css' ? '<link' : '<script');
		tag.push(type === 'css' ? 'rel=stylesheet />' : '></script>');

		return tag.join(' ');
	};

Object.keys(dependencies[process.env.NODE_ENV || 'development']).forEach(function(type) {
	handlebars.registerHelper(type, function() {
		var html = '';

		dependencies[process.env.NODE_ENV || 'development'][type].forEach(function(path) {
			if (!(path in cache)) {
				cache[path] = subresource(path);
			}

			html += createTag(type, path);
		});

		return html;
	});
});
