// we need mongoose
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var _ = require('../public/lib/underscore');
	
var schema = mongoose.Schema({
	"netID": String,
	"github": String,
	"passport": String
});

// Load plugins
schema.plugin(findOrCreate);

var User = module.exports = mongoose.model('User', schema);