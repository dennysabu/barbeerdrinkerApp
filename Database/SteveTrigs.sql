# Makes sure bartender works at bar where bill is issued, for Bills insert
DROP TRIGGER BartendersShifts_Bills;

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
