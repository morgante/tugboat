var Sample = require('../models/sample');
var pkg = require('../package.json');

var Container = require('../models/container');

exports.create = function(req, res) {
	Container.create({"image": "morgante/ssh"}, function(err, container) {
		container.addUser(req.user, function(err, container) {
			container.run({}, function(err, dat) {
				res.send(container.toJSON());
			});
		});
	});
};

exports.index = function( req, res ) {
	if (req.user) {
		req.user.hasKeys(function(err, yes) {
			if (yes) {
				res.render("dashboard", {
					project: pkg.name
				});
			} else {
				res.render("keyprompt", {
					project: pkg.name
				});
			}
		});
	} else {
		res.render("splash", {
			project: pkg.name
		});
	}
};