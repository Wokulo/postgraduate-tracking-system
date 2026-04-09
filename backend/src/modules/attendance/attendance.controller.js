import { query } from "../../config/db.js";

export async function markAttendance(req, res) {
  const { student_id, attendance_date, status, reason } = req.body;

  const result = await query(
    `INSERT INTO attendance (student_id, attendance_date, status, reason, marked_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (student_id, attendance_date)
     DO UPDATE SET status = EXCLUDED.status, reason = EXCLUDED.reason, marked_by = EXCLUDED.marked_by
     RETURNING *`,
    [student_id, attendance_date, status, reason || null, req.user.id]
  );

  return res.status(201).json(result.rows[0]);
}

export async function markAttendanceBulk(req, res) {
  const { attendance_date, entries } = req.body;

  if (!attendance_date || !Array.isArray(entries)) {
    return res.status(400).json({ message: "attendance_date and entries[] are required" });
  }

  const output = [];

  for (const item of entries) {
    const result = await query(
      `INSERT INTO attendance (student_id, attendance_date, status, reason, marked_by)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, attendance_date)
       DO UPDATE SET status = EXCLUDED.status, reason = EXCLUDED.reason, marked_by = EXCLUDED.marked_by
       RETURNING *`,
      [item.student_id, attendance_date, item.status, item.reason || null, req.user.id]
    );
    output.push(result.rows[0]);
  }

  return res.status(201).json(output);
}

export async function getAttendance(req, res) {
  const { studentId, from, to } = req.query;
  const values = [];
  const where = [];

  if (studentId) {
    values.push(studentId);
    where.push(`a.student_id = $${values.length}`);
  }

  if (from) {
    values.push(from);
    where.push(`a.attendance_date >= $${values.length}`);
  }

  if (to) {
    values.push(to);
    where.push(`a.attendance_date <= $${values.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await query(
    `SELECT a.*, s.first_name, s.last_name
     FROM attendance a
     JOIN students s ON s.id = a.student_id
     ${whereSql}
     ORDER BY a.attendance_date DESC`,
    values
  );

  return res.json(result.rows);
}
