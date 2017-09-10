define(
	['services/Validator', 'services/Event', 'jquery'],
	function(Validator, Event, $) {

	'use strict';

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

	Carousel.prototype.init = function() {
		this.createChildren()
			.setupHandlers()
			.enable();
	};

	Carousel.prototype.createChildren = function() {
		this.$prevButton = this.$container.find('.js-carouselPreviousButton');
		this.$nextButton = this.$container.find('.js-carouselNextButton');
		this.$slider = this.$container.find('.js-carouselSlider');
		return this;
	};

	Carousel.prototype.setupHandlers = function() {
		this.slideHandler = this.slide.bind(this);
		this.prevHandler = this.setPrevSlide.bind(this);
		this.nextHandler = this.setNextSlide.bind(this);
		return this;
	};

	Carousel.prototype.enable = function() {
		this.setCurrentEvent.attach(this.slideHandler);
		this.$prevButton.click(this.prevHandler);
		this.$nextButton.click(this.nextHandler);
		return this;
	};

	Carousel.prototype.set = function(value, key) {
		if (this.validator.validate(value, key.validator)) {
			key.value = value;
			return true;
		}
		return false;
	};

	Carousel.prototype.getCurrentSlide = function() {
		return this.currentSlide.value;
	};

	Carousel.prototype.getLastSlideIndex = function() {
		return this.numberOfSlides - 1;
	};

	Carousel.prototype.getPrevSlide = function() {
		return this.getCurrentSlide() - 1;
	};

	Carousel.prototype.getNextSlide = function() {
		return this.getCurrentSlide() + 1;
	};

	Carousel.prototype.getSlidePosition = function() {
		return this.getCurrentSlide() * -100;
	};

	Carousel.prototype.isFirstSlideCurrent = function() {
		return this.getCurrentSlide() === 0;
	};

	Carousel.prototype.isLastSlideCurrent = function() {
		return this.getCurrentSlide() === this.getLastSlideIndex();
	};

	Carousel.prototype.setCurrent = function(currentSlide) {
		this.set(currentSlide, this.currentSlide);
		this.setCurrentEvent.notify();
	};

	Carousel.prototype.setPrevSlide = function() {
		var currentSlide = this.isFirstSlideCurrent() ? this.getLastSlideIndex() : this.getPrevSlide();
		this.setCurrent(currentSlide);
	};

	Carousel.prototype.setNextSlide = function() {
		var currentSlide = this.isLastSlideCurrent() ? 0 : this.getNextSlide();
		this.setCurrent(currentSlide);
	};

	Carousel.prototype.slide = function() {
		this.$slider.css('left', this.getSlidePosition() + '%');
	};

	return Carousel;

});
