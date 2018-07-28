drop procedure if exists inventory_by_team;
delimiter //
create procedure inventory_by_team (
	in inteamid int
)
begin
	select inventoryitem.description as itemdescription, unitprice, quantity as assignedquantity, itemhierarchy.description as parentcategory from inventoryitem 
    join inventoryassignment on inventoryitem.itemID = inventoryassignment.itemID 
    join itemhierarchy on inventoryitem.itemHierarchyID = itemhierarchy.itemHierarchyID
    where inventoryassignment.teamID = inteamid
    and quantity > 0;
end //

drop procedure if exists report_by_item;
delimiter //
create procedure report_by_item (
	
)
end //