# DOCKER-VERSION 0.8.0
FROM 		ubuntu:12.04

# Install node
RUN			apt-get update
RUN			apt-get install -y python-software-properties python g++ make
RUN			add-apt-repository ppa:chris-lea/node.js
RUN			apt-get update
RUN 		apt-get install -y nodejs 
RUN 		node --version

RUN			npm install -g supervisor

# Install foreman
RUN			apt-get -y install rubygems
RUN			gem install foreman

# Build tools, for Mongo
RUN 		apt-get -y install build-essential

# Load in source
ADD 		. /src
RUN			cd /src && npm install

EXPOSE  	8080

WORKDIR		/src
CMD		 	["foreman", "start"]