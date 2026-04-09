import { Router } from "express";
import { createGrade, getGrades, updateGrade, deleteGrade } from "./grades.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { gradesSchemas } from "../../validation/schemas.js";

export const gradesRouter = Router();

gradesRouter.use(authRequired);
gradesRouter.post("/", validate(gradesSchemas.create), asyncHandler(createGrade));
gradesRouter.get("/", validate(gradesSchemas.list), asyncHandler(getGrades));
gradesRouter.put("/:id", validate(gradesSchemas.update), asyncHandler(updateGrade));
gradesRouter.delete("/:id", validate(gradesSchemas.delete), asyncHandler(deleteGrade));
