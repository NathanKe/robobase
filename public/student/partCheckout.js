function loadFunction(){
	pullInventory();
	fillRootSelect();
}

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

function fillRootSelect(){
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyChild?id=10000",
		dataType:"json"
	})
	
	call.done((data)=>{
		var rootSelect = $('#rootChildren');
		for(i=0;i<data.length;i++){
			var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemHierarchyID);
			rootSelect.append(opt);
		}
	});
	call.fail(()=>{console.log("fail")});
}

function fillParts(hierarchyID){
	
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyParts?id="+hierarchyID,
		dataType:"json"
	})
	
	call.done((data)=>{
		var partSelect = $('#part');
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

function cascadeChildren(parentSel){
	newSelect = $('<select></select>');
	
	parentSelection = parentSel.value
	parentLevel = parseInt(parentSel.dataset.level)
	
	$('#checkoutSelector>select').filter(function(){return parseInt($(this).attr("data-level"))>parentLevel}).remove()
	
	newSelect.attr('data-level',parentLevel+1)
	newSelect.attr('onChange','cascadeChildren(this)')
	
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
	
	fillParts(parentSelection);
}

function updateAvailQty(){
	selectedPartID = $('#part').val();

	var call = $.ajax({
		type:"GET",
		url:"../report/itemAvailCount?itemid="+selectedPartID,
		dataType:"json"
	})
	
	call.done((data)=>{
		qtySelect = $('#quantity');
		qtySelect.empty();
		
		qtySelect.attr('disabled',false);
		$('#checkoutButton').prop('disabled',false);
		
		availQty = data[0].availQty;
		if(availQty != 0){
			for(i=1;i<=availQty;i++){
				var opt = $('<option></option>').text(i).attr('value',i);
				qtySelect.append(opt);
			}
		}else{
			$('#checkoutButton').prop('disabled',true);
			qtySelect.attr('disabled',true);
		}
	});
}

function postCheckout(){
	quantity = $('#quantity').val();
	itemid = $('#part').val();
	
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
