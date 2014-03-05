var Sample = require('../models/sample');
var pkg = require('../package.json');

var build = require('./build');

exports.index = function( req, res ) {

	build.create({}, function(err, data) {
		console.log('backer');
	});
	
	Sample.create({ "first": "Bob", "last": "Sam"}, function( err, smpl ) {
		console.log( smpl.getName() );
	});
	
	res.render("index", {
		project: pkg.name
	});
};