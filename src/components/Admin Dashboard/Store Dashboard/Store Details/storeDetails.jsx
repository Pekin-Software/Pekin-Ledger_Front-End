import React, { useState, useEffect } from "react";
import "./storeDetails.css"; 
import StoreStaff from "./StoreStaff";
import UnassignedProduct from "./UnassignedProduct";
import { useInventory } from "../../../../contexts/InventoryContext";
import { LucideArrowLeftCircle } from "lucide-react";
import Dashboard from "../../../Dash/Dashboard";
import Reports from "../../../../SalesReports/reports";
import InventoryDashboard from "../../../Inventory/inventoryDashboard";

export default function StoreDetails({ store, onClose }) {
  const { fetchInventoryOverview, mainInventoryOverview, overviewLoading, overviewError, 
          refreshAll,
          fetchProducts, products, productsLoading, productsError,
  } = useInventory();

 useEffect(() => {
  if (store?.id) {
    fetchProducts({ storeId: store.id, type: "store" });
  }
}, [store?.id]);

  const back_btn = "/arrow.png";
  const [activeTab, setActiveTab] = useState("Overview"); 
   const [isInProductDetail, setIsInProductDetail] = useState(false);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <>
            <Dashboard/>
          </>
        );
      
      case "product":
        return (
           
          <>
            <InventoryDashboard  onProductClick={(product) => setIsInProductDetail(!!product)}/>
          </>
        );
      case "Order":
        return (
          <div className="tab-content">
            <h3>Order</h3>
            <p>No purchase data available.</p> {/* Replace with actual data */}
          </div>
        );
      case "Sales":
        return (
          <>
            < Reports/>
          </>
        );
      case "Staff":
        return (
          <>
             <StoreStaff storeID={store.id}/>
          </>
        );
      default:
        return <div className="tab-content">Select a tab to view information.</div>;
    }
  };

  return (
    <div className="div">
       {!(activeTab === "product" && isInProductDetail) && (
<section className="store-nav">
         <span className="nav-list">
            <button className="returnbtn" onClick={onClose}>< LucideArrowLeftCircle size={20} color="black"/></button>
            <ul>

              <li
                className={activeTab === "Overview" ? "active" : ""}
                onClick={() => setActiveTab("Overview")}
              >
                Overview
              </li>
              <li
                className={activeTab === "product" ? "active" : ""}
                onClick={() => setActiveTab("product")}
              >
                Product
              </li>
              <li
                className={activeTab === "Order" ? "active" : ""}
                onClick={() => setActiveTab("Order")}
              >
                Order
              </li>
              <li
                className={activeTab === "Sales" ? "active" : ""}
                onClick={() => setActiveTab("Sales")}
              >
                Sales
              </li>
              <li
                className={activeTab === "Staff" ? "active" : ""}
                onClick={() => setActiveTab("Staff")}
              >
                Staff
              </li>
            </ul>
         </span>
          <span className="storename">{store.store_name}</span>
        </section>
       )}
        

       <section className="store-contents">
         {/* Tab Content */}
         {renderTabContent()}
         {/* {showFullScreenModal && (
            <UnassignedProduct
              storeId={store.id}
              onClose={() => setShowFullScreenModal(false)}
             onSubmit={async () => {}}
            />
          )} */}

       </section>
    </div>
  );
}
