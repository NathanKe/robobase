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

function cascadeChildren(parentSel){
	newSelect = $('<select></select>');
	
	
	
	
	
	parentSelection = parentSel.value
	parentLevel = parseInt(parentSel.dataset.level)
	
	$('select').filter(function(){return parseInt($(this).attr("data-level"))>parentLevel}).remove()
	
	newSelect.attr('data-level',parentLevel+1)
	newSelect.attr('onChange','cascadeChildren(this)')
	
	var call = $.ajax({
		type:"GET",
		url:"../report/hierarchyChild?id="+parentSelection,
		dataType:"json"
	})
	
	call.done((data)=>{
		var rootSelect = $('#rootChildren');
		for(i=0;i<data.length;i++){
			var opt = $('<option></option>').text(data[i].description).attr('value',data[i].itemHierarchyID);
			newSelect.append(opt);
		}
	});
	call.fail(()=>{console.log("fail")});
	
	$('#checkoutSelector').append(newSelect);
}
