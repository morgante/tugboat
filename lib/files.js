var _ = require('../public/lib/underscore');

var github = require('./github');

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