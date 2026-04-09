import { query } from "../../config/db.js";

export async function getStudentReport(req, res) {
  const studentId = req.params.id;

  const [student, attendance, grades, behavior] = await Promise.all([
    query("SELECT * FROM students WHERE id = $1", [studentId]),
    query(
      `SELECT status, COUNT(*)::int AS count
       FROM attendance
       WHERE student_id = $1
       GROUP BY status`,
      [studentId]
    ),
    query(
      `SELECT s.name AS subject, AVG((g.score / NULLIF(g.max_score, 0)) * 100)::numeric(5,2) AS avg_percent
       FROM grades g
       JOIN subjects s ON s.id = g.subject_id
       WHERE g.student_id = $1
       GROUP BY s.name`,
      [studentId]
    ),
    query(
      `SELECT note_type, note, incident_date
       FROM behavior_notes
       WHERE student_id = $1
       ORDER BY incident_date DESC
       LIMIT 10`,
      [studentId]
    ),
  ]);

  if (!student.rows[0]) {
    return res.status(404).json({ message: "Student not found" });
  }

  return res.json({
    student: student.rows[0],
    attendance: attendance.rows,
    grades: grades.rows,
    behavior: behavior.rows,
  });
}

export async function getClassReport(req, res) {
  const { classId } = req.params;

  const result = await query(
    `SELECT s.id, s.first_name, s.last_name,
            COALESCE(AVG((g.score / NULLIF(g.max_score, 0)) * 100), 0)::numeric(5,2) AS avg_grade_percent
     FROM students s
     LEFT JOIN grades g ON g.student_id = s.id
     WHERE s.class_id = $1
     GROUP BY s.id
     ORDER BY s.last_name, s.first_name`,
    [classId]
  );

  return res.json(result.rows);
}

export async function getAtRiskReport(_req, res) {
  const result = await query(
    `SELECT s.id, s.first_name, s.last_name, a.alert_type, a.severity, a.message, a.created_at
     FROM alerts a
     JOIN students s ON s.id = a.student_id
     WHERE a.is_resolved = false
     ORDER BY a.severity DESC, a.created_at DESC`
  );

  return res.json(result.rows);
}
