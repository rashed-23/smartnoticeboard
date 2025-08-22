const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
  },
});

module.exports = mongoose.model("Pin", pinSchema);
