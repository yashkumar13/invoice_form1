const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, rate, unit } = req.body;
    
    const newProduct = new Product({ name, rate, unit });
    await newProduct.save();
    
    res.json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;






// const express = require("express");
// const router = express.Router();
// const Product = require("../models/product");

// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const { name, rate, unit } = req.body;
//     const newProduct = new Product({ name, rate, unit });
//     await newProduct.save();
//     res.json({ message: "Product added successfully", product: newProduct });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
