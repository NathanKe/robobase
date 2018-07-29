drop trigger if exists populate_availability_and_permission_status;

-- Adds blank event availability and incomplete permission form status on insertion of new users
delimiter #
create trigger populate_availability_and_permission_status after insert on users
for each row
begin
	insert into eventAvailability (eventAvailabilityID,userID,eventID,availability)
	select 0,new.userID,eventID,''
	from event
	where keyEvent=1;
    
	insert into userPermissionForm (userPermissionFormID,userID,permissionFormID,status)
	select 0,new.userid,permissionformid,'Incomplete'
	from permissionform;
end #