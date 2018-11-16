# Makes sure bartenders cannot work more than one shift per day
DELIMITER $
CREATE TRIGGER BartendersShiftsFK
BEFORE INSERT ON Shifts
FOR EACH ROW BEGIN
if (NOT EXISTS(SELECT b.name, b.city, bt.name, bt.city
FROM Bars b, Bartenders bt
WHERE b.city = bt.city AND b.name = NEW.bar AND bt.name = NEW.bartender)) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert, update, or delete in Shifts: a bartender cannot work more than one shift per day';
END IF;
END $
DELIMITER ;

SELECT s.bartender, s.bar, s.day, COUNT(s.day) as shifts_worked
FROM Shifts s 
GROUP BY s.bartender, s.day
HAVING shifts_worked = 1;