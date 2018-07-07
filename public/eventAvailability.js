function pullEventData(){
	var call = $.ajax({
		type:"GET",
		url:"eventAvailabilityTable",
		dataType:"json"
	})
	
	call.done((data)=>{fillTable(data)});
	call.fail(()=>{console.log("fail")});
}

function fillTable(data){
	var table = $('#eventTable');
	
	data.forEach((item,index)=>{
		var row = $('<tr></tr>');
		var nameCell = $('<td></td>').text(item.eventName).addClass('eventName');
		var startCell = $('<td></td>').text(item.startTime.split(/T/)[0]);
		var noteCell = $('<td></td>').text(item.notes);
		var selection = $('<select></select>').addClass('availSelect');
		
		var optionY = $('<option value="Yes">Yes</option>');
		var optionN = $('<option value="No">No</option>');
		var optionB = $('<option value=""></option>');
		
		switch(item.availability){
			case "Yes":
				optionY.attr('selected',true);
				break;
			case "No":
				optionN.attr('selected',true);
				break;
			case "":
				optionB.attr('selected',true);
				break;
		}
		
		selection.append(optionY)
		selection.append(optionN)
		selection.append(optionB)
		
		row.append(nameCell);
		row.append(startCell);
		row.append(noteCell);
		row.append(selection);
		table.append(row);
	});
}

function postAvailabilities(){
	var eventAvailData = [];
	$('#eventTable>tr').each((index,item)=>{
		eventAvailData.push({
			eventName:$(item).children('.eventName')[0].innerText,
			availSelect:$(item).children('.availSelect').find(':selected').text()
		})
	});
	
	var call = $.ajax({
		type:"POST",
		url:"postAvailabilities",
		data:JSON.stringify(eventAvailData),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
	}).done(alert("updated"));
}