function fillSelect(){
	var sel = $('#x');
	$.get('http://localhost:8000/users',function(res){
		JSON.parse(res).forEach((item,index)=>{
			var opt = document.createElement("option");
			opt.value = item.userName;
			opt.innerHTML = item.userName;
			sel.append(opt);
		});
	});
}