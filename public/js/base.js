/* jshint browser:true */
/* global kx, knot */
kx.ready(function() {
	'use strict';

	var error = function(status, response, xhr) {
			console.error(status, response);
		},
		version = 'v1',
		endpoint = '/api/' + version + '/blog',
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

	kx.event.add('.site-content', 'click', '.blog-item a', function(event) {
		var target = this,
			id = target.attributes['data-id'].value;

		event.preventDefault();

		if (!history.state || ('id' in history.state && history.state.id !== id)) {
			history.pushState({id: id}, 'test', target.href.replace(window.location.href, ''));
		}

		kx.ajax.get({
			url: endpoint + '/' + id,
			success: function(status, response, xhr) {
				if (!blog) {
					blog = knot.tie(response.result, detail);
				}
				else {
					Object.keys(response.result).forEach(function(key) {
						blog[key] = response.result[key];
					});
				}

				detail.style.display = 'block';
				list.style.display = 'none';
			},

			error: error
		});

		return false;
	});

	kx.ajax.get({
		url: '/template/detail',
		success: function(status, response, xhr) {
			document.querySelector('.site-content').innerHTML += response;

			list = document.querySelector('.blog-list');
			detail = document.querySelector('.blog-detail');

			detail.style.display = 'none';

			kx.ajax.get({
				url: endpoint,
				success: function(status, response, xhr) {
					var anchor;

					knot.tie({blogs: response.result}, list);

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

	window.onpopstate = function(event) {
		if (!event.state || typeof event.state !== 'object' || !('id' in event.state)) {
			list.style.display = 'block';
			detail.style.display = 'none';

			return true;
		}

		return document.querySelector('.blog-item a[data-id="' + event.state.id + '"]').click();
	};

	knot.extension('html', function(element, model, key, delegation) {
		var delegated = delegation(model, key),
			template = document.createElement('div'),
			propagate = function(value) {
				template.innerHTML = value;
			};

		element.appendChild(template);

		if (delegated) {
			delegated.subscribe(propagate);
		}

		propagate(model[key]);
	});
});
