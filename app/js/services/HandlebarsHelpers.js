define(function() {

	'use strict';

	/**
	 * The handlebar helpers
	 * @namespace
	 */
	var HandlebarsHelpers = (function() {
		return {
			/**
			 * @function compare
			 * @description Compares two values
			 * @param {(string|number)} leftValue - the first value to compare.
			 * @param {string} operator - the operator to use.
			 * @param {(string|number)} rightValue - the second value to compare.
			 * @param {object} options - an object of options.
			 * @returns {boolean}
			 */
			compare: function(leftValue, operator, rightValue, options) {
				if (arguments.length < 3) throw new Error('Handlerbars Helper \'compare\' needs 2 parameters');

				if (typeof options === 'undefined') {
					options = rightValue;
					rightValue = operator;
					operator = '===';
				}

				var operators = {
					'==': function (left, right) { return left == right; },
					'===': function (left, right) { return left === right; },
					'!=': function (left, right) { return left != right; },
					'!==': function (left, right) { return left !== right; },
					'<': function (left, right) { return left < right; },
					'>': function (left, right) { return left > right; },
					'<=': function (left, right) { return left <= right; },
					'>=': function (left, right) { return left >= right; },
					'typeof': function (left, right) { return typeof left == right; }
				};

				if (!operators[operator]) throw new Error('Handlerbars Helper \'compare\' doesn\'t know the operator ' + operator);

				if (operators[operator](leftValue, rightValue)) {
					return options.fn(this);
				}
				return options.inverse(this);
			},
			/**
			 * @function https
			 * @description Turns an http url into https
			 * @param {object} options - an object of options.
			 * @returns {string}
			 */
			https: function(options) {
				return options.fn(this).replace('http://', 'https://');
			}
		};
	})();

	return HandlebarsHelpers;

});
