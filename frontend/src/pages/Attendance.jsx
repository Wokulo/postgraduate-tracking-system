import { useState } from "react";
import api from "../api/client.js";

export default function Attendance() {
  const [studentId, setStudentId] = useState(1);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("present");
  const [message, setMessage] = useState("");

  async function submitAttendance(e) {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/attendance", {
        student_id: Number(studentId),
        attendance_date: attendanceDate,
        status,
      });
      setMessage("Attendance saved.");
    } catch {
      setMessage("Failed to save attendance.");
    }
  }

  return (
    <section>
      <h1>Attendance</h1>
      <form className="form-grid" onSubmit={submitAttendance}>
        <input
          type="number"
          value={studentId}
          min={1}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Student ID"
        />
        <input
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
