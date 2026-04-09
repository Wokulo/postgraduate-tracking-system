import { Router } from "express";
import { getClasses } from "./classes.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { classesSchemas } from "../../validation/schemas.js";

export const classesRouter = Router();

classesRouter.use(authRequired);
classesRouter.get("/", validate(classesSchemas.list), asyncHandler(getClasses));
