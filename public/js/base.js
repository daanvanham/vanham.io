/* jshint browser:true */
/* global kx, kontext, Prism */
kx.ready(function() {
	'use strict';

	var version = 'v1',
		endpoint = '/api/' + version + '/blog',
		cache = {},
		error = function(status, response, xhr) {
			console.error(status, response);
		},

		list, detail, blog;

	function load(type, file) {
		switch (type) {
			case 'script':
				var script = document.createElement('script');
				script.src = file;
				document.body.appendChild(script);
				break;

			case 'style':
				var style = document.createElement('link');
				style.rel = 'stylesheet';
				style.href = file;
				document.head.appendChild(style);
				break;
		}
	}

	function show(model) {
		if (!blog) {
			blog = kontext.bind(model, detail);
		}
		else {
			Object.keys(model).forEach(function(key) {
				blog[key] = model[key];
			});
		}

		kx.style.addClass(document.querySelector('.site-header'), '-small');

		detail.style.display = 'block';
		list.style.display = 'none';

		setTimeout(function() {
			Prism.highlightAll();
		}, 50);

		window.scroll(0, 0);
	}

	kx.ajax.get({
		url: '/template/detail',
		success: function(status, response, xhr) {
			document.querySelector('.site-content').innerHTML += response;

			list = document.querySelector('.blog-list');
			detail = document.querySelector('.blog-item.-detail');

			detail.style.display = 'none';

			kx.ajax.get({
				url: endpoint,
				success: function(status, response, xhr) {
					var anchor;

					kontext.bind({blogs: response.result}, list);

					if (window.location.pathname !== '/' && (anchor = document.querySelector('a[href="' + window.location.pathname + '"]')) === null) {
						history.replaceState(null, '', '/');
						window.location.href = '/404';
					}

					if (anchor) {
						anchor.click();
						list.style.display = 'none';
					}
				},

				error: error
			});
		},

		error: function(status, response, xhr) {

		}
	});

	kx.event.add('.site-content', 'click', '.blog-item a', function(event) {
		var target = this,
			id = target.attributes['data-id'].value;

		event.preventDefault();

		if ((!history.state || ('id' in history.state && history.state.id !== id)) && window.location.pathname === '/') {
			history.pushState({id: id}, 'test', target.href.replace(window.location.href, ''));
		}

		if (id in cache) {
			return show(cache[id]);
		}

		kx.ajax.get({
			url: endpoint + '/' + id,
			success: function(status, response, xhr) {
				cache[id] = Object.create(response.result);

				show(response.result);
			},

			error: error
		});
	});

	kx.event.add('.site-content', 'click', '.blog-item.-detail a:not([target])', function(event) {
		var fqdn    = /(?:[a-z]+:)?\/\/(?:[a-z0-9_-]+\.)?([a-z][a-z0-9_-]+\.[a-z]{2,6})(?:\/.*)?|\/.*|javascript:.*/i,
			link    = this.href.match(fqdn),
			current = window.location.href.match(fqdn);

		if (link && link.length > 1 && current && current.length > 1 && link[1] !== current[1] && window.open(this.href)) {
			event.preventDefault();
		}
	});

	window.onpopstate = function(event) {
		if (!event.state || typeof event.state !== 'object' || !('id' in event.state)) {
			list.style.display = 'block';
			detail.style.display = 'none';

			kx.style.removeClass(document.querySelector('.site-header'), '-small');

			return true;
		}

		return document.querySelector('.blog-item a[data-id="' + event.state.id + '"]').click();
	};
});
