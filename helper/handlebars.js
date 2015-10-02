'use strict';

var handlebars = require('handlebars'),
	subresource = require('subresource'),
	cache = {},
	dependencies = {
		js: [
			'./public/js/konflux.js',
			// '//kon.fm/script/dev/knot-master.js',
			'./public/js/knot.js',
			'./public/js/base.js'
		],
		css: [
			'./public/css/layout.css'
		]
	},
	createTag = function createTag(type, path) {
		var tag = ['crossorigin=anonymous', 'integrity=' + cache[path].integrity, (type === 'js' ? 'src' : 'href') + '=' + path.replace(/\.\/public\/(?:cs|j)s/, '/static')];

		tag.unshift(type === 'css' ? '<link' : '<script');
		tag.push(type === 'css' ? 'rel=stylesheet />' : '></script>');

		return tag.join(' ');
	};

Object.keys(dependencies).forEach(function(type) {
	handlebars.registerHelper(type, function() {
		var html = '';

		dependencies[type].forEach(function(path) {
			if (!(path in cache)) {
				cache[path] = subresource(path);
			}

			html += createTag(type, path);
		});

		return html;
	});
});
