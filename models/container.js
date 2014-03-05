// we need mongoose
var mongoose = require('mongoose');
var _ = require('../public/lib/underscore');
var async = require('async');
var request = require('request');

var vms = require('../lib/vms');
var files = require('../lib/files');
var github = require('../lib/github');

var User = require('./user');
	
var containerSchema = mongoose.Schema({
	"image": String,
	"container": String,
	"users" : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	"ports": mongoose.Schema.Types.Mixed
});

containerSchema.methods.buildPub = function(callback) {
	var string = '';

	this.populate('users', function(err, doc) {
		async.map(doc.users, function(user, callback) {
			github.user.getKeysFromUser({user: user.github}, function(err, data) {
				console.log(err, data);
			});
		}, function(err, results) {
			console.log(results);
		});
	});

	// async.map(this.users, function())

	callback(null, string);
};

containerSchema.methods.addUser = function(user, callback) {
	var self = this;

	this.users.push(user);

	this.buildPub(function(err, string) {
		console.log('pub', string);
	});

	// files.store({
	// 	"name": "swdfwefjwf.pub",
	// 	"content": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCZbHVHg2pFlVMLIs8E8BsncLus2I5ZJe/vX+Oog7neKTQkNqJSrhN1CdtFKIsSvSkrR1MGEIqPk7+Cwc9mV4NftvQEAkk/oSUNTQBk8XLp0WHw5JtfaCIV+5s9eS9fcHyB9O5eEvpnHRAocM6iSXi51gO3MqNrx02XsF6OXo5fG73KcGi8zK8haGrEBCxygduu39z2dGCEOpAt3HDF90bUCRXHBD+91E2clV3216S2SUkmSbCu35wJ+waXoAEN77zBdlceMCatXim9M7shBpaelCs/Ssx4K5ab3Zh8ZmLkdObYGa7det+xYrvQ0ke+G7Ok5LI6xr8NLTpXO6PMjS23 morgantepell@kore.local"
	// }, function(err, res) {
	// 	console.log(err, res);
	// });

	// vms.insert({
	// 	image: self.image,
	// 	path: '/root/.ssh/authorized_keys',
	// 	url: 'https://raw.github.com/morgante/tugboat/keys/keys/swdfwefjwf.pub'
	// }, function(err, data) {
	// 	self.image = data;

	// 	self.save(function(err, container) {
	// 		callback(err, container);
	// 	});
	// });
};

containerSchema.methods.run = function(options, callback) {
	var self = this;

	options = _.defaults(options, {
		'image': this.image,
	});

	vms.run(options, function(err, info) {
		self.container = info.container.id;
		self.ports = info.data.NetworkSettings.Ports;
		self.save();
	});
};

var Container = module.exports = mongoose.model('Container', containerSchema);