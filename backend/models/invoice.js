const mongoose = require("mongoose");

const InvoiceMasterSchema = new mongoose.Schema({
  invoice_no: Number,
  invoice_date: { type: Date, default: Date.now },
  customer_name: String,
  total_amount: Number,
});

const InvoiceDetailSchema = new mongoose.Schema({
  invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: "InvoiceMaster" },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  rate: Number,
  unit: String,
  qty: Number,
  discount: Number,
  net_amount: Number,
  total_amount: Number,
});

const InvoiceMaster = mongoose.model("InvoiceMaster", InvoiceMasterSchema);
const InvoiceDetail = mongoose.model("InvoiceDetail", InvoiceDetailSchema);

module.exports = { InvoiceMaster, InvoiceDetail };
