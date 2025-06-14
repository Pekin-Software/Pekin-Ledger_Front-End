import React, { useState } from "react";
import "./storeDetails.css"; 
import StoreStaff from "./StoreStaff";
import { useApi } from "../../../../ApiContext";

export default function StoreDetails({ store, onClose }) {
  const back_btn = "/arrow.png";
  const [activeTab, setActiveTab] = useState("Overview"); // State to track active tab

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <section className="overview-content">
            
            <section className="store-info">
              <div className="store-info-txt">
                <h3>{store.store_name} </h3>

                <div className="address">
                    <p >{store.city}, {store.country}</p>
                    <p >{store.phone_number}</p> 
                    <h4 >Manager: {store.managerName} </h4>
                </div>
               
              </div>
            </section>

            <section className="store-data-graph">
              <h3 className="sticky-heading">Revenue Graphs</h3>

              <div className="table-wrapper">
               
              </div>
            </section>

          </section>
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
          <div className="tab-content">
            <h3>Sales</h3>
            <p>No sales data available.</p> {/* Replace with actual data */}
          </div>
        );
      case "Staff":
        return (
          <div className="tab-content">
             <StoreStaff storeID={store.id}/>
          </div>
        );
      default:
        return <div className="tab-content">Select a tab to view information.</div>;
    }
  };

  return (
    <div className="store-detail-container">
      <div className="product-detail-modal">
        {/* Close Button */}
        <section className="model-ctrl">
          <button className="closebtn" onClick={onClose}><img src={back_btn} alt="Back"/></button>
        </section>

        {/* Top Navigation Bar */}
        <div className="product-nav">
          <ul>
            <li
              className={activeTab === "Overview" ? "active" : ""}
              onClick={() => setActiveTab("Overview")}
            >
              Overview
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
        </div>

       <section className="contents">
         {/* Tab Content */}
         {renderTabContent()}
       </section>
      </div>
    </div>
  );
}
