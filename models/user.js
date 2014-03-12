// we need mongoose
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var _ = require('../public/lib/underscore');

var github = require('../lib/github');
	
var schema = mongoose.Schema({
	"netID": String,
	"github": {
		"username": String,
		"token": String,
		"hasKeys": {type: Boolean, default: false}
	},
	"passport": String
});

schema.methods.hasKeys = function(cb) {
	var self = this;

	if (this.github.hasKeys) {
		cb(null, true);
	} else {
		github.user.getKeysFromUser({user: self.github.username}, function(err, data) {
			if (err) {
				cb(err, false);
			} else {
				if (data.length < 2) {
					cb(null, false);
				} else {
					self.github.hasKeys = true;
					self.save(function(err) {});
					cb(null, true);
				}
			}
		});
	}
};

// Load plugins
schema.plugin(findOrCreate);

var User = module.exports = mongoose.model('User', schema);