define(['services/Validator'], function(Validator) {

	var AppController = function(model, view) {
		this.model = model;
		this.view = view;

		this.validator = new Validator();

		this.init();
	};

	AppController.prototype.init = function() {
		this.setupHandlers()
			.enable();
	};

	AppController.prototype.setupHandlers = function() {
		this.startNewSearchHandler = this.startNewSearch.bind(this);
		this.saveSearchHandler = this.saveSearch.bind(this);
		this.saveCharacterHandler = this.saveCharacter.bind(this);
		this.saveShowHandler = this.saveShow.bind(this);
		this.saveCharacterMatchesHandler = this.saveCharacterMatches.bind(this);
		this.savePersonCreditsHandler = this.savePersonCredits.bind(this);
		return this;
	};

	AppController.prototype.enable = function() {
		this.view.inputUserSearchEvent.attach(this.startNewSearchHandler);
		this.view.inputUserSearchEvent.attach(this.saveSearchHandler);
		this.view.inputUserCharacterChoiceEvent.attach(this.saveCharacterHandler);
		this.model.setSearchEvent.attach(this.saveShowHandler);
		this.model.setShowEvent.attach(this.saveCharacterMatchesHandler);
		this.model.setCharacterEvent.attach(this.savePersonCreditsHandler);
		return this;
	};

	AppController.prototype.startNewSearch = function() {
		this.model.init();
	};

	AppController.prototype.saveSearch = function(sender, args) {
		this.model.setSearch({
			character: args.character,
			show: args.show
		});
	};

	AppController.prototype.saveShow = function() {
		this.model.setShow();
	};

	AppController.prototype.saveCharacterMatches = function() {
		var matches = this.model.findCharacterMatches();
		this.model.setCharacterMatches(matches);
	};

	AppController.prototype.saveCharacter = function(sender, args) {
		this.model.setCharacter({
			id: args.id
		});
	};

	AppController.prototype.savePersonCredits = function() {
		var selected = this.model.character.getSelected();
		this.model.setSelectedCredits(selected);
	};

	return AppController;

});
