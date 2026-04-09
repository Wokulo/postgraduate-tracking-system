import { Router } from "express";
import { markAttendance, markAttendanceBulk, getAttendance } from "./attendance.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { attendanceSchemas } from "../../validation/schemas.js";

export const attendanceRouter = Router();

attendanceRouter.use(authRequired);
attendanceRouter.post("/", validate(attendanceSchemas.mark), asyncHandler(markAttendance));
attendanceRouter.post("/bulk", validate(attendanceSchemas.bulk), asyncHandler(markAttendanceBulk));
attendanceRouter.get("/", validate(attendanceSchemas.list), asyncHandler(getAttendance));
