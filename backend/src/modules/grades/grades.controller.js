import { query } from "../../config/db.js";

export async function createGrade(req, res) {
  const { student_id, subject_id, title, score, max_score, graded_on, remarks } = req.body;

  const result = await query(
    `INSERT INTO grades (student_id, subject_id, title, score, max_score, graded_on, entered_by, remarks)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [student_id, subject_id, title, score, max_score, graded_on, req.user.id, remarks || null]
  );

  return res.status(201).json(result.rows[0]);
}

export async function getGrades(req, res) {
  const { studentId, subjectId } = req.query;
  const values = [];
  const where = [];

  if (studentId) {
    values.push(studentId);
    where.push(`g.student_id = $${values.length}`);
  }

  if (subjectId) {
    values.push(subjectId);
    where.push(`g.subject_id = $${values.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await query(
    `SELECT g.*, s.name AS subject_name, st.first_name, st.last_name
     FROM grades g
     JOIN subjects s ON s.id = g.subject_id
     JOIN students st ON st.id = g.student_id
     ${whereSql}
     ORDER BY g.graded_on DESC`,
    values
  );

  return res.json(result.rows);
}

export async function updateGrade(req, res) {
  const fields = ["student_id", "subject_id", "title", "score", "max_score", "graded_on", "remarks"];
  const updates = [];
  const values = [];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      values.push(req.body[field]);
      updates.push(`${field} = $${values.length}`);
    }
  });

  if (!updates.length) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  values.push(req.params.id);
  const result = await query(
    `UPDATE grades SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Grade not found" });
  }

  return res.json(result.rows[0]);
}

export async function deleteGrade(req, res) {
  const result = await query("DELETE FROM grades WHERE id = $1 RETURNING id", [req.params.id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Grade not found" });
  }

  return res.status(204).send();
}
