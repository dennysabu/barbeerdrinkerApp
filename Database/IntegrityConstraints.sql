-- Verifies that drinkers only frequents bars that are in the same city they live in .
SELECT f.drinker, f.bar, d.city FROM Frequents f, Bars b, Drinkers d
WHERE
f.drinker = d.name
AND
f.bar = b.name
AND
b.city != d.city;

-- Verify Bar A and Bar B
SELECT 
    *
FROM
    Sells s1,
    Sells s2,
    Sells s3,
    Sells s4,
    Items i
WHERE
s1.day = s2.day 
AND s3.day = s4.day
AND s1.day = s3.day
AND s1.item = s3.item
AND s2.item = s4.item
AND s1.item = s2.item
AND s1.bar = s3.bar
AND s2.bar = s4.bar
AND s1.price > s2.price
AND s3.price < s4.price
;



-- Verify Bill is made when bar is open
SELECT bi.date, ba.weekendOpen, ba.weekendClose, bi.bar
FROM Bills bi, Bars ba
WHERE bi.bar = ba.name AND TIMEDIFF(TIME(bi.date), ba.weekendOpen) < 0 AND TIMEDIFF(TIME(bi.date), ba.weekendClose) > 0
AND TIMEDIFF(TIME(bi.date), ba.weekdayOpen) < 0 AND TIMEDIFF(TIME(bi.date), ba.weekdayClose) > 0 ;

-- Verify a bartender cannot work more than one shift a day
SELECT s.bartender, s.bar, s.day, COUNT(s.day) as shifts_worked
FROM Shifts s
GROUP BY s.bartender, s.day
HAVING shifts_worked > 1;


-- Verify Bar cannot sell more beers of specific brand, than it has in its inventory

SELECT i.count as startedWith, s.bar, s.item, s.c as Sold
FROM Inventory i, (SELECT distinct b.bar, bi.item,COUNT(bi.item) as c
FROM Bills b, Bill_Items bi 
WHERE 
b.id = bi.billid
GROUP BY bi.item, b.bar
ORDER BY bar) s

WHERE i.date = '2018-02-01'
AND i.item = s.item
AND i.bar = s.bar
AND i.count < s.c

;

