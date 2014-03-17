define([
	'jquery',
	'underscore',
    'backbone',
    'views/dashboard',
    'collections/instances'
], function ($, _, Backbone, Dashboard, instances) {

	var dash = new Dashboard({collection: instances});

});