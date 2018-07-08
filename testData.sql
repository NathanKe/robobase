use robobase;

# User Table
## nathan - admin
set @salt = (select md5(rand()));
insert into users values (0,'nathan','1111111',@salt,SHA2(CONCAT(@salt,'password'),512));
# kristen & frank - coaches
set @salt = (select md5(rand()));
insert into users values (0,'kristen','2222222',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'frank','3333333',@salt,SHA2(CONCAT(@salt,'password'),512));
# 9 student accounts
set @salt = (select md5(rand()));
insert into users values (0,'alice','4000001',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'anne','4000002',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'abbey','4000003',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'bonnie','5000001',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'beth','5000002',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'bridget','5000003',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'claire','6000001',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'chloe','6000002',@salt,SHA2(CONCAT(@salt,'password'),512));
set @salt = (select md5(rand()));
insert into users values (0,'caroline','6000003',@salt,SHA2(CONCAT(@salt,'password'),512));

#Team Table
# bonus points if you know where I picked the team names from
insert into team values (0,"Blue Barracudas");
insert into team values (0,"Green Monkeys");
insert into team values (0,"Purple Parrots");

#TeamUserAssignmentTable
set @uid = (select userid from users where username = 'alice');
set @tid = (select teamid from team where teamname = 'Blue Barracudas');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'anne');
set @tid = (select teamid from team where teamname = 'Blue Barracudas');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'abbey');
set @tid = (select teamid from team where teamname = 'Blue Barracudas');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'bonnie');
set @tid = (select teamid from team where teamname = 'Green Monkeys');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'beth');
set @tid = (select teamid from team where teamname = 'Green Monkeys');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'bridget');
set @tid = (select teamid from team where teamname = 'Green Monkeys');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'claire');
set @tid = (select teamid from team where teamname = 'Purple Parrots');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'chloe');
set @tid = (select teamid from team where teamname = 'Purple Parrots');
insert into teamUserAssignment values (0,@tid,@uid);
set @uid = (select userid from users where username = 'caroline');
set @tid = (select teamid from team where teamname = 'Purple Parrots');
insert into teamUserAssignment values (0,@tid,@uid);

#Role Table
insert into role values (0,'Admin','Admin');
insert into role values (0,'Coach','Coach');
insert into role values (0,'Student','Student');
insert into role values (0,'Captain','Student');

#UserRoleAssignment Table
set @uid = (select userid from users where username = 'nathan');
set @rid = (select roleid from role where rolename = 'Admin');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'kristen');
set @rid = (select roleid from role where rolename = 'Coach');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'frank');
set @rid = (select roleid from role where rolename = 'Coach');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'alice');
set @rid = (select roleid from role where rolename = 'Captain');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'bonnie');
set @rid = (select roleid from role where rolename = 'Captain');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'claire');
set @rid = (select roleid from role where rolename = 'Captain');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'anne');
set @rid = (select roleid from role where rolename = 'Student');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'abbey');
set @rid = (select roleid from role where rolename = 'Student');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'beth');
set @rid = (select roleid from role where rolename = 'Student');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'bridget');
set @rid = (select roleid from role where rolename = 'Student');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'chloe');
set @rid = (select roleid from role where rolename = 'Student');
insert into userRoleAssignment values (0,@uid,@rid);
set @uid = (select userid from users where username = 'caroline');
set @rid = (select roleid from role where rolename = 'Student');
insert into userRoleAssignment values (0,@uid,@rid);

#Task Table
#admin
insert into task values (0,'hierarchy','Manage item hierarchy');
insert into task values (0,'taskMgmt','Manage role/task assignment');
insert into task values (0,'user-coach','Manage coach users');
#coach
insert into task values (0,'roster','Manage team roster');
insert into task values (0,'user-student','Manage student users');
insert into task values (0,'attendance','Record and view attendance');
insert into task values (0,'inventory','Manage inventory');
insert into task values (0,'reportEventAvail','Manage inventory');
#student
insert into task values (0,'eventAvail','Update event availability');
insert into task values (0,'partCheckout','Check-out parts');
insert into task values (0,'partRequest','Submit Part Request');

#RoleTaskAssignment Table
#admin
set @rid = (select roleid from role where rolename = 'Admin');
set @tid = (select taskid from task where taskname = 'hierarchy');
insert into roleTaskAssignment values (0,@rid,@tid);
set @tid = (select taskid from task where taskname = 'taskMgmt');
insert into roleTaskAssignment values (0,@rid,@tid);
set @tid = (select taskid from task where taskname = 'user-coach');
insert into roleTaskAssignment values (0,@rid,@tid);
#coach
set @rid = (select roleid from role where rolename = 'Coach');
set @tid = (select taskid from task where taskname = 'roster');
insert into roleTaskAssignment values (0,@rid,@tid);
set @tid = (select taskid from task where taskname = 'user-student');
insert into roleTaskAssignment values (0,@rid,@tid);
set @tid = (select taskid from task where taskname = 'attendance');
insert into roleTaskAssignment values (0,@rid,@tid);
set @tid = (select taskid from task where taskname = 'inventory');
insert into roleTaskAssignment values (0,@rid,@tid);
set @tid = (select taskid from task where taskname = 'reportEventAvail');
insert into roleTaskAssignment values (0,@rid,@tid);
#student
set @rid = (select roleid from role where rolename = 'Student');
set @tid = (select taskid from task where taskname = 'eventAvail');
insert into roleTaskAssignment values (0,@rid,@tid);
set @rid = (select roleid from role where rolename = 'Student');
set @tid = (select taskid from task where taskname = 'partCheckout');
insert into roleTaskAssignment values (0,@rid,@tid);
#captain
set @rid = (select roleid from role where rolename = 'Captain');
set @tid = (select taskid from task where taskname = 'partCheckout');
insert into roleTaskAssignment values (0,@rid,@tid);
set @rid = (select roleid from role where rolename = 'Captain');
set @tid = (select taskid from task where taskname = 'eventAvail');
insert into roleTaskAssignment values (0,@rid,@tid);
set @rid = (select roleid from role where rolename = 'Captain');
set @tid = (select taskid from task where taskname = 'partRequest');
insert into roleTaskAssignment values (0,@rid,@tid);

#Event Table
insert into event values (0,'Practice Sep 1',0,'2018-09-01 15:30','2018-09-01 17:30','First practice of the year');
insert into event values (0,'Practice Sep 2',0,'2018-09-02 15:30','2018-09-02 17:30','');
insert into event values (0,'Practice Sep 3',0,'2018-09-03 15:30','2018-09-03 17:30','');
insert into event values (0,'Practice Sep 4',0,'2018-09-04 15:30','2018-09-04 17:30','');
insert into event values (0,'Competition Option 1',1,'2018-09-05 08:30','2018-09-04 17:30','Annapolis');
insert into event values (0,'Competition Option 2',1,'2018-09-05 08:30','2018-09-04 17:30','Bethesda');
insert into event values (0,'Competition Option 3',1,'2018-09-05 08:30','2018-09-04 17:30','Columbia');

#Event Availability Table
# note - only interesting for key events - only students answer - default unavilable
insert into eventAvailability (eventAvailabilityID,userID,eventID,availability)
select 0,users.userID,eventID,''
from event 
	join users 
    join userRoleAssignment on users.userID = userRoleAssignment.userID
    join role on userRoleAssignment.roleID = role.roleID
where keyEvent=1 and roleClass = 'Student';

#Attendance Code Table
insert into AttendanceCode values ('PRS','present');
insert into AttendanceCode values ('ABS','absent');
insert into AttendanceCode values ('OTH','other');

#Attendance Record Table
# marking all students present for first practice
insert into attendanceRecord (attendanceRecordID,userID,eventID,attendanceCode)
select 0,users.userid,eventid,'PRS'
from event
	join users
    join userRoleAssignment on users.userID = userRoleAssignment.userID
    join role on userRoleAssignment.roleID = role.roleID
where eventName = 'Practice Sep 1' and roleClass = 'Student';

#PermissionForm table
insert into permissionForm values (0,'School','BMS required form','link');
insert into permissionForm values (0,'FIRST','FIRST required form','link');

#UserPermissionForm table
# mark all students as both forms incomplete
insert into userPermissionForm (userPermissionFormID,userID,permissionFormID,status)
select 0,users.userid,permissionformid,'Incomplete'
from permissionform
	join users
    join userRoleAssignment on users.userID = userRoleAssignment.userID
    join role on userRoleAssignment.roleID = role.roleID
where roleClass = 'Student';

#account table
insert into account values (0,'operations',999.99);
insert into account values (0,'student earnings',0);

#ledgerTransaction table
insert into ledgerTransaction values (0,10000,'2018-09-01 08:00',999.99,'opening yearly balance');

#RequestType Table
insert into requestType values (0,'purchase');
insert into requestType values (0,'modification');

#RequestStatus Table
insert into requestStatus values (0,'pending');
insert into requestStatus values (0,'approved');
insert into requestStatus values (0,'denied');
insert into requestStatus values (0,'ordered');

#ItemRestriction Table
insert into itemRestriction values (0,'unrestricted');
insert into itemRestriction values (0,'limitedquantity');
insert into itemRestriction values (0,'specialusage');

#ItemHierarchy Table
#special root element
insert into itemHierarchy values (0,10000,'root');
#level one nodes
insert into itemHierarchy values (0,10000,'servos');
insert into itemHierarchy values (0,10000,'wheels');
insert into itemHierarchy values (0,10000,'plates');
#level two nodes
insert into itemhierarchy (itemhierarchyid,parentid,description)
select 0,itemHierarchyID,'continuous' from itemHierarchy where description = 'servos';
insert into itemhierarchy (itemhierarchyid,parentid,description)
select 0,itemHierarchyID,'180-degree' from itemHierarchy where description = 'servos';
insert into itemhierarchy (itemhierarchyid,parentid,description)
select 0,itemHierarchyID,'omni' from itemHierarchy where description = 'wheels';
insert into itemhierarchy (itemhierarchyid,parentid,description)
select 0,itemHierarchyID,'standard' from itemHierarchy where description = 'wheels';
insert into itemhierarchy (itemhierarchyid,parentid,description)
select 0,itemHierarchyID,'tetrix' from itemHierarchy where description = 'plates';
insert into itemhierarchy (itemhierarchyid,parentid,description)
select 0,itemHierarchyID,'andymark' from itemHierarchy where description = 'plates';

#InventoryItem Table
insert into inventoryItem values (0,10004,10000,'continuous servo 1',9.99,10);
insert into inventoryItem values (0,10005,10001,'180-degree servo 1',5.99,10);
insert into inventoryItem values (0,10006,10000,'omni wheel 1',19.99,10);
insert into inventoryItem values (0,10007,10000,'standard wheel 1',14.99,10);
insert into inventoryItem values (0,10007,10000,'tetrix plate 4x6',1.99,10);
insert into inventoryItem values (0,10007,10002,'andymark plate 2x12',2.99,10);


#TeamRequest Table
# each team wants 1 'limited quantity' 180-degree servo, set Frank as the approver of all of them.  Type is purchase, status is pending
insert into teamrequest (teamRequestID,itemID,teamID,userID,requestTypeID,requestStatusID,TransactionID,Quantity,Justification,statusdate,creationdate)
select 0,itemID,teamID,userID,requestTypeID,requestStatusID,NULL,1,'because I want it','2018-09-01 12:00','2018-09-01 12:00'
from inventoryItem join team join users join requesttype join requeststatus join itemrestriction on itemrestriction.itemRestrictionID = inventoryitem.itemRestrictionID
where itemrestriction.description = 'limitedquantity'
and users.username = 'frank'
and requesttype.description = 'purchase'
and requeststatus.description = 'pending';


#inventoryAssignment table
# every team gets 1 of each item
insert into inventoryassignment (inventoryassignmentId,itemid,teamid,quantity)
select 0,itemid,teamid,1
from inventoryitem join team;