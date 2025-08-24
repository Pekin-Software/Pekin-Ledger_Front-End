import { useState, useEffect } from "react";
import "./store.css";

export default function StoreProfile({ store, onClose, onSave }) {
  const [formData, setFormData] = useState(
    store || {
      store_name: "",
      address: "",
      city: "",
      country: "",
      phone_number: "",
    }
  );


  useEffect(() => {
    if (store) {
      setFormData({
        store_name: store.store_name,
        address: store.address,
        city: store.city,
        country: store.country,
        phone_number: store.phone_number,
      });
    }
  }, [store]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="store-overlay">
      <div className="store-modal">
        <h2>{store ? "Edit Store" : "Add Store"}</h2>
        <form className="store-form">
          <div className="business-name">
            <label>Branch Name</label>
          <input type="text" name="store_name" value={formData.store_name} onChange={handleChange} required />
          </div>
          
          <div className="address-group">
            <span>
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </span>
            <span>
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </span>
          </div>

          <div className="address-group">
            <span>
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required />
            </span>

            <span>
              <label>Phone Number</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            </span>
          </div>

          <div className="button-group">
            <button type="button" className="discard" onClick={onClose}>Discard</button>
            <button type="submit" className="save" onClick={(e) => { e.preventDefault(); onSave(formData); }}>
              {store ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
