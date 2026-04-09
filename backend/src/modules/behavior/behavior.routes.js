import { Router } from "express";
import {
  createBehaviorNote,
  getBehaviorNotes,
  updateBehaviorNote,
  deleteBehaviorNote,
} from "./behavior.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { behaviorSchemas } from "../../validation/schemas.js";

export const behaviorRouter = Router();

behaviorRouter.use(authRequired);
behaviorRouter.post("/", validate(behaviorSchemas.create), asyncHandler(createBehaviorNote));
behaviorRouter.get("/", validate(behaviorSchemas.list), asyncHandler(getBehaviorNotes));
behaviorRouter.put("/:id", validate(behaviorSchemas.update), asyncHandler(updateBehaviorNote));
behaviorRouter.delete("/:id", validate(behaviorSchemas.delete), asyncHandler(deleteBehaviorNote));
