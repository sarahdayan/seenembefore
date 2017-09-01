define(
	['services/Validator', 'services/Event', 'services/Api', 'jquery'],
	function(Validator, Event, Api, $) {

	var AppModel = function() {
		this.search = {
			character: {
				value: null,
				validator: ['isString', 'isNotEmpty'/*, ['hasMinLength', 2], ['isEqualTo', 'Jaha']*/]
			},
			show: {
				value: null,
				validator: ['isString', 'isNotEmpty']
			}
		};
		this.show = {
			name: {
				value: null,
				validator: ['isString', 'isNotEmpty']
			},
			id: {
				value: null,
				validator: ['isInt', 'isNotEmpty']
			},
			cast: {
				value: {},
				validator: ['isNotEmpty']
			}
		};
		this.character = {
			matches: {
				value: [],
				validator: ['isArray', 'isNotEmpty']
			},
			selected: {
				value: null,
				validator: ['isInt', 'isNotEmpty'],
				credits: {
					value: [],
					validator: ['isArray', 'isNotEmpty']
				}
			}
		};

		this.api = new Api();
		this.validator = new Validator();

		this.setSearchEvent = new Event(this);
		this.setCharacterEvent = new Event(this);
		this.setShowEvent = new Event(this);
		this.setCharacterMatchesEvent = new Event(this);
		this.getPersonCreditsEvent = new Event(this);
	};

	AppModel.prototype.set = function(value, key) {
		if (this.validator.validate(value, key.validator)) {
			key.value = value;
			return true;
		}
		return false;
	};

	AppModel.prototype.setSearch = function(search) {
		this.set(search.character, this.search.character);
		this.set(search.show, this.search.show);

		this.setSearchEvent.notify();
	};

	AppModel.prototype.setCharacter = function(character) {
		this.set(character.id, this.character.selected);

		this.setCharacterEvent.notify();
	};

	AppModel.prototype.setCharacterMatches = function() {
		var self = this, matches = [];
		this.show.cast.value.forEach(function(character) {
			if (self.validator.isIn(
				self.search.character.value.toLowerCase(),
				character.character.name.toLowerCase()
			)) matches.push(character.character.id);
		});
		this.set(matches, this.character.matches);

		this.setCharacterMatchesEvent.notify();
	};

	AppModel.prototype.setShow = function() {
		var self = this;
		this.api.singleSearch(this.search.show.value, ['cast'])
			.done(function(data) {
				self.set(data.name, self.show.name);
				self.set(data.id, self.show.id);
				self.set(data._embedded.cast, self.show.cast);

				self.setShowEvent.notify();
			});
	};

	AppModel.prototype.findCharacterById = function(characterID) {
		for (var i = 0; i < this.show.cast.value.length; i++) {
			if (this.show.cast.value[i].character.id === characterID) {
				return this.show.cast.value[i];
			}
		}
		return -1;
	};

	AppModel.prototype.findPersonById = function(personID) {
		for (var i = 0; i < this.show.cast.value.length; i++) {
			if (this.show.cast.value[i].person.id === personID) {
				return this.show.cast.value[i].person;
			}
		}
		return -1;
	};

	AppModel.prototype.getPersonCredits = function(personID) {
		var self = this;
		this.api.castCredits(personID, ['show'])
			.done(function(data) {
				var personCredits = [], promises = [];
				data.forEach(function(credit) {
					(function(showName) {
						var promise = $.getJSON(credit._links.character.href, function(data) {
							if (self.show.name.value !== showName) {
								personCredits.push({
									name: data.name,
									show: showName
								});
							}
						});
						promises.push(promise);
					})(credit._embedded.show.name);
				});
				$.when.apply($, promises)
					.done(function() {
						self.set(personCredits, self.character.selected.credits);
						self.getPersonCreditsEvent.notify();
					});
			});
	};

	return AppModel;

});
