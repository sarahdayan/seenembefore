define(
	['helpers/HandlebarsHelpers', 'services/Event',
	'jquery', 'handlebars', 'autosize-input', 'typekit', 'views/Carousel'],
	function(HandlebarsHelpers, Event, $, Handlebars, AutosizeInput, Typekit, Carousel) {

	'use strict';

	/**
	 * The view of the app
	 * @constructor
	 */
	var AppView = function(model) {
		this.model = model;
		this.children = {};

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
			.applyStyles()
			.registerHelpers()
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
		this.children.$characterInput = $('#character');
		this.children.$showInput = $('#show');
		this.children.$submitButton = $('#submit');
		this.children.$formArea = $('#form');
		this.children.$searchArea = $('#search');
		this.children.$queryArea = $('#query');
		this.children.$resultsArea = $('#results');

		this.children.personButtonSelector = '.js-person';

		/**
		 * @todo Externalize this
		 */
		this.children.searchTemplate = Handlebars.compile($('#search-template').html());
		this.children.queryTemplate = Handlebars.compile($('#query-template').html());
		this.children.resultsTemplate = Handlebars.compile($('#results-template').html());

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
		this.setSearchEventHandler = this.renderSearch.bind(this);
		this.setCharacterMatchesEventHandler = this.renderQuery.bind(this);
		this.setSelectedCreditsHandler = this.renderResults.bind(this);
		return this;
	};

	/**
	 * @function enable
	 * @description Binds events to handlers
	 * @returns {object}
	 */
	AppView.prototype.enable = function() {
		this.children.$submitButton.click(this.submitButtonHandler);
		this.children.$document.on('click', this.children.personButtonSelector, this.personButtonHandler);
		this.model.setSearchEvent.attach(this.setSearchEventHandler);
		this.model.setCharacterMatchesEvent.attach(this.setCharacterMatchesEventHandler);
		this.model.setSelectedCreditsEvent.attach(this.setSelectedCreditsHandler);
		return this;
	};

	/**
	 * @function registerHelpers
	 * @description Registers all {@link HandlebarsHelpers}
	 * @todo Externalize this
	 * @returns {object}
	 */
	AppView.prototype.registerHelpers = function() {
		for (var fn in HandlebarsHelpers) {
			Handlebars.registerHelper(fn, HandlebarsHelpers[fn]);
		}
		return this;
	};

	/**
	 * @todo Break this down
	 * @todo Externalize this
	 */
	AppView.prototype.applyStyles = function() {
		var self = this;
		Typekit.load({
			async: true,
			loading: function() {
			},
			active: function() {
				setTimeout(function() {
					autosizeInput(self.children.$characterInput.get(0));
					autosizeInput(self.children.$showInput.get(0));
					self.children.$characterInput.focus();
				}, 500);
			}
		});
		return this;
	};

	/**
	 * @function render
	 * @description Performs all render methods
	 */
	AppView.prototype.render = function() {
		this.renderSearch()
			.renderQuery()
			.renderResults();
	};

	/**
	 * @function renderSearch
	 * @description Renders the search area
	 * @returns {object}
	 */
	AppView.prototype.renderSearch = function() {
		this.children.$formArea.addClass('u-hidden');
		this.children.$searchArea
			.removeClass('u-hidden')
			.html(this.children.searchTemplate(this.model.search));
		return this;
	};

	/**
	 * @function renderQuery
	 * @description Renders the query area
	 * @todo Externalize the hiding of the search area
	 * @returns {object}
	 */
	AppView.prototype.renderQuery = function() {
		var self = this, characters = [];
		this.model.character.getMatches().forEach(function(match) {
			characters.push(self.model.findCharacterById(match));
		});
		this.children.$searchArea.addClass('u-hidden');
		this.children.$queryArea
			.removeClass('u-hidden')
			.html(this.children.queryTemplate({
				entry: characters,
				show: this.model.show.getName()
			})
		);
		return this;
	};

	/**
	 * @function renderResults
	 * @description Renders the results area
	 * @todo Externalize the hiding of the query area
	 * @returns {object}
	 */
	AppView.prototype.renderResults = function() {
		var person = this.model.findPersonById(this.model.character.getSelected());
		this.children.$queryArea.addClass('u-hidden');
		this.children.$resultsArea
			.removeClass('u-hidden')
			.html(this.children.resultsTemplate({
				person: person.name,
				show: this.model.show.getId(),
				entry: this.model.character.getCredits()
			}));
		var carousel = new Carousel($('#carousel'));
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
			character: this.children.$characterInput.val(),
			show: this.children.$showInput.val()
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
