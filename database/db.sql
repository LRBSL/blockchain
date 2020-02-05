create database lrbsl_database;

use lrbsl_database;

-- authentication table
create table users(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  passwd VARCHAR(255) NOT NULL,
  identityName VARCHAR(100) NOT NULL,
  identityOrg VARCHAR(50) NOT NULL,
  UNIQUE (identityName,identityOrg)
  );
insert into users(username,passwd,identityName,identityOrg) values 
('admin-rlr','admin-rlr','user1','org1'), 
('admin-surveyor','admin-surveyor','user1','org2'), 
('admin-notary','admin-notary','user1','org3');

-- rlr users table for login
-- create table rlr_users(
--   id VARCHAR(10) PRIMARY KEY,
--   username VARCHAR(50) NOT NULL,
--   password VARCHAR(50) NOT NULL);
-- insert into rlr_users values 
-- ('RLR001','colombo-01','colombo-01'), 
-- ('RLR002','colombo-02','colombo-02'), 
-- ('RLR003','negombo','negombo');

-- notary users table for login
-- create table notary_users(
--   id VARCHAR(10) PRIMARY KEY,
--   username VARCHAR(50) NOT NULL,
--   password VARCHAR(50) NOT NULL);
-- insert into notary_users values 
-- ('NT001','ravindu','ravindu'),
-- ('NT002','sachintha','sachintha'),
-- ('NT003','gayan','gayan');

-- surveyor users table for login
-- create table surveyor_users(
--   id VARCHAR(10) PRIMARY KEY,
--   username VARCHAR(50) NOT NULL,
--   password VARCHAR(50) NOT NULL);
-- insert into surveyor_users values 
-- ('SV001','anura','anura'),
-- ('SV002','janindu','janindu'),
-- ('SV003','pasindu','pasindu');

-- member data table
-- create table member_data(
--   id VARCHAR(10) PRIMARY KEY,
--   type VARCHAR(10) NOT NULL,
--   fname VARCHAR(50) NOT NULL,
--   lname VARCHAR(50) NOT NULL,
--   nic_no VARCHAR(12) NOT NULL,
--   reg_date DATE,
--   rlr_id VARCHAR(10),
--   postal_address VARCHAR(255),
--   email_address VARCHAR(255),
--   mobile_no VARCHAR(15)
--   );
-- insert into member_data values 
-- ('NT001','Notary','Ravindu','Sachintha','962650678V','2018-10-12','RLR001',
-- '640/57, 2nd Kurana, Negombo','ravindusachintha53@gmail.com','0772769963'), 
-- ('NT002','Notary','Sachintha','Rathnayake','952505986V','2017-05-06','RLR002',
-- '93, Main Street, Seeduwa','sachintha@gmail.com','0773245123'), 
-- ('NT003','Notary','Gayan','Sampath','953648782V','2019-01-01','RLR003',
-- '45, Greens Road, Gampaha','gayan@gmail.com','0714325645'),
-- ('SV001','Surveyor','Anura','Withana','962665178V','2018-10-12','RLR001',
-- '07, Main Street, Negombo','anura@gmail.com','0752245689'), 
-- ('SV002','Surveyor','Janindu','Rathnayake','952144566V','2016-05-06','RLR002',
-- '13, Suhada Road, Kandana','janindu@gmail.com','0773232523'), 
-- ('SV003','Surveyor','Pasindu','Bhanuka','956588782V','2018-01-01','RLR003',
-- '45, Greens Road, Yakkala','pasindu@gmail.com','0765285645');

-- NIC data table
-- create table nic_table(
--   nic_no VARCHAR(12) PRIMARY KEY,
--   fullname VARCHAR(255) NOT NULL, 
--   gender VARCHAR(10) NOT NULL, 
--   birthday DATE NOT NULL,
--   occupation VARCHAR(255) NOT NULL, 
--   postal_address VARCHAR(255) NOT NULL,
--   registered_date DATE NOT NULL);
-- insert into nic_table values 
--   ('962650678V','RAVINDU SACHINTHA PEIRIS','MALE','1996-09-21','student',
--   '640/57,2nd Kurana,Colombo Rd,Negombo','2012-10-12'),
--   ('123456789012','DASUN MADUSHAN','MALE','1994-12-22','student',
--   '97,Colombo Rd,Ja-ela','2010-10-12');

-- Lands, NIC, Key Mapping table
-- create table lands_mapper(
--   nic VARCHAR(12),
--   land_key VARCHAR(25),
--   land_id VARCHAR(10) NOT NULL, 
--   PRIMARY KEY (nic,land_key));
-- insert into lands_mapper values 
-- ('962650678V','1234','LAND_001'), 
-- ('123456789012','4321','LAND_002');

-- Deed table
-- create table deed_table(
--   reg_no VARCHAR(20) PRIMARY KEY,
--   land_id VARCHAR(10) NOT NULL,
--   notary_name VARCHAR(255) NOT NULL, 
--   deed_type VARCHAR(10) NOT NULL, 
--   plan_id VARCHAR(20) NOT NULL);
-- insert into deed_table values
--   ('DEED_001','LAND_001','Mr. Mahinda Gunathilake','GIFT','PLAN_001');

-- Plan table
-- create table plan_table(
--   reg_no VARCHAR(20) PRIMARY KEY,
--   land_id VARCHAR(10) NOT NULL,
--   surveyor_name VARCHAR(255) NOT NULL,
--   reg_date DATE NOT NULL,
--   land_boundaries VARCHAR(255));
-- insert into plan_table values
--   ('PLAN_001','LAND_001','Anura Withana','2019-09-20','0,20,10,20,10,0,0,0'),
--   ('PLAN_002','LAND_002','Janindu Rathnayake','2018-10-20','0,50,30,50,10,10,50,0'),
--   ('PLAN_003','LAND_003','Pasindu Bhanuka','2019-05-25','60,20,10,40,100,10,0');