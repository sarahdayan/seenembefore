define(
	['jquery', 'handlebars.runtime',
	'services/HandlebarsHelpers', 'templates/templates'],
	function($, Handlebars, HandlebarsHelpers, Templates) {

	'use strict';

	/**
	 * Represents the layout.
	 * @constructor
	 */
	var Layout = function() {
		this.sections = $('.c-section');
		this.templates = {
			load: $('.js-section__load'),
			form: $('.js-section__form'),
			search: $('.js-section__search'),
			query: $('.js-section__query'),
			choice: $('.js-section__choice'),
			results: $('.js-section__results')
		};
		this.children = {};

		this.init();
	};

	/**
	 * @function init
	 * @description Fires initial operations
	 */
	Layout.prototype.init = function() {
		this.registerHelpers()
			.createChildren()
			.setupHandlers()
			.enable();
	};

	/**
	 * @function createChildren
	 * @description Stores DOM nodes
	 * @returns {object}
	 */
	Layout.prototype.createChildren = function() {
		this.children.$window = $(window);

		this.children.autosizeSelector = '.js-autosize';

		return this;
	};

	/**
	 * @function setupHandlers
	 * @description Binds handlers to methods
	 * @returns {object}
	 */
	Layout.prototype.setupHandlers = function() {
		this.windowResizeHandler = this.autoSizeInputs.bind(this);
		return this;
	};

	/**
	 * @function enable
	 * @description Binds events to handlers
	 * @returns {object}
	 */
	Layout.prototype.enable = function() {
		this.children.$window.on('resize', this.windowResizeHandler);
		return this;
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
		this.templates[section].removeClass(hiddenClassName);
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
		this.templates[section].html(Handlebars.templates[section + '.handlebars.html'](args));
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

	/**
	 * @function autoSizeInputs
	 * @description Adapts input width to value or placeholder width
	 * @param {object} inputs - the inputs to resize.
	 * @returns {object}
	*/
	Layout.prototype.autoSizeInputs = function() {
		$(this.children.autosizeSelector).each(function() {
			autosizeInput($(this).get(0));
		});
		return this;
	};

	return Layout;

});
