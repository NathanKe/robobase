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
app.use('/report',require('./report'));

// Allow 'Cross Origin' stuff.  
app.use(function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// database js encapsulates all functions to/from database
var db = require('./database.js');

// jwt.js encapsulates json web token settings
var jwt = require('./jwt.js');


//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#route-middleware-to-protect-api-routes
//https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
function isAuthenticated(request,response,next){
	var token = request.cookies.token;
	if(token){
		jwt.verify(token,(err,decoded)=>{
			if(err){
				console.log('auth fail - bad token');
				response.redirect('/');
			}else{
				next();
			}
		});
	}else{
		response.redirect('/');
	}
}
function getRoleClass(request,response,next){
	var bearer = jwt.bearer(request.cookies.token);
	
	db.getRoleClass(bearer,(err,result)=>{
		if(err)throw err;
		response.locals.roleClass = result;
		next();
	});
}
function hasTask(findTask){
	return (request,response,next)=>{
		var bearer = jwt.bearer(request.cookies.token);
		
		db.hasTask(bearer,findTask,(err,result)=>{
			if(err)throw err;
			if(result = 1){
				next();
			}else{
				response.locals.taskError = "Missing Task"
				next();
			}
		});
	}
}

app.get('/',(request,response)=>{
	console.log("hit root!");
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

app.get('/menu',isAuthenticated,getRoleClass,(request,response)=>{
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

app.get('/eventAvailability',isAuthenticated,hasTask('eventAvail'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError});
	}else{
		response.render('eventAvailability');
	}
});

app.get('/eventAvailabilityTable',(request,response)=>{
	userID = jwt.bearerID(request.cookies.token);
	
	db.eventAvailability(userID,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(JSON.stringify(result));
	});
});
app.post('/postAvailabilities',isAuthenticated,(request,response)=>{
	userID = jwt.bearerID(request.cookies.token);
	var callCount = request.body.count;
	var c = 0;
	request.body.forEach((item,index)=>{
		db.postEventAvailability(userID,item.eventName,item.availSelect,(err,result)=>{
			if(err)throw err;
			c++;
		});
	});
	
	while(c<callCount){/*wait*/}
	response.end();
});

app.get('/studentCheckout',isAuthenticated,hasTask('partCheckout'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError,username:jwt.bearer(request.cookies.token)});
	}else{
		response.render('studentCheckout');
	}
});

app.get('/partRequest',isAuthenticated,hasTask('partRequest'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError,username:jwt.bearer(request.cookies.token)});
	}else{
		response.render('partRequest');
	}
});

console.log('running');
app.listen(8000);