import { query } from "../../config/db.js";

export async function createBehaviorNote(req, res) {
  const { student_id, note_type, note, incident_date, follow_up_required } = req.body;

  const result = await query(
    `INSERT INTO behavior_notes (student_id, note_type, note, incident_date, created_by, follow_up_required)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [student_id, note_type, note, incident_date, req.user.id, !!follow_up_required]
  );

  return res.status(201).json(result.rows[0]);
}

export async function getBehaviorNotes(req, res) {
  const { studentId } = req.query;
  const values = [];
  let whereSql = "";

  if (studentId) {
    values.push(studentId);
    whereSql = "WHERE bn.student_id = $1";
  }

  const result = await query(
    `SELECT bn.*, s.first_name, s.last_name
     FROM behavior_notes bn
     JOIN students s ON s.id = bn.student_id
     ${whereSql}
     ORDER BY bn.incident_date DESC`,
    values
  );

  return res.json(result.rows);
}

export async function updateBehaviorNote(req, res) {
  const fields = ["note_type", "note", "incident_date", "follow_up_required"];
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
    `UPDATE behavior_notes SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Behavior note not found" });
  }

  return res.json(result.rows[0]);
}

export async function deleteBehaviorNote(req, res) {
  const result = await query("DELETE FROM behavior_notes WHERE id = $1 RETURNING id", [req.params.id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Behavior note not found" });
  }

  return res.status(204).send();
}
