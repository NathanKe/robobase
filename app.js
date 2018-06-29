var mysql = require('mysql');
var express = require('express');
var request = require('request');


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

app.listen(8000);