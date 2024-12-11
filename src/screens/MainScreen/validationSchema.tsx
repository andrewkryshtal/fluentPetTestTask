import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Pet name is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .required("Pet age is required")
    .positive("Age must be positive")
    .integer("Age must be an integer"),
  description: Yup.string().max(
    200,
    "Description cannot exceed 200 characters"
  ),
});
