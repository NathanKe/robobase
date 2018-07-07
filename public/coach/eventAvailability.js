function pullEventData(){
	var call = $.ajax({
		type:"GET",
		url:"../report/eventAvailability",
		dataType:"json"
	})
	
	call.done((data)=>{fillTable(data)});
	call.fail(()=>{console.log("fail")});
}

function fillTable(data){
	table = $('#availTable');
	
	head = $('<thead></thead>');
	headRow = $('<tr></tr>');
	headEventName = $('<th></th>').text("Event");
	headTeam = $('<th></th>').text("Team");
	headStudent = $('<th></th>').text("Student");
	headAvail = $('<th></th>').text("Avail?");
	
	headRow.append(headEventName);
	headRow.append(headTeam);
	headRow.append(headStudent);
	headRow.append(headAvail);
	
	head.append(headRow);
	
	table.append(head);
	
	body = $('<tbody></tbody');
	
	data.forEach((item,index)=>{
		row = $('<tr></tr>');
		eventCell = $('<td></td>').text(item.eventName);
		teamCell = $('<td></td>').text(item.teamname);
		userCell = $('<td></td>').text(item.username);
		availCell = $('<td></td>').text(item.availability);
		
		row.append(eventCell);
		row.append(teamCell);
		row.append(userCell);
		row.append(availCell);
		
		body.append(row);
	});
	
	table.append(body);
	
	$(document).ready( function () {
		$('#availTable').DataTable({
			paging:false,
		});
	});
}