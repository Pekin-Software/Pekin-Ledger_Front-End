import { useState, useEffect } from "react";
import { Bell, Search, Settings, LogOut, LayoutDashboard, Package, BarChart, Truck, ShoppingCart, Store, User } from "lucide-react";
import "./admindashboard.css";
import Stores from "./Store Dashboard/store";
import ManageStaff from "./Staff Dashboard/manageStaff";
import InventoryDashboard from "../Inventory/inventoryDashboard";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DonutChart from "../graphs/DonutChart";
import LowQuantityStock from "./LowQuantityStock";
import TopSellingStock from "./TopSellingStock";
import Reports from "../../SalesReports/reports";
import SignOutModal from "../Authentications/LogOutModal";

const logo = "/logo.jpg";

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const user = localStorage.getItem('user');

    const handleSignOut = () => {
    // Add your sign-out logic here
    alert("Signed out!");
    setShowModal(false);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulate loading time
  }, []);
  //  const refreshToken = Cookies.get("refresh_token");
   


  const renderContent = () => {
    switch (activePage) {
      case "inventory":
        return <InventoryDashboard />;
      case "store":
        return <Stores />;
      case "manageStaff":
        return <ManageStaff />;
      case "reports":
        return <Reports />;
      default:

        return (
          <>
            <div className="left-row">
              <div className="dashboard-card sales_overview">
                <span className="overview_title">Sales Overview</span>
                <div className="overview_details">
                  <div className="overview_info">
                    <span className="info-heading"><Store className="sales-icon"/><p>In-Store Sales Revenue</p></span>
                    <span className="info-txt"><p>LRD$ </p> || <p>USD$ </p></span>
                  </div>
              
                  <div className="overview_info">
                    <span className="info-heading"><ShoppingCart className="sales-icon"/><p>Online Order Revenue</p></span>
                    <span className="info-txt"><p>LRD$ </p> || <p>USD$ </p></span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card  top-stock-container">
                <TopSellingStock />
              </div> 
            </div>

            <div className="right-row">
              <div className=" dashboard-card overview-graph"> <DonutChart /></div>

              <div className="dashboard-card inventory_summary">
                <span className="inven_title">Inventory Summary</span>
                <div className="inventory-details">
                  <div className="inven_info">
                    <Package className="sales-icon"/>
                    <p>12000</p>
                     <p>Available Stock</p>
                  </div>
              
                  <div className="inven_info">
                    <Truck className="sales-icon"/>
                    <p>20000</p>
                    <p>Pending Quantity </p>
                  </div>
                </div>
              </div>

              
              <div className="dashboard-card low-stock-qty">
                <LowQuantityStock />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
       <img src={logo} alt="logo" />
        <nav className="nav-links">
          <a 
            className={activePage === "dashboard" ? "active" : ""} 
            onClick={() => setActivePage("dashboard")}
          >
            <LayoutDashboard /> Dashboard
          </a>
          <a 
            className={activePage === "inventory" ? "active" : ""} 
            onClick={() => setActivePage("inventory")}
          >
            <Package /> Inventory
          </a>
          <a 
            className={activePage === "reports" ? "active" : ""} 
            onClick={() => setActivePage("reports")}>
            
            <BarChart /> Reports</a>
          <a href="#"><Truck /> Suppliers</a>
          <a href="#"><ShoppingCart /> Orders</a>
          
          <a href="#"
            className={activePage === "store" ? "active" : ""} 
            onClick={() => setActivePage("store")}
          >
            <Store /> Manage Store
          </a>

          <a href="#"
            className={activePage === "manageStaff" ? "active" : ""} 
            onClick={() => setActivePage("manageStaff")}
          >
            <User /> Manage Staff
          </a>
        </nav>
        <div className="bottom-links">
          <a href="#" className="settings">
            <Settings /> Settings
          </a>
          <a href="#" className="logout" onClick={() => setShowModal(true)}>
            <LogOut /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="search-bar">
            <Search className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="profile-section">
            <Bell className="icon" />
            <img src="https://via.placeholder.com/40" alt="Profile" className="profile-pic" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="content-area">
          {loading ? (
            <div className="loading-placeholder">
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
              <SignOutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSignOut}
      />
      </div>
    </div>
  );
}




