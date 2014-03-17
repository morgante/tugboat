define([
	'jquery',
	'underscore',
    'backbone'
], function ($, _, Backbone) {
	_.templateSettings = {
        evaluate : /\{\( (.+?) \)\}/gi,
        interpolate : /\{\{ (.+?) \}\}/gi,
    };
    
	// The Instance View
	// ---------------

	var InstanceView = Backbone.View.extend({
		template: _.template($('#instance-template').html()),

		tagName:  'div',

		events: {
			'click [data-role="remove"]':	'delete'
		},

		initialize: function () {
			// this.$map = $('.map', this.$el);

			// this.scores = this.collection;
			// this.countries = new Countries;

			// render off the bat
			this.render();
		
		},

		delete: function() {
			console.log('destroying...');
			this.model.destroy();
			this.remove();

			return false;
		},

		render: function () {
			var view = this;

			this.$el.html(this.template(this.model.toJSON()));

			return this;
		},

	});

	return InstanceView;
});