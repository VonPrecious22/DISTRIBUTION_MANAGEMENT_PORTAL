// validators/userValidator.js
const Joi = require("joi");

const createValidator = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(5).email().required(),
  contact: Joi.string().min(5).max(18).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("manager", "buyer").required(),
});

const createBuyerValidator = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(5).email().required(),
  contact: Joi.string().min(5).max(18).required(),
  password: Joi.string().min(6).required(),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { createValidator, createBuyerValidator, loginValidator };
