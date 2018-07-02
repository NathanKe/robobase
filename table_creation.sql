drop database robobase;
create database robobase;
use robobase;

create table users (
	userID int not null auto_increment primary key,
	userName varchar(20) not null unique,
	SISID varchar(7) not null unique,
	salt varchar(32) not null,
	pswd varchar(255) not null
) auto_increment=10000 engine=INNODB;

create table team (
	teamID int not null auto_increment primary key,
	teamName varchar(20) not null unique
) auto_increment=10000 engine=INNODB;

create table teamUserAssignment(
	teamUserAssignmentID int not null auto_increment primary key,
    teamID int not null,
	constraint foreign key (teamID) references team(teamID),
	userID int not null,
	constraint foreign key (userID) references users(userID)
) auto_increment=10000 engine=INNODB;

create table role (
	roleID int not null auto_increment primary key,
	roleName varchar(20) not null unique,
	roleClass enum('Student','Coach','Admin') not null
) auto_increment=10000 engine=INNODB;

create table userRoleAssignment (
	userRoleAssignmentID int not null auto_increment primary key,
	userID int not null,
	constraint foreign key (userID) references users(userID),
	roleID int not null,
	constraint foreign key (roleID) references role(roleID)
) auto_increment=10000 engine=INNODB;

create table task (
	taskID int not null auto_increment primary key,
	taskName varchar(20) not null unique,
	taskDescription varchar(200)
) auto_increment=10000 engine=INNODB;

create table roleTaskAssignment (
	roleTaskAssignmentID int not null auto_increment primary key,
	roleID int not null,
	constraint foreign key (roleID) references role(roleID),
	taskID int not null,
	constraint foreign key (taskID) references task(taskID)
) auto_increment=10000 engine=INNODB;

create table event (
	eventID int not null auto_increment primary key,
	eventName varchar(50) not null,
	keyEvent bool not null,
	startTime datetime not null,
	endTime datetime not null,
    notes varchar(200)
) auto_increment=10000 engine=INNODB;

create table eventAvailability (
	eventAvailabilityID int not null auto_increment primary key,
	userID int not null,
	constraint foreign key (userID) references users(userID),
	eventID int not null,
	constraint foreign key (eventID) references event(eventID),
	availability bool
) auto_increment=10000 engine=INNODB;

create table attendanceCode (
	attendanceCode varchar(5) not null unique primary key,
	description varchar(50)
) engine=INNODB;

create table attendanceRecord (
	attendanceRecordID int not null auto_increment primary key,
	userID int not null,
	constraint foreign key (userID) references users(userID),
	eventID int not null,
	constraint foreign key (eventID) references event(eventID),
	attendanceCode varchar(5),
	constraint foreign key (attendanceCode) references attendanceCode(attendanceCode)
) auto_increment=10000 engine=INNODB;

create table permissionForm (
	permissionFormID int not null auto_increment primary key,
	name varchar(20) not null,
	description varchar(200) not null,
    formlink varchar(200)
) auto_increment=10000 engine=INNODB;

create table userPermissionForm(
	userPermissionFormID int not null auto_increment primary key,
	userID int not null,
	constraint foreign key (userID) references users(userID),
	permissionFormID int not null,
	constraint foreign key (permissionFormID) references permissionForm(permissionFormID),
    status enum('Incomplete','Complete','Waived')
) auto_increment=10000 engine=INNODB;

create table account(
	accountID int not null auto_increment primary key,
	accountName varchar(30) not null,
	currentBalance decimal(6,2) not null default 0
) auto_increment=10000 engine=INNODB;

create table ledgerTransaction(
	transactionID int not null auto_increment primary key,
	accountID int not null,
	constraint foreign key (accountID) references account(accountID),
	transactionDate datetime not null,
	transactionValue decimal(6,2) not null,
	description varchar(100) not null
) auto_increment=10000 engine=INNODB;

create table requestType(
	requestTypeID int not null auto_increment primary key,
	description varchar(20) not null
) auto_increment=10000 engine=INNODB;

create table requestStatus(
	requestStatusID int not null auto_increment primary key,
	description varchar(20) not null
) auto_increment=10000 engine=INNODB;

create table itemHierarchy(
	itemHierarchyID int not null auto_increment primary key,
	parentId int not null,
	constraint foreign key (parentId) references itemHierarchy(itemHierarchyID),
	description varchar(30) not null
) auto_increment=10000 engine=INNODB;

create table itemRestriction(
	itemRestrictionID int not null auto_increment primary key,
	description varchar(20) not null
) auto_increment=10000 engine=INNODB;

create table inventoryItem(
	itemID int not null auto_increment primary key,
	itemHierarchyID int not null,
	constraint foreign key (itemHierarchyID) references itemHierarchy(itemHierarchyID),
	itemRestrictionID int not null,
	constraint foreign key (itemRestrictionID) references itemRestriction(itemRestrictionID),
	description varchar(50) not null,
	unitPrice decimal(3,2) not null default 0.0,
	totalQuantity int not null default 0
) auto_increment=10000 engine=INNODB;

create table teamRequest(
	teamRequestID int not null auto_increment primary key,
	itemID int not null,
	constraint foreign key (itemID) references inventoryItem(itemID),
	userID int not null,
	constraint foreign key (userID) references users(userID),
	teamID int not null,
	constraint foreign key (teamID) references team(teamID),
	requestTypeID int not null,
	constraint foreign key (requestTypeID) references requestType(requestTypeID),
	requestStatusID int not null,
	constraint foreign key (requestStatusID) references requestStatus(requestStatusID),
	transactionID int not null,
	constraint foreign key (transactionID) references ledgerTransaction(transactionID),
	quantity int not null default 1,
	justification text not null,
	statusDate datetime not null,
	creationDate datetime not null
) auto_increment=10000 engine=INNODB;

create table inventoryAssignment(
	inventoryAssignmentID int not null auto_increment primary key,
	itemID int not null,
	constraint foreign key (itemID) references inventoryItem(itemID),
	teamID int not null,
	constraint foreign key (teamID) references team(teamID),
	quantity int not null default 1
) auto_increment=10000 engine=INNODB;