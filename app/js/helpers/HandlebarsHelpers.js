define(function() {

	var HandlebarsHelpers = (function() {
		return {
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
			}
		}
	})();

	return HandlebarsHelpers;

});
