import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import "./productModal.css";
import CategoryForm from "./categoryform";
import { useApi } from "../../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { X, Minus} from "lucide-react";
import CustomDropdown from "../CustomDropdown";

export default function ProductModal({ onClose, onProductAdded }) {
  const { categories, fetchCategories, addProduct } = useApi();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [barcodeData, setBarcodeData] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  // GST states simplified - will sync with form values below
  const [wholesaleGstIncluded, setWholesaleGstIncluded] = useState(false);
  const [wholesaleGstExcluded, setWholesaleGstExcluded] = useState(false);
  const [retailGstIncluded, setRetailGstIncluded] = useState(false);
  const [retailGstExcluded, setRetailGstExcluded] = useState(false);
  const [showVariantList, setShowVariantList] = useState(false);

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
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_name: "",
      category: "",
      unit: "",
      threshold_value: "",
      currency: "LRD",
      attributes: [{ name: "", value: "" }],
      lots: [
        {
          quantity: "",
          wholesale_quantity: "",
          expired_date: "",
          purchase_price: "",
          wholesale_selling_price: "",
          retail_selling_price: "",
          barcode: "",
        },
      ],
    },
  });
  const preventInvalidNumberInput = (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
};

useEffect(() => {
  register("category", { required: true });
}, [register]);

  // Manage dynamic attributes fields
  const { fields: attributes, append: appendAttribute, remove: removeAttribute,  replace: replaceAttributes, } = useFieldArray({
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


  const [variants, setVariants] = useState([]);
  const [showPrices, setShowPrices] = useState(true); 
  const [showAttributes, setShowAttributes] = useState(false); 
const handleKeyDown = (e) => {
  const allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
  if (!allowed.includes(e.key) && e.key.length === 1) {
    e.preventDefault();
  }
};
const handleAddVariant = useCallback(() => {
  
  const attrs = getValues("attributes") || [];
  const filledAttrs = attrs.filter(
    (a) => a?.name?.toString().trim() && a?.value?.toString().trim()
  );

  if (filledAttrs.length === 0) {
    // If no attributes exist, just show the attribute inputs
    setShowAttributes(true);

     if (attributes.length === 0) {
      appendAttribute({ name: "", value: "" });
    }
    return;
  }

  // If attributes exist, save as a variant
  const lot = (getValues("lots") || [])[0] || {};

  let prices;
  if (!showPrices && variants.length > 0) {
    // Copy prices from last variant
    prices = variants[variants.length - 1].prices;
  } else {
    prices = {
      purchase_price: lot.purchase_price ?? "",
      wholesale_selling_price: lot.wholesale_selling_price ?? "",
      wholesale_quantity: lot.wholesale_quantity ?? "",
      retail_selling_price: lot.retail_selling_price ?? "",
    };
  }

  const variant = {
    attributes: filledAttrs.map((a) => ({
      name: a.name.trim(),
      value: a.value.trim(),
    })),
    quantity: lot.quantity ?? "",
    prices,
    createdAt: new Date().toISOString(),
  };

  setVariants((prev) => [...prev, variant]);

  // Reset attribute fields for next input
  replaceAttributes([{ name: "", value: "" }]);
  setShowPrices(false); // optionally hide prices
  setShowAttributes(true);
}, [getValues, replaceAttributes, setShowPrices, variants]);

  const handleRemoveVariant = (index) => {
    setVariants((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (updated.length === 0) {
        // Reset back to initial state
        reset({
          attributes: [{ name: "", value: "" }],
          lots: [
            {
              purchase_price: "",
              quantity: "",
              wholesale_selling_price: "",
              wholesale_quantity: "",
              retail_selling_price: "",
            },
          ],
        });
        setShowPrices(true);
        setShowAttributes(false);
      }

      return updated;
    });
  };

useEffect(() => {
  const subscription = watch((value, { name }) => {
    const attributes = value.attributes || [];

    const lastAttr = attributes[attributes.length - 1];

    const isLastFilled =
      lastAttr?.name?.trim() &&
      lastAttr?.value?.trim() &&
      attributes.length < 5;

    if (isLastFilled) {
      // Delay slightly to let form state update before appending
      setTimeout(() => {
        appendAttribute({ name: "", value: "" });
      }, 0);
    }
  });

  return () => subscription.unsubscribe();
}, [watch, appendAttribute]);

useEffect(() => {
  if (attributes.length === 0) {
    setShowAttributes(false);
  }
}, [attributes.length]);

const onSubmit = useCallback(
  async (formValues) => {
    try {
      const lot = formValues.lots?.[0] || {};
      const filledAttributes = (formValues.attributes || []).filter(
        (a) => a.name?.trim() && a.value?.trim()
      );

      const hasUncommittedData = filledAttributes.length > 0 || lot.quantity;

      const lastCommitted = variants.length > 0 ? variants[variants.length - 1] : null;

      const finalVariants = [...variants.map((variant) => ({
        attributes: variant.attributes || [],
        lots: [
          {
            quantity: parseFloat(variant.quantity),
            purchase_price: parseFloat(variant.prices.purchase_price),
            retail_selling_price: parseFloat(variant.prices.retail_selling_price),
            wholesale_selling_price: parseFloat(variant.prices.wholesale_selling_price),
            wholesale_quantity: parseFloat(variant.prices.wholesale_quantity),
            expired_date: formValues.lots?.[0]?.expired_date || null,
            barcode: formValues.barcode || "",
          },
        ],
      }))];

      // ✅ Only add uncommitted variant if:
      // 1. There are no committed variants (always include)
      // 2. Or there are attributes filled (i.e. not empty variation)
      const shouldIncludeUncommitted =
        variants.length === 0 || filledAttributes.length > 0;

      if (hasUncommittedData && shouldIncludeUncommitted) {
        // Use form prices or fallback to last committed
        const useFallback = (val, fallback) =>
          val !== undefined && val !== "" ? parseFloat(val) : fallback;

        const uncommittedVariant = {
          attributes: filledAttributes,
          lots: [
            {
              quantity: parseFloat(lot.quantity),
              purchase_price: useFallback(
                lot.purchase_price,
                lastCommitted?.prices?.purchase_price ?? 0
              ),
              retail_selling_price: useFallback(
                lot.retail_selling_price,
                lastCommitted?.prices?.retail_selling_price ?? 0
              ),
              wholesale_selling_price: useFallback(
                lot.wholesale_selling_price,
                lastCommitted?.prices?.wholesale_selling_price ?? 0
              ),
              wholesale_quantity: useFallback(
                lot.wholesale_quantity,
                lastCommitted?.prices?.wholesale_quantity ?? 0
              ),
              expired_date: lot.expired_date || null,
              barcode: formValues.barcode || "",
            },
          ],
        };

        finalVariants.push(uncommittedVariant);
      }

      // Final payload
      const payload = {
        product_name: formValues.product_name,
        category: formValues.category,
        unit: formValues.unit,
        threshold_value: parseFloat(formValues.threshold_value),
        currency: formValues.currency || "LRD",
        variants: finalVariants,
      };

      console.log("Submitting payload:", payload);

      const newProduct = await addProduct(payload);

      if (newProduct && onProductAdded) {
        onProductAdded(newProduct);
      }

      reset();
      setVariants([]);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  },
  [addProduct, onProductAdded, variants, reset]
);

  return (
    <div className="modal-overlay" >
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="frm-header">
          <h2 className="frm_title">Add New Product</h2>
          <X  size={18} onClick={onClose} className="close_frm" />
        </div>

        {isCategoryModalOpen && <CategoryForm closeModal={() => setIsCategoryModalOpen(false)} />}

        <form className="product_form" onSubmit={handleSubmit(onSubmit)}>
          
            <div className="detail-section">
            {/* Product Info */}
            <label>
              <p>Product Name:</p>
              <input type="text" {...register("product_name", { required: true })} 
                 className={errors.product_name ? "input-error" : ""}
                 onKeyDown={handleKeyDown}
              />
               
            </label>

             <div className="detail-row">
               <label>
                <CustomDropdown
      label="Category"
      options={categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }))}
      value={watch("category")}
      onChange={(val) => setValue("category", val)}
      placeholder="Select Category"
      error={errors.category}
    />
                
              </label>

              <button className="open-modal-btn" onClick={() => setIsCategoryModalOpen(true)}>
              Create Category
            </button>
             </div>

              <div className="detail-row">
               
              <label>
                <CustomDropdown
    label="Unit"
    options={unitOptions.map((u) => ({ value: u, label: u }))}
    value={watch("unit")}
    onChange={(val) => setValue("unit", val)}
    placeholder="Select Unit"
  />
              </label>
    <label>
                Currency:
                <select {...register("currency", { required: true })}  className={errors.currency ? "input-error" : ""}>
                  <option value="USD">USD</option>
                  <option value="LRD">LRD</option>
                </select>
              </label>

               

              </div>
            
              <div className="detail-row">
                <label>
                  Expired Date:
                  <input type="date" {...register("lots.0.expired_date", {
                    validate: (value) => {
                      if (!value) return true; // allow empty if not required
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // ignore time part
                      return selectedDate >= today || "Expired date cannot be in the past";},
})} />
                </label>
              
           <label>
                  <p>
                    Threshold Value:
                  </p>
                  <input type="number" {...register("threshold_value", { required: true })} 
                    className={errors.threshold_value ? "input-error" : ""}
                    onKeyDown={preventInvalidNumberInput}/>
                  
                </label>

              </div>
              <div>
                {errors.lots?.[0]?.expired_date && (
  <p className="error-msg">{errors.lots[0].expired_date.message}</p>
)}
              <div className="detail-row gst">
                <label>
                  GST Included <input
                    type="checkbox"
                    checked={wholesaleGstIncluded}
                    onChange={() => {
                      setWholesaleGstIncluded((prev) => !prev);
                      setWholesaleGstExcluded(false);
                    }}/>
                </label>
              </div>
          
              </div>
          
           
            {showScanner && (
              <BarcodeScannerComponent width={300} height={100} onUpdate={handleScan} />
            )}
            </div>

            {/* Attributes */}
            <div className="attributes-section">
      {showAttributes && attributes.length > 0 &&  (
        <div className="attributes-section">
          <label>Variations</label>
          {attributes.map((attr, index) => (
            <div key={attr.id} className="attribute-row">
              <input
                type="text"
                {...register(`attributes.${index}.name`)}
                placeholder="Name"
              />
              <input
                type="text"
                {...register(`attributes.${index}.value`)}
                placeholder="Value"
              />
              
                  <Minus onClick={() => removeAttribute(index)} className="attr-btn" />
                
              
            </div>
          ))}
      
        </div>
      )}
      <div className="detail-row">
        
        <label></label><label></label><label></label><label></label>
       </div>
   
        <div className="prices">
          <div className="detail-row">
              <label>
                <p>
                  Quantity:{" "}
                </p>
                <input
                  type="number"
                  step="0.01"
                  {...register("lots.0.quantity", { required: true })}
                  className={errors.lots?.[0]?.quantity ? "input-error" : ""}
                  onKeyDown={preventInvalidNumberInput}
                />
              </label>
{showAttributes && !showPrices && (
          <div className="barcode-buttons">
            <button type="button" onClick={() => setShowPrices(true)}>
            Add New Prices
          </button>
          </div>
        )}
{showPrices && (  

            <label>
              <p>
                Purchase Price:{" "}
              </p>
              <input
                type="number"
                step="0.01"
                {...register("lots.0.purchase_price", { required: true })}
                className={
                  errors.lots?.[0]?.purchase_price ? "input-error" : ""
                }
                onKeyDown={preventInvalidNumberInput}
              />
            </label>
              )}  
          </div>
{showPrices && (
    <>
          <div className="detail-row">
            <label>
              <p>
                Wholesale Selling Price:{" "}
              </p>
              <input
                type="number"
                step="0.01"
                {...register("lots.0.wholesale_selling_price", {
                  required: true,
                })}
                className={
                  errors.lots?.[0]?.wholesale_selling_price ? "input-error" : ""
                }
                onKeyDown={preventInvalidNumberInput}
              />
            </label>
            <label>
              <p>
                Wholesale Quantity:{" "}
              </p>
              <input
                type="number"
                step="0.01"
                {...register("lots.0.wholesale_quantity", { required: true })}
                className={
                  errors.lots?.[0]?.wholesale_quantity ? "input-error" : ""
                }
                onKeyDown={preventInvalidNumberInput}
              />
            </label>
          </div>

          <div className="detail-row">
            <label>
              <p>
                Retail Selling Price:{" "}
              </p>
              <input
                type="number"
                step="0.01"
                {...register("lots.0.retail_selling_price", { required: true })}
                className={
                  errors.lots?.[0]?.retail_selling_price ? "input-error" : ""
                }
                onKeyDown={preventInvalidNumberInput}
              />
            </label>
          </div>
        </>
  )}
        </div>
      
  
       <label>
              Barcode:
              <input {...register("barcode")} value={barcodeData} readOnly />
            </label>
      {/* Buttons */}
       <div className="barcode-buttons">
              <button type="button" onClick={() => setShowScanner(true)}>Add Barcode</button>
              {/* <button type="button">Generate Barcode</button> */}
              <label>
                <input
                  type="checkbox"
                  // checked={generateBarcode} 
                  onChange={(e) => setGenerateBarcode(e.target.checked)}
                />
                Generate Barcode
              </label>
               <button type="button" onClick={handleAddVariant}>Add Variation</button>
            </div> 
            </div>


            {/* Lots */}
           <div className="price">
            {showVariantList && (
              <div className="lots-section">
                      {variants.length > 0 && (
              <div className="variants-list">
                <label>Added Variants</label>
                {variants.map((variant, idx) => (
                  <div key={idx} className="variant-item">
                    <div className="list-header">
                        <X size={16}  onClick={() => handleRemoveVariant(idx)} className="list-btn" />
                    </div>
                    <span>
                      <div className="variant-attr">
                      {variant.attributes.length > 0 ? (
                        variant.attributes.map((a, i) => (
                            <label key={i}>
                            {a.name}: {a.value}
                          </label>
                        ))
                      ) : (
                        <em>No attributes</em>
                      )}
                      </div>
                    
                     <div className="variant-p">
                        <label>
                          <p>Purchase Price</p>
                          <span>{variant.prices.purchase_price}</span>
                        </label>
                       
                        <label>
                          <p>Quantity</p>
                          <span>{variant.quantity}</span>
                        </label>
                     </div>

                      <div className="variant-p">
                        
                        <label>
                          <p>Wholesale Quantity</p>
                          <span>{variant.prices.wholesale_quantity}</span>
                        </label>

                       <label>
                          <p>Wholesale Price</p>
                          <span>{variant.prices.wholesale_selling_price}</span>
                        </label>
                      </div>

                      <div className="variant-p">
                        <label>
                          <p>Retail Price</p>
                          <span>{variant.prices.retail_selling_price}</span>
                        </label>
                         <label>
                          <p>Barcode </p>
                          <span>{variant.prices.wholesale_selling_price}</span>
                        </label>
                         
                      </div>
                      </span>
                  </div>
                ))}
              </div>
            )}
              </div>
            )}
              <div className="form-buttons">
                <button type="submit">Save</button>
                {variants.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowVariantList(prev => !prev)}
                  className="variant-toggle-btn"
                >
                  {showVariantList ? "Hide Variants" : `Show Variants (${variants.length})`}
                </button>
)}

              </div>
           </div>
           
        </form>
       
      </div>
    </div>
  );
}


