const express = require("express");

const cors = require("cors");
const path = require("path");
const { connectDB } = require("./db/db.js");

const app = express();

//to send json data
app.use(express.json());

//to send form data
app.use(express.urlencoded());
app.use(cors());


connectDB();

// Import Routes
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");


app.use("/api/products", productRoutes);
app.use("/api/invoice", invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose.connect("mongodb://127.0.0.1:27017/invoice_db", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }, () => console.log("MongoDB Connected"));

// const productRoutes = require("./routes/productRoutes");
// const invoiceRoutes = require("./routes/invoiceRoutes");

// app.use("/api/products", productRoutes);
// app.use("/api/invoice", invoiceRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
