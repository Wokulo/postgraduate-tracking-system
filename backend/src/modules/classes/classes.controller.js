import { query } from "../../config/db.js";

export async function getClasses(_req, res) {
  const result = await query(
    `SELECT id, name, grade_level, section
     FROM classes
     ORDER BY name`
  );

  return res.json(result.rows);
}
