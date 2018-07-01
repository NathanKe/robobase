var mysql = require('mysql');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');


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

app.get('/users',(req,res)=>{
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
			response.send(JSON.stringify(result[0]));
		}
	});
});

app.listen(8000);