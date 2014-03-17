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
	"name": String,
	"container": String,
	"users" : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	"ports": mongoose.Schema.Types.Mixed
});

containerSchema.virtual('sshPort').get(function () {
	return this.ports["22/tcp"][0]["HostPort"];
});

containerSchema.virtual('ip').get(function () {
	return process.env.SSH_IP;
});

containerSchema.set('toJSON', { virtuals: true });

containerSchema.pre('remove', function (next) {
	console.log('try removing');
	vms.remove({
		container: this.container,
		image: this.image
	}, function(err) {
		console.log('done removing', err);
		next(err);
	});
});

containerSchema.methods.getKeys = function(cb) {
	this.populate('users', function(err, doc) {
		async.map(doc.users, function(user, callback) {
			github.user.getKeysFromUser({user: user.github.username}, function(err, data) {
				if (err) {
					callback(err, null);
				} else {
					callback(null, data);
				}
			});
		}, function(err, results) {
			if (err) {
				cb(err, null);
			} else {
				results = _.flatten(results);
				results = _.pluck(results, 'key');
				
				var string = _.reduce(results, function(memo, key){ return memo + key + "\n"; }, '');
				
				cb(null, string);
			}
		});
	});
};

containerSchema.methods.addUser = function(user, callback) {
	var self = this;

	this.users.push(user);

	this.getKeys(function(err, string) {
		var name = new Date().getTime() + '.pub'; // lazy

		files.store({
			"name": name,
			"content": string
		}, function(err, url, data) {
			vms.insert({
				image: self.image,
				path: '/root/.ssh/authorized_keys',
				url: url,
			}, function(err, data) {
				self.image = data;

				self.save(function(err, container) {
					callback(err, container);
				});
			});
		});
	});
};

containerSchema.methods.run = function(options, callback) {
	var self = this;

	options = _.defaults(options, {
		'image': this.image,
	});

	vms.run(options, function(err, info) {
		console.log('ran', err, info);
		self.name = info.name;
		self.container = info.container.id;
		self.ports = info.data.NetworkSettings.Ports;
		self.save(function() {
			callback(null, self);
		});
	});
};

var Container = module.exports = mongoose.model('Container', containerSchema);