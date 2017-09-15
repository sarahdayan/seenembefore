define(
	['jquery', 'handlebars', 'helpers/HandlebarsHelpers'],
	function($, Handlebars, HandlebarsHelpers) {

	'use strict';

	/**
	 * Represents the layout.
	 * @constructor
	 */
	var Layout = function() {
		this.sections = $('.c-section');
		this.templates = {
			search: {
				div: $('.js-section__search'),
				template: $('#search-template')
			},
			query: {
				div: $('.js-section__query'),
				template: $('#query-template')
			},
			choice: {
				div: $('.js-section__choice'),
				template: $('#choice-template')
			},
			results: {
				div: $('.js-section__results'),
				template: $('#results-template')
			}
		};

		this.init();
	};

	/**
	 * @function init
	 * @description Fires initial operations
	 */
	Layout.prototype.init = function() {
		this.registerHelpers()
			.compileTemplates();
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
	 * @function compileTemplates
	 * @description Compiles all templates
	 * @returns {object}
	 */
	Layout.prototype.compileTemplates = function() {
		for (var template in this.templates) {
			this.templates[template].compiledTemplate =
			Handlebars.compile(this.templates[template].template.html());
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
		this.sections.addClass('u-hidden');
		this.templates[section].div.removeClass('u-hidden');
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
		this.templates[section].div
			.html(this.templates[section].compiledTemplate(args));
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
