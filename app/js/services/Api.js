define(['jquery'], function($) {

	'use strict';

	/**
	 * Represents the API.
	 * @constructor
	 */
	var Api = function() {
		this.baseUrl = 'https://api.tvmaze.com/';
		this.endpoints = {
			singleSearch: {
				endpoint: this.baseUrl + 'singlesearch/shows',
				querystring: {
					mandatory: {
						q: '{query}'
					},
					embed: ['cast']
				}
			},
			castCredits: {
				endpoint: this.baseUrl + 'people/{query}/castcredits',
				querystring: {
					embed: ['show']
				}
			}
		};
	};

	/**
	 * @function getParams
	 * @description Gets the parameter portion of the endpoint
	 * @param  {string} endpoint - The name of the endpoint
	 * @param  {array} embed     - The desired embedded resources
	 * @return {string}
	 */
	Api.prototype.getParams = function(endpoint, embed) {
		var self = this,
			querystring = {
				embed: []
			};
		if (this.endpoints[endpoint].querystring.mandatory) {
			for (var query in this.endpoints[endpoint].querystring.mandatory) {
				querystring[query] = this.endpoints[endpoint].querystring.mandatory[query];
			}
		}
		if (embed) {
			embed.forEach(function(query) {
				if ($.inArray(query, self.endpoints[endpoint].querystring.embed) !== -1) querystring.embed.push(query);
			});
		}
		return decodeURIComponent($.param(querystring));
	};

	/**
	 * @function getEndpoint
	 * @description Gets a fully formed endpoint
	 * @param  {string} endpoint       - The name of the endpoint
	 * @param  {(string|number)} query - The argument to pass to the endpoint
	 * @param  {array} embed           - The desired embedded resources
	 * @returns {Promise}
	 */
	Api.prototype.getEndPoint = function(endpoint, query, embed) {
		var url = this.endpoints[endpoint].endpoint;
		url = url + '?' + this.getParams(endpoint, embed);
		return $.getJSON(url.replace('{query}', query));
	};

	/**
	 * @function singleSearch
	 * @description Gets the first show that matches the query
	 * @param  {(string|number)} query - The argument to pass to the endpoint
	 * @param  {array} embed           - The desired embedded resources
	 * @return {Promise}
	 */
	Api.prototype.singleSearch = function(query, embed) {
		return this.getEndPoint('singleSearch', query, embed);
	};

	/**
	 * @function castCredits
	 * @description Gets the cast credits for an actor
	 * @param  {(string|number)} query - The argument to pass to the endpoint
	 * @param  {array} embed           - The desired embedded resources
	 * @return {Promise}
	 */
	Api.prototype.castCredits = function(query, embed) {
		return this.getEndPoint('castCredits', query, embed);
	};

	return Api;

});
