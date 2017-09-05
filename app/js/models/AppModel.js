define(
	['services/Validator', 'services/Event', 'services/Api', 'models/Search',
	'models/Show', 'models/Character', 'jquery'],
	function(Validator, Event, Api, Search, Show, Character, $) {

	var AppModel = function() {
		this.api = new Api();
		this.validator = new Validator();

		this.setSearchEvent = new Event(this);
		this.setCharacterEvent = new Event(this);
		this.setShowEvent = new Event(this);
		this.setCharacterMatchesEvent = new Event(this);
		this.setSelectedCreditsEvent = new Event(this);
	};

	AppModel.prototype.init = function() {
		this.search = new Search();
		this.show = new Show();
		this.character = new Character();
	};

	AppModel.prototype.setSearch = function(search) {
		this.search.setCharacter(search.character);
		this.search.setShow(search.show);
		this.setSearchEvent.notify();
	};

	AppModel.prototype.setCharacter = function(character) {
		this.character.setSelected(character.id);
		this.setCharacterEvent.notify();
	};

	AppModel.prototype.findCharacterMatches = function() {
		var self = this, matches = [];
		this.show.getCast().forEach(function(character) {
			if (self.validator.isIn(
				self.search.getCharacter().toLowerCase(),
				character.character.name.toLowerCase()
			)) matches.push(character.character.id);
		});
		return matches;
	};

	AppModel.prototype.setCharacterMatches = function(matches) {
		this.character.setMatches(matches);
		this.setCharacterMatchesEvent.notify();
	};

	AppModel.prototype.setShow = function() {
		var self = this;
		this.api.singleSearch(this.search.getShow(), ['cast'])
			.done(function(data) {
				self.show.setName(data.name);
				self.show.setId(data.id);
				self.show.setCast(data._embedded.cast);
				self.setShowEvent.notify();
			});
	};

	AppModel.prototype.findCharacterById = function(characterID) {
		for (var i = 0; i < this.show.getCast().length; i++) {
			if (this.show.getCast()[i].character.id === characterID) {
				return this.show.getCast()[i];
			}
		}
		return -1;
	};

	AppModel.prototype.findPersonById = function(personID) {
		for (var i = 0; i < this.show.getCast().length; i++) {
			if (this.show.getCast()[i].person.id === personID) {
				return this.show.getCast()[i].person;
			}
		}
		return -1;
	};

	AppModel.prototype.setSelectedCredits = function(personID) {
		var self = this;
		this.api.castCredits(personID, ['show'])
			.done(function(data) {
				var personCredits = [], promises = [];
				data.forEach(function(credit) {
					(function(showName, showID) {
						var promise = $.getJSON(credit._links.character.href, function(data) {
							personCredits.push({
								id: data.name,
								name: data.name,
								image: data.image ? data.image.original : null,
								show: {
									id: showID,
									name: showName
								}
							});
						});
						promises.push(promise);
					})(credit._embedded.show.name, credit._embedded.show.id);
				});
				$.when.apply($, promises)
					.done(function() {
						self.character.setCredits(personCredits);
						self.setSelectedCreditsEvent.notify();
					});
			});
	};

	return AppModel;

});
