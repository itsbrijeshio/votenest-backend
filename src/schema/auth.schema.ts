import zod from "zod";

const name = zod
  .string({
    error: "Name is required",
  })
  .min(3, "Name must be at least 3 characters long")
  .max(30, "Name must be at most 30 characters long");

const email = zod
  .string({
    error: "Email is required",
  })
  .email("Invalid email");

const password = zod
  .string({
    error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters long")
  .max(30, "Password must be at most 30 characters long");

export const registerSchema = zod
  .object({
    name,
    email,
    password,
  })
  .strict();

export const loginSchema = zod
  .object({
    email,
    password,
  })
  .strict();
