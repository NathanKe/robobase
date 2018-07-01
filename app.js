var mysql = require('mysql');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var jwtSecret = 'Shhhhhhhhhh';
var crypto = require('crypto');


var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password:"",
	database: "robobase"
});
connection.connect((err)=>{
	if(err)throw err;
	console.log("Connected!");
});

function userQuery(){
	connection.query("select * from users",(err,res)=>{
		if(err)throw err;
		return JSON.stringify(res);
	});
}

var app = express();
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

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
	var token = req.body.token || req.query.token;
	console.log(token);
	if(token){
		jwt.verify(token,jwtSecret,(err,decoded)=>{
			if(err){
				res.status(403).send({err:'validation fail'});
			}else{
				next();
			}
		});
	}else{
		res.status(403).send({err:'no token'});
	}
}

app.get('/users',isAuthenticated,(req,res)=>{
	connection.query("select userName from users",(err,data)=>{
		if(err)throw err;
		res.send(JSON.stringify(data));
	});
});

app.get('/test',(req,res)=>{
	console.log("hit!");
	res.send("hit!");
});

app.post('/login',(req,response)=>{
	console.log("login hit");

	var username = req.body.username;
	
	var queryString = "select * from users where username = '"+username+"'";
	connection.query(queryString,(err,result)=>{
		if(err)throw err;
		if(result.length != 1){
			console.log("multiple found?");
		}else{
			console.log("one found");
			var salt = result[0].salt;
			var pswdHash = crypto.createHash('sha512').update(salt+req.body.password).digest('hex');
			
			if(pswdHash == result[0].pswd){
				var token = jwt.sign({data:username},jwtSecret,{expiresIn:'15m'});
				console.log(token);
				response.send({token:token});
			}else{
				response.send({err:"AuthFail"});
			}
		}
	});
});

app.listen(8000);