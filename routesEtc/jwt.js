// Configuration of JWT, expose the necessary subset of functions to other
// route files.
// Keeps JWT secret in one place only.

jwtSecret = 'Shhhhhhhhhh';
jwt = require('jsonwebtoken');

exports.bearer = (token)=>{
	return jwt.decode(token,jwtSecret).bearer;
}

exports.bearerID = (token)=>{
	return jwt.decode(token,jwtSecret).bearerID;
}

exports.verify = (token,callback)=>{
	jwt.verify(token,jwtSecret,(err,decoded)=>{
		if(err){
			callback(true,{});
		}else{
			callback(false,{});
		}
	});
}

exports.sign = (object,expire)=>{
	return jwt.sign(object,jwtSecret,expire);
}