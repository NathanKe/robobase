var express = require('express');
var router = express.Router();

router.get('/eventAvailability',(request,response)=>{
	console.log(jwtSecret);
	response.status(200);
	response.send("asdf");
});

module.exports = router;