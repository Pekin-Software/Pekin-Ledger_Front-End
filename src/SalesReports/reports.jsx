import {useState, useEffect, useRef} from "react";
import ProfitRevenueChart from "./SalesLineChart";
import { ChevronDownCircle } from "lucide-react";
import "./reports.css";
import { useSales } from "../contexts/reportContext";

export default function Reports() {
  
  const {
    fetchSales,
    reportOverview,
    topSellingProducts,
    bestSellingCategory,
    loading,
  } = useSales();

  useEffect(() => {
    // without store_id
    fetchSales();

    // with store_id
    // fetchSales(1);
  }, []);

  return (
    <div className="report-container">
        <div className="overview-cards">
          <div className="card">
            <h4 className="card-title">Overview</h4>

            <div className="card-col">
              <div className="card-row">
                <h4>Total Purchase Cost</h4>
                <p>LRDS {reportOverview?.Purchase_cost?.toLocaleString() || 0}</p>
              </div>

              <div className="card-row">
                <h4>Cost of Goods Sold</h4>
                <p>LRDS {reportOverview?.cogs?.toLocaleString() || 0}</p>
              </div>

              <div className="card-row">
                <h4>Sales</h4>
                <p>LRDS {reportOverview?.sales?.toLocaleString() || 0}</p>
              </div>

              <div className="card-row">
                <h4>Net Sales</h4>
                <p>LRDS {reportOverview?.net_sales?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="card-col">
              <div className="card-row">
                <h4>Revenue</h4>
                <p>LRDS {reportOverview?.revenue?.toLocaleString() || 0}</p>
              </div>

              <div className="card-row">
                <h4>Net Profit</h4>
                <p>LRDS {reportOverview?.net_profit?.toLocaleString() || 0}</p>
              </div>

              <div className="card-row">
                <h4>MoM</h4>
                <p>{reportOverview?.MoM ?? 0}%</p>
              </div>

              <div className="card-row">
                {/* <h4>YoY</h4>
                <p>{reportOverview?.YoY ?? 0}%</p> */}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="category-card">
              <h4 className="card-title">Best Selling Category</h4>

              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Turn Over</th>
                    <th>Increase By</th>
                  </tr>
                </thead>

                <tbody>
                  {bestSellingCategory?.slice(0, 3).map((item, index) => (
                    <tr key={index}>
                      <td>{item.category_name}</td>

                      <td>
                        LRDS {Number(item.turn_over || 0).toLocaleString()}
                      </td>

                      <td className={item.increase_by >= 0 ? "green" : "red"}>
                        {item.increase_by}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            
        </div>

        <div className="chart">
             <ProfitRevenueChart /> 
        </div>

        <div className="product-table">
          <h4 className="card-title head" >Best Selling Product</h4>
          
         <div className="product-list">
           <table className="product-list-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Remaining Qty</th>
                <th>Turn Over</th>
                <th>Increase By</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.slice(0, 7).map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.product_name}</td>
                  <td>{item.category}</td>
                  <td>LRD${item.price}</td>
                  <td>{item.remaining_qty}</td>
                  <td>LRD${item.today_revenue}</td>
                  <td className={item.increaseClass}>{item.increase_by}%</td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
        </div>
    </div>
  );
}