var express = require('express');
var router = express.Router();
var db = require('./database.js');

router.get('/eventAvailability',(request,response)=>{
	db.reportEventAvailability((err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(result);
	});
});

module.exports = router;