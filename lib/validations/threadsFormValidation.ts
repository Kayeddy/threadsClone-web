import * as zodValidator from "zod";

export const ThreadFormValidation = zodValidator.object({
  thread: zodValidator
    .string()
    .min(3, { message: "This field must contain at least 3 characters" }),
  accountId: zodValidator.string(),
});

export const ThreadCommentFormValidation = zodValidator.object({
  threadComment: zodValidator
    .string()
    .min(3, { message: "This field must contain at least 3 characters" })
    .max(100, "The comment is too long"),
});

export const ThreadCommentChildFormValidation = zodValidator.object({
  threadComment: zodValidator
    .string()
    .min(3, { message: "This field must contain at least 3 characters" })
    .max(100, "The comment is too long"),
});
