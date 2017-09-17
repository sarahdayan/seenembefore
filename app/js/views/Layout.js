define(
	['jquery', 'handlebars.runtime', 'helpers/HandlebarsHelpers', 'templates/templates'],
	function($, Handlebars, HandlebarsHelpers, Templates) {

	'use strict';

	/**
	 * Represents the layout.
	 * @constructor
	 */
	var Layout = function() {
		this.sections = $('.c-section');
		this.templates = {
			load: {
				div: $('.js-section__load')
			},
			form: {
				div: $('.js-section__form')
			},
			search: {
				div: $('.js-section__search'),
				template: $('#search')
			},
			query: {
				div: $('.js-section__query'),
				template: $('#query')
			},
			choice: {
				div: $('.js-section__choice'),
				template: $('#choice')
			},
			results: {
				div: $('.js-section__results'),
				template: $('#results')
			}
		};

		this.init();
	};

	/**
	 * @function init
	 * @description Fires initial operations
	 */
	Layout.prototype.init = function() {
		this.registerHelpers();
	};

	/**
	 * @function registerHelpers
	 * @description Registers all {@link HandlebarsHelpers}
	 * @returns {object}
	 */
	Layout.prototype.registerHelpers = function() {
		for (var fn in HandlebarsHelpers) {
			Handlebars.registerHelper(fn, HandlebarsHelpers[fn]);
		}
		return this;
	};

	/**
	 * @function showSection
	 * @description Shows a section and hides all others
	 * @param {object} section - the section to display.
	 * @returns {object}
	 */
	Layout.prototype.showSection = function(section) {
		var hiddenClassName = 'u-hidden';
		this.sections.addClass(hiddenClassName);
		this.templates[section].div.removeClass(hiddenClassName);
		return this;
	};

	/**
	 * @function injectInSection
	 * @description Injects a related template and data in a section
	 * @param {object} section - the section to inject the template to.
	 * @param {object} args - the data to inject.
	 * @returns {object}
	 */
	Layout.prototype.injectInSection = function(section, args) {
		args = args || {};
		this.templates[section].div.html(Handlebars.templates[section + '.handlebars.html'](args));
		return this;
	};

	/**
	 * @function displaySection
	 * @description Displays section filled with content
	 * @param {object} section - the section to inject the template to.
	 * @param {object} args - the data to inject.
	 * @returns {object}
	 */
	Layout.prototype.displaySection = function(section, args) {
		this.showSection(section)
			.injectInSection(section, args);
		return this;
	};

	return Layout;

});
