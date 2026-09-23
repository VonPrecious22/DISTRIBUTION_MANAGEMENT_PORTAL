const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: string,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
   category: {
  type: string,
  enum: ['Alcoholic', 'Soft Drinks', 'Natural Water', 'Energy Drinks'],
  required: true
    }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);
module.exports = Product