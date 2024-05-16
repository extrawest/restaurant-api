import { object, string, InferType } from "yup";

export const registrationFormSchema = object({
  email: string().email().required(),
  password: string().min(5).required(),
  name: string().min(3).required()
}).required();

export type RegistrationFormType = InferType<typeof registrationFormSchema>;