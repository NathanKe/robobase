var mysql = require('mysql');
var express = require('express');
var request = require('request');


var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password:""
})

connection.connect((err)=>{
	if(err)throw err;
	console.log("Connected!");
});

var app = express()
app.set('view engine','ejs')

app.get('/',(req,res)=>{
	res.render('index');
});

app.listen(8000);