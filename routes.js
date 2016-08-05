module.exports = function(app, fs, io) {

	// routes -------------------------------------------------------

	app.get('/', function(req, res) {
		res.redirect('/index.html');
	});

	app.post('/post-login', function(req, res) {
		console.log(req.body);
		console.log(req.session);
		var registeredusers = JSON.parse(fs.readFileSync(__dirname + '/public/json/registered/registeredusers.json')); 
		registeredusers.some(function(user, index){
			console.log("user"+index+" is"+user.username);
			if(req.body.username == user.username && req.body.password == user.password) {
			req.session.username = req.body.username;
			res.send('authenticated');
			return true;
		}
		return false;
		});
		
	});

	app.post('/post-register', function(req, res) {
		var registeredusers = JSON.parse(fs.readFileSync(__dirname + '/public/json/registered/registeredusers.json'));
		// console.log(registeredusers);
		console.log(req.body);
		registeredusers.push(req.body);
		fs.writeFile(__dirname + '/public/json/registered/registeredusers.json', JSON.stringify(registeredusers), function(err,data) {
			if(err) {
				console.log(err);
			} else {
				console.log(data);
			}
		})
		res.send("new user created");
	});

	app.post('/getuserdata', function(req, res) {
		console.log(req.body.activeuser);
		res.sendFile(__dirname + '/public/json/data/data'+req.body.activeuser+'.json');
	});

	app.post('/updatetimeslots', function(req, res) {
		console.log("data received",req.body);
		var currentusername = req.body.username;
		// console.log("ccc ",currentusername);
		console.log("newuserdata",req.body.username);
		// var oldusersdata = JSON.parse(fs.readFileSync(__dirname + '/public/json/data/data'+currentusername+'.json'), 'utf-8');
		fs.writeFile(__dirname + '/public/json/data/data'+currentusername+'.json', JSON.stringify(req.body), function(err, data) {
			if(err) {
				console.log("error occurred",err);
			} else {
				console.log("written file",data);
			}
		});
		res.send('ok');
		io.emit('sync timeslots', req.body);
		io.emit('sync timeslots schedule', req.body);
	});

};