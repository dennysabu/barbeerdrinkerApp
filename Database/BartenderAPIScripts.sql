#Given a bar and a bartender, returns count they've sold.
SELECT bi.item, COUNT(bi.item) as sold
FROM Bills b, Bill_Items bi
WHERE b.id = bi.billid
AND b.bartender = 'Mannon' #These will be passed in 
AND b.bar = '207' #These will be passed in 
GROUP BY (bi.item)
;



#Retuns shifts of a bar  
SELECT DISTINCT startTime, endTime
FROM Shifts
WHERE bar = '207'
;


