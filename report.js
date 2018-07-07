var express = require('express');
var router = express.Router();

router.get('/eventAvailability',(request,response)=>{
	console.log("hit");
	response.status(200);
	response.send("asdf");
});

module.exports = router;