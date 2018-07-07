// Various library/module imports
var mysql = require('mysql');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var jwtSecret = 'Shhhhhhhhhh';
var crypto = require('crypto');

//app settings
var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));

// Allow 'Cross Origin' stuff.  
app.use(function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// single shared connection
var connection = mysql.createConnection({
		host: "localhost",
		user: "root",
		password:"",
		database: "robobase"
});
connection.connect();


//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#route-middleware-to-protect-api-routes
//https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
function isAuthenticated(request,response,next){
	var token = request.cookies.token;
	if(token){
		jwt.verify(token,jwtSecret,(err,decoded)=>{
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
	var bearer = jwt.decode(request.cookies.token,jwtSecret).bearer;
	var queryString = "select roleClass from users join userRoleAssignment on users.userID = userroleassignment.userID join role on userroleassignment.roleID = role.roleID where userName = '"+bearer+"'";
	connection.query(queryString,(err,result)=>{
		if(err)throw err;
		response.locals.roleClass = result[0].roleClass;
		next();
	});
}
function hasTask(findTask){
	return (request,response,next)=>{
		var bearer = jwt.decode(request.cookies.token,jwtSecret).bearer;
		var queryString = "select taskName from task join roletaskassignment on roletaskassignment.taskID = task.taskID join role on role.roleID = roletaskassignment.roleID join userroleassignment on userroleassignment.roleID = role.roleID join users on users.userID = userroleassignment.userID where username = '"+bearer+"'";
		connection.query(queryString,(err,result)=>{
			if(err)throw err;
			var found = false;
			for(var i = 0;i<result.length;i++){
				if(result[i].taskName == findTask){
					var found = true;
					break;
				}
			}
			
			if(found){
				next();
			}else{
				response.locals.taskError = "Missing Task"
				next();
			}
		})
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
	var queryString = "select * from users where username = '"+username+"'";
	connection.query(queryString,(err,result)=>{
		if(err)throw err;
		if(result.length != 1){
			response.status(400)
			response.send({err:"Username Not Found"})
		}else{
			var salt = result[0].salt;
			var pswdHash = crypto.createHash('sha512').update(salt+request.body.password).digest('hex');
			
			if(pswdHash == result[0].pswd){
				response.status(200);
				var token = jwt.sign({bearer:username,bearerID:result[0].userID},jwtSecret,{expiresIn:'15m'});
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
	switch(response.locals.roleClass){
		case 'Student':
			response.render('menu-student',{taskError:""});
			break;
		case 'Coach':
			response.redirect('/');
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
	userID = jwt.decode(request.cookies.token,jwtSecret).bearerID;
	
	queryString = "select event.eventID,userID,availability,eventName,startTime,endTime,notes from event join eventAvailability on event.eventID = eventAvailability.eventID where keyEvent = 1 and userID = "+userID+";";
	connection.query(queryString,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(JSON.stringify(result));
	});
});
app.post('/postAvailabilities',isAuthenticated,(request,response)=>{
	userID = jwt.decode(request.cookies.token,jwtSecret).bearerID;
	request.body.forEach((item,index)=>{
		queryString = "update eventavailability set availability='"+item.availSelect+"' where eventID = (select eventID from event where eventName = '"+item.eventName+"') and userID = "+userID;
		connection.query(queryString,(err,result)=>{
			if(err)throw err;
		});
	});
});

app.get('/studentCheckout',isAuthenticated,hasTask('partCheckout'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError});
	}else{
		response.render('studentCheckout');
	}
});

app.get('/partRequest',isAuthenticated,hasTask('partRequest'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError});
	}else{
		response.render('partRequest');
	}
});

console.log('running');
app.listen(8000);