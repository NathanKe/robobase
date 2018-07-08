var express = require('express');
var router = express.Router();
var db = require('./database.js');
var jwt = require('./jwt.js');
var auth = require('./authMiddle.js');

router.get('/eventAvailability',auth.isAuthenticated,auth.hasTask('eventAvail'),(request,response)=>{
	if(response.locals.taskError){
		response.redirect('back');
	}else{
		response.render('./student/eventAvailability');
	}
});

router.get('/eventAvailabilityTable',auth.isAuthenticated,(request,response)=>{
	userID = jwt.bearerID(request.cookies.token);
	
	db.eventAvailability(userID,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(JSON.stringify(result));
	});
});
router.post('/postAvailabilities',auth.isAuthenticated,(request,response)=>{
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

router.get('/studentCheckout',auth.isAuthenticated,auth.hasTask('partCheckout'),(request,response)=>{
	if(response.locals.taskError){
		response.redirect('back');
	}else{
		response.render('./student/studentCheckout');
	}
});

router.get('/partRequest',auth.isAuthenticated,auth.hasTask('partRequest'),(request,response)=>{
	if(response.locals.taskError){
		response.redirect('back');
	}else{
		response.render('./student/partRequest');
	}
});

module.exports = router;