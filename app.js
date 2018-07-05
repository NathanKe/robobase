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

app.get('/',(request,response)=>{
	console.log("hit root!");
	response.render('index');
});

//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#route-middleware-to-protect-api-routes
//https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
function isAuthenticated(request,response,next){
	var token = request.cookies.token;
	if(token){
		jwt.verify(token,jwtSecret,(err,decoded)=>{
			if(err){
				response.redirect('/');
			}else{
				console.log('auth pass');
				next();
			}
		});
	}else{
		response.redirect('/');
	}
}
function roleClass(request,response,next){
	var bearer = jwt.decode(request.cookies.token,jwtSecret).bearer;
	var queryString = "select RoleClass from users join userRoleAssignment on users.userID = userroleassignment.userID join role on userroleassignment.roleID = role.roleID where userName = '"+bearer+"'";
	connection.query(queryString,(err,result)=>{
		if(err)throw err;
		response.locals.roleClass = result[0].RoleClass;
		next();
	});
}

app.get('/menu',isAuthenticated,roleClass,(request,response)=>{
	switch(response.locals.roleClass){
		case 'Student':
			response.render('menu');
		case 'Coach':
			response.redirect('/');
		case 'Admin':
			response.redirect('/');
	}
});

app.get('/users',isAuthenticated,(request,response)=>{
	connection.query("select userName from users",(err,data)=>{
		if(err)throw err;
		response.send(JSON.stringify(data));
	});
});

app.get('/test',(request,response)=>{
	console.log("hit!");
});

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
				var token = jwt.sign({bearer:username},jwtSecret,{expiresIn:'15m'});
				console.log(token);
				response.status(200);
				response.cookie('token',token);
				response.send();
			}else{
				response.status(400);
				response.send({err:"AuthFail"});
			}
		}
	});
});

console.log('running');
app.listen(8000);