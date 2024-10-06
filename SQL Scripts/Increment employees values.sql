UPDATE Employees
SET Value = CASE
    WHEN Name LIKE 'E%' THEN Value + 1
    WHEN Name LIKE 'G%' THEN Value + 10
    ELSE Value + 100
END;
