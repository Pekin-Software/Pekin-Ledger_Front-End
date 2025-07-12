import { useState, useRef, useEffect } from "react";
import "./inventoryDashboard.css";
import { Filter } from "lucide-react";
import ProductModal from "./productModal";
import ProductDetail from "./ProductDetails/productDetails";
import { useApi } from "../../ApiContext.jsx";
import { Package, AlertCircle } from "lucide-react";



function Card({ title, value, detail, color }) {
    return (
      <div className="inventory-card">
        <h3 style={{ color }}>{title}</h3>
        <p className="value">{value}</p>
        <p className="detail">{detail}</p>
      </div>
    );
  }

function ProductCard({ product, onProductClick }) {
  return (
    <div className="product-card" onClick={() => onProductClick(product)}>
      <div className="product-image-container">
        <span className={`availability ${product.stock_status.toLowerCase().replace(/\s+/g, "-")}`}>
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
      <div className="right-detail" >
        <h3>{product.product_name}</h3>
        <p>Quantity: {product.quantity}</p>
        <p>${product.price}</p>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton skeleton">
      <div className="skeleton-image-container">
         <span className="skeleton-availability">
        </span>
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


export default function InventoryDashboard() {
  const { fetchProducts, products, productsLoading, productsError } = useApi();
  const { fetchOverview, overview, overviewLoading, overviewError } = useApi();
  // Fallback test products for design/development

  // Simulated loading and error state (since we're not using real API)
  // const productsLoading = false;
  // const productsError = null;
  // const products = [];
  // const fetchProducts = () => {};

  // const mockProducts = [
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //    id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  // ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOverview();
  }, []);

 
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const filterRef = useRef(null);

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

  const handleFilterClick = (option) => {
      setShowFilter(false);  
  };

   // Handle when a product card is clicked
  const handleProductClick = (product) => {
    setSelectedProduct(product); // Set the selected product
  };
  // const displayProducts = products && products.length > 0 ? products : mockProducts;

  return (
    <div className="inventory-container">
      {/* <section className="overview">
        <h2>Inventory Overview</h2>
        <div className="card-container">
          <Card title="Total Products" value={overview.total_products} detail="All stocked items" color="blue" />
          <Card title="Categories" value={overview.total_categories} detail="Product Group" color="red" />
          <Card title="Top Selling" value={500} detail="Highest sales volume" color="blue" />
          <Card title="In Stock" value={5} detail="Reorder soon" color="green" />
          <Card title="Out of Stock" value={5} detail="Reorder soon" color="orange" />
          <Card title="Low Stock" value={20} detail="Needs restocking" color="red" />
          <Card title="Expiring Soon" value={15} detail="Check expiry dates" color="purple" />
          <Card title="Total Value" value={150000} detail="Inventory worth" color="green" />
        </div>
      </section> */}
      <section className="overview">
  <h2>Inventory Overview</h2>

  {overviewLoading ? (
    <p>Loading overview...</p>
  ) : overviewError ? (
    <p className="text-red-600">Error: {overviewError}</p>
  ) : overview ? (
    <div className="card-container">
      <Card title="Total Products" value={overview.total_products} detail="All stocked items" color="blue" />
      <Card title="Categories" value={overview.total_categories} detail="Product Group" color="red" />
      <Card title="Top Selling" value={overview.top_selling || 0} detail="Highest sales volume" color="blue" />
      <Card title="In Stock" value={overview.in_stock || 0} detail="Currently available" color="green" />
      <Card title="Out of Stock" value={overview.out_of_stock || 0} detail="Reorder soon" color="orange" />
      <Card title="Low Stock" value={overview.low_stock || 0} detail="Needs restocking" color="red" />
      <Card title="Expiring Soon" value={overview.expiring_soon || 0} detail="Check expiry dates" color="purple" />
      <Card title="Total Value" value={overview.total_value || 0} detail="Inventory worth" color="green" />
    </div>
  ) : (
    <p>No overview data available.</p>
  )}
</section>


      <section className="products">
        <div className="products-header">
          <h2>Products</h2>
          <div className="actions">
            <button className="add-product" onClick={() => setShowModal(true)}>Add Product</button>

            <div className="filter-container" ref={filterRef}>
                    <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
                      <span className="filter-icon"><Filter size={16} /></span>
                      <span className="filter-text">Filter</span>
                    </button>
                    {showFilter && (
                      <ul className="filter-options">
                        <li onClick={() => handleFilterClick("In-Stock")}>In-Stock</li>
                        <li onClick={() => handleFilterClick("Out-of-Stock")}>Out-of-Stock</li>
                        <li onClick={() => handleFilterClick("Low Stock")}>Low Stock</li>
                        <li onClick={() => handleFilterClick("Prices: Low to High")}>Prices: Low to High</li>
                        <li onClick={() => handleFilterClick("Prices: High to Low")}>Prices: High to Low</li>
                        <li onClick={() => handleFilterClick("Expiring Date")}>Expiring Date</li>
                      </ul>
                    )}
            </div>

            <button className="download">Download All</button>
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
          )
           : productsError ? (
              <div className="error">
                  <AlertCircle size={48} className="error-icon" />
                  <p>Error: {productsError}</p>
              </div>
            
          ) 
          : selectedProduct ? (
            <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          ) : (
            <div className="product-grid-scrollable">
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                ))}

                {/* {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                ))} */}
              </div>
            </div>
          )

          } 

        
      </section>

         {/* Show ProductModal when modal is open */}
        {showModal && (
          <ProductModal 
            onClose={() => setShowModal(false)} 
            onProductAdded={(newProduct) => {
              setSelectedProduct(newProduct); // 👈 open product details view
              setShowModal(false); // 👈 close modal
            }} 
          />
        )}

      </div>

    );
}
  