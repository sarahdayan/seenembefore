define(function() {

	'use strict';

	/**
	 * Represents a validator.
	 * @constructor
	 */
	var Validator = function() {};

	/**
	 * @function validate
	 * @description Validate a value against a set of rules
	 * @param {mixed} value - the value to validate.
	 * @param {array} rules - the rules to validate the value against.
	 * @returns {boolean}
	 */
	Validator.prototype.validate = function(value, rules) {
		var self = this,
			argument = null;
		return rules.every(function(rule) {
			if (Array.isArray(rule)) {
				argument = rule[1];
				rule = rule[0];
			}
			return self[rule](value, argument);
		});
	};

	/**
	 * @function isString
	 * @description Checks if value is a string
	 * @param {mixed} value - the value to validate.
	 * @returns {boolean}
	 */
	Validator.prototype.isString = function(value) {
		if (typeof value === 'string') {
			return true;
		}
		return false;
	};

	/**
	 * @function isArray
	 * @description Checks if value is an array
	 * @param {mixed} value - the value to validate.
	 * @returns {boolean}
	 */
	Validator.prototype.isArray = function(value) {
		return Array.isArray(value);
	};

	/**
	 * @function isNotEmpty
	 * @description Checks if value exists and isn't empty
	 * @param {mixed} value - the value to validate.
	 * @returns {boolean}
	 */
	Validator.prototype.isNotEmpty = function(value) {
		if (value.length > 0 && value !== '' &&
			value !== null && typeof value !== 'undefined') {
			return true;
		}
		return false;
	};

	/**
	 * @function isInt
	 * @description Checks if value is integer
	 * @param {mixed} value - the value to validate.
	 * @returns {boolean}
	 */
	Validator.prototype.isInt = function(value) {
		return Number.isInteger(value);
	};

	/**
	 * @function isEqualTo
	 * @description Checks if value is equal to another
	 * @param {mixed} value - the value to validate.
	 * @param {mixed} test - the value to test the value against.
	 * @returns {boolean}
	 */
	Validator.prototype.isEqualTo = function(value, test) {
		return value === test;
	};

	/**
	 * @function isIn
	 * @description Checks if value is a subset of another
	 * @param {mixed} value - the value to validate.
	 * @param {mixed} haystack - the value to look for the value in.
	 * @returns {boolean}
	 */
	Validator.prototype.isIn = function(value, haystack) {
		return haystack.indexOf(value) !== -1;
	};

	/**
	 * @function hasMinLength
	 * @description Checks if value has a minimum length
	 * @param {mixed} value - the value to validate.
	 * @param {number} length - the minimum length to test the value for.
	 * @returns {boolean}
	 */
	Validator.prototype.hasMinLength = function(value, length) {
		return value.length >= length;
	};

	/**
	 * @function hasMaxLength
	 * @description Checks if value has a maximum length
	 * @param {mixed} value - the value to validate.
	 * @param {number} length - the maximum length to test the value for.
	 * @returns {boolean}
	 */
	Validator.prototype.hasMaxLength = function(value, length) {
		return value.length <= length;
	};

	/**
	 * @function hasMinValue
	 * @description Checks if value is greater or equal to a minimum value
	 * @param {number} value - the value to validate.
	 * @param {number} length - the minimum value to compare the value with.
	 * @returns {boolean}
	 */
	Validator.prototype.hasMinValue = function(value, minValue) {
		return value >= minValue;
	};

	/**
	 * @function hasMaxValue
	 * @description Checks if value is lower or equal to a maximum value
	 * @param {number} value - the value to validate.
	 * @param {number} length - the maximum value to compare the value with.
	 * @returns {boolean}
	 */
	Validator.prototype.hasMaxValue = function(value, maxValue) {
		return value <= maxValue;
	};

	return Validator;

});
