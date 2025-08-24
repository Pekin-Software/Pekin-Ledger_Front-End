import React, { useState } from "react";
import { X } from "lucide-react";
import "./productsVariants.css";
import ImageUploader from "../imageUploader";
const Modal = ({ onClose }) => {
    const [formData, setFormData] = useState({
    quantity: 1,
    expired_date: "",
    purchase_price: "",
    wholesale_quantity: 0,
    wholesale_selling_price: "",
    retail_selling_price: "",
    purchase_date: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (formData.purchase_price < 0) {
      newErrors.purchase_price = "Purchase price cannot be negative";
    }

    if (formData.wholesale_quantity < 0) {
      newErrors.wholesale_quantity = "Wholesale quantity cannot be negative";
    }

    if (formData.wholesale_selling_price < 0) {
      newErrors.wholesale_selling_price = "Wholesale selling price cannot be negative";
    }

    if (formData.retail_selling_price < 0) {
      newErrors.retail_selling_price = "Retail selling price cannot be negative";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log("Submitting form:", formData);
      // 🔗 send formData to backend API with fetch/axios
      onClose(); // close modal after success
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal">

      <span className="frm-header">
          
        <h2>Restock Product</h2>
        <button className="frm-close-btn" onClick={onClose}>
          <X  size={20} className="frm-icon"/>
        </button>
      </span>

        <form className="modal-form" onSubmit={handleSubmit}>

          <span className="frm-row">
            <label>
            Purchase Price:
            <input
                type="number"
                step="0.01"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                required
                inputMode="decimal"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                    }
                }}
            />
            {errors.purchase_price && <span className="error">{errors.purchase_price}</span>}
          </label>
                 
          <label>
            Purchase Date:
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
            />
          </label>
                    <label>
            Expired Date:
            <input
              type="date"
              name="expired_date"
              value={formData.expired_date}
              onChange={handleChange}
            />
          </label>
          </span>
            
            <span className="frm-row">
     <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              inputMode="decimal"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                    }
                }}
            />
            {errors.quantity && <span className="error">{errors.quantity}</span>}
          </label>
          {/* Wholesale Quantity */}
          <label>
            Wholesale Quantity:
            <input
              type="number"
              min="0"
              name="wholesale_quantity"
              value={formData.wholesale_quantity}
              onChange={handleChange}
              inputMode="decimal"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                    }
                }}
            />
            {errors.wholesale_quantity && <span className="error">{errors.wholesale_quantity}</span>}
          </label>
            </span>

            <span className="frm-row">
 {/* Wholesale Selling Price */}
          <label>
            Wholesale Selling Price:
            <input
              type="number"
              step="0.01"
              name="wholesale_selling_price"
              value={formData.wholesale_selling_price}
              onChange={handleChange}
              inputMode="decimal"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                    }
                }}
            />
            {errors.wholesale_selling_price && <span className="error">{errors.wholesale_selling_price}</span>}
          </label>

          {/* Retail Selling Price */}
          <label>
            Retail Selling Price:
            <input
              type="number"
              step="0.01"
              name="retail_selling_price"
              value={formData.retail_selling_price}
              onChange={handleChange}
              required
              inputMode="decimal"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                    }
                }}
            />
            {errors.retail_selling_price && <span className="error">{errors.retail_selling_price}</span>}
          </label>
                </span>

          <button type="submit" className="submit-frm">Submit</button>
        </form>

      </div>
    </div>
  );
};

const ProductsVariants = ({ title, price, qty }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="variants">
        <section className="variants-details">
            <div className="card-image">
            <ImageUploader />
        </div>
        <div className="card-body">

          <h3 className="variants-price">
            {price}
           
          </h3>

          <span>
            <p className="variants-attr">{title}{title}{title}{title}</p>
          <p className="stock">Remaining Stock <br /> {qty}</p>
          </span>

        </div>
        </section>

        <section className="actions">
            <button className="add" onClick={() => setIsOpen(true)}>
                RESTOCK VARIANT
            </button>
        </section>
      </div>

      {/* Modal */}
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ProductsVariants;

