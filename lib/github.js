var GitHub = require("github");

var github = new GitHub({
    version: "3.0.0",
});

github.authenticate({
    type: "basic",
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD
});

module.exports = github;