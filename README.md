Tugboat
=======

Tugboat is a Docker-powered system for provisioning isolated SSH containers, with a web UI for managing SSH keys.

Docker
------
This now works with Docker, though you need to start Mongo as well.
```
docker build -t morgante/tugboat .
docker run --name mongo -P -d -t morgante/mongo
docker run --link mongo:db -v /var/code/docker/tugboat:/src -i -P -t morgante/tugboat
```