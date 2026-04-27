import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format");
const idParam = z.coerce.number().int().positive();

const nullableTrimmed = z.string().trim().min(1).optional().nullable();

const studentBase = {
  student_code: z.string().trim().min(2).max(30),
  first_name: z.string().trim().min(1).max(80),
  last_name: z.string().trim().min(1).max(80),
  dob: dateString.optional().nullable(),
  gender: z.string().trim().max(20).optional().nullable(),
  guardian_name: z.string().trim().max(120).optional().nullable(),
  guardian_phone: z.string().trim().max(30).optional().nullable(),
  guardian_email: z.string().trim().email().max(150).optional().nullable(),
  class_id: z.coerce.number().int().positive().optional().nullable(),
  status: z.enum(["active", "inactive"]).optional(),
};

export const authSchemas = {
  register: z.object({
    body: z.object({
      full_name: z.string().trim().min(2).max(120),
      email: z.string().trim().email().max(150),
      password: z.string().min(6).max(120),
      role: z.enum(["admin", "teacher"]),
    }),
    params: z.object({}),
    query: z.object({}),
  }),
  login: z.object({
    body: z.object({
      email: z.string().trim().email(),
      password: z.string().min(6).max(120),
    }),
    params: z.object({}),
    query: z.object({}),
  }),
};

export const studentsSchemas = {
  create: z.object({
    body: z.object({
      student_code: studentBase.student_code,
      first_name: studentBase.first_name,
      last_name: studentBase.last_name,
      dob: studentBase.dob,
      gender: studentBase.gender,
      guardian_name: studentBase.guardian_name,
      guardian_phone: studentBase.guardian_phone,
      guardian_email: studentBase.guardian_email,
      status: studentBase.status,
      class_id: studentBase.class_id,
    }),
    params: z.object({}),
    query: z.object({}),
  }),
  list: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
      classId: z.coerce.number().int().positive().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    }),
  }),
  byId: z.object({
    body: z.object({}),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
  update: z.object({
    body: z
      .object({
        student_code: studentBase.student_code.optional(),
        first_name: studentBase.first_name.optional(),
        last_name: studentBase.last_name.optional(),
        dob: studentBase.dob,
        gender: studentBase.gender,
        guardian_name: studentBase.guardian_name,
        guardian_phone: studentBase.guardian_phone,
        guardian_email: studentBase.guardian_email,
        status: studentBase.status,
        class_id: studentBase.class_id,
      })
      .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
  delete: z.object({
    body: z.object({}),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
};

export const classesSchemas = {
  list: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
  }),
};

export const attendanceSchemas = {
  mark: z.object({
    body: z.object({
      student_id: z.coerce.number().int().positive(),
      attendance_date: dateString,
      status: z.enum(["present", "absent", "late"]),
      reason: nullableTrimmed,
    }),
    params: z.object({}),
    query: z.object({}),
  }),
  bulk: z.object({
    body: z.object({
      attendance_date: dateString,
      entries: z
        .array(
          z.object({
            student_id: z.coerce.number().int().positive(),
            status: z.enum(["present", "absent", "late"]),
            reason: nullableTrimmed,
          })
        )
        .min(1),
    }),
    params: z.object({}),
    query: z.object({}),
  }),
  list: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
      studentId: z.coerce.number().int().positive().optional(),
      from: dateString.optional(),
      to: dateString.optional(),
    }),
  }),
};

export const gradesSchemas = {
  create: z.object({
    body: z.object({
      student_id: z.coerce.number().int().positive(),
      subject_id: z.coerce.number().int().positive(),
      title: z.string().trim().min(1).max(120),
      score: z.coerce.number().min(0),
      max_score: z.coerce.number().positive(),
      graded_on: dateString,
      remarks: nullableTrimmed,
    }),
    params: z.object({}),
    query: z.object({}),
  }),
  list: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
      studentId: z.coerce.number().int().positive().optional(),
      subjectId: z.coerce.number().int().positive().optional(),
    }),
  }),
  update: z.object({
    body: z
      .object({
        student_id: z.coerce.number().int().positive().optional(),
        subject_id: z.coerce.number().int().positive().optional(),
        title: z.string().trim().min(1).max(120).optional(),
        score: z.coerce.number().min(0).optional(),
        max_score: z.coerce.number().positive().optional(),
        graded_on: dateString.optional(),
        remarks: nullableTrimmed,
      })
      .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
  delete: z.object({
    body: z.object({}),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
};

export const behaviorSchemas = {
  create: z.object({
    body: z.object({
      student_id: z.coerce.number().int().positive(),
      note_type: z.enum(["positive", "negative", "neutral"]),
      note: z.string().trim().min(1),
      incident_date: dateString,
      follow_up_required: z.boolean().optional(),
    }),
    params: z.object({}),
    query: z.object({}),
  }),
  list: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({
      studentId: z.coerce.number().int().positive().optional(),
    }),
  }),
  update: z.object({
    body: z
      .object({
        note_type: z.enum(["positive", "negative", "neutral"]).optional(),
        note: z.string().trim().min(1).optional(),
        incident_date: dateString.optional(),
        follow_up_required: z.boolean().optional(),
      })
      .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
  delete: z.object({
    body: z.object({}),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
};

export const alertsSchemas = {
  list: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
  }),
  run: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
  }),
  resolve: z.object({
    body: z.object({}),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
};

export const reportsSchemas = {
  student: z.object({
    body: z.object({}),
    params: z.object({ id: idParam }),
    query: z.object({}),
  }),
  class: z.object({
    body: z.object({}),
    params: z.object({ classId: idParam }),
    query: z.object({}),
  }),
  atRisk: z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
  }),
};
