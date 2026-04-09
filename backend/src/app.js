import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes.js";
import { studentsRouter } from "./modules/students/students.routes.js";
import { attendanceRouter } from "./modules/attendance/attendance.routes.js";
import { gradesRouter } from "./modules/grades/grades.routes.js";
import { behaviorRouter } from "./modules/behavior/behavior.routes.js";
import { alertsRouter } from "./modules/alerts/alerts.routes.js";
import { reportsRouter } from "./modules/reports/reports.routes.js";
import { classesRouter } from "./modules/classes/classes.routes.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/students", studentsRouter);
app.use("/api/classes", classesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/grades", gradesRouter);
app.use("/api/behavior-notes", behaviorRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/reports", reportsRouter);

app.use(notFound);
app.use(errorHandler);
