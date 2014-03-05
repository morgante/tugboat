var _ = require('../public/lib/underscore');
var GitHub = require("github");

console.log('node', process.version);

var github = new GitHub({
    version: "3.0.0",
});

github.authenticate({
    type: "basic",
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD
});

exports.store = function(opts, callback) {
	opts = _.defaults(opts, {
        user: "morgante",
        repo: "tugboat",
        path: "keys/",
        name: "lol.pub",
        message: "Add file again",
        content: "Hello Worlds of sin",
        branch: "keys"
    });
	github.repos.createFile({
		user: opts.user,
        repo: opts.repo,
        path: opts.path + opts.name,
        message: opts.message,
        content: (new Buffer(opts.content)).toString('base64'),
        branch: opts.branch
	},
    function(err, res) {
		callback(err, res);
    });
};