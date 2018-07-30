// Endpoints for getting data/reports
// No pages rendered from these endpoints
// All generally call the underlying database query
// Helps to define another layer of abstraction between
// client and database.

var express = require('express');
var router = express.Router();
var db = require('./database.js');
var jwt = require('./jwt.js');


router.get('/eventAvailability',(request,response)=>{
	db.reportEventAvailability((err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(result);
	});
});

router.get('/inventoryAssignment',(request,response)=>{
	bearerID = jwt.bearerID(request.cookies.token);
	db.reportInventoryAssignment(bearerID,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(result);
	});
});

router.get('/hierarchyChild',(request,response)=>{
	nodeID = request.query.id;
	db.hierarchyChild(nodeID,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(result);
	});
});

router.get('/hierarchyParts',(request,response)=>{
	nodeID = request.query.id;
	db.hierarchyParts(nodeID,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(result);
	});
});

router.get('/itemAvailCount',(request,response)=>{
	itemid = request.query.itemid;
	db.itemAvailCount(itemid,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(result);
	});
});

router.get('/itemAssignedCount',(request,response)=>{
	itemid = request.query.itemid;
	userid = jwt.bearerID(request.cookies.token)
	db.itemAssignedCount(itemid,userid,(err,result)=>{
		if(err)throw err;
		response.status(200);
		response.send(result);
	});
});

module.exports = router;