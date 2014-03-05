var express = require('express')
		, http = require('http')
		, url = require('url')
		, async = require('async')
		, request = require('request')
		, mongoose = require('mongoose')
		, _ = require('./public/lib/underscore')
		
var pkg = require('./package.json')
		, main = require('./lib/main')

var vms = require('./lib/vms');

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
  console.log('Connected to DB');

	User.create({"netID": "mp3255", "github": "morgante"}, function(err, user) {
		Container.create({"image": "morgante/ssh"}, function(err, container) {
			container.addUser(user, function(err, container) {
				console.log(err, container);
				// container.run({}, function(err, dat) {
				// 	console.log('container was run');
				// });
			});
		});
	});

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
	app.use(express.session({ secret: process.env.SECRET }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

// set up routes
app.get('/', main.index);

// port
var port = process.env.PORT || 8080;

console.log('hello ' + port);

// start listening
app.listen( port , function() {
  console.log('Express server listening on port ' + port);

});