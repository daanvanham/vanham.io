'use strict';

const del = require('del');

module.exports = (stream, devour) => {
	return del('./client/build');
};
