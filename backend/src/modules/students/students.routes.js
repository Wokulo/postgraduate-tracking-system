import { Router } from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "./students.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { studentsSchemas } from "../../validation/schemas.js";

export const studentsRouter = Router();

studentsRouter.use(authRequired);
studentsRouter.post("/", validate(studentsSchemas.create), asyncHandler(createStudent));
studentsRouter.get("/", validate(studentsSchemas.list), asyncHandler(getStudents));
studentsRouter.get("/:id", validate(studentsSchemas.byId), asyncHandler(getStudentById));
studentsRouter.put("/:id", validate(studentsSchemas.update), asyncHandler(updateStudent));
studentsRouter.delete("/:id", validate(studentsSchemas.delete), asyncHandler(deleteStudent));
