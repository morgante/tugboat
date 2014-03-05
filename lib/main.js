var Sample = require('../models/sample');
var pkg = require('../package.json');

var Container = require('../models/container');

exports.index = function( req, res ) {

	res.render("index", {
		project: pkg.name
	});

};