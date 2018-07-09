drop procedure if exists assign_inventory;
delimiter //
create procedure assign_inventory (
	in inuserid int,
    in initemid int,
    in inquantity int
)
begin
	declare curteam,curqty,newqty int;
    
    select teamid into curteam from teamuserassignment where userid = inuserid;
    select quantity into curqty from inventoryassignment where teamid = curteam and itemid = initemid;
    
    select ifnull(curqty,0) into curqty;
    
    select inquantity+curqty into newqty;
    
    insert into inventoryassignment values (initemid,curteam,newqty)
    on duplicate key update quantity = newqty;
end //