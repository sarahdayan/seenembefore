define(['services/Validator'], function(Validator) {

	'use strict';

	/**
	 * The controller of the app
	 * @constructor
	 */
	var AppController = function(model, view) {
		this.model = model;
		this.view = view;
		this.DOM = this.view.children;

		this.validator = new Validator();

		this.init();
	};

	/**
	 * @function init
	 * @description Fires initial operations
	 */
	AppController.prototype.init = function() {
		this.setupHandlers()
			.enable();
	};

	/**
	 * @function setupHandlers
	 * @description Binds handlers to methods
	 * @returns {object}
	 */
	AppController.prototype.setupHandlers = function() {
		this.saveSearchHandler = this.saveSearch.bind(this);
		this.saveCharacterHandler = this.saveCharacter.bind(this);
		this.saveShowHandler = this.saveShow.bind(this);
		this.handleSetShowResponseHandler = this.handleSetShowResponse.bind(this);
		this.savePersonCreditsHandler = this.savePersonCredits.bind(this);
		return this;
	};

	/**
	 * @function enable
	 * @description Binds events to handlers
	 * @returns {object}
	 */
	AppController.prototype.enable = function() {
		this.view.inputUserSearchEvent.attach(this.saveSearchHandler);
		this.view.inputUserCharacterChoiceEvent.attach(this.saveCharacterHandler);
		this.model.setSearchEvent.attach(this.saveShowHandler);
		this.model.setShowEvent.attach(this.handleSetShowResponseHandler);
		this.model.setCharacterEvent.attach(this.savePersonCreditsHandler);
		return this;
	};

	/**
	 * @function execute
	 * @description Executes callbacks depending on status responses
	 * @param {object} status - the status with responses.
	 * @param {object} callbacks - the callbacks to execute according to the status responses.
	 */
	AppController.prototype.execute = function(status, callbacks) {
		for (var response in status.response) {
			callbacks[response]();
		}
	};

	/**
	 * @function saveSearch
	 * @description Gets user search input and saves the search
	 * @param {object} sender - the event's sender.
	 * @param {object} args - the event's arguments.
	 */
	AppController.prototype.saveSearch = function(sender, args) {
		this.model.setSearch({
			character: args.character,
			show: args.show
		});
	};

	/**
	 * @function saveShow
	 * @description Gets the search data and saves the show
	 */
	AppController.prototype.saveShow = function() {
		this.model.setShow(this.model.search.getShow());
	};

	/**
	 * @function saveCharacterMatches
	 * @description Find character matches in show cast and saves them
	 */
	AppController.prototype.saveCharacterMatches = function() {
		this.model.setCharacterMatches(this.model.findCharacterMatches());
	};

	/**
	 * @function saveCharacter
	 * @description Gets user choice and saves the character
	 * @param {object} sender - the event's sender.
	 * @param {object} args - the event's arguments.
	 */
	AppController.prototype.saveCharacter = function(sender, args) {
		this.model.setCharacter({
			id: args.id
		});
	};

	/**
	 * @function savePersonCredits
	 * @description Gets the selected character and saves the credits
	 */
	AppController.prototype.savePersonCredits = function() {
		this.model.setSelectedCredits(this.model.character.getSelected());
	};

	/*
	 * @function handleSetShowResponse
	 * @description Gets the response of setting a show and handles it
	 */
	AppController.prototype.handleSetShowResponse = function(sender, args) {
		var self = this;
		this.execute(args, {
			done: function() {
				self.saveCharacterMatches();
			},
			fail: function() {
				if (args.response.fail === 404) {
					// @todo handle
					console.log('show not found');
				}
				else {
					// @todo handle
					console.log('sorry something happened');
				}
			}
		});
	};

	return AppController;

});
