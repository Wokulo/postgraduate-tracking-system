import { ZodError } from "zod";

export class AppError extends Error {
  constructor(message, statusCode = 400, code = "BAD_REQUEST", details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notFound(_req, _res, next) {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
}

function fromPgError(err) {
  if (!err || !err.code) {
    return null;
  }

  if (err.code === "23505") {
    return new AppError("Duplicate resource", 409, "CONFLICT", {
      constraint: err.constraint,
      detail: err.detail,
    });
  }

  if (err.code === "23503") {
    return new AppError("Referenced resource does not exist", 400, "FOREIGN_KEY_VIOLATION", {
      constraint: err.constraint,
      detail: err.detail,
    });
  }

  return null;
}

export function errorHandler(err, _req, res, _next) {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Malformed JSON body",
      code: "INVALID_JSON",
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.errors.map((item) => ({
        path: item.path.join("."),
        message: item.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  }

  const dbError = fromPgError(err);
  if (dbError) {
    return res.status(dbError.statusCode).json({
      message: dbError.message,
      code: dbError.code,
      details: dbError.details,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
