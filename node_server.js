// "use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
const PORT = 8081;
const server = app.listen(PORT, function() {
	console.log("node server started on http://localhost:"+PORT);
});

const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(session({
	resave: true,
	secret: '123123',
	saveUninitialized: true,
}));

io.on('connection', function(socket) {
	console.log("you are online");
	// var userdata = JSON.parse(fs.readFileSync(__dirname + '/public/json/data/datavaibhav.json'));
	// socket.emit('sync timeslots', userdata);
	// socket.emit('sync timeslots schedule', userdata);

	socket.on('disconnect', function() {
		console.log('you are currently offline');
	});
	socket.on('message', function(message) {
		console.log('received message:',message);
	});
});

// calling routes for asynchronous calls
require('./routes.js')(app, fs, io);