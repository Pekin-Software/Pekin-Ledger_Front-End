import { useState, useRef, useEffect } from "react";
import "./inventoryDashboard.css";
import ProductDetail from "./ProductDetails/productDetails.jsx";
import ProductCard from "../ProductCard/productCard.jsx";
import { ProductCardSkeleton } from "../ProductCard/skeletons.jsx";
import ProductModal from "./productModal.jsx";
import { useInventory } from "../../contexts/InventoryContext.jsx";
import { AlertCircle, Package, Filter } from "lucide-react";

function Card({ title, value, detail, color }) {
  return (
    <div className="inventory-card">
      <h3 style={{ color }}>{title}</h3>
      <p className="value">{value}</p>
      <p className="detail">{detail}</p>
    </div>
  );
}

export default function InventoryDashboard({
  context = "inventory",
  onAddProductFromModal,
  onOpenFullScreenModal,
  storeId,
  onClose,
  onProductClick,
}){

  const {
    fetchInventoryOverview,
    mainInventoryOverview,
    overviewLoading,
    overviewError,
    fetchProducts,
    POS_Product_data,
    productsLoading,
    productsError,
    addInventory,
  } = useInventory();

useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        .filter(p => quantities[p.id] && quantities[p.id] > 0)
        .map(p => ({ product_id: p.id, lot_id: p.lot_id, quantity: quantities[p.id] }));

      if (!storeId || submissionData.length === 0) return;

      setSubmissionStatus("loading");
      addInventory(storeId, submissionData).then(async res => {
        if (res.success) {
          setSubmissionStatus("success");
          setSubmissionMessage("Inventory added successfully");
          setSubmittedCount(submissionData.length);
          setQuantities({});
          await fetchProducts({ storeId, type: "store" });
        } else {
          setSubmissionStatus("error");
          setSubmissionMessage(res.error);
        }
      });
    }
  };

  // --- Local state ---
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submittedCount, setSubmittedCount] = useState(0);

  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [quantities, setQuantities] = useState({});
  const filterRef = useRef(null);

  // Handle submission success auto-close
  useEffect(() => {
    if (submissionStatus === "success") {
      const timer = setTimeout(() => {
        setSubmissionStatus(null);
        onClose?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus, onClose]);



  const {refreshAll, variantsLoading, variantsError} = useInventory();
  console.log(POS_Product_data)

  const isRefreshing = overviewLoading || productsLoading;

  // --- Effects ---
  useEffect(() => {
    (async () => {
      await Promise.all([fetchInventoryOverview(), fetchProducts()]);
    })();
  }, []);

  // Auto-close after successful submission
  useEffect(() => {
    if (submissionStatus === "success") {
      const timer = setTimeout(() => {
        setSubmissionStatus(null);
        onClose?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus, onClose]);

  // --- Derived values ---
  const isSendDisabled = Object.values(quantities).every(
    (q) => q === 0 || q === undefined
  );

  // Filter products
  const filteredProducts = POS_Product_data.filter((product) => {
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
        return true;
      default:
        return true;
    }
  });

  if (activeFilter === "Prices: Low to High")
    filteredProducts.sort((a, b) => a.price - b.price);
  if (activeFilter === "Prices: High to Low")
    filteredProducts.sort((a, b) => b.price - a.price);

  // --- Handlers ---
  const handleProductClick = (product) => {
    if (context === "inventory") {
       setSelectedProduct(product);
        onProductClick?.(product); 
    }
     
  };

  const handleFilterClick = (option) => {
    setActiveFilter(option);
    setShowFilter(false);
  };

  const updateQuantity = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value < 0 ? 0 : value,
    }));
  };



  // --- Render ---
  return (
    <div className="inventory-container">
      {/* Main dashboard view */}
      {!selectedProduct && (
        <>
        <section className="overview">
        <h2>Inventory Overview</h2>
          {overviewLoading ? (
            <div className="card-container" role="status" aria-busy="true">
                  <Card title="Total Products" value={<span className="skeleton-value skeleton" > 0</span>} detail="All stocked items" color="blue" />
                  <Card title="Categories" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Product Group" color="red" />
                  <Card title="Top Selling" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Highest sales volume" color="blue" />
                  <Card title="In Stock" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Currently available" color="green" />
                  <Card title="Out of Stock" value={<span className="skeleton-value skeleton" > 0</span>} detail="Reorder soon" color="orange" />
                  <Card title="Low Stock" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Needs restocking" color="red" />
                  <Card title="Expiring Soon" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Check expiry dates" color="purple" />
                  <Card title="Total Value" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Inventory worth" color="green" />
            </div>
          ) : overviewError ? (
            <div className="card-container">
                <Card title="Total Products" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="All stocked items" color="blue" />
                <Card title="Categories" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Product Group" color="red" />
                <Card title="Top Selling" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Highest sales volume" color="blue" />
                <Card title="In Stock" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Currently available" color="green" />
                <Card title="Out of Stock" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Reorder soon" color="orange" />
                <Card title="Low Stock" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Needs restocking" color="red" />
                <Card title="Expiring Soon" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Check expiry dates" color="purple" />
                <Card title="Total Value" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Inventory worth" color="green" />
            </div>
          ) : mainInventoryOverview ? (
            <div className="card-container">
                <Card title="Total Products" value={mainInventoryOverview.total_products} detail="All stocked items" color="blue" />
                <Card title="Categories" value={mainInventoryOverview.total_categories} detail="Product Group" color="red" />
                <Card title="Top Selling" value={mainInventoryOverview.top_selling || 0} detail="Highest sales volume" color="blue" />
                <Card title="In Stock" value={mainInventoryOverview.in_stock || 0} detail="Currently available" color="green" />
                <Card title="Out of Stock" value={mainInventoryOverview.out_of_stock || 0} detail="Reorder soon" color="orange" />
                <Card title="Low Stock" value={mainInventoryOverview.low_stock || 0} detail="Needs restocking" color="red" />
                <Card title="Expiring Soon" value={mainInventoryOverview.expiring_soon || 0} detail="Check expiry dates" color="purple" />
                <Card title="Total Value" value={mainInventoryOverview.total_value || 0} detail="Inventory worth" color="green" />
            </div>
          ):null}
          </section>

          {/* Products header */}
          <div className="products-header">
            <h2>Products</h2>
            {activeFilter && (
              <div className="active-filter-label">
                🔍 <strong>Filter:</strong> {activeFilter}
                <button
                  className="clear-filter"
                  onClick={() => setActiveFilter(null)}
                >
                  ✖
                </button>
              </div>
            )}

            <div className="actions">
              <button
                className="add-product"
                onClick={handleAddProductClick}
                disabled={
                  context === "unassigned" &&
                  (isSendDisabled || submissionStatus === "loading")
                }
              >
                {context === "unassigned"
                  ? submissionStatus === "loading"
                    ? "Sending..."
                    : "Send Product"
                  : "Add Product"}
              </button>

              {/* Filter dropdown */}
              <div className="filter-container" ref={filterRef}>
                <button
                  className="filter-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFilter((prev) => !prev);
                  }}
                >
                  <Filter size={16} />
                  <span className="filter-text">Filter</span>
                </button>

                {showFilter && (
                  <ul
                    className="filter-options"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      "In-Stock",
                      "Out-of-Stock",
                      "Low Stock",
                      "Prices: Low to High",
                      "Prices: High to Low",
                      "Expiring Date",
                    ].map((opt) => (
                      <li key={opt} onClick={() => handleFilterClick(opt)}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {context !== "unassigned" ? (
                <button className="download">Download All</button>
              ) : (
                <span className="download-placeholder" />
              )}
            </div>
          </div>

          {/* Products grid */}
          {productsLoading ? (
            <div className="product-grid-scrollable">
                <div className="product-grid">
                  {Array.from({ length: 32 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
                </div>
              </div>
          ) : productsError ? (
            <div className="error">
              <AlertCircle size={30} className="error-icon" />
              <p>Error: {productsError}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid-scrollable">
              <div className="product-grid">
                {filteredProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    itemName={item.product_name}
                    price={item.price}
                    imageSrc={item.image}
                    onCardClick={() => handleProductClick(item)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-message">
              <Package size={108} />
              <p>No products available.</p>
            </div>
          )}
          </>
      )}

      {/* Product detail view */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => {
            onProductClick?.(null);
            setSelectedProduct(null);}}
           
        />
      )}

      {/* Submission modal */}
      {submissionStatus && (
        <SubmissionModal
          status={submissionStatus}
          message={submissionMessage}
          count={submittedCount}
          onClose={() => setSubmissionStatus(null)}
        />
      )}

      {/* Product modal */}
      {context === "inventory" && showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onProductAdded={(newProduct) => {
            setSelectedProduct(newProduct);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}






