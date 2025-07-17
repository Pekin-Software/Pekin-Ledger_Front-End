import React, { useState, useEffect, useRef } from "react";
import ProductModal from "../productModal";
import ProductDetail from "../ProductDetails/productDetails";
import { Filter,AlertCircle, Package} from "lucide-react";
import SubmissionModal from "./submissionModal";
import { useInventory } from "../../../contexts/InventoryContext";

function ProductCard({ product, onProductClick, context, quantity, onQuantityChange }) {
  const increase = () => onQuantityChange(quantity + 1);

  const decrease = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      onQuantityChange(Math.max(0, val)); 
    }
  };

  return (
    <div
      className={`product-card ${context === "unassigned" ? "context-unassigned" : ""}`}
      onClick={() => onProductClick(product)}
    >
      <div className="card-top">
        <div className="product-image-container">
          <span
            className={`availability ${product.stock_status.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {product.stock_status}
          </span>
          {product.image ? (
            <img
              src={product.image}
              alt={product.product_name}
              className="product-image"
            />
          ) : (
            <Package size={48} className="fallback-icon" />
          )}
        </div>
        <div className="right-detail">
          <h3>{product.product_name}</h3>
          <p>Quantity: {product.quantity}</p>
          <p>${product.price}</p>
        </div>
      </div>

      {context === "unassigned" && (
        <div className="qty" onClick={(e) => e.stopPropagation()}>
          <label htmlFor="quantity">Disburse</label>

          {/* ✅ Correctly allows reducing to 0 */}
          <button type="button" onClick={decrease} disabled={quantity === 0}>
            –
          </button>

          <input
            type="number"
            min={0}
            value={quantity}
            onChange={handleInputChange}
          />

          <button type="button" onClick={increase}>
            +
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton skeleton">
      <div className="skeleton-image-container">
        <span className="skeleton-availability"></span>
        <Package size={48} className="skeleton-icon" />
      </div>
      <div className="skeleton-right-detail">
        <h3></h3>
        <p></p>
        <p></p>
      </div>
    </div>
  );
}

export default function ProductSection({
  products,
  productsLoading,
  productsError,
  context = "inventory",
  onAddProductFromModal,
  onOpenFullScreenModal,
  storeId,
}) {
  const { addInventory } = useInventory();

  const [submissionStatus, setSubmissionStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submittedCount, setSubmittedCount] = useState(0);

  const [activeFilter, setActiveFilter] = useState(null);


  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  const [quantities, setQuantities] = useState({});
  const isSendDisabled = Object.values(quantities).every(q => q === 0 || q === undefined);

  const updateQuantity = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value < 0 ? 0 : value, // enforce min 1
    }));
  };

  const handleProductClick = (product) => {
    if (context === "inventory") {
      setSelectedProduct(product);
    }
  };

  const handleFilterClick = (option) => {
    setActiveFilter(option);
    setShowFilter(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddProductClick = () => {
    if (context === "inventory") {
      setShowModal(true);
    } else if (context === "store-detail") {
      onOpenFullScreenModal?.();
    } else if (context === "store-modal") {
      onAddProductFromModal?.();
    } else if (context === "unassigned") {
      const submissionData = products
        .filter((p) => quantities[p.id] && quantities[p.id] > 0)
        .map((p) => ({
          product_id: p.id,
          lot_id: p.lot_id,
          quantity: quantities[p.id],
        }));

        if (!storeId || submissionData.length === 0) return;
        
        setSubmissionStatus("loading");

 addInventory(storeId, submissionData).then(async (res) => {
      if (res.success) {
        setSubmissionStatus("success");
        setSubmissionMessage("Inventory added successfully");
        setSubmittedCount(submissionData.length);
        setQuantities({});

        // ✅ Refresh inventory and close modal
        await refreshAll(); 
        onClose?.();

  } else {
    setSubmissionStatus("error");
    setSubmissionMessage(res.error);
  }
});

            console.log("Submitting:", submissionData);
            }
    };


  const filteredProducts = products.filter((product) => {
    if (!activeFilter) return true;

    switch (activeFilter) {
      case "In-Stock":
        return product.stock_status === "In Stock";
      case "Out-of-Stock":
        return product.stock_status === "Out of Stock";
      case "Low Stock":
        return product.stock_status === "Low Stock";
      case "Prices: Low to High":
      case "Prices: High to Low":
      case "Expiring Date":
        return true; // sorting handled separately
      default:
        return true;
    }
  });
  if (activeFilter === "Prices: Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }
  if (activeFilter === "Prices: High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <section className="products">
        <div className="products-header">
          <h2>Products</h2>
          {activeFilter && (
            <div className="active-filter-label">
              🔍 <strong>Filter:</strong> {activeFilter}
              <button className="clear-filter" onClick={() => setActiveFilter(null)}>
                ✖
              </button>
            </div>
          )}

          <div className="actions">
            <button className="add-product" 
              onClick={handleAddProductClick}
              disabled={
                (context === "unassigned" && (isSendDisabled || submissionStatus === "loading"))
              }>
              {context === "unassigned"
                ? submissionStatus === "loading"
                  ? "Sending..."
                  : "Send Product"
                : "Add Product"}
            </button>

            <div className="filter-container" ref={filterRef}>
              <button
                className="filter-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent outside click from closing
                  setShowFilter((prev) => !prev);
                }}
              >
                <span className="filter-icon">
                  <Filter size={16} />
                </span>
                <span className="filter-text">Filter</span>
              </button>
            
              {showFilter && (
                <ul className="filter-options" onClick={(e) => e.stopPropagation()}>
                  <li onClick={() => handleFilterClick("In-Stock")}>In-Stock</li>
                  <li onClick={() => handleFilterClick("Out-of-Stock")}>Out-of-Stock</li>
                  <li onClick={() => handleFilterClick("Low Stock")}>Low Stock</li>
                  <li onClick={() => handleFilterClick("Prices: Low to High")}>Prices: Low to High</li>
                  <li onClick={() => handleFilterClick("Prices: High to Low")}>Prices: High to Low</li>
                  <li onClick={() => handleFilterClick("Expiring Date")}>Expiring Date</li>
                </ul>
              )}
            </div>

            { context !== "unassigned" ? (
                <button className="download">Download All</button>
              ) : (
                <span className="download-placeholder" />
            )}    
          </div>
        </div>

        {productsLoading ? (
          <div className="product-grid-scrollable">
             <div className="product-grid-skeleton">
              {Array.from({ length: 28}).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        ) : productsError ? (
          <div className="error">
            <AlertCircle size={48} className="error-icon" />
            <p>Error: {productsError}</p>
          </div>
        ) : selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        ) : (
          <div className="product-grid-scrollable">
            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                    context={context}
                    quantity={quantities[product.id] || 0}
                    onQuantityChange={(value) => updateQuantity(product.id, value)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-message">
                <Package size={48} />
                <p>No products available.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Only show modal if in inventory context */}
      {context === "inventory" && showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onProductAdded={(newProduct) => {
            setSelectedProduct(newProduct);
            setShowModal(false);
          }}
        />
      )}

      {submissionStatus && (
        <SubmissionModal
          status={submissionStatus}
          message={submissionMessage}
          count={submittedCount}
          onClose={() => setSubmissionStatus(null)}
        />
      )}
    </>
  );
}
