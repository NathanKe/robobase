// pull event availability data from DB
function pullEventData(){
	var call = $.ajax({
		type:"GET",
		url:"../report/eventAvailability",
		dataType:"json"
	})
	
	call.done((data)=>{fillTable(data);fillStats(data)});
	call.fail(()=>{console.log("fail")});
}

// Fill granular results table
function fillTable(data){
	table = $('#availTable');
	
	head = $('<thead></thead>');
	headRow = $('<tr></tr>');
	headEventName = $('<th></th>').text("Event");
	headDate = $('<th></th>').text("Date");
	headTeam = $('<th></th>').text("Team");
	headStudent = $('<th></th>').text("Student");
	headAvail = $('<th></th>').text("Avail?");
	
	headRow.append(headEventName);
	headRow.append(headDate);
	headRow.append(headTeam);
	headRow.append(headStudent);
	headRow.append(headAvail);
	
	head.append(headRow);
	
	table.append(head);
	
	body = $('<tbody></tbody');
	
	data.forEach((item,index)=>{
		row = $('<tr></tr>');
		eventCell = $('<td></td>').text(item.eventName);
		dateCell = $('<td></td>').text((item.startTime.split("T"))[0]);
		teamCell = $('<td></td>').text(item.teamname);
		userCell = $('<td></td>').text(item.username);
		availCell = $('<td></td>').text(item.availability);
		
		row.append(eventCell);
		row.append(dateCell);
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

// fill overview stats table
function fillStats(data){
	table = $('#statsTable')
	
	head = $('<thead></thead>');
	headRow = $('<tr></tr>');
	headEventName = $('<th></th>').text("Event");
	headCountY = $('<th></th>').text("Yes Count");
	headCountN = $('<th></th>').text("No Count");
	headCountB = $('<th></th>').text("Blank Count");
	
	headRow.append(headEventName);
	headRow.append(headCountY);
	headRow.append(headCountN);
	headRow.append(headCountB);
	
	head.append(headRow);
	table.append(head);
	
	body = $('<tbody></tbody');
	
	eventNames = _.uniq(data,'eventName');
	eventNames.forEach((item,index)=>{
		curName = item.eventName;
		yCount = _.where(data,{eventName:curName,availability:'Yes'}).length
		nCount = _.where(data,{eventName:curName,availability:'No'}).length
		bCount = _.where(data,{eventName:curName,availability:''}).length
		
		row = $('<tr></tr>');
		eventCell = $('<td></td>').text(item.eventName);
		yesCell = $('<td></td>').text(yCount);
		noCell = $('<td></td>').text(nCount);
		blankCell = $('<td></td>').text(bCount);
		
		row.append(eventCell);
		row.append(yesCell);
		row.append(noCell);
		row.append(blankCell);
		
		body.append(row);
	});
	
	table.append(body);
}