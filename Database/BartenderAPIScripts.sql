#Given a bar and a bartender, returns count they've sold.
SELECT bi.item, COUNT(bi.item) as sold
FROM Bills b, Bill_Items bi
WHERE b.id = bi.billid
AND b.bartender = 'Aline' #These will be passed in 
AND b.bar = 'Avenu Lounge' #These will be passed in 
GROUP BY (bi.item)
;



#


