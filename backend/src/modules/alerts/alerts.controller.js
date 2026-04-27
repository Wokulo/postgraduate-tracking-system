import { query } from "../../config/db.js";

export async function getAlerts(_req, res) {
  const result = await query(
    `SELECT a.*, s.first_name, s.last_name
     FROM alerts a
     JOIN students s ON s.id = a.student_id
     ORDER BY a.created_at DESC`
  );

  return res.json(result.rows);
}

export async function resolveAlert(req, res) {
  const result = await query(
    `UPDATE alerts
     SET is_resolved = true, resolved_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Alert not found" });
  }

  return res.json(result.rows[0]);
}

export async function runAlerts(_req, res) {
  await query(
    `INSERT INTO alerts (student_id, alert_type, severity, message)
     SELECT s.id, 'low_attendance', 'high', 'Attendance below 75% in the last 30 days'
     FROM students s
     LEFT JOIN attendance a ON a.student_id = s.id AND a.attendance_date >= CURRENT_DATE - INTERVAL '30 days'
     WHERE NOT EXISTS (
       SELECT 1
       FROM alerts existing
       WHERE existing.student_id = s.id
         AND existing.alert_type = 'low_attendance'
         AND existing.is_resolved = false
     )
     GROUP BY s.id
     HAVING COALESCE(AVG(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END), 0) < 0.75
    `
  );

  await query(
    `INSERT INTO alerts (student_id, alert_type, severity, message)
     SELECT g.student_id, 'low_grade', 'medium', 'Average grade below 60%'
     FROM grades g
     WHERE NOT EXISTS (
       SELECT 1
       FROM alerts existing
       WHERE existing.student_id = g.student_id
         AND existing.alert_type = 'low_grade'
         AND existing.is_resolved = false
     )
     GROUP BY g.student_id
     HAVING AVG((g.score / NULLIF(g.max_score, 0)) * 100) < 60
    `
  );

  return res.json({ message: "Alert rules executed" });
}
