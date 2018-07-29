var db = require('./database.js');
var jwt = require('./jwt.js');

//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#route-middleware-to-protect-api-routes
//https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
exports.isAuthenticated = (request,response,next)=>{
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
exports.getRoleClass = (request,response,next)=>{
	var bearer = jwt.bearer(request.cookies.token);
	
	db.getRoleClass(bearer,(err,result)=>{
		if(err)throw err;
		response.locals.roleClass = result;
		next();
	});
}
exports.hasTask = (findTask)=>{
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