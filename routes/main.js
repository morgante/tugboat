var Sample = require('../models/sample');
var pkg = require('../package.json');

var Container = require('../models/container');


exports.index = function( req, res ) {
	if (req.user) {
		res.render("dashboard", {
			project: pkg.name
		});
	} else {
		res.render("splash", {
			project: pkg.name
		});
	}
};