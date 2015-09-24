'use strict';

var del = require('del');

module.exports = function(stream, devour) {
	return del('./client/build');
};
