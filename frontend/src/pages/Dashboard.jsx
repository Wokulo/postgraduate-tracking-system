import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/alerts").then((res) => setAlerts(res.data)).catch(() => setAlerts([]));
  }, []);

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Open alerts and quick monitoring.</p>
      <div className="cards">
        {alerts.slice(0, 5).map((alert) => (
          <article key={alert.id} className="card">
            <h3>{alert.first_name} {alert.last_name}</h3>
            <p>{alert.alert_type}</p>
            <small>{alert.message}</small>
          </article>
        ))}
        {!alerts.length && <p>No alerts yet.</p>}
      </div>
    </section>
  );
}
