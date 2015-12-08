/* jshint browser:true */
/* global kx, kontext */
kx.ready(function() {
	'use strict';

	var version = 'v1',
		endpoint = '/api/' + version + '/blog',
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

	kx.event.add('.site-content', 'click', '.blog-item a', function(event) {
		var target = this,
			id = target.attributes['data-id'].value;

		event.preventDefault();

		if ((!history.state || ('id' in history.state && history.state.id !== id)) && window.location.pathname === '/') {
			history.pushState({id: id}, 'test', target.href.replace(window.location.href, ''));
		}

		kx.ajax.get({
			url: endpoint + '/' + id,
			success: function(status, response, xhr) {
				if (!blog) {
					blog = kontext.bind(response.result, detail);
				}
				else {
					Object.keys(response.result).forEach(function(key) {
						blog[key] = response.result[key];
					});
				}

				kx.style.addClass(document.querySelector('.site-header'), '-small');

				detail.style.display = 'block';
				list.style.display = 'none';

				window.scroll(0, 0);
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

	window.onpopstate = function(event) {
		if (!event.state || typeof event.state !== 'object' || !('id' in event.state)) {
			list.style.display = 'block';
			detail.style.display = 'none';

			kx.style.removeClass(document.querySelector('.site-header'), '-small');

			return true;
		}

		return document.querySelector('.blog-item a[data-id="' + event.state.id + '"]').click();
	};

	kontext.extension('html', function(element, model, key) {
		var template = element.appendChild(document.createElement('div'));

		model.delegation(key).on('update', function(model) {
			template.innerHTML = model[key];
		});

		template.innerHTML = model[key];
	});
});
