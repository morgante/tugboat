require.config({
	baseUrl: "js",
	paths: {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
		"underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min",
		"backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min"
	},
	shim: {
		'jquery': {
             exports: '$'
         },
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});

// Load the main app module to start the app
require(["main"]);