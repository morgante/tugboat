var User = require('../models/user');

exports.ensure = function(req, res, next) {
	if( req.user === undefined )
	{
		res.redirect(  process.env.BASE_URL + '/auth/start?next=' + encodeURIComponent( process.env.BASE_URL + req.url ) );
	}
	else
	{
		next();
	}
};

exports.fake = function(req, res, next) {
	if (req.user !== undefined) {
		next();
	} else if( process.env.DEV_USER !== undefined && process.env.DEV_USER != 'none' )
	{
		User.findOne( {'netID': process.env.DEV_USER}, function( err, user ) {
			console.log('faking user', user.netID);
			req.user = user;

			next();
		});
	} else {
		next();
	}
};