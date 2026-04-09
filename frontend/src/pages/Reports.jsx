import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function Reports() {
  const [riskRows, setRiskRows] = useState([]);

  useEffect(() => {
    api.get("/reports/at-risk").then((res) => setRiskRows(res.data)).catch(() => setRiskRows([]));
  }, []);

  return (
    <section>
      <h1>At-Risk Report</h1>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {riskRows.map((row, idx) => (
            <tr key={`${row.id}-${idx}`}>
              <td>{row.first_name} {row.last_name}</td>
              <td>{row.alert_type}</td>
              <td>{row.severity}</td>
              <td>{row.message}</td>
            </tr>
          ))}
          {!riskRows.length && (
            <tr>
              <td colSpan={4}>No at-risk students yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
