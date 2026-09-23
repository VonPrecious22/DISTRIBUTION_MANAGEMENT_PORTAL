const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    depot: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Depot"
    }
},
{timestamps: true}
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
