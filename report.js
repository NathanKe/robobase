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


module.exports = router;