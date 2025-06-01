const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  rate: Number,
  unit: String,
});

module.exports = mongoose.model("Product", ProductSchema);
