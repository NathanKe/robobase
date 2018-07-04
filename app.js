var mysql = require('mysql');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var jwtSecret = 'Shhhhhhhhhh';
var crypto = require('crypto');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));

// Allow 'Cross Origin' stuff.  
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/',(req,res)=>{
	console.log("hit root!");
	res.render('index');
});

//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#route-middleware-to-protect-api-routes
//https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
function isAuthenticated(req,res,next){
	var token = req.cookies.token;
	if(token){
		jwt.verify(token,jwtSecret,(err,decoded)=>{
			if(err){
				res.redirect('/');
			}else{
				next();
			}
		});
	}else{
		res.redirect('/');
	}
}

app.get('/users',isAuthenticated,(req,res)=>{
	connection.query("select userName from users",(err,data)=>{
		if(err)throw err;
		res.send(JSON.stringify(data));
	});
});

app.get('/menu',isAuthenticated,(req,res)=>{
	console.log('menu page');
	res.render('menu');
});

app.get('/test',(req,res)=>{
	console.log("hit!");
});

app.post('/login',(req,response)=>{
	var connection = mysql.createConnection({
			host: "localhost",
			user: "root",
			password:"",
			database: "robobase"
	});
	
	connection.connect((err)=>{
		if(err)throw err;
		
		var username = req.body.username;
		var queryString = "select * from users where username = '"+username+"'";
		connection.query(queryString,(err,result)=>{
			if(err)throw err;
			if(result.length != 1){
				response.status(400)
				response.send({err:"Username Not Found"})
			}else{
				var salt = result[0].salt;
				var pswdHash = crypto.createHash('sha512').update(salt+req.body.password).digest('hex');
				
				if(pswdHash == result[0].pswd){
					var token = jwt.sign({data:username},jwtSecret,{expiresIn:'15m'});
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
});

console.log('running');
app.listen(8000);