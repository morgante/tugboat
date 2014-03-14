define([
	'jquery',
	'underscore',
    'backbone'
], function ($, _, Backbone) {
	// The Dashboard View
	// ---------------

	var Dashboard = Backbone.View.extend({
		template: _.template($('#dashboard-template').html()),

		el: '#dashboard',

		initialize: function () {
			// this.$map = $('.map', this.$el);

			// this.scores = this.collection;
			// this.countries = new Countries;

			// render off the bat
			this.render();
		
		},

		render: function () {
			var view = this;

			this.$el.html(this.template({}));

			return this;
		},

	});

	return Dashboard;
});