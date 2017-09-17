define(
	['services/Event', 'services/Validator'],
	function(Event, Validator) {

	'use strict';

	/**
	 * Represents a character
	 * @constructor
	 */
	var Character = function() {
		this.matches = {
			value: [],
			validator: ['isArray', 'isNotEmpty']
		};
		this.selected = {
			value: null,
			validator: ['isInt', 'isNotEmpty'],
			credits: {
				value: [],
				validator: ['isArray', 'isNotEmpty']
			}
		};

		this.validator = new Validator();

		this.setMatchesEvent = new Event(this);
		this.setSelectedEvent = new Event(this);
		this.setSelectedCreditsEvent = new Event(this);
	};

	/**
	 * @function set
	 * @description Validate then set a value with {@link Validator}
	 * @param {mixed} value - the value to validate then set.
	 * @param {mixed} key - the key to assign the value to.
	 * @returns {boolean}
	 */
	Character.prototype.set = function(value, key) {
		if (this.validator.validate(value, key.validator)) {
			key.value = value;
			return true;
		}
		return false;
	};

	/**
	 * @function setMatches
	 * @description Sets matching characters
	 * @param {array} matches - the matches.
	 * @fires Character#setMatchesEvent
	 */
	Character.prototype.setMatches = function(matches) {
		this.set(matches, this.matches);
		this.setMatchesEvent.notify();
	};

	/**
	 * @function getMatches
	 * @description Gets matching characters
	 * @returns {array}
	 */
	Character.prototype.getMatches = function() {
		return this.matches.value;
	};

	/**
	 * @function setSelected
	 * @description Sets selected character
	 * @param {number} characterID - the character's id.
	 * @fires Character#setSelectedEvent
	 */
	Character.prototype.setSelected = function(characterID) {
		this.set(characterID, this.selected);
		this.setSelectedEvent.notify();
	};

	/**
	 * @function getSelected
	 * @description Gets selected character
	 * @returns {number}
	 */
	Character.prototype.getSelected = function() {
		return this.selected.value;
	};

	/**
	 * @function setCredits
	 * @description Sets credits
	 * @param {array} credits - the credits.
	 * @fires Character#setSelectedCreditsEvent
	 */
	Character.prototype.setCredits = function(credits) {
		this.set(credits, this.selected.credits);
		this.setSelectedCreditsEvent.notify();
	};

	/**
	 * @function getCredits
	 * @description Gets credits
	 * @returns {array}
	 */
	Character.prototype.getCredits = function() {
		return this.selected.credits.value;
	};

	return Character;

});
