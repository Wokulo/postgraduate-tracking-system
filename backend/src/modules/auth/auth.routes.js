import { Router } from "express";
import { login, me, register } from "./auth.controller.js";
import { authRequired } from "../../middleware/auth.js";
import { allowRoles } from "../../middleware/role.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../validation/validate.js";
import { authSchemas } from "../../validation/schemas.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  authRequired,
  allowRoles("admin"),
  validate(authSchemas.register),
  asyncHandler(register)
);
authRouter.post("/login", validate(authSchemas.login), asyncHandler(login));
authRouter.get("/me", authRequired, asyncHandler(me));
