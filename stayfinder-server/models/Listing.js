const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: String,
  price: Number,
  description: String,
  image: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model("Listing", listingSchema); // ✅ matches "Listing" ref

