var express = require('express');
var router = express.Router();
var db = require('./database.js');
var jwt = require('./jwt.js');

function isAuthenticated(request,response,next){
	var token = request.cookies.token;
	if(token){
		jwt.verify(token,(err,decoded)=>{
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
function hasTask(findTask){
	return (request,response,next)=>{
		var bearer = jwt.bearer(request.cookies.token);
		
		db.hasTask(bearer,findTask,(err,result)=>{
			if(err)throw err;
			if(result = 1){
				next();
			}else{
				response.locals.taskError = "Missing Task"
				next();
			}
		});
	}
}


router.get('/eventAvailability',isAuthenticated,hasTask('eventAvail'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError});
	}else{
		response.render('./student/eventAvailability');
	}
});

router.get('/eventAvailabilityTable',(request,response)=>{
	userID = jwt.bearerID(request.cookies.token);
	
	db.eventAvailability(userID,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(JSON.stringify(result));
	});
});
router.post('/postAvailabilities',isAuthenticated,(request,response)=>{
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

router.get('/studentCheckout',isAuthenticated,hasTask('partCheckout'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError,username:jwt.bearer(request.cookies.token)});
	}else{
		response.render('./student/studentCheckout');
	}
});

router.get('/partRequest',isAuthenticated,hasTask('partRequest'),(request,response)=>{
	if(response.locals.taskError){
		response.render('menu-student',{taskError:response.locals.taskError,username:jwt.bearer(request.cookies.token)});
	}else{
		response.render('./student/partRequest');
	}
});

module.exports = router;