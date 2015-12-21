/* jshint browser:true */
/* global kx, kontext, Prism */
kx.ready(function() {
	'use strict';

	var version = 'v1',
		endpoint = '/api/' + version + '/blog',
		cache = {},
		blog;

	function view(type) {
		document.querySelector('.site-header').setAttribute('data-state', type === 'detail' ? 'small' : '');
		document.querySelector('.blog-item[data-view="detail"]').style.display = type === 'detail' ? 'block' : 'none';
		document.querySelector('.blog-list').style.display = type === 'list' ? 'block' : 'none';
	}

	function show(model) {
		if (!blog) {
			blog = kontext.bind(model, document.querySelector('.blog-item[data-view="detail"]'));
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

	kx.ajax.get({
		url: '/template/detail',
		success: function(status, response, xhr) {
			document.querySelector('.site-content').innerHTML += response;

			view('list');

			kx.ajax.get({
				url: endpoint,
				success: function(status, response, xhr) {
					var anchor;

					kontext.bind({blogs: response.result}, document.querySelector('.blog-list'));

					if (window.location.pathname !== '/' && (anchor = document.querySelector('a[href="' + window.location.pathname + '"]')) === null) {
						history.replaceState(null, '', '/');
						window.location.href = '/this-is-not-the-webpage-you-are-looking-for';

						return;
					}

					if (anchor) {
						setTimeout(function() {
							anchor.click();
						}, 100);
					}
				}
			});
		}
	});

	kx.event.add('.site-content', 'click', '.blog-item:not([data-view="detail"]) a', function(event) {
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
			}
		});
	});

	kx.event.add('.profile-block a', 'click', function(event) {
		event.preventDefault();

		view('list');

		history.pushState(null, '', '/');
	});

	kx.event.add('.site-content', 'click', '.blog-item[data-view="detail"] a:not([target])', function(event) {
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

		return document.querySelector('.blog-item a[data-id="' + event.state.id + '"]').click();
	};
});
