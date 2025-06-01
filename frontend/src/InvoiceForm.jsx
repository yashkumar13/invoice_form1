import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InvoiceForm.css"; // Import CSS file

function InvoiceForm() {

  const url = "https://invoice-form1-backend.onrender.com"
  const [customerName, setCustomerName] = useState("");               //ok
  const [products, setProducts] = useState([]);                       //ok
  const [selectedProduct, setSelectedProduct] = useState("");         //ok
  
  const [qty, setQty] = useState(1);                 //ok
  const [discount, setDiscount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState([]);               //ok

  useEffect(() => {
    axios.get(`${url}/api/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleProductChange = (event) => {
    const product = products.find((p) => p._id === event.target.value);
    setSelectedProduct(product);
  };

  const netAmount = selectedProduct ? selectedProduct.rate - (selectedProduct.rate * discount) / 100 : 0;
  const totalAmount = netAmount * qty;

  const handleAddProduct = () => {
    if (!selectedProduct) return alert("Please select a product!");

    setInvoiceItems([...invoiceItems, {
      product_id: selectedProduct._id,
      name: selectedProduct.name,
      rate: selectedProduct.rate,
      unit: selectedProduct.unit,
      qty,
      discount,
      netAmount,
      totalAmount,
    }]);

    setSelectedProduct("");
    setQty(1);
    setDiscount(0);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!customerName) return alert("Please enter a customer name!");
    if (invoiceItems.length === 0) return alert("Please add at least one product!");

    axios.post(`${url}/api/invoice`, {
      customer_name: customerName,
      products: invoiceItems,
    })
    .then((response) => {
      alert("Invoice saved successfully!");
      setCustomerName("");
      setInvoiceItems([]);
    })
    .catch((error) => {
      console.error("Error saving invoice:", error);
    });
  };
  ///////////////////
  return (
    <div className="invoice-container">
      <h2>Invoice Form</h2>

      <div className="form-group">
        <label>Customer Name:</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Product:</label>
        <select onChange={handleProductChange} value={selectedProduct ? selectedProduct._id : ""}>
          <option value="">Select a product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <>
          <div className="form-group">
            <label>Rate:</label>
            <input type="text" value={selectedProduct.rate} readOnly />
          </div>
          <div className="form-group">
            <label>Unit:</label>
            <input type="text" value={selectedProduct.unit} readOnly />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Quantity:</label>
        <button onClick={() => setQty((prev) => Math.max(1, prev - 1))} className="qty-btn">-</button>
        <input type="number" value={qty} min="1" onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
        <button onClick={() => setQty((prev) => prev + 1)} className="qty-btn">+</button>
      </div>

      <div className="form-group">
        <label>Discount %:</label>
        <input type="number" value={discount} min="0" onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))} />
      </div>

      <div className="form-group">
        <label>Net Amount:</label>
        <input type="text" value={netAmount.toFixed(2)} readOnly />
      </div>
      <div className="form-group">
        <label>Total Amount:</label>
        <input type="text" value={totalAmount.toFixed(2)} readOnly />
      </div>

      <button className="add-btn" onClick={handleAddProduct}>+ ADD</button>

      {invoiceItems.length > 0 && (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Rate</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Discount %</th>
              <th>Net Amount</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.rate}</td>
                <td>{item.unit}</td>
                <td>{item.qty}</td>
                <td>{item.discount}%</td>
                <td>{item.netAmount.toFixed(2)}</td>
                <td>{item.totalAmount.toFixed(2)}</td>
                <td>
                  <button className="remove-btn" onClick={() => handleRemoveItem(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="submit-btn" onClick={handleSubmit}>SUBMIT</button>
    </div>
  );
}

export default InvoiceForm;











// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./InvoiceForm.css";

// function InvoiceForm() {
//   const [customerName, setCustomerName] = useState("");
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [qty, setQty] = useState(1);
//   const [discount, setDiscount] = useState(0);
//   const [invoiceItems, setInvoiceItems] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/products")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleProductChange = (e) => {
//     const product = products.find((p) => p._id === e.target.value);
//     setSelectedProduct(product);
//   };

//   const netAmount = selectedProduct ? selectedProduct.rate - (selectedProduct.rate * discount / 100) : 0;
//   const totalAmount = netAmount * qty;

//   const handleAddProduct = () => {
//     if (!selectedProduct) return alert("Select a product");
//     setInvoiceItems([...invoiceItems, {
//       product_id: selectedProduct._id,
//       name: selectedProduct.name,
//       rate: selectedProduct.rate,
//       unit: selectedProduct.unit,
//       qty,
//       discount,
//       netAmount,
//       totalAmount,
//     }]);
//     setSelectedProduct("");
//     setQty(1);
//     setDiscount(0);
//   };

//   const handleSubmit = () => {
//     if (!customerName || invoiceItems.length === 0) return alert("Fill all fields");

//     axios.post("http://localhost:5000/api/invoice", {
//       customer_name: customerName,
//       products: invoiceItems
//     }).then(() => {
//       alert("Invoice saved");
//       setCustomerName("");
//       setInvoiceItems([]);
//     });
//   };

//   return (
//     <div className="invoice-container">
//       <h2>Invoice Form</h2>

//       <div className="form-group">
//         <label>Customer Name:</label>
//         <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
//       </div>

//       <div className="form-group">
//         <label>Product:</label>
//         <select onChange={handleProductChange} value={selectedProduct?._id || ""}>
//           <option value="">Select product</option>
//           {products.map((p) => (
//             <option key={p._id} value={p._id}>{p.name}</option>
//           ))}
//         </select>
//       </div>

//       {selectedProduct && (
//         <>
//           <div className="form-group">
//             <label>Rate:</label>
//             <input type="text" value={selectedProduct.rate} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Unit:</label>
//             <input type="text" value={selectedProduct.unit} readOnly />
//           </div>
//         </>
//       )}

//       <div className="form-group">
//         <label>Quantity:</label>
//         <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
//       </div>

//       <div className="form-group">
//         <label>Discount %:</label>
//         <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
//       </div>

//       <div className="form-group">
//         <label>Total Amount:</label>
//         <input type="text" value={totalAmount.toFixed(2)} readOnly />
//       </div>

//       <button onClick={handleAddProduct}>+ Add</button>

//       {invoiceItems.length > 0 && (
//         <table>
//           <thead>
//             <tr>
//               <th>Product</th><th>Qty</th><th>Rate</th><th>Discount</th><th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoiceItems.map((item, i) => (
//               <tr key={i}>
//                 <td>{item.name}</td>
//                 <td>{item.qty}</td>
//                 <td>{item.rate}</td>
//                 <td>{item.discount}</td>
//                 <td>{item.totalAmount.toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// }

// export default InvoiceForm;


