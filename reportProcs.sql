-- Clear existing procedures
drop procedure if exists inventory_by_team;
drop procedure if exists item_utilization;
drop procedure if exists utilization_by_restriction;
drop procedure if exists roster_by_team;
drop procedure if exists permission_form_status_by_team;
drop procedure if exists attendance_by_user;
drop procedure if exists availability_aggregate;
drop procedure if exists request_report;
drop procedure if exists balance_report;

-- For a given team, display all assigned inventory
delimiter //
create procedure inventory_by_team (
	in inTeamID int
)
begin
	select inventoryitem.description as itemdescription, unitprice, quantity as assignedquantity, itemhierarchy.description as parentcategory from inventoryitem 
    join inventoryassignment on inventoryitem.itemID = inventoryassignment.itemID 
    join itemhierarchy on inventoryitem.itemHierarchyID = itemhierarchy.itemHierarchyID
    where inventoryassignment.teamID = inTeamID
    and quantity > 0;
end //

-- For a given item, display its total, utilization by team, and leftover availability
delimiter //
create procedure item_utilization (
	in inItemID int
)
begin
	declare totalQ,availQ,sumQ int;
    
    select totalQuantity into totalQ from inventoryitem where itemid = initemid;
    select sum(quantity) into sumQ from inventoryassignment where itemid = initemid;
    
    (select 'total' as assignment,totalQ as quantity) 
    union (select teamid,quantity from inventoryassignment where itemid = inItemID) 
    union (select 'available', (totalQ - sumQ));
end //

-- For a given restriction type, display part usage across teams 
delimiter //
create procedure utilization_by_restriction (
	in inItemRestrictionID int
)
begin
	select inventoryitem.itemid,teamid,quantity 
    from inventoryassignment 
    join inventoryitem on inventoryassignment.itemid = inventoryitem.itemID
    where itemrestrictionid = inItemRestrictionID;
end //

-- For a given team, return the roster (username & SISID)
delimiter //
create procedure roster_by_team(
	in inTeamID int
)
begin
	select username,sisid 
    from teamuserassignment 
    join users on teamuserassignment.userid = users.userid
    where teamuserassignment.teamid = inTeamID;
end //

-- For a given team, report the status of all permission forms
delimiter //
create procedure permission_form_status_by_team(
	in inTeamID int
)
begin
	select username,sisid,permissionform.name as formname,userpermissionform.status
    from teamuserassignment 
    join users on teamuserassignment.userid = users.userid
    join userpermissionform on userpermissionform.userid = users.userid
    join permissionform on permissionform.permissionFormID = userpermissionform.permissionFormID
    where teamuserassignment.teamid = inTeamID
    order by username, permissionform.name;
end //

-- For a givin user, report his/her attendance details
delimiter //
create procedure attendance_by_user(
	in inUserID int
)
begin
	select username,eventname,attendancecode.attendanceCode
    from users
    join attendancerecord on users.userid = attendancerecord.userID
    join event on attendancerecord.eventID = event.eventid
    join attendancecode on attendancecode.attendanceCode = attendancerecord.attendanceCode
    where users.userid = inUserID
    order by event.startTime;
end //

-- Report aggregate availability by key event
delimiter //
create procedure availability_aggregate()
begin
	select count(*),eventname,availability from eventavailability join event on eventavailability.eventID = event.eventID
    group by eventname,availability
    order by eventname,availability;
end //

-- Report current status and assignee of all team requests
delimiter //
create procedure request_report()
begin
	select itemid,quantity,teamid,username as assignedTo,requesttype.description as type, requeststatus.description as status
    from teamrequest
    join requesttype on requesttype.requestTypeID = teamrequest.requestTypeID
    join requeststatus on requeststatus.requestStatusID = teamrequest.requestStatusID
    join users on users.userid = teamrequest.userid;
end //

-- Report current balance of all accounts
delimiter //
create procedure balance_report()
begin
	select sum(ledgertransaction.transactionValue) as total, accountname from account join ledgertransaction on ledgertransaction.accountid = account.accountID
    group by accountName;
end //