#Verifies that drinkers only frequents bars that are in the same city they live in .
SELECT f.drinker, f.bar, d.city FROM Frequents f, Bars b, Drinkers d
WHERE 
f.drinker = d.name 
AND 
f.bar = b.name 
AND
b.city != d.city;
