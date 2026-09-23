const mongoose = require("mongoose");
const depotSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true
    },
  },
  { timestamps: true },
);

const Depot = mongoose.model("Depot", depotSchema);
module.exports = Depot