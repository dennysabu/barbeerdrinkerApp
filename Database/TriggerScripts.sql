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
     