import zod from "zod";

const title = zod
  .string({
    error: "Title is required",
  })
  .min(10, { message: "Title must be at least 10 characters long" })
  .max(200, { message: "Title must not exceed 200 characters" });

const description = zod
  .string({ error: "Description must be a string" })
  .min(20, { message: "Description must be at least 20 characters long" })
  .max(500, { message: "Description must not exceed 500 characters" });

const isPublic = zod
  .boolean({ error: "isPublic must be a boolean" })
  .default(true);

const expiresAt = zod.date({
  error: "expiresAt must be a valid date",
});

const options = zod
  .array(
    zod
      .string({
        error: "Each option must be a string",
      })
      .min(1, { message: "Option cannot be empty" })
  )
  .min(2, { message: "At least 2 options are required" })
  .max(6, { message: "You can provide at most 6 options" });

export const createPollSchema = zod
  .object({
    title,
    description: description.optional(),
    isPublic,
    expiresAt: expiresAt.optional(),
    options,
  })
  .strict();

export const updatePollSchema = zod
  .object({
    title: title.optional(),
    description: description.optional(),
    isPublic: isPublic.optional(),
    expiresAt: expiresAt.optional(),
    options: options.optional(),
  })
  .strict();

export const voteSchema = zod
  .object({
    optionId: zod
      .string({
        error: "optionId is required",
      })
      .nonempty({ message: "optionId cannot be empty" }),
  })
  .strict();

