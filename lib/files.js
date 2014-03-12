var _ = require('../public/lib/underscore');
var util = require('util');

var github = require('./github');

exports.store = function(opts, callback) {
	opts = _.defaults(opts, {
        user: "morgante",
        repo: "tugboat",
        path: "keys/",
        name: "lol.pub",
        message: "Add public SSH key",
        content: "Helllo",
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
        var url = util.format('https://raw.githubusercontent.com/%s/%s/%s/%s%s',
            opts.user,
            opts.repo,
            opts.branch,
            opts.path,
            opts.name);
		callback(err, url, res);
    });
};