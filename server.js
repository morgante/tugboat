var express = require('express')
		, http = require('http')
		, url = require('url')
		, async = require('async')
		, request = require('request')
		, mongoose = require('mongoose')
		, _ = require('./public/lib/underscore');

var passport = require('passport');
var NYUPassportStrategy = require('passport-nyu').Strategy;
		
var pkg = require('./package.json')

var auth = require('./routes/auth');
var main = require('./routes/main');

var vms = require('./lib/vms');
var files = require('./lib/files');
var login = require('./lib/login');

var Container = require('./models/container');
var User = require('./models/user');

// set up Mongoose
var mongoConns = {
	docker: 'mongodb://' + process.env.DB_PORT_27017_TCP_ADDR + ':' + process.env.DB_PORT_27017_TCP_PORT + '/' + pkg.name
};
var mongoConn = process.env.MONGO || mongoConns.docker;
console.log(mongoConn);
mongoose.connect(mongoConn);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
});

var app = express();
// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));

	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ key: 'tugboat.sess', secret: process.env.SECRET }));
	app.use(express.cookieParser( process.env.SECRET ));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(login.fake);

	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

/** ROUTES **/
app.get('/', main.index);

// passport auth
app.get('/auth/start', auth.start); // start the auth process
app.get('/auth/passport', passport.authenticate('nyu-passport')); // pass along to passport
app.get('/auth/passport/callback', passport.authenticate('nyu-passport', { successRedirect: '/auth/end', failureRedirect: '/auth/passport' })); // hear back from Passport
app.get('/auth/end', auth.finish); // finish the auth process

// API for backbone
app.post('/api/instances', main.create);
app.get('/api/instances', main.list);

/** PASSPORT */
// authentication with passport
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// oauth
passport.use('nyu-passport', new NYUPassportStrategy({
	clientID: process.env.PASSPORT_ID,
	clientSecret: process.env.PASSPORT_SECRET,
	callbackURL: process.env.BASE_URL + '/auth/passport/callback'
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({netID: profile.netID}, function(err, user, isNew) {
			// add the access token
			user.passport = accessToken;

			if (isNew) {
				request('http://passport.sg.nyuad.org/visa/github/token?access_token=' + accessToken, function(err, res, data) {
					data = JSON.parse(data);

					user.github.username = data.profile.username;
					user.github.token = data.access_token;

					user.save(function(err) {
						done(null, user);
					});
				});
			} else {
				user.save(function(err) {
				});
				done(null, user);
			}
		});
	}
));

// port
var port = process.env.PORT || 8080;

console.log('hello ' + port);

// start listening
app.listen( port , function() {
	console.log('Express server listening on port ' + port);
});