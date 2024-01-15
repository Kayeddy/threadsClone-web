import * as zodValidator from "zod";

export const userFormDataValidation = zodValidator.object({
  userProfileImage: zodValidator.string().url().min(1),
  name: zodValidator
    .string()
    .min(3, { message: "Your name must contain at least 3 characters" })
    .max(30),
  username: zodValidator
    .string()
    .min(3, { message: "Your name must contain at least 3 characters" })
    .max(30, {
      message: "Your username cannot be more than 30 characters long",
    }),
  bio: zodValidator
    .string()
    .min(10, { message: "Your Bio needs to be more than 10 characters long" })
    .max(100, { message: "Your Bio cannot be more than 100 characters long" }),
});
