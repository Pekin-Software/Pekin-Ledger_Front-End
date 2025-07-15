import React, { useState, useEffect, useRef } from "react";
import { Package } from "lucide-react";
import ProductModal from "../productModal";
import ProductDetail from "../ProductDetails/productDetails";
import { Filter,AlertCircle } from "lucide-react";

function ProductCard({ product, onProductClick }) {
  return (
    <div className="product-card" onClick={() => onProductClick(product)}>
      <div className="product-image-container">
        <span
          className={`availability ${product.stock_status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
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

// export default function ProductSection({ products, productsLoading, productsError }) {
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [showFilter, setShowFilter] = useState(false);
//     const filterRef = useRef(null);

//     const handleProductClick = (product) => {
//         setSelectedProduct(product);
//     };  

//     const handleFilterClick = (option) => {
//       setShowFilter(false);  
//     };
      
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (filterRef.current && !filterRef.current.contains(event.target)) {
//             setShowFilter(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         < >
//             <section className="products">
//                 <div className="products-header">
//                 <h2>Products</h2>
//                 <div className="actions">
//                 <button className="add-product" onClick={() => setShowModal(true)}>Add Product</button>

//                 <div className="filter-container" ref={filterRef}>
//                         <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
//                         <span className="filter-icon"><Filter size={16} /></span>
//                         <span className="filter-text">Filter</span>
//                         </button>
//                         {showFilter && (
//                         <ul className="filter-options">
//                             <li onClick={() => handleFilterClick("In-Stock")}>In-Stock</li>
//                             <li onClick={() => handleFilterClick("Out-of-Stock")}>Out-of-Stock</li>
//                             <li onClick={() => handleFilterClick("Low Stock")}>Low Stock</li>
//                             <li onClick={() => handleFilterClick("Prices: Low to High")}>Prices: Low to High</li>
//                             <li onClick={() => handleFilterClick("Prices: High to Low")}>Prices: High to Low</li>
//                             <li onClick={() => handleFilterClick("Expiring Date")}>Expiring Date</li>
//                         </ul>
//                         )}
//                 </div>

//                 <button className="download">Download All</button>
//                 </div>
//             </div>
        
//         {productsLoading ? (
//         <div className="product-grid-scrollable">
//           {Array.from({ length: 28 }).map((_, idx) => (
//             <ProductCardSkeleton key={idx} />
//           ))}
//         </div>
//       ) : productsError ? (
//         <div className="error">
//           <AlertCircle size={48} className="error-icon" />
//           <p>Error: {productsError}</p>
//         </div>
//       ) : selectedProduct ? (
//         <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
//       ) : (
//         <div className="product-grid-scrollable">
//           <div className="product-grid">
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <ProductCard
//                   key={product.id}
//                   product={product}
//                   onProductClick={handleProductClick}
//                 />
//               ))
//             ) : (
//               <p className="empty-message">No products available.</p>
//             )}
//           </div>
//         </div>
//       )}
//         </section>

//           {showModal && (
//           <ProductModal 
//             onClose={() => setShowModal(false)} 
//             onProductAdded={(newProduct) => {
//               setSelectedProduct(newProduct); // 👈 open product details view
//               setShowModal(false); // 👈 close modal
//             }} 
//           />
//         )}
//         </>
//     );
// }

export default function ProductSection({
  products,
  productsLoading,
  productsError,
  context = "inventory", // default context
  onAddProductFromModal, // only used in "store-modal" context
  onOpenFullScreenModal, // only used in "store-detail" context
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleFilterClick = (option) => {
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
      onOpenFullScreenModal?.(); // callback to open full-screen modal
    } else if (context === "store-modal") {
      onAddProductFromModal?.(); // handle product submission
    }
  };

  return (
    <>
      <section className="products">
        <div className="products-header">
          <h2>Products</h2>
          <div className="actions">
            <button className="add-product" onClick={handleAddProductClick}>
              Add Product
            </button>

         
              <div className="filter-container" ref={filterRef}>
                <button
                  className="filter-button"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <span className="filter-icon">
                    <Filter size={16} />
                  </span>
                  <span className="filter-text">Filter</span>
                </button>
                {showFilter && (
                  <ul className="filter-options">
                    <li onClick={() => handleFilterClick("In-Stock")}>
                      In-Stock
                    </li>
                    <li onClick={() => handleFilterClick("Out-of-Stock")}>
                      Out-of-Stock
                    </li>
                    <li onClick={() => handleFilterClick("Low Stock")}>
                      Low Stock
                    </li>
                    <li onClick={() => handleFilterClick("Prices: Low to High")}>
                      Prices: Low to High
                    </li>
                    <li onClick={() => handleFilterClick("Prices: High to Low")}>
                      Prices: High to Low
                    </li>
                    <li onClick={() => handleFilterClick("Expiring Date")}>
                      Expiring Date
                    </li>
                  </ul>
                )}
              </div>
            

            {/* Download button hidden in modal context */}
            {context !== "store-modal" && (
              <button className="download">Download All</button>
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
            <div className="product-grid">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))
              ) : (
                <p className="empty-message">No products available.</p>
              )}
            </div>
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
    </>
  );
}
