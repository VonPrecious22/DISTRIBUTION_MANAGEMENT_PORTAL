const Joi = require("joi");

const createProductValidator = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
});

const updateProductValidator = Joi.object({
  name: Joi.string().min(2).max(50),
  description: Joi.string().min(3).max(200),
  price: Joi.number().positive(),
  quantity: Joi.number().integer().min(0),
}).min(1);

module.exports = { createProductValidator, updateProductValidator };
