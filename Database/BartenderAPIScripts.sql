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

SELECT b.bartender,  COUNT(bi.item) as sold
From Bills b, Bill_Items bi, Items i
WHERE b.id = bi.billid
AND
b.bar = '207'
AND
bi.item = i.name
and
i.type = 'beer'
and
DATE(b.date) = '2018-02-07'
GROUP BY(b.bartender)
ORDER BY b.bartender


SELECT day, TIME_FORMAT(startTime, '%h:%i %p') as shift
FROM Shifts
Where 
bar = 'Celebrations Nitelife'
AND
bartender = 'Abbey'
ORDER BY day;
