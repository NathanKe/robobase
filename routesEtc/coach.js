// endpoint handlers for coach pages

var express = require('express');
var router = express.Router();
var db = require('./database.js');
var jwt = require('./jwt.js');
var auth = require('./authMiddle.js');


router.get('/eventAvailability',auth.isAuthenticated,auth.hasTask('reportEventAvail'),(request,response)=>{
	if(response.locals.taskError){
		response.redirect('back');
	}else{
		response.render('./coach/eventAvailability');
	}
});

module.exports = router;