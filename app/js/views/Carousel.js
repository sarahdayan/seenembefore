define(
	['jquery', 'services/Event', 'hammerjs', 'services/Validator'],
	function($, Event, Hammer, Validator) {

	'use strict';

	/**
	 * Represents a carousel.
	 * @constructor
	 */
	var Carousel = function(carousel) {
		this.$container = carousel;
		this.numberOfSlides = this.$container.find('.js-carouselSlide').length;

		this.currentSlide = {
			value: 0,
			validator: [
				'isInt',
				'isNotEmpty',
				['hasMinValue', -1],
				['hasMaxValue', this.getLastSlideIndex()]
			]
		};

		this.validator = new Validator();

		this.setCurrentEvent = new Event(this);

		this.init();
	};

	/**
	 * @function init
	 * @description Fires initial operations
	 */
	Carousel.prototype.init = function() {
		this.createChildren()
			.setupHandlers()
			.enable();
	};

	/**
	 * @function createChildren
	 * @description Stores DOM nodes
	 * @returns {object}
	 */
	Carousel.prototype.createChildren = function() {
		this.$body = $('body');
		this.$prevButton = this.$container.find('.js-carouselPreviousButton');
		this.$nextButton = this.$container.find('.js-carouselNextButton');
		this.$slider = this.$container.find('.js-carouselSlider');
		this.hammertime = new Hammer(this.$slider[0]);
		return this;
	};

	/**
	 * @function setupHandlers
	 * @description Binds handlers to methods
	 * @returns {object}
	 */
	Carousel.prototype.setupHandlers = function() {
		this.slideHandler = this.slide.bind(this);
		this.prevHandler = this.setPrevSlide.bind(this);
		this.nextHandler = this.setNextSlide.bind(this);
		return this;
	};

	/**
	 * @function enable
	 * @description Binds events to handlers
	 * @returns {object}
	 */
	Carousel.prototype.enable = function() {
		var self = this;
		this.setCurrentEvent.attach(this.slideHandler);
		this.$prevButton.click(this.prevHandler);
		this.$nextButton.click(this.nextHandler);
		this.hammertime
			.on('swiperight', this.prevHandler)
			.on('swipeleft', this.nextHandler);
		this.$body.keyup(function(event) {
			switch(event.keyCode) {
				case 37: self.prevHandler();
				break;
				case 39: self.nextHandler();
				break;
			}
		});
		return this;
	};

	/**
	 * @function set
	 * @description Validate then set a value with {@link Validator}
	 * @param {mixed} value - the value to validate then set.
	 * @param {mixed} key - the key to assign the value to.
	 * @returns {boolean}
	 */
	Carousel.prototype.set = function(value, key) {
		if (this.validator.validate(value, key.validator)) {
			key.value = value;
			return true;
		}
		return false;
	};

	/**
	 * @function getCurrentSlide
	 * @description Gets the current slide
	 * @returns {number}
	 */
	Carousel.prototype.getCurrentSlide = function() {
		return this.currentSlide.value;
	};

	/**
	 * @function getLastSlideIndex
	 * @description Gets the last slide's index
	 * @returns {number}
	 */
	Carousel.prototype.getLastSlideIndex = function() {
		return this.numberOfSlides - 1;
	};

	/**
	 * @function getPrevSlide
	 * @description Gets the previous slide
	 * @returns {number}
	 */
	Carousel.prototype.getPrevSlide = function() {
		return this.getCurrentSlide() - 1;
	};

	/**
	 * @function getNextSlide
	 * @description Gets the next slide
	 * @returns {number}
	 */
	Carousel.prototype.getNextSlide = function() {
		return this.getCurrentSlide() + 1;
	};

	/**
	 * @function getCurrentSlidePosition
	 * @description Gets the current slide's position
	 * @returns {number}
	 */
	Carousel.prototype.getCurrentSlidePosition = function() {
		return this.getCurrentSlide() * -100;
	};

	/**
	 * @function isFirstSlideCurrent
	 * @description Returns if first slide is current
	 * @returns {boolean}
	 */
	Carousel.prototype.isFirstSlideCurrent = function() {
		return this.getCurrentSlide() === 0;
	};

	/**
	 * @function isLastSlideCurrent
	 * @description Returns if last slide is current
	 * @returns {boolean}
	 */
	Carousel.prototype.isLastSlideCurrent = function() {
		return this.getCurrentSlide() === this.getLastSlideIndex();
	};

	/**
	 * @function setCurrent
	 * @description Sets current slide
	 * @param {number} currentSlide - the id of the slide to make current.
	 * @fires Carousel#setCurrentEvent
	 */
	Carousel.prototype.setCurrent = function(currentSlide) {
		this.set(currentSlide, this.currentSlide);
		this.setCurrentEvent.notify();
	};

	/**
	 * @function setPrevSlide
	 * @description Sets previous slide
	 */
	Carousel.prototype.setPrevSlide = function() {
		var currentSlide = this.isFirstSlideCurrent() ? this.getLastSlideIndex() : this.getPrevSlide();
		this.setCurrent(currentSlide);
	};

	/**
	 * @function setNextSlide
	 * @description Sets next slide
	 */
	Carousel.prototype.setNextSlide = function() {
		var currentSlide = this.isLastSlideCurrent() ? 0 : this.getNextSlide();
		this.setCurrent(currentSlide);
	};

	/**
	 * @function slide
	 * @description Makes the carousel slide
	 */
	Carousel.prototype.slide = function() {
		this.$slider.css('left', this.getCurrentSlidePosition() + '%');
	};

	return Carousel;

});
