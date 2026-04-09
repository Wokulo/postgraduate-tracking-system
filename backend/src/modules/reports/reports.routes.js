import { Router } from "express";
import { getStudentReport, getClassReport, getAtRiskReport } from "./reports.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { reportsSchemas } from "../../validation/schemas.js";

export const reportsRouter = Router();

reportsRouter.use(authRequired);
reportsRouter.get("/student/:id", validate(reportsSchemas.student), asyncHandler(getStudentReport));
reportsRouter.get("/class/:classId", validate(reportsSchemas.class), asyncHandler(getClassReport));
reportsRouter.get("/at-risk", validate(reportsSchemas.atRisk), asyncHandler(getAtRiskReport));
