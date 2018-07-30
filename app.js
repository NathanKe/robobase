// Various library/module imports
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');

//app settings
var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));


//Import other file routes
app.use('/report',require('./routesEtc/report.js'));
app.use('/student',require('./routesEtc/student.js'));
app.use('/coach',require('./routesEtc/coach.js'));

// Allow 'Cross Origin' stuff.
// reference from https://stackoverflow.com/questions/7067966/how-to-allow-cors
// don't completely understand this part
app.use(function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// database js encapsulates all functions to/from database
var db = require('./routesEtc/database.js');

// jwt.js encapsulates json web token settings
var jwt = require('./routesEtc/jwt.js');

// authMiddle.js contains middleware authentication functions (i.e. isAuthenticated)
var auth = require('./routesEtc/authMiddle.js');


app.get('/',(request,response)=>{
	response.render('index');
});


//
// Get un/pw from client
// Query username, match client password + salt against user table password
// Send message on success
// On fail end - call handler on client side calls menu endpoint
//
app.post('/login',(request,response)=>{
	var username = request.body.username;
	
	db.userDetails(username,(err,result)=>{
		if(err)throw err;
		if(result.length != 1){
			response.status(400)
			response.send({err:"Username Not Found"})
		}else{
			var salt = result[0].salt;
			var pswdHash = crypto.createHash('sha512').update(salt+request.body.password).digest('hex');
			
			if(pswdHash == result[0].pswd){
				response.status(200);
				var token = jwt.sign({bearer:username,bearerID:result[0].userID},{expiresIn:'15m'});
				response.cookie('token',token);
				response.end();
			}else{
				response.status(400);
				response.send({err:"AuthFail"});
			}
		}
	});
});

app.get('/menu',auth.isAuthenticated,auth.getRoleClass,(request,response)=>{
	username = jwt.bearer(request.cookies.token);
	switch(response.locals.roleClass){
		case 'Student':
			response.render('menu-student',{taskError:"",username:username});
			break;
		case 'Coach':
			response.render('menu-coach',{taskError:"",username:username});
			break;
		case 'Admin':
			response.redirect('/');
			break;
	}
});

console.log('running');
app.listen(8000);