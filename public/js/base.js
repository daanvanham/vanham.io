/* global kx, kontext, Prism */
kx.ready(function() {
	'use strict';

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js');
	}

	var version = 'v1',
		endpoint = '/api/' + version + '/blog',
		cache = {},
		blog;

	function view(type) {
		document.body.setAttribute('data-state', type === 'detail' ? 'small' : '');
	}

	function loadList() {
		kx.ajax.get({
			url: endpoint,
			success: function(status, response) {
				var anchor;

				kontext.bind({blogs: response.result}, document.querySelector('body > section'));
			}
		});
	}

	function error(status, response) {
		if (status === 404) {
			history.replaceState(null, '', '/');
			window.location.href = '/this-is-not-the-webpage-you-are-looking-for';

			return;
		}
	}

	function show(model) {
		if (!blog) {
			blog = kontext.bind(model, document.querySelector('[data-view="detail"]'));
		}
		else {
			Object.keys(model).forEach(function(key) {
				blog[key] = model[key];
			});
		}

		view('detail');

		setTimeout(function() {
			Prism.highlightAll();
		}, 50);
	}

	if (window.location.pathname === '/') {
		view('list');
		loadList();
	}
	else {
		kx.ajax.get({
			url: endpoint + window.location.pathname,
			success: function(status, response) {
				show(response.result);
				loadList();
			},

			error: error
		});
	}

	kx.event.add('body > section', 'click', 'article a', function(event) {
		var target = this,
			id = target.getAttribute('data-id');

		event.preventDefault();

		if ((!history.state || ('id' in history.state && history.state.id !== id)) && window.location.pathname === '/') {
			history.pushState({id: id}, '', target.href.replace(window.location.href, ''));
		}

		if (id in cache) {
			return show(cache[id]);
		}

		kx.ajax.get({
			url: endpoint + '/' + id,
			success: function(status, response) {
				cache[id] = Object.create(response.result);

				show(response.result);
			},

			error: error
		});
	});

	kx.event.add('body > header a', 'click', function(event) {
		event.preventDefault();

		view('list');

		history.pushState(null, '', '/');
	});

	kx.event.add('body', 'click', '[data-view="detail"] a:not([target])', function(event) {
		var fqdn    = /(?:[a-z]+:)?\/\/(?:[a-z0-9_-]+\.)?([a-z][a-z0-9_-]+\.[a-z]{2,6})(?:\/.*)?|\/.*|javascript:.*/i,
			link    = this.href.match(fqdn),
			current = window.location.href.match(fqdn);

		if (link && link.length > 1 && current && current.length > 1 && link[1] !== current[1] && window.open(this.href)) {
			event.preventDefault();
		}
	});

	window.onpopstate = function(event) {
		if (!event.state || typeof event.state !== 'object' || !('id' in event.state)) {
			return view('list');
		}

		return document.querySelector('article a[data-id="' + event.state.id + '"]').click();
	};
});
