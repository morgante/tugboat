// we need mongoose
var mongoose = require('mongoose');
var _ = require('../public/lib/underscore');
var vms = require('../lib/vms');
	
var containerSchema = mongoose.Schema({
	"image": String,
	"container": String
});

containerSchema.methods.run = function(options, callback) {
	var self = this;

	options = _.defaults(options, {
		'image': this.image,
	});

	vms.run(options, function(err, info) {
		self.container = info.container.id;
		self.save();
	});
};

var Container = module.exports = mongoose.model('Container', containerSchema);