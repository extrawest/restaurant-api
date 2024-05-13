import { object, string, InferType } from "yup";

export const registrationFormSchema = object({
  email: string().email().required(),
  password: string().required(),
}).required();

export type RegistrationFormType = InferType<typeof registrationFormSchema>;