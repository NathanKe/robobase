var mysql = require('mysql');
var pool = mysql.createPool({
		host: "localhost",
		user: "root",
		password:"",
		database: "robobase",
		connectionLimit: 40
});

exports.userDetails = (user,callback)=>{
	var queryString = "select * from users where username = ?";
	pool.query(queryString,[user],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.getRoleClass = (user,callback)=>{
	queryString = "select roleClass from users join userRoleAssignment on users.userID = userroleassignment.userID join role on userroleassignment.roleID = role.roleID where userName = ?";
	pool.query(queryString,[user],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result[0].roleClass);
		}
	});
}

exports.hasTask = (user,task,callback)=>{
	var queryString = "select taskName from task join roletaskassignment on roletaskassignment.taskID = task.taskID join role on role.roleID = roletaskassignment.roleID join userroleassignment on userroleassignment.roleID = role.roleID join users on users.userID = userroleassignment.userID where username = ? and taskName = ?";
	pool.query(queryString,[user,task],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result.length);
		}
	})
}

exports.eventAvailability = (userID,callback)=>{
	queryString = "select event.eventID,userID,availability,eventName,startTime,endTime,notes from event join eventAvailability on event.eventID = eventAvailability.eventID where keyEvent = 1 and userID = ?;";
	pool.query(queryString,[userID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.postEventAvailability = (userID,eventName,availability,callback)=>{
	var queryString = "update eventavailability set availability=? where eventID = (select eventID from event where eventName = ?) and userID = ?";
	
	pool.query(queryString,[availability,eventName,userID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	})
}