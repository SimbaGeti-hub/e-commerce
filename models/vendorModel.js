const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  color: { type: String },
  image: { type: String } // store filename or path of uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
