import { Store, ShoppingCart, Package, Truck } from "lucide-react";
import DonutChart from "../graphs/DonutChart";
import LowQuantityStock from "../Admin Dashboard/LowQuantityStock";
import TopSellingStock from "../Admin Dashboard/TopSellingStock";
import './Dashboard.css'

const OverviewInfo = ({ icon: Icon, title, values }) => (
  <div className="overview_info">
    <span className="info-heading">
      <Icon className="sales-icon" />
      <p>{title}</p>
    </span>
    <span className="info-txt">
      {values.map((val, i) => (
        <p key={i}>{val}</p>
      ))}
    </span>
  </div>
);

const InventoryInfo = ({ icon: Icon, value, label }) => (
  <div className="inven_info">
    <Icon className="sales-icon" />
    <p>{value}</p>
    <p>{label}</p>
  </div>
);

const Dashboard = () => {
  // ✅ Default placeholder data
  const inStoreRevenue = { LRD: 0, USD: 0 };
  const onlineRevenue = { LRD: 0, USD: 0 };
  const inventory = { available: 0, pending: 0 };

  return (
    <div className="dashboard-items">
      <div className="left-row">
        {/* Sales Overview */}
        <div className="dashboard-card sales_overview">
          <span className="overview_title">Sales Overview</span>
          <div className="overview_details">
            <OverviewInfo
              icon={Store}
              title="In-Store Sales Revenue"
              values={[
                `LRD$ ${inStoreRevenue.LRD}`,
                `USD$ ${inStoreRevenue.USD}`,
              ]}
            />
            <OverviewInfo
              icon={ShoppingCart}
              title="Online Order Revenue"
              values={[
                `LRD$ ${onlineRevenue.LRD}`,
                `USD$ ${onlineRevenue.USD}`,
              ]}
            />
          </div>
        </div>

        {/* Top Selling Stock */}
        <div className="dashboard-card top-stock-container">
          <TopSellingStock />
        </div>
      </div>

      <div className="right-row">
        {/* Order Report */}
        <div className="dashboard-card overview-graph">
          <DonutChart />
        </div>

        {/* Inventory Summary */}
        <div className="dashboard-card inventory_summary">
          <span className="inven_title">Inventory Summary</span>
          <div className="inventory-details">
            <InventoryInfo
              icon={Package}
              value={inventory.available}
              label="Available Stock"
            />
            <InventoryInfo
              icon={Truck}
              value={inventory.pending}
              label="Pending Quantity"
            />
          </div>
        </div>

        {/* Low Quantity Stock */}
        <div className="dashboard-card low-stock-qty">
          <LowQuantityStock />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;