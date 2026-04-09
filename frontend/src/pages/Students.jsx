import { useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const emptyForm = {
  student_code: "",
  first_name: "",
  last_name: "",
  dob: "",
  gender: "",
  guardian_name: "",
  guardian_phone: "",
  guardian_email: "",
  status: "active",
  class_id: "",
};

function normalizePayload(form) {
  return {
    student_code: form.student_code.trim(),
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    dob: form.dob || null,
    gender: form.gender.trim() || null,
    guardian_name: form.guardian_name.trim() || null,
    guardian_phone: form.guardian_phone.trim() || null,
    guardian_email: form.guardian_email.trim() || null,
    status: form.status,
    class_id: form.class_id ? Number(form.class_id) : null,
  };
}

function parseApiFieldErrors(error) {
  const details = error?.response?.data?.details;
  if (!Array.isArray(details)) {
    return {};
  }

  const out = {};
  for (const item of details) {
    if (!item?.path) {
      continue;
    }
    const key = String(item.path).replace(/^body\./, "");
    out[key] = item.message || "Invalid value";
  }
  return out;
}

function parseApiMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError("");
      try {
        const [studentsRes, classesRes] = await Promise.all([
          api.get("/students"),
          api.get("/classes"),
        ]);
        setStudents(studentsRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        setError(parseApiMessage(err, "Failed to load students."));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function startCreate() {
    setShowForm(true);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setFeedback("");
  }

  function startEdit(student) {
    setShowForm(true);
    setEditingId(student.id);
    setForm({
      student_code: student.student_code || "",
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      dob: student.dob ? String(student.dob).slice(0, 10) : "",
      gender: student.gender || "",
      guardian_name: student.guardian_name || "",
      guardian_phone: student.guardian_phone || "",
      guardian_email: student.guardian_email || "",
      status: student.status || "active",
      class_id: student.class_id ? String(student.class_id) : "",
    });
    setFormErrors({});
    setFeedback("");
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback("");
    setFormErrors({});

    if (!form.student_code.trim() || !form.first_name.trim() || !form.last_name.trim()) {
      setFormErrors({
        student_code: !form.student_code.trim() ? "Student code is required" : "",
        first_name: !form.first_name.trim() ? "First name is required" : "",
        last_name: !form.last_name.trim() ? "Last name is required" : "",
      });
      return;
    }

    try {
      const payload = normalizePayload(form);
      if (isEditing) {
        const { data } = await api.put(`/students/${editingId}`, payload);
        const className = classes.find((item) => item.id === data.class_id)?.name || "-";
        setStudents((prev) =>
          prev.map((student) =>
            student.id === editingId ? { ...student, ...data, class_name: className } : student
          )
        );
        setFeedback("Student updated.");
      } else {
        const { data } = await api.post("/students", payload);
        const className = classes.find((item) => item.id === data.class_id)?.name || "-";
        setStudents((prev) => [{ ...data, class_name: className }, ...prev]);
        setFeedback("Student created.");
      }

      cancelForm();
    } catch (err) {
      const parsedErrors = parseApiFieldErrors(err);
      if (Object.keys(parsedErrors).length) {
        setFormErrors(parsedErrors);
      }
      setFeedback(parseApiMessage(err, "Unable to save student."));
    }
  }

  return (
    <section>
      <div className="students-header">
        <h1>Students</h1>
        <button type="button" onClick={startCreate}>Add Student</button>
      </div>

      {feedback && <p>{feedback}</p>}
      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="student-form" onSubmit={handleSubmit}>
          <h2>{isEditing ? "Edit Student" : "Add Student"}</h2>

          <div className="form-grid">
            <label>
              Student Code
              <input value={form.student_code} onChange={(e) => updateForm("student_code", e.target.value)} />
              {formErrors.student_code && <small className="error">{formErrors.student_code}</small>}
            </label>
            <label>
              First Name
              <input value={form.first_name} onChange={(e) => updateForm("first_name", e.target.value)} />
              {formErrors.first_name && <small className="error">{formErrors.first_name}</small>}
            </label>
            <label>
              Last Name
              <input value={form.last_name} onChange={(e) => updateForm("last_name", e.target.value)} />
              {formErrors.last_name && <small className="error">{formErrors.last_name}</small>}
            </label>
            <label>
              Date Of Birth
              <input type="date" value={form.dob} onChange={(e) => updateForm("dob", e.target.value)} />
              {formErrors.dob && <small className="error">{formErrors.dob}</small>}
            </label>
            <label>
              Gender
              <input value={form.gender} onChange={(e) => updateForm("gender", e.target.value)} />
              {formErrors.gender && <small className="error">{formErrors.gender}</small>}
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => updateForm("status", e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {formErrors.status && <small className="error">{formErrors.status}</small>}
            </label>
            <label>
              Class
              <select value={form.class_id} onChange={(e) => updateForm("class_id", e.target.value)}>
                <option value="">No class</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              {formErrors.class_id && <small className="error">{formErrors.class_id}</small>}
            </label>
            <label>
              Guardian Name
              <input value={form.guardian_name} onChange={(e) => updateForm("guardian_name", e.target.value)} />
              {formErrors.guardian_name && <small className="error">{formErrors.guardian_name}</small>}
            </label>
            <label>
              Guardian Phone
              <input value={form.guardian_phone} onChange={(e) => updateForm("guardian_phone", e.target.value)} />
              {formErrors.guardian_phone && <small className="error">{formErrors.guardian_phone}</small>}
            </label>
            <label>
              Guardian Email
              <input value={form.guardian_email} onChange={(e) => updateForm("guardian_email", e.target.value)} />
              {formErrors.guardian_email && <small className="error">{formErrors.guardian_email}</small>}
            </label>
          </div>

          <div className="student-form-actions">
            <button type="submit">{isEditing ? "Save Changes" : "Create Student"}</button>
            <button type="button" className="secondary-btn" onClick={cancelForm}>Cancel</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Class</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && students.map((student) => (
            <tr key={student.id}>
              <td>{student.student_code}</td>
              <td>{student.first_name} {student.last_name}</td>
              <td>{student.class_name || "-"}</td>
              <td>{student.status}</td>
              <td>
                <button type="button" className="small-btn" onClick={() => startEdit(student)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {!isLoading && !students.length && (
            <tr>
              <td colSpan={5}>No students found.</td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td colSpan={5}>Loading students...</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
