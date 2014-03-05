var Docker = require('dockerode');

var docker = new Docker({
	host: 'http://10.0.2.15',
	port: 4243
});

exports.run = function(opts, cb) {
	console.log('test test test');

	var containerOpts = {
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
	};

	var startOpts = {
		'PublishAllPorts': true
	};

	docker.createContainer(containerOpts, function(err, container) {
		if (err) {
			console.log(err);
		} else {
			container.start(startOpts, function(err, data) {
				console.log('container started');
				console.log(err, data);
			});
		}
	});

};