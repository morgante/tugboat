var Docker = require('dockerode');
var _ = require('../public/lib/underscore');

var docker = new Docker({
	host: process.env.DOCKER_HOST,
	port: process.env.DOCKER_PORT
});

exports.remove = function(options, callback) {
	console.log('whatt....');
	console.log(options);
	var container = docker.getContainer(options.container);

	container.kill(function(err) {
		console.log('killed', err);
		if (err) {
			callback(err);
		} else {
			container.remove(function(err) {
				console.log('removed', err);
				if (err) {
					callback(err);
				} else {
					var image = docker.getImage(options.image);

					image.remove(function(err) {
						if (err) {
							callback(err);
						} else {
							console.log('image r', err);
							callback(err);
						}
					});
				}
			});
		}
	});
};

exports.insert = function(options, cb) {
	options = _.defaults(options, {
		'image': 'ubuntu',
		'path': '',
		'url': ''
	});

	var image = docker.getImage(options.image);

	image.insert({path: options.path, url: options.url}, function(err, stream) {
		console.log('inserting image');
		if (err) {
			cb(err, null);
		} else {
			var chunks = '';
			stream.on('data', function(chunk) {
				chunks += chunk;
			});

			stream.on('end', function() {
				// Extract id from {"status":"Downloading","progressDetail":{"current":1215,"total":-1,"start":1394043522},"progress":"1.215 kB","id":"5d5312b74ab6"}{"status":"3ff9c016b34c7e6e16eca91c977d8e3aebbbe37f3763b3963e89c6f39692d8b0"}
				data = chunks.match(/{"status":"(\w+)"}/);

				if (data === undefined || data[1] === undefined) {
					cb("Could not find id in " + chunks, null);
				} else{
					cb(null, data[1]);
				}
			});
		}
	});
};

exports.run = function(options, cb) {
	var containerOpts = _.defaults({
		Image: options.image,
	}, {
		'Image': 'morgante/ssh',
		'Hostname': '',
		'User': '',
		'AttachStdin': true,
		'AttachStdout': true,
		'AttachStderr': true,
		'Tty': true,
		'OpenStdin': true,
		'StdinOnce': false,
		'Env': null,
		'Cmd': ['/usr/sbin/sshd','-D'],
		'Dns': ['8.8.8.8', '8.8.4.4'],
		'Volumes': {},
		'VolumesFrom': '',
		'ExposedPorts': {"22/tcp": {}}
	});

	var startOpts = {
		'PublishAllPorts': true
	};

	docker.createContainer(containerOpts, function(err, container) {
		if (err) {
			cb(err, null);
		} else {
			container.start(startOpts, function(err, data) {
				if (err) {
					cb(err, null);
				} else {
					container.inspect(function(err, data) {
						console.log(data);
						
						cb(null, {
							"container": container,
							"name": data.Name.replace('/',''),
							"data": data
						});
					});
				}
			});
		}
	});

};