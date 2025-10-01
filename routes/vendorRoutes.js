


const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/vendorModel");

// multer config: upload destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET /vendor - display product form and product list
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({createdAt: -1});
    
    // Calculate total sales/orders stock data (dummy values, adjust as needed)
    const totalSales = 0; // replace with logic if you have sales data
    const totalOrders = 0; // replace with logic if you have orders data
    const totalAmount = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);

    res.render('vendor', { 
      products, 
      totalSales, 
      totalOrders, 
      totalAmount, 
      totalItems,
      formData: {}, 
      formErrors: null, 
      error: null,
      message: null
    });
  } catch (error) {
    res.render('vendor', { error: "Error loading products", products: [] });
  }
});

// POST /vendor - handle form submit and upload image; respond with JSON of new product
router.post('/', upload.single('image'), async (req, res) => {
  const { name, category, price, stock, color } = req.body;
  let formErrors = {};

  // Basic validation example
  if (!name) formErrors.name = "Product name is required";
  if (!category) formErrors.category = "Category is required";
  if (!price || price <= 0) formErrors.price = "Price must be greater than 0";
  if (stock == null || stock < 0) formErrors.stock = "Stock cannot be negative";

  if (Object.keys(formErrors).length > 0) {
    // You can choose to respond with errors as JSON or render if accessed via non-AJAX
    return res.status(400).json({ formErrors });
  }

  try {
    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    const newProduct = new Product({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      color,
      image
    });

    await newProduct.save();

    // Respond with JSON data of newly created product for frontend to update table dynamically
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to save product" });
  }
});

module.exports = router;

