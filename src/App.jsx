import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/Admin Dashboard/admindashboard";
import ManagerDashboard from "./components/Manager Dashboard/managerdashboard";
import CashierDashboard from "./components/Cashier Dashboard/cashierdashboard";
import Authentication from "./components/Authentications/authentication";
import Cookies from "js-cookie";
import AppProviders from "./contexts/AppProviders";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(Cookies.get("role") || null);
  const [tenant, setTenant] = useState(localStorage.getItem("tenant") || null);

  useEffect(() => {
    const role = Cookies.get("role");
    const tenant = localStorage.getItem("tenant");
    setUserRole(role);
    setTenant(tenant);

    // Navigate based on role only if role exists
    if (role) {
      switch (role) {
        case "Cashier":
          navigate("/point-of-sale");
          break;
        case "Manager":
          navigate("/store-inventory");
          break;
        case "Admin":
          navigate("/general-inventory");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  return (
    <AppProviders>
        <Routes>
          <Route path="/" element={<Authentication defaultSignIn={true} />} />
          <Route path="/signup" element={<Authentication defaultSignIn={false} />} />

          <Route
            path="/general-inventory"
            element={
              userRole === "Admin" ? <AdminDashboard /> : <Authentication defaultSignIn={true} />
            }
          />
          <Route
            path="/store-inventory"
            element={
              userRole === "Manager" ? <ManagerDashboard /> : <Authentication defaultSignIn={true} />
            }
          />
          <Route
            path="/point-of-sale"
            element={
              userRole === "Cashier" ? <CashierDashboard /> : <Authentication defaultSignIn={true} />
            }
          />
        </Routes>
    </AppProviders>
  );
}

export default App;
