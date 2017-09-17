define(function() {

	'use strict';

	/**
	 * Represents an helper.
	 * @constructor
	 */
	var Helper = function() {};

	/**
	 * @function toHttps
	 * @description Turns an http url into https
	 * @param {function} url - a url to transform.
	 */
	Helper.prototype.toHttps = function(url) {
		return url.replace('http://', 'https://');
	};

	return Helper;

});
