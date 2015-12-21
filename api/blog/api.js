'use strict';

var status = require('hapi-status'),
	fs = require('fs'),
	Path = require('path'),
	marked = require('marked'),
	dummy = [
		{
			id: 'mjouv9o3bl61',
			path: '/styling-checkboxes',
			title: 'Styling checkboxes',
			intro: 'An easy yet not uncommon task the most of us have to deal with is the styling of form elements. In this small post I\'ll show you one of the many possible ways to accomplish this in a clean way.',
			content: marked(fs.readFileSync(Path.join(__dirname, 'item/styling-checkboxes.md'), 'utf8')),
			created: '2015-12-08 23:37:43'
		}
	].reverse();

function API() {
	var api = this;

	api.index = function index(request, reply) {
		return status.ok(reply, dummy);
	};

	api.fetch = function fetch(request, reply) {
		var result;

		if (/^[a-zA-Z0-9]{12}$/.test(request.params.id)) {
			result = dummy.filter(function(item) {
				return item.id === request.params.id;
			}).shift();
		}
		else {
			result = dummy.filter(function(item) {
				return item.path === '/' + request.params.id;
			}).shift();
		}

		if (result) {
			return status.ok(reply, result);
		}

		return status.notFound(reply);
	};
}

module.exports = new API();
