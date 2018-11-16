# Verifies that drinkers only frequents bars that are in the same city they live in .
SELECT f.drinker, f.bar, d.city FROM Frequents f, Bars b, Drinkers d
WHERE
f.drinker = d.name
AND
f.bar = b.name
AND
b.city != d.city;

-- Verify Bar A and Bar B
SELECT s1.item, s1.bar, s1.price, s2.item, s2.bar, s2.price,s3.item, s3.bar, s3.price, s4.item, s4.bar, s4.price
FROM Sells s1, Sells s2, Sells s3, Sells s4
WHERE s1.bar = s2.bar AND s1.bar = s3.bar AND s4.bar = s3.bar
AND s1.item <> s2.item AND s1.item = s3.item AND s2.item = s4.item
AND s1.price > s2.price AND s3.price < s4.price;

-- Verify Bill is made when bar is open
SELECT bi.date, ba.weekendOpen, ba.weekendClose, bi.bar
FROM Bills bi, Bars ba
WHERE bi.bar = ba.name AND TIMEDIFF(bi.date, ba.weekendOpen) > 0 AND TIMEDIFF(bi.date, ba.weekendClose) < 0;
