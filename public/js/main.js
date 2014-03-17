define([
	'jquery',
	'underscore',
    'backbone',
    'views/dashboard',
    'collections/instances'
], function ($, _, Backbone, Dashboard, instances) {
	
	instances.fetch({
		success: function(collection, response, options) {
			dash = new Dashboard({collection: collection});
		},
		error: function(collection, response, options) {
			alert('Sorry, we are experiencing technical difficulties.');
			console.log(collection, response, options);
		}
	});

});