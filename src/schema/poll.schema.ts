import zod from "zod";

const question = zod
  .string({
    error: "Question is required",
  })
  .min(3, "Question must be at least 3 characters long")
  .max(100, "Question must be at most 100 characters long");

const description = zod
  .string({
    error: "Description is required",
  })
  .min(3, "Description must be at least 3 characters long")
  .max(1000, "Description must be at most 1000 characters long");

const options = zod
  .array(
    zod.string({
      error: "Options are required",
    })
  )
  .min(2, "Poll must have at least 2 options")
  .max(6, "Poll must have at most 6 options");

export const createPollSchema = zod
  .object({
    question,
    description,
    options,
  })
  .strict();

export const updatePollSchema = zod
  .object({
    question: question.optional(),
    description: description.optional(),
    options: options.optional(),
  })
  .strict();

const optionId = zod.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
  message: "Option ID must be a valid MongoDB ObjectId",
});

export const voteSchema = zod.object({ optionId }).strict();
