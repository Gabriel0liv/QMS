

WITH RankedValues AS (
    SELECT
        vv.*,
        ROW_NUMBER() OVER (
            PARTITION BY vv.DocumentID, vv.VariableID
            ORDER BY vv.RevisionNo DESC
        ) AS rn
    FROM VariableValue vv
)

SELECT 
    v.VariableName as Familia,
    CASE 
        WHEN CHARINDEX(' ', d.Filename) > 0
            THEN LEFT(d.Filename, CHARINDEX(' ', d.Filename) - 1)
        ELSE REPLACE(d.Filename, '.SLDDRW', '')
    END AS Resultado,
    d.DocumentID,
    d.Filename,
    rv.ValueText,
    rv.RevisionNo
FROM Documents d
JOIN RankedValues rv
    ON rv.DocumentID = d.DocumentID
    AND rv.rn = 1
JOIN Variable v
    ON v.VariableID = rv.VariableID
WHERE d.Filename like '%.SLDDRW'
ORDER BY 1
