define([
	'jquery',
	'underscore',
    'backbone',
    'views/instance',
], function ($, _, Backbone, InstanceView) {
	_.templateSettings = {
        evaluate : /\{\( (.+?) \)\}/gi,
        interpolate : /\{\{ (.+?) \}\}/gi,
    };

	// The Dashboard View
	// ---------------
	var Dashboard = Backbone.View.extend({
		template: _.template($('#dashboard-template').html()),

		el: '#dashboard',

		events: {
			'click #newContainer':		'createOne'
		},

		initialize: function () {
			this.listenTo(this.collection, 'add', this.addInstance);

			// fetch initial elements
			this.collection.fetch({
				success: function(collection, response, options) {
					console.log('all fetched');
				},
				error: function(collection, response, options) {
					alert('Sorry, we are experiencing technical difficulties.');
					console.log(collection, response, options);
				}
			});

			// render off the bat
			this.render();
		
		},

		createOne: function (e) {
			this.collection.create({}, {wait: true});
		},

		addInstance: function(model) {
			var view = new InstanceView({ model: model });
			$('#instances').append(view.render().el);
		},

		render: function () {
			var view = this;

			this.$el.html(this.template({}));

			return this;
		},

	});

	return Dashboard;
});