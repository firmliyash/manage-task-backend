import Joi from "joi";

const authSchema = {
  signupSchema: Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
    confirmPassword: Joi.string()
      .trim()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
  }),
};
export default authSchema;
