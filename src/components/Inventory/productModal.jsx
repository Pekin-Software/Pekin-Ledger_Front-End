
//   const { categories, addProduct } = useApi();
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const [selectedUnit, setSelectedUnit] = useState("");
//   const [currency, setCurrency] = useState("USD");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const newProduct = await addProduct(
//         formData,
//         selectedCategory,
//         selectedUnit,
//         attributes,
//       );

//       if (newProduct && onProductAdded) {
//         onProductAdded(newProduct);
//       }
//     } catch (err) {
//       console.error("Failed to handle product submit:", err);
//     }
//   };

//   return (

              
//               <label>
//                   Category:
//                   <select name="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
//                     <option value="">Select a category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>{cat.name}</option>
//                     ))}
//                   </select>

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import "./productModal.css";
import CategoryForm from "./categoryform";
import { useApi } from "../../ApiContext.jsx";
import { useNavigate } from "react-router-dom";
import { X, Minus} from "lucide-react";

export default function ProductModal({ onClose, onProductAdded }) {
  const navigate = useNavigate();
  const { categories, fetchCategories, addProduct } = useApi();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [barcodeData, setBarcodeData] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [currency, setCurrency] = useState("USD");

  // GST states simplified - will sync with form values below
  const [wholesaleGstIncluded, setWholesaleGstIncluded] = useState(false);
  const [wholesaleGstExcluded, setWholesaleGstExcluded] = useState(false);
  const [retailGstIncluded, setRetailGstIncluded] = useState(false);
  const [retailGstExcluded, setRetailGstExcluded] = useState(false);

  useEffect(() => {
    fetchCategories(); // Fetch categories on mount
  }, [fetchCategories]);
  // react-hook-form setup

  console.log("Fetched categories:", categories);

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_name: "",
      category: "",
      unit: "",
      threshold_value: "",
      barcode: "",
      attributes: [{ name: "", value: "" }],
      lots: [
        {
          purchased_date: "",
          quantity: "",
          wholesale_quantity: "",
          expired_date: "",
          wholesale_purchase_price: "",
          retail_purchase_price: "",
          wholesale_selling_price: "",
          retail_selling_price: "",
        },
      ],
    },
  });

  // Manage dynamic attributes fields
  const { fields: attributes, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control,
    name: "attributes",
  });

  // Memoized unit options
  const unitOptions = useMemo(
    () => [
      "mm", "cm", "m", "yd",
     "dz", "pk", "ctn", "pallet",
      "oz", "g", "kg", "lb", "ton",
      "l"
    ],
    []
  );

  // Watch wholesale and retail selling prices for GST calculation
  const wholesaleSellingPrice = watch("lots.0.wholesale_selling_price");
  const retailSellingPrice = watch("lots.0.retail_selling_price");
  // Barcode scan handler memoized
  const handleScan = useCallback((err, result) => {
    if (result) {
      setBarcodeData(result.text);
      setValue("barcode", result.text);
      setShowScanner(false);
    }
  }, [setValue]);

  // Price formatting utility (memoized callback)
  const formatPrice = useCallback((value) => {
    if (!value) return "";
    if (!/^\d*\.?\d*$/.test(value)) return "";
    return value.includes(".") ? parseFloat(value).toFixed(2) : `${value}.00`;
  }, []);

  // GST calculations memoized with useMemo
  const wholesaleGST = useMemo(() => {
    if (!wholesaleSellingPrice) return "";
    const price = parseFloat(wholesaleSellingPrice);
    if (wholesaleGstIncluded) return (price * 12) / 100;
    if (wholesaleGstExcluded) return (price * 12) / 100;
    return "";
  }, [wholesaleSellingPrice, wholesaleGstIncluded, wholesaleGstExcluded]);

  const retailGST = useMemo(() => {
    if (!retailSellingPrice) return "";
    const price = parseFloat(retailSellingPrice);
    if (retailGstIncluded) return (price * 12) / 100;
    if (retailGstExcluded) return (price * 12) / 100;
    return "";
  }, [retailSellingPrice, retailGstIncluded, retailGstExcluded]);

  // Add attribute if last one is filled
  const addAttributeField = useCallback(() => {
    const lastAttr = getValues("attributes").slice(-1)[0];
    if (lastAttr && lastAttr.name && lastAttr.value && attributes.length < 5) {
      appendAttribute({ name: "", value: "" });
    }
  }, [appendAttribute, attributes.length, getValues]);



  // Handle price blur for formatting prices inside lots
  const handlePriceBlur = useCallback(
    (name, value) => {
      const formatted = formatPrice(value);
      setValue(name, formatted, { shouldValidate: true });
    },
    [formatPrice, setValue]
  );

  const onSubmit = useCallback(
    async (data) => {
      try {
        const newProduct = await addProduct(
          data,
          data.category,
          data.unit,
          data.attributes,
        );
        if (newProduct && onProductAdded) {
          onProductAdded(newProduct);
        }
      } catch (err) {
        console.error("Failed to add product:", err);
      }
    },
    [addProduct, onProductAdded]
  );

  return (
    <div className="modal-overlay" >
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
       <div className="frm-header">
        <span>
            <h2>Add New Product</h2>
            <button className="open-modal-btn" onClick={() => setIsCategoryModalOpen(true)}>
              Create Category
            </button>
        </span>
        <button type="button" className="closeBTN" onClick={onClose}><X  size={18}/></button>
        </div>

        {isCategoryModalOpen && <CategoryForm closeModal={() => setIsCategoryModalOpen(false)} />}

        <form onSubmit={handleSubmit(onSubmit)}>
        
            <div className="detail-section">
            {/* Product Info */}
            <label>
              <p>Product Name:{errors.product_name && <span className="error">*</span>}</p>
              <input type="text" {...register("product_name", { required: true })} 
                 className={errors.product_name ? "input-error" : ""}
              />
             
            </label>
           


            <div className="detail-row">
              <label>
                <p>Category: {errors.category && <span className="error">*</span>}</p>
                <select {...register("category", { required: true })}
                  className={errors.category ? "input-error" : ""}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                
              </label>

              <label>
                Unit:
                <select {...register("unit")}>
                  <option value="">Select Unit</option>
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </label>
            </div>

              <div className="detail-row">
                <label>
                  <p>
                    Quantity: {errors.lots?.[0]?.quantity && <span className="error">*</span>}
                  </p>
                  <input
                    type="number"
                    {...register("lots.0.quantity", { required: true })}
                    className={errors.lots?.[0]?.quantity ? "input-error" : ""}
                  />
                </label>

                <label>
                  <p>
                    Threshold Value: {errors.threshold_value && <span className="error">*</span>}
                  </p>
                  <input type="number" {...register("threshold_value", { required: true })} 
                  className={errors.threshold_value ? "input-error" : ""}/>
                </label>
              </div>
            
              <div className="detail-row">
                
                <label>
                  <p>
                   Purchased Date: {errors.lots?.[0]?.purchased_date && <span className="error">*</span>}
                  </p>
                  <input
                    type="date"
                    {...register("lots.0.purchased_date", { required: true })}
                    className={errors.lots?.[0]?.purchased_date ? "input-error" : ""}
                  />
                </label>


                <label>
                  Expired Date:
                  <input type="date" {...register("lots.0.expired_date")} />
                </label>
              </div>
          
            <label>
              Barcode:
              <input {...register("barcode")} value={barcodeData} readOnly />
            </label>
            <div className="barcode-buttons">
              <button type="button" onClick={() => setShowScanner(true)}>Add Barcode</button>
              <button type="button">Generate Barcode</button>
            </div>
            {showScanner && (
              <BarcodeScannerComponent width={300} height={100} onUpdate={handleScan} />
            )}
            </div>

            {/* Attributes */}
            <div className="attributes-section">
              <label>
                <p>
                  Specifications: {(errors.attributes?.[0]?.name || errors.attributes?.[0]?.value) && (
                    <span className="error">*</span>
                  )}
                </p>
              </label>

              {attributes.map((attr, index) => (
                <div key={attr.id} className="attribute-row">
                  <input
                    type="text"
                    {...register(`attributes.${index}.name`, {
                      required: index === 0 ? "Name is required" : false, // only first required
                    })}
                    placeholder="Name"
                    onBlur={addAttributeField}
                    className={errors.attributes?.[index]?.name ? "input-error" : ""}
                  />
                  <input
                    type="text"
                    {...register(`attributes.${index}.value`, {
                      required: index === 0 ? "Value is required" : false, // only first required
                    })}
                    placeholder="Value"
                    onBlur={addAttributeField}
                    className={errors.attributes?.[index]?.value ? "input-error" : ""}
                  />

                  {attributes.length > 1 && (
                    <button type="button" onClick={() => removeAttribute(index)}>
                      <Minus />
                    </button>
                  )}
                </div>
              ))}
            </div>


            {/* Lots */}
           <div className="price">
              <div className="lots-section">
                {/* Wholesale Prices */}
                <div className="prices">
                  <div>
                    <label>
                      <p>Wholesale Purchase Price: {errors.lots?.[0]?.wholesale_purchase_price && <span className="error">*</span>}</p>
                      <input
                        type="number"
                        step="0.01"
                        {...register("lots.0.wholesale_purchase_price", { required: true })}
                        onBlur={(e) => handlePriceBlur("lots.0.wholesale_purchase_price", e.target.value)}
                        className={errors.lots?.[0]?.wholesale_purchase_price ? "input-error" : ""}
                      />
                    </label>

                    <label>
                    <p> Wholesale Selling Price: {errors.lots?.[0]?.wholesale_selling_price && <span className="error">*</span>}</p>
                      <input
                        type="number"
                        step="0.01"
                        {...register("lots.0.wholesale_selling_price", { required: true } )}
                        onBlur={(e) => handlePriceBlur("lots.0.wholesale_selling_price", e.target.value)}
                        className={errors.lots?.[0]?.wholesale_selling_price ? "input-error" : ""}
                      />
                    </label>
                  </div>

                  {/* GST checkboxes */}
                  <div className="gst">
                    <span>
                      <label>
                        GST Included <input
                          type="checkbox"
                          checked={wholesaleGstIncluded}
                          onChange={() => {
                            setWholesaleGstIncluded((prev) => !prev);
                            setWholesaleGstExcluded(false);
                          }}/>
                      </label>

                      <label>
                        GST Excluded <input
                          type="checkbox"
                          checked={wholesaleGstExcluded}
                          onChange={() => {
                            setWholesaleGstExcluded((prev) => !prev);
                            setWholesaleGstIncluded(false);
                          }}
                        />
                      </label>
                    </span>
                    <p>Wholesale GST: {wholesaleGST ? wholesaleGST.toFixed(2) : "-"}</p>

                  </div>

                  <div>
                    <label>
                      <p>Wholesale Quantity: {errors.lots?.[0]?.wholesale_quantity && <span className="error">*</span>}</p>
                      <input
                        type="number"
                        step="0.01"
                        {...register("lots.0.wholesale_quantity", { required: true })}
                        onBlur={(e) => handlePriceBlur("lots.0.wholesale_quantity", e.target.value)}
                        className={errors.lots?.[0]?.wholesale_quantity ? "input-error" : ""}
                      />
                    </label>
                    
                  </div>

                </div>
                  {/* Retail Prices */}
                <div className="prices">
                  <div>
                    <label>
                      <p>
                      Retail Purchase Price: {errors.lots?.[0]?.retail_purchase_price && <span className="error">*</span>}
                      </p>
                      <input
                        type="number"
                        step="0.01"
                        {...register("lots.0.retail_purchase_price", { required: true })}
                        onBlur={(e) => handlePriceBlur("lots.0.retail_purchase_price", e.target.value)}
                        className={errors.lots?.[0]?.retail_purchase_price ? "input-error" : ""}
                      />
                    </label>

                    <label>
                      <p>Retail Selling Price: {errors.lots?.[0]?.retail_selling_price && <span className="error">*</span>}</p>
                      <input
                        type="number"
                        step="0.01"
                        {...register("lots.0.retail_selling_price", { required: true })}
                        onBlur={(e) => handlePriceBlur("lots.0.retail_selling_price", e.target.value)}
                        className={errors.lots?.[0]?.retail_selling_price ? "input-error" : ""}
                      />
                    </label>
                  </div>

                    {/* GST checkboxes */}
                  <div className="gst">
                    <span>
                      <label>
                        GST Included  <input
                          type="checkbox"
                          checked={retailGstIncluded}
                          onChange={() => {
                            setRetailGstIncluded((prev) => !prev);
                            setRetailGstExcluded(false);
                          }}
                        />
                      </label>

                      <label>
                        GST Excluded <input
                          type="checkbox"
                          checked={retailGstExcluded}
                          onChange={() => {
                            setRetailGstExcluded((prev) => !prev);
                            setRetailGstIncluded(false);
                          }}
                        />
                      </label>
                    </span>

                    <p>Retail GST: {retailGST ? retailGST.toFixed(2) : "-"}</p>
                  </div>
                </div>
              </div>
              <div className="form-buttons">
                <button type="submit">Save</button>
              </div>
           </div>
           
        </form>
       
      </div>
    </div>
  );
}
