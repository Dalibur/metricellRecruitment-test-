SELECT SUM(Value) AS TotalValue
FROM Employees
WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%'
HAVING SUM(Value) >= 11171;