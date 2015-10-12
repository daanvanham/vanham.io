'use strict';

var handlebars = require('handlebars'),
	subresource = require('subresource'),
	cache = {},
	dependencies = {
		development: {
			css: [
				'./public/css/layout.css'
			]
		},
		production: {
			css: [
				'./public/css/combined.min.css'
			]
		}
	},
	createTag = function createTag(type, path) {
		var tag = ['crossorigin=anonymous', 'integrity=' + cache[path].integrity, (type === 'js' ? 'src' : 'href') + '=' + path.replace(/\.\/public\/(?:cs|j)s/, '/static')];

		if (process.env.NODE_ENV === 'production' && type === 'js') {
			tag.push('async');
		}

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
