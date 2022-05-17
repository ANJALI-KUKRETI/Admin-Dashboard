import * as yup from "yup";
export const Schema = yup
  .object()
  .shape({
    title: yup.string().required("This field is required"),
    category: yup.string().required("This field is required"),
    author: yup
      .string()
      .matches(/^[a-zA-Z\s]*$/g, "Enter a valid Category!(must be a string)")
      .max(30)
      .required("This field is required"),
    content: yup.string().min(5).required("This field is required"),
  })
  .required();
