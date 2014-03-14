define([
	'jquery',
	'underscore',
    'backbone',
    'views/dashboard',
    'collections/instances'
], function ($, _, Backbone, Dashboard, instances) {

	dash = new Dashboard({collection: instances});

});