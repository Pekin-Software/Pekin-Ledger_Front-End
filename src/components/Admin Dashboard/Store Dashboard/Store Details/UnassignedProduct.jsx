import { useEffect } from "react";
import { X } from "lucide-react";
import ProductSection from "../../../Inventory/ProductDetails/products";
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


  console.log("Unassigned Products", unassignedProducts)

    return (
    <div className="unassigned-product-modal-overlay">
      <div className="unassigned-product-modal">
        <div className="modal-header">
          <button className="exit" onClick={onClose}>
            <X size={18} className="exit-icon"/>
          </button>
        </div>

        <div className="modal-body">
          <ProductSection
            products={unassignedProducts}
            productsLoading={productsLoading}
            productsError={productsError}
            context="store-modal"
            onAddProductFromModal={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
