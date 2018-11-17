-- CREATE DATABASE BarBeerDrinkersPLUS;

USE BarBeerDrinkersPLUS;

UPDATE `Likes` set `item` = TRIM(REPLACE(REPLACE(REPLACE(`item`,'\t',''),'\n',''),'\r',''));

/*
-- This Command loads large CSV data WAY faster than data import wizard
*/
SET FOREIGN_KEY_CHECKS = 0;

LOAD DATA LOCAL INFILE '~/Desktop/db/Sells.csv'
INTO TABLE Sells
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/Desktop/db/Frequents.csv'
INTO TABLE Frequents
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/Desktop/db/Bars.csv'
INTO TABLE Bars
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/Desktop/db/Bill_Items.csv'
INTO TABLE Bill_Items
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/Desktop/db/Bills.csv'
INTO TABLE Bills
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/Desktop/db/Shifts.csv'
INTO TABLE Shifts
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/Desktop/db/Likes.csv'
INTO TABLE Likes
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE '~/Desktop/db/Bartenders.csv'
INTO TABLE Bartenders
FIELDS OPTIONALLY ENCLOSED BY '"' TERMINATED BY ','
LINES TERMINATED BY '\n';

# CREATE DATABASE TABLES

CREATE TABLE Bars (
	name varchar(50) primary key,
	addr varchar(200),
	license varchar(7),
	phone varchar(12),
	city varchar(50),
    weekdayOpen TIME,
    weekdayClose TIME,
    weekendOpen TIME,
    weekendClose TIME
);

CREATE TABLE Items (
	name varchar(50) primary key,
    type varchar(50),
	manf varchar(50),
    city varchar(50)
);


CREATE TABLE Drinkers (
	name varchar(50) primary key,
    phone varchar(12),
    addr varchar(200),
    city varchar(50)
);

CREATE TABLE Bartenders (
	name varchar(50) primary key,
    phone varchar(12),
    addr varchar(200),
    city varchar(50)
);

CREATE TABLE Frequents (
	bar varchar(50),
    drinker varchar(50),
    primary key (bar, drinker),
	CONSTRAINT fk_frequents_bar
    FOREIGN KEY (bar)
    REFERENCES Bars(name),
    CONSTRAINT fk_frequents_drinker
    FOREIGN KEY (drinker)
    REFERENCES Drinkers(name)
);

CREATE TABLE Shifts (
	bar varchar(50),
    bartender varchar(50),
	day DATE,
    primary key (bartender, day),
    startTime Time,
    endTime Time,
    CONSTRAINT fk_shifts_bar
    FOREIGN KEY (bar)
    REFERENCES Bars(name),
    CONSTRAINT fk_shifts_bartender
    FOREIGN KEY (bartender)
    REFERENCES Bartenders(name)
);

CREATE TABLE Sells (
	item varchar(50),
    bar varchar(50),
    day varchar(10),
	price decimal(10,2),
    primary key (item, bar, day),
    CONSTRAINT fk_sells_item
    FOREIGN KEY (item)
    REFERENCES Items(name),
    CONSTRAINT fk_sells_bar
    FOREIGN KEY (bar)
    REFERENCES Bars(name)
);

CREATE TABLE Inventory (
	item varchar(50),
    bar varchar(50),
    primary key (item, bar),
    count Int,
    date date,
    CONSTRAINT fk_inventory_item
    FOREIGN KEY (item)
    REFERENCES Items(name),
    CONSTRAINT fk_inventory_bar
    FOREIGN KEY (bar)
    REFERENCES Bars(name)
);

CREATE TABLE Likes (
	drinker varchar(50) NOT NULL DEFAULT '',
	item varchar(50) NOT NULL DEFAULT '',
    primary key (item, drinker),
	CONSTRAINT fk_likes_drinker
    FOREIGN KEY (drinker)
    REFERENCES Drinkers(name),
    CONSTRAINT fk_likes_item
    FOREIGN KEY (item)
    REFERENCES Items(name)
);

CREATE TABLE Bills (
	id INT AUTO_INCREMENT,
    drinker varchar(50),
    bar varchar(50),
    primary key (id),
	date DATETIME,
    total Decimal(10,2),
    tip Decimal(5,2),
	bartender varchar(50),
    CONSTRAINT fk_bills_bartender
    FOREIGN KEY (bartender)
    REFERENCES Bartenders(name),
    CONSTRAINT fk_bills_drinker
    FOREIGN KEY (drinker)
    REFERENCES Drinkers(name),
	CONSTRAINT fk_bills_bar
    FOREIGN KEY (bar)
    REFERENCES Bars(name)
);

CREATE TABLE Bill_Items (
    billId INT,
	item varchar(50),
    bar varchar(50),
    price decimal(10,2),
	CONSTRAINT fk_bill_items_item
    FOREIGN KEY (item)
    REFERENCES Items(name),
	CONSTRAINT fk_bill_items_bar
    FOREIGN KEY (bar)
    REFERENCES Bars(name),
    CONSTRAINT fk_bill_items_billId
    FOREIGN KEY (billId)
    REFERENCES Bills(id)
);
