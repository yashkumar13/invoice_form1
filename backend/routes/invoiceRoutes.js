const express = require("express");
const router = express.Router();
const { InvoiceMaster, InvoiceDetail } = require("../models/invoice");

// Save invoice
router.post("/", async (req, res) => {
  try {
    console.log("Received Data:", JSON.stringify(req.body, null, 2));

    const { customer_name, products } = req.body;
    if (!customer_name || !products || products.length === 0) {
      return res.status(400).json({ message: "Customer name and products are required" });
    }

    // Ensure all numbers are properly casted
    products.forEach(p => {
      p.net_amount = Number(p.netAmount) || 0;
      p.total_amount = Number(p.totalAmount) || 0;
    });

    // Calculate total amount safely
    const totalAmount = products.reduce((acc, p) => acc + p.total_amount, 0);

    if (isNaN(totalAmount)) {
      return res.status(400).json({ message: "Total Amount is invalid (NaN detected)" });
    }

    // Generate Invoice Number
    const lastInvoice = await InvoiceMaster.find().sort({ invoice_no: -1 }).limit(1);
    const newInvoiceNo = lastInvoice.length > 0 ? lastInvoice[0].invoice_no + 1 : 1;

    // Create Invoice
    const invoiceMaster = new InvoiceMaster({
      invoice_no: newInvoiceNo,
      customer_name,
      total_amount: totalAmount,
    });

    await invoiceMaster.save();

    console.log("Invoice Master Saved:", invoiceMaster);

    // Insert Invoice Details
    const invoiceDetails = products.map((p) => ({
      invoice_id: invoiceMaster._id,
      product_id: p.product_id,
      rate: p.rate,
      unit: p.unit,
      qty: p.qty,
      discount: p.discount,
      net_amount: p.net_amount,
      total_amount: p.total_amount,
    }));

    await InvoiceDetail.insertMany(invoiceDetails);
    console.log("Invoice Details Saved:", invoiceDetails);

    res.json({ message: "Invoice saved successfully" });
  } catch (err) {
    console.error("Error saving invoice:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const invoices = await InvoiceMaster.find().sort({ invoice_no: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await InvoiceMaster.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const invoiceDetails = await InvoiceDetail.find({ invoice_id: invoice._id }).populate("product_id");

    res.json({
      ...invoice._doc,
      products: invoiceDetails,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

















// const express = require("express");
// const router = express.Router();
// const { InvoiceMaster, InvoiceDetail } = require("../models/invoice");

// router.post("/", async (req, res) => {
//   try {
//     const { customer_name, products } = req.body;
//     if (!customer_name || !products || products.length === 0) {
//       return res.status(400).json({ message: "Customer name and products are required" });
//     }

//     products.forEach(p => {
//       p.net_amount = Number(p.netAmount) || 0;
//       p.total_amount = Number(p.totalAmount) || 0;
//     });

//     const totalAmount = products.reduce((acc, p) => acc + p.total_amount, 0);

//     const lastInvoice = await InvoiceMaster.find().sort({ invoice_no: -1 }).limit(1);
//     const newInvoiceNo = lastInvoice.length > 0 ? lastInvoice[0].invoice_no + 1 : 1;

//     const invoiceMaster = new InvoiceMaster({
//       invoice_no: newInvoiceNo,
//       customer_name,
//       total_amount: totalAmount,
//     });

//     await invoiceMaster.save();

//     const invoiceDetails = products.map((p) => ({
//       invoice_id: invoiceMaster._id,
//       product_id: p.product_id,
//       rate: p.rate,
//       unit: p.unit,
//       qty: p.qty,
//       discount: p.discount,
//       net_amount: p.net_amount,
//       total_amount: p.total_amount,
//     }));

//     await InvoiceDetail.insertMany(invoiceDetails);

//     res.json({ message: "Invoice saved successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
