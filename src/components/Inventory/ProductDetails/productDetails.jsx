import React, { useState } from "react";
import "./productDetail.css";

import { useApi } from "../../../contexts/ApiContext";
import { ArrowLeftCircle } from "lucide-react";
import ImageUploader from "../imageUploader";
import ProfitRevenueCharts from "../../../SalesReports/SalesLineChart";
import ProductsVariants from "./productsVariants";

export default function ProductDetail({ product, onClose }) {
 
  const { uploadProductImage } = useApi();

  const stockData = [
    { storeName: "Main Branch", stock: 120 },
    { storeName: "Downtown", stock: 85 },
    { storeName: "Uptown", stock: 42 },
    { storeName: "Suburb", stock: 230 },
    { storeName: "Warehouse", stock: 500 },
    { storeName: "Warehouse", stock: 500 },
    { storeName: "Warehouse", stock: 500 },
    // add more to test scroll
  ];
  
   const variants = [
    { id: 1, title: "Variant 1", price: "$59.99", qty: "120" },
    { id: 2, title: "Variant 2", price: "$79.99" , qty: "120" },
    { id: 3, title: "Variant 3", price: "$99.99" , qty: "120" },
    { id: 4, title: "Variant 4", price: "$129.99" , qty: "120" },
      { id: 1, title: "Variant 1", price: "$59.99" , qty: "120" },
    { id: 2, title: "Variant 2", price: "$79.99", qty: "120" },
    { id: 3, title: "Variant 3", price: "$99.99", qty: "120" },
  ];

  return (
      <div className="product-detail-modal">
        <div className="product-nav">
           <button className="closebtn" onClick={onClose}>
            <ArrowLeftCircle/>
           </button>
          <ul>
            <li>
             Product Detail
            </li>
          </ul>
        </div>

       <section className="contents">
         <section className="store-product-detail">
              <div className=" product-detail">
                <ImageUploader/>
                <section className="info-section">
                  <div>
                    <span>
                      <p className="info">Product Name</p>  
                      <p>{product.product_name}</p>
                    </span>
                    <span>
                      <p className="info">Product ID</p>  
                      <p>{product.id}</p>
                    </span>
                    <span>
                      <p className="info">Product Category</p> 
                      <p>{product.category} </p>
                    </span>
                  </div>

                  <div>
                    <span>
                      <p className="info">Supplier Name: </p> 
                      <p>{product.name}</p>
                    </span>
                    <span>
                      <p className="info">Contact Number: </p>
                      <p >{product.name} 0770-957-345</p>
                    </span>
                  </div>
                </section>
              </div>

                <section className="variants-holder">
                   {variants.map((variant) => (
                <ProductsVariants key={variant.id} {...variant}/>
                 ))}
                </section>
              
            </section>

            <section className="product-store-sales">

              <span className="product-overview">
                <div className="card">
                    <h4 className="card-title">Overview</h4>
                    <div className="card-col">
                        <div  className="card-row">
                            <h4>Total Sales</h4>
                            <p>LRDS 90,000.00</p>
                        </div> 
                        <div className="card-row" >
                            <h4>Total Purchase Cost</h4>
                            <p>LRDS 19,000,000.00</p>
                        </div>
                        <div className="card-row">
                            <h4>Net Profit</h4>
                            <p>LRDS 190,000.00</p>
                        </div>
                    </div>
                    
                    <div className="card-col">
                        <div  className="card-row">
                            <h4>Total Sales</h4>
                            <p>LRDS 90,000.00</p>
                        </div> 
                        <div className="card-row" >
                            <h4>Total Purchase Cost</h4>
                            <p>LRDS 19,000,000.00</p>
                        </div>
                        <div className="card-row">
                            <h4>Net Profit</h4>
                            <p>LRDS 190,000.00</p>
                        </div>
                        <div className="card-row">
                            <h4>Net Profit</h4>
                            <p>LRDS 190,000.00</p>
                        </div>
                    </div>
                </div> 
                        <div className="sales-chart">
                            <ProfitRevenueCharts /> 
                        </div>
              
              </span>

              <span className="location-listings">
                <h3>Stock Locations</h3>

                <div className="table-wrapper">
                  <table className="stock-table">
                    <thead>
                      <tr>
                        <th className=" location">Store Name</th>
                        <th className="stock-detail">Stock at hand</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((row, idx) => (
                        <tr key={idx}>
                          <td className="location-list">{row.storeName}</td>
                          <td className="stock-value">{row.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </span>

            </section>
       </section>
      </div>
  );
}
