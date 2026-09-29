const Joi = require("joi");

const validateInventory = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  category: Joi.string()
    .allow("Alcoholic", "Soft Drinks", "Mineral Water", "Energy Drinks")
    .required(),
    description: Joi.string().min(3).max(100).required()
});


module.exports = validateInventory;