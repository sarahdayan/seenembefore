define(['helpers/HandlebarsHelpers', 'services/Event', 'jquery', 'handlebars'], function(HandlebarsHelpers, Event, $, Handlebars) {

	var AppView = function(model) {
		this.model = model;

		this.inputUserSearchEvent = new Event(this);
		this.inputUserCharacterChoiceEvent = new Event(this);

		this.init();
	};

	AppView.prototype.init = function() {
		this.createChildren()
			.registerHelpers()
			.setupHandlers()
			.enable();
	};

	AppView.prototype.createChildren = function() {
		this.$document = $(document);
		this.$characterInput = $('#character');
		this.$showInput = $('#show');
		this.$submitButton = $('#submit');
		this.$searchArea = $('#search');
		this.$queryArea = $('#query');
		this.$resultsArea = $('#results');

		this.personButtonSelector = '.person';

		this.searchTemplate = Handlebars.compile($('#search-template').html());
		this.queryTemplate = Handlebars.compile($('#query-template').html());
		this.resultsTemplate = Handlebars.compile($('#results-template').html());

		return this;
	};

	AppView.prototype.setupHandlers = function() {
		this.submitButtonHandler = this.inputUserSearch.bind(this);
		this.personButtonHandler = this.inputUserCharacterChoice.bind(this);
		this.setSearchEventHandler = this.render.bind(this);
		this.setCharacterMatchesEventHandler = this.render.bind(this);
		this.setSelectedCreditsHandler = this.render.bind(this);
		return this;
	};

	AppView.prototype.enable = function() {
		this.$submitButton.click(this.submitButtonHandler);
		this.$document.on('click', this.personButtonSelector, this.personButtonHandler);
		this.model.setSearchEvent.attach(this.setSearchEventHandler);
		this.model.setCharacterMatchesEvent.attach(this.setCharacterMatchesEventHandler);
		this.model.setSelectedCreditsEvent.attach(this.setSelectedCreditsHandler);
		return this;
	};

	AppView.prototype.registerHelpers = function() {
		for (var fn in HandlebarsHelpers) {
			Handlebars.registerHelper(fn, HandlebarsHelpers[fn]);
		}
		return this;
	};

	AppView.prototype.render = function() {
		this.renderSearch()
			.renderQuery()
			.renderResults();
	};

	AppView.prototype.renderSearch = function() {
		this.$searchArea.html(this.searchTemplate(this.model.search));
		return this;
	};

	AppView.prototype.renderQuery = function() {
		var self = this, characters = [];
		this.model.character.getMatches().forEach(function(match) {
			characters.push(self.model.findCharacterById(match));
		});
		this.$queryArea.html(
			this.queryTemplate({
				entry: characters,
				show: this.model.show.getName()
			})
		);
		return this;
	};

	AppView.prototype.renderResults = function() {
		var person = this.model.findPersonById(this.model.character.getSelected());
		this.$resultsArea.html(this.resultsTemplate({
			person: person.name,
			show: this.model.show.getId(),
			entry: this.model.character.getCredits()
		}));
		return this;
	};

	AppView.prototype.inputUserSearch = function() {
		this.inputUserSearchEvent.notify({
			character: this.$characterInput.val(),
			show: this.$showInput.val()
		});
	};

	AppView.prototype.inputUserCharacterChoice = function(event) {
		this.inputUserCharacterChoiceEvent.notify({
			id: $(event.currentTarget).data('id')
		});
	};

	return AppView;

});
