// import React from "react";
// import { X } from "lucide-react";
// import ProductSection from "../../../Inventory/ProductDetails/products";
// import "./unassignedProduct.css";


// export default function UnassignedProduct({ onClose, onSubmit }) {
//       // mock products for design
//   const productsLoading = false;
//   const productsError = null;
//   const products = [];
//   const fetchProducts = () => {};
//   const mockProducts = [
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//      id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 3,
//       product_name: "Pain Reliever",
//       image: "",
//       stock_status: "Expired",
//       quantity: 0,
//       price: 7.75,
//     },
//     {
//       id: 4,
//       product_name: "Cough Syrup",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 30,
//       price: 15.25,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//       {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//      id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 3,
//       product_name: "Pain Reliever",
//       image: "",
//       stock_status: "Expired",
//       quantity: 0,
//       price: 7.75,
//     },
//     {
//       id: 4,
//       product_name: "Cough Syrup",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 30,
//       price: 15.25,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//       {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//      id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 3,
//       product_name: "Pain Reliever",
//       image: "",
//       stock_status: "Expired",
//       quantity: 0,
//       price: 7.75,
//     },
//     {
//       id: 4,
//       product_name: "Cough Syrup",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 30,
//       price: 15.25,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//       {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//      id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 3,
//       product_name: "Pain Reliever",
//       image: "",
//       stock_status: "Expired",
//       quantity: 0,
//       price: 7.75,
//     },
//     {
//       id: 4,
//       product_name: "Cough Syrup",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 30,
//       price: 15.25,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//       {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//      id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 3,
//       product_name: "Pain Reliever",
//       image: "",
//       stock_status: "Expired",
//       quantity: 0,
//       price: 7.75,
//     },
//     {
//       id: 4,
//       product_name: "Cough Syrup",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 30,
//       price: 15.25,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//       {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//      id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 3,
//       product_name: "Pain Reliever",
//       image: "",
//       stock_status: "Expired",
//       quantity: 0,
//       price: 7.75,
//     },
//     {
//       id: 4,
//       product_name: "Cough Syrup",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 30,
//       price: 15.25,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//     {
//       id: 1,
//       product_name: "Vitamin C Tablets",
//       image: "",
//       stock_status: "In Stock",
//       quantity: 120,
//       price: 9.99,
//     },
//   ];
//   const displayProducts = products && products.length > 0 ? products : mockProducts;

//     return (
//     <div className="unassigned-product-modal-overlay">
//       <div className="unassigned-product-modal">
//         <div className="modal-header">
//           <button className="exit" onClick={onClose}>
//             <X size={18} className="exit-icon"/>
//           </button>
//         </div>

//         <div className="modal-body">
//           <ProductSection
//             context="unassigned"
//             products={displayProducts}
//             onAddProductFromModal={onSubmit}

//           />
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect } from "react";
import { X } from "lucide-react";
// import ProductSection from "../../../Inventory/ProductDetails/products";
import "./unassignedProduct.css";
import { useInventory } from "../../../../contexts/InventoryContext";

export default function UnassignedProduct({ onClose, onSubmit, storeId}) {
  const {
    fetchProducts,
    unassignedProducts,
    productsLoading,
    productsError,
  } = useInventory();

  useEffect(() => {
    if (storeId) {
      fetchProducts({ excludeStoreId: storeId, type: "unassigned" });
    }
  }, [storeId]);

    return (
    <div className="unassigned-product-modal-overlay">
      <div className="unassigned-product-modal">
        <div className="modal-header">
          <button className="exit" onClick={onClose}>
            <X size={18} className="exit-icon"/>
          </button>
        </div>

        <div className="modal-body">
          {/* <ProductSection
            products={unassignedProducts}
            productsLoading={productsLoading}
            productsError={productsError}
            context="unassigned"
            storeId={storeId}
            onAddProductFromModal={onSubmit}
            onClose={onClose} 
          /> */}
        </div>
      </div>
    </div>
  );
}
