import { query } from "../../config/db.js";

export async function createStudent(req, res) {
  const {
    student_code,
    first_name,
    last_name,
    dob,
    gender,
    guardian_name,
    guardian_phone,
    guardian_email,
    status,
    class_id,
  } = req.body;

  const result = await query(
    `INSERT INTO students (
      student_code, first_name, last_name, dob, gender,
      guardian_name, guardian_phone, guardian_email, status, class_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      student_code,
      first_name,
      last_name,
      dob || null,
      gender || null,
      guardian_name || null,
      guardian_phone || null,
      guardian_email || null,
      status || "active",
      class_id || null,
    ]
  );

  return res.status(201).json(result.rows[0]);
}

export async function getStudents(req, res) {
  const { classId, status } = req.query;
  const values = [];
  const where = [];

  if (classId) {
    values.push(classId);
    where.push(`s.class_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    where.push(`s.status = $${values.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await query(
    `SELECT s.*, c.name AS class_name
     FROM students s
     LEFT JOIN classes c ON c.id = s.class_id
     ${whereSql}
     ORDER BY s.last_name, s.first_name`,
    values
  );

  return res.json(result.rows);
}

export async function getStudentById(req, res) {
  const result = await query(
    `SELECT s.*, c.name AS class_name
     FROM students s
     LEFT JOIN classes c ON c.id = s.class_id
     WHERE s.id = $1`,
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Student not found" });
  }

  return res.json(result.rows[0]);
}

export async function updateStudent(req, res) {
  const fields = [
    "student_code",
    "first_name",
    "last_name",
    "dob",
    "gender",
    "guardian_name",
    "guardian_phone",
    "guardian_email",
    "status",
    "class_id",
  ];

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
    `UPDATE students SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Student not found" });
  }

  return res.json(result.rows[0]);
}

export async function deleteStudent(req, res) {
  const result = await query("DELETE FROM students WHERE id = $1 RETURNING id", [req.params.id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Student not found" });
  }

  return res.status(204).send();
}
