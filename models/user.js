// we need mongoose
var mongoose = require('mongoose');
var _ = require('../public/lib/underscore');
	
var schema = mongoose.Schema({
	"netID": String,
	"github": String
});

var User = module.exports = mongoose.model('User', schema);