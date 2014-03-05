// we need mongoose
var mongoose = require('mongoose');
var _ = require('../public/lib/underscore');
var vms = require('../lib/vms');

var User = require('./user');
	
var containerSchema = mongoose.Schema({
	"image": String,
	"container": String,
	"users" : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

containerSchema.methods.addUser = function(user, callback) {
	var self = this;

	this.users.push(user.id);

	vms.insert({
		image: self.image,
		path: '/root/.ssh/authorized_keys',
		url: 'https://raw.github.com/morgante/docker-ssh/master/id_rsa.pub'
	}, function(err, data) {
		console.log(err, data);
	});

	// this.save(function(err, container) {
		// callback(err, container);
	// });
};

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