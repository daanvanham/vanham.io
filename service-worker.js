/* global self, importScripts */
(global => {
	'use strict';

	importScripts('/sw-toolbox.js');

	global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
	global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

	global.toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
		cache: {
			name: 'vanham.io',
			maxEntries: 20,
			maxAgeSeconds: 86400
		}
	});
})(self);
