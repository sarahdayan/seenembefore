define(function() {

	/**
	 * Represents an event.
	 * @constructor
	 */
	var Event = function(sender) {
		this.sender = sender;
		this.listeners = [];
	};

	/**
	 * @function attach
	 * @description Attaches a listeners
	 * @param {function} listener - a listener function to attach.
	 */
	Event.prototype.attach = function(listener) {
		this.listeners.push(listener);
	};

	/**
	 * @function notify
	 * @description Notifies and executes all attached listeners
	 * @param {object} args - an object of arguments to pass to listeners.
	 */
	Event.prototype.notify = function(args) {
		for (var i = 0; i < this.listeners.length; i += 1) {
			this.listeners[i](this.sender, args);
		}
	};

	return Event;

});
