import { object, string, InferType } from "yup";

export const loginFormSchema = object({
  email: string().email().required(),
  password: string().required(),
}).required();

export type LoginFormType = InferType<typeof loginFormSchema>;