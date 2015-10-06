/* jshint browser:true */
/* global kx, knot */
kx.ready(function() {
	'use strict';

	var version = 'v1';

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

	kx.event.add('.blog-list', 'click', '.blog-item a', function(event) {
		var target = this,
			id = target.attributes['data-id'].value;

		event.preventDefault();

		if (!history.state || ('id' in history.state && history.state.id !== id)) {
			history.pushState({id: id}, 'test', target.href);
		}

		kx.ajax.get({
			url: '/api/' + version + '/blog/' + id,
			success: function(status, response, xhr) {
				var detail = document.querySelector('.blog-detail');

				knot.tie(response.result, detail);
				detail.style.display = 'block';

				document.querySelector('.blog-list').style.display = 'none';
			},

			error: function(status, response, xhr) {

			}
		});

		return false;
	});

	kx.ajax.get({
		url: '/template/detail',
		success: function(status, response, xhr) {
			document.querySelector('.site-content').innerHTML += response;
			document.querySelector('.blog-detail').style.display = 'none';

			kx.ajax.get({
				url: '/api/' + version + '/blog',
				success: function(status, response, xhr) {
					knot.tie({blogs: response.result}, document.querySelector('.blog-list'));

					if (window.location.pathname) {
						window.onpopstate({state: history.state});
					}
				},

				error: function(status, response, xhr) {

				}
			});

			if (window.location.pathname) {
				document.querySelector('.blog-list').style.display = 'none';
			}
		},

		error: function(status, response, xhr) {

		}
	});

	window.onpopstate = function(event) {
		if (!event.state || typeof event.state !== 'object' || !('id' in event.state)) {
			document.querySelector('.blog-list').style.display = 'block';
			document.querySelector('.blog-detail').style.display = 'none';

			return true;
		}

		return document.querySelector('.blog-item a[data-id="' + event.state.id + '"]').click();
	};
});
