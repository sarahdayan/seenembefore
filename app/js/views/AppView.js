define(
	['jquery', 'autosize-input', 'views/Carousel',
	'services/Event', 'views/Layout', 'typekit'],
	function($, AutosizeInput, Carousel, Event, Layout, Typekit) {

	'use strict';

	/**
	 * The view of the app
	 * @constructor
	 */
	var AppView = function(model) {
		this.model = model;
		this.children = {};

		this.layout = new Layout();

		this.inputUserSearchEvent = new Event(this);
		this.inputUserCharacterChoiceEvent = new Event(this);

		this.init();
	};

	/**
	 * @function init
	 * @description Fires initial operations
	 */
	AppView.prototype.init = function() {
		this.createChildren()
			.initLayout()
			.setupHandlers()
			.enable();
	};

	/**
	 * @function createChildren
	 * @description Stores DOM nodes
	 * @returns {object}
	 */
	AppView.prototype.createChildren = function() {
		this.children.$document = $(document);

		this.children.characterInputSelector = '.js-form__character';
		this.children.showInputSelector = '.js-form__show';
		this.children.submitButtonSelector = '.js-form__submit';
		this.children.personButtonSelector = '.js-person';
		this.children.newSearchSelector = '.js-newSearch';

		return this;
	};

	/**
	 * @function setupHandlers
	 * @description Binds handlers to methods
	 * @returns {object}
	 */
	AppView.prototype.setupHandlers = function() {
		this.submitButtonHandler = this.inputUserSearch.bind(this);
		this.personButtonHandler = this.inputUserCharacterChoice.bind(this);
		this.newSearchHandler = this.renderForm.bind(this);
		this.setSearchEventHandler = this.renderSearch.bind(this);
		this.setCharacterMatchesEventHandler = this.renderQuery.bind(this);
		this.setCharacterEventHandler = this.renderChoice.bind(this);
		this.setSelectedCreditsHandler = this.renderResults.bind(this);
		return this;
	};

	/**
	 * @function enable
	 * @description Binds events to handlers
	 * @returns {object}
	 */
	AppView.prototype.enable = function() {
		this.children.$document.on('click', this.children.submitButtonSelector, this.submitButtonHandler);
		this.children.$document.on('click', this.children.personButtonSelector, this.personButtonHandler);
		this.children.$document.on('click', this.children.newSearchSelector, this.newSearchHandler);
		this.model.setSearchEvent.attach(this.setSearchEventHandler);
		this.model.setCharacterMatchesEvent.attach(this.setCharacterMatchesEventHandler);
		this.model.setCharacterEvent.attach(this.setCharacterEventHandler);
		this.model.setSelectedCreditsEvent.attach(this.setSelectedCreditsHandler);
		return this;
	};

	/**
	 * @function initLayout
	 * @description Fires initial layout operations
	 * @returns {object}
	 */
	AppView.prototype.initLayout = function() {
		var self = this;
		$(this.children.characterInputSelector).attr('placeholder', this.model.search.getCharacter());
		$(this.children.showInputSelector).attr('placeholder', this.model.search.getShow());
		Typekit.load({
			async: true,
			active: function() {
				setTimeout(function() {
					autosizeInput($(self.children.characterInputSelector).get(0));
					autosizeInput($(self.children.showInputSelector).get(0));
					self.renderForm();
					$(self.children.characterInputSelector).focus();
				}, 500);
			}
		});
		return this;
	};

	/**
	 * @function renderSearch
	 * @description Renders the search area
	 * @returns {object}
	 */
	AppView.prototype.renderSearch = function() {
		this.layout.displaySection('search', this.model.search);
		return this;
	};

	/**
	 * @function renderForm
	 * @description Renders the form area
	 * @returns {object}
	 */
	AppView.prototype.renderForm = function() {
		this.layout.showSection('form');
		return this;
	};

	/**
	 * @function renderQuery
	 * @description Renders the query area
	 * @returns {object}
	 */
	AppView.prototype.renderQuery = function() {
		var self = this, characters = [];
		this.model.character.getMatches().forEach(function(match) {
			characters.push(self.model.findCharacterById(match));
		});
		if (characters.length > 0) {
			this.layout.displaySection('query', {
				entry: characters,
				show: this.model.show.getName()
			});
		}
		else {
			this.layout.displaySection('search', {
				show: this.model.show.getName(),
				imdbId: this.model.show.getImdbId()
			});
		}
		return this;
	};

	/**
	 * @function renderChoice
	 * @description Renders the choice area
	 * @returns {object}
	 */
	AppView.prototype.renderChoice = function() {
		this.layout.displaySection('choice', {
			person: this.model.findPersonById(this.model.character.getSelected())
		});
		return this;
	};

	/**
	 * @function renderResults
	 * @description Renders the results area
	 * @returns {object}
	 */
	AppView.prototype.renderResults = function() {
		var credits = this.model.character.getCredits(),
			person = this.model.findPersonById(this.model.character.getSelected());
		if (credits.length > 1) {
			this.layout.displaySection('results', {
				person: person.name,
				show: this.model.show.getId(),
				entry: this.model.character.getCredits()
			});
			var carousel = new Carousel($('#carousel'));
		}
		else {
			this.layout.displaySection('choice');
		}
		return this;
	};

	/**
	 * @function inputUserSearch
	 * @description Notifies user input search to every listener
	 * @param {object} event - the caller's event.
	 * @fires AppView#inputUserSearchEvent
	 */
	AppView.prototype.inputUserSearch = function(event) {
		event.preventDefault();
		this.inputUserSearchEvent.notify({
			character: $(this.children.characterInputSelector).val(),
			show: $(this.children.showInputSelector).val()
		});
	};

	/**
	 * @function inputUserCharacterChoice
	 * @description Notifies user input character choice to every listener
	 * @param {object} event - the caller's event.
	 * @fires AppView#inputUserCharacterChoiceEvent
	 */
	AppView.prototype.inputUserCharacterChoice = function(event) {
		this.inputUserCharacterChoiceEvent.notify({
			id: $(event.currentTarget).data('id')
		});
	};

	return AppView;

});
