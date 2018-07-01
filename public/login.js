function loginClick(){
	var username = $('#username').val();
	var password = $('#password').val();
	
	var postData = {username:username,password:password};
	
	$.ajax({
		url:"http://localhost:8000/login",
		type:"POST",
		data:JSON.stringify(postData),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		complete: function(data){
			console.log(data.responseJSON);
		}
	});
}