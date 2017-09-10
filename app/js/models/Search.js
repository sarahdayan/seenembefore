define(['services/Validator', 'services/Event'], function(Validator, Event) {

	'use strict';

	/**
	 * Represents a user search.
	 * @constructor
	 */
	var Search = function() {
		this.character = {
			value: null,
			validator: ['isString', 'isNotEmpty']
		};
		this.show = {
			value: null,
			validator: ['isString', 'isNotEmpty']
		};

		this.validator = new Validator();

		this.setCharacterEvent = new Event(this);
		this.setShowEvent = new Event(this);
	};

	/**
	 * @function set
	 * @description Validate then set a value with {@link Validator}
	 * @param {mixed} value - the value to validate then set.
	 * @param {mixed} key - the key to assign the value to.
	 * @returns {boolean}
	 */
	Search.prototype.set = function(value, key) {
		if (this.validator.validate(value, key.validator)) {
			key.value = value;
			return true;
		}
		return false;
	};

	/**
	 * @function setCharacter
	 * @description Sets a character
	 * @param {string} character - the character.
	 * @fires Search#setCharacterEvent
	 */
	Search.prototype.setCharacter = function(character) {
		this.set(character, this.character);
		this.setCharacterEvent.notify();
	};

	/**
	 * @function getCharacter
	 * @description Gets a character
	 * @returns {string}
	 */
	Search.prototype.getCharacter = function() {
		return this.character.value;
	};

	/**
	 * @function setShow
	 * @description Sets a show
	 * @param {string} show - the show.
	 * @fires Search#setShowEvent
	 */
	Search.prototype.setShow = function(show) {
		this.set(show, this.show);
		this.setShowEvent.notify();
	};

	/**
	 * @function getShow
	 * @description Gets a show
	 * @returns {string}
	 */
	Search.prototype.getShow = function() {
		return this.show.value;
	};

	return Search;

});
