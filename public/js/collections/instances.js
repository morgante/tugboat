/*global define*/
define([
	'underscore',
	'backbone',
	'models/instance'
], function (_, Backbone, Instance) {
	'use strict';

	var Instances = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: Instance,

		url: '/api/instances'
	});

	return new Instances();
});