var Docker = require('dockerode');
var _ = require('../public/lib/underscore');

var docker = new Docker({
	host: 'http://10.0.2.15',
	port: 4243
});

exports.insert = function(options, cb) {
	options = _.defaults(options, {
		'image': 'ubuntu',
		'path': '',
		'url': ''
	});

	var image = docker.getImage(options.image);

	// image.inspect(function(err, data) {
		// console.log(err, data);
	// });

	// console.log(options, image);

	image.insert({
		path: options.path,
		url: options.url
	}, function(err, stream) {
		if (err) {
			cb(options, err, stream);
		} else {
			cb(null, stream);
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
					cb(null, {
						"container": container,
						"data": data
					});
				}
			});
		}
	});

};