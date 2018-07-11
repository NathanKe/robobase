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
	queryString = `select taskName from task 
	join roletaskassignment on roletaskassignment.taskID = task.taskID 
	join role on role.roleID = roletaskassignment.roleID 
	join userroleassignment on userroleassignment.roleID = role.roleID 
	join users on users.userID = userroleassignment.userID 
	where username = ? and taskName = ?`;
	pool.query(queryString,[user,task],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result.length);
		}
	})
}

exports.eventAvailability = (userID,callback)=>{
	queryString = `select event.eventID,userID,availability,eventName,startTime,endTime,notes 
	from event 
	join eventAvailability on event.eventID = eventAvailability.eventID 
	where keyEvent = 1 and userID = ?;`;
	pool.query(queryString,[userID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.postEventAvailability = (userID,eventName,availability,callback)=>{
	queryString = `update eventavailability set availability=? 
	where eventID = (select eventID from event where eventName = ?) and userID = ?`;
	
	pool.query(queryString,[availability,eventName,userID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	})
}

exports.reportEventAvailability = (callback)=>{
	queryString = `select eventName,teamname,username,availability,startTime from eventavailability 
		join event on eventavailability.eventID = event.eventID 
		join users on eventavailability.userID = users.userid
		join teamuserassignment on users.userid = teamuserassignment.userID
		join team on team.teamid = teamuserassignment.teamid
		order by eventname,teamname,username;`
	
	pool.query(queryString,(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.reportInventoryAssignment = (userID,callback)=>{
	queryString = `select itemHierarchy.description as category, inventoryitem.description as item, inventoryassignment.quantity as count from inventoryassignment
	join inventoryitem on inventoryitem.itemID = inventoryassignment.itemID
	join itemhierarchy on itemhierarchy.itemHierarchyID = inventoryitem.itemHierarchyID
	join team on inventoryassignment.teamID = team.teamID 
	join teamuserassignment on teamuserassignment.teamID = team.teamID 
	where userID =?;`
	
	pool.query(queryString,[userID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.hierarchyChild = (hierarchyID,callback)=>{
	queryString = `select * from itemHierarchy where parentID = ? and itemHierarchyID <> 10000;`
	
	pool.query(queryString,[hierarchyID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.hierarchyParts = (hierarchyID,callback)=>{
	queryString = `select * from inventoryitem where itemHierarchyID = ?`;
	
	pool.query(queryString,[hierarchyID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.itemAvailCount = (itemID,callback)=>{
	queryString = `
		select ifnull(
			(select totalquantity-assignedQty as availQty 
			from (select sum(quantity) as assignedQty from inventoryassignment where itemid = ?) as assigned
			join inventoryitem 
			join itemrestriction on itemrestriction.itemRestrictionID = inventoryitem.itemRestrictionID
			where itemid= ? and itemrestriction.itemRestrictionID = 10000)
		,-1) as availQty`;
	
	pool.query(queryString,[itemID,itemID],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.itemAssignedCount = (itemID,userid,callback)=>{
	queryString = `
		select quantity from inventoryassignment 
		join teamuserassignment on inventoryassignment.teamid = teamuserassignment.teamid 
		where itemid = ? and userid = ?;`
	
	pool.query(queryString,[itemID,userid],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}

exports.postCheckout = (userid,itemid,quantity,callback)=>{
	queryString = `call assign_inventory(?,?,?)`
	
	pool.query(queryString,[userid,itemid,quantity],(err,result)=>{
		if(err){
			callback(true,{})
		}else{
			callback(false,result);
		}
	});
}