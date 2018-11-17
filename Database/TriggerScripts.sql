
# Makes sure drinkers can only frequents bars that are in the city that they live in
DELIMITER //
CREATE TRIGGER drinkercityfrequents BEFORE INSERT ON Frequents
	FOR EACH ROW
    BEGIN
        DECLARE drinkerCity VARCHAR(50);
		DECLARE barCity VARCHAR(50);
		SELECT city INTO drinkerCity FROM Drinkers where name = New.drinker;
        SELECT city INTO barCity FROM Bars where name = New.bar;
        IF drinkerCity != barCity
			THEN
			SIGNAL SQLSTATE 'HY000'
				SET MESSAGE_TEXT = 'Drinkers cannot frequent bars that are in different cities.';
		END IF;
     END//
DELIMITER ;

# Makes sure bartenders are from the city where the bar is that they are assigned a shift for
DELIMITER $
CREATE TRIGGER ShiftsFK
BEFORE INSERT ON Shifts
FOR EACH ROW BEGIN
if (NOT EXISTS(SELECT b.name, b.city, bt.name, bt.city
FROM Bars b, Bartenders bt
WHERE b.city = bt.city AND b.name = NEW.bar AND bt.name = NEW.bartender)) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert, update, or delete in Shifts: the city of the bar does not match the city of the drinker';
END IF;
END $
DELIMITER ;

# Makes sure bartender works at bar where bill is issued, for Bills insert
DELIMITER $
CREATE TRIGGER BartendersShifts_Bills
BEFORE INSERT ON Bills
FOR EACH ROW BEGIN
if (NOT EXISTS(SELECT * FROM Shifts s 
WHERE NEW.bar = s.bar AND s.bartender = NEW.bartender AND DATE(NEW.date) = s.day AND
TIME(NEW.date) BETWEEN s.startTime AND s.endTime)) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert, update, or delete in Shifts: this bartender does/is not working at the listed bar at this time on this date';
END IF;
END $
DELIMITER ;

#Trigger checks to make sure that bills are not issued after a bar closes
DELIMITER //
CREATE TRIGGER BillTimeCheck 
	BEFORE INSERT ON Bills
		FOR EACH ROW BEGIN
        

			IF NOT EXISTS (
				SELECT * 
				FROM Bars b
				WHERE b.name = New.bar AND
				(TIME(New.date) BETWEEN b.weekdayOpen AND b.weekdayClose) AND
				(TIME(New.date) BETWEEN b.weekendOpen AND weekendClose)

           )
            THEN
				SIGNAL SQLSTATE 'HY000'
					SET MESSAGE_TEXT = 'Check the time of the Bill! It is issued when the bar is not open';
                
			END IF;




END //
DELIMITER ;

