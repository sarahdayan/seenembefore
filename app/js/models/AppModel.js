define(
	['services/Validator', 'services/Event', 'services/Api', 'models/Search',
	'models/Show', 'models/Character', 'jquery'],
	function(Validator, Event, Api, Search, Show, Character, $) {

	'use strict';

	/**
	 * The model of the app
	 * @constructor
	 */
	var AppModel = function(character, show) {
		this.search = new Search(character, show);
		this.show = new Show();
		this.character = new Character();

		this.api = new Api();
		this.validator = new Validator();

		this.setSearchEvent = new Event(this);
		this.setCharacterEvent = new Event(this);
		this.setShowEvent = new Event(this);
		this.setCharacterMatchesEvent = new Event(this);
		this.setSelectedCreditsEvent = new Event(this);
	};

	/**
	 * @function setSearch
	 * @description Sets search character and show
	 * @param {string} search.character - the character.
	 * @param {string} search.show - the show.
	 * @fires AppModel#setSearchEvent
	 */
	AppModel.prototype.setSearch = function(search) {
		this.search.setCharacter(search.character);
		this.search.setShow(search.show);
		this.setSearchEvent.notify();
	};

	/**
	 * @function setCharacter
	 * @description Sets selected character
	 * @param {number} character.id - the character's id.
	 * @fires AppModel#setCharacterEvent
	 */
	AppModel.prototype.setCharacter = function(character) {
		this.character.setSelected(character.id);
		this.setCharacterEvent.notify();
	};

	/**
	 * @function setCharacterMatches
	 * @description Sets matching characters
	 * @param {array} matches - the character matches.
	 * @fires AppModel#setCharacterMatchesEvent
	 */
	AppModel.prototype.setCharacterMatches = function(matches) {
		this.character.setMatches(matches);
		this.setCharacterMatchesEvent.notify();
	};

	/**
	 * @function setShow
	 * @description Sets show data from API call
	 * @param {string} show - the show's name.
	 * @fires AppModel#setShowEvent
	 */
	AppModel.prototype.setShow = function(show) {
		var self = this, response = {};
		this.api.singleSearch(show, ['cast'])
			.done(function(data) {
				self.show.setName(data.name);
				self.show.setId(data.id);
				self.show.setImdbId(data.externals.imdb);
				self.show.setCast(data._embedded.cast);
				response.done = data;
			})
			.fail(function(jqxhr, textStatus, error) {
				response.fail = jqxhr.status;
			})
			.always(function() {
				self.setShowEvent.notify({
					response: response
				});
			});
	};

	/**
	 * @function setSelectedCredits
	 * @description Sets credits data from API call
	 * @param {number} selected - the selected character's ID.
	 * @fires AppModel#setSelectedCreditsEvent
	 */
	AppModel.prototype.setSelectedCredits = function(selected) {
		var self = this;
		this.buildPersonCredits(selected)
			.done(function(personCredits) {
				self.character.setCredits([].slice.call(personCredits));
				self.setSelectedCreditsEvent.notify();
			});
	};

	/**
	 * @function buildPersonCredits
	 * @description Builds credits data from API call
	 * @param {number} personID - the person's ID.
	 * @returns {Promise}
	 */
	AppModel.prototype.buildPersonCredits = function(personID) {
		var self = this,
			promises = [],
			deferred = new $.Deferred();
		this.api.castCredits(personID, ['show'])
			.done(function(data) {
				data.forEach(function(credits) {
					var promise = self.findPersonCredits(credits);
					promises.push(promise);
				});
				$.when.apply($, promises).then(function() {
					deferred.resolve(arguments);
				});
			});
		return deferred.promise();
	};

	/**
	 * @function findCharacterMatches
	 * @description Finds character matches in show data
	 * @returns {array}
	 */
	AppModel.prototype.findCharacterMatches = function() {
		var self = this,
			matches = [];
		this.show.getCast().forEach(function(character) {
			if (self.validator.isIn(
				self.search.getCharacter().toLowerCase(),
				character.character.name.toLowerCase()
			)) matches.push(character.character.id);
		});
		return matches;
	};

	/**
	 * @function findPersonCredits
	 * @description Finds person's credits from API call
	 * @param {object} resource - the resource containing the necessary data.
	 * @returns {Promise}
	 */
	AppModel.prototype.findPersonCredits = function(resource) {
		var show = resource._embedded.show,
			deferred = new $.Deferred();
		$.getJSON(resource._links.character.href)
			.done(function(data) {
				deferred.resolve({
					id: data.name,
					name: data.name,
					image: data.image ? data.image.original : null,
					show: show
				});
			});
		return deferred.promise();
	};

	/**
	 * @function findCharacterById
	 * @description Finds character by ID
	 * @param {number} characterID - the character's ID.
	 * @returns {(object|number)}
	 */
	AppModel.prototype.findCharacterById = function(characterID) {
		for (var i = 0; i < this.show.getCast().length; i++) {
			if (this.show.getCast()[i].character.id === characterID) {
				return this.show.getCast()[i];
			}
		}
		return -1;
	};

	/**
	 * @function findPersonById
	 * @description Finds person by ID
	 * @param {number} personID - the person's ID.
	 * @returns {(object|number)}
	 */
	AppModel.prototype.findPersonById = function(personID) {
		for (var i = 0; i < this.show.getCast().length; i++) {
			if (this.show.getCast()[i].person.id === personID) {
				return this.show.getCast()[i].person;
			}
		}
		return -1;
	};

	return AppModel;

});
