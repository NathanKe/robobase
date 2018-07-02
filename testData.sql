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



#insert into task values (0,"waister","lumbagos spavin girasols rosebays valeted inkiest corncake warked redbaits caddie");
#insert into event values (0,"rarebits comaking",1,"2018-01-10 14:18:24","2018-12-23 05:56:44");
#insert into attendanceCode values (0,"PING","camel milepost purport");
#insert into permissionForm values (0,"coseys","paragons prepuce hanking savins alkyne divert samosas aurei horrid parked");
#insert into account values (0,"passed",0);
#insert into requestType values (0,"birlings");
#insert into itemRestriction values (0,"deposits");