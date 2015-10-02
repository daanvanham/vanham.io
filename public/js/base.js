/* jshint browser:true */
/* global kx, knot */
;(function() {
	'use strict';

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

	var version = 'v1';

	kx.ajax.get({
		url: '/api/' + version + '/blog',
			success: function(status, response, xhr) {
				// status:		200
				// response:	{result: [], statusCode: 200}

				knot.tie({blogs: response.result}, document.querySelector('.site-content'));
			},

			error: function(status, response, xhr) {
				// status:		404
				// response:	{error: 'Not Found', statusCode: 404}
			}
	});

	// kx.event.ready(function() {
	// 	setTimeout(function() {
	// 		load('script', '/static/knot.js');
	// 	}, 1000);
	// });
})();
