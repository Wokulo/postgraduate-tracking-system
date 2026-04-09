import { Router } from "express";
import { getAlerts, runAlerts, resolveAlert } from "./alerts.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { alertsSchemas } from "../../validation/schemas.js";

export const alertsRouter = Router();

alertsRouter.use(authRequired);
alertsRouter.get("/", validate(alertsSchemas.list), asyncHandler(getAlerts));
alertsRouter.post("/run", validate(alertsSchemas.run), asyncHandler(runAlerts));
alertsRouter.patch("/:id/resolve", validate(alertsSchemas.resolve), asyncHandler(resolveAlert));
