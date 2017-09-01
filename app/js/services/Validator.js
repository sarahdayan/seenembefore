define(function() {

	var Validator = function() {};

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

	Validator.prototype.isString = function(value) {
		if (typeof value === 'string') {
			return true;
		}
		return false;
	};

	Validator.prototype.isArray = function(value) {
		return Array.isArray(value);
	};

	Validator.prototype.isNotEmpty = function(value) {
		if (value !== '' && value !== null && typeof value !== 'undefined') {
			return true;
		}
		return false;
	};

	Validator.prototype.isInt = function(value) {
		return Number.isInteger(value);
	};

	Validator.prototype.isEqualTo = function(value, test) {
		return value === test;
	};

	Validator.prototype.isIn = function(value, haystack) {
		return haystack.indexOf(value) !== -1;
	};

	Validator.prototype.hasMinLength = function(value, length) {
		return value.length >= length;
	};

	Validator.prototype.hasMaxLength = function(value, length) {
		return value.length <= length;
	};

	Validator.prototype.hasMinValue = function(value, minValue) {
		return value.length >= minValue;
	};

	Validator.prototype.hasMaxValue = function(value, maxValue) {
		return value.length <= maxValue;
	};

	return Validator;

});
