// pn page load fill in current inventory and checkin/checkout root drop downs
function loadFunction(){
	pullInventory();
	outFillRootSelect();
	inFillRootSelect();
}

// Get current inventory data from DB
function pullInventory(){
	
	
	var call = $.ajax({
		type:"GET",
		url:"../report/inventoryAssignment",
		dataType:"json"
	})
	
	call.done((data)=>{
		
		table = $('#inventoryTable');
		head = $('<thead></thead>');
		headRow = $('<tr></tr>');
		
		colArray = Object.keys(data[0]);
		colObj = [];
		for(i=0;i<colArray.length;i++){
			headRow.append($('<td></td>').text(colArray[i]));
			colObj.push({data:colArray[i]})
		}
		head.append(headRow);
		table.append(head);
		
		
		$(document).ready( function () {
			$('#inventoryTable').DataTable({
				data:data,
				paging:false,
				columns:colObj
			});
		});
	});
	call.fail(()=>{console.log("fail")});
}

// fill checkout hierarchy root select
function outFillRootSelect(){
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyChild?id=10000",
		dataType:"json"
	})
	
	call.done((data)=>{
		var rootSelect = $('#outRootChildren');
		for(i=0;i<data.length;i++){
			var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemHierarchyID);
			rootSelect.append(opt);
		}
	});
	call.fail(()=>{console.log("fail")});
}

// fill checkout part selector
function outFillParts(hierarchyID){
	
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyParts?id="+hierarchyID,
		dataType:"json"
	})
	
	call.done((data)=>{
		var partSelect = $('#outPart');
		partSelect.empty();
		var blankOpt = $('<option></option>').text("").attr('value',"");
		partSelect.append(blankOpt);
		for(i=0;i<data.length;i++){
			var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemID);
			partSelect.append(opt);
		}
	});
	call.fail(()=>{console.log("fail")});
}

// manage cascading dropdowns as user navigates through item hierarchy tree
function outCascadeChildren(parentSel){
	newSelect = $('<select></select>');
	
	parentSelection = parentSel.value
	parentLevel = parseInt(parentSel.dataset.level)
	
	$('#checkoutSelector>select').filter(function(){return parseInt($(this).attr("data-level"))>parentLevel}).remove()
	
	newSelect.attr('data-level',parentLevel+1)
	newSelect.attr('onChange','outCascadeChildren(this)')
	
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyChild?id="+parentSelection,
		dataType:"json"
	})
	
	call.done((data)=>{
		if(data.length != 0){
			var blankOpt = $('<option></option>').text("").attr('value',"");
			newSelect.append(blankOpt)
			for(i=0;i<data.length;i++){
				var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemHierarchyID);
				newSelect.append(opt);
			}
			$('#checkoutSelector').append(newSelect);
		}
		
	});
	call.fail(()=>{console.log("fail")});
	
	outFillParts(parentSelection);
}

// on selected part, get available qty from DB and update select accordingly
function outUpdateAvailQty(){
	selectedPartID = $('#outPart').val();

	var call = $.ajax({
		type:"GET",
		url:"../report/itemAvailCount?itemid="+selectedPartID,
		dataType:"json"
	})
	
	call.done((data)=>{
		qtySelect = $('#outQuantity');
		qtySelect.empty();
		
		qtySelect.attr('disabled',false);
		$('#checkoutButton').prop('disabled',false);
		
		availQty = data[0].availQty;
		if(availQty > 0){
			for(i=1;i<=availQty;i++){
				var opt = $('<option></option>').text(i).attr('value',i);
				qtySelect.append(opt);
			}
		}else if(availQty == 0){
			$('#checkoutButton').prop('disabled',true);
			qtySelect.append($('<option></option>').text("0").attr('value',0))
			qtySelect.attr('disabled',true);
		}else if(availQty == -1){
			//-1 is a db marker return for restricted item
			$('#checkoutButton').prop('disabled',true);
			qtySelect.append($('<option></option>').text("RESTRICTED").attr('value',0))
			qtySelect.attr('disabled',true);
		}
	});
}

// post the checkout to the DB
function postCheckout(){
	quantity = $('#outQuantity').val();
	itemid = $('#outPart').val();
	
	postData = {
		itemid:itemid,
		quantity:quantity,
	}
	
	$.ajax({
		url:"http://localhost:8000/student/postCheckout",
		type:"POST",
		data:JSON.stringify(postData),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		complete: function(data){
			if(data.status == 200){
				location.reload();
			}else if(data.status == 400){
				alert(data.responseJSON.err);
			}
		}
	});
}

// Fill root hierarchy children for checkin
function inFillRootSelect(){
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyChild?id=10000",
		dataType:"json"
	})
	
	call.done((data)=>{
		var rootSelect = $('#inRootChildren');
		for(i=0;i<data.length;i++){
			var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemHierarchyID);
			rootSelect.append(opt);
		}
	});
	call.fail(()=>{console.log("fail")});
}

// fill parts select for selected hierarchy level for checkin
function inFillParts(hierarchyID){
	
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyParts?id="+hierarchyID,
		dataType:"json"
	})
	
	call.done((data)=>{
		var partSelect = $('#inPart');
		partSelect.empty();
		var blankOpt = $('<option></option>').text("").attr('value',"");
		partSelect.append(blankOpt);
		for(i=0;i<data.length;i++){
			var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemID);
			partSelect.append(opt);
		}
	});
	call.fail(()=>{console.log("fail")});
}

// manage hierarchy level cascade dropdown for checkin
function inCascadeChildren(parentSel){
	newSelect = $('<select></select>');
	
	parentSelection = parentSel.value
	parentLevel = parseInt(parentSel.dataset.level)
	
	$('#checkinSelector>select').filter(function(){return parseInt($(this).attr("data-level"))>parentLevel}).remove()
	
	newSelect.attr('data-level',parentLevel+1)
	newSelect.attr('onChange','inCascadeChildren(this)')
	
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyChild?id="+parentSelection,
		dataType:"json"
	})
	
	call.done((data)=>{
		if(data.length != 0){
			var blankOpt = $('<option></option>').text("").attr('value',"");
			newSelect.append(blankOpt)
			for(i=0;i<data.length;i++){
				var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemHierarchyID);
				newSelect.append(opt);
			}
			$('#checkinSelector').append(newSelect);
		}
		
	});
	call.fail(()=>{console.log("fail")});
	
	inFillParts(parentSelection);
}

// get from DB and update UI possible checkin quantities
function inUpdateAvailQty(){
	selectedPartID = $('#inPart').val();
	
	var call = $.ajax({
		type:"GET",
		url:"../report/itemAssignedCount?itemid="+selectedPartID,
		dataType:"json"
	})
	
	call.done((data)=>{
		qtySelect = $('#inQuantity');
		qtySelect.empty();
		
		qtySelect.attr('disabled',false);
		$('#checkinButton').prop('disabled',false);
		
		assignedQty = data[0].quantity;
		if(assignedQty != 0){
			for(i=1;i<=assignedQty;i++){
				var opt = $('<option></option>').text(i).attr('value',i);
				qtySelect.append(opt);
			}
		}else{
			$('#checkinButton').prop('disabled',true);
			qtySelect.append($('<option></option>').text("0").attr('value',0))
			qtySelect.attr('disabled',true);
		}
	});
}


//essentially an exact rewrite of postCheckout, but we negate the quantity to make it a checkin
function postCheckin(){
	quantity = -1*parseInt($('#inQuantity').val());
	itemid = $('#inPart').val();
	
	postData = {
		itemid:itemid,
		quantity:quantity,
	}
	
	$.ajax({
		url:"http://localhost:8000/student/postCheckout",
		type:"POST",
		data:JSON.stringify(postData),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		complete: function(data){
			if(data.status == 200){
				location.reload();
			}else if(data.status == 400){
				alert(data.responseJSON.err);
			}
		}
	});
}
