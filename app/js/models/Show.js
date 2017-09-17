define(
	['services/Event', 'services/Validator'],
	function(Event, Validator) {

	'use strict';

	/**
	 * Represents a show.
	 * @constructor
	 */
	var Show = function() {
		this.name = {
			value: null,
			validator: ['isString', 'isNotEmpty']
		};
		this.id = {
			value: null,
			validator: ['isInt', 'isNotEmpty']
		};
		this.imdbId = {
			value: null,
			validator: ['isString', 'isNotEmpty']
		};
		this.cast = {
			value: {},
			validator: ['isNotEmpty']
		};

		this.validator = new Validator();

		this.setNameEvent = new Event(this);
		this.setIdEvent = new Event(this);
		this.setCastEvent = new Event(this);
		this.setImdbIdEvent = new Event(this);
	};

	/**
	 * @function set
	 * @description Validate then set a value with {@link Validator}
	 * @param {mixed} value - the value to validate then set.
	 * @param {mixed} key - the key to assign the value to.
	 * @returns {boolean}
	 */
	Show.prototype.set = function(value, key) {
		if (this.validator.validate(value, key.validator)) {
			key.value = value;
			return true;
		}
		return false;
	};

	/**
	 * @function setName
	 * @description Sets a name
	 * @param {string} name - the name.
	 * @fires Show#setNameEvent
	 */
	Show.prototype.setName = function(name) {
		this.set(name, this.name);
		this.setNameEvent.notify();
	};

	/**
	 * @function getName
	 * @description Gets a name
	 * @returns {string}
	 */
	Show.prototype.getName = function() {
		return this.name.value;
	};

	/**
	 * @function setId
	 * @description Sets an id
	 * @param {number} id - the id.
	 * @fires Show#setIdEvent
	 */
	Show.prototype.setId = function(id) {
		this.set(id, this.id);
		this.setIdEvent.notify();
	};

	/**
	 * @function getId
	 * @description Gets an id
	 * @returns {number}
	 */
	Show.prototype.getId = function() {
		return this.id.value;
	};

	/**
	 * @function setImdbId
	 * @description Sets the IMDB id
	 * @param {number} imdbId - the imdbId.
	 * @fires Show#setImdbIdEvent
	 */
	Show.prototype.setImdbId = function(imdbId) {
		this.set(imdbId, this.imdbId);
		this.setImdbIdEvent.notify();
	};

	/**
	 * @function getImdbId
	 * @description Gets an id
	 * @returns {number}
	 */
	Show.prototype.getImdbId = function() {
		return this.imdbId.value;
	};

	/**
	 * @function setCast
	 * @description Sets a cast
	 * @param {object} cast - the cast.
	 * @fires Show#setCastEvent
	 */
	Show.prototype.setCast = function(cast) {
		this.set(cast, this.cast);
		this.setCastEvent.notify();
	};

	/**
	 * @function getCast
	 * @description Gets a cast
	 * @returns {object}
	 */
	Show.prototype.getCast = function() {
		return this.cast.value;
	};

	return Show;

});
