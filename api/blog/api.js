'use strict';

var status = require('hapi-status');

function API() {
	var api = this;

	api.index = function index(request, reply) {
		return status.ok(reply, [
			{
				id: '1223453',
				path: 'hallo-wereld',
				title: 'Hallo wereld!',
				content: 'Dit is een lang verhaal! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				created: '2015-10-01 18:00:00'
			},
			{
				id: '12763',
				path: 'hallo-wereld',
				title: 'Hallo wereld!',
				content: 'Dit is een lang verhaal! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				created: '2015-10-01 18:00:00'
			},
			{
				id: '1213463',
				path: 'hallo-wereld',
				title: 'Hallo wereld!',
				content: 'Dit is een lang verhaal! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				created: '2015-10-01 18:00:00'
			},
			{
				id: '12129763',
				path: 'hallo-wereld',
				title: 'Hallo wereld!',
				content: 'Dit is een lang verhaal! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				created: '2015-10-01 18:00:00'
			}
		]);
	};

	api.fetch = function fetch(request, reply) {
		return status.ok(reply, {
			id: '123',
			path: 'hallo-wereld',
			title: 'Zie hier!',
			content: 'Compleet andere tekst! Dat is gaaf! Dit is dus de detail pagina!',
			created: '2015-10-01 18:00:00'
		});
	};
}

module.exports = new API();
