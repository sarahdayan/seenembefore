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
		this.inputUserSearchEventHandler = this.saveSearch.bind(this);
		this.inputUserCharacterChoiceEventHandler = this.saveCharacter.bind(this);
		this.setSearchEventHandler = this.saveShow.bind(this);
		this.setShowEventHandler = this.saveCharacterMatches.bind(this);
		this.setCharacterEventHandler = this.fetchPersonCredits.bind(this);
		return this;
	};

	AppController.prototype.enable = function() {
		this.view.inputUserSearchEvent.attach(this.inputUserSearchEventHandler);
		this.view.inputUserCharacterChoiceEvent.attach(this.inputUserCharacterChoiceEventHandler);
		this.model.setSearchEvent.attach(this.setSearchEventHandler);
		this.model.setShowEvent.attach(this.setShowEventHandler);
		this.model.setCharacterEvent.attach(this.setCharacterEventHandler);
		return this;
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

	AppController.prototype.saveCharacter = function(sender, args) {
		this.model.setCharacter({
			id: args.id
		});
	};

	AppController.prototype.fetchPersonCredits = function() {
		this.model.getPersonCredits(this.model.character.selected.value);
	};

	AppController.prototype.saveCharacterMatches = function() {
		this.model.setCharacterMatches();
	};

	return AppController;

});
