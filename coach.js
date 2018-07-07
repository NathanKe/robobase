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
			if(result == 1){
				next();
			}else{
				response.locals.taskError = "Missing Task"
				next();
			}
		});
	}
}


router.get('/eventAvailability',isAuthenticated,hasTask('reportEventAvail'),(request,response)=>{
	if(response.locals.taskError){
		response.redirect('back');
	}else{
		response.render('./coach/eventAvailability');
	}
});

module.exports = router;