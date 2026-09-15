import Joi from "joi";

export const userValidator = Joi.object({
  username: Joi.string()
    .min(3)
    .max(15)
    .required()
    .pattern(/^[^@]+$/),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
