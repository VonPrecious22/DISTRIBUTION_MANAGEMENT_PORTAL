const { required } = require("joi");
const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
     category: {
        type: String,
         enum: ['Alcoholic', 'Soft Drinks', 'Mineral Water', 'Energy Drinks'],
        required: true,
        unique: true
     },
    description: {
        type: String,
        required: true
    },
},
{timestamps: true}
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
